# MK4 Shapes Lab: Round 2 merged fix list

- **Lab:** MK4 `ShapesLab`, grade K (K–1 band, audio-first, iPad, alone).
- **Round:** 2 (re-review). **Date:** 2026-11-25.
- **Sources:** `round-2-curriculum.md` (C2-01…C2-15: 1 Blocker / 4 Major / 9 Minor / 1 Polish) and `round-2-english.md` (E2-01…E2-15: 0 Blocker / 2 Major / 7 Minor / 6 Polish).
- **Round-1 status:** curriculum 45 Fixed + 4 fixed-but-new-problem; English 34 Fixed + 2 fixed-but-new-problem + 1 Skip (user). Nothing Not fixed.
- **Merged:** 25 items. **Fix 25 · Skip 0 · Ask user 0** (2 user decisions recorded below).
- Round-1 user decisions still stand (real Unit 4 building; real-object buckets; reverse-position item kept; sides+corners in U1 Explore; "Flat (2D)/Solid (3D)" kept; "sticks" kept).

## User decisions (2026-11-25)

| Item | Question | Decision |
|---|---|---|
| C2-04 | Landscape-iPad layout for the first Test question | **Share it.** Promote MK2's landscape rule (`MK2_AdditionSubtractionAndTeenNumbersLab_styles.css:124–139`) into `lab-base.css` under `.lab-early`; remove the now-duplicate copy from MK2's stylesheet only if the shared rule fully covers it. Check MK1, MK2, MK3, MK4, MG1, MG2 (and any other `.lab-early` lab) at 1180×820 and 1366×768, first question of every Test and Module Test. |
| C2-12 + E2-15 | Double wrong-try message in custom steps | **Fix the shared engine.** In `StepProblem.tsx` (~:511) let a custom step supply its own wrong-try reason and skip the generic "Not a match. Try again." when it does. Check every lab that uses custom steps. |

## Fix list

