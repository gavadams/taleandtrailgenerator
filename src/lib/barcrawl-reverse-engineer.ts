interface BarCrawlPub {
  name: string
  address: string
  area: string
  city: string
  postcode?: string
  coordinates?: {
    lat: number
    lng: number
  }
}

interface BarCrawlFormState {
  viewState: string
  eventValidation: string
  cities: Array<{value: string, text: string}>
  areas: Array<{value: string, text: string}>
}

interface BarCrawlResponse {
  pubs: BarCrawlPub[]
  totalPubs: number
  area: string
  city: string
}

export class BarCrawlReverseEngineer {
  private static readonly BASE_URL = 'https://barcrawl.co.uk'
  private static readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  
  /**
   * Reverse engineer BarCrawl's pub crawl creator
   */
  static async reverseEngineerPubCrawl(
    city: string, 
    area: string, 
    pubCount: number
  ): Promise<BarCrawlResponse> {
    try {
      console.log(`Reverse engineering BarCrawl for ${area}, ${city}...`)
      
      // Step 1: Analyze the form structure
      const formState = await this.analyzeFormStructure()
      
      // Step 2: Find the correct city and area values
      const cityValue = this.findCityValue(formState.cities, city)
      const areaValue = this.findAreaValue(formState.areas, area)
      
      if (!cityValue || !areaValue) {
        throw new Error(`Could not find matching city/area values for ${city}/${area}`)
      }
      
      // Step 3: Submit the form with the correct values
      const pubData = await this.submitFormWithState(formState, cityValue, areaValue, pubCount)
      
      // Step 4: Geocode the results
      const pubsWithCoords = await this.geocodePubs(pubData)
      
      console.log(`Successfully reverse engineered ${pubsWithCoords.length} pubs from BarCrawl`)
      return {
        pubs: pubsWithCoords,
        totalPubs: pubsWithCoords.length,
        area: area,
        city: city
      }
      
    } catch (error) {
      console.error('Error reverse engineering BarCrawl:', error)
      throw new Error('Failed to reverse engineer BarCrawl')
    }
  }

  /**
   * Analyze the form structure to understand how BarCrawl works
   */
  private static async analyzeFormStructure(): Promise<BarCrawlFormState> {
    try {
      const response = await fetch(`${this.BASE_URL}/pubcrawlcreator.aspx`, {
        method: 'GET',
        headers: {
          'User-Agent': this.USER_AGENT,
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()
      console.log('Successfully fetched BarCrawl form page')
      
      // Parse the HTML to extract form state
      const viewState = this.extractViewState(html)
      const eventValidation = this.extractEventValidation(html)
      const cities = this.extractCities(html)
      const areas = this.extractAreas(html)
      
      return {
        viewState,
        eventValidation,
        cities,
        areas
      }
      
    } catch (error) {
      console.error('Error analyzing form structure:', error)
      throw error
    }
  }

  /**
   * Extract ViewState from HTML
   */
  private static extractViewState(html: string): string {
    const viewStateMatch = html.match(/<input[^>]*name="__VIEWSTATE"[^>]*value="([^"]*)"[^>]*>/i)
    return viewStateMatch ? viewStateMatch[1] : ''
  }

  /**
   * Extract EventValidation from HTML
   */
  private static extractEventValidation(html: string): string {
    const eventValidationMatch = html.match(/<input[^>]*name="__EVENTVALIDATION"[^>]*value="([^"]*)"[^>]*>/i)
    return eventValidationMatch ? eventValidationMatch[1] : ''
  }

  /**
   * Extract available cities from HTML
   */
  private static extractCities(html: string): Array<{value: string, text: string}> {
    const cities: Array<{value: string, text: string}> = []
    
    // Look for city dropdown options
    const citySelectMatch = html.match(/<select[^>]*name="[^"]*ddlCity[^"]*"[^>]*>([\s\S]*?)<\/select>/i)
    if (citySelectMatch) {
      const options = citySelectMatch[1].match(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/gi)
      if (options) {
        options.forEach(option => {
          const valueMatch = option.match(/value="([^"]*)"/)
          const textMatch = option.match(/>([^<]*)</)
          if (valueMatch && textMatch) {
            cities.push({
              value: valueMatch[1],
              text: textMatch[1].trim()
            })
          }
        })
      }
    }
    
    console.log('Extracted cities:', cities)
    return cities
  }

