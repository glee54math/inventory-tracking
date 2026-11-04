import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { BigDigit } from "../diagrams";
import { sayText } from "../../../shared/tts/speechEngine";
import { useTtsEnabled } from "../../../shared/tts/ttsContext";

export interface MatchItem {
  n: number;
  word: string;
}

// One color per locked pair, so a word, its line and its numeral visibly belong together.
const PAIR_COLORS = [
  { main: "var(--qa)", soft: "var(--qa-soft)" },
  { main: "var(--qb)", soft: "var(--qb-soft)" },
  { main: "var(--qc)", soft: "var(--qc-soft)" },
  { main: "var(--item-green, #4C8C2B)", soft: "var(--item-green-soft, #E1EDD4)" },
];

type Side = "word" | "num";
type Pick = { side: Side; n: number } | null;
type Pt = { x: number; y: number };

const DRAG_START_PX = 8; // movement before a press counts as a drag, not a tap

/**
 * Drag-to-match: number words on the left, numerals (shuffled) on the right.
 * Drag from a tile on one side to its partner on the other; a line follows
 * the finger. A right pair locks in with a colored line joining them; a wrong
 * pair shakes and is reported through `onWrong`. Tapping one tile, then the
 * other, also works (fallback for keyboard / students who can't drag yet).
 * Touching a word says it (when read-aloud is on), for students who can't read yet.
 */
