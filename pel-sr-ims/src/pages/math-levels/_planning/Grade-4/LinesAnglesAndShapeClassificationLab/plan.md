# Lines, Angles & Shape Classification Lab

**Proposed slot:** MG8 or MG9 — provisional, confirm at build time per project convention.
**Grade:** 4
**Standards covered:** 4.G.1 (draw and identify points, lines, line segments, rays, angles — right, acute, obtuse — and perpendicular and parallel lines, identify these in two-dimensional figures), 4.G.2 (classify two-dimensional figures based on the presence or absence of parallel or perpendicular lines, or the presence or absence of angles of a specified size; recognize right triangles as a category and identify them, including special triangles — equilateral, isosceles, scalene — and special quadrilaterals — rhombus, square, rectangle, parallelogram, trapezoid), 4.G.3 (recognize a line of symmetry for a two-dimensional figure as a line across the figure such that the figure can be folded along the line into matching parts; identify line-symmetric figures and draw lines of symmetry).
**Relationship to existing labs:** No existing coverage anywhere in the codebase. Pairs directly with this grade's own AnglesAndProtractorLab (4.MD.5-7, planned separately) — both introduce angle vocabulary, so sequence AnglesAndProtractorLab first if both are built around the same time, so that lab's acute/right/obtuse vocabulary and the physical sense of "amount of turn" are already established before this lab's Unit 1 needs to use those words to classify static figures.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. This is heavily vocabulary- and classification-driven content — every new term (ray, perpendicular, parallel, isosceles, rhombus, line of symmetry) should be introduced with a clear visual definition and a few "yes, this counts" / "no, this doesn't count" examples before it's used in a classification task.

## Units

### Unit 1: Points, Lines, Rays & Angle Types
- **Goal:** I can tell the difference between a point, a line, a line segment, and a ray, and I can identify right, acute, and obtuse angles inside a shape.
- **Standard:** 4.G.1 (lines/rays/angle-type sub-part)
- **Buckets:**
  - Distinguish a line segment (two endpoints) from a ray (one endpoint, extends infinitely one way) from a line (extends infinitely both ways) — presented as drawings, not just definitions, since the visual distinction (where does it stop vs. where does an arrow show it keeps going) is the actual skill
  - Identify right vs. acute vs. obtuse angles presented in isolation (not yet inside a compound figure)
  - Identify right vs. acute vs. obtuse angles as they appear INSIDE a 2D figure (e.g. "which angle in this quadrilateral is obtuse?") — a genuinely harder case than the isolated-angle bucket, since the student must first visually locate the angle within a busier figure
- **Requires intro (CFU gate):** Yes. New vocabulary with two real misconception risks: (1) confusing a ray with a line segment because both are drawn as a straight mark on paper and the "goes on forever" property isn't visually obvious without the arrow convention being explicitly taught; (2) near-right angles — an 85° or 95° angle drawn close to square — being misjudged as "right" by eye rather than checked.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 2: Parallel & Perpendicular Lines
- **Goal:** I can identify parallel lines (lines that never meet) and perpendicular lines (lines that cross at a right angle) in a figure.
- **Standard:** 4.G.1 (parallel/perpendicular sub-part)
- **Buckets:**
  - Lines that are clearly parallel (visually obvious, same direction, consistent gap)
  - Lines that merely don't currently cross within the drawn figure but are NOT parallel (would eventually meet if extended) — a required distractor bucket, since "doesn't touch right now" is not the same as "never meets"
  - Lines that cross but are NOT perpendicular (an oblique intersection) — required distractor for the perpendicular case, since "they cross" alone is sometimes mistaken for "perpendicular"
  - Parallel/perpendicular lines identified within a labeled 2D figure (e.g. "which pair of sides in this trapezoid is parallel?") rather than presented as two bare lines
- **Requires intro (CFU gate):** Yes. New concept with two named misconceptions: students sometimes assume two lines that don't currently intersect on the page must be parallel (without the "would never meet if extended" check), and sometimes assume any two intersecting lines are perpendicular rather than checking the angle is actually 90°.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 3: Classifying Triangles
- **Goal:** I can sort triangles by their sides (equilateral, isosceles, scalene) and by their angles (including recognizing a right triangle).
- **Standard:** 4.G.2 (triangle sub-part)
- **Buckets:**
  - Classify by side length alone (equilateral: all 3 equal; isosceles: exactly 2 equal; scalene: none equal)
  - Classify by angle alone (contains a right angle vs. does not)
  - Classify a triangle that needs BOTH a side-classification AND an angle-classification simultaneously (e.g. "this is a right isosceles triangle") — the bucket that directly targets the main misconception below
  - A near-miss case: sides that LOOK close to equal but are given as measurably different (tests that classification is based on the stated/measured values, not visual impression)
