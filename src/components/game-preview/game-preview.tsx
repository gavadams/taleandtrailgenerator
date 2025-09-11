'use client'

import { useState } from 'react'
import { Game } from '@/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, MapPin, Puzzle, Clock, Download, Eye, Edit3, Check, X, Save } from 'lucide-react'
import { RouteMap } from '@/components/ui/route-map'
import { toast } from 'sonner'

interface GamePreviewProps {
  game: Game
  onBack: () => void
  onSave?: (updatedGame: Game) => void
}

export function GamePreview({ game, onBack, onSave }: GamePreviewProps) {
  const [activeTab, setActiveTab] = useState('intro')
  const [showAnswers, setShowAnswers] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingField, setEditingField] = useState<string | null>(null)
  const [editedGame, setEditedGame] = useState(() => {
    // Sync actualName fields with locationPlaceholders data
    const syncedGame = { ...game }
    if (syncedGame.content?.locations && syncedGame.locationPlaceholders) {
      syncedGame.content.locations = syncedGame.content.locations.map(location => {
        const placeholderData = syncedGame.locationPlaceholders[location.placeholderName]
        if (placeholderData && placeholderData.name !== location.placeholderName) {
          return { ...location, actualName: placeholderData.name }
        }
        return location
      })
    }
    return syncedGame
  })
  const [tempInputValue, setTempInputValue] = useState<string>('')
  const [isSaving, setIsSaving] = useState(false)


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
    
    // Set the initial temp value based on the field being edited
    if (field.startsWith('location-name-')) {
      const locationId = field.replace('location-name-', '')
      const location = editedGame.content?.locations?.find(loc => loc.id === locationId)
      setTempInputValue(location?.actualName || location?.placeholderName || '')
    } else if (field.startsWith('location-narrative-')) {
      const locationId = field.replace('location-narrative-', '')
      const location = editedGame.content?.locations?.find(loc => loc.id === locationId)
      setTempInputValue(location?.narrative || '')
    } else if (field === 'title') {
      setTempInputValue(editedGame.title || '')
    } else if (field === 'intro-title') {
      setTempInputValue(editedGame.content?.intro?.title || '')
    } else if (field === 'intro-content') {
      setTempInputValue(editedGame.content?.intro?.content || '')
    } else if (field === 'resolution-title') {
      setTempInputValue(editedGame.content?.resolution?.title || '')
    } else if (field === 'resolution-content') {
      setTempInputValue(editedGame.content?.resolution?.content || '')
    } else if (field.startsWith('puzzle-title-')) {
      const puzzleId = field.replace('puzzle-title-', '')
      const puzzle = editedGame.content?.locations?.flatMap(loc => loc.puzzles || []).find(p => p.id === puzzleId)
      setTempInputValue(puzzle?.title || '')
    } else if (field.startsWith('puzzle-content-')) {
      const puzzleId = field.replace('puzzle-content-', '')
      const puzzle = editedGame.content?.locations?.flatMap(loc => loc.puzzles || []).find(p => p.id === puzzleId)
      setTempInputValue(puzzle?.content || '')
    }
  }

  const handleSaveEdit = (field: string, value: any) => {
    
    // Prevent double-saving
    if (isSaving) {
      return
    }
    
    if (editingField !== field) {
      return
    }
    
    setIsSaving(true)
    
    setEditedGame((prev: any) => {
      const newGame = { ...prev }
      
      if (field === 'title') {
        newGame.title = value
      } else if (field === 'theme') {
        newGame.theme = value
      } else if (field === 'difficulty') {
        newGame.difficulty = value
      } else if (field === 'intro-title') {
        if (!newGame.content) newGame.content = {}
        if (!newGame.content.intro) newGame.content.intro = {}
        newGame.content.intro.title = value
      } else if (field === 'intro-content') {
        if (!newGame.content) newGame.content = {}
        if (!newGame.content.intro) newGame.content.intro = {}
        newGame.content.intro.content = value
      } else if (field === 'resolution-title') {
        if (!newGame.content) newGame.content = {}
        if (!newGame.content.resolution) newGame.content.resolution = {}
        newGame.content.resolution.title = value
      } else if (field === 'resolution-content') {
        if (!newGame.content) newGame.content = {}
        if (!newGame.content.resolution) newGame.content.resolution = {}
        newGame.content.resolution.content = value
      } else if (field.startsWith('location-name-')) {
        const locationId = field.replace('location-name-', '')
        
        // Find the location to get its original name for location_placeholders lookup
        const location = newGame.content?.locations?.find((loc: any) => loc.id === locationId)
        const originalName = location?.placeholderName // Use placeholderName as the key, not actualName
        
        if (newGame.content?.locations && originalName) {
          // Update content.locations
          newGame.content = {
            ...newGame.content,
            locations: newGame.content.locations.map((loc: any) => {
              if (loc.id === locationId) {
                const updated = { ...loc, actualName: value }
                return updated
              }
              return { ...loc } // Create new object for all locations
            })
          }
          
          // Update location_placeholders - we need to find the right key
          if (newGame.locationPlaceholders) {
            
            // Try to find the matching key in location_placeholders
            let matchingKey = null
            for (const [key, placeholder] of Object.entries(newGame.locationPlaceholders)) {
              if ((placeholder as any).name === originalName || key === originalName) {
                matchingKey = key
                break
              }
            }
            
            
            if (matchingKey) {
              newGame.locationPlaceholders = {
                ...newGame.locationPlaceholders,
                [matchingKey]: {
                  ...newGame.locationPlaceholders[matchingKey],
                  name: value
                }
              }
            } else {
              console.warn('No matching key found in location_placeholders for:', originalName)
            }
          }
          
        }
      } else if (field.startsWith('location-narrative-')) {
        const locationId = field.replace('location-narrative-', '')
        if (newGame.content?.locations) {
          newGame.content.locations = newGame.content.locations.map((loc: any) => 
            loc.id === locationId ? { ...loc, narrative: value } : loc
          )
        }
      } else if (field.startsWith('puzzle-title-')) {
        const puzzleId = field.replace('puzzle-title-', '')
        if (newGame.content?.locations) {
          newGame.content.locations = newGame.content.locations.map((loc: any) => ({
            ...loc,
            puzzles: loc.puzzles?.map((puzzle: any) => 
              puzzle.id === puzzleId ? { ...puzzle, title: value } : puzzle
            ) || []
          }))
        }
      } else if (field.startsWith('puzzle-content-')) {
        const puzzleId = field.replace('puzzle-content-', '')
        if (newGame.content?.locations) {
          newGame.content.locations = newGame.content.locations.map((loc: any) => ({
            ...loc,
            puzzles: loc.puzzles?.map((puzzle: any) => 
              puzzle.id === puzzleId ? { ...puzzle, content: value } : puzzle
            ) || []
          }))
        }
      }
      
      return newGame
    })
    setEditingField(null)
    setIsSaving(false)
    
    // Show notification
    toast.success('Changes saved locally!')
  }

  const handleCancelEdit = () => {
    setEditingField(null)
    setIsEditing(false)
    setTempInputValue('')
    setIsSaving(false)
  }

  const handleSaveGame = () => {
    if (onSave) {
      onSave(editedGame)
      setIsEditing(false) // Auto-exit edit mode after saving
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
              {isEditing && editingField === 'title' ? (
                <div className="space-y-2">
                  <Input
                    value={editedGame.title}
                    onChange={(e) => setEditedGame((prev: any) => ({ ...prev, title: e.target.value }))}
                    className="text-3xl font-bold h-12 text-gray-900"
                    onBlur={(e) => handleSaveEdit('title', e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSaveEdit('title', e.currentTarget.value)
                      if (e.key === 'Escape') handleCancelEdit()
                    }}
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={(e) => {
                      const container = e.currentTarget.closest('.space-y-2')
                      if (container) {
                        const input = container.querySelector('input') as HTMLInputElement
                        if (input) handleSaveEdit('title', input.value)
                      }
                    }}>
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold text-gray-900">{editedGame.title}</h1>
                  {isEditing && (
                    <Button size="sm" variant="ghost" onClick={() => handleEdit('title')}>
                      <Edit3 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              )}
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{editedGame.city}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">{editedGame.estimatedDuration} min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Puzzle className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-600">
                    {editedGame.pubCount} pubs, {editedGame.puzzlesPerPub} puzzles each
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditing ? 'Exit Edit' : 'Edit Mode'}
            </Button>
            {isEditing && onSave && (
              <Button 
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleSaveGame()
                }} 
                className="flex items-center space-x-2"
                type="button"
              >
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </Button>
            )}
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
              <div className="flex items-center gap-1">
                <Badge className={getThemeColor(editedGame.theme)}>
                  {editedGame.theme}
              </Badge>
                {isEditing && (
                  <Button size="sm" variant="ghost" onClick={() => handleEdit('theme')}>
                    <Edit3 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <div className="flex items-center gap-1">
                <Badge className={getDifficultyColor(editedGame.difficulty)}>
                  {editedGame.difficulty}
              </Badge>
                {isEditing && (
                  <Button size="sm" variant="ghost" onClick={() => handleEdit('difficulty')}>
                    <Edit3 className="h-3 w-3" />
                  </Button>
                )}
              </div>
              
              <span className="text-sm text-gray-600">
                Created {new Date(game.createdAt).toLocaleDateString()}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Game Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="intro">Introduction</TabsTrigger>
            <TabsTrigger value="locations">Locations</TabsTrigger>
            <TabsTrigger value="route" className="flex items-center gap-1">
              Route Map
              {game.content.locations?.length > 0 && (
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              )}
            </TabsTrigger>
            <TabsTrigger value="resolution">Resolution</TabsTrigger>
            <TabsTrigger value="full">Full Game</TabsTrigger>
          </TabsList>

          <TabsContent value="intro" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  {isEditing && editingField === 'intro-title' ? (
                    <div className="space-y-2 flex-1">
                      <Input
                        value={editedGame.content?.intro?.title || ''}
                        onChange={(e) => setEditedGame((prev: any) => ({
                          ...prev,
                          content: {
                            ...prev.content,
                            intro: {
                              ...prev.content?.intro,
                              title: e.target.value
                            }
                          }
                        }))}
                        className="text-lg font-semibold"
                        onBlur={(e) => handleSaveEdit('intro-title', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit('intro-title', e.currentTarget.value)
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={(e) => {
                          const container = e.currentTarget.closest('.space-y-2')
                          if (container) {
                            const input = container.querySelector('input') as HTMLInputElement
                            if (input) handleSaveEdit('intro-title', input.value)
                          }
                        }}>
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CardTitle>{editedGame.content?.intro?.title || 'Introduction'}</CardTitle>
                      {isEditing && (
                        <Button size="sm" variant="ghost" onClick={() => handleEdit('intro-title')}>
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {isEditing && editingField === 'intro-content' ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editedGame.content?.intro?.content || ''}
                        onChange={(e) => setEditedGame((prev: any) => ({
                          ...prev,
                          content: {
                            ...prev.content,
                            intro: {
                              ...prev.content?.intro,
                              content: e.target.value
                            }
                          }
                        }))}
                        className="min-h-32"
                        onBlur={(e) => handleSaveEdit('intro-content', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) handleSaveEdit('intro-content', e.currentTarget.value)
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={(e) => {
                          const container = e.currentTarget.closest('.space-y-2')
                          if (container) {
                            const textarea = container.querySelector('textarea') as HTMLTextAreaElement
                            if (textarea) handleSaveEdit('intro-content', textarea.value)
                          }
                        }}>
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <p className="whitespace-pre-wrap flex-1">{editedGame.content?.intro?.content}</p>
                      {isEditing && (
                        <Button size="sm" variant="ghost" onClick={() => handleEdit('intro-content')}>
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                  {editedGame.content?.intro?.mapsLink && (
                    <div className="mt-4">
                      <a
                        href={editedGame.content.intro.mapsLink}
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
              {editedGame.content.locations?.map((location, index) => (
                <Card key={location.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      {isEditing && editingField === `location-name-${location.id}` ? (
                        <div className="space-y-2 flex-1">
                          <Input
                            value={tempInputValue}
                            onChange={(e) => {
                              setTempInputValue(e.target.value)
                            }}
                            className="text-lg font-semibold"
                            onBlur={(e) => {
                              handleSaveEdit(`location-name-${location.id}`, e.target.value)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleSaveEdit(`location-name-${location.id}`, e.currentTarget.value)
                              }
                              if (e.key === 'Escape') handleCancelEdit()
                            }}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={() => {
                              handleSaveEdit(`location-name-${location.id}`, tempInputValue)
                            }}>
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                    <CardTitle>
                      Pub #{index + 1} – {location.actualName || location.placeholderName}
                    </CardTitle>
                          {isEditing && (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(`location-name-${location.id}`)}>
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                    <CardDescription>
                      {location.venueType} • {location.puzzles?.length || 0} puzzles
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="prose max-w-none">
                      {isEditing && editingField === `location-narrative-${location.id}` ? (
                        <div className="space-y-2">
                          <Textarea
                            value={location.narrative || ''}
                            onChange={(e) => setEditedGame((prev: any) => ({
                              ...prev,
                              content: {
                                ...prev.content,
                                locations: prev.content.locations.map((loc: any) => 
                                  loc.id === location.id 
                                    ? { ...loc, narrative: e.target.value }
                                    : loc
                                )
                              }
                            }))}
                            className="min-h-24"
                            onBlur={(e) => handleSaveEdit(`location-narrative-${location.id}`, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.ctrlKey) handleSaveEdit(`location-narrative-${location.id}`, e.currentTarget.value)
                              if (e.key === 'Escape') handleCancelEdit()
                            }}
                            autoFocus
                          />
                          <div className="flex gap-2">
                            <Button size="sm" variant="ghost" onClick={(e) => {
                              const container = e.currentTarget.closest('.space-y-2')
                              if (container) {
                                const textarea = container.querySelector('textarea') as HTMLTextAreaElement
                                if (textarea) handleSaveEdit(`location-narrative-${location.id}`, textarea.value)
                              }
                            }}>
                              <Check className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <p className="whitespace-pre-wrap flex-1">{location.narrative}</p>
                          {isEditing && (
                            <Button size="sm" variant="ghost" onClick={() => handleEdit(`location-narrative-${location.id}`)}>
                              <Edit3 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>

                    {location.puzzles?.map((puzzle) => (
                      <Card key={puzzle.id} className="bg-gray-50">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            {isEditing && editingField === `puzzle-title-${puzzle.id}` ? (
                              <div className="space-y-2 flex-1">
                                <Input
                                  value={puzzle.title || ''}
                                  onChange={(e) => setEditedGame((prev: any) => ({
                                    ...prev,
                                    content: {
                                      ...prev.content,
                                      locations: prev.content.locations.map((loc: any) => 
                                        loc.id === location.id 
                                          ? {
                                              ...loc,
                                              puzzles: loc.puzzles.map((p: any) => 
                                                p.id === puzzle.id 
                                                  ? { ...p, title: e.target.value }
                                                  : p
                                              )
                                            }
                                          : loc
                                      )
                                    }
                                  }))}
                                  className="text-base font-semibold"
                                  onBlur={(e) => handleSaveEdit(`puzzle-title-${puzzle.id}`, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveEdit(`puzzle-title-${puzzle.id}`, e.currentTarget.value)
                                    if (e.key === 'Escape') handleCancelEdit()
                                  }}
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" onClick={(e) => {
                                    const container = e.currentTarget.closest('.space-y-2')
                                    if (container) {
                                      const input = container.querySelector('input') as HTMLInputElement
                                      if (input) handleSaveEdit(`puzzle-title-${puzzle.id}`, input.value)
                                    }
                                  }}>
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{puzzle.title}</CardTitle>
                                {isEditing && (
                                  <Button size="sm" variant="ghost" onClick={() => handleEdit(`puzzle-title-${puzzle.id}`)}>
                                    <Edit3 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                          <CardDescription>
                            {puzzle.type} • Difficulty: {puzzle.difficulty}/5
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="prose max-w-none">
                            <p className="whitespace-pre-wrap">{puzzle.narrative}</p>
                          </div>
                          <div className="prose max-w-none">
                            {isEditing && editingField === `puzzle-content-${puzzle.id}` ? (
                              <div className="space-y-2">
                                <Textarea
                                  value={puzzle.content || ''}
                                  onChange={(e) => setEditedGame((prev: any) => ({
                                    ...prev,
                                    content: {
                                      ...prev.content,
                                      locations: prev.content.locations.map((loc: any) => 
                                        loc.id === location.id 
                                          ? {
                                              ...loc,
                                              puzzles: loc.puzzles.map((p: any) => 
                                                p.id === puzzle.id 
                                                  ? { ...p, content: e.target.value }
                                                  : p
                                              )
                                            }
                                          : loc
                                      )
                                    }
                                  }))}
                                  className="min-h-24"
                                  onBlur={(e) => handleSaveEdit(`puzzle-content-${puzzle.id}`, e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.ctrlKey) handleSaveEdit(`puzzle-content-${puzzle.id}`, e.currentTarget.value)
                                    if (e.key === 'Escape') handleCancelEdit()
                                  }}
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <Button size="sm" variant="ghost" onClick={(e) => {
                                    const container = e.currentTarget.closest('.space-y-2')
                                    if (container) {
                                      const textarea = container.querySelector('textarea') as HTMLTextAreaElement
                                      if (textarea) handleSaveEdit(`puzzle-content-${puzzle.id}`, textarea.value)
                                    }
                                  }}>
                                    <Check className="h-3 w-3" />
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between">
                                <p className="whitespace-pre-wrap flex-1">{puzzle.content}</p>
                                {isEditing && (
                                  <Button size="sm" variant="ghost" onClick={() => handleEdit(`puzzle-content-${puzzle.id}`)}>
                                    <Edit3 className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                            )}
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

          <TabsContent value="route" className="space-y-4">
            <RouteMap 
              locations={editedGame.content.locations || []}
              city={editedGame.city}
              cityArea={undefined}
            />
          </TabsContent>

          <TabsContent value="resolution" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  {isEditing && editingField === 'resolution-title' ? (
                    <div className="space-y-2 flex-1">
                      <Input
                        value={editedGame.content?.resolution?.title || ''}
                        onChange={(e) => setEditedGame((prev: any) => ({
                          ...prev,
                          content: {
                            ...prev.content,
                            resolution: {
                              ...prev.content?.resolution,
                              title: e.target.value
                            }
                          }
                        }))}
                        className="text-lg font-semibold"
                        onBlur={(e) => handleSaveEdit('resolution-title', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveEdit('resolution-title', e.currentTarget.value)
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={(e) => {
                          const container = e.currentTarget.closest('.space-y-2')
                          if (container) {
                            const input = container.querySelector('input') as HTMLInputElement
                            if (input) handleSaveEdit('resolution-title', input.value)
                          }
                        }}>
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CardTitle>{editedGame.content?.resolution?.title || 'Resolution'}</CardTitle>
                      {isEditing && (
                        <Button size="sm" variant="ghost" onClick={() => handleEdit('resolution-title')}>
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  {isEditing && editingField === 'resolution-content' ? (
                    <div className="space-y-2">
                      <Textarea
                        value={editedGame.content?.resolution?.content || ''}
                        onChange={(e) => setEditedGame((prev: any) => ({
                          ...prev,
                          content: {
                            ...prev.content,
                            resolution: {
                              ...prev.content?.resolution,
                              content: e.target.value
                            }
                          }
                        }))}
                        className="min-h-32"
                        onBlur={(e) => handleSaveEdit('resolution-content', e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && e.ctrlKey) handleSaveEdit('resolution-content', e.currentTarget.value)
                          if (e.key === 'Escape') handleCancelEdit()
                        }}
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={(e) => {
                          const container = e.currentTarget.closest('.space-y-2')
                          if (container) {
                            const textarea = container.querySelector('textarea') as HTMLTextAreaElement
                            if (textarea) handleSaveEdit('resolution-content', textarea.value)
                          }
                        }}>
                          <Check className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleCancelEdit()}>
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <p className="whitespace-pre-wrap flex-1">{editedGame.content?.resolution?.content}</p>
                      {isEditing && (
                        <Button size="sm" variant="ghost" onClick={() => handleEdit('resolution-content')}>
                          <Edit3 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="full" className="space-y-4">
            <div className="prose max-w-none">
              <h2>{editedGame.content.intro?.title || 'Introduction'}</h2>
              <p className="whitespace-pre-wrap">{editedGame.content.intro?.content}</p>
              
              {editedGame.content.locations?.map((location, index) => (
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
              
              <h2>{editedGame.content.resolution?.title || 'Resolution'}</h2>
              <p className="whitespace-pre-wrap">{editedGame.content.resolution?.content}</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
