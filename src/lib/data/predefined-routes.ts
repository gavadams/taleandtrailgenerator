export interface PredefinedRoute {
  id: string
  name: string
  city: string
  area: string
  description: string
  estimatedDuration: number
  walkingDistance: string
  difficulty: 'easy' | 'medium' | 'hard'
  pubs: {
    name: string
    type: 'traditional-pub' | 'modern-bar' | 'gastropub' | 'brewery' | 'wine-bar' | 'cocktail-lounge'
    description: string
    walkingTime?: string
  }[]
  highlights: string[]
  bestFor: string[]
}

export const predefinedRoutes: PredefinedRoute[] = [
  // London Routes
  {
    id: 'london-west-end',
    name: 'West End Theatre District',
    city: 'london',
    area: 'West End',
    description: 'A glamorous crawl through London\'s theatre district, featuring historic pubs and modern bars near famous theatres.',
    estimatedDuration: 180,
    walkingDistance: '1.2 miles',
    difficulty: 'easy',
    pubs: [
      {
        name: 'The Lamb & Flag',
        type: 'traditional-pub',
        description: 'Historic 17th century pub with literary connections',
        walkingTime: '5 minutes'
      },
      {
        name: 'The French House',
        type: 'traditional-pub',
        description: 'Famous Soho institution with bohemian history',
        walkingTime: '8 minutes'
      },
      {
        name: 'The Coach & Horses',
        type: 'traditional-pub',
        description: 'Traditional Soho pub with character',
        walkingTime: '6 minutes'
      },
      {
        name: 'The Crown & Two Chairmen',
        type: 'traditional-pub',
        description: 'Historic pub with traditional British fare',
        walkingTime: '7 minutes'
      },
      {
        name: 'The George',
        type: 'modern-bar',
        description: 'Contemporary bar with craft cocktails',
        walkingTime: '10 minutes'
      }
    ],
    highlights: ['Theatre history', 'Literary connections', 'Historic architecture', 'Soho nightlife'],
    bestFor: ['Theatre lovers', 'History enthusiasts', 'First-time visitors']
  },
  {
    id: 'london-camden',
    name: 'Camden Alternative Scene',
    city: 'london',
    area: 'Camden',
    description: 'Explore Camden\'s alternative music scene and vibrant nightlife through its most iconic venues.',
    estimatedDuration: 240,
    walkingDistance: '1.8 miles',
    difficulty: 'medium',
    pubs: [
      {
        name: 'The World\'s End',
        type: 'traditional-pub',
        description: 'Large pub with live music and alternative crowd',
        walkingTime: '8 minutes'
      },
      {
        name: 'The Dublin Castle',
        type: 'traditional-pub',
        description: 'Legendary music venue where many bands got their start',
        walkingTime: '5 minutes'
      },
      {
        name: 'The Hawley Arms',
        type: 'traditional-pub',
        description: 'Famous for its celebrity clientele and great atmosphere',
        walkingTime: '6 minutes'
      },
      {
        name: 'The Lock Tavern',
        type: 'modern-bar',
        description: 'Trendy bar with rooftop terrace',
        walkingTime: '7 minutes'
      },
      {
        name: 'The Camden Head',
        type: 'traditional-pub',
        description: 'Traditional pub with comedy nights',
        walkingTime: '10 minutes'
      }
    ],
    highlights: ['Live music venues', 'Alternative culture', 'Celebrity spotting', 'Vibrant nightlife'],
    bestFor: ['Music lovers', 'Alternative culture fans', 'Young adults']
  },

  // Manchester Routes
  {
    id: 'manchester-northern-quarter',
    name: 'Northern Quarter Creative Hub',
    city: 'manchester',
    area: 'Northern Quarter',
    description: 'Discover Manchester\'s creative heart through its independent bars, breweries, and cultural venues.',
    estimatedDuration: 200,
    walkingDistance: '1.5 miles',
    difficulty: 'easy',
    pubs: [
      {
        name: 'The Castle Hotel',
        type: 'traditional-pub',
        description: 'Historic pub with live music and great atmosphere',
        walkingTime: '6 minutes'
      },
      {
        name: 'The Port Street Beer House',
        type: 'brewery',
        description: 'Specialist craft beer bar with rotating taps',
        walkingTime: '4 minutes'
      },
      {
        name: 'The Whiskey Jar',
        type: 'modern-bar',
        description: 'Intimate bar with extensive whiskey collection',
        walkingTime: '5 minutes'
      },
      {
        name: 'The Soup Kitchen',
        type: 'modern-bar',
        description: 'Underground bar with live music and events',
        walkingTime: '7 minutes'
      },
      {
        name: 'The Crown & Kettle',
        type: 'traditional-pub',
        description: 'Victorian pub with original features and great food',
        walkingTime: '8 minutes'
      }
    ],
    highlights: ['Independent venues', 'Craft beer scene', 'Live music', 'Creative atmosphere'],
    bestFor: ['Craft beer enthusiasts', 'Music lovers', 'Creative types']
  },

  // Birmingham Routes
  {
    id: 'birmingham-jewellery-quarter',
    name: 'Jewellery Quarter Heritage',
    city: 'birmingham',
    area: 'Jewellery Quarter',
    description: 'Explore Birmingham\'s historic Jewellery Quarter through its traditional pubs and modern bars.',
    estimatedDuration: 180,
    walkingDistance: '1.3 miles',
    difficulty: 'easy',
    pubs: [
      {
        name: 'The Rose Villa Tavern',
        type: 'traditional-pub',
        description: 'Victorian pub with original features and great food',
        walkingTime: '5 minutes'
      },
      {
        name: 'The Lord Clifden',
        type: 'traditional-pub',
        description: 'Historic pub with traditional British fare',
        walkingTime: '6 minutes'
      },
      {
        name: 'The Church Inn',
        type: 'traditional-pub',
        description: 'Converted church with unique atmosphere',
        walkingTime: '7 minutes'
      },
      {
        name: 'The Button Factory',
        type: 'modern-bar',
        description: 'Modern bar in converted industrial building',
        walkingTime: '8 minutes'
      },
      {
        name: 'The Red Lion',
        type: 'traditional-pub',
        description: 'Traditional pub with local character',
        walkingTime: '10 minutes'
      }
    ],
    highlights: ['Industrial heritage', 'Historic architecture', 'Traditional pubs', 'Local character'],
    bestFor: ['History enthusiasts', 'Traditional pub lovers', 'Heritage seekers']
  },

  // Liverpool Routes
  {
    id: 'liverpool-albert-dock',
    name: 'Albert Dock Waterfront',
    city: 'liverpool',
    area: 'Albert Dock',
    description: 'Experience Liverpool\'s waterfront through its historic docks and modern bars with stunning river views.',
    estimatedDuration: 160,
    walkingDistance: '1.1 miles',
    difficulty: 'easy',
    pubs: [
      {
        name: 'The Pump House',
        type: 'traditional-pub',
        description: 'Historic pub in converted pump house with river views',
        walkingTime: '5 minutes'
      },
      {
        name: 'The Baltic Fleet',
        type: 'traditional-pub',
        description: 'Traditional pub with maritime history',
        walkingTime: '6 minutes'
      },
      {
        name: 'The Grapes',
        type: 'traditional-pub',
        description: 'Historic pub with traditional character',
        walkingTime: '7 minutes'
      },
      {
        name: 'The Ship & Mitre',
        type: 'traditional-pub',
        description: 'Traditional pub with great atmosphere',
        walkingTime: '8 minutes'
      },
      {
        name: 'The Cavern Club',
        type: 'modern-bar',
        description: 'Famous music venue where The Beatles played',
        walkingTime: '10 minutes'
      }
    ],
    highlights: ['Waterfront views', 'Maritime history', 'Beatles connections', 'Historic docks'],
    bestFor: ['Music history fans', 'Waterfront lovers', 'Beatles enthusiasts']
  },

  // Newcastle Routes
  {
    id: 'newcastle-quayside',
    name: 'Quayside Riverside',
    city: 'newcastle',
    area: 'Quayside',
    description: 'Follow the River Tyne through Newcastle\'s most scenic area with historic pubs and modern bars.',
    estimatedDuration: 170,
    walkingDistance: '1.4 miles',
    difficulty: 'easy',
    pubs: [
      {
        name: 'The Tyne Bar',
        type: 'traditional-pub',
        description: 'Riverside pub with stunning Tyne Bridge views',
        walkingTime: '6 minutes'
      },
      {
        name: 'The Free Trade Inn',
        type: 'traditional-pub',
        description: 'Historic pub with panoramic river views',
        walkingTime: '5 minutes'
      },
      {
        name: 'The Red House',
        type: 'modern-bar',
        description: 'Modern bar with craft beer and river views',
        walkingTime: '7 minutes'
      },
      {
        name: 'The Bridge Hotel',
        type: 'traditional-pub',
        description: 'Historic hotel bar with traditional character',
        walkingTime: '8 minutes'
      },
      {
        name: 'The Cluny',
        type: 'modern-bar',
        description: 'Arts venue with bar and live music',
        walkingTime: '10 minutes'
      }
    ],
    highlights: ['Riverside views', 'Historic bridges', 'Arts scene', 'Scenic walks'],
    bestFor: ['Scenic walkers', 'Arts enthusiasts', 'Riverside lovers']
  },

  // Sunderland Routes
  {
    id: 'sunderland-city-centre',
    name: 'City Centre Heritage',
    city: 'sunderland',
    area: 'City Centre',
    description: 'Explore Sunderland\'s city centre through its traditional pubs and modern venues.',
    estimatedDuration: 150,
    walkingDistance: '1.2 miles',
    difficulty: 'easy',
    pubs: [
      {
        name: 'The Dun Cow',
        type: 'traditional-pub',
        description: 'Historic pub with traditional character',
        walkingTime: '5 minutes'
      },
      {
        name: 'The Peacock',
        type: 'gastropub',
        description: 'Modern gastropub with great food',
        walkingTime: '6 minutes'
      },
      {
        name: 'The Ship Inn',
        type: 'traditional-pub',
        description: 'Traditional pub with maritime connections',
        walkingTime: '7 minutes'
      },
      {
        name: 'The Stadium Inn',
        type: 'traditional-pub',
        description: 'Popular pub near the football stadium',
        walkingTime: '8 minutes'
      },
      {
        name: 'The Isis',
        type: 'modern-bar',
        description: 'Modern bar with contemporary atmosphere',
        walkingTime: '10 minutes'
      }
    ],
    highlights: ['Local character', 'Traditional pubs', 'City centre atmosphere', 'Local history'],
    bestFor: ['Local explorers', 'Traditional pub lovers', 'City centre visitors']
  }
]

export function getPredefinedRoutesByCity(city: string): PredefinedRoute[] {
  return predefinedRoutes.filter(route => 
    route.city.toLowerCase() === city.toLowerCase()
  )
}

export function getPredefinedRouteById(id: string): PredefinedRoute | undefined {
  return predefinedRoutes.find(route => route.id === id)
}
