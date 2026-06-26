global.window = {};
require('../js/engine.js');
const C = global.window.Chess;

// algebraic "e4" -> [r,c]  (r0=rank8 top, r7=rank1 bottom)
const sq = a => [8 - (+a[1]), a.charCodeAt(0) - 97];
const alg = ([r, c]) => "abcdefgh"[c] + (8 - r);

function emptyState(opts = {}) {
  const board = Array.from({ length: 8 }, () => Array(8).fill(null));
  return {
    board, turn: opts.turn || 'w',
    castling: Object.assign({ wK: false, wQ: false, bK: false, bQ: false }, opts.castling || {}),
    ep: opts.ep ? sq(opts.ep) : null, halfmove: 0, fullmove: 1, lastMove: null,
  };
}
function place(s, map) { for (const k in map) { const [r, c] = sq(k); s.board[r][c] = map[k]; } return s; }
const W = t => ({ t, c: 'w' }), B = t => ({ t, c: 'b' });

let pass = 0, fail = 0;
function eq(name, got, want) {
  const g = [...got].sort().join(','), w = [...want].sort().join(',');
  if (g === w) { pass++; }
  else { fail++; console.log(`FAIL ${name}\n   got:  ${g}\n   want: ${w}`); }
}
function destsOf(s, from) { return C.legalMoves(s, sq(from)).map(m => alg(m.to)); }
function check(name, cond) { if (cond) pass++; else { fail++; console.log(`FAIL ${name}`); } }

// --- Knight ---
{
  const s = place(emptyState(), { e1: W('k'), e8: B('k'), e4: W('n') });
  eq('knight centre e4', destsOf(s, 'e4'), ['c3','c5','d2','d6','f2','f6','g3','g5']);
}
{
  const s = place(emptyState(), { e1: W('k'), e8: B('k'), a1: W('n') });
  eq('knight corner a1', destsOf(s, 'a1'), ['b3','c2']);
}
{ // blocked by own piece, can capture enemy
  const s = place(emptyState(), { h1: W('k'), h8: B('k'), e4: W('n'), f6: W('p'), d6: B('p') });
  eq('knight blocked/capture', destsOf(s, 'e4'), ['c3','c5','d2','d6','f2','g3','g5']);
}

// --- Bishop ---
{
  const s = place(emptyState(), { e1: W('k'), a8: B('k'), d4: W('b') });
  eq('bishop d4 open', destsOf(s, 'd4'),
    ['e5','f6','g7','h8','c5','b6','a7','e3','f2','g1','c3','b2','a1']);
}
{ // own piece blocks one ray, enemy is capturable and stops ray
  const s = place(emptyState(), { e1: W('k'), a8: B('k'), d4: W('b'), f6: W('p'), b2: B('p') });
  eq('bishop d4 blocked', destsOf(s, 'd4'),
    ['e5','c5','b6','a7','e3','f2','g1','c3','b2']);
}

// --- Rook ---
{
  const s = place(emptyState(), { e1: W('k'), a8: B('k'), d4: W('r') });
  eq('rook d4 open', destsOf(s, 'd4'),
    ['d5','d6','d7','d8','d3','d2','d1','c4','b4','a4','e4','f4','g4','h4']);
}

// --- Queen ---
{
  const s = place(emptyState(), { e1: W('k'), a8: B('k'), d4: W('q') });
  check('queen d4 = 27 moves', destsOf(s, 'd4').length === 27);
}

// --- King steps ---
{
  const s = place(emptyState(), { e4: W('k'), a8: B('k') });
  eq('king e4 steps', destsOf(s, 'e4'), ['d3','d4','d5','e3','e5','f3','f4','f5']);
}
{ // king cannot step into check from an enemy rook
  const s = place(emptyState(), { e4: W('k'), a8: B('k'), e8: B('r') });
  check('king avoids e-file (rook)', !destsOf(s, 'e4').includes('e5') && !destsOf(s, 'e4').includes('e3'));
}

