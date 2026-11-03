import type { CSSProperties, ReactNode } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";
import type { Tone } from "./TenFrame";
import { numberPadProps, useEarlyLearner } from "../../../shared/engine/audience";

const toneColor = (tone?: Tone) => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);
const toneSoft = (tone?: Tone) => (tone === "b" ? palette.bSoft : tone === "c" ? palette.cSoft : palette.aSoft);

const W = 340;
const WHOLE = { cx: W / 2, cy: 74, r: 66 };
const PART_R = 52;
const PART_CY = 236;
const PART_CX = [82, W - 82];
const H = PART_CY + PART_R + 6;

const DOT_R = 4.6;
const DOT_SP = 12;
const PER_ROW = 5;
const NUM_H = 26;
const NUM_GAP = 6;

// Size of a typing box drawn over a part circle, in viewBox units.
const IN_W = 60;
const IN_H = 36;

/**
 * A typing box the student fills in. `status` is set after "Check" and
 * turns the border green/red.
 */
export interface Blank {
  value: string;
  onChange: (value: string) => void;
  status?: "good" | "bad";
  /** Screen-reader name, e.g. "part that makes ten". */
  label: string;
}

export interface BondPart {
  /** null draws a dashed "?" circle — the piece the student is finding. */
  value: number | null;
  tone: Tone;
  /** Draws a typing box in this circle instead of a number (value is ignored). */
  blank?: Blank;
}

export interface PartPartWholeProps {
  /** null draws a dashed "?" circle. */
  whole: number | null;
  parts: [BondPart, BondPart];
}

/** Top of the numeral-plus-dots block, so it sits centered in its circle. */
function blockTop(cy: number, dotCount: number) {
  const rows = Math.ceil(dotCount / PER_ROW);
  return cy - (NUM_H + (rows ? NUM_GAP + rows * DOT_SP : 0)) / 2;
}

/** Numeral on top, then dots in rows of 5 (same rhythm as the ten-frames). */
function Circle({ cx, cy, r, value, dotColors, stroke, fill, showNumeral = true }: { cx: number; cy: number; r: number; value: number | null; dotColors: string[]; stroke: string; fill: string; showNumeral?: boolean }) {
  if (value === null && showNumeral) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={r} style={{ fill: palette.paper, stroke: palette.muted, strokeWidth: 3, strokeDasharray: "7 6" }} />
        <text x={cx} y={cy + 13} textAnchor="middle" style={{ fill: palette.muted, fontSize: 40, fontWeight: 700 }}>
          ?
        </text>
      </g>
    );
  }
  const top = blockTop(cy, dotColors.length);
  const dots: ReactNode[] = dotColors.map((color, i) => {
    const row = Math.floor(i / PER_ROW);
    const col = i % PER_ROW;
    return <circle key={i} cx={cx + (col - (PER_ROW - 1) / 2) * DOT_SP} cy={top + NUM_H + NUM_GAP + row * DOT_SP + DOT_SP / 2} r={DOT_R} style={{ fill: color }} />;
  });
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} style={{ fill, stroke, strokeWidth: 3 }} />
      {showNumeral && (
        <text x={cx} y={top + NUM_H - 3} textAnchor="middle" style={{ fill: palette.ink, fontSize: 28, fontWeight: 700 }}>
          {value}
        </text>
      )}
      {dots}
    </g>
  );
}

/** A line from the edge of one circle to the edge of another. */
function Link({ x1, y1, r1, x2, y2, r2 }: { x1: number; y1: number; r1: number; x2: number; y2: number; r2: number }) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const d = Math.hypot(dx, dy);
  return (
    <line
      x1={x1 + (dx / d) * r1}
      y1={y1 + (dy / d) * r1}
      x2={x2 - (dx / d) * r2}
      y2={y2 - (dy / d) * r2}
      style={{ stroke: palette.ink, strokeWidth: 3, strokeLinecap: "round" }}
    />
  );
}

/** Shared look for every typing box: big, bold, colored to match its picture. */
function blankStyle(blank: Blank, tone?: Tone): CSSProperties {
  const border = blank.status === "good" ? palette.good : blank.status === "bad" ? palette.bad : tone ? toneColor(tone) : palette.muted;
  return {
    boxSizing: "border-box",
    textAlign: "center",
    fontSize: "1.5rem",
    fontWeight: 700,
    fontFamily: "inherit",
    color: palette.ink,
    background: palette.paper,
    border: `3px ${blank.value === "" ? "dashed" : "solid"} ${border}`,
    borderRadius: 10,
    padding: 0,
  };
}

function BlankInput({ blank, tone, style }: { blank: Blank; tone?: Tone; style?: CSSProperties }) {
  const early = useEarlyLearner();
  return (
    <input
      type="text"
      inputMode="numeric"
      {...numberPadProps(early)}
      maxLength={2}
      aria-label={blank.label}
      value={blank.value}
      onChange={(e) => {
        if (/^\d{0,2}$/.test(e.target.value)) blank.onChange(e.target.value);
      }}
      style={{ ...blankStyle(blank, tone), ...style }}
    />
  );
}

