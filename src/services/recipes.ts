import { fetchDesserts, fetchDessertsByArea, fetchMealDetail, getShortDescription, parseIngredients } from './api';
import { curatedDessertsForCountry, getCuratedDessertDetail } from './curatedDesserts';
import { fetchDummyDessertDetail, fetchDummyDessertsAll, fetchDummyDessertsByCuisine } from './dummyjson';
import { countryToMealDbArea } from '../utils/countryToArea';
import type { RecipeDetail, RecipeSummary } from '../types/recipes';

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

function ok<T>(data: T): ApiResult<T> {
  return { ok: true, data };
}

function err<T>(message: string): ApiResult<T> {
  return { ok: false, error: message };
}

function mealdbSummaryToRecipe(
  meal: { idMeal: string; strMeal: string; strMealThumb: string },
  cuisine?: string
): RecipeSummary {
  return {
    id: `mealdb:${meal.idMeal}`,
    provider: 'mealdb',
    title: meal.strMeal,
    imageUrl: meal.strMealThumb,
    cuisine,
  };
}

export async function fetchDessertSummariesAll(): Promise<ApiResult<RecipeSummary[]>> {
  const [mealdb, dummy] = await Promise.all([fetchDesserts(), fetchDummyDessertsAll()]);

  const out: RecipeSummary[] = [];
  if (mealdb.ok) out.push(...mealdb.data.map((m) => mealdbSummaryToRecipe(m)));
  if (dummy.ok) out.push(...dummy.data);

  // Curated recipes are country-specific; keep them out of global list to avoid duplicates/confusion.
  // (You can still access them by selecting a country like Mexico/Japan.)
  return ok(dedupeById(out));
}

export async function fetchDessertSummariesForCountry(countryName: string): Promise<ApiResult<RecipeSummary[]>> {
  const country = countryName.trim();
  if (!country) return err('Country is required');

  const curated = curatedDessertsForCountry(country);

  const area = countryToMealDbArea(country);
  const [mealdb, dummy] = await Promise.all([
    area ? fetchDessertsByArea(area) : Promise.resolve<ApiResult<{ idMeal: string; strMeal: string; strMealThumb: string }[]>>(ok([])),
    // DummyJSON uses "cuisine" strings (e.g. Japanese). If we mapped to a MealDB area, reuse it; otherwise use country.
    fetchDummyDessertsByCuisine(area ?? country),
  ]);

  const out: RecipeSummary[] = [];
  if (mealdb.ok) out.push(...mealdb.data.map((m) => mealdbSummaryToRecipe(m, area ?? undefined)));
  if (dummy.ok) out.push(...dummy.data.map((d) => ({ ...d, country })));
  out.push(...curated);

  // Ensure a stable order: curated first (guaranteed), then external sources.
  const sorted = [
    ...out.filter((r) => r.provider === 'curated'),
    ...out.filter((r) => r.provider !== 'curated'),
  ];

  return ok(dedupeById(sorted));
}

export async function fetchDessertSummariesForArea(areaName: string): Promise<ApiResult<RecipeSummary[]>> {
  const area = areaName.trim();
  if (!area) return err('Area is required');

  const [mealdb, dummy] = await Promise.all([fetchDessertsByArea(area), fetchDummyDessertsByCuisine(area)]);
  const out: RecipeSummary[] = [];
  if (mealdb.ok) out.push(...mealdb.data.map((m) => mealdbSummaryToRecipe(m, area)));
  if (dummy.ok) out.push(...dummy.data);
  return ok(dedupeById(out));
}

export async function fetchDessertDetail(id: string): Promise<ApiResult<RecipeDetail>> {
  if (id.startsWith('mealdb:')) {
    const mealId = id.replace(/^mealdb:/, '');
    const res = await fetchMealDetail(mealId);
    if (!res.ok) return err(res.error);
    const meal = res.data;
    return ok({
      id,
      provider: 'mealdb',
      title: meal.strMeal,
      imageUrl: meal.strMealThumb ?? undefined,
      cuisine: meal.strArea ?? undefined,
      description: getShortDescription(meal.strInstructions, 120) || undefined,
      ingredients: parseIngredients(meal).map((l) => (l.measure ? `${l.measure} ${l.ingredient}` : l.ingredient)),
      instructions: (meal.strInstructions ?? '').trim() || 'No instructions provided.',
      sourceName: 'TheMealDB',
      sourceUrl: 'https://www.themealdb.com/',
    });
  }

  if (id.startsWith('dummyjson:')) {
    const res = await fetchDummyDessertDetail(id);
    if (!res.ok) return err(res.error);
    return ok(res.data);
  }

  if (id.startsWith('curated:')) {
    const detail = getCuratedDessertDetail(id);
    if (!detail) return err('Recipe not found');
    return ok(detail);
  }

  return err('Unknown recipe source');
}

function dedupeById(items: RecipeSummary[]) {
  const seen = new Set<string>();
  const out: RecipeSummary[] = [];
  for (const item of items) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    out.push(item);
  }
  return out;
}

