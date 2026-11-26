# Language check: how to review a lab

This is the procedure the `math-lab-english-checker` agent follows, and
anyone can follow it by hand. It runs on its own, separately from the
`math-lab-curriculum-design-checker` review, which owns learning and
pictures. The two use the same severity scale so their reports can be
merged. The question for every sentence:
**could a student at the bottom of this grade's reading range understand it
well enough to show the math they know?**

## 1. Set the target
- Pick the lab's grade and open that grade file.
- Also open the **next-younger** grade file: behind students and English
  learners read at that level. Text the student must *read alone* should
  meet the younger file's limits; spoken text can meet the lab's grade.
- Note whether the lab reads aloud. If it doesn't, every sentence must work
  on the page alone.

## 2. Collect every sentence
Explore text, the Key Idea, CFU questions and feedback, Practice stories,
prompts, hints, Show me lines, explanations, wrap-ups, Test questions,
button labels. For generated text, print one sentence per template × every
pool word (names, verbs, objects) with a scratch script, at the smallest and
largest numbers the generator can produce. Also check Explore lines at
**every control value, including the lowest and 0**; a generator run doesn't
reach them.

## 3. Check each sentence
| Check | Look for | Where it's explained |
|---|---|---|
| Length | Over the grade's working limit | grade file → Limits |
| Grammar | Structures marked "not yet" (passive, *if*, relative clauses, negation, long noun phrases) | grade file → Grammar; traps §6 |
| Math words | A word from a later grade, or a word used before the unit teaches it | grade file → Math words |
| Untaught words | A word a student must understand to answer (in a prompt, choice, title or Test item) that no earlier unit in this lab and no earlier lab teaches. Check the lab vocabulary lists (`_planning/Grade-*/{LabName}/vocabulary.md`) of every earlier lab, and this lab's own list for earlier units. Avoiding a word in Unit 1 isn't enough if Unit 4's Test uses it (MG2: "digit"). Check titles too | builder rules → Vocabulary list |
| Double meanings | An everyday word used in its math sense (or both senses in one lab) | traps §1 |
| Voice | Homophones without context; symbols, ranges, "vs.", arrows, "?". **Word-only answer buttons must be spoken:** check that each question's speaker and auto-read include its choices (from MK3, 2026-11-24; all grades) | traps §2, §8 |
| Retry reasons | The reason after a first wrong tap plays right before the retry question, so write it as a statement, not a question (from MK3, 2026-11-24; K–1 CFUs using KCheck) | this checklist |
| Order | Words in a different order from the operation, when that isn't the skill | traps §3 |
| Comparison | "More/fewer" sentences, especially where the words point the wrong way, before 2nd grade | traps §4 |
| Small words | *each, of, per, between, at least* carrying meaning the student hasn't learned | traps §5 |
| Setting | Background knowledge a child might not have; hard-to-say names | traps §7 |
| Synonyms | More than one word for the same idea in one unit | english-learners.md |
| Giveaways | The answer stated in the story, title or wrong-answer message. This includes a reviewer's own suggested rewrite: a wrong-answer message must not state any box's answer ("The LCD is 12" when a box asks for the LCD). **A prompt that names the thing it asks about is a giveaway too** (from MK4, 2026-11-26; all grades): "This triangle got turned. What shape is it now?" with Triangle as a choice, or "This triangle got turned. Is it a square now?" (Yes/No). Show the change in the picture instead ("It got turned. What shape is it now?"). Search every unit Test and the Module Test for this | builder rules |
| Text vs. picture | A sentence that describes a picture ("the two numbers in both lists") doesn't match what the picture shows at the values used. An arrow must point the way the voice says: "went up" gets an up arrow (from MK3, 2026-11-24; all grades) | traps §1 |
| Counting what's on screen | For "How many ___?", count every matching thing on screen. A reference object of the same kind changes the answer (from MK3, 2026-11-24; all grades) | this checklist |
| False distractors | A wrong choice that is a true statement, just not the reason ("B adds more each time" for a times pattern). Every wrong choice must be false, not just less complete | builder rules |
| Loaded questions | "What is wrong?" when "Nothing is wrong" can be the answer. Ask "Is anything wrong?" with the same wording in both cases. **Hints too** (from MK4, 2026-11-26): when the answer can be 0, ask "Is there a corner?", not "Find a corner." (K–1). When the buttons hold a look-alike on purpose (circle and sphere), the hint points at what separates them, not what they share ("Is it round?") (all grades). Don't tell the child to do what the picture has already done ("Line them up." over rows already lined up); say "Look at…" (K–1) | grade file → Watch for |
| Mode-dependent lines | An Explore sentence shown in every mode of a toggle (Add To / Take From, Count on / Count back) must be true in every mode, or switch with the mode. Check the "Look here" key lines too. (MG1 Unit 3: "Take the number you know away from the end" showed in Take From mode too, where a start-missing story adds.) | this checklist |
| Switches | One problem's steps reach opposite results (changes / doesn't change, first numbers / new numbers), and a wrap-up sentence doesn't say which part it means. Name it: "With the new numbers, …" | this checklist |
| Generated plurals and prepositions | "You plotted ${n} points" with no singular case ("1 points"); a fixed preposition before a pooled noun ("in every ${group}" → "in every plate"). The script flags both as `plural:` and `prep:`. **Grammar wins over hiding a hint (user decision 2026-11-18):** if a word after a blank must agree with the answer ("☐ ten" when the answer is 1), keep the correct grammar, even though it hints. Never write "ten(s)" or "one(s)"; that is very confusing for early readers. A group name with a count needs a singular form too: "1 triangle", not "The triangles have 1" (from MK3, 2026-11-24; all grades) | builder rules |
| Counts of two groups | A shared noun after two numbers ("3 blue and 1 orange marbles") breaks at 1. Use separate sentences: "3 are blue. 1 is orange." | this checklist |
| Number of items named | "The two numbers" on a screen that shows three is unclear. Name the items ("Are 0 and 1 the same?"), and any count the sentence states must match the number of items on screen | this checklist |

