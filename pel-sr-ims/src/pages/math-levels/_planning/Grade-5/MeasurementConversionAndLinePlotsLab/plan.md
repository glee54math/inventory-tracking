# MeasurementConversionAndLinePlotsLab

**Proposed slot:** MG10 — provisional, confirm at build time per project convention.
**Grade:** 5
**Standards covered:** 5.MD.1 (convert among different-sized standard measurement units within one system — e.g. convert cm to m — and use these conversions in solving multi-step real-world problems), 5.MD.2 (make a line plot to display a data set of measurements in fractions of a unit — 1/2, 1/4, 1/8 — and use operations on fractions to solve problems arising from the data presented in the line plot).
**Relationship to existing labs:** No existing coverage anywhere in the codebase currently — this is a clean gap. 5.MD.1's unit-conversion skill is a direct extension of grade 4's `MeasurementConversionAndWordProblemsLab` (4.MD.1-3), which teaches the basic within-measurement-system conversion idea at a smaller scope. As of this planning pass, that grade-4 lab has not been built yet (no plan.md or folder exists for it under `_planning`), and build order across these planning folders is not guaranteed. This plan is therefore written assuming the grade-4 lab does NOT exist yet by build time: Unit 1 below teaches the unit-conversion concept from scratch rather than assuming prior exposure. If the grade-4 lab IS built by the time this lab is actually implemented, the builder should re-check this assumption and may compress/skip the from-scratch portion of Unit 1 in favor of a quick refresher, moving faster to the multi-step/multi-system application work this standard actually adds.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Ground every new conversion factor and the line-plot convention in a concrete, countable real-world scenario (a recipe's measuring cups, a row of pencils measured to the nearest 1/4 inch) before abstract unit-to-unit arithmetic.

## Units

### Unit 1: Same Amount, Different-Sized Units
- **Goal:** Understand that the same real quantity can be described with a bigger or smaller unit, and learn the standard conversion factors needed to switch between them.
- **Standard:** 5.MD.1 (foundational scope — single-step conversions within one system)
- **Buckets:**
  - Converting from a larger unit to a smaller unit within one system (e.g. meters to centimeters, pounds to ounces, hours to minutes) — multiplication direction
  - Converting from a smaller unit to a larger unit (e.g. centimeters to meters, ounces to pounds, minutes to hours) — division direction, the direction students more often get backwards
  - Converting across both length and weight/mass and time/capacity within the same practice set (not just length every time), so the conversion-factor lookup itself is practiced, not just one memorized number
  - A conversion that does NOT divide evenly (e.g. 130 minutes to hours and minutes, producing a mixed result) rather than only ever using tidy multiples of the conversion factor
- **Requires intro (CFU gate):** Yes — the larger-to-smaller (multiply) vs. smaller-to-larger (divide) directionality is a real, nameable misconception (students commonly multiply in both directions because "converting" feels like it should always make the number bigger), and the set of conversion factors itself (12 inches/foot, 16 oz/lb, 60 min/hour, etc.) is new vocabulary to establish before practice.
- **Memorization fact (periodic re-check candidate):** Yes — the standard conversion factors (e.g. 12 in = 1 ft, 3 ft = 1 yd, 16 oz = 1 lb, 2000 lb = 1 ton, 60 sec = 1 min, 60 min = 1 hr, cup/pint/quart/gallon relationships) are fixed facts this lab is teaching from scratch, meant to be retained long-term rather than re-derived from reasoning each time — set `reintroEverySolved` alongside `requiresIntro` so the guided walkthrough periodically re-surfaces them.

### Unit 2: Multi-Step Measurement Problems
- **Goal:** Use unit conversion as one step inside a bigger real-world problem that also needs addition, subtraction, multiplication, or division to finish.
- **Standard:** 5.MD.1 (applied scope — multi-step real-world problems)
- **Buckets:**
  - Convert-then-add/subtract (e.g. "a board is 2 feet long and another is 18 inches — what's the total length in inches?")
  - Convert-then-multiply/divide (e.g. "a recipe needs 1 pint of milk per batch; how many cups for 5 batches?")
  - A problem requiring TWO conversions before the final operation (e.g. combining a length in yards and a length in inches into one total in feet) — the step count itself is the added difficulty here, not a new conversion idea
  - A problem where the unit to convert TO must be inferred from the question's phrasing rather than being named explicitly (e.g. "how many more ounces of flour does recipe A use than recipe B, if A is given in pounds and B in ounces?") — testing whether the student notices a conversion is even needed, not just whether they can execute one once told
- **Requires intro (CFU gate):** Yes — chaining a conversion into a multi-step word problem is a new composite skill; the last bucket's "notice you need to convert at all" trap is the specific common failure mode worth a guided walkthrough.
- **Memorization fact (periodic re-check candidate):** No — the conversion facts themselves are already covered by Unit 1's re-check; this unit is about applying them, which should be reasoned through each time.

### Unit 3: Reading and Building a Fraction Line Plot
- **Goal:** Organize a set of measurements given in fractions of a unit (halves, quarters, eighths) onto a line plot, and read the plot back accurately.
- **Standard:** 5.MD.2 (foundational scope — constructing/reading the plot)
- **Buckets:**
  - Reading a completed line plot to answer a direct count question (e.g. "how many pencils measured exactly 3 1/4 inches?")
  - Building/placing a new data point onto a line plot given a raw measurement in fraction form
  - Reading a line plot where the x-axis increments are in eighths (the finest, most error-prone spacing) rather than only halves or quarters, since misreading tick spacing is a common, distinct failure mode from misreading a tidy halves/quarters plot
  - A line plot with an uneven/sparse distribution (some tick marks with zero data points, one tick with several stacked dots) rather than always-populated, evenly-spread data, so reading accuracy doesn't collapse into just counting dots left-to-right
- **Requires intro (CFU gate):** Yes — reading tick-mark spacing correctly on a fraction number line (distinguishing halves/quarters/eighths scales) is a new, error-prone skill with a specific common mistake (miscounting which fractional tick a dot sits on).
- **Memorization fact (periodic re-check candidate):** No — reading a given scale is a perceptual/procedural skill re-derived from the plot's own labeled axis each time, not a fact to memorize.

### Unit 4: Solving Problems From the Line Plot's Data
- **Goal:** Use the data shown in a line plot, combined with fraction operations (add/subtract, and simple multiply/divide by a whole number), to answer a real-world question.
- **Standard:** 5.MD.2 (applied scope — fraction operations on line-plot data)
- **Buckets:**
  - Finding the total (sum) of all data points on the plot, requiring adding several fractions/mixed numbers with like or related denominators
  - Finding the difference between the largest and smallest recorded value on the plot
  - Redistributing a total evenly (e.g. "if all the liquid in these containers were poured into one container and then split evenly among 4 people, how much does each person get?") — a divide-after-sum multi-step question
  - A question whose answer requires noticing and handling a repeated value correctly (e.g. three dots stacked at the same tick mark must be counted/added three times, not once) — the plot-reading and fraction-arithmetic mistakes compound here if the repeat is missed
- **Requires intro (CFU gate):** Yes — combining line-plot data reading with fraction arithmetic in one problem is this unit's new composite skill, and the repeated-value trap in the last bucket is a specific, nameable misconception (treating stacked dots as one data point).
- **Memorization fact (periodic re-check candidate):** No — this is applied fraction-operation reasoning on whatever data set is given, not a fixed fact.

## Open questions / flags for the builder

- No [VERIFY] flags — this lab has no existing coverage to reconcile against.
- Re-check the Unit 1 scope assumption at build time: if `MeasurementConversionAndWordProblemsLab` (grade 4, 4.MD.1-3) exists by then, consider compressing Unit 1's from-scratch teaching into a brief refresher and shifting more weight onto Unit 2's multi-step application, per the note in "Relationship to existing labs" above.
- Confirm which specific conversion factors to teach in Unit 1 (e.g. whether to include capacity units like cups/pints/quarts/gallons, or defer those to keep the fact list shorter) — this is a reasonable scope call for the builder to make and note, not a blocking ambiguity.
- Confirm at build time whether MG10 is in fact the correct open slot (shared with `CoordinatePlaneAndShapeClassificationLab` and `NumericalExpressionsAndPatternsLab` per this planning pass) or whether these three Grade-5 labs should be spread across multiple slots — this is a placement call for Stage 0 conversation, not something to assume silently.
