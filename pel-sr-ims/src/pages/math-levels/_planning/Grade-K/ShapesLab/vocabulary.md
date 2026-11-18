# Vocabulary — MK4 Shapes Lab

- **Level:** MK4 · **Lab:** Shapes Lab (`ShapesLab`) · **Grade:** K (K–1 band) · **Standards:** K.G.1–6
- **Written:** 2026-11-18, read from the current code (lab not yet through the review workflow). Unit order: 1 Naming Shapes and Positions → 2 Flat or Solid? → 3 What Makes a Shape a Shape (Sides and Corners) → 4 Building and Combining Shapes.
- **Assumes known from earlier labs:** see `_planning/Grade-K/CountingAndCardinalityLab/vocabulary.md`, `_planning/Grade-K/AdditionSubtractionAndTeenNumbersLab/vocabulary.md`, `_planning/Grade-K/MeasurementAndClassifyingLab/vocabulary.md` (count, how many, more, fewer, the same, compare, longer/shorter, Left/Right as sides, sort, group; MK3 already uses *circle, square, triangle* as bin labels).
- **Fixer:** update this list whenever a fix adds, removes or renames a taught word.

Paths below are relative to `src/pages/math-levels/MK4/ShapesLab/units/`.

## Unit 1: Naming Shapes and Positions

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| shape | CFU "This square got turned. What shape is it now?" `NamingShapesAndPositions.tsx:43` | all | |
| square | CFU `:43–53`, `:74–81` ("A square has 4 sides that are all the same.") | all | |
| triangle | CFU "How many triangles? … Count every shape with 3 sides" `:60–67` | all | |
| rectangle | CFU "The long one is a rectangle, not a square." `:79` | all | |
| circle, hexagon | Explore shape picker `:151` (labels from `../diagrams/Shape2D.tsx:9–13`) | Explore, Practice, Test | *hexagon* is only a picker label + Practice/Test name; never in CFU |
| turned / turn / turning | CFU "Watch it turn back. It is still a square." `:46`; "Turning does not change the shape." `:52–53` | all | |
| big / small / little / upside down | CFU `:64–67`; Explore size "Small / Normal / Large" `:130–132` | CFU, Explore | |
| in front of / beside / next to | CFU "the ball hides part of the box. The ball is in front of the box." `:88–98`; Explore "'Beside' and 'next to' mean the same thing" `:183` | all | |
| above / below / on top / under | CFU "the ball is under the box. The ball is below the box. … Above means on top." `:105–115` | all | |
| behind | Explore position picker (`../diagrams/PositionScene.tsx:13–17`); Key Idea `:301` | Explore, Practice, Test | Not in CFU |
| ball / box | CFU picture `:88` | all | *box* here = a 3D box object (another meaning of *box*) |
| Left / Right ("Which side") | Explore picker `:177` | Explore | Side placement for *beside* |
| **Used before taught:** sides / corners | CFU feedback "Count its sides and corners." `:52`; "Count every shape with 3 sides" `:66`; Practice hint `:232`, `:241`; Test hints `NamingShapesAndPositionsTest.tsx:27, :41, :54, :89, :158` | CFU, Practice, Test | Taught in Unit 3 |
| **Used before taught:** Diamond (as a wrong name) | Practice/Test choices `:200`; `NamingShapesAndPositionsTest.tsx:15, :56` | Practice, Test | Key Idea says a tilted square is "never a diamond" |
| **Used before taught:** rotate / rotating, resize / resized, tilted | Explore button "Flip / rotate it" `:154`; Practice "This shape has been made smaller/bigger" `:217–224`; Key Idea `:300`; Test `NamingShapesAndPositionsTest.tsx:51, :157` | Explore, Practice, Key Idea, Test | CFU word is *turned* |
| **Used before taught:** point of view, swap | Practice "From the BALL's point of view, where is the box? … Above/below swap" `:276–277`; Test `NamingShapesAndPositionsTest.tsx:179–180` | Practice, Test | |
| **Used before taught:** overlap, compared to | Practice hint `:270`; Test `NamingShapesAndPositionsTest.tsx:103, :121, :141` | Practice, Test | |
| **Used before taught:** position | Explore "see which position word fits" `:174` | Explore, title | |
| **Used before taught:** true / false | Test `NamingShapesAndPositionsTest.tsx:157` | Test only | |

