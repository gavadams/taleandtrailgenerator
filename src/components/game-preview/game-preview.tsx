'use client'

import { useState } from 'react'
import { Game } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowLeft, MapPin, Puzzle, Clock, Download, Eye } from 'lucide-react'

interface GamePreviewProps {
  game: Game
  onBack: () => void
}

export function GamePreview({ game, onBack }: GamePreviewProps) {
  const [activeTab, setActiveTab] = useState('intro')
  const [showAnswers, setShowAnswers] = useState(false)

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

  const exportToText = () => {
    let text = `# ${game.title}\n\n`
    text += `**Theme:** ${game.theme}\n`
    text += `**City:** ${game.city}\n`
    text += `**Difficulty:** ${game.difficulty}\n`
    text += `**Duration:** ${game.estimatedDuration} minutes\n\n`

    // Intro
    text += `## ${game.content.intro?.title || 'Introduction'}\n\n`
    text += `${game.content.intro?.content || ''}\n\n`
    if (game.content.intro?.mapsLink) {
      text += `[Google Maps Link](${game.content.intro.mapsLink})\n\n`
    }

    // Locations and Puzzles
    game.content.locations?.forEach((location, index) => {
      text += `## Pub #${index + 1} – ${location.actualName || location.placeholderName}\n\n`
      text += `${location.narrative}\n\n`

      location.puzzles?.forEach((puzzle) => {
        text += `### ${puzzle.title}\n\n`
        text += `${puzzle.narrative}\n\n`
        text += `${puzzle.content}\n\n`
        
        if (puzzle.clues && puzzle.clues.length > 0) {
          text += `**Clues:**\n`
          puzzle.clues.forEach((clue, cIndex) => {
            text += `${cIndex + 1}. ${clue}\n`
          })
          text += `\n`
        }

        if (showAnswers) {
          text += `**Answer:** ${puzzle.answer}\n\n`
        }
      })

      if (location.transitionText) {
        text += `${location.transitionText}\n\n`
      }
      if (location.mapsLink) {
        text += `[Google Maps Link](${location.mapsLink})\n\n`
      }
    })

    // Resolution
    if (game.content.resolution) {
      text += `## ${game.content.resolution.title || 'Resolution'}\n\n`
      text += `${game.content.resolution.content}\n\n`
    }

    // Download as text file
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${game.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{game.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{game.city}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{game.estimatedDuration} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Puzzle className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    {game.pubCount} pubs, {game.puzzlesPerPub} puzzles each
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowAnswers(!showAnswers)}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>{showAnswers ? 'Hide' : 'Show'} Answers</span>
            </Button>
            <Button onClick={exportToText} className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Game Info */}
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center space-x-4">
              <Badge className={getThemeColor(game.theme)}>
                {game.theme}
              </Badge>
              <Badge className={getDifficultyColor(game.difficulty)}>
                {game.difficulty}
              </Badge>
              <span className="text-sm text-gray-600">
                Created {new Date(game.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Game Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="intro">Introduction</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="resolution">Resolution</TabsTrigger>
            <TabsTrigger value="full">Full Game</TabsTrigger>
          </TabsList>

          <TabsContent value="intro" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{game.content.intro?.title || 'Introduction'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{game.content.intro?.content}</p>
                  {game.content.intro?.mapsLink && (
                    <div className="mt-4">
                      <a
                        href={game.content.intro.mapsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline"
                      >
                        Google Maps Link
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            <div className="space-y-6">
              {game.content.locations?.map((location, index) => (
                <Card key={location.id}>
                  <CardHeader>
                    <CardTitle>
                      Pub #{index + 1} – {location.actualName || location.placeholderName}
                    </CardTitle>
                    <CardDescription>
                      {location.venueType} • {location.puzzles?.length || 0} puzzles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose max-w-none">
                      <p className="whitespace-pre-wrap">{location.narrative}</p>
                    </div>

                    {location.puzzles?.map((puzzle) => (
                      <Card key={puzzle.id} className="bg-gray-50">
                        <CardHeader>
                          <CardTitle className="text-base">{puzzle.title}</CardTitle>
                          <CardDescription>
                            {puzzle.type} • Difficulty: {puzzle.difficulty}/5
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="prose max-w-none">
                            <p className="whitespace-pre-wrap">{puzzle.narrative}</p>
                          </div>
                          <div className="prose max-w-none">
                            <p className="whitespace-pre-wrap">{puzzle.content}</p>
                          </div>
                          
                          {puzzle.clues && puzzle.clues.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Clues:</h4>
                              <ol className="list-decimal list-inside space-y-1">
                                {puzzle.clues.map((clue, cIndex) => (
                                  <li key={cIndex} className="text-sm">{clue}</li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {showAnswers && (
                            <div className="p-3 bg-green-50 border border-green-200 rounded">
                              <h4 className="font-medium text-green-800 mb-1">Answer:</h4>
                              <p className="text-green-700">{puzzle.answer}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}

                    {location.transitionText && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                        <p className="whitespace-pre-wrap">{location.transitionText}</p>
                      </div>
                    )}

                    {location.mapsLink && (
                      <div>
                        <a
                          href={location.mapsLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Google Maps Link
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resolution" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{game.content.resolution?.title || 'Resolution'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap">{game.content.resolution?.content}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="full" className="space-y-4">
            <div className="prose max-w-none">
              <h2>{game.content.intro?.title || 'Introduction'}</h2>
              <p className="whitespace-pre-wrap">{game.content.intro?.content}</p>
              
              {game.content.locations?.map((location, index) => (
                <div key={location.id}>
                  <h2>Pub #{index + 1} – {location.actualName || location.placeholderName}</h2>
                  <p className="whitespace-pre-wrap">{location.narrative}</p>
                  
                  {location.puzzles?.map((puzzle) => (
                    <div key={puzzle.id}>
                      <h3>{puzzle.title}</h3>
                      <p className="whitespace-pre-wrap">{puzzle.narrative}</p>
                      <p className="whitespace-pre-wrap">{puzzle.content}</p>
                      
                      {puzzle.clues && puzzle.clues.length > 0 && (
                        <div>
                          <h4>Clues:</h4>
                          <ol>
                            {puzzle.clues.map((clue, cIndex) => (
                              <li key={cIndex}>{clue}</li>
                            ))}
                          </ol>
                        </div>
                      )}

                      {showAnswers && (
                        <div>
                          <h4>Answer:</h4>
                          <p>{puzzle.answer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {location.transitionText && (
                    <p className="whitespace-pre-wrap">{location.transitionText}</p>
                  )}
                </div>
              ))}
              
              <h2>{game.content.resolution?.title || 'Resolution'}</h2>
              <p className="whitespace-pre-wrap">{game.content.resolution?.content}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
