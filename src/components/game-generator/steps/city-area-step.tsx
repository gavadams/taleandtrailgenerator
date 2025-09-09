'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { MapPin, Building2, Navigation, Info, Clock, Users, Star, Route } from 'lucide-react'
import { getPredefinedRoutesByCity, PredefinedRoute } from '@/lib/data/predefined-routes'

interface CityAreaStepProps {
  initialData: any
  onComplete: (data: any) => void
}

export function CityAreaStep({ initialData, onComplete }: CityAreaStepProps) {
  const [formData, setFormData] = useState({
    cityArea: initialData.cityArea || '',
    areaDescription: initialData.areaDescription || '',
    selectedRoute: initialData.selectedRoute || null,
  })

  const [selectedRoute, setSelectedRoute] = useState<PredefinedRoute | null>(null)
  const [showPredefinedRoutes, setShowPredefinedRoutes] = useState(false)

  const predefinedRoutes = getPredefinedRoutesByCity(initialData.city || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('CityAreaStep submitting data:', formData)
    onComplete(formData)
  }

  const handleSkip = () => {
    onComplete({ cityArea: '', areaDescription: '', selectedRoute: null })
  }

  const handleSelectRoute = (route: PredefinedRoute) => {
    setSelectedRoute(route)
    setFormData(prev => ({
      ...prev,
      selectedRoute: route,
      cityArea: route.area,
      areaDescription: route.description
    }))
  }

  const handleCustomArea = () => {
    setSelectedRoute(null)
    setFormData(prev => ({
      ...prev,
      selectedRoute: null,
      cityArea: '',
      areaDescription: ''
    }))
  }

  // Common city areas for popular cities (can be expanded)
  const commonAreas = {
    'london': ['West End', 'East End', 'South Bank', 'Camden', 'Shoreditch', 'Greenwich', 'Notting Hill', 'Covent Garden'],
    'manchester': ['Northern Quarter', 'Ancoats', 'Spinningfields', 'Deansgate', 'Castlefield', 'Chorlton', 'Didsbury'],
    'birmingham': ['Jewellery Quarter', 'Digbeth', 'Brindleyplace', 'Mailbox', 'Moseley', 'Kings Heath'],
    'liverpool': ['Albert Dock', 'Ropewalks', 'Baltic Triangle', 'Lark Lane', 'Allerton', 'Woolton'],
    'newcastle': ['Quayside', 'Grainger Town', 'Ouseburn', 'Jesmond', 'Gosforth', 'Tynemouth'],
    'sunderland': ['City Centre', 'Roker', 'Seaburn', 'Ashbrooke', 'Millfield', 'Hendon'],
    'edinburgh': ['Old Town', 'New Town', 'Leith', 'Stockbridge', 'Morningside', 'Grassmarket'],
    'glasgow': ['West End', 'Merchant City', 'East End', 'Southside', 'Shawlands', 'Byres Road'],
    'bristol': ['Harbourside', 'Clifton', 'Stokes Croft', 'Montpelier', 'Southville', 'Bedminster'],
    'leeds': ['City Centre', 'Headingley', 'Chapel Allerton', 'Roundhay', 'Meanwood', 'Kirkstall'],
  }

  const cityKey = formData.cityArea ? '' : initialData.city?.toLowerCase() || ''
  const suggestedAreas = commonAreas[cityKey as keyof typeof commonAreas] || []

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MapPin className="h-5 w-5" />
          <span>City Area Selection</span>
        </CardTitle>
        <CardDescription>
          Choose a specific area or neighborhood within {initialData.city} to create a focused walking route
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Predefined Routes Section */}
          {predefinedRoutes.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-semibold">Predefined Pub Crawl Routes</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPredefinedRoutes(!showPredefinedRoutes)}
                >
                  {showPredefinedRoutes ? 'Hide' : 'Show'} Routes
                </Button>
              </div>
              
              {showPredefinedRoutes && (
                <div className="grid gap-4">
                  {predefinedRoutes.map((route) => (
                    <Card key={route.id} className={`cursor-pointer transition-all ${
                      selectedRoute?.id === route.id 
                        ? 'ring-2 ring-blue-500 bg-blue-50' 
                        : 'hover:shadow-md'
                    }`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold text-lg">{route.name}</h3>
                              <Badge variant="secondary">{route.difficulty}</Badge>
                            </div>
                            <p className="text-gray-600 mb-3">{route.description}</p>
                            
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-4 w-4" />
                                <span>{route.estimatedDuration} min</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Navigation className="h-4 w-4" />
                                <span>{route.walkingDistance}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Building2 className="h-4 w-4" />
                                <span>{route.pubs.length} pubs</span>
                              </div>
                            </div>

                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Pubs on this route:</p>
                              <div className="flex flex-wrap gap-1">
                                {route.pubs.map((pub, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {pub.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div className="mb-3">
                              <p className="text-sm font-medium text-gray-700 mb-1">Highlights:</p>
                              <div className="flex flex-wrap gap-1">
                                {route.highlights.map((highlight, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {highlight}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <Button
                            type="button"
                            variant={selectedRoute?.id === route.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleSelectRoute(route)}
                            className="ml-4"
                          >
                            {selectedRoute?.id === route.id ? 'Selected' : 'Select'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Custom Area Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-semibold">Custom Area</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCustomArea}
                disabled={!selectedRoute}
              >
                Choose Custom Area
              </Button>
            </div>
            
            <div>
              <Label htmlFor="cityArea">Area/Neighborhood Name</Label>
              <Input
                id="cityArea"
                value={formData.cityArea}
                onChange={(e) => setFormData(prev => ({ ...prev, cityArea: e.target.value }))}
                placeholder="e.g., Northern Quarter, West End, City Centre"
                className="mt-1"
                disabled={!!selectedRoute}
              />
              <p className="text-sm text-gray-500 mt-1">
                Specify a particular area within {initialData.city} for your pub crawl route
              </p>
              {formData.cityArea && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                  <p className="text-sm text-green-800">
                    ✓ Custom area selected: <strong>{formData.cityArea}</strong>
                  </p>
                </div>
              )}
            </div>

            {suggestedAreas.length > 0 && (
              <div>
                <Label>Suggested Areas for {initialData.city}</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {suggestedAreas.map((area) => (
                    <Button
                      key={area}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, cityArea: area }))}
                      className="justify-start"
                    >
                      <Building2 className="h-4 w-4 mr-2" />
                      {area}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="areaDescription">Area Description (Optional)</Label>
              <Textarea
                id="areaDescription"
                value={formData.areaDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, areaDescription: e.target.value }))}
                placeholder="Describe the character of this area - e.g., 'Historic waterfront with traditional pubs and modern bars'"
                className="mt-1"
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">
                Help the AI understand the area's character for better pub selection
              </p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium">Why specify an area?</p>
                <ul className="mt-1 space-y-1 text-blue-700">
                  <li>• Creates a logical walking route between pubs</li>
                  <li>• Ensures pubs are within reasonable walking distance</li>
                  <li>• Allows for area-specific stories and local knowledge</li>
                  <li>• Makes the experience more focused and manageable</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
            >
              Skip Area Selection
            </Button>
            <Button type="submit">
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
