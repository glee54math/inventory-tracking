---
name: build-math-lab
description: Turn one or more CA CCSS math standards into a fully-built, reviewed practice lab (Explore, Check for Understanding, Practice, per-unit Test, cumulative Module Test) in pel-sr-ims. Plans with the user, has math-lab-builder build it, then runs review rounds (math-lab-curriculum-design-checker + math-lab-english-checker in parallel, merged into one fix list, applied by math-lab-fixer) until no Blocker or Major findings remain. Also use to review and fix an EXISTING lab ("review MK2"), starting at the review rounds.
---

You run the whole process for a math-levels lab. You do the planning, the
merging and the decisions yourself, in the conversation. Building, reviewing
and fixing are done by four subagents:

| Agent | Does | File |
|---|---|---|
| `math-lab-builder` | builds the lab from the approved plan | `.claude/agents/math-lab-builder.md` |
| `math-lab-curriculum-design-checker` | reviews learning: standards, arc, help, pictures, mastery | `.claude/agents/math-lab-curriculum-design-checker.md` |
| `math-lab-english-checker` | reviews every word against the grade's English guidelines | `.claude/agents/math-lab-english-checker.md` |
| `math-lab-fixer` | applies the merged fix list | `.claude/agents/math-lab-fixer.md` |

Don't build, review or fix lab code yourself in this skill; that detail
lives in the agent files. Read them if you need it, but don't duplicate them.

```
Stage 0  Plan                      you + user (user approves)
Stage 1  Build                     math-lab-builder
Stage 2  Relay build report        you
Stage 3  Review round N            curriculum checker ∥ English checker
Stage 4  Merge into one fix list   you (+ user, only for "Ask user" items)
Stage 5  Fix                       math-lab-fixer
         → back to Stage 3 for round N+1, until the stopping rule
Stage 6  Wrap up                   you (+ user approves rule changes)
```

**Reports.** Everything for one lab goes in
`src/pages/math-levels/_planning/reviews/{Level}_{LabName}/`, one file per
step per round, never overwritten:
`round-1-curriculum.md`, `round-1-english.md`, `round-1-merged.md`,
`round-1-fixes.md`, `round-2-curriculum.md`, … and `summary.md` at the end.

**Starting point.**
- New lab, or new units for an existing lab, from standards → Stage 0.
- Review an existing lab ("review MK2", "run the checkers on MG5") →
  skip to Stage 3, round 1 (or the next round number if that lab's review
  folder already has rounds). Use the lab's written plan at
  `src/pages/math-levels/_planning/Grade-{K..8}/{LabName}/plan.md` if it
  exists; otherwise work out the plan, grade and file paths from the code
  and say what you assumed.

**Standards text.** `src/pages/math-levels/_planning/CCSS_K8_STANDARDS_REFERENCE.md`
has the CA CCSS K–8 standards transcribed. Use it in Stage 0 and pass its
path to the checkers.

## Stage 0 — standard(s) → plan (you, inline, in conversation)

1. If the user hasn't already given you the standard code(s) and text, ask
   for them. If they've only given a code (e.g. "6.NS.5"), look it up in
   `CCSS_K8_STANDARDS_REFERENCE.md` and check `_planning/Grade-*/` for an
   existing `plan.md`. Where the reference condenses a sub-part, ask them
   to paste the official text —
   standards have sub-parts that matter for bucket design and are easy to
   get subtly wrong from memory alone.
2. Determine placement: is this a new lab (new grade-level slot, e.g. an
   unused `MG10`/`MM2`) or new units added to an existing lab? This is a
   genuine curriculum-sequencing judgment call — ask the user rather than
   guessing, the same way lab placement got corrected more than once in
   past sessions (MG9 vs MG10, MG10 vs MM1).
3. Propose a unit breakdown: for each unit, a title, a one-sentence goal, the
   specific standard/sub-part it covers, and a bucket list (the distinct
   scenario-classes Practice needs to hit so mastery can't be earned by
   luck on the easy cases alone). Reference how the standard's own sub-parts
   map to buckets, the way 6.NS.6's (a)/(b)/(c) sub-parts mapped to opposites
   / number-line position / reflections-and-quadrants across two units last
   time. Also flag, per unit: whether it has one load-bearing prerequisite
   idea that should gate Practice (default yes — the builder's standard
   Check-for-Understanding convention), and whether any of its content is a
   fact meant to be memorized long-term rather than re-derived each time
   (a candidate for periodic re-checking, not just one-time proof). If this
   plan adds units to an EXISTING lab rather than a new one, flag that
   explicitly too — the builder must grandfather students who already have
   practice history predating any new gate.
4. State the target audience framing and the **grade** explicitly in the
   plan. Default: the lab's intended grade audience, pitched at its youngest
   first-time student (e.g. MK1–MK4 and MG1 = Kindergarten/1st graders seeing
   it for the first time plus 2nd graders who are behind, working alone on an
   iPad, mostly non-readers, so audio-first). If the intended audience for
   this lab isn't clear from its slot, ask the user. The grade picks the
   English guidelines file (`.claude/reference/english-for-math/grade-*.md`)
   that the builder writes to and the English checker checks against. Also
   check the plan's word-problem types against that file (e.g. "times as
   many" is 4th grade; a start-unknown story in 1st grade is allowed but
   shouldn't be required for mastery) and flag any mismatch to the user.
5. Present the full plan as a concise written summary and ask the user to
   confirm or edit it. This is open-ended curriculum judgment, not a
   short pick-one choice — have a real back-and-forth here if they want
   changes, rather than forcing it into a multiple-choice shape. Do not
   proceed to Stage 1 without an explicit go-ahead.

## Stage 1 — build

