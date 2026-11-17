import { useEffect, useId, useState } from "react";
import { ArrowUp, Eye } from "lucide-react";
import { clearLookHere, lookHere } from "../lib/lookHere";
import { sayText } from "../tts/speechEngine";
import { useTtsEnabled } from "../tts/ttsContext";

// ============================================================================
// CFU "Look here" pointers, shared by every lab's Check for Understanding
// (DropdownQuestion uses it; hand-built CFUs call it directly).
//
// Rule: each question PART counts its own wrong Checks. After the 2nd, that
// part gets a pointer to the Explore spot that teaches it (lookHereSpot id).
// "Go there" scrolls to the spot and lights it until the part is right.
// Pointers point to the teaching, never to the answer.
//
//   const ptr = useCfuPointers([{ key: "start", to: { target: "cob-start", label: "…", say: "Look here. …" } }], { done });
//   const check = () => { ptr.record((p) => (p.key === "start" ? startOk : manyOk), `${start}|${many}`); setChecked(true); };
//   …
//   <StuckBox {...ptr} early />   // early: big "Look here!" button that talks (MK, MG1–MG4)
// ============================================================================

/** Where in Explore a CFU part is taught. */
export interface ExploreTarget {
  /** The id given to lookHereSpot() on the Explore element. */
  target: string;
  /** The Explore part's name, as the student sees it ("Stuck? Look here first: {label}"). */
  label: string;
  /** Early-grade labs: what the "Look here!" button says aloud (a few words). Defaults to "Look here." */
  say?: string;
}

/** One part of a CFU question that gets its own pointer. */
export interface CfuPointerPart {
  /** Unique within the question. */
  key: string;
  to: ExploreTarget;
  /** Optional part name shown before its line ("a", "First sentence"). */
  part?: string;
}

/** Wrong Checks of a part before its pointer shows. */
export const LOOK_HERE_AFTER = 2;

export interface CfuPointers {
  /** The parts whose pointer shows now. */
  pointers: CfuPointerPart[];
  /** Scroll to and light a part's spot (keeps this question's other lit spots). */
  goThere: (p: CfuPointerPart) => void;
  /**
   * Call on each Check press with each part's verdict. Pass `answers` (the
   * boxes' values joined) to skip a repeat press with nothing changed.
   */
  record: (isRight: (p: CfuPointerPart) => boolean, answers?: string) => void;
  /** Early-grade arrow over the spot. */
  arrow: boolean;
}

/**
 * Per-part wrong-Check counts and lit Explore spots for one CFU question.
 * - `done`: the question is answered right (hides every pointer, clears its spots).
 * - `rightNow`: optional live verdict for CFUs whose boxes re-grade as they
 *   change after a Check; a part that is right now hides its pointer.
 * - `early`: lit spots also get the big bouncing arrow.
 */
export function useCfuPointers(parts: CfuPointerPart[], opts: { done: boolean; rightNow?: (p: CfuPointerPart) => boolean; early?: boolean }): CfuPointers {
  const { done, rightNow, early = false } = opts;
  const [wrongTries, setWrongTries] = useState<Record<string, number>>({});
  const [partRight, setPartRight] = useState<Record<string, boolean>>({});
  const [lit, setLit] = useState<string[]>([]);
  const [lastAnswers, setLastAnswers] = useState<string | null>(null);

  const pointers = done ? [] : parts.filter((p) => (wrongTries[p.key] ?? 0) >= LOOK_HERE_AFTER && !partRight[p.key] && !rightNow?.(p));
  const activeKey = pointers.map((p) => p.to.target).join(" ");
  // A lit spot clears once no still-wrong part of this question points to it.
  useEffect(() => {
    const active = activeKey.split(" ");
    const gone = lit.filter((t) => !active.includes(t));
    if (gone.length === 0) return;
    gone.forEach(clearLookHere);
    setLit((l) => l.filter((t) => !gone.includes(t)));
  }, [activeKey, lit]);

  const record = (isRight: (p: CfuPointerPart) => boolean, answers?: string) => {
    if (parts.length === 0) return;
    if (answers !== undefined) {
      if (answers === lastAnswers) return;
      setLastAnswers(answers);
    }
    setWrongTries((t) => Object.fromEntries(parts.map((p) => [p.key, (t[p.key] ?? 0) + (isRight(p) ? 0 : 1)])));
    setPartRight(Object.fromEntries(parts.map((p) => [p.key, isRight(p)])));
  };
  const goThere = (p: CfuPointerPart) => {
    lookHere(p.to.target, lit, { arrow: early });
    setLit((l) => (l.includes(p.to.target) ? l : [...l, p.to.target]));
  };
  return { pointers, goThere, record, arrow: early };
}

/**
 * The pointer lines. Default (reading students): "Stuck? Look here first:
 * {label}" + "Go there ↑". `early` (non-readers, MK and MG1–MG4): one big
 * "Look here!" button per spot that says its `say` line aloud, scrolls, and
 * shows the bouncing arrow.
 */
export function StuckBox({ pointers, goThere, early = false }: Pick<CfuPointers, "pointers" | "goThere"> & { early?: boolean }) {
  const tts = useTtsEnabled();
  const id = useId();
  if (pointers.length === 0) return null;

  if (early) {
    // One button per Explore spot: two parts taught in the same place share it.
    const spots = pointers.filter((p, i) => pointers.findIndex((q) => q.to.target === p.to.target) === i);
    return (
      <div className="cfu-look-here cfu-look-here-early" data-tts-skip style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
        {spots.map((p) => (
          <button
            key={p.key}
            type="button"
            className="btn primary cfu-look-here-btn"
            aria-label={`Look here: ${p.to.label}`}
            title={p.to.label}
            onClick={() => {
              if (tts) sayText(`${id}-${p.key}`, p.to.say ?? "Look here.");
              goThere(p);
            }}
            style={{ display: "inline-flex", alignItems: "center", gap: 10, minHeight: 64, padding: "10px 22px", fontSize: 24, fontWeight: 800, borderRadius: 18, background: "#f59e0b", borderColor: "#d97706", color: "#1f2937", animation: "cfuLookHerePulse 1.2s ease-in-out 3" }}
          >
            <Eye size={32} aria-hidden />
            {p.part && spots.length > 1 ? `${p.part}: ` : ""}Look here!
            <ArrowUp size={32} aria-hidden />
          </button>
        ))}
        <style>{"@keyframes cfuLookHerePulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.06); } } @media (prefers-reduced-motion: reduce) { .cfu-look-here-btn { animation: none !important; } }"}</style>
      </div>
    );
  }

  return (
    <div className="cfu-look-here" style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 6, padding: "6px 10px", borderLeft: "4px solid #f59e0b", background: "#fffbeb", borderRadius: 6 }}>
      {pointers.some((p) => p.part) && <span>Stuck?</span>}
      {pointers.map((p) => (
        <p key={p.key} className="cfu-look-here-line" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", margin: 0 }}>
          <span>
            {p.part ? (p.part.length === 1 ? `${p.part}. ` : `${p.part}: `) : "Stuck? "}Look here first: <b>{p.to.label}</b>
          </span>
          <button type="button" className="btn ghost" onClick={() => goThere(p)}>
            Go there ↑
          </button>
        </p>
      ))}
    </div>
  );
}
