import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

export async function isAdmin(user: User | null): Promise<boolean> {
  if (!user) return false
  
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  return profile?.role === 'admin'
}

export async function requireAdmin(user: User | null): Promise<boolean> {
  const admin = await isAdmin(user)
  if (!admin) {
    throw new Error('Admin access required')
  }
  return true
}
