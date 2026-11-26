# ShapesLab

**Proposed slot:** MK4 — provisional, confirm at build time per project convention.
**Grade:** K
**Standards covered:** K.G.1 (describe objects in the environment using shape names and positional terms — above, below, beside, in front of, behind, next to), K.G.2 (name shapes regardless of their orientation or overall size), K.G.3 (identify shapes as two-dimensional "flat" or three-dimensional "solid"), K.G.4 (analyze and compare 2D and 3D shapes using informal language — number of sides, number of vertices/corners, equal side lengths), K.G.5 (model shapes in the world by building/drawing shapes — sticks, clay balls, etc.), K.G.6 (compose simple shapes to form larger shapes).
**Relationship to existing labs:** No existing coverage — first lab for this domain.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Every unit should use visual shape images/manipulable pieces (draggable shape pieces, rotated shape images) rather than relying on a student already knowing shape names — introduce each shape name and show several oriented/sized variants of it before ever quizzing recognition.

## Units

### Unit 1: Naming Shapes and Positions
- **Goal:** You will be able to name common shapes and describe where something is using words like above, below, beside, and behind.
- **Standard:** K.G.1, K.G.2
- **Buckets:**
  - Name a shape shown in its "standard" orientation and size (e.g. an upright square at a typical size) — the easy baseline case
  - Name the SAME shape shown rotated (e.g. a square tilted 45 degrees so it looks like a diamond) or resized (much larger/smaller than the baseline) — this is the specific skill K.G.2 calls out, and the genuinely hard case, since students commonly believe a rotated square becomes "a diamond," a different shape
  - Describe an object's position relative to another using a positional word (above/below/beside/in front of/behind/next to) in a simple scene
  - Identify which positional word correctly matches a described position among several plausible-sounding choices (e.g. distinguishing "beside" from "in front of" in an ambiguous-looking layout) — a vocabulary-precision bucket, not just free description
  - **What shape is it? (added 2026-11-25, review round 1, C1-15, user decision):** name the flat shape of a real object (clock/cookie → circle, door/book → rectangle, pizza slice → triangle, window → square), then count its corners. Bucket `realObject2D`; in the Unit Test and Module Test.
