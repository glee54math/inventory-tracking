# MK3 Measurement & Classifying: Round 1 curriculum review

- **Lab:** MK3 `MeasurementAndClassifyingLab` (shown as "Measuring & Classifying"), 3 units + Module Test.
- **Round:** 1, full review of an existing lab. No round-0 build report. **Date:** 2026-11-21.
- **Grade band assessed:** K–1. Kindergartners and 1st graders seeing this for the first time, plus 2nd graders who are behind, alone on an iPad, mostly non-readers, audio-first.
- **Standards:** K.MD.1, K.MD.2, K.MD.3. I used the condensed reference file and the plan. Where a finding leans on the official K.MD.2 example (comparing the heights of two children), that wording is from my memory of the CA CCSS and was not re-fetched.
- **Prior lab:** `LAB_NEEDS` lists only MK1. I used MK1's vocabulary list, not a full read of its units.
- **Independence:** I did not read `round-1-english.md`, which appeared in this folder during my review.
- **How I checked:** I read the plan, vocabulary list, shell, all units, Tests, diagrams and the shared `KCheck`, `StepProblem` and `UnitTest` code. I ran 3,000–20,000 trials per generator. I ran the real lab in Chromium at iPad portrait (820×1180, touch on) from a temporary server outside the repo, answered wrong on purpose, and looked at the screenshots. The server is stopped and no lab file changed.

## 1. Verdict

**Needs rework before students use it alone.** The shell is sound: the CFU gate, retry lock and honest stars all work. The teaching is not ready. Unit 1 marks sensible answers wrong, Unit 3 Explore praises a wrong sort, and on most questions a stuck child never reaches a demonstration.

**Counts: 2 Blocker, 23 Major, 10 Minor, 2 Polish (37 findings).** Five need the user's decision.

## 2. Top 5 changes

1. **Make Unit 1's answers true (C1-12, C1-13).** "Is the pencil long or short?" has no right answer without something to compare to, and the lab marks "short" wrong.
2. **Make Unit 3 Explore check the sort (C1-29).** It now says "Every item is sorted!" with green and red mixed in the Red group.
3. **Give every stuck student a demonstration (C1-01, C1-02, C1-03).** Add the Look here pointers, and fix two-button questions, where one wrong tap leaves only the answer and the demo can never appear.
4. **Make mastery real (C1-04, C1-05, C1-30).** 9 of 12 problem kinds have no typed step, several answers never change, and the Unit 3 Test prints the count it asks for.
5. **Teach in Explore what the CFU checks (C1-15, C1-21, C1-31, C1-32).** Explore doesn't show big-versus-heavy, sliding rods together, the extra blocks, or ordering groups by count.

## 3. Scorecard

| Layer | U1 Describing | U2 Comparing | U3 Classifying |
|---|---|---|---|
| 1 Standards and sequence | OK | OK | Weak: ordering by count not practiced |
| 2 Audience | Weak: vocabulary and true/false | Weak: true/false | Weak: true/false, "attribute" |
| 3 Learning arc | Weak: Explore lacks the CFU ideas | Weak: no alignment demo | Weak: trap not carried forward |
| 4 Getting unstuck | Weak: no Show me reachable | Weak: only the typed step has it | OK on typed steps, Weak on picks |
| 5 Pictures | Weak: bricks labeled "Balloon", missing glyph | OK: small labels overlap | Weak: Test prints counts |
| 6 Math accuracy | Weak: disputable answers | Strong | Strong |
| 7 Mastery integrity | Weak: no typed step | Weak: 3 of 4 kinds untyped | Weak: printed counts |
| 8 Device | Weak: native dropdown | Weak: 23 px drag handle | OK |

### Standards coverage

| Standard part | Unit | Practice bucket | Test | Gap |
|---|---|---|---|---|
| K.MD.1 describe length, weight | 1 | lengthSingle, weightSingle | Q1, Q2 | Answers disputable (C1-12) |
| K.MD.1 several attributes of one object | 1 | twoAttributes | Q3 | Native dropdown (C1-18) |
| K.MD.2 compare length | 2 | lengthAligned, lengthMisaligned | Q1–Q4 | Trap is rare (C1-22) |
| K.MD.2 compare weight | 2 | weightCompare | Q5, Q6, Q10 | Q10 shows its answer (C1-25) |
| K.MD.2 describe the difference | 2 | describeDifference | Q7, Q8 | Not shown in Explore (C1-21) |
| K.MD.3 classify | 3 | sortObvious, sortHard | Q1, Q2, Q8 | No competing attribute (C1-32) |
| K.MD.3 count each category (≤10) | 3 | countCategory | Q3, Q4, Q9 | Test prints the count (C1-30) |
| K.MD.3 sort categories by count | 3 | Two groups only | Q10 only | **Never practiced with 3 groups (C1-31)** |

