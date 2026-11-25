# MK3 Measurement & Classifying: Round 2 curriculum re-review

- **Lab:** MK3 `MeasurementAndClassifyingLab`, 3 units + Module Test
- **Round:** 2, re-review · **Date:** 2026-11-21
- **Grade band assessed:** K–1. K and 1st graders seeing this for the first time, plus 2nd graders who are behind, alone on an iPad, mostly non-readers, audio-first.
- **Standards:** K.MD.1, K.MD.2, K.MD.3, from the approved plan and the condensed K.MD section of `CCSS_K8_STANDARDS_REFERENCE.md`. I did not re-check the official CA CCSS text, and no finding depends on its exact wording.
- **Settled and not re-raised:** D1–D10, the visible Standard line (D9), no shared `KCheck` edit (D7), and skipped items C1-09 and C1-11.
- **Independence:** I did not read `round-2-english.md`.
- **How I checked:** I read the shell, all units, Tests, diagrams and the shared `KCheck`, `lookHere` and `StepProblem` code. I ran 20,000-draw generator checks and walked the real lab in Chromium from a private server. That server is stopped. No lab file was edited.

## 0. Status of round 1 fixes

**56 Fix items: 47 Fixed, 1 Not fixed, 8 Fixed but caused a new problem.**

| ID(s) | Status | Note |
|---|---|---|
| C1-12 + E1-13 | **New problem** | Objects and reference are in, but the reference block gets counted (C2-39) |
| C1-29 + E1-40 | Fixed | Wrong group sends the item back; praise only when all are right |
| E1-01 | Fixed within D7 | Choices are in every prompt. CFU questions still don't auto-read (logged) |
| C1-18 + E1-14 | Fixed | No dropdown |
| C1-20 + E1-15 | Fixed | Paint removed |
| C1-13 + E1-16 | Fixed | Standing rod |
| E1-23 | Fixed | Blue and orange sides. See "Fixer's deviations" |
| C1-34 + E1-24 | Fixed | Ringed extras, no subtraction wording |
| C1-35 + E1-32 | Fixed | "this one" with ring and arrow |
| E1-33 | Fixed | "How did we sort?" and the rule varies |
| C1-01 | **New problem** | All 15 have pointers, but one leads to its answer (C2-43) and two light the wrong part (C2-44) |
| C1-02 | **New problem** | All 9 twins exist, but each keeps the same right answer (C2-38) |
| C1-03 | Fixed | Two-button steps run their demo on the first wrong try |
| C1-04 | **Not fixed (1 of 12 kinds)** | The weight typed step is plain counting. See below |
| C1-05 | **New problem** | Fixed answers are gone, but "pick the small one" always wins the size question (C2-41) |
| C1-06 + E1-17 | Fixed | Hear a word, tap its picture |
| C1-14 + E1-20 | Fixed | Scarf |
| C1-15 + E1-18 | Fixed | Explore has the objects and the big/small scale |
| C1-16 + E1-19 | Fixed | |
| C1-17 + E1-30 | **New problem** | Real objects in pans, but the taught balances are later contradicted (C2-46) |
| C1-19 | Fixed | |
| C1-21 | **New problem** | Slide and rings work, but dragging after a slide shrinks the rod (C2-45) |
| C1-22 | Fixed | Trap in 60% of draws, either rod |
| C1-23 + E1-26 | Fixed | |
| C1-24 | Fixed | Steppers and a 48 px touch area |
| C1-25 | Fixed | |
| C1-30 + E1-34 | Fixed | No Test bin prints a count |
| C1-31 + E1-37 | Fixed | |
| C1-32 | **New problem** | Attributes now compete, but Three Groups Show me shows the wrong item (C2-40) |
| E1-35 | Fixed | |
| C1-33 | Fixed | |
| E1-02 | **New problem** | U3 Test Q8 became Yes/No, which is true/false in another form (C2-42) |
| E1-03 | Fixed | D8 bands are correct |
| E1-04 | Fixed | |
| C1-08 + E1-05 | Fixed | |
| E1-06 | Fixed | Structure checked; wording belongs to the English checker |
| E1-25 + E1-28 + E1-42 | Fixed | |
| E1-27 | Fixed | |
| E1-36 | Fixed | |
| C1-07 | Fixed | |
| C1-26 | Fixed | Minimum tilt is 7° |
| C1-27 | Fixed | |
| C1-28 | Fixed | D6 guaranteed. See below |
| C1-36 | Fixed | |
| C1-37 + E1-41 | Fixed | |
| E1-22 | Fixed | |
| E1-07 | Fixed | |
| C1-10 + E1-08 | Fixed within D7 | Numbered 1–5. The number is still spoken (shared code) |
| E1-09 | Fixed | |
| E1-21, E1-29, E1-31, E1-38, E1-39 | Fixed | |
| E1-11, E1-12 | Fixed | |

