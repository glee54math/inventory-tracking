import type { CSSProperties } from "react";

// ============================================================================
// GroupStrip — the picture for a division with a remainder (Unit 4): one
// solid box per FULL group (labelled with the group size), then one dashed
// box for the partial group, filled only part-way (leftover / groupSize).
// Plain wrapping HTML (flex-wrap) rather than SVG, so 30+ groups simply flow
// onto a second row instead of clipping against a fixed viewBox.
//
// `highlight` is how the three remainder framings LOOK different on the same
// numbers: "full" lights up only the full boxes (drop the remainder),
// "needed" lights up every box including the partial one (round up), "left"
// lights up only the partial box (the remainder is the answer).
// Lab-local: shared/diagrams/ has nothing for grouped-with-leftover counts
// (MG7 DivisionAndWordProblemsLab's EqualGroups draws every object as a dot,
// which doesn't scale to this unit's 3-digit dividends).
// ============================================================================

export type StripHighlight = "full" | "needed" | "left" | null;

export interface GroupStripProps {
  groupSize: number;
  fullGroups: number;
  leftover: number;
  highlight?: StripHighlight;
  /** Show the size number inside each box and the caption. Default true. */
  showCounts?: boolean;
  /** Singular/plural word for one group, e.g. ["box", "boxes"]. */
  groupWord?: [string, string];
}

const BOX = 40;

export function GroupStrip({ groupSize, fullGroups, leftover, highlight = null, showCounts = true, groupWord = ["group", "groups"] }: GroupStripProps) {
  const fullOn = highlight === "full" || highlight === "needed";
  const partOn = highlight === "left" || highlight === "needed";
  const boxStyle = (on: boolean): CSSProperties => ({
    width: BOX,
    height: BOX,
    borderRadius: 6,
    border: `2px solid ${on ? "var(--good)" : "var(--qa)"}`,
    background: on ? "var(--good-soft)" : "var(--qa-soft)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
    fontSize: 14,
    color: "var(--ink)",
  });
  const fillPct = Math.round((100 * leftover) / Math.max(1, groupSize));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }} role="img" aria-label={`${fullGroups} full ${groupWord[1]} of ${groupSize}, and ${leftover} left over`}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: 520 }}>
        {Array.from({ length: fullGroups }, (_, i) => (
          <span key={i} style={boxStyle(fullOn)}>
            {showCounts ? groupSize : ""}
          </span>
        ))}
        {leftover > 0 && (
          <span
            style={{
              position: "relative",
              width: BOX,
              height: BOX,
              borderRadius: 6,
              border: `2px dashed ${partOn ? "var(--good)" : "var(--qb)"}`,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: 0,
                bottom: 0,
                width: "100%",
                height: `${fillPct}%`,
                background: partOn ? "var(--good-soft)" : "var(--qb-soft)",
              }}
            />
            <span style={{ position: "relative", fontWeight: 700, fontSize: 14, color: "var(--qb-text)" }}>{showCounts ? leftover : ""}</span>
          </span>
        )}
      </div>
      {showCounts && (
        <span className="muted small">
          {fullGroups} full {fullGroups === 1 ? groupWord[0] : groupWord[1]} of {groupSize}
          {leftover > 0 ? `, plus ${leftover} left over (not enough for another full ${groupWord[0]})` : ", nothing left over"}
        </span>
      )}
    </div>
  );
}
