/*
 * Background music — a gentle, wistful adventuring theme played live with the
 * Web Audio API (no audio files). It is written in the lilting, folk-hero
 * spirit of Locke's theme from Final Fantasy VI: an original melody, not a
 * transcription. It only plays while you face the computer.
 *
 * Exposes window.ChessMusic with start(), stop(), setEnabled(), enabled.
 */
(function () {
  "use strict";

  let ctx = null;
  let master = null;
  let playing = false;
  let enabled = true;
  let timer = null;
  let nextLoopTime = 0;

  const BPM = 96;
  const BEAT = 60 / BPM;
  const LOOP_BARS = 8;
  const LOOP_BEATS = LOOP_BARS * 4;

  const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

  // Chord cycle (one chord per bar): Dm – Bb – F – C, in F major / D minor.
  const CHORDS = [
    { bass: [38, 45], arp: [62, 65, 69] }, // Dm:  D2,A2  / D4 F4 A4
    { bass: [46, 53], arp: [58, 62, 65] }, // Bb:  Bb2,F3 / Bb3 D4 F4
    { bass: [41, 48], arp: [53, 57, 60] }, // F:   F2,C3  / F3 A3 C4
    { bass: [48, 55], arp: [60, 64, 67] }, // C:   C3,G3  / C4 E4 G4
  ];

  // Melody over the 8 bars (two phrases). Each entry: [midi|0, beats].
  // 0 = rest. Note that the phrase arcs upward then resolves, wistfully.
  const MELODY = [
    // phrase A (bars 1-4)
    [69, 2], [74, 1], [72, 1],   // A4 . D5 C5
    [70, 2], [74, 1], [72, 1],   // Bb4 . D5 C5
    [69, 1], [65, 1], [67, 2],   // A4 F4 G4.
    [64, 1], [67, 1], [72, 2],   // E4 G4 C5.
    // phrase B (bars 5-8)
    [77, 2], [76, 1], [74, 1],   // F5 . E5 D5
    [70, 1], [74, 1], [72, 2],   // Bb4 D5 C5.
    [69, 1], [72, 1], [70, 1], [69, 1], // A4 C5 Bb4 A4
    [67, 2], [62, 2],            // G4. D4.
  ];

  function ensureContext() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.0;
    master.connect(ctx.destination);
  }

  function note(time, midi, durBeats, opts) {
    if (!midi) return;
    const dur = durBeats * BEAT;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = opts.type;
    osc.frequency.value = midiToFreq(midi);
    const peak = opts.gain;
    const a = 0.012, rel = Math.min(0.25, dur * 0.5);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.linearRampToValueAtTime(peak, time + a);
    g.gain.setValueAtTime(peak, time + Math.max(a, dur - rel));
    g.gain.exponentialRampToValueAtTime(0.0008, time + dur);
    osc.connect(g);
    g.connect(master);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  function scheduleLoop(start) {
    // Bass: root for two beats, fifth for two beats, each bar.
    for (let bar = 0; bar < LOOP_BARS; bar++) {
      const chord = CHORDS[bar % 4];
      const t = start + bar * 4 * BEAT;
      note(t, chord.bass[0] - 12, 2, { type: "triangle", gain: 0.16 });
      note(t + 2 * BEAT, chord.bass[1] - 12, 2, { type: "triangle", gain: 0.16 });
      // Arpeggio: eight soft eighth-notes per bar.
      const pat = [0, 1, 2, 1, 0, 1, 2, 1];
      for (let i = 0; i < 8; i++) {
        note(t + i * 0.5 * BEAT, chord.arp[pat[i]], 0.45, { type: "square", gain: 0.045 });
      }
    }
    // Melody.
    let t = start;
    for (const [midi, beats] of MELODY) {
      note(t, midi, beats * 0.95, { type: "triangle", gain: 0.12 });
      t += beats * BEAT;
    }
  }

  function tick() {
    if (!playing) return;
    const ahead = ctx.currentTime + 0.4;
    while (nextLoopTime < ahead) {
      scheduleLoop(nextLoopTime);
      nextLoopTime += LOOP_BEATS * BEAT;
    }
  }

  function start() {
    if (!enabled) return;
    ensureContext();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    if (playing) return;
    playing = true;
    master.gain.cancelScheduledValues(ctx.currentTime);
    master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
    master.gain.linearRampToValueAtTime(0.5, ctx.currentTime + 1.2);
    nextLoopTime = ctx.currentTime + 0.15;
    tick();
    timer = setInterval(tick, 120);
  }

  function stop() {
    playing = false;
    if (timer) { clearInterval(timer); timer = null; }
    if (master && ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setValueAtTime(master.gain.value, ctx.currentTime);
      master.gain.linearRampToValueAtTime(0.0, ctx.currentTime + 0.4);
    }
  }

  function setEnabled(v) {
    enabled = v;
    if (!v) stop();
  }

  window.ChessMusic = {
    start,
    stop,
    setEnabled,
    get enabled() { return enabled; },
    get playing() { return playing; },
  };
})();
