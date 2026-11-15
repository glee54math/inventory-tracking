# MG10 Expressions & Patterns — build and review summary

- Lab: MG10 `NumericalExpressionsAndPatternsLab` ("Expressions & Patterns"), Grade 5, 5.OA.1, 5.OA.2, 5.OA.2.1 (CA), 5.OA.3
- Dates: 2026-11-14 to 2026-11-15
- Plan: `_planning/Grade-5/NumericalExpressionsAndPatternsLab/plan.md`, approved unchanged; slot MG10 (user's choice). User decision during review: Unit 3 gets a build-it step for 5.OA.2 "write".
- Agents: the project agents weren't registered in this session (opened at the repo root), so each step ran as a general-purpose agent that read and followed the matching `.claude/agents/*.md` file.
- Not committed.

## Build (round 0)
5 units (Explore, 4-question CFU gate, Practice, 10-question Test) plus a 25-question Module Test. tsc, lint, build, a 1,500-per-bucket brute-force run and an iPad-portrait Playwright pass all passed. New shared pieces (additive, optional): "factors" and "plot" step kinds, `FactorBoxes`, `shared/lib/factors.ts`, and MM1 RatioLab's first-quadrant plane promoted to `shared/diagrams/FirstQuadrantPlane.tsx` (MM1 re-exports it, unchanged).

## Review rounds
| Round | Curriculum | English | Merged | Fixed |
|---|---|---|---|---|
| 1 | 0 B · 5 Maj · 12 Min · 8 Pol | 0 B · 2 Maj · 11 Min · 6 Pol | 39 items (1 asked: build-it step → add) | 38 fully, 3 partly (prime look-alike pool can't grow; "green part" wording; plot grid feel untested) |
| 2 | 0 B · 0 Maj · 5 Min · 4 Pol | 0 B · 1 Maj · 7 Min · 5 Pol | 19 items | 19 |
| 3 | 0 B · 0 Maj · 2 Min · 3 Pol | 0 B · 0 Maj · 3 Min · 2 Pol | 10 items | 10 |

Main round-1 fixes: Unit 4 factor tree no longer shows the circled answer; Unit 3's "move the parentheses" pool no longer lets "look at the signs" work; Unit 3 typed steps no longer copy a number from the prompt; build-it step added (new shared "buildExpr" step); Unit 2 outlines only appear as help; "expression" defined in Unit 1; false "braces are worked out last" sentence removed; new steps for placing parentheses, "explain why" for patterns, and "which is NOT prime". Round 2's Major was a "wrong" choice that was a true statement in the Unit 5 why step. Round 3 made Ty's step independent, split Unit 3 Explore Part 2 into three modes, and tidied wording.

Skipped: nothing. Stopped after round 3 (no Blocker/Major in round 3, and the 3-round cap).

## Still open (small)
- Unit 3 CFU Q2 (`units/ReadingExpressions.tsx:68`) still says "The question asks how many TIMES as large" — should be "The blank asks…" (same as E3-36; noticed after the last merge).
- For "double it", 2 + (9 × 4) gets the "Double it" message instead of the parentheses-placement message — acceptable first nudge.
- Plot grid and factor-box touch feel are unverified on a real iPad.

## Rule and guideline changes (user-approved 2026-11-15)
- User principle added to `math-lab-builder.md` and `math-lab-curriculum-design-checker.md`: **self-learning** — Practice help may point strongly toward the answer (just not give it away immediately); Tests have little to no scaffolding and may require every practiced step. The proposed "help pictures must never contain the answer" rule was declined in favor of this.
- `math-lab-builder.md`: copy steps include numbers printed in the prompt; a two-way part of a build step counts as a pick; every wrong choice must be false; a prompt's key word also appears in a wrong choice; Test-absent scaffolds are help-only in Practice; standards' verbs (write/place/construct) are built, not just picked; always/sometimes/never pools include a surface-rule breaker.
- English: grade-5.md new words (term, rule, matching terms, prime factorization, factor tree) and "Find the value of…"; english-learners.md phrasal verbs and echo questions; checklist.md rows for false distractors, loaded "What is wrong?", switches, generated plurals/prepositions; `scripts/english-check.cjs` now flags `plural:` (a count that can be 1 before a plural noun) and `prep:` (fixed preposition before a pooled noun).

## Next
A manual pass in the running app, then a real student on a real iPad. Headless checks can't confirm real touch feel or how a 5th grader actually uses it.
