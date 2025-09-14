/**
 * Test file for count validation functionality
 * This demonstrates how the count enforcement works
 */

// Mock AI response validation
function validateCounts(parsed: any, request: any) {
  const actualLocationCount = parsed.locations.length
  const actualPuzzleCount = parsed.puzzles.length
  const expectedLocationCount = request.pubCount
  const expectedPuzzleCount = request.pubCount * request.puzzlesPerPub

  console.log('Count validation:', {
    expectedLocations: expectedLocationCount,
    actualLocations: actualLocationCount,
    expectedPuzzles: expectedPuzzleCount,
    actualPuzzles: actualPuzzleCount
  })

  if (actualLocationCount !== expectedLocationCount) {
    throw new Error(`AI generated ${actualLocationCount} locations but ${expectedLocationCount} were requested. Please try again.`)
  }

  if (actualPuzzleCount !== expectedPuzzleCount) {
    throw new Error(`AI generated ${actualPuzzleCount} puzzles but ${expectedPuzzleCount} were requested. Please try again.`)
  }

  // Validate that puzzles are distributed correctly across locations
  const puzzlesPerLocation = new Map<number, number>()
  parsed.puzzles.forEach((puzzle: any) => {
    const order = puzzle.order
    if (order >= 1 && order <= expectedLocationCount) {
      puzzlesPerLocation.set(order, (puzzlesPerLocation.get(order) || 0) + 1)
    }
  })

  for (let i = 1; i <= expectedLocationCount; i++) {
    const puzzleCount = puzzlesPerLocation.get(i) || 0
    if (puzzleCount !== request.puzzlesPerPub) {
      throw new Error(`Location ${i} has ${puzzleCount} puzzles but ${request.puzzlesPerPub} were requested. Please try again.`)
    }
  }

  return true
}

// Test cases
const testCases = [
  {
    name: "Correct counts - 3 pubs, 2 puzzles each",
    request: { pubCount: 3, puzzlesPerPub: 2 },
    response: {
      locations: [
        { order: 1, placeholderName: "{PUB_1}" },
        { order: 2, placeholderName: "{PUB_2}" },
        { order: 3, placeholderName: "{PUB_3}" }
      ],
      puzzles: [
        { order: 1, title: "Puzzle 1-1" },
        { order: 1, title: "Puzzle 1-2" },
        { order: 2, title: "Puzzle 2-1" },
        { order: 2, title: "Puzzle 2-2" },
        { order: 3, title: "Puzzle 3-1" },
        { order: 3, title: "Puzzle 3-2" }
      ]
    },
    shouldPass: true
  },
  {
    name: "Too many locations - 4 pubs instead of 3",
    request: { pubCount: 3, puzzlesPerPub: 2 },
    response: {
      locations: [
        { order: 1, placeholderName: "{PUB_1}" },
        { order: 2, placeholderName: "{PUB_2}" },
        { order: 3, placeholderName: "{PUB_3}" },
        { order: 4, placeholderName: "{PUB_4}" } // Too many!
      ],
      puzzles: [
        { order: 1, title: "Puzzle 1-1" },
        { order: 1, title: "Puzzle 1-2" },
        { order: 2, title: "Puzzle 2-1" },
        { order: 2, title: "Puzzle 2-2" },
        { order: 3, title: "Puzzle 3-1" },
        { order: 3, title: "Puzzle 3-2" }
      ]
    },
    shouldPass: false
  },
  {
    name: "Too few puzzles - 1 puzzle per pub instead of 2",
    request: { pubCount: 3, puzzlesPerPub: 2 },
    response: {
      locations: [
        { order: 1, placeholderName: "{PUB_1}" },
        { order: 2, placeholderName: "{PUB_2}" },
        { order: 3, placeholderName: "{PUB_3}" }
      ],
      puzzles: [
        { order: 1, title: "Puzzle 1-1" },
        { order: 2, title: "Puzzle 2-1" },
        { order: 3, title: "Puzzle 3-1" }
        // Missing second puzzle for each location
      ]
    },
    shouldPass: false
  },
  {
    name: "Uneven puzzle distribution",
    request: { pubCount: 3, puzzlesPerPub: 2 },
    response: {
      locations: [
        { order: 1, placeholderName: "{PUB_1}" },
        { order: 2, placeholderName: "{PUB_2}" },
        { order: 3, placeholderName: "{PUB_3}" }
      ],
      puzzles: [
        { order: 1, title: "Puzzle 1-1" },
        { order: 1, title: "Puzzle 1-2" },
        { order: 2, title: "Puzzle 2-1" },
        { order: 2, title: "Puzzle 2-2" },
        { order: 3, title: "Puzzle 3-1" },
        { order: 3, title: "Puzzle 3-2" },
        { order: 3, title: "Puzzle 3-3" } // Too many for location 3
      ]
    },
    shouldPass: false
  }
]

// Run tests
console.log('🧪 Testing Count Validation Functionality\n')

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.name}`)
  console.log(`Request: ${testCase.request.pubCount} pubs, ${testCase.request.puzzlesPerPub} puzzles each`)
  console.log(`Response: ${testCase.response.locations.length} locations, ${testCase.response.puzzles.length} puzzles`)
  
  try {
    validateCounts(testCase.response, testCase.request)
    const passed = testCase.shouldPass
    console.log(`Status: ${passed ? '✅ PASS' : '❌ FAIL (should have failed but passed)'}`)
  } catch (error: any) {
    const passed = !testCase.shouldPass
    console.log(`Status: ${passed ? '✅ PASS' : '❌ FAIL'}`)
    console.log(`Error: ${error.message}`)
  }
  console.log('---')
})

export { validateCounts, testCases }
