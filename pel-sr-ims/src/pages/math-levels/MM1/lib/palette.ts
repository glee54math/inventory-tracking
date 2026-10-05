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

/**
 * Colors for scenes whose item names reference a real-world color (e.g. "red
 * apples", "yellow marbles") — deliberately distinct hues from both the a/b/c
 * ratio-quantity colors above AND from good/bad (correct/incorrect feedback),
 * so a scene can match its own wording without borrowing a color that already
 * carries a different meaning elsewhere in the UI. `main` drives diagram fills
 * and QA/QB/QC's `color` override (see engine/controls.tsx); `soft` is for
 * TapeDiagram's lighter background band; `text` is a darker variant for
 * contrast when used as text color on a light card.
 */
export const itemColors = {
  red: {
    main: "var(--item-red, #C4432E)",
    soft: "var(--item-red-soft, #F6DDD6)",
    text: "var(--item-red-text, #9A3420)",
  },
  green: {
    main: "var(--item-green, #4C8C2B)",
    soft: "var(--item-green-soft, #E1EDD4)",
    text: "var(--item-green-text, #386B1F)",
  },
  yellow: {
    main: "var(--item-yellow, #D4A72C)",
    soft: "var(--item-yellow-soft, #FBF1D1)",
    text: "var(--item-yellow-text, #8C6B14)",
  },
} as const;

export type ItemColor = (typeof itemColors)[keyof typeof itemColors];

/** Diagram font: inherits the page font, falls back to system UI. */
export const diagramFont = "inherit";
