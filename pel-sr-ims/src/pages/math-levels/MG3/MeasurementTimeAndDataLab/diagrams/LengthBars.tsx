import { useRef } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";

export interface LengthItem {
  id: string;
  /** Short label shown to the left of the bar, e.g. "A" or "🖍️ Crayon". */
  label: string;
  /** True length in abstract whole units — never fractional, per this unit's scope. */
  length: number;
  /** Left offset (in the same whole units) from the shared x=0 origin every
   *  bar in one LengthBars call shares. Default 0 — baseline-aligned. Set
   *  this to something nonzero (and different per item) for the
   *  misaligned-start bucket, so "which bar's far end sticks out furthest"
   *  and "which bar is actually longest" can disagree on purpose. */
  start?: number;
  tone?: "a" | "b" | "c";
}

export interface LengthBarsProps {
  items: LengthItem[];
  /**
   * Pixels per whole unit. Every bar passed to ONE LengthBars call always
   * shares this same scale, so within a single call, comparing bar pixel
   * widths by eye is always a valid stand-in for comparing their true
   * lengths. Pass a deliberately different `unitPx` across two SEPARATE
   * LengthBars calls (e.g. the indirect-comparison "counter to first
   * glance" bucket's two pairwise rows) to make a naive cross-picture pixel
   * comparison unreliable — the whole point of that bucket is that it can't
   * be eyeballed, only reasoned through from the two stated facts.
   */
  unitPx?: number;
  /** Shared x-axis span (in units) every bar's track is drawn against, so
   *  two LengthBars calls meant to look "the same size" line up visually.
   *  Defaults to the furthest right edge among `items`. */
  maxUnits?: number;
  /** Enables drag-to-reorder (Explore only) — never set this for a Practice
   *  or Test visual, where the display order itself is part of the question. */
  draggableReorder?: boolean;
  onReorder?: (order: string[]) => void;
}

const toneFill = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/**
 * Stacks each item as a horizontal bar on its own row, top to bottom, all
 * sharing one coordinate space (same unit->px scale, same x=0 origin) so
 * comparing bar lengths or start offsets by eye is always meaningful within
 * one call — see `unitPx`'s doc comment for the one case where that's
 * deliberately broken across two separate calls.
 */
export function LengthBars({ items, unitPx = 24, maxUnits, draggableReorder, onReorder }: LengthBarsProps) {
  const span = maxUnits ?? Math.max(...items.map((it) => (it.start ?? 0) + it.length), 1);
  const trackWidth = span * unitPx;
  const dragId = useRef<string | null>(null);

  return (
    <div className="length-bars" role="img" aria-label={items.map((it) => `${it.label}: ${it.length} units`).join(", ")} style={{ fontFamily: diagramFont }}>
      {items.map((it) => (
        <div
          key={it.id}
          className={`length-row${draggableReorder ? " draggable" : ""}`}
          draggable={!!draggableReorder}
          onDragStart={() => (dragId.current = it.id)}
          onDragOver={(e) => draggableReorder && e.preventDefault()}
          onDrop={() => {
            if (!draggableReorder || !onReorder) return;
            const from = dragId.current;
            dragId.current = null;
            if (!from || from === it.id) return;
            const order = items.map((x) => x.id);
            const fromIdx = order.indexOf(from);
            const toIdx = order.indexOf(it.id);
            if (fromIdx < 0 || toIdx < 0) return;
            order.splice(toIdx, 0, order.splice(fromIdx, 1)[0]);
            onReorder(order);
          }}
        >
          <span className="length-label">{it.label}</span>
          <div className="length-track" style={{ width: trackWidth + 4 }}>
            <div
              className="length-bar"
              style={{
                marginLeft: (it.start ?? 0) * unitPx,
                width: Math.max(it.length * unitPx, 10),
                background: toneFill(it.tone),
              }}
            >
              {draggableReorder && (
                <span className="length-handle" aria-hidden>
                  ⠿
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
