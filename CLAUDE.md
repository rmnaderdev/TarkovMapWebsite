# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static site (Next.js App Router, React + TypeScript) that displays high-resolution Escape from Tarkov map images as pannable/zoomable maps, with a live extract/boss/hazard/loot overlay sourced from the tarkov.dev API. No backend — built via `output: 'export'` and served as static files by nginx in production.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`; the Dockerfile uses `pnpm` via corepack).

- `pnpm dev` — Next dev server on **http://localhost:3000**.
- `pnpm build` — type-checks and lints via `next build`, then statically exports to `out/`. The build fails on type errors.
- `pnpm preview` — serve the static export locally (`serve out`). `next start` does not work here since the app uses `output: 'export'`.
- `pnpm typecheck` — standalone `tsc --noEmit`.
- `pnpm fetch:map-data <normalizedName>` — refreshes one map's SVG asset + overlay JSON from tarkov.dev (e.g. `pnpm fetch:map-data customs`). Re-run per map after a wipe/patch changes extracts/bosses/hazards/loot. `<normalizedName>` is tarkov.dev's own slug, not this repo's route slug — see the map list in `src/data/maps.ts` for the mapping (e.g. our `/ground_zero` is tarkov.dev's `ground-zero`).
- `pnpm generate:thumbnails` — re-derives every home-page thumbnail in `src/assets/thumbnails/` from the current map sources. Re-run after `fetch:map-data` touches an SVG, or after adding a new map source image.

There is no test suite or CI. `prettier` is a dependency but no format script is wired up.

## Deploy

Production is a multi-stage Docker image (Node build stage → nginx serving `out/`). See README for the canonical command:

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t registry.rmnad.net/tarkov-map-website:latest --push .
```

Then redeploy in Portainer. Since static export prerenders a real HTML file per route, `nginx.conf` serves files directly (`try_files $uri $uri.html $uri/ =404`) and returns a real `404.html` for unmatched paths — no SPA index-fallback needed.

## Architecture

The whole app is driven by one data file: **`src/data/maps.ts`**. It exports the `Maps: MapDefinition[]` array — each entry pairs a name, a `link` (route path), an imported map image asset (as its `.src` string), a small `thumbnail` image, an optional attribution `credit`, and an optional `overlay` (extract/boss/hazard/loot data). Adding or changing a map means editing this array; nothing else needs to change.

That array fans out to a few places, so keep them in mind when touching it:
- **`src/app/[slug]/page.tsx`** is a single dynamic route shared by every map. `generateStaticParams()` derives the static params directly from `Maps` (slug = `link` with the leading `/` stripped), so all map pages are still fully prerendered at build time even though there's one route file.
- **`src/components/layout/SideBar.tsx`** renders the nav list by iterating `Maps` (uses `navLinkName` for the label if present, else `name`), and highlights the active link via `usePathname()` (no built-in "exact active" helper in Next, unlike vue-router).
- **`src/components/home/MapCard.tsx`** renders each map as a thumbnail card in the home page grid, using `map.thumbnail` (never `map.img` — see Gotchas).
- **`[slug]/page.tsx` → `MapContainer.tsx`** does the actual rendering.

**`MapContainer.tsx`** is the core component — a hand-written `"use client"` wrapper around the raw **`ol`** package (no React OpenLayers binding library is used). It renders a static image as a map using a **pixel-based custom projection** (`code: "xkcd-image"`, `units: "pixels"`), not a geographic one. The image is preloaded via `new Image()` inside `useEffect` to obtain natural width/height, which sets the map extent and default center. **Zoom and center are persisted to `localStorage`** keyed by the encoded map URL, so each map remembers its last view. `[slug]/page.tsx` passes `key={slug}` to force a fresh `MapContainer` per map (important — OpenLayers state does not cleanly reset otherwise; this is React's equivalent of the old Vue `:key` trick).

### Live overlay (extracts / bosses / hazards / loot)

Most maps ship a flat, to-scale, top-down SVG (not the old hand-illustrated posters — see Gotchas) plus a live data overlay pulled from **tarkov.dev's public GraphQL API** (`https://api.tarkov.dev/graphql`, no auth). Icebreaker, Terminal, The Lab, and The Labyrinth are the exceptions — `MapDefinition.overlay` is `undefined` for them and `MapContainer` just renders the plain image with no marker layers, no toggle bar:
  - Icebreaker has no calibrated position data on tarkov.dev at all.
  - The Lab/Labyrinth only exist there as multi-zoom tile pyramids, not a single flat image — incompatible with the approach below without a tile-stitching step nobody's asked for yet.
  - Terminal *does* have a flat SVG and marker data, but as a very new map its calibration is unfinished upstream: tarkov.dev's `bounds`, the marker data's own extent, and a community-contributed corner-reference file (`maps_static.json`) all disagree with each other under every transform/rotation combination tried — not a bug fixable on this end, revisit with `pnpm fetch:map-data terminal` once tarkov.dev's data matures.

  The pipeline for the maps that do have it:

