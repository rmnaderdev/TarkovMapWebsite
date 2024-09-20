
import groundZeroMap from "./assets/ground_zero.webp";
import streetsOfTarkovMap from "./assets/streets_of_tarkov.webp";
import interchangeMap from "./assets/interchange.webp";
import customsMap from "./assets/customs_day.webp";
import factoryMap from "./assets/factory.webp";
import woodsMap from "./assets/woods.webp";
import reserveMap from "./assets/reserve.webp";
import lighthouseMap from "./assets/lighthouse.webp";
import shorelineMap from "./assets/shoreline.webp";
import {MapCredit, MapDefinition} from "./models/MapDefinition.ts";

const mapCredits: { [name: string]: MapCredit } = {
    "re3mr": { creditText: "RE3MR", creditLink: "https://reemr.se/" },
    "yundaz": { creditText: "Yundaz", creditLink: "https://www.reddit.com/user/MrYundaz/" },
    "vinnydiehl": { creditText: "vinnydiehl", creditLink: "https://github.com/vinnydiehl/" },
}

export const Maps: MapDefinition[] = [
    { name: "Ground Zero", img: groundZeroMap, link: "/ground_zero", credit: mapCredits["re3mr"] },
    { name: "Streets of Tarkov (fuck this map, its hot garbage)", navLinkName: "Streets of Tarkov", img: streetsOfTarkovMap, link: "/streetsoftarkov", credit: mapCredits["re3mr"] },
    { name: "Interchange", img: interchangeMap, link: "/interchange", credit: mapCredits["yundaz"] },
    { name: "Customs", img: customsMap, link: "/customs", credit: mapCredits["re3mr"] },
    { name: "Factory", img: factoryMap, link: "/factory", credit: mapCredits["vinnydiehl"] },
    { name: "Woods", img: woodsMap, link: "/woods", credit: mapCredits["re3mr"] },
    { name: "Reserve", img: reserveMap, link: "/reserve", credit: mapCredits["re3mr"] },
    { name: "Lighthouse", img: lighthouseMap, link: "/lighthouse", credit: mapCredits["re3mr"] },
    { name: "Shoreline", img: shorelineMap, link: "/shoreline", credit: mapCredits["re3mr"] },
];