1. Compose a self-contained prompt for `math-lab-builder` containing the
   full approved plan: lab name and file-path slot, the grade, and for every
   unit its title/goal/standard/buckets/audience framing. Tell it to read the
   grade's English guidelines file before writing any student text. Make it
   complete enough that the subagent needs nothing else from this
   conversation — it starts with no memory of this exchange.
2. Launch it via the Agent tool with `subagent_type: "math-lab-builder"`,
   `run_in_background: true`.
3. Tell the user briefly that the build is running and that review rounds
   follow automatically. Don't make up progress updates in the meantime.

## Stage 2 — relay the build report

When the builder finishes:

1. If it reported a **blocker** instead of a finished build, relay the
   blocker, get the user's decision, and continue the same builder agent
   (SendMessage, so it keeps its context). Don't start reviews on a
   partial build.
2. If its Verification failed (type check, lint, build, browser checks),
   send it back to fix that first (SendMessage). Reviews start only on a
   lab that builds and runs.
3. Save its full report as `{review folder}/round-0-build.md`.
4. Give the user a short summary: what was built per unit, the exact CFU
   questions (the user wants to see these), and any decisions the builder
   made beyond the plan. Then go straight to Stage 3 — the user reviews at
   the end, not between rounds.

## Stage 3 — review round N

1. Launch **both** checkers in the same message (so they run at the same
   time), each with `run_in_background: true`:
   - `subagent_type: "math-lab-curriculum-design-checker"`
   - `subagent_type: "math-lab-english-checker"`
   Give each one, self-contained: the approved plan (or what you inferred),
   the grade, the lab's file paths (shell + lab folder), the round number N,
   the review folder path, and the path to `round-0-build.md` if there is
   one. For **round 2 and later**, also give the paths to
   `round-{N-1}-merged.md` and `round-{N-1}-fixes.md` and say "re-review
   mode."
2. Don't give either checker the other's report. They must stay independent.
3. Wait for both to finish. Each writes its own report file and returns a
   short summary.

## Stage 4 — merge into one fix list (you)

Read both round-N reports in full and write `round-{N}-merged.md`:

1. **Combine and remove duplicates.** Two findings about the same screen or
   line become one item that keeps both IDs (e.g. `C1-03 + E1-07`).
2. **Resolve conflicts** so the fixer gets one answer. When the checkers
   pull different ways (a fuller hint vs. a shorter sentence), write a
   single change that satisfies both: the curriculum checker decides *what*
   the student must be shown or told, and the English checker decides *how
   it's worded*. If no single change satisfies both, it's an **Ask user**
   item.
3. **Decide each item:**
   - **Fix:** every Blocker, Major and Minor with a concrete, agreed change,
     and Polish items that are small and safe.
   - **Skip:** with a one-line reason (e.g. a false positive, not worth the
     risk, already planned elsewhere).
   - **Ask user:** anything that changes the approved plan (units, buckets,
     standards' scope), removes content, overrides something the user
     decided before, or that a checker marked "Needs the user's decision."
   - An item that was **Fix** last round and is still **Not fixed** this
     round becomes **Ask user**. Two failed attempts mean it needs a
     decision, not a third try.
4. **Ask the user** the Ask user items, together, in plain language with
   your recommendation for each (AskUserQuestion, up to 4 per question
   round). Record each answer in the merged file as Fix (with the chosen
   change) or Skip.
5. **List the proposed rule and guideline changes** from both reports
   separately at the end of the file. These aren't fixes; they wait for
   Stage 6.

The merged file's format: a short header (lab, round, date, counts), then
one table — ID(s) · severity · where (file:line) · the problem · decision ·
the agreed change — sorted Blocker → Polish.

## Stage 5 — fix

1. If the merged list has no **Fix** items, skip to the stopping rule.
2. Launch `subagent_type: "math-lab-fixer"`, `run_in_background: true`,
   with: the path to `round-{N}-merged.md`, the paths to both round-N
   reports, the lab's file paths, the approved plan, the grade, round N and
   the review folder. It writes `round-{N}-fixes.md`.
3. If it returns **Needs decision** items, ask the user and send the
   answers back to the same fixer (SendMessage).
4. If its verification failed, send it back to fix that (SendMessage)
   before the next review round.

### Stopping rule (after each round's fixes)

- Run another round (back to Stage 3, round N+1) if round N had any
  **Blocker or Major** item that was fixed or is still open.
- Stop if round N's two reports had **no Blocker or Major** findings.
- Stop after **3 rounds** no matter what, and report what's still open.
- Before each new round, give the user one line of progress (e.g. "Round 1:
  4 Major and 11 Minor found, all fixed. Starting round 2 to check the
  fixes.").

## Stage 6 — wrap up

1. **Rule changes.** Collect every proposed builder rule (from the
   curriculum reports) and guideline addition (from the English reports)
   across all rounds. Give extra weight to ones that showed up in more than
   one round or more than one lab. Show the user the list with your
   recommendation; add only the ones they approve, to
   `.claude/agents/math-lab-builder.md` or the matching file in
   `.claude/reference/english-for-math/`.
2. **Summary.** Write `{review folder}/summary.md` and give the user a short
   version: rounds run, what was found and fixed per round, what was
   skipped and why, anything still open, and the review folder path.
3. Close with: a manual pass in the running app is still needed, then a
   real student on a real iPad. Headless checks can't confirm iOS Safari
   speech, real touch feel, or how a young student actually uses it.
4. Don't commit. Offer to commit only if the user asks.

## Cost

A normal run is 1 builder + 2 checkers per round + 1 fixer per round: about
6–9 agent runs for a lab that takes 1–2 fix rounds. A review of an existing
lab skips the builder.
