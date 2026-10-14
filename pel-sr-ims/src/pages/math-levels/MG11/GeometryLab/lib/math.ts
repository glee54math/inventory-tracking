// lib/math.ts — number helpers shared by every module.

export const gcd = (a: number, b: number): number => (b === 0 ? Math.abs(a) : gcd(b, a % b));

/** Parses student input: "12", "7.5", "3/4", "1 1/2", "-2". Returns NaN if unreadable. */
export function parseNumber(raw: string): number {
  const s = raw.trim().replace(/,/g, "").replace(/\s+/g, " ");
  if (!s) return NaN;
  let m = s.match(/^(-?)(\d+) (\d+)\/(\d+)$/);
  if (m) {
    const v = +m[2] + +m[3] / +m[4];
    return m[1] ? -v : v;
  }
  m = s.match(/^(-?\d+)\/(\d+)$/);
  if (m) return +m[2] === 0 ? NaN : +m[1] / +m[2];
  if (/^-?(\d+\.?\d*|\.\d+)$/.test(s)) return parseFloat(s);
  return NaN;
}

export const approxEq = (a: number, b: number, eps = 1e-6) => Math.abs(a - b) < eps;

export type FracParts = { neg: boolean; whole: number; num: number; den: number };

/** Splits a number into a mixed number when it has a "nice" denominator. */
export function toFraction(n: number): FracParts | null {
  const neg = n < 0;
  const a = Math.abs(n);
  for (const d of [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 16, 18, 24, 27, 32, 36, 48, 64]) {
    const num = Math.round(a * d);
    if (Math.abs(num / d - a) < 1e-9) {
      const g = gcd(num, d) || 1;
      const N = num / g;
      const D = d / g;
      return { neg, whole: Math.floor(N / D), num: N % D, den: D };
    }
  }
  return null;
}

/** "1 1/2", "3/4", "12" — plain-text form used in labels. */
export function fmt(n: number): string {
  const f = toFraction(n);
  if (!f) return String(Math.round(n * 1000) / 1000);
  const sign = f.neg && (f.whole || f.num) ? "-" : "";
  if (f.num === 0) return sign + f.whole;
  return sign + (f.whole ? `${f.whole} ${f.num}/${f.den}` : `${f.num}/${f.den}`);
}

export const randInt = (lo: number, hi: number) => lo + Math.floor(Math.random() * (hi - lo + 1));
export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
export const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
