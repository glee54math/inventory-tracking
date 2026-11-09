import { Children, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";
import { MathText } from "./MathText";

/**
 * A drop-in replacement for a <select> of <option>s, drawn as big tap
 * buttons — iPad dropdown pickers are hard for 5-year-olds. Same props as the
 * select it replaces (value, onChange reading e.target.value, style), so a
 * Check for Understanding can switch by renaming the tag. The disabled
 * "choose" placeholder option is dropped.
 *
 * The options are spans with role="radio", not buttons: these often sit
 * inside a <label>, and a tap on a label's text would "click" the first
 * button inside it, picking an answer by accident.
 */
type OptionProps = { value?: string | number; disabled?: boolean; children?: ReactNode };

export interface TapSelectProps {
  value: string;
  onChange: (e: { target: { value: string } }) => void;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}

const textOf = (node: ReactNode): string =>
  Children.toArray(node)
    .map((c) => (typeof c === "string" || typeof c === "number" ? String(c) : isValidElement<{ children?: ReactNode }>(c) ? textOf(c.props.children) : ""))
    .join("")
    .trim();

export function TapSelect({ value, onChange, style, children, "aria-label": ariaLabel }: TapSelectProps) {
  const options = Children.toArray(children)
    .filter((c): c is ReactElement<OptionProps> => isValidElement<OptionProps>(c) && c.type === "option")
    .filter((o) => !o.props.disabled && String(o.props.value ?? "") !== "")
    .map((o) => ({ value: String(o.props.value), label: o.props.children }));

  const labels = options.map((o) => textOf(o.label));
  const say = labels.length > 1 ? `choose ${labels.slice(0, -1).join(", ")}, or ${labels[labels.length - 1]}` : labels[0] ?? "";
  const pick = (v: string) => onChange({ target: { value: v } });

  return (
    <span className="tap-select" role="radiogroup" aria-label={ariaLabel} data-tts-say={say}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <span
            key={o.value}
            role="radio"
            tabIndex={0}
            aria-checked={on}
            className={`tap-option${on ? " on" : ""}`}
            style={on ? style : undefined}
            onClick={() => pick(o.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                pick(o.value);
              }
            }}
          >
            <MathText>{o.label}</MathText>
          </span>
        );
      })}
    </span>
  );
}
