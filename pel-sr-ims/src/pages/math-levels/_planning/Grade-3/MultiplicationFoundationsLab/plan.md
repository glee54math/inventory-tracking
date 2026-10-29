# MultiplicationFoundationsLab

**Proposed slot:** MG7 — provisional, confirm at build time per project convention.
**Grade:** 3
**Standards covered:** 3.OA.1 (interpret products of whole numbers as equal groups), 3.OA.3 (use multiplication within 100 to solve word problems involving equal groups, arrays, and measurement quantities — multiplication side), 3.OA.5 (apply commutative, associative, and distributive properties of multiplication, need not name them formally), 3.OA.7a (fluently multiply within 100; know all products of two one-digit numbers from memory by end of grade), 3.OA.9 (identify arithmetic patterns in the multiplication table, explain them using properties of operations).
**Relationship to existing labs:** MG7 already hosts a wired, functioning component `Nx1DigitMultiplication` (plus an authored-but-unwired `Nx1VertMult`) covering 3-digit × 1-digit multiplication via an area model — that is the 3.NBT.3-adjacent ALGORITHM for multi-digit multiplication. This lab is the conceptual/fact-fluency side of multiplication (3.OA): what multiplication MEANS (equal groups, arrays), its properties, and one-digit fact fluency. There is no overlap in scope, and this lab should sequence BEFORE `Nx1DigitMultiplication` in the student's path — a student needs to understand what multiplication is and have one-digit facts solid before applying a multi-digit algorithm to it.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Multiplication-as-a-new-operation is one of the hardest conceptual leaps in grade 3 — every new idea must be grounded in a visual model (equal-groups pictures, arrays) before any bare symbolic "a × b" practice, and the Explore sections need explicit checks for understanding of what the factors and product each represent (not just "get the right number").

## Units

### Unit 1: What Multiplication Means (Equal Groups and Arrays)
- **Goal:** You will be able to look at a picture of equal groups or a rectangular array and write the multiplication fact it shows, and explain what each number in "3 × 4" means.
- **Standard:** 3.OA.1
- **Buckets:**
  - Equal Groups, Unknown Product — given number of groups and group size (as a picture), find the total
  - Arrays/Area, Unknown Product — given a rectangular array (rows × columns) or area-model picture, find the total
  - Reverse direction: given a product and ONE factor, select/build the matching equal-groups picture (distinguishing "3 groups of 4" from "4 groups of 3" — same product, different picture)
  - Translate a picture to the equation AND the equation to a picture (both directions), including correctly identifying which factor is "number of groups" vs. "size of each group" in a given array/groups scenario
