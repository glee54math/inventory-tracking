# MG1 Addition & Subtraction Within 20: curriculum review, round 3 (final re-review)

- **Lab:** MG1 `AdditionAndSubtractionWithin20Lab` (6 units, 6 unit Tests, Module Test)
- **Round:** 3 (last round) · **Date:** 2026-11-17
- **Grade band assessed:** K–1 (K/1st first-timers and behind 2nd graders, alone on an iPad, audio-first)
- **Inputs:** `round-2-merged.md` (User decisions final), `round-2-fixes.md`, `round-2-curriculum.md`, round-1 files for history, and the code: shared `KCheck.tsx`, `engine/types.ts`, `engine/retryDebt.ts`, `styles/lab-base.css`, the MG1 shell, and every changed unit/Test file.
- **How I checked:** I read every changed part of the code and the shared-code diff, traced the twin and `optional` logic by hand, and looked at the fixer's iPad-size screenshots (`C:\Users\GABRIE~1\AppData\Local\Temp\claude\9e6f54297e792395\4a0a5ada-0427-4375-a535-7a7815b05751\scratchpad\r2fix\shots\`). I did not run a new browser pass; no harness was made.
- **Standing rules checked:** pointer after a part's 2nd miss, which stays until the answer is right; show-it on the 3rd miss; no answer on the 1st miss; Making Ten always breaks apart the smaller number; at least 40% typed in each unit's CFU.

---

## 0. Status of round 2's Fix rows

| ID(s) | Status | Note |
|---|---|---|
| C2-01 | **Fixed** | No two-button picks are left without a twin. U1 Q3 and U2 Q1 are typed. U4's old Q2 is gone, and Q2/Q3 are typed splits of 6. U6 Q1 has 3 picture choices. U6 Q2 is now false, and Q2 and Q4 bring a twin after a wrong tap. Twin logic (`KCheck.tsx` PickCheck): 1st wrong tap → twin, with both buttons live; a wrong twin tap → 2nd miss → "Look here!"; another → 3rd miss → show-it. **MK1–MK4 are unaffected.** The twin path needs both `twin` and `look`. With neither, the DOM keys, ring key, autoplay key, disabling and the 2nd-miss show-it are the same as before. MK1 has its own local KCheck. MG2 passes `look` but never `twin`, so it is also unchanged. Small follow-ups: C3-04 (the Q2 twin's answer) and C3-01 (3-button picks). |
| E2-33 | Fixed (spot-checked) | Singular helpers are in place ("Count back 1 time", "Add it back"). |
| E2-36 | Fixed | `missingLine` follows the order of the operation, and Q3 and Q6 have separate spots. (New side effect: see C3-02.) |
| C2-03a | Fixed | "To take away 5, count back 5 times." No CFU answer is 5 in U1. |
| C2-03b | Fixed (different numbers) | Defaults are 6 + 3 = 5 + 4. Total 9, "Find it" reveals 4, and Flip shows 6 + 3 = 9. None of these is a CFU answer (2, 3, 11). The fixer was right to turn down 5 + 6 = 7 + 4. |
| C2-02 | Fixed | `Given` colors numbers by role, using the StoryStrip colors (Q1 start/change, Q4 start/end, Q5 change/end). |
| C2-04 | Fixed | `takeFromMissingRoleChoiceQuestion`: end-missing or change-missing, 50/50. |
| C2-05 | Fixed | Break-apart pick: the smaller number comes first in 50% of draws. Same-total pick: k = ±1..±3, so the answer is sometimes the biggest choice and sometimes the smallest. |
| C2-06 + E2-40 | Fixed | Think-addition is used only on facts that cross 10 (`sub > start % 10`), so the answer is ≤ 9. The help picture shows the subtracted number's frame with its empty boxes lit, plus the ones past 10, with no numeral. Show me counts at most 9 numbers. |
| C2-07 | Fixed | `.choice:hover` is inside `@media (hover: hover)`. Touch iPads no longer show a sticky "chosen" look, and mouse users still see the hover. MG11 has its own `.choice:hover` rule, outside this lab (open item). |
| C2-08 | Fixed | The 2nd "how many times" pick is now a typed "Count back {n} from {start}. Say the numbers." with one box per number. The count always goes below 10. |
| E2-34, E2-37, E2-39, E2-41, E2-44, E2-48, E2-43, E2-45, E2-46, E2-47, E2-49, E2-50 | Fixed (spot-checked where I read the code) | Wording is the English checker's area. |
| E2-35 | Moot | Its question was removed. |
| C1-26 (user decision 1) | **Fixed** | The "Challenge: fewer stories" type follows the user's order: "Ella has 3 fewer pencils than Noah. Ella has 9. How many pencils does Noah have?" It is `optional: true`, and shared `bagItems` leaves it out of Mixed. Its bucket is not in `requiredBuckets`, and hand-picked types never give clean credit (`clean && typeIdx === "mix"`), so it **gives no stars and doesn't count toward mastery**. It isn't imported by the Unit Test or the Module Test (grep). **Other labs are unaffected:** no other lab sets `optional`. MG10 and MG2 use `bagItems`, but without the flag the filter changes nothing. Older shells (MG3–MG8, MG11) don't use `bagItems`. Small follow-ups: C3-06, C3-07. |

