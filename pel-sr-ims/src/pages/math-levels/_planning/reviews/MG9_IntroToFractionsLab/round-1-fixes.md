# MG9 Introduction to Fractions — round 1 fixes

Date: 2026-11-15. Nothing committed. Grade 4 (MG9 slot, 4.NF).

No merged fix list, plan.md or user-notes.md exists for this lab (only the
Grade-3 FractionsFoundationsLab plan, which names this lab as its follow-on).
The caller asked for a fix pass against the saved project rules, so the items
below come from a self-audit against `math-lab-builder.md`.

## Summary
Fixed 14, Not fixed 6 (listed under "Noticed, not fixed").

## Items
| ID | Status | Change | File |
|---|---|---|---|
| S1 | Fixed | Units 2–4 had no Check for Understanding; every unit now has a fixed 4-question CFU that gates Practice (`requiresIntro: true`), with the Explore toggle once passed. The shell's `cfuJustPassed` latch was already there. | all 4 unit files |
| S2 | Fixed | Unit 1's gate was one randomized Stepper task (no typed boxes). Replaced by a fixed 4-question CFU; the Stepper converter stays in Explore as an ungated "Try it". | FractionForms.tsx |
| S3 | Fixed | Fill-in rule: 15 of 16 CFU questions have typed boxes (built on shared `DropdownQuestion`, multi-box rule included). | all 4 unit files |
| S4 | Fixed | No Module Test. Added `ModuleTest.tsx` (20 questions, 5 per unit, pass 16, 18/16/14/12 stars) and wired it into the shell + CSS, copied from MG9 Fraction Operations. Test generators are now exported. | ModuleTest.tsx, shell, styles, 4 *Test.tsx |
| P1 | Fixed | Bug: improper fractions could be whole-number multiples (8/4), giving "2 0/4" in the converter, CFU feedback and Practice choices. Generator now skips them (Practice + Test). | FractionForms.tsx, FractionFormsTest.tsx |
| P2 | Fixed | Choice-only Practice types got a typed step: Classify (parts to one whole / whole bars filled / parts in all), Spot the equivalent (the multiplier), Same denominator (how many more pieces), Same numerator (both fractions over a common denominator). | FractionForms, EquivalentFractions, ComparingFractions |
| P3 | Fixed | "Find the missing number" told the student the multiplier in the prompt (the Test doesn't). Now two typed steps: find the multiplier, then the missing number. "?/24" slash text now a stacked `Frac`. | EquivalentFractions.tsx |
| P4 | Fixed | "Build an equivalent fraction" step 2 was always "No — same amount". Now a typed second equivalent fraction with a different multiplier. | EquivalentFractions.tsx |
| P5 | Fixed | Simplify: the story told which case it was, the "already simplest" yes/no was 70/30, and the reduce case ended with an always-"No" choice. Same story and first yes/no for both cases, 50/50; the always-No step removed; "already simplest" gets a typed GCF = 1 step; the factor pick is the GCF's smallest prime (not the GCF 40% of the time) so the GCF step isn't a copy. | SimplifyingFractions.tsx |
| P6 | Fixed | Classify pictures showed the typed step's answer and the improper bar's caption said "needs more than one bar". Picture now appears after the steps; Test uses whole bars + leftover with no caption. Boundary case n/n now appears in Practice (CFU trap carried forward). | FractionForms.tsx, FractionFormsTest.tsx |
| T1 | Fixed | Equivalent Test showed `EquivalentBars`, whose caption names the answer fraction. Missing-number questions now show a plain bar of the given fraction; the concept question has no picture. "Three of these…" with 3 options → "Two of these…". | EquivalentFractionsTest.tsx |
| T2 | Fixed | Simplifying Test Q3/Q6 were always "No". Now 50/50 reduces vs simplest. | SimplifyingFractionsTest.tsx |
| E1 | Fixed | Comparing Explore never taught the common-denominator step Practice now asks; added a worked line under "Different everything" (also shows the new numerators are the cross products). Key idea updated. | ComparingFractions.tsx |
| E2 | Fixed | Simplifying Explore used "GCF" without defining it; added a one-line definition. Home "Your path" text now says "each kind twice … no wrong guesses, at most one hint". | SimplifyingFractions.tsx, shell |

## Changed files
- `MG9/MG9_IntroToFractionsLab.tsx`, `MG9/MG9_IntroToFractionsLab_styles.css`
- `MG9/IntroToFractionsLab/units/`: `FractionForms.tsx`, `FractionFormsTest.tsx`, `EquivalentFractions.tsx`, `EquivalentFractionsTest.tsx`, `ComparingFractions.tsx`, `ComparingFractionsTest.tsx`, `SimplifyingFractions.tsx`, `SimplifyingFractionsTest.tsx`, `ModuleTest.tsx` (new)
- No shared code changed (uses existing `shared/components/CfuQuestion.tsx`).

## New or rewritten student text
- CFU questions + feedback: `FormsCheck`, `EquivalentCheck`, `ComparingCheck`, `SimplifyCheck` (top of each unit file).
- FractionForms: Explore "Try it…" title and its wrong-answer line; the reason sentence now shows only after the right pick; Classify typed steps and hints; improper→mixed step 1 hint.
- EquivalentFractions: Explore paragraph and caption; missing-number steps; spot-the-equivalent hint/explain + typed step; build step 2.
- ComparingFractions: Explore common-denominator lines; key idea line 3; Same-denominator and Same-numerator typed steps.
- SimplifyingFractions: GCF definition; shared story; yes/no explains; GCF hints; divide-step explain.
- Tests: Equivalent "Two of these…"; Simplifying Q3/Q6 explains. Shell: path helper text, module test card/header.

## Verification
- `npx tsc --noEmit -p tsconfig.app.json`: pass.
- eslint on touched files: 0 errors, 12 warnings (all `react-refresh/only-export-components`, the existing pattern).
- `npx vite build`: pass; only the usual chunk-size warning.
- Unit/Test import check: no unit ↔ own-test cycles; no bare `useRef<…>()`.
- Brute force (20,000 trials, scratch script, deleted): no zero leftovers, no distractor collisions, k2 ≠ k, simplify yes/no 50/50 in Practice and Test, wrong-factor loop always ends.
- `english-check --grade 4`: new text flags only true/false (allowed for 4th) and two passives, which were rewritten. Remaining long strings are older text (see below).
- Browser checks: NOT run (playwright isn't installed in this repo). Needs a manual iPad pass: each CFU, the Classify picture timing, the Same-numerator two-box step, the Module Test.

## Noticed, not fixed
1. "GCF" is a 6th-grade term (6.NS.4); 4th-grade students may not know it. Rewording the unit around "biggest common factor" would change the approved design. Needs decision.
2. Cross-multiplying is a shortcut beyond 4.NF.2 (common denominators / benchmarks). Kept; the Explore now shows where it comes from.
3. Units 1 and 2 have no `requiredBuckets`. Adding them now would lower stars for students with old untagged solves.
4. Older long sentences (> 18 words) remain in key ideas, the hero paragraph, Comparing Explore and some Test explains.
5. Test pictures: the Comparing cross-multiply questions show an empty number line (no purpose).
6. Hero heading "3/8 = 6/16 = 0.375" shows a decimal this lab doesn't teach.
