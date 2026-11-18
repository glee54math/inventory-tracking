# MG2 Place Value to 120 — review summary

- **Lab:** MG2 `PlaceValueTo120Lab` (5 units, 5 unit Tests, Module Test) · Grade 1 · treated as the K–1 band
- **Date:** 2026-11-17. This was a scheduled overnight run, so the user wasn't available for "Ask user" items. Those were deferred (listed below), or decided by me and recorded in the merged files.
- **Workflow:** 3 review rounds (curriculum checker and English checker in parallel), 3 merged fix lists, 3 fixer passes. The stopping rule was met after round 3: neither report had a Blocker or Major.
- **Files changed:** only `MG2/` (the shell, 3 diagrams, 11 unit/test files) plus 3 new lab-local files (`diagrams/BlocksPair.tsx`, `diagrams/timing.ts`, `units/words.ts`). Nothing in `shared/` or `MG1/` was edited. Nothing was committed.

## Per round

| Round | Curriculum | English | Fixed |
|---|---|---|---|
| 1 | 0 B · 14 Maj · 11 Min · 2 Pol | 2 B · 19 Maj · 11 Min · 3 Pol | 41 fix rows applied: 35 fully, 6 partly (shared-file limits, or a better lab-local choice) |
| 2 | 0 B · 3 Maj · 8 Min · 3 Pol | 0 B · 1 Maj · 7 Min · 5 Pol | 20/20 fix rows |
| 3 | 0 B · 0 Maj · 3 Min · 2 Pol | 0 B · 0 Maj · 1 Min · 1 Pol | 7/7 fix rows (1 skipped) |

### What changed, in short
- **Round 1:**
  - **Shell:** the shell moved to early-learner mode, like MG1. It now has the number pad, the hint → Show me → Try one like it ladder, and the retry lock. The problem-type picker is hidden.
  - **CFUs:** all 5 were rebuilt with KCheck: 21 one-at-a-time picture questions, 18 of them typed. Each has a "Look here" pointer to an Explore spot on the 2nd miss, and show-it on the 3rd. The passed CFU stays open.
  - **Pictures:** the hundred chart and the blocks no longer show answers before a try. Sticks and cubes are labeled, and pictures respond to a wrong try. Every main step has a Show me.
  - **Explore:** new "Make a ten" in Unit 2, a < / > picture in Unit 3, and the make-a-new-ten animation in Unit 5.
  - **Wording:** all student text was rewritten to short K–1 sentences. Removed: true/false items, dropdowns, arrows that the voice read as "is greater than", "1 tens", decade/multiple/regroup words, and the "tied" idiom.
- **Round 2:**
  - **Unit 3:** the "bigger number" box is no longer colored to match the bigger number. The "equal" bucket became "4 tens and 7 ones ☐ 47".
  - **"digit":** removed everywhere, and the Unit 4 Test items that depended on it were replaced.
  - **Unit 5 Explore:** now counts on instead of counting all.
  - **Unit 2:** the 0-ones help draws the empty spot.
  - **Unit 1:** the count-back answer is hidden until a try.
  - **Also:** Test duplicates and two-answer items fixed, and shell lines simplified.
- **Round 3:**
  - **Unit 3:** the equal bucket now matches only half the time.
  - **Unit 5:** Show me counts on, and the Explore default no longer equals a CFU answer.
  - **Small fixes:** the "Comparing Numbers" title, the wrap-up past 100, the Unit 5 "why" choices, and near-duplicate Test pairs.

### Verification (last fixer pass)
- **Type check, lint, build:** `tsc` has 0 errors. eslint on MG2 has 0 errors. `vite build` passes.
- **Generator check:** the brute-force run used 12,000 problems per Practice bucket or generator and 20,000 Tests per unit. It found:
  - No duplicate choices.
  - No "1 ones/tens", "digit" or arrows.
  - Every value in range.
  - The equal bucket's "=" is right about 50% of the time.
- **Browser walk** at 820×1180 (iPad size) with touch: no console errors. The sound was off, so spoken lines were not heard.

## Skipped
- Changing the ☐ word in `shared/tts/mathSpeech.ts` (round 1): it's a shared file. The lab-side triggers were removed. Also see the open items.
- C3-45 (the "28 + 1" distractor equals the start number): the checker judged it fine.

