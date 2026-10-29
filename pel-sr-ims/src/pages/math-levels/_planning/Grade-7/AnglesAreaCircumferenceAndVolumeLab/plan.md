# AnglesAreaCircumferenceAndVolumeLab

**Proposed slot:** MM3 — provisional, confirm at build time per project convention.
**Grade:** 7
**Standards covered:** 7.G.4 (know and use circle area/circumference formulas, give an informal derivation of their relationship), 7.G.5 (use supplementary/complementary/vertical/adjacent angle facts in a multi-step problem to write/solve equations for an unknown angle), 7.G.6 (solve real-world/math problems involving area/volume/surface area of 2D/3D objects composed of triangles/quadrilaterals/polygons/cubes/right prisms)
**Relationship to existing labs:** Extends MG11_GeometryLab's (grade 5 slot, already built) area/volume work to circles and composite/multi-shape figures, and introduces angle-relationship reasoning (supplementary/complementary/vertical/adjacent) which nothing else in the codebase covers yet. MG11_GeometryLab stays at the 6.G level (whole-number side lengths, single simple shapes); this lab is the direct successor that should be sequenced after it.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Every circle-formula and angle-relationship concept should be anchored in a draggable/visual diagram (a radius dragged around a circle, two rays forming an angle pair) before any symbolic equation is asked for — these are the first circle and first angle-pair standards in the curriculum, so nothing should be introduced as a bare formula without a concrete derivation first.

## Units

### Unit 1: Circumference of a Circle
- **Goal:** Learn that a circle's distance around is always about 3.14 times its distance across, and use that to find circumference from radius or diameter.
- **Standard:** 7.G.4 (circumference formula + informal derivation)
- **Buckets:**
  - given radius, find circumference
  - given diameter, find circumference
  - given circumference, find radius or diameter (reverse/unknown-input direction)
  - informal-derivation question: estimate circumference by "rolling" the circle along a number line or measuring string-around-circle vs. string-across-circle, connecting the ~3.14 ratio to π
- **Requires intro (CFU gate):** yes — new vocabulary (radius vs. diameter is a classic conflation: students often divide/multiply by 2 in the wrong direction, or use the diameter where the formula calls for the radius); also a generalization trap ("is C = πd the same fact as C = 2πr, always?").
- **Memorization fact (periodic re-check candidate):** yes — C = πd / C = 2πr and the approximate value of π (3.14) are fixed formulas/facts meant to be retained long-term, not re-derived from reasoning each time, so this unit should set `reintroEverySolved` alongside `requiresIntro`.

### Unit 2: Area of a Circle
- **Goal:** Learn that a circle's area comes from a formula using its radius, and see informally why that formula connects to the circumference formula.
- **Standard:** 7.G.4 (area formula + informal derivation of area/circumference relationship)
- **Buckets:**
  - given radius, find area
  - given diameter, find area (must first halve to get radius — a distinct extra step, not a cosmetic variant)
  - given area, find radius (reverse direction, involves recognizing r² as inverse of squaring)
  - informal-derivation question: the "unrolled circle wedges form a parallelogram-ish shape with base ≈ half the circumference and height ≈ radius" visual, connecting A = πr² to C = 2πr
- **Requires intro (CFU gate):** yes — the radius-vs-diameter conflation returns here in a new form (squaring the diameter instead of the radius is a very common, specific, nameable error), plus the derivation question is new content, not just a drill.
- **Memorization fact (periodic re-check candidate):** yes — A = πr² is a fixed formula for long-term retention, same reasoning as Unit 1; set `reintroEverySolved`.

