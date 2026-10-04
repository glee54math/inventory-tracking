import React, { useState } from "react";
import { palette } from "../lib/palette";

export interface PercentGridProps {
  /** Number of the 100 squares that are filled (0–100). */
  filled: number;
  color?: string;
  /** If set, clicking/dragging over squares sets `filled`. */
  onChange?: (filled: number) => void;
  size?: number;
  /** Shade whole columns of 10 lightly to show tenths. */
  showTens?: boolean;
}

/** 10×10 hundred grid: "percent" literally means "per 100". Fills column by column. */
export function PercentGrid({ filled, color = palette.a, onChange, size = 260, showTens = true }: PercentGridProps) {
  const cell = size / 10;
  const [dragging, setDragging] = useState(false);
  const set = (i: number) => onChange?.(i + 1 === filled ? i : i + 1);

  return (
    <svg
      viewBox={`-2 -2 ${size + 4} ${size + 4}`}
      width="100%"
      style={{ maxWidth: size + 4, display: "block", margin: "0 auto", touchAction: onChange ? "none" : "auto" }}
      role="img"
      aria-label={`${filled} out of 100 squares shaded`}
      onPointerUp={() => setDragging(false)}
      onPointerLeave={() => setDragging(false)}
    >
      {Array.from({ length: 100 }, (_, i) => {
        // column-major so 10% = one full column
        const col = Math.floor(i / 10);
        const row = i % 10;
        const on = i < filled;
        return (
          <rect
            key={i}
            x={col * cell + 1}
            y={row * cell + 1}
            width={cell - 2}
            height={cell - 2}
            rx={2}
            style={{
              fill: on ? color : showTens && col % 2 ? palette.grid : palette.paper,
              stroke: palette.line,
              strokeWidth: 1,
              cursor: onChange ? "pointer" : "default",
              transition: "fill .15s",
            }}
            onPointerDown={(e) => {
              if (!onChange) return;
              (e.target as Element).releasePointerCapture?.((e as React.PointerEvent).pointerId);
              setDragging(true);
              set(i);
            }}
            onPointerEnter={() => dragging && onChange?.(i + 1)}
          />
        );
      })}
      {Array.from({ length: 11 }, (_, k) => (
        <line key={k} x1={k * cell} y1={0} x2={k * cell} y2={size} style={{ stroke: palette.ink, strokeWidth: k % 5 === 0 ? 2 : 0.6, opacity: 0.6 }} />
      ))}
    </svg>
  );
}
