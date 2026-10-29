// One-off dev utility — NOT part of the running app.
// Seeds the planningItems Firestore collection with action items distilled
// from src/Planning and Research/{market-research-report,own-platform-analysis,platform-profiles}.md.
// Signs in with the same admin client credentials WorkerLogin.tsx uses for "Mr. Lee"
// (src/utils/config.ts), then writes through the Firestore client SDK exactly the
// way src/utils/planningResearchService.ts's addPlanningItem does.
//
// Usage (run once, from pel-sr-ims/): node scripts/seedPlanningItems.mjs
// Safe to delete after running — re-running will duplicate items.

import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAAzYQtpxrNSIMdodnheNbf52q5tWSdxas",
  authDomain: "pel-sr-inventory-ms.firebaseapp.com",
  projectId: "pel-sr-inventory-ms",
  storageBucket: "pel-sr-inventory-ms.firebasestorage.app",
  messagingSenderId: "492383385577",
  appId: "1:492383385577:web:306344efbf441c90f03d78",
  measurementId: "G-SHP5M6WBE5",
};

// Same values as src/utils/config.ts (ADMIN_CREDENTIALS) — duplicated here
// because plain Node can't import the .ts file directly without a loader.
const ADMIN_EMAIL = "pelsanramon@gmail.com";
const ADMIN_PASSWORD = "PELsanramon1!";

const CATEGORY = "Math Website App Development";

