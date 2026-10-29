# FunctionsLab

**Proposed slot:** MM3 — provisional, confirm at build time per project convention. **Contention flag:** MM3 is also Grade 7's proposed slot (per the Grade-7 planning batch's `ProportionalRelationshipsLab`/`ExpressionsAndEquationsLab`/`OperationsWithRationalNumbersLab` proposals), AND this is one of eight Grade-8 labs across two planning batches all proposing MM3 — this batch's three siblings (`TransformationsCongruenceAndSimilarityLab`, `PythagoreanTheoremAndVolumeLab`, `BivariateDataAndScatterPlotsLab`) plus the other grade-8 batch's four (`ExponentsRadicalsAndScientificNotationLab`, `IrrationalNumbersAndApproximationLab`, `LinearEquationsAndProportionalRelationshipsLab`, `SystemsOfLinearEquationsLab`). Final slot assignment across grades 7/8 needs resolution before any of these is built (see Open questions).
**Grade:** 8
**Standards covered:** 8.F.1 (understand a function as a rule assigning exactly one output per input; the graph is the set of input-output ordered pairs; function notation not required), 8.F.2 (compare properties of two functions represented differently — algebraically/graphically/numerically/verbally), 8.F.3 (interpret y=mx+b as a linear function with a straight-line graph, give examples of non-linear functions), 8.F.4 (construct a function modeling a linear relationship between two quantities, determine rate of change and initial value from a description or two (x,y) values incl. from a table/graph, interpret both in context), 8.F.5 (describe qualitatively the functional relationship between two quantities from a graph — increasing/decreasing, linear/nonlinear — sketch a graph from a verbal description).
**Relationship to existing labs:** No existing coverage anywhere — this is the FIRST explicit "function" content in the curriculum. Earlier grades work with expressions/equations/patterns (5.OA.3's two-rule numerical patterns, 6.EE.9's dependent/independent variables, 7.RP.2's proportional relationships) but never name the function concept, the "exactly one output" rule, or the graph-as-ordered-pairs idea itself. This lab is also a close cousin of this same grade-8 batch's `LinearEquationsAndProportionalRelationshipsLab` (8.EE.5-6: graphing proportional relationships, slope as unit rate, deriving y=mx and y=mx+b via similar triangles) — that lab approaches linearity from an algebra/slope-geometry lens, this one from a function-concept lens (Units 3-4 below land on the same y=mx+b territory from a different angle). Complementary, not duplicative, but flagged for the builder to cross-check examples at build time so the two labs don't reuse identical scenarios.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. "Function" is an abstract label for something students have already informally done (every input giving one answer) — ground every new vocabulary term in a table or graph the student can point at and check the rule against directly, before treating "function" as a word to apply from memory.

## Units

### Unit 1: What Is a Function?
- **Goal:** Figure out whether a rule is a function by checking that every input gives exactly one output.
- **Standard:** 8.F.1
- **Buckets:**
  - Given a table of input/output pairs, determine whether it's a function (no input repeats with a different output) vs. not (same input maps to two different outputs)
  - Given a set of ordered pairs with a REPEATED input that maps to the SAME output both times — still a valid function — so students don't flag a harmless repeat as disqualifying
  - Given a graph of discrete points, apply the "does any x-value appear twice with different y-values" check informally
  - A real-world rule described verbally (e.g. "each student's locker number" is a function of student; "each student's favorite color" is not, once two students who like different colors still each get exactly one color — then contrasted with a scenario where one student genuinely has two answers) tied to a relatable, checkable scenario
- **Requires intro (CFU gate):** Yes — new vocabulary and definition with a real, specific misconception: students think ANY repeated input disqualifies a relation from being a function, instead of checking whether the repeated input's outputs actually disagree; CFU should present a repeated-input-same-output case and a repeated-input-different-output case side by side so the two can't be told apart by surface pattern alone.
- **Memorization fact (periodic re-check candidate):** No — the rule is re-applied by checking inputs/outputs fresh each time, not a fact to recall independent of the data in front of the student.

### Unit 2: Comparing Functions Represented Differently
- **Goal:** Compare two functions when one is shown as an equation, one as a table, one as a graph, and one described in words.
- **Standard:** 8.F.2
- **Buckets:**
  - Compare a function given as an equation against one given as a table (e.g. which has the greater rate of change)
  - Compare an equation against a graph
  - Compare a table against a verbal description
  - Compare two functions in the SAME representation (e.g. two graphs, read off and compare y-intercepts) so the skill isn't only cross-representation translation but also direct property-reading within a matching format
  - A trap pair with equal rate of change but different initial value, which a student skimming only one property might mistake for "the same function"
- **Requires intro (CFU gate):** Yes — translating between representations is a new skill; the named misconception is assuming "bigger numbers in the equation" means bigger output values everywhere, without actually evaluating or comparing at a shared point.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 3: Linear vs. Non-linear Functions
- **Goal:** Recognize y=mx+b as a straight-line (linear) function, and spot functions that are NOT linear.
- **Standard:** 8.F.3
- **Buckets:**
  - Given an equation in y=mx+b form (varying m and b, incl. m=0 and b=0), confirm it's linear and identify the slope/intercept
  - Given a table of values, determine linear (constant difference between consecutive outputs) vs. non-linear (differences that change) — include a table that looks almost constant but has one irregular gap, so students check every interval, not just the first one
  - Given a non-linear equation (e.g. y=x², y=x³, y=1/x), recognize it as non-linear and explain why — no constant rate of change
  - A graph-based judgment: straight line = linear, curve = non-linear, including a bent/piecewise line as a trap (still non-linear overall even though each piece looks "straight")
- **Requires intro (CFU gate):** Yes — misconception: assuming any equation containing x is automatically linear, confusing y=mx+b with y=mx²+b at a glance.
- **Memorization fact (periodic re-check candidate):** No — re-derivable each time by checking for a constant rate of change.

### Unit 4: Constructing a Linear Function Model
- **Goal:** Build a linear function from a description or two data points, and explain what the rate of change and starting value mean in real life.
- **Standard:** 8.F.4
- **Buckets:**
  - Construct from a verbal description stating the rate and starting value directly (e.g. "starts at $20, adds $5 per hour")
  - Construct from two given (x,y) points — requires computing slope via rise/run first, a genuinely harder algebraic step than reading a stated rate
  - Construct from a table where the initial value isn't directly listed (table doesn't include x=0), requiring extrapolation back to find it, vs. a table that does include x=0 directly
  - Construct from a graph, reading slope from two marked points and the y-intercept from where the line crosses the axis
  - Every bucket's problem includes a required follow-up interpreting what the rate of change and initial value mean in the original context (not a separate bucket — a mandatory second step on each)
