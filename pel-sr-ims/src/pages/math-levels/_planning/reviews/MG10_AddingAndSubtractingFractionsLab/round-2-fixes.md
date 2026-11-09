# MG10 Adding & Subtracting Fractions: round 2 fixes

- **Lab:** MG10 `AddingAndSubtractingFractionsLab` (grade 5, 5.NF.1–2)
- **Round:** 2. This is the last fix round, and no round-3 review follows, so I ran every check myself.
- **Work order:** `round-2-merged.md` (11 Fix rows). C1-20 and C1-03 were left alone because they are still waiting on the user.
- **Date:** 2026-11-07

## 1. Summary

**11 Fixed · 0 Partly fixed · 0 Needs decision · 0 Not fixed.**

- One follow-through change was needed. Once C2-22 showed wrong claims unreduced, a "kept the bottom" claim could name the right denominator. Example: 5/12 + 1/2 shown as 22/12 with "kept the bottom 12". `claimFor` now skips that claim when the first denominator is already the LCD.
- One estimate note: Short stories in the "left / more" bucket can only have estimates of 0, 1/2 or 1. With no negative numbers and the choices in number order, their right answer can be the last button only about 3% of the time. Overall, the right answer lands on each button 20–45% of the time. Details are in §5.

## 2. Item table

| ID(s) | Status | What changed | Where |
|---|---|---|---|
| C2-21 + E2-26 | Fixed | (1) The Explore "Same-size pieces" view now says why those pieces work: "Why {pieces}? {L} is a multiple of both {d1} and {d2}: …". It is left out when d1 = d2. (2) After a wrong try on Practice step 1, `MultiplesList a={d1} b={d2}` shows above the bars, with no ring and no LCD tag. It goes away on step 2. (3) The Practice step-1 hint and explanation, and the same pair in Test Q9, now say "multiple" instead of "go into". There is no "go into" or "LCD" left in Unit 1 student text. | `units/WhyNotAcross.tsx:209, 259-268, 274-275`; `units/WhyNotAcrossTest.tsx:156-157` |
| C2-22 + E2-29 | Fixed | Only the right claim is reduced now. Add-across claims are shown as (n1+n2)/(d1+d2), and kept-one-denominator claims as (n1·d2+n2·d1)/d1. The verdict is checked on the value shown. **Follow-through:** a kept-one-denominator claim is skipped when d1 is already the LCD (see §1). | `lib/fractions.ts:484-512` |
| C2-23 | Fixed | (1) The total questions vary: "altogether", "for both", "in total", "in the bag now". (2) A compare story with no "more" asks "How much lighter is the bag of beans?". (3) Four new stories name the smaller amount first: "How much shorter is X's ribbon?", "How much farther did Y swim?", "X has 1/3 cup of milk. A recipe needs …", and "X has walked … so far. She wants to walk … in total." "In total" and "now" each appear in both adding and subtracting stories. `Story.order` ("AB" / "BA") is passed to `operationStep`. Its three choices are always first + second, first − second and second − first, in story order, and in a BA story the right one is second − first. The Test gets the new templates through the shared `makeStory`. | `lib/stories.ts` (rewritten template block, `order`); `units/WordProblems.tsx:278-307` |
| E2-27 | Fixed | The English report's rewrite. It no longer states the LCD. | `units/AddSubtractUnlike.tsx:45` |
| E2-28 | Fixed | The agreed hint is in place. | `units/WordProblems.tsx:302` |
| C2-25 + E2-30 + English note | Fixed | The from-whole borrow prompt now ends "Write {w} as wholes and {pieces}." The hint now ends "Cut the 1 whole you took into {pieces}. How many {pieces} is that?" **Help picture:** after a wrong try on a borrow step, the picture stays as the start amount, rings the whole to borrow with a dashed outline, and adds the caption "Borrow this whole. Cut it into {pieces}." The borrowed picture (bw wholes + ba pieces) shows only once the step is done. This applies to both `subFromWhole` and `subBorrow`, because they share the visual and both showed the typed answers. | `units/MixedNumbers.tsx:317-320, 377-399`; `shared/diagrams/MixedNumberBars.tsx` (new optional `ringLastWhole`); `diagrams/MixedBars.tsx:15, 20` |
| C2-24 | Fixed | Switching to Subtract in Estimate mode sets the fractions to 7/8 and 1/3 (1 − 1/2 = 1/2; exact 13/24). After "Show the exact …", an exact answer more than 1/4 from the estimate gets "The estimate is far from the exact answer here. Try fractions closer to 0, 1/2 or 1." This replaces the old "not very close" line, and the cut-off is now the same 1/4 that Practice uses. | `units/WordProblems.tsx:163, 191-204, 258` |
| C1-16 | Fixed | The choices stay in number order and never go below 0. Where the right answer sits is now weighted: estimate 1/2 is 2nd 60% of the time; estimate 1 is 1st/2nd/3rd at 15/30/55%; 1 1/2 and up at 20/35/45%. An estimate of 0 can only be 1st. | `lib/fractions.ts:404-420` |
| E2-31 | Fixed | The agreed hint is in place. | `units/WordProblems.tsx:321` |
| E2-32 | Fixed | "Fraction parts" is now used in all five places (Explore already had it). | `MixedNumbers.tsx:251` (unchanged), `:427` Key Idea; `WordProblems.tsx:504`; `WordProblemsTest.tsx:138`; `lib/fractions.ts:170` |
| E2-33 | Fixed | The wrap-up is now three short sentences, with a pronoun from the person pool. | `units/WordProblems.tsx:458` |

