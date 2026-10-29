# Angles & Protractor Lab

**Proposed slot:** MG8 or MG9 — provisional, confirm at build time per project convention.
**Grade:** 4
**Standards covered:** 4.MD.5a-b (recognize angles as geometric shapes formed wherever two rays share a common endpoint, understand angle measurement as a fraction of a circular arc, where a "one-degree angle" turns through 1/360 of a circle), 4.MD.6 (measure angles in whole-number degrees using a protractor, sketch angles of a specified measure), 4.MD.7 (recognize angle measure as additive — when an angle is decomposed into non-overlapping parts, the whole's measure is the sum of the parts — solve addition/subtraction problems for unknown angles using an equation).
**Relationship to existing labs:** No existing coverage anywhere in the codebase — this is the first angle-measurement content in the entire K-8 curriculum (nothing in K-3 covers angles numerically; grade 3's geometry work only reaches shape categories, not angle measure).
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Angle measurement is a genuinely new way of thinking about "how big" something is — it isn't a length or a count, it's a rotation amount — so every unit should let a student physically rotate a ray (drag-based interaction) and watch the degree count change, rather than only present static labeled diagrams.

## Units

### Unit 1: What Is an Angle?
- **Goal:** I can recognize an angle as the amount of turn between two rays that share a starting point, and understand that a full circle is 360 one-degree turns.
- **Standard:** 4.MD.5a-b
- **Buckets:**
  - Benchmark angles as fractions of a circle (1/4 turn = 90°, 1/2 turn = 180°, 3/4 turn = 270°) — anchor these to the circle-fraction model directly, not as memorized numbers yet
  - Non-benchmark angles estimated as "between" two benchmarks (e.g. "more than a quarter turn but less than a half turn")
  - Same angle measure drawn with different ray lengths — a required distractor case, since ray length is irrelevant to the angle but is the single most common visual trap at this grade
  - Same angle measure drawn with different overall orientation (rotated on the page) — tests that the concept generalizes beyond a single canonical "opens to the right" presentation
- **Requires intro (CFU gate):** Yes. New concept with a strong, well-documented misconception: students often judge an angle's size by how far apart the ray ENDPOINTS look (influenced by ray length) rather than by the actual amount of rotation between the rays. The Explore tab should let a student stretch a ray's drawn length without changing the angle, and directly confront this with "does the angle get bigger? Let's check."
- **Memorization fact (periodic re-check candidate):** No — understanding degrees as fractions of a circle is a conceptual anchor meant to be reasoned from, not a recalled fact.

### Unit 2: Measuring with a Protractor
- **Goal:** I can use a protractor to measure an angle's size in whole-number degrees.
- **Standard:** 4.MD.6 (measuring direction)
- **Buckets:**
  - Angle already positioned with one ray exactly on the protractor's 0° line (the "easy" alignment case, still real practice since reading the correct scale still applies)
  - Angle in the 0°-90° range read on the protractor's inner scale
  - Angle in the 90°-180° range read on the protractor's outer scale — the single highest-error case at this grade, since a student who defaults to "always read the inner scale" gets a systematically wrong answer here (often the supplementary angle, 180° minus the true value)
  - Angle whose ray is NOT aligned to either protractor edge, requiring the student to mentally reposition or subtract rather than read a number directly off the scale
- **Requires intro (CFU gate):** Yes. New concept with a strong, named misconception: a standard protractor has two scales running in opposite directions, and students very commonly read the wrong one — especially for obtuse angles, where misreading gives a plausible-looking but wrong answer (e.g. reading 50° instead of the correct 130°). The CFU should explicitly walk a student through one 0-90° angle (both scales agree, no trap) and then one 90-180° angle (scales disagree, forces the "which scale makes sense given what the angle looks like" check) before Practice unlocks.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 3: Sketching Angles of a Given Measure
- **Goal:** I can draw an angle of a given size using a protractor.
- **Standard:** 4.MD.6 (sketching direction)
- **Buckets:**
  - Sketch a benchmark angle (90°, 180°) without needing precise protractor placement
  - Sketch a specific whole-number-degree angle (e.g. "draw a 73° angle") using the protractor
  - Sketch starting from a ray that is NOT in the protractor's "natural" starting position (student must align the protractor's center to the ray's endpoint and 0° line to the ray itself, rather than assuming a default orientation)
- **Requires intro (CFU gate):** No — this is the reverse-direction extension of Unit 2's protractor-reading skill (same tool, same scale-selection reasoning, opposite task), so it's covered by that unit's gate rather than needing its own.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 4: Angle Addition & Unknown Angles
- **Goal:** I can find a missing angle measure when I know the whole angle is made of smaller angle parts, using addition and subtraction.
- **Standard:** 4.MD.7
- **Buckets:**
  - Find the whole angle given two or more known parts (straightforward addition)
  - Find one missing part given the whole and the other part(s) (subtraction — the "undo" direction, structurally identical to the classic missing-addend word-problem trap seen in earlier-grade addition/subtraction work)
  - Three-or-more-part decomposition (angle split into three+ non-overlapping pieces, one unknown)
  - Represented as a written equation with a symbol for the unknown angle, not just a diagram — tests the symbolic-representation half of the standard, not only the visual-diagram half
- **Requires intro (CFU gate):** Yes. New concept: angle measures add when angles share a vertex and sit side-by-side with no overlap — this needs to be explicitly shown (not assumed obvious), since a student's prior experience with "adding" has mostly been about counts or lengths, not rotations, and some students initially doubt that rotations can simply be summed like lengths can.
- **Memorization fact (periodic re-check candidate):** No.

## Open questions / flags for the builder
- Sequence this lab before LinesAnglesAndShapeClassificationLab (this grade's other new lab) if both are built around the same time, so the acute/right/obtuse vocabulary from Unit 1 here is already established before that lab's shape-classification work needs it.
- The interactive protractor component (draggable ray, live degree readout, correct-scale highlighting) does not appear to exist yet anywhere in `shared/diagrams/` — this will likely be a new shared primitive, and a good promotion candidate the moment a second consumer appears (e.g. if a future higher-grade geometry/trigonometry lab needs angle measurement again).
- Proposed slot (MG8 or MG9) is provisional and may conflict with other Grade 4 labs proposing the same slots — final distribution should be resolved once all seven Grade 4 lab plans are reviewed together.
