import type { ReactNode } from "react";
import { BaseTenBlocks } from "./BaseTenBlocks";

/**
 * Two numbers as sticks and cubes, side by side, with the comparing sign (or
 * an empty box) between them — Unit 3's picture for < = > (review C1-18 /
 * C1-19). The left number is drawn in tone a, the right in tone b, matching
 * the "Number A" / "Number B" colors on the chart.
 */
export function BlocksPair({
  a,
  b,
  middle,
  ring,
  labels,
  countAlong,
  blocksVsNumber,
}: {
  a: number;
  b: number;
  /** What sits between them: a sign, "box" (an empty ☐), or nothing. */
  middle?: "<" | ">" | "=" | "box";
  /** Outline the sticks or the cubes on both sides (help after a wrong try). */
  ring?: "tens" | "ones";
  /**
   * Number the sticks (1, 2, 3) or the cubes (1, 2, 3) on both sides; "total"
   * counts the left side's sticks by tens, then on through its cubes (40, 41…).
   */
  labels?: "tens" | "ones" | "total";
  countAlong?: boolean;
  /**
   * Review C2-29: the left side is ONLY sticks and cubes (no number written
   * over them; finding it is the question) and the right side is ONLY the
   * number. For "4 tens and 7 ones ☐ 47".
   */
  blocksVsNumber?: boolean;
}) {
  // Each side's share of the row is proportional to its picture's natural
  // width (BaseTenBlocks' own width formula), so both draw at the SAME scale
  // and a stick is the same size on both sides.
  const naturalW = (n: number) => Math.max(Math.min(Math.floor(n / 10), 6) * 32, Math.min(n % 10, 10) * 26, 140) + 20;
  const blockLabels = labels === "tens" ? { tens: "count" as const } : labels === "ones" ? { ones: "count" as const } : labels === "total" ? { tens: "value" as const, ones: "total" as const } : undefined;
  const side = (n: number, tone: "a" | "b") => {
    if (blocksVsNumber && tone === "b") {
      return (
        <div style={{ flex: "0 0 auto", minWidth: 80, display: "flex", justifyContent: "center" }}>
          <span style={{ fontWeight: 900, fontSize: 44, lineHeight: 1, color: `var(--q${tone})` }}>{n}</span>
        </div>
      );
    }
    return (
      <div style={{ flex: `${naturalW(n)} 1 0`, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
        {!blocksVsNumber && <span style={{ fontWeight: 800, fontSize: 24, color: `var(--q${tone})` }}>{n}</span>}
        <BaseTenBlocks
          tens={Math.floor(n / 10)}
          ones={n % 10}
          tenTone={tone}
          oneTone={tone}
          ring={ring}
          labels={labels === "total" && tone === "b" ? undefined : blockLabels}
          countAlong={countAlong}
        />
      </div>
    );
  };
  const mid: ReactNode =
    middle === "box" ? (
      <span aria-hidden style={{ display: "inline-block", width: 44, height: 50, border: "3px solid var(--qc)", borderRadius: 8 }} />
    ) : middle ? (
      <span style={{ fontWeight: 900, fontSize: 56, lineHeight: 1, color: "var(--qc)" }}>{middle}</span>
    ) : null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }} data-tts-skip>
      {side(a, "a")}
      <div style={{ minWidth: 50, display: "flex", justifyContent: "center" }}>{mid}</div>
      {side(b, "b")}
    </div>
  );
}