## Unit 2: Flat or Solid?

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| flat / solid | CFU "A sphere is solid, like a ball. A circle is flat, like a drawing." `FlatOrSolid.tsx:52–75`; "How many solid shapes?" `:82–89` | all | |
| pick up and hold | CFU "Which one can you pick up and hold?" `:52` | all | |
| sphere | CFU `:68–75` | all | |
| cube, cone, cylinder | CFU "Count the solid ones: the cube, the cone, and the cylinder." `:88`; "It has two round ends and a curved side, like a can. It is a cylinder." `:146` | all | MG2 later uses *cube* for 1 one (a small cube) |
| round / curved | CFU "This circle is round. Is it flat or solid? … Round does not mean solid." `:110–128`; `:146` | CFU, Practice, Test | |
| point (on top) | CFU "A cone has a point on top." `:153` | CFU, Practice, Test | |
| drawing / like paper | CFU `:74`, `:100`, `:127` | CFU, Explore | |
| 2D / 3D | Explore labels "Flat (2D) shape / Solid (3D) shape" `:177–178`; Practice choices "Flat (2D)" / "Solid (3D)" `:230` | Explore, Practice, Test, title | Never said in CFU; voice reads "2 D" |
| **Used before taught:** depth / real depth | Explore `:175`; Practice hint "Could you actually pick this up and hold it, with real depth?" `:230`; Key Idea `:323` | Explore, Practice, Key Idea, Test | |
| **Used before taught:** shading / highlights | Explore `:175`; Practice `:264–268`, `:281–285`; Key Idea `:324`; Test `FlatOrSolidTest.tsx:66, :81` | Explore, Practice, Key Idea, Test | |
| **Used before taught:** face / faces, square-faced, trace | Practice hint "flat square faces" `:272`; Test "If you traced just ONE flat face of this cube…" `FlatOrSolidTest.tsx:81, :116, :150` | Practice, Test | |
| **Used before taught:** cousin ("its flat cousin") | Practice `:264`, `:281` | Practice | Idiom |
| **Used before taught:** true / false | Test `FlatOrSolidTest.tsx:132` | Test only | |

## Unit 3: What Makes a Shape a Shape (Sides and Corners)

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| side / straight side | CFU "Put your finger on one straight side. Count each side once." `SidesAndCorners.tsx:30`; Key Idea "A side is a straight edge." `:322` | all | *side* also = balance side (MK3), equation side (MG1), sign side (MG2) |
| corner / where two sides meet | CFU "Point to each corner, where two sides meet." `:30`; "A corner is a point where two straight sides meet." `:56` | all | |
| 0 corners, 0 sides (circle) | CFU "A circle is round all the way. … 0 corners." `:48–59` | CFU, Practice, Test | |
| the same number of sides / longer sides | CFU "Do the square and the rectangle have the same number of sides? … The rectangle's sides are just longer." `:66–94` | all | |
| Shape A / Shape B, compare | Explore "Now compare two different shapes side by side." `:156–159`; Practice "Compare two shapes" `:281` | Explore, Practice, Test | |
| same length / equal sides | Practice "Are the sides equal? … Do all of its sides look the same length?" `:235–241` | Practice, Test, Goal | *equal* from MK2 |
| edge / curved edge | Key Idea `:322`; Practice hint "A circle's edge is curved, not straight." `:223`; Test `SidesAndCornersTest.tsx:18, :41` | Practice, Key Idea, Test | Not in CFU |
| **Used before taught:** sharp point, never meets itself | Practice hint `:224`; Test `SidesAndCornersTest.tsx:65` | Practice, Test | |
| **Used before taught:** "vs." | Practice show-me "(4 vs. 3)" `:296` | Practice | Voice trap |
| **Used before taught:** total ("have, total?") | Practice `:245` | Practice | |

## Unit 4: Building and Combining Shapes

| Word or phrase | How it's taught | Where it's used | Notes |
|---|---|---|---|
| stick(s) (one stick = one side) | CFU "How many sticks do you need to make a triangle? … Each stick is one side." `BuildingAndCombiningShapes.tsx:39–45` | all | MG2 uses *stick* = 1 ten; see Findings |
| join together / make (a shape) | CFU "Two triangles join together. What shape do they make?" `:52–63` | all | |
| outside (of the new shape) | CFU `:62` | CFU | |
| small square inside the rectangle | CFU "How many squares make this rectangle?" `:70–76` | CFU, Practice | |
| clay balls / clay corners | CFU "How many clay balls does this cube have? … The clay balls are the corners. The sticks are the sides." `:83–106` | all | Cube *sticks* called "sides" in CFU, "edges" elsewhere |
| build / built | Explore "Shape to build" `:153`; "you built a square!" `:172` | Explore, Practice, Test | |
| dashed gap / drop a stick | Explore "click each dashed gap to drop a stick in it" `:151` | Explore, Practice | |
| pieces / put together | Explore "Put two shapes together to make a bigger one" `:192`; "Pieces" `:199` | Explore, Practice, Test | |
| **Used before taught:** edges (of a cube) | Explore "sticks (edges)" `:177`; Practice "Place a stick on every edge of this cube." `:366`; Test "a stick on every edge" `BuildingAndCombiningShapesTest.tsx:103–105` | Explore, Practice, Test | CFU calls the same sticks "sides" (`:106`) |
| **Used before taught:** cube frame / wireframe | Practice title "Build a cube frame" `:353`; "Build a cube's wireframe" `:355`; Test `:103, :187` | Practice, Test | |
| **Used before taught:** compose / composing | Practice title "Compose a shape" `:383`; Test "Did they correctly compose into one bigger shape? … Composing shapes means joining them edge-to-edge" `BuildingAndCombiningShapesTest.tsx:219–221` | Practice, Test | |
| **Used before taught:** strip, domino(es), units, filled exactly | Explore "Add square (1) / Add domino (2)", "units filled" `:214–232`; Practice "Fill the strip — many ways work … squares (1 unit) and dominoes (2 units)" `:411–428` | Explore, Practice, Test | *unit* is avoided in MG2 |
| **Used before taught:** combination / mix | Practice `:434–443`; Test `BuildingAndCombiningShapesTest.tsx:158` | Practice, Test | |
| **Used before taught:** Picture A / Picture B, closed, stray, no gaps | Test `BuildingAndCombiningShapesTest.tsx:47–108` | Test only | |
| **Used before taught:** outline, tray, panel | Practice `:337`, `:388–396` | Practice | Screen-layout words |
| **Used before taught:** true / false | Test `BuildingAndCombiningShapesTest.tsx:158` | Test only | |

