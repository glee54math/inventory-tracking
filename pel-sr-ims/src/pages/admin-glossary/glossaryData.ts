// glossaryData.ts
// Mr. Lee-only glossary of the terms used when building and reviewing math labs.
// Shown on the All Levels page (Glossary.tsx). PRIVACY: loaded only through the
// lazy Glossary module, never by the student portal.
//
// KEEP THIS UP TO DATE (user request 2026-11-24, from the MK3 review; all grades):
// when a lab build, review fix or rule change adds a new feature or term, or changes
// which levels use one, update its entry here in the same change. `levels` is the
// list of levels that actually use it in code today; `updated` is the date checked.

export type GlossaryGroup = "Lab parts" | "Help for students" | "Check for Understanding" | "Stars and retries" | "Voice and screen" | "Review workflow";

export interface GlossaryTerm {
    term: string;
    /** Other names you may see in reports or code. */
    aka?: string[];
    group: GlossaryGroup;
    /** What it is, in plain words. */
    meaning: string;
    /** What the student sees or hears, if anything. */
    studentSees?: string;
    /** Levels that use it today, or a note like "all math labs". */
    levels: string;
    /** Where it lives in code, for looking it up. */
    code?: string;
    updated: string;
}

export const GLOSSARY_UPDATED = "2026-11-26";

const D = GLOSSARY_UPDATED;

