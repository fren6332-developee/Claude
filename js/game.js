/*
 * Whispers of the Six Realms
 * A small top-down, Zelda: A Link to the Past-inspired adventure.
 *
 * Six single-screen realms, each a different Earth biome. Clear every foe —
 * ghosts, goblins, and bats — to open the gate onward. Reach the relic in the
 * final realm to win. Tuned to be gentle: lots of hearts, weak enemies.
 */
(function () {
  "use strict";

  const canvas = document.getElementById("screen");
  const ctx = canvas.getContext("2d");

  const TILE = 32;
  const COLS = canvas.width / TILE; // 24
  const ROWS = canvas.height / TILE; // 16
  const MAX_HP = 12; // 6 hearts (2 halves each)

  // ---- input ---------------------------------------------------------
  const keys = {};
  const KEYMAP = {
    ArrowUp: "up", KeyW: "up",
    ArrowDown: "down", KeyS: "down",
    ArrowLeft: "left", KeyA: "left",
    ArrowRight: "right", KeyD: "right",
    Space: "attack", KeyZ: "attack",
  };
  window.addEventListener("keydown", (e) => {
    const a = KEYMAP[e.code];
    if (a) {
      keys[a] = true;
      e.preventDefault();
    }
  });
  window.addEventListener("keyup", (e) => {
    const a = KEYMAP[e.code];
    if (a) keys[a] = false;
  });

  // ---- realm (biome) definitions -------------------------------------
  // Each realm is one screen. `enemies` lists spawns. Cleared = gate opens.
  const REALMS = [
    {
      name: "Verdant Wood",
      music: "forest",
      ground: ["#3a7d3a", "#347234"],
      accent: "#235023",
      decor: "trees",
      enemies: [
        { type: "goblin", x: 6, y: 4 },
        { type: "goblin", x: 17, y: 9 },
        { type: "bat", x: 12, y: 6 },
      ],
    },
    {
      name: "Sun-Scoured Desert",
      music: "desert",
      ground: ["#d9b15e", "#cfa651"],
      accent: "#b88f3e",
      decor: "cacti",
      enemies: [
        { type: "goblin", x: 5, y: 8 },
        { type: "bat", x: 16, y: 4 },
        { type: "bat", x: 18, y: 11 },
        { type: "goblin", x: 11, y: 6 },
      ],
    },
    {
      name: "Frostpeak Tundra",
      music: "tundra",
      ground: ["#cfe6f0", "#bcd9e8"],
      accent: "#9cc2d6",
      decor: "ice",
      enemies: [
        { type: "ghost", x: 6, y: 5 },
        { type: "ghost", x: 17, y: 10 },
        { type: "bat", x: 12, y: 4 },
      ],
    },
    {
      name: "Emberreach Volcano",
      music: "volcano",
      ground: ["#5a2620", "#4a1f1a"],
      accent: "#8a3322",
      decor: "lava",
      enemies: [
        { type: "goblin", x: 5, y: 5 },
        { type: "goblin", x: 18, y: 5 },
        { type: "bat", x: 12, y: 8 },
        { type: "ghost", x: 12, y: 12 },
      ],
    },
    {
      name: "Mistmire Swamp",
      music: "swamp",
      ground: ["#3f5234", "#36482d"],
      accent: "#2a3a22",
      decor: "reeds",
      enemies: [
        { type: "ghost", x: 6, y: 6 },
        { type: "ghost", x: 17, y: 6 },
        { type: "goblin", x: 11, y: 10 },
        { type: "bat", x: 8, y: 11 },
      ],
    },
    {
      name: "Lumin Coast",
      music: "coast",
      ground: ["#e6d8a8", "#dccd99"],
      accent: "#3a78b5",
      decor: "shore",
      isFinal: true,
      enemies: [
        { type: "goblin", x: 6, y: 8 },
        { type: "bat", x: 16, y: 6 },
        { type: "ghost", x: 13, y: 10 },
      ],
    },
  ];

  // ---- enemy archetypes ----------------------------------------------
  const ENEMY_KIND = {
    goblin: { hp: 2, speed: 48, r: 12, touch: 1, color: "#6fae4a" },
    bat: { hp: 1, speed: 96, r: 9, touch: 1, color: "#7a5a8a" },
    ghost: { hp: 2, speed: 40, r: 12, touch: 1, color: "#dfe6f2" },
  };

  // ---- game state ----------------------------------------------------
  let state = "title"; // title | play | dead | win
  let realmIndex = 0;
  let enemies = [];
  let gateOpen = false;
  let particles = [];
  let shake = 0;
  let lastTime = 0;

  const player = {
    x: canvas.width / 2,
    y: canvas.height - TILE * 2,
    r: 12,
    speed: 150,
    hp: MAX_HP,
    facing: "up",
    attack: 0, // frames remaining in swing
    attackCd: 0,
    invuln: 0,
  };

  // ---- helpers -------------------------------------------------------
  function dist2(a, b) {
    const dx = a.x - b.x, dy = a.y - b.y;
    return dx * dx + dy * dy;
  }

  function spawnRealm(i) {
    const realm = REALMS[i];
    enemies = realm.enemies.map((e) => {
      const k = ENEMY_KIND[e.type];
      return {
        type: e.type,
        x: e.x * TILE + TILE / 2,
        y: e.y * TILE + TILE / 2,
        hp: k.hp,
        r: k.r,
        speed: k.speed,
        color: k.color,
        touch: k.touch,
        hurt: 0,
        phase: Math.random() * Math.PI * 2, // for bat/ghost motion
      };
    });
    gateOpen = false;
    player.x = TILE * 1.5;
    player.y = canvas.height / 2;
    player.facing = "right";
    document.getElementById("realm-name").textContent =
      `Realm ${i + 1}/6 — ${realm.name}`;
    if (window.AudioEngine) AudioEngine.playTrack(REALM_THEMES[realm.music]);
  }

  function addParticles(x, y, color, n) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = 40 + Math.random() * 120;
      particles.push({
        x, y,
        vx: Math.cos(a) * sp,
        vy: Math.sin(a) * sp,
        life: 0.5,
        color,
      });
    }
  }

  // ---- combat: the sword hitbox in front of the player ---------------
  function swordBox() {
    const reach = 26;
    const w = 30;
    let b = { x: player.x, y: player.y, w, h: w };
    if (player.facing === "up") { b.y -= reach; b.h = reach + 8; b.w = 22; }
    else if (player.facing === "down") { b.y += reach - 6; b.h = reach + 8; b.w = 22; }
    else if (player.facing === "left") { b.x -= reach; b.w = reach + 8; b.h = 22; }
    else { b.x += reach - 6; b.w = reach + 8; b.h = 22; }
    return b;
  }

  function boxHitsCircle(box, c) {
    const cx = Math.max(box.x - box.w / 2, Math.min(c.x, box.x + box.w / 2));
    const cy = Math.max(box.y - box.h / 2, Math.min(c.y, box.y + box.h / 2));
    const dx = c.x - cx, dy = c.y - cy;
    return dx * dx + dy * dy <= c.r * c.r;
  }

  // ---- update --------------------------------------------------------
  function update(dt) {
    if (state !== "play") return;

    // timers
    if (player.attack > 0) player.attack -= dt;
    if (player.attackCd > 0) player.attackCd -= dt;
    if (player.invuln > 0) player.invuln -= dt;
    if (shake > 0) shake = Math.max(0, shake - dt);

    // movement
    let mx = 0, my = 0;
    if (keys.up) my -= 1;
    if (keys.down) my += 1;
    if (keys.left) mx -= 1;
    if (keys.right) mx += 1;
    if (mx || my) {
      const len = Math.hypot(mx, my) || 1;
      player.x += (mx / len) * player.speed * dt;
      player.y += (my / len) * player.speed * dt;
      if (Math.abs(mx) > Math.abs(my)) player.facing = mx < 0 ? "left" : "right";
      else player.facing = my < 0 ? "up" : "down";
    }
    // keep player inside the framed play field
    const pad = TILE * 0.75;
    player.x = Math.max(pad, Math.min(canvas.width - pad, player.x));
    player.y = Math.max(pad, Math.min(canvas.height - pad, player.y));

    // attack
    if (keys.attack && player.attackCd <= 0) {
      player.attack = 0.18;
      player.attackCd = 0.34;
      AudioEngine.sfx("sword");
    }
    const swinging = player.attack > 0;
    const box = swinging ? swordBox() : null;

    // enemies
    for (const e of enemies) {
      if (e.hurt > 0) e.hurt -= dt;
      e.phase += dt * 4;

      // movement AI per type
      const dx = player.x - e.x, dy = player.y - e.y;
      const d = Math.hypot(dx, dy) || 1;
      if (e.type === "bat") {
        // erratic, fast, weaving toward player
        const wob = Math.sin(e.phase) * 0.8;
        e.x += ((dx / d) + Math.cos(e.phase) * wob) * e.speed * dt;
        e.y += ((dy / d) + Math.sin(e.phase * 1.3) * wob) * e.speed * dt;
      } else if (e.type === "ghost") {
        // slow, steady, drifts straight at the hero
        e.x += (dx / d) * e.speed * dt;
        e.y += (dy / d) * e.speed * dt;
      } else {
        // goblin: marches toward player
        e.x += (dx / d) * e.speed * dt;
        e.y += (dy / d) * e.speed * dt;
      }
      e.x = Math.max(TILE * 0.5, Math.min(canvas.width - TILE * 0.5, e.x));
      e.y = Math.max(TILE * 0.5, Math.min(canvas.height - TILE * 0.5, e.y));

      // sword hit
      if (box && e.hurt <= 0 && boxHitsCircle(box, e)) {
        e.hp -= 1;
        e.hurt = 0.3;
        AudioEngine.sfx("hit");
        addParticles(e.x, e.y, e.color, 8);
        // knockback
        e.x += (dx / d) * -16;
        e.y += (dy / d) * -16;
      }

      // touch damage to player
      if (player.invuln <= 0 && dist2(player, e) < (player.r + e.r) ** 2) {
        player.hp -= e.touch;
        player.invuln = 1.0;
        shake = 0.25;
        AudioEngine.sfx("hurt");
        renderHearts();
        if (player.hp <= 0) {
          state = "dead";
          AudioEngine.stopTrack();
          showOverlay(deadCard());
        }
      }
    }

    // cull dead enemies
    const before = enemies.length;
    enemies = enemies.filter((e) => {
      if (e.hp <= 0) {
        addParticles(e.x, e.y, e.color, 16);
        return false;
      }
      return true;
    });
    if (before && enemies.length === 0 && !gateOpen) {
      gateOpen = true;
      AudioEngine.sfx("door");
    }

    // particles
    for (const p of particles) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    particles = particles.filter((p) => p.life > 0);

    // realm transition: when cleared, walk through the gate on the right edge
    if (gateOpen) {
      const realm = REALMS[realmIndex];
      const gateY = canvas.height / 2;
      const atGate =
        player.x > canvas.width - TILE * 1.4 &&
        Math.abs(player.y - gateY) < TILE * 1.2;
      if (atGate) {
        if (realm.isFinal) {
          state = "win";
          AudioEngine.stopTrack();
          AudioEngine.sfx("win");
          showOverlay(winCard());
        } else {
          realmIndex++;
          AudioEngine.sfx("door");
          spawnRealm(realmIndex);
        }
      }
    }
  }

  // ---- rendering -----------------------------------------------------
  function render() {
    const realm = REALMS[realmIndex];
    ctx.save();
    if (shake > 0) {
      ctx.translate((Math.random() - 0.5) * 6 * shake * 4,
                    (Math.random() - 0.5) * 6 * shake * 4);
    }

    drawGround(realm);
    drawDecor(realm);
    drawGate(realm);
    for (const e of enemies) drawEnemy(e);
    drawParticles();
    if (state === "play" || state === "win" || state === "dead") drawPlayer();

    ctx.restore();

    if (state === "play" && gateOpen) drawBanner("The way is open →");
  }

  function drawGround(realm) {
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        ctx.fillStyle = realm.ground[(x + y) % 2];
        ctx.fillRect(x * TILE, y * TILE, TILE, TILE);
      }
    }
    // border frame
    ctx.fillStyle = realm.accent;
    ctx.fillRect(0, 0, canvas.width, TILE * 0.5);
    ctx.fillRect(0, canvas.height - TILE * 0.5, canvas.width, TILE * 0.5);
    ctx.fillRect(0, 0, TILE * 0.5, canvas.height);
    ctx.fillRect(canvas.width - TILE * 0.5, 0, TILE * 0.5, canvas.height);
  }

  // deterministic per-realm scatter of biome decorations
  function decorSpots(realm) {
    if (realm._spots) return realm._spots;
    const spots = [];
    let seed = realm.name.length * 97 + 13;
    const rnd = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };
    for (let i = 0; i < 14; i++) {
      spots.push({
        x: TILE * 1.5 + rnd() * (canvas.width - TILE * 4),
        y: TILE * 1.2 + rnd() * (canvas.height - TILE * 3),
        s: 0.7 + rnd() * 0.6,
      });
    }
    realm._spots = spots;
    return spots;
  }

  function drawDecor(realm) {
    const spots = decorSpots(realm);
    for (const s of spots) {
      const x = s.x, y = s.y, sc = s.s;
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(sc, sc);
      switch (realm.decor) {
        case "trees":
          ctx.fillStyle = "#5b3b1f"; ctx.fillRect(-3, 0, 6, 14);
          ctx.fillStyle = "#1f5c1f";
          circle(0, -6, 14); ctx.fillStyle = "#2e7a2e"; circle(-6, -2, 9); circle(6, -2, 9);
          break;
        case "cacti":
          ctx.fillStyle = "#3f8a4a";
          ctx.fillRect(-4, -16, 8, 30);
          ctx.fillRect(-12, -6, 8, 6); ctx.fillRect(-12, -6, 4, -10);
          ctx.fillRect(4, -2, 8, 6); ctx.fillRect(8, -2, 4, -12);
          break;
        case "ice":
          ctx.fillStyle = "#ffffff"; ctx.globalAlpha = 0.85;
          ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(10, 12); ctx.lineTo(-10, 12);
          ctx.closePath(); ctx.fill();
          ctx.fillStyle = "#bfe3f5"; ctx.fillRect(-3, -4, 6, 14);
          break;
        case "lava":
          ctx.fillStyle = "#1f0e0c"; circle(0, 4, 13);
          ctx.fillStyle = "#ff7a2a"; ctx.globalAlpha = 0.9; circle(0, 4, 8);
          ctx.fillStyle = "#ffd24a"; circle(0, 4, 4);
          break;
        case "reeds":
          ctx.strokeStyle = "#4a6b39"; ctx.lineWidth = 3;
          for (let k = -2; k <= 2; k++) {
            ctx.beginPath(); ctx.moveTo(k * 4, 12);
            ctx.quadraticCurveTo(k * 4 + 4, 0, k * 4 + 2, -14); ctx.stroke();
          }
          break;
        case "shore":
          ctx.fillStyle = "#cdbf8f"; circle(0, 0, 10);
          ctx.fillStyle = "#b9a86f"; circle(-3, -2, 4); circle(4, 3, 3);
          break;
      }
      ctx.restore();
    }
  }

  function drawGate(realm) {
    const gx = canvas.width - TILE * 0.5;
    const gy = canvas.height / 2;
    ctx.save();
    if (gateOpen) {
      // glowing open portal
      const t = performance.now() / 300;
      ctx.fillStyle = realm.isFinal ? "#fff0a0" : "#9ad7ff";
      ctx.globalAlpha = 0.5 + Math.sin(t) * 0.2;
      ctx.fillRect(gx - 14, gy - TILE, 28, TILE * 2);
      ctx.globalAlpha = 1;
      if (realm.isFinal) {
        // the relic to claim
        drawRelic(gx - 4, gy);
      } else {
        ctx.fillStyle = "#fff";
        ctx.font = "20px sans-serif";
        ctx.fillText("→", gx - 8, gy + 7);
      }
    } else {
      // sealed gate
      ctx.fillStyle = "#2a2030";
      ctx.fillRect(gx - 10, gy - TILE, 24, TILE * 2);
      ctx.fillStyle = "#4a3f55";
      for (let i = -1; i <= 1; i++) ctx.fillRect(gx - 8, gy + i * 16 - 4, 20, 4);
    }
    ctx.restore();
  }

  function drawRelic(x, y) {
    const t = performance.now() / 500;
    ctx.save();
    ctx.translate(x, y + Math.sin(t) * 3);
    ctx.fillStyle = "#ffe680";
    ctx.beginPath();
    ctx.moveTo(0, -14); ctx.lineTo(13, 10); ctx.lineTo(-13, 10);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#fffbe0";
    ctx.beginPath();
    ctx.moveTo(0, -6); ctx.lineTo(6, 6); ctx.lineTo(-6, 6);
    ctx.closePath(); ctx.fill();
    ctx.restore();
  }

  function drawPlayer() {
    const x = player.x, y = player.y;
    const blink = player.invuln > 0 && Math.floor(player.invuln * 16) % 2 === 0;
    ctx.save();
    if (blink) ctx.globalAlpha = 0.4;

    // shadow
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.beginPath(); ctx.ellipse(x, y + 12, 11, 5, 0, 0, Math.PI * 2); ctx.fill();

    // body (green tunic hero)
    ctx.fillStyle = "#2f9e44"; ctx.fillRect(x - 9, y - 4, 18, 16);
    ctx.fillStyle = "#1f7a32"; ctx.fillRect(x - 9, y + 8, 18, 4);
    // head
    ctx.fillStyle = "#f1c79b"; ctx.fillRect(x - 7, y - 16, 14, 12);
    // cap
    ctx.fillStyle = "#1f7a32"; ctx.fillRect(x - 8, y - 19, 16, 5);
    ctx.fillRect(x - 8, y - 19, 5, 9);

    // sword swing
    if (player.attack > 0) {
      ctx.fillStyle = "#e8eef5";
      const b = swordBox();
      ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h);
      ctx.fillStyle = "#c9d4e0";
      ctx.fillRect(b.x - 2, b.y - 2, 4, 4);
    }
    ctx.restore();
  }

  function drawEnemy(e) {
    const x = e.x, y = e.y;
    const hurt = e.hurt > 0 && Math.floor(e.hurt * 20) % 2 === 0;
    ctx.save();
    // shadow
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    ctx.beginPath(); ctx.ellipse(x, y + e.r * 0.7, e.r * 0.8, 4, 0, 0, Math.PI * 2); ctx.fill();

    ctx.fillStyle = hurt ? "#ffffff" : e.color;
    if (e.type === "goblin") {
      ctx.fillRect(x - 10, y - 8, 20, 18);
      ctx.fillStyle = hurt ? "#fff" : "#4f8a32";
      ctx.fillRect(x - 12, y - 10, 5, 6); ctx.fillRect(x + 7, y - 10, 5, 6); // ears
      ctx.fillStyle = "#ffec3d"; ctx.fillRect(x - 6, y - 4, 3, 3); ctx.fillRect(x + 3, y - 4, 3, 3);
      ctx.fillStyle = "#222"; ctx.fillRect(x - 4, y + 4, 8, 2); // mouth
    } else if (e.type === "bat") {
      const f = Math.sin(e.phase * 3) * 6;
      ctx.beginPath(); ctx.arc(x, y, 8, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = hurt ? "#fff" : "#5a3f6a";
      ctx.beginPath(); ctx.moveTo(x - 6, y);
      ctx.lineTo(x - 18, y - 6 - f); ctx.lineTo(x - 14, y + 4); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(x + 6, y);
      ctx.lineTo(x + 18, y - 6 - f); ctx.lineTo(x + 14, y + 4); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#ff5a5a"; ctx.fillRect(x - 4, y - 2, 2, 2); ctx.fillRect(x + 2, y - 2, 2, 2);
    } else {
      // ghost
      ctx.globalAlpha = hurt ? 1 : 0.85;
      ctx.fillStyle = hurt ? "#fff" : e.color;
      ctx.beginPath();
      ctx.arc(x, y - 2, 11, Math.PI, 0);
      ctx.lineTo(x + 11, y + 8);
      for (let i = 0; i < 3; i++) {
        ctx.lineTo(x + 11 - (i * 2 + 1) * (22 / 6), y + (i % 2 ? 8 : 12));
      }
      ctx.lineTo(x - 11, y + 8);
      ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = "#34354a";
      ctx.fillRect(x - 5, y - 4, 3, 4); ctx.fillRect(x + 2, y - 4, 3, 4);
    }
    ctx.restore();
  }

  function drawParticles() {
    for (const p of particles) {
      ctx.globalAlpha = Math.max(0, p.life * 2);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    }
    ctx.globalAlpha = 1;
  }

  function circle(x, y, r) {
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }

  function drawBanner(text) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(canvas.width / 2 - 150, 14, 300, 30);
    ctx.fillStyle = "#f2d272";
    ctx.font = "bold 18px 'Trebuchet MS', sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(text, canvas.width / 2, 35);
    ctx.restore();
  }

  // ---- HUD hearts ----------------------------------------------------
  function renderHearts() {
    const el = document.getElementById("hearts");
    const fullHearts = Math.floor(player.hp / 2);
    const half = player.hp % 2;
    const total = MAX_HP / 2;
    let html = "";
    for (let i = 0; i < total; i++) {
      let cls = "empty", ch = "♡";
      if (i < fullHearts) { cls = "full"; ch = "♥"; }
      else if (i === fullHearts && half) { cls = "full"; ch = "❤"; }
      html += `<span class="heart ${cls}">${ch}</span>`;
    }
    el.innerHTML = html;
  }

  // ---- overlays ------------------------------------------------------
  const overlay = document.getElementById("overlay");
  function showOverlay(html) {
    overlay.innerHTML = `<div class="overlay-card">${html}</div>`;
    overlay.classList.remove("hidden");
  }
  function hideOverlay() {
    overlay.classList.add("hidden");
  }

  function deadCard() {
    return `
      <h1>The Light Fades…</h1>
      <p class="subtitle">You fell in the ${REALMS[realmIndex].name}.</p>
      <p>But hope is patient. Rise and try again.</p>
      <button id="start-btn" type="button">Try Again</button>`;
  }
  function winCard() {
    return `
      <h1>The Six Realms Restored!</h1>
      <p class="subtitle">You claimed the Relic of Dawn.</p>
      <p>Ghosts, goblins, and bats are banished. Light returns to the Earth.
         Thank you for playing.</p>
      <button id="start-btn" type="button">Play Again</button>`;
  }

  function startGame() {
    AudioEngine.init();
    AudioEngine.resume();
    AudioEngine.setEnabled(soundOn);
    realmIndex = 0;
    player.hp = MAX_HP;
    particles = [];
    state = "play";
    renderHearts();
    spawnRealm(0);
    hideOverlay();
  }

  // ---- buttons / sound toggle ----------------------------------------
  let soundOn = true;
  const soundBtn = document.getElementById("sound-toggle");
  soundBtn.addEventListener("click", () => {
    soundOn = !soundOn;
    soundBtn.textContent = `♪ Music: ${soundOn ? "On" : "Off"}`;
    if (window.AudioEngine) AudioEngine.setEnabled(soundOn);
  });

  // Delegated handler so the regenerated start/retry buttons all work.
  document.addEventListener("click", (e) => {
    if (e.target && e.target.id === "start-btn") startGame();
  });

  // ---- main loop -----------------------------------------------------
  function loop(t) {
    const dt = Math.min(0.033, (t - lastTime) / 1000 || 0);
    lastTime = t;
    update(dt);
    render();
    requestAnimationFrame(loop);
  }

  renderHearts();
  requestAnimationFrame(loop);
})();
