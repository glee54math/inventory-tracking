import { palette, diagramFont } from "../../../shared/lib/palette";
import { toneColor, type ShapeKind } from "./Shape2D";
import type { SolidKind } from "./Solid3D";
import { useCountAlong } from "./countAlong";

// Simple pictures of real things, for K.G.1 "name the shapes of objects in
// the environment" (review C1-15, user decision 2026-11-25: Unit 1 "What
// shape is it?" and Unit 2 "What solid is it?"). Each thing's outline is
// close to its shape, so the shape is something the student can SEE.

/** Flat-looking things (Unit 1) and the flat shape each one is. */
export type FlatThing = "clock" | "cookie" | "door" | "book" | "pizza" | "window";
export const FLAT_THINGS: FlatThing[] = ["clock", "cookie", "door", "book", "pizza", "window"];
export const FLAT_THING_SHAPE: Record<FlatThing, ShapeKind> = {
  clock: "circle",
  cookie: "circle",
  door: "rectangle",
  book: "rectangle",
  pizza: "triangle",
  window: "square",
};
/** The thing's name with "the", as said in a prompt ("What shape is the clock?"). */
export const FLAT_THING_NAME: Record<FlatThing, string> = {
  clock: "the clock",
  cookie: "the cookie",
  door: "the door",
  book: "the book",
  pizza: "the pizza slice",
  window: "the window",
};

/** Solid things (Unit 2) and the solid each one is. */
export type SolidThing = "ball" | "block" | "can" | "hat";
export const SOLID_THINGS: SolidThing[] = ["ball", "block", "can", "hat"];
export const SOLID_THING_SHAPE: Record<SolidThing, SolidKind> = {
  ball: "sphere",
  block: "cube",
  can: "cylinder",
  hat: "cone",
};
export const SOLID_THING_NAME: Record<SolidThing, string> = {
  ball: "the ball",
  block: "the block",
  can: "the can",
  hat: "the party hat",
};

/** Each flat thing's corners, in order (none for round things). */
const CORNERS: Record<FlatThing, [number, number][]> = {
  clock: [],
  cookie: [],
  door: [
    [62, 22],
    [138, 22],
    [138, 184],
    [62, 184],
  ],
  book: [
    [32, 58],
    [168, 58],
    [168, 148],
    [32, 148],
  ],
  pizza: [
    [100, 26],
    [160, 168],
    [40, 168],
  ],
  window: [
    [42, 42],
    [158, 42],
    [158, 158],
    [42, 158],
  ],
};

export const flatThingCorners = (t: FlatThing) => CORNERS[t].length;

const svgStyle = { display: "block", width: "100%", maxWidth: 200, height: "auto", fontFamily: diagramFont } as const;
const HELP = "var(--qc, #8A4FD8)";

/**
 * A flat-looking real thing. Help props: `outline` draws the thing's shape
 * as a dashed line on top (after a wrong try), `cornerDots` dots its corners,
 * and `countCorners` numbers them one per beat ("Show me").
 */
