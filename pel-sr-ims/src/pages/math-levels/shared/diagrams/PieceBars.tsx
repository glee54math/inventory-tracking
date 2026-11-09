import type { ReactNode } from "react";
import { palette, diagramFont } from "../lib/palette";
import { MathText, useStackedFractions } from "../components/MathText";
import { SvgMath } from "../components/SvgMath";

export type PieceTone = "a" | "b" | "c" | "gone";

export interface PieceSegment {
  /** How many 1/den pieces this run covers. */
  count: number;
  /** a/b/c = the lab's three quantity colors; "gone" = taken away (crossed out). */
  tone: PieceTone;
}

export interface PieceBarsProps {
  den: number;
  /** Consecutive runs of pieces, filled in order across as many whole bars
   *  as they need (a run can spill from one whole into the next — that IS
   *  the picture of a sum passing 1). */
  segments: PieceSegment[];
  /** Draw at least this many whole bars even if the pieces fit in fewer. */
  minWholes?: number;
  /** Pixel width of ONE whole bar. Every whole is the same width, always —
   *  the "same whole" rule made visible. */
  barWidth?: number;
  height?: number;
  /** Write "1/den" inside every filled piece (when the pieces are wide enough). */
  unitLabels?: boolean;
  /** Explore only: clicking piece k (k >= 1) reports k, e.g. to toggle a split before it. */
  onPieceClick?: (index: number) => void;
  /** Piece indices that get a thick divider drawn just BEFORE them (a visible "split"). */
  cuts?: number[];
  caption?: ReactNode;
}

const toneFill = (t: PieceTone): string => (t === "a" ? palette.a : t === "b" ? palette.b : t === "c" ? palette.c : palette.paper);

/**
 * Same-size pieces, colored by which part of a sum (or difference) they
 * belong to — the visual model behind every operation in this lab:
 * decomposing (one fraction's pieces in two colors), adding (two runs
 * filling across wholes), subtracting (a crossed-out run), and multiplying
 * (n same-size runs, one per copy). Each whole is its own bar in a wrapping
 * row (like MG9 IntroToFractionsLab's WholePlusPartBar), so a product like
 * 5 4/10 just wraps instead of shrinking every piece to a sliver.
 */
export function PieceBars({ den, segments, minWholes = 1, barWidth = 220, height = 56, unitLabels, onPieceClick, cuts = [], caption }: PieceBarsProps) {
  const cells: PieceTone[] = segments.flatMap((s) => Array.from({ length: Math.max(0, s.count) }, () => s.tone));
  const wholes = Math.max(minWholes, Math.ceil(cells.length / den));
  const cellW = barWidth / den;
  const cutSet = new Set(cuts);
  // Labs with <StackedFractions> (MG9) draw the "1/den" labels stacked, the handwritten way.
  const stacked = useStackedFractions();
  const filledCount = cells.filter((t) => t !== "gone").length;

  return (
    <div role="img" aria-label={`${filledCount} pieces of 1/${den}${cells.length > filledCount ? `, ${cells.length - filledCount} taken away` : ""}`}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "flex-end" }}>
        {Array.from({ length: wholes }, (_, w) => (
          <svg key={w} viewBox={`0 0 ${barWidth + 4} ${height + 4}`} width={barWidth + 4} style={{ maxWidth: "100%", fontFamily: diagramFont, display: "block" }}>
            <g transform="translate(2 2)">
              {Array.from({ length: den }, (_, i) => {
                const idx = w * den + i;
                const tone = cells[idx];
                const x = i * cellW;
                const clickable = !!onPieceClick && tone !== undefined && tone !== "gone" && idx > 0;
                return (
                  <g key={i} onClick={clickable ? () => onPieceClick!(idx) : undefined} style={clickable ? { cursor: "pointer" } : undefined}>
                    <rect
                      x={x}
                      y={0}
                      width={cellW}
                      height={height}
                      style={{ fill: tone ? toneFill(tone) : palette.paper, fillOpacity: tone && tone !== "gone" ? 0.85 : 1, stroke: palette.line, strokeWidth: 1 }}
                    />
                    {tone === "gone" && (
                      <>
                        <line x1={x + 4} y1={6} x2={x + cellW - 4} y2={height - 6} style={{ stroke: palette.bad, strokeWidth: 2.5 }} />
                        <line x1={x + cellW - 4} y1={6} x2={x + 4} y2={height - 6} style={{ stroke: palette.bad, strokeWidth: 2.5 }} />
                      </>
                    )}
                    {unitLabels && tone && tone !== "gone" && cellW >= 26 && stacked && (
                      <SvgMath text={`1/${den}`} x={x + cellW / 2} y={height / 2} fontSize={12} weight={700} color="var(--on-q, #fff)" />
                    )}
                    {unitLabels && tone && tone !== "gone" && cellW >= 26 && !stacked && (
                      <text x={x + cellW / 2} y={height / 2 + 5} textAnchor="middle" style={{ fill: "var(--on-q, #fff)", fontSize: 12, fontWeight: 700 }}>
                        1/{den}
                      </text>
                    )}
                  </g>
                );
              })}
              {Array.from({ length: den }, (_, i) => {
                const idx = w * den + i;
                if (i === 0 || !cutSet.has(idx)) return null;
                return <line key={`cut${i}`} x1={i * cellW} y1={-1} x2={i * cellW} y2={height + 1} style={{ stroke: palette.ink, strokeWidth: 4 }} />;
              })}
              <rect x={0} y={0} width={barWidth} height={height} style={{ fill: "none", stroke: palette.ink, strokeWidth: 2 }} />
            </g>
          </svg>
        ))}
      </div>
      {caption && (
        <p className="muted small" style={{ marginTop: 6, marginBottom: 0 }}>
          <MathText>{caption}</MathText>
        </p>
      )}
    </div>
  );
}
