# MG1 Addition & Subtraction Within 20 — round 2 merged fix list

- Round 2 · 2026-11-17 · Inputs: `round-2-curriculum.md` (0 B · 1 Maj · 6 Min · 1 Pol; round-1 rows 50 fixed, 1 fixed-with-new-problem → C2-01), `round-2-english.md` (0 B · 2 Maj · 9 Min · 6 Pol; round-1 items 25 fixed, 6 fixed-with-new-problem → E2-34/35/36/37/38/47)
- Decisions: Fix 24 rows · Skip 1 · Asked user 2 (answered)
- Round 2 had Major items → after these fixes, round 3 (the last round).
- Exact evidence and rewrites are in the two source reports under each ID.

## User decisions (2026-11-17)
1. **C1-26 → optional challenge type.** Add "Ben has 3 fewer than Lily. Ben has 5. How many does Lily have?" (fewer → add, right-way story order) as its own Practice type in U4 that is NOT in `requiredBuckets`, not in mastery, not in the Unit Test or Module Test. Label it as a challenge in student-friendly words (e.g. "Challenge: fewer stories").
2. **E2-38 → leave it.** The voice keeps reading ☐ as "blank"; no change to shared `mathSpeech.ts`, no MG1 overrides.

## Fix list (Major → Polish)

| ID(s) | Sev | Problem | Decision | Agreed change |
|---|---|---|---|---|
| C2-01 | Major | Two-button CFU picks (U1 Q3, U2 Q1, U4 Q2, U6 Q1/Q2/Q4) leave only the right button after one wrong tap; pointer never shows; U6 picks always "same"/"Yes" | Fix | Per C2-01: U1 Q3 and U2 Q1 become typed number-pad questions (type the number you start at / break apart). Drop U4 Q2; add a second typed "Now 5 are sports cards…" (wording per E2-34, no "Say"). U6 Q1 gets 3 picture choices. Make one of U6 Q2/Q4 false. Add an optional additive `twin` prop to `PickCheck` (only with `look`): after a wrong pick, a new-number twin question replaces it, so the 2nd-miss pointer and 3rd-miss show-it are reachable. MK1–MK4 unchanged (verify one). Keep ≥40% typed per unit. |
| E2-33 | Major | "Count back 1 times", "Say 1 numbers", "1 went away… add them back" | Fix | Singular helpers for every generated hint/explain; brute-force n = 1 across Practice, Tests, Module Test. |
| E2-36 | Major | U3 "What is missing?" Explore lines say the subtraction backwards / give a different method from the nudge; one say line serves Q3 and Q6 | Fix | Explore lines use the picture's numbers in operation order and match the nudge ("Change missing? Start at 6. Count on to 11."); separate pointer targets/say lines for Q3 and Q6. Lines must be true in each mode. |
| C2-03a | Minor | U1 Look-here line "To take away 4, count back 4 times" = Q5's answer | Fix | Use 5 in that line (and its example). |
| C2-03b | Minor | U6 box-mode default finds Q5's answer (3) | Fix | Defaults 5 + 6 = 7 + 4 (or any non-CFU numbers). |
| C2-02 | Minor | U3 CFU pictures color by position, not role | Fix | Color start / change / end like the StoryStrip. |
| C2-04 | Minor | U3 Test "What is missing?" always "the change" | Fix | Vary the missing role across draws. |
| C2-05 | Minor | U2 Test break-apart pick always the first number; same-total pick always the smallest | Fix | Write the smaller number second about half the time; shuffle/vary the same-total answer position and size. |
| C2-06 + E2-40 | Minor | "Think addition" used on facts that don't cross 10; wording "Think addition" / "8 and what make 12?" | Fix | Use the think-addition step only on facts that cross 10; reword per E2-40. |
| C2-07 | Minor | Shared `.choice:hover` is the right-answer green, so a touched spot looks "chosen" on the next question | Fix | Wrap the hover rule in `@media (hover: hover)` (or a different hover color) in the shared CSS; check one MK lab and one older lab still look right. |
| C2-08 | Polish | U1 Test asks "How many times do you count back?" twice, answer in the prompt | Fix | Replace one with a typed count-back landing question. |
| E2-34 | Minor | "Say 3 are green" (say = suppose) | Fix | Drop "Say": "3 are green. How many are orange?" (U4 CFU, Practice, Test). |
| E2-35 | Minor | "Is there just one way?" | Fix | Moot if U4 Q2 is dropped (C2-01); otherwise "…to split them?" everywhere it appears. |
| E2-37 | Minor | "Which number does the story not tell?" | Fix | Per E2-37 (positive question). |
| E2-39 | Minor | "count up" vs "count on" | Fix | "count on" everywhere. |
| E2-41 | Minor | "Act it out" hints | Fix | Per E2-41. |
| E2-44 | Minor | U2 Same total "the other number", "goes the other way" | Fix | Per E2-44. |
| E2-48 | Minor | 14-word stars line | Fix | Per E2-48. |
| E2-43 | Polish | -ing clause; mid-sentence colon | Fix | Per report. |
| E2-45 | Polish | Three say lines don't match the need | Fix | Per report (keep: never state an answer). |
| E2-46 | Polish | Praise / Show-me wording | Fix | Per report. |
| E2-47 | Polish | U3 goal passive + relative clause | Fix | Per report. |
| E2-49 | Polish | "Work out", relative clause, "8 is the first side" | Fix | Per report. |
| E2-50 | Polish | Slashes and "Take Apart" in titles/labels | Fix | Per report (unit title changes also update `levelSubsections.ts`/shell if they show the title). |
| C1-26 | — | Fewer → add story | Fix (user) | User decision 1. |
| E2-38 | Minor | ☐ read as "blank" | Skip (user) | Leave it. |

## Verification the fixer must run
tsc, eslint, vite build; brute force (≥5,000 draws) every changed generator for n = 0/1 grammar, range ≤ 20, Making Ten rule, true/unique choices, varied answer positions; english-check grade 1; Playwright iPad-size pass of every changed CFU question including a wrong pick on each former two-button question (twin appears, pointer on 2nd miss, show-it on 3rd); confirm the new challenge type does not count toward stars/mastery; check one MK lab is unchanged (KCheck + hover CSS).

## Proposed rule changes (wait for Stage 6)
Carried from round 1 (see `round-1-merged.md`) plus round 2's proposals in each report (curriculum: two-button K checks need a twin or must be typed; Look-here spots and Explore defaults must not show any CFU answer; English: the four guideline additions in `round-2-english.md`).
