# PythagoreanTheoremAndVolumeLab

**Proposed slot:** MM3 — provisional, confirm at build time per project convention. **Contention flag:** MM3 is also Grade 7's proposed slot, AND this is one of eight Grade-8 labs across two planning batches all proposing MM3 — this batch's three siblings (`FunctionsLab`, `TransformationsCongruenceAndSimilarityLab`, `BivariateDataAndScatterPlotsLab`) plus the other grade-8 batch's four (`ExponentsRadicalsAndScientificNotationLab`, `IrrationalNumbersAndApproximationLab`, `LinearEquationsAndProportionalRelationshipsLab`, `SystemsOfLinearEquationsLab`). Final slot assignment across grades 7/8 needs resolution before any of these is built (see Open questions).
**Grade:** 8
**Standards covered:** 8.G.6 (explain a proof of the Pythagorean Theorem and its converse), 8.G.7 (apply it to find unknown side lengths of right triangles in real-world/math problems in 2D and 3D), 8.G.8 (apply it to find the distance between two points in a coordinate system), 8.G.9 (know and use the volume formulas for cones, cylinders, and spheres).
**Relationship to existing labs:** No existing coverage of the Pythagorean Theorem anywhere in the codebase — Units 1-3 (8.G.6-8) are a clean gap. Unit 4's volume content (8.G.9) is a direct extension of `MG11_GeometryLab`'s existing Volume module (verified by reading its code: 6.G.2, right rectangular prisms only, V=l×w×h and V=B×h via unit-cube packing) — that lab covers volume for rectangular prisms ONLY and does not contain any cone/cylinder/sphere content. No overlap; this lab picks up exactly where that one stops, extending the same "volume of a solid" idea to three new solid types.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Ground the Pythagorean Theorem in an actual visual/area proof the student can watch play out (square rearrangement or similar-triangles) before treating a²+b²=c² as a formula to plug numbers into — the proof is explicitly part of the standard (8.G.6), not an optional aside.

## Units

### Unit 1: Understanding a Proof of the Pythagorean Theorem and Its Converse
- **Goal:** See a hands-on proof of why a²+b²=c² works for right triangles, and use the converse to check whether any triangle is a right triangle at all.
- **Standard:** 8.G.6
- **Buckets:**
  - Walk through a visual/area-based proof (square-rearrangement or similar-triangles) of a²+b²=c², answering a question about WHY it works, not just computing
  - Use the converse: given three side lengths, test whether a²+b²=c² holds to determine if the triangle is right — include a case that DOES hold, and a close-but-doesn't-hold near-miss (e.g. 5, 6, 8 vs. the true triple 6, 8, 10), so "close enough" rounding doesn't pass as a right triangle
  - A generalization/true-false trap: does a²+b²=c² apply to ANY triangle, or only right triangles — plug a non-right triangle's three sides into the equation to show it fails, reinforcing the theorem is conditional on the right angle
