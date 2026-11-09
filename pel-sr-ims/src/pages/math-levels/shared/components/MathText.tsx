import { Children, cloneElement, createContext, Fragment, isValidElement, useContext, type ReactElement, type ReactNode } from "react";

// ============================================================================
// Opt-in "handwritten" fractions. A lab that wraps its content in
// <StackedFractions> gets every fraction in text ("3/4", "2 3/4", "?/12")
// drawn as a stacked fraction (numerator over a bar over the denominator) at
// render time, so generated strings don't all have to be rewritten as JSX.
// The shared engine (StepProblem, UnitTest, CfuQuestion, TapSelect,
// PieceBars/MixedNumberBars captions, UnitPreviewCarousel) runs its text
// through <MathText>. Outside a <StackedFractions> provider MathText returns
// its children untouched, so every other lab renders exactly as before.
//
// Turn it on for a lab: wrap the lab's root content in <StackedFractions>
// (MG10_AddingAndSubtractingFractionsLab.tsx does it inside the lab-base
// div), and wrap the lab's own hand-written text (Explore, CFU, Key Idea,
// goals) in <MathText>. SVG labels can't hold HTML: draw those with the lab's
// own SVG helper (MG10's diagrams/SvgMath.tsx). Added for MG10 (user
// requirement, 2026-11: "I don't want to see 1/2").
// ============================================================================

const StackedCtx = createContext(false);

/** Turns stacked fractions on for everything inside it. */
export function StackedFractions({ children, on = true }: { children: ReactNode; on?: boolean }) {
  return <StackedCtx.Provider value={on}>{children}</StackedCtx.Provider>;
}

/** True inside a <StackedFractions> provider. */
export const useStackedFractions = (): boolean => useContext(StackedCtx);

// A fraction, optionally with a whole number in front ("2 3/4"). "?" can
// stand for an unknown part ("?/12", "3/?"). The character before the match
// is captured (not a lookbehind: older iPad Safari can't parse lookbehind)
// so "a/b"-style words, dates and decimals are left alone. A sentence can
// end right after a fraction ("is 2/7." / "than 1/3?").
const FRAC_RE = /(^|[^\w/.?])(?:(\d+) )?(\d+|\?)\s*\/\s*(\d+|\?)(?![\w/]|\.\d)/g;

/** True when the text holds a fraction MathText would stack. */
export const hasFraction = (s: string): boolean => {
  FRAC_RE.lastIndex = 0;
  const found = FRAC_RE.test(s);
  FRAC_RE.lastIndex = 0;
  return found;
};

const spokenPart = (p: string) => (p === "?" ? "blank" : p);

/** Screen-reader words for one fraction: "3 over 4", "2 and 3 over 4". */
export const spokenFraction = (n: string | number, d: string | number, w?: string | number): string =>
  `${w !== undefined && w !== "" ? `${w} and ` : ""}${spokenPart(String(n))} over ${spokenPart(String(d))}`;

/** Every fraction in a sentence said in words: "3/8 is near 1/2" -> "3 over 8 is near 1 over 2". */
export const spokenFractions = (s: string): string => s.replace(FRAC_RE, (_m, pre: string, w: string | undefined, n: string, d: string) => `${pre}${spokenFraction(n, d, w)}`);

/** One stacked fraction (with its whole number, if any) for running text. */
export function StackedNumber({ w, n, d }: { w?: string | number; n: string | number; d: string | number }) {
  const hasWhole = w !== undefined && w !== "";
  return (
    <span className="frac-text" role="math" aria-label={spokenFraction(n, d, w)} data-tts-say={`${hasWhole ? `${w} ` : ""}${n}/${d}`}>
      {hasWhole && (
        <span className="frac-whole" aria-hidden>
          {w}
        </span>
      )}
      <span className="frac" aria-hidden>
        <span className="frac-n">{n}</span>
        <span className="frac-d">{d}</span>
      </span>
    </span>
  );
}

/** Splits one string into text runs and stacked fractions. */
function stackString(s: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  FRAC_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = FRAC_RE.exec(s)) !== null) {
    const [whole, pre, w, n, d] = m;
    const start = m.index + pre.length;
    if (start > last) out.push(s.slice(last, start));
    out.push(<StackedNumber key={`${keyBase}-${k++}`} w={w} n={n} d={d} />);
    last = m.index + whole.length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}

// Host elements whose children must stay plain text (or can't hold spans).
const SKIP = new Set(["svg", "option", "select", "textarea", "title", "script", "style"]);

/**
 * Rewrites a React tree's text: adjacent strings and numbers are joined (so
 * JSX like `{n}/{d}` is seen as "3/4"), then fractions in them are stacked.
 * It walks into plain HTML elements and fragments, but not into components
 * (they render their own text, through MathText if they need it).
 */
function transform(node: ReactNode, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let buf = "";
  let run = 0;
  const flush = () => {
    if (buf) out.push(...stackString(buf, `${keyBase}.t${run++}`));
    buf = "";
  };
  Children.toArray(node).forEach((c, i) => {
    if (typeof c === "string" || typeof c === "number") {
      buf += String(c);
      return;
    }
    flush();
    if (isValidElement<{ children?: ReactNode }>(c) && c.props.children !== undefined && (c.type === Fragment || (typeof c.type === "string" && !SKIP.has(c.type)))) {
      out.push(cloneElement(c as ReactElement<{ children?: ReactNode }>, undefined, ...transform(c.props.children, `${keyBase}.${i}`)));
    } else {
      out.push(c);
    }
  });
  flush();
  return out;
}

/** Stacks the fractions in its children's text inside a <StackedFractions> lab; otherwise renders them unchanged. */
export function MathText({ children }: { children?: ReactNode }) {
  const on = useStackedFractions();
  if (!on || children === null || children === undefined || typeof children === "boolean") return <>{children}</>;
  return <>{transform(children, "mt")}</>;
}
