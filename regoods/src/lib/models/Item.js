import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema(
  {
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a title"],
      maxlength: 100,
    },
    description: {
      type: String,
      required: [true, "Please provide a description"],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price"],
      min: 0,
    },
    images: {
      type: [String], // Array of image URLs
      default: [],
    },
    status: {
      type: String,
      enum: ["Active", "Sold"], // ⚡ Critical for your "Real-time buy" logic
      default: "Active",
    },
    category: {
      type: String, // Optional, as you requested "no categories", but good to have just in case
      default: "General",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);