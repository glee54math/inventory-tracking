import { AngleFigure, type FigArc, type FigRay } from "./AngleFigure";
import { Protractor, type ProtractorMark } from "./Protractor";
import type { Tone } from "./angleGeometry";
import { MathText } from "../../../shared/components/MathText";

// Ready-made pictures used by both a unit's Practice file and its Test file
// (a third module, so neither has to import the other — see the
// circular-import rule in the build brief).

/** One turn from `base`, counter-clockwise by `m` degrees, with the turn shaded. */
export function TurnPicture({ base, m, label, width = 220, circle = true, len = 90 }: { base: number; m: number; label?: string; width?: number; circle?: boolean; len?: number }) {
  return (
    <MathText>
      <AngleFigure
        rays={[
          { dir: base, len },
          { dir: base + m, len, tone: "a" },
        ]}
        arcs={[{ from: base, sweep: m, r: 30, tone: "c", fill: true, label }]}
        showCircle={circle}
        width={width}
        ariaLabel={`An angle that turns ${label ?? "some amount"}`}
      />
    </MathText>
  );
}

/** Two angles side by side, captioned "Angle A" and "Angle B". */
export function PairPicture({ a, b, labels }: { a: { base: number; m: number; len: number }; b: { base: number; m: number; len: number }; labels?: [string | undefined, string | undefined] }) {
  const one = (x: { base: number; m: number; len: number }, label: string | undefined, name: string) => (
    <figure className="ap-fig">
      <AngleFigure
        rays={[
          { dir: x.base, len: x.len },
          { dir: x.base + x.m, len: x.len, tone: "a" },
        ]}
        arcs={[{ from: x.base, sweep: x.m, r: 22, tone: "c", fill: true, label }]}
        frameRadius={128}
        width={170}
        ariaLabel={`Angle ${name}`}
      />
      <figcaption>Angle {name}</figcaption>
    </figure>
  );
  return (
    <MathText>
      <div className="ap-figs">
        {one(a, labels?.[0], "A")}
        {one(b, labels?.[1], "B")}
      </div>
    </MathText>
  );
}

/** A protractor (flat, curved side up) with a black base ray, a purple measured ray, and the angle shaded. */
export function ReadPicture({ baseDir, rayDir, width = 380, marks, extraRays }: { baseDir: number | null; rayDir: number | null; width?: number; marks?: ProtractorMark[]; extraRays?: { dir: number; tone: Tone }[] }) {
  const rays = [...(baseDir !== null ? [{ dir: baseDir, tone: "ink" as Tone }] : []), ...(rayDir !== null ? [{ dir: rayDir, tone: "c" as Tone }] : []), ...(extraRays ?? [])];
  let arc: { from: number; sweep: number } | null = null;
  if (baseDir !== null && rayDir !== null) {
    const lo = Math.min(baseDir, rayDir);
    arc = { from: lo, sweep: Math.abs(rayDir - baseDir) };
  }
  return <Protractor rays={rays} arc={arc} marks={marks} width={width} ariaLabel="A protractor measuring an angle" />;
}

/** An angle split into parts (Unit 4): rays at the running totals, one colored arc per part, and an optional outer arc for the whole. */
export function PartsPicture({
  base,
  parts,
  partLabels,
  wholeLabel,
  squareWhole,
  width = 280,
}: {
  base: number;
  parts: number[];
  partLabels: (string | undefined)[];
  /** Label for the big outer arc around the whole angle — omit for no whole arc. */
  wholeLabel?: string;
  /** Mark the whole as a square corner (a right angle with no number written on it). */
  squareWhole?: boolean;
  width?: number;
}) {
  const tones: Tone[] = ["a", "b", "c"];
  const rays: FigRay[] = [{ dir: base, len: 120 }];
  const arcs: FigArc[] = [];
  let at = base;
  parts.forEach((p, i) => {
    arcs.push({ from: at, sweep: p, r: 44 + (i % 2) * 12, tone: tones[i % 3], fill: true, label: partLabels[i] });
    at += p;
    rays.push({ dir: at, len: 120 });
  });
  const total = parts.reduce((s, p) => s + p, 0);
  if (squareWhole) arcs.push({ from: base, sweep: 90, r: 22, tone: "ink", square: true });
  else if (wholeLabel !== undefined) arcs.push({ from: base, sweep: total, r: 98, tone: "ink", label: wholeLabel });
  return <AngleFigure rays={rays} arcs={arcs} width={width} ariaLabel="An angle split into smaller angles" />;
}
