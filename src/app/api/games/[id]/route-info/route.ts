import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server-only'
import { db } from '@/lib/database/queries'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const body = await request.json()
    const { routeInfo } = body

    if (!routeInfo) {
      return NextResponse.json({ error: 'Route info is required' }, { status: 400 })
    }

    console.log('Saving route info for game:', resolvedParams.id, 'Route info:', routeInfo)
    
    const success = await db.updateRouteInfo(resolvedParams.id, user.id, routeInfo)
    
    console.log('Route info save result:', success)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update route info' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating route info:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
