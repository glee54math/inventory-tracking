import { useEffect, useState } from "react";
import { CounterGroup, LEAD_IN_MS, countStepMs, type Arrangement } from "./CounterGroup";

const toneVar = (tone: "a" | "b") => (tone === "a" ? "var(--qa)" : "var(--qb)");

/**
 * Two groups side by side, each in its own box labeled "Group A" / "Group B",
 * so a question about "group A" points at something on screen.
 * `countAlong` plays the counting "Show me" on one group (or "both" at once); `showCounts` writes
 * each group's number under it.
 */
export function TwoGroups({
  a,
  b,
  arrA = "scatter",
  arrB = "scatter",
  seedA = 1,
  seedB = 2,
  countAlong,
  showCounts,
  names,
  cancelOut,
}: {
  a: number;
  b: number;
  arrA?: Arrangement;
  arrB?: Arrangement;
  seedA?: number;
  seedB?: number;
  countAlong?: "A" | "B" | "both";
  showCounts?: boolean;
  /** Box labels instead of "Group A" / "Group B", e.g. ["Grid", "Scattered"]. */
  names?: [string, string];
  /**
   * "Show me" for "how many more?" without subtracting: cross out one counter
   * from EACH group together, one pair per beat, until the smaller group runs
   * out; then (after a one-beat pause for "Now count the ones left:") number
   * what's left in the bigger group 1, 2, 3... Takes countAlongMs(max(a, b) + 1).
   */
  cancelOut?: boolean;
}) {
  const [tick, setTick] = useState(0);
  const pairs = Math.min(a, b);
  const pause = pairs > 0 ? 1 : 0;
  const steps = Math.max(a, b) + pause;
  useEffect(() => {
    setTick(0);
    if (!cancelOut) return;
    const perMs = countStepMs();
    let iv: number | undefined;
    const lead = window.setTimeout(() => {
      setTick(1);
      iv = window.setInterval(() => setTick((k) => (k >= steps ? k : k + 1)), perMs);
    }, LEAD_IN_MS);
    return () => {
      window.clearTimeout(lead);
      window.clearInterval(iv);
    };
  }, [cancelOut, steps]);
  const slashed = cancelOut ? Math.min(tick, pairs) : 0;
  const leftCounted = cancelOut ? Math.max(0, tick - pairs - pause) : 0;
  const group = (label: "A" | "B", n: number, arr: Arrangement, seed: number, tone: "a" | "b") => (
    <div key={label} style={{ flex: "1 1 220px", maxWidth: 330, border: `3px solid ${toneVar(tone)}`, borderRadius: 14, padding: "6px 8px", position: "relative" }}>
      <div
        aria-hidden
        style={{ position: "absolute", top: -16, left: 12, background: toneVar(tone), color: "#fff", fontWeight: 900, fontSize: 18, borderRadius: 10, padding: "0 12px", lineHeight: "32px" }}
      >
        {names ? names[label === "A" ? 0 : 1] : `Group ${label}`}
      </div>
      <CounterGroup
        count={n}
        arrangement={arr}
        tone={tone}
        seed={seed}
        countAlong={countAlong === label || countAlong === "both"}
        slashFirst={slashed}
        numbered={cancelOut && n > pairs ? { from: pairs, shown: leftCounted } : undefined}
      />
      {showCounts && <div style={{ textAlign: "center", fontWeight: 900, fontSize: 26, color: toneVar(tone) }}>{n}</div>}
    </div>
  );
  return (
    <div role="img" aria-label={`${names?.[0] ?? "Group A"} has ${a}. ${names?.[1] ?? "Group B"} has ${b}.`} style={{ display: "flex", gap: 16, flexWrap: "wrap", paddingTop: 16, paddingBottom: 12 }}>
      {group("A", a, arrA, seedA, "a")}
      {group("B", b, arrB, seedB, "b")}
    </div>
  );
}
