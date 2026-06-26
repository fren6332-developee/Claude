/*
 * Chess engine — pure rules, no DOM.
 *
 * Board is an 8x8 array, board[r][c], with r = 0 at the TOP (rank 8) and
 * r = 7 at the BOTTOM (rank 1). White starts at the bottom, Black at the top.
 * A piece is { t, c } where t ∈ {p,n,b,r,q,k} and c ∈ {'w','b'}.
 *
 * Exposes window.Chess with a small functional API the UI builds on.
 */
(function () {
  "use strict";

  const VALUES = { p: 100, n: 320, b: 330, r: 500, q: 900, k: 20000 };

  // ---- Board setup -------------------------------------------------------
  function startBoard() {
    const back = ["r", "n", "b", "q", "k", "b", "n", "r"];
    const board = Array.from({ length: 8 }, () => Array(8).fill(null));
    for (let c = 0; c < 8; c++) {
      board[0][c] = { t: back[c], c: "b" };
      board[1][c] = { t: "p", c: "b" };
      board[6][c] = { t: "p", c: "w" };
      board[7][c] = { t: back[c], c: "w" };
    }
    return board;
  }

  function newGame() {
    return {
      board: startBoard(),
      turn: "w",
      // Castling rights.
      castling: { wK: true, wQ: true, bK: true, bQ: true },
      ep: null, // en-passant target square [r,c] or null
      halfmove: 0, // for 50-move rule
      fullmove: 1,
      lastMove: null, // {from:[r,c], to:[r,c]}
    };
  }

  // ---- Helpers -----------------------------------------------------------
  const inside = (r, c) => r >= 0 && r < 8 && c >= 0 && c < 8;
  const opp = (color) => (color === "w" ? "b" : "w");

  function cloneState(s) {
    return {
      board: s.board.map((row) => row.map((p) => (p ? { t: p.t, c: p.c } : null))),
      turn: s.turn,
      castling: { ...s.castling },
      ep: s.ep ? [s.ep[0], s.ep[1]] : null,
      halfmove: s.halfmove,
      fullmove: s.fullmove,
      lastMove: s.lastMove
        ? { from: [...s.lastMove.from], to: [...s.lastMove.to] }
        : null,
    };
  }

  function findKing(board, color) {
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.t === "k" && p.c === color) return [r, c];
      }
    return null;
  }

  // Is square (r,c) attacked by any piece of `byColor`?
  function isAttacked(board, r, c, byColor) {
    // Pawns.
    const dir = byColor === "w" ? -1 : 1; // white pawns move up (toward r-1)
    for (const dc of [-1, 1]) {
      const pr = r + dir, pc = c + dc;
      if (inside(pr, pc)) {
        const p = board[pr][pc];
        if (p && p.c === byColor && p.t === "p") return true;
      }
    }
    // Knights.
    const kn = [
      [-2, -1], [-2, 1], [-1, -2], [-1, 2],
      [1, -2], [1, 2], [2, -1], [2, 1],
    ];
    for (const [dr, dc] of kn) {
      const pr = r + dr, pc = c + dc;
      if (inside(pr, pc)) {
        const p = board[pr][pc];
        if (p && p.c === byColor && p.t === "n") return true;
      }
    }
    // King (adjacent).
    for (let dr = -1; dr <= 1; dr++)
      for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const pr = r + dr, pc = c + dc;
        if (inside(pr, pc)) {
          const p = board[pr][pc];
          if (p && p.c === byColor && p.t === "k") return true;
        }
      }
    // Sliding: bishops/queens (diagonals), rooks/queens (orthogonals).
    const diag = [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    const orth = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    for (const [dr, dc] of diag) {
      let pr = r + dr, pc = c + dc;
      while (inside(pr, pc)) {
        const p = board[pr][pc];
        if (p) {
          if (p.c === byColor && (p.t === "b" || p.t === "q")) return true;
          break;
        }
        pr += dr; pc += dc;
      }
    }
    for (const [dr, dc] of orth) {
      let pr = r + dr, pc = c + dc;
      while (inside(pr, pc)) {
        const p = board[pr][pc];
        if (p) {
          if (p.c === byColor && (p.t === "r" || p.t === "q")) return true;
          break;
        }
        pr += dr; pc += dc;
      }
    }
    return false;
  }

  function inCheck(state, color) {
    const k = findKing(state.board, color);
    if (!k) return false;
    return isAttacked(state.board, k[0], k[1], opp(color));
  }

  // ---- Pseudo-legal move generation -------------------------------------
  function addSlide(board, r, c, color, dirs, out) {
    for (const [dr, dc] of dirs) {
      let pr = r + dr, pc = c + dc;
      while (inside(pr, pc)) {
        const p = board[pr][pc];
        if (!p) out.push(mv(r, c, pr, pc));
        else {
          if (p.c !== color) out.push(mv(r, c, pr, pc, { capture: true }));
          break;
        }
        pr += dr; pc += dc;
      }
    }
  }

  function mv(fr, fc, tr, tc, extra) {
    return Object.assign({ from: [fr, fc], to: [tr, tc] }, extra || {});
  }

  // Pseudo-legal moves for the piece on (r,c). Does not test self-check.
  function pieceMoves(state, r, c) {
    const board = state.board;
    const p = board[r][c];
    const out = [];
    if (!p) return out;
    const color = p.c;
    switch (p.t) {
      case "p": {
        const dir = color === "w" ? -1 : 1;
        const startRow = color === "w" ? 6 : 1;
        const promoRow = color === "w" ? 0 : 7;
        // Forward one.
        if (inside(r + dir, c) && !board[r + dir][c]) {
          pushPawn(out, r, c, r + dir, c, promoRow);
          // Forward two.
          if (r === startRow && !board[r + 2 * dir][c]) {
            out.push(mv(r, c, r + 2 * dir, c, { double: true }));
          }
        }
        // Captures + en passant.
        for (const dc of [-1, 1]) {
          const tr = r + dir, tc = c + dc;
          if (!inside(tr, tc)) continue;
          const target = board[tr][tc];
          if (target && target.c !== color) {
            pushPawn(out, r, c, tr, tc, promoRow, true);
          } else if (state.ep && state.ep[0] === tr && state.ep[1] === tc) {
            out.push(mv(r, c, tr, tc, { capture: true, enpassant: true }));
          }
        }
        break;
      }
      case "n": {
        const kn = [
          [-2, -1], [-2, 1], [-1, -2], [-1, 2],
          [1, -2], [1, 2], [2, -1], [2, 1],
        ];
        for (const [dr, dc] of kn) {
          const tr = r + dr, tc = c + dc;
          if (!inside(tr, tc)) continue;
          const t = board[tr][tc];
          if (!t) out.push(mv(r, c, tr, tc));
          else if (t.c !== color) out.push(mv(r, c, tr, tc, { capture: true }));
        }
        break;
      }
      case "b":
        addSlide(board, r, c, color, [[-1, -1], [-1, 1], [1, -1], [1, 1]], out);
        break;
      case "r":
        addSlide(board, r, c, color, [[-1, 0], [1, 0], [0, -1], [0, 1]], out);
        break;
      case "q":
        addSlide(
          board, r, c, color,
          [[-1, -1], [-1, 1], [1, -1], [1, 1], [-1, 0], [1, 0], [0, -1], [0, 1]],
          out
        );
        break;
      case "k": {
        for (let dr = -1; dr <= 1; dr++)
          for (let dc = -1; dc <= 1; dc++) {
            if (!dr && !dc) continue;
            const tr = r + dr, tc = c + dc;
            if (!inside(tr, tc)) continue;
            const t = board[tr][tc];
            if (!t) out.push(mv(r, c, tr, tc));
            else if (t.c !== color) out.push(mv(r, c, tr, tc, { capture: true }));
          }
        addCastling(state, r, c, color, out);
        break;
      }
    }
    return out;
  }

  function pushPawn(out, fr, fc, tr, tc, promoRow, capture) {
    if (tr === promoRow) {
      for (const promo of ["q", "r", "b", "n"]) {
        out.push(mv(fr, fc, tr, tc, { capture: !!capture, promotion: promo }));
      }
    } else {
      out.push(mv(fr, fc, tr, tc, { capture: !!capture }));
    }
  }

  function addCastling(state, r, c, color, out) {
    const board = state.board;
    const row = color === "w" ? 7 : 0;
    if (r !== row || c !== 4) return;
    if (inCheck(state, color)) return;
    const rights = state.castling;
    const enemy = opp(color);
    // King-side.
    const kSide = color === "w" ? rights.wK : rights.bK;
    if (kSide && !board[row][5] && !board[row][6] &&
        board[row][7] && board[row][7].t === "r" && board[row][7].c === color &&
        !isAttacked(board, row, 5, enemy) && !isAttacked(board, row, 6, enemy)) {
      out.push(mv(row, 4, row, 6, { castle: "K" }));
    }
    // Queen-side.
    const qSide = color === "w" ? rights.wQ : rights.bQ;
    if (qSide && !board[row][3] && !board[row][2] && !board[row][1] &&
        board[row][0] && board[row][0].t === "r" && board[row][0].c === color &&
        !isAttacked(board, row, 3, enemy) && !isAttacked(board, row, 2, enemy)) {
      out.push(mv(row, 4, row, 2, { castle: "Q" }));
    }
  }

  // ---- Apply a move (returns a NEW state) -------------------------------
  function applyMove(state, move) {
    const s = cloneState(state);
    const board = s.board;
    const [fr, fc] = move.from;
    const [tr, tc] = move.to;
    const piece = board[fr][fc];
    const color = piece.c;

    s.ep = null;
    const isPawn = piece.t === "p";
    const isCapture = !!board[tr][tc] || move.enpassant;

    // En-passant capture removes the pawn behind the target square.
    if (move.enpassant) {
      const dir = color === "w" ? -1 : 1;
      board[tr - dir][tc] = null;
    }

    // Move the piece.
    board[tr][tc] = piece;
    board[fr][fc] = null;

    // Promotion.
    if (move.promotion) board[tr][tc] = { t: move.promotion, c: color };

    // Double pawn push sets the en-passant target.
    if (move.double) {
      const dir = color === "w" ? -1 : 1;
      s.ep = [fr + dir, fc];
    }

    // Castling: move the rook too.
    if (move.castle === "K") {
      board[tr][5] = board[tr][7];
      board[tr][7] = null;
    } else if (move.castle === "Q") {
      board[tr][3] = board[tr][0];
      board[tr][0] = null;
    }

    // Update castling rights.
    if (piece.t === "k") {
      if (color === "w") { s.castling.wK = false; s.castling.wQ = false; }
      else { s.castling.bK = false; s.castling.bQ = false; }
    }
    // Rook moved from or captured on a corner.
    const touch = (r, c) => {
      if (r === 7 && c === 0) s.castling.wQ = false;
      if (r === 7 && c === 7) s.castling.wK = false;
      if (r === 0 && c === 0) s.castling.bQ = false;
      if (r === 0 && c === 7) s.castling.bK = false;
    };
    touch(fr, fc);
    touch(tr, tc);

    s.halfmove = isPawn || isCapture ? 0 : s.halfmove + 1;
    if (color === "b") s.fullmove += 1;
    s.turn = opp(color);
    s.lastMove = { from: [fr, fc], to: [tr, tc] };
    return s;
  }

  // ---- Legal moves (filter out self-check) ------------------------------
  function legalMoves(state, fromSquare) {
    const color = state.turn;
    const all = [];
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const p = state.board[r][c];
        if (!p || p.c !== color) continue;
        if (fromSquare && (r !== fromSquare[0] || c !== fromSquare[1])) continue;
        for (const m of pieceMoves(state, r, c)) {
          const next = applyMove(state, m);
          if (!inCheck(next, color)) all.push(m);
        }
      }
    return all;
  }

  // ---- Game status ------------------------------------------------------
  function status(state) {
    const moves = legalMoves(state);
    const check = inCheck(state, state.turn);
    if (moves.length === 0) {
      return check ? "checkmate" : "stalemate";
    }
    if (state.halfmove >= 100) return "draw50";
    if (insufficientMaterial(state.board)) return "insufficient";
    return check ? "check" : "ongoing";
  }

  function insufficientMaterial(board) {
    const pieces = [];
    for (let r = 0; r < 8; r++)
      for (let c = 0; c < 8; c++) {
        const p = board[r][c];
        if (p && p.t !== "k") pieces.push(p.t);
      }
    if (pieces.length === 0) return true; // K vs K
    if (pieces.length === 1 && (pieces[0] === "b" || pieces[0] === "n")) return true;
    return false;
  }

  function algebraic(square) {
    return "abcdefgh"[square[1]] + (8 - square[0]);
  }

  window.Chess = {
    VALUES,
    newGame,
    cloneState,
    legalMoves,
    applyMove,
    inCheck,
    status,
    findKing,
    isAttacked,
    algebraic,
    opp,
  };
})();
