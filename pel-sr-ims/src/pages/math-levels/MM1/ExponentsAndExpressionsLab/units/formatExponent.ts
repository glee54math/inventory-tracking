const SUPERSCRIPT_DIGITS: Record<string, string> = {
  "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴",
  "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹",
};

/** Renders an exponent in real superscript digits (e.g. 12 -> "¹²") so
 *  plain-string contexts (Choice options, hint/explain text) match the
 *  handwritten form, the same way JSX <sup> does for prompt text. */
export const toSuperscript = (n: number): string =>
  String(n).split("").map((d) => SUPERSCRIPT_DIGITS[d] ?? d).join("");
