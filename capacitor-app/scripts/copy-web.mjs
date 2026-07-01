/*
 * Copy the NeuroNourish web app into ./www so Capacitor can bundle it.
 * Only ships what the app needs at runtime — not the build scripts, the
 * reviewer packet, or the store copy.
 *
 *   node scripts/copy-web.mjs   (run automatically by `npm run sync`)
 */
import { cpSync, rmSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));      // capacitor-app/scripts
const projectRoot = join(here, "..");                     // capacitor-app
const webSrc = join(projectRoot, "..", "genenutrition-atlas");
const dest = join(projectRoot, "www");

// Runtime assets only.
const INCLUDE = [
  "index.html",
  "privacy.html",
  "support.html",
  "manifest.webmanifest",
  "sw.js",
  "css",
  "js",
  "audio",
  "icons"
];

if (!existsSync(webSrc)) {
  console.error("Cannot find web app at", webSrc);
  process.exit(1);
}

rmSync(dest, { recursive: true, force: true });
mkdirSync(dest, { recursive: true });

let copied = 0;
for (const item of INCLUDE) {
  const from = join(webSrc, item);
  if (existsSync(from)) {
    cpSync(from, join(dest, item), { recursive: true });
    copied++;
  } else {
    console.warn("  (skipped, not found):", item);
  }
}

console.log(`Copied ${copied} entries into ${dest}`);
console.log("Next: npx cap sync");
