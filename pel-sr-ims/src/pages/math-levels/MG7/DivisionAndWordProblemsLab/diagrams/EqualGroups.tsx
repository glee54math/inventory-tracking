import React from "react";

// ============================================================================
// EqualGroups — the shared visual model for this whole lab's Unit 1 (and
// reused by Units 2/4/5): equal-GROUPS situations ("boxes" layout, clusters
// of icons in bordered bags) and arrays/area situations ("grid" layout, a
// true rows x columns rectangle, e.g. chairs in rows). Division's two
// genuinely different unknowns map onto the SAME picture two ways: whichever
// of `groups`/size the caption blanks out with "?" is the unknown being
// solved for — the dots themselves are always fully drawn (the concrete
// model a first-time learner needs), only the NUMBER LABEL is ever hidden.
// No existing shared/diagrams/ component shows a literal countable group of
// objects (that convention lives in MK1/MK2's lab-local CounterGroup/
// ObjectGroup instead — see MATH_TSX_STYLE_GUIDE.txt section 10), so this is
// a new lab-local diagram, not a promotion of anything existing.
// ============================================================================

export type EqualGroupsLayout = "boxes" | "grid" | "pool";

export interface EqualGroupsProps {
  /** Total number of objects — always groups * size (+ leftover, if any). */
  total: number;
  /** Number of groups (boxes layout) or rows (grid layout). Omit for "pool". */
  groups?: number;
  /**
   * "boxes": equal-groups situation, one bordered cluster per group.
   * "grid": array/area situation, a true rows x columns rectangle (no
   *         borders between cells — one continuous array, like chairs).
   * "pool": no grouping at all yet — a single loose cluster of `total`
   *         icons, used as the "before" picture when the problem hasn't
   *         revealed how the objects are grouped.
   */
  layout?: EqualGroupsLayout;
  icon?: string;
  tone?: "a" | "b" | "c";
  /** Objects that don't fit evenly into a group — rendered in a separate
   *  dashed "left over" tray. Used by Unit 2's "why doesn't 25 ÷ 4 have a
   *  whole-number partner" reasoning bucket. */
  leftover?: number;
  /** Show the "{groups} groups/rows" half of the caption. Default true. */
  revealGroups?: boolean;
  /** Show the "{size} each/per row" half of the caption. Default true. */
  revealSize?: boolean;
  /** Word for one group, e.g. "bag", "row". Default "group". */
  groupWord?: string;
  /** Word for one item, e.g. "cookie", "chair". Default "item". */
  itemWord?: string;
}

const toneBg: Record<"a" | "b" | "c", string> = { a: "var(--qa)", b: "var(--qb)", c: "var(--qc)" };

function Dot({ icon, tone }: { icon?: string; tone: "a" | "b" | "c" }) {
  if (icon) return <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>;
  return (
    <span
      style={{
        display: "inline-block",
        width: 16,
        height: 16,
        borderRadius: "50%",
        background: toneBg[tone],
      }}
    />
  );
}

export function EqualGroups({
  total,
  groups,
  layout = groups ? "boxes" : "pool",
  icon,
  tone = "a",
  leftover = 0,
  revealGroups = true,
  revealSize = true,
  groupWord = "group",
  itemWord = "item",
}: EqualGroupsProps) {
  const groupCount = groups ?? 1;
  const perGroup = Math.floor((total - leftover) / Math.max(1, groupCount));

  const captionGroups = revealGroups ? String(groupCount) : "?";
  const captionSize = revealSize ? String(perGroup) : "?";

  let body: React.ReactNode;
  if (layout === "pool") {
    body = (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxWidth: 320, justifyContent: "center" }}>
        {Array.from({ length: total }, (_, i) => <Dot key={i} icon={icon} tone={tone} />)}
      </div>
    );
  } else if (layout === "grid") {
    body = (
      <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
        {Array.from({ length: groupCount }, (_, r) => (
          <div key={r} style={{ display: "flex", gap: 4 }}>
            {Array.from({ length: perGroup }, (_, c) => <Dot key={c} icon={icon} tone={tone} />)}
          </div>
        ))}
      </div>
    );
  } else {
    body = (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
        {Array.from({ length: groupCount }, (_, g) => (
          <div
            key={g}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              padding: 8,
              borderRadius: 10,
              border: `2px solid ${toneBg[tone]}`,
              background: "var(--card)",
              minWidth: 40,
              justifyContent: "center",
              alignContent: "center",
            }}
          >
            {Array.from({ length: perGroup }, (_, i) => <Dot key={i} icon={icon} tone={tone} />)}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
      {body}
      {leftover > 0 && (
        <div
          style={{
            display: "flex",
            gap: 4,
            padding: 8,
            borderRadius: 10,
            border: "2px dashed var(--muted)",
            background: "var(--card)",
          }}
        >
          {Array.from({ length: leftover }, (_, i) => <Dot key={i} icon={icon} tone={tone} />)}
        </div>
      )}
      {leftover > 0 && <p className="muted small" style={{ margin: 0 }}>{leftover} left over — not enough for one more full {groupWord}.</p>}
      {layout !== "pool" && (
        <p className="muted small" style={{ margin: 0 }}>
          {captionGroups} {groupCount === 1 ? groupWord : `${groupWord}s`} of {captionSize} {itemWord}
          {perGroup === 1 ? "" : "s"} each
        </p>
      )}
    </div>
  );
}
