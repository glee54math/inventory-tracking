import type { ReactNode } from "react";
import { CLOSE, OPEN, SYM_NAME, fmtNum, nextPath, workSteps, type Expr, type Path, type Sym } from "../lib/expr";

// An expression drawn big, with each kind of grouping symbol in its own color
// (parentheses blue, brackets orange, braces purple, in every unit), so a
// student can match each opening mark with its closing mark. The part to work
// out next can be ringed. Built from lib/expr.ts, the same model that grades
// the answers.

const symClass = (s: Sym) => `sym sym-${s}`;

function Node({ e, path, focus, boxes }: { e: Expr; path: Path; focus?: Path | null; boxes?: boolean }): ReactNode {
  if (e.kind === "num") return <span className="expr-num">{fmtNum(e.v)}</span>;
  const isFocus = !!focus && focus.length === path.length && focus.every((t, i) => t === path[i]);
  const inner = (
    <>
      <Node e={e.l} path={[...path, "l"]} focus={focus} boxes={boxes} />
      <span className="expr-op">{e.op}</span>
      <Node e={e.r} path={[...path, "r"]} focus={focus} boxes={boxes} />
    </>
  );
  const body = e.sym ? (
    <span className={`expr-group${boxes ? ` expr-box expr-box-${e.sym}` : ""}`} aria-label={SYM_NAME[e.sym]}>
      <span className={symClass(e.sym)}>{OPEN[e.sym]}</span>
      {inner}
      <span className={symClass(e.sym)}>{CLOSE[e.sym]}</span>
    </span>
  ) : (
    inner
  );
  return isFocus ? <span className="expr-focus">{body}</span> : body;
}

export interface ExprViewProps {
  expr: Expr;
  /** Ring this part (e.g. the next one to work out). `"next"` = the next part by the inside-first rule. */
  focus?: Path | "next" | null;
  /** Draw a colored outline around each group (Unit 2's "groups inside groups" view). */
  boxes?: boolean;
  size?: "md" | "lg";
  /** Text in front, e.g. "=". */
  lead?: string;
}

export function ExprView({ expr, focus = null, boxes = false, size = "lg", lead }: ExprViewProps) {
  const f = focus === "next" ? nextPath(expr) : focus;
  return (
    <span className={`expr expr-${size}`}>
      {lead && <span className="expr-lead">{lead}</span>}
      <Node e={expr} path={[]} focus={f} boxes={boxes} />
    </span>
  );
}

/**
 * The worked lines: the expression, then "= ..." after each step, inside
 * first. `show` = how many lines (1 = just the expression). The part worked
 * out next is ringed on each line.
 */
export function WorkLines({ expr, show, ring = true, boxes = false }: { expr: Expr; show?: number; ring?: boolean; boxes?: boolean }) {
  const lines = workSteps(expr);
  const n = Math.min(show ?? lines.length, lines.length);
  return (
    <div className="work-lines">
      {lines.slice(0, n).map((e, i) => (
        <div key={i} className="work-line">
          <ExprView expr={e} lead={i === 0 ? undefined : "="} focus={ring && i < n - 1 ? "next" : null} size="md" boxes={boxes && i === 0} />
        </div>
      ))}
    </div>
  );
}

/** The three grouping symbols side by side, named once (Unit 2). */
export function SymbolKey() {
  return (
    <div className="symbol-key" role="list">
      {(["paren", "bracket", "brace"] as Sym[]).map((s) => (
        <span key={s} className="symbol-key-item" role="listitem">
          <span className={`${symClass(s)} symbol-key-mark`}>
            {OPEN[s]} {CLOSE[s]}
          </span>
          <span>{SYM_NAME[s]}</span>
        </span>
      ))}
    </div>
  );
}
