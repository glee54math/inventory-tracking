# MK4 Shapes Lab: English review, round 3

- **Lab:** `MK4_ShapesLab` ("Shapes Lab"): 4 units, 4 unit Tests, and a Module Test
- **Round:** 3 (re-review, final round). Inputs: `round-2-merged.md` (25 Fix items, 2 user decisions), `round-2-fixes.md` (its "New or rewritten student text"), and my `round-2-english.md`. I did not read any round-3 curriculum report.
- **Date:** 2026-11-25
- **Grade assessed:** Kindergarten band. The audience is K and 1st graders seeing this for the first time, plus 2nd graders who are behind. They work alone on an iPad, most can't read yet, and the lab is audio-first. Standards K.G.1–K.G.6.
- **Read-alone level:** Kindergarten is the youngest grade file, so `grade-K.md` applies: no independent reading, spoken sentences of 8 words or fewer, one idea each.
- **Standing user decisions (not re-opened):** "Flat (2D)/Solid (3D)" kept; "sticks" kept; reverse-position "Where is the box?" kept; sides and corners taught in U1 Explore; real-object buckets; real Unit 4 building.
- **Paths:** unit files are in `src/pages/math-levels/MK4/ShapesLab/units/`. U1–U4 are the four units, and "Test" means that unit's `*Test.tsx`. Line numbers are from the current code.

**How the text was checked:**
- English script (`node scripts/english-check.cjs --grade K` on the shell and lab folder): 452 strings, 12 flagged. All 12 are false positives, the same kinds as round 2: plurals whose count is never 1 ("N sticks", "N corners"), CSS keyframes, the strip button row and the Home hero read as one string, and "This one is closed." flagged as passive. Task text 0/171 over 8 words, after-answer text 0/73.
- I read every unit and unit Test in full, the Module Test, the builder widgets' feedback text (`StickBuilder.tsx` `BUILD_REASON`, `ComposeShapes.tsx` `ComposeBuilder`), `countAlong.ts`, and the new wrong-try path in shared `StepProblem.tsx` (`wrongTry`, `:509–514`).
- I traced each changed generator by hand at its edge values: ball count 0/1/2/3, the part step (cube front / can end), every mixed-name button set, the extras step for every shape pair (including the circle), and the strip "same pieces" path.

---

## 0. Status of round-2 English fixes

| ID | Round-2 problem | Status | Note |
|---|---|---|---|
| E2-01 | U1 Test turned item named its own answer | **Fixed** | `TurnedPair` shows straight → turned; "It got turned. What shape is it now?" The same giveaway is still in a **U4** Test item I missed in round 2: see **E3-01**. |
| E2-02 | "How many more sides does the hexagon have?" | **Fixed, but caused a new problem** | Rows show from the start; "Line them up. How many extra?" reads well. When one shape is a circle there is only one row, and "Line them up" / "the long row" don't fit the picture. See **E3-04** (Minor). |
| E2-03 | `Then tap "Is it closed?"` read as a question; *closed* untaught | **Fixed, but caused a new problem** | "Closed means no gap." is taught; flat prompt reads well. The same prompt on the **cube** ("Close it all the way around.") doesn't fit a 3D frame. See **E3-02** (Minor). |
| E2-04 | "Find a corner" when the answer is 0 | **Fixed** | All three named spots now ask "Is there a corner?". Two more spots with the same pattern remain in U3 (Explore line and Look-here): see **E3-03**. |
| E2-05 | "Same way" for a reorder | **Fixed** | "It is full! Same pieces. Try different pieces." |
| E2-06 | "stick out" / "poking out" | **Fixed** | |
| E2-07 | Three actions in one compose instruction | **Fixed** | "Tap a piece. Then tap a spot." / "Tap Turn to turn it." |
| E2-08 | Pronouns pointing back | **Fixed** | |
| E2-09 | "That is the solid ones." | **Fixed** | |
| E2-10 | "It is still a …" before any change | **Fixed** | |
| E2-11 | Titles repeat their prompts | **Fixed** | "Many ways", "Cube". |
| E2-12 | "Little ones"; "A square has sides the same." | **Fixed** | The Look-here line is fixed, but the Explore line it lights still says "4 sides the same" (E3-06, Polish). |
| E2-13 | *strip* untaught | **Fixed** | "Fill the strip. Then fill it a new way." |
| E2-14 | "A gap is not one shape." | **Fixed** | |
| E2-15 | Two wrong-try lines in custom steps (shared code) | **Fixed** | `wrongTry(i, reason)` shows and reads the step's own reason ("Not yet. There is a gap." / "It does not fit. Tap Turn." / "It is full! Same pieces. Try different pieces.") instead of "Not a match. Try again." One line per wrong try. A small leftover (the line stays on screen after the child fixes the build) is E3-08, Polish. |

