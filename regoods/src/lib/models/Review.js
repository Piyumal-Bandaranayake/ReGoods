import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
    {
        sellerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        reviewerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Item",
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        comment: {
            type: String,
            required: true,
            maxlength: 500,
        },
        reply: {
            type: String,
            maxlength: 500,
        },
    },
    { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema);
