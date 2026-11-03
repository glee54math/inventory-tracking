import { useEffect, useState } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";

// One ten-frame: 2 rows of 5 boxes.
const CELL = 22;
const CELL_GAP = 4;
const FRAME_PAD = 5;
const FRAME_W = 5 * CELL + 4 * CELL_GAP + FRAME_PAD * 2;
const FRAME_H = 2 * CELL + CELL_GAP + FRAME_PAD * 2;
const FRAME_GAP = 14; // space between frames
const PER_ROW = 5; // frames per row before wrapping (100 = two rows of 5 tens)
const MARGIN = 7; // room for the blinkFrame outline

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/**
 * One ten-frame with `filled` counters (0–10). Counters fill the top row of 5
 * left to right, then the bottom row — so 6 reads as "a row of 5 and 1 more",
 * and the empty boxes show how many more make the next ten.
 */
function Frame({
  x,
  y,
  filled,
  color,
  targetCell,
  removeCell,
  callout,
  targetColor,
  targetSoft,
}: {
  x: number;
  y: number;
  filled: number;
  color: string;
  /** Box (0-9) to ring as "the next dot", or undefined for none. */
  targetCell?: number;
  /** Filled box (0-9) to mark with a blinking X as "take this one away". */
  removeCell?: number;
  /** A filled box (0-9) to cover with a big numbered dot, e.g. "69" while counting along. */
  callout?: { cell: number; text: string; key: string };
  targetColor: string;
  targetSoft: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={FRAME_W} height={FRAME_H} rx={8} style={{ fill: palette.paper, stroke: palette.ink, strokeWidth: 2 }} />
      {Array.from({ length: 10 }, (_, i) => {
        const cx = x + FRAME_PAD + (i % 5) * (CELL + CELL_GAP);
        const cy = y + FRAME_PAD + Math.floor(i / 5) * (CELL + CELL_GAP);
        const isTarget = i === targetCell;
        const isRemove = i === removeCell;
        return (
          <g key={i}>
            <rect
              x={cx}
              y={cy}
              width={CELL}
              height={CELL}
              rx={4}
              style={isTarget || isRemove ? { fill: targetSoft, stroke: targetColor, strokeWidth: 3 } : { fill: "none", stroke: palette.line, strokeWidth: 1.5 }}
            />
            {i < filled && <circle cx={cx + CELL / 2} cy={cy + CELL / 2} r={CELL / 2 - 3} style={{ fill: color, opacity: isRemove ? 0.45 : 1 }} />}
            {isRemove && (
              <g className="diagram-blink" style={{ stroke: targetColor, strokeWidth: 3.5, strokeLinecap: "round" }}>
                <line x1={cx + 3} y1={cy + 3} x2={cx + CELL - 3} y2={cy + CELL - 3} />
                <line x1={cx + CELL - 3} y1={cy + 3} x2={cx + 3} y2={cy + CELL - 3} />
              </g>
            )}
            {isTarget && (
              <text x={cx + CELL / 2} y={cy + CELL / 2} textAnchor="middle" dominantBaseline="central" style={{ fill: targetColor, fontSize: 15, fontWeight: 800 }}>
                ?
              </text>
            )}
          </g>
        );
      })}
      {callout && (
        // Drawn after every box so the big dot sits on top of its neighbors.
        <g key={callout.key} className="diagram-pop">
          <circle
            cx={x + FRAME_PAD + (callout.cell % 5) * (CELL + CELL_GAP) + CELL / 2}
            cy={y + FRAME_PAD + Math.floor(callout.cell / 5) * (CELL + CELL_GAP) + CELL / 2}
            r={CELL / 2 + 5}
            style={{ fill: targetColor, stroke: palette.paper, strokeWidth: 2 }}
          />
          <text
            x={x + FRAME_PAD + (callout.cell % 5) * (CELL + CELL_GAP) + CELL / 2}
            y={y + FRAME_PAD + Math.floor(callout.cell / 5) * (CELL + CELL_GAP) + CELL / 2}
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fill: "#fff", fontSize: callout.text.length > 2 ? 10 : 13, fontWeight: 800 }}
          >
            {callout.text}
          </text>
        </g>
      )}
    </g>
  );
}

