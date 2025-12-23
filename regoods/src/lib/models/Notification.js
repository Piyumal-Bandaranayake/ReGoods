import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    link: {
      type: String, // e.g., /items/[id] or /account?tab=offers
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// In development, handle hot-reloading by deleting the model if it exists
if (process.env.NODE_ENV === "development") {
    delete mongoose.models.Notification;
}

export default mongoose.models.Notification || mongoose.model("Notification", NotificationSchema);
