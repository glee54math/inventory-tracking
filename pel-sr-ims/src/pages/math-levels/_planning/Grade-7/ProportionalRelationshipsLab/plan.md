# ProportionalRelationshipsLab

**Proposed slot:** MM3 — provisional, confirm at build time per project convention.
**Grade:** 7
**Standards covered:** 7.RP.1 (compute unit rates with ratios of fractions, incl. lengths/areas/other units), 7.RP.2a (test for a proportional relationship via equivalent ratios in a table or a straight line through the origin), 7.RP.2b (identify the constant of proportionality across tables/graphs/equations/verbal descriptions), 7.RP.2c (represent proportional relationships by equations), 7.RP.2d (explain what a point (x,y) means in context, esp. (0,0) and (1,r)), 7.RP.3 (multistep ratio and percent problems — simple interest, tax, markups/markdowns, gratuities/commissions, fees, percent increase/decrease, percent error).
**Relationship to existing labs:** Builds directly on MM1_RatioLab's (grade 6, already built) ratio/rate/percent foundation — assume the student already understands unit rates (`UnitRate.tsx`, which already touches a unit rate that comes out as a simple fraction) and basic percent-of-a-quantity (`Percent.tsx`, scoped to 6.RP.A.3c: find a percent of a number, find the whole from a part — no tax/tip/markup/interest/percent-change there). This lab's job is generalizing to fractional/compound unit rates (ratios of fractions, not just a fractional result), formally TESTING for proportionality (not just building/graphing a table of equivalent ratios, which `TablesGraphs.tsx` already does at the 6th-grade level), and harder compound percent scenarios that lab doesn't cover at all.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Ground "constant of proportionality" and "what a point means" in a concrete, continuous real-world rate (price per pound, distance per hour) the student can picture moving along a line, before any pure symbolic y = kx manipulation. For the percent unit, walk through the money scenario (receipt, invoice, paycheck) step by step rather than presenting the percent-change formula cold.

## Units

### Unit 1: Unit Rates with Fractions
- **Goal:** Find a unit rate when the amounts involved are fractions — including rates for lengths, areas, and other measured quantities, not just money.
- **Standard:** 7.RP.1
- **Buckets:**
  - A whole-number quantity per a fractional amount of the other (e.g. 3/4 mile in 1/4 hour)
  - A fractional quantity per a fractional amount of the other, requiring complex-fraction division (fraction ÷ fraction)
  - A unit rate for a length or area context (price per square foot, feet per second) rather than a money-per-item context
  - A unit rate whose result is itself a mixed number or improper fraction that must be interpreted in context (not just left as a raw fraction)
- **Requires intro (CFU gate):** Yes — dividing a fraction by a fraction (complex fraction) to get a unit rate is a new mechanism beyond MM1_RatioLab's simple unit-rate division, and students commonly flip the wrong fraction or forget to find "per ONE" when both quantities are fractional.
- **Memorization fact (periodic re-check candidate):** No — procedural, re-derivable from "divide to find the amount per 1" reasoning each time.

### Unit 2: Testing for Proportionality
- **Goal:** Decide whether two quantities are actually in a proportional relationship by checking a table for a constant ratio throughout, or a graph for a straight line through the origin.
- **Standard:** 7.RP.2a
- **Buckets:**
  - A table that IS proportional (the ratio y/x is constant across every row)
  - A table that is NOT proportional, where the ratio breaks on a LATER row — traps the common shortcut of checking only the first pair of values
  - A graph that IS proportional (straight line through the origin)
  - A graph that is linear but NOT proportional (a straight line that does not pass through the origin — e.g. a flat starting fee plus a rate) — the single most important non-example
  - A graph that is NOT even linear (curved), as the plainest non-example
- **Requires intro (CFU gate):** Yes — "checking only the first row/pair of a table" and "a straight line is automatically proportional" are both real, named misconceptions; the straight-line-but-not-through-origin case needs a deliberate walkthrough.
- **Memorization fact (periodic re-check candidate):** No — this is a test/check procedure the student re-applies each time, not a fact to recall.

### Unit 3: Finding the Constant of Proportionality
- **Goal:** Find the constant of proportionality (the unit rate, k) from a table, a graph, an equation, or a verbal description, and write the relationship as an equation y = kx.
- **Standard:** 7.RP.2b, 7.RP.2c
- **Buckets:**
  - Find k from a table of values
  - Find k from a graph (reading it as rise/run or as the y-value at x = 1)
  - Find k from a verbal description of a real-world situation
  - Write the equation y = kx given a known k, and use it to predict an unlisted value
  - Distinguish y = kx from a similar-looking but non-proportional form (e.g. y = x + k), to confirm the student isn't pattern-matching "an equation with a constant" generically
