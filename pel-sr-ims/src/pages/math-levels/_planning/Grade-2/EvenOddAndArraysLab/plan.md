# EvenOddAndArraysLab

**Proposed slot:** MG5 — provisional, confirm at build time per project convention.
**Grade:** 2
**Standards covered:** 2.OA.3 (determine whether a group of objects, up to 20, has an odd or even number of members; write an equation expressing an even number as the sum of two equal addends); 2.OA.4 (use addition to find the total number of objects arranged in rectangular arrays with up to 5 rows and 5 columns; write an equation to express the total as a sum of equal addends)
**Relationship to existing labs:** No overlap with MG6's live components. `BarModelPractice` covers additive word problems via bar models but never touches odd/even classification or array-based equal-addend representation. `TimesTableDrill` (currently bundled inside MG6's bar-model component) is pure multiplication-fact recall (random facts from 3×3 to 9×9, using the × symbol directly) — a different skill from this lab's scope, which stays entirely within 2.OA.3-4's addition-based framing (equal addends written with +, never introducing × or memorized multiplication facts). This lab is a genuinely new conceptual strand: the addition-based foundation that later multiplication-fact work (e.g. `TimesTableDrill`, or a future dedicated multiplication lab) builds on, not a duplicate of it.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Keep every problem physically groupable — pairs of counters for odd/even, a visible grid of dots/squares for arrays — since the whole point of this lab is to make "equal addends" and "equal groups" feel concrete before multiplication facts arrive as pure recall later.

## Units

### Unit 1: Determining Odd and Even
- **Goal:** Decide whether a group of up to 20 objects can be split into pairs with none left over (even) or one left over (odd).
- **Standard:** 2.OA.3 (odd/even determination)
- **Buckets:** small even group (≤10, pairs evenly with no leftover); small odd group (≤10, one leftover); larger even group (11-20); larger odd group (11-20); the SAME group count shown in a scattered/irregular arrangement rather than a neat line or pairs (odd/even must not appear to depend on how the objects are arranged)
- **Requires intro (CFU gate):** Yes — target misconception that evenness is "just" a memorized pattern of ending digits (0,2,4,6,8) disconnected from the actual pairing reasoning, and that arranging the same quantity differently could change whether it's odd or even.
- **Memorization fact (periodic re-check candidate):** No — this is deliberately taught as a reasoned pairing check, not a recalled fact, even though the ones-digit pattern is a useful shortcut students may notice on their own.

### Unit 2: Even Numbers as Equal Addends
- **Goal:** Write an even number as two equal addends added together, like 14 = 7 + 7.
- **Standard:** 2.OA.3 (equal-addends equation)
- **Buckets:** small even number (≤10) split into two equal addends (e.g. 6 = 3 + 3); larger even number (12-20) split into two equal addends (e.g. 18 = 9 + 9); a given equation that sums correctly but does NOT use equal addends (e.g. is 14 = 6 + 8 a valid "equal addends" equation? no — true/false trap); an odd number presented as a trap — recognize it CANNOT be written as two equal whole-number addends at all
- **Requires intro (CFU gate):** Yes — misconception that any two addends summing to the target number satisfies "equal addends" (ignoring that both addends must be identical), and the specific trap of trying to force an odd number into two equal whole-number addends.
- **Memorization fact (periodic re-check candidate):** No — each equation is derived by halving the specific number given, not recalled.

### Unit 3: Rectangular Arrays — Finding the Total
- **Goal:** Count the total number of objects in a grid arranged in equal rows and columns, by adding.
- **Standard:** 2.OA.4 (array totals via addition)
- **Buckets:** small array (2x2 or 2x3 — few addends to add); larger array approaching the standard's cap (4x5 or 5x5); the same array added by rows versus added by columns (same total, different-looking addition — commutative property made concrete); a non-square array shown in two different orientations (e.g. 5 rows of 3 vs. 3 rows of 5) that a student must recognize give the same total
- **Requires intro (CFU gate):** Yes — misconception risk of double-counting or skipping a row/column when reading the grid, and not recognizing that rotating which dimension is called "rows" doesn't change the total.
- **Memorization fact (periodic re-check candidate):** No — each array's total is computed fresh from its specific dimensions.

### Unit 4: Arrays as Equal-Addend Equations
- **Goal:** Write an array's total as a sum of equal addends, like 4 rows of 3 as 3 + 3 + 3 + 3.
- **Standard:** 2.OA.4 (equal-addends equation from an array)
- **Buckets:** write the equation by adding rows (e.g. 4 rows of 3 → 3+3+3+3); write the equation by adding columns for the SAME array (e.g. 3 columns of 4 → 4+4+4); given an equal-addends equation, draw/reconstruct the array it represents (reverse direction); true/false trap — does 3+3+3+3 represent the same array as 4+4+4+4? (tests whether the student is tracking which number is the addend size versus the number of addends, since both numbers come from the same array and are easy to flip)
- **Requires intro (CFU gate):** Yes — the specific, nameable misconception is flipping which array dimension becomes the addend's SIZE versus the NUMBER of addends (e.g. writing 4+4+4 for a 4-row-by-3-column array when the addend count should be 3, not 4) — both numbers are visually present in the same array, making this an easy error to make confidently.
- **Memorization fact (periodic re-check candidate):** No — each equation is built from the specific array shown.

## Open questions / flags for the builder
- Units 1-2 and Units 3-4 are two distinct standard codes (2.OA.3 and 2.OA.4) bundled into one 4-unit lab per the brief's proposed scope; if the builder finds this makes the lab feel like two unrelated halves in practice, splitting into two labs (Odd/Even, and Arrays) is a reasonable alternative to flag back to the user — not acting on it unilaterally since the brief named one lab folder.
- Unit 4's "same array, different-looking equal-addends equation" bucket intentionally overlaps with Unit 3's rows-vs-columns bucket; the builder should make sure Unit 3 asks for a TOTAL (a number) while Unit 4 asks for an EQUATION (an expression), so the two units test genuinely different output skills even when sharing the same underlying array image.
