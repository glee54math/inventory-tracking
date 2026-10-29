# Addition And Subtraction Within 20 Lab

**Proposed slot:** MG1 — provisional, confirm at build time per project convention.
**Grade:** 1
**Standards covered:** 1.OA.1 (add-to/take-from/put-together-take-apart/compare word problems within 20, unknown in any position), 1.OA.2 (add three whole numbers whose sum ≤20), 1.OA.3 (commutative/associative properties, not named formally), 1.OA.4 (subtraction as an unknown-addend problem), 1.OA.5 (relate counting to addition/subtraction), 1.OA.6 (fluently add/subtract within 20, fluent within 10, via counting-on, making-ten, decomposing, relating operations, equivalent sums), 1.OA.7 (meaning of the equal sign, true/false equations), 1.OA.8 (find the unknown whole number in an equation relating three whole numbers).
**Relationship to existing labs:** Supersedes MG1.tsx's unwired TenFrame component — that file predates the Unit-engine pattern and was never wired into practice; safe to treat this standard as uncovered.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. First grade still leans heavily on concrete/visual supports — ten-frames, number lines, counters, drawings — even as symbolic equations (7 + ☐ = 12, true/false statements) start appearing for the first time; every new symbol (the equal sign as "balance" rather than "answer comes next," the blank/box as unknown) must be explicitly introduced before it shows up in Practice.

## Units

