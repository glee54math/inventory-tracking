# MK4 Shapes Lab: English review, round 2

- **Lab:** `MK4_ShapesLab` ("Shapes Lab"): 4 units, 4 unit Tests, and a Module Test
- **Round:** 2 (re-review). Inputs: `round-1-merged.md` (6 user decisions, not re-opened), `round-1-fixes.md`, and my `round-1-english.md`. I did not read any round-2 curriculum report.
- **Date:** 2026-11-25
- **Grade assessed:** Kindergarten band. The audience is K and 1st graders seeing this for the first time, plus 2nd graders who are behind. They work alone on an iPad, most can't read yet, and the lab is audio-first. Standards K.G.1–K.G.6.
- **Read-alone level:** Kindergarten is the youngest grade file, so `grade-K.md` applies: no independent reading, spoken sentences of 8 words or fewer, one idea each.
- **Paths:** unit files are in `MK4/ShapesLab/units/`. U1–U4 are the four units, and "Test" means that unit's `*Test.tsx`. Line numbers are from the current code.

**How the text was checked:**
- I ran the English script (`--grade K`): 435 strings, 12 flagged. All 12 are false positives: plurals whose count is never 1, CSS keyframes, button rows read as one string, and "This one is closed." flagged as passive.
- I read every unit, Test, Module Test and shell file in full, and the builder widgets' feedback text (`StickBuilder.tsx`, `ComposeShapes.tsx`).
- I ran the real `speakableText` on the new lines that are hardest for the voice (quotes, "(2D)", the non-breaking hyphen, ranges of counts).
- I traced each generator by hand at its edge values: circles (0), a count of 1, every real-object name, and every relation.

---

## 0. Status of round-1 English fixes

| ID | Round-1 problem | Status | Note |
|---|---|---|---|
| E1-01 | CFU choices never spoken | **Fixed** | Every word-only pick names its choices in the prompt. U4 Q5 is now a typed question. |
| E1-02 | True/false Test items | **Fixed, but caused a new problem** | All three are replaced with picture questions. But the U1 turned-shape item names its own answer in the prompt (my round-1 rewrite). See **E2-01**. |
| E1-03 | Long titles and goals | **Fixed** | The mastery line is now "You finished this part.", which reads well. |
| E1-04 | Long Key Ideas | **Fixed** | |
| E1-05 | Shell text | **Fixed** | The h1, path cards, Continue button and Module Test card are all voiced now. |
| E1-06 | 30-word Practice openings | **Fixed** | Stories are gone and the question is asked once. Two titles now repeat their prompt (E2-11, Polish). |
| E1-07 | Finished step shows the next answer | **Fixed** | |
| E1-08 | Sides/corners used before they were taught | **Fixed** | U1 Explore now teaches them with tap-to-number squares. |
| E1-09 | Repeated CFU numbers | **Fixed** | |
| E1-10 | Retry reasons written as questions | **Fixed** | |
| E1-11 | "Click" | **Fixed** | |
| E1-12 | Dash and parenthesis asides | **Fixed** | Only "(2D)/(3D)" remains (user decision). |
| E1-13 | All-caps words | **Fixed** | |
| E1-14 | Vocabulary list out of date | **Fixed** | Two small gaps remain: *strip* and *closed* (E2-03, E2-13). |
| E1-15 | "From the BOX's point of view…" | **Fixed** | Reworded as the user decided. The answer varies with the scene. |
| E1-16 | Long position prompt | **Fixed** | |
| E1-17 | "If this square were turned…" | **Fixed** | |
| E1-18 | Many words for turn and size | **Fixed** | One "Little ones" is left in U1 CFU Q2 (E2-12, Polish). |
| E1-19 | Long Explore lines, Left/Right picker | **Fixed** | |
| E1-20 | "Diamond" only answered in text | **Fixed** | |
| E1-21 | "Trace one face" | **Fixed** | "Front of the cube" is taught in Explore and Practice first. |
| E1-22 | "Flat (2D)" voice | **Fixed (voice), unverified on iOS** | Spoken "Is it flat 2D or solid 3D?", with no parenthesis pause. |
| E1-23 | Shading/depth words | **Fixed** | |
| E1-24 | *Side* had three meanings | **Fixed** | U2 never says side or face, and U4 never calls a cube's stick a side. |
| E1-25 | Unit 2 small wording | **Fixed** | |
| E1-26 | "Which shape has more sides?" when the answer is "the same" | **Fixed** | "Which has more sides? Or are they the same?" The answer varies. |
| E1-27 | False rules in the equal-sides explains | **Fixed** | "This triangle's sides are not all the same." |
| E1-28 | "vs.", missing articles | **Fixed** | |
| E1-29 | Unit 3 long lines | **Fixed, but caused a new problem** | The new circle hint "Look all the way around. Find a corner." tells the child to find something that isn't there. See **E2-04**. |
| E1-30 | 25-word "compose" item | **Fixed** | |
| E1-31 | Test items with no picture | **Fixed** | |
| E1-32 | "Which picture correctly shows…" | **Fixed** | The child taps a picture button, and the buttons are spoken "the first picture". |
| E1-33 | Unit 4 untaught words | **Fixed** | *Strip* is still used in the CFU and Test without being taught (E2-13, Polish). |
| E1-34 | Several names for the clay pieces | **Fixed** | |
| E1-35 | "Panel on the right" | **Fixed** | |
| E1-36 | Rename "sticks" | **Skip** (user: keep) | Not re-reported. |
| E1-37 | Arrows and ellipses in the voice | **Fixed** | |

