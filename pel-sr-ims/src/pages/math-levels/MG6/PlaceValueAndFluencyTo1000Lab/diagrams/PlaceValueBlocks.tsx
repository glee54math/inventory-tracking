import { palette, diagramFont } from "../../../shared/lib/palette";

// Lab-local (not promoted to shared/diagrams/ this round — several sibling labs
// are being built into this same MG6 slot concurrently, per this build's scope
// guardrails). MG2/PlaceValueTo120Lab's BaseTenBlocks.tsx is the closest
// existing relative (same fused-rod convention for tens-sticks) but is capped
// at 12 tens / 19 ones with no hundreds place at all — Grade 1's 1.NBT scope
// never needs one. This file adds a hundreds-flat (a square subdivided into a
// 10x10 grid, the literal base-ten "flat" manipulative) alongside the same
// tens-stick/ones-cube shapes, extending the idea to 3-digit numbers. Promotion
// candidate once a second Grade-2/3 lab needs hundreds blocks — not acted on
// this round (see this lab's entry in VISUAL_COMPONENT_TODO.txt).

const ROD_W = 18;
const UNIT_H = 7; // each ten-stick is 10 stacked unit-cells this tall
const ROD_H = UNIT_H * 10;
const FLAT_SIZE = ROD_H; // a hundred-flat's side length matches a ten-stick's height,
// so 10 ten-sticks stacked would (roughly) tile one hundred-flat — not pixel-exact,
// but close enough to read as "ten of these make one of those" at a glance.
const GAP = 10;
const PER_ROW_HUNDREDS = 5;
const PER_ROW_TENS = 8;
const ONE = 16; // ones-cube side length
const PER_ROW_ONES = 10;

const toneColor = (tone?: "a" | "b" | "c" | "good") =>
  tone === "b" ? palette.b : tone === "c" ? palette.c : tone === "good" ? palette.good : palette.a;

/** One base-ten "hundred-flat" — a single square subdivided into a 10x10 grid,
 *  drawn as one fused shape (not 100 separate cells as distinct elements with
 *  their own fills) so this stays cheap to render even with several flats on
 *  screen at once. */
function HundredFlat({ x, y, color }: { x: number; y: number; color: string }) {
  const cell = FLAT_SIZE / 10;
  return (
    <g>
      <rect x={x} y={y} width={FLAT_SIZE} height={FLAT_SIZE} rx={3} fill={color} stroke={palette.paper} strokeWidth={1.5} />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <line x1={x} y1={y + (i + 1) * cell} x2={x + FLAT_SIZE} y2={y + (i + 1) * cell} stroke={palette.paper} strokeWidth={0.75} opacity={0.75} />
          <line x1={x + (i + 1) * cell} y1={y} x2={x + (i + 1) * cell} y2={y + FLAT_SIZE} stroke={palette.paper} strokeWidth={0.75} opacity={0.75} />
        </g>
      ))}
    </g>
  );
}

/** One base-ten "ten-stick" — same fused-rod shape as MG2's BaseTenBlocks. */
function TensStick({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={ROD_W} height={ROD_H} rx={3} fill={color} stroke={palette.paper} strokeWidth={1.5} />
      {Array.from({ length: 9 }, (_, i) => (
        <line key={i} x1={x} y1={y + (i + 1) * UNIT_H} x2={x + ROD_W} y2={y + (i + 1) * UNIT_H} stroke={palette.paper} strokeWidth={1} opacity={0.8} />
      ))}
    </g>
  );
}

export interface PlaceValueBlocksProps {
  /** 0-9 hundred-flats — this lab stays within 1000, so never more than 9. */
  hundreds: number;
  /** 0-19 ten-sticks — allowed above 9 (not clamped) so an "about to regroup"
   *  in-progress state (e.g. 13 loose tens before bundling into a new hundred)
   *  can be shown, same convention as BaseTenBlocks.ones. */
  tens: number;
  /** 0-19 loose ones-cubes, same above-9 allowance for the same reason. */
  ones: number;
  tone?: "a" | "b" | "c" | "good";
  /** Small caption under the picture, e.g. "347" or "3 hundreds, 4 tens, 7 ones". */
  caption?: string;
}

/**
 * Base-ten blocks for 3-digit numbers: hundred-flats + ten-sticks + ones-cubes,
 * all one `tone` (this lab shows one number's composition at a time, unlike
 * BaseTenBlocks' two-tone regroup-in-progress rendering, which this lab's own
 * CustomStep algorithm widget handles with its own digit boxes instead).
 */
