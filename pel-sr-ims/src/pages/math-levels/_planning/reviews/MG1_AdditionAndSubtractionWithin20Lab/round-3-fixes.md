# MG1 Addition & Subtraction Within 20: round 3 fixes (final round)

- Round 3 · 2026-11-17 · Work order: `round-3-merged.md` (User decisions final). Grade band: K–1.
- Nothing committed. The temporary harness (`harness-r3.html`, `src/__harness_r3.tsx`) and the dev server are gone; scratch scripts stay only in the scratchpad.

## 1. Summary

**Fixed 15 of 15 rows · Partly fixed 0 · Needs decision 0 · Not fixed 0.**

- Three-button CFU picks now behave like the rest. The 2nd miss shows "Look here!" while all three buttons still work, and the 3rd miss shows the worked picture. This is a shared KCheck change, so it also applies to MG2; MK1–MK4 are unchanged.
- U6 Q2's twin is now false. Its equation pictures stay on one line on an iPad.
- A miss in the optional U4 challenge no longer locks the student into the challenge.
- I also made every agreed wording fix (E3-51 to E3-60).

## 2. Item table

| ID | Status | What changed | Where |
|---|---|---|---|
| C3-01 | Fixed (user decision 1) | `PickCheck`: `lockTried = !look \|\| showing` (was `!onTwin \|\| showing`). With a `look` pointer, a tried button stays tappable **and is not dimmed** until show-it, the same as the twin already worked. Then the tried ones lock and dim. Without `look` (MK1–MK4) a tried button locks at once, as before. *Difference from the curriculum report's sketch ("dimmed with the `tried` style"):* `.tried` is 45% opacity plus a line-through, which tells the child "not this one". That brings back the elimination the decision is meant to stop, so I followed the twin's look instead. | shared/components/KCheck.tsx:162 (+ doc comment ~:102) |
| C3-02 | Fixed | U3 Explore defaults are now start 3, change 6 (end 9). The Q3 pointer line now reads "Change missing? Start at 3. Count on to 9." and Q6's reads "…Start at 9. Take away 6." No U3 CFU answer is 3, 6 or 9 (the answers are end, 11, 5, change, start, 7). The `atf-story` line reads "3 + 6 = 9" (Q2's answer is 11). | AddToTakeFromWordProblems.tsx:180 |
| C3-03 | Fixed | `Num` takes `small` (112 px) and `Row` takes `nowrap`. U6 Q2, the Q2 twin and Q3 ask/wrong pictures use both. All 5 parts measured on one line at 820×1180 (row 500 px wide in a 520 px box). The 3-part show pictures keep 168 px. | EqualSignAndEquations.tsx:21, :35, :128, :155, :193 |
| E3-51 | Fixed | Show me: "Ben has 6. Lily has 3 more: 7, 8, 9." (compare bigger-unknown) and "Max has 2. Grace has 5 more: 3, 4, …" (challenge). | PutTogetherCompareWordProblems.tsx:536, :618 |
| E3-52 | Fixed | Type label "Challenge: tricky compare stories" (comment updated). | PutTogetherCompareWordProblems.tsx:644, :582 |
| E3-53 | Fixed | U4 Q2: "Jake has 6 cards. 2 are sports cards. The rest are animal cards. How many are animal cards?" Q3 is unchanged. | PutTogetherCompareWordProblems.tsx:82 |
| E3-54 + C3-04 | Fixed | Q2 praise: "Right! 2 + 3 is 5, not 6." Wrong-tap line: "Add up each side. Try this one." The twin is now "7 = 4 + 2. Is it true?" (No), with show "Watch: 4 and 2 make 6. 6 is not 7.", praise "Right! 4 + 2 is 6, not 7." and wrong line "Add up each side. Are they the same?". The twin's show picture is 7 = 6 (4 and 2). Q2's pointer is now `LOOK.scale` ("Look here. Add up each side."). The twin read-aloud no longer says "2.": in KCheck, `headRef` now sits on a span around the prompt (twin only) instead of a div around the whole head. | EqualSignAndEquations.tsx:143–176; KCheck.tsx:142, :164 |
| C3-05 | Fixed | U1 Q3: "3 + 7. Where do you start?" (7). Picture: marks 7 and 3; show line "Watch: start at 7. Count on 3: 8, 9, 10."; praise "Yes! Start at 7. It is bigger." The small number still comes first (the trap). The `cob-bigger` line (2 + 9) never prints 7. | CountingOnAndBack.tsx:92–103 |
| C3-06 | Fixed | The challenge has its own step-1 hint: "{B} has fewer. So {A} has more." (e.g. "Max has fewer. So Grace has more."). Step 2's hint was the same sentence, so it is now the action line "{A} has {d} more. Count on {d} from {s}.", which matches the bigger-unknown bucket. | PutTogetherCompareWordProblems.tsx:613, :617 |
| C3-07 | Fixed (user decision 2) | `handleHelped` returns early when the current draw's type is `optional`. No `owesRetry` and no sessionStorage debt, so the type switch stays open and "New problem" stays "New problem". "Try one like it" is still offered in the wrap-up, and there are still no stars. MG1 shell only: no other lab sets `optional`, so there was nothing to copy into the other four K–1 shells. | MG1_AdditionAndSubtractionWithin20Lab.tsx:216–225 |
| E3-55 | Fixed | U1 Q3 is now "3 + 7. Where do you start?" (with C3-05). U2 Q1 is "6 + 9. Which number do you break apart?". Both are still typed. | CountingOnAndBack.tsx:96; MakingTenAndDecomposing.tsx:97 |
| E3-56 | Fixed | CFU Q3 praise: "Yes! You can split 6 many ways." Practice wrap-up: "You can split {t} {items} many ways." Show me: "Start with {t}. Take away the {a} {partA}. The rest are {b}." and "{g} is/are {partA}. The rest is/are {n}. That is another way." | PutTogetherCompareWordProblems.tsx:104, :414, :446, :452 |
| E3-57 | Fixed | U3 title is "Add To and Take From Stories" (comments in the Test and Module Test updated). `levelSubsections.ts` doesn't show unit titles. | AddToTakeFromWordProblems.tsx:546; AddToTakeFromWordProblemsTest.tsx:7; ModuleTest.tsx:44 |
| E3-58 | Fixed | MG1 shell: "Do the check first. Then you can practice." | MG1_AdditionAndSubtractionWithin20Lab.tsx:303 |
| E3-59 | Fixed | "To take away, you can add. 12 − 8. Start at 8. How many more make 12?" | FluencyFactsWithin20.tsx:221 |
| E3-60 | Fixed | U6 Q1: "Which one is the same on both sides?" Each picture button's equation has `data-tts-say="6 is the same as 9"` (etc.). | EqualSignAndEquations.tsx:100, :56 |

