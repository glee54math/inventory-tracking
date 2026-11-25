import { palette, diagramFont } from "../../../shared/lib/palette";
import { useCountAlong } from "./timing";

const COLS = 5;
const CELL = 36;
const R = 13;
const PAD = 20;

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/** How wide a SplitGroup of `dots` dots draws, so a wrapper can fit it. */
export const splitGroupWidth = (dots: number) => Math.min(COLS, Math.max(1, dots)) * CELL + PAD * 2;

export interface SplitCount {
  /** Index of the first dot to number. Default 0. */
  from?: number;
  /** The number before the first label: 0 counts 1, 2, 3; 5 counts on 6, 7. */
  base?: number;
  /** How many dots get a number, one per second. */
  items: number;
}

export interface SplitGroupProps {
  /** Total objects shown. Must equal partA + partB. */
  total: number;
  /** How many of `total` render in `toneA`, starting from the first one. */
  partA: number;
  toneA?: "a" | "b" | "c";
  toneB?: "a" | "b" | "c";
  /** Marks where the parts meet. Dots stay in their columns either way. */
  showDivider?: boolean;
  /** Draw all of part B faded with a dashed outline: "these went away". */
  goneB?: boolean;
  /** Draw all of part A faded with a dashed outline: the known part taken away. */
  goneA?: boolean;
  /** Fade this many dots, counted from the last one (a take-away as it happens). */
  goneCount?: number;
  /** Draw only part A and one "?" box: the other part is what's asked. */
  unknownB?: boolean;
  /** Ring part B, to point at it after a wrong try. Prints no number. */
  ringB?: boolean;
  /** Number these dots at once (for a demo driven from outside). */
  numbered?: SplitCount;
  /** Number these dots one per second (a "Show me" count-along). */
  countAlong?: SplitCount;
}

/** One group of objects in rows of 5, the first `partA` in one tone and the
 *  rest in a second tone: the picture for put together, take away and
 *  breaking a number apart. Dots keep fixed columns, so rows of 5 line up. */
export function SplitGroup({ total, partA, toneA = "a", toneB = "b", showDivider = true, goneB = false, goneA = false, goneCount = 0, unknownB = false, ringB = false, numbered, countAlong }: SplitGroupProps) {
  const n = Math.max(0, Math.round(total));
  const a = Math.max(0, Math.min(n, Math.round(partA)));
  const b = n - a;
  const counted = useCountAlong(!!countAlong, countAlong?.items ?? 0);
  const label = countAlong ? { from: countAlong.from ?? 0, base: countAlong.base ?? 0, items: counted } : numbered ? { from: numbered.from ?? 0, base: numbered.base ?? 0, items: numbered.items } : null;

  // With a "?" box the picture is sized by what it shows, so it can't give away the total.
  const slots = unknownB ? a + 1 : n;
  const cols = Math.min(COLS, Math.max(1, slots));
  const rows = Math.max(1, Math.ceil(slots / cols));
  const width = cols * CELL + PAD * 2;
  const height = rows * CELL + PAD * 2;
  const dots = unknownB ? a : n;

  const colorA = toneColor(toneA);
  const colorB = toneColor(toneB);
  const center = (i: number) => ({ x: PAD + (i % cols) * CELL + CELL / 2, y: PAD + Math.floor(i / cols) * CELL + CELL / 2 });

  const split = showDivider && !unknownB && a > 0 && b > 0;
  const splitCol = a % cols;
  const splitRow = Math.floor(a / cols);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={unknownB ? `${a} dots and a question mark` : goneB || goneA || goneCount > 0 ? `${n} dots. Some went away.` : `${n} dots: ${a} and ${b}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {slots === 0 && (
        <text x={width / 2} y={height / 2 + 5} textAnchor="middle" fontSize={14} fill={palette.muted}>
          (none)
        </text>
      )}
      {Array.from({ length: dots }, (_, i) => {
        const { x, y } = center(i);
        const inA = i < a;
        const gone = (!inA && goneB) || (inA && goneA) || i >= n - goneCount;
        const color = inA ? colorA : colorB;
        const showLabel = !!label && i >= label.from && i < label.from + label.items;
        return (
          <g key={i}>
            {gone ? (
              <circle cx={x} cy={y} r={R} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={2} strokeDasharray="3 3" />
            ) : (
              <circle cx={x} cy={y} r={R} fill={color} stroke={palette.paper} strokeWidth={2} />
            )}
            {ringB && !inA && <circle cx={x} cy={y} r={R + 3} fill="none" stroke={palette.c} strokeWidth={3} />}
            {showLabel && label && (
              <text x={x} y={y + 5} textAnchor="middle" fontSize={14} fontWeight={800} fill={gone ? palette.ink : "#ffffff"}>
                {label.base + (i - label.from) + 1}
              </text>
            )}
          </g>
        );
      })}
      {unknownB &&
        (() => {
          const { x, y } = center(a);
          return (
            <g>
              <rect x={x - R - 1} y={y - R - 1} width={2 * R + 2} height={2 * R + 2} rx={7} fill="none" stroke={colorB} strokeWidth={2.5} strokeDasharray="4 3" />
              <text x={x} y={y + 6} textAnchor="middle" fontSize={18} fontWeight={800} fill={colorB}>
                ?
              </text>
            </g>
          );
        })()}
      {split && splitCol > 0 && (
        <line
          x1={PAD + splitCol * CELL}
          y1={PAD + splitRow * CELL + 1}
          x2={PAD + splitCol * CELL}
          y2={PAD + splitRow * CELL + CELL - 1}
          stroke={palette.line}
          strokeWidth={2}
          strokeDasharray="4 4"
        />
      )}
      {split && splitCol === 0 && (
        <line x1={PAD} y1={PAD + splitRow * CELL} x2={PAD + cols * CELL} y2={PAD + splitRow * CELL} stroke={palette.line} strokeWidth={2} strokeDasharray="4 4" />
      )}
    </svg>
  );
}
