import { palette, diagramFont } from "../../../shared/lib/palette";
import { toneColor } from "./Shape2D";

/** The four solid (3D) shapes Unit 2 names. */
export type SolidKind = "cube" | "cone" | "cylinder" | "sphere";
export const SOLID_KINDS: SolidKind[] = ["cube", "cone", "cylinder", "sphere"];
export const SOLID_LABELS: Record<SolidKind, string> = {
  cube: "Cube",
  cone: "Cone",
  cylinder: "Cylinder",
  sphere: "Sphere",
};

export interface SolidGlyphProps {
  kind: SolidKind;
  size?: number;
  tone?: "a" | "b" | "c";
  label?: string;
  /** A plain line drawing: outlines only, no shine or shadow (review C1-23:
   *  a solid is solid because you can pick it up, not because of shading). */
  plain?: boolean;
  /** Help: outline the part that tells which solid it is (the cone's point,
   *  the cylinder's two round ends, the cube's square front, the sphere's
   *  round outline). */
  clue?: boolean;
  /** Ring the cube's front (Unit 2 "Look at the front of the cube"). */
  ringFront?: boolean;
}

const CLUE = "var(--qc, #8A4FD8)";

/**
 * A simple drawing of each solid. The usual drawing has a little shine and
 * shadow; `plain` draws the same solid as outlines only, so the unit can
 * show that the drawing style is not what makes a shape solid.
 */
