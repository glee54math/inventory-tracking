import { namingShapesAndPositions } from "./NamingShapesAndPositions";
import { flatOrSolid } from "./FlatOrSolid";
import { sidesAndCorners } from "./SidesAndCorners";
import { buildingAndCombiningShapes } from "./BuildingAndCombiningShapes";
import type { Unit } from "../../../shared/units/types";

/** Order matters: naming shapes/positions first (the shared vocabulary every
 *  later unit leans on), then flat-vs-solid (introduces 3D), then sides/
 *  corners (analysis using vocabulary from both), then building/combining
 *  (applies everything constructively). */
export const units: Unit[] = [namingShapesAndPositions, flatOrSolid, sidesAndCorners, buildingAndCombiningShapes];
export type { Unit };
