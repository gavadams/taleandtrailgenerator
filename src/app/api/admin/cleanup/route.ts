import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-only'
import { createAdminClient } from '@/lib/supabase/admin'

// POST - Clean up orphaned users
export async function POST(request: NextRequest) {
  try {
    // Verify the requesting user is an admin
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
    }

    const adminClient = createAdminClient()
    
    // Get all users from auth
    const { data: authUsers, error: listUsersError } = await adminClient.auth.admin.listUsers()
    if (listUsersError) throw listUsersError

    // Get all user profiles
    const { data: profiles, error: profilesError } = await adminClient
      .from('user_profiles')
      .select('id')
    
    if (profilesError) throw profilesError

    const profileIds = new Set(profiles?.map(p => p.id) || [])
    const orphanedUsers = authUsers.users.filter(authUser => !profileIds.has(authUser.id))

    // Delete orphaned users
    const deletedUsers = []
    for (const orphanedUser of orphanedUsers) {
      const { error: deleteError } = await adminClient.auth.admin.deleteUser(orphanedUser.id)
      if (!deleteError) {
        deletedUsers.push(orphanedUser.email)
      }
    }

    return NextResponse.json({
      message: `Cleaned up ${deletedUsers.length} orphaned users`,
      deletedUsers
    })
  } catch (error: any) {
    console.error('Error cleaning up users:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to clean up users' },
      { status: 500 }
    )
  }
}
