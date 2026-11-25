# MK2 Addition, Subtraction & Teen Numbers: round 3 merged fix list

- **Lab:** MK2 `AdditionSubtractionAndTeenNumbersLab` · Grade K, K–1 band · **Round:** 3 (last round the workflow allows) · **Date:** 2026-11-21
- **Inputs:** `round-3-curriculum.md` (0 Blocker, 1 Major, 3 Minor, 2 Polish) and `round-3-english.md` (0 Blocker, 2 Major, 4 Minor, 2 Polish)
- **Result:** all 14 findings are Fix, merged into 12 rows. No Ask user items. No round 2 Fix row is still Not fixed.
- **How to read this:** exact evidence and rewrites are in the two reports under each ID. Where they differ, **this file wins**.
- **Paths:** relative to `MK2/AdditionSubtractionAndTeenNumbersLab/units/`.
- **Settled decisions still apply:** D1, D2, D4, D5 (pending all-labs engine change; not part of this round), D6, D7. `passScore` stays 24.

## How the hint conflict was resolved (rows 2 and 3)

Both checkers found that hints opened before a try describe a picture that isn't drawn yet. The curriculum report decides *what* is needed: the hint must be true before and after a try, and must not bring the answer dots back. The English report decides *how it's worded*, so its finger and count-on lines are used, with these changes:

- **Unit 3 same parts:** use "Make two groups. Make them the same." instead of "One for you. One for me. Keep going." It is the CFU's wording and adds no new phrase.
- **A take-away of 0:** keep "None went away." Never say "Put 0 down."
- **Singular at 1:** every generated finger line uses `count()`, such as "Show 1 finger."
- **Count-on lines are for a known part of 1 or more.** When a known part is 0 or the missing part is 0, use the 0 wording in row 3.

## Constraints for the fixer

- Edit only `MK2/`, this lab's `vocabulary.md`, and write `round-3-fixes.md`. **Do not edit `shared/`** or another lab. If a fix needs a shared change, report it as Needs decision. Leave unrelated uncommitted work alone, including any MK3 edits from another session.
- The Module Test stays 30 questions, 5 per unit. The Unit 2 challenge stays out of Mixed, stars and Tests.
- Don't commit.

## Fix list

| # | ID(s) | Severity | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|---|
| 1 | C3-60 + E3-68 | Major | `OwnWay.tsx:47–54`; `words.ts:29–31` | Repeats and 0 never lead to help, and the 0 line names an action the step doesn't have | Fix | First repeat or 0 in a problem: no miss. **Second such try in the same problem: also call `onWrong()`**, so the example row and then Show me can open. Keep the step's own line on screen. Wording: repeat "Yes, that makes 5. Use new numbers." · 0 with right sum "Yes, that makes 5. No 0 this time." · 0 with wrong sum "No 0 this time. Make 5." |
| 2 | E3-65 + C3-61 | Major | `PuttingTogetherAndTakingApart.tsx:354, 406, 476`; `WordProblemsWithin10.tsx:371`; `DecomposingNumbers.tsx:319, 357, 390` | A hint before a try leads to a wrong count | Fix | Use the E3-65 table, with the changes above. |
| 3 | E3-66 + C3-61 | Minor | `WordProblemsWithin10.tsx:433`; `DecomposingNumbers.tsx:254, 309`; `FastFactsWithin5.tsx:320, 352, 387, 409`; `TeenNumbers.tsx:243, 244, 270` | A hint before a try names dots that aren't drawn | Fix | Use the E3-66 table. Keep "Are there any dots?" (0 + 0) and "None went away." (n − 0). Missing number is 0: "You have 3. Do you need more?" |
| 4 | E3-67 | Major | `FastFactsWithin5.tsx:327` | "Are the two numbers the same?" under a card showing two matching numbers | Fix | `Are ${a} and ${b} the same?` |
| 5 | E3-69 | Minor | `OwnWay.tsx:11`; `DecomposingNumbers.tsx:263` | Hint goes stale; "two new numbers" is false when 2 + 2 is the only way | Fix | Before a miss: "Find a new way to make 5." After a miss the hint must change to "Look at the new row. Count both colors.", even if already open. Do it inside MK2. If it can't be, report Needs decision. |
| 6 | C3-62 | Minor | `FastFactsWithin5.tsx:118, 132–133` | Re-check asks 1 + 1 while Explore shows it | Fix | Use `startFor` for Add, including the first `useState`. The second round opens on 1 + 3. |
| 7 | C3-63 | Minor | `DecomposingNumbers.tsx:104–105` | CFU Q4 nudge has no picture change | Fix | In `wrong` mode, draw the 8 dots as 4 and 4 in one color with a gap. Say "Look: two groups. Count one group." |
| 8 | E3-70 | Minor | `DecomposingNumbers.tsx:170` | "There are many ways." at Number 2 | Fix | When `total === 2`: "Try a bigger number." |
| 9 | C3-64 | Polish | Unit 6 Test | Same teen number in two forms in 30.6% of sittings | Fix | Draw the "how many ones" items from different teen numbers. Include the Module Test if it is affected. |
| 10 | C3-65 | Polish | `withZeroSpot` in Unit 5 | Dashed 0 spot sits far from the dots | Fix | Size the dots' wrapper to the dots. |
| 11 | E3-71 | Polish | `WordProblemsWithin10.tsx:390, 416` | Blue and orange crackers | Fix | Draw these color stories from stickers, crayons, marbles, balloons and blocks. |
| 12 | E3-72 | Polish | `WordProblemsWithin10.tsx:161, 268` | Two wordings for equal rows | Fix | "They have the same number." in both places. |

## Verification the fixer must run

Round 3 is the last review round, so no checker will re-read these fixes. Verify them carefully:

- `tsc`, eslint on `MK2/`, `vite build`. If a build error comes only from another session's MK3 work, say so and confirm MK2 separately.
- Brute force every Practice bucket and Test generator: all earlier assertions, plus no "1 fingers", no "Put 0 down", no "Start at 0", every generated hint true of the picture drawn **before a try**, and no teen number asked twice in a Unit 6 Test sitting.
- `moduleTestStars` at 0, 9, 10, 18, 19, 21, 22, 24, 25, 27, 28, 30.
- Browser at 820×1180 with touch: the whole `OwnWay` ladder (first and second repeat, 0, wrong sum, example row, Show me, hint changing while open); hint before a try in Units 1, 2, 3, 5, 6; Unit 3 CFU Q4 `wrong` picture; Unit 5 re-check opening on 1 + 3; the D4 retry; the Unit 2 Challenge's numbered extras. Re-check the Test pad at 1180×820 and 1366×768.
- Keep temp files in the scratchpad. Stop only servers you started. Do not touch port 5199.

## Proposed rule and guideline changes (for Stage 6, not applied)

**Builder (`math-lab-builder.md`):**
1. A true answer that doesn't count (a 0, a repeat) must still lead to help: on the second such try, treat it as a wrong try so the picture and Show me can open.
2. A hint can open before any try, so its words must be true of the picture drawn before a try.
3. For a CFU with a second set, check the opening numbers of every Explore mode against that set's answers.
4. When the picture is held back until a wrong try, a K–1 hint may use the student's own fingers or counting on instead of pointing at the picture.

**English guidelines:**
5. `checklist.md` §3, Text vs. picture: read each Practice hint against the picture before any try.
6. `checklist.md` §3, Text vs. picture: "the two numbers" is unclear on a screen that shows three. Name the numbers.
