# ProbabilityLab

**Proposed slot:** MM3 — provisional, confirm at build time per project convention.
**Grade:** 7
**Standards covered:** 7.SP.5 (understand probability as a number 0-1 expressing likelihood, larger = more likely), 7.SP.6 (approximate a chance event's probability via long-run relative frequency, predict relative frequency given a probability), 7.SP.7a (develop a uniform probability model by assigning equal probability to all outcomes, use it to find probabilities and compare to observed frequencies), 7.SP.7b (develop a probability model, possibly non-uniform, by observing frequencies from a chance process, use it to find probabilities and explain discrepancies), 7.SP.8a (understand compound-event probability as the fraction of matching outcomes in the sample space), 7.SP.8b (represent sample spaces for compound events using organized lists/tables/tree diagrams, identify outcomes matching an everyday-language event description), 7.SP.8c (design/use a simulation to generate frequencies for compound events)
**Relationship to existing labs:** No existing coverage anywhere in the codebase — this is the FIRST probability content in the entire curriculum. The existing statistics labs (StatisticalQuestionsAndVariabilityLab, DisplayingAndSummarizingDataLab, RandomSamplingAndInferencesLab) cover data/distributions and sampling, not chance/likelihood; there is no prerequisite relationship to any built or planned lab.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Probability is a brand-new domain for these students — ground every concept in physically simulable scenarios (spinners, dice, coin flips, marbles in a bag) that the Explore tab can actually let a student run and observe (spin/roll/flip/draw buttons producing a visible outcome and a running tally), not just describe abstractly. Every unit's Explore should let the student generate real trials before any formula or fraction is introduced.

## Units

### Unit 1: Probability as a Number from 0 to 1
- **Goal:** Learn that probability is a number between 0 and 1 (or 0% and 100%) that says how likely something is — 0 means impossible, 1 means certain, and bigger numbers mean more likely.
- **Standard:** 7.SP.5
- **Buckets:**
  - identify/place an event's likelihood at the impossible (0) or certain (1) extreme, given a concrete scenario (e.g. "rolling a 7 on a standard die" vs. "rolling a number less than 7")
  - compare two events' probabilities (as fractions, decimals, or percents) and correctly judge which is more likely using the "larger number = more likely" rule
  - convert a probability between fraction/decimal/percent form for the same event, so the 0-1 scale is recognized across representations, not just as one fixed format
  - a "close to 0 vs. close to 1" discrimination case (e.g. 0.05 vs. 0.95) to check the student reads the scale correctly rather than just recognizing the two extremes
- **Requires intro (CFU gate):** yes — this is the first probability content in the curriculum, with a real, named misconception: students often think probability must be expressed only as a fraction "out of" something, or confuse a LARGER denominator with a larger probability (e.g. assuming 1/10 > 1/3 because 10 > 3). A CFU question should put two fractions with different denominators in the same comparison so this can't be answered by eyeballing the denominator alone.
- **Memorization fact (periodic re-check candidate):** no — the 0-1 scale and its endpoints are a conceptual anchor re-derivable from reasoning ("can it never/always happen"), not a fact that decays like a formula.

### Unit 2: Experimental Probability and Long-Run Relative Frequency
- **Goal:** Learn that you can estimate how likely something is by actually doing the chance event many times and seeing what fraction of trials it happens — and that doing it MORE times gives a better estimate.
- **Standard:** 7.SP.6
- **Buckets:**
  - compute relative frequency from a given trial count/outcome count (e.g. "a spinner landed on red 18 out of 50 spins — what's the experimental probability of red?")
  - predict the expected NUMBER of occurrences in a longer run given a known or assumed probability (the reverse direction: probability → frequency, not just frequency → probability)
  - a small-trial-count case where the experimental result looks "off" from the expected probability (e.g. 3 heads in 4 flips of a fair coin), paired with a large-trial-count case of the same chance process converging closer to expected — so the student sees long-run behavior, not just one snapshot
  - a "which run is more trustworthy" comparison between a short run and a long run of the same process
- **Requires intro (CFU gate):** yes — the specific, named misconception here is the GAMBLER'S FALLACY: students often think a fair coin "owes" tails after several heads in a row, or that a short run "should" match the expected probability exactly. A CFU question should present a short streak (e.g. 4 heads in a row on a fair coin) and ask what's most likely on the NEXT flip, forcing the student to reject the "it's due" reasoning explicitly.
- **Memorization fact (periodic re-check candidate):** no — this is a conceptual/statistical-reasoning skill, not a memorized fact; long-run convergence is something the student re-derives by running more trials each time, not something to recall.

### Unit 3: Building and Testing a Probability Model
- **Goal:** Learn two ways to build a model for how likely each outcome of a chance process is — reasoning that all outcomes are equally likely, OR watching what actually happens and using those observed frequencies — and compare each model's predictions to what you actually see happen.
- **Standard:** 7.SP.7a and 7.SP.7b
- **Buckets:**
  - uniform model (7.SP.7a): assign equal probability to all outcomes for a fair/symmetric device (standard die, fair coin, evenly-divided spinner) and use it to find a probability
  - non-uniform model from observed frequency (7.SP.7b): build a model for a device that is NOT symmetric (a weighted die, an unevenly-divided spinner, a bag with unequal-colored marble counts) by observing trial frequencies, then use that model to find a probability
  - compare a uniform model's predicted probability to an observed-frequency result for the SAME device, and explain a discrepancy (e.g. "the model predicts 1/6 but we observed 1/4 in 20 rolls — is the die unfair, or is 20 rolls just not many?")
  - a "which model type applies" discrimination case: given a device's description, decide whether a uniform or observation-based model is appropriate BEFORE building it (e.g. a bent coin cannot be assumed uniform, but a brand-new six-sided die can)
- **Requires intro (CFU gate):** yes — the specific, named misconception is believing theoretical and experimental probability MUST always match exactly, so any mismatch means something is "wrong" with the device or the trial; a CFU question should present a small discrepancy from a fair device and ask the student to explain it without concluding the device is unfair, explicitly distinguishing sampling variation from an actually-biased device.
- **Memorization fact (periodic re-check candidate):** no — model-building is scenario-specific reasoning applied fresh each time, not a fixed fact.

### Unit 4: Representing Sample Spaces for Compound Events
- **Goal:** Learn three different ways to lay out every possible outcome when two chance events happen together (like flipping a coin AND rolling a die), so you can count how many outcomes match a description.
- **Standard:** 7.SP.8a and 7.SP.8b
- **Buckets:** (bucketed by representation method, per the plan's explicit guidance — reading/constructing each is a distinct skill)
  - organized list: list every outcome pair systematically (e.g. H1, H2, H3... T1, T2, T3...) and count matches
  - table (grid): read/build a two-way grid (rows = one event's outcomes, columns = the other's) and count matching cells
  - tree diagram: read/build branching paths for a multi-stage event and count matching end-paths
  - cross-representation translation: given a sample space shown in ONE representation, identify the same outcome set in a DIFFERENT representation, or given an everyday-language event description ("at least one even number"), correctly identify which outcomes in a given representation match it — the everyday-language-to-outcomes translation is itself a distinct, error-prone skill since students often under- or over-count matching outcomes
- **Requires intro (CFU gate):** yes — the specific, named misconception is miscounting a sample space's total outcomes (e.g. treating a coin-and-die combination as having 6 outcomes instead of 12 by forgetting to cross the two event's outcome counts), and separately, misreading an everyday-language description like "at least one" or "exactly one" as matching the wrong subset of outcomes. A CFU question should put "at least one" and "exactly one" phrasings for the same scenario side by side so they can't be conflated.
- **Memorization fact (periodic re-check candidate):** no — constructing/reading each representation is a procedural-but-reasoned skill re-derived from the specific scenario, not a memorized fact.

### Unit 5: Compound-Event Probability and Simulation
- **Goal:** Use a sample space to find the probability of a compound event as a fraction of matching outcomes, and design a simulation to check that probability by actually generating trials.
- **Standard:** 7.SP.8a (probability as fraction of matching outcomes) and 7.SP.8c (design/use a simulation)
- **Buckets:**
  - independent events (7.SP.8a core case): two separate devices/stages where one outcome has no bearing on the other (e.g. flip a coin AND roll a die), compute the compound probability as matching outcomes over total outcomes
  - "dependent-feeling but still independent" events — the classic source of confusion (e.g. "the coin doesn't remember its last flip"): a scenario explicitly designed to look like it should depend on a prior outcome (repeated flips of the same coin, repeated spins of the same spinner) but where each trial is actually independent, requiring the student to correctly treat them as independent rather than assuming the process "adjusts"
  - design-a-simulation case (7.SP.8c): given a real-world compound event description, choose an appropriate physical/numeric simulation tool (e.g. "simulate whether a family of 3 kids is all the same sex" using 3 coin flips) and use generated simulation frequencies to approximate the probability
  - compare a simulation-based frequency estimate to the exact sample-space-based probability for the same compound event, explaining any gap (ties back to Units 2-3's experimental-vs-theoretical reasoning, now at the compound-event level)
- **Requires intro (CFU gate):** yes — this unit directly confronts the gambler's-fallacy misconception again at the compound-event level (named explicitly in the plan: "the coin doesn't remember its last flip"), plus a second misconception of treating EVERY multi-stage scenario as independent by default, when some real compound events genuinely are dependent (not drawn here, but the CFU should at least make the student articulate WHY the coin/spinner case is independent, not just assert it). A CFU question should present the repeated-flip scenario and require the student to explain, in their own words or via a true/false-with-justification format, why the next flip's probability is unaffected by the streak so far.
- **Memorization fact (periodic re-check candidate):** no — compound-probability computation and simulation design are reasoning skills re-derived per scenario, not memorized facts.

## Open questions / flags for the builder
- Unit 4 (representations) and Unit 5 (compound-event probability + simulation) are sequenced so students can read/build a sample space before being asked to compute probabilities and run simulations from it; this ordering is a pedagogical judgment call, not dictated by the standard's own a/b/c lettering (which lists 8a before 8b before 8c) — flag if the user prefers folding 8a's fraction-of-matching-outcomes computation into Unit 4 alongside the representations themselves, producing a 4-unit lab instead of 5.
- "Independent" vs. "dependent-feeling but still independent" is the required bucket split per the task brief for Unit 5; note that TRUE dependent compound events (e.g. drawing marbles from a bag WITHOUT replacement) are outside 7.SP.8's scope as written (7.SP.8 does not require distinguishing independent from dependent, only computing compound probabilities and simulating them) — recommend the builder keep all Unit 5 scenarios genuinely independent and use the "feels dependent" framing only as a reasoning trap, not introduce true without-replacement dependence, to avoid teaching content beyond this standard's scope.
- Physical-simulation Explore interactions (spinner/die/coin/marble-bag draw-and-tally) are referenced throughout as the concrete anchor per the audience framing; the builder should confirm whether a shared "simulate N trials and tally outcomes" diagram/control already exists in `shared/diagrams/` or `shared/engine/` before building one locally per unit, since at least Units 2, 3, and 5 all need essentially the same trial-and-tally mechanic and this is exactly the "promote on the second real consumer" case the builder convention calls out.
