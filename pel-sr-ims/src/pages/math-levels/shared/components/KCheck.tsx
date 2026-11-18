import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { numberPadProps, useEarlyLearner } from "../engine/audience";
import { InlineNumberPad } from "./NumberPad";
import { ReadAloud } from "../tts/ReadAloud";
import { StuckBox, useCfuPointers, type ExploreTarget } from "./CfuPointers";

// Check-for-understanding questions built for Kindergarten (the K-1 labs): one short
// question, a picture of what's asked, a typed answer on the number pad (or
// big picture buttons), and short feedback. A wrong try points at the
// picture; a second wrong try shows it happening, then the student answers.
//
// Optional `look` (MG1 and other labs with CFU "Look here" pointers): the
// question also gets the early "Look here!" button after its 2nd wrong try
// (shared useCfuPointers + StuckBox; the Explore spot stays lit until the
// answer is right), and "show it" moves to the 3rd wrong try. Without `look`
// a question behaves exactly as before (MK1-MK4).

/** Wrong tries before "show it" (the worked picture): 2, or 3 when the question has a "Look here" pointer. */
const showAfter = (look?: ExploreTarget) => (look ? 3 : 2);

export type Tone = "a" | "b" | "c";

export const card: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 10,
  alignItems: "flex-start",
};
export const chip = (on: boolean, tone?: Tone): React.CSSProperties => ({
  fontWeight: 800,
  fontSize: 24,
  padding: "4px 14px",
  borderRadius: 999,
  background: on ? `var(--q${tone}-soft)` : "var(--grid)",
  color: on ? `var(--q${tone})` : "var(--ink)",
});

export function QuestionHead({ n, children }: { n: number; children: ReactNode }) {
  return (
    <ReadAloud as="p" style={{ fontSize: 22, fontWeight: 700, margin: 0 }}>
      <b>{n}.</b> {children}
    </ReadAloud>
  );
}

/** A question that appears after the one before it is answered, scrolled into view. */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, []);
  return (
    <div ref={ref} className="diagram-reveal" style={{ scrollMarginTop: 120 }}>
      {children}
    </div>
  );
}

/** The picture, with practice's "look here" ring after a wrong try. */
export function PictureBox({ ring, ringKey, children }: { ring: boolean; ringKey: number; children: ReactNode }) {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 520,
        padding: 10,
        borderRadius: "var(--radius-lg)",
      }}
    >
      {ring && <span key={ringKey} className="look-here-ring" aria-hidden />}
      {children}
    </div>
  );
}

/**
 * A same-idea question with new numbers that replaces a two-button pick
 * after its first wrong tap (PickCheck `twin`). Same fields as the pick.
 */
export interface PickTwin {
  prompt: ReactNode;
  picture?: ReactNode;
  showPicture: ReactNode;
  options: { id: string; label: ReactNode }[];
  answer: string;
  why: Record<string, string>;
  showText: string;
  praise: string;
}

/**
 * Pick the right answer from big buttons, under a picture. Each wrong
 * button has its own short reason. Two wrong tries swap in `showPicture`,
 * which shows the answer happening.
 *
 * Optional `twin` (only with `look`; MG1 round 2): with two buttons, one
 * wrong tap would leave only the answer. Instead the first wrong tap swaps
 * in the twin question (new numbers, both buttons live). A wrong tap on the
 * twin is the 2nd miss ("Look here!"); a wrong tap after that is the 3rd
 * ("show it"). Without `twin` nothing changes (MK1-MK4).
 *
 * With `look` (twin or not), tried buttons stay tappable until "show it",
 * so a 3-button pick still has real choices at the 2nd-miss pointer.
 */
