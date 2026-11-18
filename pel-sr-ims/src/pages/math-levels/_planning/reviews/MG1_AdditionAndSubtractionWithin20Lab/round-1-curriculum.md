# MG1 Addition & Subtraction Within 20: curriculum review, round 1

- **Lab:** MG1 `AdditionAndSubtractionWithin20Lab` (6 units, 6 unit tests, Module Test)
- **Round:** 1 (first review; built before the review workflow, so there is no round-0 build report)
- **Date:** 2026-11-17
- **Grade band assessed:** K–1 (K/1st first-timers and behind 2nd graders, alone on an iPad, audio-first)
- **Standards text used:** the condensed reference (`CCSS_K8_STANDARDS_REFERENCE.md`), plus the official CA CCSS wording for 1.OA.1 ("…equations with a symbol for the unknown number…"), 1.OA.2 ("solve word problems that call for addition of three whole numbers…"), 1.OA.4, 1.OA.6 and 1.OA.7/8 examples, where a finding depends on it.
- **How I checked:** I read every unit, test, diagram, the shell, the plan, the builder rules, the pointer rollout notes and the MK2 lab before it. I ran a 20,000-try script over the generators (results quoted below). **I did not run the lab in a browser this round**, so device findings come from the code, and nothing here comes from a screenshot.
- **Already decided by the user (checked, not re-argued):** the CFU "Look here" pointers, the Making Ten rule (break apart the smaller number, wording bigger/smaller), the self-learning help principle, the ≥40% typed CFU rule, and the CFU staying open after it is passed. The older all-at-once CFU layout is raised once, as a decision item (C1-04).

---

## 1. Verdict

**Ready after fixes.** The shell is solid: the gate, the retry lock and the CFU that stays open after passing all work, and Units 1–2 teach well with pictures. The biggest problem is that a non-reader can get through most of the lab **without doing the math**. In Units 4–6 the picture already shows the answer to count. Most CFU answers are picked from a list, and a wrong pick is followed by a message that says the right answer. One Explore screen (Unit 3) also shows false math ("15 + 10 = 20").

## 2. Top 5 changes (ranked)

1. **Stop the pictures from showing the answer before the first try** (C1-05): in fact, equation and put-together Practice and in the Tests. Draw only what the problem gives, and add the combined picture as help after a wrong try. Right now "fluent within 10" is never measured, because the student can count the dots.
2. **Make CFU answers typed and stop wrong-answer messages from saying the answer** (C1-02, C1-03). Five of the six CFUs have no typed box, and the first wrong pick shows the right one. This can be fixed inside the current layout.
3. **Fix the Explore ranges** (C1-01 Blocker, C1-08, C1-15). Unit 3 prints "15 + 10 = 20". Units 4–6 draw 20 dots for totals up to 30. Unit 2's "Making ten works every time" sandbox lets students build 6 + 2, where no ten gets made.
4. **Carry the Making Ten trap into Practice, and keep the rule the same in every unit** (C1-14, C1-30). Practice always writes the bigger number first and never asks which number to break apart. Unit 5's pictures and one Unit 5 Test explanation break apart the bigger number.
5. **Teach every kind of problem before asking it, and make "Show me" teach** (C1-20, C1-16, C1-06). Start/change-unknown stories and "same total" sums are never shown in Explore. "Show me" in Units 3–6 only says "The answer is X."

## 3. Scorecard

Layers: 1 Standards · 2 Audience · 3 Learning arc · 4 Getting unstuck · 5 Pictures · 6 Math · 7 Mastery · 8 Device (from code only)

| Unit | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| 1 Counting On/Back | Strong | OK | OK | Strong | OK | OK | Weak: count-back choice answer is the number in the prompt; CFU all picks | OK |
| 2 Making Ten | OK | OK | Weak: "bigger written second" trap and "same total" sums never practiced/taught | OK | Weak: Explore builds no-ten facts; CFU Q1 colors reversed | Strong | OK | OK |
| 3 Add To/Take From | Weak: no operation/equation step | Weak: long role sentences | Weak: start/change unknown never shown | OK | OK | **Weak: Explore prints false math; Test goes to 25** | Weak: CFU all picks, answer in feedback | Weak: tiny sliders |
| 4 Put Together/Compare | Weak: no operation step | OK | Weak: bigger/smaller unknown not shown | Weak: Show me has no line | Weak: compare model differs in Explore/Test; answer colored | Weak: Explore draws 20 for 30 | Weak: "More than one way" is always right | Weak: sliders |
| 5 Fluency | Weak: 1.OA.2 needs word problems | Weak: classification question | OK | **Weak: hints don't point, no Show me** | **Weak: answer visible; make-ten picture breaks apart the bigger number** | Weak: "best pair" arbitrary / wrong choice also right | **Weak: count dots + copy related fact** | Weak: sliders, dead mode switch |
| 6 Equal Sign | OK | Weak: "addend" choices | OK | Weak: no pointing, no Show me | Weak: answer part colored | OK | **Weak: True/False bucket guessable; fixed-answer choices** | OK |
| Tests / Module | — | — | OK | — | Weak: same answer-showing pictures | Weak: U3 > 20; U5 8 + 9 explanation | Weak: T/F always True | — |

