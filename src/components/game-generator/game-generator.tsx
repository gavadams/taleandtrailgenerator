'use client'

import { useState } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Game, GameGenerationState } from '@/types'
// Removed direct database import - using API calls instead
// Removed direct AI service import - using API route instead
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Wand2 } from 'lucide-react'
import { GameSetupStep } from './steps/game-setup-step'
import { CityAreaStep } from './steps/city-area-step'
import { StoryGenerationStep } from './steps/story-generation-step'
import { LocationSetupStep } from './steps/location-setup-step'
import { PuzzleGenerationStep } from './steps/puzzle-generation-step'
import { ReviewStep } from './steps/review-step'

interface GameGeneratorProps {
  game?: Game
  onBack: () => void
  onGameCreated: () => void
}

export function GameGenerator({ game, onBack, onGameCreated }: GameGeneratorProps) {
  const { user } = useAuth()
  const [generationState, setGenerationState] = useState<GameGenerationState>({
    currentStep: 0,
    steps: [
      { id: 'setup', title: 'Game Setup', description: 'Choose theme, city, and settings', completed: false },
      { id: 'area', title: 'City Area', description: 'Select specific area/neighborhood', completed: false },
      { id: 'story', title: 'Story Generation', description: 'Generate overarching narrative', completed: false },
      { id: 'locations', title: 'Location Setup', description: 'Configure pub locations', completed: false },
      { id: 'puzzles', title: 'Puzzle Generation', description: 'Create puzzles and clues', completed: false },
      { id: 'review', title: 'Review & Save', description: 'Review and save your game', completed: false },
    ],
    gameData: game ? {
      title: game.title,
      theme: game.theme,
      city: game.city,
      difficulty: game.difficulty,
      estimatedDuration: game.estimatedDuration,
      pubCount: game.pubCount,
      puzzlesPerPub: game.puzzlesPerPub,
    } : {},
    isLoading: false,
  })

  const [aiProvider, setAiProvider] = useState<'openai' | 'anthropic' | 'google'>('google')

  const handleStepComplete = (stepId: string, data: any) => {
    console.log(`Step ${stepId} completed with data:`, data)
    setGenerationState(prev => ({
      ...prev,
      steps: prev.steps.map(step => 
        step.id === stepId ? { ...step, completed: true, data } : step
      ),
      gameData: { ...prev.gameData, ...data },
      currentStep: Math.min(prev.currentStep + 1, prev.steps.length - 1)
    }))
    
    // Scroll to top when moving to next step
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStepBack = () => {
    setGenerationState(prev => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0)
    }))
    
    // Scroll to top when going back to previous step
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleGenerateContent = async () => {
    if (!user) return

    setGenerationState(prev => ({ ...prev, isLoading: true }))

    try {
      const request = {
        provider: aiProvider,
        theme: generationState.gameData.theme!,
        city: generationState.gameData.city!,
        cityArea: (generationState.gameData as any).cityArea,
        difficulty: generationState.gameData.difficulty!,
        pubCount: generationState.gameData.pubCount!,
        puzzlesPerPub: generationState.gameData.puzzlesPerPub!,
        estimatedDuration: generationState.gameData.estimatedDuration!,
      }
      
      console.log('Frontend sending request:', request)
      console.log('Custom area being sent:', request.cityArea)

      const response = await fetch('/api/generate-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        console.error('Response status:', response.status)
        
        // Provide more helpful error messages
        if (errorData.error?.includes('parse AI response')) {
          throw new Error('The AI generated content in an unexpected format. Please try again with different settings.')
        } else if (errorData.error?.includes('API key')) {
          throw new Error('AI service configuration issue. Please check your API keys.')
        } else {
          throw new Error(errorData.error || 'Failed to generate game content. Please try again.')
        }
      }

      const responseData = await response.json()
      
      setGenerationState(prev => ({
        ...prev,
        gameData: {
          ...prev.gameData,
          content: {
            intro: responseData.story.intro,
            locations: responseData.locations.map((loc: any, index: number) => ({
              ...loc,
              id: `loc-${index}`,
              puzzles: responseData.puzzles
                .filter((p: any) => p.order === index + 1)
                .map((puzzle: any, pIndex: number) => ({
                  ...puzzle,
                  id: `puzzle-${index}-${pIndex}`,
                }))
            })),
            resolution: responseData.story.resolution,
          },
          locationPlaceholders: responseData.locations.reduce((acc: any, loc: any, index: number) => ({
            ...acc,
            [loc.placeholderName]: {
              name: loc.actualName || `Pub ${index + 1}`,
              venueType: loc.venueType,
              mapsLink: loc.mapsLink,
            }
          }), {}),
        },
        isLoading: false,
      }))

      toast.success('Content generated successfully!')
    } catch (error) {
      console.error('Error generating content:', error)
      toast.error('Failed to generate content. Please try again.')
      setGenerationState(prev => ({ ...prev, isLoading: false }))
    }
  }

  const handleSaveGame = async () => {
    if (!user || !generationState.gameData.content) return

    try {
      const gameData = {
        title: generationState.gameData.title!,
        theme: generationState.gameData.theme!,
        city: generationState.gameData.city!,
        difficulty: generationState.gameData.difficulty!,
        estimatedDuration: generationState.gameData.estimatedDuration!,
        pubCount: generationState.gameData.pubCount!,
        puzzlesPerPub: generationState.gameData.puzzlesPerPub!,
        content: generationState.gameData.content,
        locationPlaceholders: generationState.gameData.locationPlaceholders || {},
      }

      const url = game ? `/api/games/${game.id}` : '/api/games'
      const method = game ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gameData),
      })

      if (response.ok) {
        toast.success(game ? 'Game updated successfully!' : 'Game created successfully!')
        onGameCreated()
      } else {
        throw new Error('Failed to save game')
      }
    } catch (error) {
      console.error('Error saving game:', error)
      toast.error('Failed to save game. Please try again.')
    }
  }

  const currentStep = generationState.steps[generationState.currentStep]
  const canProceed = currentStep?.completed || generationState.currentStep === 0

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
              <h1 className="text-3xl font-bold text-gray-900">
                {game ? 'Edit Game' : 'Create New Game'}
              </h1>
              <p className="text-gray-600 mt-1">
                Generate a custom pub crawl mystery game
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <Card>
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              {generationState.steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    index <= generationState.currentStep
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}>
                    {index < generationState.currentStep ? (
                      <span className="text-sm">✓</span>
                    ) : (
                      <span className="text-sm font-medium">{index + 1}</span>
                    )}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      index <= generationState.currentStep ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </div>
                    <div className="text-xs text-gray-500">{step.description}</div>
                  </div>
                  {index < generationState.steps.length - 1 && (
                    <div className={`w-16 h-0.5 mx-4 ${
                      index < generationState.currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Provider Selection */}
        {generationState.currentStep >= 1 && generationState.currentStep <= 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Wand2 className="h-5 w-5 mr-2" />
                AI Content Generation
              </CardTitle>
              <CardDescription>
                Choose your AI provider for content generation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Button
                  variant={aiProvider === 'openai' ? 'default' : 'outline'}
                  onClick={() => setAiProvider('openai')}
                >
                  OpenAI GPT-4
                </Button>
                <Button
                  variant={aiProvider === 'anthropic' ? 'default' : 'outline'}
                  onClick={() => setAiProvider('anthropic')}
                >
                  Anthropic Claude
                </Button>
                <Button
                  variant={aiProvider === 'google' ? 'default' : 'outline'}
                  onClick={() => setAiProvider('google')}
                >
                  Google Gemini
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step Content */}
        <div className="space-y-6">
          {generationState.currentStep === 0 && (
            <GameSetupStep
              initialData={generationState.gameData}
              onComplete={(data) => handleStepComplete('setup', data)}
            />
          )}

          {generationState.currentStep === 1 && (
            <CityAreaStep
              initialData={generationState.gameData}
              onComplete={(data) => handleStepComplete('area', data)}
            />
          )}

          {generationState.currentStep === 2 && (
            <StoryGenerationStep
              gameData={generationState.gameData}
              onComplete={(data) => handleStepComplete('story', data)}
              onGenerate={handleGenerateContent}
              isLoading={generationState.isLoading}
            />
          )}

          {generationState.currentStep === 3 && (
            <LocationSetupStep
              gameData={generationState.gameData}
              onComplete={(data) => handleStepComplete('locations', data)}
            />
          )}

          {generationState.currentStep === 4 && (
            <PuzzleGenerationStep
              gameData={generationState.gameData}
              onComplete={(data) => handleStepComplete('puzzles', data)}
            />
          )}

          {generationState.currentStep === 5 && (
            <ReviewStep
              gameData={generationState.gameData}
              onSave={handleSaveGame}
              onBack={handleStepBack}
            />
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleStepBack}
            disabled={generationState.currentStep === 0}
          >
            Previous
          </Button>
          
          {generationState.currentStep < generationState.steps.length - 1 && (
            <Button
              onClick={() => {
                setGenerationState(prev => ({
                  ...prev,
                  currentStep: prev.currentStep + 1
                }))
                // Scroll to top when clicking Next
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              disabled={!canProceed}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
