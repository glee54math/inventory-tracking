# MK3 Measurement & Classifying: English review, round 1

- **Lab:** `MK3_MeasurementAndClassifyingLab` (shown to students as "Measuring & Classifying")
- **Round:** 1, full review. No `round-0-build.md` exists.
- **Date:** 2026-11-21
- **Grade assessed:** Kindergarten band (K and 1st graders seeing this for the first time, plus 2nd graders who are behind; alone on an iPad; mostly non-readers; audio-first). Standards K.MD.1, K.MD.2, K.MD.3.
- **Read-alone level:** Kindergarten is the youngest grade file, so there is no younger file. grade-K.md's rule applies: assume no independent reading.
- **Paths:** unit files are in `MK3/MeasurementAndClassifyingLab/units/`. "U1", "U2" and "U3" are the three units; "Test" means that unit's `*Test.tsx`.

**How the text was checked:** the English script, then every generator run for every bucket (400 draws each) and every Test question (300 draws each), with each sentence passed through the real `speakableText`. Which elements the voice reaches was read from `shared/tts/reading.ts`, `ReadAloud.tsx`, `StepProblem.tsx`, `UnitTest.tsx` and `KCheck.tsx`.

**Two facts that shape the findings:**
- The voice skips everything inside an SVG, so picture labels ("Rod A", "Red (5)", "Not sorted yet") are never spoken.
- `UnitTestView` never shows a Test question's `hint`. The script flags those strings, but students don't see them, so they are not findings here.

---

## 1. Verdict

**Not ready.** The KCheck CFUs are short and close to the right level, but Practice and the Tests are still written for much older readers. A student who knows the math can be marked wrong by the English in nine places. The biggest causes are "the circled item" in a lab that sorts circles, Left/Right answers no K lab teaches, long/short asked with nothing to compare to, and questions a non-reader can't hear in full.

| Severity | Count |
|---|---|
| Blocker | 9 |
| Major | 16 |
| Minor | 15 |
| Polish | 2 |
| **Total** | **42** |

**Six findings need your decision:** E1-01, E1-03, E1-10, E1-13, E1-16, E1-24. They are collected in section 3a.

---

## 2. Scorecard

Length = strings with a sentence over the 8-word limit (task, after-answer and screen text; the Test figure includes hint strings students never see).

| Part | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell / Home | OK (30%) | OK | Weak | n/a | OK | Weak |
| U1 Describing | Weak (61%) | Weak | Weak | Weak | Weak | Weak |
| U2 Comparing | Weak (43%) | Weak | Weak | Weak | OK | Weak |
| U3 Classifying | OK (30%) | Weak | Weak | Weak | Weak | OK |
| Module Test | Reuses 15 unit Test questions | Weak | Weak | Weak | Weak | OK |

---

## 3a. Decisions needed from you

| ID | Question | Recommendation |
|---|---|---|
| **E1-01** | CFU answer buttons are never spoken, and CFU questions don't read themselves. This is in shared `KCheck.tsx`, so a fix changes every lab using it. Fix it there, or only reword MK3? | Fix the shared component. |
| **E1-03** | A 0 out of 15 on the Module Test shows 1 star. MK2 was changed so the lowest scores earn 0 stars (your decision D3). Use the same idea here? | 0–5 = 0 stars, 6–7 = 1 star; keep the other bands. |
| **E1-10** | The unit header shows "Standard K.MD.1". The "K" is a visible grade reference. It's in every lab's shell. Hide it from students? | Hide it from students in all labs. |
| **E1-13** | "Is the pencil long or short?" has no right answer without something to compare. Swap the object list, or change the question? | Swap to objects children agree on (list in E1-13). |
| **E1-16** | "Tall" is taught as "how high" and then graded as "length". Remove it, or teach it? | Remove it from the word list for this lab. |
| **E1-24** | "How many blocks LONGER?" and "How many MORE?" are compare problems, which grade-K.md lists as not yet. The plan asks for them, reading K.MD.2's "describe the difference" as a number. The standard's own example is describing one as taller or shorter. Replace them? | Replace with "Rod A is ___ than Rod B" (longer / shorter). |

