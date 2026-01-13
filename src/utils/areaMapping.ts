function normalizeKey(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\u2019']/g, '')
    .replace(/[^a-z\s-]/g, '')
    .replace(/\s+/g, ' ');
}

// Map a country name to TheMealDB "area" (demonym/adjective).
// This lets us support a bigger, more inclusive country list while still
// using TheMealDB as the recipe source.
const COUNTRY_TO_AREA: Record<string, string> = {
  mexico: 'Mexican',
  'united states': 'American',
  usa: 'American',
  'u s a': 'American',
  america: 'American',
  'united kingdom': 'British',
  uk: 'British',
  'great britain': 'British',
  england: 'British',
  scotland: 'British',
  wales: 'British',
  ireland: 'Irish',
  canada: 'Canadian',
  china: 'Chinese',
  croatia: 'Croatian',
  netherlands: 'Dutch',
  egypt: 'Egyptian',
  philippines: 'Filipino',
  france: 'French',
  greece: 'Greek',
  india: 'Indian',
  italy: 'Italian',
  jamaica: 'Jamaican',
  japan: 'Japanese',
  kenya: 'Kenyan',
  malaysia: 'Malaysian',
  morocco: 'Moroccan',
  poland: 'Polish',
  portugal: 'Portuguese',
  russia: 'Russian',
  spain: 'Spanish',
  thailand: 'Thai',
  tunisia: 'Tunisian',
  turkey: 'Turkish',
  vietnam: 'Vietnamese',
};

export function countryToMealDbArea(countryName: string): string | null {
  const key = normalizeKey(countryName);
  return COUNTRY_TO_AREA[key] ?? null;
}

