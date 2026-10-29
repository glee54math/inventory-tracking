# Time Measurement And Data Lab

**Proposed slot:** MG6 or MG7 — provisional, confirm at build time per project convention.
**Grade:** 3
**Standards covered:** 3.MD.1 (tell/write time to the nearest minute; solve add/subtract word problems involving time intervals), 3.MD.2 (measure/estimate liquid volume and mass in grams, kilograms, and liters; solve one-step word problems with the four operations involving masses or volumes given in the same units), 3.MD.3 (draw a scaled picture graph and a scaled bar graph; solve one- and two-step "how many more/less" problems using information presented in scaled bar graphs), 3.MD.4 (generate measurement data by measuring to the nearest 1/4 inch; show the data on a line plot marked in whole, half, and quarter units).
**Relationship to existing labs:** No existing coverage. MG6 (bar-model word problems, vertical addition/subtraction) and MG7 (N×1-digit multiplication) are this grade's only currently-built labs and neither touches time, liquid volume/mass, scaled graphs, or line plots.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. Favor concrete, real-looking manipulatives over abstract diagrams: an actual draggable analog clock face (not just a digital readout) for Units 1-2, real-looking graduated containers/scales for Unit 3-4, and a genuine scaled picture-graph key (icons, not just bars) for Unit 5. Every Explore section needs an explicit check for understanding before Practice — this age group should not be assumed to transfer a concrete manipulative skill (reading a clock, reading a scale) to the abstract problem form without that gate.

## Units

### Unit 1: Telling and Writing Time to the Nearest Minute
- **Goal:** Read a clock's hour and minute hands together to tell and write the exact time, down to the minute.
- **Standard:** 3.MD.1 (telling/writing time)
- **Buckets:**
  - Minute hand resting exactly on a 5-minute mark (times ending in a multiple of 5)
  - Minute hand between 5-minute marks, requiring a count-by-ones from the nearest mark (e.g. :23, :47)
  - Time near the top/bottom of the hour where the hour hand has crept close to the next number (e.g. 2:58 vs 3:02) — tests whether the student reads the hour hand's nearest-looking number instead of its actual position
  - Two-way translation: given a digital time, place/draw both hands correctly; given a drawn clock, write the digital time
- **Requires intro (CFU gate):** Yes — common misconception: once the minute hand passes the halfway point, students often read the hour hand as if it has already advanced to the next hour (e.g. calling 2:45 "3:45" because the hour hand looks closer to 3). CFU must include a near-the-hour clock and ask which hour is correct plus why.
- **Memorization fact (periodic re-check candidate):** No — reading a clock face is a two-hand coordination skill re-derived from the dial each time, not an isolated fact to recall.

### Unit 2: Elapsed Time and Time-Interval Word Problems
- **Goal:** Figure out an end time, a start time, or how much time has passed, using addition and subtraction of minutes.
- **Standard:** 3.MD.1 (add/subtract time-interval word problems)
- **Buckets:**
  - Find the end time given a start time and a duration, no hour rollover
  - Find the end time given a start time and a duration that crosses an hour boundary (e.g. start 10:45, add 30 minutes)
  - Find the elapsed duration given a start and end time, no hour rollover
  - Find the elapsed duration given a start and end time that crosses an hour (or crosses noon/midnight)
  - Find the start time given an end time and a duration (start-unknown, the reverse-direction case per the CCSS Table 1 "unknown in a different position" principle)
- **Requires intro (CFU gate):** Yes — common misconception: when a time interval crosses an hour boundary, students often subtract/add minutes as if time were base-10 (treating 3:15 − 2:50 like ordinary subtraction instead of recognizing they need to borrow 60 minutes, not 100). CFU must include one hour-crossing problem where a straight base-10 subtraction gives a plausible-looking but wrong answer.
- **Memorization fact (periodic re-check candidate):** Yes — "60 minutes = 1 hour" is a fixed conversion fact this unit leans on every time rather than something re-derived by reasoning; set `reintroEverySolved` so it's periodically re-surfaced.

### Unit 3: Measuring and Estimating Liquid Volume and Mass
- **Goal:** Read a scale or graduated container to measure liquid volume or mass, and judge which unit (grams, kilograms, or liters) makes sense for a real object.
- **Standard:** 3.MD.2 (measuring/estimating; benchmark reasoning)
- **Buckets:**
  - Read a graduated container's fill line to the marked liter or part-liter amount
  - Read a scale's pointer/digital readout to the marked gram or kilogram amount
  - Choose the sensible unit (grams vs. kilograms, or recognize liters as the volume unit) for a given real-world object (a paperclip, a textbook, a bathtub of water)
  - Compare two measurements given in the same unit (which is heavier/holds more)
