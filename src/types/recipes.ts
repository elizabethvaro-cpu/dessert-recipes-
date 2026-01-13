export type RecipeProviderId = 'mealdb' | 'dummyjson' | 'curated';

export type RecipeSummary = {
  id: string; // provider-prefixed (e.g. mealdb:52893)
  provider: RecipeProviderId;
  title: string;
  imageUrl?: string;
  country?: string; // e.g. "Mexico"
  cuisine?: string; // e.g. "Mexican"
  description?: string;
};

export type RecipeDetail = RecipeSummary & {
  ingredients: string[];
  instructions: string;
  sourceName?: string;
  sourceUrl?: string;
};

