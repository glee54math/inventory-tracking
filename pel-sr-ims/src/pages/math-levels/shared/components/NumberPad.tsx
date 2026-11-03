import { useEffect, useState, type MouseEvent, type PointerEvent, type RefObject } from "react";

/**
 * Big on-screen number pads for early learners, so the iPad keyboard never
 * opens. Two kinds:
 *
 * - InlineNumberPad: part of the page, right under one answer box (practice
 *   and test questions). Nothing gets covered and nothing jumps.
 * - NumberPad: one floating pad for any other box marked `data-numpad`
 *   (e.g. the number-bond boxes in a Check for Understanding). It shows while
 *   such a box has focus.
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

/** The floating pad, for boxes marked `data-numpad` that have no inline pad. */
export function NumberPad() {
  const [target, setTarget] = useState<HTMLInputElement | null>(null);

  useEffect(() => {
    const onIn = (e: FocusEvent) => {
      if (!isPadInput(e.target)) return;
      setTarget(e.target);
      // Keep the box clear of the pad, which sits at the bottom of the screen.
      e.target.scrollIntoView({ block: "center", behavior: "smooth" });
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
    <div className="numpad numpad-float" role="group" aria-label="Number pad" data-tts-skip>
      <PadKeys getTarget={() => target} submits={target.dataset.numpad === "enter"} onDone={() => target.blur()} />
    </div>
  );
}
