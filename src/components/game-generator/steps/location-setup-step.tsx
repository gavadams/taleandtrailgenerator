'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MapPin, Link, Building } from 'lucide-react'
import { VenueType } from '@/types'

interface LocationSetupStepProps {
  gameData: any
  onComplete: (data: any) => void
}

export function LocationSetupStep({ gameData, onComplete }: LocationSetupStepProps) {
  const [locations, setLocations] = useState(() => {
    if (gameData.content?.locations) {
      return gameData.content.locations.map((loc: any, index: number) => ({
        id: loc.id || `loc-${index}`,
        placeholderName: loc.placeholderName || `{PUB_${index + 1}}`,
        actualName: loc.actualName || '',
        venueType: loc.venueType || 'traditional-pub',
        mapsLink: loc.mapsLink || '',
        narrative: loc.narrative || '',
        transitionText: loc.transitionText || '',
      }))
    }
    
    // Generate default locations if none exist
    return Array.from({ length: gameData.pubCount || 5 }, (_, index) => ({
      id: `loc-${index}`,
      placeholderName: `{PUB_${index + 1}}`,
      actualName: '',
      venueType: 'traditional-pub' as VenueType,
      mapsLink: '',
      narrative: '',
      transitionText: '',
    }))
  })

  const venueTypes: { value: VenueType; label: string; description: string }[] = [
    { value: 'traditional-pub', label: 'Traditional Pub', description: 'Classic British pub atmosphere' },
    { value: 'modern-bar', label: 'Modern Bar', description: 'Contemporary bar with craft drinks' },
    { value: 'gastropub', label: 'Gastropub', description: 'Pub with high-quality food' },
    { value: 'brewery', label: 'Brewery', description: 'Local brewery with fresh beer' },
    { value: 'wine-bar', label: 'Wine Bar', description: 'Sophisticated wine-focused venue' },
    { value: 'cocktail-lounge', label: 'Cocktail Lounge', description: 'Upscale cocktail bar' },
  ]

  const updateLocation = (index: number, field: string, value: string) => {
    setLocations((prev: any[]) => prev.map((loc: any, i: number) => 
      i === index ? { ...loc, [field]: value } : loc
    ))
  }

  const handleContinue = () => {
    const updatedContent = {
      ...gameData.content,
      locations: locations.map((loc: any) => ({
        ...loc,
        puzzles: gameData.content?.locations?.find((l: any) => l.id === loc.id)?.puzzles || []
      }))
    }

    onComplete({ content: updatedContent })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            Location Setup
          </CardTitle>
          <CardDescription>
            Configure the pub locations for your {gameData.theme} game in {gameData.city}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {locations.map((location: any, index: number) => (
              <Card key={location.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Building className="h-4 w-4 mr-2" />
                    {location.placeholderName} - Pub {index + 1}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${index}`}>Pub Name</Label>
                      <Input
                        id={`name-${index}`}
                        placeholder={`e.g., The Crown & Anchor`}
                        value={location.actualName}
                        onChange={(e) => updateLocation(index, 'actualName', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`type-${index}`}>Venue Type</Label>
                      <Select
                        value={location.venueType}
                        onValueChange={(value) => updateLocation(index, 'venueType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {venueTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`maps-${index}`} className="flex items-center">
                      <Link className="h-4 w-4 mr-1" />
                      Google Maps Link (Optional)
                    </Label>
                    <Input
                      id={`maps-${index}`}
                      placeholder="https://maps.google.com/..."
                      value={location.mapsLink}
                      onChange={(e) => updateLocation(index, 'mapsLink', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`narrative-${index}`}>Location Narrative</Label>
                    <textarea
                      id={`narrative-${index}`}
                      className="w-full p-3 border border-gray-300 rounded-md resize-none"
                      rows={3}
                      placeholder="Describe the story context for this location..."
                      value={location.narrative}
                      onChange={(e) => updateLocation(index, 'narrative', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`transition-${index}`}>Transition Text</Label>
                    <textarea
                      id={`transition-${index}`}
                      className="w-full p-3 border border-gray-300 rounded-md resize-none"
                      rows={2}
                      placeholder="Text that leads players to the next location..."
                      value={location.transitionText}
                      onChange={(e) => updateLocation(index, 'transitionText', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleContinue} size="lg">
          Continue to Puzzle Generation
        </Button>
      </div>
    </div>
  )
}