export function FlatThingPicture({
  thing,
  tone = "a",
  outline = false,
  cornerDots = false,
  countCorners = false,
  traceDot = false,
  label = "a picture of a thing",
}: {
  thing: FlatThing;
  tone?: "a" | "b" | "c";
  outline?: boolean;
  cornerDots?: boolean;
  countCorners?: boolean;
  /** Help for a round thing: a dot runs around its edge. */
  traceDot?: boolean;
  label?: string;
}) {
  const color = toneColor(tone);
  const corners = CORNERS[thing];
  const shown = useCountAlong(countCorners && corners.length > 0, corners.length);
  let body;
  if (thing === "clock") {
    body = (
      <>
        <circle cx={100} cy={100} r={72} fill={palette.paper} stroke={color} strokeWidth={10} />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return <line key={i} x1={100 + 52 * Math.sin(a)} y1={100 - 52 * Math.cos(a)} x2={100 + 60 * Math.sin(a)} y2={100 - 60 * Math.cos(a)} stroke={palette.ink} strokeWidth={3} />;
        })}
        <line x1={100} y1={100} x2={100} y2={58} stroke={palette.ink} strokeWidth={5} strokeLinecap="round" />
        <line x1={100} y1={100} x2={130} y2={112} stroke={palette.ink} strokeWidth={5} strokeLinecap="round" />
        <circle cx={100} cy={100} r={5} fill={palette.ink} />
      </>
    );
  } else if (thing === "cookie") {
    body = (
      <>
        <circle cx={100} cy={100} r={70} fill={color} stroke={palette.ink} strokeWidth={3} />
        {[
          [75, 70],
          [120, 62],
          [140, 105],
          [95, 115],
          [65, 125],
          [118, 140],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={7} fill={palette.ink} opacity={0.75} />
        ))}
      </>
    );
  } else if (thing === "door") {
    body = (
      <>
        {/* No inner panels: only the 4 outside corners can be counted (review C2-11). */}
        <rect x={62} y={22} width={76} height={162} fill={color} stroke={palette.ink} strokeWidth={3} />
        <circle cx={126} cy={100} r={6} fill={palette.ink} />
      </>
    );
  } else if (thing === "book") {
    body = (
      <>
        <rect x={32} y={58} width={136} height={90} fill={color} stroke={palette.ink} strokeWidth={3} />
        <line x1={50} y1={58} x2={50} y2={148} stroke={palette.ink} strokeWidth={3} />
        <rect x={72} y={82} width={76} height={14} rx={4} fill={palette.paper} opacity={0.8} />
        <rect x={72} y={106} width={52} height={10} rx={4} fill={palette.paper} opacity={0.8} />
      </>
    );
  } else if (thing === "pizza") {
    body = (
      <>
        <polygon points="100,26 160,168 40,168" fill={color} stroke={palette.ink} strokeWidth={3} strokeLinejoin="round" />
        <line x1={44} y1={160} x2={156} y2={160} stroke={palette.ink} strokeWidth={10} opacity={0.35} strokeLinecap="round" />
        {[
          [100, 80],
          [84, 124],
          [120, 130],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={10} fill={palette.paper} stroke={palette.ink} strokeWidth={2} />
        ))}
      </>
    );
  } else {
    body = (
      <>
        {/* Glass with no crossbars: only the 4 outside corners can be counted (review C2-11). */}
        <rect x={42} y={42} width={116} height={116} fill="#dcefff" stroke={color} strokeWidth={10} />
      </>
    );
  }
  const round = corners.length === 0;
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} style={svgStyle}>
      {body}
      {outline &&
        (round ? (
          <circle cx={100} cy={100} r={80} fill="none" stroke={HELP} strokeWidth={5} strokeDasharray="10 6" />
        ) : (
          <polygon points={corners.map((p) => p.join(",")).join(" ")} fill="none" stroke={HELP} strokeWidth={5} strokeDasharray="10 6" strokeLinejoin="round" />
        ))}
      {(cornerDots || countCorners) && corners.map(([x, y], i) => <circle key={`d${i}`} cx={x} cy={y} r={i < shown ? 10 : 7} fill={i < shown ? HELP : palette.ink} stroke={palette.paper} strokeWidth={2} />)}
      {corners.slice(0, shown).map(([x, y], i) => {
        const d = Math.hypot(x - 100, y - 100) || 1;
        return (
          <text key={`n${i}`} x={x + ((x - 100) / d) * 20} y={y + ((y - 100) / d) * 20 + 6} textAnchor="middle" fontSize={18} fontWeight={700} fill={palette.ink}>
            {i + 1}
          </text>
        );
      })}
      {round && traceDot && (
        <circle r={9} fill={HELP} stroke={palette.ink} strokeWidth={2}>
          <animateMotion dur="2.4s" repeatCount="2" path="M 180 100 A 80 80 0 1 1 20 100 A 80 80 0 1 1 180 100" />
        </circle>
      )}
    </svg>
  );
}

/** A real solid thing. `clue` outlines the part that tells which solid it is.
 *  `ringEnd` (can only) rings its top end: Unit 2 "Look at the end of the can"
 *  (review C2-09, the twin of "the front of the cube"). */