CFU typed counts are unchanged: U1 4/5, U2 6/6, U3 3/6, U4 5/6, U5 3/4, U6 3/6 (24/33). CFU → Practice → Test mapping: U1 Q3 is still the "start at the bigger number when it comes second" idea (bucket and Test question unchanged). U6 Q2 is still a false "total first" sentence (`trueFalseTrap` / backwards-equation Test question unchanged).

## 3. Changed files

Shared (re-check, plus the labs listed):
- `shared/components/KCheck.tsx`: `PickCheck` only. (1) With `look`, tried buttons stay live and undimmed until show-it. **Affects MG1 and MG2** (MG2's 3 picks, all with `look`: Counting to 120 Q3, Comparing Numbers Q1 and Q4). (2) Twin only (MG1): the read-after-swap ref is on the prompt span, not a wrapping div. **MK1–MK4 are unchanged**: no `look`, so `lockTried` is always true and the head renders as before. MK1 has its own local KCheck.

MG1:
- `MG1/MG1_AdditionAndSubtractionWithin20Lab.tsx`
- `MG1/AdditionAndSubtractionWithin20Lab/units/`: CountingOnAndBack.tsx, MakingTenAndDecomposing.tsx, AddToTakeFromWordProblems.tsx, AddToTakeFromWordProblemsTest.tsx (comment), PutTogetherCompareWordProblems.tsx, FluencyFactsWithin20.tsx, EqualSignAndEquations.tsx, ModuleTest.tsx (comment)

Docs: `_planning/reviews/CFU_Pointer_Rollout/MG1_AdditionAndSubtractionWithin20Lab.md` (round-3 rows marked R3), `_planning/reviews/LAB_STATUS.md` (MG1 notes; Review cell left as is).

## 4. New or rewritten student text

CFU:
- U1 Q3 "3 + 7. Where do you start?" · show "Watch: start at 7. Count on 3: 8, 9, 10." · praise "Yes! Start at 7. It is bigger." (nudge/why unchanged)
- U2 Q1 "6 + 9. Which number do you break apart?"
- U3 Explore lines with the new defaults: "3 + 6 = 9. It went up. This is an Add To story." / "Change missing? Start at 3. Count on to 9." / "Start missing? Start at 9. Take away 6." (template unchanged)
- U4 Q2 "Jake has 6 cards. 2 are sports cards. The rest are animal cards. How many are animal cards?" · Q3 praise "Yes! You can split 6 many ways."
- U6 Q1 "Which one is the same on both sides?" · button speech "6 is the same as 9 / 6 / 3"
- U6 Q2 praise "Right! 2 + 3 is 5, not 6." · wrong "Add up each side. Try this one." · twin "7 = 4 + 2. Is it true?" (spoken "Is 7 the same as 4 plus 2?") · twin wrong "Add up each side. Are they the same?" · twin show "Watch: 4 and 2 make 6. 6 is not 7." · twin praise "Right! 4 + 2 is 6, not 7."

Practice / shell / Explore:
- U4 Show me: "{B} has {base}. {A} has {d} more: …" · "Start with {t}. Take away the {a} {partA}. The rest are {b}." · "{g} is/are {partA}. The rest is/are {n}. That is another way." · wrap-up "You can split {t} {items} many ways."
- Challenge: label "Challenge: tricky compare stories" · step-1 hint "{B} has fewer. So {A} has more." · step-2 hint "{A} has {d} more. Count on {d} from {s}." · Show me "{B} has {s}. {A} has {d} more: …"
- U3 title "Add To and Take From Stories"
- U5 Explore "To take away, you can add. 12 − 8. Start at 8. How many more make 12?"
- Shell "Do the check first. Then you can practice."

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | Pass (0 errors) |
| `npx eslint` on every touched file | Pass: 0 errors. 31 warnings, all pre-existing react-refresh warnings plus the shell's old unused-disable. |
| `npx vite build` | Pass. Only chunk-size warnings; no "does not provide an export". |
| Test ↔ unit import check | Pass. No `*Test.tsx` imports its unit; only ModuleTest imports Test files. |
| Brute force (esbuild bundle of U4; 12,000 draws per bucket × 8 buckets incl. the challenge = 96,000) | 0 failures: answers integers 0–20, no duplicate choices, the challenge step-1 hint is always the "fewer. So … more" line. Grammar read per template: "The rest is 1" / "The rest are 7", "Ben has 1 fewer crayon than Lily", no "{A} has {x} and {d} more" left. Other generators untouched (only constants and fixed CFU text changed). |
| `node scripts/english-check.cjs --grade 1` (shell + lab folder) | 515 strings, 19 flagged (round 3 review: 513/19). Same 19 earlier, accepted flags; task/after-answer 0% over. |
| Browser, iPad 820×1180, touch, speech stubbed | **U1 Q3** wrong 3, 3 → "Look here!" (lit `cob-bigger` "…For 2 + 9, start at 9…", said "Start at the bigger number.") → wrong 1 → show "Watch: start at 7. Count on 3: 8, 9, 10." → 7 praise. **U1 Q5 (3 buttons)**: miss 1 → 3 live; miss 2 → "Look here!" with **3 live**; miss 3 (re-tap 3) → show-it, the tried 3 and 5 lock; 4 → praise. **U3 Q3**: 11, 17 → "Look here!" lit `atf-missing-change` "Change missing? Start at 3. Count on to 9." **U3 Q4 (3 buttons)**: same 3-live / show-it walk. **U4**: Q2 and Q3 text as above. Challenge: wrong pick → hint "Max has fewer. So Grace has more."; the type bar stays enabled, "New problem" stays, no sessionStorage debt; switching to Mixed and to the other type works. **Mixed still locks after a wrong pick** (types disabled, "Try one like it", debt saved). **U5** Past 10 line as above. **U6 Q1**: 2nd miss → "Look here!" (`eq-balance`) with 3 live; 3rd → show-it. **U6 Q2**: Yes → twin "7 = 4 + 2", spoken "Add up each side. / Try this one. / Is 7 the same as 4 plus 2?" (**no "2."**); Yes → "Look here!" lit `eq-scale` said "Add up each side."; Yes → show "4 and 2 make 6. 6 is not 7."; No → "Right! 4 + 2 is 6, not 7." A first-try No → "Right! 2 + 3 is 5, not 6." **Q2, twin, Q3 pictures on one line** (all frame tops equal). Shell foot says "Do the check first. Then you can practice." |
| MK2 unchanged (Making 10, no `look`) | Q4 Yes/No: one wrong tap → "Yes" disabled + dimmed (as before). Q1 typed: 2nd miss → show-it, no "Look here". |
| MG2 (has `look`; new behavior by user decision) | Comparing Q1 (< = >): miss 1 → 3 live; miss 2 → "Look here!" (lit `u3-symbols`) with 3 live; miss 3 → worked picture, the tried = and > lock; < → praise, Q2 opens. |
| Console | No page errors. |

Screenshots (all looked at), in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\4a0a5ada-0427-4375-a535-7a7815b05751\scratchpad\r3fix\shots\`: u1-q3-show, u1-q5-miss2-lookhere, u1-q5-miss3-show, u3-q3-lookhere, u4-challenge-miss, u4-challenge-after-misses, u4-mixed-locked, u6-q1-ask, u6-q1-miss2-lookhere, u6-q1-miss3-show, u6-q2-ask, u6-q2-twin, u6-q2-twin-show, u6-q3-ask, mk2-q4-miss1, mg2-q1-miss2-lookhere, mg2-q1-miss3-show.

## 6. Noticed, not fixed

- In the headless run, the **first** feedback line after a wrong try was logged twice by the speech stub. This happened in MK2 too (untouched code) and on TypeChecks, so it isn't from this round. It is probably dev StrictMode or the stub's timing. Worth listening for on a real iPad.
- With tried buttons live, the last-tapped button keeps a dark focus outline (screenshot u6-q1-miss2-lookhere). It is harmless, but a child might read it as "chosen".
- After a helped solve in the optional challenge, StepProblem still greys "Next problem" (the student can use "Try one like it" or switch type). This matches the decision ("doesn't lock the student into it"). Opening "Next problem" too would mean a StepProblem change.
- The other lab shells still say "Complete the activity above to unlock practice problems." (MG1 only, per the merged list.)
- The CFU picture buttons' `data-tts-say` only matters for "Read all"; the question's speaker icon reads the prompt, not the buttons.
- Proposed builder rules (from both reports, not edited): `look` picks keep tried buttons live until show-it; a twin keeps the same answer as its question; Explore defaults include whatever a Look-here request switches to; CFU equation pictures fit on one line at 820 px; document `PickCheck` `twin` and `ProblemType.optional`.
- Carried over: real-iPad check (speech, touch, the round-2 "Target crashed" note), MG11's own sticky `.choice:hover`.
