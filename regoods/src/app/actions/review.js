"use server";

import dbConnect from "@/lib/db";
import Review from "@/lib/models/Review";
import User from "@/lib/models/User";
import Notification from "@/lib/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createReview({ sellerId, rating, comment, itemId }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return { error: "You must be logged in to leave a review." };

        if (session.user.id === sellerId) {
            return { error: "You cannot review yourself." };
        }

        await dbConnect();

        const review = await Review.create({
            sellerId,
            reviewerId: session.user.id,
            rating,
            comment,
            itemId
        });

        // Update User Rating Stats
        const reviews = await Review.find({ sellerId });
        const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
        
        await User.findByIdAndUpdate(sellerId, {
            averageRating: avg.toFixed(1),
            reviewCount: reviews.length
        });

        // Notify seller
        await Notification.create({
            recipientId: sellerId,
            senderId: session.user.id,
            type: "new_review",
            title: "New Review Received",
            content: `${session.user.name} gave you a ${rating}-star review: "${comment.substring(0, 30)}..."`,
            link: `/profile/${sellerId}?tab=reviews`
        });

        revalidatePath(`/profile/${sellerId}`);
        return { success: true };
    } catch (error) {
        console.error("Create review error:", error);
        return { error: "Failed to submit review." };
    }
}

export async function replyToReview({ reviewId, reply }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return { error: "Not logged in" };

        await dbConnect();
        const review = await Review.findById(reviewId);

        if (!review) return { error: "Review not found" };
        if (review.sellerId.toString() !== session.user.id) {
            return { error: "Only the seller can reply to this review." };
        }

        review.reply = reply;
        await review.save();

        // Notify reviewer
        await Notification.create({
            recipientId: review.reviewerId,
            senderId: session.user.id,
            type: "review_reply",
            title: "Seller replied to your review",
            content: `${session.user.name} replied to your feedback.`,
            link: `/profile/${review.sellerId}?tab=reviews`
        });

        revalidatePath(`/profile/${review.sellerId}`);
        return { success: true };
    } catch (error) {
        console.error("Reply to review error:", error);
        return { error: "Failed to submit reply." };
    }
}

export async function getSellerReviews(sellerId) {
    try {
        await dbConnect();
        const reviews = await Review.find({ sellerId })
            .populate("reviewerId", "name image")
            .sort({ createdAt: -1 });
        
        return JSON.parse(JSON.stringify(reviews));
    } catch (error) {
        console.error("Get reviews error:", error);
        return [];
    }
}

export async function getSellerRating(sellerId) {
    try {
        await dbConnect();
        const reviews = await Review.find({ sellerId });
        if (reviews.length === 0) return { average: 0, count: 0 };

        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        return {
            average: (sum / reviews.length).toFixed(1),
            count: reviews.length
        };
    } catch (error) {
        return { average: 0, count: 0 };
    }
}
