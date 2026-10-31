// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { cases } from './src/data/cases.ts';

// The public marketing site. Keep it static: no client-side JavaScript is
// shipped unless a component explicitly opts in (none do today).
const SITE_URL = process.env.PUBLIC_SITE_URL ?? 'https://kimobofurnitures.com';

export default defineConfig({
  site: SITE_URL,
  base: '/daraja',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // The Work page is noindex until there is a real case study to show.
      filter: (page) => cases.length > 0 || !page.endsWith('/work/'),
    }),
  ],
  build: {
    // External stylesheets only, so the Content-Security-Policy can forbid
    // inline styles (see vercel.json and public/_headers).
    inlineStylesheets: 'never',
  },
  devToolbar: { enabled: false },
});
