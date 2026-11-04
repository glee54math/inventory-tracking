// Small wording helpers shared by the units and their tests (no imports from
// either, so no import cycle). Keep generated sentences grammatical for every
// number, and easy for the read-aloud voice.

/** "1 counter", "5 counters". */
export const counters = (n: number, noun = "counter") => `${n} ${noun}${n === 1 ? "" : "s"}`;

/** "There is 1 counter." / "There are 5 counters." */
export const thereAre = (n: number, noun = "counter") => `There ${n === 1 ? "is" : "are"} ${counters(n, noun)}.`;

/** "1, 2, 3, 4" — every number from `from` to `to`. */
export const countUp = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i).join(", ");

/** The spoken "Show me" for counting a group: count every one, then say the last number is how many. */
export const countShowMe = (n: number, noun = "counter") =>
  n === 0 ? `There are no ${noun}s to count. That is zero.` : `Let's count together: ${countUp(1, n)}. The last number we say is ${n}. ${thereAre(n, noun)}`;
