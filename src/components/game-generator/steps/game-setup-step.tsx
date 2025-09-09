'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Theme, Difficulty } from '@/types'
import { Settings, MapPin, Puzzle, Clock } from 'lucide-react'

interface GameSetupStepProps {
  initialData: any
  onComplete: (data: any) => void
}

export function GameSetupStep({ initialData, onComplete }: GameSetupStepProps) {
  const [formData, setFormData] = useState({
    title: initialData.title || '',
    theme: initialData.theme || '',
    city: initialData.city || '',
    difficulty: initialData.difficulty || '',
    estimatedDuration: initialData.estimatedDuration || 120,
    pubCount: initialData.pubCount || 5,
    puzzlesPerPub: initialData.puzzlesPerPub || 2,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onComplete(formData)
  }

  const isFormValid = formData.title && formData.theme && formData.city && formData.difficulty

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
