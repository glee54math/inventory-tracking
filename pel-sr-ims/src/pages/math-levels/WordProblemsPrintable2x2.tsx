import React, { useMemo } from 'react';
import {
  PEOPLE,
  UNITS,
  ADDITION_KEYWORDS,
  ADDITION_TEMPLATES,
  getRandomItem,
  getUnitForm,
  getActionVerb,
} from './WordProblemData';
import type { PersonData, UnitData, SentenceTemplate } from './WordProblemData';

// ============================================================================
// FILE STRUCTURE
// ============================================================================
// 1. TYPES - Props for configuring each printable problem
// 2. PROBLEM GENERATION - Builds problem text/segments from WordProblemData,
//    reusing the same {name}/{unit}/{keyword} template approach as WordProblems.tsx
// 3. PRINT LAYOUT PIECES - Equation row (boxes + circles) and answer-sentence
//    row (blanks + labels), styled to match WordProblems.tsx but non-interactive
//    (no <input>, since this is meant to be printed and filled in by hand)
// 4. PAGE COMPONENT - Arranges up to 4 problems per landscape 8.5x11 page,
//    with dashed cut lines between quadrants, plus @page print CSS
// ============================================================================

// ============================================================================
// TYPES
// ============================================================================

export interface PrintableProblemConfig {
  nums: number[]; // addends, e.g. [5, 7, 3]
  person?: PersonData; // optional — random if omitted
  unit?: UnitData; // optional — random if omitted
  template?: SentenceTemplate; // optional — random 'joining' template if omitted
}

interface GeneratedProblem {
  segments: { text: string; label?: string }[];
  nums: number[];
  answer: number;
  unit: UnitData;
  keyword: string;
}

// ============================================================================
// PROBLEM GENERATION
// Addition-only, mirrors generateProblemText's 'add' branch in WordProblems.tsx
// ============================================================================

function conjugateVerb(verb: string): string {
  const words = verb.split(' ');
  const first = words[0];
  let conjugatedFirst: string;
  if (first.endsWith('y') && !['ay', 'ey', 'oy', 'uy'].some((v) => first.endsWith(v))) {
    conjugatedFirst = first.slice(0, -1) + 'ies';
  } else if (['s', 'sh', 'ch', 'x', 'z'].some((suf) => first.endsWith(suf))) {
    conjugatedFirst = first + 'es';
  } else {
    conjugatedFirst = first + 's';
  }
  return [conjugatedFirst, ...words.slice(1)].join(' ');
}

function generateAdditionProblem(config: PrintableProblemConfig): GeneratedProblem {
  const person = config.person ?? getRandomItem(PEOPLE);
  const unit = config.unit ?? getRandomItem(UNITS);
  const template = config.template ?? getRandomItem(ADDITION_TEMPLATES);
  const nums = config.nums;
  const actionVerb = getActionVerb(unit, 'addition');
  const conjugatedVerb = conjugateVerb(actionVerb);
  const keyword = template.context === 'joining'
    ? getRandomItem(ADDITION_KEYWORDS.joining)
    : getRandomItem(ADDITION_KEYWORDS.increasing);

  const answer = nums.reduce((sum, n) => sum + n, 0);
  const unit1 = getUnitForm(unit, nums[0]);

  // Only the two-addend template path is used for segment building here;
  // for 3+ addends we build a simple joined sentence with labeled segments.
  if (nums.length === 2) {
    const [num1, num2] = nums;
    const capitalizedPronoun = person.pronoun.charAt(0).toUpperCase() + person.pronoun.slice(1);
    const text = template.template
      .replace('{name}', person.name)
      .replace(/{Pronoun}/g, capitalizedPronoun)
      .replace(/{pronoun}/g, person.pronoun)
      .replace('{num1}', num1.toString())
      .replace('{unit1}', unit1)
      .replace(/{verb}/g, conjugatedVerb)
      .replace('{num2}', num2.toString())
      .replace(/{unitPlural}/g, unit.plural)
      .replace('{keyword}', keyword);

    const segments = [
      { text: person.name, label: '(name)' },
      { text: ` has ${num1} ` },
      { text: unit1, label: '(units)' },
      { text: ` and ${conjugatedVerb} ${num2} more. How many ` },
      { text: unit.plural, label: '(units)' },
      { text: ` does ${person.pronoun} have ` },
      { text: keyword, label: '(key word)' },
      { text: '?' },
    ];

    return { segments, nums, answer, unit, keyword };
  }

  // 3+ addends: "{Name} has {n1} {unit}, {verb} {n2} more, and {verb} {n3} more..."
  const segments: { text: string; label?: string }[] = [
    { text: person.name, label: '(name)' },
    { text: ` has ${nums[0]} ` },
    { text: unit1, label: '(units)' },
  ];
  for (let i = 1; i < nums.length; i++) {
    const connector = i === nums.length - 1 ? ', and' : ',';
    segments.push({ text: `${connector} ${conjugatedVerb} ${nums[i]} more` });
  }
  segments.push({ text: `. How many ` });
  segments.push({ text: unit.plural, label: '(units)' });
  segments.push({ text: ` does ${person.pronoun} have ` });
  segments.push({ text: keyword, label: '(key word)' });
  segments.push({ text: '?' });

  return { segments, nums, answer, unit, keyword };
}

