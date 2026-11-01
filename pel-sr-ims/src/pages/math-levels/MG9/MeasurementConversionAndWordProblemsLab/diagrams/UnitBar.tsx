import { palette, diagramFont } from "../../../shared/lib/palette";
import { fmt } from "../../../shared/lib/math";
import { barPieces, type Conv } from "../lib/measures";

export interface UnitBarProps {
  conv: Conv;
  /** When false, the bottom bar is one blank "? {smalls}" block — so a
   *  Practice step asking "1 km = ? m" doesn't show the answer before it's
   *  given. When true, it's cut into equal labeled pieces (barPieces). */
  showFact: boolean;
}

const W = 520;
const PAD = 20;
const BAR_W = W - PAD * 2;

/**
 * "One big unit is the same length as this many small units," made literal:
 * two bars of exactly the same width, the top one a single block labeled
 * "1 kilometer," the bottom one the same span cut into equal pieces of the
 * small unit (10 pieces of 100 m, 12 pieces of 5 min, 16 pieces of 1 oz).
 * Piece count and size both come from barPieces(), the same helper every
 * caption uses, so the picture and the stated fact can't disagree.
 * Longest piece label is "100 m"/"10 cm"/"5 min"/"5 sec" (5 chars) in a
 * 40-48px piece, or "1 oz" in a 30px piece — both fit at fontSize 11.
 */
export function UnitBar({ conv, showFact }: UnitBarProps) {
  const [n, each] = barPieces(conv.f);
  const pieceW = BAR_W / n;
  return (
    <svg
      viewBox={`0 0 ${W} 132`}
      role="img"
      aria-label={showFact ? `1 ${conv.big} is the same as ${conv.f} ${conv.smalls}` : `1 ${conv.big} is the same as how many ${conv.smalls}?`}
      style={{ display: "block", width: "100%", maxWidth: W, height: "auto", fontFamily: diagramFont }}
    >
      <rect x={PAD} y={14} width={BAR_W} height={36} rx={6} style={{ fill: palette.aSoft, stroke: palette.a, strokeWidth: 2 }} />
      <text x={W / 2} y={37} textAnchor="middle" style={{ fill: palette.ink, fontSize: 15, fontWeight: 700 }}>
        1 {conv.big}
      </text>
      {showFact ? (
        Array.from({ length: n }, (_, i) => (
          <g key={i}>
            <rect x={PAD + i * pieceW} y={62} width={pieceW} height={36} style={{ fill: palette.bSoft, stroke: palette.b, strokeWidth: 1.5 }} />
            <text x={PAD + i * pieceW + pieceW / 2} y={84} textAnchor="middle" style={{ fill: palette.ink, fontSize: 11, fontWeight: 600 }}>
              {each} {conv.smallAb}
            </text>
          </g>
        ))
      ) : (
        <>
          <rect x={PAD} y={62} width={BAR_W} height={36} rx={6} style={{ fill: palette.bSoft, stroke: palette.b, strokeWidth: 2, strokeDasharray: "6 4" }} />
          <text x={W / 2} y={85} textAnchor="middle" style={{ fill: palette.ink, fontSize: 15, fontWeight: 700 }}>
            ? {conv.smalls}
          </text>
        </>
      )}
      <text x={W / 2} y={122} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13 }}>
        {showFact ? `1 ${conv.bigAb} = ${n} pieces of ${each} ${conv.smallAb} = ${fmt(conv.f)} ${conv.smallAb}` : `Same length — how many ${conv.smalls} fit?`}
      </text>
    </svg>
  );
}
