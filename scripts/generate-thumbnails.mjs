// Home page cards only need a small preview, but the map source assets are
// full-res poster art (some 10MB+) meant for zoomed-in viewing. next/image
// can't resize them at request time because output:'export' requires
// images.unoptimized. So we pre-resize once here instead.
import { readdir, mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const THUMBNAIL_WIDTH = 800;
const SOURCE_DIRS = ["src/assets", "src/assets/maps"];
const OUT_DIR = "src/assets/thumbnails";

async function findSourceImages() {
  const files = [];
  for (const dir of SOURCE_DIRS) {
    const entries = await readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      if (!/\.(webp|svg|png|jpe?g)$/i.test(entry.name)) continue;
      files.push(path.join(dir, entry.name));
    }
  }
  return files;
}

await mkdir(OUT_DIR, { recursive: true });

const sourceFiles = await findSourceImages();
for (const sourceFile of sourceFiles) {
  const baseName = path.basename(sourceFile).replace(/\.[^.]+$/, "");
  const outFile = path.join(OUT_DIR, `${baseName}.webp`);
  await sharp(sourceFile)
    .resize({ width: THUMBNAIL_WIDTH, withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile(outFile);
  console.log(`${sourceFile} -> ${outFile}`);
}

console.log(`Generated ${sourceFiles.length} thumbnails in ${OUT_DIR}`);
