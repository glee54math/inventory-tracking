import { palette, diagramFont } from "../../../shared/lib/palette";
import { eighthsText, plotTicks, type PlotDen } from "../lib/fractions";
import { SvgMath } from "../../../shared/components/SvgMath";
import { spokenFractions } from "../../../shared/components/MathText";

export interface FracLinePlotProps {
  /** Axis tick spacing: halves, fourths or eighths ONLY (4.MD.4's own set). */
  den: PlotDen;
  minWhole: number;
  maxWhole: number;
  /** Every measurement, in EIGHTHS (so 1/2 = 4, 3/4 = 6, 1 1/8 = 9). Values
   *  that don't land on one of this plot's ticks are ignored. */
  data: number[];
  /** Units word for the aria label, e.g. "inches". */
  unit?: string;
  tone?: "a" | "b" | "c";
  /** Explore / Practice build mode: clicking a tick's column reports that tick's value (eighths). */
  onTickClick?: (eighths: number) => void;
  /** Build-mode feedback: tick values whose stack is right / wrong, colored on the label. */
  goodTicks?: number[];
  badTicks?: number[];
  /** Highlight one tick's label (the value a question is about). */
  highlight?: number;
}

const PAD_X = 30;
const DOT_R = 8;
const DOT_GAP = 19;

/**
 * A line plot for fractional measurement data — a number line marked in
 * halves, fourths or eighths, EVERY tick labeled in lowest terms (1/8, 1/4,
 * 3/8, 1/2 ...) with tick height showing its size class (whole > half >
 * fourth > eighth), and one stacked dot per measurement. Dot positions,
 * tick labels and every graded "how many / how long / total / difference"
 * answer all come from the same eighths-valued `data` array and the same
 * plotTicks()/eighthsText() helpers in lib/fractions.ts.
 *
 * Lab-local successor to MG7/TimeMeasurementAndDataLab's quarter-inch
 * LinePlot (whole-number labels only, no eighths, no click-to-build) — a
 * shared/diagrams/ promotion candidate (that one + MG5's LinePlot + this).
 */
export function FracLinePlot({ den, minWhole, maxWhole, data, unit = "units", tone = "a", onTickClick, goodTicks = [], badTicks = [], highlight }: FracLinePlotProps) {
  const fill = tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a;
  const ticks = plotTicks(den, minWhole, maxWhole);
  const step = den === 2 ? 64 : 50;
  const width = PAD_X * 2 + (ticks.length - 1) * step;
  const counts = new Map<number, number>();
  for (const v of data) if (ticks.includes(v)) counts.set(v, (counts.get(v) ?? 0) + 1);
  const maxStack = Math.max(4, ...counts.values());
  const axisY = 16 + maxStack * DOT_GAP;
  // Room under the axis for a stacked (handwritten) tick label.
  const height = axisY + 52;
  const xFor = (e: number) => PAD_X + ((e - minWhole * 8) / (8 / den)) * step;
  const good = new Set(goodTicks);
  const bad = new Set(badTicks);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={spokenFractions(`Line plot from ${minWhole} to ${maxWhole} ${unit}, marked every 1/${den}, with ${data.length} measurement${data.length === 1 ? "" : "s"}`)}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      <line x1={PAD_X - 12} y1={axisY} x2={width - PAD_X + 12} y2={axisY} style={{ stroke: palette.ink, strokeWidth: 2 }} />
      {ticks.map((e) => {
        const r = e % 8;
        const h = r === 0 ? 14 : r === 4 ? 11 : r % 2 === 0 ? 8 : 6;
        const x = xFor(e);
        const labelColor = good.has(e) ? palette.good : bad.has(e) ? palette.bad : e === highlight ? palette.c : r === 0 ? palette.ink : palette.muted;
        return (
          <g key={e}>
            {onTickClick && (
              <rect x={x - step / 2} y={0} width={step} height={axisY + 36} style={{ fill: "transparent", cursor: "pointer" }} onClick={() => onTickClick(e)}>
                <title>{spokenFractions(`Add a dot at ${eighthsText(e)}`)}</title>
              </rect>
            )}
            <line x1={x} y1={axisY} x2={x} y2={axisY + h} style={{ stroke: r === 0 ? palette.ink : palette.muted, strokeWidth: r === 0 ? 2 : 1.25, pointerEvents: "none" }} />
            {/* Tick labels are drawn stacked, the handwritten way (SvgMath). */}
            <g style={{ pointerEvents: "none" }}>
              <SvgMath text={eighthsText(e)} x={x} y={axisY + 32} fontSize={12} weight={r === 0 || e === highlight || good.has(e) || bad.has(e) ? 800 : 600} color={labelColor} />
            </g>
          </g>
        );
      })}
      {Array.from(counts.entries()).map(([e, n]) =>
        Array.from({ length: n }, (_, i) => (
          <circle key={`${e}-${i}`} cx={xFor(e)} cy={axisY - 12 - i * DOT_GAP} r={DOT_R} style={{ fill, fillOpacity: 0.9, pointerEvents: "none" }} />
        ))
      )}
    </svg>
  );
}
