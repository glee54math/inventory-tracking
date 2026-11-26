# MK4 Shapes Lab: English review, round 1

- **Lab:** `MK4_ShapesLab` (shown to students as "Shapes Lab"), 4 units + Module Test
- **Round:** 1, full review. No `round-0-build.md` exists.
- **Date:** 2026-11-25
- **Grade assessed:** Kindergarten band (K and 1st graders seeing this for the first time, plus 2nd graders who are behind; alone on an iPad; mostly non-readers; audio-first). Standards K.G.1–K.G.6.
- **Read-alone level:** Kindergarten is the youngest grade file, so there is no younger file. grade-K.md's rule applies: assume no independent reading. Spoken sentences: 8 words or fewer, one idea.
- **Earlier labs:** `LAB_NEEDS` lists only MK1 for MK4. So words from MK2 and MK3 (*side*, *flat*, *block*) are not assumed known. MK1 teaches *tap*, *turn upside down*, and *circle* only as a ring of counters.
- **Paths:** unit files are in `MK4/ShapesLab/units/`. "U1"–"U4" are the four units. "Test" means that unit's `*Test.tsx`. Line numbers are from the current code.

**How the text was checked:** the English script (`--grade K`, 364 strings, 178 flagged). Then a bundled scratch run of every Practice generator, 300 draws per bucket, and every Test question, 200 draws each. Every sentence was passed through the real `speakableText`. I also read the four CFUs, every Explore, the shell, `KCheck.tsx`, `StepProblem.tsx`, `UnitTest.tsx`, `reading.ts` and `mathSpeech.ts`.

**Facts that shape the findings:**
- The voice skips SVGs, so picture labels and `aria-label`s are never spoken. They are not findings here.
- `UnitTestView` never shows a Test question's `hint`, so Test hints are not findings. Test explains are shown and read on the results screen.
- In Practice, a finished step stays on screen **with its answer chip and its `explain`** (`StepProblem.tsx:568–580`), while the next step is asked. This drives E1-07.
- `KCheck` CFU questions don't auto-read, and their answer buttons are never spoken. This is shared code, and MK3 decision D7 was to fix it in each lab's prompts.
- Generated grammar is clean: no a/an slips and no "1 sticks"-type plurals at any value. Every count the generators produce is 0 or 3+, except the literal "1 unit".

---

## 1. Verdict

**Not ready.** The CFUs are short and close to the right level. Practice, the Tests and most screen text are written for older readers. Five items can mark a student wrong even when they know the shapes:
- 6 CFU picks whose choices are never spoken
- a Test prompt that corrects itself mid-sentence
- a "trace one face" Test question
- "Which shape has more sides?" when the answer is "the same"
- a 30-word Test question about "composing", with no picture

Beyond those, the lab uses many words for the same moves (*turn / rotate / flip / resize / tilt*). *Sides* and *corners* are used two units before they are taught, and Unit 2 and Unit 4 add many untaught words.

| Severity | Count |
|---|---|
| Blocker | 5 |
| Major | 17 |
| Minor | 13 |
| Polish | 2 |
| **Total** | **37** |

**Four findings need your decision:** E1-08, E1-15, E1-22, E1-36. They are collected in section 3a.

---

## 2. Scorecard

Length = task, after-answer and screen strings with a sentence over the 8-word limit (from the script; Test figures include hint strings students never see).

| Part | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell / Home | OK (30%) | OK | Weak | n/a | Weak | Weak |
| U1 Naming Shapes and Positions | Weak (68%) | Weak | Weak | n/a | Weak | Weak |
| U1 Test | Weak (53%) | Weak | Weak | n/a | Weak | OK |
| U2 Flat or Solid | Weak (39%) | OK | Weak | n/a | OK | Weak |
| U2 Test | Weak (43%) | Weak | Weak | n/a | OK | OK |
| U3 Sides and Corners | OK (34%) | OK | OK | n/a | OK | OK |
| U3 Test | OK (37%) | Weak | OK | n/a | OK | OK |
| U4 Building and Combining | Weak (61%) | Weak | Weak | n/a | Weak | Weak |
| U4 Test | Weak (73%) | Weak | Weak | n/a | OK | Weak |
| Module Test | Reuses 20 unit Test items (3 true/false, 1 loaded question, the "compose" item) | Weak | Weak | n/a | OK | OK |

This lab has no word problems, so that column is n/a. U3 is the strongest unit.

---

## 3a. Decisions needed from you

| ID | Question | Recommendation |
|---|---|---|
| **E1-08** | Units 1 and 2 use *sides* and *corners* in hints and CFU help, two units before Unit 3 teaches them. Should Unit 1's Explore teach "side" with a picture, or should Units 1–2 stop using the words? | Add one short picture line to U1 Explore ("A square has 4 sides." with the sides lighting up). Remove *corners* from U1–U2. |
| **E1-15** | The "where is the box, from the ball's point of view?" item is in U1 Practice (step 2 of every position problem) and the U1 Test. The plan doesn't ask for it. Its Test prompt is garbled. Remove it, or keep it reworded? | Remove it from Practice and the Test. Fill the Test slot with another position picture. |
| **E1-22** | Every flat/solid button and prompt says "Flat (2D)" / "Solid (3D)". K.G.3 says *flat* and *solid*, and "2D/3D" is never taught. Drop "2D/3D" from student text? | Drop it everywhere. Say only *flat* and *solid*. |
| **E1-36** | MK4 calls a shape's side a *stick*. MG2 calls one ten a *stick*. Rename MK4's pieces? | Rename to *straws* in MK4 (Explore, CFU, Practice, Test). |

---

## 3. All findings

