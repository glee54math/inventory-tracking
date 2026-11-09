import { useLayoutEffect, useRef, useState, type CSSProperties } from "react";

/**
 * A label for an SVG diagram that draws fractions the handwritten way: the
 * numerator over a short bar over the denominator, with a whole number in
 * front for a mixed number ("1 1/2"). Anything else ("0", "estimate") is
 * drawn as plain text. Centered on (x, y); for a fraction, y is the bar.
 * SVG <text> can't hold the HTML stacked fraction (MathText), so this is its
 * SVG twin.
 *
 * Promoted from MG10's diagrams/SvgMath.tsx (2026-11) when MG9 became its
 * second consumer. MG10 still has its own identical copy (it was being edited
 * at the time); it can switch to this one. Shared diagrams only draw labels
 * with it inside a <StackedFractions> lab, so other labs are unchanged.
 */
export function SvgMath({ text, x, y, fontSize, color, weight = 800 }: { text: string; x: number; y: number; fontSize: number; color: string; weight?: number }) {
  const style: CSSProperties = { fill: color, fontSize, fontWeight: weight };
  const m = /^(?:(\d+) )?(\d+)\/(\d+)$/.exec(text.trim());
  if (!m) {
    return (
      <text x={x} y={y + fontSize * 0.35} textAnchor="middle" style={style} aria-hidden>
        {text}
      </text>
    );
  }
  const [, w, n, d] = m;
  const digit = fontSize * 0.6;
  const barW = Math.max(n.length, d.length) * digit + 6;
  const wholeW = w ? w.length * digit + 3 : 0;
  const left = x - (wholeW + barW) / 2;
  const fx = left + wholeW + barW / 2;
  return (
    <g aria-hidden>
      {w && (
        <text x={left + (wholeW - 3) / 2} y={y + fontSize * 0.36} textAnchor="middle" style={style}>
          {w}
        </text>
      )}
      <text x={fx} y={y - 3} textAnchor="middle" style={style}>
        {n}
      </text>
      <line x1={fx - barW / 2} y1={y} x2={fx + barW / 2} y2={y} style={{ stroke: color, strokeWidth: 1.6 }} />
      <text x={fx} y={y + fontSize * 0.75 + 3} textAnchor="middle" style={style}>
        {d}
      </text>
    </g>
  );
}

/** True when an SVG label is a fraction or mixed number SvgMath would stack. */
export const isSvgFraction = (text: string): boolean => /^(?:(\d+) )?(\d+)\/(\d+)$/.test(text.trim());

// Same fraction pattern as MathText's (a whole number may sit in front; the
// character before is captured, not a lookbehind, for older iPad Safari).
const LINE_FRAC_RE = /(^|[^\w/.?])(?:(\d+) )?(\d+)\s*\/\s*(\d+)(?![\w/]|\.\d)/g;

type LinePart = { kind: "text"; s: string } | { kind: "frac"; s: string };

function splitLine(text: string): LinePart[] {
  const out: LinePart[] = [];
  let last = 0;
  LINE_FRAC_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = LINE_FRAC_RE.exec(text)) !== null) {
    const [whole, pre, w, n, d] = m;
    const start = m.index + pre.length;
    if (start > last) out.push({ kind: "text", s: text.slice(last, start) });
    out.push({ kind: "frac", s: `${w ? `${w} ` : ""}${n}/${d}` });
    last = m.index + whole.length;
  }
  if (last < text.length) out.push({ kind: "text", s: text.slice(last) });
  return out;
}

/** Width SvgMath gives a fraction label (whole number + bar). */
function fracWidth(s: string, fontSize: number): number {
  const m = /^(?:(\d+) )?(\d+)\/(\d+)$/.exec(s);
  if (!m) return s.length * fontSize * 0.55;
  const digit = fontSize * 0.6;
  return (m[1] ? m[1].length * digit + 3 : 0) + Math.max(m[2].length, m[3].length) * digit + 6;
}

/**
 * A one-line SVG caption that may hold fractions in running text ("6/8 —
 * before simplifying"): the words are SVG text, each fraction is drawn
 * stacked with SvgMath. Text widths are measured after the first render, so
 * the words and fractions sit side by side without gaps or overlaps. `y` is
 * the text baseline, like an SVG <text>. A caption with no fraction renders
 * as one plain <text>, exactly as before.
 */
export function SvgMathLine({
  text,
  x,
  y,
  fontSize,
  color,
  weight = 400,
  anchor = "middle",
}: {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  weight?: number;
  anchor?: "start" | "middle" | "end";
}) {
  const parts = splitLine(text);
  const refs = useRef<(SVGTextElement | null)[]>([]);
  const [measured, setMeasured] = useState<{ key: string; widths: number[] } | null>(null);
  const key = `${text}|${fontSize}|${weight}`;
  const hasFrac = parts.some((p) => p.kind === "frac");
  useLayoutEffect(() => {
    if (!hasFrac) return;
    const widths = parts.map((p, i) => (p.kind === "text" ? (refs.current[i]?.getComputedTextLength?.() ?? p.s.length * fontSize * 0.55) : fracWidth(p.s, fontSize)));
    setMeasured((old) => (old && old.key === key && old.widths.every((w, i) => Math.abs(w - widths[i]) < 0.5) ? old : { key, widths }));
    // parts is derived from text, which key covers
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, hasFrac]);
  const style: CSSProperties = { fill: color, fontSize, fontWeight: weight, whiteSpace: "pre" };
  if (!hasFrac) {
    return (
      <text x={x} y={y} textAnchor={anchor} style={style}>
        {text}
      </text>
    );
  }
  const widths = measured?.key === key ? measured.widths : parts.map((p) => (p.kind === "text" ? p.s.length * fontSize * 0.55 : fracWidth(p.s, fontSize)));
  const total = widths.reduce((a, b) => a + b, 0);
  let cx = anchor === "middle" ? x - total / 2 : anchor === "end" ? x - total : x;
  // The fraction bar lines up with the middle of the lowercase letters.
  const barY = y - fontSize * 0.33;
  return (
    <g aria-hidden>
      {parts.map((p, i) => {
        const left = cx;
        cx += widths[i];
        return p.kind === "text" ? (
          <text
            key={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            x={left}
            y={y}
            textAnchor="start"
            style={style}
          >
            {p.s}
          </text>
        ) : (
          <SvgMath key={i} text={p.s} x={left + widths[i] / 2} y={barY} fontSize={fontSize} color={color} weight={Math.max(weight, 600)} />
        );
      })}
    </g>
  );
}
