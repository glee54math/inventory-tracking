import { palette, diagramFont } from "../../../shared/lib/palette";

export interface GraphCategory {
  label: string;
  glyph: string;
  count: number;
  tone?: "a" | "b" | "c";
}

const toneFill = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

const ROW_H = 38;
const ICON = 24;
const LABEL_W = 96;
const PAD = 10;

/** A single-unit-scale picture graph (2.MD.10), up to 4 categories — one row
 *  per category, `count` copies of its glyph laid left to right, read
 *  directly rather than via a bar height. */
export function PictureGraph({ categories }: { categories: GraphCategory[] }) {
  const cap = Math.max(...categories.map((c) => c.count), 1);
  const width = LABEL_W + PAD * 2 + cap * ICON;
  const height = categories.length * ROW_H + PAD;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={categories.map((c) => `${c.label}: ${c.count}`).join(", ")}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {categories.map((c, row) => {
        const y = row * ROW_H + ROW_H / 2;
        return (
          <g key={c.label}>
            <text x={LABEL_W - 8} y={y + 5} textAnchor="end" fontSize={13} fontWeight={700} fill={toneFill(c.tone)}>
              {c.label}
            </text>
            <line x1={LABEL_W} y1={y} x2={width} y2={y} stroke={palette.line} strokeWidth={1} />
            {Array.from({ length: c.count }, (_, i) => (
              <text key={i} x={LABEL_W + PAD + i * ICON + ICON / 2} y={y + 8} textAnchor="middle" fontSize={ICON * 0.8}>
                {c.glyph}
              </text>
            ))}
            {c.count === 0 && (
              <text x={LABEL_W + PAD} y={y + 5} fontSize={11} fill={palette.muted}>
                (none)
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

/** A bar graph (2.MD.10) with real bar heights and axis gridlines — the
 *  direct counterpart to PictureGraph above, for the "misreading the
 *  scale/gridlines rather than the bar heights" misconception bucket.
 *  Vertical bars, up to 4 categories. */
export function BarGraph({ categories, tickStep }: { categories: GraphCategory[]; tickStep?: number }) {
  const maxCount = Math.max(...categories.map((c) => c.count), 1);
  const step = tickStep ?? (maxCount <= 5 ? 1 : maxCount <= 10 ? 2 : 5);
  const axisMax = Math.ceil(maxCount / step) * step;
  const PLOT_H = 160;
  const BAR_W = 46;
  const GAP = 28;
  const LEFT = 36;
  const width = LEFT + categories.length * (BAR_W + GAP) + GAP;
  const height = PLOT_H + 46;
  const pxPerUnit = PLOT_H / axisMax;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`A bar graph: ${categories.map((c) => `${c.label} ${c.count}`).join(", ")}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {Array.from({ length: axisMax / step + 1 }, (_, i) => {
        const v = i * step;
        const y = PLOT_H - v * pxPerUnit;
        return (
          <g key={v}>
            <line x1={LEFT} y1={y} x2={width - 6} y2={y} stroke={palette.grid} strokeWidth={1} />
            <text x={LEFT - 6} y={y + 4} textAnchor="end" fontSize={11} fill={palette.muted}>
              {v}
            </text>
          </g>
        );
      })}
      <line x1={LEFT} y1={0} x2={LEFT} y2={PLOT_H} stroke={palette.ink} strokeWidth={1.5} />
      <line x1={LEFT} y1={PLOT_H} x2={width - 6} y2={PLOT_H} stroke={palette.ink} strokeWidth={1.5} />
      {categories.map((c, i) => {
        const x = LEFT + GAP + i * (BAR_W + GAP);
        const barH = c.count * pxPerUnit;
        return (
          <g key={c.label}>
            <rect x={x} y={PLOT_H - barH} width={BAR_W} height={barH} fill={toneFill(c.tone)} rx={4} />
            <text x={x + BAR_W / 2} y={PLOT_H - barH - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill={toneFill(c.tone)}>
              {c.count}
            </text>
            <text x={x + BAR_W / 2} y={PLOT_H + 20} textAnchor="middle" fontSize={12} fontWeight={600} fill={palette.ink}>
              {c.glyph}
            </text>
            <text x={x + BAR_W / 2} y={PLOT_H + 36} textAnchor="middle" fontSize={10} fill={palette.muted}>
              {c.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
