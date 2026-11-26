# MK4 Shapes Lab: Review summary

- **Lab:** MK4 `ShapesLab` ("Shapes Lab"), 4 units + 20-question Module Test
- **Standards:** K.G.1–K.G.6 · **Audience:** K–1, audio-first, alone on an iPad
- **Dates:** 2026-11-25 to 2026-11-26 · **Rounds:** 3 (the workflow's limit)
- **Status:** the review is done. Both round-3 reports said "ready after one Major fix", and the round-3 fixer fixed all 11 items. A manual pass in the running app and a real-iPad check are still needed. Round 3's fixes were verified by the fixer only, because no review round follows round 3.

## Results by round

| Round | Blocker | Major | Minor | Polish | Merged items | Outcome |
|---|---|---|---|---|---|---|
| 1 | 5 | 38 | 23 | 4 | 47 | 45 fixed, 2 partly fixed (twin kept the same answer kind; "2D" voice unverified on iOS) |
| 2 | 1 | 6 | 16 | 7 | 25 | 25 fixed |
| 3 | 0 | 2 | 8 | 3 | 11 | 11 fixed |

## What changed for students

- **Unit 1 (Name It. Where Is It?):** sides and corners are taught first with tap-to-number shapes. New "What shape is it?" problems use real objects (clock, door, pizza slice). Turned shapes now look turned, and the Test shows the turn in the picture instead of naming the shape. The "Where is the box?" question is kept, in short words, with a varying answer. Every position problem has picture help and a counting step.
- **Unit 2 (Flat or Solid?):** teaches "flat is like a drawing; solid you can pick up", with a real object beside each solid. Shading is no longer the cue, and color no longer gives the answer. Students decide flat or solid first, then name the shape from mixed flat and solid names. "The front of the cube" and "the end of the can" are taught before they are tested. The cube is drawn with a true square front, and the can's end has a traced circle beside it.
- **Unit 3 (Sides and Corners):** shapes are turned and resized. "Which has more? Or are they the same?" has a varying answer. Equal sides are shown by laying the sides out as separate sticks, with an equal-sided and a long, thin triangle. "How many more" became "Look at the rows. How many extra?" with countable sticks.
- **Unit 4 (Build Shapes):** real building: students join clay balls with sticks, check "Is it closed?", and copy a cube model. Composing means choosing the spot and turning pieces. "Fill it a new way" rejects the same pieces. Gaps and extra sticks are taught before the Test asks about them. The strip squares are real squares.
- **All units:** every CFU question has a Look here pointer, spoken choices and (where it is a two-button pick) a twin. Every Practice type has a typed step and picture help on the first wrong try. Finished steps never show a later answer. Tests have pictures on every question, a new order each sitting, varying answers and no repeats. Text is 8 words or fewer per sentence throughout.

## Shared-code changes (affect other labs)

| Change | Labs | Checked |
|---|---|---|
| Landscape Test layout moved from MK2 into `lab-base.css` `.lab-early` (plus picture-left / buttons-right for picture questions) | MK1–MK4, MG1, MG2 | Every Test + Module Test question at 1180×820 and 1366×768 |
| `UnitTest` scroll: brings the whole question into view on early-learner Tests, upright and sideways; fixes MG2's cut-off picture | MK1–MK4, MG1, MG2 | Every question at 820×1180, 1180×820, 1366×768. Before, portrait failed in MK1, MK3, MK4, MG1, MG2 |
| `StepProblem`: a custom step can pass its own wrong-try reason (`onWrong(reason)`) and clear it on the next action (`onEdit()`) | Only MK4 uses them; MK1, MK2, MG custom steps unchanged | Code check; browser check of MK4 only (MK1 drag-to-match is hard to automate) |

## User decisions

| # | Decision |
|---|---|
| D1 | Unit 4 gets real building (join clay balls, choose the spot, turn pieces) |
| D2 | Add K.G.1 real-object shapes to Units 1 and 2 |
| D3 | Keep the reverse-position item, reworded ("The ball is above the box. Where is the box?") |
| D4 | Teach sides and corners in Unit 1 Explore |
| D5 | Keep "Flat (2D)" / "Solid (3D)" |
| D6 | Keep the word "sticks" (not "straws") |
| D7 | Share the landscape Test layout across early labs |
| D8 | Fix the shared engine's double wrong-try message |
| D9 | Turn on the Test scroll in portrait too (fixes MK1/MG2 portrait) |
| D10 | Shared engine clears a stale wrong-try line on the next action |

## Rule decisions (2026-11-26)

**Added (6):**
- Builder: a finished step's explain, chip and result text must not state a later answer, and step 1 must not decide a later "which kind?" choice (all grades).
- Builder: teach the idea, not a drawing cue (K–2).
- Builder: Test screen check of every question, upright and sideways, including the picture top (K–1).
- Checklist: a prompt that names the thing it asks about is a giveaway, Yes/No included (all grades).
- Checklist: hints that don't mislead — "Is there a corner?" when 0 is possible (K–1); look-alike hints point at the difference (all grades); don't ask the child to do what the picture already did (K–1).
- Traps §8: swap-slash, spaced slash, 's on all-caps, quoted question-style button labels (all grades).

**Declined (6):** color never sorts answers; build steps can be wrong + model to copy + stale line; pictures drawn true (square sides, fit, countable gaps); "turn" as the one word + "how many extra"; one word one meaning (side, closed/gap vs missing stick); every K–1 Test item has a picture.

## Still open

- How the iPad voice says "2D" / "3D" ("Flat 2D or solid 3D", no pause).
- The cube build is 12 joins (24 taps). It may be long for a Kindergartner alone.
- Unit 3's two-row Show me still says "Line them up." (the prompt says "Look at the rows.").
- MG2 at 1366×768 with the floating pad open: the pad can overlap an empty corner of a tall picture and part of the read-aloud bar's "Speed" label. Nothing the child needs is covered.
- MK2's `OwnWay` step could now use `onWrong(reason)` and drop its CSS workaround.
- The builder's twin rule ("same answer kind") vs. earlier "twin with the other answer" suggestions (MK3 C2-38, MK4 C1-30) is unsettled.
- Whether real Kindergartners read the "behind" scene as "behind".

## Not verified

- Real iPad speech and real finger tapping on the clay balls and pieces.
- MK1's drag-to-match step after the `StepProblem` change (code-checked only).
