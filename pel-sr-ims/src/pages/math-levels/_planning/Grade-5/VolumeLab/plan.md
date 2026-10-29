# VolumeLab

**Proposed slot:** MG10 — provisional, confirm at build time per project convention.
**Grade:** 5
**Standards covered:**
- 5.MD.3a-b — Recognize volume as an attribute of solid figures; understand that a solid figure's volume is measured by counting the number of same-size unit cubes needed to fill it with no gaps or overlaps.
- 5.MD.4 — Measure volume by counting unit cubes (cubic cm, cubic in, cubic ft, and improvised units).
- 5.MD.5a-c — Find the volume of a right rectangular prism with WHOLE-NUMBER side lengths by packing it with unit cubes, and show that the volume is the same as would be found by multiplying the edge lengths, equivalently by multiplying the height by the base area, representing whole-number products as volumes (a); apply the formulas V=l×w×h and V=b×h for right rectangular prisms with whole-number edge lengths to solve real-world and mathematical problems (b); recognize volume as additive, find volumes of solid figures composed of two non-overlapping right rectangular prisms by adding the volumes of the non-overlapping parts (c).

**Relationship to existing labs:** [VERIFY] MG11_GeometryLab already has a Volume unit, but per VISUAL_COMPONENT_TODO.txt that unit was built for 6.G.2 — volume of a right rectangular prism with FRACTIONAL edge lengths, packed with unit cubes of the appropriate fraction edge length. This lab's 5.MD.3-5 content is whole-number-only, which is almost certainly a genuine prerequisite step that comes BEFORE the fractional case, not a duplicate of it. This is likely a real, non-overlapping gap — but confirm before building (see flags below).

**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. The core new idea here is that volume is literally a count of unit cubes — every unit should let the student see and/or build the cube-packing before jumping to the l×w×h shortcut, so the formula is understood as "a fast way to count cubes," not a disconnected rule to memorize. The additive-volume unit (5.MD.5c) is a good place to confront a common shortcut-misconception: students who try to treat a composite solid's overall dimensions as one single box rather than decomposing it into non-overlapping prisms first.

## Units

