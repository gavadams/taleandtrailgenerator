'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Puzzle, Lightbulb, Plus, Trash2 } from 'lucide-react'
import { PuzzleType } from '@/types'

interface PuzzleGenerationStepProps {
  gameData: any
  onComplete: (data: any) => void
}

export function PuzzleGenerationStep({ gameData, onComplete }: PuzzleGenerationStepProps) {
  const [locations, setLocations] = useState(() => {
    if (gameData.content?.locations) {
      return gameData.content.locations.map((loc: any) => ({
        ...loc,
        puzzles: loc.puzzles || []
      }))
    }
    return []
  })

  const puzzleTypes: { value: PuzzleType; label: string; description: string }[] = [
    { value: 'logic', label: 'Logic Puzzle', description: 'Reasoning, deduction, elimination' },
    { value: 'observation', label: 'Observation', description: 'Visual clues, details, patterns' },
    { value: 'cipher', label: 'Cipher/Code', description: 'Encrypted messages, codes, symbols' },
    { value: 'deduction', label: 'Deduction', description: 'Eliminate suspects, find contradictions' },
    { value: 'local', label: 'Local Knowledge', description: 'Landmarks, street names, pub features' },
  ]

  const addPuzzle = (locationIndex: number) => {
    const newPuzzle = {
      id: `puzzle-${Date.now()}`,
      title: '',
      narrative: '',
      type: 'logic' as PuzzleType,
      content: '',
      answer: '',
      clues: [''],
      difficulty: 3,
      order: locations[locationIndex].puzzles.length + 1,
    }

    setLocations((prev: any[]) => prev.map((loc: any, index: number) => 
      index === locationIndex 
        ? { ...loc, puzzles: [...loc.puzzles, newPuzzle] }
        : loc
    ))
  }

  const removePuzzle = (locationIndex: number, puzzleIndex: number) => {
    setLocations((prev: any[]) => prev.map((loc: any, index: number) => 
      index === locationIndex 
        ? { ...loc, puzzles: loc.puzzles.filter((_: any, i: number) => i !== puzzleIndex) }
        : loc
    ))
  }

  const updatePuzzle = (locationIndex: number, puzzleIndex: number, field: string, value: any) => {
    setLocations((prev: any[]) => prev.map((loc: any, index: number) => 
      index === locationIndex 
        ? {
            ...loc,
            puzzles: loc.puzzles.map((puzzle: any, pIndex: number) => 
              pIndex === puzzleIndex ? { ...puzzle, [field]: value } : puzzle
            )
          }
        : loc
    ))
  }

  const updateClue = (locationIndex: number, puzzleIndex: number, clueIndex: number, value: string) => {
    setLocations((prev: any[]) => prev.map((loc: any, index: number) => 
      index === locationIndex 
        ? {
            ...loc,
            puzzles: loc.puzzles.map((puzzle: any, pIndex: number) => 
              pIndex === puzzleIndex 
                ? {
                    ...puzzle,
                    clues: puzzle.clues.map((clue: string, cIndex: number) => 
                      cIndex === clueIndex ? value : clue
                    )
                  }
                : puzzle
            )
          }
        : loc
    ))
  }

  const addClue = (locationIndex: number, puzzleIndex: number) => {
    setLocations((prev: any[]) => prev.map((loc: any, index: number) => 
      index === locationIndex 
        ? {
            ...loc,
            puzzles: loc.puzzles.map((puzzle: any, pIndex: number) => 
              pIndex === puzzleIndex 
                ? { ...puzzle, clues: [...puzzle.clues, ''] }
                : puzzle
            )
          }
        : loc
    ))
  }

  const removeClue = (locationIndex: number, puzzleIndex: number, clueIndex: number) => {
    setLocations((prev: any[]) => prev.map((loc: any, index: number) => 
      index === locationIndex 
        ? {
            ...loc,
            puzzles: loc.puzzles.map((puzzle: any, pIndex: number) => 
              pIndex === puzzleIndex 
                ? {
                    ...puzzle,
                    clues: puzzle.clues.filter((_: string, cIndex: number) => cIndex !== clueIndex)
                  }
                : puzzle
            )
          }
        : loc
    ))
  }

  const handleContinue = () => {
    const updatedContent = {
      ...gameData.content,
      locations: locations
    }

    onComplete({ content: updatedContent })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Puzzle className="h-5 w-5 mr-2" />
            Puzzle Generation
          </CardTitle>
          <CardDescription>
            Create and configure puzzles for each location in your game
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {locations.map((location: any, locationIndex: number) => (
              <Card key={location.id} className="border-l-4 border-l-green-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {location.placeholderName} - {location.actualName || 'Unnamed Pub'}
                    </CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addPuzzle(locationIndex)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Puzzle
                    </Button>
                  </div>
                  <CardDescription>
                    {location.puzzles.length} of {gameData.puzzlesPerPub} puzzles
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {location.puzzles.map((puzzle: any, puzzleIndex: number) => (
                      <Card key={puzzle.id} className="bg-gray-50">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-base">
                              Puzzle {puzzleIndex + 1}
                            </CardTitle>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePuzzle(locationIndex, puzzleIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Puzzle Title</Label>
                              <Input
                                placeholder="e.g., The Shipping Ledger"
                                value={puzzle.title}
                                onChange={(e) => updatePuzzle(locationIndex, puzzleIndex, 'title', e.target.value)}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Puzzle Type</Label>
                              <Select
                                value={puzzle.type}
                                onValueChange={(value) => updatePuzzle(locationIndex, puzzleIndex, 'type', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {puzzleTypes.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                      {type.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Narrative Context</Label>
                            <Textarea
                              placeholder="Describe the story context for this puzzle..."
                              value={puzzle.narrative}
                              onChange={(e) => updatePuzzle(locationIndex, puzzleIndex, 'narrative', e.target.value)}
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Puzzle Content</Label>
                            <Textarea
                              placeholder="The actual puzzle text, data, or instructions..."
                              value={puzzle.content}
                              onChange={(e) => updatePuzzle(locationIndex, puzzleIndex, 'content', e.target.value)}
                              rows={4}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Correct Answer</Label>
                            <Input
                              placeholder="The correct answer to the puzzle"
                              value={puzzle.answer}
                              onChange={(e) => updatePuzzle(locationIndex, puzzleIndex, 'answer', e.target.value)}
                            />
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="flex items-center">
                                <Lightbulb className="h-4 w-4 mr-1" />
                                Progressive Clues
                              </Label>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addClue(locationIndex, puzzleIndex)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add Clue
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {puzzle.clues.map((clue: string, clueIndex: number) => (
                                <div key={clueIndex} className="flex items-center space-x-2">
                                  <span className="text-sm font-medium w-8">
                                    {clueIndex + 1}.
                                  </span>
                                  <Input
                                    placeholder={`Clue ${clueIndex + 1} - Hint for stuck players`}
                                    value={clue}
                                    onChange={(e) => updateClue(locationIndex, puzzleIndex, clueIndex, e.target.value)}
                                  />
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeClue(locationIndex, puzzleIndex, clueIndex)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Difficulty (1-5)</Label>
                            <Select
                              value={puzzle.difficulty.toString()}
                              onValueChange={(value) => updatePuzzle(locationIndex, puzzleIndex, 'difficulty', parseInt(value))}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {[1, 2, 3, 4, 5].map((level) => (
                                  <SelectItem key={level} value={level.toString()}>
                                    Level {level}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleContinue} size="lg">
          Continue to Review
        </Button>
      </div>
    </div>
  )
}
