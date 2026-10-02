import { useEffect, useRef, useState } from "react";

const rnd = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const newFact = (): [number, number] => [rnd(3, 9), rnd(3, 9)];

export default function TimesTableDrill() {
  const [fact, setFact] = useState(newFact);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<"" | "right" | "wrong">("");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const check = () => {
    if (Number(answer) === fact[0] * fact[1] && answer !== "") {
      setResult("right");
      timer.current = setTimeout(() => {
        setFact(newFact());
        setAnswer("");
        setResult("");
      }, 900);
    } else {
      setResult("wrong");
    }
  };

  return (
    <section className="mt-4 rounded-2xl border-2 border-dashed border-slate-300 bg-white px-5 py-4 dark:border-slate-600 dark:bg-slate-800">
      <p className="mb-1.5 font-bold italic">Have you memorized your times tables?</p>
      <div className="flex flex-wrap items-center gap-2 text-xl">
        <span>
          What is {fact[0]} × {fact[1]} =
        </span>
        <input
          inputMode="numeric"
          aria-label="times table answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value.replace(/[^\d]/g, ""))}
          onKeyDown={(e) => e.key === "Enter" && check()}
          className="w-[4.2em] border-0 border-b-[3px] border-slate-300 bg-transparent px-1.5 py-1.5 text-center font-medium focus:border-blue-600 focus:outline-none dark:border-slate-600"
        />
        <button
          type="button"
          onClick={check}
          className="rounded-lg border-2 border-slate-800 px-4 py-2 text-base font-medium text-slate-800 dark:border-slate-200 dark:text-slate-100"
        >
          Check
        </button>
        <span
          aria-live="polite"
          className={
            result === "right"
              ? "text-base font-medium text-green-700 dark:text-green-400"
              : "text-base text-orange-600 dark:text-orange-400"
          }
        >
          {result === "right" ? "Correct!" : result === "wrong" ? "Try again." : ""}
        </span>
      </div>
    </section>
  );
}
