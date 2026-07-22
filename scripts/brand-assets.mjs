// Renders the Open Graph card and the site icons into src/app/.
//
//   npm run brand
//
// Run this when the homepage's featured divergence changes — a different
// campaign on the front page, or reworded hero copy. Restyling, layout work,
// and copy elsewhere on the site do not affect these assets.
//
// Art lives in scripts/brand-assets.html. Never hand-edit the generated files.

import { chromium } from "@playwright/test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");
const outDir = join(root, "src", "app");

// Must match the hero in src/components/home-hero.tsx.
const FEATURED = {
  wire: "From the record · NBA trade wire · New York",
  dateSolid: "December 8,",
  dateHollow: "2011",
  recorded: "David Stern vetoes the three-team Chris Paul trade for “basketball reasons.” CP3 never wears the purple and gold.",
  pitch: "The veto never comes. Chris Paul is a Laker — and every ripple after it is yours to call.",
  photo: join(root, "public", "campaign", "cp3-lakers.webp"),
};

const pageUrl = `file:///${join(here, "brand-assets.html").replace(/\\/g, "/")}`;

const browser = await chromium.launch();

async function stage(name, width, height) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto(pageUrl);
  await page.evaluate((s) => document.body.setAttribute("data-stage", s), name);
  return page;
}

// --- Open Graph card ---------------------------------------------------------
const card = await stage("card", 1200, 630);
await card.evaluate(
  ({ featured, photo }) => {
    document.getElementById("card-photo").src = photo;
    document.getElementById("card-wire").textContent = featured.wire;
    document.querySelector("[data-solid]").textContent = featured.dateSolid;
    document.querySelector("[data-hollow]").textContent = featured.dateHollow;
    document.getElementById("card-recorded").textContent = featured.recorded;
    document.getElementById("card-pitch").textContent = featured.pitch;
  },
  {
    featured: FEATURED,
    // Inline the photo so rendering never depends on a file path or the network.
    photo: `data:image/${FEATURED.photo.endsWith(".webp") ? "webp" : "jpeg"};base64,${readFileSync(FEATURED.photo).toString("base64")}`,
  },
);
await card.evaluate(() => document.fonts.ready);
await card.waitForTimeout(600);
await card.screenshot({ path: join(outDir, "opengraph-image.jpg"), type: "jpeg", quality: 92 });

// --- Icons -------------------------------------------------------------------
const icon = await stage("icon", 256, 256);
await icon.evaluate(() => document.fonts.ready);
await icon.waitForTimeout(400);
await icon.screenshot({ path: join(outDir, "icon.png"), omitBackground: true });

const apple = await stage("apple", 180, 180);
await apple.evaluate(() => document.fonts.ready);
await apple.waitForTimeout(400);
await apple.screenshot({ path: join(outDir, "apple-icon.png") });

await browser.close();

for (const file of ["opengraph-image.jpg", "icon.png", "apple-icon.png"]) {
  const kb = (readFileSync(join(outDir, file)).length / 1024).toFixed(0);
  console.log(`wrote src/app/${file.padEnd(21)} ${kb} KB`);
}