### CFU coverage and proposed Look-here spots

Typed share is exactly 2 of 5 (40%) in every unit, so the rule is met. No question has a pointer yet.

| Unit, question | Answer | Explore teaches it now? | Proposed Look-here spot |
|---|---|---|---|
| U1 Q1 word for heavy | heavy | Partly | New heavy/light balance line |
| U1 Q2 balloon vs rock | rock | **No** | New "big is not always heavy" balance |
| U1 Q3 blocks on heavy side | 6 | **No** | Replace (C1-17) |
| U1 Q4 train length | 7 | **No** | New block-length picture |
| U1 Q5 train also is | heavy | Prints the answer by default | Object card, with default moved off train |
| U2 Q1 longer rod | Rod A | Yes | Rods, Same start |
| U2 Q2 blocks past | 3 | **No** | New ringed extra blocks |
| U2 Q3 different starts | Rod A | Partly | New "slide together" button |
| U2 Q4 Rod B blocks | 4 | **No** | Same slide spot, with numbered blocks |
| U2 Q5 heavier side | Left | Yes | Balance |
| U3 Q1 yellow square | Yellow | **No** (Explore is circles only) | New mixed-shape color sort |
| U3 Q2, Q3 count groups | 6, 4 | Partly | Bin counts after sorting |
| U3 Q4 fewer | Green | **No** | New line-up compare |
| U3 Q5 red circle by shape | Circles | **No** (Explore shapes are one color) | New mixed-color shape sort |

## 4. All findings

### All units

**C1-01 · Major · Layer 3 · No CFU question points to Explore.**
- **Who:** every student after a 2nd miss.
- **Evidence:** no `look` prop in any of the 15 questions. The browser walk found 0 "Look here!" buttons.
- **Fix:** add `look` to all 15, with `lookHereSpot` marks and short `say` lines, as MG1 and MG2 do. Use the table above. Add the missing teaching spots first (C1-15, C1-21, C1-31, C1-32). No spot may show its question's answer.

**C1-02 · Major · Layer 4 · Eight of nine CFU picks can never show the demo.**
- **Who:** the guesser and the first-timer.
- **Evidence:** without `look`, a tried button locks (`KCheck.tsx:162`), so a two-button pick stops at one miss and `showAfter` (2) is never reached. In the browser, one wrong tap left one live button on all 8. The written demos, including U2 Q3's rod slide, never play.
- **Fix:** with C1-01, give each two-button pick a `twin` with new values and the same answer type, as in MG1 U6 Q2.

**C1-03 · Major · Layer 4 · Show me can't be reached on 19 of 24 Practice steps.**
- **Who:** any stuck student.
- **Evidence:** Show me needs 2 wrong tries (`StepProblem.tsx:643`), and a two-button step allows one. Browser: after one wrong tap, 1 live button and no Show me on every two-button kind tested. The rod-numbering and slide demos at `ComparingTwoObjectsDirectly.tsx:248` and `:271` never appear.
- **Fix (lab only):** run each step's demo from `pointing(help, i)` on the first wrong try, then ask a typed or fresh question (C1-04). This needs no shared-engine change.

**C1-04 · Major · Layer 7 · Nine of 12 problem kinds have no typed step.**
- **Who:** the guesser.
- **Evidence:** typed steps exist only in describeDifference, countCategory and compareCategories. A blind guess solves a two-pick kind cleanly 25% of the time, or 50% when step 2 is just "the other one" (longer then shorter, heavier then lighter).
- **Fix:** add a number-pad step that needs the idea to each of the 9 kinds, such as "How many blocks long is the longer rod?" or "How many are in the group it joined?"

**C1-05 · Major · Layer 7 · Some answers never change.**
- **Evidence (20,000-trial generator run):**
  - Practice: twoAttributes step 2 is always "No…", lengthMisaligned step 2 always "False", sortObvious step 2 always "Color" (the story also says COLOR), sortHard step 2 always "True".
  - Tests: fixed answers on 7 of 10 questions in U1, 3 of 10 in U2, 2 of 10 in U3.
  - A student who memorizes U1's seven answers from the results screen and guesses the rest passes **37.5%** of the time.
