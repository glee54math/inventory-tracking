# MK2 Addition, Subtraction & Teen Numbers: round 2 merged fix list

- **Lab:** MK2 `AdditionSubtractionAndTeenNumbersLab` · Grade K, K–1 band · **Round:** 2 · **Date:** 2026-11-21
- **Inputs:** `round-2-curriculum.md` (0 Blocker, 9 Major, 7 Minor, 4 Polish) and `round-2-english.md` (0 Blocker, 3 Major, 9 Minor, 5 Polish)
- **Result:** all 37 findings are decided below. 36 are Fix or Fix in MK2 only; C2-55 is Skip (shared code, logged as open). All Ask user items are answered.
- **How to read this:** exact evidence and rewrites are in the two reports under each ID. Where they differ, **this file wins**.
- **Paths:** relative to `MK2/AdditionSubtractionAndTeenNumbersLab/units/` unless noted. "Shell" is `MK2/MK2_AdditionSubtractionAndTeenNumbersLab.tsx`.

## User decisions (2026-11-21)

| Item | Decision | What it means for the fix |
|---|---|---|
| **D4 · Add/take-away retry** (C1-12) | **Random story** | In Unit 2's add and take-away buckets, "Try one like it" draws an add **or** take-away story at random, and either one clears the retry. Star credit goes to the bucket actually solved. MK2 shell only. |
| **D5 · Stars after help** (C1-27 shared part) | **No star after a hint or any wrong try** | This is an **all-labs engine change and is NOT part of this MK2 fix round**. Do not edit `shared/`. It will be handled and logged separately. MK2 still gets its local picture fix in row 2. |
| **D6 · Unit titles** (E2-59) | **Rename** | "Put Together and Take Away" · "Story Problems to 10" · "Break Numbers Apart" · "Make 10" · "Fast Facts to 5" · "Teen Numbers". Unit ids stay, so progress is unaffected. |
| **D7 · Module Test stars** (replaces D3) | **User's table** | 28–30 = 5 · 25–27 = 4 · 22–24 = 3 · 19–21 = 2 · **10–18 = 1** · **0–9 = 0**. The user's explicit ranges decide the edge case at 10 of 30 (exactly 33.33%): it is **1 star**. |
| **D8 · Retry of partly done fixes** | **Fix all four** | Rows 1, 5, 12 and 13 below. |

**Pass score is not changed.** `passScore` stays 24 of 30, which is 3 stars. Keep the comments accurate.

## Constraints for the fixer

- Edit only `MK2/`, this lab's `vocabulary.md`, and write `round-2-fixes.md`. **Do not edit `shared/`** or another lab. If a fix needs a shared change, report it as Needs decision. Unrelated uncommitted work exists in MG5, `shared/components/NumberPad.tsx`, `shared/styles/lab-base.css`, `PracticeSessionPage.tsx`, `scripts/seedMathLabPlanningItems.mjs` and `src/components/Student_Portal_Design.txt`: leave it alone.
- The Module Test stays 30 questions, 5 per unit. D1 stays: how-many-more is only an optional Unit 2 challenge.
- Don't commit.

## Fix list

