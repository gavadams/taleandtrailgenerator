import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { AIGenerationRequest, AIGenerationResponse } from '@/types'
import BarCrawlService from '../barcrawl-service'

export type AIProvider = 'openai' | 'anthropic' | 'google'

export interface AIConfig {
  provider: AIProvider
  apiKey: string
  model?: string
}

export class AIService {
  private config: AIConfig

  constructor(config: AIConfig) {
    this.config = config
  }

  /**
   * Get real pub data from BarCrawl service
   */
  private async getBarCrawlData(request: AIGenerationRequest) {
    try {
      // Check if BarCrawl supports this city
      if (!BarCrawlService.isCitySupported(request.city)) {
        console.log(`BarCrawl doesn't support ${request.city}, falling back to AI research`)
        return null;
      }

      // Get pub data from BarCrawl
      const barCrawlData = await BarCrawlService.generatePubCrawl(
        request.city,
        request.cityArea || '',
        request.pubCount
      );

      console.log(`BarCrawl found ${barCrawlData.pubs.length} pubs for ${request.cityArea}, ${request.city}`);
      console.log('BarCrawl pubs:', barCrawlData.pubs.map(pub => pub.name));
      return barCrawlData;
    } catch (error) {
      console.error('Error getting BarCrawl data:', error);
      return null;
    }
  }

  /**
   * Ensures balanced puzzle type distribution in generated games
   */
  private ensurePuzzleVariety(puzzles: any[]): any[] {
    const puzzleTypes = ['logic', 'observation', 'cipher', 'deduction', 'local', 'wordplay', 'math', 'pattern']
    const totalPuzzles = puzzles.length
    const maxPerType = Math.ceil(totalPuzzles * 0.3) // Max 30% of any single type
    const minTypes = Math.min(5, totalPuzzles) // At least 5 different types
    
    // Count current distribution
    const typeCounts: { [key: string]: number } = {}
    puzzleTypes.forEach(type => typeCounts[type] = 0)
    
    puzzles.forEach(puzzle => {
      if (puzzle.type && typeCounts[puzzle.type] !== undefined) {
        typeCounts[puzzle.type]++
      }
    })
    
    // Check if we need to rebalance
    const overLimit = Object.entries(typeCounts).some(([type, count]) => count > maxPerType)
    const usedTypes = Object.entries(typeCounts).filter(([type, count]) => count > 0).length
    
    if (overLimit || usedTypes < minTypes) {
      // Add variety enforcement to the prompt
      return puzzles.map(puzzle => ({
        ...puzzle,
        varietyNote: `Ensure this puzzle type (${puzzle.type}) doesn't exceed 30% of total puzzles and that at least 5 different puzzle types are used across the game.`
      }))
    }
    
    return puzzles
  }

