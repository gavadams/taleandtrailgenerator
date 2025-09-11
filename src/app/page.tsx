'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth/auth-provider'
import { Header } from '@/components/layout/header'
import { Dashboard } from '@/components/dashboard/dashboard'
import { GameGenerator } from '@/components/game-generator/game-generator'
import { GamePreview } from '@/components/game-preview/game-preview'
import { AdminPanel } from '@/components/admin/admin-panel'
import { Game } from '@/types'
import { isAdmin } from '@/lib/admin'
import { toast } from 'sonner'

type ViewMode = 'dashboard' | 'create' | 'edit' | 'preview' | 'admin'

export default function HomePage() {
  const { user, loading } = useAuth()
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard')
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [previewGame, setPreviewGame] = useState<Game | null>(null)
  const [isUserAdmin, setIsUserAdmin] = useState(false)
  const [games, setGames] = useState<Game[]>([])

  useEffect(() => {
    if (user) {
      isAdmin(user).then(setIsUserAdmin)
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-6 max-w-md mx-auto p-8">
          <div className="space-y-2">
                <h1 className="text-4xl font-bold text-gray-900">Tale and Trail Generator</h1>
            <p className="text-lg text-gray-600">Create amazing pub crawl mystery games</p>
          </div>
          
          <div className="space-y-4">
            <p className="text-gray-600">Sign in to start creating your games</p>
            <a 
              href="/login" 
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In / Sign Up
            </a>
          </div>
          
          <div className="text-sm text-gray-500 space-y-2">
            <p>✨ Generate mystery games with AI</p>
            <p>🎯 Create puzzles and clues</p>
            <p>📍 Easy location swapping</p>
            <p>📤 Export for your main app</p>
          </div>
        </div>
      </div>
    )
  }

  const handleCreateGame = () => {
    setEditingGame(null)
    setViewMode('create')
  }

  const handleEditGame = (game: Game) => {
    setEditingGame(game)
    setViewMode('edit')
  }

  const handlePreviewGame = (game: Game) => {
    setPreviewGame(game)
    setViewMode('preview')
  }

  const handleDuplicateGame = (game: Game) => {
    // The duplication is handled in the Dashboard component
    // This is just a placeholder to satisfy the interface
  }

  const handleBackToDashboard = () => {
    setViewMode('dashboard')
    setEditingGame(null)
    setPreviewGame(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {viewMode === 'dashboard' && (
        <Dashboard
          onCreateGame={handleCreateGame}
          onEditGame={handleEditGame}
          onPreviewGame={handlePreviewGame}
          onDuplicateGame={handleDuplicateGame}
          onAdminPanel={() => setViewMode('admin')}
          isAdmin={isUserAdmin}
          games={games}
          setGames={setGames}
        />
      )}
      
      {viewMode === 'create' && (
        <GameGenerator
          onBack={handleBackToDashboard}
          onGameCreated={handleBackToDashboard}
        />
      )}
      
      {viewMode === 'edit' && editingGame && (
        <GameGenerator
          game={editingGame}
          onBack={handleBackToDashboard}
          onGameCreated={handleBackToDashboard}
        />
      )}
      
      {viewMode === 'preview' && previewGame && (
        <GamePreview
          game={previewGame}
          onBack={handleBackToDashboard}
          onSave={async (updatedGame) => {
            console.log('Save triggered with game:', updatedGame)
            try {
              // Save to database
              console.log('Sending PUT request to:', `/api/games/${updatedGame.id}`)
              const response = await fetch(`/api/games/${updatedGame.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedGame)
              })
              
              console.log('Response status:', response.status)
              console.log('Response ok:', response.ok)
              
              if (!response.ok) {
                const errorText = await response.text()
                console.error('Response error:', errorText)
                throw new Error(`Failed to save game: ${response.status} ${errorText}`)
              }
              
              const savedGame = await response.json()
              console.log('Saved game response:', savedGame)
              
              // Update the game in the games list
              setGames(prev => prev.map(g => g.id === savedGame.id ? savedGame : g))
              setPreviewGame(savedGame)
              
              // Show success message
              toast.success('Game saved successfully!')
            } catch (error) {
              console.error('Error saving game:', error)
              const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
              toast.error(`Failed to save game: ${errorMessage}`)
            }
          }}
        />
      )}
      
      {viewMode === 'admin' && isUserAdmin && (
        <AdminPanel onBack={() => setViewMode('dashboard')} />
      )}
    </div>
  )
}