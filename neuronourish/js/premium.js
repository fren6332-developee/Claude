/* ============================================================
   NeuroNourish Plus — lightweight web monetization (freemium)
   ------------------------------------------------------------
   Fastest path: a no-backend paywall. All educational and SAFETY
   content stays FREE; only the convenience of unlimited audio
   narration is metered (first few gene narrations are free, then
   "Plus" unlocks the rest).

   IMPORTANT — iOS: Apple requires In-App Purchase for digital goods,
   and external payment links inside the app are against the rules.
   So this web paywall AUTO-DISABLES when the app runs inside the
   native (Capacitor) shell — the iOS build should use StoreKit/IAP
   instead. See store/MONETIZATION.md.

   SECURITY NOTE: client-side gating is convenient but bypassable by
   a determined user. It's an honest "supporter" model for a wellness
   reference. For robust entitlement, verify purchases with a tiny
   serverless function or a Merchant-of-Record license key — the
   guide in store/MONETIZATION.md shows how.
   ============================================================ */
(function () {
  "use strict";

  const CONFIG = {
    // 1) Paste your Stripe Payment Link OR Lemon Squeezy checkout URL here.
    //    (Create it in the dashboard — no code. See store/MONETIZATION.md.)
    CHECKOUT_URL: "https://buy.stripe.com/REPLACE_WITH_YOUR_PAYMENT_LINK",
    PRICE_LABEL:  "$2.99 / month",           // display only; real price is set in checkout
    FREE_LISTEN_LIMIT: 3,                      // free gene narrations before Plus is needed
    // 2) Optional manual unlock codes you can hand to purchasers (or leave as-is).
    ACCESS_CODES: ["NOURISH-PLUS"],
    // 3) After a successful checkout, redirect back to the app with this query flag
    //    (set the redirect URL in your Stripe/Lemon Squeezy checkout settings):
    //    https://…/neuronourish/?plus=success
    SUCCESS_PARAM: "plus",
    SUCCESS_VALUE: "success"
  };

  const LS_ACTIVE = "nn_plus_active";
  const LS_FREE   = "nn_free_listens";

  const isNative = !!(window.Capacitor &&
    (typeof window.Capacitor.isNativePlatform === "function"
      ? window.Capacitor.isNativePlatform() : true));

  function ls(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function setLs(key, v) { try { localStorage.setItem(key, v); } catch (e) {} }

  const NNPlus = {
    // On native (iOS/Android) we don't run the web paywall at all.
    gatingEnabled() { return !isNative; },
    active() { return ls(LS_ACTIVE) === "1"; },

    freeListened() {
      try { return JSON.parse(ls(LS_FREE) || "[]"); } catch (e) { return []; }
    },
    remaining() {
      return Math.max(0, CONFIG.FREE_LISTEN_LIMIT - this.freeListened().length);
    },

    // May this gene's audio play?
    canListen(symbol) {
      if (!this.gatingEnabled() || this.active()) return true;
      const arr = this.freeListened();
      return arr.includes(symbol) || arr.length < CONFIG.FREE_LISTEN_LIMIT;
    },
    recordListen(symbol) {
      if (!this.gatingEnabled() || this.active()) return;
      const arr = this.freeListened();
      if (!arr.includes(symbol)) { arr.push(symbol); setLs(LS_FREE, JSON.stringify(arr)); }
      this.updateBadge();
    },

    activate() { setLs(LS_ACTIVE, "1"); this.updateBadge(); this.closePaywall(); },
    tryCode(code) {
      const norm = String(code || "").trim().toUpperCase();
      if (CONFIG.ACCESS_CODES.map(c => c.toUpperCase()).includes(norm)) { this.activate(); return true; }
      return false;
    },
    // If we returned from a successful checkout, unlock and clean the URL.
    checkSuccessParam() {
      try {
        const u = new URL(window.location.href);
        if (u.searchParams.get(CONFIG.SUCCESS_PARAM) === CONFIG.SUCCESS_VALUE) {
          this.activate();
          u.searchParams.delete(CONFIG.SUCCESS_PARAM);
          window.history.replaceState({}, "", u.toString());
        }
      } catch (e) {}
    },

    /* ---------- UI ---------- */
    updateBadge() {
      const btn = document.getElementById("plusBtn");
      if (!btn) return;
      if (!this.gatingEnabled()) { btn.hidden = true; return; }
      btn.hidden = false;
      const lbl = btn.querySelector(".plus-label");
      if (this.active()) { btn.classList.add("is-active"); if (lbl) lbl.textContent = "Plus ✓"; }
      else { btn.classList.remove("is-active"); if (lbl) lbl.textContent = "Plus"; }
    },

    showPaywall(symbol) {
      if (!this.gatingEnabled()) return;
      let ov = document.getElementById("plusOverlay");
      if (!ov) { ov = this._build(); document.body.appendChild(ov); }
      const sub = ov.querySelector(".plus-sub");
      if (this.active()) {
        sub.textContent = "You're on NeuroNourish Plus — enjoy unlimited audio. Thank you for supporting the project!";
        ov.querySelector(".plus-actions").style.display = "none";
      } else {
        sub.textContent = symbol
          ? `You've used your ${CONFIG.FREE_LISTEN_LIMIT} free listens. Unlock unlimited audio narration with Plus.`
          : "Unlock unlimited audio narration for every gene with NeuroNourish Plus.";
        ov.querySelector(".plus-actions").style.display = "";
      }
      ov.hidden = false;
      document.body.style.overflow = "hidden";
    },
    closePaywall() {
      const ov = document.getElementById("plusOverlay");
      if (ov) ov.hidden = true;
      document.body.style.overflow = "";
    },

    _build() {
      const ov = document.createElement("div");
      ov.id = "plusOverlay";
      ov.className = "plus-overlay";
      ov.hidden = true;
      ov.setAttribute("role", "dialog");
      ov.setAttribute("aria-modal", "true");
      ov.innerHTML = `
        <div class="plus-card">
          <button class="plus-close" aria-label="Close">×</button>
          <div class="plus-badge-lg">✨ NeuroNourish <strong>Plus</strong></div>
          <p class="plus-sub"></p>
          <ul class="plus-benefits">
            <li>🎧 <strong>Unlimited audio</strong> narration for all 27 genes</li>
            <li>📴 Works offline once loaded</li>
            <li>💜 Supports ongoing updates &amp; new content</li>
            <li>🔓 Everything else stays <strong>free</strong> — all reference &amp; safety info</li>
          </ul>
          <div class="plus-actions">
            <a class="plus-buy" href="${CONFIG.CHECKOUT_URL}" target="_blank" rel="noopener">
              Get Plus — ${escapeHtml(CONFIG.PRICE_LABEL)}
            </a>
            <div class="plus-code-row">
              <input class="plus-code" type="text" placeholder="Have an access code?" aria-label="Access code" />
              <button class="plus-code-btn" type="button">Unlock</button>
            </div>
            <p class="plus-note">Educational content only — not medical advice. Cancel anytime.</p>
          </div>
        </div>`;
      ov.addEventListener("click", (e) => { if (e.target === ov) this.closePaywall(); });
      ov.querySelector(".plus-close").addEventListener("click", () => this.closePaywall());
      ov.querySelector(".plus-code-btn").addEventListener("click", () => {
        const input = ov.querySelector(".plus-code");
        if (this.tryCode(input.value)) { input.value = ""; }
        else { input.classList.add("shake"); setTimeout(() => input.classList.remove("shake"), 500);
               input.value = ""; input.placeholder = "Invalid code — try again"; }
      });
      return ov;
    },

    init() {
      if (!this.gatingEnabled()) { this.updateBadge(); return; }
      this.checkSuccessParam();
      const btn = document.getElementById("plusBtn");
      if (btn) btn.addEventListener("click", () => this.showPaywall());
      this.updateBadge();
    }
  };

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c]));
  }

  window.NNPlus = NNPlus;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => NNPlus.init());
  } else { NNPlus.init(); }
})();
