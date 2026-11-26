# MK4 Shapes Lab: Round 3 fixes

- **Lab:** MK4 `ShapesLab`, grade K (K–1 band). **Round:** 3 (final). **Date:** 2026-11-25.
- **Target:** `round-3-merged.md` (11 Fix items, 2 user decisions about shared code).
- **Read first:** `math-lab-fixer.md`, `math-lab-builder.md`, `grade-K.md` (no younger file), both round-3 reports, the round-2 merged list and fixes, the plan, the vocabulary list, and every file touched.

## 1. Summary

**Fixed 11 · Partly fixed 0 · Needs decision 0 · Not fixed 0.**

Both shared-code decisions are in, and every affected lab was checked:
- **Test scroll (C3-04, then C3-05).** The shared `UnitTest` scroll now:
  - runs in portrait as well as landscape, for `.lab-early` labs only;
  - moves the page only when part of the question is off screen;
  - shows the whole question when it fits, and lines up its top (the picture's top) when it is taller than the screen;
  - checks again 450 ms later, and 450 ms after a box is tapped (the floating pad opening).

  Cause of C3-04, found and reproduced (2 of 6 MG2 sittings): on a two-box question, the floating pad's smooth scroll from the previous question kept going after the new, shorter question came in. It overrode the first scroll and left the picture at −101 px. The second check fixes it: the picture top is at 12 px within half a second.

  **Result** (every Test and Module Test question in MK1, MK2, MK3, MK4, MG1 and MG2, at 820×1180, 1180×820 and 1366×768): see §5. Before the change, portrait had controls below the fold in MK1, MK3, MK4, MG1 and MG2. MG2 also had the picture cut off at 1180×820.
- **Custom-step `onEdit` (C3-02 + E3-08).** `CustomStep.render` gets a third callback, `onEdit()`. It clears the step's feedback line, the same way a typed step's `onChange` does; the try count, hint and Show me stay. MK4's stick builder, cube builder, compose builder and strip fillers call it on every ball, stick, piece, spot, Turn, Add, Take one off and Start over tap.

  Labs that don't call it are unchanged: MK1 `WordNumeralMatch`, MK2 `OwnWay`, and the MG3, MG6, MG7, MG8, MG9 and MG11 custom steps. Their render functions take one or two parameters and never receive or call the third. In `UnitTest`, `StepInput` gets no `onEdit`, so the callback does nothing there.

## 2. Item table

`U1` = `units/NamingShapesAndPositions.tsx`, `U1T` = its Test, and the same for U2 (`FlatOrSolid`), U3 (`SidesAndCorners`) and U4 (`BuildingAndCombiningShapes`). `D/` = `diagrams/`. All paths are under `src/pages/math-levels/MK4/ShapesLab/` unless they start with `shared/`.

| ID | Status | What changed | Where |
|---|---|---|---|
| C3-01 + E3-04 | Fixed | **Rows:** each stick is drawn inside its own 24-unit length (round ends included), with a 10-unit gap, so the sticks never touch. Six sticks still fit (viewBox 254 wide). Each row starts with a small outline of its shape and a dashed divider, so the row is tied to its shape and the outline is never counted as a stick or dot. Practice and Explore pass `kind`. **Text:** prompt "Look at the rows. How many extra?"; hint (two rows) "Look at the end of the long row."; with a circle, the hint is "The circle has none. Count the other row." and Show me is "The circle has none. The extra ones are 1, 2, 3." Screenshots: hexagon/triangle, square/hexagon, triangle/square, circle/square, circle/hexagon (Explore), and Practice circle + triangle corners. Rectangle vs square is a tie, so step 2 is the "How many sides does the rectangle have?" count and there are no rows. | `D/Shape2D.tsx:419–480`; U3 `:318`, `:465–485`, `:520` |
| E3-01 | Fixed | The U4 Test turned item shows the stick shape straight, an arrow (`data-tts-skip`), then the same stick shape turned (local `StickTurnedPair`). Prompt: "It got turned. What shape is it now?" Buttons: Square / Triangle / Rectangle, shuffled. Explain: "It is still a square." / "It is still a triangle." It is still not in the Module Test. It can't look like the U1 turned item: U1 uses drawn triangles and rectangles; this one uses stick squares and triangles. I searched every Test and the Module Test for other prompts that name the shape they ask about: none. The other prompts that name a shape ask for a count ("How many sticks make this hexagon?"), a part ("the front of the cube"), or which picture ("Which square has no gap?"). | U4T `:157–203` |
| C3-02 + E3-08 | Fixed (shared) | See §1. `JoinBuilder` and `ComposeBuilder` take `onEdit`. `StripFiller` takes `onEdit`, and `NewWayFiller` also hides its own first "It is full! Same pieces…" line on the next tap. **Beyond the list:** the Explore strip's "Full! … Start over." line now also goes away once the child starts over (the same stale-line problem, in Explore). | `shared/engine/types.ts:398–405, :490`; `shared/engine/StepProblem.tsx:515–518, :629, :755–764, :839–844`; `D/StickBuilder.tsx:120–195`; `D/ComposeShapes.tsx:165–255`; U4 `:196–240`, `:380`, `:508`, `:545`, `:590`, `:666`, `:676–705` |
| C3-04 | Fixed (shared) | See §1. MG2 U2 at 1180×820: picture top ≥ 0 in every draw after the change (6 sittings in the targeted run, plus the full run). After a box is tapped and the floating pad opens: picture top ≥ 12 px in every MG2 two-box question at all three sizes, with all 12 keys on screen and the pad off the boxes. The two-column layout for two-box questions (optional) was not needed. | `shared/engine/UnitTest.tsx:101–143` |
| C3-05 | Fixed (shared) | The same scroll now runs in portrait. The `scroll-margin` (12 px top, 84 px bottom, clear of the read-aloud bar) moved out of the landscape media query so it applies in both. The landscape two-column layout is unchanged. | `shared/engine/UnitTest.tsx:101–143`; `shared/styles/lab-base.css:1579–1594` |
| C3-03 | Fixed | New `CanEndTraced`: the ringed can, an arrow (`data-tts-skip`), and the end traced on a sheet of paper as a true circle about as wide as the can's end. Explore shows it with "Look at the end of the can. Trace the end. You get a circle." Practice shows it only in the part step's Show me (both the classify-cylinder and the circle/sphere-pair paths). The Test still shows only the ringed can. | `D/RealObjects.tsx:293–323`; U2 `:318–326`, `:398–412`, `:507`, `:554` |
| E3-02 | Fixed | Cube prompt "Build a cube like this one." New `CUBE_BUILD_REASON` (gap → "Not yet. A stick is missing."), passed as `reasons` to the cube builder in Practice and Explore. The flat prompt and "There is an extra stick. Tap it to take it off." are unchanged. | `D/StickBuilder.tsx:36–45`; U4 `:323`, `:537–547` |
| E3-03 | Fixed | Look-here "Look here. Is there a corner?" Explore line "Watch the dot go around. Is there a corner?" Browser: the 2nd miss on CFU Q3 says and lights it. | U3 `:74`, `:256` |
| E3-05 | Fixed | `nameFlatMixedStep` hint: "It is flat. Look at its corners." / circle "It is flat and round." `nameSolidMixedStep` hint: "Round all over? A point on top? Like a block?" The solid-only name steps (`nameSolidStep`, the real-thing step, U2 Test) keep "Round? A point on top? Like a block?": their buttons are all solids, so there is no circle look-alike. | U2 `:423`, `:432` |
| E3-06 | Fixed | U1 Explore key line: "A square's 4 sides are all the same." U2 part-step Show me: "Look: its 4 sides are all the same. It is a square." | U1 `:366`; U2 `:390` |
| E3-07 | Fixed | "You can pick it up." everywhere: the U2 flat-or-solid Show me and explain, and U2 Test "A cone is solid. You can pick it up." No "hold it" is left in the lab. | U2 `:371–372`; U2T `:31` |

Also updated: `vocabulary.md` and `plan.md` (see §3). The shell is unchanged. It already passes `onRetrySame` with the retry lock and records solves with `recordSolve`.

**One vocabulary note for the checkers:** the vocabulary list had *trace* under "avoided" (round 1, E1-21: "face/trace" for a cube's face). C3-03's agreed line uses "Trace the end." I followed the merged list and moved the word: *trace (the end)* is now taught in U2 Explore with the traced-circle picture, and *trace* for a face stays avoided.

## 3. Changed files

**Shared (other labs affected):**
- `src/pages/math-levels/shared/engine/UnitTest.tsx`: the Test scroll (portrait + landscape, picture top kept, re-check). Affects every `EarlyLearnerProvider` lab: MK1, MK2, MK3, MK4, MG1, MG2. Older-grade labs are untouched (`early` is false).
- `src/pages/math-levels/shared/styles/lab-base.css`: `.lab-early .test-question` scroll-margin now outside the landscape query. Same six labs.
- `src/pages/math-levels/shared/engine/StepProblem.tsx` and `shared/engine/types.ts`: `CustomStep.render`'s optional-to-call `onEdit`. Every lab with custom steps uses these files. Only MK4 calls it. MK1, MK2, MG3, MG6, MG7, MG8, MG9 and MG11 are unchanged by construction (checked: none of their render functions takes a third parameter).

**MK4:**
- `MK4/ShapesLab/diagrams/`: `Shape2D.tsx`, `RealObjects.tsx`, `StickBuilder.tsx`, `ComposeShapes.tsx`
- `MK4/ShapesLab/units/`: `NamingShapesAndPositions.tsx`, `FlatOrSolid.tsx`, `FlatOrSolidTest.tsx`, `SidesAndCorners.tsx`, `BuildingAndCombiningShapes.tsx`, `BuildingAndCombiningShapesTest.tsx`
- `_planning/Grade-K/ShapesLab/vocabulary.md`: *trace (the end)*, *missing (a stick)* for the cube, "Look at the rows", plus avoided *hold it* and *close it all the way around* for a cube
- `_planning/Grade-K/ShapesLab/plan.md`: round-3 notes for U2, U3 and U4

`ModuleTest.tsx` is not edited. It doesn't use `builtShapeRotatedQuestion`.

## 4. New or rewritten student text

- **U1:** Explore key line "A square's 4 sides are all the same."
- **U2:**
  - Explore "Look at the end of the can. Trace the end. You get a circle."
  - Practice Show me "Look: it is like a real thing. You can pick it up." and explain "It is solid. You can pick it up."
  - Part-step Show me "Look: its 4 sides are all the same. It is a square."
  - Name hints "It is flat. Look at its corners." / "It is flat and round." / "Round all over? A point on top? Like a block?"
  - Test explain "A cone is solid. You can pick it up."
  - Picture label (not shown, not voiced by the lab) "the end of the can, traced".
- **U3:**
  - Look-here "Look here. Is there a corner?"
  - Explore "Watch the dot go around. Is there a corner?"
  - Practice prompt "Look at the rows. How many extra?"
  - Hints "Look at the end of the long row." (unchanged) / "The circle has none. Count the other row."
  - Show me (circle) "The circle has none. The extra ones are 1, 2, 3." (up to "…1, 2, 3, 4, 5, 6." for a hexagon)
  - Show me (two rows, unchanged): "Line them up. The extra ones are 1, 2." / "Line them up. There is 1 extra one."
- **U4:**
  - Practice "Build a cube like this one."
  - Cube wrong try (Practice and Explore) "Not yet. A stick is missing."
  - Test "It got turned. What shape is it now?" with explains "It is still a square." / "It is still a triangle."
- **Shared:** no new text. A custom step's wrong-try line now disappears on the child's next tap.

## 5. Verification

| Check | Result |
|---|---|
| `npx tsc --noEmit -p tsconfig.app.json` | Pass (0 errors) |
| `npx eslint` (MK4 folder, `StepProblem.tsx`, `UnitTest.tsx`, `types.ts`) | Pass: 0 errors. 68 warnings: all `react-refresh/only-export-components` (the usual pattern; +2 from the new local `StickTurnedPair` and the `CUBE_BUILD_REASON` export) plus the shell's older unused-disable warning. |
| `npx vite build` | Pass. Only the usual chunk-size warning, and no "does not provide an export" warnings. |
| Test/unit import check | Pass. No Test imports its unit. `StickTurnedPair` is local to `U4T`. |
| Brute force (esbuild bundle of the real files; 4,000 draws per bucket; 20,000 sittings per Test and Module Test) | Pass. All choices are valid and unique. Repeated questions per sitting: 0 in all 5 Tests. The new U4 turned item is Square 49% / Triangle 51%. Only the known "(2D)/(3D)" false positive for "later answer on screen". Sentences over 8 words: only the count-along Show me lines ("…1, 2, 3, 4, 5, 6."), as in round 2. I read every new template (circle and two-row cases, all name hints). |
| `node scripts/english-check.cjs --grade K` (MK4) | 454 strings, 13 flagged. All are the round-2 false-positive kinds (plurals whose count is never 1, CSS keyframes, button rows and the Home hero read as one string, "This one is closed." as passive), plus the new picture label. I shortened that label to 6 words, and it is never spoken by the lab. Task text 0/172 and after-answer text 0/72 over 8 words. |
| Test layout, all `.lab-early` labs (every question of every unit Test and Module Test, one sitting each; every answer button, pad key, box, Check and Previous/Next checked against the screen edge and the read-aloud bar; picture top must be on screen) | **After: 0 questions with a control off screen, covered, or a picture top above the screen, in MK1, MK2, MK3, MK4, MG1 and MG2, at all three sizes.** (Measured 700 ms after each question opens; 18 lab × size runs.) **Before** (same script, 400 ms): portrait 820×1180 failed MK1 13/45 questions (U1 4, U2 2, U3 4, U4 3), MK3 9/30, MK4 2/10 (U4), MG1 1/10 (U3) and MG2 16/60 (U1 2, U2 3, U3 5, U5 3, Module 3). Landscape 1180×820 failed MG2 U2 1/10 and Module 1/25: picture top −101 (C3-04). Landscape was otherwise 0 before and after. The "before" counts include the Previous/Next buttons below the fold. |
| MG2 C3-04 targeted run (U2 Test, 1180×820, 6 sittings, sampled at 0–700 ms) | Before: picture top −101 px on 2 of 6 sittings ("12/16. How many tens and ones?" after a tall "9x" question with the floating pad open). After: the same draws are at −101 for the first 200 ms, then 12 px, with the whole question on screen. |
| MG2 floating pad opened by a tap (every two-box question in 3 sittings, at 1180×820, 1366×768 and 820×1180, measured 1.1 s after the tap) | Picture top ≥ 12 px in every case; all 12 keys on screen; the pad never covers the boxes. At 1366×768, with the tallest pictures (76, 98) the pad's corner overlaps the empty lower-right corner of the picture frame (no rods covered) and part of the read-aloud bar's "Speed" label. See §6. |
| Browser, MK4 Practice help ladder (820×1180, touch, speech logged; wrong at every step) on the changed kinds: U2 circle/sphere pair (end of the can), U2 classify (name step), U3 "Two shapes" with a circle and without, U4 build, cube, compose, many ways | Pass. Each custom step's wrong try shows one line ("Not yet. There is a gap." / "Not yet. A stick is missing." / "That piece does not fit." / "It is full! Same pieces. Try different pieces."). **After the next tap the line is gone**, with the hint, the try count and (after 2 tries) Show me still there. The can's Show me shows the traced circle. The U3 rows show separate, countable sticks or dots before help; the circle case says "The circle has none. Count the other row." Then "Solved, with help.", no ⭐ shown or spoken, and "Try one like it" gives the same kind. No page errors. |
| Browser, U3 CFU (wrong ×3 then right on all 4) | Pass. Q3's 2nd miss says "Look here. Is there a corner?" and lights "Watch the dot go around. Is there a corner?" Practice unlocks, and the CFU stays on screen. |
| Browser, U4 Test turned item (820×1180) | Pass. Straight → arrow → turned stick square/triangle, 3 shuffled name buttons, and the results list shows "It is still a square." |

Screenshots: `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\11570f8e-5763-44a1-af9f-c5e70aecc6ac\scratchpad\fix3\shots\`
- `u3-explore-{Shape1}-{Shape2}.png`: the rows
- `u3-rows-circle-s2-before.png`, `u3-rows-s2-*.png`: Practice rows, before help, wrong, Show me
- `u2-explore-can.png`, `u2-pair-can-s2-showme.png`: the traced circle
- `u4-*-try*-afteredit.png`: the line gone after the next tap
- `u4-test-turned-*.png`
- `cfu-u3-cfu-q3-lookhere.png`
- `mg2-padfocus-*.png`
- `after/{lab}-{size}-{test}-q*.png` (first question of each Test, and any question that failed), `before/…` (the same, before the change)

The temporary harness (`fix3-harness.html`, `src/fix3Harness.tsx`) is deleted. My dev server (port 5297) is stopped. The leftover round-2 Vite server on port 5263 (a `node vite --port 5263` started at 10:14) was stopped at the start.

Still worth a manual pass on a real iPad:
- whether the Test scroll feels natural in portrait (it now moves the page when a question opens low);
- iOS speech for "2D";
- tapping the cube's clay balls.

## 6. Noticed, not fixed

1. **Show me in the two-row case still says "Line them up. The extra ones are 1, 2."** E3-04 changed the prompt and named only the circle-case Show me. The two-row Show me is a narration over the picture, so it is less of a problem, but "Look at the rows." would match the prompt.
2. **MG2 two-box questions at 1366×768 with the floating pad open:** with the tallest pictures, once the page scrolls back so the picture top shows, the pad's best spot overlaps the empty corner of the picture frame and part of the read-aloud bar's "Speed" label. Nothing the child needs is covered. The optional two-column layout for floating-pad questions (`.test-question:has([data-numpad])`) would remove this if the next review wants it.
3. **The first 200–450 ms of a question can still show the old scroll** when the floating pad's smooth scroll from the last question is still running. It is corrected automatically. A real child takes longer than that between questions, so they are unlikely to see it.
4. **The `lookHere` ring goes away on the next tap** along with the wrong-try line (it is keyed on the feedback line in `StepProblem`). This matches typed steps (`onChange` also clears feedback), and the picture's help (dashed guide, ringed spot) stays, because it is keyed on the try count.
5. **Proposed rules (Stage 6):** the merged list's proposals are not edited into the builder or guidelines. Two more from this round:
   - (all grades) A custom step that grades its own work should call `onEdit()` on the student's next action, so a wrong-try line never sits beside fixed work.
   - (K–1) The Test scroll is shared and now covers portrait. The builder's "Number pad on a landscape iPad" note could say that portrait is checked too, including the picture top.
