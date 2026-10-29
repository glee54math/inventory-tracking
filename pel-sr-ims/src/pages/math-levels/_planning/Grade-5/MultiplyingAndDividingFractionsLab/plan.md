# MultiplyingAndDividingFractionsLab

**Proposed slot:** MG10 — provisional, confirm at build time per project convention.
**Grade:** 5
**Standards covered:**
- 5.NF.3 — Interpret a fraction as division of the numerator by the denominator; solve word problems involving division of whole numbers with fraction/mixed-number answers.
- 5.NF.4a-b — Interpret the product (a/b)×q as a parts of a partition of q into b equal parts; find the area of a rectangle with fractional side lengths by tiling with unit-fraction-side squares.
- 5.NF.5a-b — Interpret multiplication as scaling: compare the size of a product to the size of one factor based on the other factor, without performing the multiplication; explain why multiplying by a fraction greater than 1 results in a product greater than the given number, and why multiplying by a fraction less than 1 results in a product smaller than the given number.
- 5.NF.6 — Solve real-world problems involving multiplication of fractions and mixed numbers.
- 5.NF.7a-c — Apply and extend understanding of division to divide unit fractions by whole numbers and whole numbers by unit fractions: interpret/compute division of a unit fraction by a non-zero whole number (a); interpret/compute division of a whole number by a unit fraction (b); solve real-world problems of both kinds (c).

**Relationship to existing labs:** MG9_IntroToFractionsLab (fraction forms/equivalence/comparing/simplifying) is a direct prerequisite already in place. MG11_MultDivFractionLab already builds a full fraction-division unit, but that unit's scope is the GENERAL fraction÷fraction case (6.NS.1 — dividing any fraction by any fraction). This lab's 5.NF.7 division content is deliberately NARROWER and must stay that way: every division problem in this lab's division unit divides either a unit fraction BY a whole number, or a whole number BY a unit fraction — the numerator on the fraction side of the operation is always 1. This lab should never generate or teach general fraction÷fraction (e.g. 2/3 ÷ 3/5) — that case belongs exclusively to MG11_MultDivFractionLab's later, more general treatment, and teaching it here would both get ahead of this lab's own standard and duplicate content that already exists downstream. No [VERIFY] flag needed for this lab as a whole, since the scope boundary is explicit and intentional rather than ambiguous — but the builder should treat "numerator always 1 on the fraction side" as a hard constraint on the Unit 5 (division) problem generator, not a soft default.

**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. This is exactly where the "multiplying always makes things bigger" misconception needs to be confronted directly — 5.NF.5's scaling-interpretation standard exists specifically because this is a well-documented point where students generalize wrong from whole-number multiplication. Every multiplication unit should show a visual counterexample (area shrinking when one side is a fraction less than 1) rather than only drilling the correct procedure.

## Units

