# DisplayingAndSummarizingDataLab

**Proposed slot:** MM2 — provisional, confirm at build time per project convention.
**Grade:** 6
**Standards covered:** 6.SP.4 (display numerical data on a number line — dot plots, histograms, box plots), 6.SP.5a (report the number of observations), 6.SP.5b (describe the attribute measured, including units), 6.SP.5c (give quantitative center and variability measures — median/mean, interquartile range/mean absolute deviation — describe pattern/deviations in context), 6.SP.5d (relate the choice of center/variability measure to the data's shape and context).
**Relationship to existing labs:** Direct SEQUEL to `StatisticalQuestionsAndVariabilityLab` (this grade's own other new lab, 6.SP.1-3). Sequence that lab first — it establishes WHY center, spread, and shape matter and what the two kinds of summary numbers are each for, before this lab teaches the student how to actually COMPUTE and DISPLAY them. No other existing lab in the codebase touches statistics; this is new territory built entirely on top of the sibling plan above.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. By this lab the student already accepts (from the prerequisite lab) that data varies and that center/spread/shape are three separate things worth describing — so Explore here can move faster into hands-on plotting and computing, but should still let the student build/compare real data sets (not just read pre-made ones) when introducing each new display type, consistent with this strand's "generate and compare" framing.

## Units

### Unit 1: Dot Plots
- **Goal:** Organize a list of numerical data onto a number line as a dot plot, and read values and counts back off one.
- **Standard:** 6.SP.4
- **Buckets:** build a dot plot by plotting a given raw list of data values; read specific values and their frequency off a given dot plot; count the total number of observations from a dot plot (the number of dots, not the number of distinct positions); handle a data set with repeated values that stack multiple dots at the same point — a genuinely harder case than all-distinct values, since it's easy to undercount by treating the plot as a simple list of positions.
- **Requires intro (CFU gate):** Yes. Named misconception: students count the number of distinct tick-mark positions with at least one dot, rather than the total number of dots (observations) — directly sets up the same miscount trap in Unit 3's 6.SP.5a work.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 2: Histograms & Box Plots
- **Goal:** Organize numerical data into a histogram (grouped intervals) and into a box plot (quartiles), and read values back off each.
- **Standard:** 6.SP.4
- **Buckets:** read frequencies/counts off a given histogram with equal-width intervals; build or complete a histogram from a raw data list given an interval width; read the five-number summary (minimum, Q1, median, Q3, maximum) off a given box plot; compare the SAME data set shown as a dot plot vs. a histogram vs. a box plot and explain what each view does and doesn't show — a genuinely different reasoning task, not just a different display of identical information.
- **Requires intro (CFU gate):** Yes. Named misconceptions (test both together, since they're commonly conflated in the same way): students think a box plot's box WIDTH represents "how many data points are inside it" rather than the spread of the middle 50% of values; separately, students don't distinguish a histogram's touching bars (continuous numerical intervals) from a bar graph's gapped bars (discrete categories), treating them as the same chart type.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 3: Reporting Observations and the Measured Attribute
- **Goal:** State how many data points are in a data set and clearly describe what was actually measured, including its units.
- **Standard:** 6.SP.5a, 6.SP.5b
- **Buckets:** count total observations from a dot plot or histogram (reinforces Unit 1's dot-counting skill in the reporting context); determine total observations when it isn't directly countable from the display (e.g. stated only via a five-number-summary/box-plot context, where n must come from an accompanying list or count rather than the plot itself) — a genuinely harder case than reading dots off a plot; write a complete description of the measured attribute that includes units (e.g. "height, measured in inches") vs. identify an incomplete description missing its units.
- **Requires intro (CFU gate):** Yes. Named misconception: omitting units when describing the measured attribute (treating "height" as a complete answer); separately, confusing "number of observations" with "range of the values" — two different numbers from the same data set that students often swap.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 4: Center — Mean vs. Median
- **Goal:** Compute the mean and median of a data set, and decide which one better describes a "typical" value for that particular set.
- **Standard:** 6.SP.5c
- **Buckets:** compute the mean (sum divided by count); compute the median with an odd number of values; compute the median with an even number of values (average the two middle values — a real added difficulty step the odd-count case doesn't have); data WITH an outlier, where mean and median diverge and the student must identify median as the better "typical value" and explain why; symmetric data with NO outlier, where mean and median come out close together and either is defensible — a genuinely different reasoning case from the outlier bucket, not just different numbers.
- **Requires intro (CFU gate):** Yes. Named misconception (explicit): students default to reporting the mean even when an outlier makes the median the better choice — the CFU should present a clearly outlier-skewed set and ask the student to justify, not just compute, which measure to report.
- **Memorization fact (periodic re-check candidate):** No — the mean/median procedures are re-derivable from their definitions each time, not standalone facts to retain independent of the data.

### Unit 5: Variability — IQR vs. MAD
- **Goal:** Compute the interquartile range (IQR) and the mean absolute deviation (MAD) of a data set, and know which spread measure pairs with which center measure.
- **Standard:** 6.SP.5c
- **Buckets:** compute the IQR (Q3 − Q1, from an ordered list, including the odd/even quartile-position sub-cases); compute the MAD (average of each value's absolute distance from the mean); match IQR with median and MAD with mean as the standard pairing (a vocabulary/pairing bucket, since treating the two spread measures as interchangeable is the main risk here); data with an outlier, where IQR stays stable (resistant to the outlier) but MAD gets inflated by it — the genuinely distinguishing case, directly parallel to Unit 4's mean/median outlier bucket.
- **Requires intro (CFU gate):** Yes. Named misconception: treating IQR and MAD as interchangeable "spread numbers," and/or using MAD on outlier-skewed data without realizing it gets distorted by the outlier the same way the mean does.
- **Memorization fact (periodic re-check candidate):** No.

### Unit 6: Putting It Together — Summarizing a Data Set in Context
- **Goal:** Write a complete summary of a real data set: how many observations, what was measured (with units), a center measure, a spread measure, and why those particular measures fit this data's shape.
- **Standard:** 6.SP.5c, 6.SP.5d
- **Buckets:** full written summary for symmetric, no-outlier data (mean + MAD pairing, justified by shape); full written summary for skewed/outlier data (median + IQR pairing, justified by shape); given two candidate summaries of the same data set, identify which one correctly relates ITS choice of measures to the data's shape (a critique bucket that directly targets 6.SP.5d rather than just repeating 5c's computation); given a summary missing one required part (count, attribute+units, center, spread, or a pattern/deviation description), identify what's missing — a completeness-check bucket.
- **Requires intro (CFU gate):** Yes. This is the lab's capstone unit; named misconception: treating 6.SP.5d as "also mention the shape" tacked on at the end, rather than using the shape to JUSTIFY which specific center/spread measures were chosen in the first place — the CFU should force the student to connect a shape observation to a measure CHOICE, not just report both separately.
- **Memorization fact (periodic re-check candidate):** No.

## Open questions / flags for the builder
- Units 4 and 5 are deliberately parallel (mean/median outlier reasoning, then IQR/MAD outlier reasoning) — consider whether Explore in Unit 5 should reuse the exact same example data set from Unit 4's outlier bucket so the student can directly see "the measure that was resistant to the outlier before (median) pairs with the spread measure that's resistant now (IQR)," rather than introducing a fresh, unconnected data set.
- 6 units is at the top of this project's usual 3-6 range; if the builder finds Units 4 and 5 are thin enough on their own, consider merging them into one "Center and Variability" unit with the mean/median and IQR/MAD buckets combined — left as a judgment call since the standard's own text (5c) already treats center and variability as one combined bullet, even though they're different computations worth separate practice reps.
- No existing practice history predates this lab (brand new, no grandfathering concern).
