import { Puzzle, PuzzleType, PuzzleMechanic, PuzzleCategory } from '@/types'

export interface PuzzleQualityMetrics {
  contentCompleteness: number // 0-10
  difficultyAppropriate: number // 0-10
  localRelevance: number // 0-10
  mechanicsIntegration: number // 0-10
  solvability: number // 0-10
  creativity: number // 0-10
  overallScore: number // 0-10
}

export interface PuzzleValidationResult {
  isValid: boolean
  qualityScore: number
  issues: string[]
  suggestions: string[]
  metrics: PuzzleQualityMetrics
}

export class PuzzleQualityService {
  private static readonly MIN_QUALITY_SCORE = 6.0
  private static readonly IDEAL_QUALITY_SCORE = 8.0

  /**
   * Validates a puzzle for quality and completeness
   */
  static validatePuzzle(puzzle: Puzzle): PuzzleValidationResult {
    const issues: string[] = []
    const suggestions: string[] = []
    
    // Content completeness validation
    const contentCompleteness = this.validateContentCompleteness(puzzle, issues, suggestions)
    
    // Difficulty appropriateness validation
    const difficultyAppropriate = this.validateDifficultyAppropriate(puzzle, issues, suggestions)
    
    // Local relevance validation
    const localRelevance = this.validateLocalRelevance(puzzle, issues, suggestions)
    
    // Mechanics integration validation
    const mechanicsIntegration = this.validateMechanicsIntegration(puzzle, issues, suggestions)
    
    // Solvability validation
    const solvability = this.validateSolvability(puzzle, issues, suggestions)
    
    // Creativity validation
    const creativity = this.validateCreativity(puzzle, issues, suggestions)
    
    const metrics: PuzzleQualityMetrics = {
      contentCompleteness,
      difficultyAppropriate,
      localRelevance,
      mechanicsIntegration,
      solvability,
      creativity,
      overallScore: (contentCompleteness + difficultyAppropriate + localRelevance + 
                   mechanicsIntegration + solvability + creativity) / 6
    }
    
    const isValid = metrics.overallScore >= this.MIN_QUALITY_SCORE
    
    return {
      isValid,
      qualityScore: metrics.overallScore,
      issues,
      suggestions,
      metrics
    }
  }

  /**
   * Validates content completeness (0-10)
   */
  private static validateContentCompleteness(puzzle: Puzzle, issues: string[], suggestions: string[]): number {
    let score = 10
    
    // Check required fields
    if (!puzzle.title || puzzle.title.trim().length < 3) {
      issues.push('Puzzle title is missing or too short')
      score -= 3
    }
    
    if (!puzzle.content || puzzle.content.trim().length < 20) {
      issues.push('Puzzle content is missing or too brief')
      score -= 4
    }
    
    if (!puzzle.answer || puzzle.answer.trim().length < 1) {
      issues.push('Puzzle answer is missing')
      score -= 3
    }
    
    if (!puzzle.clues || puzzle.clues.length < 3) {
      issues.push('Puzzle needs at least 3 progressive clues')
      score -= 2
    }
    
    // Check for placeholder text
    if (puzzle.content.includes('[PLACEHOLDER]') || puzzle.content.includes('[TBD]')) {
      issues.push('Puzzle contains placeholder text')
      score -= 2
    }
    
    // Check for specific data requirements
    if (this.requiresSpecificData(puzzle.type) && !this.hasSpecificData(puzzle.content)) {
      issues.push(`${puzzle.type} puzzles require specific data, numbers, or materials`)
      score -= 2
    }
    
    if (score < 5) {
      suggestions.push('Provide complete, specific content with actual data and materials')
    }
    
    return Math.max(0, score)
  }

  /**
   * Validates difficulty appropriateness (0-10)
   */
  private static validateDifficultyAppropriate(puzzle: Puzzle, issues: string[], suggestions: string[]): number {
    let score = 10
    
    // Check if difficulty matches puzzle type expectations
    const expectedDifficulty = this.getExpectedDifficulty(puzzle.type)
    const difficultyDiff = Math.abs(puzzle.difficulty - expectedDifficulty)
    
    if (difficultyDiff > 2) {
      issues.push(`Difficulty level ${puzzle.difficulty} doesn't match ${puzzle.type} puzzle expectations (expected ~${expectedDifficulty})`)
      score -= 3
    }
    
    // Check if mechanics match difficulty
    if (puzzle.mechanics.includes('multi-step') && puzzle.difficulty < 3) {
      issues.push('Multi-step puzzles should have higher difficulty')
      score -= 2
    }
    
    if (puzzle.mechanics.includes('time-sensitive') && puzzle.difficulty < 2) {
      issues.push('Time-sensitive puzzles should have moderate difficulty')
      score -= 1
    }
    
    // Check clue quality vs difficulty
    if (puzzle.difficulty >= 4 && puzzle.clues.length < 4) {
      issues.push('High difficulty puzzles need more clues')
      score -= 2
    }
    
    if (score < 6) {
      suggestions.push('Adjust difficulty level to match puzzle complexity and type')
    }
    
    return Math.max(0, score)
  }

