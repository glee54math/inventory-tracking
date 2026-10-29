import { palette, diagramFont } from "../../../shared/lib/palette";

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
