# MK4 Shapes Lab: Round 3 merged fix list (final round)

- **Lab:** MK4 `ShapesLab`, grade K (K–1 band, audio-first, iPad, alone).
- **Round:** 3 (re-review, last round under the stopping rule). **Date:** 2026-11-25.
- **Sources:** `round-3-curriculum.md` (C3-01…C3-05: 0 Blocker / 1 Major / 4 Minor / 0 Polish) and `round-3-english.md` (E3-01…E3-08: 0 Blocker / 1 Major / 4 Minor / 3 Polish).
- **Round-2 status:** curriculum 22 Fixed + 3 fixed-but-new-problem; English 13 Fixed + 2 fixed-but-new-problem. Nothing Not fixed.
- **Merged:** 11 items. **Fix 11 · Skip 0 · Ask user 0** (2 user decisions recorded below).
- All earlier user decisions stand (see round-1-merged.md and round-2-merged.md).

## User decisions (2026-11-25)

| Item | Question | Decision |
|---|---|---|
| C3-05 (with C3-04) | Portrait Test questions in MK1/MG2 start with keys/buttons below the fold | **Fix now.** First fix C3-04 (picture top cut off by the scroll), then run the same `.lab-early` Test scroll in portrait too. It only moves the page when something is off screen. |
| C3-02 + E3-08 | Wrong-try line in custom steps stays while the child rebuilds | **Shared engine.** Add an `onEdit()` callback to `CustomStep.render` that clears `feedback`; MK4's builders call it on every ball/stick/piece/Turn/add tap. Labs that don't call it are unchanged. |

## Fix list

| ID(s) | Sev | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|
| C3-01 + E3-04 | Major | `diagrams/Shape2D.tsx:425–442` (`SideRows`); U3 Practice crossShapeCompare step 2 `SidesAndCorners.tsx:466–478, :509–513`; U3 Explore | Lined-up sticks touch and draw as one bar, so extras can't be counted; "Line them up" asks for something already done; circle case has one row | Fix | `SideRows`: butt caps with a gap of ~8 (or round caps with gap ~12); check 6 sticks fit. Tie each row to its shape (small shape copy at the row start, or matching tones). Prompt "Look at the rows. How many extra?" Hint (two rows) "Look at the end of the long row."; circle case hint "The circle has none. Count the other row." and Show me "The circle has none. The extra ones are 1, 2, 3." Screenshot hexagon vs triangle, rectangle vs square, circle vs square. |
| E3-01 | Major | U4 Test `BuildingAndCombiningShapesTest.tsx:158–176` (`builtShapeRotatedQuestion`) | "This triangle got turned. Is it a square now?" answered from the words | Fix | Same as E2-01: show the stick shape straight → arrow → turned (`StickArrangementPreview`, arrow `data-tts-skip`). Prompt "It got turned. What shape is it now?" Choices: the right shape + two others (Square / Triangle / Rectangle). Explain "It is still a square." / "It is still a triangle." Make sure it can't duplicate the U1 Test turned item if both appear in the Module Test. Search every Test and the Module Test for any other prompt that names the shape it asks about. |
| C3-02 + E3-08 | Minor | Shared `StepProblem.tsx` ~:511–514; MK4 `JoinBuilder`, `ComposeBuilder`, `StripFiller`/`NewWayFiller` | Stale red wrong-try line during rebuild | Fix (user: shared engine) | See user decision. Check MK1, MK2 and MG custom-step labs still behave. |
| C3-04 | Minor | Shared `UnitTest.tsx` ~:106 | Landscape scroll can leave a tall picture's top off screen (MG2 tens-and-ones, 1 of 32) | Fix | After the scroll, if the question fits in the window, align with `block: "start"`; otherwise align the picture's top. Re-run after the floating pad opens. Optionally give two-box floating-pad questions the two-column layout. Re-check every MG2 U2 question at 1180×820 (picture top ≥ 0). |
| C3-05 | Minor | Shared `UnitTest.tsx` scroll; `.lab-early` labs | Portrait questions in MK1 U3, MG2 U3/U5 with keys/buttons below the fold | Fix (user: fix now) | Run the same scroll in portrait for `.lab-early`. Re-check every Test + Module Test question in MK1, MK2, MK3, MK4, MG1, MG2 at 820×1180 (all controls visible, picture top ≥ 0) and re-confirm landscape 1180×820 / 1366×768. |
| C3-03 | Minor | U2 Explore, Practice `partStep`, Test part question | "The end of the can is a circle" over a flat oval | Fix | Beside the ringed can, draw a true circle with a small arrow (as if traced on paper). Explore line "Trace the end. You get a circle." Show the traced circle in that step's Show me. Not on the Test before an answer. |
| E3-02 | Minor | U4 build3D step 1 `BuildingAndCombiningShapes.tsx:518`; `StickBuilder.tsx:37` | "Close it all the way around" doesn't fit a cube; two ways of saying "missing" | Fix | Cube prompt "Build a cube like this one." Cube-only gap reason "Not yet. A stick is missing." Flat prompt unchanged. |
| E3-03 | Minor | U3 Look-here CFU Q3 `SidesAndCorners.tsx:74`; Explore circle line `:256` | "Look for a corner" on a circle | Fix | "Look here. Is there a corner?" / "Watch the dot go around. Is there a corner?" |
| E3-05 | Minor | U2 `nameFlatMixedStep` `FlatOrSolid.tsx:413`, `nameSolidMixedStep` `:422` | Hint points at what circle and sphere share | Fix | Flat: "It is flat. Look at its corners." / circle "It is flat and round." Solids: "Round all over? A point on top? Like a block?" |
| E3-06 | Polish | U1 Explore `NamingShapesAndPositions.tsx:366`; U2 Show me `FlatOrSolid.tsx:391` | Awkward "4 sides the same" | Fix | "A square's 4 sides are all the same." / "Look: its 4 sides are all the same. It is a square." |
| E3-07 | Polish | U2 `FlatOrSolid.tsx:372–373`; Test `FlatOrSolidTest.tsx:31` | "hold it" vs "pick it up" | Fix | "pick it up" everywhere. |

## Proposed rule and guideline changes (wait for Stage 6)

Curriculum (round 3): see `round-3-curriculum.md` §7.

English (round 3):
1. checklist §3 Giveaways: search every Test and the Module Test for prompts that name the shape they ask about; a Yes/No about a named shape is a giveaway too — MK4; all grades.
2. checklist §3 Text vs. picture: don't tell the child to do what the picture already did ("Line them up." over lined-up rows) — MK4; K–1.
3. checklist §3 Hints: with a deliberate look-alike in the buttons, the hint points at what separates them — MK4; all grades.
4. grade-K Watch for: *closed/gap* for 2D builds; *every stick / missing a stick* for 3D frames — MK4; K–1.

Earlier rounds' proposals: round-1-merged.md and round-2-merged.md.
