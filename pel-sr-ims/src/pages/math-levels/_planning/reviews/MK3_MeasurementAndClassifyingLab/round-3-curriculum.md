# MK3 Measurement & Classifying: Round 3 curriculum re-review (final round)

- **Lab:** MK3 `MeasurementAndClassifyingLab`, 3 units + Module Test
- **Round:** 3, re-review · **Date:** 2026-11-21
- **Grade band assessed:** K–1. K and 1st graders seeing this for the first time, plus 2nd graders who are behind, alone on an iPad, mostly non-readers, audio-first.
- **Standards:** K.MD.1, K.MD.2, K.MD.3, from the approved plan and the condensed K.MD section of `CCSS_K8_STANDARDS_REFERENCE.md`. No finding depends on the exact official wording.
- **Settled and not re-raised:** D1–D12, including the visible Standard line (D9), no shared `KCheck` edit (D7) and D11's prompt wording. C1-09 and C1-11 stay logged as open.
- **Independence:** I did not read `round-3-english.md`.
- **How I checked:** I read the shell, all units, Tests, diagrams and the shared `KCheck`, `CfuPointers`, `lookHere` and clean-solve code. I ran generator checks and short browser runs from a private server on port 5333, which is now stopped. No lab file was edited.

## 0. Status of round 2 fixes

**31 Fix items: 30 Fixed, 0 Not fixed, 1 Fixed but caused a new problem.**

"Browser" means I saw it work in this round. "Code" means I confirmed it by reading the code.

| ID(s) | Status | Checked by | Note |
|---|---|---|---|
| E2-43 | Fixed | Code | A raised side always gets an up arrow |
| C2-39 + E2-44 | Fixed | Browser | White reference block in its own box, away from the row |
| C1-04 | Fixed (D11) | Generator, code | 20,000 draws: the answer is always the asked side; down 49.8% |
| C2-38 | **New problem** | Browser | The other button no longer passes (0 of 9), but **the same button now passes 9 of 9** (C3-50) |
| C2-40 | Fixed | Browser | Show me keeps the right item ringed in its group; next item hidden |
| C2-41 | Fixed | Generator | Big one heavier in 50.4% of 20,000 pairs; the heavier object is always on the low side |
| C2-42 | Fixed | Browser | Typed mixed set. See C3-52 for the missing shape picture |
| C2-43 | Fixed | Code | Q5 and its twin are on a scale and point to `u1-down` |
| E2-45 | Fixed | Code | |
| E2-46 | Fixed | Code | |
| E2-47 | Fixed | Code | |
| C2-44 | Fixed | Browser | The lit spot holds the scale, buttons and line |
| C2-45 | Fixed | Code | |
| C2-46 | Fixed | Code | Rock and hammer meet 2 or 3 blocks |
| C2-47 | Fixed | Browser (mixed count), code (others) | |
| C2-48 | Fixed | Code | |
| E1-09 | Fixed (D12) | Code | |
| E2-48 | Fixed | Code | |
| E2-49 | Fixed | Code | |
| E2-50 + E2-55 | Fixed | Code | |
| E2-51 | Fixed | Code | |
| E2-52 | Fixed | Code | |
| E2-53 | Fixed | Code | |
| E2-54 | Fixed | Code | |
| E2-56 | Fixed | Code | |
| E2-57 | Fixed | Code | |
| C2-49 | Fixed | Code | |
| E2-58 | Fixed | Code | |
| E2-59 | Fixed | Code | |
| E2-60 | Fixed | Code | |

### The checks you asked for

| Check | Result |
|---|---|
| Reworded first-wrong-tap reasons | **Pass.** All 9 fit both the question and its twin, and none names the twin's answer |
| U1 Q2's Look here | **Fails.** The words were changed, but the spot still shows a small object beating a big one and lights "Big does not mean heavy" while the twin's answer is the big train (C3-51) |
| Elephant and mouse example | **Pass as a teaching example.** It draws correctly and says "This big one is heavy." Look here doesn't open it yet (C3-51) |
| Mixed "How many circles?" kind | **Math passes:** 20,000 sets, always 3 to 10 items with all three shapes. After a wrong try the set sorts itself and outlines the asked group, with no printed count. **The shape word has no picture** (C3-52) |
| Look here spots vs. twin answers | **Pass on U2 and U3.** No spot shows a twin's answer, and the child can apply the method to the picture in the question. **U1 Q2 is the exception** because its question has no scale to read |
| Other-button route | **Closed: 0 of 9 pass.** The same-button route is now open (C3-50) |

## 1. Verdict

**Ready after one small fix and one decision.** There are no Blockers, and the math, Tests and Practice help hold up. The biggest remaining problem is that tapping the same CFU button twice passes every two-button question.

**Open findings: 0 Blocker, 2 Major, 1 Minor, 2 Polish.**

## 2. Top changes

1. **Decide how to close the same-button route (C3-50).** Recommended: shuffle the twin's button order.
2. **Open the elephant example from U1 Q2's Look here (C3-51).** This is a one-line change.
3. **Put a shape picture beside the shape word (C3-52).**
4. Say "You counted by shape." on the mixed set (C3-53).
5. Keep a retry's problem kind after a reload (C3-54).

## 3. Scorecard

| Layer | U1 Long and Heavy | U2 Longer / Heavier | U3 Sort and Count |
|---|---|---|---|
| 1 Standards and sequence | Strong | Strong | Strong |
| 2 Audience | Strong | Strong | OK |
| 3 Learning arc | **Weak:** Q2 Look here points the wrong way | Strong | OK |
| 4 Getting unstuck | OK | Strong | Strong |
| 5 Pictures | OK | Strong | OK |
| 6 Math accuracy | Strong | Strong | Strong |
| 7 Mastery integrity | **Weak:** same-button CFU route | **Weak:** same-button CFU route | **Weak:** same-button CFU route |
| 8 Device | OK | OK | OK |