**Totals: 25 Fixed · 0 Not fixed · 0 Fixed, but caused a new problem that needs a fix this round. E2-35 is moot, and E2-38 was skipped by the user.** (C3-02 comes from the E2-36 rewrite. It is Minor.)

**Making Ten rule:** still holds everywhere I checked: U2 CFU, Explore, Practice and Test; the U5 Test's `makeTenSpeedNumberQuestion`; and the Key Idea. The bigger number is always kept whole and the smaller one is broken apart. There is no "split the other addend" wording.

**≥40% typed per CFU unit:** U1 4/5, U2 6/6, U3 3/6, U4 5/6, U5 3/4, U6 3/6. All pass (24/33 overall).

---

## 1. Verdict

**Ready for students.** Every round-2 fix is in and works. The twin and `optional` additions are safe for the other labs, and no Blocker or Major is left. What remains is 3 Minor and 4 Polish items. The most useful one, C3-01, is a design choice for the user: on 3-button picks the "Look here" pointer only appears once one button is left.

## 2. Top changes (ranked; all are open items, since this is the last round)

1. **C3-01 (Minor, needs the user's decision):** On 3-button CFU picks, keep tried buttons tappable until show-it (the rule the twin already uses). Then the 2nd-miss pointer means something and the 3rd-miss show-it can happen.
2. **C3-02 (Minor):** In U3 Explore, change the default numbers. Q3's own "Look here" line says "Start at 5", and 5 is Q3's answer.
3. **C3-03 (Minor):** In the U6 CFU equation pictures, the last number wraps to a second line on iPad, so "6 = 2 + 3" looks like "6 and 3 / 2".
4. **C3-04 (Polish):** Make U6 Q2's twin false too, so a student who always taps "Yes" can't pass both Yes/No questions.
5. **C3-05 (Polish):** U1 CFU Q1 and Q3 use the same numbers and the same answer (8).

## 3. Scorecard (changed parts)

Layers: 1 Standards · 2 Audience · 3 Learning arc · 4 Getting unstuck · 5 Pictures · 6 Math · 7 Mastery · 8 Device

| Unit | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 |
|---|---|---|---|---|---|---|---|---|
| 1 Counting On/Back | Strong | Strong | Strong | OK: Q5 is a 3-button pick (C3-01) | Strong | Strong | OK: Q1/Q3 same answer | OK |
| 2 Making Ten | Strong | Strong | Strong | Strong | Strong | Strong | Strong | OK |
| 3 Add To/Take From | Strong | Strong | OK: pointer line prints Q3's answer | OK: Q1/Q4/Q5 3-button | Strong | Strong | Strong | OK |
| 4 Put Together/Compare | Strong | OK: Q2 is 5 short sentences (heard) | Strong | OK: Q6 3-button | Strong | Strong | Strong | OK |
| 5 Fast Facts | Strong | Strong | Strong | OK: Q1 3-button | Strong | Strong | Strong | OK |
| 6 Equal Sign | Strong | Strong | Strong | OK: Q1 3-button | Weak: equation pictures wrap on iPad | Strong | OK: always-"Yes" passes Q2/Q4 with 1 miss | OK |

## 4. All findings

### Lab-wide (CFU, shared KCheck)

**C3-01 · Minor · Layer 4 · On 3-button picks, "Look here!" appears only when the answer is the last button left, and show-it never happens.** (Raised by the fixer; my judgement follows.)
- *Who it hurts:* the guesser (gets the answer by elimination on the 2nd miss) and the first-timer (never sees the 3rd-miss worked picture and voice, which is the teaching moment).
- *Where:* U1 Q5, U3 Q1/Q4/Q5, U4 Q6, U5 Q1, U6 Q1.
- *Evidence:* `KCheck.tsx` PickCheck: `lockTried = !onTwin || showing`, so outside twin mode every tried wrong button is disabled. With 3 options, the 2nd miss leaves one live button, the right one, at the moment the pointer appears. `showAfter(look) = 3` can't be reached. Screenshot `u6-q1-lookhere.png`.
- *Judgement:* the "no answer on the 1st miss" rule is **not** broken: after one miss, two buttons are still live. The 2nd-miss pointer rule is followed in form, but it has no purpose: the student can tap the last button without looking. The 3rd-miss show-it rule can't be reached. This is about as much help as MK1–MK4's show-it on the 2nd miss, so it isn't a learning blocker. Practice still teaches each of these ideas.
- *Fix (needs the user's decision, because the shared change also touches MG2):* when `look` is passed, keep tried buttons tappable (dimmed with the `tried` style, but not `disabled`) until show-it. That is, `lockTried = !look || showing` in place of `!onTwin || showing`. MK1–MK4 pass no `look`, so they stay unchanged. MG2's `look` picks would get the same behavior, which is also better there. Other option: leave it as is and accept that 3-button picks give the answer on the 2nd miss.

### Unit 1: Counting On and Counting Back

**C3-05 · Polish · Layer 7 · CFU Q1 and Q3 use the same numbers, and both answers are 8.**
- *Evidence:* `CountingOnAndBack.tsx:64` "8 + 3. Count on. Where do you start?" (8) and `:95` "3 + 8. Type the number you start at." (8). A student who just typed 8 can type 8 again without thinking about "bigger". (A student who starts at the first number is still caught, so the trap works.)
- *Fix:* change Q3 to "3 + 7. Type the number you start at." (answer 7), with show "Watch: start at 7. Count on 3: 8, 9, 10." and praise "Yes! Start at 7. It is bigger." The Explore "bigger" line uses 2 + 9, so 7 is never printed at Q3's pointer.

### Unit 3: Add To and Take From

**C3-02 · Minor · Layer 3 · Q3's own "Look here" line prints Q3's answer.**
- *Evidence:* Explore defaults are start 5 and change 3 (`AddToTakeFromWordProblems.tsx:178–179`). The Q3 pointer (`atf-missing-change`) switches to Add To with the change missing, and the line reads "Change missing? Start at 5. Count on to 8." (the fixer's own browser log confirms it). Q3 is "Sam had 6 apples… Now he has 11. How many did he pick?", and its answer is **5**. A student on the 2nd miss sees a big "5" in the lit spot. (This came from the E2-36 rewrite, which now prints the start number.)
- *Fix:* defaults start 3 and change 6 (end 9). The lines become "Start at 3. Count on to 9." and "Start at 9. Take away 6." No U3 CFU answer is 3, 6 or 9 (answers: end, 11, 5, change, start, 7). Update the "Not the CFU's numbers" comment.

### Unit 4: Put Together and Compare Stories

**Fixer's flag: Q2 is five short sentences.** *Judgement: not a learning finding.* It is read aloud, the picture shows the 6, and "Some are… Some are…" sets up Q3's "Now 5 are sports cards" (Q2 stays on screen above Q3). Shortening it is the English checker's call. For example, "Jake has 6 cards. 2 are sports cards. The rest are animal cards. How many are animal cards?" would keep the learning.

**C3-06 · Polish · Layer 4 · The challenge's step-1 hint doesn't address the trap.**
- *Evidence:* `fewerAddChallenge` uses `sentenceChoice`, whose hint is the generic "Do you put together or take away?". For a "fewer → add" story, that doesn't help the student who heard "fewer" and picked "−". (The good part: a wrong pick does switch the picture to the lined-up rows with the extras circled.)
- *Fix:* give the challenge its own step-1 hint: "{B} has fewer. So {A} has more. Will {A}'s number be bigger?"

**C3-07 · Polish · Layer 4/8 · Needs the user's decision · One wrong tap in the challenge locks a student into the challenge type.**
- *Evidence:* `MG1_AdditionAndSubtractionWithin20Lab.tsx` `handleHelped` → `owesRetry`. The type switch stays locked until the student solves one alone (the agreed retry rule). A K student who taps "Challenge: fewer stories" out of curiosity and misses must solve a challenge alone before going back to Mixed.
- *Options:* (a) leave it, since the retry rule is the same for every type and Show me teaches it; (b) for an `optional` type, let "Mixed" clear the retry debt.

### Unit 6: Equal Sign and Number Sentences

**C3-03 · Minor · Layer 5/8 · The CFU equation pictures wrap on iPad portrait, so the last number drops under the first.**
- *Evidence:* screenshots `u6-q2-ask.png` and `u6-q2-twin.png`. "6 = 2 +" sits on one line and "3" on the next line, directly under the 6. On a question about whether the two sides match, the 3 looks like part of the left side. `Num` is a fixed 168 px. Three of them plus two signs (about 590 px) don't fit in the CFU picture box. Q3 ("7 + 1 = 6") uses the same 5-part `Row` and will wrap the same way. This isn't new in round 2, but it wasn't caught before.
- *Fix:* in the CFU `Row`, use a narrower `Num` (about 112 px, ten-frame scaled) and `flexWrap: "nowrap"`. Or give `Num` a `small` prop for 5-part rows. Check Q2, the twin and Q3 at 820 px.

**C3-04 · Polish · Layer 7 · U6 Q2's twin is true, so a student who always taps "Yes" passes both Yes/No questions with one miss.**
- *Evidence:* Q2 "6 = 2 + 3" (No). Its only wrong tap is "Yes", and the twin "7 = 4 + 3" is Yes, so tapping "Yes" again is right. Q4 "8 = 8" is Yes. The twin also checks a different decision from the one just missed (a true sentence with the total first, not "add each side, they differ"). Related: when the twin appears, the voice also reads the number "2." before the twin prompt (fixer note).
- *Fix:* twin "7 = 4 + 2. Is it true?" (No), with show "Watch: 4 and 2 make 6. 6 is not 7." and praise "Yes! 4 + 2 is 6, not 7." Then point Q2 at `LOOK.scale` ("Look here. Add up each side."), since that is the spot that teaches a false sentence. If possible, leave the "2." out of the twin read-aloud.

## 5. Persona walkthrough highlights

- **The guesser, U6 Q1 "Which one is true?"** Taps 6 = 9 ("Count both sides. Are they the same?"), then 6 = 3. "Look here!" appears, but only "6 = 6" is still lit, so they tap it: "Yes! = means the same as." The pointer was never needed (C3-01).
- **The first-timer, U3 Q3 "How many did he pick?"** Types 11, then 6. "Look here!" lights "Change missing? Start at 5. Count on to 8." They type 5. It's right, but they copied it rather than counting on from 6 (C3-02).
- **The behind 2nd grader, U6 Q2 "6 = 2 + 3. Is it true?"** Taps "Yes". Hears "Add up each side. Are they the same?" Then the twin "7 = 4 + 3" comes, both buttons are live, and the picture rings. They count 4 and 3, get 7, tap "Yes", and are right. This is the twin working as intended: a real second try on a fresh question, not elimination.

## 6. What's working well

- The twin mechanism is a clean, additive fix. Two-button checks now get a real second try, then the pointer, then show-it, and the older labs are untouched.
- The `optional` flag is small and contained. The challenge gives the user's "fewer → add" story a home without touching stars, mastery or Tests.
- Every round-2 Test pattern (always "the change", always the first number, always the smallest choice) is now varied.
- Think-addition is now used only where it is the efficient strategy, with a picture that shows both parts.
- Sticky hover on iPad is fixed for every lab-base lab.

## 7. Rule gaps (proposed for `math-lab-builder.md`; don't edit now)

1. "K–1 CFU picks with a `look` pointer: the 2nd-miss pointer must appear while at least two buttons are still live, so the student has to look. Use a twin for two-button picks. For three-button picks, keep tried buttons tappable until show-it." (C3-01)
2. "A twin question keeps the same answer as the question it replaces (false → false), so a student who repeats the rejected tap doesn't pass." (C3-04)
3. Extend round 2's rule 3: "This includes any number a Look-here request **switches the spot to** (a mode or 'missing' line), not only the numbers shown at load." (C3-02)
4. "Equation pictures in a CFU or Practice must fit on one line at 820 px. Size the frames for the number of parts." (C3-03)
5. Document `PickCheck` `twin` and `ProblemType.optional` in the builder (fixer's proposal, agreed).

## 8. What I could not check

- I did no new browser pass. For the changed screens I relied on code reading and the fixer's screenshots. C3-03's wrap of U6 Q3 is inferred from its identical layout.
- A real iPad (iOS speech timing, touch hover, the headless-renderer crashes the fixer saw).
- Real students.

## Open items at the end of review (final round)

| ID | Sev | Item | Owner |
|---|---|---|---|
| C3-01 | Minor | 3-button picks: pointer comes with only the answer left; show-it can't be reached | User decision (shared KCheck; also affects MG2) |
| C3-02 | Minor | U3 Explore default start 5 = Q3's answer at Q3's pointer | Fixer (one-line default change) |
| C3-03 | Minor | U6 CFU equation pictures wrap on iPad | Fixer |
| C3-04 | Polish | U6 Q2 twin true → always-"Yes" passes; "2." read before the twin | Fixer |
| C3-05 | Polish | U1 Q1/Q3 same numbers and answer | Fixer |
| C3-06 | Polish | Challenge step-1 hint is generic | Fixer |
| C3-07 | Polish | A miss in the challenge locks the type switch | User decision |
| (carried) | — | MG11 Geometry's own sticky `.choice:hover`; U3/U4 title styles differ; E2-38 "blank" (user: leave it) | Outside this lab / user |
