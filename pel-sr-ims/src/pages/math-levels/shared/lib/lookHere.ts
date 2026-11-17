import { useEffect, useRef } from "react";

// ============================================================================
// "Look here" pointer (pilot: MG10 WholeNumberAndDecimalOperationsLab, 2026-11;
// shared by every lab's CFU since the CFU pointer rollout).
//
// Mark a teaching spot in Explore with `data-look-here="<id>"` (spread
// lookHereSpot("<id>") onto the element). A CFU question's "Go there" button
// calls lookHere(id): the page scrolls to that spot and it gets a colored
// outline and a "Look here" badge that stays until that part is answered
// right (clearLookHere). Elements inside the spot marked with
// `data-look-here-key` are also given a yellow background.
//
// Early-grade labs pass { arrow: true }: a big bouncing arrow also points at
// the spot (CSS only, no layout change).
//
// A spot that only shows in one Explore mode/tab (e.g. "Count back"): the
// Explore calls useLookHereRequest(id => setMode(...)) so it can switch to the
// mode that shows it; lookHere waits a moment for the spot to render.
//
// The CSS is injected once, so a lab needs no stylesheet changes to use it.
// ============================================================================

const STYLE_ID = "look-here-style";
const ON = "look-here-on";
const ARROW = "look-here-arrow";
const REQUEST = "look-here-request";
// A fat orange down-arrow with a white edge (a text glyph draws too thin).
const ARROW_SVG = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 66"><path d="M16 3h24v30h13L28 63 3 33h13z" fill="#f59e0b" stroke="#fff" stroke-width="4" stroke-linejoin="round"/></svg>');
const CSS = `
[data-look-here] { position: relative; border-radius: 10px; transition: outline-color .3s, box-shadow .3s; outline: 3px solid transparent; outline-offset: 6px; }
[data-look-here].${ON} { outline-color: #f59e0b; box-shadow: 0 0 0 10px rgba(245,158,11,.15); }
[data-look-here].${ON}::before { content: "Look here"; position: absolute; top: -18px; right: 4px; z-index: 2; background: #f59e0b; color: #1f2937; font-weight: 700; font-size: 14px; padding: 2px 10px; border-radius: 999px; pointer-events: none; }
[data-look-here].${ON} [data-look-here-key] { background: #fef3c7; font-weight: 700; border-radius: 4px; }
[data-look-here].${ON}.${ARROW} { outline-width: 5px; scroll-margin-top: 110px; }
[data-look-here].${ON}.${ARROW}::before { font-size: 18px; padding: 4px 14px; top: -22px; }
[data-look-here].${ON}.${ARROW}::after { content: ""; position: absolute; top: -76px; left: 12px; z-index: 3; width: 56px; height: 66px; background: url("${ARROW_SVG}") no-repeat center / contain; filter: drop-shadow(0 2px 3px rgba(0,0,0,.35)); pointer-events: none; animation: lookHereBounce 1s ease-in-out infinite; }
@keyframes lookHereBounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(14px); } }
@media (prefers-reduced-motion: reduce) { [data-look-here].${ON}.${ARROW}::after { animation: none; } }
`;

function ensureStyle() {
  if (typeof document === "undefined" || document.getElementById(STYLE_ID)) return;
  const s = document.createElement("style");
  s.id = STYLE_ID;
  s.textContent = CSS;
  document.head.appendChild(s);
}

/** Props that mark an Explore element as the teaching spot `id`. */
export const lookHereSpot = (id: string) => {
  ensureStyle();
  return { "data-look-here": id };
};

const find = (id: string) => document.querySelector<HTMLElement>(`[data-look-here="${id}"]`);

/**
 * Scroll to the Explore spot `id` and highlight it until clearLookHere(id).
 * Other lit spots are cleared unless listed in `keep` (the same question's
 * other still-wrong parts), so only one question's spots are lit at a time.
 * `arrow` (early-grade labs) adds a big bouncing arrow over the spot.
 */
export function lookHere(id: string, keep: string[] = [], opts: { arrow?: boolean } = {}) {
  ensureStyle();
  // Let an Explore switch to the mode/tab that shows this spot.
  window.dispatchEvent(new CustomEvent(REQUEST, { detail: id }));
  const light = (el: HTMLElement) => {
    document.querySelectorAll<HTMLElement>(`.${ON}`).forEach((x) => {
      if (!keep.includes(x.dataset.lookHere ?? "")) x.classList.remove(ON, ARROW);
    });
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.classList.add(ON);
    if (opts.arrow) el.classList.add(ARROW);
  };
  const el = find(id);
  if (el) return light(el);
  // Not on screen yet (the Explore is switching modes): try for ~1 s.
  let tries = 0;
  const retry = () => {
    const later = find(id);
    if (later) light(later);
    else if (++tries < 20) window.setTimeout(retry, 50);
  };
  window.setTimeout(retry, 0);
}

/** Remove the highlight from the Explore spot `id` (e.g. once its CFU question is right). */
export function clearLookHere(id: string) {
  if (typeof document === "undefined") return;
  document.querySelector(`[data-look-here="${id}"]`)?.classList.remove(ON, ARROW);
}

/**
 * For an Explore with modes/tabs: `onRequest(id)` runs when a CFU asks for
 * spot `id`, before the page looks for it, so the Explore can switch to the
 * mode that shows it (e.g. id === "mt-sub" → setMode("subtract")).
 */
export function useLookHereRequest(onRequest: (id: string) => void) {
  const ref = useRef(onRequest);
  useEffect(() => {
    ref.current = onRequest;
  });
  useEffect(() => {
    const h = (e: Event) => ref.current((e as CustomEvent<string>).detail);
    window.addEventListener(REQUEST, h);
    return () => window.removeEventListener(REQUEST, h);
  }, []);
}
