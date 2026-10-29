# ExpressionsAndEquationsLab

**Proposed slot:** MM3 — provisional, confirm at build time per project convention.
**Grade:** 7
**Standards covered:** 7.EE.1 (add/subtract/factor/expand linear expressions with rational coefficients), 7.EE.2 (understand rewriting an expression can reveal how quantities relate, e.g. "a+0.05a=1.05a" means "increase by 5% = multiply by 1.05"), 7.EE.3 (solve multistep real-life/math problems with positive/negative rationals in any form, convert forms as needed, assess reasonableness), 7.EE.4a (solve word problems leading to px+q=r and p(x+q)=r equations, comparing algebraic vs. arithmetic approaches), 7.EE.4b (solve word problems leading to px+q>r or px+q<r inequalities and graph the solution set).
**Relationship to existing labs:** Extends MM1_ExponentsAndExpressionsLab's (grade 6, already built) expression-equivalence work and MM2's OneVariableEquationsAndInequalitiesLab (grade 6, planned in this same batch but in a separate folder — may not exist yet when this lab is built) equation-solving work to RATIONAL (not just whole-number/nonnegative) coefficients and two-step forms. This lab assumes basic equation-solving (isolating a variable, one-step inequalities) is already familiar and focuses entirely on the harder coefficient space (negatives, fractions, decimals) and the harder two-step forms (px+q=r, p(x+q)=r).
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Introduce rational coefficients and two-step forms as the SAME familiar one-step process done twice, not a new category of problem — show the algebraic steps side-by-side with the arithmetic/mental-math shortcut (per 7.EE.4a) so symbol manipulation never feels disconnected from the number sense the student already has. For 7.EE.2's "rewriting reveals meaning" units, ground every example in a real purchase or real paycheck before showing the symbolic rewrite.

## Units

### Unit 1: Adding, Subtracting, Factoring & Expanding with Rational Coefficients
- **Goal:** Combine like terms, expand using the distributive property, and factor out a common factor — when the coefficients can be negative, fractions, or decimals.
- **Standard:** 7.EE.1
- **Buckets:**
  - Adding or subtracting two expressions with like terms, using negative and/or fractional coefficients
  - Expanding with a negative multiplier outside parentheses (e.g. −2(3x − 5)), where every term's sign must flip correctly
  - Expanding with a fractional or decimal multiplier outside parentheses (e.g. (1/2)(4x + 6) or 0.25(8x − 4))
  - Factoring out a common rational factor, including a negative factor (e.g. factoring −3 from −3x − 9)
  - A combined problem requiring BOTH expanding and then combining like terms in the same expression
- **Requires intro (CFU gate):** Yes — distributing a negative across parentheses (every term's sign must flip, not just the first term's) is a classic dropped-sign error, and factoring out a negative factor compounds the same risk in reverse.
- **Memorization fact (periodic re-check candidate):** No — procedural, re-derivable from the distributive property each time.

### Unit 2: Rewriting Expressions to Reveal Relationships
- **Goal:** Rewrite an expression in an equivalent form to see a real-world relationship more clearly — for example, seeing that a + 0.05a = 1.05a means "increase by 5% is the same as multiplying by 1.05."
- **Standard:** 7.EE.2
- **Buckets:**
  - A percent increase rewritten as a single multiplier (a + 0.05a = 1.05a)
  - A percent decrease/discount rewritten as a single multiplier (a − 0.20a = 0.80a)
  - A combined/repeated rate scenario rewritten to reveal one total multiplier (e.g. a tax rate and a tip rate combined into one coefficient)
  - The REVERSE direction: given a single-multiplier form (e.g. 1.08a), identify what real-world percent change it represents — tests understanding of the relationship, not just the forward rewrite
- **Requires intro (CFU gate):** Yes — the entire point of this standard is the "aha" that two algebraically-equivalent forms expose different real-world meaning; it's a new way of looking at an expression, not a computation to drill.
- **Memorization fact (periodic re-check candidate):** No — a conceptual insight re-derived from the distributive property each time, not a fact to recall.

