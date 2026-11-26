import { useState, type ReactNode } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";
import { toneColor } from "./Shape2D";
import { ReadAloud } from "../../../shared/tts/ReadAloud";

const ptsAttr = (pts: [number, number][]) => pts.map((p) => p.join(",")).join(" ");

/** A piece's turn, in quarter turns: 0, 90, 180 or 270 degrees. */
export type Turn = 0 | 90 | 180 | 270;
const nextTurn = (t: Turn): Turn => (((t + 90) % 360) as Turn);

/** One spot in the big shape. Triangle spots are right triangles in a box
 *  (x0, y0)-(x1, y1); `turn` is the piece turn that fits (0 = the square
 *  corner at the top left, 180 = at the bottom right). */
export interface Slot {
  box: [number, number, number, number];
  turn: Turn;
}

export interface ComposeRecipe {
  id: string;
  /** The big shape the pieces make. */
  resultLabel: "Square" | "Rectangle";
  pieceKind: "triangle" | "square";
  /** Plural, as said: "triangles" / "squares". */
  pieceWord: string;
  /** The big shape's outline (dashed until full). */
  outline: [number, number][];
  slots: Slot[];
}

/** The polygon a right-triangle piece covers in box b, turned by t. */
function trianglePts([x0, y0, x1, y1]: Slot["box"], t: Turn): [number, number][] {
  if (t === 0) return [[x0, y0], [x1, y0], [x0, y1]];
  if (t === 90) return [[x0, y0], [x1, y0], [x1, y1]];
  if (t === 180) return [[x1, y0], [x1, y1], [x0, y1]];
  return [[x0, y0], [x1, y1], [x0, y1]];
}
const slotPts = (r: ComposeRecipe, s: Slot): [number, number][] => {
  const [x0, y0, x1, y1] = s.box;
  return r.pieceKind === "triangle" ? trianglePts(s.box, s.turn) : [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
};

const rect = (x0: number, y0: number, x1: number, y1: number): [number, number][] => [
  [x0, y0],
  [x1, y0],
  [x1, y1],
  [x0, y1],
];
const tri = (box: Slot["box"]): Slot[] => [
  { box, turn: 0 },
  { box, turn: 180 },
];
const squaresRow = (x0: number, y0: number, s: number, cols: number, rows: number): Slot[] =>
  Array.from({ length: cols * rows }, (_, i) => {
    const x = x0 + (i % cols) * s;
    const y = y0 + Math.floor(i / cols) * s;
    return { box: [x, y, x + s, y + s] as Slot["box"], turn: 0 as Turn };
  });

export const COMPOSE_RECIPES: ComposeRecipe[] = [
  { id: "trianglesToSquare", resultLabel: "Square", pieceKind: "triangle", pieceWord: "triangles", outline: rect(45, 45, 155, 155), slots: tri([45, 45, 155, 155]) },
  { id: "trianglesToRectangle", resultLabel: "Rectangle", pieceKind: "triangle", pieceWord: "triangles", outline: rect(22, 62, 178, 138), slots: tri([22, 62, 178, 138]) },
  { id: "squares2ToRectangle", resultLabel: "Rectangle", pieceKind: "square", pieceWord: "squares", outline: rect(30, 65, 170, 135), slots: squaresRow(30, 65, 70, 2, 1) },
  { id: "squares3ToRectangle", resultLabel: "Rectangle", pieceKind: "square", pieceWord: "squares", outline: rect(22, 74, 178, 126), slots: squaresRow(22, 74, 52, 3, 1) },
  { id: "squares4ToSquare", resultLabel: "Square", pieceKind: "square", pieceWord: "squares", outline: rect(45, 45, 155, 155), slots: squaresRow(45, 45, 55, 2, 2) },
];
export const recipeById = (id: string) => COMPOSE_RECIPES.find((r) => r.id === id)!;

const svgStyle = (max: number) => ({ display: "block", width: "100%", maxWidth: max, height: "auto", fontFamily: diagramFont, touchAction: "manipulation" as const });

/**
 * A static picture of a recipe: the big outline, with the first `filled`
 * spots filled by pieces. `showSpots` draws the empty spots as dashed lines.
 * `blinkOutline` (help) blinks the big shape's outline.
 */
export function ComposePicture({ recipe, filled, tone = "a", showSpots = false, blinkOutline = false, numbered = false }: { recipe: ComposeRecipe; filled: number; tone?: "a" | "b" | "c"; showSpots?: boolean; blinkOutline?: boolean; numbered?: boolean }) {
  const color = toneColor(tone);
  const full = filled >= recipe.slots.length;
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="pieces in a big shape" style={svgStyle(240)}>
      {blinkOutline && <style>{"@keyframes mk4-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.15; } }"}</style>}
      {showSpots && recipe.slots.map((s, i) => i >= filled && <polygon key={`e${i}`} points={ptsAttr(slotPts(recipe, s))} fill="none" stroke={palette.line} strokeWidth={2} strokeDasharray="5 5" />)}
      {recipe.slots.map((s, i) => i < filled && <polygon key={`f${i}`} points={ptsAttr(slotPts(recipe, s))} fill={color} stroke={palette.ink} strokeWidth={2.5} strokeLinejoin="round" />)}
      <polygon points={ptsAttr(recipe.outline)} fill="none" stroke={blinkOutline ? palette.c : full ? palette.ink : palette.line} strokeWidth={blinkOutline ? 6 : 3} strokeDasharray={full || blinkOutline ? undefined : "6 6"} style={blinkOutline ? { animation: "mk4-blink 1s ease-in-out 3" } : undefined} />
      {numbered &&
        recipe.slots.map((s, i) => {
          const p = slotPts(recipe, s);
          const x = p.reduce((a, q) => a + q[0], 0) / p.length;
          const y = p.reduce((a, q) => a + q[1], 0) / p.length;
          return (
            <text key={`n${i}`} x={x} y={y + 8} textAnchor="middle" fontSize={24} fontWeight={800} fill={palette.paper} stroke={palette.ink} strokeWidth={1}>
              {i + 1}
            </text>
          );
        })}
    </svg>
  );
}

