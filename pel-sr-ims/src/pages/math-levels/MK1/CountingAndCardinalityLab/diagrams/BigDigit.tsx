/**
 * A big numeral. `mirrored` writes it backwards (a left-right reversal, the
 * mistake young writers make). `upsideDown` turns it over (rotated 180°),
 * which is how a 6 becomes a 9. Never use `mirrored` to show "upside down".
 */
export function BigDigit({ d, mirrored = false, upsideDown = false, size = 54 }: { d: string | number; mirrored?: boolean; upsideDown?: boolean; size?: number }) {
  const transform = upsideDown ? "rotate(180deg)" : mirrored ? "scaleX(-1)" : undefined;
  return (
    <span style={{ display: "inline-block", fontSize: size, fontWeight: 800, lineHeight: 1, fontFamily: "'Courier New', monospace", transform, transition: "transform 0.6s" }}>
      {d}
    </span>
  );
}
