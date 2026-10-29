# Place Value To 120 Lab

**Proposed slot:** MG2 — provisional, confirm at build time per project convention.
**Grade:** 1
**Standards covered:** 1.NBT.1 (count to 120 starting at any number), 1.NBT.2a-c (two-digit place value — tens/ones, special cases of 10, 11-19, and the decade numbers), 1.NBT.3 (compare two two-digit numbers using >, =, <), 1.NBT.4 (add within 100 — 2-digit + 1-digit, 2-digit + multiple of 10), 1.NBT.5 (mentally find 10 more/10 less than a number), 1.NBT.6 (subtract multiples of 10 in the range 10-90).
**Relationship to existing labs:** Supersedes MG2.tsx's unwired PartPartWhole component — that file predates the Unit-engine pattern and was never wired into practice; safe to treat this standard as uncovered.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Heavy use of ten-frames, base-ten blocks/bundles (tens-sticks and ones-cubes), and a hundred-chart/number line up to 120 throughout — place value is a visual, concrete concept at this age, and the tens/ones split should always be shown, not just stated, before any symbolic "24 = 2 tens + 4 ones" notation is required.

## Units

### Unit 1: Counting to 120
- **Goal:** Count forward to 120 starting from any number, not just from 1.
- **Standard:** 1.NBT.1
- **Buckets:**
  - Start counting from 1 (baseline sequence fluency)
  - Start counting from a mid-range number not at a decade boundary (e.g. start at 47)
  - Start counting across a decade boundary (e.g. start at 58, must correctly roll into 60s)
  - Start counting across the 99→100→101 transition (the hardest boundary: one more digit appears, and "ninety-ten" is a common wrong answer)
  - Start counting in the 100-120 range (naming/reading three-digit teens-pattern numbers like 110, 115)
- **Requires intro (CFU gate):** Yes — common misconception: students often say "ninety-ten," "ninety-eleven," etc. instead of "one hundred," and separately may not realize the pattern of "count the ones 1-9, then the tens word changes" repeats identically in every decade. CFU must include the 99→100 transition explicitly.
- **Memorization fact (periodic re-check candidate):** Yes — the count sequence itself (including irregular number names in English, e.g. "eleven/twelve" not following the teen pattern, and the decade-word changes) is exactly the kind of long-term-fluency fact 1.NBT.1 targets; set `reintroEverySolved` so the sequence, especially boundary transitions, gets periodically re-surfaced.

