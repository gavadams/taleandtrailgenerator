'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Puzzle, Lightbulb, Plus, Trash2 } from 'lucide-react'
import { PuzzleType, PuzzleMechanic, PuzzleCategory } from '@/types'

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

  const puzzleTypes: { value: PuzzleType; label: string; description: string; category: string }[] = [
    { value: 'logic', label: 'Logic Puzzle', description: 'Complex reasoning, syllogisms, conditional statements', category: 'Reasoning' },
    { value: 'observation', label: 'Observation', description: 'Environmental storytelling, visual pattern recognition', category: 'Analytical' },
    { value: 'cipher', label: 'Cipher/Code', description: 'Multi-layer encryption, historical ciphers, substitution codes', category: 'Contextual' },
    { value: 'deduction', label: 'Deduction', description: 'Evidence correlation, timeline reconstruction, alibi verification', category: 'Reasoning' },
    { value: 'local', label: 'Local Knowledge', description: 'Historical events, architectural details, cultural references', category: 'Contextual' },
    { value: 'wordplay', label: 'Wordplay', description: 'Sophisticated anagrams, cryptic clues, linguistic patterns', category: 'Creative' },
    { value: 'math', label: 'Mathematical', description: 'Geometric patterns, statistical analysis, algorithmic thinking', category: 'Analytical' },
    { value: 'pattern', label: 'Pattern Recognition', description: 'Complex sequences, fractal patterns, recursive logic', category: 'Analytical' },
    { value: 'physical', label: 'Physical', description: 'Hands-on puzzles requiring manipulation and assembly', category: 'Physical' },
    { value: 'social', label: 'Social', description: 'Interaction with people, interviews, collaborative problem-solving', category: 'Social' },
    { value: 'memory', label: 'Memory', description: 'Recall, sequence memorization, information retention', category: 'Analytical' },
    { value: 'creative', label: 'Creative', description: 'Artistic expression, storytelling, creative problem-solving', category: 'Creative' },
    { value: 'technology', label: 'Technology', description: 'Modern technology, QR codes, apps, digital elements', category: 'Technological' },
    { value: 'meta-puzzle', label: 'Meta-Puzzle', description: 'Understanding overall game structure, connecting solutions', category: 'Reasoning' },
  ]

  const puzzleMechanics: { value: PuzzleMechanic; label: string; description: string }[] = [
    { value: 'multi-step', label: 'Multi-Step', description: 'Requires solving multiple sub-puzzles' },
    { value: 'progressive', label: 'Progressive', description: 'Builds on previous solutions' },
    { value: 'collaborative', label: 'Collaborative', description: 'Requires team coordination' },
    { value: 'time-sensitive', label: 'Time-Sensitive', description: 'Has countdown or time pressure' },
    { value: 'environmental', label: 'Environmental', description: 'Uses pub\'s actual features' },
    { value: 'cross-reference', label: 'Cross-Reference', description: 'Connects information from multiple locations' },
    { value: 'hybrid', label: 'Hybrid', description: 'Combines multiple puzzle types' },
    { value: 'meta-puzzle', label: 'Meta-Puzzle', description: 'Requires understanding overall game structure' },
    { value: 'red-herring', label: 'Red Herring', description: 'Misleads but provides valuable information' },
    { value: 'progressive-difficulty', label: 'Progressive Difficulty', description: 'Starts easy but becomes more complex' },
  ]

  const addPuzzle = (locationIndex: number) => {
    const newPuzzle = {
      id: `puzzle-${Date.now()}`,
      title: '',
      narrative: '',
      type: 'logic' as PuzzleType,
      category: 'reasoning' as PuzzleCategory,
      mechanics: [] as PuzzleMechanic[],
      content: '',
      answer: '',
      clues: [''],
      difficulty: 3,
      order: locations[locationIndex].puzzles.length + 1,
      localContext: '',
      materials: [],
      instructions: '',
      requiresTeamwork: false,
      requiresPhysicalInteraction: false,
      requiresLocalKnowledge: false,
      isMultiStep: false,
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
                            <div className="space-y-2">
                              <Label>Puzzle Category</Label>
                              <Select
                                value={puzzle.category || 'reasoning'}
                                onValueChange={(value) => updatePuzzle(locationIndex, puzzleIndex, 'category', value)}
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="reasoning">Reasoning</SelectItem>
                                  <SelectItem value="creative">Creative</SelectItem>
                                  <SelectItem value="analytical">Analytical</SelectItem>
                                  <SelectItem value="contextual">Contextual</SelectItem>
                                  <SelectItem value="physical">Physical</SelectItem>
                                  <SelectItem value="social">Social</SelectItem>
                                  <SelectItem value="technological">Technological</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label>Puzzle Mechanics</Label>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                              {puzzleMechanics.map((mechanic) => (
                                <label key={mechanic.value} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={puzzle.mechanics?.includes(mechanic.value) || false}
                                    onChange={(e) => {
                                      const currentMechanics = puzzle.mechanics || []
                                      const newMechanics = e.target.checked
                                        ? [...currentMechanics, mechanic.value]
                                        : currentMechanics.filter((m: PuzzleMechanic) => m !== mechanic.value)
                                      updatePuzzle(locationIndex, puzzleIndex, 'mechanics', newMechanics)
                                    }}
                                    className="rounded"
                                  />
                                  <span className="text-sm">{mechanic.label}</span>
                                </label>
                              ))}
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

                          <div className="space-y-2">
                            <Label>Local Context</Label>
                            <Textarea
                              placeholder="How this puzzle relates to the pub/city specifically..."
                              value={puzzle.localContext || ''}
                              onChange={(e) => updatePuzzle(locationIndex, puzzleIndex, 'localContext', e.target.value)}
                              rows={2}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Materials/Props</Label>
                            <Input
                              placeholder="e.g., Lock pieces, QR code, Historical documents"
                              value={puzzle.materials?.join(', ') || ''}
                              onChange={(e) => updatePuzzle(locationIndex, puzzleIndex, 'materials', e.target.value.split(',').map(m => m.trim()).filter(m => m))}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>Special Instructions</Label>
                            <Textarea
                              placeholder="Any special instructions for this puzzle..."
                              value={puzzle.instructions || ''}
                              onChange={(e) => updatePuzzle(locationIndex, puzzleIndex, 'instructions', e.target.value)}
                              rows={2}
                            />
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={puzzle.requiresTeamwork || false}
                                onChange={(e) => updatePuzzle(locationIndex, puzzleIndex, 'requiresTeamwork', e.target.checked)}
                                className="rounded"
                              />
                              <span className="text-sm">Requires Teamwork</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={puzzle.requiresPhysicalInteraction || false}
                                onChange={(e) => updatePuzzle(locationIndex, puzzleIndex, 'requiresPhysicalInteraction', e.target.checked)}
                                className="rounded"
                              />
                              <span className="text-sm">Physical Interaction</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={puzzle.requiresLocalKnowledge || false}
                                onChange={(e) => updatePuzzle(locationIndex, puzzleIndex, 'requiresLocalKnowledge', e.target.checked)}
                                className="rounded"
                              />
                              <span className="text-sm">Local Knowledge</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={puzzle.isMultiStep || false}
                                onChange={(e) => updatePuzzle(locationIndex, puzzleIndex, 'isMultiStep', e.target.checked)}
                                className="rounded"
                              />
                              <span className="text-sm">Multi-Step</span>
                            </label>
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
