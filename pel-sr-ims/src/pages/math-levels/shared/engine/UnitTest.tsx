import React, { useMemo, useState } from "react";
import type { Unit } from "../units/types";
import type { Step, TestQuestion } from "./types";
import { answerText, check, fresh, StepInput, type StepState } from "./StepProblem";

export interface UnitTestViewProps {
  /** A unit's `test` field — or any other `{questions, passScore}` config, e.g. a cross-unit module test. */
  test: NonNullable<Unit["test"]>;
  /** Called once, right after the last question is answered and graded. */
  onComplete: (score: number) => void;
}

/** Formats what the student actually typed/picked, for the results review list. */
const studentAnswerText = (step: Step, inputs: string[]): string => {
  if (!inputs[0]) return "(blank)";
  if (step.kind === "choice") return step.choices[Number(inputs[0])] ?? "(blank)";
  if (step.kind === "number") return inputs[0];
  if (step.kind === "sentence") {
    if (!inputs[1]) return "(blank)";
    const blankText = (b: (typeof step.blanks)[number], raw: string): string => (b.kind === "select" ? (b.choices[Number(raw)] ?? "?") : raw);
    return `${step.parts[0]}${blankText(step.blanks[0], inputs[0])}${step.parts[1]}${blankText(step.blanks[1], inputs[1])}${step.parts[2]}`;
  }
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

  const finished = current >= questions.length;

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
          <div className="test-score-num">
            {score}/{questions.length}
          </div>
          <div className="test-score-label">{passed ? "Passed — nice work!" : `Keep practicing — aim for ${test.passScore}/${questions.length}.`}</div>
        </div>
        <ol className="test-review">
          {questions.map((q, i) => (
            <li key={i} className={results[i].ok ? "ok" : "bad"}>
              {q.visual && <div className="test-review-visual">{q.visual}</div>}
              <div className="test-review-prompt">{q.step.prompt}</div>
              <div className="test-review-answer">
                Your answer: <b>{studentAnswerText(q.step, states[i].inputs)}</b>
              </div>
              {!results[i].ok && (
                <div className="test-review-correct">
                  Correct answer: <b>{answerText(q.step)}</b>
                </div>
              )}
              <div className="test-review-explain">{q.step.explain}</div>
            </li>
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
        {q.visual && <div className="problem-visual">{q.visual}</div>}
        <div className="test-prompt">{q.step.prompt}</div>
        <StepInput step={q.step} state={st} onChange={(inputs) => update(current, { inputs })} onSubmit={next} />
        <div className="step-tools">
          {current > 0 && (
            <button className="btn ghost" onClick={back}>
              ← Previous question
            </button>
          )}
          {q.step.kind !== "choice" && (
            <button className="btn primary" onClick={() => next(st.inputs)}>
              {current + 1 < questions.length ? "Next question" : "Finish test"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