**Totals:** Fixed 34 (one of them, E1-22, is still unverified on iOS) · Fixed, but caused a new problem 2 · Not fixed 0 · Skip 1.

---

## 1. Verdict

**Nearly ready.** The rewrite is a large step up. Every task sentence and every after-answer sentence is now 8 words or fewer, and the script finds no real length problems in the lab. Two things are left that matter:
- **E2-01:** a Test item (also in the Module Test) says the answer in its own prompt: "This triangle got turned. What shape is it now?"
- **E2-02:** a required Practice step asks "How many more sides does the hexagon have?" Grade-K.md lists compare questions as not yet.

Everything else is Minor or Polish.

| Severity | Count |
|---|---|
| Blocker | 0 |
| Major | 2 |
| Minor | 7 |
| Polish | 6 |
| **Total** | **15** |

---

## 2. Scorecard

The Length column is the script's share of strings with a sentence over 8 words. It is 0% in every unit. The shell shows 5% because of two false positives (a button row and the hero, each read as one string).

| Part | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell / Home | Strong (0% real) | Strong | Strong | n/a | Strong | Strong |
| U1 Name It. Where Is It? | Strong (0%) | OK (E2-08) | Strong | n/a | Strong | OK |
| U1 Test | Strong (0%) | Strong | Strong | n/a | Strong | Strong |
| U2 Flat or Solid? | Strong (0%) | OK (E2-09) | Strong | n/a | OK (2D, iOS unverified) | OK |
| U2 Test | Strong (0%) | Strong | Strong | n/a | OK | Strong |
| U3 Sides and Corners | Strong (0%) | Weak (E2-02) | OK (E2-06) | n/a | Strong | OK |
| U3 Test | Strong (0%) | Strong | Strong | n/a | Strong | Strong |
| U4 Build Shapes | Strong (0%) | OK | OK (E2-03, E2-13) | n/a | OK (E2-03) | OK (E2-07) |
| U4 Test | Strong (0%) | Strong | OK (*strip*) | n/a | Strong | Strong |
| Module Test | Strong (0%) | OK (E2-01) | Strong | n/a | Strong | Strong |

There are no word problems in this lab.

---

## 3. All findings

### Unit 1: Name It. Where Is It?

#### E2-01 · Major (from E1-02; my round-1 rewrite)
- **Where:** U1 Test `NamingShapesAndPositionsTest.tsx:143`, `turnedShapeQuestion`. It is also in the **Module Test** (`ModuleTest.tsx:26`).
- **Text:** "This triangle got turned. What shape is it now?" Choices: Triangle / Square / Circle. The rectangle version: "This rectangle got turned. What shape is it now?" Choices: Rectangle / Square / Triangle.
- **Why:** the prompt says the answer word, and that word is one of the buttons. A child who only matches the word they heard gets it right, so the item no longer checks whether turning changes a shape. This was my rewrite in round 1, and it was a mistake.
- **Breaks:** checklist §3 → Giveaways (the answer is stated in the prompt).
- **Rewrite:** let the picture say "got turned", not the words. Show the shape twice: first straight, then turned (a small arrow between them, or the shape turning from straight to its new angle once).
  - Prompt: "It got turned. What shape is it now?"
  - Choices stay the same (Triangle / Square / Circle; for the rectangle, Rectangle / Square / Triangle).
  - Explain: "It is still a triangle." (or "rectangle")
  - The U1 CFU Q1 wording ("This square got turned. Is it a square, or a new shape?") can stay. There the buttons are "Square / A new shape", so the question really is "same or new".

