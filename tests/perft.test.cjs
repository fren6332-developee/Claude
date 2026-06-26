/*
 * Perft: count the number of legal move sequences from the start position to a
 * given depth and compare against the well-known reference values. Matching
 * these exactly is a strong guarantee that move generation — including
 * castling, en passant and promotion — behaves like standard chess.
 *
 * Run:  node tests/perft.test.cjs
 */
global.window = {};
require("../js/engine.js");
const C = global.window.Chess;

function perft(state, depth) {
  if (depth === 0) return 1;
  const moves = C.legalMoves(state);
  if (depth === 1) return moves.length;
  let n = 0;
  for (const m of moves) n += perft(C.applyMove(state, m), depth - 1);
  return n;
}

const EXPECTED = { 1: 20, 2: 400, 3: 8902, 4: 197281 };
let fail = 0;
for (const d of [1, 2, 3, 4]) {
  const got = perft(C.newGame(), d);
  const ok = got === EXPECTED[d];
  if (!ok) fail++;
  console.log(`${ok ? "ok  " : "FAIL"} perft(${d}) = ${got} (expected ${EXPECTED[d]})`);
}
console.log(fail ? `\n${fail} failed` : "\nall perft counts match");
process.exit(fail ? 1 : 0);
