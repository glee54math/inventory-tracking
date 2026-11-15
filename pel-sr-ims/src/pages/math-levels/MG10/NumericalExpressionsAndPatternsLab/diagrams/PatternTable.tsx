import { ordinal } from "../lib/patterns";

// Unit 5's pattern table: one row per pattern (Pattern A in blue, Pattern B in
// orange), one column per term, so matching terms line up in a column. An
// optional last row shows the ordered pairs (A term, B term). A null term
// shows a dashed "?" box. `ring` highlights one column (the matching terms).

export interface PatternRow {
  label: string;
  rule: string;
  terms: (number | null)[];
  tone: "a" | "b";
}

export interface PatternTableProps {
  rows: PatternRow[];
  /** Show the ordered pairs row (needs exactly 2 rows). */
  pairs?: (string | null)[];
  ring?: number | null;
}

export function PatternTable({ rows, pairs, ring = null }: PatternTableProps) {
  const n = Math.max(...rows.map((r) => r.terms.length));
  return (
    <div className="pattern-table-wrap">
      <table className="pattern-table">
        <thead>
          <tr>
            <th scope="col">Pattern</th>
            {Array.from({ length: n }, (_, i) => (
              <th key={i} scope="col" className={ring === i ? "pt-ring" : undefined}>
                {ordinal(i + 1)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className={`pt-row pt-${r.tone}`}>
              <th scope="row">
                <span className="pt-label">{r.label}</span>
                <span className="pt-rule">{r.rule}</span>
              </th>
              {r.terms.map((t, i) => (
                <td key={i} className={`${t === null ? "pt-unknown" : ""}${ring === i ? " pt-ring" : ""}`}>
                  {t === null ? "?" : t}
                </td>
              ))}
            </tr>
          ))}
          {pairs && (
            <tr className="pt-pairs">
              <th scope="row">
                <span className="pt-label">Ordered pairs</span>
              </th>
              {pairs.map((p, i) => (
                <td key={i} className={`${p === null ? "pt-unknown" : ""}${ring === i ? " pt-ring" : ""}`}>
                  {p === null ? "?" : p}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