---

## 3. All findings

### Shell and all units

#### E1-01 · Blocker · Needs your decision
- **Where:** `shared/components/KCheck.tsx:38–44, :164, :173–215`. Affects every `PickCheck` in MK3: U1 `:65, :79, :125`; U2 `:88, :116, :143`; U3 `:94, :137, :154`.
- **Text:** "Which word tells how heavy something is?" with buttons *tall / heavy / long*. "The train is long. What else is it?" with *heavy / light*.
- **Spoken:** only the question. The buttons are not in the question's `alsoRead`, are not marked `data-readaloud-part`, and "Read all" skips them. The question also doesn't auto-read, because `QuestionHead` is not `role="alert"`. Only feedback does.
- **Breaks:** grade-K.md → What they can read ("Every word a student needs must be spoken").
- **Rewrite:** in `PickCheck`, add a ref on `.choices`, pass it as `alsoRead`, and auto-read the question and choices when each question appears (as Practice does at `StepProblem.tsx:449`). **If you prefer an MK3-only fix,** put the choices in each prompt: "Is a train heavy or light?"

#### E1-02 · Major
- **Where and rewrite:** true/false questions, which K–1 labs don't use. Each becomes one new picture example.

| Location | Now | Rewrite |
|---|---|---|
| U1 Test `:139` | True or false: an object that looks bigger (like the balloon) is always heavier… | Balloon and rock picture. "Which one is heavier?" Choices: balloon, rock. |
| U2 `:286` | True or false: the rod whose end is farther to the right is always the longer one. | "How many blocks long is Rod A?" (typed) |
| U2 Test `:95` | True or false: the rod whose end reaches farther to the right… | Picture where the shorter rod ends farther along. "Which rod is longer? Count the blocks." |
| U2 Test `:184` | True or false: to compare two rods fairly by their ends… (no picture) | Rods with different starts. "These rods start in different places. Which is longer?" |
| U3 `:342` | True or false: when there are 3 or more groups, you still sort by only ONE attribute the whole time. | New item of another color. "We sort by shape. Where does this one go?" |
| U3 Test `:157` | True or false: it's fine to switch from sorting by color to sorting by shape partway through… (no picture) | Same picture pattern: "We sort by color. Where does this one go?" |

- **Breaks:** grade-K.md → Grammar ("Not yet: True or false"); builder → K–1 CFU. The seventh true/false item is in E1-15.

#### E1-03 · Major · Needs your decision
- **Where:** `units/ModuleTest.tsx:18–24`, shown at shell `:123, :441, :467`.
- **Text:** `moduleTestStars` ends in `return 1`, so 0 out of 15 shows ★.
- **Breaks:** user rule, honest stars. MK2's `ModuleTest.tsx` already gives 0 stars to its lowest band (user decision D3).
- **Rewrite:** `if (score >= 14) return 5; if (score >= 12) return 4; if (score >= 10) return 3; if (score >= 8) return 2; if (score >= 6) return 1; return 0;`
- The Practice wrap-up is honest: it says or shows ⭐ only when `starResult === "star"` (`StepProblem.tsx:670`).

#### E1-04 · Major
- **Where:** unit titles and goals: U1 `:330–331`, U2 `:353–354`, U3 `:432–433`. Titles also appear in "Continue: …" and "You've mastered …" (shell `:87, :343, :351`). The goal is read aloud.
- **Breaks:** grade-K.md → Math words (*attribute* is not yet); untaught *measured, classifying, category, directly*; limit of 8 words.

| Now | Rewrite |
|---|---|
| Describing How Objects Are Measured | Long and Heavy |
| Name ways an object can be measured, like how long it is or how heavy it is. | Tell how long. Tell how heavy. |
| Comparing Two Objects Directly | Which Is Longer? Which Is Heavier? |
| Look at two objects side by side and tell which has more of an attribute (longer/heavier), and say how you know. | Look at two things. Find the longer one. Find the heavier one. |
| Classifying and Counting by Category | Sort and Count |
| Sort a group of objects into categories, count how many are in each, and tell which category has more or fewer. | Sort them. Count each group. Which has more? |