const LABEL_H = 22; // room under each frame for its running count
const GROUP_H = 18; // room for the "n groups of ten" line (countGroups)

export interface TenGroupsProps {
  /** 0-100. Values above 100 are clamped — nothing in this lab counts that high. */
  value: number;
  tone?: "a" | "b" | "c";
  /**
   * Write the running count under each frame: 10, 20, 30... for full frames,
   * then the exact total (e.g. 61) under the partly filled one. Helps students
   * who can't yet see a full frame as "ten" or skip count by tens.
   */
  labels?: boolean;
  /**
   * Ring the empty box where the dot for this number would go (e.g. 62 when
   * showing 61), so "what comes next?" points at a spot in the picture. Pair
   * with the same `targetTone` on the answer box (NumberStep.tone).
   */
  target?: number;
  targetTone?: "a" | "b" | "c";
  /**
   * Mark the dot for this number (normally `value`, the last dot) with a
   * blinking X, for "one less than" questions. Uses `targetTone`'s color.
   */
  remove?: number;
  /**
   * Count along a few numbers on a loop, e.g. [68, 69, 70]: each number's dot
   * appears in turn as a big `targetTone` dot with its number on it, about one
   * second each, then it starts over. Ties the numbers said to the dots.
   * Overrides `value` (the picture shows the number being counted).
   */
  countAlong?: number[];
  /** Milliseconds per number in `countAlong`. Default 1000. */
  countAlongMs?: number;
  /**
   * Index (0-based) of one frame to blink 3 times and outline in
   * `targetTone`, e.g. the group of ten a "count by tens" jump just added.
   */
  blinkFrame?: number;
  /**
   * Count the full groups of ten one per second: each blinks once in turn, and
   * "1 group of ten", "2 groups of ten"... appears under it (in `targetTone`)
   * and stays. Takes `tens` seconds in all.
   */
  countGroups?: boolean;
}

/** Plays `countAlong` on a loop by redrawing the picture one number at a time. */
function CountAlong({ countAlong, countAlongMs = 1000, ...rest }: TenGroupsProps & { countAlong: number[] }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setTick((k) => k + 1), countAlongMs);
    return () => window.clearInterval(t);
  }, [countAlongMs]);
  const n = countAlong[tick % countAlong.length];
  // Keyed on the tick so the pop animation replays for every number.
  return <TenGroupsView {...rest} value={n} target={undefined} remove={undefined} callout={n} calloutKey={String(tick)} />;
}

/**
 * A count shown as ten-frames: one full frame per ten, then one more frame
 * holding the leftover ones (filling the top row first). The same 2-rows-of-5
 * shape every time, so a student learns to see "a ten" as one unit, and
 * crossing 9 → 10 visibly fills a frame and starts a fresh one. Zero shows a
 * single empty frame.
 */
export function TenGroups(props: TenGroupsProps) {
  return props.countAlong && props.countAlong.length > 0 ? <CountAlong {...props} countAlong={props.countAlong} /> : <TenGroupsView {...props} />;
}

