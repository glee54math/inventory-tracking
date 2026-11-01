import { CornerTester, Dot, GeoCanvas, LineShape, Poly, RightMark, Segment, VertexLabels } from "./Geo";
import { LINES_COLS, LINES_ROWS, type SideFigure, type TwoLinesSpec } from "../lib/unit2Gen";
import type { Pt } from "../lib/geometry";

// Static drawings for Unit 2 — shared by Practice and Test.

/** Two lines on the grid. `extend` draws dashed continuations to the meeting
 *  point (only ever passed AFTER the student has answered "would they meet?");
 *  `corner` lays the paper-corner tester (or the right-angle mark) where they cross. */
export function TwoLinesDrawing({ s, extend = false, corner = false, cell = 26 }: { s: TwoLinesSpec; extend?: boolean; corner?: boolean; cell?: number }) {
  const near = (l: [Pt, Pt], m: Pt): Pt => (Math.hypot(l[0][0] - m[0], l[0][1] - m[1]) < Math.hypot(l[1][0] - m[0], l[1][1] - m[1]) ? l[0] : l[1]);
  return (
    <GeoCanvas cols={LINES_COLS} rows={LINES_ROWS} cell={cell} label="Two lines on a grid">
      {extend && s.meet && !s.crossInPicture && (
        <>
          <Segment a={near(s.l1, s.meet)} b={s.meet} tone="a" dash width={2.5} />
          <Segment a={near(s.l2, s.meet)} b={s.meet} tone="b" dash width={2.5} />
          <Dot at={s.meet} tone="bad" r={6} />
        </>
      )}
      {corner && s.meet && s.crossInPicture && s.relation !== "perpendicular" && <CornerTester v={s.meet} along={s.l1[1]} toward={s.l2[1]} size={2.5} />}
      {corner && s.meet && s.crossInPicture && s.relation === "perpendicular" && <RightMark v={s.meet} a={s.l1[1]} b={s.l2[1]} size={0.6} tone="good" />}
      <LineShape a={s.l1[0]} b={s.l1[1]} tone="a" />
      <LineShape a={s.l2[0]} b={s.l2[1]} tone="b" />
    </GeoCanvas>
  );
}

/** A lettered quadrilateral; `highlight` thickens + colors the named side(s). */
export function SideFigureDrawing({ f, highlight = [], cell = 30 }: { f: SideFigure; highlight?: number[]; cell?: number }) {
  const cols = Math.max(...f.pts.map((p) => p[0])) + 1;
  const rows = Math.max(...f.pts.map((p) => p[1])) + 1;
  return (
    <GeoCanvas cols={cols} rows={rows} cell={cell} label={`A four-sided shape ${f.letters.join("")}`}>
      <Poly pts={f.pts} />
      {highlight.map((i) => (
        <Segment key={i} a={f.pts[i]} b={f.pts[(i + 1) % 4]} tone="a" width={5} />
      ))}
      <VertexLabels pts={f.pts} letters={f.letters} />
    </GeoCanvas>
  );
}
