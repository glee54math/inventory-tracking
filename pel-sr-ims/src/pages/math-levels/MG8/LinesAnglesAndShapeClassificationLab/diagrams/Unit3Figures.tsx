import { GeoCanvas, Poly, RightMark, Segment, SideLabel } from "./Geo";
import type { TriSpec } from "../lib/unit3Gen";
import type { Pt } from "../lib/geometry";

/** A triangle drawn to scale with its stated side lengths; a right angle is
 *  marked with the little square (the drawing convention taught in Unit 1).
 *  When a side is unlabeled (right isosceles' long side), the two equal legs
 *  also get matching tick marks. Shared by Unit 3's Practice and Test. */
export function TriangleDrawing({ t, cell = 28 }: { t: TriSpec; cell?: number }) {
  const c: Pt = [(t.pts[0][0] + t.pts[1][0] + t.pts[2][0]) / 3, (t.pts[0][1] + t.pts[1][1] + t.pts[2][1]) / 3];
  const hasBlank = t.labels.some((l) => l === null);
  return (
    <GeoCanvas cols={t.cols} rows={t.rows} cell={cell} grid={false} label={`A triangle with sides ${t.labels.map((l) => l ?? "unlabeled").join(", ")}`}>
      <Poly pts={t.pts} fill="cSoft" />
      {hasBlank &&
        [0, 1, 2]
          .filter((i) => t.labels[i] !== null)
          .map((i) => <Segment key={i} a={t.pts[i]} b={t.pts[(i + 1) % 3]} ticks={1} width={0.01} />)}
      {t.rightAt !== null && <RightMark v={t.pts[t.rightAt]} a={t.pts[(t.rightAt + 1) % 3]} b={t.pts[(t.rightAt + 2) % 3]} size={0.5} />}
      {t.labels.map((l, i) => (l === null ? null : <SideLabel key={i} a={t.pts[i]} b={t.pts[(i + 1) % 3]} text={l} center={c} off={17} />))}
    </GeoCanvas>
  );
}
