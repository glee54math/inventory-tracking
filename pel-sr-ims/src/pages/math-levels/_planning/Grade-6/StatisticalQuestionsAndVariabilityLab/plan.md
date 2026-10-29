# StatisticalQuestionsAndVariabilityLab

**Proposed slot:** MM2 — provisional, confirm at build time per project convention.
**Grade:** 6
**Standards covered:** 6.SP.1 (recognize a statistical question as one anticipating variability in the data), 6.SP.2 (understand a data set's distribution can be described by center, spread, and overall shape), 6.SP.3 (recognize a measure of center summarizes with a single number, a measure of variation describes spread with a single number).
**Relationship to existing labs:** No existing coverage anywhere in the codebase. This is the FIRST statistics content in the entire K-8 curriculum built so far — nothing in K-5 (`K.MD`, `1.MD`, `2.MD`, `3.MD`, `4.MD`, `5.MD`) covers statistical questions, distributions, or variability conceptually; the K-5 Measurement & Data standards only teach reading/building bar graphs, picture graphs, and line plots as literal data-display mechanics, never the idea that data varies and that a "statistical question" is a distinct category of question. Builder should not assume any prior exposure to these ideas at all, including vocabulary like "distribution," "center," "spread," or "shape." This lab is itself a prerequisite for `DisplayingAndSummarizingDataLab` (6.SP.4-5) — sequence this one first.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Statistics is a genuinely new way of thinking for most 6th graders — reasoning about variability and uncertainty rather than hunting for one single correct answer. Explore sections especially should let the student generate and compare real-feeling data sets (e.g. roll dice, pick survey-style values) side by side rather than just presenting definitions and a static example; the first real "aha" in this strand is seeing with your own hands that repeating the same question produces different-but-patterned data, not identical answers.

## Units

### Unit 1: What Makes a Question "Statistical"?
- **Goal:** Tell the difference between a question with one fixed answer and a statistical question — one where you'd expect the answers to vary.
- **Standard:** 6.SP.1
- **Buckets:** classify a question as statistical vs. not-statistical, varying the TOPIC so students can't just pattern-match by subject (e.g. "How old is the principal?" is not statistical; "How old are the teachers at this school?" is); classify a pair of near-identical questions about one person vs. a group on the same topic, to isolate that it's the expectation of variability — not the topic — that makes a question statistical; given a non-statistical question, rewrite it into a statistical one; given a statistical question, identify the specific attribute that is expected to vary.
- **Requires intro (CFU gate):** Yes. Named misconception: students classify by surface features — "it has a number in the answer" or "it's about measurements" — rather than by whether multiple different answers are expected across individuals/instances; a numeric fixed fact ("How many days in a week?") is a useful trap case here since it has a number but zero variability.
- **Memorization fact (periodic re-check candidate):** No — first-exposure conceptual distinction, re-derivable by asking "would everyone answer the same?"

### Unit 2: Describing a Distribution — Center, Spread, and Shape
- **Goal:** Describe what a set of data looks like using three different lenses together: where it's centered, how spread out it is, and its overall shape.
- **Standard:** 6.SP.2
- **Buckets:** describe the overall shape of a displayed data set (symmetric, skewed to one side, clustered with gaps) in words; describe its center informally ("most values cluster around..."); describe its spread informally ("values range from... to...", "tightly bunched" vs "spread wide"); compare two different data sets' shapes and spreads side by side and say which is more spread out / more symmetric — a genuinely different reasoning task from describing one set alone.
- **Requires intro (CFU gate):** Yes. Named misconception: students treat a data set as having only ONE describable feature (usually just "the average"), rather than three complementary, independent descriptors that must all be reported together; a second common conflation is mistaking "spread" for "the biggest value" rather than how far apart the values are from each other.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 3: Center vs. Variability — Two Different Questions
- **Goal:** Understand that a measure of center answers "what's typical?" with one number, while a measure of variation answers "how much do the values differ?" with a different number — and that a data set needs both to be understood.
- **Standard:** 6.SP.3
- **Buckets:** given a question about a data set, classify it as asking about center vs. about variation; match a described single-number summary to which of the two questions it answers (a vocabulary-pairing bucket, since "measure of center" and "measure of variation" are the two terms most likely to be used interchangeably); given two data sets with the SAME center but visibly different spread (or vice versa — same spread, different center), explain why one number alone can't describe both sets; generate-and-compare: build two data sets with a matching center but different spread and observe the difference directly (Explore-driven, ties to the audience framing above).
- **Requires intro (CFU gate):** Yes. Named misconception: students think "the average" tells you everything worth knowing about a data set and don't expect that a second, independent number (spread) is needed — this should be tested by presenting two data sets that share a center but clearly do not "feel" the same.
- **Memorization fact (periodic re-check candidate):** No.

## Open questions / flags for the builder
- This standard set is entirely conceptual/vocabulary-first with no computation yet (mean/median/IQR/MAD arithmetic is deliberately deferred to `DisplayingAndSummarizingDataLab`, 6.SP.5). Resist the temptation to introduce formulas here even informally — Unit 3's "measure of center" and "measure of variation" should stay at the level of "a number exists that answers this question," not "here's how to calculate it."
- Since there is zero prior exposure to build on, Explore in Unit 1 may need a slightly longer free-play phase than typical (e.g. letting the student submit several of their own candidate questions and get them classified) before the CFU gate — flagging this as a possible deviation from the usual Explore length, to confirm feels right once built.
- No existing practice history predates this lab (brand new, no grandfathering concern).