export function SolidThingPicture({ thing, tone = "a", clue = false, ringEnd = false, label = "a picture of a thing" }: { thing: SolidThing; tone?: "a" | "b" | "c"; clue?: boolean; ringEnd?: boolean; label?: string }) {
  const color = toneColor(tone);
  let body;
  let help = null;
  let end = null;
  if (thing === "ball") {
    body = (
      <>
        <circle cx={100} cy={100} r={66} fill={color} stroke={palette.ink} strokeWidth={3} />
        <path d="M 34 100 Q 100 140 166 100" fill="none" stroke={palette.paper} strokeWidth={7} />
        <path d="M 100 34 Q 62 100 100 166" fill="none" stroke={palette.paper} strokeWidth={7} />
        <ellipse cx={100} cy={176} rx={52} ry={8} fill={palette.ink} opacity={0.15} />
      </>
    );
    help = <circle cx={100} cy={100} r={75} fill="none" stroke={HELP} strokeWidth={6} strokeDasharray="10 6" />;
  } else if (thing === "block") {
    // A true square front (review C2-01), the back slid up and right, centered.
    const s = 46;
    const dx = s * 0.62;
    const dy = -s * 0.5;
    const left = 100 - (2 * s + dx) / 2;
    const topY = 100 - (2 * s - dy) / 2 - dy;
    const FTL: [number, number] = [left, topY];
    const FTR: [number, number] = [left + 2 * s, topY];
    const FBR: [number, number] = [left + 2 * s, topY + 2 * s];
    const FBL: [number, number] = [left, topY + 2 * s];
    const BTL: [number, number] = [FTL[0] + dx, FTL[1] + dy];
    const BTR: [number, number] = [FTR[0] + dx, FTR[1] + dy];
    const BBR: [number, number] = [FBR[0] + dx, FBR[1] + dy];
    const pts = (p: [number, number][]) => p.map((q) => q.join(",")).join(" ");
    body = (
      <>
        <polygon points={pts([FTL, BTL, BTR, FTR])} fill={color} opacity={0.6} stroke={palette.ink} strokeWidth={2.5} />
        <polygon points={pts([FTR, BTR, BBR, FBR])} fill={color} opacity={0.8} stroke={palette.ink} strokeWidth={2.5} />
        <polygon points={pts([FTL, FTR, FBR, FBL])} fill={color} stroke={palette.ink} strokeWidth={2.5} />
        <rect x={FTL[0] + 8} y={FTL[1] + 8} width={2 * s - 16} height={2 * s - 16} fill="none" stroke={palette.paper} strokeWidth={4} />
        <text x={FTL[0] + s} y={FTL[1] + s + 15} textAnchor="middle" fontSize={44} fontWeight={800} fill={palette.paper}>
          A
        </text>
      </>
    );
    help = <rect x={FTL[0] - 8} y={FTL[1] - 8} width={2 * s + 16} height={2 * s + 16} rx={8} fill="none" stroke={HELP} strokeWidth={6} strokeDasharray="10 6" />;
  } else if (thing === "can") {
    const w = 46;
    const top = 40;
    const bot = 160;
    const ry = 14;
    body = (
      <>
        <rect x={100 - w} y={top} width={w * 2} height={bot - top} fill={color} />
        <rect x={100 - w} y={82} width={w * 2} height={36} fill={palette.paper} opacity={0.75} />
        <line x1={100 - w} y1={top} x2={100 - w} y2={bot} stroke={palette.ink} strokeWidth={2.5} />
        <line x1={100 + w} y1={top} x2={100 + w} y2={bot} stroke={palette.ink} strokeWidth={2.5} />
        <path d={`M ${100 - w} ${bot} A ${w} ${ry} 0 0 0 ${100 + w} ${bot}`} fill={color} stroke={palette.ink} strokeWidth={2.5} />
        <ellipse cx={100} cy={top} rx={w} ry={ry} fill={palette.line} stroke={palette.ink} strokeWidth={2.5} />
      </>
    );
    help = (
      <g fill="none" stroke={HELP} strokeWidth={6} strokeDasharray="10 6">
        <ellipse cx={100} cy={top} rx={w + 8} ry={ry + 8} />
        <ellipse cx={100} cy={bot} rx={w + 8} ry={ry + 8} />
      </g>
    );
    end = <ellipse cx={100} cy={top} rx={w + 9} ry={ry + 9} fill="none" stroke={HELP} strokeWidth={6} />;
  } else {
    // party hat
    body = (
      <>
        <polygon points="100,34 46,162 154,162" fill={color} stroke={palette.ink} strokeWidth={2.5} strokeLinejoin="round" />
        <line x1={78} y1={86} x2={122} y2={86} stroke={palette.paper} strokeWidth={6} />
        <line x1={64} y1={122} x2={136} y2={122} stroke={palette.paper} strokeWidth={6} />
        <path d="M 46 162 Q 100 186 154 162" fill={color} stroke={palette.ink} strokeWidth={2.5} />
        <circle cx={100} cy={28} r={11} fill={palette.paper} stroke={palette.ink} strokeWidth={2.5} />
      </>
    );
    help = <circle cx={100} cy={30} r={22} fill="none" stroke={HELP} strokeWidth={6} />;
  }
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} style={svgStyle}>
      {body}
      {clue && help}
      {ringEnd && end}
    </svg>
  );
}

/**
 * The can's end traced on paper (review C3-03): the can drawn in 3D shows
 * its end as a flat oval, so beside the ringed can an arrow points to a true
 * circle on a sheet of paper, as if the end were traced. Explore always shows
 * it; Practice shows it only in "Show me" (it gives away "Circle").
 */
export function CanEndTraced({ tone = "a", label = "the end of the can, traced" }: { tone?: "a" | "b" | "c"; label?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <div style={{ width: 130 }}>
        <SolidThingPicture thing="can" tone={tone} ringEnd label="a can with its end ringed" />
      </div>
      <svg viewBox="0 0 50 40" width={50} height={40} aria-hidden data-tts-skip style={{ flex: "none" }}>
        <line x1={4} y1={20} x2={34} y2={20} stroke={HELP} strokeWidth={5} strokeLinecap="round" />
        <polygon points="46,20 32,10 32,30" fill={HELP} />
      </svg>
      <div style={{ width: 104, padding: 6, background: "#fffdf5", border: "2px solid var(--line)", borderRadius: 6, boxShadow: "3px 3px 0 var(--line)" }}>
        <svg viewBox="0 0 120 120" role="img" aria-label={label} style={{ display: "block", width: "100%", height: "auto" }}>
          {/* About as wide on screen as the can's end beside it (both about 60 px). */}
          <circle cx={60} cy={60} r={39} fill="none" stroke={HELP} strokeWidth={6} />
        </svg>
      </div>
    </div>
  );
}
