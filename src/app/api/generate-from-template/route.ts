import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-only'
import { createAIService } from '@/lib/ai'
import { AIGenerationRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    console.log('=== TEMPLATE-BASED GAME GENERATION START ===')
    const body = await request.json()
    console.log('Request body:', body)
    
    const { 
      templateId, 
      city, 
      cityArea, 
      provider = 'google',
      customInstructions 
    } = body

    if (!templateId || !city) {
      return NextResponse.json(
        { error: 'Template ID and city are required' },
        { status: 400 }
      )
    }

    // Get the template from database
    const supabase = await createClient()
    const { data: template, error: templateError } = await supabase
      .from('game_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (templateError || !template) {
      console.error('Template not found:', templateError)
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      )
    }

    console.log('Using template:', template.name)

    // Transform template data to match expected format
    const transformedTemplate = {
      ...template,
      characterTypes: template.character_types || [],
      puzzleTypes: template.puzzle_types || [],
      storyFramework: template.story_framework || ''
    }

    // Create AI service
    let aiService
    try {
      aiService = createAIService(provider as any)
    } catch (error: any) {
      console.error('Failed to create AI service:', error.message)
      return NextResponse.json(
        { error: `Failed to initialize AI service: ${error.message}` },
        { status: 500 }
      )
    }

    // Build generation request with template context
    const generationRequest: AIGenerationRequest = {
      theme: template.theme,
      city,
      cityArea,
      difficulty: template.difficulty,
      pubCount: 5, // Default, can be made configurable
      puzzlesPerPub: 2, // Default, can be made configurable
      estimatedDuration: 120, // Default, can be made configurable
      customInstructions: buildTemplateInstructions(transformedTemplate, customInstructions)
    }

    console.log('Generating game from template...')
    const response = await aiService.generateGameContent(generationRequest)

    console.log('=== TEMPLATE-BASED GAME GENERATION SUCCESS ===')
    return NextResponse.json({
      ...response,
      template: {
        id: transformedTemplate.id,
        name: transformedTemplate.name,
        description: transformedTemplate.description
      }
    })
  } catch (error: any) {
    console.error('=== TEMPLATE-BASED GAME GENERATION ERROR ===')
    console.error('Error generating game from template:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate game from template' },
      { status: 500 }
    )
  }
}

function buildTemplateInstructions(template: any, customInstructions?: string): string {
  const instructions = `TEMPLATE-BASED GENERATION:
  
Template: ${template.name}
Theme: ${template.theme}
Story Framework: ${template.storyFramework}
Character Types: ${template.characterTypes.join(', ')}
Puzzle Types: ${template.puzzleTypes.join(', ')}
Difficulty: ${template.difficulty}

CRITICAL INSTRUCTIONS:
1. Follow the story framework: "${template.storyFramework}"
2. Include these character types: ${template.characterTypes.join(', ')}
3. Use these puzzle types: ${template.puzzleTypes.join(', ')}
4. Maintain the ${template.difficulty} difficulty level
5. Adapt the story to the specific city and area while keeping the core framework
6. Use real, established pub crawl routes from online sources
7. Ensure all content is specific to the chosen city and area

PUZZLE GENERATION REQUIREMENTS:
- Use at least 5 different puzzle types from the available types: ${template.puzzleTypes.join(', ')}
- No single puzzle type should exceed 30% of total puzzles
- Include puzzles from different categories: reasoning, creative, analytical, and contextual
- Vary difficulty levels within each puzzle type
- Include at least one multi-step puzzle and one hybrid puzzle combining multiple types
- Ensure puzzles build on each other and reveal story elements progressively

CRITICAL PUZZLE CONTENT REQUIREMENTS:
- Each puzzle MUST have COMPLETE, SOLVABLE content - not just concepts or ideas
- The "content" field must contain the actual puzzle data, questions, or materials needed to solve it
- The "answer" field must be the EXACT, SPECIFIC solution (not just "the answer" or "solution")
- The "clues" field must contain 3 PROGRESSIVE hints that actually help solve the puzzle
- Each puzzle must be immediately playable without additional setup or explanation
- Puzzles must be specific to the pub location and story context
- Include actual data, numbers, text, or materials that players can work with

${customInstructions ? `Additional Instructions: ${customInstructions}` : ''}`

  return instructions
}