  /**
   * Validates local relevance (0-10)
   */
  private static validateLocalRelevance(puzzle: Puzzle, issues: string[], suggestions: string[]): number {
    let score = 10
    
    // Check for local context
    if (!puzzle.localContext || puzzle.localContext.trim().length < 10) {
      issues.push('Puzzle lacks local context or connection to the pub/city')
      score -= 3
    }
    
    // Check if content references local elements
    const localKeywords = ['pub', 'bar', 'local', 'city', 'area', 'historical', 'nearby', 'establishment']
    const hasLocalReferences = localKeywords.some(keyword => 
      puzzle.content.toLowerCase().includes(keyword) || 
      puzzle.narrative.toLowerCase().includes(keyword)
    )
    
    if (!hasLocalReferences) {
      issues.push('Puzzle should reference local pub or area elements')
      score -= 2
    }
    
    // Check for generic content
    if (this.isGenericContent(puzzle.content)) {
      issues.push('Puzzle content is too generic and not location-specific')
      score -= 3
    }
    
    if (score < 6) {
      suggestions.push('Include specific local references, pub features, or area history')
    }
    
    return Math.max(0, score)
  }

  /**
   * Validates mechanics integration (0-10)
   */
  private static validateMechanicsIntegration(puzzle: Puzzle, issues: string[], suggestions: string[]): number {
    let score = 10
    
    // Check if mechanics are appropriate for puzzle type
    const validMechanics = this.getValidMechanics(puzzle.type)
    const invalidMechanics = puzzle.mechanics.filter(mechanic => !validMechanics.includes(mechanic))
    
    if (invalidMechanics.length > 0) {
      issues.push(`Invalid mechanics for ${puzzle.type} puzzle: ${invalidMechanics.join(', ')}`)
      score -= 3
    }
    
    // Check if mechanics are actually implemented in content
    for (const mechanic of puzzle.mechanics) {
      if (!this.isMechanicImplemented(puzzle, mechanic)) {
        issues.push(`Mechanic '${mechanic}' is declared but not implemented in content`)
        score -= 2
      }
    }
    
    // Check for missing mechanics that would enhance the puzzle
    const suggestedMechanics = this.getSuggestedMechanics(puzzle.type, puzzle.difficulty)
    const missingMechanics = suggestedMechanics.filter(mechanic => !puzzle.mechanics.includes(mechanic))
    
    if (missingMechanics.length > 0 && puzzle.difficulty >= 3) {
      suggestions.push(`Consider adding mechanics: ${missingMechanics.join(', ')}`)
      score -= 1
    }
    
    if (score < 6) {
      suggestions.push('Ensure declared mechanics are properly implemented in the puzzle content')
    }
    
    return Math.max(0, score)
  }

  /**
   * Validates solvability (0-10)
   */
  private static validateSolvability(puzzle: Puzzle, issues: string[], suggestions: string[]): number {
    let score = 10
    
    // Check if answer is specific and complete
    if (puzzle.answer.length < 2) {
      issues.push('Answer is too short or incomplete')
      score -= 3
    }
    
    // Check if clues actually help solve the puzzle
    if (!this.cluesAreHelpful(puzzle)) {
      issues.push('Clues don\'t provide meaningful help for solving the puzzle')
      score -= 2
    }
    
    // Check if puzzle has a clear solution path
    if (!this.hasClearSolutionPath(puzzle)) {
      issues.push('Puzzle lacks a clear solution path or methodology')
      score -= 3
    }
    
    // Check for ambiguous content
    if (this.hasAmbiguousContent(puzzle.content)) {
      issues.push('Puzzle content contains ambiguous or unclear instructions')
      score -= 2
    }
    
    if (score < 6) {
      suggestions.push('Ensure puzzle has clear instructions, helpful clues, and a specific answer')
    }
    
    return Math.max(0, score)
  }

