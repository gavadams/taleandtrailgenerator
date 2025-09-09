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
      customInstructions: buildTemplateInstructions(template, customInstructions)
    }

    console.log('Generating game from template...')
    const response = await aiService.generateGameContent(generationRequest)

    console.log('=== TEMPLATE-BASED GAME GENERATION SUCCESS ===')
    return NextResponse.json({
      ...response,
      template: {
        id: template.id,
        name: template.name,
        description: template.description
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

${customInstructions ? `Additional Instructions: ${customInstructions}` : ''}`

  return instructions
}