| ID(s) | Sev | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|
| C2-01 | Blocker | `Solid3D.tsx:63–75`, `CubeFrameBuilder.tsx:16–19`, `RealObjects.tsx:223–227` | Cube's front drawn as a wide rectangle (≈1.48:1) while the lab says "It is a square" / "4 sides the same" | Fix | Draw the front as a true square (equal width and height), keep the slanted back, re-center to fit 200×200. Screenshot every cube: U2 Explore, rows, Practice, Test; U4 CFU Q4/Q5, builder, Practice, Test; block picture. |
| C2-02 | Major | `ComposeShapes.tsx:306–317` | Strip "squares" are 27×44 tall rectangles | Fix | Make each square space square (e.g. 36×36); a 2-square piece is 2 squares long. Check strips 3–8 long at 820 px. |
| C2-03 | Major | `FlatOrSolid.tsx:405–412, :424–426` | Step 1 (name, with only flat or only solid names, "What solid is it?") gives away step 2's flat/solid answer | Fix | Ask "Is it flat (2D) or solid (3D)?" first, with explains that don't name the shape ("It is solid. You can hold it."). Then "What is its name?" with flat and solid names mixed (cube: Cube / Square / Cone; square: Square / Cube / Triangle). Neutral prompts (no "solid"). Re-check that step 1's explain doesn't give away step 2 (round-1 C1-05 rule). |
| C2-04 | Major | Shared `lab-base.css` (`.lab-early`); all 4 Tests + Module Test | First Test question's pad/buttons below the fold at 1180×820 | Fix (user: share it) | See user decision above. Also consider scrolling the question into view on Test start only if the CSS alone doesn't fix it (shared `UnitTest`; check every K lab). |
| C2-05 | Major | U4 `BuildingAndCombiningShapes.tsx:288–293, :491` | No cube to copy in Explore or Practice build3D | Fix | Show a cube model (`CubeFramePreview` or `SolidGlyph` cube, with the new square front) beside the Explore cube builder and in Practice build3D step 0 before help, as the flat build shows its `ShapeGlyph`. |
| E2-01 | Major | U1 Test `NamingShapesAndPositionsTest.tsx:143` (`turnedShapeQuestion`); Module Test `:26` | Prompt names its own answer ("This triangle got turned. What shape…") | Fix | Picture shows the shape straight, then turned (arrow between, or one turn animation). Prompt "It got turned. What shape is it now?" Same choices. Explain "It is still a triangle." (or rectangle). Leave U1 CFU Q1 as is. |
| E2-02 | Major | U3 Practice `SidesAndCorners.tsx:470` (crossShapeCompare step 2) | "How many more sides does the hexagon have?" is a K "not yet" compare question | Fix | Show the lined-up rows (`SideRows`) on step 2 from the start, with the extras visible. Prompt "Line them up. How many extra?" Hint "Look at the end of the long row." Show me unchanged. Explain "3 extra. The hexagon has 3 more." Make sure the extras aren't pre-numbered (the student must count them). |
| C2-12 + E2-15 | Minor | Shared `StepProblem.tsx` ~:511 | Two wrong-try messages in custom steps | Fix (user: shared engine) | See user decision above. In MK4 every custom step (build, cube, compose, new-way) passes its own reason. |
| C2-06 | Minor | U1 CFU Q2–Q5 (`NamingShapesAndPositions.tsx:99, :114, :127–128, :158–159`); U4 CFU Q5 (`:126`) | Some CFU show-it pictures don't change | Fix | Q4/Q5: pass `help` to `PositionScene` in `showPicture`. Q2/Q3: number the asked shapes in show/done. U4 Q5: light the 3 sticks at the ringed ball. |
| C2-07 | Minor | U1 `manyBalls` `:517` | Ball count always 1 or 2 | Fix | Answer 0–3, chosen first and balanced; add spots per area. Check singular/plural/zero wording ("0 balls are…" → use a K-friendly zero line, e.g. "No balls are below the box." only in the explain; the question stays the same). |
| C2-08 | Minor | U1 Test `positionAboveBelowQuestion` / `positionBesideAboveQuestion` | Both can draw the same "above" scene | Fix | Q7 is "beside" only (left or right), buttons Beside / Above / In front of. Q6 stays above/below. No overlapping right answers. |
| C2-09 | Minor | U2 `frontStep`; Test `cubeFrontQuestion` | Front of the cube always "Square" | Fix | Teach a second part in Explore first (end of the can → Circle, or bottom of the cone → Circle), then draw at random between cube front and can end in Practice and on the Test. Ring the part. Words: "Look at the end of the can. What shape is it?" |
| C2-10 | Minor | U4 CFU Q6 | Q6 and its twin are both Yes, so a "Yes" tapper passes | Fix | Make Q6 typed: three strips (two full in different ways, one with an empty square). "How many are full?" (2). Twin: different strips, answer still a count. Look-here to the strip spot. Say "strip" only once it's taught (E2-13). |
| C2-13 + E2-05 | Minor | U4 `NewWayFiller` `:645`; Explore strip line `:352` | "Same way" for a reorder, no reason | Fix | Keep the rule (same mix of pieces = same way). Text: "It is full! Same pieces. Try different pieces." Explore: "Full! Same pieces. Start over. Try different pieces." |
| C2-14 | Minor | U4 cube builder `:292, :505` | Clay balls too small to tap | Fix | Cube `ballR` 9 and a wider cube board (~300 px); check at 820×1180. |
| C2-11 | Minor | `RealObjects.tsx:141–143, :173–175` | Door panels / window crossbars add inner corners | Fix | Remove the panels and crossbars (or draw them very faint and thin) so only the outside corners show. |
| E2-03 | Minor | U4 `:464, :499`; `StickBuilder.tsx:173` | `Then tap "Is it closed?"` is read as a question to the student; *closed* untaught | Fix | Prompt "Build a square. Close it all the way around." Add Explore line "Closed means no gap." Button label unchanged. |
| E2-04 | Minor | U1 `cornersStep` `:372`; U3 CFU Q3 nudge `:133`; U3 `countStep` `:342` | "Find a corner" when the answer is 0 | Fix | "Look all the way around. Is there a corner?" / "Is there a straight side?" |
| E2-06 | Minor | U3 Explore `:316`; U4 `closedPick` `:415–416` | "stick out" / "poking out" | Fix | "Line up the sides. See the extra ones." / "Look for an extra stick." / "Two have an extra stick. This one has none." |
| E2-07 | Minor | U4 Explore `:316`; in-step line `:551`; hint `:543` | Three actions in one instruction | Fix | In-step line and hint "Tap a piece. Then tap a spot." Explore may add "Tap Turn to turn it." on its own line. |
| E2-08 | Minor | U1 Explore `:350–351`; U2 Explore `:305` | Pronouns pointing back | Fix | "The ball hides part of the box." / "The box hides part of the ball." U2: ring the line-drawn cube while the line plays, or "A block of just lines is still solid." |
| C2-15 + E2-10 | Polish | U1 Explore `:303` | "It is still a {shape}!" before anything is turned | Fix | "It is a {shape}." until turned or resized, then "It is still a {shape}!" |
| E2-09 | Polish | U2 CFU Q3 `:169` | "That is the solid ones." | Fix | "You counted the solid ones. Count the flat ones." |
| E2-11 + E2-13 + E2-12 + E2-14 | Polish | U4 titles; U4 CFU/Test "strip"; U1 CFU Q2 `:101`, Look-here `:30`; U4 Explore `:362` | Title repeats prompt; *strip* untaught; "Little"; awkward lines | Fix | Titles "Many ways" / "Cube". Teach *strip* in Explore ("Fill the strip. Then fill it a new way."). "Small ones and turned ones count too." / "Look here. A square's sides are all the same." / "The pieces must touch. With a gap, it is not one shape." Update `vocabulary.md` (*strip*, *closed*, *end of the can*). |

## Proposed rule and guideline changes (wait for Stage 6)

Curriculum (round 2):
1. Named shapes must be drawn true (a cube's front, a strip's square) — MK4; all grades.
2. An earlier step's prompt or button set must not decide a later category choice — MK4 U2; all grades.
3. Every build sandbox shows a model of what to build — MK4 U4; K–2.
4. Landscape Test layout promoted to `lab-base.css` for `.lab-early`; check the first Test question at 1180×820 — MK4 after MK2; K–1.

English (round 2):
5. checklist §3 Giveaways: a prompt naming the shape can't ask "What shape is it?" with that name as a choice — MK4; all grades.
6. checklist §3 Loaded questions: when the answer can be 0, ask "Is there a corner?", not "Find a corner." — MK4; K–1.
7. grade-K Word problems/Grammar: "How many more does X have?" is a compare question; in K ask "How many extra?" with the extras visible — MK4; K–1.
8. grade-K Grammar: "Tap each …" is fine as a one-action direction — MK4; K–1.
9. math-language-traps §8: don't quote a question-style button label inside an instruction — MK4; all grades.

Carried from round 1 (still waiting): round-1-merged.md items 1–11, plus the fixer's note that the twin rule (same answer kind) conflicts with "twin with the opposite answer" suggestions.
