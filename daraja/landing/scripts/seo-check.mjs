// Post-build checks for SEO, accessibility and Content-Security-Policy safety.
// Run after `astro build`: node scripts/seo-check.mjs
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dist = resolve(here, '../dist');
const base = '/daraja/';

if (!existsSync(dist)) {
  console.error('dist/ not found. Run `npm run build` first.');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk(dist).filter((f) => f.endsWith('.html'));
const errors = [];
const fail = (page, message) => errors.push(`${page}: ${message}`);

function decode(text) {
  return text
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
}

function visibleText(html) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/g, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' '),
  );
}

function internalTargetExists(href) {
  const clean = href.split('#')[0].split('?')[0];
  if (clean === '') return true;
  const outputPath = clean.startsWith(base) ? clean.slice(base.length) : clean.replace(/^\/+/, '');
  const target = join(dist, outputPath);
  if (clean.endsWith('/')) return existsSync(join(target, 'index.html'));
  return existsSync(target) || existsSync(`${target}.html`);
}

for (const file of htmlFiles) {
  const page = '/' + relative(dist, file).replace(/index\.html$/, '');
  const html = readFileSync(file, 'utf8');
  const isNotFound = file.endsWith('404.html');

  // Content integrity
  if (/\bWark\b/.test(html)) fail(page, 'contains the typo "Wark" (should be "Work")');

  // Title and description
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) fail(page, 'missing <title>');
  else if (title.length > 70) fail(page, `title is ${title.length} characters (max 70)`);
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!description) fail(page, 'missing meta description');
  else if (description.length < 50 || description.length > 170)
    fail(page, `meta description is ${description.length} characters (want 50 to 170)`);

  if (!/<link rel="canonical" href="https:\/\/[^"]+"/.test(html)) fail(page, 'missing absolute canonical link');
  if (!/<html lang="[a-z]{2}/.test(html)) fail(page, 'missing <html lang>');

  // Headings: one H1, never skip a level going down.
  const levels = [...html.matchAll(/<h([1-6])[\s>]/g)].map((m) => Number(m[1]));
  const h1Count = levels.filter((l) => l === 1).length;
  if (h1Count !== 1) fail(page, `has ${h1Count} <h1> elements (want exactly 1)`);
  levels.forEach((level, i) => {
    const previous = levels[i - 1] ?? 0;
    if (level > previous + 1) fail(page, `heading level jumps from h${previous} to h${level}`);
  });

  // Images: explicit size prevents layout shift; alt is required.
  for (const tag of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\bwidth="\d+"/.test(tag) || !/\bheight="\d+"/.test(tag)) fail(page, `image without width/height: ${tag.slice(0, 80)}`);
    if (!/\balt="/.test(tag)) fail(page, `image without alt: ${tag.slice(0, 80)}`);
    if (/\.png\b/.test(tag)) fail(page, 'image served as PNG (use WebP or AVIF)');
  }

  // Content-Security-Policy safety: no inline styles or scripts.
  if (/<style[\s>]/.test(html)) fail(page, 'inline <style> element (CSP forbids it)');
  if (/\sstyle="/.test(html)) fail(page, 'inline style attribute (CSP forbids it)');
  if (/\son[a-z]+="/.test(html)) fail(page, 'inline event handler attribute');
  for (const script of html.match(/<script\b[^>]*>/g) ?? []) {
    if (!/type="application\/ld\+json"/.test(script)) fail(page, `unexpected script tag: ${script}`);
  }

  // Structured data must parse, and FAQ markup must match visible text.
  const text = visibleText(html);
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const faqBlocks = [];
  for (const block of blocks) {
    try {
      const data = JSON.parse(block[1]);
      if (data['@type'] === 'FAQPage') faqBlocks.push(data);
    } catch {
      fail(page, 'invalid JSON-LD');
    }
  }
  if (faqBlocks.length > 1) fail(page, 'more than one FAQPage block');
  for (const faq of faqBlocks) {
    for (const q of faq.mainEntity) {
      if (!text.includes(q.name)) fail(page, `FAQ question not visible on page: "${q.name}"`);
      if (!text.includes(q.acceptedAnswer.text)) fail(page, `FAQ answer not visible on page: "${q.name}"`);
    }
  }

  // Internal links resolve.
  for (const href of [...html.matchAll(/\shref="(\/[^"/][^"]*|\/)"/g)].map((m) => m[1])) {
    if (!internalTargetExists(href)) fail(page, `broken internal link ${href}`);
  }

  // Indexable pages need real body copy.
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (!noindex && !isNotFound && text.split(' ').length < 150) fail(page, 'very little text (under 150 words)');
}

// Site-level files.
const robots = join(dist, 'robots.txt');
if (!existsSync(robots)) fail('/robots.txt', 'missing');
else if (!/Sitemap:\s*https:\/\//.test(readFileSync(robots, 'utf8'))) fail('/robots.txt', 'no Sitemap line');
if (!existsSync(join(dist, 'sitemap-index.xml'))) fail('/sitemap-index.xml', 'missing');

const home = join(dist, 'index.html');
if (existsSync(home)) {
  const html = readFileSync(home, 'utf8');
  for (const heading of ['Two starting points, one company', 'What we do', 'How we work']) {
    if (!new RegExp(`<h2[^>]*>${heading}</h2>`).test(html)) fail('/', `missing <h2>${heading}</h2>`);
  }
  for (const heading of ['Migrate', 'Grow']) {
    if (!new RegExp(`<h3[^>]*>${heading}</h3>`).test(html)) fail('/', `missing <h3>${heading}</h3>`);
  }
  const h3s = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => visibleText(m[1]).trim());
  for (const name of [
    'Business Valuation & Hybrid Migration',
    'Visual Re-Branding & Graphic Design',
    'Software, M-Pesa POS & Delivery Apps',
    'Algorithmic Social Media Ads & Audits',
  ]) {
    if (!h3s.some((h) => h.endsWith(name))) fail('/', `missing <h3> for "${name}"`);
  }
  if (!/Nairobi - Online migration and social media growth/.test(html)) fail('/', 'missing localized eyebrow paragraph');
  if (!/<link rel="preload"[^>]*as="image"|fetchpriority="high"/.test(html)) fail('/', 'hero image is not prioritised');
}

console.log(`Checked ${htmlFiles.length} pages.`);
if (errors.length > 0) {
  console.error(`\n${errors.length} problem(s):`);
  for (const message of errors) console.error(`  - ${message}`);
  process.exit(1);
}
console.log('SEO, accessibility and CSP checks passed.');
