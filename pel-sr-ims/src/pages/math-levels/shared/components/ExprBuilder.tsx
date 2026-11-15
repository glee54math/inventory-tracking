import type { KeyboardEvent } from "react";
import { TapSelect } from "./TapSelect";
import { BUILD_SIGNS, builtParts } from "../lib/buildExpr";

/**
 * The input behind the shared "buildExpr" Step kind (5.OA.2, "write simple
 * expressions"): tap where the parentheses go, type the three numbers, tap
 * the two signs. `inputs` = [group, a, sign 1, b, sign 2, c]. Graded in
 * shared/lib/buildExpr.ts. Added for MG10_NumericalExpressionsAndPatternsLab.
 */
export function ExprBuilder({
  inputs,
  onChange,
  onEnter,
  signs = BUILD_SIGNS,
}: {
  inputs: readonly string[];
  onChange: (next: string[]) => void;
  onEnter?: () => void;
  signs?: string[];
}) {
  const parts = builtParts(inputs);
  const [group] = parts;
  const set = (i: number, v: string) => onChange(parts.map((p, k) => (k === i ? v : p)));
  const key = (e: KeyboardEvent) => {
    if (e.key === "Enter") onEnter?.();
  };
  const box = (i: number, name: string) => (
    <input
      className="answer expr-build-num"
      inputMode="numeric"
      autoComplete="off"
      aria-label={name}
      value={parts[i]}
      onChange={(e) => set(i, e.target.value.replace(/[^0-9]/g, ""))}
      onKeyDown={key}
    />
  );
  const sign = (i: number, name: string) => (
    <TapSelect aria-label={name} value={parts[i]} onChange={(e) => set(i, e.target.value)}>
      {signs.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </TapSelect>
  );
  const paren = (ch: string) => (
    <span className="expr-build-paren" aria-hidden>
      {ch}
    </span>
  );
  // A tiny picture of each place: [ ] ○ [ ] ○ [ ] with the parentheses drawn in.
  const shape = (g: "left" | "right") => (
    <span className="expr-build-shape" aria-hidden>
      {g === "left" && "("}
      <span className="expr-build-slot" />
      <span className="expr-build-dot" />
      {g === "right" && "("}
      <span className="expr-build-slot" />
      {g === "left" && ")"}
      <span className="expr-build-dot" />
      <span className="expr-build-slot" />
      {g === "right" && ")"}
    </span>
  );
  return (
    <div className="expr-build">
      <p className="expr-build-label">Where do the parentheses go?</p>
      <div className="expr-build-groups" role="radiogroup" aria-label="Where the parentheses go">
        {(["left", "right"] as const).map((g) => (
          <button
            key={g}
            type="button"
            role="radio"
            aria-checked={group === g}
            aria-label={g === "left" ? "Around the first two numbers" : "Around the last two numbers"}
            data-tts-say={g === "left" ? "Around the first two numbers" : "Around the last two numbers"}
            className={`choice expr-build-group${group === g ? " on" : ""}`}
            onClick={() => set(0, g)}
          >
            {shape(g)}
          </button>
        ))}
      </div>
      <p className="expr-build-label">Type the numbers. Tap the signs.</p>
      <div className="expr-build-row">
        {group === "left" && paren("(")}
        {box(1, "1st number")}
        {sign(2, "1st sign")}
        {group === "right" && paren("(")}
        {box(3, "2nd number")}
        {group === "left" && paren(")")}
        {sign(4, "2nd sign")}
        {box(5, "3rd number")}
        {group === "right" && paren(")")}
      </div>
    </div>
  );
}
