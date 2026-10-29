import { palette, diagramFont } from "../../../shared/lib/palette";

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

// A simple isometric-ish cube: 8 corners ("clay balls"), 12 edges ("sticks").
// Single source of truth for both the interactive builder below and the
// static preview used by Unit 4's Test questions, so a Test's "which picture
// is a complete cube frame" distractor is always a well-defined departure
// from this exact geometry, never an independently-drawn guess.
const S = 46;
const CX = 100;
const CY = 108;
const DX = S * 0.62;
const DY = -S * 0.5;
const FTL: [number, number] = [CX - S, CY - S * 0.3];
const FTR: [number, number] = [CX + S, CY - S * 0.3];
const FBR: [number, number] = [CX + S, CY + S * 1.05];
const FBL: [number, number] = [CX - S, CY + S * 1.05];
const BTL: [number, number] = [FTL[0] + DX, FTL[1] + DY];
const BTR: [number, number] = [FTR[0] + DX, FTR[1] + DY];
const BBR: [number, number] = [FBR[0] + DX, FBR[1] + DY];
const BBL: [number, number] = [FBL[0] + DX, FBL[1] + DY];

/** Vertex 0-7, in this fixed order: front face (0-3), back face (4-7). */
export const CUBE_VERTICES: [number, number][] = [FTL, FTR, FBR, FBL, BTL, BTR, BBR, BBL];

/** The 12 edges, as [vertexIndex, vertexIndex] pairs: front face (4),
 *  back face (4), the 4 connectors between them. */
export const CUBE_EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 0],
  [4, 5],
  [5, 6],
  [6, 7],
  [7, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

export interface CubeFrameBuilderProps {
  tone?: "a" | "b" | "c";
  /** Edge indices (into CUBE_EDGES) already placed as a stick, any order. */
  placed: number[];
  onToggle?: (edgeIndex: number) => void;
}

/** Click-to-place sandbox for building a cube's WIREFRAME out of sticks
 *  (edges) and clay (corners, already placed as dots) — the 3D counterpart
 *  to StickBuilder.tsx's 2D polygon version, for K.G.5's "model a solid
 *  shape from components" bucket. */
export function CubeFrameBuilder({ tone = "a", placed, onToggle }: CubeFrameBuilderProps) {
  const color = toneColor(tone);
  const interactive = !!onToggle;
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={`a cube's corners with ${CUBE_EDGES.length} gaps to fill with sticks`}
      style={{ display: "block", width: "100%", maxWidth: 200, height: "auto", fontFamily: diagramFont }}
    >
      {CUBE_EDGES.map(([a, b], i) => {
        const [x1, y1] = CUBE_VERTICES[a];
        const [x2, y2] = CUBE_VERTICES[b];
        const done = placed.includes(i);
        return (
          <g key={i} style={interactive ? { cursor: "pointer" } : undefined} onClick={interactive ? () => onToggle!(i) : undefined}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={done ? color : palette.line} strokeWidth={done ? 7 : 3} strokeDasharray={done ? undefined : "6 6"} />
            {interactive && <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="transparent" strokeWidth={20} />}
          </g>
        );
      })}
      {CUBE_VERTICES.map((p, i) => (
        <circle key={`v${i}`} cx={p[0]} cy={p[1]} r={6} fill={palette.ink} />
      ))}
    </svg>
  );
}

/** Static picture of a (possibly incomplete) cube frame — `presentEdges`
 *  lists which of the 12 fixed CUBE_EDGES indices are drawn as solid sticks;
 *  any index left out is simply not drawn at all (not even dashed), so an
 *  incomplete frame genuinely looks unfinished rather than "not yet clicked." */
export function CubeFramePreview({ presentEdges, tone = "a" }: { presentEdges: number[]; tone?: "a" | "b" | "c" }) {
  const color = toneColor(tone);
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label="a picture of a cube made of sticks and clay corners"
      style={{ display: "block", width: "100%", maxWidth: 200, height: "auto", fontFamily: diagramFont }}
    >
      {presentEdges.map((i) => {
        const [a, b] = CUBE_EDGES[i];
        const [x1, y1] = CUBE_VERTICES[a];
        const [x2, y2] = CUBE_VERTICES[b];
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={7} />;
      })}
      {CUBE_VERTICES.map((p, i) => (
        <circle key={`v${i}`} cx={p[0]} cy={p[1]} r={6} fill={palette.ink} />
      ))}
    </svg>
  );
}
