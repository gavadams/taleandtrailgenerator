'use client'

import { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, Clock, AlertTriangle } from 'lucide-react'
import { generateGoogleMapsEmbedUrl, generateGoogleMapsDirectionsUrl, getGoogleMapsRouteInfo, RouteInfo } from '@/lib/google-maps'

interface PubLocation {
  id: string
  order: number
  actualName?: string
  placeholderName?: string
  mapsLink?: string
  walkingTime?: string
  areaDescription?: string
}

interface RouteMapProps {
  locations: PubLocation[]
  city: string
  cityArea?: string
}


export function RouteMap({ locations, city, cityArea }: RouteMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Debug logging
  console.log('RouteMap rendered with:', { locations, city, cityArea })
  console.log('Locations length:', locations?.length)
  console.log('First location:', locations?.[0])
  console.log('All locations:', locations)

  const routeUrl = generateGoogleMapsDirectionsUrl(locations)
  const embedUrl = generateGoogleMapsEmbedUrl(locations)

  const validateRoute = async () => {
    if (locations.length < 2) return

    setIsLoading(true)
    setError(null)

    try {
      // Use real Google Maps API to get accurate walking times and distances
      const routeInfo = await getGoogleMapsRouteInfo(locations, city)
      setRouteInfo(routeInfo)
    } catch (err) {
      console.error('Route validation error:', err)
      setError('Failed to validate route')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (locations.length > 0) {
      validateRoute()
    }
  }, [locations])


  // Show message if no locations
  if (!locations || locations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Pub Route Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Route Available</h3>
            <p className="text-gray-600">
              Generate game content first to see the pub route map.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Pub Route Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Route Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Navigation className="h-4 w-4 text-blue-600" />
            <div>
              <div className="text-sm font-medium text-blue-900">Total Distance</div>
              <div className="text-lg font-bold text-blue-700">
                {routeInfo?.totalDistance || 'Calculating...'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Clock className="h-4 w-4 text-green-600" />
            <div>
              <div className="text-sm font-medium text-green-900">Walking Time</div>
              <div className="text-lg font-bold text-green-700">
                {routeInfo?.totalTime || 'Calculating...'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
            <MapPin className="h-4 w-4 text-orange-600" />
            <div>
              <div className="text-sm font-medium text-orange-900">Total Pubs</div>
              <div className="text-lg font-bold text-orange-700">
                {locations.length}
              </div>
            </div>
          </div>
        </div>

        {/* Route Validation */}
        {routeInfo && (
          <div className={`p-4 rounded-lg border ${
            routeInfo.isValid 
              ? 'bg-green-50 border-green-200' 
              : 'bg-yellow-50 border-yellow-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {routeInfo.isValid ? (
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              ) : (
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              )}
              <span className={`font-medium ${
                routeInfo.isValid ? 'text-green-800' : 'text-yellow-800'
              }`}>
                {routeInfo.isValid ? 'Route Validated' : 'Route Needs Review'}
              </span>
            </div>
            
            {routeInfo.warnings.length > 0 && (
              <div className="mt-2">
                <p className="text-sm text-yellow-700 mb-2">Warnings:</p>
                <ul className="text-sm text-yellow-700 space-y-1">
                  {routeInfo.warnings.map((warning, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-yellow-600">•</span>
                      {warning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Embedded Google Maps Route */}
        {embedUrl ? (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Route Map:</h4>
            <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden border">
              <iframe
                src={embedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Pub Crawl Route Map"
                className="absolute inset-0"
                onError={() => {
                  console.error('Failed to load Google Maps iframe')
                  setError('Failed to load route map. Please check your Google Maps API key.')
                }}
              />
            </div>
            <p className="text-xs text-gray-500 text-center">
              Interactive route map showing walking directions between all pubs
            </p>
            <div className="text-xs text-gray-400 text-center">
              Debug: {embedUrl.substring(0, 100)}...
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Route Map:</h4>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Unable to generate route map. This could be because:
              </p>
              <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                <li>• Not enough pub locations (need at least 2)</li>
                <li>• Pub names are not available</li>
                <li>• Google Maps API key is not configured</li>
              </ul>
              <div className="mt-2 text-xs text-yellow-600">
                Locations found: {locations.length}
              </div>
            </div>
          </div>
        )}

        {/* Pub List */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Route Order:</h4>
          <div className="space-y-2">
            {locations
              .sort((a, b) => a.order - b.order)
              .map((location, index) => (
                <div key={location.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                  <Badge variant="outline" className="shrink-0">
                    {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {location.actualName || location.placeholderName || `Pub ${index + 1}`}
                    </div>
                    {location.areaDescription && (
                      <div className="text-xs text-gray-600">
                        {location.areaDescription}
                      </div>
                    )}
                  </div>
                  {location.walkingTime && (
                    <Badge variant="secondary" className="text-xs">
                      {location.walkingTime}
                    </Badge>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* Google Maps Button */}
        {routeUrl && (
          <div className="pt-4 border-t">
            <Button
              asChild
              className="w-full"
              variant="outline"
            >
              <a
                href={routeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                View Route on Google Maps
              </a>
            </Button>
            <p className="text-xs text-gray-500 mt-2 text-center">
              Opens in new tab to verify walking route and distances
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Error</span>
            </div>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
