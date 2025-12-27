import mongoose from "mongoose";

// Declare the Schema of the Mongo model
const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    expiry: {
      type: Date,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Export the model (ES Module)
const Coupon = mongoose.model("Coupon", couponSchema);

export default Coupon;
