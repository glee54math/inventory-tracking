import { palette, diagramFont } from "../../../shared/lib/palette";

/** A dashed empty spot with an arrow pointing at it, for a part that is 0.
 *  The big 0 appears only on Show me. */
export function ZeroSpot({ showZero = false }: { showZero?: boolean }) {
  return (
    <svg viewBox="0 0 84 112" role="img" aria-label={showZero ? "An empty spot. Zero." : "An empty spot"} style={{ display: "block", width: 84, height: 112, flex: "0 0 auto", fontFamily: diagramFont }}>
      <path d="M42 4 V24 M33 16 L42 26 L51 16" fill="none" stroke={palette.c} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
      <rect x={8} y={32} width={68} height={72} rx={14} fill="none" stroke={palette.c} strokeWidth={3} strokeDasharray="7 5" />
      {showZero && (
        <text x={42} y={85} textAnchor="middle" fontSize={46} fontWeight={800} fill={palette.c}>
          0
        </text>
      )}
    </svg>
  );
}
