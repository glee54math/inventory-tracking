import { ObjectGroup } from "./ObjectGroup";
import { useCountAlong } from "./timing";

export interface CompareRowsProps {
  nameA: string;
  countA: number;
  nameB: string;
  countB: number;
  /** Ring the extras in the longer row. Off until the student needs it. */
  ringExtras?: boolean;
  /** A demo: only the first `matched` dots of each row are lit and numbered. */
  matched?: number;
  /** "Show me": count this row's dots, one per second. */
  countRow?: "a" | "b";
  /** Outline this row, to point at it after a wrong try. Prints no number. */
  ringRow?: "a" | "b";
  /** "Show me": number the ringed extras, one per second. */
  countExtras?: boolean;
}

const firstN = (n: number) => Array.from({ length: n }, (_, i) => i);

/** Two rows lined up one-to-one, each with its name in its color, so the
 *  extras stick out. The standard compare picture for this lab. */
export function CompareRows({ nameA, countA, nameB, countB, ringExtras = false, matched, countRow, ringRow, countExtras = false }: CompareRowsProps) {
  const counted = useCountAlong(!!countRow, countRow === "b" ? countB : countA);
  const extrasCounted = useCountAlong(countExtras, Math.abs(countA - countB));
  const row = (name: string, n: number, other: number, tone: "a" | "b") => {
    const order = countRow === tone ? firstN(counted) : matched !== undefined ? firstN(Math.min(matched, n)) : undefined;
    return (
      <div style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 12, outline: ringRow === tone ? "3px solid var(--qc)" : undefined, outlineOffset: 1 }}>
        <span style={{ flex: "0 0 54px", fontWeight: 800, color: `var(--q${tone})` }}>{name}</span>
        <div style={{ flex: "1 1 auto", minWidth: 0, maxWidth: 320 }}>
          <ObjectGroup count={n} arrangement="line" tone={tone} alignLeft countedOrder={order} ringFrom={ringExtras && n > other ? other : undefined} labelFrom={countExtras && n > other ? other : undefined} labelCount={extrasCounted} />
        </div>
      </div>
    );
  };
  return (
    <div style={{ display: "grid", gap: 4, width: "100%", maxWidth: 390 }}>
      {row(nameA, countA, countB, "a")}
      {row(nameB, countB, countA, "b")}
    </div>
  );
}
