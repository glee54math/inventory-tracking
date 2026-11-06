# Language assessment of existing labs — 2026-11-05

A first check of every built lab against these guidelines. It's a starting
point to compare later checks against.

**Method.** A script pulled every student-facing string from the unit,
test and shell files of all labs (about 12,900 strings) and flagged:
sentences longer than the grade limit, passive voice, relative clauses,
"If…" openers, NOT, em-dash asides, parenthetical asides, words from a later
grade, trap words, and symbols the voice may misread. ${…} values were
replaced by a placeholder, so lengths are close but not exact. The flagged
sentences were then read by hand, and the grade-specific items (problem
types, vocabulary timing) were checked against CCSS.

Grade per lab (from the standards each lab cites): MK1–MK4 = K, MG1–MG4 =
1st, MG5 = 2nd, MG6–MG7 = 3rd, MG8–MG9 = 4th, MG11 = 5th, MM1 = 6th.

## Verdict

**The 4th–6th grade labs are in good shape. The K–2 labs have a serious
language problem.** In K–2, the English is often several grades above the
student. It is worst in the Unit Tests and the Explore text, which haven't
had the Kindergarten rewrite that the MK1–MK4 CFUs got. The problem shrinks
steadily with grade: the older labs were written in a style that suits older
students, and that style was carried down to the younger ones.

## Scorecard

"Task text" = prompts, stories, hints, Show me. "Explore/CFU" = Explore and
CFU paragraphs. % = share of strings with a sentence over the grade's
working limit.

| Lab | Grade (limit) | Task text over | Explore/CFU over | Main issues |
|---|---|---|---|---|
| MK1 Counting & Cardinality | K (8) | 28% | 52% | true/false in Tests; "numeral," "symbol," "digit" |
| MK2 Add/Subtract & Teen Numbers | K (8) | 46% | 67% | "partner" (14), "symbol," "digit"; true/false; long hints |
| MK3 Measurement & Classifying | K (8) | 41% | 61% | "attribute" (7), "compare"; true/false |
| MK4 Shapes | K (8) | 50% | 62% | long stories and hints ("solid cousin") |
| MG1 Add & Subtract within 20 | 1st (10) | 32% | 77% | 22 true/false; CFUs still old-style; 153 dash asides |
| MG2 Place Value to 120 | 1st (10) | 22% | 66% | true/false Tests (up to 29 words); 113 dash asides |
| MG3 Measurement, Time & Data | 1st (10) | 48% | 73% | 27-word time questions; "even though" |
| MG4 Shapes & Fractions Intro | 1st (10) | 33% | 73% | passive voice (39); NOT (10) |
| MG5 Even/Odd & Arrays | 2nd (12) | 14% | 74% | true/false (20 in Tests across MG5); passive (37) |
| MG5 Extending Add & Subtract | 2nd (12) | 17% | 68% | 25-word regrouping prompts; parentheses |
| MG5 Measurement, Money & Data | 2nd (12) | 10% | 76% | "rolls over" time hints; passive (28) |
| MG5 Place Value to 1000 | 2nd (12) | 5% | 53% | mostly OK |
| MG5 Shapes & Equal Shares | 2nd (12) | 25% | 74% | 24-word "Which shape (A-C)…"; passive (30) |
| MG6 Area & Perimeter | 3rd (15) | 8% | 44% | long true/false Test items |
| MG6 Fractions Foundations | 3rd (15) | 12% | 67% | passive (67: "is split into") |
| MG6 Place Value & Fluency | 3rd (15) | 18% | 59% | 28–39-word carry/borrow hints |
| MG7 Division & Word Problems | 3rd (15) | 11% | 59% | 32-word true/false; "remainder" early |
| MG7 Multiplication Foundations | 3rd (15) | 3% | 56% | "times as many" (4th grade); property names |
| MG7 Quadrilaterals & Partitioning | 3rd (15) | 14% | 45% | NOT (12); 15 true/false |
| MG7 Time, Measurement & Data | 3rd (15) | 6% | 63% | OK task text |
| MG8 (all five labs) | 4th (18) | 1–3% | 23–27% | passive in Angles (27); fine overall |
| MG9 (all six labs) | 4th (18) | 0–8% | 20–42% | a few 21-word hints; fine overall |
| MG11 Geometry / Mult-Div Fractions | 5th (20) | 0–6% | 5–25% | a few 22–25-word decimal hints |
| MM1 Ratio / Negatives / Exponents | 6th (25) | 0% | 3–30% | passive in Exponents (42); fine overall |

