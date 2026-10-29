# DivisionAndWordProblemsLab

**Proposed slot:** MG7 — provisional, confirm at build time per project convention.
**Grade:** 3
**Standards covered:** 3.OA.2 (interpret whole-number quotients as equal shares or equal groups), 3.OA.4 (determine the unknown in a multiplication/division equation relating three whole numbers), 3.OA.6 (understand division as an unknown-factor problem), 3.OA.7b (fluently divide within 100 using the relationship between multiplication and division), 3.OA.8 (solve two-step word problems with all four operations, represented with an equation using a letter for the unknown, assessed for reasonableness via estimation/rounding).
**Relationship to existing labs:** MG8 (grade 4 slot) already hosts a live `OneDigitDivisionLab` covering the standard long-division ALGORITHM for larger dividends. This lab is the conceptual foundation that must come before that: what division MEANS (equal shares/equal groups, the inverse of multiplication), the two genuinely different quotient meanings CCSS identifies, and division fact fluency built from known multiplication facts — not an algorithm for dividing multi-digit numbers. This lab also sequences after `MultiplicationFoundationsLab` (same MG7 slot), since 3.OA.6/3.OA.7b explicitly define division via its relationship to multiplication facts a student should already have.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Division is the second brand-new operation in grade 3 and is routinely conflated with its sibling meaning (sharing out vs. grouping into) — every Explore section needs a visual model (equal-shares pictures, equal-groups pictures, fact-family triangles linking back to multiplication) before symbolic "a ÷ b" practice, with explicit checks distinguishing the two quotient meanings.

## Units

