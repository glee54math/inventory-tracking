import React, { useState, useMemo } from 'react';
import {
  PEOPLE,
  UNITS,
  KEY_WORDS,
  ADDITION_KEYWORDS,
  SUBTRACTION_KEYWORDS,
  MULTIPLICATION_KEYWORDS,
  ADDITION_TEMPLATES,
  SUBTRACTION_TEMPLATES,
  MULTIPLICATION_TEMPLATES,
  getRandomItem,
  getUnitForm,
  getActionVerb,
} from "./WordProblemData";
import type { PersonData, UnitData, SentenceTemplate } from "./WordProblemData";

// ============================================================================
// FILE STRUCTURE
// ============================================================================
// 1. TYPE DEFINITIONS - Interfaces for props and internal data
// 2. UTILITY FUNCTIONS - Helper functions for operations and text generation
//    - normalizeOperation: Convert operation aliases to standard form
//    - getOperationSymbol: Get math symbol for operation
//    - calculateAnswer: Compute the correct answer
//    - conjugateVerb: Handle verb conjugation (including multi-word verbs)
//    - generateProblemText: Build problem text from template
// 3. FILLABLE INPUT COMPONENT - Reusable input with feedback
// 4. WORD PROBLEM COMPONENT - Main component for rendering problems
// 5. DEMO COMPONENT - Example usage with multiple problems
// ============================================================================

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
  onCheckAnswer?: () => void; // Optional callback for check answer button
  showCheckButton?: boolean; // Whether to show the check answer button inline
}

interface ProblemData {
  person: PersonData;
  unit: UnitData;
  keyword: string;
  actionVerb: string;
  problemText: string;
  problemSegments: { text: string; label?: string }[];
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

const conjugateVerb = (verb: string): string => {
  // Handle multi-word verbs (e.g., "give away" → "gives away")
  const words = verb.split(' ');
  
  if (words.length > 1) {
    // Only conjugate the first word
    const firstWord = words[0];
    const conjugatedFirst = conjugateSingleWord(firstWord);
    return [conjugatedFirst, ...words.slice(1)].join(' ');
  }
  
  return conjugateSingleWord(verb);
};

const conjugateSingleWord = (word: string): string => {
  // Conjugate single word for third person singular (he/she)
  if (word.endsWith('y') && !['ay', 'ey', 'oy', 'uy'].some(v => word.endsWith(v))) {
    return word.slice(0, -1) + 'ies'; // carry → carries
  }
  if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch') || 
      word.endsWith('x') || word.endsWith('z')) {
    return word + 'es'; // pass → passes
  }
  return word + 's'; // get → gets
};

