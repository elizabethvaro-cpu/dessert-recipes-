This file preserves the original build requirements used to implement the app.

## App Overview

Build a native mobile application using Expo (React Native) that allows users to discover dessert recipes from around the world. The app should fetch recipes from a public open recipe API, focusing on desserts by country or cuisine.

The app must work on:

- iOS
- Android
- Web (Expo Web, deployable on Vercel)

## Functional Requirements

- Use Expo (managed workflow)
- Use React Native with TypeScript
- Fetch data from a free, open recipe API
- Support global dessert cuisines
- Must be mobile-first
- Must be Vercel-ready
- No authentication required
- Handle loading and error states gracefully

## Core Features

### Recipe Discovery

- Fetch dessert recipes from different countries
- Display:
  - Recipe name
  - Image
  - Country / cuisine
  - Short description (if available)

### Filtering & Navigation

- Filter desserts by country / cuisine
- Scrollable recipe list
- Tap a recipe to view full details

### Recipe Detail Screen

- Ingredients list
- Cooking instructions
- Image preview
- Country of origin

### UX Enhancements

- Loading indicators
- Empty states
- Error handling
- Smooth navigation transitions

## API Integration

Use TheMealDB:

- Base URL: `https://www.themealdb.com/api/json/v1/1/`
- Endpoints:
  - Desserts by category: `/filter.php?c=Dessert`
  - Lookup recipe details: `/lookup.php?i={mealId}`
  - Filter by area (country): `/filter.php?a={Area}`

API Requirements:

- Centralized API service file
- Typed responses (TypeScript)
- Async/await pattern
- Graceful failure handling

## App Architecture

- `app/` or `src/` directory structure
- Screens: HomeScreen, RecipeListScreen, RecipeDetailScreen
- Components: RecipeCard, LoadingSpinner
- Services: `api.ts` (recipe API)
- Navigation: expo-router or @react-navigation/native

## Styling & UI

- StyleSheet API or NativeWind
- Clean, modern, food-focused UI
- Warm dessert-themed colors (cream, chocolate, pastel tones)
- Responsive layouts
- Consistent spacing and typography

## Deployment Readiness

- Compatible with Expo Web
- Configured for Vercel deployment
- Includes `app.json`
- Web output support
- No native dependencies that break web builds