- **Requires intro (CFU gate):** Yes — "constant of proportionality" is new vocabulary that must connect to the already-familiar idea of a unit rate, and confusing y = kx with an additive form (y = x + k) is a concrete, nameable trap.
- **Memorization fact (periodic re-check candidate):** No — conceptual, re-derivable by reasoning from any one representation to the others.

### Unit 4: What a Point on the Graph Means
- **Goal:** Explain what any point (x, y) on a proportional relationship's graph means in the real-world context, with special attention to (0, 0) and (1, r).
- **Standard:** 7.RP.2d
- **Buckets:**
  - Interpret a general plotted point (x, y) in context (translate coordinates → real-world meaning)
  - Interpret (0, 0) specifically — explaining why it must be on the graph of any proportional relationship ("zero of one thing means zero of the other"), not dismissing it as a trivial/skippable point
  - Interpret (1, r) specifically — recognizing this is exactly where the unit rate/constant of proportionality lives on the graph
  - Given only a context and its rate, locate or predict where (1, r) would fall, without the point being pre-plotted for the student
- **Requires intro (CFU gate):** Yes — the standard specifically calls out (0,0) and (1,r) because students tend to treat all points as interchangeable or skip over the "trivial-looking" origin point without explaining its meaning.
- **Memorization fact (periodic re-check candidate):** No — this is contextual interpretation, reasoned fresh for each scenario.

### Unit 5: Real-World Percent Problems — Tax, Tips, Markups & Commission
- **Goal:** Solve real-world money problems that add or subtract a percent of an amount — sales tax, tips/gratuities, markups, markdowns/discounts, commissions, and fees.
- **Standard:** 7.RP.3
- **Buckets:**
  - Tax or fee added on top of a base amount (find the final total)
  - Tip/gratuity or commission calculated as a percent of a base amount
  - Markup (price increased by a percent) vs. markdown/discount (price decreased by a percent) — both directions in the same unit so they aren't practiced in isolation
  - A sequential/compound scenario (e.g. a discount applied, then tax applied to the discounted price) — tests whether the student re-bases the second percent correctly instead of applying both percents to the original amount
  - Working BACKWARD: given the final (post-tax, post-discount, or post-commission) amount and the percent, find the original base amount — the harder reverse direction
- **Requires intro (CFU gate):** Yes — applying a percent to the wrong base (e.g. taking the second discount off the original price instead of the already-discounted price, or computing the original amount by just adding/subtracting the percent from the final amount instead of dividing) is a real, specific, commonly-made error.
- **Memorization fact (periodic re-check candidate):** No — procedural application of percent-of-a-quantity, re-derivable each time from "find the part, then add or subtract it."

### Unit 6: Percent Change, Percent Error & Simple Interest
- **Goal:** Solve problems involving percent increase/decrease, percent error, and simple interest on a loan or investment.
- **Standard:** 7.RP.3
- **Buckets:**
  - Percent increase (find the new amount given a starting amount and a percent increase)
  - Percent decrease (same, for a decrease) — paired with increase so students see both halves of the same idea
  - Percent error: given a measured/estimated value and an actual value, compute |measured − actual| / actual as a percent
  - Simple interest for a single time period (I = Prt with t = 1)
  - Simple interest over multiple time periods (t > 1), reinforcing that simple interest does NOT compound
- **Requires intro (CFU gate):** Yes — confusing percent error's "always positive, measured-vs-actual" structure with ordinary percent change, and assuming simple interest compounds like a repeated percent increase, are both specific, nameable misconceptions worth a guided walkthrough.
- **Memorization fact (periodic re-check candidate):** Yes — the simple interest formula (I = Prt) and the percent error formula are fixed formulas (not something re-derived by reasoning each time), matching the agent brief's "a conversion factor, a fixed formula" criterion for `reintroEverySolved`.

## Open questions / flags for the builder

- Before building Unit 2, re-read MM1_RatioLab's `TablesGraphs.tsx` (6.RP.A — builds/graphs tables of equivalent ratios) in full to confirm this unit's "test for proportionality" framing (including the non-proportional trap cases) is genuinely a distinct, harder skill rather than a re-tread — it should be, since that unit never asks "is this even proportional," it assumes it is and asks the student to complete/graph it.
- Unit 5 and Unit 6 both draw on 7.RP.3; if the combined bucket count across the two feels too large for one lab's pacing at build time, consider whether Unit 6's simple-interest buckets could instead be folded into Unit 5 and the lab trimmed to 5 units — flagging as a judgment call rather than deciding it here.
- Pick concrete rounding/precision conventions once (e.g. whether unit rates and percents round to the nearest cent/hundredth or are constructed to always divide exactly) and apply them consistently across all six units' generators, following this codebase's existing money-generator pattern (quarter-dollar unit price × integer quantity) wherever a problem's numbers can be constructed to avoid an ugly round.
