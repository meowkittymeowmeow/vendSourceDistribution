/**
 * Re-encodes everything under public/products and public/hero to WebP.
 *
 * The source photos are PNG exports with flat backgrounds and product cutouts,
 * which PNG stores badly — WebP at q82 is visually indistinguishable here and
 * roughly a third of the bytes. Run this after adding artwork, then point the
 * content JSON at the .webp path.
 *
 *   node scripts/optimize-images.mjs           # report only
 *   node scripts/optimize-images.mjs --write   # write .webp and delete sources
 */
import sharp from "sharp";
import fs from "node:fs";
import path from "node:path";

const DIRS = ["public/products", "public/hero"];
const QUALITY = 82;
const write = process.argv.includes("--write");

/*
 * Full-bleed images that need responsive variants. A phone rendering the hero
 * at 390 CSS px has no use for the 1800px master, and it is the LCP element, so
 * that is the single most expensive byte-for-byte fetch on the page.
 *
 * The hero sits under a 35% black scrim plus a gradient, which hides
 * compression artifacts — hence a lower quality than the default.
 */
const RESPONSIVE = {
  "public/hero/vending-shelf.webp": { widths: [640, 960, 1400, 1800], quality: 68 },
};

let before = 0;
let after = 0;

for (const dir of DIRS) {
  if (!fs.existsSync(dir)) continue;
  for (const file of fs.readdirSync(dir).sort()) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue;
    const src = path.join(dir, file);
    const out = src.replace(/\.(png|jpe?g)$/i, ".webp");

    const original = fs.statSync(src).size;
    // Alpha is preserved, so product cutouts keep their transparency.
    const buf = await sharp(src).webp({ quality: QUALITY, effort: 6 }).toBuffer();

    before += original;
    after += buf.length;

    const saved = (100 - (buf.length / original) * 100).toFixed(0);
    console.log(
      `${file.padEnd(32)} ${String(Math.round(original / 1024)).padStart(5)} KB -> ` +
        `${String(Math.round(buf.length / 1024)).padStart(5)} KB  -${saved}%`
    );

    if (write) {
      fs.writeFileSync(out, buf);
      fs.unlinkSync(src);
    }
  }
}

for (const [src, { widths, quality }] of Object.entries(RESPONSIVE)) {
  if (!fs.existsSync(src)) {
    console.warn(`\nSkipping responsive pass, missing: ${src}`);
    continue;
  }
  console.log(`\nResponsive variants for ${path.basename(src)}:`);
  for (const w of widths) {
    const out = src.replace(/\.webp$/, `-${w}.webp`);
    const buf = await sharp(src)
      .resize({ width: w, withoutEnlargement: true })
      .webp({ quality, effort: 6 })
      .toBuffer();
    console.log(`  ${String(w).padStart(4)}w  ${String(Math.round(buf.length / 1024)).padStart(4)} KB`);
    if (write) fs.writeFileSync(out, buf);
  }
}

const kb = n => `${Math.round(n / 1024)} KB`;
console.log(`\nTotal ${kb(before)} -> ${kb(after)}  (saves ${kb(before - after)})`);
if (!write) console.log("Dry run. Pass --write to apply.");
