import type { ReactNode } from "react";
import { palette } from "../lib/palette";

export interface TierCellStyle {
  fill: string;
  fillOpacity?: number;
}

export interface TierSpec {
  /** Number of equal cells this tier is partitioned into. */
  cells: number;
  /** Fill style for cell `i` (0-indexed, left to right). */
  cellStyle: (i: number) => TierCellStyle;
  /** Thick divider lines at these cell-boundary indices (0..cells) — e.g.
   *  [3, 6, 9] groups a 9-cell tier into three equal thirds. Omit for no
   *  internal dividers beyond the tier's own outer border. */
  dividers?: number[];
  /** Caption line(s), centered under this tier, one `<text>` row each. */
  captions?: ReactNode[];
}

export interface TwoTierBarsProps {
  top: TierSpec;
  bottom: TierSpec;
  width?: number;
  topHeight?: number;
  bottomHeight?: number;
  ariaLabel?: string;
}

const CAPTION_LINE_H = 17;
const CAPTION_TOP_PAD = 16;
const CAPTION_BOTTOM_PAD = 16;

/** Vertical space a tier's caption block takes up, 0 if it has none. */
const captionBlockHeight = (lines: number) => (lines ? CAPTION_TOP_PAD + (lines - 1) * CAPTION_LINE_H + CAPTION_BOTTOM_PAD : 0);

/**
 * Two bars, stacked, sharing one fixed pixel width — the top bar partitioned
 * into `top.cells` equal cells, the bottom into `bottom.cells`, connected by
 * dashed guide lines at their shared left/right edges. Extracted from
 * SharingBars.tsx (MG11's partitive-division diagram), which hardcoded its
 * own partitive wording and "one highlighted cell per group" semantics — this
 * keeps only the GEOMETRY (independently-partitioned bars at one shared
 * width, with guides tying the boundary together), with fill/caption/divider
 * content fully caller-supplied, so it also serves "same amount, more
 * pieces" (equivalent fractions) and "same amount, fewer pieces"
 * (simplifying) without forcing either into sharing's own vocabulary.
 * SharingBars itself now renders on top of this rather than duplicating the
 * geometry a second time.
 */
export function TwoTierBars({ top, bottom, width = 360, topHeight = 52, bottomHeight, ariaLabel }: TwoTierBarsProps) {
  const effectiveBottomHeight = bottomHeight ?? Math.max(28, topHeight - 16);
  const topCellW = width / top.cells;
  const bottomCellW = width / bottom.cells;
  const topCaptionH = captionBlockHeight(top.captions?.length ?? 0);
  const bottomCaptionH = captionBlockHeight(bottom.captions?.length ?? 0);
  const guideY = topHeight + topCaptionH;
  const totalHeight = guideY + effectiveBottomHeight + bottomCaptionH;

  return (
    <svg
      viewBox={`0 0 ${width} ${totalHeight}`}
      width={width}
      style={{ maxWidth: "100%" }}
      role="img"
      aria-label={ariaLabel ?? "two bars showing the same amount split two different ways"}
    >
      {Array.from({ length: top.cells }, (_, i) => {
        const s = top.cellStyle(i);
        return <rect key={i} x={i * topCellW} y={0} width={topCellW} height={topHeight} style={{ fill: s.fill, fillOpacity: s.fillOpacity ?? 1, stroke: palette.line, strokeWidth: 1 }} />;
      })}
      {top.dividers?.map((b, i) => <line key={`td${i}`} x1={b * topCellW} y1={0} x2={b * topCellW} y2={topHeight} style={{ stroke: palette.ink, strokeWidth: 2 }} />)}
      <rect x={0} y={0} width={width} height={topHeight} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
      {top.captions?.map((c, i) => (
        <text key={i} x={width / 2} y={topHeight + CAPTION_TOP_PAD + i * CAPTION_LINE_H} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13 }}>
          {c}
        </text>
      ))}

      <line x1={0} y1={topHeight + topCaptionH - CAPTION_BOTTOM_PAD / 2} x2={0} y2={guideY} style={{ stroke: palette.line, strokeWidth: 1, strokeDasharray: "3 3" }} />
      <line x1={width} y1={topHeight + topCaptionH - CAPTION_BOTTOM_PAD / 2} x2={width} y2={guideY} style={{ stroke: palette.line, strokeWidth: 1, strokeDasharray: "3 3" }} />

      <g transform={`translate(0, ${guideY})`}>
        {Array.from({ length: bottom.cells }, (_, i) => {
          const s = bottom.cellStyle(i);
          return <rect key={i} x={i * bottomCellW} y={0} width={bottomCellW} height={effectiveBottomHeight} style={{ fill: s.fill, fillOpacity: s.fillOpacity ?? 1, stroke: palette.line, strokeWidth: 0.75 }} />;
        })}
        {bottom.dividers?.map((b, i) => <line key={`bd${i}`} x1={b * bottomCellW} y1={0} x2={b * bottomCellW} y2={effectiveBottomHeight} style={{ stroke: palette.ink, strokeWidth: 2 }} />)}
        <rect x={0} y={0} width={width} height={effectiveBottomHeight} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
        {bottom.captions?.map((c, i) => (
          <text key={i} x={width / 2} y={effectiveBottomHeight + CAPTION_TOP_PAD + i * CAPTION_LINE_H} textAnchor="middle" style={{ fill: palette.muted, fontSize: 13 }}>
            {c}
          </text>
        ))}
      </g>
    </svg>
  );
}
