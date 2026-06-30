#!/usr/bin/env node
/*
 * Build a printable Clinical Reviewer Packet from the live gene data.
 * Every user-facing claim becomes a line item with Approve / Revise / Remove
 * checkboxes and a notes line, so a licensed clinician can sign off section by
 * section. Output: ../reviewer/clinical-review-packet.html (print to PDF).
 *
 *   node scripts/build_reviewer_packet.js
 */
const fs = require("fs");
const path = require("path");

// Load the data module the same way the browser does.
global.window = {};
require(path.join(__dirname, "..", "js", "data.js"));
const GENES   = global.window.GENE_DATA;
const CATS    = global.window.GENE_CATEGORIES;
const ACTIONS = global.window.FOOD_ACTIONS;
const REFS    = global.window.REFERENCES;
const METHOD  = global.window.METHODOLOGY;
const INFO    = global.window.APP_INFO;
const CRISIS  = global.window.CRISIS_RESOURCES;

const esc = s => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// A reusable review-control block for one claim.
let itemSeq = 0;
function claim(label, body, opts = {}) {
  itemSeq++;
  const id = (opts.tag || "C") + itemSeq;
  return `
  <div class="claim ${opts.cls || ""}">
    <div class="claim-head"><span class="claim-id">${id}</span>
      <span class="claim-label">${label}</span></div>
    <div class="claim-body">${body}</div>
    <div class="review-controls">
      <span class="chk">☐ Approve as written</span>
      <span class="chk">☐ Approve with edits</span>
      <span class="chk">☐ Remove</span>
      <span class="notes">Notes / required revision: ___________________________________________________________</span>
    </div>
  </div>`;
}

function geneSection(g, idx) {
  const cat = (CATS[g.category] && CATS[g.category].label) || g.category;

  const illness = `<ul class="inline-list">${g.illnesses.map(i => `<li>${esc(i)}</li>`).join("")}</ul>`;

  const drugs = g.drugs.map((d, i) => claim(
    `Drug ${i + 1} of 3 — clinical accuracy &amp; appropriateness`,
    `<strong>${esc(d.name)}</strong> <span class="muted">(${esc(d.cls)})</span><br>
     <span class="muted">Gene–drug note:</span> ${esc(d.note)}`,
    { tag: g.symbol + "-D" }
  )).join("");

  const foods = `<ul class="food-list">${g.foods.map(f => {
    const a = (ACTIONS[f.action] && ACTIONS[f.action].label) || f.action;
    return `<li><span class="food-act act-${esc(f.action)}">${esc(a)}</span>
      <strong>${esc(f.name)}</strong> — <span class="muted">${esc(f.why)}</span></li>`;
  }).join("")}</ul>`;

  return `
  <section class="gene">
    <div class="gene-head">
      <h2>${idx + 1}. ${esc(g.symbol)} <span class="gene-name">${esc(g.name)}</span></h2>
      <div class="gene-meta">Locus ${esc(g.locus)} · Pathway: ${esc(cat)}
        · Reviewer initials: <span class="initbox"></span></div>
    </div>

    ${claim("Population-health frequency statement",
      esc(g.population), { tag: g.symbol + "-" })}

    ${claim("Plain-language explanation (8th-grade) — accuracy &amp; not misleading",
      esc(g.plain), { tag: g.symbol + "-" })}

    ${claim("Associated mental-health conditions",
      illness, { tag: g.symbol + "-" })}

    <div class="claim-group-label">Most-prescribed related medications (educational only)</div>
    ${drugs}

    ${claim("Pharmacology / pharmacodynamics / pharmacokinetics statement",
      esc(g.pharmacology), { tag: g.symbol + "-" })}

    ${claim("Five foods for this pathway (Amplify / Modulate / Protect) — claims defensible &amp; non-prescriptive",
      foods, { tag: g.symbol + "-" })}

    ${claim("“Foods that support the same pathway” statement — no treatment/efficacy overclaim",
      esc(g.foodMimic), { tag: g.symbol + "-", cls: "mimic" })}
  </section>`;
}

const refsHtml = REFS.map(grp => `
  <div class="ref-group"><h4>${esc(grp.group)}</h4>
  <ul>${grp.items.map(it => `<li><strong>${esc(it.name)}</strong> — <span class="muted">${esc(it.note)}</span></li>`).join("")}</ul></div>`).join("");

const methodHtml = `<ul>${METHOD.map(m => `<li>${esc(m)}</li>`).join("")}</ul>`;

const crisisHtml = `<ul>${CRISIS.map(c => `<li><strong>${esc(c.name)}</strong> (${esc(c.region)}): ${esc(c.contact)}</li>`).join("")}</ul>`;

const genesHtml = GENES.map(geneSection).join("");
const today = new Date().toISOString().slice(0, 10);