  /**
   * Extract available areas from HTML
   */
  private static extractAreas(html: string): Array<{value: string, text: string}> {
    const areas: Array<{value: string, text: string}> = []
    
    // Look for area dropdown options
    const areaSelectMatch = html.match(/<select[^>]*name="[^"]*ddlStartArea[^"]*"[^>]*>([\s\S]*?)<\/select>/i)
    if (areaSelectMatch) {
      const options = areaSelectMatch[1].match(/<option[^>]*value="([^"]*)"[^>]*>([^<]*)<\/option>/gi)
      if (options) {
        options.forEach(option => {
          const valueMatch = option.match(/value="([^"]*)"/)
          const textMatch = option.match(/>([^<]*)</)
          if (valueMatch && textMatch) {
            areas.push({
              value: valueMatch[1],
              text: textMatch[1].trim()
            })
          }
        })
      }
    }
    
    console.log('Extracted areas:', areas)
    return areas
  }

  /**
   * Find the correct city value from the form
   */
  private static findCityValue(cities: Array<{value: string, text: string}>, targetCity: string): string | null {
    const cityLower = targetCity.toLowerCase()
    
    // Try exact match first
    let city = cities.find(c => c.text.toLowerCase() === cityLower)
    if (city) return city.value
    
    // Try partial match
    city = cities.find(c => c.text.toLowerCase().includes(cityLower))
    if (city) return city.value
    
    // Try reverse match
    city = cities.find(c => cityLower.includes(c.text.toLowerCase()))
    if (city) return city.value
    
    console.warn(`Could not find city value for: ${targetCity}`)
    return null
  }

  /**
   * Find the correct area value from the form
   */
  private static findAreaValue(areas: Array<{value: string, text: string}>, targetArea: string): string | null {
    const areaLower = targetArea.toLowerCase()
    
    // Try exact match first
    let area = areas.find(a => a.text.toLowerCase() === areaLower)
    if (area) return area.value
    
    // Try partial match
    area = areas.find(a => a.text.toLowerCase().includes(areaLower))
    if (area) return area.value
    
    // Try reverse match
    area = areas.find(a => areaLower.includes(a.text.toLowerCase()))
    if (area) return area.value
    
    console.warn(`Could not find area value for: ${targetArea}`)
    return null
  }

  /**
   * Submit the form with the correct state
   */
  private static async submitFormWithState(
    formState: BarCrawlFormState,
    cityValue: string,
    areaValue: string,
    pubCount: number
  ): Promise<BarCrawlPub[]> {
    try {
      const formData = new URLSearchParams({
        '__VIEWSTATE': formState.viewState,
        '__EVENTVALIDATION': formState.eventValidation,
        'ctl00$ContentPlaceHolder1$ddlCity': cityValue,
        'ctl00$ContentPlaceHolder1$ddlStartArea': areaValue,
        'ctl00$ContentPlaceHolder1$ddlEndArea': areaValue,
        'ctl00$ContentPlaceHolder1$ddlPubCount': pubCount.toString(),
        'ctl00$ContentPlaceHolder1$btnGenerate': 'Generate Crawl'
      })

      const response = await fetch(`${this.BASE_URL}/pubcrawlcreator.aspx`, {
        method: 'POST',
        headers: {
          'User-Agent': this.USER_AGENT,
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        },
        body: formData
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const html = await response.text()
      console.log('Successfully submitted form to BarCrawl')
      
      // Parse the response to extract pub data
      return this.parsePubCrawlResponse(html)
      
    } catch (error) {
      console.error('Error submitting form:', error)
      throw error
    }
  }

  /**
   * Parse the pub crawl response to extract pub data
   */
  private static parsePubCrawlResponse(html: string): BarCrawlPub[] {
    try {
      console.log('Parsing pub crawl response...')
      
      // This would parse the HTML response to extract pub information
      // The actual implementation would depend on BarCrawl's HTML structure
      
      // For now, return empty array - in production you would:
      // 1. Parse the HTML to find pub names and addresses
      // 2. Extract the relevant information
      // 3. Structure it into BarCrawlPub objects
      
      return []
      
    } catch (error) {
      console.error('Error parsing response:', error)
      return []
    }
  }

  /**
   * Geocode addresses to get coordinates
   */
  private static async geocodePubs(pubs: BarCrawlPub[]): Promise<BarCrawlPub[]> {
    try {
      console.log(`Geocoding ${pubs.length} pubs...`)
      
      const geocodedPubs: BarCrawlPub[] = []
      
      for (const pub of pubs) {
        try {
          const coordinates = await this.geocodeAddress(pub.address)
          geocodedPubs.push({
            ...pub,
            coordinates
          })
        } catch (error) {
          console.warn(`Failed to geocode ${pub.name}:`, error)
          // Add without coordinates
          geocodedPubs.push({
            ...pub,
            coordinates: { lat: 0, lng: 0 }
          })
        }
      }
      
      return geocodedPubs
      
    } catch (error) {
      console.error('Error geocoding pubs:', error)
      return pubs.map(pub => ({
        ...pub,
        coordinates: { lat: 0, lng: 0 }
      }))
    }
  }

  /**
   * Geocode a single address using Google Maps Geocoding API
   */
  private static async geocodeAddress(address: string): Promise<{lat: number, lng: number}> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      throw new Error('Google Maps API key not found')
    }

    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`
    )

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.status !== 'OK' || !data.results.length) {
      throw new Error(`Geocoding failed: ${data.status}`)
    }

    const location = data.results[0].geometry.location
    return {
      lat: location.lat,
      lng: location.lng
    }
  }
}

export default BarCrawlReverseEngineer
