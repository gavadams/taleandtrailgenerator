'use client'

import { useAuth } from '@/components/auth/auth-provider'
import { Button } from '@/components/ui/button'
import { LogOut, User, Crown } from 'lucide-react'
import { useState, useEffect } from 'react'
import { isAdmin } from '@/lib/admin'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function Header() {
  const { user, signOut } = useAuth()
  const [isUserAdmin, setIsUserAdmin] = useState(false)

  useEffect(() => {
    if (user) {
      isAdmin(user).then(setIsUserAdmin)
    }
  }, [user])

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Tale and Trail Generator
          </h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  {isUserAdmin ? (
                    <Crown className="h-4 w-4 mr-2 text-yellow-600" />
                  ) : (
                    <User className="h-4 w-4 mr-2" />
                  )}
                  {user.email}
                  {isUserAdmin && <span className="ml-1 text-xs text-yellow-600">(Admin)</span>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
