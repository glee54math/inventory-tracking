import type { ReactNode } from "react";
import { QA, QB } from "../../../shared/engine/controls";
import type { ChoiceStep } from "../../../shared/engine/types";

/** Group names that get colored to match their boxes in the picture, plus MORE / FEWER (bolded). */
export const GROUP_WORDS = /(\b[Gg]roup [AB]\b|\b[Gg]rid group\b|\b[Ss]cattered group\b|\bMORE\b|\bFEWER\b)/;

/**
 * Color group names inside a plain string ("Group A" / "grid group" blue,
 * "Group B" / "scattered group" orange) and bold MORE / FEWER. Anything that
 * isn't a string, or has none of these words, passes through unchanged.
 */
export const colorGroups = (text: ReactNode): ReactNode => {
  if (typeof text !== "string" || !GROUP_WORDS.test(text)) return text;
  return text.split(GROUP_WORDS).map((part, i) => {
    if (/^([Gg]roup A|[Gg]rid group)$/.test(part)) return <QA key={i}>{part}</QA>;
    if (/^([Gg]roup B|[Ss]cattered group)$/.test(part)) return <QB key={i}>{part}</QB>;
    if (part === "MORE" || part === "FEWER") return <b key={i}>{part}</b>;
    return part;
  });
};

/** A choice step with its prompt and group-name buttons colored. Each button
 *  label is one span, so its words stay together. */
export const withGroupChoices = (step: ChoiceStep): ChoiceStep => ({
  ...step,
  prompt: colorGroups(step.prompt),
  hint: colorGroups(step.hint),
  explain: colorGroups(step.explain),
  ...(step.display || !step.choices.some((c) => GROUP_WORDS.test(c)) ? {} : { display: step.choices.map((c, i) => <span key={i}>{colorGroups(c)}</span>) }),
});
