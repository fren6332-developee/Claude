/*
 * Whispers of the Six Realms — audio engine
 *
 * A tiny chiptune sequencer built on the Web Audio API. The melodies are
 * original but written in the spirit of Nobuo Uematsu's Final Fantasy VI
 * score: wandering minor-key leads over gentle arpeggiated chords, with a
 * distinct mood for each biome.
 */
(function () {
  "use strict";

  // Equal-tempered note table (A4 = 440Hz). Names like "c4", "fs4", "r" (rest).
  const SEMI = {
    c: 0, cs: 1, d: 2, ds: 3, e: 4, f: 5, fs: 6,
    g: 7, gs: 8, a: 9, as: 10, b: 11,
  };
  function freq(note) {
    if (note === "r") return 0;
    const m = /^([a-g]s?)(\d)$/.exec(note);
    if (!m) return 0;
    const midi = SEMI[m[1]] + (parseInt(m[2], 10) + 1) * 12;
    return 440 * Math.pow(2, (midi - 69) / 12);
  }

  const AudioEngine = {
    ctx: null,
    master: null,
    enabled: true,
    _timer: null,
    _step: 0,
    _track: null,
    _bpm: 112,

    init() {
      if (this.ctx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.0;
      this.master.connect(this.ctx.destination);
    },

    resume() {
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    },

    setEnabled(on) {
      this.enabled = on;
      if (!this.master) return;
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.linearRampToValueAtTime(on ? 0.5 : 0.0, now + 0.3);
    },

    // --- one-shot tone, used for melody/bass voices and sound effects ---
    blip(f, dur, type, vol, dest) {
      if (!this.ctx || f <= 0) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(vol, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      osc.connect(g);
      g.connect(dest || this.master);
      osc.start(t);
      osc.stop(t + dur + 0.02);
    },

    // --- short noise burst for percussive / impact sound effects ---
    noise(dur, vol, hp) {
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const len = Math.floor(this.ctx.sampleRate * dur);
      const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
      const src = this.ctx.createBufferSource();
      src.buffer = buf;
      const filt = this.ctx.createBiquadFilter();
      filt.type = "highpass";
      filt.frequency.value = hp || 600;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(filt);
      filt.connect(g);
      g.connect(this.master);
      src.start(t);
    },

    // ---- sound effects -------------------------------------------------
    sfx(name) {
      if (!this.ctx || !this.enabled) return;
      switch (name) {
        case "sword":
          this.noise(0.12, 0.18, 1800);
          this.blip(660, 0.1, "square", 0.12);
          break;
        case "hit":
          this.blip(180, 0.16, "sawtooth", 0.22);
          this.noise(0.1, 0.14, 400);
          break;
        case "hurt":
          this.blip(140, 0.28, "square", 0.25);
          break;
        case "door":
          this.blip(523, 0.12, "triangle", 0.2);
          this.blip(784, 0.18, "triangle", 0.2);
          break;
        case "win":
          ["c5", "e5", "g5", "c6"].forEach((n, i) =>
            setTimeout(() => this.blip(freq(n), 0.4, "triangle", 0.25), i * 160)
          );
          break;
      }
    },

    // ---- looping biome music ------------------------------------------
    playTrack(track) {
      this.init();
      this._track = track;
      this._bpm = track.bpm || 112;
      this._step = 0;
      if (this._timer) clearInterval(this._timer);
      const stepMs = (60000 / this._bpm) / 2; // eighth notes
      this._timer = setInterval(() => this._tick(), stepMs);
    },

    stopTrack() {
      if (this._timer) clearInterval(this._timer);
      this._timer = null;
    },

    _tick() {
      if (!this.enabled || !this._track) return;
      const tr = this._track;
      const i = this._step;
      const lead = tr.lead[i % tr.lead.length];
      const bass = tr.bass[i % tr.bass.length];
      const stepDur = (60 / this._bpm) / 2;

      if (lead && lead !== "r") {
        this.blip(freq(lead), stepDur * 1.7, tr.leadWave || "square", 0.16);
        this.blip(freq(lead) * 2, stepDur * 1.7, "triangle", 0.05);
      }
      if (bass && bass !== "r") {
        this.blip(freq(bass), stepDur * 1.9, "triangle", 0.22);
      }
      // gentle arpeggio shimmer every other step
      if (tr.arp && i % 2 === 0) {
        const a = tr.arp[(i / 2) % tr.arp.length];
        if (a && a !== "r") this.blip(freq(a), stepDur * 1.2, "sine", 0.07);
      }
      this._step++;
    },
  };

  /*
   * Biome themes. Each is a short loop of eighth notes.
   * `_` is shorthand for a held/rest beat ("r").
   */
  const r = "r";
  window.REALM_THEMES = {
    // 1. FOREST — pastoral, hopeful (overworld feel)
    forest: {
      bpm: 116, leadWave: "square",
      lead: ["e4","g4","a4","b4","a4","g4","e4",r, "d4","e4","g4","e4","d4",r,"b3",r,
             "c4","e4","g4","c5","b4","g4","e4",r, "d4","e4","d4","b3","a3",r,r,r],
      bass: ["a2",r,"a2",r,"e2",r,"e2",r, "f2",r,"f2",r,"c3",r,"c3",r,
             "a2",r,"a2",r,"e2",r,"e2",r, "g2",r,"g2",r,"d2",r,r,r],
      arp: ["a3","c4","e4","c4","e3","g3","b3","g3"],
    },
    // 2. DESERT — exotic, swaying (harmonic minor color)
    desert: {
      bpm: 104, leadWave: "sawtooth",
      lead: ["d4","ef4","fs4","g4","fs4","ef4","d4",r, "c4","d4","ef4","d4","c4",r,"as3",r,
             "d4","fs4","a4","as4","a4","fs4","d4",r, "ef4","d4","c4","as3","a3",r,r,r],
      bass: ["d2",r,"d2",r,"as2",r,"as2",r, "g2",r,"g2",r,"a2",r,"a2",r,
             "d2",r,"d2",r,"as2",r,"as2",r, "g2",r,"a2",r,"d2",r,r,r],
      arp: ["d3","f3","a3","f3","as3","d4","f4","d4"],
    },
    // 3. TUNDRA — sparse, crystalline, melancholic
    tundra: {
      bpm: 92, leadWave: "triangle",
      lead: ["a4",r,"e4",r,"f4",r,"e4",r, "d4",r,"c4",r,"d4","e4","d4",r,
             "g4",r,"d4",r,"e4",r,"d4",r, "c4",r,"a3",r,"b3",r,r,r],
      bass: ["a2",r,r,r,"f2",r,r,r, "d2",r,r,r,"e2",r,r,r,
             "g2",r,r,r,"e2",r,r,r, "a2",r,r,r,"e2",r,r,r],
      arp: ["a3","c4","e4","c4","f3","a3","c4","a3"],
    },
    // 4. VOLCANO — driving, tense, dramatic
    volcano: {
      bpm: 132, leadWave: "sawtooth",
      lead: ["c4","c4","ef4","c4","g4","ef4","c4",r, "af3","af3","c4","af3","ef4","c4","af3",r,
             "bf3","bf3","d4","bf3","f4","d4","bf3",r, "g3","bf3","c4","ef4","d4","c4","bf3",r],
      bass: ["c2","c2","r","c2","g2","r","c2","r", "af1","af1","r","af1","ef2","r","af1","r",
             "bf1","bf1","r","bf1","f2","r","bf1","r", "g1","g1","r","g1","d2","r","g1","r"],
      arp: ["c3","ef3","g3","ef3","af2","c3","ef3","c3"],
    },
    // 5. SWAMP — murky, mysterious, slow
    swamp: {
      bpm: 96, leadWave: "square",
      lead: ["e4",r,"f4","e4","d4",r,"e4",r, "c4",r,"d4","c4","b3",r,"a3",r,
             "a4",r,"g4","f4","e4",r,"d4",r, "e4",r,"d4","c4","b3",r,r,r],
      bass: ["a2",r,"e2",r,"f2",r,"c2",r, "d2",r,"a2",r,"e2",r,"e2",r,
             "f2",r,"c2",r,"d2",r,"a2",r, "e2",r,"e2",r,"a2",r,r,r],
      arp: ["a3","c4","e4","g4","f3","a3","c4","e4"],
    },
    // 6. COAST — triumphant, soaring (the final realm)
    coast: {
      bpm: 120, leadWave: "square",
      lead: ["g4","a4","b4","d5","b4","a4","g4",r, "e4","g4","a4","b4","a4","g4","e4",r,
             "c5","b4","a4","g4","a4","b4","c5","d5", "b4","a4","g4","a4","g4",r,r,r],
      bass: ["g2",r,"d3",r,"e2",r,"b2",r, "c2",r,"g2",r,"d2",r,"d2",r,
             "c2",r,"g2",r,"a2",r,"e2",r, "g2",r,"d3",r,"g2",r,r,r],
      arp: ["g3","b3","d4","b3","c4","e4","g4","e4"],
    },
  };

  window.AudioEngine = AudioEngine;
})();
