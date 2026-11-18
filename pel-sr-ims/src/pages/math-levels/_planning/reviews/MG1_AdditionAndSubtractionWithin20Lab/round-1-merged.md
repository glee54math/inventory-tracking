# MG1 Addition & Subtraction Within 20 — round 1 merged fix list

- Lab: MG1 `AdditionAndSubtractionWithin20Lab` (6 units, Tests, Module Test) · Grade 1 · audience K/1st first-timers + behind 2nd graders, iPad, audio-first
- Round 1 · 2026-11-17 · Inputs: `round-1-curriculum.md` (1 B · 17 Maj · 19 Min · 2 Pol), `round-1-english.md` (2 B · 15 Maj · 11 Min · 4 Pol)
- Decisions: Fix 52 rows · Skip 1 · Asked user 3 (all answered → see below)
- Exact evidence, line numbers and rewrites are in the two source reports under each ID. Where the curriculum checker decides *what* is shown and the English checker decides *how it is worded*, use the English wording.

## User decisions (2026-11-17)
1. **C1-04 → Rebuild all 6 CFUs with KCheck** (`shared/components/KCheck.tsx`: CheckSequence / TypeCheck / PickCheck — one short question at a time, a picture, number-pad typing, few-word feedback). This also carries C1-02, C1-03, E1-01 (CFU part), E1-03, E1-04.
   - **Keep the approved "Look here" pointers** in the rebuilt CFUs (early variant, `useCfuPointers` / `StuckBox early`, per part, after the 2nd miss of that part, persists until right).
   - **Miss order (my call, tell the user):** 2nd miss → the Look-here pointer; KCheck's "show it" (worked answer) moves to the **3rd** miss. No first-miss message states an answer.
   - ≥40% typed per unit (aim for ≥ half), no copy steps. Passed CFU stays open (cfuJustPassed). U6 may keep "Is it true?" with big Yes/No buttons under the equation (1.OA.7 itself).
   - Use the English report's E1-03 table for every question/feedback line, and the E1-01 one-example rewrites in place of the strategy True/False items.
2. **E1-11 → Start-unknown stories: keep as a required Practice type, taught with a new Explore picture (C1-20), and cut to 1 question in the Unit 3 Test** (replace the others with change/end-unknown items; Module Test: at most 1).
3. **C1-25 → Not now.** Keep giving one part; reword per E1-25.

## Fix list (Blocker → Polish)

