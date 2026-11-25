# MK3 Measurement & Classifying: Round 2 fixes

- **Lab:** MK3 `MeasurementAndClassifyingLab`, 3 units + Module Test
- **Round:** 2 · **Date:** 2026-11-21 · **Band:** K–1, audio-first, alone on an iPad
- **Applied from:** `round-2-merged.md` (31 merged items, including decisions D11 and D12)

## 1. Summary

| Status | Merged items |
|---|---|
| Fixed | 31 |
| Partly fixed | 0 |
| Needs decision | 0 |
| Not fixed | 0 |

Unit ids, routes, storage keys, bucket keys and saved progress are unchanged. The two new problem kinds live inside existing buckets (`weightSingle`, `countCategory`). No shared code was edited. Nothing was committed or staged. The Standard line stays (D9). C1-09 and C1-11 were not applied.

## 2. Items

U1 = `DescribingHowObjectsAreMeasured.tsx`, U2 = `ComparingTwoObjectsDirectly.tsx`, U3 = `ClassifyingAndCountingByCategory.tsx`, each with its `*Test.tsx`. Locations are names because line numbers moved.

| ID(s) | Status | What changed | Where |
|---|---|---|---|
| E2-43 | Fixed | The arrow now follows the tilt, so a raised side always gets an up arrow; the *light* picture has one too | `BalanceScale.tsx` `point`; `ObjectGlyph.tsx` `WordPicture` |
| C2-39 + E2-44 | Fixed | Reference block is white with a gray outline in its own box, away from the row. "How many blocks are under the {object}?" Hint: "Count the blocks under it." | `ObjectGlyph.tsx` `ObjectOnBlocks`; U1, U1 Test |
| C1-04 | Fixed (D11) | Step 2 is a blocks-only scale: "How many blocks are on the side that went down/up?" Ring on a wrong try, count in Show me. Test matches | U1 `sideCountStep`; U1 Test `blocksOnScaleQuestion`; `labParts.tsx` `sideCountScene` |
| C2-38 | Fixed | All 9 twins now have the other right answer, with new `why`, `showText` and `praise`. U2 Q5's first answer moved to orange | U1, U2, U3 CFUs |
| C2-40 | Fixed | Three Groups Show me keeps the current item ringed as it moves to its group; the next item stays hidden | U3 `sortHard`; `SortedBins.tsx` `arriveId`; styles `.mk3-arrive` |
| C2-41 | Fixed | New "Which one is heavier?" kind on a scale in `weightSingle`, 3 pairs each way. The Test uses the same pool | `labParts.tsx` `sizePairScale`; U1; U1 Test |
| C2-42 | Fixed | U3 Test Q8 is typed over a mixed set: "We sort by shape. How many {shape}?" | U3 Test `wrongAttributeAppliedQuestion`; `labParts.tsx` `mixedShapeSet` |
| C2-43 | Fixed | Q5 and its twin are drawn on a scale and point to `u1-down` | U1 CFU Q5 |
| E2-45 | Fixed | "This is a rod." before each length word's line; added to Unit 1 vocabulary | U1 Explore; `vocabulary.md` |
| E2-46 | Fixed | "This is a scale. The heavy side goes down. The light side goes up." | U1 Explore |
| E2-47 | Fixed | "Short is a few blocks." "Light goes up on the scale." and the two hints | `labParts.tsx` `WORD_LINES`; U1 |
| C2-44 | Fixed | The lit spot now holds the scale, its buttons and its line | U1 Explore |
| C2-45 | Fixed | Drag math uses offset 0 once the rods have slid together | `LengthBars.tsx` `onMove` |
| C2-46 | Fixed | Rock and hammer meet at most 3 blocks | `labParts.tsx` `scaleBlocksFor`; U1, U1 Test |
| C2-47 | Fixed | The asked bin is outlined on a wrong try, with no numbers | `SortedBins.tsx` `outlineBin`; U3 |
| C2-48 | Fixed | At least one group always mixes the other attribute | `labParts.tsx` `mixOtherAttribute`; U3 `sortObvious` |
| E1-09 | Fixed (D12) | Pause between title and goal; Start/Continue and the Module Test card have a voice | Shell `Home` |
| E2-48 | Fixed | "The scale is flat. How many blocks?" | U1 CFU Q3 |
| E2-49 | Fixed | "Many blocks? It is long. Few blocks? It is short." | U1 Explore, hint |
| E2-50 + E2-55 | Fixed | One and many wording for rings and extras; "Count the blocks with rings." | `labParts.tsx` `countExtrasLine`; U2, U3 |
| E2-51 | Fixed | "The circles have…", "It goes with the squares." Colors unchanged | `labParts.tsx` `groupHas`, `groupPhrase`; U3, U3 Test |
| E2-52 | Fixed | "You finished this part. Now take the test." / "…You passed the test." | Shell `UnitView` |
| E2-53 | Fixed | "Count each group. Which has the fewest?" / "…the most?" | U3 |
| E2-54 | Fixed | "Keep sorting the same way." / "You sorted the same way." | U3, U3 Test |
| E2-56 | Fixed | Test results use the Explore word lines | U1 Test `wordPick` |
| E2-57 | Fixed | Q4 shows the real train over its blocks | U1 CFU Q4 |
| C2-49 | Fixed | Picture is sized to about the row's width (capped so it fits) and centered | `ObjectGlyph.tsx` |
| E2-58 | Fixed | "went down" | U2 CFU |
| E2-59 | Fixed | "stops first" | U3 CFU |
| E2-60 | Fixed | "Yes! The rock is heavier." / "Yes! The train is heavier." | U1 CFU Q2 |

