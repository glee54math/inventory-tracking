import { palette, diagramFont } from "../lib/palette";

export interface PlanePoint {
  x: number;
  y: number;
  /** Shown next to the point, e.g. "A" — omit to show an unlabeled dot (used
   *  when the point's coordinates ARE the question, so showing them would
   *  give the answer away). */
  label?: string;
  tone?: "a" | "b" | "c";
}

export interface CoordinatePlaneProps {
  /** The grid spans -range..range on both axes. */
  range: number;
  points?: PlanePoint[];
}

const CELL_PX = 26;

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/** A 4-quadrant coordinate grid, axes crossing at the center, integer
 *  gridlines, with the origin's own lines emphasized (ink-colored) so 0 on
 *  each axis is never just another gridline. `points` are marked with a
 *  colored dot, optionally labeled. */
export function CoordinatePlane({ range, points = [] }: CoordinatePlaneProps) {
  const size = (range * 2 + 1) * CELL_PX;
  const toPx = (v: number) => (v + range) * CELL_PX;
  const ticks: number[] = [];
  for (let v = -range; v <= range; v++) ticks.push(v);
  // Label every integer for a small grid, every other one once it'd get
  // crowded — the gridlines themselves are still drawn at every integer
  // either way, only the printed numbers thin out.
  const labelTicks = ticks.filter((v) => v !== 0 && (range <= 6 || v % 2 === 0));

  return (
    <div
      role="img"
      aria-label={`Coordinate plane from ${-range} to ${range} on both axes${
        points.length ? `, with point${points.length > 1 ? "s" : ""} ${points.map((p) => `(${p.x}, ${p.y})`).join(" and ")} marked` : ""
      }`}
      style={{ position: "relative", width: size, height: size, fontFamily: diagramFont, color: palette.ink }}
    >
      {ticks.map((v) => (
        <div key={`v${v}`} style={{ position: "absolute", left: toPx(v), top: 0, bottom: 0, width: "1px", background: v === 0 ? palette.ink : palette.grid }} />
      ))}
      {ticks.map((v) => (
        <div key={`h${v}`} style={{ position: "absolute", top: toPx(-v), left: 0, right: 0, height: "1px", background: v === 0 ? palette.ink : palette.grid }} />
      ))}
      {labelTicks.map((v) => (
        <span key={`xl${v}`} style={{ position: "absolute", left: toPx(v) - 8, top: toPx(0) + 3, fontSize: 11, color: palette.muted }}>
          {v}
        </span>
      ))}
      {labelTicks.map((v) => (
        <span key={`yl${v}`} style={{ position: "absolute", top: toPx(-v) - 7, left: toPx(0) + 4, fontSize: 11, color: palette.muted }}>
          {v}
        </span>
      ))}
      {points.map((p, i) => (
        <div key={i} style={{ position: "absolute", left: toPx(p.x) - 6, top: toPx(-p.y) - 6 }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", background: toneColor(p.tone) }} />
          {p.label && (
            <div style={{ position: "absolute", top: -3, left: 16, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", color: toneColor(p.tone) }}>
              {p.label}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