  /**
   * Validates creativity (0-10)
   */
  private static validateCreativity(puzzle: Puzzle, issues: string[], suggestions: string[]): number {
    let score = 10
    
    // Check for creative elements
    const creativeElements = this.countCreativeElements(puzzle)
    if (creativeElements < 2) {
      issues.push('Puzzle lacks creative or innovative elements')
      score -= 3
    }
    
    // Check for originality
    if (this.isGenericPuzzle(puzzle)) {
      issues.push('Puzzle is too generic and lacks originality')
      score -= 2
    }
    
    // Check for story integration
    if (!this.integratesWithStory(puzzle)) {
      issues.push('Puzzle doesn\'t integrate well with the overall story')
      score -= 2
    }
    
    // Check for unique mechanics
    if (puzzle.mechanics.length === 0) {
      issues.push('Puzzle should have at least one advanced mechanic')
      score -= 3
    }
    
    if (score < 6) {
      suggestions.push('Add creative elements, unique mechanics, and better story integration')
    }
    
    return Math.max(0, score)
  }

  // Helper methods
  private static requiresSpecificData(type: PuzzleType): boolean {
    return ['math', 'cipher', 'pattern', 'observation', 'physical'].includes(type)
  }

  private static hasSpecificData(content: string): boolean {
    // Check for numbers, specific data, or structured information
    return /\d+/.test(content) || 
           content.includes('data:') || 
           content.includes('sequence:') ||
           content.includes('count:') ||
           content.includes('calculate:')
  }

  private static getExpectedDifficulty(type: PuzzleType): number {
    const difficultyMap: Record<PuzzleType, number> = {
      'observation': 2,
      'wordplay': 2,
      'local': 3,
      'logic': 3,
      'math': 3,
      'cipher': 4,
      'deduction': 4,
      'pattern': 4,
      'physical': 3,
      'social': 3,
      'memory': 2,
      'creative': 3,
      'technology': 4,
      'meta-puzzle': 5
    }
    return difficultyMap[type] || 3
  }

  private static getValidMechanics(type: PuzzleType): PuzzleMechanic[] {
    const mechanicsMap: Record<PuzzleType, PuzzleMechanic[]> = {
      'logic': ['progressive', 'multi-step', 'cross-reference'],
      'observation': ['environmental', 'progressive'],
      'cipher': ['multi-step', 'progressive', 'hybrid'],
      'deduction': ['progressive', 'cross-reference', 'multi-step'],
      'local': ['environmental', 'progressive'],
      'wordplay': ['progressive'],
      'math': ['multi-step', 'progressive', 'hybrid'],
      'pattern': ['progressive', 'multi-step'],
      'physical': ['environmental', 'collaborative', 'time-sensitive'],
      'social': ['collaborative', 'progressive'],
      'memory': ['progressive', 'time-sensitive'],
      'creative': ['progressive', 'collaborative'],
      'technology': ['multi-step', 'progressive', 'time-sensitive'],
      'meta-puzzle': ['progressive', 'cross-reference', 'multi-step']
    }
    return mechanicsMap[type] || []
  }

  private static isMechanicImplemented(puzzle: Puzzle, mechanic: PuzzleMechanic): boolean {
    switch (mechanic) {
      case 'multi-step':
        return puzzle.content.includes('Step') || (puzzle.content.includes('first') && puzzle.content.includes('then'))
      case 'progressive':
        return puzzle.dependencies && puzzle.dependencies.length > 0
      case 'collaborative':
        return puzzle.requiresTeamwork || puzzle.content.includes('team') || puzzle.content.includes('together')
      case 'time-sensitive':
        return puzzle.content.includes('time') || puzzle.content.includes('minutes') || puzzle.content.includes('countdown')
      case 'environmental':
        return puzzle.requiresPhysicalInteraction || puzzle.content.includes('look around') || puzzle.content.includes('observe')
      case 'cross-reference':
        return puzzle.content.includes('refer to') || puzzle.content.includes('check') || puzzle.content.includes('compare')
      case 'hybrid':
        return puzzle.type.includes('-') || puzzle.content.includes('combine')
      default:
        return true
    }
  }

  private static getSuggestedMechanics(type: PuzzleType, difficulty: number): PuzzleMechanic[] {
    if (difficulty >= 4) {
      return ['multi-step', 'progressive']
    }
    if (difficulty >= 3) {
      return ['progressive']
    }
    return []
  }

