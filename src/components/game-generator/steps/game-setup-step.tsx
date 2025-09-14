'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Theme, Difficulty, PuzzleType, PuzzleMechanic } from '@/types'
import { Settings, MapPin, Puzzle, Clock } from 'lucide-react'

interface GameSetupStepProps {
  initialData: any
  onComplete: (data: any) => void
  onDataChange?: (data: any) => void // Add callback for data changes
}

export function GameSetupStep({ initialData, onComplete, onDataChange }: GameSetupStepProps) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    theme: initialData.theme || '',
    city: initialData.city || '',
    difficulty: initialData.difficulty || '',
    estimatedDuration: initialData.estimatedDuration || 120,
    pubCount: initialData.pubCount || 5,
    puzzlesPerPub: initialData.puzzlesPerPub || 2,
    // Puzzle preferences
    preferredPuzzleTypes: initialData.preferredPuzzleTypes || [],
    preferredMechanics: initialData.preferredMechanics || [],
    difficultyRange: initialData.difficultyRange || [2, 4],
    includePhysicalPuzzles: initialData.includePhysicalPuzzles || false,
    includeSocialPuzzles: initialData.includeSocialPuzzles || false,
    includeTechnologyPuzzles: initialData.includeTechnologyPuzzles || false,
    requireTeamwork: initialData.requireTeamwork || false,
    requireLocalKnowledge: initialData.requireLocalKnowledge || false,
  })

  const themes: { value: Theme; label: string; description: string }[] = [
    { value: 'mystery', label: 'Mystery', description: 'Detective stories, crime solving, investigations' },
    { value: 'historical', label: 'Historical', description: 'Period pieces, historical events, time travel' },
    { value: 'fantasy', label: 'Fantasy', description: 'Magic, mythical creatures, enchanted adventures' },
    { value: 'sci-fi', label: 'Sci-Fi', description: 'Futuristic, technology, space exploration' },
    { value: 'comedy', label: 'Comedy', description: 'Humorous situations, light-hearted fun' },
    { value: 'horror', label: 'Horror', description: 'Spooky stories, supernatural elements' },
  ]

  const difficulties: { value: Difficulty; label: string; description: string }[] = [
    { value: 'easy', label: 'Easy', description: 'Simple puzzles, clear clues, 1-2 hours' },
    { value: 'medium', label: 'Medium', description: 'Moderate challenge, some complex puzzles, 2-3 hours' },
    { value: 'hard', label: 'Hard', description: 'Complex puzzles, cryptic clues, 3+ hours' },
  ]

  const puzzleTypes: { value: PuzzleType; label: string; description: string }[] = [
    { value: 'logic', label: 'Logic', description: 'Reasoning and deduction puzzles' },
    { value: 'observation', label: 'Observation', description: 'Visual and environmental puzzles' },
    { value: 'cipher', label: 'Cipher', description: 'Code-breaking and encryption puzzles' },
    { value: 'deduction', label: 'Deduction', description: 'Evidence analysis and timeline puzzles' },
    { value: 'local', label: 'Local Knowledge', description: 'Area-specific and historical puzzles' },
    { value: 'wordplay', label: 'Wordplay', description: 'Anagrams and linguistic puzzles' },
    { value: 'math', label: 'Mathematical', description: 'Number and pattern puzzles' },
    { value: 'pattern', label: 'Pattern Recognition', description: 'Sequence and pattern puzzles' },
    { value: 'physical', label: 'Physical', description: 'Hands-on manipulation puzzles' },
    { value: 'social', label: 'Social', description: 'Interview and interaction puzzles' },
    { value: 'memory', label: 'Memory', description: 'Recall and memorization puzzles' },
    { value: 'creative', label: 'Creative', description: 'Artistic and storytelling puzzles' },
    { value: 'technology', label: 'Technology', description: 'Digital and modern tech puzzles' },
    { value: 'meta-puzzle', label: 'Meta-Puzzle', description: 'Overall game structure puzzles' },
  ]

  const puzzleMechanics: { value: PuzzleMechanic; label: string; description: string }[] = [
    { value: 'multi-step', label: 'Multi-Step', description: 'Puzzles with multiple sub-puzzles' },
    { value: 'progressive', label: 'Progressive', description: 'Puzzles that build on previous solutions' },
    { value: 'collaborative', label: 'Collaborative', description: 'Team coordination required' },
    { value: 'time-sensitive', label: 'Time-Sensitive', description: 'Countdown or time pressure' },
    { value: 'environmental', label: 'Environmental', description: 'Uses pub features and surroundings' },
    { value: 'cross-reference', label: 'Cross-Reference', description: 'Connects multiple locations' },
    { value: 'hybrid', label: 'Hybrid', description: 'Combines multiple puzzle types' },
    { value: 'red-herring', label: 'Red Herring', description: 'Misleads but provides information' },
    { value: 'progressive-difficulty', label: 'Progressive Difficulty', description: 'Starts easy, becomes complex' },
  ]

  // Auto-save form data changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData)
    }
  }, [formData, onDataChange])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  const isFormValid = formData.title && 
    formData.theme && 
    formData.city && 
    formData.difficulty &&
    (formData.preferredPuzzleTypes.length === 0 || (formData.preferredPuzzleTypes.length >= 3 && formData.preferredPuzzleTypes.length <= 6)) &&
    (formData.preferredMechanics.length === 0 || (formData.preferredMechanics.length >= 2 && formData.preferredMechanics.length <= 4))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Settings className="h-5 w-5 mr-2" />
          Game Setup
        </CardTitle>
        <CardDescription>
          Configure the basic settings for your pub crawl game
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Game Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Game Title</Label>
            <Input
              id="title"
              placeholder="e.g., The Quayside Conspiracy"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Theme Selection */}
          <div className="space-y-2">
            <Label>Theme</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {themes.map((theme) => (
                <Card
                  key={theme.value}
                  className={`cursor-pointer transition-colors ${
                    formData.theme === theme.value
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, theme: theme.value }))}
                >
                  <CardContent className="p-4">
                    <div className="font-medium">{theme.label}</div>
                    <div className="text-sm text-gray-600">{theme.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              City/Area
            </Label>
            <Input
              id="city"
              placeholder="e.g., Newcastle, London, Manchester"
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              required
            />
          </div>

          {/* Difficulty */}
          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {difficulties.map((difficulty) => (
                <Card
                  key={difficulty.value}
                  className={`cursor-pointer transition-colors ${
                    formData.difficulty === difficulty.value
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, difficulty: difficulty.value }))}
                >
                  <CardContent className="p-4">
                    <div className="font-medium">{difficulty.label}</div>
                    <div className="text-sm text-gray-600">{difficulty.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Game Structure */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="pubCount" className="flex items-center">
                <Puzzle className="h-4 w-4 mr-1" />
                Number of Pubs
              </Label>
              <Select
                value={formData.pubCount.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, pubCount: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 6, 7, 8].map((count) => (
                    <SelectItem key={count} value={count.toString()}>
                      {count} pubs
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="puzzlesPerPub">Puzzles per Pub</Label>
              <Select
                value={formData.puzzlesPerPub.toString()}
                onValueChange={(value) => setFormData(prev => ({ ...prev, puzzlesPerPub: parseInt(value) }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4].map((count) => (
                    <SelectItem key={count} value={count.toString()}>
                      {count} puzzles
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Duration (minutes)
              </Label>
              <Input
                id="duration"
                type="number"
                min="60"
                max="480"
                step="30"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
              />
            </div>
          </div>

          {/* Puzzle Preferences */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Puzzle className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold">Puzzle Preferences</h3>
            </div>

            {/* Preferred Puzzle Types */}
            <div className="space-y-3">
              <Label>Preferred Puzzle Types (Optional - Select 3-6 types if you want to influence generation)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {puzzleTypes.map((type) => (
                  <label key={type.value} className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.preferredPuzzleTypes.includes(type.value)}
                      onChange={(e) => {
                        const newTypes = e.target.checked
                          ? [...formData.preferredPuzzleTypes, type.value]
                          : formData.preferredPuzzleTypes.filter((t: PuzzleType) => t !== type.value)
                        setFormData(prev => ({ ...prev, preferredPuzzleTypes: newTypes }))
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{type.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Preferred Mechanics */}
            <div className="space-y-3">
              <Label>Preferred Mechanics (Optional - Select 2-4 mechanics if you want to influence generation)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {puzzleMechanics.map((mechanic) => (
                  <label key={mechanic.value} className="flex items-center space-x-2 p-2 rounded border hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={formData.preferredMechanics.includes(mechanic.value)}
                      onChange={(e) => {
                        const newMechanics = e.target.checked
                          ? [...formData.preferredMechanics, mechanic.value]
                          : formData.preferredMechanics.filter((m: PuzzleMechanic) => m !== mechanic.value)
                        setFormData(prev => ({ ...prev, preferredMechanics: newMechanics }))
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{mechanic.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Requirements */}
            <div className="space-y-3">
              <Label>Special Requirements</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.includePhysicalPuzzles}
                    onChange={(e) => setFormData(prev => ({ ...prev, includePhysicalPuzzles: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include Physical Puzzles</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.includeSocialPuzzles}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeSocialPuzzles: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include Social Puzzles</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.includeTechnologyPuzzles}
                    onChange={(e) => setFormData(prev => ({ ...prev, includeTechnologyPuzzles: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Include Technology Puzzles</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.requireTeamwork}
                    onChange={(e) => setFormData(prev => ({ ...prev, requireTeamwork: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Require Teamwork</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.requireLocalKnowledge}
                    onChange={(e) => setFormData(prev => ({ ...prev, requireLocalKnowledge: e.target.checked }))}
                    className="rounded"
                  />
                  <span className="text-sm">Require Local Knowledge</span>
                </label>
              </div>
            </div>

            {/* Difficulty Range */}
            <div className="space-y-3">
              <Label>Puzzle Difficulty Range</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minDifficulty">Minimum Difficulty</Label>
                  <Select
                    value={formData.difficultyRange[0].toString()}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      difficultyRange: [parseInt(value), prev.difficultyRange[1]] 
                    }))}
                  >
                    <SelectTrigger>
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
                  <Label htmlFor="maxDifficulty">Maximum Difficulty</Label>
                  <Select
                    value={formData.difficultyRange[1].toString()}
                    onValueChange={(value) => setFormData(prev => ({ 
                      ...prev, 
                      difficultyRange: [prev.difficultyRange[0], parseInt(value)] 
                    }))}
                  >
                    <SelectTrigger>
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
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!isFormValid}>
              Continue to Story Generation
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
