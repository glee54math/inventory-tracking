import { useId } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";

export interface PictureCategory {
  label: string;
  glyph: string;
  value: number;
  tone?: "a" | "b" | "c";
}

export interface ScaledPictureGraphProps {
  categories: PictureCategory[];
  /** How many real items ONE icon stands for — the key, always > 1 here
   *  (an unscaled 1-icon-per-item graph is Grade 1's DataChart, not this
   *  one). Every category's value is constructed (by every caller in this
   *  unit) to be an exact multiple of `key` or exactly `key/2` more than a
   *  multiple — i.e. a remainder of either 0 or exactly half the key — so
   *  the half-icon convention below always has a single unambiguous
   *  reading. This lab's chosen convention for a non-exact count (the
   *  plan's open question): HALF AN ICON (clipped to its left half, with a
   *  dashed cut line) ALWAYS MEANS HALF THE KEY'S VALUE, never any other
   *  fraction — so "3 and a half apples" with key=2 means 7 apples, not 6
   *  or 8.
   */
  keyValue: number;
}

const ROW_H = 42;
const ICON = 28;
const LABEL_W = 110;
const PAD = 10;

/** A scaled picture graph: a key stating "each icon = keyValue items," then
 *  one row per category with floor(value/keyValue) full icons plus — only
 *  when the remainder is exactly half the key — one left-half clipped icon. See ScaledPictureGraphProps.keyValue's doc comment for the
 *  exact convention this half-icon represents. */
export function ScaledPictureGraph({ categories, keyValue }: ScaledPictureGraphProps) {
  const uid = useId().replace(/:/g, "");
  const maxFull = Math.max(...categories.map((c) => Math.ceil(c.value / keyValue)), 1);
  const width = LABEL_W + PAD * 2 + (maxFull + 1) * ICON;
  const height = categories.length * ROW_H + PAD + 30;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`A picture graph where each icon stands for ${keyValue}, with rows for ${categories.map((c) => c.label).join(", ")}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      <text x={LABEL_W} y={16} fontSize={12} fontWeight={700} fill={palette.muted}>
        Key: each icon = {keyValue}
      </text>
      {categories.map((c, row) => {
        const y = row * ROW_H + ROW_H / 2 + 28;
        const fullIcons = Math.floor(c.value / keyValue);
        const remainder = c.value - fullIcons * keyValue;
        const hasHalf = remainder > 0; // by construction, remainder is always exactly keyValue/2
        return (
          <g key={c.label}>
            <text x={LABEL_W - 8} y={y + 5} textAnchor="end" fontSize={14} fontWeight={700} fill={palette.ink}>
              {c.label}
            </text>
            <line x1={LABEL_W} y1={y} x2={width} y2={y} stroke={palette.line} strokeWidth={1} />
            {Array.from({ length: fullIcons }, (_, i) => (
              <text key={i} x={LABEL_W + PAD + i * ICON + ICON / 2} y={y + 8} textAnchor="middle" fontSize={ICON * 0.8}>
                {c.glyph}
              </text>
            ))}
            {hasHalf && (
              <>
                <clipPath id={`${uid}-half-${row}`}>
                  {/* Left half of the icon cell only — a real SVG clipPath rect, not CSS inset(), whose reference box on SVG content is the whole viewport. */}
                  <rect x={LABEL_W + PAD + fullIcons * ICON} y={y - ICON} width={ICON / 2} height={ICON * 2} />
                </clipPath>
                <text
                  x={LABEL_W + PAD + fullIcons * ICON + ICON / 2}
                  y={y + 8}
                  textAnchor="middle"
                  fontSize={ICON * 0.8}
                  clipPath={`url(#${uid}-half-${row})`}
                >
                  {c.glyph}
                </text>
                <line
                  x1={LABEL_W + PAD + fullIcons * ICON + ICON / 2}
                  y1={y - ICON / 2}
                  x2={LABEL_W + PAD + fullIcons * ICON + ICON / 2}
                  y2={y + ICON / 2}
                  stroke={palette.muted}
                  strokeDasharray="2 2"
                />
              </>
            )}
            {fullIcons === 0 && !hasHalf && (
              <text x={LABEL_W + PAD} y={y + 5} fontSize={12} fill={palette.muted}>
                (none)
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
