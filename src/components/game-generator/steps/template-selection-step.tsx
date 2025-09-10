'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Puzzle, Star, ArrowRight } from 'lucide-react'
import { GameTemplate, Theme, Difficulty } from '@/types'
import { toast } from 'sonner'

interface TemplateSelectionStepProps {
  onComplete: (data: any) => void
}

export function TemplateSelectionStep({ onComplete }: TemplateSelectionStepProps) {
  const [templates, setTemplates] = useState<GameTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplate | null>(null)
  const [loading, setLoading] = useState(true)
  const [useTemplate, setUseTemplate] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      const response = await fetch('/api/game-templates')
      if (!response.ok) throw new Error('Failed to fetch templates')
      const data = await response.json()
      setTemplates(data)
    } catch (error) {
      console.error('Error loading templates:', error)
      toast.error('Failed to load game templates')
    } finally {
      setLoading(false)
    }
  }

  const handleTemplateSelect = (template: GameTemplate) => {
    setSelectedTemplate(template)
    setUseTemplate(true)
  }

  const handleSkipTemplates = () => {
    setUseTemplate(false)
    setSelectedTemplate(null)
  }

  const handleContinue = () => {
    if (useTemplate && selectedTemplate) {
      onComplete({
        useTemplate: true,
        templateId: selectedTemplate.id,
        template: selectedTemplate,
        theme: selectedTemplate.theme,
        difficulty: selectedTemplate.difficulty
      })
    } else {
      onComplete({
        useTemplate: false,
        templateId: null,
        template: null
      })
    }
  }

  const getThemeIcon = (theme: Theme) => {
    switch (theme) {
      case 'mystery': return '🔍'
      case 'historical': return '🏛️'
      case 'fantasy': return '🧙‍♂️'
      case 'sci-fi': return '🚀'
      case 'comedy': return '😄'
      case 'horror': return '👻'
      default: return '🎮'
    }
  }

  const getDifficultyColor = (difficulty: Difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading game templates...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5" />
          <span>Choose Game Template</span>
        </CardTitle>
        <CardDescription>
          Select a pre-built template to quickly create a game, or create a custom game from scratch
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        
        {/* Template Selection */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Game Templates</h3>
            <Button
              variant="outline"
              onClick={handleSkipTemplates}
              className={!useTemplate ? 'bg-blue-50 border-blue-200' : ''}
            >
              Create Custom Game
            </Button>
          </div>

          <div className="grid gap-4">
            {templates.map((template) => (
              <Card 
                key={template.id} 
                className={`cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:shadow-md'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-2xl">{getThemeIcon(template.theme)}</span>
                        <h4 className="font-semibold text-lg">{template.name}</h4>
                        <Badge className={getDifficultyColor(template.difficulty)}>
                          {template.difficulty}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{template.characterTypes?.length || 0} character types</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Puzzle className="h-4 w-4" />
                            <span>{template.puzzleTypes?.length || 0} puzzle types</span>
                          </div>
                        </div>
                        
                        <div className="text-sm">
                          <p className="font-medium text-gray-700 mb-1">Story Framework:</p>
                          <p className="text-gray-600 italic">"{template.storyFramework}"</p>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant={selectedTemplate?.id === template.id ? "default" : "outline"}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleTemplateSelect(template)
                      }}
                      className="ml-4"
                    >
                      {selectedTemplate?.id === template.id ? 'Selected' : 'Select'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Selected Template Info */}
        {selectedTemplate && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <Star className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Selected Template: {selectedTemplate.name}</p>
                <p className="mt-1">
                  This template will provide the story framework, character types, and puzzle structure. 
                  You'll be able to customize the city, area, and specific details.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Continue Button */}
        <div className="flex justify-end">
          <Button 
            onClick={handleContinue}
            className="flex items-center space-x-2"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
