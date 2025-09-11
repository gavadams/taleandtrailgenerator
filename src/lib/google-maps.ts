// Google Maps API configuration
// You'll need to get your own API key from Google Cloud Console
// Enable the following APIs:
// - Maps Embed API
// - Directions API
// - Places API (optional, for better location search)

export const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dOWWgE4l7I9F8k'

export const generateGoogleMapsEmbedUrl = (locations: Array<{actualName?: string, placeholderName?: string, order: number}>) => {
  console.log('generateGoogleMapsEmbedUrl called with:', locations)
  
  if (locations.length < 2) {
    console.log('Not enough locations for route:', locations.length)
    return null
  }
  
  const sortedLocations = locations.sort((a, b) => a.order - b.order)
  console.log('Sorted locations:', sortedLocations)
  
  const origin = sortedLocations[0]?.actualName || sortedLocations[0]?.placeholderName || `Pub ${sortedLocations[0]?.order}`
  const destination = sortedLocations[sortedLocations.length - 1]?.actualName || sortedLocations[sortedLocations.length - 1]?.placeholderName || `Pub ${sortedLocations[sortedLocations.length - 1]?.order}`
  
  console.log('Origin:', origin, 'Destination:', destination)
  
  // Add waypoints for intermediate locations
  const waypoints = sortedLocations.slice(1, -1)
    .map(loc => loc.actualName || loc.placeholderName || `Pub ${loc.order}`)
    .join('|')
  
  console.log('Waypoints:', waypoints)
  
  // Use Google Maps embed API
  const embedUrl = new URL('https://www.google.com/maps/embed/v1/directions')
  embedUrl.searchParams.set('origin', origin)
  embedUrl.searchParams.set('destination', destination)
  if (waypoints) {
    embedUrl.searchParams.set('waypoints', waypoints)
  }
  embedUrl.searchParams.set('mode', 'walking')
  embedUrl.searchParams.set('key', GOOGLE_MAPS_API_KEY)
  
  const finalUrl = embedUrl.toString()
  console.log('Generated embed URL:', finalUrl)
  
  return finalUrl
}

export const generateGoogleMapsDirectionsUrl = (locations: Array<{actualName?: string, placeholderName?: string, order: number}>) => {
  console.log('generateGoogleMapsDirectionsUrl called with:', locations)
  
  if (locations.length < 2) {
    console.log('Not enough locations for directions:', locations.length)
    return null
  }
  
  const waypoints = locations
    .sort((a, b) => a.order - b.order)
    .map(loc => loc.actualName || loc.placeholderName || `Pub ${loc.order}`)
    .join('/')
  
  const finalUrl = `https://www.google.com/maps/dir/${waypoints}`
  console.log('Generated directions URL:', finalUrl)
  
  return finalUrl
}

export interface RouteInfo {
  totalDistance: string
  totalTime: string
  isValid: boolean
  warnings: string[]
}

export const getGoogleMapsRouteInfo = async (locations: Array<{actualName?: string, placeholderName?: string, order: number}>, city?: string): Promise<RouteInfo> => {
  console.log('getGoogleMapsRouteInfo called with:', locations)
  
  if (locations.length < 2) {
    return {
      totalDistance: '0 miles',
      totalTime: '0 minutes',
      isValid: false,
      warnings: ['Not enough locations for a route']
    }
  }
  
  try {
    // Call our API route instead of Google Maps API directly to avoid CORS issues
    const response = await fetch('/api/google-maps/route-info', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ locations, city })
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const data = await response.json()
    console.log('Route info API response:', data)
    
    return data
  } catch (error) {
    console.error('Error fetching route info:', error)
    return {
      totalDistance: 'Error',
      totalTime: 'Error',
      isValid: false,
      warnings: ['Failed to fetch route information']
    }
  }
}
