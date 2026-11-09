# MG10 — round 3 work order: user request (2026-11-07)

**From the user:** "All fractions need to look like the handwritten forms. I don't want to see '1/2'."

This is a user requirement, not a reviewer finding. It applies to **every fraction a student sees in MG10**: the numerator stacked over a fraction bar over the denominator, and mixed numbers as a whole number followed by a stacked fraction (2 ¾ written as 2 with 3 over 4, not "2 3/4").

## Item

| ID | Decision | Change |
|---|---|---|
| U3-01 | Fix | Render every fraction in MG10 as a stacked (handwritten-style) fraction everywhere a student can see it. |

## Where this applies (check them all)

- Practice: stories, prompts, hints, Show answer/explain text, wrong-answer feedback (including `diagnose` messages and the simplest-form message), wrap-ups.
- Choice buttons and dropdown or tap options (e.g. `A + B` operation choices, estimate choices, claim verdicts).
- CFUs: question text, options, feedback.
- Explore: all text, captions, the Key Idea, labels next to controls.
- Unit Tests and the Module Test: prompts, choices, the review list of answers ("your answer / correct answer").
- Diagrams: SVG labels on bars, number lines (BenchmarkLine), multiples lists, and any caption with a fraction. In SVG use two `<tspan>` lines plus a short `<line>` bar, or a foreignObject, whichever renders cleanly.
- The shell: home cards, unit goals and anything else with a fraction.

## How (guidance; follow the builder rules)

1. Look for an existing stacked-fraction component or a text-to-math renderer first (`Frac`, anything in `shared/engine`, MG9, MG11 or MM1 that already stacks fractions in text). Reuse it.
2. Prefer one shared way to turn fraction text ("3/4", "2 3/4", "{n}/{d}" templates) into stacked fractions at render time, so generated strings don't all have to be rewritten as JSX. Make it **opt-in** (e.g. a lab-level flag or a wrapper MG10 uses) so other labs look exactly as they do now. Record in your report how another lab would turn it on.
3. Don't turn things that aren't fractions into stacked fractions (dates, "and/or", unit rates like "km/h" if any exist). Things like "÷" stay as they are.
4. Inline stacked fractions inside sentences need a sensible size and line height, so lines don't jump or overlap at iPad size. The stacked form must also fit inside choice buttons and number-line labels.
5. Screen readers: a stacked fraction gets an accessible name like "3 over 4" (and "2 and 3 over 4" for mixed numbers), only in the opt-in path.
6. Typed answers: the `fraction` step's boxes are already stacked, so keep them as they are.

## Verify (in addition to the fixer's normal checks)

- **Automated:** in the browser harness at iPad size, open every unit's Explore, the CFU, every Practice problem type (with a wrong try, a hint and Show answer), the Unit Test and the Module Test. Assert that **no visible text node matches `\d+\s*/\s*\d+`**. Report the count per screen, which should be 0, and any exceptions you kept on purpose, with the reason.
- Screenshots of one screen per unit, plus a choice row and a number line with fractions. Look at them for layout problems (clipping, overlap, uneven lines).
- MG9 and one other lab that uses the touched shared files render as before.
