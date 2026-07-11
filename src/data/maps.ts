import groundZeroMap from "@/assets/maps/ground-zero.svg";
import streetsOfTarkovMap from "@/assets/maps/streets-of-tarkov.svg";
import interchangeMap from "@/assets/maps/interchange.svg";
import customsMap from "@/assets/maps/customs.svg";
import factoryMap from "@/assets/maps/factory.svg";
import woodsMap from "@/assets/maps/woods.svg";
import reserveMap from "@/assets/maps/reserve.svg";
import lighthouseMap from "@/assets/maps/lighthouse.svg";
import shorelineMap from "@/assets/maps/shoreline.svg";
import terminalMap from "@/assets/maps/terminal.jpg";
import icebreakerMap from "@/assets/maps/icebreaker.jpg";
import labsMap from "@/assets/maps/labs.jpg";
import labyrinthMap from "@/assets/maps/labyrinth.jpg";
import groundZeroPoster from "@/assets/ground_zero.webp";
import customsDayPoster from "@/assets/customs_day.webp";
import customsNightPoster from "@/assets/customs_night.webp";
import factoryPoster from "@/assets/factory.webp";
import interchangePoster from "@/assets/interchange.webp";
import lighthousePoster from "@/assets/lighthouse.webp";
import reservePoster from "@/assets/reserve.webp";
import shorelinePoster from "@/assets/shoreline.webp";
import shorelineResortPoster from "@/assets/shoreline_resort.webp";
import streetsOfTarkovPoster from "@/assets/streets_of_tarkov.webp";
import woodsPoster from "@/assets/woods.webp";
import groundZeroThumb from "@/assets/thumbnails/ground-zero.webp";
import streetsOfTarkovThumb from "@/assets/thumbnails/streets-of-tarkov.webp";
import interchangeThumb from "@/assets/thumbnails/interchange.webp";
import customsThumb from "@/assets/thumbnails/customs.webp";
import factoryThumb from "@/assets/thumbnails/factory.webp";
import woodsThumb from "@/assets/thumbnails/woods.webp";
import reserveThumb from "@/assets/thumbnails/reserve.webp";
import lighthouseThumb from "@/assets/thumbnails/lighthouse.webp";
import shorelineThumb from "@/assets/thumbnails/shoreline.webp";
import terminalThumb from "@/assets/thumbnails/terminal.webp";
import icebreakerThumb from "@/assets/thumbnails/icebreaker.webp";
import labsThumb from "@/assets/thumbnails/labs.webp";
import labyrinthThumb from "@/assets/thumbnails/labyrinth.webp";
import { MapCredit, MapDefinition } from "@/models/MapDefinition";
import groundZeroOverlay from "@/data/mapOverlays/ground-zero.json";
import streetsOfTarkovOverlay from "@/data/mapOverlays/streets-of-tarkov.json";
import interchangeOverlay from "@/data/mapOverlays/interchange.json";
import customsOverlay from "@/data/mapOverlays/customs.json";
import factoryOverlay from "@/data/mapOverlays/factory.json";
import woodsOverlay from "@/data/mapOverlays/woods.json";
import reserveOverlay from "@/data/mapOverlays/reserve.json";
import lighthouseOverlay from "@/data/mapOverlays/lighthouse.json";
import shorelineOverlay from "@/data/mapOverlays/shoreline.json";
import { MapOverlayData } from "@/models/MapOverlay";

// Overlay markers (extracts/bosses/hazards/loot) are temporarily disabled site-wide
// while calibration issues are sorted out. Flip back to true to re-enable — data and
// component logic are untouched, this just stops MapContainer from rendering it.
const OVERLAYS_ENABLED = false;

const mapCredits: { [name: string]: MapCredit } = {
  shebuka: {
    creditText: "Shebuka (CC BY-NC-SA 4.0)",
    creditLink: "https://github.com/the-hideout/tarkov-dev-svg-maps/",
  },
  re3mr: { creditText: "RE3MR", creditLink: "https://reemr.se/" },
  monkimonkimonk: {
    creditText: "monkimonkimonk",
    creditLink: "https://www.reddit.com/user/monkimonkimonk/",
  },
  yundaz: {
    creditText: "Yundaz",
    creditLink: "https://www.reddit.com/user/MrYundaz/",
  },
  vinnydiehl: {
    creditText: "vinnydiehl",
    creditLink: "https://github.com/vinnydiehl/",
  },
};

