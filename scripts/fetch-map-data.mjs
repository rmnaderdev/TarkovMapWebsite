// Refreshes the committed map overlay data + SVG asset for one map from tarkov.dev.
// Re-run manually after a wipe/patch when extract/boss/hazard/loot data changes:
//   node scripts/fetch-map-data.mjs customs
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const TARKOV_DEV_GRAPHQL = "https://api.tarkov.dev/graphql";
const TARKOV_DEV_MAPS_JSON =
  "https://raw.githubusercontent.com/the-hideout/tarkov-dev/main/src/data/maps.json";

const [, , normalizedName] = process.argv;
if (!normalizedName) {
  console.error("Usage: node scripts/fetch-map-data.mjs <normalizedName>");
  console.error("Example: node scripts/fetch-map-data.mjs customs");
  process.exit(1);
}

async function graphql(query) {
  const res = await fetch(TARKOV_DEV_GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error(`tarkov.dev API error: ${JSON.stringify(json.errors)}`);
  }
  return json.data;
}

async function fetchMapData() {
  const data = await graphql(`{
    maps(lang: en) {
      normalizedName
      extracts { id name faction position { x y z } }
      spawns { position { x y z } categories sides zoneName }
      bosses { boss { name } spawnChance spawnLocations { name chance } }
      hazards { hazardType name position { x y z } top bottom }
      lootContainers { lootContainer { name normalizedName } position { x y z } }
    }
  }`);

  const map = data.maps.find((m) => m.normalizedName === normalizedName);
  if (!map) throw new Error(`No tarkov.dev map found for normalizedName "${normalizedName}"`);
  return map;
}

async function fetchMapConfig() {
  const res = await fetch(TARKOV_DEV_MAPS_JSON);
  const maps = await res.json();
  const entry = maps.find((m) => m.normalizedName === normalizedName);
  const config = entry?.maps.find((m) => m.projection === "interactive");
  if (!config) throw new Error(`No interactive map config found for "${normalizedName}"`);
  return config;
}

// Target long-edge raster size for the *interactive* map view. The SVG's own
// viewBox (the coordinate space its paths are authored in) is often tiny —
// e.g. Factory is only 130x141 units — and <img> rasterizes an SVG at exactly
// its declared width/height, with ol never re-rasterizing on zoom afterwards.
// Bumping width/height scales the vector content up for free (same paths,
// same file size) instead of shipping a blurry map.
const TARGET_LONG_EDGE = 3000;

async function fetchSvg(svgPath) {
  const res = await fetch(svgPath);
  let svg = await res.text();

  const viewBoxMatch = svg.match(/viewBox="([\d.\s-]+)"/);
  if (!viewBoxMatch) throw new Error("SVG has no viewBox — cannot determine dimensions");
  const [, , nativeWidth, nativeHeight] = viewBoxMatch[1].trim().split(/\s+/).map(Number);

  const scale = TARGET_LONG_EDGE / Math.max(nativeWidth, nativeHeight);
  const width = Math.round(nativeWidth * scale);
  const height = Math.round(nativeHeight * scale);

  // Force explicit width/height on the <svg> root (replacing any that exist)
  // so raster output size — and thus <img> naturalWidth/naturalHeight, which
  // MapContainer/mapProjection rely on — is exactly what we intend.
  svg = svg
    .replace(/<svg([^>]*)\swidth="[^"]*"/, "<svg$1")
    .replace(/<svg([^>]*)\sheight="[^"]*"/, "<svg$1")
    .replace("<svg ", `<svg width="${width}" height="${height}" `);

  return { svg, width, height };
}

const [mapData, mapConfig] = await Promise.all([fetchMapData(), fetchMapConfig()]);
const { svg, width, height } = await fetchSvg(mapConfig.svgPath);

const bossZones = mapData.spawns.filter((s) => s.categories.includes("boss"));

const overlay = {
  fetchedAt: new Date().toISOString(),
  transform: mapConfig.transform,
  coordinateRotation: mapConfig.coordinateRotation ?? 0,
  // Deliberately not using mapConfig.bounds here: it's tarkov.dev's own pan-limit
  // metadata and was found to be stale/wrong for at least one map (Terminal),
  // disjoint from where the map's real data raw-projects to. The app calibrates
  // from the actual marker positions instead — see mapProjection.ts.
  viewBox: [width, height],
  extracts: mapData.extracts,
  bossZones,
  bosses: mapData.bosses,
  hazards: mapData.hazards,
  lootContainers: mapData.lootContainers,
};

const assetsDir = path.join(process.cwd(), "src", "assets", "maps");
const dataDir = path.join(process.cwd(), "src", "data", "mapOverlays");
await mkdir(assetsDir, { recursive: true });
await mkdir(dataDir, { recursive: true });

await writeFile(path.join(assetsDir, `${normalizedName}.svg`), svg);
await writeFile(path.join(dataDir, `${normalizedName}.json`), JSON.stringify(overlay, null, 2));

console.log(`Wrote src/assets/maps/${normalizedName}.svg (${width}x${height})`);
console.log(
  `Wrote src/data/mapOverlays/${normalizedName}.json ` +
    `(${overlay.extracts.length} extracts, ${overlay.bossZones.length} boss zones, ` +
    `${overlay.hazards.length} hazards, ${overlay.lootContainers.length} loot containers)`,
);