const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8">
<title>GeneNutrition Atlas — Clinical Reviewer Packet</title>
<style>
  :root { --ink:#1f2540; --muted:#5a6079; --line:#c9cde0; --brand:#4b46c4; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: var(--ink);
    line-height: 1.5; margin: 0; font-size: 11.5pt; }
  .wrap { max-width: 850px; margin: 0 auto; padding: 28px 34px; }
  h1 { font-size: 22pt; margin: 0 0 4px; }
  h2 { font-size: 14pt; margin: 0; }
  h3 { font-size: 13pt; border-bottom: 2px solid var(--brand); padding-bottom: 4px; color: var(--brand); }
  h4 { margin: 10px 0 4px; }
  .muted { color: var(--muted); }
  .sans { font-family: "Segoe UI", Helvetica, Arial, sans-serif; }
  a { color: var(--brand); }

  /* Cover */
  .cover { text-align: left; border-bottom: 3px solid var(--brand); padding-bottom: 16px; margin-bottom: 18px; }
  .cover .sub { font-size: 12pt; color: var(--muted); }
  .badge { display: inline-block; background: #fff4d6; border: 1px solid #e3c25a;
    color: #7a5b00; padding: 3px 10px; border-radius: 4px; font-family: sans-serif; font-size: 9.5pt; }
  .meta-table { width: 100%; border-collapse: collapse; margin: 14px 0; font-family: sans-serif; font-size: 10pt; }
  .meta-table td { border: 1px solid var(--line); padding: 7px 9px; vertical-align: top; }
  .meta-table td:first-child { width: 34%; background: #f3f4fb; font-weight: bold; }

  .box { border: 1px solid var(--line); border-radius: 6px; padding: 12px 16px; margin: 12px 0; }
  .instr li { margin-bottom: 5px; }

  /* Sign-off */
  .sign-row { display: flex; gap: 18px; margin-top: 8px; }
  .sign-field { flex: 1; }
  .sign-line { border-bottom: 1px solid var(--ink); height: 26px; margin-top: 16px; }
  .sign-cap { font-family: sans-serif; font-size: 9pt; color: var(--muted); }

  /* Gene sections */
  section.gene { margin-top: 18px; padding-top: 8px; page-break-inside: auto; }
  .gene-head { background: #f3f4fb; border-left: 4px solid var(--brand);
    padding: 8px 12px; margin-bottom: 8px; page-break-after: avoid; }
  .gene-name { font-weight: normal; font-size: 11pt; color: var(--muted); }
  .gene-meta { font-family: sans-serif; font-size: 9pt; color: var(--muted); margin-top: 2px; }
  .initbox { display: inline-block; border: 1px solid var(--ink); width: 70px; height: 14px;
    vertical-align: middle; margin-left: 4px; }

  .claim-group-label { font-family: sans-serif; font-weight: bold; font-size: 10pt;
    margin: 10px 0 2px; color: var(--brand); }
  .claim { border: 1px solid var(--line); border-radius: 5px; padding: 8px 10px;
    margin: 7px 0; page-break-inside: avoid; }
  .claim.mimic { background: #f7f7ff; }
  .claim-head { font-family: sans-serif; font-size: 9.5pt; margin-bottom: 4px; }
  .claim-id { display: inline-block; background: var(--brand); color: #fff; font-weight: bold;
    border-radius: 3px; padding: 1px 6px; margin-right: 7px; font-size: 8.5pt; }
  .claim-label { font-weight: bold; }
  .claim-body { font-size: 11pt; margin: 3px 0 7px; }
  .review-controls { font-family: sans-serif; font-size: 9pt; color: var(--muted);
    border-top: 1px dashed var(--line); padding-top: 5px; }
  .chk { margin-right: 16px; white-space: nowrap; }
  .notes { display: block; margin-top: 5px; }

  ul.inline-list { margin: 2px 0; padding-left: 18px; }
  ul.food-list { margin: 2px 0; padding-left: 16px; }
  ul.food-list li { margin-bottom: 3px; }
  .food-act { font-family: sans-serif; font-size: 8pt; font-weight: bold; color: #fff;
    padding: 1px 6px; border-radius: 3px; margin-right: 4px; }
  .act-amplify { background: #2E9E5B; } .act-modulate { background: #C98A00; } .act-protect { background: #2F6FB0; }

  .ref-group ul { margin: 2px 0 8px; padding-left: 18px; }
  .pagebreak { page-break-before: always; }

  @media print {
    .wrap { max-width: none; padding: 0 8mm; }
    a { color: var(--ink); text-decoration: none; }
  }
  @page { margin: 16mm 0 14mm; }
</style></head>
<body><div class="wrap">

  <div class="cover">
    <h1>GeneNutrition Atlas — Clinical Reviewer Packet</h1>
    <div class="sub">Line-by-line content review &amp; attestation</div>
    <p class="sans" style="font-size:10pt;margin:8px 0 4px;">
      Application: ${esc(INFO.name)} · Version ${esc(INFO.version)} · Packet generated ${esc(today)}<br>
      Current status: <span class="badge">${esc(INFO.review.label)}</span>
    </p>
  </div>

  <div class="box">
    <h4 style="margin-top:0">Purpose &amp; intended use</h4>
    <p>GeneNutrition Atlas is a consumer <strong>educational</strong> reference covering 27 pharmacogenomic
    genes, the medications they influence, and dietary patterns that support the same biological
    pathways. It is explicitly <strong>not</strong> medical advice, diagnosis, treatment, or a medical
    device, and it does not provide individualized recommendations. This packet exists so a licensed
    clinician can verify that every user-facing claim is accurate, defensible, and non-prescriptive
    before clinical or commercial release.</p>
  </div>

  <div class="box instr">
    <h4 style="margin-top:0">How to use this packet</h4>
    <ul class="sans" style="font-size:10pt">
      <li>For each numbered claim, check <strong>Approve as written</strong>, <strong>Approve with edits</strong>, or <strong>Remove</strong>.</li>
      <li>For edits/removals, write the required change on the Notes line (continue on the margin if needed).</li>
      <li>Initial each gene section in the box provided once you have reviewed all its claims.</li>
      <li>Pay particular attention to: drug–gene statements, population-frequency figures, and any food claim that could be read as a treatment or efficacy claim.</li>
      <li>Complete the Attestation on the final page. The app's status changes to “independently reviewed” only after a signed packet is on file.</li>
    </ul>
  </div>

  <h3>Reviewer information</h3>
  <table class="meta-table">
    <tr><td>Reviewer name</td><td></td></tr>
    <tr><td>Credentials / specialty</td><td></td></tr>
    <tr><td>License # &amp; state/country</td><td></td></tr>
    <tr><td>Affiliation</td><td></td></tr>
    <tr><td>Date of review</td><td></td></tr>
  </table>

  <h3>Editorial standards &amp; methodology (for context)</h3>
  <div class="sans" style="font-size:10pt">${methodHtml}</div>

  <h3>Sources referenced by the app</h3>
  <div class="sans" style="font-size:10pt">${refsHtml}</div>

  <div class="pagebreak"></div>
  <h3>Per-gene claim review (27 genes)</h3>
  <p class="muted sans" style="font-size:9.5pt">Each claim below appears verbatim (or as a faithful
  summary) of what users see in the app. ID prefixes match the gene symbol.</p>
  ${genesHtml}

  <div class="pagebreak"></div>
  <h3>Global content review</h3>
  ${claim("Crisis resources shown to users (accuracy &amp; appropriateness)", crisisHtml, { tag: "G" })}
  ${claim("Medical disclaimer &amp; acknowledgment-gate wording (sufficient &amp; prominent)",
    "App displays a first-run acknowledgment gate plus per-page caution banners stating the app is "
    + "educational only, not medical advice/diagnosis/treatment, not a medical device, and instructing "
    + "users never to start/stop/change medication, supplement, or diet without their prescriber.", { tag: "G" })}
  ${claim("“Pending independent clinical review” status statement (honest &amp; appropriate until sign-off)",
    esc(INFO.review.detail), { tag: "G" })}
  ${claim("Privacy statement (no data collection, no tracking) — consistent with app behavior",
    "App runs entirely on-device; states it collects, stores, and transmits no personal or health data and uses no analytics or accounts.", { tag: "G" })}

  <div class="pagebreak"></div>
  <h3>Reviewer attestation</h3>
  <div class="box">
    <p>I am a licensed healthcare professional qualified to evaluate the content above. I have reviewed
    the claims in this packet and recorded my determinations (approve / approve with edits / remove)
    for each. Subject to the edits I have noted, the content is, to the best of my professional
    judgment, accurate, evidence-aligned, appropriately sourced, and presented as general education
    rather than individualized medical advice, diagnosis, or treatment.</p>
    <p class="muted sans" style="font-size:9pt">This attestation reflects content review only and does
    not create a clinician–patient relationship with any app user, nor does it warrant outcomes for any
    individual. Final regulatory and legal responsibility for distribution remains with the publisher.</p>

    <div class="sign-row">
      <div class="sign-field"><div class="sign-line"></div><div class="sign-cap">Signature</div></div>
      <div class="sign-field"><div class="sign-line"></div><div class="sign-cap">Printed name &amp; credentials</div></div>
    </div>
    <div class="sign-row">
      <div class="sign-field"><div class="sign-line"></div><div class="sign-cap">License # / state</div></div>
      <div class="sign-field"><div class="sign-line"></div><div class="sign-cap">Date</div></div>
    </div>
  </div>

  <p class="muted sans" style="font-size:8.5pt;margin-top:16px">
    Generated from js/data.js · ${esc(INFO.name)} v${esc(INFO.version)} · Total claims for review: ${itemSeq}.
    Once signed, record the reviewer in APP_INFO.reviewerSignoff (name, credentials, date) to update the in-app status.
  </p>

</div></body></html>`;

const outDir = path.join(__dirname, "..", "reviewer");
fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, "clinical-review-packet.html");
fs.writeFileSync(outFile, html);
console.log("Wrote", outFile);
console.log("Genes:", GENES.length, "| total review items:", itemSeq);
