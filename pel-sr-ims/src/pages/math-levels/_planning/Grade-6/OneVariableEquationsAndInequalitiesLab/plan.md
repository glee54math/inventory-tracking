# OneVariableEquationsAndInequalitiesLab

**Proposed slot:** MM2 — provisional, confirm at build time per project convention.
**Grade:** 6
**Standards covered:** 6.EE.5 (understand solving an equation/inequality as finding which values from a set make it true, use substitution to check), 6.EE.6 (use variables to represent an unknown or any number in a specified set), 6.EE.7 (solve real-world/math problems by writing/solving equations of form x+p=q and px=q for nonnegative rational p, q, x), 6.EE.8 (write an inequality of form x>c or x<c for a real-world/math constraint, recognize infinitely many solutions, represent on a number line), 6.EE.9 (use variables to represent two related quantities, write an equation expressing one as a function of the other, analyze via graphs/tables and relate to the equation).
**Relationship to existing labs:** Direct SEQUEL to the already-built `MM1_ExponentsAndExpressionsLab` (covers 6.EE.1-4: exponents, writing/reading expressions, evaluating expressions & order of operations, generating/identifying equivalent expressions). This lab assumes the student can already write an expression from words, evaluate an expression at a given value, and recognize when two expressions are equivalent — that groundwork is NOT re-taught here. This lab's job is the next layer: solving for an unknown, reasoning about inequalities with infinitely many solutions, and describing how two quantities vary together — none of which `ExponentsAndExpressionsLab` covers (it stops at 6.EE.4, before equation-solving begins at 6.EE.5).
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Explore sections should let the student test candidate values against an equation/inequality directly (substitute-and-check) before any formal "solving procedure" is named, since 6.EE.5 itself frames solving as a search/verification process, not an algorithm to memorize first.

## Units

### Unit 1: What Makes an Equation (or Inequality) True?
- **Goal:** Check whether a given number makes an equation or inequality true by substituting it in, and find which values from a short list work.
- **Standard:** 6.EE.5
- **Buckets:** substitution into an equation that comes out true; substitution into an equation that comes out false; substitution into an inequality that comes out true; substitution into an inequality that comes out false; "search a given set" — test several candidate values against the same equation/inequality to identify which ones from the set actually satisfy it (forces treating solving as a search, not just "doing algebra" on one given number).
- **Requires intro (CFU gate):** Yes. Named misconception: students default to thinking "solving" always means performing an algebraic operation on both sides, rather than first understanding it as "find which values make this statement true" — substitution-checking an inequality is also new (there is no single "the" answer to check against).
- **Memorization fact (periodic re-check candidate):** No — this is a reasoning/verification skill the student re-derives by substituting, not a fact to retain.

### Unit 2: Variables for an Unknown — or for Any Number
- **Goal:** Use a letter to stand for a specific unknown number in a problem, or for any number in a described set, and write it into an expression or equation.
- **Standard:** 6.EE.6
- **Buckets:** variable stands for one specific unknown quantity to be found (word-problem translation, e.g. "5 more than a number" → x + 5); variable stands for "any number" in a general statement or pattern (e.g. "a number plus its opposite is 0" → n + (−n) = 0); variable is restricted to a specified set implied by context (e.g. "number of tickets" implies whole numbers ≥ 0, not any rational) — a contextual-constraint bucket distinct from the first two.
- **Requires intro (CFU gate):** Yes. Named misconception: conflating "x is one specific number I need to find" with "x can represent any number" — 6.EE.6 explicitly calls out both uses, and students who've only seen word-problem unknowns don't expect the second use.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 3: Solving x+p=q and px=q
- **Goal:** Solve one-step addition/subtraction and multiplication/division equations for an unknown, using inverse operations.
- **Standard:** 6.EE.7
- **Buckets:** addition-form with the unknown isolated first (x + p = q); addition/subtraction-form with the unknown NOT written first (p + x = q, or q = x + p) — the position-of-unknown dimension; multiplication-form with the unknown isolated first (px = q); multiplication/division-form with the unknown not written first or needing division to isolate (q = px, or x/p = q as the inverse case); fractional p or q (e.g. x + 3/4 = 2, or (1/2)x = 6); negative p or q (e.g. x + (−5) = 3, or −2x = 10).
- **Requires intro (CFU gate):** Yes. Named misconception: students apply the SAME operation shown in the equation instead of its inverse (e.g. adding 5 again instead of subtracting it), and separately conflate which inverse undoes addition vs. multiplication once both appear in the same unit.
- **Memorization fact (periodic re-check candidate):** No — re-derivable each time from "do the inverse operation to both sides," not a fixed fact.

### Unit 4: Writing & Graphing Inequalities
- **Goal:** Write an inequality (x>c or x<c) for a real-world constraint, and show all of its solutions on a number line.
- **Standard:** 6.EE.8
- **Buckets:** translate a word constraint into x>c form; translate a word constraint into x<c form; graph a given inequality's solutions on a number line (open circle at c, shading/arrow in the correct direction); justify that the inequality has infinitely many solutions rather than one (a true/false or "name another solution" reasoning bucket).
- **Requires intro (CFU gate):** Yes. Named misconception (explicitly the one the project's own guidance names for this standard): students often think an inequality like x>3 has one specific solution instead of infinitely many — the CFU should force a counterexample-style check (e.g. "is x=3 a solution? is x=3.5? is x=100?").
- **Memorization fact (periodic re-check candidate):** No.

### Unit 5: Dependent & Independent Variables
- **Goal:** Write an equation relating two quantities where one depends on the other, and use that equation to complete tables and read graphs.
- **Standard:** 6.EE.9
- **Buckets:** identify which quantity is independent and which is dependent in a given context (e.g. total cost depends on number of items, not the reverse); write the equation expressing the dependent variable as a function of the independent one from a verbal description; complete a table of paired values from a given equation; read a graph of the relationship and relate specific points back to the equation and the real-world context.
- **Requires intro (CFU gate):** Yes. Named misconception: confusing which variable is dependent vs. independent (the classic case — distance depends on time, not the reverse) — a vocabulary-adjacent pair that should be tested together in one question so it can't be answered by pattern-matching just one term, per this project's CFU convention.
- **Memorization fact (periodic re-check candidate):** No.

## Open questions / flags for the builder
- Unit 3's bucket list includes negative p/q (e.g. x + (−5) = 3), which goes slightly beyond 6.EE.7's literal text ("nonnegative rational p, q, x"). This is an intentional, bounded extension: `MM1_NegativeNumbersLab` already built the number-sense foundation for signed numbers in this same level folder, so a light reuse here previews 7.EE rational-number equation solving without re-teaching negatives from scratch. If this feels like scope creep at build time, it's safe to cut that sub-case and keep Unit 3 strictly nonnegative — flagging rather than deciding unilaterally since it's a deliberate standard-boundary stretch, not a strict reading of 6.EE.7.
- Unit 3 and Unit 4 both touch "position of the unknown" / "infinitely many solutions" reasoning that could arguably be tested together (an inequality version of "solve for x on either side") — left as two separate units per the standard's own split (6.EE.7 vs 6.EE.8); the builder may find a shared number-line diagram component worth reusing across Units 1, 3, and 4 (substitution-checking, equation solution point, inequality solution ray) since the underlying number-line visual overlaps.
- No existing practice history predates this lab (brand new, no grandfathering concern).