- **Fix:** replace these with picture questions whose answers vary. For "sorted by what?", vary color and shape sorts and don't name the rule in the story.

**C1-06 · Major · Layer 2 · True/false and vocabulary questions in a K lab. Needs the user's decision.**
- **Evidence:** true/false at U2 Practice `:286`, U3 Practice `:342`, U1 Test Q6–Q7, U2 Test Q4 and Q9, U3 Test Q7; three reach the Module Test. The vocabMatch bucket and U1 Test Q4, Q5, Q8–Q10 ask about words alone.
- **Decision:** the plan names a vocabulary-matching bucket, but the K–1 rule bans vocabulary questions.
  - **A (recommended):** keep the bucket's idea through pictures: hear "heavy," then tap the balance picture rather than the rods.
  - **B:** keep word questions as an exception, read aloud.

**C1-07 · Minor · Layer 2 · Practice and Test buttons lose the rod colors.** CFU "Rod A" and "Rod B" are colored; Practice and Test buttons are plain. **Fix:** use color-matched labels, except where color would reveal the answer.

**C1-08 · Minor · Layer 2 · Shell lines are older than MG1's.** "Complete the activity above…" and "Practicing one type is great for extra reps…" remain. **Fix:** copy MG1's "Do the check first. Then you can practice." and "Only **Mixed** problems give you stars."

**C1-09 · Minor · Layer 8 · The first-visit sound banner covers the pad's bottom row at 820×1180.** Seen on the U3 Test until it is dismissed. Shared code, so check other labs before changing it. **Fix:** keep the banner clear of the number pad.

**C1-10 · Polish · Layer 8 · CFU numbers repeat** (1, 2, 2, 3, 4 and 1, 1, 2, 2, 3). The voice says the same number twice. **Fix:** number 1–5.

**C1-11 · Polish · Layer 8 · Typed Practice steps show two Check buttons** (pad and step). Shared engine. **Fix:** consider hiding the step's button while the pad is open, across all K–1 labs.

### Unit 1: Describing How Objects Are Measured

**C1-12 · Blocker · Layers 5, 6 · Long/short and heavy/light answers are arbitrary. Needs the user's decision.**
- **Who:** all three personas, in Practice and Test.
- **Evidence:** `OBJECTS` (`DescribingHowObjectsAreMeasured.tsx:26–39`) fixes a pencil as "long," an anchor as "short," a snake as "light" and a balloon as "short," while the CFU calls the same balloon "big." All objects are drawn the same size, so the picture can't settle it. A child who says a pencil is short is marked wrong.
- **Decision:**
  - **A (recommended):** draw each object beside a fixed reference, such as a hand or block, and ask about it against that. It stays one object's attribute with a visible basis.
  - **B:** keep only clear-cut objects and drop the disputable ones. Simpler, but still judged from memory rather than from the picture.

**C1-13 · Major · Layers 2, 6 · "Tall" gets two meanings. Needs the user's decision.**
- **Evidence:** CFU: "Tall tells how high something is" (`:73`). Explore, Practice and Test file tall under length (`:44`).
- **Decision:**
  - **A (recommended):** keep tall and show it with a rod standing up: "Tall is how long, standing up." This sets up K.MD.2's height comparisons.
  - **B:** drop tall from the lab.

**C1-14 · Major · Layer 5 · The jump rope picture is an empty box.**
- **Evidence:** the glyph is U+1FA22, a chess-symbol code point rather than an emoji. It rendered as a box (screenshot `u1-jumprope.png`). It's in the Practice and Test pools too.
- **Fix:** replace it with a drawn picture or a supported emoji. Also check 🪵 🪨 🪶 on the real iPads: they showed as boxes on this Windows test browser, which may not reflect iOS.

**C1-15 · Major · Layer 3 · Explore doesn't teach what the CFU checks.**
- **Evidence:** Explore has no balance. `OBJECTS.slice(0, 8)` (`:152`) leaves out balloon, feather, leaf and brick, so it never shows a short, light object or the balloon-and-rock idea. Its default sentence, "This train is long and heavy," is the answer to CFU Q5.
- **Fix:** add a small balance with big-but-light and small-but-heavy pairs, show all 12 objects, and default to an object the CFU doesn't ask about.

