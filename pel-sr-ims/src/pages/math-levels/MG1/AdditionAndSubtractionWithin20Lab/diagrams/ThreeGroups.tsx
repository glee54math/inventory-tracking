import { palette } from "../../../shared/lib/palette";
import { TenFrameGroup, type Tone } from "./TenFrame";

const TONES: Tone[] = ["a", "b", "c"];

/**
 * Three numbers to add, each its own ten-frame in its own color, in the
 * order they are written. `pair` outlines the two to add first (the two
 * that make 10), so "add these two first" is something you can see.
 */
export function ThreeGroups({ nums, pair }: { nums: [number, number, number]; pair?: [number, number] | null }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-start" }} role="group" aria-label={`${nums[0]}, ${nums[1]} and ${nums[2]}`}>
      {nums.map((n, i) => {
        const lit = !!pair && pair.includes(i);
        return (
          <div
            key={i}
            style={{
              width: 150,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              padding: 6,
              borderRadius: 12,
              border: `3px ${lit ? "solid" : "dashed"} ${lit ? palette.a : "transparent"}`,
              background: lit ? palette.aSoft : "transparent",
            }}
          >
            <TenFrameGroup value={n} tone={TONES[i]} />
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: palette.ink }}>{n}</span>
          </div>
        );
      })}
    </div>
  );
}
