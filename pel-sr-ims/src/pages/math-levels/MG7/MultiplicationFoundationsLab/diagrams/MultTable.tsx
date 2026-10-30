import type { CSSProperties } from "react";
import { palette } from "../../../shared/lib/palette";

export interface MultTableProps {
  /** Table covers 1..max by 1..max. Default 9 (the full one-digit fact table). */
  max?: number;
  /** Shades this whole row (and its header cell). */
  highlightRow?: number;
  /** Shades this whole column (and its header cell). */
  highlightCol?: number;
  /**
   * Shades exactly two cells, (a,b) and (b,a) — the diagonal-symmetry
   * picture for "a × b = b × a", so the mirrored pair is visible at once
   * instead of inferred from two separate highlighted lines.
   */
  mirrorPair?: [number, number];
  /** Only shade cells whose product is even (or odd) — for the even/odd pattern bucket. */
  parityHighlight?: "even" | "odd";
  size?: "sm" | "md";
}

/**
 * The 1..max by 1..max multiplication table, as a plain HTML table — the
 * shared visual for every Unit 5 pattern bucket (even/odd shading,
 * skip-counting down a single row/column, the 9s column, and the
 * commutative mirror-pair). No existing diagram in shared/diagrams/ or any
 * sibling lab's own diagrams/ renders a full multiplication table; this is
 * lab-local (first consumer, not promoted this round).
 */
export function MultTable({ max = 9, highlightRow, highlightCol, mirrorPair, parityHighlight, size = "sm" }: MultTableProps) {
  const cell = size === "sm" ? 30 : 38;
  const font = size === "sm" ? 13 : 15;
  const nums = Array.from({ length: max }, (_, i) => i + 1);

  const cellStyle = (r: number, c: number): CSSProperties => {
    const product = r * c;
    const isMirror = !!mirrorPair && ((mirrorPair[0] === r && mirrorPair[1] === c) || (mirrorPair[0] === c && mirrorPair[1] === r));
    const inRow = highlightRow === r;
    const inCol = highlightCol === c;
    const parityMatch = parityHighlight ? (parityHighlight === "even" ? product % 2 === 0 : product % 2 === 1) : false;
    const highlighted = isMirror || inRow || inCol || parityMatch;
    return {
      width: cell,
      height: cell,
      textAlign: "center",
      fontSize: font,
      fontWeight: highlighted ? 700 : 500,
      border: `1px solid ${palette.grid}`,
      background: isMirror ? palette.cSoft : inRow || inCol ? palette.aSoft : parityMatch ? palette.bSoft : "transparent",
      color: highlighted ? palette.ink : palette.muted,
    };
  };

  const headerStyle = (highlighted: boolean): CSSProperties => ({
    width: cell,
    height: cell,
    textAlign: "center",
    fontSize: font,
    fontWeight: 700,
    background: highlighted ? palette.a : palette.cSoft,
    // --on-q flips to a dark ink in dark mode, where palette.a is a light tint.
    color: highlighted ? "var(--on-q, #fff)" : palette.ink,
    border: `1px solid ${palette.grid}`,
  });

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ borderCollapse: "collapse" }} aria-label={`Multiplication table from 1 to ${max}`}>
        <tbody>
          <tr>
            <td style={{ ...headerStyle(false), background: palette.paper }} />
            {nums.map((c) => (
              <td key={c} style={headerStyle(highlightCol === c)}>
                {c}
              </td>
            ))}
          </tr>
          {nums.map((r) => (
            <tr key={r}>
              <td style={headerStyle(highlightRow === r)}>{r}</td>
              {nums.map((c) => (
                <td key={c} style={cellStyle(r, c)}>
                  {r * c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
