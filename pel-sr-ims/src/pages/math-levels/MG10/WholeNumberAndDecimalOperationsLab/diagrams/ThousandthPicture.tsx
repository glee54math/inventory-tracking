import { palette, diagramFont } from "../../../shared/lib/palette";

/**
 * The size of one thousandth (round 1, C1-08): a whole cut into 100
 * hundredths, one hundredth shaded, and that hundredth drawn bigger and cut
 * into 10 thin slivers, one shaded: 10 thousandths make 1 hundredth.
 * Words only in the labels (no slash fractions in SVG text).
 */
export function ThousandthPicture() {
  const WIDTH = 520;
  const HEIGHT = 200;
  const G = 140; // the whole's side
  const gx = 20;
  const gy = 24;
  const cell = G / 10;
  // The shaded hundredth: top-right cell of the whole.
  const hx = gx + 9 * cell;
  const hy = gy;
  const Z = 140; // the zoomed hundredth's side
  const zx = 320;
  const zy = 24;
  const sliver = Z / 10;
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label="One whole cut into 100 hundredths. One hundredth, drawn bigger, is cut into 10 thousandths."
      style={{ display: "block", width: "100%", maxWidth: WIDTH, height: "auto", fontFamily: diagramFont }}
    >
      {/* The whole: 10 by 10 hundredths. */}
      <rect x={hx} y={hy} width={cell} height={cell} style={{ fill: palette.a }} />
      {Array.from({ length: 11 }, (_, k) => (
        <g key={k}>
          <line x1={gx + k * cell} y1={gy} x2={gx + k * cell} y2={gy + G} style={{ stroke: palette.ink, strokeWidth: k % 10 === 0 ? 2 : 0.8 }} />
          <line x1={gx} y1={gy + k * cell} x2={gx + G} y2={gy + k * cell} style={{ stroke: palette.ink, strokeWidth: k % 10 === 0 ? 2 : 0.8 }} />
        </g>
      ))}
      {/* Zoom lines from the small hundredth to the big one. */}
      <line x1={hx + cell} y1={hy} x2={zx} y2={zy} style={{ stroke: palette.muted, strokeWidth: 1, strokeDasharray: "4 4" }} />
      <line x1={hx + cell} y1={hy + cell} x2={zx} y2={zy + Z} style={{ stroke: palette.muted, strokeWidth: 1, strokeDasharray: "4 4" }} />
      {/* The hundredth, bigger, cut into 10 thousandths. */}
      <rect x={zx} y={zy} width={Z} height={Z} style={{ fill: palette.a, opacity: 0.25 }} />
      <rect x={zx} y={zy} width={sliver} height={Z} style={{ fill: palette.b }} />
      {Array.from({ length: 11 }, (_, k) => (
        <line key={k} x1={zx + k * sliver} y1={zy} x2={zx + k * sliver} y2={zy + Z} style={{ stroke: palette.ink, strokeWidth: k % 10 === 0 ? 2 : 0.8 }} />
      ))}
      <line x1={zx} y1={zy} x2={zx + Z} y2={zy} style={{ stroke: palette.ink, strokeWidth: 2 }} />
      <line x1={zx} y1={zy + Z} x2={zx + Z} y2={zy + Z} style={{ stroke: palette.ink, strokeWidth: 2 }} />
      <text x={gx + G / 2} y={14} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800, fill: palette.ink }}>
        1 whole
      </text>
      <text x={gx + G / 2} y={gy + G + 22} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: palette.a }}>
        1 hundredth is shaded
      </text>
      <text x={zx + Z / 2} y={14} textAnchor="middle" style={{ fontSize: 13, fontWeight: 800, fill: palette.a }}>
        1 hundredth, bigger
      </text>
      <text x={zx + Z / 2} y={zy + Z + 22} textAnchor="middle" style={{ fontSize: 13, fontWeight: 700, fill: palette.b }}>
        1 thousandth is shaded
      </text>
    </svg>
  );
}