### Differences from the agreed wording, and additions the fixes needed

1. **"How many blocks are on the side that went down?" is 10 words,** over the 8-word limit. It is D11's agreed wording, so it stays.
2. **E2-60's "The brick is heavier" became "The train is heavier."** C2-38 flips the twin, so its pair is now a big train and a small leaf.
3. **First-wrong-tap reasons were reworded.** KCheck plays the first question's reason over the twin, so a reason naming the old answer would mislead or give away the twin. New lines: "Heavy goes down. Light goes up." · "Which one is hard to lift?" · "Look at the scale. Which side went down?" · "One rod starts in a new place. Count the blocks!" · "Look at the scale. The heavy side goes down."
4. **U1 Look here for Q2** now says "Look here. See which one goes down." "Big does not mean heavy" would point away from the twin's right answer, the big train.
5. **New Explore example: elephant and mouse** ("This big one is heavy."). Practice now has big-and-heavy pairs, and every Practice idea must be taught first. It is not a CFU pair.
6. **New Practice kind in `countCategory`:** a mixed set, "How many circles?" The new Test Q8 needs it, because the Test may only ask what Practice asks. After a wrong try the set sorts itself and outlines the asked group.
7. **Look here spots changed so they can't show a twin's answer.** The 2nd miss is always on the twin. U2's rods and slide spots now switch to Rod A 8, Rod B 6 (the twins' answer is Rod B). U3's compare picture now says "Red has extras. Yellow has fewer."
8. **U1 CFU Q2 keeps its no-scale first picture.** C2-41's scale applies to Practice and the Tests; the CFU shows the scale in its demo.

## 3. Changed files

All under `src/pages/math-levels/`. **No shared files; no other lab is affected.**

- `MK3/MK3_MeasurementAndClassifyingLab.tsx`, `MK3/MK3_MeasurementAndClassifyingLab_styles.css`
- `MK3/MeasurementAndClassifyingLab/diagrams/`: `BalanceScale.tsx`, `LengthBars.tsx`, `ObjectGlyph.tsx`, `SortedBins.tsx`
- `MK3/MeasurementAndClassifyingLab/units/`: `labParts.tsx`, `DescribingHowObjectsAreMeasured.tsx`, `DescribingHowObjectsAreMeasuredTest.tsx`, `ComparingTwoObjectsDirectly.tsx`, `ClassifyingAndCountingByCategory.tsx`, `ClassifyingAndCountingByCategoryTest.tsx`
- `_planning/Grade-K/MeasurementAndClassifyingLab/vocabulary.md`
- This report

`ComparingTwoObjectsDirectlyTest.tsx` and `ModuleTest.tsx` needed no edits. The Module Test picks up the new size question through its import.

## 4. New or rewritten student text

Generated values are shown as {x}.

**Shell:** Start exploring. (spoken) · Continue. {title} (spoken) · Module Test. 15 questions. (spoken) · You finished this part. Now take the test. · You finished this part. You passed the test.

**U1 Explore:** This is a scale. The heavy side goes down. The light side goes up. · Many blocks? It is long. Few blocks? It is short. · This is a rod. {word line} · Short is a few blocks. · Light goes up on the scale. · This big one is heavy. · elephant and mouse (spoken button)

**U1 CFU:** Heavy goes down. Light goes up. · Now this side went up. Is it heavy or light? · Look: the light side goes up. · Yes! It is light. · Which one is hard to lift? · Yes! The rock is heavier. · A big train and a small leaf. Which is heavier? · Watch: the train goes down. The train is heavier. · Yes! The train is heavier. · The scale is flat. How many blocks? · Count the blocks. · How many blocks are under the train? · Count the blocks under it. · Look at the scale. Which side went down? · Look: the train went down. A train is heavy. · The scarf is long. What else is it? Heavy or light? · Look: the scarf went up. A scarf is light. · Yes! A scarf is long and light. · Look here. See which one goes down.

**U1 Practice and Test:** How many blocks are under the {object}? · Count the blocks under it. · How many blocks are on the side that went {down/up}? · Find the side that went {down/up}. Count its blocks. · Which one is heavier? · Which side went down? · The {object} is heavier. · Short is a few blocks. Find the rod. · Light goes up. Find the scale. · That side has {n} block(s).

