# Local Audio Player

A progressive web application (PWA) for playing local audio files, built with React and TypeScript. This application integrates with the Gemini API for potential future AI-powered features.

## Features

*   Play local audio files directly in your browser.
*   Intuitive user interface for managing your music library.
*   (Add more features as they become apparent from the code, e.g., playlist management, search, etc.)

## Technology Stack

*   **Frontend:** React (v19.2.0), TypeScript (v5.8.2)
*   **Build Tool:** Vite (v6.2.0)
*   **Package Manager:** npm
*   **API Integration:** Gemini API

## Run Locally

**Prerequisites:** Node.js

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Configure Gemini API Key:** Create a `.env.local` file in the project root and add your Gemini API key:
    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
    Replace `YOUR_API_KEY` with your actual key.
3.  **Run the app in development mode:**
    ```bash
    npm run dev
    ```
    This will typically open the application in your browser at `http://localhost:5173` (or another port if 5173 is in use).
4.  **Build for Production:** To create a production-ready build of the application, run:
    ```bash
    npm run build
    ```
    The compiled assets will be located in the `dist` directory.
5.  **Preview Production Build:** To preview the production build locally, use:
    ```bash
    npm run preview
    ```

## Usage

(Detailed instructions on how to use the audio player, e.g., how to select files, create playlists, etc. This will require more understanding of the application's UI/UX.)

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
