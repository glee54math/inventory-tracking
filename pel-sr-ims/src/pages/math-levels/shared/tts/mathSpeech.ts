/**
 * Turns on-screen text into what the read-aloud voice should say, token by
 * token, so math reads the way a teacher would say it ("8 + 3 = ?" →
 * "8 plus 3 equals what number"). Each token keeps its [start, end) position
 * in the source text so the highlighter can light up the exact characters
 * on screen while the matching words are spoken.
 *
 * Digits are left as digits: every browser voice already reads "11" as
 * "eleven", and keeping them lets the highlighter match them 1:1.
 */

export interface SpeechToken {
  start: number;
  end: number;
  /** What to say. Empty = say nothing (e.g. an emoji). */
  spoken: string;
  /** Punctuation: attaches to the previous word instead of being its own word. */
  punct?: boolean;
}

const FRACTION_NAMES: Record<number, [string, string]> = {
  2: ["half", "halves"],
  3: ["third", "thirds"],
  4: ["fourth", "fourths"],
  5: ["fifth", "fifths"],
  6: ["sixth", "sixths"],
  8: ["eighth", "eighths"],
  10: ["tenth", "tenths"],
  12: ["twelfth", "twelfths"],
  100: ["hundredth", "hundredths"],
};

/** 3/4 → "3 fourths", 1/2 → "one half". */
export function fractionWords(n: number, d: number): string {
  const names = FRACTION_NAMES[d];
  if (!names) return `${n} over ${d}`;
  return n === 1 ? `one ${names[0]}` : `${n} ${names[1]}`;
}

const VULGAR: Record<string, string> = {
  "½": "one half",
  "⅓": "one third",
  "⅔": "two thirds",
  "¼": "one fourth",
  "¾": "three fourths",
  "⅛": "one eighth",
};

const SYMBOLS: Record<string, string> = {
  "+": "plus",
  "−": "minus",
  "×": "times",
  "÷": "divided by",
  "=": "equals",
  "≠": "does not equal",
  "<": "is less than",
  ">": "is greater than",
  "≤": "is less than or equal to",
  "≥": "is greater than or equal to",
  "¢": "cents",
  "%": "percent",
  "°": "degrees",
  "&": "and",
  "☐": "blank",
  "□": "blank",
};

/** Kept as-is so the voice pauses naturally. */
const PAUSE_PUNCT = new Set([".", ",", "!", "?", ";", ":"]);
/** Dashes read as a short pause. */
const DASHES = new Set(["—", "–"]);

function moneyWords(raw: string): string {
  const [dollarsStr, centsStr] = raw.slice(1).split(".");
  const dollars = Number(dollarsStr.replace(/,/g, ""));
  const cents = centsStr ? Number(centsStr) : 0;
  const d = dollars === 1 ? "1 dollar" : `${dollarsStr} dollars`;
  const c = cents === 1 ? "1 cent" : `${cents} cents`;
  if (dollars === 0 && cents > 0) return c;
  if (cents === 0) return d;
  return `${d} and ${c}`;
}

function clockWords(raw: string): string {
  const [h, m] = raw.split(":");
  const hour = String(Number(h));
  if (m === "00") return `${hour} o'clock`;
  if (m.startsWith("0")) return `${hour} oh ${m[1]}`;
  return `${hour} ${m}`;
}

// Order matters: longer/more specific patterns first.
const TOKEN_RE = new RegExp(
  [
    String.raw`(?<money>\$\d[\d,]*(?:\.\d{2})?)`,
    String.raw`(?<clock>\d{1,2}:\d{2}(?!\d))`,
    String.raw`(?<frac>\d+\/\d+)`,
    String.raw`(?<num>\d[\d,]*(?:\.\d+)?[A-Za-z]*)`,
    String.raw`(?<word>[A-Za-zÀ-ɏ]+(?:['’\-][A-Za-zÀ-ɏ]+)*)`,
    String.raw`(?<blank>_+)`,
    String.raw`(?<space>\s+)`,
    String.raw`(?<other>.)`,
  ].join("|"),
  "gsu"
);

/** Lowercase SHOUTED words ("START", "MORE") so no voice spells them out. */
const normalizeWord = (w: string): string => (w.length >= 3 && /^[A-Z'’-]+$/.test(w) ? w.toLowerCase() : w);

const isMathOperand = (t: SpeechToken | undefined, src: string): boolean => {
  if (!t) return false;
  const s = src.slice(t.start, t.end);
  return /^\d/.test(s) || /^_+$/.test(s) || s === "?" || s === ")";
};

export function tokenizeForSpeech(text: string): SpeechToken[] {
  const out: SpeechToken[] = [];
  let lastNonSpace: SpeechToken | undefined;
  for (const m of text.matchAll(TOKEN_RE)) {
    const start = m.index ?? 0;
    const raw = m[0];
    const end = start + raw.length;
    const g = m.groups ?? {};
    let tok: SpeechToken | null = null;

    if (g.space !== undefined) continue;
    else if (g.money !== undefined) tok = { start, end, spoken: moneyWords(raw) };
    else if (g.clock !== undefined) tok = { start, end, spoken: clockWords(raw) };
    else if (g.frac !== undefined) {
      const [n, d] = raw.split("/").map(Number);
      tok = { start, end, spoken: fractionWords(n, d) };
    } else if (g.num !== undefined) tok = { start, end, spoken: raw };
    else if (g.word !== undefined) tok = { start, end, spoken: normalizeWord(raw) };
    else if (g.blank !== undefined) tok = { start, end, spoken: "blank" };
    else {
      const ch = raw;
      const next = text.slice(end).trimStart()[0] ?? "";
      const prevIsSpace = start === 0 || /\s/.test(text[start - 1]);
      if (VULGAR[ch]) tok = { start, end, spoken: VULGAR[ch] };
      else if (SYMBOLS[ch]) tok = { start, end, spoken: SYMBOLS[ch] };
      else if (ch === "-") {
        // "8 - 3" is minus; a dash in prose is a pause.
        const minus = isMathOperand(lastNonSpace, text) && /[\d_?(]/.test(next);
        tok = minus ? { start, end, spoken: "minus" } : { start, end, spoken: ",", punct: true };
      } else if (ch === "?" && prevIsSpace) tok = { start, end, spoken: "what number" };
      else if (PAUSE_PUNCT.has(ch)) tok = { start, end, spoken: ch, punct: true };
      else if (DASHES.has(ch)) tok = { start, end, spoken: ",", punct: true };
      else tok = { start, end, spoken: "", punct: true }; // quotes, brackets, emoji, arrows
    }
    out.push(tok);
    lastNonSpace = tok;
  }
  return out;
}

/** Whole-string convenience: what the voice would say for `text`. */
export function speakableText(text: string): string {
  let s = "";
  for (const t of tokenizeForSpeech(text)) {
    if (!t.spoken) continue;
    s += t.punct ? t.spoken : (s ? " " : "") + t.spoken;
  }
  return s;
}
