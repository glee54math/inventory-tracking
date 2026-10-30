import { palette, diagramFont } from "../../../shared/lib/palette";

export interface BarCategory {
  label: string;
  value: number;
  tone?: "a" | "b" | "c";
}

export interface ScaledBarChartProps {
  categories: BarCategory[];
  /** Gridline spacing greater than 1 — the whole point of a SCALED bar
   *  graph (3.MD.3): reading a bar means multiplying its gridline position
   *  by this scale, not reading the gridline number literally. */
  scale: number;
  /** Highest gridline label, a multiple of `scale` at least as tall as the
   *  tallest category — caller's job so every chart in one problem/question
   *  shares one fixed axis instead of auto-fitting per bar. */
  axisMax: number;
  /** When true, labeled gridlines are numbered by LINE (1, 2, 3, ...) and a
   *  key caption ("each line = {scale}") is drawn above the chart, instead of
   *  printing the already-multiplied value on each line. This is the exact
   *  setup for 3.MD.3's headline misconception — reading "the bar reaches
   *  line 3" as "3" instead of 3 x scale — so Unit 5's CFU and its
   *  read-at-a-gridline bucket use it. Default false (value labels). */
  keyMode?: boolean;
  /** Spacing of the light unlabeled minor gridlines (default 1). Raised to 5
   *  for a scale-10 chart so the minor lines stay far enough apart to count. */
  minorStep?: number;
}

const BAR_W = 46;
const GAP = 22;
const PAD_L = 46;
const PAD_BOTTOM = 34;
const CHART_H = 260;
const KEY_H = 26;

/**
 * A scaled vertical bar graph: one labeled gridline every `scale` units
 * (bold), plus a light, UNLABELED minor gridline every single unit — same
 * "every small mark is readable, only every Nth is labeled" convention as
 * this lab's own Clock face. That minor-gridline ladder is what makes a bar
 * landing BETWEEN two major gridlines still exactly, not approximately,
 * readable — a student counts minor lines up from the nearest labeled one
 * instead of eyeballing a fraction of the gap.
 */
export function ScaledBarChart({ categories, scale, axisMax, keyMode = false, minorStep = 1 }: ScaledBarChartProps) {
  const width = PAD_L + categories.length * (BAR_W + GAP) + GAP;
  const top = keyMode ? KEY_H : 6;
  const height = top + CHART_H + PAD_BOTTOM;
  const yFor = (v: number) => top + CHART_H - (v / axisMax) * CHART_H;
  const base = top + CHART_H;

  const majorLines: number[] = [];
  for (let v = 0; v <= axisMax; v += scale) majorLines.push(v);
  const minorLines: number[] = [];
  for (let v = minorStep; v < axisMax; v += minorStep) if (v % scale !== 0) minorLines.push(v);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`A bar graph where each labeled gridline is ${scale} units apart, with ${categories.length} bars`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {keyMode && (
        <text x={PAD_L} y={16} fontSize={13} fontWeight={700} fill={palette.ink}>
          Key: each labeled line = {scale}
        </text>
      )}
      {minorLines.map((v) => (
        <line key={`m${v}`} x1={PAD_L} y1={yFor(v)} x2={width} y2={yFor(v)} stroke={palette.grid} strokeWidth={1} />
      ))}
      {majorLines.map((v) => (
        <g key={`M${v}`}>
          <line x1={PAD_L} y1={yFor(v)} x2={width} y2={yFor(v)} stroke={palette.line} strokeWidth={1.5} />
          <text x={PAD_L - 8} y={yFor(v) + 4} textAnchor="end" fontSize={12} fontWeight={700} fill={palette.muted}>
            {keyMode ? v / scale : v}
          </text>
        </g>
      ))}
      <line x1={PAD_L} y1={top} x2={PAD_L} y2={base} stroke={palette.ink} strokeWidth={2} />
      <line x1={PAD_L} y1={base} x2={width} y2={base} stroke={palette.ink} strokeWidth={2} />
      {categories.map((c, i) => {
        const x = PAD_L + GAP + i * (BAR_W + GAP);
        const y = yFor(c.value);
        const fill = c.tone === "b" ? palette.b : c.tone === "c" ? palette.c : palette.a;
        return (
          <g key={c.label}>
            <rect x={x} y={y} width={BAR_W} height={base - y} fill={fill} opacity={0.75} rx={3} />
            <text x={x + BAR_W / 2} y={base + 20} textAnchor="middle" fontSize={13} fontWeight={700} fill={palette.ink}>
              {c.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
