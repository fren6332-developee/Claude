/* ============================================================
   NeuroNourish — app logic
   - renders the gene grid + detail pages
   - search & pathway filtering
   - audio narration via the Web Speech API (male, calm, unhurried voice)
   ============================================================ */
(function () {
  "use strict";

  const GENES = window.GENE_DATA || [];
  const CATS  = window.GENE_CATEGORIES || {};
  const ACTIONS = window.FOOD_ACTIONS || {};

  const el = {
    home:   document.getElementById("homeView"),
    detail: document.getElementById("detailView"),
    about:  document.getElementById("aboutView"),
    grid:   document.getElementById("geneGrid"),
    search: document.getElementById("searchInput"),
    filter: document.getElementById("filterBar"),
    none:   document.getElementById("noResults"),
    audioToggle: document.getElementById("audioToggle"),
    audioLabel:  document.getElementById("audioLabel")
  };

  let activeCategory = "all";
  let searchTerm = "";

  /* ---------------- Audio narration ----------------
     Primary: fixed, studio-rendered MP3 per gene (warm, calm, confident male
     voice — Kokoro "am_michael"). Fallback: the browser's Web Speech API if a
     file can't be loaded (e.g., truly offline before the cache is warm).      */
  const Narrator = (function () {
    const AUDIO_DIR = "audio/";
    const speechSupported = "speechSynthesis" in window;
    let currentBtn = null;
    let player = null;       // active HTMLAudioElement
    let speechVoice = null;  // chosen fallback voice

    /* ---- fallback voice selection (Web Speech) ---- */
    const MALE_HINTS = [
      "Daniel", "Google UK English Male", "Microsoft Guy", "Microsoft David",
      "Microsoft Mark", "Microsoft Ryan", "Alex", "Fred", "Rishi", "Arthur", "male"
    ];
    function pickVoice() {
      if (!speechSupported) return;
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      const en = voices.filter(v => /^en(-|_|$)/i.test(v.lang));
      const pool = en.length ? en : voices;
      for (const hint of MALE_HINTS) {
        const m = pool.find(v => v.name.toLowerCase().includes(hint.toLowerCase()));
        if (m) { speechVoice = m; return; }
      }
      const femaleNames = ["female","samantha","victoria","karen","moira","tessa","zira","susan","fiona","serena","amelie"];
      speechVoice = pool.find(v => !femaleNames.some(f => v.name.toLowerCase().includes(f))) || pool[0];
    }
    if (speechSupported) { pickVoice(); window.speechSynthesis.onvoiceschanged = pickVoice; }

    function setBtnState(btn, playing) {
      if (!btn) return;
      btn.classList.toggle("playing", playing);
      const lbl = btn.querySelector(".listen-label");
      const ic  = btn.querySelector(".ic");
      if (lbl) lbl.textContent = playing ? "Stop narration" : "Listen — plain-language explanation";
      if (ic)  ic.textContent  = playing ? "⏹" : "🔊";
    }
    function setToggle(active, label) {
      if (!el.audioToggle) return;
      el.audioToggle.setAttribute("aria-pressed", active ? "true" : "false");
      if (el.audioLabel) el.audioLabel.textContent = label;
    }
    function reset() {
      if (currentBtn) { setBtnState(currentBtn, false); currentBtn = null; }
      setToggle(false, "Audio ready");
    }

    function stop() {
      if (player) {
        // Null `player` before tearing down so the audio element's teardown
        // 'error' event (from removing src) is ignored by the guard below.
        const a = player; player = null;
        a.pause();
        try { a.removeAttribute("src"); a.load(); } catch (e) { /* noop */ }
      }
      if (speechSupported) window.speechSynthesis.cancel();
      reset();
    }

    /* fallback: speak the text live */
    function speak(text, btn) {
      if (!speechSupported) { setToggle(false, "Audio unavailable on this device"); return; }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      if (speechVoice) u.voice = speechVoice;
      u.lang = (speechVoice && speechVoice.lang) || "en-US";
      u.rate = 0.92; u.pitch = 0.92; u.volume = 1;
      u.onstart = function () { currentBtn = btn; setBtnState(btn, true); setToggle(true, "Speaking…"); };
      u.onend = u.onerror = function () { if (currentBtn === btn) reset(); };
      window.speechSynthesis.speak(u);
    }

    /* primary entry point: play the fixed MP3, fall back to speech on error */
    function play(symbol, fallbackText, btn) {
      // Toggle off if this same button is already the active one.
      const isActive = currentBtn === btn && (player || (speechSupported && window.speechSynthesis.speaking));
      stop();
      if (isActive) return;

      const audio = new Audio(AUDIO_DIR + encodeURIComponent(symbol) + ".mp3");
      audio.preload = "auto";
      player = audio;
      currentBtn = btn;

      audio.addEventListener("playing", function () { setBtnState(btn, true); setToggle(true, "Playing…"); });
      audio.addEventListener("ended",  function () { if (currentBtn === btn) reset(); player = null; });
      audio.addEventListener("error", function () {
        // Ignore spurious errors raised while tearing this element down in stop().
        if (player !== audio) return;
        // File genuinely missing/unreachable — gracefully fall back to live narration.
        player = null;
        setToggle(true, "Narrating…");
        speak(fallbackText, btn);
      });
      const p = audio.play();
      if (p && p.catch) p.catch(function () { /* autoplay/error handled by 'error' */ });
    }

    if (el.audioToggle) { el.audioToggle.addEventListener("click", stop); setToggle(false, "Audio ready"); }

    return { play, speak, stop };
  })();

  /* ---------------- Helpers ---------------- */
  function catColor(key) { return (CATS[key] && CATS[key].color) || "#6C63FF"; }
  function catLabel(key) { return (CATS[key] && CATS[key].label) || key; }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;" }[c])); }
  // Escape everything, then restore the only markup we allow in authored bio facts: <strong>.
  function bioHtml(s) { return esc(s).replace(/&lt;strong&gt;/g, "<strong>").replace(/&lt;\/strong&gt;/g, "</strong>"); }

  /* ---------------- Filter bar ---------------- */
  function buildFilters() {
    const frag = document.createDocumentFragment();
    const make = (key, label, color) => {
      const b = document.createElement("button");
      b.className = "filter-chip" + (activeCategory === key ? " active" : "");
      b.type = "button";
      b.dataset.cat = key;
      if (activeCategory === key) b.style.background = color;
      b.innerHTML = (key === "all" ? "" : `<span class="dot" style="background:${color}"></span>`) + esc(label);
      b.addEventListener("click", () => {
        activeCategory = key;
        buildFilters();
        renderGrid();
      });
      return b;
    };
    frag.appendChild(make("all", "All pathways", "#6C63FF"));
    Object.keys(CATS).forEach(k => frag.appendChild(make(k, CATS[k].label, CATS[k].color)));
    el.filter.replaceChildren(frag);
  }

  /* ---------------- Grid ---------------- */
  function matches(gene) {
    if (activeCategory !== "all" && gene.category !== activeCategory) return false;
    if (!searchTerm) return true;
    const hay = [
      gene.symbol, gene.name, gene.locus, gene.illnesses.join(" "),
      gene.drugs.map(d => d.name).join(" "),
      gene.foods.map(f => f.name).join(" ")
    ].join(" ").toLowerCase();
    return hay.includes(searchTerm);
  }

  function renderGrid() {
    const frag = document.createDocumentFragment();
    let count = 0;
    GENES.forEach(gene => {
      if (!matches(gene)) return;
      count++;
      const card = document.createElement("button");
      card.className = "gene-card";
      card.style.setProperty("--cat-color", catColor(gene.category));
      card.style.setProperty("--cat-color", catColor(gene.category));
      card.type = "button";
      card.innerHTML = `
        <span class="listen-hint" aria-hidden="true">🔊</span>
        <span class="symbol">${esc(gene.symbol)}</span>
        <p class="gname">${esc(gene.name)}</p>
        <span class="cat-tag" style="--cat-color:${catColor(gene.category)}">${esc(shortCat(gene.category))}</span>
        <p class="locus">Chromosome ${esc(gene.locus)}</p>`;
      card.addEventListener("click", () => openDetail(gene.symbol));
      frag.appendChild(card);
    });
    el.grid.replaceChildren(frag);
    el.none.hidden = count !== 0;
  }

  function shortCat(key) {
    return ({
      metabolism: "Metabolism", transporter: "Transporter", serotonergic: "Serotonin",
      dopaminergic: "Dopamine", signaling: "Signaling & Mood", other: "Other / Safety"
    })[key] || key;
  }

  /* ---------------- Detail ---------------- */
  function openDetail(symbol) {
    const gene = GENES.find(g => g.symbol === symbol);
    if (!gene) return;
    Narrator.stop();
    const color = catColor(gene.category);

    const illnessChips = gene.illnesses.map(i => `<span class="illness-chip">${esc(i)}</span>`).join("");

    const drugItems = gene.drugs.map((d, i) => `
      <div class="drug-item">
        <div class="drug-top">
          <span class="drug-rank">${i + 1}</span>
          <span class="drug-name">${esc(d.name)}</span>
          <span class="drug-class">${esc(d.cls)}</span>
        </div>
        <p class="drug-note">${esc(d.note)}</p>
      </div>`).join("");

    const foodItems = gene.foods.map(f => {
      const a = ACTIONS[f.action] || { label: f.action, color: "#666" };
      const bio = Array.isArray(f.bio) && f.bio.length
        ? `<div class="food-bio">
             <p class="food-bio-label">🧠 Brain-protective compounds</p>
             <ul class="food-bio-list">${f.bio.map(b => `<li>${bioHtml(b)}</li>`).join("")}</ul>
           </div>`
        : "";
      return `
        <div class="food-item">
          <span class="food-badge" style="background:${a.color}" title="${esc(a.hint || "")}">${esc(a.label)}</span>
          <div class="food-body">
            <div class="food-name">${esc(f.name)}</div>
            <div class="food-why">${esc(f.why)}</div>
            ${bio}
          </div>
        </div>`;
    }).join("");

    const legend = Object.keys(ACTIONS).map(k => {
      const a = ACTIONS[k];
      return `<span class="legend-item"><span class="legend-swatch" style="background:${a.color}"></span>
        <strong>${esc(a.label)}</strong>&nbsp;— ${esc(a.hint)}</span>`;
    }).join("");

    el.detail.innerHTML = `
      <button class="back-btn" id="backBtn" type="button">← All genes</button>

      <div class="caution-banner">
        <span class="cb-ic" aria-hidden="true">⚕️</span>
        <span><strong>Educational reference — not medical advice.</strong> Never start,
        stop, or change a medication, supplement, or diet based on this page. Talk to your
        prescriber, and remember a genetic result must be interpreted by a clinician.</span>
      </div>

      <div class="detail-head" style="--cat-color:${color}">
        <div class="row1">
          <h2>${esc(gene.symbol)}</h2>
          <span class="full-name">${esc(gene.name)}</span>
        </div>
        <div class="meta-line">
          <span class="cat-tag" style="--cat-color:${color}">${esc(catLabel(gene.category))}</span>
          <span class="locus-tag">📍 Chromosome ${esc(gene.locus)}</span>
        </div>
        <button class="listen-btn" id="listenBtn" type="button">
          <span class="ic" aria-hidden="true">🔊</span>
          <span class="listen-label">Listen — plain-language explanation</span>
        </button>

        <div class="pop-callout">
          <div class="ph-label">👥 Population health — who is affected</div>
          <p>${esc(gene.population)}</p>
        </div>
      </div>

      <div class="plain-card">
        <p class="section-eyebrow">🎧 In plain language (8th-grade level)</p>
        <p>${esc(gene.plain)}</p>
      </div>

      <div class="section">
        <p class="section-eyebrow">🧠 Linked mental-health conditions</p>
        <h3>What this gene is associated with</h3>
        <div class="chip-row">${illnessChips}</div>
      </div>

      <div class="section">
        <p class="section-eyebrow">💊 Most-prescribed related medications</p>
        <h3>Top 3 drugs &amp; how this gene affects them</h3>
        <div class="drug-safety-note">⚠️ Listed for education only. Which medication is
        right for you — and at what dose — is decided by a licensed clinician based on your
        full history. This is not a recommendation to take, avoid, or change any drug.</div>
        <div class="drug-list">${drugItems}</div>
      </div>

      <div class="section">
        <p class="section-eyebrow">🔬 Pharmacology · pharmacodynamics · pharmacokinetics</p>
        <h3>How it shapes drug response</h3>
        <p class="pharm-text">${withBold(gene.pharmacology)}</p>
      </div>

      <div class="section">
        <p class="section-eyebrow">🥗 Five foods for this pathway</p>
        <h3>Amplify · Modulate · Protect</h3>
        <div class="legend">${legend}</div>
        <div class="food-list">${foodItems}</div>
      </div>

      <div class="mimic-card">
        <p class="section-eyebrow">✨ Foods that support the same pathway</p>
        <h3>Working the same pathway, gently</h3>
        <p>${esc(gene.foodMimic)}</p>
        <p style="margin-top:12px;font-size:0.9rem;opacity:0.95;"><strong>To be clear:</strong>
        “mimic” means a food nudges the <em>same biological pathway</em> — it does <strong>not</strong>
        match a drug's strength and is <strong>not</strong> a substitute for medication or a treatment claim.</p>
      </div>

      <div class="consensus-note">
        <strong>Cross-referenced &amp; consensus-checked.</strong> The nutrition guidance above
        reflects whole-diet patterns supported across the American Psychiatric Association, the
        National Institute of Mental Health, the International Society for Nutritional Psychiatry
        Research, the Food &amp; Mood Centre, the American Society for Nutrition, and the Global
        Brain Health Institute. These are <em>complements</em> to care — never a replacement for
        prescribed medication or your clinician's advice.
      </div>

      <p class="detail-source-note">${esc(window.PER_GENE_SOURCE || "")}</p>
    `;

    document.getElementById("backBtn").addEventListener("click", showHome);
    document.getElementById("listenBtn").addEventListener("click", function () {
      // Freemium (web only): first few gene narrations are free, then Plus unlocks the rest.
      if (window.NNPlus && !NNPlus.canListen(gene.symbol)) { NNPlus.showPaywall(gene.symbol); return; }
      if (window.NNPlus) NNPlus.recordListen(gene.symbol);
      Narrator.play(gene.symbol, buildNarration(gene), this);
    });

    el.home.hidden = true;
    el.about.hidden = true;
    el.detail.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    el.detail.querySelector(".back-btn").focus();
  }

  // Bold the key pharmacology keywords for scannability.
  function withBold(text) {
    const safe = esc(text);
    return safe.replace(/\b(Pharmacokinetics?|Pharmacodynamics?|Pharmacology|INDUCED|INHIBITED|INDUCERS?|INHIBITORS?|CONSISTENCY|SAFETY)\b/g,
      "<strong>$1</strong>");
  }

  // The spoken script: warm intro + the plain explanation + a population note.
  function buildNarration(gene) {
    return `${gene.symbol}. ${gene.name}. ` +
           `${gene.plain} ` +
           `Here's a quick population note. ${gene.population} ` +
           `Remember, this is educational information to discuss with your clinician, not medical advice.`;
  }

  function showHome() {
    Narrator.stop();
    el.detail.hidden = true;
    el.about.hidden = true;
    el.home.hidden = false;
    el.detail.innerHTML = "";
    el.about.innerHTML = "";
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ---------------- Safety / Sources view ---------------- */
  function showAbout() {
    Narrator.stop();
    const info = window.APP_INFO || {};
    const method = window.METHODOLOGY || [];
    const refs = window.REFERENCES || [];
    const crisis = window.CRISIS_RESOURCES || [];
    const rv = info.review || {};
    const signoff = info.reviewerSignoff || {};

    const reviewLine = (signoff && signoff.reviewer)
      ? `Independently reviewed by ${esc(signoff.reviewer)}${signoff.credentials ? ", " + esc(signoff.credentials) : ""}${signoff.date ? " (" + esc(signoff.date) + ")" : ""}.`
      : esc(rv.detail || "");

    const crisisItems = crisis.map(c => `
      <li>
        <div class="cr-name">${esc(c.name)} <span style="color:#999">· ${esc(c.region)}</span></div>
        <div class="cr-contact">${esc(c.contact)}</div>
        ${c.url ? `<a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.url.replace(/^https?:\/\//,""))}</a>` : ""}
      </li>`).join("");

    const methodItems = method.map(m => `<li>${esc(m)}</li>`).join("");

    const refGroups = refs.map(g => `
      <div class="ref-group">
        <h4>${esc(g.group)}</h4>
        <ul class="ref-list">
          ${g.items.map(it => `<li><span class="ref-name">${esc(it.name)}</span><br>
            <span class="ref-note">${esc(it.note)}</span></li>`).join("")}
        </ul>
      </div>`).join("");

    el.about.innerHTML = `
      <button class="back-btn" id="aboutBack" type="button">← All genes</button>

      <div class="about-card">
        <h2>Safety, Sources &amp; Methodology</h2>
        <p style="color:var(--ink-soft)">${esc(info.name || "NeuroNourish")} ·
        v${esc(info.version || "")} · Updated ${esc(info.updated || "")}</p>
      </div>

      <div class="about-card">
        <h3>⚕️ Medical disclaimer</h3>
        <p><strong>This app provides educational information only. It is not medical advice,
        a diagnosis, or a treatment, and it is not a medical device.</strong></p>
        <ul>
          <li>It does not replace your physician, pharmacist, a genetic test, or the official Genomind report.</li>
          <li>Never start, stop, or change any medication, supplement, or diet based on this app — consult your prescriber first.</li>
          <li>Drug listings are educational; medication and dosing decisions belong to a licensed clinician.</li>
          <li>“Foods that support the same pathway” are complements, not substitutes for medication, and are not treatment claims.</li>
          <li>Genetic and pharmacogenomic results must be interpreted by a qualified professional in the context of your health.</li>
        </ul>
      </div>

      <div class="crisis-box">
        <h3>🆘 If you are in crisis</h3>
        <p>If you or someone else may be in danger, or you are thinking about suicide or self-harm,
        get help now — you deserve support.</p>
        <ul class="crisis-list">${crisisItems}</ul>
      </div>

      <div class="about-card">
        <h3>🔬 How this app is built (methodology)</h3>
        <ul>${methodItems}</ul>
      </div>

      <div class="about-card">
        <h3>🩺 Clinical review status</h3>
        <span class="review-badge">${esc(rv.label || "Pending independent clinical review")}</span>
        <p>${reviewLine}</p>
      </div>

      <div class="about-card">
        <h3>📚 Sources &amp; references</h3>
        ${refGroups}
      </div>

      <div class="about-card">
        <h3>🔒 Your privacy</h3>
        <p>NeuroNourish runs entirely on your device. It does <strong>not</strong> collect,
        store, or transmit any personal information, health data, or analytics. There are no
        accounts and no tracking. Audio narration plays from files bundled with the app.</p>
      </div>
    `;

    document.getElementById("aboutBack").addEventListener("click", showHome);
    el.home.hidden = true;
    el.detail.hidden = true;
    el.about.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
    el.about.querySelector(".back-btn").focus();
  }

  /* ---------------- First-run acknowledgment gate ---------------- */
  const ACK_KEY = "genenutrition_ack_v1";
  function initAckGate() {
    const gate = document.getElementById("ackGate");
    if (!gate) return;
    let acknowledged = false;
    try { acknowledged = localStorage.getItem(ACK_KEY) === "1"; } catch (e) {}
    function dismiss() {
      try { localStorage.setItem(ACK_KEY, "1"); } catch (e) {}
      gate.hidden = true;
      document.body.style.overflow = "";
    }
    if (!acknowledged) {
      gate.hidden = false;
      document.body.style.overflow = "hidden";
      const agree = document.getElementById("ackAgree");
      agree.addEventListener("click", dismiss);
      document.getElementById("ackSources").addEventListener("click", function () {
        dismiss(); showAbout();
      });
      agree.focus();
    }
  }

  /* ---------------- Search ---------------- */
  let searchTimer = null;
  el.search.addEventListener("input", function () {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      searchTerm = this.value.trim().toLowerCase();
      renderGrid();
    }, 120);
  });

  /* ---------------- Init ---------------- */
  buildFilters();
  renderGrid();
  initAckGate();

  // Safety & Sources entry points.
  const safetyBtn = document.getElementById("safetyBtn");
  if (safetyBtn) safetyBtn.addEventListener("click", showAbout);
  const footerSafety = document.getElementById("footerSafetyLink");
  if (footerSafety) footerSafety.addEventListener("click", showAbout);

  // Register service worker for offline / installable use.
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(() => {});
    });
  }
})();
