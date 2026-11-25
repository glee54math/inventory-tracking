# MK3 Measurement & Classifying: English review, round 3 (final)

- **Lab:** `MK3_MeasurementAndClassifyingLab` (shown to students as "Measuring & Classifying")
- **Round:** 3, re-review of the round 2 fixes and all changed text
- **Date:** 2026-11-21
- **Grade assessed:** Kindergarten band (K and 1st graders seeing this for the first time, plus 2nd graders who are behind; alone on an iPad; mostly non-readers; audio-first). Standards K.MD.1, K.MD.2, K.MD.3.
- **Read-alone level:** Kindergarten is the youngest grade file, so there is no younger file. grade-K.md's rule applies: assume no independent reading.
- **Paths:** unit files are in `MK3/MeasurementAndClassifyingLab/units/`. U1, U2 and U3 are the three units. "Test" means that unit's `*Test.tsx`.
- **Settled, not re-raised:** D1–D12, including "Tall is long, standing up", "How many extra blocks?", the Standard line, CFU questions not auto-reading, the spoken question number, and D11's 10-word prompt. All were applied correctly.

**How the text was checked:** the English script; a scratch run of every Practice bucket (3,000 draws each), every unit Test question (800 draws each) and every Module Test question (200 draws each), which gave 924 different sentences, each passed through the real `speakableText`; and a line-by-line read of Explore, all CFU prompts and twins, the shell, the diagrams, and the shared speech paths (`KCheck.tsx`, `CfuPointers.tsx`, `lookHere.ts`, `StepProblem.tsx`).

---

## 0. Status of round 2 English fixes

**19 Fix items: 18 Fixed, 1 Fixed but caused a new problem, 0 Not fixed.**

| ID | Status | Note |
|---|---|---|
| E1-09 | Fixed (D12) | Start/Continue, unit cards and Module Test card all have a voice, with a pause between title and goal |
| E2-43 | Fixed | The arrow follows the tilt in `BalanceScale` and in the *light* picture. Every "went up" scene has an up arrow |
| E2-44 | Fixed | White reference block in its own box; "How many blocks are under the {object}?" everywhere |
| E2-45 | Fixed | "This is a rod." plays on each length word. See Polish E3-68 |
| E2-46 | Fixed | "This is a scale. The heavy side goes down. The light side goes up." |
| E2-47 | Fixed | "Short is a few blocks." "Light goes up on the scale." Both hints match. One older line nearby: E3-64 |
| E2-48 | Fixed | "The scale is flat. How many blocks?" |
| E2-49 | Fixed | "Many blocks? It is long. Few blocks? It is short." |
| E2-50 | Fixed | One and many both correct at a difference of 1 |
| E2-51 | **Fixed, new problem** | "The circles have…" is right, but a count of 1 now says "The triangles have 1." See E3-62 |
| E2-52 | Fixed | "You finished this part…" |
| E2-53 | Fixed | "Which has the fewest?" / "…the most?" |
| E2-54 | Fixed | No "rule" in any student string |
| E2-55 | Fixed | "The rings show…", "Count the blocks with rings." |
| E2-56 | Fixed | Test results use the Explore word lines |
| E2-57 | Fixed | Q4 draws the real train over its blocks |
| E2-58 | Fixed | "went down" |
| E2-59 | Fixed | "stops first" |
| E2-60 | Fixed | "Yes! The rock is heavier." / "Yes! The train is heavier." (the twin changed under C2-38) |

### The checks you asked for

| Check | Result |
|---|---|
| Arrow direction against spoken up/down | **Correct** in CFU, Practice, Test and the word pictures |
| "under the train" wording | **Correct.** The reference block is not in the row and not under the object |
| "Short is a few blocks", "Light goes up on the scale" | **Correct** in Explore, hints, wrap-ups and Test results |
| First-wrong-tap reasons over the twin | **True for both questions; none names the old answer.** Four end in a question, so the child hears two questions in a row (E3-65) |
| Elephant and mouse Explore text | **Correct.** "This big one is heavy." The button says "elephant and mouse" |
| "How many circles?" Practice kind | Prompt and hint are **correct**. Two small wording issues (E3-62, E3-63) |
| Shape-group plurals | **Correct,** apart from a count of 1 (E3-62) |
| Singular "extra block" | **Correct** in Explore, Show me and results |
| Home speech | **Correct** by code: every card and button has the right text |
| Grade references, honest stars | **None; honest** |

---

## 1. Verdict

**Ready.** No wording can mark a student wrong who knows the math, and nothing blocks understanding. Every round 2 fix landed. What remains is 5 small Minor wording fixes and 4 Polish items, all optional for release.

| Severity | Count |
|---|---|
| Blocker | 0 |
| Major | 0 |
| Minor | 5 |
| Polish | 4 |
| **Total open** | **9** |

**Nothing needs your decision.** Every finding has a rewrite inside D1–D12.

---

## 2. Scorecard

Length = the script's "% over the 8-word limit". The only real sentence over the limit is D11's agreed prompt. The shell's one flag is a false alarm from joining separate Home sentences.

| Part | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| Shell / Home | Strong (0%) | Strong | Strong | n/a | Strong | Strong |
| U1 Long and Heavy | Strong (D11 only) | Strong | Strong | Strong | OK | OK |
| U2 Longer, Heavier | Strong (0%) | Strong | Strong | Strong | OK | OK |
| U3 Sort and Count | Strong (0%) | OK | Strong | Strong | OK | OK |
| Module Test | Strong (0%) | OK | Strong | Strong | Strong | Strong |

---

## 3. All findings

### Unit 1: Long and Heavy

