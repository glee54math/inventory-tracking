import { palette, diagramFont } from "../../../shared/lib/palette";

const COLS = 5;
const CELL = 36;
const R = 13;
const PAD = 20;
const GAP_BETWEEN_PARTS = 14; // extra horizontal gap right where part A ends and part B begins

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

export interface SplitGroupProps {
  /** Total objects shown. Must equal partA + partB. */
  total: number;
  /** How many of `total` render in `toneA`, starting from the first one. */
  partA: number;
  toneA?: "a" | "b" | "c";
  toneB?: "a" | "b" | "c";
  /** Draws a short dashed divider between the two parts — on by default,
   *  since most uses of this diagram are specifically about the SPLIT (a
   *  put-together/take-apart scene or a decomposition), not just a tinted
   *  group. Turn off for a plain two-tone row with no visual seam. */
  showDivider?: boolean;
}

/** One group of objects shown as a single row/wrap, with the first `partA`
 *  objects in one tone and the rest in a second tone — the concrete stand-in
 *  for "put together" (two groups joining into one), "take apart"
 *  (one group splitting into two), and decomposing a number into two parts.
 *  New for this lab: MK1's CounterGroup/TenGroups only ever render ONE tone
 *  for a whole group, so a visibly two-toned single group needed its own
 *  diagram rather than reusing those as-is. */
export function SplitGroup({ total, partA, toneA = "a", toneB = "b", showDivider = true }: SplitGroupProps) {
  const n = Math.max(0, Math.round(total));
  const a = Math.max(0, Math.min(n, Math.round(partA)));
  const b = n - a;
  const cols = Math.min(COLS, Math.max(1, n));
  const rows = Math.max(1, Math.ceil(n / cols));
  const width = cols * CELL + PAD * 2 + (showDivider && a > 0 && b > 0 ? GAP_BETWEEN_PARTS : 0);
  const height = rows * CELL + PAD * 2;

  const colorA = toneColor(toneA);
  const colorB = toneColor(toneB);

  const extraShift = (i: number) => (showDivider && a > 0 && b > 0 && i >= a ? GAP_BETWEEN_PARTS : 0);

  const dividerCol = a % cols;
  const dividerRow = Math.floor(a / cols);
  const dividerX = PAD + dividerCol * CELL + (showDivider && a > 0 && b > 0 ? GAP_BETWEEN_PARTS / 2 : 0);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${n} objects split into a group of ${a} and a group of ${b}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {n === 0 && (
        <text x={width / 2} y={height / 2 + 5} textAnchor="middle" fontSize={14} fill={palette.muted}>
          (none)
        </text>
      )}
      {Array.from({ length: n }, (_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = PAD + col * CELL + CELL / 2 + extraShift(i);
        const y = PAD + row * CELL + CELL / 2;
        const inA = i < a;
        return <circle key={i} cx={x} cy={y} r={R} fill={inA ? colorA : colorB} stroke={palette.paper} strokeWidth={2} />;
      })}
      {showDivider && a > 0 && b > 0 && n <= cols && (
        <line x1={dividerX} y1={PAD - 4} x2={dividerX} y2={height - PAD + 4} stroke={palette.line} strokeWidth={2} strokeDasharray="4 4" />
      )}
      {showDivider && a > 0 && b > 0 && n > cols && dividerCol > 0 && (
        <line
          x1={dividerX}
          y1={PAD + dividerRow * CELL - 4}
          x2={dividerX}
          y2={PAD + dividerRow * CELL + CELL + 4}
          stroke={palette.line}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      )}
    </svg>
  );
}
