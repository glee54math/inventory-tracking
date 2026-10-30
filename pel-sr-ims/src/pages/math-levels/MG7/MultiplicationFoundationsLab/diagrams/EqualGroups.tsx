import { palette } from "../../../shared/lib/palette";

export interface EqualGroupsProps {
  /** How many groups. */
  groups: number;
  /** How many items in each group — every group is the same size (that's the point). */
  size: number;
  tone?: "a" | "b" | "c";
  /**
   * Only draw this many groups filled-in; the rest render as faint outlines.
   * Used by `Problem.visual(done)` for progressive reveal as steps complete.
   * Defaults to `groups` (everything shown).
   */
  revealGroups?: number;
  /** Shows "= total" after the caption once every group is revealed. */
  showTotal?: boolean;
  /** Overrides the default "{n} groups of {size}" caption entirely. */
  caption?: string;
  /** Hides the caption line altogether (e.g. when the surrounding prompt already says it). */
  hideCaption?: boolean;
}

/**
 * A row-of-groups picture: `groups` little boxes, each holding the same
 * `size` dots — the concrete model for "equal groups" multiplication
 * (3.OA.1). Deliberately NOT the same shape as a rectangular array
 * (FactorRectangle, shared/diagrams/) — groups are visually separate boxes
 * with gaps between them, not one continuous grid, since the whole point of
 * this unit is that "3 groups of 4" and "4 groups of 3" are different
 * PICTURES even though they're the same product. No existing diagram in
 * shared/diagrams/ or any other lab's own diagrams/ shows literal equal
 * groups for multiplication (MK1's CounterGroup is a single ungrouped
 * count; this is lab-local, first consumer, not promoted this round).
 */
export function EqualGroups({ groups, size, tone = "a", revealGroups, showTotal = false, caption, hideCaption = false }: EqualGroupsProps) {
  const shown = Math.min(revealGroups ?? groups, groups);
  const fill = tone === "a" ? palette.a : tone === "b" ? palette.b : palette.c;
  const soft = tone === "a" ? palette.aSoft : tone === "b" ? palette.bSoft : palette.cSoft;
  const cols = Math.min(3, size);

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", maxWidth: 380 }} role="img" aria-label={caption ?? `${groups} groups of ${size}`}>
        {Array.from({ length: groups }, (_, g) => {
          const filled = g < shown;
          return (
            <div
              key={g}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gap: 3,
                padding: 7,
                borderRadius: 10,
                border: `2px solid ${filled ? fill : palette.line}`,
                background: filled ? soft : "transparent",
                opacity: filled ? 1 : 0.35,
                minWidth: 10 * cols + 14,
              }}
              aria-hidden
            >
              {Array.from({ length: size }, (_, d) => (
                <span
                  key={d}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: filled ? fill : palette.line,
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>
      {!hideCaption && (
        <p className="muted small" style={{ margin: 0 }}>
          {caption ?? `${shown} group${shown === 1 ? "" : "s"} of ${size}${showTotal && shown === groups ? ` = ${groups * size}` : ""}`}
        </p>
      )}
    </div>
  );
}
