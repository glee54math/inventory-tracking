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

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getSizeConfig = (size: 'sm' | 'md' | 'lg' = 'md') => ({
  sm: {
    circleW: 'w-12', circleH: 'h-12', circleText: 'text-lg',
    labelText: 'text-xl', stepText: 'text-sm',
    headerH: 32, cellH: 64, multW: 44, tensW: 120, onesW: 80,
    productInputW: 'w-16', productInputH: 'h-10', productInputText: 'text-lg',
    finalW: 'w-16', finalH: 'h-12',
  },
  md: {
    circleW: 'w-16', circleH: 'h-16', circleText: 'text-2xl',
    labelText: 'text-2xl', stepText: 'text-base',
    headerH: 44, cellH: 88, multW: 60, tensW: 160, onesW: 110,
    productInputW: 'w-20', productInputH: 'h-12', productInputText: 'text-2xl',
    finalW: 'w-20', finalH: 'h-14',
  },
  lg: {
    circleW: 'w-20', circleH: 'h-20', circleText: 'text-3xl',
    labelText: 'text-3xl', stepText: 'text-base',
    headerH: 52, cellH: 104, multW: 72, tensW: 190, onesW: 130,
    productInputW: 'w-24', productInputH: 'h-14', productInputText: 'text-3xl',
    finalW: 'w-24', finalH: 'h-16',
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
  colorScheme?: 'neutral' | 'green' | 'orange';
}

const CircleInput: React.FC<CircleInputProps> = ({
  value,
  onChange,
  correctAnswer,
  showFeedback = false,
  size = 'md',
  colorScheme = 'neutral',
}) => {
  const cfg = getSizeConfig(size);

  const base = {
    neutral: 'border-gray-800 bg-white',
    green:   'border-green-500 bg-green-50',
    orange:  'border-orange-500 bg-orange-50',
  }[colorScheme];

  const feedback = (() => {
    if (!showFeedback || correctAnswer === undefined || !value) return '';
    return parseInt(value) === correctAnswer
      ? '!border-green-500 !bg-green-100 text-green-800'
      : '!border-red-500   !bg-red-100   text-red-800';
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
  const cfg = getSizeConfig(size);

  // Decompose num1 into place-value parts
  const tens = Math.floor(num1 / 10) * 10;
  const ones = num1 % 10;

  // Correct answers
  const tensProduct  = tens * num2;
  const onesProduct  = ones * num2;
  const finalAnswer  = num1 * num2;

  // Student inputs
  const [tensInput,        setTensInput]        = useState('');
  const [onesInput,        setOnesInput]        = useState('');
  const [tensProductInput, setTensProductInput] = useState('');
  const [onesProductInput, setOnesProductInput] = useState('');
  const [finalInput,       setFinalInput]       = useState('');

  // Area model column header labels: use student's Step 1 answers if available
  const tensLabel = tensInput || tens.toString();
  const onesLabel = onesInput || ones.toString();

  // Show partial products in Step 3 (reflect student's Step 2 answers)
  const tensPartDisplay = tensProductInput || '?';
  const onesPartDisplay = onesProductInput || '?';

  const productFeedback = (input: string, correct: number) => {
    if (!showFeedback || !input) return '';
    return parseInt(input) === correct
      ? '!border-green-500 !bg-green-100 text-green-800'
      : '!border-red-500   !bg-red-100   text-red-800';
  };

  return (
    <div className="flex flex-col items-center gap-10 p-6">

      {/* ── Problem Statement ─────────────────────────────────── */}
      <div className={`flex items-center gap-3 ${cfg.labelText} font-bold text-gray-800`}>
        <span>{num1}</span>
        <span className="text-gray-400">×</span>
        <span>{num2}</span>
        <span className="text-gray-400">=</span>
        <div
          className={`${cfg.finalH} ${cfg.finalW} border-2 border-gray-800 rounded bg-white
            flex items-center justify-center font-bold text-gray-300 ${cfg.circleText}`}
        >
          ?
        </div>
      </div>

      {/* ── STEP 1 ─ Decompose ────────────────────────────────── */}
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
            STEP 1
          </span>
          <span className={`text-gray-600 font-medium ${cfg.stepText}`}>
            Break apart <strong>{num1}</strong> into tens and ones.
          </span>
        </div>

        <div className="flex items-center justify-center gap-4">
          <span className={`${cfg.labelText} font-bold`}>{num1}</span>
          <span className={`${cfg.labelText} font-bold text-gray-400`}>=</span>

          <div className="flex flex-col items-center gap-1">
            <CircleInput
              value={tensInput}
              onChange={setTensInput}
              correctAnswer={tens}
              showFeedback={showFeedback}
              size={size}
              colorScheme="green"
            />
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest">tens</span>
          </div>

          <span className={`${cfg.labelText} font-bold text-gray-400`}>+</span>

          <div className="flex flex-col items-center gap-1">
            <CircleInput
              value={onesInput}
              onChange={setOnesInput}
              correctAnswer={ones}
              showFeedback={showFeedback}
              size={size}
              colorScheme="orange"
            />
            <span className="text-xs font-bold text-orange-700 uppercase tracking-widest">ones</span>
          </div>
        </div>
      </div>

      {/* ── STEP 2 ─ Area Model ───────────────────────────────── */}
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
            STEP 2
          </span>
          <span className={`text-gray-600 font-medium ${cfg.stepText}`}>
            Multiply <strong>{num2}</strong> by each part.
          </span>
        </div>

        <div className="flex justify-center">
          <div>
            {/* Column headers — green for tens, orange for ones */}
            <div className="flex" style={{ marginLeft: `${cfg.multW}px` }}>
              <div
                className="flex items-center justify-center font-bold text-green-800 bg-green-100 border-2 border-green-500 border-b-0 rounded-tl-lg"
                style={{ width: cfg.tensW, height: cfg.headerH }}
              >
                <span className={cfg.circleText}>{tensLabel}</span>
              </div>
              <div
                className="flex items-center justify-center font-bold text-orange-800 bg-orange-100 border-2 border-orange-500 border-b-0 border-l-0 rounded-tr-lg"
                style={{ width: cfg.onesW, height: cfg.headerH }}
              >
                <span className={cfg.circleText}>{onesLabel}</span>
              </div>
            </div>

            {/* Main grid row */}
            <div className="flex">
              {/* Multiplier cell */}
              <div
                className="flex items-center justify-center font-bold bg-gray-100 border-2 border-gray-700 rounded-bl-lg"
                style={{ width: cfg.multW, height: cfg.cellH }}
              >
                <span className={cfg.labelText}>{num2}</span>
              </div>

              {/* Tens product cell */}
              <div
                className="flex items-center justify-center bg-green-50 border-2 border-green-500"
                style={{ width: cfg.tensW, height: cfg.cellH }}
              >
                <input
                  type="text"
                  value={tensProductInput}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === '' || /^\d+$/.test(v)) setTensProductInput(v);
                  }}
                  className={`${cfg.productInputW} ${cfg.productInputH} ${cfg.productInputText}
                    border-2 border-green-400 rounded-lg bg-white text-center font-semibold
                    focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors
                    ${productFeedback(tensProductInput, tensProduct)}`}
                  placeholder="?"
                />
              </div>

              {/* Ones product cell */}
              <div
                className="flex items-center justify-center bg-orange-50 border-2 border-orange-500 border-l-0 rounded-br-lg"
                style={{ width: cfg.onesW, height: cfg.cellH }}
              >
                <input
                  type="text"
                  value={onesProductInput}
                  onChange={(e) => {
                    const v = e.target.value;
                    if (v === '' || /^\d+$/.test(v)) setOnesProductInput(v);
                  }}
                  className={`${cfg.productInputW} ${cfg.productInputH} ${cfg.productInputText}
                    border-2 border-orange-400 rounded-lg bg-white text-center font-semibold
                    focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors
                    ${productFeedback(onesProductInput, onesProduct)}`}
                  placeholder="?"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Mini-equation hints below the area model */}
        <div className="flex justify-center gap-8 mt-3">
          <span className={`text-sm font-medium text-green-700`}>
            {tensLabel} × {num2} = {tensPartDisplay}
          </span>
          <span className="text-sm text-gray-400">and</span>
          <span className={`text-sm font-medium text-orange-700`}>
            {onesLabel} × {num2} = {onesPartDisplay}
          </span>
        </div>
      </div>

      {/* ── STEP 3 ─ Add Partial Products ────────────────────── */}
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
            STEP 3
          </span>
          <span className={`text-gray-600 font-medium ${cfg.stepText}`}>
            Add the two parts together.
          </span>
        </div>

        <div className="flex items-center justify-center gap-4">

          {/* Tens partial product (display only — mirrors Step 2) */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`${cfg.finalH} ${cfg.finalW} border-2 border-green-500 bg-green-50 rounded-lg
                flex items-center justify-center font-semibold ${cfg.circleText} text-green-800`}
            >
              {tensPartDisplay}
            </div>
            <span className="text-xs font-bold text-green-700 uppercase tracking-widest">tens part</span>
          </div>

          <span className={`${cfg.labelText} font-bold text-gray-400`}>+</span>

          {/* Ones partial product (display only — mirrors Step 2) */}
          <div className="flex flex-col items-center gap-1">
            <div
              className={`${cfg.finalH} ${cfg.finalW} border-2 border-orange-500 bg-orange-50 rounded-lg
                flex items-center justify-center font-semibold ${cfg.circleText} text-orange-800`}
            >
              {onesPartDisplay}
            </div>
            <span className="text-xs font-bold text-orange-700 uppercase tracking-widest">ones part</span>
          </div>

          <span className={`${cfg.labelText} font-bold text-gray-400`}>=</span>

          {/* Final answer input */}
          <div className="flex flex-col items-center gap-1">
            <input
              type="text"
              value={finalInput}
              onChange={(e) => {
                const v = e.target.value;
                if (v === '' || /^\d+$/.test(v)) setFinalInput(v);
              }}
              className={`${cfg.finalH} ${cfg.finalW} ${cfg.circleText}
                border-2 border-gray-800 rounded-lg bg-white text-center font-bold
                focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
                showFeedback && finalInput
                  ? parseInt(finalInput) === finalAnswer
                    ? '!border-green-500 !bg-green-100 text-green-800'
                    : '!border-red-500   !bg-red-100   text-red-800'
                  : ''
              }`}
              placeholder="?"
            />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">answer</span>
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
        <h1 className="text-4xl font-bold text-gray-800 mb-2">2-Digit × 1-Digit Multiplication</h1>
        <p className="text-gray-600 mb-8">Area model strategy — break apart, multiply each part, then add.</p>

        {/* Example 1: 23 × 4 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-1">Example 1: 23 × 4</h3>
          <p className="text-gray-500 text-sm mb-4">
            20 × 4 = 80 &nbsp;·&nbsp; 3 × 4 = 12 &nbsp;·&nbsp; 80 + 12 = 92
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

        {/* Example 2: 36 × 5 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-1">Example 2: 36 × 5</h3>
          <p className="text-gray-500 text-sm mb-4">
            30 × 5 = 150 &nbsp;·&nbsp; 6 × 5 = 30 &nbsp;·&nbsp; 150 + 30 = 180
          </p>
          <div className="flex justify-center mb-2">
            <button
              onClick={() => setShowFeedback2(!showFeedback2)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium hover:!bg-green-600 transition-colors"
            >
              {showFeedback2 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <Nx1Multiplication num1={36} num2={5} showFeedback={showFeedback2} size="md" />
        </div>

        {/* Example 3: 48 × 7 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-1">Example 3: 48 × 7</h3>
          <p className="text-gray-500 text-sm mb-4">
            40 × 7 = 280 &nbsp;·&nbsp; 8 × 7 = 56 &nbsp;·&nbsp; 280 + 56 = 336
          </p>
          <div className="flex justify-center mb-2">
            <button
              onClick={() => setShowFeedback3(!showFeedback3)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium hover:!bg-green-600 transition-colors"
            >
              {showFeedback3 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <Nx1Multiplication num1={48} num2={7} showFeedback={showFeedback3} size="md" />
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Component Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Area model visualization</strong> — Rectangle divided into tens and ones sections</li>
            <li>✅ <strong>3-step guided process</strong> — Decompose → Multiply each part → Add</li>
            <li>✅ <strong>Color-coded throughout</strong> — Green for tens, orange for ones across all 3 steps</li>
            <li>✅ <strong>Connected steps</strong> — Step 1 answers feed live into the Step 2 area model headers</li>
            <li>✅ <strong>Step 2 echoed into Step 3</strong> — Partial products carry forward automatically</li>
            <li>✅ <strong>Visual feedback</strong> — Green for correct, red for incorrect per input</li>
            <li>✅ <strong>Size variants</strong> — sm, md, lg sizes available</li>
            <li>✅ <strong>TypeScript types exported</strong> — Full type safety</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Nx1MultiplicationDemo;
