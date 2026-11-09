import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { autoRead, ReadAloud } from "../tts/ReadAloud";
import { stopIfPlaying } from "../tts/speechEngine";
import type { Unit } from "../units/types";
import { tappedList, type Step, type TestQuestion } from "./types";
import { answerText, check, fresh, StepInput, type StepState } from "./StepProblem";
import { MathText, useStackedFractions } from "../components/MathText";
import { formBoxes, formName, isAnswerForm } from "../components/answerKinds";

export interface UnitTestViewProps {
  /** A unit's `test` field — or any other `{questions, passScore}` config, e.g. a cross-unit module test. */
  test: NonNullable<Unit["test"]>;
  /** Called once, right after the last question is answered and graded. */
  onComplete: (score: number) => void;
}

/** Formats what the student actually typed/picked, for the results review list. */
const studentAnswerText = (step: Step, inputs: string[]): string => {
  if (step.kind === "fraction" && step.mixed && step.den === undefined && isAnswerForm(inputs[3])) {
    // Labs with <AnswerFormPick>: only the boxes the picked kind shows, then the kind.
    const show = formBoxes(inputs[3]);
    const w = show[0] ? (inputs[0] ?? "").trim() : "";
    const n = show[1] ? (inputs[1] ?? "").trim() : "";
    const d = show[2] ? (inputs[2] ?? "").trim() : "";
    const frac = n || d ? `${n || "?"}/${d || "?"}` : "";
    const text = [w, frac].filter(Boolean).join(" ");
    return `${text || "(blank)"} (${formName(inputs[3])})`;
  }
  if (step.kind === "fraction") {
    const w = step.mixed ? (inputs[0] ?? "").trim() : "";
    const n = (inputs[1] ?? "").trim();
    const d = step.den !== undefined ? String(step.den) : (inputs[2] ?? "").trim();
    const frac = n || d ? `${n || "?"}/${d || "?"}` : "";
    const text = [w, frac].filter(Boolean).join(" ");
    return text || "(blank)";
  }
  if (!inputs[0]) return "(blank)";
  if (step.kind === "choice") return step.choices[Number(inputs[0])] ?? "(blank)";
  if (step.kind === "tapCount") {
    const n = tappedList(inputs[0]).length;
    return `${n} counter${n === 1 ? "" : "s"}`;
  }
  // NumberStep.overDen: the typed box is the top of a fraction over a printed denominator.
  if (step.kind === "number" && step.overDen !== undefined) return `${inputs[0]}/${step.overDen}`;
  if (step.kind === "number" || step.kind === "coordinate") return inputs[0];
  if (step.kind === "sentence") {
    if (!inputs[1]) return "(blank)";
    const blankText = (b: (typeof step.blanks)[number], raw: string): string => (b.kind === "select" ? (b.choices[Number(raw)] ?? "?") : raw);
    if (step.stacked) return `${step.parts[0]}${blankText(step.blanks[0], inputs[0])}/${blankText(step.blanks[1], inputs[1])}${step.parts[2]}`;
    const over = (i: 0 | 1) => (step.overDen?.[i] !== undefined ? `/${step.overDen[i]}` : "");
    // SentenceStep.more (MG10): blanks 3+ follow parts[2].
    const more = (step.more ?? []).map((m, k) => `${inputs[k + 2] ? blankText(m.blank, inputs[k + 2]) : "(blank)"}${m.after}`).join("");
    return `${step.parts[0]}${blankText(step.blanks[0], inputs[0])}${over(0)}${step.parts[1]}${blankText(step.blanks[1], inputs[1])}${over(1)}${step.parts[2]}${more}`;
  }
  // RatioStep.stacked: the two boxes are one fraction's top and bottom.
  if (step.kind === "ratio" && step.stacked) return inputs[1] ? `${step.frame?.[0] ?? ""}${inputs[0]}/${inputs[1]}${step.frame?.[2] ?? ""}` : "(blank)";
  return inputs[1] ? inputs.join(" : ") : "(blank)";
};

const makeQuestions = (test: NonNullable<Unit["test"]>): TestQuestion[] => test.questions.flatMap((make) => make());

/**
 * A fixed-length test (10 questions for a unit, or however many a module test
 * defines), one question at a time, with no hints, no reveal, and no feedback
 * until every question is answered — unlike practice mode's StepProblem, which
 * scaffolds the student toward the right answer. Reuses StepInput/check/
 * answerText from StepProblem.tsx so a test question is graded and displayed
 * exactly like the same step would be in practice.
 */