**U2:** Now which rod is longer? (twin, answer Rod B) · Look: Rod B goes past Rod A. Rod B is longer. · Yes! Rod B is longer. · One rod starts in a new place. Count the blocks! · Watch: slide them to start together. Rod B is longer. · Look: the heavy side goes down. The {orange/blue} side went down. · Look at the scale. The heavy side goes down. · The rings show the extra blocks: 1, 2. · The ring shows the extra block: 1. · Count the blocks with rings. · Count the extras: 1, 2. · Count the extra one: 1.

**U3 Explore and CFU:** Three groups. The circles have the fewest. The squares have the most. · Match them up. Red has extras. Yellow has fewer. · We sort by color. It goes with red. · Yes! It goes with red. · Look: Red has extras. Green stops first. Green has fewer. · Look: Green has extras. Red stops first. Red has fewer. · Yes! Red has fewer. · We sort by shape now. It goes with the squares. · Yes! It goes with the squares.

**U3 Practice and Test:** The {shapes} have {n}. · The {shapes} have the fewest. · The {shapes} have the most. · It goes with the {shapes}. · How many {shapes}? · Find the {shapes}. Count each one once. · You sorted by shape. · We sort by shape. How many {shapes}? · Look at each shape. · Count each group. Which has the fewest? · Count each group. Which has the most? · Keep sorting the same way. · You sorted the same way. · Match each {group} one with a {group} one. Count the extra one: 1.

## 5. Verification

| Check | Result |
|---|---|
| `tsc --noEmit -p tsconfig.app.json` | **Pass** |
| `eslint` on `MK3/` | **Pass:** 0 errors, 9 `react-refresh` warnings (the accepted pattern) |
| `vite build` (output outside the repo) | **Pass,** no import warnings |
| Test/unit import check | **Pass:** no Test imports its unit |
| Generators: 20,000 draws per bucket, 5,000 of each unit Test, 3,000 Module Tests, plus round 2 checks | **Pass:** 0 failures. Big one heavier in 50% of size pairs, down and up asked 50/50, rock and hammer at most 3 blocks, a retry keeps its kind, every sort mixes the other attribute, mixed-set counts right |
| Every generated sentence read (345 patterns) | **Pass.** Over 8 words only in D11's prompt and in spoken counting lists |
| English script, grade K | **Pass with notes:** 13 flags read by hand. New: D11's prompt (agreed). The rest are the known false alarms and agreed wording |
| CFU walk, all 15 questions, 820×1180 touch | **Pass:** wrong tap gives the twin, the other button does **not** pass (9 of 9), Look here on the 2nd miss, demo on the 3rd, Practice unlocks, passed CFU stays open |
| Practice help walk, 14 problem titles/kinds, fresh browser each | **Pass:** Got it held during demos, no star on a helped solve, Next locked, Try one like it keeps the kind, arrow matches up or down. U2's "Rods" title covers two buckets (same start, different start); the walk reached one of them at random, and neither one's Practice code changed this round |
| Rod drag after Slide | **Pass:** a 1-pixel drag no longer changes the rod |
| Home speech (speech stubbed and logged) | **Pass:** all 7 speakers say the right text |
| Unit Tests (3) and Module Test (15 questions) | **Pass:** no picture prints a count; no arrow disagrees with its word |
| Number pad at 1488×740, 1280×800, 1180×820, 1024×768, 820×1180 | **Pass:** measured clear of the picture on 3 typed Practice kinds and Test Q8 at all 5 sizes. Sample screenshots viewed |
| Dark mode | **Pass** (U1 blocks and scale screenshots) |
| Test page crashes | **None seen.** Runs were kept short, in fresh browsers |

The private test server (port 5317) is stopped. Ports 5173, 5191, 5199 and 5231 were not used. Screenshots are in `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\93b3cb82-1f88-42b8-a81e-c5b257bdf9f1\scratchpad\r2fix\h\shots`.

**Could not verify:**

- Real iPad speech, including "Rod A", and real finger dragging.
- Whether 🪵 🪨 🪶 draw on the target iPads, and how wide emoji draw there. The "picture spans the row" fit (C2-49) was only seen with Windows emoji.
- Real speech timing against the count-along. Speech was stubbed.
- Real students.

## 6. Noticed, not fixed

1. **The sound banner covers part of the number pad until dismissed** (C1-09, skipped). Seen again on the Test at 1180×820, where it hides the pad's lower rows.
2. **CFU questions still do not auto-read, and the question number is still spoken** (D7).
3. **"Long tells how long." and "Heavy tells how heavy."** still explain a word with itself. E2-47 said to leave them.
4. **Color group names are capitalized in some spoken lines** ("It goes with Red.") and lowercase in the CFU ("It goes with red."). E2-51 said colors stay unchanged.
5. **Unused code:** the `select.answer` styles and the stylesheet's header comment about CFU dropdowns.
