import { GeoCanvas, Poly, RightMark, Segment } from "./Geo";
import { polygonAngleTypes, sideVec, sqLen, type Pt } from "../lib/geometry";

/** A quadrilateral on the grid with the standard marks: a little square on
 *  every right angle, and matching tick marks on equal sides (1 tick for one
 *  equal-length group, 2 for a second group). Parallel sides are left for the
 *  student to read off the grid. Shared by Unit 4's Practice, Test and Explore. */
export function QuadDrawing({ pts, cell = 26, cols, rows }: { pts: Pt[]; cell?: number; cols?: number; rows?: number }) {
  const C = cols ?? Math.max(...pts.map((p) => p[0])) + 1;
  const R = rows ?? Math.max(...pts.map((p) => p[1])) + 1;
  const n = pts.length;
  const sq = pts.map((_, i) => sqLen(sideVec(pts, i)));
  const groups = [...new Set(sq)].filter((s) => sq.filter((t) => t === s).length >= 2);
  const ticks = sq.map((s) => groups.indexOf(s) + 1);
  const types = polygonAngleTypes(pts);
  return (
    <GeoCanvas cols={C} rows={R} cell={cell} label="A four-sided shape on a grid">
      <Poly pts={pts} />
      {pts.map((_, i) => (ticks[i] > 0 ? <Segment key={`t${i}`} a={pts[i]} b={pts[(i + 1) % n]} ticks={ticks[i]} width={0.01} /> : null))}
      {pts.map((p, i) => (types[i] === "right" ? <RightMark key={`r${i}`} v={p} a={pts[(i + n - 1) % n]} b={pts[(i + 1) % n]} size={0.45} /> : null))}
    </GeoCanvas>
  );
}
