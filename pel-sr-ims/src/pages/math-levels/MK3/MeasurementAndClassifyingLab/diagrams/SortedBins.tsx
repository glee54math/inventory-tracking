import { palette, diagramFont } from "../../../shared/lib/palette";

export type ItemShape = "circle" | "square" | "triangle";

export interface BinItem {
  id: string;
  shape: ItemShape;
  color: string;
}

export interface BinSpec {
  label: string;
  items: BinItem[];
}

export interface SortedBinsProps {
  bins: BinSpec[];
  /**
   * Unsorted items shown in a tray above the bins — Practice/Test visuals
   * always omit this (everything is already sorted); only Explore's
   * click-to-sort sandbox keeps items here before the student places them.
   */
  tray?: BinItem[];
  /** Rings this one item, independent of whether it's clickable. */
  highlightId?: string;
  selectedId?: string | null;
  onItemClick?: (id: string) => void;
  onBinClick?: (binIndex: number) => void;
}

const ICON = 22;
const COLS = 5;
const CELL = 34;

function ShapeIcon({ item }: { item: BinItem }) {
  if (item.shape === "circle") return <circle r={ICON / 2} fill={item.color} />;
  if (item.shape === "square") return <rect x={-ICON / 2} y={-ICON / 2} width={ICON} height={ICON} rx={3} fill={item.color} />;
  const h = ICON * 0.95;
  return <polygon points={`0,${-h / 1.7} ${ICON / 1.9},${h / 2.4} ${-ICON / 1.9},${h / 2.4}`} fill={item.color} />;
}

/**
 * Items sorted into labeled bins (plus an optional unsorted tray above) —
 * the shared visual for K.MD.3's classify -> count -> compare chain. Static
 * by default (Practice/Test); passing onItemClick/onBinClick turns it into
 * Explore's click-one-then-click-a-bin sandbox (same "interactive only in
 * Explore" convention as CounterGroup's countedOrder/onToggle).
 */
export function SortedBins({ bins, tray, highlightId, selectedId, onItemClick, onBinClick }: SortedBinsProps) {
  const rowOf = (i: number) => Math.floor(i / COLS);
  const colOf = (i: number) => i % COLS;

  const grid = (items: BinItem[], originX: number, originY: number, clickable?: boolean) =>
    items.map((it, i) => {
      const rung = it.id === selectedId || it.id === highlightId;
      const clickHandler = clickable && onItemClick ? () => onItemClick(it.id) : undefined;
      return (
        <g
          key={it.id}
          transform={`translate(${originX + colOf(i) * CELL + CELL / 2}, ${originY + rowOf(i) * CELL + CELL / 2})`}
          style={clickHandler ? { cursor: "pointer" } : undefined}
          onClick={clickHandler}
        >
          {rung && <circle r={ICON / 2 + 6} fill="none" stroke={palette.a} strokeWidth={3} />}
          <ShapeIcon item={it} />
        </g>
      );
    });

  const trayRows = tray ? Math.max(1, Math.ceil(tray.length / COLS)) : 0;
  const trayH = tray ? trayRows * CELL + 30 : 0;
  const maxBinItems = Math.max(1, ...bins.map((b) => b.items.length));
  const binRows = Math.max(1, Math.ceil(maxBinItems / COLS));
  const binH = binRows * CELL + 44;
  const binW = Math.max(150, COLS * CELL + 20);
  const width = Math.max(binW * bins.length + 16 * Math.max(0, bins.length - 1) + 20, tray ? COLS * CELL + 40 : 0);
  const height = trayH + binH + 20;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label="Objects sorted into labeled categories"
      style={{ display: "block", width: "100%", maxWidth: Math.max(width, 320), height: "auto", fontFamily: diagramFont }}
    >
      {tray && (
        <g>
          <rect x={10} y={10} width={width - 20} height={trayH - 10} rx={10} fill="none" stroke={palette.line} strokeWidth={2} strokeDasharray="4 4" />
          <text x={18} y={26} fontSize={12} fill={palette.muted} fontWeight={700}>
            Not sorted yet
          </text>
          {grid(tray, 18, 30, true)}
        </g>
      )}
      {bins.map((bin, bi) => {
        const bx = 10 + bi * (binW + 16);
        const by = trayH + 10;
        const binClickHandler = onBinClick ? () => onBinClick(bi) : undefined;
        return (
          <g key={bi} style={binClickHandler ? { cursor: "pointer" } : undefined} onClick={binClickHandler}>
            <rect x={bx} y={by} width={binW} height={binH} rx={10} fill={palette.grid} stroke={palette.line} strokeWidth={2} />
            <text x={bx + binW / 2} y={by + 20} textAnchor="middle" fontSize={14} fontWeight={700} fill={palette.ink}>
              {bin.label} ({bin.items.length})
            </text>
            {grid(bin.items, bx + 10, by + 28)}
          </g>
        );
      })}
    </svg>
  );
}