### Unit 1: Counting On and Counting Back
- **Goal:** Use counting forward and backward to add and subtract instead of starting over from 1 every time.
- **Standard:** 1.OA.5
- **Buckets:**
  - Count on from the larger addend (e.g. 8 + 3: start at 8, count "9, 10, 11")
  - Count on from a smaller addend presented first (3 + 8: recognize it's faster to start from 8 — tests whether the student defaults to counting on from the *first* number regardless of size)
  - Count back to subtract a small number (12 - 3)
  - Count back across a landmark/decade-ish boundary within 20 (13 - 4, crossing from teens into single digits)
- **Requires intro (CFU gate):** Yes — common misconception: students often re-count from 1 every time instead of starting from the known addend, and separately, when subtracting, some count back the *wrong* number of times (off-by-one in count-back is the single most common first-grade subtraction error). CFU must check both "where do you start counting" and "how many counts."
- **Memorization fact (periodic re-check candidate):** No — this is a strategy to be reasoned through, not a fact to memorize; it's a stepping-stone toward fluency, not the fluency target itself.

### Unit 2: Making Ten and Decomposing Numbers
- **Goal:** Break numbers apart to make a ten first, then add on what's left, to add and subtract more efficiently.
- **Standard:** 1.OA.6
- **Buckets:**
  - Make-ten for addition where one addend is 8 or 9 (near-ten, small gap to fill: 9 + 4 → 9 + 1 + 3)
  - Make-ten for addition where one addend is 6 or 7 (larger gap to fill, more decomposing: 7 + 6 → 7 + 3 + 3)
  - Decomposing for subtraction using a "think-addition back through ten" bridge (13 - 5 → 13 - 3 - 2)
  - Equivalent-sum recognition: given two different addition expressions, decide if they equal the same total without computing both fully (e.g. "8 + 6 = 7 + ? " uses making-ten reasoning, not brute force)
- **Requires intro (CFU gate):** Yes — common misconception: students often treat "make a ten" as decomposing the *wrong* addend (always breaking apart the second number regardless of which one is closer to 10), and separately conflate "making ten" with just memorizing that one answer rather than a repeatable strategy. CFU must test the strategy on an unfamiliar fact to confirm it generalizes.
- **Memorization fact (periodic re-check candidate):** No — making-ten is a reasoning strategy applied across many facts, not itself a fact; see Unit 5 for the actual memorized facts.

### Unit 3: Word Problems — Add To and Take From
- **Goal:** Solve real-world stories where a starting amount changes — something is added or something is removed — and find whichever part is missing.
- **Standard:** 1.OA.1
- **Buckets** (CCSS Table 1 situation types, each crossed with Add To / Take From):
  - Add To, Result Unknown (Mia has 6 stickers, gets 5 more, how many now?)
  - Add To, Change Unknown (Mia has 6 stickers, gets some more, now has 11 — how many did she get?)
  - Add To, Start Unknown (Mia has some stickers, gets 5 more, now has 11 — how many did she start with?)
  - Take From, Result Unknown (Jay has 9 crackers, eats 4, how many left?)
  - Take From, Change Unknown (Jay has 9 crackers, eats some, now has 5 — how many did he eat?)
  - Take From, Start Unknown (Jay has some crackers, eats 4, now has 5 — how many did he start with?)
- **Requires intro (CFU gate):** Yes — common misconception: students strongly default to "the answer is always the result" and struggle badly the first time the *start* or *change* is the unknown rather than the end amount; they also often pick the operation from keywords ("more" always means add, "ate/left" always means subtract) rather than the actual story structure, which breaks down on Change/Start-Unknown versions. CFU must include a Start-Unknown problem with a "more"-style word in a subtraction-structured story to break the keyword habit.
- **Memorization fact (periodic re-check candidate):** No — this is story comprehension and problem-structure reasoning, re-derived each time, not a memorized fact.

### Unit 4: Word Problems — Put Together/Take Apart and Compare
- **Goal:** Solve stories about two parts that make a whole, and stories that compare two amounts to find how many more or fewer.
- **Standard:** 1.OA.1
- **Buckets** (CCSS Table 1 situation types):
  - Put Together/Take Apart, Total Unknown (3 red apples and 5 green apples, how many apples in all?)
  - Put Together/Take Apart, Addend Unknown (8 apples total, 3 are red, how many are green?)
  - Put Together/Take Apart, Both Addends Unknown (8 apples total, split between two baskets — show the different ways)
  - Compare, Difference Unknown, "more" phrasing (Sam has 9, Lee has 4, how many more does Sam have?)
  - Compare, Difference Unknown, "fewer" phrasing (Lee has 4, Sam has 9, how many fewer does Lee have?)
  - Compare, Bigger Unknown (Lee has 4, Sam has 5 more than Lee, how many does Sam have?)
  - Compare, Smaller Unknown (Sam has 9, Lee has 5 fewer than Sam, how many does Lee have?)
- **Requires intro (CFU gate):** Yes — common misconception: on Compare problems, students frequently subtract the wrong direction (small minus big) when the question is phrased with "fewer," and separately treat "more than"/"fewer than" as telling them which operation to use rather than reading which amount is actually bigger. Both "more" and "fewer" phrasings must appear live in the same CFU question so the student can't answer by latching onto one keyword. Also flag Both-Addends-Unknown as commonly treated as having one right answer instead of multiple valid splits.
- **Memorization fact (periodic re-check candidate):** No — comparative/part-whole reasoning is re-derived from the story each time.

### Unit 5: Fluency Facts Within 20 (and True/False Equations)
- **Goal:** Know addition and subtraction facts within 20 quickly (especially within 10), and decide whether an equation is true or false — including ones where the equal sign doesn't have the answer on the right.
- **Standard:** 1.OA.3, 1.OA.6 (fluency target), 1.OA.7, 1.OA.8
- **Buckets:**
  - Fluent recall, sums/differences within 10 (the actual memorized-fact core, e.g. 4+3, 9-5)
  - Fluent recall, sums/differences within 20 crossing or starting past 10 (8+7, 15-6)
  - Three-addend sums ≤20, using commutative/associative regrouping for an easier path (1.OA.2: e.g. 4 + 8 + 2 → group 8+2 first)
  - Equal-sign meaning / true-false equations with the unknown or operation on the LEFT (5 = 2 + 3, 7 + 1 = 6 + 2) — tests that equal sign means "same amount as," not "answer comes next"
  - True/false equations designed as traps (6 + 3 = 10, deliberately false; or 9 = 9, trivially true) to confirm the student checks rather than assumes
  - Find-the-unknown in a three-number equation, unknown in a non-final position (8 + ☐ = 11, or ☐ + 5 = 12, or 14 - ☐ = 9) per 1.OA.8
- **Requires intro (CFU gate):** Yes — common misconception: students very commonly read "=" as "and the answer is," so an equation like 5 = 2 + 3 or 7 + 1 = 6 + 2 looks "backwards" or "wrong" to them on sight; a true/false equation with no unknown at all (like 8 = 8 or 6 + 2 = 9) is also commonly mishandled because students expect every equation to require "solving." CFU must include at least one equation with the unknown NOT in the last position and one true/false equation that requires no computation, just the equal-sign concept.
- **Memorization fact (periodic re-check candidate):** Yes, for the fluent-recall buckets specifically — sums and differences within 10 (and ideally within 20) are explicitly named by 1.OA.6 as a long-term fluency target, the direct first-grade analog of later memorized fact families; set `reintroEverySolved` so these facts are periodically re-surfaced rather than proven once and assumed retained. The true/false and unknown-position buckets are reasoning-based and should stay "no."

## Open questions / flags for the builder
- Unit 5 bundles several standard sub-parts (1.OA.3, parts of 1.OA.6, 1.OA.7, 1.OA.8) into one unit because they're all facets of "fluency and equation sense" rather than separate problem-solving skills; if the builder finds this too broad for one Explore/CFU/Practice pass, splitting Unit 5 into a "Fluency Facts" unit and a separate "Equal Sign & Equations" unit is a reasonable split — flagging rather than deciding, since it changes the unit count.
- 1.OA.2 (three-addend sums) is folded into Unit 5 as one bucket rather than its own unit since it's additional practice applying the same making-ten/commutative reasoning from Units 2 and 5 to three numbers instead of two, not a new concept requiring its own CFU gate.
- Given 1st-grade audience, recommend the builder keep all generated numbers within 20 (per standard) and avoid introducing written algorithm formats (no vertical stacking) — this grade's standard is explicitly about strategy and reasoning, not a written procedure.
