/**
 * Read-aloud playback: one reading at a time, word-by-word highlighting.
 *
 * - Uses the browser's built-in voices (window.speechSynthesis), free and no server.
 * - Each sentence is its own utterance, all queued synchronously inside the
 *   click handler: this keeps iOS happy (speech must start from a tap) and
 *   avoids Chrome cutting off long utterances.
 * - Highlighting follows the voice's `boundary` events. Safari/iOS often
 *   doesn't send them, so if none arrive shortly after a sentence starts we
 *   switch to estimating each word's timing from its syllable count.
 * - Highlights use the CSS Custom Highlight API (no DOM changes). Older
 *   browsers without it still get the outline on the block being read.
 */
import { buildChunks, wordAt, type Chunk } from "./reading";

export type Speed = "slow" | "normal" | "fast";
const RATES: Record<Speed, number> = { slow: 0.7, normal: 0.9, fast: 1.1 };
const SPEED_KEY = "mathlab.tts.speed.v2";
const TIMING_KEY = "mathlab.tts.timing";
const AUTO_KEY = "mathlab.tts.autoRead";

export interface TtsState {
  /** Id of the button/reader currently playing, or null. */
  playingId: string | null;
  speed: Speed;
  /**
   * Read new questions, feedback and hints out loud without a tap.
   * null = the student hasn't chosen yet (the lab shows a "turn on sound" banner).
   */
  autoRead: boolean | null;
}

const supported = typeof window !== "undefined" && "speechSynthesis" in window && typeof SpeechSynthesisUtterance !== "undefined";
export const isTtsSupported = (): boolean => supported;

function loadSpeed(): Speed {
  try {
    const v = localStorage.getItem(SPEED_KEY);
    if (v === "slow" || v === "normal" || v === "fast") return v;
  } catch {
    /* storage blocked */
  }
  return "slow";
}

function loadAutoRead(): boolean | null {
  try {
    const v = localStorage.getItem(AUTO_KEY);
    if (v === "on") return true;
    if (v === "off") return false;
  } catch {
    /* storage blocked */
  }
  return null;
}

// ---------- tiny external store (for useSyncExternalStore) ----------
let state: TtsState = { playingId: null, speed: loadSpeed(), autoRead: loadAutoRead() };
const listeners = new Set<() => void>();
const setState = (patch: Partial<TtsState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};
export const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
export const getState = () => state;

export function setSpeed(speed: Speed) {
  try {
    localStorage.setItem(SPEED_KEY, speed);
  } catch {
    /* storage blocked */
  }
  setState({ speed });
}

export function setAutoRead(on: boolean) {
  try {
    localStorage.setItem(AUTO_KEY, on ? "on" : "off");
  } catch {
    /* storage blocked */
  }
  setState({ autoRead: on });
}

/** Read text that isn't on screen (e.g. "Sound is on."). On iOS the first one must start from a tap. */
export function sayText(id: string, text: string) {
  const el = document.createElement("span");
  el.textContent = text;
  play(id, [el]);
}

// ---------- voice ----------
let voiceCache: SpeechSynthesisVoice | null | undefined;
// Voices that report word-by-word timing come first, so the highlight is exact.
// Microsoft voices (Windows, incl. Edge's "Natural" ones) and Apple's do;
// Chrome's "Google …" voices stream from a server and report nothing, so
// they're a last resort (the highlight then runs on estimated timing).
const VOICE_PREFS: ((v: SpeechSynthesisVoice) => boolean)[] = [
  (v) => /microsoft/i.test(v.name) && /natural/i.test(v.name),
  (v) => v.localService && /aria|jenny|zira|samantha|ava|allison|susan/i.test(v.name),
  (v) => v.localService && !/google/i.test(v.name),
  (v) => !/google/i.test(v.name),
];
function pickVoice(): SpeechSynthesisVoice | null {
  if (voiceCache !== undefined) return voiceCache;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null; // not loaded yet; retry next time
  const en = voices.filter((v) => /^en[-_]US/i.test(v.lang));
  const pool = en.length ? en : voices.filter((v) => /^en/i.test(v.lang));
  let pick: SpeechSynthesisVoice | undefined;
  for (const pref of VOICE_PREFS) {
    pick = pool.find(pref);
    if (pick) break;
  }
  voiceCache = pick ?? pool[0] ?? null;
  return voiceCache;
}

// ---------- timing estimate (only for voices that report no word timings) ----------
// Starts from a typical speaking pace, then after every sentence compares the
// real duration with the estimate and adjusts, remembered per voice + speed.
let timingScales: Record<string, number> = {};
try {
  timingScales = JSON.parse(localStorage.getItem(TIMING_KEY) ?? "{}") ?? {};
} catch {
  /* storage blocked / bad JSON */
}
const timingKey = (voice: SpeechSynthesisVoice | null, rate: number) => `${voice?.name ?? "default"}@${rate}`;
function learnTiming(key: string, actualMs: number, estimatedMs: number) {
  if (estimatedMs < 400 || actualMs < 200) return; // too short to measure well
  const ratio = Math.min(3, Math.max(0.33, actualMs / estimatedMs));
  const prev = timingScales[key] ?? 1;
  timingScales[key] = prev * (0.4 + 0.6 * ratio); // move most of the way toward the measured pace
  try {
    localStorage.setItem(TIMING_KEY, JSON.stringify(timingScales));
  } catch {
    /* storage blocked */
  }
}

// ---------- highlighting ----------
type HighlightCtor = new (...ranges: Range[]) => Highlight;
const highlightApi = typeof CSS !== "undefined" && "highlights" in CSS && typeof (globalThis as { Highlight?: unknown }).Highlight === "function";

let activeEl: Element | null = null;
let activeRoot: Element | null = null;

