# Deploying to Vercel

The repo is already shaped for Vercel: `vercel.json` carries the SPA rewrite and
asset caching, and everything under `api/` is a Vercel serverless function.
Nothing in the codebase needs to change to deploy.

Work through this in order. Steps 1–4 use test-mode Stripe keys on purpose —
step 7 is the only place live keys appear.

## 1. Create the project

Import the repo in the Vercel dashboard. The detected settings are correct:

| Setting          | Value           |
| ---------------- | --------------- |
| Framework        | Vite            |
| Build command    | `npm run build` |
| Output directory | `dist`          |
| Install command  | `npm install`   |
| Root directory   | `./`            |

## 2. Environment variables

Set these under Settings → Environment Variables. Only the `VITE_`-prefixed
ones reach the browser bundle; the rest stay server-side.

| Variable                    | Environments        | Notes                                                         |
| --------------------------- | ------------------- | ------------------------------------------------------------- |
| `STRIPE_SECRET_KEY`         | Production, Preview | `sk_test_…` for now                                           |
| `STRIPE_WEBHOOK_SECRET`     | Production, Preview | Filled in at step 4 — the `stripe listen` value is local-only |
| `SUPABASE_URL`              | Production, Preview |                                                               |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview | Bypasses RLS. Server only, never `VITE_`-prefixed             |
| `VITE_SUPABASE_URL`         | Production, Preview | Compiled into the bundle                                      |
| `VITE_SUPABASE_ANON_KEY`    | Production, Preview | Compiled into the bundle; reads are RLS-filtered              |
| `SITE_URL`                  | Production          | The canonical origin, e.g. `https://vendsource.com`           |
| `SITE_URL`                  | Preview             | Leave unset only if you accept localhost redirects            |
| `COMMISSION_HOLD_DAYS`      | Production, Preview | Defaults to 45                                                |
| `EVENT_HASH_SALT`           | Production, Preview | Any long random string; changing it re-buckets visitors       |
| `GEMINI_API_KEY`            | Production, Preview |                                                               |

`SITE_URL` has no trailing slash — it is concatenated directly into Stripe's
`success_url` and `cancel_url`.

## 3. Domain and DNS

Add the domain under Settings → Domains, then at the registrar:

| Record  | Name  | Value                                  |
| ------- | ----- | -------------------------------------- |
| `A`     | `@`   | `216.198.79.1`                         |
| `CNAME` | `www` | `111c8c4776cff5cd.vercel-dns-017.com.` |

Vercel shows the exact values it expects on the domain screen — the CNAME target
is project-specific, and the apex IP has changed before. Prefer what the
dashboard shows over this table if they differ.

Do **not** add a registrar-level URL redirect record on `@`. Vercel already
redirects the apex to `www` over HTTPS; a registrar redirect conflicts with the
`A` record, can only offer a plaintext `http://` hop, and can break Vercel's
certificate renewal by intercepting its HTTP validation requests.

**`www` is the canonical host.** Vercel serves the site there and 308s the apex
to it, so `SITE_URL` must be `https://www.vendsourcedistribution.com` with no
trailing slash. Pointing it at the apex adds a redirect hop in the middle of
Stripe's checkout return.

## 4. Stripe webhook

The webhook is the only writer to `orders` and `commissions`, so nothing is
recorded until this is live.

Create an endpoint in the Stripe dashboard (test mode first):

- URL: `https://www.vendsourcedistribution.com/api/webhooks/stripe`
- Events — exactly these three, which are what `api/webhooks/stripe.ts` handles:
  - `checkout.session.completed` — creates the order and accrues commission
  - `charge.refunded` — reverses unpaid commission
  - `charge.dispute.created` — same, for disputes

Copy the endpoint's signing secret (`whsec_…`) into `STRIPE_WEBHOOK_SECRET` in
Vercel and redeploy. Environment variable changes do not apply to an existing
deployment.

## 5. Database

Apply `supabase/migrations/0001_portal_schema.sql` to the Supabase project the
above keys point at, if it has not been applied already.

## 6. Verify in test mode

Against the deployed domain, not localhost:

1. Load the shop and complete a checkout with card `4242 4242 4242 4242`.
2. Confirm the redirect lands on `/checkout/success` on the canonical host.
3. Check the Stripe endpoint's delivery log for a `200` on
   `checkout.session.completed`.
4. Confirm a row appears in `orders`.
5. Repeat with a rep's `?ref=` link and confirm a matching `commissions` row
   with `status = 'pending'`.
6. Refund that payment in Stripe and confirm the commission flips to
   `reversed`.

A `400` in the delivery log means the signing secret does not match the
endpoint. A `500` means the handler threw — the reason is in the Vercel
function logs, and Stripe will retry.

## 7. Go live

1. Swap `STRIPE_SECRET_KEY` to `sk_live_…`.
2. Create the webhook endpoint again in **live** mode — test and live endpoints
   are separate objects with separate signing secrets — and update
   `STRIPE_WEBHOOK_SECRET` to the live one.
3. Redeploy.
4. Run one real card through for a small amount, confirm the order row, then
   refund it and confirm the reversal.
