# Backend contract

The app talks to the server only through the repository interfaces in
`lib/features/*/domain/`. Today they are backed by `lib/core/fake/`. To go live,
implement each interface against your API and select it in the matching
`*_providers.dart` file when `USE_FAKE_BACKEND` is false.

All endpoints are under `API_BASE_URL` and must be HTTPS.

## Session

- Sign-in sets a session cookie: `HttpOnly; Secure; SameSite=Lax; Path=/`.
  Scope it to `app.daraja.co.ke`. Do not use a parent-domain cookie shared with the marketing site.
- The app never reads or stores a token. Do not return one in the JSON body.
- Every state-changing request (POST, PUT, DELETE) needs CSRF protection: either
  `SameSite=Strict`, or a double-submit token header. Check the `Origin` header on the server.
- Rate-limit `POST /auth/sign-in` per account and per IP, and return the same error for an
  unknown email and a wrong password.
- CORS: allow only `https://app.daraja.co.ke`, with credentials.

| Method | Path | Purpose |
|---|---|---|
| GET | `/auth/session` | Current user, or 401 |
| POST | `/auth/sign-in` | `{email, password}` -> user, sets cookie |
| POST | `/auth/sign-out` | Clears cookie |

## Data (all scoped to the signed-in user on the server)

| Method | Path | Notes |
|---|---|---|
| GET | `/orders` | Newest first. Never trust an id from the client without an ownership check. |
| GET | `/growth` | Newest first |
| POST | `/growth` | `{platform, followersBefore, followersAfter, note}`. Repeat every validation in `Validators`. |
| GET | `/invoices` | Newest first |

## Payments (M-Pesa Daraja API)

The client sends only identifiers, never prices:

`POST /payments/stk-push` with `{phone, selections:[{itemId, level}]}`

The server must:

1. Load prices from its own catalog. Reject items with no price (quote-only).
2. Normalise the phone to `2547XXXXXXXX` / `2541XXXXXXXX`.
3. Call the Safaricom STK push endpoint using credentials kept in server-side secrets.
4. Return `{id, amountKes, maskedPhone}`.

`GET /payments/{id}` returns `{state: pending|succeeded|failed, orderId?, message?}`.

The order and invoice are created by the server **only** when Safaricom's callback confirms
payment. Verify the callback source, make the handler idempotent, and match the amount.
The app never decides that a payment succeeded.

## Pricing catalog

`assets/data/pricing_catalog.json` is bundled for display. The server must keep its own copy
as the source of truth and ignore any price from the client.
