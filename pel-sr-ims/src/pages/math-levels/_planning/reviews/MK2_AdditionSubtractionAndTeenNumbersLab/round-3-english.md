# MK2 Addition, Subtraction & Teen Numbers: English review, round 3

- **Lab:** MK2 `AdditionSubtractionAndTeenNumbersLab` (6 units, 6 unit Tests, Module Test of 30)
- **Round:** 3, re-review, the last round the workflow allows · **Date:** 2026-11-21
- **Grade assessed:** Kindergarten, K–1 band. There is no younger grade file, so `grade-K.md` is also the limit for read-alone text: assume no independent reading.
- **Audience:** K/1st graders seeing this for the first time, plus 2nd graders who are behind, alone on an iPad, audio-first.
- **Settled and not re-opened:** D1, D2, D4, D5, D6, D7; voice "blank" with text "box"; correct grammar after a blank; never "ten(s)". Old unit titles in `plan.md` are known.
- **How real values were checked:**
  - I bundled the lab's real generators: 3,000 problems per Practice bucket, 1,200 draws per Test question and 200 per Module Test slot, giving 12,427 unique strings. I checked them for "1 + plural", banned words, star wording, length and capitals, and sampled them through the real `speakableText`.
  - For every Practice step I rendered the real picture in the state "hint opened, no try yet" and compared it with what the hint says.
  - I ran the real lab in a browser at 820×1180 with speech captured: all five "write another way" outcomes, Read all, the re-check entry, and **every Explore mode at every stepper value** (945 unique lines).

Paths are relative to `src/pages/math-levels/MK2/AdditionSubtractionAndTeenNumbersLab/units/`, unless a line says "shell" (`MK2_AdditionSubtractionAndTeenNumbersLab.tsx`).

## 0. Status of round 2 fixes that concern wording

**27 rows checked: 22 Fixed · 5 Fixed, but caused a new problem · 0 Not fixed.**

| Row | ID | Status | Evidence or new finding |
|---|---|---|---|
| 2 | C1-27 Hint before a try | **Fixed, new problem** | The picture no longer reveals the answer, but the hints on 19 kinds of Practice step now describe things not drawn before a try (E3-65, E3-66) |
| 5 | C1-11 Teen pictures | **Fixed, new problem** | "?" is drawn, and the hint still says "Count the dots outside the ten." (E3-66) |
| 6 | C2-46 + E2-50 `OwnWay` | **Fixed, new problem** | No "Not a match" is shown or spoken on any path, including Read all. The 0 line names an action the step doesn't have (E3-68) |
| 7 | C2-47 New row hint | **Fixed, new problem** | Right after a first miss. If the hint was opened first, it never updates (E3-69) |
| 8 | C2-48 + E2-56 0-fact hints | **Fixed, new problem** | True at 0 + 0 and n − 0. Two lines ask about dots on a bare fact card (E3-66) |
| 10 | E2-48 "1 orange marbles" | Fixed | 0 hits for "1 + plural" in generated text and Explore |
| 11 | E2-49 *split* | Fixed | 0 hits for *split* or *each* |
| 12 | E2-51 "1 fingers" | Fixed | "1 finger. Put 0 down. 1 is still up." |
| 13 | E2-53 "He ate 2" | Fixed | "He eats 2. Those are gone." |
| 15 | C2-50 "Let's check" | Fixed | Shown and spoken once on arrival in Explore, after Next problem |
| 16 | C2-51 New number in picks | Fixed | "Now 4. Which one makes 10?" |
| 17 | C2-52 Re-check sets | Fixed | Lines true for both sets |
| 18 | C2-53 Colors | Fixed | Blue known, orange missing |
| 19 | C2-54 Challenge extras | Fixed | "Count the extras: 1, 2." |
| 20 | E2-52 False at 0 | Fixed | "None went away: 6 − 0 = 6." at every Start value |
| 21 | E2-54 Pointer | Fixed | "Look here. Count all the dots." |
| 22 | E2-55 "fills every box" | Fixed | "4 and 6 fill every box." |
| 23 | E2-57 One name | Fixed | One name throughout. The prompt that uses it has a separate problem (E3-67) |
| 24 | E2-58 More or fewer | Fixed | "5 dots. Add 2. More, or fewer?" |
| 25 | E2-59 Titles (D6) | Fixed | All six match D6 on screen and in speech |
| 28 | C2-58 Zoe | Fixed | Zoe and Ben sound different |
| 30 | E2-60 Capitals | Fixed | 0 lowercase sentence starts; lowercase kept after "Listen:" |
| 31 | E2-61 Challenge wording | Fixed | "Mia has 5 stickers. Leo has 3 stickers." · "2 extras." |
| 32 | E2-62 "by Jen" | Fixed | "Count Jen's dots." |
| 33 | E2-63 Long lines | Fixed | Both rewrites are in |
| 34 | E2-64 Back button | Fixed | "← Back" |
| 35 | English §5 Demo | Fixed | The demo stops before pairs repeat in the other order |