## Still open (needs the user)
1. **C1-14:** the Unit 1 Test item "Is 110 a new ten or a new hundred?" reaches into 2.NBT.1. Recommendation: replace it with a typed "What comes after 109?".
2. **C1-15:** 1.NBT.1 "write a numeral for a number of objects" for 100–120 isn't practiced. Recommendation: add a Unit 1 "How many?" bucket (e.g. 11 sticks + 4 cubes → 114). This is a plan change.
3. **Pass score:** unit Tests pass at 9/10. Recommendation: keep it until a real student tries the lab.
4. **E2-37 (same as MG1 E2-38):** the voice says "blank" for ☐ while the text says "box". Recommendation: change the shared `mathSpeech.ts` map to "box" once, for all labs.
5. **KCheck title:** `CheckSequence` hard-codes "Show what you know!". It's fine for K–1; the option is an optional `title` prop.
6. **Test engine:** in Tests, the `<` `=` `>` choices are read aloud as words. The option is an optional spoken-text field on `ChoiceStep` (a shared engine change).
7. **Minor leftovers** from the last fixer:
   - About 6% of Unit 5 Tests repeat a sum.
   - The Unit 4 Key Idea "only the tens change" isn't literally true past 100.
   - The equal bucket's typed step can still be copied when the blocks match.

## Proposed rule changes (not applied; waiting for approval)

**Builder (`math-lab-builder.md`):**
1. **Band table:** K–1 = MK1–MK4, MG1, and every lab built from a Grade-1 plan (MG2–MG4). The read-aloud band = MG5. *(Raised in round 1. It decides whether MG3/MG4 get the early shell + KCheck.)*
2. Practice and Test pictures must not mark, color or print a step's answer before that step is done. Tests draw only the givens.
3. No step's prompt may contain a later step's answer, because finished prompts stay on screen.
4. A "Say…"/"Count…" control must speak each number it shows.
5. In hand-built CFUs, changing an answer clears the check. Fields never re-grade live.
6. Color-match an answer box only when the box stands for one fixed part of the picture. Use a neutral tone when the question is *which* part.
7. When a Practice step changes, update the matching Test and Module Test items in the same change.
8. Help for a part that is 0 must still change the picture (draw the empty spot).

**English guidelines (`.claude/reference/english-for-math/`):**
9. `math-language-traps.md §8`: never type `->`. The voice reads it as "is greater than".
10. `math-language-traps.md §8`: no bare signs inside sentences ("Use >, =, or <").
11. `math-language-traps.md §1`: never use "ones" as a pronoun in a tens-and-ones lab.
12. `grade-1.md`, Not yet: decade, regroup/carry, multiple of ten (with their replacements).
13. `checklist.md §3`: symbol-meaning questions get answered by ear.
14. `checklist.md §3`: a word after a blank must not depend on the blank's answer; put the label before the box.
15. `checklist.md §3`: a later unit or Test must not use a word that no earlier unit teaches (e.g. *digit*). Check titles too.
16. `checklist.md §3`: the voice must say the word the text prints (☐).

## Next
A manual pass in the running app is still needed, with sound on, then a real student on a real iPad. Headless checks can't confirm iOS Safari speech, real touch feel, the pacing of the count-along animations, or how a young student actually uses the lab.

Reports are in this folder: `round-1-*.md`, `round-2-*.md`, `round-3-*.md`.

## Rule decisions (user, 2026-11-18)

Applied to `.claude/agents/math-lab-builder.md` (+ curriculum checker, English checker, fixer, skill where they repeat it) and `.claude/reference/english-for-math/`:

| # | Decision |
|---|---|
| 1 | Yes. K–1 band = MK1–MK4, MG1–MG4. Read-aloud band = MG5. |
| 2 | Yes, extended: a Test picture must not give the answer away. Pictures the student must work from are fine. The builder judges each Test picture. MG2: charts removed from the Unit 1 and Unit 4 Test items that printed the answer. |
| 3, 4, 7, 8 | Yes. |
| 5 | Yes, extended: one question at a time in every K–5 CFU. Only MM (6–8) labs keep multi-part CFU questions. |
| 6 | Changed: use color boldly (key word in the prompt + picture part + answer box). Plain only when the question is *which* colored thing is the answer. |
| 9–11 | Yes. |
| 12 | Yes, plus a general rule: watch for any word the grade probably hasn't learned. |
| 13 | No change. The current guidelines are fine. |
| 14 | Rejected: keep correct grammar after a blank even if it hints ("☐ ten"). Never write "ten(s)". |
| 15 | Yes, plus per-lab vocabulary lists: `_planning/Grade-*/{LabName}/vocabulary.md`. First one: `Grade-1/PlaceValueTo120Lab/vocabulary.md`. |
| 16 | Not needed. Voice "blank", text "box" is fine (noted in traps §8 so checkers stop flagging it). |

Also fixed: the voice now reads ⭐ as "star" (`shared/tts/mathSpeech.ts`).
