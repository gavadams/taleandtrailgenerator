/**
 * Text replacement utilities for substituting placeholders with actual values
 */

export interface LocationData {
  placeholderName: string
  actualName?: string
  venueType?: string
  mapsLink?: string
}

export interface LocationMapping {
  [key: string]: {
    name: string
    venueType?: string
    mapsLink?: string
  }
}

/**
 * Replaces placeholders in text with actual values from location data
 * @param text - The text containing placeholders like {PUB_1}, {PUB_2}, etc.
 * @param locationMapping - Object mapping placeholder names to actual data
 * @param fallbackToPlaceholder - If true, shows placeholder name when actual name is missing
 * @returns Text with placeholders replaced
 */
export function replaceLocationPlaceholders(
  text: string,
  locationMapping: LocationMapping,
  fallbackToPlaceholder: boolean = false
): string {
  if (!text || !locationMapping) return text

  let result = text

  // Replace {PUB_1}, {PUB_2}, etc. with actual names
  const placeholderRegex = /\{PUB_(\d+)\}/g
  
  result = result.replace(placeholderRegex, (match, pubNumber) => {
    const placeholderName = `{PUB_${pubNumber}}`
    const locationData = locationMapping[placeholderName]
    
    if (locationData?.name) {
      return locationData.name
    }
    
    if (fallbackToPlaceholder) {
      return placeholderName
    }
    
    return match // Keep original placeholder if no replacement found
  })

  // Replace other common placeholders
  const commonPlaceholders = {
    '{CITY}': locationMapping['{CITY}']?.name || '',
    '{AREA}': locationMapping['{AREA}']?.name || '',
    '{THEME}': locationMapping['{THEME}']?.name || '',
  }

  Object.entries(commonPlaceholders).forEach(([placeholder, value]) => {
    if (value) {
      result = result.replace(new RegExp(placeholder.replace(/[{}]/g, '\\$&'), 'g'), value)
    }
  })

  return result
}

/**
 * Replaces placeholders in multiple text fields of a location
 * @param location - Location object with narrative and transitionText
 * @param locationMapping - Object mapping placeholder names to actual data
 * @returns Location object with placeholders replaced
 */
export function replaceLocationTextPlaceholders(
  location: any,
  locationMapping: LocationMapping
): any {
  if (!location || !locationMapping) return location

  return {
    ...location,
    narrative: replaceLocationPlaceholders(location.narrative, locationMapping),
    transitionText: replaceLocationPlaceholders(location.transitionText, locationMapping),
    puzzles: location.puzzles?.map((puzzle: any) => ({
      ...puzzle,
      narrative: replaceLocationPlaceholders(puzzle.narrative, locationMapping),
      content: replaceLocationPlaceholders(puzzle.content, locationMapping),
      clues: puzzle.clues?.map((clue: string) => 
        replaceLocationPlaceholders(clue, locationMapping)
      )
    }))
  }
}

/**
 * Replaces placeholders in game content
 * @param gameContent - Game content object with intro, locations, and resolution
 * @param locationMapping - Object mapping placeholder names to actual data
 * @returns Game content with placeholders replaced
 */
export function replaceGameContentPlaceholders(
  gameContent: any,
  locationMapping: LocationMapping
): any {
  if (!gameContent || !locationMapping) return gameContent

  return {
    ...gameContent,
    intro: gameContent.intro ? {
      ...gameContent.intro,
      content: replaceLocationPlaceholders(gameContent.intro.content, locationMapping)
    } : undefined,
    locations: gameContent.locations?.map((location: any) => 
      replaceLocationTextPlaceholders(location, locationMapping)
    ),
    resolution: gameContent.resolution ? {
      ...gameContent.resolution,
      content: replaceLocationPlaceholders(gameContent.resolution.content, locationMapping)
    } : undefined
  }
}

/**
 * Creates a location mapping from game data
 * @param game - Game object with locations and locationPlaceholders
 * @returns Location mapping object
 */
export function createLocationMapping(game: any): LocationMapping {
  const mapping: LocationMapping = {}

  // Add location placeholders
  if (game.locationPlaceholders) {
    Object.entries(game.locationPlaceholders).forEach(([key, value]: [string, any]) => {
      mapping[key] = {
        name: value.name || key,
        venueType: value.venueType,
        mapsLink: value.mapsLink
      }
    })
  }

  // Add locations data
  if (game.content?.locations) {
    game.content.locations.forEach((location: any) => {
      if (location.placeholderName && location.actualName) {
        mapping[location.placeholderName] = {
          name: location.actualName,
          venueType: location.venueType,
          mapsLink: location.mapsLink
        }
      }
    })
  }

  return mapping
}
