import type { CSSProperties, KeyboardEvent } from "react";
import { joinFactorBoxes, splitFactorBoxes } from "../lib/factors";

/**
 * Typed factors, one box per factor with "×" between them (5.OA.2.1): the
 * input behind the shared "factors" Step kind and the CFU `factorsOf` blank.
 * `raw` keeps every box in one string ("2,2,3"), so it fits one answer slot.
 * With `pair`, there are always exactly two boxes. Otherwise the student adds
 * or removes boxes, so the box count never tells them how many factors there
 * are (it starts with one box). Added for MG10_NumericalExpressionsAndPatternsLab.
 */
export function FactorBoxes({
  target,
  raw,
  onChange,
  pair = false,
  disabled = false,
  onEnter,
  boxStyle,
}: {
  target: number;
  raw: string;
  onChange: (raw: string) => void;
  pair?: boolean;
  disabled?: boolean;
  onEnter?: () => void;
  /** e.g. a green/red border after a Check. */
  boxStyle?: CSSProperties;
}) {
  let boxes = splitFactorBoxes(raw);
  if (pair) boxes = [boxes[0] ?? "", boxes[1] ?? ""];
  const set = (i: number, v: string) => onChange(joinFactorBoxes(boxes.map((b, k) => (k === i ? v.replace(/[^0-9]/g, "") : b))));
  const key = (e: KeyboardEvent) => {
    if (e.key === "Enter") onEnter?.();
  };
  return (
    <span className="factor-boxes" role="group" aria-label={`Factors of ${target}`}>
      <span className="factor-boxes-target">{target} =</span>
      {boxes.map((b, i) => (
        <span key={i} className="factor-boxes-item">
          {i > 0 && (
            <span className="factor-boxes-times" aria-hidden>
              ×
            </span>
          )}
          <input
            className="answer factor-box"
            inputMode="numeric"
            autoComplete="off"
            aria-label={`Factor ${i + 1}`}
            value={b}
            disabled={disabled}
            style={boxStyle}
            onChange={(e) => set(i, e.target.value)}
            onKeyDown={key}
          />
        </span>
      ))}
      {!pair && !disabled && (
        <span className="factor-boxes-tools">
          <button type="button" className="btn ghost factor-boxes-btn" disabled={boxes.length >= 8} onClick={() => onChange(joinFactorBoxes([...boxes, ""]))}>
            + Add a factor
          </button>
          <button type="button" className="btn ghost factor-boxes-btn" disabled={boxes.length <= 1} onClick={() => onChange(joinFactorBoxes(boxes.slice(0, -1)))}>
            − Remove a factor
          </button>
        </span>
      )}
    </span>
  );
}
