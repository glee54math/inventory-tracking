# MG10 Expressions & Patterns — round 3 merged fix list (final round)

- Lab: MG10 `NumericalExpressionsAndPatternsLab`, Grade 5
- Round: 3 · Date: 2026-11-14
- Inputs: `round-3-curriculum.md` (0 Blocker · 0 Major · 2 Minor · 3 Polish; round-2 items 18 fixed, 1 fixed-but-new-issue → C3-01), `round-3-english.md` (0 Blocker · 0 Major · 3 Minor · 2 Polish; round-2 English items 13/13 fixed)
- After merging: 10 items → **Fix 10 · Skip 0 · Ask user 0**
- Stopping rule: no Blocker or Major this round, and round 3 is the cap → no round 4 after these fixes.

Paths are relative to `src/pages/math-levels/MG10/NumericalExpressionsAndPatternsLab/`.

| ID(s) | Sev | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|
| C3-01 + E3 out-of-lane | Minor | `units/ReadingExpressions.tsx:504` | Move-the-parentheses step 3 is always the opposite of steps 1–2, so it's predictable; story says "same three numbers" while Ty uses new ones | Fix | Draw Ty's case independently (`changeCompare()`, 50/50). Keep Ty's pair drawn and ringed. Add to the story: "Then Ty tries his own numbers." Keep the wrap-up "Sometimes it changes and sometimes it doesn't." |
| C3-02 | Minor | `units/ReadingExpressions.tsx` Explore Part 2 | Screen too heavy; "bigger group" bars ignore the stepper | Fix | Three modes in the Segmented control: "× copies" (Copies + Copies to compare, first bar set, compare sentence), "bigger group" (its sentence and bar set, Copies stepper + "New big numbers" only), "÷ equal parts" (unchanged). No new controls. |
| E3-33 | Minor | `units/WhyParentheses.tsx:365-373` | Either-case wrap-up mixes the first numbers and the new numbers | Fix | "With the new numbers, both places give 12, so moving the parentheses did not change the value." (use the actual target) |
| E3-34 | Minor | `units/WhyParentheses.tsx:348` | "Find the part in parentheses" | Fix | "Find the value of the part in parentheses in each one." |
| E3-35 | Minor | `units/Patterns.tsx:84-112` | U5 CFU Q3's new patterns not called new; "the table" ambiguous | Fix | Start Q3 with "Here are two new patterns."; miss message says "this table". Combine with C3-03. |
| C3-03 | Polish | `units/Patterns.tsx:94-100` | U5 CFU Q3 typed pairs can be copied from the table | Fix | Show Pattern B as `[0, 4, null, null]` (A stays full). Miss message: "Pattern B adds 4 each time. Pattern A's term comes first." Keep the rule "start 0, add 4" visible. |
| C3-04 | Polish | `lib/patternSteps.ts` (why step) | Only the right choice repeats "{k} times" | Fix | Replace the first trap with "B starts {k} higher than A and adds the same number as A." Keep "It works in the first column, so it works in every column." |
| C3-05 | Polish | `units/WhyParentheses.tsx:417-424` (Key Idea) | Key Idea doesn't cover "Either place works" | Fix | Add: "With only + or only ×, the parentheses can go in either place. The value stays the same." |
| E3-36 | Polish | `lib/reading.ts:35` | "The question asks…" on a fill-in sentence | Fix | "The blank asks…" |
| E3-37 | Polish | `lib/reading.ts:192` | (13 + 7) + 2 for "double it" gets "Check the signs" | Fix | In the `addDouble` diagnose, a + with the 2 also gets "\"Double it\" means multiply by 2." |

## Notes for the fixer
- Re-run tsc, lint, build, brute-force (Ty's case split ~50/50 and independent of steps 1–2; why-step trap always false; CFU Q3 still grades), english-check --grade 5, and a browser pass on U3 Explore Part 2, U3 Move-the-parentheses, U1 either case, U5 CFU Q3.

## Proposed rule and guideline changes (wait for Stage 6)
From curriculum (`math-lab-builder.md`):
1. A later step's answer must not follow from an earlier step's result alone unless that link is what's taught.
2. If the prompt names a number or key word, at least one wrong choice must use it too.

From English (`.claude/reference/english-for-math/`):
3. checklist.md §3 "Switches": when a problem's steps reach opposite results, each wrap-up sentence says which part it means ("With the new numbers, …").
4. grade-5.md Watch for: keep the verb with "value" ("Find the value of the part in parentheses").
