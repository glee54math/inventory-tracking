# MK3 Measurement & Classifying: Review summary

- **Lab:** MK3 `MeasurementAndClassifyingLab`, 3 units + Module Test
- **Standards:** K.MD.1, K.MD.2, K.MD.3 · **Audience:** K–1, audio-first, alone on an iPad
- **Date:** 2026-11-21 · **Rounds:** 3 (the workflow's limit)
- **Status:** the review is done. A manual pass in the running app and a real-iPad check are still needed. Round 3's fixes were verified by the fixer only, because no review round follows round 3.

## Results by round

| Round | Blocker | Major | Minor | Polish | Merged items | Outcome |
|---|---|---|---|---|---|---|
| 1 | 10 | 29 | 17 | 3 | 59 | 54 fixed, 2 partly fixed (limited by D7), 3 skipped |
| 2 | 2 | 9 | 16 | 4 | 31 | 31 fixed |
| 3 | 0 | 2 | 6 | 5 | 13 | 10 fixed, 1 not fixed (E3-68), 2 skipped |

## What changed for students

- **Unit 1:** answers can now be seen in the picture, using clear objects and a reference block. "Tall" is taught with a standing rod. Word questions became picture questions, and "big does not mean heavy" now works in both directions.
- **Unit 2:** students line rods up first and count to check. Extra blocks are ringed and counted, with no subtraction. The scale uses blue and orange sides in place of left and right. Near-ties are guaranteed.
- **Unit 3:** Explore now checks the sort. Colors and shapes compete, three-group ordering is practiced, and Tests no longer print the counts they ask for.
- **All units:** every CFU question has a Look here pointer and a retry question. Practice demos can now be reached after a wrong tap. Language is much shorter and spoken choices are in every CFU pick.
- **Module Test stars:** 14+ = 5, 12+ = 4, 10+ = 3, 8+ = 2, 6+ = 1, otherwise 0. A saved score of 0–5 now shows 0 stars instead of 1.

## User decisions

| # | Decision |
|---|---|
| D1 | Unit 1 uses a fixed reference and objects children agree on |
| D2 | Keep "tall", shown with a standing rod |
| D3 | Differences are "How many extra blocks?", counted from rings |
| D4 | Word matching happens through pictures |
| D5 | Line up is the main method; counting checks it |
| D6 | Keep four Unit 2 buckets, with a guaranteed near-tie |
| D7 | CFU voice fixed in MK3 only; shared `KCheck` unchanged |
| D8 | New Module Test star bands |
| D9 | Keep the visible "Standard K.MD.x" line |
| D10 | Remove the paint question |
| D11 | The typed weight step counts the side that went down or up |
| D12 | Finish the Home screen voice in the MK3 shell |
| D13 | Accept and log the same-spot CFU retry (C3-50) |

## Skipped or not fixed

- **C3-50 (D13):** a wrong tap followed by the same spot passes all 9 two-button CFU picks. Typed CFU questions, Practice and Tests are unaffected.
- **E3-68:** "This is a rod." still plays only after a length word is tapped. Starting on "long" would show a 7-block rod, the answer to Unit 1 CFU Q4. Possible follow-up: draw that picture with 6 blocks, then start on "long".
- **E1-10 (D9):** the Standard line stays.
- **C1-09:** the shared sound banner covers the lower number pad rows until dismissed.
- **C1-11:** typed Practice steps show two Check buttons (shared engine).
- **C3-54:** after a reload, a retry can change kind within its bucket. The retry lock still holds.

## Still open

- CFU questions do not auto-read, and the question number is spoken (D7). A non-reader must tap the speaker on each new CFU question.
- The Module Test heading has no voice.
- The test page crashed 3 times in long browser runs during round 2. Later short runs did not crash, and no cause was found.

## Not verified

- Real iPad speech, including how "Rod A" is said.
- Real finger dragging on the rod handles.
- Whether 🪵 🪨 🪶 draw on the target iPads. They showed as empty boxes in the Windows 10 test browser.
- Real students.
- After round 3: Unit 2 Practice was not re-walked in the browser (its code did not change), and the Module Test was checked by generator only.

## Rule decisions (user, 2026-11-24)

- **Added, tagged with "from MK3" and a grade scope:** 3 (widened: also consider classification sort problems), 4, 8 (widened: verify taught statements, including converse, inverse and contrapositive where they apply), 11, 12, 16, 17, 18, 19, 20.
- **Not added:** 2, 5 (low levels only, so it stays out of the builder), 6, 7, 9 (case by case), 13 (for now), 14.
- **Decided later the same day:**
  - 1: no change for two-button steps (they can't reach a 2nd wrong try, and that's fine). MK3's first-wrong-tap picture is a Look here and stays. Instead, every lab now gets "Show me" after the 2nd wrong try (it replaced "Show answer" after the 3rd for MG3+), with the hint opening on the 1st wrong try.
  - A tapped "Show hint" now costs the star and requires "Try one like it". One wrong typed answer still doesn't require it.
  - "Try one like it" is required in every lab (builder, curriculum checker, fixer). MG3–MG9, MG11 and MM1 still need it added to their shells.
  - 10: not added. The retry question and its button order stay as they are; Practice catches students who didn't read or explore.
  - 15: added. The voice reads a slash between two words as "or" (`mathSpeech.ts`).

## Proposed rule and guideline changes (original list)

**Builder (`math-lab-builder.md`):**
1. A two-button Practice step can't reach Show me. Put its demo in `pointing(help, i)` on the first wrong try, or make it typed.
2. A describing question about one object must be answerable from the picture or a visible reference.
3. A sandbox that accepts student work must check it before praising it.
4. When a diagram can print a count, every Test using it must hide the count if the question asks for or depends on it.
5. An emoji used as a picture must be confirmed on the target iPad version.
6. A reference object in a counting picture must look different from the things counted and must never sit in their row.
7. A Look here spot must contain the picture its spoken line names and must not be one tap from printing the answer.
8. A trap taught as "X does not mean Y" needs examples both ways.
9. A Look here spot for a twin must teach toward the twin's idea.
10. On a two-button `PickCheck`, neither repeating the rejected tap nor tapping the other spot should always pass the twin. **Separate decision:** the user accepted this gap in MK3 (D13).

**English guidelines:**
11. `grade-K.md`: long/short and heavy/light need something to compare to.
12. `grade-K.md`: left and right are not taught in K; use colors or pictures.
13. `grade-K.md`: don't explain a word with its opposite ("Short tells how long").
14. `math-language-traps.md` §1: "circled" sounds like "circle"; say "this one".
15. `math-language-traps.md` §8: a slash between words is silent.
16. `checklist.md` §3: word-only answer buttons must be spoken.
17. `checklist.md` §3: an arrow must not point against the word spoken.
18. `checklist.md` §3: for "How many ___?", count every matching thing on screen.
19. `checklist.md` §3: a first-wrong-tap reason plays right before the twin's question, so write it as a statement.
20. `checklist.md` §3: a group name with a count needs a singular form ("1 triangle").
