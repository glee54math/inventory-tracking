import { useRef } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";
import { decText, type Places } from "../lib/decimals";

export interface ZoomLineProps {
  /** The two neighbors at the rounding place, in thousandths (hi - lo is 1000, 100 or 10). */
  lo: number;
  hi: number;
  /** The place lo and hi are written to (0 whole number, 1 tenths, 2 hundredths). */
  p: Places;
  /** The number being rounded, in thousandths, and how it is written. Omit to hide the dot. */
  x?: { t: number; p: Places };
  /** Print lo and hi under the ends (off while a step asks for them). */
  showEnds?: boolean;
  /** Mark and label the halfway point. */
  showMid?: boolean;
  /** Ring the end the number rounds to. */
  ringR?: number;
  /** Explore only: drag the dot along the line (snaps to thousandths). */
  onChange?: (t: number) => void;
}

const WIDTH = 560;
const PAD = 40;
const HEIGHT = 108;
const Y = 54;

/**
 * One step at the rounding place (2.43 to 2.44) stretched across the line,
 * cut into 10 small steps of the next place, with the halfway mark. The same
 * number-line idea as MG6's whole-number rounding units, zoomed in to one
 * tenth or one hundredth. Lab-local: MG9's DecimalNumberLine is fixed at one
 * whole in hundredths, and the shared NumberLine is built for whole-number
 * ranges.
 */
export function ZoomLine({ lo, hi, p, x, showEnds = true, showMid = true, ringR, onChange }: ZoomLineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const span = hi - lo;
  const toX = (t: number) => PAD + ((t - lo) / span) * (WIDTH - 2 * PAD);
  const mid = lo + span / 2;
  const subP = (p + 1) as Places;
  const toValue = (clientX: number): number => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return lo;
    const scale = rect.width / WIDTH;
    const raw = lo + ((clientX - rect.left - PAD * scale) / ((WIDTH - 2 * PAD) * scale)) * span;
    return Math.min(hi, Math.max(lo, Math.round(raw)));
  };
  const endLabel = (t: number) => decText(t, p);
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`Number line from ${showEnds ? endLabel(lo) : "one end"} to ${showEnds ? endLabel(hi) : "the other end"}${showMid ? `, halfway at ${decText(mid, subP)}` : ""}${x ? `, with a dot at ${decText(x.t, x.p)}` : ""}`}
      style={{ display: "block", width: "100%", maxWidth: WIDTH, height: "auto", fontFamily: diagramFont }}
    >
      <line x1={PAD} y1={Y} x2={WIDTH - PAD} y2={Y} style={{ stroke: palette.line, strokeWidth: 2 }} />
      {Array.from({ length: 11 }, (_, k) => {
        const end = k === 0 || k === 10;
        const half = k === 5;
        const tx = toX(lo + (k * span) / 10);
        return <line key={k} x1={tx} y1={Y - (end ? 11 : half ? 9 : 5)} x2={tx} y2={Y + (end ? 11 : half ? 9 : 5)} style={{ stroke: end ? palette.ink : half && showMid ? palette.c : palette.muted, strokeWidth: end ? 2.5 : half && showMid ? 2.5 : 1.2 }} />;
      })}
      {[lo, hi].map((t) => (
        <g key={t}>
          {ringR === t && <circle cx={toX(t)} cy={Y + 30} r={24} style={{ fill: palette.goodSoft, stroke: palette.good, strokeWidth: 2 }} />}
          <text x={toX(t)} y={Y + 35} textAnchor="middle" style={{ fontSize: 15, fontWeight: 800, fill: palette.ink }}>
            {showEnds ? endLabel(t) : "?"}
          </text>
        </g>
      ))}
      {showMid && (
        <text x={toX(mid)} y={Y + 32} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: palette.c }}>
          halfway {decText(mid, subP)}
        </text>
      )}
      {x && x.t >= lo && x.t <= hi && (
        <g>
          <text x={toX(x.t)} y={Y - 18} textAnchor="middle" style={{ fontSize: 15, fontWeight: 800, fill: palette.a }}>
            {decText(x.t, x.p)}
          </text>
          <circle cx={toX(x.t)} cy={Y} r={8} style={{ fill: palette.a, stroke: palette.paper, strokeWidth: 2 }} pointerEvents="none" />
          {onChange && (
            <circle
              cx={toX(x.t)}
              cy={Y}
              r={20}
              fill="transparent"
              style={{ cursor: "grab", touchAction: "none" }}
              onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
              onPointerMove={(e) => {
                if (e.buttons !== 1) return;
                const v = toValue(e.clientX);
                if (v !== x.t) onChange(v);
              }}
            />
          )}
        </g>
      )}
    </svg>
  );
}
