# MG1 Addition & Subtraction Within 20 — review summary

- Lab: MG1 `AdditionAndSubtractionWithin20Lab`, Grade 1 (1.OA), 6 units + Tests + Module Test. Audience K/1st first-timers + behind 2nd graders, iPad, audio-first.
- Dates: 2026-11-16 (CFU pointer pilot) → 2026-11-17 (3 review rounds). Not committed. Agents ran as general-purpose agents following `.claude/agents/*.md`.
- First review of this lab (built before the workflow; no round-0 build report).

## Before round 1
- CFU "Look here" pointer pilot (early-grade variant) — approved by the user.
- Making Ten rule (user): always break apart the smaller number; the bigger is closer to 10; wording bigger/smaller. Fixed in U2 generators, Test, Explore steppers, CFU, Key Idea.

## Rounds
| Round | Curriculum | English | Merged | Fixed |
|---|---|---|---|---|
| 1 | 1 B · 17 Maj · 19 Min · 2 Pol | 2 B · 15 Maj · 11 Min · 4 Pol | Fix 58 · Skip 1 · 3 asked | 57/58 + 1 asked (C1-26) |
| 2 | 0 B · 1 Maj · 6 Min · 1 Pol | 0 B · 2 Maj · 9 Min · 6 Pol | Fix 25 · Skip 1 · 2 asked | 25/25 |
| 3 | 0 B · 0 Maj · 3 Min · 4 Pol | 0 B · 0 Maj · 4 Min · 6 Pol | Fix 15 · 2 asked | 15/15 |

Stopped after round 3 (3-round limit; round 3 had no Blocker/Major). Both round-3 verdicts: ready.

## User decisions
- R1: rebuild all 6 CFUs with KCheck (one question at a time) keeping the pointers; start-unknown stories stay a required Practice type with an Explore picture, 1 Unit Test item; "make your own split" not now.
- R2: "fewer means add" story → optional challenge type (no stars, not in Mixed/Tests); ☐ still read as "blank".
- R3: tried buttons stay tappable on picks with a pointer until show-it; no retry lock on optional types.

## Main changes
- CFUs: 33 one-at-a-time K questions, 24 typed (every unit ≥ 40%); 1st miss nudge, 2nd miss "Look here" (per part, persists until right), 3rd miss worked picture; no answer giveaways; no rule True/False; twins for Yes/No picks.
- Explore: no clamped/false math; totals ≤ 20; Steppers instead of sliders; new pictures (start/change/end "What is missing?", "Same total" mode, compare rows, equation box mode + Flip); defaults never show a CFU answer.
- Practice/Tests: pictures don't show the answer before a try; "Which one matches the story?" step; Show me teaches through the picture; Making Ten rule everywhere (bigger fills the ten); balanced answer positions; generators in range and grammatical at n = 0/1 (brute-forced).
- English: K–1 sentence limits met (english-check flags 290 → 19, all accepted); later-grade words replaced; right-way compare wording.
- Shared code (additive): KCheck `look` + `twin` + tried-buttons-live with `look`; `ProblemType.optional`; `lab-base.css` hover only on hover devices. MK1–MK4 verified unchanged; MG2 gets the tried-buttons-live behavior (user decision).

## Still open
- Real-iPad check: speech (feedback line spoken twice in headless runs — also in MK2, likely a dev artifact), touch, a "Target crashed" in long headless runs.
- With tried buttons live, the last tapped button keeps a dark focus outline (may look "chosen").
- After a helped solve in the optional challenge, "Next problem" stays grey (needs a shared `StepProblem` change); "Try one like it" / type switch work.
- Other lab shells still say "Complete the activity above to unlock practice problems."; MG11 has its own sticky hover rule.
- ☐ is read "blank" while text says "box" (user: leave it).

## Rule changes (user-approved 2026-11-17)
- Builder: ranges never clamp; strategy sandbox fits the strategy; bigger fills the ten everywhere; one right choice + derived-range checks; pointer with live choices; twin keeps answer type; Look-here spots never show answers; pointer 2nd / show-it 3rd; color by role; equation pictures fit one line at 820 px; document `twin` and `optional`.
- English: no rule True/False (+ mode-dependent lines true in every mode); word traps (take smaller from bigger, cross out, say = suppose, fewer as a label); english-check.cjs flags.
- Declined: praise/Show-me/3-sentence story wording; voice-matches-text check.

Reports: this folder (round-1..3 curriculum/english/merged/fixes). Pointer mapping: `../CFU_Pointer_Rollout/MG1_AdditionAndSubtractionWithin20Lab.md`.
