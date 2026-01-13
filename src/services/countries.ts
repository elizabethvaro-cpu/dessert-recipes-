export type Country = {
  name: string;
  flag: string; // emoji
};

type RestCountry = {
  name?: { common?: string };
  flag?: string;
};

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

// Rest Countries is used only to provide a bigger, inclusive country list + flags.
// Recipes still come from TheMealDB.
export async function fetchCountries(): Promise<
  { ok: true; data: Country[] } | { ok: false; error: string }
> {
  const url = 'https://restcountries.com/v3.1/all?fields=name,flag';
  const res = await safeFetchJson<RestCountry[]>(url);
  if (!res.ok) return res;

  const countries = (res.data ?? [])
    .map((c) => ({
      name: c.name?.common?.trim() ?? '',
      flag: c.flag?.trim() ?? '🌍',
    }))
    .filter((c) => c.name.length > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  return { ok: true, data: countries };
}

