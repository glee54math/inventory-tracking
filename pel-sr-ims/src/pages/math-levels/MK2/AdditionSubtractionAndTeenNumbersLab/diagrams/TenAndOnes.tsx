import { palette, diagramFont } from "../../../shared/lib/palette";
import { TenFrame } from "./TenFrame";

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

export interface TenAndOnesProps {
  /** 0 or 1 — this lab only ever shows a single ten-group (values 0-19). */
  tens: 0 | 1;
  /** 0-9 extra, loose ones shown beside the ten-group. */
  ones: number;
  tenTone?: "a" | "b" | "c";
  onesTone?: "a" | "b" | "c";
}

/** A teen number (or any 0-19 value) shown as ONE bundled ten-group — a full
 *  TenFrame, a single recognizable unit, not ten separate ones — plus loose
 *  "ones" in a clearly different tone, so the ten-group and the extra ones
 *  can never be mistaken for one undifferentiated pile. This is the direct
 *  visual for K.NBT.1's "a teen number is 10 and some more," built on top of
 *  TenFrame (the second real use of that shape in this lab, after Making
 *  10's own complement visualization) rather than duplicating its grid
 *  layout a third time. */
export function TenAndOnes({ tens, ones, tenTone = "a", onesTone = "b" }: TenAndOnesProps) {
  const onesCount = Math.max(0, Math.min(9, Math.round(ones)));
  const color = toneColor(onesTone);
  const onesWidth = Math.max(60, onesCount * 26 + 20);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 18, flexWrap: "wrap" }}>
      {tens === 1 && <TenFrame filled={10} tone={tenTone} />}
      <svg
        viewBox={`0 0 ${onesWidth} 60`}
        role="img"
        aria-label={`${onesCount} loose one${onesCount === 1 ? "" : "s"}, not bundled into a ten`}
        style={{ display: "block", width: onesWidth, maxWidth: onesWidth, height: "auto", fontFamily: diagramFont }}
      >
        {onesCount === 0 && (
          <text x={onesWidth / 2} y={34} textAnchor="middle" fontSize={13} fill={palette.muted}>
            (no extra ones)
          </text>
        )}
        {Array.from({ length: onesCount }, (_, i) => (
          <circle key={i} cx={20 + i * 26} cy={30} r={12} fill={color} stroke={palette.paper} strokeWidth={2} />
        ))}
      </svg>
    </div>
  );
}
