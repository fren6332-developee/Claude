/*
 * NeuroNourish — gene database
 * -----------------------------------------------------------------------------
 * Educational content compiled and cross-referenced against guidance and reviews
 * from the American Psychiatric Association (APA), National Institute of Mental
 * Health (NIMH), International Society for Nutritional Psychiatry Research
 * (ISNPR), the Food & Mood Centre (Deakin University), the American Society for
 * Nutrition (ASN), and the Global Brain Health Institute (GBHI).
 *
 * Where these bodies differ, the app presents the conservative, consensus view
 * and flags items that are emerging rather than established. Nutrition content
 * reflects whole-diet patterns (e.g., Mediterranean / "SMILES"-style diets) that
 * these organizations broadly endorse as ADJUNCTS to — never replacements for —
 * clinical care.
 *
 * IMPORTANT: This is educational information, not medical advice, and not a
 * substitute for the official Genomind report or a clinician's judgment. Foods
 * do not "replace" medications; "mimic" below means a food influences the same
 * biological pathway in a gentler, supportive way.
 *
 * Gene list source: Genomind Pharmacogenetic Report / NIH Genetic Testing
 * Registry (GTR000523653, last updated October 2025).
 */

const CONSENSUS_BODIES = [
  { abbr: "APA",  name: "American Psychiatric Association" },
  { abbr: "NIMH", name: "National Institute of Mental Health" },
  { abbr: "ISNPR",name: "International Society for Nutritional Psychiatry Research" },
  { abbr: "FMC",  name: "Food & Mood Centre (Deakin University)" },
  { abbr: "ASN",  name: "American Society for Nutrition" },
  { abbr: "GBHI", name: "Global Brain Health Institute" }
];

const GENE_CATEGORIES = {
  metabolism:   { label: "Drug Metabolism (CYP450 & Phase II)", color: "#6C63FF" },
  transporter:  { label: "Drug Transporters",                   color: "#00B8A9" },
  serotonergic: { label: "Serotonin Pathway",                   color: "#F6416C" },
  dopaminergic: { label: "Dopamine / Adrenergic Pathway",       color: "#FF9F45" },
  signaling:    { label: "Neuronal Signaling & Mood",           color: "#3DA5D9" },
  other:        { label: "Other Targets & Response",            color: "#7B6CF6" }
};

/* action types for foods */
const FOOD_ACTIONS = {
  amplify:  { label: "Amplify",  hint: "supports or boosts healthy gene activity", color: "#2E9E5B" },
  modulate: { label: "Modulate", hint: "helps balance over- or under-activity",     color: "#E0A100" },
  protect:  { label: "Protect",  hint: "buffers the brain against the deficiency",   color: "#3B82C4" }
};