- **Requires intro (CFU gate):** Yes — the brief's own named misconception: students apply a²+b²=c² to any triangle, not just right ones. Also distinguish "the theorem SOLVES a right triangle's missing side" from "the converse TESTS whether a triangle is right at all" as two separate skills in one CFU.
- **Memorization fact (periodic re-check candidate):** Yes — the formula a²+b²=c² itself (which side is the hypotenuse, that it's conditional on a right angle) is a fixed fact worth periodic re-checking long-term. Flag `reintroEverySolved`.

### Unit 2: Finding Unknown Side Lengths — 2D and 3D
- **Goal:** Use the Pythagorean Theorem to find a missing side of a right triangle, including triangles hiding inside 3D shapes.
- **Standard:** 8.G.7
- **Buckets:**
  - Solve for the hypotenuse given both legs (direct: add the squares, take the square root)
  - Solve for a leg given the hypotenuse and the other leg — requires subtracting before taking the square root, a genuinely different algebraic manipulation than the hypotenuse case; common error is adding instead of subtracting
  - A real-world 2D context (ladder against a wall, diagonal distance across a rectangular field) requiring the student to first identify which given lengths are legs vs. hypotenuse before computing anything
  - A 3D diagonal application (e.g. the longest diagonal through a rectangular box) requiring TWO applications of the theorem in sequence — first find a face diagonal, then use that diagonal as a leg in a second right triangle to find the space diagonal — the real conceptual leap flagged in the brief, since it's not a single formula plug-in
- **Requires intro (CFU gate):** Yes — misconception: always adding the two given squares regardless of whether the unknown is the hypotenuse or a leg (must subtract for a leg); the 3D case needs explicit walkthrough since the hidden second triangle isn't obvious from the solid alone.
- **Memorization fact (periodic re-check candidate):** No — uses Unit 1's formula fact, but deciding add vs. subtract and spotting the hidden second triangle is reasoning applied fresh each time, not a standalone fact.

### Unit 3: Finding Distance Between Two Points on a Coordinate Plane
- **Goal:** Use the Pythagorean Theorem to find the straight-line distance between any two points plotted on a grid.
- **Standard:** 8.G.8
- **Buckets:**
  - Two points forming a purely horizontal or vertical segment (distance = simple coordinate difference, no theorem needed) — a baseline/contrast case so students recognize when the shortcut applies and when it doesn't
  - Two points in the same quadrant requiring the full theorem (build the right triangle from horizontal and vertical legs, then find the hypotenuse)
  - Two points in DIFFERENT quadrants (at least one negative coordinate), where finding leg lengths requires correctly subtracting signed coordinates rather than just reading a visual gap — a common sign-error zone
  - A real-world point-to-point problem (e.g. shortest path on a map grid) with no pre-drawn triangle, requiring the student to construct the right triangle themselves before applying the theorem
- **Requires intro (CFU gate):** Yes — misconception: subtracting coordinates in the wrong order or mishandling negative coordinates across quadrants, an error that's invisible once squared (a sign error on the subtraction still produces a valid-looking positive square) unless checked at the subtraction step itself.
- **Memorization fact (periodic re-check candidate):** No — an application of Unit 1's fact to a new context, not a separate fact to retain on its own.

### Unit 4: Volume of Cones, Cylinders, and Spheres
- **Goal:** Know and use the volume formulas for cones, cylinders, and spheres to find how much space these solids take up.
- **Standard:** 8.G.9
- **Buckets:**
  - Cylinder volume: V = πr²h, given radius and height directly
  - Cone volume: V = (1/3)πr²h, given radius and height, paired explicitly against the cylinder bucket so students see/use the 1/3 relationship (a cone is 1/3 the volume of a same-base-and-height cylinder) rather than memorizing the formula in isolation
  - Sphere volume: V = (4/3)πr³, given radius, and a diameter-given variant requiring the student to halve it first — a common place to forget the halving step
  - A real-world composite/comparison problem (e.g. "which holds more, this cone-shaped cup or this cylindrical cup," or an object described only by diameter) mixing at least two of the three solids in one scenario, so the formulas aren't only practiced in isolated blocks
- **Requires intro (CFU gate):** Yes — three new formulas at once, with the nameable misconception of confusing which solid gets the 1/3 factor (cone) vs. the 4/3 factor (sphere), and forgetting to halve a given diameter before squaring/cubing it as a radius.
- **Memorization fact (periodic re-check candidate):** Yes — per the brief's explicit guidance, all three solid-volume formulas (cylinder, cone, sphere) are worth periodic re-checking as standalone facts. Flag `reintroEverySolved` for all three.

## Open questions / flags for the builder
- **MM3 contention (flag required for every lab in this grade-8 batch):** see header note above — eight total grade-8 labs across two batches, plus grade 7's own MM3 proposal, need slot resolution before any is built. `MH1` is earmarked for grade 9 content per the other batch's notes and should not be used as overflow without an explicit decision.
- The Unit 4 / `MG11_GeometryLab` Volume-module relationship is a direct, verified extension (read the actual module code, not just the stated grade/standard) — no [VERIFY] flag needed, per explicit guidance for this lab.
- Unit 3 (8.G.8, distance formula) assumes comfort with plotting points in all four quadrants (6.NS.8) — not re-taught here.
