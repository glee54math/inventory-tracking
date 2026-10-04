import React from "react";

/** Quantity words, colored to match the diagrams. */
export const QA = ({ children }: { children: React.ReactNode }) => <span className="qa-text">{children}</span>;
export const QB = ({ children }: { children: React.ReactNode }) => <span className="qb-text">{children}</span>;
export const QC = ({ children }: { children: React.ReactNode }) => <span className="qc-text">{children}</span>;

export interface StepperProps {
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  tone?: "a" | "b" | "c";
}

/** − value + control. */
export function Stepper({ label, value, min, max, step = 1, onChange, tone }: StepperProps) {
  const clamp = (v: number) => Math.min(max, Math.max(min, Math.round(v * 1000) / 1000));
  return (
    <div className={`stepper ${tone ? "tone-" + tone : ""}`}>
      <span className="stepper-label">{label}</span>
      <div className="stepper-ctl">
        <button aria-label="decrease" disabled={value <= min} onClick={() => onChange(clamp(value - step))}>
          −
        </button>
        <output>{value}</output>
        <button aria-label="increase" disabled={value >= max} onClick={() => onChange(clamp(value + step))}>
          +
        </button>
      </div>
    </div>
  );
}

export interface SliderProps {
  label: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  display?: string;
}

export function Slider({ label, value, min, max, step = 1, onChange, display }: SliderProps) {
  return (
    <label className="slider">
      <span className="stepper-label">
        {label} <b>{display ?? value}</b>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </label>
  );
}

/** A picker for small sets of options (presets, contexts). */
export function Segmented<T extends string>({ options, value, onChange, label }: { options: { id: T; label: string }[]; value: T; onChange: (v: T) => void; label: string }) {
  return (
    <div className="segmented" role="radiogroup" aria-label={label}>
      {options.map((o) => (
        <button key={o.id} role="radio" aria-checked={o.id === value} className={o.id === value ? "on" : ""} onClick={() => onChange(o.id)}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** A sentence card that states a relationship in words. */
export function Says({ children }: { children: React.ReactNode }) {
  return <p className="says">{children}</p>;
}

/** Picks a "nice" tick step so an axis has about `target` ticks. */
export const niceStep = (max: number, target = 8): number => {
  const raw = max / target;
  const pow = Math.pow(10, Math.floor(Math.log10(raw || 1)));
  for (const m of [1, 2, 5, 10]) if (raw <= m * pow) return m * pow;
  return 10 * pow;
};

/** Rounds an axis maximum up to a whole number of ticks. */
export const niceMax = (max: number, step: number): number => Math.ceil((max * 1.08) / step) * step;
