import { palette } from "../../../shared/lib/palette";

export interface PolygonOutlineProps {
  /** Side lengths in order, walking around the polygon. `null` marks the one
   *  unknown side (shown as "?") for a missing-side-length question. A
   *  general polygon is drawn as a schematic regular N-gon at a FIXED visual
   *  size — deliberately not to scale ("figure not drawn to scale, use the
   *  given numbers," same convention as print textbooks), since the point
   *  of this unit is summing the given lengths, not judging them by eye. */
  sides: (number | null)[];
  /** Draw an actual axis-aligned rectangle (proportional to sides[0] x
   *  sides[1]) instead of a regular 4-gon, which would render as a square/
   *  diamond. Side order is top, right, bottom, left. */
  rectangle?: boolean;
  /** Side indices to leave unlabeled — e.g. [2, 3] for a rectangle given
   *  only by its length and width (the 2 × length + 2 × width bucket). */
  hideLabels?: number[];
  unit?: string;
  size?: number;
  caption?: string;
}

/**
 * Unit 5's perimeter picture: a polygon (or true rectangle) with each side
 * labeled just outside its own edge and the whole boundary traced in one
 * color — "perimeter is the trip around the outside," made literal. Label
 * positions come from each edge's own midpoint pushed outward from the
 * shape's center, so labels never sit on the stroke for any N.
 */
export function PolygonOutline({ sides, rectangle, hideLabels = [], unit, size = 200, caption }: PolygonOutlineProps) {
  const n = sides.length;
  const cx = size / 2;
  const cy = size / 2;
  let points: { x: number; y: number }[];
  if (rectangle && n === 4) {
    const l = sides[0] ?? sides[2] ?? 1;
    const w = sides[1] ?? sides[3] ?? 1;
    const maxPx = size - 70;
    // Keep very thin rectangles readable: never narrower than 30% of the long side.
    const scale = maxPx / Math.max(l, w);
    const pw = Math.max(l * scale, maxPx * 0.3);
    const ph = Math.max(w * scale, maxPx * 0.3);
    points = [
      { x: cx - pw / 2, y: cy - ph / 2 },
      { x: cx + pw / 2, y: cy - ph / 2 },
      { x: cx + pw / 2, y: cy + ph / 2 },
      { x: cx - pw / 2, y: cy + ph / 2 },
    ];
  } else {
    const r = size / 2 - 30;
    // Offset by half a step so every polygon sits on a flat top edge.
    const angleAt = (i: number) => -Math.PI / 2 - Math.PI / n + (2 * Math.PI * i) / n;
    points = Array.from({ length: n }, (_, i) => ({ x: cx + r * Math.cos(angleAt(i)), y: cy + r * Math.sin(angleAt(i)) }));
  }
  const pathD = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ") + " Z";
  const padBottom = caption ? 28 : 6;

  return (
    <svg viewBox={`-6 -6 ${size + 12} ${size + padBottom}`} width={Math.min(size + 12, 320)} style={{ maxWidth: "100%" }} role="img" aria-label={caption ?? `A ${n}-sided shape`}>
      <path d={pathD} style={{ fill: palette.aSoft, fillOpacity: 0.35, stroke: palette.c, strokeWidth: 4, strokeLinejoin: "round" }} />
      {points.map((p, i) => {
        if (hideLabels.includes(i)) return null;
        const q = points[(i + 1) % n];
        const mx = (p.x + q.x) / 2;
        const my = (p.y + q.y) / 2;
        const nx = mx - cx;
        const ny = my - cy;
        const len = Math.hypot(nx, ny) || 1;
        const val = sides[i];
        return (
          <text
            key={i}
            x={mx + (nx / len) * 18}
            y={my + (ny / len) * 18}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fill: val === null ? palette.c : palette.ink, fontSize: 14, fontWeight: 700 }}
          >
            {val === null ? "?" : unit ? `${val} ${unit}` : val}
          </text>
        );
      })}
      {caption && (
        <text x={size / 2} y={size + 20} textAnchor="middle" style={{ fill: palette.ink, fontSize: 14, fontWeight: 700 }}>
          {caption}
        </text>
      )}
    </svg>
  );
}
