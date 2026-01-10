import React, { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface CircleNodeProps {
  value: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface MathInputProps {
  value: string;
  onChange: (value: string) => void;
  correctAnswer?: number;
  showFeedback?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface PartPartWholeProps {
  whole: number | null;
  part1: number | null;
  part2: number | null;
  onAnswerChange?: (value: string, position: 'whole' | 'part1' | 'part2') => void;
  showFeedback?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const getSizeClasses = (size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizes = {
    sm: { circle: 'w-12 h-12 text-lg', input: 'w-12 h-12 text-lg' },
    md: { circle: 'w-16 h-16 text-2xl', input: 'w-16 h-16 text-2xl' },
    lg: { circle: 'w-20 h-20 text-3xl', input: 'w-20 h-20 text-3xl' }
  };
  return sizes[size];
};

// ============================================================================
// PRIMITIVE COMPONENTS
// ============================================================================

export const CircleNode: React.FC<CircleNodeProps> = ({ 
  value, 
  size = 'md',
  className = '' 
}) => {
  const sizeClasses = getSizeClasses(size);
  
  return (
    <div 
      className={`${sizeClasses.circle} rounded-full border-2 border-gray-800 
        flex items-center justify-center font-semibold bg-white ${className}`}
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
    // Only allow numbers
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
// PART-PART-WHOLE COMPONENT
// ============================================================================

export const PartPartWhole: React.FC<PartPartWholeProps> = ({
  whole,
  part1,
  part2,
  onAnswerChange,
  showFeedback = false,
  size = 'md'
}) => {
  const [wholeInput, setWholeInput] = useState('');
  const [part1Input, setPart1Input] = useState('');
  const [part2Input, setPart2Input] = useState('');
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const wholeRef = React.useRef<HTMLDivElement>(null);
  const part1Ref = React.useRef<HTMLDivElement>(null);
  const part2Ref = React.useRef<HTMLDivElement>(null);
  const [lineCoords, setLineCoords] = React.useState<{
    whole: { x: number; y: number };
    part1: { x: number; y: number };
    part2: { x: number; y: number };
  } | null>(null);

  // Calculate line coordinates after render
  React.useEffect(() => {
    if (!containerRef.current || !wholeRef.current || !part1Ref.current || !part2Ref.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const wholeRect = wholeRef.current.getBoundingClientRect();
    const part1Rect = part1Ref.current.getBoundingClientRect();
    const part2Rect = part2Ref.current.getBoundingClientRect();

    // Calculate center points relative to container
    const wholeCenterX = wholeRect.left + wholeRect.width / 2 - containerRect.left;
    const wholeCenterY = wholeRect.top + wholeRect.height / 2 - containerRect.top;
    const wholeBottomY = wholeCenterY + wholeRect.height / 2; // 6 o'clock

    const part1CenterX = part1Rect.left + part1Rect.width / 2 - containerRect.left;
    const part1CenterY = part1Rect.top + part1Rect.height / 2 - containerRect.top;
    const part1TopY = part1CenterY - part1Rect.height / 2; // 12 o'clock

    const part2CenterX = part2Rect.left + part2Rect.width / 2 - containerRect.left;
    const part2CenterY = part2Rect.top + part2Rect.height / 2 - containerRect.top;
    const part2TopY = part2CenterY - part2Rect.height / 2; // 12 o'clock

    setLineCoords({
      whole: { x: wholeCenterX, y: wholeBottomY },
      part1: { x: part1CenterX, y: part1TopY },
      part2: { x: part2CenterX, y: part2TopY }
    });
  }, [size, whole, part1, part2]);

  // Determine correct answers based on what's known
  const getCorrectAnswer = (position: 'whole' | 'part1' | 'part2'): number | undefined => {
    if (position === 'whole' && part1 !== null && part2 !== null) {
      return part1 + part2;
    }
    if (position === 'part1' && whole !== null && part2 !== null) {
      return whole - part2;
    }
    if (position === 'part2' && whole !== null && part1 !== null) {
      return whole - part1;
    }
    return undefined;
  };

  const handleInputChange = (value: string, position: 'whole' | 'part1' | 'part2') => {
    if (position === 'whole') setWholeInput(value);
    if (position === 'part1') setPart1Input(value);
    if (position === 'part2') setPart2Input(value);
    
    onAnswerChange?.(value, position);
  };

  // Get display values for equation
  const getDisplayValue = (position: 'whole' | 'part1' | 'part2'): string => {
    if (position === 'whole') {
      return whole !== null ? whole.toString() : (wholeInput || '?');
    }
    if (position === 'part1') {
      return part1 !== null ? part1.toString() : (part1Input || '?');
    }
    if (position === 'part2') {
      return part2 !== null ? part2.toString() : (part2Input || '?');
    }
    return '?';
  };

  return (
    <div>
      <div ref={containerRef} className="relative flex flex-col items-center p-8">
        {/* SVG for connecting lines */}
        {lineCoords && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Line from whole (6 o'clock) to part1 (12 o'clock) */}
            <line 
              x1={lineCoords.whole.x}
              y1={lineCoords.whole.y}
              x2={lineCoords.part1.x}
              y2={lineCoords.part1.y}
              stroke="#1f2937" 
              strokeWidth="2"
            />
            {/* Line from whole (6 o'clock) to part2 (12 o'clock) */}
            <line 
              x1={lineCoords.whole.x}
              y1={lineCoords.whole.y}
              x2={lineCoords.part2.x}
              y2={lineCoords.part2.y}
              stroke="#1f2937" 
              strokeWidth="2"
            />
          </svg>
        )}

        {/* Whole (top) */}
        <div ref={wholeRef} className="mb-16" style={{ zIndex: 1 }}>
          {whole === null ? (
            <MathInput
              value={wholeInput}
              onChange={(val) => handleInputChange(val, 'whole')}
              correctAnswer={getCorrectAnswer('whole')}
              showFeedback={showFeedback}
              size={size}
            />
          ) : (
            <CircleNode value={whole} size={size} />
          )}
        </div>

        {/* Parts (bottom) */}
        <div className="flex gap-12" style={{ zIndex: 1 }}>
          {/* Part 1 */}
          <div ref={part1Ref}>
            {part1 === null ? (
              <MathInput
                value={part1Input}
                onChange={(val) => handleInputChange(val, 'part1')}
                correctAnswer={getCorrectAnswer('part1')}
                showFeedback={showFeedback}
                size={size}
              />
            ) : (
              <CircleNode value={part1} size={size} />
            )}
          </div>

          {/* Part 2 */}
          <div ref={part2Ref}>
            {part2 === null ? (
              <MathInput
                value={part2Input}
                onChange={(val) => handleInputChange(val, 'part2')}
                correctAnswer={getCorrectAnswer('part2')}
                showFeedback={showFeedback}
                size={size}
              />
            ) : (
              <CircleNode value={part2} size={size} />
            )}
          </div>
        </div>
      </div>

      {/* Equation Display */}
      <div className="mt-4 text-center">
        <div className="inline-flex items-center gap-3 text-3xl font-semibold">
          <span>{getDisplayValue('part1')}</span>
          <span>+</span>
          <span>{getDisplayValue('part2')}</span>
          <span>=</span>
          <span>{getDisplayValue('whole')}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DEMO COMPONENT
// ============================================================================

const PartPartWholeDemo: React.FC = () => {
  const [showFeedback1, setShowFeedback1] = useState(false);
  const [showFeedback2, setShowFeedback2] = useState(false);
  const [showFeedback3, setShowFeedback3] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Part-Part-Whole Component</h1>
        <p className="text-gray-600 mb-8">Visual model for addition and part-whole relationships</p>

        {/* Find Part 2 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 1: Find Part 2</h3>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback1(!showFeedback1)}
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium 
                hover:bg-green-600 transition-colors"
            >
              {showFeedback1 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <PartPartWhole
            whole={12}
            part1={10}
            part2={null}
            showFeedback={showFeedback1}
            size="lg"
          />
        </div>

        {/* Find Part 1 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 2: Find Part 1</h3>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback2(!showFeedback2)}
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium 
                hover:bg-green-600 transition-colors"
            >
              {showFeedback2 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <PartPartWhole
            whole={15}
            part1={null}
            part2={7}
            showFeedback={showFeedback2}
            size="lg"
          />
        </div>

        {/* Find Whole */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 3: Find Whole</h3>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback3(!showFeedback3)}
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium 
                hover:bg-green-600 transition-colors"
            >
              {showFeedback3 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <PartPartWhole
            whole={null}
            part1={8}
            part2={5}
            showFeedback={showFeedback3}
            size="lg"
          />
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Component Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Flexible unknowns</strong> - Any position can be the input</li>
            <li>✅ <strong>Automatic validation</strong> - Calculates correct answer based on known values</li>
            <li>✅ <strong>Visual feedback</strong> - Green for correct, red for incorrect</li>
            <li>✅ <strong>Number-only inputs</strong> - Validates input to numbers only</li>
            <li>✅ <strong>Live equation updates</strong> - Shows user input in real-time</li>
            <li>✅ <strong>Size variants</strong> - sm, md, lg sizes available</li>
            <li>✅ <strong>TypeScript types exported</strong> - Full type safety</li>
            <li>✅ <strong>Reusable primitives</strong> - CircleNode, MathInput can be used independently</li>
          </ul>
        </div>

        {/* Usage Example */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
{`<PartPartWhole
  whole={12}
  part1={10}
  part2={null}  // This becomes the input
  showFeedback={showFeedback}
  size="lg"
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default PartPartWholeDemo;