// ============================================================================
// "Look here" pointer (pilot: MG10 WholeNumberAndDecimalOperationsLab, 2026-11).
//
// Mark a teaching spot in Explore with `data-look-here="<id>"` (spread
// lookHereSpot("<id>") onto the element). A CFU question with an
// `exploreTarget` calls lookHere(id) from its "Go there" button: the page
// scrolls to that spot and it gets a colored outline and a "Look here" badge
// that stays until that part is answered right (clearLookHere). Elements inside the
// spot marked with `data-look-here-key` are also given a yellow background.
// The CSS is injected once, so a lab needs no stylesheet changes to use it.
// ============================================================================

const STYLE_ID = "look-here-style";
const ON = "look-here-on";
const CSS = `
[data-look-here] { position: relative; border-radius: 10px; transition: outline-color .3s, box-shadow .3s; outline: 3px solid transparent; outline-offset: 6px; }
[data-look-here].${ON} { outline-color: #f59e0b; box-shadow: 0 0 0 10px rgba(245,158,11,.15); }
[data-look-here].${ON}::before { content: "Look here"; position: absolute; top: -18px; right: 4px; z-index: 2; background: #f59e0b; color: #1f2937; font-weight: 700; font-size: 14px; padding: 2px 10px; border-radius: 999px; pointer-events: none; }
[data-look-here].${ON} [data-look-here-key] { background: #fef3c7; font-weight: 700; border-radius: 4px; }
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

/**
 * Scroll to the Explore spot `id` and highlight it until clearLookHere(id).
 * Other lit spots are cleared unless listed in `keep` (the same question's
 * other still-wrong parts), so only one question's spots are lit at a time.
 */
export function lookHere(id: string, keep: string[] = []) {
  ensureStyle();
  const el = document.querySelector<HTMLElement>(`[data-look-here="${id}"]`);
  if (!el) return;
  document.querySelectorAll<HTMLElement>(`.${ON}`).forEach((x) => {
    if (!keep.includes(x.dataset.lookHere ?? "")) x.classList.remove(ON);
  });
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add(ON);
}

/** Remove the highlight from the Explore spot `id` (e.g. once its CFU question is right). */
export function clearLookHere(id: string) {
  if (typeof document === "undefined") return;
  document.querySelector(`[data-look-here="${id}"]`)?.classList.remove(ON);
}
