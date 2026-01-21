import React, { useState, useMemo } from 'react';
import {
  PEOPLE,
  UNITS,
  KEY_WORDS,
  ACTION_VERBS,
  getRandomItem,
  getUnitForm,
  PersonData,
  UnitData,
} from './WordProblemData';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

export interface WordProblemProps {
  operation: 'add' | 'addition' | '+' |
              'sub' | 'subtract' | 'subtraction' | '-' |
              'mult' | 'multiply' | 'multiplication' | 'x' |
              'div' | 'divide' | 'division' | '/';
  nums: number[];
  showFeedback?: boolean;
  showHelp?: boolean;
}

interface ProblemData {
  person: PersonData;
  unit: UnitData;
  keyword: string;
  actionVerb: string;
  problemText: string;
  answer: number;
  operationSymbol: string;
  normalizedOp: 'add' | 'sub' | 'mult' | 'div';
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const normalizeOperation = (op: string): 'add' | 'sub' | 'mult' | 'div' => {
  if (['add', 'addition', '+'].includes(op)) return 'add';
  if (['sub', 'subtract', 'subtraction', '-'].includes(op)) return 'sub';
  if (['mult', 'multiply', 'multiplication', 'x'].includes(op)) return 'mult';
  return 'div';
};

const getOperationSymbol = (op: 'add' | 'sub' | 'mult' | 'div'): string => {
  const symbols = { add: '+', sub: '-', mult: 'x', div: '÷' };
  return symbols[op];
};

const calculateAnswer = (nums: number[], op: 'add' | 'sub' | 'mult' | 'div'): number => {
  if (op === 'add') return nums.reduce((sum, n) => sum + n, 0);
  if (op === 'sub') return nums.reduce((diff, n, i) => i === 0 ? n : diff - n);
  if (op === 'mult') return nums.reduce((prod, n) => prod * n, 1);
  if (op === 'div') return nums.reduce((quot, n, i) => i === 0 ? n : quot / n);
  return 0;
};

const generateProblemText = (
  person: PersonData,
  unit: UnitData,
  nums: number[],
  op: 'add' | 'sub' | 'mult' | 'div',
  actionVerb: string,
  keyword: string
): string => {
  const name = person.name;
  const pronoun = person.pronoun;
  
  if (op === 'add') {
    if (nums.length === 2) {
      const [num1, num2] = nums;
      const unit1 = getUnitForm(unit, num1);
      const unit2 = getUnitForm(unit, num2);
      return `${name} has ${num1} ${unit1} and ${actionVerb} ${num2} more. How many ${unit.plural} does ${pronoun} have ${keyword}?`;
    } else {
      // Multiple addends: "Tom has 4 cookies, gets 3 more, and finds 2 more. How many cookies does he have in total?"
      const parts: string[] = [];
      parts.push(`${name} has ${nums[0]} ${getUnitForm(unit, nums[0])}`);
      for (let i = 1; i < nums.length; i++) {
        const connector = i === nums.length - 1 ? 'and' : '';
        parts.push(`${connector} ${actionVerb} ${nums[i]} more`.trim());
      }
      return `${parts.join(', ')}. How many ${unit.plural} does ${pronoun} have ${keyword}?`;
    }
  }
  
  if (op === 'sub') {
    if (nums.length === 2) {
      const [num1, num2] = nums;
      const unit1 = getUnitForm(unit, num1);
      return `${name} has ${num1} ${unit1} and ${pronoun} decides to ${actionVerb} ${num2} of them. How many ${unit.plural} does ${pronoun} have ${keyword}?`;
    } else {
      // Multiple subtractions: "Tom has 12 cookies and eats 3 of them, then gives away 2. How many cookies does he have left?"
      const parts: string[] = [];
      parts.push(`${name} has ${nums[0]} ${getUnitForm(unit, nums[0])} and ${actionVerb} ${nums[1]} of them`);
      for (let i = 2; i < nums.length; i++) {
        const connector = i === nums.length - 1 ? 'then' : ',';
        parts.push(`${connector} ${actionVerb} ${nums[i]} more`.trim());
      }
      return `${parts.join(', ')}. How many ${unit.plural} does ${pronoun} have ${keyword}?`;
    }
  }
  
  // Placeholder for mult/div (can be expanded later)
  return `${name} has ${nums[0]} ${getUnitForm(unit, nums[0])}. [Problem text for ${op} to be implemented]`;
};

// ============================================================================
// FILLABLE INPUT COMPONENT
// ============================================================================

interface FillableInputProps {
  value: string;
  onChange: (value: string) => void;
  correctAnswer: string;
  showFeedback: boolean;
  width?: number; // width in characters
  helpText?: string;
  showHelp?: boolean;
}

const FillableInput: React.FC<FillableInputProps> = ({
  value,
  onChange,
  correctAnswer,
  showFeedback,
  width = 10,
  helpText,
  showHelp = true,
}) => {
  const isCorrect = value.trim().toLowerCase() === correctAnswer.toLowerCase();
  
  return (
    <span className="inline-flex flex-col items-center mx-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border-b-2 border-gray-800 text-center font-semibold bg-transparent 
          focus:outline-none focus:border-blue-400 transition-colors px-1 ${
          showFeedback
            ? isCorrect
              ? 'border-green-500 bg-green-50'
              : 'border-red-500 bg-red-50'
            : ''
        }`}
        style={{ width: `${width}ch` }}
      />
      {showHelp && helpText && (
        <span className="text-xs text-gray-500 mt-1">({helpText})</span>
      )}
    </span>
  );
};

// ============================================================================
// WORD PROBLEM COMPONENT
// ============================================================================

export const WordProblem: React.FC<WordProblemProps> = ({
  operation,
  nums,
  showFeedback = false,
  showHelp = true,
}) => {
  const normalizedOp = normalizeOperation(operation);
  
  // Generate problem data (memoized so it doesn't change on re-render)
  const problemData: ProblemData = useMemo(() => {
    const person = getRandomItem(PEOPLE);
    const unit = getRandomItem(UNITS);
    const keywordArray = KEY_WORDS[normalizedOp === 'add' ? 'addition' : 
                                   normalizedOp === 'sub' ? 'subtraction' :
                                   normalizedOp === 'mult' ? 'multiplication' : 'division'];
    const keyword = getRandomItem(keywordArray);
    const actionVerb = normalizedOp === 'add' ? getRandomItem(ACTION_VERBS.addition) :
                       normalizedOp === 'sub' ? getRandomItem(ACTION_VERBS.subtraction) : 'uses';
    const problemText = generateProblemText(person, unit, nums, normalizedOp, actionVerb, keyword);
    const answer = calculateAnswer(nums, normalizedOp);
    const operationSymbol = getOperationSymbol(normalizedOp);
    
    return {
      person,
      unit,
      keyword,
      actionVerb,
      problemText,
      answer,
      operationSymbol,
      normalizedOp,
    };
  }, [nums, normalizedOp]);
  
  // State for equation inputs
  const [equationInputs, setEquationInputs] = useState<string[]>(
    Array(nums.length + nums.length - 1 + 1).fill('') // nums + operators + result
  );
  
  // State for sentence inputs
  const [nameInput, setNameInput] = useState('');
  const [resultNumberInput, setResultNumberInput] = useState('');
  const [unitInputs, setUnitInputs] = useState<string[]>(['', '']);
  const [keywordInputs, setKeywordInputs] = useState<string[]>(
    Array(problemData.keyword.split(' ').length).fill('')
  );
  
  // Check if equation is correct (allowing commutative property for add/mult)
  const checkEquation = (): boolean => {
    // Extract numbers and operators from inputs
    const inputNumbers: number[] = [];
    const inputOperators: string[] = [];
    
    for (let i = 0; i < equationInputs.length; i++) {
      if (i % 2 === 0) {
        // Number position
        const num = parseInt(equationInputs[i]);
        if (!isNaN(num)) inputNumbers.push(num);
      } else {
        // Operator position
        inputOperators.push(equationInputs[i]);
      }
    }
    
    // For add/mult, check if numbers match (any order)
    if (normalizedOp === 'add' || normalizedOp === 'mult') {
      const sortedNums = [...nums].sort((a, b) => a - b);
      const sortedInputNums = [...inputNumbers.slice(0, -1)].sort((a, b) => a - b);
      const resultMatches = inputNumbers[inputNumbers.length - 1] === problemData.answer;
      const operatorsMatch = inputOperators.every(op => op === problemData.operationSymbol);
      const numbersMatch = sortedNums.length === sortedInputNums.length &&
                          sortedNums.every((num, idx) => num === sortedInputNums[idx]);
      return numbersMatch && operatorsMatch && resultMatches;
    }
    
    // For sub/div, order matters
    const numbersMatch = nums.every((num, idx) => parseInt(equationInputs[idx * 2]) === num);
    const operatorsMatch = inputOperators.every(op => op === problemData.operationSymbol);
    const resultMatches = parseInt(equationInputs[equationInputs.length - 1]) === problemData.answer;
    return numbersMatch && operatorsMatch && resultMatches;
  };
  
  const isEquationCorrect = showFeedback && checkEquation();
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Instructions */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-gray-800">
          Solve the following word problem. Show your work and include units in your answers.{' '}
          <span className="underline font-semibold">Underline the key words</span> that indicate this is a{' '}
          {normalizedOp === 'add' ? 'an addition' : 
           normalizedOp === 'sub' ? 'a subtraction' :
           normalizedOp === 'mult' ? 'a multiplication' : 'a division'} problem.{' '}
          Box the units in the question.
        </p>
      </div>
      
      {/* Word Problem */}
      <div className="mb-8">
        <div className="text-xl font-medium mb-4">
          (1) {problemData.problemText}
        </div>
        
        {/* Equation with fillable blanks */}
        <div className="flex items-center justify-start gap-2 my-6 flex-wrap">
          {nums.map((num, idx) => (
            <React.Fragment key={idx}>
              <input
                type="text"
                value={equationInputs[idx * 2]}
                onChange={(e) => {
                  const newInputs = [...equationInputs];
                  newInputs[idx * 2] = e.target.value;
                  setEquationInputs(newInputs);
                }}
                className={`w-20 h-12 border-2 border-gray-800 text-center text-xl font-bold
                  focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
                  showFeedback
                    ? parseInt(equationInputs[idx * 2]) === num
                      ? 'border-green-500 bg-green-50'
                      : 'border-red-500 bg-red-50'
                    : ''
                }`}
              />
              {idx < nums.length - 1 && (
                <>
                  <div className="w-12 h-12 rounded-full border-2 border-gray-800 flex items-center justify-center text-xl font-bold bg-white">
                    <input
                      type="text"
                      value={equationInputs[idx * 2 + 1]}
                      onChange={(e) => {
                        const newInputs = [...equationInputs];
                        newInputs[idx * 2 + 1] = e.target.value;
                        setEquationInputs(newInputs);
                      }}
                      className={`w-8 text-center bg-transparent focus:outline-none ${
                        showFeedback
                          ? equationInputs[idx * 2 + 1] === problemData.operationSymbol
                            ? 'text-green-600'
                            : 'text-red-600'
                          : ''
                      }`}
                      maxLength={1}
                    />
                  </div>
                </>
              )}
            </React.Fragment>
          ))}
          <span className="text-2xl font-bold">=</span>
          <input
            type="text"
            value={equationInputs[equationInputs.length - 1]}
            onChange={(e) => {
              const newInputs = [...equationInputs];
              newInputs[equationInputs.length - 1] = e.target.value;
              setEquationInputs(newInputs);
            }}
            className={`w-20 h-12 border-2 border-gray-800 text-center text-xl font-bold
              focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors ${
              showFeedback
                ? parseInt(equationInputs[equationInputs.length - 1]) === problemData.answer
                  ? 'border-green-500 bg-green-50'
                  : 'border-red-500 bg-red-50'
                : ''
            }`}
          />
        </div>
      </div>
      
      {/* Answer Sentence */}
      <div className="flex flex-wrap items-end gap-1 text-xl">
        <FillableInput
          value={nameInput}
          onChange={setNameInput}
          correctAnswer={problemData.person.name}
          showFeedback={showFeedback}
          width={Math.max(problemData.person.name.length, 6)}
          helpText={showHelp ? 'name' : undefined}
          showHelp={showHelp}
        />
        <span>has</span>
        <FillableInput
          value={resultNumberInput}
          onChange={setResultNumberInput}
          correctAnswer={problemData.answer.toString()}
          showFeedback={showFeedback}
          width={Math.max(problemData.answer.toString().length + 2, 4)}
          helpText={showHelp ? 'number' : undefined}
          showHelp={showHelp}
        />
        <FillableInput
          value={unitInputs[0]}
          onChange={(val) => {
            const newUnits = [...unitInputs];
            newUnits[0] = val;
            setUnitInputs(newUnits);
          }}
          correctAnswer={getUnitForm(problemData.unit, problemData.answer)}
          showFeedback={showFeedback}
          width={Math.max(problemData.unit.plural.length, 8)}
          helpText={showHelp ? 'units' : undefined}
          showHelp={showHelp}
        />
        {problemData.keyword.split(' ').map((word, idx) => (
          <FillableInput
            key={idx}
            value={keywordInputs[idx]}
            onChange={(val) => {
              const newKeywords = [...keywordInputs];
              newKeywords[idx] = val;
              setKeywordInputs(newKeywords);
            }}
            correctAnswer={word}
            showFeedback={showFeedback}
            width={Math.max(word.length + 1, 6)}
            helpText={showHelp ? 'key word' : undefined}
            showHelp={showHelp}
          />
        ))}
        <span>.</span>
      </div>
    </div>
  );
};

// ============================================================================
// DEMO COMPONENT
// ============================================================================

const WordProblemDemo: React.FC = () => {
  const [showFeedback1, setShowFeedback1] = useState(false);
  const [showFeedback2, setShowFeedback2] = useState(false);
  const [showFeedback3, setShowFeedback3] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Word Problem Generator</h1>
        <p className="text-gray-600 mb-8">Interactive word problems with fillable blanks</p>

        {/* Example 1: Simple Subtraction */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 1: Subtraction (2 numbers)</h3>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback1(!showFeedback1)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium 
                hover:!bg-green-600 transition-colors"
            >
              {showFeedback1 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <WordProblem
            operation="subtraction"
            nums={[12, 4]}
            showFeedback={showFeedback1}
            showHelp={true}
          />
        </div>

        {/* Example 2: Simple Addition */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 2: Addition (2 numbers)</h3>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback2(!showFeedback2)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium 
                hover:!bg-green-600 transition-colors"
            >
              {showFeedback2 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <WordProblem
            operation="addition"
            nums={[4, 3]}
            showFeedback={showFeedback2}
            showHelp={true}
          />
        </div>

        {/* Example 3: Multiple Addends */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 3: Addition (3 numbers)</h3>
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setShowFeedback3(!showFeedback3)}
              className="px-6 py-2 !bg-green-500 text-white rounded-lg font-medium 
                hover:!bg-green-600 transition-colors"
            >
              {showFeedback3 ? 'Hide' : 'Check'} Answer
            </button>
          </div>
          <WordProblem
            operation="add"
            nums={[5, 3, 2]}
            showFeedback={showFeedback3}
            showHelp={true}
          />
        </div>

        {/* Features */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Features</h2>
          <ul className="space-y-2 text-gray-700">
            <li>✅ <strong>Randomized content</strong> - Names, pronouns, units, and keywords change each time</li>
            <li>✅ <strong>Multiple operands</strong> - Supports 2+ numbers for addition/subtraction</li>
            <li>✅ <strong>Fillable equation</strong> - Students fill in all parts of the math equation</li>
            <li>✅ <strong>Sentence completion</strong> - Appropriately sized blanks for each word</li>
            <li>✅ <strong>Visual feedback</strong> - Green for correct, red for incorrect</li>
            <li>✅ <strong>Help labels</strong> - Optional hints below each blank (toggle with showHelp)</li>
            <li>✅ <strong>Grammar handling</strong> - Automatic singular/plural unit forms</li>
            <li>✅ <strong>Commutative property</strong> - Addition accepts any order of numbers</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WordProblemDemo;