const GENES = [
  /* ===================== PHARMACOKINETIC — METABOLISM ===================== */
  {
    symbol: "CYP1A2", name: "Cytochrome P450 1A2", locus: "15q24.1",
    category: "metabolism",
    population: "Very common. The fast-metabolizer version (CYP1A2*1F) is carried by roughly 40–50% of people, and its activity swings widely with smoking and diet.",
    plain: "CYP1A2 is one of your liver's recycling machines. Its job is to break down certain medicines and even the caffeine in your coffee. Some people have a fast version of this machine and some have a slow version. If yours runs fast, a medicine can leave your body before it has a chance to fully work. If yours runs slow, the same medicine can build up and cause more side effects. Knowing your speed helps a doctor pick the right starting dose, so you feel better sooner and safer.",
    analogy: "Imagine a coffee grinder in your kitchen. Some grinders run on high and pulverize the beans in seconds; others run slow. CYP1A2 is your body's 'grinder' for certain medicines and for the caffeine in coffee. A fast grinder can chew through a medicine before it finishes its job; a slow one lets it pile up. Your doctor just needs to know which grinder you have.",
    illnesses: ["Schizophrenia (clozapine, olanzapine dosing)", "Bipolar disorder", "Depression where caffeine sensitivity is a clue"],
    drugs: [
      { name: "Clozapine", cls: "Antipsychotic", note: "Largely cleared by CYP1A2; slow metabolizers reach higher blood levels, fast metabolizers (often smokers) may need higher doses." },
      { name: "Olanzapine", cls: "Antipsychotic", note: "CYP1A2 is a major route; smoking induces the enzyme and lowers levels." },
      { name: "Duloxetine", cls: "SNRI antidepressant", note: "Partly CYP1A2-dependent; activity changes alter exposure." }
    ],
    pharmacology: "Pharmacokinetics: CYP1A2 governs how fast these drugs are cleared, so it mainly shifts blood concentration, not the drug's mechanism. Pharmacodynamics: levels that run too high amplify sedation and metabolic side effects; too low blunts efficacy. The enzyme is strongly INDUCED (sped up) by tobacco smoke and char-grilled food, and INHIBITED (slowed) by caffeine competition and certain fluoroquinolone antibiotics.",
    foods: [
      { action: "modulate", name: "Cruciferous vegetables (broccoli, Brussels sprouts)", why: "Indole compounds gently induce CYP1A2, helping normalize sluggish clearance.",
        bio: [
          "<strong>Sulforaphane</strong> switches on the Nrf2 pathway, activating the brain's own antioxidant defenses against oxidative stress.",
          "<strong>Indole-3-carbinol</strong> curbs neuroinflammation and supports clearance of neurotoxins.",
          "<strong>Kaempferol</strong>, a flavonoid, has been shown to shield neurons and quiet inflammatory microglia."
        ] },
      { action: "modulate", name: "Coffee / caffeine (in moderation)", why: "Caffeine is a CYP1A2 substrate; tracking your caffeine response is a real-world clue to your enzyme speed.",
        bio: [
          "<strong>Caffeine</strong> blocks adenosine receptors to sharpen alertness and is linked in studies to lower neurodegenerative risk.",
          "<strong>Chlorogenic acid</strong> is a polyphenol antioxidant that protects neurons from oxidative damage.",
          "<strong>Trigonelline</strong> supports neurite outgrowth and memory-related signaling."
        ] },
      { action: "protect", name: "Apiaceous vegetables (carrots, celery, parsley)", why: "Naturally slow excessive CYP1A2 activity, smoothing big swings.",
        bio: [
          "<strong>Luteolin</strong> (celery, parsley) calms brain inflammation and supports memory circuits.",
          "<strong>Apigenin</strong> promotes new neuron formation and has calming, anti-anxiety effects.",
          "<strong>Beta-carotene</strong> (carrots) is an antioxidant that protects nerve-cell membranes."
        ] },
      { action: "amplify", name: "Fatty fish (omega-3s)", why: "Supports overall liver and neuronal membrane health that surrounds this pathway.",
        bio: [
          "<strong>DHA</strong> is a core structural fat of neuron membranes and synapses, keeping signaling fluid.",
          "<strong>EPA</strong> lowers the neuroinflammation associated with low mood.",
          "<strong>Vitamin D</strong> (abundant in fatty fish) helps regulate the enzyme that makes brain serotonin."
        ] },
      { action: "protect", name: "Grapefruit & citrus (occasional)", why: "Mild enzyme dampening that can steady erratic metabolism — discuss with your prescriber first.",
        bio: [
          "<strong>Naringenin</strong> is a flavonoid antioxidant that crosses into the brain and protects neurons.",
          "<strong>Hesperidin</strong> supports blood–brain-barrier integrity and reduces oxidative stress.",
          "<strong>Vitamin C</strong> is concentrated in the brain and defends neurons against free radicals."
        ] }
    ],
    foodMimic: "There is no food that replaces clozapine or olanzapine. But cruciferous vegetables nudge the SAME enzyme these drugs depend on, which is why a sudden change in your vegetable or coffee intake can change how a medicine feels — a reason to keep diet steady once a dose is set."
  },
  {
    symbol: "CYP2B6", name: "Cytochrome P450 2B6", locus: "19q13.2",
    category: "metabolism",
    population: "Reduced-function variants are common; about 1 in 16 people (~6%) are poor metabolizers, with intermediate activity far more frequent.",
    plain: "CYP2B6 is another liver helper. It breaks down a specific group of medicines, including bupropion, a drug often used for depression and to help people quit smoking. If your CYP2B6 works slowly, that medicine can pile up; if it works quickly, it may clear before it helps. This gene is a good example of why two people taking the exact same pill can have very different experiences.",
    analogy: "Think of a food processor that both chops and purées. CYP2B6 first 'switches on' certain medicines like bupropion, then helps clear them out. If your processor runs slow, the ingredients (the drug) linger in the bowl; if it's fast, they're gone before you can use them — which is why the same pill can do so much for one person and little for another.",
    illnesses: ["Depression (bupropion)", "Tobacco use disorder / smoking cessation", "ADHD when bupropion is used off-label"],
    drugs: [
      { name: "Bupropion", cls: "Atypical antidepressant (NDRI)", note: "Converted by CYP2B6 to its active form; variant activity changes how much active drug you make." },
      { name: "Methadone", cls: "Opioid agonist", note: "CYP2B6 is a primary clearance route; slow metabolizers risk accumulation." },
      { name: "Sertraline", cls: "SSRI antidepressant", note: "Partly handled by CYP2B6 among several enzymes." }
    ],
    pharmacology: "Pharmacokinetics dominate here: CYP2B6 controls both activation (bupropion → hydroxybupropion) and clearance, so a variant can simultaneously change potency and duration. Pharmacodynamically, higher active-metabolite levels increase both benefit and the risk of insomnia, agitation, or seizure threshold lowering.",
    foods: [
      { action: "protect", name: "Leafy greens (folate-rich)", why: "Support liver methylation and overall detox capacity around this enzyme.",
        bio: [
          "<strong>Folate (B9)</strong> is a cofactor for building serotonin, dopamine and norepinephrine.",
          "<strong>Lutein</strong> accumulates in the brain and is linked to better memory and processing speed.",
          "<strong>Magnesium</strong> supports over 300 neuronal enzymes and calms excitable nerves."
        ] },
      { action: "amplify", name: "Garlic & onions", why: "Organosulfur compounds support Phase I/II liver enzyme balance.",
        bio: [
          "<strong>S-allyl cysteine</strong> is a neuroprotective antioxidant shown to guard neurons from oxidative injury.",
          "<strong>Quercetin</strong> (onions) crosses into the brain and reduces neuroinflammation.",
          "<strong>Allicin</strong> supports healthy cerebral blood flow and antioxidant defenses."
        ] },
      { action: "modulate", name: "Green tea", why: "Polyphenols gently influence CYP activity and provide calm, focused energy.",
        bio: [
          "<strong>L-theanine</strong> raises calming alpha brain waves and boosts GABA for relaxed focus.",
          "<strong>EGCG</strong> is a catechin antioxidant that protects neurons and supports plasticity.",
          "<strong>Caffeine + theanine</strong> together improve attention without the jittery crash."
        ] },
      { action: "amplify", name: "Berries (anthocyanins)", why: "Antioxidant support for hepatocytes carrying this enzyme.",
        bio: [
          "<strong>Anthocyanins</strong> cross into the brain and are linked to slower cognitive decline.",
          "<strong>Pterostilbene</strong> (blueberries) reduces neuroinflammation and oxidative stress.",
          "<strong>Vitamin C</strong> regenerates other brain antioxidants and protects neurons."
        ] },
      { action: "protect", name: "Turmeric (with black pepper)", why: "Curcumin modulates several CYP enzymes; supports antioxidant defense.",
        bio: [
          "<strong>Curcumin</strong> has been shown to raise BDNF and reduce brain inflammation.",
          "<strong>Turmerones</strong> may promote neural stem-cell growth and repair.",
          "<strong>Piperine</strong> (black pepper) boosts curcumin absorption so more reaches the brain."
        ] }
    ],
    foodMimic: "No food reproduces bupropion's dopamine-norepinephrine boost. Protein-rich foods supplying tyrosine (eggs, lean meat, soy) feed the SAME dopamine pathway bupropion targets, offering gentle daytime support that complements treatment."
  },
  {
    symbol: "CYP2C9", name: "Cytochrome P450 2C9", locus: "10q23.33",
    category: "metabolism",
    population: "Intermediate metabolizers are common (~35%); full poor metabolizers are less common (~1–3%), more frequent in people of European ancestry.",
    plain: "CYP2C9 breaks down certain mood stabilizers, pain relievers, and blood thinners. If your version is slow, these medicines hang around longer and can cause more side effects at normal doses. Doctors pay special attention to this gene because some of the drugs it handles, like warfarin, have a narrow safety window.",
    analogy: "Picture a sink drain. CYP2C9 is how fast the water — a medicine — drains away. A slow drain means the sink fills higher: fine for a bath, risky if it overflows. For 'narrow-window' drugs like blood thinners, keeping that drain steady and predictable is exactly what keeps things safe.",
    illnesses: ["Bipolar disorder (some anticonvulsant mood stabilizers)", "Anxiety with chronic pain overlap", "Seizure-related mood conditions"],
    drugs: [
      { name: "Phenytoin", cls: "Anticonvulsant / mood-related", note: "Narrow therapeutic range; slow CYP2C9 raises toxicity risk." },
      { name: "Fluoxetine (metabolite handling)", cls: "SSRI antidepressant", note: "Interacts with CYP2C9 substrates and can inhibit the enzyme." },
      { name: "NSAIDs (e.g., ibuprofen)", cls: "Pain reliever", note: "Common comedication; slow metabolizers face higher GI/renal risk." }
    ],
    pharmacology: "Almost entirely a pharmacokinetic gene — it sets clearance rate. Because several CYP2C9 drugs are dose-sensitive, small metabolic differences translate into meaningful safety differences. Pharmacodynamically the receptor targets are unchanged; the risk comes from concentration alone.",
    foods: [
      { action: "protect", name: "Vitamin K greens (kale, spinach) — kept STEADY", why: "If on warfarin, consistency matters more than amount; steadiness protects against swings.",
        bio: [
          "<strong>Vitamin K</strong> helps build sphingolipids, fatty molecules vital to nerve-cell membranes.",
          "<strong>Lutein & zeaxanthin</strong> concentrate in the brain and support cognition.",
          "<strong>Folate</strong> lowers homocysteine, a compound tied to low mood and cognitive decline."
        ] },
      { action: "amplify", name: "Citrus (vitamin C)", why: "Antioxidant support for liver enzyme function.",
        bio: [
          "<strong>Vitamin C</strong> is a cofactor for making dopamine and norepinephrine.",
          "<strong>Hesperidin</strong> protects the blood–brain barrier and eases neuroinflammation.",
          "<strong>Folate</strong> (citrus) supports neurotransmitter synthesis and nerve health."
        ] },
      { action: "modulate", name: "Ginger", why: "Anti-inflammatory; gentle support but can affect bleeding — coordinate with your clinician.",
        bio: [
          "<strong>6-Gingerol</strong> is an antioxidant shown to protect neurons and support memory.",
          "<strong>Shogaol</strong> reduces neuroinflammation and may aid learning.",
          "<strong>Zingerone</strong> helps buffer neurons against oxidative stress."
        ] },
      { action: "amplify", name: "Whole grains (B vitamins)", why: "Cofactors for healthy hepatic metabolism.",
        bio: [
          "<strong>Thiamine (B1)</strong> is essential for brain energy metabolism and nerve conduction.",
          "<strong>Vitamin B6</strong> is a cofactor for serotonin, dopamine and GABA synthesis.",
          "<strong>Magnesium & fiber</strong> steady blood sugar and calm nervous-system excitability."
        ] },
      { action: "protect", name: "Olive oil", why: "Mediterranean-diet fat that supports liver and vascular health.",
        bio: [
          "<strong>Oleocanthal</strong> has anti-inflammatory effects and may clear brain-aging proteins.",
          "<strong>Hydroxytyrosol</strong> is a potent polyphenol that protects neurons from oxidative stress.",
          "<strong>Oleic acid</strong> supports the myelin sheath that insulates nerve fibers."
        ] }
    ],
    foodMimic: "No food substitutes for an anticonvulsant or blood thinner. The key nutritional lesson here is CONSISTENCY: foods rich in vitamin K interact with CYP2C9-cleared warfarin, so keeping intake steady is the food strategy clinicians actually endorse."
  },
  {
    symbol: "CYP2C19", name: "Cytochrome P450 2C19", locus: "10q23.33",
    category: "metabolism",
    population: "Poor metabolizers are ~2–5% in European/African ancestry and up to ~15% in East Asian ancestry; the ultra-rapid *17 variant is carried by roughly 30%.",
    plain: "CYP2C19 is a star player in mental health because it breaks down several of the most common antidepressants, like citalopram and escitalopram. If you're a slow metabolizer, a normal dose can act like a high dose, bringing more side effects. If you're an ultra-fast metabolizer, the same dose may barely work. This is one of the genes doctors most often use to fine-tune antidepressant choices.",
    analogy: "Think of a dimmer switch on a light. For the exact same 'setting' (the dose), a slow CYP2C19 lights the room too brightly — the drug builds up — while a fast one barely lights it at all. Doctors fine-tune the switch to your personal wiring so the room ends up just right.",
    illnesses: ["Major depressive disorder", "Generalized & social anxiety", "Panic disorder", "OCD"],
    drugs: [
      { name: "Escitalopram / Citalopram", cls: "SSRI antidepressant", note: "Poor metabolizers reach higher levels (QT-interval caution); ultra-rapid may underrespond." },
      { name: "Sertraline", cls: "SSRI antidepressant", note: "CYP2C19 contributes to clearance; phenotype shifts exposure." },
      { name: "Amitriptyline / TCAs", cls: "Tricyclic antidepressant", note: "Guideline (CPIC) dosing adjustments by CYP2C19 + CYP2D6 phenotype." }
    ],
    pharmacology: "Pharmacokinetic gene with strong, guideline-backed dosing implications (CPIC). Pharmacodynamically the SSRI mechanism is unchanged, but exposure swings shift the balance between therapeutic serotonin reuptake blockade and dose-related effects such as QT prolongation in poor metabolizers.",
    foods: [
      { action: "amplify", name: "Fatty fish (EPA/DHA omega-3)", why: "ISNPR-supported adjunct for depression; supports serotonergic signaling the SSRIs act on.",
        bio: [
          "<strong>EPA</strong> is the omega-3 with the strongest evidence for easing depressive symptoms.",
          "<strong>DHA</strong> builds neuron membranes and supports serotonin-receptor signaling.",
          "<strong>Vitamin D</strong> regulates tryptophan hydroxylase, the enzyme that makes serotonin."
        ] },
      { action: "protect", name: "Fermented foods (yogurt, kefir, kimchi)", why: "Gut-brain axis support; ~90% of serotonin is made in the gut.",
        bio: [
          "<strong>Probiotic bacteria</strong> (Lactobacillus, Bifidobacterium) produce GABA and serotonin precursors.",
          "<strong>Short-chain fatty acids</strong> like butyrate nourish the gut–brain barrier and calm inflammation.",
          "<strong>Vitamin K2</strong> from fermentation supports nerve-membrane lipids."
        ] },
      { action: "amplify", name: "Tryptophan-rich foods (turkey, eggs, seeds)", why: "Provide the raw material for serotonin synthesis.",
        bio: [
          "<strong>Tryptophan</strong> is the direct amino-acid precursor the brain converts into serotonin.",
          "<strong>Choline</strong> (eggs) builds acetylcholine for memory and focus.",
          "<strong>Zinc</strong> (seeds) is a cofactor for neurotransmitter release and mood regulation."
        ] },
      { action: "modulate", name: "Dark leafy greens (folate)", why: "Folate is a cofactor for monoamine synthesis.",
        bio: [
          "<strong>Folate (B9)</strong> drives methylation reactions that build serotonin and dopamine.",
          "<strong>Magnesium</strong> supports NMDA-receptor balance and eases stress reactivity.",
          "<strong>Lutein</strong> deposits in neural tissue and supports cognitive performance."
        ] },
      { action: "protect", name: "Berries & colorful produce", why: "Polyphenols reduce neuroinflammation linked to low mood.",
        bio: [
          "<strong>Anthocyanins</strong> cross into the brain and enhance memory and neuroplasticity.",
          "<strong>Quercetin</strong> quiets inflammatory signaling in the brain.",
          "<strong>Vitamin C</strong> is a cofactor for dopamine synthesis and a key neural antioxidant."
        ] }
    ],
    foodMimic: "SSRIs raise serotonin by blocking its reuptake. Foods can't do that, but tryptophan-rich proteins plus a fiber-rich, fermented-food diet support the body's OWN serotonin production along the same pathway — the nutritional-psychiatry approach endorsed as a complement to medication."
  },
  {
    symbol: "CYP2D6", name: "Cytochrome P450 2D6", locus: "22q13.2",
    category: "metabolism",
    population: "Highly variable: ~5–10% poor metabolizers in European ancestry; ultra-rapid metabolizers range ~1–10% globally and up to ~20–30% in some North-African/Middle-Eastern populations.",
    plain: "CYP2D6 is one of the busiest liver enzymes in psychiatry — it helps break down many antidepressants, antipsychotics, and pain medicines. People come in four speeds: poor, intermediate, normal, and ultra-rapid. Your speed can change whether a normal dose is too strong, just right, or too weak. Because it handles so many drugs, this is often the single most useful gene on a mental-health panel.",
    analogy: "Imagine a busy airport with baggage carousels running at different speeds. CYP2D6 is the carousel handling the most 'luggage' — more psychiatric medicines than almost any other. Some carousels crawl, some race. Match the speed wrong and bags either pile up or fly off the belt, which is why knowing your speed is so useful.",
    illnesses: ["Depression", "Anxiety disorders", "Schizophrenia", "ADHD (atomoxetine)", "Chronic pain with mood overlap"],
    drugs: [
      { name: "Fluoxetine / Paroxetine", cls: "SSRI antidepressant", note: "Both substrates and strong inhibitors of CYP2D6 — they can slow their own and other drugs' metabolism." },
      { name: "Risperidone / Aripiprazole", cls: "Antipsychotic", note: "Clearance depends on CYP2D6 phenotype; poor metabolizers accumulate active drug." },
      { name: "Atomoxetine", cls: "Non-stimulant ADHD medication", note: "CPIC dosing guidance by CYP2D6 phenotype." }
    ],
    pharmacology: "A pharmacokinetic powerhouse. Pharmacodynamics matter indirectly: ultra-rapid metabolizers can fail therapy because too little active drug forms (or, for prodrugs like codeine, too MUCH active opioid forms — a safety hazard). Many SSRIs both use and inhibit CYP2D6, creating clinically important drug–drug interactions.",
    foods: [
      { action: "amplify", name: "Omega-3 fish (salmon, sardines)", why: "Broad support for the neurotransmitter systems these drugs target.",
        bio: [
          "<strong>DHA</strong> forms the fluid membranes that dopamine and serotonin receptors sit in.",
          "<strong>EPA</strong> dampens neuroinflammation tied to mood disorders.",
          "<strong>Astaxanthin</strong> (salmon) is a carotenoid antioxidant that crosses into the brain."
        ] },
      { action: "protect", name: "Cruciferous vegetables", why: "Support balanced liver detoxification around heavy CYP2D6 traffic.",
        bio: [
          "<strong>Sulforaphane</strong> activates Nrf2 to boost the brain's antioxidant shield.",
          "<strong>Indole-3-carbinol</strong> reduces neuroinflammation and supports detox pathways.",
          "<strong>Vitamin K</strong> supports the sphingolipids that make up nerve membranes."
        ] },
      { action: "modulate", name: "Green tea (L-theanine)", why: "Calming amino acid that supports focus without overstimulation.",
        bio: [
          "<strong>L-theanine</strong> raises GABA and alpha waves for calm, alert focus.",
          "<strong>EGCG</strong> protects dopaminergic neurons from oxidative stress.",
          "<strong>Theanine + caffeine</strong> improve sustained attention with less jitter."
        ] },
      { action: "amplify", name: "Eggs & lean protein (tyrosine)", why: "Feed dopamine/norepinephrine pathways many CYP2D6 drugs act on.",
        bio: [
          "<strong>Tyrosine</strong> is the amino-acid building block for dopamine and norepinephrine.",
          "<strong>Choline</strong> is converted to acetylcholine for memory and attention.",
          "<strong>Vitamin B12</strong> maintains the myelin sheath insulating nerve fibers."
        ] },
      { action: "protect", name: "Colorful antioxidants (peppers, berries)", why: "Reduce oxidative stress on metabolizing tissue.",
        bio: [
          "<strong>Vitamin C</strong> (peppers) is a cofactor for dopamine synthesis and a neural antioxidant.",
          "<strong>Anthocyanins</strong> (berries) enhance neuroplasticity and memory.",
          "<strong>Capsanthin</strong> (red peppers) is a carotenoid that buffers oxidative brain stress."
        ] }
    ],
    foodMimic: "No food matches an antipsychotic or SSRI. But because CYP2D6 sits at the crossroads of dopamine and serotonin drug handling, a steady protein-and-omega-3 diet supports those SAME neurotransmitters naturally — useful background support, never a replacement."
  },
  {
    symbol: "CYP3A4", name: "Cytochrome P450 3A4", locus: "7q22.1",
    category: "metabolism",
    population: "The reduced-function CYP3A4*22 variant is carried by roughly 5–8% of people; activity also varies widely with diet and other drugs even without a variant.",
    plain: "CYP3A4 is the body's workhorse enzyme — it helps break down more than half of all medicines, including many used for anxiety, sleep, and mood. Because it handles so much, it's very sensitive to what else you eat or take. Grapefruit is the famous example: it can slow this enzyme and make some medicines stronger than intended.",
    analogy: "Think of the main highway out of a city. CYP3A4 is the road most of your medicines take to leave the body. Grapefruit acts like a sudden lane closure — traffic (the drug) backs up and levels climb higher than planned. That's why something as ordinary as a food can change how a pill feels.",
    illnesses: ["Anxiety (many benzodiazepines)", "Bipolar disorder", "Depression", "Sleep disorders"],
    drugs: [
      { name: "Alprazolam / Midazolam", cls: "Benzodiazepine", note: "Heavily CYP3A4-dependent; inhibition causes oversedation." },
      { name: "Quetiapine", cls: "Antipsychotic", note: "Major CYP3A4 substrate; levels swing with inhibitors/inducers." },
      { name: "Pimozide / certain antipsychotics", cls: "Antipsychotic", note: "CYP3A4 interactions can raise cardiac (QT) risk." }
    ],
    pharmacology: "Pharmacokinetic gene with the broadest drug coverage of all. Its hallmark is sensitivity to INHIBITORS (grapefruit, certain antifungals/antibiotics) and INDUCERS (St. John's Wort, carbamazepine). Pharmacodynamically the danger is concentration-driven: oversedation from benzodiazepines or QT prolongation from antipsychotics.",
    foods: [
      { action: "protect", name: "Avoid grapefruit/Seville orange when on 3A4 drugs", why: "These potently inhibit CYP3A4 and can dangerously raise drug levels.",
        bio: [
          "<strong>Furanocoumarins</strong> are the very compounds that block CYP3A4 — the reason to keep grapefruit off the plate on these drugs.",
          "<strong>Naringin</strong> is antioxidant, but it also slows drug clearance, so its brain benefit isn't worth the interaction risk here.",
          "The safest protective step is <strong>avoidance</strong>, not the plant's chemistry — confirm with your prescriber."
        ] },
      { action: "amplify", name: "Cruciferous vegetables", why: "Support balanced enzyme activity and detox pathways.",
        bio: [
          "<strong>Sulforaphane</strong> triggers the Nrf2 antioxidant response that protects neurons.",
          "<strong>Indole-3-carbinol</strong> lowers neuroinflammation and aids detoxification.",
          "<strong>Folate</strong> supports methylation and neurotransmitter production."
        ] },
      { action: "modulate", name: "Turmeric", why: "Mild CYP3A4 modulation plus anti-inflammatory benefit.",
        bio: [
          "<strong>Curcumin</strong> has been shown to raise BDNF and reduce brain inflammation.",
          "<strong>Turmerones</strong> may support neural repair and stem-cell activity.",
          "<strong>Curcuminoids</strong> are potent antioxidants that cross into brain tissue."
        ] },
      { action: "protect", name: "Olive oil & Mediterranean fats", why: "Support hepatic membrane health.",
        bio: [
          "<strong>Oleocanthal</strong> is anti-inflammatory and may help clear brain-aging proteins.",
          "<strong>Hydroxytyrosol</strong> protects neurons and mitochondria from oxidative stress.",
          "<strong>Oleic acid</strong> supports myelin and overall nerve-membrane health."
        ] },
      { action: "amplify", name: "Pomegranate (in moderation)", why: "Antioxidant-rich; monitor, as concentrated juice can mildly affect 3A4.",
        bio: [
          "<strong>Punicalagins</strong> are powerful antioxidants linked to neuroprotection.",
          "<strong>Ellagic acid</strong> reduces neuroinflammation and oxidative damage.",
          "<strong>Urolithin A</strong> (a gut metabolite) supports mitochondrial renewal in neurons."
        ] }
    ],
    foodMimic: "The most important food fact for CYP3A4 isn't mimicry — it's avoidance. Grapefruit can turn a normal benzodiazepine or antipsychotic dose into an overdose by blocking this enzyme. The 'food strategy' clinicians stress here is knowing which foods to keep OFF your plate."
  },
  {
    symbol: "CYP3A5", name: "Cytochrome P450 3A5", locus: "7q22.1",
    category: "metabolism",
    population: "Expression varies sharply by ancestry: most people of European ancestry are non-expressers (~85–90% carry *3/*3), while many people of African ancestry actively express the enzyme.",
    plain: "CYP3A5 is a close partner to CYP3A4 and helps clear some of the same medicines. Whether you 'express' (switch on) this enzyme depends a lot on your ancestry. People who express it may clear certain drugs faster and need different doses. It's a good reminder that one-size-fits-all dosing doesn't fit everyone.",
    analogy: "Imagine a second checkout lane that some stores open and others keep closed. CYP3A5 is that 'extra lane' for clearing medicines — switched on in some people (often depending on ancestry) and switched off in others. When the lane is open, the line moves faster, so one-size-fits-all dosing doesn't fit everyone.",
    illnesses: ["Conditions overlapping with CYP3A4 drugs", "Mood disorders on antipsychotics", "Anxiety on benzodiazepines"],
    drugs: [
      { name: "Quetiapine", cls: "Antipsychotic", note: "Shared 3A pathway; expression can speed clearance." },
      { name: "Midazolam", cls: "Benzodiazepine", note: "Classic 3A probe; expression affects exposure." },
      { name: "Tacrolimus (comedication)", cls: "Immunosuppressant", note: "Strong 3A5 effect; relevant for transplant patients also on psychotropics." }
    ],
    pharmacology: "Pharmacokinetic, working alongside CYP3A4. Because expression is largely ancestry-linked, CYP3A5 is a key reason population-average doses can miss the mark. Pharmacodynamics are unchanged; the practical effect is on how much drug reaches the brain.",
    foods: [
      { action: "amplify", name: "Cruciferous vegetables", why: "Support overall 3A-family balance.",
        bio: [
          "<strong>Sulforaphane</strong> activates Nrf2 antioxidant defenses in the brain.",
          "<strong>Kaempferol</strong> protects neurons and calms inflammatory microglia.",
          "<strong>Vitamin K</strong> supports nerve-membrane sphingolipids."
        ] },
      { action: "protect", name: "Be cautious with grapefruit", why: "Like 3A4, the 3A5 partner is inhibited by grapefruit constituents.",
        bio: [
          "<strong>Furanocoumarins</strong> inhibit the 3A pathway — the reason for caution on these drugs.",
          "<strong>Naringenin</strong> is a brain-active antioxidant, but the drug interaction outweighs it here.",
          "The protective action is <strong>consistency/avoidance</strong> — clear it with your prescriber."
        ] },
      { action: "modulate", name: "Green tea", why: "Polyphenols gently influence 3A activity.",
        bio: [
          "<strong>L-theanine</strong> promotes calm focus by raising GABA and alpha waves.",
          "<strong>EGCG</strong> is a catechin that protects neurons and supports plasticity.",
          "<strong>Polyphenols</strong> reduce oxidative stress across brain tissue."
        ] },
      { action: "amplify", name: "Leafy greens", why: "Folate and antioxidants support hepatic function.",
        bio: [
          "<strong>Folate</strong> is a cofactor for serotonin and dopamine synthesis.",
          "<strong>Lutein</strong> concentrates in the brain and supports cognition.",
          "<strong>Magnesium</strong> calms nervous-system excitability."
        ] },
      { action: "protect", name: "Olive oil", why: "Supports liver membrane integrity.",
        bio: [
          "<strong>Hydroxytyrosol</strong> is a polyphenol that shields neurons from oxidative stress.",
          "<strong>Oleocanthal</strong> provides anti-inflammatory protection for the brain.",
          "<strong>Oleic acid</strong> supports the myelin insulating nerve fibers."
        ] }
    ],
    foodMimic: "CYP3A5 has no direct drug it 'mimics.' Its practical message echoes CYP3A4: a steady, grapefruit-free diet keeps shared-pathway drug levels predictable, which is what providers want when fine-tuning a dose."
  },
  {
    symbol: "UGT1A4", name: "UDP-Glucuronosyltransferase 1A4", locus: "2q37.1",
    category: "metabolism",
    population: "Functional variants are moderately common and differ by ancestry; they meaningfully shift how fast lamotrigine and some antipsychotics are cleared.",
    plain: "UGT1A4 is a 'Phase 2' liver enzyme — it tags certain drugs with a sugar molecule so the body can flush them out. One of its most important jobs is clearing lamotrigine, a mood stabilizer. If this enzyme is slow, lamotrigine levels can rise; if it's fast, they can fall. This matters because lamotrigine must be increased slowly to stay safe.",
    analogy: "Think of putting a stamped address label on a package so the post office can ship it out. UGT1A4 sticks a 'shipping label' on certain medicines like lamotrigine so your body can mail them away. A slow labeler means packages sit around longer — a reason lamotrigine is raised slowly and carefully.",
    illnesses: ["Bipolar disorder (lamotrigine maintenance)", "Depression with mood instability", "Seizure-related mood conditions"],
    drugs: [
      { name: "Lamotrigine", cls: "Mood stabilizer / anticonvulsant", note: "Primarily cleared by UGT1A4; variant activity changes levels and titration needs." },
      { name: "Olanzapine (glucuronidation)", cls: "Antipsychotic", note: "Partly handled by UGT enzymes." },
      { name: "Asenapine", cls: "Antipsychotic", note: "UGT1A4 contributes to clearance." }
    ],
    pharmacology: "A Phase II (conjugation) pharmacokinetic gene. Because lamotrigine requires slow, careful dose increases to avoid serious rash, UGT1A4 activity is clinically important for both efficacy and safety. Hormones and other drugs (e.g., estrogen-containing contraceptives, valproate) also strongly change UGT1A4 activity.",
    foods: [
      { action: "amplify", name: "Cruciferous vegetables", why: "Induce UGT enzymes, supporting healthy Phase II conjugation.",
        bio: [
          "<strong>Sulforaphane</strong> switches on the Nrf2 antioxidant pathway that protects neurons.",
          "<strong>Indole-3-carbinol</strong> reduces neuroinflammation and aids detox.",
          "<strong>Folate</strong> fuels the methylation that builds mood neurotransmitters."
        ] },
      { action: "amplify", name: "Citrus peel & flavonoids", why: "Naringenin-type flavonoids support glucuronidation.",
        bio: [
          "<strong>Naringenin</strong> crosses into the brain and protects neurons from oxidative stress.",
          "<strong>Hesperidin</strong> supports blood–brain-barrier integrity and eases inflammation.",
          "<strong>Nobiletin</strong> (citrus peel) has been shown to support memory and neuroprotection."
        ] },
      { action: "protect", name: "Rooibos / herbal teas", why: "Antioxidant support without caffeine load.",
        bio: [
          "<strong>Aspalathin</strong> (rooibos) is a rare antioxidant flavonoid that buffers oxidative stress.",
          "<strong>Quercetin</strong> reduces neuroinflammation and supports mood.",
          "<strong>Chrysoeriol</strong> contributes gentle anti-inflammatory brain support."
        ] },
      { action: "modulate", name: "Soy foods", why: "Isoflavones interact with UGT activity; keep intake steady.",
        bio: [
          "<strong>Genistein</strong> is a phytoestrogen linked to neuroprotection and better cognition.",
          "<strong>Daidzein</strong> supports antioxidant defenses in neural tissue.",
          "<strong>Lecithin/choline</strong> (soy) supplies building blocks for acetylcholine and memory."
        ] },
      { action: "amplify", name: "Dandelion greens & bitters", why: "Traditional liver-supportive foods that encourage conjugation pathways.",
        bio: [
          "<strong>Luteolin</strong> calms brain inflammation and supports memory.",
          "<strong>Chicoric acid</strong> is an antioxidant polyphenol that protects neurons.",
          "<strong>Folate & vitamin K</strong> support neurotransmitter synthesis and nerve membranes."
        ] }
    ],
    foodMimic: "No food replaces a mood stabilizer. But cruciferous vegetables and citrus flavonoids nudge the SAME Phase II enzyme that clears lamotrigine — another reason to keep diet consistent while a clinician titrates the dose."
  },
  {
    symbol: "UGT2B15", name: "UDP-Glucuronosyltransferase 2B15", locus: "4q13.2",
    category: "metabolism",
    population: "The reduced-activity *2 variant is very common — roughly half of people carry it — affecting clearance of some benzodiazepines.",
    plain: "UGT2B15 is another Phase 2 enzyme that tags drugs for removal. It helps clear calming medicines like lorazepam and oxazepam. Because these are often used for anxiety and sleep, a slow version of this enzyme can make their effects last longer, which can be good for sleep but risky for daytime grogginess.",
    analogy: "Same 'shipping label' idea as its cousin: UGT2B15 labels calming medicines like lorazepam for removal. If the labeler works slowly, the package lingers — which can be helpful for a full night's sleep, but may leave you groggy the next morning, especially for older adults.",
    illnesses: ["Anxiety disorders", "Insomnia", "Acute agitation", "Alcohol-withdrawal management"],
    drugs: [
      { name: "Lorazepam", cls: "Benzodiazepine", note: "Cleared mainly by UGT2B15 glucuronidation; slow activity prolongs effect." },
      { name: "Oxazepam", cls: "Benzodiazepine", note: "Direct UGT2B15 substrate; favored in liver disease but still phenotype-sensitive." },
      { name: "Temazepam", cls: "Benzodiazepine (sleep)", note: "Glucuronidation-dependent clearance." }
    ],
    pharmacology: "Phase II pharmacokinetic gene. Notably, these benzodiazepines skip the busy CYP system, so UGT2B15 is their main exit route — making this gene unusually decisive for their duration. Pharmacodynamically the GABA effect is unchanged; lingering levels mean prolonged sedation and fall risk, especially in older adults.",
    foods: [
      { action: "amplify", name: "Cruciferous vegetables", why: "Induce UGT enzymes that clear these calming drugs.",
        bio: [
          "<strong>Sulforaphane</strong> activates Nrf2 antioxidant defenses in neurons.",
          "<strong>Kaempferol</strong> protects neurons and quiets inflammatory microglia.",
          "<strong>Vitamin K</strong> supports the sphingolipids in nerve membranes."
        ] },
      { action: "protect", name: "Magnesium-rich foods (pumpkin seeds, spinach)", why: "Support the same GABA-calming system, easing reliance on sedatives.",
        bio: [
          "<strong>Magnesium</strong> is a natural NMDA-receptor gatekeeper that calms over-excited neurons.",
          "<strong>Tryptophan</strong> (pumpkin seeds) is the precursor for serotonin and melatonin.",
          "<strong>Zinc</strong> supports GABA signaling and steady mood."
        ] },
      { action: "modulate", name: "Chamomile / herbal tea", why: "Gentle anxiolytic support via apigenin.",
        bio: [
          "<strong>Apigenin</strong> binds benzodiazepine sites on GABA receptors for a calming effect.",
          "<strong>Bisabolol</strong> is an anti-inflammatory compound that soothes the nervous system.",
          "<strong>Luteolin</strong> supports memory and reduces brain inflammation."
        ] },
      { action: "amplify", name: "Citrus flavonoids", why: "Support glucuronidation capacity.",
        bio: [
          "<strong>Hesperidin</strong> protects the blood–brain barrier and eases anxiety-like stress.",
          "<strong>Naringenin</strong> is a brain-active antioxidant that shields neurons.",
          "<strong>Vitamin C</strong> supports dopamine synthesis and neural antioxidant capacity."
        ] },
      { action: "protect", name: "Tart cherries (natural melatonin)", why: "Support sleep without prolonging drug sedation.",
        bio: [
          "<strong>Melatonin</strong> occurs naturally in tart cherries and regulates the sleep–wake cycle.",
          "<strong>Anthocyanins</strong> reduce neuroinflammation and support memory.",
          "<strong>Procyanidins</strong> are antioxidants that protect neurons from oxidative stress."
        ] }
    ],
    foodMimic: "Benzodiazepines calm the brain through the GABA system. Foods rich in magnesium, plus chamomile's apigenin and the amino acid theanine in tea, gently support that SAME GABA-calming pathway — a soothing, non-sedating complement that may reduce how much medication is needed (only ever changed with your prescriber)."
  },

  /* ===================== PHARMACOKINETIC — TRANSPORTERS ===================== */
  {
    symbol: "ABCB1", name: "ATP-Binding Cassette B1 (P-glycoprotein)", locus: "7q21.12",
    category: "transporter",
    population: "Extremely common variation — the C3435T variant allele is found in roughly half the population and influences how much drug crosses into the brain.",
    plain: "ABCB1 builds tiny pumps that sit on the blood-brain barrier, the brain's security gate. These pumps push some medicines back out of the brain to keep it protected. If your pumps are very active, an antidepressant may have a harder time getting in to do its job; if they're sluggish, more drug gets through. This helps explain why the same dose reaches different people's brains differently.",
    analogy: "Picture a bouncer at the door of the brain's VIP club. ABCB1 is that bouncer, pushing certain medicines back outside to keep the brain protected. A very strict bouncer keeps more of the drug out; a relaxed one lets more in — which helps explain why the same dose reaches different people's brains differently.",
    illnesses: ["Treatment-resistant depression", "Anxiety disorders", "Schizophrenia"],
    drugs: [
      { name: "Citalopram / Escitalopram", cls: "SSRI antidepressant", note: "P-gp substrates; transporter activity affects brain entry and response." },
      { name: "Venlafaxine", cls: "SNRI antidepressant", note: "Pumped by P-gp; variants linked to response differences." },
      { name: "Risperidone", cls: "Antipsychotic", note: "P-gp limits CNS penetration; activity shifts brain exposure." }
    ],
    pharmacology: "A pharmacokinetic transporter acting at the blood-brain barrier rather than in the liver. Its key effect is pharmacodynamic in practice: by gatekeeping how much drug reaches brain targets, ABCB1 can determine whether a 'normal' blood level translates into a real clinical effect. Some studies link variants to antidepressant response and side-effect burden.",
    foods: [
      { action: "modulate", name: "Black pepper (piperine)", why: "Inhibits P-gp, increasing how much of some compounds reach the brain — use mindfully.",
        bio: [
          "<strong>Piperine</strong> may raise brain serotonin and dopamine and boosts absorption of other nutrients.",
          "<strong>Piperine</strong> has antioxidant effects shown to protect neurons in studies.",
          "It enhances <strong>curcumin</strong> uptake, indirectly delivering more brain-protective compound."
        ] },
      { action: "modulate", name: "Green tea (EGCG)", why: "Modulates P-gp activity at the barrier.",
        bio: [
          "<strong>EGCG</strong> is a catechin antioxidant that protects neurons and supports plasticity.",
          "<strong>L-theanine</strong> promotes calm, focused attention via GABA and alpha waves.",
          "<strong>Polyphenols</strong> reduce oxidative stress at the blood–brain barrier."
        ] },
      { action: "amplify", name: "Curcumin (turmeric)", why: "Interacts with P-gp and supports anti-inflammatory brain protection.",
        bio: [
          "<strong>Curcumin</strong> raises BDNF and lowers brain inflammation in studies.",
          "<strong>Turmerones</strong> may support neural repair and stem-cell activity.",
          "<strong>Curcuminoids</strong> are strong antioxidants that reach brain tissue."
        ] },
      { action: "protect", name: "Omega-3 fish", why: "Supports healthy blood-brain barrier integrity.",
        bio: [
          "<strong>DHA</strong> is a key structural fat of neuron membranes and the barrier itself.",
          "<strong>EPA</strong> reduces the neuroinflammation linked to low mood.",
          "<strong>Vitamin D</strong> helps regulate serotonin-making enzymes."
        ] },
      { action: "amplify", name: "Quercetin foods (capers, apples, onions)", why: "Flavonoid that modulates transporter function.",
        bio: [
          "<strong>Quercetin</strong> crosses into the brain and reduces neuroinflammation.",
          "<strong>Quercetin</strong> supports mitochondrial health and protects against oxidative stress.",
          "<strong>Pectin</strong> (apples) feeds gut microbes that produce mood-supporting metabolites."
        ] }
    ],
    foodMimic: "ABCB1 isn't a drug target you can 'mimic,' but several food compounds (piperine, EGCG, quercetin) influence the SAME pump that controls drug entry into the brain. This is also a caution: these foods can change how much medication reaches your brain, so consistency and clinician awareness matter."
  },
  {
    symbol: "ABCG2", name: "ATP-Binding Cassette G2 (BCRP)", locus: "4q22.1",
    category: "transporter",
    population: "The reduced-function Q141K variant ranges from ~10% in European ancestry to ~30% or more in East Asian ancestry.",
    plain: "ABCG2 makes another protective pump, similar to ABCB1, that moves substances out of cells and helps guard the brain and gut. Variations change how well it works, which can affect how much of certain medicines and even some nutrients get absorbed and reach the brain. It's part of the body's overall traffic-control system for drugs.",
    analogy: "Think of a revolving door that keeps sweeping certain substances back outside. ABCG2 is that door in your gut and brain — a busy, active door absorbs less of a medicine, while a sluggish one lets more through. It's part of the body's traffic-control system for drugs and nutrients.",
    illnesses: ["Mood disorders (drug exposure effects)", "Conditions managed with transporter-substrate drugs"],
    drugs: [
      { name: "Certain antidepressants (substrates)", cls: "Antidepressant", note: "BCRP can limit absorption and CNS entry." },
      { name: "Rosuvastatin (comedication)", cls: "Cholesterol drug", note: "Strong BCRP substrate; relevant in patients on combined therapy." },
      { name: "Topotecan / select agents", cls: "Other", note: "Illustrates BCRP's broad transport role." }
    ],
    pharmacology: "Pharmacokinetic efflux transporter in gut, liver, and barrier tissues. Reduced function generally raises drug absorption and exposure. Pharmacodynamically neutral on its own, but by changing how much drug is available it can tip both efficacy and side-effect risk.",
    foods: [
      { action: "modulate", name: "Flavonoid-rich foods (citrus, berries)", why: "Many flavonoids interact with BCRP transport.",
        bio: [
          "<strong>Anthocyanins</strong> (berries) enhance memory and neuroplasticity.",
          "<strong>Hesperidin</strong> (citrus) protects the blood–brain barrier from oxidative stress.",
          "<strong>Quercetin</strong> reduces neuroinflammation across brain tissue."
        ] },
      { action: "amplify", name: "Green tea", why: "Catechins modulate efflux activity.",
        bio: [
          "<strong>EGCG</strong> protects neurons and supports synaptic plasticity.",
          "<strong>L-theanine</strong> raises GABA for calm, alert focus.",
          "<strong>Catechins</strong> buffer the brain against oxidative damage."
        ] },
      { action: "protect", name: "Riboflavin (B2) foods (dairy, almonds)", why: "B2 is a natural BCRP substrate; supports normal transporter handling.",
        bio: [
          "<strong>Riboflavin (B2)</strong> fuels brain-cell energy production and antioxidant recycling.",
          "<strong>Vitamin E</strong> (almonds) protects nerve-cell membranes from oxidative damage.",
          "<strong>Magnesium</strong> (almonds) calms nervous-system excitability."
        ] },
      { action: "amplify", name: "Cruciferous vegetables", why: "Support detox transport networks.",
        bio: [
          "<strong>Sulforaphane</strong> activates the Nrf2 antioxidant response in neurons.",
          "<strong>Indole-3-carbinol</strong> lowers neuroinflammation.",
          "<strong>Folate</strong> supports neurotransmitter synthesis."
        ] },
      { action: "protect", name: "Omega-3 fish", why: "General barrier and membrane support.",
        bio: [
          "<strong>DHA</strong> maintains the fluid membranes of neurons and the barrier.",
          "<strong>EPA</strong> reduces neuroinflammation tied to mood.",
          "<strong>Vitamin D</strong> supports serotonin-making enzymes."
        ] }
    ],
    foodMimic: "ABCG2 has no 'drug to mimic.' Its food story is about interaction awareness: flavonoids and tea catechins influence the SAME efflux pump, so a wildly changing diet can subtly shift how much medicine you absorb."
  },
  {
    symbol: "SLCO1B1", name: "Solute Carrier Organic Anion Transporter 1B1", locus: "12p12.1",
    category: "transporter",
    population: "The reduced-function *5 variant is carried by roughly 15% of people and is best known for raising statin-related muscle-pain risk.",
    plain: "SLCO1B1 builds a 'doorway' on liver cells that pulls certain drugs in so the liver can process them. It's most famous for statins (cholesterol medicines), where a slow version raises the risk of muscle aches. In mental health, it matters because many people take statins alongside psychiatric medicines, and managing those side effects supports overall well-being.",
    analogy: "Imagine a loading dock where trucks — medicines — get pulled into a warehouse (the liver) for processing. SLCO1B1 is that dock. If it works slowly, trucks keep circling the streets (your bloodstream) instead of unloading, and for statins that backup can leave muscles achy.",
    illnesses: ["Depression with cardiometabolic comorbidity", "Mood effects of chronic statin-related pain"],
    drugs: [
      { name: "Simvastatin / Atorvastatin", cls: "Statin (comedication)", note: "Reduced uptake raises blood levels and muscle-toxicity risk." },
      { name: "Repaglinide (comedication)", cls: "Diabetes drug", note: "SLCO1B1 substrate; relevant for metabolic comorbidity." },
      { name: "Select antidepressant substrates", cls: "Antidepressant", note: "Hepatic uptake can influence exposure." }
    ],
    pharmacology: "Pharmacokinetic uptake transporter at the liver. Reduced function means less drug is taken into the liver, so MORE stays in circulation — the opposite direction from an efflux pump. The classic consequence is statin myopathy, a quality-of-life issue that intersects with mood and adherence.",
    foods: [
      { action: "protect", name: "CoQ10-rich foods (fatty fish, organ meats)", why: "May ease statin-related muscle symptoms tied to this transporter.",
        bio: [
          "<strong>Coenzyme Q10</strong> powers mitochondria in energy-hungry neurons and nerves.",
          "<strong>B vitamins</strong> (organ meats) support nerve conduction and neurotransmitter synthesis.",
          "<strong>Omega-3s</strong> (fatty fish) protect neuron membranes and reduce inflammation."
        ] },
      { action: "amplify", name: "Olive oil & Mediterranean pattern", why: "Supports lipid goals, potentially lowering statin dose needs.",
        bio: [
          "<strong>Hydroxytyrosol</strong> is a polyphenol that shields neurons from oxidative stress.",
          "<strong>Oleocanthal</strong> provides anti-inflammatory brain protection.",
          "<strong>Oleic acid</strong> supports the myelin that insulates nerve fibers."
        ] },
      { action: "protect", name: "Magnesium foods (nuts, seeds, greens)", why: "Support muscle comfort and relaxation.",
        bio: [
          "<strong>Magnesium</strong> gates NMDA receptors, calming over-excited neurons.",
          "<strong>Vitamin E</strong> (nuts) protects nerve membranes from oxidative damage.",
          "<strong>Tryptophan</strong> (seeds) is the precursor for serotonin and melatonin."
        ] },
      { action: "modulate", name: "Soluble-fiber foods (oats, legumes)", why: "Lower cholesterol naturally, complementing statin therapy.",
        bio: [
          "<strong>Beta-glucan</strong> (oats) feeds gut microbes that make mood-supporting short-chain fatty acids.",
          "<strong>B vitamins</strong> (legumes) support neurotransmitter production and steady energy.",
          "<strong>Avenanthramides</strong> (oats) are unique antioxidants with anti-inflammatory effects."
        ] },
      { action: "amplify", name: "Fatty fish omega-3s", why: "Cardiometabolic and mood support together.",
        bio: [
          "<strong>EPA</strong> has the strongest omega-3 evidence for easing depression.",
          "<strong>DHA</strong> builds neuron membranes and supports receptor signaling.",
          "<strong>Vitamin D</strong> helps regulate serotonin synthesis."
        ] }
    ],
    foodMimic: "For cholesterol, oats, legumes, and a Mediterranean diet lower LDL through the SAME end-goal as statins — by different means. This whole-diet approach (endorsed by ASN and others) can support cardiometabolic health that closely ties to mood, while reducing the muscle-side-effect burden SLCO1B1 variants can cause."
  },

  /* ===================== PHARMACODYNAMIC — SEROTONERGIC ===================== */
  {
    symbol: "SLC6A4", name: "Serotonin Transporter (5-HTT / SERT)", locus: "17q11.2",
    category: "serotonergic",
    population: "The 'short' (S) version of the 5-HTTLPR promoter is common — roughly 40% of people carry at least one short allele — and is linked to SSRI response and stress sensitivity.",
    plain: "SLC6A4 builds the serotonin transporter — the exact target that SSRI medicines block. Serotonin is a 'feel-steady' chemical messenger, and this transporter recycles it back into nerve cells. Some people have a version that recycles serotonin more aggressively, which can affect mood and how well an SSRI works. It's one of the most studied genes in all of psychiatry.",
    analogy: "Think of a vacuum cleaner that sucks up 'feel-steady' confetti (serotonin) right after it's tossed into the air. SLC6A4 builds that vacuum. Some people run it on high, cleaning up serotonin fast. SSRI medicines basically unplug the vacuum for a while, so the good feeling gets to linger.",
    illnesses: ["Major depressive disorder", "Anxiety disorders", "PTSD", "OCD", "Heightened stress reactivity"],
    drugs: [
      { name: "Sertraline", cls: "SSRI antidepressant", note: "Directly blocks the SERT this gene builds; short-allele carriers may respond less or slower." },
      { name: "Escitalopram", cls: "SSRI antidepressant", note: "SERT-selective; response associations studied with 5-HTTLPR." },
      { name: "Fluoxetine", cls: "SSRI antidepressant", note: "SERT blocker; tolerability also linked to variant." }
    ],
    pharmacology: "This is a true pharmacodynamic gene — it encodes the drug's actual target. Variation changes baseline transporter density and, with it, the brain's serotonin tone and how strongly an SSRI's blockade translates into benefit. The short allele is also studied in gene–environment interactions with life stress.",
    foods: [
      { action: "amplify", name: "Tryptophan-rich foods (turkey, eggs, pumpkin seeds)", why: "Supply the precursor the body uses to make serotonin.",
        bio: [
          "<strong>Tryptophan</strong> is the direct amino-acid precursor for serotonin and melatonin.",
          "<strong>Choline</strong> (eggs) builds acetylcholine for memory and focus.",
          "<strong>Zinc & magnesium</strong> (pumpkin seeds) support neurotransmitter release and calm."
        ] },
      { action: "amplify", name: "Complex carbs (oats, sweet potato)", why: "Help tryptophan enter the brain, supporting serotonin synthesis.",
        bio: [
          "<strong>Slow carbohydrates</strong> trigger insulin that clears rival amino acids, letting tryptophan reach the brain.",
          "<strong>Beta-glucan</strong> (oats) feeds gut microbes that produce serotonin precursors.",
          "<strong>Beta-carotene</strong> (sweet potato) is an antioxidant protecting nerve membranes."
        ] },
      { action: "protect", name: "Fermented foods (yogurt, kefir, kimchi)", why: "Gut microbes shape serotonin production along the gut-brain axis.",
        bio: [
          "<strong>Probiotic bacteria</strong> produce GABA and serotonin precursors in the gut.",
          "<strong>Butyrate</strong> and other short-chain fatty acids calm gut–brain inflammation.",
          "<strong>Vitamin K2</strong> from fermentation supports nerve-membrane lipids."
        ] },
      { action: "amplify", name: "Fatty fish (omega-3)", why: "Improves serotonin receptor signaling and membrane fluidity.",
        bio: [
          "<strong>DHA</strong> keeps serotonin-receptor membranes fluid and responsive.",
          "<strong>EPA</strong> reduces neuroinflammation linked to depression.",
          "<strong>Vitamin D</strong> regulates the enzyme that converts tryptophan to serotonin."
        ] },
      { action: "modulate", name: "Vitamin D foods (salmon, fortified dairy, sunlight)", why: "Vitamin D helps regulate the enzyme that makes brain serotonin.",
        bio: [
          "<strong>Vitamin D</strong> activates tryptophan hydroxylase-2, the brain's serotonin-making enzyme.",
          "<strong>Vitamin D receptors</strong> sit throughout mood-regulating brain regions.",
          "<strong>Calcium</strong> (dairy) supports neurotransmitter release at synapses."
        ] }
    ],
    foodMimic: "SSRIs work by blocking the transporter SLC6A4 builds. Food can't block it, but pairing tryptophan-rich protein with whole-grain carbs raises the brain's serotonin RAW MATERIALS — and a healthy gut microbiome (fermented foods, fiber) supports the same system. This is the core nutritional-psychiatry strategy for low mood, used alongside, not instead of, medication."
  },
  {
    symbol: "HTR2A", name: "Serotonin 2A Receptor", locus: "13q14.2",
    category: "serotonergic",
    population: "Common variants (such as rs6313) are carried by a large share of the population and are studied for antidepressant response and side-effect tendency.",
    plain: "HTR2A makes a docking station — a receptor — that serotonin plugs into. This particular receptor influences mood, sleep, and how some antidepressants and antipsychotics cause side effects. Different versions can make a person more or less likely to feel side effects like restlessness or sleep changes from certain medicines.",
    analogy: "Picture a wall outlet that serotonin plugs into to deliver a message. HTR2A is that outlet. Different people's outlets fit the plug a little differently, which is why the very same medicine can feel calming to one person and cause restlessness or odd sleep in another.",
    illnesses: ["Depression", "Anxiety", "Schizophrenia", "Sleep disturbance"],
    drugs: [
      { name: "Trazodone", cls: "Serotonin modulator (sleep/depression)", note: "Blocks 2A receptors; variant influences sedation and benefit." },
      { name: "Mirtazapine", cls: "Atypical antidepressant", note: "2A antagonism contributes to mood and sleep effects." },
      { name: "Atypical antipsychotics (e.g., olanzapine)", cls: "Antipsychotic", note: "Strong 2A blockade central to their action." }
    ],
    pharmacology: "Pharmacodynamic receptor gene. Because so many psychotropics act partly through 2A blockade, receptor variants can influence both response and tolerability (e.g., the early agitation some people feel starting an SSRI). It's a window into WHY two people react differently to the same class of drug.",
    foods: [
      { action: "amplify", name: "Omega-3 fatty fish", why: "Supports healthy serotonin-receptor signaling.",
        bio: [
          "<strong>DHA</strong> keeps 2A-receptor membranes fluid for proper signaling.",
          "<strong>EPA</strong> lowers neuroinflammation that disrupts serotonin tone.",
          "<strong>Vitamin D</strong> supports the enzyme that makes brain serotonin."
        ] },
      { action: "modulate", name: "Saffron (culinary amounts)", why: "Studied for mood benefits via serotonergic pathways (ISNPR-noted).",
        bio: [
          "<strong>Crocin</strong> is a carotenoid shown in trials to support mood via serotonin pathways.",
          "<strong>Safranal</strong> has calming, antidepressant-like effects in studies.",
          "<strong>Crocetin</strong> is an antioxidant that crosses into the brain."
        ] },
      { action: "protect", name: "Polyphenol foods (berries, cocoa)", why: "Reduce neuroinflammation that disrupts receptor function.",
        bio: [
          "<strong>Flavanols</strong> (cocoa) boost cerebral blood flow and support mood.",
          "<strong>Anthocyanins</strong> (berries) enhance memory and neuroplasticity.",
          "<strong>Theobromine</strong> (cocoa) provides a gentle, non-jittery lift."
        ] },
      { action: "amplify", name: "Magnesium foods (greens, seeds)", why: "Cofactor for balanced neurotransmission.",
        bio: [
          "<strong>Magnesium</strong> regulates NMDA receptors and calms excitable neurons.",
          "<strong>Folate</strong> (greens) drives serotonin and dopamine synthesis.",
          "<strong>Zinc</strong> (seeds) supports mood and neurotransmitter balance."
        ] },
      { action: "protect", name: "Fermented foods", why: "Gut-brain support for serotonin tone.",
        bio: [
          "<strong>Probiotic bacteria</strong> produce serotonin precursors and GABA.",
          "<strong>Short-chain fatty acids</strong> calm gut–brain inflammation.",
          "<strong>Vitamin K2</strong> supports nerve-membrane lipids."
        ] }
    ],
    foodMimic: "Several drugs calm an overactive 2A receptor. Among foods, saffron has the best evidence for gentle serotonergic mood support, and omega-3s keep receptor signaling healthy — modest, complementary effects on the SAME pathway, not a substitute for prescribed treatment."
  },
  {
    symbol: "HTR2C", name: "Serotonin 2C Receptor", locus: "Xq23",
    category: "serotonergic",
    population: "Promoter variants (e.g., -759C/T) are common and are the best-known genetic predictor of weight gain from certain antipsychotics.",
    plain: "HTR2C makes another serotonin docking station, and it has a big say in appetite and weight. This is important because some mental-health medicines, especially certain antipsychotics, can cause weight gain — and your HTR2C version helps predict how much. Knowing this lets a care team plan ahead with nutrition and monitoring.",
    analogy: "Think of a 'you're full' button in the brain's kitchen. HTR2C is that button. Some medicines press down on it so it stops signaling 'stop eating,' and your personal version of the button decides how strongly that nudges your appetite — which is why a care team can plan ahead with nutrition.",
    illnesses: ["Schizophrenia", "Bipolar disorder", "Antipsychotic-associated weight gain & metabolic syndrome", "Appetite dysregulation"],
    drugs: [
      { name: "Olanzapine", cls: "Antipsychotic", note: "2C-related variants strongly predict weight-gain risk." },
      { name: "Clozapine", cls: "Antipsychotic", note: "Similar metabolic risk influenced by HTR2C." },
      { name: "Risperidone", cls: "Antipsychotic", note: "Weight effects partly tied to 2C signaling." }
    ],
    pharmacology: "Pharmacodynamic receptor gene with a metabolic spotlight. 2C receptors normally help suppress appetite; antipsychotics that block them can drive overeating and weight gain, and HTR2C variants amplify or buffer that effect. This makes the gene central to long-term physical health in serious mental illness.",
    foods: [
      { action: "protect", name: "High-fiber foods (legumes, oats, vegetables)", why: "Improve satiety and blunt antipsychotic-related weight gain.",
        bio: [
          "<strong>Fermentable fiber</strong> feeds gut microbes that make butyrate, calming gut–brain inflammation.",
          "<strong>Beta-glucan</strong> (oats) steadies blood sugar that drives appetite swings.",
          "<strong>Folate & B vitamins</strong> (legumes) support neurotransmitter synthesis."
        ] },
      { action: "modulate", name: "Protein-rich meals", why: "Increase fullness signals that counter appetite dysregulation.",
        bio: [
          "<strong>Tyrosine & tryptophan</strong> from protein are precursors for dopamine and serotonin.",
          "<strong>Peptide YY & GLP-1</strong> — satiety hormones protein helps release — signal the brain you're full.",
          "<strong>Branched-chain amino acids</strong> support steady energy and mood."
        ] },
      { action: "protect", name: "Low-glycemic whole grains", why: "Steady blood sugar and reduce metabolic-syndrome risk.",
        bio: [
          "<strong>Complex carbohydrates</strong> deliver steady glucose, the brain's main fuel.",
          "<strong>Magnesium</strong> supports insulin sensitivity and calm neurons.",
          "<strong>B vitamins</strong> aid energy metabolism and neurotransmitter production."
        ] },
      { action: "amplify", name: "Omega-3 fish", why: "Support metabolic and cardiovascular health.",
        bio: [
          "<strong>EPA</strong> reduces inflammation tied to metabolic syndrome and low mood.",
          "<strong>DHA</strong> supports neuron membranes and receptor signaling.",
          "<strong>Vitamin D</strong> aids mood regulation and metabolic health."
        ] },
      { action: "protect", name: "Water-rich vegetables & salads", why: "High-volume, low-calorie foods that aid weight management.",
        bio: [
          "<strong>Folate & lutein</strong> (leafy greens) support cognition and neurotransmitter synthesis.",
          "<strong>Nitrates</strong> (leafy greens, beets) improve cerebral blood flow.",
          "<strong>Vitamin C & polyphenols</strong> protect neurons from oxidative stress."
        ] }
    ],
    foodMimic: "No food blocks an antipsychotic's metabolic effect, but a high-fiber, high-protein, low-glycemic diet works on the SAME appetite-and-metabolism system HTR2C governs — the practical, provider-endorsed way to protect against medication-related weight gain."
  },

  /* ===================== PHARMACODYNAMIC — DOPAMINERGIC / ADRENERGIC ===================== */
  {
    symbol: "COMT", name: "Catechol-O-Methyltransferase", locus: "22q11.21",
    category: "dopaminergic",
    population: "The Val158Met variant splits the population roughly into thirds: about 25% fast (Val/Val), 50% intermediate, and 25% slow (Met/Met) dopamine breakdown.",
    plain: "COMT is the enzyme that cleans up dopamine in the thinking part of your brain. Dopamine helps with focus, motivation, and handling stress. Some people break dopamine down quickly ('warriors') and some slowly ('worriers'). Slow breakers often have sharper focus but feel stress more; fast breakers stay calmer under pressure but may need more dopamine support to focus. Neither is better — they're just different.",
    analogy: "Imagine a janitor who sweeps up dopamine — your focus-and-drive chemical — in the brain's front office. COMT is that janitor. A fast janitor keeps the floor spotless but a little bare; a slow one leaves more lying around: sharper focus, but you feel stress more. Neither is 'better,' just different.",
    illnesses: ["ADHD", "Anxiety", "Depression", "Schizophrenia", "Stress sensitivity"],
    drugs: [
      { name: "Methylphenidate / Amphetamine", cls: "Stimulant (ADHD)", note: "Response and side-effect profile differ by COMT speed; slow metabolizers may be more anxiety-prone on stimulants." },
      { name: "Aripiprazole", cls: "Antipsychotic", note: "Dopamine-modulating action interacts with baseline COMT tone." },
      { name: "Bupropion", cls: "Antidepressant (NDRI)", note: "Boosts dopamine that COMT clears." }
    ],
    pharmacology: "Pharmacodynamic enzyme gene shaping prefrontal dopamine tone. It doesn't break down drugs; it sets the dopamine 'baseline' on which stimulants and dopamine drugs act. This is why the same stimulant dose can sharpen one person and overwhelm another. COMT needs magnesium and is sensitive to estrogen.",
    foods: [
      { action: "amplify", name: "Tyrosine-rich protein (eggs, lean meat, soy)", why: "Provides the building block for dopamine COMT regulates.",
        bio: [
          "<strong>Tyrosine</strong> is the direct amino-acid precursor for dopamine and norepinephrine.",
          "<strong>Choline</strong> (eggs) builds acetylcholine for focus and memory.",
          "<strong>Iron & B12</strong> (lean meat) support dopamine synthesis and nerve myelin."
        ] },
      { action: "modulate", name: "Magnesium foods (greens, seeds, dark chocolate)", why: "Magnesium is a required cofactor for COMT activity.",
        bio: [
          "<strong>Magnesium</strong> is the cofactor COMT needs to break down dopamine, and it calms neurons.",
          "<strong>Flavanols</strong> (dark chocolate) boost cerebral blood flow and mood.",
          "<strong>Zinc</strong> (seeds) supports neurotransmitter balance."
        ] },
      { action: "modulate", name: "Green tea (L-theanine)", why: "Smooths dopamine/glutamate balance for calm focus.",
        bio: [
          "<strong>L-theanine</strong> raises GABA and alpha waves for calm, alert focus.",
          "<strong>EGCG</strong> protects dopaminergic neurons from oxidative stress.",
          "<strong>Theanine + caffeine</strong> sharpen attention without overstimulation."
        ] },
      { action: "protect", name: "Berries & polyphenols", why: "Mild, balancing influence on catechol metabolism.",
        bio: [
          "<strong>Anthocyanins</strong> enhance memory and neuroplasticity.",
          "<strong>Quercetin</strong> reduces neuroinflammation.",
          "<strong>Vitamin C</strong> is a cofactor for dopamine synthesis and a neural antioxidant."
        ] },
      { action: "amplify", name: "Beets & folate-rich greens", why: "Support methylation, the chemical reaction COMT performs.",
        bio: [
          "<strong>Dietary nitrates</strong> (beets) boost cerebral blood flow and oxygen delivery.",
          "<strong>Folate</strong> fuels the methylation cycle COMT depends on.",
          "<strong>Betalains</strong> (beets) are antioxidants that reduce brain inflammation."
        ] }
    ],
    foodMimic: "Stimulants raise dopamine; COMT clears it. For 'fast' metabolizers who run low on dopamine, tyrosine-rich protein supports the SAME dopamine pool — gentle daytime focus support. For 'slow' types prone to anxiety, magnesium and L-theanine help steady the system. Diet can't replace ADHD medication but can be tuned to your COMT type."
  },
  {
    symbol: "DRD2", name: "Dopamine D2 Receptor", locus: "11q23.2",
    category: "dopaminergic",
    population: "The Taq1A (A1) variant near DRD2 is common, carried by roughly a third of people, and is studied in antipsychotic response and reward sensitivity.",
    plain: "DRD2 makes the main docking station for dopamine — and it's the key target of almost every antipsychotic medicine. Dopamine drives reward, motivation, and movement. Variations change how many docking stations you have, which affects how well antipsychotics work and how likely they are to cause side effects like stiffness or restlessness.",
    analogy: "Think of parking spots for dopamine 'cars.' DRD2 builds those spots. Antipsychotic medicines work like a valet blocking some of them so fewer cars can park. How many spots you have shapes how well the medicine works and whether it causes side effects like stiffness or restlessness.",
    illnesses: ["Schizophrenia", "Bipolar disorder", "Addiction & reward disorders", "Depression with low motivation"],
    drugs: [
      { name: "Risperidone", cls: "Antipsychotic", note: "Blocks D2 receptors this gene builds; variant affects response and movement side effects." },
      { name: "Aripiprazole", cls: "Antipsychotic (partial agonist)", note: "Fine-tunes D2 signaling; receptor density matters." },
      { name: "Haloperidol", cls: "Antipsychotic (typical)", note: "Strong D2 blockade; side-effect risk varies with DRD2." }
    ],
    pharmacology: "A core pharmacodynamic target. Antipsychotic benefit comes from D2 blockade; too much blockade causes movement side effects (EPS) and prolactin elevation. DRD2 variants help explain who responds, who needs higher doses, and who is prone to side effects — central to personalized antipsychotic care.",
    foods: [
      { action: "amplify", name: "Tyrosine-rich protein", why: "Provides dopamine precursors for healthy receptor signaling.",
        bio: [
          "<strong>Tyrosine</strong> is the amino-acid building block the brain turns into dopamine.",
          "<strong>Phenylalanine</strong> converts to tyrosine, feeding the same dopamine pathway.",
          "<strong>Vitamin B6</strong> is the cofactor that finishes dopamine synthesis."
        ] },
      { action: "protect", name: "Antioxidant-rich produce (berries, greens)", why: "Protect dopamine neurons from oxidative stress.",
        bio: [
          "<strong>Anthocyanins</strong> (berries) shield dopamine neurons and support memory.",
          "<strong>Lutein</strong> (greens) accumulates in the brain and supports cognition.",
          "<strong>Vitamin C</strong> defends neurons against oxidative damage."
        ] },
      { action: "modulate", name: "Probiotic/fermented foods", why: "Gut-brain axis influences dopamine signaling.",
        bio: [
          "<strong>Gut bacteria</strong> synthesize dopamine precursors along the gut–brain axis.",
          "<strong>Short-chain fatty acids</strong> support brain-barrier health and reduce inflammation.",
          "<strong>Tyramine</strong> and related metabolites interact with dopamine pathways."
        ] },
      { action: "amplify", name: "Iron-rich foods (legumes, lean red meat)", why: "Iron is a cofactor for dopamine synthesis.",
        bio: [
          "<strong>Iron</strong> is essential for tyrosine hydroxylase, the rate-limiting dopamine enzyme.",
          "<strong>Vitamin B12</strong> (red meat) maintains nerve myelin and neurotransmitter function.",
          "<strong>Zinc</strong> supports dopamine-receptor signaling and mood."
        ] },
      { action: "protect", name: "Omega-3 fish", why: "Support receptor membrane function and reduce inflammation.",
        bio: [
          "<strong>DHA</strong> keeps dopamine-receptor membranes fluid and responsive.",
          "<strong>EPA</strong> reduces neuroinflammation affecting reward circuits.",
          "<strong>Vitamin D</strong> helps regulate dopamine synthesis."
        ] }
    ],
    foodMimic: "No food substitutes for an antipsychotic — these are essential medicines in serious illness. But supporting dopamine raw materials (tyrosine, iron) and protecting dopamine neurons with antioxidants supports the SAME system DRD2 governs, complementing treatment and overall brain health."
  },
  {
    symbol: "ADRA2A", name: "Alpha-2A Adrenergic Receptor", locus: "10q25.2",
    category: "dopaminergic",
    population: "Common promoter variants (e.g., MspI / -1291C>G) are widely distributed and studied for ADHD medication response, especially to guanfacine and atomoxetine.",
    plain: "ADRA2A makes a receptor for norepinephrine, a 'focus and alertness' messenger. It's especially important in the front of the brain for attention and self-control. Some ADHD medicines work directly through this receptor. Your version can influence how well those medicines help you concentrate and stay calm.",
    analogy: "Picture the focus knob on a camera. ADRA2A is a knob for attention and calm at the front of the brain. Certain non-stimulant ADHD medicines gently turn that knob to sharpen the picture and steady your hand — and your version of the knob affects how much they help.",
    illnesses: ["ADHD", "Anxiety", "PTSD-related hyperarousal", "Impulse control"],
    drugs: [
      { name: "Guanfacine", cls: "Alpha-2A agonist (ADHD)", note: "Directly activates this receptor; variant predicts response." },
      { name: "Clonidine", cls: "Alpha-2 agonist", note: "Used for ADHD, anxiety, and hyperarousal via this pathway." },
      { name: "Atomoxetine", cls: "Non-stimulant ADHD med", note: "Raises norepinephrine acting on ADRA2A; response varies by genotype." }
    ],
    pharmacology: "Pharmacodynamic receptor gene central to prefrontal attention circuits. Drugs like guanfacine 'turn up' this receptor to strengthen focus and reduce impulsivity, so variant function helps predict who benefits. It's a key gene for the non-stimulant side of ADHD care.",
    foods: [
      { action: "amplify", name: "Omega-3 fish (DHA)", why: "Supports prefrontal circuits underlying attention.",
        bio: [
          "<strong>DHA</strong> is enriched in prefrontal attention circuits and supports signaling.",
          "<strong>EPA</strong> reduces neuroinflammation and has ADHD-symptom evidence.",
          "<strong>Vitamin D</strong> supports catecholamine (norepinephrine/dopamine) regulation."
        ] },
      { action: "modulate", name: "Green tea (L-theanine)", why: "Calms hyperarousal while supporting steady focus.",
        bio: [
          "<strong>L-theanine</strong> raises calming GABA and alpha waves, easing overarousal.",
          "<strong>EGCG</strong> protects neurons from oxidative stress.",
          "<strong>Theanine + caffeine</strong> improve attention without jitter."
        ] },
      { action: "amplify", name: "Protein-rich breakfasts (tyrosine)", why: "Feed norepinephrine synthesis for morning focus.",
        bio: [
          "<strong>Tyrosine</strong> is the precursor for norepinephrine, the focus/alertness messenger.",
          "<strong>Vitamin B6</strong> is a cofactor for catecholamine synthesis.",
          "<strong>Choline</strong> supports acetylcholine for attention and memory."
        ] },
      { action: "protect", name: "Magnesium foods", why: "Help dampen stress-driven overarousal.",
        bio: [
          "<strong>Magnesium</strong> gates NMDA receptors, quieting an over-aroused nervous system.",
          "<strong>Magnesium</strong> supports GABA activity for calm and better sleep.",
          "It is a cofactor for dozens of <strong>neurotransmitter enzymes</strong>."
        ] },
      { action: "protect", name: "Iron- and zinc-rich foods", why: "Low iron/zinc worsens attention; replenishing supports the pathway.",
        bio: [
          "<strong>Iron</strong> powers tyrosine hydroxylase, the enzyme that builds dopamine and norepinephrine.",
          "<strong>Zinc</strong> regulates dopamine transport and is linked to attention.",
          "<strong>Ferritin iron stores</strong> correlate with steadier focus in studies."
        ] }
    ],
    foodMimic: "Guanfacine strengthens prefrontal focus through ADRA2A. No food does that directly, but DHA-rich fish plus a protein breakfast support the norepinephrine system this receptor uses, and L-theanine eases the hyperarousal it helps regulate — gentle, complementary focus support."
  },

  /* ===================== PHARMACODYNAMIC — NEURONAL SIGNALING / MOOD ===================== */
  {
    symbol: "BDNF", name: "Brain-Derived Neurotrophic Factor", locus: "11p14.1",
    category: "signaling",
    population: "The Val66Met variant is common — the Met allele is carried by roughly 20–30% of people of European ancestry and up to ~40–50% in East Asian ancestry.",
    plain: "BDNF is like fertilizer for your brain. It helps brain cells grow, connect, and bounce back from stress — a process called neuroplasticity. People with a less-active version may find it a little harder to recover from depression or stress, but the great news is that BDNF responds strongly to healthy habits: exercise, sleep, and good food all turn it up. This is one of the most hopeful genes on the panel.",
    analogy: "Think of BDNF as fertilizer and water for a garden of brain cells. With plenty of it, the garden grows, connects, and bounces back after a storm. Here's the hopeful part: exercise, sleep, and good food water this garden as powerfully as some medicines do.",
    illnesses: ["Depression", "Anxiety", "PTSD", "Bipolar disorder", "Stress-related cognitive complaints"],
    drugs: [
      { name: "SSRIs/SNRIs (class effect)", cls: "Antidepressant", note: "Raise BDNF over weeks; the rise tracks with recovery and may be blunted in Met carriers." },
      { name: "Ketamine / esketamine", cls: "Rapid-acting antidepressant", note: "Acts through a rapid BDNF-driven plasticity surge." },
      { name: "Lithium", cls: "Mood stabilizer", note: "Neuroprotective effects involve boosting BDNF." }
    ],
    pharmacology: "A pharmacodynamic signaling gene that helps explain WHY antidepressants take weeks: they work partly by gradually raising BDNF and rebuilding neural connections. The Val66Met variant affects how efficiently BDNF is released, influencing resilience and treatment response. Crucially, lifestyle raises BDNF as powerfully as some drugs.",
    foods: [
      { action: "amplify", name: "Omega-3 fatty fish (DHA)", why: "Directly boosts BDNF and neuroplasticity (strong ISNPR support).",
        bio: [
          "<strong>DHA</strong> is shown to raise BDNF and build new synaptic connections.",
          "<strong>EPA</strong> reduces neuroinflammation that suppresses plasticity.",
          "<strong>Vitamin D</strong> supports BDNF signaling and mood regulation."
        ] },
      { action: "amplify", name: "Berries & cocoa flavonoids", why: "Polyphenols increase BDNF expression.",
        bio: [
          "<strong>Flavanols</strong> (cocoa) increase BDNF and cerebral blood flow.",
          "<strong>Anthocyanins</strong> (berries) enhance neuroplasticity and memory.",
          "<strong>Epicatechin</strong> supports the growth of new neural connections."
        ] },
      { action: "amplify", name: "Turmeric (curcumin)", why: "Shown to raise BDNF in studies; anti-inflammatory.",
        bio: [
          "<strong>Curcumin</strong> measurably raises BDNF and lowers brain inflammation.",
          "<strong>Turmerones</strong> may support neural stem-cell growth and repair.",
          "<strong>Curcuminoids</strong> are antioxidants that protect neurons."
        ] },
      { action: "amplify", name: "Green tea (EGCG)", why: "Supports BDNF and neuroprotection.",
        bio: [
          "<strong>EGCG</strong> supports BDNF and protects neurons from oxidative stress.",
          "<strong>L-theanine</strong> promotes calm focus and supports plasticity.",
          "<strong>Polyphenols</strong> reduce neuroinflammation."
        ] },
      { action: "protect", name: "Whole, unprocessed Mediterranean diet", why: "Higher adherence links to higher BDNF and lower depression risk.",
        bio: [
          "<strong>Polyphenols & omega-3s</strong> across the pattern jointly raise BDNF.",
          "<strong>Olive-oil hydroxytyrosol</strong> protects neurons and mitochondria.",
          "<strong>Fiber-fed short-chain fatty acids</strong> support the gut–brain axis and mood."
        ] }
    ],
    foodMimic: "This is the gene where food comes closest to acting like medicine. Antidepressants, exercise, and certain foods ALL raise BDNF along the same plasticity pathway. Omega-3s, flavonoids (berries, cocoa), and curcumin measurably increase BDNF — which is exactly why nutritional psychiatry (ISNPR) treats diet as real, complementary support for the recovering brain."
  },
  {
    symbol: "ANK3", name: "Ankyrin-3", locus: "10q21.2",
    category: "signaling",
    population: "Common risk variants near ANK3 are among the most replicated genetic associations with bipolar disorder, carried by a substantial minority of the population.",
    plain: "ANK3 builds scaffolding that holds nerve-cell channels in just the right place so signals fire properly. Think of it as the framework that keeps a brain cell's electrical wiring organized. Certain versions are linked to bipolar disorder. It helps researchers understand mood swings at the level of how brain cells stay stable and well-organized.",
    analogy: "Imagine the studs and framing inside a wall that hold the electrical wiring exactly where it belongs. ANK3 is that framing inside a brain cell. When the framing sits a little off, the wiring can fire erratically — one thread behind the mood swings of bipolar disorder.",
    illnesses: ["Bipolar disorder", "Schizophrenia (overlap)", "Mood instability"],
    drugs: [
      { name: "Lithium", cls: "Mood stabilizer", note: "First-line for bipolar disorder; stabilizes neuronal signaling ANK3 supports." },
      { name: "Valproate", cls: "Mood stabilizer / anticonvulsant", note: "Stabilizes excitable membranes." },
      { name: "Lamotrigine", cls: "Mood stabilizer", note: "Calms over-excitable signaling, especially for bipolar depression." }
    ],
    pharmacology: "Pharmacodynamic structural-signaling gene. ANK3 organizes the axon initial segment — where neurons 'decide' to fire — so variants may set a person up for the unstable signaling seen in bipolar disorder. Mood stabilizers don't target ANK3 directly but calm the excitable circuits it helps build.",
    foods: [
      { action: "protect", name: "Omega-3 fatty fish", why: "Stabilize neuronal membranes and reduce mood-episode severity (adjunctive).",
        bio: [
          "<strong>DHA</strong> stabilizes neuron membranes where ion channels sit.",
          "<strong>EPA</strong> reduces neuroinflammation and has adjunctive bipolar evidence.",
          "<strong>Vitamin D</strong> supports mood and neuronal signaling."
        ] },
      { action: "protect", name: "Magnesium foods (greens, seeds, legumes)", why: "Natural membrane stabilizer supporting calmer signaling.",
        bio: [
          "<strong>Magnesium</strong> gates NMDA receptors, calming over-excitable neurons.",
          "<strong>Magnesium</strong> supports GABA activity for steadier mood and sleep.",
          "<strong>Folate</strong> (greens/legumes) fuels neurotransmitter synthesis."
        ] },
      { action: "amplify", name: "Folate & B-vitamin foods", why: "Support healthy neuronal function and methylation.",
        bio: [
          "<strong>Folate (B9)</strong> drives methylation that builds serotonin and dopamine.",
          "<strong>Vitamin B12</strong> maintains the myelin insulating nerve fibers.",
          "<strong>Vitamin B6</strong> is a cofactor for GABA and serotonin synthesis."
        ] },
      { action: "protect", name: "Steady, regular meals (rhythm)", why: "Stable routines and blood sugar support mood stability in bipolar disorder.",
        bio: [
          "<strong>Steady glucose</strong> is the brain's main fuel; swings destabilize signaling.",
          "<strong>Regular meal timing</strong> reinforces circadian rhythms tied to mood stability.",
          "<strong>Balanced protein & fiber</strong> flatten blood-sugar spikes that stress neurons."
        ] },
      { action: "amplify", name: "Antioxidant-rich produce", why: "Reduce oxidative stress implicated in bipolar disorder.",
        bio: [
          "<strong>Anthocyanins & polyphenols</strong> buffer the oxidative stress seen in bipolar disorder.",
          "<strong>Vitamin C</strong> protects neurons and recycles other antioxidants.",
          "<strong>Carotenoids</strong> defend nerve-cell membranes from damage."
        ] }
    ],
    foodMimic: "No food replaces lithium, which is essential and protective in bipolar disorder. But omega-3s and magnesium support the SAME goal of stable neuronal signaling, and — importantly — regular meal and sleep rhythms are a powerful, evidence-based stabilizer that complements medication."
  },
  {
    symbol: "CACNA1C", name: "Calcium Channel, Voltage-Gated, L-type, Alpha-1C", locus: "12p13.33",
    category: "signaling",
    population: "The rs1006737 risk variant is very common — roughly a third of people carry the risk allele — and is one of the most consistent genetic links across mood and psychotic disorders.",
    plain: "CACNA1C builds a calcium gate on brain cells. Calcium flowing through this gate is how neurons get excited and talk to each other. A more active version can make brain cells a bit too excitable, which is linked to bipolar disorder, depression, and schizophrenia. It's a shared thread connecting several mental-health conditions.",
    analogy: "Think of a floodgate on a dam that lets water (calcium) rush in to get a brain cell excited. CACNA1C is that gate. If it opens too easily, cells get over-excited — which is why this single gate shows up as a shared thread across bipolar disorder, depression, and schizophrenia.",
    illnesses: ["Bipolar disorder", "Major depression", "Schizophrenia", "Anxiety"],
    drugs: [
      { name: "Lithium", cls: "Mood stabilizer", note: "Calms overexcitable calcium-driven signaling." },
      { name: "Calcium-channel blockers (e.g., verapamil)", cls: "Investigational/adjunct", note: "Directly target this channel type; studied in mood disorders." },
      { name: "Valproate / Lamotrigine", cls: "Mood stabilizer", note: "Reduce neuronal hyperexcitability." }
    ],
    pharmacology: "Pharmacodynamic ion-channel gene. Because L-type calcium channels set neuronal excitability, CACNA1C variants nudge the whole brain toward instability — a reason this single gene shows up across bipolar, depression, and schizophrenia. It's an active target for new 'calcium-channel' approaches to mood disorders.",
    foods: [
      { action: "modulate", name: "Magnesium foods (greens, seeds, legumes)", why: "Magnesium is nature's calcium-channel modulator, calming excitability.",
        bio: [
          "<strong>Magnesium</strong> naturally blocks L-type calcium channels, easing over-excitability.",
          "<strong>Magnesium</strong> also gates NMDA receptors for a calmer nervous system.",
          "<strong>Folate</strong> (greens/legumes) supports neurotransmitter production."
        ] },
      { action: "protect", name: "Omega-3 fish", why: "Stabilize membranes and dampen hyperexcitable signaling.",
        bio: [
          "<strong>DHA</strong> stabilizes the membranes where calcium channels operate.",
          "<strong>EPA</strong> reduces neuroinflammation that worsens excitability.",
          "<strong>Vitamin D</strong> supports calcium balance and mood."
        ] },
      { action: "protect", name: "Potassium-rich produce (banana, avocado, leafy greens)", why: "Support balanced neuronal electrical activity.",
        bio: [
          "<strong>Potassium</strong> resets the neuron's electrical charge after each nerve impulse.",
          "<strong>Vitamin B6</strong> (banana) is a cofactor for GABA and serotonin.",
          "<strong>Monounsaturated fats</strong> (avocado) support nerve-membrane health."
        ] },
      { action: "amplify", name: "Antioxidant-rich berries", why: "Protect neurons from excitation-related stress.",
        bio: [
          "<strong>Anthocyanins</strong> protect neurons and support memory.",
          "<strong>Pterostilbene</strong> reduces oxidative stress from over-excitation.",
          "<strong>Vitamin C</strong> defends neurons against free-radical damage."
        ] },
      { action: "modulate", name: "Adequate (not excess) calcium from whole foods", why: "Balanced dietary calcium supports normal channel function.",
        bio: [
          "<strong>Calcium</strong> in balance is essential for neurotransmitter release at synapses.",
          "<strong>Vitamin K2</strong> helps direct calcium into bone, not soft tissue.",
          "<strong>Magnesium partnering</strong> keeps calcium signaling from tipping into excitotoxicity."
        ] }
    ],
    foodMimic: "Some experimental treatments calm CACNA1C calcium channels directly. Among foods, MAGNESIUM is the standout: it acts as a natural calcium-channel modulator on the SAME channels, gently reducing the over-excitability this gene can cause — a well-tolerated, complementary support."
  },
  {
    symbol: "GRIK1", name: "Glutamate Ionotropic Receptor Kainate Type 1", locus: "21q21.3",
    category: "signaling",
    population: "Functional variants are moderately common and are studied as predictors of response to the anticonvulsant topiramate and in anxiety/alcohol-use traits.",
    plain: "GRIK1 makes part of a receptor for glutamate, the brain's main 'go' signal that speeds activity up. Balancing 'go' (glutamate) against 'stop' (GABA) is key to a calm, focused mind. Variations in GRIK1 affect this balance and can influence anxiety and how well certain medicines, like topiramate, work for a person.",
    analogy: "Imagine a car with a gas pedal ('go' = glutamate) and a brake ('stop' = GABA). GRIK1 is part of the gas pedal. A pedal that's too sensitive keeps the engine revving and the mind racing — which can feel like anxiety, and helps explain who responds to calming medicines.",
    illnesses: ["Anxiety disorders", "Alcohol use disorder", "Mood disorders", "Seizure-related conditions"],
    drugs: [
      { name: "Topiramate", cls: "Anticonvulsant / anti-craving", note: "Acts on kainate glutamate receptors; GRIK1 variant predicts response, including in alcohol use disorder." },
      { name: "Lamotrigine", cls: "Mood stabilizer", note: "Reduces excess glutamate release." },
      { name: "Perampanel / glutamate modulators", cls: "Anticonvulsant", note: "Target glutamatergic excitability." }
    ],
    pharmacology: "Pharmacodynamic glutamate-receptor gene. By shaping excitatory 'go' signaling, GRIK1 influences anxiety, craving, and seizure threshold. It's notable as a pharmacogenetic predictor for topiramate, especially in reducing heavy drinking — a clear gene-guided treatment example.",
    foods: [
      { action: "modulate", name: "Magnesium foods (greens, seeds)", why: "Magnesium calms glutamate (NMDA/kainate) overactivity.",
        bio: [
          "<strong>Magnesium</strong> physically blocks NMDA/kainate channels, guarding against excitotoxicity.",
          "<strong>Magnesium</strong> supports GABA, the brain's calming counterweight to glutamate.",
          "<strong>Folate</strong> (greens) supports balanced neurotransmitter synthesis."
        ] },
      { action: "protect", name: "Omega-3 fish", why: "Buffer excitotoxic stress from excess glutamate.",
        bio: [
          "<strong>DHA</strong> protects neurons against glutamate excitotoxicity.",
          "<strong>EPA</strong> reduces the neuroinflammation that amplifies excitation.",
          "<strong>Vitamin D</strong> helps regulate glutamate-calcium balance."
        ] },
      { action: "modulate", name: "Green tea (L-theanine)", why: "Theanine gently counterbalances glutamate excitation.",
        bio: [
          "<strong>L-theanine</strong> is structurally like glutamate and gently dampens over-excitation.",
          "<strong>L-theanine</strong> raises GABA and calming alpha brain waves.",
          "<strong>EGCG</strong> protects neurons from excitation-related oxidative stress."
        ] },
      { action: "protect", name: "Antioxidant produce (berries, greens)", why: "Protect against glutamate-related oxidative stress.",
        bio: [
          "<strong>Anthocyanins</strong> buffer neurons against excitotoxic oxidative damage.",
          "<strong>Lutein</strong> (greens) concentrates in the brain and supports cognition.",
          "<strong>Vitamin C</strong> protects neurons and recycles glutathione."
        ] },
      { action: "modulate", name: "Limit MSG-heavy ultra-processed foods", why: "Reducing excess free glutamate may help sensitive individuals.",
        bio: [
          "<strong>Free glutamate</strong> from additives can add to the brain's excitatory load in sensitive people.",
          "Cutting ultra-processed foods lowers <strong>pro-inflammatory compounds</strong> that stress neurons.",
          "A whole-food diet raises <strong>natural antioxidants</strong> that buffer excitation."
        ] }
    ],
    foodMimic: "Glutamate-calming drugs reduce excess 'go' signaling. Magnesium and L-theanine work on the SAME excitatory balance — quieting over-excitation gently — while limiting ultra-processed, additive-heavy foods reduces excitatory load. Helpful complements for a calmer, more focused brain."
  },

  /* ===================== OTHER TARGETS / RESPONSE ===================== */
  {
    symbol: "OPRM1", name: "Mu-Opioid Receptor", locus: "6q25.2",
    category: "other",
    population: "The A118G (N40D) variant is common — the G allele is carried by roughly 10–30% of people, higher in East Asian ancestry — and influences opioid and naltrexone response.",
    plain: "OPRM1 makes the brain's main opioid receptor — the docking station for both natural 'feel-good' endorphins and opioid medicines. It also shapes how people respond to naltrexone, a medicine used for alcohol and opioid use disorders. Your version can affect pain relief, addiction risk, and how well anti-craving treatment works. It links mood, reward, and recovery.",
    analogy: "Think of a lock that fits two kinds of keys: your body's natural 'feel-good' keys (endorphins) and opioid medicines. OPRM1 is that lock. Its exact shape affects pain relief, addiction risk, and how well an anti-craving medicine like naltrexone works — and exercise turns the same lock naturally.",
    illnesses: ["Alcohol use disorder", "Opioid use disorder", "Depression with anhedonia", "Chronic pain with mood overlap"],
    drugs: [
      { name: "Naltrexone", cls: "Opioid antagonist (anti-craving)", note: "G-allele carriers may respond especially well for alcohol use disorder." },
      { name: "Buprenorphine", cls: "Partial opioid agonist (OUD)", note: "Acts at this receptor; genotype influences response." },
      { name: "Opioid analgesics (e.g., morphine)", cls: "Opioid", note: "Variant changes pain relief and dose needs." }
    ],
    pharmacology: "Pharmacodynamic receptor gene at the center of reward and pain. It directly sets how strongly opioids and naltrexone act, making it one of the clearest pharmacogenetic guides in addiction medicine. Endorphins released by exercise, music, and connection use this SAME receptor.",
    foods: [
      { action: "amplify", name: "Dark chocolate (cocoa)", why: "Stimulates natural endorphin release through this reward pathway.",
        bio: [
          "<strong>Flavanols</strong> boost cerebral blood flow and mood.",
          "<strong>Theobromine</strong> gives a gentle, non-jittery lift.",
          "<strong>Phenylethylamine</strong> nudges the brain's natural feel-good chemistry."
        ] },
      { action: "modulate", name: "Spicy foods (capsaicin)", why: "Trigger endorphin release, a natural mood lift.",
        bio: [
          "<strong>Capsaicin</strong> triggers a natural endorphin release for a mood lift.",
          "<strong>Capsaicin</strong> also has antioxidant, anti-inflammatory effects on nerves.",
          "It engages the same <strong>reward circuitry</strong> that opioid receptors sit in."
        ] },
      { action: "protect", name: "Omega-3 fish", why: "Support reward-circuit health and reduce inflammation.",
        bio: [
          "<strong>DHA</strong> supports the membranes of reward-circuit neurons.",
          "<strong>EPA</strong> reduces neuroinflammation tied to anhedonia.",
          "<strong>Vitamin D</strong> supports dopamine and mood regulation."
        ] },
      { action: "amplify", name: "Protein-rich whole foods", why: "Provide amino acids for endorphin and neurotransmitter synthesis.",
        bio: [
          "<strong>Tyrosine & tryptophan</strong> build dopamine and serotonin for reward and mood.",
          "<strong>Phenylalanine</strong> supports the brain's endorphin-related chemistry.",
          "<strong>Vitamin B6</strong> is a cofactor for neurotransmitter synthesis."
        ] },
      { action: "protect", name: "Fiber-rich, gut-friendly foods", why: "Gut-brain signaling supports healthy reward and mood.",
        bio: [
          "<strong>Short-chain fatty acids</strong> from fiber fermentation support brain-barrier health and mood.",
          "<strong>Prebiotic fiber</strong> feeds microbes that produce neurotransmitter precursors.",
          "<strong>Polyphenols</strong> in whole plants reduce neuroinflammation."
        ] }
    ],
    foodMimic: "Naltrexone blocks this receptor to cut cravings; opioids activate it. Food can't replace either, but endorphin-releasing experiences — dark chocolate, spicy food, and especially exercise — engage the SAME reward receptor naturally, offering healthy 'feel-good' support during recovery."
  },
  {
    symbol: "MC4R", name: "Melanocortin-4 Receptor", locus: "18q21.32",
    category: "other",
    population: "Variants near MC4R are among the most common genetic influences on appetite and obesity, and they help predict antipsychotic-related weight gain.",
    plain: "MC4R makes a receptor that acts like an appetite thermostat in the brain — it tells you when you're full. Some versions set the thermostat so you feel hungry more easily, which raises the risk of weight gain, especially with certain mental-health medicines. Understanding this helps a care team support healthy weight from the very start of treatment.",
    analogy: "Picture a thermostat that decides when you feel 'full.' MC4R is that appetite thermostat. Set a little low, and hunger switches on more easily — especially with certain medicines — so planning healthy, filling meals from the very start of treatment really helps.",
    illnesses: ["Antipsychotic-associated weight gain", "Obesity & metabolic syndrome", "Binge-eating patterns", "Depression with appetite changes"],
    drugs: [
      { name: "Olanzapine / Clozapine", cls: "Antipsychotic", note: "MC4R variants predict added weight-gain risk." },
      { name: "Risperidone", cls: "Antipsychotic", note: "Weight effects influenced by MC4R, especially in youth." },
      { name: "Setmelanotide (targeted)", cls: "MC4R agonist", note: "Directly activates this receptor for specific genetic obesity." }
    ],
    pharmacology: "Pharmacodynamic appetite-regulation gene. MC4R sits in the brain's energy-balance center; variants weaken 'I'm full' signaling, and several antipsychotics worsen this — a major driver of medication-related weight gain. It anchors proactive metabolic monitoring in psychiatric care.",
    foods: [
      { action: "protect", name: "High-protein meals", why: "Strengthen satiety signaling that MC4R variants weaken.",
        bio: [
          "<strong>Peptide YY & GLP-1</strong> — satiety hormones protein releases — signal fullness to the brain.",
          "<strong>Tyrosine & tryptophan</strong> feed dopamine and serotonin for mood and reward.",
          "<strong>Amino acids</strong> stabilize energy that steadies appetite circuits."
        ] },
      { action: "protect", name: "High-fiber foods (legumes, vegetables, oats)", why: "Promote fullness and steady appetite.",
        bio: [
          "<strong>Fermentable fiber</strong> makes butyrate, calming gut–brain inflammation.",
          "<strong>Beta-glucan</strong> (oats) steadies the blood sugar that drives hunger.",
          "<strong>Folate & B vitamins</strong> (legumes) support neurotransmitter synthesis."
        ] },
      { action: "modulate", name: "Low-glycemic whole grains", why: "Prevent blood-sugar swings that spur hunger.",
        bio: [
          "<strong>Complex carbohydrates</strong> deliver steady glucose, the brain's main fuel.",
          "<strong>Magnesium</strong> supports insulin sensitivity and calmer neurons.",
          "<strong>B vitamins</strong> aid brain energy metabolism."
        ] },
      { action: "amplify", name: "Omega-3 fish", why: "Support metabolic health and reduce inflammation.",
        bio: [
          "<strong>EPA</strong> reduces inflammation tied to metabolic syndrome and low mood.",
          "<strong>DHA</strong> supports neuron membranes and appetite-regulating circuits.",
          "<strong>Vitamin D</strong> supports metabolic and mood health."
        ] },
      { action: "protect", name: "Mindful, regular meals", why: "Structure and pacing counter weakened fullness cues.",
        bio: [
          "<strong>Slower eating</strong> gives satiety hormones (CCK, GLP-1) time to reach the brain.",
          "<strong>Regular timing</strong> supports circadian and appetite-hormone rhythms.",
          "<strong>Steady glucose</strong> from paced meals keeps neurons well fueled."
        ] }
    ],
    foodMimic: "MC4R is the brain's fullness switch. No food flips it like the targeted drug setmelanotide, but protein and fiber strengthen the SAME satiety signaling — the practical, provider-endorsed way to protect against the appetite increase MC4R variants and certain medications cause."
  },
  {
    symbol: "MTHFR", name: "Methylenetetrahydrofolate Reductase", locus: "1p36.22",
    category: "other",
    population: "Very common: roughly 10–15% of people carry two copies of the C677T variant (TT), and about 40% carry one copy, each modestly reducing folate activation.",
    plain: "MTHFR is the enzyme that activates folate (vitamin B9) into the form your brain actually uses to make mood chemicals like serotonin and dopamine. A common slower version means you activate folate less efficiently. For some people, using the already-active form of folate (L-methylfolate) supports better mood. It's one of the most talked-about nutrition genes in mental health.",
    analogy: "Think of a can opener for a can of soup (folate). Your brain can't 'eat' the folate until it's opened into the usable form. MTHFR is that opener. A slower opener means using the already-opened form — L-methylfolate — can give the brain the folate it needs to build mood chemicals.",
    illnesses: ["Depression (especially treatment-resistant)", "Anxiety", "Bipolar disorder", "Cognitive complaints"],
    drugs: [
      { name: "L-methylfolate (Deplin)", cls: "Medical food / augmentation", note: "Provides the active folate the variant struggles to make; used to augment antidepressants." },
      { name: "SSRIs (augmented)", cls: "Antidepressant", note: "Folate status influences monoamine synthesis and SSRI response." },
      { name: "B-complex / B12 support", cls: "Supplement", note: "Works with folate in the methylation cycle." }
    ],
    pharmacology: "A pharmacodynamic/metabolic gene bridging nutrition and psychiatry. MTHFR activates folate needed to build serotonin, dopamine, and norepinephrine. Reduced activity can lower these and raise homocysteine. This is why L-methylfolate — the post-enzyme product — is used to AUGMENT antidepressants, a textbook food-meets-medicine intersection.",
    foods: [
      { action: "amplify", name: "Leafy greens (spinach, romaine, arugula)", why: "Richest natural folate sources for the methylation cycle.",
        bio: [
          "<strong>Folate (B9)</strong> is the exact nutrient MTHFR activates to build serotonin and dopamine.",
          "<strong>Lutein</strong> concentrates in the brain and supports memory.",
          "<strong>Magnesium</strong> calms neurons and supports enzyme function."
        ] },
      { action: "amplify", name: "Legumes (lentils, chickpeas, beans)", why: "Excellent folate plus steady energy.",
        bio: [
          "<strong>Folate</strong> fuels the methylation cycle for neurotransmitter synthesis.",
          "<strong>Iron</strong> supports dopamine production and oxygen delivery.",
          "<strong>Resistant starch</strong> feeds gut microbes that make mood-supporting metabolites."
        ] },
      { action: "amplify", name: "Asparagus, broccoli, Brussels sprouts", why: "High folate to support monoamine synthesis.",
        bio: [
          "<strong>Folate</strong> supports serotonin, dopamine and norepinephrine production.",
          "<strong>Sulforaphane</strong> (broccoli, sprouts) activates Nrf2 antioxidant defenses.",
          "<strong>Inulin</strong> (asparagus) is a prebiotic that supports the gut–brain axis."
        ] },
      { action: "amplify", name: "Avocado", why: "Folate plus brain-healthy fats.",
        bio: [
          "<strong>Folate</strong> supports the methylation MTHFR performs.",
          "<strong>Monounsaturated fat</strong> supports nerve-membrane and myelin health.",
          "<strong>Lutein & vitamin E</strong> protect neurons from oxidative stress."
        ] },
      { action: "protect", name: "B12 foods (eggs, fish, dairy)", why: "B12 partners with folate; deficiency mimics or worsens low mood.",
        bio: [
          "<strong>Vitamin B12</strong> works with folate in methylation and maintains nerve myelin.",
          "<strong>Choline</strong> (eggs) builds acetylcholine for memory.",
          "<strong>Omega-3s</strong> (fish) support neuron membranes and mood."
        ] }
    ],
    foodMimic: "This is the clearest food-as-medicine gene. The prescription 'medical food' L-methylfolate is simply the activated form of the folate in leafy greens and legumes. For people with the MTHFR variant, a folate-rich diet (with B12) supports the EXACT pathway the supplement targets — a true complement to antidepressant care, ideally guided by a clinician."
  },
  {
    symbol: "HLA-A", name: "Human Leukocyte Antigen A", locus: "6p22.1",
    category: "other",
    population: "Specific risk alleles are uncommon overall (often a few percent) but vary widely by ancestry; HLA-A*31:01, for example, flags carbamazepine hypersensitivity risk.",
    plain: "HLA-A is part of your immune system's ID-checking team — it shows pieces of molecules to immune cells to decide what's friend or foe. Certain versions can mistakenly flag a specific drug as dangerous, triggering a serious rash or reaction. Testing for these before prescribing those drugs is a powerful safety step that can prevent harm.",
    analogy: "Imagine a security guard checking IDs at a door. HLA-A is that guard for your immune system. In some people the guard mistakes a specific medicine for an intruder and sounds a serious alarm (a dangerous rash) — which is why a quick test before those drugs is so protective.",
    illnesses: ["Bipolar disorder (carbamazepine safety)", "Seizure-related mood conditions", "Any condition treated with high-risk drugs"],
    drugs: [
      { name: "Carbamazepine", cls: "Mood stabilizer / anticonvulsant", note: "HLA-A*31:01 raises risk of hypersensitivity reactions; pre-screening advised." },
      { name: "Oxcarbazepine", cls: "Mood stabilizer", note: "Shares some hypersensitivity-risk biology." },
      { name: "Other aromatic anticonvulsants", cls: "Anticonvulsant", note: "Cross-reactive reaction risk." }
    ],
    pharmacology: "An immune-response (immunogenetic) gene — not about drug levels but about SAFETY. A risk allele can turn an ordinary drug into a trigger for severe skin reactions. This is pharmacogenetics at its most life-saving: a single test can steer a clinician away from a dangerous drug for that individual.",
    foods: [
      { action: "protect", name: "Anti-inflammatory omega-3 fish", why: "Support balanced immune function (general wellness).",
        bio: [
          "<strong>EPA & DHA</strong> resolve inflammation and protect neuron membranes.",
          "<strong>Specialized pro-resolving mediators</strong> from omega-3s help calm immune over-activity.",
          "<strong>Vitamin D</strong> (fatty fish) supports balanced immune and mood function."
        ] },
      { action: "protect", name: "Colorful antioxidant produce", why: "Help regulate immune and inflammatory tone.",
        bio: [
          "<strong>Carotenoids & flavonoids</strong> temper inflammation and protect neurons.",
          "<strong>Vitamin C</strong> supports immune balance and neural antioxidant defense.",
          "<strong>Polyphenols</strong> reduce oxidative stress across the nervous system."
        ] },
      { action: "amplify", name: "Fermented foods", why: "A healthy gut microbiome supports balanced immunity.",
        bio: [
          "<strong>Probiotic bacteria</strong> train immune balance and make neurotransmitter precursors.",
          "<strong>Short-chain fatty acids</strong> calm gut–brain inflammation.",
          "<strong>Vitamin K2</strong> supports nerve-membrane lipids."
        ] },
      { action: "protect", name: "Vitamin-D foods & sensible sunlight", why: "Vitamin D helps modulate immune responses.",
        bio: [
          "<strong>Vitamin D</strong> modulates immune tone and supports serotonin synthesis.",
          "<strong>Vitamin D receptors</strong> sit throughout mood-regulating brain areas.",
          "It supports <strong>neurotrophic factors</strong> tied to brain resilience."
        ] },
      { action: "amplify", name: "Polyphenol-rich foods (berries, olive oil, tea)", why: "Support overall immune resilience.",
        bio: [
          "<strong>Anthocyanins</strong> (berries) protect neurons and support memory.",
          "<strong>Hydroxytyrosol</strong> (olive oil) shields neurons from oxidative stress.",
          "<strong>EGCG</strong> (tea) supports neuroprotection and immune balance."
        ] }
    ],
    foodMimic: "There is no food that mimics this gene's role, and — importantly — no food can substitute for HLA testing before high-risk drugs. The honest message: HLA-A is about drug SAFETY screening. Diet supports general immune health, but the protective action here is genetic testing, not nutrition."
  },
  {
    symbol: "HLA-B", name: "Human Leukocyte Antigen B", locus: "6p21.33",
    category: "other",
    population: "Risk alleles are uncommon but highly ancestry-dependent: HLA-B*15:02 (severe carbamazepine reactions) is notably more frequent in Southeast/East Asian populations.",
    plain: "HLA-B is a close partner to HLA-A in the immune system's ID-checking team. Some versions are strongly linked to severe, dangerous skin reactions to specific drugs — reactions so serious that guidelines recommend testing first, especially for people of certain ancestries. It's one of the clearest examples of how a simple genetic test can prevent a life-threatening event.",
    analogy: "Same security-guard idea, with a partner on duty: HLA-B. For certain people — often tied to ancestry — this guard reacts to a specific drug with a dangerous, whole-building alarm (a severe skin reaction). A simple genetic test beforehand is like checking the guest list to prevent it.",
    illnesses: ["Bipolar disorder (drug-safety screening)", "Seizure-related mood conditions", "Conditions requiring high-risk anticonvulsants"],
    drugs: [
      { name: "Carbamazepine", cls: "Mood stabilizer / anticonvulsant", note: "HLA-B*15:02 strongly predicts Stevens-Johnson syndrome/TEN; testing recommended in at-risk ancestries." },
      { name: "Oxcarbazepine", cls: "Mood stabilizer", note: "Associated SJS/TEN risk with the same allele." },
      { name: "Allopurinol (comedication)", cls: "Other", note: "HLA-B*58:01 example of severe-reaction risk." }
    ],
    pharmacology: "Immunogenetic safety gene. HLA-B risk alleles can trigger Stevens-Johnson syndrome and toxic epidermal necrolysis — rare but devastating reactions. Guidelines (FDA/CPIC) recommend pre-prescription testing in higher-risk populations. The 'pharmacology' here is immune recognition, and the intervention is avoidance, not dosing.",
    foods: [
      { action: "protect", name: "Anti-inflammatory omega-3 fish", why: "Support balanced immune regulation.",
        bio: [
          "<strong>EPA & DHA</strong> resolve inflammation and protect neuron membranes.",
          "<strong>Pro-resolving mediators</strong> from omega-3s help calm immune over-activity.",
          "<strong>Vitamin D</strong> supports balanced immune and mood function."
        ] },
      { action: "protect", name: "Antioxidant-rich produce", why: "Help maintain healthy immune tone.",
        bio: [
          "<strong>Flavonoids & carotenoids</strong> temper inflammation and protect neurons.",
          "<strong>Vitamin C</strong> supports immune balance and neural antioxidant defense.",
          "<strong>Polyphenols</strong> reduce oxidative stress in the nervous system."
        ] },
      { action: "amplify", name: "Fermented/probiotic foods", why: "Gut health underpins balanced immunity.",
        bio: [
          "<strong>Probiotic bacteria</strong> support immune balance and make neurotransmitter precursors.",
          "<strong>Short-chain fatty acids</strong> calm gut–brain inflammation.",
          "<strong>Vitamin K2</strong> supports nerve-membrane lipids."
        ] },
      { action: "protect", name: "Vitamin-D and zinc foods", why: "Cofactors for healthy immune function.",
        bio: [
          "<strong>Vitamin D</strong> modulates immunity and supports serotonin synthesis.",
          "<strong>Zinc</strong> regulates immune balance and neurotransmitter signaling.",
          "<strong>Zinc</strong> also protects against oxidative stress in neurons."
        ] },
      { action: "amplify", name: "Polyphenol-rich whole foods", why: "Broad immune and anti-inflammatory support.",
        bio: [
          "<strong>Polyphenols</strong> reduce neuroinflammation and support brain resilience.",
          "<strong>Flavanols</strong> improve cerebral blood flow.",
          "<strong>Resveratrol & ellagic acid</strong> protect neurons from oxidative damage."
        ] }
    ],
    foodMimic: "Like HLA-A, this gene has no food 'mimic' and no dietary substitute for testing. The protective action is clear and clinical: genetic screening before high-risk drugs. We include nutrition for general immune wellness, but we want to be honest — here, the life-saving step is the test, not the plate."
  }
];

