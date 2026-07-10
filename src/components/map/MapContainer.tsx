"use client";

import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import BaseLayer from "ol/layer/Base";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import Projection from "ol/proj/Projection";
import { defaults as defaultControls } from "ol/control";
import FullScreen from "ol/control/FullScreen";
import Attribution from "ol/control/Attribution";
import Rotate from "ol/control/Rotate";
import Zoom from "ol/control/Zoom";
import ZoomSlider from "ol/control/ZoomSlider";
import "ol/ol.css";
import { MapCredit } from "@/models/MapDefinition";
import { MapOverlayData } from "@/models/MapOverlay";
import { createWorldToPixelProjector } from "@/lib/mapProjection";

interface MapContainerProps {
  mapUrl: string;
  mapCredit?: MapCredit;
  overlay?: MapOverlayData;
}

type OverlayLayerKey = "extracts" | "bosses" | "hazards" | "loot";

const OVERLAY_LAYER_LABELS: Record<OverlayLayerKey, string> = {
  extracts: "Extracts",
  bosses: "Boss zones",
  hazards: "Hazards",
  loot: "Loot",
};

const DEFAULT_VISIBLE_LAYERS: Record<OverlayLayerKey, boolean> = {
  extracts: true,
  bosses: true,
  hazards: false,
  loot: false,
};

const EXTRACT_COLORS: Record<string, string> = {
  pmc: "#8a9470",
  scav: "#d3925a",
  shared: "#c9c2a0",
};
const BOSS_COLOR = "#a3402b";
const HAZARD_COLOR = "#c99a3a";
const LOOT_COLOR = "#4a5240";

interface SelectedMarker {
  title: string;
  detail: string;
}

function markerStyle(color: string, radius: number): Style {
  return new Style({
    image: new CircleStyle({
      radius,
      fill: new Fill({ color }),
      stroke: new Stroke({ color: "rgba(0,0,0,0.6)", width: 1.5 }),
    }),
  });
}

