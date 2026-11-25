# MK3 Measurement & Classifying: Round 1 merged fix list

- **Lab:** MK3 `MeasurementAndClassifyingLab`, 3 units + Module Test
- **Round:** 1 · **Date:** 2026-11-21 · **Grade band:** K–1, audio-first, alone on an iPad
- **Inputs:** `round-1-curriculum.md` (37 findings), `round-1-english.md` (42 findings). Every ID from both reports appears below.
- **Merged items:** 59 = 10 Blocker, 29 Major, 17 Minor, 3 Polish
- **Decisions:** 56 Fix, 3 Skip, 0 still waiting on the user

The full evidence and suggested wording are in the two reports under each ID. Where this file and a report differ, **this file wins**.

## User decisions (2026-11-21)

| # | IDs | Decision |
|---|---|---|
| D1 | C1-12, E1-13 | Draw each Unit 1 object beside a fixed reference (block or hand) and ask about it against that. **Also** use objects children agree on: train, crocodile, log; snake, scarf, string; rock, brick, hammer; feather, leaf, butterfly. |
| D2 | C1-13, E1-16 | **Keep "tall".** Teach it with a rod standing up: "Tall is long, standing up." |
| D3 | E1-24, C1-34 | **Count the ringed extras.** Line up, ring the extras, ask "How many extra blocks?" on the number pad. No subtraction, no equations, no "how many more/longer" wording. |
| D4 | C1-06, E1-17 | Keep the word-matching bucket **through pictures**: student hears "heavy" and taps the scale picture, not the rods. No word-only questions. |
| D5 | C1-23, E1-26 | **Line up is the main method.** Counting blocks is how to check. |
| D6 | C1-28 | Keep **four** Unit 2 buckets. Guarantee a near-tie within each bucket's two clean solves. |
| D7 | E1-01 | **MK3 only. Do NOT edit shared `KCheck.tsx`.** Put the spoken choices into each MK3 CFU pick prompt. |
| D8 | E1-03 | Module Test stars: 14+ = 5, 12+ = 4, 10+ = 3, 8+ = 2, 6+ = 1, otherwise 0. |
| D9 | E1-10 | **Keep** the visible "Standard K.MD.x" line. User decision; do not raise again. |
| D10 | C1-20, E1-15 | **Remove** the paint question from Practice and Test. Fill the Test slot with a picture question on a skill Practice teaches. |

## Conflict resolutions

- **Spoken choices vs. giveaways (E1-01, E1-35):** say the choices, but not the item's own attribute. "We sort by color. Where does this one go? Yellow or blue?" is right; "Where does the yellow square go?" is not.
- **More typed steps vs. one instruction (C1-04, E1-06):** add typed steps as their own step, each with one short question.
- **Ringed item wording (C1-35, E1-32):** say "this one", with the ring and an arrow on the item. Never "circled" or "item".
- **Wrong-answer line (C1-37, E1-41):** "Match them up. Which has fewer?" Do not state the counts.
- **Shell wording (C1-08, E1-05):** use MG1's lines where they exist ("Do the check first. Then you can practice." and "Only **Mixed** problems give you stars."). Use E1-05's rewrites for the rest.
- **Blocks on the scale (C1-17, E1-30):** draw the real object when a pan holds an object. When counting, use a plain square block, always called "block". Blocks are not a ruler; introduce no standard units.
- **Unit titles (E1-04):** change displayed titles and goals only. Keep unit ids, routes, storage keys, bucket keys and student progress unchanged.

## Fix list

Scope: edit only `MK3/` and this lab's `vocabulary.md`. "U1/U2/U3" are the units.

