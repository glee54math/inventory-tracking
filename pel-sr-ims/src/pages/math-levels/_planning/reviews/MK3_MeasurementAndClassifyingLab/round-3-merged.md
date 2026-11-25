# MK3 Measurement & Classifying: Round 3 merged fix list (final round)

- **Lab:** MK3 `MeasurementAndClassifyingLab`, 3 units + Module Test
- **Round:** 3, re-review, final under the 3-round limit · **Date:** 2026-11-21 · **Grade band:** K–1, audio-first, alone on an iPad
- **Inputs:** `round-3-curriculum.md` (5 findings), `round-3-english.md` (9 findings + 1 note for the curriculum checker). Every ID from both reports appears below.
- **Merged items:** 13 = 0 Blocker, 2 Major, 6 Minor, 5 Polish
- **Decisions:** 11 Fix, 2 Skip, 0 still waiting on the user

The full evidence is in the two reports under each ID. Where this file and a report differ, **this file wins**. D1–D10 (`round-1-merged.md`) and D11–D12 (`round-2-merged.md`) still apply.

## User decision (2026-11-21)

| # | IDs | Decision |
|---|---|---|
| D13 | C3-50 | **Accept and log it.** A wrong tap followed by the same spot still passes a two-button CFU question. Do not change twin answers or button order. The typed CFU questions, Practice and Tests carry the mastery check. |

## Conflict resolutions

- **Mixed-set wrap-up (C3-53, E3-63):** the curriculum checker wants the child's action named; the English checker wants it to be true that the app did the sorting. Use: "We sorted by shape. You counted."
- **First-wrong-tap reasons (E3-65 + the English note on U1 Q1):** each reason must be a statement, fit both the question and its twin, and not nearly hand over the twin's answer. U1 Q1's current "Light goes up." followed by "Now this side went up." does that, so it changes too.

## Fix list

Scope: edit only `MK3/` and this lab's `vocabulary.md`, if a change affects it. Keep these edits small: no review round follows them.

| ID(s) | Severity | Where | Problem | Decision | Agreed change |
|---|---|---|---|---|---|
| C3-50 | Major | 9 two-button CFU picks | Same-spot retry passes | **Skip** (D13) | Logged as open. No change |
| C3-51 + E3-61 | Major | U1 Explore `:180`, `:165` | Q2's Look here shows only the small one winning | Fix | On `u1-big`, open the elephant and mouse example. Keep "Look here. See which one goes down." Keep `u1-down` on example 0 |
| C3-52 | Minor | U3 `:347`, U3 Test `:124–126` | Shape word has no picture | Fix | Draw the asked shape beside the word in a neutral color, e.g. `ShapeMark`. Must not show the count |
| C3-53 + E3-63 | Minor | U3 `:453` | Wrap-up describes the wrong action | Fix | "We sorted by shape. You counted." |
| E3-62 | Minor | `labParts.tsx:244`; U3 `:339, :350`; U3 Test `:126, :140` | "The triangles have 1." | Fix | For shape count lines: "1 triangle." / "3 triangles." Keep color lines and "The circles have the fewest." |
| E3-64 | Minor | U1 `:443` | "A rod shows how long" after "short" | Fix | `explain: WORD_LINES[w]` |
| E3-65 | Minor | U1 CFU `:31, :32`; U2 CFU `:76, :85`; U3 CFU `:143, :152` | Reason ends in a question | Fix | U1 Q2 "Heavy is hard to lift." · U1 Q5 "Look at the scale. The heavy side goes down." · U2 Q1 "The longer one goes past." · U3 Q4 "Match them up." |
| E3 note (U1 Q1) | Minor | U1 CFU Q1 reason | Reason nearly gives the twin's answer | Fix | "Look at the scale. See which way it went." |
| C3-54 | Polish | `labParts.tsx:159–164` | Retry kind can change after a reload | **Skip** | The retry lock still holds and the bucket is unchanged. Changing stored retry data isn't worth the risk with no review after it |
| E3-66 | Polish | U2 CFU `:116, :125` | "new place" | Fix | "They start in different places. Count the blocks." |
| E3-67 | Polish | U1 `:368` | "Did it go up?" | Fix | "See the arrow. This side went down." / "See the arrow. This side went up." |
| E3-68 | Polish | U1 Explore `:176, :249` | "This is a rod." may never play | Fix | Start with `revealedWord` set to `"long"`. Must not show a CFU answer or disturb Look here spots |
| E3-69 | Polish | Shell `:88, :101, :265` | Headings have no voice | Fix | Wrap each in `ReadAloud` |

## Open after this round

- **C3-50 (D13):** tapping the same spot after a miss passes all 9 two-button CFU picks.
- CFU questions still do not auto-read and the question number is still spoken (D7).
- Real iPad checks: speech including "Rod A", finger dragging, and whether 🪵 🪨 🪶 draw. The rock showed as an empty box in the Windows 10 test browser.
- Shared items skipped: C1-09 (sound banner over the number pad), C1-11. C3-54 skipped.

## Proposed rule and guideline changes (wait for Stage 6; do not apply)

Rounds 1 and 2 lists still stand, except that the rule below **replaces round 2's rule 11**.

**Builder (`math-lab-builder.md`):**
18. On a two-button `PickCheck`, neither repeating the rejected tap nor tapping the other spot should always pass the twin. Vary the twin's button order or answer, and test both routes and a double-tap.
19. A Look here spot for a twin must teach toward the twin's idea. If the first question and twin go opposite ways, the spot must not show only the first direction.

**English guidelines:**
20. `checklist.md` §3 Voice: a first-wrong-tap reason plays right before the twin's question, so write it as a statement.
21. `checklist.md` §3 Generated plurals: a group name with a count needs a singular form ("1 triangle").
