# PlaceValueTo1000Lab

**Proposed slot:** MG5 — provisional, confirm at build time per project convention.
**Grade:** 2
**Standards covered:** 2.NBT.1 (three digits of a 3-digit number represent hundreds/tens/ones, including special cases); 2.NBT.2 (count within 1000; skip-count by 2s, 5s, 10s, and 100s — CA); 2.NBT.3 (read and write numbers to 1000 using base-ten numerals, number names, and expanded form); 2.NBT.4 (compare two 3-digit numbers using >, =, <)
**Relationship to existing labs:** MG6's `TwoDigitVisualAddition`/`VerticalAdditionSubtraction` (2-digit ± 2-digit fluency, numbers 10-99) and `BarModelPractice` (word problems) are live and untouched by this lab — this lab contains no addition or subtraction at all. It is a pure place-value/number-sense lab that extends 1.NBT's two-digit work into three digits, and functions as the prerequisite foundation for `ExtendingAdditionAndSubtractionLab`'s 2.NBT.6-9 content (you cannot regroup into hundreds if you don't yet understand what a hundred is).
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Second grade is the bridge from concrete to symbolic: lean on hundreds charts, base-ten block diagrams (flats/rods/units), and a 0-1000 number line/chart for every new idea, but let written numerals and equations (standard/word/expanded form) carry more of the work than physical manipulatives alone would.

## Units

### Unit 1: Hundreds, Tens, and Ones
- **Goal:** Build and read 3-digit numbers by figuring out how many hundreds, tens, and ones are inside them.
- **Standard:** 2.NBT.1 (1a-b)
- **Buckets:** plain 3-digit decomposition with no zero digits (e.g. 342 → 3 hundreds 4 tens 2 ones); multiple-of-100 special case (e.g. 500 → 5 hundreds 0 tens 0 ones, and the idea that 100 itself = 10 tens bundled together); zero in the tens place only (e.g. 304); zero in the ones place only (e.g. 340); non-standard regrouped representation (e.g. "23 tens is the same as how many hundreds and tens?" → 2 hundreds 3 tens, or "15 tens = ___")
- **Requires intro (CFU gate):** Yes — real misconception risk that a number like "350" means "3 hundreds plus 50 ones" as two unrelated facts rather than each digit's value depending strictly on its position; also the special case that 100 = 10 tens (not an unrelated fact, a regrouping of the same quantity) needs to be stated explicitly, not just demonstrated once with blocks.
- **Memorization fact (periodic re-check candidate):** No — place value is reasoned from position each time (digit × its place's value), not a fact to recall from memory.

### Unit 2: Counting and Skip-Counting to 1000
- **Goal:** Count by ones to 1000 and skip-count by 2s, 5s, 10s, and 100s, even when crossing a new hundred.
- **Standard:** 2.NBT.2
- **Buckets:** counting by 1s across a hundred boundary (e.g. 298, 299, 300, 301); skip-count by 2s (even sequences, including crossing a hundred, e.g. 198, 200, 202); skip-count by 5s crossing a landmark (e.g. 95, 100, 105); skip-count by 10s crossing a hundred (e.g. 280, 290, 300, 310); skip-count by 100s up toward 1000 (e.g. 600, 700, 800, 900, 1000); skip-counting starting from a number that is NOT a multiple of the skip amount (e.g. start at 47, skip by 5: 47, 52, 57, 62)
- **Requires intro (CFU gate):** Yes — crossing a hundred boundary while counting/skip-counting is a genuinely new skill beyond Grade 1's count-to-120, and a common error is writing something like "2,99" then "3,00" (treating the boundary as a reset to a brand-new place-value shape) instead of recognizing 299 → 300 as a smooth +1.
- **Memorization fact (periodic re-check candidate):** Yes — the skip-counting sequences themselves (by 2s/5s/10s/100s) are meant to become automatic recall, not re-derived by counting one-by-one each time; set `reintroEverySolved` so the sequences get periodically re-surfaced.

### Unit 3: Reading and Writing Numbers Three Ways
- **Goal:** Write the same number as a numeral, in words, and broken apart by place value (expanded form) — and go the other direction too.
- **Standard:** 2.NBT.3
- **Buckets:** standard numeral → word form; word form → standard numeral; standard numeral → expanded form; expanded form → standard numeral; a number with a zero in the tens or ones place in word/expanded form (e.g. 403 → "four hundred three," NOT "four hundred zero ten three," and expanded form 400 + 3, not 400 + 0 + 3 written as a confusing three-term sum)
- **Requires intro (CFU gate):** Yes — the zero-placeholder case is the specific, nameable misconception: students often try to "say" or "write" the zero as its own term instead of recognizing it as an absent place value, producing malformed word/expanded forms.
- **Memorization fact (periodic re-check candidate):** No — translating between forms is a procedure applied to whichever number appears, not a fixed fact to recall.

### Unit 4: Comparing Three-Digit Numbers
- **Goal:** Decide whether one 3-digit number is greater than, less than, or equal to another, and show it with >, =, <.
- **Standard:** 2.NBT.4
- **Buckets:** different hundreds digit (resolved at a glance); same hundreds digit, different tens digit; same hundreds and tens digits, different ones digit; equal numbers (=); comparing a number given in word or expanded form against one given in standard form (forces actually evaluating the form rather than just eyeballing digit-by-digit)
- **Requires intro (CFU gate):** Yes — misconception that more non-zero digits or a larger-looking digit anywhere in the number wins, instead of comparing strictly left-to-right starting from the highest place value; also which way the > / < symbol points is a frequent reversal error worth a dedicated vocabulary check.
- **Memorization fact (periodic re-check candidate):** No — comparison is reasoned fresh from the two specific numbers each time.

## Open questions / flags for the builder
- Unit 1's "non-standard regrouped representation" bucket (e.g. "15 tens = ___") is intentionally the hardest bucket in this lab and overlaps conceptually with Unit 2's skip-by-10s content; the builder should make sure Practice problems for each unit stay in their own lane (Unit 1 asks "how many hundreds/tens/ones," Unit 2 asks "what comes next in this counting sequence") so students don't get credit for one skill while believing they practiced the other.
- Skip-counting by 100s (Unit 2) naturally terminates at 1000, which is one more than this lab's otherwise-stated range ("to 1000" / "within 1000"); treat 1000 itself as an in-range endpoint value for Unit 2 only, not for Units 1/3/4's 3-digit-number framing.
