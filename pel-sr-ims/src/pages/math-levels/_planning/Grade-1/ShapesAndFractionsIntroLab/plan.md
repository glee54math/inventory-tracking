# Shapes And Fractions Intro Lab

**Proposed slot:** MG4 — provisional, confirm at build time per project convention.
**Grade:** 1
**Standards covered:** 1.G.1 (distinguish defining vs. non-defining attributes, build/draw shapes with defining attributes), 1.G.2 (compose 2D shapes — rectangles, squares, trapezoids, triangles, half-/quarter-circles — or 3D shapes into composite shapes), 1.G.3 (partition circles and rectangles into two and four equal shares, describe using halves/fourths/quarters, understand that more equal shares means smaller shares).
**Relationship to existing labs:** Supersedes MG4's status as a completely empty stub — no prior content, no legacy component, to account for.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Shape and fraction vocabulary is almost entirely NEW at this grade (defining/non-defining attributes, "composite shape," "equal shares," "half/fourth/quarter" as fraction language rather than just "half" in casual speech) — every term must be explicitly introduced with a visual before it's used in a practice question, and manipulable/draggable shape pieces should stand in for physical shape tiles wherever the concept allows direct manipulation.

## Units

### Unit 1: Defining Attributes of Shapes
- **Goal:** Tell the difference between what actually MAKES a shape that shape (like number of sides) and what's just how it happens to look (like color or size), then build or draw shapes using the attributes that matter.
- **Standard:** 1.G.1
- **Buckets:**
  - Identify a defining attribute shared across different-looking examples of the same shape category (e.g. all triangles have 3 straight sides, regardless of size/color/rotation)
  - Identify a non-defining attribute as a trap (e.g. "this triangle is red and pointy-looking" — color and specific angle appearance are NOT what makes it a triangle)
  - Sort a mixed set of shapes where some vary ONLY in non-defining ways (same shape category, different size/color/orientation) and some are genuinely different shape categories — tests that the student isn't using size/color/orientation to sort
  - Build or draw a shape from a description using only its defining attributes (e.g. "draw a shape with 4 sides, all the same length" — should accept any valid square the student draws, any size/rotation/color)
- **Requires intro (CFU gate):** Yes — common misconception: students at this age very commonly believe a rotated or unusually-sized/colored example (e.g. a triangle pointing sideways, or a very thin/stretched rectangle) is "not really" that shape anymore, because they're implicitly treating orientation/proportions as defining. CFU must show the SAME shape category in two very different orientations/sizes/colors in one question and ask whether both are still the same shape type and why.
- **Memorization fact (periodic re-check candidate):** No — this is attribute reasoning applied fresh to each example, not a memorized fact (the shape names themselves are vocabulary introduced via CFU, not drilled as standalone memorization here).

### Unit 2: Composing Shapes
- **Goal:** Put basic shapes together to build a new, bigger composite shape, and recognize which basic shapes were used to build a given composite.
- **Standard:** 1.G.2
- **Buckets:**
  - Compose a named target composite from 2D pieces where the pieces are the same shape repeated (e.g. two squares side by side making a rectangle)
  - Compose a named target composite from 2D pieces that are DIFFERENT shapes combined (e.g. a square and a triangle making a "house" pentagon-like shape, or two half-circles making a circle, or two quarter-circles making a half-circle)
  - Identify/decompose: given a composite shape already built, identify which basic shapes (from rectangles/squares/trapezoids/triangles/half-circles/quarter-circles) were used to make it — the reverse direction of composing
  - Compose a simple 3D composite from basic solids (e.g. stacking a cube and a cone-like shape, per 1.G.2's "or compose three-dimensional shapes") — kept distinct from the 2D buckets since spatial reasoning in 3D is a materially different skill
- **Requires intro (CFU gate):** Yes — common misconception: students often believe a composite shape's identity depends on HOW it was visually split on screen (e.g. thinking a rectangle made of two squares is somehow different from "a rectangle" on its own, or failing to recognize the same composite can be built more than one way from different piece combinations). CFU must ask the student to recognize that two different piece-combinations can build the identical final composite shape.
- **Memorization fact (periodic re-check candidate):** No — composing/decomposing is spatial reasoning performed fresh on each shape, not a memorized fact.

### Unit 3: Partitioning into Halves and Fourths
- **Goal:** Split a circle or rectangle into 2 or 4 equal-size pieces, and use the words "halves," "fourths," and "quarters" to describe the pieces — including noticing that cutting something into more pieces makes each piece smaller.
- **Standard:** 1.G.3
- **Buckets:**
  - Partition a shape into 2 equal shares (halves), correct equal-area split shown as the target to identify or produce
  - Partition a shape into 2 UNEQUAL shares as a trap/non-example (student must identify this is NOT halves, even though there are "two pieces")
  - Partition a shape into 4 equal shares (fourths/quarters), including recognizing that fourths can look different depending on HOW the shape is cut (e.g. a square cut into 4 equal triangles via both diagonals, vs. a square cut into 4 equal smaller squares via a plus-sign cut) — tests that "fourths" means 4 equal-size pieces, not one specific cutting pattern
  - Partition into 4 shares where the pieces are visibly unequal in size as a non-example trap (same logic as the halves trap, at the harder 4-piece level)
  - Compare halves vs. fourths of the SAME-size whole to reason that fourths are smaller pieces than halves (the "more shares = smaller shares" conceptual close of 1.G.3) — this is the generalization/why-question version, not just a production task
- **Requires intro (CFU gate):** Yes — common misconception: students commonly think ANY division into "two pieces" counts as "halves" regardless of whether the pieces are actually equal in size/area (e.g. a circle cut unevenly into a big piece and a small piece is still mistakenly called "two halves" just because there are two pieces); separately, many first graders assume more pieces must mean BIGGER pieces, not smaller, since "4" is a bigger number than "2." CFU must include one unequal-pieces non-example (the piece-count-vs-equal-size distinction living in the same question as the number of pieces, so it can't be answered by just counting pieces) and one direct halves-vs-fourths size-comparison question.
- **Memorization fact (periodic re-check candidate):** No — equal-share reasoning is visually re-derived on each new shape, not a memorized fact; "halves/fourths/quarters" as vocabulary terms are introduced via CFU rather than drilled as rote recall.

## Open questions / flags for the builder
- 1.G.2 explicitly covers both 2D composite shapes AND 3D composite solids ("compose two-dimensional shapes... or three-dimensional shapes"); Unit 2 bundles both into one unit with a dedicated 3D bucket since the standard itself treats them as one skill statement, but if the builder finds the 3D spatial-reasoning diagram work substantially heavier than the 2D buckets, splitting out a separate 3D-composition unit (or scoping 3D down to a lighter treatment) is reasonable to flag back.
- This is a brand-new, previously-empty slot (MG4), so there is no pre-existing practice history to grandfather for any of this lab's CFU gates — noting explicitly since the builder brief calls this out as a required check for existing labs only.
- Recommend checking `shared/diagrams/` for any existing shape-tile or partition-drawing component (a "ShapeComposer" or similar) before building new diagrams from scratch for Units 2 and 3, since draggable/composable shape pieces are a natural candidate for reuse across grade levels if a later lab (e.g. a Grade-2 partitioning standard) needs the same mechanic.
