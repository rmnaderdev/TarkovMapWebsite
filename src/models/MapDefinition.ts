import { MapOverlayData } from "./MapOverlay";

export interface MapDefinition {
    name: string;
    navLinkName?: string;
    img: string;
    /** Small pre-resized preview used on the home page grid — see scripts/generate-thumbnails.mjs */
    thumbnail: string;
    link: string;

    credit?: MapCredit;
    overlay?: MapOverlayData;
}

export interface MapCredit {
    creditText: string;
    creditLink: string;
}