- **Requires intro (CFU gate):** Yes. New concept with a named misconception: students often think the side-based system (equilateral/isosceles/scalene) and the angle-based system (right/acute/obtuse) are mutually exclusive alternatives — as if a triangle must pick ONE label — rather than understanding every triangle gets a classification from each system independently, and the two can combine (a triangle can be both "isosceles" and "right" at once).
- **Memorization fact (periodic re-check candidate):** No.

### Unit 4: Classifying Quadrilaterals
- **Goal:** I can sort quadrilaterals into categories (rhombus, square, rectangle, parallelogram, trapezoid) based on their sides and angles, and understand that some shapes belong to more than one category.
- **Standard:** 4.G.2 (quadrilateral sub-part)
- **Buckets:**
  - Identify defining attributes of each named category in isolation (e.g. "a rectangle has 4 right angles")
  - Classify a shape that belongs to exactly one of the five named categories (a trapezoid that is clearly not any of the others)
  - Classify a shape that belongs to MULTIPLE categories at once (a square, which is simultaneously a rhombus, a rectangle, and a parallelogram) — the bucket that directly targets the main misconception below
  - A non-example: a quadrilateral that fits none of the five special categories (an irregular quadrilateral), to confirm students aren't over-applying a label
- **Requires intro (CFU gate):** Yes. New concept with a well-documented, persistent misconception: students strongly default to thinking these categories are mutually exclusive boxes (a shape is "a square" OR "a rectangle," never both) rather than a nested hierarchy where a more specific shape automatically satisfies every more general category's rules. The CFU should explicitly walk through "is every square a rectangle?" (yes) before asking the reverse, harder direction, "is every rectangle a square?" (no) — the directionality of the inclusion is the real trap, not just the vocabulary.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 5: Lines of Symmetry
- **Goal:** I can find a line of symmetry in a shape — a line where, if you folded the shape along it, both sides would match exactly — and tell which shapes have one (or more than one).
- **Standard:** 4.G.3
- **Buckets:**
  - Shapes with exactly one line of symmetry (e.g. an isosceles triangle, a kite)
  - Shapes with multiple lines of symmetry (e.g. a square has 4, a circle has infinitely many — cap the practice range at a countable number)
  - Shapes with NO line of symmetry (an irregular or scalene-sided figure) — a required bucket, since students should be able to correctly say "none" rather than always finding a line even when one doesn't exist
  - A near-miss line drawn through a shape that looks plausible but does NOT actually produce matching halves when folded (tests the "would it really match" check, not just "does it pass through the middle")
- **Requires intro (CFU gate):** Yes. New concept with a named misconception: students often assume any line through a shape's visual center counts as a line of symmetry, without checking that folding along it actually produces two matching halves — a diagonal through a non-square rectangle is the classic example that looks central but fails the fold-and-match test.
- **Memorization fact (periodic re-check candidate):** No.

## Open questions / flags for the builder
- Sequence AnglesAndProtractorLab (this grade's sibling lab) before this one if both are built around the same time, per the note above — Unit 1 here assumes acute/right/obtuse vocabulary is already familiar.
- Unit 1 and Unit 2 could arguably merge into a single "Lines, Rays & Line Relationships" unit since they're both drawn from 4.G.1 — kept separate here because each targets a distinct, independently-named misconception worth its own CFU gate, but this is a reasonable judgment call to revisit at build time if the lab's overall length needs trimming.
- A shared draggable-fold-line symmetry-checker diagram (Unit 5) would also be useful for any future higher-grade transformation/reflection content (e.g. grade 8's rigid-motion standards) — worth checking `shared/diagrams/` for an existing primitive before building a new one, and flagging as an early promotion candidate given the likely second consumer.
- Proposed slot (MG8 or MG9) is provisional and may conflict with other Grade 4 labs proposing the same slots — final distribution should be resolved once all seven Grade 4 lab plans are reviewed together.
