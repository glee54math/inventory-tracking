import React, { useState } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface TapeDiagramProps {
  parts: (number | null)[];
  total?: number | null;
  showTotal?: boolean;
  labels?: string[];
  onAnswerChange?: (value: string, index: number) => void;
  showFeedback?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

// ============================================================================
// TAPE DIAGRAM COMPONENT
// ============================================================================

export const TapeDiagram: React.FC<TapeDiagramProps> = ({
  parts,
  total = null,
  showTotal = true,
  labels = [],
  onAnswerChange,
  showFeedback = false,
  size = 'md'
}) => {
  const [inputValues, setInputValues] = useState<string[]>(parts.map(() => ''));
  const [totalInput, setTotalInput] = useState<string>('');

  const getBoxDimensions = () => {
    const dimensions = {
      sm: { width: 60, height: 40, fontSize: 'text-base' },
      md: { width: 80, height: 50, fontSize: 'text-xl' },
      lg: { width: 100, height: 60, fontSize: 'text-2xl' }
    };
    return dimensions[size];
  };

  const dimensions = getBoxDimensions();

  // Don't auto-calculate if total is explicitly null (user needs to input it)
  const isTotalUnknown = total === null;
  
  // Calculate what the correct total should be (for validation)
  const correctTotal = parts.every(p => p !== null) 
    ? parts.reduce((sum, p) => sum! + p!, 0) 
    : null;

  const handleInputChange = (value: string, index: number) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;
    setInputValues(newInputValues);
    onAnswerChange?.(value, index);
  };

  const getCorrectAnswer = (index: number): number | undefined => {
    // If this part is unknown and we have the total and all other parts
    if (parts[index] === null && total !== null) {
      const knownSum = parts.reduce((sum, p, i) => {
        if (i === index) return sum;
        return (sum||0) + (p ?? 0);
      }, 0);
      return total - (knownSum||0);
    }
    return undefined;
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Tape boxes */}
      <div className="flex">
        {parts.map((part, index) => (
          <div key={index} className="relative">
            {/* Box */}
            <div
              className="border-2 border-gray-800 flex items-center justify-center font-semibold bg-white"
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`
              }}
            >
              {part === null ? (
                <input
                  type="text"
                  value={inputValues[index]}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '' || /^\d+$/.test(val)) {
                      handleInputChange(val, index);
                    }
                  }}
                  className={`w-full h-full text-center font-semibold focus:outline-none focus:ring-2 
                    focus:ring-blue-400 transition-colors ${dimensions.fontSize} ${
                    showFeedback && inputValues[index]
                      ? parseInt(inputValues[index]) === getCorrectAnswer(index)
                        ? 'bg-green-50 text-green-700'
                        : 'bg-red-50 text-red-700'
                      : ''
                  }`}
                  placeholder="?"
                />
              ) : (
                <span className={dimensions.fontSize}>{part}</span>
              )}
            </div>

            {/* Label below each box */}
            {labels[index] && (
              <div className="text-center text-sm text-gray-600 mt-1">
                {labels[index]}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Total bracket below */}
      {showTotal && (
        <div className="relative" style={{ width: `${dimensions.width * parts.length}px` }}>
          {/* Bracket */}
          <svg 
            width={dimensions.width * parts.length} 
            height="30" 
            className="absolute top-0"
          >
            {/* Bottom horizontal line */}
            <line
              x1="0"
              y1="0"
              x2={dimensions.width * parts.length}
              y2="0"
              stroke="#1f2937"
              strokeWidth="2"
            />
            {/* Left vertical tick */}
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="10"
              stroke="#1f2937"
              strokeWidth="2"
            />
            {/* Right vertical tick */}
            <line
              x1={dimensions.width * parts.length}
              y1="0"
              x2={dimensions.width * parts.length}
              y2="10"
              stroke="#1f2937"
              strokeWidth="2"
            />
          </svg>

          {/* Total value */}
          <div className="flex justify-center items-center" style={{ marginTop: '15px' }}>
            {isTotalUnknown ? (
              <input
                type="text"
                value={totalInput}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d+$/.test(val)) {
                    setTotalInput(val);
                  }
                }}
                className={`w-20 text-center font-semibold focus:outline-none focus:ring-2 
                  focus:ring-blue-400 transition-colors border-2 border-gray-300 rounded px-2 py-1 ${dimensions.fontSize} ${
                  showFeedback && totalInput
                    ? parseInt(totalInput) === correctTotal
                      ? 'bg-green-50 text-green-700 border-green-500'
                      : 'bg-red-50 text-red-700 border-red-500'
                    : ''
                }`}
                placeholder="?"
              />
            ) : (
              <span className={`font-semibold ${dimensions.fontSize}`}>
                {total}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DEMO COMPONENT
// ============================================================================

const MathDiagramDemo: React.FC = () => {
    const [showFeedback] = useState(false);
  
    const [tapeExample, setTapeExample] = useState<'example1' | 'example2' | 'example3'>('example1');

    const tapeExamples = {
        example1: { parts: [5, 3, null], total: 10, labels: [] },
        example2: { parts: [null, 4, 6, 2], total: 15, labels: ['A', 'B', 'C', 'D'] },
        example3: { parts: [10, 20, 15], total: null, labels: ['Week 1', 'Week 2', 'Week 3'] }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Tape Diagram Controls */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Tape Diagram Controls</h2>
          
                    <div className="flex gap-4 mb-4">
                        <button
                            onClick={() => setTapeExample('example1')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                tapeExample === 'example1' 
                                ? '!bg-purple-500 !text-white' 
                                : '!bg-gray-200 !text-gray-700 !hover:bg-gray-300'
                            }`}
                            >
                            3 Parts
                        </button>
                        <button
                            onClick={() => setTapeExample('example2')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                tapeExample === 'example2' 
                                ? '!bg-purple-500 !text-white' 
                                : '!bg-gray-200 !text-gray-700 !hover:bg-gray-300'
                            }`}
                            >
                            4 Parts + Labels
                        </button>
                        <button
                            onClick={() => setTapeExample('example3')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                tapeExample === 'example3' 
                                ? '!bg-purple-500 !text-white' 
                                : '!bg-gray-200 !text-gray-700 !hover:bg-gray-300'
                            }`}
                        >
                            Find Total
                        </button>
                    </div>
                </div>

                {/* Tape Diagram */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                    <h2 className="text-2xl font-semibold mb-6 text-center">Tape Diagram</h2>
                    
                    <TapeDiagram
                        parts={tapeExamples[tapeExample].parts}
                        total={tapeExamples[tapeExample].total}
                        labels={tapeExamples[tapeExample].labels}
                        showFeedback={showFeedback}
                        size="lg"
                    />
                </div>
            </div>
        </div>
    );
}

export default MathDiagramDemo;