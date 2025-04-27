# Webless Explorer

This is a Next.js application built in Firebase Studio designed to find businesses on Google Maps and identify those lacking a website.

## Getting Started

1.  **Clone the repository (if you haven't already).**
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    ```
3.  **Set up Environment Variables:**
    *   Rename the `.env.example` file (or create a new file named `.env`) in the root directory.
    *   Open the `.env` file.
    *   **Obtain a Google Maps API Key:**
        *   Go to the [Google Cloud Console](https://console.cloud.google.com/).
        *   Create a new project or select an existing one.
        *   Enable the **Places API**. You might need to enable billing for your project.
        *   Go to "APIs & Services" > "Credentials".
        *   Click "Create Credentials" > "API key".
        *   **Restrict your API key!** For security, restrict the key to only be usable by the **Places API** and potentially by specific IP addresses or HTTP referrers if deploying.
        *   Copy the generated API key.
    *   In your `.env` file, replace `"YOUR_GOOGLE_MAPS_API_KEY_HERE"` with the key you just copied:
        ```env
        GOOGLE_MAPS_API_KEY="PASTE_YOUR_API_KEY_HERE"
        ```
    *   **(Optional)** If you plan to use Generative AI features with Genkit later, you might also need a `GOOGLE_GENAI_API_KEY`.

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    ```
5.  Open [http://localhost:9002](http://localhost:9002) (or the specified port) with your browser to see the result.

## Key Features

*   **Search:** Enter keywords (e.g., "restaurants in london") and a radius to search Google Maps.
*   **Results Table:** Displays found businesses, including name, address, rating, phone number, and website status.
*   **Dashboard:** Shows statistics about the search results (total found, with website, without website).
*   **Export:** Export the search results (currently CSV, Excel planned).
*   **Website Highlighting:** Businesses missing a website are highlighted in the results table.

## Project Structure (Key Files)

*   `src/app/page.tsx`: The main page component containing the UI layout and state management.
*   `src/app/actions.ts`: Server Actions handling search logic, API calls, and data export.
*   `src/components/`: Reusable UI components (Search Form, Results Table, Dashboard, etc.) built with ShadCN UI and Tailwind CSS.
*   `src/services/google-maps.ts`: Contains functions to interact with the Google Maps Places API. **This is where the API key is used.**
*   `src/types/index.ts`: TypeScript type definitions for business data.
*   `src/app/globals.css`: Global styles and Tailwind CSS/ShadCN theme configuration.
*   `.env`: Environment variables (API Keys). **Important:** This file should NOT be committed to version control.
*   `next.config.ts`: Next.js configuration.
*   `tailwind.config.ts`: Tailwind CSS configuration.

## Environment Variables

*   `GOOGLE_MAPS_API_KEY`: **Required.** Your API key for accessing the Google Maps Places API.

## Important Notes

*   **API Costs:** The Google Maps Places API is a paid service. Be mindful of usage quotas and associated costs. Ensure you have billing enabled on your Google Cloud project.
*   **API Key Security:** Protect your API key. Do not commit it to version control. Use environment variables and restrict the key in the Google Cloud Console.
*   **Error Handling:** Basic error handling is implemented, but you may want to enhance it based on your needs.
*   **Caching:** Placeholder caching logic exists in `src/app/actions.ts`. You'll need to implement actual Firestore (or another database) integration for caching to work.
