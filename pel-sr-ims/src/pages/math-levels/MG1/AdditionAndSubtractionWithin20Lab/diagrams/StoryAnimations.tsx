import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { palette } from "../../../shared/lib/palette";
import type { Tone } from "./TenFrame";
import type { StoryPart } from "./StoryStrip";

/*
 * MG1 U3 "Add To and Take From Stories" Explore pictures.
 * Source: MG1 U3 redesign (user-approved mockup v2). Scope: K–1 band.
 *   - FrogStory: the story acted out in ONE ten frame. Add To: counters hop in
 *     from the Add box, the frog counts them on (6, 7, 8), the same box turns
 *     from Start into End. Take From: the frog starts on the last box and hops
 *     back, leaving ✕s; they disappear and the rest is the End. Loops by itself.
 *   - MissingPartPlayer: Start / Change / End tagged boxes, the missing one
 *     dashed. While `playing`, it acts out the right way to find the missing
 *     part, then calls onFinished (the Explore moves the carousel on).
 */

const TONE: Record<Tone, string> = { a: palette.a, b: palette.b, c: palette.c };
const SOFT: Record<Tone, string> = { a: palette.aSoft, b: palette.bSoft, c: palette.cSoft };
const GREY = "#8a7a5a";

const STYLE_ID = "mg1-atf-anim-style";
const CSS = `
@keyframes atfPop { 0% { transform: scale(.2); } 70% { transform: scale(1.18); } 100% { transform: scale(1); } }
@keyframes atfBreathe { 50% { box-shadow: 0 0 0 7px rgba(138,122,90,.18); } }
.atf-pop { animation: atfPop .45s ease-out; }
.atf-missing { animation: atfBreathe 1.4s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce) { .atf-pop, .atf-missing { animation: none; } }
`;
function ensureStyle() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

const reducedMotion = () => typeof window !== "undefined" && !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// ---------------------------------------------------------------------------
// Ten frames drawn as boxes (so counters can carry numbers, ✕s and hops)
// ---------------------------------------------------------------------------

export interface Cell {
  tone?: Tone;
  /** A number written on the counter (counting on / back). */
  t?: number;
  cross?: boolean;
  ghost?: boolean;
  /** An empty dashed spot (a counter left from here, or will land here). */
  dash?: boolean;
  vanish?: boolean;
  pop?: boolean;
}

const rep = (n: number, c: Cell): Cell[] => Array.from({ length: Math.max(0, n) }, () => ({ ...c }));