## 4. Check each word problem against the standards
- In a compare story with fixed names, does the child named as having more
  **really have more at every generated value**?
- Is the **problem type** allowed for this grade (CCSS Table 1 for add and
  subtract, Table 2 for multiply and divide)? E.g. "times as many" in 3rd is
  too early; a start-unknown story in 1st is allowed but shouldn't be
  required for mastery.
- How many **steps**? (K–1: one; 2nd: up to two; 3rd: two; 4th+: several.)
- Is the **question last** and asking for one thing?
- Does the problem rely on a **keyword** to pick the operation?

## 5. Check each screen
- How much does the student have to read before they can act? (K–1: none;
  2nd: a couple of short sentences; 3rd: up to about 4 sentences.)
- New math words on this screen: no more than the grade's limit, each with
  a picture or example.
- New math idea **and** new English on the same screen? Split them.

## 6. Rate findings
Use the same scale as the curriculum design checker:
- **Blocker:** the wording makes a correct-math student get it wrong (the
  word order is reversed, a wrong-way comparison too early, a homophone with no
  context, an untaught word the answer depends on).
- **Major:** many students in the bottom half of the grade's reading range
  will be slowed or confused (over the length limit with "not yet" grammar,
  a word from a later grade, several synonyms).
- **Minor:** a longer-than-needed sentence or a mildly unfamiliar setting.
- **Polish:** clearer, but the student would get there.

For each finding give the exact sentence, the grade file and section it
breaks, and a rewrite at the right level.

## A quick scripted pass
From `pel-sr-ims/`:

```
node scripts/english-check.cjs --grade K <shell .tsx> <lab folder> --all
```

It flags candidates (a person still decides):
- words per sentence over the limit;
- any word from the traps lists (§1 table, §2 homophones, §5 small words);
- passive voice (`were|was|is|are|been` followed by a word ending in *-ed*
  or a common irregular participle);
- sentences starting with *If*, or containing *which / whom / whose / NOT*;
- symbols the voice may not say (`-` between numbers, `vs.`, `→`, `?`
  not at the end);
- later-grade words, true/false statements in K–1 (equation true/false like
  "Is 8 = 8 true or false?" is only noted), homophones (K–3), "times as
  many" before 4th, start-unknown wording in K–1, dash and parenthesis
  asides;
- generated-text grammar: `did ${…}` + a past-tense pool verb ("did Nora
  found"), `${n} are` / `${n} times` / `${n} numbers` / "them" after a
  number with no singular case, echo questions ("has how many"), and "not"
  inside a question.

The word lists in the script mirror the grade files; when a grade file
changes, update the script's `LATER_WORDS` too.
