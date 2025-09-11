# Google Maps API Setup Guide

To enable the embedded Google Maps route visualization, you need to set up a Google Maps API key.

## Steps to Get Your API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/

2. **Create a New Project (or select existing)**
   - Click "Select a project" → "New Project"
   - Give it a name like "Tale and Trail Generator"

3. **Enable Required APIs**
   - Go to "APIs & Services" → "Library"
   - Search for and enable these APIs:
     - **Maps Embed API** (required for embedded maps)
     - **Directions API** (required for route planning)
     - **Places API** (optional, for better location search)

4. **Create API Key**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the generated API key

5. **Set Up Environment Variable**
   - Create a `.env.local` file in your project root
   - Add: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here`
   - Replace `your_api_key_here` with your actual API key

6. **Restrict Your API Key (Recommended)**
   - In Google Cloud Console, click on your API key
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain (e.g., `localhost:3000/*`, `yourdomain.com/*`)
   - Under "API restrictions", select "Restrict key" and choose the APIs you enabled

## Cost Information

- **Maps Embed API**: Free for most usage
- **Directions API**: $5 per 1,000 requests after free tier
- **Places API**: $17 per 1,000 requests after free tier

For development and small-scale usage, you should stay within the free tier limits.

## Testing

After setting up your API key:
1. Restart your development server
2. Generate a game with multiple pub locations
3. Go to the "Route Map" tab in the review step
4. You should see an embedded Google Maps showing the walking route between pubs

## Getting Accurate Walking Times

For accurate walking times and distances, make sure:

1. **Use Real Location Names**: The AI should generate actual pub/venue names, not generic "Pub 1", "Pub 2" names
2. **Valid API Key**: Use your own Google Maps API key, not the demo key
3. **API Quotas**: Ensure you have sufficient quota for the Directions API

### Why Walking Times Might Be Inaccurate

- **Demo API Key**: The default demo key may not provide accurate results
- **Generic Names**: If locations are named "Pub 1", "Pub 2", Google Maps can't find them
- **API Limits**: Free tier has limited requests per day
- **Location Specificity**: More specific location names (with city/area) give better results

## Troubleshooting

- **"For development purposes only" watermark**: This is normal for development. It will disappear when you add billing information to your Google Cloud project.
- **Map not loading**: Check that your API key is correct and the required APIs are enabled.
- **CORS errors**: Make sure your domain is added to the API key restrictions.
- **Inaccurate times**: Check console logs for API errors and ensure you're using real location names
