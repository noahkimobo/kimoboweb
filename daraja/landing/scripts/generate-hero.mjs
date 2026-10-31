// Regenerates src/assets/hero-bridge.webp from the SVG below.
// Run with: node scripts/generate-hero.mjs
// The output is WebP (not PNG) so the hero stays small; Astro then derives
// AVIF and responsive sizes from it at build time.
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const WIDTH = 1200;
const HEIGHT = 900;

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%">
      <stop offset="0" stop-color="#1B3158"/>
      <stop offset="1" stop-color="#0E1B2E"/>
    </radialGradient>
    <linearGradient id="arc" x1="0" y1="1" x2="1" y2="0">
      <stop offset="0" stop-color="#F2A93B"/>
      <stop offset="0.55" stop-color="#FFD58A"/>
      <stop offset="1" stop-color="#FFFFFF"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="16"/>
    </filter>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <path d="M170 640 C 250 180, 950 180, 1030 640" fill="none" stroke="url(#arc)" stroke-width="30" stroke-linecap="round" filter="url(#glow)" opacity="0.75"/>
  <path d="M170 640 C 250 180, 950 180, 1030 640" fill="none" stroke="url(#arc)" stroke-width="22" stroke-linecap="round"/>
  <rect x="110" y="612" width="980" height="38" rx="19" fill="url(#arc)" opacity="0.95"/>
  <rect x="110" y="650" width="980" height="6" rx="3" fill="#2B4372"/>
  <rect x="150" y="690" width="320" height="120" rx="22" fill="#16294A" stroke="#2B4372" stroke-width="3"/>
  <rect x="730" y="690" width="320" height="120" rx="22" fill="#F2A93B"/>
</svg>`;

const here = dirname(fileURLToPath(import.meta.url));
const out = resolve(here, '../src/assets/hero-bridge.webp');
await mkdir(dirname(out), { recursive: true });
await sharp(Buffer.from(svg)).webp({ quality: 82, effort: 6 }).toFile(out);
console.log(`Wrote ${out}`);