### Unit 1: A Fraction Is a Division Problem
- **Goal:** See that a fraction like 3/4 literally means "3 things divided among 4 people/groups," and use that idea to solve division word problems whose answer isn't a whole number.
- **Standard:** 5.NF.3
- **Buckets:** (a) dividend less than divisor (3 ÷ 4 → 3/4, answer is a proper fraction), (b) dividend greater than divisor, not evenly divisible (7 ÷ 4 → 7/4 or 1 3/4, answer is improper/mixed), (c) dividend evenly divisible by divisor (8 ÷ 4 = 2, a "boring" case the student must still recognize as fitting the same a/b = a÷b pattern), (d) a word-problem framing requiring the student to decide the answer should be left as a fraction/mixed number rather than "solved" with a remainder (e.g. sharing sandwiches among people, not sharing candies that can't be split).
- **Requires intro (CFU gate):** Yes — "a fraction IS a division" is a vocabulary/definitional reframe, not a new computation, and is exactly the kind of thing a rote drill never asks for directly.
- **Memorization fact (periodic re-check candidate):** No — this is a conceptual reframe the student should always be able to re-derive by reasoning ("3 divided 4 ways"), not a fact to memorize.

### Unit 2: Multiplying a Fraction by a Whole Number (Area Model)
- **Goal:** Find a fraction of a quantity, and find the area of a rectangle whose side lengths include a fraction, by tiling with unit-fraction squares.
- **Standard:** 5.NF.4a-b
- **Buckets:** (a) (a/b)×q where q is a whole number and the product simplifies to a whole number (2/3 × 9), (b) same but the product stays a fraction/mixed number (2/3 × 7), (c) area of a rectangle with ONE fractional side length and one whole-number side length, (d) area of a rectangle with BOTH side lengths fractional (the full unit-square-tiling case named explicitly in 5.NF.4b), (e) a case requiring the tiling grid to be subdivided into a common unit before counting (side lengths with different denominators, e.g. 1/2 by 1/3 — the tiling unit must be 1/6 x 1/6 squares).
- **Requires intro (CFU gate):** Yes — the tiling-with-unit-fraction-squares model is a new visual/conceptual tool, and "multiply straight across" without understanding what the tiles represent is a real risk of becoming a rote shortcut with no backing model.
- **Memorization fact (periodic re-check candidate):** No — the tiling model should remain re-derivable by reasoning; it's the conceptual backbone of this unit, not a fact to drill and forget.

### Unit 3: Multiplication as Scaling
- **Goal:** Predict whether a product will be bigger, smaller, or the same size as a starting number — just by looking at the other factor — before doing any computing.
- **Standard:** 5.NF.5a-b
- **Buckets:** (a) multiplying by a fraction greater than 1 (product is larger than the original number), (b) multiplying by a fraction less than 1 (product is smaller than the original number), (c) multiplying by exactly 1 or an equivalent-to-1 fraction like 3/3 (product is unchanged — the "no scaling" control case), (d) a generalization/true-false trap asking the student to judge a NEW unseen factor's effect without computing (e.g. "will 5 × 7/5 be bigger or smaller than 5? Why?").
- **Requires intro (CFU gate):** Yes — this is THE flagship misconception-busting unit in the lab ("multiplying always makes bigger"), named explicitly in the standard itself; it demands a real visual counterexample before any practice.
- **Memorization fact (periodic re-check candidate):** No — this is a relationship the student should be able to re-derive by reasoning about the factor's size relative to 1 every time, not a memorized rule.

### Unit 4: Multiplying Fractions and Mixed Numbers (Word Problems)
- **Goal:** Solve real-world problems — recipes, measurements, scaling a quantity up or down — that require multiplying fractions and mixed numbers.
- **Standard:** 5.NF.6
- **Buckets:** (a) fraction × whole number in a real-world context, (b) fraction × fraction in a real-world context, (c) mixed number × whole number (requires converting to an improper fraction first or distributing), (d) mixed number × fraction, (e) a scaling-prediction sub-question embedded in the word problem itself ("will the new amount be more or less than you started with?") tying back to Unit 3's reasoning rather than treating it as a one-off skill.
- **Requires intro (CFU gate):** Yes — new applied-context skill combining the prior three units' mechanics; benefits from an explicit gate before open practice.
- **Memorization fact (periodic re-check candidate):** Yes — the mixed-number-to-improper-fraction conversion step used repeatedly here is a durable procedural fact worth a periodic re-check (reintroEverySolved), separate from the word-problem reasoning itself.

### Unit 5: Dividing With Unit Fractions
- **Goal:** Divide a unit fraction by a whole number, and divide a whole number by a unit fraction — and notice these two directions give very different-looking answers.
- **Standard:** 5.NF.7a-c
- **Buckets:** (a) unit fraction ÷ whole number (1/3 ÷ 4 — the answer gets smaller, more pieces), (b) whole number ÷ unit fraction (4 ÷ 1/3 — the answer gets LARGER, "how many thirds fit in 4"), (c) a real-world problem framed as "sharing a small amount among several people" (maps to bucket a), (d) a real-world problem framed as "how many portions can I make from this much" (maps to bucket b), (e) a generalization/trap question asking the student to predict, without computing, whether dividing by a unit fraction less than 1 makes the result bigger or smaller than the starting whole number (directly parallel to Unit 3's scaling reasoning, but for division). **Hard constraint for the problem generator: the fraction operand must always be a UNIT fraction (numerator = 1) on whichever side of ÷ it appears — never generate or accept a non-unit-fraction divisor/dividend; general fraction÷fraction is explicitly out of scope for this lab (see "Relationship to existing labs" above).**
- **Requires intro (CFU gate):** Yes — division by a fraction producing a BIGGER result is a direct extension of the "multiplying/dividing doesn't always do what whole-number intuition says" misconception family, and the two directions (unit fraction ÷ whole vs. whole ÷ unit fraction) are easy to conflate without an explicit vocabulary/conflation check.
- **Memorization fact (periodic re-check candidate):** No — this should remain reasoning-based ("how many groups / how big is each group"), using the same visual models as Unit 1 and Unit 3, not a memorized rule like "flip and multiply" (that general reciprocal procedure is intentionally deferred to MG11_MultDivFractionLab's 6.NS.1 treatment).

## Open questions / flags for the builder
No [VERIFY] flag required for this lab — the overlap with MG11_MultDivFractionLab is understood and resolved by scope, not ambiguous. The one thing to hold firm at build time: Unit 5's generator must be constrained so the fraction operand's numerator is always 1 on whichever side of the division it appears (never a general a/b ÷ c/d case) — this is the one place a careless generator could accidentally duplicate MultDivFractionLab's territory rather than staying inside 5.NF.7's narrower scope. Treat this as a hard constraint to verify in the generator's brute-force test script, not just a bucket label.
