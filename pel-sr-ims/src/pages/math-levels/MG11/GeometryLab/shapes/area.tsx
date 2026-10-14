// shapes/area.tsx — 2D area figures built from primitives.
// Dimensions are in math units; `u` is pixels per unit (auto-sized when omitted).
// `focus` takes part ids and highlights them (used by step-by-step solvers).
import React from "react";
import { fmt } from "../lib/math";
import { DimLabel, FigureSvg, Grid, Poly, type Pt, RightAngleMark, Seg, focusState, Label } from "./primitives";

const autoU = (maxUnits: number, target = 300) => Math.max(14, Math.min(40, target / maxUnits));
const lab = (n: number, unit?: string) => fmt(n) + (unit ? " " + unit : "");

type Common = { u?: number; unit?: string; focus?: string[]; grid?: boolean };

/* ---------- Rectangle ---------- */
export function RectangleFig({ b, h, u, unit, focus, grid = true }: Common & { b: number; h: number }) {
  const U = u ?? autoU(Math.max(b, h));
  const W = b * U, H = h * U;
  const P: Pt[] = [{ x: 0, y: 0 }, { x: W, y: 0 }, { x: W, y: H }, { x: 0, y: H }];
  const fr = focusState(focus, "row");
  return (
    <FigureSvg width={W} height={H} label={`Rectangle ${fmt(b)} by ${fmt(h)}`}>
      {grid && <Grid cols={Math.ceil(b)} rows={Math.ceil(h)} u={U} />}
      <Poly points={P} color="blue" {...focusState(focus, "rect")} faded={false} />
      {fr.strong && <Poly points={[{ x: 0, y: H - U }, { x: W, y: H - U }, { x: W, y: H }, { x: 0, y: H }]} color="gold" strong />}
      <DimLabel a={P[3]} b={P[2]} text={lab(b, unit)} offset={-18} highlight={focusState(focus, "b").strong} />
      <DimLabel a={P[3]} b={P[0]} text={lab(h, unit)} offset={18} highlight={focusState(focus, "h").strong} />
    </FigureSvg>
  );
}

/* ---------- Triangle (any, with apex over the base) ---------- */
/** apex = distance from the left end of the base to the point under the top vertex (0 → right triangle). */
export function TriangleFig({ b, h, apex = 0, u, unit, focus, grid = true, showBox, showHeight = true, splitLabels, rightKnown }: Common & {
  b: number; h: number; apex?: number; showBox?: boolean; showHeight?: boolean; splitLabels?: boolean; rightKnown?: boolean;
}) {
  const U = u ?? autoU(Math.max(b, h));
  const W = b * U, H = h * U, ax = Math.min(Math.max(apex, 0), b) * U;
  const A = { x: 0, y: H }, B = { x: W, y: H }, C = { x: ax, y: 0 }, F = { x: ax, y: H };
  const isRight = ax === 0 || ax === W;
  const inner = !isRight;
  const fLeft = focusState(focus, "left"), fRight = focusState(focus, "right"), fTri = focusState(focus, "tri"), fBox = focusState(focus, "box");
  return (
    <FigureSvg width={W} height={H} label={`Triangle with base ${fmt(b)} and height ${fmt(h)}`}>
      {grid && <Grid cols={Math.ceil(b)} rows={Math.ceil(h)} u={U} />}
      {showBox && (
        <Poly points={[{ x: 0, y: 0 }, { x: W, y: 0 }, B, A]} color="ink" fill={fBox.strong ? "var(--c-gold-soft)" : "transparent"} dashed strong={fBox.strong} />
      )}
      {inner && showBox ? (
        <>
          <Poly points={[A, F, C]} color="blue" {...(fTri.strong ? { strong: true } : fLeft)} />
          <Poly points={[F, B, C]} color="teal" {...(fTri.strong ? { strong: true } : fRight)} />
          {/* the matching empty halves show each piece is half of its rectangle */}
          <Poly points={[{ x: 0, y: 0 }, C, A]} color="blue" fill="transparent" dashed faded={!fLeft.strong} />
          <Poly points={[C, { x: W, y: 0 }, B]} color="teal" fill="transparent" dashed faded={!fRight.strong} />
        </>
      ) : (
        <Poly points={[A, B, C]} color="blue" {...(fTri.strong || fLeft.strong ? { strong: true } : focusState(focus, "__none"))} faded={fBox.strong} />
      )}
      {showHeight && inner && <Seg a={C} b={F} dashed color="berry" />}
      {showHeight && inner && <RightAngleMark p={F} d1={{ x: 1, y: 0 }} d2={{ x: 0, y: -1 }} color="berry" />}
      {isRight && <RightAngleMark p={ax === 0 ? A : B} d1={{ x: ax === 0 ? 1 : -1, y: 0 }} d2={{ x: 0, y: -1 }} />}
      {splitLabels && inner ? (
        <>
          <DimLabel a={A} b={F} text={lab(apex, unit)} offset={-18} highlight={fLeft.strong} />
          <DimLabel a={F} b={B} text={rightKnown ? lab(b - apex, unit) : "?"} offset={-18} highlight={focusState(focus, "rightBase").strong} />
          <DimLabel a={A} b={B} text={"base " + lab(b, unit)} offset={-44} />
        </>
      ) : (
        <DimLabel a={A} b={B} text={lab(b, unit)} offset={-18} highlight={focusState(focus, "b").strong} />
      )}
      {inner ? (
        <Label x={ax + 8} y={H / 2} text={lab(h, unit)} anchor="start" color="berry" />
      ) : (
        <DimLabel a={ax === 0 ? A : { x: W, y: 0 }} b={ax === 0 ? { x: 0, y: 0 } : B} text={lab(h, unit)} offset={18} highlight={focusState(focus, "h").strong} />
      )}
    </FigureSvg>
  );
}

