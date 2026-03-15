/**
 * generate-icons.js
 * Copies pre-built icon PNGs from public/ into the Android mipmap resource dirs.
 * Run after `npx cap add android` so the android/ directory exists.
 *
 * Android adaptive icon layers:
 *   ic_launcher_foreground.png — atom on transparent background (safe-zone padded)
 *   ic_launcher_background.png — solid white background
 *   ic_launcher.png            — legacy combined icon
 *   ic_launcher_round.png      — round variant (same image)
 *
 * The foreground image has the atom centered in the inner 72/108 safe zone so
 * Android's automatic circle/squircle crop never clips the artwork.
 */

const fs = require("fs");
const path = require("path");

const DENSITIES = {
  "mipmap-mdpi":    { fg: 108, legacy: 48 },
  "mipmap-hdpi":    { fg: 162, legacy: 72 },
  "mipmap-xhdpi":   { fg: 216, legacy: 96 },
  "mipmap-xxhdpi":  { fg: 324, legacy: 144 },
  "mipmap-xxxhdpi": { fg: 432, legacy: 192 },
};

const RES_DIR = path.join(__dirname, "android", "app", "src", "main", "res");
const PUBLIC  = path.join(__dirname, "public");

// Source files built by Python during CI setup step
const FG_SRC     = path.join(PUBLIC, "ic_launcher_foreground.png"); // 432px, transparent
const LEGACY_SRC = path.join(PUBLIC, "icon-512.png");               // 512px, white bg

function ensureDir(d) {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
}

function copyFile(src, dest) {
  fs.copyFileSync(src, dest);
  console.log(`  ✓ ${path.relative(__dirname, dest)}`);
}

for (const [density] of Object.entries(DENSITIES)) {
  const dir = path.join(RES_DIR, density);
  ensureDir(dir);

  // Foreground + background (same file for all densities — Android scales as needed)
  copyFile(FG_SRC,     path.join(dir, "ic_launcher_foreground.png"));
  copyFile(LEGACY_SRC, path.join(dir, "ic_launcher_background.png")); // white = neutral bg
  copyFile(LEGACY_SRC, path.join(dir, "ic_launcher.png"));
  copyFile(LEGACY_SRC, path.join(dir, "ic_launcher_round.png"));
}

// Also write ic_launcher_background as a color XML (preferred over PNG for solid colors)
const valuesDir = path.join(RES_DIR, "values");
ensureDir(valuesDir);
const colorXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#FFFFFF</color>
</resources>
`;
fs.writeFileSync(path.join(valuesDir, "ic_launcher_background.xml"), colorXml);
console.log("  ✓ values/ic_launcher_background.xml");

// Write adaptive-icon XML
const mipmapAnydpi = path.join(RES_DIR, "mipmap-anydpi-v26");
ensureDir(mipmapAnydpi);
const adaptiveXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`;
fs.writeFileSync(path.join(mipmapAnydpi, "ic_launcher.xml"), adaptiveXml);
fs.writeFileSync(path.join(mipmapAnydpi, "ic_launcher_round.xml"), adaptiveXml);
console.log("  ✓ mipmap-anydpi-v26/ic_launcher.xml");
console.log("  ✓ mipmap-anydpi-v26/ic_launcher_round.xml");

console.log("\nIcon generation complete.");
