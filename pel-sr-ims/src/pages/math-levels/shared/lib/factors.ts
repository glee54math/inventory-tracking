// Prime factors and plotted points: the grading behind the shared "factors" and
// "plot" Step kinds (shared/engine/types.ts) and the CFU blanks that reuse them.
// Added for MG10_NumericalExpressionsAndPatternsLab (5.OA.2.1, 5.OA.3). Pure
// functions only, so Practice, Test and CFU grade a list of factors or a set of
// points in exactly one way.

export const isPrime = (n: number): boolean => {
  if (!Number.isInteger(n) || n < 2) return false;
  for (let k = 2; k * k <= n; k++) if (n % k === 0) return false;
  return true;
};

/** Prime factors of n (n >= 2), smallest first, e.g. 36 -> [2, 2, 3, 3]. */
export const primeFactors = (n: number): number[] => {
  const out: number[] = [];
  let m = n;
  for (let k = 2; k * k <= m; k++) {
    while (m % k === 0) {
      out.push(k);
      m /= k;
    }
  }
  if (m > 1) out.push(m);
  return out;
};

/** Factor pairs of n with neither factor 1, smaller factor first, e.g. 36 -> [[2,18],[3,12],[4,9],[6,6]]. */
export const factorPairsNoOne = (n: number): [number, number][] => {
  const out: [number, number][] = [];
  for (let k = 2; k * k <= n; k++) if (n % k === 0) out.push([k, n / k]);
  return out;
};

/** "2 × 2 × 3" */
export const timesText = (factors: readonly (number | string)[]): string => factors.join(" × ");

/** A factor list kept in one string, "2,2,3" (one entry per box; "" for an empty box). */
export const splitFactorBoxes = (raw: string | undefined): string[] => (raw === undefined || raw === "" ? [""] : raw.split(","));
export const joinFactorBoxes = (boxes: readonly string[]): string => (boxes.length === 1 && boxes[0] === "" ? "" : boxes.join(","));

export interface FactorCheckOptions {
  /** Exactly two factors, neither of them 1 (a factor pair to start a factor tree), any numbers. */
  pair?: boolean;
  /** Pairs that are not allowed (e.g. the pair someone else already used), in either order. */
  exclude?: [number, number][];
}

/**
 * Grades a typed list of factors of `target`. Order never matters.
 * Default: every factor must be prime and they must multiply to `target`
 * (a prime number is just itself: "29"). With `pair`: two factors, neither 1.
 */
export const checkFactors = (target: number, boxes: readonly string[], opts: FactorCheckOptions = {}): { ok: boolean; msg: string } => {
  const raw = boxes.map((b) => b.trim());
  if (raw.length === 0 || raw.some((b) => b === "")) return { ok: false, msg: opts.pair ? "Fill in both boxes." : "Fill in every box, or remove the empty one." };
  if (raw.some((b) => !/^\d+$/.test(b))) return { ok: false, msg: "Type one whole number in each box." };
  const f = raw.map(Number);
  const product = f.reduce((a, b) => a * b, 1);
  if (opts.pair) {
    if (f.includes(1)) return { ok: false, msg: `Leave out 1. Find two other numbers that multiply to ${target}.` };
    if (product !== target) return { ok: false, msg: `${timesText(f)} = ${product}, not ${target}.` };
    const [a, b] = f;
    if (opts.exclude?.some(([x, y]) => (x === a && y === b) || (x === b && y === a))) return { ok: false, msg: `That pair is taken. Find a different pair for ${target}.` };
    return { ok: true, msg: "" };
  }
  if (f.includes(1)) {
    return isPrime(target)
      ? { ok: false, msg: `1 is not a prime number, so leave it out. ${target} is prime, so write just ${target}.` }
      : { ok: false, msg: "1 is not a prime number, so leave it out." };
  }
  if (product !== target) return { ok: false, msg: `${timesText(f)} = ${product}, not ${target}.` };
  const notPrime = f.find((x) => !isPrime(x));
  if (notPrime !== undefined) return { ok: false, msg: `${notPrime} is not prime. Break ${notPrime} into smaller factors.` };
  return { ok: true, msg: "" };
};

// ---------- plotted points ----------

/** Points kept in one string, "1,3;2,6" (x,y pairs joined by ";"). */
export const parsePoints = (raw: string | undefined): [number, number][] =>
  (raw ?? "")
    .split(";")
    .filter(Boolean)
    .map((p) => p.split(",").map(Number) as [number, number]);
export const joinPoints = (pts: readonly [number, number][]): string => pts.map(([x, y]) => `${x},${y}`).join(";");
export const pointsText = (pts: readonly [number, number][]): string => pts.map(([x, y]) => `(${x}, ${y})`).join(", ");

/** Tap a grid point: add it, or take it away if it is already there. */
export const togglePoint = (raw: string | undefined, x: number, y: number): string => {
  const pts = parsePoints(raw);
  const has = pts.some(([a, b]) => a === x && b === y);
  return joinPoints(has ? pts.filter(([a, b]) => !(a === x && b === y)) : [...pts, [x, y]]);
};

/** Grades a set of plotted points against the answer set (order never matters). */
export const checkPlot = (answer: readonly [number, number][], raw: string | undefined): { ok: boolean; msg: string } => {
  const pts = parsePoints(raw);
  const key = ([x, y]: readonly [number, number]) => `${x},${y}`;
  const want = new Set(answer.map(key));
  if (pts.length === 0) return { ok: false, msg: `Tap the grid to plot ${answer.length} points.` };
  const right = pts.filter((p) => want.has(key(p))).length;
  if (right === answer.length && pts.length === answer.length) return { ok: true, msg: "" };
  const swapped = pts.filter((p) => !want.has(key(p)) && want.has(key([p[1], p[0]]))).length;
  if (swapped > 0) return { ok: false, msg: "Some points are switched. Go across to the first number, then up to the second number." };
  if (pts.length < answer.length) return { ok: false, msg: `You plotted ${pts.length} point${pts.length === 1 ? "" : "s"}. Plot all ${answer.length}.` };
  if (pts.length > answer.length) return { ok: false, msg: `You plotted ${pts.length} points, but there are only ${answer.length} ordered pairs. Tap a point again to take it away.` };
  return { ok: false, msg: `${answer.length - right} of your points ${answer.length - right === 1 ? "is" : "are"} not in the right spot. Go across first, then up.` };
};