/* ---------- Parallelogram (cut-and-slide into a rectangle) ---------- */
export function ParallelogramFig({ b, h, slant, u, unit, focus, grid = true, moved = false, showCut = false }: Common & {
  b: number; h: number; slant: number; moved?: boolean; showCut?: boolean;
}) {
  const U = u ?? autoU(b + slant);
  const W = (b + slant) * U, H = h * U, s = slant * U, B = b * U;
  const TL = { x: s, y: 0 }, TR = { x: s + B, y: 0 }, BR = { x: B, y: H }, BL = { x: 0, y: H };
  const foot = { x: s, y: H };
  const cutTri = [BL, foot, TL];
  return (
    <FigureSvg width={W} height={H} label={`Parallelogram with base ${fmt(b)} and height ${fmt(h)}`}>
      {grid && <Grid cols={Math.ceil(b + slant)} rows={Math.ceil(h)} u={U} />}
      {showCut || moved ? (
        <>
          <Poly points={[TL, TR, BR, foot]} color="blue" {...focusState(focus, "rect")} />
          {/* ghost where the triangle came from */}
          {moved && <Poly points={cutTri} color="gold" fill="transparent" dashed faded />}
          <g className="slide" style={{ transform: `translateX(${moved ? B : 0}px)` }}>
            <Poly points={cutTri} color="gold" strong={!moved} />
          </g>
        </>
      ) : (
        <Poly points={[TL, TR, BR, BL]} color="blue" />
      )}
      <Seg a={TL} b={foot} dashed color="berry" />
      <RightAngleMark p={foot} d1={{ x: 1, y: 0 }} d2={{ x: 0, y: -1 }} color="berry" />
      <Label x={s + 8} y={H / 2} text={lab(h, unit)} anchor="start" color="berry" />
      <DimLabel a={moved ? foot : BL} b={moved ? { x: s + B, y: H } : BR} text={lab(b, unit)} offset={-18} highlight={focusState(focus, "b").strong} />
    </FigureSvg>
  );
}

/* ---------- Trapezoid (split by a diagonal into two triangles) ---------- */
export function TrapezoidFig({ b1, b2, h, offset, u, unit, focus, grid = true, split = false }: Common & {
  b1: number; b2: number; h: number; offset: number; split?: boolean;
}) {
  const U = u ?? autoU(Math.max(b1, offset + b2, h));
  const W = Math.max(b1, offset + b2) * U, H = h * U;
  const BL = { x: 0, y: H }, BR = { x: b1 * U, y: H }, TL = { x: offset * U, y: 0 }, TR = { x: (offset + b2) * U, y: 0 };
  const hx = TL.x; // height drawn from the top-left vertex
  return (
    <FigureSvg width={W} height={H} label={`Trapezoid with bases ${fmt(b1)} and ${fmt(b2)}, height ${fmt(h)}`}>
      {grid && <Grid cols={Math.ceil(W / U)} rows={Math.ceil(h)} u={U} />}
      {split ? (
        <>
          <Poly points={[TL, TR, BR]} color="gold" {...focusState(focus, "t1")} />
          <Poly points={[TL, BR, BL]} color="blue" {...focusState(focus, "t2")} />
        </>
      ) : (
        <Poly points={[BL, BR, TR, TL]} color="blue" />
      )}
      <Seg a={{ x: hx, y: 0 }} b={{ x: hx, y: H }} dashed color="berry" />
      <Label x={hx - 8} y={H / 2} text={lab(h, unit)} anchor="end" color="berry" />
      <DimLabel a={BL} b={BR} text={lab(b1, unit)} offset={-18} highlight={focusState(focus, "t2").strong} />
      <DimLabel a={TL} b={TR} text={lab(b2, unit)} offset={18} highlight={focusState(focus, "t1").strong} />
    </FigureSvg>
  );
}

