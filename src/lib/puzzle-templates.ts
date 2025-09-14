import { Puzzle, PuzzleType, PuzzleMechanic, PuzzleCategory } from '@/types'

export interface PuzzleTemplate {
  id: string
  name: string
  type: PuzzleType
  category: PuzzleCategory
  mechanics: PuzzleMechanic[]
  difficulty: number
  template: {
    title: string
    narrative: string
    content: string
    answer: string
    clues: string[]
    localContext: string
    materials?: string[]
    instructions?: string
  }
  qualityScore: number
  estimatedSolveTime: number
}

export class PuzzleTemplateService {
  private static templates: PuzzleTemplate[] = [
    // LOGIC PUZZLES
    {
      id: 'logic-syllogism',
      name: 'The Bartender\'s Alibi',
      type: 'logic',
      category: 'reasoning',
      mechanics: ['progressive', 'cross-reference'],
      difficulty: 3,
      template: {
        title: 'The Bartender\'s Alibi',
        narrative: 'The bartender claims he was cleaning glasses when the incident occurred. Three witnesses give conflicting statements about what they saw.',
        content: 'Witness A: "[STATEMENT A]" Witness B: "[STATEMENT B]" Witness C: "[STATEMENT C]" The pub\'s security log shows: "[EVIDENCE]". If only one witness is telling the complete truth, who is it?',
        answer: '[SOLUTION]',
        clues: [
          'Consider what each witness claims and compare it to the available evidence.',
          'Think about what would be impossible if someone was lying about their observations.',
          'If someone is telling the complete truth, their statement must be consistent with all available evidence.'
        ],
        localContext: 'This puzzle uses the pub\'s actual security system and witness testimony to determine credibility.',
        materials: ['Security log printout', 'Witness statements'],
        instructions: 'Read all statements carefully and cross-reference with the security log evidence.'
      },
      qualityScore: 9.2,
      estimatedSolveTime: 8
    },

    {
      id: 'logic-truth-table',
      name: 'The Truth Table Mystery',
      type: 'logic',
      category: 'reasoning',
      mechanics: ['multi-step', 'progressive'],
      difficulty: 4,
      template: {
        title: 'The Truth Table Mystery',
        narrative: 'Four suspects have made statements about the incident. Only one is completely truthful, one is completely lying, and two are partially truthful.',
        content: 'Suspect A: "[STATEMENT A]" Suspect B: "[STATEMENT B]" Suspect C: "[STATEMENT C]" Suspect D: "[STATEMENT D]" Create a truth table to determine who is telling the complete truth.',
        answer: '[SOLUTION]',
        clues: [
          'Create a truth table with all possible combinations of truth/lie for each suspect.',
          'Eliminate impossible combinations based on logical consistency.',
          'Check which combination leaves only one completely truthful suspect.'
        ],
        localContext: 'This puzzle uses logical reasoning to solve a pub-based mystery involving multiple suspects.',
        materials: ['Truth table worksheet', 'Suspect statements'],
        instructions: 'Use systematic logical analysis to determine the truth-telling pattern.'
      },
      qualityScore: 9.5,
      estimatedSolveTime: 12
    },

    // CIPHER PUZZLES
    {
      id: 'cipher-caesar',
      name: 'The Hidden Message',
      type: 'cipher',
      category: 'contextual',
      mechanics: ['multi-step', 'progressive'],
      difficulty: 4,
      template: {
        title: 'The Hidden Message',
        narrative: 'A cryptic message was found written on the back of a historical menu from [YEAR]. The pub\'s founder was known to use simple substitution ciphers.',
        content: 'Encrypted message: "[ENCRYPTED_MESSAGE]" The pub was founded in [YEAR]. The founder\'s favorite saying was "[KEY_PHRASE]". Use this information to decode the message.',
        answer: '[DECODED_MESSAGE]',
        clues: [
          'The founder\'s favorite saying might give you a clue about the cipher key.',
          'This is a Caesar cipher - try shifting the alphabet by different amounts.',
          'The year [YEAR] might be significant for determining the shift value.'
        ],
        localContext: 'This puzzle connects to the pub\'s founding year and the founder\'s personal preferences.',
        materials: ['Historical menu replica', 'Cipher wheel'],
        instructions: 'Use the historical context to determine the cipher key and decode the message.'
      },
      qualityScore: 9.0,
      estimatedSolveTime: 10
    },

    {
      id: 'cipher-substitution',
      name: 'The Menu Code',
      type: 'cipher',
      category: 'contextual',
      mechanics: ['hybrid', 'progressive'],
      difficulty: 3,
      template: {
        title: 'The Menu Code',
        narrative: 'A substitution cipher was found using the pub\'s historical menu items as the key. The code reveals the location of hidden evidence.',
        content: 'Encrypted message: "[ENCRYPTED_MESSAGE]" Use the pub\'s menu items as your cipher key: [MENU_ITEMS]. Decode the message to find the evidence location.',
        answer: '[EVIDENCE_LOCATION]',
        clues: [
          'Match each letter in the encrypted message to the corresponding menu item.',
          'Use the first letter of each menu item to create your substitution key.',
          'Apply the substitution to decode the message.'
        ],
        localContext: 'This puzzle uses the pub\'s actual historical menu as the cipher key.',
        materials: ['Historical menu', 'Cipher worksheet'],
        instructions: 'Create a substitution cipher using the menu items and decode the message.'
      },
      qualityScore: 8.8,
      estimatedSolveTime: 7
    },

    // MATH PUZZLES
    {
      id: 'math-delivery-schedule',
      name: 'The Delivery Schedule',
      type: 'math',
      category: 'analytical',
      mechanics: ['multi-step', 'progressive'],
      difficulty: 3,
      template: {
        title: 'The Delivery Schedule',
        narrative: 'The pub receives deliveries on specific days. The delivery schedule holds the key to understanding when the incident occurred.',
        content: 'The pub receives beer deliveries every [X] days, wine deliveries every [Y] days, and food deliveries every [Z] days. All three deliveries occurred on the same day [DAYS_AGO] days ago. Today is [DAY_OF_WEEK]. What day of the week did all three deliveries last occur together?',
        answer: '[DAY_OF_WEEK]',
        clues: [
          'Find the Least Common Multiple (LCM) of [X], [Y], and [Z] to determine the cycle length.',
          'Calculate how many complete cycles have passed in [DAYS_AGO] days.',
          'Work backwards from [DAY_OF_WEEK] to find the day when all deliveries last coincided.'
        ],
        localContext: 'This puzzle uses the pub\'s actual delivery schedule to establish a timeline.',
        materials: ['Delivery schedule', 'Calendar'],
        instructions: 'Use mathematical reasoning to determine the delivery cycle and calculate the timeline.'
      },
      qualityScore: 8.5,
      estimatedSolveTime: 9
    },

    // OBSERVATION PUZZLES
    {
      id: 'observation-architectural',
      name: 'The Architectural Clue',
      type: 'observation',
      category: 'analytical',
      mechanics: ['environmental', 'physical'],
      difficulty: 2,
      template: {
        title: 'The Architectural Clue',
        narrative: 'The pub\'s architecture holds a hidden message. Count the specific features to reveal a code.',
        content: 'Look around the pub and count: 1) The number of [FEATURE_1], 2) The number of [FEATURE_2], 3) The number of [FEATURE_3]. Add these three numbers together. The result is a [DIGIT_COUNT]-digit number. What is it?',
        answer: '[NUMBER]',
        clues: [
          'Start by counting the most obvious features - [FEATURE_1].',
          'Look for all [FEATURE_2], not just the most prominent ones.',
          'Count only the [FEATURE_3] that meet the specific criteria mentioned.'
        ],
        localContext: 'This puzzle requires players to actually observe and count real architectural features in the pub.',
        materials: ['Observation checklist'],
        instructions: 'Carefully observe and count the specified architectural features in the pub.'
      },
      qualityScore: 8.0,
      estimatedSolveTime: 5
    },

    // WORDPLAY PUZZLES
    {
      id: 'wordplay-anagram',
      name: 'The Anagram Clue',
      type: 'wordplay',
      category: 'creative',
      mechanics: ['progressive'],
      difficulty: 2,
      template: {
        title: 'The Anagram Clue',
        narrative: 'A suspect\'s name was found written as an anagram on a napkin. The letters spell out the location of hidden evidence.',
        content: 'The letters "[LETTERS]" were found written on a napkin. Rearrange these letters to form a [WORD_COUNT]-word phrase that describes where evidence might be hidden. The phrase relates to a common feature found in this type of establishment.',
        answer: '[ANAGRAM_SOLUTION]',
        clues: [
          'Look for common words that might be found in a pub setting.',
          'Think about what "[HINT_WORD_1]" might refer to in a drinking establishment.',
          'Consider that "[HINT_WORD_2]" might be a playful term for something else.'
        ],
        localContext: 'This puzzle uses pub terminology and wordplay to reveal a hiding place.',
        materials: ['Letter tiles', 'Napkin with letters'],
        instructions: 'Rearrange the letters to form a meaningful phrase related to the pub environment.'
      },
      qualityScore: 8.2,
      estimatedSolveTime: 6
    },

    // DEDUCTION PUZZLES
    {
      id: 'deduction-timeline',
      name: 'The Timeline Mystery',
      type: 'deduction',
      category: 'reasoning',
      mechanics: ['cross-reference', 'progressive'],
      difficulty: 4,
      template: {
        title: 'The Timeline Mystery',
        narrative: 'Three people entered the pub at different times. Their alibis don\'t match the security footage. Determine who is lying.',
        content: 'Security log shows: [TIME_1] - Person A enters, [TIME_2] - Person B enters, [TIME_3] - Person C enters. Person A claims: "[CLAIM_A]" Person B claims: "[CLAIM_B]" Person C claims: "[CLAIM_C]" The security log shows Person A left at [EXIT_TIME]. Who is lying?',
        answer: '[LIAR]',
        clues: [
          'Compare each person\'s claims with the security log timestamps.',
          'If Person A left at [EXIT_TIME], could Person B have seen them when leaving at [LEAVE_TIME]?',
          'Check if Person B\'s claim about Person A being there when they left contradicts the security log.'
        ],
        localContext: 'This puzzle uses the pub\'s actual security system and timing to determine credibility.',
        materials: ['Security log', 'Timeline worksheet'],
        instructions: 'Cross-reference all claims with the security log to identify inconsistencies.'
      },
      qualityScore: 9.3,
      estimatedSolveTime: 11
    },

    // LOCAL KNOWLEDGE PUZZLES
    {
      id: 'local-historical',
      name: 'The Historical Connection',
      type: 'local',
      category: 'contextual',
      mechanics: ['progressive', 'environmental'],
      difficulty: 3,
      template: {
        title: 'The Historical Connection',
        narrative: 'The pub\'s history holds the key to understanding the current mystery. A famous event occurred nearby that\'s relevant to the case.',
        content: 'In [YEAR], a famous incident occurred at [CITY]\'s [LOCATION]. The incident involved [HISTORICAL_DETAILS]. The pub was established in [PUB_YEAR] and was frequented by [HISTORICAL_FIGURES]. The current mystery involves someone who claims to be related to one of these historical figures. Based on the historical records, what was the name of the person who [HISTORICAL_ACTION]?',
        answer: '[HISTORICAL_NAME]',
        clues: [
          'Research the famous [YEAR] incident that occurred near this pub location.',
          'Consider who would have been involved in this type of historical event.',
          'Think about what name would be associated with the specific action mentioned.'
        ],
        localContext: 'This puzzle connects the current mystery to actual historical events that occurred near the pub.',
        materials: ['Historical documents', 'Local history guide'],
        instructions: 'Use local historical knowledge to connect the current mystery to past events.'
      },
      qualityScore: 9.1,
      estimatedSolveTime: 8
    },

    // PATTERN PUZZLES
    {
      id: 'pattern-sequence',
      name: 'The Sequence Code',
      type: 'pattern',
      category: 'analytical',
      mechanics: ['multi-step', 'progressive'],
      difficulty: 4,
      template: {
        title: 'The Sequence Code',
        narrative: 'A series of numbers was found written on the pub\'s historical ledger. The pattern reveals a hidden message.',
        content: 'The following sequence was found: [SEQUENCE]. Each number in the sequence follows a specific mathematical pattern. What is the next number in the sequence? Use this number to decode the message: "The answer is hidden in the [NUMBER]th word of the pub\'s motto." The pub\'s motto is "[MOTTO]".',
        answer: '[MOTTO_WORD]',
        clues: [
          'Look at the difference between consecutive numbers to find the pattern.',
          'The pattern involves [PATTERN_DESCRIPTION].',
          'Apply the pattern to find the next number, then count to that word in the motto.'
        ],
        localContext: 'This puzzle uses the pub\'s actual motto and a mathematical sequence to reveal hidden information.',
        materials: ['Sequence worksheet', 'Pub motto display'],
        instructions: 'Identify the mathematical pattern and use it to decode the hidden message.'
      },
      qualityScore: 9.4,
      estimatedSolveTime: 10
    },

    // PHYSICAL PUZZLES
    {
      id: 'physical-assembly',
      name: 'The Broken Lock',
      type: 'physical',
      category: 'physical',
      mechanics: ['environmental', 'collaborative'],
      difficulty: 3,
      template: {
        title: 'The Broken Lock',
        narrative: 'A broken lock was found in the pub\'s storage room. The pieces need to be reassembled to reveal a combination.',
        content: 'The lock has [PIECE_COUNT] pieces scattered around the storage room. Each piece has a number engraved on it. Assemble the pieces in the correct order to form a [DIGIT_COUNT]-digit combination. The combination opens the safe containing the next clue.',
        answer: '[COMBINATION]',
        clues: [
          'Look for pieces with numbers that form a logical sequence.',
          'Consider the physical shape of each piece - they should fit together like a puzzle.',
          'The combination might relate to important dates in the pub\'s history.'
        ],
        localContext: 'This puzzle uses the pub\'s actual storage room and safe to create a physical challenge.',
        materials: ['Lock pieces', 'Safe', 'Assembly instructions'],
        instructions: 'Physically assemble the lock pieces to reveal the combination.'
      },
      qualityScore: 8.7,
      estimatedSolveTime: 12
    },

    // SOCIAL PUZZLES
    {
      id: 'social-interview',
      name: 'The Witness Interview',
      type: 'social',
      category: 'social',
      mechanics: ['collaborative', 'progressive'],
      difficulty: 3,
      template: {
        title: 'The Witness Interview',
        narrative: 'A regular customer claims to have seen something important. You need to ask the right questions to get the truth.',
        content: 'Interview the witness using these questions: [QUESTION_1], [QUESTION_2], [QUESTION_3]. The witness will only answer truthfully if you ask the questions in the correct order and use the right approach. What is the correct sequence of questions?',
        answer: '[QUESTION_SEQUENCE]',
        clues: [
          'Consider what information you need most urgently first.',
          'Build rapport before asking sensitive questions.',
          'The witness responds better to open-ended questions than yes/no questions.'
        ],
        localContext: 'This puzzle involves interacting with actual pub staff or regular customers.',
        materials: ['Interview questions list', 'Witness character card'],
        instructions: 'Conduct a structured interview to gather information from the witness.'
      },
      qualityScore: 8.9,
      estimatedSolveTime: 9
    },

    // MEMORY PUZZLES
    {
      id: 'memory-sequence',
      name: 'The Drink Order',
      type: 'memory',
      category: 'analytical',
      mechanics: ['time-sensitive', 'progressive'],
      difficulty: 2,
      template: {
        title: 'The Drink Order',
        narrative: 'A customer placed a complex drink order that contains a hidden message. You need to remember the exact sequence.',
        content: 'The customer ordered: [DRINK_SEQUENCE]. Remember this exact order and repeat it back to the bartender. The bartender will give you the next clue if you get it right.',
        answer: '[DRINK_SEQUENCE]',
        clues: [
          'Create a mnemonic device to remember the drink names.',
          'Look for patterns in the drink names that might help.',
          'The first letter of each drink might spell something important.'
        ],
        localContext: 'This puzzle uses the pub\'s actual drink menu and requires memory skills.',
        materials: ['Drink menu', 'Memory aids'],
        instructions: 'Memorize the exact drink order and repeat it correctly.'
      },
      qualityScore: 8.1,
      estimatedSolveTime: 5
    },

    // CREATIVE PUZZLES
    {
      id: 'creative-storytelling',
      name: 'The Missing Chapter',
      type: 'creative',
      category: 'creative',
      mechanics: ['collaborative', 'progressive'],
      difficulty: 3,
      template: {
        title: 'The Missing Chapter',
        narrative: 'A page from the pub\'s guest book is missing. You need to recreate the story based on the clues left behind.',
        content: 'Using the clues: [CLUE_1], [CLUE_2], [CLUE_3], write a short story that explains what happened. The story must include [REQUIRED_ELEMENTS] and be exactly [WORD_COUNT] words long.',
        answer: '[STORY_SOLUTION]',
        clues: [
          'Use all the provided clues in your story.',
          'Make sure the story flows logically from beginning to end.',
          'Include all required elements naturally in the narrative.'
        ],
        localContext: 'This puzzle uses the pub\'s guest book and local history to create a creative writing challenge.',
        materials: ['Guest book', 'Writing materials', 'Clue cards'],
        instructions: 'Create a coherent story using all the provided clues and requirements.'
      },
      qualityScore: 8.6,
      estimatedSolveTime: 15
    },

    // TECHNOLOGY PUZZLES
    {
      id: 'technology-qr',
      name: 'The QR Code Mystery',
      type: 'technology',
      category: 'technological',
      mechanics: ['multi-step', 'progressive'],
      difficulty: 4,
      template: {
        title: 'The QR Code Mystery',
        narrative: 'A QR code was found hidden in the pub\'s Wi-Fi network name. Scanning it reveals a website with the next clue.',
        content: 'The pub\'s Wi-Fi network is named "[WIFI_NAME]". Use this information to generate a QR code. Scan the QR code to access a website. The website contains a puzzle that must be solved to get the next clue.',
        answer: '[WEBSITE_SOLUTION]',
        clues: [
          'Use a QR code generator to create a code from the Wi-Fi name.',
          'Scan the generated QR code to access the hidden website.',
          'Solve the puzzle on the website to reveal the next clue.'
        ],
        localContext: 'This puzzle uses the pub\'s actual Wi-Fi network and modern technology.',
        materials: ['QR code generator', 'Smartphone', 'Website access'],
        instructions: 'Use technology to decode the hidden message and solve the online puzzle.'
      },
      qualityScore: 9.0,
      estimatedSolveTime: 12
    },

    // META-PUZZLES
    {
      id: 'meta-puzzle-final',
      name: 'The Master Mystery',
      type: 'meta-puzzle',
      category: 'reasoning',
      mechanics: ['progressive', 'cross-reference', 'multi-step'],
      difficulty: 5,
      template: {
        title: 'The Master Mystery',
        narrative: 'All previous puzzles have revealed pieces of a larger mystery. Now you must solve the master puzzle that ties everything together.',
        content: 'Using the solutions from puzzles [PUZZLE_1], [PUZZLE_2], [PUZZLE_3], [PUZZLE_4], [PUZZLE_5], determine the identity of the mastermind. Each solution provides one piece of the final answer: [CLUE_1], [CLUE_2], [CLUE_3], [CLUE_4], [CLUE_5]. Combine these to solve the mystery.',
        answer: '[MASTERMIND_IDENTITY]',
        clues: [
          'Review all previous puzzle solutions carefully.',
          'Look for patterns or connections between the different clues.',
          'The final answer should make sense in the context of the overall story.'
        ],
        localContext: 'This puzzle ties together all previous puzzles to solve the ultimate mystery.',
        materials: ['All previous puzzle solutions', 'Master puzzle worksheet'],
        instructions: 'Use all previous puzzle solutions to solve the master mystery.'
      },
      qualityScore: 9.8,
      estimatedSolveTime: 20
    }
  ]

