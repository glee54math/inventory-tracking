export { WholePlusPartBar } from "./WholePlusPartBar";
export type { WholePlusPartBarProps } from "./WholePlusPartBar";
export { FractionCircle, WholePlusPartCircles } from "./FractionCircle";
export type { FractionCircleProps, WholePlusPartCirclesProps } from "./FractionCircle";
export { FractionNumberLine } from "./FractionNumberLine";
export type { FractionNumberLineProps } from "./FractionNumberLine";
export { EquivalentBars } from "./EquivalentBars";
export type { EquivalentBarsProps } from "./EquivalentBars";
export { SimplifyBeforeAfter } from "./SimplifyBeforeAfter";
export type { SimplifyBeforeAfterProps } from "./SimplifyBeforeAfter";
// Convenience re-exports so unit files can import everything they need from
// one local barrel, the same way MG11's MultDivFractionLab/diagrams/index.ts
// does — these two are promoted shared components, not local to this module.
export { FractionBar, NumberLine } from "../../../shared/diagrams";
export type { FractionBarProps, NumberLineProps, NumberLinePoint } from "../../../shared/diagrams";
