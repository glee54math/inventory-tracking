import { useEffect, useRef, useState, type ReactNode } from 'react';
import { canon, pick } from './MG11_PowersOfTen_numberModel';
import { TOPICS, createQuestionBank, type Question, type TopicChoice } from './MG11_PowersOfTen_questions';
import { tw } from './MG11_PowersOfTen_styles';

const fbBase = 'mt-3 rounded-xl px-3.5 py-3';
const fbTry = 'border-[1.5px] border-[#C9D5EA] bg-[#F4F7FC] dark:border-[#34405E] dark:bg-[#222C45]';
const fbGood = 'border-[1.5px] border-[#0B7F74] bg-[#E1F4F1] dark:border-[#45C9B6] dark:bg-[#123330]';
const fbBad = 'border-[1.5px] border-[#C93B33] bg-[#FCE7E5] dark:border-[#FF8078] dark:bg-[#3A1C1C]';
const fbHead = 'mb-0.5 text-[21px] font-semibold [font-family:Fredoka,Nunito,system-ui,sans-serif]';

const choiceBase =
  'min-h-[54px] rounded-xl border-2 px-2 py-3 text-xl font-extrabold cursor-pointer disabled:cursor-default ' +
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#2F5BD3] dark:focus-visible:outline-[#7C9BFF]';
const choiceIdle = 'border-[#C9D5EA] bg-white text-[#1B2440] dark:border-[#34405E] dark:bg-[#1B2338] dark:text-[#E8EDF8]';
const choiceRight = 'border-[#0B7F74] bg-[#E1F4F1] text-[#1B2440] dark:border-[#45C9B6] dark:bg-[#123330] dark:text-[#E8EDF8]';
const choiceWrong =
  'border-[#C93B33] bg-[#FCE7E5] text-[#1B2440] line-through dark:border-[#FF8078] dark:bg-[#3A1C1C] dark:text-[#E8EDF8]';

type Feedback =
  | { kind: 'none' }
  | { kind: 'notice'; text: string }
  | { kind: 'retry' }
  | { kind: 'correct'; cheer: string }
  | { kind: 'revealed' };

const CHEERS = ['Correct!', 'Nice work!', 'You got it!', 'Exactly right!'];

