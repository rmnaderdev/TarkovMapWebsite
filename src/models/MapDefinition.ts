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
    /**
     * Older, non-to-scale poster-art renders of this same map, offered as a switchable
     * alternative to the primary (flat, overlay-capable) image. Never carry overlay data —
     * they aren't calibrated for it — so switching to one hides the overlay UI.
     */
    alternates?: MapAlternate[];
}

export interface MapAlternate {
    name: string;
    img: string;
    credit?: MapCredit;
}

export interface MapCredit {
    creditText: string;
    creditLink: string;
}