import type { Ref } from "react";
import { nextOp } from "./MG6_BarModel_problemLogic";
import type { Field, PartValues } from "./MG6_BarModel_types";

interface Props {
  values: PartValues;
  onChange: (values: PartValues) => void;
  wrong: Field[];
  unit: string;
  sentencePrefix: string;
  sentenceSuffix: string;
  showOpHint?: boolean;
  disabled?: boolean;
  onEnter: () => void;
  firstInputRef?: Ref<HTMLInputElement>;
}

// Full literal class strings so Tailwind's content scan never purges them.
const INPUT_OK =
  "w-[4.2em] border-0 border-b-[3px] border-slate-300 bg-transparent px-1.5 py-1.5 text-center font-medium text-slate-800 focus:border-blue-600 focus:outline-none dark:border-slate-600 dark:text-slate-100 dark:focus:border-blue-400";
const INPUT_WRONG =
  "w-[4.2em] border-0 border-b-[3px] border-orange-600 bg-transparent px-1.5 py-1.5 text-center font-medium text-slate-800 focus:border-orange-600 focus:outline-none dark:border-orange-400 dark:text-slate-100";

// Non-breaking space (via escape, not a literal character) — keeps the empty operator
// circle from collapsing in height before a problem is chosen.
const NBSP = " ";

export default function EquationRow({
  values,
  onChange,
  wrong,
  unit,
  sentencePrefix,
  sentenceSuffix,
  showOpHint = false,
  disabled = false,
  onEnter,
  firstInputRef,
}: Props) {
  const set = (field: Field, value: string) =>
    onChange({ ...values, [field]: value.replace(/[^\d]/g, "") });

  const input = (field: Field, label: string, ref?: Ref<HTMLInputElement>) => (
    <input
      ref={ref}
      inputMode="numeric"
      aria-label={label}
      value={values[field]}
      disabled={disabled}
      onChange={(e) => set(field, e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && onEnter()}
      className={wrong.includes(field) ? INPUT_WRONG : INPUT_OK}
    />
  );

  return (
    <>
      <div className="my-2.5 flex flex-wrap items-center gap-2 text-xl">
        {input("x", "first number", firstInputRef)}
        <button
          type="button"
          aria-label={`operation: ${values.op || "none chosen"}`}
          disabled={disabled}
          onClick={() => onChange({ ...values, op: nextOp(values.op) })}
          className="flex h-[46px] w-[46px] items-center justify-center rounded-full border-[3px] border-slate-800 bg-white text-2xl font-bold leading-none text-slate-800 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-slate-200 dark:bg-slate-800 dark:text-slate-100"
        >
          {values.op || NBSP}
        </button>
        {input("y", "second number")}
        <span>=</span>
        {input("r", "answer")}
        <span>{unit}.</span>
        {showOpHint && (
          <span className="w-full text-xs text-slate-500 dark:text-slate-400">
            Tap the circle to choose + or −
          </span>
        )}
      </div>
      <div className="my-2.5 flex flex-wrap items-center gap-2 text-xl">
        <span>{sentencePrefix}</span>
        {input("s", "sentence answer")}
        <span>{sentenceSuffix}</span>
      </div>
    </>
  );
}
