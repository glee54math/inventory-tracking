import { useLayoutEffect, useRef } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";
import { ReadAloud } from "../../../shared/tts/ReadAloud";

/**
 * Making Ten Explore picture (MG1 U2): which number do I KEEP whole, which do
 * I BREAK apart — readable in one second, before any words.
 *   - KEEP (the bigger number): solid green box, "🔒 Keep" tag, BIG ten frame.
 *     Its empty spots are dashed orange: "this is what we fill."
 *   - BREAK (the smaller number): dashed orange box, "✂️ Break apart" tag,
 *     SMALL ten frame, a dashed cut line between the part that moves (orange)
 *     and the rest (purple).
 *   - On a loop, with no tap needed, each orange counter hops into an empty
 *     spot (~1 s each), "10!" pops, then it resets.
 * Source: MG1 Making Ten review (user design, combined mockup). Scope: K–1 band.
 */

const BIG = { cell: 44, gap: 6 };
const SMALL = { cell: 28, gap: 5 };
const PAD = 8;
const COLS = 5;

const LEAD = 700; // pause before the first hop
const STEP = 1000; // one hop per counter, ~1 s each
const HOP = 800; // flight time inside a step
const HOLD = 1600; // show the full ten
const FADE = 500;

const frameSize = (s: { cell: number; gap: number }) => ({
  w: COLS * s.cell + (COLS - 1) * s.gap + PAD * 2,
  h: 2 * s.cell + s.gap + PAD * 2,
});

const cellAt = (i: number, s: { cell: number; gap: number }) => ({
  x: PAD + (i % COLS) * (s.cell + s.gap),
  y: PAD + Math.floor(i / COLS) * (s.cell + s.gap),
});

const dashed = { stroke: palette.b, strokeWidth: 3, strokeDasharray: "5 3" };

