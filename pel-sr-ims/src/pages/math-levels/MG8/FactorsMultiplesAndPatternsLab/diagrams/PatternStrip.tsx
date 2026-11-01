import { palette } from "../../../shared/lib/palette";

export interface PatternStripProps {
  /** The terms in order; `null` draws a "?" box (a term not found yet). */
  terms: (number | null)[];
  /** Arrow label between terms, e.g. "+4" or "×2 −1". */
  rule: string;
  /** Tint odd terms one colour and even terms another (the "hidden feature" view). */
  parity?: boolean;
  width?: number;
}

const BOX = 58;
const ARROW = 40;

/**
 * A number pattern as a strip of term boxes joined by rule arrows. Each box
 * shows its position ("1st", "2nd", ...) underneath, so "term" and "which
 * term" are both visible. With `parity`, odd and even terms get different
 * tints — the visual for noticing a feature the rule never mentions.
 */
export function PatternStrip({ terms, rule, parity = false, width = 620 }: PatternStripProps) {
  const w = terms.length * BOX + (terms.length - 1) * ARROW + 8;
  const h = 96;
  const ord = (i: number) => {
    const n = i + 1;
    const s = n % 10 === 1 && n !== 11 ? "st" : n % 10 === 2 && n !== 12 ? "nd" : n % 10 === 3 && n !== 13 ? "rd" : "th";
    return `${n}${s}`;
  };
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={Math.min(width, w * 1.15)} style={{ maxWidth: "100%" }} role="img" aria-label={`Pattern: ${terms.map((t) => (t === null ? "?" : t)).join(", ")}; rule ${rule}`}>
      {terms.map((t, i) => {
        const x = 4 + i * (BOX + ARROW);
        const fill = t === null ? palette.paper : parity ? (t % 2 === 0 ? palette.aSoft : palette.bSoft) : palette.aSoft;
        const stroke = t === null ? palette.muted : parity ? (t % 2 === 0 ? palette.a : palette.b) : palette.a;
        return (
          <g key={i}>
            <rect x={x} y={26} width={BOX} height={42} rx={8} style={{ fill, stroke, strokeWidth: 2, strokeDasharray: t === null ? "5 4" : undefined }} />
            <text x={x + BOX / 2} y={53} textAnchor="middle" style={{ fill: palette.ink, fontSize: t !== null && Math.abs(t) >= 1000 ? 14 : 18, fontWeight: 700 }}>
              {t === null ? "?" : t}
            </text>
            <text x={x + BOX / 2} y={86} textAnchor="middle" style={{ fill: palette.muted, fontSize: 12 }}>
              {ord(i)}
            </text>
            {i < terms.length - 1 && (
              <g>
                <line x1={x + BOX + 5} y1={47} x2={x + BOX + ARROW - 7} y2={47} style={{ stroke: palette.c, strokeWidth: 2 }} />
                <path d={`M ${x + BOX + ARROW - 7} 47 l -6 -4 v 8 z`} style={{ fill: palette.c }} />
                <text x={x + BOX + ARROW / 2} y={18} textAnchor="middle" style={{ fill: palette.c, fontSize: rule.length > 4 ? 11 : 13, fontWeight: 700 }}>
                  {rule}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
