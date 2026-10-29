import { palette, diagramFont } from "../../../shared/lib/palette";

const BLOCK_W = 46;
const BLOCK_H = 56;
const DOT_R = 6;
const GAP = 10;
const PER_ROW = 5; // blocks of ten per row before wrapping

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/** One bundled "ten" — 2 rows of 5 dots, same shape every time so a student
 *  can learn to recognize "a ten" as a unit rather than recounting it. */
function TenBlock({ x, y, color }: { x: number; y: number; color: string }) {
  const dots = Array.from({ length: 10 }, (_, i) => ({
    cx: x + (i % 5) * (BLOCK_W / 4) ,
    cy: y + Math.floor(i / 5) * (BLOCK_H / 2),
  }));
  return (
    <g>
      <rect x={x - DOT_R - 4} y={y - DOT_R - 4} width={BLOCK_W} height={BLOCK_H - 8} rx={8} fill="none" stroke={palette.line} strokeWidth={1.5} strokeDasharray="3 3" />
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={DOT_R} fill={color} stroke={palette.paper} strokeWidth={1.5} />
      ))}
    </g>
  );
}

export interface TenGroupsProps {
  /** 0-100. Values above 100 are clamped — nothing in this lab counts that high. */
  value: number;
  tone?: "a" | "b" | "c";
}

/** A count shown as bundled groups of ten (the standard 2-row-of-5 "ten
 *  frame" shape) plus loose ones — the concrete stand-in for any count up
 *  to 100, so "count by tens" and "a number in the 20s/30s/..." are always
 *  backed by actual objects, never a bare numeral on its own. */
export function TenGroups({ value, tone }: TenGroupsProps) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const tens = Math.floor(v / 10);
  const ones = v % 10;
  const color = toneColor(tone);

  const rows = Math.max(1, Math.ceil(tens / PER_ROW));
  const width = Math.max(BLOCK_W * Math.min(tens, PER_ROW) + GAP * (Math.min(tens, PER_ROW) - 1) + 40, ones > 0 ? 220 : 120, 160);
  const height = rows * (BLOCK_H + GAP) + (ones > 0 ? BLOCK_H : 0) + 20;

  const tenPositions = Array.from({ length: tens }, (_, i) => {
    const row = Math.floor(i / PER_ROW);
    const col = i % PER_ROW;
    return { x: 20 + col * (BLOCK_W + GAP), y: 20 + row * (BLOCK_H + GAP) };
  });
  const onesY = 20 + rows * (BLOCK_H + GAP);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${v} shown as ${tens} group${tens === 1 ? "" : "s"} of ten${ones ? ` and ${ones} more` : ""}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {tenPositions.map((p, i) => (
        <TenBlock key={i} x={p.x} y={p.y} color={color} />
      ))}
      {ones > 0 &&
        Array.from({ length: ones }, (_, i) => (
          <circle key={`one-${i}`} cx={20 + i * (BLOCK_W / 4)} cy={onesY} r={DOT_R} fill={color} stroke={palette.paper} strokeWidth={1.5} />
        ))}
      {v === 0 && (
        <text x={width / 2} y={height / 2 + 5} textAnchor="middle" fontSize={14} fill={palette.muted}>
          (none)
        </text>
      )}
    </svg>
  );
}