### Unit 1: What Volume Measures
- **Goal:** Understand that volume means "how many unit cubes it takes to fill a solid, with no gaps or overlaps" — and that this is a genuinely different attribute from area or length.
- **Standard:** 5.MD.3a-b
- **Buckets:** (a) identifying volume vs. area vs. length given a labeled figure (vocabulary/conflation check — "this is a 2D shape, it doesn't have volume" vs. "this is a solid, it does"), (b) a solid correctly packed with unit cubes and no gaps, (c) a deliberately WRONG packing shown with gaps or overlaps that the student must identify as invalid (directly tests the "no gaps or overlaps" clause of the standard, not just the counting skill), (d) comparing two differently-shaped solids built from the same number of unit cubes to establish that volume doesn't depend on shape alone.
- **Requires intro (CFU gate):** Yes — this unit is pure vocabulary/definition-building (volume vs. area vs. length is a classic conflation for students who've only just secured area as "square units"), which is exactly what a rote drill never checks directly.
- **Memorization fact (periodic re-check candidate):** No — this is a definitional/conceptual understanding that should remain re-derivable by reasoning about the figure, not a fact to memorize.

### Unit 2: Counting Unit Cubes
- **Goal:** Find the volume of a solid by directly counting the unit cubes used to build it.
- **Standard:** 5.MD.4
- **Buckets:** (a) a simple single-layer arrangement (cubes all visible, straightforward count), (b) a multi-layer arrangement where some cubes are hidden behind others and must be inferred from the layer structure rather than visually counted one-by-one, (c) cubes measured in different-but-consistent improvised/standard units (cubic cm vs. cubic in) to reinforce that the UNIT matters, not just the count, (d) an irregular (non-rectangular-prism) solid built from unit cubes, to keep this unit's counting skill distinct from Unit 3's upcoming l×w×h shortcut — counting must work even when the shortcut formula doesn't apply yet.
- **Requires intro (CFU gate):** No — this is a direct extension of Unit 1's definition into a counting skill; the conceptual gate already happened in Unit 1, so this unit is closer to guided/extended practice.
- **Memorization fact (periodic re-check candidate):** No — counting is always re-derivable by direct inspection of the figure.

### Unit 3: Volume of a Right Rectangular Prism (V = l×w×h)
- **Goal:** Find the volume of a box shape by multiplying length × width × height — and see why that's just a fast way to count the unit cubes, not a disconnected new rule.
- **Standard:** 5.MD.5a-b
- **Buckets:** (a) a prism where l, w, h are shown explicitly and the student computes directly, (b) a prism shown ONLY as a packed-cube picture (no dimensions labeled) where the student must first read off l/w/h from the cube grid, then multiply, (c) using the base-area × height form (V = b×h) instead of l×w×h on the same prism, to confirm the student sees these as the same idea viewed two ways rather than two unrelated formulas, (d) a real-world word problem requiring volume (e.g. "how much sand fills this container"), (e) a generalization/true-false check: "if you double one edge length, does the volume double?" (tests whether the student understands multiplicative scaling of volume, not just rote formula plug-in).
- **Requires intro (CFU gate):** Yes — the leap from "count the cubes" to "multiply the edges" is the central idea of 5.MD.5a and needs an explicit, confirmed bridge (via the packed-cube-picture bucket) before the formula is treated as a free-standing shortcut.
- **Memorization fact (periodic re-check candidate):** Yes — V=l×w×h (and the equivalent V=b×h) is exactly the kind of fixed formula this codebase's convention treats as worth periodic re-checking (reintroEverySolved) once proven, since it's easy to apply the formula correctly once and then lose the cube-counting grounding behind it over time.

### Unit 4: Volume of Composite Solids (Additive Volume)
- **Goal:** Find the volume of a solid made of two separate box shapes stuck together, by finding each box's volume separately and adding them.
- **Standard:** 5.MD.5c
- **Buckets:** (a) two prisms clearly separated with an obvious dividing line (straightforward decomposition), (b) two prisms combined into an L-shape or step-shape where the dividing line between the two parts must be identified by the student rather than being pre-drawn, (c) a trap case explicitly testing the misconception named in the audience framing — a solid's OVERALL bounding dimensions are given alongside its actual (smaller, L-shaped) composite shape, and the student must recognize that multiplying the overall bounding box's dimensions would overcount, rather than decomposing into the two actual non-overlapping prisms, (d) a case requiring the student to find one missing edge length of one sub-prism using the overall figure's known dimensions before computing that sub-prism's volume.
- **Requires intro (CFU gate):** Yes — bucket (c)'s "don't just multiply the bounding box" trap is a real, specific misconception worth a named check, not just more of Unit 3's practice.
- **Memorization fact (periodic re-check candidate):** No — decomposition strategy varies by figure and should remain reasoning-based (identify the non-overlapping parts, compute each, add), not a single memorized procedure.

## Open questions / flags for the builder

**[VERIFY] — quick confirmation required before building this lab as fully separate from MG11_GeometryLab.** GeometryLab's existing Volume unit (6.G.2) is built around FRACTIONAL edge lengths per VISUAL_COMPONENT_TODO.txt's description, which strongly suggests it starts from the fractional case directly rather than building up from whole-number basics first — but confirm this by reading GeometryLab's actual Volume unit source (`MG11/GeometryLab/` — likely under its `modules/` or `shapes/` subfolder per the TODO's file-layout notes) before building VolumeLab as a wholly separate lab. Specifically check:

- Does GeometryLab's Volume unit include any whole-number-only warm-up content, or does its problem generator only ever produce fractional edge lengths? If it's fractional-only throughout, this VolumeLab is a genuine, non-overlapping prerequisite gap and should proceed as planned above.
- If GeometryLab's Volume unit DOES already incidentally start from whole-number basics (e.g. as a first difficulty tier before introducing fractions), the builder should decide whether this plan's Unit 1-4 content would be redundant with that existing on-ramp, or whether it's still worth building as a dedicated, more thorough whole-number foundation (this lab's explore-first, cube-counting-grounded approach is more thorough than a single difficulty tier inside a harder lab would likely be) — note the decision either way in the build report rather than silently picking one.
- This is expected to resolve as "proceed as a separate lab" in most likely outcomes, unlike WholeNumberAndDecimalOperationsLab's flag above — but the check should still be done before writing code, not assumed.
