# English for Math: grade-level language guidelines

Reference for anyone writing or reviewing math-lab text (the `math-lab-builder`,
`math-lab-english-checker` and `math-lab-fixer` agents, or a person). The goal: **a student
should never fail a math problem because of the English.** A 3rd grader who
can multiply but can't untangle "If the total is distributed equally among…"
looks like they don't know multiplication. They do. The lab measured reading.

These are guidelines for a grade, not rules for every lab. Use the file for
the lab's grade, and the next-younger file for the students who are behind.

The closest job title is a *reading/literacy specialist* who focuses on
*academic language* (the language of school subjects). For students learning
English it overlaps with an *ELD (English Language Development) specialist*.

## Files

| File | What's in it |
|---|---|
| [grade-K.md](grade-K.md) | Kindergarten: non-readers, all by ear |
| [grade-1.md](grade-1.md) | 1st: beginning readers |
| [grade-2.md](grade-2.md) | 2nd: decoding, still slow |
| [grade-3.md](grade-3.md) | 3rd: last year of "learning to read" |
| [grade-4.md](grade-4.md) | 4th: "reading to learn"; the vocabulary jump |
| [grade-5.md](grade-5.md) | 5th: words become expressions |
| [grade-6-8.md](grade-6-8.md) | Middle school: abstract academic language |
| [math-language-traps.md](math-language-traps.md) | Words and phrasing that trip students at every grade |
| [english-learners.md](english-learners.md) | Students still learning English (about 1 in 5 in California) |
| [checklist.md](checklist.md) | How to run a language check on a lab (the English checker's procedure; script: `pel-sr-ims/scripts/english-check.cjs`) |
| [assessment-2026-11-05.md](assessment-2026-11-05.md) | First check of every built lab (a baseline to compare later checks against) |

Each grade file has the same sections: what the student can read, what
they understand by ear, sentence and screen limits, grammar they can handle,
math words (already known / new this grade / not yet), the word-problem
types the standards expect, things to watch for, and before/after rewrites.

## Seven ideas behind every file

1. **Students understand far more by ear than they can read.** Listening
   comprehension runs ahead of reading until about middle school. Through
   2nd–3rd grade, the voice is how the lab reaches a student's real
   understanding. This is why K–5 labs here read aloud.
2. **Text a student reads alone should be about one grade below their
   grade.** The lab is testing math, not reading, and roughly a third of US
   4th graders read at a proficient level (NAEP). Writing to grade level
   loses most of the class.
3. **Language load and math load add up.** Working memory is small,
   especially in young children. When the math idea is new, the English must
   be the simplest possible. When a new math word is being taught, use
   familiar, easy math. Never make both new at once.
4. **Math English is its own dialect.** Everyday words have different math
   meanings (*table, product, even, left, round, mean*). Word order doesn't
   follow the order of the operation (*subtract 3 from 10*). Tiny words carry
   the math (*of, each, than, per, at least*). See
   [math-language-traps.md](math-language-traps.md).
5. **A math word is taught, not assumed.** Introduce it with a picture, say
   it aloud, then use it the same way every time. Don't switch between
   synonyms (*add / plus / sum / total / in all / altogether*) in one unit
   until each one has been taught.
6. **Making the English simpler doesn't make the math easier.** Studies that
   simplified test wording (shorter sentences, active voice, familiar words)
   while keeping the math the same raised scores for English learners and
   weak readers, and didn't hurt anyone else (Abedi & Lord, 2001).
7. **The standards already set the language timeline.** CCSS math sets
   *which word-problem structures* belong to which grade (Table 1 and Table
   2 in the CCSS glossary). CCSS English Language Arts sets *which grammar
   and decoding skills* come when. The grade files line these up.

## Sources

- CCSS Mathematics, Glossary Tables 1–2 (problem situation types by grade),
  and the *Progressions for the CCSS: K–5 Operations and Algebraic Thinking*.
- CCSS ELA: Reading Foundational Skills (RF), Language (L), Speaking and
  Listening (SL) standards; Appendix A text-complexity bands (Lexile).
- California ELD Standards (Emerging / Expanding / Bridging).
- Abedi & Lord (2001), *The Language Factor in Mathematics Tests*.
- Riley, Greeno & Heller (1983) and Lewis & Mayer (1987) on word-problem
  difficulty and comparison language.
- Chall's stages of reading development ("learning to read" → "reading to
  learn" around 4th grade); Sticht & James (1984) on listening vs. reading.
- Fountas & Pinnell and Lexile benchmarks, used only as rough guides.

Sentence-length and screen limits in these files are **working limits**
(based on the sources above and on what reads well aloud). They aren't
official standards. Treat going over one as a reason to look, not an
automatic failure.
