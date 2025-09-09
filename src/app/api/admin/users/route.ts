import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-only'
import { createAdminClient } from '@/lib/supabase/admin'

// GET - List all users
export async function GET() {
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

    // Get all users using admin client
    const adminClient = createAdminClient()
    const { data: users, error } = await adminClient
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

// POST - Create new user
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

    const { email, password, role } = await request.json()

    if (!email || !password || !role) {
      return NextResponse.json(
        { error: 'Email, password, and role are required' },
        { status: 400 }
      )
    }

    // Create user using admin client
    const adminClient = createAdminClient()
    
    // Check if user already exists (case-insensitive)
    const { data: existingUsers, error: profileCheckError } = await adminClient
      .from('user_profiles')
      .select('id, email')
      .ilike('email', email)

    if (profileCheckError) {
      return NextResponse.json(
        { error: 'Failed to check existing users' },
        { status: 500 }
      )
    }

    if (existingUsers && existingUsers.length > 0) {
      return NextResponse.json(
        { error: `User with email ${existingUsers[0].email} already exists` },
        { status: 409 }
      )
    }

    // Also check if user exists in auth (case-insensitive)
    const { data: authUsers, error: authListError } = await adminClient.auth.admin.listUsers()
    
    if (authListError) {
      return NextResponse.json(
        { error: 'Failed to check existing users' },
        { status: 500 }
      )
    }

    const existingAuthUser = authUsers.users.find(user => 
      user.email?.toLowerCase() === email.toLowerCase()
    )

    if (existingAuthUser) {
      return NextResponse.json(
        { error: `User with email ${existingAuthUser.email} already exists` },
        { status: 409 }
      )
    }
    
    // Create auth user
    const { data: authData, error: createUserError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (createUserError) {
      // If user creation fails due to existing user, try to get the existing user
      if (createUserError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }
      throw createUserError
    }

    // Create user profile
    const { data: profileData, error: profileError } = await adminClient
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email,
        role
      })
      .select()
      .single()

    if (profileError) {
      // If profile creation fails due to duplicate key, clean up the auth user
      if (profileError.code === '23505') { // PostgreSQL unique violation
        await adminClient.auth.admin.deleteUser(authData.user.id)
        return NextResponse.json(
          { error: 'User with this email already exists' },
          { status: 409 }
        )
      }
      throw profileError
    }

    return NextResponse.json(profileData)
  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}
