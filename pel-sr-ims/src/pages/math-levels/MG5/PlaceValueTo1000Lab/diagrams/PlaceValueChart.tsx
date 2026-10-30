import { palette, diagramFont } from "../../../shared/lib/palette";
import { digitsOf, type Place } from "../logic";

const BOX = 64;
const GAP = 8;

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

export interface PlaceValueChartProps {
  value: number;
  tone?: "a" | "b" | "c";
  /** Tints this one place's box/label to flag it as "the place that decided
   *  the comparison" — used by Comparing Three-Digit Numbers so the picture
   *  points at exactly the digit the explanation talks about. */
  highlightPlace?: Place;
  /** Show each digit's actual value underneath it (e.g. "300" under a 3 in
   *  the hundreds column) — on by default; Comparing's side-by-side use
   *  turns it off to keep the two charts compact. */
   showValues?: boolean;
}

/**
 * A 3-column Hundreds | Tens | Ones chart: each digit of `value` in its own
 * labeled box, with its place name underneath. The direct bridge between
 * base-ten blocks (a pile of flats/rods/cubes) and the bare numeral — same
 * digit, same position, just drawn as text instead of blocks. Reused by
 * Comparing Three-Digit Numbers (two instances, one per number) so the
 * "which place decided it" explanation can point at a real highlighted box
 * instead of just naming it in prose.
 */
export function PlaceValueChart({ value, tone, highlightPlace, showValues = true }: PlaceValueChartProps) {
  const { h, t, o } = digitsOf(value);
  const color = toneColor(tone);
  const cols: { label: string; digit: number; placeValue: number; place: Place }[] = [
    { label: "Hundreds", digit: h, placeValue: h * 100, place: "hundreds" },
    { label: "Tens", digit: t, placeValue: t * 10, place: "tens" },
    { label: "Ones", digit: o, placeValue: o, place: "ones" },
  ];
  const width = cols.length * BOX + (cols.length - 1) * GAP + 20;
  const height = showValues ? 120 : 92;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${value} shown as ${h} hundreds, ${t} tens, ${o} ones`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {cols.map((c, i) => {
        const x = 10 + i * (BOX + GAP);
        const highlighted = highlightPlace === c.place;
        return (
          <g key={c.place}>
            <rect x={x} y={10} width={BOX} height={BOX} rx={8} fill={highlighted ? palette.goodSoft : palette.grid} stroke={highlighted ? palette.good : palette.line} strokeWidth={highlighted ? 2.5 : 1.5} />
            <text x={x + BOX / 2} y={10 + BOX / 2 + 10} textAnchor="middle" fontSize={30} fontWeight={800} fill={highlighted ? palette.good : color}>
              {c.digit}
            </text>
            <text x={x + BOX / 2} y={BOX + 26} textAnchor="middle" fontSize={11} fontWeight={600} fill={palette.muted}>
              {c.label}
            </text>
            {showValues && (
              <text x={x + BOX / 2} y={BOX + 42} textAnchor="middle" fontSize={11} fill={palette.muted}>
                = {c.placeValue}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
