'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Wand2, BookOpen, Users, Target } from 'lucide-react'
import { toast } from 'sonner'

interface StoryGenerationStepProps {
  gameData: any
  onComplete: (data: any) => void
  onGenerate: () => void
  isLoading: boolean
}

export function StoryGenerationStep({ 
  gameData, 
  onComplete, 
  onGenerate, 
  isLoading 
}: StoryGenerationStepProps) {
  const [customInstructions, setCustomInstructions] = useState('')
  const [, setHasGenerated] = useState(false)

  const handleGenerate = async () => {
    try {
      await onGenerate()
      setHasGenerated(true)
    } catch {
      toast.error('Failed to generate story content')
    }
  }

  const handleContinue = () => {
    if (gameData.content) {
      onComplete({})
    } else {
      toast.error('Please generate story content first')
    }
  }

  const getThemeDescription = (theme: string) => {
    switch (theme) {
      case 'mystery': return 'A thrilling detective story with clues to uncover'
      case 'historical': return 'A journey through time with historical intrigue'
      case 'fantasy': return 'A magical adventure with enchanted elements'
      case 'sci-fi': return 'A futuristic tale with technological mysteries'
      case 'comedy': return 'A light-hearted adventure with humorous twists'
      case 'horror': return 'A spine-chilling story with supernatural elements'
      default: return 'An engaging adventure story'
    }
  }

  return (
    <div className="space-y-6">
      {/* Story Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <BookOpen className="h-5 w-5 mr-2" />
            Story Overview
          </CardTitle>
          <CardDescription>
            Your AI will generate a complete narrative framework for your game
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Game Title</Label>
                <div className="text-lg font-semibold">{gameData.title}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Theme</Label>
                <div className="text-lg font-semibold capitalize">{gameData.theme}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">City</Label>
                <div className="text-lg font-semibold">{gameData.city}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Area</Label>
                <div className="text-lg font-semibold">{gameData.cityArea || 'Entire city'}</div>
                {gameData.cityArea && (
                  <div className="mt-1 p-1 bg-green-50 border border-green-200 rounded text-xs text-green-800">
                    ✓ Custom area selected
                  </div>
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Location</Label>
                <div className="text-lg font-semibold">{gameData.city}</div>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Difficulty</Label>
                <div className="text-lg font-semibold capitalize">{gameData.difficulty}</div>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>Story Theme:</strong> {getThemeDescription(gameData.theme)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Custom Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Instructions (Optional)</CardTitle>
          <CardDescription>
            Add specific requirements or story elements you'd like to include
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="instructions">Additional Story Requirements</Label>
            <Textarea
              id="instructions"
              placeholder="e.g., Include a specific character type, reference local landmarks, incorporate a particular plot twist..."
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      {/* What Will Be Generated */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="h-5 w-5 mr-2" />
            What Will Be Generated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Story Framework</div>
                  <div className="text-sm text-gray-600">
                    Overarching narrative and central mystery/goal
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Character Types</div>
                  <div className="text-sm text-gray-600">
                    Detective contacts, witnesses, suspects
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Intro & Resolution</div>
                  <div className="text-sm text-gray-600">
                    Welcome message and conclusion
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Location Narratives</div>
                  <div className="text-sm text-gray-600">
                    Story context for each pub location
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Transition Text</div>
                  <div className="text-sm text-gray-600">
                    Story bridges between locations
                  </div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <div className="font-medium">Puzzle Framework</div>
                  <div className="text-sm text-gray-600">
                    Basic puzzle structure and types
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generation Status */}
      {gameData.content && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Story Generated Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-green-700">
              <div><strong>Title:</strong> {gameData.content.intro?.title}</div>
              <div><strong>Locations:</strong> {gameData.content.locations?.length || 0} pubs configured</div>
              <div><strong>Puzzles:</strong> {gameData.content.locations?.reduce((total: number, loc: any) => total + (loc.puzzles?.length || 0), 0) || 0} total puzzles</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          onClick={handleGenerate}
          disabled={isLoading}
          size="lg"
          className="flex items-center space-x-2"
        >
          <Wand2 className="h-5 w-5" />
          <span>
            {isLoading ? 'Generating Story...' : 'Generate Story Content'}
          </span>
        </Button>
      </div>

      {/* Continue Button */}
      {gameData.content && (
        <div className="flex justify-end">
          <Button onClick={handleContinue} size="lg">
            Continue to Location Setup
          </Button>
        </div>
      )}
    </div>
  )
}