**C1-16 · Major · Layer 2 · CFU Q1 has its answer in the question.** "Which word tells how heavy something is?" with "heavy" as a button, and the picture is labeled Heavy. **Fix:** show the balance, say "This side went down. It is…", and offer heavy, light, long, with no label on the pan.

**C1-17 · Major · Layer 5 · The balance draws bricks and calls them a balloon and a rock.**
- **Evidence:** `:88`, `:103`, `:129` draw 1 brick labeled "Balloon," 6 labeled "Rock," 8 labeled "Train." Q3 then asks how many blocks are on the heavy side, which tests counting and suggests weight is a count of items.
- **Fix:** draw the real object in each pan. Replace Q3 with a typed question that needs the balance idea, such as counting equal blocks that balance against the object.

**C1-18 · Major · Layers 2, 8 · "Two words for one object" uses native dropdowns.** Confirmed at 820×1180 (`select.sentence-select`), in Practice and Test. Because the step isn't `checkEach`, one wrong Check also still counts as clean. **Fix:** use one big-button question per word, or set `checkEach` so tap buttons appear and a wrong try counts.

**C1-19 · Major · Layer 3 · Test Q8–Q10 ask something never taught, with no picture.** "OPPOSITE" appears only in the Test, and `visual` is null. **Fix:** replace with picture questions on skills Practice teaches.

**C1-20 · Minor · Layer 1 · The "painted a new color" step is off-target.** It isn't in the plan or Explore and takes a long sentence to hear. **Fix:** remove it from Practice and Test.

### Unit 2: Comparing Two Objects Directly

**C1-21 · Major · Layer 3 · Explore doesn't show lining up or the difference.**
- **Evidence:** "Different start" only shifts Rod B. Nothing slides the rods together, and nothing marks the extra blocks, yet CFU Q2–Q4 ask for both.
- **Fix:** add a "Slide together" button using `alignStarts`, and ring and number the extra blocks with `extraFrom`. Keep the defaults off the CFU's 7 and 4.

**C1-22 · Major · Layer 6 · The "farther end" mistake usually still works.** Over 20,000 lengthMisaligned problems, the rod reaching farther right was the longer rod **66.8%** of the time, the ends tied 10.6%, and the trap appeared only **22.6%**. Rod B is always the shifted one. **Fix:** build the trap first in at least half of problems, and shift either rod.

**C1-23 · Major · Layer 3 · Two competing methods. Needs the user's decision.**
- **Evidence:** the Key Idea says to line rods up. The CFU and hints say "Count blocks, not where the end is."
- **Decision:**
  - **A (recommended):** teach lining up as the method (direct comparison, which is what K.MD.2 asks), with counting blocks as the way to check.
  - **B:** teach counting as the main method. Easier to grade, but closer to 1st-grade length units.

**C1-24 · Major · Layer 8 · The rod drag handle is small for K fingers.** It measures 23×23 px at 820 wide and is the only way to change a rod. I measured the size but did not test a real finger drag. **Fix:** enlarge the touch area to at least 44 px, or add + and − steppers like the balance has.

**C1-25 · Major · Layer 5 · Test Q10 gives its answer away.** The prompt names the heavier side, the picture shows it down, and the answer is always "Down." **Fix:** replace with a question that makes the student read the balance, such as typing how many blocks are on the lighter side.

**C1-26 · Minor · Layer 5 · Near-tie balances barely tilt.** 58.4% of weight problems differ by 1, which is a 3° tilt. **Fix:** set a minimum visible tilt of about 7°.

**C1-27 · Minor · Layer 5 · Labels collide.** "Rod B" prints over Rod A's blocks, and pan rims cross the "Balloon" and "Rock" labels. **Fix:** add row spacing and move pan labels below the rim.

**C1-28 · Minor · Layer 7 · Near-ties aren't a required bucket. Needs the user's decision.** The plan lists them as a fifth bucket; the build folded them into the others, so mastery doesn't guarantee one.
- **A (recommended):** keep four buckets and guarantee one near-tie in each bucket's two clean solves.
- **B:** add the fifth bucket.

### Unit 3: Classifying and Counting by Category

**C1-29 · Blocker · Layers 3, 5 · Explore praises a wrong sort.**
- **Who:** the first-timer and the guesser.
- **Evidence:** I put all 8 items in Red. The screen showed green and red together under "Red (8)" and said **"Every item is sorted! Check the counts under each group."** (`u3-explore-wrong.png`). `onBinClick` (`:223`) never checks the match, and a placed item can't be taken back out.
- **Fix:** a wrong group sends the item back with a short nudge ("Look at its color"). Only say "sorted" when every item is right.

