# Handoff: Predictive Homework Assignment Feature

**Context for Claude:** This is a continuation of a design discussion from another machine/session. Nothing has been implemented yet — this is a pre-implementation design conversation. Paste this whole file into the chat to pick up where we left off.

## Project

React + TypeScript + Firebase app (`inventory-tracking/pel-sr-ims`) that tracks a tutoring center's paper/worksheet inventory and assigns homework packets to students. Key files (paths may differ on this machine — find via equivalent repo structure):

- `src/components/inventory_app/Action.tsx` — the "Create New Action" form (subject → level → range checkboxes → movement type → copies → student)
- `src/components/inventory_app/ActionContainer.tsx` — submission logic; builds `hwkAssigned` entries (one entry per range per copy) around line 320-330
- `src/utils/types.ts` — `HomeworkHistoryEntry` interface, `SUBSECTIONS` constant (fixed 10-page chunks: `1-10`, `11-20`, `21-30`, ... `101-110`)
- `src/utils/progressService.ts` — `parseAssignment()`, `buildHwkHistoryFromAssignments()` — existing logic that parses assignment strings like `"MG11 21-30"` into `{level, range, subject}`

## The problem

Assigning homework currently takes ~15-20 seconds of manual clicks per student: Create New Action → select Subject → select Level → check range boxes → set movement type (e.g. Front/Back ToStudent) → set copies → select student. Not terrible, but repetitive and the "what range comes next" decision feels arbitrary to the worker because nothing in the UI surfaces history.

Concrete example: Ellie Wang's `hwkHistory` shows she was given `MG11 1-20` in one visit, then `MG11 1-40` in a later visit. That second visit re-gave `1-10`/`11-20` (already-seen) and introduced `21-30`/`31-40` (new). So `21-40` hasn't been reinforced/repeated yet — a human has to mentally reconstruct that; the app doesn't show it.

## Goal

Reorder the flow to **select student first**, then subject/level, and have the app pre-fill a *predicted* assignment (ranges + movement + copies) that's just a suggestion — fully editable/deselectable, not a locked decision. Getting the guess slightly wrong is fine; it's still faster to deselect/adjust than to build from scratch.

## Decisions made so far (confirmed by the user)

1. **Use ranked suggestion chips**, not a single silent auto-check and not just a passive "last assigned" note. Multiple one-click options, e.g. "Next: 41-50" / "Repeat: 31-40", so the worker picks intent explicitly.
2. **Prefill ranges + movement type + copy count together** (not just the range checkboxes) — reuse the student's typical movement/copies pattern from history.
3. **Subject auto-selection:** if a student has only one active subject, skip the subject click entirely. If they have two active subjects (Math + English), show a suggestion chip *per subject* so picking either one prefills everything in one click, rather than manually selecting subject first.

## Proposed heuristic (not yet confirmed/built)

**Step 1 — Group `hwkHistory` into visits.** Entries are stored one-per-range-per-copy with independently-generated timestamps (`new Date()` called separately per packet in `ActionContainer.tsx`), so exact-equality grouping won't work — group by same level + timestamps within a few seconds of each other.

**Step 2 — Within the most recent visit for a level, split ranges into two buckets:**
- **Frontier** — ranges never assigned before that visit (Ellie: `21-30`, `31-40`)
- **Repeat** — ranges already assigned in an earlier visit (Ellie: `1-10`, `11-20`)

**Step 3 — Generate three ranked chips:**
1. **Advance** — the next chunk(s) after the current max range, sized to mirror the frontier size from the last visit (last visit introduced 2 new chunks → suggest 2 more: `41-50`, `51-60`). This mirrors the student's actual pace instead of a fixed guess.
2. **Reinforce latest** — re-select exactly last visit's frontier (`21-30`, `31-40`) — the "hasn't been given a 2nd time yet" case.
3. **Repeat last visit exactly** — reissue the full last batch (`1-10`, `11-20`, `21-30`, `31-40`) with the same movement/copies.

Movement type + copy count for each chip are copied from whichever visit that chip is based on.

## Open question (unresolved — pick up here)

Which order should the three chips appear in? Proposed default was Advance → Reinforce → Repeat (optimizing for the common case of "just keep moving forward"), but the user pushed back wondering if **Reinforce** should rank first since unreinforced frontier material might feel more urgent/pedagogically important than moving on. This wasn't resolved — worth exploring further, possibly alongside the user's existing note-to-self about "retention/pacing/scaffolding-fade gaps" in their math-lab-builder engine-level pedagogy work, since it's a related question (when is a student actually ready to advance vs. needs reinforcement?).

## Not yet discussed / worth raising

- No implementation has started — this whole file is design-phase only.
- Need to decide whether to persist which chip the worker actually picked (to refine/learn ordering over time) or keep it stateless for v1.
- Edge case: brand-new student/level with no history — chips should just not render; current blank-dropdown behavior stays as-is.
