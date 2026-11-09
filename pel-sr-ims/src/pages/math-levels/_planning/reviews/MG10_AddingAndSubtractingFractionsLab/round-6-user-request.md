# MG10 — round 6 work order: user request (2026-11-09)

| ID | Decision | Change |
|---|---|---|
| U6-01 | Fix | Rework Unit 1's "[Name] added across" judge step into a reason the student builds from this problem's own numbers. |

## The user's words (paraphrased)

- It's fine that the add-across answer is always too small. That is the learning target: 1/2 + 1/3 = 2/5 can't be right, because 2/5 is more than 1/3 but less than 1/2, and adding can't make a smaller number.
- To make sure students understand it (and don't just learn to tap the same button), make the step a fill-in-the-blank with fractions, and/or choices for key words like greater/smaller. The logic stays the same, but the fraction being compared changes each time, so it's never "the same answer choice".
- Where the bigger fraction sits must be random (1/2 + 1/3 vs. 1/3 + 1/2), so a student on "Try one like it" can't learn a position.
- It is fine for a picture to show an earlier question's answer once the student has moved on to the next question.

## Behavior

1. **Replace the current judge step (all three of its forms)** with a sentence frame the student completes. Fractions stay stacked. For example:

   > Raj's answer, 2/5, is **[less / greater]** than **[1/2 | 1/3]**.
   > Adding should make a number **[bigger / smaller]** than each fraction you add.
   > So Raj's answer is **[too small / right / too big]**.

   - The fraction blank uses tap buttons showing this problem's two fractions, stacked. The right one is the bigger addend, so it changes from problem to problem.
   - You may split this into 2–3 short steps, or one step with several blanks (the multi-box rule: Check stays off until every blank is filled). Pick what reads best at grade 5. Keep each sentence within grade-5 length.
   - At least one blank should be typed or a fraction pick, not only a word pick, so it isn't a pattern tap (CFU fill-in spirit).
2. **Randomize positions.**
   - The order of the two addends in the problem, so the bigger fraction is first about half the time. Check this is true and report the split.
   - The order of the choice buttons in every blank.
   - Report how often the right fraction button is in each position.
3. **Feedback** (Practice only; Tests never help):
   - A wrong blank gets a short named message tied to that blank. For example: "Look at the bars: is 2/5 shorter or longer than 1/2?"
   - The existing picture comparing the add-across bar with the bigger fraction's bar is the hint picture.
4. **Apply everywhere the judge step appears:** Practice, the Unit 1 Test, the Module Test's Unit 1 questions, and Explore or CFU if they use it. The Tests use the same frame with no hints.
5. **Leave alone:** the pictures in the "which picture?" step, and the estimate step. Showing an earlier step's answer is fine (user decision).
6. **Builder rule:** the main session has already added "A learning target can have a fixed answer; the button can't" and "Pictures in choices" to `math-lab-builder.md`. Follow them.

## Verify

- tsc (`-p tsconfig.app.json`), eslint, build, and the grade-5 English script on the changed files.
- Brute-force the Unit 1 generators:
  - every blank's answer is correct;
  - the addend-order split;
  - the right-button position split for every blank;
  - the add-across value always lies between the two fractions.
- Browser at iPad size: Practice, the Unit 1 Test and the Module Test, with a wrong answer in each blank; 0 visible "a/b" texts.
- Constraints:
  - Another agent is fixing slash fractions in other labs right now (MG6, MG7, MG8, MG11, MM1 and score text in all labs). Don't touch other labs.
  - Re-read any shared file right before editing, and keep shared changes opt-in.
  - Stop your server and delete harness files.
  - No commit.