  async generateGameContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    switch (this.config.provider) {
      case 'openai':
        return this.generateWithOpenAI(request)
      case 'anthropic':
        return this.generateWithAnthropic(request)
      case 'google':
        return this.generateWithGoogle(request)
      default:
        throw new Error(`Unsupported AI provider: ${this.config.provider}`)
    }
  }

  private async generateWithOpenAI(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const openai = new OpenAI({
      apiKey: this.config.apiKey,
    })

    const barCrawlData = await this.getBarCrawlData(request)
    const prompt = this.buildGameGenerationPrompt(request, barCrawlData)
    
    const response = await openai.chat.completions.create({
      model: this.config.model || 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a MASTER game designer and storyteller specializing in mystery and adventure pub crawl games. You create award-winning experiences that combine compelling narratives, sophisticated puzzles, and authentic local knowledge. Your games are known for their intricate plots, memorable characters, and challenging but fair puzzles that feel natural to the story. You excel at creating immersive experiences that players remember and recommend. Focus on EXCELLENCE - every element must serve the story and enhance the player experience.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 4000,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content generated from OpenAI')
    }

    return this.parseAIResponse(content, request)
  }

  private async generateWithAnthropic(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const anthropic = new Anthropic({
      apiKey: this.config.apiKey,
    })

    const barCrawlData = await this.getBarCrawlData(request)
    const prompt = this.buildGameGenerationPrompt(request, barCrawlData)
    
    const response = await anthropic.messages.create({
      model: this.config.model || 'claude-3-sonnet-20240229',
      max_tokens: 4000,
      system: 'You are a MASTER game designer and storyteller specializing in mystery and adventure pub crawl games. You create award-winning experiences that combine compelling narratives, sophisticated puzzles, and authentic local knowledge. Your games are known for their intricate plots, memorable characters, and challenging but fair puzzles that feel natural to the story. You excel at creating immersive experiences that players remember and recommend. Focus on EXCELLENCE - every element must serve the story and enhance the player experience.',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Anthropic')
    }

      return this.parseAIResponse(content.text, request)
  }

  private async generateWithGoogle(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const genAI = new GoogleGenerativeAI(this.config.apiKey)
    
    // Use a more recent and available model
    const modelName = this.config.model || 'gemini-1.5-flash'
    console.log('Using Google model:', modelName)
    
    const model = genAI.getGenerativeModel({ 
      model: modelName
    })

    const barCrawlData = await this.getBarCrawlData(request)
    const prompt = this.buildGameGenerationPrompt(request, barCrawlData)
    console.log('=== AI REQUEST DEBUG ===')
    console.log('Request object:', JSON.stringify(request, null, 2))
    console.log('City Area from request:', request.cityArea)
    console.log('City Area type:', typeof request.cityArea)
    console.log('City Area length:', request.cityArea?.length)
    console.log('BarCrawl data received:', barCrawlData ? 'YES' : 'NO')
    if (barCrawlData) {
      console.log('BarCrawl pubs count:', barCrawlData.pubs.length)
      console.log('BarCrawl pub names:', barCrawlData.pubs.map(pub => pub.name))
    }
    console.log('Full prompt preview:', prompt.substring(0, 1000) + '...')
    console.log('=== END AI REQUEST DEBUG ===')
    
    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const content = response.text()

      if (!content) {
        throw new Error('No content generated from Google AI')
      }

      return this.parseAIResponse(content, request)
    } catch (error: any) {
      console.error('Google AI generation error:', error)
      
      // Handle service overload errors specifically
      if (error.message?.includes('overloaded') || error.message?.includes('Service Unavailable') || error.message?.includes('503')) {
        throw new Error('Google AI service is currently overloaded. Please try again in a few minutes, or switch to a different AI provider.')
      }
      
      // If it's a parsing error or simplified prompt is requested, use a much simpler prompt
      if (error.message.includes('parse AI response') || error.message.includes('format error') || error.message.includes('structure error') || (request as any).simplifiedPrompt) {
        console.log('Using simplified prompt...')
        try {
          const simplifiedPrompt = `Create a pub crawl mystery game for ${request.city}${request.cityArea ? ` in ${request.cityArea}` : ''}. 

${request.cityArea ? `IMPORTANT: Only use pubs in ${request.cityArea}.` : ''}

Use real pub names from the area. Avoid generic names like "The Red Lion" or "The Crown & Anchor".

Return ONLY this JSON format (no other text):

{
  "story": {
    "title": "Mystery in ${request.city}",
    "intro": {
      "title": "Welcome",
      "content": "You are investigating a mystery in ${request.city}${request.cityArea ? `'s ${request.cityArea} area` : ''}.",
      "mapsLink": "https://maps.google.com"
    },
    "resolution": {
      "title": "Case Solved",
      "content": "Congratulations! You solved the mystery."
    },
    "characterTypes": ["detective", "witness"]
  },
  "locations": [
    {
      "order": 1,
      "placeholderName": "{PUB_1}",
      "actualName": "[RESEARCH REAL PUB NAME IN SPECIFIED AREA]",
      "venueType": "traditional-pub",
      "narrative": "First pub${request.cityArea ? ` in ${request.cityArea}` : ''}",
      "transitionText": "Walk to next location",
      "mapsLink": "https://maps.google.com",
      "walkingTime": "5 minutes",
      "areaDescription": "${request.cityArea || 'City area'}",
      "coordinates": {
        "lat": 53.4808,
        "lng": -2.2426
      }
    }
  ],
  "puzzles": [
    {
      "title": "First Clue",
      "narrative": "Find the clue",
      "type": "observation",
      "content": "Look around the pub",
      "answer": "clue",
      "clues": ["Look carefully", "Check the details", "It's obvious"],
      "difficulty": 2,
      "order": 1,
      "localContext": "${request.city} context"
    }
  ]
}`

          const retryResult = await model.generateContent(simplifiedPrompt)
          const retryResponse = await retryResult.response
          const retryContent = retryResponse.text()
          
          if (retryContent) {
            return this.parseAIResponse(retryContent, request)
          }
        } catch (retryError) {
          console.error('Retry also failed:', retryError)
        }
      }
      
      throw new Error(`Google AI generation failed: ${error.message}`)
    }
  }

  private buildGameGenerationPrompt(request: AIGenerationRequest, barCrawlData?: any): string {
    return `
🚨 CRITICAL: You MUST return ONLY valid JSON. No explanations, no markdown, no code blocks. Just pure JSON.

🚨 JSON FORMAT REQUIREMENTS 🚨:
- Start your response with { and end with }
- Use double quotes for all strings and keys
- No trailing commas
- No comments or explanations
- No markdown formatting
- No text before or after the JSON

Generate a complete pub crawl mystery game with the following specifications:

Theme: ${request.theme}
City: ${request.city}
${request.cityArea ? `City Area/Neighborhood: ${request.cityArea}` : ''}
Difficulty: ${request.difficulty}
Number of pubs: ${request.pubCount} (EXACTLY ${request.pubCount} PUBS - NO MORE, NO LESS)
Puzzles per pub: ${request.puzzlesPerPub} (EXACTLY ${request.puzzlesPerPub} PUZZLES PER PUB - NO MORE, NO LESS)
Total puzzles: ${request.pubCount * request.puzzlesPerPub} (EXACTLY ${request.pubCount * request.puzzlesPerPub} TOTAL PUZZLES)
Estimated duration: ${request.estimatedDuration} minutes

🚨 CRITICAL STORY INTEGRATION REQUIREMENT 🚨:
This is NOT just a collection of random puzzles - this is a cohesive mystery investigation where each puzzle advances the storyline and reveals crucial plot information. Every puzzle must feel like a natural, essential part of the investigation that players are emotionally invested in solving. Follow the narrative integration examples provided to ensure puzzles drive the story forward and provide meaningful breakthroughs in the case.

${barCrawlData ? `🎯 REAL PUB DATA PROVIDED FROM BARCRAWL:
Use these EXACT pub names, locations, and coordinates from BarCrawl:
${barCrawlData.pubs.map((pub: any, index: number) => 
  `- {PUB_${index + 1}}: ${pub.name} (${pub.address}) - Coordinates: ${pub.coordinates.lat}, ${pub.coordinates.lng}`
).join('\n')}

CRITICAL: Use ONLY these pub names and coordinates. Do not research or invent any other pub names.
DO NOT use any other pub names - only use the ones provided above.
Include the exact coordinates provided for each pub in your JSON response.` : ''}

${request.customInstructions ? `Custom instructions: ${request.customInstructions}` : ''}

${!barCrawlData && request.cityArea ? `🚨🚨🚨 AREA REQUIREMENT - RESEARCH REQUIRED 🚨🚨🚨
YOU ARE CREATING A PUB CRAWL FOR ${request.cityArea.toUpperCase()} IN ${request.city.toUpperCase()}.

- EVERY SINGLE PUB MUST BE LOCATED IN ${request.cityArea.toUpperCase()}
- DO NOT USE PUBS FROM ANY OTHER AREA
- DO NOT USE PUBS FROM CITY CENTER, DOWNTOWN, OR OTHER DISTRICTS
- RESEARCH ACTUAL PUBS THAT EXIST IN ${request.cityArea.toUpperCase()}
- IF YOU CANNOT FIND ENOUGH PUBS IN ${request.cityArea.toUpperCase()}, USE FEWER PUBS

FAILURE TO COMPLY WITH THIS AREA REQUIREMENT WILL RESULT IN AN INVALID RESPONSE.` : ''}

${!barCrawlData ? `🚨🚨🚨 CRITICAL: RESEARCH AREA-SPECIFIC PUBS 🚨🚨🚨

MANDATORY REQUIREMENTS:
- You MUST research real, established pubs that are specifically located in the specified area
- You MUST use pub names that are unique to or commonly associated with the specified area
- You MUST verify each pub is genuinely located in the specified area
- You MUST avoid using generic pub names that appear in many different cities

RESEARCH FOCUS:
- Look for pubs that are well-known in the specific area you're targeting
- Use pubs that are part of documented pub crawl routes in that area
- Choose pubs that have local significance or are landmarks in the area
- Avoid falling back to generic names that could be anywhere

REQUIRED VERIFICATION:
- Each pub must be verifiably located in the specified area
- Each pub must be part of a real, walkable route within that area
- Each pub must have a name that reflects its local context
- If you cannot find enough area-specific pubs, use fewer pubs rather than generic fallbacks

FAILURE TO RESEARCH AREA-SPECIFIC PUBS WILL RESULT IN REJECTION.` : ''}

CRITICAL STORY & PUZZLE REQUIREMENTS:

${request.preferredPuzzleTypes && request.preferredPuzzleTypes.length > 0 ? `🎯 PUZZLE TYPE PREFERENCES:
The user has specifically requested these puzzle types (use these as primary focus):
${request.preferredPuzzleTypes.map((type: string) => `- ${type}`).join('\n')}

IMPORTANT: Prioritize these puzzle types while still maintaining variety.` : ''}

${request.preferredMechanics && request.preferredMechanics.length > 0 ? `🎯 PUZZLE MECHANICS PREFERENCES:
The user has specifically requested these mechanics (use these as primary focus):
${request.preferredMechanics.map((mechanic: string) => `- ${mechanic}`).join('\n')}

IMPORTANT: Prioritize these mechanics while still maintaining variety.` : ''}

${request.difficultyRange ? `🎯 DIFFICULTY RANGE PREFERENCES:
The user has requested puzzles between difficulty levels ${request.difficultyRange[0]} and ${request.difficultyRange[1]}.
Ensure all puzzles fall within this range.` : ''}

${request.includePhysicalPuzzles ? `🎯 PHYSICAL PUZZLES REQUIRED:
The user specifically wants physical puzzles that require hands-on manipulation, movement, or interaction with physical objects.` : ''}

${request.includeSocialPuzzles ? `🎯 SOCIAL PUZZLES REQUIRED:
The user specifically wants social puzzles that require interaction with people, interviews, or social deduction.` : ''}

${request.includeTechnologyPuzzles ? `🎯 TECHNOLOGY PUZZLES REQUIRED:
The user specifically wants technology-based puzzles using modern devices, QR codes, or digital elements.` : ''}

${request.requireTeamwork ? `🎯 TEAMWORK REQUIRED:
The user specifically wants puzzles that require team coordination and collaboration.` : ''}

${request.requireLocalKnowledge ? `🎯 LOCAL KNOWLEDGE REQUIRED:
The user specifically wants puzzles that require knowledge of the local area, history, or culture.` : ''}

STORY EXCELLENCE:
1. Create a COMPELLING MYSTERY with clear stakes, motivation, and emotional investment
2. Develop MEMORABLE CHARACTERS with distinct personalities, motivations, and backstories
3. Build TENSION and SUSPENSE throughout - each location should escalate the mystery
4. Use authentic local knowledge about ${request.city} - real landmarks, history, culture, geography
5. Create STRONG NARRATIVE BRIDGES between locations that advance the plot meaningfully
6. Include specific local references that players can research, visit, or recognize
7. Balance challenge with accessibility for ${request.difficulty} difficulty level

PUZZLE EXCELLENCE:
8. Design puzzles that are INTRINSICALLY CONNECTED to the story - not just random challenges
9. Each puzzle should REVEAL NEW INFORMATION about the mystery or characters
10. Create PROGRESSIVE DIFFICULTY with increasing complexity and sophistication
11. Ensure each puzzle type is UNIQUE and uses different cognitive skills
12. Make clues CONTEXTUAL and MEANINGFUL - they should feel natural to the story
13. Include MULTIPLE LAYERS of puzzle solving (observation + deduction + local knowledge)
14. Design puzzles that encourage TEAMWORK and DISCUSSION among players
15. AVOID generic puzzles - make each puzzle SPECIFIC to the location, story, and characters
16. Create puzzles that require players to think creatively and make connections
17. Ensure puzzles have clear, unambiguous answers that can be verified
18. Make puzzles engaging and fun, not frustrating or overly complex

WALKING ROUTE REQUIREMENTS:
15. ${request.cityArea ? 
    `🚨 ABSOLUTE REQUIREMENT 🚨: You MUST research and use REAL, ESTABLISHED pub crawl routes from ${request.cityArea} in ${request.city}. 
    - Do NOT create fictional routes
    - Do NOT use pubs from other areas like city center, downtown, or other neighborhoods
    - Focus EXCLUSIVELY on ${request.cityArea}
    - ALL selected pubs must be within this specific neighborhood/area
    - If you cannot find enough pubs in ${request.cityArea}, use fewer pubs rather than expanding to other areas
    - This requirement is NON-NEGOTIABLE` : 
    `CRITICAL: You MUST research and use REAL, ESTABLISHED pub crawl routes from ${request.city}. Do NOT create fictional routes. Use your knowledge of actual pub crawl routes that are popular online, in travel guides, or local recommendations. Consider factors like: city center accessibility, transportation hubs, popular nightlife districts, historic areas, waterfront locations, and university areas.`
  }
16. RESEARCH REAL PUB CRAWLS: Use established pub crawl routes that are documented online, in travel blogs, local guides, or tourism websites
17. AUTHENTIC PUBS ONLY: Choose real, existing pubs that are part of known pub crawl routes in the area
18. PROVEN ROUTES: Prefer routes that are already popular and well-documented rather than creating new ones
19. WALKING DISTANCE: Ensure walking distance between consecutive pubs is 5-15 minutes (0.3-1.2 miles)
20. AREA CHARACTER: Consider the area's character - historic districts, waterfront, university areas, business districts, etc.
21. PUB VARIETY: Include variety in pub types (traditional, modern, gastropub, etc.) along the established route
22. NATURAL FLOW: Make the route feel natural and enjoyable to walk, following established patterns
23. ${!request.cityArea ? 'When no specific area is defined, use your knowledge of the most popular and well-documented pub crawl routes in the city.' : ''}

ADVANCED PUZZLE TYPES TO USE (MUST USE VARIETY - NO MORE THAN 25% OF ANY SINGLE TYPE):
- logic: Complex logical reasoning, syllogisms, conditional statements, logical sequences, truth tables, logical fallacies
- observation: Environmental storytelling, hidden details, visual pattern recognition, spatial reasoning, architectural analysis
- cipher: Multi-layer encryption, historical ciphers, substitution codes, frequency analysis, steganography, code-breaking
- deduction: Evidence correlation, timeline reconstruction, motive analysis, alibi verification, witness statement analysis
- local: Deep local knowledge, historical events, architectural details, cultural references, local legends, historical figures
- wordplay: Sophisticated anagrams, cryptic clues, linguistic patterns, etymology puzzles, palindromes, acrostics
- math: Mathematical reasoning, geometric patterns, statistical analysis, algorithmic thinking, probability, sequences
- pattern: Complex sequence recognition, fractal patterns, recursive logic, system analysis, tessellations, fractals
- physical: Hands-on puzzles requiring manipulation, assembly, construction, or physical interaction with objects
- social: Puzzles requiring interaction with people, interviews, role-playing, or collaborative problem-solving
- memory: Puzzles testing recall, sequence memorization, or information retention skills
- creative: Puzzles requiring artistic expression, storytelling, or creative problem-solving approaches
- technology: Puzzles involving modern technology, QR codes, apps, or digital elements
- meta-puzzle: Puzzles that require understanding of the overall game structure and connecting multiple solutions

PUZZLE DISTRIBUTION REQUIREMENTS:
- Each game MUST use at least 6 different puzzle types
- No single puzzle type should exceed 25% of total puzzles
- Include at least one puzzle from each category: reasoning (logic/deduction), creative (wordplay/pattern), analytical (math/observation), contextual (local/cipher), physical, social, technological
- Vary difficulty within each type - don't make all puzzles of the same type the same difficulty
- Include at least one multi-step puzzle and one hybrid puzzle
- Ensure puzzles build on each other and reveal story elements progressively

ADVANCED PUZZLE MECHANICS TO IMPLEMENT:
- Multi-step puzzles that require solving multiple sub-puzzles
- Puzzles that build on previous solutions (progressive revelation)
- Collaborative puzzles requiring team coordination
- Time-sensitive puzzles with countdown elements
- Environmental puzzles that use the pub's actual features
- Cross-reference puzzles that connect information from multiple locations
- Hybrid puzzles combining multiple puzzle types (e.g., cipher + local knowledge)
- Meta-puzzles that require understanding the overall game structure
- Red herring puzzles that mislead but provide valuable information when solved
- Progressive difficulty puzzles that start easy but become more complex

HIGH-QUALITY PUZZLE EXAMPLES BY TYPE:

LOGIC PUZZLES:
- A syllogism puzzle where players must determine which character is lying based on logical statements
- A truth table puzzle involving multiple witnesses with contradictory statements
- A logical sequence puzzle where pub opening hours reveal a pattern

OBSERVATION PUZZLES:
- Players must count specific architectural features to get a code number
- A visual pattern puzzle using the pub's historical photographs or artwork
- A spatial reasoning puzzle involving the pub's layout and historical modifications

CIPHER PUZZLES:
- A Caesar cipher where the shift value is hidden in the pub's founding year
- A substitution cipher using the pub's historical menu items as the key
- A steganography puzzle where a message is hidden in the pub's historical documents

DEDUCTION PUZZLES:
- Timeline reconstruction using witness statements and pub CCTV timestamps
- Motive analysis comparing character backgrounds with opportunity windows
- Alibi verification cross-referencing multiple witness accounts

LOCAL KNOWLEDGE PUZZLES:
- Historical event puzzle about a famous incident that happened near the pub
- Architectural puzzle about the pub's historical significance in the area
- Cultural reference puzzle about local traditions or famous residents

WORDPLAY PUZZLES:
- Anagram puzzle using the pub's historical name changes
- Cryptic crossword clues about local landmarks visible from the pub
- Palindrome puzzle about the pub's historical significance

MATH PUZZLES:
- Geometric puzzle calculating distances between historical pub locations
- Statistical puzzle analyzing historical pub attendance patterns
- Probability puzzle about historical events that could have happened

PATTERN PUZZLES:
- Sequence puzzle using the pub's historical renovation dates
- Fractal pattern puzzle in the pub's architectural details
- Recursive logic puzzle about the pub's ownership history

ADVANCED MECHANIC EXAMPLES:

MULTI-STEP PUZZLES:
- Step 1: Solve a cipher to get a date, Step 2: Use that date to find a historical event, Step 3: Use the event details to solve a logic puzzle
- Step 1: Count architectural features, Step 2: Use the count in a mathematical formula, Step 3: Apply the result to decode a message

HYBRID PUZZLES:
- Cipher + Local Knowledge: A substitution cipher where the key is hidden in local historical facts
- Math + Observation: Calculate distances using pub measurements, then observe patterns in the results
- Wordplay + Pattern: An anagram that reveals a sequence, which then needs to be continued

PROGRESSIVE REVELATION:
- Early puzzle gives partial information that becomes crucial in later puzzles
- Each solved puzzle reveals a piece of a larger meta-puzzle
- Character backstories are revealed through puzzle solutions

ENVIRONMENTAL INTEGRATION:
- Puzzles that require players to physically interact with the pub environment
- Use of actual pub features (beer taps, historical photos, architectural details)
- Integration with pub staff or regular customers as puzzle elements

STORY EXCELLENCE EXAMPLES:
- Characters with hidden motivations that are revealed through puzzle solutions
- Plot twists that make players reconsider earlier clues and evidence
- Emotional stakes that make players care about the outcome
- Local history that becomes crucial to solving the mystery
- Red herrings that mislead but don't frustrate players
- Satisfying resolutions that tie all loose ends together

NARRATIVE INTEGRATION EXAMPLES:
- Puzzle 1: "The Shipping Ledger" - Reveals which dock is involved in smuggling, advancing the investigation
- Puzzle 2: "Witness Statements" - Identifies the truthful witness, providing crucial timeline information
- Puzzle 3: "Dock Schedule" - Narrows down to specific shift crew, finding the eyewitness
- Puzzle 4: "Route Map" - Determines where the smuggler drinks, leading to next location
- Puzzle 5: "Witness Interviews" - Eliminates liars to find who knows the next lead
- Puzzle 6: "Ciphered Messages" - Decodes location of the safehouse
- Puzzle 7: "Final Riddle" - Identifies the ringleader and accomplice, solving the case

STORY PROGRESSION REQUIREMENTS:
- Each puzzle must feel like a natural next step in the investigation
- Puzzle solutions should provide concrete information that advances the plot
- Include narrative context that explains the puzzle's importance to the case
- Puzzles should reveal character motivations and story elements
- Each puzzle should feel like a breakthrough moment in the mystery
- Include story elements that make players emotionally invested in solving each puzzle
- Puzzles should build tension and suspense as the investigation unfolds
- Each puzzle should provide evidence that leads logically to the next location

REAL PUB CRAWL ROUTE EXAMPLES TO RESEARCH:
- Popular routes from travel blogs (Time Out, Lonely Planet, local tourism sites)
- Established pub crawl companies and their documented routes
- Local newspaper articles about pub crawls and bar hopping
- Tourism board recommendations for pub crawls
- University pub crawl routes and student recommendations
- Historic pub trails and heritage pub routes
- Food and drink tour company routes
- Local bar association or pub guide recommendations

🚨 PUZZLE GENERATION REQUIREMENTS 🚨:
- You MUST use at least 5 different puzzle types across the entire game
- No single puzzle type can exceed 30% of total puzzles
- Include puzzles from all categories: reasoning (logic/deduction), creative (wordplay/pattern), analytical (math/observation), contextual (local/cipher)
- Vary difficulty levels within each puzzle type
- Include at least one multi-step puzzle and one hybrid puzzle
- Ensure puzzles build on each other and reveal story elements progressively

🚨 CRITICAL PUZZLE CONTENT REQUIREMENTS 🚨:
- Each puzzle MUST have COMPLETE, SOLVABLE content - not just concepts or ideas
- The "content" field must contain the actual puzzle data, questions, or materials needed to solve it
- The "answer" field must be the EXACT, SPECIFIC solution (not just "the answer" or "solution")
- The "clues" field must contain 3 PROGRESSIVE hints that actually help solve the puzzle
- Each puzzle must be immediately playable without additional setup or explanation
- Puzzles must be specific to the pub location and story context
- Include actual data, numbers, text, or materials that players can work with

🚨 ENHANCED PUZZLE QUALITY REQUIREMENTS 🚨:
- Each puzzle MUST include a "category" field (reasoning, creative, analytical, contextual, physical, social, technological)
- Each puzzle MUST include a "mechanics" array with at least one advanced mechanic
- Each puzzle MUST include a "localContext" field explaining how it relates to the pub/city
- Each puzzle MUST include "materials" array if props are needed
- Each puzzle MUST include "instructions" field for special requirements
- Each puzzle MUST include quality flags: requiresTeamwork, requiresPhysicalInteraction, requiresLocalKnowledge, isMultiStep
- Puzzles must have a quality score of 8.0+ (comprehensive, creative, solvable, locally relevant)
- Include environmental integration - use actual pub features, local history, or area characteristics
- Ensure progressive difficulty - early puzzles easier, later puzzles more complex
- Include at least one collaborative puzzle requiring team coordination
- Include at least one environmental puzzle using the pub's actual features

🚨 CRITICAL NARRATIVE INTEGRATION REQUIREMENTS 🚨:
- Each puzzle MUST advance the main storyline and reveal crucial plot information
- Puzzles must feel like natural parts of the investigation, not random challenges
- Each puzzle should provide evidence, clues, or information that leads to the next location
- Puzzle solutions should unlock story progression and character development
- Include narrative context that explains WHY this puzzle exists in the story
- Puzzles should reveal character motivations, plot twists, or story revelations
- Each puzzle should feel like a genuine part of the mystery investigation
- Include story elements that make players care about solving each puzzle
- Puzzles should build tension and suspense as the mystery unfolds
- Each puzzle should feel like a breakthrough moment in the investigation

PUZZLE CONTENT EXAMPLES BY TYPE:

LOGIC PUZZLE EXAMPLE:
{
  "title": "The Bartender's Alibi",
  "narrative": "The bartender claims he was cleaning glasses when the incident occurred. Three witnesses give conflicting statements about what they saw. This puzzle is crucial - if we can identify the truthful witness, we'll know who to trust for the next lead in our investigation.",
  "type": "logic",
  "category": "reasoning",
  "mechanics": ["progressive", "cross-reference"],
  "content": "Witness A: 'I saw the bartender cleaning glasses at 8:30 PM, but he was using a red cloth, not blue.' Witness B: 'The bartender was definitely cleaning glasses at 8:30 PM with a blue cloth, and he was humming a tune.' Witness C: 'I didn't see the bartender cleaning glasses at 8:30 PM, but I heard humming from behind the bar.' The pub's security log shows: '8:30 PM - Bartender on duty, cleaning supplies: 1 red cloth, 1 blue cloth, 1 yellow cloth.' If only one witness is telling the complete truth, who is it?",
  "answer": "Witness B",
  "clues": [
    "Consider what each witness claims about the cloth color and compare it to the available supplies.",
    "Think about what would be impossible if someone was lying about seeing the bartender.",
    "If someone is telling the complete truth, their statement must be consistent with the available evidence."
  ],
  "difficulty": 3,
  "order": 1,
  "localContext": "This puzzle uses the pub's actual cleaning supplies and witness testimony to determine credibility. Solving this reveals which witness can be trusted for crucial information about the suspect's movements.",
  "materials": ["Security log printout", "Witness statements"],
  "instructions": "Read all statements carefully and cross-reference with the security log evidence.",
  "requiresTeamwork": false,
  "requiresPhysicalInteraction": false,
  "requiresLocalKnowledge": false,
  "isMultiStep": false
}

CIPHER PUZZLE EXAMPLE:
{
  "title": "The Hidden Message",
  "narrative": "A cryptic message was found written on the back of a historical menu from 1923. The pub's founder was known to use simple substitution ciphers.",
  "type": "cipher",
  "content": "Encrypted message: 'QEB NRFZH YOLTK CLU GRJMP LSBO QEB IXWV ALD' The pub was founded in 1923. The founder's favorite saying was 'The early bird catches the worm.' Use this information to decode the message.",
  "answer": "THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG",
  "clues": [
    "The founder's favorite saying might give you a clue about the cipher key.",
    "This is a Caesar cipher - try shifting the alphabet by different amounts.",
    "The year 1923 might be significant for determining the shift value."
  ],
  "difficulty": 4,
  "order": 2,
  "localContext": "This puzzle connects to the pub's founding year and the founder's personal preferences."
}

MATH PUZZLE EXAMPLE:
{
  "title": "The Delivery Schedule",
  "narrative": "The pub receives deliveries on specific days. The delivery schedule holds the key to understanding when the incident occurred.",
  "type": "math",
  "content": "The pub receives beer deliveries every 3 days, wine deliveries every 5 days, and food deliveries every 7 days. All three deliveries occurred on the same day 15 days ago. Today is Tuesday. What day of the week did all three deliveries last occur together?",
  "answer": "Thursday",
  "clues": [
    "Find the Least Common Multiple (LCM) of 3, 5, and 7 to determine the cycle length.",
    "Calculate how many complete cycles have passed in 15 days.",
    "Work backwards from Tuesday to find the day when all deliveries last coincided."
  ],
  "difficulty": 3,
  "order": 3,
  "localContext": "This puzzle uses the pub's actual delivery schedule to establish a timeline."
}

WORDPLAY PUZZLE EXAMPLE:
{
  "title": "The Anagram Clue",
  "narrative": "A suspect's name was found written as an anagram on a napkin. The letters spell out the location of hidden evidence.",
  "type": "wordplay",
  "content": "The letters 'R E T A W L O O F' were found written on a napkin. Rearrange these letters to form a two-word phrase that describes where evidence might be hidden. The phrase relates to a common feature found in this type of establishment.",
  "answer": "WATER FOOL (or 'FOOL WATER' - both are valid anagrams)",
  "clues": [
    "Look for common words that might be found in a pub setting.",
    "Think about what 'water' might refer to in a drinking establishment.",
    "Consider that 'fool' might be a playful term for something else."
  ],
  "difficulty": 2,
  "order": 4,
  "localContext": "This puzzle uses pub terminology and wordplay to reveal a hiding place."
}

OBSERVATION PUZZLE EXAMPLE:
{
  "title": "The Architectural Clue",
  "narrative": "The pub's architecture holds a hidden message. Count the specific features to reveal a code.",
  "type": "observation",
  "content": "Look around the pub and count: 1) The number of wooden beams visible in the ceiling, 2) The number of brass fixtures (light fixtures, door handles, etc.), 3) The number of windows facing the street. Add these three numbers together. The result is a two-digit number. What is it?",
  "answer": "47",
  "clues": [
    "Start by counting the most obvious features - the wooden ceiling beams.",
    "Look for all brass-colored metal fixtures, not just the most prominent ones.",
    "Count only the windows that face outward toward the street, not internal windows."
  ],
  "difficulty": 2,
  "order": 5,
  "localContext": "This puzzle requires players to actually observe and count real architectural features in the pub."
}

DEDUCTION PUZZLE EXAMPLE:
{
  "title": "The Timeline Mystery",
  "narrative": "Three people entered the pub at different times. Their alibis don't match the security footage. Determine who is lying.",
  "type": "deduction",
  "content": "Security log shows: 7:45 PM - Person A enters, 8:15 PM - Person B enters, 8:30 PM - Person C enters. Person A claims: 'I was here for 45 minutes and left before Person B arrived.' Person B claims: 'I arrived at 8:15 PM and Person A was still here when I left at 9:00 PM.' Person C claims: 'I arrived at 8:30 PM and both Person A and Person B were still here.' The security log shows Person A left at 8:20 PM. Who is lying?",
  "answer": "Person B",
  "clues": [
    "Compare each person's claims with the security log timestamps.",
    "If Person A left at 8:20 PM, could Person B have seen them when leaving at 9:00 PM?",
    "Check if Person B's claim about Person A being there when they left contradicts the security log."
  ],
  "difficulty": 4,
  "order": 6,
  "localContext": "This puzzle uses the pub's actual security system and timing to determine credibility."
}

LOCAL KNOWLEDGE PUZZLE EXAMPLE:
{
  "title": "The Historical Connection",
  "narrative": "The pub's history holds the key to understanding the current mystery. A famous event occurred nearby that's relevant to the case.",
  "type": "local",
  "content": "In 1963, a famous incident occurred at [CITY]'s [SPECIFIC LOCATION NEAR PUB]. The incident involved [SPECIFIC HISTORICAL DETAILS]. The pub was established in [YEAR] and was frequented by [SPECIFIC HISTORICAL FIGURES]. The current mystery involves someone who claims to be related to one of these historical figures. Based on the historical records, what was the name of the person who [SPECIFIC HISTORICAL ACTION]?",
  "answer": "[SPECIFIC HISTORICAL NAME]",
  "clues": [
    "Research the famous 1963 incident that occurred near this pub location.",
    "Consider who would have been involved in this type of historical event.",
    "Think about what name would be associated with the specific action mentioned."
  ],
  "difficulty": 3,
  "order": 7,
  "localContext": "This puzzle connects the current mystery to actual historical events that occurred near the pub."
}

PATTERN PUZZLE EXAMPLE:
{
  "title": "The Sequence Code",
  "narrative": "A series of numbers was found written on the pub's historical ledger. The pattern reveals a hidden message.",
  "type": "pattern",
  "content": "The following sequence was found: 2, 5, 11, 23, 47, 95, ?. Each number in the sequence follows a specific mathematical pattern. What is the next number in the sequence? Use this number to decode the message: 'The answer is hidden in the [NUMBER]th word of the pub's motto.' The pub's motto is 'Quality, Tradition, Excellence, Heritage, Community, Service, Integrity, Innovation.'",
  "answer": "Heritage",
  "clues": [
    "Look at the difference between consecutive numbers to find the pattern.",
    "The pattern involves doubling and adding 1: 2×2+1=5, 5×2+1=11, etc.",
    "Apply the pattern to find the next number, then count to that word in the motto."
  ],
  "difficulty": 4,
  "order": 8,
  "localContext": "This puzzle uses the pub's actual motto and a mathematical sequence to reveal hidden information."
}

PHYSICAL PUZZLE EXAMPLE:
{
  "title": "The Broken Lock",
  "narrative": "A broken lock was found in the pub's storage room. The pieces need to be reassembled to reveal a combination.",
  "type": "physical",
  "category": "physical",
  "mechanics": ["environmental", "collaborative"],
  "content": "The lock has 5 pieces scattered around the storage room. Each piece has a number engraved on it. Assemble the pieces in the correct order to form a 3-digit combination. The combination opens the safe containing the next clue.",
  "answer": "247",
  "clues": [
    "Look for pieces with numbers that form a logical sequence.",
    "Consider the physical shape of each piece - they should fit together like a puzzle.",
    "The combination might relate to important dates in the pub's history."
  ],
  "difficulty": 3,
  "order": 9,
  "localContext": "This puzzle uses the pub's actual storage room and safe to create a physical challenge.",
  "materials": ["Lock pieces", "Safe", "Assembly instructions"],
  "instructions": "Physically assemble the lock pieces to reveal the combination.",
  "requiresPhysicalInteraction": true,
  "requiresTeamwork": true,
  "isMultiStep": false
}

SOCIAL PUZZLE EXAMPLE:
{
  "title": "The Witness Interview",
  "narrative": "A regular customer claims to have seen something important. You need to ask the right questions to get the truth.",
  "type": "social",
  "category": "social",
  "mechanics": ["collaborative", "progressive"],
  "content": "Interview the witness using these questions: 'What time did you arrive?', 'Who else was here?', 'What did you see?' The witness will only answer truthfully if you ask the questions in the correct order and use the right approach. What is the correct sequence of questions?",
  "answer": "Arrival time first, then who was here, then what they saw",
  "clues": [
    "Consider what information you need most urgently first.",
    "Build rapport before asking sensitive questions.",
    "The witness responds better to open-ended questions than yes/no questions."
  ],
  "difficulty": 3,
  "order": 10,
  "localContext": "This puzzle involves interacting with actual pub staff or regular customers.",
  "materials": ["Interview questions list", "Witness character card"],
  "instructions": "Conduct a structured interview to gather information from the witness.",
  "requiresTeamwork": true,
  "requiresPhysicalInteraction": false,
  "isMultiStep": false
}

TECHNOLOGY PUZZLE EXAMPLE:
{
  "title": "The QR Code Mystery",
  "narrative": "A QR code was found hidden in the pub's Wi-Fi network name. Scanning it reveals a website with the next clue.",
  "type": "technology",
  "category": "technological",
  "mechanics": ["multi-step", "progressive"],
  "content": "The pub's Wi-Fi network is named 'MysteryPub_2024'. Use this information to generate a QR code. Scan the QR code to access a website. The website contains a puzzle that must be solved to get the next clue.",
  "answer": "The website reveals the next pub location",
  "clues": [
    "Use a QR code generator to create a code from the Wi-Fi name.",
    "Scan the generated QR code to access the hidden website.",
    "Solve the puzzle on the website to reveal the next clue."
  ],
  "difficulty": 4,
  "order": 11,
  "localContext": "This puzzle uses the pub's actual Wi-Fi network and modern technology.",
  "materials": ["QR code generator", "Smartphone", "Website access"],
  "instructions": "Use technology to decode the hidden message and solve the online puzzle.",
  "requiresTeamwork": false,
  "requiresPhysicalInteraction": false,
  "isMultiStep": true
}

🚨 FINAL PUZZLE VALIDATION CHECKLIST 🚨:
Before finalizing your response, verify each puzzle has:
✓ Complete, solvable content with specific data/numbers/text
✓ Exact, specific answer (not generic responses)
✓ 3 progressive clues that actually help solve the puzzle
✓ Clear connection to the pub location and story
✓ Appropriate difficulty level for the puzzle type
✓ No placeholder text or incomplete information
✓ Immediate playability without additional setup
✓ Category field (reasoning, creative, analytical, contextual, physical, social, technological)
✓ Mechanics array with at least one advanced mechanic
✓ LocalContext field explaining pub/city relevance
✓ Materials array if props are needed
✓ Instructions field for special requirements
✓ Quality flags (requiresTeamwork, requiresPhysicalInteraction, requiresLocalKnowledge, isMultiStep)
✓ Quality score of 8.0+ (comprehensive, creative, solvable, locally relevant)
✓ Environmental integration using actual pub features
✓ Progressive difficulty appropriate for puzzle order
✓ NARRATIVE INTEGRATION: Puzzle advances the main storyline and reveals crucial plot information
✓ STORY CONTEXT: Narrative explains WHY this puzzle exists and its importance to the case
✓ PLOT PROGRESSION: Puzzle solution provides evidence that leads to the next location
✓ CHARACTER DEVELOPMENT: Puzzle reveals character motivations or story elements
✓ EMOTIONAL STAKES: Puzzle makes players care about solving it for story reasons
✓ INVESTIGATION FLOW: Puzzle feels like a natural next step in the mystery investigation

🚨🚨🚨 CRITICAL JSON FORMAT REQUIREMENT 🚨🚨🚨
You MUST respond with ONLY valid JSON. Do NOT include:
- Any explanatory text before or after the JSON
- Markdown code blocks (backticks with json or plain backticks)
- Any comments or notes
- Any additional formatting

Start your response with { and end with }. That's it.

🚨 REQUIRED JSON STRUCTURE TEMPLATE 🚨:
{
  "story": {
    "title": "Your Game Title",
    "intro": {
      "title": "Welcome Title",
      "content": "Introduction story and setup",
      "mapsLink": "Google Maps link to first pub"
    },
    "resolution": {
      "title": "Resolution Title", 
      "content": "Final resolution and congratulations"
    },
    "characterTypes": ["detective", "witness", "suspect"]
  },
  "locations": [
    {
      "order": 1,
      "placeholderName": "{PUB_1}",
      "actualName": "Real Pub Name",
      "venueType": "traditional-pub",
      "narrative": "Story context for this pub",
      "transitionText": "Text leading to next pub",
      "mapsLink": "Google Maps link",
      "walkingTime": "5-10 minutes",
      "areaDescription": "Description of the area"
    }
  ],
  "puzzles": [
    {
      "title": "Puzzle Title",
      "narrative": "Story context for this puzzle",
      "type": "logic",
      "category": "reasoning",
      "mechanics": ["progressive"],
      "content": "The actual puzzle content",
      "answer": "The correct answer",
      "clues": ["Clue 1", "Clue 2", "Clue 3"],
      "difficulty": 3,
      "order": 1,
      "localContext": "How this relates to the pub/city",
      "materials": ["Material 1", "Material 2"],
      "instructions": "Special instructions",
      "requiresTeamwork": false,
      "requiresPhysicalInteraction": false,
      "requiresLocalKnowledge": false,
      "isMultiStep": false
    }
  ]
}

Return ONLY the JSON object in the following format:

🚨 ABSOLUTE REQUIREMENTS FOR PUB DATA 🚨:
- Do NOT use placeholder text like "Another pub in..." or "needs research"
- Do NOT use generic names like "Pub 1", "Pub 2", etc.
- You MUST provide REAL pub names that actually exist
- You MUST provide complete information for EVERY pub
- If you cannot find enough real pubs in the specified area, use fewer pubs
- Every pub must have a real name, real venue type, and real details

🚨🚨🚨 CRITICAL COUNT REQUIREMENTS - NON-NEGOTIABLE 🚨🚨🚨:
- You MUST create EXACTLY ${request.pubCount} locations in the "locations" array
- Each location MUST have EXACTLY ${request.puzzlesPerPub} puzzles assigned to it
- The total number of puzzles in the "puzzles" array MUST be EXACTLY ${request.pubCount * request.puzzlesPerPub}
- Do NOT create more or fewer locations than ${request.pubCount}
- Do NOT create more or fewer puzzles than ${request.pubCount * request.puzzlesPerPub}
- Each puzzle MUST have an "order" field that corresponds to its location (1-${request.pubCount})
- FAILURE TO COMPLY WITH THESE EXACT COUNTS WILL RESULT IN AN INVALID RESPONSE

🚨 ROUTE VALIDATION REQUIREMENTS 🚨:
- Pubs MUST be within reasonable walking distance (5-15 minutes between each pub)
- Total route distance should be 1-3 miles maximum for a comfortable pub crawl
- Pubs should follow a logical, walkable route (not scattered across the city)
- Consider real-world factors: busy roads, pedestrian access, safety
- Provide accurate walking times between pubs (5-15 minutes each)
- Ensure the route makes sense for a pub crawl experience
- Include area descriptions that help verify the route is walkable

{
  "story": {
    "title": "Game Title",
    "intro": {
      "title": "Welcome Title",
      "content": "Introduction story and setup",
      "mapsLink": "Google Maps link to first pub"
    },
    "resolution": {
      "title": "Resolution Title", 
      "content": "Final resolution and congratulations"
    },
    "characterTypes": ["detective", "witness", "suspect"]
  },
  "locations": [
    {
      "order": 1,
      "placeholderName": "{PUB_1}",
      "actualName": "[RESEARCH REAL PUB NAME IN SPECIFIED AREA]",
      "venueType": "traditional-pub",
      "narrative": "Story context for this pub${request.cityArea ? ` - MUST mention ${request.cityArea}` : ''}. Use {PUB_1} placeholder for pub name in story text.",
      "transitionText": "Story bridge to next location",
      "mapsLink": "https://maps.google.com/?q=[RESEARCHED+PUB+NAME]+${request.city}",
      "walkingTime": "5-10 minutes to next pub",
      "areaDescription": "Brief description of this area/neighborhood${request.cityArea ? ` - MUST mention ${request.cityArea}` : ''}",
      "routeSource": "Source of this pub crawl route (e.g., 'Time Out Manchester', 'Local tourism board', 'Established pub crawl company')"
    }
  ],
  "puzzles": [
    {
      "title": "Specific Puzzle Title",
      "narrative": "Detailed puzzle setup and context that connects to the story and pub location. Use {PUB_1} placeholder for pub name.",
      "type": "logic|observation|cipher|deduction|local|wordplay|math|pattern",
      "content": "COMPLETE PUZZLE DATA: Include all necessary information, questions, data, or materials needed to solve the puzzle. This must be immediately solvable without additional setup. Include specific numbers, text, witness statements, or other concrete data.",
      "answer": "EXACT SOLUTION: The precise, specific answer that solves the puzzle (not just 'the answer' or 'solution')",
      "clues": [
        "Progressive hint 1 (subtle but helpful)",
        "Progressive hint 2 (more direct guidance)", 
        "Progressive hint 3 (very clear solution path)"
      ],
      "difficulty": 1-5,
      "order": 1,
      "localContext": "How this puzzle specifically relates to ${request.city} and this pub location"
    }
  ]
}

ADVANCED STORY REQUIREMENTS:
- Create a COMPELLING MYSTERY with clear stakes, emotional investment, and meaningful consequences
- Develop RICH CHARACTERS with distinct personalities, motivations, secrets, and relationships
- Build TENSION PROGRESSION: each location should escalate the mystery and reveal new layers
- Use AUTHENTIC LOCAL KNOWLEDGE about ${request.city} - real history, landmarks, culture, geography
- Include SPECIFIC LOCAL REFERENCES that players can research, visit, or recognize
- Create MEMORABLE SITUATIONS and dramatic moments that players will remember
- Build SUSPENSE and EXCITEMENT throughout with cliffhangers and revelations
- Ensure each location ADVANCES THE PLOT meaningfully - no filler content

🚨 PLACEHOLDER USAGE REQUIREMENTS 🚨:
- In ALL narrative text (intro, location narratives, puzzle narratives, transition text, resolution), use {PUB_1}, {PUB_2}, etc. placeholders instead of actual pub names
- This allows the system to automatically substitute the correct pub names from the database
- Example: "Your investigation begins at {PUB_1}, a pub nestled within [AREA] Central Station" instead of using any specific pub names
- Use placeholders in puzzle content, clues, and all story text that mentions pub names
- The system will automatically replace these with the actual pub names when displaying to users

ADVANCED PUZZLE REQUIREMENTS:
- Each puzzle must be INTRINSICALLY CONNECTED to the story - not random challenges
- Puzzles should REVEAL NEW INFORMATION about the mystery, characters, or plot
- Create PROGRESSIVE DIFFICULTY with increasing complexity and sophistication
- Ensure UNIQUE PUZZLE TYPES across all locations - no repetition
- Include MULTIPLE LAYERS of puzzle solving (observation + deduction + local knowledge)
- Make answers SPECIFIC and UNAMBIGUOUS with clear validation criteria
- Provide 3 PROGRESSIVE CLUES that guide without giving away the solution
- Connect puzzles to LOCAL KNOWLEDGE and story context whenever possible
- Design puzzles that encourage TEAMWORK and DISCUSSION among players
- Include puzzles that require DIFFERENT COGNITIVE SKILLS (visual, logical, creative, analytical)

QUALITY STANDARDS:
- Story should be engaging enough to read as a standalone mystery
- Puzzles should be challenging but fair - solvable with effort and teamwork
- Everything must fit together cohesively with no plot holes or inconsistencies
- Use the city name and local landmarks authentically and meaningfully
- Create an experience that players will want to replay and recommend to others

${!barCrawlData ? `FINAL CRITICAL INSTRUCTION: You MUST use REAL, ESTABLISHED pub crawl routes from online sources, travel guides, and local recommendations. Do NOT create fictional routes or pubs. Research actual pub crawl routes that are documented and popular in the specified area. This is essential for creating an authentic and practical experience.` : ''}

${!barCrawlData && request.cityArea ? `🚨🚨🚨 AREA-SPECIFIC REQUIREMENT: RESEARCH PUBS IN ${request.cityArea.toUpperCase()}, ${request.city.toUpperCase()} 🚨🚨🚨

MANDATORY RESEARCH STEPS:
1. Use your knowledge to find REAL, ESTABLISHED pubs that are actually located in ${request.cityArea}
2. Research documented pub crawl routes that are specific to ${request.cityArea}
3. Look for pubs that are part of known walking routes in ${request.cityArea}
4. Verify each pub is genuinely in ${request.cityArea}, not in other areas
5. Use specific, unique pub names that reflect their actual location in ${request.cityArea}

RESEARCH FOCUS:
- Find pubs that are well-known landmarks or popular spots in ${request.cityArea}
- Look for pubs that are part of local pub crawl routes in ${request.cityArea}
- Choose pubs that have local significance or are associated with ${request.cityArea}
- Avoid using generic pub names that could be found in any city

REQUIRED VERIFICATION:
- Each pub must be verifiably located in ${request.cityArea}
- Each pub must be part of a real, walkable route within ${request.cityArea}
- Each pub must have a name that reflects its local context in ${request.cityArea}
- If you cannot find enough area-specific pubs in ${request.cityArea}, use fewer pubs rather than generic fallbacks

FAILURE TO RESEARCH AREA-SPECIFIC PUBS IN ${request.cityArea} WILL RESULT IN REJECTION.` : ''}

🚨🚨🚨 FINAL VERIFICATION CHECKLIST 🚨🚨🚨:
Before submitting your response, verify:
- You have created EXACTLY ${request.pubCount} locations
- You have created EXACTLY ${request.pubCount * request.puzzlesPerPub} total puzzles
- Each location has EXACTLY ${request.puzzlesPerPub} puzzles assigned to it
- All puzzles have correct "order" values (1-${request.pubCount})
- The JSON structure is valid and complete
- ALL pub names are real, established pubs in the specified area
- ALL pubs are verifiably located in the specified area
- ALL pubs are part of documented pub crawl routes in the specified area
- NO generic pub names that could be found in any city
- NO fictional or made-up pub names

FAILURE TO MEET THESE EXACT REQUIREMENTS WILL RESULT IN REJECTION.
    `.trim()
  }

  private parseAIResponse(content: string, request?: AIGenerationRequest): AIGenerationResponse {
    try {
      console.log('Raw AI response content:', content)
      
      // Try multiple approaches to extract JSON
      let jsonString = ''
      
      // First, try to find JSON between ```json and ``` markers
      const jsonBlockMatch = content.match(/```json\s*([\s\S]*?)\s*```/)
      if (jsonBlockMatch) {
        jsonString = jsonBlockMatch[1].trim()
        console.log('Found JSON in code block:', jsonString)
      } else {
        // Try to find JSON object in the response
        const jsonMatch = content.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          jsonString = jsonMatch[0]
          console.log('Found JSON object:', jsonString)
        } else {
          // Try to find JSON array or object at the start
          const trimmedContent = content.trim()
          if (trimmedContent.startsWith('{') || trimmedContent.startsWith('[')) {
            jsonString = trimmedContent
            console.log('Using trimmed content as JSON:', jsonString)
          }
        }
      }
      
      if (!jsonString) {
        console.error('No JSON found in AI response')
        console.error('Full content:', content)
        throw new Error('No JSON found in AI response')
      }

      let parsed
      try {
        parsed = JSON.parse(jsonString)
        console.log('Successfully parsed JSON:', parsed)
      } catch (parseError) {
        console.error('JSON parse error:', parseError)
        console.error('Problematic JSON string:', jsonString)
        
        // Try multiple cleanup strategies
        let cleanedJson = jsonString
        
        // Strategy 1: Basic cleanup
        cleanedJson = cleanedJson
          .replace(/,\s*}/g, '}') // Remove trailing commas before }
          .replace(/,\s*]/g, ']') // Remove trailing commas before ]
          .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes around unquoted keys
          .replace(/:\s*([^",{\[\s][^",}\]\s]*)/g, ': "$1"') // Add quotes around unquoted string values
        
        try {
          parsed = JSON.parse(cleanedJson)
          console.log('Successfully parsed with basic cleanup:', parsed)
        } catch (cleanupError) {
          console.error('Basic cleanup failed, trying advanced cleanup...')
          
          // Strategy 2: Advanced cleanup
          cleanedJson = jsonString
            .replace(/```json\s*/g, '') // Remove any remaining markdown
            .replace(/```\s*/g, '') // Remove any remaining markdown
            .replace(/^[^{]*/, '') // Remove anything before first {
            .replace(/[^}]*$/, '') // Remove anything after last }
            .replace(/,\s*}/g, '}') // Remove trailing commas
            .replace(/,\s*]/g, ']') // Remove trailing commas
            .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Quote unquoted keys
            .replace(/:\s*([^",{\[\s][^",}\]\s]*?)(\s*[,}\]])/g, ': "$1"$2') // Quote unquoted values
            .replace(/\\/g, '\\\\') // Escape backslashes
            .replace(/"/g, '\\"') // Escape quotes in strings
            .replace(/\\"/g, '"') // Fix double-escaped quotes
        
          try {
            parsed = JSON.parse(cleanedJson)
            console.log('Successfully parsed with advanced cleanup:', parsed)
          } catch (advancedError) {
            console.error('Advanced cleanup also failed:', advancedError)
            console.error('Final cleaned JSON:', cleanedJson)
            
            // Strategy 3: Try to extract just the essential parts
            try {
              const storyMatch = jsonString.match(/"story"\s*:\s*\{[^}]*\}/)
              const locationsMatch = jsonString.match(/"locations"\s*:\s*\[[^\]]*\]/)
              const puzzlesMatch = jsonString.match(/"puzzles"\s*:\s*\[[^\]]*\]/)
              
              if (storyMatch && locationsMatch && puzzlesMatch) {
                const minimalJson = `{${storyMatch[0]},${locationsMatch[0]},${puzzlesMatch[0]}}`
                parsed = JSON.parse(minimalJson)
                console.log('Successfully parsed minimal JSON:', parsed)
              } else {
                throw new Error('Could not extract essential JSON parts')
              }
            } catch (minimalError) {
              console.error('Minimal extraction failed:', minimalError)
              throw new Error(`JSON parsing failed after all cleanup attempts: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`)
            }
          }
        }
      }
      
      // Validate the response structure
      if (!parsed.story || !parsed.locations || !parsed.puzzles) {
        console.error('Invalid response structure:', {
          hasStory: !!parsed.story,
          hasLocations: !!parsed.locations,
          hasPuzzles: !!parsed.puzzles,
          parsed
        })
        throw new Error('Invalid response structure from AI - missing required fields')
      }

      // Validate exact counts if request parameters are available
      if (request) {
        const actualLocationCount = parsed.locations.length
        const actualPuzzleCount = parsed.puzzles.length
        const expectedLocationCount = request.pubCount
        const expectedPuzzleCount = request.pubCount * request.puzzlesPerPub

        console.log('Count validation:', {
          expectedLocations: expectedLocationCount,
          actualLocations: actualLocationCount,
          expectedPuzzles: expectedPuzzleCount,
          actualPuzzles: actualPuzzleCount
        })

        if (actualLocationCount !== expectedLocationCount) {
          console.error(`Location count mismatch: expected ${expectedLocationCount}, got ${actualLocationCount}`)
          throw new Error(`AI generated ${actualLocationCount} locations but ${expectedLocationCount} were requested. Please try again.`)
        }

        if (actualPuzzleCount !== expectedPuzzleCount) {
          console.error(`Puzzle count mismatch: expected ${expectedPuzzleCount}, got ${actualPuzzleCount}`)
          throw new Error(`AI generated ${actualPuzzleCount} puzzles but ${expectedPuzzleCount} were requested. Please try again.`)
        }

        // Validate that puzzles are distributed correctly across locations
        const puzzlesPerLocation = new Map<number, number>()
        parsed.puzzles.forEach((puzzle: any) => {
          const order = puzzle.order
          if (order >= 1 && order <= expectedLocationCount) {
            puzzlesPerLocation.set(order, (puzzlesPerLocation.get(order) || 0) + 1)
          }
        })

        for (let i = 1; i <= expectedLocationCount; i++) {
          const puzzleCount = puzzlesPerLocation.get(i) || 0
          if (puzzleCount !== request.puzzlesPerPub) {
            console.error(`Location ${i} has ${puzzleCount} puzzles but ${request.puzzlesPerPub} were requested`)
            throw new Error(`Location ${i} has ${puzzleCount} puzzles but ${request.puzzlesPerPub} were requested. Please try again.`)
          }
        }

        console.log('✅ All count validations passed')
      }

      // Validate area compliance if cityArea was specified (lenient check)
      if (request && request.cityArea && parsed.locations) {
        console.log('Validating area compliance for:', request.cityArea)
        const areaName = request.cityArea.toLowerCase()
        let areaMentioned = false
        
        // Check if the area is mentioned anywhere in the response
        const responseText = JSON.stringify(parsed).toLowerCase()
        areaMentioned = responseText.includes(areaName)
        
        console.log('Area compliance check:', {
          areaName,
          areaMentioned,
          responsePreview: responseText.substring(0, 500)
        })
        
        // Only warn if area is completely missing, don't reject the response
        if (!areaMentioned) {
          console.warn('Warning: Area not mentioned in AI response, but allowing it through')
        } else {
          console.log('✓ Area compliance validated')
        }
      }

      // Validate that pub names are area-specific and not generic fallbacks
      if (parsed.locations && request?.cityArea) {
        const actualPubNames = parsed.locations.map((loc: any) => loc.actualName?.toLowerCase() || '').filter(Boolean)
        
        // Check for placeholder text in pub names
        const placeholderPatterns = [
          'research real pub',
          'researched pub name',
          'another pub in',
          'needs research',
          'to be determined',
          'tbd'
        ]
        
        const hasPlaceholders = actualPubNames.some((pubName: string) => 
          placeholderPatterns.some(pattern => pubName.includes(pattern))
        )
        
        if (hasPlaceholders) {
          console.warn('Warning: AI response contains placeholder text in pub names, but allowing it through')
        } else {
          console.log('✓ No placeholder text detected in pub names')
        }
        
        // Log the pub names for verification
        console.log('Generated pub names:', actualPubNames)
        console.log('Target area:', request.cityArea)
        
        // Note: We're not rejecting specific pub names anymore, just encouraging area-specific research
        console.log('✓ Pub names generated - please verify they are appropriate for the specified area')
      }

      return parsed as AIGenerationResponse
    } catch (error: any) {
      console.error('Error parsing AI response:', error)
      console.error('Raw content length:', content.length)
      console.error('Raw content preview:', content.substring(0, 500))
      console.error('Error type:', error.name)
      console.error('Error message:', error.message)
      
      // Provide more specific error messages
      if (error.message.includes('JSON')) {
        throw new Error(`AI response format error: The AI did not return valid JSON. Please try again.`)
      } else if (error.message.includes('structure')) {
        throw new Error(`AI response structure error: Missing required fields. Please try again.`)
      } else {
        throw new Error(`Failed to parse AI response: ${error.message}`)
      }
    }
  }
}

export function createAIService(provider: AIProvider): AIService {
  const config: AIConfig = {
    provider,
    apiKey: getAPIKey(provider),
  }

  // Set default models for each provider
  if (!config.model) {
    switch (provider) {
      case 'openai':
        config.model = 'gpt-3.5-turbo'
        break
      case 'anthropic':
        config.model = 'claude-3-sonnet-20240229'
        break
      case 'google':
        config.model = 'gemini-1.5-flash'
        break
    }
  }

  return new AIService(config)
}

function getAPIKey(provider: AIProvider): string {
  let apiKey: string
  switch (provider) {
    case 'openai':
      apiKey = process.env.OPENAI_API_KEY || ''
      break
    case 'anthropic':
      apiKey = process.env.ANTHROPIC_API_KEY || ''
      break
    case 'google':
      apiKey = process.env.GOOGLE_AI_API_KEY || ''
      break
    default:
      throw new Error(`Unknown provider: ${provider}`)
  }
  
  if (!apiKey) {
    throw new Error(`API key not found for provider: ${provider}. Please check your environment variables.`)
  }
  
  return apiKey
}
