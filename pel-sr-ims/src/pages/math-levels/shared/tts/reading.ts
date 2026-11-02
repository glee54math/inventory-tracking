/**
 * Walks the rendered DOM of a read-aloud block and builds what to speak,
 * split into sentence-sized chunks. Every spoken word remembers where it
 * sits on screen (a DOM Range over the original text node, or the element
 * itself for things like dropdowns), so the engine can highlight it while
 * it's spoken. Reading from the DOM, instead of from props, means any JSX
 * (bold, colored QA/QB spans, fractions…) can be wrapped without changes.
 *
 * Opt-outs / overrides, as data attributes:
 *   data-tts-skip        — never read this element (e.g. the speaker icon).
 *   data-tts-say="..."   — read this text instead of the element's contents;
 *                          the whole element highlights as one word.
 */
import { tokenizeForSpeech, speakableText } from "./mathSpeech";

export interface SpokenWord {
  spoken: string;
  /** Exact characters on screen, when the word came from a text node. */
  range?: Range;
  /** Element to outline instead (dropdowns, inputs, data-tts-say). */
  el?: Element;
  /** Estimated syllables, for the timing fallback. */
  weight: number;
}

export interface Chunk {
  root: Element;
  words: SpokenWord[];
  /** The utterance text: words joined by spaces. */
  text: string;
  /** Character offset of each word inside `text`, ascending. */
  offsets: number[];
}

const BLOCK_TAGS = new Set([
  "P", "DIV", "LI", "UL", "OL", "H1", "H2", "H3", "H4", "H5", "H6", "BUTTON",
  "SECTION", "ASIDE", "HEADER", "FOOTER", "TR", "TABLE", "BLOCKQUOTE", "FIGCAPTION", "BR",
]);
const SKIP_TAGS = new Set(["SCRIPT", "STYLE", "TEMPLATE", "NOSCRIPT", "OPTION"]);
const SENTENCE_END = /[.!?]$/;

function syllables(spoken: string): number {
  let n = 0;
  for (const part of spoken.split(/\s+/)) {
    if (!part) continue;
    if (/^\d/.test(part)) n += Math.max(1, Math.round(part.replace(/\D/g, "").length * 1.4));
    else n += Math.max(1, (part.toLowerCase().match(/[aeiouy]+/g) ?? []).length);
  }
  return Math.max(1, n);
}

function optionList(select: HTMLSelectElement): string {
  const opts = Array.from(select.options)
    .filter((o) => !o.disabled && o.value !== "")
    .map((o) => speakableText(o.text).replace(/[.,]$/, ""))
    .filter(Boolean);
  if (opts.length === 0) return "";
  if (opts.length === 1) return `choose ${opts[0]}`;
  return `choose from ${opts.slice(0, -1).join(", ")}, or ${opts[opts.length - 1]}`;
}

function isHidden(el: Element): boolean {
  if (el.hasAttribute("data-tts-skip") || el.getAttribute("aria-hidden") === "true") return true;
  if (el instanceof HTMLElement && el.hidden) return true;
  if (el instanceof SVGElement) return true; // diagrams are out of scope
  return SKIP_TAGS.has(el.tagName);
}

class Builder {
  chunks: Chunk[] = [];
  private words: SpokenWord[] = [];
  private root: Element;
  constructor(root: Element) {
    this.root = root;
  }

  push(word: Omit<SpokenWord, "weight">) {
    if (!word.spoken) return;
    this.words.push({ ...word, weight: syllables(word.spoken) });
  }

  punct(p: string) {
    const last = this.words[this.words.length - 1];
    if (!last || !p) return;
    if (!/[.,!?;:]$/.test(last.spoken)) last.spoken += p;
    if (SENTENCE_END.test(p)) this.flush();
  }

  /** Block boundary: end the sentence so the voice pauses. */
  brk() {
    const last = this.words[this.words.length - 1];
    if (last && !/[.,!?;:]$/.test(last.spoken)) last.spoken += ".";
    this.flush();
  }

  flush() {
    if (this.words.length === 0) return;
    const offsets: number[] = [];
    let text = "";
    for (const w of this.words) {
      if (text) text += " ";
      offsets.push(text.length);
      text += w.spoken;
    }
    this.chunks.push({ root: this.root, words: this.words, text, offsets });
    this.words = [];
  }
}

function visit(node: Node, b: Builder) {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.nodeValue ?? "";
    for (const t of tokenizeForSpeech(text)) {
      if (t.punct) {
        b.punct(t.spoken);
        continue;
      }
      const range = document.createRange();
      range.setStart(node, t.start);
      range.setEnd(node, t.end);
      b.push({ spoken: t.spoken, range });
    }
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;
  const el = node as Element;
  if (isHidden(el)) return;

  const say = el.getAttribute("data-tts-say");
  if (say !== null) {
    b.push({ spoken: speakableText(say), el });
    return;
  }
  if (el instanceof HTMLSelectElement) {
    b.push({ spoken: optionList(el), el });
    return;
  }
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    const type = el instanceof HTMLInputElement ? el.type : "text";
    if (["text", "number", "search", "tel", "textarea"].includes(type)) {
      b.push({ spoken: el.value.trim() ? speakableText(el.value) : "blank", el });
    }
    return;
  }

  const block = BLOCK_TAGS.has(el.tagName);
  if (block) b.brk();
  for (const child of Array.from(el.childNodes)) visit(child, b);
  if (block) b.brk();
}

/** Everything to say for one block, as sentence chunks. */
export function buildChunks(root: Element): Chunk[] {
  const b = new Builder(root);
  const say = root.getAttribute("data-tts-say");
  if (say !== null) b.push({ spoken: speakableText(say), el: root });
  else for (const child of Array.from(root.childNodes)) visit(child, b);
  b.flush();
  return b.chunks;
}

/** Index of the word containing utterance character `charIndex`. */
export function wordAt(chunk: Chunk, charIndex: number): number {
  let lo = 0;
  let hi = chunk.offsets.length - 1;
  while (lo < hi) {
    const mid = (lo + hi + 1) >> 1;
    if (chunk.offsets[mid] <= charIndex) lo = mid;
    else hi = mid - 1;
  }
  return lo;
}