function setHighlight(name: string, range: Range | null) {
  if (!highlightApi) return;
  if (range) CSS.highlights.set(name, new ((globalThis as unknown as { Highlight: HighlightCtor }).Highlight)(range));
  else CSS.highlights.delete(name);
}

function sentenceRange(chunk: Chunk): Range | null {
  const ranged = chunk.words.filter((w) => w.range);
  if (ranged.length === 0) return null;
  const r = document.createRange();
  try {
    r.setStart(ranged[0].range!.startContainer, ranged[0].range!.startOffset);
    r.setEnd(ranged[ranged.length - 1].range!.endContainer, ranged[ranged.length - 1].range!.endOffset);
  } catch {
    return null;
  }
  return r;
}

function showWord(chunk: Chunk, i: number) {
  const w = chunk.words[i];
  if (!w) return;
  setHighlight("tts-word", w.range ?? null);
  if (activeEl !== (w.el ?? null)) {
    activeEl?.classList.remove("tts-el-active");
    activeEl = w.el ?? null;
    activeEl?.classList.add("tts-el-active");
  }
}

function showChunk(chunk: Chunk) {
  if (activeRoot !== chunk.root) {
    activeRoot?.classList.remove("tts-reading");
    activeRoot = chunk.root;
    activeRoot.classList.add("tts-reading");
  }
  setHighlight("tts-sentence", sentenceRange(chunk));
  showWord(chunk, 0);
}

function clearHighlights() {
  setHighlight("tts-word", null);
  setHighlight("tts-sentence", null);
  activeEl?.classList.remove("tts-el-active");
  activeRoot?.classList.remove("tts-reading");
  activeEl = null;
  activeRoot = null;
}

// ---------- playback ----------
let session = 0;
let fallbackTimer: number | undefined;
// Chrome drops events for utterances that get garbage-collected mid-queue.
let liveUtterances: SpeechSynthesisUtterance[] = [];

const stopFallback = () => {
  if (fallbackTimer !== undefined) window.clearInterval(fallbackTimer);
  fallbackTimer = undefined;
};

/** Estimated start time (ms) of each word, plus the sentence's total, for voices with no word timings. */
function schedule(chunk: Chunk, rate: number, scale: number): { starts: number[]; total: number } {
  let t = 0;
  const starts = chunk.words.map((w) => {
    const startAt = t;
    t += ((w.weight * 175 + (/[.,!?;:]$/.test(w.spoken) ? 180 : 30)) / rate) * scale;
    return startAt;
  });
  return { starts, total: t };
}

function finish() {
  stopFallback();
  clearHighlights();
  liveUtterances = [];
  if (state.playingId !== null) setState({ playingId: null });
}

export function stop() {
  session++;
  if (supported) window.speechSynthesis.cancel();
  finish();
}

/** Stop only if something is reading (cheap to call from effects). */
export function stopIfPlaying() {
  if (state.playingId !== null) stop();
}

/** Read `roots` aloud in order. `id` identifies who started it (for play/stop icons). */
export function play(id: string, roots: Element[]) {
  if (!supported) return;
  stop();
  const chunks = roots.flatMap((r) => buildChunks(r));
  if (chunks.length === 0) return;

  const my = ++session;
  const synth = window.speechSynthesis;
  const rate = RATES[state.speed];
  const voice = pickVoice();
  let boundaryWorks = false;
  let boundaryKnownMissing = false;
  let chunkStartedAt = 0;
  let chunkEstimate = 0;
  const tKey = timingKey(voice, rate);
  if (import.meta.env.DEV) console.info(`[read-aloud] voice: ${voice?.name ?? "browser default"} @ rate ${rate}`);
  setState({ playingId: id });

  chunks.forEach((chunk, ci) => {
    const u = new SpeechSynthesisUtterance(chunk.text);
    u.rate = rate;
    if (voice) u.voice = voice;
    u.lang = voice?.lang ?? "en-US";
    let gotBoundary = false;

    u.onstart = () => {
      if (my !== session) return;
      stopFallback();
      showChunk(chunk);
      chunkEstimate = 0;
      if (boundaryWorks) return;
      // Give the voice a moment to report word timings; if it doesn't, estimate.
      chunkStartedAt = performance.now();
      const { starts, total } = schedule(chunk, rate, timingScales[tKey] ?? 1);
      chunkEstimate = total;
      fallbackTimer = window.setInterval(() => {
        if (my !== session || gotBoundary) return stopFallback();
        const elapsed = performance.now() - chunkStartedAt;
        if (elapsed < 300 && !boundaryKnownMissing) return;
        if (!boundaryKnownMissing && import.meta.env.DEV) console.info("[read-aloud] this voice sends no word timings: highlighting by estimate");
        boundaryKnownMissing = true;
        let i = 0;
        while (i + 1 < starts.length && starts[i + 1] <= elapsed) i++;
        showWord(chunk, i);
      }, 40);
    };
    u.onboundary = (e) => {
      if (my !== session || (e.name && e.name !== "word")) return;
      if (!boundaryWorks && import.meta.env.DEV) console.info("[read-aloud] highlighting from the voice's own word timings");
      gotBoundary = boundaryWorks = true;
      stopFallback();
      showWord(chunk, wordAt(chunk, e.charIndex));
    };
    u.onend = () => {
      if (my !== session) return;
      if (!gotBoundary && chunkEstimate > 0) learnTiming(tKey, performance.now() - chunkStartedAt, chunkEstimate);
      if (ci === chunks.length - 1) finish();
    };
    u.onerror = (e) => {
      if (my !== session || e.error === "interrupted" || e.error === "canceled") return;
      if (ci === chunks.length - 1) finish();
    };
    liveUtterances.push(u);
    synth.speak(u);
  });
}

if (supported) {
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    voiceCache = undefined;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
}