/* ============================================================
   App metadata, safety, sourcing & review status
   Added to support App Store medical-app review (Guidelines 1.4.1,
   4.2, 5.1) and to give users transparent sourcing.
   ============================================================ */

const APP_INFO = {
  name: "NeuroNourish",
  version: "1.2.0",
  updated: "July 2026",
  // Honest editorial standing. We do NOT claim a clinician has signed off
  // unless/until one actually has — falsely claiming review would itself be
  // grounds for rejection and a consumer-protection problem.
  review: {
    state: "pending",
    label: "Pending independent clinical review",
    detail:
      "This content was compiled from the published guidance and consensus " +
      "statements of the organizations listed under Sources, and cross-checked " +
      "for agreement among them. It has NOT yet been independently verified by a " +
      "licensed clinician for this application. A board-certified psychiatrist or " +
      "clinical pharmacist review is planned before any clinical or commercial use. " +
      "Until that sign-off is published here, treat every item as general education only."
  },
  reviewerSignoff: {
    // Filled in only when a named, credentialed clinician actually reviews.
    reviewer: null,      // e.g., "Jane Smith, MD, Psychiatry"
    credentials: null,
    date: null
  }
};

/* Plain-English methodology shown on the Safety & Sources screen. */
const METHODOLOGY = [
  "Gene list: taken verbatim from the Genomind Pharmacogenetic Report as cataloged in the NIH Genetic Testing Registry (GTR000523653, last updated October 2025).",
  "Gene function & drug relationships: described to be consistent with the Clinical Pharmacogenetics Implementation Consortium (CPIC) guidelines and PharmGKB, the primary clinical pharmacogenomics knowledge bases.",
  "Mental-health associations: framed to align with the American Psychiatric Association (APA) and the National Institute of Mental Health (NIMH).",
  "Nutrition guidance: reflects WHOLE-DIET patterns (e.g., Mediterranean / 'SMILES'-style diets) with the strongest evidence, as summarized by the International Society for Nutritional Psychiatry Research (ISNPR), the Food & Mood Centre (Deakin University), and the American Society for Nutrition (ASN). Where societies differ, we present the conservative, consensus position and label emerging items as such.",
  "Foods are presented as COMPLEMENTS that influence the same biological pathway — never as replacements for medication, and never as treatment claims.",
  "Population-frequency figures are approximate ranges that vary by ancestry and study; they are for education, not personal risk estimation."
];

