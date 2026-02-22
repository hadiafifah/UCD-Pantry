import pantryRecipesCsv from '@dataset/pantry-recipes.csv?raw'

function parseCsv(text) {
  const rows = []
  let row = []
  let value = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i]
    const next = text[i + 1]

    if (char === '"') {
      if (inQuotes && next === '"') {
        value += '"'
        i += 1
      } else {
        inQuotes = !inQuotes
      }
      continue
    }

    if (char === ',' && !inQuotes) {
      row.push(value)
      value = ''
      continue
    }

    if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && next === '\n') {
        i += 1
      }
      row.push(value)
      rows.push(row)
      row = []
      value = ''
      continue
    }

    value += char
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value)
    rows.push(row)
  }

  return rows.filter((r) => r.some((cell) => cell.trim() !== ''))
}

function splitMultilineField(value) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

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
  return value
    .split(/\s+/)
    .map(normalizeToken)
    .filter((token) => token && !STOP_WORDS.has(token))
}

function normalizeRow(row, headers, index) {
  const get = (name) => row[headers[name]]?.trim() ?? ''
  const title = get('recipe')

  return {
    id: `${slugify(title) || 'recipe'}-${index + 1}`,
    title,
    ingredients: splitMultilineField(get('ingredients')),
    pantryIngredients: splitMultilineField(get('ingredientspantry')),
    instructions: splitMultilineField(get('preparation')),
  }
}

function resolveHeaderIndex(indexByHeader, candidates) {
  for (const key of candidates) {
    if (key in indexByHeader) return indexByHeader[key]
  }
  return -1
}

function loadRecipesFromCsv(csvText) {
  const rows = parseCsv(csvText.replace(/^\uFEFF/, ''))
  if (rows.length < 2) return []

  const headers = rows[0].map((h) => h.toLowerCase().replace(/[^a-z]/g, ''))
  const indexByHeader = Object.fromEntries(headers.map((h, i) => [h, i]))
  const mappedHeaders = {
    recipe: resolveHeaderIndex(indexByHeader, ['recipe']),
    ingredients: resolveHeaderIndex(indexByHeader, ['ingredients']),
    ingredientspantry: resolveHeaderIndex(indexByHeader, [
      'ingredientsatthepantry',
      'ingredientspantry',
    ]),
    preparation: resolveHeaderIndex(indexByHeader, ['preparation']),
  }
  if (Object.values(mappedHeaders).some((index) => index === -1)) return []

  return rows
    .slice(1)
    .map((row, index) => normalizeRow(row, mappedHeaders, index))
    .filter((recipe) => recipe.title)
}

const RECIPES = loadRecipesFromCsv(pantryRecipesCsv)

export function ingredientMatches(selectedIngredient, pantryIngredientLine) {
  const selectedTokens = tokenizeIngredient(selectedIngredient)
  const pantryTokens = new Set(tokenizeIngredient(pantryIngredientLine))

  if (!selectedTokens.length || !pantryTokens.size) return false
  return selectedTokens.every((token) => pantryTokens.has(token))
}

export function findRecipesByIngredients(userIngredients) {
  if (!userIngredients.length) return []

  const normalizedUserIngredients = userIngredients
    .map((item) => item.trim())
    .filter(Boolean)
  if (!normalizedUserIngredients.length) return []

  const minimumMatches = 1

  const scored = RECIPES.map((recipe) => {
    const pantryList = recipe.pantryIngredients
    const matchCount = pantryList.filter((pantryItem) =>
      normalizedUserIngredients.some((userItem) =>
        ingredientMatches(userItem, pantryItem)
      )
    ).length
    return { recipe, matchCount }
  })
    .filter(({ matchCount }) => matchCount >= minimumMatches)
    .sort((a, b) => b.matchCount - a.matchCount)

  return scored.map(({ recipe }) => recipe)
}

export function getRecipeById(id) {
  return RECIPES.find((r) => r.id === id) || null
}
