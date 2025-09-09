import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-only'

// GET - List all game templates
export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data: templates, error } = await supabase
      .from('game_templates')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching game templates:', error)
      return NextResponse.json(
        { error: 'Failed to fetch game templates' },
        { status: 500 }
      )
    }

    return NextResponse.json(templates)
  } catch (error: any) {
    console.error('Error in game templates API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new game template (admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { name, theme, description, storyFramework, characterTypes, puzzleTypes, difficulty } = body

    if (!name || !theme || !description || !storyFramework || !characterTypes || !puzzleTypes || !difficulty) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    const { data: template, error } = await supabase
      .from('game_templates')
      .insert({
        name,
        theme,
        description,
        story_framework: storyFramework,
        character_types: characterTypes,
        puzzle_types: puzzleTypes,
        difficulty
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating template:', error)
      return NextResponse.json(
        { error: 'Failed to create template' },
        { status: 500 }
      )
    }

    return NextResponse.json(template, { status: 201 })
  } catch (error: any) {
    console.error('Error in create template API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
