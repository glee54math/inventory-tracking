export interface ConversionTableRow {
  left: string;
  /** null renders a "?" cell — a value the student hasn't found yet. */
  right: string | null;
  highlight?: boolean;
  /** Left cell can be hidden too (a small → big question asks for it). */
  leftHidden?: boolean;
}

/**
 * The two-column conversion table 4.MD.1 asks students to record ("feet |
 * inches" style). Plain HTML, not SVG, so long values ("12,000") can never
 * clip — a table cell just grows. `?` cells are styled as dashed blanks.
 */
export function ConversionTable({ leftHead, rightHead, rows, caption }: { leftHead: string; rightHead: string; rows: ConversionTableRow[]; caption?: string }) {
  return (
    <table className="conv-table">
      {caption && <caption>{caption}</caption>}
      <thead>
        <tr>
          <th className="qa-text">{leftHead}</th>
          <th className="qb-text">{rightHead}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i} className={r.highlight ? "hl" : undefined}>
            <td>{r.leftHidden ? <span className="blank">?</span> : r.left}</td>
            <td>{r.right === null ? <span className="blank">?</span> : r.right}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