With the new titles, change the mastery line to "You finished {title}." "You've mastered long and heavy" doesn't make sense.

#### E1-05 · Major
- **Where and rewrite:** shell text.

| Line | Now | Rewrite |
|---|---|---|
| `:85` | Compare two objects to see which is longer or heavier, describe how you can tell, and sort a group of objects into categories you count and compare. | Find the longer one. Find the heavier one. Sort and count. |
| `:113` | Solve each kind of problem 2 times by yourself to fill in your stars. Only Mixed problems count. | Solve each kind 2 times. Fill your stars. |
| `:120` | 15 cumulative questions, 5 from every unit in this lab. | 15 questions. |
| `:298` | Complete the activity above to unlock practice problems. | Finish the questions. Then you can practice. |
| `:321` | Practicing one type is great for extra reps, but only **Mixed** problems count toward your mastery stars. | Only **Mixed** earns stars. |
| `:343` | You've mastered {title}. Take the test to finish this unit. | You finished {title}. Now take the test. |
| `:463` | 15 cumulative questions covering every unit in Measuring & Classifying — 5 from each. | 15 questions. |

- **Breaks:** grade-K.md → Limits; later words *cumulative, mastery, reps, unlock*.

#### E1-06 · Major
- **Where:** every Practice opening. `StepProblem.tsx:449` auto-reads title + story + prompt + choices.
- **Spoken (longest, 34 words):** "Which rod is actually longer? These rods do not start at the same place. Look at where each one starts, not just where it ends. Which rod is actually longer? Rod A. Rod B."
- **Breaks:** grade-K.md → Limits (1 instruction); checklist §5. The title and prompt say the same question twice at U1 `:216/:222`, `:240/:246`; U2 `:243/:252`, `:265/:281`, `:300/:305`; U3 `:411/:423`.
- **Rewrite:** make the title a 1–2 word label that is not the question ("Rods", "Scale", "Sort", "Count"), and cut each story to one short line or none. Example: title "Rods"; story "They start in different places."; prompt "Which rod is longer?"

#### E1-07 · Minor
- **Where:** U1 `:170, :183`; U3 `:259`; shell `:454`.
- **Text:** "Click an object…", "Click a describing word…", "Click an item, then click the group it belongs in.", "Click again to clear all stars".
- **Breaks:** grade-K.md → "Tap the…" (students are on iPads; MK1 teaches *tap*).
- **Rewrite:** "Tap a picture." / "Tap a word." / "Tap one. Then tap its group." / "Tap again to clear all stars."

#### E1-08 · Minor
- **Where:** CFU `n` values: U1 `1,2,2,3,4` (`:66–126`); U2 `1,1,2,2,3` (`:89–144`); U3 `1,2,2,3,4` (`:95–155`). `KCheck.tsx:41` speaks them.
- **Spoken:** "2. How many blocks are on the heavy side?" right before a counting answer, with the same number used twice.
- **Breaks:** traps §8 (text the voice must say).
- **Rewrite:** number the questions 1–5, and mark the number `data-tts-skip` so a number isn't spoken just before a counting question.

#### E1-09 · Minor
- **Where:** Home cards, shell `:99–108`; the Start/Continue button `:86–88`.
- **Text:** unit titles and goals on Home aren't in a `ReadAloud`, so a non-reader can't hear which unit is which.
- **Breaks:** grade-K.md → What they can read.
- **Rewrite:** give each card a speaker, or `data-readaloud-part`, reading the new short title (E1-04).

#### E1-10 · Minor · Needs your decision
- **Where:** shell `:262`. **Text:** "Standard K.MD.1".
- **Breaks:** user rule, no grade references. A 2nd grader sees "K" on the screen. It's also a code no student can read. It isn't spoken.
- **Rewrite:** remove it from the student view, in every lab's shell if you agree.

#### E1-11 · Polish
- **Where:** LENGTH, WEIGHT, LONGER, SHORTER, ACTUALLY, HEAVIER, LIGHTER, MORE, FEWER, FEWEST, SHAPE, COLOR, ONE, NOT, SAME, OPPOSITE, ALSO in prompts. The voice handles them correctly (lowercased).
- **Why:** early readers learn word shapes in lowercase.
- **Rewrite:** use bold lowercase.

