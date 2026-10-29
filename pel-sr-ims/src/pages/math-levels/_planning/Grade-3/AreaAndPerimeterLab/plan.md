# Area And Perimeter Lab

**Proposed slot:** MG6 or MG7 — provisional, confirm at build time per project convention.
**Grade:** 3
**Standards covered:** 3.MD.5 (recognize area as an attribute of plane figures, understand area measurement via unit squares), 3.MD.6 (measure area by counting unit squares), 3.MD.7 (relate area to multiplication and addition: 7a — find area by tiling, show it equals multiplying side lengths; 7b — multiply side lengths to find areas in real-world/math problems; 7c — use tiling to show the distributive property, a×(b+c)=a×b+a×c, concretely; 7d — recognize area as additive, find areas of rectilinear figures by decomposing), 3.MD.8 (solve real-world/math problems involving perimeter, find unknown side lengths, compare same-perimeter/different-area or same-area/different-perimeter cases).
**Relationship to existing labs:** No existing coverage. MG6/MG7 (bar-model word problems, vertical addition/subtraction, N×1-digit multiplication) don't touch area or perimeter. Separately: this lab's distributive-property-via-tiling unit (3.MD.7c) is a natural visual precursor to `MM1_ExponentsAndExpressionsLab`'s later symbolic distributive-property unit (grade 6, already built) — not overlapping content, just worth noting as a prerequisite thread that pays off two grade levels later.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Favor concrete manipulatives: a tiling animation that visibly lays unit squares onto a rectangle one row at a time for Units 1-2 (so "tiling" and "multiplying side lengths" are visibly the same action, not two separate facts), and draggable cut-lines for the distributive-property and composite-figure units so students physically split a shape rather than only seeing a pre-split diagram.

## Units

### Unit 1: Understanding Area as Tiling
- **Goal:** Understand that the area of a shape is the number of same-size unit squares it takes to cover it with no gaps or overlaps, and count unit squares to find area.
- **Standard:** 3.MD.5a-b, 3.MD.6
- **Buckets:**
  - Count unit squares in a fully-tiled rectangle (grid fully shown, direct count)
  - Count unit squares in a rectangle shown with only a partial grid, requiring the student to mentally extend rows/columns before counting
  - Compare two different-shaped figures built from the same number of unit squares and confirm they have equal area despite looking different (reinforces area as an attribute separate from shape)
  - Count unit squares in a non-rectangular but still grid-aligned (rectilinear) outline
- **Requires intro (CFU gate):** Yes — common misconception: students frequently confuse counting the unit squares that cover a shape's interior (area) with counting the squares along its outside edge (perimeter), especially when the shape is shown as a grid and both counting tasks look visually similar. CFU must present one shape and ask both "how many squares cover this shape" and "how many squares trace its border" back to back so the distinction is forced live, not assumed.
- **Memorization fact (periodic re-check candidate):** No — this is the foundational concept, re-derivable by counting every time; the formula shortcut is deferred to Unit 2.

### Unit 2: Area = Multiplying Side Lengths
- **Goal:** Find a rectangle's area by multiplying its side lengths instead of counting every square, and use that to solve real-world problems.
- **Standard:** 3.MD.7a-b
- **Buckets:**
  - Given a rectangle's length and width labeled directly, multiply to find the area
  - Given the area and one side length, find the missing side length (inverse/unknown-factor problem)
  - Real-world word problem framed as an area situation (e.g. a rug covering a floor) where the student must recognize it calls for length × width rather than being told to multiply outright
  - Verify-by-tiling check: given a multiplication result, confirm it against a count-the-squares check on the same rectangle (explicitly bridges Unit 1's tiling to Unit 2's shortcut)
- **Requires intro (CFU gate):** Yes — common misconception: once both area and perimeter exist in the same lab, students often confuse "multiply the sides" (area) with "add the sides" (perimeter) when given the same two labeled side lengths, applying the wrong operation to the wrong question. A second common error: when area and one side are given to find the missing side, students guess-and-check inconsistently rather than recognizing division as the inverse of multiplication. CFU must include a question explicitly asking which operation applies and why, not just computing an answer.
- **Memorization fact (periodic re-check candidate):** Yes — "Area of a rectangle = length × width" is a fixed formula meant for long-term recall once understood, not re-derived from reasoning every time; set `reintroEverySolved` so it's periodically re-surfaced rather than proven once and assumed retained.

### Unit 3: Area and the Distributive Property
- **Goal:** Split a rectangle into two smaller rectangles with a single straight cut, and show that multiplying the whole gives the same total area as multiplying each part and adding.
- **Standard:** 3.MD.7c
- **Buckets:**
  - Given a rectangle already split by a cut line into two labeled parts, compute each part's area and add them (concrete verification of the property)
  - Given one whole-rectangle multiplication fact, choose where to place a cut to split it into two friendlier sub-facts (e.g. 7×8 → 7×5 + 7×3), then confirm the split's total matches
  - True/false generalization: decide whether two *different* valid ways of splitting the same rectangle both give the same total area (tests that the property is always true, not a one-time coincidence)
  - Apply the splitting idea to a shape that's naturally two joined rectangles (a direct bridge toward Unit 4's composite figures)