- **Requires intro (CFU gate):** Yes — common misconception: students frequently confuse grams and kilograms in scale because they lack an intuitive feel for either magnitude, and separately conflate mass units with volume units (treating "a liter of water" and "a kilogram of water" as interchangeable labels for the same attribute rather than two different things being measured). CFU must include one question that names both a mass and a volume for the same object and asks which is which.
- **Memorization fact (periodic re-check candidate):** No — grade 3 only requires estimation/benchmark reasoning, not a conversion fact between units (gram-to-kilogram conversion arithmetic is a grade 4 standard, 4.MD.1); this unit's content is judgment, re-applied fresh to each object.

### Unit 4: One-Step Word Problems with Masses and Volumes
- **Goal:** Use addition, subtraction, multiplication, or division to solve a real-world problem about masses or volumes given in the same unit.
- **Standard:** 3.MD.2 (one-step word problems, four operations)
- **Buckets:**
  - Add or subtract two masses/volumes in the same unit (combine, or find a difference)
  - Multiply a mass/volume by a whole-number scale factor (e.g. "4 glasses holding 250 mL each")
  - Divide to find an equal-share amount per group (e.g. "share 12 liters evenly among 4 bins")
  - Mixed-operation problem where the story doesn't name the operation outright — the student must decide which of the four operations the situation calls for
- **Requires intro (CFU gate):** Yes — common misconception: because the standard explicitly requires "same units," students sometimes try to combine mismatched units (grams with liters) without noticing the mismatch, and separately default to "always add" regardless of the story's actual structure. CFU should include one problem where the units given don't match, asking the student to spot the issue before solving.
- **Memorization fact (periodic re-check candidate):** No — this is word-problem reasoning (identifying the right operation from context), re-derived from each story, not a fixed fact.

### Unit 5: Scaled Picture Graphs and Bar Graphs
- **Goal:** Read and draw graphs where one square or picture stands for more than one item, and use the graph to answer "how many more/less" questions.
- **Standard:** 3.MD.3
- **Buckets:**
  - Read a single bar's value off a scaled bar graph (scale greater than 1, e.g. each gridline = 5)
  - Read a bar that falls between two scale gridlines, requiring the student to reason about a partial step rather than only reading whole gridlines
  - One-step "how many more/fewer" comparison between two categories on the same scaled graph
  - Two-step "how many more/fewer" comparison (e.g. combine two categories first, then compare the total to a third)
  - Draw/complete a scaled picture graph given an icon key (including a category whose count doesn't divide evenly by the key, requiring a half-icon or partial-icon convention)
- **Requires intro (CFU gate):** Yes — common misconception: on a scaled graph, students very commonly read a bar's gridline position as the literal count instead of multiplying by the scale factor (e.g. reading a bar at the "3" gridline as "3" instead of "15" when each gridline represents 5). CFU must explicitly test reading a non-1 scale correctly before any comparison question is attempted.
- **Memorization fact (periodic re-check candidate):** No — each graph comes with its own key/scale that must be read fresh; there's no fixed fact to retain across problems.

### Unit 6: Line Plots with Fractional Measurement Data
- **Goal:** Measure objects to the nearest quarter inch and show the collected data as dots on a line plot, then answer questions from the plot.
- **Standard:** 3.MD.4
- **Buckets:**
  - Measure a (simulated) object to the nearest 1/4 inch and place a dot at the correct position on a line plot already marked in whole, half, and quarter units
  - Read a given line plot — find the frequency (how many data points) at one specific value
  - Read a given line plot — comparison questions (how many more measurements fell at one value than another; total number of objects measured)
  - Line plot with all three tick densities (whole, half, quarter) present on the same axis — correctly placing or reading a value that falls on a quarter-mark, not just the easier whole/half marks
- **Requires intro (CFU gate):** Yes — common misconception: when a line plot's axis mixes whole, half, and quarter tick marks, students often attend only to the whole-number ticks and round their fractional measurement to the nearest whole or half instead of plotting at the exact quarter mark; a second common mix-up is confusing "number of dots stacked at a value" (frequency) with "the value itself" when asked a comparison question. CFU must include one quarter-mark placement and one frequency-vs-value comparison question.
- **Memorization fact (periodic re-check candidate):** No — reading/plotting a line plot is re-derived from the specific axis and data shown each time.

## Open questions / flags for the builder
- Slot is listed as "MG6 or MG7" per the planning brief with no existing coverage either way; this is a genuine placement call (which existing grade-3 slot, or whether to request a new one) the builder should flag back rather than guess, per `math-lab-builder.md`'s "stop and report" rule for slot ambiguity.
- Units 1 and 2 (clock reading, elapsed time) could plausibly be built as one unit instead of two if the builder judges the Explore/CFU/Practice pass too thin split apart — flagging rather than deciding, since 3.MD.1 itself names both halves (telling time; interval word problems) as one standard.
- Confirm whether `shared/diagrams/` already has a clock-face or graduated-container component before building new ones from scratch — these feel like strong candidates for promotion to `shared/` if any sibling grade ever needs them again, per the "promote on the second real consumer" convention.
- Unit 5's "partial icon" convention (for picture-graph counts that don't divide evenly by the key) needs a concrete visual decision (e.g. half an icon = half the key's value) — left to the builder's judgment at build time since the standard itself doesn't specify a single convention.
