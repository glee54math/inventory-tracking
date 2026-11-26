# MK4 Shapes Lab: Round 2 fixes

- **Lab:** MK4 `ShapesLab`, grade K (K–1 band). **Round:** 2. **Date:** 2026-11-25.
- **Target:** `round-2-merged.md` (25 Fix items, 2 user decisions about shared code).
- **Read first:** `math-lab-fixer.md`, `math-lab-builder.md`, `grade-K.md` (no younger file), both round-2 reports, the round-1 merged list and fixes, the plan, the vocabulary list, and every MK4 file touched.

## 1. Summary

**Fixed 25 · Partly fixed 0 · Needs decision 0 · Not fixed 0.**

Both shared-code decisions are in, and every K–1 lab was checked:
- **Landscape Test layout (C2-04).** MK2's rule now lives in `lab-base.css` under `.lab-early`, and the copy in MK2's stylesheet is gone. The MK2 rule only covers typed questions. MK4's Unit 1, 2 and 4 Tests open on picture-button questions, so I added two things in the same block:
  - A picture-left, buttons-right layout for choice questions.
  - A small landscape-only scroll in the shared `UnitTest`. The merged list allowed this "if the CSS alone doesn't fix it", and at 1366×768 the CSS alone left the pad's bottom row under the read-aloud bar.

  Result: every question of every unit Test and Module Test in MK1, MK2, MK3, MK4, MG1 and MG2, at both 1180×820 and 1366×768, has every answer button, pad key and Check on screen and clear of the read-aloud bar. Portrait is untouched by construction (see §5).
- **Custom-step wrong-try reason (C2-12 + E2-15).** A custom step can now pass its own reason, and `StepProblem` shows and reads that line instead of "Not a match. Try again." MK4's build, cube, compose and "new way" steps pass their reason. Labs that call `onWrong()` with no reason behave exactly as before: MK1 word matching, MK2 "write your own way", and the MG6–MG11 custom steps.

## 2. Item table

`U1` = `units/NamingShapesAndPositions.tsx`, `U1T` = its Test, and so on for U2 (`FlatOrSolid`), U3 (`SidesAndCorners`) and U4 (`BuildingAndCombiningShapes`). `D/` = `diagrams/`.

