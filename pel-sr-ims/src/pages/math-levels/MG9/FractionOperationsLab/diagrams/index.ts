// PieceBars and MixedNumberBars were promoted to shared/diagrams/ (2026-11)
// when MG10_AddingAndSubtractingFractionsLab became their second consumer —
// re-exported here so this lab's units keep importing them from "../diagrams".
export { PieceBars, MixedNumberBars } from "../../../shared/diagrams";
export type { PieceBarsProps, PieceSegment, PieceTone, MixedNumberBarsProps } from "../../../shared/diagrams";
export { FracLinePlot } from "./FracLinePlot";
export type { FracLinePlotProps } from "./FracLinePlot";
// Convenience re-export of the promoted shared bar, same as
// IntroToFractionsLab/diagrams/index.ts does.
export { FractionBar } from "../../../shared/diagrams";
export type { FractionBarProps } from "../../../shared/diagrams";