  private static cluesAreHelpful(puzzle: Puzzle): boolean {
    // Check if clues provide progressive help
    return puzzle.clues.length >= 3 && 
           puzzle.clues.every(clue => clue.length > 10) &&
           puzzle.clues.some(clue => clue.toLowerCase().includes('hint') || clue.toLowerCase().includes('try'))
  }

  private static hasClearSolutionPath(puzzle: Puzzle): boolean {
    // Check for clear instructions or methodology
    return puzzle.content.includes('solve') || 
           puzzle.content.includes('find') || 
           puzzle.content.includes('determine') ||
           puzzle.instructions && puzzle.instructions.length > 10
  }

  private static hasAmbiguousContent(content: string): boolean {
    const ambiguousWords = ['maybe', 'possibly', 'might', 'could be', 'perhaps', 'unclear']
    return ambiguousWords.some(word => content.toLowerCase().includes(word))
  }

  private static isGenericContent(content: string): boolean {
    const genericPhrases = ['a pub', 'the establishment', 'this location', 'the venue']
    return genericPhrases.some(phrase => content.toLowerCase().includes(phrase))
  }

  private static countCreativeElements(puzzle: Puzzle): number {
    let count = 0
    if (puzzle.mechanics.length > 1) count++
    if (puzzle.localContext && puzzle.localContext.length > 20) count++
    if (puzzle.materials && puzzle.materials.length > 0) count++
    if (puzzle.instructions && puzzle.instructions.length > 10) count++
    if (puzzle.content.includes('creative') || puzzle.content.includes('unique')) count++
    return count
  }

  private static isGenericPuzzle(puzzle: Puzzle): boolean {
    const genericTitles = ['Puzzle', 'Challenge', 'Mystery', 'Clue']
    return genericTitles.some(title => puzzle.title.toLowerCase().includes(title.toLowerCase()))
  }

  private static integratesWithStory(puzzle: Puzzle): boolean {
    return puzzle.narrative.length > 20 && 
           (puzzle.narrative.includes('story') || puzzle.narrative.includes('mystery') || puzzle.narrative.includes('case'))
  }

  /**
   * Generates quality improvement suggestions for a puzzle
   */
  static generateImprovementSuggestions(puzzle: Puzzle): string[] {
    const suggestions: string[] = []
    const validation = this.validatePuzzle(puzzle)
    
    if (validation.metrics.contentCompleteness < 7) {
      suggestions.push('Add more specific data, numbers, or materials to make the puzzle more concrete')
    }
    
    if (validation.metrics.localRelevance < 7) {
      suggestions.push('Include specific references to the pub, local area, or historical context')
    }
    
    if (validation.metrics.mechanicsIntegration < 7) {
      suggestions.push('Implement the declared mechanics more clearly in the puzzle content')
    }
    
    if (validation.metrics.creativity < 7) {
      suggestions.push('Add unique elements, creative mechanics, or innovative approaches')
    }
    
    if (puzzle.mechanics.length === 0) {
      suggestions.push('Add at least one advanced mechanic to enhance puzzle complexity')
    }
    
    if (puzzle.difficulty >= 4 && puzzle.clues.length < 4) {
      suggestions.push('High difficulty puzzles should have more clues to help players')
    }
    
    return suggestions
  }

  /**
   * Calculates estimated solve time based on puzzle characteristics
   */
  static calculateEstimatedSolveTime(puzzle: Puzzle): number {
    let baseTime = 5 // Base 5 minutes
    
    // Adjust for difficulty
    baseTime += puzzle.difficulty * 3
    
    // Adjust for mechanics
    if (puzzle.mechanics.includes('multi-step')) baseTime += 10
    if (puzzle.mechanics.includes('collaborative')) baseTime += 5
    if (puzzle.mechanics.includes('time-sensitive')) baseTime -= 2
    
    // Adjust for type
    const typeMultipliers: Record<PuzzleType, number> = {
      'observation': 0.8,
      'wordplay': 0.7,
      'local': 1.0,
      'logic': 1.2,
      'math': 1.3,
      'cipher': 1.5,
      'deduction': 1.4,
      'pattern': 1.3,
      'physical': 1.1,
      'social': 1.0,
      'memory': 0.9,
      'creative': 1.2,
      'technology': 1.4,
      'meta-puzzle': 2.0
    }
    
    baseTime *= typeMultipliers[puzzle.type] || 1.0
    
    return Math.round(baseTime)
  }
}
