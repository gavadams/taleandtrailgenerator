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
  // Existing routes (kept as-is)
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
  },

  // ===== New/Additional Routes (England, Scotland, Wales, N Ireland) =====

  // London additional routes
  {
    id: 'london-shoreditch',
    name: 'Shoreditch Streetwise',
    city: 'london',
    area: 'Shoreditch',
    description: 'A hip crawl through Shoreditch’s street-art-lined lanes, craft beer spots and cocktail dens.',
    estimatedDuration: 200,
    walkingDistance: '1.6 miles',
    difficulty: 'medium',
    pubs: [
      { name: 'The Old Blue Last', type: 'modern-bar', description: 'Live music and indie crowd', walkingTime: '4 minutes' },
      { name: 'The Ten Bells', type: 'traditional-pub', description: 'Victorian boozer with lots of history', walkingTime: '6 minutes' },
      { name: 'The Shoreditch', type: 'modern-bar', description: 'Trendy rooftop vibes', walkingTime: '7 minutes' },
      { name: 'Beavertown Taproom', type: 'brewery', description: 'Popular craft beer taproom', walkingTime: '5 minutes' },
      { name: 'Callooh Callay', type: 'cocktail-lounge', description: 'Playful cocktails with a speakeasy feel', walkingTime: '8 minutes' }
    ],
    highlights: ['Street art', 'Craft beer', 'Rooftop bars', 'Live music'],
    bestFor: ['Trendy crowds', 'Street art lovers', 'Craft beer fans']
  },
  {
    id: 'london-southbank',
    name: 'Southbank Stroll',
    city: 'london',
    area: 'South Bank',
    description: 'Riverfront pubs and riverside views — ideal after a museum or gallery day.',
    estimatedDuration: 160,
    walkingDistance: '1.1 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Anchor Bankside', type: 'traditional-pub', description: 'Historic riverside haunt', walkingTime: '4 minutes' },
      { name: 'The Founders Arms', type: 'modern-bar', description: 'Riverside terrace and cocktails', walkingTime: '6 minutes' },
      { name: 'The Cutty Sark Tavern', type: 'traditional-pub', description: 'Classic pub with good food', walkingTime: '5 minutes' },
      { name: 'Skylon Bar', type: 'cocktail-lounge', description: 'Stylish cocktails with Thames views', walkingTime: '8 minutes' },
      { name: 'Four Quarters', type: 'brewery', description: 'Independent brewery-style bar', walkingTime: '7 minutes' }
    ],
    highlights: ['River Thames', 'Southbank Centre', 'Museum quarter', 'Riverside terraces'],
    bestFor: ['Sightseers', 'Couples', 'Art lovers']
  },

  // Manchester additional
  {
    id: 'manchester-spinningfields',
    name: 'Spinningfields & Deansgate',
    city: 'manchester',
    area: 'Spinningfields',
    description: 'Upscale bars and modern pubs tucked among Manchester’s corporate heart.',
    estimatedDuration: 160,
    walkingDistance: '1.0 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Oast House', type: 'gastropub', description: 'Large multi-level pub with courtyard', walkingTime: '5 minutes' },
      { name: 'The Botanist', type: 'modern-bar', description: 'Botanical-themed drinks and skyline views', walkingTime: '6 minutes' },
      { name: 'Lost and Found', type: 'cocktail-lounge', description: 'Ornate cocktail bar with vintage feel', walkingTime: '4 minutes' },
      { name: 'Sam\'s Chop House', type: 'traditional-pub', description: 'Classic British with steak focus', walkingTime: '7 minutes' },
      { name: 'Cloudwater Taproom', type: 'brewery', description: 'Craft beer from a local microbrewery', walkingTime: '8 minutes' }
    ],
    highlights: ['Modern bars', 'Riverside dining', 'Trendy nightlife'],
    bestFor: ['After-work groups', 'Foodies', 'Craft beer fans']
  },

  // Liverpool additional
  {
    id: 'liverpool-cavern-quarter',
    name: 'Cavern Quarter Music Trail',
    city: 'liverpool',
    area: 'Cavern Quarter',
    description: 'Beatles-era pubs and music venues concentrated in the Cavern area.',
    estimatedDuration: 150,
    walkingDistance: '0.9 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Grapes (Mathew Street)', type: 'traditional-pub', description: 'Close to Cavern Club with classic feel', walkingTime: '3 minutes' },
      { name: 'The Cavern Club Bar', type: 'modern-bar', description: 'Iconic music venue with a bar', walkingTime: '4 minutes' },
      { name: 'Molly Malone\'s', type: 'traditional-pub', description: 'Irish pub with live music nights', walkingTime: '5 minutes' },
      { name: 'The Kazimier', type: 'modern-bar', description: 'Eclectic venue with DJs and gigs', walkingTime: '6 minutes' },
      { name: 'The Shipping Forecast', type: 'modern-bar', description: 'Independent craft beer and ale', walkingTime: '7 minutes' }
    ],
    highlights: ['Beatles history', 'Live music', 'Mathew Street'],
    bestFor: ['Music historians', 'Beatles fans', 'Live music lovers']
  },

  // Birmingham additional
  {
    id: 'birmingham-broad-street',
    name: 'Broad Street Night Out',
    city: 'birmingham',
    area: 'Broad Street',
    description: 'A compact route through Birmingham’s entertainment mile — bars, music and late-night spots.',
    estimatedDuration: 180,
    walkingDistance: '1.2 miles',
    difficulty: 'medium',
    pubs: [
      { name: 'The Living Room', type: 'modern-bar', description: 'Cocktails and sharing plates', walkingTime: '4 minutes' },
      { name: 'The Canal House', type: 'gastropub', description: 'Canalside dining and drinks', walkingTime: '6 minutes' },
      { name: 'The Old Joint Stock', type: 'traditional-pub', description: 'Converted theatre pub with stage', walkingTime: '5 minutes' },
      { name: 'BrewDog Birmingham', type: 'brewery', description: 'Popular craft beer chain with rotating taps', walkingTime: '7 minutes' },
      { name: 'Lobby Bar', type: 'cocktail-lounge', description: 'Modern hotel bar popular with revellers', walkingTime: '8 minutes' }
    ],
    highlights: ['Live entertainment', 'Canal-side stops', 'Late-night options'],
    bestFor: ['Groups', 'Nightlife seekers', 'After-show crowds']
  },

  // Newcastle additional
  {
    id: 'newcastle-ouseburn',
    name: 'Ouseburn Creative Quarter',
    city: 'newcastle',
    area: 'Ouseburn',
    description: 'Eclectic bars, microbreweries and arts spaces in Ouseburn Valley.',
    estimatedDuration: 180,
    walkingDistance: '1.2 miles',
    difficulty: 'medium',
    pubs: [
      { name: 'Tyne Bank Brewery', type: 'brewery', description: 'Brewery taproom with local ales', walkingTime: '4 minutes' },
      { name: 'The Cumberland Arms', type: 'traditional-pub', description: 'Characterful pub with real ales', walkingTime: '6 minutes' },
      { name: 'The Old Bakery', type: 'modern-bar', description: 'Small bar with live acoustic sets', walkingTime: '5 minutes' },
      { name: 'The Bridge Hotel', type: 'traditional-pub', description: 'Riverside drinking with friendly crowd', walkingTime: '7 minutes' },
      { name: 'The Cluny 2', type: 'modern-bar', description: 'Small music venue and bar', walkingTime: '8 minutes' }
    ],
    highlights: ['Microbreweries', 'Arts scene', 'Independent venues'],
    bestFor: ['Craft beer fans', 'Arts lovers', 'Local explorers']
  },

  // Edinburgh
  {
    id: 'edinburgh-old-town',
    name: 'Old Town Ale Trail',
    city: 'edinburgh',
    area: 'Old Town',
    description: 'Historic closes and narrow streets linking traditional pubs and whisky bars in the Old Town.',
    estimatedDuration: 180,
    walkingDistance: '1.3 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Royal Mile Tavern', type: 'traditional-pub', description: 'Lively pub near the Royal Mile', walkingTime: '5 minutes' },
      { name: 'The World\'s End', type: 'traditional-pub', description: 'Striking historic pub with connections to city lore', walkingTime: '4 minutes' },
      { name: 'Bow Bar', type: 'traditional-pub', description: 'Renowned for its whisky selection and ales', walkingTime: '6 minutes' },
      { name: 'The Scotch Whisky Experience Bar', type: 'wine-bar', description: 'Good for single malts and tasting flights', walkingTime: '7 minutes' },
      { name: 'The Devil\'s Advocate', type: 'cocktail-lounge', description: 'Hidden bar with strong cocktails', walkingTime: '8 minutes' }
    ],
    highlights: ['Whisky', 'Medieval streets', 'Historic architecture'],
    bestFor: ['Whisky fans', 'History buffs', 'Tourists']
  },
  {
    id: 'edinburgh-grassmarket',
    name: 'Grassmarket & Vennel',
    city: 'edinburgh',
    area: 'Grassmarket',
    description: 'Buzzing area with bars, pubs and skyline views of Edinburgh Castle.',
    estimatedDuration: 160,
    walkingDistance: '1.0 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Last Drop', type: 'traditional-pub', description: 'Creaky old tavern with real ales', walkingTime: '3 minutes' },
      { name: 'Maggie Dickson\'s', type: 'traditional-pub', description: 'Cosy pub named after a local legend', walkingTime: '4 minutes' },
      { name: 'The Bow Bar', type: 'traditional-pub', description: 'Classic whisky and ale options', walkingTime: '5 minutes' },
      { name: 'Hoot the Redeemer', type: 'modern-bar', description: 'Small live music pub with atmosphere', walkingTime: '6 minutes' },
      { name: 'The Vennel View Spot', type: 'cocktail-lounge', description: 'Great spot for sunset views and drinks', walkingTime: '7 minutes' }
    ],
    highlights: ['Castle views', 'Historic taverns', 'Live music'],
    bestFor: ['Scenic groups', 'Photo hunters', 'History fans']
  },

  // Glasgow
  {
    id: 'glasgow-west-end',
    name: 'West End Pubs & Live Music',
    city: 'glasgow',
    area: 'West End',
    description: 'Quirky bars, student haunts and live music near Byres Road and Ashton Lane.',
    estimatedDuration: 180,
    walkingDistance: '1.4 miles',
    difficulty: 'medium',
    pubs: [
      { name: 'The Pot Still', type: 'traditional-pub', description: 'Huge whisky list and snug atmosphere', walkingTime: '5 minutes' },
      { name: 'Mono', type: 'modern-bar', description: 'Vegan cafe/bar with regular gigs', walkingTime: '6 minutes' },
      { name: 'The Ubiquitous Chip', type: 'gastropub', description: 'Iconic Glasgow dining and bar', walkingTime: '7 minutes' },
      { name: 'Ashton Lane Bars', type: 'modern-bar', description: 'Cluster of trendy bars and courtyard vibe', walkingTime: '4 minutes' },
      { name: 'BrewDog Glasgow', type: 'brewery', description: 'Popular for craft ales and atmosphere', walkingTime: '8 minutes' }
    ],
    highlights: ['Live music', 'Whisky', 'Student vibe', 'Ashton Lane charm'],
    bestFor: ['Music lovers', 'Whisky fans', 'Students']
  },
  {
    id: 'glasgow-merchant-city',
    name: 'Merchant City Mix',
    city: 'glasgow',
    area: 'Merchant City',
    description: 'Stylish bars and late-night spots around Glasgow’s cosmopolitan quarter.',
    estimatedDuration: 160,
    walkingDistance: '0.9 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Scotia', type: 'traditional-pub', description: 'Old-school bar with live folk nights', walkingTime: '5 minutes' },
      { name: 'The Corinthian', type: 'cocktail-lounge', description: 'Grand cocktail bar in a listed building', walkingTime: '6 minutes' },
      { name: 'Brel', type: 'modern-bar', description: 'Contemporary bar with terrace', walkingTime: '4 minutes' },
      { name: 'The Bothy', type: 'traditional-pub', description: 'Cozy pub in Merchant City', walkingTime: '7 minutes' },
      { name: 'Drygate Brewery', type: 'brewery', description: 'Brewery taproom with food', walkingTime: '8 minutes' }
    ],
    highlights: ['Stylish bars', 'Cultural venues', 'Late-night'],
    bestFor: ['Style seekers', 'Groups', 'Couples']
  },

  // Belfast
  {
    id: 'belfast-cathedral-quarter',
    name: 'Cathedral Quarter Crawl',
    city: 'belfast',
    area: 'Cathedral Quarter',
    description: 'Cultural quarter packed with cosy pubs, live music and artisan breweries.',
    estimatedDuration: 170,
    walkingDistance: '1.1 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Duke of York', type: 'traditional-pub', description: 'Classic Victorian boozer', walkingTime: '4 minutes' },
      { name: 'Filthy McNasty\'s', type: 'modern-bar', description: 'Live music and buzzing atmosphere', walkingTime: '6 minutes' },
      { name: 'The Dirty Onion', type: 'gastropub', description: 'Large bar in a historic building with a courtyard', walkingTime: '5 minutes' },
      { name: 'White\'s Tavern', type: 'traditional-pub', description: 'Oldest tavern with historic charm', walkingTime: '7 minutes' },
      { name: 'Boundary Brewing Taproom', type: 'brewery', description: 'Local craft beer specialists', walkingTime: '8 minutes' }
    ],
    highlights: ['Live music', 'Local breweries', 'Historic taverns'],
    bestFor: ['Music lovers', 'History fans', 'Craft beer drinkers']
  },

  // Cardiff
  {
    id: 'cardiff-city-centre',
    name: 'Cardiff City Centre Circuit',
    city: 'cardiff',
    area: 'City Centre',
    description: 'Compact crawl through Cardiff’s bustling centre with modern bars and traditional pubs.',
    estimatedDuration: 150,
    walkingDistance: '1.0 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Potted Pig', type: 'gastropub', description: 'Vaulted cellar dining and cocktails', walkingTime: '4 minutes' },
      { name: 'Tiny Rebel', type: 'brewery', description: 'Welsh craft beers and lively spot', walkingTime: '6 minutes' },
      { name: 'The Moon', type: 'traditional-pub', description: 'Friendly local with good ales', walkingTime: '5 minutes' },
      { name: 'The Dead Canary', type: 'cocktail-lounge', description: 'Speakeasy-style cocktails', walkingTime: '7 minutes' },
      { name: 'BrewDog Cardiff', type: 'brewery', description: 'Popular craft beer bar', walkingTime: '8 minutes' }
    ],
    highlights: ['Local beer', 'Gastropubs', 'City centre buzz'],
    bestFor: ['Foodies', 'Groups', 'Local beer fans']
  },

  // Bath
  {
    id: 'bath-abbey-and-southgate',
    name: 'Bath Abbey & Southgate Pubs',
    city: 'bath',
    area: 'Abbey Area',
    description: 'Short stroll around the Roman and Georgian heart of Bath with cosy pubs and tasting rooms.',
    estimatedDuration: 140,
    walkingDistance: '0.9 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Raven', type: 'traditional-pub', description: 'Famous for pies and snug rooms', walkingTime: '3 minutes' },
      { name: 'The Canary Gin Bar', type: 'wine-bar', description: 'Gin and cocktail specialists', walkingTime: '5 minutes' },
      { name: 'Sally Lunn\'s (bar area)', type: 'traditional-pub', description: 'Historic tea-house with a bar', walkingTime: '4 minutes' },
      { name: 'The Bath Brew House', type: 'brewery', description: 'Local ales and courtyard', walkingTime: '6 minutes' },
      { name: 'The Griffin', type: 'gastropub', description: 'Good seasonal menu and drinks', walkingTime: '7 minutes' }
    ],
    highlights: ['Georgian architecture', 'Historic taverns', 'Local breweries'],
    bestFor: ['Tourists', 'History lovers', 'Foodies']
  },

  // York
  {
    id: 'york-the-shambles',
    name: 'Shambles & Museum Quarter',
    city: 'york',
    area: 'The Shambles',
    description: 'Tight medieval streets full of character — perfect for a short historic crawl.',
    estimatedDuration: 150,
    walkingDistance: '0.8 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'Ye Olde Starre Inne', type: 'traditional-pub', description: 'One of York\'s oldest inns', walkingTime: '3 minutes' },
      { name: 'The House of the Trembling Madness', type: 'traditional-pub', description: 'Unique taproom with medieval vibe', walkingTime: '4 minutes' },
      { name: 'The Golden Fleece', type: 'traditional-pub', description: 'Famous haunted pub', walkingTime: '5 minutes' },
      { name: 'The Blue Bell', type: 'traditional-pub', description: 'Tiny historic pub with charm', walkingTime: '6 minutes' },
      { name: 'The Whippet', type: 'modern-bar', description: 'Stylish small bar in the area', walkingTime: '7 minutes' }
    ],
    highlights: ['Medieval streets', 'Haunted pubs', 'Historic architecture'],
    bestFor: ['History buffs', 'Couples', 'Historic pub seekers']
  },

  // Oxford
  {
    id: 'oxford-university-hr',
    name: 'Oxford College Pubs Loop',
    city: 'oxford',
    area: 'City Centre',
    description: 'A scholarly crawl linking classic college pubs and riverside inns.',
    estimatedDuration: 150,
    walkingDistance: '1.0 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Eagle and Child', type: 'traditional-pub', description: 'Famous for its literary patrons', walkingTime: '4 minutes' },
      { name: 'The Bear Inn', type: 'traditional-pub', description: 'One of Oxford\'s ancient inns', walkingTime: '5 minutes' },
      { name: 'The Turf Tavern', type: 'traditional-pub', description: 'Hidden gem with historic charm', walkingTime: '6 minutes' },
      { name: 'The Perch', type: 'gastropub', description: 'Riverside dining and drinks', walkingTime: '7 minutes' },
      { name: 'Castle Quarter Bars', type: 'modern-bar', description: 'Cluster of student-friendly bars', walkingTime: '8 minutes' }
    ],
    highlights: ['Literary connections', 'College ambience', 'Riverside pubs'],
    bestFor: ['Students', 'Literature fans', 'Tourists']
  },

  // Cambridge
  {
    id: 'cambridge-market-square',
    name: 'Market Square & Riverside',
    city: 'cambridge',
    area: 'City Centre',
    description: 'Short riverside crawl linking historic inns and contemporary bars by the Backs.',
    estimatedDuration: 140,
    walkingDistance: '0.9 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Eagle', type: 'traditional-pub', description: 'Historic RAF and Piltdown connections', walkingTime: '3 minutes' },
      { name: 'The Anchor', type: 'traditional-pub', description: 'Riverside pub near the Backs', walkingTime: '5 minutes' },
      { name: 'The Mill', type: 'gastropub', description: 'Converted mill with riverside terrace', walkingTime: '6 minutes' },
      { name: 'The Cambridge Brew House', type: 'brewery', description: 'Local beers and food', walkingTime: '7 minutes' },
      { name: 'The Pint Shop', type: 'gastropub', description: 'Craft ales and hearty food', walkingTime: '8 minutes' }
    ],
    highlights: ['Punting views', 'College backs', 'Historic inns'],
    bestFor: ['Students', 'Scenic groups', 'History fans']
  },

  // Brighton
  {
    id: 'brighton-north-laine',
    name: 'North Laine & Seafront',
    city: 'brighton',
    area: 'North Laine',
    description: 'Independent bars and seafront pubs in Brighton’s creative quarter.',
    estimatedDuration: 160,
    walkingDistance: '1.1 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Mesmerist', type: 'modern-bar', description: 'Vintage-themed cocktail bar', walkingTime: '4 minutes' },
      { name: 'The Lanes Brewing Co', type: 'brewery', description: 'Local craft beer hub', walkingTime: '5 minutes' },
      { name: 'The Walrus', type: 'traditional-pub', description: 'Seafront pub with good views', walkingTime: '6 minutes' },
      { name: 'The Evening Star', type: 'traditional-pub', description: 'Retro pub with character', walkingTime: '7 minutes' },
      { name: 'The Colonnade', type: 'cocktail-lounge', description: 'Seafront cocktails and sunsets', walkingTime: '8 minutes' }
    ],
    highlights: ['Seafront', 'Independent bars', 'Bohemian vibe'],
    bestFor: ['Couples', 'Sunset watchers', 'Indie crowds']
  },

  // Plymouth
  {
    id: 'plymouth-barbican',
    name: 'Barbican & Sutton Harbour',
    city: 'plymouth',
    area: 'Barbican',
    description: 'Compact harbour-side crawl with maritime pubs and seafood-focused spots.',
    estimatedDuration: 150,
    walkingDistance: '1.0 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Shipwrights Arms', type: 'traditional-pub', description: 'Harbourfront pub and local ales', walkingTime: '3 minutes' },
      { name: 'The Fig Tree', type: 'gastropub', description: 'Seasonal food and good wine list', walkingTime: '5 minutes' },
      { name: 'The Dolphin Tavern', type: 'traditional-pub', description: 'Cosy spot near the quay', walkingTime: '6 minutes' },
      { name: 'The Old Custom House', type: 'traditional-pub', description: 'Historic building with views', walkingTime: '7 minutes' },
      { name: 'The Yard', type: 'modern-bar', description: 'Small intimate bar with craft cocktails', walkingTime: '8 minutes' }
    ],
    highlights: ['Harbour views', 'Seafood', 'Historic quayside'],
    bestFor: ['Seafood lovers', 'Scenic walkers', 'Historic fans']
  },

  // Exeter
  {
    id: 'exeter-quayside',
    name: 'Exeter Quayside & Cathedral',
    city: 'exeter',
    area: 'Quayside',
    description: 'Riverside pubs and cosy city-centre inns close to the cathedral.',
    estimatedDuration: 150,
    walkingDistance: '1.1 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Old Firehouse', type: 'gastropub', description: 'Comfort food and real ales', walkingTime: '4 minutes' },
      { name: 'The Ship Inn', type: 'traditional-pub', description: 'Riverside pub with character', walkingTime: '5 minutes' },
      { name: 'The Fat Pig', type: 'modern-bar', description: 'Modern taproom and food', walkingTime: '6 minutes' },
      { name: 'Exeter Brewery Tap', type: 'brewery', description: 'Local beers on rotation', walkingTime: '7 minutes' },
      { name: 'The Old Custom House', type: 'traditional-pub', description: 'Historic plus riverside tables', walkingTime: '8 minutes' }
    ],
    highlights: ['Quayside walk', 'Cathedral proximity', 'Local ales'],
    bestFor: ['River walkers', 'Local ale fans', 'Tourists']
  },

  // Southampton
  {
    id: 'southampton-old-town',
    name: 'Old Town & Cultural Quarter',
    city: 'southampton',
    area: 'Old Town',
    description: 'Historic Southampton pubs and modern bars around the Old Town.',
    estimatedDuration: 150,
    walkingDistance: '1.0 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Dancing Man', type: 'modern-bar', description: 'Craft beer and good food', walkingTime: '4 minutes' },
      { name: 'The Old Bowling Green', type: 'traditional-pub', description: 'Historic garden and interiors', walkingTime: '5 minutes' },
      { name: 'The Hobbit', type: 'modern-bar', description: 'Quirky themed drinks and atmosphere', walkingTime: '6 minutes' },
      { name: 'The Rockstone', type: 'traditional-pub', description: 'Local favourite with ales', walkingTime: '7 minutes' },
      { name: 'The Libertine', type: 'cocktail-lounge', description: 'Stylish cocktails late into the night', walkingTime: '8 minutes' }
    ],
    highlights: ['Historic inns', 'Local culture', 'Compact walking route'],
    bestFor: ['Groups', 'History fans', 'After-dinner drinks']
  },

  // Canterbury
  {
    id: 'canterbury-cathedral-quarter',
    name: 'Cathedral Quarter Pubs',
    city: 'canterbury',
    area: 'Cathedral Quarter',
    description: 'Short, atmospheric crawl around Canterbury Cathedral and medieval lanes.',
    estimatedDuration: 140,
    walkingDistance: '0.8 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Parrot', type: 'traditional-pub', description: 'Cosy traditional pub close to the cathedral', walkingTime: '3 minutes' },
      { name: 'The Old Weavers', type: 'gastropub', description: 'Characterful dining and bar', walkingTime: '4 minutes' },
      { name: 'The Dolphin', type: 'traditional-pub', description: 'Riverside pub with local ales', walkingTime: '5 minutes' },
      { name: 'The Goods Shed', type: 'modern-bar', description: 'Local produce with a bar and small events', walkingTime: '6 minutes' },
      { name: 'The Buttermarket Bars', type: 'modern-bar', description: 'Cluster of bars in a lively square', walkingTime: '7 minutes' }
    ],
    highlights: ['Medieval lanes', 'Cathedral close', 'Riverside stops'],
    bestFor: ['History lovers', 'Short strolls', 'Groups']
  },

  // Stratford-upon-Avon
  {
    id: 'stratford-shakespeare',
    name: 'Shakespearean Pubs Loop',
    city: 'stratford-upon-avon',
    area: 'Town Centre',
    description: 'Charming pubs near Shakespeare’s birthplace and riverside walks.',
    estimatedDuration: 140,
    walkingDistance: '0.9 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Dirty Duck', type: 'traditional-pub', description: 'Frequented by RSC actors', walkingTime: '3 minutes' },
      { name: 'The Garrick Inn', type: 'traditional-pub', description: 'Timber-framed historic inn', walkingTime: '4 minutes' },
      { name: 'The Opposition', type: 'modern-bar', description: 'Popular with theatre crowds', walkingTime: '5 minutes' },
      { name: 'The RSC Bar', type: 'cocktail-lounge', description: 'Convenient and classy for post-show drinks', walkingTime: '6 minutes' },
      { name: 'Swan’s Riverside Pubs', type: 'gastropub', description: 'Scenic riverside options', walkingTime: '7 minutes' }
    ],
    highlights: ['Shakespeare heritage', 'Riverside', 'Historic inns'],
    bestFor: ['Theatre-goers', 'Literature fans', 'Tourists']
  },

  // Cheltenham
  {
    id: 'cheltenham-promenade',
    name: 'Promenade & Regency Bars',
    city: 'cheltenham',
    area: 'Promenade',
    description: 'Elegant bars and historic pubs around Cheltenham’s Regency heart.',
    estimatedDuration: 150,
    walkingDistance: '1.1 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Everyman', type: 'modern-bar', description: 'Plenty of cocktails and a relaxed vibe', walkingTime: '4 minutes' },
      { name: 'The Inn on the Square', type: 'gastropub', description: 'Quality dining and drinks', walkingTime: '5 minutes' },
      { name: 'The Curfew', type: 'traditional-pub', description: 'Cosy local with good ales', walkingTime: '6 minutes' },
      { name: 'The Daffodil', type: 'modern-bar', description: 'Large art-deco venue with bars', walkingTime: '7 minutes' },
      { name: 'Gloucester Brewery Tap', type: 'brewery', description: 'Regional beers and tasting flights', walkingTime: '8 minutes' }
    ],
    highlights: ['Regency architecture', 'Elegant dining', 'Festival vibes'],
    bestFor: ['Festival crowds', 'Stylish groups', 'Food lovers']
  },

  // Bath (second route)
  {
    id: 'bath-georgian-circle',
    name: 'Georgian & Riverside Pubs',
    city: 'bath',
    area: 'Georgian Quarter',
    description: 'Riverside and Georgian squares join for a genteel pub crawl.',
    estimatedDuration: 160,
    walkingDistance: '1.2 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Salamander', type: 'traditional-pub', description: 'Historic rooms and local ales', walkingTime: '4 minutes' },
      { name: 'The Ale House', type: 'brewery', description: 'Small brewery with rotating taps', walkingTime: '5 minutes' },
      { name: 'The White Hart', type: 'traditional-pub', description: 'Classic pub in a Georgian setting', walkingTime: '6 minutes' },
      { name: 'The Hare & Hounds', type: 'gastropub', description: 'Popular eatery with great drinks', walkingTime: '7 minutes' },
      { name: 'Riverside Cocktail Bars', type: 'cocktail-lounge', description: 'Modern spots for cocktails by the river', walkingTime: '8 minutes' }
    ],
    highlights: ['Riverside', 'Georgian terraces', 'Relaxed atmosphere'],
    bestFor: ['Couples', 'History lovers', 'Quiet groups']
  },

  // Harrogate
  {
    id: 'harrogate-montpellier',
    name: 'Montpellier & Royal Pavilions',
    city: 'harrogate',
    area: 'Montpellier',
    description: 'Upscale spa town crawl with elegant bars and tearooms that double as evening spots.',
    estimatedDuration: 140,
    walkingDistance: '0.9 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Montpellier Quarter Bars', type: 'modern-bar', description: 'Cluster of boutique cocktail bars', walkingTime: '4 minutes' },
      { name: 'The Cold Bath', type: 'traditional-pub', description: 'Local with historic vibes', walkingTime: '5 minutes' },
      { name: 'The Black Swan', type: 'gastropub', description: 'Comfort food and good beer list', walkingTime: '6 minutes' },
      { name: 'Fitzwilliam Tavern', type: 'traditional-pub', description: 'Cosy and friendly', walkingTime: '7 minutes' },
      { name: 'Rudding Park Bar', type: 'cocktail-lounge', description: 'Upscale for a more refined stop', walkingTime: '8 minutes' }
    ],
    highlights: ['Elegant streets', 'Spa town charm', 'Upscale drinking'],
    bestFor: ['Couples', 'Mature groups', 'Relaxed evenings']
  },

  // York (second route)
  {
    id: 'york-river-ouse',
    name: 'Museum & River Ouse Loop',
    city: 'york',
    area: 'River Ouse',
    description: 'A scenic walk linking riverside pubs with museums and comfy inns.',
    estimatedDuration: 160,
    walkingDistance: '1.2 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Maltings', type: 'traditional-pub', description: 'Riverside beers and relaxed vibe', walkingTime: '4 minutes' },
      { name: 'The Hop', type: 'brewery', description: 'Local brews and tasting flights', walkingTime: '5 minutes' },
      { name: 'Museum Gardens Bar', type: 'modern-bar', description: 'Near museums with seasonal menus', walkingTime: '6 minutes' },
      { name: 'The Kings Arms', type: 'traditional-pub', description: 'Classic pub with regulars', walkingTime: '7 minutes' },
      { name: 'The Blue Bicycle', type: 'cocktail-lounge', description: 'Late-night cocktails in a city-centre spot', walkingTime: '8 minutes' }
    ],
    highlights: ['Museums', 'Riverside scenery', 'Local beers'],
    bestFor: ['Families (early)', 'Culture fans', 'Scenic groups']
  },

  // Newcastle (second route already added earlier)

  // Leeds
  {
    id: 'leeds-call-lane',
    name: 'Call Lane & Greek Street',
    city: 'leeds',
    area: 'Call Lane',
    description: 'A concentrated route of bars and pubs renowned for nightlife and live DJs.',
    estimatedDuration: 170,
    walkingDistance: '1.0 miles',
    difficulty: 'medium',
    pubs: [
      { name: 'The Reliance', type: 'modern-bar', description: 'Small vinoteca with tapas and wine', walkingTime: '4 minutes' },
      { name: 'Revolucion de Cuba', type: 'cocktail-lounge', description: 'Lively Cuban-themed cocktails', walkingTime: '5 minutes' },
      { name: 'Belgrave Music Hall Bar', type: 'modern-bar', description: 'Rooftop bar with live acts', walkingTime: '6 minutes' },
      { name: 'The Hop', type: 'brewery', description: 'Local ales and craft beers', walkingTime: '7 minutes' },
      { name: 'Call Lane Social', type: 'modern-bar', description: 'Popular late-night spot', walkingTime: '8 minutes' }
    ],
    highlights: ['Nightlife', 'Live DJs', 'Rooftop bars'],
    bestFor: ['Night owls', 'Young crowds', 'Groups']
  },

  // Nottingham
  {
    id: 'nottingham-hockley',
    name: 'Hockley & Lace Market',
    city: 'nottingham',
    area: 'Hockley',
    description: 'Independent bars, quirky pubs and cocktail dens in Nottingham’s creative quarter.',
    estimatedDuration: 160,
    walkingDistance: '1.0 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Malt Cross', type: 'traditional-pub', description: 'Victorian music hall turned bar', walkingTime: '4 minutes' },
      { name: 'Lost City', type: 'modern-bar', description: 'Eclectic music and themed nights', walkingTime: '5 minutes' },
      { name: 'The Angel Microbrewery', type: 'brewery', description: 'Local brews in a cosy setting', walkingTime: '6 minutes' },
      { name: 'The Alchemist', type: 'cocktail-lounge', description: 'Spectacular theatrical cocktails', walkingTime: '7 minutes' },
      { name: 'The Hockley Hustle Pubs', type: 'modern-bar', description: 'Cluster of indie bars and music venues', walkingTime: '8 minutes' }
    ],
    highlights: ['Independent scene', 'Music venues', 'Historic architecture'],
    bestFor: ['Indie crowds', 'Music lovers', 'Creative types']
  },

  // Sheffield
  {
    id: 'sheffield-west-street',
    name: 'West Street & Devonshire Green',
    city: 'sheffield',
    area: 'West Street',
    description: 'Lively street of bars and student-friendly pubs near the arts quarter.',
    estimatedDuration: 160,
    walkingDistance: '1.1 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Harley', type: 'traditional-pub', description: 'Popular with locals and music fans', walkingTime: '4 minutes' },
      { name: 'The Leadmill Bar', type: 'modern-bar', description: 'Live music venue with bar', walkingTime: '5 minutes' },
      { name: 'The West Street Live Pubs', type: 'modern-bar', description: 'Cluster of bars and clubs', walkingTime: '6 minutes' },
      { name: 'The Old House at Home', type: 'traditional-pub', description: 'Friendly pub with ales', walkingTime: '7 minutes' },
      { name: 'Sheffield Taproom', type: 'brewery', description: 'Local craft beers and tasting flights', walkingTime: '8 minutes' }
    ],
    highlights: ['Student vibe', 'Live music', 'Arty crowd'],
    bestFor: ['Students', 'Live music fans', 'Young professionals']
  },

  // Lancaster
  {
    id: 'lancaster-city-centre',
    name: 'Lancaster Canal & Market',
    city: 'lancaster',
    area: 'City Centre',
    description: 'Compact canal-side crawl with classic pubs and contemporary bars.',
    estimatedDuration: 150,
    walkingDistance: '1.0 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Water Witch', type: 'traditional-pub', description: 'Canal-side with relaxed vibe', walkingTime: '4 minutes' },
      { name: 'The Borough', type: 'gastropub', description: 'Good food and drink selection', walkingTime: '5 minutes' },
      { name: 'The Sun Hotel Bar', type: 'traditional-pub', description: 'Historic inn with character', walkingTime: '6 minutes' },
      { name: 'The Castle Hotel Bar', type: 'modern-bar', description: 'Central bar with varied drinks', walkingTime: '7 minutes' },
      { name: 'Local Microbrewery Tap', type: 'brewery', description: 'Small local beers on rotation', walkingTime: '8 minutes' }
    ],
    highlights: ['Canal walks', 'Historic market', 'Compact route'],
    bestFor: ['Relaxed groups', 'Local explorers', 'Tourists']
  },

  // Kendal
  {
    id: 'kendal-town-centre',
    name: 'Kendal Old Town Pubs',
    city: 'kendal',
    area: 'Town Centre',
    description: 'Small-town charm with cosy inns and independent bars within easy walking distance.',
    estimatedDuration: 130,
    walkingDistance: '0.8 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Shakespeare', type: 'traditional-pub', description: 'Quaint local with real ales', walkingTime: '3 minutes' },
      { name: 'The Brewery Tap', type: 'brewery', description: 'Local ales and tasting flights', walkingTime: '4 minutes' },
      { name: 'The Sun Inn', type: 'traditional-pub', description: 'Historic rooms and friendly service', walkingTime: '5 minutes' },
      { name: 'The Moon & Sixpence', type: 'modern-bar', description: 'Independent bar with character', walkingTime: '6 minutes' },
      { name: 'The Globe', type: 'traditional-pub', description: 'Classic inn with cosy corners', walkingTime: '7 minutes' }
    ],
    highlights: ['Small-town charm', 'Local ales', 'Compact walking'],
    bestFor: ['Relaxed visitors', 'Countryside explorers', 'Local history fans']
  },

  // Carlisle
  {
    id: 'carlisle-city-centre',
    name: 'Castle & Cathedral Pubs',
    city: 'carlisle',
    area: 'City Centre',
    description: 'Historic pubs and cosy inns around Carlisle Castle and the cathedral quarter.',
    estimatedDuration: 140,
    walkingDistance: '0.9 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Golden Fleece', type: 'traditional-pub', description: 'Classic English pub close to the castle', walkingTime: '4 minutes' },
      { name: 'The Crown & Mitre', type: 'traditional-pub', description: 'Characterful old inn', walkingTime: '5 minutes' },
      { name: 'South Walls Tavern', type: 'traditional-pub', description: 'Friendly local with real ales', walkingTime: '6 minutes' },
      { name: 'The County Hotel Bar', type: 'modern-bar', description: 'Comfortable hotel bar in the city centre', walkingTime: '7 minutes' },
      { name: 'Local Brewery Tap', type: 'brewery', description: 'Regional brews and tasting', walkingTime: '8 minutes' }
    ],
    highlights: ['Castle views', 'Cathedral', 'Historic inns'],
    bestFor: ['History fans', 'Local explorers', 'Short walks']
  },

  // Durham
  {
    id: 'durham-cathedral-quarter',
    name: 'Durham Cathedral & Riverside',
    city: 'durham',
    area: 'Cathedral Quarter',
    description: 'Short route with atmospheric pubs around Durham Cathedral and riverside.',
    estimatedDuration: 140,
    walkingDistance: '0.8 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Dun Cow', type: 'traditional-pub', description: 'Close to the cathedral with historic feel', walkingTime: '3 minutes' },
      { name: 'The Court Inn', type: 'traditional-pub', description: 'Riverside with good local ales', walkingTime: '4 minutes' },
      { name: 'The Cellar Door', type: 'modern-bar', description: 'Intimate wine and cocktail bar', walkingTime: '5 minutes' },
      { name: 'The Boiler House', type: 'gastropub', description: 'Good food near the river', walkingTime: '6 minutes' },
      { name: 'Market Tavern', type: 'traditional-pub', description: 'Local favourite near the market', walkingTime: '7 minutes' }
    ],
    highlights: ['Cathedral views', 'Riverside', 'Compact historic route'],
    bestFor: ['History buffs', 'Couples', 'Short visits']
  },

  // Inverness
  {
    id: 'inverness-river-ness',
    name: 'River Ness & Old Town',
    city: 'inverness',
    area: 'Old Town',
    description: 'Riverfront pubs and cosy whisky bars within a short walk of the castle.',
    estimatedDuration: 150,
    walkingDistance: '1.0 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'Hootananny', type: 'traditional-pub', description: 'Live folk music and local beers', walkingTime: '4 minutes' },
      { name: 'The Mustard Seed', type: 'gastropub', description: 'Riverside dining and drinks', walkingTime: '5 minutes' },
      { name: 'The Castle Tavern', type: 'traditional-pub', description: 'Homely inn with local ales', walkingTime: '6 minutes' },
      { name: 'The Malt Room', type: 'wine-bar', description: 'Dedicated whisky and malt bar', walkingTime: '7 minutes' },
      { name: 'Black Isle Bar', type: 'brewery', description: 'Independent brewery taproom', walkingTime: '8 minutes' }
    ],
    highlights: ['River Ness', 'Whisky', 'Live folk music'],
    bestFor: ['Whisky lovers', 'Music fans', 'Scenic walkers']
  },

  // St Andrews
  {
    id: 'st-andrews-town-centre',
    name: 'St Andrews Coastal Pubs',
    city: 'st-andrews',
    area: 'Town Centre',
    description: 'Compact university town crawl with seaside inns and cosy whisky spots.',
    estimatedDuration: 130,
    walkingDistance: '0.7 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Central Bar', type: 'traditional-pub', description: 'Student favourite with great atmosphere', walkingTime: '3 minutes' },
      { name: 'The Seafood Ristorante Bar', type: 'gastropub', description: 'Good for fresh seafood and drinks', walkingTime: '4 minutes' },
      { name: 'The Vic', type: 'traditional-pub', description: 'Historic town pub', walkingTime: '5 minutes' },
      { name: 'The Jigger Inn (bar)', type: 'traditional-pub', description: 'Historic golfing haunt with strong character', walkingTime: '6 minutes' },
      { name: 'The Byre Theatre Bar', type: 'modern-bar', description: 'Small theatre bar with seasonal drinks', walkingTime: '7 minutes' }
    ],
    highlights: ['University town charm', 'Coastal views', 'Historic golf connections'],
    bestFor: ['Students', 'Golf enthusiasts', 'Coastal walkers']
  },

  // Dundee
  {
    id: 'dundee-waterfront',
    name: 'Dundee Waterfront Crawl',
    city: 'dundee',
    area: 'Waterfront',
    description: 'Newly regenerated waterfront pubs and bars with museum proximity.',
    estimatedDuration: 150,
    walkingDistance: '1.0 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Victoria Bar', type: 'traditional-pub', description: 'Classic pub near the waterfront', walkingTime: '4 minutes' },
      { name: 'The Kailyard', type: 'traditional-pub', description: 'Homely pub with local beers', walkingTime: '5 minutes' },
      { name: 'BrewDog Dundee', type: 'brewery', description: 'Popular craft ale destination', walkingTime: '6 minutes' },
      { name: 'The Howff', type: 'traditional-pub', description: 'Historic drinking spot for locals', walkingTime: '7 minutes' },
      { name: 'Modern Cocktail Bar', type: 'cocktail-lounge', description: 'Contemporary bar in the cultural quarter', walkingTime: '8 minutes' }
    ],
    highlights: ['Waterfront regeneration', 'Cultural quarter', 'Local beers'],
    bestFor: ['Sightseers', 'Local explorers', 'Craft beer fans']
  },

  // Stirling
  {
    id: 'stirling-old-town',
    name: 'Stirling Castle & Old Town Pubs',
    city: 'stirling',
    area: 'Old Town',
    description: 'Historic pubs around Stirling Castle and the old city walls.',
    estimatedDuration: 140,
    walkingDistance: '0.8 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Smithy', type: 'traditional-pub', description: 'Classic local with hearty meals', walkingTime: '3 minutes' },
      { name: 'The Portcullis', type: 'traditional-pub', description: 'Near the castle with local ales', walkingTime: '4 minutes' },
      { name: 'The Globe', type: 'modern-bar', description: 'Friendly bar in the city centre', walkingTime: '5 minutes' },
      { name: 'The Allan Park', type: 'gastropub', description: 'Good food and relaxed drinks', walkingTime: '6 minutes' },
      { name: 'The Powder Keg', type: 'cocktail-lounge', description: 'Smaller cocktail spot with character', walkingTime: '7 minutes' }
    ],
    highlights: ['Castle views', 'Historic walls', 'Short walks'],
    bestFor: ['History buffs', 'Scenic groups', 'Families (early)']
  },

  // Blackpool
  {
    id: 'blackpool-promenade',
    name: 'Promenade & Tower Pubs',
    city: 'blackpool',
    area: 'Promenade',
    description: 'Seafront pubs and vintage amusements along Blackpool’s famous stretch.',
    estimatedDuration: 160,
    walkingDistance: '1.2 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Blackpool Tower Bar', type: 'traditional-pub', description: 'Iconic tower-adjacent stop', walkingTime: '4 minutes' },
      { name: 'The Sandcastle Bar', type: 'modern-bar', description: 'Family-friendly pub with sea views', walkingTime: '5 minutes' },
      { name: 'The Golden Mile Inn', type: 'traditional-pub', description: 'Classic seaside pub', walkingTime: '6 minutes' },
      { name: 'The Promenade Cocktail Spot', type: 'cocktail-lounge', description: 'Classic cocktails with a view', walkingTime: '7 minutes' },
      { name: 'Local Brewery Tap', type: 'brewery', description: 'Rotating ales from the region', walkingTime: '8 minutes' }
    ],
    highlights: ['Tower views', 'Seafront', 'Classic arcades'],
    bestFor: ['Seafront fans', 'Families (early)', 'Nostalgia seekers']
  },

  // Llandudno (Wales)
  {
    id: 'llandudno-promenade',
    name: 'Llandudno Promenade Circle',
    city: 'llandudno',
    area: 'Promenade',
    description: 'Pleasant seafront crawl with Victorian charm and cosy inns.',
    estimatedDuration: 140,
    walkingDistance: '0.9 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Cottage Loaf', type: 'traditional-pub', description: 'Warm local with great pies', walkingTime: '3 minutes' },
      { name: 'The Cottage Bar', type: 'modern-bar', description: 'Sea-view bar with relaxed atmosphere', walkingTime: '4 minutes' },
      { name: 'The Pensarn', type: 'traditional-pub', description: 'Friendly seaside pub', walkingTime: '5 minutes' },
      { name: 'The Promenade Tap', type: 'brewery', description: 'Local microbrew beers and snacks', walkingTime: '6 minutes' },
      { name: 'The Grand Cocktail Lounge', type: 'cocktail-lounge', description: 'Classic hotel bar for pre-dinner drinks', walkingTime: '7 minutes' }
    ],
    highlights: ['Victorian pier', 'Seafront views', 'Cosy inns'],
    bestFor: ['Seaside walkers', 'Older groups', 'Low-key nights']
  },

  // Morecambe
  {
    id: 'morecambe-prom',
    name: 'Morecambe Seafront & Arcades',
    city: 'morecambe',
    area: 'Promenade',
    description: 'Compact seafront crawl with retro arcades and coastal pubs.',
    estimatedDuration: 140,
    walkingDistance: '0.8 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Dome', type: 'traditional-pub', description: 'Seafront classic with local ales', walkingTime: '3 minutes' },
      { name: 'The Morecambe Tap', type: 'brewery', description: 'Local beers and snacks', walkingTime: '4 minutes' },
      { name: 'The Midland Hotel Bar', type: 'cocktail-lounge', description: 'Iconic hotel bar with views', walkingTime: '5 minutes' },
      { name: 'The Royal Oak', type: 'traditional-pub', description: 'Friendly locals and welcoming staff', walkingTime: '6 minutes' },
      { name: 'Arcade Bar', type: 'modern-bar', description: 'Quirky bar near the amusements', walkingTime: '7 minutes' }
    ],
    highlights: ['Seafront', 'Retro arcades', 'Coastal walks'],
    bestFor: ['Nostalgic visitors', 'Seaside walkers', 'Low-key groups']
  },

  // Scarborough
  {
    id: 'scarborough-seafront',
    name: 'Scarborough South Bay Pubs',
    city: 'scarborough',
    area: 'South Bay',
    description: 'Classic seaside pubs and beachfront bars within a short stroll.',
    estimatedDuration: 150,
    walkingDistance: '1.1 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Crab & Lobster', type: 'gastropub', description: 'Seafood-focused with great views', walkingTime: '4 minutes' },
      { name: 'The Crown', type: 'traditional-pub', description: 'Cosy old pub near the promenade', walkingTime: '5 minutes' },
      { name: 'The Viaduct', type: 'modern-bar', description: 'Contemporary drinks near the harbour', walkingTime: '6 minutes' },
      { name: 'Harbour Inn', type: 'traditional-pub', description: 'Friendly and spacious with harbour outlook', walkingTime: '7 minutes' },
      { name: 'Local Microbrew Tap', type: 'brewery', description: 'Regional beers and tasting flights', walkingTime: '8 minutes' }
    ],
    highlights: ['Seafront', 'Harbour', 'Seafood'],
    bestFor: ['Coastal groups', 'Foodies', 'Family (early)']
  },

  // Bournemouth
  {
    id: 'bournemouth-beachfront',
    name: 'Beachfront & Old Town',
    city: 'bournemouth',
    area: 'Seafront',
    description: 'Sun, sand and a line of pubs linking the pier to the Old Town nightlife.',
    estimatedDuration: 160,
    walkingDistance: '1.2 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Crab', type: 'gastropub', description: 'Seafood favourites close to the shore', walkingTime: '4 minutes' },
      { name: 'The Old Fire Station', type: 'traditional-pub', description: 'Local favourite with live events', walkingTime: '5 minutes' },
      { name: 'The Alverde', type: 'modern-bar', description: 'Cocktails and late-night atmosphere', walkingTime: '6 minutes' },
      { name: 'Bournemouth Brewery Tap', type: 'brewery', description: 'Regional craft beers on tap', walkingTime: '7 minutes' },
      { name: 'Pier View Bar', type: 'cocktail-lounge', description: 'Great for sundowners', walkingTime: '8 minutes' }
    ],
    highlights: ['Pier', 'Seafront', 'Old Town nightlife'],
    bestFor: ['Beachgoers', 'Groups', 'Sunset watchers']
  },

  // Winchester
  {
    id: 'winchester-cathedral',
    name: 'Cathedral & High Street Pubs',
    city: 'winchester',
    area: 'City Centre',
    description: 'A genteel route through Winchester’s cathedral quarter and independent bars.',
    estimatedDuration: 140,
    walkingDistance: '0.9 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Old Vine', type: 'traditional-pub', description: 'Cossy tavern near the cathedral', walkingTime: '3 minutes' },
      { name: 'The Wykeham Arms', type: 'gastropub', description: 'College bar with hearty plates', walkingTime: '4 minutes' },
      { name: 'The Black Boy', type: 'traditional-pub', description: 'Historic hostelry with local ales', walkingTime: '5 minutes' },
      { name: 'The Chesil Rectory Bar', type: 'modern-bar', description: 'Hidden bar with good wines', walkingTime: '6 minutes' },
      { name: 'Local Brewery Tap', type: 'brewery', description: 'Regional beers and tasting', walkingTime: '7 minutes' }
    ],
    highlights: ['Cathedral', 'Independent bars', 'Historic lanes'],
    bestFor: ['Couples', 'History lovers', 'Calm evenings']
  },

  // Chelmsford
  {
    id: 'chelmsford-market-quarter',
    name: 'Market Quarter Pubs',
    city: 'chelmsford',
    area: 'City Centre',
    description: 'Compact market town route linking independent pubs and modern bars.',
    estimatedDuration: 140,
    walkingDistance: '0.8 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Oakfield', type: 'traditional-pub', description: 'Local favourite with friendly staff', walkingTime: '3 minutes' },
      { name: 'The Swan', type: 'gastropub', description: 'Good food and drink combos', walkingTime: '4 minutes' },
      { name: 'Chelmsford Tap', type: 'brewery', description: 'Local beers on the rotation', walkingTime: '5 minutes' },
      { name: 'Market Square Wine Bar', type: 'wine-bar', description: 'Tapas and wine in the square', walkingTime: '6 minutes' },
      { name: 'Modern Cocktail Spot', type: 'cocktail-lounge', description: 'Popular with young professionals', walkingTime: '7 minutes' }
    ],
    highlights: ['Local market', 'Compact route', 'Independent spots'],
    bestFor: ['Locals', 'Short nights out', 'After-work crowds']
  },

  // Milton Keynes
  {
    id: 'milton-keynes-central',
    name: 'MK Central Pubs Loop',
    city: 'milton-keynes',
    area: 'Central Milton Keynes',
    description: 'Modern city centre bars and canal-side pubs within easy reach.',
    estimatedDuration: 150,
    walkingDistance: '1.1 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Stables Bar', type: 'modern-bar', description: 'Live music and friendly atmosphere', walkingTime: '4 minutes' },
      { name: 'The Rose Inn', type: 'traditional-pub', description: 'Cosy traditional with good ales', walkingTime: '5 minutes' },
      { name: 'Canal-side Tap', type: 'brewery', description: 'Local ale hub near the canal', walkingTime: '6 minutes' },
      { name: 'The Hub Cocktail Bar', type: 'cocktail-lounge', description: 'Stylish drinks in the centre', walkingTime: '7 minutes' },
      { name: 'Gastro Tap', type: 'gastropub', description: 'Good food and local drinks', walkingTime: '8 minutes' }
    ],
    highlights: ['Canal paths', 'Live music', 'Modern bars'],
    bestFor: ['Groups', 'Live music fans', 'Casual nights']
  },

  // Wrexham
  {
    id: 'wrexham-town-centre',
    name: 'Wrexham Town Pubs',
    city: 'wrexham',
    area: 'Town Centre',
    description: 'Compact, friendly town crawl with a mix of historic pubs and modern bars.',
    estimatedDuration: 140,
    walkingDistance: '0.8 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Sweeney', type: 'traditional-pub', description: 'Strong local real-ale scene', walkingTime: '3 minutes' },
      { name: 'The Cornerhouse', type: 'modern-bar', description: 'Lively and popular with locals', walkingTime: '4 minutes' },
      { name: 'The Red Lion', type: 'traditional-pub', description: 'Classic central pub', walkingTime: '5 minutes' },
      { name: 'Local Brewery Tap', type: 'brewery', description: 'Small local brewer with rotating taps', walkingTime: '6 minutes' },
      { name: 'Wine & Cocktail Spot', type: 'cocktail-lounge', description: 'Intimate bar for a quieter stop', walkingTime: '7 minutes' }
    ],
    highlights: ['Friendly locals', 'Compact route', 'Local ales'],
    bestFor: ['Locals', 'Short visits', 'Casual groups']
  },

  // Bangor (Gwynedd)
  {
    id: 'bangor-city-centre',
    name: 'Bangor University & Quay',
    city: 'bangor',
    area: 'City Centre',
    description: 'Small-town crawl linking student bars, quay-side stops and traditional inns.',
    estimatedDuration: 130,
    walkingDistance: '0.7 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Glynne Arms', type: 'traditional-pub', description: 'Warm local with regulars', walkingTime: '3 minutes' },
      { name: 'The Station Inn', type: 'traditional-pub', description: 'Friendly pub near the station', walkingTime: '4 minutes' },
      { name: 'Quay Side Bar', type: 'modern-bar', description: 'Coffee-by-day, bar-by-night', walkingTime: '5 minutes' },
      { name: 'Local Brewery Tap', type: 'brewery', description: 'Regional ales and tasting flights', walkingTime: '6 minutes' },
      { name: 'University Bar', type: 'modern-bar', description: 'Student hub with cheap drinks', walkingTime: '7 minutes' }
    ],
    highlights: ['Student scene', 'Quay', 'Compact walking'],
    bestFor: ['Students', 'Short breaks', 'Local explorers']
  },

  // Aberystwyth
  {
    id: 'aberystwyth-seafront',
    name: 'Aberystwyth Seafront Pubs',
    city: 'aberystwyth',
    area: 'Seafront',
    description: 'Small coastal town crawl with seaside inns and music pubs.',
    estimatedDuration: 140,
    walkingDistance: '0.9 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Black Lion', type: 'traditional-pub', description: 'Seafront classic with local ales', walkingTime: '3 minutes' },
      { name: 'The Pier Bar', type: 'modern-bar', description: 'Great views and lively atmosphere', walkingTime: '4 minutes' },
      { name: 'The Old College Bar', type: 'modern-bar', description: 'Student-friendly and buzzy', walkingTime: '5 minutes' },
      { name: 'Harbour Inn', type: 'traditional-pub', description: 'Small inn with seafood options', walkingTime: '6 minutes' },
      { name: 'Local Microbrew Tap', type: 'brewery', description: 'Regional beers and flights', walkingTime: '7 minutes' }
    ],
    highlights: ['Seafront', 'Student vibe', 'Local seafood'],
    bestFor: ['Coastal walkers', 'Students', 'Sunset watchers']
  },

  // Torquay
  {
    id: 'torquay-harbourside',
    name: 'Torquay Harbourside Pubs',
    city: 'torquay',
    area: 'Harbour',
    description: 'Harbour pubs and seafront bars in the English Riviera.',
    estimatedDuration: 150,
    walkingDistance: '1.0 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Fish Quay', type: 'gastropub', description: 'Seafood and wine by the harbour', walkingTime: '4 minutes' },
      { name: 'The Imperial', type: 'traditional-pub', description: 'Classic local with friendly staff', walkingTime: '5 minutes' },
      { name: 'Abbey Sands Bar', type: 'modern-bar', description: 'Beach-adjacent cocktails and sun', walkingTime: '6 minutes' },
      { name: 'Torquay Brewery Tap', type: 'brewery', description: 'Local ales on rotation', walkingTime: '7 minutes' },
      { name: 'Harbour View Cocktail Lounge', type: 'cocktail-lounge', description: 'Great for evening sunsets', walkingTime: '8 minutes' }
    ],
    highlights: ['Harbour', 'Seafront', 'Seafood'],
    bestFor: ['Couples', 'Seafront diners', 'Relaxed groups']
  },

  // Aberdare
  {
    id: 'aberdare-town-centre',
    name: 'Aberdare Cosy Pubs',
    city: 'aberdare',
    area: 'Town Centre',
    description: 'Small town crawl with friendly pubs and local ales within easy reach.',
    estimatedDuration: 130,
    walkingDistance: '0.7 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Black Lion', type: 'traditional-pub', description: 'Community-focused pub with ales', walkingTime: '3 minutes' },
      { name: 'The Court House', type: 'traditional-pub', description: 'Historic building with warm interiors', walkingTime: '4 minutes' },
      { name: 'The Globe', type: 'modern-bar', description: 'Late-night drinks and atmosphere', walkingTime: '5 minutes' },
      { name: 'Local Brewery Tap', type: 'brewery', description: 'Regional beers and tasting flights', walkingTime: '6 minutes' },
      { name: 'Wine & Tapas Spot', type: 'wine-bar', description: 'Small wine list and light plates', walkingTime: '7 minutes' }
    ],
    highlights: ['Friendly locals', 'Compact stroll', 'Local ales'],
    bestFor: ['Community groups', 'Short visits', 'Relaxed nights']
  },

  // Final small-town example: Alnwick
  {
    id: 'alnwick-market-place',
    name: 'Alnwick Market & Castle Pubs',
    city: 'alnwick',
    area: 'Market Place',
    description: 'Castle-proximate pubs and market-town inns within a short, pleasant walk.',
    estimatedDuration: 130,
    walkingDistance: '0.8 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Dirty Bottles', type: 'traditional-pub', description: 'Characterful local with ales', walkingTime: '3 minutes' },
      { name: 'The Muffin Man', type: 'modern-bar', description: 'Charming cafe-bar turned evening spot', walkingTime: '4 minutes' },
      { name: 'The Fleece', type: 'traditional-pub', description: 'Old coaching inn feel', walkingTime: '5 minutes' },
      { name: 'Castle View Tap', type: 'wine-bar', description: 'Good wines and castle glimpses', walkingTime: '6 minutes' },
      { name: 'Local Microbrew Tap', type: 'brewery', description: 'Small-batch beers and tasting flights', walkingTime: '7 minutes' }
    ],
    highlights: ['Alnwick Castle proximity', 'Market town charm', 'Compact route'],
    bestFor: ['Castle visitors', 'History fans', 'Short outings']
  },
  // York Routes
  {
    id: 'york-historic-centre',
    name: 'Historic Centre Crawl',
    city: 'york',
    area: 'City Centre',
    description: 'A heritage route through York’s medieval streets, featuring historic pubs with centuries of history.',
    estimatedDuration: 180,
    walkingDistance: '1.4 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'Ye Olde Starre Inne', type: 'traditional-pub', description: 'York’s oldest licensed inn (1644), full of history.', walkingTime: '5 minutes' },
      { name: 'The Golden Fleece', type: 'traditional-pub', description: 'Reputedly haunted pub with timber-framed charm.', walkingTime: '6 minutes' },
      { name: 'The Black Swan', type: 'traditional-pub', description: '15th-century coaching inn with original beams.', walkingTime: '8 minutes' },
      { name: 'The Guy Fawkes Inn', type: 'gastropub', description: 'Historic inn located at the birthplace of Guy Fawkes.', walkingTime: '7 minutes' },
      { name: 'The House of Trembling Madness', type: 'modern-bar', description: 'Eclectic craft beer bar above a medieval shop.', walkingTime: '10 minutes' }
    ],
    highlights: ['Haunted pubs', 'Medieval history', 'Traditional ales'],
    bestFor: ['History lovers', 'Tourists', 'Ale enthusiasts']
  },
  {
    id: 'york-riverside-crawl',
    name: 'Riverside Crawl',
    city: 'york',
    area: 'Riverside',
    description: 'A scenic loop along the River Ouse with riverside pubs and lively bars.',
    estimatedDuration: 150,
    walkingDistance: '1.3 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Kings Arms', type: 'traditional-pub', description: 'Famous riverside pub prone to floods.', walkingTime: '5 minutes' },
      { name: 'The Lowther', type: 'modern-bar', description: 'Lively student bar with river views.', walkingTime: '6 minutes' },
      { name: 'The Maltings', type: 'brewery', description: 'Award-winning pub with rotating craft beers.', walkingTime: '7 minutes' },
      { name: 'The Watergate Inn', type: 'traditional-pub', description: 'Cosy pub with riverside garden.', walkingTime: '8 minutes' },
      { name: 'Dusk', type: 'cocktail-lounge', description: 'Cocktail spot popular with younger crowd.', walkingTime: '10 minutes' }
    ],
    highlights: ['River views', 'Student nightlife', 'Craft beer'],
    bestFor: ['Students', 'Young travellers', 'Beer drinkers']
  },

  // Bath Routes
  {
    id: 'bath-heritage-crawl',
    name: 'Georgian Heritage Crawl',
    city: 'bath',
    area: 'Historic Centre',
    description: 'A classic route through Bath’s Georgian streets with historic inns and traditional pubs.',
    estimatedDuration: 170,
    walkingDistance: '1.2 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Raven', type: 'traditional-pub', description: 'Known for pies and cask ales.', walkingTime: '5 minutes' },
      { name: 'The Star Inn', type: 'traditional-pub', description: 'Unchanged since the 18th century.', walkingTime: '6 minutes' },
      { name: 'The Saracens Head', type: 'traditional-pub', description: 'Bath’s oldest pub (1713).', walkingTime: '7 minutes' },
      { name: 'The Crystal Palace', type: 'traditional-pub', description: 'Classic pub with beer garden.', walkingTime: '6 minutes' },
      { name: 'The Garrick’s Head', type: 'gastropub', description: 'Theatre pub with excellent food and ale.', walkingTime: '8 minutes' }
    ],
    highlights: ['Georgian architecture', 'Historic pubs', 'Central Bath'],
    bestFor: ['Tourists', 'History buffs', 'Pub food lovers']
  },

  // Brighton Routes
  {
    id: 'brighton-seafront',
    name: 'Seafront Crawl',
    city: 'brighton',
    area: 'Seafront',
    description: 'Beachside bars and pubs with sea views along Brighton’s iconic seafront.',
    estimatedDuration: 160,
    walkingDistance: '1.4 miles',
    difficulty: 'easy',
    pubs: [
      { name: 'The Tempest Inn', type: 'modern-bar', description: 'Cave-themed bar right on the beach.', walkingTime: '5 minutes' },
      { name: 'Fortune of War', type: 'traditional-pub', description: 'Historic seafront pub with a quirky vibe.', walkingTime: '6 minutes' },
      { name: 'The Walrus', type: 'gastropub', description: 'Large pub with rooftop terrace.', walkingTime: '8 minutes' },
      { name: 'The Mesmerist', type: 'cocktail-lounge', description: 'Cocktail and cabaret bar in the Lanes.', walkingTime: '7 minutes' },
      { name: 'The Black Lion', type: 'traditional-pub', description: 'Lively pub with live music.', walkingTime: '9 minutes' }
    ],
    highlights: ['Beachfront atmosphere', 'Live music', 'Cocktails'],
    bestFor: ['Party groups', 'Tourists', 'Seaside drinkers']
  },

  // Edinburgh Routes
  {
    id: 'edinburgh-old-town',
    name: 'Old Town Heritage Crawl',
    city: 'edinburgh',
    area: 'Old Town',
    description: 'Wind through the cobbled streets of Edinburgh’s Old Town with historic pubs steeped in character.',
    estimatedDuration: 200,
    walkingDistance: '1.6 miles',
    difficulty: 'medium',
    pubs: [
      { name: 'The Royal Mile Tavern', type: 'traditional-pub', description: 'Classic spot on the Royal Mile.', walkingTime: '5 minutes' },
      { name: 'The World’s End', type: 'traditional-pub', description: 'Historic pub marking the old city walls.', walkingTime: '6 minutes' },
      { name: 'The Halfway House', type: 'traditional-pub', description: 'Tiny pub halfway up a steep close.', walkingTime: '7 minutes' },
      { name: 'Deacon Brodie’s Tavern', type: 'traditional-pub', description: 'Named after the infamous Deacon Brodie.', walkingTime: '8 minutes' },
      { name: 'Whiski Bar', type: 'cocktail-lounge', description: 'Whisky-focused bar with Scottish tapas.', walkingTime: '9 minutes' }
    ],
    highlights: ['Royal Mile', 'Scottish whisky', 'Historic closes'],
    bestFor: ['History enthusiasts', 'Whisky lovers', 'Tourists']
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
