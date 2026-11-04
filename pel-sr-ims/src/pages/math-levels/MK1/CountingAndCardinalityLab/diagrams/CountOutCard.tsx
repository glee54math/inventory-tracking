import { BigDigit } from "./BigDigit";

/** The picture for "count out": the number to count out, on a card, for a friend. */
export const CountOutCard = ({ n }: { n: number }) => (
  <div role="img" aria-label={`Your friend wants ${n}.`} style={{ display: "flex", alignItems: "center", gap: 14 }}>
    <span style={{ fontSize: 56 }} aria-hidden>
      🧒
    </span>
    <span style={{ border: "3px solid var(--qb)", borderRadius: 14, padding: "4px 18px", background: "var(--qb-soft)" }}>
      <BigDigit d={n} />
    </span>
  </div>
);
