# Measurement Conversion & Word Problems Lab

**Proposed slot:** MG8 or MG9 — provisional, confirm at build time per project convention.
**Grade:** 4
**Standards covered:** 4.MD.1 (know relative sizes of measurement units within one system — km/m/cm, kg/g, lb/oz, l/ml, hr/min/sec — express a larger unit in terms of a smaller unit, record in a two-column table), 4.MD.2 (use the four operations to solve word problems involving distances, time intervals, liquid volumes, masses, and money, incl. simple fractions/decimals and unit conversion, represented with diagrams incl. number-line scales), 4.MD.3 (apply area and perimeter formulas for rectangles in real-world and mathematical problems).
**Relationship to existing labs:** No existing coverage anywhere in the codebase. This lab's area/perimeter unit (4.MD.3) reuses the same formula-application reasoning MG9_MultiDigitMultiplicationLab's multi-digit multiplication supports computationally, and extends grade 3's AreaAndPerimeterLab (3.MD.5-8, planned separately) from the conceptual "why" to applying formulas directly in word problems — if that grade-3 lab is built first, a student arriving here should already understand area as tiling and perimeter as a boundary sum; this lab assumes that and focuses on formula fluency and solving for an unknown dimension. 4.MD.1's conversion-table unit is a direct precursor to grade 5's MeasurementConversionAndLinePlotsLab (5.MD.1), which extends conversion to more complex multi-step problems across more unit systems.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Every new unit-conversion factor should be introduced with a concrete, visualizable comparison (e.g. "a kilogram is about as heavy as a liter of water — and 1000 grams make one") before it's drilled numerically.

## Units

### Unit 1: Comparing & Converting Measurement Units
- **Goal:** I can tell how many of a smaller unit fit into a bigger one, and use that to convert measurements within the same system (length, mass, capacity, or time).
- **Standard:** 4.MD.1
- **Buckets:**
  - Length family (km↔m, m↔cm) — factor of 1000 or 100
  - Mass family (kg↔g) — factor of 1000
  - Capacity family (l↔ml) — factor of 1000
  - Weight family (lb↔oz) — factor of 16 (the one irregular, non-power-of-ten factor in this standard — deliberately not skippable, since it's the bucket most likely to get memorized wrong if under-practiced)
  - Time family (hr↔min, min↔sec) — factor of 60
  - "Build the two-column table" — generate the first several rows of a conversion table from a given factor, rather than converting one single value (tests the pattern, not just one lookup)
- **Requires intro (CFU gate):** Yes. New concept: converting from a larger unit to a smaller unit means MORE of that unit, so you multiply — not divide — by the conversion factor. Students very commonly have this backwards (e.g. think "3 km = 3 ÷ 1000 m" by pattern-matching "smaller number should get smaller").
- **Memorization fact (periodic re-check candidate):** Yes — the specific conversion factors (1000, 100, 16, 60) are meant to be memorized long-term, the same kind of fact MM1_RatioLab's existing "Conversion" unit already handles with a `requiresIntro`/`reintroEverySolved` periodic-recheck pattern. Follow that precedent here.

### Unit 2: Word Problems with Distance, Time, Volume & Mass
- **Goal:** I can solve word problems that use adding, subtracting, multiplying, or dividing measurements — including problems where I have to convert units first.
- **Standard:** 4.MD.2
- **Buckets:**
  - Same-unit problems (no conversion needed, pure four-operations word problem with a measurement context)
  - Mixed-unit problems where quantities must be converted to a common unit BEFORE combining (e.g. "2 kg of flour plus 500 g of sugar" — the classic trap where a student adds "2 + 500" without converting)
  - Problems with simple fractions or decimals in the measurement (e.g. "1 1/2 liters," "2.5 km")
  - Problems represented on a number-line diagram with a measurement scale, where the student reads values off the diagram rather than from text alone
- **Requires intro (CFU gate):** Yes. New concept beyond Unit 1: you cannot add or subtract two measurements unless they're in the same unit first — this is a distinct skill from simply converting a single value, and the "add across units without converting" error is one of the most common and persistent mistakes at this grade.
- **Memorization fact (periodic re-check candidate):** No — this unit applies Unit 1's memorized facts to reasoning, it isn't itself a new fact to memorize.

### Unit 3: Money Word Problems
- **Goal:** I can solve word problems about money, including problems with dollars and cents together, using all four operations.
- **Standard:** 4.MD.2 (money sub-case)
- **Buckets:**
  - Whole-dollar-amount problems
  - Problems requiring exact-cents answers (format matters: "$4.50" not "$4.5")
  - Multi-item totals (buying several different-priced items, find the total or the change from a given bill)
  - "How many can I buy" problems (division with a remainder that must be interpreted as "money left over," not discarded or rounded)
- **Requires intro (CFU gate):** No — this is money applied to the same four-operations skill Unit 2 already gates; the only new wrinkle is answer formatting (two decimal places), which the engine's existing `NumberStep.money` flag (seen in MM1_RatioLab) already handles with its own dedicated format-mismatch message, so it doesn't need a separate conceptual gate.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 4: Area & Perimeter Formulas in Context
- **Goal:** I can use the area formula (length × width) and the idea of perimeter to solve real word problems about rectangles, including problems where I have to find a missing side.
- **Standard:** 4.MD.3
- **Buckets:**
  - Find area given length and width
  - Find perimeter given length and width
  - Find a missing side length given area and the other side (division, "undo" the multiplication)
  - Find a missing side length given perimeter and the other side (subtraction/halving, a different "undo" than the area case — deliberately paired so students see the two formulas require different missing-side strategies)
  - Compare two rectangles with the same perimeter but different area (or vice versa) — the same conceptual trap grade 3's Area & Perimeter lab introduces, revisited here in an applied-formula context
- **Requires intro (CFU gate):** Yes. New concept (if grade 3's Area & Perimeter lab hasn't been completed first, or as a refresher if it has): students often confuse which formula to use when a problem gives "the area is 24 and one side is 4" vs. "the perimeter is 24 and one side is 4" — the surface-level numbers look identical but require opposite operations to undo.
- **Memorization fact (periodic re-check candidate):** No — the formulas are applied with reasoning each time, not recalled as an isolated fact (this unit builds the reasoning, not just the formula label).

## Open questions / flags for the builder
- Confirm whether grade 3's AreaAndPerimeterLab (3.MD.5-8) exists and is built before this lab, since Unit 4's framing above assumes a student already understands area-as-tiling conceptually; if built first, this lab can safely jump straight to formula application without re-teaching the concept from scratch.
- Unit 3 (Money) could arguably be folded into Unit 2 as a bucket rather than a standalone unit, since it shares the same core skill gate — kept separate here because money's format-matching requirement (`NumberStep.money`) is a genuinely distinct UI/engine concern worth its own focused practice set, but this is a reasonable judgment call to revisit at build time.
- Proposed slot (MG8 or MG9) is provisional and may conflict with other Grade 4 labs proposing the same slots — final distribution across MG8/MG9 should be resolved once all seven Grade 4 lab plans are reviewed together.