### Shell and all units

#### E1-01 · Blocker
- **Where:** CFU picks whose choices are only on buttons: U1 `NamingShapesAndPositions.tsx:43`, `:88`, `:105`; U2 `FlatOrSolid.tsx:52`, `:135`; U4 `BuildingAndCombiningShapes.tsx:52`, `:96`.
- **Text:** "This square got turned. What shape is it now?" (buttons *Square / A new shape*). "Where is the ball?" (*Beside the box / In front of the box*). "Now where is the ball?" (*Above / Below*). "Which one can you pick up and hold?" (*Circle / Sphere*). "What is this solid shape?" (*Cube / Cylinder / Cone*). "Two triangles join together. What shape do they make?" (*Square / Triangle / Circle*). "The clay balls are the cube's..." (*Corners / Sides*).
- **Spoken:** only the question, and only when the student taps the speaker. `PickCheck` buttons are not read (`KCheck.tsx:38–44, :164`). The last item is spoken "The clay balls are the cube's." It sounds like a finished sentence.
- **Breaks:** grade-K.md → What they can read ("Every word a student needs must be spoken"); checklist §3 → Voice (word-only answer buttons must be spoken, from MK3).
- **Rewrite** (MK3 decision D7: put the choices in the prompt; don't edit shared `KCheck`):
  - U1 `:43` "This square got turned. Is it a square, or a new shape?"
  - U1 `:88` "Is the ball beside the box, or in front of it?"
  - U1 `:105` "Now is the ball above the box, or below it?"
  - U2 `:52` "Which can you pick up? The circle or the sphere?"
  - U2 `:135` "What solid is this? Cube, cylinder, or cone?"
  - U4 `:52` "Two triangles join. Square, triangle, or circle?"
  - U4 `:96` "What are the clay balls? Corners or sides?"
  - U2 `:110` already names its choices, and U3 `:66` is a yes/no question. Those two are fine.

#### E1-02 · Major
- **Where and rewrite:** true/false questions, which K–1 labs don't use. All three are also in the Module Test.

| Location | Now | Rewrite (one new picture example each) |
|---|---|---|
| U1 Test `:157` | True or false: turning (rotating) a shape around can make it become a different shape. | Picture of a turned triangle. "This triangle got turned. What shape is it now?" Choices: Triangle, Square, Circle. |
| U2 Test `:132` | True or false: a round shape in a picture must always be solid (3D), just because it looks round. | Picture of a flat circle. "This shape is round. Is it flat or solid?" |
| U4 Test `:158` | This strip was filled exactly using squares and dominoes. True or false: this is the ONLY combination of pieces that could fill it exactly. | Two different filled strips of the same length. "Are both full?" Choices: Yes, No. Or drop it; see E1-33. |

- **Breaks:** grade-K.md → Grammar ("Not yet: True or false"); builder → K–1 CFU (no true/false). Each is also 15–19 words, with *rotating*, *combination*, *exactly*, *must always*.

#### E1-03 · Major
- **Where:** unit titles and goals: U1 `:295–296`, U2 `:318–319`, U3 `:317–318`, U4 `:454–455`. Titles also appear in "Continue: …", the rail, and "You've mastered …" (shell `:87, :343, :351, :426`). The goal is read aloud.
- **Breaks:** grade-K.md → Limits (8 words); untaught *positions, resized, describe, common, materials, combining*. "vs." is read as "vs" (traps §8). Goals run 15–23 words.

| Now | Rewrite |
|---|---|
| Naming Shapes and Positions | Name It. Where Is It? |
| Name common shapes — even turned or resized — and describe where something is using words like above, below, beside, in front of, and behind. | Name shapes, even turned ones. Tell where the ball is. |
| Flat or Solid? (2D vs. 3D) | Flat or Solid? |
| Tell whether a shape is flat (2D) or solid (3D), and name common solid shapes like cube, cone, cylinder, and sphere. | Is it flat? Is it solid? Name the solid. |
| What Makes a Shape a Shape (Sides and Corners) | Sides and Corners |
| Describe a shape using words like sides, corners, and equal sides — and compare shapes using those words. | Count sides. Count corners. Compare two shapes. |
| Building and Combining Shapes | Build Shapes |
| Build a shape out of simple materials, and put smaller shapes together to make a bigger one. | Build shapes with sticks. Put shapes together. |

With short titles, change the mastery line to "You finished {title}." (as MK3 did). "You've mastered name it. where is it?" would not make sense.

#### E1-04 · Major
- **Where:** Key Ideas, read aloud at the top of every unit: U1 `:300–301`, U2 `:323–324`, U3 `:322–323`, U4 `:459–460`.
- **Text (longest):** "A shape stays the SAME shape no matter which way it's turned or how big or small it is — a tilted square is still a square, never a "diamond."" (28 words). "A circle and a sphere (or a square and a cube) can look alike in a picture — shading that shows depth is the real tell." "How LONG a shape's sides are is different from how MANY sides it has — a square and a non-square rectangle both have 4 sides." "Sticks joined end-to-end (no gaps, no crossing) can show a shape's sides — corners are where they meet."
- **Breaks:** grade-K.md → Limits, Grammar (two clauses); untaught *tilted, depth, shading, tell, non-square, end-to-end, describe, exactly, compared*.
- **Rewrite:**
  - U1: "Turn a shape. It is the same shape." / "Big or small, it is the same shape." / "Above, below, beside, in front of, behind."
  - U2: "Flat shapes are like drawings." / "Solid shapes you can pick up."
  - U3: "A side is straight." / "A corner is where two sides meet." / "A circle has no sides and no corners."
  - U4: "Each stick is one side." / "Small shapes can make a big shape." / "There can be more than one way."

#### E1-05 · Major
- **Where and rewrite:** shell text. Use MK3's shell lines where they exist.

| Line | Now | Rewrite |
|---|---|---|
| `:84` | Squares, circles, and cubes! (h1, not voiced) | Voice it (`ReadAloud as="h1"`), as MK3 `:88` does. |
| `:85` | Name shapes (even turned or resized), tell flat from solid, count sides and corners, and build bigger shapes out of smaller ones. | Name shapes. Flat or solid? Count sides. Build shapes. |
| `:99–108` | Path cards: title and goal not voiced | Wrap each card in `ReadAloud` with title + goal, as MK3 `:104` does. |
| `:113` | Solve each kind of problem 2 times by yourself to fill in your stars. Only Mixed problems count. | Solve each kind 2 times. Fill your stars. |
| `:120` | 20 cumulative questions, 5 from every unit in this lab. | 20 questions. (Voiced, as MK3 `:123`.) |
| `:298` | Complete the activity above to unlock practice problems. | Do the check first. Then you can practice. |
| `:321` | Practicing one type is great for extra reps, but only **Mixed** problems count toward your mastery stars. | Only **Mixed** problems give you stars. |
| `:343` | You've mastered {title}. Take the test to finish this unit. | You finished {title}. Now take the test. |
| `:351` | You've mastered {title} and passed the test. | You finished {title}, and you passed the test. |
| `:454` | Click again to clear all stars | Tap again to clear all stars |
| `:463` | 20 cumulative questions covering every unit in Shapes Lab — 5 from each. | 20 questions. |

- **Breaks:** grade-K.md → Limits, What they can read; later words *cumulative, mastery, reps, unlock, resized*.
- The visible "Standard K.G.x" line (`:262`) is not raised here, per MK3 decision D9.

#### E1-06 · Major
- **Where:** every Practice opening. `StepProblem.tsx:463` auto-reads title + story + first prompt + choices.
- **Spoken (examples):**
  - U1 position, 30+ words: "Where is it? Look at where the ball is, compared to the box. Which word describes where the ball is, compared to the box? Above. Below. Beside."
  - U1 name: "Name the shape. This shape has been turned. What shape is it? What shape is this? Square. Diamond."
  - U2 tricky pair: "Flat or solid? the tricky pair. This round shape can look a lot like its flat cousin in a picture, look closely at the shading. Is this shape flat 2D or solid 3D? Solid 3D. Flat 2D."
- **Breaks:** grade-K.md → Limits (one instruction); checklist §5 (K–1: no reading before acting). The question is said two or three times in different words.
- **Rewrite:** make each title a 1–2 word label that is not the question ("Shapes", "Ball and box", "Flat or solid", "Sides", "Build"). Cut each story to one short line or none; the step prompt asks the question once. Specific stories are in E1-16, E1-17, E1-23, E1-33.

#### E1-07 · Major
- **Where:** a finished step's answer chip and `explain` stay on screen while the next step asks for the same thing.

| Problem | Finished step shows | Next step asks |
|---|---|---|
| U1 name shape `:232` | "This is a Square, no matter how it's turned or resized." | "…would it still be a Square?" |
| U2 classify 2D `:230` | "A square is flat (2D) — it has no depth." | "What is the name of this shape?" |
| U2 classify 3D `:246` | "A cube is solid (3D) — it has real depth." | "What is the name of this solid?" |
| U2 tricky pair `:268`, `:285` | "This is a sphere — the shading shows…" / "This is a flat circle (2D)…" | "What is the name of this solid / flat shape?" |
| U4 build 2D `:341–343` | "Built using 4 sticks" + "You built a Square using 4 sticks." | "How many sticks did you need to build this square?" |
| U4 build 3D `:366–368` | "You built a cube frame using 12 sticks and 8 clay corners." | "How many clay corners does a cube frame have?" |
| U4 compose `:391–393` | "Makes a Square" + "Together, the triangles make a Square." | "What shape did you just build?" |

- **Breaks:** checklist §3 → Giveaways; builder → "A finished step's prompt stays on screen, so no step's prompt may contain a later step's answer". The same applies to the explain and answer chip.
- **Rewrite:** step 1 explains that don't name step 2's answer:
  - U2: "It is flat. It is like a drawing." / "It is solid. You can pick it up."
  - U1: "Yes! You named it."
  - U4 build: explain "You built it!", result "Built"
  - U4 cube: "You built a cube!"
  - U4 compose: explain "They fit!", result "Done"

#### E1-08 · Major · Needs your decision
- **Where:** *sides / corners* before Unit 3:
  - U1 CFU `:52` "Count its sides and corners.", `:66` "Count every shape with 3 sides", `:78` "A square has 4 sides that are all the same."
  - U1 Practice hints `:232`, `:241`
  - U2 Practice hint `:231` "Count its sides."
  - U2 CFU `:153` "flat square sides"
  - U1 Test explains are fine, but Test hints `:27, :41, :54, :89` are unseen.
- **Breaks:** checklist §3 → Untaught words; builder → Vocabulary list. A student whose only help says "count the sides" gets no help if *side* is not yet known.
- **Rewrite (if you add no teaching):**
  - `:52` "Turning does not change it. Look again."
  - `:66` show text "Big, small, and upside down. 1, 2, 3."
  - `:78` nudge "Small ones and turned ones count too."
  - `:232` hint "Look at it. Is it the same shape?"
  - U2 `:231` hint "Look at the shape."
- **If you add teaching (recommended):** one U1 Explore line under the shape: "A square has 4 sides." with the sides lighting up. Then *side* is fair in U1–U2. Keep *corners* out until U3.

#### E1-09 · Minor
- **Where:** CFU question numbers: U1 `n` = 1, 2, 3, 4, **4** (`:87, :104`); U2 1, **2, 2**, 3, 4 (`:81, :95`); U4 1, 2, 3, 4, **4** (`:82, :95`). `KCheck.tsx:41` speaks the number.
- **Spoken:** "4. Now where is the ball?" right after "4. Where is the ball?"; "2. How many flat shapes?" right after a counting answer.
- **Rewrite:** number each CFU 1–5. As in MK3 E1-08, a typed counting question is better without a spoken number in front of it.

#### E1-10 · Minor
- **Where:** first-wrong-try reasons written as questions or fragments:
  - U1 `:97` "Is the ball next to it, or in front?"
  - U1 `:114` "Is the ball on top of the box?"
  - U2 `:74` "Can you pick up a drawing?"
  - U2 `:153` "A cube has flat square sides. Does this?" / "A cone has a point on top. Does this?"
  - U4 `:62` "How many sides does it have?" / "Is the new shape round?"
  - U4 `:105` "Where do the sticks meet?"
- **Breaks:** checklist §3 → Retry reasons (state it, don't ask; from MK3). "Does this?" is an ellipsis a K listener can't fill in.
- **Rewrite:**
  - U1 `:97` "Part of the box is hidden. Look again."
  - U1 `:114` "Above means on top. Look again."
  - U2 `:74` "A circle is flat, like a drawing."
  - U2 `:153` cube: "A cube looks like a block. Look again."; cone: "A cone has a point on top. Look again."
  - U4 `:62` triangle: "Count the outside sides."; circle: "A circle is round. This is not."
  - U4 `:105` "The sticks are the sides. Look where they meet."
  - None of these states the answer.

#### E1-11 · Minor
- **Where:** "click" on an iPad:
  - U3 `:130` "click every side (then every corner)"; U3 `:151` "Sides clicked: … Corners clicked: …"
  - U4 `:151`, `:177` "click each dashed gap"; U4 `:291`, `:388` "Click a … piece"; U4 hints `:341`, `:366`, `:391`
  - shell `:454` (in E1-05)
- **Breaks:** grade-K.md → "Tap the…"; MK1 teaches *tap*; MK2/MK3 lists say "Tap, never Click".
- **Rewrite:** "Tap each side. Then tap each corner." / "Sides: 2 of 4. Corners: 0 of 4." / "Tap each gap." / "Tap a piece."

#### E1-12 · Minor
- **Where:** 61 dash asides and 10 parenthesis asides (script list). Most are rewritten in other findings. The rest include U1 `:170` "This is still a Square — turning or resizing it never makes it a different shape!", U3 `:296` "Both have 4 sides — that's the same number.", and U3 Test `:110` and `:77`/`:89` explains.
- **Breaks:** grade-K.md → Limits (one idea per sentence). The dash is a short pause in the voice, so two sentences run together.
- **Rule:** split at the dash, or cut the aside. Examples:
  - "It is still a square. Turning does not change it."
  - "Both have 4 sides. That is the same."
  - "Yes. All the sides are the same."

#### E1-13 · Polish
- **Where:** SAME, MORE, ONLY, COMPLETE, STRAIGHT, ONE, NOT, BALL's, BOX's in prompts. The voice lowercases all-caps words, but not "BALL's" / "BOX's" (see E1-15).
- **Rewrite:** bold lowercase.

#### E1-14 · Polish
- **Where:** `_planning/Grade-K/ShapesLab/vocabulary.md`.
- **Note:** the list matches the current code, and its 9 findings are folded into this report. Update it after the fixes, as its header asks. It should list *straw* (if E1-36 is agreed), and drop words this round removes (*domino, units, wireframe, compose, depth, shading*).

---

### Unit 1: Naming Shapes and Positions

#### E1-15 · Blocker · Needs your decision
- **Where:** Test `NamingShapesAndPositionsTest.tsx:179`; Practice step 2 `NamingShapesAndPositions.tsx:276–278`.
- **Text (Test):** "The ball is above the box. From the BOX's point of view, where is the ball... I mean, where is the BOX, compared to the ball?"
- **Spoken:** "…From the BOX's point of view, where is the ball. I mean, where is the BOX, compared to the ball?" "BOX's" has a lowercase s, so `normalizeWord` keeps it in capitals and some voices spell it.
- **Text (Practice):** "From the BALL's point of view, where is the box?" Hint: "Above/below swap, in front of/behind swap — beside stays beside." Spoken: "**Above or below** swap, **in front of or behind** swap, beside stays beside." The voice reads the slash as "or", which reverses the meaning. Explain: "If the ball is above the box, then the box is below the ball."
- **Why:** the Test prompt asks one question, then corrects itself to a different one. A student who answers the first question ("where is the ball?") is marked wrong. "Point of view" and the reversed relation are not K language. The plan doesn't list this skill.
- **Breaks:** Blocker (the wording leads a correct student to the wrong answer); grade-K.md → Grammar (*if*, two clauses); traps §8 (slash).
- **Rewrite (recommended):** remove the reverse-position step from Practice and the Test question from the U1 Test. Fill the Test slot with a second `positionVocabPrecisionQuestion`-style picture.
- **If you keep it:** "The ball is above the box. Where is the box?" Choices: "Below the ball", "Above the ball", "Beside the ball". Hint: "Look at the box." Explain: "The box is below the ball."

#### E1-16 · Major
- **Where:** Practice `:266` story and `:270` prompt; Test `:103`, `:121`, `:141` (two are in the Module Test). Hint `:270` "Does anything overlap or hide part of the other object?"
- **Text:** "Which word describes where the ball is, compared to the box?" (11 words).
- **Breaks:** grade-K.md → Limits; untaught *describes, compared to, overlap, object*. The CFU already asks this in 4 words ("Where is the ball?").
- **Rewrite:**
  - Story: (none)
  - Prompt: "Where is the ball?" The spoken choices complete it ("Above. Below. Beside.").
  - Hint by scene: above/below "Look: is the ball up or down?"; beside/in front of/behind "Look: is part of it hidden?"
  - Explain stays "The ball is below the box."

#### E1-17 · Major
- **Where:** name-shape Practice `:222–248`.
- **Text:**
  - Story: "This shape has been in its usual position. What shape is it?" / "This shape has been made smaller." (odd, passive, and it repeats the prompt)
  - Step 2: "If this square were turned a completely different way, would it still be a Square?" (15 words; *if* + "were")
  - Buttons: "Yes — turning it never changes what shape it is" / "No — it would become a different shape"
  - Hint `:241`: "Turning (or resizing) a shape never changes how many sides or corners it has."
  - Wrap-up: "It's a Square, no matter which way it's facing or how big it is."
- **Breaks:** grade-K.md → Grammar (*if/then*, passive), Limits. The buttons are 7–9 words and the right one states the reason.
- **Rewrite:**
  - Story: (standard) none; "It got turned." / "It got smaller." / "It got bigger." (the CFU's word)
  - Step 2: "Watch it turn. Is it still a square?" with the turn played first, buttons "Yes" / "No"
  - Hint: "Watch it turn back."
  - Wrap-up: "It is a square. Turned or not!"

#### E1-18 · Major
- **Where:** one move, many words:
  - CFU "turned"
  - Explore `:149` "turn it or resize it"; button `:154` "Flip / rotate it"; result line `:170` "turning or resizing"
  - Practice `:217` "made smaller/bigger", `:232` "turned or sized", `:242` "turning or resizing"
  - Key Idea `:300` "tilted"; Home `:85` "resized"
  - Test `:72` "smaller than usual", `:89` "turned to face a different way", `:157` "(rotating)"
  - Size picker `:130–132` "Small / Normal / Large" vs CFU "big / small / little"
- **Why:** "Flip" is a different move (a mirror), and the button only turns the shape. "/" with spaces is silent, so the voice says "Flip rotate it".
- **Breaks:** english-learners.md (one word per idea); checklist → Synonyms, Text vs. picture; traps §8.
- **Rewrite:** *turn* for the move and *big / small* for size, everywhere.
  - Button: "Turn it"
  - Size picker: "Small / Middle / Big"
  - Explore `:149`: "Pick a shape. Turn it. Make it big or small."
  - Explore `:170`: "It is still a {square}!"
  - Test `:72` explain: "It is still a {circle}. It is just smaller."

#### E1-19 · Minor
- **Where and rewrite:**
  - Explore `:174` "Now place the ball somewhere around the box, and see which position word fits." → "Tap a word. See where the ball goes."
  - `:183` "'Beside' and 'next to' mean the same thing — both describe objects side-by-side, with nothing hidden." → "Beside means next to."
  - `:177` "Which side" picker with *Left / Right* → remove it and let "Beside" alternate sides on each tap, or use arrow pictures.
- **Breaks:** grade-K.md → Limits; Watch for (left and right are not taught in K; from MK3). No answer depends on them, so Minor.

#### E1-20 · Minor
- **Where:** "Diamond" as a wrong choice in Practice `:200`, Test `:15`, `:56` (Module Test). Key Idea `:300` "never a 'diamond'".
- **Why:** many K students do call a turned square a "diamond" by ear, so this is a fair trap. But the lab only answers it in text, and the CFU uses "A new shape" instead.
- **Rewrite:** add one CFU or Explore line with the turn demo: "Some people call it a diamond. It is still a square." Then keep the choice.

---

### Unit 2: Flat or Solid?

#### E1-21 · Blocker
- **Where:** Test `FlatOrSolidTest.tsx:150`.
- **Text:** "If you traced just ONE flat face of this cube onto paper, what flat (2D) shape would you get?" (19 words.) Explain: "Each face of a cube is a flat Square."
- **Breaks:** grade-K.md → Grammar (*if*, *would*, two clauses), Limits; untaught *traced, face* (never taught anywhere in the lab). The answer depends on them.
- **Rewrite:** keep the cube picture and ring its front. "Look at the front of the cube. What shape is it?" Choices: Square, Circle, Triangle. Explain: "The front is a square."

#### E1-22 · Major · Needs your decision
- **Where:** "Flat (2D)" / "Solid (3D)": every U2 Practice prompt and button (`:230, :246, :268, :285, :305`), every U2 Test item, Explore picker labels and result lines `:177–200`, title `:318` "(2D vs. 3D)", goal, Key Idea.
- **Spoken:** "Is this shape flat 2D or solid 3D?" "2D" is said as "two dee" or "2 D", depending on the voice.
- **Breaks:** grade-K.md → Math words (*flat, solid* are the K words; *2D/3D* are not listed). It is never said in the CFU, but it is on every Test answer button.
- **Rewrite:** "Is it flat or solid?" Buttons: "Flat" / "Solid". Explore: "Flat shapes" / "Solid shapes"; result "A circle is flat." / "A sphere is solid."

#### E1-23 · Major
- **Where:**
  - Explore `:175` "Pick a flat shape and a solid shape, side by side. Notice how the solid one has shading that makes it look round and deep — the flat one doesn't." (30 words)
  - Explore `:204` "A circle and a sphere can look almost the same size on a screen — the real difference is whether you could actually pick it up and hold real space in your hands." (32 words)
  - Practice titles `:262`, `:279` "(the tricky pair)"
  - Stories `:264`, `:281` "This round shape can look a lot like its flat cousin in a picture — look closely at the shading."
  - Hints `:230`, `:246` "Could you actually pick this up and hold it, with real depth?"; `:268` "Look for shading/highlights that show depth"; `:285` "No shading or highlight means no depth"
  - Explains "real depth"
  - Test `:66`, `:81`
- **Why:** *shading, highlights, depth, real space, cousin, actually, tell* are untaught; *cousin* is an idiom. `:175` says the solid looks "round" even when the cube or cone is picked (text vs. picture).
- **Breaks:** grade-K.md → Limits, Math words; english-learners.md (idioms); checklist → Text vs. picture.
- **Rewrite:**
  - Explore `:175`: "Pick a flat shape. Pick a solid shape."
  - Explore `:204`: "A flat shape is like a drawing. You can pick up a solid shape."
  - Title: "Flat or solid?"
  - Story: none
  - Hint (both buttons): "Could you pick it up?"
  - Explains: "It is flat, like a drawing." / "It is solid. You can hold it."
- **For the curriculum checker:** a non-reader needs the shading itself shown (E1-23 removes the word, not the cue).

#### E1-24 · Major
- **Where:**
  - U2 CFU `:153` "A cube has flat square sides." (*side* = a face)
  - U2 hint `:272` and Test `:116` "flat square faces"
  - U2 `:258` and Test `:81` "square-faced shape" (said about a flat square)
  - U3 Key Idea "A side is a straight edge." (*side* = a line)
  - U4 CFU `:106` "The sticks are the sides." (*side* = a cube's edge)
  - U4 Explore `:177`, Practice `:355`, `:366` "edges"
- **Why:** in one lab, *side* means a face, then a straight line, then a stick on a cube, and *edge* and *face* are added too. "Is this square-faced shape flat or solid?" also describes a cube's feature in the question about a flat square.
- **Breaks:** english-learners.md (one word per idea); traps §1 (double meanings).
- **Rewrite:**
  - U2 never says *side* or *face*: CFU `:153` "A cube looks like a block. Look again."; hint `:272` "Round all over? Or like a block?"; Test `:116` hint unseen; Test `:81` "Is this shape flat or solid?"
  - U4 says *sides* (matching U3) and never *edges*: "Put a stick in every gap." / "Build a cube with sticks and clay."

#### E1-25 · Minor
- **Where and rewrite:**
  - CFU `:86` "Solid shapes look like blocks you can hold." (a sphere and a cone aren't blocks) → "Solid shapes you can pick up. Count only those."
  - CFU `:87` "The cone and the can are solid too." (*can* is used before Q5 links it to the cylinder) → "Look again. Find every solid one."
  - Practice `:247` hint "Think about its shape — round all over, two flat round ends, a point at the top, or a box shape?" → "Round? A point on top? Like a block?" (*box* in U1 is the flat square in the position pictures)
  - Practice `:289` hint "It's one of the 5 shapes you've learned." → "Look at the shape."
  - Wrap-ups `:274`, `:291` "This is a solid sphere — not just a flat circle." → "It is a sphere. It is solid."

---

### Unit 3: Sides and Corners

#### E1-26 · Blocker
- **Where:** Test `SidesAndCornersTest.tsx:110` (also in the Module Test): the answer is always "They have the same number of sides". Practice `:296`, `:301`: the answer is "the same" in about 1 of 3 problems.
- **Text:** "Which shape has more sides?" Buttons: "Square", "Rectangle", "They have the same number of sides". Practice: "Which shape has MORE corners?" / "They have the same number of corners".
- **Why:** the question tells the student that one shape has more. A K student who counts 4 and 4 correctly is pushed to pick a shape. The right button is 7 words long, the only long one, and it repeats the question's words.
- **Breaks:** checklist §3 → Loaded questions ("What is wrong?" when "Nothing" can be right); grade-K.md → Limits.
- **Rewrite:** "Which has more sides? Or are they the same?" Buttons: "Square", "Rectangle", "The same". Use the same wording when they differ, so the wording never hints. Corners: "Which has more corners? Or are they the same?"

#### E1-27 · Major
- **Where:** `equalSidesCompare` explain and wrap-up `:241, :247`.
- **Text:** "A triangle's sides are NOT all the same length." "A rectangle's sides are not all the same length." "A hexagon's sides are all the same length."
- **Why:** each says something about *every* triangle, rectangle or hexagon, and that is false for triangles and hexagons in general. It only describes the shape drawn. Young students take "A triangle's sides are not the same" as a rule.
- **Breaks:** checklist → Text vs. picture; builder → False distractors and taught statements.
- **Rewrite:** "This triangle's sides are not all the same." / "This square's sides are all the same." (Also drop the capital NOT.)

#### E1-28 · Minor
- **Where and rewrite:** generated compare text.
  - Explore `:177–180` "Hexagon has MORE sides than Triangle." / "Square and Rectangle have the SAME number of sides (4)." → "The hexagon has more sides." / "They have the same: 4."
  - Practice `:296` "Hexagon has more sides (6 vs. 3)." (spoken "6 vs 3") → "The hexagon has 6. The triangle has 3."
  - `:301` "Hexagon has more corners too, since corners match sides for these shapes." → "The hexagon has more corners too."
  - Story `:283` "Here is a hexagon and a triangle." → "Here are a hexagon and a triangle."
  - Wrap-up `:306` "Hexagon has more sides than the other shape." → "The hexagon has more sides."
  - Test `:140` "Hexagon has more sides than Triangle." → "The hexagon has more sides."
- **Breaks:** traps §8 ("vs."); grammar (missing articles).

#### E1-29 · Minor
- **Where and rewrite:**
  - Explore `:130` "Pick a shape, then click every side (then every corner) to count them one at a time." → "Tap each side. Then tap each corner."
  - Explore `:156` "Now compare two different shapes side by side." → "Now look at two shapes." (*side by side* in a sides lesson)
  - Practice `:241` hint "Compare each side's length to the others, not just how many there are." → "Look at each side. Are they all the same?"
  - Practice `:245` "How many sides does this rectangle have, total?" → "How many sides does it have?"
  - Hint "The number of sides doesn't depend on their length." → "Count every side."
  - Explain "…whether or not they're equal." → "A rectangle has 4 sides."
  - `:224` hint "A circle never meets itself at a sharp point." → "A circle is round all the way."
  - `:223` "A circle's edge is curved, not straight." → "A circle is round. It has no straight sides." (as the CFU says)
  - `:301` hint "For these shapes, the number of corners always matches the number of sides." → "Count the corners."
- **Breaks:** grade-K.md → Limits; untaught *total, depend, whether, edge, sharp point*.

---

### Unit 4: Building and Combining Shapes

#### E1-30 · Blocker
- **Where:** Test `BuildingAndCombiningShapesTest.tsx:219` (also in the Module Test). No picture.
- **Text:** "Two shapes are placed near each other, but with a gap left between them — they aren't touching. Did they correctly compose into one bigger shape?" (25 words.) Explain: "No — pieces have to be joined edge-to-edge with no gaps to compose into one bigger shape. Just placing them nearby doesn't count."
- **Breaks:** grade-K.md → Math words, Grammar (passive, two clauses, a negative), Limits; *compose* is used nowhere before this Test. The answer depends on it, and there is no picture to carry it.
- **Rewrite:** show two triangles with a clear gap. "Do these make one shape?" Choices: Yes, No. Explain: "No. There is a gap."

#### E1-31 · Major
- **Where:** Test items with `visual: null`:
  - `:200` "You build a square out of 4 sticks. If you then turn the finished shape around, is it still a square?"
  - `:187` "How many clay corners does a complete cube frame have?"
  - `:176` "How many sticks do you need to build a hexagon (with a stick on every side)?"
- **Breaks:** grade-K.md → What they can read ("the picture must carry the problem"), Grammar (*if… then*); untaught *complete cube frame*. The CFU asked about "clay balls" with a picture.
- **Rewrite:**
  - `:200` picture of a turned stick square: "This square got turned. Is it still a square?"
  - `:187` picture of the cube frame: "How many clay balls?"
  - `:176` picture of a hexagon: "How many sticks make this hexagon?"

#### E1-32 · Major
- **Where:** Test `:54`, `:78`, `:103` and their explains `:56`, `:80`, `:105`.
- **Text:**
  - "Which picture correctly shows sticks joined with no gaps to form a Hexagon?"
  - "Which picture correctly shows ONLY the sticks needed to form a Hexagon — no extra sticks?"
  - "Which picture shows a COMPLETE cube frame, with a stick on every edge?"
  - Explain: "Picture B has exactly the sticks needed — the other picture has one extra stray stick that isn't part of the shape."
- **Breaks:** grade-K.md → Limits (13–16 words); untaught *correctly, form, complete, frame, edge, stray*.
- **Rewrite:**
  - "Which hexagon has no gap? A or B?"
  - "Which hexagon has no extra stick? A or B?"
  - "Which cube has every stick? A or B?"
  - Explains: "B has no gap." / "A has an extra stick." / "B is missing a stick."

#### E1-33 · Major
- **Where:** untaught words across U4 Explore and Practice:
  - *compose* (title `:383` "Compose a shape"; type label `:466` "Build & Compose")
  - *wireframe, cube frame* (`:353`, `:355`)
  - *edges* (`:177`, `:355`, `:366`)
  - *domino, unit(s), strip, exactly, mix, combination* (`:192–232`, `:411–443`)
  - *outline, tray, panel, open space* (`:388–396`)
  - *target, open-ended* (`:192–194`)
  - *dashed gap* (`:151`)
- **Worst strings:**
  - `:413` "Fill this strip exactly, using any mix of squares (1 unit) and dominoes (2 units) you like."
  - `:434` "Could a different mix of squares and dominoes have also filled this strip exactly?" (*could have* + *also*)
  - `:443` "You filled a 5-unit strip — and other combinations of pieces could have worked too."
  - `:232` "Filled exactly! Try starting over and using a different mix of pieces — more than one way works."
- **Breaks:** grade-K.md → Math words, Grammar, Limits; checklist → Untaught words.
- **Rewrite:**
  - Titles: "Build with sticks" / "Build a cube" / "Make a big shape" / "Fill it up"
  - Type label: "Build"
  - Build 2D story: none; prompt "Put a stick in every gap."
  - Build 3D story: none; prompt "Build the cube. Put a stick in every gap."
  - Compose: "Put the triangles in."; hint "Tap a triangle."; step 2 "What shape did you make?"
  - Strip buttons: "Add 1 square" / "Add 2 squares" (call the domino a 2-square piece, drawn as one piece)
  - Strip prompt: "Fill it up. It is 5 squares long."
  - Strip step 2: "Is there another way to fill it?"
  - Strip wrap-up: "You filled it! There is more than one way."
  - Explore `:192`: "Put shapes together. Make a big shape."
  - Activity picker: "One shape" / "Many ways"
  - `:232`: "Full! Start over. Try a new way."
  - Counter: "3 of 6 squares filled."

#### E1-34 · Minor
- **Where:** the words for the clay pieces: CFU "clay balls" (`:83–106`); Explore "clay (corners, already placed)" `:177`; Practice "clay (corners)" `:355`, "clay corners" `:366, :370`, hint "Count every dot where sticks meet." `:370`; Test "clay corners" `:187`.
- **Breaks:** english-learners.md (one word per idea).
- **Rewrite:** "clay balls" everywhere. "How many clay balls?" / "Count each clay ball." The CFU already teaches "The clay balls are the corners."

#### E1-35 · Minor
- **Where:** Practice placeholders `:337`, `:362` "Use the sticks in the panel on the right to build it."; `:388` "Click a piece in the panel to drop it into place."; `:417` "Use the buttons in the panel to add or remove pieces."; `:418` "Think about the strip you just filled."
- **Why:** on an iPad in portrait, the work area may sit below the picture, not on the right. *Right* is not taught in K, and *panel* is a screen word.
- **Breaks:** checklist → Text vs. picture; grade-K.md → Watch for (left/right).
- **Rewrite:** "Build it with the sticks." / "Tap a piece." / "Add pieces." / (step 2) leave it empty.

#### E1-36 · Minor · Needs your decision
- **Where:** MK4 "Each stick is one side." (`:43`) and every "stick" in U4. MG2: "A stick is 1 ten."
- **Why:** a student who did MK4 may count a ten-stick as one side or one thing (vocabulary list finding 2).
- **Rewrite:** call MK4's pieces *straws*: "Each straw is one side." "How many straws make a triangle?" Leave MK3's *rods* and MG2's *stick* as they are.

#### E1-37 · Minor
- **Where and rewrite:** voice slips.
  - Explore picker `:199` "Triangles → Square" is spoken "Triangles Square" (the arrow is silent) → "Triangles make a square".
  - `:216`, `:307` "Add square (1)" is spoken "Add square 1"; see E1-33.
  - `:443` "5-unit" is spoken "5, unit"; see E1-33.
  - Explore `:172`, `:187`, `:208` "3 of 4 sticks placed..." (the ellipsis is three pauses) → "3 of 4 sticks." and "You built a square!"
- **Breaks:** traps §8 (arrows, symbols).

---

## 4. What's working well

- All four CFUs are one question at a time, mostly under 10 words, each with a picture. 10 of the 19 CFU questions are typed.
- The CFU wording is the model for the rest of the lab: "This square got turned." "Which one can you pick up and hold?" "A corner is a point where two sides meet." "Each stick is one side."
- The U3 count-along "Show me" lines ("Let's count together: 1, 2, 3. That's 3 sides.") are short, and match the picture's numbering.
- Generated grammar is clean at every value: no a/an slips, no "1 sticks", and every pooled shape name takes "a".
- The Practice wrap-up only says "star" when one is earned (shared engine).
- No student text mentions a grade, and there are no fractions.

## 5. Out of my lane (for the curriculum checker)

- **Yes/No answers that never change:**
  - U1 Practice step 2 is always "Yes".
  - U4 strip step 2 is always "Yes".
  - U1 and U2 Test true/false items are always "False", and U4's gap item is always "No".
  - The U3 Test tie item is always "same".
- **CFU pointers:** no CFU question has a `look` pointer (the lab hasn't been through review). The help ladder and "Try one like it" rules apply.
- **"Behind" scene:** the ball sits up and to the left, mostly hidden. It may read as "above" to a child.
- **Reverse position item:** "From the ball's point of view" changes the viewer, not just the words (E1-15).
- **Unit 2 cue:** the only flat/solid cue on screen is the shading, so the unit teaches a picture convention. "Pick up and hold" can't be done with anything on screen.
- **Recall without a picture:** U4 Test asks for 8 cube corners and 6 hexagon sides from memory (E1-31).
- **Untaught position word:** "Next to" is only a synonym line in Explore. It never appears in a scene.

## 6. Guideline gaps

Proposed additions. I did not edit these files.

- **checklist.md §3 → Giveaways** (all grades, from MK4): "A finished Practice step keeps its answer chip and its explain on screen. Neither may name the answer to a later step ('This is a square.' above 'What is the name of this shape?')."
- **math-language-traps.md §8** (all grades, from MK4): "A slash that means *trade places* or *and* ('above/below swap') is read as *or* and flips the meaning. Write it out. A slash with spaces around it ('Flip / rotate') is silent."
- **math-language-traps.md §8** (all grades, from MK4): "Don't add 's to a capitalized word ('the BALL's point of view'). The voice lowercases all-caps words only when every letter is a capital."
- **grade-K.md → Math words** (K–1, from MK4): "*Turn* is the one word for rotating. *Flip* is a different move (a mirror image), so don't use it for a turn. *Tilted, rotated, resized* are not yet."
- **grade-K.md → Watch for** (K–1, from MK4): "*Side* has one meaning per lab. In a shapes lab it is a straight line of a flat shape. Don't call a cube's face or a scale pan a side in the same lab."
- **grade-K.md → What they can read** (K–1, from MK4): "Every K–1 Test question needs a picture (`visual` not null). A question that only names a shape asks the student to remember, not to look."

## 7. What I could not check

- Real iPad/iOS speech: how "2D", "Picture A", "BOX's" and "hexagon" are said.
- Whether the Practice work panel is to the right of or below the picture on an iPad in portrait (E1-35).
- Real students: whether K children treat "diamond" as a different shape (E1-20).
- The screens were checked from code and generated text, not in a live browser. What the voice says for buttons and auto-read comes from reading the speech code.
