// Fails if any text/background pair used by the site is below WCAG 2.1 AA.
// Colors are read from src/styles/global.css so there is one source of truth.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, '../src/styles/global.css'), 'utf8');

/** @type {Record<string, string>} */
const colors = {};
for (const match of css.matchAll(/--c-([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
  colors[match[1]] = match[2];
}

function channel(value) {
  const c = value / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function luminance(hex) {
  const n = parseInt(hex.slice(1), 16);
  return 0.2126 * channel((n >> 16) & 255) + 0.7152 * channel((n >> 8) & 255) + 0.0722 * channel(n & 255);
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, where it is used]
const pairs = [
  ['ink', 'paper', 'Body headings on the page'],
  ['ink', 'amber', 'Primary buttons and number badges'],
  ['white', 'ink', 'Text on dark panels and CTA band buttons'],
  ['on-dark', 'ink', 'Paragraphs on dark panels'],
  ['amber', 'ink', 'Kickers and step numbers on dark panels'],
  ['muted', 'paper', 'Secondary text on the page'],
  ['muted', 'white', 'Secondary text on cards'],
  ['muted', 'mist', 'Secondary text on mist cards'],
  ['body', 'white', 'Body text on cards'],
  ['body', 'mist', 'Body text on mist cards'],
  ['blue', 'paper', 'Eyebrow and breadcrumb text'],
  ['blue', 'white', 'Kickers on white cards'],
  ['blue', 'mist', 'Kickers on mist cards'],
  ['ink', 'mist', 'Headings on mist cards'],
];

const MIN = 4.5;
let failed = false;
for (const [fg, bg, use] of pairs) {
  if (!colors[fg] || !colors[bg]) {
    console.error(`Missing color variable for ${fg} or ${bg}`);
    failed = true;
    continue;
  }
  const value = ratio(colors[fg], colors[bg]);
  const ok = value >= MIN;
  failed ||= !ok;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${value.toFixed(2)}:1  ${fg} on ${bg}  (${use})`);
}

if (failed) {
  console.error(`\nContrast check failed: every pair must reach ${MIN}:1 (WCAG 2.1 AA).`);
  process.exit(1);
}
console.log(`\nAll ${pairs.length} pairs meet WCAG 2.1 AA (${MIN}:1).`);