## 3. Changed files

All paths are under `src/pages/math-levels/`.

- `MG10/AddingAndSubtractingFractionsLab/lib/fractions.ts`
- `MG10/AddingAndSubtractingFractionsLab/lib/stories.ts`
- `MG10/AddingAndSubtractingFractionsLab/units/WhyNotAcross.tsx`
- `MG10/AddingAndSubtractingFractionsLab/units/WhyNotAcrossTest.tsx`
- `MG10/AddingAndSubtractingFractionsLab/units/AddSubtractUnlike.tsx`
- `MG10/AddingAndSubtractingFractionsLab/units/MixedNumbers.tsx`
- `MG10/AddingAndSubtractingFractionsLab/units/WordProblems.tsx`
- `MG10/AddingAndSubtractingFractionsLab/units/WordProblemsTest.tsx`
- `MG10/AddingAndSubtractingFractionsLab/diagrams/MixedBars.tsx`
- **Shared:** `shared/diagrams/MixedNumberBars.tsx`. I added one optional prop, `ringLastWhole`. Only MG9 `FractionOperationsLab` (`AddSubtractFractions.tsx`, `AddSubtractFractionsTest.tsx`) and MG10 use this component. MG9 never sets the prop, so its rendering doesn't change.
- The Module Test changes only through the reused generators: Q22 (`sensibleQuestion`, unreduced claims), Q23 (`storyQuestion` "moreNeeded", which can now be a smaller-first story) and Q24 (mixed "sub" stories).

## 4. New or rewritten student text

| Where | Text |
|---|---|
| U1 Explore, Same-size pieces | "Why {sixths}? {6} is a multiple of both {2} and {3}: {2} × {3} = {6} and {3} × {2} = {6}." |
| U1 Practice step 1 + Test Q9 hint | "Find a number that is a multiple of both {d1} and {d2}." |
| U1 Practice step 1 + Test Q9 explain | "{L} is a multiple of both {d1} and {d2}, so you can cut both bars into {pieces}." |
| U3 CFU Q1 wrong | "Not quite. Find the smallest number both 3 and 4 go into. What do you multiply 3 by to get it? Multiply the top of 2/3 by the same number. Do the same for 1/4. Then add the new tops." |
| U4 from-whole borrow prompt | "You need to take away {1/3}. Borrow 1 whole from {6}. Write {6} as wholes and {thirds}." |
| U4 from-whole borrow hint | "Take 1 from {6}. How many wholes are left? Cut the 1 whole you took into {thirds}. How many {thirds} is that?" |
| U4 borrow help caption (picture) | "Borrow this whole. Cut it into {pieces}." |
| U4 Key Idea | "Do the fraction parts make 1 whole or more?" |
| U4 / U5 / Test carry hint, `mixedAddDiagnose` | "… Carry 1 whole if the fraction parts make 1 whole or more." / "The fraction parts make 1 whole or more. You forgot to carry 1 whole to the whole number." |
| U5 Explore far estimate | "The estimate is far from the exact answer here. Try fractions closer to 0, 1/2 or 1." |
| U5 "Which matches the story?" hint | "Picture what happens in the story. Do two amounts go together? Or do you need the difference between two amounts?" |
| U5 estimate hint | "Find the benchmark for each amount. Then add or subtract them, like the expression you picked." |
| U5 wrong-claim wrap-up | "The exact answer is {11/24}. It is close to the estimate, {1/2}. {Ana} said {2/11}, so {she} was wrong." |
| Stories (TOTAL) | "… How far did {she} walk altogether?" · "… How much flour did {she} use for both?" · "… They put the apples in one bag. How many pounds of apples are in the bag now?" (the "in total" reading story is unchanged) |
| Stories (COMPARE, new) | "A bag of rice weighs {A} pound(s). A bag of beans weighs {B} pound(s). How much lighter is the bag of beans?" · "{P}'s ribbon is {B} yard(s) long. {Q}'s ribbon is {A} yard(s) long. How much shorter is {P}'s ribbon?" · "{P} swam {B} mile(s). {Q} swam {A} mile(s). How much farther did {Q} swim?" |
| Stories (MORE NEEDED, new) | "{P} has {B} cup(s) of milk. A recipe needs {A} cup(s) of milk. How much more milk does {he} need?" (cup denominators only) · "{P} has walked {B} mile(s) so far. {He} wants to walk {A} mile(s) in total. How much farther does {he} need to walk?" |

