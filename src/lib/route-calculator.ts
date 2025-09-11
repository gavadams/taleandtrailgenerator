import { Game } from '@/types'

// Simple client-side route estimation (no external API calls)
export function calculateGameRouteInfo(game: Game): Game['routeInfo'] {
  if (!game.content?.locations || game.content.locations.length < 2) {
    return {
      totalDistance: '0 miles',
      totalTime: '0 minutes',
      isValid: false
    }
  }

  // Simple estimation based on pub count
  // Rough estimate: 0.3 miles per pub + 5 minutes walking per pub
  const pubCount = game.content.locations.length
  const estimatedDistance = Math.round(pubCount * 0.3 * 10) / 10 // Round to 1 decimal
  const estimatedTime = Math.round(pubCount * 5) // 5 minutes per pub

  return {
    totalDistance: `${estimatedDistance} miles`,
    totalTime: `${estimatedTime} min`,
    isValid: true
  }
}

export function calculateRouteInfoForGames(games: Game[]): Game[] {
  return games.map((game) => {
    const routeInfo = calculateGameRouteInfo(game)
    return {
      ...game,
      routeInfo
    }
  })
}
