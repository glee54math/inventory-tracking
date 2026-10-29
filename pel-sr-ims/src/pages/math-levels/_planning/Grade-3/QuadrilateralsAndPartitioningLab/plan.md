# Quadrilaterals And Partitioning Lab

**Proposed slot:** MG6 or MG7 — provisional, confirm at build time per project convention.
**Grade:** 3
**Standards covered:** 3.G.1 (understand that shared attributes across categories define a larger category — e.g. that rhombuses and rectangles sharing "4 sides" places both inside "quadrilaterals"; recognize rhombuses, rectangles, and squares as quadrilaterals; draw quadrilaterals that do not belong to those subcategories), 3.G.2 (partition shapes into parts with equal areas, express each part's area as a unit fraction of the whole).
**Relationship to existing labs:** No existing coverage. MG6/MG7 don't touch geometry. Separately: 3.G.2's "equal-area parts as unit fractions" connects directly to this grade's own `FractionsFoundationsLab` (3.NF.1 — understanding 1/b as a quantity from partitioning a whole into b equal parts). They're independent standards and can be built in either order, but consider sequencing this lab after `FractionsFoundationsLab` if both are built around the same time, so students already have the "1/b means one of b equal parts" vocabulary before Unit 3 applies it to irregular shapes.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Favor concrete manipulatives: draggable shape pieces for sorting quadrilaterals by category in Units 1-2 (physically moving a shape into a "yes/no" bin rather than only clicking a static multiple-choice answer), and a direct-manipulation partition tool for Unit 3 where students drag cut lines themselves rather than only judging a pre-drawn partition.

## Units

### Unit 1: Attributes That Define Quadrilaterals
- **Goal:** Learn what makes a shape a quadrilateral, and see how rhombuses, rectangles, and squares all fit inside that bigger category because they share the "4 sides" attribute.
- **Standard:** 3.G.1 (shared attributes define a larger category; recognize rhombuses/rectangles/squares as quadrilaterals)
- **Buckets:**
  - Sort a shape as "quadrilateral" or "not a quadrilateral," including distractors (a triangle, a pentagon, a curved non-polygon shape)
  - Recognize a slanted/skewed rhombus as a quadrilateral despite not looking "square-ish" — tests whether an unfamiliar-looking example of a known category still gets classified correctly
  - Recognize a non-square rectangle as a quadrilateral, and reason about why a square also always counts as a rectangle (one-directional hierarchy: square → rectangle → quadrilateral)
  - True/false generalization pair, both answered in the same sitting: "every rhombus is a rectangle" (false) vs. "every square is a rhombus" (true) — exercises the actual category hierarchy rather than rote shape-naming
- **Requires intro (CFU gate):** Yes — common misconception: students often think category membership is exclusive (a shape is "either" a rhombus "or" a rectangle, never both at once), and separately believe that rotating or skewing a familiar shape (a tilted square, an unusually long thin rectangle) removes it from a category it doesn't visually "look like" anymore. CFU must include one rotated/atypical-looking shape the student must still correctly classify, plus the true/false hierarchy pair above so neither statement can be answered by pattern-matching the other.
- **Memorization fact (periodic re-check candidate):** No — category membership is meant to be reasoned from attributes each time a new shape is shown, not recalled as an isolated fact.

### Unit 2: Drawing Quadrilaterals Outside the Named Subcategories
- **Goal:** Draw (or build with draggable vertices) a four-sided shape that is a quadrilateral but is NOT a rhombus, rectangle, or square.
- **Standard:** 3.G.1 (draw quadrilaterals that do not belong to those subcategories)
- **Buckets:**
  - Build an irregular quadrilateral with no equal sides and no right angles (the most open-ended, "generic" case)
  - Build a trapezoid-like quadrilateral (one pair of sides that look roughly parallel) — tests whether the student wrongly defaults to "has parallel-looking sides, so it must be a rectangle"
  - Identify-the-non-example task: from a small gallery of quadrilaterals (some rectangles/rhombuses/squares, some not), select only the ones that fall OUTSIDE those three named subcategories
  - Self-check task: after building a shape meant to avoid the three subcategories, confirm it still satisfies the baseline "4 sides, closed figure" requirement — catches the student who, while focused on avoiding the subcategories, accidentally builds a triangle, a 5-sided shape, or an open (non-closed) figure
- **Requires intro (CFU gate):** Yes — common misconception: given the unusual instruction to draw something that is NOT a named shape, students often lose track of the baseline "4 sides" requirement entirely (drawing a triangle or pentagon instead), or build a shape that is technically still a rectangle without realizing it (e.g. a rotated rectangle, or a shape with four right angles they didn't intend). CFU must include a worked non-example explaining specifically why it doesn't count.
- **Memorization fact (periodic re-check candidate):** No — this is an application of Unit 1's reasoning to a constructive (rather than sorting) task, re-derived each time.

### Unit 3: Partitioning Shapes into Equal-Area Parts and Naming Unit Fractions
- **Goal:** Split a shape into parts that all have the same area, and name one part using a unit fraction, like 1/4, based on how many equal parts the whole was split into.
- **Standard:** 3.G.2
- **Buckets:**
  - Partition a shape along an obvious grid/symmetry line (e.g. a rectangle cut into 4 equal strips) and name one part's unit fraction
  - Partition into equal-AREA parts that are NOT congruent in shape (e.g. a rectangle split into two differently-shaped but equal-area halves) — reinforces that "equal area" doesn't require "same shape"
  - Judge an already-partitioned shape: decide whether the shown parts are actually equal in area before applying a unit-fraction name, including a visually-deceptive case where differently-shaped regions are genuinely equal area, and a trap case where similarly-sized-looking regions are NOT equal area
  - Reverse direction: given a stated unit fraction (e.g. "this part is 1/6 of the whole"), determine how many equal parts the whole was split into, or complete the rest of the partition
- **Requires intro (CFU gate):** Yes — common misconception: students commonly assume that splitting a shape into "that many pieces" automatically makes each piece that unit fraction, regardless of whether the pieces are actually equal in area (e.g. assuming 4 pieces always means each is 1/4 even when the cuts are uneven) — the standard's core distinction is equal AREA, not merely equal COUNT of pieces. CFU must include a shape split into visibly unequal-area pieces and ask whether unit-fraction naming even applies to it.
- **Memorization fact (periodic re-check candidate):** No — this is reasoning about area and fraction meaning applied fresh to each specific partition shown, not a fixed recallable fact.

## Open questions / flags for the builder
- Slot is listed as "MG6 or MG7" with no existing coverage either way — a genuine placement call to flag back rather than guess, per `math-lab-builder.md`'s "stop and report" rule.
- Build-order relative to `FractionsFoundationsLab` (noted above under Relationship to existing labs) is a sequencing preference, not a hard dependency — if `FractionsFoundationsLab` isn't built first, Unit 3 should still stand alone by briefly re-establishing "1/b = one of b equal parts" itself rather than assuming it's already known.
- Only 2 standards map to 3 units here (3.G.1 splits naturally into "sorting/recognizing" and "drawing non-examples," 3.G.2 is its own unit) — flagging that this lab is thinner than most in unit count, in case the builder wants to fold Units 1-2 into a single unit instead; kept separate here because recognizing vs. constructing are different cognitive demands (the CCSS standard itself lists them as two distinct clauses).
- Confirm whether a draggable-shape-sorting or draggable-vertex-building component already exists in `shared/diagrams/` before building new ones — this is the first grade-3 lab needing either, so there's no existing sibling consumer yet to check against, but worth grepping broader grades in case one was already built for an earlier/later geometry unit.
