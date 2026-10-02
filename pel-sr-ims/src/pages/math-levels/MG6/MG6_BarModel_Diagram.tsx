import type { Problem } from "./MG6_BarModel_types";

interface Props {
  problem: Problem;
  /** 0: B unknown, 1: B solved (show total bracket), 2: total solved */
  stage: 0 | 1 | 2;
}

const X0 = 90;
const MAX_W = 380;

export default function BarModelDiagram({ problem, stage }: Props) {
  const { A, B, n, d, bVal, total, item } = problem;
  const scale = MAX_W / Math.max(n, bVal);
  const wA = n * scale;
  const wB = bVal * scale;
  const short = Math.min(wA, wB);
  const long = Math.max(wA, wB);
  const bIsShort = bVal < n;
  const diffY = bIsShort ? 100 : 30;
  const bx = X0 + long + 14;

  return (
    <svg
      viewBox="0 0 640 190"
      role="img"
      aria-label={`Bar model: ${A} ${n}, ${B} ${stage >= 1 ? bVal : "unknown"}, difference ${d}`}
      className="block h-auto w-full max-w-[640px]"
    >
      <text x={0} y={58} fontSize={18} fontWeight={500} className="fill-slate-800 dark:fill-slate-100">
        {A}
      </text>
      <text x={0} y={128} fontSize={18} fontWeight={500} className="fill-slate-800 dark:fill-slate-100">
        {B}
      </text>

      {/* A's bar */}
      <rect
        x={X0}
        y={30}
        width={wA}
        height={44}
        rx={6}
        strokeWidth={2}
        className="fill-amber-400 stroke-slate-800 dark:stroke-slate-200"
      />
      <text x={X0 + short / 2} y={58} textAnchor="middle" fontSize={17} fontWeight={700} className="fill-amber-950">
        {n}
      </text>

      {/* B's bar */}
      <rect
        x={X0}
        y={100}
        width={wB}
        height={44}
        rx={6}
        strokeWidth={2}
        className="fill-teal-500 stroke-slate-800 dark:stroke-slate-200"
      />
      <text x={X0 + short / 2} y={128} textAnchor="middle" fontSize={17} fontWeight={700} className="fill-teal-950">
        {stage >= 1 ? bVal : "?"}
      </text>

      {/* Difference */}
      <rect
        x={X0 + short}
        y={diffY}
        width={long - short}
        height={44}
        rx={4}
        fill="none"
        strokeWidth={2.5}
        strokeDasharray="7 5"
        className="stroke-orange-600 dark:stroke-orange-400"
      />
      <text
        x={X0 + short + (long - short) / 2}
        y={diffY + 28}
        textAnchor="middle"
        fontSize={17}
        fontWeight={700}
        className="fill-orange-600 dark:fill-orange-400"
      >
        {d}
      </text>
      <line
        x1={X0 + short}
        y1={22}
        x2={X0 + short}
        y2={152}
        strokeWidth={1.5}
        strokeDasharray="3 4"
        className="stroke-slate-400 dark:stroke-slate-500"
      />

      {/* "Altogether" bracket, shown once part a is solved */}
      {stage >= 1 && (
        <g>
          <path
            d={`M${bx} 30 q10 0 10 12 v26 q0 9 9 9 q-9 0 -9 9 v26 q0 12 -10 12`}
            fill="none"
            strokeWidth={2.5}
            className="stroke-slate-800 dark:stroke-slate-100"
          />
          <text x={bx + 26} y={93} fontSize={17} fontWeight={700} className="fill-slate-800 dark:fill-slate-100">
            {stage >= 2 ? total : "?"} {item.length > 9 ? "" : item}
          </text>
        </g>
      )}

      <text x={X0} y={178} fontSize={13} className="fill-slate-500 dark:fill-slate-400">
        {bIsShort ? `${B}'s bar is shorter by ${d}` : `${B}'s bar is longer by ${d}`}
      </text>
    </svg>
  );
}
