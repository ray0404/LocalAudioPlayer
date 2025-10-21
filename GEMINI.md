# Project Overview

This project is a local audio player application, likely a Progressive Web App (PWA), developed as an "AI Studio app." It is built using React (v19.2.0) and TypeScript (v5.8.2), and leverages Vite (v6.2.0) for its development and build processes. The application integrates with the Gemini API, requiring a `GEMINI_API_KEY` to be set in the `.env.local` file.

## Technology Stack

*   **Frontend:** React (v19.2.0), TypeScript (v5.8.2)
*   **Build Tool:** Vite (v6.2.0)
*   **Package Manager:** npm
*   **API Integration:** Gemini API

## Building and Running

To set up and run the project locally, follow these steps:

1.  **Prerequisites:** Ensure Node.js is installed on your system.
2.  **Install Dependencies:** Navigate to the project root directory in your terminal and run:
    ```bash
    npm install
    ```
3.  **Configure Gemini API Key:** Create a `.env.local` file in the project root and add your Gemini API key:
    ```
    GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    ```
    Replace `YOUR_GEMINI_API_KEY` with your actual key.
4.  **Run in Development Mode:** To start the development server, execute:
    ```bash
    npm run dev
    ```
    This will typically open the application in your browser at `http://localhost:5173` (or another port if 5173 is in use).
5.  **Build for Production:** To create a production-ready build of the application, run:
    ```bash
    npm run build
    ```
    The compiled assets will be located in the `dist` directory.
6.  **Preview Production Build:** To preview the production build locally, use:
    ```bash
    npm run preview
    ```

## Development Conventions

Based on the file structure and `package.json`, the project follows a standard React application structure with components organized into `components/` and `views/` directories. TypeScript is used for type safety, and Vite provides a fast development experience. Further conventions regarding styling, state management, and testing would require a deeper dive into the source code files (e.g., `App.tsx`, `index.tsx`, and files within `components/` and `views/`).
