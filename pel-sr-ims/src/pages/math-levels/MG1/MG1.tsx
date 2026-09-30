import React, { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TenFrameProps {
  filled: number | null;
  inputBox?: boolean;
  total?: number;
  interactive?: boolean;
  onCountChange?: (count: number) => void;
  showFeedback?: boolean;
  correctAnswer?: number;
  size?: 'sm' | 'md' | 'lg';
  fillColor?: string;
  emptyColor?: string;
}

// ============================================================================
// TEN FRAME COMPONENT
// ============================================================================

export const TenFrame: React.FC<TenFrameProps> = ({
  filled,
  inputBox = false,
  total = 10,
  interactive = false,
  onCountChange,
  showFeedback = false,
  correctAnswer,
  size = 'md',
  fillColor = 'bg-red-500',
  emptyColor = 'bg-white'
}) => {
  const [count, setCount] = useState(filled ?? 0);
  const [inputValue, setInputValue] = useState('');

  const getCellSize = () => {
    const sizes = {
      sm: 40,
      md: 50,
      lg: 60
    };
    return sizes[size];
  };

  const cellSize = getCellSize();
  const rows = total === 10 ? 2 : Math.ceil(total / 5);
  const cols = total === 10 ? 5 : 5;

  const handleCellClick = (index: number) => {
    if (!interactive) return;
    
    const newCount = count === (index + 1) ? 0 : (index + 1);
    const finalCount = Math.max(0, Math.min(total, newCount));
    
    setCount(finalCount);
    onCountChange?.(finalCount);
  };

  // For input mode, use the filled prop to display
  // For interactive mode, use the count state
  const displayCount = inputBox ? (filled ?? 0) : (filled !== null ? filled : count);
  
  // For input mode, check against the input value
  // For interactive mode, check against the count
  const userAnswer = inputBox ? (inputValue ? parseInt(inputValue) : null) : count;
  const isCorrect = correctAnswer !== undefined && userAnswer !== null && userAnswer === correctAnswer;
  const isIncorrect = correctAnswer !== undefined && userAnswer !== null && userAnswer !== correctAnswer;

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Ten Frame Grid */}
      <div 
        className={`grid gap-1 p-2 bg-gray-800 rounded ${
          showFeedback && correctAnswer !== undefined
            ? isCorrect
              ? 'ring-4 ring-green-500'
              : isIncorrect 
                ? 'ring-4 ring-red-500'
                : ''
            : ''
        }`}
        style={{
          gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${rows}, ${cellSize}px)`
        }}
      >
        {Array.from({ length: total }).map((_, index) => {
          const isFilled = index < displayCount;
          return (
            <div
              key={index}
              onClick={() => handleCellClick(index)}
              className={`border-2 border-gray-800 rounded-sm transition-all ${
                isFilled ? fillColor : emptyColor
              } ${
                interactive ? 'cursor-pointer hover:opacity-80' : ''
              }`}
              style={{
                width: `${cellSize}px`,
                height: `${cellSize}px`
              }}
            />
          );
        })}
      </div>

      {/* Input box for input mode */}
      {inputBox && !interactive && (
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            const val = e.target.value;
            if (val === '' || /^\d+$/.test(val)) {
              setInputValue(val);
            }
          }}
          className={`w-20 text-center text-2xl font-semibold border-2 border-gray-800 rounded px-2 py-2
            focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
            showFeedback && inputValue
              ? isCorrect
                ? 'bg-green-50 text-green-700 border-green-500'
                : 'bg-red-50 text-red-700 border-red-500'
              : ''
          }`}
          placeholder="?"
          maxLength={2}
        />
      )}

      {/* Count display for interactive mode */}
      {interactive && (
        <>
          <div className="text-3xl font-bold text-gray-800">
            {count}
          </div>
          {correctAnswer !== undefined && (
            <p className="text-center text-gray-600">
              Select {correctAnswer} {correctAnswer === 1 ? 'box' : 'boxes'}.
            </p>
          )}
        </>
      )}
    </div>
  );
};

// ============================================================================
// DEMO COMPONENT
// ============================================================================

const TenFrameDemo: React.FC = () => {
  const [showFeedbackInput, setShowFeedbackInput] = useState(false);
  const [showFeedbackInteractive, setShowFeedbackInteractive] = useState(false);
  const [interactiveCount, setInteractiveCount] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Ten Frame Component</h1>
        <p className="text-gray-600 mb-8">Visual representation for counting and number sense</p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Static Display */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Static Display</h2>
            <p className="text-gray-600 mb-4">Shows a fixed number of counters</p>
            <TenFrame filled={7} size="lg" />
            <p className="text-center mt-4 text-xl font-semibold">7 counters</p>
          </div>

          {/* Input Mode */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Input Mode</h2>
            <p className="text-gray-600 mb-4">Student sees the counters and types the answer</p>
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowFeedbackInput(!showFeedbackInput)}
                className="mb-4 px-4 py-2 !bg-green-500 !text-white rounded-lg font-medium 
                  hover:bg-green-600 transition-colors"
              >
                {showFeedbackInput ? 'Hide' : 'Check'} Answer
              </button>
              <TenFrame 
                filled={8}
                inputBox={true} 
                size="lg" 
                showFeedback={showFeedbackInput}
                correctAnswer={8}
              />
              <p className="text-center mt-4 text-gray-600">How many counters?</p>
            </div>
          </div>

          {/* Interactive Mode */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Interactive Mode</h2>
            <p className="text-gray-600 mb-4">Click cells to select counters</p>
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowFeedbackInteractive(!showFeedbackInteractive)}
                className="mb-4 px-4 py-2 !bg-green-500 !text-white rounded-lg font-medium 
                  !hover:bg-green-600 transition-colors"
              >
                {showFeedbackInteractive ? 'Hide' : 'Check'} Answer
              </button>
              <TenFrame 
                filled={interactiveCount}
                interactive={true}
                fillColor='bg-blue-400'
                onCountChange={setInteractiveCount}
                showFeedback={showFeedbackInteractive}
                correctAnswer={7}
                size="lg"
              />
            </div>
          </div>

          {/* Different Colors */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Custom Colors</h2>
            <p className="text-gray-600 mb-4">Different counter colors</p>
            <div className="space-y-4">
              <div className="flex flex-col items-center">
                <TenFrame filled={5} size="md" fillColor="bg-blue-500" />
                <p className="text-sm text-gray-600 mt-2">Blue counters</p>
              </div>
              <div className="flex flex-col items-center">
                <TenFrame filled={9} size="md" fillColor="bg-green-500" />
                <p className="text-sm text-gray-600 mt-2">Green counters</p>
              </div>
            </div>
          </div>

          {/* Twenty Frame */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Twenty Frame</h2>
            <p className="text-gray-600 mb-4">Extends to larger numbers</p>
            <TenFrame filled={15} total={20} size="md" fillColor="bg-purple-500" />
            <p className="text-center mt-4 text-xl font-semibold">15 counters</p>
          </div>

          {/* Multiple Sizes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Size Variants</h2>
            <p className="text-gray-600 mb-4">Small, medium, and large</p>
            <div className="space-y-4 flex flex-col items-center">
              <div>
                <TenFrame filled={4} size="sm" />
                <p className="text-sm text-center mt-2">Small</p>
              </div>
              <div>
                <TenFrame filled={4} size="md" />
                <p className="text-sm text-center mt-2">Medium</p>
              </div>
              <div>
                <TenFrame filled={4} size="lg" />
                <p className="text-sm text-center mt-2">Large</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Component Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <ul className="space-y-2 text-gray-700">
              <li>✅ <strong>Static display</strong> - Show fixed number of counters</li>
              <li>✅ <strong>Input mode</strong> - Student types the count</li>
              <li>✅ <strong>Interactive mode</strong> - Click to add/remove counters</li>
              <li>✅ <strong>Visual feedback</strong> - Green/red border for answers</li>
            </ul>
            <ul className="space-y-2 text-gray-700">
              <li>✅ <strong>Flexible totals</strong> - 10, 20, or custom amounts</li>
              <li>✅ <strong>Custom colors</strong> - Choose counter colors</li>
              <li>✅ <strong>Size variants</strong> - sm, md, lg</li>
              <li>✅ <strong>TypeScript types</strong> - Full type safety</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TenFrameDemo;