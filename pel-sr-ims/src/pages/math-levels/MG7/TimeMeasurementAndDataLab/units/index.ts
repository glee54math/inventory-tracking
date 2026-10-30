import { tellingTimeToTheMinute } from "./TellingTimeToTheMinute";
import { elapsedTimeAndIntervals } from "./ElapsedTimeAndIntervals";
import { measuringVolumeAndMass } from "./MeasuringVolumeAndMass";
import { wordProblemsWithMassAndVolume } from "./WordProblemsWithMassAndVolume";
import { scaledGraphs } from "./ScaledGraphs";
import { linePlotsWithFractionalData } from "./LinePlotsWithFractionalData";
import type { Unit } from "../../../shared/units/types";

/** Order follows the plan: reading a clock, then elapsed time built on it
 *  (3.MD.1); measuring mass/volume, then word problems with those
 *  measurements (3.MD.2); scaled graphs (3.MD.3); then line plots of
 *  fractional measurement data (3.MD.4). */
export const units: Unit[] = [tellingTimeToTheMinute, elapsedTimeAndIntervals, measuringVolumeAndMass, wordProblemsWithMassAndVolume, scaledGraphs, linePlotsWithFractionalData];
export type { Unit };