  /**
   * Get all available puzzle templates
   */
  static getAllTemplates(): PuzzleTemplate[] {
    return this.templates
  }

  /**
   * Get templates by type
   */
  static getTemplatesByType(type: PuzzleType): PuzzleTemplate[] {
    return this.templates.filter(template => template.type === type)
  }

  /**
   * Get templates by category
   */
  static getTemplatesByCategory(category: PuzzleCategory): PuzzleTemplate[] {
    return this.templates.filter(template => template.category === category)
  }

  /**
   * Get templates by difficulty range
   */
  static getTemplatesByDifficulty(minDifficulty: number, maxDifficulty: number): PuzzleTemplate[] {
    return this.templates.filter(template => 
      template.difficulty >= minDifficulty && template.difficulty <= maxDifficulty
    )
  }

  /**
   * Get templates by mechanics
   */
  static getTemplatesByMechanics(mechanics: PuzzleMechanic[]): PuzzleTemplate[] {
    return this.templates.filter(template => 
      mechanics.every(mechanic => template.mechanics.includes(mechanic))
    )
  }

  /**
   * Get a random template
   */
  static getRandomTemplate(): PuzzleTemplate {
    const randomIndex = Math.floor(Math.random() * this.templates.length)
    return this.templates[randomIndex]
  }

