# RandomSamplingAndInferencesLab

**Proposed slot:** MM3 — provisional, confirm at build time per project convention.
**Grade:** 7
**Standards covered:** 7.SP.1 (understand statistics gain population information from a sample, generalizations are valid only for representative samples, random sampling tends to produce representative samples), 7.SP.2 (use data from a random sample to draw inferences about a population, generate multiple samples to gauge variation, estimate how far off an estimate might be), 7.SP.3 (informally assess visual overlap of two numerical distributions with similar variability, express the center difference as a multiple of a variability measure), 7.SP.4 (use center/variability measures from random samples to draw informal comparative inferences about two populations)
**Relationship to existing labs:** Direct sequel to grade 6's StatisticalQuestionsAndVariabilityLab and DisplayingAndSummarizingDataLab (planned in a separate batch for the Grade-6 folder, may or may not exist yet when this is built) — assumes the student can already compute center (mean/median) and variability (range/IQR/MAD) measures for a single data set. This lab's job is sampling methodology (is this sample trustworthy, and how much might it be off) and COMPARING two data sets against each other, neither of which the grade 6 prerequisite labs cover.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Sampling bias and sample-to-sample variation are abstract ideas for a first-timer — ground them in a concrete, repeatable population the student can mentally (or visually, via Explore) draw multiple samples from, e.g. a jar of colored marbles or a list of named students with known attributes, rather than only discussing sampling in the abstract.

## Units

### Unit 1: What Makes a Sample Representative
- **Goal:** Understand that a sample only tells you about the whole population if it was chosen fairly, and that picking randomly is the best way to get a fair sample.
- **Standard:** 7.SP.1
- **Buckets:**
  - identify a biased (non-random) sampling method and name the specific bias (e.g. surveying only people leaving a gym about exercise habits, surveying only the front row of a classroom)
  - identify a random/representative sampling method and confirm it as valid
  - a "looks random but isn't" trap (e.g. "every 10th person in line" when the line is itself sorted in a way that correlates with the attribute being measured)
  - given a conclusion drawn from a sample, judge whether the generalization to the full population is valid or overreaching based on how the sample was chosen
- **Requires intro (CFU gate):** yes — this is brand-new vocabulary (population vs. sample, "representative") with a real, named misconception: students often think ANY sample generalizes to the population as long as it's "big enough," missing that a large but biased sample is still invalid. At least one CFU question should present a LARGE biased sample next to a SMALL random sample and ask which is more trustworthy, so size and randomness can't be conflated.
- **Memorization fact (periodic re-check candidate):** no — this is a judgment/reasoning skill applied fresh to each scenario, not a fact to memorize.

### Unit 2: Estimating a Population from a Sample, and How Far Off You Might Be
- **Goal:** Use one sample to estimate something about a whole population, then see how taking several different samples shows the estimate isn't exact — it varies.
- **Standard:** 7.SP.2
- **Buckets:**
  - compute a single-sample estimate (a proportion or mean) and project it onto the full population size (e.g. "18 of 50 sampled students prefer X, so estimate the number among all 600 students")
  - given several different random samples from the SAME population, observe the resulting estimates vary, and describe the spread of those estimates as the margin of likely error
  - given a described sampling process (sample size, method), judge whether increasing the sample size would likely tighten or loosen that variation
  - a "small sample gave a wildly different result" edge case, so the student sees under-sized samples produce bigger swings, not just a uniformly small wobble
- **Requires intro (CFU gate):** yes — the specific misconception is treating one sample's estimate as the exact population value rather than an estimate with uncertainty; a CFU question should show two samples giving different estimates from the same population and ask the student to reconcile that both can be legitimate rather than concluding one sample must be "wrong."
- **Memorization fact (periodic re-check candidate):** no — estimating and reasoning about variation is re-derived from the specific samples given each time.

### Unit 3: Comparing Two Distributions Visually
- **Goal:** Look at two sets of data side by side (e.g. two dot plots) and judge how much they overlap, and whether their difference in typical value is big or small compared to how spread out each group is.
- **Standard:** 7.SP.3
- **Buckets:**
  - two distributions with LOW visual overlap (clearly separated) — judge the difference as large/significant
  - two distributions with HIGH visual overlap (largely on top of each other) — judge the difference as small/not very distinguishable, even if their means differ slightly
  - compute the center difference as a multiple of a variability measure (e.g. "the means differ by about 2 MADs") and connect that number back to the visual overlap judgment
  - a "means differ a lot in raw units, but variability is also huge" case where a naive look at the raw mean gap alone would overstate the difference — the multiple-of-variability calculation is what reveals the difference isn't actually that remarkable
- **Requires intro (CFU gate):** yes — the specific, nameable misconception is judging two groups as "very different" purely because their means differ, without accounting for how spread out (variable) each group is; a CFU question should present two pairs of distributions with the SAME raw mean gap but different variability, and ask which pair shows the more meaningful difference.
- **Memorization fact (periodic re-check candidate):** no — reasoning from the specific distributions shown, re-derivable each time.

### Unit 4: Drawing Comparative Inferences from Two Random Samples
- **Goal:** Use the center and variability measures from two random samples to make an informal claim about which of two populations tends to be higher (or more/less consistent), and justify how confident that claim can be.
- **Standard:** 7.SP.4
- **Buckets:**
  - straightforward case: two samples with clearly different centers and similar, moderate variability — support a confident comparative claim
  - cautious case: two samples with overlapping ranges/high variability relative to their center difference — the correct answer is that the claim is weak or uncertain, not a confident one
  - a scenario requiring the student to choose WHICH measure (center or variability) is more relevant to the specific real-world question being asked (e.g. "which team scores more on average" vs. "which team is more consistent")
  - a combined case tying back to Unit 3's overlap/multiple-of-variability reasoning as the justification for the inference, so this unit isn't computed in isolation from Unit 3's judgment skill
- **Requires intro (CFU gate):** yes — the specific misconception is treating any center difference as meaningful regardless of sample size or variability (echoing Units 2 and 3); a CFU question should require the student to both make a comparative claim AND state how confident it is, explicitly tying magnitude of difference to variability rather than just reporting "A is bigger than B."
- **Memorization fact (periodic re-check candidate):** no — applied comparative reasoning, re-derived from the specific pair of samples each time.

## Open questions / flags for the builder
- This lab assumes the Grade-6 StatisticalQuestionsAndVariabilityLab / DisplayingAndSummarizingDataLab will already exist (or be built first) so students arrive able to compute mean/median/range/IQR/MAD without re-teaching those from scratch. If those grade-6 labs are NOT yet built by the time this lab is built, the builder should flag that as a real prerequisite gap rather than silently re-deriving center/variability computation inside this lab's Explore sections.
- Unit 3 and Unit 4 are closely related (visual overlap vs. formal comparative inference) and could arguably be merged into one unit with more buckets; kept as two units here because 7.SP.3 (visual/informal) and 7.SP.4 (measure-based/compound inference) are distinct standard sub-parts with their own CFU-worthy misconceptions. Flag for the user if they'd prefer a 3-unit structure instead.
- Exact numeric design for "how far off an estimate might be" (7.SP.2) is left to the builder — whether to introduce any formal margin-of-error number or keep it fully qualitative (just showing variation across several drawn samples) is a pedagogical choice not dictated by the standard text itself; recommend staying qualitative given the no-prior-probability-or-stats-formula audience constraint.