| ID | Status | What changed | Where |
|---|---|---|---|
| C2-01 | Fixed | The cube's front is a true square (2s × 2s), the back square is slid up and right, and the whole cube is centered in 200×200. This is done in all three drawings: `SolidGlyph`, the `CubeFramePreview`/builder geometry (`S = 48`), and the block. The block's inner frame and ring are square too. Screenshots: U4 CFU Q4/Q5, Explore builder and model, Practice cube build. | `D/Solid3D.tsx:64`, `D/CubeFrameBuilder.tsx:11–24`, `D/RealObjects.tsx:224` |
| C2-02 | Fixed | Each strip square is 36 × 36 (a piece is 33 × 33), and a 2-square piece is 2 squares long. An 8-long strip is 308 units wide in a 340 px box, so it fits at 820. | `D/ComposeShapes.tsx:303–340` |
| C2-03 | Fixed | Classify problems now ask "Is it flat (2D) or solid (3D)?" first. Its explains don't name the shape ("It is flat, like a drawing." / "It is solid. You can hold it."). Then comes "What is its name?", with flat and solid names mixed: the right name, the look-alike from the other kind (square↔cube, circle↔sphere, triangle↔cone, rectangle↔cylinder, hexagon↔cube), and one more name of the same kind. Picture help moved with the steps: paper or the real thing on step 1, corner dots or the clue outline on step 2. Brute force: no step's explain contains a later answer, apart from the known "(2D)/(3D)" false positive. | U2 `:410–430`, `:459`, `:475` |
| C2-04 | Fixed | See §1. MK2's rule is moved into `.lab-early` in a landscape media query, plus a picture + buttons two-column variant (word buttons side by side), `scroll-margin` on the question, and a landscape-only `scrollIntoView({block: "nearest"})` in `UnitTest` on each new question (K–1 labs only, via `useEarlyLearner`). | `shared/styles/lab-base.css:1579–1630`, `shared/engine/UnitTest.tsx:100–112`, MK2 stylesheet (copy removed) |
| E2-01 | Fixed | The picture shows the shape straight, an arrow, then the same shape turned (`TurnedPair`; the arrow is `data-tts-skip`). Prompt: "It got turned. What shape is it now?" The choices are the same as before. Explain: "It is still a triangle/rectangle." The Module Test reuses this generator. U1 CFU Q1 is left as it was. | U1T `:132–165` |
| E2-02 | Fixed | Step 2 always shows the lined-up rows (`SideRows`) under the two shapes. The extras are not numbered: help rings them and Show me numbers them. Prompt: "Line them up. How many extra?" Hint: "Look at the end of the long row." Show me is unchanged. Explain: "{n} extra. The {hexagon} has {n} more." The rows show only on step 2, so step 1 ("Which has more?") gets no help from them. | U3 `:466–476`, `:505–514` |
| C2-12 + E2-15 | Fixed | `CustomStep.render`'s `onWrong` takes an optional `reason`. `wrongTry` uses it as the step's feedback (shown, read aloud, and it drives "Look here"), or "Not a match. Try again." when there is none. `JoinBuilder` and `ComposeBuilder` pass the reason and don't print it themselves when a step is listening; in Explore (no `onWrong`) they still say it. `NewWayFiller` says its line itself on the first same fill (not a miss) and passes it as the reason from the second. Browser: one line per wrong try on all four MK4 custom steps. | `shared/engine/types.ts:396–404, :486`, `shared/engine/StepProblem.tsx:508–515, :624, :756, :832`, `D/StickBuilder.tsx:160–175`, `D/ComposeShapes.tsx:186–196`, U4 `:650–680` |
| C2-06 | Fixed | Q2/Q3: in show/done the asked shapes are outlined and numbered 1, 2, 3. Q4/Q5 and their twins: `showPicture` passes `help` to `PositionScene` (the hidden part blinks, or the arrow shows). U4 Q5: the 3 sticks at the ringed ball are drawn thick in the help color and numbered 1–3 (`CubeFramePreview` `litBall`). | U1 `:37–66`, `:120–200`; U4 `:155`; `D/CubeFrameBuilder.tsx:70, :80–100` |
| C2-07 | Fixed | The scene has 3 spots above, 3 below and 2 on each side. The count (0–3) is chosen first, then 1–3 balls go in other areas. Brute force: 0/1/2/3 at 24–26% each. Zero line: "No balls are above the box." (explain and wrap-up). Show me says "There are no balls to count. That is zero." and draws a big 0 in the empty area. Help shades the asked area. The prompt is unchanged. | `D/PositionScene.tsx:121–200`, U1 `:546–575` |
| C2-08 | Fixed | Q7 is "beside" only (left or right side), with buttons Beside / Above / In front of. Q6 stays above/below. Brute force: 0 repeated questions in 20,000 sittings. | U1T `:101–113` |
| C2-09 | Fixed | Explore now has a second part line under the cube's front: the can with its end ringed, "Look at the end of the can. It is a circle." The part step is drawn from either part: classify3D cube → the front of the cube, classify3D cylinder → the end of the can, square/cube pair → the front, circle/sphere pair → the end of the can. Its picture is the ringed cube or the ringed can. Both use the same buttons: Square / Circle / Triangle. Practice answers: Square 50% / Circle 50%. The Test `cubeFrontQuestion` picks half and half. | U2 `:309–330`, `:380–405`, `:533`; U2T `:110–131`; `D/RealObjects.tsx:206–270` (`ringEnd`) |
| C2-10 | Fixed (twin not used) | Q6 is now typed: "How many strips are full?" (answer 2). It shows three 5-long strips: [1,2,1,1], one with an empty square, and [2,2,1]. A wrong try rings the empty square. Show-it numbers the full strips 1, 2. Why lines: 3 → "One has an empty square. Look again." 1 → "Look at every strip." Look-here goes to the strip spot. **Difference:** the list asked for a twin, but `TypeCheck` has no twin. A typed answer already keeps many answers possible at the 2nd miss, which is what the twin rule is for. U4's CFU is now 5 of 6 typed. | U4 `:42–70`, `:163–178` |
| C2-13 + E2-05 | Fixed | The rule is kept: the same mix of pieces is not a new way. Practice: "It is full! Same pieces. Try different pieces." Explore: "Full! Same pieces. Start over. Try different pieces." | U4 `:352`, `:657` |
| C2-14 | Fixed | Cube clay balls have `ballR` 9 (tap circle 17 units). The cube board is 300 px wide in Explore and in Practice (new `JoinBoard`/`JoinBuilder` `maxWidth`). Balls are about 57 px apart at 300 px. The Practice guide picture uses the same ball size. | U4 `:27`, `:300–310`, `:518`; `D/StickBuilder.tsx:59` |
| C2-05 | Fixed | A `CubeFramePreview` to copy sits beside the Explore cube builder (the same way the flat builder shows its `ShapeGlyph`). In Practice, build3D step 0 shows the cube model before help. After a wrong try it shows the dashed guide, as before. | U4 `:296–310`, `:507–510` |
| C2-11 | Fixed | The door's inner panels and the window's crossbars are removed. The window has a light glass fill. Only the 4 outside corners can be counted. | `D/RealObjects.tsx:141, :172` |
| E2-03 | Fixed | Prompts: "Build a {shape}. Close it all the way around." and "Build a cube. Close it all the way around." New Explore line under the stick builder: "Closed means no gap." The button label is unchanged. | U4 `:291`, `:482`, `:518` |
| E2-04 | Fixed | "Look all the way around. Is there a corner?" (U1 corners step, U3 CFU Q3 nudge, U3 count step). The U3 count step says "Is there a straight side?" for sides. | U1 `:405`; U3 `:133`, `:342` |
| E2-06 | Fixed | U3 Explore: "Line up the sides. See the extra ones." U4 hint: "Look for an extra stick." U4 Show me: "Two have an extra stick. This one has none." | U3 `:316`; U4 `:433–434` |
| E2-07 | Fixed | In-step line and hint: "Tap a piece. Then tap a spot." Explore has the same line, then its own line "Tap Turn to turn it." The builder's "It does not fit. Tap Turn." still teaches Turn when it's needed. | U4 `:330–335`, `:562–570` |
| E2-08 | Fixed | U1 Explore: "The ball hides part of the box." / "The box hides part of the ball." U2 used the no-pointer option: "A block of just lines is still solid." | U1 `:383–384`; U2 `:305` |
| C2-15 + E2-10 | Fixed | The line reads "It is a {shape}." until the student turns the shape or changes its size, then "It is still a {shape}!". A new shape resets it. The Look-here request (turned hexagon) counts as turned. | U1 `:264`, `:336` |
| E2-09 | Fixed | "You counted the solid ones. Count the flat ones." | U2 `:169` |
| E2-11 + E2-12 + E2-13 + E2-14 | Fixed | Practice titles "Many ways" and "Cube". *Strip* is taught in Explore: "Fill the strip. Then fill it a new way." U1 CFU Q2: "Small ones and turned ones count too." Look-here: "Look here. A square's sides are all the same." Gap line: "The pieces must touch. With a gap, it is not one shape." `vocabulary.md` is updated (*strip*, *closed*, *end of the can*, *extra*, *name*, avoided *stick out / poking out / how many more*). | U4 `:341`, `:380`, `:503`, `:616`; U1 `:30`, `:118`; vocabulary.md |

