import { palette, diagramFont } from "../../../shared/lib/palette";

// Lab-local (not promoted — first consumer of a HUNDREDS flat alongside the
// tens-stick/ones-cube shapes MG2's own BaseTenBlocks.tsx already established
// for 1.NBT). Deliberately NOT importing MG2's version: that component caps
// tens at 12 and has no hundreds flat at all, and per this project's own
// "promote on the second real consumer" convention (not acted on this round
// — see MATH_TSX_STYLE_GUIDE.txt section 10), a near-verbatim lab-local copy
// is the established pattern, not a shared import.

const FLAT = 92; // one hundred-flat's side length (10x10 grid of unit cells)
const FLAT_CELL = FLAT / 10;
const ROD_W = 20;
const UNIT_H = 11; // each ten-stick is 10 stacked unit-cells this tall
const ROD_H = UNIT_H * 10;
const ONE = 18; // ones-cube side length
const GAP = 10;
const PER_ROW_HUNDREDS = 5;
const PER_ROW_TENS = 6;
const PER_ROW_ONES = 10;

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);

/** One hundred-flat: a 10x10 grid of unit cells drawn as one fused shape,
 *  the literal base-ten manipulative for "a hundred" — not 10 separate
 *  tens-sticks, so a hundred always reads as ONE thing, consistent with
 *  "100 is one flat" even though Explore can also show it AS 10 rods
 *  (see HundredsTensOnes.tsx's own toggle, which renders 10 TensStick-shaped
 *  rods directly rather than through this component). */
function HundredFlat({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={FLAT} height={FLAT} rx={3} fill={color} stroke={palette.paper} strokeWidth={1.5} />
      {Array.from({ length: 9 }, (_, i) => (
        <g key={i}>
          <line x1={x} y1={y + (i + 1) * FLAT_CELL} x2={x + FLAT} y2={y + (i + 1) * FLAT_CELL} stroke={palette.paper} strokeWidth={0.75} opacity={0.7} />
          <line x1={x + (i + 1) * FLAT_CELL} y1={y} x2={x + (i + 1) * FLAT_CELL} y2={y + FLAT} stroke={palette.paper} strokeWidth={0.75} opacity={0.7} />
        </g>
      ))}
    </g>
  );
}

/** One tens-stick: a rod divided into 10 unit cells, fused (not 10 dots). */
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

export interface BaseTenBlocksProps {
  /** 0-9 hundred-flats. */
  hundreds: number;
  /** 0-39 tens-sticks — allowed well above 9 so this component can show an
   *  un-bundled "23 loose tens, not yet regrouped" state (the regroup
   *  bucket's starting picture, per the plan's own "23 tens"/"15 tens"
   *  examples) alongside the normal 0-9 range every other bucket uses. */
  tens: number;
  /** 0-19 loose ones-cubes — same above-9 allowance, for symmetry/future use;
   *  every bucket in this lab keeps ones at 0-9 today. */
  ones: number;
  hundredTone?: "a" | "b" | "c";
  tenTone?: "a" | "b" | "c";
  oneTone?: "a" | "b" | "c";
  /** When `tens` is 10+, the first 10 render with a dashed "ready to bundle
   *  into a new hundred" ring — same treatment MG2's BaseTenBlocks uses for
   *  an overflowing ones pile, applied one place up. */
  flagOverflowTens?: boolean;
}

/**
 * Hundred-flats + tens-sticks + ones-cubes — the concrete manipulative this
 * whole lab leans on so the hundreds/tens/ones split is always SEEN, not
 * just stated, before "342 = 3 hundreds + 4 tens + 2 ones" symbolic notation
 * appears. Used by Hundreds/Tens/Ones (the primary decomposition visual) and
 * reused by Comparing Three-Digit Numbers for its side-by-side block compare.
 */
