# Security notes: Daraja app

A Flutter Web bundle is public. Anyone can read the code and the bundled data, so nothing in
this app is a secret and nothing it decides is trusted.

## Built in

- **No secrets in the bundle.** Only `API_BASE_URL`, `SITE_URL` and flags are set through `--dart-define`.
- **No tokens in the browser.** The session is an httpOnly cookie (see `docs/BACKEND_CONTRACT.md`),
  so XSS cannot read it and the app has no `localStorage` code.
- **The server prices everything.** The cart holds item ids and levels only. `PaymentRequest.amountKes`
  comes back from the server.
- **M-Pesa STK push is server-side.** The app never holds Daraja API keys or a callback URL.
- **Demo backend is locked out of release builds** unless `ALLOW_FAKE_IN_RELEASE=true` is passed.
  `AppConfig.validate()` also refuses a non-HTTPS `API_BASE_URL`.
- **Input validation** in `lib/core/security/validators.dart` (email, Kenyan mobile, follower counts,
  note length) with input formatters and length caps. Server must repeat it.
- **Link allow-list.** `openExternal` opens only `https` links to listed hosts and `mailto:`.
- **Errors are generic.** Raw exceptions are never shown. Sign-in uses one message for any failure.
- **CSP + security headers** are set by `web/vercel.json` (HSTS, nosniff, frame-ancestors none,
  COOP, Permissions-Policy). The local debug page intentionally has no CSP because Flutter's
  debug loader and CanvasKit need resources that the production policy disallows.
- **No indexing.** `web/index.html` is `noindex`.
- **Payment screen** shows only a masked phone number and tells users Daraja never sees their PIN.

## Needs you before launch

- Build the server side in `docs/BACKEND_CONTRACT.md` (cookies, CSRF, rate limits, ownership checks,
  callback verification).
- Update `connect-src` in `web/vercel.json` to your real API origin.
- Build with `--no-web-resources-cdn` so CanvasKit loads from your own origin, as required by the
  production CSP. Verify the release build and response headers before launch.
- Add dependency scanning (`dart pub outdated`, Dependabot) and commit `pubspec.lock`.
- Replace sample prices in `assets/data/pricing_catalog.json`.
- Decide on password reset, sign-up and multi-factor sign-in. They are not built yet.

## Not verified here

This app was written without access to the Flutter SDK, so it has **not been compiled or run**.
Run `flutter pub get && flutter analyze && flutter test` first and expect to fix small issues.
