# **App Name**: Webless Explorer

## Core Features:

- Business Search & Storage: Accepts a search term and radius from the user, queries the Google Maps Places API, and caches the results in Firestore.
- Results Display & Export: Displays search results in a paginated list, highlighting businesses without a website. Allows users to download the data in CSV or Excel format.
- Dashboard Overview: Presents key metrics, such as total businesses found and the number with/without websites, offering at-a-glance insights.

## Style Guidelines:

- Primary color: Neutral gray for a professional feel.
- Secondary color: Light blue for accents and interactive elements.
- Accent: Teal (#008080) to highlight key information and CTAs.
- Clean and readable sans-serif fonts for all text elements.
- Simple, consistent icons from a library like FontAwesome or Material Icons.
- Clear, well-organized layout with good use of whitespace for easy readability.

## Original User Request:
App Name:
Google Maps Business Scraper

Short Description:
A web app to search businesses using Google Maps Places API, fetch their details (name, address, phone number, website), and identify businesses that do not have a website.

Detailed Requirements:

Allow user to input a search keyword (e.g., "cafes in Bali") and search radius.

Use Google Places Text Search API to search for businesses based on user input.

Display a list of businesses (business name, address, rating) in the UI.

For each business, allow the system to:

Fetch Place Details using Place ID (phone number and website).

Identify if website exists or is missing.

Highlight or filter businesses without a website.

Store search results and details in Firestore (Firebase database) for caching.

allow download file in excel or csv

Add a basic dashboard:

Show how many businesses were found

How many have websites

How many don't have websites

Optional: Add pagination if there are many results.

Show remaining API usage (basic and advanced) if possible (optional, nice to have).

Stack Preferences:

Frontend: ReactJS + tailwind css and daisy ui

Backend: Firebase Functions (Node.js) for server-side API calls
  