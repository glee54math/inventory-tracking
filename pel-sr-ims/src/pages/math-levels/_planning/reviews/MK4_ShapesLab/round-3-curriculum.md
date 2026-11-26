# MK4 Shapes Lab: Round 3 curriculum review (re-review, final round)

- **Lab:** MK4 `ShapesLab` ("Shapes Lab"): 4 units plus a 20-question Module Test.
- **Round:** 3, re-review. **Date:** 2026-11-25.
- **Grade band assessed:** K–1. The students are Kindergartners and 1st graders seeing this for the first time, plus 2nd graders who are behind. They work alone on an iPad, most can't read, and they rely on the voice.
- **Inputs:**
  - `round-2-merged.md` (25 Fix items and 2 user decisions about shared code) and `round-2-fixes.md`.
  - My own `round-2-curriculum.md`, and the round-1 files for the user decisions that still stand. I did not re-open those decisions: real Unit 4 building; real-object buckets; the reverse-position item kept; sides and corners in U1 Explore; "Flat (2D)/Solid (3D)" kept; "sticks" kept; the landscape layout moved to the shared `lab-base.css`; and the shared `StepProblem` custom-step reason.
- **Independence:** I did not read any round-3 English report.
- **How I checked:**
  - **Code:** I read the shared-code diff (`StepProblem.tsx`, `types.ts`, `UnitTest.tsx`, `lab-base.css`, and MK2's stylesheet) and every changed MK4 part.
  - **Custom steps in other labs:** I searched every lab with custom steps to see how they call `onWrong`.
  - **Browser:** I ran a temporary harness on my own dev server (port 5291), with Playwright and touch on. I walked every question of every unit Test and Module Test in MK1, MK2, MK3, MK4, MG1 and MG2, at 1180×820 and 1366×768. For each question I checked:
    - every answer button, pad key, Check, and Previous/Next button against the screen edge and the read-aloud bar;
    - whether the Test picture was scrolled off the top;
    - how big picture choices were in the new two-column layout.
  - **Targeted run:** a separate run on MG2's "How many tens and ones?" question at all three sizes.
  - **Fixer's screenshots:** I also looked at some of the fixer's screenshots (`scratchpad\r2fix\shots\`), and I say so wherever I use one.
  - **Clean-up:** the harness files (`cur3-harness.html`, `src/cur3Harness.tsx`) are deleted.
- **Screenshots:** `C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\11570f8e-5763-44a1-af9f-c5e70aecc6ac\scratchpad\r3cur\shots\`

## 0. Status of last round's fixes

| ID(s) | Status | Note |
|---|---|---|
| C2-01 | Fixed | The cube's front is a true square (2S × 2S) in `Solid3D`, `CubeFrameBuilder` and the block. The U2 Explore screenshot shows a square front with its ring. |
| C2-02 | Fixed | The strip squares are square, as the U4 CFU Q6 show-it and the "Many ways" screenshots show. |
| C2-03 | Fixed | "Is it flat (2D) or solid (3D)?" comes first, and its explains don't name the shape. "What is its name?" mixes flat and solid names, with the look-alike always one of the buttons. Step 1 no longer gives away a later answer. |
| C2-04 | **Fixed, but caused a new problem** | Every answer control is on screen in all 6 K–1 labs at both landscape sizes, including in the new picture-left / buttons-right layout. The MK1, MK2 and MK3 picture choices still look good: the smallest is 63 px, and the picture is 375–467 px wide. New problem: on MG2's two-box "How many tens and ones?" question, the picture was once scrolled partly off the top (**C3-04**). |
| C2-05 | Fixed | A cube model sits beside the Explore cube builder, and Practice shows it before help. |
| E2-01 | Fixed | The straight shape, an arrow, then the turned shape. The prompt no longer names the shape. |
| E2-02 | **Fixed, but caused a new problem** | The rows show from the start, and the extras are not numbered. But the sticks in each row run together into one bar, so the extras can't be counted before help (**C3-01**). |
| C2-12 + E2-15 | Fixed | One line per wrong try. Shared check: every other lab's custom step calls `onWrong()` with no arguments (MK1 `WordNumeralMatch`, MK2 `OwnWay`), or doesn't use it at all (MG3, MG6–MG9, MG11). No lab passes `onWrong` straight into a click handler, which would have sent a click event as the "reason". The generic line stays for them, so nothing regressed. |
| C2-06 | Fixed | U1 Q2/Q3 number the shapes, Q4/Q5 pass `help`, and U4 Q5 lights and numbers the 3 sticks. |
| C2-07 | Fixed | The count is 0–3, chosen first. The zero line is "No balls are … the box." |
| C2-08 | Fixed | Q7 is "beside" only. |
| C2-09 | Fixed | The can's end is taught in Explore, and Practice and the Test pick the cube's front or the can's end half the time each. The drawing is a separate concern (**C3-03**). |
| C2-10 | Fixed (twin not used; I accept the deviation) | See the judgement below. |
| C2-13 + E2-05 | **Fixed, but caused a new problem** | The rule and its reason are in. But the red "It is full! Same pieces…" line stays on screen while the strip is being refilled (**C3-02**). |
| C2-14 | Fixed | `ballR` is 9 on a 300 px board. The closest balls are about 57 px apart, and the tap circles (about 51 px) don't overlap. |
| C2-11 | Fixed | |
| E2-03 | Fixed | |
| E2-04 | Fixed | |
| E2-06 | Fixed | |
| E2-07 | Fixed | |
| E2-08 | Fixed | |
| C2-15 + E2-10 | Fixed | |
| E2-09 | Fixed | |
| E2-11 + E2-12 + E2-13 + E2-14 | Fixed | |

**Totals: 25 Fix items. 22 Fixed, 3 fixed but caused a new problem, 0 Not fixed.**

**Judgement on the C2-10 deviation (typed CFU Q6, no twin): accept.**
- The builder rule says the 2nd-miss "Look here" must come while at least two answers are still possible, and it names "a typed answer" as one way to meet that. A twin is only for two-button picks.
- Q6 now has a `look` pointer, two "why" lines for the likely wrong numbers (1 and 3), and a show-it that numbers the full strips and rings the empty square. It also raises U4's CFU to 5 of 6 typed.
- The merged list's "Twin: different strips" was over-specified. Nothing is lost by leaving it out.

**Judgement on the fixer's "noticed" item 1 (MK1 and MG2 portrait Tests):**
- It is real. In the fixer's 820×1180 run, MK1 U3 had pad keys 8, 9 and ⌫ below the fold on 4 of 5 questions, and MG2 U5 "What is 81 + 2?" had 9 of 13 keys below.
- Portrait is the main way these students hold the iPad. A non-reader who can't find "8" is stuck until they think to scroll.
- The same `scrollIntoView({block: "nearest"})` only moves the page when something is off screen, so turning it on in portrait carries little risk.
- The user said "portrait unchanged", so this is filed as **C3-05, Needs the user's decision**.

## 1. Verdict

**Ready for students after one small Major fix (C3-01).**
- Round 2's fixes landed cleanly. Shapes are drawn true, flat or solid is decided honestly, every builder has a model, and the shared engine change is safe in every other lab.
- The one learning problem left: Unit 3's new "How many extra?" step relies on lined-up sticks, but the sticks are drawn touching, so a first-try student sees one long bar and can't count the extras.
- The other findings are small. They won't stop a student, but they will slow some down.

**New findings: 0 Blocker, 1 Major, 4 Minor, 0 Polish.**

## 2. Top changes

1. **Separate the sticks in the side rows (C3-01).** This is a two-number change in `SideRows`.
2. **Don't leave a stale "It is full!" or "There is a gap." on screen while the child is rebuilding (C3-02).**
3. **Show the can's end as a true circle beside the can (C3-03).**
4. **Make the landscape Test scroll keep the picture in view (C3-04).** This is shared code.
5. **Decide whether the Test scroll should also run in portrait (C3-05).** This needs the user's decision and is shared code.

## 3. Scorecard (changed parts)

| Layer | U1 | U2 | U3 | U4 |
|---|---|---|---|---|
| 1 Standards | Strong | Strong | Strong | Strong |
| 2 Audience | Strong | Strong | Strong | Strong |
| 3 Learning arc | Strong | Strong | Strong | Strong |
| 4 Getting unstuck | Strong | Strong | OK | OK: a stale red line while rebuilding |
| 5 Pictures | Strong | OK: the can's end is a flat oval | **Weak: the sticks in the rows run together** | Strong |
| 6 Math accuracy | Strong | Strong | Strong | Strong |
| 7 Mastery integrity | Strong | Strong | Strong | Strong |
| 8 Device | Strong | Strong | Strong | Strong |

## 4. All findings

### Unit 3: Sides and Corners

**C3-01 · Major · Layer 5 · The lined-up sticks touch, so the extras can't be counted.**
- **Who:** the first-timer and the behind 2nd grader at Practice "Two shapes", step 2 ("Line them up. How many extra?"). The same rows appear in U3 Explore ("Line up the sides. See the extra ones."), which is that step's teaching spot.
- **Evidence:**
  - `diagrams/Shape2D.tsx:425–442`: each stick is 26 units long with a 4-unit gap, but it is drawn with `strokeWidth 9` and `strokeLinecap="round"`. Each round end reaches 4.5 units past the stick's end, so neighbouring sticks overlap by about 5 units and draw as one solid bar.
  - The fixer's screenshot `r2fix\shots\w3-u3-Two_shapes-s2-wrong1.png` shows two blue bars with no visible breaks. The extras only become countable after a wrong try, when they are ringed.
  - The step is typed and is the E2-02 replacement for "how many more". It works only if the extra sticks can be seen and counted one by one before any help. The corners version (`dots`) is fine, because its dots are separate.
- **Fix:** in `SideRows`, use `strokeLinecap="butt"` with a gap of about 8, or keep the round ends and widen `gap` to about 12. Check that 6 sticks still fit (`width` = `left*2 + 6*(stick+gap)`). Also tie each row to its shape: put a small copy of the shape at the start of each row, or color the two rows and the two shapes in matching tones (Practice passes the same `tone` for both rows). Take screenshots of hexagon versus triangle, and of rectangle versus square ("the same").

### Unit 4: Build Shapes

**C3-02 · Minor · Layer 4 · A wrong-try line stays on screen, in red, while the child fixes the build.**
- **Who:** the guesser and the first-timer in "Many ways" step 2, and in the build, cube and compose steps.
- **Evidence:**
  - In a custom step, the engine's feedback is only cleared by the next wrong try or the solve (`StepProblem.tsx:513`; custom steps have no `onChange`).
  - The fixer's screenshot `r2fix\shots\w7-u4-Many_ways-s2-wrong1.png` shows "2 of 4 squares filled." directly above a red "It is full! Same pieces. Try different pieces." So a non-reader hears or sees "It is full!" next to a strip that is half empty.
  - In the stick builder, "Not yet. There is a gap." stays while the child is adding the missing stick. The fixer noted this too (fixes §6.5).
- **Fix (pick one):**
  - **Shared:** give `CustomStep.render` a third callback, `onEdit()`, that clears `feedback`. Call it from `JoinBuilder` `tapBall`/`tapStick`, from `ComposeBuilder` on a piece tap, and from `StripFiller` `add`. Labs that don't call it are unchanged.
  - **MK4 only:** reword the "many ways" line so it is still true mid-fill: "Same pieces as before. Try different pieces."

### Unit 2: Flat or Solid?

**C3-03 · Minor · Layer 5 · "The end of the can is a circle", but the picture shows a flat oval.**
- **Who:** the careful K child who just learned in Unit 1 that "a circle is round". This is the same kind of problem as C2-01, in a milder form.
- **Evidence:** in the fixer's screenshot `r2fix\shots\u2-explore.png`, the ringed end is an ellipse about 3–4 times wider than tall, next to "Look at the end of the can. It is a circle." The same picture is used in Practice `partStep` and in the Test `cubeFrontQuestion`. The fixer noted this too (fixes §6.3).
- **Fix:** keep the standard 3D can, but add the real-classroom move: next to the ringed can, draw a true circle with a small arrow, as if the can's end were traced on paper. In Explore, add the line "Trace the end. You get a circle." Show the same traced circle in that step's Show me. Do not show it on the Test before an answer.

### Shared code (all K–1 labs)

**C3-04 · Minor · Layer 8 · The landscape Test scroll can leave a tall picture partly above the screen (seen in MG2).**
- **Who:** an MG2 student at 1180×820, on "How many tens and ones?". They must count the tens rods, and the top of the picture is cut off.
- **Evidence:**
  - Screenshot `r3cur\shots\MG2-1180x820-U2-q2.png`: the rods start above the top of the screen, while the boxes, the floating pad and Next are all visible.
  - In a targeted run (32 landscape draws of this question), the picture top sat at −101 px once (1180×820, the 10th question of a sitting). In every other draw the whole picture was on screen.
  - This question uses the floating pad (two boxes, no `.numpad-inline`), so the new two-column rule doesn't apply. The question stays one tall column, 475–693 px.
  - I could not confirm the cause. It could be the `block: "nearest"` scroll running before the picture's final height, or the floating pad's focus scroll. Mark it **partly unverified**.
  - It never happened in MK4, and the fixer's control-only check couldn't catch it, because it didn't look at the picture.
- **Fix (shared `UnitTest.tsx` ~:106):**
  - After the scroll, if the question fits in the window, scroll with `block: "start"` so the picture is never cut. Otherwise, align the picture's top.
  - Run the check again after the pad opens.
  - Optionally, give two-box floating-pad questions the two-column layout too (`.test-question:has([data-numpad])`).
  - Re-check: every MG2 U2 question at 1180×820, and that the picture top is ≥ 0.

**C3-05 · Minor · Layer 8 · In portrait, some MK1 and MG2 Test questions start with pad keys or answer buttons below the fold. Needs the user's decision.**
- **Who:** a K–1 student in MK1 or MG2 holding the iPad upright, who doesn't think to scroll.
- **Evidence:** the fixer's own 820×1180 run (`round-2-fixes.md` §5 and §6.1):
  - MK1 U3 had 4 of 5 questions with keys 8, 9 and ⌫ off screen.
  - MG2 U5 "What is 81 + 2?" had 9 of 13 keys off screen.
  - MG2 U3 had the "=" button off screen.
  - MK4, MK2, MK3 and MG1 had none.
  - This was there before round 2, not caused by it.
- **Options:**
  - (a) Run the same `scrollIntoView` in portrait as well. It only moves the page when something is off screen, and it touches only `.lab-early` labs.
  - (b) Leave portrait alone, as decided on 2026-11-25, and fix MK1 and MG2 when each is next reviewed.
- **My recommendation:** (a), after C3-04 is fixed, so the picture stays in view.

## 5. Persona walkthrough highlights

- **The behind 2nd grader in U3 Practice, step 2.** The two shapes and two blue bars are on screen, with the question "How many extra?". The child can't see where one stick ends, so they guess, get it wrong, and only then see the rings. They do get unstuck, but the step taught through help instead of through the picture (C3-01).
- **The guesser in U4 "Many ways".** They refill the same way twice and hear "It is full! Same pieces. Try different pieces." While they add pieces again, the red "It is full!" stays next to a half-empty strip. Mixed messages, but the hint and Show me still get them through (C3-02).
- **The first-timer in U4 Explore.** They now see a cube to copy beside the clay balls, and the balls are big enough to hit. It is a real improvement on round 2.

## 6. What's working well

- **Every named shape is drawn true:** the cube's front, the strip squares, and the door and window with outside corners only.
- **Unit 2 is honest.** Flat or solid is decided first, and the name step makes the square-or-cube trap a real choice.
- **One feedback line per wrong try** in every builder. The shared change is backward-compatible in every lab with custom steps.
- **The landscape Test layout works across all 6 K–1 labs.** Every control is on screen, picture choices are still large (63–110 px), and MK1/MK2 compare pictures look calm in the two-column layout.
- **The U4 CFU** is now 5 of 6 typed, and Q6's show-it (numbered full strips, ringed empty square) teaches through the picture.

## 7. Rule gaps (proposed for `math-lab-builder.md`; not edited)

1. **Countable things must be visibly separate** (source: MK4 round 3; all grades). "Anything a student must count (sticks, blocks, counters) is drawn with a visible gap between items, checked against stroke width and line caps. Round line caps add half the stroke width to each end."
2. **A custom step's wrong-try line must stay true while the student keeps working** (source: MK4 round 3; all grades). "If a custom step's feedback stays on screen while the student edits, word it so it stays true mid-edit, or clear it when they act."
3. **Landscape Test check includes the picture** (source: MK4 round 3, seen in MG2; K–1). "At 1180×820, check that every key and Check are on screen, and also that the top of the question's picture is on screen."

## 8. What I could not check

- Real iPad touch on the cube's clay balls, and iOS speech for "2D"/"3D".
- The exact cause of C3-04 (1 of 32 draws).
- I did not re-walk every Practice help ladder in the browser. For the unchanged ladders I relied on the code and the fixer's walk (I spot-checked its screenshots).
- A port note for the caller: an older dev server on port 5263 (started 10:14, probably left from round 2) now returns "Outdated Optimize Dep". A failed start of mine cleared Vite's dependency cache. Restart that server if anyone still uses it. My own server (port 5291) is stopped.
