import React, { useState, useRef, useMemo } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface Nx1VertMultProps {
  num1: number;             // The multi-digit multiplicand (2–4+ digits)
  num2: number;             // The single-digit multiplier
  showFeedback?: boolean;
  showWork?: boolean;       // Toggle carry marks above num1
  size?: 'sm' | 'md' | 'lg';
}

interface MultData {
  paddedNum1: (number | null)[];  // LTR, null for left-padding cells
  resultDigits: number[];          // LTR, full product
  carries: number[];               // LTR, carry INTO each column (0 if none)
  maxWidth: number;                // = result digit count
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getSizeClasses = (size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizes = {
    sm: { digit: 'w-8 h-8 text-xl',    box: 'w-8 h-10 text-xl',   carry: 'w-8 h-5'  },
    md: { digit: 'w-12 h-10 text-3xl', box: 'w-12 h-14 text-3xl', carry: 'w-12 h-6' },
    lg: { digit: 'w-16 h-12 text-4xl', box: 'w-16 h-18 text-4xl', carry: 'w-16 h-7' },
  };
  return sizes[size];
};

// Decompose the multiplication into display-ready data.
// Carry semantics: carries[col] = carry coming INTO that column from its right
// neighbor. Shown above each column in the carry row (matches addition carry display).
const computeMultData = (num1: number, num2: number): MultData => {
  const resultStr   = (num1 * num2).toString();
  const num1Str     = num1.toString();
  const maxWidth    = resultStr.length; // result >= num1, so len(result) >= len(num1)

  const paddedNum1: (number | null)[] = [
    ...Array(maxWidth - num1Str.length).fill(null),
    ...num1Str.split('').map(Number),
  ];

  const resultDigits = resultStr.split('').map(Number);

  // Process RTL; store carry-into-column in LTR order for display
  const carries = new Array<number>(maxWidth).fill(0);
  let carry = 0;
  for (let col = maxWidth - 1; col >= 0; col--) {
    const d1    = paddedNum1[col] ?? 0;
    carries[col] = carry;                          // carry INTO this column
    const product = d1 * num2 + carry;
    carry = Math.floor(product / 10);
  }

  return { paddedNum1, resultDigits, carries, maxWidth };
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const Nx1VertMult: React.FC<Nx1VertMultProps> = ({
  num1,
  num2,
  showFeedback = false,
  showWork = false,
  size = 'md',
}) => {
  const sizeClasses = getSizeClasses(size);

  // useMemo prevents recomputation on every render, matching VerticalMath pattern
  const { paddedNum1, resultDigits, carries, maxWidth } = useMemo(
    () => computeMultData(num1, num2),
    [num1, num2]
  );

  const [inputs, setInputs]     = useState<{ [key: string]: string }>({});
  const inputRefs               = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Line width mirrors VerticalMath: cell pixel width × column count
  const cellPx = size === 'sm' ? 32 : size === 'md' ? 48 : 64;

  // ── Input handlers (same signature as VerticalMath) ──────────────────────

  const handleInputChange = (row: number, col: number, value: string) => {
    if (value === '' || /^\d$/.test(value)) {
      setInputs(prev => ({ ...prev, [`${row}-${col}`]: value }));
    }
  };

  const handleKeyDown = (row: number, col: number, e: React.KeyboardEvent) => {
    const currentKey  = `${row}-${col}`;
    const allKeys     = Object.keys(inputRefs.current).sort();
    const currentIdx  = allKeys.indexOf(currentKey);

    if (e.key === 'ArrowRight' || (e.key === 'Tab' && !e.shiftKey)) {
      e.preventDefault();
      inputRefs.current[allKeys[(currentIdx + 1) % allKeys.length]]?.focus();
    } else if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
      e.preventDefault();
      inputRefs.current[allKeys[(currentIdx - 1 + allKeys.length) % allKeys.length]]?.focus();
    }
  };

  // ── Render helpers ────────────────────────────────────────────────────────

  // Known digit cell (num1 row) — matches VerticalMath's non-input renderDigit branch
  const renderKnownDigit = (digit: number | null) => (
    <div className={`${sizeClasses.digit} flex items-center justify-center font-bold`}>
      {digit !== null ? digit : ''}
    </div>
  );

  // Result digit — always an input (every result cell is student-filled)
  const renderResultInput = (col: number, correctDigit: number) => {
    const key        = `0-${col}`;
    const userAnswer = inputs[key] || '';
    const isCorrect  = userAnswer === correctDigit.toString();

    return (
      <input
        key={col}
        ref={el => { inputRefs.current[key] = el; }}
        type="text"
        maxLength={1}
        value={userAnswer}
        onChange={e => handleInputChange(0, col, e.target.value)}
        onKeyDown={e => handleKeyDown(0, col, e)}
        className={`${sizeClasses.box} border-2 border-gray-800 text-center font-bold
          focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
          showFeedback && userAnswer
            ? isCorrect
              ? '!bg-green-50 border-green-500'
              : '!bg-red-50 border-red-500'
            : '!bg-white'
        }`}
        placeholder="?"
      />
    );
  };

  // ── Layout (mirrors VerticalMath's flex flex-col items-end skeleton) ─────

  return (
    <div className="flex flex-col items-end">

      {/* Carry row — shown when showWork is on */}
      {showWork && (
        <div className="flex">
          <div className={`${sizeClasses.carry} pr-2`} />
          {carries.map((carryVal, col) => (
            <div key={col} className={`${sizeClasses.carry} flex items-end justify-center pb-0.5`}>
              {carryVal > 0 && (
                <span className="text-sm text-red-500 font-semibold">{carryVal}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* num1 row — no operation symbol (blank spacer matches VerticalMath non-last rows) */}
      <div className="flex items-center">
        <div className={`${sizeClasses.digit} pr-2`} />
        {paddedNum1.map((digit, col) => (
          <div key={col}>{renderKnownDigit(digit)}</div>
        ))}
      </div>

      {/* × num2 row — × symbol mirrors +/− placement in VerticalMath's last operand row */}
      <div className="flex items-center">
        <div className={`${sizeClasses.digit} flex items-center justify-center font-bold pr-2`}>
          ×
        </div>
        {/* Left-pad so num2 sits flush right */}
        {Array(maxWidth - 1).fill(null).map((_, i) => (
          <div key={i} className={sizeClasses.digit} />
        ))}
        <div className={`${sizeClasses.digit} flex items-center justify-center font-bold`}>
          {num2}
        </div>
      </div>

      {/* Horizontal line */}
      <div className="flex items-center py-0.5">
        <div className="pr-2 shrink-0" style={{ width: `${cellPx}px` }} />
        <div
          className="border-t-2 border-gray-800"
          style={{ width: `${maxWidth * cellPx}px` }}
        />
      </div>

      {/* Result row — one input per digit */}
      <div className="flex items-center">
        <div className={`${sizeClasses.digit} pr-2`} />
        {resultDigits.map((digit, col) => renderResultInput(col, digit))}
      </div>

    </div>
  );
};

// ============================================================================
// DEMO COMPONENT
// ============================================================================

const Nx1VertMultDemo: React.FC = () => {
  const [showFeedback1, setShowFeedback1] = useState(false);
  const [showFeedback2, setShowFeedback2] = useState(false);
  const [showFeedback3, setShowFeedback3] = useState(false);
  const [showWork1, setShowWork1] = useState(false);
  const [showWork2, setShowWork2] = useState(false);
  const [showWork3, setShowWork3] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          N-Digit × 1-Digit Vertical Multiplication
        </h1>
        <p className="text-gray-600 mb-8">
          Traditional vertical format — fill in each digit of the product.
        </p>

        {/* Example 1: 2-digit */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-1">
            Example 1: 23 × 4{' '}
            <span className="text-base font-normal text-gray-400">(2-digit)</span>
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Product: <strong>92</strong>
          </p>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setShowFeedback1(!showFeedback1)}
              className="px-4 py-2 !bg-green-500 text-white rounded-lg font-medium hover:!bg-green-600 transition-colors"
            >
              {showFeedback1 ? 'Hide' : 'Check'} Answer
            </button>
            <button
              onClick={() => setShowWork1(!showWork1)}
              className="px-4 py-2 !bg-blue-500 text-white rounded-lg font-medium hover:!bg-blue-600 transition-colors"
            >
              {showWork1 ? 'Hide' : 'Show'} Carries
            </button>
          </div>
          <div className="flex justify-center">
            <Nx1VertMult num1={23} num2={4} showFeedback={showFeedback1} showWork={showWork1} size="lg" />
          </div>
        </div>

        {/* Example 2: 3-digit */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-1">
            Example 2: 234 × 5{' '}
            <span className="text-base font-normal text-gray-400">(3-digit)</span>
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Product: <strong>1,170</strong>
          </p>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setShowFeedback2(!showFeedback2)}
              className="px-4 py-2 !bg-green-500 text-white rounded-lg font-medium hover:!bg-green-600 transition-colors"
            >
              {showFeedback2 ? 'Hide' : 'Check'} Answer
            </button>
            <button
              onClick={() => setShowWork2(!showWork2)}
              className="px-4 py-2 !bg-blue-500 text-white rounded-lg font-medium hover:!bg-blue-600 transition-colors"
            >
              {showWork2 ? 'Hide' : 'Show'} Carries
            </button>
          </div>
          <div className="flex justify-center">
            <Nx1VertMult num1={234} num2={5} showFeedback={showFeedback2} showWork={showWork2} size="lg" />
          </div>
        </div>

        {/* Example 3: 4-digit */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-1">
            Example 3: 1234 × 6{' '}
            <span className="text-base font-normal text-gray-400">(4-digit)</span>
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            Product: <strong>7,404</strong>
          </p>
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setShowFeedback3(!showFeedback3)}
              className="px-4 py-2 !bg-green-500 text-white rounded-lg font-medium hover:!bg-green-600 transition-colors"
            >
              {showFeedback3 ? 'Hide' : 'Check'} Answer
            </button>
            <button
              onClick={() => setShowWork3(!showWork3)}
              className="px-4 py-2 !bg-blue-500 text-white rounded-lg font-medium hover:!bg-blue-600 transition-colors"
            >
              {showWork3 ? 'Hide' : 'Show'} Carries
            </button>
          </div>
          <div className="flex justify-center">
            <Nx1VertMult num1={2345} num2={6} showFeedback={showFeedback3} showWork={showWork3} size="lg" />
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Component Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Traditional vertical format</strong> — Right-aligned, each digit in its own fixed-width cell</li>
            <li>✅ <strong>Scales 2–4 digits</strong> — maxWidth derived from result length, layout adapts automatically</li>
            <li>✅ <strong>One input per result digit</strong> — Student fills the product digit by digit</li>
            <li>✅ <strong>Carry display</strong> — Toggle shows carry-into-each-column in red, same style as VerticalMath addition</li>
            <li>✅ <strong>Keyboard navigation</strong> — Tab and left/right arrows move between result inputs</li>
            <li>✅ <strong>Visual feedback</strong> — Green for correct, red for incorrect per digit</li>
            <li>✅ <strong>Side-by-side ready</strong> — Pure display component; no page-level min-h or padding</li>
            <li>✅ <strong>Size variants</strong> — sm, md, lg (identical cell classes to VerticalMath)</li>
            <li>✅ <strong>TypeScript types exported</strong> — Full type safety</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Nx1VertMultDemo;
