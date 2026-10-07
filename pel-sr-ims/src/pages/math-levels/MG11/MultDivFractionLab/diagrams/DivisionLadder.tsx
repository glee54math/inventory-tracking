import type { CSSProperties } from "react";
import { palette } from "../../../shared/lib/palette";

interface Cycle {
  /** Which dividend digit position (0-indexed from the left) this cycle's result lands under. */
  atIndex: number;
  current: number;
  qDigit: number;
  product: number;
  remainder: number;
}

interface LongDivisionResult {
  digits: number[];
  cycles: Cycle[];
  quotient: number;
  remainder: number;
}

/**
 * Standard long-division algorithm, computed purely for display. The first
 * cycle may bring down more than one digit (whenever the leading digit(s) of
 * the dividend are smaller than the divisor — the normal case, not an edge
 * case: e.g. 128÷4 brings down "1" then "2" before the first quotient digit).
 * Every cycle after that brings down exactly one new digit, per the algorithm.
 */
export function computeLongDivision(dividend: number, divisor: number): LongDivisionResult {
  const digits = String(Math.trunc(dividend)).split("").map(Number);
  const cycles: Cycle[] = [];
  let current = 0;
  let idx = 0;

  while (idx < digits.length) {
    current = current * 10 + digits[idx];
    idx++;
    if (current >= divisor || idx === digits.length) break;
  }
  const firstQ = Math.floor(current / divisor);
  cycles.push({ atIndex: idx - 1, current, qDigit: firstQ, product: firstQ * divisor, remainder: current - firstQ * divisor });
  current -= firstQ * divisor;

  while (idx < digits.length) {
    current = current * 10 + digits[idx];
    const q = Math.floor(current / divisor);
    cycles.push({ atIndex: idx, current, qDigit: q, product: q * divisor, remainder: current - q * divisor });
    current -= q * divisor;
    idx++;
  }

  const quotient = Number(cycles.map((c) => c.qDigit).join(""));
  return { digits, cycles, quotient, remainder: current };
}

export interface DivisionLadderProps {
  dividend: number;
  divisor: number;
  /** How many cycles are revealed (0 = just the bracket + dividend/divisor). */
  done: number;
}

const cellStyle: CSSProperties = {
  display: "inline-block",
  width: "1.6em",
  textAlign: "center",
};

/** Bracket long-division layout, filling in one cycle (digit, product, remainder) at a time as `done` increases. */
export function DivisionLadder({ dividend, divisor, done }: DivisionLadderProps) {
  const { digits, cycles } = computeLongDivision(dividend, divisor);
  const shown = Math.min(done, cycles.length);

  return (
    <div
      role="img"
      aria-label={`Long division of ${dividend} by ${divisor}`}
      style={{ fontFamily: "'Courier New', monospace", fontSize: 20, color: palette.ink, display: "inline-block" }}
    >
      {/* quotient row */}
      <div style={{ marginLeft: "2.6em" }}>
        {digits.map((_, i) => {
          const cyc = cycles.find((c) => c.atIndex === i);
          const cycIdx = cyc ? cycles.indexOf(cyc) : -1;
          const visible = cyc && cycIdx < shown;
          return (
            <span key={i} style={{ ...cellStyle, color: palette.a, fontWeight: 700 }}>
              {visible ? cyc!.qDigit : " "}
            </span>
          );
        })}
      </div>
      {/* bracket + dividend */}
      <div style={{ display: "flex", alignItems: "flex-start" }}>
        <span style={{ marginRight: "0.3em" }}>{divisor}</span>
        <div style={{ borderTop: `3px solid ${palette.ink}`, borderLeft: `3px solid ${palette.ink}`, paddingLeft: "0.15em", paddingTop: "0.05em" }}>
          {digits.map((d, i) => (
            <span key={i} style={cellStyle}>
              {d}
            </span>
          ))}
        </div>
      </div>
      {/* cycles */}
      {cycles.slice(0, shown).map((c, i) => {
        const indent = c.atIndex - String(c.current).length + 1 + 1; // +1 for the divisor-width offset
        return (
          <div key={i}>
            <div style={{ marginLeft: `${Math.max(indent, 1)}.6em`, color: palette.muted }}>
              − {c.product}
            </div>
            <div style={{ marginLeft: `${Math.max(indent, 1)}.6em`, borderTop: `1px solid ${palette.line}`, width: `${String(c.current).length * 1.6}em` }} />
            <div style={{ marginLeft: `${Math.max(indent, 1)}.6em`, fontWeight: i === shown - 1 ? 700 : 400, color: i === shown - 1 ? palette.c : palette.ink }}>
              {c.remainder}
            </div>
          </div>
        );
      })}
    </div>
  );
}
