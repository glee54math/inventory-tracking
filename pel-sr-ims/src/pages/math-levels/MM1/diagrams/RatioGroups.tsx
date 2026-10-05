import React from "react";
import { Shape, type ShapeKind } from "./Shape";
import { palette } from "../lib/palette";

export interface Quantity {
  /** How many of this item are in ONE group. */
  count: number;
  kind: ShapeKind;
  color: string;
  label: string;
}

export interface RatioGroupsProps {
  /** Number of identical groups to draw. */
  groups: number;
  a: Quantity;
  b: Quantity;
  /** Draw a dashed box around each group ("for every ... there are ..."). */
  boxed?: boolean;
  /** Emphasize one quantity (others fade), or null for none. */
  focus?: "a" | "b" | null;
  /** Index of a group to highlight, e.g. 0 to show "one group". */
  highlightGroup?: number | null;
  /** Show the per-group count labels under each box. */
  showGroupLabels?: boolean;
  /** Maximum width in SVG units before groups wrap to a new row. */
  maxWidth?: number;
  cell?: number;
  ariaLabel?: string;
}

/**
 * Draws `groups` copies of a group that contains `a.count` A-shapes over `b.count` B-shapes.
 * Totals are a.count*groups and b.count*groups, so the picture shows why the totals ratio
 * is equivalent to the per-group ratio.
 */
export function RatioGroups({
  groups,
  a,
  b,
  boxed = true,
  focus = null,
  highlightGroup = null,
  showGroupLabels = false,
  maxWidth = 560,
  cell = 40,
  ariaLabel,
}: RatioGroupsProps) {
  const pad = 10;
  const gap = 14;
  const perRow = Math.max(a.count, b.count, 1);
  const boxW = perRow * cell + pad * 2;
  const rowsInside = (a.count > 0 ? 1 : 0) + (b.count > 0 ? 1 : 0);
  const labelH = showGroupLabels ? 18 : 0;
  const boxH = Math.max(rowsInside, 1) * cell + pad * 2 + labelH;
  const cols = Math.max(1, Math.min(groups, Math.floor((maxWidth + gap) / (boxW + gap))));
  const rows = Math.ceil(groups / cols);
  const width = cols * boxW + (cols - 1) * gap + 4;
  const height = rows * boxH + (rows - 1) * gap + 4;

  // 0.45, not lower: this is the only de-emphasis value in the diagrams folder that was
  // aggressive enough to make the non-focused shapes read as washed-out rather than
  // "secondary but still visible" (every other opacity used for a similar effect
  // elsewhere in this package sits between 0.55 and 0.75).
  const fade = (which: "a" | "b") => (focus && focus !== which ? 0.45 : 1);

  return (
    <svg
      viewBox={`-2 -2 ${width} ${height}`}
      width="100%"
      style={{ maxWidth: width, display: "block", margin: "0 auto", overflow: "visible" }}
      role="img"
      aria-label={ariaLabel ?? `${groups} groups, each with ${a.count} ${a.label} and ${b.count} ${b.label}`}
    >
      {Array.from({ length: groups }, (_, g) => {
        const col = g % cols;
        const row = Math.floor(g / cols);
        const x = col * (boxW + gap);
        const y = row * (boxH + gap);
        const hl = highlightGroup === g;
        const dim = highlightGroup !== null && highlightGroup !== undefined && !hl;
        let r = 0;
        return (
          <g key={g} style={{ opacity: dim ? 0.35 : 1, transition: "opacity .3s" }}>
            {boxed && (
              <rect
                x={x}
                y={y}
                width={boxW}
                height={boxH}
                rx={10}
                style={{
                  fill: hl ? palette.cSoft : "transparent",
                  stroke: hl ? palette.c : palette.line,
                  strokeWidth: hl ? 2.5 : 1.5,
                  strokeDasharray: hl ? "none" : "5 4",
                }}
              />
            )}
            {a.count > 0 &&
              (() => {
                const cy = y + pad + cell / 2 + r++ * cell;
                return Array.from({ length: a.count }, (_, i) => (
                  <Shape key={"a" + i} kind={a.kind} cx={x + pad + cell / 2 + i * cell} cy={cy} size={cell * 0.78} fill={a.color} opacity={fade("a")} />
                ));
              })()}
            {b.count > 0 &&
              (() => {
                const cy = y + pad + cell / 2 + r++ * cell;
                return Array.from({ length: b.count }, (_, i) => (
                  <Shape key={"b" + i} kind={b.kind} cx={x + pad + cell / 2 + i * cell} cy={cy} size={cell * 0.78} fill={b.color} opacity={fade("b")} />
                ));
              })()}
            {showGroupLabels && (
              <text x={x + boxW / 2} y={y + boxH - 7} textAnchor="middle" style={{ fill: palette.muted, fontSize: 12, fontWeight: 600 }}>
                {a.count} : {b.count}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
