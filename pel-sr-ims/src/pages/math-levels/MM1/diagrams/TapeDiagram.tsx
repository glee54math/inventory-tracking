import React from "react";
import { palette } from "../../shared/lib/palette";

export interface TapeRow {
  label: string;
  /** Number of equal-size units in the tape. */
  units: number;
  color: string;
  softColor?: string;
  /** Text inside each unit (index-matched). null/undefined leaves a unit blank. */
  values?: (string | number | null | undefined)[];
  /** Units from the left that are drawn solid; the rest are drawn soft. Default: all solid. */
  shaded?: number;
  /** Bracket label under the whole tape, e.g. "24 cups". */
  total?: string;
  /** Index of a unit to outline strongly (e.g. "one unit"). */
  highlightUnit?: number | null;
}

export interface TapeDiagramProps {
  tapes: TapeRow[];
  /** Width of one unit. Equal across tapes so units line up for comparison. */
  unitWidth?: number;
  unitHeight?: number;
  labelWidth?: number;
  ariaLabel?: string;
}

/** Tape (bar/strip) diagram. All tapes share one unit size, which is what makes ratios visible. */
export function TapeDiagram({ tapes, unitWidth, unitHeight = 40, labelWidth = 92, ariaLabel }: TapeDiagramProps) {
  const maxUnits = Math.max(...tapes.map((t) => t.units), 1);
  const uw = unitWidth ?? Math.max(26, Math.min(64, 460 / maxUnits));
  const rowGap = 14;
  const hasTotals = tapes.some((t) => t.total);
  const bracketH = hasTotals ? 30 : 0;
  const rowH = unitHeight + bracketH + rowGap;
  const width = labelWidth + maxUnits * uw + 8;
  const height = tapes.length * rowH - rowGap + 4;
  const fontSize = Math.min(15, uw * 0.42);

  return (
    <svg
      viewBox={`0 -2 ${width} ${height}`}
      width="100%"
      style={{ maxWidth: width, display: "block", margin: "0 auto", overflow: "visible" }}
      role="img"
      aria-label={ariaLabel ?? tapes.map((t) => `${t.label}: ${t.units} units`).join("; ")}
    >
      {tapes.map((t, r) => {
        const y = r * rowH;
        const shaded = t.shaded ?? t.units;
        return (
          <g key={r}>
            <text x={labelWidth - 10} y={y + unitHeight / 2 + 5} textAnchor="end" style={{ fill: t.color, fontWeight: 700, fontSize: 14 }}>
              {t.label}
            </text>
            {Array.from({ length: t.units }, (_, i) => {
              const x = labelWidth + i * uw;
              const solid = i < shaded;
              const hl = t.highlightUnit === i;
              const v = t.values?.[i];
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={y}
                    width={uw}
                    height={unitHeight}
                    style={{
                      fill: solid ? t.color : t.softColor ?? palette.paper,
                      stroke: hl ? palette.ink : palette.paper,
                      strokeWidth: hl ? 3 : 2,
                      transition: "fill .3s",
                    }}
                    rx={3}
                  />
                  {v !== null && v !== undefined && v !== "" && (
                    <text
                      x={x + uw / 2}
                      y={y + unitHeight / 2 + fontSize * 0.36}
                      textAnchor="middle"
                      style={{ fill: solid ? "var(--on-q, #fff)" : palette.ink, fontWeight: 700, fontSize }}
                    >
                      {v}
                    </text>
                  )}
                </g>
              );
            })}
            {/* outline of whole tape */}
            <rect x={labelWidth} y={y} width={t.units * uw} height={unitHeight} rx={3} style={{ fill: "none", stroke: t.color, strokeWidth: 1.5 }} />
            {t.total && (
              <g>
                <path
                  d={`M ${labelWidth + 2} ${y + unitHeight + 6} v 6 H ${labelWidth + t.units * uw - 2} v -6 M ${labelWidth + (t.units * uw) / 2} ${y + unitHeight + 12} v 5`}
                  style={{ fill: "none", stroke: palette.muted, strokeWidth: 1.5 }}
                />
                <text x={labelWidth + (t.units * uw) / 2} y={y + unitHeight + 30} textAnchor="middle" style={{ fill: palette.ink, fontWeight: 700, fontSize: 14 }}>
                  {t.total}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