Also updated: `plan.md` (U2: flat or solid first, mixed names, end of the can; U4: typed strip CFU, cube model, "same pieces"). The shell is unchanged: it already passes `onRetrySame` with the retry lock and records solves with `recordSolve`.

## 3. Changed files

**Shared (other labs affected):**
- `src/pages/math-levels/shared/engine/StepProblem.tsx` and `shared/engine/types.ts`: the optional `reason` on a custom step's `onWrong`. Every lab with custom steps uses this file. Those that call `onWrong` with no reason are unchanged: MK1 `WordNumeralMatch`, MK2 `OwnWay` (still hides the generic line with its own CSS; see §6), MG3/MG6/MG7/MG8/MG9/MG11 custom steps (most don't use `onWrong`).
- `src/pages/math-levels/shared/engine/UnitTest.tsx`: the landscape-only scroll, for `EarlyLearnerProvider` labs only (MK1–MK4, MG1, MG2).
- `src/pages/math-levels/shared/styles/lab-base.css`: the landscape `.lab-early` Test layout. It affects MK1, MK2, MK3, MK4, MG1 and MG2 (the only `.lab-early` labs).
- `src/pages/math-levels/MK2/MK2_AdditionSubtractionAndTeenNumbersLab_styles.css`: its landscape block removed, because the shared rule is the same rule.

