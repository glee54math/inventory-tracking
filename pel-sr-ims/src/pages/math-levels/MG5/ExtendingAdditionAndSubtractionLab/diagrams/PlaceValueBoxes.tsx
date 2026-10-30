import { palette } from "../../../shared/lib/palette";
import type { TenHundredShift } from "../logic";

const PLACE_LABEL: Record<number, string> = { 4: "th", 3: "h", 2: "h", 1: "t", 0: "o" };

/**
 * A number's digit boxes, before and after a ±10/±100 mental-math move, with
 * an arrow between them. Every digit that changed is tinted; a digit that
 * changed WITHOUT being the one `delta` directly targets (the ripple into a
 * new hundred/thousand) gets a second, stronger highlight — the direct
 * visual for the misconception Unit 4's plan calls out: adjusting only the
 * tens digit and not letting a carry/borrow ripple into the hundreds digit.
 * Renders straight off `TenHundredShift` (logic.ts) so the picture and the
 * graded answer share one source of truth.
 */
export function PlaceValueBoxes({ shift, showAfter }: { shift: TenHundredShift; showAfter: boolean }) {
  const { before, after, delta } = shift;
  const len = before.length;
  const directIdxFromRight = Math.abs(delta) === 10 ? 1 : 2;

  const boxes = (digits: number[], compareWith: number[] | null) => (
    <div style={{ display: "flex", gap: 4 }}>
      {digits.map((d, i) => {
        const idxFromRight = len - 1 - i;
        const changed = compareWith ? compareWith[i] !== d : false;
        const isDirect = idxFromRight === directIdxFromRight;
        const isRipple = changed && !isDirect;
        return (
          <div
            key={i}
            style={{
              width: 38,
              height: 38,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              border: `2px solid ${isRipple ? palette.c : isDirect && changed ? palette.a : palette.line}`,
              background: isRipple ? palette.cSoft : isDirect && changed ? palette.aSoft : palette.paper,
              fontWeight: 700,
              fontSize: 20,
            }}
          >
            <span>{d}</span>
            <span style={{ fontSize: 9, color: palette.muted, fontWeight: 400 }}>{PLACE_LABEL[idxFromRight] ?? ""}</span>
          </div>
        );
      })}
    </div>
  );

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }} role="img" aria-label={`${shift.n} ${delta > 0 ? "plus" : "minus"} ${Math.abs(delta)}${showAfter ? ` equals ${shift.result}` : ""}`}>
      {boxes(before, null)}
      <span style={{ fontSize: 22, color: palette.muted, fontWeight: 700 }} aria-hidden>
        {delta > 0 ? "+" : "−"}
        {Math.abs(delta)} →
      </span>
      {showAfter ? boxes(after, before) : <span style={{ fontSize: 22 }}>?</span>}
    </div>
  );
}
