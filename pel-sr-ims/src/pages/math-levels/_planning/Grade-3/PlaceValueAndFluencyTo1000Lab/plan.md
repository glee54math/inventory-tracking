# PlaceValueAndFluencyTo1000Lab

**Proposed slot:** MG6 — provisional, confirm at build time per project convention.
**Grade:** 3
**Standards covered:** 3.NBT.1 (round whole numbers to the nearest 10 or 100), 3.NBT.2 (fluently add and subtract within 1000), 3.NBT.3 (multiply one-digit whole numbers by multiples of 10 in the range 10-90, using place value understanding).
**Relationship to existing labs:** MG6 already hosts live 2-digit addition/subtraction components (grade 2 scope). This lab extends that work to 3-digit numbers, introduces rounding (genuinely new), and introduces one-digit × multiple-of-10 multiplication (genuinely new, and a direct precursor to the multi-digit multiplication work already live in MG7's `Nx1DigitMultiplication`). No content overlap with MG6's existing 2-digit components, but flagging that MG6 is getting crowded — by the time this lab is added, MG6 hosts both grade-2-scope 2-digit add/subtract AND grade-3-scope 3-digit add/subtract/rounding/×10s under one level code. Confirm at build time whether MG6 should keep absorbing grade-3 arithmetic or whether this lab is better placed in an uncrowded slot.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Rounding is a genuinely new idea (not just bigger numbers) and needs a visual anchor (a number line showing which "landmark" ten/hundred a number is closer to) before any rule like "look at the digit and decide" is introduced as a shortcut. The 3-digit addition/subtraction and ×10s units can lean more on extending familiar 2-digit strategies, but should still open each unit with a concrete/visual model (base-ten blocks or place-value charts) rather than jumping straight to the written algorithm.

## Units

### Unit 1: Rounding to the Nearest 10
- **Goal:** You will be able to round any whole number to the nearest 10 and explain why, using a number line to see which ten it's closer to.
- **Standard:** 3.NBT.1
- **Buckets:**
  - Numbers clearly closer to one ten than the other (e.g. 43 → 40, 78 → 80) — the straightforward case
  - Numbers exactly at the midpoint (ending in 5, e.g. 45, 65) — the genuine edge case requiring the "round up" convention rather than visual closeness alone, since a midpoint number is NOT visually closer to either ten
  - Numbers that round UP across a hundred boundary (e.g. 96 → 100, 195 → 200) — a case where the result changes the hundreds digit too, which a student doing pure digit-counting can get wrong
  - Three-digit numbers rounded to the nearest 10 (not just two-digit) — extends the skill's range per the standard's "whole numbers" scope
- **Requires intro (CFU gate):** Yes — rounding is a brand-new idea; common misconception is treating "round to the nearest 10" as "just change the last digit to 0" without understanding WHY (closeness on a number line), which breaks down at the midpoint case and the boundary-crossing case.
- **Memorization fact (periodic re-check candidate):** No — rounding is a reasoning procedure (locate on a number line, decide closeness) always re-derivable, not a fact to recall.

### Unit 2: Rounding to the Nearest 100
- **Goal:** You will be able to round any whole number to the nearest 100 and explain why, using the same number-line idea as rounding to the nearest 10.
- **Standard:** 3.NBT.1
- **Buckets:**
  - Numbers clearly closer to one hundred than the other (e.g. 340 → 300, 380 → 400)
  - Numbers exactly at the midpoint (ending in 50, e.g. 350, 650) — the nearest-100 analog of the nearest-10 midpoint case
  - Numbers that round UP across a thousand boundary (e.g. 960 → 1000) — flagging this reaches just past the 3.NBT numbers-within-1000 scope but is a natural edge case the rounding rule produces, so the builder should confirm whether to include or cap practice below it
  - Mixed nearest-10-vs-nearest-100 discrimination: the same number rounded both ways side by side (e.g. "round 647 to the nearest 10" vs. "to the nearest 100") to force reading which landmark is being asked for, not applying a memorized single rule
- **Requires intro (CFU gate):** Yes — students who master nearest-10 rounding often misapply the same digit-position habit to nearest-100 without re-deriving it from the (bigger) number line; CFU should include the mixed-discrimination case directly.
- **Memorization fact (periodic re-check candidate):** No — same reasoning procedure as Unit 1, scaled up; always re-derivable.

### Unit 3: Adding and Subtracting Within 1000
- **Goal:** You will be able to add and subtract any two numbers up to 1000, using place value to keep track of hundreds, tens, and ones.
- **Standard:** 3.NBT.2
- **Buckets:**
  - Addition with no regrouping/carrying needed (foundation case, confirms place-value alignment understanding)
  - Addition requiring a single regroup (ones→tens OR tens→hundreds, not both)
  - Addition requiring a double regroup (ones→tens AND tens→hundreds in the same problem) — the genuinely hard case that single-regroup practice alone doesn't prepare for
  - Subtraction with no regrouping needed
  - Subtraction requiring a single borrow
  - Subtraction requiring a double borrow, INCLUDING the zero-in-the-middle case (e.g. 500 − 237, borrowing through a 0 in the tens place) — the single hardest subtraction edge case in this range, deliberately named since generators commonly avoid it
- **Requires intro (CFU gate):** Yes — this extends known 2-digit strategies to 3 digits; the gate should specifically confirm the student can walk through a double-regroup/borrow-through-zero case, since that's where place-value understanding (vs. rote column procedure) actually gets tested.
- **Memorization fact (periodic re-check candidate):** No — this is a procedural/algorithmic skill always re-derivable by working through place value; it is the sums/differences of single digits (already covered in prior-grade fact fluency) that are memorized, not this 3-digit procedure itself.

### Unit 4: Multiplying by Multiples of 10
- **Goal:** You will be able to multiply any one-digit number by a multiple of 10 (like 6 × 70) by using what you know about 6 × 7 and place value.
- **Standard:** 3.NBT.3
- **Buckets:**
  - Multiplying by 10 itself (e.g. 4 × 10) — the foundational "append a zero" case, grounded in why it works (4 groups of 10) rather than just the shortcut
  - Multiplying a one-digit number by a multiple of 10 using a KNOWN easy one-digit fact (e.g. 5 × 60, built from 5×6)
  - Multiplying a one-digit number by a multiple of 10 using a HARDER one-digit fact (e.g. 7 × 80, built from 7×8) — deliberately drawing on the hardest one-digit fact bucket from Multiplication Foundations Lab, not just the easy anchors
  - Reverse direction: given a product that's a multiple of 10 (e.g. 420), and one factor, find the missing multiple-of-10 factor
- **Requires intro (CFU gate):** Yes — the "just add a zero" shortcut is easy to apply blindly without understanding WHY it works (place value: 6×70 = 6×7 tens = 42 tens = 420); CFU should ask the student to explain the shortcut in place-value terms, not just produce the right answer, and should catch the common error of appending the wrong number of zeros when the one-digit fact itself ends in a zero-adjacent digit pattern (e.g. confusing 6×50=300 with 6×5=30).
- **Memorization fact (periodic re-check candidate):** No — this unit is a strategy (extend a known one-digit fact via place value) always re-derivable; the one-digit facts it depends on are memorized elsewhere (Multiplication Foundations Lab), not duplicated here.

## Open questions / flags for the builder
- Flagging MG6 slot crowding explicitly per the task brief: by this point MG6 would host grade-2 2-digit add/subtract AND this lab's grade-3 3-digit add/subtract/rounding/×10s. Confirm at build time whether to keep this under MG6 or move it to a cleaner slot before wiring.
- Unit 2's "rounds up across a thousand boundary" bucket (e.g. 960→1000) technically produces a 4-digit result from a 3-digit input; the builder should decide whether to include this edge case as written or cap Practice at results that stay within 1000, since the standard's stated scope is "within 1000."
- Unit 4 assumes Multiplication Foundations Lab's one-digit fact fluency (Unit 4 there) is already built/available as a dependency for its "harder one-digit fact" bucket — if sequencing has this lab built first, the builder should include a brief refresher rather than assuming those facts are solid.
