export interface MapProjectionConfig {
  transform: [number, number, number, number];
  coordinateRotation: number;
  viewBox: [number, number];
}

export interface WorldPosition {
  x: number;
  z: number;
}

/**
 * Builds a function that converts tarkov.dev raw world positions (x,z) to pixel
 * coordinates on the matching flat SVG map, in the same [0,viewBoxWidth] x
 * [0,viewBoxHeight] space as the SVG's own viewBox.
 *
 * tarkov.dev's `transform`/`coordinateRotation` produce coordinates in their own
 * tile-pixel space, not the SVG's viewBox units, so the raw projection is
 * rescaled to fill the actual viewBox. That rescale is calibrated from the
 * bounding box of `calibrationPositions` — the map's own marker data — rather
 * than tarkov.dev's published `bounds` field: bounds turned out to be stale for
 * at least one map (Terminal), disjoint from where its real marker data
 * raw-projects to, which put every marker off-canvas. Calibrating from the data
 * itself is self-correcting regardless of whether that metadata is right.
 */
export function createWorldToPixelProjector(
  config: MapProjectionConfig,
  calibrationPositions: WorldPosition[],
) {
  const { transform, coordinateRotation, viewBox } = config;
  const [a, b, c, d] = transform;
  const [viewBoxWidth, viewBoxHeight] = viewBox;

  if (calibrationPositions.length === 0) {
    throw new Error("createWorldToPixelProjector requires at least one calibration position");
  }

  const rad = (coordinateRotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const rawProject = ({ x, z }: WorldPosition): [number, number] => {
    const rotatedX = x * cos - z * sin;
    const rotatedY = x * sin + z * cos;
    return [a * rotatedX + b, -c * rotatedY + d];
  };

  const rawPoints = calibrationPositions.map(rawProject);
  const xs = rawPoints.map(([x]) => x);
  const ys = rawPoints.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const scale = (viewBoxWidth / (maxX - minX) + viewBoxHeight / (maxY - minY)) / 2;
  const rawCenterX = (minX + maxX) / 2;
  const rawCenterY = (minY + maxY) / 2;

  return (position: WorldPosition): [number, number] => {
    const [rawX, rawY] = rawProject(position);
    return [(rawX - rawCenterX) * scale + viewBoxWidth / 2, (rawY - rawCenterY) * scale + viewBoxHeight / 2];
  };
}
