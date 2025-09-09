import { NextRequest, NextResponse } from 'next/server'
import { createAIService } from '@/lib/ai'
import { AIGenerationRequest } from '@/types'

export async function POST(request: NextRequest) {
  try {
    console.log('=== GAME GENERATION API CALL START ===')
    const body = await request.json()
    console.log('Request body:', body)
    console.log('Custom area from request:', body.cityArea)
    console.log('Custom area validation:', {
      exists: !!body.cityArea,
      type: typeof body.cityArea,
      length: body.cityArea?.length,
      value: body.cityArea
    })
    
    const { provider, ...generationRequest }: { provider: string } & AIGenerationRequest = body
    
    console.log('Generation request after destructuring:', generationRequest)
    console.log('City area in generation request:', generationRequest.cityArea)

    // Validate the request
    if (!generationRequest.theme || !generationRequest.city || !generationRequest.difficulty) {
      console.log('Missing required fields:', { 
        theme: generationRequest.theme, 
        city: generationRequest.city, 
        difficulty: generationRequest.difficulty 
      })
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Creating AI service with provider:', provider)
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

    console.log('Generating game content...')
    // Generate content
    const response = await aiService.generateGameContent(generationRequest)

    console.log('=== GAME GENERATION SUCCESS ===')
    return NextResponse.json(response)
  } catch (error: any) {
    console.error('=== GAME GENERATION ERROR ===')
    console.error('Error generating game content:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: error.message || 'Failed to generate game content' },
      { status: 500 }
    )
  }
}
