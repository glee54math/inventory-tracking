# MK3 Measurement & Classifying: Round 3 fixes (final round)

- **Lab:** MK3 `MeasurementAndClassifyingLab`, 3 units + Module Test
- **Round:** 3 · **Date:** 2026-11-21 · **Band:** K–1, audio-first, alone on an iPad
- **Applied from:** `round-3-merged.md` (13 merged items: 11 Fix, 2 Skip)

## 1. Summary

| Status | Merged items |
|---|---|
| Fixed | 10 |
| Partly fixed | 0 |
| Needs decision | 0 |
| Not fixed | 1 (E3-68: it would show a CFU answer) |
| Skipped, as decided | 2 (C3-50 under D13, C3-54) |

Unit ids, routes, storage keys, bucket keys and saved progress are unchanged. No shared code was edited. Nothing was committed or staged. C1-09, C1-11 and the Standard line (D9) were left alone. The proposed rule and guideline changes were not applied.

**E3-68 was left unapplied, as the task required.** The "long" word picture draws a rod of **7 blocks**, and 7 is the answer to Unit 1 CFU Q4 ("How many blocks are under the train?"). Starting Explore on "long" would put that rod on screen above the question. It would not disturb any Look here spot, because the word area is outside them.

**Optional follow-up for E3-68 (recommended):** draw the "long" word picture with 6 blocks in `ObjectGlyph.tsx`, then start on "long". 6 is not a Unit 1 CFU answer and is already the size Explore uses for long objects. This also closes the smaller gap that exists today, when a child taps "long" before Q4. It changes a picture used in Practice and the Tests, so it was not done without a review.

## 2. Items

U1 = `DescribingHowObjectsAreMeasured.tsx`, U2 = `ComparingTwoObjectsDirectly.tsx`, U3 = `ClassifyingAndCountingByCategory.tsx`. Line numbers are for the code after these fixes.

| ID(s) | Status | What changed | Where |
|---|---|---|---|
| C3-50 | Skipped (D13) | No change. Logged as open | |
| C3-51 + E3-61 | Fixed | Q2's Look here opens elephant and mouse and lights "This big one is heavy." `u1-down` stays on example 0 | U1 `:172, :182–183` |
| C3-52 | Fixed | One neutral shape is drawn beside the shape word in the mixed-set prompts. It shows no count | `labParts.tsx:290`; U3 `:347`; U3 Test `:125` |
| C3-53 + E3-63 | Fixed | "We sorted by shape. You counted." | U3 `:453` |
| E3-62 | Fixed | Shape count lines say "1 triangle." / "3 triangles." Color and fewest/most lines are unchanged | `labParts.tsx:247`; U3 `:339, :350`; U3 Test `:125, :139` |
| E3-64 | Fixed | `explain: WORD_LINES[w]` | U1 `:446` |
| E3-65 | Fixed | Four first-wrong-tap reasons are now statements | U1 `:31, :32`; U2 `:76, :85`; U3 `:143, :152` |
| E3 note (U1 Q1) | Fixed | "Look at the scale. See which way it went." | U1 `:30` |
| C3-54 | Skipped | No change | |
| E3-66 | Fixed | "They start in different places. Count the blocks." | U2 `:116, :125` |
| E3-67 | Fixed | "See the arrow. This side went down." / "…went up." | U1 `:371` |
| E3-68 | **Not fixed** | See the summary | U1 Explore |
| E3-69 | Fixed | The three headings are wrapped in `ReadAloud` | Shell `:88, :101, :265`; styles `:137` |

### Differences from the agreed wording, and additions the fixes needed

The agreed wording was used everywhere. Two small additions were needed:

1. **The question mark sits inside the shape word's text.** With "?" in its own text piece, the voice said "How many triangles what number." `shapeWord` takes the ending so the voice says "How many triangles?"
2. **12 px under the Home and unit headings** (MK3 stylesheet only). Once the headings had speaker buttons, those buttons overlapped the goal's speaker button.

## 3. Changed files

All under `src/pages/math-levels/`. **No shared files; no other lab is affected.**

