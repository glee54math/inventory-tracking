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
 *
 * Auto-read: once the student taps "Turn on sound" (saved per device), new
 * questions, feedback and hints read themselves. A <ReadAloud role="alert">
 * auto-reads whenever it appears or its text changes; pass autoPlay={false}
 * to opt out, or autoPlayKey to re-read when the text stays the same.
 */
import React, { useEffect, useId, useRef } from "react";
import { Square, Volume2, VolumeX } from "lucide-react";
import { getState, isTtsSupported, play, sayText, setAutoRead, setSpeed, stop, type Speed } from "./speechEngine";
import { TtsContext, useTtsEnabled, useTtsState } from "./ttsContext";
import "./tts.css";

export function TtsProvider({ children, enabled = true }: { children: React.ReactNode; enabled?: boolean }) {
  const on = enabled && isTtsSupported();
  useEffect(() => () => stop(), []);
  return (
    <TtsContext.Provider value={{ enabled: on }}>
      {children}
      {on && <TtsToolbar />}
      {on && <SoundBanner />}
    </TtsContext.Provider>
  );
}

const SPEEDS: { id: Speed; label: string }[] = [
  { id: "slow", label: "🐢 Slow" },
  { id: "normal", label: "Normal" },
  { id: "fast", label: "🐇 Fast" },
];

/** True when auto-read is on inside a read-aloud lab. */
export function useAutoReadOn(): boolean {
  const enabled = useTtsEnabled();
  const { autoRead } = useTtsState();
  return enabled && autoRead === true;
}

/** Read these elements now, but only if auto-read is on. Safe to call from effects. */
export function autoRead(id: string, els: (Element | null | undefined)[]) {
  if (!getState().autoRead) return;
  const list = els.filter((e): e is Element => !!e);
  if (list.length) play(id, list);
}

/** One-time big "turn on sound" ask. The tap also unlocks speech on iOS. */
function SoundBanner() {
  const { autoRead: choice } = useTtsState();
  const id = useId();
  if (choice !== null) return null;
  return (
    <div className="tts-sound-banner" role="dialog" aria-label="Turn on sound" data-tts-skip>
      <button
        type="button"
        className="tts-sound-on"
        onClick={() => {
          setAutoRead(true);
          sayText(id, "Sound is on. I will read to you.");
        }}
      >
        <Volume2 size={34} aria-hidden /> Turn on sound
      </button>
      <button type="button" className="tts-sound-off" onClick={() => setAutoRead(false)}>
        No thanks
      </button>
    </div>
  );
}

function TtsToolbar() {
  const { playingId, speed, autoRead: auto } = useTtsState();
  const id = useId();
  return (
    <div className="tts-toolbar" role="region" aria-label="Read aloud settings" data-tts-skip>
      <button
        type="button"
        className={`tts-auto${auto ? " on" : ""}`}
        aria-pressed={!!auto}
        onClick={() => {
          setAutoRead(!auto);
          if (!auto) sayText(id, "Sound is on.");
          else stop();
        }}
      >
        {auto ? <Volume2 size={18} aria-hidden /> : <VolumeX size={18} aria-hidden />} {auto ? "Read to me: on" : "Read to me: off"}
      </button>
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
  /** Read automatically when it appears (if auto-read is on). Defaults to true for role="alert". */
  autoPlay?: boolean;
  /** With autoPlay: re-read whenever this changes (defaults to the text, when the children are plain text). */
  autoPlayKey?: string | number;
  children?: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "children" | "className">;

export function ReadAloud({ as = "div", text, alsoRead, autoPlay, autoPlayKey, className, children, ...rest }: ReadAloudProps) {
  const enabled = useTtsEnabled();
  const ref = useRef<HTMLElement>(null);
  const autoId = useId();
  const shouldAuto = enabled && (autoPlay ?? rest.role === "alert");
  const key = autoPlayKey ?? (typeof children === "string" ? children : text ?? "");
  useEffect(() => {
    if (shouldAuto) autoRead(autoId, [ref.current, ...(alsoRead ?? []).map((r) => r.current)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldAuto, key]);
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
