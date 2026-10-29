# TransformationsCongruenceAndSimilarityLab

**Proposed slot:** MM3 — provisional, confirm at build time per project convention. **Contention flag:** MM3 is also Grade 7's proposed slot, AND this is one of eight Grade-8 labs across two planning batches all proposing MM3 — this batch's three siblings (`FunctionsLab`, `PythagoreanTheoremAndVolumeLab`, `BivariateDataAndScatterPlotsLab`) plus the other grade-8 batch's four (`ExponentsRadicalsAndScientificNotationLab`, `IrrationalNumbersAndApproximationLab`, `LinearEquationsAndProportionalRelationshipsLab`, `SystemsOfLinearEquationsLab`). Final slot assignment across grades 7/8 needs resolution before any of these is built (see Open questions).
**Grade:** 8
**Standards covered:** 8.G.1a-c (verify properties of rotations/reflections/translations experimentally — lines to lines of same length, angles to angles of same measure, parallel lines to parallel lines), 8.G.2 (understand 2D-figure congruence as a transformation sequence, describe such a sequence for congruent figures), 8.G.3 (describe the effect of dilations/translations/rotations/reflections on 2D figures using coordinates), 8.G.4 (understand 2D-figure similarity as a transformation sequence incl. dilation, describe such a sequence for similar figures), 8.G.5 (use informal arguments to establish facts about triangle angle sum and exterior angle, angles formed by a transversal cutting parallel lines, and the AA similarity criterion).
**Relationship to existing labs:** `MG11_GeometryLab.tsx` (grade 5 slot, already built — verified by reading its shell and modules) covers 6.G.1-4 only: area (composing/decomposing shapes), volume of rectangular prisms, plotting polygons and finding side lengths on the coordinate plane, and nets/surface area. It does NOT contain any rotation/reflection/translation/dilation, congruence, or similarity content — those words don't appear anywhere in its module code. The one genuine touchpoint is its Coordinate module (6.G.3: plotting vertices, reading side lengths on a grid), which is a loose arithmetic/reading-coordinates prerequisite this lab's Unit 3 (8.G.3, coordinate effects of transformations) builds on — but the transformation/congruence/similarity content itself is entirely new, not a rebuild or overlap of anything already built.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Build every congruence/similarity argument from the same hands-on "drag and verify" exploration pattern as earlier geometry content (dragging a shape through a rotation/reflection/translation and checking lengths/angles/parallelism hold) rather than jumping to formal two-column proof writing — "informal arguments" is the standard's own phrase (8.G.5) and sets the expected rigor for the whole lab, not just that one unit.

## Units