- `MK3/MK3_MeasurementAndClassifyingLab.tsx`, `MK3/MK3_MeasurementAndClassifyingLab_styles.css`
- `MK3/MeasurementAndClassifyingLab/units/`: `labParts.tsx`, `DescribingHowObjectsAreMeasured.tsx`, `ComparingTwoObjectsDirectly.tsx`, `ClassifyingAndCountingByCategory.tsx`, `ClassifyingAndCountingByCategoryTest.tsx`
- `_planning/Grade-K/MeasurementAndClassifyingLab/vocabulary.md` (update note; the shape picture now also sits beside the mixed-set prompt. No taught word was added, removed or renamed)
- This report

## 4. New or rewritten student text

**U1 CFU:** Look at the scale. See which way it went. · Heavy is hard to lift. · Look at the scale. The heavy side goes down.

**U1 Practice:** See the arrow. This side went down. · See the arrow. This side went up. · Word pick results now use: Long tells how long. · Short is a few blocks. · Tall is long, standing up. · Heavy tells how heavy. · Light goes up on the scale.

**U2 CFU:** The longer one goes past. · They start in different places. Count the blocks.

**U3 CFU:** Match them up.

**U3 Practice and Test:** {n} circle(s). · {n} square(s). · {n} triangle(s). · We sorted by shape. You counted.

**Shell (now spoken):** How long? How heavy? Which group? · Your path · {unit title}

## 5. Verification

| Check | Result |
|---|---|
| `tsc --noEmit -p tsconfig.app.json` | **Pass** |
| `eslint` on the 6 changed code files | **Pass:** 0 errors, 7 `react-refresh` warnings (the accepted pattern) |
| `vite build` (output outside the repo) | **Pass,** no import warnings |
| Test/unit import check | **Pass:** no Test imports its unit |
| Generators: 20,000 draws per bucket, plus unit and Module Tests | **Pass:** 0 failures |
| Shape count lines, 20,000 rounds of U3 Practice and Test | **Pass:** singular only at 1, every count matches its answer, no "The triangles have {n}" |
| English script, grade K | **Pass with notes:** 11 flags, none on new text. They are D11's agreed prompt and known false alarms |
| CFU walk, all 15 questions, 820×1180 touch | **Pass:** reasons correct, other button does not pass, Look here on the 2nd miss, demo on the 3rd, Practice unlocks, passed CFU stays open |
| U1 Q2 Look here | **Pass:** elephant and mouse, "This big one is heavy." lit (screenshot viewed) |
| Practice help walk, U1 and U3, every kind | **Pass:** no star on a helped solve, Next locked, Try one like it keeps the kind. Run before the heading spacing, which changes CSS only |
| Unit Tests, all 3 | **Pass:** no picture prints a count. Run before the heading spacing, which changes CSS only |
| Number pad at 1488×740, 1280×800, 1180×820, 1024×768, 820×1180 | **Pass:** clear of the picture on 3 typed Practice kinds and Test Q8, and clear of the new shape mark on the mixed-set Practice problem and Test Q8. Sample screenshots viewed |
| Headings at the same 5 sizes (Home and all 3 units) | **Pass:** no overlap, overflow, clipping or touching speakers |
| Heading and Test Q8 speech (speech stubbed and logged) | **Pass:** each heading is read; "We sort by shape. How many triangles?" |
| Dark mode, Test Q8 shape mark | **Pass** (screenshot viewed) |

The private test server (port 5347) is stopped. Ports 5173, 5191, 5199 and 5231 were not used. Screenshots are in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\93b3cb82-1f88-42b8-a81e-c5b257bdf9f1\scratchpad\r3fix\h\shots`.

**Not run or could not verify:**

- U2 Practice was not walked in the browser. Its Practice code did not change; only its CFU reasons did, and those were walked.
- The Module Test was checked by generator only this round. It does not use the changed Q8 question.
- Real iPad speech, including "Rod A", and real finger dragging.
- Whether 🪵 🪨 🪶 draw on the target iPads. The rock showed as an empty box on Windows 10 in round 3.
- Real speech timing and real students.

## 6. Noticed, not fixed

1. **The "long" word rod already shows 7 blocks if a child taps it before CFU Q4.** See the E3-68 follow-up.
2. **The sound banner covers part of the number pad until dismissed** (C1-09, skipped). Seen again in this round's pad screenshots.
3. **The Module Test page's heading has no voice.** E3-69 named only the three other headings.
4. **C3-50 stays open (D13):** tapping the same spot after a miss passes all 9 two-button CFU picks.
5. CFU questions still do not auto-read, and the question number is still spoken (D7).