function TenGroupsView({
  value,
  tone,
  labels,
  target,
  targetTone = "b",
  remove,
  blinkFrame,
  countGroups,
  callout,
  calloutKey = "",
}: TenGroupsProps & { callout?: number; calloutKey?: string }) {
  const v = Math.max(0, Math.min(100, Math.round(value)));
  const tens = Math.floor(v / 10);
  const ones = v % 10;
  const color = toneColor(tone);
  const targetColor = toneColor(targetTone);
  const targetSoft = targetTone === "b" ? palette.bSoft : targetTone === "c" ? palette.cSoft : palette.aSoft;

  // Full tens, then a partly filled frame for the ones (or an empty frame for 0).
  const frames = [...Array.from({ length: tens }, () => 10), ...(ones > 0 || v === 0 ? [ones] : [])];
  // Where the target number's dot would go: frame (t-1)/10, box (t-1)%10.
  // Only an empty box just past the count can be a target.
  const hasTarget = target !== undefined && target > v && target <= 100;
  const targetFrame = hasTarget ? Math.floor((target - 1) / 10) : -1;
  const targetCell = hasTarget ? (target - 1) % 10 : -1;
  const hasCallout = callout !== undefined && callout >= 1 && callout <= v;
  const calloutFrame = hasCallout ? Math.floor((callout - 1) / 10) : -1;
  const hasRemove = remove !== undefined && remove >= 1 && remove <= v;
  const removeFrame = hasRemove ? Math.floor((remove - 1) / 10) : -1;
  const removeCell = hasRemove ? (remove - 1) % 10 : -1;
  while (hasTarget && frames.length <= targetFrame) frames.push(0); // e.g. 60 -> 61 needs a fresh frame

  const labelH = (labels ? LABEL_H : 0) + (countGroups ? GROUP_H : 0);
  const cols = Math.min(frames.length, PER_ROW);
  const rows = Math.ceil(frames.length / PER_ROW);
  const rowPitch = FRAME_H + labelH + FRAME_GAP;
  const width = MARGIN * 2 + cols * FRAME_W + (cols - 1) * FRAME_GAP;
  const height = MARGIN * 2 + rows * (FRAME_H + labelH) + (rows - 1) * FRAME_GAP;

  // Running count after each frame: 10, 20, ... then the exact total. An
  // empty frame (only there to hold the target box) gets no label.
  const labelFor = (i: number) => (frames[i] === 0 && v !== 0 ? "" : String(Math.min(v, (i + 1) * 10)));

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${v} shown as ${tens} group${tens === 1 ? "" : "s"} of ten${ones ? ` and ${ones} more` : ""}${labels ? `, counted ${frames.map((_, i) => labelFor(i)).filter(Boolean).join(", ")}` : ""}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {frames.map((filled, i) => {
        const x = MARGIN + (i % PER_ROW) * (FRAME_W + FRAME_GAP);
        const y = MARGIN + Math.floor(i / PER_ROW) * rowPitch;
        const label = labels ? labelFor(i) : "";
        const counted = countGroups && i < tens; // only full frames are "a group of ten"
        return (
          <g key={i} className={i === blinkFrame ? "diagram-blink-3" : undefined}>
            {i === blinkFrame && (
              <rect x={x - 4} y={y - 4} width={FRAME_W + 8} height={FRAME_H + 8} rx={11} style={{ fill: "none", stroke: targetColor, strokeWidth: 4 }} />
            )}
            <g className={counted ? "diagram-blink-once" : undefined} style={counted ? { animationDelay: `${i}s` } : undefined}>
              <Frame
                x={x}
                y={y}
                filled={filled}
                color={color}
                targetCell={i === targetFrame ? targetCell : undefined}
                removeCell={i === removeFrame ? removeCell : undefined}
                callout={i === calloutFrame ? { cell: (callout! - 1) % 10, text: String(callout), key: calloutKey } : undefined}
                targetColor={targetColor}
                targetSoft={targetSoft}
              />
            </g>
            {label && (
              <text x={x + FRAME_W / 2} y={y + FRAME_H + LABEL_H - 5} textAnchor="middle" style={{ fill: palette.ink, fontSize: 17, fontWeight: 800 }}>
                {label}
              </text>
            )}
            {counted && (
              <text
                className="diagram-reveal"
                x={x + FRAME_W / 2}
                y={y + FRAME_H + (labels ? LABEL_H : 0) + GROUP_H - 4}
                textAnchor="middle"
                style={{ fill: targetColor, fontSize: 13, fontWeight: 800, animationDelay: `${i}s` }}
              >
                {i + 1} group{i === 0 ? "" : "s"} of ten
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