/** The number a part currently shows: its fixed value, or a blank once it's been checked correct. */
const shownValue = (p: BondPart): number | null => (p.blank ? (p.blank.status === "good" ? Number(p.blank.value) : null) : p.value);

/**
 * Part-part-whole (number bond): the whole on top, its two parts below,
 * joined by lines. Adapted from the legacy MG3/MG3.tsx demo's layout, but
 * redrawn as a self-contained SVG in this lab's palette (that demo used
 * Tailwind classes and its own text inputs, which don't fit the Unit engine).
 *
 * Each part's dots use the part's tone, and the whole's dots are those SAME
 * colored dots put back together — so a first grader can SEE that the whole
 * is made of the two parts without reading a sentence. An unknown value
 * (null) draws as a dashed "?" circle. A part with a `blank` gets a typing
 * box instead; its dots appear once it's checked correct.
 */
export function PartPartWhole({ whole, parts }: PartPartWholeProps) {
  const [p1, p2] = parts;
  const v1 = shownValue(p1);
  const v2 = shownValue(p2);
  // Color the whole's dots by part only once both parts are showing — until
  // then they stay plain ink so the colors don't give the split away.
  const split = whole !== null && v1 !== null && v2 !== null && v1 + v2 === whole;
  const wholeDots: string[] =
    whole === null ? [] : split ? [...Array<string>(v1).fill(toneColor(p1.tone)), ...Array<string>(v2).fill(toneColor(p2.tone))] : Array<string>(whole).fill(palette.ink);

  const label = `Number bond: whole ${whole ?? "unknown"}, parts ${v1 ?? "unknown"} and ${v2 ?? "unknown"}`;
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: W }}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label} style={{ display: "block", width: "100%", height: "auto", fontFamily: diagramFont }}>
        {PART_CX.map((cx, i) => (
          <Link key={i} x1={WHOLE.cx} y1={WHOLE.cy} r1={WHOLE.r} x2={cx} y2={PART_CY} r2={PART_R} />
        ))}
        <Circle cx={WHOLE.cx} cy={WHOLE.cy} r={WHOLE.r} value={whole} dotColors={wholeDots} stroke={palette.ink} fill={palette.paper} />
        {[p1, p2].map((p, i) => {
          const v = i === 0 ? v1 : v2;
          return (
            <Circle
              key={i}
              cx={PART_CX[i]}
              cy={PART_CY}
              r={PART_R}
              value={v}
              dotColors={v === null ? [] : Array<string>(v).fill(toneColor(p.tone))}
              stroke={toneColor(p.tone)}
              fill={toneSoft(p.tone)}
              showNumeral={!p.blank}
            />
          );
        })}
      </svg>
      {[p1, p2].map((p, i) => {
        if (!p.blank) return null;
        const v = i === 0 ? v1 : v2;
        const centerY = blockTop(PART_CY, v ?? 0) + NUM_H / 2;
        return (
          <BlankInput
            key={i}
            blank={p.blank}
            tone={p.tone}
            style={{
              position: "absolute",
              left: `${((PART_CX[i] - IN_W / 2) / W) * 100}%`,
              top: `${((centerY - IN_H / 2) / H) * 100}%`,
              width: `${(IN_W / W) * 100}%`,
              height: `${(IN_H / H) * 100}%`,
            }}
          />
        );
      })}
    </div>
  );
}

export type EqToken = number | "+" | "−" | "=" | "?" | { value: number | "?"; tone?: Tone } | { blank: Blank; tone?: Tone };

/**
 * A big, colored number sentence (e.g. 9 + 1 = 10) — colors match the
 * diagram above it, so the equation reads as "the picture, written down"
 * instead of another sentence of words. `{ blank }` tokens are typing boxes.
 */
export function EquationStrip({ tokens }: { tokens: EqToken[] }) {
  return (
    <div style={{ display: "flex", gap: 10, alignItems: "center", justifyContent: "center", fontSize: "1.9rem", fontWeight: 700, lineHeight: 1.1 }}>
      {tokens.map((t, i) => {
        if (t === "+" || t === "−" || t === "=") {
          return (
            <span key={i} style={{ color: palette.muted }}>
              {t}
            </span>
          );
        }
        if (typeof t === "object" && "blank" in t) {
          return <BlankInput key={i} blank={t.blank} tone={t.tone} style={{ width: "2.2em", height: "1.7em", fontSize: "1.9rem" }} />;
        }
        const value = typeof t === "object" ? t.value : t;
        const tone = typeof t === "object" ? t.tone : undefined;
        return (
          <span
            key={i}
            style={{
              minWidth: "1.6em",
              padding: "2px 8px",
              textAlign: "center",
              borderRadius: 10,
              color: palette.ink,
              background: tone ? toneSoft(tone) : "transparent",
              border: `3px ${value === "?" ? "dashed" : "solid"} ${tone ? toneColor(tone) : value === "?" ? palette.muted : "transparent"}`,
            }}
          >
            {value}
          </span>
        );
      })}
    </div>
  );
}
