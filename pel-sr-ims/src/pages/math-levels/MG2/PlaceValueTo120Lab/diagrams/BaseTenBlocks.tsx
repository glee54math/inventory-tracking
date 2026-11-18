import { useEffect, useRef, useState } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";
import { BUNDLE_MS, LEAD_IN_MS, STEP_MS } from "./timing";
import { useTtsState } from "../../../shared/tts/ttsContext";

const ROD_W = 22;
const UNIT_H = 13; // each ten-stick is 10 stacked unit-cells this tall
const ROD_H = UNIT_H * 10;
const GAP = 10;
const PER_ROW_TENS = 6; // sticks wrap after this many (120 = 12 tens, so up to 2 rows)
const ONE = 20; // ones-cube side length
const PER_ROW_ONES = 10;
const LABEL_H = 18; // room under a row of sticks for its "10, 20, 30" labels
// 10 or more sticks (100-120, user decision 2026-11-17): the first 10 sticks
// sit close together inside one rounded outline (the "big group", 100), and
// any extra sticks stand apart to its right, at the usual spacing.
const IN_GAP = 2; // space between sticks inside the big group
const GROUP_PAD = 6; // room between the outline and the sticks
const GROUP_W = 10 * ROD_W + 9 * IN_GAP + 2 * GROUP_PAD;
const GROUP_H = ROD_H + 2 * GROUP_PAD;
const AFTER_GROUP = 20; // space between the big group and the extra sticks


const toneColor = (tone?: "a" | "b" | "c" | "good") =>
  tone === "b" ? palette.b : tone === "c" ? palette.c : tone === "good" ? palette.good : palette.a;

/** One base-ten "stick" (1 ten) — a single rod divided into 10 unit cells, drawn
 *  as one fused shape (not 10 separate dots, unlike TenGroups/TenFrame's
 *  bundle-of-dots convention) so this lab's visual matches the literal
 *  base-ten manipulative (a rod) named in 1.NBT's standards. */
function TensStick({ x, y, color, faded }: { x: number; y: number; color: string; faded?: boolean }) {
  return (
    <g opacity={faded ? 0.3 : 1}>
      <rect x={x} y={y} width={ROD_W} height={ROD_H} rx={3} style={{ fill: color, stroke: palette.paper }} strokeWidth={1.5} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={x} y1={y + (i + 1) * UNIT_H} x2={x + ROD_W} y2={y + (i + 1) * UNIT_H} style={{ stroke: palette.paper }} strokeWidth={1} opacity={0.8} />
      ))}
      {faded && (
        <g style={{ stroke: palette.bad }} strokeWidth={3} strokeLinecap="round">
          <line x1={x - 2} y1={y + 20} x2={x + ROD_W + 2} y2={y + ROD_H - 20} />
          <line x1={x + ROD_W + 2} y1={y + 20} x2={x - 2} y2={y + ROD_H - 20} />
        </g>
      )}
    </g>
  );
}

export interface BaseTenBlocksProps {
  /** 0-12 sticks (tens). */
  tens: number;
  /**
   * 0-19 loose cubes (ones) — deliberately allowed ABOVE 9 (not clamped), so
   * this same component can show 13 loose cubes before they make a new ten.
   */
  ones: number;
  tenTone?: "a" | "b" | "c";
  oneTone?: "a" | "b" | "c";
  /**
   * When the cubes number 10 or more, the first 10 get a dashed ring and a
   * "10 cubes make a new ten!" banner. Off by default.
   */
  flagOverflow?: boolean;
  /**
   * Optional number labels (round 1, C1-06). tens: "value" writes 10, 20, 30…
   * under the sticks, "count" writes 1, 2, 3…. ones: "count" numbers every cube
   * 1, 2, 3…; "total" keeps counting on from the sticks (31, 32, 33…). Explore
   * shows them; Practice shows them only as help (Show me), since a label can
   * be the answer. tens "group" (10+ sticks only): the big group is ONE item
   * labeled 100, then each extra stick 110, 120 (count on from 100); with
   * fewer than 10 sticks it acts like "value".
   */
  labels?: { tens?: "value" | "count" | "group"; ones?: "count" | "total" };
  /** Optional: the labels appear one at a time, about 1 second each (sticks first). */
  countAlong?: boolean;
  /**
   * Optional, with countAlong + labels.ones "count" + extraOnes (review C2-34):
   * count ON, not all. The starting cubes are numbered at once (1…7); then each
   * added cube appears and is numbered (8, 9, …), one per second.
   */
  countFrom?: boolean;
  /**
   * Called on each count-along tick with how many items are labeled so far (e.g.
   * to say the number). With countFrom, it gets the number just written on the
   * new cube (8, 9, …).
   */
  onCount?: (shown: number) => void;
  /** Called once a count-along or make-a-new-ten animation has finished. */
  onAnimDone?: () => void;
  /**
   * Optional: outline the part to look at (help after a wrong try). "group"
   * lights up the big group of 10 sticks (10+ sticks only).
   */
  ring?: "tens" | "ones" | "group";
  /** Optional, 10+ sticks: write "100" under the big group (help). */
  groupValue?: boolean;
  /** Optional: more cubes, drawn in tone c after the ones (the ones being added). */
  extraOnes?: number;
  /** Optional: this many of the last sticks are crossed out (taken away). */
  takeTens?: number;
  /**
   * Optional: animate "make a new ten": the first 10 cubes (ones + extraOnes)
   * are ringed, slide into a new stick, and the picture ends as tens + 1 sticks
   * and the cubes left over. Round 1 (C1-27).
   */
  bundle?: boolean;
}

