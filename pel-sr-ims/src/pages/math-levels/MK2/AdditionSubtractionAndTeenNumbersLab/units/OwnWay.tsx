import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { numberPadProps, useEarlyLearner } from "../../../shared/engine/audience";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { judgeOwnWay, markOwnWayMissed, ownWayReply, type OwnWayHelp } from "./words";

/**
 * The hint for "write another way". Before any miss there is no new row in the
 * picture yet, so it doesn't talk about one. The engine reuses this element, so
 * it listens for the miss itself and changes even if it is already open.
 */
export function OwnWayHint({ total, help }: { total: number; help: OwnWayHelp }) {
  const subscribe = useCallback(
    (listener: () => void) => {
      help.listeners.add(listener);
      return () => {
        help.listeners.delete(listener);
      };
    },
    [help]
  );
  const missed = useSyncExternalStore(subscribe, () => help.missed);
  return <>{missed ? "Look at the new row. Count both colors." : `Find a new way to make ${total}.`}</>;
}

/**
 * The student writes their own way to break a number apart: total = ☐ + ☐.
 * Two parts with dots in each that make the total count, except a way already
 * on screen (in either order). A 0 or a repeated way gets its own line. The
 * first one in a problem is not a miss; after that each one is, so the example
 * row and Show me can open. Check waits until both boxes are filled.
 *
 * The shared engine also sets "Not a match" on a wrong try. The lab stylesheet
 * hides that line on this step (`.atn-own-way`), and this step's line comes
 * first in the step, so it is the one the voice reads.
 */
export function OwnWay({ total, used, help, onDone, onWrong }: { total: number; used: [number, number][]; help: OwnWayHelp; onDone: () => void; onWrong: () => void }) {
  const early = useEarlyLearner();
  const [x, setX] = useState("");
  const [y, setY] = useState("");
  const [note, setNote] = useState<{ text: string; good: boolean; miss: boolean; n: number } | null>(null);
  const filled = x !== "" && y !== "";
  // "Read all" reads hidden text too, so the hidden shared line leaves its list.
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    rootRef.current?.closest(".step-body")?.querySelectorAll(":scope > .feedback").forEach((el) => el.removeAttribute("data-readaloud"));
  });
  const border = note && !note.good ? { borderColor: "var(--bad)" } : undefined;

  const edit = (set: (v: string) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!/^\d{0,2}$/.test(e.target.value)) return;
    set(e.target.value);
    setNote(null);
  };
  const check = () => {
    if (!filled) return;
    const p = Number(x);
    const q = Number(y);
    const result = judgeOwnWay(total, used, p, q);
    if (result === "ok") {
      onDone();
      return;
    }
    const reply = ownWayReply(total, result, p, q, help.notCounted);
    if (result !== "wrong") help.notCounted += 1;
    setNote((old) => ({ ...reply, n: (old?.n ?? 0) + 1 }));
    if (reply.miss) {
      markOwnWayMissed(help);
      onWrong();
    }
  };

  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") check();
  };
  // Keep focus in the box on press: losing it closes the floating pad, the page
  // shifts under the finger, and the tap on Check would miss.
  const keepFocus = (e: React.SyntheticEvent) => e.preventDefault();

  return (
    <div ref={rootRef} className="atn-own-way" style={{ display: "flex", flexDirection: "column", gap: 10, alignItems: "flex-start" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 26, fontWeight: 800 }}>
        <span>{total} =</span>
        <input className="answer qa" aria-label="First part" autoComplete="off" value={x} style={{ width: 64, ...border }} {...numberPadProps(early, "enter")} onKeyDown={onEnter} onChange={edit(setX)} />
        <span>+</span>
        <input className="answer qb" aria-label="Second part" autoComplete="off" value={y} style={{ width: 64, ...border }} {...numberPadProps(early, "enter")} onKeyDown={onEnter} onChange={edit(setY)} />
      </div>
      <button type="button" className="btn primary" disabled={!filled} onPointerDown={keepFocus} onMouseDown={keepFocus} onClick={check}>
        Check
      </button>
      {note && (
        // A miss is read by the engine with the hint; a try that isn't a miss reads itself.
        <ReadAloud as="p" className={`feedback ${note.good ? "good" : "bad"}`} style={{ margin: 0 }} role="alert" autoPlay={!note.miss} autoPlayKey={note.n}>
          {note.text}
        </ReadAloud>
      )}
    </div>
  );
}
