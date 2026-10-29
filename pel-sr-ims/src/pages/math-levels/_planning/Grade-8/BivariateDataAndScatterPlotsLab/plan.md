# BivariateDataAndScatterPlotsLab

**Proposed slot:** MM3 — provisional, confirm at build time per project convention. **Contention flag:** MM3 is also Grade 7's proposed slot, AND this is one of eight Grade-8 labs across two planning batches all proposing MM3 — this batch's three siblings (`FunctionsLab`, `TransformationsCongruenceAndSimilarityLab`, `PythagoreanTheoremAndVolumeLab`) plus the other grade-8 batch's four (`ExponentsRadicalsAndScientificNotationLab`, `IrrationalNumbersAndApproximationLab`, `LinearEquationsAndProportionalRelationshipsLab`, `SystemsOfLinearEquationsLab`). Final slot assignment across grades 7/8 needs resolution before any of these is built (see Open questions).
**Grade:** 8
**Standards covered:** 8.SP.1 (construct/interpret scatter plots for bivariate measurement data, describe patterns — clustering, outliers, positive/negative/linear/nonlinear association), 8.SP.2 (know lines are widely used to model relationships between two quantitative variables, informally fit a line to a linear scatter plot and assess fit by closeness of points), 8.SP.3 (use a linear model's equation to solve problems in context, interpreting slope and intercept), 8.SP.4 (understand patterns of association also appear in bivariate categorical data via two-way frequency/relative-frequency tables, construct/interpret such a table and use relative frequencies to describe possible association).
**Relationship to existing labs:** Direct sequel to grade 6's `DisplayingAndSummarizingDataLab` and grade 7's `RandomSamplingAndInferencesLab` (planned in separate batches for the Grade-6/Grade-7 folders — the grade-6 lab's plan did not yet exist at the time this was written; the grade-7 lab's plan does, and its own relationship note confirms it assumes single-variable center/variability skills from the grade-6 lab). Both of those cover ONE variable at a time (a single data set's center/spread/shape) or comparing two populations' distributions of the SAME variable. This lab is the first TWO-VARIABLE (bivariate) relationship content in the sequence — does X relate to Y — which neither prerequisite lab touches.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Ground "association" in an actual scatter plot the student builds or manipulates (not an abstract correlation claim) before asking them to judge direction/strength/fit — every pattern claim should be checkable by pointing at the plot.

## Units

### Unit 1: Constructing and Reading Scatter Plots
- **Goal:** Build a scatter plot from paired data and describe what it shows — clustering, outliers, and whether the association is positive, negative, or unclear.
- **Standard:** 8.SP.1
- **Buckets:**
  - Construct/plot a scatter plot from a given set of (x, y) data pairs
  - Describe a clearly positive association (both variables increase together) vs. a clearly negative association (one increases as the other decreases)
  - Identify an outlier point that breaks the overall pattern, and describe HOW it differs from the general trend (not just "that one's far away")
  - A "no association / nonlinear-looking" case — a scattered cloud with no clear linear trend, OR a trend that's clearly curved rather than straight — so students don't default to "positive or negative" when neither actually fits
- **Requires intro (CFU gate):** Yes — new vocabulary (clustering, association, outlier) with the misconception named explicitly in the brief: students think a scatter plot with a loose, noisy linear trend has "no relationship" because the points aren't on a perfect line. CFU should show a noisy-but-real positive association next to a truly random cloud and ask which (if either) shows association.
- **Memorization fact (periodic re-check candidate):** No — pattern recognition applied fresh to each plot, not a fact to recall.

### Unit 2: Fitting a Line to a Scatter Plot
- **Goal:** Draw a line that reasonably fits a linear-looking scatter plot, and judge how well it fits by how close the points sit to it.
- **Standard:** 8.SP.2
- **Buckets:**
  - Fit a line to a tight, clearly linear scatter plot (points close to a line) — the baseline, easiest case
  - Fit a line to a noisier scatter plot where multiple reasonable lines could be drawn, requiring a judgment of "reasonably good fit" rather than finding one exact correct line
  - Compare two candidate lines drawn on the SAME scatter plot and judge which fits better and why (fewer/smaller gaps to the points) — tests the assessment skill directly, not just the drawing skill
  - A scatter plot that is NOT a good candidate for a linear fit at all (clearly curved, or clustered with no trend) — correctly declining to force a line onto data that doesn't call for one
- **Requires intro (CFU gate):** Yes — misconception: trying to draw a line through as many individual points as possible (connect-the-dots) rather than balancing the overall trend, and assuming every scatter plot deserves a best-fit line even when the data isn't linear.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 3: Using a Linear Model's Equation in Context
- **Goal:** Use the equation of a fitted line to make predictions, and explain what the slope and y-intercept mean in the real-world situation the data came from.
- **Standard:** 8.SP.3
- **Buckets:**
  - Use a given linear model equation to predict a y-value for an x-value WITHIN the original data's range (interpolation)
  - Use the equation to predict for an x-value OUTSIDE the original data's range (extrapolation), paired with a question about whether that prediction should be trusted as much, since the trend might not continue
  - Interpret the slope in context (e.g. "cost increases by $X per additional item") as a RATE, and interpret the y-intercept in context (e.g. "the flat fee at zero items") — a single multi-part question requiring BOTH interpretations for the same model so neither can be answered by pattern-matching the other
  - A reverse problem: given a target y-value, use the equation to solve for the x-value that would produce it
- **Requires intro (CFU gate):** Yes — misconception: swapping which part of the equation is the rate vs. the starting value (the same misconception this grade's `FunctionsLab` names for 8.F.4, now applied to a statistical model), and over-trusting extrapolated predictions far outside the observed data.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 4: Two-Way Frequency Tables for Categorical Data
- **Goal:** Build and read a two-way table showing how two categorical variables relate, and use relative frequencies to describe whether an association exists between them.
- **Standard:** 8.SP.4
- **Buckets:**
  - Construct a two-way frequency table (raw counts) from a description of categorical data (e.g. students tallied by grade level and whether they play an instrument)
  - Compute ROW relative frequencies (each row's counts as a fraction/percent of that row's total) and interpret them
  - Compute COLUMN relative frequencies for the SAME table and interpret them, paired explicitly against the row-relative-frequency bucket — choosing row vs. column changes which question the percentages answer, and conflating the two is the central misconception here
  - Use relative frequencies to judge whether an association exists (one group's percentage for a trait is clearly higher than another's) vs. a contrast table where the relative frequencies come out nearly equal across categories (no real association)
- **Requires intro (CFU gate):** Yes — misconception: computing a relative frequency against the wrong total (grand total when a row/column total was called for, or vice versa), and treating row-wise and column-wise percentages as interchangeable.
- **Memorization fact (periodic re-check candidate):** No — which total to divide by is re-derived from the specific question asked each time, not a fixed fact.

## Open questions / flags for the builder
- **MM3 contention (flag required for every lab in this grade-8 batch):** see header note above — eight total grade-8 labs across two batches, plus grade 7's own MM3 proposal, need slot resolution before any is built. `MH1` is earmarked for grade 9 content per the other batch's notes and should not be used as overflow without an explicit decision.
- `DisplayingAndSummarizingDataLab`'s plan (Grade-6 planning folder) did not exist at the time this was written, only its empty folder — this lab's prerequisite assumption (single-variable center/spread already covered there) should be re-verified once that plan lands, in case its actual scope differs from its name.
- Unit 3's slope/intercept-in-context interpretation deliberately mirrors `FunctionsLab`'s Unit 4 (8.F.4) misconception framing — recommend the builder keep the two labs' CFU wording independent (don't copy-paste the same scenario) even though the underlying misconception is the same one.
