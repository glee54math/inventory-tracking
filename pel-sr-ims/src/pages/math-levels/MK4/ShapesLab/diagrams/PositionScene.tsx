import { palette, diagramFont } from "../../../shared/lib/palette";

/**
 * The 5 positional relations this lab actually renders as distinct scenes.
 * "Next to" is a deliberate omission from this type — it's visually
 * identical to "beside" (there's no separate picture for it), so it's
 * treated purely as a vocabulary synonym explained in text, never its own
 * generated scene. See the lab's final report for this call.
 */
export type Relation = "above" | "below" | "beside" | "inFrontOf" | "behind";
export const RELATIONS: Relation[] = ["above", "below", "beside", "inFrontOf", "behind"];
export const RELATION_LABELS: Record<Relation, string> = {
  above: "Above",
  below: "Below",
  beside: "Beside",
  inFrontOf: "In front of",
  behind: "Behind",
};
/** The word you'd use for the SAME scene described from the other object's
 *  point of view — "beside" is its own reciprocal (symmetric relation). */
export const RELATION_RECIPROCAL: Record<Relation, Relation> = {
  above: "below",
  below: "above",
  beside: "beside",
  inFrontOf: "behind",
  behind: "inFrontOf",
};

export interface PositionSceneProps {
  /** Ball's position described relative to the box. */
  relation: Relation;
  /** Which side the ball sits on for "beside" — otherwise unused. */
  side?: "left" | "right";
}

/**
 * Two simple objects (an orange box, a blue ball) placed in one of 5
 * relations. The geometry itself is the "tell": above/below stack purely
 * vertically with a clear gap (no overlap), beside sits purely horizontally
 * with a clear gap (no overlap either), while in-front-of/behind overlap
 * with one object's shape visibly interrupted by the other — that overlap
 * is exactly what should separate "beside" from "in front of" for a
 * student, not just the word itself.
 */
export function PositionScene({ relation, side = "right" }: PositionSceneProps) {
  const W = 220;
  const H = 190;
  const boxCx = W / 2;
  const boxCy = 100;
  const boxHalf = 30;
  const gap = 46;

  let ballCx = boxCx;
  let ballCy = boxCy;
  let ballBehind = false;
  const ballR = 24;

  if (relation === "above") {
    ballCy = boxCy - gap - boxHalf - ballR;
  } else if (relation === "below") {
    ballCy = boxCy + gap + boxHalf + ballR;
  } else if (relation === "beside") {
    ballCx = boxCx + (side === "right" ? 1 : -1) * (gap + boxHalf + ballR);
  } else if (relation === "inFrontOf") {
    ballCx = boxCx + boxHalf * 0.55;
    ballCy = boxCy + boxHalf * 0.55;
  } else {
    // behind: ball mostly hidden, box drawn on top of it
    ballCx = boxCx - boxHalf * 0.45;
    ballCy = boxCy - boxHalf * 0.45;
    ballBehind = true;
  }

  const Box = (
    <rect x={boxCx - boxHalf} y={boxCy - boxHalf} width={boxHalf * 2} height={boxHalf * 2} fill={palette.b} stroke={palette.ink} strokeWidth={3} />
  );
  const Ball = <circle cx={ballCx} cy={ballCy} r={ballR} fill={palette.a} stroke={palette.ink} strokeWidth={3} opacity={ballBehind ? 0.85 : 1} />;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label="a box and a ball placed somewhere relative to each other"
      style={{ display: "block", width: "100%", maxWidth: W, height: "auto", fontFamily: diagramFont }}
    >
      {/* a faint ground line gives above/below a visual anchor */}
      <line x1={10} y1={160} x2={W - 10} y2={160} stroke={palette.line} strokeWidth={2} />
      {ballBehind && Ball}
      {Box}
      {!ballBehind && Ball}
    </svg>
  );
}
