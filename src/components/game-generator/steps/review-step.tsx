'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { CheckCircle, MapPin, Puzzle, Clock, Download, Save, Edit3, Check, X } from 'lucide-react'
import { RouteMap } from '@/components/ui/route-map'
import { Game } from '@/types'

interface ReviewStepProps {
  gameData: any
  onSave: () => void
  onBack: () => void
}

export function ReviewStep({ gameData, onSave, onBack }: ReviewStepProps) {
  const [activeTab, setActiveTab] = useState('overview')
  const [isEditing, setIsEditing] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editedData, setEditedData] = useState(gameData)

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

  const handleEdit = (field: string) => {
    setEditingField(field)
    setIsEditing(true)
  }

  const handleSaveEdit = (field: string, value: any) => {
    setEditedData((prev: any) => ({
      ...prev,
      [field]: value
    }))
    setEditingField(null)
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditingField(null)
    setIsEditing(false)
  }

  const handleSaveAll = () => {
    // Update the parent component with edited data
    Object.assign(gameData, editedData)
    onSave()
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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                Review & Save Your Game
              </CardTitle>
              <CardDescription>
                Review your game content and save it to your library
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isEditing ? "default" : "outline"}
                size="sm"
                onClick={() => setIsEditing(!isEditing)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                {isEditing ? 'Exit Edit' : 'Edit Mode'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="locations">Locations</TabsTrigger>
              <TabsTrigger value="route" className="flex items-center gap-1">
                Route Map
                {gameData.content?.locations?.length > 0 && (
                  <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                )}
              </TabsTrigger>
              <TabsTrigger value="export">Export</TabsTrigger>
            </TabsList>

            {/* Game Overview */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Game Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {editedData.theme && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Theme:</span>
                      {isEditing && editingField === 'theme' ? (
                        <div className="flex items-center space-x-2">
                          <Select
                            value={editedData.theme}
                            onValueChange={(value) => handleSaveEdit('theme', value)}
                          >
                            <SelectTrigger className="w-32 h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mystery">Mystery</SelectItem>
                              <SelectItem value="historical">Historical</SelectItem>
                              <SelectItem value="fantasy">Fantasy</SelectItem>
                              <SelectItem value="horror">Horror</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{editedData.theme}</span>
                          {isEditing && (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit('theme')}>
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {editedData.city && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">City:</span>
                      {isEditing && editingField === 'city' ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editedData.city}
                            onChange={(e) => setEditedData((prev: any) => ({ ...prev, city: e.target.value }))}
                            className="w-32 h-6 text-xs"
                            onBlur={() => handleSaveEdit('city', editedData.city)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit('city', editedData.city)
                              if (e.key === 'Escape') handleCancelEdit()
                            }}
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" onClick={() => handleSaveEdit('city', editedData.city)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{editedData.city}</span>
                          {isEditing && (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit('city')}>
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {editedData.difficulty && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Difficulty:</span>
                      {isEditing && editingField === 'difficulty' ? (
                        <div className="flex items-center space-x-2">
                          <Select
                            value={editedData.difficulty}
                            onValueChange={(value) => handleSaveEdit('difficulty', value)}
                          >
                            <SelectTrigger className="w-24 h-6 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded capitalize">{editedData.difficulty}</span>
                          {isEditing && (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit('difficulty')}>
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {editedData.estimatedDuration && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Duration:</span>
                      {isEditing && editingField === 'estimatedDuration' ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={editedData.estimatedDuration}
                            onChange={(e) => setEditedData((prev: any) => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                            className="w-20 h-6 text-xs"
                            onBlur={() => handleSaveEdit('estimatedDuration', editedData.estimatedDuration)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit('estimatedDuration', editedData.estimatedDuration)
                              if (e.key === 'Escape') handleCancelEdit()
                            }}
                            autoFocus
                          />
                          <span className="text-xs text-gray-500">min</span>
                          <Button size="sm" variant="ghost" onClick={() => handleSaveEdit('estimatedDuration', editedData.estimatedDuration)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">{editedData.estimatedDuration} minutes</span>
                          {isEditing && (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit('estimatedDuration')}>
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {editedData.pubCount && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Pubs:</span>
                      {isEditing && editingField === 'pubCount' ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={editedData.pubCount}
                            onChange={(e) => setEditedData((prev: any) => ({ ...prev, pubCount: parseInt(e.target.value) }))}
                            className="w-16 h-6 text-xs"
                            onBlur={() => handleSaveEdit('pubCount', editedData.pubCount)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit('pubCount', editedData.pubCount)
                              if (e.key === 'Escape') handleCancelEdit()
                            }}
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" onClick={() => handleSaveEdit('pubCount', editedData.pubCount)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">{editedData.pubCount}</span>
                          {isEditing && (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit('pubCount')}>
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {editedData.puzzlesPerPub && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Puzzles per Pub:</span>
                      {isEditing && editingField === 'puzzlesPerPub' ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            value={editedData.puzzlesPerPub}
                            onChange={(e) => setEditedData((prev: any) => ({ ...prev, puzzlesPerPub: parseInt(e.target.value) }))}
                            className="w-16 h-6 text-xs"
                            onBlur={() => handleSaveEdit('puzzlesPerPub', editedData.puzzlesPerPub)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit('puzzlesPerPub', editedData.puzzlesPerPub)
                              if (e.key === 'Escape') handleCancelEdit()
                            }}
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" onClick={() => handleSaveEdit('puzzlesPerPub', editedData.puzzlesPerPub)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm bg-pink-100 text-pink-800 px-2 py-1 rounded">{editedData.puzzlesPerPub}</span>
                          {isEditing && (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit('puzzlesPerPub')}>
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  {editedData.template && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Template:</span>
                      <span className="text-sm bg-indigo-100 text-indigo-800 px-2 py-1 rounded">{editedData.template.name}</span>
                    </div>
                  )}
                  {editedData.cityArea && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600">Area:</span>
                      {isEditing && editingField === 'cityArea' ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            value={editedData.cityArea}
                            onChange={(e) => setEditedData((prev: any) => ({ ...prev, cityArea: e.target.value }))}
                            className="w-32 h-6 text-xs"
                            onBlur={() => handleSaveEdit('cityArea', editedData.cityArea)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleSaveEdit('cityArea', editedData.cityArea)
                              if (e.key === 'Escape') handleCancelEdit()
                            }}
                            autoFocus
                          />
                          <Button size="sm" variant="ghost" onClick={() => handleSaveEdit('cityArea', editedData.cityArea)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <span className="text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded">{editedData.cityArea}</span>
                          {isEditing && (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit('cityArea')}>
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

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
                    {isEditing && editingField === 'intro-title' ? (
                      <div className="space-y-2">
                        <Input
                          value={editedData.content?.intro?.title || ''}
                          onChange={(e) => setEditedData((prev: any) => ({
                            ...prev,
                            content: {
                              ...prev.content,
                              intro: {
                                ...prev.content?.intro,
                                title: e.target.value
                              }
                            }
                          }))}
                          className="font-medium"
                          onBlur={() => handleSaveEdit('intro-title', editedData.content?.intro?.title)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit('intro-title', editedData.content?.intro?.title)
                            if (e.key === 'Escape') handleCancelEdit()
                          }}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleSaveEdit('intro-title', editedData.content?.intro?.title)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{editedData.content?.intro?.title}</h4>
                        {isEditing && (
                          <Button size="sm" variant="ghost" onClick={() => handleEdit('intro-title')}>
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {isEditing && editingField === 'intro-content' ? (
                      <div className="mt-2 space-y-2">
                        <Textarea
                          value={editedData.content?.intro?.content || ''}
                          onChange={(e) => setEditedData((prev: any) => ({
                            ...prev,
                            content: {
                              ...prev.content,
                              intro: {
                                ...prev.content?.intro,
                                content: e.target.value
                              }
                            }
                          }))}
                          className="text-sm min-h-20"
                          onBlur={() => handleSaveEdit('intro-content', editedData.content?.intro?.content)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) handleSaveEdit('intro-content', editedData.content?.intro?.content)
                            if (e.key === 'Escape') handleCancelEdit()
                          }}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleSaveEdit('intro-content', editedData.content?.intro?.content)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between mt-1">
                        <p className="text-sm text-gray-600 flex-1">{editedData.content?.intro?.content}</p>
                        {isEditing && (
                          <Button size="sm" variant="ghost" onClick={() => handleEdit('intro-content')}>
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Resolution</h3>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    {isEditing && editingField === 'resolution-title' ? (
                      <div className="space-y-2">
                        <Input
                          value={editedData.content?.resolution?.title || ''}
                          onChange={(e) => setEditedData((prev: any) => ({
                            ...prev,
                            content: {
                              ...prev.content,
                              resolution: {
                                ...prev.content?.resolution,
                                title: e.target.value
                              }
                            }
                          }))}
                          className="font-medium"
                          onBlur={() => handleSaveEdit('resolution-title', editedData.content?.resolution?.title)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit('resolution-title', editedData.content?.resolution?.title)
                            if (e.key === 'Escape') handleCancelEdit()
                          }}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleSaveEdit('resolution-title', editedData.content?.resolution?.title)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">{editedData.content?.resolution?.title}</h4>
                        {isEditing && (
                          <Button size="sm" variant="ghost" onClick={() => handleEdit('resolution-title')}>
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                    
                    {isEditing && editingField === 'resolution-content' ? (
                      <div className="mt-2 space-y-2">
                        <Textarea
                          value={editedData.content?.resolution?.content || ''}
                          onChange={(e) => setEditedData((prev: any) => ({
                            ...prev,
                            content: {
                              ...prev.content,
                              resolution: {
                                ...prev.content?.resolution,
                                content: e.target.value
                              }
                            }
                          }))}
                          className="text-sm min-h-20"
                          onBlur={() => handleSaveEdit('resolution-content', editedData.content?.resolution?.content)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) handleSaveEdit('resolution-content', editedData.content?.resolution?.content)
                            if (e.key === 'Escape') handleCancelEdit()
                          }}
                          autoFocus
                        />
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost" onClick={() => handleSaveEdit('resolution-content', editedData.content?.resolution?.content)}>
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between mt-1">
                        <p className="text-sm text-gray-600 flex-1">{editedData.content?.resolution?.content}</p>
                        {isEditing && (
                          <Button size="sm" variant="ghost" onClick={() => handleEdit('resolution-content')}>
                            <Edit3 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="locations" className="space-y-4">
              <div className="space-y-4">
                {editedData.content?.locations?.map((location: any, index: number) => (
                  <Card key={location.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">
                            Pub {index + 1}: {location.actualName || location.placeholderName}
                          </CardTitle>
                          <CardDescription>
                            {location.venueType} • {location.puzzles?.length || 0} puzzles
                          </CardDescription>
                        </div>
                        {isEditing && (
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(`location-${index}-name`)}>
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {isEditing && editingField === `location-${index}-name` ? (
                          <div className="space-y-2">
                            <Input
                              value={location.actualName || location.placeholderName || ''}
                              onChange={(e) => setEditedData((prev: any) => ({
                                ...prev,
                                content: {
                                  ...prev.content,
                                  locations: prev.content.locations.map((loc: any, i: number) => 
                                    i === index ? { ...loc, actualName: e.target.value } : loc
                                  )
                                }
                              }))}
                              placeholder="Pub name"
                              onBlur={() => handleSaveEdit(`location-${index}-name`, location.actualName)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit(`location-${index}-name`, location.actualName)
                                if (e.key === 'Escape') handleCancelEdit()
                              }}
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(`location-${index}-name`, location.actualName)}>
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between">
                            <p className="text-sm text-gray-600 flex-1">{location.narrative}</p>
                            {isEditing && (
                              <Button size="sm" variant="ghost" onClick={() => handleEdit(`location-${index}-narrative`)}>
                                <Edit3 className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        )}
                        
                        {isEditing && editingField === `location-${index}-narrative` ? (
                          <div className="space-y-2">
                            <Textarea
                              value={location.narrative || ''}
                              onChange={(e) => setEditedData((prev: any) => ({
                                ...prev,
                                content: {
                                  ...prev.content,
                                  locations: prev.content.locations.map((loc: any, i: number) => 
                                    i === index ? { ...loc, narrative: e.target.value } : loc
                                  )
                                }
                              }))}
                              className="text-sm min-h-16"
                              placeholder="Location narrative"
                              onBlur={() => handleSaveEdit(`location-${index}-narrative`, location.narrative)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && e.ctrlKey) handleSaveEdit(`location-${index}-narrative`, location.narrative)
                                if (e.key === 'Escape') handleCancelEdit()
                              }}
                              autoFocus
                            />
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(`location-${index}-narrative`, location.narrative)}>
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ) : null}
                        
                        {location.puzzles?.map((puzzle: any, puzzleIndex: number) => (
                          <div key={puzzle.id} className="ml-4 p-3 bg-gray-50 rounded text-sm space-y-2">
                            {/* Puzzle Title */}
                            {isEditing && editingField === `puzzle-${index}-${puzzleIndex}-title` ? (
                              <div className="space-y-2">
                                <Input
                                  value={puzzle.title || ''}
                                  onChange={(e) => setEditedData((prev: any) => ({
                                    ...prev,
                                    content: {
                                      ...prev.content,
                                      locations: prev.content.locations.map((loc: any, i: number) => 
                                        i === index ? {
                                          ...loc,
                                          puzzles: loc.puzzles.map((p: any, pi: number) => 
                                            pi === puzzleIndex ? { ...p, title: e.target.value } : p
                                          )
                                        } : loc
                                      )
                                    }
                                  }))}
                                  placeholder="Puzzle title"
                                  onBlur={() => handleSaveEdit(`puzzle-${index}-${puzzleIndex}-title`, puzzle.title)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit(`puzzle-${index}-${puzzleIndex}-title`, puzzle.title)
                                    if (e.key === 'Escape') handleCancelEdit()
                                  }}
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(`puzzle-${index}-${puzzleIndex}-title`, puzzle.title)}>
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div className="font-medium">{puzzle.title}</div>
                                {isEditing && (
                                  <Button size="sm" variant="ghost" onClick={() => handleEdit(`puzzle-${index}-${puzzleIndex}-title`)}>
                                    <Edit3 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            )}
                            
                            {/* Puzzle Type and Difficulty */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Type:</span>
                                {isEditing && editingField === `puzzle-${index}-${puzzleIndex}-type` ? (
                                  <Select
                                    value={puzzle.type}
                                    onValueChange={(value) => {
                                      setEditedData((prev: any) => ({
                                        ...prev,
                                        content: {
                                          ...prev.content,
                                          locations: prev.content.locations.map((loc: any, i: number) => 
                                            i === index ? {
                                              ...loc,
                                              puzzles: loc.puzzles.map((p: any, pi: number) => 
                                                pi === puzzleIndex ? { ...p, type: value } : p
                                              )
                                            } : loc
                                          )
                                        }
                                      }))
                                      handleSaveEdit(`puzzle-${index}-${puzzleIndex}-type`, value)
                                    }}
                                  >
                                    <SelectTrigger className="w-24 h-6 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="logic">Logic</SelectItem>
                                      <SelectItem value="observation">Observation</SelectItem>
                                      <SelectItem value="cipher">Cipher</SelectItem>
                                      <SelectItem value="deduction">Deduction</SelectItem>
                                      <SelectItem value="local">Local</SelectItem>
                                      <SelectItem value="wordplay">Wordplay</SelectItem>
                                      <SelectItem value="math">Math</SelectItem>
                                      <SelectItem value="pattern">Pattern</SelectItem>
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-600">{puzzle.type}</span>
                                    {isEditing && (
                                      <Button size="sm" variant="ghost" onClick={() => handleEdit(`puzzle-${index}-${puzzleIndex}-type`)}>
                                        <Edit3 className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">Difficulty:</span>
                                {isEditing && editingField === `puzzle-${index}-${puzzleIndex}-difficulty` ? (
                                  <Select
                                    value={puzzle.difficulty}
                                    onValueChange={(value) => {
                                      setEditedData((prev: any) => ({
                                        ...prev,
                                        content: {
                                          ...prev.content,
                                          locations: prev.content.locations.map((loc: any, i: number) => 
                                            i === index ? {
                                              ...loc,
                                              puzzles: loc.puzzles.map((p: any, pi: number) => 
                                                pi === puzzleIndex ? { ...p, difficulty: value } : p
                                              )
                                            } : loc
                                          )
                                        }
                                      }))
                                      handleSaveEdit(`puzzle-${index}-${puzzleIndex}-difficulty`, value)
                                    }}
                                  >
                                    <SelectTrigger className="w-20 h-6 text-xs">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="easy">Easy</SelectItem>
                                      <SelectItem value="medium">Medium</SelectItem>
                                      <SelectItem value="hard">Hard</SelectItem>
                                    </SelectContent>
                                  </Select>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <span className="text-gray-600">{puzzle.difficulty}</span>
                                    {isEditing && (
                                      <Button size="sm" variant="ghost" onClick={() => handleEdit(`puzzle-${index}-${puzzleIndex}-difficulty`)}>
                                        <Edit3 className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            {/* Puzzle Content */}
                            {puzzle.content && (
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-500 text-xs">Content:</span>
                                  {isEditing && (
                                    <Button size="sm" variant="ghost" onClick={() => handleEdit(`puzzle-${index}-${puzzleIndex}-content`)}>
                                      <Edit3 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                                {isEditing && editingField === `puzzle-${index}-${puzzleIndex}-content` ? (
                                  <div className="space-y-2">
                                    <Textarea
                                      value={puzzle.content || ''}
                                      onChange={(e) => setEditedData((prev: any) => ({
                                        ...prev,
                                        content: {
                                          ...prev.content,
                                          locations: prev.content.locations.map((loc: any, i: number) => 
                                            i === index ? {
                                              ...loc,
                                              puzzles: loc.puzzles.map((p: any, pi: number) => 
                                                pi === puzzleIndex ? { ...p, content: e.target.value } : p
                                              )
                                            } : loc
                                          )
                                        }
                                      }))}
                                      className="text-xs min-h-16"
                                      placeholder="Puzzle content"
                                      onBlur={() => handleSaveEdit(`puzzle-${index}-${puzzleIndex}-content`, puzzle.content)}
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.ctrlKey) handleSaveEdit(`puzzle-${index}-${puzzleIndex}-content`, puzzle.content)
                                        if (e.key === 'Escape') handleCancelEdit()
                                      }}
                                      autoFocus
                                    />
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(`puzzle-${index}-${puzzleIndex}-content`, puzzle.content)}>
                                        <Check className="h-3 w-3" />
                                      </Button>
                                      <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-xs text-gray-600 bg-white p-2 rounded border">
                                    {puzzle.content}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="route" className="space-y-4">
              <RouteMap 
                locations={editedData.content?.locations || []}
                city={editedData.city}
                cityArea={editedData.cityArea}
              />
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
        <Button onClick={handleSaveAll} size="lg" className="flex items-center space-x-2">
          <Save className="h-4 w-4" />
          <span>Save Game</span>
        </Button>
      </div>
    </div>
  )
}