// ============================================================================
// PRINT LAYOUT PIECES
// All spacing/box-model styling below uses inline styles rather than Tailwind
// utility classes. This is deliberate: Tailwind's JIT compiler only generates
// CSS for classes it finds while scanning the files listed in your project's
// `content` config. If this file isn't in that scan (or uses a class, like an
// arbitrary-value class, that doesn't appear elsewhere in your app), the class
// silently produces no CSS — which is what caused the missing gaps/spacing.
// Inline styles always apply, regardless of Tailwind config, so layout here
// is guaranteed to render the same in any project.
// ============================================================================

const BORDER = '2px solid #1f2937'; // gray-800

const NumberBox: React.FC<{ marginRight?: number }> = ({ marginRight = 0 }) => (
  <div style={{ width: 56, height: 56, border: BORDER, flexShrink: 0, marginRight }} />
);

const OperatorCircle: React.FC<{ marginRight?: number }> = ({ marginRight = 0 }) => (
  <div
    style={{
      width: 54, height: 54, border: BORDER, borderRadius: '50%', flexShrink: 0, marginRight,
    }}
  />
);

const ResultBox: React.FC = () => (
  <div style={{ width: 84, height: 56, border: BORDER, flexShrink: 0 }} />
);

const EquationRow: React.FC<{ numAddends: number }> = ({ numAddends }) => (
  <div style={{ display: 'flex', alignItems: 'center', margin: '80px 0 8px' }}>
    {Array.from({ length: numAddends }).map((_, idx) => (
      <React.Fragment key={idx}>
        <NumberBox marginRight={10} />
        {idx < numAddends - 1 && <OperatorCircle marginRight={10} />}
      </React.Fragment>
    ))}
    <span style={{ fontSize: 36, fontWeight: 700, margin: '0 10px' }}>=</span>
    <ResultBox />
  </div>
);

const Blank: React.FC<{ chars: number; label?: string }> = ({ chars, label }) => (
  <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', margin: '0 6px', verticalAlign: 'top' }}>
    <span style={{ display: 'inline-block', width: `${chars}ch`, height: '1em', borderBottom: BORDER }} />
    {label && <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.5, whiteSpace: 'nowrap' }}>{label}</span>}
  </span>
);

const AnswerSentenceRow: React.FC<{ problem: GeneratedProblem }> = ({ problem }) => {
  const keywordWords = problem.keyword.split(' ');
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', fontSize: 11 }}>
      <Blank chars={Math.max(2*problem.segments[0].text.length + 2, 6)} label="(name)" />
      <span style={{ margin: '0 4px' }}>has</span>
      <Blank chars={Math.max(2*problem.answer.toString().length + 2, 8)} label="(number)" />
      <Blank chars={Math.max(2*problem.unit.plural.length+2, 16)} label="(units)" />
      {keywordWords.map((w, i) => (
        <Blank key={i} chars={2*Math.max(w.length + 2, 6)} label="(key word)" />
      ))}
      <span>.</span>
    </div>
  );
};

