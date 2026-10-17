import { palette } from "../../../shared/lib/palette";

export interface PlaceValueColumnsProps {
  operation: "add" | "subtract" | "multiply";
  top: number;
  bottom: number;
  /** 0 = just the aligned problem; 1 = reveal the computed result. */
  done: number;
}

/** Pads a decimal to `places` digits after the point (adds trailing zeros, no rounding beyond that). */
const padDecimals = (n: number, places: number): string => {
  const [whole, frac = ""] = Math.abs(n).toString().split(".");
  return `${whole}.${frac.padEnd(places, "0")}`;
};

/** Aligned place-value columns for decimal +, −, × — the standard-algorithm visual for 6.NS.3. */
export function PlaceValueColumns({ operation, top, bottom, done }: PlaceValueColumnsProps) {
  const topPlaces = (String(top).split(".")[1] ?? "").length;
  const bottomPlaces = (String(bottom).split(".")[1] ?? "").length;

  if (operation === "multiply") {
    const result = Math.round(top * bottom * 1e6) / 1e6;
    const totalPlaces = topPlaces + bottomPlaces;
    return (
      <div role="img" aria-label={`${top} times ${bottom}`} style={{ fontFamily: "'Courier New', monospace", fontSize: 20, color: palette.ink, textAlign: "right" }}>
        <div>{top}</div>
        <div>× {bottom}</div>
        <div style={{ borderTop: `2px solid ${palette.ink}`, marginTop: 4, paddingTop: 4 }}>{done > 0 ? result : "?"}</div>
        <div style={{ fontFamily: "inherit", fontSize: 13, color: palette.muted, marginTop: 6 }}>
          {topPlaces} + {bottomPlaces} = {totalPlaces} decimal place{totalPlaces === 1 ? "" : "s"} total
        </div>
      </div>
    );
  }

  const places = Math.max(topPlaces, bottomPlaces);
  const a = padDecimals(top, places);
  const b = padDecimals(bottom, places);
  const width = Math.max(a.length, b.length) + 1;
  const result = operation === "add" ? top + bottom : top - bottom;
  // This unit doesn't cover negative numbers yet (that's planned as its own
  // later topic) — rather than silently compute and display a wrong positive
  // answer when the 2nd number is bigger (e.g. 10 − 12 rendering as "2"),
  // swap the digit result for an explanation. Only possible for subtraction;
  // addition is commutative so there's no invalid order to guard against.
  const needsBiggerFirst = operation === "subtract" && bottom > top;

  // Each operand row is laid out as `width` individually-sized 1em character
  // boxes (so the decimal points land in the same column regardless of how
  // many digits either number has) — the result row must be built the exact
  // same way, not as one plain right-aligned text node, or its digits drift
  // out of step with the rows above: Courier New's natural glyph advance is
  // narrower than the forced 1em box, so a plain string compresses faster
  // than the padded rows expand, throwing off alignment one column per digit.
  const renderDigits = (str: string) =>
    str.split("").map((ch, i) => (
      <span key={i} style={{ width: "1em", textAlign: "center", color: ch === "." ? palette.c : palette.ink, fontWeight: ch === "." ? 700 : 400 }}>
        {ch}
      </span>
    ));
  const resultStr = done > 0 ? padDecimals(Math.round(result * 1e6) / 1e6, places).padStart(width, " ") : "?".padStart(width, " ");

  return (
    <div
      role="img"
      aria-label={`${top} ${operation === "add" ? "plus" : "minus"} ${bottom}`}
      style={{ fontFamily: "'Courier New', monospace", fontSize: 20, color: palette.ink }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.1em" }}>{renderDigits(a.padStart(width, " "))}</div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.1em" }}>
        <span style={{ width: "1em", textAlign: "center" }}>{operation === "add" ? "+" : "−"}</span>
        {renderDigits(b.padStart(width - 1, " "))}
      </div>
      <div style={{ borderTop: `2px solid ${palette.ink}`, width: `${width}em`, marginLeft: "auto" }} />
      {needsBiggerFirst ? (
        <div style={{ fontFamily: "inherit", fontSize: 13, color: palette.c, textAlign: "right", marginTop: 4, maxWidth: `${Math.max(width * 2, 16)}em`, marginLeft: "auto" }}>
          Not yet — the first number needs to be bigger than the second, so the answer isn't negative.
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.1em" }}>{renderDigits(resultStr)}</div>
      )}
    </div>
  );
}
