# NeuroNourish — web monetization guide (fastest path)

The app now ships a built-in **freemium paywall** (`js/premium.js`). All
educational and **safety** content stays **free**; only the convenience of
**unlimited audio narration** is metered — the first **3** gene narrations are
free, after which **NeuroNourish Plus** unlocks the rest.

This is the fastest way to charge money on the web because it needs **no backend**:
you create a hosted checkout link once and paste it in.

---

## ⚡ Fastest setup (≈15 minutes, no code)

### Option A — Stripe Payment Link (simple)
1. Create a Stripe account → **Payment Links** → **New link**.
2. Add a product (e.g., "NeuroNourish Plus", **$2.99/month** recurring, or a
   one-time price). Set your currency.
3. Under **After payment**, choose **Redirect** and set the URL to:
   `https://fren6332-developee.github.io/Claude/neuronourish/?plus=success`
4. Copy the payment link (looks like `https://buy.stripe.com/xxxxxxxx`).
5. In `js/premium.js`, set `CONFIG.CHECKOUT_URL` to that link (and `PRICE_LABEL`).

That's it. When a customer pays, Stripe redirects them back with `?plus=success`
and the app unlocks Plus on their device.

### Option B — Lemon Squeezy (recommended if you want taxes handled)
Lemon Squeezy is a **Merchant of Record** — it collects and remits **VAT/sales
tax** for you and issues **license keys**. Create a product + checkout, set the
same redirect URL, paste the checkout URL into `CONFIG.CHECKOUT_URL`. For real
license-key verification, see "Make it tamper-resistant" below.

> Gumroad works too and is equally quick; same idea.

---

## How the built-in paywall works

- **Free tier:** browse all 27 genes, read every plain-language explanation,
  conditions, drugs, foods, population data, and the full Safety & Sources — all
  free. The first 3 audio narrations are free.
- **Plus:** unlimited audio. Unlocked in three ways:
  1. **Checkout redirect** — returning with `?plus=success` activates Plus.
  2. **Access code** — hand buyers a code; they enter it in the paywall.
     Configure codes in `CONFIG.ACCESS_CODES` (default `NOURISH-PLUS`).
  3. It persists in `localStorage` on that device.
- **The "Plus" pill** in the header opens the paywall anytime; it shows a
  checkmark once active.

### Config (top of `js/premium.js`)
```js
CHECKOUT_URL: "https://buy.stripe.com/REPLACE_WITH_YOUR_PAYMENT_LINK",
PRICE_LABEL:  "$2.99 / month",
FREE_LISTEN_LIMIT: 3,
ACCESS_CODES: ["NOURISH-PLUS"],
```

---

## ⚠️ Security: client-side gating is bypassable

The default flow is an **honest "supporter" model** — a determined user can read
the source and unlock for free. That's a fine trade-off for launch, but if you
want real enforcement (no backend server required):

- **Lemon Squeezy license keys** — call their `license/validate` API from the app
  and only unlock on a valid, unredeemed key. (~30 lines of fetch code.)
- **Cloudflare Worker / Netlify Function** (tiny serverless) — verify the Stripe
  Checkout Session server-side and return a signed token the app trusts.

Either upgrade is a drop-in replacement for `NNPlus.checkSuccessParam()` /
`tryCode()`. Ping me and I'll wire one in.

---

## 🍎 Important: this paywall is WEB-ONLY (Apple rules)

Apple requires **In-App Purchase** for digital goods, and external payment links
inside the app are against the App Store guidelines. So the paywall
**auto-disables when the app runs inside the native (Capacitor) shell**
(`NNPlus.gatingEnabled()` returns false if `window.Capacitor` is present). For the
iOS app you'd add a StoreKit/IAP unlock instead. This keeps the same codebase safe
for both the web (Stripe) and the App Store (IAP).

Google Play is more lenient but also generally expects Play Billing for in-app
digital goods — treat the Android build the same way.

---

## 💵 Pricing & legal notes

- Suggested: **$2.99/month** or **$14.99 one-time** "lifetime" unlock. Test both.
- **Taxes:** with plain Stripe you may owe sales tax/VAT yourself; a Merchant of
  Record (Lemon Squeezy/Gumroad) removes that burden.
- **Medical/again:** you're charging for **educational** content — keep the
  disclaimers prominent (they are), don't add treatment claims, and get the
  clinical reviewer packet signed before scaling paid distribution.
