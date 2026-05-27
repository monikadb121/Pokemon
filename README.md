# NexDex - Premium Pokédex Search Engine

NexDex is a high-performance, visually stunning full-stack Pokédex application built with modern web technologies. It features a robust caching layer to ensure lightning-fast responses and a premium UI inspired by gaming dashboards.

## Features
- **Ultra-Fast Search**: Debounced autocomplete search utilizing an in-memory cached index of all Pokémon.
- **Deep Dive Details**: View high-resolution sprites, base stats with animated progress bars, physical traits, abilities (including hidden), and localized flavor text.
- **Evolution Chain Explorer**: Interactive visual node tree of a Pokémon's evolutionary path.
- **Recently Viewed**: Persisted history using `localStorage` for quick navigation.
- **Premium UI**: Custom dark theme, glassmorphism, Framer Motion animations, skeleton loaders, and interactive hover states.

## Tech Stack
### Frontend
- React 18 (Vite)
- Tailwind CSS
- React Query (@tanstack/react-query)
- Framer Motion
- Axios
- Lucide React (Icons)

### Backend
- Node.js & Express
- Node-Cache (In-memory caching layer)
- Axios (External API requests)
- Express Rate Limit

## Architecture & Caching Strategy
To avoid rate-limiting from the public PokéAPI and ensure a snappy user experience, the backend acts as a caching proxy.
- **Search Optimization**: On startup (or first request), the backend fetches the complete list of all Pokémon names and caches it with a long TTL (24 hours). The `/api/search?q=` endpoint filters this list entirely in memory, yielding sub-millisecond response times.
- **Data Merging**: The `/api/pokemon/:name` endpoint fetches both basic data (`/pokemon`) and species data (`/pokemon-species`) concurrently, merges only the required fields, and caches the result. This reduces the frontend payload size and prevents N+1 request issues.
- **Evolution Chains**: Chain data is fetched, flattened/normalized, and aggressively cached.

## Setup Instructions

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server (runs on `http://localhost:5000` by default):
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser (usually `http://localhost:5173`).

---
Built as a demonstration of modern full-stack web development practices.
