import React from "react";

// ============================================================================
// FactFamilyTriangle — the visual for Unit 2 (Division as an Unknown-Factor
// Problem): three numbers (two factors `a`/`b` and their product `c`) at the
// corners of a triangle, with the full fact family listed below it. This is
// how a multiplication fact and its two related division facts are shown as
// ONE relationship, not three separate facts. When `a === b` (a square fact,
// e.g. 6x6=36), the family only has ONE division fact, not two — the
// triangle and the listed equations both reflect that collapse rather than
// printing a duplicate. `unknown` blanks out that one corner with "?" (the
// vertex the student is solving for); omit it to show every corner filled in
// (Explore's free-play mode).
// ============================================================================

export interface FactFamilyProps {
  a: number;
  b: number;
  c: number;
  unknown?: "a" | "b" | "c" | "none";
  tone?: "a" | "b" | "c";
}

export function FactFamilyTriangle({ a, b, c, unknown = "none", tone = "a" }: FactFamilyProps) {
  const toneColor = `var(--q${tone})`;
  const show = (slot: "a" | "b" | "c", val: number) => (unknown === slot ? "?" : String(val));
  const isSquare = a === b;

  const vertex = (slot: "a" | "b" | "c", val: number, x: number, y: number) => (
    <g key={slot} transform={`translate(${x},${y})`}>
      <circle r={24} fill={unknown === slot ? "var(--card)" : toneColor} stroke={toneColor} strokeWidth={3} />
      <text x={0} y={6} textAnchor="middle" fontSize={20} fontWeight={700} fill={unknown === slot ? toneColor : "var(--on-q)"}>
        {show(slot, val)}
      </text>
    </g>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <svg width={180} height={150} viewBox="0 0 180 150" role="img" aria-label={`Fact family for ${a}, ${b}, ${c}`}>
        <polygon points="90,20 30,120 150,120" fill="none" stroke="var(--line)" strokeWidth={2} />
        {vertex("c", c, 90, 20)}
        {vertex("a", a, 30, 120)}
        {vertex("b", b, 150, 120)}
      </svg>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2, fontSize: 15, fontFamily: "'Courier New', monospace" }}>
        <li>
          {show("a", a)} × {show("b", b)} = {show("c", c)}
        </li>
        {!isSquare && (
          <li>
            {show("b", b)} × {show("a", a)} = {show("c", c)}
          </li>
        )}
        <li>
          {show("c", c)} ÷ {show("a", a)} = {show("b", b)}
        </li>
        {!isSquare && (
          <li>
            {show("c", c)} ÷ {show("b", b)} = {show("a", a)}
          </li>
        )}
      </ul>
      {isSquare && (
        <p className="muted small" style={{ margin: 0, textAlign: "center" }}>
          {a} × {a} is a square fact — it only makes ONE division fact, not two.
        </p>
      )}
    </div>
  );
}