## Findings, most important first

### 1. K–2 Unit Tests still ask long true/false "always" questions — Major
K–2 Tests are where a student shows what they learned, and they're the
least readable part of the K–2 labs. The questions are 20–38 words, abstract,
and about logic ("always," "every," "any"), which reading research puts
years later. The builder already bans true/false for K–1.
- Counts in Test files: MK1 4, MK2 7, MK3 5, MK4 3, MG1 10, MG2 7, MG4 4,
  MG5 20.
- Examples:
  - MK1 `WritingAndMatchingNumeralsTest.tsx:141` (29 words, K): "True or
    false: every pair of numerals people mix up (like 6 and 9, or 2 and 5)
    turns into the other one when you turn it upside down."
  - MK2 `WordProblemsWithin10Test.tsx:99` (30 words, K): "…you can always
    subtract to find the other part — even if the story never says 'take
    away.'"
  - MG1 `MakingTenAndDecomposingTest.tsx:187` (38 words, 1st).
  - MG2 `TensAndOnesTest.tsx:153` (27 words, 1st): "N's ones digit (0) is
    real information — it means there are exactly 0 loose ones…"
- **Fix:** give the Tests the same treatment as the K CFUs: one short
  question with a picture ("Turn the 2 upside down. Is it a 5?" with the
  picture). For 2nd grade, keep the trap but cut it to 12 words and show it.

### 2. K–2 Explore and CFU text is two to three grades too hard — Major
The median Explore/CFU sentence is 16–20 words in K–2 labs, against a limit
of 8–12. Between 52% and 77% of those strings run over. A non-reader
depends on the voice, and a 25-word spoken sentence is too long to hold on
to.
- MK1 `CountingOnAndForward.tsx:439`: "Counting means saying numbers in
  order, each one exactly one more than the last — you can start at 1, or
  start anywhere someone tells you." (25 words, K)
- MG1's CFUs are still the old design (`TapSelect` true/false and paragraphs),
  e.g. `AddToTakeFromWordProblems.tsx:140`. This matches the memory note that
  only MK1–MK4 got the K design so far.
- **Fix:** one idea per sentence, 8 words or fewer for K and 10 for 1st;
  turn each Explore paragraph into 2–3 short spoken lines tied to the picture.

### 3. K–1 Practice prompts and hints run long — Major
28–50% of task strings in MK1–MK4 and MG1–MG4 run over the limit. Hints
matter most, because a stuck student hears the hint at the moment they're
most overloaded.
- MK4 `FlatOrSolid.tsx:281` (20 words, K): "This N shape can look a lot like
  its solid cousin in a picture — look closely: no shading at all."
- MK2 `DecomposingNumbers.tsx:197` (22 words, K): "The two parts together
  make the whole number — count carefully, there are more pairs to keep
  track of with a bigger number."
- MG3 `TellingTime.tsx:323` (27 words, 1st): "Even though the hour hand
  looks closer to N, is this time still inside the N o'clock hour, or has it
  already become the N o'clock hour?" The same question appears in MG5
  (20 words) and MG7.
- **Fix:** hints follow the builder's "action that points at the picture"
  rule *and* the grade limit: "Look at the shading." / "Count the dots in
  each part."

