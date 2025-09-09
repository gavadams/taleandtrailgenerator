'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, MapPin, Puzzle, Clock, Download, Save } from 'lucide-react'
import { Game } from '@/types'

interface ReviewStepProps {
  gameData: any
  onSave: () => void
  onBack: () => void
}

export function ReviewStep({ gameData, onSave, onBack }: ReviewStepProps) {
  const [activeTab, setActiveTab] = useState('overview')

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
    if (!gameData.content) return

    let text = `# ${gameData.title}\n\n`
    text += `**Theme:** ${gameData.theme}\n`
    text += `**City:** ${gameData.city}\n`
    text += `**Difficulty:** ${gameData.difficulty}\n`
    text += `**Duration:** ${gameData.estimatedDuration} minutes\n\n`

    // Intro
    text += `## ${gameData.content.intro?.title || 'Introduction'}\n\n`
    text += `${gameData.content.intro?.content || ''}\n\n`
    if (gameData.content.intro?.mapsLink) {
      text += `[Google Maps Link](${gameData.content.intro.mapsLink})\n\n`
    }

    // Locations and Puzzles
    gameData.content.locations?.forEach((location: any, index: number) => {
      text += `## Pub #${index + 1} – ${location.actualName || location.placeholderName}\n\n`
      text += `${location.narrative}\n\n`

      location.puzzles?.forEach((puzzle: any) => {
        text += `### ${puzzle.title}\n\n`
        text += `${puzzle.narrative}\n\n`
        text += `${puzzle.content}\n\n`
        
        if (puzzle.clues && puzzle.clues.length > 0) {
          text += `**Clues:**\n`
          puzzle.clues.forEach((clue: string, cIndex: number) => {
            text += `${cIndex + 1}. ${clue}\n`
          })
          text += `\n`
        }

        text += `**Answer:** ${puzzle.answer}\n\n`
      })

      if (location.transitionText) {
        text += `${location.transitionText}\n\n`
      }
      if (location.mapsLink) {
        text += `[Google Maps Link](${location.mapsLink})\n\n`
      }
    })

    // Resolution
    if (gameData.content.resolution) {
      text += `## ${gameData.content.resolution.title || 'Resolution'}\n\n`
      text += `${gameData.content.resolution.content}\n\n`
    }

    // Download as text file
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${gameData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportToJSON = () => {
    const game: Game = {
      id: '',
      title: gameData.title,
      theme: gameData.theme,
      city: gameData.city,
      difficulty: gameData.difficulty,
      estimatedDuration: gameData.estimatedDuration,
      pubCount: gameData.pubCount,
      puzzlesPerPub: gameData.puzzlesPerPub,
      content: gameData.content,
      locationPlaceholders: gameData.locationPlaceholders || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: '',
    }

    const blob = new Blob([JSON.stringify(game, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${gameData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
            Review & Save Your Game
          </CardTitle>
          <CardDescription>
            Review your game content and save it to your library
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">{gameData.title}</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge className={getThemeColor(gameData.theme)}>
                        {gameData.theme}
                      </Badge>
                      <Badge className={getDifficultyColor(gameData.difficulty)}>
                        {gameData.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{gameData.city}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{gameData.estimatedDuration} minutes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Puzzle className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {gameData.pubCount} pubs, {gameData.puzzlesPerPub} puzzles each
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Game Statistics</h4>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <div>Total Puzzles: {gameData.content?.locations?.reduce((total: number, loc: any) => total + (loc.puzzles?.length || 0), 0) || 0}</div>
                      <div>Total Clues: {gameData.content?.locations?.reduce((total: number, loc: any) => 
                        total + (loc.puzzles?.reduce((pTotal: number, puzzle: any) => pTotal + (puzzle.clues?.length || 0), 0) || 0), 0) || 0}</div>
                      <div>Average Difficulty: {gameData.content?.locations?.reduce((total: number, loc: any) => 
                        total + (loc.puzzles?.reduce((pTotal: number, puzzle: any) => pTotal + (puzzle.difficulty || 3), 0) || 0), 0) / 
                        (gameData.content?.locations?.reduce((total: number, loc: any) => total + (loc.puzzles?.length || 0), 0) || 1) || 3}</div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Introduction</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">{gameData.content?.intro?.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{gameData.content?.intro?.content}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Resolution</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">{gameData.content?.resolution?.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{gameData.content?.resolution?.content}</p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="locations" className="space-y-4">
              <div className="space-y-4">
                {gameData.content?.locations?.map((location: any, index: number) => (
                  <Card key={location.id}>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Pub {index + 1}: {location.actualName || location.placeholderName}
                      </CardTitle>
                      <CardDescription>
                        {location.venueType} • {location.puzzles?.length || 0} puzzles
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">{location.narrative}</p>
                        {location.puzzles?.map((puzzle: any) => (
                          <div key={puzzle.id} className="ml-4 p-2 bg-gray-50 rounded text-sm">
                            <div className="font-medium">{puzzle.title}</div>
                            <div className="text-gray-600">Type: {puzzle.type} • Difficulty: {puzzle.difficulty}</div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="export" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Export Options</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Export your game in different formats for use in other applications
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="cursor-pointer hover:bg-gray-50" onClick={exportToText}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Download className="h-8 w-8 text-blue-600" />
                        <div>
                          <h4 className="font-medium">Plain Text</h4>
                          <p className="text-sm text-gray-600">Export as readable text file</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="cursor-pointer hover:bg-gray-50" onClick={exportToJSON}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <Download className="h-8 w-8 text-green-600" />
                        <div>
                          <h4 className="font-medium">JSON Data</h4>
                          <p className="text-sm text-gray-600">Export as structured JSON</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back to Puzzles
        </Button>
        <Button onClick={onSave} size="lg" className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Game</span>
        </Button>
      </div>
    </div>
  )
}
