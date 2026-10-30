import { palette, diagramFont } from "../../../shared/lib/palette";

export type CoinId = "penny" | "nickel" | "dime" | "quarter" | "dollar1" | "dollar5" | "dollar10";

export interface CoinSpec {
  id: CoinId;
  valueCents: number;
  label: string;
  kind: "coin" | "bill";
}

/** The fixed fact set 2.MD.8's Money unit is built to drill into instant
 *  recall (see MoneyWordProblems.tsx's reintroEverySolved gate) — never
 *  re-derive a coin's value anywhere else, always look it up here. */
export const COIN_TYPES: CoinSpec[] = [
  { id: "penny", valueCents: 1, label: "1¢", kind: "coin" },
  { id: "nickel", valueCents: 5, label: "5¢", kind: "coin" },
  { id: "dime", valueCents: 10, label: "10¢", kind: "coin" },
  { id: "quarter", valueCents: 25, label: "25¢", kind: "coin" },
  { id: "dollar1", valueCents: 100, label: "$1", kind: "bill" },
  { id: "dollar5", valueCents: 500, label: "$5", kind: "bill" },
];

export const coinSpec = (id: CoinId): CoinSpec => COIN_TYPES.find((c) => c.id === id)!;

/** Sums a multiset of coin/bill ids by their value — THE one function both
 *  CoinRow's own running total AND every graded "how much is this worth"
 *  answer are derived from. */
export const totalCents = (ids: CoinId[]): number => ids.reduce((sum, id) => sum + coinSpec(id).valueCents, 0);

const DIAM: Record<CoinId, number> = { penny: 46, nickel: 54, dime: 40, quarter: 58, dollar1: 88, dollar5: 88, dollar10: 88 };
const TONE: Record<CoinId, string> = {
  penny: "#B5651D",
  nickel: "#9A9A9A",
  dime: "#B0B0B0",
  quarter: "#C0C0C8",
  dollar1: "#3F8F5F",
  dollar5: "#2F7A52",
  dollar10: "#246644",
};

function Chip({ id, dim }: { id: CoinId; dim?: boolean }) {
  const spec = coinSpec(id);
  const isBill = spec.kind === "bill";
  return (
    <div
      role="img"
      aria-label={spec.label}
      style={{
        width: isBill ? 72 : DIAM[id],
        height: isBill ? 40 : DIAM[id],
        borderRadius: isBill ? 6 : "50%",
        background: TONE[id],
        opacity: dim ? 0.35 : 1,
        display: "grid",
        placeItems: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: isBill ? 15 : spec.id === "dime" ? 12 : 14,
        fontFamily: diagramFont,
        border: `2px solid ${palette.ink}`,
        boxShadow: "inset 0 -2px 0 rgba(0,0,0,0.15)",
        flexShrink: 0,
      }}
    >
      {spec.label}
    </div>
  );
}

/** A static row of coin/bill chips — the Practice/Test display for "how much
 *  is this mixed set worth." Order is preserved as given (callers that want
 *  a consistent reading order, largest-first, should sort before passing in). */
export function CoinRow({ ids, onRemove }: { ids: CoinId[]; onRemove?: (index: number) => void }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
      {ids.map((id, i) => (
        <button
          key={i}
          type="button"
          disabled={!onRemove}
          onClick={onRemove ? () => onRemove(i) : undefined}
          style={{ border: 0, background: "none", padding: 0, cursor: onRemove ? "pointer" : "default" }}
          aria-label={onRemove ? `Remove this ${coinSpec(id).label}` : undefined}
        >
          <Chip id={id} />
        </button>
      ))}
      {ids.length === 0 && <span style={{ color: palette.muted }}>(nothing in the purse yet)</span>}
    </div>
  );
}

/** Explore's click-to-add palette — one button per denomination, same
 *  click-to-select convention as MK1's CounterGroup/MK4's StickBuilder
 *  (deliberately not freeform pointer-drag — a coin's VALUE is the point,
 *  not its pixel position). */
export function CoinPicker({ onAdd, kinds = COIN_TYPES.map((c) => c.id) }: { onAdd: (id: CoinId) => void; kinds?: CoinId[] }) {
  return (
    <div className="control-row">
      {kinds.map((id) => (
        <button key={id} type="button" className="btn ghost" onClick={() => onAdd(id)}>
          <Chip id={id} />
        </button>
      ))}
    </div>
  );
}