### Unit 2: Tens and Ones (Place Value)
- **Goal:** Understand that the two digits in a number like 24 mean 2 tens and 4 ones, and recognize the special number names in the teens and decades.
- **Standard:** 1.NBT.2a-c
- **Buckets:**
  - Standard two-digit decomposition, non-special case (e.g. 36 = 3 tens + 6 ones)
  - The special case of exactly 10 (1 ten + 0 ones — tests that "0 ones" isn't treated as "nothing there")
  - The special case of 11-19 (1 ten + some more ones — tests that students don't treat the teen word as unrelated to "ten and some ones," e.g. "fourteen" = 1 ten + 4 ones, not an arbitrary word)
  - The special case of exact decade numbers (e.g. 70 = 7 tens + 0 ones)
  - Reverse direction: given a tens/ones count (e.g. "5 tens and 2 ones"), name/write the number
- **Requires intro (CFU gate):** Yes — common misconception: students often think of "14" as just a word/symbol disconnected from "10 and 4 more," especially for the teens (11-19) where the English number names don't obviously say "ten" the way "twenty-four" obviously contains "twenty." CFU must explicitly test a teen number's tens/ones decomposition, not just a regular two-digit number.
- **Memorization fact (periodic re-check candidate):** No — place-value decomposition is meant to be understood/derived via base-ten blocks each time, not memorized as isolated facts; the count-sequence memorization is already covered in Unit 1.

### Unit 3: Comparing Two-Digit Numbers
- **Goal:** Decide whether one two-digit number is greater than, less than, or equal to another, and write it using >, =, <.
- **Standard:** 1.NBT.3
- **Buckets:**
  - Different tens digit (e.g. 42 vs 67 — comparison is decided by tens alone)
  - Same tens digit, different ones digit (e.g. 42 vs 45 — tests that students check ones only after confirming tens match, not just compare digit-by-digit left-to-right carelessly)
  - Equal numbers (e.g. 42 = 42 — tests that "=" is a real available answer, not a trick)
  - Numbers written with digits reversed as a near-miss distractor context (e.g. comparing 36 and 63 — tests that students don't just "see the same digits" and guess equal)
- **Requires intro (CFU gate):** Yes — common misconception: students sometimes compare the ones digit first or treat a number with "more digits that look big" as automatically bigger (e.g. assuming 63 > 36 is obvious without reasoning, which is coincidentally true here but for the wrong reason) rather than reasoning tens-first. CFU must include a same-tens-digit pair to force ones-digit comparison, and must require the student to explain/select WHY (tens first) not just the correct symbol.
- **Memorization fact (periodic re-check candidate):** No — this is a comparison procedure reasoned through via place value each time, not a memorized fact.

### Unit 4: Ten More, Ten Less, and Adding/Subtracting Tens
- **Goal:** Quickly find 10 more or 10 less than a number in your head, add a two-digit number and a multiple of ten, and subtract multiples of ten.
- **Standard:** 1.NBT.4, 1.NBT.5, 1.NBT.6
- **Buckets:**
  - Mental 10-more within a decade, no rollover (e.g. 23 + 10 = 33)
  - Mental 10-more crossing into a new decade cleanly from a round number is NOT a separate hard case here (tens digit always just increments by 1, since no rollover happens with +/-10 on a two-digit number) — instead, the hard case is 10-less from a number in the teens or low 20s, crossing back toward/through a lower decade (e.g. 23 - 10 = 13, or 12 - 10 = 2, where the tens digit drops to 0 and the number becomes single-digit)
  - Add a 2-digit number and a 1-digit number, no regrouping needed in the ones (e.g. 34 + 5)
  - Add a 2-digit number and a 1-digit number WITH ones regrouping (e.g. 38 + 5, ones sum exceeds 9 and rolls into the tens — the genuinely hard case for 1.NBT.4)
  - Add a 2-digit number and a multiple of ten (e.g. 34 + 20)
  - Subtract a multiple of ten from a number in range 10-90 (e.g. 70 - 30), including the case landing on an exact decade vs. the case starting mid-decade (e.g. 45 - 20 = 25, tens change but ones stay put — tests the student isn't just subtracting from the whole number by brute counting)
- **Requires intro (CFU gate):** Yes — common misconception: for 10-more/10-less, students often re-count by ones from scratch instead of just changing the tens digit, defeating the point of the mental-math standard; for the regrouping-addition case, students often forget to adjust the tens digit when the ones total passes 9 (e.g. answering "38 + 5 = 33" by just writing 3 ones instead of carrying). CFU must include one 10-less case crossing a decade and one ones-regrouping addition case.
- **Memorization fact (periodic re-check candidate):** No — these are mental-math strategies tied to place-value reasoning, meant to be reasoned through quickly rather than memorized as isolated facts.

## Open questions / flags for the builder
- 1.NBT.4/5/6 are grouped into one unit (Unit 4) because they're all "use place value to move by tens" skills that build on the same mental model; if the builder judges the regrouping-addition bucket needs its own dedicated CFU/Explore pass (it's arguably the hardest single idea in this whole lab), splitting Unit 4 into "Ten More/Ten Less" and "Adding and Subtracting Tens" is reasonable — flagging rather than deciding.
- Suggest the hundred-chart (0-120 grid) be the primary shared Explore diagram across Units 1, 3, and 4 (counting, comparing by position, and moving by tens are all visually obvious on the same chart) — worth checking `shared/diagrams/` for an existing number-grid component before building a new one.