| ID(s) | Severity | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|
| C1-12 + E1-13 | Blocker | U1 `:26–39`, U1 Test `:19–32` | Long/short and heavy/light graded from assumed size | Fix (D1) | New object list, each drawn beside a fixed reference; the answer must be visible or universally agreed |
| C1-29 + E1-40 | Blocker | U3 Explore `:223, :262` | Wrong sort praised | Fix | Wrong group returns the item with "Look at its color" (or shape). Say "All sorted! Count each group." only when all are right |
| E1-01 | Blocker | MK3 CFU picks | Choices not spoken | Fix (D7) | Put choices in each MK3 prompt. No shared edit. Report that CFU questions still do not auto-read |
| C1-18 + E1-14 | Blocker | U1 `:270–277`, Test `:77–84` | Native dropdown, not fully spoken | Fix | Practice: two choice steps. Test: "The train is long. What else is it?" Heavy, light |
| C1-20 + E1-15 | Blocker | U1 `:278–286`, Test `:157–165` | Off-target paint question | Fix (D10) | Remove; replace the Test slot |
| C1-13 + E1-16 | Blocker | U1 CFU `:73`, `WORDS`, Explore, Practice, Test | "Tall" has two meanings | Fix (D2) | Standing rod; one consistent meaning |
| E1-23 | Blocker | U2 CFU, Explore, Practice, Test | Left/Right untaught and ambiguous | Fix | "Blue side" / "Orange side", color-matched |
| C1-34 + E1-24 | Blocker | U2 `:340–347`, CFU `:104–111`, Test `:145, :168`; U3 `:424–426`, Test `:140–143` | Compare problems, printed counts, "Subtract" | Fix (D3) | "How many extra blocks?" from ringed extras; hide counts; remove equations |
| C1-35 + E1-32 | Blocker | U3 `:290–350`, Test `:49, :70, :181` | "Circled item" | Fix | "this one" + ring + arrow |
| E1-33 | Blocker | U3 `:312` | "What attribute…" | Fix | "How did we sort? Color or shape?" Do not name the rule in the story; vary the answer |
| C1-01 | Major | All 15 CFU questions | No Look here pointer | Fix | Add `look`, `lookHereSpot` and short `say`, using the curriculum table. No spot may show its question's answer |
| C1-02 | Major | 8 CFU picks | Demo unreachable | Fix | Add a `twin` with new values and the same answer type |
| C1-03 | Major | 19 Practice steps | Show me unreachable | Fix | Run the step's demo from `pointing(help, i)` on the first wrong try. No shared-engine change |
| C1-04 | Major | 9 problem kinds | No typed step | Fix | Add a number-pad step that needs the idea |
| C1-05 | Major | Practice + Tests | Fixed answers | Fix | Replace with varied picture questions; memorizing must not pass a Test |
| C1-06 + E1-17 | Major | U1 vocab bucket, Test Q4, Q5, Q8–Q10 | Word-only questions | Fix (D4) | Picture-based word matching |
| C1-14 + E1-20 | Major | U1 `:32`, Test `:25` | Jump rope glyph is not an emoji | Fix | Replace with scarf 🧣 |
| C1-15 + E1-18 | Major | U1 Explore, Key Idea | Explore doesn't teach the CFU | Fix | Add small balance with big-light and small-heavy pairs, all objects, default off CFU answers; E1-18 wording |
| C1-16 + E1-19 | Major | U1 CFU Q1 | Answer in question | Fix | Scale, no pan label: "This side went down. Is it heavy or light?" |
| C1-17 + E1-30 | Major | U1 `:88, :103, :129`; `BalanceScale.tsx:34` | Bricks labeled as objects | Fix | Real objects in pans; replace Q3 with a typed balance-idea question; plain block glyph |
| C1-19 | Major | U1 Test Q8–Q10 | Untaught, no picture | Fix | Picture questions on practiced skills |
| C1-21 | Major | U2 Explore | No lining up or extras | Fix | "Slide together" button; ring and number extras; defaults off CFU's 7 and 4 |
| C1-22 | Major | U2 lengthMisaligned | Trap rare | Fix | Trap in at least half of problems; shift either rod |
| C1-23 + E1-26 | Major | U2 Key Idea, CFU, hints | Competing methods | Fix (D5) | Line up first, count to check; E1-26 wording |
| C1-24 | Major | U2 Explore rods | 23 px handle | Fix | Touch area at least 44 px, or + and − steppers |
| C1-25 | Major | U2 Test Q10 | Gives answer | Fix | Student reads the scale; typed count on the lighter side |
| C1-30 + E1-34 | Major | U3 Test, Module Test | Prints the asked count | Fix | `hideCount` on every Test bin |
| C1-31 + E1-37 | Major | U3 Explore, Practice, Test Q10 | Three-group ordering not practiced; "fewest" untaught | Fix | New kind within the existing order/compare bucket, typed counts, teach "fewest", show all three buttons |
| C1-32 | Major | U3 Explore, Practice, Test | Other attribute never competes | Fix | Mixed shapes and colors; vary the rule |
| E1-35 | Major | U3 CFU `:96, :156` | Prompt names the item | Fix | "Where does this one go?" + spoken choices |
| C1-33 | Major | U3 `:115, :128` | Box colors contradict groups | Fix | Match each box to its group |
| E1-02 | Major | U1 Test `:139`; U2 `:286`, Test `:95, :184`; U3 `:342`, Test `:157` | True/false | Fix | Use E1-02's picture rewrites |
| E1-03 | Major | `ModuleTest.tsx:18–24` | 0 of 15 shows a star | Fix (D8) | New bands |
| E1-04 | Major | Unit titles and goals | Too hard | Fix | E1-04 rewrites, display only; "You finished {title}." |
| C1-08 + E1-05 | Major | Shell text | Too hard | Fix | See conflict resolutions |
| E1-06 | Major | Every Practice opening | Too much speech | Fix | 1–2 word title, one short story line, one prompt |
| E1-25 + E1-28 + E1-42 | Major | U2 wording | Long sentences; "1 blocks" | Fix | Reports' rewrites |
| E1-27 | Major | U1, U2, Tests | Many names for the scale | Fix | "scale", "goes down", "goes up" everywhere |
| E1-36 | Major | U3 Key Idea, stories | Too hard | Fix | E1-36 rewrites |
| C1-07 | Minor | Practice, Test buttons | Rod colors lost | Fix | Color-match unless color reveals the answer |
| C1-09 | Minor | Shared sound banner | Covers pad bottom row | **Skip** | Shared code outside this review; log as open |
| C1-26 | Minor | Balance | Near-ties barely tilt | Fix | Minimum visible tilt about 7° |
| C1-27 | Minor | Rods, pans | Labels collide | Fix | Row spacing; pan labels below the rim |
| C1-28 | Minor | U2 buckets | Near-ties not guaranteed | Fix (D6) | One near-tie per bucket's two clean solves, without weakening C1-26 |
| C1-36 | Minor | U3 bins, buttons | Shape names before MK4 | Fix | Shape picture on each label and button |
| C1-37 + E1-41 | Minor | U3 CFU Q4 | Gives numbers; "less" | Fix | "Match them up. Which has fewer?" |
| E1-22 | Minor | U1 CFU `:133` | States the answer | Fix | "Could you lift a train?" |
| E1-07 | Minor | U1, U3, shell | "Click" | Fix | "Tap" |
| C1-10 + E1-08 | Minor | CFU numbering | Repeats; spoken before counts | Fix | Number 1–5; `data-tts-skip` on the number if MK3 can do this without a shared edit, otherwise report it |
| E1-09 | Minor | Shell Home cards | Not spoken | Fix | Add read-aloud in the MK3 shell |
| E1-10 | Minor | Shell `:262` | Visible standard code | **Skip** (D9) | User chose to keep it |
| E1-21 | Minor | U1 hints | Too abstract | Fix | Reports' rewrites |
| E1-29 | Minor | U2 CFU `:124` | "later" | Fix | "Rod B starts in a new place. Count the blocks!" |
| E1-31 | Minor | U2 Explore | "rod" untaught | Fix | "This is a rod. It is made of blocks." |
| E1-38 | Minor | U3 hints | Too long | Fix | Reports' rewrites |
| E1-39 | Minor | U3 `:262, :424` | "left" | Fix | "Sort 3 more." / "Count the extras: 1, 2." |
| C1-11 | Polish | Shared engine | Two Check buttons | **Skip** | Shared code; consider across K–1 labs |
| E1-11 | Polish | Prompts | All-caps emphasis | Fix | Bold lowercase |
| E1-12 | Polish | `vocabulary.md` | Stray tag; outdated | Fix | Remove the tag; update the list after fixes |

## Open after this round

- CFU questions still do not auto-read, because the shared fix was declined (D7).
- Real iPad checks: speech including "Rod A", finger dragging, and whether 🪵 🪨 🪶 and other newer emoji draw correctly.
- Shared items skipped: C1-09, C1-11.

## Proposed rule and guideline changes (wait for Stage 6; do not apply)

**Builder (`math-lab-builder.md`):**
1. A two-button Practice step can't reach Show me. Put its demo in `pointing(help, i)` on the first wrong try, or make it typed.
2. A describing question about one object must be answerable from the picture or a visible reference.
3. A sandbox that accepts student work must check it before praising it.
4. When a diagram can print a count, every Test using it must hide the count if the question asks for or depends on it.
5. An emoji used as a picture must be confirmed as a real emoji on the target iPad version.

**English guidelines:**
6. `grade-K.md` Watch for: long/short and heavy/light need something to compare to.
7. `math-language-traps.md` §1: "circled" sounds like "circle"; say "this one".
8. `grade-K.md` Math words: left and right are not taught in K; use colors or pictures.
9. `checklist.md` §3 Voice: word-only answer buttons must be spoken.
10. `math-language-traps.md` §8: a slash between words is silent.
