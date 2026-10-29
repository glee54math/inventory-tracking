# Measurement Time And Data Lab

**Proposed slot:** MG3 — provisional, confirm at build time per project convention.
**Grade:** 1
**Standards covered:** 1.MD.1 (order three objects by length, compare indirectly via a third object), 1.MD.2 (express length as a whole number of same-size length units, no gaps or overlaps), 1.MD.3 (tell and write time to the hour and half-hour, analog and digital), 1.MD.4 (organize, represent, and interpret data with up to 3 categories).
**Relationship to existing labs:** Supersedes MG3.tsx's unwired MakeTenStrategy component — that file predates the Unit-engine pattern and was never wired into practice; safe to treat this standard as uncovered.
**Audience framing:** Built for a student seeing this content for the first time, regardless of the standard's posted grade level. This lab is especially visual/manipulative-driven even by first-grade standards — length comparison, iterated units, and clock-reading are inherently physical/spatial skills, so every unit leans on draggable or directly-manipulable diagrams (objects to reorder, unit-tiles to lay end-to-end, a clock face with movable hands) rather than abstract numbers alone.

## Units

### Unit 1: Comparing and Ordering Length
- **Goal:** Put three objects in order from shortest to longest, and compare two objects' lengths using a third object as a go-between when they can't be placed side by side.
- **Standard:** 1.MD.1
- **Buckets:**
  - Direct ordering of three objects shown side by side, aligned at one end (baseline: just read off the lengths)
  - Direct ordering of three objects shown NOT aligned at a common starting point (tests the common misconception that a shape starting further right/down "is longer" just because it extends further, ignoring where it starts)
  - Indirect comparison via a third object/transitive reasoning (Object A is longer than string C; string C is longer than Object B; is A longer or shorter than B?) — the actual novel content of 1.MD.1 beyond simple ordering
  - Indirect comparison where the transitive conclusion is counter-to-first-glance (the third object isn't shown next to both at once, so the student must reason rather than eyeball)
- **Requires intro (CFU gate):** Yes — common misconception: students commonly judge length by which object's far end sticks out furthest rather than aligning starting points, and many don't yet trust transitive reasoning (A>C, C>B, therefore A>B) without seeing A and B directly compared. CFU must include one misaligned-start pair and one transitive-reasoning question with an explicit "how do you know, since they're not touching" justification.
- **Memorization fact (periodic re-check candidate):** No — length ordering/transitive reasoning is reasoned through visually each time, not a memorized fact.

### Unit 2: Measuring Length with Units
- **Goal:** Measure how long something is by laying same-size units end-to-end with no gaps or overlaps, and count the units to get the length.
- **Standard:** 1.MD.2
- **Buckets:**
  - Correct, clean iteration (unit tiles laid with no gaps/overlaps — count them to confirm understanding of the basic procedure)
  - Object length is NOT a whole number of units (lands between two unit marks) — tests that student reports the appropriate whole number (CCSS expects whole-number length; the lab should present this as "count the full units it covers" rather than requiring fraction answers at this grade)
  - Diagram showing a flawed measurement WITH gaps between units (student must identify why the count is wrong, not just produce their own count)
  - Diagram showing a flawed measurement WITH overlapping units (same, different error type — tests the two distinct ways iteration goes wrong are both recognized, not just one)
- **Requires intro (CFU gate):** Yes — common misconception: students who are simply handed a ruler-like strip of units often don't yet understand WHY gaps or overlaps make the count wrong (they may just count the units present and not notice the spacing issue) — this is new vocabulary/reasoning ("iterate," "no gaps or overlaps") that a rote counting drill never surfaces. CFU must show both a gapped and an overlapping example and ask which is the actual length vs. which is wrong and why.
- **Memorization fact (periodic re-check candidate):** No — this is a hands-on measurement procedure, re-applied each time to new objects, not a memorized fact.

### Unit 3: Telling and Writing Time
- **Goal:** Read a clock and tell what time it is to the hour or half-hour, on both analog and digital clocks, and match the two formats to each other.
- **Standard:** 1.MD.3
- **Buckets:**
  - Analog clock reading, exact hour (hour hand on a number, minute hand on 12)
  - Analog clock reading, exact half-hour (minute hand on 6, hour hand between two numbers — tests the common misconception of reading the hour hand's position as the LATER number it's approaching rather than the hour it's still within)
  - Digital-to-analog or analog-to-digital matching, exact hour (e.g. given "4:00," identify/draw the matching clock hands, or vice versa)
  - Digital-to-analog or analog-to-digital matching, exact half-hour (e.g. given "4:30," identify/draw the matching clock hands, or vice versa)
- **Requires intro (CFU gate):** Yes — common misconception: on a half-hour analog clock, students very commonly read the hour hand's position between two numbers as the number it's approaching (e.g. reading "4:30" as "5:30" because the hour hand looks closer to 5) rather than the hour it just passed; students also sometimes confuse which hand is which (treating the longer minute hand as the "more important"/hour indicator). CFU must include a half-hour reading where the hour hand is visibly past the midpoint toward the next number, explicitly asking which hour it belongs to and why.
- **Memorization fact (periodic re-check candidate):** Yes — the clock-reading convention itself (minute hand on 12 = :00, minute hand on 6 = :30, and which hand is hour vs. minute) is a fixed convention to be memorized and retained long-term, not something re-derived from first principles each time; set `reintroEverySolved` so this gets periodically re-surfaced, especially the half-hour hour-hand-position rule.

### Unit 4: Organizing and Interpreting Data
- **Goal:** Sort information into up to 3 categories, show it in a simple chart or graph, and answer questions about which category has more, less, or how many in total.
- **Standard:** 1.MD.4
- **Buckets:**
  - Sorting raw items/picture data into categories (given a mixed set, e.g. fruit pictures, sort into ≤3 named categories first)
  - Reading a given chart/picture graph with exactly 2 categories to answer a "how many" question for one category
  - Reading a given chart/picture graph with 3 categories to answer a comparison question ("how many more are in category A than category B") — the 3-category case is the harder bucket since it's not just reading one bar/row
  - Reading a given chart/picture graph to answer a total-count question across all categories combined (requires combining rather than reading one category off directly)
- **Requires intro (CFU gate):** Yes — common misconception: students often answer "how many more" comparison questions by reporting one category's raw count instead of the actual difference between two counts (e.g. answering "5" instead of "2" when category A has 5 and category B has 3), and with 3 categories some students only look at the two categories mentioned by name while missing a question that requires the third/combined total. CFU must include one "how many more/fewer" comparison question and one combined-total question across all 3 categories.
- **Memorization fact (periodic re-check candidate):** No — data interpretation is reasoned through per-chart each time, not a memorized fact.

## Open questions / flags for the builder
- 1.MD.2's standard explicitly limits first grade to whole-number-of-units lengths ("express the length... as a whole number of length units"); flagging that the "lands between two unit marks" bucket should be built so the correct answer is always a clean whole number by construction (object endpoints snapped to unit boundaries in the generator), not a fractional/rounding scenario — that's a 3rd-grade (3.MD.4) skill, out of scope here.
- Clock-reading (Unit 3) is the one unit in this lab most likely to benefit from a draggable analog clock-hands diagram in Explore; worth checking `shared/diagrams/` for an existing clock component before building a new one, per the "promote on second real consumer" convention — if no existing clock diagram exists, this becomes the first consumer and should stay local to this lab unless/until a second lab needs it.
- Units 1 and 2 (length ordering vs. length measuring with units) could arguably be merged into one unit since both derive from 1.MD.1/1.MD.2 together in the standard's own domain heading ("Measure lengths indirectly and by iterating length units"); kept as two units here because the skills are genuinely distinct (ordinal comparison reasoning vs. unit-iteration measurement) and each carries its own distinct misconception — flagging in case the builder judges differently.