## Shell / all units

Same shell words as MK1 (see that list), from `MK4_ShapesLab.tsx:45–473`. Home "Squares, circles, and cubes!" / "Name shapes (even turned or resized), tell flat from solid, count sides and corners, and build bigger shapes out of smaller ones." (`:84–85`).

## Words this lab avoids on purpose

No review folder exists for MK4. Visible in code: *corner* instead of *vertex* (K.G.4 says "vertices/corners"), *flat / solid* first with 2D/3D in parentheses, and *turned* in the CFUs instead of *rotated*.

## Findings

1. **Sides and corners used in Unit 1, taught in Unit 3.** CFU feedback "Count its sides and corners." (`NamingShapesAndPositions.tsx:52`), "Count every shape with 3 sides" (`:66`), "4 sides that are all the same" (`:78`); Practice/Test hints (`:232, :241`; `NamingShapesAndPositionsTest.tsx:27, :41, :54, :89, :158`). **Fix:** in Unit 1 say "Look at it. It is still a square." / point with the picture; or move a short "side / corner" picture into Unit 1 Explore.
2. **"Stick" means a side here and one ten in MG2.** MK4 Unit 4: "Each stick is one side." (`BuildingAndCombiningShapes.tsx:43`). MG2: "A stick is 1 ten." A student who did MK4 may count a ten-stick as one side or one thing. **Fix (decide):** call MK4's pieces *straws* (and MK3's length bars stay *rods*), keeping *stick* for MG2's ten.
3. **Same sticks called "sides" and "edges".** CFU "The sticks are the sides." (`BuildingAndCombiningShapes.tsx:106`) vs Explore/Practice/Test "edges" (`:177, :366`; Test `:103–105`). **Fix:** one word: "sides" in K (and say "a cube has 12 sticks").
4. **Later-grade or untaught words needed to answer:** *compose* (Test `BuildingAndCombiningShapesTest.tsx:219–221`), *face* (Test `FlatOrSolidTest.tsx:150`), *point of view* (`NamingShapesAndPositions.tsx:276`; Test `:179`), *depth / shading* (`FlatOrSolid.tsx:230, :264–285`; Test `:66, :81`), *combination* (Test `BuildingAndCombiningShapesTest.tsx:158`), *units / domino* (`BuildingAndCombiningShapes.tsx:411–428`). **Fix:** "Did they make one shape? Look for a gap."; "Trace one side of the cube. What shape?"; drop the reverse-position item or say "Now where is the box?"; "Could you hold it?"; "Is there another way?"; "1 square, 2 squares long".
5. **Same idea, several words:** *turn / rotate / flip / tilted / resize* for the same move (`NamingShapesAndPositions.tsx:46, :154, :217, :290, :300`); *beside / next to* (taught as the same, OK per K.G.1). **Fix:** *turn* and *bigger / smaller* only. Note "Flip" (`:154`) is a different move from turn.
6. **"Diamond" as a wrong choice** (`NamingShapesAndPositions.tsx:200`; Test `:15, :56`) — never taught, so the student must reject an unknown word. Low risk, but the Key Idea teaches "never a diamond" only in text (`:300`). **Fix:** use a taught shape name as the distractor.
7. **"Box" again with a third meaning** (a 3D box in the position pictures, `NamingShapesAndPositions.tsx:88–115`), next to MK2/MG1's ten-frame "boxes" and MG1/MG2's ☐ "box". Picture-supported, low risk; worth knowing before reusing "box".
8. **True/false in every unit Test** (`NamingShapesAndPositionsTest.tsx:157`, `FlatOrSolidTest.tsx:132`, `BuildingAndCombiningShapesTest.tsx:158`). **Fix:** one new picture example per item.
9. **Hexagon is never in a CFU** — first heard in the Explore picker and Practice; fine for K.G.2 if the picker voices it, but it is the only shape name with no CFU picture.
</invoke>
