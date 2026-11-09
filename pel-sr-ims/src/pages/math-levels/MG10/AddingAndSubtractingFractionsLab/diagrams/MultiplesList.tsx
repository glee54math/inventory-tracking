import { lcd } from "../lib/fractions";

export interface MultiplesListProps {
  a: number;
  b: number;
  /** How many multiples of the bigger denominator to list (the smaller one's row runs up to the same value). */
  count?: number;
  /** Ring the numbers that are in BOTH rows. */
  showCommon?: boolean;
  /** Star the least common one and tag it "LCD". */
  showLcd?: boolean;
}

/**
 * Two rows of multiples — one per denominator — as number chips, the way a
 * 5th grader lists them on paper: "4: 4, 8, 12, 16 …" and "6: 6, 12, 18 …".
 * Numbers in both rows can be ringed (common denominators) and the first of
 * them starred (the LCD). Deliberately its own small HTML component instead
 * of MG11's MultiplesLine (dots on a scaled line): the list is how this lab
 * teaches the LCD search, and chips stay readable at any size.
 */
export function MultiplesList({ a, b, count, showCommon, showLcd }: MultiplesListProps) {
  const big = Math.max(a, b);
  // Default: list up to the product (so the product shows up as a common
  // denominator too, and the LCD is always on screen), 4 to 16 chips.
  const n = count ?? Math.min(16, Math.max(4, (a * b) / big));
  const top = big * n;
  const L = lcd(a, b);
  const row = (d: number, tone: "a" | "b") => {
    const vals: number[] = [];
    for (let v = d; v <= top; v += d) vals.push(v);
    return (
      <div className="mult-row" aria-label={`Multiples of ${d}: ${vals.join(", ")}`}>
        <span className={`mult-head q${tone}-text`}>{d}:</span>
        {vals.map((v) => {
          const common = v % a === 0 && v % b === 0;
          const least = v === L;
          const cls = ["mult-chip", showCommon && common ? "common" : "", showLcd && least ? "least" : ""].filter(Boolean).join(" ");
          return (
            <span key={v} className={cls}>
              {v}
              {showLcd && least && <span className="mult-tag">LCD</span>}
            </span>
          );
        })}
      </div>
    );
  };
  return (
    <div className="mult-list">
      {row(a, "a")}
      {row(b, "b")}
    </div>
  );
}
