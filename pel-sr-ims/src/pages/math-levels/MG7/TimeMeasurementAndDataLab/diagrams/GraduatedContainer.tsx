import { palette, diagramFont } from "../../../shared/lib/palette";

export interface GraduatedContainerProps {
  /** Whole liters the container is marked up to (the top tick). */
  capacityL: number;
  /** How full it is, in liters — may land exactly on a tick (a whole liter)
   *  or exactly halfway between two ticks (a half liter), never anywhere
   *  else, so every fill level is unambiguously readable from the marks
   *  actually drawn (ticks every whole liter, a lighter half-liter tick
   *  between each pair). */
  fillL: number;
  tone?: "a" | "b" | "c";
}

const W = 90;
const H = 220;
const PAD_TOP = 16;
const PAD_BOTTOM = 10;
const BODY_H = H - PAD_TOP - PAD_BOTTOM;

/**
 * A graduated container (beaker): a clear cylinder marked with tick lines
 * every whole liter (bold, labeled) and every half liter (lighter,
 * unlabeled), with a shaded fill level. The SAME fillL value drives both
 * the shaded rectangle's height and every graded "how many liters" answer
 * — there is no separate "rendered height" computation to drift out of
 * sync with the answer.
 */
export function GraduatedContainer({ capacityL, fillL, tone = "a" }: GraduatedContainerProps) {
  const fill = tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a;
  const fillFrac = Math.max(0, Math.min(1, fillL / capacityL));
  const fillH = BODY_H * fillFrac;
  const bodyTop = PAD_TOP;
  const bodyBottom = PAD_TOP + BODY_H;

  const ticks: { y: number; major: boolean; label?: string }[] = [];
  for (let half = 0; half <= capacityL * 2; half++) {
    const liters = half / 2;
    const y = bodyBottom - (liters / capacityL) * BODY_H;
    const major = half % 2 === 0;
    ticks.push({ y, major, label: major ? String(liters) : undefined });
  }

  return (
    <svg
      viewBox={`0 0 ${W + 34} ${H}`}
      role="img"
      aria-label={`A container marked up to ${capacityL} liters, filled to ${fillL} liters`}
      style={{ display: "block", width: "100%", maxWidth: W + 34, height: "auto", fontFamily: diagramFont }}
    >
      {/* container outline */}
      <rect x={10} y={bodyTop} width={W} height={BODY_H} rx={6} fill={palette.paper} stroke={palette.line} strokeWidth={2.5} />
      {/* fill */}
      <rect x={10} y={bodyBottom - fillH} width={W} height={fillH} fill={fill} opacity={0.35} />
      <line x1={10} y1={bodyBottom - fillH} x2={10 + W} y2={bodyBottom - fillH} stroke={fill} strokeWidth={2.5} />
      {/* ticks */}
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={10} y1={t.y} x2={10 + (t.major ? 22 : 12)} y2={t.y} stroke={palette.muted} strokeWidth={t.major ? 2 : 1.25} />
          {t.label && (
            <text x={10 + W + 6} y={t.y + 4} fontSize={12} fontWeight={700} fill={palette.ink}>
              {t.label} L
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}