1. **`scripts/fetch-map-data.mjs`** (run via `pnpm fetch:map-data <normalizedName>`) queries tarkov.dev for one map's extracts, boss spawn zones, boss spawn-chance text, hazards, and loot containers, and also pulls that map's `transform`/`coordinateRotation` calibration constants from tarkov-dev's own frontend repo (`the-hideout/tarkov-dev`, `src/data/maps.json` — MIT-licensed code, just describing the SVG asset). It writes the SVG to `src/assets/maps/<name>.svg` and the overlay data to `src/data/mapOverlays/<name>.json`.
2. **`src/lib/mapProjection.ts`** (`createWorldToPixelProjector`) converts tarkov.dev's raw in-game (x, z) world coordinates into pixel coordinates on that SVG, using the same scale/rotation transform tarkov.dev's own site uses internally. The raw transform output is in tarkov.dev's own tile-pixel space, not the SVG's viewBox units, so the function takes a list of the map's own marker positions and rescales against *their* bounding box to fill the actual `viewBox`. This intentionally does not use tarkov.dev's published `bounds` field — that turned out to be stale/wrong for Terminal (see above), disjoint from where the map's real marker data raw-projects to. Calibrating from the actual data is self-correcting regardless of whether that metadata is trustworthy — see the function's docstring before touching this math, it was arrived at by trial and error against rendered calibration checks, not derived from docs.
3. **`MapContainer.tsx`** builds one `ol/layer/Vector` per overlay type (extracts/bosses/hazards/loot) from that projected data, styled with the site's olive/rust palette. A toggle bar (top-right) shows/hides each layer; hovering a marker shows a floating tooltip (name + type) that follows the cursor — no click needed.
4. Data only changes on wipes/game patches, so it's fetched once and committed, **not** fetched at request/build time (this is a static-export site with no backend).

**State:** `src/context/SidebarContext.tsx` is the only global state — a React Context holding the sidebar open/close toggle (`isSidebarOpen`, `toggleSidebar`, `closeSidebar`). `HeaderBar.tsx` toggles it (mobile only); `SideBar.tsx` closes it on click-outside (`src/hooks/useOnClickOutside.ts`, hand-written — no external dependency for this).

**Layout:** `app/layout.tsx` → `AppShell.tsx` (`"use client"`, wraps children in `SidebarProvider`, renders `SideBar` + `HeaderBar` + `<main>{children}</main>`) → the current route's page.

**Responsive sidebar:** the sidebar is persistent/static at the `md:` breakpoint and up (no toggle, no overlay); below `md:` it's the original overlay+hamburger behavior (fixed position, `translate-x-0`/`-translate-x-full`, click-outside-to-close).

## Gotchas

- Styling is **Tailwind v3.4.x** (`tailwind.config.ts`, utility classes in JSX) with a small custom dark/military-tactical palette (`base`/`olive`/`rust` in `theme.extend.colors`) — deliberately pinned to v3, since `create-next-app` scaffolds Tailwind v4 by default.
- Map images live in `src/assets/maps/*` (full-res, used by `MapContainer` — `.svg` where tarkov.dev has one, `.jpg` poster fallback for Icebreaker/Labs/Labyrinth) and `src/assets/thumbnails/*.webp` (small, used by `MapCard`) — both are imported as ES modules in `data/maps.ts` (`import x from "@/assets/..."`, then `.src` is stored as the string URL) so Next fingerprints them. Don't reference either by raw path, and don't point `MapCard` at the full `img` — the home page grid used to load full-res posters (one was 10MB) and was unusably slow; `thumbnail` exists specifically to avoid that.
- **The SVG's `width`/`height` attributes control the raster resolution `<img>`/`ol` actually renders at — the `viewBox` alone does not.** `fetch-map-data.mjs` deliberately overwrites tarkov.dev's original (often tiny — Factory's native viewBox is only 130x141) width/height with a ~3000px-long-edge value while leaving the `viewBox` and all path data untouched, so the map stays crisp at zoom without growing the file (it's still just vector paths — same byte size either way). `ol` rasterizes the image once on load and never re-rasterizes on zoom, so this is the only lever for map sharpness; don't let a future data refresh drop it back to native SVG units.
- The flat SVG maps are **CC BY-NC-SA 4.0** (author Shebuka, `the-hideout/tarkov-dev-svg-maps`) — non-commercial, attribution, share-alike. The site's non-commercial hobby status makes this fine, but don't add ads/monetization without revisiting this, and keep the `mapCredits.shebuka` attribution intact in `data/maps.ts`. (The old poster-art maps from re3mr/yundaz/vinnydiehl were replaced by these for every map — they weren't geometrically accurate enough to place data markers on. Their source images are still sitting, unreferenced, directly under `src/assets/*.webp` — `src/assets/maps/` and `src/assets/thumbnails/` are the ones actually in use now. Safe to delete once someone confirms they're not wanted for anything else.)
- **Do not use `next/image` for the OpenLayers-bound map images** — `ImageStatic`'s `url` option needs a plain string, not a rendered `<img>`. `next/image` *is* used for the home page's `MapCard` thumbnails, since those are real rendered images. `next.config.ts` sets `images: { unoptimized: true }` since Image Optimization API isn't available under static export — this is also why thumbnails have to be pre-resized by `generate-thumbnails.mjs` instead of resized on the fly.
- `output: 'export'` in `next.config.ts` means no server-only features (route handlers, server actions, ISR) — everything here is either a static server component or a `"use client"` component.
- The README notes this is an unmaintained hobby project; expect rough edges.
