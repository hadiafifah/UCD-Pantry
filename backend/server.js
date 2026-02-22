require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGO_DB);

async function startServer() {
  await client.connect();
  console.log("Connected to MongoDB");

  const db = client.db("recipe_food"); // YOUR database
  const recipes = db.collection("recipes"); // YOUR collection

  // GET all recipes
  app.get("/recipes", async (req, res) => {
    const data = await recipes.find({}).toArray();
    res.json(data);
  });

  // POST new recipe
  app.post("/recipes", async (req, res) => {
    await recipes.insertOne(req.body);
    res.json({ message: "Recipe added!" });
  });

  app.listen(5000, () => {
    console.log("Server running on port 5000");
  });
}

startServer();