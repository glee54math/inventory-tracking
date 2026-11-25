# MK2 Addition, Subtraction & Teen Numbers: review summary

- **Lab:** MK2 `AdditionSubtractionAndTeenNumbersLab` (6 units, 6 unit Tests, 30-question Module Test) · Grade K, K–1 band
- **Date:** 2026-11-21
- **Workflow:** 3 review rounds (curriculum and English checkers in parallel), 3 merged fix lists, 3 fixer passes. The run stopped at the 3-round limit.
- **Round 3's fixes were not re-read by a checker.** They were verified by the fixer only, because the workflow allows no fourth round.
- **Files changed:** only `MK2/`, this lab's `vocabulary.md`, and the reports in this folder. Nothing in `shared/` or another lab was edited. Nothing was committed.

## Per round

| Round | Curriculum | English | Fix rows |
|---|---|---|---|
| 1 | 3 B · 29 Maj · 10 Min · 2 Pol | 6 B · 25 Maj · 12 Min · 4 Pol | 63 rows: 61 fixed, 1 partly (row 17, finished in round 2), 1 skipped |
| 2 | 0 B · 9 Maj · 7 Min · 4 Pol | 0 B · 3 Maj · 9 Min · 5 Pol | 37 rows: 36 fixed, 1 skipped |
| 3 | 0 B · 1 Maj · 3 Min · 2 Pol | 0 B · 2 Maj · 4 Min · 2 Pol | 12 rows: 12 fixed |

### What changed, in short

- **Round 1:**
  - **False math removed:** true facts marked wrong, "how many more" asked about the child with fewer, and impossible Explore stories.
  - **Teaching added:** 25 "Look here" CFU pointers, guided Watch demos, Show me demos, a second ten-frame for teen ones, and fingers that match the story.
  - **K level:** true/false, *digit*, *subtract*, *partner*, *equation*, fact families and strategy questions removed. All student text rewritten to short spoken sentences.
  - **Standards gap closed:** students now record decompositions themselves (K.OA.3, K.NBT.1).
- **Round 2:**
  - Missed picks act out the story.
  - Hints no longer reveal answer dots before a try.
  - No repeated question within a Test.
  - Facts with 0 have a picture.
  - The whole Test pad fits on a landscape iPad.
  - "Write another way" can't be passed by typing the number and 0.
- **Round 3:**
  - Repeats and 0 in "write another way" now lead to help.
  - Hints are true of the picture before a try.
  - Unit 5's re-check no longer shows its own answer.

## User decisions

| # | Decision |
|---|---|
| D1 | "How many more?" is an optional Unit 2 challenge: not in Mixed, no stars, no retry lock, no Test items. Core compare is "Who has more?" with lined-up rows. |
| D2 | Start-unknown Test items replaced with taught story types. |
| D3 → D7 | Module Test stars: 28–30 = 5, 25–27 = 4, 22–24 = 3, 19–21 = 2, 10–18 = 1, 0–9 = 0. |
| D4 | Unit 2 add and take-away retries draw either type at random. Credit goes to the bucket solved. |
| D5 | No star after a hint or any wrong try. **Applied to all labs on 2026-11-23** in the shared engine. The "Try one like it" rule is unchanged. |
| D6 | Unit titles: Put Together and Take Away · Story Problems to 10 · Break Numbers Apart · Make 10 · Fast Facts to 5 · Teen Numbers. |
| D8 | The four partly done round 1 fixes were retried and are fixed. |

## Verification (final code)

- **Code:** `tsc` passes. eslint on `MK2/` has 0 errors and 18 warnings. `vite build` passes.
- **Generators:** no failures across 312,000 Practice problems, 140,000 Test sittings and 1,800,000 Test questions.
- **Browser at 820×1180 with touch, speech stubbed:** the new round 3 walk passed 72 of 72.
- **Round 2 browser regression:** 84 of 90. The fixer reports that all 6 misses are old checks for wording or behavior that round 3 changed on purpose, and that the new walk covers the replacements.
- **One unexplained result:** "Practice pad beside its boxes" failed once at 768×1024, then passed on the rerun and in 12 of 12 normal-speed trials. The cause was not found.
- **Earlier in round 3:** the curriculum checker ran all 25 CFU miss ladders and timed one demo per unit at real speed. Both were on the code before the round 3 fixes.

