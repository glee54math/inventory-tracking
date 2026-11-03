import { createContext, useContext, type ReactNode } from "react";
import { NumberPad } from "../components/NumberPad";

/**
 * "Early learner" mode for the K–1 labs (MK1–MK4, MG1): students who may not
 * read yet, working alone on an iPad. Turns on, across the shared engine:
 *   - the help ladder (hint that points at the picture → "Show me" → "Try one like it")
 *     in place of "Show answer"
 *   - plain-language feedback
 *   - the on-screen number pad (no iPad keyboard)
 *   - bigger tap targets (the `lab-early` class on the lab root)
 * Labs outside the provider keep the original behavior.
 */
const EarlyLearnerContext = createContext(false);

export const useEarlyLearner = (): boolean => useContext(EarlyLearnerContext);

export function EarlyLearnerProvider({ children }: { children: ReactNode }) {
  return (
    <EarlyLearnerContext.Provider value={true}>
      {children}
      <NumberPad />
    </EarlyLearnerContext.Provider>
  );
}

/**
 * Props that hand a text box to an on-screen number pad instead of the iPad keyboard.
 *   "inline" — the caller renders an InlineNumberPad right under the box.
 *   "enter"  — the floating pad, with a "Check" key that presses Enter.
 *   "float"  — the floating pad, with a "Done" key.
 */
export const numberPadProps = (early: boolean, mode: "inline" | "enter" | "float" = "float") =>
  early ? { inputMode: "none" as const, "data-numpad": mode === "float" ? "" : mode } : {};