#### E1-12 · Polish
- **Where:** `_planning/Grade-K/MeasurementAndClassifyingLab/vocabulary.md`, last line.
- **Text:** a stray `</invoke>` tag. The list also records several words as "used before taught". Update it after the fixes, as its header asks.

---

### Unit 1: Describing

#### E1-13 · Blocker · Needs your decision
- **Where:** `OBJECTS` U1 `:26–39`, Test `:19–32`; used by `:222`, `:246`, `:271`, Test `:50, :63, :78`.
- **Text:** "Is the pencil long or short?" (graded **long**). "Is the balloon long or short?" (**short**). "Is the snake heavy or light?" (**light**). "Is the anchor long or short?" (**short**).
- **Why:** *long* and *short* only mean something next to another object, and every picture is the same size. A child who says a pencil is short is reasonable and is marked wrong. The CFU also calls the balloon "big" (`:81`), and the Practice answer calls it "short". Many K students won't know *anchor*.
- **Breaks:** Blocker definition (a student who knows the math gets it wrong); traps §7.
- **Rewrite (recommended):** keep only objects children agree on, three in each group:
  - long + heavy: train, crocodile, log
  - long + light: snake, scarf 🧣, string 🧵
  - short + heavy: rock, brick, hammer 🔨
  - short + light: feather, leaf, butterfly 🦋
- **Alternative:** show a second object and ask "Which is long?", though this moves toward Unit 2.

#### E1-14 · Blocker
- **Where:** U1 `:270–277`; Test `:77–84`; also in the Module Test.
- **Text on screen:** "Fill in both words." then "This train is [choose] and [choose]."
- **Spoken automatically:** only "Fill in both words." `StepProblem.tsx:449` and `UnitTest.tsx:105` read the input area only for choice steps. With the speaker icon: "This train is choose from long, or short and choose from heavy, or light."
- **Breaks:** grade-K.md → What they can read, Limits; builder → K–1 (no dropdowns); one question at a time.
- **Rewrite:** Practice uses two choice steps: "Is the train long or short?" then "Is the train heavy or light?" Test (one question): "The train is long. What else is it?" Choices: heavy, light.

#### E1-15 · Blocker
- **Where:** U1 `:278–286`; Test `:157–165`.
- **Text:** "If someone painted the train a new color, would it become longer/shorter or heavier/lighter?" Choices: "No — it would stay the same length and weight" / "Yes — a new color always changes its size".
- **Spoken:** "…would it become longer shorter or heavier lighter?" The slash disappears.
- **Why:** an either/or question is answered yes/no, with an *if* clause and 8–9-word answers no K student can read. The Test version is a 19-word true/false.
- **Breaks:** grade-K.md → Grammar (*if/then*, true/false, two clauses); traps §8.
- **Rewrite:** "We paint the train red. Is it still long?" Choices: Yes, No. Explain: "Yes! Paint does not change it." Vary it so Yes is not always right, or drop this item. Paint is not part of K.MD.1.

#### E1-16 · Blocker · Needs your decision
- **Where:** CFU `:73` vs. `WORDS` `:41–47`, Explore `:193`, Practice `:307`, Test `:34–40, :98`.
- **Text:** CFU: "Tall tells how high something is." Later: "'tall' describes length." and a graded Length/Weight question.
- **Breaks:** Blocker (the taught meaning conflicts with the graded answer); english-learners.md (one word per idea).
- **Rewrite (recommended):** remove *tall* from `WORDS` in both files. It can stay as a wrong choice in the CFU.