/** A small picture of one piece, for the tray buttons. */
function PieceIcon({ kind, turn, box, tone }: { kind: "triangle" | "square"; turn: Turn; box: Slot["box"]; tone: "a" | "b" | "c" }) {
  const [x0, y0, x1, y1] = box;
  const w = x1 - x0;
  const h = y1 - y0;
  // A turned right triangle's box swaps width and height at 90 and 270.
  const side = turn === 90 || turn === 270;
  const bw = side ? h : w;
  const bh = side ? w : h;
  const k = 64 / Math.max(bw, bh);
  const pw = bw * k;
  const ph = bh * k;
  const ox = (72 - pw) / 2;
  const oy = (72 - ph) / 2;
  let pts: [number, number][];
  if (kind === "square") pts = rect(ox, oy, ox + pw, oy + ph);
  else {
    // Draw the triangle in its own (turned) box.
    const b: Slot["box"] = [ox, oy, ox + pw, oy + ph];
    pts = trianglePts(b, turn);
  }
  return (
    <svg viewBox="0 0 72 72" width={72} height={72} aria-hidden style={{ display: "block" }}>
      <polygon points={ptsAttr(pts)} fill={toneColor(tone)} stroke={palette.ink} strokeWidth={2} strokeLinejoin="round" />
    </svg>
  );
}

interface TrayPiece {
  id: number;
  kind: "triangle" | "square";
  turn: Turn;
  /** The box the piece is drawn in (for size). */
  box: Slot["box"];
}

/** The pieces for a recipe: the right pieces (triangles start turned so at
 *  least one needs a Turn) plus one piece that doesn't fit. */
export function trayFor(recipe: ComposeRecipe, rand: () => number = Math.random): TrayPiece[] {
  const box = recipe.slots[0].box;
  const turns: Turn[] = [0, 90, 180, 270];
  const pieces: TrayPiece[] = recipe.slots.map((s, i) => ({
    id: i,
    kind: recipe.pieceKind,
    turn: recipe.pieceKind === "triangle" ? (i === 0 ? ([90, 270] as Turn[])[Math.floor(rand() * 2)] : turns[Math.floor(rand() * 4)]) : 0,
    box: s.box,
  }));
  // The piece that doesn't fit: a square among triangles, a triangle among squares.
  const odd: TrayPiece =
    recipe.pieceKind === "triangle"
      ? { id: 99, kind: "square", turn: 0, box: [0, 0, Math.min(box[2] - box[0], box[3] - box[1]) * 0.7, Math.min(box[2] - box[0], box[3] - box[1]) * 0.7] }
      : { id: 99, kind: "triangle", turn: turns[Math.floor(rand() * 4)], box };
  const all = [...pieces, odd];
  // Shuffle so the odd piece isn't always last.
  for (let i = all.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [all[i], all[j]] = [all[j], all[i]];
  }
  return all;
}

const fits = (recipe: ComposeRecipe, slot: Slot, p: TrayPiece) => p.kind === recipe.pieceKind && (p.kind === "square" || p.turn === slot.turn);

/**
 * Put the pieces in (Unit 4 Practice step and Explore). The student picks a
 * piece, can turn it with "Turn", and taps a spot in the big shape. A piece
 * that doesn't fit there (the odd piece, or a triangle turned the wrong
 * way) is a wrong try (`onWrong`, with its reason, so the step shows one
 * line, not two: review C2-12). When every spot is full, `onDone`. With no
 * `onWrong` (Explore) the builder says the reason itself. `onEdit` is called
 * on every piece, Turn, spot or Start over tap, so the step can clear its old
 * wrong-try line while the child keeps working (review C3-02).
 */