/* Authoritative sources (real, verifiable organizations & key literature). */
const REFERENCES = [
  { group: "Cross-referenced societies", items: [
    { name: "American Psychiatric Association (APA)", note: "Practice guidelines & resources — psychiatry.org" },
    { name: "National Institute of Mental Health (NIMH)", note: "Mental-health topics & statistics — nimh.nih.gov" },
    { name: "International Society for Nutritional Psychiatry Research (ISNPR)", note: "Position statement: Sarris J, et al. 'Nutritional medicine as mainstream in psychiatry.' Lancet Psychiatry, 2015." },
    { name: "Food & Mood Centre, Deakin University", note: "SMILES trial: Jacka FN, et al. 'A randomised controlled trial of dietary improvement for adults with major depression.' BMC Medicine, 2017." },
    { name: "American Society for Nutrition (ASN)", note: "Advances in Nutrition & The American Journal of Clinical Nutrition — nutrition.org" },
    { name: "Global Brain Health Institute (GBHI)", note: "Brain-health research & education — gbhi.org" }
  ]},
  { group: "Pharmacogenomics knowledge bases", items: [
    { name: "Clinical Pharmacogenetics Implementation Consortium (CPIC)", note: "Peer-reviewed gene–drug dosing guidelines (e.g., CYP2D6, CYP2C19, SLCO1B1, HLA-A, HLA-B) — cpicpgx.org" },
    { name: "PharmGKB", note: "NIH-funded pharmacogenomics knowledge resource — pharmgkb.org" },
    { name: "NIH Genetic Testing Registry (GTR)", note: "Panel/gene reference — ncbi.nlm.nih.gov/gtr" },
    { name: "U.S. FDA — Table of Pharmacogenomic Associations", note: "Drug-label pharmacogenomic information — fda.gov" }
  ]},
  { group: "Panel source", items: [
    { name: "Genomind Pharmacogenetic Report", note: "Source of the 27-gene list (report tier/composition may vary by revision)." }
  ]}
];