| # | ID(s) | Severity | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|---|
| 1 | C1-06 | Major | Practice in all units; `WordProblemsWithin10.tsx:349, 376–390` | A missed pick doesn't change the picture on 20 of 52 core steps; Show me can't open on two-button picks | Fix (D8) | Every step gets `pointing(help, i)`. Operation and sentence steps act out the story after the wrong tap: take-away fades the part leaving, add rings the new group. U2 compare rings the named row. U6 rings the ones. The picture change is the teaching on two-button picks. |
| 2 | C1-27 | Major | Units 1, 2, 3, 5 Practice; `DecomposingNumbers.tsx:209`; `PuttingTogetherAndTakingApart.tsx:308` | "Show hint" reveals the answer before any try | Fix in MK2 | Add a lab-local helper, true only for `help.step === i && (help.wrong > 0 \|\| help.showMe)`, and use it for every picture that reveals the asked-for part. A hint before a try speaks only. |
| 3 | C1-12 | Major | Unit 2 Practice; shell | Add/take-away answer is fixed within a retry | Fix (D4) | See D4. Verify in the script and browser that a retry can be either type, and that the star goes to the bucket solved. |
| 4 | C2-45 | Major | Units 3–6 Tests, Module Test | Same question twice in one sitting | Fix | Wrap each Test's list in this lab so a generator redraws when its prompt was already used in that sitting. Include all unit Tests and the Module Test. The script must assert 0 duplicates. |
| 5 | C1-11 | Major | `TeenNumbersTest.tsx:27–37`; Module Test; `TeenNumbers.tsx:58, 237` | Picture shows the answer as its own group | Fix (D8) | Test: no picture. Practice and CFU Q2: the full ten plus "?" where the ones go; ones come in after a wrong try. |
| 6 | C2-46 + E2-50 | Major | `OwnWay.tsx:26–31` | Number + 0 earns a star every time; a true swapped sentence hears only "Not a match" | Fix | If a box is 0: say "Put dots in both parts." Keep the boxes and don't count a miss. Same two numbers: "Yes, that makes 5. Use new numbers." and don't count a miss. Wrong sum: "That makes 6. Make 5." Must not also show the shared "Not a match" line. If it can't be hidden from inside MK2, report Needs decision. |
| 7 | C2-47 | Major | `DecomposingNumbers.tsx:238–243, 259` | Hint asks to move dots that can't move | Fix | After the first miss, draw a second row with the example split and no numbers. Hint: "Look at the new row. Count both colors." |
| 8 | C2-48 + E2-56 | Major | `FastFactsWithin5.tsx:199, 301, 333, 388–389` | Facts with 0 have no picture; hints name dots that aren't there | Fix | Dashed empty spot, pointer to it, big 0 on Show me. Hints: sum 0 "Are there any dots?" · n − n "Are any dots left?" · missing 0 "Are there any orange dots?", Show me "There are no orange dots. That is 0." · n − 0 "None went away." Let Explore's Missing number reach 5 + 0. |
| 9 | C2-49 | Major | All Tests, MK2 stylesheet `.atn-lab .test-question` | 6 keys off screen on landscape iPad | Fix | In landscape, picture and prompt on the left, box and pad on the right. All keys and Check visible without scrolling at 1180×820 and 1366×768. Re-check all 5 sizes. If it needs `shared/components/NumberPad.tsx`, report it. |
| 10 | E2-48 | Major | `WordProblemsWithin10Test.tsx:72`; `WordProblemsWithin10.tsx:78, 246, 416` | "1 orange marbles" | Fix (D8) | Use the E2-48 pattern at all four places, with `is`/`are` at 1. |
| 11 | E2-49 | Major | `DecomposingNumbers.tsx:100, 104, 375`; `DecomposingNumbersTest.tsx:130, 143` | *split* is untaught | Fix | Use the E2-49 rewrites. |
| 12 | E2-51 | Minor | `PuttingTogetherAndTakingApart.tsx:261` | "1 fingers" | Fix (D8) | Use `count()`. |
| 13 | E2-53 | Minor | `WordProblemsWithin10.tsx:68` | "He ate 2" | Fix (D8) | "He eats some. That leaves fewer." · "He eats 2. Those are gone." |
| 14 | C1-17 | Minor | `PuttingTogetherAndTakingApart.tsx:405–412` | Help moves fingers between hands | Fix | Keep each group on its hand; add the new finger to the next open spot. |
| 15 | C2-50 | Minor | Shell | Re-check doesn't start while the student stays in Practice | Fix in MK2 | When a re-check is due, the wrap-up's next button goes to Explore with a short "Let's check" line. MK1 and others are out of scope. |
| 16 | C2-51 | Minor | `MakingTen.tsx:213–217`; `TeenNumbers.tsx:281–285` | A pick repeats the answer just typed | Fix | Ask with a new number. |
| 17 | C2-52 | Minor | `MakingTen.tsx:54–57`; `FastFactsWithin5.tsx:30–33` | Re-check repeats answers | Fix | Unit 4 second set uses a true pair (7 and 3) and a true twin. Unit 5 second set uses 1 + 1, and Explore's Same two opens on 2 + 2 for that round. |
| 18 | C2-53 | Minor | `WordProblemsWithin10.tsx:255–258, 442` | Missing part's colors differ | Fix | Blue known, orange missing everywhere. |
| 19 | C2-54 | Minor | `WordProblemsWithin10.tsx:528` | Challenge Show me doesn't number the extras | Fix | Number the ringed extras one per second. |
| 20 | E2-52 | Minor | `PuttingTogetherAndTakingApart.tsx:247` | "Taking away leaves fewer" is false at 0 | Fix | At `b === 0`: "None went away: 6 − 0 = 6." |
| 21 | E2-54 | Minor | `FastFactsWithin5.tsx:22` | Pointer contradicts the demo | Fix | "Look here. Count all the dots." |
| 22 | E2-55 | Minor | `MakingTen.tsx:251` | "4 fills every box" | Fix | `${p} and ${shown} fill every box.` |
| 23 | E2-57 | Minor | `FastFactsWithin5.tsx:24, 84, 222` | Two names for one idea | Fix | "The two numbers are the same." |
| 24 | E2-58 | Minor | `PuttingTogetherAndTakingApartTest.tsx:162` | Story says "more" first | Fix | "5 dots. Add 2. More, or fewer?" · "5 dots. Take 2 away. More, or fewer?" |
| 25 | E2-59 | Minor | `title` in each unit | Long titles | Fix (D6) | See D6. Check MK2 for anything that matches on the old titles. Report any reference outside MK2. |
| 26 | C2-56 + English §5 | Polish | Units 1, 2 distractors | Sums past 10, impossible sentences such as "1 − 3 = 4" | Fix | Keep distractors within 0–10, and never subtract a bigger number from a smaller one. |
| 27 | C2-57 | Polish | `FastFactsWithin5.tsx:344–345, 399–400` | Picture reverts to an empty box | Fix | Show the finished fact. |
| 28 | C2-58 | Polish | Unit 2 Explore | "Nia" sounds like "Mia" | Fix | Use Zoe. |
| 29 | C2-59 | Polish | Unit 2 Practice and Tests | Name buttons aren't colored | Fix | Color them to match their rows, as the CFU does. |
| 30 | E2-60 | Polish | `TeenNumbers.tsx:177, 259, 263, 265`; `TeenNumbersTest.tsx:61, 142` | Lowercase sentence starts | Fix | Capitalize at sentence start; keep lowercase after "Listen:". |
| 31 | E2-61 | Polish | `WordProblemsWithin10.tsx:527, 541` | Challenge wording | Fix | "Mia has 5 stickers. Leo has 3 stickers." Explanation: `${count(extras, "extra", "extras")}.` |
| 32 | E2-62 | Polish | `WordProblemsWithin10.tsx:494–495` | "Count the dots by Jen." | Fix | "Count Jen's dots." |
| 33 | E2-63 | Polish | `PuttingTogetherAndTakingApart.tsx:107`; `FastFactsWithin5.tsx:69` | Long lines | Fix | Use the E2-63 rewrites. |
| 34 | E2-64 | Polish | Shell `:482` | "Subtraction" on the back button | Fix | "← Back". |
| 35 | English §5 | Minor | Unit 3 Explore demo | Demo walks through swapped pairs while Practice says they aren't a new way | Fix | The demo stops before pairs repeat in the other order. |
| 36 | D7 | Major | `ModuleTest.tsx` | Star bands changed by the user | Fix | Apply D7. Keep `passScore` 24. Correct the comments. |
| 37 | C2-55 | Minor | Shared layout | Sticky bar covers the top retry button | Skip | Shared code. Logged as an open item for the summary. |

