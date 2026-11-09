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
largest numbers the generator can produce.

## 3. Check each sentence
| Check | Look for | Where it's explained |
|---|---|---|
| Length | Over the grade's working limit | grade file → Limits |
| Grammar | Structures marked "not yet" (passive, *if*, relative clauses, negation, long noun phrases) | grade file → Grammar; traps §6 |
| Math words | A word from a later grade, or a word used before the unit teaches it | grade file → Math words |
| Double meanings | An everyday word used in its math sense (or both senses in one lab) | traps §1 |
| Voice | Homophones without context; symbols, ranges, "vs.", arrows, "?" | traps §2, §8 |
| Order | Words in a different order from the operation, when that isn't the skill | traps §3 |
| Comparison | "More/fewer" sentences, especially where the words point the wrong way, before 2nd grade | traps §4 |
| Small words | *each, of, per, between, at least* carrying meaning the student hasn't learned | traps §5 |
| Setting | Background knowledge a child might not have; hard-to-say names | traps §7 |
| Synonyms | More than one word for the same idea in one unit | english-learners.md |
| Giveaways | The answer stated in the story, title or wrong-answer message. This includes a reviewer's own suggested rewrite: a wrong-answer message must not state any box's answer ("The LCD is 12" when a box asks for the LCD) | builder rules |
| Text vs. picture | A sentence that describes a picture ("the two numbers in both lists") doesn't match what the picture shows at the values used | traps §1 |

## 4. Check each word problem against the standards
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
- later-grade words, true/false in K–1, homophones (K–3), "times as many"
  before 4th, start-unknown wording in K–1, dash and parenthesis asides.

The word lists in the script mirror the grade files; when a grade file
changes, update the script's `LATER_WORDS` too.