- **Also added in round 1 (user decision):** Unit 1 Explore teaches *side* and *corner* with a tap-to-number square, so Units 1–2 may use the words; the "where is the box?" reverse-position step stays (reworded: "The ball is above the box. Where is the box?").
- **Requires intro (CFU gate):** Yes — this is the first unit in the lab; common misconception is that a rotated/resized shape is a different or "new" shape (e.g. calling a tilted square a "diamond" as if it's not a square at all), which the CFU should directly target per K.G.2's explicit intent.
- **Memorization fact (periodic re-check candidate):** Yes — shape names (square, circle, triangle, rectangle, hexagon) are a small, fixed vocabulary set meant for long-term recall, and positional-term meanings are similarly fixed vocabulary worth periodic re-checking.

### Unit 2: Flat or Solid? (2D vs. 3D)
- **Goal:** You will be able to tell whether a shape is flat (2D) or solid (3D), and name common solid shapes.
- **Standard:** K.G.3
- **Buckets:**
  - Classify a clearly flat shape (square, circle, triangle, rectangle, hexagon) as 2D
  - Classify a clearly solid shape (cube, cone, cylinder, sphere) as 3D
  - Distinguish a 2D shape from the 3D solid it's commonly confused with due to a shared name/look (e.g. a circle vs. a sphere, a square vs. a cube) — the genuinely hard discrimination case, since the shapes look similar in a flat on-screen image
  - Name the specific solid shape shown (cube, cone, cylinder, sphere), not just classify it as "solid" — a production bucket distinct from the flat/solid classification itself
  - **What solid is it? (added 2026-11-25, review round 1, C1-15, user decision):** name the solid of a real object (can → cylinder, ball → sphere, block → cube, party hat → cone). Bucket `realObject3D`; in the Unit Test and Module Test.
- **Round 1 (C1-23):** taught as "flat: like a drawing; solid: you can pick it up", with a real object beside each solid; no shading cue. Every problem ends with a typed "How many flat/solid shapes?" count. The cube's front ("It is a square.") is taught in Explore and Practice before the Test asks it. **Round 2 (C2-03, C2-09):** classify problems ask "Is it flat (2D) or solid (3D)?" first, then "What is its name?" with flat and solid names mixed on the buttons; the end of the can ("It is a circle.") is taught beside the cube's front, and the part question draws from both, so its answer is Square or Circle. **Round 3 (C3-03):** the can's end is also shown traced on paper as a true circle (an arrow from the ringed can), in Explore ("Trace the end. You get a circle.") and in that Practice step's Show me; the Test keeps the ringed can only.
- **Requires intro (CFU gate):** Yes — the circle/sphere and square/cube pairs are a well-known conflation point, especially since both members of each pair are drawn on a flat screen; the CFU should directly ask the student to distinguish a 2D shape from its 3D counterpart rather than assuming the distinction is obvious.
- **Memorization fact (periodic re-check candidate):** Yes — the names of the 3D solids (cube, cone, cylinder, sphere) are a small fixed vocabulary set worth long-term memorization and periodic re-checking, parallel to the 2D shape names in Unit 1.

### Unit 3: What Makes a Shape a Shape (Sides and Corners)
- **Goal:** You will be able to look at a shape and describe it using words like sides, corners, and equal sides.
- **Standard:** K.G.4
- **Buckets:**
  - Count the number of sides on a given 2D shape
  - Count the number of vertices/corners on a given 2D shape
  - Determine whether a shape's sides look equal in length or not (e.g. a square's sides vs. a non-square rectangle's sides) — a comparison bucket distinct from simple counting
  - Compare two DIFFERENT shapes using these attributes (e.g. "a triangle has fewer sides than a hexagon") — the genuinely harder cross-shape comparison, not just describing one shape in isolation
  - **Round 3 (C3-01, E3-04):** the second step ("Look at the rows. How many extra?") shows the two shapes' sides (or corners) as rows lined up from the start, each stick drawn apart so it can be counted, and each row starting with a small copy of its shape. With a circle, its row is empty ("The circle has none. Count the other row.").
- **Requires intro (CFU gate):** No — this unit is extended practice applying vocabulary and shape recognition already gated in Units 1 and 2; "sides" and "corners" are introduced here as descriptive terms but build directly on shapes the student can already name, so this is analysis practice rather than a new foundational concept.
- **Memorization fact (periodic re-check candidate):** No — side/corner counts can always be re-derived by looking at and analyzing the shape in front of the student; nothing here needs to be memorized as a standalone fact (the shape NAMES themselves are already covered as facts in Units 1-2).

### Unit 4: Building and Combining Shapes
- **Goal:** You will be able to build a shape out of simple materials and put smaller shapes together to make a bigger one.
- **Standard:** K.G.5, K.G.6
- **Buckets:**
  - Model/build a given 2D shape from components (e.g. arranging sticks to form a triangle, or identifying which stick arrangement correctly forms a named shape)
  - Model/build a given 3D shape from components (e.g. clay balls and sticks forming the frame of a cube) — a distinct modality/dimension from the 2D building case
  - Compose two or more given simple shapes to form ONE specified larger shape (e.g. two triangles making a square, or two squares making a rectangle) — a single correct target shape
  - Compose given simple shapes into a larger shape with MORE THAN ONE valid arrangement/solution (e.g. several different ways to combine the same pieces to fill an outline) — the genuinely open-ended case where there isn't one single correct piece placement
- **How building works (changed 2026-11-25, review round 1, C1-29/C1-30, user decision "real building"):** only the clay balls are shown (plus one ball that is not a corner); the student taps two balls to join them with a stick, can take a stick off, and taps "Is it closed?" — a gap or an extra stick is a wrong try. The cube is built the same way from its 8 clay balls. Then "How many sticks / clay balls?" (typed) and "Which one has no gap / no extra stick / every stick?" (picture buttons). Composing: the student picks a piece (one piece in the tray does not fit), turns it with a "Turn" button, and taps the spot for it; a wrong piece or turn is a wrong try; then names the big shape, counts the pieces, and answers "Do these make one shape?" (gap or touching). "Many ways": fill a strip with 1-square and 2-square pieces, then fill it a new way (the same mix is rejected: "That is the same way."), then count the pieces. The CFU checks "more than one way" with three strips, two full in different ways and one with an empty square ("How many strips are full?", typed; round 2, C2-10). **Round 2 (C2-05):** a cube to copy is shown beside the Explore cube builder and in the Practice cube build before any help; the same mix in a new order is "Same pieces. Try different pieces." (C2-13). **Round 3:** the cube build says "Build a cube like this one." and a missing cube stick is "Not yet. A stick is missing." (E3-02); a builder's wrong-try line goes away as soon as the child taps again (C3-02, shared `CustomStep.render` `onEdit`); the Unit Test's turned stick shape is shown straight → arrow → turned and asks "What shape is it now?" (Square / Triangle / Rectangle; E3-01).
- **Requires intro (CFU gate):** Yes — composing shapes (K.G.6) is a new constructive skill, not just recognition; common misconception is believing pieces must be combined edge-to-edge in only one "obvious" way, when multiple valid compositions exist, which the CFU should surface with a true multiple-solution example.
- **Memorization fact (periodic re-check candidate):** No — building and composing shapes is a hands-on constructive/spatial-reasoning skill performed fresh each time, not a fact to recall.

## Open questions / flags for the builder
- K.G.1's positional-term vocabulary (above/below/beside/in front of/behind/next to) and K.G.2's orientation-independence skill are grouped into one unit here since both are foundational "describing what you see" skills; the builder could split them into two units if Explore content for each grows large enough to feel crowded — flagging as a layout judgment call, not a hard requirement.
- Unit 4's "model shapes from components" (K.G.5) is inherently more open-ended/constructive than the rest of this lab's content, which is mostly recognition/classification — the builder should decide how to represent "building with sticks/clay" in an interactive diagram (e.g. draggable line-segment pieces snapping into a shape outline) since this may need a genuinely new shared diagram rather than reusing something from an existing lab.
- This lab has no numeric/arithmetic content at all (pure geometry vocabulary and spatial reasoning), so bucket design leans heavily on vocabulary precision and visual discrimination traps rather than numeric edge cases — flagging so the builder doesn't expect a numeric-range-style bucket list here.
