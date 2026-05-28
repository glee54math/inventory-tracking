import React, { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Nx1MultiplicationProps {
  num1: number;             // The multi-digit number (multiplicand)
  num2: number;             // The 1-digit number (multiplier)
  showFeedback?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface PlacePart {
  placeIndex: number;   // 0 = ones, 1 = tens, 2 = hundreds, 3 = thousands
  value: number;        // e.g. 200 for the hundreds digit of 234
  label: string;        // e.g. 'hundreds'
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PLACE_LABELS = ['ones', 'tens', 'hundreds', 'thousands', 'ten-thousands'];

// Indexed by placeIndex — 0 = ones, 1 = tens, 2 = hundreds, 3 = thousands
const PLACE_COLORS = [
  // 0 — ones — orange
  { border: 'border-orange-500', bg: 'bg-orange-50', headerBg: 'bg-orange-100',
    text: 'text-orange-800', label: 'text-orange-700', inputBorder: 'border-orange-400',
    ring: 'focus:ring-orange-400' },
  // 1 — tens — green
  { border: 'border-green-500', bg: 'bg-green-50', headerBg: 'bg-green-100',
    text: 'text-green-800', label: 'text-green-700', inputBorder: 'border-green-400',
    ring: 'focus:ring-green-400' },
  // 2 — hundreds — sky
  { border: 'border-sky-500', bg: 'bg-sky-50', headerBg: 'bg-sky-100',
    text: 'text-sky-800', label: 'text-sky-700', inputBorder: 'border-sky-400',
    ring: 'focus:ring-sky-400' },
  // 3 — thousands — violet
  { border: 'border-violet-500', bg: 'bg-violet-50', headerBg: 'bg-violet-100',
    text: 'text-violet-800', label: 'text-violet-700', inputBorder: 'border-violet-400',
    ring: 'focus:ring-violet-400' },
] as const;

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Returns parts left→right (highest place value first), skipping zero digits.
const decomposeNumber = (num: number): PlacePart[] => {
  const str = num.toString();
  const numDigits = str.length;
  const parts: PlacePart[] = [];

  for (let i = 0; i < str.length; i++) {
    const digit = parseInt(str[i]);
    const placeIndex = numDigits - 1 - i;
    const value = digit * Math.pow(10, placeIndex);
    if (value > 0) {
      parts.push({ placeIndex, value, label: PLACE_LABELS[placeIndex] ?? `10^${placeIndex}` });
    }
  }

  return parts;
};

// "hundreds, tens, and ones" — for the Step 1 instruction label
const listPlaceLabels = (parts: PlacePart[]): string => {
  const labels = parts.map(p => p.label);
  if (labels.length === 1) return labels[0];
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(', ')}, and ${labels[labels.length - 1]}`;
};

const getSizeConfig = (size: 'sm' | 'md' | 'lg' = 'md') => ({
  sm: {
    circleW: 'w-11', circleH: 'h-11', circleText: 'text-base',
    labelText: 'text-xl', stepText: 'text-sm',
    headerH: 30, cellH: 58, multW: 40,
    colW: 86,
    productInputW: 'w-16', productInputH: 'h-9',  productInputText: 'text-base',
    finalW: 'w-16', finalH: 'h-10',
  },
  md: {
    circleW: 'w-14', circleH: 'h-14', circleText: 'text-xl',
    labelText: 'text-2xl', stepText: 'text-base',
    headerH: 40, cellH: 82, multW: 56,
    colW: 110,
    productInputW: 'w-20', productInputH: 'h-12', productInputText: 'text-xl',
    finalW: 'w-24', finalH: 'h-14',
  },
  lg: {
    circleW: 'w-16', circleH: 'h-16', circleText: 'text-2xl',
    labelText: 'text-3xl', stepText: 'text-base',
    headerH: 48, cellH: 100, multW: 68,
    colW: 134,
    productInputW: 'w-24', productInputH: 'h-14', productInputText: 'text-2xl',
    finalW: 'w-28', finalH: 'h-16',
  },
}[size]);

// ============================================================================
// PRIMITIVE COMPONENTS
// ============================================================================

interface CircleInputProps {
  value: string;
  onChange: (v: string) => void;
  correctAnswer?: number;
  showFeedback?: boolean;
  size?: 'sm' | 'md' | 'lg';
  placeIndex?: number;    // maps to PLACE_COLORS; undefined = neutral gray
}

const CircleInput: React.FC<CircleInputProps> = ({
  value,
  onChange,
  correctAnswer,
  showFeedback = false,
  size = 'md',
  placeIndex,
}) => {
  const cfg = getSizeConfig(size);
  const colors = placeIndex !== undefined ? PLACE_COLORS[placeIndex] : null;

  const base = colors
    ? `${colors.border} ${colors.bg}`
    : 'border-gray-800 bg-white';

  const feedback = (() => {
    if (!showFeedback || correctAnswer === undefined || !value) return '';
    return parseInt(value) === correctAnswer
      ? '!border-green-500 !bg-green-100 text-green-800'
      : '!border-red-500 !bg-red-100 text-red-800';
  })();

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => {
        const v = e.target.value;
        if (v === '' || /^\d+$/.test(v)) onChange(v);
      }}
      className={`${cfg.circleW} ${cfg.circleH} ${cfg.circleText} rounded-full border-2
        text-center font-semibold
        focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors
        ${base} ${feedback}`}
      placeholder="?"
    />
  );
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Nx1Multiplication: React.FC<Nx1MultiplicationProps> = ({
  num1,
  num2,
  showFeedback = false,
  size = 'md',
}) => {
  const cfg      = getSizeConfig(size);
  const parts    = decomposeNumber(num1);
  const numParts = parts.length;
  const finalAnswer = num1 * num2;

  // Arrays sized to number of place-value parts
  const [decompInputs,  setDecompInputs]  = useState<string[]>(() => Array(numParts).fill(''));
  const [productInputs, setProductInputs] = useState<string[]>(() => Array(numParts).fill(''));
  const [finalInput,    setFinalInput]    = useState('');

  const updateDecomp  = (i: number, v: string) =>
    setDecompInputs(prev  => prev.map((x, j) => (j === i ? v : x)));
  const updateProduct = (i: number, v: string) =>
    setProductInputs(prev => prev.map((x, j) => (j === i ? v : x)));

  const productFeedback = (input: string, correct: number) => {
    if (!showFeedback || !input) return '';
    return parseInt(input) === correct
      ? '!border-green-500 !bg-green-100 text-green-800'
      : '!border-red-500 !bg-red-100 text-red-800';
  };

  // Column header label: show student's decomp answer live, fall back to correct value
  const headerLabel = (i: number) => decompInputs[i] || parts[i].value.toString();
  // Partial-product display for Step 3: echo Step 2 answer live
  const productDisplay = (i: number) => productInputs[i] || '?';

  return (
    <div className="flex flex-col items-center gap-10 p-6">

      {/* ── Problem Statement ─────────────────────────────────── */}
      <div className={`flex items-center gap-3 ${cfg.labelText} font-bold text-gray-800`}>
        <span>{num1}</span>
        <span className="text-gray-400">×</span>
        <span>{num2}</span>
        <span className="text-gray-400">=</span>
        <div
          className={`${cfg.finalH} ${cfg.finalW} border-2 border-gray-800 rounded-lg bg-white
            flex items-center justify-center font-bold text-gray-300 ${cfg.circleText}`}
        >
          ?
        </div>
      </div>

      {/* ── STEP 1 ─ Decompose ────────────────────────────────── */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
            STEP 1
          </span>
          <span className={`text-gray-600 font-medium ${cfg.stepText}`}>
            Break apart <strong>{num1}</strong> into {listPlaceLabels(parts)}.
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <span className={`${cfg.labelText} font-bold`}>{num1}</span>
          <span className={`${cfg.labelText} font-bold text-gray-400`}>=</span>

          {parts.map((part, i) => {
            const colors = PLACE_COLORS[part.placeIndex];
            return (
              <React.Fragment key={i}>
                {i > 0 && (
                  <span className={`${cfg.labelText} font-bold text-gray-400`}>+</span>
                )}
                <div className="flex flex-col items-center gap-1">
                  <CircleInput
                    value={decompInputs[i]}
                    onChange={(v) => updateDecomp(i, v)}
                    correctAnswer={part.value}
                    showFeedback={showFeedback}
                    size={size}
                    placeIndex={part.placeIndex}
                  />
                  <span className={`text-xs font-bold ${colors.label} uppercase tracking-widest`}>
                    {part.label}
                  </span>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* ── STEP 2 ─ Area Model ───────────────────────────────── */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
            STEP 2
          </span>
          <span className={`text-gray-600 font-medium ${cfg.stepText}`}>
            Multiply <strong>{num2}</strong> by each part.
          </span>
        </div>

        <div className="overflow-x-auto flex justify-center">
          <div>
            {/* Column headers */}
            <div className="flex" style={{ marginLeft: cfg.multW }}>
              {parts.map((part, i) => {
                const colors   = PLACE_COLORS[part.placeIndex];
                const isFirst  = i === 0;
                const isLast   = i === numParts - 1;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-center font-bold
                      ${colors.text} ${colors.headerBg}
                      border-2 ${colors.border} border-b-0
                      ${isFirst  ? 'rounded-tl-lg' : 'border-l-0'}
                      ${isLast   ? 'rounded-tr-lg' : ''}`}
                    style={{ width: cfg.colW, height: cfg.headerH }}
                  >
                    <span className={cfg.circleText}>{headerLabel(i)}</span>
                  </div>
                );
              })}
            </div>

            {/* Grid row */}
            <div className="flex">
              {/* Multiplier label cell */}
              <div
                className="flex items-center justify-center font-bold bg-gray-100 border-2 border-gray-700 rounded-bl-lg"
                style={{ width: cfg.multW, height: cfg.cellH }}
              >
                <span className={cfg.labelText}>{num2}</span>
              </div>

              {/* Partial-product cells */}
              {parts.map((part, i) => {
                const colors  = PLACE_COLORS[part.placeIndex];
                const isLast  = i === numParts - 1;
                const correct = part.value * num2;
                return (
                  <div
                    key={i}
                    className={`flex items-center justify-center
                      ${colors.bg} border-2 ${colors.border}
                      ${i > 0 ? 'border-l-0' : ''}
                      ${isLast ? 'rounded-br-lg' : ''}`}
                    style={{ width: cfg.colW, height: cfg.cellH }}
                  >
                    <input
                      type="text"
                      value={productInputs[i]}
                      onChange={(e) => {
                        const v = e.target.value;
                        if (v === '' || /^\d+$/.test(v)) updateProduct(i, v);
                      }}
                      className={`${cfg.productInputW} ${cfg.productInputH} ${cfg.productInputText}
                        border-2 ${colors.inputBorder} rounded-lg bg-white
                        text-center font-semibold
                        focus:outline-none focus:ring-2 ${colors.ring} transition-colors
                        ${productFeedback(productInputs[i], correct)}`}
                      placeholder="?"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Equation hints below the model */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-3">
          {parts.map((part, i) => {
            const colors  = PLACE_COLORS[part.placeIndex];
            const correct = part.value * num2;
            return (
              <span key={i} className={`text-sm font-medium ${colors.label}`}>
                {headerLabel(i)} × {num2} = {productInputs[i] || '?'}
                {showFeedback && productInputs[i] && (
                  <span className={parseInt(productInputs[i]) === correct ? ' text-green-600' : ' text-red-500'}>
                    {parseInt(productInputs[i]) === correct ? ' ✓' : ` (${correct})`}
                  </span>
                )}
              </span>
            );
          })}
        </div>
      </div>

      {/* ── STEP 3 ─ Add Partial Products (stacked) ──────────── */}
      <div className="w-full max-w-2xl">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
            STEP 3
          </span>
          <span className={`text-gray-600 font-medium ${cfg.stepText}`}>
            Add all the parts together.
          </span>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col items-end gap-2">

            {/* One row per partial product */}
            {parts.map((part, i) => {
              const colors = PLACE_COLORS[part.placeIndex];
              const correct = part.value * num2;
              return (
                <div key={i} className="flex items-center gap-3">
                  {/* + prefix (empty on first row to stay aligned) */}
                  <span className={`${cfg.labelText} font-bold text-gray-400 w-7 text-right`}>
                    {i === 0 ? '' : '+'}
                  </span>

                  {/* Partial product display — echoes Step 2 */}
                  <div
                    className={`${cfg.finalH} ${cfg.finalW} border-2 ${colors.border} ${colors.bg}
                      rounded-lg flex items-center justify-center
                      font-semibold ${cfg.productInputText} ${colors.text}`}
                  >
                    {productDisplay(i)}
                  </div>

                  {/* Place label */}
                  <span className={`text-xs font-bold ${colors.label} uppercase tracking-widest w-20`}>
                    {part.label} part {showFeedback && productInputs[i] && parseInt(productInputs[i]) === correct ? ' ✓' : ` `}
                  </span>
                </div>
              );
            })}

            {/* Dividing line */}
            <div className="flex items-center gap-3 w-full">
              <div className="w-7" />
              <div className={`${cfg.finalW} border-t-2 border-gray-700`} />
              <div className="w-20" />
            </div>

            {/* Final answer row */}
            <div className="flex items-center gap-3">
              <span className={`${cfg.labelText} font-bold text-gray-400 w-7 text-right`}>=</span>
              <input
                type="text"
                value={finalInput}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '' || /^\d+$/.test(v)) setFinalInput(v);
                }}
                className={`${cfg.finalH} ${cfg.finalW} ${cfg.productInputText}
                  border-2 border-gray-800 rounded-lg bg-white
                  text-center font-bold
                  focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
                  showFeedback && finalInput
                    ? parseInt(finalInput) === finalAnswer
                      ? '!border-green-500 !bg-green-100 text-green-800'
                      : '!border-red-500 !bg-red-100 text-red-800'
                    : ''
                }`}
                placeholder="?"
              />
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest w-20">answer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DEMO COMPONENT
// ============================================================================

const Nx1MultiplicationDemo: React.FC = () => {
  const [showFeedback1, setShowFeedback1] = useState(false);
  const [showFeedback2, setShowFeedback2] = useState(false);
  const [showFeedback3, setShowFeedback3] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">N-Digit × 1-Digit Multiplication</h1>
        <p className="text-gray-600 mb-8">
          Area model strategy — break apart, multiply each place value, then add.
        </p>

        {/* Color legend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-5 py-3 mb-6 flex flex-wrap gap-4">
          {(['ones', 'tens', 'hundreds', 'thousands'] as const).map((label, i) => {
            const colors = PLACE_COLORS[i];
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded border-2 ${colors.border} ${colors.bg}`} />
                <span className={`text-sm font-semibold ${colors.label} capitalize`}>{label}</span>
              </div>
            );
          })}
        </div>

        {/* Example 1: 2-digit × 1-digit */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-1">Example 1: 23 × 4 &nbsp;<span className="text-base font-normal text-gray-400">(2-digit)</span></h3>
          <p className="text-gray-500 text-sm mb-4">
            20 × 4 = 80 &nbsp;·&nbsp; 3 × 4 = 12 &nbsp;·&nbsp; 80 + 12 = <strong>92</strong>
          </p>
          <div className="flex justify-center mb-2">
            <button
              onClick={() => setShowFeedback1(!showFeedback1)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium hover:!bg-green-600 transition-colors"
            >
              {showFeedback1 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <Nx1Multiplication num1={23} num2={4} showFeedback={showFeedback1} size="md" />
        </div>

        {/* Example 2: 3-digit × 1-digit */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-1">Example 2: 234 × 5 &nbsp;<span className="text-base font-normal text-gray-400">(3-digit)</span></h3>
          <p className="text-gray-500 text-sm mb-4">
            200 × 5 = 1000 &nbsp;·&nbsp; 30 × 5 = 150 &nbsp;·&nbsp; 4 × 5 = 20 &nbsp;·&nbsp; 1000 + 150 + 20 = <strong>1170</strong>
          </p>
          <div className="flex justify-center mb-2">
            <button
              onClick={() => setShowFeedback2(!showFeedback2)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium hover:!bg-green-600 transition-colors"
            >
              {showFeedback2 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <Nx1Multiplication num1={234} num2={5} showFeedback={showFeedback2} size="md" />
        </div>

        {/* Example 3: 4-digit × 1-digit */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-1">Example 3: 1234 × 6 &nbsp;<span className="text-base font-normal text-gray-400">(4-digit)</span></h3>
          <p className="text-gray-500 text-sm mb-4">
            1000 × 6 = 6000 &nbsp;·&nbsp; 200 × 6 = 1200 &nbsp;·&nbsp; 30 × 6 = 180 &nbsp;·&nbsp; 4 × 6 = 24 &nbsp;·&nbsp; Total = <strong>7404</strong>
          </p>
          <div className="flex justify-center mb-2">
            <button
              onClick={() => setShowFeedback3(!showFeedback3)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium hover:!bg-green-600 transition-colors"
            >
              {showFeedback3 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <Nx1Multiplication num1={2345} num2={6} showFeedback={showFeedback3} size="md" />
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Component Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Scales to any digit count</strong> — 2, 3, 4 (or more) digit multiplicands</li>
            <li>✅ <strong>Dynamic area model</strong> — N columns rendered from place-value decomposition</li>
            <li>✅ <strong>4 color-coded place values</strong> — Orange (ones), Green (tens), Sky (hundreds), Violet (thousands)</li>
            <li>✅ <strong>Skips zero digits</strong> — e.g., 304 shows two columns: 300 and 4</li>
            <li>✅ <strong>Connected steps</strong> — Step 1 answers feed live into Step 2 column headers</li>
            <li>✅ <strong>Stacked Step 3</strong> — Vertical addition layout scales cleanly to any number of partial products</li>
            <li>✅ <strong>Hint equations</strong> — Live equation preview below the area model grid</li>
            <li>✅ <strong>Visual feedback</strong> — Green for correct, red for incorrect (with correct answer shown)</li>
            <li>✅ <strong>Size variants</strong> — sm, md, lg sizes available</li>
            <li>✅ <strong>TypeScript types exported</strong> — Full type safety</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Nx1MultiplicationDemo;
