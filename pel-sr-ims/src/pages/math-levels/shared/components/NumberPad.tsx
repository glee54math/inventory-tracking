import { useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent, type RefObject } from "react";

/**
 * Big on-screen number pads for early learners, so the iPad keyboard never
 * opens. Two kinds:
 *
 * - InlineNumberPad: part of the page, right under one answer box (practice
 *   and test questions). Nothing gets covered and nothing jumps.
 * - NumberPad: one floating pad for any other box marked `data-numpad`
 *   (e.g. the number-bond boxes in a Check for Understanding). It shows while
 *   such a box has focus, next to the boxes (see "Where the floating pad goes").
 *
 * Boxes using either set inputMode="none" (see numberPadProps() in engine/audience.tsx).
 */
const MAX_DIGITS = 3;

/** Set a React-controlled input's value so React's onChange still fires. */
function setNativeValue(el: HTMLInputElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")?.set;
  setter?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

function PadKeys({ getTarget, submits, onDone }: { getTarget: () => HTMLInputElement | null; submits: boolean; onDone?: () => void }) {
  const typeKey = (key: string) => {
    const target = getTarget();
    if (!target) return;
    const v = target.value;
    if (key === "back") setNativeValue(target, v.slice(0, -1));
    else if (v.replace(/\D/g, "").length < MAX_DIGITS) setNativeValue(target, v + key);
  };
  const done = () => {
    const target = getTarget();
    if (submits) target?.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    else onDone?.();
  };
  // preventDefault on pointer/mouse down keeps focus where it is.
  const keep = (e: PointerEvent | MouseEvent) => e.preventDefault();
  const key = (label: string, onPress: () => void, className = "", aria?: string) => (
    <button type="button" key={label} className={`numpad-key ${className}`} aria-label={aria} onPointerDown={keep} onMouseDown={keep} onClick={onPress}>
      {label}
    </button>
  );
  return (
    <>
      {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => key(d, () => typeKey(d)))}
      {key("⌫", () => typeKey("back"), "numpad-back", "Erase")}
      {key("0", () => typeKey("0"))}
      {key(submits ? "Check" : "Done", done, "numpad-done")}
    </>
  );
}

/** A pad that sits in the page under one answer box. Its "Check" key presses Enter in that box. */
export function InlineNumberPad({ inputRef }: { inputRef: RefObject<HTMLInputElement | null> }) {
  return (
    <div className="numpad numpad-inline" role="group" aria-label="Number pad" data-tts-skip>
      <PadKeys getTarget={() => inputRef.current} submits />
    </div>
  );
}

const isPadInput = (t: EventTarget | null): t is HTMLInputElement => t instanceof HTMLInputElement && t.dataset.numpad !== undefined && t.dataset.numpad !== "inline";

/* ---------- Where the floating pad goes ----------
 * The pad sits next to the boxes it types into, without covering them, a
 * picture, the question words or a button. It tries a few spots in order and
 * takes the first one that is on screen, covers nothing, and is close to the
 * boxes:
 *   Practice (picture column on the left): left of the question, under the
 *     picture; then left of it; then below; then right.
 *   Anywhere else (Tests, Check for Understanding, Explore): below the boxes
 *     (lined up with their left edge, then their right edge), then right of
 *     them, then left, then above.
 * When a new question gets the pad and no spot is clear (short screens), the
 * page scrolls down just far enough for one to be. If none ever is, the pad
 * takes the spot that covers the least.
 */
type Box = { left: number; top: number; right: number; bottom: number };
type Spot = { name: string; x: number; y: number };
type Scene = {
  w: number;
  h: number;
  group: Box;
  /** [box, weight, stays put when the page scrolls] */
  avoid: [Box, number, boolean][];
  visual: Box | null;
};

const GAP = 12;
const EDGE = 8;
/** The pad must stay this close to the boxes (px between the two edges). */
const MAX_DIST = 140;
/** Things the pad must not cover. Small pictures (icons) are skipped. */
const AVOID =
  ".problem-visual, [data-numpad-avoid], svg, canvas, img, .story, .test-prompt, .step-prompt, button, input[data-numpad], .rail, .tts-toolbar, .tts-sound-banner";
/** These stay where they are when the page scrolls. */
const PINNED = ".rail, .tts-toolbar, .tts-sound-banner";
/** The card the pad sits beside, when the boxes are in one (Practice steps).
 *  Mark a custom one with `data-numpad-group`. */