### Unit 1: Verifying Rigid Motion Properties Experimentally
- **Goal:** Drag a shape through a rotation, reflection, or translation and check that line lengths, angle measures, and parallel lines all stay the same.
- **Standard:** 8.G.1a-c
- **Buckets:**
  - Translation: verify length, angle, and parallelism are all preserved for a slide
  - Rotation: verify the same three properties, including rotation about a NON-origin, non-obvious center (harder than rotating about the figure's own center or the origin)
  - Reflection: verify the same three properties, including reflection across a non-axis line (e.g. y=x), not just a horizontal/vertical mirror line
  - A "which property broke" diagnostic: present a DISTORTED, non-rigid transformation (a stretch mislabeled as a rotation) and ask which specific property (length, angle, or parallelism) fails — reinforcing that these properties are what DEFINES a rigid motion, not a side effect to casually confirm
- **Requires intro (CFU gate):** Yes — new vocabulary ("rigid motion," parallel-preserving) with a real misconception: assuming anything that "looks similar in shape" automatically preserves length/angle, or confusing a reflection's mirror line with a rotation's center point when a diagram makes them look alike at a glance.
- **Memorization fact (periodic re-check candidate):** No — experimentally re-verifiable and conceptual, not a fact to recall independent of the shape in front of the student.

### Unit 2: Describing a Congruence Transformation Sequence
- **Goal:** Given two congruent figures, describe the sequence of rotations/reflections/translations that carries one onto the other.
- **Standard:** 8.G.2
- **Buckets (by transformation count — rigid motions only, since congruence never involves a dilation):**
  - Single transformation maps figure A onto figure B (just a translation, or just a reflection) — identify and fully describe it (vector, or line of reflection)
  - Two-transformation composite needed (e.g. reflect then translate, or two reflections composing into a rotation) — genuinely harder since no single rigid motion suffices
  - A pair describable by more than one valid sequence (e.g. two reflections OR one rotation achieve the same mapping) — tests that students understand a sequence description isn't unique; any valid one is acceptable
  - A same-SHAPE, different-SIZE distractor pair presented among congruent pairs — no rigid-motion sequence exists since congruence requires exact size match, and the student must recognize that before attempting to force a description
- **Requires intro (CFU gate):** Yes — misconception: trying to force a rigid-motion sequence onto a pair that's only similar (different size), and assuming a sequence description must be THE one correct answer rather than one of several valid ones.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 3: Effects of Transformations on Coordinates
- **Goal:** Find the new coordinates of a shape's vertices after a translation, rotation, reflection, or dilation.
- **Standard:** 8.G.3
- **Buckets:**
  - Translation: apply (x,y) → (x+a, y+b)
  - Reflection across the x-axis or y-axis: apply the correct sign-flip rule to the matching coordinate (common error: flipping the wrong one)
  - Rotation about the origin by 90°, 180°, or 270°: apply the coordinate-swap-and-sign rule — the hardest of the rigid-motion coordinate rules to keep straight
  - Dilation from the origin by a scale factor, including a fractional factor less than 1 (shrinks rather than enlarges) — apply (x,y) → (kx, ky)
  - A two-step composite (e.g. reflect then translate) applied to the same figure's coordinates in sequence, checking that order matters — reversing the order changes the result
- **Requires intro (CFU gate):** Yes — misconception: applying a rotation's coordinate rule with the wrong sign/swap, or assuming a fractional scale factor still enlarges the figure.
- **Memorization fact (periodic re-check candidate):** Yes, partially — the specific coordinate rules (reflect over x-axis negates y; reflect over y-axis negates x; rotate 180° negates both; rotate 90°/270° swaps-and-negates) are fixed lookup-table facts worth periodic re-checking once understood, rather than re-deriving geometrically every time. Flag `reintroEverySolved` for these coordinate rules specifically — not for the dilation/translation rules, which stay directly derivable from the transformation's definition.

### Unit 4: Describing a Similarity Transformation Sequence
- **Goal:** Given two similar (different-size) figures, describe the sequence of rotations/reflections/translations/dilations that carries one onto the other.
- **Standard:** 8.G.4
- **Buckets (by transformation count/type — contrast with Unit 2: similarity composites must include a dilation):**
  - Single dilation only (same orientation and position, just different size) maps A onto B
  - Dilation plus one rigid motion (e.g. dilate then translate, or dilate then reflect) — a two-step composite including a dilation
  - Dilation plus TWO rigid motions (e.g. dilate, rotate, translate) — a three-step composite, the hardest sequencing case in the lab
  - A same-SIZE (congruent) distractor pair presented among similar pairs — the student must recognize the scale factor is 1 (congruence is the special case of similarity with a trivial dilation), testing the boundary between the two ideas rather than treating them as unrelated
- **Requires intro (CFU gate):** Yes — misconception: forgetting the dilation entirely and trying to force a same-size-only rigid-motion sequence onto figures of different sizes, or sequencing a dilation and a rigid motion in an order that breaks point correspondence.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 5: Informal Arguments for Triangle Angle Facts and AA Similarity
- **Goal:** Use hands-on exploration — not formal proof — to see why triangle angles always add to 180°, why an exterior angle equals the sum of the two remote interior angles, why a transversal across parallel lines creates predictable angle relationships, and why two triangles sharing two matching angles must be similar.
- **Standard:** 8.G.5
- **Buckets:**
  - Triangle angle sum: given two angles, find the third, via a drag/tear-and-rearrange style exploration, plus a true/false generalization trap ("is this always true, even for a very thin, stretched-out triangle?")
  - Exterior angle: given the two remote interior angles, find the exterior angle (their sum), and the reverse (given the exterior angle and one remote interior angle, find the other)
  - Parallel lines cut by a transversal: identify corresponding/alternate-interior/co-interior angle relationships, with a single multi-part question combining BOTH the equal-angle pairs and the supplementary-angle pairs so neither can be answered by pattern-matching the other
  - AA similarity: given two triangles sharing two pairs of congruent angles, confirm they must be similar and use the implied ratio to find a missing angle or side; include a distractor pair sharing only ONE matching angle, testing that students don't over-apply AA with insufficient information
- **Requires intro (CFU gate):** Yes — "informal argument" is this grade's own expectation (not two-column proof); CFU must include a true/false generalization question for the angle-sum fact (some students assume it only holds for "typical-looking" triangles) and a combined equal/supplementary transversal question.
- **Memorization fact (periodic re-check candidate):** Yes, partially — the triangle angle sum (180°) and the named transversal angle-pair relationships (corresponding = equal, alternate interior = equal, co-interior = supplementary) are fixed facts worth periodic re-checking once established via the informal argument. Flag `reintroEverySolved` for these specific facts; keep the AA similarity reasoning itself as re-derivable judgment, not a bare fact to recall.

## Open questions / flags for the builder
- **MM3 contention (flag required for every lab in this grade-8 batch):** see header note above — eight total grade-8 labs across two batches, plus grade 7's own MM3 proposal, need slot resolution before any is built. `MH1` is earmarked for grade 9 content per the other batch's notes and should not be used as overflow without an explicit decision.
- Grade 7's `ScaleDrawingsAndConstructionsLab` (folder exists under the Grade-7 planning batch, but had no `plan.md` at the time this was written) is the likely home for 7.G.1-2 (scale drawings, triangle construction from given conditions). If/when that lab's plan is written, cross-check it doesn't overlap this lab's Unit 5 AA-similarity content — 7.G.2's triangle construction is about whether a triangle CAN be built from given measures (unique/multiple/no triangle), a distinct skill from this lab's "given two triangles, is the AA criterion satisfied" — expected to be no overlap, but flag since that sibling plan didn't exist yet to confirm directly.
- Prerequisite relationship with `MG11_GeometryLab` (see note above) is confirmed by reading its actual module code, not just its stated grade/standard — no [VERIFY] flag needed.