The operation step's explanations are unchanged except that a total story names its amounts in story order.

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | **Pass** (0 errors) |
| `npx eslint` on all 10 touched files | **Pass**: 0 errors. The 12 warnings are all the existing `react-refresh/only-export-components` kind. |
| `npx vite build` | **Pass**. Only the existing warnings (historicalProgressService dynamic import, chunk size). No per-import warnings. |
| Test / unit import check | **Pass**. Units import their Test files; no Test file imports its unit. |
| Brute force (`scratchpad/mg10-r2-fix/brute.mjs`; the real unit and Test code bundled with esbuild; 12,000 draws per check, plus 136,800 picture renders) | **Pass, 0 failures.** Results below. |
| `english-check.cjs --grade 5` on all changed files | **Pass**: 0 strings over 20 words (174 strings). 3 flags. Two are old: the U3 passive "can both be divided by" and Test Q10's "which answer makes sense?". The new one is "difference between" in E2-28's agreed hint ("difference" is a grade-2 word, and the merge accepted this rewrite). At `--grade 4`, the only string over 18 words is the old U5 Key Idea, where the script joins sentences together. |
| Browser walk, iPad 820×1180 with touch, temporary harness (now deleted) | **Pass.** Every changed problem type was walked wrong, wrong, Show answer, finish, then "Try one like it". MG10 has no read-aloud, so I logged the feedback and hint text instead of speech. No page errors. One 404 shows up in the console; earlier rounds' walks had it too, and it isn't from this lab. |

**Brute-force results:**
- **Verdicts:** Practice: Yes 33.3 / too small 33.7 / too big 33.1%. Test Q4: 32.6 / 33.9 / 33.5%.
  - Every wrong claim is the raw mistake, and every "kept the bottom N" explanation matches the bottom shown, which is never the LCD.
  - Every right claim is in simplest form.
  - Test Q10 has no duplicate choices.
- **Which choice is right in "Which matches the story?" (story order):**
  - Total stories: first + second 100%.
  - Left / more stories: first − second 70.4%, second − first 29.6%.
  - Mixed-number stories: + 50.9%, first − second 39.8%, second − first 9.3%.
  - All three forms are right in some stories. The right expression always equals the typed answer, and no wrong choice equals it.
- **Key words:** "in total" and "now" each appear in both adding and subtracting stories.
- **Estimate button (1st / 2nd / 3rd):**
  - All callers together: 32.0 / 41.3 / 26.7%.
  - Short stories, both buckets: 35.9 / 43.0 / 21.1%.
  - Short "total" alone: 22.8 / 38.2 / 39.0%.
  - Mixed-number stories: 21.0 / 35.5 / 43.6%.
  - Test Q3: 35.1 / 43.7 / 21.2%.
  - Short "left/more" alone: 49.0 / 47.8 / 3.2%. Its estimates are only 0, 1/2 or 1, so this can't be balanced without negative numbers or breaking number order.
  - The choices are always in order and never below 0.
