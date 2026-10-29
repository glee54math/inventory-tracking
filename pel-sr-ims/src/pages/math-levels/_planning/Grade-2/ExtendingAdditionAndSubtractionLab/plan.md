# ExtendingAdditionAndSubtractionLab

**Proposed slot:** MG5 — provisional, confirm at build time per project convention.
**Grade:** 2
**Standards covered:** 2.OA.2 (fluently add/subtract within 20 using mental strategies; know all sums of two one-digit numbers from memory by end of grade); 2.NBT.6 (add up to four two-digit numbers); 2.NBT.7 (add/subtract within 1000, using concrete models or drawings); 2.NBT.7.1 (use estimation strategies to make reasonable estimates — CA); 2.NBT.8 (mentally add/subtract 10 or 100 to/from a number 100-900); 2.NBT.9 (explain why addition/subtraction strategies work, using place value and properties of operations)
**Relationship to existing labs:** This lab deliberately does NOT re-cover plain 2-digit + 2-digit addition/subtraction — that's already live via MG6's `TwoDigitVisualAddition` and `VerticalAdditionSubtraction` components (numbers 10-99 only), and MG6's `BarModelPractice` already covers additive word problems. This lab's scope starts where those leave off: within-20 fact fluency as a foundation, then everything genuinely beyond two 2-digit numbers (up to four addends, into the hundreds, mental ±10/±100, and the reasoning behind why the strategies work). It depends on `PlaceValueTo1000Lab`'s hundreds/tens/ones foundation — regrouping into a new hundred doesn't make sense without that first. Note also: 2.OA.1 (add/subtract within 100 to solve one- and two-step word problems) is NOT covered by this lab or any other Grade-2 plan folder in this batch — it's reasonably assumed to already be served by MG6's live `BarModelPractice`, which is why it doesn't appear here; flagging this explicitly so it isn't mistaken for an overlooked gap.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Keep base-ten block diagrams and a hundreds chart/number line visible through the harder regrouping units even as the written algorithm takes over more of the work — the leap from "2-digit column addition" to "4-addend, into-the-hundreds, explain-why" content is large for a first-time learner and should not skip straight to abstract digits.

## Units

### Unit 1: Within-20 Addition and Subtraction Fluency
- **Goal:** Add and subtract within 20 quickly, using strategies like making a ten, and start knowing the basic facts by heart.
- **Standard:** 2.OA.2
- **Buckets:** addition facts with sums ≤10 (basic recall); addition facts with sums 11-20 requiring a "make a ten" or counting-on strategy (e.g. 8+6); subtraction within 20 with no crossing of a ten (e.g. 15-3); subtraction within 20 that requires decomposing a ten (e.g. 15-8); a fact-family / inverse-operation check (given 8+5=13, confirm 13-5=8 and 13-8=5)
- **Requires intro (CFU gate):** Yes — misconception that subtraction must always be "count down from the first number to zero" rather than being solvable as an unknown-addend problem related to addition; also confusion about when counting-on is efficient versus when making-a-ten is needed.
- **Memorization fact (periodic re-check candidate):** Yes — the standard explicitly requires knowing all one-digit sums from memory by end of grade; set `reintroEverySolved` so fluency doesn't quietly decay once first demonstrated.

### Unit 2: Adding Up to Four Two-Digit Numbers
- **Goal:** Add three or four two-digit numbers together, carrying correctly even when the ones column adds up past 20.
- **Standard:** 2.NBT.6
- **Buckets:** two addends, no regrouping; two addends, with one regroup; three or four addends with at most a single ten carried; three or four addends where the ones-column sum is 20 or more (requires carrying more than one ten into the tens column, or a resulting carry into the hundreds)
- **Requires intro (CFU gate):** Yes — real misconception that when stacking more than two numbers, each column can still only ever carry a single extra "1," so a ones-column sum like 27 (carry 2) gets silently mishandled as if it were a normal single-digit carry.
- **Memorization fact (periodic re-check candidate):** No — this is a procedural extension of column addition, fully re-derivable from place value each time.

