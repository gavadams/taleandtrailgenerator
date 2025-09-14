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
    
    // Clear current step form data
    setCurrentStepFormData(null)
    
    // Scroll to top when going back to previous step
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleStepNext = () => {
    // Save current step data before moving to next step
    const currentStepData = getCurrentStepData()
    if (currentStepData) {
      handleStepComplete(getCurrentStepId(), currentStepData)
    } else {
      // If no data to save, just move to next step
      setGenerationState(prev => ({
        ...prev,
        currentStep: Math.min(prev.currentStep + 1, prev.steps.length - 1)
      }))
    }
    
    // Clear current step form data
    setCurrentStepFormData(null)
    
    // Scroll to top when moving to next step
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const getCurrentStepId = () => {
    const stepMap = ['setup', 'area', 'story', 'locations', 'puzzles', 'review']
    return stepMap[generationState.currentStep] || 'unknown'
  }

  const [currentStepFormData, setCurrentStepFormData] = useState<any>(null)

  const getCurrentStepData = () => {
    // Return the current step's form data if available, otherwise fall back to gameData
    return currentStepFormData || generationState.gameData
  }

  const handleGenerateContent = async (retryCount = 0) => {
    if (!user) return

    setGenerationState(prev => ({ ...prev, isLoading: true }))

    try {
      // Direct AI generation with BarCrawl integration
      const request = {
        provider: aiProvider,
        theme: generationState.gameData.theme!,
        city: generationState.gameData.city!,
        cityArea: (generationState.gameData as any).cityArea,
        difficulty: generationState.gameData.difficulty!,
        pubCount: generationState.gameData.pubCount!,
        puzzlesPerPub: generationState.gameData.puzzlesPerPub!,
        estimatedDuration: generationState.gameData.estimatedDuration!,
        customInstructions: (generationState.gameData as any).customInstructions,
        simplifiedPrompt: retryCount > 0, // Use simplified prompt for retries
        // Puzzle preferences
        preferredPuzzleTypes: (generationState.gameData as any).preferredPuzzleTypes,
        preferredMechanics: (generationState.gameData as any).preferredMechanics,
        difficultyRange: (generationState.gameData as any).difficultyRange,
        includePhysicalPuzzles: (generationState.gameData as any).includePhysicalPuzzles,
        includeSocialPuzzles: (generationState.gameData as any).includeSocialPuzzles,
        includeTechnologyPuzzles: (generationState.gameData as any).includeTechnologyPuzzles,
        requireTeamwork: (generationState.gameData as any).requireTeamwork,
        requireLocalKnowledge: (generationState.gameData as any).requireLocalKnowledge,
      }
      const apiEndpoint = '/api/generate-game'
      
      console.log('Frontend sending request:', request)
      console.log('API endpoint:', apiEndpoint)

      const response = await fetch(apiEndpoint, {
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
        
        // Handle specific error types with retry logic
        if (response.status === 503 || errorData.error?.includes('overloaded') || errorData.error?.includes('Service Unavailable')) {
          if (retryCount < 3) {
            const attemptNumber = retryCount + 1
            const waitTime = (retryCount + 1) * 2
            console.log(`Google AI service overloaded, retrying in ${waitTime} seconds... (attempt ${attemptNumber}/3)`)
            toast.info(`AI service is busy. Retrying in ${waitTime} seconds... (attempt ${attemptNumber}/3)`)
            
            // Wait before retry (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000))
            
            // Retry with different provider if available
            if (retryCount === 1 && aiProvider === 'google') {
              console.log('Switching to OpenAI as fallback...')
              setAiProvider('openai')
              toast.info('Switching to OpenAI as fallback for better reliability...')
            }
            
            return handleGenerateContent(retryCount + 1)
          } else {
            throw new Error('AI service is currently overloaded. Please try again in a few minutes, or switch to a different AI provider.')
          }
        } else if (errorData.error?.includes('parse AI response') || errorData.error?.includes('JSON parsing failed')) {
          console.error('AI response parsing error:', errorData.error)
          if (retryCount < 2) {
            const attemptNumber = retryCount + 1
            console.log(`JSON parsing failed, retrying with simplified prompt... (attempt ${attemptNumber}/2)`)
            toast.info(`AI response format issue. Retrying with simplified prompt... (attempt ${attemptNumber}/2)`)
            
            // Wait before retry
            await new Promise(resolve => setTimeout(resolve, 2000))
            
            return handleGenerateContent(retryCount + 1)
          } else {
            throw new Error(`AI response format error: ${errorData.error}. Please try again or switch to a different AI provider.`)
          }
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

      // Show success message with attempt information
      if (retryCount === 0) {
        toast.success('Content generated successfully on first attempt!')
      } else {
        toast.success(`Content generated successfully on attempt ${retryCount + 1}!`)
      }
    } catch (error: any) {
      console.error('Error generating content:', error)
      
      // Provide specific error messages based on error type
      let errorMessage = 'Failed to generate content. Please try again.'
      
      if (error.message?.includes('overloaded')) {
        errorMessage = 'AI service is currently overloaded. Please try again in a few minutes, or switch to a different AI provider.'
      } else if (error.message?.includes('API key')) {
        errorMessage = 'AI service configuration issue. Please check your API keys in the settings.'
      } else if (error.message?.includes('format error') || error.message?.includes('JSON')) {
        errorMessage = 'The AI didn\'t return properly formatted content. This sometimes happens - please try again with a different AI provider.'
      } else if (error.message?.includes('unexpected format')) {
        errorMessage = 'The AI generated content in an unexpected format. Please try again with different settings.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage)
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
            <div className="space-y-4">
              {/* Desktop/Tablet: 2 rows centered */}
              <div className="hidden md:block">
                <div className="relative">
                  {/* First row: steps 1-4 with horizontal connectors */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        0 <= generationState.currentStep
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {0 < generationState.currentStep ? (
                          <span className="text-sm">✓</span>
                        ) : (
                          <span className="text-sm font-medium">1</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium ${
                          0 <= generationState.currentStep ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {generationState.steps[0].title}
                        </div>
                        <div className="text-xs text-gray-500">{generationState.steps[0].description}</div>
                      </div>
                    </div>
                    
                    {/* Horizontal connector 1→2 */}
                    <div className={`h-0.5 w-16 mx-4 ${
                      0 < generationState.currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                    
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        1 <= generationState.currentStep
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {1 < generationState.currentStep ? (
                          <span className="text-sm">✓</span>
                        ) : (
                          <span className="text-sm font-medium">2</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium ${
                          1 <= generationState.currentStep ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {generationState.steps[1].title}
                        </div>
                        <div className="text-xs text-gray-500">{generationState.steps[1].description}</div>
                      </div>
                    </div>
                    
                    {/* Horizontal connector 2→3 */}
                    <div className={`h-0.5 w-16 mx-4 ${
                      1 < generationState.currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                    
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        2 <= generationState.currentStep
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {2 < generationState.currentStep ? (
                          <span className="text-sm">✓</span>
                        ) : (
                          <span className="text-sm font-medium">3</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium ${
                          2 <= generationState.currentStep ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {generationState.steps[2].title}
                        </div>
                        <div className="text-xs text-gray-500">{generationState.steps[2].description}</div>
                      </div>
                    </div>
                    
                    {/* Horizontal connector 3→4 */}
                    <div className={`h-0.5 w-16 mx-4 ${
                      2 < generationState.currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                    
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        3 <= generationState.currentStep
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {3 < generationState.currentStep ? (
                          <span className="text-sm">✓</span>
                        ) : (
                          <span className="text-sm font-medium">4</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium ${
                          3 <= generationState.currentStep ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {generationState.steps[3].title}
                        </div>
                        <div className="text-xs text-gray-500">{generationState.steps[3].description}</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Second row: steps 5-6 with horizontal connectors - centered */}
                  <div className="flex items-center justify-center mt-8">
                    
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        4 <= generationState.currentStep
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {4 < generationState.currentStep ? (
                          <span className="text-sm">✓</span>
                        ) : (
                          <span className="text-sm font-medium">5</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium ${
                          4 <= generationState.currentStep ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {generationState.steps[4].title}
                        </div>
                        <div className="text-xs text-gray-500">{generationState.steps[4].description}</div>
                      </div>
                    </div>
                    
                    {/* Horizontal connector 5→6 */}
                    <div className={`h-0.5 w-16 mx-4 ${
                      4 < generationState.currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`} />
                    
                    <div className="flex items-center space-x-3">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        5 <= generationState.currentStep
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-300 text-gray-400'
                      }`}>
                        {5 < generationState.currentStep ? (
                          <span className="text-sm">✓</span>
                        ) : (
                          <span className="text-sm font-medium">6</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className={`text-sm font-medium ${
                          5 <= generationState.currentStep ? 'text-gray-900' : 'text-gray-500'
                        }`}>
                          {generationState.steps[5].title}
                        </div>
                        <div className="text-xs text-gray-500">{generationState.steps[5].description}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile: Multiple rows with 2 steps per row and connectors */}
              <div className="block md:hidden">
                <div className="space-y-4">
                  {Array.from({ length: Math.ceil(generationState.steps.length / 2) }, (_, rowIndex) => {
                    const step1Index = rowIndex * 2;
                    const step2Index = rowIndex * 2 + 1;
                    const step1 = generationState.steps[step1Index];
                    const step2 = generationState.steps[step2Index];
                    
                    return (
                      <div key={rowIndex}>
                        <div className="flex items-center justify-between">
                          {/* First step in row */}
                          {step1 && (
                            <div className="flex items-center space-x-3">
                              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                step1Index <= generationState.currentStep
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-gray-300 text-gray-400'
                              }`}>
                                {step1Index < generationState.currentStep ? (
                                  <span className="text-sm">✓</span>
                                ) : (
                                  <span className="text-sm font-medium">{step1Index + 1}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className={`text-sm font-medium ${
                                  step1Index <= generationState.currentStep ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                  {step1.title}
                                </div>
                                <div className="text-xs text-gray-500">{step1.description}</div>
                              </div>
                            </div>
                          )}
                          
                          {/* Horizontal connector between steps in row */}
                          {step1 && step2 && (
                            <div className={`flex-1 h-0.5 mx-4 ${
                              step1Index < generationState.currentStep ? 'bg-blue-600' : 'bg-gray-300'
                            }`} />
                          )}
                          
                          {/* Second step in row */}
                          {step2 && (
                            <div className="flex items-center space-x-3">
                              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                                step2Index <= generationState.currentStep
                                  ? 'bg-blue-600 border-blue-600 text-white'
                                  : 'border-gray-300 text-gray-400'
                              }`}>
                                {step2Index < generationState.currentStep ? (
                                  <span className="text-sm">✓</span>
                                ) : (
                                  <span className="text-sm font-medium">{step2Index + 1}</span>
                                )}
                              </div>
                              <div className="min-w-0">
                                <div className={`text-sm font-medium ${
                                  step2Index <= generationState.currentStep ? 'text-gray-900' : 'text-gray-500'
                                }`}>
                                  {step2.title}
                                </div>
                                <div className="text-xs text-gray-500">{step2.description}</div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Vertical connector to next row */}
                        {rowIndex < Math.ceil(generationState.steps.length / 2) - 1 && (
                          <div className="flex justify-center mt-4">
                            <div className={`w-0.5 h-6 ${
                              step2Index < generationState.currentStep ? 'bg-blue-600' : 'bg-gray-300'
                            }`} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Selected Options Overview */}
        {generationState.currentStep > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Selected Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generationState.gameData.theme && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Theme:</span>
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">{generationState.gameData.theme}</span>
                  </div>
                )}
                {generationState.gameData.city && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">City:</span>
                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">{generationState.gameData.city}</span>
                  </div>
                )}
                {generationState.gameData.difficulty && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Difficulty:</span>
                    <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded capitalize">{generationState.gameData.difficulty}</span>
                  </div>
                )}
                {generationState.gameData.estimatedDuration && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Duration:</span>
                    <span className="text-sm bg-purple-100 text-purple-800 px-2 py-1 rounded">{generationState.gameData.estimatedDuration} minutes</span>
                  </div>
                )}
                {generationState.gameData.pubCount && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Pubs:</span>
                    <span className="text-sm bg-orange-100 text-orange-800 px-2 py-1 rounded">{generationState.gameData.pubCount}</span>
                  </div>
                )}
                {generationState.gameData.puzzlesPerPub && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Puzzles per Pub:</span>
                    <span className="text-sm bg-pink-100 text-pink-800 px-2 py-1 rounded">{generationState.gameData.puzzlesPerPub}</span>
                  </div>
                )}
                {generationState.steps.find(s => s.id === 'area')?.data?.cityArea && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">Area:</span>
                    <span className="text-sm bg-teal-100 text-teal-800 px-2 py-1 rounded">{generationState.steps.find(s => s.id === 'area')?.data?.cityArea}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* AI Provider Selection */}
        {generationState.currentStep >= 2 && generationState.currentStep <= 4 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Wand2 className="h-5 w-5 mr-2" />
                AI Content Generation
              </CardTitle>
              <CardDescription>
                Choose your AI provider for content generation. If one service is busy, try another.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <Button
                    variant={aiProvider === 'openai' ? 'default' : 'outline'}
                    onClick={() => setAiProvider('openai')}
                    className="flex-1"
                  >
                    OpenAI GPT-4
                  </Button>
                  <Button
                    variant={aiProvider === 'anthropic' ? 'default' : 'outline'}
                    onClick={() => setAiProvider('anthropic')}
                    className="flex-1"
                  >
                    Anthropic Claude
                  </Button>
                  <Button
                    variant={aiProvider === 'google' ? 'default' : 'outline'}
                    onClick={() => setAiProvider('google')}
                    className="flex-1"
                  >
                    Google Gemini
                  </Button>
                </div>
                
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium">Service Status</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    If you encounter "service overloaded" errors, try switching to a different AI provider above.
                  </p>
                </div>
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
              onDataChange={setCurrentStepFormData}
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
              onClick={handleStepNext}
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