#### E1-17 · Major
- **Where:** U1 `:227, :251, :300–324`; Test `:98, :114, :177, :192, :207`.
- **Text:** "Which word describes LENGTH, not weight: "long" or "heavy"?"; "Does "tall" tell you about an object's LENGTH or its WEIGHT?"; "Which of these ALSO describes length…"; "Which word means the OPPOSITE of "long"?"
- **Breaks:** builder → K–1 (no vocabulary questions); negative in question (traps §6); *describes* and *opposite* are untaught; four Test items have no picture.
- **Rewrite:**
  - `:227` "Which word tells how long? Long or heavy?"
  - `:251` "Which word tells how heavy? Heavy or long?"
  - `:307` "Long. Does it tell how long or how heavy?" Choices: "How long", "How heavy".
  - `:316` "Which word goes with long? Short or light?"
  - Test `:192` "Which word goes with long? Short or light?" and `:207` "Which word goes with heavy? Light or short?", each with a small picture.
  - Explains: "Long and short go together."

#### E1-18 · Major
- **Where:** Key Idea `:335–336`; Explore `:170, :183, :193`.
- **Text:** "Every object has measurable attributes — like how LONG or SHORT it is, and how HEAVY or LIGHT it is." "Looking bigger does NOT always mean being heavier — a balloon looks big but a rock is heavier. One object can have more than one attribute at once." "Click a describing word to see which attribute it's about."
- **Breaks:** grade-K.md → Math words (*attribute*), Limits.
- **Rewrite:**
  - Key Idea: "Things can be long or short." / "Things can be heavy or light." / "Big does not mean heavy."
  - `:170` "Tap a picture."
  - `:183` "Tap a word."
  - `:193` "Long tells how long." / "Heavy tells how heavy." (one line per word, matching the attribute).

#### E1-19 · Major
- **Where:** CFU `:67`, buttons `:71`.
- **Text:** "Which word tells how heavy something is?" Answer: *heavy*.
- **Breaks:** checklist §3 → Giveaways. The question contains its answer, so it checks nothing.
- **Rewrite:** keep the scale picture. "This side went down. Is it heavy or light?" Options: heavy, light. Move the "Long tells…" reason out with the *tall* and *long* options.

#### E1-20 · Major
- **Where:** `:32`, Test `:25`. **Text:** "jump rope" with glyph U+1FA22.
- **Why:** U+1FA22 is the Unicode character WHITE CHESS TURNED KNIGHT, not a jump rope. It will show a chess symbol or an empty box. The picture is what carries the word for a non-reader.
- **Breaks:** grade-K.md → "the picture must carry the problem".
- **Rewrite:** replace the object with scarf 🧣 (see E1-13).

#### E1-21 · Minor
- **Where and rewrite:**
  - `:222` "Think about how it would look stretched out end to end." → "Look at it. Is it long?"
  - `:246` "Think about how hard it would be to lift." → "Could you lift it with one hand?"
  - `:267` "It has more than one way to describe it." → cut.
  - `:271` "One word is about length, one is about weight." → replaced by E1-14.
  - `:302` "The word "tall" is a describing word." → cut.
  - `:308` "Think about what "long" means when you say it about an object." → "Look at the word's picture."
  - `:317` "One of these words goes with "long", and one doesn't." → "Which one goes with long?"
- **Breaks:** builder (say what to do; K–1 hints point at the picture); 8-word limit.

#### E1-22 · Minor
- **Where:** CFU `:133`. **Text:** "Could you lift a train? It is not light."
- **Breaks:** builder → a wrong-answer reason must not state the answer. With two buttons, "not light" gives it.
- **Rewrite:** "Could you lift a train?"

---

### Unit 2: Comparing

#### E1-23 · Blocker
- **Where:** CFU `:145–155`; Explore `:215–216, :220`; Practice `:297–308`; Test `:106–112, :120–126, :195–203`.
- **Text:** "Which side is HEAVIER?" with *Left / Right*. "The right side went up." "The Left side is heavier."
- **Why:** three problems together.
  1. The answer depends on knowing left from right. grade-K.md's position words do not include them, and the MK1 vocabulary list teaches *left* only as "still there".
  2. "The right side" can be heard as "the correct side".
  3. Unit 3 uses *left* to mean remaining (E1-39). grade-K.md says not to use both in one lab.
