import type {
  AreasListResponse,
  IngredientLine,
  MealDetail,
  MealLookupResponse,
  MealsFilterResponse,
  MealSummary,
} from '../types/meals';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; status?: number };

async function safeFetchJson<T>(path: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(`${BASE_URL}${path}`);
    if (!res.ok) {
      return { ok: false, error: `Request failed (${res.status})`, status: res.status };
    }
    const data = (await res.json()) as T;
    return { ok: true, data };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown network error';
    return { ok: false, error: message };
  }
}

// Simple in-memory cache to avoid refetching details between list and detail screens.
const mealDetailCache = new Map<string, MealDetail>();

function normalizeArea(area: string) {
  return encodeURIComponent(area.trim());
}

export function getShortDescription(instructions: string | null | undefined, maxLen = 100) {
  const text = (instructions ?? '').replace(/\s+/g, ' ').trim();
  if (!text) return '';
  if (text.length <= maxLen) return text;
  return `${text.slice(0, maxLen).trimEnd()}…`;
}

export function parseIngredients(meal: MealDetail): IngredientLine[] {
  const lines: IngredientLine[] = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = (meal[`strIngredient${i}`] ?? '').toString().trim();
    const measure = (meal[`strMeasure${i}`] ?? '').toString().trim();
    if (!ingredient) continue;
    lines.push({ ingredient, measure: measure || undefined });
  }
  return lines;
}

export async function fetchDesserts(): Promise<ApiResult<MealSummary[]>> {
  const result = await safeFetchJson<MealsFilterResponse>('/filter.php?c=Dessert');
  if (!result.ok) return result;
  return { ok: true, data: result.data.meals ?? [] };
}

export async function fetchAreas(): Promise<ApiResult<string[]>> {
  const result = await safeFetchJson<AreasListResponse>('/list.php?a=list');
  if (!result.ok) return result;
  const areas = (result.data.meals ?? [])
    .map((m) => m.strArea)
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
  return { ok: true, data: areas };
}

export async function fetchMealDetail(id: string): Promise<ApiResult<MealDetail>> {
  const cached = mealDetailCache.get(id);
  if (cached) return { ok: true, data: cached };

  const result = await safeFetchJson<MealLookupResponse>(`/lookup.php?i=${encodeURIComponent(id)}`);
  if (!result.ok) return result;
  const meal = result.data.meals?.[0];
  if (!meal) return { ok: false, error: 'Recipe not found' };

  mealDetailCache.set(id, meal);
  return { ok: true, data: meal };
}

// TheMealDB can filter meals by area, but it is not dessert-only.
// To keep the app aligned with "desserts by country", we fetch area meals
// then confirm each is a Dessert by looking up details (cached).
export async function fetchDessertsByArea(area: string): Promise<ApiResult<MealSummary[]>> {
  const areaEncoded = normalizeArea(area);
  const areaResult = await safeFetchJson<MealsFilterResponse>(`/filter.php?a=${areaEncoded}`);
  if (!areaResult.ok) return areaResult;

  const meals = areaResult.data.meals ?? [];
  if (meals.length === 0) return { ok: true, data: [] };

  // Concurrency-limited detail lookups (keeps mobile + web snappy).
  const concurrency = 6;
  const out: MealSummary[] = [];
  let idx = 0;

  async function worker() {
    while (idx < meals.length) {
      const current = meals[idx];
      idx += 1;
      const detail = await fetchMealDetail(current.idMeal);
      if (detail.ok && detail.data.strCategory === 'Dessert') {
        out.push(current);
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, meals.length) }, () => worker()));
  return { ok: true, data: out };
}

// All recipes for a country/cuisine (area). This is useful when a country has no desserts
// listed but does have many recipes (e.g. Mexico).
export async function fetchMealsByArea(area: string): Promise<ApiResult<MealSummary[]>> {
  const areaEncoded = normalizeArea(area);
  const areaResult = await safeFetchJson<MealsFilterResponse>(`/filter.php?a=${areaEncoded}`);
  if (!areaResult.ok) return areaResult;
  return { ok: true, data: areaResult.data.meals ?? [] };
}