const generateProblemText = (
  person: PersonData,
  unit: UnitData,
  nums: number[],
  op: 'add' | 'sub' | 'mult' | 'div',
  actionVerb: string,
  template?: SentenceTemplate
): { text: string; keyword: string; segments: { text: string; label?: string }[] } => {
  const name = person.name;
  const pronoun = person.pronoun;
  const capitalizedPronoun = pronoun.charAt(0).toUpperCase() + pronoun.slice(1); // He/She
  
  if (op === 'add' && nums.length === 2) {
    const [num1, num2] = nums;
    const selectedTemplate = template || getRandomItem(ADDITION_TEMPLATES);
    const unit1 = getUnitForm(unit, num1);
    const conjugatedVerb = conjugateVerb(actionVerb);
    
    // Select keyword based on template context
    const keyword = selectedTemplate.context === 'joining' 
      ? getRandomItem(ADDITION_KEYWORDS.joining)
      : getRandomItem(ADDITION_KEYWORDS.increasing);
    
    const text = selectedTemplate.template
      .replace('{name}', name)
      .replace(/{Pronoun}/g, capitalizedPronoun)
      .replace(/{pronoun}/g, pronoun)
      .replace('{num1}', num1.toString())
      .replace('{unit1}', unit1)
      .replace(/{verb}/g, conjugatedVerb)
      .replace('{num2}', num2.toString())
      .replace(/{unitPlural}/g, unit.plural)
      .replace('{keyword}', keyword);
    
    // Create segments for labeled display - mark ALL instances of name, units, and keywords
    const segments = [
      { text: '(1) ' },
      { text: name, label: '(name)' },
      { text: ` has ${num1} ` },
      { text: unit1, label: '(units)' },
      { text: ` and ${conjugatedVerb} ${num2} more. How many ` },
      { text: unit.plural, label: '(units)' }, // Second instance of units
      { text: ` does ${pronoun} have ` },
      { text: keyword, label: '(key word)' },
      { text: '?' }
    ];
    
    return { text, keyword, segments };
  }
  
  if (op === 'sub' && nums.length === 2) {
    const [num1, num2] = nums;
    const selectedTemplate = template || getRandomItem(SUBTRACTION_TEMPLATES);
    const unit1 = getUnitForm(unit, num1);
    const conjugatedVerb = conjugateVerb(actionVerb);
    
    // Subtraction uses standard keywords
    const keyword = getRandomItem(SUBTRACTION_KEYWORDS);
    
    const text = selectedTemplate.template
      .replace('{name}', name)
      .replace(/{Pronoun}/g, capitalizedPronoun)
      .replace(/{pronoun}/g, pronoun)
      .replace('{num1}', num1.toString())
      .replace('{unit1}', unit1)
      .replace(/{verb}/g, conjugatedVerb)
      .replace('{num2}', num2.toString())
      .replace(/{unitPlural}/g, unit.plural)
      .replace('{keyword}', keyword);
    
    // Create segments for labeled display - mark ALL instances
    const segments = [
      { text: '(1) ' },
      { text: name, label: '(name)' },
      { text: ` has ${num1} ` },
      { text: unit1, label: '(units)' },
      { text: ` and ${conjugatedVerb} ${num2} of them. How many ` },
      { text: unit.plural, label: '(units)' }, // Second instance of units
      { text: ` does ${pronoun} have ` },
      { text: keyword, label: '(key word)' },
      { text: '?' }
    ];
    
    return { text, keyword, segments };
  }
  
  if (op === 'mult' && nums.length === 2) {
    const [num1, num2] = nums;
    const selectedTemplate = template || getRandomItem(MULTIPLICATION_TEMPLATES);
    
    // Select keyword based on template context
    const keyword = selectedTemplate.context === 'equalGroups' 
      ? getRandomItem(MULTIPLICATION_KEYWORDS.equalGroups)
      : selectedTemplate.context === 'scaling'
      ? getRandomItem(MULTIPLICATION_KEYWORDS.scaling)
      : getRandomItem(MULTIPLICATION_KEYWORDS.arrays);
    
    const text = selectedTemplate.template
      .replace('{name}', name)
      .replace(/{Pronoun}/g, capitalizedPronoun)
      .replace(/{pronoun}/g, pronoun)
      .replace('{num1}', num1.toString())
      .replace('{num2}', num2.toString())
      .replace(/{unitPlural}/g, unit.plural)
      .replace('{keyword}', keyword);
    
    // Create segments for labeled display - multiplication doesn't always have name
    // For templates without {name}, create simpler segments
    const hasName = selectedTemplate.template.includes('{name}');
    
    if (hasName) {
      // Templates like: "{name} has {num1} groups of {num2} {unitPlural}"
      const segments = [
        { text: '(1) ' },
        { text: name, label: '(name)' },
        { text: ` has ${num1} groups of ${num2} ` },
        { text: unit.plural, label: '(units)' },
        { text: `. How many ` },
        { text: unit.plural, label: '(units)' },
        { text: ` does ${pronoun} have ` },
        { text: keyword, label: '(key word)' },
        { text: '?' }
      ];
      return { text, keyword, segments };
    } else {
      // Templates like: "There are {num1} baskets. Each basket has {num2} {unitPlural}"
      const segments = [
        { text: '(1) There are ' },
        { text: `${num1} baskets. Each basket has ${num2} ` },
        { text: unit.plural, label: '(units)' },
        { text: `. How many ` },
        { text: unit.plural, label: '(units)' },
        { text: ` are there ` },
        { text: keyword, label: '(key word)' },
        { text: '?' }
      ];
      return { text, keyword, segments };
    }
  }
  
  // Fallback for multiple numbers (can be expanded later)
  if (op === 'add') {
    const parts: string[] = [];
    parts.push(`${name} has ${nums[0]} ${getUnitForm(unit, nums[0])}`);
    const conjugatedVerb = conjugateVerb(actionVerb);
    for (let i = 1; i < nums.length; i++) {
      const connector = i === nums.length - 1 ? 'and' : '';
      parts.push(`${connector} ${conjugatedVerb} ${nums[i]} more`.trim());
    }
    const keyword = getRandomItem(ADDITION_KEYWORDS.joining);
    const text = `${parts.join(', ')}. How many ${unit.plural} does ${pronoun} have ${keyword}?`;
    return { 
      text,
      keyword,
      segments: [{ text: `(1) ${text}` }]
    };
  }
  
  if (op === 'sub') {
    const parts: string[] = [];
    const conjugatedVerb = conjugateVerb(actionVerb);
    parts.push(`${name} has ${nums[0]} ${getUnitForm(unit, nums[0])} and ${conjugatedVerb} ${nums[1]} of them`);
    for (let i = 2; i < nums.length; i++) {
      parts.push(`then ${conjugatedVerb} ${nums[i]} more`);
    }
    const keyword = getRandomItem(SUBTRACTION_KEYWORDS);
    const text = `${parts.join(', ')}. How many ${unit.plural} does ${pronoun} have ${keyword}?`;
    return {
      text,
      keyword,
      segments: [{ text: `(1) ${text}` }]
    };
  }
  
  const keyword = 'total';
  const text = `${name} has ${nums[0]} ${getUnitForm(unit, nums[0])}. [Problem text for ${op} to be implemented]`;
  return {
    text,
    keyword,
    segments: [{ text: `(1) ${text}` }]
  };
};