**Totals:** Fixed 13 · Fixed, but caused a new problem 2 (both Minor) · Not fixed 0 · Skip 0.

---

## 1. Verdict

**Ready after one Major fix.** The round-2 changes read cleanly, the shared wrong-try change works as intended, and every task and after-answer sentence is still 8 words or fewer. One Test item is left that a child can answer from the words alone:
- **E3-01:** the U4 Test's turned stick-shape item says "This triangle got turned. Is it a square now?" The prompt says it's a triangle, so "No" needs no looking. This is the same giveaway as E2-01, in a different file.

Everything else is Minor or Polish.

| Severity | Count |
|---|---|
| Blocker | 0 |
| Major | 1 |
| Minor | 4 |
| Polish | 3 |
| **Total** | **8** |

---

## 2. Scorecard

The Length column is the script's share of strings with a sentence over 8 words: 0% in every unit and Test. The shell's 5% is two false positives (a button row and the hero read as one string).

| Part | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell / Home | Strong (0% real) | Strong | Strong | n/a | Strong | Strong |
| U1 Name It. Where Is It? | Strong (0%) | Strong | Strong | n/a | Strong | Strong |
| U1 Test | Strong (0%) | Strong | Strong | n/a | Strong | Strong |
| U2 Flat or Solid? | Strong (0%) | Strong | OK (E3-05, E3-07) | n/a | OK (2D, iOS unverified) | OK |
| U2 Test | Strong (0%) | Strong | Strong | n/a | OK | Strong |
| U3 Sides and Corners | Strong (0%) | OK (E3-03) | Strong | n/a | Strong | OK (E3-04) |
| U3 Test | Strong (0%) | Strong | Strong | n/a | Strong | Strong |
| U4 Build Shapes | Strong (0%) | OK (E3-02) | Strong | n/a | Strong | Strong |
| U4 Test | Strong (0%) | Weak (E3-01) | Strong | n/a | Strong | Strong |
| Module Test | Strong (0%) | Strong | Strong | n/a | Strong | Strong |

There are no word problems in this lab.

---

## 3. All findings

### Unit 4 Test

#### E3-01 · Major (same pattern as E2-01; missed in round 2)
- **Where:** U4 Test `BuildingAndCombiningShapesTest.tsx:158–176`, `builtShapeRotatedQuestion`. Not in the Module Test.
- **Text:**
  - "This triangle got turned. Is it a square now?" Choices Yes / No. Answer No.
  - "This square got turned. Is it still a square?" Choices Yes / No. Answer Yes.