/**
 * Base-ten blocks: fused sticks (tens) plus single cubes (ones) — the
 * concrete model this whole lab leans on so the tens/ones split is always
 * seen, never just stated.
 */
export function BaseTenBlocks({ tens, ones, tenTone, oneTone, flagOverflow, labels, countAlong, countFrom, onCount, onAnimDone, ring, groupValue, extraOnes = 0, takeTens = 0, bundle }: BaseTenBlocksProps) {
  const t0 = Math.max(0, Math.min(12, Math.round(tens)));
  const o0 = Math.max(0, Math.min(19, Math.round(ones)));
  const x0 = Math.max(0, Math.min(19 - o0, Math.round(extraOnes)));
  const allOnes = o0 + x0;
  const canBundle = !!bundle && allOnes >= 10 && t0 < 12;

  // make-a-new-ten animation: 0 = ringed, 1 = sliding, 2 = done.
  const [phase, setPhase] = useState(0);
  const doneRef = useRef(onAnimDone);
  const countRef = useRef(onCount);
  useEffect(() => {
    doneRef.current = onAnimDone;
    countRef.current = onCount;
  });
  useEffect(() => {
    setPhase(0);
    if (!canBundle) return;
    const a = window.setTimeout(() => setPhase(1), 900);
    const b = window.setTimeout(() => {
      setPhase(2);
      doneRef.current?.();
    }, BUNDLE_MS);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [canBundle, t0, o0, x0]);
  const bundled = canBundle && phase === 2;

  const t = bundled ? t0 + 1 : t0;
  const o = bundled ? allOnes - 10 : allOnes;
  // The cubes that are the "extra" (being added) ones, by index.
  const isExtra = (i: number) => !bundled && i >= o0;

  // Layout: reserve room for the new stick while a bundle plays, so nothing jumps.
  const layoutTens = canBundle ? t0 + 1 : t;
  // 10+ sticks: the first 10 are drawn as one big group (see GROUP_W).
  const grouped = layoutTens >= 10;
  const groupMode = grouped && labels?.tens === "group";

  // Count-along: labels appear one at a time.
  const speed = useTtsState().speed;
  const perMs = STEP_MS[speed];
  // Crossed-out (taken away) sticks get no label: the count is of what's left.
  // In "group" mode the big group is one item (100), then one per extra stick.
  const tensLabeled = !labels?.tens ? 0 : groupMode ? Math.max(0, t - takeTens - 9) : Math.max(0, t - takeTens);
  /** Which count item stick i's label is (sticks inside the group share item 0 in "group" mode). */
  const stickItem = (i: number) => (groupMode ? Math.max(0, i - 9) : i);
  const onesLabeled = labels?.ones ? o : 0;
  const items = tensLabeled + onesLabeled;
  // Count on (C2-34): everything before the added cubes is labeled at once,
  // and only the added cubes are ticked, appearing one at a time.
  const countingOn = !!countAlong && !!countFrom && labels?.ones === "count" && x0 > 0 && !bundled;
  const preLabeled = countingOn ? tensLabeled + o0 : 0;
  const tickItems = countingOn ? x0 : items;
  const [counted, setCounted] = useState(0);
  const shown = countAlong ? preLabeled + counted : items;
  useEffect(() => {
    if (!countAlong) return;
    setCounted(0);
    let k = 0;
    let iv: number | undefined;
    const lead = window.setTimeout(() => {
      const tick = () => {
        k += 1;
        setCounted(k);
        countRef.current?.(countingOn ? o0 + k : k);
        if (k >= tickItems) {
          window.clearInterval(iv);
          doneRef.current?.();
        }
      };
      tick();
      if (k < tickItems) iv = window.setInterval(tick, perMs);
    }, LEAD_IN_MS);
    return () => {
      window.clearTimeout(lead);
      window.clearInterval(iv);
    };
  }, [countAlong, tickItems, countingOn, o0, perMs]);
  // While counting on, an added cube is drawn only once its count is reached.
  const cubeHidden = (i: number) => countingOn && i >= o0 && i - o0 >= counted;
  // C2-35: 0 ones still gets a spot to look at. When help is about the ones
  // (ringed, or numbered on "Show me") and there are none, a dashed empty box
  // is drawn where the cubes would go, with a big "0" once they're "counted".
  const emptyOnes = o === 0 && !canBundle && (ring === "ones" || labels?.ones === "count");

  const hasTenLabels = !!labels?.tens || (grouped && !!groupValue);
  const stickRowH = ROD_H + GAP + (labels?.tens ? LABEL_H : 0);
  const tenRows = layoutTens === 0 ? 0 : Math.max(1, Math.ceil(layoutTens / PER_ROW_TENS));
  const tenAreaW = grouped
    ? GROUP_W + (layoutTens > 10 ? AFTER_GROUP + (layoutTens - 10) * (ROD_W + GAP) : 0)
    : Math.min(layoutTens, PER_ROW_TENS) * (ROD_W + GAP);
  const tenAreaH = grouped ? GROUP_H + GAP + (hasTenLabels ? LABEL_H : 0) : tenRows * stickRowH;
  const layoutOnes = canBundle ? allOnes : o;
  const onesRows = layoutOnes > PER_ROW_ONES ? 2 : layoutOnes > 0 || emptyOnes ? 1 : 0;
  const onesAreaW = Math.min(layoutOnes, PER_ROW_ONES) * (ONE + 6);
  const bannerH = (flagOverflow || canBundle) && allOnes > 9 ? 16 : 0;
  const onesAreaH = onesRows * (ONE + 8);
  const width = Math.max(tenAreaW, onesAreaW, 140) + 20;
  const height = tenAreaH + bannerH + onesAreaH + 30;

  const stickPos = (i: number) =>
    grouped
      ? i < 10
        ? { x: 10 + GROUP_PAD + i * (ROD_W + IN_GAP), y: 10 + GROUP_PAD }
        : { x: 10 + GROUP_W + AFTER_GROUP + (i - 10) * (ROD_W + GAP), y: 10 + GROUP_PAD }
      : { x: 10 + (i % PER_ROW_TENS) * (ROD_W + GAP), y: 10 + Math.floor(i / PER_ROW_TENS) * stickRowH };
  // Where a stick's label goes: under the stick (under the outline when grouped).
  const labelY = (i: number) => (grouped ? 10 + GROUP_H + 16 : stickPos(i).y + ROD_H + 14);
  const onesStartY = 10 + tenAreaH + bannerH;
  const cubePos = (i: number) => ({ x: 10 + (i % PER_ROW_ONES) * (ONE + 6), y: onesStartY + Math.floor(i / PER_ROW_ONES) * (ONE + 8) });

  const tenColor = toneColor(tenTone);
  const oneColor = toneColor(oneTone ?? "b");
  const showRingTens = ring === "tens" && t > 0;
  const litGroup = grouped && ring === "group";
  // "100" under the big group: as help (groupValue), or once counted in "group" mode.
  const showGroupValue = grouped && t >= 10 && (!!groupValue || (groupMode && shown > 0));
  const showRingOnes = ring === "ones" && o > 0;
  const ringedTen = (flagOverflow || canBundle) && !bundled && allOnes > 9;
  const newStick = stickPos(t0);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${t} stick${t === 1 ? "" : "s"} and ${o} cube${o === 1 ? "" : "s"}`}
      style={{ display: "block", width: "100%", maxWidth: width * 1.3, height: "auto", fontFamily: diagramFont }}
    >
      {grouped && (
        // The big group: one rounded outline around the first 10 sticks. Lit
        // up in violet (ring "group") as help.
        <rect
          x={9}
          y={9}
          width={GROUP_W + 2}
          height={GROUP_H + 2}
          rx={12}
          style={{ fill: litGroup ? palette.cSoft : palette.aSoft, stroke: litGroup ? palette.c : palette.a }}
          strokeWidth={litGroup ? 4 : 2.5}
        />
      )}
      {Array.from({ length: t }, (_, i) => {
        const p = stickPos(i);
        const faded = i >= t - takeTens;
        const label = labels?.tens === "count" ? i + 1 : (i + 1) * 10;
        // In "group" mode the sticks inside the group share one label (drawn below).
        const ownLabel = !!labels?.tens && !(groupMode && i < 10);
        return (
          <g key={`t${i}`}>
            <TensStick x={p.x} y={p.y} color={tenColor} faded={faded} />
            {ownLabel && stickItem(i) < shown && !faded && (
              <text x={p.x + ROD_W / 2} y={labelY(i)} textAnchor="middle" fontSize={groupMode ? 15 : label >= 100 ? 11 : 12} fontWeight={800} style={{ fill: palette.ink }}>
                {label}
              </text>
            )}
          </g>
        );
      })}
      {showGroupValue && (
        <text x={10 + GROUP_W / 2} y={10 + GROUP_H + 17} textAnchor="middle" fontSize={17} fontWeight={900} style={{ fill: litGroup ? palette.c : palette.ink }}>
          100
        </text>
      )}
      {showRingTens && (
        <rect
          x={4}
          y={4}
          width={grouped ? tenAreaW + 12 : Math.min(t, PER_ROW_TENS) * (ROD_W + GAP) + 2}
          height={grouped ? GROUP_H + 12 : Math.ceil(t / PER_ROW_TENS) * stickRowH}
          rx={10}
          fill="none"
          style={{ stroke: palette.c }}
          strokeWidth={3}
          strokeDasharray="6 4"
        />
      )}
      {ringedTen && (
        <text x={10} y={onesStartY - 5} fontSize={11} fontWeight={700} style={{ fill: palette.good }}>
          10 cubes make a new ten!
        </text>
      )}
      {emptyOnes && (
        <g>
          <rect x={10} y={onesStartY} width={ONE * 2 + 6} height={ONE} rx={4} fill="none" style={{ stroke: palette.c }} strokeWidth={2.5} strokeDasharray="5 4" />
          {labels?.ones === "count" && shown >= tensLabeled && (
            <text x={10 + ONE + 3} y={onesStartY + ONE / 2 + 6} textAnchor="middle" fontSize={17} fontWeight={900} style={{ fill: palette.ink }}>
              0
            </text>
          )}
        </g>
      )}
      {Array.from({ length: o }, (_, i) => {
        if (cubeHidden(i)) return null;
        const p = cubePos(i);
        const extra = isExtra(i);
        const flagged = ringedTen && i < 10;
        // While sliding, the 10 ringed cubes move onto the new stick's spot.
        const sliding = canBundle && phase === 1 && i < 10;
        const dx = sliding ? newStick.x - p.x : 0;
        const dy = sliding ? newStick.y + i * UNIT_H - p.y : 0;
        const labelIdx = tensLabeled + i;
        const label = labels?.ones === "total" ? t * 10 + i + 1 : i + 1;
        return (
          <g key={`${bundled ? "b" : "o"}${i}`} style={{ transform: `translate(${dx}px, ${dy}px)`, transition: "transform 0.9s ease-in-out" }}>
            <rect
              x={p.x}
              y={p.y}
              width={ONE}
              height={ONE}
              rx={4}
              style={{ fill: extra ? palette.c : oneColor, stroke: palette.paper }}
              strokeWidth={1.5}
            />
            {flagged && !sliding && <rect x={p.x - 3} y={p.y - 3} width={ONE + 6} height={ONE + 6} rx={6} fill="none" style={{ stroke: palette.good }} strokeWidth={2} strokeDasharray="3 3" />}
            {labels?.ones && labelIdx < shown && !sliding && (
              <text x={p.x + ONE / 2} y={p.y + ONE / 2 + 4} textAnchor="middle" fontSize={label >= 100 ? 8 : 10} fontWeight={800} style={{ fill: "var(--on-q, #ffffff)" }}>
                {label}
              </text>
            )}
          </g>
        );
      })}
      {showRingOnes && (
        <rect
          x={4}
          y={onesStartY - 5}
          width={Math.min(o, PER_ROW_ONES) * (ONE + 6) + 4}
          height={Math.ceil(o / PER_ROW_ONES) * (ONE + 8) + 2}
          rx={8}
          fill="none"
          style={{ stroke: palette.c }}
          strokeWidth={3}
          strokeDasharray="6 4"
        />
      )}
      {t === 0 && o === 0 && (
        <text x={width / 2} y={height / 2 + 5} textAnchor="middle" fontSize={13} style={{ fill: palette.muted }}>
          (none)
        </text>
      )}
    </svg>
  );
}
