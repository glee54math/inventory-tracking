import { palette, diagramFont } from "../../../shared/lib/palette";
import type { Tone } from "./TenFrame";

const toneColor = (tone?: Tone) => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

const R = 10;
const GAP = 6;
const LABEL_W = 64;
const ROW_H = 2 * R + 14;
const PAD = 8;

export interface CompareRowsProps {
  rows: [{ label: string; count: number; tone?: Tone }, { label: string; count: number; tone?: Tone }];
  /**
   * Ring the counters in the longer row that have no partner in the other
   * row — the gap a compare story asks about. The help ladder turns this on
   * when a student is stuck.
   */
  showGap?: boolean;
}

/**
 * Two rows of counters lined up one-to-one, so "how many more?" is something
 * a student can see: match them up, then count the extras. (Two separate
 * ten-frames side by side don't line up, so the gap is hard to see.)
 */
export function CompareRows({ rows, showGap }: CompareRowsProps) {
  const longest = Math.max(rows[0].count, rows[1].count, 1);
  const shorter = Math.min(rows[0].count, rows[1].count);
  const width = PAD * 2 + LABEL_W + longest * (2 * R + GAP);
  const height = PAD * 2 + ROW_H * 2 + (showGap ? 18 : 0);
  const cx = (i: number) => PAD + LABEL_W + R + i * (2 * R + GAP);
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${rows[0].label} has ${rows[0].count}, ${rows[1].label} has ${rows[1].count}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {rows.map((row, r) => {
        const cy = PAD + r * ROW_H + R + 4;
        return (
          <g key={r}>
            <text x={PAD} y={cy + 5} fontSize={14} fontWeight={700} style={{ fill: toneColor(row.tone) }}>
              {row.label}
            </text>
            {Array.from({ length: row.count }, (_, i) => {
              const extra = showGap && i >= shorter;
              return (
                <g key={i}>
                  <circle cx={cx(i)} cy={cy} r={R} style={{ fill: toneColor(row.tone) }} />
                  {extra && <circle cx={cx(i)} cy={cy} r={R + 3} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2, strokeDasharray: "4 3" }} />}
                </g>
              );
            })}
          </g>
        );
      })}
      {showGap && rows[0].count !== rows[1].count && (
        <text x={(cx(shorter) + cx(longest - 1)) / 2} y={height - PAD} textAnchor="middle" fontSize={13} fontWeight={700} style={{ fill: palette.ink }}>
          extra
        </text>
      )}
    </svg>
  );
}
