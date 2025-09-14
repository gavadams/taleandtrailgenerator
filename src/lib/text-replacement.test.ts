/**
 * Test file for text replacement functionality
 * This demonstrates how the placeholder replacement works
 */

import { replaceLocationPlaceholders, createLocationMapping } from './text-replacement'

// Test data
const testLocationMapping = {
  '{PUB_1}': {
    name: 'The Centurian',
    venueType: 'modern-bar',
    mapsLink: 'https://maps.google.com/?q=The+Centurian'
  },
  '{PUB_2}': {
    name: 'The Red Lion',
    venueType: 'traditional-pub',
    mapsLink: 'https://maps.google.com/?q=The+Red+Lion'
  },
  '{CITY}': {
    name: 'Newcastle',
    venueType: '',
    mapsLink: ''
  }
}

// Test cases
const testCases = [
  {
    input: "Your investigation begins at {PUB_1}, a pub nestled within Newcastle Central Station.",
    expected: "Your investigation begins at The Centurian, a pub nestled within Newcastle Central Station.",
    description: "Basic pub name replacement"
  },
  {
    input: "The bartender at {PUB_1} mentions that someone was seen near {PUB_2}.",
    expected: "The bartender at The Centurian mentions that someone was seen near The Red Lion.",
    description: "Multiple pub name replacements"
  },
  {
    input: "Visit {PUB_1} first, then head to {PUB_2} for the next clue.",
    expected: "Visit The Centurian first, then head to The Red Lion for the next clue.",
    description: "Sequential pub name replacements"
  },
  {
    input: "The mystery unfolds in {CITY} as you explore {PUB_1}.",
    expected: "The mystery unfolds in Newcastle as you explore The Centurian.",
    description: "City and pub name replacements"
  },
  {
    input: "No placeholders here - just regular text.",
    expected: "No placeholders here - just regular text.",
    description: "Text without placeholders"
  },
  {
    input: "Unknown placeholder {PUB_99} should remain unchanged.",
    expected: "Unknown placeholder {PUB_99} should remain unchanged.",
    description: "Unknown placeholder handling"
  }
]

// Run tests
console.log('🧪 Testing Text Replacement Functionality\n')

testCases.forEach((testCase, index) => {
  const result = replaceLocationPlaceholders(testCase.input, testLocationMapping)
  const passed = result === testCase.expected
  
  console.log(`Test ${index + 1}: ${testCase.description}`)
  console.log(`Input:    "${testCase.input}"`)
  console.log(`Expected: "${testCase.expected}"`)
  console.log(`Result:   "${result}"`)
  console.log(`Status:   ${passed ? '✅ PASS' : '❌ FAIL'}`)
  console.log('---')
})

// Test with fallback
console.log('\n🔄 Testing with fallback to placeholder names:')
const fallbackResult = replaceLocationPlaceholders(
  "Visit {PUB_1} and {PUB_99} for clues.",
  testLocationMapping,
  true // fallbackToPlaceholder = true
)
console.log(`Input:    "Visit {PUB_1} and {PUB_99} for clues."`)
console.log(`Result:   "${fallbackResult}"`)
console.log(`Expected: "Visit The Centurian and {PUB_99} for clues."`)

export { testCases, testLocationMapping }
