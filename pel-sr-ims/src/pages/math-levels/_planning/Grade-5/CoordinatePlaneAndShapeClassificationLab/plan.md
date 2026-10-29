# CoordinatePlaneAndShapeClassificationLab

**Proposed slot:** MG10 — provisional, confirm at build time per project convention.
**Grade:** 5
**Standards covered:** 5.G.1 (use a pair of perpendicular number lines/axes to define a coordinate system, understand x-/y-coordinate correspondence to the axes), 5.G.2 (represent real-world/math problems by graphing points in the first quadrant, interpret coordinate values in context), 5.G.3 (understand that attributes of a category of 2D figures also belong to all its subcategories), 5.G.4 (classify 2D figures in a hierarchy based on properties).
**Relationship to existing labs:** Level-code MG11 already has a built, working `GeometryLab` whose "Coordinate plane (6.G.3)" unit covers drawing polygons in the coordinate plane given vertex coordinates and finding side lengths, using all four quadrants (negative coordinates implied by 6.G) — a 6th-grade standard pitched more advanced than this lab's 5.G.1-2 work. See the [VERIFY] flag below before building the coordinate-plane units. The 5.G.3-4 shape-classification-hierarchy units have no overlap anywhere else in the codebase — build those with full confidence.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. The coordinate plane is a brand-new abstraction at this level — ground the axes/ordered-pair convention in a concrete real-world scenario (a map, a seating chart, a grid-paper treasure hunt) before any pure (x, y) symbol manipulation. Likewise, the shape hierarchy should start from shapes kids already recognize by sight (square, rectangle, rhombus) before naming the formal property-based relationships.

## Units

### Unit 1: Meet the Coordinate Plane
- **Goal:** Learn that two perpendicular number lines (the x-axis and y-axis) work together to pinpoint any location on a grid.
- **Standard:** 5.G.1
- **Buckets:**
  - Identifying the x-axis vs. y-axis and the origin on a labeled grid
  - Reading a given point's coordinates off the grid (point → ordered pair)
  - Plotting a given ordered pair onto the grid (ordered pair → point)
  - Explaining which coordinate (x or y) moves you horizontally vs. vertically — the "x comes first, go across; y comes second, go up" convention, tested on points that are easy to transpose (e.g. (2, 5) vs. (5, 2), landing on genuinely different grid cells)
- **Requires intro (CFU gate):** Yes — the x-first/y-second ordering convention and the axis-vs-coordinate vocabulary are brand-new and the swapped-coordinate mistake ((2,5) read as (5,2)) is a real, common, silent error.
- **Memorization fact (periodic re-check candidate):** No — this is a conceptual convention the student can always re-derive by reasoning ("x is listed first, so move across first"), not an arbitrary fact to memorize.

### Unit 2: Graphing in the Real World (First Quadrant)
- **Goal:** Use the coordinate plane to represent and solve real-world problems, graphing and reading points in the first quadrant only.
- **Standard:** 5.G.2
- **Buckets:**
  - Graphing a point from a real-world context (e.g. "the treehouse is 3 blocks east and 4 blocks north") where both coordinates must be extracted from a word description
  - Interpreting a plotted point's coordinates back into real-world meaning (number → context, the reverse direction)
  - Comparing two or more plotted points in context (e.g. "which location is farther east?" / "which two locations share the same y-coordinate, and what does that mean here?")
  - A point lying ON an axis (x = 0 or y = 0) — the edge case students often skip because it "looks like" it's not really plotted
- **Requires intro (CFU gate):** Yes — interpreting coordinate values IN CONTEXT (not just as bare numbers) is the new leap beyond Unit 1's mechanics, and students commonly conflate "first coordinate" with "first thing mentioned in the sentence" rather than with the axis it actually matches.
- **Memorization fact (periodic re-check candidate):** No — this is applied reasoning, not a fact.