export function ComposeBuilder({ recipe, onDone, onWrong, onEdit, tone = "a", doneText = "They fit!" }: { recipe: ComposeRecipe; onDone?: () => void; onWrong?: (reason: string) => void; onEdit?: () => void; tone?: "a" | "b" | "c"; doneText?: string }) {
  const [tray, setTray] = useState<TrayPiece[]>(() => trayFor(recipe));
  const [selected, setSelected] = useState<number | null>(() => null);
  const [placed, setPlaced] = useState<(TrayPiece | null)[]>(() => recipe.slots.map(() => null));
  const [said, setSaid] = useState<{ text: string; good: boolean; n: number } | null>(null);
  const sel = tray.find((p) => p.id === selected) ?? null;
  const full = placed.every(Boolean);
  const say = (text: string, good: boolean) => setSaid((s) => ({ text, good, n: (s?.n ?? 0) + 1 }));

  const turnIt = () => {
    onEdit?.();
    if (!sel) return say("Tap a piece first.", false);
    setTray((t) => t.map((p) => (p.id === sel.id ? { ...p, turn: nextTurn(p.turn) } : p)));
    setSaid(null);
  };
  const tapSlot = (i: number) => {
    if (full || placed[i]) return;
    // Cleared first; a piece that doesn't fit gives its own new line below.
    onEdit?.();
    if (!sel) return say("Tap a piece first.", false);
    if (!fits(recipe, recipe.slots[i], sel)) {
      const reason = sel.kind !== recipe.pieceKind ? "That piece does not fit." : "It does not fit. Tap Turn.";
      if (onWrong) {
        setSaid(null);
        onWrong(reason);
      } else say(reason, false);
      return;
    }
    const next = placed.map((p, k) => (k === i ? sel : p));
    setPlaced(next);
    setTray((t) => t.filter((p) => p.id !== sel.id));
    setSelected(null);
    if (next.every(Boolean)) {
      say(doneText, true);
      onDone?.();
    } else setSaid(null);
  };
  const reset = () => {
    if (!full) onEdit?.();
    setTray(trayFor(recipe));
    setPlaced(recipe.slots.map(() => null));
    setSelected(null);
    setSaid(null);
  };
  const color = toneColor(tone);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <svg viewBox="0 0 200 200" role="img" aria-label="a big shape with spots to fill" style={svgStyle(260)}>
        {recipe.slots.map((s, i) => {
          const p = placed[i];
          return (
            <polygon
              key={i}
              points={ptsAttr(slotPts(recipe, s))}
              fill={p ? color : "transparent"}
              stroke={p ? palette.ink : palette.muted}
              strokeWidth={p ? 2.5 : 2}
              strokeDasharray={p ? undefined : "6 5"}
              strokeLinejoin="round"
              style={{ cursor: p || full ? undefined : "pointer" }}
              onClick={() => tapSlot(i)}
            />
          );
        })}
        <polygon points={ptsAttr(recipe.outline)} fill="none" stroke={full ? palette.ink : palette.muted} strokeWidth={3} pointerEvents="none" />
      </svg>
      {!full && (
        <div className="control-row" data-readaloud-part style={{ alignItems: "center", gap: 8 }}>
          {tray.map((p) => (
            <button
              key={p.id}
              type="button"
              className="choice choice-pic"
              aria-label="a piece"
              aria-pressed={selected === p.id}
              data-tts-say="a piece"
              style={{ padding: 4, ...(selected === p.id ? { borderColor: "var(--qc)", background: "var(--qc-soft)" } : {}) }}
              onClick={() => {
                setSelected(p.id);
                setSaid(null);
                onEdit?.();
              }}
            >
              <PieceIcon kind={p.kind} turn={p.turn} box={p.box} tone={tone} />
            </button>
          ))}
          <button type="button" className="btn ghost" onClick={turnIt}>
            Turn
          </button>
        </div>
      )}
      <div className="control-row" data-readaloud-part>
        <button type="button" className="btn ghost" onClick={reset}>
          Start over
        </button>
      </div>
      {said && (
        <ReadAloud as="p" className={`feedback ${said.good ? "good" : "bad"}`} role="alert" autoPlayKey={`${said.text}|${said.n}`}>
          {said.text}
        </ReadAloud>
      )}
    </div>
  );
}

/**
 * Two pieces that touch (one big shape) or have a gap between them (not
 * one shape) — Unit 4 "Do these make one shape?" (review C1-31, E1-30).
 * `ringGap` (help) circles the place where they meet or don't.
 */