export default function MapContainer({ mapUrl, mapCredit, overlay }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const overlayLayersRef = useRef<Partial<Record<OverlayLayerKey, VectorLayer<Feature<Point>>>>>({});
  const [visibleLayers, setVisibleLayers] =
    useState<Record<OverlayLayerKey, boolean>>(DEFAULT_VISIBLE_LAYERS);
  const [hover, setHover] = useState<{ info: SelectedMarker; x: number; y: number } | null>(null);

  useEffect(() => {
    let cancelled = false;
    let olMap: Map | null = null;

    const storedZoom = localStorage.getItem(`${encodeURIComponent(mapUrl)}_zoom`);
    const storedCenter = localStorage.getItem(`${encodeURIComponent(mapUrl)}_center`);

    const img = new Image();
    img.src = mapUrl;
    img.onload = () => {
      if (cancelled || !containerRef.current) return;

      const size: [number, number] = [img.width, img.height];
      const extent: [number, number, number, number] = [0, 0, size[0], size[1]];

      const projection = new Projection({
        code: "xkcd-image",
        units: "pixels",
        extent,
      });

      const zoom = storedZoom ? parseFloat(storedZoom) : 2.5;
      const center: [number, number] = storedCenter
        ? JSON.parse(storedCenter)
        : [size[0] / 2, size[1] / 2];

      const imgCopyright = mapCredit
        ? `Map By <a target='_blank' href="${mapCredit.creditLink}">${mapCredit.creditText}</a>`
        : undefined;

      const view = new View({
        center,
        zoom,
        projection,
      });

      const layers: BaseLayer[] = [
        new ImageLayer({
          source: new ImageStatic({
            url: mapUrl,
            imageExtent: extent,
            projection,
            attributions: imgCopyright,
          }),
        }),
      ];

      overlayLayersRef.current = {};

      if (overlay) {
        // worldToPixel returns image-space pixel coords (y=0 at top, growing down).
        // ol's ImageStatic imageExtent is [left, bottom, right, top] in map coords
        // (y=0 at bottom), so the y axis has to be flipped here.
        const worldToPixel = createWorldToPixelProjector(overlay);
        const toMapCoord = (position: { x: number; z: number }): [number, number] => {
          const [px, py] = worldToPixel(position);
          return [px, size[1] - py];
        };

        const extractsSource = new VectorSource({
          features: overlay.extracts.map((extract) => {
            const feature = new Feature({ geometry: new Point(toMapCoord(extract.position)) });
            feature.setStyle(markerStyle(EXTRACT_COLORS[extract.faction] ?? EXTRACT_COLORS.shared, 7));
            feature.set("markerInfo", {
              title: extract.name,
              detail: `${extract.faction.toUpperCase()} extract`,
            } satisfies SelectedMarker);
            return feature;
          }),
        });

        const bossZonesSource = new VectorSource({
          features: overlay.bossZones.map((zone) => {
            const feature = new Feature({ geometry: new Point(toMapCoord(zone.position)) });
            feature.setStyle(markerStyle(BOSS_COLOR, 5));
            feature.set("markerInfo", {
              title: zone.zoneName.replace(/^Zone/, ""),
              detail: `Boss spawn zone · ${zone.sides.join("/")}`,
            } satisfies SelectedMarker);
            return feature;
          }),
        });

        const hazardsSource = new VectorSource({
          features: overlay.hazards.map((hazard) => {
            const feature = new Feature({ geometry: new Point(toMapCoord(hazard.position)) });
            feature.setStyle(markerStyle(HAZARD_COLOR, 5));
            feature.set("markerInfo", {
              title: hazard.name || hazard.hazardType,
              detail: `Hazard · ${hazard.hazardType}`,
            } satisfies SelectedMarker);
            return feature;
          }),
        });

        const lootSource = new VectorSource({
          features: overlay.lootContainers.map((container) => {
            const feature = new Feature({ geometry: new Point(toMapCoord(container.position)) });
            feature.setStyle(markerStyle(LOOT_COLOR, 3));
            feature.set("markerInfo", {
              title: container.lootContainer.name,
              detail: "Loot container",
            } satisfies SelectedMarker);
            return feature;
          }),
        });

        const layerByKey: Record<OverlayLayerKey, VectorLayer<Feature<Point>>> = {
          extracts: new VectorLayer({ source: extractsSource, visible: visibleLayers.extracts }),
          bosses: new VectorLayer({ source: bossZonesSource, visible: visibleLayers.bosses }),
          hazards: new VectorLayer({ source: hazardsSource, visible: visibleLayers.hazards }),
          loot: new VectorLayer({ source: lootSource, visible: visibleLayers.loot }),
        };

        overlayLayersRef.current = layerByKey;
        layers.push(
          layerByKey.loot,
          layerByKey.hazards,
          layerByKey.bosses,
          layerByKey.extracts,
        );
      }

      olMap = new Map({
        target: containerRef.current,
        view,
        controls: defaultControls({ attribution: false, zoom: false, rotate: false }).extend([
          new FullScreen(),
          new Attribution({ collapsible: true }),
          new Rotate(),
          new Zoom(),
          new ZoomSlider(),
        ]),
        layers,
      });

      olMap.on("pointermove", (event) => {
        const feature = olMap?.forEachFeatureAtPixel(event.pixel, (f) => f, {
          hitTolerance: 6,
        });
        const info = feature?.get("markerInfo") as SelectedMarker | undefined;
        const target = olMap?.getTargetElement();
        if (target) target.style.cursor = info ? "pointer" : "";
        setHover(info ? { info, x: event.pixel[0], y: event.pixel[1] } : null);
      });

      containerRef.current.addEventListener("pointerleave", () => setHover(null));

      olMap.updateSize();

      view.on("change:center", () => {
        const newCenter = view.getCenter();
        if (!newCenter || isNaN(newCenter[0]) || isNaN(newCenter[1])) return;
        localStorage.setItem(`${encodeURIComponent(mapUrl)}_center`, JSON.stringify(newCenter));
      });

      view.on("change:resolution", () => {
        const newZoom = view.getZoom();
        if (newZoom === undefined || isNaN(newZoom)) return;
        localStorage.setItem(`${encodeURIComponent(mapUrl)}_zoom`, String(newZoom));
      });
    };

    return () => {
      cancelled = true;
      olMap?.setTarget(undefined);
      olMap = null;
      overlayLayersRef.current = {};
    };
    // visibleLayers is intentionally excluded: its initial value seeds the layers above,
    // further changes are applied directly via the toggle effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapUrl, mapCredit, overlay]);

  useEffect(() => {
    for (const key of Object.keys(visibleLayers) as OverlayLayerKey[]) {
      overlayLayersRef.current[key]?.setVisible(visibleLayers[key]);
    }
  }, [visibleLayers]);

  return (
    <div className="relative w-full flex-1">
      <div ref={containerRef} className="h-full w-full" />

      {overlay && (
        <div className="pointer-events-none absolute right-3 top-3 z-10 flex flex-col items-end gap-2">
          <div className="pointer-events-auto flex gap-1 rounded-lg border border-olive-700 bg-base-900/90 p-1">
            {(Object.keys(OVERLAY_LAYER_LABELS) as OverlayLayerKey[]).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() =>
                  setVisibleLayers((prev) => ({ ...prev, [key]: !prev[key] }))
                }
                className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
                  visibleLayers[key]
                    ? "bg-olive-600 text-white"
                    : "text-gray-300 hover:bg-base-800"
                }`}
              >
                {OVERLAY_LAYER_LABELS[key]}
              </button>
            ))}
          </div>
        </div>
      )}

      {hover && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-olive-700 bg-base-900/95 px-3 py-2 text-sm text-white"
          style={{ left: hover.x, top: hover.y - 12 }}
        >
          <div className="font-semibold">{hover.info.title}</div>
          <div className="text-xs text-gray-400">{hover.info.detail}</div>
        </div>
      )}
    </div>
  );
}
