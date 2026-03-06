// gradeProgressService.ts - Calculate expected grade level progress

import {
  MATH_LEVELS,
  ENGLISH_LEVELS,
  MATH_GRADE_LEVELS,
  ENGLISH_GRADE_LEVELS,
  SCHOOL_YEAR_START_MONTH,
  SCHOOL_YEAR_START_DAY,
} from "./types";
import type { GradeSkip } from "./types";

export interface GradeLevelPoint {
  date: Date;
  level: string;
  levelIndex: number;
  isPartialLevel?: boolean; // For overlapping levels like MG6
  grade: string; // e.g., "K", "1", "2", etc.
  gradePosition: string; // e.g., "Start", "2nd quarter", "Middle", "End"
}

/**
 * Get the school year for a given date
 * School year starts August 15
 */
export function getSchoolYear(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  // If date is Aug 15 or later, it's the current year
  // Otherwise, it's the previous year
  if (month > SCHOOL_YEAR_START_MONTH ||
    (month === SCHOOL_YEAR_START_MONTH && day >= SCHOOL_YEAR_START_DAY)) {
    return year;
  }
  return year - 1;
}

/**
 * Get the date when school year starts for a given year
 */
export function getSchoolYearStartDate(schoolYear: number): Date {
  return new Date(schoolYear, SCHOOL_YEAR_START_MONTH, SCHOOL_YEAR_START_DAY);
}

/**
 * Calculate current grade based on starting grade and program start date
 */
export function calculateCurrentGrade(
  startingGrade: string,
  programStartDate: Date
): string {
  const startYear = getSchoolYear(programStartDate);
  const currentYear = getSchoolYear(new Date());
  const yearsElapsed = currentYear - startYear;

  const gradeNum = startingGrade === 'K' ? 0 : parseInt(startingGrade);
  const currentGradeNum = gradeNum + yearsElapsed;

  if (currentGradeNum < 0) return 'K';
  if (currentGradeNum === 0) return 'K';
  if (currentGradeNum > 12) return '12';

  return currentGradeNum.toString();
}

/**
 * Check if a level is in the overlap between two grades
 */
function isOverlapLevel(level: string, grade: string, subject: "Math" | "English"): boolean {
  const gradeLevels = subject === "Math" ? MATH_GRADE_LEVELS : ENGLISH_GRADE_LEVELS;
  const nextGradeNum = grade === 'K' ? 1 : parseInt(grade) + 1;
  const nextGrade = nextGradeNum.toString();

  if (!gradeLevels[grade] || !gradeLevels[nextGrade]) return false;

  const currentGradeLevels = gradeLevels[grade];
  const nextGradeLevels = gradeLevels[nextGrade];

  return currentGradeLevels.includes(level) && nextGradeLevels.includes(level);
}

/**
 * Get the position label within a grade based on level index
 */
function getGradePosition(levelIndex: number, totalLevels: number, gradeName: string): string {
  if (totalLevels === 1) {
    return `${gradeName} grade`;
  } else if (totalLevels === 2) {
    return levelIndex === 0 ? `Start of ${gradeName} grade` : `2nd half of ${gradeName} grade`;
  } else if (totalLevels === 3) {
    if (levelIndex === 0) return `Start of ${gradeName} grade`;
    if (levelIndex === 1) return `Middle of ${gradeName} grade`;
    return `End of ${gradeName} grade`;
  } else if (totalLevels === 4) {
    const quarters = ['1st quarter', '2nd quarter', '3rd quarter', '4th quarter'];
    return `${quarters[levelIndex]} of ${gradeName} grade`;
  } else {
    // 5+ levels - use fractional description
    if (levelIndex === 0) return `Start of ${gradeName} grade`;
    if (levelIndex === totalLevels - 1) return `End of ${gradeName} grade`;
    return `${levelIndex + 1}/${totalLevels} through ${gradeName} grade`;
  }
}

/**
 * Calculate expected grade level progress line
 */
