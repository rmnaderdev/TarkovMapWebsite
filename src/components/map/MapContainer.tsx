"use client";

import { useEffect, useRef } from "react";
import Map from "ol/Map";
import View from "ol/View";
import ImageLayer from "ol/layer/Image";
import ImageStatic from "ol/source/ImageStatic";
import Projection from "ol/proj/Projection";
import { defaults as defaultControls } from "ol/control";
import FullScreen from "ol/control/FullScreen";
import Attribution from "ol/control/Attribution";
import Rotate from "ol/control/Rotate";
import Zoom from "ol/control/Zoom";
import ZoomSlider from "ol/control/ZoomSlider";
import "ol/ol.css";
import { MapCredit } from "@/models/MapDefinition";

interface MapContainerProps {
  mapUrl: string;
  mapCredit?: MapCredit;
}

export default function MapContainer({ mapUrl, mapCredit }: MapContainerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

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
        layers: [
          new ImageLayer({
            source: new ImageStatic({
              url: mapUrl,
              imageExtent: extent,
              projection,
              attributions: imgCopyright,
            }),
          }),
        ],
      });

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
    };
  }, [mapUrl, mapCredit]);

  return <div ref={containerRef} className="w-full flex-1" />;
}