export function PlaceValueBlocks({ hundreds, tens, ones, tone, caption }: PlaceValueBlocksProps) {
  const h = Math.max(0, Math.min(9, Math.round(hundreds)));
  const t = Math.max(0, Math.min(19, Math.round(tens)));
  const o = Math.max(0, Math.min(19, Math.round(ones)));
  const color = toneColor(tone);

  const hundredRows = h === 0 ? 0 : Math.ceil(h / PER_ROW_HUNDREDS);
  const hundredAreaW = Math.min(h, PER_ROW_HUNDREDS) * (FLAT_SIZE + GAP);
  const hundredAreaH = hundredRows * (FLAT_SIZE + GAP);

  const tenRows = t === 0 ? 0 : Math.max(1, Math.ceil(t / PER_ROW_TENS));
  const tenAreaW = Math.min(t, PER_ROW_TENS) * (ROD_W + GAP);
  const tenAreaH = tenRows * (ROD_H + GAP);

  const onesInFirstRow = Math.min(o, PER_ROW_ONES);
  const onesInSecondRow = Math.max(0, o - PER_ROW_ONES);
  const onesRows = o > PER_ROW_ONES ? 2 : o > 0 ? 1 : 0;
  const onesAreaW = Math.max(onesInFirstRow, onesInSecondRow) * (ONE + 6);
  const onesAreaH = onesRows * (ONE + 8);

  const width = Math.max(hundredAreaW, tenAreaW, onesAreaW, 140) + 20;
  const bodyHeight = hundredAreaH + tenAreaH + onesAreaH;
  const height = bodyHeight + (caption ? 26 : 10);

  const hundredPositions = Array.from({ length: h }, (_, i) => {
    const row = Math.floor(i / PER_ROW_HUNDREDS);
    const col = i % PER_ROW_HUNDREDS;
    return { x: 10 + col * (FLAT_SIZE + GAP), y: 10 + row * (FLAT_SIZE + GAP) };
  });
  const tenPositions = Array.from({ length: t }, (_, i) => {
    const row = Math.floor(i / PER_ROW_TENS);
    const col = i % PER_ROW_TENS;
    return { x: 10 + col * (ROD_W + GAP), y: 10 + hundredAreaH + row * (ROD_H + GAP) };
  });
  const onesStartY = 10 + hundredAreaH + tenAreaH;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${h} hundred-flat${h === 1 ? "" : "s"}, ${t} ten-stick${t === 1 ? "" : "s"}, and ${o} loose one${o === 1 ? "" : "s"}${caption ? `: ${caption}` : ""}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {hundredPositions.map((p, i) => <HundredFlat key={i} x={p.x} y={p.y} color={color} />)}
      {tenPositions.map((p, i) => <TensStick key={i} x={p.x} y={p.y} color={color} />)}
      {Array.from({ length: onesInFirstRow }, (_, i) => {
        const cx = 10 + i * (ONE + 6) + ONE / 2;
        const cy = onesStartY + ONE / 2;
        return <rect key={`one-a-${i}`} x={cx - ONE / 2} y={cy - ONE / 2} width={ONE} height={ONE} rx={3} fill={color} stroke={palette.paper} strokeWidth={1.5} />;
      })}
      {Array.from({ length: onesInSecondRow }, (_, i) => {
        const cx = 10 + i * (ONE + 6) + ONE / 2;
        const cy = onesStartY + (ONE + 8) + ONE / 2;
        return <rect key={`one-b-${i}`} x={cx - ONE / 2} y={cy - ONE / 2} width={ONE} height={ONE} rx={3} fill={color} stroke={palette.paper} strokeWidth={1.5} />;
      })}
      {h === 0 && t === 0 && o === 0 && (
        <text x={width / 2} y={bodyHeight / 2 + 10} textAnchor="middle" fontSize={13} fill={palette.muted}>
          (none)
        </text>
      )}
      {caption && (
        <text x={width / 2} y={height - 8} textAnchor="middle" fontSize={13} fontWeight={700} fill={palette.muted}>
          {caption}
        </text>
      )}
    </svg>
  );
}

const TEN_CHIP_W = 30;
const TEN_CHIP_H = 20;

/** One small labeled "ten" chip for the equal-groups array below — a flattened
 *  stand-in for a full ten-stick, sized to tile into a compact groups-x-count
 *  array without the picture ballooning once both numbers get into the 8-9 range. */
function TenChip({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={TEN_CHIP_W} height={TEN_CHIP_H} rx={4} fill={color} stroke={palette.paper} strokeWidth={1.5} />
      <text x={x + TEN_CHIP_W / 2} y={y + TEN_CHIP_H / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={700} fill={palette.paper}>
        10
      </text>
    </g>
  );
}

export interface TensGroupArrayProps {
  /** How many equal groups (the one-digit factor), 1-9. */
  groups: number;
  /** How many ten-chips in each group (the other one-digit factor), 1-9. */
  perGroup: number;
  tone?: "a" | "b" | "c";
  caption?: string;
}

/**
 * An array model for "N groups of M tens" (3.NBT.3's multiply-by-a-multiple-
 * of-ten strategy): `groups` rows, each holding `perGroup` ten-chips, so the
 * total ten-chip count visibly IS the one-digit fact (groups x perGroup)
 * before that count gets relabeled as a multiple of ten. Deliberately
 * row-per-group (not one long strip) so the one-digit array structure this
 * strategy leans on — the same structure used for plain one-digit
 * multiplication — stays visible, not just the final tally.
 */
export function TensGroupArray({ groups, perGroup, tone, caption }: TensGroupArrayProps) {
  const g = Math.max(1, Math.min(9, Math.round(groups)));
  const m = Math.max(1, Math.min(9, Math.round(perGroup)));
  const color = tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a;
  const rowGap = 8;
  const colGap = 6;
  const width = m * (TEN_CHIP_W + colGap) + 10;
  const bodyHeight = g * (TEN_CHIP_H + rowGap);
  const height = bodyHeight + (caption ? 24 : 6);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${g} groups of ${m} tens${caption ? `: ${caption}` : ""}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {Array.from({ length: g }, (_, row) =>
        Array.from({ length: m }, (_, col) => (
          <TenChip key={`${row}-${col}`} x={5 + col * (TEN_CHIP_W + colGap)} y={5 + row * (TEN_CHIP_H + rowGap)} color={color} />
        ))
      )}
      {caption && (
        <text x={width / 2} y={height - 6} textAnchor="middle" fontSize={13} fontWeight={700} fill={palette.muted}>
          {caption}
        </text>
      )}
    </svg>
  );
}
