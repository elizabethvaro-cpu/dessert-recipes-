function normalizeKey(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\u2019']/g, '')
    .replace(/[^a-z\s-]/g, '')
    .replace(/\s+/g, ' ');
}

// TheMealDB uses "areas" (often demonyms/adjectives). This mapping enables using
// a full country list (Rest Countries) while still leveraging TheMealDB where possible.
const COUNTRY_TO_AREA: Record<string, string> = {
  mexico: 'Mexican',
  japan: 'Japanese',
  china: 'Chinese',
  india: 'Indian',
  italy: 'Italian',
  france: 'French',
  spain: 'Spanish',
  portugal: 'Portuguese',
  russia: 'Russian',
  turkey: 'Turkish',
  tunisia: 'Tunisian',
  thailand: 'Thai',
  vietnam: 'Vietnamese',
  malaysia: 'Malaysian',
  morocco: 'Moroccan',
  jamaica: 'Jamaican',
  poland: 'Polish',
  greece: 'Greek',
  croatia: 'Croatian',
  egypt: 'Egyptian',
  netherlands: 'Dutch',
  philippines: 'Filipino',
  kenya: 'Kenyan',
  canada: 'Canadian',
  ireland: 'Irish',
  'united states': 'American',
  usa: 'American',
  'united kingdom': 'British',
  uk: 'British',
};

export function countryToMealDbArea(countryName: string): string | null {
  const key = normalizeKey(countryName);
  return COUNTRY_TO_AREA[key] ?? null;
}