- **Breaks:** grade-K.md → Watch for ("Left has two meanings"); traps §1.
- **Rewrite:** use the colors already on the pans. `leftLabel="Blue"`, `rightLabel="Orange"`, colored buttons "Blue side" / "Orange side" (like `rodBtn`). "Which side is heavier?" Feedback: "The orange side went up. The heavy side goes down." Explore steppers: "Blue side", "Orange side".

#### E1-24 · Blocker · Needs your decision
- **Where:** U2 `:340–347`, CFU `:104–111`; U2 Test `:145, :168`; U3 `:424–426`; U3 Test `:140–143`. Also in the Module Test.
- **Text:** "How many blocks LONGER is Rod A than Rod B?" "How many MORE does Red have than Green?" Hint: "Subtract the smaller count from the bigger count." Explain: "6 - 4 = 2." (spoken "6 minus 4 equals 2").
- **Why:** these are compare-difference problems. grade-K.md: "Not yet: start unknown, change unknown, compare problems." The hint also uses untaught *subtract* and the reversed word order in traps §3. MK3 needs only MK1, so − and = are not safe to assume.
- **Breaks:** grade-K.md → Word problems; traps §3, §4.
- **Rewrite (recommended):** "Rod A is ___ than Rod B." Choices: longer, shorter. For groups: "Which group has more?" (already there), then "Which group has fewer?"
- **If you keep the count:** "How many extra blocks does Rod A have?" / "How many extra does Red have?" Hint: "Count the extras." Remove the equations.

#### E1-25 · Major
- **Where and rewrite:**
  - `:265`, `:281`, Test `:77–78` "Which rod is ACTUALLY longer?" → "Which rod is longer?"
  - `:267` "These rods do NOT start at the same place. Look at where each one starts, not just where it ends." → "They start in different places."
  - `:281` hint "Rod B doesn't start where Rod A does — compare how many blocks each rod is actually made of." → "Count the blocks in each rod."
  - `:281` explain "…so Rod B is actually longer, no matter where either one starts." → "Rod A has 5. Rod B has 8."
  - `:291` wrap-up "Rod B is actually longer, even though the two rods don't start in the same place." → "Rod B is longer."
  - Test `:78` hint is never shown; its explain → "Rod A has 5. Rod B has 8."
- **Breaks:** grade-K.md → Limits and Grammar (two clauses); untaught *actually, no matter, even though*.

#### E1-26 · Major
- **Where:** Key Idea `:358–359`.
- **Text:** "To compare two objects fairly, line them up at the SAME starting point before looking at which one reaches farther." "You can describe the DIFFERENCE, not just which one is more — "Rod A is longer than Rod B by 3 blocks," not just "Rod A is longer.""
- **Breaks:** grade-K.md → Math words (*difference* is not yet), Limits (20 and 27 words).
- **Rewrite:** "Start them at the same place." / "Which one goes past the other? It is longer."

#### E1-27 · Major
- **Where:** one object, many names: *scale* (U1 `:89`), *balance* (U2 `:213, :302`), *pan* and *sinks* (U2 Test `:201`), *tips down / tips up* (`:302–306`), *goes down* (CFUs), "balance evenly" (`:220`).
- **Breaks:** english-learners.md (one word per idea); checklist → Synonyms; *pan, sinks* appear only in a Test.
- **Rewrite:** use **scale** and **goes down / goes up** everywhere.
  - `:213` "Add blocks. Watch the scale."
  - `:220` "Both sides are the same."
  - `:302` "Look at the scale."
  - `:305` hint "The heavy side goes down."
  - Test `:201` "The blue side is heavier. Which way does it go?" Choices: Down, Up.

#### E1-28 · Minor
- **Where:** `:252`, `:343`, `:347`.
- **Text:** "Rod A has 5 blocks and Rod B has 8 blocks, so Rod B is longer." "Both rods start together, so just compare how far each one reaches."
- **Rewrite:** "Rod A has 5. Rod B has 8." / "Which one goes farther?" / (if kept) "Rod B has 3 extra." Singular is already handled at `:347`.

#### E1-29 · Minor
- **Where:** CFU `:124`. **Text:** "Rod B starts later, so its end is farther. Count the blocks!"
- **Why:** *later* is a time word used for a place.
- **Rewrite:** "Rod B starts in a new place. Count the blocks!"

