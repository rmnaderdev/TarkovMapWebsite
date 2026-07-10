# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static site (Next.js App Router, React + TypeScript) that displays high-resolution Escape from Tarkov map images as pannable/zoomable maps. No backend — built via `output: 'export'` and served as static files by nginx in production.

## Commands

Package manager is **pnpm** (see `pnpm-lock.yaml`; the Dockerfile uses `pnpm` via corepack).

- `pnpm dev` — Next dev server on **http://localhost:3000**.
- `pnpm build` — type-checks and lints via `next build`, then statically exports to `out/`. The build fails on type errors.
- `pnpm preview` — serve the static export locally (`serve out`). `next start` does not work here since the app uses `output: 'export'`.
- `pnpm typecheck` — standalone `tsc --noEmit`.

There is no test suite or CI. `prettier` is a dependency but no format script is wired up.

## Deploy

Production is a multi-stage Docker image (Node build stage → nginx serving `out/`). See README for the canonical command:

```bash
docker buildx build --platform linux/amd64,linux/arm64 -t registry.rmnad.net/tarkov-map-website:latest --push .
```

Then redeploy in Portainer. Since static export prerenders a real HTML file per route, `nginx.conf` serves files directly (`try_files $uri $uri.html $uri/ =404`) and returns a real `404.html` for unmatched paths — no SPA index-fallback needed.

## Architecture

The whole app is driven by one data file: **`src/data/maps.ts`**. It exports the `Maps: MapDefinition[]` array — each entry pairs a name, a `link` (route path), an imported `.webp` image asset (as its `.src` string), and an optional attribution `credit`. Adding or changing a map means editing this array; nothing else needs to change.

That array fans out to a few places, so keep them in mind when touching it:
- **`src/app/[slug]/page.tsx`** is a single dynamic route shared by every map. `generateStaticParams()` derives the 9 static params directly from `Maps` (slug = `link` with the leading `/` stripped), so all map pages are still fully prerendered at build time even though there's one route file.
- **`src/components/layout/SideBar.tsx`** renders the nav list by iterating `Maps` (uses `navLinkName` for the label if present, else `name`), and highlights the active link via `usePathname()` (no built-in "exact active" helper in Next, unlike vue-router).
- **`src/components/home/MapCard.tsx`** renders each map as a thumbnail card in the home page grid.
- **`[slug]/page.tsx` → `MapContainer.tsx`** does the actual rendering.

**`MapContainer.tsx`** is the core component — a hand-written `"use client"` wrapper around the raw **`ol`** package (no React OpenLayers binding library is used). It renders a static image as a map using a **pixel-based custom projection** (`code: "xkcd-image"`, `units: "pixels"`), not a geographic one. The image is preloaded via `new Image()` inside `useEffect` to obtain natural width/height, which sets the map extent and default center. **Zoom and center are persisted to `localStorage`** keyed by the encoded map URL, so each map remembers its last view. `[slug]/page.tsx` passes `key={slug}` to force a fresh `MapContainer` per map (important — OpenLayers state does not cleanly reset otherwise; this is React's equivalent of the old Vue `:key` trick).

**State:** `src/context/SidebarContext.tsx` is the only global state — a React Context holding the sidebar open/close toggle (`isSidebarOpen`, `toggleSidebar`, `closeSidebar`). `HeaderBar.tsx` toggles it (mobile only); `SideBar.tsx` closes it on click-outside (`src/hooks/useOnClickOutside.ts`, hand-written — no external dependency for this).

**Layout:** `app/layout.tsx` → `AppShell.tsx` (`"use client"`, wraps children in `SidebarProvider`, renders `SideBar` + `HeaderBar` + `<main>{children}</main>`) → the current route's page.

**Responsive sidebar:** the sidebar is persistent/static at the `md:` breakpoint and up (no toggle, no overlay); below `md:` it's the original overlay+hamburger behavior (fixed position, `translate-x-0`/`-translate-x-full`, click-outside-to-close).

## Gotchas

- Styling is **Tailwind v3.4.x** (`tailwind.config.ts`, utility classes in JSX) with a small custom dark/military-tactical palette (`base`/`olive`/`rust` in `theme.extend.colors`) — deliberately pinned to v3, since `create-next-app` scaffolds Tailwind v4 by default.
- Map images live in `src/assets/*.webp` and are imported as ES modules in `data/maps.ts` (`import x from "@/assets/x.webp"`, then `.src` is stored as the string URL) so Next fingerprints them — don't reference them by raw path.
- **Do not use `next/image` for the OpenLayers-bound map images** — `ImageStatic`'s `url` option needs a plain string, not a rendered `<img>`. `next/image` *is* used for the home page's `MapCard` thumbnails, since those are real rendered images. `next.config.ts` sets `images: { unoptimized: true }` since Image Optimization API isn't available under static export.
- `output: 'export'` in `next.config.ts` means no server-only features (route handlers, server actions, ISR) — everything here is either a static server component or a `"use client"` component.
- The README notes this is an unmaintained hobby project; expect rough edges.