export function WordNumeralMatch({
  items,
  numeralOrder,
  onDone,
  onWrong,
}: {
  items: MatchItem[];
  /** The numerals in the order shown on the right (pre-shuffled by the problem, so it stays put). */
  numeralOrder: number[];
  onDone: () => void;
  onWrong: () => void;
}) {
  const ttsOn = useTtsEnabled();
  const speakId = useId();
  const [pick, setPick] = useState<Pick>(null);
  const [matched, setMatched] = useState<number[]>([]); // in the order they were matched
  const [shake, setShake] = useState<{ word: number; num: number; key: number } | null>(null);
  const [drag, setDrag] = useState<{ side: Side; n: number; from: Pt; to: Pt } | null>(null);
  const allDone = matched.length === items.length;

  const boxRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef(new Map<string, HTMLButtonElement>());
  const press = useRef<{ side: Side; n: number; x: number; y: number; dragging: boolean } | null>(null);
  const justDragged = useRef(false);

  // onDone is a fresh function every parent render; keep the latest in a ref
  // so re-renders don't restart the timer.
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });
  useEffect(() => {
    if (!allDone) return;
    const t = window.setTimeout(() => onDoneRef.current(), 900); // a beat to see the last pair lock in
    return () => window.clearTimeout(t);
  }, [allDone]);

  // Where each tile's line attaches (word: right edge, numeral: left edge),
  // in the box's own coordinates. Re-measured on resize.
  const [anchors, setAnchors] = useState<Record<string, Pt>>({});
  const measure = () => {
    const box = boxRef.current?.getBoundingClientRect();
    if (!box) return;
    const next: Record<string, Pt> = {};
    tileRefs.current.forEach((el, key) => {
      const r = el.getBoundingClientRect();
      next[key] = { x: (key.startsWith("word") ? r.right : r.left) - box.left, y: r.top + r.height / 2 - box.top };
    });
    setAnchors(next);
  };
  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (boxRef.current) ro.observe(boxRef.current);
    return () => ro.disconnect();
  }, []);
  // A shaken or locked tile is redrawn; keep the line ends on it.
  useLayoutEffect(measure, [matched, shake]);

  const say = (n: number) => {
    if (ttsOn) sayText(speakId, items.find((it) => it.n === n)!.word);
  };

  const tryPair = (word: number, num: number) => {
    if (word === num) {
      setMatched((m) => [...m, word]);
    } else {
      setShake({ word, num, key: Date.now() });
      onWrong();
    }
  };

  // ---- tap fallback ----
  const tap = (side: Side, n: number) => {
    if (justDragged.current) {
      justDragged.current = false;
      return;
    }
    if (matched.includes(n)) return;
    if (!pick || pick.side === side) {
      setPick({ side, n });
      return;
    }
    setPick(null);
    tryPair(side === "word" ? n : pick.n, side === "num" ? n : pick.n);
  };

  // ---- drag ----
  const local = (e: ReactPointerEvent): Pt => {
    const box = boxRef.current!.getBoundingClientRect();
    return { x: e.clientX - box.left, y: e.clientY - box.top };
  };
  const onDown = (side: Side, n: number) => (e: ReactPointerEvent<HTMLButtonElement>) => {
    justDragged.current = false;
    if (matched.includes(n)) return;
    if (side === "word") say(n); // covers taps too
    press.current = { side, n, x: e.clientX, y: e.clientY, dragging: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const p = press.current;
    if (!p) return;
    if (!p.dragging && Math.hypot(e.clientX - p.x, e.clientY - p.y) < DRAG_START_PX) return;
    if (!p.dragging) {
      p.dragging = true;
      setPick(null);
      measure();
    }
    const from = anchors[`${p.side}-${p.n}`] ?? local(e);
    setDrag({ side: p.side, n: p.n, from, to: local(e) });
  };
  const onUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const p = press.current;
    press.current = null;
    if (!p?.dragging) return; // a tap: the click handler takes it
    justDragged.current = true;
    setDrag(null);
    const target = document.elementFromPoint(e.clientX, e.clientY)?.closest<HTMLElement>("[data-match-side]");
    if (!target) return;
    const side = target.dataset.matchSide as Side;
    const n = Number(target.dataset.matchN);
    if (side === p.side || matched.includes(n)) return;
    tryPair(p.side === "word" ? p.n : n, p.side === "num" ? p.n : n);
  };
  const onCancel = () => {
    press.current = null;
    setDrag(null);
  };

  const tileStyle = (side: Side, n: number): CSSProperties => {
    const pairIdx = matched.indexOf(n);
    const selected = (pick?.side === side && pick.n === n) || (drag?.side === side && drag.n === n);
    const base: CSSProperties = {
      minHeight: 60,
      minWidth: side === "num" ? 76 : 150,
      padding: "8px 16px",
      borderRadius: 14,
      border: "3px solid var(--line)",
      background: "var(--card)",
      color: "var(--ink)",
      fontSize: 26,
      fontWeight: 800,
      cursor: "grab",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      touchAction: "none", // let a finger drag instead of scrolling the page
      userSelect: "none",
      position: "relative",
      zIndex: 1,
    };
    if (pairIdx >= 0) {
      const c = PAIR_COLORS[pairIdx % PAIR_COLORS.length];
      return { ...base, borderColor: c.main, background: c.soft, cursor: "default" };
    }
    if (selected) return { ...base, borderColor: "var(--ink)", boxShadow: "0 0 0 4px var(--grid)" };
    return base;
  };

  const shaking = (side: Side, n: number) => !!shake && (side === "word" ? shake.word === n : shake.num === n);

  const tile = (side: Side, n: number, label: ReactNode, ariaLabel?: string) => (
    <button
      key={`${side}-${n}-${shaking(side, n) ? shake!.key : 0}`}
      ref={(el) => {
        if (el) tileRefs.current.set(`${side}-${n}`, el);
        else tileRefs.current.delete(`${side}-${n}`);
      }}
      type="button"
      data-match-side={side}
      data-match-n={n}
      className={shaking(side, n) ? "match-shake" : undefined}
      style={tileStyle(side, n)}
      aria-pressed={pick?.side === side && pick.n === n}
      aria-disabled={matched.includes(n)}
      aria-label={ariaLabel}
      onPointerDown={onDown(side, n)}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onCancel}
      onClick={() => tap(side, n)}
    >
      {label}
    </button>
  );

  return (
    <div ref={boxRef} style={{ position: "relative", display: "flex", gap: 96, alignItems: "flex-start", width: "fit-content" }}>
      {/* Lines: one per locked pair, plus the one following the finger. */}
      <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", overflow: "visible", zIndex: 0 }}>
        {matched.map((n, i) => {
          const a = anchors[`word-${n}`];
          const b = anchors[`num-${n}`];
          if (!a || !b) return null;
          return <line key={n} x1={a.x} y1={a.y} x2={b.x} y2={b.y} style={{ stroke: PAIR_COLORS[i % PAIR_COLORS.length].main, strokeWidth: 5, strokeLinecap: "round" }} />;
        })}
        {drag && <line x1={drag.from.x} y1={drag.from.y} x2={drag.to.x} y2={drag.to.y} style={{ stroke: "var(--ink)", strokeWidth: 4, strokeDasharray: "8 6", strokeLinecap: "round" }} />}
      </svg>
      <div role="group" aria-label="Number words" style={{ display: "grid", gap: 12 }}>
        {items.map((it) =>
          tile(
            "word",
            it.n,
            <>
              {ttsOn && (
                <span aria-hidden style={{ fontSize: 18, marginRight: 8 }}>
                  🔊
                </span>
              )}
              {it.word}
            </>
          )
        )}
      </div>
      <div role="group" aria-label="Numerals" style={{ display: "grid", gap: 12 }}>
        {numeralOrder.map((n) => tile("num", n, <BigDigit d={n} size={34} />, `numeral ${n}`))}
      </div>
    </div>
  );
}
