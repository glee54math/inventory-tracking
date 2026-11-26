# MK4 Shapes Lab: Round 1 curriculum review

- **Lab:** MK4 `ShapesLab` ("Shapes Lab"), 4 units + 20-question Module Test.
- **Round:** 1, a full review of an existing lab. There is no round-0 build report. **Date:** 2026-11-25.
- **Grade band assessed:** K–1. The students are Kindergartners and 1st graders seeing this for the first time, plus 2nd graders who are behind. They work alone on an iPad, most can't read, and they rely on the voice.
- **Standards:** K.G.1–K.G.6. I used the condensed reference (`CCSS_K8_STANDARDS_REFERENCE.md`) and the approved plan. Two findings (C1-15, C1-16) depend on the full wording of K.G.1 ("describe objects in the environment using names of shapes") and K.G.4 ("in different sizes and orientations"; "two- and three-dimensional shapes"). That wording comes from my memory of the CA CCSS. I did not fetch it again.
- **Prior lab:** `LAB_NEEDS` lists only MK1 for MK4. I used the MK1–MK3 vocabulary lists and this lab's own `vocabulary.md`, not a full read of MK1's units.
- **Independence:** I did not read any English-checker report.
- **How I checked:** I read the plan, the vocabulary list, the shell, all 4 units, all 4 Tests, the Module Test, every diagram, and the shared `KCheck`, `StepProblem`, `UnitTest` and `choice` code. I compared the shell with MK3's reviewed shell. I bundled the real Test files and ran 20,000 sittings of each Test and of the Module Test to count fixed answers, repeated questions and guess odds. I checked picture sizes by working out the geometry by hand. **I did not run the lab in a browser** (see section 8). No lab file was changed.

## 1. Verdict

**Needs rework before students use it alone.** The shell is sound: the CFU gate, the "Try one like it" retry lock and honest stars are all there, copied from MK3. The teaching is the problem:
- Practice and Tests can be passed without the skill. Answers are printed by an earlier step, given away by color, or the same every time.
- When a student is stuck, the picture never changes to help.
- Unit 4's "build" and "compose" tasks are taps on an outline that is already drawn.

**Counts: 0 Blocker, 21 Major, 10 Minor, 2 Polish (33 findings).** Two need the user's decision (C1-15, C1-29).

## 2. Top 5 changes

1. **Stop finished steps from printing the next answer (C1-05).** In Units 2 and 4, every problem shows the next step's answer on screen before it is asked. For example, "You built a cube frame using 12 sticks and 8 clay corners" appears right above "How many clay corners?"
2. **Remove the color tells and the fixed answers (C1-07, C1-08).** Flat shapes are always green and solid ones orange or blue. On the Unit 4 Test, the right picture is never orange. Many Test slots have the same answer every sitting, and the order never changes, so a student who has seen the results once can pass.
3. **Make the picture help when a student is stuck (C1-03, C1-04).** No Practice picture changes after a wrong try. Unit 2 has no Show me demo at all. Seven two-button CFU picks lock after one miss and never play their demo. Add `pointing()` help, `look` pointers and `twin` questions.
4. **Give every problem type a typed step, and replace the reading-only Test items (C1-06, C1-09).** Units 1 and 2 are all word buttons. Five Test items have no picture and are read-only sentences or true/false.
5. **Make Unit 4 real building (C1-29, C1-30).** Students should choose where the sticks go and find a second way to fill a shape. Right now they tap dashed gaps and always answer "Yes."

## 3. Scorecard