## Skipped

- **C2-55:** the sticky unit bar can cover the top "Try one like it" button. It is shared code. The wrap-up's own button still works.
- **E1-08:** dash asides, covered by the rewrites.

## Still open

1. **Passing score and star bands.** Passing is now 28 of 30 (5 stars). Every Module Test uses one percent-based rule and passes at 5 stars (user, 2026-11-24).
2. **"Write another way":** a first repeat or 0 is a true answer, so it does not count as a wrong try and can still earn a star.
3. **Shared layout:** the sticky bar (C2-55), and the read-aloud toolbar can cover part of a long hint at 820×1180 until the student scrolls.
4. **Wording to hear in the manual pass:** "You have 0. Do you need more?" on `0 + ☐ = 3`, "That is all of them. Count one group." on Unit 3 CFU Q4, and "Show 3 fingers. Add none." on `n + 0`, which states the answer's number before a try.
5. **Old unit titles** remain in `plan.md` and `VISUAL_COMPONENT_TODO.txt`.
6. **Shared Test ending:** "Keep practicing — aim for 9 out of 10." *Aim* is a little hard for K.
7. **Not checked:** real iPad speech, touch and Safari, real students, dark mode for the new Unit 3 Q4 picture, and pacing at voice speeds other than Slow.

## Proposed rule changes (not applied; waiting for approval)

**Builder (`math-lab-builder.md`):**
1. When one Explore stepper's range depends on another, changing the first pulls the second into range.
2. Every generated choice is tested at 0 and at equal values: exactly one true sentence, and at least 2 buttons after duplicates are removed.
3. Two parts in the opposite order are not a different way to break a number apart.
4. A hand or finger picture draws each group on its own hand, matching the story.
5. A two-button pick can't reach Show me, so its first wrong tap must change the picture and teach the idea.
6. A hint can open before any try. A picture that reveals the asked-for part waits for a wrong try or Show me, and the hint's words must be true of what is drawn before a try. *(Raised in rounds 2 and 3.)*
7. When the picture is held back until a wrong try, a K–1 hint may use the student's fingers or counting on.
8. The brute-force script counts duplicate prompts in one Test sitting, including the Module Test. The target is 0.
9. A true answer that doesn't count (a 0, a repeat) must say it is true and why it doesn't count, and the second such try leads to help. A "write your own" step can't be passable by one answer that always works. *(Raised in rounds 2 and 3.)*
10. Check the Test's number pad at landscape iPad size (1180×820): every key is on screen without scrolling.
11. For a CFU with a second set, check the opening numbers of every Explore mode against that set's answers.

**English guidelines (`.claude/reference/english-for-math/`):**
12. `math-language-traps.md` §8: don't use a possessive on a number ("6's" is spoken "6 s").
13. `checklist.md` §4: when a compare template fixes the names, check that the named child really has more at every value.
14. `checklist.md` §3: prefer separate sentences to a shared noun after two numbers ("3 are blue. 1 is orange.").
15. `checklist.md` §2: check Explore lines at every stepper value, including the minimum and 0.
16. `checklist.md` §3: "the two numbers" is unclear on a screen that shows three. Name the numbers.

## Rule decisions (user, 2026-11-23)

- **Added:** 1, 2, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16. Rule 9 also says only flipping the order (4 + 1 after 1 + 4) never counts as a new answer (2026-11-24). Rule 16 also requires any stated count to match the items on screen.
- **Declined:** 3 (swapped parts; the user will handle cases as they come up), 4 (finger pictures; only useful at this level) and 7 (finger or counting-on hints; only useful in K–1).

## Next

A manual pass in the running app is still needed, with sound on, then a real student on a real iPad. Headless checks can't confirm iOS Safari speech, real touch feel, or how a young student actually uses the lab.

Reports are in this folder: `round-1-*.md`, `round-2-*.md`, `round-3-*.md`.
