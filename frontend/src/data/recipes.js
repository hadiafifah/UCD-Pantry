const RECIPES_API_BASE_URL = import.meta.env.VITE_RECIPES_API_URL?.trim() || 'http://localhost:5050'
let recipesCache = null

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'at',
  'cup',
  'cups',
  'clove',
  'cloves',
  'can',
  'cans',
  'of',
  'oz',
  'ounce',
  'ounces',
  'tbsp',
  'tsp',
  'teaspoon',
  'teaspoons',
  'tablespoon',
  'tablespoons',
  'medium',
  'small',
  'large',
  'ripe',
  'fresh',
  'chopped',
  'diced',
  'sliced',
  'shredded',
  'grated',
  'minced',
  'to',
  'taste',
  'or',
  'pouch',
])

function normalizeToken(value) {
  return value.toLowerCase().replace(/[^a-z]/g, '')
}

export function tokenizeIngredient(value) {
  return String(value || '')
    .split(/\s+/)
    .map(normalizeToken)
    .filter((token) => token && !STOP_WORDS.has(token))
}

export function ingredientMatches(selectedIngredient, ingredientLine) {
  const selectedTokens = tokenizeIngredient(selectedIngredient)
  const ingredientTokens = new Set(tokenizeIngredient(ingredientLine))

  if (!selectedTokens.length || !ingredientTokens.size) return false
  return selectedTokens.every((token) => ingredientTokens.has(token))
}

function splitField(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || '').trim()).filter(Boolean)
  }

  return String(value || '')
    .split(/\r?\n|,/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function pickField(source, keys) {
  for (const key of keys) {
    if (source[key] !== undefined && source[key] !== null) {
      return source[key]
    }
  }
  return ''
}

function normalizeHeaderKey(key) {
  return String(key || '')
    .toLowerCase()
    .replace(/[^a-z]/g, '')
}

function toNormalizedKeyMap(rawRecipe) {
  const result = {}
  Object.entries(rawRecipe || {}).forEach(([key, value]) => {
    result[normalizeHeaderKey(key)] = value
  })
  return result
}

function normalizeRecipe(rawRecipe, index) {
  const keyMap = toNormalizedKeyMap(rawRecipe)
  const title = String(
    pickField(rawRecipe, ['title', 'Recipe', 'recipe']) ||
      keyMap.recipe
  ).trim()
  const id =
    String(pickField(rawRecipe, ['id', '_id']) || '').trim() ||
    `${slugify(title) || 'recipe'}-${index + 1}`

  return {
    id,
    title,
    ingredients: splitField(
      pickField(rawRecipe, ['ingredients', 'Ingredients']) ||
        keyMap.ingredients
    ),
    pantryIngredients: splitField(
      pickField(rawRecipe, [
        'pantryIngredients',
        'Ingredient(s) at The Pantry',
        'ingredient(s) at the pantry',
      ]) || keyMap.ingredientsatthepantry || keyMap.ingredientspantry
    ),
    instructions: splitField(
      pickField(rawRecipe, ['instructions', 'Preparation', 'preparation']) ||
        keyMap.preparation
    ),
  }
}

export async function fetchRecipes({ force = false } = {}) {
  if (recipesCache && !force) return recipesCache

  const response = await fetch(`${RECIPES_API_BASE_URL}/recipes`)
  if (!response.ok) {
    throw new Error(`Recipe API returned ${response.status}`)
  }

  const payload = await response.json()
  const list = Array.isArray(payload) ? payload : []
  recipesCache = list
    .map((recipe, index) => normalizeRecipe(recipe, index))
    .filter((recipe) => recipe.title)

  return recipesCache
}

export async function findRecipesByIngredients(userIngredients) {
  if (!userIngredients.length) return []

  const normalizedUserIngredients = userIngredients
    .map((item) => String(item || '').trim())
    .filter(Boolean)
  if (!normalizedUserIngredients.length) return []

  const response = await fetch(`${RECIPES_API_BASE_URL}/recipes/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients: normalizedUserIngredients }),
  })

  if (!response.ok) {
    throw new Error(`Recipe search API returned ${response.status}`)
  }

  const payload = await response.json()
  const list = Array.isArray(payload) ? payload : []
  return list
    .map((recipe, index) => normalizeRecipe(recipe, index))
    .filter((recipe) => recipe.title)
}

export async function getRecipeById(id) {
  const recipes = await fetchRecipes()
  return recipes.find((recipe) => recipe.id === id) || null
}