- **Requires intro (CFU gate):** Yes — misconception: swapping rate of change and initial value (e.g. reporting the $5 rate as the starting amount), or assuming the y-value of whichever given x happens to be smaller must be the initial value when x=0 wasn't actually given.
- **Memorization fact (periodic re-check candidate):** No — re-derivable from whatever information is given each time.

### Unit 5: Describing and Sketching a Function's Graph
- **Goal:** Look at a graph and describe whether a quantity is increasing or decreasing and whether that change is steady or not, or sketch a rough graph from a verbal description.
- **Standard:** 8.F.5
- **Buckets:**
  - Read a graph and classify it along two dimensions at once: increasing/decreasing/constant, AND linear/non-linear
  - Read a graph with a trend that changes partway through (e.g. increasing then leveling off, or increasing then decreasing) — one description must cover multiple phases
  - Sketch from words: a verbal description with one steady trend throughout
  - Sketch from words: a verbal description with a changing trend (e.g. "rises quickly, levels off, then drops") — mirrors the multi-phase reading bucket in the opposite direction
- **Requires intro (CFU gate):** Yes — misconception: treating "going up" as automatically meaning a constant (linear) rate, not distinguishing a curve whose rate of increase changes from a straight increasing line.
- **Memorization fact (periodic re-check candidate):** No.

## Open questions / flags for the builder
- **MM3 contention (flag required for every lab in this grade-8 batch):** see header note above — eight total grade-8 labs across two batches, plus grade 7's own MM3 proposal, all need slot resolution in a real Stage-0 conversation before any is built. `MH1` is earmarked for grade 9's likely Algebra I/Math I content per the other grade-8 batch's notes and should not be used as an overflow slot without an explicit decision.
- Cross-check Units 3-4 against `LinearEquationsAndProportionalRelationshipsLab` (same batch, 8.EE.5-6) at build time — both labs land on y=mx+b territory from different angles (function concept vs. slope/proportionality). Recommend using visibly different real-world scenarios (e.g. this lab leans on non-money contexts like plant growth or temperature-over-time, leaving money/unit-pricing contexts to the EE lab) so a student doing both doesn't see the same numbers twice.
- No prior lab exists to reconcile against for 8.F.1-2's "function" vocabulary itself — clean gap, no [VERIFY] conflict.
- Sequencing note: this lab assumes comfort with plotting points on a coordinate plane (5.G.1-2, 6.NS.8) and reading a table of values (6.EE.9) — not re-taught here.
