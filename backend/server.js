const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = Number(process.env.PORT) || 5050;

if (!process.env.MONGO_DB) {
  throw new Error(
    "Missing MONGO_DB. Add it to backend/.env or project-root .env."
  );
}

const client = new MongoClient(process.env.MONGO_DB);
const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "at",
  "cup",
  "cups",
  "clove",
  "cloves",
  "can",
  "cans",
  "of",
  "oz",
  "ounce",
  "ounces",
  "tbsp",
  "tsp",
  "teaspoon",
  "teaspoons",
  "tablespoon",
  "tablespoons",
  "medium",
  "small",
  "large",
  "ripe",
  "fresh",
  "chopped",
  "diced",
  "sliced",
  "shredded",
  "grated",
  "minced",
  "to",
  "taste",
  "or",
  "pouch",
]);

function normalizeHeaderKey(key) {
  return String(key || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function toNormalizedKeyMap(raw) {
  const map = {};
  Object.entries(raw || {}).forEach(([key, value]) => {
    map[normalizeHeaderKey(key)] = value;
  });
  return map;
}

function splitField(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item || "").trim()).filter(Boolean);
  }

  return String(value || "")
    .split(/\r?\n|,/)
    .map((part) => part.trim())
    .filter(Boolean);
}

function normalizeToken(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
}

function tokenizeIngredient(value) {
  return String(value || "")
    .split(/\s+/)
    .map(normalizeToken)
    .filter((token) => token && !STOP_WORDS.has(token));
}

function ingredientMatches(selectedIngredient, pantryIngredientLine) {
  const selectedTokens = tokenizeIngredient(selectedIngredient);
  const pantryTokens = new Set(tokenizeIngredient(pantryIngredientLine));

  if (!selectedTokens.length || !pantryTokens.size) return false;
  return selectedTokens.every((token) => pantryTokens.has(token));
}

function normalizeRecipeDocument(rawRecipe, index) {
  const keyMap = toNormalizedKeyMap(rawRecipe);
  const title = String(rawRecipe?.Recipe || rawRecipe?.recipe || rawRecipe?.title || keyMap.recipe || "").trim();
  const id =
    String(rawRecipe?.id || rawRecipe?._id || "").trim() || `recipe-${index + 1}`;

  return {
    id,
    title,
    ingredients: splitField(
      rawRecipe?.Ingredients ||
        rawRecipe?.ingredients ||
        keyMap.ingredients
    ),
    pantryIngredients: splitField(
      rawRecipe?.["Ingredient(s) at The Pantry"] ||
        rawRecipe?.["ingredient(s) at the pantry"] ||
        rawRecipe?.pantryIngredients ||
        keyMap.ingredientsatthepantry ||
        keyMap.ingredientspantry
    ),
    instructions: splitField(
      rawRecipe?.Preparation ||
        rawRecipe?.preparation ||
        rawRecipe?.instructions ||
        keyMap.preparation
    ),
  };
}

async function startServer() {
  await client.connect();
  console.log("Connected to MongoDB");

  const db = client.db("recipe_food"); // YOUR database
  const recipes = db.collection("recipes"); // YOUR collection
  const recipeCount = await recipes.countDocuments();
  console.log(`Loaded ${recipeCount} recipes from recipe_food.recipes`);
  const sample = await recipes.findOne({});
  if (sample) {
    console.log("Sample recipe keys:", Object.keys(sample));
  }

  // GET all recipes in normalized shape
  app.get("/recipes", async (req, res) => {
    try {
      const data = await recipes.find({}).toArray();
      const normalized = data
        .map((recipe, index) => normalizeRecipeDocument(recipe, index))
        .filter((recipe) => recipe.title);
      res.json(normalized);
    } catch (error) {
      console.error("GET /recipes failed:", error);
      res.status(500).json({ error: "Failed to fetch recipes" });
    }
  });

  // GET normalized pantry ingredients + id for quick debug/index view
  app.get("/recipes/pantry-index", async (req, res) => {
    try {
      const data = await recipes.find({}).toArray();
      const normalized = data
        .map((recipe, index) => normalizeRecipeDocument(recipe, index))
        .filter((recipe) => recipe.title)
        .map((recipe) => ({
          id: recipe.id,
          title: recipe.title,
          pantryIngredients: recipe.pantryIngredients,
          pantryIngredientTokens: recipe.pantryIngredients.map((item) =>
            tokenizeIngredient(item)
          ),
        }));
      res.json(normalized);
    } catch (error) {
      console.error("GET /recipes/pantry-index failed:", error);
      res.status(500).json({ error: "Failed to build pantry index" });
    }
  });

  // POST search recipes by selected ingredients (backend-side matching)
  app.post("/recipes/search", async (req, res) => {
    try {
      const selectedIngredients = Array.isArray(req.body?.ingredients)
        ? req.body.ingredients
            .map((item) => String(item || "").trim())
            .filter(Boolean)
        : [];

      if (!selectedIngredients.length) {
        res.json([]);
        return;
      }

      const data = await recipes.find({}).toArray();
      const normalized = data
        .map((recipe, index) => normalizeRecipeDocument(recipe, index))
        .filter((recipe) => recipe.title);

      const matched = normalized
        .map((recipe) => {
          const matchCount = recipe.pantryIngredients.filter((pantryItem) =>
            selectedIngredients.some((selected) =>
              ingredientMatches(selected, pantryItem)
            )
          ).length;
          return { recipe, matchCount };
        })
        .filter(({ matchCount }) => matchCount >= 1)
        .sort((a, b) => b.matchCount - a.matchCount)
        .map(({ recipe }) => recipe);

      res.json(matched);
    } catch (error) {
      console.error("POST /recipes/search failed:", error);
      res.status(500).json({ error: "Failed to search recipes" });
    }
  });

  // POST new recipe
  app.post("/recipes", async (req, res) => {
    await recipes.insertOne(req.body);
    res.json({ message: "Recipe added!" });
  });

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
