import express from "express";
import mongoose from "mongoose";
import { RecipesModel } from "../models/Recipes.js"; // Ensure the model is imported correctly
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./user.js";

const router = express.Router();

// Get all recipes
router.get("/", async (req, res) => {
  try {
    const result = await RecipesModel.find({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new recipe
router.post("/", verifyToken, async (req, res) => {
  const recipe = new RecipesModel({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    ingredients: req.body.ingredients,
    instructions: req.body.instructions,
    imageUrl: req.body.imageUrl,
    cookingTime: req.body.cookingTime,
    userOwner: req.body.userOwner,
  });

  try {
    const result = await recipe.save();
    res.status(201).json({
      createdRecipe: {
        name: result.name,
        ingredients: result.ingredients,
        instructions: result.instructions,
        _id: result._id,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a recipe by ID
router.get("/:recipeId", async (req, res) => {
  try {
    const result = await RecipesModel.findById(req.params.recipeId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Save a recipe
router.put("/", verifyToken, async (req, res) => {
  const recipe = await RecipesModel.findById(req.body.recipeID);
  const user = await UserModel.findById(req.body.userID);
  try {
    user.savedRecipes.push(recipe);
    await user.save();
    res.status(201).json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get IDs of saved recipes
router.get("/savedRecipes/ids/:userId", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    res.status(201).json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get saved recipes
router.get("/savedRecipes/:userId", verifyToken, async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    const savedRecipes = await RecipesModel.find({
      _id: { $in: user.savedRecipes },
    });

    console.log(savedRecipes);
    res.status(201).json({ savedRecipes });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Get recipes created by user
router.get("/user/:userID", verifyToken, async (req, res) => {
  const { userID } = req.params;
  try {
    const recipes = await RecipesModel.find({ userOwner: userID });
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export { router as recipesRouter };
