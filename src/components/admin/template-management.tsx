'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Plus, Edit, Trash2, Users, Puzzle } from 'lucide-react'
import { GameTemplate, Theme, Difficulty, PuzzleType } from '@/types'
import { toast } from 'sonner'

const themes: Theme[] = ['mystery', 'historical', 'fantasy', 'sci-fi', 'comedy', 'horror']
const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
const puzzleTypes: PuzzleType[] = ['logic', 'observation', 'cipher', 'deduction', 'local', 'wordplay', 'math', 'pattern']

const characterTypeOptions = [
  'detective', 'witnesses', 'suspects', 'informants', 'historian', 'local_guide', 
  'historical_figures', 'dock_workers', 'smugglers', 'port_authority', 'bartender',
  'local_resident', 'tour_guide', 'museum_curator', 'librarian', 'shop_owner'
]

export function TemplateManagement() {
  const [templates, setTemplates] = useState<GameTemplate[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTemplate, setEditingTemplate] = useState<GameTemplate | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    theme: 'mystery' as Theme,
    description: '',
    storyFramework: '',
    characterTypes: [] as string[],
    puzzleTypes: [] as PuzzleType[],
    difficulty: 'medium' as Difficulty
  })

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
      toast.error('Failed to load templates')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTemplate = async () => {
    try {
      const response = await fetch('/api/game-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create template')
      }

      toast.success('Template created successfully')
      setIsCreateDialogOpen(false)
      resetForm()
      loadTemplates()
    } catch (error: any) {
      console.error('Error creating template:', error)
      toast.error(error.message || 'Failed to create template')
    }
  }

  const handleUpdateTemplate = async () => {
    if (!editingTemplate) return

    try {
      const response = await fetch(`/api/game-templates/${editingTemplate.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update template')
      }

      toast.success('Template updated successfully')
      setIsEditDialogOpen(false)
      setEditingTemplate(null)
      resetForm()
      loadTemplates()
    } catch (error: any) {
      console.error('Error updating template:', error)
      toast.error(error.message || 'Failed to update template')
    }
  }

  const handleDeleteTemplate = async (templateId: string) => {
    try {
      const response = await fetch(`/api/game-templates/${templateId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete template')
      }

      toast.success('Template deleted successfully')
      loadTemplates()
    } catch (error: any) {
      console.error('Error deleting template:', error)
      toast.error(error.message || 'Failed to delete template')
    }
  }

  const openEditDialog = (template: GameTemplate) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      theme: template.theme,
      description: template.description,
      storyFramework: template.storyFramework,
      characterTypes: template.characterTypes,
      puzzleTypes: template.puzzleTypes,
      difficulty: template.difficulty
    })
    setIsEditDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: '',
      theme: 'mystery',
      description: '',
      storyFramework: '',
      characterTypes: [],
      puzzleTypes: [],
      difficulty: 'medium'
    })
  }

  const toggleArrayItem = (array: any[], item: any, setter: (value: any) => void) => {
    if (array.includes(item)) {
      setter(array.filter(i => i !== item))
    } else {
      setter([...array, item])
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
            <p className="mt-2 text-gray-600">Loading templates...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Game Templates</h2>
          <p className="text-gray-600">Manage game templates for easy city porting</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>
                Create a new game template that can be adapted to different cities
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Classic Mystery Investigation"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={formData.theme} onValueChange={(value: Theme) => setFormData({ ...formData, theme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {themes.map(theme => (
                        <SelectItem key={theme} value={theme}>
                          {getThemeIcon(theme)} {theme}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(value: Difficulty) => setFormData({ ...formData, difficulty: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map(difficulty => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of what this template offers..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="storyFramework">Story Framework</Label>
                <Textarea
                  id="storyFramework"
                  value={formData.storyFramework}
                  onChange={(e) => setFormData({ ...formData, storyFramework: e.target.value })}
                  placeholder="Describe the core story structure and narrative flow..."
                  rows={4}
                />
              </div>
              
              <div>
                <Label>Character Types</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {characterTypeOptions.map(type => (
                    <Button
                      key={type}
                      variant={formData.characterTypes.includes(type) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayItem(formData.characterTypes, type, (value) => setFormData({ ...formData, characterTypes: value }))}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Puzzle Types</Label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {puzzleTypes.map(type => (
                    <Button
                      key={type}
                      variant={formData.puzzleTypes.includes(type) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleArrayItem(formData.puzzleTypes, type, (value) => setFormData({ ...formData, puzzleTypes: value }))}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateTemplate}>
                Create Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{getThemeIcon(template.theme)}</span>
                    <h3 className="font-semibold text-lg">{template.name}</h3>
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
                
                <div className="flex space-x-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(template)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Template</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{template.name}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>
              Update the template details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Template Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Classic Mystery Investigation"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-theme">Theme</Label>
                <Select value={formData.theme} onValueChange={(value: Theme) => setFormData({ ...formData, theme: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map(theme => (
                      <SelectItem key={theme} value={theme}>
                        {getThemeIcon(theme)} {theme}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-difficulty">Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value: Difficulty) => setFormData({ ...formData, difficulty: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of what this template offers..."
                rows={3}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-storyFramework">Story Framework</Label>
              <Textarea
                id="edit-storyFramework"
                value={formData.storyFramework}
                onChange={(e) => setFormData({ ...formData, storyFramework: e.target.value })}
                placeholder="Describe the core story structure and narrative flow..."
                rows={4}
              />
            </div>
            
            <div>
              <Label>Character Types</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {characterTypeOptions.map(type => (
                  <Button
                    key={type}
                    variant={formData.characterTypes.includes(type) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleArrayItem(formData.characterTypes, type, (value) => setFormData({ ...formData, characterTypes: value }))}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
            
            <div>
              <Label>Puzzle Types</Label>
              <div className="grid grid-cols-4 gap-2 mt-2">
                {puzzleTypes.map(type => (
                  <Button
                    key={type}
                    variant={formData.puzzleTypes.includes(type) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleArrayItem(formData.puzzleTypes, type, (value) => setFormData({ ...formData, puzzleTypes: value }))}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTemplate}>
              Update Template
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
