import { FractionBar } from "../../../shared/diagrams";
import type { DiffWholeScenario } from "../lib/decimals";

/**
 * The "different-size wholes" picture for Unit 3: a 10-unit whole and a
 * 100-unit whole drawn to scale (48px vs 480px), each split into tenths with
 * that person's tenths shaded. The bigger-or-equal decimal is always on the
 * short whole (see diffWholeScenario), so the picture shows at a glance that
 * the decimals alone point the wrong way. Built on shared FractionBar.
 */
export function DiffWholeBars({ s }: { s: DiffWholeScenario }) {
  return (
    <div className="dec-visual-stack">
      <FractionBar numerator={s.smallTenths} denominator={10} width={48} height={28} label={`${s.smallName}: 0.${s.smallTenths} of 10 ${s.unit}`} />
      <FractionBar numerator={s.bigTenths} denominator={10} width={480} height={28} label={`${s.bigName}: 0.${s.bigTenths} of 100 ${s.unit}`} />
    </div>
  );
}