/* ---------- Composite L-shape (decomposed into two rectangles) ---------- */
/** Outer W × H with a cw × ch notch removed from the top-right corner. */
export function CompositeFig({ W, H, cw, ch, u, unit, focus, grid = true, split = false, known = [] }: Common & {
  W: number; H: number; cw: number; ch: number; split?: boolean; known?: ("top" | "right")[];
}) {
  const U = u ?? autoU(Math.max(W, H));
  const w = W * U, hh = H * U, nx = (W - cw) * U, ny = ch * U;
  const outline: Pt[] = [{ x: 0, y: 0 }, { x: nx, y: 0 }, { x: nx, y: ny }, { x: w, y: ny }, { x: w, y: hh }, { x: 0, y: hh }];
  const A: Pt[] = [{ x: 0, y: 0 }, { x: nx, y: 0 }, { x: nx, y: hh }, { x: 0, y: hh }];
  const B: Pt[] = [{ x: nx, y: ny }, { x: w, y: ny }, { x: w, y: hh }, { x: nx, y: hh }];
  const fA = focusState(focus, "A"), fB = focusState(focus, "B");
  return (
    <FigureSvg width={w} height={hh} label="Composite L-shaped figure">
      {grid && <Grid cols={Math.ceil(W)} rows={Math.ceil(H)} u={U} />}
      {split ? (
        <>
          <Poly points={A} color="blue" {...fA} />
          <Poly points={B} color="teal" {...fB} />
          <Label x={nx / 2} y={hh / 2} text="A" size={22} color="blue" />
          <Label x={(nx + w) / 2} y={(ny + hh) / 2} text="B" size={22} color="teal" />
        </>
      ) : (
        <Poly points={outline} color="blue" />
      )}
      <DimLabel a={outline[5]} b={outline[4]} text={lab(W, unit)} offset={-18} />
      <DimLabel a={outline[5]} b={outline[0]} text={lab(H, unit)} offset={18} />
      <DimLabel a={outline[2]} b={outline[3]} text={lab(cw, unit)} offset={-14} />
      <DimLabel a={outline[1]} b={outline[2]} text={lab(ch, unit)} offset={14} />
      <DimLabel a={outline[0]} b={outline[1]} text={known.includes("top") ? lab(W - cw, unit) : "?"} offset={18} highlight={focusState(focus, "top").strong} />
      <DimLabel a={outline[3]} b={outline[4]} text={known.includes("right") ? lab(H - ch, unit) : "?"} offset={-18} highlight={focusState(focus, "right").strong} />
    </FigureSvg>
  );
}

/* ---------- House pentagon (rectangle + triangle) ---------- */
export function HouseFig({ W, wall, roof, u, unit, focus, grid = true, split = false }: Common & {
  W: number; wall: number; roof: number; split?: boolean;
}) {
  const U = u ?? autoU(Math.max(W, wall + roof));
  const w = W * U, r = roof * U, total = (wall + roof) * U;
  const rect: Pt[] = [{ x: 0, y: r }, { x: w, y: r }, { x: w, y: total }, { x: 0, y: total }];
  const tri: Pt[] = [{ x: 0, y: r }, { x: w, y: r }, { x: w / 2, y: 0 }];
  return (
    <FigureSvg width={w} height={total} label="Pentagon shaped like a house">
      {grid && <Grid cols={Math.ceil(W)} rows={Math.ceil(wall + roof)} u={U} />}
      {split ? (
        <>
          <Poly points={rect} color="blue" {...focusState(focus, "rect")} />
          <Poly points={tri} color="gold" {...focusState(focus, "roof")} />
        </>
      ) : (
        <Poly points={[rect[3], rect[0], tri[2], rect[1], rect[2]]} color="blue" />
      )}
      <Seg a={tri[2]} b={{ x: w / 2, y: r }} dashed color="berry" />
      <Label x={w / 2 + 8} y={r / 2 + 4} text={lab(roof, unit)} anchor="start" color="berry" />
      <DimLabel a={rect[3]} b={rect[2]} text={lab(W, unit)} offset={-18} />
      <DimLabel a={rect[2]} b={rect[1]} text={lab(wall, unit)} offset={18} />
    </FigureSvg>
  );
}

/** Tiny thumbnail outline used on shape-picker chips. */
export function ShapeIcon({ points }: { points: Pt[] }) {
  return (
    <svg viewBox="0 0 32 24" width="32" height="24" aria-hidden="true">
      <polygon points={points.map((p) => `${p.x},${p.y}`).join(" ")} fill="var(--c-blue-soft)" stroke="var(--c-blue)" strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
  );
}
