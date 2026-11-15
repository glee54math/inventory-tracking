import { palette, itemColors } from "../../../shared/lib/palette";

// Unit 1's story picture: n labeled groups (bags, boxes, plates). "each" puts
// a of item 1 AND b of item 2 in every group; "extra" puts a of item 1 in
// every group and b of item 2 once, in a separate box beside them. Dots come
// in rows of up to 5 so they can be counted in fives. A legend names each
// color, so the picture works with any scene's item words.

export const ITEM_COLORS = {
  red: itemColors.red.main,
  // Not --qb: the lab's --qb orange is too close to item-red for apples next to oranges.
  orange: "var(--item-orange, #F08C00)",
  yellow: itemColors.yellow.main,
  green: itemColors.green.main,
  blue: palette.a,
  purple: palette.c,
} as const;
export type ItemColorName = keyof typeof ITEM_COLORS;

function Dots({ count, color }: { count: number; color: string }) {
  const rows: number[] = [];
  for (let left = count; left > 0; left -= 5) rows.push(Math.min(5, left));
  return (
    <span className="gp-dots">
      {rows.map((r, i) => (
        <span key={i} className="gp-dot-row">
          {Array.from({ length: r }, (_, k) => (
            <span key={k} className="gp-dot" style={{ background: color }} />
          ))}
        </span>
      ))}
    </span>
  );
}

export interface GroupsPictureProps {
  kind: "each" | "extra";
  n: number;
  a: number;
  b: number;
  group: string;
  item1: string;
  item2: string;
  color1: ItemColorName;
  color2: ItemColorName;
  extraLabel?: string;
}

export function GroupsPicture({ kind, n, a, b, group, item1, item2, color1, color2, extraLabel = "extra" }: GroupsPictureProps) {
  const c1 = ITEM_COLORS[color1];
  const c2 = ITEM_COLORS[color2];
  return (
    <div className="gp" role="img" aria-label={kind === "each" ? `${n} ${group}s, each with ${a} ${item1} and ${b} ${item2}` : `${n} ${group}s, each with ${a} ${item1}, and ${b} ${item2} on the side`}>
      <div className="gp-legend">
        <span>
          <span className="gp-dot" style={{ background: c1 }} /> {item1}
        </span>
        <span>
          <span className="gp-dot" style={{ background: c2 }} /> {item2}
        </span>
      </div>
      <div className="gp-row">
        {Array.from({ length: n }, (_, i) => (
          <div key={i} className="gp-group">
            <Dots count={a} color={c1} />
            {kind === "each" && <Dots count={b} color={c2} />}
            <span className="gp-label">
              {group} {i + 1}
            </span>
          </div>
        ))}
        {kind === "extra" && (
          <div className="gp-group gp-extra">
            <Dots count={b} color={c2} />
            <span className="gp-label">{extraLabel}</span>
          </div>
        )}
      </div>
    </div>
  );
}
