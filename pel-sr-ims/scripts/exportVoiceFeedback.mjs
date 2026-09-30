// One-off dev utility — NOT part of the running app.
// Dumps the voiceCommandFeedback Firestore collection to local JSON files so
// the voice-command grammar rules (see src/utils/voiceCommandParser.ts) can
// be reviewed and adjusted from real usage.
//
// Usage:
//   GOOGLE_APPLICATION_CREDENTIALS=/path/to/serviceAccountKey.json node scripts/exportVoiceFeedback.mjs
//
// The service account key needs Firestore read+write access to the
// "pel-sr-inventory-ms" project (Firebase console > Project Settings >
// Service accounts > Generate new private key) — write access is needed
// because every entry pulled by this run gets marked reviewed: true, so a
// later run (or the Firestore console) can filter to just what's new.

import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { writeFileSync } from "node:fs";

initializeApp({
  credential: applicationDefault(),
  projectId: "pel-sr-inventory-ms",
});

const db = getFirestore();

async function main() {
  const snapshot = await db.collection("voiceCommandFeedback").get();
  const successes = [];
  const failures = [];
  const unreviewedRefs = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    const record = { id: doc.id, ...data };
    (record.outcome === "success" ? successes : failures).push(record);
    if (!data.reviewed) unreviewedRefs.push(doc.ref);
  });

  writeFileSync("voice-feedback-successes.json", JSON.stringify(successes, null, 2));
  writeFileSync("voice-feedback-failures.json", JSON.stringify(failures, null, 2));

  console.log(`Wrote ${successes.length} successes and ${failures.length} failures.`);

  if (unreviewedRefs.length > 0) {
    const batch = db.batch();
    unreviewedRefs.forEach((ref) => batch.update(ref, { reviewed: true }));
    await batch.commit();
    console.log(`Marked ${unreviewedRefs.length} previously-unreviewed entries as reviewed.`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