| Layer | U1 Naming & Positions | U2 Flat or Solid | U3 Sides & Corners | U4 Building & Combining |
|---|---|---|---|---|
| 1 Standards and sequence | Weak: no real-world objects (K.G.1); sides/corners used before taught | OK | Weak: no solids, no turned or resized shapes (K.G.4) | Weak: building has no decisions |
| 2 Audience | Weak: true/false and a garbled Test sentence | Weak: true/false, "face", "shading" | OK | Weak: 4 Test items with no picture |
| 3 Learning arc | Weak: CFU answers in Explore, no pointers | Weak: Key Idea teaches "shading"; Test asks about faces | Weak: Explore prints the CFU answer | Weak: plan's "more than one way" CFU missing; gap/stray never taught |
| 4 Getting unstuck | Weak: no picture help; two-button CFUs dead-end | Weak: no Show me demo anywhere | OK on counts; Weak on equal sides | Weak: no picture help on choices |
| 5 Pictures | Weak: rectangle clipped on the Test | Weak: color tells flat from solid | OK | Weak: right Test picture never orange |
| 6 Math accuracy | OK | OK | OK (the triangle's two long sides nearly match) | OK |
| 7 Mastery integrity | Weak: no typed step; step 2 always "Yes" | Weak: no typed step; names printed | Weak: compare step 2 = step 1 | Weak: every step copyable or fixed |
| 8 Device | OK (not browser-checked) | OK | OK | Unverified: "panel on the right" |

### Standards coverage

| Standard part | Unit | Practice bucket | Test question | Gap |
|---|---|---|---|---|
| K.G.1 positions (above/below/beside/in front of/behind) | 1 | positionDescribe, positionVocabPrecision | Q6–Q8, Q10 | "Next to" is only in Explore text |
| K.G.1 describe real objects with shape names | — | — | — | **Missing (C1-15)** |
| K.G.2 name shapes whatever their turn or size | 1 | standardOrientation, rotatedOrResized | Q1–Q5, Q9 | Some "turned" shapes look unturned (C1-19) |
| K.G.3 flat vs solid | 2 | classify2D, classify3D, circleVsSphereSquareVsCube | Q1–Q6, Q9 | Color and shading tell the answer (C1-08, C1-23) |
| K.G.3 name solids | 2 | nameSolid | Q7, Q8 | — |
| K.G.4 sides, corners, equal sides (2D) | 3 | countSides, countCorners, equalSidesCompare, crossShapeCompare | Q1–Q10 | Shapes always upright and the same size |
| K.G.4 compare 3D shapes | — | — | U2 Q10 (faces), U4 Q8 | **Not taught (C1-16, C1-24)** |
| K.G.5 model from sticks and clay | 4 | build2D, build3D | Q1–Q3, Q7, Q8 | Tapping a drawn outline (C1-29) |
| K.G.6 compose shapes | 4 | composeSingleTarget, composeOpenEnded | Q4–Q6, Q10 | No choice in placement; second way never asked (C1-29, C1-30) |

### CFU coverage and proposed Look-here spots

Typed share: U1 2 of 5, U2 2 of 5, U3 3 of 4, U4 3 of 5. Every unit meets the 40% rule. **No question has a `look` pointer.**

| Unit, question | Answer | Explore teaches it? | Practice bucket / Test | Proposed Look-here spot |
|---|---|---|---|---|
| U1 Q1 turned square (2 buttons) | Square | Yes ("Flip / rotate it") | rotatedOrResized / Q3 | Shape turner; open it on a triangle so the spot doesn't say "Square" |
| U1 Q2 count triangles | 3 | Partly (one shape at a time) | rotatedOrResized / Q5 | Shape turner with Size |
| U1 Q3 count squares (rectangle trap) | 3 | **No**: square and rectangle never shown side by side | none / none | New "square or rectangle?" pair line |
| U1 Q4 in front of (2 buttons) | In front of | Yes | positionVocabPrecision / Q8 | Position picker set to "In front of" |
| U1 Q5 below (2 buttons) | Below | Yes | positionDescribe / Q6 | Position picker set to "Above" (so it doesn't show the answer) |
| U2 Q1 hold it (2 buttons) | Sphere | Partly (text only) | trap bucket / Q5 | Flat/solid pair |
| U2 Q2–Q3 count solids / flats | 3, 2 | **No** mixed row | classify buckets / Q1–Q4 | New mixed-row line |
| U2 Q4 round is not solid (2 buttons) | Flat | Partly | trap bucket / Q9 | Flat/solid pair at circle–sphere |
| U2 Q5 name cylinder | Cylinder | Yes (picker) | nameSolid / Q7 | Solid picker, opened on cone |
| U3 Q1 square sides | 4 | Yes | countSides / Q1 | Tap-to-count shape |
| U3 Q2 triangle corners | 3 | **Printed by default:** "Triangle: 3 sides, 3 corners" | countCorners / Q4 | Tap-to-count shape (change the compare default) |
| U3 Q3 circle corners | 0 | **No**: tap-to-count has no circle | countCorners / Q5 | Add the circle to the compare pickers' teaching line |
| U3 Q4 square vs rectangle (2 buttons) | Yes | Yes (compare) | crossShapeCompare / Q8 | Compare pair |
| U4 Q1 sticks for a triangle | 3 | **Printed by default** once built: "3 of 3 sticks placed — you built a Triangle!" | build2D / Q7 | Stick builder opened on square |
| U4 Q2 two triangles make | Square | **Printed by default:** "together they make a Square!" | composeSingleTarget / Q4 | Compose, opened on squares→rectangle |
| U4 Q3 squares in rectangle | 2 | Yes | composeSingleTarget / Q5 | Compose squares→rectangle (prints 2; needs a 3-square recipe) |
| U4 Q4 clay balls on cube | 8 | Yes | build3D / Q8 | Cube builder |
| U4 Q5 balls are corners (2 buttons) | Corners | Partly | none / none | Cube builder |

## 4. All findings

### All units

**C1-01 · Major · Layer 3 · No CFU question points back to Explore.**
- **Who:** every student after a 2nd miss on any of the 19 CFU questions.
- **Evidence:** no `look` prop in any `PickCheck`/`TypeCheck` in the 4 unit files. No `lookHereSpot` anywhere in `MK4/`. MK2 and MK3 have both.
- **Fix:** add `look` with a short `say` line to every question, and mark the spots in the table above with `lookHereSpot`. First add the teaching spots that are missing (U1 Q3, U2 Q2–Q3, U3 Q3). No spot may show its question's answer (see C1-02).

**C1-02 · Major · Layer 3 · Explore prints some CFU answers right above the CFU.**
- **Who:** the guesser, who copies instead of counting.
- **Evidence:**
  - Unit 3's compare section opens on triangle vs hexagon and prints "Triangle: 3 sides, 3 corners" (`SidesAndCorners.tsx:122, :165`). CFU Q2 then asks how many corners the triangle has.
  - Unit 4's stick builder opens on triangle. When filled, it says "3 of 3 sticks placed — you built a Triangle!" (`BuildingAndCombiningShapes.tsx:123, :172`). CFU Q1 asks how many sticks make a triangle.
  - Unit 4's compose section opens on triangles→square and says "together they make a Square!" (`:136, :208`). CFU Q2 asks what two triangles make.
- **Fix:** open the Unit 3 compare on square vs hexagon, the Unit 4 stick builder on square, and the compose section on squares→rectangle. Unit 4 Q3 then needs a 3-square rectangle recipe, so its answer differs from the 2 Explore shows.

**C1-03 · Major · Layer 4 · Seven two-button CFU picks dead-end after one miss.**
- **Who:** the first-timer and the guesser.
- **Evidence:** without `look`, a tried button locks at once (`KCheck.tsx:161–162`), so `showAfter` (2 misses) is never reached. The written demos never play on these 7 picks: U1 Q1 (the turning demo), U1 Q4, U1 Q5, U2 Q1, U2 Q4, U3 Q4 (the count-both-shapes demo), U4 Q5.
- **Fix:** with C1-01, give each one a `twin` with new pictures and the same kind of answer, as in MG1 U6 Q2. Examples: a turned triangle; "Where is the ball?" with behind/beside.

**C1-04 · Major · Layers 4 and 5 · No Practice picture changes when a student is stuck.**
- **Who:** the first-timer who can't read the hint.
- **Evidence:**
  - No unit calls `pointing()` (grep finds no match).
  - Show me demos exist on only 6 steps: U1 "Name the shape" step 2; U3 count steps and the compare picks; U4 build steps 2.
  - Unit 2 has no `showMe` on any step.
  - Unit 1's position problems have none. Their hint "Does anything overlap or hide part of the other object?" is the only help.
- **Fix, one per type, on the first wrong try:**
  - U1 name: number the corners with dots.
  - U1 position: blink the hidden part of the ball or box, or draw an arrow from the box to the ball.
  - U2 flat/solid: show the shape next to a real object ("like a ball", "like a sheet of paper"); see C1-23.
  - U2 name: outline the clue part (the point of a cone, the two round ends of a cylinder).
  - U3 equal sides: lay the sides out as sticks in a row (C1-25).
  - U4 compose: blink the outline of the new shape.

**C1-05 · Major · Layer 7 · A finished step prints the answer to the next step.**
- **Who:** the guesser, who copies it and earns a clean solve.
- **Evidence:** a finished step stays on screen with its answer chip and `explain` (`StepProblem.tsx:568–580`).
  - U2 classify2D, classify3D and the tricky-pair problems: step 1's explain names the shape ("A cube is solid (3D)…", `FlatOrSolid.tsx:230, :246, :268, :285`). Step 2 then asks "What is the name of this shape?"
  - U4 build2D: step 1 shows "Built using 3 sticks" (`BuildingAndCombiningShapes.tsx:343`). Step 2 asks "How many sticks did you need?"
  - U4 build3D: step 1's explain says "…12 sticks and 8 clay corners" (`:366`). Step 2 asks how many clay corners.
  - U4 composeSingleTarget: step 1 shows "Makes a Square" (`:393`). Step 2 asks "What shape did you just build?"
  - U3 crossShapeCompare: step 2 ("MORE corners?") always has the same answer as step 1 ("MORE sides?"). Step 1's explain says so (`SidesAndCorners.tsx:296–303`).
- **Fix:**
  - Keep every step's `explain` and `resultText` free of later answers ("You built it!", "Yes, it is flat.").
  - In U2, ask the name first and flat/solid second, as nameSolid already does.
  - In U3, replace step 2 with a typed step that needs a second count, such as "How many more sides does the hexagon have?" (counting on). Or ask about corners of a different pair.

**C1-06 · Major · Layer 7 · Many problem types have no typed step.**
- **Who:** the guesser.
- **Evidence:** every step in Unit 1 and Unit 2 is a word-button pick. U3 crossShapeCompare and U4 composeSingleTarget and composeOpenEnded have no typed step either. A blind guesser's clean-solve odds:
  - U1 position: 1 in 9.
  - U1 name: 1 in 3, because step 2 is always "Yes".
  - U2 classify: 1 in 6, or 1 in 3 using the color tell (C1-08).
  - U3 compare: 1 in 3, because step 2 repeats step 1.
- **Fix:** add one number-pad step that needs the idea to each type. Examples:
  - U1 name: "How many corners does it have?" (once Unit 1 teaches corners; see C1-11).
  - U1 position: "How many balls are below the box?" in a scene with several balls.
  - U2: "How many solid shapes?" with a mixed row, like CFU Q2.
  - U3 compare: "How many more sides?"
  - U4 compose: "How many triangles make this square?"

**C1-07 · Major · Layer 7 · Answers that never change.**
- **Who:** the guesser and the memorizer.
- **Evidence:**
  - Practice: U1 "Name the shape" step 2 is always "Yes — turning it never changes…" (`NamingShapesAndPositions.tsx:244`). U4 open-ended step 2 is always "Yes" (`:439`). U4 build3D step 2 is always 8.
  - Tests (20,000 sittings each): fixed answers in 2 of 10 slots in U1, 8 of 10 in U2, 6 of 10 in U3, 7 of 10 in U4, and 12 of 20 in the Module Test. `UnitTest` keeps the question order (`UnitTest.tsx:67`).
  - A student who remembers U2's results screen gets 8 right and needs 1 of the 2 remaining picks (1 in 4 and 1 in 3), so they pass about **50%** of the time. In U4, a memorizer plus the color tell (C1-08) passes **every time**.
- **Fix:** vary which side is right. Ask U2 Q5/Q6 with either member of each pair. Make the U3 "equal sides" slots draw Yes or No at random. Replace the fixed verbal items (C1-09). Shuffle the Test order, or draw both easy items from one mixed pool.

**C1-08 · Major · Layers 5 and 7 · Color gives the answer.**
- **Who:** the guesser and the first-timer, who trust color first.
- **Evidence (MK4 palette: a = green, b = orange, c = blue):**
  - Unit 2 Practice: flat shapes are always green; solids are orange or blue (`FlatOrSolid.tsx:228, :244, :265, :282`). Explore does the same (`:192, :198`).
  - Unit 2 CFU Q2/Q3: "How many solid shapes?" is "count the orange ones" (`:24–42`).
  - Unit 4 Test: the right picture is green or blue and the wrong one is always orange (`BuildingAndCombiningShapesTest.tsx:45–46, :69–70, :94–95`).
- **Fix:** draw all shapes in one question in the same color. In Unit 4, draw both pictures in the same tone. Vary colors only across problems, never by answer.

**C1-09 · Major · Layer 2 · Test items a non-reader can't do: no picture, or true/false.**
- **Who:** the first-timer, who hears a long sentence with nothing to look at.
- **Evidence:**
  - Unit 1: Q9 is true/false with no picture. Q10 is a long sentence (C1-17).
  - Unit 2: Q9 is true/false with no picture. Q10 asks about tracing one face of a cube.
  - Unit 4: Q6 is true/false. Q7, Q8, Q9 and Q10 have `visual: null` and are recall or reading only.
  - Four of these are in the Module Test: U1 Q9, U2 Q9, U4 Q6 and U4 Q10.
- **Fix:** turn each into a picture question.
  - Turning: show a turned hexagon and ask "What shape?"
  - Round is not solid: show a flat circle and a ball, and ask "Which is flat?"
  - Only one way: show two different full strips and ask "Do both fill it?", with the answer varying.
  - Gap: show two triangles with and without a gap and ask "Which makes one shape?"
  - Sticks for a hexagon and cube corners: show the picture and ask for the count.

**C1-10 · Major · Layer 7 · The same question can appear twice in one Test.**
- **Evidence (20,000 sittings):** **U1: 18.5%** of sittings have two questions with the same picture, prompt and buttons. Q1 and Q2 can both be an upright hexagon, and Q7 and Q8 can both be the "behind" scene with the same three buttons. **U2: 66%** of sittings show the same shape and question twice in a different color: Q1/Q3 (triangle or hexagon), Q2/Q4 (cone or cylinder), Q7/Q8 (cube or sphere). The target is 0.
- **Fix:** draw each pair from separate pools. Examples: U1 Q1 from circle/rectangle/triangle and Q2 from square/hexagon; U2 Q2 cone and Q4 cylinder; U2 Q7 cone/cylinder and Q8 cube/sphere; U1 Q7 beside/above and Q8 in front of/behind.

**C1-11 · Major · Layers 1 and 3 · Units 1 and 2 use "sides" and "corners" as the strategy before Unit 3 teaches them.**
- **Who:** the first-timer. The hint tells them to do something they haven't learned.
- **Evidence:**
  - Unit 1 CFU Q1 says "Count its sides and corners." (`NamingShapesAndPositions.tsx:52`), and Q2–Q3 use the same idea (`:66, :78`).
  - Unit 1 Practice hints say "Count the sides and corners" (`:232, :241`), and Test hints repeat it.
  - Unit 2 classify2D's name hint "Count its sides." is also used for a circle (`FlatOrSolid.tsx:231`). U2 CFU Q5 says "A cube has flat square sides."
- **Fix (pick one):**
  - **A (recommended):** add a short "corners" picture line to Unit 1 Explore (tap the corners, and they number 1, 2, 3, 4). Unit 3 then deepens it.
  - **B:** make Unit 1's help purely visual, through `pointing` numbered corner dots and "Look: 1, 2, 3, 4. A square.", and drop "sides" from Units 1–2.
  - Either way, drop the circle's "Count its sides."

**C1-12 · Minor · Layer 8 · "Which picture" Test questions use word buttons "Picture A" and "Picture B".** A non-reader has to match a letter label to a picture. **Fix:** use `pictureChoice` (`shared/engine/types.ts`) so the child taps the picture itself (U4 Q1–Q3).

**C1-13 · Minor · Layer 2 · Shell lines and voice are older than MK3's.**
- **Evidence:** "Complete the activity above to unlock practice problems." (`MK4_ShapesLab.tsx:298`) and "Practicing one type is great for extra reps…" (`:321`). The Home title, "Your path" list and Module Test card are not read aloud (`:84–126`). MK3 fixed these (decision D12).
- **Fix:** copy MK3's shell lines and `ReadAloud` wrappers.

**C1-14 · Polish · Layer 8 · CFU numbers repeat.** U1 numbers its questions 1, 2, 3, 4, 4; U2 1, 2, 2, 3, 4; U4 1, 2, 3, 4, 4. The voice says the same number twice. **Fix:** number 1–5.

### Standards

**C1-15 · Major · Layer 1 · K.G.1's "describe objects in the environment using names of shapes" is not taught. Needs the user's decision.**
- **Evidence:** the only objects are a ball and a box in the position scenes. No step asks what shape a real thing is. The plan's buckets cover positions only, though its standards line names both parts.
- **Options:**
  - **A (recommended):** add a Unit 1 bucket "What shape is it?" with simple object pictures (clock → circle, door → rectangle, slice of pizza → triangle). Add a matching Unit 2 bucket (can → cylinder, ball → sphere, block → cube, party hat → cone). This also fixes C1-23.
  - **B:** leave this part to classroom work and note it in the plan.

**C1-16 · Major · Layer 1 · K.G.4 is taught for flat shapes only, always upright and the same size.**
- **Evidence:** every Unit 3 picture is drawn at scale 1 and rotation 0 (`SidesAndCorners.tsx:198–200`). No solid's parts are counted or compared in Unit 3, yet U2 Test Q10 (faces) and U4 Test Q8 (cube corners) depend on them.
- **Fix:** draw Unit 3 shapes at a random turn and size, as Unit 1 does; this also links K.G.2. Add one solid comparison, such as "How many corners does the cube have?" or "Which has a point, the cone or the cylinder?", or move the cube items to Unit 4 only.

### Unit 1: Naming Shapes and Positions

**C1-17 · Major · Layers 2 and 6 · The "point of view" question is garbled on the Test and beyond K.G.1 in Practice.**
- **Evidence:**
  - Test Q10 reads: "The ball is above the box. From the BOX's point of view, where is the ball... I mean, where is the BOX, compared to the ball?" (`NamingShapesAndPositionsTest.tsx:179`). The voice reads this self-correction aloud.
  - Practice step 2 asks "From the BALL's point of view, where is the box?" with the hint "Above/below swap, in front of/behind swap" (`NamingShapesAndPositions.tsx:276–277`). Swapping relations is not in K.G.1, and the hint teaches a word rule, not a look at the picture.
- **Fix:** replace the step and the Test item with a second picture question: "Now the box is on top. Where is the ball?" (a new scene). Or, as a typed step, "How many balls are beside the box?" in a scene with several balls. Remove `reciprocalRelationQuestion`.

**C1-18 · Major · Layer 5 · The big rectangle is cut off at the picture's edge.**
- **Evidence:** `shapeOutline` draws the rectangle with half-width `size × 1.15`. On Test Q4 the scale is 1.5, so 62 × 1.5 × 1.15 = 107. That is wider than the 100-unit half-width of the 200 × 200 picture, so both short sides are cut off (`NamingShapesAndPositionsTest.tsx:65`, `Shape2D.tsx:72–74`). The shape then looks like an open band. Explore's "Large" (1.4) with a 45° turn also clips the rectangle (half-diagonal 113) and the square's corners (100.4).
- **Fix:** cap the scale per shape so the turned half-diagonal is at most about 92, or widen the viewBox. Then render each shape at the smallest and largest scale and at 45°, and look at them.

**C1-19 · Minor · Layer 5 · Some "turned" shapes don't look turned.** The rotation pool is `[30, 45, 60, 90, 120, 150, 180, 225, 270, 315]` (`NamingShapesAndPositions.tsx:128`). A square at 90/180/270 looks upright, a rectangle at 180 looks the same, and a hexagon at 60/120/180 looks the same. The story still says "This shape has been turned." **Fix:** pick from rotations that visibly change each shape (square and hexagon: 15–40°; rectangle: anything but 180).

**C1-20 · Minor · Layer 4 · CFU Q1's demo doesn't do what it says.** The show text is "Watch it turn back. It is still a square." The demo spins the tilted square a full 360° and stops tilted again (`Shape2D.tsx:156–158`). **Fix:** animate from 45° to 0° and hold, so the "diamond" becomes the plain square.

**C1-21 · Minor · Layer 4 · The position hint is wrong for above and below.** "Does anything overlap or hide part of the other object?" is the hint for every scene (`NamingShapesAndPositions.tsx:270`), but nothing overlaps in above, below or beside scenes. **Fix:** write one hint per relation ("Is the ball higher or lower than the box?" for above/below) and add the picture help from C1-04.

**C1-22 · Polish · Layer 3 · The Explore button "Flip / rotate it" turns the shape; it never flips it** (`:153–155`). Flipping is a different move. **Fix:** "Turn it", matching the CFU word.

### Unit 2: Flat or Solid?

**C1-23 · Major · Layer 3 · The unit teaches "look for shading," a picture trick, not the idea of flat and solid.**
- **Evidence:**
  - The Key Idea says "shading that shows depth is the real tell" (`FlatOrSolid.tsx:324`). Explore says to notice the shading (`:175`).
  - The tricky-pair stories give the answer: "look closely at the shading" for solids and "look closely: no shading at all" for flats (`:264, :281`).
  - The CFU teaches something else: "Which one can you pick up and hold?"
  - A student who learns "shaded = solid" will call a shaded circle or a line-drawn cube wrongly. No picture in the lab tests the rule from the other side (the builder rule on verifying taught statements from more than one direction).
- **Fix:**
  - Teach "flat: like a drawing on paper; solid: you can hold it" with a real-object picture beside each solid (see C1-15 A).
  - Keep the CFU's wording in Practice hints.
  - Remove the shading clues from the stories.
  - Add at least one solid drawn as a plain line drawing and one flat shape with a soft fill.

**C1-24 · Major · Layer 3 · Test Q10 asks about a cube's "face," which the unit never shows.** "If you traced just ONE flat face of this cube onto paper, what flat (2D) shape would you get?" (`FlatOrSolidTest.tsx:150`). No Explore or Practice item shows a face. **Fix:** remove Q10, or add a Practice step and an Explore line that light up one face of the cube and ask "What flat shape is this part?" before testing it.

### Unit 3: Sides and Corners

**C1-25 · Major · Layers 3 and 4 · "Are the sides the same length?" can't be learned from the picture.**
- **Evidence:**
  - The picture doesn't change on a wrong tap, and the step has no demo (`SidesAndCorners.tsx:238–244`).
  - The hint is "Compare each side's length to the others."
  - The triangle is drawn with sides of about 136, 134 and 112 units (from `shapeOutline`), so two sides look equal and a K student may say "Yes."
  - The answer is "Yes" only for square and hexagon. On the Test, Q6 is always Yes and Q7 always No.
- **Fix:**
  - On a wrong tap (through `pointing`), lift each side out into a row of sticks lined up at one end, as MK3 lines up rods. The difference then shows.
  - Add an equal-sided triangle as a "Yes" case and a clearly long, thin triangle as a "No" case.
  - Draw the Test answer at random.

**C1-26 · Minor · Layer 5 · Counting a circle's sides or corners: the help doesn't change the picture.** The Show me text says "There are no sides to count. That is zero." (`countAlong.ts:42`), but `countingGlyph` draws the plain circle (`SidesAndCorners.tsx:199`). **Fix:** during help, trace the circle's edge with a moving dot and show a big "0" (the builder rule "Help for a part that is 0 must still change the picture").

**C1-27 · Minor · Layer 7 · The answer is on screen.** Test Q10 says "This shape has 4 sides. How many corners does it have?" (`SidesAndCornersTest.tsx:156`), so the student copies the number. In Practice count problems, step 2 always equals step 1's answer, which is still on screen. **Fix:** on the Test, ask corners without giving sides. In Practice, make step 2 ask about a different shape, or "How many more corners does the hexagon have than the square?"

**C1-28 · Minor · Layer 4 · The hint says "Put your finger on one straight side," but the CFU and Practice pictures don't respond to touch.** Only Explore passes `onToggleSide`/`onToggleCorner` (`:148` vs `:29, :199`). **Fix:** let the CFU and Practice `ShapeCountable` number each side or corner as it is tapped, as MK1's `tapToCount` does.

### Unit 4: Building and Combining Shapes

**C1-29 · Major · Layers 1 and 7 · "Build" and "compose" are taps on an outline that is already drawn. Needs the user's decision.**
- **Evidence:**
  - `StickBuilder` draws every corner and a dashed gap for every side. The student taps each gap (`StickBuilder.tsx:27–58`), so they never decide how many sticks a shape needs or where they go.
  - `ComposeSingle` drops the next piece into the next slot whatever is tapped (`ComposeShapes.tsx:124–152`), so no turning or placing is needed.
  - The custom steps can't be answered wrong (`StepProblem.tsx:336`).
  - K.G.5 asks students to *model* shapes and K.G.6 to *compose* them. The builder rule "Standards' verbs are done, not just recognized" applies.
- **Options:**
  - **A (recommended):** show only the clay balls (corners) and let the student tap two balls to join them with a stick, with a "Is it closed?" check before praise. For composing, give two or three outline choices to fill, and let pieces be tapped into a chosen slot and turned with a "Turn" button.
  - **B (smaller):** keep the outline, but first ask "How many sticks will you need?" on the number pad with no outline showing. For composing, first ask "Which outline can 2 triangles make?" with picture buttons.

**C1-30 · Major · Layer 3 · "More than one way" is never practiced or checked.**
- **Evidence:**
  - The open-ended problem accepts any fill, then asks a two-button question whose answer is always "Yes" (`BuildingAndCombiningShapes.tsx:432–441`). Its Show me picture can't be reached, because only one button is left after a miss.
  - The plan says the CFU should "surface [the only-one-way misconception] with a true multiple-solution example." None of the 5 CFU questions does.
- **Fix:**
  - Make step 2 "Fill it a different way," a custom step that rejects the same mix of pieces with "That is the same way. Try another." Then ask "How many dominoes did you use this time?" on the number pad.
  - Add a CFU question showing two strips filled differently: "Do both fill it?" (Yes), with a `twin` where one strip has a gap (No).

**C1-31 · Major · Layer 3 · The Test checks ideas Practice never shows.** The Test has "A stick is missing" (Q1), "an extra stray stick" (Q2), "one cube edge missing" (Q3) and "two shapes with a gap between them" (Q10, words only) (`BuildingAndCombiningShapesTest.tsx:42–112, :212–228`). Practice and Explore only ever show finished, correct shapes. **Fix:** add a Practice step to build2D and build3D: "Which one is a closed triangle?" with picture buttons (gap, extra stick, correct), the wrong ones varying. Add a gap example to the compose problem. Then keep Q1–Q3 and replace Q10 with a picture version.

**C1-32 · Minor · Layer 2 · CFU Q5 is a vocabulary question.** "The clay balls are the cube's... Corners / Sides" (`BuildingAndCombiningShapes.tsx:96–106`) asks for a word, not an idea shown in a picture. **Fix:** "Tap a place where sticks meet" on the cube picture, or "How many sticks meet at this ball?" (3) with one ball ringed.

**C1-33 · Minor · Layer 8 · Unverified: "Use the sticks in the panel on the right."** This is the picture-area text in build2D, build3D and compose (`:337, :362, :388`). On an iPad in portrait the step panel likely sits below the picture, not to its right. I did not check this in a browser. **Fix:** "Tap the dashed lines below." (or wherever the widget renders), and check at 820 × 1180.

## 5. Persona walkthrough highlights

- **The guesser in Unit 4 Practice.** Taps every dashed gap; the step can't be wrong. Step 2 asks "How many sticks did you need?" while "Built using 4 sticks" sits just above it. They type 4 and earn a clean solve. In the cube problem, the explain line above says "8 clay corners." In the open-ended strip, they tap "Yes" every time. All four buckets fill without any building decision (C1-05, C1-07, C1-29).
- **The first-timer in Unit 2.** Hears "Is this shape flat (2D) or solid (3D)?" over an orange cone, taps "Flat", and hears "Not yet" plus "Could you actually pick this up and hold it, with real depth?" Nothing in the picture changes, and only "Solid" is left. Over a few problems they learn "green = flat", which is true every time in Practice (C1-04, C1-08).
- **The behind 2nd grader in the Unit 1 CFU.** Misses Q1 ("A new shape") and hears "Turning does not change the shape. Count its sides and corners." They haven't met "corners" yet. Only "Square" is left to tap, so the turning demo never plays (C1-03, C1-11).

## 6. What's working well

- **The shell is current.** It has the CFU gate for every student, the passed CFU staying open, the "Try one like it" lock with all side doors closed (`drawRef`, used token, disabled type picker, `retryDebt`), and honest stars through `recordSolve`. Module Test `passScore: 19` follows the 5-star rule.
- **Every unit has a K-style CFU**, one question at a time, with at least 40% typed. This includes Unit 3, which the plan had left ungated.
- **Unit 3's count-along demos are good teaching.** Sides light up and are numbered one per beat, paced to the voice, and "Got it" is held until the demo finishes. The CFU's square-then-rectangle count is a strong picture of "same number, different lengths."
- **One source of truth** for side and corner counts and for "sides look equal" (`shapeAttributes`, `sidesLookEqual`), so the picture and the grading can't disagree.
- **The Unit 1 CFU's counting rows** (big, small and turned triangles; squares with a rectangle trap) check K.G.2 through pictures, not words.

## 7. Rule gaps (proposed for `math-lab-builder.md`; not edited)

1. **A finished step's explain and result text must not contain a later step's answer** (source: MK4; all grades). The existing rule covers prompts only. Proposed sentence: "A finished step's `explain`, answer chip and custom `resultText` stay on screen, so none may state a later step's answer (MK4: 'You built … using 12 sticks and 8 clay corners' above 'How many clay corners?')."
2. **Color must not sort the answer classes** (source: MK4; all grades). Proposed: "Within a problem type or Test question, don't draw one answer class in its own color (MK4 drew every flat shape green and every solid orange/blue; Unit 4's wrong Test picture was always orange)."
3. **Teach the idea, not a drawing cue** (source: MK4 Unit 2; K–2, then all grades). Proposed: "When a picture stands for a real-world property (solid, heavy, far), teach the property ('you can hold it') and show real objects. Don't teach a drawing cue such as shading as the rule."
4. **A custom step that can't be wrong is not the unit's skill** (source: MK4 Unit 4; all grades). Proposed: "A custom 'build' step must let the student make a choice that can be wrong (which corners to join, which slot, which way to turn). Tapping every pre-drawn gap is not building."
5. **Keep shapes inside the picture at every scale and turn** (source: MK4; all grades). This extends the existing edge-value rule. Proposed: "For a shape drawn at several scales and turns, check the largest scale at its worst turn (MK4's 1.5× rectangle overflowed the picture on the Test)."

## 8. What I could not check

- **No browser walk.** I did not run the lab at iPad size, walk the help ladder with sound, or take screenshots. Every finding comes from the code and the generator runs. C1-33 is unverified. Picture overflow (C1-18) was worked out from the geometry, not seen.
- Real iPad speech: how "2D/3D", "Picture A" and the shape names are read.
- Whether the "behind" scene (a small crescent of the ball peeking out) reads as "behind" to real Kindergartners rather than "above" or "beside."
- Real students.