### 4. Kindergarten labs use words K students don't know — Major
- MK1: "numeral" (34 times), plus "symbol" and "digit" in hints
  (`WritingAndMatchingNumeralsTest.tsx:25`, "Think of the symbol, not the
  word."; `:37`, "Teen numbers are written as two digits.").
- MK2: "partner" (14) on the "Make 10" screens (`MakingTen.tsx:136–149`);
  "symbol" (`PuttingTogetherAndTakingApartTest.tsx:141`); "digit"
  (`TeenNumbers.tsx:145`).
- MK3: "attribute" (7), e.g. `ClassifyingAndCountingByCategory.tsx:342`.
- The builder already bans "partner," "symbol" and "attribute" for K. These
  are left over from before that rule.
- **Fix:** "number" for numeral; "the number that makes 10 with 3" for
  partner; "color, shape or size" for attribute.

### 5. 3rd grade teaches a 4th-grade comparison and a keyword — Major
- MG7 Multiplication Foundations uses "times as many" (12 times),
  e.g. `MultiplicationWordProblems.tsx:330`: "N has N times as many N as N."
  Multiplicative comparison is 4.OA.1–2, and MG8 teaches it properly in 4th.
- It also teaches it as a keyword (`MultiplicationWordProblems.tsx:143`):
  "'Times as many' is a multiplication clue." Keyword rules break later
  (math-language-traps.md §9).
- **Fix:** drop the compare type from 3rd-grade Practice and Test (equal
  groups, arrays and area are the 3rd-grade types, CCSS Table 2), or keep it
  as an Explore preview only.

### 6. 3rd grade requires property names the standard says aren't needed — Minor
3.OA.5 says students apply the properties but "need not use formal terms."
MG7 asks for them: `PropertiesOfMultiplicationTest.tsx:194`, "Use the
distributive property to find…", and `:127`. **Fix:** "Split N into two
parts. Multiply each part. Add."

### 7. "Remainder" appears in 3rd grade — Minor
MG7 `UnknownFactor.tsx:116, 267, 280` and its Test use "remainder," which
CCSS brings in at 4.NBT.6. The math (no whole-number answer) is fine; the
word is early. **Fix:** "4 doesn't go into 25 evenly. 1 is left over."

### 8. Dash and parenthesis asides double sentence length in K–2 — Minor
Em-dash asides appear 27–153 times per K–2 lab (MG1 153, MG5 Shapes 116,
MG2 113). Each one adds a second idea to a sentence. Read aloud, the dash
is a short pause, and young listeners lose the first half.
**Fix:** split at the dash into two sentences.

### 9. Passive voice in fractions and shapes — Minor
MG6 Fractions Foundations (67: "The line between 0 and 1 is split into N
equal parts…"), MG4 (39), MG5 Even/Odd (37), MG5 Shapes (30). **Fix:**
active voice ("Someone split the line into N equal parts" / "The line has
N equal parts").

### 10. MG1 requires start-unknown stories for mastery — design question
MG1's Add To / Take From unit has a start-unknown bucket in
`requiredBuckets` and the CFU's main trap (`AddToTakeFromWordProblems.tsx:16`).
CCSS has 1st graders *work with* start unknown but only *master* it in 2nd.
It isn't wrong; it's the hardest story type, made required a year early.
Your call whether to keep it required.

### 11. "Sum" in 1st-grade voiced text — Polish
"Sum" sounds like "some." MG1 uses it in hints
(`EqualSignAndEquations.tsx:315`, `FluencyFactsWithin20.tsx:408`). Show
the word or say "the total" until the word is taught with a picture.

## What's working
- **Grades 4–6 read well.** Task text is almost never over the limit (0–8%),
  hints are short and direct, and the vocabulary matches the grade.
  MM1 Ratio is the cleanest lab in the repo.
- **MK1–MK4 CFUs** (the Kindergarten design) meet the K limits. The problem
  is the rest of each lab, not the CFU.
- **MG8's multiplicative comparison** sets "times as many" against "more
  than," as the guidelines recommend.
- **No voice problems found in the newer labs**: no ranges, "vs." or arrows in
  MK1 after this session's fixes.

## What this check couldn't do
- The script counts words; it can't tell if a long sentence is easy
  (a list of numbers) or hard (nested clauses). Every finding above was read
  by hand, but the per-lab percentages are approximate.
- It doesn't check whether the picture alone carries the problem, which
  matters as much as the words for K–1.
- Homophones and double meanings were only checked for a few words.
- No students were involved. A real check is a 1st grader using the lab
  while you watch for where they stop.

## Suggested order to fix
1. K–2 Unit Tests (finding 1) — the graded part, and the furthest off.
2. MG1 CFUs into the K design (finding 2), already planned.
3. K–1 hints and Explore text to the length limits (findings 2–3).
4. The K vocabulary (finding 4) and MG7's "times as many" (finding 5).
5. The rest as each lab is next opened.