- **Requires intro (CFU gate):** Yes — common misconception: students often treat the tiling-based distributive property as a one-off trick for a single problem rather than a generalizable always-true property, and a separate frequent error is cutting the wrong dimension (splitting the length into two parts but keeping only one part's width, instead of carrying the full width across both parts). CFU should include a true/false generalization question plus one question asking the student to explain, in their own words, why splitting-and-adding gives the same answer as multiplying the whole.
- **Memorization fact (periodic re-check candidate):** No — this unit teaches the conceptual, always-true property itself through reasoning and visual proof, not a fact to recall; its symbolic/algebraic restatement doesn't resurface for memorization until grade 6 (see Relationship to existing labs).

### Unit 4: Composite and Rectilinear Areas
- **Goal:** Find the area of an L-shaped or other irregular figure made of straight sides by breaking it into rectangles and adding (or subtracting a missing piece from a larger rectangle).
- **Standard:** 3.MD.7d
- **Buckets:**
  - Decompose a simple L-shape into two rectangles, find each area, and add (straightforward decomposition)
  - Decompose a more complex rectilinear figure (three or more rectangles, e.g. a staircase or plus-shape) into parts and add
  - Subtraction approach: find the area of a large bounding rectangle, then subtract a cut-out notch/corner rectangle
  - Missing-dimension problem: one side length needed for a sub-rectangle's area isn't labeled directly and must be inferred by subtracting given lengths on the overall figure first
- **Requires intro (CFU gate):** Yes — common misconception: once a figure has more than one sub-rectangle, students often reuse one sub-rectangle's side length for a different sub-rectangle's area instead of checking the actual dimension for that specific piece, and separately sometimes add perimeters of the parts rather than their areas once a figure looks visually complex. CFU must include a figure where a needed dimension is not labeled directly and must be derived first.
- **Memorization fact (periodic re-check candidate):** No — choosing how to decompose (or whether to subtract instead) is situational reasoning applied fresh to each figure's shape.

### Unit 5: Perimeter
- **Goal:** Find the distance around a shape, solve for a missing side length when the perimeter is known, and compare shapes that share a perimeter but not an area (or vice versa).
- **Standard:** 3.MD.8
- **Buckets:**
  - Find the perimeter given all side lengths of a polygon (straightforward sum, including non-rectangle shapes with varying numbers of sides)
  - Find the perimeter of a rectangle given only its length and width (apply the 2×length + 2×width shortcut, not a sum of four separately labeled numbers)
  - Find a missing side length given the perimeter and all other sides (unknown-addend problem)
  - Same-perimeter, different-area comparison: given two different rectangles with equal perimeter, compute and compare their areas and notice they differ
  - Same-area, different-perimeter comparison (the standard's explicit "vice versa" case): given two different rectangles with equal area, compute and compare their perimeters
  - Area/perimeter discrimination problem: a single rectangle's two side lengths are given, and the student must determine which of two questions — area or perimeter — is actually being asked, using the SAME two numbers for both (the named misconception risk, engineered so the wrong operation is just as "available" as the right one)
- **Requires intro (CFU gate):** Yes — explicitly named misconception: students often confuse area and perimeter, especially when a rectangle's side lengths are given and both questions use the same numbers (multiplying when perimeter is asked, or adding all four sides when area is asked). CFU must include a same-rectangle, same-numbers pair of questions — one asking for area, one for perimeter — answered in the same sitting, so the distinction is forced live rather than assumed from Unit 2's earlier gate.
- **Memorization fact (periodic re-check candidate):** Yes — the rectangle perimeter shortcut (2×length + 2×width) is a fixed formula for long-term recall, parallel to Unit 2's area formula; set `reintroEverySolved`. The general "sum of all sides" case for non-rectangles stays more reasoning-based, but the rectangle-specific shortcut is the piece worth periodic re-checking.

## Open questions / flags for the builder
- Slot is listed as "MG6 or MG7" with no existing coverage either way — a genuine placement call to flag back rather than guess, per `math-lab-builder.md`'s "stop and report" rule.
- Units 3 and 4 (distributive property via tiling; composite/rectilinear areas) are closely related — both involve splitting a rectangle — and could arguably merge into one unit if the builder judges them too thin split apart. Flagging rather than deciding, since 3.MD.7c and 7d are nonetheless distinct sub-parts of the standard with different core ideas (a provable property vs. a decomposition strategy).
- Unit 1 intentionally excludes half-unit-square counting (approximate tiling of a non-grid-aligned shape) since the standard's own scope is whole unit squares; flagging this scope decision in case the builder's Explore design would naturally want to show a non-aligned example for contrast.
- Confirm whether the shared tiling-animation component (if one already exists, e.g. from an earlier grade's area content) can be reused here before building a new one from scratch, per the "promote on the second real consumer" convention — this is the first grade-3 lab to need it, but check for an existing sibling implementation first.
