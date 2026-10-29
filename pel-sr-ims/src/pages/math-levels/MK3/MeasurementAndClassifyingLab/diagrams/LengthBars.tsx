import { useRef, useState } from "react";
import type React from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";

export type Tone = "a" | "b" | "c";

const toneColor = (tone?: Tone) => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

const BLOCK = 28;
const BLOCK_GAP = 3;
const BAR_H = 34;
const ROW_GAP = 46;
const PAD = 24;

export interface LengthBarSpec {
  blocks: number;
  tone?: Tone;
  label: string;
  /**
   * How many block-widths this bar's LEFT edge is shifted right of the
   * shared baseline (the dashed line at x=0) — 0 (the default) means every
   * bar starts flush together, the "aligned" case this standard assumes a
   * student can judge at a glance. A nonzero offset is what makes "which
   * one is actually longer" require mentally re-aligning the starts instead
   * of just comparing right edges (Unit 2's "misaligned" bucket).
   */
  startOffset?: number;
}

export interface LengthBarsProps {
  bars: LengthBarSpec[];
  min?: number;
  max?: number;
  /**
   * When set, bar `i`'s right-edge handle becomes drag-adjustable
   * (Explore's sandbox only) — Practice/Test visuals omit this and render a
   * plain static bar, same convention as every other diagram in this app
   * (e.g. CounterGroup's countedOrder/onToggle, MK1/CountingAndCardinalityLab).
   */
  onBlocksChange?: (index: number, blocks: number) => void;
}

/** Two or more rods built from equal-size unit blocks, optionally not
 * starting at the same point — the concrete, non-numeric (no ruler, no
 * inches) stand-in this lab uses for K.MD.1/K.MD.2's length comparisons.
 * Counting the blocks is itself the "describe the difference" skill
 * (Unit 2's describeDifference bucket), never a measurement in a standard
 * unit. */
export function LengthBars({ bars, min = 1, max = 12, onBlocksChange }: LengthBarsProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const maxOffset = Math.max(0, ...bars.map((b) => b.startOffset ?? 0));
  const width = PAD * 2 + (max + maxOffset) * (BLOCK + BLOCK_GAP);
  const height = PAD * 2 + bars.length * ROW_GAP;

  const clientXToBlocks = (clientX: number, startOffset: number) => {
    const svg = svgRef.current;
    if (!svg) return min;
    const rect = svg.getBoundingClientRect();
    const scale = width / rect.width;
    const localX = (clientX - rect.left) * scale - PAD - startOffset * (BLOCK + BLOCK_GAP);
    const n = Math.round(localX / (BLOCK + BLOCK_GAP));
    return Math.min(max, Math.max(min, n));
  };

  const startDrag = (i: number) => (e: React.PointerEvent) => {
    if (!onBlocksChange) return;
    (e.target as Element).setPointerCapture?.(e.pointerId);
    setDragIndex(i);
  };
  const onMove = (e: React.PointerEvent) => {
    if (dragIndex === null || !onBlocksChange) return;
    const startOffset = bars[dragIndex].startOffset ?? 0;
    onBlocksChange(dragIndex, clientXToBlocks(e.clientX, startOffset));
  };
  const endDrag = () => setDragIndex(null);

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={bars.map((b) => `${b.label}: ${b.blocks} blocks long`).join(", ")}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
      onPointerMove={onMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      {/* Shared start line: when every bar's startOffset is 0, this makes
          "they're aligned" visually obvious without needing a ruler. */}
      <line x1={PAD} y1={PAD - 6} x2={PAD} y2={height - PAD + 6} stroke={palette.line} strokeWidth={2} strokeDasharray="4 4" />
      {bars.map((bar, i) => {
        const color = toneColor(bar.tone);
        const startOffset = bar.startOffset ?? 0;
        const x0 = PAD + startOffset * (BLOCK + BLOCK_GAP);
        const y = PAD + i * ROW_GAP;
        const handleX = x0 + bar.blocks * (BLOCK + BLOCK_GAP) - BLOCK_GAP;
        return (
          <g key={i}>
            <text x={x0} y={y - 8} fontSize={13} fontWeight={700} fill={color}>
              {bar.label}
            </text>
            {Array.from({ length: bar.blocks }, (_, k) => (
              <rect key={k} x={x0 + k * (BLOCK + BLOCK_GAP)} y={y} width={BLOCK} height={BAR_H} rx={4} fill={color} stroke={palette.paper} strokeWidth={2} />
            ))}
            {onBlocksChange && (
              <circle
                cx={handleX}
                cy={y + BAR_H / 2}
                r={10}
                fill={palette.paper}
                stroke={color}
                strokeWidth={3}
                style={{ cursor: "ew-resize", touchAction: "none" }}
                onPointerDown={startDrag(i)}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
}
