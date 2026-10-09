import React from "react";
import { palette } from "../../shared/lib/palette";

export interface UnitAmount {
  value: number | string;
  unit: string;
  color?: string;
  /**
   * When set, `value` is struck through and this replacement is shown right
   * after it — e.g. 90 reduced to 3 once a student has simplified 90/60 to
   * 3/2. Independent of `showCancel`'s unit strikethrough, which crosses out
   * the UNIT label when it cancels against a matching unit elsewhere in the
   * chain; this crosses out the NUMBER when it's been reduced by a common
   * factor, same spirit as a hand-worked fraction simplification.
   */
  simplifiedValue?: number | string;
}

export interface ConversionFactor {
  num: UnitAmount;
  den: UnitAmount;
}

export interface ConversionChainProps {
  start: UnitAmount;
  factors: ConversionFactor[];
  /** Shown after "=". Use value "?" to hide the answer. */
  result?: UnitAmount;
  /** Strike through units that appear on top and bottom. */
  showCancel?: boolean;
}

const unitStyle = (struck: boolean, color?: string): React.CSSProperties => ({
  color: color ?? palette.ink,
  textDecoration: struck ? "line-through" : "none",
  textDecorationColor: palette.bad,
  textDecorationThickness: 3,
  opacity: struck ? 0.55 : 1,
  transition: "opacity .3s",
});

/**
 * "3 ft × (12 in / 1 ft) = 36 in" with units that cancel struck out.
 * Works for unit conversions and for rate × time style products.
 */
export function ConversionChain({ start, factors, result, showCancel = true }: ConversionChainProps) {
  // Decide which units cancel: each denominator unit cancels one matching numerator unit.
  const numUnits = [start.unit, ...factors.map((f) => f.num.unit)];
  const numStruck = numUnits.map(() => false);
  const denStruck = factors.map(() => false);
  if (showCancel) {
    factors.forEach((f, d) => {
      const i = numUnits.findIndex((u, k) => u === f.den.unit && !numStruck[k]);
      if (i >= 0) {
        numStruck[i] = true;
        denStruck[d] = true;
      }
    });
  }

  const box: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "center", fontSize: 20, fontWeight: 600, color: palette.ink };
  const frac: React.CSSProperties = { display: "inline-flex", flexDirection: "column", alignItems: "center", lineHeight: 1.2 };
  const bar: React.CSSProperties = { alignSelf: "stretch", height: 2, background: palette.ink, margin: "3px 0" };
  const amt = (a: UnitAmount, struck: boolean) => (
    <span style={{ whiteSpace: "nowrap" }}>
      <span
        style={{
          color: a.color ?? palette.ink,
          fontVariantNumeric: "tabular-nums",
          textDecoration: a.simplifiedValue !== undefined ? "line-through" : "none",
          textDecorationColor: palette.bad,
          textDecorationThickness: 3,
          opacity: a.simplifiedValue !== undefined ? 0.55 : 1,
        }}
      >
        {a.value}
      </span>
      {a.simplifiedValue !== undefined && <span style={{ color: palette.good, fontWeight: 800 }}> {a.simplifiedValue}</span>}{" "}
      <span style={unitStyle(struck, a.color)}>{a.unit}</span>
    </span>
  );

  return (
    <div style={{ textAlign: "center" }}>
      <div style={box} role="math">
        {amt(start, numStruck[0])}
        {factors.map((f, i) => (
          <React.Fragment key={i}>
            <span style={{ color: palette.muted }}>×</span>
            <span style={frac}>
              {amt(f.num, numStruck[i + 1])}
              <span style={bar} />
              {amt(f.den, denStruck[i])}
            </span>
          </React.Fragment>
        ))}
        {result && (
          <>
            <span style={{ color: palette.muted }}>=</span>
            <span style={{ color: result.value === "?" ? palette.bad : palette.good, fontWeight: 800 }}>
              {result.value} {result.unit}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
