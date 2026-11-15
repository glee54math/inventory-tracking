// Unit 3's "how big is it, without working it out" pictures. The bars carry
// the expression, never its value, so a size comparison is read from the
// picture, not computed.
//
// TimesBars: a bar for a group (e.g. 18,932 + 921) and, under it, a bar made
// of k copies of that same bar (k × (18,932 + 921)).
// BarRows: any rows of copies, e.g. 6 copies against 2 copies, the same 3
// copies of a smaller and a larger group, or a group against one of its k
// equal parts (÷ k). Used by Explore and by the "Which is larger?" help.

export interface BarRow {
  /** The row's expression, e.g. "3 × (18,932 + 921)". */
  label: string;
  /** How many copies of the group are in the bar. */
  k: number;
  /** Text inside each copy ("" for none). */
  text: string;
  /** Width of one copy, compared with the normal width (default 1). A smaller part is less than 1. */
  scale?: number;
  /** Bar color: "a" for the group itself, "b" for copies of it (default "b"). */
  tone?: "a" | "b";
  /** Draw this many equal dashed parts inside each copy (for ÷), default none. */
  parts?: number;
}

export function BarRows({ rows, unit: unitIn }: { rows: BarRow[]; unit?: number }) {
  const most = Math.max(1, ...rows.map((r) => r.k * (r.scale ?? 1)));
  const unit = unitIn ?? Math.max(60, Math.min(120, Math.floor(560 / most)));
  return (
    <div className="times-bars" role="img" aria-label={rows.map((r) => r.label).join(", compared with ")}>
      {rows.map((r, i) => {
        const w = Math.round(unit * (r.scale ?? 1));
        return (
          <div key={i} className="times-bars-row">
            <span className="times-bars-label">{r.label}</span>
            <span className="times-bars-bar">
              {Array.from({ length: r.k }, (_, j) => (
                <span key={j} className={`times-bars-cell tb-${r.tone ?? "b"}${r.parts && r.parts > 1 ? " tb-split" : ""}`} style={{ width: w }}>
                  {r.parts && r.parts > 1
                    ? Array.from({ length: r.parts }, (_, p) => <span key={p} className="times-bars-part" style={{ width: w / r.parts! }} />)
                    : r.text}
                </span>
              ))}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export interface TimesBarsProps {
  /** Text inside each copy of the group, e.g. "18,932 + 921". */
  group: string;
  /** How many copies in the second bar. */
  k: number;
  /** Labels for the two rows. */
  topLabel: string;
  bottomLabel: string;
  /** Hide the copies' dividers until the student is shown them. */
  showCopies?: boolean;
}

export function TimesBars({ group, k, topLabel, bottomLabel, showCopies = true }: TimesBarsProps) {
  const unit = Math.max(60, Math.min(120, Math.floor(560 / Math.max(k, 1))));
  return (
    <div className="times-bars" role="img" aria-label={`${bottomLabel} is a bar made of ${k} copies of ${topLabel}`}>
      <div className="times-bars-row">
        <span className="times-bars-label">{topLabel}</span>
        <span className="times-bars-bar">
          <span className="times-bars-cell tb-a" style={{ width: unit }}>
            {group}
          </span>
        </span>
      </div>
      <div className="times-bars-row">
        <span className="times-bars-label">{bottomLabel}</span>
        <span className="times-bars-bar">
          {Array.from({ length: k }, (_, i) => (
            <span key={i} className={`times-bars-cell tb-b${showCopies ? "" : " tb-plain"}`} style={{ width: unit }}>
              {showCopies ? group : ""}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}
