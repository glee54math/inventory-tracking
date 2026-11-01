import { AngleArc, CornerTester, Dot, GeoCanvas, Label, LineShape, Poly, Ray, Segment, VertexLabels } from "./Geo";
import { FIGURE_NAME, TESTER, type AngleSpec, type FigureSpec, type ShapeAngleSpec } from "../lib/unit1Gen";

// Static drawings for Unit 1's generated figures — shared by the unit's
// Practice and its Test (both import from here, never from each other).

/** A segment, ray or line through two labeled points. */
export function FigureDrawing({ f, cell = 30 }: { f: FigureSpec; cell?: number }) {
  const off: [number, number] = [-(f.q[1] - f.p[1]) || 0.01, f.q[0] - f.p[0] || 0.01];
  return (
    <GeoCanvas cols={f.cols} rows={f.rows} cell={cell} grid={false} label={`A ${FIGURE_NAME[f.kind]} through points ${f.names[0]} and ${f.names[1]}`}>
      {f.kind === "segment" && <Segment a={f.p} b={f.q} endDots />}
      {f.kind === "ray" && <Ray from={f.p} to={f.tipQ} />}
      {f.kind === "line" && <LineShape a={f.tipP} b={f.tipQ} />}
      {f.kind !== "segment" && <Dot at={f.q} />}
      {f.kind === "line" && <Dot at={f.p} />}
      <Label at={f.p} text={f.names[0]} dir={off} off={16} />
      <Label at={f.q} text={f.names[1]} dir={off} off={16} />
    </GeoCanvas>
  );
}

/** One angle on the grid: two rays from a shared vertex, with an arc. The
 *  optional corner tester lays a "paper square corner" along the first ray. */
export function AngleDrawing({ s, tester = false, cell = 26 }: { s: AngleSpec; tester?: boolean; cell?: number }) {
  return (
    <GeoCanvas cols={s.cols} rows={s.rows} cell={cell} label="An angle made by two rays that share an endpoint">
      {tester && <CornerTester v={s.v} along={s.a} toward={s.b} size={TESTER} />}
      <AngleArc v={s.v} a={s.a} b={s.b} r={1.1} />
      <Ray from={s.v} to={s.a} endpointDot={false} />
      <Ray from={s.v} to={s.b} endpointDot={false} />
      <Dot at={s.v} r={5.5} />
    </GeoCanvas>
  );
}

/** A triangle/quadrilateral with lettered corners on the grid — no angle
 *  marks (finding the angle types is the student's job). */
export function ShapeDrawing({ s, cell = 30, highlight }: { s: ShapeAngleSpec; cell?: number; highlight?: number }) {
  const cols = Math.max(...s.pts.map((p) => p[0])) + 1;
  const rows = Math.max(...s.pts.map((p) => p[1])) + 1;
  const n = s.pts.length;
  return (
    <GeoCanvas cols={cols} rows={rows} cell={cell} label={`A shape with corners ${s.letters.join(", ")}`}>
      <Poly pts={s.pts} />
      {highlight !== undefined && <AngleArc v={s.pts[highlight]} a={s.pts[(highlight + n - 1) % n]} b={s.pts[(highlight + 1) % n]} r={0.8} />}
      <VertexLabels pts={s.pts} letters={s.letters} />
    </GeoCanvas>
  );
}