function KeepFrame({ big }: { big: number }) {
  const { w, h } = frameSize(BIG);
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Ten frame, ${big} of 10 filled`} style={{ display: "block", width: "100%", maxWidth: w, height: "auto", fontFamily: diagramFont }}>
      {Array.from({ length: 10 }, (_, i) => {
        const { x, y } = cellAt(i, BIG);
        const filled = i < big;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={BIG.cell}
            height={BIG.cell}
            rx={7}
            data-mt-tgt={filled ? undefined : i - big}
            style={filled ? { fill: palette.a, stroke: palette.line, strokeWidth: 1.5 } : { fill: palette.bSoft, ...dashed }}
          />
        );
      })}
    </svg>
  );
}

function BreakFrame({ small, take }: { small: number; take: number }) {
  const { w, h } = frameSize(SMALL);
  // The cut sits between the moving part and the rest. take ≤ 4 (bigger number ≥ 6), so it is always in the top row.
  const cutX = PAD + take * (SMALL.cell + SMALL.gap) - SMALL.gap / 2;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} role="img" aria-label={`Ten frame, ${small} of 10 filled`} style={{ display: "block", width: "100%", maxWidth: w, height: "auto", fontFamily: diagramFont, overflow: "visible" }}>
      {Array.from({ length: 10 }, (_, i) => {
        const { x, y } = cellAt(i, SMALL);
        const moves = i < take;
        const rest = i >= take && i < small;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={SMALL.cell}
            height={SMALL.cell}
            rx={6}
            data-mt-src={moves ? i : undefined}
            style={moves ? { fill: "none", ...dashed } : rest ? { fill: palette.c, stroke: palette.line, strokeWidth: 1.5 } : { fill: "none", stroke: palette.line, strokeWidth: 1.5 }}
          />
        );
      })}
      <line x1={cutX} x2={cutX} y1={2} y2={PAD + SMALL.cell + 6} style={{ stroke: palette.b, strokeWidth: 3, strokeDasharray: "4 3", strokeLinecap: "round" }} />
    </svg>
  );
}

const tagStyle = (bg: string) =>
  ({
    position: "absolute",
    top: -16,
    left: 12,
    background: bg,
    color: "#fff",
    fontWeight: 800,
    fontSize: "1rem",
    padding: "4px 12px",
    borderRadius: 999,
    whiteSpace: "nowrap",
    display: "flex",
    gap: 6,
    alignItems: "center",
  }) as const;

export function KeepBreakFrames({ big, small }: { big: number; small: number }) {
  const take = 10 - big; // how many hop over to fill the ten
  const rest = small - take;
  const stageRef = useRef<HTMLDivElement>(null);
  const hopperRefs = useRef<(HTMLDivElement | null)[]>([]);
  const popRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    let anims: Animation[] = [];

    const run = () => {
      anims.forEach((a) => a.cancel());
      anims = [];
      const st = stage.getBoundingClientRect();
      const T = LEAD + take * STEP + HOLD + FADE;
      const at = (ms: number) => Math.min(1, Math.max(0, ms / T));
      for (let i = 0; i < take; i++) {
        const el = hopperRefs.current[i];
        const src = stage.querySelector(`[data-mt-src="${i}"]`);
        const tgt = stage.querySelector(`[data-mt-tgt="${i}"]`);
        if (!el || !src || !tgt) continue;
        const s = src.getBoundingClientRect();
        const t = tgt.getBoundingClientRect();
        el.style.left = `${s.left - st.left}px`;
        el.style.top = `${s.top - st.top}px`;
        el.style.width = `${s.width}px`;
        el.style.height = `${s.height}px`;
        el.style.opacity = "1";
        const dx = t.left - s.left;
        const dy = t.top - s.top;
        const k = t.width / s.width;
        const home = "translate(0px, 0px) scale(1)";
        const there = `translate(${dx}px, ${dy}px) scale(${k})`;
        if (reduce || typeof el.animate !== "function") {
          el.style.transform = there;
          continue;
        }
        el.style.transform = "";
        const t0 = LEAD + i * STEP;
        const lift = Math.max(40, Math.abs(dy) / 2 + 40);
        anims.push(
          el.animate(
            [
              { offset: 0, transform: home, opacity: 1 },
              { offset: at(t0), transform: home, opacity: 1 },
              { offset: at(t0 + HOP / 2), transform: `translate(${dx / 2}px, ${dy / 2 - lift}px) scale(${(1 + k) / 2})`, opacity: 1 },
              { offset: at(t0 + HOP), transform: there, opacity: 1 },
              { offset: at(T - FADE), transform: there, opacity: 1 },
              { offset: at(T - 100), transform: there, opacity: 0 },
              { offset: at(T - 90), transform: home, opacity: 0 },
              { offset: 1, transform: home, opacity: 1 },
            ],
            { duration: T, iterations: Infinity, easing: "ease-in-out" },
          ),
        );
      }
      const pop = popRef.current;
      if (pop) {
        if (reduce || typeof pop.animate !== "function") {
          pop.style.opacity = "1";
        } else {
          const landed = LEAD + (take - 1) * STEP + HOP;
          anims.push(
            pop.animate(
              [
                { offset: 0, opacity: 0, transform: "scale(0.6)" },
                { offset: at(landed), opacity: 0, transform: "scale(0.6)" },
                { offset: at(landed + 200), opacity: 1, transform: "scale(1.15)" },
                { offset: at(landed + 350), opacity: 1, transform: "scale(1)" },
                { offset: at(T - FADE), opacity: 1, transform: "scale(1)" },
                { offset: at(T - 100), opacity: 0, transform: "scale(1)" },
                { offset: 1, opacity: 0, transform: "scale(0.6)" },
              ],
              { duration: T, iterations: Infinity },
            ),
          );
        }
      }
    };

    run();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(run) : null;
    ro?.observe(stage);
    return () => {
      ro?.disconnect();
      anims.forEach((a) => a.cancel());
    };
  }, [big, small, take]);

  return (
    <div ref={stageRef} style={{ position: "relative" }}>
      <div className="control-row" style={{ gap: 20, alignItems: "center", paddingTop: 18 }} data-readaloud-part>
        {/* KEEP: solid line, bigger frame */}
        <div style={{ position: "relative", border: `5px solid ${palette.a}`, background: palette.aSoft, borderRadius: 16, padding: "26px 12px 8px", minWidth: 0 }}>
          <span style={tagStyle(palette.a)}>
            <span aria-hidden="true">🔒</span> Keep
          </span>
          <span
            ref={popRef}
            aria-hidden="true"
            style={{ position: "absolute", top: -16, right: -12, background: palette.a, color: "#fff", fontWeight: 900, fontSize: "1.2rem", padding: "2px 12px", borderRadius: 999, opacity: 0 }}
          >
            10!
          </span>
          <KeepFrame big={big} />
          <ReadAloud as="p" style={{ textAlign: "center", fontSize: "2.4rem", fontWeight: 900, margin: "2px 0 0", color: palette.a, lineHeight: 1.1 }}>
            {big}
          </ReadAloud>
        </div>

        <span style={{ fontSize: "1.9rem", fontWeight: 700 }}>+</span>

        {/* BREAK: dashed line, smaller frame */}
        <div style={{ position: "relative", border: `4px dashed ${palette.b}`, background: palette.bSoft, borderRadius: 16, padding: "26px 12px 8px", minWidth: 0 }}>
          <span style={tagStyle(palette.b)}>
            <span aria-hidden="true">✂️</span> Break apart
          </span>
          <BreakFrame small={small} take={take} />
          <ReadAloud as="p" style={{ textAlign: "center", fontSize: "1.5rem", fontWeight: 800, margin: "4px 0 0", lineHeight: 1.1 }}>
            <span style={{ color: palette.b }}>{small}</span> = <span style={{ color: palette.b }}>{take}</span> + <span style={{ color: palette.c }}>{rest}</span>
          </ReadAloud>
        </div>
      </div>

      {/* The counters that hop over to fill the ten (positioned from the frames above). */}
      {Array.from({ length: take }, (_, i) => (
        <div
          key={`${big}-${small}-${i}`}
          ref={(el) => {
            hopperRefs.current[i] = el;
          }}
          aria-hidden="true"
          style={{
            position: "absolute",
            opacity: 0,
            boxSizing: "border-box",
            background: palette.b,
            border: "2px solid rgba(0,0,0,0.25)",
            borderRadius: 6,
            transformOrigin: "0 0",
            pointerEvents: "none",
            zIndex: 2,
          }}
        />
      ))}
    </div>
  );
}