export function GapPicture({ pieces, gap, tone = "a", ringGap = false }: { pieces: "triangles" | "squares"; gap: boolean; tone?: "a" | "b" | "c"; ringGap?: boolean }) {
  const color = toneColor(tone);
  const g = gap ? 22 : 0;
  let a: [number, number][];
  let b: [number, number][];
  let ring: [number, number];
  if (pieces === "triangles") {
    a = [[40 - g / 2, 45], [150 - g / 2, 45], [40 - g / 2, 155]];
    b = [[150 + g / 2, 45], [150 + g / 2, 155], [40 + g / 2, 155]];
    ring = [100, 100];
  } else {
    a = rect(30 - g / 2, 65, 100 - g / 2, 135);
    b = rect(100 + g / 2, 65, 170 + g / 2, 135);
    ring = [100, 100];
  }
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label="two pieces" style={svgStyle(220)}>
      <polygon points={ptsAttr(a)} fill={color} stroke={palette.ink} strokeWidth={2.5} strokeLinejoin="round" />
      <polygon points={ptsAttr(b)} fill={color} stroke={palette.ink} strokeWidth={2.5} strokeLinejoin="round" />
      {ringGap && <circle cx={ring[0]} cy={ring[1]} r={26} fill="none" stroke={palette.c} strokeWidth={4} strokeDasharray="7 5" />}
    </svg>
  );
}

/** How a strip is filled: 1 = one square, 2 = a 2-square piece. */
export type StripFill = number[];

/**
 * A strip `length` squares long, with faint marks where each square goes,
 * filled left to right with 1-square and 2-square pieces (a 2-square piece
 * is one piece, with a faint line down its middle). Each square space is a
 * true square (review C2-02: they were 30 by 48). All pieces are the same
 * color, so color never tells the answer.
 */
export function ComposeOpenStrip({ targetLength, placedLengths, tone = "a", gapAt, numbered = false, ringGap = false }: { targetLength: number; placedLengths: StripFill; tone?: "a" | "b" | "c"; /** Leave one empty square after this many squares (the "not full" picture). */ gapAt?: number; /** Number the pieces 1, 2, 3… ("Show me"). */ numbered?: boolean; /** Help: ring the empty square left by `gapAt`. */ ringGap?: boolean }) {
  const unit = 36;
  const total = targetLength * unit;
  const color = toneColor(tone);
  const x0 = 10;
  const y0 = 10;
  let x = x0;
  const pieces: ReactNode[] = [];
  placedLengths.forEach((len, i) => {
    if (gapAt !== undefined && Math.round((x - x0) / unit) === gapAt) x += unit;
    const w = len * unit - 3;
    pieces.push(
      <g key={i}>
        <rect x={x + 1.5} y={y0 + 1.5} width={w} height={unit - 3} rx={4} fill={color} stroke={palette.ink} strokeWidth={2} />
        {len === 2 && <line x1={x + unit} y1={y0 + 5} x2={x + unit} y2={y0 + unit - 5} stroke={palette.ink} strokeWidth={1.5} strokeDasharray="3 3" opacity={0.6} />}
        {numbered && (
          <text x={x + (len * unit) / 2} y={y0 + unit / 2 + 6} textAnchor="middle" fontSize={18} fontWeight={800} fill={palette.paper} stroke={palette.ink} strokeWidth={0.8}>
            {i + 1}
          </text>
        )}
      </g>
    );
    x += len * unit;
  });
  return (
    <svg viewBox={`0 0 ${total + 20} ${unit + 2 * y0}`} role="img" aria-label="a strip to fill" style={{ display: "block", width: "100%", maxWidth: Math.min(340, total + 20 + 40), height: "auto", fontFamily: diagramFont }}>
      <rect x={x0} y={y0} width={total} height={unit} fill="none" stroke={palette.muted} strokeWidth={2.5} strokeDasharray="6 5" />
      {Array.from({ length: targetLength - 1 }, (_, i) => (
        <line key={i} x1={x0 + (i + 1) * unit} y1={y0} x2={x0 + (i + 1) * unit} y2={y0 + unit} stroke={palette.line} strokeWidth={1.5} />
      ))}
      {pieces}
      {ringGap && gapAt !== undefined && <rect x={x0 + gapAt * unit - 3} y={y0 - 3} width={unit + 6} height={unit + 6} rx={6} fill="none" stroke={palette.c} strokeWidth={4} strokeDasharray="6 4" />}
    </svg>
  );
}

/** Two different ways to fill a strip (for the "more than one way" pictures). */
export function twoFills(length: number): [StripFill, StripFill] {
  const ones = Array.from({ length }, () => 1);
  const twos = [...Array.from({ length: Math.floor(length / 2) }, () => 2), ...(length % 2 ? [1] : [])];
  return [ones, twos];
}

/** How many 2-square pieces a fill uses (two fills with the same count are the same mix). */
export const twosIn = (fill: StripFill) => fill.filter((p) => p === 2).length;
