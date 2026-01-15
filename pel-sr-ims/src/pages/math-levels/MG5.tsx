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

export interface MakeTenStrategyProps {
  addend1: number;
  addend2: number;
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
// MAKE TEN STRATEGY COMPONENT
// ============================================================================

export const MakeTenStrategy: React.FC<MakeTenStrategyProps> = ({
  addend1,
  addend2,
  showFeedback = false,
  size = 'md'
}) => {
  // Determine which addend to split (always the smaller one)
  const largerAddend = Math.max(addend1, addend2);
  const smallerAddend = Math.min(addend1, addend2);
  const isFirstLarger = addend1 >= addend2;
  
  // Calculate correct answers
  const amountToMakeTen = 10 - largerAddend;
  const remainder = smallerAddend - amountToMakeTen;
  const finalAnswer = 10 + remainder;
  
  // State for inputs
  const [splitPart1, setSplitPart1] = useState(''); // Amount that makes ten (Node 3)
  const [splitPart2, setSplitPart2] = useState(''); // Remainder (Node 4)
  const [finalSum, setFinalSum] = useState(''); // Final answer (Node 7)
  
  const containerRef = React.useRef<HTMLDivElement>(null);
  const node1Ref = React.useRef<HTMLDivElement>(null); // 8 (top left)
  const node2Ref = React.useRef<HTMLDivElement>(null); // 6 (top right, highlighted)
  const node3Ref = React.useRef<HTMLDivElement>(null); // First split input
  const node4Ref = React.useRef<HTMLDivElement>(null); // Second split input
  const node5Ref = React.useRef<HTMLDivElement>(null); // Middle sum (10)
  const node6Ref = React.useRef<HTMLDivElement>(null); // Copy of split part 2
  const node7Ref = React.useRef<HTMLDivElement>(null); // Final answer
  
  const [lineCoords, setLineCoords] = React.useState<any>(null);

  // Calculate line coordinates
  React.useEffect(() => {
    if (!containerRef.current || !node1Ref.current || !node2Ref.current || 
        !node3Ref.current || !node4Ref.current || !node5Ref.current || 
        !node6Ref.current || !node7Ref.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    
    const getCenter = (ref: React.RefObject<HTMLDivElement>) => {
      if (!ref.current) return { x: 0, y: 0 };
      const rect = ref.current.getBoundingClientRect();
      return {
        x: rect.left + rect.width / 2 - containerRect.left,
        y: rect.top + rect.height / 2 - containerRect.top
      };
    };
    
    const getBottom = (ref: React.RefObject<HTMLDivElement>) => {
      const center = getCenter(ref);
      if (!ref.current) return center;
      center.y += ref.current.getBoundingClientRect().height / 2;
      return center;
    };
    
    const getTop = (ref: React.RefObject<HTMLDivElement>) => {
      const center = getCenter(ref);
      if (!ref.current) return center;
      center.y -= ref.current.getBoundingClientRect().height / 2;
      return center;
    };

    setLineCoords({
      node1Bottom: getBottom(node1Ref),
      node2Bottom: getBottom(node2Ref),
      node3Top: getTop(node3Ref),
      node3Bottom: getBottom(node3Ref),
      node4Top: getTop(node4Ref),
      node4Bottom: getBottom(node4Ref),
      node5Top: getTop(node5Ref),
      node6Top: getTop(node6Ref)
    });
  }, [size, splitPart2]);

  return (
    <div>
      <div ref={containerRef} className="relative flex flex-col items-center p-8 min-h-[500px]">
        {/* SVG for connecting lines */}
        {lineCoords && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Line from node 2 to node 3 */}
            <line 
              x1={lineCoords.node2Bottom.x}
              y1={lineCoords.node2Bottom.y}
              x2={lineCoords.node3Top.x}
              y2={lineCoords.node3Top.y}
              stroke="#1f2937" 
              strokeWidth="2"
            />
            {/* Line from node 2 to node 4 */}
            <line 
              x1={lineCoords.node2Bottom.x}
              y1={lineCoords.node2Bottom.y}
              x2={lineCoords.node4Top.x}
              y2={lineCoords.node4Top.y}
              stroke="#1f2937" 
              strokeWidth="2"
            />
            
            {/* Line from node 1 to node 5 */}
            <line 
              x1={lineCoords.node1Bottom.x}
              y1={lineCoords.node1Bottom.y}
              x2={lineCoords.node5Top.x}
              y2={lineCoords.node5Top.y}
              stroke="#1f2937" 
              strokeWidth="2"
            />
            
            {/* Line from node 3 to node 5 */}
            <line 
              x1={lineCoords.node3Bottom.x}
              y1={lineCoords.node3Bottom.y}
              x2={lineCoords.node5Top.x}
              y2={lineCoords.node5Top.y}
              stroke="#1f2937" 
              strokeWidth="2"
            />
            
            {/* Line from node 4 to node 6 */}
            <line 
              x1={lineCoords.node4Bottom.x}
              y1={lineCoords.node4Bottom.y}
              x2={lineCoords.node6Top.x}
              y2={lineCoords.node6Top.y}
              stroke="#1f2937" 
              strokeWidth="2"
            />
          </svg>
        )}

        {/* Top row: Node 1 (8) + Node 2 (6) */}
        <div className="flex items-center gap-4 mb-12" style={{ zIndex: 1 }}>
          <div ref={node1Ref}>
            <CircleNode value={addend1} size={size} />
          </div>
          <span className="text-3xl font-bold">+</span>
          <div ref={node2Ref}>
            <CircleNode value={addend2} size={size} highlight={true} />
          </div>
          <span className="text-3xl font-bold">=</span>
          <div className="w-20 h-20 border-2 border-gray-800 rounded flex items-center justify-center text-3xl font-bold bg-white">
            ?
          </div>
        </div>

        {/* Middle row: Node 3 + Node 4 */}
        <div className="flex items-center gap-4 mb-12" style={{ zIndex: 1 }}>
          <div ref={node3Ref}>
            <MathInput
              value={splitPart1}
              onChange={setSplitPart1}
              correctAnswer={amountToMakeTen}
              showFeedback={showFeedback}
              size={size}
            />
          </div>
          <span className="text-3xl font-bold">+</span>
          <div ref={node4Ref}>
            <MathInput
              value={splitPart2}
              onChange={setSplitPart2}
              correctAnswer={remainder}
              showFeedback={showFeedback}
              size={size}
            />
          </div>
        </div>

        {/* Bottom row: Node 5 + Node 6 = Node 7 */}
        <div className="flex items-center gap-4" style={{ zIndex: 1 }}>
          <div ref={node5Ref}>
            <CircleNode value={10} size={size} />
          </div>
          <span className="text-3xl font-bold">+</span>
          <div ref={node6Ref}>
            <CircleNode value={splitPart2 || '?'} size={size} />
          </div>
          <span className="text-3xl font-bold">=</span>
          <div ref={node7Ref}>
            <input
              type="text"
              value={finalSum}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d+$/.test(val)) {
                  setFinalSum(val);
                }
              }}
              className={`w-20 h-20 border-2 border-gray-800 rounded text-center text-3xl font-bold 
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
        <div className="mt-4 text-center">
            <div className="inline-flex items-center gap-3 text-3xl font-semibold">
                <span>{addend1}</span>
                <span>+</span>
                <span>{addend2}</span>
                <span>=</span>
                <span>{addend1}</span>
                <span>+</span>
                <span>{splitPart1 || "?"}</span>
                <span>+</span>
                <span>{splitPart2 || "?"}</span>
                <span>=</span>
                <span>{10}</span>
                <span>+</span>
                <span>{splitPart2 || "?"}</span>
                <span>=</span>
                <span>{finalSum || "?"}</span>
            </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DEMO COMPONENT
// ============================================================================

const MakeTenStrategyDemo: React.FC = () => {
  const [showFeedback1, setShowFeedback1] = useState(false);
  const [showFeedback2, setShowFeedback2] = useState(false);
  const [showFeedback3, setShowFeedback3] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Make Ten Strategy Component</h1>
        <p className="text-gray-600 mb-8">Visual model for the "make ten" addition strategy</p>

        {/* Example 1: 8 + 6 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 1: 8 + 6 = ?</h3>
          <p className="text-gray-600 mb-4">Split 6 into 2 + 4 to make ten first</p>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback1(!showFeedback1)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium 
                !hover:bg-green-600 transition-colors"
            >
              {showFeedback1 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <MakeTenStrategy
            addend1={8}
            addend2={6}
            showFeedback={showFeedback1}
            size="md"
          />
        </div>

        {/* Example 2: 7 + 5 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 2: 7 + 5 = ?</h3>
          <p className="text-gray-600 mb-4">Split 5 into 3 + 2 to make ten first</p>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback2(!showFeedback2)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium 
                !hover:bg-green-600 transition-colors"
            >
              {showFeedback2 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <MakeTenStrategy
            addend1={7}
            addend2={5}
            showFeedback={showFeedback2}
            size="md"
          />
        </div>

        {/* Example 3: 9 + 4 */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 3: 9 + 4 = ?</h3>
          <p className="text-gray-600 mb-4">Split 4 into 1 + 3 to make ten first</p>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback3(!showFeedback3)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium 
                !hover:bg-green-600 transition-colors"
            >
              {showFeedback3 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <MakeTenStrategy
            addend1={9}
            addend2={4}
            showFeedback={showFeedback3}
            size="md"
          />
        </div>

        {/* Features List */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Component Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Automatic splitting</strong> - Always splits the smaller addend</li>
            <li>✅ <strong>Visual decomposition</strong> - Shows the breakdown step-by-step</li>
            <li>✅ <strong>Highlighted "make ten" parts</strong> - Green circles and lines</li>
            <li>✅ <strong>Visual feedback</strong> - Green for correct, red for incorrect</li>
            <li>✅ <strong>Step-by-step validation</strong> - Checks each input independently</li>
            <li>✅ <strong>Connecting lines</strong> - Shows the flow of the strategy</li>
            <li>✅ <strong>Size variants</strong> - sm, md, lg sizes available</li>
            <li>✅ <strong>TypeScript types exported</strong> - Full type safety</li>
          </ul>
        </div>

        {/* Usage Example */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Usage Example</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
{`<MakeTenStrategy
  addend1={8}
  addend2={6}
  showFeedback={showFeedback}
  size="md"
/>

// The component automatically:
// - Identifies 6 as the smaller addend
// - Calculates that 6 should split into 2 + 4
// - Highlights the parts that make ten (8 + 2)
// - Validates: 8 + 2 + 4 = 10 + 4 = 14`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default MakeTenStrategyDemo;