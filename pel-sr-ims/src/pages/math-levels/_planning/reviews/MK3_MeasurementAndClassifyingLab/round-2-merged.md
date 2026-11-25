# MK3 Measurement & Classifying: Round 2 merged fix list

- **Lab:** MK3 `MeasurementAndClassifyingLab`, 3 units + Module Test
- **Round:** 2, re-review · **Date:** 2026-11-21 · **Grade band:** K–1, audio-first, alone on an iPad
- **Inputs:** `round-2-curriculum.md` (13 open findings), `round-2-english.md` (19 open findings). Every open ID from both reports appears below.
- **Merged items:** 31 = 2 Blocker, 9 Major, 16 Minor, 4 Polish
- **Decisions:** 31 Fix, 0 Skip, 0 still waiting on the user

The full evidence is in the two reports under each ID. Where this file and a report differ, **this file wins**. Round 1 decisions D1–D10 in `round-1-merged.md` still apply.

## User decisions (2026-11-21)

These two items were on the round 1 fix list and were still open, so they went to the user.

| # | IDs | Decision |
|---|---|---|
| D11 | C1-04 | **Count the side that moved.** Use a blocks-only scale with different counts on each side. Ask "How many blocks are on the side that went down?" or "went up", varied. Ring the side on a wrong try and count it in Show me. The Test question changes to match. |
| D12 | E1-09 | **Finish it in the MK3 shell.** Add a pause between each card's title and goal, and give the Start/Continue button and Module Test card a voice. |

## Conflict resolutions

- **Reference block (C2-39, E2-44):** do both. Draw it differently (white with a gray outline, in its own small box or above the row, never in the counted row, never in a count-along) **and** ask "How many blocks are under the train?" Keep the reference (D1).
- **U1 CFU Q4 (E2-57, E2-44):** draw the real object with `ObjectOnBlocks` and use the same "under the train" wording.
- **U1 CFU Q3 (E2-48):** "The scale is flat. How many blocks?"
- **U1 CFU Q5 (C2-43):** show Q5 and its twin on a scale with blocks and point to `u1-down`. The spoken line must teach the idea without naming the question's object.
- **Twins and wording (C2-38, E2-58, E2-59, E2-60):** write each flipped twin's `why`, `showText` and `praise` in the new short wording: "went down", "stops first", "Yes! The rock is heavier."
- **Extra-block wording (E2-50, E2-55):** many: "The rings show the extra blocks: 1, 2." One: "The ring shows the extra block: 1." Show me: "Count the extras: 1, 2." / "Count the extra one: 1." Hint: "Count the blocks with rings."
- **Size trap (C2-41):** the new "Which one is heavier?" kind is drawn on a scale, so the answer is read from the picture. It lives inside the existing `weightSingle` bucket; bucket keys and the plan do not change.
- **Word lines (E2-47, E2-56):** the Test results use the same lines as Explore.
- **"Rule" (E2-54):** replace in student text. Internal code names can stay.

## Fix list

Scope: edit only `MK3/` and this lab's `vocabulary.md`.

