/**
 * Number model for place-value work.
 * A number is a list of significant digits, each tagged with its place
 * (0 = ones, 1 = tens, -1 = tenths, ...). Multiplying or dividing by 10^n
 * is just adding/subtracting n from every place, which avoids floating-point errors.
 */
export type Digit = { d: number; place: number };

export const MIN_PLACE = -3; // thousandths
export const MAX_PLACE = 6; // millions

export const PLACE_NAMES: Record<number, string> = {
  6: 'Millions', 5: 'Hundred thousands', 4: 'Ten thousands', 3: 'Thousands',
  2: 'Hundreds', 1: 'Tens', 0: 'Ones', [-1]: 'Tenths', [-2]: 'Hundredths', [-3]: 'Thousandths',
};

export const PLACE_SHORT: Record<number, string> = {
  6: 'M', 5: 'HTh', 4: 'TTh', 3: 'Th', 2: 'H', 1: 'T', 0: 'O', [-1]: 't', [-2]: 'h', [-3]: 'th',
};

export const POW = ['1', '10', '100', '1,000', '10,000', '100,000', '1,000,000'];

/** Parse "3,452.10" into significant digits. Returns null for invalid input, [] for zero. */
export function parseNum(input: string): Digit[] | null {
  const s = input.replace(/[,\s]/g, '');
  if (s === '' || s === '.' || !/^\d*\.?\d*$/.test(s)) return null;
  const [ip = '', fp = ''] = s.split('.');
  const raw: Digit[] = [];
  for (let i = 0; i < ip.length; i++) raw.push({ d: Number(ip[i]), place: ip.length - 1 - i });
  for (let i = 0; i < fp.length; i++) raw.push({ d: Number(fp[i]), place: -(i + 1) });
  const first = raw.findIndex((t) => t.d !== 0);
  if (first < 0) return [];
  let last = raw.length - 1;
  while (raw[last].d === 0) last--;
  return raw.slice(first, last + 1);
}

const withCommas = (ip: string) => ip.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

/** Format digits back into a number string, filling placeholder zeros. */
export function toStr(tiles: readonly Digit[], useCommas = true): string {
  if (!tiles.length) return '0';
  const places = tiles.map((t) => t.place);
  const maxP = Math.max(...places, 0);
  const minP = Math.min(...places, 0);
  const byPlace = new Map(tiles.map((t) => [t.place, t.d]));
  let ip = '';
  let fp = '';
  for (let p = maxP; p >= 0; p--) ip += byPlace.get(p) ?? 0;
  for (let p = -1; p >= minP; p--) fp += byPlace.get(p) ?? 0;
  if (useCommas) ip = withCommas(ip);
  return fp ? `${ip}.${fp}` : ip;
}

/** Normalized comparison form ("4,750.0" -> "4750"), or null if invalid. */
export function canon(s: string): string | null {
  const p = parseNum(s);
  return p ? toStr(p, false) : null;
}

/** Shift every digit n places (positive = left = multiply by 10^n). */
export const shift = <T extends Digit>(tiles: readonly T[], n: number): T[] =>
  tiles.map((t) => ({ ...t, place: t.place + n }));

export const fits = (tiles: readonly Digit[]) =>
  tiles.every((t) => t.place >= MIN_PLACE && t.place <= MAX_PLACE);

/** Zeros needed to hold the decimal point in place (e.g. the 0 in 250 or 0.05). */
export function placeholders(tiles: readonly Digit[]): Digit[] {
  if (!tiles.length) return [];
  const places = tiles.map((t) => t.place);
  const set = new Set(places);
  const maxP = Math.max(...places, 0);
  const minP = Math.min(...places, 0);
  const out: Digit[] = [];
  for (let p = maxP; p >= minP; p--) if (!set.has(p)) out.push({ d: 0, place: p });
  return out;
}

export const ri = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
export const pick = <T,>(arr: readonly T[]): T => arr[Math.floor(Math.random() * arr.length)];
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Random number with 1..maxNd significant digits whose leading digit sits at a place in [topMin, topMax]. */
export function randNum(maxNd = 4, topMin = -1, topMax = 3): Digit[] {
  const nd = ri(1, maxNd);
  const top = ri(topMin, topMax);
  const digits: number[] = [];
  for (let i = 0; i < nd; i++) digits.push(ri(0, 9));
  digits[0] = ri(1, 9);
  digits[nd - 1] = ri(1, 9);
  return digits.map((d, i) => ({ d, place: top - i }));
}

export const plural = (n: number) => (n === 1 ? 'place' : 'places');
