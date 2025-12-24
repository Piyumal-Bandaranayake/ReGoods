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
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm animate-fade-in-up">
                    <h3 className="text-xl font-bold text-gray-950 mb-6 font-serif">Rate your experience</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Overall Rating</label>
                            <div className="flex items-center space-x-3">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        className={`focus:outline-none transition-all duration-300 transform hover:scale-125 ${s <= rating ? 'text-yellow-400' : 'text-gray-100'}`}
                                    >
                                        <Star className={`w-8 h-8 ${s <= rating ? 'fill-current' : ''}`} strokeWidth={1} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Your Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What was it like buying from this seller?"
                                className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/5 focus:border-blue-500/20 min-h-[140px] text-sm transition-all"
                            />
                        </div>

                        <button
                            disabled={loading || !comment.trim()}
                            type="submit"
                            className="w-full py-4 bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
                        >
                            {loading ? "Publishing..." : "Publish Review"}
                        </button>
                    </form>
                </div>
            )}

            {/* List of Reviews */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-950 font-serif">Customer Feedback</h3>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">{reviews.length} Reviews</span>
                </div>
                
                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 gap-6">
                        {reviews.map((review) => (
                            <div key={review._id} className="bg-white p-6 md:p-8 rounded-3xl border border-gray-100 hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="flex items-center">
                                        <div className="h-12 w-12 rounded-full border-2 border-white shadow-sm overflow-hidden flex-shrink-0 bg-gray-100">
                                            {review.reviewerId?.image ? (
                                                <img src={review.reviewerId.image} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-serif italic text-gray-400">
                                                    {review.reviewerId?.name?.[0].toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-4">
                                            <div className="font-bold text-gray-950 flex items-center">
                                                {review.reviewerId?.name}
                                                <CheckCircle className="w-3 h-3 ml-2 text-green-500" title="Verified Purchase" />
                                            </div>
                                            <div className="flex items-center mt-1">
                                                <div className="flex items-center mr-3">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-100'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <blockquote className="mt-6 text-gray-700 text-sm leading-relaxed font-medium italic relative">
                                    <span className="absolute -left-2 -top-2 text-4xl text-gray-100 font-serif">"</span>
                                    {review.comment}
                                </blockquote>

                                {/* Seller Reply */}
                                {review.reply ? (
                                    <div className="mt-4 bg-blue-50 border border-blue-100 p-4 rounded-xl relative">
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                                            <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Seller Response</span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">{review.reply.comment}</p>
                                    </div>
                                ) : isSeller && (
                                    <div className="mt-6 pt-4 border-t border-gray-50">
                                        {replyingTo === review._id ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Type your response here..."
                                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/5 min-h-[100px] text-sm"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleReply(review._id)}
                                                        disabled={loading || !replyText.trim()}
                                                        className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition"
                                                    >
                                                        Reply
                                                    </button>
                                                    <button
                                                        onClick={() => setReplyingTo(null)}
                                                        className="px-6 py-2 bg-white border border-gray-200 text-gray-500 text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-gray-50 transition"
                                                    >
                                                        Discard
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setReplyingTo(review._id)}
                                                className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest flex items-center hover:text-blue-500 transition"
                                            >
                                                <Send className="w-3 h-3 mr-2 rotate-45" />
                                                Reply to this review
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 bg-white rounded-3xl border border-dashed border-gray-100 text-center flex flex-col items-center">
                        <Star className="w-12 h-12 text-gray-50 mb-4" />
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">No reviews to display yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
