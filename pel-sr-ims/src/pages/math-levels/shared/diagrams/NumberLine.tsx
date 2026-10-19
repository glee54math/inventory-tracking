import { palette, diagramFont } from "../lib/palette";

export interface NumberLinePoint {
  value: number;
  /** Shown above the marker, e.g. "A" or the value itself — omit to just
   *  show an unlabeled dot (used when the point's value IS the question,
   *  e.g. "what number is marked?", so showing it would give the answer away). */
  label?: string;
  tone?: "a" | "b" | "c";
}

export interface NumberLineProps {
  min: number;
  max: number;
  points?: NumberLinePoint[];
}

const CELL_EM = 1.8;

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/** A horizontal number line with integer tick marks from `min` to `max` —
 *  0 is always visually emphasized (bold, ink-colored) since "what does 0
 *  mean here" is the point of this whole strand, not an incidental tick.
 *  `points` are marked with a colored dot, optionally labeled. */
export function NumberLine({ min, max, points = [] }: NumberLineProps) {
  const values: number[] = [];
  for (let v = min; v <= max; v++) values.push(v);
  const width = `${values.length * CELL_EM}em`;
  const visiblePoints = points.filter((p) => p.value >= min && p.value <= max);

  return (
    <div
      role="img"
      aria-label={`Number line from ${min} to ${max}${
        visiblePoints.length ? `, with ${visiblePoints.map((p) => p.value).join(" and ")} marked` : ""
      }`}
      style={{ display: "inline-block", fontFamily: diagramFont, color: palette.ink }}
    >
      {/* point markers */}
      <div style={{ position: "relative", height: "2.2em", width }}>
        {visiblePoints.map((p, i) => (
          <div key={i} style={{ position: "absolute", left: `${(p.value - min) * CELL_EM}em`, width: `${CELL_EM}em`, textAlign: "center", top: 0 }}>
            {p.label && (
              <div style={{ fontSize: "0.8em", fontWeight: 700, color: toneColor(p.tone), marginBottom: "2px" }}>{p.label}</div>
            )}
            <span
              aria-hidden
              style={{ display: "inline-block", width: "0.7em", height: "0.7em", borderRadius: "50%", background: toneColor(p.tone) }}
            />
          </div>
        ))}
      </div>
      {/* the line */}
      <div style={{ height: "2px", background: palette.line, width }} />
      {/* ticks + number labels */}
      <div style={{ display: "flex" }}>
        {values.map((v) => (
          <div key={v} style={{ width: `${CELL_EM}em`, textAlign: "center" }}>
            <div style={{ width: "2px", height: "0.5em", background: palette.line, margin: "0 auto" }} />
            <div style={{ fontSize: "0.8em", fontWeight: v === 0 ? 800 : 400, color: v === 0 ? palette.ink : palette.muted }}>{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