- **Pictures:** No picture prints a typed fraction answer before its step, with or without a wrong try.
  - Unit 4 borrow steps never draw "bw wholes and ba pieces" before the step is done, and with help they always show the dashed ring and its caption. This includes the wide-bar mode.
  - The Unit 1 multiples lists show only on a wrong try at step 1, with no ring and no LCD tag.
  - The LCD tag never appears before the LCD is typed.
- **All Unit Tests and the Module Test:** 1,500 runs each, with no duplicate choices.
- **Grammar:** I printed every template with a small amount and a mixed amount and read them all. Singular/plural, pronouns and story order are right in each.

**Browser walk findings (screenshots in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\6c39f246-04b5-4582-9603-1a614c7f0c61\scratchpad\mg10-r2-fix\shots\`; I looked at each one):**
- `u1-explore-same.png`: the new "Why sixths?" sentence reads well under the bars.
- `u1-p-s1-wrong1.png`: 1/2 + 1/9. After one wrong pick, the rows of 2s and 9s appear above the bars, with 18 in both rows. The second wrong try shows the new hint. Steps 2–4 and the wrap-up work, "Next problem" is locked, and "Try one like it" gives the same type.
- `u3-cfu-q1-wrong.png`: the new message doesn't state 12.
- `u4-fromWhole-borrow-wrong1.png`: 2 − 1 1/6. The two whole bars show, and the second has a violet dashed ring with "Borrow this whole. Cut it into sixths." No sixths are drawn, and the new prompt and hint read as agreed.
- `u4-borrow-borrow-wrong1.png` / `u4-borrow-borrow-shown.png`: 2 5/12 − 1 5/6. On a wrong try, the start amount shows with the ring. After Show answer, the borrowed bars appear ("We borrowed 1 whole and cut it into pieces.").
- `u5-explore-sub-default.png`: the Subtract default is 7/8 − 1/3, with estimate 1/2 and exact 13/24, "close". `u5-explore-sub-far.png`: 5/8 − 1/3 gives estimate 0 and exact 7/24, and the new far-estimate sentence shows.
- `u5-short-op-wrong1.png`: a smaller-first story ("Zoe's ribbon is 1/12 yard long. Leo's … 1/2 … How much shorter is Zoe's ribbon?"). The right choice is 1/2 − 1/12, the second listed amount minus the first.
- `u5-claim-small-end.png`: "Nora says 7/10 + 5/6 = 12/16 … Nora added across." The new wrap-up reads as agreed.
- `u5-claim-big-end.png`: this screenshot was taken before the follow-through fix (22/12, bottom 12 = LCD). Rerun: "Ana says 3/5 + 1/2 = 11/5 … kept the bottom 5". The brute force checks that a kept bottom is never the LCD.
- Mixed-number story: "Raj read for 4 1/6 hours … in total". The estimate choices were 6 1/2 / 7 / 7 1/2 with the right one last, and the "fraction parts" hint shows.

Clean-up: the harness (`__harness_mg10r2.html`, `src/__harness_mg10r2.tsx`) was deleted and the dev server stopped. The scratch scripts are in `scratchpad/mg10-r2-fix/` (nothing in `src/`).

## 6. Noticed, not fixed

1. **U3 CFU Q1 still gives box 1 away through its sentence frame.** The frame reads "The LCD is [ ]. 2/3 = [ ]/12 and 1/4 = [ ]/12", so the 12 is printed right next to the LCD box. E2-27 fixed the wrong-answer message, but the frame still shows the LCD. One option is to ask for the LCD before showing the second line.
2. **Short "left / more" stories:** the right estimate is the last button only about 3% of the time (explained in §5). The typed LCD and answer steps still stop a guesser from getting a clean solve.
3. **Mixed-number stories:** smaller-first order is right only about 9% of the time. Only the compare kind has smaller-first templates in that pool; more-needed isn't in the mixed pool. Adding "moreNeeded" to `mixedStoryProblem`'s kinds would raise it.
4. **"more" still appears only in subtracting stories** (compare and more-needed). It isn't a shortcut on its own, because many subtracting stories don't use it. A total story with "more" ("She read 1/3 hour more after dinner") would close it completely.
5. **U5 subtraction stories can still have an estimate of 0** (1 in 4 kept, as decided in round 1). Example from the walk: 1/2 − 1/3, "The estimate was 0".
6. **Unit 1 multiples list for 2 and 9:** the 2s row runs to 36 and wraps onto 2 lines. It is readable, but long. A `count` sized to the LCD would shorten it.
