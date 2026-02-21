/**
 * Mock recipe data. In production, this would come from an API
 * (e.g. Spoonacular, Edamam, or your own backend).
 */
const RECIPES = [
  {
    id: 'garlic-pasta',
    title: 'Quick Garlic Butter Pasta',
    prepTime: 5,
    cookTime: 15,
    servings: 2,
    ingredients: ['Pasta', 'Garlic', 'Butter', 'Olive Oil', 'Salt', 'Pepper'],
    instructions: [
      'Bring a large pot of salted water to a boil. Cook pasta according to package directions until al dente. Reserve 1 cup of pasta water before draining.',
      'While pasta cooks, thinly slice 4 cloves of garlic. Heat 2 tablespoons of olive oil and 2 tablespoons of butter in a large skillet over medium heat.',
      'Add garlic to the skillet and cook for 1-2 minutes, stirring frequently, until golden and fragrant. Be careful not to burn it.',
      'Add the drained pasta to the skillet. Toss with the garlic butter, adding pasta water a little at a time until the sauce coats the noodles.',
      'Season with salt and pepper to taste. Serve immediately.',
    ],
    youtubeId: 'bJUiWdM__Qw',
    tags: ['Quick', 'Budget-Friendly', 'Vegetarian'],
  },
  {
    id: 'bean-rice-bowl',
    title: 'Hearty Beans and Rice Bowl',
    prepTime: 5,
    cookTime: 20,
    servings: 3,
    ingredients: ['Rice', 'Canned Beans', 'Onion', 'Garlic', 'Canned Tomatoes', 'Salt', 'Pepper'],
    instructions: [
      'Cook rice according to package directions.',
      'Dice one medium onion and mince 2 cloves of garlic.',
      'Heat a splash of oil in a saucepan over medium heat. Saute onion for 3-4 minutes until softened.',
      'Add garlic and cook for 30 seconds. Add drained and rinsed beans plus canned tomatoes.',
      'Simmer for 10-15 minutes, stirring occasionally, until thickened.',
      'Season with salt and pepper. Serve beans over rice.',
    ],
    youtubeId: 'P_GEwJiAJes',
    tags: ['High Protein', 'Budget-Friendly', 'Vegan'],
  },
  {
    id: 'egg-fried-rice',
    title: 'Simple Egg Fried Rice',
    prepTime: 5,
    cookTime: 10,
    servings: 2,
    ingredients: ['Rice', 'Eggs', 'Soy Sauce', 'Garlic', 'Onion', 'Frozen Vegetables', 'Salt'],
    instructions: [
      'Use leftover cooked rice or cook rice and let it cool. Cold rice works best for fried rice.',
      'Dice half an onion and mince 2 cloves of garlic. Beat 2-3 eggs in a small bowl.',
      'Heat oil in a large skillet or wok over high heat. Scramble the eggs, break into small pieces, and set aside.',
      'In the same pan, saute onion and garlic for 1-2 minutes. Add frozen vegetables and cook until warmed through.',
      'Add the cold rice and toss everything together. Drizzle 2 tablespoons of soy sauce and stir until evenly coated.',
      'Add the scrambled eggs back in, toss to combine, and serve hot.',
    ],
    youtubeId: 'qH__o17xHls',
    tags: ['Quick', 'Budget-Friendly', 'High Protein'],
  },
  {
    id: 'peanut-butter-oats',
    title: 'Peanut Butter Overnight Oats',
    prepTime: 5,
    cookTime: 0,
    servings: 1,
    ingredients: ['Oats', 'Peanut Butter', 'Milk', 'Bananas', 'Sugar'],
    instructions: [
      'In a jar or container, combine 1/2 cup oats, 1/2 cup milk, and 1 tablespoon of peanut butter.',
      'Add a teaspoon of sugar (or honey) and stir well to combine.',
      'Cover and refrigerate overnight (or at least 4 hours).',
      'In the morning, slice a banana on top and enjoy cold or microwave for 1-2 minutes for a warm breakfast.',
    ],
    youtubeId: 'VgkEhF7Z5g8',
    tags: ['No Cook', 'Breakfast', 'Meal Prep'],
  },
  {
    id: 'quesadilla',
    title: 'Cheesy Bean Quesadilla',
    prepTime: 5,
    cookTime: 8,
    servings: 2,
    ingredients: ['Tortillas', 'Cheese', 'Canned Beans', 'Bell Pepper', 'Onion', 'Salt'],
    instructions: [
      'Drain and rinse a can of beans. Lightly mash half of them with a fork for a creamier texture.',
      'Dice a quarter of a bell pepper and a quarter of an onion into small pieces.',
      'Lay a tortilla flat. Spread beans on one half, then add diced veggies and shredded cheese.',
      'Fold the tortilla in half. Cook in a dry skillet over medium heat for 3-4 minutes per side until golden and the cheese is melted.',
      'Cut into wedges and serve with salsa or sour cream if available.',
    ],
    youtubeId: '9Ah1MZxRLk0',
    tags: ['Quick', 'Budget-Friendly', 'Vegetarian'],
  },
  {
    id: 'lentil-soup',
    title: 'Simple Lentil Soup',
    prepTime: 10,
    cookTime: 30,
    servings: 4,
    ingredients: ['Lentils', 'Onion', 'Carrots', 'Garlic', 'Canned Tomatoes', 'Olive Oil', 'Salt', 'Pepper'],
    instructions: [
      'Rinse 1 cup of lentils under cold water and set aside.',
      'Dice one onion and two carrots. Mince 3 cloves of garlic.',
      'Heat olive oil in a large pot over medium heat. Cook onion and carrots for 5 minutes until softened.',
      'Add garlic and cook for another minute. Add lentils, canned tomatoes, and 4 cups of water.',
      'Bring to a boil, then reduce heat and simmer for 25-30 minutes until lentils are tender.',
      'Season generously with salt and pepper. For a creamier soup, blend half of it and stir back in.',
    ],
    youtubeId: 'fFLn1h80AGQ',
    tags: ['Healthy', 'Budget-Friendly', 'Vegan', 'Meal Prep'],
  },
]

/**
 * Find recipes that match the given ingredients.
 * Returns recipes sorted by the number of matching ingredients (most matches first).
 */
export function findRecipesByIngredients(userIngredients) {
  const lower = userIngredients.map((i) => i.toLowerCase())

  const scored = RECIPES.map((recipe) => {
    const matchCount = recipe.ingredients.filter((ing) =>
      lower.includes(ing.toLowerCase())
    ).length
    return { recipe, matchCount }
  })
    .filter(({ matchCount }) => matchCount >= 2)
    .sort((a, b) => b.matchCount - a.matchCount)

  return scored.map(({ recipe }) => recipe)
}

/**
 * Get a single recipe by its ID.
 */
export function getRecipeById(id) {
  return RECIPES.find((r) => r.id === id) || null
}
