import { useEffect, useState } from "react";
import type { Unit } from "../units/types";

export interface UnitPreviewCarouselProps {
  units: Unit[];
  onPick: (i: number) => void;
  /** Milliseconds between auto-advances. */
  intervalMs?: number;
}

/**
 * Cycles through each unit's `preview` component on the cover page: one card
 * at a time (title, goal, a small static diagram), auto-advancing and
 * looping back to the first unit. Hovering or focusing the card pauses the
 * auto-advance — a keyboard user tabbing onto it shouldn't have it change
 * out from under them. Clicking the card or a dot jumps straight into that
 * unit, same as the "Your path" list below it.
 *
 * Only ever renders one card, keyed by unit id so each advance remounts it
 * and replays the CSS entrance animation (see .unit-carousel-card's
 * `animation` rule) — this sidesteps the usual carousel "wrap seam" problem,
 * since there's never a multi-card track that would visibly slide backwards
 * through every card when looping from the last unit to the first.
 */
export function UnitPreviewCarousel({ units, onPick, intervalMs = 2500 }: UnitPreviewCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (paused || reducedMotion || units.length <= 1) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % units.length), intervalMs);
    return () => clearInterval(id);
  }, [paused, reducedMotion, units.length, intervalMs]);

  // Keep index valid if the unit list itself ever changes length.
  useEffect(() => {
    if (index >= units.length) setIndex(0);
  }, [index, units.length]);

  if (units.length === 0) return null;
  const unit = units[Math.min(index, units.length - 1)];
  const Preview = unit.preview;

  return (
    <div className="unit-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <button key={unit.id} className="unit-carousel-card" onClick={() => onPick(index)} aria-label={`Go to ${unit.title}`}>
        {Preview && (
          <div className="unit-carousel-art">
            <Preview />
          </div>
        )}
        <div className="unit-carousel-title">{unit.title}</div>
        <div className="unit-carousel-goal">{unit.goal}</div>
      </button>
      {units.length > 1 && (
        <div className="unit-carousel-dots" role="tablist" aria-label="Unit previews">
          {units.map((u, i) => (
            <button key={u.id} role="tab" aria-selected={i === index} aria-label={`Go to ${u.title}`} className={i === index ? "on" : ""} onClick={() => setIndex(i)} />
          ))}
        </div>
      )}
    </div>
  );
}
