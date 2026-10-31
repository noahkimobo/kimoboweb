# Daraja app (Flutter Web)

The client portal for Daraja, meant to run on `app.daraja.co.ke`. The public marketing site is
the separate Astro project in `../landing`.

Screens: sign-in (informative, signed out) - new-account dashboard - active dashboard - My orders -
order detail - growth tracker (followers before and after) - services and pricing by level -
checkout with M-Pesa - order confirmed - billing - account.

> **Status:** build with Flutter Web. Run `flutter analyze` and `flutter test` after changes.

## Run

```bash
flutter pub get
flutter run -d chrome                      # demo backend is on by default in debug
```

Demo mode shows two sign-in shortcuts: a brand-new account (empty states) and an active one.
Data lives in memory and resets on reload.

## Build for production

```bash
flutter build web --release --no-web-resources-cdn \
  --dart-define=API_BASE_URL=https://api.daraja.co.ke \
  --dart-define=SITE_URL=https://daraja.co.ke
```

Without `API_BASE_URL` a release build refuses to start. Deploy `build/web` to the
`app.daraja.co.ke` subdomain. `web/vercel.json` carries the security headers and SPA rewrite.

| Define | Default | Purpose |
|---|---|---|
| `API_BASE_URL` | empty | HTTPS API origin |
| `USE_FAKE_BACKEND` | `true` in debug, `false` in release | In-memory demo data |
| `ALLOW_FAKE_IN_RELEASE` | `false` | Staging demos only |
| `SITE_URL` | `https://daraja.co.ke` | Marketing site link |

## Structure

```
lib/
  main.dart, app.dart
  core/
    config/      build-time config and root providers
    security/    validators, link allow-list, masking
    routing/     go_router, route guard, navigation shell
    theme/       brand colours and Material theme
    widgets/     shared UI (page layout, cards, empty state, chart)
    fake/        in-memory backend (delete when the API exists)
  features/<name>/
    domain/        models and repository interfaces (pure Dart)
    data/          implementations
    application/   Riverpod providers and controllers
    presentation/  screens
```

Rules: `domain` imports nothing from Flutter UI. Screens never touch a repository directly, they go
through providers. Money is whole KES in `int`. Prices come only from the server.

## Your assets

- Fonts: `assets/fonts/` (Plus Jakarta Sans, OFL licence in `OFL.txt`).
- Pricing: `assets/data/pricing_catalog.json`. Prices are samples (`"isPlaceholder": true` shows a
  banner). `null` means "request a quote". Set `isPlaceholder` to `false` once prices are real.
- Images: add to `assets/images/` and list the folder under `flutter: assets:` in `pubspec.yaml`.
- Logo: drawn in code (`core/widgets/logo.dart`). Swap in your final file when ready.

## Going live

See `docs/BACKEND_CONTRACT.md` and `SECURITY.md`.