#### E2-08 · Minor
- **Where:**
  - U1 Explore position line `NamingShapesAndPositions.tsx:350–351`: "The ball is in front of the box. **It** hides part of the box." / "The ball is behind the box. **The box hides part of it.**"
  - U2 Explore `FlatOrSolid.tsx:305`: "**This** block is just lines. It is still solid." Nothing marks which of the 5 shapes in the row is "this block".
- **Breaks:** grade-K.md → Grammar (not yet: pronouns that point back to an earlier sentence); checklist → Text vs. picture.
- **Rewrite:**
  - "The ball hides part of the box." / "The box hides part of the ball."
  - U2: ring the line-drawn cube while the line plays, and say "This block is just lines. It is still solid." Or say it without the pointer: "A block of just lines is still solid."

#### E2-10 · Polish
- **Where:** U1 Explore `NamingShapesAndPositions.tsx:303`, "It is still a {shape}!"
- **Why:** it shows from the start, before the child has turned or resized anything. "Still" has nothing to point back to.
- **Rewrite:** show "It is a triangle." until the shape is turned or resized. Then show "It is still a triangle!"

#### E2-12 · Polish
- **Where:**
  - U1 CFU Q2 `:101` `why`: "**Little** ones and turned ones count too." The nudge just before it says "Big ones, small ones…". *Big / small* is the lab's one pair of size words (E1-18).
  - U1 Look-here `:30`: "Look here. A square has sides the same." The order is awkward.
- **Rewrite:** "Small ones and turned ones count too." / "Look here. A square's sides are all the same."

### Unit 2: Flat or Solid?

#### E2-09 · Polish
- **Where:** U2 CFU Q3 `FlatOrSolid.tsx:169`, `why` for 3.
- **Text:** "That is the solid ones. Count the flat ones."
- **Breaks:** grammar ("That is … ones").
- **Rewrite:** "You counted the solid ones. Count the flat ones."

### Unit 3: Sides and Corners

