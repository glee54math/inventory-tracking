# MG10 Adding & Subtracting Fractions: round 3 fixes (user request)

- **Lab:** MG10 `AddingAndSubtractingFractionsLab` (grade 5, 5.NF.1–2)
- **Round:** 3. This was a user request, not a review round.
- **Work order:** `round-3-user-request.md` (U3-01). C1-20 and C1-03 are still pending, and I didn't touch them.
- **Date:** 2026-11-07

## 1. Summary

**1 Fixed (U3-01) · 0 Partly fixed · 0 Needs decision · 0 Not fixed.**

Every fraction a student can see in MG10 is now stacked, the way it's written by hand: numerator, bar, denominator. A mixed number is the whole number followed by a stacked fraction. This covers text, choice buttons, tap options, answer chips, the test review list, captions and the number-line labels.

**Sweep result:** I walked 665 screens at iPad size and found **0** visible "a/b" texts. The screens were Home, every unit's Explore views, every CFU question (wrong, then right), every Practice type (3 draws each, with wrong, wrong + hint and Show answer on every step), every Unit Test (twice) and the Module Test (twice).

**Exception kept on purpose: none.** Scores are no longer written "9/10". They now read "9 out of 10", because a score isn't a fraction and shouldn't be stacked.

## 2. Item table

| ID | Status | What changed | Where |
|---|---|---|---|
| U3-01 | Fixed | **New:** shared opt-in `StackedFractions` provider and `MathText`. `MathText` stacks "3/4", "2 3/4" and "?/12" found in text at render time. The shared engine runs its text through it. MG10 turns it on. SVG labels use a new lab-local `SvgMath`. Typed tops sit over a printed denominator (`SentenceStep.overDen`, `BoxFrac`). Fraction dropdowns become tap buttons. Scores read "out of". | `shared/components/MathText.tsx` (new); `MG10_AddingAndSubtractingFractionsLab.tsx`; details in §3 |

**How it works.** `MathText` does nothing outside `<StackedFractions>`, so other labs look exactly as before. Inside the provider, it walks plain HTML elements and fragments. It joins neighbouring text, so JSX like `{n}/{d}` is read as "3/4". Each fraction becomes a `.frac-text` span. A screen reader names it "3 over 4", or "2 and 3 over 4" for a mixed number, and `data-tts-say` keeps the slash form for read-aloud. The matching:

- needs digits (or "?") on both sides of the slash, so "and/or", "km/h", dates and decimals are not touched;
- leaves "÷" alone;
- uses no lookbehind, because older iPad Safari can't parse it.

**How another lab turns it on:**

1. Wrap the lab's content in `<StackedFractions>`, inside the `lab-base` div.
2. Wrap the lab's own hand-written text (Explore, CFU, Key Idea, goals) in `<MathText>`.
3. Copy MG10's `.frac` / `.frac-text` CSS and its line-height rules.
4. Draw SVG labels with an SVG helper like MG10's `diagrams/SvgMath.tsx`. When a second lab needs it, promote it to `shared/`.

I recorded this in `MATH_TSX_STYLE_GUIDE.txt`.

**Choices I made beyond the work order:**

- **Dropdowns with fraction options become tap buttons** (`TapSelect`), because a native `<select>` can't draw a stacked fraction. This is only in the opt-in path and only when an option holds a fraction. In MG10 that is U5 CFU Q1 and Q4 and the U5 "Does it make sense?" benchmark step. Word dropdowns stay dropdowns.
- **U5 CFU Q2** used to make students type "1/2" into a plain box. Each box is now a written mixed number: a whole-number box, then a top box over a bottom box. The new `CfuBlank.mixedFraction` field does this, and it works like the Practice answer boxes. The question stays typed, so the fill-in rule still holds. The instruction text changed (see §4).
- **Number-line height.** BenchmarkLine labels are taller now, so the line moves down only when labels have to stack up to avoid each other.

## 3. Changed files

All paths are under `src/pages/math-levels/`.

