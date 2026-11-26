import { palette, diagramFont } from "../../../shared/lib/palette";

/**
 * The 5 positional relations this lab actually renders as distinct scenes.
 * "Next to" is the same picture as "beside", so Explore names it in the
 * beside scene ("Beside means next to.") instead of drawing its own scene.
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
/** The word for the SAME scene told about the box instead of the ball
 *  ("the ball is above the box" → "the box is below the ball"). */
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
  /** Which side the ball sits on for "beside" (and which way it leans for
   *  in front of / behind) — a picture choice only, never an answer. */
  side?: "left" | "right";
  /** Help after a wrong try: an arrow from the box to the ball (above, below,
   *  beside), or the hidden part outlined and blinking (in front of, behind). */
  help?: boolean;
  /** Help for "where is the box?": ring the box. */
  ringBox?: boolean;
}

const W = 220;
const H = 212;
const BOX_CX = W / 2;
const BOX_CY = 106;
const BOX_HALF = 30;

const BLINK = "@keyframes mk4-blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.15; } }";
const blink = { animation: "mk4-blink 1s ease-in-out 3" };

/**
 * Two simple objects (an orange box, a ball) placed in one of 5 relations.
 * The geometry itself is the "tell": above/below stack purely vertically
 * with a clear gap, beside sits purely horizontally with a clear gap, while
 * in-front-of/behind overlap with one object's shape visibly hidden by the
 * other.
 */
export function PositionScene({ relation, side = "right", help = false, ringBox = false }: PositionSceneProps) {
  const gap = 20;
  const ballR = 24;
  const dir = side === "right" ? 1 : -1;
  let ballCx = BOX_CX;
  let ballCy = BOX_CY;
  let ballBehind = false;

  if (relation === "above") ballCy = BOX_CY - gap - BOX_HALF - ballR;
  else if (relation === "below") ballCy = BOX_CY + gap + BOX_HALF + ballR;
  else if (relation === "beside") ballCx = BOX_CX + dir * (gap + BOX_HALF + ballR);
  else if (relation === "inFrontOf") {
    ballCx = BOX_CX + dir * BOX_HALF * 0.55;
    ballCy = BOX_CY + BOX_HALF * 0.55;
  } else {
    // behind: ball mostly hidden, box drawn on top of it
    ballCx = BOX_CX - dir * BOX_HALF * 0.45;
    ballCy = BOX_CY - BOX_HALF * 0.45;
    ballBehind = true;
  }

  const Box = <rect x={BOX_CX - BOX_HALF} y={BOX_CY - BOX_HALF} width={BOX_HALF * 2} height={BOX_HALF * 2} fill={palette.b} stroke={palette.ink} strokeWidth={3} />;
  const Ball = <circle cx={ballCx} cy={ballCy} r={ballR} fill={palette.a} stroke={palette.ink} strokeWidth={3} />;
  const overlap = relation === "inFrontOf" || relation === "behind";

  // Arrow from the box's edge toward the ball (above / below / beside help).
  let arrow = null;
  if (help && !overlap) {
    const dx = ballCx - BOX_CX;
    const dy = ballCy - BOX_CY;
    const d = Math.hypot(dx, dy) || 1;
    const ux = dx / d;
    const uy = dy / d;
    const x1 = BOX_CX + ux * (BOX_HALF - 6);
    const y1 = BOX_CY + uy * (BOX_HALF - 6);
    const x2 = ballCx - ux * (ballR + 2);
    const y2 = ballCy - uy * (ballR + 2);
    const head = `${x2},${y2} ${x2 - ux * 10 - uy * 7},${y2 - uy * 10 + ux * 7} ${x2 - ux * 10 + uy * 7},${y2 - uy * 10 - ux * 7}`;
    arrow = (
      <g style={blink}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={palette.c} strokeWidth={5} strokeLinecap="round" />
        <polygon points={head} fill={palette.c} />
      </g>
    );
  }

  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="a box and a ball" style={{ display: "block", width: "100%", maxWidth: W, height: "auto", fontFamily: diagramFont }}>
      {help && <style>{BLINK}</style>}
      {/* a faint ground line gives above/below a visual anchor */}
      <line x1={10} y1={H - 4} x2={W - 10} y2={H - 4} stroke={palette.line} strokeWidth={2} />
      {ballBehind && Ball}
      {Box}
      {!ballBehind && Ball}
      {/* Help for in front of / behind: the hidden object's outline blinks over the top. */}
      {help && relation === "inFrontOf" && (
        <rect style={blink} x={BOX_CX - BOX_HALF} y={BOX_CY - BOX_HALF} width={BOX_HALF * 2} height={BOX_HALF * 2} fill="none" stroke={palette.c} strokeWidth={4} strokeDasharray="7 5" />
      )}
      {help && relation === "behind" && <circle style={blink} cx={ballCx} cy={ballCy} r={ballR} fill="none" stroke={palette.c} strokeWidth={4} strokeDasharray="7 5" />}
      {arrow}
      {ringBox && <rect x={BOX_CX - BOX_HALF - 9} y={BOX_CY - BOX_HALF - 9} width={BOX_HALF * 2 + 18} height={BOX_HALF * 2 + 18} rx={12} fill="none" stroke={palette.c} strokeWidth={4} />}
    </svg>
  );
}