## 1. Verdict

**Not ready to sign off, but very close: two Major wording problems remain, and both are small text changes.** The bigger one is a side effect of round 2. A hint opened before a try can tell a child to count something that isn't drawn, and on take-away problems that leads straight to the wrong answer.

**New findings: 0 Blocker · 2 Major · 4 Minor · 2 Polish (8).**

## 2. Scorecard

Length: the script finds 0% of task and after-answer strings over 8 words. Its 3 "screen" flags are separate lines joined together, or the accepted Key Idea "A teen number is one ten and some ones."

| Unit | Length | Grammar | Vocabulary | Word problems | Voice | Screen load |
|---|---|---|---|---|---|---|
| 1 Put Together and Take Away | Strong | Strong | Strong | Strong | Weak before a try (E3-65) | Strong |
| 2 Story Problems to 10 | Strong | Strong | Strong | OK (blue crackers, E3-71) | Weak before a try (E3-65) | Strong |
| 3 Break Numbers Apart | Strong | Strong | Strong | n/a | Weak before a try (E3-65) | Strong |
| 4 Make 10 | Strong | Strong | Strong | n/a | Strong | Strong |
| 5 Fast Facts to 5 | Strong | Weak (E3-67) | Strong | n/a | OK (E3-66) | Strong |
| 6 Teen Numbers | Strong | Strong | Strong | n/a | OK (E3-66) | Strong |
| Module Test | Strong | Strong | Strong | Strong | Strong | Strong |
| Shell | Strong | Strong | Strong | n/a | Strong | Strong |

## 3. All findings

### Hints in several units

#### E3-65 · Major · A hint before a try sends the child to count the wrong dots

- **Why it matters:** "Show hint" before any try now only speaks, and the picture stays as it was (round 2 row 2). These lines describe the picture *after* a try. Before a try, following the hint gives a wrong answer.
- **Seen in the browser:** "There are 9 birds. 6 fly away. How many birds are left?" Hint, spoken: "The faded dots went away. Count the dots left." The picture has **0 faded dots and 9 solid dots**, so a child who does what the voice says answers 9.
- **Breaks:** checklist §3 "Text vs. picture"; builder "Getting unstuck: the help ladder."
- **Rewrite:** these stay true before and after a try, and give away no answer. Fingers are taught in Unit 1 and "count on" in the lab before this one (`CountingAndCardinalityLab/vocabulary.md`).

| Where | Part | Exact text now | What the child would count | Replace with |
|---|---|---|---|---|
| `PuttingTogetherAndTakingApart.tsx:354` | Take away, step 1 | The faded dots went away. Count the dots left. | All the dots (the start) | `` `Show ${total} fingers. Put ${b} down.` `` |
| `PuttingTogetherAndTakingApart.tsx:406` | Fingers, take-away form | The faded fingers went down. Count the fingers up. | All the fingers (the start) | `` `Show ${start} fingers. Put ${down} down.` `` (keep the `joining` line as it is) |
| `PuttingTogetherAndTakingApart.tsx:476` | Number sentence, take-away form | The faded dots went away. Count the dots left. | All the dots | `` `Show ${total} fingers. Put ${b} down.` `` |
| `WordProblemsWithin10.tsx:371` | Take-from story, step 3 | The faded dots went away. Count the dots left. | All the dots | `` `Show ${total} fingers. Put ${b} down.` `` |
| `DecomposingNumbers.tsx:319` | Large number, step 2 | Look at the new row. Count the orange dots. | The **top** row's orange dots, the only ones drawn | `` `Start at ${otherA}. Count on to ${total} on your fingers.` `` |
| `DecomposingNumbers.tsx:357` | Second way, step 1 | Look at the new row. Count the orange dots. | The **top** row's orange dots | `` `Start at ${a2}. Count on to ${total} on your fingers.` `` |
| `DecomposingNumbers.tsx:390` | Same parts | Look at the two colors. Count one color. | All the dots: only one color is drawn, so the count is the total | "One for you. One for me. Keep going." |

