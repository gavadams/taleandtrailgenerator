import { createClient } from '@/lib/supabase/server-only'
import { Game, GameTemplate, UserProfile } from '@/types'

export class DatabaseService {
  private async getSupabase() {
    return await createClient()
  }

  // User Profile Operations
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  }

  async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<UserProfile | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('user_profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating user profile:', error)
      return null
    }

    return data
  }

  // Game Operations
  async getGames(userId: string): Promise<Game[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching games:', error)
      return []
    }

    if (!data) return []

    // Map database fields to TypeScript interface
    return data.map(game => ({
      id: game.id,
      title: game.title,
      theme: game.theme,
      city: game.city,
      difficulty: game.difficulty,
      estimatedDuration: game.estimated_duration,
      pubCount: game.pub_count,
      puzzlesPerPub: game.puzzles_per_pub,
      content: game.content,
      locationPlaceholders: game.location_placeholders, // Map underscore to camelCase
      createdAt: game.created_at,
      updatedAt: game.updated_at,
      userId: game.user_id
    }))
  }

  async getGame(gameId: string, userId: string): Promise<Game | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('id', gameId)
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching game:', error)
      return null
    }

    if (!data) return null

    // Map database fields to TypeScript interface
    return {
      id: data.id,
      title: data.title,
      theme: data.theme,
      city: data.city,
      difficulty: data.difficulty,
      estimatedDuration: data.estimated_duration,
      pubCount: data.pub_count,
      puzzlesPerPub: data.puzzles_per_pub,
      content: data.content,
      locationPlaceholders: data.location_placeholders, // Map underscore to camelCase
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id
    }
  }

  async createGame(game: Omit<Game, 'id' | 'createdAt' | 'updatedAt'>): Promise<Game | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('games')
      .insert({
        title: game.title,
        theme: game.theme,
        city: game.city,
        difficulty: game.difficulty,
        estimated_duration: game.estimatedDuration,
        pub_count: game.pubCount,
        puzzles_per_pub: game.puzzlesPerPub,
        content: game.content,
        location_placeholders: game.locationPlaceholders,
        user_id: game.userId,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating game:', error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      theme: data.theme,
      city: data.city,
      difficulty: data.difficulty,
      estimatedDuration: data.estimated_duration,
      pubCount: data.pub_count,
      puzzlesPerPub: data.puzzles_per_pub,
      content: data.content,
      locationPlaceholders: data.location_placeholders,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
    }
  }

  async updateGame(gameId: string, userId: string, updates: Partial<Game>): Promise<Game | null> {
    const supabase = await this.getSupabase()
    const updateData: any = {}
    
    if (updates.title) updateData.title = updates.title
    if (updates.theme) updateData.theme = updates.theme
    if (updates.city) updateData.city = updates.city
    if (updates.difficulty) updateData.difficulty = updates.difficulty
    if (updates.estimatedDuration) updateData.estimated_duration = updates.estimatedDuration
    if (updates.pubCount) updateData.pub_count = updates.pubCount
    if (updates.puzzlesPerPub) updateData.puzzles_per_pub = updates.puzzlesPerPub
    if (updates.content) updateData.content = updates.content
    if (updates.locationPlaceholders) updateData.location_placeholders = updates.locationPlaceholders

    const { data, error } = await supabase
      .from('games')
      .update(updateData)
      .eq('id', gameId)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      console.error('Error updating game:', error)
      return null
    }

    return {
      id: data.id,
      title: data.title,
      theme: data.theme,
      city: data.city,
      difficulty: data.difficulty,
      estimatedDuration: data.estimated_duration,
      pubCount: data.pub_count,
      puzzlesPerPub: data.puzzles_per_pub,
      content: data.content,
      locationPlaceholders: data.location_placeholders,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      userId: data.user_id,
    }
  }

  async deleteGame(gameId: string, userId: string): Promise<boolean> {
    const supabase = await this.getSupabase()
    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', gameId)
      .eq('user_id', userId)

    if (error) {
      console.error('Error deleting game:', error)
      return false
    }

    return true
  }

  // Game Template Operations
  async getGameTemplates(theme?: string, difficulty?: string): Promise<GameTemplate[]> {
    const supabase = await this.getSupabase()
    let query = supabase
      .from('game_templates')
      .select('*')
      .order('created_at', { ascending: false })

    if (theme) {
      query = query.eq('theme', theme)
    }

    if (difficulty) {
      query = query.eq('difficulty', difficulty)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching game templates:', error)
      return []
    }

    return data || []
  }

  async getGameTemplate(templateId: string): Promise<GameTemplate | null> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('game_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (error) {
      console.error('Error fetching game template:', error)
      return null
    }

    return data
  }

  // Search Operations
  async searchGames(userId: string, query: string): Promise<Game[]> {
    const supabase = await this.getSupabase()
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .eq('user_id', userId)
      .or(`title.ilike.%${query}%,city.ilike.%${query}%,theme.ilike.%${query}%`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error searching games:', error)
      return []
    }

    return data || []
  }
}

export const db = new DatabaseService()