// A labeled word (name/units/keyword) rendered inline with its caption
// positioned absolutely underneath — this keeps it a normal inline element
// (not flex), so it never disturbs the surrounding text's natural spacing.
const LabeledWord: React.FC<{ text: string; label: string }> = ({ text, label }) => (
  <span style={{ position: 'relative', display: 'inline-block', textDecoration: 'underline' }}>
    {text}
    <span
      style={{
        position: 'absolute', top: 'calc(100% - 6px)', left: '50%', transform: 'translateX(-50%)', fontSize: 8, color: '#ef4444',
        lineHeight: 1.2, whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  </span>
);

const ProblemQuadrant: React.FC<{ number: number; problem: GeneratedProblem }> = ({ number, problem }) => (
  <div
    style={{
      width: '50%',
      height: '50%',
      boxSizing: 'border-box',
      border: '1px dashed #9ca3af',
      padding: 12,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}
  >
    {/* Top block: problem text + equation, grouped so the answer row below can be pushed to the bottom */}
    <div>
      <div style={{ fontSize: 16, lineHeight: 1.6 }}>
        <span style={{ fontWeight: 700 }}>({number}) </span>
        {problem.segments.map((seg, idx) =>
          seg.label ? (
            <LabeledWord key={idx} text={seg.text} label={seg.label} />
          ) : (
            <React.Fragment key={idx}>{seg.text}</React.Fragment>
          )
        )}
      </div>
      <EquationRow numAddends={problem.nums.length} />
    </div>

    {/* Bottom block: pinned to the bottom of the quadrant via marginTop: auto, so any
        leftover space (for showing work) sits between the equation and this row */}
    <div style={{ marginTop: 'auto' }}>
      <AnswerSentenceRow problem={problem} />
    </div>
  </div>
);

// ============================================================================
// PAGE COMPONENT
// ============================================================================

export interface PrintableWordProblemsProps {
  problems?: PrintableProblemConfig[]; // defaults to 4 sample addition problems
  instructions?: string;
}

const DEFAULT_PROBLEMS: PrintableProblemConfig[] = [
  { nums: [5, 7, 3] },
  { nums: [6, 2, 4] },
  { nums: [7, 6] },
  { nums: [6, 5] },
];

const DEFAULT_INSTRUCTIONS =
  'Solve the following word problems. Show your work and include units in your answers. Underline the key word(s) that indicate this is an addition problem.';

const PrintableWordProblems: React.FC<PrintableWordProblemsProps> = ({
  problems = DEFAULT_PROBLEMS,
  instructions = DEFAULT_INSTRUCTIONS,
}) => {
  // Generate once per mount so re-renders (e.g. from the print button) don't reroll people/units
  const generated = useMemo(() => problems.map((p) => generateAdditionProblem(p)), [problems]);

  // Group into chunks of 4 so more than 4 configs spill onto additional pages
  const pages: GeneratedProblem[][] = [];
  for (let i = 0; i < generated.length; i += 4) {
    pages.push(generated.slice(i, i + 4));
  }

  return (
    <div style={{ backgroundColor: '#f3f4f6' }}>
      <style>{`
        @media print {
          @page { size: 11in 8.5in; margin: 0.3in; }
          .no-print { display: none !important; }
          .print-page { box-shadow: none !important; margin: 0 !important; page-break-after: always; }
        }
      `}</style>

      <div className="no-print" style={{ padding: 16, display: 'flex', justifyContent: 'center' }}>
        <button
          onClick={() => window.print()}
          style={{
            padding: '8px 16px', backgroundColor: '#2563eb', color: 'white', borderRadius: 8,
            fontWeight: 500, border: 'none', cursor: 'pointer',
          }}
        >
          Print
        </button>
      </div>

      {pages.map((pageProblems, pageIdx) => (
        <div
          key={pageIdx}
          className="print-page"
          style={{
            width: '11in', height: '8.5in', padding: '0.3in', backgroundColor: 'white',
            margin: '0 auto 24px auto', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
            boxSizing: 'border-box',
          }}
        >
          <p style={{ fontSize: 11, marginBottom: 8 }}>{instructions}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', height: 'calc(100% - 1.2rem)' }}>
            {pageProblems.map((problem, idx) => (
              <ProblemQuadrant key={idx} number={pageIdx * 4 + idx + 1} problem={problem} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default PrintableWordProblems;