export function BaseTenBlocks({ hundreds, tens, ones, hundredTone, tenTone, oneTone, flagOverflowTens }: BaseTenBlocksProps) {
  const h = Math.max(0, Math.min(9, Math.round(hundreds)));
  const t = Math.max(0, Math.min(39, Math.round(tens)));
  const o = Math.max(0, Math.min(19, Math.round(ones)));
  const hundredColor = toneColor(hundredTone ?? "a");
  const tenColor = toneColor(tenTone ?? "b");
  const oneColor = toneColor(oneTone ?? "c");

  const hundredRows = h === 0 ? 0 : Math.ceil(h / PER_ROW_HUNDREDS);
  const hundredAreaW = Math.min(h, PER_ROW_HUNDREDS) * (FLAT + GAP);
  const hundredAreaH = hundredRows * (FLAT + GAP);

  const tenRows = t === 0 ? 0 : Math.ceil(t / PER_ROW_TENS);
  const tenAreaW = Math.min(t, PER_ROW_TENS) * (ROD_W + GAP);
  const tenAreaH = tenRows * (ROD_H + GAP);

  const onesInFirstRow = Math.min(o, PER_ROW_ONES);
  const onesInSecondRow = Math.max(0, o - PER_ROW_ONES);
  const onesRows = o > PER_ROW_ONES ? 2 : o > 0 ? 1 : 0;
  const onesAreaW = Math.max(onesInFirstRow, onesInSecondRow) * (ONE + 6);
  const onesAreaH = onesRows * (ONE + 8);

  const width = Math.max(hundredAreaW, tenAreaW, onesAreaW, 140) + 20;
  const height = hundredAreaH + tenAreaH + onesAreaH + 30;

  const hundredPositions = Array.from({ length: h }, (_, i) => {
    const row = Math.floor(i / PER_ROW_HUNDREDS);
    const col = i % PER_ROW_HUNDREDS;
    return { x: 10 + col * (FLAT + GAP), y: 10 + row * (FLAT + GAP) };
  });
  const tensStartY = 10 + hundredAreaH;
  const tenPositions = Array.from({ length: t }, (_, i) => {
    const row = Math.floor(i / PER_ROW_TENS);
    const col = i % PER_ROW_TENS;
    return { x: 10 + col * (ROD_W + GAP), y: tensStartY + row * (ROD_H + GAP) };
  });
  const onesStartY = tensStartY + tenAreaH;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${h} hundred-flat${h === 1 ? "" : "s"}, ${t} ten-stick${t === 1 ? "" : "s"} and ${o} loose one${o === 1 ? "" : "s"}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {hundredPositions.map((p, i) => (
        <HundredFlat key={`h-${i}`} x={p.x} y={p.y} color={hundredColor} />
      ))}
      {tenPositions.map((p, i) => {
        const flagged = flagOverflowTens && t > 9 && i < 10;
        return (
          <g key={`t-${i}`}>
            <TensStick x={p.x} y={p.y} color={tenColor} />
            {flagged && <rect x={p.x - 3} y={p.y - 3} width={ROD_W + 6} height={ROD_H + 6} rx={6} fill="none" stroke={palette.good} strokeWidth={2} strokeDasharray="3 3" />}
          </g>
        );
      })}
      {Array.from({ length: onesInFirstRow }, (_, i) => {
        const cx = 10 + i * (ONE + 6) + ONE / 2;
        const cy = onesStartY + ONE / 2;
        return <rect key={`o-a-${i}`} x={cx - ONE / 2} y={cy - ONE / 2} width={ONE} height={ONE} rx={4} fill={oneColor} stroke={palette.paper} strokeWidth={1.5} />;
      })}
      {Array.from({ length: onesInSecondRow }, (_, i) => {
        const cx = 10 + i * (ONE + 6) + ONE / 2;
        const cy = onesStartY + (ONE + 8) + ONE / 2;
        return <rect key={`o-b-${i}`} x={cx - ONE / 2} y={cy - ONE / 2} width={ONE} height={ONE} rx={4} fill={oneColor} stroke={palette.paper} strokeWidth={1.5} />;
      })}
      {flagOverflowTens && t > 9 && (
        <text x={10} y={tensStartY - 4} fontSize={11} fontWeight={700} fill={palette.good}>
          10 tens — ready to bundle into a new hundred!
        </text>
      )}
      {h === 0 && t === 0 && o === 0 && (
        <text x={width / 2} y={height / 2 + 5} textAnchor="middle" fontSize={13} fill={palette.muted}>
          (none)
        </text>
      )}
    </svg>
  );
}
