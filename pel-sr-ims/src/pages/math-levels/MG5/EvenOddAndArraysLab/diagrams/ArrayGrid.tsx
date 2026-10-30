import type { ReactNode } from "react";
import { palette, diagramFont } from "../../../shared/lib/palette";

const CELL = 34;
const PAD = 20;

const toneColor = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.b : tone === "c" ? palette.c : palette.a);
const toneSoft = (tone?: "a" | "b" | "c") => (tone === "b" ? palette.bSoft : tone === "c" ? palette.cSoft : palette.aSoft);

export interface ArrayGridProps {
  rows: number;
  cols: number;
  tone?: "a" | "b" | "c";
  /**
   * Zebra-tints every OTHER row (or column) and prints that dimension's
   * group size alongside it — the concrete "which repeated-addition reading
   * am I looking at" cue. "none" leaves every cell the same shade (a plain
   * counting/area view, used when a question just wants the total, not a
   * particular grouping). The SAME array can be shown with groupBy="row"
   * then groupBy="col" without changing rows/cols at all — that's what lets
   * Unit 3's "add by rows vs. add by columns" bucket and Unit 4's "which
   * equation matches this grouping" bucket both reuse one array image.
   */
  groupBy?: "row" | "col" | "none";
}

/** A rectangular array of up to 5x5 cells — the literal grid named in
 *  2.OA.4, reused by Unit 3 (finding the total) and Unit 4 (writing the
 *  total as a sum of equal addends). */
export function ArrayGrid({ rows, cols, tone, groupBy = "none" }: ArrayGridProps) {
  const main = toneColor(tone);
  const soft = toneSoft(tone);
  const width = cols * CELL + PAD * 2 + (groupBy === "row" ? 30 : 0);
  const height = rows * CELL + PAD * 2 + (groupBy === "col" ? 26 : 0);
  const cells: ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = PAD + c * CELL;
      const y = PAD + r * CELL;
      const altGroup = groupBy === "row" ? r % 2 === 1 : groupBy === "col" ? c % 2 === 1 : false;
      cells.push(<rect key={`${r}-${c}`} x={x + 2} y={y + 2} width={CELL - 4} height={CELL - 4} rx={6} fill={altGroup ? soft : main} stroke={palette.paper} strokeWidth={2} />);
    }
  }
  const labels: ReactNode[] = [];
  if (groupBy === "row") {
    for (let r = 0; r < rows; r++) {
      labels.push(
        <text key={`rl${r}`} x={PAD + cols * CELL + 14} y={PAD + r * CELL + CELL / 2 + 5} textAnchor="middle" fontSize={14} fontWeight={700} fill={palette.muted}>
          {cols}
        </text>
      );
    }
  } else if (groupBy === "col") {
    for (let c = 0; c < cols; c++) {
      labels.push(
        <text key={`cl${c}`} x={PAD + c * CELL + CELL / 2} y={PAD + rows * CELL + 20} textAnchor="middle" fontSize={14} fontWeight={700} fill={palette.muted}>
          {rows}
        </text>
      );
    }
  }
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={`${rows} rows by ${cols} columns array`}
      style={{ display: "block", width: "100%", maxWidth: width, height: "auto", fontFamily: diagramFont }}
    >
      {cells}
      {labels}
    </svg>
  );
}