#### E1-30 · Minor
- **Where:** `BalanceScale.tsx:34` draws 🧱. U1 `:100` and `:106` call them "blocks", with pans labeled "Balloon" and "Rock". The same glyph is named "brick" in `OBJECTS`.
- **Why:** the picture says *brick*, the voice says *block*, and the label says *rock*.
- **Rewrite:** use a plain square block as the scale's glyph, and keep the word *blocks*.

#### E1-31 · Minor
- **Where:** first use of *rod*, U2 `:201` and CFU `:90`. Not taught in MK1.
- **Rewrite:** add one line to Explore: "This is a rod. It is made of blocks."

#### E1-42 · Minor
- **Where:** U2 `:252, :281, :343`; U2 Test `:78`.
- **Text and spoken:** "Rod B has 1 blocks." `lengthPair` can produce a 1-block rod, in about 12% of pairs (100,000 simulated draws of the default generator).
- **Breaks:** checklist §3 → Generated plurals and prepositions.
- **Rewrite:** the E1-25 and E1-28 wording drops the noun and fixes this: "Rod A has 5. Rod B has 1."

---

### Unit 3: Classifying

#### E1-32 · Blocker
- **Where:** U3 `:290, :308, :314, :328, :336, :350`; Test `:49, :70, :181`.
- **Text:** "Which group does the circled item belong in?" Choices include *Circles*. "Does the circled square belong with the circles, even though it's a different color?"
- **Spoken:** "circled" sounds almost the same as "circle" in a lab that sorts circles. A ringed triangle is offered with the wrong answer *Circles*; a ringed circle makes the word a giveaway.
- **Breaks:** Blocker (double meaning changes the answer); traps §1, §2; *item* and *belong* are harder words than needed.
- **Rewrite:**
  - Story: "We sort by shape."
  - Prompt: "Look at the one on top. Where does it go?"
  - Wrap-up: "It goes with the triangles."
  - Test `:181`: "We sort by shape. Does it go with the circles?" Choices: Yes, No.

#### E1-33 · Blocker
- **Where:** U3 `:312`. **Text:** "What attribute were these items sorted by?"
- **Breaks:** grade-K.md → Math words (*attribute* is not yet); passive voice. The answer depends on it.
- **Rewrite:** "How did we sort? Color or shape?" Explain: "We sorted by color."

#### E1-34 · Major
- **Where:** U3 Test `:85, :99, :200`.
- **Text:** "How many are in the Red group?" above a bin labeled "Red (6)". `SortedBins` shows the count unless `hideCount` is set.
- **Breaks:** checklist §3 → Giveaways. The screen text states the answer on a Test.
- **Rewrite:** pass `hideCount: true` on the asked bin (Practice already does this at U3 `:369–370`).

#### E1-35 · Major
- **Where:** CFU `:96`, `:156`.
- **Text:** "We sort by color. Where does the yellow square go?" with *Yellow group*. "Now we sort by shape. Where does the red circle go?" with *Circles*.
- **Breaks:** checklist §3 → Giveaways. The student can match the word they just heard without looking.
- **Rewrite:** "We sort by color. Where does this one go?" / "Now we sort by shape. Where does this one go?" The picture already rings the item.

#### E1-36 · Major
- **Where:** Key Idea `:437–438`; stories `:290, :328, :361, :413`.
- **Text:** "Pick ONE attribute (like color or shape) and sort every object by that same attribute the whole time — never switch partway through." "Once everything is sorted, count each group, then compare the counts to find which has more or fewer." "These are already sorted and counted by color."
- **Spoken:** "the whole time" contains a homophone (*whole/hole*), harmless here but one more long phrase.
- **Breaks:** grade-K.md → Math words, Limits (22 and 18 words), passive voice.
- **Rewrite:**
  - Key Idea: "Sort by color. Or sort by shape." / "Keep the same rule." / "Count each group." / "Which has more?"
  - Stories: "We sort by color." / "We sort by shape." / "Here are two groups."

