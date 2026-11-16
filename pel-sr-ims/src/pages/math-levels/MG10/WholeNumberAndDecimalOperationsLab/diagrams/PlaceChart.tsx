import { digitsOf, showDec, type Dec, type Places } from "../lib/decimals";

export interface PlaceRow extends Dec {
  tone?: "a" | "b";
}

export interface PlaceChartProps {
  /** One row per number. Two rows line the digits up place by place (comparing). */
  rows: PlaceRow[];
  /** Draw faint 0s in the empty places up to thousandths (0.5 -> 0.500). */
  fill?: boolean;
  /** Outline this place's column (the place we round to). 0 = ones. */
  place?: Places;
  /** Outline this column as "the digit that decides" (rounding). */
  decide?: Places;
  /** Fade every digit right of `place` (Unit 2's "cover the rest"). */
  fadeAfter?: boolean;
}

const HEAD = ["ones", "tenths", "hundredths", "thousandths"];

/**
 * A hundreds | tens | ones | . | tenths | hundredths | thousandths chart
 * (hundreds and tens only when a row needs them). Plain HTML (a table) so it scales with text and never
 * clips. An empty place stays an empty cell, so "this number stops at
 * tenths" is visible; `fill` draws the faint placeholder 0s that make two
 * numbers the same length. Lab-local rather than an extension of MG9
 * DecimalsLab's PlaceValueChart: that one is ones/tenths/hundredths only,
 * with no thousandths, tens, fill-to-3 or rounding outlines, and its one
 * consumer would gain nothing from these.
 */
export function PlaceChart({ rows, fill = false, place, decide, fadeAfter = false }: PlaceChartProps) {
  // Whole-number columns left of ones: 1 for tens, 2 for hundreds and tens.
  const extra = rows.some((r) => r.t >= 100000) ? 2 : rows.some((r) => r.t >= 10000) ? 1 : 0;
  const bigHeads = ["hundreds", "tens"].slice(2 - extra);
  const colClass = (k: Places) => [k === place ? "pc-place" : "", k === decide ? "pc-decide" : ""].filter(Boolean).join(" ");
  return (
    <table className="pc" aria-label={`Place value chart: ${rows.map(showDec).join(" and ")}`}>
      <thead>
        <tr>
          {bigHeads.map((h) => (
            <th key={h}>{h}</th>
          ))}
          <th className={colClass(0)}>{HEAD[0]}</th>
          <th aria-hidden />
          {[1, 2, 3].map((k) => (
            <th key={k} className={colClass(k as Places)}>
              {HEAD[k]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => {
          const { w, d } = digitsOf(r.t);
          const tone = r.tone === "b" ? "qb-text" : r.tone === "a" ? "qa-text" : "";
          const faded = (k: number) => fadeAfter && place !== undefined && k > place;
          return (
            <tr key={i} className={tone}>
              {bigHeads.map((h, j) => {
                const v = 10 ** (extra - j); // 100 or 10
                return (
                  <td key={h} className={faded(0) ? "pc-fade" : ""}>
                    {w >= v ? Math.floor(w / v) % 10 : ""}
                  </td>
                );
              })}
              <td className={[colClass(0), faded(0) ? "pc-fade" : ""].join(" ")}>{w % 10}</td>
              <td className="pc-point">.</td>
              {[1, 2, 3].map((k) => {
                const has = k <= r.p;
                const ghost = !has && fill;
                return (
                  <td key={k} className={[colClass(k as Places), ghost ? "pc-ghost" : "", faded(k) ? "pc-fade" : ""].join(" ")}>
                    {has ? d[k - 1] : ghost ? "0" : ""}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
