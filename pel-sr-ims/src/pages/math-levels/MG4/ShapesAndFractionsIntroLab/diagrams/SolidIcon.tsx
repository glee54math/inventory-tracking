import { palette } from "../../../shared/lib/palette";

// ============================================================================
// Lightweight 3D solid icons for Unit 2's "compose a 3D composite" bucket.
//
// SCOPE DECISION (documented in the build report): MG11/GeometryLab/shapes/
// already has a full oblique-projection 3D engine (Solid3D, real face/vertex
// math, hidden-edge dashing) — but that's grade-6 content built for genuine
// 3D geometry reasoning (surface area, nets, volume). Reusing or matching
// that fidelity here would be substantially heavier than this bucket's own
// 1st-grade goal, which per 1.G.2 is just "stack/recognize two basic solids,"
// not compute anything about them. Per the plan's own flagged open question,
// this bucket is scoped DOWN to flat, static, clearly-labeled-by-shape icon
// glyphs (not a real projection, not draggable/rotatable) — simple enough
// that a cube/cone/cylinder/sphere are each instantly recognizable by a 1st
// grader, used only for simple vertical "stack two solids into a tower"
// composing/decomposing questions, never full interactive 3D composition.
// ============================================================================

export type SolidKind = "cube" | "cone" | "cylinder" | "sphere";

export const SOLID_NAMES: Record<SolidKind, string> = {
  cube: "cube",
  cone: "cone",
  cylinder: "cylinder",
  sphere: "sphere",
};

/** One solid's flat icon, drawn inside its own [x, x+w] x [y, y+h] box (y grows
 *  downward) — bottom-aligned so stacking two of these just means placing the
 *  next box directly on top of the previous one's y. */
function SolidGlyph({ kind, x, y, w, h, color }: { kind: SolidKind; x: number; y: number; w: number; h: number; color: string }) {
  const stroke = palette.ink;
  const cx = x + w / 2;
  switch (kind) {
    case "cube": {
      // Three visible faces (front, top, right) via a fixed depth offset —
      // just enough of a 3D cue to read as a box, not a real projection.
      const d = w * 0.22;
      const frontX = x,
        frontY = y + d,
        frontW = w - d,
        frontH = h - d;
      return (
        <g>
          <polygon points={`${frontX},${frontY} ${frontX + frontW},${frontY} ${frontX + frontW},${frontY + frontH} ${frontX},${frontY + frontH}`} style={{ fill: color, stroke, strokeWidth: 2 }} />
          <polygon points={`${frontX},${frontY} ${frontX + d},${y} ${frontX + frontW + d},${y} ${frontX + frontW},${frontY}`} style={{ fill: color, stroke, strokeWidth: 2, opacity: 0.85 }} />
          <polygon
            points={`${frontX + frontW},${frontY} ${frontX + frontW + d},${y} ${frontX + frontW + d},${y + frontH} ${frontX + frontW},${frontY + frontH}`}
            style={{ fill: color, stroke, strokeWidth: 2, opacity: 0.65 }}
          />
        </g>
      );
    }
    case "cone": {
      const baseY = y + h;
      const rx = w / 2;
      const ry = h * 0.14;
      return (
        <g>
          <polygon points={`${cx},${y} ${x},${baseY} ${x + w},${baseY}`} style={{ fill: color, stroke, strokeWidth: 2 }} />
          <ellipse cx={cx} cy={baseY} rx={rx} ry={ry} style={{ fill: color, stroke, strokeWidth: 2 }} />
        </g>
      );
    }
    case "cylinder": {
      const rx = w / 2;
      const ry = h * 0.14;
      const topY = y + ry;
      const bottomY = y + h - ry;
      return (
        <g>
          <rect x={x} y={topY} width={w} height={bottomY - topY} style={{ fill: color, stroke: "none" }} />
          <line x1={x} y1={topY} x2={x} y2={bottomY} style={{ stroke, strokeWidth: 2 }} />
          <line x1={x + w} y1={topY} x2={x + w} y2={bottomY} style={{ stroke, strokeWidth: 2 }} />
          <ellipse cx={cx} cy={bottomY} rx={rx} ry={ry} style={{ fill: color, stroke, strokeWidth: 2 }} />
          <path d={`M ${x} ${topY} A ${rx} ${ry} 0 0 1 ${x + w} ${topY}`} style={{ fill: color, stroke, strokeWidth: 2 }} />
          <path d={`M ${x} ${topY} A ${rx} ${ry} 0 0 0 ${x + w} ${topY}`} style={{ fill: "none", stroke, strokeWidth: 1.4, strokeDasharray: "3 3" }} />
        </g>
      );
    }
    case "sphere": {
      const r = Math.min(w, h) / 2;
      return (
        <g>
          <circle cx={cx} cy={y + h - r} r={r} style={{ fill: color, stroke, strokeWidth: 2 }} />
          <ellipse cx={cx} cy={y + h - r * 1.35} rx={r * 0.5} ry={r * 0.22} style={{ fill: "#ffffff", opacity: 0.35 }} />
        </g>
      );
    }
  }
}

export interface SolidTowerProps {
  /** Bottom solid first, e.g. ["cube", "cone"] stacks a cone on a cube. */
  solids: SolidKind[];
  width?: number;
  height?: number;
  label?: string;
}

/** A simple vertical stack of 2 (occasionally 3) solids, bottom-up — the only
 *  "3D composite" shape this lab builds, per the scope decision above. */
export function SolidTower({ solids, width = 140, height = 150, label }: SolidTowerProps) {
  const boxH = height / solids.length;
  const boxW = width * 0.62;
  const x = (width - boxW) / 2;
  const colors = [palette.aSoft, palette.bSoft, palette.cSoft];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} style={{ maxWidth: "100%" }} role="img" aria-label={label ?? `A tower of ${solids.map((s) => SOLID_NAMES[s]).join(" and ")}`}>
      {solids.map((kind, i) => {
        // `solids[0]` is the BOTTOM of the tower (per this prop's own doc
        // comment), so it belongs in the LAST slot counting from the top of
        // the canvas — slot index (n-1-i), not i.
        const slotFromTop = solids.length - 1 - i;
        return <SolidGlyph key={i} kind={kind} x={x} y={slotFromTop * boxH} w={boxW} h={boxH} color={colors[i % colors.length]} />;
      })}
    </svg>
  );
}