- **Why:** the prompt names the shape. In the triangle version, "this triangle … is it a square?" is answered by the words alone: a child who never looks at the picture, or who still thinks a turned shape is a new shape, says "No" and is right. The square version is a fair same-or-new question (like U1 CFU Q1), but "still" leans toward Yes. Half the draws check nothing about turning.
- **Breaks:** checklist §3 → Giveaways (the answer is stated in the prompt); the round-2 proposed rule (round-2-merged.md, English item 5).
- **Rewrite:** do what E2-01 did. Show the stick shape straight, an arrow, then the same stick shape turned (reuse the U1 Test's `TurnedPair` idea with `StickArrangementPreview`; the arrow is `data-tts-skip`).
  - Prompt: "It got turned. What shape is it now?"
  - Choices: Square / Triangle / Rectangle (the right one plus two others).
  - Explain: "It is still a square." / "It is still a triangle."
  - If it must stay Yes/No: "It got turned. Is it the same shape?" with the two-picture view. But then the answer is always Yes, so the curriculum checker should decide; the name pick above keeps the answer varied.

### Unit 4: Build Shapes

#### E3-02 · Minor (from E2-03)
- **Where:** U4 Practice build3D step 1 `BuildingAndCombiningShapes.tsx:518`, and the cube's wrong-try reason from `StickBuilder.tsx:37` (`BUILD_REASON.gap`).
- **Text:** "Build a cube. Close it all the way around." A missing cube stick gets "Not yet. There is a gap."
- **Why:** "close it all the way around" fits a flat ring of sticks, which Explore taught with "Closed means no gap." A cube frame has no single "around": a child can go all the way around the front square and think they are done. The rest of the cube steps say "missing a stick" / "every stick" ("Which cube has every stick?", "Two are missing a stick."), so the cube has two ways of saying the same thing.
- **Breaks:** checklist §3 → Text vs. picture; english-learners.md (one word per idea).
- **Rewrite:**
  - Prompt: "Build a cube like this one." (The cube model is now on screen before help, C2-05.)
  - Cube reason (pass a cube-only reason to `onWrong`, as the flat builder does): "Not yet. A stick is missing." Keep "There is an extra stick. Tap it to take it off." as is.
  - The flat prompt "Build a {shape}. Close it all the way around." stays.

### Unit 3: Sides and Corners

#### E3-03 · Minor (same pattern as E2-04, two spots left)
- **Where:**
  - U3 Look-here for CFU Q3 (circle corners) `SidesAndCorners.tsx:74`: "Look here. Look for a corner."
  - U3 Explore circle line `:256`: "Watch the dot go around. Look for a corner." (this is the key line the Look-here lights).
- **Why:** on a 2nd miss of "How many corners does a circle have?", the voice tells the child to look for a corner that isn't there. The nudge for the same question was fixed in round 2 ("Is there a corner?"), so the child now hears two different messages for one question.
- **Breaks:** checklist §3 → Loaded questions.
- **Rewrite:** Look-here: "Look here. Is there a corner?" Explore: "Watch the dot go around. Is there a corner?" (The next sentence, "It is round all the way.", stays.)

#### E3-04 · Minor (from E2-02)
- **Where:** U3 Practice crossShapeCompare step 2 `SidesAndCorners.tsx:466–478`, picture `:509–513`.
- **Text:** "Line them up. How many extra?" Hint: "Look at the end of the long row."
- **Why:**
  - The rows are already lined up on screen, so "Line them up" is an instruction the child can't carry out. K children try to do what the voice says, and there is nothing to tap.
  - When one shape is a circle (circle vs. triangle, square, rectangle or hexagon, about 1 in 4 non-tie problems), the circle's row is empty. "Line them up" and "the long row" then describe two rows when only one shows, and every stick in the one row is "extra".
- **Breaks:** checklist §3 → Text vs. picture; grade-K.md → Limits (one action the child can do).
- **Rewrite:**
  - Prompt: "Look at the rows. How many extra?"
  - Hint (two rows): "Look at the end of the long row." (unchanged)
  - Hint (one shape is a circle): "The circle has none. Count the other row."
  - Show me (circle case): "The circle has none. The extra ones are 1, 2, 3."
  - The explain "3 extra. The triangle has 3 more." is fine in both cases.

### Unit 2: Flat or Solid?

#### E3-05 · Minor (new text from C2-03)
- **Where:** U2 Practice "What is its name?" steps, `FlatOrSolid.tsx:413` (`nameFlatMixedStep`) and `:422` (`nameSolidMixedStep`).
- **Text and buttons:**
  - Circle: hint "Is it round?", buttons Circle / Sphere / (a flat name).
  - Sphere: hint "Round? A point on top? Like a block?", buttons Sphere / Circle / (a solid name).
- **Why:** the buttons now mix flat and solid names on purpose (C2-03), so the look-alike is always there. But the hint points at the one thing the two answers share: a circle and a sphere are both round. A child who heard "Is it round?" and taps Sphere did what the hint said. The square/cube hints ("Look at the corners." / "Like a block?") have the same weakness, but less.
- **Breaks:** checklist §3 → False distractors (a hint that is true of a wrong answer); grade-K.md → Feedback (say what to do).
- **Rewrite:** name the step-1 idea in the hint. It doesn't give away step 2, because step 1's answer is already on screen.
  - Flat shapes: "It is flat. Look at its corners." / circle: "It is flat and round."
  - Solids: "Round all over? A point on top? Like a block?" (one changed word for the sphere; same length).

#### E3-07 · Polish
- **Where:** U2 `flatSolidStep` `FlatOrSolid.tsx:372–373` ("You can hold it.") and U2 Test `FlatOrSolidTest.tsx:31` ("A cone is solid. You can hold it.").
- **Why:** everywhere else the lab says "pick it up" (Explore, key idea, hint "Could you pick it up?", CFU Q1). *Hold* is a second word for the same idea, and the hint and explain sit next to each other.
- **Breaks:** english-learners.md (one word per idea).
- **Rewrite:** "It is solid. You can pick it up." / "Look: it is like a real thing. You can pick it up." / "A cone is solid. You can pick it up."

### Unit 1 and Unit 2 (shared wording)

#### E3-06 · Polish (from E2-12)
- **Where:**
  - U1 Explore `NamingShapesAndPositions.tsx:366`: "A square has 4 sides the same." This is the Look-here key line that the fixed Look-here ("Look here. A square's sides are all the same.") lights.
  - U2 Practice part step Show me `FlatOrSolid.tsx:391`: "Look: the front has 4 sides the same. It is a square."
- **Why:** the word order is awkward for a listener, and it no longer matches the Look-here line spoken just before it.
- **Rewrite:** "A square's 4 sides are all the same." / "Look: its 4 sides are all the same. It is a square."

### Shared engine (custom steps)

#### E3-08 · Polish (leftover of E2-15; the fixer noted it too)
- **Where:** shared `StepProblem.tsx:511–514` with MK4's build and compose steps.
- **Text:** "Not yet. There is a gap." / "It does not fit. Tap Turn." stays on screen while the child keeps building, until the next check.
- **Why:** after the child adds the missing stick, the screen still says "There is a gap." The text no longer matches the picture. It is read once, so this is Polish.
- **Breaks:** checklist §3 → Text vs. picture.
- **Rewrite:** clear the step's feedback line on the widget's next action (a tap on a ball, stick, piece or Turn). No text change. This touches shared code, so check the other custom-step labs.

---

## 4. What's working well

- **The shared wrong-try change is clean.** Each custom-step miss now gives one short reason that says what to do ("It does not fit. Tap Turn.", "There is an extra stick. Tap it to take it off."), and "Not a match" is gone from MK4.
- **The flat-or-solid-first order reads naturally,** and its explains don't name the shape ("It is flat, like a drawing.").
- **Zero is handled kindly:** "No balls are above the box." and "There are no balls to count. That is zero." Singular and plural agree at 1 ("1 ball is…", "That's 1 ball.").
- **The new teaching lines are short and concrete:** "Closed means no gap.", "Fill the strip. Then fill it a new way.", "Look at the end of the can. It is a circle."
- **The typed strip question** ("How many strips are full?") reads well, and its retry reasons are statements ("One has an empty square. Look again.").
- **Length is still solved:** median longest sentence 4–5 words.

## 5. Out of my lane (for the curriculum checker)

- **E3-01:** the U4 Test turned-shape item checks a Unit 1 idea in the Unit 4 Test. If it becomes a name pick, check it doesn't repeat the U1 Test's turned item in the Module Test (it isn't in the Module Test now).
- **E3-04:** whether the circle should be in the "how many extra" pairs at all (one empty row) is a picture choice.
- **The can's end is drawn as an ellipse** while the answer is "Circle" (fixer's note 3). The wording ("It is round.") is fine; a child might say "oval".
- **Hexagon's look-alike button is "Cube"** (fixer's note 4): harmless for the English.