### The checks you asked for

| Check | Result |
|---|---|
| Blue scale tone | **Acceptable.** `--qc` is a true blue in light (#5a6fd6) and dark (#93a3f2) mode, and it differs clearly from Rod A's green-teal. |
| Practice weight step "How many blocks are on the scale?" | **Not acceptable as built.** The answer is every block drawn in 20,000 of 20,000 draws. It needs no idea about weight (C1-04). |
| Look here never shows its answer | **One failure.** U1 Q5's spot says "Tap a picture," and one tap prints "The crocodile is long and heavy" (C2-43). The other 14 spots do not show their answer. |
| Tests give nothing away | **Mostly yes.** No hints on screen and no printed counts. Two design leaks remain: the size question is always "the small one" (C2-41) and U3 Q8 is a Yes/No guess (C2-42). |
| Near-ties per D6 | **Guaranteed.** After one clean solve, 100% of 20,000 draws per bucket are near-ties. Through the real shell, 21 of 21 rod problems were near-ties. |

## 1. Verdict

**Ready after fixes.** There are no Blockers, and the lab is far stronger than in round 1. The biggest remaining problem is that a child can still pass or be misled at key moments: after one wrong tap on any CFU pick, tapping the other button always passes.

**Open findings: 0 Blocker, 7 Major, 5 Minor, 1 Polish** (C1-04 plus 12 new).

## 2. Top 5 changes

1. **Make twins able to catch a guess (C2-38).** Change the right answer on the twin.
2. **Stop the reference block being counted (C2-39).** It looks like one more block in the row.
3. **Fix Three Groups Show me (C2-40).** It says "Yellow" while the arrow is on a green item.
4. **Make the weight typed step need the idea (C1-04).** Ask about the side that went down or up.
5. **Stop teaching "the small one is heavier" (C2-41).** Add a pair where the big one is heavier, and practice it.

## 3. Scorecard

| Layer | U1 Long and Heavy | U2 Longer / Heavier | U3 Sort and Count |
|---|---|---|---|
| 1 Standards and sequence | Strong | Strong | Strong |
| 2 Audience | OK | Strong | **Weak:** Yes/No on Test |
| 3 Learning arc | **Weak:** size trap not practiced; Q5 pointer | OK | OK |
| 4 Getting unstuck | OK | OK | **Weak:** Show me shows the wrong item |
| 5 Pictures | **Weak:** reference block counted | OK | OK |
| 6 Math accuracy | OK | Strong | OK |
| 7 Mastery integrity | **Weak:** twins; plain-count step | **Weak:** twins, all first button | **Weak:** twins |
| 8 Device | OK | OK | OK |

## 4. All findings

### All units

**C2-38 · Major · Layer 7 · One wrong tap, then the other button, passes every CFU pick.**
- **Who:** the guesser, at all 9 two-button CFU picks.
- **Evidence:** every twin keeps the first question's right answer (U1 `:62, :87, :140`; U2 `:82, :122, :161`; U3 `:93, :150, :175`). In the browser, tapping wrong and then the other button got "Yes!" on 9 of 9 and opened Practice. In U2, the right answer is also the first button on all three picks.
- **Fix:** in MK3's data only, make each twin's right answer the other choice where the idea allows. Examples: U1 Q1 twin points at the side that went **up** (light); U2 Q1 and Q3 twins answer Rod B; U2 Q5 twin answers orange; U3 Q1 twin answers red; U3 Q4 twin has fewer red; U3 Q5 twin is a square. Update each twin's `why`, `showText` and `praise`. Also move U2's first-show answers off the first button on at least one question.

**C2-47 · Minor · Layer 4 · Group-count steps don't point at the group being asked about.**
- **Who:** the first-timer who can't read the bin names.
- **Evidence:** on a wrong try, `sortObvious` step 3, `sortHard` step 3, `countCategory` and the three-group count draw no ring until Show me (U3 `:364–365, :400, :421, :442`).
- **Fix:** on `pointing(help, step)`, outline the asked bin without numbers.

### Unit 1: Long and Heavy

**C1-04 · Major · Layer 7 · The weight typed step is plain counting (not fixed for this kind).**
- **Who:** the guesser. A child can solve the step without knowing what heavy or light means.
- **Evidence:** U1 `:333`; the answer equals all blocks drawn in 20,000 of 20,000 draws. U1 Test `blocksOnScaleQuestion` `:138–148` is the same. The fixer is right that a light object can't also balance against blocks, but that doesn't rule out a step that uses the scale idea.
- **Fix:** make step 2 a blocks-only scale with different counts on each side: "How many blocks are on the side that went **down**?" (or **up**, varied). Ring the side on a wrong try and count it in Show me. Change the Test question to match. A wrong answer of the other side's count then shows the idea was missed.

**C2-39 · Major · Layer 5 · The reference block looks like part of the row, so counting gives one too many.**
- **Who:** the first-timer and the behind 2nd grader, in Practice and on the Test.
- **Evidence:** `ObjectGlyph.tsx:65–76` draws it in the same color, size and row. The screenshot of a 5-block scarf shows 6 matching squares. The child is told "Count each block once." Its small "block" label doesn't help a non-reader.
- **Fix:** draw the reference differently (white with a gray outline) inside its own small box, or above the row. Keep it out of every count-along.

**C2-41 · Major · Layer 3 · "Big does not mean heavy" has become "the small one is heavier."**
- **Who:** the procedure-follower and the guesser.
- **Evidence:** the right answer on the Test size question is the small object in 5,000 of 5,000 draws. Every Explore and CFU pair has the same pattern. No Practice bucket uses this idea, although the CFU and both Tests do.
- **Fix:** inside the existing `weightSingle` bucket (no plan change), add a "Which one is heavier?" kind drawn on a scale. Include pairs where the big one **is** heavier (big log and small leaf, train and feather). Use the same mixed pool in the Test.

**C2-43 · Major · Layer 3 · U1 Q5's Look here leads straight to the answer.**
- **Who:** any student after a 2nd miss.
- **Evidence:** the spot says "Look here. Tap a picture." and lists the question's own object. Tapping crocodile printed "The crocodile is long and heavy." (browser).
- **Fix:** show Q5 and its twin on a scale with blocks, so the answer is read from the picture. Point to `u1-down` ("See which side goes down"), which teaches the idea without naming this object.

**C2-44 · Minor · Layer 3 · Two Look here rings miss the scale they talk about.**
- **Who:** the non-reader at U1 Q2 and Q3.
- **Evidence:** the voice says "See the flat scale," but the lit area holds only the example buttons and a sentence. The scale sits outside it, above (`:220–233`, screenshot `b-q3-look.png`).
- **Fix:** wrap the scale, buttons and line in one spot, keeping the mode switch, or move the buttons above the scale inside the lit area.

**C2-46 · Minor · Layer 6 · Practice contradicts balances the lab just taught.**
- **Who:** the careful child.
- **Evidence:** Explore balances the hammer with 4 blocks and CFU Q3 balances the rock with 5. Practice and Test can then show that same object going **down** against as many blocks or more. This is 38.1% of rock and hammer problems, 6.3% of the weight bucket.
- **Fix:** for rock and hammer, draw fewer blocks than their taught balance (at most 3).

**C2-49 · Polish · Layer 5 · The picture doesn't span its row of blocks.**
- **Evidence:** the emoji is drawn at about 72% of the row's width, so the blocks stick out past the object (`ObjectGlyph.tsx:58`).
- **Fix:** where possible, size the picture to the row so the ends line up. Otherwise center it and keep the row clearly under it.

### Unit 2: Which Is Longer? Which Is Heavier?

**C2-45 · Minor · Layer 7 · After "Slide together," touching a rod's end makes it jump shorter.**
- **Who:** the child poking at Explore.
- **Evidence:** in the browser, Rod B went from 8 to 5 after a 1-pixel drag. The drag math still subtracts the old 3-block offset (`LengthBars.tsx:78, :90`).
- **Fix:** use offset 0 for the drag math when `alignStarts` is on.

### Unit 3: Sort and Count

**C2-40 · Major · Layer 4 · Three Groups Show me jumps to the next item.**
- **Who:** every stuck student on the first step of this kind.
- **Evidence:** 2,000 of 2,000 draws. In the browser, the words said "It goes with Yellow" while the ring and arrow were on a **green** triangle, the next question's item (`d-sorthard-showme.png`). The visual uses `done` without branching on `help.showMe` (`:396–400`). The child sees a green item said to go with Yellow, which teaches the wrong rule at the moment of help.
- **Fix:** during Show me on step 0, keep item A ringed and show it moving to its group, with item B still hidden. Do the same for step 1.

**C2-42 · Major · Layer 2 · U3 Test Q8 is a Yes/No question.**
- **Who:** the guesser. It is a 50% guess, and K–1 labs don't use true/false in any form.
- **Evidence:** `ClassifyingAndCountingByCategoryTest.tsx:118–135`. It replaced a true/false item, but E1-02's agreed rewrite was a "where does this one go?" picture.
- **Fix:** make it typed, which avoids repeating Q7: a mixed set of colors and shapes, "We sort by shape. How many circles?" The count needs the rule, and the other attribute still tempts.

**C2-48 · Minor · Layer 6 · A small share of Sort problems fit both rules.**
- **Who:** the careful child.
- **Evidence:** in 1.0% of `sortObvious` draws, both groups also fit the other rule (Red is all circles, Green all squares). So "Color or shape?" has two defensible answers except by reading the label. In 0.3%, the item's other attribute points to the wrong group.
- **Fix:** make sure at least one group visibly mixes the other attribute.

## 5. Persona walkthrough highlights

- **The guesser, any CFU.** Taps wrong, hears a short reason, taps the other button, gets "Yes!" and moves on. Practice opens without the twin having tested anything (C2-38).
- **The first-timer, Blocks.** Hears "How many blocks long is the scarf?", counts every green square and types 6. The answer is 5. On the Test there is no help to show why (C2-39).
- **The behind 2nd grader, Three Groups.** Misses twice and opens Show me. Hears "Yellow" while the arrow sits on a green triangle, right after being told to look at color (C2-40).

## 6. What's working well

- The CFU gate, passed-CFU latch, retry lock and honest star path all hold.
- D6 near-ties are truly guaranteed.
- The offset-rod trap, slide demo and ringed extras now teach the core K.MD.2 idea.
- Unit 3 items now have competing colors and shapes, and Explore checks the sort.
- Tests show no hints or counts. A blind guesser passes at most about 0.09% of the time.
- The number pad covered no picture at any of the 5 sizes, in Practice or Test.

## 7. Rule gaps (proposed for Stage 6; do not apply yet)

Add to `math-lab-builder.md`:

1. "A CFU `twin` on a two-button pick must have the opposite right answer whenever the idea allows, so tapping the other button after a miss can't pass it."
2. "A reference object in a counting picture must look different from the things being counted and must never sit in their row."
3. "A Look here spot must contain the picture its spoken line names, and must not be one tap away from printing the question's answer."
4. "A trap taught as 'X does not mean Y' needs examples both ways, so the opposite shortcut fails."

MG1 also uses same-answer twins (for example `EqualSignAndEquations.tsx:144/171` and `:229/251`). I did not audit other labs.

## 8. What I could not check

- Real iPad speech, finger dragging, and whether 🪵 🪨 🪶 draw on the target iPads.
- Spoken audio beyond code reading. Speech was stubbed in the browser and I did not review a full spoken log; that belongs mainly to the English checker.
- Real students.
- **Unverified:** the test browser page crashed 3 times during long or repeated runs at 820×1180. The same screens then passed in fresh runs (4 Test opens and 3 number-pad runs at that size), with no page errors logged. I could not identify a cause, so this is not a finding. Watch for it on real iPads.
- The number pad was measured on typed Practice and Test questions, not on every question.
- `shared/components/NumberPad.tsx` and `shared/styles/lab-base.css` have uncommitted changes dated 2026-11-20, before this lab's fixes. I treated them as earlier work and did not review them.
