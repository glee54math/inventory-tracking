# Round 3: no grade references + CFU "Look here" pointers (user request)

**Summary:** 2 grade-reference strings rewritten. All 8 CFU questions (4 per unit) now point to their Explore spot after the 2nd wrong Check (user decision, round 3b). Shared change is additive and optional; other labs unchanged.

## Grade references
| File | Before | After |
|---|---|---|
| units/ReadingComparingDecimals.tsx (Explore intro) | In 4th grade you used tenths and hundredths. The next place… | Tenths and hundredths are the first two places after the point. The next place… |
| MG10_WholeNumberAndDecimalOperationsLab.tsx (home prereq note) | This lab builds on tenths and hundredths from 4th grade (the Decimals lab). | This lab uses tenths and hundredths. The Decimals lab teaches them first. |

## CFU → Explore map
| Q | Spot id | Pointer label | Highlighted key line |
|---|---|---|---|
| U1 Q1 place name / 4.026 | u1-read | Build a decimal: how to read a decimal | "A 0 inside still holds its place…" |
| U1 Q2 mixed expanded form | u1-forms | Build a decimal: expanded form | Expanded form readout |
| U1 Q3 0.45 vs 0.5 | u1-fill | Compare two decimals: the "Fill empty places with 0" button | place chart + Fill button row |
| U1 Q4 more digits / 0.5 = 0.500 | u1-bars | Compare two decimals: the bars | "The longer bar is the greater number…" |
| U2 Q1 3.462 between / rounds | u2-line | The number line and the sentence under it | the "is between… rounds to" sentence |
| U2 Q2 2.996 → 3.00 | u2-carry | When you add 1 to a 9 | "When you add 1 to a 9, it becomes 10…" |
| U2 Q3 5.749 deciding digit | u2-decide | The place chart: the digit that decides | "The digit just to its right… decides." |
| U2 Q4 doesn't always change / halfway up | u2-same | The sentence under the number line | NEW line: "A number exactly halfway rounds up. Rounding does not always change the amount: 1.20 rounded to the nearest tenth is 1.2." |

## New student text
- "Stuck? Look here first: {label}" + button "Go there ↑" (shared).
- The 8 labels above; the U2 new teaching line; "Drag the dot, or change the digits." split from the carry sentence (text unchanged).

## Files
- shared/lib/lookHere.ts (new), shared/components/CfuQuestion.tsx (optional `exploreTarget` prop + wrong-Check counter; affects no lab unless the prop is set)
- MG10 units/ReadingComparingDecimals.tsx, units/RoundingDecimals.tsx, MG10_WholeNumberAndDecimalOperationsLab.tsx, VISUAL_COMPONENT_TODO.txt

## Verification
tsc pass; eslint 0 errors (warnings pre-existing); vite build pass; english-check grade 5: 0 over limit, only pre-existing flags. Playwright 820×1180 touch (temp harness, removed; dev server stopped): U1 Q1, U1 Q3, U2 Q2, U2 Q4 each show pointer counts [0,0,1] after misses 1–3; "Go there" highlights the right spot (u1-fill, u2-carry, u2-same); one highlight at a time; right answer hides the pointer and the green feedback stays; MG10 NumericalExpressionsAndPatternsLab CFU after 4 wrong Checks shows no pointer. Screenshots reviewed (session scratchpad).

## Round 3b: user decisions applied
- Pointer shows after the **2nd** wrong Check (was 3rd).
- Highlight stays until that CFU question is answered right (no 6 s timeout; tapping the spot doesn't clear it); a right answer clears it; one spot lit at a time.
- U2 new rounding line and "Stuck? Look here first: {label}" / "Go there ↑" approved as written. Fractions confirmed stacked in the real lab.
- Verification: tsc pass; eslint 0 errors; vite build pass. Playwright 820×1180 touch: U1 Q3 and U2 Q2 pointer counts [0,1] after misses 1–2; highlight still on after 7 s and after tapping the spot; cleared after the right answer; MG10 NumericalExpressionsAndPatternsLab CFU shows no pointer. Temp harness removed; dev server stopped.

## Round 3c: pointers per part (user feedback on U1 Q1)
- `CfuBlank` now takes optional `exploreTarget` + `part`. Each part counts its own wrong Checks; after 2 it gets its own line ("a. Look here first: …" + "Go there ↑"). A part's line and highlight clear when that part is right. Several spots of one question can be lit at once; "Go there" in another question clears them (`lookHere(id, keep)`). The question-level `exploreTarget` still works (used by U1 Q2, U2 Q2).

| Question part | Part label | Spot | Pointer label |
|---|---|---|---|
| U1 Q1a place of the 4 | a | u1-chart (NEW) | Build a decimal: the place chart |
| U1 Q1b 4.026 | b | u1-read | Build a decimal: how to read a decimal |
| U1 Q2 (both, one idea) | — | u1-forms | Build a decimal: expanded form |
| U1 Q3 two thousandths boxes | Thousandths | u1-fill | Compare two decimals: the "Fill empty places with 0" button |
| U1 Q3 greater number | Greater number | u1-bars | Compare two decimals: the bars |
| U1 Q4 more digits | First sentence | u1-bars | Compare two decimals: the bars |
| U1 Q4 0.5 = 0.500 | Second sentence | u1-fill | Compare two decimals: the "Fill…" button |
| U2 Q1 the two tenths | Between | u2-between (NEW spot, existing text) | How to round (the first sentence) |
| U2 Q1 rounded | Rounds to | u2-line | The number line and the sentence under it |
| U2 Q2 (one idea) | — | u2-carry | When you add 1 to a 9 |
| U2 Q3 deciding digit | Digit that decides | u2-decide | The place chart: the digit that decides |
| U2 Q3 rounded | Rounds to | u2-line | The number line and the sentence under it |
| U2 Q4 always changes | First sentence | u2-same | The sentence under the number line |
| U2 Q4 halfway | Second sentence | u2-same | The sentence under the number line |

- **Teaching line added:** U1 Build a decimal, under the place chart: "Count the places after the point: tenths, then hundredths, then thousandths." (No Explore line named the places in order next to the chart.)
- **Verification:** tsc pass; eslint 0 errors; vite build pass; english-check grade 5: 0 over limit. Playwright 820×1180 touch: U1 Q1 miss 1 → no lines; miss 2 (both wrong) → lines a + b, both "Go there" → u1-chart and u1-read lit together; fix b only → only a's line and u1-chart remain; fix a → no lines, nothing lit, green feedback. U2 Q3: two lines after miss 2; fixing the deciding digit leaves only "Rounds to"; u2-line still lit after 7 s; cleared when right. NumericalExpressionsAndPatternsLab CFU: no pointer after 4 wrong Checks. Screenshots reviewed; harness removed, dev server stopped.
