// ============================================================================
// WORD PROBLEM DATA
// Contains all randomizable content for generating word problems
// ============================================================================

export interface PersonData {
  name: string;
  pronoun: 'he' | 'she';
  possessive: string; // his, her
  object: string; // him, her
}

export interface UnitData {
  singular: string;
  plural: string;
  category: 'food' | 'object' | 'money' | 'abstract'; // Category for verb matching
}

export interface KeywordData {
  addition: string[];
  subtraction: string[];
  multiplication: string[];
  division: string[];
}

// ============================================================================
// PEOPLE (with linked pronouns)
// ============================================================================

export const PEOPLE: PersonData[] = [
  { name: 'Tom', pronoun: 'he', possessive: 'his', object: 'him' },
  { name: 'Sarah', pronoun: 'she', possessive: 'her', object: 'her' },
  { name: 'Mike', pronoun: 'he', possessive: 'his', object: 'him' },
  { name: 'Emma', pronoun: 'she', possessive: 'her', object: 'her' },
  { name: 'Alex', pronoun: 'he', possessive: 'his', object: 'him' },
  { name: 'Lisa', pronoun: 'she', possessive: 'her', object: 'her' },
  { name: 'David', pronoun: 'he', possessive: 'his', object: 'him' },
  { name: 'Maya', pronoun: 'she', possessive: 'her', object: 'her' },
  { name: 'James', pronoun: 'he', possessive: 'his', object: 'him' },
  { name: 'Sophia', pronoun: 'she', possessive: 'her', object: 'her' },
];

// ============================================================================
// UNITS (singular, plural, and category)
// ============================================================================

export const UNITS: UnitData[] = [
  { singular: 'piece of candy', plural: 'pieces of candy', category: 'food' },
  { singular: 'cookie', plural: 'cookies', category: 'food' },
  { singular: 'apple', plural: 'apples', category: 'food' },
  { singular: 'toy', plural: 'toys', category: 'object' },
  { singular: 'book', plural: 'books', category: 'object' },
  { singular: 'pencil', plural: 'pencils', category: 'object' },
  { singular: 'sticker', plural: 'stickers', category: 'object' },
  { singular: 'marble', plural: 'marbles', category: 'object' },
  { singular: 'crayon', plural: 'crayons', category: 'object' },
  { singular: 'ball', plural: 'balls', category: 'object' },
  { singular: 'flower', plural: 'flowers', category: 'object' },
  { singular: 'dollar', plural: 'dollars', category: 'money' },
  { singular: 'coin', plural: 'coins', category: 'money' },
  { singular: 'point', plural: 'points', category: 'abstract' },
  { singular: 'card', plural: 'cards', category: 'object' },
  { singular: 'stamp', plural: 'stamps', category: 'object' },
];

// ============================================================================
// KEY WORDS (categorized by context)
// ============================================================================

export interface KeywordsByContext {
  joining: string[]; // For "How many does X have [keyword]?"
  increasing: string[]; // Alternative phrasing contexts
}

export interface MultiplicationKeywordsByContext {
  equalGroups: string[]; // For equal groups/repeated addition
  scaling: string[]; // For making things larger
  arrays: string[]; // For rows/columns arrangements
}

export const ADDITION_KEYWORDS: KeywordsByContext = {
  joining: [
    'in total',
    'altogether',
    'in all',
    'combined',
    'together',
    'now',
  ],
  increasing: [
    'now',
    'after that',
    'in the end',
  ],
};

export const SUBTRACTION_KEYWORDS = [
  'left',
  'remaining',
  'left over',
  'now',
];

export const MULTIPLICATION_KEYWORDS: MultiplicationKeywordsByContext = {
  equalGroups: [
    'in total',
    'in all',
    'altogether',
  ],
  scaling: [
    'in total',
    'altogether',
    'in all',
  ],
  arrays: [
    'in total',
    'in all',
    'altogether',
  ],
};

export const KEY_WORDS = {
  addition: ADDITION_KEYWORDS.joining, // Default to joining for backward compatibility
  subtraction: SUBTRACTION_KEYWORDS,
  multiplication: MULTIPLICATION_KEYWORDS.equalGroups,
  division: [
    'each',
    'per group',
    'in each group',
  ],
};

// ============================================================================
// ACTION VERBS (linked to unit categories)
// ============================================================================

export interface ActionVerbsByCategory {
  food: {
    addition: string[];
    subtraction: string[];
  };
  object: {
    addition: string[];
    subtraction: string[];
  };
  money: {
    addition: string[];
    subtraction: string[];
  };
  abstract: {
    addition: string[];
    subtraction: string[];
  };
}