const CARD = "[data-numpad-group], .step";
/** One question: moving between its boxes never scrolls the page. */
const QUESTION = `${CARD}, .test-question`;

const toBox = (r: DOMRect): Box => ({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
const shift = (b: Box, dy: number): Box => ({ ...b, top: b.top - dy, bottom: b.bottom - dy });
const union = (a: Box, b: Box): Box => ({ left: Math.min(a.left, b.left), top: Math.min(a.top, b.top), right: Math.max(a.right, b.right), bottom: Math.max(a.bottom, b.bottom) });
const overlap = (a: Box, b: Box) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
const distance = (a: Box, b: Box) => Math.hypot(Math.max(0, a.left - b.right, b.left - a.right), Math.max(0, a.top - b.bottom, b.top - a.bottom));

/** The boxes the pad belongs to: their card, or (Tests) just the typing boxes. */
function groupBox(target: HTMLInputElement): Box {
  const card = target.closest(CARD);
  if (card) return toBox(card.getBoundingClientRect());
  const scope = target.closest(".test-question") ?? target.parentElement;
  let box = toBox(target.getBoundingClientRect());
  scope?.querySelectorAll<HTMLInputElement>("input[data-numpad]").forEach((el) => {
    if (el.offsetParent) box = union(box, toBox(el.getBoundingClientRect()));
  });
  return box;
}

function measure(pad: HTMLElement, target: HTMLInputElement): Scene {
  const group = groupBox(target);
  const card = target.closest(CARD);
  const avoid: Scene["avoid"] = [[group, 4, false]];
  document.querySelectorAll(AVOID).forEach((el) => {
    if (pad.contains(el) || card?.contains(el)) return;
    // Buttons in the unit list or the read-aloud bar count as part of it.
    if (!el.matches(PINNED) && el.parentElement?.closest(PINNED)) return;
    // A picture inside an avoided box is already counted with that box.
    if (el.matches("svg, canvas, img") && el.parentElement?.closest(".problem-visual, svg, button")) return;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    if (el.matches("svg, canvas, img") && r.width * r.height < 80 * 60) return;
    const pinned = el.matches(PINNED);
    // Covering the unit list or the read-aloud bar is as bad as covering the boxes.
    avoid.push([toBox(r), pinned ? 4 : 1, pinned]);
  });
  const visual = target.closest(".problem")?.querySelector(".problem-visual");
  return { w: pad.offsetWidth, h: pad.offsetHeight, group, avoid, visual: visual ? toBox(visual.getBoundingClientRect()) : null };
}

/** The best spot if the page were scrolled down by `dy` px. */
function choose(scene: Scene, dy: number, keep: string | null): { spot: Spot; clear: boolean } {
  const { w, h } = scene;
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const screen: Box = { left: 0, top: 0, right: vw, bottom: vh };
  const group = shift(scene.group, dy);
  const clampY = (y: number) => Math.min(Math.max(y, EDGE), vh - h - EDGE);
  const clampX = (x: number) => Math.min(Math.max(x, EDGE), vw - w - EDGE);
  const spots: Spot[] = [];
  if (scene.visual) {
    const visual = shift(scene.visual, dy);
    spots.push({ name: "left-under-picture", x: group.left - GAP - w, y: clampY(Math.max(group.top, visual.bottom + GAP)) });
    spots.push({ name: "left", x: group.left - GAP - w, y: clampY(group.top) });
    spots.push({ name: "below", x: clampX(group.left), y: group.bottom + GAP });
    spots.push({ name: "below-end", x: clampX(group.right - w), y: group.bottom + GAP });
    spots.push({ name: "right", x: group.right + GAP, y: clampY(group.top) });
  } else {
    spots.push({ name: "below", x: clampX(group.left), y: group.bottom + GAP });
    spots.push({ name: "below-end", x: clampX(group.right - w), y: group.bottom + GAP });
    spots.push({ name: "right", x: group.right + GAP, y: clampY(group.top) });
    spots.push({ name: "left", x: group.left - GAP - w, y: clampY(group.top) });
    spots.push({ name: "above", x: clampX(group.left), y: group.top - GAP - h });
  }
  const score = (s: Spot) => {
    const box: Box = { left: s.x, top: s.y, right: s.x + w, bottom: s.y + h };
    const offScreen = w * h - overlap(box, screen);
    const covered = scene.avoid.reduce((sum, [a, weight, pinned]) => sum + overlap(box, pinned ? a : shift(a, dy)) * weight, 0);
    const tooFar = Math.max(0, distance(box, group) - MAX_DIST);
    return offScreen * 4 + covered + tooFar * 50;
  };
  const clear = spots.filter((s) => score(s) === 0);
  // Stay put while the current spot still works, so the pad doesn't hop around.
  const spot = clear.find((s) => s.name === keep) ?? clear[0] ?? spots.reduce((a, b) => (score(b) < score(a) ? b : a));
  return { spot, clear: clear.length > 0 };
}

/** How far to scroll down (px; negative is up) so the box is on screen and a
 *  spot is clear; null if no scroll does it. */
function roomScroll(scene: Scene, target: HTMLInputElement): number | null {
  const vh = window.innerHeight;
  const box = target.getBoundingClientRect();
  const maxDown = document.documentElement.scrollHeight - vh - window.scrollY;
  // Start with the smallest scroll that shows the whole box, then go further a step at a time.
  const from = box.bottom > vh - EDGE ? box.bottom - vh + 4 * EDGE : box.top < EDGE ? box.top - 4 * EDGE : 0;
  for (let dy = Math.max(from, -window.scrollY); dy <= maxDown && box.top - dy >= EDGE; dy += 24) {
    if (choose(scene, dy, null).clear) return dy;
  }
  return null;
}

function moveTo(pad: HTMLElement, spot: Spot) {
  pad.style.left = `${Math.round(spot.x)}px`;
  pad.style.top = `${Math.round(spot.y)}px`;
  pad.style.bottom = "auto";
  pad.dataset.spot = spot.name;
}

/** The floating pad, for boxes marked `data-numpad` that have no inline pad. */
export function NumberPad() {
  const [target, setTarget] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    const onIn = (e: FocusEvent) => {
      if (!isPadInput(e.target)) return;
      setTarget(e.target);
    };
    const onOut = (e: FocusEvent) => {
      if (isPadInput(e.relatedTarget)) return;
      setTarget((cur) => (cur === e.target ? null : cur));
    };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  // Put the pad next to the boxes, and move it again whenever
  // the page scrolls, resizes, or the question card changes size.
  const padRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<string | null>(null);
  const groupRef = useRef<Element | null>(null);
  useLayoutEffect(() => {
    const pad = padRef.current;
    if (!target || !pad) return;
    const place = () => {
      if (!target.isConnected) return;
      const { spot } = choose(measure(pad, target), 0, spotRef.current);
      spotRef.current = spot.name;
      moveTo(pad, spot);
    };
    // A new question, or a box off screen: scroll just far enough that the
    // box shows and the pad has a clear spot. Moving between the boxes of one
    // question never scrolls. The pad follows as the page scrolls.
    const question = target.closest(QUESTION) ?? target.parentElement;
    const newQuestion = question !== groupRef.current;
    groupRef.current = question;
    const scene = measure(pad, target);
    const first = choose(scene, 0, spotRef.current);
    spotRef.current = first.spot.name;
    moveTo(pad, first.spot);
    const box = target.getBoundingClientRect();
    const offScreen = box.top < 0 || box.bottom > window.innerHeight;
    if (offScreen || (newQuestion && !first.clear)) {
      const dy = roomScroll(scene, target);
      if (dy !== null) window.scrollBy({ top: dy, behavior: "smooth" });
      else if (offScreen) target.scrollIntoView({ block: "center", behavior: "smooth" });
    }

    let frame = 0;
    const later = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };
    window.addEventListener("scroll", later, true);
    window.addEventListener("resize", later);
    const resize = new ResizeObserver(later);
    resize.observe(target.closest(CARD) ?? target);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", later, true);
      window.removeEventListener("resize", later);
      resize.disconnect();
    };
  }, [target]);
  // A new question starts fresh (no "stay put" spot from the last one).
  useEffect(() => {
    if (!target) spotRef.current = groupRef.current = null;
  }, [target]);

  // Hide when the box disappears (e.g. the question was answered) without a blur event.
  useEffect(() => {
    if (!target) return;
    const obs = new MutationObserver(() => {
      if (!target.isConnected) setTarget(null);
    });
    obs.observe(document.body, { childList: true, subtree: true });
    return () => obs.disconnect();
  }, [target]);

  if (!target) return null;
  return (
    <div ref={padRef} className="numpad numpad-float" role="group" aria-label="Number pad" data-tts-skip>
      <PadKeys getTarget={() => target} submits={target.dataset.numpad === "enter"} onDone={() => target.blur()} />
    </div>
  );
}