### Unit 1: What Division Means (Equal Shares and Equal Groups)
- **Goal:** You will be able to look at a division story or picture and tell whether it's asking "how many in each group?" or "how many groups?" — and know both questions can use the same division equation.
- **Standard:** 3.OA.2
- **Buckets:** (crossing CCSS's Equal Groups / Arrays-Area situation types with the two division-specific unknowns)
  - Equal Groups, Group Size Unknown ("how many in each group?") — e.g. "12 cookies shared equally among 3 friends, how many does each friend get?"
  - Equal Groups, Number of Groups Unknown ("how many groups?") — e.g. "12 cookies, 3 in each bag, how many bags?"
  - Arrays/Area, Group Size Unknown — e.g. "18 chairs arranged in 3 equal rows, how many chairs per row?"
  - Arrays/Area, Number of Groups Unknown — e.g. "18 chairs, 3 chairs in each row, how many rows?"
  - Same numbers, both question types presented back-to-back (e.g. 12÷3 as "4 each" vs. "4 groups") to force the distinction rather than letting a student pattern-match on the numbers alone
- **Requires intro (CFU gate):** Yes — students confuse "how many groups" division with "how many in each group" division; they look numerically identical (both are 12÷3=4) but the quotient means something different in each (4 cookies-per-friend vs. 4 bags), and this unit's whole job is making that distinction explicit rather than letting students treat division as "just get the small number."
- **Memorization fact (periodic re-check candidate):** No — this unit builds interpretation of what a quotient means in context, which should always be re-derivable from the picture/story, not recalled from memory.

### Unit 2: Division as an Unknown-Factor Problem
- **Goal:** You will be able to solve a division fact by thinking "what number times the divisor gives me the dividend?" using a fact family (like 4 × 7 = 28, so 28 ÷ 7 = 4 and 28 ÷ 4 = 7).
- **Standard:** 3.OA.6
- **Buckets:**
  - Given a multiplication fact, derive both related division facts in its fact family (e.g. from 6×8=48, produce 48÷8=6 AND 48÷6=8)
  - Given a division problem, find the unknown factor directly (e.g. "7 × ? = 56" framing of "56 ÷ 7")
  - Fact families built from a square fact (e.g. 6×6=36 only yields ONE division fact, 36÷6=6, not two distinct ones) — the edge case where the "two division facts per family" pattern collapses to one
  - A division problem where the divisor doesn't divide evenly presented as a reasoning check ("why doesn't 25 ÷ 4 have a whole-number partner multiplication fact?") to build the unknown-factor model's limits, not just its happy path
- **Requires intro (CFU gate):** Yes — reframing division as "missing factor" rather than a separate operation to learn from scratch is the core idea of 3.OA.6; common misconception is treating multiplication and division facts as two unrelated things to memorize separately instead of one fact family viewed two ways.
- **Memorization fact (periodic re-check candidate):** No — this unit teaches the RELATIONSHIP/strategy (derive division from a known multiplication fact), which should always be re-derivable; it's the underlying one-digit facts (shared with Unit 3's fluency and Multiplication Foundations' Unit 4) that get memorized, not this connective reasoning step.

### Unit 3: Division Fact Fluency
- **Goal:** You will be able to quickly divide any two numbers within 100 by using the multiplication facts you know.
- **Standard:** 3.OA.7b
- **Buckets:**
  - Dividing by 0, 1, 2, 5, 10 (the easy-anchor divisors, mirroring Multiplication Foundations' easy-factor bucket)
  - Dividing by 3, 4
  - Dividing by 6, 7, 8, 9, excluding perfect-square cases (the hardest, most error-prone divisor facts)
  - Perfect-square-derived division facts (e.g. 49÷7=7) as their own bucket since the fact family only has one partner
  - Near-miss fact confusion check — e.g. distinguishing 48÷6=8 from 48÷8=6 (both true but asking a different question) and from 42÷6=7 (an adjacent, DIFFERENT fact entirely)
- **Requires intro (CFU gate):** No — by this point the unknown-factor strategy (Unit 2) and the underlying multiplication facts (prerequisite lab) are already established; this unit is pure extended practice applying a strategy already taught, not a new concept.
- **Memorization fact (periodic re-check candidate):** Yes — 3.OA.7 explicitly calls for fluent division within 100 by end of grade; division fact recall should be periodically re-surfaced via `reintroEverySolved` the same way one-digit multiplication facts are, since fluency here can fade independently even if the Unit 2 strategy is still understood.

### Unit 4: Determining the Unknown (Multiplication/Division Equations)
- **Goal:** You will be able to find the missing number in a multiplication or division equation, no matter which position it's in.
- **Standard:** 3.OA.4
- **Buckets:**
  - Unknown product: a × b = ? (the "easy" position, direct computation)
  - Unknown factor, second position: a × ? = c (requires the unknown-factor reasoning from Unit 2)
  - Unknown factor, first position: ? × b = c (same reasoning, factor in the OTHER position — genuinely distinct bucket since students often only check the position they're used to)
  - Unknown in a division equation: a ÷ ? = c and ? ÷ b = c (both unknown-divisor and unknown-dividend positions)
  - Equations presented in non-standard form (e.g. c = a × b vs. a × b = c, or the unknown on the left side of the equals sign) to break the misconception that "the answer always comes after the equals sign"
- **Requires intro (CFU gate):** Yes — placing the unknown in a non-default position (first factor, or left of the equals sign) is a well-known trip-up; students who can solve "3 × 4 = ?" often fail "? × 4 = 12" or "12 = 3 × ?" even though the arithmetic is identical, because they're pattern-matching equation SHAPE rather than reasoning about the relationship.
- **Memorization fact (periodic re-check candidate):** No — this is equation-structure reasoning applied to facts already covered elsewhere; nothing new here is a fact to memorize.

### Unit 5: Two-Step Word Problems with All Four Operations
- **Goal:** You will be able to solve a word problem that takes two steps and uses any mix of the four operations, write it as an equation with a letter for the unknown, and check whether your answer makes sense.
- **Standard:** 3.OA.8
- **Buckets:**
  - Two-step problems combining multiplication/division with addition/subtraction (e.g. "Sam buys 4 packs of 6 pencils, then gives away 9 — how many left?")
  - Two-step problems combining multiplication AND division in sequence (e.g. "24 apples split into 4 baskets, then each basket's apples are split among 2 people — how many per person?")
  - Problems requiring the student to write the equation WITH a letter standing for the unknown (not just compute mentally) before solving
  - Reasonableness-check bucket: given a computed answer, use estimation/rounding to judge whether it's plausible, including a deliberately-wrong "trap" answer (e.g. off by a misplaced operation or a dropped step) the student must catch as unreasonable
- **Requires intro (CFU gate):** Yes — this is the capstone unit combining everything in the lab plus addition/subtraction from prior grades; common misconception is stopping after step one (answering only half the problem) or combining the two steps with the wrong operation order; CFU should include at least one question asking the student to identify what the FIRST step's answer represents before using it in the second step.
- **Memorization fact (periodic re-check candidate):** No — multi-step word-problem reasoning is applied fresh to each new scenario; nothing here is a fixed fact.

## Open questions / flags for the builder
- Unit 1's bucket list intentionally mirrors Multiplication Foundations Lab's Unit 3 situation-type crossing (Equal Groups / Arrays-Area) but swaps in division's two unknown-types instead of Unknown Product; keep the two labs' word-problem buckets distinct in generated scenarios (e.g. don't reuse the exact same cover-story numbers) if both are practiced in the same session.
- This lab assumes MultiplicationFoundationsLab (same MG7 slot) is built first/sequenced earlier, since Units 2 and 3 explicitly lean on one-digit multiplication facts as a prerequisite — if the builder builds this lab first for any reason, flag that Units 2-3 may need a fallback refresher rather than assuming facts are already solid.
- 3.OA.8's "assess reasonableness" sub-skill could arguably be its own Unit 6 rather than folded into Unit 5's last bucket — flagging that the builder may want to split it out if the two-step equation-writing skill and the reasonableness-check skill end up needing meaningfully different Practice problem shapes.