  /**
   * Get a random template by type
   */
  static getRandomTemplateByType(type: PuzzleType): PuzzleTemplate {
    const typeTemplates = this.getTemplatesByType(type)
    const randomIndex = Math.floor(Math.random() * typeTemplates.length)
    return typeTemplates[randomIndex]
  }

  /**
   * Generate a puzzle from a template
   */
  static generatePuzzleFromTemplate(template: PuzzleTemplate, customizations: {
    pubName?: string
    cityName?: string
    specificData?: Record<string, string>
    localContext?: string
  }): Puzzle {
    const puzzle: Puzzle = {
      id: `puzzle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: this.replacePlaceholders(template.template.title, customizations),
      narrative: this.replacePlaceholders(template.template.narrative, customizations),
      type: template.type,
      category: template.category,
      mechanics: template.mechanics,
      content: this.replacePlaceholders(template.template.content, customizations),
      answer: this.replacePlaceholders(template.template.answer, customizations),
      clues: template.template.clues.map(clue => 
        this.replacePlaceholders(clue, customizations)
      ),
      difficulty: template.difficulty,
      order: 1, // Will be set by the calling code
      localContext: customizations.localContext || 
        this.replacePlaceholders(template.template.localContext, customizations),
      materials: template.template.materials,
      instructions: template.template.instructions ? 
        this.replacePlaceholders(template.template.instructions, customizations) : undefined,
      qualityScore: template.qualityScore,
      estimatedSolveTime: template.estimatedSolveTime,
      requiresTeamwork: template.mechanics.includes('collaborative'),
      requiresPhysicalInteraction: template.mechanics.includes('environmental') || 
        template.mechanics.includes('physical'),
      requiresLocalKnowledge: template.type === 'local',
      isMultiStep: template.mechanics.includes('multi-step')
    }

    return puzzle
  }

  /**
   * Replace placeholders in template text
   */
  private static replacePlaceholders(text: string, customizations: {
    pubName?: string
    cityName?: string
    specificData?: Record<string, string>
    localContext?: string
  }): string {
    let result = text

    // Replace common placeholders
    if (customizations.pubName) {
      result = result.replace(/\[PUB_NAME\]/g, customizations.pubName)
    }
    if (customizations.cityName) {
      result = result.replace(/\[CITY\]/g, customizations.cityName)
    }

    // Replace specific data placeholders
    if (customizations.specificData) {
      Object.entries(customizations.specificData).forEach(([key, value]) => {
        const placeholder = `[${key.toUpperCase()}]`
        result = result.replace(new RegExp(placeholder, 'g'), value)
      })
    }

    return result
  }

  /**
   * Get template suggestions based on game requirements
   */
  static getTemplateSuggestions(requirements: {
    puzzleCount: number
    difficultyRange: [number, number]
    requiredTypes: PuzzleType[]
    preferredMechanics: PuzzleMechanic[]
  }): PuzzleTemplate[] {
    let suggestions = this.templates

    // Filter by difficulty
    suggestions = suggestions.filter(template => 
      template.difficulty >= requirements.difficultyRange[0] && 
      template.difficulty <= requirements.difficultyRange[1]
    )

    // Filter by required types
    if (requirements.requiredTypes.length > 0) {
      suggestions = suggestions.filter(template => 
        requirements.requiredTypes.includes(template.type)
      )
    }

    // Filter by preferred mechanics
    if (requirements.preferredMechanics.length > 0) {
      suggestions = suggestions.filter(template => 
        requirements.preferredMechanics.some(mechanic => 
          template.mechanics.includes(mechanic)
        )
      )
    }

    // Sort by quality score
    suggestions.sort((a, b) => b.qualityScore - a.qualityScore)

    // Return top suggestions
    return suggestions.slice(0, requirements.puzzleCount * 2) // Return 2x the needed amount for variety
  }
}
