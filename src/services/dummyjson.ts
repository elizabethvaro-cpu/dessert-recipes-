import type { RecipeDetail, RecipeSummary } from '../types/recipes';

const BASE_URL = 'https://dummyjson.com';

type DummyRecipe = {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  cuisine: string;
  tags: string[];
  image: string;
  mealType: string[];
};

type DummyRecipesResponse = {
  recipes: DummyRecipe[];
};

let cachedAll: DummyRecipe[] | null = null;

async function safeFetchJson<T>(url: string): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const res = await fetch(url);
    if (!res.ok) return { ok: false, error: `Request failed (${res.status})` };
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown network error';
    return { ok: false, error: message };
  }
}

function isDessert(r: DummyRecipe) {
  return (
    (r.mealType ?? []).some((t) => t.toLowerCase() === 'dessert') ||
    (r.tags ?? []).some((t) => t.toLowerCase() === 'dessert')
  );
}

async function fetchAllRecipes(): Promise<{ ok: true; data: DummyRecipe[] } | { ok: false; error: string }> {
  if (cachedAll) return { ok: true, data: cachedAll };
  const res = await safeFetchJson<DummyRecipesResponse>(`${BASE_URL}/recipes?limit=0`);
  if (!res.ok) return res;
  cachedAll = res.data.recipes ?? [];
  return { ok: true, data: cachedAll };
}

export async function fetchDummyDessertsByCuisine(
  cuisine: string
): Promise<{ ok: true; data: RecipeSummary[] } | { ok: false; error: string }> {
  const res = await fetchAllRecipes();
  if (!res.ok) return res;
  const wanted = cuisine.trim().toLowerCase();
  const matches = res.data
    .filter(isDessert)
    .filter((r) => r.cuisine?.trim().toLowerCase() === wanted)
    .map((r) => ({
      id: `dummyjson:${r.id}`,
      provider: 'dummyjson' as const,
      title: r.name,
      imageUrl: r.image || undefined,
      cuisine: r.cuisine || undefined,
      description: (r.tags ?? []).includes('Dessert') ? 'Dessert' : undefined,
    }));
  return { ok: true, data: matches };
}

export async function fetchDummyDessertsAll(): Promise<
  { ok: true; data: RecipeSummary[] } | { ok: false; error: string }
> {
  const res = await fetchAllRecipes();
  if (!res.ok) return res;
  const matches = res.data.filter(isDessert).map((r) => ({
    id: `dummyjson:${r.id}`,
    provider: 'dummyjson' as const,
    title: r.name,
    imageUrl: r.image || undefined,
    cuisine: r.cuisine || undefined,
  }));
  return { ok: true, data: matches };
}

export async function fetchDummyDessertDetail(
  id: string
): Promise<{ ok: true; data: RecipeDetail } | { ok: false; error: string }> {
  const rawId = id.replace(/^dummyjson:/, '');
  const res = await safeFetchJson<DummyRecipe>(`${BASE_URL}/recipes/${encodeURIComponent(rawId)}`);
  if (!res.ok) return res;
  const r = res.data;
  const detail: RecipeDetail = {
    id: `dummyjson:${r.id}`,
    provider: 'dummyjson',
    title: r.name,
    imageUrl: r.image || undefined,
    cuisine: r.cuisine || undefined,
    ingredients: r.ingredients ?? [],
    instructions: (r.instructions ?? []).join('\n'),
    sourceName: 'DummyJSON',
    sourceUrl: `${BASE_URL}/recipes/${r.id}`,
  };
  return { ok: true, data: detail };
}