export function SolidGlyph({ kind, size = 56, tone = "a", label = "a solid shape", plain = false, clue = false, ringFront = false }: SolidGlyphProps) {
  const color = toneColor(tone);
  const fill = plain ? palette.paper : color;
  const common = { style: { display: "block", width: "100%", maxWidth: 200, height: "auto", fontFamily: diagramFont } };
  const cx = 100;
  const cy = 100;
  const op = (o: number) => (plain ? 1 : o);

  if (kind === "sphere") {
    return (
      <svg viewBox="0 0 200 200" role="img" aria-label={label} {...common}>
        <circle cx={cx} cy={cy} r={size} fill={fill} stroke={palette.ink} strokeWidth={3} />
        {plain ? (
          // a curved line across the middle, so the line drawing still reads as a ball
          <path d={`M ${cx - size} ${cy} Q ${cx} ${cy + size * 0.45} ${cx + size} ${cy}`} fill="none" stroke={palette.ink} strokeWidth={2} strokeDasharray="5 4" />
        ) : (
          <>
            <ellipse cx={cx - size * 0.35} cy={cy - size * 0.4} rx={size * 0.3} ry={size * 0.18} fill="#ffffff" opacity={0.55} />
            <ellipse cx={cx} cy={cy + size * 1.08} rx={size * 0.85} ry={size * 0.16} fill={palette.ink} opacity={0.18} />
          </>
        )}
        {clue && <circle cx={cx} cy={cy} r={size + 7} fill="none" stroke={CLUE} strokeWidth={6} strokeDasharray="10 6" />}
      </svg>
    );
  }

  if (kind === "cube") {
    // The front is a true square, 2s by 2s (review C2-01), with the back
    // slid up and right; the whole cube is centered in the picture.
    const s = size * 0.78;
    const dx = s * 0.62;
    const dy = -s * 0.5;
    const left = cx - (2 * s + dx) / 2;
    const topY = cy - (2 * s - dy) / 2 - dy;
    const FTL: [number, number] = [left, topY];
    const FTR: [number, number] = [left + 2 * s, topY];
    const FBR: [number, number] = [left + 2 * s, topY + 2 * s];
    const FBL: [number, number] = [left, topY + 2 * s];
    const BTL: [number, number] = [FTL[0] + dx, FTL[1] + dy];
    const BTR: [number, number] = [FTR[0] + dx, FTR[1] + dy];
    const top = [FTL, BTL, BTR, FTR].map((p) => p.join(",")).join(" ");
    const side = [FTR, BTR, [BTR[0], BTR[1] + 2 * s] as [number, number], FBR].map((p) => p.join(",")).join(" ");
    const front = [FTL, FTR, FBR, FBL].map((p) => p.join(",")).join(" ");
    const pad = 8;
    return (
      <svg viewBox="0 0 200 200" role="img" aria-label={label} {...common}>
        <polygon points={top} fill={fill} opacity={op(0.55)} stroke={palette.ink} strokeWidth={2.5} />
        <polygon points={side} fill={fill} opacity={op(0.8)} stroke={palette.ink} strokeWidth={2.5} />
        <polygon points={front} fill={fill} stroke={palette.ink} strokeWidth={2.5} />
        {(clue || ringFront) && (
          <rect x={FTL[0] - pad} y={FTL[1] - pad} width={FTR[0] - FTL[0] + 2 * pad} height={FBL[1] - FTL[1] + 2 * pad} rx={8} fill="none" stroke={CLUE} strokeWidth={6} strokeDasharray={ringFront ? undefined : "10 6"} />
        )}
      </svg>
    );
  }

  if (kind === "cone") {
    const w = size * 0.95;
    const h = size * 1.7;
    const baseY = cy + h * 0.42;
    const apexY = baseY - h;
    return (
      <svg viewBox="0 0 200 200" role="img" aria-label={label} {...common}>
        <ellipse cx={cx} cy={baseY} rx={w} ry={w * 0.32} fill={fill} opacity={op(0.6)} stroke={palette.ink} strokeWidth={2.5} />
        <polygon points={`${cx},${apexY} ${cx - w},${baseY} ${cx + w},${baseY}`} fill={fill} stroke={palette.ink} strokeWidth={2.5} />
        {plain && <path d={`M ${cx - w} ${baseY} Q ${cx} ${baseY + w * 0.64} ${cx + w} ${baseY}`} fill="none" stroke={palette.ink} strokeWidth={2.5} />}
        {clue && <circle cx={cx} cy={apexY} r={15} fill="none" stroke={CLUE} strokeWidth={6} />}
      </svg>
    );
  }

  // cylinder
  const w = size * 0.85;
  const h = size * 1.5;
  const topY = cy - h / 2;
  const botY = cy + h / 2;
  const ry = w * 0.3;
  return (
    <svg viewBox="0 0 200 200" role="img" aria-label={label} {...common}>
      <rect x={cx - w} y={topY} width={w * 2} height={h} fill={fill} stroke="none" />
      <line x1={cx - w} y1={topY} x2={cx - w} y2={botY} stroke={palette.ink} strokeWidth={2.5} />
      <line x1={cx + w} y1={topY} x2={cx + w} y2={botY} stroke={palette.ink} strokeWidth={2.5} />
      {plain ? (
        <path d={`M ${cx - w} ${botY} A ${w} ${ry} 0 0 0 ${cx + w} ${botY}`} fill="none" stroke={palette.ink} strokeWidth={2.5} />
      ) : (
        <ellipse cx={cx} cy={botY} rx={w} ry={ry} fill={fill} opacity={0.75} stroke={palette.ink} strokeWidth={2.5} />
      )}
      <ellipse cx={cx} cy={topY} rx={w} ry={ry} fill={fill} stroke={palette.ink} strokeWidth={2.5} />
      {clue && (
        <g fill="none" stroke={CLUE} strokeWidth={6} strokeDasharray="10 6">
          <ellipse cx={cx} cy={topY} rx={w + 7} ry={ry + 7} />
          <ellipse cx={cx} cy={botY} rx={w + 7} ry={ry + 7} />
        </g>
      )}
    </svg>
  );
}

/** What each solid's clue looks like, in a few words (hints and Show me). */
export const SOLID_CLUE: Record<SolidKind, string> = {
  cube: "It looks like a block.",
  cone: "It has a point on top.",
  cylinder: "It has two round ends.",
  sphere: "It is round all over.",
};
