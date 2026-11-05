import { useEffect, useRef, useState } from "react";
import { TenGroups } from "../diagrams";
import { numberPadProps, useEarlyLearner } from "../../../shared/engine/audience";
import { InlineNumberPad } from "../../../shared/components/NumberPad";
import { ReadAloud } from "../../../shared/tts/ReadAloud";
import { PictureBox, QuestionHead, card, chip, type Tone } from "../../../shared/components/KCheck";

// The shared K check pieces (one question at a time, typed or picked), plus
// MK1's own ten-frame "count on" question.
export { CheckSequence, PickCheck, Reveal, TypeCheck, type CheckMode } from "../../../shared/components/KCheck";

/**
 * Count on from `start` by `by` (1 or 10), typing `count` numbers one at a
 * time. The ten-frames show where the count is now, with a "?" box (in
 * `tone`, matching the answer box) where the next number goes. Counting by
 * tens outlines the whole new ten.
 */
export function CountOnCheck({
  n,
  prompt,
  start,
  by = 1,
  count = 1,
  tone = "b",
  praise,
  onComplete,
}: {
  n: number;
  prompt: string;
  start: number;
  by?: 1 | 10;
  count?: number;
  tone?: Tone;
  /** Extra words after "Yes!", e.g. "30 starts a new ten." */
  praise?: string;
  onComplete?: () => void;
}) {
  const early = useEarlyLearner();
  const inputRef = useRef<HTMLInputElement>(null);
  const [typed, setTyped] = useState<number[]>([]);
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(0);
  const [tries, setTries] = useState(0); // re-keys the picture so it pulses on each wrong try
  const done = typed.length >= count;
  const current = start + typed.length * by;
  const next = current + by;

  useEffect(() => {
    if (done) onComplete?.();
  }, [done, onComplete]);

  const check = () => {
    if (value.trim() === "") return;
    if (Number(value) === next) {
      setTyped((t) => [...t, next]);
      setWrong(0);
    } else {
      setWrong((w) => w + 1);
      setTries((k) => k + 1);
    }
    setValue("");
  };

  // Two wrong tries: show the step happening (the count says both numbers,
  // or the new ten fills in and blinks).
  const showing = !done && wrong >= 2;
  const picture = done ? (
    <TenGroups value={current} tone="a" labels />
  ) : showing ? (
    by === 1 ? (
      <TenGroups value={next} tone="a" labels countAlong={[current, next]} targetTone={tone} />
    ) : (
      <TenGroups value={next} tone="a" labels blinkFrame={next / 10 - 1} targetTone={tone} />
    )
  ) : (
    <TenGroups value={current} tone="a" labels target={next} targetTone={tone} blinkFrame={by === 10 ? next / 10 - 1 : undefined} />
  );

  const feedback = done
    ? `Yes! ${[start, ...typed].join(", ")}.${praise ? ` ${praise}` : ""}`
    : showing
      ? `Watch and listen: ${current}, ${next}.`
      : wrong === 1
        ? by === 10
          ? "Not yet. Count one more whole ten."
          : `Not yet. Say ${current}. What comes next?`
        : null;

  return (
    <div className="align-stack-wrap" style={card}>
      <QuestionHead n={n}>{prompt}</QuestionHead>
      <PictureBox ring={wrong > 0 && !done} ringKey={tries}>
        {picture}
      </PictureBox>
      <div className="control-row" style={{ alignItems: "center", gap: 8 }}>
        {[start, ...typed].map((v, i) => (
          <span key={i} style={chip(i === typed.length && done, tone)}>
            {v}
          </span>
        ))}
        {!done && (
          <input
            ref={inputRef}
            className={`answer q${tone}`}
            inputMode="numeric"
            {...numberPadProps(early, "inline")}
            autoComplete="off"
            aria-label={`The number after ${current}`}
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
        <ReadAloud as="p" className={`feedback ${done ? "good" : showing ? "" : "bad"}`} role="alert" autoPlayKey={`${feedback}|${tries}`}>
          {feedback}
        </ReadAloud>
      )}
    </div>
  );
}

