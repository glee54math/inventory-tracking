# MK3 Measurement & Classifying: English review, round 2

- **Lab:** `MK3_MeasurementAndClassifyingLab` (shown to students as "Measuring & Classifying")
- **Round:** 2, re-review of the round 1 fixes and all new text
- **Date:** 2026-11-21
- **Grade assessed:** Kindergarten band (K and 1st graders seeing this for the first time, plus 2nd graders who are behind; alone on an iPad; mostly non-readers; audio-first). Standards K.MD.1, K.MD.2, K.MD.3.
- **Read-alone level:** Kindergarten is the youngest grade file, so there is no younger file. grade-K.md's rule applies: assume no independent reading.
- **Paths:** unit files are in `MK3/MeasurementAndClassifyingLab/units/`. "U1", "U2" and "U3" are the three units; "Test" means that unit's `*Test.tsx`.
- **Settled, not re-raised:** D1–D10 in `round-1-merged.md`. CFU questions not auto-reading and the question number being spoken are D7 outcomes.

**How the text was checked:** the English script; every Practice bucket (3,000 draws each, with and without a prior clean solve), every unit Test question (400 draws each) and every Module Test question (100 draws each), with each sentence passed through the real `speakableText`; and a line-by-line read of Explore, all CFU prompts and twins, the shell, the diagrams and the shared speech paths (`reading.ts`, `ReadAloud.tsx`, `StepProblem.tsx`, `UnitTest.tsx`, `KCheck.tsx`).

---

## 0. Status of round 1 English fixes

**41 Fix items: 36 Fixed, 4 Fixed but caused a new problem, 1 Not fixed. E1-10 stays Skip (D9).**

