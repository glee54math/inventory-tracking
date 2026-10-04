import React from "react";
import { palette } from "../lib/palette";
import { fmt } from "../lib/math";

export interface RatioTableColumn {
  label: string;
  color: string;
}

export interface RatioTableCell {
  value?: number | string;
  /** Show a "?" placeholder. */
  missing?: boolean;
  highlight?: boolean;
  /** Render a text input instead of a value. */
  editable?: { value: string; onChange: (v: string) => void; status?: "right" | "wrong" | null; ariaLabel?: string };
}

export interface RatioTableProps {
  columns: RatioTableColumn[];
  rows: RatioTableCell[][];
  /**
   * Show "×k" next to each row, comparing it with row 0. Pass the multipliers
   * (index-matched to rows; null hides one).
   */
  scales?: (number | null)[];
  compact?: boolean;
}

/** Table of equivalent ratios. Styling is inline so it survives any CSS setup. */
export function RatioTable({ columns, rows, scales, compact = false }: RatioTableProps) {
  const pad = compact ? "6px 10px" : "9px 14px";
  const th: React.CSSProperties = {
    padding: pad,
    fontWeight: 700,
    fontSize: 14,
    textAlign: "center",
    borderBottom: `3px solid`,
    whiteSpace: "nowrap",
  };
  const td: React.CSSProperties = {
    padding: pad,
    textAlign: "center",
    fontSize: 17,
    fontWeight: 600,
    fontVariantNumeric: "tabular-nums",
    borderBottom: `1px solid ${palette.line}`,
    color: palette.ink,
    minWidth: 64,
  };

  const renderCell = (c: RatioTableCell, key: number) => {
    const style: React.CSSProperties = {
      ...td,
      background: c.highlight ? palette.cSoft : "transparent",
      transition: "background .3s",
    };
    if (c.editable) {
      const st = c.editable.status;
      return (
        <td key={key} style={style}>
          <input
            inputMode="decimal"
            value={c.editable.value}
            aria-label={c.editable.ariaLabel ?? "missing value"}
            onChange={(e) => c.editable!.onChange(e.target.value)}
            style={{
              width: 64,
              font: "inherit",
              fontSize: 16,
              textAlign: "center",
              padding: "4px 6px",
              borderRadius: 8,
              border: `2px solid ${st === "right" ? palette.good : st === "wrong" ? palette.bad : palette.line}`,
              background: st === "right" ? palette.goodSoft : palette.paper,
              color: palette.ink,
            }}
          />
        </td>
      );
    }
    return (
      <td key={key} style={{ ...style, color: c.missing ? palette.bad : palette.ink }}>
        {c.missing ? "?" : typeof c.value === "number" ? fmt(c.value) : c.value}
      </td>
    );
  };

  return (
    <div style={{ overflowX: "auto", maxWidth: "100%" }}>
      <table style={{ borderCollapse: "collapse", margin: "0 auto", fontFamily: "inherit" }}>
        <thead>
          <tr>
            {columns.map((c, i) => (
              <th key={i} style={{ ...th, color: c.color, borderBottomColor: c.color }}>
                {c.label}
              </th>
            ))}
            {scales && <th style={{ ...th, borderBottomColor: "transparent" }} aria-hidden />}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, r) => (
            <tr key={r}>
              {row.map(renderCell)}
              {scales && (
                <td style={{ ...td, borderBottom: "none", color: palette.c, fontSize: 14, minWidth: 40, textAlign: "left" }}>
                  {scales[r] !== null && scales[r] !== undefined && r > 0 ? `×${fmt(scales[r] as number)}` : ""}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