function Cells({ cells, total, size, column }: { cells: Cell[]; total: 10 | 20; size: number; column?: boolean }) {
  const gap = Math.round(size * 0.14);
  return (
    <div style={{ display: "flex", flexDirection: column ? "column" : "row", flexWrap: "wrap", gap: 8, justifyContent: "center", alignItems: "center" }}>
      {Array.from({ length: total / 10 }, (_, f) => (
        <div key={f} style={{ display: "grid", gridTemplateColumns: `repeat(5, ${size}px)`, gap, padding: 4 }}>
          {Array.from({ length: 10 }, (_, j) => {
            const i = f * 10 + j;
            const c = cells[i] ?? {};
            const filled = !!c.tone && !c.dash;
            return (
              <div
                key={i}
                data-i={i}
                className={c.pop ? "atf-pop" : undefined}
                style={{
                  width: size,
                  height: size,
                  boxSizing: "border-box",
                  borderRadius: Math.round(size * 0.2),
                  border: c.dash ? `3px dashed ${palette.b}` : `2px solid ${filled ? "transparent" : palette.line}`,
                  background: c.dash ? palette.bSoft : filled ? TONE[c.tone!] : "#fff",
                  opacity: c.vanish ? 0 : c.ghost ? 0.28 : 1,
                  filter: c.cross ? "saturate(.5) brightness(1.15)" : undefined,
                  transition: "opacity .45s",
                  position: "relative",
                  display: "grid",
                  placeItems: "center",
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: size * 0.46,
                  lineHeight: 1,
                }}
              >
                {c.t}
                {c.cross && (
                  <span aria-hidden="true" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", color: palette.ink, fontSize: size * 0.85, fontWeight: 900, opacity: 0.85 }}>
                    ✕
                  </span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/** A role box: solid colored border + tag (or dashed grey while it is the missing part). */
function RoleBox({ tone, tag, missing, solved, children, minWidth }: { tone: Tone; tag: string; missing?: boolean; solved?: boolean; children: ReactNode; minWidth?: number }) {
  ensureStyle();
  return (
    <div
      className={missing ? "atf-missing" : undefined}
      style={{
        position: "relative",
        borderRadius: 16,
        padding: "26px 10px 8px",
        textAlign: "center",
        minWidth,
        border: missing ? `4px dashed ${GREY}` : `4px solid ${TONE[tone]}`,
        background: missing ? "#fffdf7" : SOFT[tone],
        boxShadow: solved ? "0 0 0 6px rgba(47,143,106,.25)" : undefined,
      }}
    >
      <span style={{ position: "absolute", top: -15, left: 12, color: "#fff", fontWeight: 800, fontSize: 15, padding: "3px 12px", borderRadius: 999, whiteSpace: "nowrap", background: missing ? GREY : TONE[tone] }}>
        {tag}
      </span>
      {children}
    </div>
  );
}

const Big = ({ color, children }: { color: string; children: ReactNode }) => (
  <div style={{ fontSize: 30, fontWeight: 900, lineHeight: 1.15, color }}>{children}</div>
);
const Sign = ({ children }: { children: string }) => (
  <span aria-hidden="true" style={{ fontSize: 34, fontWeight: 800, color: palette.muted }}>
    {children}
  </span>
);
const C = ({ tone, children }: { tone: Tone; children: ReactNode }) => <span style={{ color: TONE[tone] }}>{children}</span>;
const sayStyle = { fontSize: 21, fontWeight: 800, minHeight: 30, margin: 0 } as const;

/**
 * The story's equation, written above the picture in the parts' colors
 * (start green, change orange, end purple). An unknown part is a dashed "?"
 * box until the picture finds it, then its number pops in.
 */
function StoryEquation({ start, change, end, action, unknown, found }: { start: number; change: number; end: number; action: "add" | "take"; unknown?: StoryPart | null; found?: StoryPart | null }) {
  ensureStyle();
  const term = (part: StoryPart, n: number, tone: Tone) =>
    part === unknown ? (
      <span style={{ display: "inline-grid", placeItems: "center", minWidth: 46, height: 46, border: `3px dashed ${GREY}`, borderRadius: 10, color: GREY, background: "#fffdf7" }}>?</span>
    ) : (
      <span className={part === found ? "atf-pop" : undefined} style={{ color: TONE[tone], display: "inline-block" }}>
        {n}
      </span>
    );
  const op = action === "add" ? "+" : "−";
  const said = (part: StoryPart, n: number) => (part === unknown ? "what number" : String(n));
  return (
    <div
      role="img"
      aria-label={`${said("start", start)} ${action === "add" ? "plus" : "minus"} ${said("change", change)} equals ${said("end", end)}`}
      style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 34, fontWeight: 900, lineHeight: 1, margin: "4px 0 2px" }}
    >
      {term("start", start, "a")}
      <span style={{ color: palette.muted }}>{op}</span>
      {term("change", change, "b")}
      <span style={{ color: palette.muted }}>=</span>
      {term("end", end, "c")}
    </div>
  );
}
const nums = (from: number, n: number, dir = 1) => Array.from({ length: Math.max(0, n) }, (_, i) => from + dir * (i + 1));
const list = (a: number[]) => a.join(", ");

// ---------------------------------------------------------------------------
// FrogStory — the "Build your own story" picture
// ---------------------------------------------------------------------------

const FROG_CELL = 40;

export function FrogStory({ start: s, change: k, action }: { start: number; change: number; action: "add" | "take" }) {
  const add = action === "add";
  const e = add ? s + k : s - k;
  const total: 10 | 20 = (add ? e : s) > 10 ? 20 : 10;
  const reduce = reducedMotion();
  // Phase: 0 = the start; 1..k = hops done; k+1 = ✕s fade / frog leaves; k+2 = the End.
  const last = k + 2;
  const [p, setP] = useState(reduce ? last : 0);

  useEffect(() => {
    if (reduce) return;
    const wait = p === 0 ? 1500 : p <= k ? 1000 : p === k + 1 ? 500 : 2800;
    const t = window.setTimeout(() => setP(p >= last ? 0 : p + 1), wait);
    return () => window.clearTimeout(t);
  }, [p, k, last, reduce]);

  const h = Math.min(p, k);
  const done = p >= last;
  let cells: Cell[];
  let side: Cell[];
  if (add) {
    cells = [...rep(s, { tone: "a" }), ...Array.from({ length: h }, (_, i) => ({ tone: "b" as Tone, t: s + i + 1 }))];
    side = Array.from({ length: k }, (_, i) => (i >= k - h ? { dash: true } : { tone: "b" as Tone }));
  } else {
    cells = done ? rep(e, { tone: "a" }) : Array.from({ length: s }, (_, i) => (i >= s - h ? { tone: "a" as Tone, cross: true, vanish: p === k + 1 } : { tone: "a" as Tone }));
    side = Array.from({ length: k }, (_, i) => (i < h ? { tone: "b" as Tone, cross: true, pop: i === h - 1 } : { dash: true }));
  }
  const num = add ? s + h : done ? e : s - h;
  const frogIndex = add ? s + h - 1 : s - h - 1;
  const frogOn = !reduce && p <= k;

  const stageRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);
  const frogRef = useRef<HTMLDivElement>(null);
  const frogPos = useRef<{ x: number; y: number } | null>(null);
  const placeRef = useRef<(hop: boolean) => void>(() => {});

  placeRef.current = (hop: boolean) => {
    const stage = stageRef.current;
    const frog = frogRef.current;
    const cell = frameRef.current?.querySelector<HTMLElement>(`[data-i="${Math.max(0, frogIndex)}"]`);
    if (!stage || !frog || !cell) return;
    const st = stage.getBoundingClientRect();
    const r = cell.getBoundingClientRect();
    let x = r.left - st.left + r.width / 2 - 17;
    const y = r.top - st.top + r.height / 2 - 20;
    if (frogIndex < 0) x -= r.width + 10; // before the first box
    frog.getAnimations?.().forEach((a) => a.cancel());
    const to = `translate(${x}px, ${y}px)`;
    const prev = frogPos.current;
    frog.style.transform = to;
    if (hop && prev && typeof frog.animate === "function") {
      frog.animate(
        [{ transform: `translate(${prev.x}px, ${prev.y}px)` }, { transform: `translate(${(prev.x + x) / 2}px, ${Math.min(prev.y, y) - 42}px)` }, { transform: to }],
        { duration: 620, easing: "ease-in-out" },
      );
    }
    frogPos.current = { x, y };
  };

  useLayoutEffect(() => {
    const hopping = p >= 1 && p <= k;
    // Measure the frog's box BEFORE the counter's flight moves it.
    placeRef.current(hopping && !reduce);
    if (!add || !hopping || reduce) return;
    const tgt = frameRef.current?.querySelector<HTMLElement>(`[data-i="${s + p - 1}"]`);
    const src = sideRef.current?.querySelector<HTMLElement>(`[data-i="${k - p}"]`);
    if (!tgt || !src || typeof tgt.animate !== "function") return;
    const a = src.getBoundingClientRect();
    const b = tgt.getBoundingClientRect();
    const dx = a.left - b.left;
    const dy = a.top - b.top;
    tgt.animate(
      [{ transform: `translate(${dx}px, ${dy}px) scale(.6)` }, { transform: `translate(${dx / 2}px, ${dy / 2 - 50}px) scale(.85)` }, { transform: "translate(0, 0) scale(1)" }],
      { duration: 650, easing: "ease-in-out" },
    );
  }, [p, k, s, add, reduce]);

  // Keep the frog on its box when the layout changes size.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => placeRef.current(false));
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const say: ReactNode = done ? (
    <>
      <C tone="a">{s}</C> {add ? "+" : "−"} <C tone="b">{k}</C> = {e}. It went {add ? "up" : "down"}. This is {add ? "an Add To" : "a Take From"} story.
    </>
  ) : h === 0 ? (
    <>
      Start with <C tone="a">{s}</C>. {add ? "Add" : "Take away"} <C tone="b">{k}</C>.
    </>
  ) : (
    <>
      <C tone="a">{s}</C> … <C tone="b">{list(nums(s, h, add ? 1 : -1))}</C>
    </>
  );

  return (
    <div>
      <StoryEquation start={s} change={k} end={e} action={action} unknown={done ? null : "end"} found={done ? "end" : null} />
      <div ref={stageRef} style={{ position: "relative", paddingTop: 20 }}>
        <div className="control-row" style={{ gap: 18, alignItems: "center" }}>
          <RoleBox tone="a" tag={done ? "End" : "Start"}>
            <div ref={frameRef}>
              <Cells cells={cells} total={total} size={FROG_CELL} />
            </div>
            <Big color={palette.a}>{num}</Big>
          </RoleBox>
          <Sign>{add ? "+" : "−"}</Sign>
          <RoleBox tone="b" tag={add ? `+ Add ${k}` : `− Take away ${k}`}>
            <div ref={sideRef}>
              <Cells cells={side} total={k > 10 ? 20 : 10} size={22} />
            </div>
            <Big color={palette.b}>{k}</Big>
          </RoleBox>
          <span aria-hidden="true" style={{ fontSize: 44, fontWeight: 900, minWidth: 44, textAlign: "center", color: add ? palette.a : palette.b }}>
            {done ? (add ? "⬆" : "⬇") : ""}
          </span>
        </div>
        <div
          ref={frogRef}
          aria-hidden="true"
          style={{ position: "absolute", left: 0, top: 0, fontSize: 34, lineHeight: 1, pointerEvents: "none", zIndex: 5, opacity: frogOn ? 1 : 0, transition: "opacity .4s", filter: "drop-shadow(0 2px 2px rgba(0,0,0,.25))" }}
        >
          🐸
        </div>
      </div>
      <p aria-hidden="true" style={{ ...sayStyle, marginTop: 10 }}>
        {say}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MissingPartPlayer — "What is missing?" with Play / Stop
// ---------------------------------------------------------------------------

interface Step {
  cells: Cell[];
  num: number | "?";
  say: ReactNode;
  wait?: number;
  solved?: boolean;
}

/** The way to find each missing part, as steps acted out inside the missing box. */
function strategy(part: StoryPart, s: number, k: number, action: "add" | "take"): Step[] {
  const add = action === "add";
  const e = add ? s + k : s - k;
  const steps: Step[] = [];
  const counted = (from: number, n: number, tone: Tone, dir = 1) => nums(from, n, dir).map((t, i) => ({ tone, t, pop: i === n - 1 }));
  if (add && part === "end") {
    // Count on from the bigger number (the Counting On unit's way).
    const big = Math.max(s, k);
    const sm = Math.min(s, k);
    const bt: Tone = s >= k ? "a" : "b";
    const st: Tone = s >= k ? "b" : "a";
    steps.push({ cells: rep(big, { tone: bt, pop: true }), num: big, say: <>Start at the bigger number: <C tone={bt}>{big}</C>.</>, wait: 1500 });
    for (let j = 1; j <= sm; j++) steps.push({ cells: [...rep(big, { tone: bt }), ...counted(big, j, st)], num: big + j, say: <><C tone={bt}>{big}</C> … <C tone={st}>{list(nums(big, j))}</C></> });
    steps.push({ cells: [...rep(big, { tone: bt }), ...nums(big, sm).map((t) => ({ tone: st, t }))], num: e, say: <><C tone={bt}>{big}</C>{sm > 0 && <>, then <C tone={st}>{list(nums(big, sm))}</C></>}. The end is {e}.</>, solved: true });
  } else if (add && part === "change") {
    steps.push({ cells: rep(s, { tone: "a", ghost: true }), num: "?", say: <>Start at <C tone="a">{s}</C>. Count on to {e}.</>, wait: 1500 });
    for (let j = 1; j <= k; j++) steps.push({ cells: [...rep(s, { tone: "a", ghost: true }), ...counted(0, j, "b")], num: "?", say: <><C tone="a">{s}</C> … <C tone="b">{list(nums(s, j))}</C></> });
    steps.push({ cells: nums(0, k).map((t) => ({ tone: "b" as Tone, t, pop: true })), num: k, say: <>That is <C tone="b">{k}</C> more.</>, solved: true });
  } else if (add && part === "start") {
    steps.push({ cells: rep(e, { tone: "c" }), num: "?", say: <>Start at the end: <C tone="c">{e}</C>. Take away <C tone="b">{k}</C>.</>, wait: 1500 });
    for (let j = 1; j <= k; j++) steps.push({ cells: [...rep(e - j, { tone: "c" }), ...Array.from({ length: j }, (_, i) => ({ tone: "b" as Tone, cross: true, pop: i === 0 }))], num: "?", say: <>Take away <C tone="b">{list(nums(0, j))}</C></> });
    steps.push({ cells: rep(s, { tone: "a", pop: true }), num: s, say: <><C tone="a">{s}</C> left. The start was <C tone="a">{s}</C>.</>, solved: true });
  } else if (!add && part === "end") {
    steps.push({ cells: rep(s, { tone: "a", pop: true }), num: "?", say: <>Start at <C tone="a">{s}</C>. Take away <C tone="b">{k}</C>.</>, wait: 1500 });
    for (let j = 1; j <= k; j++) steps.push({ cells: [...rep(s - j, { tone: "a" }), ...Array.from({ length: j }, (_, i) => ({ tone: "a" as Tone, cross: true, pop: i === 0 }))], num: "?", say: <><C tone="a">{s}</C> … {list(nums(s, j, -1))}</> });
    steps.push({ cells: rep(e, { tone: "c", pop: true }), num: e, say: <><C tone="a">{s}</C> − <C tone="b">{k}</C> = <C tone="c">{e}</C>. The end is {e}.</>, solved: true });
  } else if (!add && part === "change") {
    steps.push({ cells: rep(s, { tone: "a" }), num: "?", say: <>Start at <C tone="a">{s}</C>. Count back to {e}.</>, wait: 1500 });
    for (let j = 1; j <= k; j++) steps.push({ cells: [...rep(s - j, { tone: "a" }), ...Array.from({ length: j }, (_, i) => ({ tone: "b" as Tone, cross: true, t: j - i, pop: i === 0 }))], num: "?", say: <><C tone="a">{s}</C> … {list(nums(s, j, -1))}</> });
    steps.push({ cells: nums(0, k).map((t) => ({ tone: "b" as Tone, t, pop: true })), num: k, say: <>That is <C tone="b">{k}</C>.</>, solved: true });
  } else {
    steps.push({ cells: rep(e, { tone: "c" }), num: "?", say: <>Start at the end: <C tone="c">{e}</C>. Add back <C tone="b">{k}</C>.</>, wait: 1500 });
    for (let j = 1; j <= k; j++) steps.push({ cells: [...rep(e, { tone: "c" }), ...counted(e, j, "b")], num: "?", say: <><C tone="c">{e}</C> … <C tone="b">{list(nums(e, j))}</C></> });
    steps.push({ cells: rep(s, { tone: "a", pop: true }), num: s, say: <>The start was <C tone="a">{s}</C>.</>, solved: true });
  }
  return steps;
}

const PART_TONE: Record<StoryPart, Tone> = { start: "a", change: "b", end: "c" };

/**
 * Key this by the missing part and the numbers, so a new tab or new numbers
 * always start from the "?".
 */
export function MissingPartPlayer({
  start,
  change,
  action,
  missing,
  playing,
  onFinished,
}: {
  start: number;
  change: number;
  action: "add" | "take";
  missing: StoryPart;
  playing: boolean;
  /** Called after the answer has been shown for a moment (the carousel moves on). */
  onFinished: () => void;
}) {
  const add = action === "add";
  const end = add ? start + change : start - change;
  const steps = useMemo(() => strategy(missing, start, change, action), [missing, start, change, action]);
  const [i, setI] = useState(-1);
  const finished = useRef(onFinished);
  finished.current = onFinished;

  useEffect(() => {
    if (!playing) {
      setI(-1);
      return;
    }
    const lastStep = i === steps.length - 1;
    const wait = i < 0 ? 900 : (steps[i].wait ?? 1000) + (lastStep ? 1800 : 0);
    const t = window.setTimeout(() => (lastStep ? finished.current() : setI(i + 1)), wait);
    return () => window.clearTimeout(t);
  }, [playing, i, steps]);

  const step = playing && i >= 0 ? steps[i] : null;
  const value: Record<StoryPart, number> = { start, change, end };
  const total = (n: number): 10 | 20 => (n > 10 ? 20 : 10);
  const room = total(Math.max(start, change, end));

  const box = (part: StoryPart) => {
    const tone = PART_TONE[part];
    const tag = part === "change" ? (add ? "+ Add" : "− Take away") : part === "start" ? "Start" : "End";
    if (part !== missing) {
      return (
        <RoleBox tone={tone} tag={tag} minWidth={150}>
          <Cells cells={rep(value[part], { tone })} total={total(value[part])} size={20} column />
          <Big color={TONE[tone]}>{value[part]}</Big>
        </RoleBox>
      );
    }
    if (!step) {
      return (
        <RoleBox tone={tone} tag={`${tag} — missing!`} missing minWidth={150}>
          <div role="img" aria-label={`${tag}: missing`} style={{ fontSize: 52, fontWeight: 900, color: GREY, minHeight: 70, display: "grid", placeItems: "center" }}>
            ?
          </div>
          <Big color={GREY}>?</Big>
        </RoleBox>
      );
    }
    return (
      <RoleBox tone={tone} tag={step.solved ? tag : `${tag} — missing!`} missing={!step.solved} solved={step.solved} minWidth={150}>
        <Cells cells={step.cells} total={room} size={20} column />
        <Big color={step.solved ? TONE[tone] : GREY}>{step.num}</Big>
      </RoleBox>
    );
  };

  return (
    <div>
      <StoryEquation start={start} change={change} end={end} action={action} unknown={step?.solved ? null : missing} found={step?.solved ? missing : null} />
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", paddingTop: 20 }} role="group" aria-label="The story: start, change, end">
        {box("start")}
        <Sign>{add ? "+" : "−"}</Sign>
        {box("change")}
        <Sign>=</Sign>
        {box("end")}
      </div>
      <p aria-hidden="true" style={{ ...sayStyle, marginTop: 10 }}>
        {step?.say}
      </p>
    </div>
  );
}