**C1-30 · Major · Layers 5, 7 · The Test prints the counts it asks for.**
- **Evidence:** U3 Test bins never set `hideCount`. Q3 asked "How many are in the Red group?" above "Red (4)". This affects Q3, Q4, Q5, Q6, Q9, Q10 and the Module Test's count and difference questions.
- **Fix:** set `hideCount` on every Test bin.

**C1-31 · Major · Layer 1 · "Sort the categories by count" is never practiced.** Practice compares only two groups. Test Q10 suddenly asks for the fewest of three and offers only two of the three groups as buttons (100% of draws). **Fix:** add a three-group ordering Practice kind with typed counts, teach it in Explore, and show all three buttons.

**C1-32 · Major · Layer 3 · The "keep to one rule" trap isn't carried forward.** The CFU tempts students with shape versus color, but Practice color sorts are all circles and shape sorts are all one color, so the other attribute never competes. **Fix:** use mixed shapes and colors in Explore, Practice and Test, varying the sort rule.

**C1-33 · Major · Layer 5 · Answer box colors contradict the groups.** The "Red group" box is teal-green (`tone="a"`) and the "Green group" box is orange (`tone="b"`), at `ClassifyingAndCountingByCategory.tsx:115` and `:128`. **Fix:** color each box to match its group, adding red and green tones if needed.

**C1-34 · Major · Layers 2, 7 · The compare problem prints both counts and says "Subtract."** The bins show "(n)" and the hint uses a word K students here haven't been taught (`:424`). MK1's list also flags "how many more" as 1st-grade work. **Fix:** hide the counts, and make the hint "Match them up. Count the extras," using the existing extras picture.

**C1-35 · Minor · Layer 2 · "The circled item" next to a "Circles" button.** A child hearing "circled" may tap Circles. **Fix:** say "the item in the ring" or "this one," with an arrow.

**C1-36 · Minor · Layer 1 · Shape names come before MK4 teaches them.** **Fix:** put a shape picture on each bin label and button.

**C1-37 · Minor · Layer 4 · CFU Q4's wrong-answer line gives the numbers and leaves one button.** "Red has 6. Green has 4. Which is less?" **Fix:** "Match them up. Which runs out first?", with the twin from C1-02.

## 5. Persona walkthrough highlights

- **First-timer, U3 Explore:** taps every item into the first box and hears that everything is sorted. The lab has just confirmed the misconception the unit exists to prevent.
- **Guesser, U2 CFU and Practice:** taps the wrong rod, sees one button left, taps it, and moves on. No demo ever plays, so a wrong guess costs one extra tap.
- **Behind 2nd grader, U1 Practice:** reasons that a pencil is short because it fits in a hand, is marked wrong, and gets the hint "Think about how it would look stretched out." Nothing on screen explains why.

## 6. What's working well

- The CFU gates Practice in all 3 units and stays open after passing (`cfuJustPassed`, confirmed in the browser).
- The retry lock held: after a helped solve, "Next problem" was locked, and leaving the tab or reloading kept the same problem type.
- Stars are honest: a helped solve said "Solved, with help," showed no star and added none.
- Typed Show me is good: the count-along numbers dots one by one and holds "Got it" until it plays.
- The number pad did not cover the picture at any of the 5 sizes on the count step.
- No generated answer collided with its distractors, and all counts stay within 10.

## 7. Rule gaps (proposed for `math-lab-builder.md`; not edited)

1. "A two-button Practice step can't reach Show me, because one wrong tap leaves one choice. Put that step's demo in `pointing(help, i)` on the first wrong try, or make the step typed."
2. "A describing question about one object must be answerable from the picture or a visible reference. Don't grade 'long' or 'heavy' from an assumed real-world size."
3. "A sandbox that accepts student work (sorting, matching) must check it before praising it."
4. "When a diagram can print a count, every Test using it must hide the count if the question asks for it or depends on it."
5. "An emoji used as a picture must be confirmed as a real emoji on the target iPad version."

## 8. What I could not check

- Real iPad speech, real finger dragging, and how iOS draws the newer emoji.
- Real students' responses.
- Spoken audio timing: the walk used the screen text and did not listen to the voice.
- Sentence-level English, which belongs to the English checker.
- The number pad at all 5 sizes was checked on one Practice type only; CFU and Test pads were checked at 820×1180.
