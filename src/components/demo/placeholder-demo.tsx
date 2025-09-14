'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { replaceLocationPlaceholders, createLocationMapping } from '@/lib/text-replacement'

export function PlaceholderDemo() {
  const [inputText, setInputText] = useState(
    "Your investigation begins at {PUB_1}, a pub nestled within Newcastle Central Station. The bartender mentions a coded message was seen near {PUB_2}. The next location may hold the key..."
  )
  const [pub1Name, setPub1Name] = useState('The Centurian')
  const [pub2Name, setPub2Name] = useState('The Red Lion')
  const [result, setResult] = useState('')

  const handleReplace = () => {
    const locationMapping = {
      '{PUB_1}': {
        name: pub1Name,
        venueType: 'modern-bar',
        mapsLink: ''
      },
      '{PUB_2}': {
        name: pub2Name,
        venueType: 'traditional-pub',
        mapsLink: ''
      }
    }

    const replaced = replaceLocationPlaceholders(inputText, locationMapping)
    setResult(replaced)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Placeholder Replacement Demo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="pub1">Pub 1 Name</Label>
              <Input
                id="pub1"
                value={pub1Name}
                onChange={(e) => setPub1Name(e.target.value)}
                placeholder="Enter pub name"
              />
            </div>
            <div>
              <Label htmlFor="pub2">Pub 2 Name</Label>
              <Input
                id="pub2"
                value={pub2Name}
                onChange={(e) => setPub2Name(e.target.value)}
                placeholder="Enter pub name"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="input-text">Story Text with Placeholders</Label>
            <Textarea
              id="input-text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              rows={4}
              placeholder="Enter text with {PUB_1}, {PUB_2} placeholders"
            />
          </div>

          <Button onClick={handleReplace} className="w-full">
            Replace Placeholders
          </Button>

          {result && (
            <div>
              <Label>Result with Replaced Names</Label>
              <div className="p-4 bg-gray-50 rounded-lg border">
                <p className="whitespace-pre-wrap">{result}</p>
              </div>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <p><strong>How it works:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-2">
              <li>Use <code>{'{PUB_1}'}</code>, <code>{'{PUB_2}'}</code>, etc. as placeholders in your story text</li>
              <li>The system automatically replaces these with actual pub names from your database</li>
              <li>This allows you to write generic story templates that work with any pub names</li>
              <li>Perfect for AI-generated content that needs to be customized per location</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
