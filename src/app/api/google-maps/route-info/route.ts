import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { locations, city } = await request.json()
    
    if (!locations || locations.length < 2) {
      return NextResponse.json({
        totalDistance: '0 miles',
        totalTime: '0 minutes',
        isValid: false,
        warnings: ['Not enough locations for a route']
      })
    }
    
    const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgE4l7I9F8k'
    
    // Check if we're using the demo API key
    if (GOOGLE_MAPS_API_KEY === 'AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgE4l7I9F8k') {
      console.warn('Using demo Google Maps API key - results may be inaccurate')
    }
    
    const sortedLocations = locations.sort((a: any, b: any) => a.order - b.order)
    
    // Helper function to create a more specific location name
    const getLocationName = (loc: any) => {
      const cityContext = city ? `, ${city}, UK` : ', UK'
      
      // Prefer actualName, then placeholderName
      const locationName = loc.actualName || loc.placeholderName
      
      // If we have a generic name, try to make it more specific by adding "pub" and city
      if (locationName && (
        locationName.toLowerCase().includes('pub') && 
        (locationName.toLowerCase().includes('one') || 
         locationName.toLowerCase().includes('1') ||
         locationName.toLowerCase().includes('two') ||
         locationName.toLowerCase().includes('2') ||
         locationName.toLowerCase().includes('three') ||
         locationName.toLowerCase().includes('3') ||
         locationName.toLowerCase().includes('test'))
      )) {
        // For generic pub names, try to find a real pub in the area
        console.log(`Generic pub name detected: ${locationName}, using city area search`)
        return `${city || 'pub'}, UK`
      }
      
      if (locationName && locationName.trim() !== '') {
        return `${locationName}${cityContext}`
      }
      
      // If we only have generic names, we can't get accurate routes
      return null
    }
    
    const origin = getLocationName(sortedLocations[0])
    const destination = getLocationName(sortedLocations[sortedLocations.length - 1])
    
    // Check if we have valid location names
    if (!origin || !destination) {
      console.log('Missing location names, using estimated values')
      const estimatedDistance = locations.length * 0.3
      const estimatedTime = locations.length * 8
      
      return NextResponse.json({
        totalDistance: `${estimatedDistance.toFixed(1)} miles (estimated)`,
        totalTime: `${estimatedTime} minutes (estimated)`,
        isValid: false,
        warnings: ['Location names not specific enough for accurate routing - using estimated values']
      })
    }
    
    // If origin and destination are the same (city only), use estimated values
    if (origin === destination) {
      console.log('Origin and destination are the same, using estimated values')
      const estimatedDistance = locations.length * 0.3
      const estimatedTime = locations.length * 8
      
      return NextResponse.json({
        totalDistance: `${estimatedDistance.toFixed(1)} miles (estimated)`,
        totalTime: `${estimatedTime} minutes (estimated)`,
        isValid: false,
        warnings: ['All locations resolved to the same area - using estimated values']
      })
    }
    
    // Build waypoints for intermediate locations
    const waypoints = sortedLocations.slice(1, -1)
      .map(getLocationName)
      .filter((name: string | null) => name !== null)
      .join('|')
    
    // Use Google Maps Directions API
    const directionsUrl = new URL('https://maps.googleapis.com/maps/api/directions/json')
    directionsUrl.searchParams.set('origin', origin)
    directionsUrl.searchParams.set('destination', destination)
    if (waypoints) {
      directionsUrl.searchParams.set('waypoints', waypoints)
    }
    directionsUrl.searchParams.set('mode', 'walking')
    directionsUrl.searchParams.set('key', GOOGLE_MAPS_API_KEY)
    
    console.log('Fetching route info from:', directionsUrl.toString())
    console.log('Origin:', origin, 'Destination:', destination, 'Waypoints:', waypoints)
    console.log('Full URL:', directionsUrl.toString())
    
    const response = await fetch(directionsUrl.toString())
    const data = await response.json()
    
    console.log('Google Maps API response:', data)
    console.log('API Status:', data.status)
    
    if (data.status === 'OK' && data.routes && data.routes.length > 0) {
      const route = data.routes[0]
      
      console.log('Route legs:', JSON.stringify(route.legs, null, 2))
      
      // Try to get the route summary first (this might be more accurate)
      console.log('Route summary:', route.summary)
      console.log('Route overview_polyline:', route.overview_polyline ? 'present' : 'missing')
      
      // Calculate total distance and time across all legs
      let totalDistanceMeters = 0
      let totalTimeSeconds = 0
      
      route.legs.forEach((leg: any, index: number) => {
        console.log(`Leg ${index}:`, {
          distance: leg.distance,
          duration: leg.duration,
          steps: leg.steps?.length || 0,
          start_address: leg.start_address,
          end_address: leg.end_address
        })
        
        // Use the leg's summary distance and duration (these should be correct)
        totalDistanceMeters += leg.distance.value
        totalTimeSeconds += leg.duration.value
      })
      
      console.log('Total distance (meters):', totalDistanceMeters)
      console.log('Total time (seconds):', totalTimeSeconds)
      
      // Validate the results - if they seem unreasonable, use estimated values
      const totalDistanceMiles = totalDistanceMeters * 0.000621371
      const totalTimeMinutes = Math.round(totalTimeSeconds / 60)
      
      // Check for obviously wrong results (more than 50 miles or 8 hours)
      if (totalDistanceMiles > 50 || totalTimeMinutes > 480) {
        console.warn('Google Maps returned unreasonable results, using estimated values')
        const estimatedDistance = locations.length * 0.3
        const estimatedTime = locations.length * 8
        
        return NextResponse.json({
          totalDistance: `${estimatedDistance.toFixed(1)} miles (estimated)`,
          totalTime: `${estimatedTime} minutes (estimated)`,
          isValid: false,
          warnings: ['Google Maps returned unreasonable route data - using estimated values', 'Consider using more specific location names']
        })
      }
      
      // Use the already calculated values
      
      console.log('Final calculations:', {
        totalDistanceMiles: totalDistanceMiles.toFixed(1),
        totalTimeMinutes: totalTimeMinutes
      })
      
      // Check for warnings
      const warnings: string[] = []
      if (totalTimeMinutes > 120) {
        warnings.push('Route is quite long - consider reducing number of pubs')
      }
      if (totalDistanceMiles > 3) {
        warnings.push('Route distance is quite far - players may get tired')
      }
      
      const result = {
        totalDistance: `${totalDistanceMiles.toFixed(1)} miles`,
        totalTime: `${totalTimeMinutes} minutes`,
        isValid: true,
        warnings
      }
      
      console.log('Returning result:', result)
      return NextResponse.json(result)
    } else {
      console.error('Google Maps API error:', data.status, data.error_message)
      
      // Handle specific error cases
      let errorMessage = `Google Maps API error: ${data.status}`
      if (data.status === 'REQUEST_DENIED') {
        errorMessage = 'Google Maps API key is invalid or not configured'
      } else if (data.status === 'ZERO_RESULTS') {
        errorMessage = 'Could not find walking route between these locations'
      } else if (data.status === 'NOT_FOUND') {
        errorMessage = 'One or more locations could not be found'
      }
      
      // Fallback to estimated values when API fails
      const estimatedDistance = locations.length * 0.3 // Rough estimate: 0.3 miles between pubs
      const estimatedTime = locations.length * 8 // Rough estimate: 8 minutes between pubs
      
      return NextResponse.json({
        totalDistance: `${estimatedDistance.toFixed(1)} miles (estimated)`,
        totalTime: `${estimatedTime} minutes (estimated)`,
        isValid: false,
        warnings: [errorMessage, 'Using estimated values - check Google Maps API configuration']
      })
    }
  } catch (error) {
    console.error('Error fetching route info:', error)
    return NextResponse.json({
      totalDistance: 'Error',
      totalTime: 'Error',
      isValid: false,
      warnings: ['Failed to fetch route information']
    })
  }
}
