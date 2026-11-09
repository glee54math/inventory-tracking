# MG10 — round 4 work order: user request (2026-11-07)

**From the user:** students may not know they should leave the whole-number box empty for an answer like 3/4. Instead, add three buttons the student toggles between: **whole number**, **mixed number**, **proper fraction**. The chosen button sets the answer boxes. If the answer is wrong, say whether the chosen *form* was right or wrong, in addition to the answer being wrong.

## Item

| ID | Decision | Change |
|---|---|---|
| U4-01 | Fix | Add an answer-form toggle to MG10's fraction answers, with form feedback. |

## Behavior

1. **Three tap buttons above the answer boxes:** "Whole number" · "Mixed number" · "Proper fraction" (labels drawn with small stacked examples if that helps: 2 · 1 ¾ · ¾).
   - Whole number → one box.
   - Mixed number → whole box + stacked top/bottom boxes.
   - Proper fraction → stacked top/bottom boxes only.
2. **No form is picked at the start.** A default would give away the answer's form. The boxes appear once a form is picked, and Check stays disabled until a form is picked and every shown box is filled (multi-box rule). Switching forms keeps whatever numbers still fit.
3. **Grading, with form feedback (the user's request).** On Check:
   - Right form + right value → correct (then the existing simplest-form check applies).
   - Wrong form → the form button is marked red, and the message says so, e.g. "The answer is not a mixed number. Is it more than 1, less than 1, or a whole number?". Don't name the right form outright on the first try; on a second wrong try it may.
   - Right form but wrong value → the form button is marked green and the boxes red: "Mixed number is right. Check the numbers."
   - An equal but unsimplified value or an improper fraction typed as a "proper fraction" → the existing simplest-form message ("That's equal, but it's not in simplest form…"), plus the form marking.
   - A wrong form or wrong value makes the solve not clean and triggers the same-type retry, as now.
4. **Where:** every step that uses the shared `fraction` step in MG10: Practice, CFUs that take a fraction answer (e.g. U5 CFU Q2), Unit Tests and the Module Test. In the Tests the toggle is there but no hints are shown (the Test never helps); the review list shows the form the student picked.
5. **Teach it once.** In Unit 3 Explore (the first unit where answers can be whole, mixed or proper), show the three forms with one example each and one sentence: "Before you type, pick the kind of answer: a whole number, a mixed number, or a proper fraction." Unit 1–2 answers that use the step get the same toggle.
6. **Shared code, opt-in.** Put this in the shared `fraction` step as an optional prop or lab-level setting that MG10 turns on, so MG9/MG11 and other users of the step are unchanged. Record how another lab turns it on (style guide + VISUAL_COMPONENT_TODO).
7. Write all new text to grade-5.md (and grade-4.md for read-alone). Fractions stay stacked (`MathText`/`StackedFractions`).

## Verify (in addition to the fixer's normal checks)

- Brute force over every generator: for every answer, the correct form is one of the three and it matches the value (whole, proper, or mixed with a proper fraction part). Check how often each form is correct per problem type; note any type where one form is always right (that's a giveaway worth reporting, not fixing now).
- Browser at iPad size: for one problem per type, try the wrong form, the right form with a wrong value, an unsimplified value, and the right answer; screenshot the feedback states. Confirm Check is disabled before a form is picked.
- Re-run the round-3 sweep: still 0 visible "a/b" texts.
- MG9 and MG11 unchanged.
