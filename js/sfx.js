/*
 * Sound effects — short, clay-toned cues synthesised live with the Web Audio
 * API (no audio files). These play in both two-player and vs-computer modes,
 * independently of the background music. Kept subtle so they never get in the
 * way of play.
 *
 * Exposes window.ChessSFX.play(type) for:
 *   move · select · capture · castle · check · promote · win · draw
 */
(function () {
  "use strict";

  let ctx = null;
  let master = null;
  let enabled = true;

  function ensure() {
    if (ctx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = 0.5;
    master.connect(ctx.destination);
  }

  function tone(t, freq, dur, type, gain, glideTo) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type || "sine";
    o.frequency.setValueAtTime(freq, t);
    if (glideTo) o.frequency.exponentialRampToValueAtTime(glideTo, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0006, t + dur);
    o.connect(g);
    g.connect(master);
    o.start(t);
    o.stop(t + dur + 0.02);
  }

  // A soft percussive "tap" — the clay knock of a piece set down.
  function knock(t, dur, gain, cutoff) {
    const len = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const f = ctx.createBiquadFilter();
    f.type = "lowpass";
    f.frequency.value = cutoff || 1100;
    const g = ctx.createGain();
    g.gain.value = gain;
    src.connect(f); f.connect(g); g.connect(master);
    src.start(t);
  }

  const SFX = {
    move() { const t = ctx.currentTime; tone(t, 200, 0.12, "triangle", 0.16, 150); knock(t, 0.05, 0.05, 900); },
    select() { const t = ctx.currentTime; tone(t, 340, 0.06, "sine", 0.08, 300); },
    capture() {
      const t = ctx.currentTime;
      tone(t, 160, 0.22, "triangle", 0.20, 60);   // impact
      tone(t, 90, 0.55, "sine", 0.22, 32);          // low boom drop
      knock(t, 0.30, 0.28, 480);                    // explosion body
      knock(t + 0.015, 0.16, 0.18, 2600);           // bright crackle
    },
    castle() { const t = ctx.currentTime; tone(t, 210, 0.1, "triangle", 0.15, 170); tone(t + 0.11, 210, 0.1, "triangle", 0.15, 170); },
    check() { const t = ctx.currentTime; tone(t, 740, 0.12, "square", 0.08); tone(t + 0.12, 988, 0.16, "square", 0.08); },
    promote() { const t = ctx.currentTime; [523, 659, 784, 1047].forEach((f, i) => tone(t + i * 0.09, f, 0.16, "triangle", 0.11)); },
    win() {
      const t = ctx.currentTime;
      [523, 659, 784, 1047].forEach((f, i) => tone(t + i * 0.12, f, 0.4, "triangle", 0.13));
      tone(t + 0.36, 1047, 0.7, "sine", 0.1);
    },
    draw() { const t = ctx.currentTime; tone(t, 440, 0.25, "sine", 0.11, 392); tone(t + 0.26, 392, 0.45, "sine", 0.11, 349); },
  };

  function play(type) {
    if (!enabled) return;
    ensure();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume();
    (SFX[type] || SFX.move)();
  }

  window.ChessSFX = {
    play,
    setEnabled(v) { enabled = v; },
    get enabled() { return enabled; },
  };
})();
