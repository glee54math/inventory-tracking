# MG10 Decimal Place Value & Rounding — round 1 merged fix list

- Lab: MG10 `WholeNumberAndDecimalOperationsLab` (Units 1–2 only), Grade 5 · Round 1 · 2026-11-15
- Inputs: `round-1-curriculum.md` (0 B · 1 Maj · 5 Min · 2 Pol), `round-1-english.md` (0 B · 2 Maj · 7 Min · 3 Pol)
- Note: the lab has no read-aloud (Grade 5 convention; no TtsProvider/ReadAloud in the lab), so voice-only concerns (decimals read as "point", "?" spoken) don't apply.
- Decisions: Fix 18 · Skip 2 · Ask user 1 (answered → Fix)
- User decision (C1-01): **say it, keep requiring** — every rounding question says to write every place up to the place rounded to; 3.00 stays required.
- User principle: self-learning — Practice help may point strongly toward the answer but must not give the finished answer away immediately; Tests have little to no scaffolding.

Exact rewrites and line numbers are in the two source reports under each ID.

| ID(s) | Sev | Problem | Decision | Agreed change |
|---|---|---|---|---|
| C1-01 | Major | Test marks a right rounded value wrong for a missing trailing 0; questions never say to write every place | Fix (user) | Every rounding prompt (Practice, Test, Module Test, CFU) says "Write every place up to the {place}." (wording per English rules). Keep exact-place grading; keep the named "right value, wrong number of places" message in Practice. |
| E1-01 | Major | "the two tenths / two hundredths it is between" reads as 0.2 | Fix | "Find the {place} just below it and the {place} just above it." (per report) |
| E1-02 | Major | Rounding definition "the two numbers at that place it sits between" names no place | Fix | Rewrite in Explore and Key Idea per report, naming the place. |
| C1-02 | Minor | First-miss Compare help shows the chart with 0s filled (the typed answer) | Fix | First miss: chart lined up without the filled 0s (hint: "Line up the places. Fill the empty places with 0."). Second miss: fill the 0s. |
| C1-03 + E1-10 | Minor/Polish | Bars can't show a thousandths difference; "however many digits" sentence | Fix | Zoom the bars when the two numbers differ by less than 0.01 (label the zoom); reword the sentence per E1-10. |
| C1-04 | Minor | Expanded form whole part is always one digit; standard's example is 347.392 | Fix | Allow 2–3 digit whole parts in some expanded-form problems (Practice + Test), e.g. 347.392 = 3 × 100 + 4 × 10 + 7 × 1 + 3 × 1/10 + …; fractions stacked. |
| C1-05 | Minor | Expanded-form typed steps only copy digits | Fix | Make the typed expanded-form steps need work: give the expanded form out of order or with a missing place / zero digit, and ask for the decimal (or ask which digit goes with 1/100 when shown a different number). Keep CFU ≥ 40% typed and no copy steps. |
| C1-06 | Minor | "9 + 1 = 10" message can appear on a round-down problem | Fix | Only show the carry message when the problem rounds up through a 9. |
| E1-03 | Minor | "a 9 rounds up, it becomes 0" | Fix | Per report (add 1 to the 9 → 10, write 0, carry 1). |
| E1-04 | Minor | "a number's amount" | Fix | Per report. |
| E1-05 | Minor | Parenthesis asides ("the 4 (hundredths)") | Fix (readability only) | Rewrite asides into plain words where they add reading load ("the 4 in the hundredths place"); voice part doesn't apply. |
| E1-06 | Minor | "Write 0 there" names no place | Fix | Name the place. |
| E1-07 | Minor | "Thousandth need 3 digits" | Fix | Always plural place name in that message ("Thousandths need 3 digits after the point."). |
| E1-08 | Minor | Explore part 1 has too many new words on one screen | Fix | Per report (stage the words / split), without removing content. |
| E1-11 | Polish | Key Idea "More digits does not make…" | Fix | "Having more digits does not make a decimal greater." |
| E1-12 | Polish | CFU Q1 "Look at 7.264." then an unrelated second blank | Fix | Per report (separate lead-in for the second blank). |
| C1-07 | Polish | Practice can ask a problem that rounds to 0.0 | Fix | Exclude answers of 0 from generators. |
| C1-08 | Polish | No size picture of one thousandth | Fix | Add a small Explore picture (e.g. a hundredths square cut into 10 slivers) — keep the screen light (see E1-08). |
| E1-09 | Minor | "= ?" mid-sentence spoken | Skip | Voice-only; no read-aloud. Visually fine. |
| E1 voice proposal | — | Guideline for decimals read as "point" | Skip | No read-aloud in this lab; revisit only if read-aloud is added. |
| E1 out-of-lane | — | "Greatest of three" explanation says "the fewest digits" | Fix | Make the explanation true for every draw (compare place by place; don't claim fewest digits). Brute-force check it. |

## Proposed rule changes (wait for Stage 6)
1. (curriculum) Tell students any required answer format in every graded question.
2. (curriculum) A bar or line picture zooms in when the difference it must show is tiny.