### Unit 3: Adding and Subtracting Within 1000
- **Goal:** Add and subtract 3-digit numbers using drawings or models, and check whether an answer is reasonable.
- **Standard:** 2.NBT.7, 2.NBT.7.1
- **Buckets:** addition with no regrouping; addition with a single regroup (ones→tens or tens→hundreds); addition with a double regroup (both ones→tens AND tens→hundreds); subtraction with no regrouping; subtraction with a single borrow; subtraction that borrows through a zero in the tens place (e.g. 403 - 158, where there are no tens to borrow from directly); estimate-first-then-check (round addends/minuend to the nearest ten or hundred and judge whether a given computed answer is reasonable)
- **Requires intro (CFU gate):** Yes — borrowing through a zero is the single hardest, most specific misconception point in this unit (you cannot borrow a ten from a tens place that holds a 0, so you must reach into the hundreds place first); this needs to be shown explicitly, not left for students to generalize from non-zero borrow examples.
- **Memorization fact (periodic re-check candidate):** No — both the algorithm and the estimation strategy are reasoned/re-derived from the specific numbers given.

### Unit 4: Mental Math — Add or Subtract 10 or 100
- **Goal:** Figure out a number that's 10 or 100 more or less than a given number, in your head, using what you know about place value.
- **Standard:** 2.NBT.8
- **Buckets:** +10, staying within the same hundred (e.g. 240 → 250); +10, crossing into the next hundred (e.g. 290 → 300); -10, staying within the same hundred; -10, crossing down out of a hundred (e.g. 300 → 290); +100 or -100 with no boundary issue (e.g. 240 → 340); +100 or -100 at the stated range's edge (e.g. 900 + 100 = 1000, or 100 - 100 = 0)
- **Requires intro (CFU gate):** Yes — when ±10 crosses a hundred boundary, a common error is adjusting only the tens digit without letting the carry/borrow ripple into the hundreds digit (e.g. treating 290+10 as "2(10)0" instead of 300); this is a distinct, nameable mistake from the boundary-free cases and needs its own explicit walkthrough.
- **Memorization fact (periodic re-check candidate):** No — this is a place-value pattern applied mentally, reasoned from the specific number each time, not an arbitrary fact to recall.

### Unit 5: Explaining Why the Strategies Work
- **Goal:** Explain, using place value, why an addition or subtraction strategy gives the right answer — not just that it does.
- **Standard:** 2.NBT.9
- **Buckets:** justify why regrouping (trading 10 ones for 1 ten, or 10 tens for 1 hundred) doesn't change the number's value; justify why you can add tens and ones in separate columns when no regrouping is needed; justify that order doesn't matter when adding two numbers (commutative property) in a real context; critique a flawed or incomplete strategy and explain specifically where/why it breaks (e.g. a method that works for no-regroup problems but silently gives a wrong answer once a regroup is needed)
- **Requires intro (CFU gate):** Yes — this entire unit IS the comprehension check in spirit; the specific misconception to target is over-generalizing a shortcut that happens to work on easy (no-regroup) cases to every case, without understanding why it stops working once regrouping is required.
- **Memorization fact (periodic re-check candidate):** No — by definition this unit is about reasoning and justification, not recall.

## Open questions / flags for the builder
- Unit 1 (within-20 fluency) is listed first per the brief even though its CCSS code (2.OA.2) is numerically "between" 2.NBT units in the standards document — this ordering is intentional (foundational fact fluency before extending the written algorithms), not an error to reconcile.
- Unit 5's buckets are inherently CFU-shaped (explain/justify) rather than classic numeric-answer Practice buckets; the builder should decide whether Practice problems here can still follow the standard 2-3-step `Problem`/`steps` shape (compute → justify) or whether this unit leans more heavily on the CFU mechanism than Practice reps — flagging this as a genuine design judgment call, not a missing decision on my part.
- If a student has existing practice history in any unit here from a pre-existing version of this lab, the builder must grandfather it per the standard CFU-gate convention — not applicable if this lab is being built from scratch.
