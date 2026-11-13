import { lcd } from "../lib/fractions";
import { palette } from "../../../shared/lib/palette";

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
 *
 * Styling is inline (not the lab's own stylesheet) so it still renders
 * correctly when mounted on its own, e.g. as a unit's preview card on the
 * All Levels / level-files browser, which never loads a per-lab CSS file.
 */
export function MultiplesList({ a, b, count, showCommon, showLcd }: MultiplesListProps) {
  const big = Math.max(a, b);
  // Default: list up to the product (so the product shows up as a common
  // denominator too, and the LCD is always on screen), 4 to 16 chips.
  const n = count ?? Math.min(16, Math.max(4, (a * b) / big));
  const top = big * n;
  const L = lcd(a, b);

  const row = (d: number) => {
    const vals: number[] = [];
    for (let v = d; v <= top; v += d) vals.push(v);
    return (
      <div
        key={d}
        aria-label={`Multiples of ${d}: ${vals.join(", ")}`}
        style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}
      >
        <span style={{ minWidth: 34, fontWeight: 800, fontSize: 17, color: palette.ink }}>{d}:</span>
        {vals.map((v) => {
          const common = v % a === 0 && v % b === 0;
          const least = v === L;
          const ring = showCommon && common;
          const star = showLcd && least;
          return (
            <span
              key={v}
              style={{
                position: "relative",
                minWidth: 38,
                padding: "4px 8px",
                border: `2px solid ${star ? palette.good : ring ? palette.c : palette.line}`,
                borderRadius: 999,
                background: star ? palette.goodSoft : ring ? palette.cSoft : palette.paper,
                color: star ? palette.ink : ring ? palette.c : palette.ink,
                textAlign: "center",
                fontWeight: star ? 800 : 600,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {v}
              {star && (
                <span
                  style={{
                    position: "absolute",
                    top: -12,
                    left: "50%",
                    transform: "translateX(-50%)",
                    padding: "0 5px",
                    borderRadius: 6,
                    background: palette.good,
                    color: palette.paper,
                    fontSize: 10,
                    fontWeight: 800,
                  }}
                >
                  LCD
                </span>
              )}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {row(a)}
      {row(b)}
    </div>
  );
}