### Unit 3: Multistep Real-World Problems with Rational Numbers in Any Form
- **Goal:** Solve multistep problems using whole numbers, fractions, and decimals together, converting between forms when it helps, and checking that the final answer is reasonable.
- **Standard:** 7.EE.3
- **Buckets:**
  - A problem naturally stated in decimals that's easier to finish by converting to fractions (or the reverse)
  - A problem that specifically requires an estimate-first reasonableness check, catching a computed answer that's off by an order of magnitude from a sloppy step
  - A multistep problem combining a fraction operation and a percent/decimal operation within the same real-world scenario
  - A multistep problem involving negative rational numbers, combining the OperationsWithRationalNumbersLab's sign fluency with new multistep structure
- **Requires intro (CFU gate):** Yes — "assess the reasonableness of an answer using mental computation and estimation" is a distinct, explicitly-named skill in this standard (not just solving correctly), and the common failure mode — trusting a computed answer without a sanity check — is worth a deliberate walkthrough.
- **Memorization fact (periodic re-check candidate):** No — applied, multistep reasoning, not a fact.

### Unit 4: Solving px + q = r and p(x + q) = r
- **Goal:** Translate a word problem into a two-step equation (px + q = r or p(x + q) = r) and solve it, comparing the algebraic solution to an arithmetic/mental-math shortcut.
- **Standard:** 7.EE.4a
- **Buckets:**
  - px + q = r with all positive values
  - px + q = r with a negative q and/or a negative solution for x
  - p(x + q) = r form, which can be solved either by distributing first or by dividing both sides by p first
  - Rational (fraction or decimal) coefficients for p and/or q
  - The word-problem translation step itself — writing the correct equation from a described scenario rather than being handed the equation already — the hardest and most commonly skipped bucket
- **Requires intro (CFU gate):** Yes — two specific, nameable errors recur here: dividing only the p·x term (and not p·q) by p when isolating x in the p(x+q)=r form, and mistranslating a word problem's operation order (e.g. "5 less than three times a number" becoming 5 − 3x instead of 3x − 5).
- **Memorization fact (periodic re-check candidate):** No — procedural and translational, re-derived from the problem's own structure each time.

### Unit 5: Solving and Graphing px + q > r and px + q < r
- **Goal:** Solve a word problem that leads to a two-step inequality, and graph the solution set on a number line, paying special attention to what happens when multiplying or dividing by a negative number.
- **Standard:** 7.EE.4b
- **Buckets:**
  - An inequality solved by dividing by a POSITIVE p (the inequality direction stays the same)
  - An inequality solved by dividing by a NEGATIVE p (the inequality direction must flip) — the named misconception for this entire standard
  - Graphing the resulting solution set correctly (open vs. closed circle, correct direction of shading) for both a flipped and an unflipped case
  - The word-problem translation step — mapping language like "at most," "at least," "more than," or "fewer than" to the correct inequality symbol before solving
- **Requires intro (CFU gate):** Yes — "flip the inequality sign when multiplying or dividing by a negative" is THE specific, named rule this standard exists to teach, and it needs a deliberate walkthrough (e.g. testing a value against both the flipped and unflipped inequality to see which one stays true) rather than being stated as a bare rule.
- **Memorization fact (periodic re-check candidate):** No — re-derivable by testing a value, consistent with the "mostly no" default; kept separate from 7.NS.2a's sign-rule exception, which is a distinct standard in a different lab.

## Open questions / flags for the builder

- Unit 5's bucket list is scoped to strict inequalities (> and <) per the standard's own text ("px+q>r or px+q<r"). Decide explicitly at build time whether to also include ≥/≤ as an extension (affecting open-vs-closed-circle graphing) or keep strictly to the standard's stated scope, and state the choice in the unit's Explore copy.
- MM2's OneVariableEquationsAndInequalitiesLab (grade 6, referenced in this plan's "Relationship to existing labs") may not exist yet when this lab is built — if it doesn't, Units 4-5 here should still explicitly teach the one-step equation/inequality groundwork briefly before jumping to two-step forms, rather than assuming it's already covered; if it DOES exist by then, confirm its scope matches what's assumed here (whole-number/nonnegative coefficients, one-step only) before skipping that groundwork.
- Unit 1 and MM1_ExponentsAndExpressionsLab's existing equivalent-expressions units cover adjacent ground (expanding/combining like terms) — confirm at build time that the earlier lab's coefficients are indeed limited to whole numbers/nonnegative values, so Unit 1 here reads as a clear coefficient-space extension rather than a re-tread.
