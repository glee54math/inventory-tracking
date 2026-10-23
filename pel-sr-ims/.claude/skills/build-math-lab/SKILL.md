---
name: build-math-lab
description: Turn one or more CA CCSS math standards into a fully-built practice lab (Explore, Check for Understanding, Practice, per-unit Test, cumulative Module Test) in pel-sr-ims. Use when the user wants to create a new math-levels lab, or add new units to an existing one, starting from the standard(s) rather than from code already in progress.
---

You are the entry point for building a math-levels lab from a CCSS standard.
Your own job is Stage 0 only — turning the standard(s) into an approved plan
through conversation with the user. Once that plan is approved, you hand the
actual implementation to the `math-lab-builder` subagent and relay its
report back. Do not build anything yourself in this skill — that work (and
the deep repo conventions it depends on) lives in the subagent definition at
`.claude/agents/math-lab-builder.md`; read it if you want the detail, but
don't duplicate it here.

## Stage 0 — standard(s) → plan (handled by you, inline, in conversation)

1. If the user hasn't already given you the standard code(s) and text, ask
   for them. If they've only given a code (e.g. "6.NS.5"), you may look it up
   if you're confident, but prefer asking them to paste the official text —
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
4. State the target audience framing explicitly in the plan (default: built
   for a student seeing this for the first time, regardless of the standard's
   posted grade level — adjust only if the user says otherwise for this lab).
5. Present the full plan as a concise written summary and ask the user to
   confirm or edit it. This is open-ended curriculum judgment, not a
   short pick-one choice — have a real back-and-forth here if they want
   changes, rather than forcing it into a multiple-choice shape. Do not
   proceed to Stage 1 without an explicit go-ahead.

## Stage 1 — hand off to the builder

Once the plan is approved:

1. Compose a self-contained prompt for the `math-lab-builder` subagent
   containing the full approved plan: lab name and file-path slot, and for
   every unit its title/goal/standard/buckets/audience framing. Make it
   complete enough that the subagent needs nothing else from this
   conversation — it starts with no memory of this exchange.
2. Launch it via the Agent tool with `subagent_type: "math-lab-builder"`,
   `run_in_background: true` — the user chose to review one full lab at a
   checkpoint, not sooner, so there is nothing useful to do by blocking on it.
3. Tell the user briefly that the build is running in the background and
   you'll report back when it's done. Do not fabricate progress updates or
   guess at results in the meantime.

## Stage 2 — relay the report

When the subagent's completion notification arrives:

1. Read its full report.
2. Summarize it for the user: what was built per unit (Explore/CFU/Practice/
   Test), the exact CFU questions chosen (call these out clearly — the user
   wants to review and veto/edit these specifically), the Module Test
   assembly, every file touched, every autonomous decision the subagent made
   beyond the plan and why, and the verification results.
3. Explicitly note that a manual pass in the running app is still worth
   doing before calling this production-ready — compiling, linting, and
   passing a build is not the same as confirming it looks and behaves right
   on screen.
4. If the subagent reported a blocker instead of a completed build, relay
   the specific blocker and ask the user for the missing decision — then
   you can re-invoke this same subagent (continue it via SendMessage using
   its name, rather than starting a fresh one, so it keeps full context of
   the partial build) once you have the answer.
