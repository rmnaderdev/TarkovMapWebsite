# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static single-page Vue 3 app that displays high-resolution Escape from Tarkov map images as pannable/zoomable maps. No backend — everything is client-side and served as static files by nginx in production.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`; the Dockerfile uses `pnpm` via corepack).

- `pnpm dev` — Vite dev server on **https://localhost:5173** (HTTPS via `vite-plugin-mkcert`; `strictPort` so it fails rather than picking another port).
- `pnpm build` — type-checks with `vue-tsc` then builds to `dist/`. The build fails on type errors.
- `pnpm preview` — serve the production build locally.

There is no test suite, linter, or CI. `prettier` is a dependency but no format script is wired up.

## Deploy

Production is a multi-stage Docker image (Node build stage → nginx serving `dist/`). See README for the canonical command:

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t registry.rmnad.net/tarkov-map-website:latest --push .
```

Then redeploy in Portainer. `nginx.conf` uses `try_files ... /index.html` so client-side routes resolve on refresh.

## Architecture

The whole app is driven by one data file: **`src/maps.ts`**. It exports the `Maps: MapDefinition[]` array — each entry pairs a name, a `link` (route path), an imported `.webp` image asset, and an optional attribution `credit`. Adding or changing a map means editing this array; nothing else needs to change.

That array fans out to three places, so keep them in mind when touching it:
- **`src/main.ts`** generates one `vue-router` route per map (`Maps.map(...)`), passing `title`, `mapUrl`, and `credit` as route props into `MapPage.vue`. The `/` route is `Home.vue`.
- **`src/components/SideBar.vue`** renders the nav list by iterating `Maps` (uses `navLinkName` for the label if present, else `name`).
- **`MapPage.vue` → `MapContainer.vue`** does the actual rendering.

**`MapContainer.vue`** is the core component. It uses **`vue3-openlayers`** (OpenLayers wrapper) to render a static image as a map using a **pixel-based custom projection** (`code: "xkcd-image"`, `units: "pixels"`), not a geographic one. The image is preloaded via `new Image()` in `onMounted` to obtain natural width/height, which sets the map extent and default center. **Zoom and center are persisted to `localStorage`** keyed by the encoded map URL, so each map remembers its last view. `MapPage.vue` passes `:key="props.title"` to force a fresh `MapContainer` per map (important — OpenLayers state does not cleanly reset otherwise).

**State:** `src/stores/sidebar.ts` is a Pinia store holding only the sidebar open/close toggle. `HeaderBar.vue` toggles it; `SideBar.vue` closes on click-outside (`@vueuse/core`).

**Layout:** `App.vue` → `DefaultLayout.vue` (Tailwind flex shell with `SideBar` + `HeaderBar` + `<slot>`) → `<RouterView>`.

## Gotchas

- Styling is **Tailwind** (`tailwind.config.js`, utility classes in templates); there is very little custom CSS.
- Map images live in `src/assets/*.webp` and are imported as ES modules in `maps.ts` so Vite fingerprints them — don't reference them by raw path.
- Stray `.nuxt/` and `.output/` directories exist in the repo but this is **not** a Nuxt project — it's plain Vite + Vue. Ignore them.
- The README notes this is an unmaintained hobby project; expect rough edges (e.g. leftover `console.log` in `MapContainer.vue`).
