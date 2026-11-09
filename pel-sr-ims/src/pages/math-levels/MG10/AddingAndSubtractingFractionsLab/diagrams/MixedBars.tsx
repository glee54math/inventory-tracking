import { MixedNumberBars, PieceBars, type MixedNumberBarsProps } from "../../../shared/diagrams";

/** Narrower pieces than this (px) can't be counted, so the loose bar is drawn wide. */
const MIN_PIECE_PX = 8;

/**
 * The shared MixedNumberBars, except when its pieces would be narrower than
 * 8 px (Unit 4's 110 px bars from LCD 14 up; LCD 24–48 gave 2–5 px slivers).
 * Then the solid wholes stay as they are and the loose bar(s) are drawn wide
 * (about 12 px a piece), each on its own row, with a line saying so.
 * Lab-local on purpose: it only wraps the shared diagram, and only this lab
 * draws mixed numbers with LCDs this big (MG10 review C1-09).
 */
export function MixedBars(props: MixedNumberBarsProps) {
  const { wholes, num, den, tone = "a", takeWholes = 0, takeNum = 0, barWidth = 150, height = 48, caption, ringLastWhole } = props;
  if (num === 0 || barWidth / den >= MIN_PIECE_PX) return <MixedNumberBars {...props} />;
  const wide = Math.min(600, Math.max(260, den * 12));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {wholes > 0 && <MixedNumberBars wholes={wholes} num={0} den={den} tone={tone} takeWholes={takeWholes} barWidth={barWidth} height={height} ringLastWhole={ringLastWhole} />}
      <p className="muted small" style={{ margin: 0 }}>
        {num > den ? `We drew these wholes bigger. Each one has ${den} pieces.` : `We drew this whole bigger. It has ${den} pieces.`}
      </p>
      <PieceBars
        den={den}
        segments={[
          { count: num - takeNum, tone },
          { count: takeNum, tone: "gone" },
        ]}
        barWidth={wide}
        height={height}
        caption={caption}
      />
    </div>
  );
}
