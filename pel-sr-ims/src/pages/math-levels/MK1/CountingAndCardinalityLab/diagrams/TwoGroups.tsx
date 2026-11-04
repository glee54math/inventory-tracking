import { CounterGroup, type Arrangement } from "./CounterGroup";

const toneVar = (tone: "a" | "b") => (tone === "a" ? "var(--qa)" : "var(--qb)");

/**
 * Two groups side by side, each in its own box with a big "A" or "B" on it,
 * so a question about "group A" points at something on screen.
 * `countAlong` plays the counting "Show me" on one group; `showCounts` writes
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
}: {
  a: number;
  b: number;
  arrA?: Arrangement;
  arrB?: Arrangement;
  seedA?: number;
  seedB?: number;
  countAlong?: "A" | "B";
  showCounts?: boolean;
}) {
  const group = (label: "A" | "B", n: number, arr: Arrangement, seed: number, tone: "a" | "b") => (
    <div key={label} style={{ flex: "1 1 220px", maxWidth: 330, border: `3px solid ${toneVar(tone)}`, borderRadius: 14, padding: "6px 8px", position: "relative" }}>
      <div
        aria-hidden
        style={{ position: "absolute", top: -16, left: 12, background: toneVar(tone), color: "#fff", fontWeight: 900, fontSize: 22, borderRadius: 10, padding: "0 12px", lineHeight: "32px" }}
      >
        {label}
      </div>
      <CounterGroup count={n} arrangement={arr} tone={tone} seed={seed} countAlong={countAlong === label} />
      {showCounts && <div style={{ textAlign: "center", fontWeight: 900, fontSize: 26, color: toneVar(tone) }}>{n}</div>}
    </div>
  );
  return (
    <div role="img" aria-label={`Group A has ${a}. Group B has ${b}.`} style={{ display: "flex", gap: 16, flexWrap: "wrap", paddingTop: 16 }}>
      {group("A", a, arrA, seedA, "a")}
      {group("B", b, arrB, seedB, "b")}
    </div>
  );
}
