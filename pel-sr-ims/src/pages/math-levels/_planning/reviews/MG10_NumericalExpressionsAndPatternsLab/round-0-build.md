# MG10 Numerical Expressions & Patterns — round 0 build report

Date: 2026-11-14. Builder: general-purpose agent following `.claude/agents/math-lab-builder.md`.
Plan: `src/pages/math-levels/_planning/Grade-5/NumericalExpressionsAndPatternsLab/plan.md` (approved unchanged; slot MG10).

## Lab
`NumericalExpressionsAndPatternsLab` in MG10, wired in `src/utils/levelSubsections.ts` as MG10's second standalone skill (skillId "NumericalExpressionsAndPatternsLab", label "Expressions & Patterns"). Not committed.

All five units: Explore, CFU gate (4 fixed questions, `cfuJustPassed` latch), Practice, 10-question Test (passScore 9). Module Test: 25 questions (passScore 20), 5 per unit.

Grade band: grade 5 first-time learners; comprehension-bar CFU, no read-aloud / EarlyLearnerProvider (MG6+ convention). Text written to `grade-5.md`; `english-check --grade 5` shows 0 over-length sentences (remaining flags "in all", "true or false" are allowed at grade 5). Lab-wide rule: every two-operation expression shows its first step in grouping symbols; nothing relies on "multiply before add" (6.EE.2c is grade 6).

Typed-answer share of CFU questions: 3/4 in Units 1–4, 4/4 in Unit 5.

## Unit 1 — Why We Need Parentheses (5.OA.1)
- Explore: lunch-bag story with steppers and "In every bag / On the table" toggle (picture, expression, worked steps, e.g. (2 + 1) × 3 vs (3 × 2) + 1); "Move the parentheses" sandbox with both groupings side by side.
- CFU:
  - Q1: "Each of 4 friends gets 2 apples and 1 orange." Pick (2 + 1) × 4, type 12.
  - Q2: 5 × (2 + 4) = 30; typing 14 → "14 is what you get going left to right."
  - Q3: (12 − 4) ÷ 2 = 4 and 12 − (4 ÷ 2) = 10.
  - Q4: "Parentheses always come at the start" → False; "You work out the part in parentheses first, wherever it is" → True.
