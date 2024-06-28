import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  savedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Recipe" }],
}, { timestamps: true }); // Automatically add createdAt and updatedAt fields

export const UserModel = mongoose.model("users", UserSchema);
