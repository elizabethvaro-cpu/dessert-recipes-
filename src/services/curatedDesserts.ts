import type { RecipeDetail, RecipeSummary } from '../types/recipes';

type CuratedRecipe = RecipeDetail & { countryKey: string };

// Curated fallback desserts to ensure countries like Mexico/Japan have multiple options,
// even when public APIs have sparse coverage.
//
// Images are optional; if omitted, the UI shows a neutral placeholder.
const CURATED: CuratedRecipe[] = [
  {
    id: 'curated:mexico-churros',
    provider: 'curated',
    title: 'Churros',
    country: 'Mexico',
    cuisine: 'Mexican',
    description: 'Crispy fried dough coated in cinnamon sugar.',
    ingredients: [
      '1 cup water',
      '2 tbsp sugar',
      '1/2 tsp salt',
      '2 tbsp butter',
      '1 cup all-purpose flour',
      '1 large egg',
      'Oil for frying',
      'Cinnamon sugar (to coat)',
    ],
    instructions:
      'Bring water, sugar, salt, and butter to a boil. Remove from heat and stir in flour until a dough forms. Let cool 5 minutes, then beat in egg until smooth. Pipe into hot oil (350°F/175°C) and fry until golden. Drain, then roll in cinnamon sugar. Serve warm.',
    sourceName: 'Curated',
    countryKey: 'mexico',
  },
  {
    id: 'curated:mexico-flan',
    provider: 'curated',
    title: 'Flan (Caramel Custard)',
    country: 'Mexico',
    cuisine: 'Mexican',
    description: 'Silky custard with a caramel topping.',
    ingredients: [
      '3/4 cup sugar (caramel)',
      '4 large eggs',
      '1 can sweetened condensed milk',
      '1 can evaporated milk',
      '1 tsp vanilla',
    ],
    instructions:
      'Melt sugar in a saucepan until amber; pour into a ramekin or pan. Blend eggs, condensed milk, evaporated milk, and vanilla. Pour over caramel. Bake in a water bath at 325°F/160°C until set. Chill, then invert to serve.',
    sourceName: 'Curated',
    countryKey: 'mexico',
  },
  {
    id: 'curated:mexico-tres-leches',
    provider: 'curated',
    title: 'Tres Leches Cake',
    country: 'Mexico',
    cuisine: 'Mexican',
    description: 'Sponge cake soaked in three milks.',
    ingredients: [
      '1 sponge cake (9x13)',
      '1 can evaporated milk',
      '1 can sweetened condensed milk',
      '1 cup whole milk',
      'Whipped cream (topping)',
    ],
    instructions:
      'Bake a light sponge cake and cool. Whisk the three milks and pour over cake; refrigerate several hours. Top with whipped cream and serve chilled.',
    sourceName: 'Curated',
    countryKey: 'mexico',
  },
  {
    id: 'curated:mexico-arroz-con-leche',
    provider: 'curated',
    title: 'Arroz con Leche',
    country: 'Mexico',
    cuisine: 'Mexican',
    description: 'Creamy cinnamon rice pudding.',
    ingredients: [
      '1 cup rice',
      '4 cups milk',
      '1 cinnamon stick',
      '1/2 cup sugar',
      'Vanilla (optional)',
      'Ground cinnamon (to serve)',
    ],
    instructions:
      'Simmer rice with milk and cinnamon until tender and creamy, stirring often. Sweeten with sugar (and vanilla). Serve warm or cold with cinnamon.',
    sourceName: 'Curated',
    countryKey: 'mexico',
  },
  {
    id: 'curated:mexico-conchas',
    provider: 'curated',
    title: 'Conchas (Pan Dulce)',
    country: 'Mexico',
    cuisine: 'Mexican',
    description: 'Sweet buns with a crunchy sugar shell.',
    ingredients: [
      'Sweet yeast dough (milk, flour, sugar, butter, yeast)',
      'Sugar paste topping (butter, sugar, flour, cocoa/vanilla)',
    ],
    instructions:
      'Make enriched dough and let rise. Form buns. Mix sugar topping into a paste, flatten and place on buns, score shell pattern. Proof again and bake until golden.',
    sourceName: 'Curated',
    countryKey: 'mexico',
  },
  {
    id: 'curated:japan-mochi',
    provider: 'curated',
    title: 'Mochi (Sweet Rice Cakes)',
    country: 'Japan',
    cuisine: 'Japanese',
    description: 'Chewy rice cakes, often filled with sweet red bean.',
    ingredients: [
      '1 cup glutinous rice flour (mochiko)',
      '3/4 cup water',
      '1/4 cup sugar',
      'Cornstarch (for dusting)',
      'Sweet red bean paste (optional filling)',
    ],
    instructions:
      'Mix flour, water, and sugar. Microwave (or steam) in short bursts, stirring until thick and glossy. Dust surface with cornstarch, turn out dough, cool slightly, then portion and fill with red bean paste if desired.',
    sourceName: 'Curated',
    countryKey: 'japan',
  },
  {
    id: 'curated:japan-dorayaki',
    provider: 'curated',
    title: 'Dorayaki',
    country: 'Japan',
    cuisine: 'Japanese',
    description: 'Pancake sandwiches filled with sweet red bean.',
    ingredients: [
      '2 eggs',
      '1/2 cup sugar',
      '1 tbsp honey',
      '1 cup flour',
      '1 tsp baking powder',
      '1/2 cup water/milk',
      'Sweet red bean paste (anko)',
    ],
    instructions:
      'Whisk eggs, sugar, and honey. Fold in flour and baking powder; thin with water/milk. Cook small pancakes on a lightly oiled pan. Sandwich with anko.',
    sourceName: 'Curated',
    countryKey: 'japan',
  },
  {
    id: 'curated:japan-daifuku',
    provider: 'curated',
    title: 'Daifuku',
    country: 'Japan',
    cuisine: 'Japanese',
    description: 'Soft mochi filled with sweet bean paste.',
    ingredients: [
      'Mochi dough (mochiko, water, sugar)',
      'Sweet red bean paste',
      'Cornstarch/potato starch (dusting)',
    ],
    instructions:
      'Prepare mochi dough. Portion dough, flatten, and wrap around red bean paste balls. Dust generously to prevent sticking.',
    sourceName: 'Curated',
    countryKey: 'japan',
  },
  {
    id: 'curated:japan-taiyaki',
    provider: 'curated',
    title: 'Taiyaki',
    country: 'Japan',
    cuisine: 'Japanese',
    description: 'Fish-shaped waffles filled with sweet fillings.',
    ingredients: [
      'Pancake/waffle batter',
      'Red bean paste, custard, or chocolate',
      'Taiyaki pan (or waffle iron as substitute)',
    ],
    instructions:
      'Heat taiyaki pan, oil lightly. Add batter, place filling, cover with more batter. Cook until crisp and golden on both sides.',
    sourceName: 'Curated',
    countryKey: 'japan',
  },
  {
    id: 'curated:japan-anmitsu',
    provider: 'curated',
    title: 'Anmitsu',
    country: 'Japan',
    cuisine: 'Japanese',
    description: 'A bowl dessert with agar jelly, fruit, and sweet syrup.',
    ingredients: [
      'Agar jelly cubes',
      'Fresh fruit',
      'Sweet red bean paste',
      'Brown sugar syrup (kuromitsu)',
    ],
    instructions:
      'Assemble agar jelly and fruit in a bowl. Add red bean paste and drizzle with syrup. Serve chilled.',
    sourceName: 'Curated',
    countryKey: 'japan',
  },
];

export function curatedDessertsForCountry(countryName: string): RecipeSummary[] {
  const key = countryName.trim().toLowerCase();
  return CURATED.filter((r) => r.countryKey === key).map(toSummary);
}

export function getCuratedDessertDetail(id: string): RecipeDetail | null {
  const found = CURATED.find((r) => r.id === id);
  return found ?? null;
}

function toSummary(r: CuratedRecipe): RecipeSummary {
  const { ingredients: _i, instructions: _s, sourceName: _sn, sourceUrl: _su, countryKey: _ck, ...summary } = r;
  return summary;
}

