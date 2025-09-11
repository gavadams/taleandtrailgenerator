import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-only'
import { Game } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse the request body
    const { gameId } = await request.json()
    if (!gameId) {
      return NextResponse.json({ error: 'Game ID is required' }, { status: 400 })
    }

    // Fetch the original game
    const { data: originalGame, error: fetchError } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .eq('user_id', user.id)
      .single()

    if (fetchError || !originalGame) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 })
    }

    // Create a duplicate with a new title and timestamps
    const duplicatedGame = {
      title: `${originalGame.title} (Copy)`,
      theme: originalGame.theme,
      city: originalGame.city,
      difficulty: originalGame.difficulty,
      estimated_duration: originalGame.estimated_duration,
      pub_count: originalGame.pub_count,
      puzzles_per_pub: originalGame.puzzles_per_pub,
      content: originalGame.content,
      location_placeholders: originalGame.location_placeholders,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Insert the duplicated game
    const { data: newGame, error: insertError } = await supabase
      .from('games')
      .insert(duplicatedGame)
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting duplicated game:', insertError)
      return NextResponse.json({ error: 'Failed to duplicate game' }, { status: 500 })
    }

    // Map database fields to TypeScript interface
    const mappedGame: Game = {
      id: newGame.id,
      title: newGame.title,
      theme: newGame.theme,
      city: newGame.city,
      difficulty: newGame.difficulty,
      estimatedDuration: newGame.estimated_duration,
      pubCount: newGame.pub_count,
      puzzlesPerPub: newGame.puzzles_per_pub,
      content: newGame.content,
      locationPlaceholders: newGame.location_placeholders,
      createdAt: newGame.created_at,
      updatedAt: newGame.updated_at,
      userId: newGame.user_id
    }

    return NextResponse.json(mappedGame)
  } catch (error) {
    console.error('Error duplicating game:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
