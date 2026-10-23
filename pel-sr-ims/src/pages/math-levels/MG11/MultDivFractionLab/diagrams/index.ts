export { FractionBar } from "../../../shared/diagrams";
export type { FractionBarProps } from "../../../shared/diagrams";
export { FractionMeasureStrip } from "./FractionMeasureStrip";
export type { FractionMeasureStripProps } from "./FractionMeasureStrip";
export { AreaRectangle } from "./AreaRectangle";
export type { AreaRectangleProps } from "./AreaRectangle";
export { PlaceValueColumns } from "./PlaceValueColumns";
export type { PlaceValueColumnsProps } from "./PlaceValueColumns";
// Promoted to shared/diagrams/ (2026-10-23) once a third real consumer
// showed up (MM1/ExponentsAndExpressionsLab) — re-exported here so this
// lab's own units keep importing it from "../diagrams" unchanged.
export { FactorRectangle } from "../../../shared/diagrams";
export type { FactorRectangleProps } from "../../../shared/diagrams";
export { MultiplesLine } from "./MultiplesLine";
export type { MultiplesLineProps } from "./MultiplesLine";
export { RecipeCard } from "./RecipeCard";
export type { RecipeCardProps, RecipeIngredient } from "./RecipeCard";
export { SharingBars } from "./SharingBars";
export type { SharingBarsProps } from "./SharingBars";
