/**
 * Read-aloud UI for the early-grade labs (MK1–MG5).
 *
 *   <TtsProvider>    wrap a lab's root to turn read-aloud on for it, and
 *                    show the speed/stop toolbar. Without it, every
 *                    component below renders as plain markup with no icons.
 *   <ReadAloud>      any text block, with a speaker icon in front.
 *                    `as="p"` etc. picks the element; other props pass
 *                    through. `alsoRead` adds more elements to the same
 *                    reading (e.g. a prompt's answer choices).
 *   <SpeakButton>    just the icon, for placing by hand.
 *   <ReadAllButton>  reads every block in its parent section, top to bottom.
 *
 * Mark an element `data-readaloud-part` to have "Read all" include it
 * without giving it its own icon, and `data-tts-skip` to never read it.
 */
import React, { useEffect, useId, useRef } from "react";
import { Square, Volume2 } from "lucide-react";
import { getState, isTtsSupported, play, setSpeed, stop, type Speed } from "./speechEngine";
import { TtsContext, useTtsEnabled, useTtsState } from "./ttsContext";
import "./tts.css";

export function TtsProvider({ children, enabled = true }: { children: React.ReactNode; enabled?: boolean }) {
  const on = enabled && isTtsSupported();
  useEffect(() => () => stop(), []);
  return (
    <TtsContext.Provider value={{ enabled: on }}>
      {children}
      {on && <TtsToolbar />}
    </TtsContext.Provider>
  );
}

const SPEEDS: { id: Speed; label: string }[] = [
  { id: "slow", label: "🐢 Slow" },
  { id: "normal", label: "Normal" },
  { id: "fast", label: "🐇 Fast" },
];

function TtsToolbar() {
  const { playingId, speed } = useTtsState();
  return (
    <div className="tts-toolbar" role="region" aria-label="Read aloud settings" data-tts-skip>
      <span className="tts-toolbar-label">
        <Volume2 size={18} aria-hidden /> Speed
      </span>
      <div className="tts-speed" role="radiogroup" aria-label="Reading speed">
        {SPEEDS.map((o) => (
          <button key={o.id} type="button" role="radio" aria-checked={o.id === speed} className={o.id === speed ? "on" : ""} onClick={() => setSpeed(o.id)}>
            {o.label}
          </button>
        ))}
      </div>
      {playingId && (
        <button type="button" className="tts-toolbar-stop" onClick={stop}>
          <Square size={16} fill="currentColor" aria-hidden /> Stop
        </button>
      )}
    </div>
  );
}

/** Stop this reader's audio if the thing it belongs to disappears (tab change, next question…). */
function useStopOnUnmount(id: string) {
  useEffect(
    () => () => {
      // Read the live store, not a stale render value.
      if (getState().playingId === id) stop();
    },
    [id]
  );
}
export function SpeakButton({ targets, label = "Read this out loud" }: { targets: () => (Element | null | undefined)[]; label?: string }) {
  const enabled = useTtsEnabled();
  const id = useId();
  const { playingId } = useTtsState();
  useStopOnUnmount(id);
  if (!enabled) return null;
  const playing = playingId === id;
  return (
    <button
      type="button"
      className={`tts-btn${playing ? " playing" : ""}`}
      aria-label={playing ? "Stop reading" : label}
      title={playing ? "Stop" : "Read out loud"}
      data-tts-skip
      onClick={(e) => {
        e.stopPropagation();
        if (playing) stop();
        else play(id, targets().filter((t): t is Element => !!t));
      }}
    >
      {playing ? <Square size={16} fill="currentColor" aria-hidden /> : <Volume2 size={22} aria-hidden />}
    </button>
  );
}

type ReadAloudProps = {
  as?: keyof React.JSX.IntrinsicElements;
  /** Say this instead of the visible text. */
  text?: string;
  /** More elements to read right after this one, with the same icon. */
  alsoRead?: React.RefObject<Element | null>[];
  children?: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "className">;

export function ReadAloud({ as = "div", text, alsoRead, className, children, ...rest }: ReadAloudProps) {
  const enabled = useTtsEnabled();
  const ref = useRef<HTMLElement>(null);
  if (!enabled) return React.createElement(as, { className, ...rest }, children);
  return React.createElement(
    as,
    {
      ...rest,
      ref,
      className: className ? `${className} tts-block` : "tts-block",
      "data-readaloud": "",
      "data-tts-say": text,
    },
    <SpeakButton targets={() => [ref.current, ...(alsoRead ?? []).map((r) => r.current)]} />,
    children
  );
}

/** Reads every read-aloud block in the parent section (or `scope`), top to bottom. */
export function ReadAllButton({ scope, label = "Read all" }: { scope?: React.RefObject<Element | null>; label?: string }) {
  const enabled = useTtsEnabled();
  const id = useId();
  const ref = useRef<HTMLButtonElement>(null);
  const { playingId } = useTtsState();
  useStopOnUnmount(id);
  if (!enabled) return null;
  const playing = playingId === id;
  const start = () => {
    const root = scope?.current ?? ref.current?.parentElement;
    if (!root) return;
    const all = Array.from(root.querySelectorAll("[data-readaloud], [data-readaloud-part]"));
    // Only outermost blocks, so nested ones aren't read twice.
    const top = all.filter((el) => {
      const outer = el.parentElement?.closest("[data-readaloud], [data-readaloud-part]");
      return !outer || !root.contains(outer);
    });
    play(id, top);
  };
  return (
    <button ref={ref} type="button" className={`tts-read-all${playing ? " playing" : ""}`} data-tts-skip onClick={playing ? stop : start}>
      {playing ? <Square size={16} fill="currentColor" aria-hidden /> : <Volume2 size={20} aria-hidden />}
      {playing ? "Stop" : label}
    </button>
  );
}
