function countryCodeToFlagEmoji(code: string) {
  const upper = code.trim().toUpperCase();
  if (upper.length !== 2) return '🌍';
  const A = 0x1f1e6;
  const first = upper.charCodeAt(0) - 65 + A;
  const second = upper.charCodeAt(1) - 65 + A;
  return String.fromCodePoint(first, second);
}

// TheMealDB "areas" are adjectives (e.g. "British", "American") not always ISO names.
// Map the common ones to a representative country code for a flag emoji.
const AREA_TO_COUNTRY_CODE: Record<string, string> = {
  American: 'US',
  British: 'GB',
  Canadian: 'CA',
  Chinese: 'CN',
  Croatian: 'HR',
  Dutch: 'NL',
  Egyptian: 'EG',
  Filipino: 'PH',
  French: 'FR',
  Greek: 'GR',
  Indian: 'IN',
  Irish: 'IE',
  Italian: 'IT',
  Jamaican: 'JM',
  Japanese: 'JP',
  Kenyan: 'KE',
  Malaysian: 'MY',
  Mexican: 'MX',
  Moroccan: 'MA',
  Polish: 'PL',
  Portuguese: 'PT',
  Russian: 'RU',
  Spanish: 'ES',
  Thai: 'TH',
  Tunisian: 'TN',
  Turkish: 'TR',
  Vietnamese: 'VN',
};

export function flagForArea(area: string) {
  const key = area.trim();
  const code = AREA_TO_COUNTRY_CODE[key];
  return code ? countryCodeToFlagEmoji(code) : '🌍';
}

