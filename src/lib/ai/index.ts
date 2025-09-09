import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { AIGenerationRequest, AIGenerationResponse } from '@/types'

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

    const prompt = this.buildGameGenerationPrompt(request)
    
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

    return this.parseAIResponse(content)
  }

  private async generateWithAnthropic(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const anthropic = new Anthropic({
      apiKey: this.config.apiKey,
    })

    const prompt = this.buildGameGenerationPrompt(request)
    
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

    return this.parseAIResponse(content.text)
  }

  private async generateWithGoogle(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    const genAI = new GoogleGenerativeAI(this.config.apiKey)
    
    // Use a more recent and available model
    const modelName = this.config.model || 'gemini-1.5-flash'
    console.log('Using Google model:', modelName)
    
    const model = genAI.getGenerativeModel({ 
      model: modelName
    })

    const prompt = this.buildGameGenerationPrompt(request)
    console.log('=== AI REQUEST DEBUG ===')
    console.log('Request object:', JSON.stringify(request, null, 2))
    console.log('City Area from request:', request.cityArea)
    console.log('City Area type:', typeof request.cityArea)
    console.log('City Area length:', request.cityArea?.length)
    console.log('Full prompt preview:', prompt.substring(0, 1000) + '...')
    console.log('=== END AI REQUEST DEBUG ===')
    
    try {
      const result = await model.generateContent(prompt)
      const response = await result.response
      const content = response.text()

      if (!content) {
        throw new Error('No content generated from Google AI')
      }

      return this.parseAIResponse(content)
    } catch (error: any) {
      console.error('Google AI generation error:', error)
      
      // If it's a parsing error, try once more with a simpler prompt
      if (error.message.includes('parse AI response')) {
        console.log('Retrying with simplified prompt...')
        try {
          const simplifiedPrompt = `Generate a pub crawl mystery game for ${request.city}${request.cityArea ? ` in the ${request.cityArea} area` : ''}. Use real, established pub crawl routes from online sources. Return ONLY valid JSON in this format:

{
  "story": {
    "title": "Game Title",
    "intro": {
      "title": "Welcome Title",
      "content": "Introduction story",
      "mapsLink": "Google Maps link"
    },
    "resolution": {
      "title": "Resolution Title", 
      "content": "Final resolution"
    },
    "characterTypes": ["detective", "witness", "suspect"]
  },
  "locations": [
    {
      "order": 1,
      "placeholderName": "{PUB_1}",
      "venueType": "traditional-pub",
      "narrative": "Story context",
      "transitionText": "Bridge to next location",
      "mapsLink": "Google Maps link",
      "walkingTime": "5-10 minutes",
      "areaDescription": "Area description"
    }
  ],
  "puzzles": [
    {
      "title": "Puzzle Title",
      "narrative": "Puzzle setup",
      "type": "logic",
      "content": "Puzzle content",
      "answer": "Correct answer",
      "clues": ["Hint 1", "Hint 2", "Hint 3"],
      "difficulty": 3,
      "order": 1,
      "localContext": "Local context"
    }
  ]
}`

          const retryResult = await model.generateContent(simplifiedPrompt)
          const retryResponse = await retryResult.response
          const retryContent = retryResponse.text()
          
          if (retryContent) {
            return this.parseAIResponse(retryContent)
          }
        } catch (retryError) {
          console.error('Retry also failed:', retryError)
        }
      }
      
      throw new Error(`Google AI generation failed: ${error.message}`)
    }
  }

  private buildGameGenerationPrompt(request: AIGenerationRequest): string {
    return `
Generate a complete pub crawl mystery game with the following specifications:

Theme: ${request.theme}
City: ${request.city}
${request.cityArea ? `City Area/Neighborhood: ${request.cityArea}` : ''}
Difficulty: ${request.difficulty}
Number of pubs: ${request.pubCount}
Puzzles per pub: ${request.puzzlesPerPub}
Estimated duration: ${request.estimatedDuration} minutes

${request.customInstructions ? `Custom instructions: ${request.customInstructions}` : ''}

${request.cityArea ? `🚨 CRITICAL AREA REQUIREMENT 🚨
You MUST create a pub crawl route that stays EXCLUSIVELY within the ${request.cityArea} area of ${request.city}. 
- Do NOT select pubs from other neighborhoods or areas
- Do NOT use pubs from city center, downtown, or other districts
- ALL pubs must be located specifically in ${request.cityArea}
- If you cannot find enough pubs in ${request.cityArea}, reduce the number of pubs rather than using pubs from other areas
- This is a HARD REQUIREMENT that cannot be ignored` : ''}

CRITICAL: Use REAL, ESTABLISHED pub crawl routes from online sources, travel guides, and local recommendations. Do NOT create fictional routes or pubs. Research actual pub crawl routes that are documented and popular in the specified area.

CRITICAL STORY & PUZZLE REQUIREMENTS:

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

ADVANCED PUZZLE TYPES TO USE:
- logic: Complex logical reasoning, syllogisms, conditional statements, logical sequences
- observation: Environmental storytelling, hidden details, visual pattern recognition, spatial reasoning
- cipher: Multi-layer encryption, historical ciphers, substitution codes, frequency analysis
- deduction: Evidence correlation, timeline reconstruction, motive analysis, alibi verification
- local: Deep local knowledge, historical events, architectural details, cultural references
- wordplay: Sophisticated anagrams, cryptic clues, linguistic patterns, etymology puzzles
- math: Mathematical reasoning, geometric patterns, statistical analysis, algorithmic thinking
- pattern: Complex sequence recognition, fractal patterns, recursive logic, system analysis

PUZZLE COMPLEXITY EXAMPLES:
- EASY: Simple word puzzles, basic math, obvious observations
- MEDIUM: Multi-step logic, pattern recognition, local knowledge application
- HARD: Complex ciphers, advanced deduction, sophisticated mathematical reasoning

HIGH-QUALITY PUZZLE EXAMPLES:
- A cipher puzzle where the key is hidden in the pub's historical architecture
- A logic puzzle that reveals a character's alibi through timeline reconstruction
- An observation puzzle where players must notice specific details in the pub's decor
- A local knowledge puzzle about the city's history that connects to the mystery
- A mathematical puzzle that calculates distances or times relevant to the case
- A wordplay puzzle using local dialect or historical language
- A deduction puzzle where players must cross-reference witness statements
- A pattern puzzle that reveals a hidden message in the pub's layout or design
- A local knowledge puzzle about the area's famous residents or events
- A logic puzzle involving the pub's history or previous owners

STORY EXCELLENCE EXAMPLES:
- Characters with hidden motivations that are revealed through puzzle solutions
- Plot twists that make players reconsider earlier clues and evidence
- Emotional stakes that make players care about the outcome
- Local history that becomes crucial to solving the mystery
- Red herrings that mislead but don't frustrate players
- Satisfying resolutions that tie all loose ends together

REAL PUB CRAWL ROUTE EXAMPLES TO RESEARCH:
- Popular routes from travel blogs (Time Out, Lonely Planet, local tourism sites)
- Established pub crawl companies and their documented routes
- Local newspaper articles about pub crawls and bar hopping
- Tourism board recommendations for pub crawls
- University pub crawl routes and student recommendations
- Historic pub trails and heritage pub routes
- Food and drink tour company routes
- Local bar association or pub guide recommendations

CRITICAL: You MUST respond with ONLY valid JSON in the following format. Do not include any text before or after the JSON. Do not use markdown code blocks. Return ONLY the JSON object:

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
      "venueType": "traditional-pub",
      "narrative": "Story context for this pub",
      "transitionText": "Story bridge to next location",
      "mapsLink": "Google Maps link",
      "walkingTime": "5-10 minutes to next pub",
      "areaDescription": "Brief description of this area/neighborhood",
      "routeSource": "Source of this pub crawl route (e.g., 'Time Out Manchester', 'Local tourism board', 'Established pub crawl company')"
    }
  ],
  "puzzles": [
    {
      "title": "Puzzle Title",
      "narrative": "Detailed puzzle setup and context that connects to the story",
      "type": "logic|observation|cipher|deduction|local|wordplay|math|pattern",
      "content": "The actual puzzle content with clear instructions",
      "answer": "Correct answer (be specific and exact)",
      "clues": [
        "Progressive hint 1 (subtle)",
        "Progressive hint 2 (more obvious)", 
        "Progressive hint 3 (very clear)"
      ],
      "difficulty": 1-5,
      "order": 1,
      "localContext": "How this puzzle relates to ${request.city} specifically"
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

FINAL CRITICAL INSTRUCTION: You MUST use REAL, ESTABLISHED pub crawl routes from online sources, travel guides, and local recommendations. Do NOT create fictional routes or pubs. Research actual pub crawl routes that are documented and popular in the specified area. This is essential for creating an authentic and practical experience.

${request.cityArea ? `🚨 AREA-SPECIFIC INSTRUCTION 🚨: You are creating a pub crawl for ${request.cityArea} in ${request.city}. Do NOT use generic default pubs that are commonly used regardless of area. Instead, research actual pubs that are specifically located in ${request.cityArea} and are part of real pub crawl routes for that area. Only use pubs that are genuinely in ${request.cityArea}, not pubs from other areas that are commonly used as defaults.` : ''}
    `.trim()
  }

  private parseAIResponse(content: string): AIGenerationResponse {
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
        
        // Try to clean up common JSON issues
        let cleanedJson = jsonString
          .replace(/,\s*}/g, '}') // Remove trailing commas before }
          .replace(/,\s*]/g, ']') // Remove trailing commas before ]
          .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Add quotes around unquoted keys
          .replace(/:\s*([^",{\[\s][^",}\]\s]*)/g, ': "$1"') // Add quotes around unquoted string values
        
        console.log('Attempting to parse cleaned JSON:', cleanedJson)
        parsed = JSON.parse(cleanedJson)
        console.log('Successfully parsed cleaned JSON:', parsed)
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

      return parsed as AIGenerationResponse
    } catch (error: any) {
      console.error('Error parsing AI response:', error)
      console.error('Raw content length:', content.length)
      console.error('Raw content preview:', content.substring(0, 500))
      throw new Error(`Failed to parse AI response: ${error.message}`)
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