**Shared.** Each change is a no-op outside `<StackedFractions>` or is a new optional field. Checked in MG9 and MG11 (§5).

- `shared/components/MathText.tsx` (**new**): `StackedFractions`, `MathText`, `StackedNumber`, `hasFraction`, `spokenFraction(s)`.
- `shared/engine/StepProblem.tsx`: wraps in `MathText` the title, story, prompt, hint, explain, Show me, feedback, answer chips, wrap-up, choice labels and sentence parts. Sentence select blanks become `TapSelect` when stacked and the options hold fractions. Adds `overDen` rendering and to `answerText`. **Affects every lab that uses StepProblem** (render only; it's inert without the provider).
- `shared/engine/UnitTest.tsx`: wraps the prompt and the review list (prompt, your answer, correct answer, explain) in `MathText`. Adds `overDen` to the student answer text. In opt-in mode, scores read "out of". **Affects every lab's tests** (inert without the provider).
- `shared/engine/types.ts`: new optional `SentenceStep.overDen`, and an optional 7th argument to `sentence()`.
- `shared/engine/controls.tsx`: `Frac` uses a "3 over 4" aria-label in opt-in mode. A `Frac` with a typed box inside gets no math label, so the box stays reachable. Outside opt-in it is unchanged ("3/4"). **Used by MG6, MG7, MG9, MG11, MM1.**
- `shared/components/CfuQuestion.tsx`: `MathText` on `render()`, good and bad feedback; `TapSelect` for fraction options when stacked; new optional `CfuBlank.mixedFraction`. **Used by MG9 FractionOperationsLab and MG10.**
- `shared/components/TapSelect.tsx`: option labels go through `MathText`. **Used by MG2–MG5 CFUs.**
- `shared/components/UnitPreviewCarousel.tsx`: the goal goes through `MathText`. **Used by every lab's home.**
- `shared/diagrams/PieceBars.tsx`, `shared/diagrams/MixedNumberBars.tsx`: the caption goes through `MathText`. **Used by MG9 FractionOperationsLab and MG10.**

**MG10:**

- `MG10/MG10_AddingAndSubtractingFractionsLab.tsx`: the `<StackedFractions>` wrapper; `MathText` on the hero h1, path goals, unit goal and Key Idea; TestBadge reads "Best test score: N out of M".
- `MG10/MG10_AddingAndSubtractingFractionsLab_styles.css`:
  - `.frac` is 0.88em (was 0.82em);
  - new `.frac-text` (mixed numbers stay on one line);
  - line-height 1.9 on text blocks that can hold fractions (1.8 on small goal text), so lines with fractions aren't taller;
  - fractions are 0.92em in small print;
  - new `.box-frac`, `.cfu-mixed` and `.sentence-over-den`.
- `MG10/AddingAndSubtractingFractionsLab/lib/steps.tsx`:
  - `M` is a single "2 and 3 over 4" for screen readers, with the same spacing as `.frac-text`;
  - new `BoxFrac`;
  - `rewriteStep` uses `overDen: [L, L]` (there is no "/L" text after the boxes any more).
- `MG10/AddingAndSubtractingFractionsLab/diagrams/SvgMath.tsx` (**new**): stacked SVG fraction labels.
- `MG10/AddingAndSubtractingFractionsLab/diagrams/BenchmarkLine.tsx`:
  - point labels and tick labels (½, 1½) are stacked;
  - the ring is centered on the stacked label;
  - the label lift step is 30 px, and the line height adapts;
  - the aria-label says "3 over 8".
- `MG10/AddingAndSubtractingFractionsLab/diagrams/RecutBars.tsx`: the caption goes through `MathText`.
- `MG10/.../units/WhyNotAcross.tsx`, `CommonDenominators.tsx`, `AddSubtractUnlike.tsx`, `MixedNumbers.tsx`, `WordProblems.tsx`:
  - Explore and CFU are wrapped in `MathText`;
  - CFU boxes inside fractions use `BoxFrac`, so "{box}/6" is now a box over 6;
  - Key Idea and Explore mixed numbers use `M` (5 19/12 = 6 7/12; 5 1/4 = 4 5/4; 1 5/12);
  - the U4 borrow sentence uses `overDen`;
  - U5 CFU Q2 uses `mixedFraction` blanks.
- `MG10/.../units/CommonDenominatorsTest.tsx` (rewrite both) and `MixedNumbersTest.tsx` (borrow rewrite) use `overDen`. The Module Test gets this through the same generators.
- `MATH_TSX_STYLE_GUIDE.txt`: a new convention paragraph.

## 4. New or rewritten student text

| Where | Text |
|---|---|
| U5 CFU Q2 instruction | Old: "Type 0, 1/2, or 1 in each box." New: "Write 0, 1/2, or 1 in each set of boxes. Leave a box empty if you don't need it." |
| Shell TestBadge | "Best test score: {n} out of {total}" (was "{n}/{total}") |
| Test results (opt-in labs only) | "{score} out of {n}" and "Keep practicing — aim for {pass} out of {n}." (was "/") |
| Screen-reader names (not shown) | Box over a printed bottom: "First/Second blank, the top of a fraction over {den}". `mixedFraction` boxes: "{label}: whole number / top / bottom". Fractions: "3 over 4", "2 and 3 over 4", "blank over 12". |

No other wording changed. Every other sentence is the same text, now drawn with stacked fractions.

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | **Pass** (0 errors, run after the last edit) |
| `npx eslint` on MG10 + `shared/components`, `shared/engine`, `shared/diagrams` | **Pass**: 0 errors. 36 warnings, all of the existing `react-refresh/only-export-components` kind. The new MathText.tsx adds 4 of these, because it exports helper functions next to its components. |
| `npx vite build` | **Pass**. Only the existing warnings (historicalProgressService dynamic import, chunk size). No per-import warnings. |
| Test / unit import check | **Pass**. No new imports between a unit and its Test file. |
| Brute force (`scratchpad/mg10-r3-fix/brute.mjs`: the real MG10 code bundled with esbuild and rendered through `<StackedFractions><MathText>`) | **Pass, 0 problems in 7,102,138 rendered strings and nodes.** See the list after this table. |
| `english-check.cjs --grade 5` on the 5 unit files, the shell and UnitTest.tsx | **Pass**: 183 strings, 0 over the limit. The 3 flags are the same old ones from round 2 (U3 passive, "left over", "difference between"). The new U5 CFU Q2 instruction isn't flagged. |
| **Automated "no visible a/b" sweep** (iPad 820×1180, touch, temporary harness, now deleted) | **665 screens, 0 hits.** See the list after this table. |
| Help-ladder walk | Every Practice type was walked wrong → wrong + hint → Show answer on every step, then "Try one like it". "Next problem" stayed locked after a helped solve, as before. Every CFU question was answered wrong (feedback shown, no answer given), then right ("good"). Each CFU unlocked Practice. MG10 has no read-aloud, so no speech log. |
| MG9 FractionOperationsLab and MG11 MultDivFractionLab render as before | **Pass.** See the list after this table. |

**What the brute force covered:**

- 3,000 draws per Practice bucket (all 5 units), 1,000 runs of every Unit Test and of the Module Test.
- Every title, story, prompt, hint, explain, Show me, choice, sentence part and select option, answer chip and wrap-up.
- `diagnose` messages for 60 × 15 wrong answers per fraction step and 80 per LCD step.
- Every `overDen` answer chip contains "{answer}/{den}", and no sentence part starts with "/".
- Every mixed number it found was listed by the word before it, and I read all 42 kinds. Each is a real mixed number ("walked 4 1/3", "= 1 9/30", "close to 1 1/2", "6. 1 1/2 is close…"). Nothing like "×" or a count got stacked by mistake.
- 4,000 BenchmarkLine renders, with 1–4 points, ranges up to 3–7 and labels up to "7 5/12". No SVG text has a slash, no label is outside the viewBox, and the aria-labels have no "a/b".

**How the sweep worked and what it covered:**

- In every visible element, the text nodes that sit next to each other are joined, because React splits `{n}/{d}` into 3 nodes. The joined text is tested for `[\d?]\s*/\s*[\d?]`, which is stricter than the work order's regex.
- A text run starting with "/12" right after a box is also counted, and so are a select's picked option and typed box values.
- Counts per screen are 0 everywhere:
  - Home: 2 screens
  - U1: 79 screens
  - U2: 99 screens
  - U3: 124 screens
  - U4: 110 screens
  - U5: 141 screens
  - Module Test: 104 screens (2 runs of 25 questions plus review, done in both sweep runs)
  - Per-screen counts are in `scratchpad/mg10-r3-fix/sweep-home1.json` and `sweep-2345m.json`.
- The only console error was a 404 for a missing favicon on the harness page. Earlier rounds had it too, and it isn't from this lab.

**MG9 and MG11 regression check:**

- On Explore, Practice and Test, neither lab has any `.frac-text` element.
- Their `Frac` aria-labels are still "5/6" and "2/3".
- MG9's CFU still uses its 8 native `<select>`s, with no TapSelect.
- Their slash text ("1/6", "4/5") is unchanged.
- No page errors. I looked at the screenshots `regress-mg9-*.png` and `regress-mg11-*.png`.

**Screenshots** are in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\c--Projects-inventory-tracking\6c39f246-04b5-4582-9603-1a614c7f0c61\scratchpad\mg10-r3-fix\shots\`, and I looked at each one listed here:

- `home.png`: the hero "½ + ⅓ = ⅚" is drawn stacked and large. This shot was taken before the line-height was scoped, which is why the path cards look airy.
- `u1-cfu-passed.png`: "½ = [3] over 6", stacked feedback.
- `u1-test-review.png`: stacked prompt, your answer and correct answer; "2 out of 10".
- `u2-p2-wrong1.png`: mixed rewrite, "6 1/12 = 6 [box] over 24".
- `u2-cfu-passed.png`
- `u3-p1-wrong1.png`
- `u4-cfu-passed.png`: "5 ¼ = [4] [5] over 4", whole box + top/bottom boxes.
- `u4-explore-add-carry.png`
- `u4-p2-end.png`: borrow chip "2 = 1 10/10".
- `u5-cfu-passed.png`: tap options 0 / ½ / 1, the `mixedFraction` boxes, the number line.
- `u5-explore-estimate.png`: 3 stacked labels plus "estimate", lifted with no overlap.
- **`u5-p3-wrong1.png` (choice row):** "1 4/5 − 4 1/2" mixed numbers in buttons; number line with "1 4/5" and "4 1/2".

No clipping or overlap. Lines with fractions are about as tall as lines without them, because text blocks now use line-height 1.9.

**Clean-up:** I deleted the harness (`__harness_mg10r3.html`, `src/__harness_mg10r3.tsx`) and stopped my dev server on port 5223. The scratch scripts are only in `scratchpad/mg10-r3-fix/`.

## 6. Noticed, not fixed

1. **Old dev servers are still running** on ports 5212, 5333 and one with `--host`. They're from earlier sessions and aren't mine, so I left them.
2. **The `PieceBars`, `MixedNumberBars` and `MultiplesList` aria-labels** still say "pieces of 1/12" and so on. They aren't visible, but a screen reader reads them as slash text. They are shared with MG9, so changing them would need an opt-in prop.
3. **Fractions in the Key Idea can wrap onto the next line by themselves**, for example "is close to / ½." This is normal text wrapping, but a non-breaking space before a final fraction would keep them together.
4. **Unit goals and the hero paragraph** use the normal line height. In unit 1 and unit 5 goals, a line with a fraction is a few pixels taller than one without. I only noticed it in small text.
5. **Unrelated layout, seen in full-page screenshots only:** the fixed unit rail covers part of the unit header. Earlier rounds' shots show the same thing.
6. **Still worth a manual pass on a real iPad** to check how stacked fractions look in iOS Safari, especially inside the tap options and the number-line SVG text.
