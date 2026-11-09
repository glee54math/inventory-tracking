import { palette, diagramFont } from "../../../shared/lib/palette";
import { SvgMathLine } from "../../../shared/components/SvgMath";
import { spokenFractions } from "../../../shared/components/MathText";

export interface TapePart {
  /** Relative size — usually the amount in a COMMON unit. */
  weight: number;
  label: string;
  tone: "a" | "b" | "c";
}

const W = 520;
const PAD = 14;
const BAR_W = W - PAD * 2;
const MIN_PART = 70;

const soft = (t: "a" | "b" | "c") => (t === "a" ? palette.aSoft : t === "b" ? palette.bSoft : palette.cSoft);
const main = (t: "a" | "b" | "c") => (t === "a" ? palette.a : t === "b" ? palette.b : palette.c);

/**
 * A tape (bar) diagram: parts laid end to end with a bracket over the whole
 * showing the total — the standard grade-4 picture for "put together," "take
 * away," "equal groups," and "share equally." Widths are proportional to
 * `weight`, except every part is guaranteed at least MIN_PART px so its
 * label always fits (longest label in this lab is about "2,500 mL" or
 * "1 1/2 L", ~8 chars ≈ 56px at fontSize 13). That means a tiny part next to
 * a huge one is drawn "not to scale," which the mixed-unit bucket uses on
 * purpose: "2 kg" and "500 g" are visibly NOT the same kind of block.
 */
export function TapeBar({ parts, total }: { parts: TapePart[]; total?: string }) {
  const n = parts.length;
  const minW = Math.min(MIN_PART, BAR_W / n);
  const sum = parts.reduce((a, p) => a + p.weight, 0) || 1;
  const spare = BAR_W - minW * n;
  const widths = parts.map((p) => minW + (spare * p.weight) / sum);
  let x = PAD;
  const top = total ? 30 : 8;
  return (
    <svg
      viewBox={`0 0 ${W} ${top + 52}`}
      role="img"
      aria-label={spokenFractions(`Tape diagram: ${parts.map((p) => p.label).join(", ")}${total ? `; total ${total}` : ""}`)}
      style={{ display: "block", width: "100%", maxWidth: W, height: "auto", fontFamily: diagramFont }}
    >
      {total && (
        <g>
          <path d={`M ${PAD} ${top - 4} v -8 H ${PAD + BAR_W} v 8`} style={{ fill: "none", stroke: palette.c, strokeWidth: 2 }} />
          <text x={W / 2} y={top - 16} textAnchor="middle" style={{ fill: palette.c, fontSize: 14, fontWeight: 800 }}>
            {total}
          </text>
        </g>
      )}
      {parts.map((p, i) => {
        const w = widths[i];
        const el = (
          <g key={i}>
            <rect x={x} y={top} width={w} height={40} style={{ fill: soft(p.tone), stroke: main(p.tone), strokeWidth: 2 }} />
            {/* A fraction in a label ("3/4 km") is drawn stacked, the handwritten way. */}
            <SvgMathLine text={p.label} x={x + w / 2} y={top + 25} fontSize={13} weight={700} color={palette.ink} />
          </g>
        );
        x += w;
        return el;
      })}
    </svg>
  );
}
