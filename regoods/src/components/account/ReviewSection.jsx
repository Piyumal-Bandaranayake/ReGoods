"use client";

import { useState } from "react";
import { Star, MessageCircle, Send, CheckCircle } from "lucide-react";
import { createReview, replyToReview } from "@/app/actions/review";

export default function ReviewSection({ sellerId, reviews, currentUserId }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState("");

    const isSeller = currentUserId === sellerId;

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setLoading(true);
        const res = await createReview({ sellerId, rating, comment });
        if (res.success) {
            setComment("");
            setRating(5);
        } else {
            alert(res.error);
        }
        setLoading(false);
    };

    const handleReply = async (reviewId) => {
        if (!replyText.trim()) return;
        setLoading(true);
        const res = await replyToReview({ reviewId, reply: replyText });
        if (res.success) {
            setReplyText("");
            setReplyingTo(null);
        } else {
            alert(res.error);
        }
        setLoading(false);
    };

    return (
        <div className="space-y-8">
            {/* Review Form (Only for non-sellers) */}
            {!isSeller && currentUserId && (
                <div className="bg-white p-6 border border-gray-200 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">Write a Review</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div className="flex items-center space-x-2">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setRating(s)}
                                    className={`focus:outline-none transition-transform hover:scale-110 ${s <= rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                >
                                    <Star className={`w-8 h-8 ${s <= rating ? 'fill-current' : ''}`} />
                                </button>
                            ))}
                        </div>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Share your experience with this seller..."
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-black min-h-[120px] text-sm"
                        />
                        <button
                            disabled={loading || !comment.trim()}
                            type="submit"
                            className="px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition"
                        >
                            {loading ? "Posting..." : "Post Review"}
                        </button>
                    </form>
                </div>
            )}

            {/* List of Reviews */}
            <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 font-serif">Customer Feedback ({reviews.length})</h3>
                {reviews.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                        {reviews.map((review) => (
                            <div key={review._id} className="py-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                                            {review.reviewerId?.image ? (
                                                <img src={review.reviewerId.image} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-bold text-gray-400">
                                                    {review.reviewerId?.name?.[0].toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-bold text-gray-900">{review.reviewerId?.name}</div>
                                            <div className="flex items-center mt-0.5">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
                                                ))}
                                                <span className="ml-2 text-[10px] text-gray-400 uppercase font-bold tracking-tighter">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                                    {review.comment}
                                </p>

                                {/* Seller Reply */}
                                {review.reply ? (
                                    <div className="ml-8 mt-4 p-4 bg-gray-50 border-l-2 border-black">
                                        <div className="flex items-center text-xs font-bold text-gray-900 uppercase tracking-widest mb-2">
                                            <MessageCircle className="w-3 h-3 mr-2" />
                                            Seller's Response
                                        </div>
                                        <p className="text-gray-600 text-sm italic">
                                            "{review.reply}"
                                        </p>
                                    </div>
                                ) : isSeller && (
                                    <div className="ml-8 mt-2">
                                        {replyingTo === review._id ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Write your response..."
                                                    className="w-full p-3 bg-white border border-gray-200 rounded-md focus:outline-none text-sm min-h-[80px]"
                                                />
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleReply(review._id)}
                                                        disabled={loading || !replyText.trim()}
                                                        className="px-4 py-2 bg-black text-white text-[10px] font-bold uppercase tracking-widest hover:bg-gray-800 transition"
                                                    >
                                                        Submit Reply
                                                    </button>
                                                    <button
                                                        onClick={() => setReplyingTo(null)}
                                                        className="px-4 py-2 border border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setReplyingTo(review._id)}
                                                className="text-[10px] font-bold text-black uppercase tracking-widest flex items-center hover:opacity-70 transition"
                                            >
                                                <Send className="w-3 h-3 mr-2 rotate-45" />
                                                Reply to Review
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 border-2 border-dashed border-gray-100 text-center text-gray-400 text-sm italic">
                        The marketplace is still waiting for the first review.
                    </div>
                )}
            </div>
        </div>
    );
}