**MK4:**
- `MK4/ShapesLab/diagrams/`: `Solid3D.tsx`, `CubeFrameBuilder.tsx`, `RealObjects.tsx`, `ComposeShapes.tsx`, `StickBuilder.tsx`, `PositionScene.tsx`
- `MK4/ShapesLab/units/`: `NamingShapesAndPositions.tsx`, `NamingShapesAndPositionsTest.tsx`, `FlatOrSolid.tsx`, `FlatOrSolidTest.tsx`, `SidesAndCorners.tsx`, `BuildingAndCombiningShapes.tsx`
- `_planning/Grade-K/ShapesLab/vocabulary.md`, `_planning/Grade-K/ShapesLab/plan.md`

`ModuleTest.tsx` is not edited. It picks up the new `turnedShapeQuestion` through its import.

## 4. New or rewritten student text

- **U1:**
  - Explore: "It is a {shape}." (before any change) · "The ball hides part of the box." · "The box hides part of the ball."
  - CFU Q2 why: "Small ones and turned ones count too."
  - Look-here: "Look here. A square's sides are all the same."
  - Corners hint (0): "Look all the way around. Is there a corner?"
  - Ball count: "No balls are {above/below/beside} the box." (explain and wrap-up), plus the "1 ball is" / "3 balls are" lines.
  - Test: "It got turned. What shape is it now?" · beside question hint "Is the ball next to the box?" (Test hints are never shown) · "The ball is beside the box."
- **U2:**
  - Explore: "A block of just lines is still solid." · "Look at the end of the can. It is a circle."
  - CFU Q3: "You counted the solid ones. Count the flat ones."
  - Practice: "What is its name?" · "Look at the end of the can. What shape is it?" · "Look at the end. Is it round?" · "Look: the end is round. It is a circle." · "The end is a circle."
  - Test: "Look at the end of the can. What shape is it?" · hint "Look at the ringed part." (never shown) · "The end is a circle."
- **U3:** "Look all the way around. Is there a corner?" / "…Is there a straight side?" · "Line up the sides. See the extra ones." · "Line them up. How many extra?" · "Look at the end of the long row." · "{n} extra. The {shape} has {n} more."
- **U4:**
  - Explore: "Closed means no gap." · "Tap a piece. Then tap a spot." · "Tap Turn to turn it." · "Fill the strip. Then fill it a new way." · "Full! Same pieces. Start over. Try different pieces." · "The pieces must touch. With a gap, it is not one shape."
  - CFU Q6: "How many strips are full?" · nudge "Look for an empty square." · why "One has an empty square. Look again." / "Look at every strip." · show "Watch and listen: 1, 2. One has an empty square." · praise "Yes! 2 are full. Two different ways."
  - Practice: "Build a {shape}. Close it all the way around." · "Build a cube. Close it all the way around." · "Look for an extra stick." · "Two have an extra stick. This one has none." · "Tap a piece. Then tap a spot." (line and hint) · "It is full! Same pieces. Try different pieces." · titles "Cube", "Many ways".