export function PickCheck({
  n,
  prompt,
  picture,
  showPicture,
  options,
  answer,
  why,
  showText,
  praise,
  look,
  twin,
  onComplete,
}: {
  n: number;
  prompt: ReactNode;
  /** Optional: a question about numerals alone can leave it out until "show". */
  picture?: ReactNode;
  showPicture: ReactNode;
  options: { id: string; label: ReactNode }[];
  answer: string;
  /** Short reason for each wrong choice, by id. */
  why: Record<string, string>;
  /** What the student hears with `showPicture`, e.g. "Watch and listen: 49, 50." */
  showText: string;
  praise: string;
  /** Optional: the Explore spot that teaches this question ("Look here" after the 2nd wrong pick). */
  look?: ExploreTarget;
  /** Optional (needs `look`): the question that replaces this one after its first wrong pick. */
  twin?: PickTwin;
  onComplete?: () => void;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  // Twin mode: the first question's wrong pick (then the twin is on screen).
  const [firstWrong, setFirstWrong] = useState<string | null>(null);
  // Twin only: the twin's prompt, read after the swap without the question number "2." (MG1 review E3-54).
  const headRef = useRef<HTMLSpanElement>(null);
  const twinOn = !!(twin && look);
  const onTwin = twinOn && firstWrong !== null;
  const q = onTwin && twin ? twin : { prompt, picture, showPicture, options, answer, why, showText, praise };
  const done = picked.includes(q.answer);
  const wrong = (firstWrong !== null ? 1 : 0) + picked.filter((p) => p !== q.answer).length;
  const last = picked[picked.length - 1];
  const ptr = useCfuPointers(look ? [{ key: "q", to: look }] : [], { done, early: true });

  useEffect(() => {
    if (done) onComplete?.();
  }, [done, onComplete]);

  const showing = !done && wrong >= showAfter(look);
  // Right after the swap, the first question's reason is said, then the twin question.
  const feedback = done ? q.praise : showing ? q.showText : last ? q.why[last] : onTwin && firstWrong ? why[firstWrong] : null;
  // With a "Look here" pointer (and so on the twin), a tried button stays live and
  // undimmed until "show it": the 2nd-miss pointer comes while real choices are
  // left, and the 3rd miss can reach the worked picture (MG1 review C3-01, user
  // decision). Without `look` a tried button locks at once, as before (MK1-MK4).
  const lockTried = !look || showing;

  const head = <QuestionHead n={n}>{twinOn ? <span ref={headRef}>{q.prompt}</span> : q.prompt}</QuestionHead>;
  return (
    <div className="align-stack-wrap" style={card}>
      {head}
      {(showing || q.picture) && (
        <PictureBox ring={(!!last || onTwin) && !done} ringKey={picked.length + (firstWrong !== null ? 1 : 0)}>
          {showing ? q.showPicture : q.picture}
        </PictureBox>
      )}
      <div
        className="choices"
        role="group"
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        {q.options.map((o) => {
          const tried = lockTried && picked.includes(o.id) && o.id !== q.answer;
          return (
            <button
              key={onTwin ? `twin-${o.id}` : o.id}
              type="button"
              className={`choice${tried ? " tried" : ""}`}
              disabled={done || tried}
              aria-pressed={picked.includes(o.id)}
              style={
                done && o.id === q.answer
                  ? {
                      borderColor: "var(--good)",
                      background: "var(--good-soft)",
                    }
                  : undefined
              }
              onClick={() => {
                ptr.record(() => o.id === q.answer);
                if (twinOn && !onTwin && o.id !== q.answer) {
                  // First wrong tap: the twin question takes this one's place.
                  setFirstWrong(o.id);
                  setPicked([]);
                  return;
                }
                setPicked((p) => [...p, o.id]);
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {feedback && (
        <ReadAloud
          as="p"
          className={`feedback ${done ? "good" : showing ? "" : "bad"}`}
          role="alert"
          autoPlayKey={`${feedback}|${picked.length + (firstWrong !== null ? 1 : 0)}`}
          alsoRead={onTwin && picked.length === 0 ? [headRef] : undefined}
        >
          {feedback}
        </ReadAloud>
      )}
      <StuckBox {...ptr} early />
    </div>
  );
}

/** What a TypeCheck / PickCheck picture should show right now. */
export type CheckMode = "ask" | "wrong" | "show" | "done";

/**
 * Type one number (on the number pad) about a picture. `picture` is drawn
 * for the current mode: "ask" at first, "wrong" after one wrong try (point
 * at what to look at), "show" after two (show it happening), "done" once
 * answered. `why` gives a short reason for a specific wrong number.
 */
export function TypeCheck({
  n,
  prompt,
  answer,
  picture,
  tone = "b",
  nudge,
  why = {},
  showText,
  praise,
  look,
  onComplete,
}: {
  n: number;
  prompt: ReactNode;
  answer: number;
  picture: (mode: CheckMode) => ReactNode;
  tone?: Tone;
  /** Said after the first wrong try, e.g. "Not yet. Tap each one as you count." */
  nudge: string;
  why?: Record<number, string>;
  /** Said with the "show" picture, e.g. "Watch and listen: 1, 2, 3, 4, 5." */
  showText: string;
  praise: string;
  /** Optional: the Explore spot that teaches this question ("Look here" after the 2nd wrong try; "show" moves to the 3rd). */
  look?: ExploreTarget;
  onComplete?: () => void;
}) {
  const early = useEarlyLearner();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(0);
  const [last, setLast] = useState<number | null>(null);
  const [done, setDone] = useState(false);
  const ptr = useCfuPointers(look ? [{ key: "q", to: look }] : [], { done, early: true });

  useEffect(() => {
    if (done) onComplete?.();
  }, [done, onComplete]);

  const check = () => {
    if (value.trim() === "") return;
    const v = Number(value);
    ptr.record(() => v === answer);
    if (v === answer) setDone(true);
    else {
      setWrong((w) => w + 1);
      setLast(v);
    }
    setValue("");
  };

  const mode: CheckMode = done ? "done" : wrong >= showAfter(look) ? "show" : wrong >= 1 ? "wrong" : "ask";
  const feedback = done ? praise : mode === "show" ? showText : mode === "wrong" ? (last !== null && why[last]) || nudge : null;

  return (
    <div className="align-stack-wrap" style={card}>
      <QuestionHead n={n}>{prompt}</QuestionHead>
      <PictureBox ring={wrong > 0 && !done} ringKey={wrong}>
        {picture(mode)}
      </PictureBox>
      <div className="control-row" style={{ alignItems: "center", gap: 8 }}>
        {done ? (
          <span style={chip(true, tone)}>{answer}</span>
        ) : (
          <input
            ref={inputRef}
            className={`answer q${tone}`}
            inputMode="numeric"
            {...numberPadProps(early, "inline")}
            autoComplete="off"
            aria-label="Your answer"
            value={value}
            maxLength={3}
            onChange={(e) => /^\d{0,3}$/.test(e.target.value) && setValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
          />
        )}
      </div>
      {!done && early && <InlineNumberPad inputRef={inputRef} />}
      {!done && !early && (
        <button className="btn primary" type="button" disabled={value === ""} onClick={check}>
          Check
        </button>
      )}
      {feedback && (
        <ReadAloud as="p" className={`feedback ${done ? "good" : mode === "show" ? "" : "bad"}`} role="alert" autoPlayKey={`${feedback}|${wrong}`}>
          {feedback}
        </ReadAloud>
      )}
      <StuckBox {...ptr} early />
    </div>
  );
}

/**
 * A whole Check for Understanding: a short title, then the questions one at
 * a time. Each item gets the callback to call when it's answered; the next
 * one then slides in. `onComplete` fires once when all are answered.
 */
export function CheckSequence({ items, onComplete }: { items: Array<(onDone: () => void) => ReactNode>; onComplete?: () => void }) {
  const [answered, setAnswered] = useState(0);
  const count = items.length;
  const dones = useMemo(() => Array.from({ length: count }, (_, i) => () => setAnswered((k) => Math.max(k, i + 1))), [count]);
  const allDone = answered >= count;
  useEffect(() => {
    if (allDone) onComplete?.();
  }, [allDone, onComplete]);

  return (
    <div className="align-drill">
      <ReadAloud as="p" className="intro-gate-title">
        Show what you know!
      </ReadAloud>
      {items.map((render, i) => {
        if (i > answered) return null;
        const node = render(dones[i]);
        return i === 0 ? <div key={i}>{node}</div> : <Reveal key={i}>{node}</Reveal>;
      })}
    </div>
  );
}
