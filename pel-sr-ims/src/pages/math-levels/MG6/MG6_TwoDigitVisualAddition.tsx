import React, { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CircleNodeProps {
  value: number | string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  highlight?: boolean;
}

export interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  correctAnswer?: number;
  showFeedback?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface TwoDigitVisualAdditionProps {
  num1: number;
  num2: number;
  showFeedback?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getSizeClasses = (size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizes = {
    sm: { circle: 'w-12 h-12 text-lg', input: 'w-12 h-12 text-lg', box: 'w-16 h-12 text-lg' },
    md: { circle: 'w-16 h-16 text-2xl', input: 'w-16 h-16 text-2xl', box: 'w-24 h-16 text-2xl' },
    lg: { circle: 'w-20 h-20 text-3xl', input: 'w-20 h-20 text-3xl', box: 'w-32 h-20 text-3xl' }
  };
  return sizes[size];
};

// ============================================================================
// PRIMITIVE COMPONENTS
// ============================================================================

export const CircleNode: React.FC<CircleNodeProps> = ({ 
  value, 
  size = 'md',
  className = '',
  highlight = false
}) => {
  const sizeClasses = getSizeClasses(size);
  
  return (
    <div 
      className={`${sizeClasses.circle} rounded-full border-2 ${
        highlight ? 'border-green-500 bg-green-50' : 'border-gray-800'
      } flex items-center justify-center font-semibold bg-white ${className}`}
    >
      {value}
    </div>
  );
};

export const MathInput: React.FC<MathInputProps> = ({
  value,
  onChange,
  correctAnswer,
  showFeedback = false,
  size = 'md',
  className = ''
}) => {
  const sizeClasses = getSizeClasses(size);
  const numValue = value ? parseInt(value, 10) : null;
  
  const getFeedbackColor = () => {
    if (!showFeedback || correctAnswer === undefined || !value) return '';
    return numValue === correctAnswer 
      ? 'border-green-500 bg-green-50' 
      : 'border-red-500 bg-red-50';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (newValue === '' || /^\d+$/.test(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <input
      type="text"
      value={value}
      onChange={handleChange}
      className={`${sizeClasses.input} rounded-full border-2 border-gray-800 
        text-center font-semibold focus:outline-none focus:ring-2 
        focus:ring-blue-400 transition-colors ${getFeedbackColor()} ${className}`}
      placeholder="?"
    />
  );
};

// ============================================================================
// TWO DIGIT VISUAL ADDITION COMPONENT
// ============================================================================

export const TwoDigitVisualAddition: React.FC<TwoDigitVisualAdditionProps> = ({
  num1,
  num2,
  showFeedback = false,
  size = 'md'
}) => {
  // Calculate correct answers
  const tens1 = Math.floor(num1 / 10) * 10;
  const ones1 = num1 % 10;
  const tens2 = Math.floor(num2 / 10) * 10;
  const ones2 = num2 % 10;
  const tensSum = tens1 + tens2;
  const onesSum = ones1 + ones2;
  const finalAnswer = num1 + num2;
  
  // Scalable spacing constants (in Tailwind units: 4 = 1rem = 16px)
  const ADDEND_GROUP_GAP = 2; // Gap between 65 section and 36 section (horizontal)
  const SPLIT_CIRCLES_GAP = 4; // Gap between tens and ones circles within each split (horizontal)
  
  // Fixed vertical spacing (does not scale with horizontal gaps)
  const VERTICAL_SPACING = 10; // Fixed vertical distance between row 1 and row 2 circles (24px when multiplied by 4)
  
  // State for inputs
  const [num1Tens, setNum1Tens] = useState('');
  const [num1Ones, setNum1Ones] = useState('');
  const [num2Tens, setNum2Tens] = useState('');
  const [num2Ones, setNum2Ones] = useState('');
  const [bottomTens, setBottomTens] = useState('');
  const [bottomOnes, setBottomOnes] = useState('');
  const [finalSum, setFinalSum] = useState('');
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const topNum1Ref = React.useRef<HTMLDivElement>(null);
  const topNum2Ref = React.useRef<HTMLDivElement>(null);
  const num1TensRef = React.useRef<HTMLDivElement>(null);
  const num1OnesRef = React.useRef<HTMLDivElement>(null);
  const num2TensRef = React.useRef<HTMLDivElement>(null);
  const num2OnesRef = React.useRef<HTMLDivElement>(null);
  const bottomTensRef = React.useRef<HTMLDivElement>(null);
  const bottomOnesRef = React.useRef<HTMLDivElement>(null);
  
  const [lineCoords, setLineCoords] = React.useState<any>(null);

  // Calculate line coordinates
  React.useEffect(() => {
    if (!containerRef.current || !topNum1Ref.current || !topNum2Ref.current ||
        !num1TensRef.current || !num1OnesRef.current || 
        !num2TensRef.current || !num2OnesRef.current ||
        !bottomTensRef.current || !bottomOnesRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    const getCenter = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (!ref.current) return { x: 0, y: 0 };
      const rect = ref.current.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top
      };
    };
    
    const getBottom = (ref: React.RefObject<HTMLDivElement | null>) => {
      const center = getCenter(ref);
      if (!ref.current) return center;
      center.y += ref.current.getBoundingClientRect().height / 2;
      return center;
    };
    
    const getTop = (ref: React.RefObject<HTMLDivElement | null>) => {
      const center = getCenter(ref);
      if (!ref.current) return center;
      center.y -= ref.current.getBoundingClientRect().height / 2;
      return center;
    };

    setLineCoords({
      topNum1Bottom: getBottom(topNum1Ref),
      topNum2Bottom: getBottom(topNum2Ref),
      num1TensTop: getTop(num1TensRef),
      num1TensBottom: getBottom(num1TensRef),
      num1OnesTop: getTop(num1OnesRef),
      num1OnesBottom: getBottom(num1OnesRef),
      num2TensTop: getTop(num2TensRef),
      num2TensBottom: getBottom(num2TensRef),
      num2OnesTop: getTop(num2OnesRef),
      num2OnesBottom: getBottom(num2OnesRef),
      bottomTensTop: getTop(bottomTensRef),
      bottomOnesTop: getTop(bottomOnesRef)
    });
  }, [size]);

  const sizeClasses = getSizeClasses(size);

  return (
    <div>
      <div ref={containerRef} className="relative flex flex-col items-center p-8 min-h-[600px]">
        {/* SVG for connecting lines */}
        {lineCoords && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Lines from topNum1 to num1Tens and num1Ones */}
            <line 
              x1={lineCoords.topNum1Bottom.x}
              y1={lineCoords.topNum1Bottom.y}
              x2={lineCoords.num1TensTop.x}
              y2={lineCoords.num1TensTop.y}
              stroke="#86efac" 
              strokeWidth="2"
            />
            <line 
              x1={lineCoords.topNum1Bottom.x}
              y1={lineCoords.topNum1Bottom.y}
              x2={lineCoords.num1OnesTop.x}
              y2={lineCoords.num1OnesTop.y}
              stroke="#ef4444" 
              strokeWidth="2"
            />
            
            {/* Lines from topNum2 to num2Tens and num2Ones */}
            <line 
              x1={lineCoords.topNum2Bottom.x}
              y1={lineCoords.topNum2Bottom.y}
              x2={lineCoords.num2TensTop.x}
              y2={lineCoords.num2TensTop.y}
              stroke="#86efac" 
              strokeWidth="2"
            />
            <line 
              x1={lineCoords.topNum2Bottom.x}
              y1={lineCoords.topNum2Bottom.y}
              x2={lineCoords.num2OnesTop.x}
              y2={lineCoords.num2OnesTop.y}
              stroke="#ef4444" 
              strokeWidth="2"
            />
            
            {/* Light green lines from tens to bottomTens */}
            <line 
              x1={lineCoords.num1TensBottom.x}
              y1={lineCoords.num1TensBottom.y}
              x2={lineCoords.bottomTensTop.x}
              y2={lineCoords.bottomTensTop.y}
              stroke="#86efac" 
              strokeWidth="3"
            />
            <line 
              x1={lineCoords.num2TensBottom.x}
              y1={lineCoords.num2TensBottom.y}
              x2={lineCoords.bottomTensTop.x}
              y2={lineCoords.bottomTensTop.y}
              stroke="#86efac" 
              strokeWidth="3"
            />
            
            {/* Red lines from ones to bottomOnes */}
            <line 
              x1={lineCoords.num1OnesBottom.x}
              y1={lineCoords.num1OnesBottom.y}
              x2={lineCoords.bottomOnesTop.x}
              y2={lineCoords.bottomOnesTop.y}
              stroke="#ef4444" 
              strokeWidth="3"
            />
            <line 
              x1={lineCoords.num2OnesBottom.x}
              y1={lineCoords.num2OnesBottom.y}
              x2={lineCoords.bottomOnesTop.x}
              y2={lineCoords.bottomOnesTop.y}
              stroke="#ef4444" 
              strokeWidth="3"
            />
          </svg>
        )}

        {/* Top row: equation label */}
        <div className="flex items-center justify-center gap-6 mb-8" style={{ zIndex: 1 }}>
          <span className={`${size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-xl'} font-bold`}>
            {num1} + {num2} =
          </span>
          <div className={`${sizeClasses.box} border-2 border-gray-800 rounded flex items-center justify-center font-bold bg-white`}>
            ?
          </div>
        </div>

        {/* Second row with Step 1 label: Top numbers and splits aligned */}
        <div className="flex items-start gap-8 mb-20 w-full" style={{ zIndex: 1 }}>
          <div className="text-gray-600 text-sm font-semibold whitespace-nowrap flex-shrink-0" style={{ width: '80px' }}>
            Step 1:<br />
            Split into<br />
            tens and ones.
          </div>
          
          <div className="flex items-start justify-center flex-1" style={{ gap: `${ADDEND_GROUP_GAP * 4}px` }}>
            {/* num1 section - 65 centered above its split */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4" style={{ marginBottom: `${VERTICAL_SPACING * 0.5}px` }}>
                <div ref={topNum1Ref}>
                  <CircleNode value={num1} size={size} />
                </div>
              </div>
              <div className="flex items-center" style={{ gap: `${SPLIT_CIRCLES_GAP * 4}px`, marginTop: `${VERTICAL_SPACING * 4}px` }}>
                <div ref={num1TensRef}>
                  <MathInput
                    value={num1Tens}
                    onChange={setNum1Tens}
                    correctAnswer={tens1}
                    showFeedback={showFeedback}
                    size={size}
                  />
                </div>
                <div ref={num1OnesRef}>
                  <MathInput
                    value={num1Ones}
                    onChange={setNum1Ones}
                    correctAnswer={ones1}
                    showFeedback={showFeedback}
                    size={size}
                  />
                </div>
              </div>
            </div>

            {/* Plus sign between the two sections */}
            <div className="flex items-start pt-2">
              <span className={`${size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-xl'} font-bold`}>+</span>
            </div>
            
            {/* num2 section - 36 centered above its split */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-4" style={{ marginBottom: `${VERTICAL_SPACING * 0.5}px` }}>
                <div ref={topNum2Ref}>
                  <CircleNode value={num2} size={size} />
                </div>
              </div>
              <div className="flex items-center" style={{ gap: `${SPLIT_CIRCLES_GAP * 4}px`, marginTop: `${VERTICAL_SPACING * 4}px` }}>
                <div ref={num2TensRef}>
                  <MathInput
                    value={num2Tens}
                    onChange={setNum2Tens}
                    correctAnswer={tens2}
                    showFeedback={showFeedback}
                    size={size}
                  />
                </div>
                <div ref={num2OnesRef}>
                  <MathInput
                    value={num2Ones}
                    onChange={setNum2Ones}
                    correctAnswer={ones2}
                    showFeedback={showFeedback}
                    size={size}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row: Combine tens and ones with Step 2 label */}
        <div className="flex items-center gap-8 w-full" style={{ zIndex: 1 }}>
          <div className="text-gray-600 text-sm font-semibold whitespace-nowrap flex-shrink-0" style={{ width: '80px' }}>
            Step 2:<br />
            Combine<br />
            tens and ones.
          </div>
          
          <div className="flex items-center justify-center gap-4 flex-1 ml-28">
            <div ref={bottomTensRef}>
              <MathInput
                value={bottomTens}
                onChange={setBottomTens}
                correctAnswer={tensSum}
                showFeedback={showFeedback}
                size={size}
              />
            </div>
            <span className={`${size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-xl'} font-bold`}>+</span>
            <div ref={bottomOnesRef}>
              <MathInput
                value={bottomOnes}
                onChange={setBottomOnes}
                correctAnswer={onesSum}
                showFeedback={showFeedback}
                size={size}
              />
            </div>
            <span className={`${size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-xl'} font-bold`}>=</span>
            <input
              type="text"
              value={finalSum}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d+$/.test(val)) {
                  setFinalSum(val);
                }
              }}
              className={`${sizeClasses.box} border-2 border-gray-800 rounded text-center font-bold 
                focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors bg-white ${
                showFeedback && finalSum
                  ? parseInt(finalSum) === finalAnswer
                    ? '!border-green-500 !bg-green-50'
                    : '!border-red-500 !bg-red-50'
                  : ''
              }`}
              placeholder="?"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DEMO COMPONENT
// ============================================================================

const TwoDigitVisualAdditionDemo: React.FC = () => {
  const [showFeedback1, setShowFeedback1] = useState(false);
  const [showFeedback2, setShowFeedback2] = useState(false);
  const [showFeedback3, setShowFeedback3] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Two-Digit Visual Addition</h1>
        <p className="text-gray-600 mb-8">Split numbers into tens and ones, then combine</p>

        {/* Example 1: 65 + 36 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 1: 65 + 36 = ?</h3>
          <p className="text-gray-600 mb-4">
            Step 1: Split into tens and ones<br />
            Step 2: Combine tens (green lines) and ones (red lines)
          </p>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback1(!showFeedback1)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium 
                hover:!bg-green-600 transition-colors"
            >
              {showFeedback1 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <TwoDigitVisualAddition
            num1={65}
            num2={36}
            showFeedback={showFeedback1}
            size="md"
          />
        </div>

        {/* Example 2: 47 + 28 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 2: 47 + 28 = ?</h3>
          <p className="text-gray-600 mb-4">
            47 = 40 + 7, 28 = 20 + 8<br />
            40 + 20 = 60, 7 + 8 = 15, Total = 75
          </p>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback2(!showFeedback2)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium 
                hover:!bg-green-600 transition-colors"
            >
              {showFeedback2 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <TwoDigitVisualAddition
            num1={47}
            num2={28}
            showFeedback={showFeedback2}
            size="md"
          />
        </div>

        {/* Example 3: 83 + 54 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 3: 83 + 54 = ?</h3>
          <p className="text-gray-600 mb-4">
            83 = 80 + 3, 54 = 50 + 4<br />
            80 + 50 = 130, 3 + 4 = 7, Total = 137
          </p>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback3(!showFeedback3)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium 
                hover:!bg-green-600 transition-colors"
            >
              {showFeedback3 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <TwoDigitVisualAddition
            num1={83}
            num2={54}
            showFeedback={showFeedback3}
            size="md"
          />
        </div>

        {/* Features List */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Component Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Visual decomposition</strong> - Split two-digit numbers into tens and ones</li>
            <li>✅ <strong>Color-coded lines</strong> - Light green for tens, red for ones</li>
            <li>✅ <strong>Step-by-step inputs</strong> - 7 interactive fields to fill</li>
            <li>✅ <strong>Visual feedback</strong> - Green for correct, red for incorrect</li>
            <li>✅ <strong>Connecting lines</strong> - Shows the flow from split to combine</li>
            <li>✅ <strong>Scalable spacing</strong> - Adjust ADDEND_GROUP_GAP and SPLIT_CIRCLES_GAP constants</li>
            <li>✅ <strong>Size variants</strong> - sm, md, lg sizes available</li>
            <li>✅ <strong>TypeScript types exported</strong> - Full type safety</li>
          </ul>
        </div>

        {/* Usage Example */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
{`<TwoDigitVisualAddition
  num1={65}
  num2={36}
  showFeedback={showFeedback}
  size="md"
/>

// The component shows:
// Step 1: 65 splits into 60 + 5, 36 splits into 30 + 6
// Step 2: 60 + 30 = 90 (green lines), 5 + 6 = 11 (red lines)
// Result: 90 + 11 = 101

// SPACING CONTROLS - Three independent constants:
// 
// ADDEND_GROUP_GAP = 12  
//   - Horizontal gap between 65 and 36 sections
//
// SPLIT_CIRCLES_GAP = 6  
//   - Horizontal gap between tens and ones circles
//
// VERTICAL_SPACING = 6 (FIXED)
//   - Vertical distance between row 1 and row 2 circles
//   - Does NOT scale with horizontal gaps
//
// Example: Change ADDEND_GROUP_GAP to 8 or 16 to adjust horizontal spacing
//          Change VERTICAL_SPACING to 4 or 8 to adjust line length`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default TwoDigitVisualAdditionDemo;