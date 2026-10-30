import { palette, diagramFont } from "../../../shared/lib/palette";

const BOX = 56;
const GAP = 10;
const HEIGHT = 74;

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

export interface CountingTrackProps {
  /** The full true sequence (always known internally, even for boxes not
   *  yet revealed) — e.g. [298, 299, 300, 301]. Shared with step-checking
   *  via logic.ts's buildSequence, so the picture and the graded answer
   *  can never disagree. */
  sequence: number[];
  /** How many leading boxes show their number — the rest show "?" so a
   *  Practice/Test question's still-unanswered boxes don't give themselves
   *  away. Pass sequence.length to reveal everything (Explore's free play). */
  knownCount: number;
  tone?: "a" | "b" | "c";
  /**
   * Tints the boundary between two ALREADY-KNOWN boxes whose hundreds digit
   * differs, with a small "new hundred!" flag — the direct visual for "299
   * to 300 is a smooth +1, not a reset to a different kind of number."
   * Never flags a boundary involving an unrevealed ("?") box, so it can't
   * hint at an answer early.
   */
  markHundredChange?: boolean;
}

/**
 * A row of boxes showing a counting/skip-counting sequence, some revealed
 * and some still "?" — the concrete stand-in for "what comes next," used by
 * both Explore (fully revealed, step bound to a Stepper) and Practice/Test
 * (progressively revealed as each step is answered).
 */
export function CountingTrack({ sequence, knownCount, tone, markHundredChange }: CountingTrackProps) {
  const n = sequence.length;
  const width = n * BOX + (n - 1) * GAP + 20;
  const color = toneColor(tone);

  return (
    <svg
      viewBox={`0 0 ${width} ${HEIGHT}`}
      role="img"
      aria-label={`Counting sequence: ${sequence.slice(0, knownCount).join(", ")}${knownCount < n ? ", then " + (n - knownCount) + " more to find" : ""}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {sequence.map((v, i) => {
        const known = i < knownCount;
        const x = 10 + i * (BOX + GAP);
        const crossesHundred = markHundredChange && known && i > 0 && i - 1 < knownCount && Math.floor(v / 100) !== Math.floor(sequence[i - 1] / 100);
        return (
          <g key={i}>
            {crossesHundred && (
              <text x={x - GAP / 2} y={13} textAnchor="middle" fontSize={9} fontWeight={700} fill={palette.good}>
                new hundred!
              </text>
            )}
            <rect x={x} y={20} width={BOX} height={BOX} rx={8} fill={known ? palette.grid : palette.paper} stroke={crossesHundred ? palette.good : known ? palette.line : palette.muted} strokeWidth={crossesHundred ? 2.5 : 1.5} strokeDasharray={known ? undefined : "4 3"} />
            <text x={x + BOX / 2} y={20 + BOX / 2 + 7} textAnchor="middle" fontSize={known ? 18 : 22} fontWeight={700} fill={known ? color : palette.muted}>
              {known ? v : "?"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
