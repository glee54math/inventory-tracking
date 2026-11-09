# MG10 Adding & Subtracting Fractions — round 2 merged fix list

- **Lab:** MG10 `AddingAndSubtractingFractionsLab` (grade 5, 5.NF.1–2)
- **Round:** 2 · **Date:** 2026-11-06
- **Sources:** `round-2-curriculum.md` (0 Blocker, 0 Major, 3 Minor, 3 Polish; round-1 items 36 Fixed, 1 partly, 3 caused a new problem) and `round-2-english.md` (0 Blocker, 0 Major, 4 Minor, 4 Polish; round-1 items 22 Fixed, 3 caused a new problem)
- **Decisions:** 11 Fix (several combine both reports) · 0 Skip · C1-20 / C1-03 still pending the user
- **Stopping rule:** round 2 found no Blocker or Major, so this is the last fix round. No round 3 review.

## How the conflicts were settled

- **Unit 1 "which pieces?" step (C2-21 + E2-26):** The curriculum checker wants the skill shown in Explore plus a picture on a wrong try. The English checker wants "multiple" instead of "go into" (which is taught in Unit 2). Both are done: the Explore sentence and the hints use "multiple", and the multiples rows appear on a wrong try.
- **Unit 4 from-whole borrow step (C2-25 + E2-30 + English out-of-lane note):** the prompt from E2-30, the hint from C2-25, and a check that the help picture doesn't print the typed answer.
- **Wrong claims (C2-22 + E2-29):** the same root cause. Show wrong claims unreduced; reduce only the right claim.

## Fix list

| ID(s) | Sev | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|
| C2-21 + E2-26 | Minor | `units/WhyNotAcross.tsx:197-204, 254-268`; `units/WhyNotAcrossTest.tsx:156-157` | Unit 1's "which pieces?" skill isn't shown in Explore; the hint uses "go into" before Unit 2 teaches it; a wrong try gives no new picture | Fix | (1) In the Explore "Same-size pieces" view, add before "Cut both into …": "Why {pieces}? {L} is a multiple of both {d1} and {d2}: {d1} × {L/d1} = {L} and {d2} × {L/d2} = {L}." Leave it out when d1 = d2. (2) On `pointing(help, 0)` in Practice, show `MultiplesList a={d1} b={d2}` (no `showLcd`) above the bars. (3) Hints and explains in Practice step 1 and Test Q9: "Find a number that is a multiple of both {d1} and {d2}." / "{L} is a multiple of both {d1} and {d2}, so you can cut both bars into {pieces}." No "go into" or "LCD" in Unit 1. |
| C2-22 + E2-29 | Minor | `lib/fractions.ts:487-490` (`claimFor`); `units/WordProblems.tsx` explains | Wrong claims are shown reduced, so the named mistake can't be seen | Fix | Reduce only the right claim. Show add-across and kept-one-denominator claims exactly as the mistake makes them (e.g. 14/20, 28/10). Check verdicts with the same value. Re-run the balance check (each verdict 28–38%). |
| C2-23 | Minor | `lib/stories.ts`; `operationStep` in `units/WordProblems.tsx`; Test Q5–Q9 | "Which matches the story?" can be passed by keywords: "in total" always means add, and subtraction always names the bigger amount first | Fix | As in the curriculum report: vary the total wording, add a compare template without "more", and add stories that name the smaller amount first, so `B − A` (in story order) is sometimes right. Do the same in the Test through the shared `makeStory`. In the brute-force check, each operation choice should be right in some stories. |
| E2-27 | Minor | `units/AddSubtractUnlike.tsx:45` | Unit 3 CFU Q1 wrong-answer message states the LCD (box 1's answer) | Fix | Use the English report's rewrite. Since "go into" is taught in Unit 2, it's fine here in Unit 3. |
| E2-28 | Minor | `units/WordProblems.tsx:287` | Long, passive "Which matches the story?" hint that leaves out "more needed" stories | Fix | "Picture what happens in the story. Do two amounts go together? Or do you need the difference between two amounts?" |
| C2-25 + E2-30 + English note | Polish | `units/MixedNumbers.tsx:317-318`; Unit 4 borrow help picture | The from-whole borrow hint gives away box 2; "Write 6 with thirds" also fits 18/3; the help picture may show the typed answer after one wrong try | Fix | Prompt: "You need to take away 1/3. Borrow 1 whole from 6. Write 6 as wholes and thirds." Hint: "Take 1 from 6. How many wholes are left? Cut the 1 whole you took into thirds. How many thirds is that?" Check the borrow help picture after one wrong try: it may point (circle the whole being cut) but must not show the numbers the student is asked to type, until Show answer or the step is done. |
| C2-24 | Polish | Unit 5 Explore, Estimate mode | The first subtraction example (5/8 − 1/3 → estimate 0, exact 7/24) is a poor estimate | Fix | When the student switches to Subtract, set the fractions to 7/8 and 1/3. Also add: "The estimate is far from the exact answer here. Try fractions closer to 0, 1/2 or 1." when \|exact − estimate\| > 1/4. |
| C1-16 | Polish | `lib/fractions.ts:404-409` | The right estimate is usually the 1st or 2nd button | Fix | For an estimate of 0 or 1/2, pick a window at random so the right one is sometimes in the middle or last. Keep the choices in number order. Aim for each position to be right 20–45% of the time. |
| E2-31 | Polish | `units/WordProblems.tsx:306` | Vague estimate hint | Fix | "Find the benchmark for each amount. Then add or subtract them, like the expression you picked." |
| E2-32 | Polish | `MixedNumbers.tsx:251`, Key Idea, `WordProblems.tsx:489`, `WordProblemsTest.tsx:138`, `lib/fractions.ts:170` | "fraction parts" vs "fractions" for the carry condition | Fix | Use "fraction parts" in all five places. |
| E2-33 | Polish | `units/WordProblems.tsx:443` | Appositive in a wrap-up | Fix | Use the English report's rewrite. |

## Still pending the user

C1-20 + C1-03 (unit order and benchmark checks; recommendation **B**). See `round-1-merged.md`.

## Proposed rule and guideline changes (new this round, for wrap-up)

- Builder (C2-21): a new Practice step's skill must already be shown in that unit's Explore; hints use only words taught so far.
- Builder (C2-22): a wrong answer shown as someone's mistake is written exactly as that mistake makes it.
- Builder (C2-23): word-problem templates vary their wording and the order of amounts; a reversed-order choice must be right in some stories.
- `checklist.md` §3 (E): a reviewer's own rewrite gets the giveaway check too.
- `english-learners.md` (E): when a lab teaches a phrasal verb in one unit, earlier units use a known word instead.
