# Daraja

A company that helps Nairobi businesses move online, and helps those already online grow.

| Folder | What | Stack | Deploy to |
|---|---|---|---|
| `landing/` | Public marketing site (SEO, FAQ, services) | Astro, static, zero client JS | `daraja.co.ke` |
| `app/` | Client portal: orders, growth tracker, pricing, M-Pesa checkout, billing | Flutter Web | `app.daraja.co.ke` |

The split keeps the public pages fast and fully crawlable, while the app stays behind sign-in.

## Quick start

```bash
cd landing && npm install && npm run check    # contrast + build + SEO/CSP checks
cd ../app && flutter pub get && flutter analyze && flutter test && flutter run -d chrome
```

## Status

- `landing/`: built and checked here (11 pages, contrast, SEO and CSP checks pass).
- `app/`: syntax-checked only. The Flutter SDK was not available, so run analyze and test first.
- Placeholders to fill: real prices (`app/assets/data/pricing_catalog.json`), contact details
  (`landing/.env.example`), testimonials and case studies (`landing/src/data/`), and the backend API.

See each folder's README, and `app/SECURITY.md` before launch.
