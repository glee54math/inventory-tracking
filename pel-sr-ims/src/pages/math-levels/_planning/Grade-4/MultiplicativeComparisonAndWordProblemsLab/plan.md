# Multiplicative Comparison and Word Problems Lab

**Proposed slot:** MG8 or MG9 — provisional, confirm at build time per project convention.
**Grade:** 4
**Standards covered:** 4.OA.1 (interpret a multiplication equation as a comparison, e.g. "35 = 5×7" as "5 times as many as 7"; represent verbal multiplicative comparisons as equations), 4.OA.2 (multiply/divide to solve multiplicative comparison word problems; distinguish multiplicative from additive comparison), 4.OA.3 (solve multistep word problems with whole numbers using all four operations, including problems with remainders to interpret; represent with an equation using a letter for the unknown; assess reasonableness via estimation/rounding).
**Relationship to existing labs:** Brand-new lab; no overlap with the already-built `MG9_MultiDigitMultiplicationLab` (4.NBT.5) or `MG8_OneDigitDivisionLab` (4.NBT.6) — this lab assumes fluent single-operation multiplication/division from those labs and focuses entirely on interpreting and composing them into comparisons and multistep problems. No prior lab in this platform covers 4.OA content, so there is no sequencing dependency beyond basic arithmetic fluency.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. "Times as many as" language and letter-for-an-unknown notation are both genuinely new vocabulary/notation at this grade — both need an explicit, concrete worked example (bar-model style comparison diagrams) before any symbolic practice.

## Units

### Unit 1: Multiplicative Comparison as Equations
- **Goal:** Read a multiplication equation like 35 = 5 × 7 as "35 is 5 times as many as 7," and write an equation from a comparison sentence.
- **Standard:** 4.OA.1
- **Buckets:** (a) verbal comparison → equation ("Maria has 4 times as many stickers as Jo, who has 6" → equation); (b) equation → verbal comparison sentence, filling in both the multiplier and the compared quantity; (c) identify-the-match trap — given one equation, choose the correct verbal sentence from options where a distractor swaps which quantity is "times as many" (reverses the comparison direction) and another distractor uses additive language ("4 more than") instead of multiplicative.
- **Requires intro (CFU gate):** Yes — "times as many as" is brand-new comparison vocabulary with a real risk of reversing which quantity is the multiplier vs. the base; CFU should include a question making the student pick between "A is 4 times as many as B" and "B is 4 times as many as A" for the same equation.
- **Memorization fact (periodic re-check candidate):** No — this is a comprehension/translation skill, re-derivable from reasoning each time, not a fact to retain by rote.

### Unit 2: Multiplicative vs. Additive Comparison Word Problems
- **Goal:** Solve word problems that ask "how many times as many," and tell these apart from word problems that ask "how many more."
- **Standard:** 4.OA.2
- **Buckets:** (a) multiplicative comparison, product unknown (multiply to solve); (b) multiplicative comparison, the "times as many" factor unknown (divide to solve); (c) a genuinely additive comparison problem ("how many more does X have than Y") mixed into the same set, requiring the student to recognize subtraction is correct and multiplication is NOT — the core named misconception for this standard; (d) a pair of near-identical problem stems where only the key phrase ("times as many" vs. "more than") differs, forcing the student to classify before computing rather than pattern-match on numbers alone.
- **Requires intro (CFU gate):** Yes — distinguishing multiplicative from additive comparison is the explicit, named point of 4.OA.2; CFU must include a question presenting both an additive and a multiplicative version of the same scenario side by side and asking which operation fits each.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 3: Multistep Word Problems with a Letter for the Unknown
- **Goal:** Solve word problems that take two or three steps and mix any of the four operations, writing an equation with a letter standing in for the unknown, and check the answer makes sense.
- **Standard:** 4.OA.3 (multistep + equation-with-a-letter + reasonableness sub-parts)
- **Buckets:** (a) two-step problem combining addition/subtraction then multiplication or division (e.g., total cost after a discount then split evenly); (b) two-step problem combining multiplication/division then addition/subtraction; (c) a problem that must be explicitly represented as an equation with a letter for the unknown before solving, not just solved by arithmetic alone; (d) a reasonableness-check follow-up — after solving, the student is given a rounded/estimated version of the problem and must judge whether their exact answer is "reasonable" compared to the estimate, including a case where an estimate reveals a computational slip (e.g., an answer that's off by a factor of 10).
- **Requires intro (CFU gate):** Yes — both multistep problem structure and letter-for-the-unknown notation are new; CFU should include a true/false-style question asking whether a single-step computation on the final two numbers mentioned in a multistep story is enough to solve it (it is not — a generalization trap about reading the whole problem before computing).
- **Memorization fact (periodic re-check candidate):** No.

### Unit 4: Interpreting Remainders
- **Goal:** Solve division word problems that leave a remainder, and decide what to do with that remainder based on what the problem is actually asking.
- **Standard:** 4.OA.3 (remainder-interpretation sub-part)
- **Buckets:** (a) remainder discarded — "how many full groups/buses/teams can be made" (drop the remainder, keep the quotient as-is); (b) remainder rounds the answer up — "how many buses/boxes are NEEDED to fit everyone" (quotient + 1, even though the last one isn't full); (c) remainder IS the answer — "how many are left over after making as many full groups as possible" (the remainder itself is what's asked for); (d) a mixed set of near-identical problem stems differing only in the question's final clause, forcing the student to read for which of the three framings applies rather than always discarding (the single most common default error).
- **Requires intro (CFU gate):** Yes — this is the single most well-documented 4th grade division misconception; CFU should present three word problems sharing the exact same numbers (same dividend/divisor) but different final questions, and require the student to give three different correct answers from the same division fact, proving they're reading the question rather than just computing.
- **Memorization fact (periodic re-check candidate):** No — this is a reading/reasoning skill about context, not a fact to memorize.

## Open questions / flags for the builder
- Final level-code placement (MG8 vs. MG9) is left open per the brief; confirm against whatever else lands in those slots by build time.
- Unit 3 and Unit 4 both key off 4.OA.3 but split its sub-asks (general multistep/reasonableness vs. the specific remainder-interpretation misconception) into two units rather than one, since the remainder bucket list is large enough on its own to deserve a dedicated gate and its own Practice pool — confirm this split is acceptable rather than merging into a single combined unit.
- Unit 2's problems and Unit 3's problems will necessarily reuse similar "word problem with a story" scaffolding (shared with other labs in this codebase) — check `shared/engine/` for an existing word-problem Step/diagram pattern before building fresh ones.