## 4. All findings

### Lab-wide

**C1-02 · Major · Layer 3/7 · Five of six CFUs have no typed answers (user's ≥40% rule).**
- *Who it hurts:* the guesser, who taps any picker until it turns green; the user's fill-in rule.
- *Evidence:* every answer is a `TapSelect` or True/False in Unit 1 (Q1–Q4), Unit 3 (Q1–Q4), Unit 4 (Q1–Q4), Unit 5 (Q1–Q4, including Q4 "9 + 7" as 15/16/17) and Unit 6 (Q1–Q4, including Q4 "8 + ☐ = 11" as 3/8/19). Only Unit 2 (BondFill, 3 of 4) passes.
- *Fix (works in the current layout):* replace number pickers with number-pad boxes (`numberPadProps(early)`). U1 Q1 "Start at ☐, count on ☐ more"; U1 Q3 type 11, 10, 9. U3 Q1/Q2/Q4 "Answer". U4 Q1 answer, Q2 animal cards, Q3 both gaps, Q4 answer. U5 Q4 type 16; U5 Q1 "Add ☐ + ☐ first" typed. U6 Q4 type 3; U6 Q2b "type each side's total, then pick =". That gives at least 2 of 4 typed per unit.

**C1-03 · Major · Layer 3/4/7 · CFU wrong-answer messages give the answer on the first miss.**
- *Who it hurts:* the guesser. They pick anything, hear "…9, 10, 11", re-pick and pass. It also means the new "Look here" pointers almost never appear, because a second miss rarely happens.
- *Evidence:* U1 Q1 "…start at the number you already have (8)… 9, 10, 11"; U1 Q3 "…11, 10, 9"; U3 Q1/Q2/Q4 show `explain` ("11 − 6 = 5", "11 − 4 = 7") on a wrong answer (`AddToTakeFromWordProblems.tsx:117`); U4 Q1 "4 + 5 = 9", Q2 "6 − 2 = 4", Q3/Q4 "9 − 5 = 4"; U5 Q1 "8 + 2 = 10", Q4 "…10 + 6 = 16"; U6 Q2 "both are true", Q3 "simply true", Q4 "11 − 8 = 3".
- *Fix:* the first-miss message becomes a few-word nudge that says what to do, not the result. For example: "Start at the number you have." / "Say one number each time you count back." / "Which one is missing: start, change or end?" / "Line them up. Count the extras." / "Find two that make 10." Show the worked line only in the "right" message. Unit 2's BondFill hints are the right model, though "9 needs 1 more" is borderline.

**C1-04 · Major · Needs the user's decision · Layer 2/8 · The CFUs use the older all-questions-at-once layout, not the K–1 one-at-a-time design.**
- *Who it hurts:* the non-reading Kindergartner. Each CFU puts 4 questions, 5–8 pickers, True/False and sentence-length options on one screen ("the starting amount (how much there was at the very beginning)"), with no picture in 4 of 6 units. MK1–MK4 (`KCheck`) ask one short question with a picture at a time. A student coming from MK4 gets a much harder screen exactly when the math gets harder.
- *My view:* it matters for this audience, mostly in Units 1, 3, 4 and 5, where the CFU has no picture at all.
- *Options:* (A) Rebuild the six CFUs with `KCheck` (`CheckSequence`/`TypeCheck`/`PickCheck`). This also fixes C1-02/C1-03 and drops the True/False items (U6 can still judge equations with big "True"/"False" buttons under the equation, since that is the standard itself). (B) Keep the layout, and do only C1-02 + C1-03 + one picture per question. (C) Leave as is.

**C1-05 · Major · Layer 5/7 · Before any try, the picture shows the answer to count (Practice and Tests).**
- *Who it hurts:* the guesser and the behind 2nd grader, who count dots and never recall or compute. Fact "fluency" is never measured.
- *Evidence:*
  - U5 Practice and Test: `TenFrameGroup value={sum} splitAt={a}` for a + b (`FluencyFactsWithin20.tsx:362, 400`; Test lines 48, 78, 109, 220). Subtraction shows the result cells in their own color (`:377`, Test `:61`). Three addends shows the total (`:448`, Test `:159`).
  - U6 `☐ = a + b` shows the total (`EqualSignAndEquations.tsx:339`, Test `:274`). `a + ☐ = c` and `a − ☐ = c` draw the unknown part in its own color (`:422, :455`, Test `:390, :404`).
  - U4 `ptaAddendUnknown` draws the unknown part in orange (`PutTogetherCompareWordProblems.tsx:442`, Test `:338`), and the both-addends Test item does the same (`:372`).
  - Module Test reuses 7 of these.
- *Fix:* Practice before help draws only what is given. For a + b, use two separate frames (a and b) or the fact big with no dots. For a + ☐ = c, use c in one color with no split. Add the split/colored picture through `pointing(help, i)` after a wrong try. That is allowed under the self-learning principle. In the Tests, show the given numbers only, or no picture for fluency items.

**C1-06 · Major · Layer 4 · In Units 2–6, "Show me" has nothing to teach. It reads "Here's how: … The answer is X."**
- *Evidence:* `showMe:` count per file: U1 4, U2 2 (step 1 only), U3–U6 0. No `showMeHoldMs` anywhere, so "Got it" is never held while a demo plays.
- *Fix:* add a spoken `showMe` to every final step that teaches through the picture, plus a `showMeHoldMs`. U2 step 3 "Ten and 3 more is 13." U3 "Start with 6. Count on to 11: 7, 8, 9, 10, 11. That is 5." U4 compare "Match them up. Count the extras: 1, 2, 3, 4." U5 "Fill the ten with the bigger number. 9 and 1 make 10. 6 more is 16." U6 "Count on from 8 to 11: 9, 10, 11. That is 3." Branch each visual on `help.showMe && help.step === i` to draw the count-along.

**C1-07 · Major · Layer 1/3 · In word problems the student never chooses the operation or writes the equation.**
- *Who it hurts:* every student. 1.OA.1 includes "equations with a symbol for the unknown number", and the builder rule says the student must decide the operation. Hints hand it over ("Result − change = start").
- *Evidence:* U3's six types are "What's unknown?" plus a typed answer. In U4, only `compareDiffFewer` has a "which calculation" step.
- *Fix:* add a step before the typed answer: "Which matches the story?" with three tap buttons built from this story's numbers. For Add-To-Start that is `☐ + 4 = 11`, `11 + 4 = ☐`, `11 − 4 = ☐`, and the right one varies by type (the reversed choice is right sometimes). Keep the role step or replace it, but don't add a fourth step.

**C1-08 · Major · Layer 5/6 · Explore controls let totals go past 20, and the picture quietly stops at 20.**
- *Evidence:* U4 Green/Orange sliders 0–15 each, so "15 + 15 = 30 in all" over 20 dots (`PutTogetherCompareWordProblems.tsx:343–352`). U5 three addends 1–9 each, so "18 + 9 = 27" over 20 dots (`FluencyFactsWithin20.tsx:312–327`). U6 four steppers 0–15, so "Balanced! … both sides equal 25" over 20 dots each (`EqualSignAndEquations.tsx:282–306`).
- *Fix:* set each control's max from the others so the total stays ≤ 20 (e.g. Orange `max={20 - green}`, c `max={20 - a - b}`). The button grays out instead of clamping. Never pass `Math.min(20, …)` to a picture.

**C1-09 · Major · Layer 7 · Some Practice choices have the same right answer every time, and one bucket has no typed step.**
- *Evidence:*
  - U6 `trueFalseTrap` problems are one 2-button step (`EqualSignAndEquations.tsx:381, 394, 406`), so a guesser fills that bucket's 2 clean solves 1 time in 4. "n = n" is always True.
  - U6 "What does the = sign mean here?" is always "Both sides equal the same amount" (`:341, :365`).
  - U6 "Which part is unknown?" is never "The total" (`:424, :441, :457`).
  - U4 "How many different ways…?" is always "More than one way" (`:466`).
- *Fix:* U6 True/False gets a typed step first ("Add the left side: ☐"), then True/False. Drop the "= means" choice from Practice, since the CFU and Test already ask it, or make its distractor change. U6 "which part is unknown": also generate `a + b = ☐` so "the total" is sometimes right. U4: replace the fixed choice with a typed "Show another way: ☐ and ☐" (see C1-25).

**C1-23 · Minor · Layer 8 · Native range sliders in Units 3, 4 and 5 Explore.**
- *Evidence:* `<input type="range">` in U3 (`:245`), U4 (`:343, :367`) and U5 (`:291–318`). The thumbs are small on an iPad, a value can't be set one step at a time, and the voice reads no label. Units 1, 2 and 6 use `Stepper`.
- *Fix:* swap them for `Stepper`, which also makes the C1-08 caps simple.

**C1-37 · Minor · Layer 2 · Students must pick the word "addend" in choices, but no unit teaches it.**
- *Evidence:* 23 uses in student text, including answer buttons "one of the parts (an addend)" (U4) and "The second addend" / "The first addend" (U6), plus prompts in U2.
- *Fix:* say "part" / "the first number" / "the second number" instead, matching the bond picture's words.

**C1-38 · Minor · Layer 1 · 1.OA.4 (subtraction as an unknown-addend problem) is never taught directly.**
- *Evidence:* no unit claims 1.OA.4. Subtraction is taught by counting back and taking away to 10; "think addition" only appears as a hint ("11 − 8").
- *Fix:* in U5's within-20 subtraction Practice, add the step "12 − 8: 8 + ☐ = 12" with the 8 frame and empty boxes highlighted, add one Explore line ("To take away, think: what goes with 8 to make 12?"), and tag the unit 1.OA.4.

**C1-40 · Polish · Layer 3 · Pointers on two-choice CFU questions can almost never show.** After one wrong pick the feedback names the other option, so a second miss doesn't happen. Fine as is. C1-02/C1-03 will make the pointers matter.

### Unit 1: Counting On and Counting Back

**C1-11 · Minor · Layer 7 · The count-back choice "How many TOTAL times should you count back to subtract 3?" is always the number printed in the prompt.**
- *Evidence:* `CountingOnAndBack.tsx:499–503`. The distractors are n ± 1 and never use another on-screen number. When n = 1 there are only 2 buttons (28% of Count-back-small problems, script).
- *Fix:* make the step typed: "Say the numbers: ☐, ☐, ☐" (one box per count). That checks the off-by-one directly. Or add the start number as a distractor.

**C1-10 · Minor · Layer 6 · Count-on allows equal numbers (6 + 6), so "Which number should you start from, 6 or 6?" shows one button.**
- *Evidence:* 5.4% of "Counting on" problems (script). `while (… || a < b)` allows a = b.
- *Fix:* reject `a <= b`.

**C1-12 · Minor · Layer 5 · Explore's number line has no hop arcs.**
- *Evidence:* Explore marks only "start" and "now" (`:383`), while Practice help draws numbered hops. The standard counting-on model is hops.
- *Fix:* pass `hops={{ from: start, to: current, tone: "a" }}` in Explore.

**C1-13 · Minor · Layer 5 · "Show me" on the count-back choice step draws every hop to the final answer.**
- *Evidence:* `hopsFor(help, start, { 1: result })` (`:496, :524`) shows step 3's answer during step 2.
- *Fix:* for step 1, target `start - sub` only as a count of hops, with numbered arcs but no "now" label, or draw `sub` hop arcs without highlighting the landing number.

### Unit 2: Making Ten and Decomposing (Making Ten rule check)

Rule check result. The **Unit 2 files follow the rule**: the Explore steppers say "Bigger number" / "Smaller number", the key line reads "Keep the bigger number whole… Break apart the smaller number.", the CFU Q1 options and feedback use bigger/smaller, the Practice generators keep b < a, the Test `wrongAddendChoiceQuestion` writes the smaller number first and its answer is the smaller one, and the Module Test items comply. **Outside Unit 2, the rule is broken** (C1-30). Unit 2 also still has these gaps:

**C1-14 · Major · Layer 3 · The trap the CFU checks (the bigger number written second) never appears in Practice, and Practice never asks which number to break apart.**
- *Who it hurts:* the procedure-follower, who learns "break apart the second number" from 20 Practice problems that always read "9 + 4", then meets "4 + 9" in the Test.
- *Evidence:* `makeTenAdditionProblem(a, b)` always writes `Find ${a} + ${b}` with a the bigger number (`MakingTenAndDecomposing.tsx:448, 557–570`). No step asks which number to break apart. The Test has it (`wrongAddendChoiceQuestion`).
- *Fix:* in both make-ten buckets, write the smaller number first half the time. Add a first step, "Which number do you break apart?", with both numbers as big buttons (answer: the smaller). Its hint: "Keep the bigger number whole. It is closer to 10." Draw the frames in written order, but always fill the ten with the bigger number.

**C1-15 · Major · Layer 3/5 · Explore lets students build facts where no ten is made, under "Fill the ten first" and "Making ten works every time".**
- *Evidence:* Bigger 6–9 with Smaller min 2 allows 6 + 2 … 6 + 4, 7 + 2, 7 + 3 and 8 + 2. With 6 + 2 the screen shows the bond "2 = 2 + 0", "6 + 2 = 8" and "8 + 0 = 8" (`:379–405`). Subtract allows 15 − 2, which shows "15 − 2 = 13" and "13 − 0 = 13" under "Take away to land on 10 first". The "Try new numbers. Making ten works every time." spot is the pointer for CFU Q3, so a student sent there to check the claim can find a case that looks like it fails.
- *Fix:* Smaller min = `11 - bigger` (sum at least 11). Subtract min = `start % 10 + 1`. Gray out the steppers instead of rounding.

**C1-16 · Major · Layer 3/2 · The "same total, different split" bucket is never taught before Practice asks it.**
- *Evidence:* `equivalentSumProblem` (`:510–552`) appears in no Explore screen or CFU. It asks "what must happen to the OTHER addend?" with three sentence-long buttons. Its step 3 total is already printed in the bond and in step 2's prompt, so it can be copied.
- *Fix:* add a third Explore mode, "Same total", with two bonds and a button "Move one over" that shifts one counter from one part to the other while the whole stays. Add the line "Move one over. The total stays the same." Replace step 3 with a typed "7 + ☐ = 14" using a different first number. The other option is to cut this bucket to Test-only (**needs the user's decision**: it is in the approved plan).

**C1-17 · Minor · Layer 5 · CFU Q1 reverses Explore's colors.**
- *Evidence:* Explore draws the bigger number green (tone a) and the smaller orange (tone b). Q1 (6 + 9) draws 6 green and 9 orange (`:169–171`), and its bond uses c/a while Q2 and Practice use b/c. A non-reader who learned "keep the green one whole" picks 6 to keep.
- *Fix:* in Q1 draw 6 in tone b and 9 in tone a. Bond parts: the part that goes with 9 in tone b, the leftover in tone c.

**C1-19 · Minor · Layer 1/2 · The number bond is new (MK2 never used one) and is never introduced.**
- *Fix:* one Explore line under the first bond: "This is a number bond. The top is the whole. The two circles are its parts."

**C1-18 · Polish · Layer 2 · Rule wording: some lines still say "split the other addend/number" instead of "break apart the smaller number".**
- *Evidence:* Key Idea paragraph 2 (`:585`), CFU Q3 feedback (`:282–283`) and Test `strategyGeneralizationQuestion` (`MakingTenAndDecomposingTest.tsx:187`).
- *Fix:* change those to "break apart the smaller number". Also update the stale pointer mapping (`CFU_Pointer_Rollout/MG1_…md`, the mt-keep row), which still shows the old "Keep the number close to 10 whole. Break apart the other number." line.

### Unit 3: Word Problems: Add To and Take From

**C1-01 · Blocker · Layer 6 · Explore shows false math.**
- *Evidence:* `result = Math.min(20, start + change)` / `Math.max(0, start - change)` (`AddToTakeFromWordProblems.tsx:222`), with Start 0–20 and Add 0–10. Start 15, Add 10 shows "15 + 10 = 20. The amount grew". Start 3, Take away 10 shows "3 − 10 = 0".
- *Fix:* the Add max is `20 - start` and the Take-away max is `start` (use Steppers, see C1-23). Remove the clamps.

**C1-20 · Major · Layer 3 · Explore only shows stories where the end is missing. Start-unknown and change-unknown stories, the plan's main difficulty, appear only as one text line, yet CFU Q2/Q4 and four of the six Practice types ask them.**
- *Who it hurts:* the first-timer, who has never seen a "some apples" story before the CFU asks one. Two of the new pointers (Q2, Q4) land on a sentence.
- *Fix:* add a "What's missing?" toggle (Start / Change / End) to Explore. The missing frame is drawn as an empty dashed frame with a big "?", and pressing "Show" fills it with the counting-on animation. Put the atf-missing spot on that picture.

**C1-21 · Major · Layer 6 · Test take-from-start numbers go above 20.**
- *Evidence:* `result = randInt(2,16); change = randInt(1,9); start = result + change` gives starts up to 25, in 11% of draws (script). Affects `takeFromStartKeywordTrapChoiceQuestion` (also in the Module Test) and `takeFromStartNumberQuestion`. Practice stays ≤ 20.
- *Fix:* `change = randInt(1, Math.min(9, 20 - result))`.

**C1-22 · Minor · Layer 2/7 · The title tells the role, and the role buttons are long sentences.**
- *Evidence:* "Add To — how many at the start?" sits above "What's unknown?" (`:368`). The buttons read "the starting amount (how much there was at the very beginning)".
- *Fix:* use a neutral title ("Story problem"). Shorten the buttons to "Start", "Change" and "End", each with a tiny frame icon.

### Unit 4: Put Together/Take Apart and Compare

**C1-24 · Major · Layer 5 · Compare is drawn three different ways.**
- *Evidence:* Explore and the Test use two separate ten-frame groups labeled "Amount A/B" (`PutTogetherCompareWordProblems.tsx:375–376`; Test `:388, :414, :440`). Practice uses `CompareRows` lined up one-to-one. The builder's standard model is the lined-up rows. The pointer for CFU Q3/Q4 lands on the separate frames, where the extras can't be seen.
- *Fix:* use `CompareRows` in Explore (with names, colors matching, and `showGap` on) and in the Test (without `showGap`).

**C1-25 · Minor · Layer 1/3 · "Both parts unknown" never lets the student make their own split.**
- *Evidence:* Practice and Test always give one part ("if 3 are green…"), which turns it into an addend-unknown problem.
- *Fix:* one step "Show a way: ☐ green and ☐ orange", accepting any two numbers that make the total, then "Show a different way". This needs a small custom check (**needs the user's decision** if it means a new step kind).

**C1-26 · Minor · Layer 6 · Bigger-unknown compare stories always use "more"; "fewer" never leads to adding.**
- *Evidence:* both bigger/smaller-unknown templates say "has N more … than" (`:539, :563`), so "fewer" in any story always means subtract.
- *Fix:* add "Ben has 3 fewer than Lily. Ben has 5. How many does Lily have?" (add).

**C1-27 · Minor · Layer 5 · CompareRows draws up to 20 counters in one ungrouped row.**
- *Fix:* leave a gap after every 5th counter in `CompareRows`.

**C1-28 · Minor · Layer 3 · Bigger-unknown and smaller-unknown compare stories are not shown in Explore.** They appear only in the Key Idea and Practice hints. This is covered once C1-24 adds a "Lily has 3 more than Ben" toggle to the CompareRows Explore.

### Unit 5: Fluency Facts Within 20

**C1-29 · Major · Layer 6 · "Which pair should you add first?" often has no real right answer, and sometimes marks a right answer wrong.**
- *Evidence (script, 20,000 draws):*
  - 66% of problems have no pair that makes 10. The "right" pair is then just the biggest sum (1 + 2 + 3 → "2 + 3"), which is arbitrary.
  - 5.9% list the same pair reversed as a wrong choice (3 + 7 + 3: "3 + 7" is right, "7 + 3" is wrong).
  - 1.3% have a wrong choice that also makes 10.
  - 11% show fewer than 3 buttons.
  - Same generator in the Practice, Test and Module Test (`threeAddendGroupingChoiceQuestion`).
- *Fix:* generate only triples with exactly one make-ten pair and no repeated pair, label choices by position, or accept any pair that makes 10. For triples with no ten pair, use only the typed sum step.

**C1-30 · Major · Layer 5/6 · The Making Ten rule is broken outside Unit 2.**
- *Evidence:*
  - U5 Test `makeTenSpeedNumberQuestion` (`FluencyFactsWithin20Test.tsx:214–222`) can draw 8 + 9 (7% of draws). Its explanation, shown in the test review, says "8 + 2 = 10, then 10 + 7 = 17", which breaks apart the bigger number.
  - U5 Explore, Practice and Test ten-frames always fill the first number first (`splitAt={a}`). For 3 + 9 the picture fills 3 with 7 of the 9, so it visibly breaks apart the bigger number.
  - The CFU Q4 pointer ("Make a ten first") lands in a mode whose default is 3 + 5 = 8, where no ten is made.
- *Fix:* in `makeTenSpeedNumberQuestion`, draw `other` from `gap+1 … nearTen` and build the explanation from the bigger number. Wherever a + b is drawn on ten-frames past 10, fill with the bigger number first (`splitAt={Math.max(a,b)}`, bigger in tone a). Make the within-20 Explore default a past-10 fact with the bigger number first (e.g. 8 + 5), and color the make-ten part as in Unit 2.

**C1-31 · Major · Layer 4/7 · Fluency Practice gives a stuck student nothing to do, and its second step copies a number on screen.**
- *Evidence:* the hints "Try to recall it quickly, without counting one-by-one." and "Can you use a make-ten shortcut?" (`:364, :402`) are the "you should know this" kind. No visual uses `pointing`. The step 2 "Related fact: sum − a = ?" answer is b, which is printed in the story "What is a + b?" (and the same for subtraction).
- *Fix:* the hints say what to do with the picture ("Count on from the bigger number." / "Fill the ten first."). After a wrong try, the picture shows the two addends' frames with the empty boxes lit. Make the related-fact step ask the other subtraction (sum − b = ?), or a turn-around with the box first (☐ + a = sum).

**C1-32 · Minor · Layer 3/5 · Explore's "Within 10" and "Within 20" modes are the same screen, and the three-addends picture shows only the total.**
- *Fix:* Within 10 caps the total at 10. Within 20 starts past 10 with make-ten coloring. Three addends draws three colored groups and highlights the pair being added first.

**C1-33 · Minor · Layer 1 · 1.OA.2 asks for three-addend word problems; the lab has only bare sums. The unit's standard tag also leaves out 1.OA.2.**
- *Fix:* make half of the three-addend problems short stories ("Mia has 4 red, 8 blue and 2 green beads…"). Tag the unit "1.OA.2, 1.OA.3, 1.OA.6".

**C1-34 · Minor · Layer 2 · CFU Q3 / Test "Which is a within-10 fact?" is a classification question that this audience doesn't need.**
- *Fix:* replace it with a typed within-10 fact under a picture ("6 + 3 = ☐"). That fits the fluency goal and C1-02.

### Unit 6: Equal Sign and Equations

**C1-35 · Minor · Layer 3/5 · "The total can go first" and "a box hides a number" are taught only as text lines, and the balance is described but never drawn.**
- *Evidence:* the CFU Q2a and Q4 pointers land on sentences (`EqualSignAndEquations.tsx:309–314`).
- *Fix:* add a box mode to the balance. One stepper becomes "☐" and shows the empty frame. Pressing "Find it" counts on until the two sides match. Add a "Flip" button that shows 9 = 5 + 4.

**C1-36 · Minor · Layer 1 · 1.OA.7/1.OA.8 gaps.**
- *Evidence:* there are no false equations with sums on both sides (4 + 1 = 5 + 2), no subtraction equations to judge (7 = 8 − 1), and no unknown first in a subtraction (☐ − 3 = 5). These are the standard's own examples.
- *Fix:* add these as `trueFalseTrap` / `findUnknownNonFinal` shapes.

## 5. Persona walkthrough highlights

- **The guesser, Unit 5 Practice ("What is 7 + 6?").** The two frames already show a full ten and 3 more, so they count to 13. Step 2 "13 − 7 = ?" and the answer 6 is in the question above. Clean solve, star. Three-addends shows the total too. They fill all the Unit 5 stars without recalling one fact. Then the Test shows the same pictures, so they pass that too (C1-05, C1-31).
- **The first-timer who can't read, Unit 3 CFU.** Four questions are on screen. The voice reads "What's unknown? the starting amount (how much there was at the very beginning), the change (how much was added or taken away), the result…". They tap the first one and get "Not quite — …11 − 6 = 5". They pick 5 and pass. They never saw a "some apples" picture in Explore (C1-20), and on Practice's first "had some" story they have no model.
- **The behind 2nd grader, Unit 2 → Unit 5.** In Unit 2 they learn "keep the bigger number whole". In Unit 5, on 3 + 9, the ten-frame fills 3's ten with 7 of the 9. In the Unit 5 Test review, 8 + 9 is explained by breaking apart 9. They now see two rules (C1-30). In Unit 2 Practice they never once see the smaller number written first, so on the Test's "4 + 9: which do you break apart?" they pick the second number (C1-14).
- **Anyone, Unit 3 Explore.** They slide Start to 15 and Add to 10, and the screen says "15 + 10 = 20" (C1-01).

## 6. What's working well

- **The shell is right.** The CFU gates everyone (`introSatisfied` ignores practice history), the passed CFU stays open (`cfuJustPassed`), the retry debt survives leaving the unit, there is no way around "Try one like it", the StrictMode-safe draw is in place, and the "Your path" text is in K–1 words.
- **Unit 1 is the model for the rest.** It has number-line hops after a wrong try, a spoken `showMe` with the count words, the "start at the bigger number" trap in Practice, the CFU and the Test, and both count-back buckets, including the hard one that crosses out of the teens.
- **Unit 2's BondFill CFU** (typed bond plus two sentences, per-box red/green) is exactly the fill-in design the user wants. Its Practice pictures grow step by step (empty boxes lit, then the split, then the made ten), and the Making Ten generators and Test follow the new rule.
- **Unit 3 help pictures act the story out** (start and change in two colors, the taken-away cells crossed out), and the keyword trap (a "more" story that needs subtraction) is in the CFU, Practice and Test in both directions.
- **Unit 4's compare Practice** uses lined-up rows with the extras circled when stuck, and the hard "Lily has 4 more than Ben, how many does Ben have?" case is there.
- **The pointers:** every CFU part has one. The `say` lines are short and never state an answer. The Explore defaults were moved off the CFU numbers. The mode switching (`useLookHereRequest`) is wired in Units 1, 2 and 5. The Unit 2 pointer lines use the new bigger/smaller wording.
- **No grade references** in student text (grep clean).

## 7. Rule gaps (proposed additions to `math-lab-builder.md`)

1. Under "Explore controls must do exactly what their label says", add: **"Every Explore control's range is computed from the others so every result and picture stays inside the lab's range (e.g. Add `max={20 - start}`). Never pass a clamped value (`Math.min(20, …)`) to a picture or a sentence. (MG1 Unit 3 showed '15 + 10 = 20'; Units 4–6 drew 20 dots for totals up to 30.)"**
2. Under "Use the standard model", add: **"A strategy sandbox only builds cases where the strategy applies: a make-ten Explore only allows sums past 10, a bridge-through-ten Explore only allows subtractions that cross 10. (MG1 Unit 2 allowed 6 + 2 under 'Making ten works every time.')"**
3. Under the ten-frame model, add: **"When a + b past 10 is drawn on ten-frames, the bigger number fills the first frame and the smaller number is broken apart, whatever order they are written in. This applies in every unit, Test and explanation, not only the Making Ten unit. (MG1 Unit 5 filled 3's ten with 7 of the 9, and its Test explained 8 + 9 as 8 + 2 + 7.)"**
4. Under "Every wrong choice must be false", add: **"A 'which pair/which first' choice is generated only when exactly one option is right: no pair listed twice in reversed order, and no 'easiest' answer chosen by a tie-break such as the biggest sum. (MG1 three-addends: 66% of problems had no make-ten pair, and 6% marked '7 + 3' wrong when '3 + 7' was right.)"**
5. Under "Generators stay in range", add: **"The brute-force script asserts that every number in every Test and Module Test generator, including derived ones like start = result + change, stays inside the lab's range. (MG1 Unit 3 Test reached 25.)"**

## 8. What I could not check

- **I did not open the lab in a browser this round** (no Playwright harness, no screenshots). Not checked: the iPad layout (number pad vs. buttons, CFU rows of 3 TapSelects wrapping), the pointer arrow and scroll, read-aloud timing, and dark mode. Layer 8 cells come from the code only.
- Real iPad speech (how the voice reads "☐", "−" and the long role options), real touch on the sliders, and real students.
- The English checker owns sentence-level wording. One item I noticed and left to them: the Unit 3 Test `addToChangeNumberQuestion` uses the past tense after "did" ("How many buttons did Nora found?", `AddToTakeFromWordProblemsTest.tsx:264`; that Test's CONTEXTS has no `verbAddBase`). Singular "1 stickers" can also occur in the Unit 3/4 templates.

## Counts

Blocker 1 · Major 17 · Minor 19 · Polish 2 (C1-04 is a Major marked "Needs the user's decision"; C1-16 and C1-25 also offer a user-decision option). IDs skip C1-39, which was merged into C1-18.
