import { useRef, useState } from "react";
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
  /**
   * Enables hover-to-preview + click-to-set: moving the mouse over the grid
   * shows a light outlined (ghost) point snapped to the nearest integer
   * coordinate under the cursor, and clicking commits that (x, y) through
   * this callback — only ever set this for an Explore sandbox whose own
   * state the click should update, NEVER for a Practice visual whose points
   * ARE the question (clicking around would let a student find the answer
   * by trial and error instead of reasoning it out).
   */
  onPointClick?: (x: number, y: number) => void;
  /** Tints one quadrant's background — e.g. to mirror a "Quadrant II" button
   *  being hovered elsewhere on the page. null/omitted shows no tint. */
  highlightQuadrant?: 1 | 2 | 3 | 4 | null;
}

const CELL_PX = 26;

/** Exported so whatever triggers a quadrant highlight (e.g. a button outside
 *  this component) can color itself with the exact same value, instead of a
 *  second hardcoded color that could quietly drift out of sync with this one. */
export const QUADRANT_HIGHLIGHT = palette.aSoft;

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/** A 4-quadrant coordinate grid, axes crossing at the center, integer
 *  gridlines, with the origin's own lines emphasized (ink-colored) so 0 on
 *  each axis is never just another gridline. `points` are marked with a
 *  colored dot, optionally labeled. */
export function CoordinatePlane({ range, points = [], onPointClick, highlightQuadrant }: CoordinatePlaneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<{ x: number; y: number } | null>(null);
  const size = (range * 2 + 1) * CELL_PX;
  const toPx = (v: number) => (v + range) * CELL_PX;
  const ticks: number[] = [];
  for (let v = -range; v <= range; v++) ticks.push(v);
  // Label every integer for a small grid, every other one once it'd get
  // crowded — the gridlines themselves are still drawn at every integer
  // either way, only the printed numbers thin out.
  const labelTicks = ticks.filter((v) => v !== 0 && (range <= 6 || v % 2 === 0));

  // Inverse of toPx (and of its y-axis flip, toPx(-v)) — the nearest integer
  // cell under a mouse position relative to the container's own top-left,
  // clamped to the grid's own range. Snaps to whole numbers only (no
  // decimals), same as every other point this diagram ever plots.
  const cellFromEvent = (e: React.MouseEvent<HTMLDivElement>): { x: number; y: number } => {
    const rect = containerRef.current!.getBoundingClientRect();
    const rawX = Math.round((e.clientX - rect.left) / CELL_PX - range);
    const rawY = Math.round(range - (e.clientY - rect.top) / CELL_PX);
    return { x: Math.min(range, Math.max(-range, rawX)), y: Math.min(range, Math.max(-range, rawY)) };
  };

  // Pixel rect for each quadrant — the origin (toPx(0)) splits the grid into
  // a left/right half (x sign) and a top/bottom half (y sign); "top" is the
  // POSITIVE-y half since toPx(-y) puts larger y at smaller pixel values.
  const origin = toPx(0);
  const quadrantRect = (q: 1 | 2 | 3 | 4) => ({
    left: q === 1 || q === 4 ? origin : 0,
    top: q === 1 || q === 2 ? 0 : origin,
    width: q === 1 || q === 4 ? size - origin : origin,
    height: q === 1 || q === 2 ? origin : size - origin,
  });

  return (
    <div
      ref={containerRef}
      role="img"
      aria-label={`Coordinate plane from ${-range} to ${range} on both axes${
        points.length ? `, with point${points.length > 1 ? "s" : ""} ${points.map((p) => `(${p.x}, ${p.y})`).join(" and ")} marked` : ""
      }`}
      style={{
        position: "relative",
        width: size,
        height: size,
        fontFamily: diagramFont,
        color: palette.ink,
        cursor: onPointClick ? "pointer" : undefined,
      }}
      onMouseMove={onPointClick ? (e) => setHover(cellFromEvent(e)) : undefined}
      onMouseLeave={onPointClick ? () => setHover(null) : undefined}
      onClick={onPointClick ? (e) => onPointClick(cellFromEvent(e).x, cellFromEvent(e).y) : undefined}
    >
      {highlightQuadrant && (
        <div style={{ position: "absolute", ...quadrantRect(highlightQuadrant), background: QUADRANT_HIGHLIGHT, pointerEvents: "none" }} />
      )}
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
      {onPointClick && hover && (
        <div style={{ position: "absolute", left: toPx(hover.x) - 6, top: toPx(-hover.y) - 6, pointerEvents: "none" }}>
          <div style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${palette.muted}`, background: "transparent" }} />
          <div style={{ position: "absolute", top: -3, left: 16, fontSize: 12, fontWeight: 700, whiteSpace: "nowrap", color: palette.muted }}>
            ({hover.x}, {hover.y})
          </div>
        </div>
      )}
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