export const ACTION_VERBS: ActionVerbsByCategory = {
  food: {
    addition: ['get', 'find', 'receive', 'buy'],
    subtraction: ['eat', 'share', 'give away', 'drop'],
  },
  object: {
    addition: ['get', 'find', 'receive', 'buy', 'win'],
    subtraction: ['lose', 'give away', 'sell', 'donate', 'break'],
  },
  money: {
    addition: ['earn', 'find', 'receive', 'win', 'get'],
    subtraction: ['spend', 'lose', 'give away', 'donate', 'pay'],
  },
  abstract: {
    addition: ['earn', 'score', 'get', 'win', 'gain'],
    subtraction: ['lose', 'give away', 'use', 'spend'],
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get random item from array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Get appropriate action verb based on unit category and operation
 */
export function getActionVerb(unit: UnitData, operation: 'addition' | 'subtraction'): string {
  return getRandomItem(ACTION_VERBS[unit.category][operation]);
}

// ============================================================================
// SENTENCE TEMPLATES
// ============================================================================

export interface SentenceTemplate {
  template: string; // Use placeholders: {name}, {pronoun}, {num1}, {unit1}, {verb}, {num2}, {unitPlural}, {keyword}
  context: 'joining' | 'increasing' | 'equalGroups' | 'scaling' | 'arrays'; // Context determines which keywords are appropriate
}

export const ADDITION_TEMPLATES: SentenceTemplate[] = [
  // JOINING/TOTALING context - combining two separate quantities
  {
    template: '{name} has {num1} {unit1} and {verb} {num2} more. How many {unitPlural} does {pronoun} have {keyword}?',
    context: 'joining'
  },
  {
    template: '{name} {verb} {num2} {unitPlural}. {Pronoun} already has {num1}. How many {unitPlural} does {pronoun} have {keyword}?',
    context: 'joining'
  },
  {
    template: '{name} has {num1} {unit1}. {Pronoun} {verb} {num2} more {unitPlural}. How many {unitPlural} does {pronoun} have {keyword}?',
    context: 'joining'
  },

  // INCREASING context - starting amount grows
  {
    template: '{name} has {num1} {unit1}. {Pronoun} then {verb} {num2} more. How many {unitPlural} does {pronoun} have {keyword}?',
    context: 'increasing'
  },
  {
    template: '{name} starts with {num1} {unit1} and {verb} {num2} more. How many {unitPlural} does {pronoun} have {keyword}?',
    context: 'increasing'
  },
];

export const SUBTRACTION_TEMPLATES: SentenceTemplate[] = [
  {
    template: '{name} has {num1} {unit1} and {verb} {num2} of them. How many {unitPlural} does {pronoun} have {keyword}?',
    context: 'joining' // Using 'joining' as default context for subtraction
  },
  {
    template: '{name} has {num1} {unit1}. {Pronoun} then {verb} {num2}. How many {unitPlural} does {pronoun} have {keyword}?',
    context: 'joining'
  },
  {
    template: '{name} starts with {num1} {unit1} and {verb} {num2} of them. How many {unitPlural} does {pronoun} have {keyword}?',
    context: 'joining'
  },
  {
    template: '{name} has {num1} {unit1} but {verb} {num2}. How many {unitPlural} does {pronoun} have {keyword}?',
    context: 'joining'
  },
];

export const MULTIPLICATION_TEMPLATES: SentenceTemplate[] = [
  // EQUAL GROUPS context - repeated addition
  {
    template: '{name} has {num1} groups of {num2} {unitPlural}. How many {unitPlural} does {pronoun} have {keyword}?',
    context: 'equalGroups'
  },
  {
    template: '{name} has {num1} bags with {num2} {unitPlural} in each bag. How many {unitPlural} does {pronoun} have {keyword}?',
    context: 'equalGroups'
  },
  {
    template: '{name} buys {num1} boxes. Each box has {num2} {unitPlural}. How many {unitPlural} does {pronoun} have {keyword}?',
    context: 'equalGroups'
  },
  {
    template: 'There are {num1} baskets. Each basket has {num2} {unitPlural}. How many {unitPlural} are there {keyword}?',
    context: 'equalGroups'
  },

  // SCALING context - making things larger (times/doubled/tripled)
  {
    template: '{name} has {num2} {unitPlural}. {Pronoun} gets {num1} times as many. How many {unitPlural} does {pronoun} have {keyword}?',
    context: 'scaling'
  },

  // ARRAYS context - rows and columns
  {
    template: '{name} arranges {unitPlural} in {num1} rows with {num2} in each row. How many {unitPlural} are there {keyword}?',
    context: 'arrays'
  },
];

/**
 * Get unit form based on count (singular if 1, plural otherwise)
 */
export function getUnitForm(unit: UnitData, count: number): string {
  return count === 1 ? unit.singular : unit.plural;
}

/**
 * Pluralize a word (simple rules)
 */
export function pluralize(word: string): string {
  if (word.endsWith('y') && !['ay', 'ey', 'iy', 'oy', 'uy'].some(v => word.endsWith(v))) {
    return word.slice(0, -1) + 'ies';
  }
  if (word.endsWith('s') || word.endsWith('sh') || word.endsWith('ch') || word.endsWith('x') || word.endsWith('z')) {
    return word + 'es';
  }
  return word + 's';
}