The "Look here" pulse and the changed picture still do the pointing after a wrong try.

#### E3-66 · Minor · A hint before a try names dots that aren't drawn

- **Why it matters:** the same side effect, but with nothing wrong to count. The child hears about orange dots and sees a "?", or hears about dots and sees only "3 + 2 = ☐". They are stuck until they make a try. That is why this is Minor and E3-65 is Major.
- **Breaks:** checklist §3 "Text vs. picture."
- **Rewrite:**

| Where | Part | Exact text now | Replace with |
|---|---|---|---|
| `WordProblemsWithin10.tsx:433` | Missing part, step 2 | Count the orange dots. | `` `Start at ${a}. Count on to ${total} on your fingers.` `` |
| `DecomposingNumbers.tsx:254` | Small number, step 1 | Count the orange dots. | `` `Start at ${a}. Count on to ${total} on your fingers.` `` |
| `DecomposingNumbers.tsx:309` | Large number, step 1 | Count the orange dots. | `` `Start at ${a}. Count on to ${total} on your fingers.` `` |
| `FastFactsWithin5.tsx:320` | Add, not 0 + 0 | Look at the dots. Count them. | One number is 0: `` `Show ${count(a + b, "finger", "fingers")}. Add none.` `` Otherwise: `` `Show ${count(a, "finger", "fingers")}. Show ${b} more.` `` |
| `FastFactsWithin5.tsx:352` | Take away, answer not 0 and t not 0 | The faded dots went away. Count the dots left. | `` `Show ${count(s, "finger", "fingers")}. Put ${t} down.` `` |
| `FastFactsWithin5.tsx:352` | n − n | Are any dots left? | The same line: "Show 3 fingers. Put 3 down." |
| `FastFactsWithin5.tsx:387` | Same two | Look at the dots. Count them. | `` `Show ${count(n, "finger", "fingers")}. Show ${n} more.` `` |
| `FastFactsWithin5.tsx:409` | Missing number, not 0 | Count the orange dots. | `` `Start at ${x}. Count on to ${s} on your fingers.` `` |
| `FastFactsWithin5.tsx:409` | Missing number is 0 | Are there any orange dots? | `` `You have ${x}. Do you need more?` `` |
| `TeenNumbers.tsx:243, 270` | How many ones | Count the dots outside the ten. | `` `Start at 10. Count on to ${teen} on your fingers.` `` |
| `TeenNumbers.tsx:244` | New teen number | Count the dots outside the ten. | `` `Start at 10. Count on to ${other} on your fingers.` `` |

**Keep:** "Are there any dots?" (0 + 0) and "None went away." (n − 0) are true before and after a try. `TeenNumbers.tsx:218` is also fine, because the ones are drawn on that step.

### Unit 5

#### E3-67 · Major · "Are the two numbers the same?" on a card with two matching numbers

- **Where:** Practice, `FastFactsWithin5.tsx:327`. The card above it comes from `:313`.
- **Exact text, seen in the browser:** the card shows **0 + 1 = 1** and the voice asks "Are the two numbers the same?" The right answer is **No**.
- **Why it matters:** the card has three numbers, and two of them *are* the same: the 1 and the 1. A child who reads the card correctly taps Yes and is marked wrong, and a wrong pick costs the clean solve. This happens on **22% of this bucket's problems** (667 of 3,000), every time one number is 0.
- **Breaks:** checklist §3 "Text vs. picture"; traps §1.
- **Rewrite:** name the numbers: `` `Are ${a} and ${b} the same?` `` → "Are 0 and 1 the same?" The Test item (`FastFactsWithin5Test.tsx:60`) shows only "0 + 1." with no answer, so it can stay.

### Unit 3

#### E3-68 · Minor · "Put dots in both parts." on a step with no dots to move

- **Where:** `OwnWay.tsx:49`.
- **Problem:** the student types numbers in two boxes and cannot put dots anywhere. When they type 4 + 0, which is true, the line also doesn't say that it is true.
- **Breaks:** builder "If a hint tells the student to touch the picture…"; round 2 guideline proposal 8 (a rejected true answer must say it is true and why).
- **Rewrite:** if the sum is right: `` `Yes, that makes ${total}. No 0 this time.` `` If it is wrong: `` `No 0 this time. Make ${total}.` ``

