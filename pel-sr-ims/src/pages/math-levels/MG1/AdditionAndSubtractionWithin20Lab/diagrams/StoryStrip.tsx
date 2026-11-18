import { palette } from "../../../shared/lib/palette";
import { TenFrameGroup, type Tone } from "./TenFrame";

export type StoryPart = "start" | "change" | "end";

export interface StoryStripProps {
  start: number;
  change: number;
  end: number;
  /** Add To (start + change = end) or Take From (start − change = end). */
  action: "add" | "take";
  /** The part the story doesn't tell: drawn as an empty dashed box with a "?". */
  missing?: StoryPart | null;
  /**
   * While the missing part is being found: how many counters it shows so far
   * (the "Show" count-along). Its number appears once the count is complete.
   */
  reveal?: number;
  /** Write "Start" / "Change" / "End" over the boxes (off when the labels would give a CFU answer away). */
  labels?: boolean;
}

const NAMES: Record<StoryPart, string> = { start: "Start", change: "Change", end: "End" };
const TONES: Record<StoryPart, Tone> = { start: "a", change: "b", end: "c" };

/**
 * A story as three boxes in a row, Start, Change, End, joined by + (or −)
 * and =, each box a ten-frame picture with its number. The part the story
 * doesn't tell is an empty dashed box with a big "?", so a student can see
 * WHICH number is missing before finding it (Unit 3 "What is missing?").
 */
export function StoryStrip({ start, change, end, action, missing = null, reveal, labels = true }: StoryStripProps) {
  const value: Record<StoryPart, number> = { start, change, end };
  const slot = (part: StoryPart) => {
    const isMissing = part === missing;
    const shown = isMissing ? reveal : value[part];
    const complete = !isMissing || reveal === value[part];
    return (
      <div key={part} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, width: 136 }}>
        {labels && <span style={{ fontWeight: 800, fontSize: 18, color: palette.ink }}>{NAMES[part]}</span>}
        {shown === undefined ? (
          <div
            role="img"
            aria-label={`${NAMES[part]}: missing`}
            style={{ width: "100%", minHeight: 76, display: "grid", placeItems: "center", border: `3px dashed ${palette.muted}`, borderRadius: 10, fontSize: 44, fontWeight: 800, color: palette.muted }}
          >
            ?
          </div>
        ) : (
          <div style={{ width: "100%", borderRadius: 10, outline: isMissing ? `3px dashed ${palette.muted}` : undefined, outlineOffset: 3 }}>
            <TenFrameGroup value={shown} tone={TONES[part]} />
          </div>
        )}
        <span style={{ fontSize: "1.6rem", fontWeight: 800, minHeight: "1.9rem", color: palette.ink }}>{shown === undefined || !complete ? (isMissing ? "?" : "") : shown}</span>
      </div>
    );
  };
  const sign = (s: string) => (
    <span aria-hidden style={{ fontSize: "1.9rem", fontWeight: 800, color: palette.muted, alignSelf: "center" }}>
      {s}
    </span>
  );
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "flex-start" }} role="group" aria-label="The story: start, change, end">
      {slot("start")}
      {sign(action === "add" ? "+" : "−")}
      {slot("change")}
      {sign("=")}
      {slot("end")}
    </div>
  );
}
