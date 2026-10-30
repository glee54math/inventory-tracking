import { understandingAreaAsTiling } from "./UnderstandingAreaAsTiling";
import { areaMultiplyingSideLengths } from "./AreaMultiplyingSideLengths";
import { areaDistributiveProperty } from "./AreaDistributiveProperty";
import { compositeRectilinearAreas } from "./CompositeRectilinearAreas";
import { perimeter } from "./Perimeter";
import type { Unit } from "../../../shared/units/types";

export const units: Unit[] = [understandingAreaAsTiling, areaMultiplyingSideLengths, areaDistributiveProperty, compositeRectilinearAreas, perimeter];
export type { Unit };