- **Requires intro (CFU gate):** Yes — new operation entirely; common misconception is treating "3 × 4" and "4 × 3" as depicting the identical picture (they're numerically equal but represent different equal-groups scenarios — e.g. 3 plates of 4 cookies looks different from 4 plates of 3 cookies even though both total 12), and confusing which factor in an array is rows vs. columns.
- **Memorization fact (periodic re-check candidate):** No — this unit is building the concept itself (what multiplication represents), which a student should always be able to re-derive from a picture; it's the raw facts in Unit 4 that get memorized, not this interpretive skill.

### Unit 2: Properties of Multiplication (Commutative, Associative, Distributive)
- **Goal:** You will be able to use the order of factors, grouping of factors, and breaking-apart of factors to make multiplication easier, and explain why these tricks always work.
- **Standard:** 3.OA.5
- **Buckets:**
  - Commutative property — show/verify that a × b = b × a using an array rotated 90° (same array, different "reading direction")
  - Associative property — regroup three factors (e.g. (2×3)×4 = 2×(3×4)) to make the multiplication easier
  - Distributive property — break one factor apart to multiply easier chunks (e.g. 6×7 = 6×5 + 6×2), shown by physically splitting an array into two smaller arrays
  - True/false generalization: given a worked example of one property, decide whether the SAME property holds for a new, unseen pair/triple of numbers — not just confirming the one demonstrated case
- **Requires intro (CFU gate):** Yes — properties are easy to "see once and forget"; common misconception is thinking the distributive property only works for the specific split shown (e.g. only splitting into 5+2) rather than any valid split, and confusing commutative (reorder two factors) with associative (regroup three).
- **Memorization fact (periodic re-check candidate):** No — these are reasoning tools a student re-derives by picturing the array each time, not facts to recall from memory; the distributive-property SPLIT itself is a strategy, not a fixed fact.

### Unit 3: Multiplication Word Problems (Equal Groups, Arrays, Measurement)
- **Goal:** You will be able to read a word problem about equal groups, arrays, or measurement quantities and write and solve the multiplication equation it describes.
- **Standard:** 3.OA.3
- **Buckets:** (crossing CCSS's own situation types — Equal Groups / Arrays-Area / Compare — with Unknown Product, since this unit is the multiplication/forward-direction side; the Group-Size-Unknown and Number-of-Groups-Unknown versions of these same situations live in the division lab)
  - Equal Groups, Unknown Product — "4 bags with 6 apples each, how many apples total?"
  - Arrays/Area, Unknown Product — "a garden has 5 rows of 8 plants, how many plants total?" / tiling-style area problems
  - Measurement quantities, Unknown Product — "each jump rope is 3 feet long, how many feet of rope for 7 jump ropes?" (same structure as Equal Groups but with a measured unit, which CCSS calls out as a distinct quantity type worth its own bucket)
  - Multiplicative Compare, Unknown Product (informal, "twice as many," without the formal 4.OA.1 comparison-equation language) — e.g. "Maya has 3 stickers, Jo has 4 times as many, how many does Jo have?" introduced only informally here, not as its own named concept
- **Requires intro (CFU gate):** Yes — the first time students must choose multiplication FROM a word problem (rather than being told to multiply) rather than just computing a given expression; common misconception is defaulting to addition because "equal groups" sounds additive, or picking the wrong factor as "number of groups" from problem wording.
- **Memorization fact (periodic re-check candidate):** No — word-problem interpretation is reasoning applied fresh to new contexts each time, not a fixed fact.

### Unit 4: One-Digit Multiplication Facts (Fluency and Memory)
- **Goal:** You will be able to quickly recall the product of any two one-digit numbers without needing to count or draw a picture.
- **Standard:** 3.OA.7a
- **Buckets:**
  - Facts with 0, 1, 2, 5, 10 as a factor (the "easy anchor" facts, taught first as a foundation)
  - Facts with 3, 4 as a factor (doubling-based strategies)
  - Facts with 6, 7, 8, 9 as a factor, excluding squares (the genuinely hardest, most-forgotten facts — e.g. 7×8, 6×9)
  - Square facts (n×n for n = 2 through 9) as their own bucket, since they're disproportionately useful anchors but easy to blank on
  - Near-miss fact confusion check — e.g. distinguishing 6×7=42 from 6×8=48 (adjacent-fact collisions are the real-world error, not random wrong answers)
- **Requires intro (CFU gate):** Yes — this is the unit where the lab explicitly introduces strategy-based recall (doubling, anchor facts, the square-facts trick) rather than assuming facts arrive by rote; CFU should confirm the student understands at least one derivation strategy (e.g. "if you forget 6×7, how could you figure it out fast from a fact you do know?") before leaning on pure drill.
- **Memorization fact (periodic re-check candidate):** Yes — 3.OA.7 explicitly calls for knowing all one-digit products from memory by end of grade; this is the canonical `reintroEverySolved` case, since a student who once drilled 7×8 correctly can still lose it months later without periodic re-surfacing.

### Unit 5: Patterns in the Multiplication Table
- **Goal:** You will be able to spot and explain patterns in the multiplication table, like why every column for an even number is all even, or why the 9s column counts down by one in the ones place.
- **Standard:** 3.OA.9
- **Buckets:**
  - Even/odd patterns (any row/column with an even factor is entirely even; odd×odd is odd)
  - Skip-counting patterns within a single row/column (e.g. the 5s column: 5, 10, 15, 20... each +5)
  - The 9s-column digit pattern (tens digit goes up by 1, ones digit goes down by 1 each step) and the "digits sum to 9" property
  - Symmetry across the diagonal (the table mirrors itself because a × b = b × a) — ties back to Unit 2's commutative property as the EXPLANATION for the pattern, not just an observed coincidence
  - Explain-why generalization questions: given a pattern observed in 2-3 rows, predict whether it continues and justify using a property from Unit 2 (not just "it looks like it")
- **Requires intro (CFU gate):** Yes — the standard specifically requires EXPLAINING patterns using properties of operations, not just noticing them; common misconception is treating a pattern as a magic coincidence ("9s are just special") instead of connecting it to the properties learned in Unit 2.
- **Memorization fact (periodic re-check candidate):** No — pattern explanation is reasoning connected to properties already covered; nothing new here needs rote memorization beyond what Unit 4 already covers.

## Open questions / flags for the builder
- Unit 1 and Unit 3 both use equal-groups/array pictures; keep Unit 1's focus strictly on "what does this picture/equation mean" (interpretation) and Unit 3's focus strictly on "which operation does this STORY need" (word-problem translation) to avoid bucket overlap.
- Sequencing MultiplicationFoundationsLab and the existing `Nx1DigitMultiplication`/`Nx1VertMult` both under MG7 means MG7 will host two lab entries; confirm with the user whether this new lab becomes `MG7`'s FIRST subsection (appearing before the existing multi-digit algorithm component in the level's nav) since the plan assumes that ordering but the actual nav/registration order is a `levelSubsections.ts` decision outside this plan's scope.
- Unit 4's fact-fluency drill may end up large in scope (all one-digit × one-digit pairs); the builder should decide whether Practice samples a rotating subset per session rather than every combination every time, consistent with how other fact-fluency units in this codebase are paced (check `2.OA.2`-style sibling labs in Grade-2 if any exist as precedent).
