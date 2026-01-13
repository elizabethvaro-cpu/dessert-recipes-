// TheMealDB types (only the fields we use).

export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export type MealsFilterResponse = {
  meals: MealSummary[] | null;
};

export type AreaListItem = {
  strArea: string;
};

export type AreasListResponse = {
  meals: AreaListItem[] | null;
};

export type MealDetail = {
  idMeal: string;
  strMeal: string;
  strCategory: string | null;
  strArea: string | null;
  strInstructions: string | null;
  strMealThumb: string | null;
  strTags: string | null;
  strYoutube: string | null;

  // Ingredients + measures are stored as strIngredient1..20 and strMeasure1..20
  [key: `strIngredient${number}`]: string | null | undefined;
  [key: `strMeasure${number}`]: string | null | undefined;
};

export type MealLookupResponse = {
  meals: MealDetail[] | null;
};

export type IngredientLine = {
  ingredient: string;
  measure?: string;
};

