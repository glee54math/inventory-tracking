import { usd2 } from "../lib/measures";

export interface ReceiptLine {
  name: string;
  qty: number;
  eachCents: number;
  /** Hide this line's own total until the student has found it. */
  hideLineTotal?: boolean;
}

/**
 * A store receipt (HTML, so long item names wrap instead of clipping):
 * one line per item (qty × price each = line total), then the total, the
 * amount paid, and the change. Any of the computed numbers can be hidden
 * as "?" until the matching Practice step is answered. Every amount is in
 * whole cents (see lib/measures.ts) and formatted with two decimals.
 */
export function Receipt({
  lines,
  totalCents,
  hideTotal,
  paidCents,
  changeCents,
  hideChange,
  title = "Receipt",
  paidLabel = "Paid",
  changeLabel = "Change",
}: {
  lines: ReceiptLine[];
  totalCents?: number;
  hideTotal?: boolean;
  paidCents?: number;
  changeCents?: number;
  hideChange?: boolean;
  title?: string;
  paidLabel?: string;
  changeLabel?: string;
}) {
  const q = <span className="blank">?</span>;
  return (
    <div className="receipt" role="table" aria-label={title}>
      <div className="receipt-title">{title}</div>
      {lines.map((ln, i) => (
        <div className="receipt-row" key={i} role="row">
          <span>
            {ln.qty > 1 ? `${ln.qty} × ` : ""}
            {ln.name}
            {ln.qty > 1 ? ` @ ${usd2(ln.eachCents)}` : ""}
          </span>
          <span>{ln.hideLineTotal ? q : usd2(ln.qty * ln.eachCents)}</span>
        </div>
      ))}
      {totalCents !== undefined && (
        <div className="receipt-row receipt-total" role="row">
          <span>Total</span>
          <span>{hideTotal ? q : usd2(totalCents)}</span>
        </div>
      )}
      {paidCents !== undefined && (
        <div className="receipt-row" role="row">
          <span>{paidLabel}</span>
          <span>{usd2(paidCents)}</span>
        </div>
      )}
      {changeCents !== undefined && (
        <div className="receipt-row receipt-change" role="row">
          <span>{changeLabel}</span>
          <span>{hideChange ? q : usd2(changeCents)}</span>
        </div>
      )}
    </div>
  );
}