// ============================================================================
// FILLABLE INPUT COMPONENT
// ============================================================================

interface FillableInputProps {
  value: string;
  onChange: (value: string) => void;
  correctAnswer: string;
  showFeedback: boolean;
  width?: number;
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
  
  // Add extra padding to width to ensure content fits
  const adjustedWidth = width + 2;
  
  return (
    <span className="inline-flex flex-col items-center mx-1">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`border-b-2 border-gray-800 text-center font-semibold bg-transparent 
          focus:outline-none focus:border-blue-400 transition-colors px-2 ${
          showFeedback
            ? isCorrect
              ? 'border-green-500 bg-green-50'
              : 'border-red-500 bg-red-50'
            : ''
        }`}
        style={{ width: `${adjustedWidth}ch` }}
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
  onCheckAnswer,
  showCheckButton = false,
}) => {
  const normalizedOp = normalizeOperation(operation);
  
  // ========================================================================
  // PROBLEM DATA GENERATION
  // Generates random problem data once on mount (useMemo with empty deps)
  // ========================================================================
  const problemData: ProblemData = useMemo(() => {
    const person = getRandomItem(PEOPLE);
    const unit = getRandomItem(UNITS);
    
    // Get appropriate action verb based on unit category and operation
    // Note: Multiplication typically doesn't use action verbs
    const actionVerb = normalizedOp === 'add' ? getActionVerb(unit, 'addition') :
                       normalizedOp === 'sub' ? getActionVerb(unit, 'subtraction') :
                       normalizedOp === 'mult' ? '' : // Multiplication doesn't need verbs
                       'uses';
    
    const { text: problemText, keyword, segments } = generateProblemText(person, unit, nums, normalizedOp, actionVerb);
    const answer = calculateAnswer(nums, normalizedOp);
    const operationSymbol = getOperationSymbol(normalizedOp);
    
    return {
      person,
      unit,
      keyword,
      actionVerb,
      problemText,
      problemSegments: segments,
      answer,
      operationSymbol,
      normalizedOp,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - only generate once on mount
  
  // ========================================================================
  // COMPONENT STATE
  // All user inputs are stored here
  // ========================================================================
  
  // Equation inputs: [num1, op1, num2, op2, ..., result]
  const [equationInputs, setEquationInputs] = useState<string[]>(
    Array(nums.length + nums.length - 1 + 1).fill('')
  );
  
  // Sentence completion inputs
  const [nameInput, setNameInput] = useState('');
  const [resultNumberInput, setResultNumberInput] = useState('');
  const [unitInputs, setUnitInputs] = useState<string[]>(['', '']);
  const [keywordInputs, setKeywordInputs] = useState<string[]>(
    Array(problemData.keyword.split(' ').length).fill('')
  );
  
  // ========================================================================
  // VALIDATION LOGIC
  // Checks if user's equation is correct (handles commutative property)
  // ========================================================================
  const checkEquation = (): boolean => {
    const inputNumbers: number[] = [];
    const inputOperators: string[] = [];
    
    for (let i = 0; i < equationInputs.length; i++) {
      if (i % 2 === 0) {
        const num = parseInt(equationInputs[i]);
        if (!isNaN(num)) inputNumbers.push(num);
      } else {
        inputOperators.push(equationInputs[i]);
      }
    }
    
    // Check if we have the right number of inputs
    if (inputNumbers.length !== nums.length + 1) return false; // +1 for result
    if (inputOperators.length !== nums.length - 1) return false;
    
    // For add/mult, check if numbers match (any order) - commutative property
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
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* ====================================================================== */}
      {/* INSTRUCTION BOX */}
      {/* ====================================================================== */}
      <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded">
        <p className="text-gray-800">
          Solve the following word problem. Fill in the blanks to show your work. Then complete the sentence that answers the question.{' '}
          {/* <span className="underline font-semibold">Underline the key words</span> that indicate this is{' '}
          {normalizedOp === 'add' ? 'an addition' : 
           normalizedOp === 'sub' ? 'a subtraction' :
           normalizedOp === 'mult' ? 'a multiplication' : 'a division'} problem.{' '}
          Box the units in the question. */}
        </p>
      </div>
      
      {/* ====================================================================== */}
      {/* WORD PROBLEM TEXT WITH INLINE LABELS */}
      {/* ====================================================================== */}
      <div className="mb-8">
        {/* Problem text with labels underneath key parts */}
        <div className="text-xl font-medium mb-4">
          {showHelp ? (
            // Show segmented text with labels - properly spaced and underlined
            problemData.problemSegments.map((segment, idx) => (
              <span key={idx} className="inline-flex flex-col align-top">
                <span className={`whitespace-pre ${segment.label ? 'underline' : ''}`}>{segment.text}</span>
                {segment.label && (
                  <span className="text-xs text-red-500 text-center whitespace-nowrap">{segment.label}</span>
                )}
              </span>
            ))
          ) : (
            // Show plain text without labels
            <span>{problemData.problemText}</span>
          )}
        </div>
        
        {/* ================================================================== */}
        {/* EQUATION INPUT BOXES */}
        {/* Left margin added with ml-8, gap increased to gap-4 */}
        {/* Using mt-6 instead of my-6 to avoid bottom margin pushing (answer) down */}
        {/* ================================================================== */}
        <div className="flex items-center justify-start gap-4 mt-6 flex-wrap ml-8">
          {nums.map((num, idx) => (
            <React.Fragment key={idx}>
              {/* Number input box */}
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
              {/* Operator circle (only between numbers, not after last number) */}
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
          {/* Equals sign */}
          <span className="text-2xl font-bold">=</span>
          {/* Result input box */}
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
        
        {/* (answer) label on separate line below equation, centered under result box */}
        {showHelp && (
          <div className="flex justify-start ml-8 mt-1 gap-4">
            {/* Dynamically create spacers for each number box and operator */}
            {nums.map((_, idx) => (
              <React.Fragment key={idx}>
                {/* Spacer for number box (80px wide) */}
                <div className="w-20"></div>
                {/* Spacer for operator circle (48px wide) - only between numbers */}
                {idx < nums.length - 1 && <div className="w-12"></div>}
              </React.Fragment>
            ))}
            {/* Spacer for equals sign */}
            <div className="w-4.25"></div>
            {/* Centered (answer) label under result box */}
            <div className="w-20 flex justify-center">
              <span className="text-xs text-red-500">(answer)</span>
            </div>
          </div>
        )}
      </div>
      
      {/* ====================================================================== */}
      {/* ANSWER SENTENCE WITH FILLABLE BLANKS + CHECK ANSWER BUTTON */}
      {/* Left margin added with ml-8, button on same line */}
      {/* ====================================================================== */}
      <div className="flex flex-wrap items-baseline gap-1 text-xl ml-8">
        {/* Name input */}
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
        {/* Result number input */}
        <FillableInput
          value={resultNumberInput}
          onChange={setResultNumberInput}
          correctAnswer={problemData.answer.toString()}
          showFeedback={showFeedback}
          width={Math.max(problemData.answer.toString().length + 2, 4)}
          helpText={showHelp ? 'number' : undefined}
          showHelp={showHelp}
        />
        {/* Units input */}
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
        {/* Keyword inputs (may be multiple words) */}
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
        
        {/* Check Answer Button - On same line, pushed to right with flex-grow spacer */}
        {showCheckButton && onCheckAnswer && (
          <>
            <div className="flex-grow"></div>
            <button
              onClick={onCheckAnswer}
              className="px-4 py-1 !bg-green-500 text-white text-base rounded-lg font-medium 
                hover:!bg-green-600 transition-colors self-center"
            >
              {showFeedback ? 'Hide' : 'Check'} Answer
            </button>
          </>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// DEMO COMPONENT (Default Export)
// ============================================================================

const WordProblemDemo: React.FC = () => {
  const [showFeedback1, setShowFeedback1] = useState(false);
  const [showFeedback2, setShowFeedback2] = useState(false);
  const [showFeedback3, setShowFeedback3] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-8">
      <div className="max-w-5xl mx-auto">
        {/* ================================================================== */}
        {/* PAGE HEADER */}
        {/* ================================================================== */}
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Word Problem Generator</h1>
        <p className="text-gray-600 mb-8">Interactive word problems with fillable blanks</p>

        {/* ================================================================== */}
        {/* EXAMPLE 1: SUBTRACTION */}
        {/* ================================================================== */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 1: Subtraction (2 numbers)</h3>
          
          {/* Word Problem Component with inline Check Answer button */}
          <WordProblem
            operation="subtraction"
            nums={[12, 4]}
            showFeedback={showFeedback1}
            showHelp={true}
            showCheckButton={true}
            onCheckAnswer={() => setShowFeedback1(!showFeedback1)}
          />
        </div>

        {/* ================================================================== */}
        {/* EXAMPLE 2: ADDITION */}
        {/* ================================================================== */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 2: Addition (2 numbers)</h3>
          
          {/* Word Problem Component with inline Check Answer button */}
          <WordProblem
            operation="addition"
            nums={[4, 3, 2]}
            showFeedback={showFeedback2}
            showHelp={true}
            showCheckButton={true}
            onCheckAnswer={() => setShowFeedback2(!showFeedback2)}
          />
        </div>

        {/* ================================================================== */}
        {/* EXAMPLE 3: MULTIPLICATION */}
        {/* ================================================================== */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-2xl font-semibold mb-4">Example 3: Multiplication (2 numbers)</h3>
          
          {/* Word Problem Component with inline Check Answer button */}
          <WordProblem
            operation="multiplication"
            nums={[3, 4]}
            showFeedback={showFeedback3}
            showHelp={true}
            showCheckButton={true}
            onCheckAnswer={() => setShowFeedback3(!showFeedback3)}
          />
        </div>
      </div>
    </div>
  );
};

export default WordProblemDemo;