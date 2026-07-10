export interface MapProjectionConfig {
  transform: [number, number, number, number];
  coordinateRotation: number;
  bounds: [[number, number], [number, number]];
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
 * rescaled against the map's published `bounds` (projected through the same
 * formula) to fill the actual viewBox. See src/data/mapOverlays/*.json for the
 * per-map constants this takes.
 */
export function createWorldToPixelProjector(config: MapProjectionConfig) {
  const { transform, coordinateRotation, bounds, viewBox } = config;
  const [a, b, c, d] = transform;
  const [viewBoxWidth, viewBoxHeight] = viewBox;

  const rad = (coordinateRotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const rawProject = ({ x, z }: WorldPosition): [number, number] => {
    const rotatedX = x * cos - z * sin;
    const rotatedY = x * sin + z * cos;
    return [a * rotatedX + b, -c * rotatedY + d];
  };

  const [c1x, c1y] = rawProject({ x: bounds[0][0], z: bounds[0][1] });
  const [c2x, c2y] = rawProject({ x: bounds[1][0], z: bounds[1][1] });
  const minX = Math.min(c1x, c2x);
  const maxX = Math.max(c1x, c2x);
  const minY = Math.min(c1y, c2y);
  const maxY = Math.max(c1y, c2y);
  const scale = (viewBoxWidth / (maxX - minX) + viewBoxHeight / (maxY - minY)) / 2;
  const rawCenterX = (minX + maxX) / 2;
  const rawCenterY = (minY + maxY) / 2;

  return (position: WorldPosition): [number, number] => {
    const [rawX, rawY] = rawProject(position);
    return [(rawX - rawCenterX) * scale + viewBoxWidth / 2, (rawY - rawCenterY) * scale + viewBoxHeight / 2];
  };
}