| ID(s) | Severity | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|
| E2-43 | Blocker | `BalanceScale.tsx:102`, `ObjectGlyph.tsx:94, :106`; U1 `:329`, U1 Test Q10, *light* picture, U2 `:385, :394` | Arrow points down on a side said to go up | Fix | Add arrow direction; a raised side gets an up arrow everywhere |
| C2-39 + E2-44 | Blocker | `ObjectGlyph.tsx:65–79`; U1 `:295, :313, :357`; U1 Test `:132` | Reference block gets counted | Fix | See conflict resolutions. Hint: "Count the blocks under it." |
| C1-04 | Major | U1 `:333`, U1 Test `:138–148` | Weight typed step is plain counting | Fix (D11) | Count the side that went down or up |
| C2-38 | Major | U1 `:62, :87, :140`; U2 `:82, :122, :161`; U3 `:93, :150, :175` | Other button always passes after a miss | Fix | Make each twin's right answer the other choice where the idea allows; move U2 first-show answers off the first button on at least one question |
| C2-40 | Major | U3 `:396–400` | Three Groups Show me marks the wrong item | Fix | During Show me keep the current item ringed and moving to its group, next item hidden; same for step 1 |
| C2-41 | Major | U1 Practice, U1 Test, Module Test pool | "The small one" always wins | Fix | New scale-based kind inside `weightSingle`, with pairs both ways; same mixed pool in the Test |
| C2-42 | Major | U3 Test `:118–135` | Yes/No question | Fix | Typed, mixed set: "We sort by shape. How many circles?" |
| C2-43 | Major | U1 CFU Q5 | Look here leads to the answer | Fix | See conflict resolutions |
| E2-45 | Major | U1 `:373–410`, U1 Test `:32, :39, :157`, `vocabulary.md` | "rod" used before taught | Fix | "This is a rod." on length words in U1 Explore; add to Unit 1 vocabulary |
| E2-46 | Major | U1 Explore `:221` | "scale" never introduced | Fix | "This is a scale. The heavy side goes down. The light side goes up." |
| E2-47 | Major | U1 `:159, :162, :404` | "Short tells how long" | Fix | "Short is a few blocks." / "Light goes up on the scale." Hints: "Short is a few blocks. Find the rod." / "Light goes up. Find the scale." |
| C2-44 | Minor | U1 `:220–233` | Look here ring misses the scale | Fix | Spot contains the scale, buttons and line |
| C2-45 | Minor | `LengthBars.tsx:78, :90` | Drag after Slide shrinks the rod | Fix | Offset 0 in drag math when `alignStarts` is on |
| C2-46 | Minor | U1 Practice, Test | Rock and hammer contradict taught balance | Fix | Draw at most 3 blocks against them |
| C2-47 | Minor | U3 `:364–365, :400, :421, :442` | Count steps don't mark the asked group | Fix | Outline the asked bin on `pointing(help, step)`, no numbers |
| C2-48 | Minor | U3 `sortObvious` | Some sorts fit both rules | Fix | At least one group visibly mixes the other attribute |
| E1-09 | Minor | Shell `:90–92, :102, :121–130` | Home speech incomplete | Fix (D12) | Use `titleSentence`; voice on Start/Continue and Module Test card |
| E2-48 | Minor | U1 CFU Q3 `:98` | Long *as…as* question | Fix | See conflict resolutions |
| E2-49 | Minor | U1 `:214, :287` | "blocks is" | Fix | "Many blocks? It is long. Few blocks? It is short." |
| E2-50 | Minor | U2 `:251, :435`; U3 `:483` | "the extras: 1" | Fix | See conflict resolutions |
| E2-51 | Minor | U3 `:313, :337, :370, :403–404, :445–449`; U3 Test `:39, :52, :112, :146, :160` | "Circles has" | Fix | Helper: "The circles have…", "It goes with the squares." Colors unchanged |
| E2-52 | Minor | Shell `:350, :358` | Title breaks the sentence | Fix | "You finished this part. Now take the test." / "You finished this part. You passed the test." |
| E2-53 | Minor | U3 `:445, :447` | "smallest", "biggest" | Fix | "Count each group. Which has the fewest?" / "…the most?" |
| E2-54 | Minor | U3 `:501, :407` | "rule" | Fix | "Keep sorting the same way." / "You sorted the same way." |
| E2-55 | Minor | U2 `:251, :434` | "ring" vs. one outline per block | Fix | See conflict resolutions |
| E2-56 | Minor | U1 Test `:39` | "The scale shows light." | Fix | Use the Explore word lines |
| E2-57 | Minor | U1 CFU Q4 `:112–115` | No train in the picture | Fix | See conflict resolutions |
| C2-49 | Polish | `ObjectGlyph.tsx:58` | Picture doesn't span its row | Fix | Size to the row where possible; otherwise center it |
| E2-58 | Polish | U2 CFU `:150, :163` | "is down" | Fix | "went down" |
| E2-59 | Polish | U3 CFU `:139, :152` | "runs out" | Fix | "stops first" |
| E2-60 | Polish | U1 CFU `:80, :90` | Feedback too long | Fix | "Yes! The rock is heavier." / "Yes! The brick is heavier." |

## Open after this round

- CFU questions still do not auto-read and the question number is still spoken, because the shared `KCheck` change was declined (D7).
- Real iPad checks: speech including "Rod A", finger dragging, and whether 🪵 🪨 🪶 draw correctly.
- The curriculum checker's test page crashed 3 times in long runs at 820×1180. Fresh runs of the same screens passed, and no cause was found. Watch for it on real iPads.
- Shared items skipped in round 1: C1-09, C1-11.

## Proposed rule and guideline changes (wait for Stage 6; do not apply)

Round 1's list in `round-1-merged.md` still stands. New this round:

**Builder (`math-lab-builder.md`):**
11. A CFU `twin` on a two-button pick must have the opposite right answer whenever the idea allows. MG1 also has same-answer twins; other labs are not audited.
12. A reference object in a counting picture must look different from the things counted and must never sit in their row.
13. A Look here spot must contain the picture its spoken line names and must not be one tap from printing the answer.
14. A trap taught as "X does not mean Y" needs examples both ways, so the opposite shortcut fails.

**English guidelines:**
15. `checklist.md` §3: an arrow must not point against the word spoken.
16. `checklist.md` §3: for "How many ___?", count every matching thing on screen; a reference object of the same kind changes the answer.
17. `grade-K.md` Watch for: don't explain a word with its opposite ("Short tells how long"). Say what it looks like.
