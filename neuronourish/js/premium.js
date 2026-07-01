/* ============================================================
   NeuroNourish Plus — web monetization (freemium)
   ------------------------------------------------------------
   All educational & SAFETY content is FREE. Only the convenience
   of unlimited audio narration is metered (first few genes free,
   then "Plus" unlocks the rest).

   ENTITLEMENT — two supported paths:
   1) Lemon Squeezy LICENSE KEYS (recommended, tamper-resistant):
      the buyer receives a license key at checkout and pastes it in.
      The app calls Lemon Squeezy's public license API to
      ACTIVATE (bind to this device) and VALIDATE (on later loads).
      Keys can't be forged and activation limits curb sharing — all
      with NO backend of your own.
   2) Honor-system fallback: a manual access code (for comps/press)
      and/or a checkout success-redirect (?plus=success).

   iOS: this web paywall AUTO-DISABLES inside the native (Capacitor)
   shell — the App Store build must use StoreKit/IAP for digital
   goods. See store/MONETIZATION.md.
   ============================================================ */
(function () {
  "use strict";

  const CONFIG = {
    // Lemon Squeezy checkout URL for "NeuroNourish Plus" (create it in the LS dashboard).
    CHECKOUT_URL: "https://STORE.lemonsqueezy.com/checkout/buy/REPLACE_VARIANT_ID",
    PRICE_LABEL:  "$2.99 / month",
    FREE_LISTEN_LIMIT: 3,

    // Lemon Squeezy license verification (recommended). After you create a product
    // WITH "license keys" enabled, this works with no changes — buyers paste their key.
    LEMONSQUEEZY: {
      enabled: true,
      validateUrl: "https://api.lemonsqueezy.com/v1/licenses/validate",
      activateUrl: "https://api.lemonsqueezy.com/v1/licenses/activate",
      // Optional: lock to your store/product so keys from other LS stores are rejected.
      expectedStoreId:   null,   // e.g., 12345
      expectedProductId: null    // e.g., 67890
    },

    // Honor-system manual codes (always accepted — handy for comps/reviewers).
    ACCESS_CODES: ["NOURISH-PLUS"],
    // Checkout success redirect flag (honor-system only): …/neuronourish/?plus=success
    SUCCESS_PARAM: "plus",
    SUCCESS_VALUE: "success"
  };

  const LS_ACTIVE = "nn_plus_active";
  const LS_FREE   = "nn_free_listens";
  const LS_KEY    = "nn_ls_key";
  const LS_INST   = "nn_ls_instance";
  const LS_DEVICE = "nn_device";

  const isNative = !!(window.Capacitor &&
    (typeof window.Capacitor.isNativePlatform === "function"
      ? window.Capacitor.isNativePlatform() : true));

  function ls(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function setLs(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function delLs(k) { try { localStorage.removeItem(k); } catch (e) {} }

  function deviceId() {
    let d = ls(LS_DEVICE);
    if (!d) { d = "web-" + Math.random().toString(36).slice(2, 10); setLs(LS_DEVICE, d); }
    return d;
  }

  const NNPlus = {
    gatingEnabled() { return !isNative; },
    active() { return ls(LS_ACTIVE) === "1"; },

    freeListened() { try { return JSON.parse(ls(LS_FREE) || "[]"); } catch (e) { return []; } },
    remaining() { return Math.max(0, CONFIG.FREE_LISTEN_LIMIT - this.freeListened().length); },

    canListen(symbol) {
      if (!this.gatingEnabled() || this.active()) return true;
      const arr = this.freeListened();
      return arr.includes(symbol) || arr.length < CONFIG.FREE_LISTEN_LIMIT;
    },
    recordListen(symbol) {
      if (!this.gatingEnabled() || this.active()) return;
      const arr = this.freeListened();
      if (!arr.includes(symbol)) { arr.push(symbol); setLs(LS_FREE, JSON.stringify(arr)); }
    },

    activate() { setLs(LS_ACTIVE, "1"); this.updateBadge(); this.closePaywall(); },
    deactivate() { delLs(LS_ACTIVE); this.updateBadge(); },

    /* ---------- Lemon Squeezy license API ---------- */
    async _lsPost(url, params) {
      const body = new URLSearchParams(params).toString();
      const res = await fetch(url, {
        method: "POST",
        headers: { "Accept": "application/json", "Content-Type": "application/x-www-form-urlencoded" },
        body
      });
      return res.json();
    },
    _storeProductOk(meta) {
      const L = CONFIG.LEMONSQUEEZY;
      if (L.expectedStoreId && meta && String(meta.store_id) !== String(L.expectedStoreId)) return false;
      if (L.expectedProductId && meta && String(meta.product_id) !== String(L.expectedProductId)) return false;
      return true;
    },
    // Activate a key on this device (first time). Returns {ok, message}.
    async lsActivate(key) {
      try {
        const data = await this._lsPost(CONFIG.LEMONSQUEEZY.activateUrl, {
          license_key: key, instance_name: "NeuroNourish Web " + deviceId()
        });
        if (data.activated && data.license_key && data.license_key.status === "active"
            && this._storeProductOk(data.meta)) {
          setLs(LS_KEY, key);
          if (data.instance && data.instance.id) setLs(LS_INST, data.instance.id);
          this.activate();
          return { ok: true };
        }
        const msg = data.error
          || (data.license_key && data.license_key.status !== "active"
              ? "This key is " + data.license_key.status + "." : "That key couldn't be activated.");
        return { ok: false, message: msg };
      } catch (e) {
        return { ok: false, message: "Network error — check your connection and try again." };
      }
    },
    // Re-check a stored key on load. Grace on network failure (don't lock out payers offline).
    async lsRevalidate() {
      const key = ls(LS_KEY), inst = ls(LS_INST);
      if (!key) return;
      try {
        const data = await this._lsPost(CONFIG.LEMONSQUEEZY.validateUrl, {
          license_key: key, instance_id: inst || ""
        });
        if (data.valid && data.license_key && data.license_key.status === "active"
            && this._storeProductOk(data.meta)) {
          this.activate();                      // still good
        } else if (data.valid === false || (data.license_key && data.license_key.status !== "active")) {
          delLs(LS_KEY); delLs(LS_INST); this.deactivate();   // refunded/expired/disabled
        }
      } catch (e) { /* offline — keep last-known-good */ }
    },

    /* ---------- unlock entry point (code or license key) ---------- */
    async tryUnlock(value) {
      const norm = String(value || "").trim();
      if (CONFIG.ACCESS_CODES.map(c => c.toUpperCase()).includes(norm.toUpperCase())) {
        this.activate(); return { ok: true };
      }
      if (CONFIG.LEMONSQUEEZY.enabled) return this.lsActivate(norm);
      return { ok: false, message: "Invalid code." };
    },

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
      const actions = ov.querySelector(".plus-actions");
      if (this.active()) {
        sub.textContent = "You're on NeuroNourish Plus — enjoy unlimited audio. Thank you for supporting the project!";
        actions.style.display = "none";
      } else {
        sub.textContent = symbol
          ? `You've used your ${CONFIG.FREE_LISTEN_LIMIT} free listens. Unlock unlimited audio narration with Plus.`
          : "Unlock unlimited audio narration for every gene with NeuroNourish Plus.";
        actions.style.display = "";
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
      const lsOn = CONFIG.LEMONSQUEEZY.enabled;
      const ov = document.createElement("div");
      ov.id = "plusOverlay"; ov.className = "plus-overlay"; ov.hidden = true;
      ov.setAttribute("role", "dialog"); ov.setAttribute("aria-modal", "true");
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
              <input class="plus-code" type="text" autocomplete="off"
                placeholder="${lsOn ? "Paste your license key" : "Have an access code?"}"
                aria-label="${lsOn ? "License key" : "Access code"}" />
              <button class="plus-code-btn" type="button">Unlock</button>
            </div>
            <p class="plus-msg" role="status"></p>
            <p class="plus-note">${lsOn ? "Enter the license key from your purchase email." : ""}
              Educational content only — not medical advice. Cancel anytime.</p>
          </div>
        </div>`;
      ov.addEventListener("click", (e) => { if (e.target === ov) this.closePaywall(); });
      ov.querySelector(".plus-close").addEventListener("click", () => this.closePaywall());
      const input = ov.querySelector(".plus-code");
      const msg = ov.querySelector(".plus-msg");
      const btn = ov.querySelector(".plus-code-btn");
      const submit = async () => {
        const val = input.value.trim();
        if (!val) return;
        btn.disabled = true; btn.textContent = "Checking…"; msg.textContent = "";
        const r = await this.tryUnlock(val);
        btn.disabled = false; btn.textContent = "Unlock";
        if (r.ok) { input.value = ""; }
        else { input.classList.add("shake"); setTimeout(() => input.classList.remove("shake"), 500);
               msg.textContent = r.message || "That didn't work — try again."; }
      };
      btn.addEventListener("click", submit);
      input.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
      return ov;
    },

    init() {
      if (!this.gatingEnabled()) { this.updateBadge(); return; }
      this.checkSuccessParam();
      const btn = document.getElementById("plusBtn");
      if (btn) btn.addEventListener("click", () => this.showPaywall());
      this.updateBadge();
      // Re-verify a stored license in the background (grace if offline).
      if (CONFIG.LEMONSQUEEZY.enabled && ls(LS_KEY)) this.lsRevalidate().then(() => this.updateBadge());
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
