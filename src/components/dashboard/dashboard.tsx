'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { GameCard } from './game-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Crown } from 'lucide-react'
import { Game, Theme, Difficulty } from '@/types'
// Removed direct database import - using API calls instead
import { toast } from 'sonner'

interface DashboardProps {
  onCreateGame: () => void
  onEditGame: (game: Game) => void
  onPreviewGame: (game: Game) => void
  onAdminPanel?: () => void
  isAdmin?: boolean
  games: Game[]
  setGames: (games: Game[] | ((prev: Game[]) => Game[])) => void
}

export function Dashboard({ onCreateGame, onEditGame, onPreviewGame, onAdminPanel, isAdmin, games, setGames }: DashboardProps) {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTheme, setFilterTheme] = useState<Theme | ''>('')
  const [filterDifficulty, setFilterDifficulty] = useState<Difficulty | ''>('')

  const loadGames = useCallback(async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/games')
      if (!response.ok) throw new Error('Failed to fetch games')
      const userGames = await response.json()
      setGames(userGames)
    } catch (error) {
      toast.error('Failed to load games')
      console.error('Error loading games:', error)
    } finally {
      setLoading(false)
    }
  }, [user, setGames])

  useEffect(() => {
    if (user) {
      loadGames()
    }
  }, [user, loadGames])

  const handleDeleteGame = async (game: Game) => {
    if (!user) return
    
    if (!confirm(`Are you sure you want to delete "${game.title}"?`)) {
      return
    }

    try {
      const response = await fetch(`/api/games/${game.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setGames(games.filter(g => g.id !== game.id))
        toast.success('Game deleted successfully')
      } else {
        toast.error('Failed to delete game')
      }
    } catch (error) {
      toast.error('Failed to delete game')
      console.error('Error deleting game:', error)
    }
  }

  const filteredGames = games.filter(game => {
    const matchesSearch = !searchQuery || 
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.theme.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTheme = !filterTheme || game.theme === filterTheme
    const matchesDifficulty = !filterDifficulty || game.difficulty === filterDifficulty
    
    return matchesSearch && matchesTheme && matchesDifficulty
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading your games...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Your Games</h1>
            <p className="text-gray-600 mt-1">
              Create and manage your pub crawl mystery games
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {isAdmin && onAdminPanel && (
              <Button 
                onClick={onAdminPanel} 
                variant="outline" 
                className="flex items-center space-x-2"
              >
                <Crown className="h-4 w-4" />
                <span>Admin Panel</span>
              </Button>
            )}
            <Button onClick={onCreateGame} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create New Game</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search games..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterTheme}
                  onChange={(e) => setFilterTheme(e.target.value as Theme | '')}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Themes</option>
                  <option value="mystery">Mystery</option>
                  <option value="historical">Historical</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="sci-fi">Sci-Fi</option>
                  <option value="comedy">Comedy</option>
                  <option value="horror">Horror</option>
                </select>
                <select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value as Difficulty | '')}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm"
                >
                  <option value="">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Games Grid */}
        {filteredGames.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="space-y-4">
                <div className="text-6xl">🎯</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {games.length === 0 ? 'No games yet' : 'No games match your filters'}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {games.length === 0 
                      ? 'Create your first pub crawl mystery game to get started!'
                      : 'Try adjusting your search or filter criteria.'
                    }
                  </p>
                </div>
                {games.length === 0 && (
                  <Button onClick={onCreateGame} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Your First Game
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onEdit={onEditGame}
                onDelete={handleDeleteGame}
                onPreview={onPreviewGame}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
