// Diagram colors. Every value is a CSS variable with a hex fallback, so a diagram
// renders correctly on its own (no stylesheet required) but still follows the
// app's light/dark theme when the variables are defined.
// Apply these through `style={{ fill: ... }}`, not SVG attributes, so var() resolves.

export const palette = {
  a: "var(--qa, #3157D5)", // first quantity (cobalt)
  aSoft: "var(--qa-soft, #DCE4FB)",
  b: "var(--qb, #E39A1E)", // second quantity (marigold)
  bSoft: "var(--qb-soft, #FBEBCB)",
  c: "var(--qc, #8A4FD8)", // a third quantity / totals (violet)
  cSoft: "var(--qc-soft, #EADFFA)",
  ink: "var(--ink, #1B2540)",
  muted: "var(--muted, #5D6782)",
  line: "var(--line, #C9D0E2)",
  grid: "var(--grid, #E6EAF4)",
  paper: "var(--card, #FFFFFF)",
  good: "var(--good, #1F8F5F)",
  goodSoft: "var(--good-soft, #D7F2E4)",
  bad: "var(--bad, #C93848)",
} as const;

export type PaletteKey = keyof typeof palette;

/** Diagram font: inherits the page font, falls back to system UI. */
export const diagramFont = "inherit";
