import { palette } from "../../../shared/lib/palette";

/**
 * Hundreds-flats + tens-rods + ones-cubes, the literal base-ten manipulative
 * named in 2.NBT's standards — kept visible through Unit 3's harder
 * regrouping cases per the lab's audience framing (a first-time learner
 * shouldn't jump straight from "stack and carry digits" to "into the
 * hundreds" with no concrete picture backing it up). Each place is already a
 * single 0-9 digit by the time it gets here (Unit 3 never has more than 9 of
 * any one block), so there's no overflow/regroup logic to compute inside
 * this component itself — regrouping is shown by the CALLER changing which
 * counts it passes (e.g. 13 tens rendered as 1 hundred + 3 tens once traded).
 */
export function BaseTenBlocks({ hundreds, tens, ones, toneHundreds = palette.c, toneTens = palette.a, toneOnes = palette.b }: { hundreds: number; tens: number; ones: number; toneHundreds?: string; toneTens?: string; toneOnes?: string }) {
  const h = Math.max(0, Math.min(9, Math.round(hundreds)));
  const t = Math.max(0, Math.min(9, Math.round(tens)));
  const o = Math.max(0, Math.min(9, Math.round(ones)));
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "flex-end" }} role="img" aria-label={`${h} hundreds, ${t} tens, ${o} ones in base-ten blocks`}>
      {h > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {Array.from({ length: h }, (_, i) => (
            <svg key={i} width={54} height={54} viewBox="0 0 54 54" aria-hidden>
              {Array.from({ length: 10 }, (_, r) =>
                Array.from({ length: 10 }, (_, c) => <rect key={`${r}-${c}`} x={c * 5.2} y={r * 5.2} width={5} height={5} fill={toneHundreds} stroke={palette.paper} strokeWidth={0.4} />)
              )}
            </svg>
          ))}
        </div>
      )}
      {t > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "flex-end" }}>
          {Array.from({ length: t }, (_, i) => (
            <svg key={i} width={10} height={54} viewBox="0 0 10 54" aria-hidden>
              {Array.from({ length: 10 }, (_, r) => <rect key={r} x={0} y={r * 5.2} width={9} height={5} fill={toneTens} stroke={palette.paper} strokeWidth={0.4} />)}
            </svg>
          ))}
        </div>
      )}
      {o > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 3, alignItems: "flex-end", maxWidth: 60 }}>
          {Array.from({ length: o }, (_, i) => (
            <span key={i} style={{ display: "inline-block", width: 9, height: 9, background: toneOnes, border: `0.4px solid ${palette.paper}`, borderRadius: 1 }} />
          ))}
        </div>
      )}
      {h === 0 && t === 0 && o === 0 && <span className="muted small">(zero)</span>}
    </div>
  );
}