/* Crisis resources — required-quality content for a mental-health app. */
const CRISIS_RESOURCES = [
  { region: "US", name: "988 Suicide & Crisis Lifeline", contact: "Call or text 988", url: "https://988lifeline.org" },
  { region: "US", name: "Crisis Text Line", contact: "Text HOME to 741741", url: "https://www.crisistextline.org" },
  { region: "US", name: "Emergency services", contact: "Call 911 if you or someone else is in immediate danger", url: null },
  { region: "International", name: "Find A Helpline", contact: "findahelpline.com — local crisis lines worldwide", url: "https://findahelpline.com" }
];

/* One accurate sourcing line shown on every gene page. */
const PER_GENE_SOURCE =
  "Sources: gene function and gene–drug relationships are described to be consistent with CPIC guidelines, PharmGKB, and the NIH Genetic Testing Registry; mental-health associations align with the APA and NIMH; nutrition guidance reflects whole-diet evidence summarized by the ISNPR, the Food & Mood Centre, and the American Society for Nutrition. See “Safety & Sources” for full references. This is general education, not a personalized recommendation.";

/* Expose for the app */
if (typeof window !== "undefined") {
  window.GENE_DATA = GENES;
  window.GENE_CATEGORIES = GENE_CATEGORIES;
  window.FOOD_ACTIONS = FOOD_ACTIONS;
  window.CONSENSUS_BODIES = CONSENSUS_BODIES;
  window.APP_INFO = APP_INFO;
  window.METHODOLOGY = METHODOLOGY;
  window.REFERENCES = REFERENCES;
  window.CRISIS_RESOURCES = CRISIS_RESOURCES;
  window.PER_GENE_SOURCE = PER_GENE_SOURCE;
}
