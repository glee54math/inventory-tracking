# MK4 Shapes Lab: Round 2 curriculum review (re-review)

- **Lab:** MK4 `ShapesLab` ("Shapes Lab"), 4 units + 20-question Module Test.
- **Round:** 2, re-review. **Date:** 2026-11-25.
- **Grade band assessed:** K–1. The students are Kindergartners and 1st graders seeing this for the first time, plus 2nd graders who are behind. They work alone on an iPad, most can't read, and they rely on the voice.
- **Inputs:** `round-1-merged.md` (with 6 user decisions, not re-opened), `round-1-fixes.md`, my `round-1-curriculum.md`, the updated `plan.md`, the builder rules, and every MK4 file (shell, 4 units, 4 Tests, Module Test, `labParts.ts`, all diagrams, including the new `RealObjects.tsx`).
- **Independence:** I did not read any round-2 English report.
- **How I checked:**
  - I read all the changed code as new code.
  - I ran the real lab in Chromium from a temporary harness and dev server (port 5241, both removed afterward). I took full-page screenshots of the Unit 2 and Unit 4 Explore at 820×1180, and walked the Unit 1 and Unit 4 Tests at 1180×820. Screenshots: `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\11570f8e-5763-44a1-af9f-c5e70aecc6ac\scratchpad\r2\shots\`.
  - I also viewed some of the fixer's screenshots (same scratchpad, `pw\shots\`), and say so wherever I use one as evidence.
  - I worked out the picture geometry from the drawing code.
  - No lab file was changed. The fixer changed no shared code, so I did not need to check other labs' problem types.

## 0. Status of last round's fixes

| ID(s) | Status | Note |
|---|---|---|
| E1-01 | Fixed | Every word pick names its choices in the prompt. |
| E1-15 + C1-17 | Fixed | The sentence is "The ball is … the box. Where is the box?" The answer changes with the scene, and the help rings the box. |
| E1-21 + C1-24 | **Fixed, but caused a new problem** | The front of the cube is now taught before it is tested, but every cube is drawn with a front that is a wide rectangle. See **C2-01**. |
| E1-26 | Fixed | The prompt says "Or are they the same?", and the Test answer varies. |
| E1-30 + C1-09 (U4 Q10) | Fixed | The gap picture has Yes and No versions, and gaps are taught first. |
| C1-29 + C1-30 + E1-33 | **Fixed, but caused new problems** | Real building, turning pieces and "fill it a new way" are all in. I accept the CFU twin deviation, because the builder's twin rule backs it (see C2-10). New problems: the cube has no model to copy (**C2-05**), and the strip "squares" are tall rectangles (**C2-02**). |
| C1-15 | Fixed | The new real-object buckets in Units 1 and 2 have pictures, help, a typed step, a Test item and a Module Test item. A small issue is in C2-11. |
| C1-11 + E1-08 | Fixed | Unit 1 now has a tap-to-number sides and corners line. |
| C1-01 | Fixed | All 20 CFU questions have early Look-here pointers. No spot shows its question's answer. |
| C1-02 | Fixed | |
| C1-03 | Fixed | |
| C1-04 + C1-21 + E1-16 | Fixed | Every type's picture changes on the first wrong try. Every Unit 2 step has Show me. |
| C1-05 + E1-07 + C1-27 | **Fixed, but caused a new problem** | Asking the name first in Unit 2 means step 1 now gives away step 2's flat or solid answer. See **C2-03**. |
| C1-06 | Fixed | Every type has a typed step. The Unit 1 ball count is weak (C2-07). |
| C1-07 | Fixed | The Tests come in a new order each sitting, and the answers vary. The front of the cube is still always "Square" (C2-09). |
| C1-08 | Fixed | |
| C1-09 + E1-02 + E1-31 | Fixed | |
| C1-10 | **Fixed, but caused a new problem** | No question repeats exactly. But Unit 1's Q6 and Q7 can both be the same "above" scene with the same prompt (C2-08). My own round-1 pool suggestion caused this. |
| C1-16 | Fixed | |
| C1-18 | Fixed | `fitSize` keeps every shape within 90 units of the center. |
| C1-23 + E1-23 + E1-24 + E1-25 | Fixed | No shading cue is taught. Soft and plain-line versions are mixed in. |
| C1-25 + E1-27 | Fixed | The sides are laid out as sticks. There is an equal-sided triangle and a long, thin one. |
| E1-03 | Fixed | |
| E1-04 | Fixed | |
| E1-05 + C1-13 | Fixed | |
| E1-06 | Fixed | |
| E1-17 | Fixed | |
| E1-18 + C1-22 + C1-20 | Fixed | The demo turns the shape back to straight and holds it there. |
| E1-32 + C1-12 | Fixed | |
| C1-31 | Fixed | |
| E1-09 + C1-14 | Fixed | |
| E1-10 | Fixed | |
| E1-11 | Fixed | A search finds no "click". |
| E1-12 | Fixed | |
| E1-19 | Fixed | |
| E1-20 | Fixed | |
| E1-28 | Fixed | A search finds no "vs." |
| E1-29 | Fixed | |
| C1-19 | Fixed | |
| C1-26 | Fixed | |
| C1-28 | Fixed | |
| C1-32 | Fixed | The question is now typed: "How many sticks meet at this ball?" |
| C1-33 + E1-35 | Fixed | No "panel" text is left. |
| E1-34 | Fixed | |
| E1-37 | Fixed | |
| E1-22 (voice) | Fixed in text; voice unverified | How an iPad voice says "2D" is still unchecked. |
| E1-13 | Fixed | |
| E1-14 | Fixed | |
| Fixer rule | Fixed | The shell diff changes text and ReadAloud only. The retry lock, `recordSolve` and the help ladder are unchanged. |

**Totals: 49 Fix rows. 45 are Fixed and 4 were fixed but caused a new problem. None is Not fixed.**

## 1. Verdict

**Ready after fixes.** Round 1's fixes turned this into a real teaching lab, with real building, real composing, picture help and honest Tests. But one new problem teaches the wrong thing:
- Every cube in the lab is drawn with a front that is a wide rectangle.
- The lab says "It is a square", and Show me says "the front has 4 sides the same".
- Unit 1 has just taught that a rectangle has 2 long sides.

**New findings: 1 Blocker, 4 Major, 9 Minor, 1 Polish.**

## 2. Top 5 changes

1. **Draw the cube with a square front (C2-01).** This affects `Solid3D`, `CubeFrameBuilder` and the block picture.
2. **Draw the strip "squares" as squares (C2-02).** Right now the 1-square piece is 27 × 44.
3. **Stop Unit 2's naming step from giving away "flat or solid" (C2-03).** Ask flat or solid first, then the name, with flat and solid names mixed in the buttons.
4. **Show a cube to copy (C2-05).** Show it beside the cube builder in Explore and in Practice, the way the flat-shape build already shows the target shape.
5. **Fit the first Test question on a landscape iPad (C2-04).** Use MK2's landscape rule, or scroll the question into view when the Test starts.

## 3. Scorecard (changed parts)

| Layer | U1 | U2 | U3 | U4 |
|---|---|---|---|---|
| 1 Standards | Strong | Strong | Strong | Strong |
| 2 Audience | OK | OK | Strong | OK |
| 3 Learning arc | Strong | OK | Strong | Weak: no cube to copy in Explore |
| 4 Getting unstuck | OK: some CFU show-it pictures don't change | Strong | Strong | OK |
| 5 Pictures | OK | **Weak: the cube front is a rectangle** | Strong | **Weak: cube front and strip squares are rectangles** |
| 6 Math accuracy | Strong | **Weak: "the front has 4 sides the same" is false for the drawing** | Strong | Weak: "Make a square in front" |
| 7 Mastery integrity | OK: the ball count is only 1 or 2 | **Weak: step 1 gives away step 2** | Strong | OK |
| 8 Device | Weak: landscape Test Q1 | Weak: landscape Test Q1 | Weak: landscape Test Q1 | OK: small cube balls |

## 4. All findings

### Unit 2 and Unit 4: pictures

**C2-01 · Blocker · Layers 5 and 6 · The "front of the cube" is drawn as a wide rectangle, but the lab says it is a square.**
- **Who:** every student, and most of all the one who learned in Unit 1 that "a square has 4 sides the same; a rectangle has 2 long sides."
- **Evidence:**
  - `Solid3D.tsx:63–75`: the front runs from `cy − 0.3s` to `cy + 1.05s` (1.35s tall) and is 2s wide, so it is about 1.48 times wider than tall.
  - The same shape appears in `CubeFrameBuilder.tsx:16–19` (92 × 62) and in the block in `RealObjects.tsx:223–227`.
  - The text over it: Explore says "Look at the front of the cube. It is a square." (`FlatOrSolid.tsx:314`). Practice's `frontStep` Show me says "the front has 4 sides the same. It is a square." (`:371`). The Test asks about the front (`FlatOrSolidTest.tsx:112–118`). The Unit 4 hint says "Make a square in front." (`BuildingAndCombiningShapes.tsx:500`).
  - Screenshot `r2\shots\u2-explore-full.png`: the ringed front is plainly a long rectangle.
- **Fix:** draw the front as a true square (2s × 2s), keep the slanted back, and move the center so it fits in the 200 × 200 picture. Do this in all three files. Check every place a cube appears: Unit 2 Explore, rows, Practice and Test; Unit 4 CFU Q4/Q5, the builder, Practice and Test; and the block picture. Take screenshots.

**C2-02 · Major · Layers 5 and 6 · The strip's "squares" are tall rectangles.**
- **Who:** every student in "Fill it up", the CFU strip question and Test Q6. The words say "Add 1 square" and "N squares long" over pieces that look like Unit 1's rectangle.
- **Evidence:** `ComposeShapes.tsx:306–317`: each square space is 30 wide and 48 tall, and a piece is 27 × 44. See the fixer's screenshot `pw\shots\p13-u4-Fill_it_up-s2-wrong1.png`.
- **Fix:** make the strip height equal to one square space (for example 36 × 36), so a 1-square piece is a square and a 2-square piece is 2 squares long. Check strips 3–8 long at 820 px.

### Unit 2: Flat or Solid?

**C2-03 · Major · Layer 7 · Step 1 gives away step 2's "flat or solid" answer.**
- **Who:** the guesser. The unit's core skill (K.G.3: is it flat or solid?) never has to be decided in the classify problems.
- **Evidence:** `FlatOrSolid.tsx:405–412`, `:424–426`.
  - In the flat problem, step 1 is "What shape is it?" with only flat names (Triangle, Square, …).
  - In the solid problem, step 1 is "What solid is it?" with only solid names. The word "solid" is in the prompt.
  - Step 2 then asks "Is it flat (2D) or solid (3D)?" with step 1's prompt and answer still on screen.
  - See the fixer's screenshot `pw\shots\p3-u2-Shapes-s2-wrong1.png`: "Triangle" sits above "Is it flat or solid?"
  - This came from the C1-05 fix ("ask the name first").
- **Fix:**
  - Ask "Is it flat (2D) or solid (3D)?" first, with explains that don't name the shape ("It is solid. You can hold it.").
  - Then ask "What is its name?", with flat and solid names mixed in the buttons (for a cube: Cube / Square / Cone; for a square: Square / Cube / Triangle). Then a "Square" pick is a real check of the square-or-cube trap.
  - Keep the prompt neutral: no "solid" in it.

**C2-09 · Minor · Layer 7 · "Look at the front of the cube. What shape is it?" is always Square.** This is in Practice (`frontStep`) and on the Test (`cubeFrontQuestion`). The buttons are shuffled, but the right word never changes, so a student can learn "tap Square". **Fix:** add a twin item, taught in Explore first: "Look at the end of the can. What shape is it?" (Circle), or "the bottom of the cone" (Circle). Draw at random between them in Practice and on the Test.

### Unit 4: Build Shapes

**C2-05 · Major · Layers 3 and 4 · There is no cube to copy, in Explore or in Practice.**
- **Who:** the first-timer who can't read. Explore says "Build a cube. Join the clay balls.", but the picture is only 8 dots (`BuildingAndCombiningShapes.tsx:288–293`; screenshot `r2\shots\u4-explore-full.png`).
- **Evidence:**
  - Explore's cube builder has no model and no guide. A wrong "Is it closed?" only says "Not yet. There is a gap." So in Explore, where students are meant to learn it, a student who doesn't already know what a cube frame looks like can't find out.
  - Explore is also the CFU Q4/Q5 Look-here spot.
  - Practice build3D step 0 also shows only dots before a wrong try (`:491`). The flat build, by contrast, shows the target shape (`:457`).
- **Fix:** put a `CubeFramePreview` (or `SolidGlyph` cube) beside the Explore cube builder, the way the flat-shape builder shows its `ShapeGlyph`. Show the same model in Practice build3D step 0 before help. Optional: give the Explore builder a "Show me" that draws the guide dashes.

**C2-10 · Minor · Layer 3 · The CFU's "more than one way" question (Q6) is answered Yes, and so is its twin.** I accept the fixer's deviation: the builder's twin rule needs the same answer kind. But the CFU now never checks a strip with a gap, and a student who always taps "Yes" passes Q6. **Fix (keeps the twin rule):** make Q6 typed. Show 3 strips: two full in different ways and one with an empty square. Ask "How many strips are full?" (2). Point "Look here" to the strip spot.

**C2-13 · Minor · Layer 4 · "Fill it a new way" calls a reordered fill "the same way" but doesn't say why.** For example, 1 + 2 after 2 + 1 (`NewWayFiller`, `:645`). The builder rule ("A true answer that doesn't count says why") wants a reason. **Fix:** "It is full! You used the same pieces. Use different pieces." The English checker owns the wording.

**C2-14 · Minor · Layer 8 · The cube build's clay balls are small.** The balls are drawn with radius 6 on a board at most 240 px wide (`:292`, `:505`), so each dot is about 7 px across and the tap circle is about 40 px. That is 24 taps for a K hand. The fixer flagged this too. **Fix:** cube `ballR` 9 and a wider cube board (about 300 px). Check on a real iPad.

### Unit 1: Name It. Where Is It?

**C2-06 · Minor · Layer 4 · Some CFU "show it" pictures don't change.**
- **Evidence:**
  - Q4 and Q5: `showPicture` is the same scene as `picture` (`NamingShapesAndPositions.tsx:127–128`, `:158–159`).
  - Q2 and Q3: the picture is the same in every state (`:99`, `:114`), but the show line counts "1, 2, 3".
  - Unit 4 Q5 is the same: the line says "One goes across, one goes down, one goes back", but nothing lights (`BuildingAndCombiningShapes.tsx:126`).
- **Fix:**
  - Q4 and Q5: pass `help` to `PositionScene` in `showPicture` (the hidden part blinks, or the arrow shows).
  - Q2 and Q3: number the asked shapes in "show"/"done".
  - Unit 4 Q5: light the 3 sticks at the ringed ball.

**C2-07 · Minor · Layer 7 · "How many balls are above/below/beside the box?" is always 1 or 2.** The code is `manyBalls`, `:517`. A guesser who types 1 or 2 is right half the time. **Fix:** add a third spot per area (or allow 0), so the answer is 0–3, decided first and balanced.

**C2-08 · Minor · Layer 7 · Two Test questions can be the same in practice.** `positionAboveBelowQuestion` (above/below) and `positionBesideAboveQuestion` (beside/above) both draw "above" in about 25% of sittings. That gives the same picture, the same prompt and the same answer, with different buttons. My round-1 pool suggestion caused this. **Fix:** make Q7 "beside" only (left or right side), with buttons Beside / Above / In front of. Or use below/beside, keeping Q6 above/below with no overlap of right answers.

**C2-11 · Minor · Layer 5 · Some real-object pictures have extra corners inside.** The door has two inner panels and the window has crossbars (`RealObjects.tsx:141–143`, `:173–175`). "How many corners does the door have?" (4) can be counted as 12 by a careful counter. The help dots are on the 4 outer corners only. **Fix:** drop the door panels and the window crossbars, or draw them very faint and thin, so the only corners are the outside ones.

**C2-15 · Polish · Layer 2 · Explore says "It is still a triangle!" when nothing has been turned or resized** (`:303`). **Fix:** say "It is a {shape}." until the student turns it or changes its size.

### All units

**C2-04 · Major · Layer 8 · On a landscape iPad (1180×820), the first Test question's buttons or number pad are below the fold.**
- **Evidence:**
  - Unit 3 Test Q1 shows only the 1–3 row of the pad. 4–9, 0, ⌫ and Check are off screen, and the read-aloud bar covers part of the rest (the fixer's `pw\shots\u3-test-landscape.png`).
  - Unit 1 Test Q1 shows only 1 of 3 answer buttons (`r2\shots\land-u1-q1.png`).
  - Later questions do fit, because the page has scrolled down (`land-u1-q5.png`, `land-u4-q3-pad.png`).
  - The builder rule (MK2, user-approved) says every key and Check must be on screen without scrolling at 1180×820.
  - The fixer called this shared layout. But MK2 fixed the same problem in its own stylesheet (`MK2_AdditionSubtractionAndTeenNumbersLab_styles.css:124–139`: in landscape, picture and prompt on the left, pad on the right).
  - The picture box is also much taller than these small shapes need.
- **Fix:** copy MK2's landscape rule into `MK4_ShapesLab_styles.css`. MK4 is the second lab to need it, so the builder's "promote on the second consumer" rule says promote it into `lab-base.css` under `.lab-early`, after checking MK1–MK3 and MG1–MG2. Also consider having `UnitTest` scroll the question into view on start (shared code: check every K lab). Then re-check Q1 of all 4 Tests and the Module Test at 1180×820 and 1366×768.

**C2-12 · Minor · Layer 4 · A wrong try on a built step shows two messages.** For example: "Not yet. There is a gap." and then "Not a match. Try again." (the fixer's `pw\shots\p11-…-s1-wrong1.png`, `p12-…`). The second one is the engine's generic line and tells a non-reader nothing new. This is shared `StepProblem` code (the fixer noticed it too). **Fix (shared, check other labs):** let a custom step pass its own reason, and skip the generic line when it does.

## 5. Persona walkthrough highlights

- **The behind 2nd grader in Unit 2 Explore.**
  - What they see: "Look at the front of the cube. It is a square." The ringed front is clearly longer than it is tall.
  - What happens: in Unit 1 they learned "A square has 4 sides the same. A rectangle has 2 long sides." Now the lab tells them a long shape is a square, and "Show me" repeats "4 sides the same."
  - Result: they either stop trusting the rule or learn that "square" can be long (C2-01).
- **The guesser in Unit 2 Practice.**
  - What happens: they tap names until one is right, then see "What solid is it? Cube" above "Is it flat or solid?" and tap "Solid".
  - Result: a clean solve every time, with no flat-or-solid thinking (C2-03).
- **The first-timer in Unit 4 Explore.**
  - What happens: "Build a cube" shows 8 dots. They join a few, tap "Is it closed?", and hear "Not yet. There is a gap." No picture shows what a cube looks like.
  - Result: they leave Explore without the idea. In Practice, they need a wrong try before the guide appears (C2-05).

## 6. What's working well

- **Real building and composing.** A wrong join, a wrong piece or a wrong turn is now possible and counts as a wrong try. "Is it closed?" checks before any praise. The "new way" step rejects the same mix.
- **Picture help everywhere.** Corner dots, a dot running round the circle, the hidden part blinking, the box ringed, sides laid out as sticks, extra sticks ringed, and the clue part outlined. Each one appears on the first wrong try and doesn't print the answer.
- **Unit 2 teaches the idea.** Flat means "like a drawing" and solid means "you can pick it up", with a real thing beside each solid. Soft-filled flat shapes and line-drawn solids break the shading shortcut.
- **Tests are honest.** Every question has a picture, the order is new each sitting, the answers vary, the U3 "the same" answer is right half the time, and the picture choices are spoken as "the first picture".
- **Look-here spots** never show the question's answer, and Explore switches to a different example when a spot is opened.

## 7. Rule gaps (proposed for `math-lab-builder.md`; not edited)

1. **Named shapes must be drawn true** (source: MK4 round 2; all grades). "Anything the lab calls a square (a cube's front, a strip's square, a tile) is drawn with equal sides, checked from the drawing code. A projected 3D drawing keeps its front face true (MK4 drew the cube's front 1.48:1 and said 'It is a square')."
2. **An earlier step's prompt or answer must not decide a later choice** (source: MK4 U2; all grades). This adds to the existing rule. "If step 1's prompt or button set shows the category ('What solid is it?', only flat names), a later 'which category?' step is given away. Ask the category first, or mix the categories in step 1's buttons."
3. **Every build sandbox shows what to build** (source: MK4 U4; K–2). "A build step or Explore builder shows a model of the target (the shape, or the cube frame) next to the builder, before any help."
4. **Landscape Test layout** (source: MK4, after MK2; K–1). "MK2's landscape Test layout is promoted to `lab-base.css` for `.lab-early`. Check the FIRST question of each Test at 1180×820, before any scrolling."

## 8. What I could not check

- How an iOS voice reads "Flat (2D)" / "Solid (3D)".
- Real tap accuracy on the cube's small balls and the tray pieces, on a real iPad.
- I did not re-walk the full help ladder on all 14 problem kinds in the browser. I relied on the code and the fixer's walk and screenshots, which I spot-checked.
- I did not run a new 20,000-sitting brute force. My C2-07 and C2-08 numbers come from reading the generators.
- Whether real Kindergartners read the "behind" scene (a sliver of ball above and to the left of the box) as "behind" rather than "above". This was also open in round 1.
