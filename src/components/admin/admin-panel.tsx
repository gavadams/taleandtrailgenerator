'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Users, Crown, User, Plus, Trash2, ArrowLeft, BookOpen } from 'lucide-react'
// Removed direct client import - using API routes instead
import { toast } from 'sonner'
import { TemplateManagement } from './template-management'

interface UserProfile {
  id: string
  email: string
  role: 'user' | 'admin'
  created_at: string
}

interface AdminPanelProps {
  onBack: () => void
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserPassword, setNewUserPassword] = useState('')
  const [newUserRole, setNewUserRole] = useState<'user' | 'admin'>('user')
  const [addingUser, setAddingUser] = useState(false)
  const [cleaningUp, setCleaningUp] = useState(false)
  const [activeTab, setActiveTab] = useState<'users' | 'templates' | 'cleanup'>('users')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to load users')
      }
      const data = await response.json()
      setUsers(data)
    } catch (error: any) {
      toast.error(error.message || 'Failed to load users')
      console.error('Error loading users:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleUserRole = async (userId: string, currentRole: string) => {
    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin'
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update user role')
      }
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole as 'user' | 'admin' } : user
      ))
      
      toast.success(`User role updated to ${newRole}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user role')
      console.error('Error updating user role:', error)
    }
  }

  const addUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      toast.error('Please fill in all fields')
      return
    }

    setAddingUser(true)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole
        }),
      })

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
        }
        console.error('User creation error:', errorData)
        console.error('Response status:', response.status)
        console.error('Response headers:', Object.fromEntries(response.headers.entries()))
        throw new Error(errorData.error || `Failed to create user (${response.status})`)
      }

      // Refresh users list
      await loadUsers()
      
      // Reset form
      setNewUserEmail('')
      setNewUserPassword('')
      setNewUserRole('user')
      setShowAddUser(false)
      
      toast.success('User created successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user')
      console.error('Error creating user:', error)
    } finally {
      setAddingUser(false)
    }
  }

  const deleteUser = async (userId: string, userEmail: string) => {
    if (!confirm(`Are you sure you want to delete user ${userEmail}? This action cannot be undone.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete user')
      }

      // Refresh users list
      await loadUsers()
      
      toast.success('User deleted successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user')
      console.error('Error deleting user:', error)
    }
  }


  const cleanupOrphanedUsers = async () => {
    if (!confirm('This will remove any users that exist in authentication but not in the user profiles table. Continue?')) {
      return
    }

    setCleaningUp(true)
    try {
      const response = await fetch('/api/admin/cleanup', {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cleanup users')
      }

      const result = await response.json()
      toast.success(result.message)
      
      // Refresh users list
      await loadUsers()
    } catch (error: any) {
      toast.error(error.message || 'Failed to cleanup users')
      console.error('Error cleaning up users:', error)
    } finally {
      setCleaningUp(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading users...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Crown className="h-6 w-6 text-yellow-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <Button onClick={onBack} variant="outline" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <Button
            variant={activeTab === 'users' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('users')}
            className="flex items-center space-x-2"
          >
            <Users className="h-4 w-4" />
            <span>Users</span>
          </Button>
          <Button
            variant={activeTab === 'templates' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('templates')}
            className="flex items-center space-x-2"
          >
            <BookOpen className="h-4 w-4" />
            <span>Templates</span>
          </Button>
          <Button
            variant={activeTab === 'cleanup' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('cleanup')}
            className="flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Cleanup</span>
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === 'users' && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    User Management
                  </CardTitle>
                  <CardDescription>
                    Manage user roles and permissions
                  </CardDescription>
                </div>
              <div className="flex items-center space-x-2">
                <Button
                  onClick={cleanupOrphanedUsers}
                  disabled={cleaningUp}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <span>{cleaningUp ? 'Cleaning...' : 'Cleanup Orphaned Users'}</span>
                </Button>
                <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center space-x-2">
                      <Plus className="h-4 w-4" />
                      <span>Add User</span>
                    </Button>
                  </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New User</DialogTitle>
                    <DialogDescription>
                      Create a new user account with email and password.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newUserEmail}
                        onChange={(e) => setNewUserEmail(e.target.value)}
                        placeholder="user@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={newUserPassword}
                        onChange={(e) => setNewUserPassword(e.target.value)}
                        placeholder="Enter password"
                      />
                    </div>
                    <div>
                      <Label htmlFor="role">Role</Label>
                      <select
                        id="role"
                        value={newUserRole}
                        onChange={(e) => setNewUserRole(e.target.value as 'user' | 'admin')}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowAddUser(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addUser} disabled={addingUser}>
                      {addingUser ? 'Creating...' : 'Create User'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {user.role === 'admin' ? (
                      <Crown className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <User className="h-5 w-5 text-gray-400" />
                    )}
                    <div>
                      <div className="font-medium">{user.email}</div>
                      <div className="text-sm text-gray-500">
                        Joined {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                      {user.role}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleUserRole(user.id, user.role)}
                    >
                      {user.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deleteUser(user.id, user.email)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        )}

        {activeTab === 'templates' && (
          <TemplateManagement />
        )}

        {activeTab === 'cleanup' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trash2 className="h-5 w-5 mr-2" />
                System Cleanup
              </CardTitle>
              <CardDescription>
                Clean up orphaned data and optimize the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <h3 className="font-semibold mb-2">Cleanup Orphaned Users</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Remove user profiles that don't have corresponding auth users
                  </p>
                  <Button
                    onClick={cleanupOrphanedUsers}
                    disabled={cleaningUp}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <span>{cleaningUp ? 'Cleaning...' : 'Cleanup Orphaned Users'}</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
