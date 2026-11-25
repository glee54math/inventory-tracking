import { palette, diagramFont } from "../../../shared/lib/palette";
import { useCountAlong } from "./SortedBins";

/**
 * A single object rendered big enough to look at and describe — the visual
 * for K.MD.1's single-object attribute questions. Deliberately just an
 * emoji glyph plus its name, not a measured drawing: K.MD.1 asks a student
 * to name/describe an attribute (long/short, heavy/light), never to measure
 * one, so there's nothing to depict beyond "here is the object."
 */
export function ObjectGlyph({ glyph, name, big }: { glyph: string; name: string; big?: boolean }) {
  const size = big ? 64 : 48;
  return (
    <svg
      viewBox="0 0 160 110"
      role="img"
      aria-label={name}
      style={{ display: "block", width: "100%", maxWidth: 220, height: "auto", fontFamily: diagramFont }}
    >
      <text x={80} y={60} textAnchor="middle" fontSize={size}>
        {glyph}
      </text>
      <text x={80} y={100} textAnchor="middle" fontSize={14} fontWeight={700} fill={palette.ink}>
        {name}
      </text>
    </svg>
  );
}

/** A describing word shown on its own, large — used by the vocabMatch
 *  bucket (K.MD.1's "which attribute does this word refer to" questions). */
export function WordCard({ word }: { word: string }) {
  return (
    <svg
      viewBox="0 0 220 90"
      role="img"
      aria-label={`The word "${word}"`}
      style={{ display: "block", width: "100%", maxWidth: 260, height: "auto", fontFamily: diagramFont }}
    >
      <rect x={4} y={4} width={212} height={82} rx={16} fill={palette.cSoft} stroke={palette.c} strokeWidth={2} />
      <text x={110} y={54} textAnchor="middle" fontSize={28} fontWeight={700} fill={palette.ink}>
        "{word}"
      </text>
    </svg>
  );
}

/**
 * One object drawn about as wide as the row of plain blocks under it. A
 * reference block sits in its own small box, up and away from the row, drawn
 * white so it is never counted with the row (review D1, C2-39).
 */
export function ObjectOnBlocks({ glyph, name, blocks, ring, countAlong, numbered }: { glyph: string; name: string; blocks: number; ring?: boolean; countAlong?: boolean; numbered?: boolean }) {
  const size = 20;
  const gap = 2;
  const rowY = 146;
  const rowW = blocks * (size + gap) - gap;
  const x0 = 170 - rowW / 2;
  const fontSize = Math.max(24, Math.min(120, rowW * 0.85));
  const shown = useCountAlong(!!countAlong, blocks);
  return (
    <svg viewBox="0 0 280 198" role="img" aria-label={`${name} above a row of blocks`} style={{ display: "block", width: "100%", maxWidth: 340, height: "auto", fontFamily: diagramFont }}>
      <text x={170} y={rowY - 4 - fontSize * 0.2} textAnchor="middle" fontSize={fontSize}>
        {glyph}
      </text>
      {Array.from({ length: blocks }, (_, k) => (
        <g key={k}>
          <rect x={x0 + k * (size + gap)} y={rowY} width={size} height={size} rx={3} fill={palette.a} stroke={palette.paper} strokeWidth={1} />
          {(numbered || k < shown) && (
            <text x={x0 + k * (size + gap) + size / 2} y={rowY + 15} textAnchor="middle" fontSize={12} fontWeight={800} fill="#fff">
              {k + 1}
            </text>
          )}
        </g>
      ))}
      {ring && <rect x={x0 - 4} y={rowY - 4} width={rowW + 8} height={size + 8} rx={6} fill="none" stroke={palette.ink} strokeWidth={2.5} />}
      <rect x={8} y={8} width={56} height={56} rx={8} fill="none" stroke={palette.line} strokeWidth={1.5} />
      <rect x={26} y={15} width={size} height={size} rx={3} fill="#fff" stroke={palette.muted} strokeWidth={2} />
      <text x={36} y={54} textAnchor="middle" fontSize={12} fontWeight={700} fill={palette.muted}>
        block
      </text>
      <text x={170} y={188} textAnchor="middle" fontSize={15} fontWeight={700} fill={palette.ink}>
        {name}
      </text>
    </svg>
  );
}

export type DescribeWord = "long" | "short" | "tall" | "heavy" | "light";

/** A small picture of a describing word, for picture answer buttons (review D4). */
export function WordPicture({ word }: { word: DescribeWord }) {
  const block = (x: number, y: number, key: number) => <rect key={key} x={x} y={y} width={13} height={13} rx={2} fill={palette.a} />;
  const isScale = word === "heavy" || word === "light";
  const tilt = 12;
  return (
    <svg viewBox="0 0 110 76" role="img" aria-label={isScale ? "a scale" : "a rod"} style={{ display: "block", width: 110, height: 76 }}>
      {word === "long" && Array.from({ length: 7 }, (_, i) => block(4 + i * 15, 32, i))}
      {word === "short" && Array.from({ length: 2 }, (_, i) => block(40 + i * 15, 32, i))}
      {word === "tall" && Array.from({ length: 5 }, (_, i) => block(48, 60 - i * 14, i))}
      {isScale && (
        <g>
          <polygon points="49,72 61,72 55,30" fill={palette.grid} stroke={palette.line} strokeWidth={1.5} />
          <line x1={17} y1={30 + tilt} x2={93} y2={30 - tilt} stroke={palette.ink} strokeWidth={3} />
          <rect x={9} y={30 + tilt - 16} width={15} height={15} rx={2} fill={palette.c} />
          <rect x={86} y={30 - tilt - 11} width={10} height={10} rx={2} fill={palette.b} />
          {/* The arrow points the way that side moved: heavy down, light up. */}
          {word === "heavy" ? (
            <path transform="translate(10, 6) scale(0.62)" d="M6 0h10v14h6L11 28 0 14h6z" fill="#f59e0b" stroke="#fff" strokeWidth={1.5} />
          ) : (
            <path transform="translate(85, 25) scale(0.62)" d="M11 0l11 14h-6v14H6V14H0z" fill="#f59e0b" stroke="#fff" strokeWidth={1.5} />
          )}
        </g>
      )}
    </svg>
  );
}