export const GLOSSARY: GlossaryTerm[] = [
    // ---------------- Lab parts ----------------
    {
        term: "Lab",
        aka: ["module"],
        group: "Lab parts",
        meaning: "One topic for one level (for example MK3 Measurement & Classifying). It has several units and one Module Test.",
        levels: "All math levels",
        code: "math-levels/{Level}/{Level}_{LabName}.tsx (the \"shell\")",
        updated: D,
    },
    {
        term: "Shell",
        group: "Lab parts",
        meaning: "The lab's main file. It holds the unit list, the tabs, the stars and the rules for moving between parts. The K–1 shells are near-copies, so a fix to one usually goes into all of them.",
        levels: "All math levels",
        code: "{Level}_{LabName}.tsx",
        updated: D,
    },
    {
        term: "Unit",
        group: "Lab parts",
        meaning: "One skill inside a lab. Each unit has Explore, a Check for Understanding, Practice and a Unit Test.",
        levels: "All math levels",
        code: "{LabName}/units/*.tsx",
        updated: D,
    },
    {
        term: "Explore",
        group: "Lab parts",
        meaning: "The hands-on part where the student plays with a picture or tool and the lab explains the idea. The Check for Understanding sits at the end of it.",
        studentSees: "A picture or tool with short spoken lines and a Key Idea.",
        levels: "All math levels",
        updated: D,
    },
    {
        term: "Key Idea",
        group: "Lab parts",
        meaning: "The one sentence the unit wants the student to remember, shown in Explore.",
        levels: "All math levels",
        updated: D,
    },
    {
        term: "Practice",
        group: "Lab parts",
        meaning: "Problems the student solves step by step, with help available. Stars come from Practice.",
        levels: "All math levels",
        code: "shared/engine/StepProblem.tsx",
        updated: D,
    },
    {
        term: "Step",
        group: "Lab parts",
        meaning: "One part of a Practice problem (one box to type in, or one choice to tap). A problem usually has 2–3 steps.",
        levels: "All math levels",
        updated: D,
    },
    {
        term: "Two-button step",
        aka: ["two-choice pick"],
        group: "Lab parts",
        meaning: "A step with only two answer buttons (for example \"Rod A\" or \"Rod B\"). After one wrong tap the wrong button greys out, so only the right one is left.",
        levels: "Mostly K–1 labs (MK1–MK4, MG1, MG2)",
        updated: D,
    },
    {
        term: "Unit Test",
        group: "Lab parts",
        meaning: "A short test at the end of a unit with little or no help.",
        levels: "All math levels",
        code: "{LabName}/units/*Test.tsx",
        updated: D,
    },
    {
        term: "Module Test",
        group: "Lab parts",
        meaning: "One test covering every unit in the lab. It has its own star bands.",
        levels: "MK1–MK4, MG1–MG10, MM1",
        code: "{LabName}/units/ModuleTest.tsx",
        updated: D,
    },
    {
        term: "Problem type",
        aka: ["bucket", "kind"],
        group: "Lab parts",
        meaning: "A group of Practice problems that test the same thing in the same way. Every unit has several, so a student can't earn mastery on the easy ones alone. \"Bucket\" is the name in code and reports.",
        studentSees: "The problem-type buttons above Practice (including Mixed).",
        levels: "All math levels",
        code: "Problem.bucket, unit.requiredBuckets",
        updated: D,
    },
    {
        term: "Generator",
        aka: ["factory"],
        group: "Lab parts",
        meaning: "The code that makes a new random problem of one type each time. A \"twin\" or \"Try one like it\" comes from the same generator.",
        levels: "All math levels",
        updated: D,
    },
    {
        term: "Diagram",
        group: "Lab parts",
        meaning: "A drawn picture used by a lab (rods, scales, ten-frames, number lines). Each lab keeps its own in a diagrams folder.",
        levels: "All math levels",
        code: "{LabName}/diagrams/*.tsx",
        updated: D,
    },

    // ---------------- Help for students ----------------
    {
        term: "Early-learner mode",
        aka: ["EarlyLearnerProvider", "K–1 mode"],
        group: "Help for students",
        meaning: "A switch in the lab's shell that turns on plain-language feedback, locked tried buttons, bigger buttons and the number pad. (The help ladder is for every lab since 2026-11-24.)",
        levels: "MK1–MK4, MG1, MG2 (MG3 and MG4 are in the K–1 band but not switched over yet)",
        code: "shared/engine/audience.tsx",
        updated: D,
    },
    {
        term: "K–1 band",
        group: "Help for students",
        meaning: "The levels written for Kindergarten and 1st graders seeing the topic for the first time, plus behind 2nd graders. Audio-first, alone on an iPad.",
        levels: "MK1–MK4, MG1–MG4",
        updated: D,
    },
    {
        term: "Help ladder",
        group: "Help for students",
        meaning: "The order help appears in Practice: 1st wrong try → hint + Look here; 2nd wrong try on the same step → Show me button; after help → Try one like it. The goal is that no student stays stuck or learns to give up.",
        levels: "All math labs (since 2026-11-24; before that MK1–MK4, MG1, MG2 only)",
        code: "StepProblem.tsx",
        updated: D,
    },
    {
        term: "Hint",
        aka: ["Show hint"],
        group: "Help for students",
        meaning: "A short sentence that points toward the answer without giving it. It opens automatically after the 1st wrong try. Tapping the \"Show hint\" button before that costs the star and requires Try one like it, even if the next answer is right.",
        studentSees: "A hint line under the question.",
        levels: "All math levels",
        updated: D,
    },
    {
        term: "Look here (Practice)",
        aka: ["look-here ring", "pointing(help, i)", "first-wrong-tap picture"],
        group: "Help for students",
        meaning: "After the 1st wrong try, the picture rings, arrows or highlights the spot that holds the answer. On some two-button steps MK3 makes this stronger (for example it also shows the word's picture). It is NOT the Show me walkthrough.",
        studentSees: "A ring, arrow or highlight on the picture.",
        levels: "MK1–MK4, MG1, MG2, MG10",
        code: "pointing(help, i) in each unit's visual",
        updated: D,
    },
    {
        term: "Show me",
        aka: ["walkthrough", "demo"],
        group: "Help for students",
        meaning: "A button that plays a narrated walkthrough of the step (for example \"Count with me: 1, 2, 3\") and fills in the answer. It appears after the 2nd wrong try on the same step. A two-button step can't get a 2nd wrong try (only the right button is left), which is fine.",
        studentSees: "A \"🙋 Show me\" button, then a spoken, animated walkthrough.",
        levels: "All math labs (since 2026-11-24)",
        code: "showMe / showMeHoldMs on a step",
        updated: D,
    },
    {
        term: "Show answer",
        group: "Help for students",
        meaning: "RETIRED 2026-11-24. The old older-grade help (answer shown after the 3rd wrong try, no walkthrough). Replaced by Show me after the 2nd wrong try in every lab. MG11's Geometry lab has its own \"Show me the answer\" link outside the shared engine.",
        levels: "None (MG11 Geometry lab has its own version)",
        updated: D,
    },

    // ---------------- Check for Understanding ----------------
    {
        term: "Check for Understanding",
        aka: ["CFU", "intro check"],
        group: "Check for Understanding",
        meaning: "A few questions at the end of Explore. The student must pass it before Practice opens, every time (practice history doesn't skip it).",
        studentSees: "Questions at the bottom of Explore; Practice is locked until they pass.",
        levels: "All math levels",
        code: "unit.requiresIntro",
        updated: D,
    },
    {
        term: "CFU stays open",
        aka: ["cfuJustPassed"],
        group: "Check for Understanding",
        meaning: "After passing, the CFU stays on screen until the student leaves Explore, so it doesn't vanish mid-read.",
        levels: "All math levels",
        updated: D,
    },
    {
        term: "K-friendly CFU",
        aka: ["KCheck"],
        group: "Check for Understanding",
        meaning: "The shared CFU for young students: one short question at a time, a picture, number-pad typing, few-word feedback, and the answer shown after repeated misses.",
        levels: "MK1–MK4, MG1, MG2",
        code: "shared/components/KCheck.tsx",
        updated: D,
    },
    {
        term: "Retry question",
        aka: ["twin"],
        group: "Check for Understanding",
        meaning: "On a two-button CFU question, a wrong tap swaps in a new question of the same kind with new values, so the student can't just tap the other button.",
        studentSees: "A short reason, then a new question.",
        levels: "MK2, MK3, MK4, MG1",
        code: "PickCheck twin",
        updated: D,
    },
    {
        term: "Look here (CFU)",
        aka: ["lookHereSpot", "look"],
        group: "Check for Understanding",
        meaning: "After a 2nd CFU miss, an arrow, \"Look here\" label or highlight points to the place in Explore that teaches the answer.",
        studentSees: "An arrow or highlight on the Explore picture.",
        levels: "MK2, MK3, MK4, MG1, MG2, MG5, MG8, MG10",
        updated: D,
    },
    {
        term: "Show it (CFU)",
        group: "Check for Understanding",
        meaning: "After repeated CFU misses (2nd, or 3rd with Look here), the CFU shows the answer so the student isn't stuck.",
        levels: "MK1–MK4, MG1, MG2",
        updated: D,
    },

    // ---------------- Stars and retries ----------------
    {
        term: "Clean solve",
        group: "Stars and retries",
        meaning: "A Practice problem solved with no hint, no wrong try and no Show me / Show answer. Only clean solves earn star credit.",
        levels: "All math levels",
        updated: D,
    },
    {
        term: "Star / mastery",
        group: "Stars and retries",
        meaning: "Stars fill as the student gets 2 clean solves in every problem type, in Mixed only. A star is only shown or said when one is really earned.",
        studentSees: "⭐ on the unit and \"You got a ⭐!\" only when earned.",
        levels: "All math levels",
        code: "useModuleProgress.ts (recordSolve, starCount)",
        updated: D,
    },
    {
        term: "Mixed",
        group: "Stars and retries",
        meaning: "The problem-type setting that draws from every type. Only Mixed problems count toward stars.",
        levels: "All math levels",
        updated: D,
    },
    {
        term: "Try one like it",
        aka: ["same-type retry", "onRetrySame"],
        group: "Stars and retries",
        meaning: "After a problem solved with help, \"Next problem\" is locked and the student must solve a new problem of the same type alone. Triggered by: a tapped \"Show hint\" (even if the next answer is right), a wrong choice tap, 2 wrong tries on one step, Show me, or more than one hint. One wrong typed answer (with the hint it opens) does NOT trigger it. Required in every lab (2026-11-24).",
        studentSees: "\"Now try one like it by yourself.\" and a \"Try one like it\" button.",
        levels: "Has it: MK1–MK4, MG1, MG2, MG10. Still missing: MG3–MG9, MG11, MM1 (added when each is next reviewed)",
        code: "StepProblem isSolvedAlone, shell retrySame",
        updated: D,
    },
    {
        term: "Retry lock",
        aka: ["retry debt", "owesRetry"],
        group: "Stars and retries",
        meaning: "Keeps \"Try one like it\" required even if the student switches unit, tab or problem type, or reloads.",
        levels: "MK1–MK4, MG1, MG2, MG10",
        code: "shared/engine/retryDebt.ts",
        updated: D,
    },
    {
        term: "Module Test star bands",
        group: "Stars and retries",
        meaning: "The percent cut-offs that turn a Module Test score into 0–5 stars. Every test can reach 5 stars.",
        levels: "All labs with a Module Test",
        updated: D,
    },

    // ---------------- Voice and screen ----------------
    {
        term: "Word slash",
        group: "Voice and screen",
        meaning: "A slash between two words is read as \"or\" (\"longer/shorter\" → \"longer or shorter\"). Units after a slash (miles/hour) and fractions (3/4) are not changed.",
        levels: "All labs with read-aloud",
        code: "shared/tts/mathSpeech.ts isWordSlash",
        updated: D,
    },
    {
        term: "Read-aloud",
        aka: ["TTS", "voice", "speaker button"],
        group: "Voice and screen",
        meaning: "The lab speaks its text. A speaker button replays a line; \"auto-read\" speaks it when it appears.",
        levels: "MK1–MK4, MG1–MG5 (MG6 and up: no read-aloud)",
        code: "shared/tts/",
        updated: D,
    },
    {
        term: "Number pad",
        aka: ["numpad"],
        group: "Voice and screen",
        meaning: "An on-screen pad for typing numbers, placed beside its boxes and never over a picture.",
        levels: "Early-learner labs (MK1–MK4, MG1, MG2)",
        updated: D,
    },
    {
        term: "Test screen fit",
        aka: ["landscape Test layout", "Test auto-scroll"],
        group: "Voice and screen",
        meaning: "In early-learner Tests, the page lays out and scrolls so every answer button, number pad key, Check and the top of the picture are on screen, whether the iPad is upright or sideways. Sideways, the picture sits on the left and the answers on the right.",
        studentSees: "The whole question on screen without scrolling.",
        levels: "Early-learner labs (MK1–MK4, MG1, MG2), since 2026-11-26 (MK4 review; the sideways layout came from MK2)",
        code: "shared/styles/lab-base.css (.lab-early), UnitTest.tsx",
        updated: D,
    },
    {
        term: "Build step",
        aka: ["custom step"],
        group: "Lab parts",
        meaning: "A Practice step where the student does something in the picture instead of typing or tapping an answer button, like joining clay balls with sticks or fitting shapes into an outline. A wrong build counts as a wrong try and gives its own short reason (\"Not yet. There is a gap.\"). The reason clears as soon as the student keeps working.",
        studentSees: "A picture to build in, a check button, and one short line after a wrong try.",
        levels: "MK4 (sticks, cube, shapes, strip); other labs use custom steps without their own reason (MK1, MK2, some MG labs)",
        code: "shared/engine/StepProblem.tsx (onWrong(reason), onEdit)",
        updated: D,
    },
    {
        term: "Stacked fraction",
        group: "Voice and screen",
        meaning: "Every fraction a student sees is drawn top-over-bottom, never typed as 1/2.",
        levels: "All labs with fractions",
        updated: D,
    },

    // ---------------- Review workflow ----------------
    {
        term: "build-math-lab workflow",
        aka: ["review workflow", "the skill"],
        group: "Review workflow",
        meaning: "The process that builds or reviews a lab: plan → build → review rounds (two checkers) → one merged fix list → fixer → repeat, up to 3 rounds → wrap-up.",
        levels: "All math levels",
        code: ".claude/skills/build-math-lab/SKILL.md",
        updated: D,
    },
    {
        term: "Stage 0–6",
        group: "Review workflow",
        meaning: "The workflow's steps: 0 plan, 1 build, 2 build report, 3 review, 4 merge, 5 fix, 6 wrap-up (rule changes + summary).",
        levels: "All math levels",
        updated: D,
    },
    {
        term: "Builder",
        aka: ["math-lab-builder", "builder md"],
        group: "Review workflow",
        meaning: "The agent that builds a lab, and the rule file it follows. Its rules apply to every grade unless tagged with a grade range.",
        levels: "All math levels",
        code: ".claude/agents/math-lab-builder.md",
        updated: D,
    },
    {
        term: "Curriculum checker",
        group: "Review workflow",
        meaning: "The agent that reviews the learning: standards, order, help, pictures, mastery. Its finding IDs start with C (C2-14 = round 2, item 14).",
        levels: "All math levels",
        code: ".claude/agents/math-lab-curriculum-design-checker.md",
        updated: D,
    },
    {
        term: "English checker",
        group: "Review workflow",
        meaning: "The agent that reviews every word against the grade's English guidelines. Its finding IDs start with E.",
        levels: "All math levels",
        code: ".claude/agents/math-lab-english-checker.md",
        updated: D,
    },
    {
        term: "Fixer",
        group: "Review workflow",
        meaning: "The agent that makes the changes on the merged fix list.",
        levels: "All math levels",
        code: ".claude/agents/math-lab-fixer.md",
        updated: D,
    },
    {
        term: "Round",
        group: "Review workflow",
        meaning: "One pass of: both checkers review → merge → fix. The workflow stops after 3 rounds, or sooner if no Blocker or Major is found.",
        levels: "All math levels",
        updated: D,
    },
    {
        term: "Merged fix list",
        aka: ["round-N-merged.md"],
        group: "Review workflow",
        meaning: "Both checkers' findings combined into one list, each marked Fix, Skip or Ask user.",
        levels: "All math levels",
        code: "_planning/reviews/{Level}_{Lab}/",
        updated: D,
    },
    {
        term: "Severity",
        aka: ["Blocker", "Major", "Minor", "Polish"],
        group: "Review workflow",
        meaning: "Blocker: a student who knows the math still gets it wrong. Major: many students are slowed or confused. Minor: small problem. Polish: clearer, but the student would get there.",
        levels: "All math levels",
        updated: D,
    },
    {
        term: "Ask user",
        aka: ["D1, D2… decisions"],
        group: "Review workflow",
        meaning: "A finding that changes the plan or an earlier decision, so you decide. Your answers are logged as D1, D2… in that lab's review files.",
        levels: "All math levels",
        updated: D,
    },
    {
        term: "Rule scope tag",
        group: "Review workflow",
        meaning: "Every added rule says where it came from and which grades it covers, e.g. \"(from MK3, 2026-11-24; K–1)\", so later conflicts can be narrowed or widened by grade.",
        levels: "All rule files",
        updated: D,
    },
    {
        term: "Lab status board",
        aka: ["LAB_STATUS.md"],
        group: "Review workflow",
        meaning: "The list of every lab and whether it has been reviewed. Shown as the Review status board on this page.",
        levels: "All math levels",
        code: "_planning/reviews/LAB_STATUS.md",
        updated: D,
    },
    {
        term: "English guidelines",
        aka: ["grade files", "english-for-math"],
        group: "Review workflow",
        meaning: "Per-grade rules for sentence length, grammar and math words, plus a checklist and a list of language traps.",
        levels: "All math levels",
        code: ".claude/reference/english-for-math/",
        updated: D,
    },
    {
        term: "Vocabulary list",
        aka: ["vocabulary.md"],
        group: "Review workflow",
        meaning: "The words each lab teaches, by unit, so later labs don't use a word no lab has taught yet.",
        levels: "All math levels",
        code: "_planning/Grade-*/{LabName}/vocabulary.md",
        updated: D,
    },
];
