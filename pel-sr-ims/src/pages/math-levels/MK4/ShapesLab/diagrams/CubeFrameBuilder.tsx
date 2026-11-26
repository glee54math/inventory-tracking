import { palette, diagramFont } from "../../../shared/lib/palette";
import { useCountAlong } from "./countAlong";

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

// A simple isometric-ish cube: 8 corners ("clay balls"), 12 sticks.
// Single source of truth for the join-the-balls builder (StickBuilder.tsx's
// JoinBuilder with these balls) and the static picture used by Practice and
// the Tests, so a "which cube has every stick?" wrong picture is always a
// well-defined change from this exact geometry.
// The front is a TRUE square (2S by 2S; review C2-01: it was 1.48 times wider
// than tall while the lab says "the front is a square"). The back square is
// slid up and right; the whole cube is centered in the 200 x 200 picture.
const S = 48;
const DX = S * 0.62;
const DY = -S * 0.5;
const LEFT = 100 - (2 * S + DX) / 2;
const TOP = 100 - (2 * S - DY) / 2 - DY;
const FTL: [number, number] = [LEFT, TOP];
const FTR: [number, number] = [LEFT + 2 * S, TOP];
const FBR: [number, number] = [LEFT + 2 * S, TOP + 2 * S];
const FBL: [number, number] = [LEFT, TOP + 2 * S];
const BTL: [number, number] = [FTL[0] + DX, FTL[1] + DY];
const BTR: [number, number] = [FTR[0] + DX, FTR[1] + DY];
const BBR: [number, number] = [FBR[0] + DX, FBR[1] + DY];
const BBL: [number, number] = [FBL[0] + DX, FBL[1] + DY];

/** Vertex 0-7, in this fixed order: front face (0-3), back face (4-7). */
export const CUBE_VERTICES: [number, number][] = [FTL, FTR, FBR, FBL, BTL, BTR, BBR, BBL];

/** The 12 sticks, as [ballIndex, ballIndex] pairs (smaller first): front
 *  square (4), back square (4), the 4 joining them. */
export const CUBE_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [0, 3],
  [4, 5],
  [5, 6],
  [6, 7],
  [4, 7],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

/** Static picture of a (possibly incomplete) cube frame — `presentEdges`
 *  lists which of the 12 fixed CUBE_EDGES indices are drawn as solid sticks;
 *  any index left out is simply not drawn at all (not even dashed), so an
 *  incomplete frame genuinely looks unfinished rather than "not yet clicked." */
export function CubeFramePreview({
  presentEdges,
  tone = "a",
  countCorners = false,
  countSticks = false,
  ringBall,
  litBall,
}: {
  presentEdges: number[];
  tone?: "a" | "b" | "c";
  /** "Show me" demo: light up and number the clay balls one at a time, in
   *  step with the spoken count (see countAlong.ts). */
  countCorners?: boolean;
  /** "Show me" demo: light up and number the sticks one at a time. */
  countSticks?: boolean;
  /** Ring one clay ball (Unit 4 CFU "How many sticks meet here?"). */
  ringBall?: number;
  /** Light and number the sticks that meet at this ball (that CFU's show-it; review C2-06). */
  litBall?: number;
}) {
  const color = toneColor(tone);
  const shown = useCountAlong(countCorners, CUBE_VERTICES.length);
  const sticksShown = useCountAlong(countSticks, presentEdges.length);
  const mx = CUBE_VERTICES.reduce((a, p) => a + p[0], 0) / CUBE_VERTICES.length;
  const my = CUBE_VERTICES.reduce((a, p) => a + p[1], 0) / CUBE_VERTICES.length;
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="a cube made of sticks and clay balls"
      style={{ display: "block", width: "100%", maxWidth: 200, height: "auto", fontFamily: diagramFont }}
    >
      {presentEdges.map((i, k) => {
        const [a, b] = CUBE_EDGES[i];
        const [x1, y1] = CUBE_VERTICES[a];
        const [x2, y2] = CUBE_VERTICES[b];
        const lit = litBall !== undefined && (a === litBall || b === litBall);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={k < sticksShown || lit ? palette.c : color} strokeWidth={lit ? 10 : 7} strokeLinecap="round" />;
      })}
      {ringBall !== undefined && <circle cx={CUBE_VERTICES[ringBall][0]} cy={CUBE_VERTICES[ringBall][1]} r={17} fill="none" stroke={palette.c} strokeWidth={4} />}
      {CUBE_VERTICES.map((p, i) => (
        <circle key={`v${i}`} cx={p[0]} cy={p[1]} r={i < shown ? 10 : 6} fill={i < shown ? palette.c : palette.ink} stroke={i < shown ? palette.ink : undefined} strokeWidth={2} />
      ))}
      {presentEdges.slice(0, sticksShown).map((e, k) => {
        const [a, b] = CUBE_EDGES[e];
        const x = (CUBE_VERTICES[a][0] + CUBE_VERTICES[b][0]) / 2;
        const y = (CUBE_VERTICES[a][1] + CUBE_VERTICES[b][1]) / 2;
        return (
          <text key={`s${k}`} x={x} y={y - 6} textAnchor="middle" fontSize={15} fontWeight={800} fill={palette.ink} stroke={palette.paper} strokeWidth={4} paintOrder="stroke">
            {k + 1}
          </text>
        );
      })}
      {litBall !== undefined &&
        CUBE_EDGES.filter(([a, b]) => a === litBall || b === litBall).map(([a, b], k) => {
          // The number sits by the middle of the stick, pushed out away from the cube's middle.
          const o = a === litBall ? b : a;
          const [bx, by] = CUBE_VERTICES[litBall];
          const midX = (bx + CUBE_VERTICES[o][0]) / 2;
          const midY = (by + CUBE_VERTICES[o][1]) / 2;
          const d = Math.hypot(midX - mx, midY - my) || 1;
          const x = midX + ((midX - mx) / d) * 14;
          const y = midY + ((midY - my) / d) * 14 + 6;
          return (
            <text key={`l${k}`} x={x} y={y} textAnchor="middle" fontSize={17} fontWeight={800} fill={palette.ink} stroke={palette.paper} strokeWidth={4} paintOrder="stroke">
              {k + 1}
            </text>
          );
        })}
      {CUBE_VERTICES.slice(0, shown).map(([x, y], i) => {
        const d = Math.hypot(x - mx, y - my) || 1;
        return (
          <text key={`n${i}`} x={x + ((x - mx) / d) * 20} y={y + ((y - my) / d) * 20 + 6} textAnchor="middle" fontSize={17} fontWeight={700} fill={palette.ink}>
            {i + 1}
          </text>
        );
      })}
    </svg>
  );
}
