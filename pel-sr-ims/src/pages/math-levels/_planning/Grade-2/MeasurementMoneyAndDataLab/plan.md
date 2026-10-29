# MeasurementMoneyAndDataLab

**Proposed slot:** MG5 — provisional, confirm at build time per project convention.
**Grade:** 2
**Standards covered:** 2.MD.1 (measure length with appropriate tools); 2.MD.2 (measure twice with different-length units, describe the relationship); 2.MD.3 (estimate lengths in inches, feet, centimeters, meters); 2.MD.4 (measure to find how much longer one object is than another); 2.MD.5 (solve word problems involving lengths in the same units); 2.MD.6 (represent whole numbers on a number line, represent sums/differences within 100 on it); 2.MD.7 (tell/write time to the nearest 5 minutes with a.m./p.m., know time relationships — CA); 2.MD.8 (solve word problems with dollar bills, quarters, dimes, nickels, pennies, using $ and ¢); 2.MD.9 (generate measurement data, show on a line plot); 2.MD.10 (draw a picture graph and bar graph for up to 4 categories, solve put-together/take-apart/compare problems from a bar graph)
**Relationship to existing labs:** No overlap with MG6's live components — `TwoDigitVisualAddition`/`VerticalAdditionSubtraction` and `BarModelPractice` are purely numeric/word-problem addition-subtraction tools and don't touch length measurement, time, money, or graphing. This lab draws on `ExtendingAdditionAndSubtractionLab`'s within-100/within-1000 addition-subtraction skill (length word problems and bar-graph compare problems both require it) but doesn't re-teach the arithmetic itself — it applies it to a measurement/data context.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. This domain is unusually tool- and context-heavy for a first encounter (rulers, clocks, coins, graphs) — every unit should open with a concrete, visual version of the tool (a draggable ruler, a clickable clock face, draggable coins, a fillable graph) before any question requires reading a value off it under test conditions.

## Units

### Unit 1: Measuring and Estimating Length
- **Goal:** Measure an object's length with a ruler, and make a reasonable estimate before measuring.
- **Standard:** 2.MD.1, 2.MD.3
- **Buckets:** measuring an object aligned to the ruler's zero mark (straightforward read); measuring an object that does NOT start at the ruler's zero mark (a "broken ruler" case — must subtract the start position from the end position rather than reading the endpoint directly); estimating a length in inches or feet before measuring, selecting the most reasonable estimate from options; estimating in centimeters or meters; choosing the appropriate unit/tool scale for an object (centimeters/inches for small objects, feet/meters for larger ones)
- **Requires intro (CFU gate):** Yes — the broken-ruler case is the specific, nameable misconception: reading the endpoint number as the length instead of subtracting the starting position, which looks identical to the easy case unless explicitly flagged.
- **Memorization fact (periodic re-check candidate):** No — each measurement is read directly from the specific tool/object shown.

### Unit 2: Comparing Measurement Units and Finding Length Differences
- **Goal:** Notice that measuring the same object with a smaller unit gives a bigger number, and find how much longer one object is than another.
- **Standard:** 2.MD.2, 2.MD.4
- **Buckets:** the same object measured in two different-sized units (e.g. the same length in centimeters gives a larger count than in inches) — understand the inverse relationship between unit size and the resulting count; find the length difference between two objects given measurements in the SAME unit; true/false trap comparing raw measurement numbers across DIFFERENT units (e.g. "a pencil measured as 7 is longer than one measured as 12" — cannot be judged without knowing the units used)
- **Requires intro (CFU gate):** Yes — the core misconception this unit exists to break is assuming the bigger number always means the bigger measurement, when really the unit size matters just as much as the count.
- **Memorization fact (periodic re-check candidate):** No — reasoned from the specific units/objects given each time.

### Unit 3: Length Word Problems and the Number Line
- **Goal:** Solve word problems about lengths, and show sums and differences on a number line.
- **Standard:** 2.MD.5, 2.MD.6
- **Buckets:** Add To / Put Together situations with the result unknown (e.g. joining two lengths); Take From situations with the result unknown (e.g. cutting a piece off, finding what remains); Compare situations with the difference unknown (how much longer/shorter); unknown-in-a-different-position situations (start unknown or change unknown — CCSS's own glossary identifies this as a materially harder scenario class, not a cosmetic variant, since the operation can't be picked from a keyword); representing a value as a point on a number line and reading a sum/difference within 100 directly off it
- **Requires intro (CFU gate):** Yes — the unknown-in-a-different-position bucket is the named misconception target: students default to whichever operation a problem's keywords suggest rather than modeling the actual relationship, which breaks down exactly on start-unknown/change-unknown problems; number-line work also risks confusing a point's position with a count of tick marks.
- **Memorization fact (periodic re-check candidate):** No — each problem's situation and numbers are reasoned through individually.

