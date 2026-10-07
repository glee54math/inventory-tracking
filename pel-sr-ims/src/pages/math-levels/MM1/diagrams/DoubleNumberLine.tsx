import React, { useId } from "react";
import { palette } from "../../shared/lib/palette";
import { fmt } from "../../shared/lib/math";

export interface NumberLineSide {
  label: string;
  color: string;
  /** Formats a value for display, e.g. (v) => "$" + v. */
  format?: (v: number) => string;
}

export interface LinePair {
  top: number;
  bottom: number;
  /** Show "?" instead of the value. */
  hideTop?: boolean;
  hideBottom?: boolean;
  /** Draw an emphasized tick (e.g. the unit rate or the answer). */
  highlight?: boolean;
}

export interface DoubleNumberLineProps {
  top: NumberLineSide;
  bottom: NumberLineSide;
  /** Equivalent pairs. Tick positions are proportional to the `bottom` value. */
  pairs: LinePair[];
  /** Right end of the bottom scale. Defaults to the largest bottom value. */
  maxBottom?: number;
  /** Optional moving marker at this bottom-scale value. */
  marker?: number | null;
  /**
   * Smoothly glide the marker to its new position over ~250ms instead of
   * snapping instantly. Good for occasional discrete jumps (e.g. revealing
   * the next step of a problem); turn this off when `marker` itself is
   * already being updated continuously (e.g. every requestAnimationFrame
   * tick of a "Drive" animation) — retargeting a fixed-duration CSS
   * transition on every frame makes the marker perpetually lag behind and
   * chase its own target rather than track it, since each new frame's
   * value restarts the transition before the previous one finishes.
   * Default true to match every existing caller's expectations.
   */
  markerTransition?: boolean;
  width?: number;
  ariaLabel?: string;
}

/**
 * Two parallel number lines whose tick marks line up: each vertical pair is an equivalent
 * ratio. Because positions are proportional, the picture also shows the constant rate.
 */
export function DoubleNumberLine({ top, bottom, pairs, maxBottom, marker = null, markerTransition = true, width = 560, ariaLabel }: DoubleNumberLineProps) {
  const left = 96;
  const right = 26;
  const yTop = 46;
  const yBot = 112;
  const maxB = maxBottom ?? Math.max(...pairs.map((p) => p.bottom), 1);
  const x = (b: number) => left + (b / maxB) * (width - left - right);
  const arrowId = "dnl" + useId().replace(/:/g, "");
  const fT = top.format ?? fmt;
  const fB = bottom.format ?? fmt;

  const sorted = [...pairs].sort((p, q) => p.bottom - q.bottom);
  // stagger labels that would collide
  let lastX = -Infinity;
  let lastStagger = 0;
  const stagger = new Map<LinePair, number>();
  sorted.forEach((p) => {
    const px = x(p.bottom);
    const s = px - lastX < 34 ? (lastStagger ? 0 : 1) : 0;
    stagger.set(p, s);
    lastX = px;
    lastStagger = s;
  });

  const anyStagger = [...stagger.values()].some((v) => v > 0);
  const top0 = anyStagger ? -16 : 0;
  const height = anyStagger ? 182 : 150;
  const lineEnd = width - right + 12;

  return (
    <svg
      viewBox={`0 ${top0} ${width} ${height}`}
      width="100%"
      style={{ maxWidth: width, display: "block", margin: "0 auto", overflow: "visible" }}
      role="img"
      aria-label={ariaLabel ?? `Double number line of ${top.label} and ${bottom.label}`}
    >
      <defs>
        <marker id={arrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" style={{ fill: palette.muted }} />
        </marker>
      </defs>
      <text x={left - 14} y={yTop + 5} textAnchor="end" style={{ fill: top.color, fontWeight: 700, fontSize: 14 }}>
        {top.label}
      </text>
      <text x={left - 14} y={yBot + 5} textAnchor="end" style={{ fill: bottom.color, fontWeight: 700, fontSize: 14 }}>
        {bottom.label}
      </text>
      <line x1={left} y1={yTop} x2={lineEnd} y2={yTop} markerEnd={`url(#${arrowId})`} style={{ stroke: palette.muted, strokeWidth: 2 }} />
      <line x1={left} y1={yBot} x2={lineEnd} y2={yBot} markerEnd={`url(#${arrowId})`} style={{ stroke: palette.muted, strokeWidth: 2 }} />
      {sorted.map((p, i) => {
        const px = x(p.bottom);
        const s = stagger.get(p) ?? 0;
        const hl = !!p.highlight;
        return (
          <g key={i}>
            {hl && <rect x={px - 3} y={yTop - 8} width={6} height={yBot - yTop + 16} rx={3} style={{ fill: palette.cSoft }} />}
            <line x1={px} y1={yTop - 8} x2={px} y2={yTop + 8} style={{ stroke: hl ? palette.c : palette.ink, strokeWidth: hl ? 3 : 2 }} />
            <line x1={px} y1={yBot - 8} x2={px} y2={yBot + 8} style={{ stroke: hl ? palette.c : palette.ink, strokeWidth: hl ? 3 : 2 }} />
            <text x={px} y={yTop - 14 - s * 15} textAnchor="middle" style={{ fill: p.hideTop ? palette.bad : top.color, fontWeight: 700, fontSize: 14 }}>
              {p.hideTop ? "?" : fT(p.top)}
            </text>
            <text x={px} y={yBot + 26 + s * 15} textAnchor="middle" style={{ fill: p.hideBottom ? palette.bad : bottom.color, fontWeight: 700, fontSize: 14 }}>
              {p.hideBottom ? "?" : fB(p.bottom)}
            </text>
          </g>
        );
      })}
      {marker !== null && marker !== undefined && (
        <g style={{ transition: markerTransition ? "transform .25s linear" : "none" }} transform={`translate(${x(Math.min(marker, maxB))},0)`}>
          <circle cx={0} cy={yTop} r={7} style={{ fill: top.color, stroke: palette.paper, strokeWidth: 2 }} />
          <circle cx={0} cy={yBot} r={7} style={{ fill: bottom.color, stroke: palette.paper, strokeWidth: 2 }} />
        </g>
      )}
    </svg>
  );
}
