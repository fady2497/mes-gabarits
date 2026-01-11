const fs = require('fs');
const path = require('path');

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'images');
const BASE_URL = process.env.SITEMAP_BASE_URL || 'https://gabarits.fr';

function getImages() {
  if (!fs.existsSync(IMAGES_DIR)) return [];
  const files = fs.readdirSync(IMAGES_DIR);
  return files.filter((f) => /(\.png|\.jpg|\.jpeg|\.webp)$/i.test(f));
}

function buildSitemap() {
  const images = getImages();
  const now = new Date().toISOString();
  const lines = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">');
  // Root page with all images associated
  lines.push('  <url>');
  lines.push(`    <loc>${BASE_URL}/</loc>`);
  lines.push(`    <lastmod>${now}</lastmod>`);
  lines.push('    <priority>1.0</priority>');
  images.forEach((img) => {
    lines.push('    <image:image>');
    lines.push(`      <image:loc>${BASE_URL}/images/${img}</image:loc>`);
    lines.push(`      <image:title>${img.replace(/[-_]/g, ' ').replace(/\.[^.]+$/, '')}</image:title>`);
    lines.push('    </image:image>');
  });
  lines.push('  </url>');
  lines.push('</urlset>');
  return lines.join('\n');
}

function main() {
  if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  const sitemap = buildSitemap();
  const outPath = path.join(PUBLIC_DIR, 'sitemap.xml');
  fs.writeFileSync(outPath, sitemap, 'utf8');
  console.log('Sitemap generated at', outPath);
}

main();