### Unit 3: One Property, Many Shapes (Hierarchy Intro)
- **Goal:** Discover that a single property (like "four right angles") can be shared by several different-looking shapes, and that this is why shapes can belong to more than one category at once.
- **Standard:** 5.G.3
- **Buckets:**
  - Identifying a shared property across visually different quadrilaterals (e.g. "all four sides equal" applies to both a square and a non-square rhombus)
  - Recognizing that a property true for a whole category (e.g. "all rectangles have 4 right angles") is therefore automatically true for every shape in a subcategory of it (e.g. a square) — tested by asking students to apply a category-level fact to a specific named subcategory shape they haven't been explicitly told about
  - Spotting a property that is NOT shared category-wide (e.g. "all sides equal" is true for rhombi but not for all parallelograms) to build the contrast against true universal properties
- **Requires intro (CFU gate):** Yes — "a property of the category belongs to all its subcategories" is a genuinely new logical structure for a 5th grader, easily confused with its (false) converse.
- **Memorization fact (periodic re-check candidate):** No — this is a conceptual/logical relationship to be reasoned through, not memorized.

### Unit 4: Building the Quadrilateral Family Tree
- **Goal:** Sort quadrilaterals (square, rectangle, rhombus, parallelogram, trapezoid) into a hierarchy and reason correctly about which "is-a" statements are true.
- **Standard:** 5.G.4
- **Buckets:**
  - "Is every square a rectangle?" (true — subcategory-to-category direction, the direction students usually accept more easily)
  - "Is every rectangle a square?" (false — category-to-subcategory direction, the real conceptual trap; needs a concrete counterexample, e.g. a 2x5 rectangle)
  - "Is every rhombus a parallelogram?" (true) vs. "Is every parallelogram a rhombus?" (false) — the same directionality trap applied to a second pair, so students can't pattern-match the square/rectangle answer alone
  - "Is every parallelogram a trapezoid?" / "Is every trapezoid a parallelogram?" — testing the directionality trap on the broadest pair in the hierarchy (note: if this lab's build-time trapezoid definition is the exclusive one — trapezoids must have EXACTLY one pair of parallel sides — then parallelograms are NOT trapezoids and this bucket's answer direction flips; the builder should pick one definition explicitly and state it, since U.S. curricula split on this)
  - Classifying an unfamiliar or oddly-drawn quadrilateral (not a "typical" textbook orientation) into every category it truly belongs to, to confirm the hierarchy reasoning isn't just shape-template matching
- **Requires intro (CFU gate):** Yes — the directionality trap (every square is a rectangle, but not every rectangle is a square) is THE named misconception this unit exists to correct, and it needs a deliberate walkthrough with a counterexample, not just practice reps.
- **Memorization fact (periodic re-check candidate):** No — the hierarchy is meant to be reasoned from properties each time, not memorized as a fixed list of true/false statements.

## Open questions / flags for the builder

- **[VERIFY]** Before building Unit 1 (Meet the Coordinate Plane) and Unit 2 (Graphing in the Real World), confirm that this first-quadrant-only, 5.G.1-2 scope is genuinely a distinct, simpler, foundational skill from MG11 `GeometryLab`'s existing "Coordinate plane (6.G.3)" unit (which covers all four quadrants, negative coordinates, and drawing polygons from vertex coordinates to find side lengths). It is very likely fine to build both, since they target different standards, different quadrant scopes, and different task types (basic point-plotting/reading vs. polygon side-length computation) — but confirm this read of `GeometryLab` before assuming no rework/consolidation is warranted, rather than building blind.
- The trapezoid definition (exclusive "exactly one pair of parallel sides" vs. inclusive "at least one pair") changes whether a parallelogram counts as a trapezoid in Unit 4's last bucket. Pick one explicitly at build time and state the choice in the unit's Explore copy so the CFU/Practice/Test stay internally consistent.
- Diagram reuse: confirm whether `shared/diagrams/CoordinatePlane` (used by `GeometryLab`) supports a first-quadrant-only display mode, or whether it needs an additive optional prop (e.g. `quadrantsShown`) to avoid building a second, parallel coordinate-plane diagram component for this lab.
