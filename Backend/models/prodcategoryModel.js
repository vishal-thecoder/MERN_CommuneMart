import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const prodcategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model (ES Module)
const PCategory = mongoose.model("PCategory", prodcategorySchema);

export default PCategory;