export function calculateGradeLevelLine(
  startingGrade: string,
  programStartDate: Date,
  subject: "Math" | "English",
  gradeSkips: GradeSkip[] = [],
  studentEndDate?: Date  // Optional: stop generating points after this date
): GradeLevelPoint[] {
  const gradeLevels = subject === "Math" ? MATH_GRADE_LEVELS : ENGLISH_GRADE_LEVELS;
  const allLevels = subject === "Math" ? MATH_LEVELS : ENGLISH_LEVELS;
  const points: GradeLevelPoint[] = [];

  // Start from the school year when student started
  const startSchoolYear = getSchoolYear(programStartDate);
  let currentGrade = startingGrade;
  let currentGradeNum = currentGrade === 'K' ? 0 : parseInt(currentGrade);

  // Filter grade skips for this subject
  const subjectSkips = gradeSkips
    .filter(skip => skip.subject === subject)
    .sort((a, b) => new Date(a.effectiveDate).getTime() - new Date(b.effectiveDate).getTime());

  let skipIndex = 0;

  // Calculate for current grade and all future grades
  // Stop at 12th grade OR when we reach the student's end date
  const endDateTimestamp = studentEndDate ? studentEndDate.getTime() : Infinity;

  for (let year = startSchoolYear; year <= startSchoolYear + 13 && currentGradeNum <= 12; year++) {
    const yearStartDate = getSchoolYearStartDate(year);

    // STOP if this school year starts after the student's end date
    if (yearStartDate.getTime() > endDateTimestamp) {
      // console.log(`Stopping grade level calculation - year ${year} starts after student end date`);
      break;
    }

    const yearEndDate = new Date(year + 1, SCHOOL_YEAR_START_MONTH, SCHOOL_YEAR_START_DAY - 1);

    // Check if there's a grade skip that happened before this year
    while (skipIndex < subjectSkips.length) {
      const skip = subjectSkips[skipIndex];
      const skipDate = new Date(skip.effectiveDate);

      if (skipDate < yearStartDate) {
        // Skip already happened, adjust current grade
        currentGradeNum++;
        currentGrade = currentGradeNum === 0 ? 'K' : currentGradeNum.toString();
        skipIndex++;
      } else {
        break;
      }
    }

    const expectedLevels = gradeLevels[currentGrade];
    if (!expectedLevels || expectedLevels.length === 0) break;

    // Calculate months per level (12 months / number of levels)
    const monthsPerLevel = 12 / expectedLevels.length;

    // Add points for each level
    expectedLevels.forEach((level, levelIndex) => {
      const levelStartDate = new Date(yearStartDate);
      levelStartDate.setMonth(levelStartDate.getMonth() + (levelIndex * monthsPerLevel));

      // STOP adding points if this level starts after student's end date
      if (studentEndDate && levelStartDate.getTime() > endDateTimestamp) {
        return; // Skip this level and continue to next
      }

      // Get grade context
      const gradeName = currentGrade === 'K' ? 'Kindergarten' : currentGrade;
      const gradePosition = getGradePosition(levelIndex, expectedLevels.length, gradeName);

      // Handle overlap levels (like MG6 in both 2nd and 3rd grade)
      const isOverlap = isOverlapLevel(level, currentGrade, subject);

      if (isOverlap && levelIndex === 0) {
        // This is the START of the overlap in the higher grade
        // Place point halfway between this level and next level
        const currentLevelIndex = allLevels.indexOf(level);
        const nextLevel = expectedLevels[1];
        const nextLevelIndex = nextLevel ? allLevels.indexOf(nextLevel) : currentLevelIndex + 1;
        const midpointIndex = (currentLevelIndex + nextLevelIndex) / 2;

        points.push({
          date: levelStartDate,
          level: level,
          levelIndex: midpointIndex,
          isPartialLevel: true,
          grade: currentGrade,
          gradePosition: gradePosition,
        });
      } else {
        const levelIdx = allLevels.indexOf(level);
        points.push({
          date: levelStartDate,
          level: level,
          levelIndex: levelIdx,
          grade: currentGrade,
          gradePosition: gradePosition,
        });
      }
    });

    // Check if grade skip happens during or at end of this year
    if (skipIndex < subjectSkips.length) {
      const skip = subjectSkips[skipIndex];
      const skipDate = new Date(skip.effectiveDate);

      if (skipDate <= yearEndDate) {
        currentGradeNum++;
        currentGrade = currentGradeNum === 0 ? 'K' : currentGradeNum.toString();
        skipIndex++;
      }
    }

    // Advance to next grade for next iteration
    currentGradeNum++;
    currentGrade = currentGradeNum === 0 ? 'K' : currentGradeNum.toString();
  }

  // Add starting point at program start date if it's before first point
  const expectedLevelsAtStart = gradeLevels[startingGrade];
  if (expectedLevelsAtStart && expectedLevelsAtStart.length > 0) {
    if (points.length === 0 || programStartDate < points[0].date) {
      const gradeName = startingGrade === 'K' ? 'Kindergarten' : startingGrade;
      const gradePosition = getGradePosition(0, expectedLevelsAtStart.length, gradeName);

      points.unshift({
        date: programStartDate,
        level: expectedLevelsAtStart[0],
        levelIndex: allLevels.indexOf(expectedLevelsAtStart[0]),
        grade: startingGrade,
        gradePosition: gradePosition,
      });
    }
  }

  return points;
}