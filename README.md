# Global Dessert Recipes (Expo + React Native + TypeScript)

Native (iOS/Android) + Web (Vercel-ready) Expo app for discovering dessert recipes around the world using **TheMealDB**.

## Features

- Browse **all desserts** (category: Dessert)
- Browse desserts **by country / cuisine (area)**
- Recipe details:
  - Image
  - Country of origin
  - Ingredients list
  - Cooking instructions
- Graceful UX:
  - Loading indicators
  - Empty states
  - Error handling + retry

## Tech

- Expo (managed)
- React Native + TypeScript
- Navigation: `expo-router`
- API: TheMealDB (`https://www.themealdb.com/api/json/v1/1/`)

## Project structure

- `app/`: routes / screens (expo-router)
  - `app/index.tsx`: HomeScreen
  - `app/recipes/index.tsx`: RecipeListScreen
  - `app/recipes/[id].tsx`: RecipeDetailScreen
- `src/components/`: reusable UI components
- `src/services/api.ts`: centralized MealDB API client (typed, async/await, cached lookups)
- `src/types/`: API response + model types

## Run locally

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm run start
```

Then press:

- `a` for Android
- `w` for Web
- `i` for iOS (requires macOS if building locally; Expo Go works without a Mac)

## Build for web (static export)

```bash
npm run export:web
```

This generates a static site in `dist/`.

## Deploy to Vercel

This repo includes `vercel.json` configured for Expo web export:

- **Build Command**: `npm run export:web`
- **Output Directory**: `dist`

If using the Vercel UI, import the repo and deploy with the defaults from `vercel.json`.

## Notes

- TheMealDB “filter by area” endpoint is not dessert-only. To keep “desserts by country” accurate, the app fetches meals for an area and then confirms each is a **Dessert** by looking up details (cached).

