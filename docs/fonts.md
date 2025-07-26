# Google Fonts Static Data System

This system eliminates runtime API calls to Google Fonts by pre-fetching and storing the complete font list as a static JSON file. This approach prevents making API calls to Google Fonts every time a user loads the font select, performs searches, or paginates through results.

## How it works

1. **Static Generation**: The `scripts/fetch-google-fonts.ts` script fetches the complete Google Fonts list from the API and saves it to `public/assets/google-fonts.json`
2. **Runtime Serving**: The API route at `/api/google-fonts` reads from this static file instead of making external API calls
3. **Local Filtering**: All search, pagination, and category filtering happens locally on the static data

## Setup

1. **Environment Configuration**: Add your Google Fonts API key to `.env.local`:
   ```bash
   GOOGLE_FONTS_API_KEY=your_api_key_here
   ```
   
   **Important**: The environment file must be named `.env.local` for the script to work properly.

2. **Fetch Font Data**: Run the fetch script to create the initial data file:
   ```bash
   pnpm run fetch-google-fonts
   ```

3. **File Location**: The file will be created at `public/assets/google-fonts.json`

## Benefits

- **Zero runtime API calls**: No matter how many users search/paginate, you never hit the Google Fonts API during user requests
- **Lightning fast responses**: All filtering and pagination happens on local data
- **Cost effective**: Only one API call needed periodically to refresh the data
- **Reliable**: Your font picker works even if Google Fonts API is temporarily unavailable
- **Reduced latency**: Eliminates network requests for every font selection interaction

## Performance Considerations

**Current Implementation**: This solution works well for development and smaller deployments, but for production at scale, consider hosting the font data on a CDN for even better performance.

**Recommended Future Enhancement**: 
- Host the `google-fonts.json` file on a CDN (like Cloudflare, AWS CloudFront, or Vercel's Edge Network)
- This would provide global distribution and even faster response times
- The API route could then fetch from the CDN instead of the local file system

## Maintenance

Since Google Fonts don't change frequently, you can update the static data periodically:

- **Manual**: Run `pnpm run fetch-google-fonts` when needed
- **Automated**: Set up a daily cron job to run the script
- **CI/CD**: Include the script in your build process for automatic updates

## File Structure

```
public/
  assets/
    google-fonts.json     # Static font data (1500+ fonts)
scripts/
  fetch-google-fonts.ts   # Script to fetch and save font data
app/api/google-fonts/
  route.ts               # API route that serves from static file
```

## Fallback System

If the static file is missing or corrupted, the API route will fall back to a curated list of popular fonts to ensure the application continues working.

## Data Format

The generated JSON file contains an array of font objects with the following structure:
```json
{
  "family": "Font Name",
  "category": "serif|sans-serif|display|handwriting|monospace",
  "variants": ["400", "500", "600", "700"],
  "variable": true | false
}
``` 