| ID(s) | Sev | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|
| C1-01 | Blocker | U3 Explore `AddToTakeFromWordProblems.tsx:222` | Clamped result shows false math ("15 + 10 = 20", "3 − 10 = 0") | Fix | Add max = 20 − start, take-away max = start; remove clamps; use Steppers (C1-23). |
| E1-01 | Blocker | 4 CFUs, 6 unit Tests, Module Test | Long "True or false:" strategy statements | Fix | CFU: covered by the KCheck rebuild. Tests/Module: replace each with the one-new-example question in E1-01 (typed or 2–3 picks). 1.OA.7 equation T/F stays (E1-29). |
| E1-23 | Blocker | U4 `compareSmallerUnknown` Practice `:563`, Test `:203` | Wrong-way compare wording, required | Fix | Right-way wording per plan: "Grace has 9 toy cars. Max has 3 fewer than Grace. How many toy cars does Max have?" Hint "'Fewer' means Max has less." |
| C1-04 + C1-02 + C1-03 + E1-03 + E1-04 + C1-40 | Major | all 6 CFUs | All-at-once layout, 0% typed in 5 units, answers in wrong-answer feedback, long questions | Fix (user) | KCheck rebuild — see User decision 1. Also BondFill hints must not state a box ("9 needs 1 more" → "Count the empty boxes."). |
| E1-05 + Making Ten pointer | Major | U2 CFU Q1 `:188`; `LOOK.keep` | Nudge "Which number is closer to 10?" points to the wrong pick; the say line "Break apart the smaller number" + options labeled "(the smaller number)" give the answer | Fix | Options "6" / "9" (no labels); a picture with the 9 drawn as the bigger (C1-17 colors). First miss: "Not yet. Keep the bigger number whole." Pointer say: "Look here. Which number is closer to 10?" (asks, doesn't tell, and the options no longer name bigger/smaller). Keep the bigger/smaller rule wording in Explore and Key Idea. |
| C1-05 + C1-31 + E1 out-of-lane | Major | U4–U6 Practice, Tests, Module Test | Pictures show the answer before any try; fluency step 2 copies a printed number | Fix | Before help, draw only what is given (separate frames for a and b; no colored unknown part). Combined/colored picture comes via `pointing(help, i)` after a wrong try. Tests: given numbers only, or no picture for fluency facts. U5 step 2 asks sum − b or ☐ + a = sum. U5 hints say what to do ("Count on from the bigger number." / "Fill the ten first."). |
| C1-06 | Major | U2–U6 Practice | "Show me" only says "The answer is X" | Fix | Spoken `showMe` that teaches through the picture on each final step + `showMeHoldMs`; examples in the report. |
| C1-07 | Major | U3, U4 Practice | Student never picks the operation/equation | Fix | Add "Which one matches the story?" with 3 number sentences from this story's numbers (e.g. ☐ + 4 = 11 / 11 + 4 = ☐ / 11 − 4 = ☐), right one varies; keep steps ≤ 3 (merge with or replace the role step). |
| C1-08 + C1-23 + E1 out-of-lane | Major | U4, U5, U6 Explore (+U3) | Controls allow totals past 20; picture stops at 20; tiny range sliders | Fix | Each control's max computed from the others so totals ≤ 20; Steppers instead of range inputs; never pass a clamped value. |
| C1-09 | Major | U6, U4 Practice | Fixed right answers; U6 True/False bucket guessable | Fix | U6 T/F gets a typed "Add up the first side: ☐" step first; drop or vary the "= means" choice in Practice; "which part is missing" sometimes "the total"; U4 "more than one way" → typed "Say 3 are green…" (E1-25). |
| C1-14 | Major | U2 Practice | Bigger number never written second; never asks which to break apart | Fix | Write the smaller first half the time; add a first step "Which number do you break apart?" (big buttons, answer the smaller; hint "Keep the bigger number whole. It is closer to 10."). Frames in written order, ten always filled by the bigger. |
| C1-15 | Major | U2 Explore | Can build 6 + 2 (no ten) under "Making ten works every time" | Fix | Smaller min = 11 − bigger; subtract min = start % 10 + 1; gray out instead of rounding. |
| C1-16 | Major | U2 `equivalentSumProblem` | "Same total" never taught; step 3 copyable | Fix | Add Explore mode "Same total" (two bonds, "Move one over" button; line "Move one over. The total stays the same."). Step 3 → typed "7 + ☐ = 14" with a different first number. Use E1-06 words (no "addend/increase/decrease"). |
| C1-20 + E1-11 | Major | U3 Explore | Start/change-unknown never shown | Fix (user) | "What is missing?" toggle (Start / Change / End): missing frame dashed with "?", "Show" fills it by counting on. atf-missing pointer spot moves to this picture. Unit 3 Test: 1 start-unknown item only. |
| C1-21 + E1 out-of-lane | Major | U3 Test `:160, :207` | start = result + change reaches 25 | Fix | `change = randInt(1, Math.min(9, 20 - result))`. |
| C1-24 + C1-28 | Major | U4 Explore + Test | Compare drawn 3 ways; pointer lands on separate frames | Fix | Use `CompareRows` in Explore (showGap on, with a "Lily has 3 more than Ben" toggle) and Test (showGap off). |
| C1-29 | Major | U5 three-addends (Practice, Test, Module) | "Which two first?" often arbitrary / marks right answers wrong | Fix | Only triples with exactly one make-ten pair and no repeat; label by position or accept either order; no-ten triples get only the typed total. |
| C1-30 | Major | U5 Explore/Practice/Test | Making Ten rule broken outside U2 (8 + 9 explained by breaking 9; frames fill the first number) | Fix | `makeTenSpeedNumberQuestion` other ≤ nearTen − 1 (strictly smaller), explanation from the bigger number; frames fill the bigger number first (`splitAt={max}`); within-20 Explore default e.g. 8 + 5; make-ten coloring as U2; CFU Q4 pointer lands on a past-10 make-ten picture. |
| E1-02 | Major | U3/U4 Practice + Tests | "1 shells", "if 1 are green", "had 0 stickers" | Fix | Singular forms + is/are helper; add-to start ≥ 1. Brute-force every generator for n = 0/1. |
| E1-06 + C1-37 | Major | lab-wide | addend, sum, difference, equation, compute, strategy, decomposing, fluency, bridging, valid… | Fix | Replacement table in E1-06 (titles included: "Making Ten", "Fast Facts to 20", etc.). |
| E1-07 | Major | goals + Key Ideas | Long, dash asides | Fix | Use the E1-07 rewrites (U2 keeps bigger/smaller wording). |
| E1-08 + C1-22 | Major | U3/U4 role choices | Long options, two names for one idea, title gives the role | Fix | "What is missing?" with "the start / the change / the end" (U3) and "the total / a part" (U4); neutral title "Story problem"; Explore "Result:" → "End:". |
| E1-09 | Major | U3 Test `:264` | "did Nora found" every draw | Fix | Add `verbAddBase` to Test CONTEXTS. |
| E1-10 | Major | U4 `:186, :197` | Echo questions | Fix | "How many more crayons does Lily have than Ben?" etc. |
| E1-12 | Major | U6 vs U2/U3 | "left" = side and = remaining | Fix | U6 uses "first side / other side"; stepper labels per E1-12. |
| E1-13 | Major | U3 Explore `:294`, say `:30` | "Take away from the end" false in Take From mode | Fix | Line switches with mode per E1-13 (or moves onto the new C1-20 picture, still mode-true). |
| E1-14 | Major | U2 Test `:86` | "drop the ones digit" hint | Fix | "How many are past 10?" |
| E1-15 | Major | U6 | "sum" used two ways | Fix | "total" for the number; Test hint "The total can come first. Do both sides match?" |
| E1-16 | Major | pointer key lines U1/U3/U4/U5 | Look-here lines too long; cob-keep wrong in Count back | Fix | E1-16 rewrites. |
| C1-38 | Minor | U5 | 1.OA.4 never taught | Fix | Think-addition step in within-20 subtraction Practice + one Explore line; tag 1.OA.4. |
| C1-33 | Minor | U5 | 1.OA.2 three-addend word problems missing | Fix | Half of three-addend problems as short stories; tag 1.OA.2, 1.OA.3, 1.OA.6. |
| C1-34 | Minor | U5 CFU Q3 / Test | "Which is a within-10 fact?" classification | Fix | Typed within-10 fact under a picture (CFU via KCheck; Test likewise). |
| C1-10 + E1-18 | Minor | U1 Practice `:427, :444` | a = b gives "5 or 5?"; "number already given" | Fix | Reject a ≤ b; hint "Start at the bigger number."; explain "Start at 9. It is bigger." |
| C1-11 | Minor | U1 count-back choice | Answer is the number in the prompt | Fix | Typed "Say the numbers: ☐, ☐, ☐" (one box per count). |
| C1-12 | Minor | U1 Explore | No hop arcs | Fix | Pass hops in Explore. |
| C1-13 | Minor | U1 Show me step 2 | Draws all hops to the answer | Fix | Show hop count without the landing number. |
| C1-17 | Minor | U2 CFU Q1 | Colors reversed vs Explore | Fix | Bigger in tone a, smaller in tone b (in the KCheck rebuild). |
| C1-19 | Minor | U2 Explore | Number bond never introduced | Fix | "This is a number bond. The top is the whole. The two circles are its parts." |
| C1-26 | Minor | U4 | "fewer" never leads to adding | Fix | Add "Ben has 3 fewer than Lily. Ben has 5. How many does Lily have?" to the bigger-unknown pool. |
| C1-27 | Minor | CompareRows | 20 ungrouped counters | Fix | Gap after every 5th. |
| C1-32 | Minor | U5 Explore | Within 10 / 20 same screen; three-addends shows only total | Fix | Per report. |
| C1-35 | Minor | U6 Explore | Box / flip taught only in text | Fix | Box mode + "Flip" button; pointers land on them. |
| C1-36 | Minor | U6 | 1.OA.7/8 gaps | Fix | Add false sum = sum, subtraction equations to judge, ☐ − 3 = 5. |
| E1-17 | Minor | U1 | "cross out of the teens" | Fix | "You will go below 10." |
| E1-20 | Minor | U3 contexts | money, used up, shared, traded | Fix | Per E1-20 (stickers, rocks found/lost, etc.). |
| E1-21 | Minor | U3 hints | "The word 'more' already happened"; keyword talk | Fix | Per E1-21. |
| E1-24 | Minor | U4 say lines + hints | Subtraction said backwards; "In all" keyword | Fix | Per E1-24. |
| E1-25 | Minor | U4 both-unknown | "split" / "if … instead" / slash | Fix | Per E1-25 (one part still given — User decision 3). |
| E1-27 | Minor | U5/U1 | Parentheses/slashes/# silent or misread | Fix | Per E1-27. |
| E1-28 | Minor | U5 | "a:/b:/c:" labels, "pair" | Fix | "First / Second / Third"; "two numbers". |
| E1-30 | Minor | U6 | Balance scale with no scale; box vs blank | Fix | "= means the same as…"; "box" everywhere. |
| E1-31 | Minor | U6 hints | compute / assume / just happens to | Fix | Per E1-31. |
| E1-32 | Minor | shell | hero/mastery/cumulative lines | Fix | Per E1-32. |
| C1-18 | Polish | U2 Key Idea p2, CFU Q3, Test `:187`; rollout doc | "split the other addend" | Fix | "break apart the smaller number"; update `CFU_Pointer_Rollout/MG1_…md` rows changed this round. |
| E1-19 | Polish | U1 | "Even though 3 is written first…" | Fix | Per E1-19. |
| E1-22 | Polish | U3 titles | "they" for one person | Fix | Per E1-22. |
| E1-26 | Polish | U4 | "Which calculation…" | Fix | "Which one finds the answer?" |
| E1-29 | Polish | U6 | "Is 8 = 8 true or false?" | Fix | "Is this true?" + spoken "Is 8 the same as 8?"; "Yes, true" / "No, false". |
| C1-25 | Minor | U4 | Student never makes own split | Skip (user) | Not now; revisit when an any-answer check exists. |

## Verification the fixer must run
tsc, eslint, vite build; brute-force every changed generator (≥ 5,000 draws) for range ≤ 20, n = 0/1 grammar, Making Ten rule (smaller broken apart, everywhere), choice uniqueness; english-check grade 1; a Playwright iPad-size pass of each rebuilt CFU (one at a time, typed boxes, pointer after 2nd miss, show-it after 3rd, stays open after pass).

## Proposed rule changes (wait for Stage 6)
Curriculum (→ `math-lab-builder.md`): (1) Explore control ranges computed from the others, never clamp; (2) a strategy sandbox only builds cases where the strategy applies; (3) ten-frames past 10 fill with the bigger number in every unit/Test/explanation; (4) "which pair/first" choices only when exactly one option is right; (5) brute-force asserts range for derived numbers.
English (→ `english-for-math/` + script): (1) grade-1.md: no statement true/false about rules; ask one new example; (2) checklist: mode-dependent Explore lines must be true in every mode; (3) traps §3: "take the smaller from the bigger" word order; (4) traps §1: "cross out"; (5) english-check.cjs: did + past verb, `${n} are`, echo questions, don't flag equation T/F.
Plus (from this merge): when KCheck's show-it and the CFU pointer both apply, pointer on the 2nd miss, show-it on the 3rd.
