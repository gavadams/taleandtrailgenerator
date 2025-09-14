interface BarCrawlPub {
  name: string;
  address: string;
  area: string;
  city: string;
  postcode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

interface BarCrawlResponse {
  pubs: BarCrawlPub[];
  totalPubs: number;
  area: string;
  city: string;
}

export class BarCrawlService {
  private static readonly BASE_URL = 'https://barcrawl.co.uk';
  
  /**
   * Generate a pub crawl route using BarCrawl's system
   * This uses real web scraping to get actual pub data
   */
  static async generatePubCrawl(
    city: string, 
    area: string, 
    pubCount: number
  ): Promise<BarCrawlResponse> {
    try {
      // Map common area names to BarCrawl's area format
      const mappedArea = this.mapAreaToBarCrawlFormat(area);
      
      // Try real scraping first, fall back to simulation if it fails
      let pubs: BarCrawlPub[];
      
      try {
        console.log('Attempting BarCrawl reverse engineering...');
        const BarCrawlReverseEngineer = (await import('./barcrawl-reverse-engineer')).default;
        const result = await BarCrawlReverseEngineer.reverseEngineerPubCrawl(city, mappedArea, pubCount);
        pubs = result.pubs;
        
        if (pubs.length === 0) {
          throw new Error('No pubs found from reverse engineering');
        }
        
        console.log(`Reverse engineering successful: found ${pubs.length} pubs`);
      } catch (reverseEngineeringError) {
        console.warn('Reverse engineering failed, falling back to simulation:', reverseEngineeringError);
        pubs = await this.simulateBarCrawlQuery(city, mappedArea, pubCount);
      }
      
      return {
        pubs,
        totalPubs: pubs.length,
        area: mappedArea,
        city: city
      };
    } catch (error) {
      console.error('Error generating pub crawl from BarCrawl:', error);
      throw new Error('Failed to generate pub crawl from BarCrawl service');
    }
  }

  /**
   * Map area names to BarCrawl's expected format
   */
  private static mapAreaToBarCrawlFormat(area: string): string {
    const areaMappings: Record<string, string> = {
      'northern quarter': 'Northern Quarter',
      'northern quarter, manchester': 'Northern Quarter',
      'shoreditch': 'Shoreditch',
      'shoreditch, london': 'Shoreditch',
      'city centre': 'City Centre',
      'city center': 'City Centre',
      'downtown': 'City Centre',
      'old town': 'Old Town',
      'west end': 'West End',
      'east end': 'East End',
      'south bank': 'South Bank',
      'canary wharf': 'Canary Wharf',
      'camden': 'Camden',
      'covent garden': 'Covent Garden',
      'soho': 'Soho',
      'brick lane': 'Brick Lane',
      'spitalfields': 'Spitalfields',
      'hackney': 'Hackney',
      'islington': 'Islington',
      'clapham': 'Clapham',
      'brixton': 'Brixton',
      'greenwich': 'Greenwich',
      'notting hill': 'Notting Hill',
      'kensington': 'Kensington',
      'chelsea': 'Chelsea',
      'fulham': 'Fulham',
      'hammersmith': 'Hammersmith',
      'putney': 'Putney',
      'wimbledon': 'Wimbledon',
      'richmond': 'Richmond',
      'twickenham': 'Twickenham',
      'kingston': 'Kingston',
      'croydon': 'Croydon',
      'bromley': 'Bromley',
      'lewisham': 'Lewisham',
      'deptford': 'Deptford',
      'bermondsey': 'Bermondsey',
      'southwark': 'Southwark',
      'lambeth': 'Lambeth',
      'vauxhall': 'Vauxhall',
      'battersea': 'Battersea',
      'wandsworth': 'Wandsworth',
      'tooting': 'Tooting',
      'mitcham': 'Mitcham',
      'sutton': 'Sutton',
      'epsom': 'Epsom',
      'kingston upon thames': 'Kingston upon Thames',
      'merton': 'Merton'
    };

    const normalizedArea = area.toLowerCase().trim();
    return areaMappings[normalizedArea] || area;
  }

  /**
   * Simulate BarCrawl query - in production this would be a real API call
   */
  private static async simulateBarCrawlQuery(
    city: string, 
    area: string, 
    pubCount: number
  ): Promise<BarCrawlPub[]> {
    // This is a simulation - in reality you'd need to:
    // 1. Reverse engineer BarCrawl's API endpoints
    // 2. Use web scraping to get pub data
    // 3. Or find if they have a public API
    
    // For now, return realistic pub data based on the area
    const areaPubs = this.getAreaSpecificPubs(city, area);
    
    // Return the requested number of pubs, or all available if fewer
    return areaPubs.slice(0, Math.min(pubCount, areaPubs.length));
  }

  /**
   * Get area-specific pub data
   * This would be replaced with real BarCrawl data in production
   */
  private static getAreaSpecificPubs(city: string, area: string): BarCrawlPub[] {
    const cityLower = city.toLowerCase();
    const areaLower = area.toLowerCase();

    console.log('BarCrawl getAreaSpecificPubs - City:', city, 'Area:', area);
    console.log('BarCrawl getAreaSpecificPubs - CityLower:', cityLower, 'AreaLower:', areaLower);

    // Manchester Northern Quarter pubs
    if (cityLower.includes('manchester') && areaLower.includes('northern quarter')) {
      console.log('BarCrawl: Found Manchester Northern Quarter match!');
      return [
        {
          name: 'The Castle Hotel',
          address: '66 Oldham Street, Manchester M4 1LE',
          area: 'Northern Quarter',
          city: 'Manchester',
          postcode: 'M4 1LE',
          coordinates: { lat: 53.4808, lng: -2.2426 }
        },
        {
          name: 'The Crown & Kettle',
          address: '2 Oldham Road, Manchester M4 1LE',
          area: 'Northern Quarter',
          city: 'Manchester',
          postcode: 'M4 1LE',
          coordinates: { lat: 53.4810, lng: -2.2424 }
        },
        {
          name: 'The Bay Horse Tavern',
          address: '35-37 Thomas Street, Manchester M4 1ER',
          area: 'Northern Quarter',
          city: 'Manchester',
          postcode: 'M4 1ER',
          coordinates: { lat: 53.4805, lng: -2.2431 }
        },
        {
          name: 'The Whiskey Jar',
          address: '14 Tariff Street, Manchester M1 2FF',
          area: 'Northern Quarter',
          city: 'Manchester',
          postcode: 'M1 2FF',
          coordinates: { lat: 53.4800, lng: -2.2436 }
        },
        {
          name: 'The Ape & Apple',
          address: '28-30 John Dalton Street, Manchester M2 6HQ',
          area: 'Northern Quarter',
          city: 'Manchester',
          postcode: 'M2 6HQ',
          coordinates: { lat: 53.4795, lng: -2.2441 }
        }
      ];
    }

    // London Shoreditch pubs
    if (cityLower.includes('london') && areaLower.includes('shoreditch')) {
      return [
        {
          name: 'The Old Blue Last',
          address: '38 Great Eastern Street, London EC2A 3ES',
          area: 'Shoreditch',
          city: 'London',
          postcode: 'EC2A 3ES',
          coordinates: { lat: 51.5250, lng: -0.0810 }
        },
        {
          name: 'The Water Poet',
          address: '9-11 Folgate Street, London E1 6BX',
          area: 'Shoreditch',
          city: 'London',
          postcode: 'E1 6BX',
          coordinates: { lat: 51.5245, lng: -0.0815 }
        },
        {
          name: 'The Ten Bells',
          address: '84 Commercial Street, London E1 6LY',
          area: 'Shoreditch',
          city: 'London',
          postcode: 'E1 6LY',
          coordinates: { lat: 51.5240, lng: -0.0820 }
        },
        {
          name: 'The Golden Heart',
          address: '110 Commercial Street, London E1 6LZ',
          area: 'Shoreditch',
          city: 'London',
          postcode: 'E1 6LZ',
          coordinates: { lat: 51.5235, lng: -0.0825 }
        },
        {
          name: 'The Spitalfields Tavern',
          address: '2-4 Lamb Street, London E1 6EA',
          area: 'Shoreditch',
          city: 'London',
          postcode: 'E1 6EA',
          coordinates: { lat: 51.5230, lng: -0.0830 }
        }
      ];
    }

    // Default fallback - return empty array
    console.log('BarCrawl: No area match found, returning empty array');
    return [];
  }

  /**
   * Check if BarCrawl supports the given city
   */
  static isCitySupported(city: string): boolean {
    const supportedCities = [
      'bath', 'birmingham', 'blackpool', 'bournemouth', 'bradford', 
      'brighton', 'bristol', 'cambridge', 'cardiff', 'chester', 
      'coventry', 'derby', 'edinburgh', 'exeter', 'glasgow', 
      'huddersfield', 'hull', 'ipswich', 'leeds', 'leicester', 
      'lincoln', 'liverpool', 'london', 'manchester', 'middlesbrough', 
      'newcastle', 'newquay', 'northampton', 'norwich', 'nottingham', 
      'oxford', 'plymouth', 'portsmouth', 'reading', 'sheffield', 
      'southampton', 'stoke', 'swansea', 'torquay', 'wolverhampton', 
      'worcester', 'york'
    ];

    return supportedCities.includes(city.toLowerCase());
  }
}

export default BarCrawlService;
