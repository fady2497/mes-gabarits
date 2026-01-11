const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => /(\.png|\.jpg|\.jpeg|\.webp)$/i.test(f));
}

function normalizeId(letter, numStr) {
  const letterUp = String(letter).toUpperCase();
  const num = String(numStr).replace(/\D/g, '');
  const padded = String(parseInt(num || '0', 10)).padStart(3, '0');
  return `${letterUp}-${padded}`;
}

function buildManifest() {
  const files = listFiles(IMAGES_DIR);
  const manifest = {};
  files.forEach((file) => {
    const lower = file.toLowerCase();
    // Pattern 1: gabarit-sellerie-serie-xN-...
    let m = lower.match(/gabarit-sellerie-serie-([a-z])([0-9]+)/i);
    if (m) {
      const id = normalizeId(m[1], m[2]);
      manifest[id] = `/images/${file}`;
      return;
    }
    // Pattern 2: serieX-N.png
    m = lower.match(/serie([a-z])[-]?([0-9]+)/i);
    if (m) {
      const id = normalizeId(m[1], m[2]);
      manifest[id] = `/images/${file}`;
      return;
    }
  });
  return manifest;
}

function main() {
  const outPath = path.join(PUBLIC_DIR, 'images-manifest.json');
  const manifest = buildManifest();
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2), 'utf8');
  console.log('Images manifest generated at', outPath, 'with', Object.keys(manifest).length, 'entries');
}

main();
