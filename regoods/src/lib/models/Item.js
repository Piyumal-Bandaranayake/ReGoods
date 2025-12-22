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
      type: String, 
      default: "General",
    },
    condition: {
      type: String,
      enum: ["New", "Like New", "Good", "Fair", "Poor"],
    },
    location: {
      type: String,
    },
    delivery: {
      type: String,
      enum: ["Meet-up", "Courier", "Meet-up / Courier"],
    },
    negotiable: {
      type: Boolean,
      default: false,
    },
    returnPolicy: {
      type: String,
      default: "No Returns",
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
    },
    deliveryDetails: {
      fullName: String,
      email: String,
      address: String,
      city: String,
      postalCode: String,
      phone: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Item || mongoose.model("Item", ItemSchema);