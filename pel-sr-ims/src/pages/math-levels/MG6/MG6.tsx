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

const TapeDiagramDemo: React.FC = () => {
  const [showFeedback1, setShowFeedback1] = useState(false);
  const [showFeedback2, setShowFeedback2] = useState(false);
  const [showFeedback3, setShowFeedback3] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Tape Diagram Component</h1>
        <p className="text-gray-600 mb-8">Visual model for part-whole relationships and addition</p>

        {/* Example 1: 3 Parts */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 1: Find Missing Part (3 Parts)</h3>
          <p className="text-gray-600 mb-4">Find the missing part when total is known</p>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback1(!showFeedback1)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium 
                hover:bg-green-600 transition-colors"
            >
              {showFeedback1 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <TapeDiagram
            parts={[5, 3, null]}
            total={10}
            showFeedback={showFeedback1}
            size="lg"
          />
        </div>

        {/* Example 2: 4 Parts + Labels */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 2: With Labels (4 Parts)</h3>
          <p className="text-gray-600 mb-4">Multiple parts with custom labels</p>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback2(!showFeedback2)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium 
                hover:bg-green-600 transition-colors"
            >
              {showFeedback2 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <TapeDiagram
            parts={[null, 4, 6, 2]}
            total={15}
            labels={['A', 'B', 'C', 'D']}
            showFeedback={showFeedback2}
            size="lg"
          />
        </div>

        {/* Example 3: Find Total */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 3: Find Total</h3>
          <p className="text-gray-600 mb-4">All parts known, find the total sum</p>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback3(!showFeedback3)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium 
                hover:bg-green-600 transition-colors"
            >
              {showFeedback3 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <TapeDiagram
            parts={[10, 20, 15]}
            total={null}
            labels={['Week 1', 'Week 2', 'Week 3']}
            showFeedback={showFeedback3}
            size="lg"
          />
        </div>

        {/* Features List */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Component Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Variable number of parts</strong> - Any number of sections</li>
            <li>✅ <strong>Optional labels</strong> - Add custom labels below each part</li>
            <li>✅ <strong>Show/hide total</strong> - Toggle total bracket display</li>
            <li>✅ <strong>Find unknown parts or total</strong> - Flexible problem types</li>
            <li>✅ <strong>Visual feedback</strong> - Green for correct, red for incorrect</li>
            <li>✅ <strong>Automatic validation</strong> - Calculates correct answers</li>
            <li>✅ <strong>Size variants</strong> - sm, md, lg sizes available</li>
            <li>✅ <strong>TypeScript types exported</strong> - Full type safety</li>
          </ul>
        </div>

        {/* Usage Examples */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Example 1: Find Missing Part (3 Parts)</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<TapeDiagram
  parts={[5, 3, null]}  // null = input box
  total={10}
  showFeedback={showFeedback}
  size="lg"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Example 2: With Labels (4 Parts)</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<TapeDiagram
  parts={[null, 4, 6, 2]}
  total={15}
  labels={['A', 'B', 'C', 'D']}
  showFeedback={showFeedback}
  size="lg"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Example 3: Find Total</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`<TapeDiagram
  parts={[10, 20, 15]}
  total={null}  // null = input box for total
  labels={['Week 1', 'Week 2', 'Week 3']}
  showFeedback={showFeedback}
  size="lg"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Props Reference</h3>
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`interface TapeDiagramProps {
  parts: (number | null)[];    // Array of values, null for input
  total?: number | null;        // Total value, null for input
  showTotal?: boolean;          // Show/hide total bracket
  labels?: string[];            // Optional labels for each part
  onAnswerChange?: (value: string, index: number) => void;
  showFeedback?: boolean;       // Show green/red feedback
  size?: 'sm' | 'md' | 'lg';   // Component size
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TapeDiagramDemo;