### Unit 4: Telling Time to 5 Minutes
- **Goal:** Read a clock to the nearest 5 minutes, tell a.m. from p.m., and know how many minutes are in an hour.
- **Standard:** 2.MD.7
- **Buckets:** reading an analog clock where the minute hand sits exactly on a 5-minute mark; reading a clock where the hour hand is between two numbers (e.g. at :50, the hour hand is almost at the next hour — a common misread); distinguishing a.m. from p.m. given a context clue (e.g. "eating breakfast"); time relationships (minutes in an hour, minutes in a half hour); elapsed time that crosses an hour mark (e.g. 3:50 + 15 minutes = 4:05)
- **Requires intro (CFU gate):** Yes — the hour-hand-between-numbers misread (reading 3:50 as "4:50" because the hour hand is nearly at 4) is a specific, well-known clock-reading error that needs an explicit walkthrough, as does a.m./p.m. context confusion.
- **Memorization fact (periodic re-check candidate):** Yes — fixed time relationships (60 minutes in an hour, 30 in a half hour) are facts to be known outright, not re-derived; set `reintroEverySolved`.

### Unit 5: Money Word Problems
- **Goal:** Add up a mix of coins and bills, and solve word problems about money using $ and ¢.
- **Standard:** 2.MD.8
- **Buckets:** counting a mixed set of coins (quarters/dimes/nickels/pennies) to find total value; combining dollar bills with coins in one word problem; making change / finding the difference between an amount paid and a cost; comparing two money amounts (who has more, how much more); correct $ versus ¢ notation and their equivalence (e.g. $1.25 is the same amount as 125¢)
- **Requires intro (CFU gate):** Yes — the specific misconception is adding the NUMBER of coins instead of their VALUES (e.g. treating "3 quarters and 2 dimes" as 5 coins worth 5 cents), plus $/¢ notation mix-ups.
- **Memorization fact (periodic re-check candidate):** Yes — coin values (penny=1¢, nickel=5¢, dime=10¢, quarter=25¢) are fixed facts to be recalled instantly, not re-derived; set `reintroEverySolved`.

### Unit 6: Line Plots and Picture/Bar Graphs
- **Goal:** Turn measurement data into a line plot, and read and solve problems from picture graphs and bar graphs.
- **Standard:** 2.MD.9, 2.MD.10
- **Buckets:** generating/plotting a given set of measurement data as a line plot; reading an already-made line plot (how many objects had a given length, or how many more at one length than another); reading a picture graph (single-unit scale, up to 4 categories) directly; reading a bar graph directly; solving a put-together/take-apart problem from a bar graph (combine two categories' counts); solving a compare problem from a bar graph (how many more/fewer between two categories — CCSS's glossary flags "compare" as the harder situation type)
- **Requires intro (CFU gate):** Yes — misconception risk of miscounting a line plot's repeated marks at the same value as a single data point instead of multiple occurrences, and misreading a bar graph's scale/gridlines rather than its bar heights.
- **Memorization fact (periodic re-check candidate):** No — each plot/graph is read fresh from its specific data.

## Open questions / flags for the builder
- This domain is unusually broad for one lab (10 standard sub-codes across length, time, money, and data). Recommendation: consider splitting into two labs — "Length, Estimation & the Number Line" (Units 1-3 above) and "Time, Money & Graphing" (Units 4-6 above) — each a cleaner, more coherent 3-unit lab a student could master and get stars for independently, rather than one 6-unit lab that takes much longer to complete end-to-end. Per the brief, no new folder was created for this; this plan.md still covers all 6 units in the single existing `MeasurementMoneyAndDataLab` folder, with this split noted only as a recommendation for the user to weigh before build time.
- Units 1-3 (length) and Units 4-6 (time/money/data) have no real sequencing dependency on each other — if the builder or user wants to build/ship one half before the other, that's a safe cut point.
- Unit 3's number-line sub-skill (2.MD.6) and Unit 6's line-plot sub-skill (2.MD.9) both use a visually similar horizontal-axis diagram for different purposes (position/sum-difference vs. frequency-of-occurrence) — worth a shared diagram component if both get built, flagged here since it wasn't obvious until laying out both units side by side.