export default function PracticeCard() {
  const bank = useRef(createQuestionBank()).current;
  const [topic, setTopic] = useState<TopicChoice>('mix');
  const [q, setQ] = useState<Question>(() => bank.next('mix'));
  const [qKey, setQKey] = useState(0);
  const [tries, setTries] = useState(0);
  const [done, setDone] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>({ kind: 'none' });
  const [answer, setAnswer] = useState('');
  const [wrongChoices, setWrongChoices] = useState<Set<number>>(new Set());
  const [score, setScore] = useState({ right: 0, total: 0, streak: 0 });

  const inputRef = useRef<HTMLInputElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (done) nextRef.current?.focus({ preventScroll: true });
  }, [done]);

  const newQuestion = (t: TopicChoice = topic) => {
    setQ(bank.next(t));
    setQKey((k) => k + 1);
    setTries(0);
    setDone(false);
    setShowHint(false);
    setFeedback({ kind: 'none' });
    setAnswer('');
    setWrongChoices(new Set());
  };

  const chooseTopic = (t: TopicChoice) => {
    setTopic(t);
    newQuestion(t);
  };

  const finish = (ok: boolean) => {
    setDone(true);
    setScore((s) => ({
      right: s.right + (ok ? 1 : 0),
      total: s.total + 1,
      streak: ok && tries === 0 ? s.streak + 1 : 0,
    }));
    setFeedback(ok ? { kind: 'correct', cheer: pick(CHEERS) } : { kind: 'revealed' });
  };

  const check = (choiceIdx?: number) => {
    if (done) return;
    let ok: boolean;
    if (q.type === 'input') {
      const v = answer.trim();
      if (!v) return setFeedback({ kind: 'notice', text: 'Type an answer first.' });
      const c = canon(v);
      if (c === null) return setFeedback({ kind: 'notice', text: 'Use only digits, commas, and a decimal point, like 34.52.' });
      ok = c === canon(q.answer);
    } else {
      ok = choiceIdx === q.correct;
    }
    if (ok) return finish(true);

    if (q.type === 'choice' && choiceIdx !== undefined) {
      setWrongChoices((prev) => new Set(prev).add(choiceIdx));
    }
    if (tries === 0) {
      setTries(1);
      setShowHint(false);
      setFeedback({ kind: 'retry' });
      if (q.type === 'input') inputRef.current?.select();
    } else {
      setTries(2);
      finish(false);
    }
  };

  const skipOrNext = () => {
    if (!done) setScore((s) => ({ ...s, streak: 0 }));
    newQuestion();
  };

  const answerText = q.type === 'input' ? `${q.answer}${q.unit ? ` ${q.unit}` : ''}` : null;

  let feedbackBox: ReactNode = null;
  switch (feedback.kind) {
    case 'notice':
      feedbackBox = <div className={`${fbBase} ${fbTry}`}>{feedback.text}</div>;
      break;
    case 'retry':
      feedbackBox = (
        <div className={`${fbBase} ${fbTry}`}>
          <div className={fbHead}>Not quite. Try again!</div>
          Here's a clue: {q.hint}
        </div>
      );
      break;
    case 'correct':
      feedbackBox = (
        <div className={`${fbBase} ${fbGood}`}>
          <div className={fbHead}>{feedback.cheer}</div>
          {q.explain}
        </div>
      );
      break;
    case 'revealed':
      feedbackBox = (
        <div className={`${fbBase} ${fbBad}`}>
          <div className={fbHead}>
            The answer is {q.type === 'input' ? answerText : q.choices[q.correct].label}
          </div>
          {q.explain}
          <p className="mt-2">Try the next one. You'll get it!</p>
        </div>
      );
      break;
  }

  return (
    <section className="mt-[34px]" aria-labelledby="p10-pr-title">
      <h2 id="p10-pr-title" className={tw.h2}>Practice</h2>
      <p className={tw.muted}>
        Pick a kind of problem, or mix them all. Every problem is new, so you can keep going as long as you like.
      </p>

      <div
        className="-mx-0.5 mt-2 flex gap-1.5 overflow-x-auto px-0.5 pb-2 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        role="group"
        aria-label="Problem type"
      >
        {TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`${tw.chip} flex-none whitespace-nowrap ${topic === t.id ? tw.chipOn : tw.chipOff}`}
            aria-pressed={topic === t.id}
            onClick={() => chooseTopic(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div className={tw.panel}>
        <div className={`flex justify-between gap-2.5 text-sm font-bold ${tw.muted}`}>
          <span>{q.topic}</span>
          <span>
            {score.right} of {score.total} right{' '}
            {score.streak >= 2 && <span className="text-[#0B7F74] dark:text-[#45C9B6]">🔥 {score.streak} in a row</span>}
          </span>
        </div>

        <div className="mb-2.5 mt-3.5 text-[19px] font-semibold">{q.prompt}</div>

        {q.type === 'input' ? (
          <div className="flex items-center gap-2.5">
            <input
              key={qKey}
              ref={inputRef}
              className={`${tw.input} max-w-[260px] flex-1`}
              inputMode="decimal"
              autoComplete="off"
              aria-label="Your answer"
              placeholder="Answer"
              value={answer}
              readOnly={done}
              onChange={(e) => setAnswer(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { if (done) newQuestion(); else check(); }
              }}
            />
            {q.unit && <span className="text-lg font-extrabold">{q.unit}</span>}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {q.choices.map((c, i) => {
              const isWrong = wrongChoices.has(i);
              const isRight = done && i === q.correct;
              return (
                <button
                  key={`${qKey}-${c.key}`}
                  type="button"
                  className={`${choiceBase} ${isWrong ? choiceWrong : isRight ? choiceRight : choiceIdle}`}
                  disabled={done || isWrong}
                  onClick={() => check(i)}
                >
                  {c.label}
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-3.5 flex flex-wrap gap-2">
          {q.type === 'input' && !done && (
            <button type="button" className={`${tw.btn} ${tw.btnPrimary}`} onClick={() => check()}>Check</button>
          )}
          {!done && tries === 0 && !showHint && (
            <button type="button" className={`${tw.btn} ${tw.btnQuiet}`} onClick={() => setShowHint(true)}>Hint</button>
          )}
          <button ref={nextRef} type="button" className={`${tw.btn} ${tw.btnQuiet}`} onClick={skipOrNext}>
            {done ? 'Next problem' : 'Skip'}
          </button>
        </div>

        {showHint && tries === 0 && !done && (
          <div className={`mt-3 rounded-xl border-[1.5px] border-dashed border-[#C9D5EA] px-3.5 py-2.5 dark:border-[#34405E] ${tw.soft}`}><b>Hint:</b> {q.hint}</div>
        )}
        <div aria-live="polite">{feedbackBox}</div>
      </div>
    </section>
  );
}