// --- Castling ---
{
  const s = place(emptyState({ castling: { wK: true, wQ: true } }),
    { e1: W('k'), a1: W('r'), h1: W('r'), e8: B('k') });
  const d = destsOf(s, 'e1');
  check('castle both sides offered', d.includes('g1') && d.includes('c1'));
}
{ // blocked: knight on g1 stops king-side; rook attack on d1 stops queen-side path
  const s = place(emptyState({ castling: { wK: true, wQ: true } }),
    { e1: W('k'), a1: W('r'), h1: W('r'), g1: W('n'), d8: B('r'), e8: B('k') });
  const d = destsOf(s, 'e1');
  check('castle king-side blocked by piece', !d.includes('g1'));
  check('castle queen-side blocked thru check', !d.includes('c1'));
}
{ // cannot castle out of check
  const s = place(emptyState({ castling: { wK: true } }),
    { e1: W('k'), h1: W('r'), e8: B('r') });
  check('no castling while in check', !destsOf(s, 'e1').includes('g1'));
}

// --- Pawns ---
{
  const s = place(emptyState(), { e1: W('k'), e8: B('k'), e2: W('p') });
  eq('pawn e2 single+double', destsOf(s, 'e2'), ['e3','e4']);
}
{
  const s = place(emptyState(), { e1: W('k'), e8: B('k'), e2: W('p'), e3: B('p') });
  eq('pawn blocked forward', destsOf(s, 'e2'), []);
}
{
  const s = place(emptyState(), { e1: W('k'), e8: B('k'), e4: W('p'), d5: B('p'), f5: B('p') });
  eq('pawn captures + push', destsOf(s, 'e4'), ['e5','d5','f5']);
}
{ // en passant
  const s = place(emptyState({ ep: 'd6' }), { e1: W('k'), e8: B('k'), e5: W('p'), d5: B('p') });
  const ms = C.legalMoves(s, sq('e5'));
  eq('pawn en-passant dests', ms.map(m => alg(m.to)), ['e6','d6']);
  check('en-passant flagged', ms.find(m => alg(m.to) === 'd6').enpassant === true);
}
{ // promotion -> four pieces
  const s = place(emptyState(), { e1: W('k'), a8: B('k'), e7: W('p') });
  const ms = C.legalMoves(s, sq('e7')).filter(m => alg(m.to) === 'e8');
  eq('promotion options', ms.map(m => m.promotion), ['q','r','b','n']);
}
{ // black pawn moves downward (direction)
  const s = place(emptyState({ turn: 'b' }), { e1: W('k'), e8: B('k'), e7: B('p') });
  eq('black pawn e7 single+double', destsOf(s, 'e7'), ['e6','e5']);
}

// --- Pin ---
{
  const s = place(emptyState(), { e1: W('k'), e2: W('b'), e8: B('r') });
  check('pinned bishop has no legal moves', destsOf(s, 'e2').length === 0);
}

// --- Checkmate (Fool's mate) ---
{
  let s = C.newGame();
  const move = (f, t) => {
    const m = C.legalMoves(s).find(x => alg(x.from) === f && alg(x.to) === t && !x.promotion);
    if (!m) throw new Error('illegal in test: ' + f + t);
    s = C.applyMove(s, m);
  };
  move('f2','f3'); move('e7','e5'); move('g2','g4'); move('d8','h4');
  check("fool's mate is checkmate", C.status(s) === 'checkmate');
}

// --- Stalemate ---
{
  const s = place(emptyState({ turn: 'b' }), { h8: B('k'), f7: W('q'), h6: W('k') });
  check('stalemate detected', C.status(s) === 'stalemate');
}

// --- Turn alternation + capture removes piece ---
{
  let s = C.newGame();
  check('white moves first', s.turn === 'w');
  const m = C.legalMoves(s).find(x => alg(x.from) === 'e2' && alg(x.to) === 'e4');
  s = C.applyMove(s, m);
  check('turn passes to black', s.turn === 'b');
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