## Verification the fixer must run

- `tsc`, eslint on `MK2/`, `vite build`.
- Brute force every Practice bucket and Test generator: everything from round 1, plus 0 duplicate prompts per Test sitting (all unit Tests and Module Test), no "1 + plural" including Explore at every stepper value, no `n + 0` pass on "write another way", no distractor past 10 or with a negative result.
- Check `moduleTestStars` at 0, 9, 10, 18, 19, 21, 22, 24, 25, 27, 28, 30.
- Browser at 820×1180 with touch, plus the pad at all 5 sizes including **1180×820** and 1366×768: a missed two-button pick in Unit 2, Show hint before a try in Unit 5 (no answer dots), a 0 fact, "write another way" with 0 and with a swapped pair, the D4 retry, and the re-check entry. Keep temp files in the scratchpad. Stop only servers you started. Do not touch port 5199.

## Proposed rule and guideline changes (for Stage 6, not applied)

**Builder (`math-lab-builder.md`):**
1. A two-button pick can't reach Show me, so its first wrong tap must change the picture and teach the idea.
2. `pointing()` is also true for a hint with no try. A picture that reveals the asked-for part must wait for a wrong try or Show me.
3. The brute-force script counts duplicate prompts in one Test sitting, including the Module Test; the target is 0.
4. A "write your own" step must say what it does with 0 and must not be passable by one answer that always works.
5. Check the Test's number pad at landscape iPad size (1180×820): every key is on screen without scrolling.

**English guidelines:**
6. `checklist.md` §3, Generated plurals: prefer separate sentences to a shared noun after two numbers ("3 are blue. 1 is orange.").
7. `checklist.md` §2: check Explore lines at every stepper value, including the minimum and 0.
8. `checklist.md` §3, Giveaways: when a true answer is rejected, the feedback must say it is true and why it doesn't count.