#### E3-61 · Minor
- **Where:** U1 Explore `:180` (Look here for CFU Q2), with the line at `:165`.
- **Text:** the lit spot opens teddy bear and hammer, and highlights "Big does not mean heavy."
- **Why:** the Look here button only appears on the twin, whose right answer is the **big train**. The fixer changed the spoken line for this reason (fixes note 4), but the picture and the highlighted line still show the small one winning.
- **Breaks:** checklist §3 → Text vs. picture.
- **Rewrite:** open the elephant and mouse example for `u1-big`. The lit line becomes "This big one is heavy." Keep "Look here. See which one goes down." `u1-down` stays as it is.

#### E3-64 · Minor
- **Where:** U1 Practice word bucket `:443`.
- **Text and spoken:** "Which picture shows short?" … "A rod shows how long." Also "Which picture shows light?" … "A scale shows how heavy."
- **Why:** this is the same mismatch E2-47 removed from the word lines. The Test already uses the better line.
- **Breaks:** grade-K.md → Limits (one idea); traps §1.
- **Rewrite:** `explain: WORD_LINES[w]`, so it says "Short is a few blocks." / "Light goes up on the scale."

#### E3-67 · Polish
- **Where:** U1 Practice hint `:368`.
- **Text:** "See the arrow. Did it go down?" / "…Did it go up?"
- **Why:** "it" sounds like the arrow, which does not move.
- **Rewrite:** "See the arrow. This side went down." / "See the arrow. This side went up."

#### E3-68 · Polish
- **Where:** U1 Explore `:176`, `:249`.
- **Why:** "This is a rod." only plays if the child taps a length word, and nothing requires that. Practice then says "Find the rod."
- **Rewrite:** start with `revealedWord` set to `"long"`, so the rod and its line are on screen from the start.

---

### First-wrong-tap reasons (U1, U2, U3)

#### E3-65 · Minor
- **Where:** U1 CFU `:31` (Q2), `:32` (Q5); U2 CFU `:76, :85` (Q1); U3 CFU `:143, :152` (Q4).
- **Spoken after a first wrong tap (U1 Q5):** "Look at the scale. Which side went down? The scarf is long. What else is it? Heavy or light?"
- **Why:** KCheck plays the reason and then the twin's question. The reason's own question is never answered, and its answer is not on the buttons. The lab's rule is one short question at a time.
- **Breaks:** `feedback_k_cfu_design`; grade-K.md → Instructions at once.
- **Rewrite (statements that fit both the question and its twin and name no answer):**
  - U1 Q2: "Heavy is hard to lift."
  - U1 Q5: "Look at the scale. The heavy side goes down."
  - U2 Q1: "The longer one goes past."
  - U3 Q4: "Match them up."

---

### Unit 2: Which Is Longer? Which Is Heavier?

#### E3-66 · Polish
- **Where:** U2 CFU `:116, :125`.
- **Text:** "One rod starts in a new place. Count the blocks!"
- **Why:** the lab's phrase is "different places", and the Q3 prompt uses it.
- **Breaks:** english-learners.md → one word per idea.
- **Rewrite:** "They start in different places. Count the blocks."

---

### Unit 3: Sort and Count

#### E3-62 · Minor
- **Where:** `groupHas` at `labParts.tsx:244`, used for counts at U3 `:339, :350` and U3 Test `:126, :140`.
- **Text and spoken:** "How many triangles?" … "The triangles have 1." Also "The circles have 1." and "The squares have 1." The new mixed set often has a shape with just 1.
- **Breaks:** grade-K.md → Plurals; checklist §3 → Generated plurals.
- **Rewrite:** for a shape **count** line, say the number and shape: "1 triangle." / "3 triangles." Color lines stay ("Red has 1."), and so do "The circles have the fewest." and "…the most."

#### E3-63 · Minor
- **Where:** U3 Practice mixed set wrap-up `:453`.
- **Text and spoken:** "You sorted by shape."
- **Why:** the child only counted. The picture sorted itself, so the sentence describes something they did not do.
- **Breaks:** checklist §3 → Text vs. picture.
- **Rewrite:** "We sorted by shape."

---

### Shell

#### E3-69 · Polish
- **Where:** shell `:88`, `:101`, `:265`.
- **Text:** "How long? How heavy? Which group?", "Your path" and the unit title at the top of a unit have no voice.
- **Why:** nothing a child needs is lost, since the next spoken line carries the goal, but a non-reader cannot hear these headings.
- **Rewrite:** wrap each heading in `ReadAloud`.

---

## 4. What's working well

- The arrow, the picture and the voice now agree on up and down everywhere.
- 924 generated sentences: no "1 blocks", no a/an slips, no banned words, and no symbol the voice misreads.
- "Under the train" solves the reference-block problem in very few words.
- Every twin's reason stays true for both questions.
- `vocabulary.md` matches the lab, including rod, scale, elephant and mouse.

## 5. Out of my lane (for the curriculum checker)

- U1 CFU Q1: after a first wrong tap the child hears "Light goes up. Now this side went up." This nearly hands over the twin's answer.

## 6. Guideline gaps

Proposed additions. I did not edit these files.

- **checklist.md §3 → Voice:** "A first-wrong-tap reason plays right before the twin's question, so write it as a statement, not a question."
- **checklist.md §3 → Generated plurals:** "A group name with a count needs a singular form too ('1 triangle', not 'The triangles have 1')."

## 7. What I could not check

- Real iPad/iOS speech, including whether "Rod A" is said as the letter "A".
- Whether 🪵 🪨 🪶 draw on the target iPads.
- Real students.
- Speech in a live browser. Generated text went through the real `speakableText`; the order of spoken lines and the Home speech were read from the code.
