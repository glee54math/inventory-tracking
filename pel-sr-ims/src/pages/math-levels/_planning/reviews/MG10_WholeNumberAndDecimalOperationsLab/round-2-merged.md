# MG10 Decimal Place Value & Rounding — round 2 merged fix list

- Round 2 · 2026-11-15 · Inputs: `round-2-curriculum.md` (0 B · 0 Maj · 1 Min · 3 Pol; round-1 items 19/19 fixed), `round-2-english.md` (0 B · 0 Maj · 1 Min · 3 Pol; round-1 items 12/12 fixed)
- Decisions: Fix 8 · Skip 0 · Ask 0. No Blocker/Major this round → stop after these fixes (no round 3).

| ID(s) | Sev | Problem | Decision | Agreed change |
|---|---|---|---|---|
| C2-01 | Minor | Greatest-of-three (Test Q10, Module Q5) always lists the answer first and it's always the shortest; Test Q8 shorter is always bigger | Fix | Shuffle the listed order; about half the time a longer number is the greatest. Keep Q8's purpose (shorter-bigger trap) but vary order. Brute-force the splits. |
| E2-13 | Minor | "Write every place up to the tenths." — no "place"; "up to" can read as "at most" | Fix | "Write a digit in every place through the {place} place, even a 0." everywhere the line appears (Practice, Tests, CFU). |
| C2-03 | Polish | Test Q9 says to write every place but accepts 4.3 for 4.30 | Fix | Make Q9 two separate `roundStep`s (as in Practice) so place count is graded. |
| C2-02 + E2-15 | Polish | Carry wrap-up still "The 9 became 0 and the 1 carried to the left" | Fix | "The 9 became 10. You wrote 0 and added 1 to the place on its left." |
| E2-14 | Polish | Mixed-up expanded-form hint grammar; "1/10 is tenths" (also CFU Q2 message) | Fix | Rewrites per report ("1/10 means tenths"). |
| E2-16 | Polish | "In 7.264, which place is the 4 in?" | Fix | "In 7.264, name the place of the 4." |
| C2-04 | Polish | Explore builder stops at a one-digit whole part; Practice/Test use 2–3 digits | Fix | Let the Explore builder go up to 999 (hundreds, tens, ones), keeping the screen light. |
| E2 out-of-lane | Check | Some hints/messages may show fractions as slash text ("1/10") | Fix | Every fraction a student sees is stacked; convert any slash-text fractions in hints/messages to the stacked component. |

## Proposed rule changes (wait for Stage 6)
1. (curriculum) In "which is greatest/least" questions, shuffle the listed order and vary which kind of number (shorter or longer) is the answer.
2. (English) grade-5.md Watch for: "up to" in an instruction can mean "at most"; say "through the … place".
3. (from round 1) Tell students any required answer format in every graded question.
4. (from round 1) A bar or line picture zooms in when the difference it must show is tiny.