const ITEMS = [
  // Quick wins
  {
    text: "[Quick Win] Fix the shared student PIN — real per-student login",
    notes: "Every platform researched (IXL, Freckle, Edulastic, DreamBox, Lexia, etc.) uses real per-student identity. Freckle and Edulastic got burned publicly for exactly this gap (students logging into classmates' accounts / editing HTML to see answers). Do this before the other items below — several create new per-student state (streaks, telemetry) that a shared PIN could corrupt.",
  },
  {
    text: "[Quick Win] Redesign mastery-drop feedback to show partial credit, not an opaque score drop",
    notes: "IXL's SmartScore harsh-feeling deductions are its single most-criticized UX pattern (student stress/anxiety). glee54math's bucket-coverage star system already knows *why* via CFU gates — surface that instead of just a lower number.",
  },
  {
    text: "[Quick Win] Add a visible streak counter with a forgiving grace/freeze mechanic",
    notes: "Duolingo's single highest-leverage retention lever. Tie it to the existing reintroEverySolved spaced-retention check. Keep it non-monetized (no paid streak freezes).",
  },
  {
    text: "[Quick Win] Add a printable/exportable module-completion certificate",
    notes: "Near-zero-engineering re-engagement artifact, modeled on Zearn's Mission certificates and Mathletics' Bronze-Legend certificates. Tie thresholds to the existing star/mastery system.",
  },
  {
    text: "[Quick Win] Add a class-level (not individual) leaderboard or weekly cohort score",
    notes: "Mathletics' deliberate anti-shaming design — motivates without public individual competition, a better fit for a K-12 audience than Duolingo-style personal leagues.",
  },
  {
    text: "[Quick Win] Write a short parent-facing security/privacy one-pager",
    notes: "What data is collected, who can see it. Newsela/Outschool pattern. Doubles as glee54math's first in-product trust artifact — there are currently zero testimonials/trust signals anywhere in the product.",
  },
  {
    text: "[Quick Win] Run a screen-reader pass and add aria-labels/alt text to the student portal + CFU gates",
    notes: "Every platform researched has some documented accessibility gap (even Khan Academy's own VoiceOver bugs). glee54math currently has none at all — closing this now is a differentiator, not catch-up.",
  },
  {
    text: "[Quick Win] Deduplicate buildStudentProgress's Math/English branches + remove leftover console.log calls",
    notes: "IXL's 'permanent skill ID' discipline is the analogue — keyed on durable level/unit IDs. Edulastic's reliability complaints are the cautionary tale for leaving data-reconciliation bugs in place.",
  },
  // Medium bets
  {
    text: "[Medium] Instrument per-question telemetry: time-on-item, attempt count, hint usage",
    notes: "Most-repeated gap across IXL, Khan, DreamBox, Freckle, Lexia, Newsela, Imagine Learning, Cuemath, Mathletics, ABCmouse, and Zearn. Feed it into the existing Advance/Reinforce/Repeat homework-prediction engine to make it meaningfully more accurate — this one change upgrades several other items too.",
  },
  {
    text: "[Medium] Extend live onSnapshot sync to the parent and student portals",
    notes: "Admin inventory view already updates live; parent/student progress only refreshes on a manual button click. Flagged by IXL, Khan, DreamBox, Cuemath, and Outschool as a consistency/trust issue.",
  },
  {
    text: "[Medium] Build a staff-facing coverage/fidelity dashboard",
    notes: "Which standards are covered vs. gapped per class, which students fell below expected practice cadence. Synthesizes Prodigy's Curriculum Coverage report, DreamBox/ST Math/Lexia's usage-dosage alerts, and Newsela's 'progress binder' (reviewers' single most-praised Newsela feature).",
  },
  {
    text: "[Medium] Turn stars into a light reward economy (avatar items/cosmetics), not social features",
    notes: "ABCmouse's ticket-to-reward-store loop and Freckle's 'pig store' — both explicitly non-social and age-appropriate, a better fit than leaderboards for younger students.",
  },
  {
    text: "[Medium] Add a recurring parent progress digest (email or in-portal)",
    notes: "glee54math currently has zero re-engagement notifications of any kind. Automates the idea behind Cuemath's monthly parent-teacher meeting and IXL's progress-report emails.",
  },
  {
    text: "[Medium] Auto-generate an assignable 'reinforcement task' when a CFU/retention check flags a gap",
    notes: "Lexia's auto-prescribed-lesson pattern — keeps a human (staff/parent) in the loop rather than leaving the Advance/Reinforce/Repeat signal passive.",
  },
  {
    text: "[Medium] Add session-level adaptive resurfacing of missed questions (Quizlet Learn-style)",
    notes: "Sits alongside the existing cross-session reintroEverySolved mechanic. Directly extends the retention/pacing gap already flagged separately as a follow-up area.",
  },
  {
    text: "[Medium] Add an 'ask for help' / flag-a-question affordance inside Practice/Test",
    notes: "A gap Brilliant itself hasn't solved. Route it to the staff portal — easy win since glee54math already has a staff portal to route into.",
  },
  // Larger bets
  {
    text: "[Larger Bet] Build a self-serve trial path (sandboxed lab + take-home learning plan)",
    notes: "Composite of Cuemath's free-session-with-deliverable, Coursera's free-audit tier, and Duolingo's 'real lesson before account creation.' Highest-leverage unaddressed gap (no self-serve funnel exists today) — sequence AFTER the PIN/auth fix, since it creates new accounts at higher volume.",
  },
  {
    text: "[Larger Bet] Formalize staff-mediated enrollment into a repeatable multi-step checklist",
    notes: "Imagine Learning's 5-stage onboarding (Inquire -> Confirm -> Provide roster -> Issue logins -> First-session walkthrough). A process change, not code — can ship immediately, ahead of any self-serve billing.",
  },
  {
    text: "[Larger Bet] If/when billing is ever added, design renewal/cancellation UX up front",
    notes: "Brilliant, ABCmouse, and Outschool all show billing/cancellation friction as a top complaint discovered after the fact. Clear pre-renewal reminders, one-click cancel, visible trial-end dates — cheap to get right from day one, expensive to retrofit.",
  },
  {
    text: "[Larger Bet] Consider offline/local caching of a student's current level content",
    notes: "Coursera's offline-download pattern (service worker or IndexedDB snapshot) for spotty-connection resilience. Lower priority — worth scoping once the student portal has real per-student state worth protecting offline.",
  },
  // Deliberate anti-patterns to keep in mind
  {
    text: "[Avoid] Don't add cosmetic-paywall or FOMO-driven upsell pressure if monetization is ever added",
    notes: "Prodigy's identical pattern drew a 2021 FTC complaint from child-advocacy groups — its single biggest trust liability.",
  },
  {
    text: "[Avoid] Don't convert currently-free staff/admin-granted features into a paywalled tier without warning",
    notes: "Documented cause of Quizlet's 2025 organic-trust collapse — Trustpilot cratered even as invited-reviewer scores (G2) stayed fine.",
  },
  {
    text: "[Avoid] Don't add peer-grading or peer-review features",
    notes: "Coursera's Honor-Code/peer-review friction generated unresolved multi-year complaints. glee54math's fully automated, staff-verified mastery model is a deliberate strength worth preserving.",
  },
  {
    text: "[Avoid] Don't rush to build social/community features",
    notes: "ST Math, DreamBox, Lexia, Renaissance, and Imagine Learning — all successful with this exact K-12 audience — have none at all and route engagement through adults instead. Sequence access control, telemetry, and sync parity ahead of any community investment.",
  },
];

async function main() {
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  const auth = getAuth(app);

  await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
  console.log(`Signed in as admin. Seeding ${ITEMS.length} items into "planningItems"...`);

  const itemsRef = collection(db, "planningItems");
  for (const item of ITEMS) {
    await addDoc(itemsRef, {
      category: CATEGORY,
      text: item.text,
      notes: item.notes,
      completed: false,
      createdAt: new Date(),
    });
    console.log(`  + ${item.text}`);
  }

  console.log(`Done. Seeded ${ITEMS.length} items under "${CATEGORY}".`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
