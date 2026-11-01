import { useEffect, useRef, useState } from "react";
import { GeoCanvas, Poly, Segment } from "./Geo";
import { clipToSide, foldDir, foldEndpoints, foldPoint, FOLD_DIR_LABEL, isSymmetryLine, sameLine, type FoldLine, type Pt } from "../lib/geometry";

// ============================================================================
// Symmetry diagrams for Unit 5. Checked shared/diagrams/ first — nothing
// there reflects shapes. The fold checker below is lab-local and the FIRST
// promotion candidate in this lab: any later reflection/transformation
// content (e.g. grade 8 rigid motions) is a likely second consumer.
//
// The yes/no "does it match?" verdict ALWAYS comes from isSymmetryLine()
// (exact integer reflection in lib/geometry.ts). The float math here only
// animates the fold and draws the reflected outline.
// ============================================================================

const lineEnds = (line: FoldLine, cols: number, rows: number): [Pt, Pt] => foldEndpoints(line, 0.3, 0.3, cols - 0.3, rows - 0.3);

/** A shape on the grid with optional dashed fold line, optional "after the
 *  fold" outline (the reflection, green if it lands exactly on the shape,
 *  red if not), and optional solid lines showing every line of symmetry. */
export function SymmetryFigure({
  pts,
  cols,
  rows,
  dashed,
  showFold = false,
  allLines,
  cell = 26,
}: {
  pts: Pt[];
  cols: number;
  rows: number;
  dashed?: FoldLine;
  showFold?: boolean;
  allLines?: FoldLine[];
  cell?: number;
}) {
  const match = dashed ? isSymmetryLine(pts, dashed) : false;
  return (
    <GeoCanvas cols={cols} rows={rows} cell={cell} label="A shape on a grid">
      <Poly pts={pts} />
      {showFold && dashed && <Poly pts={pts.map((p) => foldPoint(p, dashed, -1))} fill="none" tone={match ? "good" : "bad"} width={3} dash opacity={0.9} />}
      {allLines?.map((l, i) => {
        const [a, b] = lineEnds(l, cols, rows);
        return <Segment key={i} a={a} b={b} tone="good" width={2.5} />;
      })}
      {dashed &&
        (() => {
          const [a, b] = lineEnds(dashed, cols, rows);
          return <Segment a={a} b={b} tone="c" width={3} dash />;
        })()}
    </GeoCanvas>
  );
}

export interface FoldShape {
  label: string;
  pts: Pt[];
  cols: number;
  rows: number;
  lines: FoldLine[];
  tries: FoldLine[];
}

/** Explore: pick a fold line, press Fold, and watch one half flip over onto
 *  the other. Keeps a tally of the lines of symmetry found so far. */
export function FoldChecker({ shape }: { shape: FoldShape }) {
  const [lineIdx, setLineIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [folding, setFolding] = useState(false);
  const [found, setFound] = useState<number[]>([]);
  const raf = useRef<number | undefined>(undefined);
  const line = shape.tries[lineIdx];
  const match = isSymmetryLine(shape.pts, line);
  const done = progress >= 1;

  useEffect(() => {
    if (!folding) return;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      setProgress(t);
      if (t < 1) raf.current = requestAnimationFrame(tick);
      else {
        setFolding(false);
        if (match) setFound((f) => (f.includes(lineIdx) ? f : [...f, lineIdx]));
      }
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current !== undefined) cancelAnimationFrame(raf.current);
    };
    // match/lineIdx can't change mid-fold (picking a line resets the fold)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [folding]);

  const pick = (i: number) => {
    setLineIdx(i);
    setProgress(0);
    setFolding(false);
  };

  const s = 1 - 2 * progress;
  const still = clipToSide(shape.pts, line, -1);
  const moving = clipToSide(shape.pts, line, 1).map((p) => foldPoint(p, line, s));
  const [la, lb] = lineEnds(line, shape.cols, shape.rows);
  const realFound = found.filter((i) => shape.lines.some((l) => sameLine(l, shape.tries[i]))).length;

  return (
    <div className="lasc-stack">
      <div className="control-row" style={{ flexWrap: "wrap" }}>
        {shape.tries.map((l, i) => (
          <button key={i} type="button" className={`btn ghost ${i === lineIdx ? "pressed" : ""}`} onClick={() => pick(i)} title={FOLD_DIR_LABEL[foldDir(l)]}>
            Fold line {i + 1} {found.includes(i) ? "✓" : ""}
          </button>
        ))}
      </div>
      <GeoCanvas cols={shape.cols} rows={shape.rows} cell={30} label={`A ${shape.label} with a fold line`}>
        {progress === 0 ? (
          <Poly pts={shape.pts} />
        ) : (
          <>
            <Poly pts={still} />
            <Poly pts={moving} fill="cSoft" opacity={0.85} />
            {done && <Poly pts={shape.pts.map((p) => foldPoint(p, line, -1))} fill="none" tone={match ? "good" : "bad"} dash width={3} />}
          </>
        )}
        <Segment a={la} b={lb} tone="c" width={3} dash />
      </GeoCanvas>
      <div className="control-row">
        <button type="button" className="btn primary" disabled={folding} onClick={() => (done ? pick(lineIdx) : setFolding(true))}>
          {done ? "Unfold" : "Fold it!"}
        </button>
      </div>
      {done && (
        <p className={`feedback ${match ? "good" : "bad"}`} role="status">
          {match
            ? "The halves match exactly — this IS a line of symmetry."
            : "The halves DON'T match — see the red outline sticking out? Passing through the middle isn't enough; this is not a line of symmetry."}
        </p>
      )}
      <p className="lasc-readout">
        Lines of symmetry found: <b>{realFound}</b>
        {realFound === shape.lines.length && shape.lines.length > 0 && ` — that's all ${shape.lines.length}!`}
        {shape.lines.length === 0 && done && !match && " (Keep trying… or decide this shape might have NONE.)"}
      </p>
    </div>
  );
}
