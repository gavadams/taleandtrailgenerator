'use client'

import { Game } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Clock, Puzzle, Eye, Edit, Trash2, Copy, Navigation } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface GameCardProps {
  game: Game
  onEdit: (game: Game) => void
  onDelete: (game: Game) => void
  onPreview: (game: Game) => void
  onDuplicate: (game: Game) => void
}

export function GameCard({ game, onEdit, onDelete, onPreview, onDuplicate }: GameCardProps) {
  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'mystery': return 'bg-purple-100 text-purple-800'
      case 'historical': return 'bg-amber-100 text-amber-800'
      case 'fantasy': return 'bg-green-100 text-green-800'
      case 'sci-fi': return 'bg-blue-100 text-blue-800'
      case 'comedy': return 'bg-yellow-100 text-yellow-800'
      case 'horror': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{game.title}</CardTitle>
            <CardDescription className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{game.city}</span>
            </CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPreview(game)}
              title="Preview game"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDuplicate(game)}
              title="Duplicate game"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(game)}
              title="Edit game"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(game)}
              className="text-red-600 hover:text-red-700"
              title="Delete game"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge className={getThemeColor(game.theme)}>
              {game.theme}
            </Badge>
            <Badge className={getDifficultyColor(game.difficulty)}>
              {game.difficulty}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{game.estimatedDuration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <Puzzle className="h-4 w-4" />
              <span>{game.pubCount} pubs, {game.puzzlesPerPub} puzzles each</span>
            </div>
          </div>
          
          {/* Route Information */}
          {game.routeInfo && (
            <div className="flex items-center space-x-4 text-sm text-gray-600 pt-2 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                <Navigation className="h-4 w-4 text-blue-500" />
                <span className="text-blue-600 font-medium">{game.routeInfo.totalDistance}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">{game.routeInfo.totalTime}</span>
              </div>
              {!game.routeInfo.isValid && (
                <Badge variant="outline" className="text-xs text-yellow-600 border-yellow-300">
                  Route needs review
                </Badge>
              )}
            </div>
          )}
          
          <div className="text-xs text-gray-500">
            Created {game.createdAt ? formatDistanceToNow(new Date(game.createdAt), { addSuffix: true }) : 'Unknown date'}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
