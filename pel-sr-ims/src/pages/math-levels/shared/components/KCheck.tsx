import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { numberPadProps, useEarlyLearner } from "../engine/audience";
import { InlineNumberPad } from "./NumberPad";
import { ReadAloud } from "../tts/ReadAloud";

// Check-for-understanding questions built for Kindergarten (the K-1 labs): one short
// question, a picture of what's asked, a typed answer on the number pad (or
// big picture buttons), and short feedback. A wrong try points at the
// picture; a second wrong try shows it happening, then the student answers.

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
 * Pick the right answer from big buttons, under a picture. Each wrong
 * button has its own short reason. Two wrong tries swap in `showPicture`,
 * which shows the answer happening.
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
  onComplete?: () => void;
}) {
  const [picked, setPicked] = useState<string[]>([]);
  const done = picked.includes(answer);
  const wrong = picked.filter((p) => p !== answer).length;
  const last = picked[picked.length - 1];

  useEffect(() => {
    if (done) onComplete?.();
  }, [done, onComplete]);

  const showing = !done && wrong >= 2;
  const feedback = done ? praise : showing ? showText : last ? why[last] : null;

  return (
    <div className="align-stack-wrap" style={card}>
      <QuestionHead n={n}>{prompt}</QuestionHead>
      {(showing || picture) && (
        <PictureBox ring={!!last && !done} ringKey={picked.length}>
          {showing ? showPicture : picture}
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
        {options.map((o) => {
          const tried = picked.includes(o.id) && o.id !== answer;
          return (
            <button
              key={o.id}
              type="button"
              className={`choice${tried ? " tried" : ""}`}
              disabled={done || tried}
              aria-pressed={picked.includes(o.id)}
              style={
                done && o.id === answer
                  ? {
                      borderColor: "var(--good)",
                      background: "var(--good-soft)",
                    }
                  : undefined
              }
              onClick={() => setPicked((p) => [...p, o.id])}
            >
              {o.label}
            </button>
          );
        })}
      </div>
      {feedback && (
        <ReadAloud as="p" className={`feedback ${done ? "good" : showing ? "" : "bad"}`} role="alert" autoPlayKey={`${feedback}|${picked.length}`}>
          {feedback}
        </ReadAloud>
      )}
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
  onComplete?: () => void;
}) {
  const early = useEarlyLearner();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(0);
  const [last, setLast] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) onComplete?.();
  }, [done, onComplete]);

  const check = () => {
    if (value.trim() === "") return;
    const v = Number(value);
    if (v === answer) setDone(true);
    else {
      setWrong((w) => w + 1);
      setLast(v);
    }
    setValue("");
  };

  const mode: CheckMode = done ? "done" : wrong >= 2 ? "show" : wrong === 1 ? "wrong" : "ask";
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