## 6. Guideline gaps

Proposed additions. I did not edit these files.

- **checklist.md §3 → Giveaways** (all grades, from MK4 round 3; extends round-2 English proposal 5): "Search every unit Test and the Module Test for a prompt that names the shape it then asks about ('This triangle got turned. Is it a square now?'). A Yes/No about a named shape is a giveaway too."
- **checklist.md §3 → Text vs. picture** (K–1, from MK4 round 3): "Don't tell the child to do something the picture has already done ('Line them up.' over rows that are lined up). Say 'Look at…' instead."
- **checklist.md §3 → Hints** (all grades, from MK4 round 3): "When the buttons hold a look-alike on purpose (circle and sphere), the hint must point at what separates them, not at what they share ('Is it round?')."
- **grade-K.md → Watch for** (K–1, from MK4 round 3): "Teach one word for one idea in a 2D build (*closed, gap*) and another for a 3D frame (*every stick, missing a stick*). Don't carry 'close it all the way around' to a cube."

## 7. What I could not check

- How real iPad/iOS voices say "2D", "3D" and "2-square piece".
- The live screens: I read the code and the engine path, and didn't run a browser harness this round. Spoken order (prompt, then the custom step's own line, then the reason) comes from the code.
- Real children: whether "Line them up" makes them try to drag the rows (E3-04), and whether "Close it all the way around" stops cube builders at the front square (E3-02).