- **Shared:** no new student text. A custom step's own reason replaces "Not a match. Try again." when one is given.

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | Pass (0 errors) |
| `npx eslint` (MK4 folder, `StepProblem.tsx`, `UnitTest.tsx`, `types.ts`) | Pass: 0 errors. 66 warnings, all `react-refresh/only-export-components` (the usual pattern) plus the shell's older unused-disable warning. |
| `npx vite build` | Pass. Only the usual chunk-size warning, and no "does not provide an export" warnings. |
| Test/unit import check | Pass. No Test imports its unit. The new Test-side `TurnedPair` is local to `U1T`. |
| Brute force (esbuild bundle of the real files; 4,000 draws per bucket; 20,000 sittings per Test and Module Test) | Pass. All choices are valid and unique. Repeated questions per sitting: 0 in all 5 Tests. Later answer on screen: 0 real hits (only the known "2"/"3" in "(2D)/(3D)"). Ball count 0/1/2/3 at 24–26% each. U2 part step Square 50 / Circle 50. Classify names spread evenly. U1 Test: Q6 above/below and Q7 beside never share a right answer. Generated sentences read: "1 ball is…", "3 balls are…", "No balls are…", "Build a hexagon. Close it all the way around." |
| `node scripts/english-check.cjs --grade K` (MK4) | 452 strings, 12 flagged. Every flag is the same kind of false positive as round 1: plurals whose count is never 1, CSS keyframes, button rows read as one string, and "This one is closed." flagged as passive. Task and after-answer text: 0% over 8 words. |
| Landscape Tests, all `.lab-early` labs (every question of every unit Test and Module Test, one sitting each, answer buttons, pad keys and Check checked against the screen edge and the read-aloud bar) | **1180×820 and 1366×768: 0 questions with a control off screen or covered, in MK1, MK2, MK3, MK4, MG1 and MG2.** Before this change, first questions failed in MK1 (U2, U4, Module), MK3 (U1, U3), MK4 (U1, U2, U4, Module), MG1 (U1–U4) and MG2 (U3, Module). MK2 is unchanged (0 before and after). |
| Portrait 820×1180 | Layout unchanged by construction: the new CSS is inside `(orientation: landscape) and (min-width: 900px)`, and the scroll runs only when `(orientation: landscape)` matches. Measured: MK2, MK3, MK4 and MG1 have 0 off-screen. MK1 (U1–U4) and MG2 (U1, U2, U3, U5) portrait still have older off-screen pad rows or buttons on some questions (see §6). |
| Browser, MK4 CFUs (820×1180, touch, speech logged; wrong ×3 then right on all 20 questions) | Pass. On the 2nd miss "Look here" lights the right spot. The new show-it pictures change: U1 Q2/Q3 numbered shapes, Q4/Q5 blink or arrow, U4 Q5 lit and numbered sticks, Q6 numbered full strips with the empty square ringed. No feedback states the answer. Practice unlocks after the CFU, and the CFU stays on screen. |
| Browser, MK4 Practice help ladder (the 8 changed problem kinds, plus two repeats; wrong at every step) | Pass. Build, cube, compose and many ways each show one feedback line, the step's own reason (no "Not a match"). Hint and picture change on the 1st miss, Show me on the 2nd, "Got it" is held during demos, then "Solved, with help.", no ⭐ shown or spoken, and "Try one like it" gives the same kind with the type locked. No page errors. |

Screenshots: `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\11570f8e-5763-44a1-af9f-c5e70aecc6ac\scratchpad\r2fix\shots\`
- `after-{lab}-{size}-{test}-q1.png` (and any question that failed during tuning)
- `u{1-4}-explore.png`, `u*-cfu-q*-show.png`, `u*-cfu-q*-lookhere.png`
- `w*-*-s*-wrong1.png` / `-showme.png` / `-wrap.png`
- `before-*.png` (first questions before the change)

The temporary harness (`labs-harness.html`, `src/labsHarness.tsx`) is deleted.

Still worth a manual pass on a real iPad:
- iOS speech for "2D"
- tapping the bigger cube balls
- whether the landscape scroll feels natural when a Test opens

## 6. Noticed, not fixed

1. **MK1 and MG2 portrait Tests (820×1180):** on some questions the inline pad's lower rows, Check, or the last answer button start below the fold (pre-existing). Examples: MK1 U3 "How many counters are there in all?", and MG2 U5 "What is 81 + 2?" (9 of 13 keys). The new landscape scroll does not run in portrait (user: portrait unchanged). Worth deciding whether the same "scroll into view" should apply in portrait too. It would touch every K–1 lab.
2. **MK2 `OwnWay`** still hides the generic "Not a match" with its own CSS and a `data-readaloud` strip. It could now pass its reason to `onWrong(reason)` and drop that workaround. Left alone: it isn't on the merged list and the lab is out of scope.
3. **The can's end is drawn as an ellipse** (the usual 3D view) while the answer is "Circle". This is the standard convention, but a careful K child might say "oval". The cube's front has no such problem.
4. **Hexagon's look-alike solid button is "Cube"** in "What is its name?" (no hexagonal solid is taught). It is always wrong, so it's harmless, but it's a weaker distractor than square↔cube.
5. **Engine feedback stays on screen** in a custom step until the next wrong try or the solve. For example, "Not yet. There is a gap." stays while the child keeps building. That is the same as the old generic line, and it's acceptable, but a later engine change could clear it on the widget's next action.
6. **Proposed rules (Stage 6):** the merged list's 9 proposals are not edited into the builder or guidelines. One more from this round: the shared landscape layout now also covers picture + button questions and scrolls on a landscape Test. The builder's "Number pad on a landscape iPad" note could say so, and that it is shared (K–1).
