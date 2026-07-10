import groundZeroMap from "@/assets/ground_zero.webp";
import streetsOfTarkovMap from "@/assets/streets_of_tarkov.webp";
import interchangeMap from "@/assets/interchange.webp";
import customsMap from "@/assets/maps/customs.svg";
import factoryMap from "@/assets/factory.webp";
import woodsMap from "@/assets/woods.webp";
import reserveMap from "@/assets/reserve.webp";
import lighthouseMap from "@/assets/lighthouse.webp";
import shorelineMap from "@/assets/shoreline.webp";
import groundZeroThumb from "@/assets/thumbnails/ground_zero.webp";
import streetsOfTarkovThumb from "@/assets/thumbnails/streets_of_tarkov.webp";
import interchangeThumb from "@/assets/thumbnails/interchange.webp";
import customsThumb from "@/assets/thumbnails/customs.webp";
import factoryThumb from "@/assets/thumbnails/factory.webp";
import woodsThumb from "@/assets/thumbnails/woods.webp";
import reserveThumb from "@/assets/thumbnails/reserve.webp";
import lighthouseThumb from "@/assets/thumbnails/lighthouse.webp";
import shorelineThumb from "@/assets/thumbnails/shoreline.webp";
import { MapCredit, MapDefinition } from "@/models/MapDefinition";
import customsOverlay from "@/data/mapOverlays/customs.json";
import { MapOverlayData } from "@/models/MapOverlay";

const mapCredits: { [name: string]: MapCredit } = {
  re3mr: { creditText: "RE3MR", creditLink: "https://reemr.se/" },
  yundaz: {
    creditText: "Yundaz",
    creditLink: "https://www.reddit.com/user/MrYundaz/",
  },
  vinnydiehl: {
    creditText: "vinnydiehl",
    creditLink: "https://github.com/vinnydiehl/",
  },
  shebuka: {
    creditText: "Shebuka (CC BY-NC-SA 4.0)",
    creditLink: "https://github.com/the-hideout/tarkov-dev-svg-maps/",
  },
};

export const Maps: MapDefinition[] = [
  {
    name: "Ground Zero",
    img: groundZeroMap.src,
    thumbnail: groundZeroThumb.src,
    link: "/ground_zero",
    credit: mapCredits["re3mr"],
  },
  {
    name: "Streets of Tarkov",
    navLinkName: "Streets of Tarkov",
    img: streetsOfTarkovMap.src,
    thumbnail: streetsOfTarkovThumb.src,
    link: "/streetsoftarkov",
    credit: mapCredits["re3mr"],
  },
  {
    name: "Interchange",
    img: interchangeMap.src,
    thumbnail: interchangeThumb.src,
    link: "/interchange",
    credit: mapCredits["yundaz"],
  },
  {
    name: "Customs",
    img: customsMap.src,
    thumbnail: customsThumb.src,
    link: "/customs",
    credit: mapCredits["shebuka"],
    overlay: customsOverlay as MapOverlayData,
  },
  {
    name: "Factory",
    img: factoryMap.src,
    thumbnail: factoryThumb.src,
    link: "/factory",
    credit: mapCredits["vinnydiehl"],
  },
  {
    name: "Woods",
    img: woodsMap.src,
    thumbnail: woodsThumb.src,
    link: "/woods",
    credit: mapCredits["re3mr"],
  },
  {
    name: "Reserve",
    img: reserveMap.src,
    thumbnail: reserveThumb.src,
    link: "/reserve",
    credit: mapCredits["re3mr"],
  },
  {
    name: "Lighthouse",
    img: lighthouseMap.src,
    thumbnail: lighthouseThumb.src,
    link: "/lighthouse",
    credit: mapCredits["re3mr"],
  },
  {
    name: "Shoreline",
    img: shorelineMap.src,
    thumbnail: shorelineThumb.src,
    link: "/shoreline",
    credit: mapCredits["re3mr"],
  },
];
