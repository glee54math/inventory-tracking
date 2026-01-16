import React, { useState, useRef, useEffect } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface VerticalMathProps {
  nums: (number | string)[];
  operation: 'add' | 'addition' | '+' | 'sub' | 'subtract' | 'subtraction' | '-';
  numOfDigitsMissing?: number;
  showFeedback?: boolean;
  showCarry?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

interface ParsedProblem {
  operands: string[][];
  result: string[];
  missingPositions: { row: number; col: number }[];
  correctAnswers: { [key: string]: string };
  carries: number[];
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const normalizeOperation = (op: string): 'add' | 'sub' => {
  return ['add', 'addition', '+'].includes(op) ? 'add' : 'sub';
};

const getSizeClasses = (size: 'sm' | 'md' | 'lg' = 'md') => {
  const sizes = {
    sm: { digit: 'w-8 h-10 text-xl', box: 'w-8 h-10 text-xl' },
    md: { digit: 'w-12 h-14 text-3xl', box: 'w-12 h-14 text-3xl' },
    lg: { digit: 'w-16 h-18 text-4xl', box: 'w-16 h-18 text-4xl' }
  };
  return sizes[size];
};

const parseProblem = (
  nums: (number | string)[],
  operation: 'add' | 'sub',
  numOfDigitsMissing?: number
): ParsedProblem => {
  const strNums = nums.map(n => n.toString());
  const hasQuestionMarks = strNums.some(n => n.includes('?'));
  
  let operands: string[][];
  let result: string[];
  let missingPositions: { row: number; col: number }[] = [];
  let correctAnswers: { [key: string]: string } = {};
  let carries: number[] = [];

  if (hasQuestionMarks) {
    // User specified missing positions with '?'
    operands = strNums.slice(0, -1).map(n => n.split(''));
    result = strNums[strNums.length - 1].split('');
    
    // Don't pad yet - work with original positions first
    const maxLen = Math.max(...operands.map(o => o.length), result.length);
    
    // Check validity: verify no column has more than 1 unknown (from the right)
    const columnsWithUnknown = new Set<number>();
    let isValid = true;
    
    // Check operands (count from right)
    operands.forEach((operand, row) => {
      operand.forEach((digit, idx) => {
        if (digit === '?') {
          const colFromRight = operand.length - 1 - idx; // 0 = ones, 1 = tens, etc.
          if (columnsWithUnknown.has(colFromRight)) {
            isValid = false;
          }
          columnsWithUnknown.add(colFromRight);
          
          // Track this as a missing position (before padding)
          missingPositions.push({ row, col: idx });
        }
      });
    });
    
    // Check result (count from right)
    result.forEach((digit, idx) => {
      if (digit === '?') {
        const colFromRight = result.length - 1 - idx;
        if (columnsWithUnknown.has(colFromRight)) {
          isValid = false;
        }
        columnsWithUnknown.add(colFromRight);
        
        // Track this as a missing position (before padding)
        missingPositions.push({ row: operands.length, col: idx });
      }
    });
    
    if (!isValid) {
      // Invalid configuration - but honor the developer's specified result
      // Work backwards: use the result they specified and solve for missing operand digits
      const targetResult = parseInt(result.map(d => d === '?' ? '0' : d).join(''));
      
      // For each missing operand digit, try to find a value that works
      operands.forEach((operand, row) => {
        operand.forEach((digit, col) => {
          if (digit === '?') {
            // Try digits 0-9 to see which gives us close to target result
            for (let testDigit = 0; testDigit <= 9; testDigit++) {
              const testOps = operands.map((op, r) => {
                if (r === row) {
                  return op.map((d, c) => {
                    if (c === col) return testDigit.toString();
                    if (d === '?') return '5'; // Use 5 as default for other unknowns
                    return d;
                  });
                }
                return op.map(d => d === '?' ? '5' : d);
              });
              
              const nums = testOps.map(op => parseInt(op.join('')));
              let calcResult: number;
              
              if (operation === 'add') {
                calcResult = nums.reduce((sum, n) => sum + n, 0);
              } else {
                calcResult = nums[0] - nums[1];
              }
              
              // Check if result matches the pattern (considering ? in result)
              const calcStr = calcResult.toString();
              let matches = true;
              
              if (calcStr.length === result.length) {
                for (let i = 0; i < result.length; i++) {
                  if (result[i] !== '?' && calcStr[i] !== result[i]) {
                    matches = false;
                    break;
                  }
                }
                
                if (matches) {
                  correctAnswers[`${row}-${col}`] = testDigit.toString();
                  break;
                }
              }
            }
          }
        });
      });
      
      // Fill in result unknowns using the calculated result
      const finalOps = operands.map((op, row) =>
        op.map((d, col) => d === '?' ? (correctAnswers[`${row}-${col}`] || '5') : d)
      );
      
      const finalNums = finalOps.map(op => parseInt(op.join('')));
      let finalResult: number;
      
      if (operation === 'add') {
        finalResult = finalNums.reduce((sum, n) => sum + n, 0);
      } else {
        finalResult = finalNums[0] - finalNums[1];
      }
      
      const finalResultStr = finalResult.toString();
      result.forEach((digit, col) => {
        if (digit === '?') {
          const paddedResult = finalResultStr.padStart(result.length, '0');
          correctAnswers[`${operands.length}-${col}`] = paddedResult[col];
        }
      });
    } else {
      // Valid configuration - solve for the correct answers
      // Build complete numbers by solving the equation
      
      // First, solve for any unknowns in the operands
      operands.forEach((operand, row) => {
        operand.forEach((digit, col) => {
          if (digit === '?') {
            // We need to find what digit makes the equation work
            // Try digits 0-9
            for (let testDigit = 0; testDigit <= 9; testDigit++) {
              // Create test version with this digit filled in
              const testOperands = operands.map((op, r) => {
                if (r === row) {
                  return op.map((d, c) => c === col ? testDigit.toString() : (d === '?' ? '0' : d));
                }
                return op.map(d => d === '?' ? '0' : d);
              });
              
              const testNums = testOperands.map(op => parseInt(op.join('')));
              let calcResult: number;
              
              if (operation === 'add') {
                calcResult = testNums.reduce((sum, n) => sum + n, 0);
              } else {
                calcResult = testNums[0] - testNums[1];
              }
              
              const calcResultStr = calcResult.toString();
              
              // Check if this matches the expected result pattern
              let matches = true;
              if (calcResultStr.length === result.length) {
                for (let i = 0; i < result.length; i++) {
                  if (result[i] !== '?' && calcResultStr[i] !== result[i]) {
                    matches = false;
                    break;
                  }
                }
                
                if (matches) {
                  correctAnswers[`${row}-${col}`] = testDigit.toString();
                  break;
                }
              }
            }
          }
        });
      });
      
      // Now solve for unknowns in the result using the filled operands
      const filledOperands = operands.map((op, row) => 
        op.map((d, col) => {
          if (d === '?') {
            return correctAnswers[`${row}-${col}`] || '0';
          }
          return d;
        })
      );
      
      const nums = filledOperands.map(op => parseInt(op.join('')));
      let actualResult: number;
      
      if (operation === 'add') {
        actualResult = nums.reduce((sum, n) => sum + n, 0);
      } else {
        actualResult = nums[0] - nums[1];
      }
      
      const actualResultStr = actualResult.toString();
      
      result.forEach((digit, col) => {
        if (digit === '?') {
          // Ensure we have the right length
          const paddedResult = actualResultStr.padStart(result.length, '0');
          correctAnswers[`${operands.length}-${col}`] = paddedResult[col];
        }
      });
    }
  } else {
    // No question marks - calculate result and place missing digits randomly
    // Last number in array is the expected result
    const numbers = nums.slice(0, -1).map(n => typeof n === 'number' ? n : parseInt(n));
    const expectedResult = typeof nums[nums.length - 1] === 'number' 
      ? nums[nums.length - 1] 
      : parseInt(nums[nums.length - 1] as string);
    
    // For subtraction, only use first two numbers
    if (operation === 'sub') {
      operands = [numbers[0], numbers[1]].map(n => n.toString().split(''));
    } else {
      operands = numbers.map(n => n.toString().split(''));
    }
    
    result = expectedResult.toString().split('');
    
    // Determine maximum possible missing digits (one per column)
    const maxDigits = Math.max(...operands.map(o => o.length), result.length);
    const actualMaxMissing = Math.min(numOfDigitsMissing || 1, maxDigits);
    
    // Track which columns already have unknowns
    const usedColumns = new Set<number>();
    
    for (let i = 0; i < actualMaxMissing; i++) {
      // Get available columns (not yet used)
      const availableColumns = Array.from({ length: maxDigits }, (_, idx) => idx)
        .filter(col => !usedColumns.has(col));
      
      if (availableColumns.length === 0) break;
      
      const randomIdx = Math.floor(Math.random() * availableColumns.length);
      const col = availableColumns[randomIdx];
      usedColumns.add(col);
      
      // Find which rows have a digit in this column
      const possibleRows: number[] = [];
      operands.forEach((operand, row) => {
        const digitIdx = operand.length - (maxDigits - col);
        if (digitIdx >= 0) possibleRows.push(row);
      });
      
      const resultIdx = result.length - (maxDigits - col);
      if (resultIdx >= 0) possibleRows.push(operands.length);
      
      if (possibleRows.length === 0) continue;
      
      const randomRow = possibleRows[Math.floor(Math.random() * possibleRows.length)];
      
      if (randomRow === operands.length) {
        const resultIdx = result.length - (maxDigits - col);
        const originalDigit = result[resultIdx];
        result[resultIdx] = '?';
        correctAnswers[`${randomRow}-${col}`] = originalDigit;
      } else {
        const digitIdx = operands[randomRow].length - (maxDigits - col);
        const originalDigit = operands[randomRow][digitIdx];
        operands[randomRow][digitIdx] = '?';
        correctAnswers[`${randomRow}-${col}`] = originalDigit;
      }
      
      missingPositions.push({ row: randomRow, col });
    }
  }
  
  // Calculate carries AFTER solving for correct answers
  // First, create solved version of operands
  const solvedOperands = operands.map((op, row) =>
    op.map((d, col) => {
      if (d === '?') {
        const key = `${row}-${col}`;
        return correctAnswers[key] || '0';
      }
      return d;
    })
  );
  
  carries = calculateCarries(solvedOperands, operation);
  
  return { operands, result, missingPositions, correctAnswers, carries };
};

const solveProblemWithUnknowns = (
  operands: string[][],
  result: string[],
  operation: 'add' | 'sub'
): { operands: string[][]; result: string[] } | null => {
  // Create a copy to work with
  const solved = operands.map(o => [...o]);
  const solvedResult = [...result];
  
  // For addition: try to solve column by column
  if (operation === 'add') {
    let carry = 0;
    for (let col = operands[0].length - 1; col >= 0; col--) {
      let sum = carry;
      let unknownRow = -1;
      let unknownCount = 0;
      
      // Check operands
      operands.forEach((operand, row) => {
        if (operand[col] === '?') {
          unknownRow = row;
          unknownCount++;
        } else {
          sum += parseInt(operand[col]);
        }
      });
      
      // Check result
      const resultDigit = result[col] === '?' ? -1 : parseInt(result[col]);
      if (result[col] === '?') {
        unknownCount++;
      }
      
      // Can only solve if exactly one unknown
      if (unknownCount === 1) {
        if (resultDigit === -1) {
          // Result is unknown
          const digit = sum % 10;
          solvedResult[col] = digit.toString();
          carry = Math.floor(sum / 10);
        } else {
          // One operand is unknown
          const digit = (resultDigit - sum % 10 + 10) % 10;
          solved[unknownRow][col] = digit.toString();
          carry = Math.floor(sum / 10);
        }
      } else if (unknownCount === 0) {
        carry = Math.floor(sum / 10);
      }
    }
  }
  
  return { operands: solved, result: solvedResult };
};

const calculateCarries = (operands: string[][], operation: 'add' | 'sub'): number[] => {
  if (operation === 'sub') return [];
  
  const maxLen = Math.max(...operands.map(o => o.length));
  const carries: number[] = new Array(maxLen).fill(0);
  let carry = 0;
  
  for (let col = maxLen - 1; col >= 0; col--) {
    let sum = carry;
    operands.forEach(operand => {
      const idx = operand.length - (maxLen - col);
      if (idx >= 0 && operand[idx] !== '?') {
        sum += parseInt(operand[idx]);
      }
    });
    
    carry = Math.floor(sum / 10);
    if (col > 0) {
      carries[col - 1] = carry; // Store carry for the next column to the left
    }
  }
  
  return carries;
};

// ============================================================================
// VERTICAL MATH COMPONENT
// ============================================================================

export const VerticalMath: React.FC<VerticalMathProps> = ({
  nums,
  operation,
  numOfDigitsMissing,
  showFeedback = false,
  showCarry = false,
  size = 'md'
}) => {
  const normalizedOp = normalizeOperation(operation);
  
  // Use useMemo to prevent problem from changing on every render
  const problem = React.useMemo(
    () => parseProblem(nums, normalizedOp, numOfDigitsMissing),
    [JSON.stringify(nums), normalizedOp, numOfDigitsMissing]
  );
  
  const [inputs, setInputs] = useState<{ [key: string]: string }>({});
  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  
  const sizeClasses = getSizeClasses(size);
  const maxDigits = Math.max(...problem.operands.map(o => o.length), problem.result.length);
  
  // Pad arrays to align right
  const paddedOperands = problem.operands.map(operand => {
    const padded = [...operand];
    while (padded.length < maxDigits) {
      padded.unshift('');
    }
    return padded;
  });
  
  const paddedResult = [...problem.result];
  while (paddedResult.length < maxDigits) {
    paddedResult.unshift('');
  }
  
  const handleInputChange = (row: number, col: number, value: string) => {
    if (value === '' || /^\d$/.test(value)) {
      setInputs(prev => ({ ...prev, [`${row}-${col}`]: value }));
    }
  };
  
  const handleKeyDown = (row: number, col: number, e: React.KeyboardEvent) => {
    const currentKey = `${row}-${col}`;
    const allKeys = Object.keys(inputRefs.current).sort();
    const currentIndex = allKeys.indexOf(currentKey);
    
    if (e.key === 'ArrowRight' || (e.key === 'Tab' && !e.shiftKey)) {
      e.preventDefault();
      const nextIndex = (currentIndex + 1) % allKeys.length;
      inputRefs.current[allKeys[nextIndex]]?.focus();
    } else if (e.key === 'ArrowLeft' || (e.key === 'Tab' && e.shiftKey)) {
      e.preventDefault();
      const prevIndex = (currentIndex - 1 + allKeys.length) % allKeys.length;
      inputRefs.current[allKeys[prevIndex]]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (row > 0) {
        const upKey = `${row - 1}-${col}`;
        inputRefs.current[upKey]?.focus();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const downKey = `${row + 1}-${col}`;
      inputRefs.current[downKey]?.focus();
    }
  };
  
  const renderDigit = (digit: string, row: number, col: number) => {
    if (digit === '?') {
      const key = `${row}-${col}`;
      const correctAnswer = problem.correctAnswers[key];
      const userAnswer = inputs[key] || '';
      const isCorrect = userAnswer === correctAnswer;
      
      return (
        <input
          ref={el => inputRefs.current[key] = el}
          type="text"
          maxLength={1}
          value={userAnswer}
          onChange={(e) => handleInputChange(row, col, e.target.value)}
          onKeyDown={(e) => handleKeyDown(row, col, e)}
          className={`${sizeClasses.box} border-2 border-gray-800 text-center font-bold 
            focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
            showFeedback && userAnswer
              ? isCorrect
                ? 'bg-green-50 border-green-500'
                : 'bg-red-50 border-red-500'
              : 'bg-white'
          }`}
          placeholder="?"
        />
      );
    }
    
    return digit ? (
      <div className={`${sizeClasses.digit} flex items-center justify-center font-bold`}>
        {digit}
      </div>
    ) : (
      <div className={sizeClasses.digit}></div>
    );
  };
  
  return (
    <div className="flex flex-col items-end">
      {/* Carry numbers */}
      {showCarry && normalizedOp === 'add' && (
        <div className="flex mb-1">
          <div className={`${sizeClasses.digit} pr-2`}></div>
          {paddedOperands[0].map((_, colIdx) => {
            const carryValue = problem.carries[colIdx];
            return (
              <div key={colIdx} className={`${sizeClasses.digit} flex items-center justify-center`}>
                {carryValue > 0 && (
                  <span className="text-sm !text-red-500 font-semibold">
                    {carryValue}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
      
      {/* Operands */}
      {paddedOperands.map((operand, rowIdx) => (
        <div key={rowIdx} className="flex items-center">
          {rowIdx === paddedOperands.length - 1 && (
            <div className={`${sizeClasses.digit} flex items-center justify-center font-bold pr-2`}>
              {normalizedOp === 'add' ? '+' : '−'}
            </div>
          )}
          {rowIdx < paddedOperands.length - 1 && (
            <div className={`${sizeClasses.digit} pr-2`}></div>
          )}
          {operand.map((digit, colIdx) => (
            <div key={colIdx}>{renderDigit(digit, rowIdx, colIdx)}</div>
          ))}
        </div>
      ))}
      
      {/* Horizontal line */}
      <div className="flex items-center">
        <div className={`${sizeClasses.digit} pr-2`}></div>
        <div className="border-t-2 border-gray-800" style={{ width: `${maxDigits * (size === 'sm' ? 32 : size === 'md' ? 48 : 64)}px` }}></div>
      </div>
      
      {/* Result */}
      <div className="flex items-center">
        <div className={`${sizeClasses.digit} pr-2`}></div>
        {paddedResult.map((digit, colIdx) => (
          <div key={colIdx}>{renderDigit(digit, paddedOperands.length, colIdx)}</div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// DEMO COMPONENT
// ============================================================================

const VerticalMathDemo: React.FC = () => {
  const [showFeedback1, setShowFeedback1] = useState(false);
  const [showFeedback2, setShowFeedback2] = useState(false);
  const [showFeedback3, setShowFeedback3] = useState(false);
  const [showCarry1, setShowCarry1] = useState(false);
  const [showCarry2, setShowCarry2] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Vertical Math Component</h1>
        <p className="text-gray-600 mb-8">Addition and subtraction with missing digits</p>

        {/* Example 1: Random missing digits */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 1: Random Missing Digits</h3>
          <p className="text-gray-600 mb-4">3 missing digits placed randomly</p>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setShowFeedback1(!showFeedback1)}
              className="px-4 py-2 !bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
            >
              {showFeedback1 ? 'Hide' : 'Check'} Answer
            </button>
            <button
              onClick={() => setShowCarry1(!showCarry1)}
              className="px-4 py-2 !bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {showCarry1 ? 'Hide' : 'Show'} Carry
            </button>
          </div>
          <VerticalMath
            nums={[79, 11, 90, 180]}
            operation="add"
            numOfDigitsMissing={3}
            showFeedback={showFeedback1}
            showCarry={showCarry1}
            size="lg"
          />
        </div>

        {/* Example 2: Specified missing positions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 2: Specified Missing Positions</h3>
          <p className="text-gray-600 mb-4">Using ? to specify exact positions</p>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setShowFeedback2(!showFeedback2)}
              className="px-4 py-2 !bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
            >
              {showFeedback2 ? 'Hide' : 'Check'} Answer
            </button>
            <button
              onClick={() => setShowCarry2(!showCarry2)}
              className="px-4 py-2 !bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              {showCarry2 ? 'Hide' : 'Show'} Carry
            </button>
          </div>
          <VerticalMath
            nums={['4?', '27', '?1']}
            operation="addition"
            showFeedback={showFeedback2}
            showCarry={showCarry2}
            size="lg"
          />
        </div>

        {/* Example 3: Subtraction */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 3: Subtraction</h3>
          <p className="text-gray-600 mb-4">Subtraction with 2 random missing digits</p>
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setShowFeedback3(!showFeedback3)}
              className="px-4 py-2 !bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
            >
              {showFeedback3 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <VerticalMath
            nums={[84, 25, 59]}
            operation="subtraction"
            numOfDigitsMissing={2}
            showFeedback={showFeedback3}
            size="lg"
          />
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Component Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Variable operands</strong> - Support any number of addends</li>
            <li>✅ <strong>Flexible missing digits</strong> - Random or specified positions</li>
            <li>✅ <strong>Carry display</strong> - Toggle to show carrying numbers</li>
            <li>✅ <strong>Keyboard navigation</strong> - Tab and arrow keys between inputs</li>
            <li>✅ <strong>Visual feedback</strong> - Green for correct, red for incorrect</li>
            <li>✅ <strong>Addition & Subtraction</strong> - Both operations supported</li>
            <li>✅ <strong>One unknown per column</strong> - Ensures solvable problems</li>
            <li>✅ <strong>Size variants</strong> - sm, md, lg</li>
            <li>✅ <strong>Right-aligned</strong> - Proper vertical math formatting</li>
          </ul>
        </div>

        {/* Usage Examples */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Usage Examples</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Random missing digits (addition)
<VerticalMath 
  nums={[111, 222, 333]} 
  operation="add" 
  numOfDigitsMissing={3}
/>

// Specified positions with ?
<VerticalMath 
  nums={['1?1', '?22', '33?']} 
  operation="addition"
/>

// Subtraction with random missing digits
<VerticalMath 
  nums={[84, 25, 59]} 
  operation="subtraction"
  numOfDigitsMissing={2}
/>

// Note: Ensure only one ? per column for valid problems
// Valid:   8? - ?5 = 59 (different columns)
// Invalid: 8? - 2? = 59 (both in ones column)`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default VerticalMathDemo;