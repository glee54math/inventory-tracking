import type { CSSProperties } from "react";

// Small helpers for Check-for-Understanding questions with more than one answer box.
// Rule used across every lab: "Check Answer" stays disabled until every box has an
// answer, each box then gets its own green/red border, and the feedback sentence only
// shows once every box is filled.

/** True once every answer box has something in it. */
export const allFilled = (...values: unknown[]): boolean =>
  values.every((v) => v !== null && v !== undefined && String(v).trim() !== "");

/** Green border when right, red when wrong, nothing until `show` is true. */
export const answerBorder = (ok: boolean, show: boolean): CSSProperties =>
  show ? { borderColor: ok ? "var(--good)" : "var(--bad)" } : {};
