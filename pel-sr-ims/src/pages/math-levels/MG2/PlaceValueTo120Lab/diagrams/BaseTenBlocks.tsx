import { palette, diagramFont } from "../../../shared/lib/palette";

const ROD_W = 22;
const UNIT_H = 13; // each ten-stick is 10 stacked unit-cells this tall
const ROD_H = UNIT_H * 10;
const GAP = 10;
const PER_ROW_TENS = 6; // sticks wrap after this many (120 = 12 tens, so up to 2 rows)
const ONE = 20; // ones-cube side length
const PER_ROW_ONES = 10;

const toneColor = (tone?: "a" | "b" | "c" | "good") =>
  tone === "b" ? palette.b : tone === "c" ? palette.c : tone === "good" ? palette.good : palette.a;

/** One base-ten "tens-stick" — a single rod divided into 10 unit cells, drawn
 *  as one fused shape (not 10 separate dots, unlike TenGroups/TenFrame's
 *  bundle-of-dots convention) so this lab's visual matches the literal
 *  base-ten manipulative (a rod) named in 1.NBT's standards and this lab's
 *  audience framing. */
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
  /** 0-12 tens-sticks. */
  tens: number;
  /**
   * 0-19 loose ones-cubes — deliberately allowed ABOVE 9 (not clamped), so
   * this same component can show an un-bundled "about to regroup" state
   * (e.g. 13 loose ones, not yet turned into a new ten) for Adding a 2-Digit
   * and 1-Digit Number's regrouping case, not just the normal 0-9 range
   * every other unit uses.
   */
  ones: number;
  tenTone?: "a" | "b" | "c";
  oneTone?: "a" | "b" | "c";
  /**
   * When `ones` is 10 or more, the first 10 of them render with a dashed
   * "good"-toned ring and a small "10!" badge — flagging "this group is
   * ready to bundle into a brand new ten" — instead of just looking like an
   * undifferentiated pile of 13 loose cubes. Off by default so the plain
   * 0-9 case (every unit except the regrouping one) never shows a ring that
   * has nothing to do with its question.
   */
  flagOverflow?: boolean;
}

/**
 * Base-ten blocks: fused ten-rods ("tens-sticks") plus individual unit
 * squares ("ones-cubes") — the concrete manipulative this whole lab leans
 * on so the tens/ones split is always seen, never just stated, before any
 * "24 = 2 tens + 4 ones" symbolic notation appears. Used by Tens and Ones
 * (the primary decomposition visual) and reused by Ten More/Ten Less and
 * Adding a 2-Digit and 1-Digit Number wherever a problem's intermediate
 * tens/ones state needs showing, not just its final numeral.
 */
export function BaseTenBlocks({ tens, ones, tenTone, oneTone, flagOverflow }: BaseTenBlocksProps) {
  const t = Math.max(0, Math.min(12, Math.round(tens)));
  const o = Math.max(0, Math.min(19, Math.round(ones)));
  const tenColor = toneColor(tenTone);
  const oneColor = toneColor(oneTone ?? "b");

  const tenRows = t === 0 ? 0 : Math.max(1, Math.ceil(t / PER_ROW_TENS));
  const tenAreaW = Math.min(t, PER_ROW_TENS) * (ROD_W + GAP);
  const tenAreaH = tenRows * (ROD_H + GAP);

  const onesInFirstRow = Math.min(o, PER_ROW_ONES);
  const onesInSecondRow = Math.max(0, o - PER_ROW_ONES);
  const onesRows = o > PER_ROW_ONES ? 2 : o > 0 ? 1 : 0;
  const onesAreaW = Math.max(onesInFirstRow, onesInSecondRow) * (ONE + 6);
  const onesAreaH = onesRows * (ONE + 8);

  const width = Math.max(tenAreaW, onesAreaW, 140) + 20;
  const height = tenAreaH + onesAreaH + 30;

  const tenPositions = Array.from({ length: t }, (_, i) => {
    const row = Math.floor(i / PER_ROW_TENS);
    const col = i % PER_ROW_TENS;
    return { x: 10 + col * (ROD_W + GAP), y: 10 + row * (ROD_H + GAP) };
  });
  const onesStartY = 10 + tenAreaH;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${t} ten-stick${t === 1 ? "" : "s"} and ${o} loose one${o === 1 ? "" : "s"}`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {tenPositions.map((p, i) => <TensStick key={i} x={p.x} y={p.y} color={tenColor} />)}
      {Array.from({ length: onesInFirstRow }, (_, i) => {
        const cx = 10 + i * (ONE + 6) + ONE / 2;
        const cy = onesStartY + ONE / 2;
        const flagged = flagOverflow && o > 9 && i < 10;
        return (
          <g key={`one-a-${i}`}>
            <rect x={cx - ONE / 2} y={cy - ONE / 2} width={ONE} height={ONE} rx={4} fill={oneColor} stroke={palette.paper} strokeWidth={1.5} />
            {flagged && <rect x={cx - ONE / 2 - 3} y={cy - ONE / 2 - 3} width={ONE + 6} height={ONE + 6} rx={6} fill="none" stroke={palette.good} strokeWidth={2} strokeDasharray="3 3" />}
          </g>
        );
      })}
      {Array.from({ length: onesInSecondRow }, (_, i) => {
        const cx = 10 + i * (ONE + 6) + ONE / 2;
        const cy = onesStartY + (ONE + 8) + ONE / 2;
        return <rect key={`one-b-${i}`} x={cx - ONE / 2} y={cy - ONE / 2} width={ONE} height={ONE} rx={4} fill={oneColor} stroke={palette.paper} strokeWidth={1.5} />;
      })}
      {flagOverflow && o > 9 && (
        <text x={10} y={onesStartY - 4} fontSize={11} fontWeight={700} fill={palette.good}>
          10 ones — ready to bundle into a new ten!
        </text>
      )}
      {t === 0 && o === 0 && (
        <text x={width / 2} y={height / 2 + 5} textAnchor="middle" fontSize={13} fill={palette.muted}>
          (none)
        </text>
      )}
    </svg>
  );
}
