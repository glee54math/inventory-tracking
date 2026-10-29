# Factors, Multiples, and Patterns Lab

**Proposed slot:** MG8 or MG9 — provisional, confirm at build time per project convention.
**Grade:** 4
**Standards covered:** 4.OA.4 (find all factor pairs for a number 1-100; recognize a number is a multiple of each of its factors; determine if a number 1-100 is a multiple of a given one-digit number; determine if a number 1-100 is prime or composite), 4.OA.5 (generate a number or shape pattern that follows a given rule; identify features of the pattern that are not explicit in the rule itself).
**Relationship to existing labs:** Brand-new lab; no overlap with any already-built lab. Loosely builds on basic multiplication/division fluency from `MG9_MultiDigitMultiplicationLab` and `MG8_OneDigitDivisionLab` but introduces entirely new vocabulary (factor, multiple, prime, composite) not covered anywhere else in the platform.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Factor/multiple/prime/composite are four new, easily-conflated vocabulary terms introduced in close succession — each unit's CFU should actively cross-check the new term against the term from the immediately preceding unit, not just the current one.

## Units

### Unit 1: Factor Pairs
- **Goal:** Find every factor pair for a number from 1 to 100 by checking systematically, not guessing.
- **Standard:** 4.OA.4a
- **Buckets:** (a) a number with few factor pairs (e.g., a prime or near-prime — only 1 pair besides itself); (b) a highly composite number with many factor pairs (e.g., 24, 36, 48) where it's easy to miss one if checking isn't systematic; (c) a perfect square (e.g., 36 = 6×6), where one "pair" is really a repeated factor — a genuine edge case students often double-count or miss; (d) a number near the top of the 1-100 range, where the systematic check (only need to test divisors up to its square root) matters most.
- **Requires intro (CFU gate):** Yes — the risk is an unsystematic guess-and-check that silently misses a pair; CFU should include a true/false or "did you get them all" trap using a number with an easily-missed middle factor pair.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 2: Multiples and "Is It a Multiple Of..."
- **Goal:** Recognize multiples of a number, and decide whether a number from 1 to 100 is a multiple of a given one-digit number.
- **Standard:** 4.OA.4b/c
- **Buckets:** (a) a clear, obvious multiple; (b) a clear non-multiple (far off); (c) a "near miss" non-multiple — off by just 1 or 2 from a true multiple (e.g., is 56 a multiple of 6? — tests actual division-with-no-remainder checking rather than eyeballing); (d) multiples of a less-automatic one-digit number such as 7, 8, or 9, where recall is weaker than for 2, 5, or 10.
- **Requires intro (CFU gate):** Yes — factor and multiple are commonly conflated (a factor divides INTO a number; a multiple is reached by multiplying UP); CFU must put both terms in the same question (e.g., "6 is a ___ of 24, and 24 is a ___ of 6 — which blank gets 'factor' and which gets 'multiple'?") rather than testing either term in isolation.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 3: Prime or Composite
- **Goal:** Decide whether a number from 1 to 100 is prime or composite.
- **Standard:** 4.OA.4d
- **Buckets:** (a) small, well-known primes (2, 3, 5, 7); (b) the special case of 1 — neither prime nor composite, a classic trap; (c) the special case of 2 — the only even prime, another classic trap since "even" gets over-associated with "composite"; (d) a composite number that "looks" prime because it's odd and not obviously divisible (e.g., 51 = 3×17, 91 = 7×13); (e) a genuinely large prime requiring real factor-checking before concluding (e.g., 97) paired against a similarly large composite (e.g., 91) so the student can't just default to "big odd number = prime."
- **Requires intro (CFU gate):** Yes — the 1-is-neither and 2-is-the-only-even-prime cases are THE two named classic misconceptions for this standard; both must appear explicitly in the CFU, ideally in one combined question ("is 1 prime, composite, or neither? is 2 prime, composite, or neither?").
- **Memorization fact (periodic re-check candidate):** Yes — the primes from 1 to 20 (2, 3, 5, 7, 11, 13, 17, 19) are a short, genuinely memorizable list worth a periodic re-check (`reintroEverySolved`) rather than re-derived by trial division every single time once a student has proven they know it; everything above 20 should stay a derived/checked skill, not a memorized list.

### Unit 4: Number and Shape Patterns
- **Goal:** Continue a number or shape pattern from a stated rule, and notice something true about the pattern that the rule didn't say directly.
- **Standard:** 4.OA.5
- **Buckets:** (a) generate the next terms from a simple one-operation rule (e.g., "start at 3, add 4 each time"); (b) generate from a rule involving a comparison or two steps (e.g., "double the previous term, then subtract 1"); (c) a growing shape pattern (e.g., a figure that gains a fixed number of tiles each stage) run in parallel with its matching number pattern; (d) identify an IMPLICIT feature not stated in the rule — e.g., noticing the terms alternate even/odd, or that every term is a multiple of some number — the core higher-order ask of this standard, distinct from merely continuing the sequence.
- **Requires intro (CFU gate):** Yes — "continue the pattern" and "find an unstated feature of the pattern" are genuinely different cognitive tasks, and students often stop at the first; CFU should include one question that gives a rule, asks for the next term (easy), then immediately asks a true/false generalization about a feature NOT mentioned in the rule (e.g., "every term in this pattern is even — true or false, and why?").
- **Memorization fact (periodic re-check candidate):** No.

## Open questions / flags for the builder
- Final level-code placement (MG8 vs. MG9) is left open per the brief.
- Unit 3's `reintroEverySolved` memorization scope is intentionally narrow (primes 1-20 only) — confirm the builder doesn't extend the gate's periodic re-check to the general prime/composite determination SKILL itself (which should stay a derived/checked reasoning task, not a memorized fact) once the student has it.
- Unit 1 and Unit 3 both touch factor pairs and divisibility checking; sequencing Unit 1 → Unit 2 → Unit 3 (factors, then multiples, then prime/composite) was chosen so each new term can be contrasted against the one immediately before it in CFU — confirm this ordering rather than, e.g., leading with prime/composite.