#### E1-37 · Major
- **Where:** U3 Test `:229`; explain "Circles has the fewest (3)." **Text:** "Which group has the FEWEST?"
- **Why:** *fewest* appears only on the Test. MK1 and this lab teach *fewer*, not *fewest*. Practice never compares three groups or uses the word.
- **Breaks:** checklist §3 → Untaught words.
- **Rewrite:** teach it first with a three-group Practice item: "This group has the fewest." Then the Test may ask "Which group has the fewest?" Explain: "Circles has the fewest."

#### E1-38 · Minor
- **Where and rewrite:**
  - `:312` "Look at what's the same within each group." → "What is the same in this group?"
  - `:336` "Look at its shape, not its color — everything here is the same color." → "Look at its shape."
  - `:343` "Even with more groups, the rule stays the same." → replaced by E1-02.
  - `:381, :390` "Count each one in that group exactly once." → "Count each one once."
  - `:423` "Count both groups, then compare." → "Count each group."

#### E1-39 · Minor
- **Where:** `:262` "3 left to sort."; `:424` "Count the Red ones left over: 1, 2."
- **Breaks:** grade-K.md → Watch for; english-learners.md (*left over*).
- **Rewrite:** "Sort 3 more." / "Count the extras: 1, 2."

#### E1-40 · Minor
- **Where:** `:262`. **Text:** "Every item is sorted! Check the counts under each group."
- **Why:** the counts are at the top of each bin, beside the name (`SortedBins.tsx:153`), not under it.
- **Breaks:** checklist §3 → Text vs. picture.
- **Rewrite:** "All sorted! Count each group."

#### E1-41 · Minor
- **Where:** CFU `:139` asks about "FEWER"; the reason at `:148` says "Red has 6. Green has 4. Which is less?"
- **Breaks:** english-learners.md (one word per idea).
- **Rewrite:** "Red has 6. Green has 4. Which has fewer?"

---

## 4. What's working well

- All three CFUs are one question at a time, with short sentences, a picture, typed answers and few-word praise.
- The Practice wrap-up is honest about stars, and the spoken "star" follows the same condition.
- No fractions appear anywhere, so there is no slash-fraction problem.
- No student text mentions a grade or prior schooling, apart from the standard code in E1-10.
- Generated grammar is mostly clean: no a/an slips, and the only broken plural is "1 blocks" (E1-42).
- The voice handles capitals, quotes, dashes and "6 - 4" correctly.

## 5. Out of my lane (for the curriculum checker)

- U1's CFU has students measure a train in blocks, which the plan says this standard doesn't introduce.
- The size-vs-weight CFU uses bricks on a scale as stand-ins for a balloon and a rock, which may blur what is being weighed.
- "Which rod is longer?" with different starts: check that the generator often makes the shorter rod end farther along. Otherwise the trap rarely appears.
- `wrongAttributeAppliedQuestion` always has the answer "No".
- Painting an object (E1-15) isn't part of K.MD.1.

## 6. Guideline gaps

Proposed additions. I did not edit these files.

- **grade-K.md → Watch for:** "*Long/short* and *heavy/light* need something to compare to. Don't ask them about a single object unless nearly every child would give the same answer."
- **math-language-traps.md §1 table:** add `circled | has a ring drawn around it | sounds like the shape "circle" | K–2 — don't use "the circled item" in a lab that names circles; say "this one" or "the one on top."`
- **grade-K.md → Math words:** "*Left* and *right* are not taught in K. Don't make an answer depend on them; use colors or pictures."
- **checklist.md §3 → Voice:** "Word-only answer buttons must be spoken. Check that each question's speaker and auto-read include its choices."
- **math-language-traps.md §8:** "A slash between words ('longer/shorter') is silent. The voice runs the words together."

## 7. What I could not check

- Real iPad/iOS speech. In particular, whether "Rod A" is said as the letter "A" or as "uh". Test this on a device.
- How U+1FA22 appears on a real iPad (chess symbol or empty box). It's wrong either way.
- Real students. Which objects children agree on (E1-13) is my judgment.
- The screens were checked from code and generated text, not in a live browser, so the spoken results for dropdowns and buttons come from reading the speech code.