- Practice: story (pick expression, value, friend's wrong expression value); parensFirst (value, moved-parens value); parensLast (value; "Sam says… is Sam right?" — right half the time, else left-to-right answer); subDiv (− or ÷ inside parens, value then moved version).
- Test: two story picks (each / extra), parens first, two parens-later items from separate pools, one −, one ÷, Sam, "which grouping equals V", story typed as value.

## Unit 2 — Brackets and Braces (5.OA.1)
- Explore: symbol key; shopping story {[(shirt + hat) − coupon] × friends} + shipping with 2-layer/3-layer toggle and "Work out the ringed part" stepper.
- CFU:
  - Q1: name ( ), [ ], { } — parentheses / brackets / braces.
  - Q2: 2 × [(5 + 3) − 2] typed layer by layer: 8, 6, 12 (11 named as left-to-right).
  - Q3: {3 × [(4 + 2) − 1]} + 5 — outside marks braces, first part (4 + 2), value 20.
  - Q4: (3 + 2) × (4 − 1) = 15 (19 named as left-to-right); "You always work left to right" → False.
- Practice: twoLayer (pick first part — distractors first two numbers / outside group / last two numbers — then value); threeLayer ([ ] part, then whole value); outermost (pick outside marks, symbols balanced, then value); twoGroups (value, then regrouped [(a + b) × c] − d).
- Test: symbol name, first part (2 layers), two 2-layer values (separate pools), [ ] part, 3-layer value, outside marks, two groups, Jo-or-Kim left-to-right question, first part (3 layers).

## Unit 3 — Reading an Expression Without Solving It (5.OA.2)
- Explore: allowance story (12 + 15) ÷ 3; words→expression builder; bars showing k copies of 18,932 + 921; "does moving the parentheses change the value" comparer.
- CFU:
  - Q1: "Add 8 and 7, then multiply by 2" → pick 2 × (8 + 7); type it is 2 times as large as 8 + 7.
  - Q2: 3 × (18,932 + 921) is 3 times as large (typing a computed value → "You worked it out…").
  - Q3: (20 − 4) ÷ 2 → "Subtract 4 from 20, then divide by 2."; it is smaller than 20 − 4.
  - Q4: (8 − 3) − 2 = 3 and 8 − (3 − 2) = 7; moving parentheses sometimes changes the value.
- Practice: toExpr (pick expression — traps: word-order numbers, only one number multiplied — then value); toWords (pick words, then times-as-large or value); compareSize (times-as-large number, then which is larger: first/second/equal ~⅓ each); moveParens (both values, then "does it change?" for a new expression, yes/no ~even).
- Test: two words→expression (one "subtract … from" trap), two expression→words (one division), two times-as-large (plain + ratio), which is larger, does it change, always/sometimes/never sentence, words typed as value.

## Unit 4 — Breaking Numbers into Prime Factors (5.OA.2.1)
- Explore: any number 2–50 and any starting pair; factor tree with circled primes always ends at the same primes; prime-number explanation; primes-to-50 row.
- CFU:
  - Q1: 20 = 2 × 2 × 5 any order ("2 × 10" → "10 is not prime").
  - Q2: 29 is prime; factorization is just 29 ("1 × 29" named).
  - Q3: Mia's 36 tree starts 4 × 9, Leo's 6 × 6; type Leo's primes 2 × 2 × 3 × 3; "Different starts give different primes" → False.
  - Q4: "2 × 2 × 3 and 3 × 2 × 2 are different" → F; "2 × 6 is the prime factorization of 12" → F; "2 × 2 × 3 is" → T.
- Practice (non-overlapping number pools): short (primes, then backward "which number is …?"); prime (pick the prime among look-alikes like 39/49, type its factorization, factor a look-alike); long (4–5 factors / repeated / prime ≥ 11: starting pair, primes, backward); manyTrees (pair different from Mia's, primes, judge someone's answer — right judgment evenly drawn from same-primes-other-order / a factor isn't prime / wrong product; "different start gives different primes" never right).
- Test: four factorization pools (short, 4+ factors, repeated/large prime, prime), which is prime, starting pair, where two trees end, judge, backward, "Kim wrote 2 × 6".

## Unit 5 — Two Rules, Two Patterns, One Relationship (5.OA.3)
- Explore: presets (saving money, ages, laps) or own rules; two-row term-aligned table, ordered-pairs row, automatic graph, relationship sentence.
- CFU:
  - Q1: start 0, add 3 → 3, 6, 9, 12.
  - Q2: Pattern B (start 0, add 6) → 12, 18; each B term is 2 times the A term.
  - Q3: type pairs (6, 12) and (9, 18), then tap all 4 points.
  - Q4: A = 2, 4, 6, 8; B = 4, 6, 8, 10 → B is 2 more than A (though first column looks like ×2); "Patterns are always related by times" → False.
- Practice: onePattern (2nd and 3rd terms, 6th term, add-amount of another pattern); twoTimes / twoMore share one problem type "Two rules" (4th terms, relationship as number + times/more-than with named wrong-word message, predict 10th term); plotPairs (one ordered pair, plot all points, relationship from the points).
- Test: two term questions (start 0 / above 0), relationship times, relationship more, ordered pair, plot, two predictions, which point comes next (switched-coordinates distractor), times-2 trap.

## CFU → Practice → Test map
| Unit | CFU Q1 | CFU Q2 | CFU Q3 | CFU Q4 |
|---|---|---|---|---|
| 1 | story → Q1, Q2, Q10 | left to right → parensLast → Q4, Q5, Q8 | ÷ / − → subDiv → Q6, Q7 | not always first → Q3–Q5, Q9 |
| 2 | names → Q1 | inside first → twoLayer / threeLayer → Q2–Q6 | outside vs first → outermost → Q7, Q10 | two groups → twoGroups → Q8, Q9 |
| 3 | words → toExpr → Q1, Q2, Q10 | big numbers → compareSize → Q5–Q7 | → words → toWords → Q3, Q4 | sometimes → moveParens → Q8, Q9 |
| 4 | short / long → Q1–Q3 | prime → Q4, Q5 | same primes → manyTrees → Q7, Q8 | order / not prime → Q8, Q10 |
| 5 | onePattern → Q1, Q2 | twoTimes → Q3, Q7 | plotPairs → Q5, Q6, Q9 | twoMore → Q4, Q8, Q10 |

Module Test: U1 story (each), parens later (×, +), ÷, Sam, story value. U2 symbol name, 2-layer, 3-layer, outside marks, regrouped two groups (`noVisual`). U3 "subtract from" words, expression→words, times as large, which larger, does it change. U4 long factorization, prime, same end, judge, not finished. U5 term (start > 0), relationship (more), ordered pair, plot, times trap.

## Decisions beyond the plan
- New optional shared Step kinds (additive): `"factors"` (any-order factor list, student adds/removes boxes; `pair` mode for starting a tree) and `"plot"` (tap-to-plot graded as a set, names switched coordinates). CFU blanks gained optional `factorsOf`, `factorPair`, `plot`. Chosen over CustomStep so Practice/CFU/Test grade identically.
- Promoted MM1 RatioLab's first-quadrant plane to `shared/diagrams/FirstQuadrantPlane.tsx` (MM1 file now re-exports under old name). New optional props `hoverLabel` (off for plot questions) and `hitPad` (finger tap area). Reasoning in `VISUAL_COMPONENT_TODO.txt`.
- Did not promote MG8 PatternStrip; wrote lab-local PatternTable (5.OA.3 needs term-aligned rows).
- Relationship wording standardized to "the matching Pattern A term"; relationship answer = typed number + tap pick.
- Unit 1 story picture appears only after the expression is picked (or after a wrong pick).
- New `--item-orange` color (lab orange too close to apple red).

## Files
Created (under `src/pages/math-levels/`): `MG10/MG10_NumericalExpressionsAndPatternsLab.tsx`, `MG10/MG10_NumericalExpressionsAndPatternsLab_styles.css`; `MG10/NumericalExpressionsAndPatternsLab/` — `lib/` (expr, steps, stories, reading, primes, primeSteps, patterns, patternSteps), `diagrams/` (ExprView, GroupsPicture, TimesBars, FactorTree, PatternTable, index), `units/` (5 units, 5 tests, ModuleTest, index); `shared/components/FactorBoxes.tsx`, `shared/lib/factors.ts`, `shared/diagrams/FirstQuadrantPlane.tsx`.
Modified: `shared/engine/types.ts`, `shared/engine/StepProblem.tsx`, `shared/engine/UnitTest.tsx`, `shared/components/CfuQuestion.tsx`, `shared/diagrams/index.ts`, `shared/styles/lab-base.css`, `MM1/RatioLab/diagrams/CoordinatePlane.tsx` (re-export), `src/utils/levelSubsections.ts`, `VISUAL_COMPONENT_TODO.txt`, `MATH_TSX_STYLE_GUIDE.txt`.

## Verification
- `tsc -p tsconfig.app.json` pass; eslint 0 errors (only existing `only-export-components` warnings); `vite build` pass; no unit↔Test imports; no `useRef` without initial value.
- Brute force: 1,500 problems per bucket + 800 draws of each unit test and the Module Test, rendered to markup, 0 failures on final run (correct answers pass grader; whole numbers ≥ 0; no duplicate choices / undefined / NaN / slash fractions; all buckets reachable incl. hard ends; choice answers balanced; left-to-right value always differs from correct). Caught and fixed: duplicate choices from repeated numbers; "1 strawberries".
- Browser (Playwright, iPad portrait 820×1180, touch): lab loads via level loader's dynamic import; Practice locked before CFU and unlocks after; passed CFU stays until leaving Explore; practice history without CFU still locked; multi-box Check gating and per-box borders; named mistakes shown (14, 11, big computed value, "10 is not prime", "1 × 29"); Enter on number step doesn't pick next step's choice; Module Test reaches review; dark palette ok; no slash fractions; no console errors; MM1 Tables & graphs plane unchanged.
- One scripted check failed due to a test-script error ((12, 9) used as the switch of (9, 18) instead of (18, 9)); app behaved correctly.
- Watch item: plot grids up to y = 20 have ~14–20 px row spacing; taps snap with 14 px extra area — try with real fingers.