### Unit 3: Angle Relationships (Supplementary, Complementary, Vertical, Adjacent)
- **Goal:** Learn the four special ways two angles can relate to each other, and use those relationships to find a missing angle.
- **Standard:** 7.G.5
- **Buckets:** (the four named relationship types themselves — genuinely different reasoning patterns, not cosmetic variants, per the plan's explicit guidance)
  - supplementary (two angles sum to 180°, typically a linear pair) — solve for an unknown angle given the other
  - complementary (two angles sum to 90°) — solve for an unknown angle given the other
  - vertical (angles opposite each other at an intersection of two lines are congruent) — use congruence to find an unknown angle
  - adjacent (angles sharing a ray/side at a vertex) — recognize adjacency and combine it with another relationship (e.g. an adjacent pair that is ALSO supplementary) to set up a multi-step equation
- **Requires intro (CFU gate):** yes — this is brand-new vocabulary with a classic conflation risk: students frequently confuse "complementary" and "supplementary" (same first syllable, different sums) and confuse "vertical" angles (opposite, congruent) with "adjacent" angles (next to each other, not generally congruent). At least one CFU question should put both terms from a confusable pair in the same question so the student can't pattern-match just one.
- **Memorization fact (periodic re-check candidate):** no — recognizing these relationships is a reasoning/identification skill the student can always re-derive from the picture (sum to 180°/90°, same vertex and opposite rays, shared ray); it is not a fact that decays the way a formula does, so one-time proof is enough.

### Unit 4: Multi-Step Angle Equations
- **Goal:** Combine angle-relationship facts with algebra to solve for an unknown angle when the picture involves more than one relationship at once (e.g. an angle expressed as "3x + 10" that is supplementary to another expressed as "2x").
- **Standard:** 7.G.5 ("...in a multi-step problem to write and solve simple equations for an unknown angle")
- **Buckets:**
  - one relationship + one algebraic expression (e.g. solve 3x + 10 and its supplement for x, then find the actual angle measure — NOT just x)
  - two relationships chained (e.g. a vertical-angle fact feeds into a supplementary-angle equation to find a third angle)
  - a diagram with a decoy/irrelevant angle marked, so the student must identify which relationship actually applies rather than defaulting to "add to 180"
- **Requires intro (CFU gate):** yes — the specific, nameable misconception here is stopping at "solve for x" and reporting x as the final angle measure instead of substituting back in; also students often default to assuming supplementary (180°) even when the actual relationship pictured is complementary (90°) or vertical (congruent), so a CFU question should force identifying the relationship type before setting up the equation.
- **Memorization fact (periodic re-check candidate):** no — this is applied reasoning building on Unit 3's facts, always re-derivable from the diagram.

### Unit 5: Area and Volume of Composite Figures
- **Goal:** Find the area or volume of a shape built from more than one basic shape (triangles, quadrilaterals, other polygons, cubes, right prisms) by breaking it into pieces.
- **Standard:** 7.G.6
- **Buckets:**
  - composite 2D area: a figure decomposable into a rectangle + triangle (or similar), add the pieces
  - composite 2D area: a figure that requires SUBTRACTING a cut-out piece (e.g. a rectangle with a triangular notch or circular hole removed) rather than adding — a genuinely different reasoning direction from the additive case
  - composite 2D area involving a circle or circle-portion combined with a polygon (direct tie-back to Units 1-2, e.g. a rectangle topped with a semicircle)
  - composite 3D volume/surface area: a solid built from two right prisms/cubes stacked or joined, requiring the student to find each piece's dimensions from a shared edge
- **Requires intro (CFU gate):** yes — the specific, nameable misconception is defaulting to always adding decomposed pieces even when a piece should be subtracted (a hole/notch); a CFU question should present a subtractive case explicitly to check this is understood, not just assumed.
- **Memorization fact (periodic re-check candidate):** no — decomposition/recomposition strategy is a reasoning skill re-derived from the specific figure each time, not a fixed fact.

## Open questions / flags for the builder
- Whether Unit 5's 3D composite case should also require computing SURFACE AREA (not just volume) of a composite solid — the standard text explicitly lists "surface area" alongside "volume," but surface area of a composite solid (accounting for internal faces that are no longer exposed where two prisms join) is meaningfully harder than volume (which is simply additive). Recommend the builder confirm whether to split this into its own bucket or sub-unit rather than folding it silently into the volume bucket, since internal-face accounting is a distinct, easy-to-miss edge case.
- Whether π should be fixed at 3.14 throughout, or whether some problems should use the fraction 22/7 or leave answers in exact "in terms of π" form — the standard says "give an informal derivation," which suggests decimal approximation is fine for this grade's purposes, but the builder should pick one default and apply it consistently so Practice/Test answer-checking isn't ambiguous.
- Unit ordering assumes Units 1-2 (circle formulas) should precede Units 3-4 (angles) since they are independent sub-domains; this ordering is a judgment call for pacing, not dictated by the standard — flag if the user prefers angles first.
