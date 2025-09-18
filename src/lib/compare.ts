export function normalizeString(str: string): string {
  return str.trim().replace(/\s+/g, ' ');
}

export function normalizeForDaWo(str: string): string {
  const normalized = normalizeString(str);
  // Allow first letter capitalization difference, but punctuation must match
  return normalized;
}

export function compareDaWo(userAnswer: string, solution: string): boolean {
  const userNorm = normalizeForDaWo(userAnswer);
  const solutionNorm = normalizeForDaWo(solution);
  
  // Check if they match exactly
  if (userNorm === solutionNorm) return true;
  
  // Check if they match with only first letter capitalization difference
  if (userNorm.toLowerCase() === solutionNorm.toLowerCase()) {
    // Additional check: first letter can be different case, rest must match exactly
    if (userNorm.length > 0 && solutionNorm.length > 0) {
      const userRest = userNorm.slice(1);
      const solutionRest = solutionNorm.slice(1);
      return userRest === solutionRest;
    }
  }
  
  return false;
}

export function compareOrder(selectedWords: string[], solution: string): boolean {
  const userAnswer = normalizeString(selectedWords.join(' '));
  const normalizedSolution = normalizeString(solution);
  return userAnswer === normalizedSolution;
}

export function compareExact(userAnswer: string, solution: string): boolean {
  return userAnswer === solution;
}