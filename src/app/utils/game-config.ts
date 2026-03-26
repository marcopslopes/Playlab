/**
 * Game configuration utilities for Cognitive Calm
 * Handles age-appropriate difficulty and round counts
 */

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';
export type AgeGroup = '3-5' | '5-7' | '7-9';

/**
 * Get the number of rounds for a game based on course level
 * Beginner (3-5): 3 rounds
 * Intermediate (5-7): 4 rounds
 * Advanced (7-9): 5 rounds
 */
export function getRoundsForLevel(level: CourseLevel): number {
  switch (level) {
    case 'beginner':
      return 3;
    case 'intermediate':
      return 4;
    case 'advanced':
      return 5;
    default:
      return 3;
  }
}

/**
 * Get the recommended course level based on child's age
 */
export function getRecommendedLevel(age: number): CourseLevel {
  if (age >= 3 && age <= 5) return 'beginner';
  if (age >= 6 && age <= 7) return 'intermediate';
  if (age >= 8 && age <= 9) return 'advanced';
  return 'beginner'; // default
}

/**
 * Get age group label from age
 */
export function getAgeGroup(age: number): AgeGroup {
  if (age >= 3 && age <= 5) return '3-5';
  if (age >= 6 && age <= 7) return '5-7';
  if (age >= 8 && age <= 9) return '7-9';
  return '3-5'; // default
}

/**
 * Check if a course level is recommended for a given age
 */
export function isRecommendedForAge(level: CourseLevel, age: number): boolean {
  const recommended = getRecommendedLevel(age);
  return level === recommended;
}

/**
 * Extract course level from game ID
 * e.g., "logic/beginner/pattern-match" => "beginner"
 */
export function getLevelFromGameId(gameId: string): CourseLevel {
  if (gameId.includes('beginner')) return 'beginner';
  if (gameId.includes('intermediate')) return 'intermediate';
  if (gameId.includes('advanced')) return 'advanced';
  return 'beginner'; // default
}