#### E3-69 · Minor · The "write another way" hint can go stale, and "two new numbers" isn't always true

- **Where:** `OwnWay.tsx:11`, `DecomposingNumbers.tsx:263`.
- **Seen in the browser:**
  - Hint opened first, then a wrong sum: it **stays** "Make 4 with two new numbers.", and the voice repeats it, while the new row appears. The agreed line never plays. With no hint first it works: "Look at the new row. Count both colors."
  - After 4 = 1 + 3, the only new way is 2 + 2. That is one number twice, so "two new numbers" can steer a child away from the only answer.
- **Breaks:** checklist §3 "Text vs. picture"; merged row 7.
- **Rewrite:** before a miss: `` `Find a new way to make ${total}.` `` After a miss, the hint must change to "Look at the new row. Count both colors." even if it was already open. The element is reused, so React doesn't re-render it when `miss.seen` changes. The fixer needs to make it update from inside MK2.

#### E3-70 · Minor · "There are many ways." when the Number is 2

- **Where:** Explore, `DecomposingNumbers.tsx:170`. The stepper's minimum is 2.
- **Exact text at 2:** "Move the dot. Find another way. There are many ways." beside "2 is 1 and 1." The dot can't move, and there is no other way.
- **Breaks:** checklist §3 "Text vs. picture"; merged guideline proposal 7 (check the stepper minimum).
- **Rewrite:** when `total === 2`: "Try a bigger number." Otherwise keep the line.

### Unit 2

#### E3-71 · Polish · Blue and orange crackers

- **Where:** `WordProblemsWithin10.tsx:390, 416`, which draw from the full item pool.
- **Exact text:** "Jen has crackers. 5 are blue. 4 are orange."
- **Breaks:** traps §7 (setting). The child can still solve it.
- **Rewrite:** for these two color stories, draw from stickers, crayons, marbles, balloons and blocks.

#### E3-72 · Polish · Two wordings when the rows are equal

- **Where:** Explore compare, `WordProblemsWithin10.tsx:161` ("They are the same.") and `:268` ("They have the same.").
- **Breaks:** english-learners.md → "Several words for one idea."
- **Rewrite:** "They have the same number." in both places.

## 4. What's working well

- **`OwnWay` feedback is clean.** The hidden "Not a match" line is never shown or spoken on any of the five paths, including Read all.
- **The 945 Explore lines** have no "1 + plural" and no false line at 0, apart from E3-70.
- **No later-grade words** and no star wording in generated text. The one star line seen ("Solved it! You got a ⭐!") followed a clean solve.
- **"Let's check."** is short, spoken once, and says why the student is back in Explore.
- **The marble pattern** reads well at every value: "A jar has marbles. 1 is blue. 2 are orange."
- **Judged fine, no change:** "0 are left." · "The rest are orange." when one is left (changing it to "is" would give the answer away) · the voice reading "The ten comes first: 1 7." (it names the two written numbers in order, which is the point of the line).

## 5. Out of my lane (for the curriculum checker)

- In "write another way", a 0 or a repeated pair doesn't count as a miss, so a child who keeps typing one never gets the new row or Show me.
- The E3-65 and E3-66 finger hints replace a picture cue before a try. If the curriculum review prefers a picture cue there, the wording must still be true of what is drawn.

## 6. Guideline gaps (proposed, not applied)

1. **`checklist.md` §3, Text vs. picture:** "Read each Practice hint against the picture **before any try**. If the picture holds back the answer until a wrong try, the hint must still be true of what is drawn."
2. **`math-lab-builder.md`, help ladder:** "When the picture is held back until a wrong try, a K–1 hint may use the student's own fingers or counting on instead of pointing at the picture." The fixes for E3-65 and E3-66 rely on this reading of the current rule.
3. **`checklist.md` §3, Text vs. picture:** "'The two numbers' is unclear on a screen that shows three. Name the numbers: 'Are 0 and 1 the same?'"

## 7. What I could not check

- Real iPad speech and real students. The voice was checked with the lab's speech mapping and a captured speech stub.
- CFU wrong-answer ladders were read in the code, not driven one by one in the browser.
- The browser run used one screen size (820×1180). Layout is outside this review.
- Shared end-of-test wording ("Keep practicing — aim for 9 out of 10.") is in `shared/` and outside this lab's fixes. *Aim* is a little hard for K.
