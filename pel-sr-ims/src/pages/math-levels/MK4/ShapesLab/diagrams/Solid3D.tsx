import { palette, diagramFont } from "../../../shared/lib/palette";

/** The four solid (3D) shapes Unit 2 names. */
export type SolidKind = "cube" | "cone" | "cylinder" | "sphere";
export const SOLID_KINDS: SolidKind[] = ["cube", "cone", "cylinder", "sphere"];
export const SOLID_LABELS: Record<SolidKind, string> = {
  cube: "Cube",
  cone: "Cone",
  cylinder: "Cylinder",
  sphere: "Sphere",
};

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

export interface SolidGlyphProps {
  kind: SolidKind;
  size?: number;
  tone?: "a" | "b" | "c";
  label?: string;
}

/**
 * A simple pseudo-3D rendering of each solid — every one gets a visible
 * shading/highlight cue (multiple faces at different opacity for the cube,
 * a shaded base ellipse for the cone, two end ellipses for the cylinder, a
 * highlight+shadow pair for the sphere) specifically so it reads as having
 * DEPTH, not just a flat silhouette — that shading is the actual visual
 * tell Unit 2's circle-vs-sphere / square-vs-cube bucket trains students to
 * notice. A plain <rect>/`paper` background sits behind every glyph so the
 * opacity layering reads correctly regardless of whatever page background
 * this is dropped onto (unlike ShapeGlyph's flat shapes, which don't need one).
 */
export function SolidGlyph({ kind, size = 56, tone = "a", label = "a solid shape" }: SolidGlyphProps) {
  const color = toneColor(tone);
  const common = { style: { display: "block", width: "100%", maxWidth: 200, height: "auto", fontFamily: diagramFont } };
  const cx = 100;
  const cy = 100;

  if (kind === "sphere") {
    return (
      <svg viewBox="0 0 200 200" role="img" aria-label={label} {...common}>
        <rect x={0} y={0} width={200} height={200} fill={palette.paper} />
        <circle cx={cx} cy={cy} r={size} fill={color} stroke={palette.ink} strokeWidth={3} />
        {/* highlight (makes it read as round/glossy, not a flat disk) */}
        <ellipse cx={cx - size * 0.35} cy={cy - size * 0.4} rx={size * 0.3} ry={size * 0.18} fill="#ffffff" opacity={0.55} />
        {/* soft contact shadow beneath, implying it rests on a surface */}
        <ellipse cx={cx} cy={cy + size * 1.08} rx={size * 0.85} ry={size * 0.16} fill={palette.ink} opacity={0.18} />
      </svg>
    );
  }

  if (kind === "cube") {
    const s = size * 0.78;
    const dx = s * 0.62;
    const dy = -s * 0.5;
    const FTL: [number, number] = [cx - s, cy - s * 0.3];
    const FTR: [number, number] = [cx + s, cy - s * 0.3];
    const FBR: [number, number] = [cx + s, cy + s * 1.05];
    const FBL: [number, number] = [cx - s, cy + s * 1.05];
    const BTL: [number, number] = [FTL[0] + dx, FTL[1] + dy];
    const BTR: [number, number] = [FTR[0] + dx, FTR[1] + dy];
    const top = [FTL, BTL, BTR, FTR].map((p) => p.join(",")).join(" ");
    const side = [FTR, BTR, [BTR[0], BTR[1] + s * 1.35] as [number, number], FBR].map((p) => p.join(",")).join(" ");
    const front = [FTL, FTR, FBR, FBL].map((p) => p.join(",")).join(" ");
    return (
      <svg viewBox="0 0 200 200" role="img" aria-label={label} {...common}>
        <rect x={0} y={0} width={200} height={200} fill={palette.paper} />
        <polygon points={top} fill={color} opacity={0.55} stroke={palette.ink} strokeWidth={2.5} />
        <polygon points={side} fill={color} opacity={0.8} stroke={palette.ink} strokeWidth={2.5} />
        <polygon points={front} fill={color} opacity={1} stroke={palette.ink} strokeWidth={2.5} />
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
        <rect x={0} y={0} width={200} height={200} fill={palette.paper} />
        <ellipse cx={cx} cy={baseY} rx={w} ry={w * 0.32} fill={color} opacity={0.6} stroke={palette.ink} strokeWidth={2.5} />
        <polygon points={`${cx},${apexY} ${cx - w},${baseY} ${cx + w},${baseY}`} fill={color} stroke={palette.ink} strokeWidth={2.5} />
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
      <rect x={0} y={0} width={200} height={200} fill={palette.paper} />
      <rect x={cx - w} y={topY} width={w * 2} height={h} fill={color} stroke="none" />
      <line x1={cx - w} y1={topY} x2={cx - w} y2={botY} stroke={palette.ink} strokeWidth={2.5} />
      <line x1={cx + w} y1={topY} x2={cx + w} y2={botY} stroke={palette.ink} strokeWidth={2.5} />
      <ellipse cx={cx} cy={botY} rx={w} ry={ry} fill={color} opacity={0.75} stroke={palette.ink} strokeWidth={2.5} />
      <ellipse cx={cx} cy={topY} rx={w} ry={ry} fill={color} opacity={1} stroke={palette.ink} strokeWidth={2.5} />
    </svg>
  );
}