#### E2-02 · Major
- **Where:** U3 Practice `SidesAndCorners.tsx:470`, crossShapeCompare step 2. This step is in a required bucket, in about 2 of 3 problems (every one that isn't a tie).
- **Text:** "How many more sides does the hexagon have?" / "How many more corners does the triangle have?" (the triangle one is against a circle, answer 3).
- **Why:** "How many more does X have?" is the compare, difference-unknown question. grade-K.md lists compare problems as not yet, and traps §4 warns about "more" sentences before 2nd grade. A K child who counts both shapes correctly often answers with the bigger count (6), because "how many … does the hexagon have" is what they hear. The row picture that would help (`SideRows`) only appears after a wrong try. The Unit 3 Test never asks this, so the wording is the only hard part of a Practice-only step.
- **Breaks:** grade-K.md → Word problems ("Not yet: … compare problems") and Grammar; traps §4.
- **Rewrite:** say it as a count of something the child can see. Show the lined-up rows on step 2 from the start (the curriculum checker should agree, because this changes the picture). The extras are already ringed in Explore.
  - Prompt: "Line them up. How many extra?"
  - Hint: "Look at the end of the long row."
  - Show me: "Line them up. The extra ones are 1, 2, 3." (unchanged)
  - Explain: "3 extra. The hexagon has 3 more."
  - If the picture can't change, use: "Count the extra sides. How many?"

#### E2-04 · Minor (from E1-29)
- **Where:** the hint or nudge for a round shape whose answer is 0:
  - U1 `cornersStep` `NamingShapesAndPositions.tsx:372`: "Look all the way around. Find a corner." (cookie, clock, circle)
  - U3 CFU Q3 nudge `SidesAndCorners.tsx:133`
  - U3 `countStep` `:342`: "Look all the way around. Find a straight side." / "Find a corner."
- **Why:** "Find a corner" tells the child that a corner is there. A K child does what the voice says, keeps looking, and may type 1.
- **Breaks:** checklist §3 → Loaded questions (asking as if the answer can't be "none").
- **Rewrite:** "Look all the way around. Is there a corner?" / "Is there a straight side?" It doesn't give the answer away, and "no" can be right.

#### E2-06 · Minor
- **Where:**
  - U3 Explore `SidesAndCorners.tsx:316`: "Line up the sides. The extra ones **stick out**." The sides are drawn as sticks (`SideSticks`) there.
  - U4 `closedPick` hint and Show me `BuildingAndCombiningShapes.tsx:415–416`: "Look for a stick **poking out**." / "Two have a stick poking out."
- **Why:** in this lab, *stick* is the name of a building piece. "Stick out" uses the same word as a verb. *Poking out* is a new idiom that nothing teaches. The U4 prompt next to it already uses the taught phrase *extra stick*.
- **Breaks:** traps §1 (one word, two meanings in one lab); english-learners.md (idioms).
- **Rewrite:** U3 "Line up the sides. See the extra ones." U4 hint "Look for an extra stick." U4 Show me "Two have an extra stick. This one has none."

### Unit 4: Build Shapes

#### E2-03 · Minor
- **Where:** build2D and build3D step 1 `BuildingAndCombiningShapes.tsx:464`, `:499`. The button is in `StickBuilder.tsx:173`.
- **Text:** `Build a square. Then tap "Is it closed?"`
- **Spoken (logged):** "Build a square. Then tap Is it closed?" A listener hears the voice ask *them* a question: "…then tap. Is it closed?" Also, the word *closed* is never explained. It only appears on the button and in "This one is closed."
- **Breaks:** traps §8 (a question inside an instruction); checklist §3 → Untaught words.
- **Rewrite** (keeps the user's "Is it closed?" check):
  - Prompt: "Build a square. Close it all the way around."
  - Add one Explore line under the stick builder: "Closed means no gap."
  - The button keeps its label. It is the only primary button, so the child doesn't need to hear its name.
  - If the label may change, "Check it" removes the problem completely.

#### E2-05 · Minor
- **Where:** "Fill it a new way" (`NewWayFiller`, `BuildingAndCombiningShapes.tsx:645`) and the Explore strip line `:352`.
- **Text:** "It is full! That is the same way. Try a new way."
- **Why:** "same way" means the same *number of each piece* (`twosIn`). A child who puts the same pieces in a new order sees a different-looking strip and is told it's "the same way". On the 2nd try this counts as a wrong try. The message doesn't name what has to change, even though the hint does ("Use different pieces this time.").
- **Breaks:** checklist → Text vs. picture; grade-K.md → Feedback (say what to do).
- **Rewrite:** "It is full! Same pieces. Try different pieces." Explore: "Full! Same pieces. Start over. Try different pieces."

#### E2-07 · Minor
- **Where:** the compose instruction, said three times on one screen:
  - Explore `:316` and the in-step line `:551`: "Tap a piece. Tap Turn to turn it. Tap a spot."
  - Hint `:543`: "Tap a piece. Tap Turn. Tap a spot."
- **Why:** it is three actions in one instruction, and grade-K.md's limit is 1. In Practice the child hears the prompt, then this line, then the hint after a miss. The builder already says "It does not fit. Tap Turn." at the moment Turn is needed.
- **Breaks:** grade-K.md → Limits (one instruction at a time); checklist §5 (screen load).
- **Rewrite:** in-step line and hint: "Tap a piece. Then tap a spot." Let the existing feedback "It does not fit. Tap Turn." teach Turn when it is needed. Explore can keep a second short line: "Tap Turn to turn it."

#### E2-15 · Minor · needs the user's OK (shared code)
- **Where:** shared `StepProblem.tsx:511`. In MK4 it is used by every custom step: build, cube, compose and new-way.
- **Text:** a wrong try in a custom step shows two lines at once. One is the widget's own reason ("Not yet. There is a gap." / "That piece does not fit."). The other is the engine's "Not a match. Try again."
- **Why:** "Not a match" is unclear to a K child, because nothing was being matched. It also repeats a reason that is already clear. The fixer noted this too (round-1-fixes §6 item 2).
- **Breaks:** grade-K.md → Feedback (2–5 words, one message).
- **Rewrite:** let a custom step pass its own feedback, or have the engine say only "Try again." for custom steps. This changes shared code, so other labs need checking first.

#### E2-11 · Polish
- **Where:** Practice titles that repeat their own prompt when the opening is read aloud:
  - "Fill it up" + "Fill it up. It is 5 squares long."
  - "Build a cube" + "Build a cube. Then tap…"
- **Breaks:** E1-06's rule (a title is a label, not the question).
- **Rewrite:** titles "Many ways" (the Explore name) and "Cube".

#### E2-13 · Polish
- **Where:** *strip* in U4 CFU Q6 `:138, :156` and Test `:126`: "Look at both strips. Are both full?" Explore never says the word. The vocabulary list says *strip* is taught by "Fill it up."
- **Rewrite:** teach it in Explore with "Fill the strip. Then fill it a new way." Or say "rows" in the CFU and Test. The picture and "both" already carry the meaning, so this is Polish.

#### E2-14 · Polish
- **Where:** U4 Explore `:362`: "The pieces must touch. A gap is not one shape."
- **Why:** taken literally, it says the gap is a shape.
- **Rewrite:** "The pieces must touch. With a gap, it is not one shape."

---

## 4. What's working well

- **Length is solved.** Every task, hint, Show me, explain and wrap-up is 8 words or fewer. The script's median longest sentence is 4–5 words.
- **The voice now reads the choices.** CFU prompts name their choices, and picture buttons are spoken "the first picture" / "the first cube", which doesn't give away the answer.
- **One word per idea:** *turn*, *big/small*, *clay balls*, *sticks*, *front*, *like a drawing / you can pick it up*.
- **The reverse-position item reads cleanly:** "The ball is above the box. Where is the box?", with matching button sets, and the answer varies.
- **Generated grammar is clean at every value.** Singular and plural agree ("1 ball is…", "2 balls are…", "1 more side"), every pooled name takes "a", and the real-object names carry their own "the".
- **Wrong-try reasons are statements** that don't state the answer ("Something is hidden. Look again.").
- **The shell and Home are short and fully voiced.**

## 5. Out of my lane (for the curriculum checker)

- **E2-02:** showing the lined-up rows on step 2 from the start is a picture change. Please confirm that is wanted.
- **E2-05:** should a new *order* of the same pieces count as "a new way" for K.G.6? The wording should follow that decision.
- **"Front of the cube"** is always "Square" (the fixer noted this too). The wording is fine.
- **The cube build is 12 joins (24 taps)** for a child alone. It is long, but the instructions themselves are fine.
- **The twin rule** (a twin keeps the same answer kind) clashes with the merged C1-30 wording. This is already logged by the fixer for Stage 6.

## 6. Guideline gaps

Proposed additions. I did not edit these files.

- **checklist.md §3 → Giveaways** (all grades, from MK4 round 2): "A prompt that names the shape ('This triangle got turned…') can't ask 'What shape is it?' with that name as a choice. Show the change in the picture instead."
- **checklist.md §3 → Loaded questions** (K–1, from MK4): "When the answer can be 0, the hint asks 'Is there a corner?', not 'Find a corner.'"
- **grade-K.md → Word problems / Grammar** (K–1, from MK4): "'How many more does X have?' is a compare question, even with a picture. In K, ask the child to count the extras they can see ('How many extra?')."
- **grade-K.md → Grammar** (K–1, from MK4): "'Tap each …' is a fine one-action direction. The *each* on the not-yet list means *each* as a quantity word in a problem ('each box has 3')." This settles a conflict between the rule and the lab's (and my own) "Tap each side."
- **math-language-traps.md §8** (all grades, from MK4): "Don't quote a button's label inside an instruction when the label is a question ('Then tap "Is it closed?"'). The voice reads it as a question to the student."

## 7. What I could not check

- How real iPad/iOS voices say "2D", "3D" and "2 square piece".
- The live screens: I read the code and the logged spoken text, and didn't run a browser harness this round. Auto-read order and the Practice opening come from the code and from round-1 findings about `StepProblem`.
- Real children: whether "same way" (E2-05) and "closed" (E2-03) confuse them in practice.
