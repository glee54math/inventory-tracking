// Shared math helpers used by diagrams, problem generators and answer checking.

export const gcd = (a: number, b: number): number => {
  a = Math.abs(Math.round(a));
  b = Math.abs(Math.round(b));
  while (b) [a, b] = [b, a % b];
  return a || 1;
};

export const lcm = (a: number, b: number): number => Math.abs(a * b) / gcd(a, b);

export const simplify = (a: number, b: number): [number, number] => {
  const g = gcd(a, b);
  return [a / g, b / g];
};

export const randInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];

export const shuffle = <T,>(arr: readonly T[]): T[] => {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
};

/** Format a number for display: at most 2 decimals, no trailing zeros. */
export const fmt = (n: number): string => {
  if (!isFinite(n)) return "?";
  const r = Math.round(n * 100) / 100;
  return r.toLocaleString("en-US", { maximumFractionDigits: 2 });
};

export const money = (n: number): string =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

/** Display a/b as a fraction string, simplified ("3/4", "5", "1 1/2" when mixed=true). */
export const fracText = (a: number, b: number, mixed = false): string => {
  const [n, d] = simplify(a, b);
  if (d === 1) return String(n);
  if (mixed && n > d) {
    const whole = Math.floor(n / d);
    return `${whole} ${n - whole * d}/${d}`;
  }
  return `${n}/${d}`;
};

/**
 * Parse what a student typed into a number.
 * Accepts: "12", "1.5", ".5", "3/4", "1 1/2", "$5", "30%", "1,200", "5 dollars".
 * Returns null when it can't be read as a number.
 */
export const parseAnswer = (raw: string): number | null => {
  let s = raw.trim().toLowerCase().replace(/[$,%]/g, "");
  s = s.replace(/[a-z]+\.?/g, " ").trim(); // drop unit words
  if (!s) return null;
  const mixed = s.match(/^(-?\d+)\s+(\d+)\s*\/\s*(\d+)$/);
  if (mixed) {
    const d = Number(mixed[3]);
    if (!d) return null;
    const w = Number(mixed[1]);
    return w + Math.sign(w || 1) * (Number(mixed[2]) / d);
  }
  const frac = s.match(/^(-?\d*\.?\d+)\s*\/\s*(\d*\.?\d+)$/);
  if (frac) {
    const d = Number(frac[2]);
    return d ? Number(frac[1]) / d : null;
  }
  if (/^-?\d*\.?\d+$/.test(s)) return Number(s);
  return null;
};

export const near = (a: number, b: number, tol = 1e-6): boolean => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));

/** Answers like 0.33 for 1/3 are accepted when rounded to 2 decimals. */
export const numbersMatch = (given: number, expected: number): boolean =>
  near(given, expected) || (expected % 1 !== 0 && Math.abs(given - expected) < 0.006);