/** Where a ball can sit in the many-balls scene: three above, three below,
 *  two on each side (review C2-07: up to 3 in the asked area, so the count
 *  can be 0, 1, 2 or 3). */
export type BallSpot = "aboveL" | "aboveM" | "aboveR" | "belowL" | "belowM" | "belowR" | "left" | "farLeft" | "right" | "farRight";
export const BALL_SPOTS: BallSpot[] = ["aboveL", "aboveM", "aboveR", "belowL", "belowM", "belowR", "farLeft", "left", "right", "farRight"];
/** Which position word each spot is. */
export const SPOT_RELATION: Record<BallSpot, "above" | "below" | "beside"> = {
  aboveL: "above",
  aboveM: "above",
  aboveR: "above",
  belowL: "below",
  belowM: "below",
  belowR: "below",
  left: "beside",
  farLeft: "beside",
  right: "beside",
  farRight: "beside",
};

/**
 * One box with several balls around it (Unit 1's typed step, review C1-06:
 * "How many balls are above the box?"). `ring` shades the asked-about area
 * after a wrong try (no number); `numberWhere` numbers those balls (Show me),
 * or shows a big 0 in the area when it has none.
 */
export function ManyBallsScene({ spots, ring, numberWhere }: { spots: BallSpot[]; ring?: "above" | "below" | "beside"; numberWhere?: "above" | "below" | "beside" }) {
  const r = 16;
  const g = 10;
  const step = 2 * r + 4;
  const upY = BOX_CY - BOX_HALF - g - r;
  const downY = BOX_CY + BOX_HALF + g + r;
  const sideX = BOX_HALF + g + r;
  const pos: Record<BallSpot, [number, number]> = {
    aboveL: [BOX_CX - step, upY],
    aboveM: [BOX_CX, upY],
    aboveR: [BOX_CX + step, upY],
    belowL: [BOX_CX - step, downY],
    belowM: [BOX_CX, downY],
    belowR: [BOX_CX + step, downY],
    left: [BOX_CX - sideX, BOX_CY],
    farLeft: [BOX_CX - sideX - step, BOX_CY],
    right: [BOX_CX + sideX, BOX_CY],
    farRight: [BOX_CX + sideX + step, BOX_CY],
  };
  // Each area as a box: [x, y, width, height].
  const areas: Record<"above" | "below" | "beside", [number, number, number, number][]> = {
    above: [[BOX_CX - step - r - 7, upY - r - 7, 2 * step + 2 * r + 14, 2 * r + 14]],
    below: [[BOX_CX - step - r - 7, downY - r - 7, 2 * step + 2 * r + 14, 2 * r + 14]],
    beside: [
      [1, BOX_CY - r - 8, BOX_CX - BOX_HALF - 4, 2 * r + 16],
      [BOX_CX + BOX_HALF + 4, BOX_CY - r - 8, W - 1 - (BOX_CX + BOX_HALF + 4), 2 * r + 16],
    ],
  };
  const none = numberWhere !== undefined && !spots.some((s) => SPOT_RELATION[s] === numberWhere);
  let k = 0;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="a box with balls around it" style={{ display: "block", width: "100%", maxWidth: W, height: "auto", fontFamily: diagramFont }}>
      <line x1={10} y1={H - 4} x2={W - 10} y2={H - 4} stroke={palette.line} strokeWidth={2} />
      {ring && (
        <g fill={palette.cSoft} stroke={palette.c} strokeWidth={3} strokeDasharray="6 4">
          {areas[ring].map(([x, y, w, h], i) => (
            <rect key={i} x={x} y={y} width={w} height={h} rx={14} />
          ))}
        </g>
      )}
      <rect x={BOX_CX - BOX_HALF} y={BOX_CY - BOX_HALF} width={BOX_HALF * 2} height={BOX_HALF * 2} fill={palette.b} stroke={palette.ink} strokeWidth={3} />
      {BALL_SPOTS.filter((s) => spots.includes(s)).map((s) => {
        const [x, y] = pos[s];
        const numbered = numberWhere && SPOT_RELATION[s] === numberWhere;
        if (numbered) k += 1;
        return (
          <g key={s}>
            <circle cx={x} cy={y} r={r} fill={palette.a} stroke={palette.ink} strokeWidth={3} />
            {numbered && (
              <text x={x} y={y + 6} textAnchor="middle" fontSize={18} fontWeight={800} fill={palette.paper}>
                {k}
              </text>
            )}
          </g>
        );
      })}
      {/* "Show me" when the area is empty: a big 0 there (a 0 answer still changes the picture). */}
      {none &&
        areas[numberWhere].map(([x, y, w, h], i) => (
          <text key={`z${i}`} x={x + w / 2} y={y + h / 2 + 11} textAnchor="middle" fontSize={32} fontWeight={800} fill={palette.c}>
            0
          </text>
        ))}
    </svg>
  );
}