export const Maps: MapDefinition[] = [
  {
    name: "Ground Zero",
    img: groundZeroMap.src,
    thumbnail: groundZeroThumb.src,
    link: "/ground_zero",
    credit: mapCredits["shebuka"],
    overlay: OVERLAYS_ENABLED ? (groundZeroOverlay as unknown as MapOverlayData) : undefined,
    alternates: [{ name: "Poster art", img: groundZeroPoster.src, credit: mapCredits["re3mr"] }],
  },
  {
    name: "Streets of Tarkov",
    navLinkName: "Streets of Tarkov",
    img: streetsOfTarkovMap.src,
    thumbnail: streetsOfTarkovThumb.src,
    link: "/streetsoftarkov",
    credit: mapCredits["shebuka"],
    overlay: OVERLAYS_ENABLED ? (streetsOfTarkovOverlay as unknown as MapOverlayData) : undefined,
    alternates: [{ name: "Poster art", img: streetsOfTarkovPoster.src, credit: mapCredits["re3mr"] }],
  },
  {
    name: "Interchange",
    img: interchangeMap.src,
    thumbnail: interchangeThumb.src,
    link: "/interchange",
    credit: mapCredits["shebuka"],
    overlay: OVERLAYS_ENABLED ? (interchangeOverlay as unknown as MapOverlayData) : undefined,
    alternates: [{ name: "Poster art", img: interchangePoster.src, credit: mapCredits["yundaz"] }],
  },
  {
    name: "Customs",
    img: customsMap.src,
    thumbnail: customsThumb.src,
    link: "/customs",
    credit: mapCredits["shebuka"],
    overlay: OVERLAYS_ENABLED ? (customsOverlay as unknown as MapOverlayData) : undefined,
    alternates: [
      { name: "Poster art (Day)", img: customsDayPoster.src, credit: mapCredits["re3mr"] },
      { name: "Poster art (Night)", img: customsNightPoster.src, credit: mapCredits["re3mr"] },
    ],
  },
  {
    name: "Factory",
    img: factoryMap.src,
    thumbnail: factoryThumb.src,
    link: "/factory",
    credit: mapCredits["shebuka"],
    overlay: OVERLAYS_ENABLED ? (factoryOverlay as unknown as MapOverlayData) : undefined,
    alternates: [{ name: "Poster art", img: factoryPoster.src, credit: mapCredits["vinnydiehl"] }],
  },
  {
    name: "Woods",
    img: woodsMap.src,
    thumbnail: woodsThumb.src,
    link: "/woods",
    credit: mapCredits["shebuka"],
    overlay: OVERLAYS_ENABLED ? (woodsOverlay as unknown as MapOverlayData) : undefined,
    alternates: [{ name: "Poster art", img: woodsPoster.src, credit: mapCredits["re3mr"] }],
  },
  {
    name: "Reserve",
    img: reserveMap.src,
    thumbnail: reserveThumb.src,
    link: "/reserve",
    credit: mapCredits["shebuka"],
    overlay: OVERLAYS_ENABLED ? (reserveOverlay as unknown as MapOverlayData) : undefined,
    alternates: [{ name: "Poster art", img: reservePoster.src, credit: mapCredits["re3mr"] }],
  },
  {
    name: "Lighthouse",
    img: lighthouseMap.src,
    thumbnail: lighthouseThumb.src,
    link: "/lighthouse",
    credit: mapCredits["shebuka"],
    overlay: OVERLAYS_ENABLED ? (lighthouseOverlay as unknown as MapOverlayData) : undefined,
    alternates: [{ name: "Poster art", img: lighthousePoster.src, credit: mapCredits["re3mr"] }],
  },
  {
    name: "Shoreline",
    img: shorelineMap.src,
    thumbnail: shorelineThumb.src,
    link: "/shoreline",
    credit: mapCredits["shebuka"],
    overlay: OVERLAYS_ENABLED ? (shorelineOverlay as unknown as MapOverlayData) : undefined,
    alternates: [
      { name: "Poster art (Classic)", img: shorelinePoster.src, credit: mapCredits["re3mr"] },
      { name: "Poster art (Resort)", img: shorelineResortPoster.src, credit: mapCredits["re3mr"] },
    ],
  },
  {
    name: "Terminal",
    img: terminalMap.src,
    thumbnail: terminalThumb.src,
    link: "/terminal",
    credit: mapCredits["re3mr"],
    // No overlay: tarkov.dev's calibration data for this (very new) map is
    // internally inconsistent — bounds, marker-data extent, and the community's
    // manual corner-reference points all disagree under every transform/rotation
    // tried. Revisit with `pnpm fetch:map-data terminal` once upstream matures.
  },
  {
    name: "Icebreaker",
    img: icebreakerMap.src,
    thumbnail: icebreakerThumb.src,
    link: "/icebreaker",
    credit: mapCredits["re3mr"],
    // No overlay: tarkov.dev has no calibrated position data for this map at all.
  },
  {
    name: "The Lab",
    navLinkName: "The Lab",
    img: labsMap.src,
    thumbnail: labsThumb.src,
    link: "/labs",
    credit: mapCredits["monkimonkimonk"],
    // No overlay: tarkov.dev only has a tile-pyramid render for this map (no flat
    // SVG/image), incompatible with the single-image approach every other map uses.
  },
  {
    name: "The Labyrinth",
    navLinkName: "The Labyrinth",
    img: labyrinthMap.src,
    thumbnail: labyrinthThumb.src,
    link: "/labyrinth",
    credit: mapCredits["re3mr"],
    // No overlay: same tile-pyramid limitation as The Lab.
  },
];
