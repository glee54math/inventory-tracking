import { createContext, useContext } from "react";

// ============================================================================
// Logic for the opt-in "pick the kind of answer" buttons (the components are
// in AnswerForm.tsx; see its header comment for what it does and how a lab
// turns it on). Kept in a plain .ts file so AnswerForm.tsx exports only
// components.
// ============================================================================

/** On inside an <AnswerFormPick> provider (AnswerForm.tsx). */
export const AnswerFormCtx = createContext(false);

/** True inside an <AnswerFormPick> provider. */
export const useAnswerFormPick = (): boolean => useContext(AnswerFormCtx);

export type AnswerForm = "whole" | "mixed" | "proper";
export const ANSWER_FORMS: AnswerForm[] = ["whole", "mixed", "proper"];

export const isAnswerForm = (v: unknown): v is AnswerForm => v === "whole" || v === "mixed" || v === "proper";

/** "whole number" / "mixed number" / "proper fraction", for sentences. */
export const formName = (f: AnswerForm): string => (f === "whole" ? "whole number" : f === "mixed" ? "mixed number" : "proper fraction");

/** "Whole number" / "Mixed number" / "Proper fraction", for buttons and sentence starts. */
export const formLabel = (f: AnswerForm): string => {
  const s = formName(f);
  return s[0].toUpperCase() + s.slice(1);
};

/**
 * The instruction on its own line just above the kind buttons, everywhere
 * they show (Practice, CFU, Tests). The user's exact words (MG10 round 5,
 * U5-01); keep "format".
 */
export const FORM_PICK_PROMPT = "Pick a format to write your answer.";

/** One example of each kind (drawn stacked in labs with <StackedFractions>). */
export const FORM_EXAMPLE: Record<AnswerForm, string> = { whole: "2", mixed: "1 3/4", proper: "3/4" };

/** What each kind means, in a few words (under the examples in AnswerFormGuide). */
export const FORM_MEANS: Record<AnswerForm, string> = {
  whole: "No fraction part.",
  mixed: "A whole number and a fraction.",
  proper: "Less than 1.",
};

/** The kind a value n/d (n ≥ 0, d > 0) is written as in simplest form. 0 is a whole number. */
export const formOfValue = (n: number, d: number): AnswerForm => (n % d === 0 ? "whole" : n < d ? "proper" : "mixed");

/** Which boxes a kind shows: [whole-number box, top box, bottom box]. */
export const formBoxes = (f: AnswerForm): [boolean, boolean, boolean] => (f === "whole" ? [true, false, false] : f === "mixed" ? [true, true, true] : [false, true, true]);

/**
 * Switch to kind `f`, keeping the numbers that still fit (the boxes the new
 * kind also shows) and clearing the rest. values = [whole, top, bottom].
 */
export const keepFitting = (values: [string, string, string], f: AnswerForm): [string, string, string] => {
  const show = formBoxes(f);
  return [show[0] ? values[0] : "", show[1] ? values[1] : "", show[2] ? values[2] : ""];
};

/** A kind is picked and every box it shows has something in it. */
export const formFilled = (form: string | undefined, values: [string, string, string]): boolean => {
  if (!isAnswerForm(form)) return false;
  const show = formBoxes(form);
  return values.every((v, i) => !show[i] || v.trim() !== "");
};
