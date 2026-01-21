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
// UNITS (singular and plural forms)
// ============================================================================

export const UNITS: UnitData[] = [
  { singular: 'piece of candy', plural: 'pieces of candy' },
  { singular: 'cookie', plural: 'cookies' },
  { singular: 'apple', plural: 'apples' },
  { singular: 'toy', plural: 'toys' },
  { singular: 'book', plural: 'books' },
  { singular: 'pencil', plural: 'pencils' },
  { singular: 'sticker', plural: 'stickers' },
  { singular: 'marble', plural: 'marbles' },
  { singular: 'crayon', plural: 'crayons' },
  { singular: 'ball', plural: 'balls' },
  { singular: 'flower', plural: 'flowers' },
  { singular: 'dollar', plural: 'dollars' },
  { singular: 'point', plural: 'points' },
  { singular: 'card', plural: 'cards' },
  { singular: 'stamp', plural: 'stamps' },
];

// ============================================================================
// KEY WORDS (for each operation)
// ============================================================================

export const KEY_WORDS: KeywordData = {
  addition: [
    'in total',
    'altogether',
    'combined',
    'in all',
  ],
  subtraction: [
    'left',
    'remaining',
    'left over',
  ],
  multiplication: [
    'in total',
    'altogether',
    'in all',
  ],
  division: [
    'each',
    'per group',
    'in each group',
  ],
};

// ============================================================================
// ACTION VERBS (for problem scenarios)
// ============================================================================

export interface ActionVerbs {
  addition: string[];
  subtraction: string[];
}

export const ACTION_VERBS: ActionVerbs = {
  addition: [
    'gets',
    'finds',
    'receives',
    'buys',
    'earns',
    'wins',
  ],
  subtraction: [
    'eats',
    'uses',
    'gives away',
    'loses',
    'sells',
    'donates',
  ],
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