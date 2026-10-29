# ScaleDrawingsAndConstructionsLab

**Proposed slot:** MM3 — provisional, confirm at build time per project convention.
**Grade:** 7
**Standards covered:** 7.G.1 (solve problems involving scale drawings — actual lengths/areas from a scale drawing, reproduce at a different scale), 7.G.2 (draw geometric shapes with given conditions — freehand, ruler/protractor, technology — focus on constructing triangles from three angle/side measures, noticing unique/multiple/no-triangle outcomes), 7.G.3 (describe 2D cross-sections of 3D figures — right rectangular prisms and pyramids).
**Relationship to existing labs:** No existing coverage anywhere in the codebase — this is a clean gap. Grade 7's other geometry standards (7.G.4 circle area/circumference, 7.G.5 angle relationships, 7.G.6 area/volume of composite figures) are out of scope for this lab and are planned separately (AnglesAreaCircumferenceAndVolumeLab, in this same planning batch).
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Scale drawings should be grounded in something tangible the student already recognizes as "scaled" (a map, a blueprint, a model) before the scale factor becomes a pure number to compute with. For triangle construction, the interactive "drag to try to build it" exploration matters more than a stated rule — let the student attempt to build a triangle from given measurements and directly SEE it succeed, flop into multiple shapes, or fail to close, rather than being told in advance which outcome to expect. For cross-sections, show the slice happening (an animated or step-through "cut" through the solid) rather than presenting the resulting shape as a fact to accept.

## Units

### Unit 1: Scale Drawings — Actual Lengths and Areas
- **Goal:** Use a scale drawing's scale factor to find real-world lengths and areas, and redraw the same figure at a different scale.
- **Standard:** 7.G.1
- **Buckets:**
  - Find an actual length from a scale drawing, given the scale (scale drawing → actual, the more intuitive direction)
  - Find a scale-drawing length, given an actual length and the scale (actual → scale drawing, the reverse direction)
  - Find an actual AREA from a scale drawing's dimensions or stated area — the squared-scale-factor trap, where applying the linear scale factor directly to area (instead of squaring it) is the predictable wrong answer
  - Reproduce/redraw the same figure at a DIFFERENT given scale (convert between two scale factors directly, not just scale ↔ actual)
  - A scale expressed in a less "clean" ratio form (e.g. "1 inch = 8 feet" or "3 cm represents 2 km"), requiring unit-rate-style reasoning rather than a simple round multiplier
- **Requires intro (CFU gate):** Yes — "area scales by the square of the linear scale factor, not by the linear factor itself" is a real, specific, commonly-missed idea that is genuinely different from the length case and needs a deliberate walkthrough (e.g. visually tiling a scaled shape) rather than a stated rule.
- **Memorization fact (periodic re-check candidate):** No — re-derivable each time from "area scales as length squared" reasoning, not a fact to recall independent of understanding why.

### Unit 2: Constructing Triangles from Given Measures
- **Goal:** Try to build a triangle from three given side lengths or angle measures, and discover whether the measurements produce exactly one triangle, many different triangles, or no triangle at all.
- **Standard:** 7.G.2
- **Buckets:**
  - Unique triangle — three given measurements (e.g. three side lengths satisfying the triangle inequality, or enough angle/side combination) that fix exactly one possible triangle shape
  - Multiple triangles possible — an under-constrained set of givens (e.g. two sides and a non-included angle) that can swing into more than one valid triangle
  - No triangle possible, case A — side lengths that cannot reach each other (the triangle inequality is violated, e.g. 2, 3, and 10)
  - No triangle possible, case B — three angle measures that do not sum to exactly 180° (e.g. 80° + 90° + 90°)
- **Requires intro (CFU gate):** Yes — "any three given measurements always form exactly one triangle" is explicitly the named misconception this standard exists to correct; the CFU and Explore should rely on the drag-to-try-and-build interaction (per this lab's audience framing) so the student discovers the outcome rather than being told it.
- **Memorization fact (periodic re-check candidate):** No — conceptual and visual, reasoned through anew via the construction attempt each time rather than recalled as a fact.

### Unit 3: Cross-Sections of 3D Figures
- **Goal:** Figure out what 2D shape results from slicing through a right rectangular prism or a pyramid, depending on the direction of the cut.
- **Standard:** 7.G.3
- **Buckets:**
  - A horizontal slice through a rectangular prism, parallel to the base (yields a rectangle or square matching the base's shape)
  - A vertical slice through a rectangular prism, parallel to a side face (yields a rectangle)
  - A slice through a rectangular prism at an angle not parallel to any face (yields a different quadrilateral than any of the prism's own faces) — the case that breaks the "a cross-section is just one of the existing faces" assumption
  - A horizontal slice through a pyramid, parallel to the base and NOT through the apex (yields a smaller polygon similar to the base, not a copy of it)
  - A vertical slice through a pyramid, passing through the apex (yields a triangle)
- **Requires intro (CFU gate):** Yes — "a cross-section is just a copy of one of the solid's existing faces" is the natural but wrong assumption (a pyramid's horizontal slice looks like a SMALLER version of the base, not the same size, and an angled slice through a prism isn't a face at all); this needs a guided, visual "watch the cut happen" walkthrough per this lab's audience framing, not a stated rule.
- **Memorization fact (periodic re-check candidate):** No — spatial/visual reasoning, re-derived by picturing or watching the slice each time rather than recalled as a fixed fact.

## Open questions / flags for the builder

- Unit 2's Explore interaction (drag side/angle measurements to attempt a triangle construction) is explicitly called out as more important than a stated rule in this lab's audience framing — confirm at build time whether `shared/diagrams/` has anything close to a draggable triangle-construction tool to extend, or whether this is a genuinely new diagram component worth building fresh (it likely is, since no other lab in this codebase currently does interactive geometric construction).
- Unit 3's cross-section diagrams (showing a 3D solid being sliced) likely need a new shared 3D-ish diagram primitive (even if rendered as a stylized 2D projection) — check `shared/diagrams/` for any existing prism/pyramid rendering before building one from scratch, since none is referenced elsewhere in this plan's "existing labs" research.
- Decide at build time whether Unit 1's scale drawings should be restricted to rectangular/simple polygon figures only, or should include a composite or irregular figure case for the area bucket — the standard's text doesn't specify, and either choice is reasonable for a first-exposure lab.