## 4. All findings

### All units

**C3-50 · Major · Layer 7 · Tapping the same button twice passes every two-button CFU question. Needs the user's decision.**
- **Who:** the guesser, at all 9 two-button picks, and any child who double-taps by accident.
- **Evidence:** every twin now has the opposite right answer in the same button position. In the browser, a wrong tap followed by the same spot got "Yes!" on **9 of 9**, with no Look here. A real double-tap passed **8 of 9**, so the child can pass a twin they never saw. This comes from my own round 2 recommendation (C2-38). The builder rule says a twin keeps the same answer type so that repeating the rejected tap doesn't pass. Either fixed pattern leaves one tap route open.
- **Limit of the harm:** the 2 typed questions in each CFU still need the real answer, and Practice and the Tests are not affected.
- **Options:**
  - **A (recommended): shuffle the twin's buttons, in MK3 only.** Each pick decides once whether its twin's two buttons swap places. Repeating a spot then passes about half the time, and accidental double-taps mostly stop. It needs no shared edit and no new questions. A child who finds the same word again can still pass.
  - **B: randomize which answer the twin has.** This is the stronger fix, but it needs a second twin for all 9 picks and a new check of every Look here spot, which is a lot to change in the final round.
  - **C: accept and log it.** No change. The typed questions, Practice and Tests carry the mastery check.

### Unit 1: Long and Heavy

**C3-51 · Major · Layer 3 · U1 Q2's Look here teaches the wrong direction for its twin.**
- **Who:** the child who tapped balloon, then over-corrected to the leaf. That child now believes "the small one is heavier", the misconception C2-41 set out to stop.
- **Evidence:** `DescribingHowObjectsAreMeasured.tsx:180` opens the teddy bear and hammer for `u1-big`. In the browser, on the twin "A big train and a small leaf", the lit spot showed the small hammer going down, with **"Big does not mean heavy."** highlighted. The twin's picture has no scale, so the child can only carry over the idea, and the idea shown points to the leaf. The next miss does show the train going down, so the child is not stuck.
- **Fix:** on `u1-big`, open the elephant and mouse example ("This big one is heavy."). Keep `u1-down` on example 0. The elephant is not a CFU object, so this doesn't show the answer.

### Unit 3: Sort and Count

**C3-52 · Minor · Layer 2 · The mixed set says a shape name with no shape picture.**
- **Who:** the first-timer who doesn't know "triangle" yet. MK4 teaches shape names, and this lab relies on a picture beside each name (C1-36).
- **Evidence:** U3 `:347` and U3 Test `:124–126`. The Test Q8 screenshot shows an unsorted set and "How many squares?", with no shape name or icon in the picture (0 labels found). Practice shows the labeled groups only after a wrong try. The Test gives no such help, so this can cost a child who can sort and count a point on a 9-of-10 pass.
- **Fix:** draw the asked shape beside the word in the Practice and Test prompts, in a neutral color, for example with `ShapeMark`. It names the shape without giving the count.

**C3-53 · Polish · Layer 3 · The mixed set's wrap-up says "You sorted by shape."**
- **Evidence:** U3 `:453`. The child counted, and any sorting on screen was done by the app.
- **Fix:** "You counted by shape."

**C3-54 · Polish · Layer 4 · After a page reload, "Try one like it" can change kind within its bucket.**
- **Evidence:** `labParts.tsx:159–164` keeps the last kind in memory only, so a reload forgets it. Confirmed from the code, not in the browser. The retry stays in the same bucket and the helped problem doesn't come back, so the retry lock still holds.
- **Fix:** store the kind with the retry debt, or leave as is.

## 5. Persona walkthrough highlights

- **The guesser, any CFU pick.** Taps a button, hears a reason, taps the same spot, and gets "Yes!" (C3-50).
- **The first-timer, U1 Q2.** Taps balloon, then leaf, and presses Look here. Sees the small hammer win under "Big does not mean heavy", so the leaf seems right (C3-51).
- **The behind 2nd grader, U3 Test Q8.** Hears "How many triangles?" over an unsorted set, with nothing showing which shape that word means (C3-52).

## 6. What's working well

- 60,000 Practice draws and 90,000 Test question draws had no range or answer-choice errors.
- The size question now works both ways, so neither "big" nor "small" is a shortcut.
- D11's count-the-side step needs the idea of up and down.
- Three Groups Show me now shows the right item moving to the right group.
- The reference block no longer looks like part of the row.
- The mixed set's help teaches sorting without printing a count.

## 7. Rule gaps (proposed for Stage 6; do not apply yet)

Add to `math-lab-builder.md`:

1. "On a two-button `PickCheck`, neither repeating the rejected tap nor tapping the other spot may always pass the twin. Vary the twin's button order or its answer. Test both routes and a double-tap."
2. "A Look here spot for a twin must teach toward the twin's idea. If the first question and its twin go opposite ways (small heavy, then big heavy), the spot must not show only the first direction."

This replaces round 2's proposed rule 11 (always use the opposite answer), which caused C3-50. The builder's current line, "The twin keeps the same answer type," has the matching opposite gap.

## 8. What I could not check

- Real iPad speech, finger dragging and real students. Speech was stubbed in the browser.
- **Emoji:** the rock 🪨 drew as an **empty box** in this Windows 10 test browser. It looks a little like a block, and the rock is in CFU Q2 and Q3, Practice and the Tests. This is the open iPad check from earlier rounds, and it should be confirmed on the target iPads before release.
- I did not repeat the full 5-size number pad check. At 820×1180, the pad did not cover the picture on the mixed Practice problem or Test Q8.
- The test page did not crash in these short runs.