| ID | Status | Note |
|---|---|---|
| E1-01 | Fixed (within D7) | All 9 picks and all 9 twins speak their choices in the prompt. No shared edit |
| E1-02 | Fixed | No true/false wording remains |
| E1-03 | Fixed | D8 bands are correct in `ModuleTest.tsx:17–24` |
| E1-04 | **Fixed, new problem** | Titles are right, but U2's title breaks the mastery sentence. See E2-52 |
| E1-05 | Fixed | |
| E1-06 | Fixed | Openings are a 1–2 word title, one short line and one prompt |
| E1-07 | Fixed | No "click" in student text |
| E1-08 | Fixed (within D7) | Numbered 1–5. The number is still spoken, as decided |
| E1-09 | **Not fixed (in part)** | Unit cards are spoken. The Start/Continue button and Module Test card are not, and the spoken card text runs together. See below |
| E1-10 | Skip (D9) | Standard line kept |
| E1-11 | Fixed | No all-caps words in generated text |
| E1-12 | Fixed | Stray tag gone. The list needs one update (E2-45) |
| E1-13 | **Fixed, new problem** | D1 objects and reference block are in, but the reference block is counted by "How many blocks". See E2-44 |
| E1-14 | Fixed | Dropdown gone |
| E1-15 | Fixed | Paint question gone (D10) |
| E1-16 | Fixed | "Tall is long, standing up." (D2) applied correctly |
| E1-17 | Fixed | Hear a word, tap a picture (D4) |
| E1-18 | **Fixed, new problem** | "Short tells how long." and "Light tells how heavy." sound contradictory. See E2-47 |
| E1-19 | Fixed | |
| E1-20 | Fixed | Scarf replaces the wrong glyph |
| E1-21 | Fixed | |
| E1-22 | Fixed | |
| E1-23 | Fixed | Blue and Orange sides. The pan color (`--qc`, #5a6fd6) really is blue |
| E1-24 | Fixed | "How many extra blocks?" (D3); no equations or "subtract" |
| E1-25 | Fixed | No "actually" |
| E1-26 | Fixed | Line up first, count to check (D5) |
| E1-27 | Fixed | Only "scale" is used, with no balance, pan, tips or sinks. See E2-46 (never introduced) and E2-58 (one wording slip) |
| E1-28 | Fixed | |
| E1-29 | Fixed | |
| E1-30 | Fixed | |
| E1-31 | **Fixed, new problem** | U2 teaches "rod", but U1 now uses it first. See E2-45 |
| E1-32 | Fixed | "this one", with a ring and an arrow |
| E1-33 | Fixed | |
| E1-34 | Fixed | Every Test bin hides its count |
| E1-35 | Fixed | No prompt names the item's color or shape |
| E1-36 | Fixed | "rule" is judged in E2-54 |
| E1-37 | Fixed | "fewest" is taught in Explore before Practice and Test |
| E1-38 | Fixed | |
| E1-39 | Fixed | No "left" in student text |
| E1-40 | Fixed | Praise only when all are right |
| E1-41 | Fixed | |
| E1-42 | Fixed | "1 blocks" can no longer occur |

### E1-09 · Minor · Not fixed (in part)
- **Where:** shell `:90–92` (Start/Continue), `:121–130` (Module Test card), `:102` (card speech).
- **Text:** "Start exploring", "Continue: {title}" and "Module Test / 15 questions." have no speaker. The unit card speaks `${u.title} ${u.goal}` with no pause.
- **Spoken:** "Long and Heavy Tell how long." and "Sort and Count Sort them."
- **Breaks:** grade-K.md → What they can read.
- **Rewrite:** `text={`${titleSentence(u.title)} ${u.goal}`}`. Wrap the Start/Continue button and the Module Test card in `ReadAloud`, or give each a speaker.

---

## 1. Verdict

**Not ready, but close.** The round 1 rewrite worked: sentences are short, every CFU pick speaks its choices without giving the answer away, and all the banned words are gone. Two new problems can still mark a student wrong who knows the math: **a down arrow on a side the voice says "went up"**, and **an extra block in the picture that "How many blocks?" also counts**.

| Severity | Count |
|---|---|
| Blocker | 2 |
| Major | 3 |
| Minor | 11 (10 new + E1-09) |
| Polish | 3 |
| **Total open** | **19** |

**Nothing needs your decision.** Every finding has a rewrite inside D1–D10.

### The checks you asked for

| Check | Result |
|---|---|
| Every CFU pick really speaks its choices | **Yes:** 18 of 18 prompts (9 picks, 9 twins) |
| Spoken choices don't give away the item's attribute | **Yes:** U3 says "this one", then the group names |
| "left", "circled", "item", "attribute", "click", "actually", true/false gone | **Yes:** 0 in generated speech and 0 in student strings |
| Singular and plural in generated text | **Mostly:** "1 blocks" is gone. Open: "the extras: 1" (E2-50), "Circles has" (E2-51) |
| "scale" used consistently | **Yes,** but no line says what a scale is (E2-46) |
| "goes down / goes up" consistent | **Yes,** with one slip, "is down" (E2-58). The arrow contradicts "up" (E2-43) |
| No grade references | **Yes,** apart from the Standard line kept by D9 |
| Honest stars | **Yes:** the wrap-up and spoken "star" follow the real award |

---

## 2. Scorecard

Length = the script's "% over the 8-word limit". Its one flag (3% of screen strings) is a false alarm from joining separate Home sentences. One real 9-word prompt is in U1 (E2-48).

| Part | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell / Home | Strong (0%) | OK | Strong | n/a | OK | Strong |
| U1 Long and Heavy | OK (1 prompt) | OK | Weak | Strong | Weak | OK |
| U2 Longer, Heavier | Strong (0%) | Strong | Strong | Strong | OK | OK |
| U3 Sort and Count | Strong (0%) | OK | OK | Strong | Strong | OK |
| Module Test | Strong (0%) | OK | OK | Strong | OK | Strong |

U1 is "Weak" on Voice because of E2-43, where the voice and the picture disagree. U2 has the same arrow only in a Practice help step. The Module Test leaves out the "went up" question and the typed "blocks long" question, so neither Blocker can mark a student wrong there; a *light* picture can still appear as a wrong choice.

---

## 3. All findings

### Unit 1: Long and Heavy

#### E2-43 · Blocker
- **Where:** the arrow is always drawn pointing down: `diagrams/BalanceScale.tsx:102` and `diagrams/ObjectGlyph.tsx:94, :106`. It meets "up" wording at U1 Practice `:329`; U1 Test Q10 `:172–175` (also shown on every draw that asks about the side that went up); the *light* picture in U1 Practice and Test word questions; and U2 Practice `:385, :394`.
- **Text:** "See the arrow. Did it go up?" and "This side went up. Is it heavy or light?"
- **Why:** the voice says *up* while the arrow points *down*. A child told to look at the arrow sees "down", and the lab has taught that the heavy side goes down, so a child who follows it picks **heavy** and is marked wrong. On the Test there is no help to correct this.
- **Breaks:** Blocker definition; checklist §3 → Text vs. picture.
- **Rewrite:** keep the words. Add an arrow direction, so a side that went up gets an **up** arrow, and use it wherever the marked side is the raised side, including the *light* `WordPicture`.

#### E2-44 · Blocker
- **Where:** `diagrams/ObjectGlyph.tsx:76–79` (the reference block). Prompts at U1 `:313, :357`; U1 Test `:132`. Hint at U1 `:295`.
- **Text:** "How many blocks long is the train?" Hint: "Count each block once."
- **Why:** the picture has a row of blocks under the object **and** one more block of the same color at the side, labeled "block". A child who counts every block answers one too many (8 for a 7-block train) and is marked wrong, on a Test with no help.
- **Breaks:** Blocker definition; checklist §3 → Text vs. picture.
- **Rewrite:** keep the reference block (D1) and name the row:
  - Prompt: "How many blocks are under the train?"
  - Hint: "Count the blocks under it."
  - Also draw the reference block in a different style, such as an outline or a muted color.

#### E2-45 · Major
- **Where:** "rod" in U1 Practice `:373, :399, :404, :410`; U1 Test `:32, :39, :157`; `vocabulary.md` lists rod under Unit 2 only.
- **Text:** "It tells how long. Find the rod." "How tall is the rod? Count the blocks." The spoken picture choices are "rod" and "scale".
- **Why:** the line that teaches the word, "This is a rod. It is made of blocks.", is in U2. U1 now needs the word first.
- **Breaks:** checklist §3 → Untaught words.
- **Rewrite:** when a length word is tapped in U1 Explore, say "This is a rod." before its line. Example: "This is a rod. Tall is long, standing up." Add rod to Unit 1 in `vocabulary.md`.

#### E2-46 · Major
- **Where:** U1 Explore `:221`, the first scale in the lab.
- **Text:** "The heavy side goes down. The light side goes up."
- **Why:** no sentence says what a scale is, yet Practice and the Tests say "Look at the scale." and "How many blocks are on the scale?" A two-pan scale is unfamiliar to many young children, and English learners may not know the word.
- **Breaks:** README idea 5 (a math word is taught, not assumed); checklist §3 → Untaught words.
- **Rewrite:** "This is a scale. The heavy side goes down. The light side goes up."

#### E2-47 · Major
- **Where:** `WORD_LINES` U1 `:159, :162` (Explore and Practice wrap-up); hints `:404`.
- **Text and spoken:** "Short tells how long." "Light tells how heavy." Hint for *light*: "It tells how heavy. Find the scale."
- **Why:** by ear these say the opposite of the word. A child has just learned that short is not long and light is not heavy.
- **Breaks:** grade-K.md → Limits (one idea); traps §1.
- **Rewrite:**
  - short: "Short is a few blocks."
  - light: "Light goes up on the scale."
  - Hints: "Short is a few blocks. Find the rod." / "Light goes up. Find the scale."
  - Leave long, tall (D2) and heavy as they are.

#### E2-48 · Minor
- **Where:** U1 CFU Q3 `:98`.
- **Text:** "How many blocks are as heavy as the rock?" (9 words, with an *as…as* comparison)
- **Breaks:** grade-K.md → Limits, Grammar.
- **Rewrite:** "The scale is flat. How many blocks?"

#### E2-49 · Minor
- **Where:** U1 Explore `:214`; Practice hint `:287`.
- **Text:** "Many blocks is long. Few blocks is short."
- **Why:** "blocks is" models wrong grammar, which matters for English learners.
- **Breaks:** english-learners.md → sentence patterns.
- **Rewrite:** "Many blocks? It is long. Few blocks? It is short."

#### E2-56 · Minor
- **Where:** U1 Test `:39` (shown on the results screen).
- **Text:** "The rod shows tall." "The scale shows light."
- **Rewrite:** use the same word lines as Explore, after E2-47. Example: "Light goes up on the scale."

#### E2-57 · Minor
- **Where:** U1 CFU Q4 `:112–115`.
- **Text:** "How long is the train? Count the blocks."
- **Why:** the picture is a plain bar labeled "Train". No train is shown.
- **Breaks:** checklist §3 → Text vs. picture.
- **Rewrite:** draw it with `ObjectOnBlocks` and ask "How many blocks are under the train?" (see E2-44).

#### E2-60 · Polish
- **Where:** U1 CFU `:80, :90`.
- **Text:** "Yes! The rock is small, but heavier." (feedback limit is 2–5 words)
- **Rewrite:** "Yes! The rock is heavier." / "Yes! The brick is heavier."

---

### Unit 2: Which Is Longer? Which Is Heavier?

#### E2-50 · Minor
- **Where:** U2 Explore `:251`; U2 Show me `:435`; U3 Show me `:483`.
- **Text and spoken:** "The ring shows the extra blocks: 1." "Count the extras: 1." Near-ties make a difference of 1 common (D6).
- **Breaks:** checklist §3 → Generated plurals.
- **Rewrite:** when the count is 1: "The ring shows the extra block: 1." / "Count the extra one: 1."

#### E2-55 · Minor
- **Where:** U2 Explore `:251`; Practice hint `:434`.
- **Text:** "The ring shows the extra blocks." "Count the blocks in the ring."
- **Why:** the picture has one dashed outline **per block**, not one ring around them.
- **Breaks:** checklist §3 → Text vs. picture.
- **Rewrite:** "The rings show the extra blocks: 1, 2." / "Count the blocks with rings."

#### E2-58 · Polish
- **Where:** U2 CFU `:150, :163`.
- **Text:** "The blue side is down."
- **Rewrite:** "The blue side went down."

---

### Unit 3: Sort and Count

#### E2-51 · Minor
- **Where:** U3 Explore `:313`; `:337, :370, :403–404, :445–449`; U3 Test `:39, :52, :112, :146, :160`.
- **Text and spoken:** "Circles has the fewest." "Triangles has 5." "It goes with Squares." The CFU says "It goes with the circles."
- **Why:** a plural name with "has" is heard as wrong grammar, and the lab says the group's name two ways. "Circles has the fewest" came from my own round 1 rewrite (E1-37), so this corrects it.
- **Breaks:** grade-K.md → Plurals; checklist §3 → Generated plurals.
- **Rewrite:** add a small helper for shape groups: "The circles have the fewest." "The triangles have 5." "It goes with the squares." Color groups stay as they are: "Red has 5." "It goes with red."

#### E2-53 · Minor
- **Where:** U3 Practice hints `:445, :447`.
- **Text:** "Find the smallest group." "Find the biggest group."
- **Why:** two more words for *fewest* and *most*, in a lab that teaches "big does not mean heavy".
- **Breaks:** english-learners.md → one word per idea.
- **Rewrite:** "Count each group. Which has the fewest?" / "Count each group. Which has the most?"

#### E2-54 · Minor
- **Where:** U3 Key Idea `:501`; wrap-up `:407`. The fixer asked this round to judge the word.
- **Text:** "Keep the same rule." "You kept the same rule."
- **Why:** *rule* has no picture, and at home it means "what you are allowed to do".
- **Breaks:** README idea 5; traps §1.
- **Rewrite:** "Keep sorting the same way." / "You sorted the same way."

#### E2-59 · Polish
- **Where:** U3 CFU `:139, :152`.
- **Text:** "Green runs out first."
- **Breaks:** english-learners.md → phrasal verbs.
- **Rewrite:** "Green stops first."

---

### Shell

#### E2-52 · Minor
- **Where:** shell `:350, :358`.
- **Text and spoken:** "You finished Which Is Longer? Which Is Heavier? Now take the test."
- **Why:** the agreed "You finished {title}." works for two titles, but this one is two questions, so it sounds like the lab is asking something.
- **Rewrite:** "You finished this part. Now take the test." / "You finished this part. You passed the test."

---

## 4. What's working well

- All 18 CFU prompts speak their choices, and U3 no longer names the item.
- Generated speech has no banned words, no a/an slips, and no "1 blocks".
- Almost every sentence is within the 8-word limit, and Practice openings are short.
- Blue side and Orange side remove the left/right problem completely.
- "How many extra blocks?" is applied everywhere as D3 asks, with no equations.
- The star wording is honest, and "Solved, with help." is used after help.

## 5. Out of my lane (for the curriculum checker)

- All 9 CFU twins keep the **same answer in the same button position**. After one wrong tap on a two-button pick, tapping the other button always passes.
- The U1 Test size-versus-weight question has no scale, so it relies on what a child already knows about the objects.

## 6. Guideline gaps

Proposed additions. I did not edit these files.

- **checklist.md §3 → Text vs. picture:** "An arrow that marks something must not point against the word spoken. If the voice says 'went up', the arrow points up."
- **checklist.md §3 → Text vs. picture:** "When a question says 'How many ___?', count every matching thing on screen. A reference object of the same kind changes the answer."
- **grade-K.md → Watch for:** "Don't explain a word with its opposite ('Short tells how long'). Say what it looks like."

## 7. What I could not check

- Real iPad/iOS speech, including whether "Rod A" is said as the letter "A".
- Whether 🪵 🪨 🪶 draw on the target iPads.
- Real students.
- Speech in a live browser. Generated text went through the real `speakableText`; which elements the voice reaches was read from the speech code.
