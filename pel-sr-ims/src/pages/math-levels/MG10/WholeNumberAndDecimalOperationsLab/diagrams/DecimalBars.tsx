import { palette, diagramFont } from "../../../shared/lib/palette";
import { decText, showDec, type Dec } from "../lib/decimals";

/**
 * Two (or more) decimals with the same whole part as bars on one ruler from
 * that whole number to the next, marked in tenths. The longer bar is the
 * bigger number, whatever the digit count: 0.5's bar is longer than 0.45's.
 *
 * Zoom (round 1, C1-03): when the numbers differ by less than one hundredth
 * (0.45 vs 0.452, 0.5 vs 0.499), a gap of 1 thousandth would be half a pixel
 * on the whole-number ruler. Then the ruler shows only the hundredth (or two)
 * they sit in, marked in thousandths. The bars still start at the whole
 * number: a zigzag cut stands for the part left out, and a caption says the
 * picture is zoomed in.
 */
export function DecimalBars({ rows, w }: { rows: (Dec & { tone: "a" | "b" })[]; w: number }) {
  const WIDTH = 560;
  const PAD = 30;
  const ROW = 34;
  const ts = rows.map((r) => r.t);
  const minT = Math.min(...ts);
  const maxT = Math.max(...ts);
  const zoom = maxT - minT > 0 && maxT - minT < 10;
  const top = zoom ? 34 : 10;
  const axisY = top + rows.length * ROW + 6;
  const HEIGHT = axisY + 30;
  // The ruler's range, in thousandths, and its marks.
  const lo = zoom ? Math.floor(minT / 10) * 10 : w * 1000;
  const hi = zoom ? Math.max(lo + 10, Math.ceil(maxT / 10) * 10) : lo + 1000;
  const step = zoom ? 1 : 100;
  const marks = Math.round((hi - lo) / step);
  // Zoomed: the cut (whole number up to lo) takes the first CUT pixels.
  const CUT = zoom ? 50 : 0;
  const x0 = PAD + CUT;
  const toX = (t: number) => x0 + ((t - lo) / (hi - lo)) * (WIDTH - PAD - x0);
  const isMain = (k: number) => (zoom ? (lo + k * step) % 10 === 0 : k % 10 === 0);
  const label = (k: number) => {
    const t = lo + k * step;
    if (zoom) return isMain(k) ? decText(t, 2) : null;
    return k === 10 ? String(w + 1) : decText(t, k === 0 ? 0 : 1);
  };
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={`Bars for ${rows.map(showDec).join(" and ")} on a ruler from ${zoom ? decText(lo, 2) : w} to ${zoom ? decText(hi, 2) : w + 1}${zoom ? ", zoomed in to thousandths" : ""}`}
      style={{ display: "block", width: "100%", maxWidth: WIDTH, height: "auto", fontFamily: diagramFont }}
    >
      {zoom && (
        <text x={WIDTH / 2} y={16} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: palette.c }}>
          Zoomed in: each small mark is 1 thousandth
        </text>
      )}
      {Array.from({ length: marks + 1 }, (_, k) => (
        <line key={k} x1={toX(lo + k * step)} y1={top - 4} x2={toX(lo + k * step)} y2={axisY} style={{ stroke: palette.grid, strokeWidth: 1 }} />
      ))}
      {rows.map((r, i) => {
        const y = top + i * ROW;
        const color = r.tone === "b" ? palette.b : palette.a;
        const end = toX(r.t);
        // Label inside the bar's end when there's no room after it.
        const inside = end > WIDTH - PAD - 60;
        return (
          <g key={i}>
            <rect x={PAD} y={y} width={Math.max(2, end - PAD)} height={ROW - 10} rx={4} style={{ fill: color }} />
            <text x={inside ? end - 6 : end + 6} y={y + ROW / 2 + 1} textAnchor={inside ? "end" : "start"} style={{ fontSize: 14, fontWeight: 800, fill: inside ? palette.paper : color }}>
              {showDec(r)}
            </text>
          </g>
        );
      })}
      {zoom && (
        // The zigzag cut across the bars and the ruler: the part from the whole number to lo is left out.
        <path
          d={`M ${PAD + CUT / 2 - 6} ${top - 6} ${Array.from({ length: Math.ceil((axisY + 8 - top) / 8) }, (_, j) => `L ${PAD + CUT / 2 + (j % 2 === 0 ? 6 : -6)} ${top - 2 + j * 8}`).join(" ")}`}
          style={{ fill: "none", stroke: palette.paper, strokeWidth: 5 }}
        />
      )}
      <line x1={PAD} y1={axisY} x2={WIDTH - PAD} y2={axisY} style={{ stroke: palette.ink, strokeWidth: 2 }} />
      {zoom && (
        <text x={PAD} y={axisY + 20} textAnchor="middle" style={{ fontSize: 12, fontWeight: 800, fill: palette.ink }}>
          {w}
        </text>
      )}
      {Array.from({ length: marks + 1 }, (_, k) => {
        const main = isMain(k);
        const text = label(k);
        return (
          <g key={k}>
            <line x1={toX(lo + k * step)} y1={axisY - 5} x2={toX(lo + k * step)} y2={axisY + 5} style={{ stroke: palette.ink, strokeWidth: main ? 2 : 1 }} />
            {text !== null && (
              <text x={toX(lo + k * step)} y={axisY + 20} textAnchor="middle" style={{ fontSize: 12, fontWeight: main ? 800 : 400, fill: main ? palette.ink : palette.muted }}>
                {text}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
