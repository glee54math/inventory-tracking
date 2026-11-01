export interface PlaceValueRow {
  ones: number;
  tenths: number;
  /** Omit for a tenths-only number like 0.3 — the cell is still drawn, just
   *  left empty, so "no hundredths digit" stays visible. */
  hundredths?: number;
  /** When `hundredths` is omitted, show a faint placeholder 0 there instead
   *  of an empty cell (0.5 -> 0.50) — used once a step has established that
   *  the two are equal. */
  ghostZero?: boolean;
}

export interface PlaceValueChartProps {
  /** One row per number. Two rows line the digits up place by place, which
   *  is the comparison picture for Unit 3. */
  rows: PlaceValueRow[];
}

/**
 * A small ones | . | tenths | hundredths chart. Plain HTML (a table), not
 * SVG, so it scales with text size and never clips. Tenths digits use the
 * lab's "a" tone and hundredths digits the "c" tone — the same colors
 * HundredthsGrid uses for a tenth strip vs a single hundredth square.
 */
export function PlaceValueChart({ rows }: PlaceValueChartProps) {
  const text = (r: PlaceValueRow) => `${r.ones}.${r.tenths}${r.hundredths ?? ""}`;
  return (
    <table className="dec-pv" aria-label={`Place value chart: ${rows.map(text).join(" and ")}`}>
      <thead>
        <tr>
          <th>ones</th>
          <th aria-hidden />
          <th className="qa-text">tenths</th>
          <th className="qc-text">hundredths</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={i}>
            <td>{r.ones}</td>
            <td className="dec-pv-point">.</td>
            <td className="qa-text">{r.tenths}</td>
            <td className={r.hundredths === undefined && r.ghostZero ? "dec-pv-ghost" : "qc-text"}>{r.hundredths ?? (r.ghostZero ? "0" : "")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