export function UnitTestView({ test, onComplete }: UnitTestViewProps) {
  const [attempt, setAttempt] = useState(0);
  const questions = useMemo(
    () => makeQuestions(test),
    // attempt forces a fresh set of questions on retake
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [test, attempt]
  );
  const [current, setCurrent] = useState(0);
  const [states, setStates] = useState<StepState[]>(() => questions.map(fresh));
  const [results, setResults] = useState<{ ok: boolean }[] | null>(null);
  // Read-aloud: the question's icon also reads its answer choices and buttons.
  const inputRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const promptRef = useRef<HTMLDivElement>(null);
  const readerId = useId();
  // Labs with <StackedFractions> (MG10) show a score as "8 out of 10", so the
  // only slash-numbers a student sees are fractions (and those are stacked).
  const stacked = useStackedFractions();
  const outOf = (a: number, b: number) => (stacked ? `${a} out of ${b}` : `${a}/${b}`);

  const finished = current >= questions.length;

  // A new question replaces the text on screen: stop the old reading, and
  // read the new question (plus its choices) if the student turned sound on.
  useEffect(() => {
    stopIfPlaying();
    if (current < questions.length) {
      const choices = questions[current].step.kind === "choice" ? inputRef.current : null;
      autoRead(readerId, [promptRef.current, choices]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, questions]);

  const update = (i: number, patch: Partial<StepState>) => setStates((all) => all.map((s, k) => (k === i ? { ...s, ...patch } : s)));

  const next = (inputs: string[]) => {
    update(current, { inputs });
    if (current + 1 < questions.length) {
      setCurrent((c) => c + 1);
    } else {
      const graded = questions.map((q, i) => ({ ok: check(q.step, i === current ? inputs : states[i].inputs).ok }));
      setResults(graded);
      onComplete(graded.filter((r) => r.ok).length);
      setCurrent(questions.length);
    }
  };

  const back = () => {
    if (current > 0) setCurrent((c) => c - 1);
  };

  const retake = () => {
    setAttempt((a) => a + 1);
    setCurrent(0);
    setResults(null);
    setStates(questions.map(fresh));
  };

  if (finished && results) {
    const score = results.filter((r) => r.ok).length;
    const passed = score >= test.passScore;
    return (
      <div className="unit-test results">
        <div className={`test-score ${passed ? "pass" : "fail"}`}>
          <div className="test-score-num">{outOf(score, questions.length)}</div>
          <ReadAloud className="test-score-label" autoPlay text={passed ? `${score} out of ${questions.length}. Passed, nice work!` : `${score} out of ${questions.length}. Keep practicing. Aim for ${test.passScore} out of ${questions.length}.`}>
            {passed ? "Passed — nice work!" : `Keep practicing — aim for ${outOf(test.passScore, questions.length)}.`}
          </ReadAloud>
        </div>
        <ol className="test-review">
          {questions.map((q, i) => (
            <ReadAloud as="li" key={i} className={results[i].ok ? "ok" : "bad"}>
              {q.visual && <div className="test-review-visual"><MathText>{q.visual}</MathText></div>}
              <div className="test-review-prompt">
                <MathText>{q.step.prompt}</MathText>
              </div>
              <div className="test-review-answer">
                Your answer:{" "}
                <b>
                  <MathText>{studentAnswerText(q.step, states[i].inputs)}</MathText>
                </b>
              </div>
              {!results[i].ok && (
                <div className="test-review-correct">
                  Correct answer:{" "}
                  <b>
                    <MathText>{answerText(q.step)}</MathText>
                  </b>
                </div>
              )}
              <div className="test-review-explain">
                <MathText>{q.step.explain}</MathText>
              </div>
            </ReadAloud>
          ))}
        </ol>
        <button className="btn primary" onClick={retake}>
          Retake test
        </button>
      </div>
    );
  }

  const q = questions[current];
  const st = states[current];

  return (
    <div className="unit-test">
      <div className="test-meter" aria-label={`Question ${current + 1} of ${questions.length}`}>
        {questions.map((_, i) => (
          <span key={i} className={i < current ? "on" : i === current ? "now" : ""} />
        ))}
      </div>
      <div className="test-question">
        {q.visual && <div className="problem-visual"><MathText>{q.visual}</MathText></div>}
        <div ref={promptRef}>
          <ReadAloud className="test-prompt" alsoRead={[inputRef, toolsRef]}>
            <MathText>{q.step.prompt}</MathText>
          </ReadAloud>
        </div>
        <div ref={inputRef} data-readaloud-part>
          <StepInput step={q.step} state={st} onChange={(inputs) => update(current, { inputs })} onSubmit={next} />
        </div>
        <div className="step-tools" ref={toolsRef} data-readaloud-part>
          {current > 0 && (
            <button className="btn ghost" onClick={back}>
              ← Previous question
            </button>
          )}
          {/* Excludes "custom" the same way StepProblem.tsx's own Check button
              does — check() always grades a custom step as correct once its
              own onDone fires (see its comment above), so a generic advance
              button here would let a student skip the widget entirely
              (type nothing, click this) and still pass the question. The
              widget supplies its own way to advance once genuinely correct. */}
          {q.step.kind !== "choice" && q.step.kind !== "custom" && (
            <button className="btn primary" onClick={() => next(st.inputs)}>
              {current + 1 < questions.length ? "Next question" : "Finish test"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
