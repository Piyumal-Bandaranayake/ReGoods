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
        <div className="space-y-6">
            {/* Review Form (Only for non-sellers) */}
            {!isSeller && currentUserId && (
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-fade-in-up">
                    <h3 className="text-lg font-bold text-gray-950 mb-4 font-serif">Rate your experience</h3>
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Overall Rating</label>
                            <div className="flex items-center space-x-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setRating(s)}
                                        className={`focus:outline-none transition-all duration-300 transform hover:scale-110 ${s <= rating ? 'text-yellow-400' : 'text-gray-100'}`}
                                    >
                                        <Star className={`w-6 h-6 ${s <= rating ? 'fill-current' : ''}`} strokeWidth={1.5} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Your Comment</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="What was it like buying from this seller?"
                                className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/5 focus:border-blue-500/20 min-h-[100px] text-xs transition-all"
                            />
                        </div>

                        <button
                            disabled={loading || !comment.trim()}
                            type="submit"
                            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg transition shadow-md disabled:opacity-50"
                        >
                            {loading ? "Publishing..." : "Publish Review"}
                        </button>
                    </form>
                </div>
            )}

            {/* List of Reviews */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="text-lg font-bold text-gray-950 font-serif">Customer Feedback</h3>
                    <span className="bg-gray-50 text-gray-400 px-2 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-gray-100">{reviews.length} Reviews</span>
                </div>
                
                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {reviews.map((review) => (
                            <div key={review._id} className="bg-white p-5 md:p-6 rounded-2xl border border-gray-50 hover:border-gray-100 transition-colors">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                                    <div className="flex items-center">
                                        <div className="h-10 w-10 rounded-full border border-gray-100 shadow-sm overflow-hidden flex-shrink-0 bg-gray-50">
                                            {review.reviewerId?.image ? (
                                                <img src={review.reviewerId.image} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-serif italic text-gray-400 text-sm">
                                                    {review.reviewerId?.name?.[0].toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-bold text-gray-900 flex items-center">
                                                {review.reviewerId?.name}
                                                <CheckCircle className="w-3 h-3 ml-1.5 text-blue-400" />
                                            </div>
                                            <div className="flex items-center mt-0.5">
                                                <div className="flex items-center mr-2">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <Star key={s} className={`w-2.5 h-2.5 ${s <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-100'}`} />
                                                    ))}
                                                </div>
                                                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">
                                                    {new Date(review.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <blockquote className="mt-4 text-gray-600 text-[13px] leading-relaxed font-medium pl-1">
                                    {review.comment}
                                </blockquote>

                                {/* Seller Reply */}
                                {review.reply ? (
                                    <div className="mt-4 bg-gray-50/50 border border-gray-100 p-3.5 rounded-xl">
                                        <div className="flex items-center gap-2 mb-1.5">
                                            <span className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Seller Response</span>
                                        </div>
                                        <p className="text-gray-600 text-xs leading-relaxed">{review.reply.comment}</p>
                                    </div>
                                ) : isSeller && (
                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                        {replyingTo === review._id ? (
                                            <div className="space-y-2">
                                                <textarea
                                                    value={replyText}
                                                    onChange={(e) => setReplyText(e.target.value)}
                                                    placeholder="Type your response here..."
                                                    className="w-full p-3 bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/20 min-h-[80px] text-xs"
                                                />
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleReply(review._id)}
                                                        disabled={loading || !replyText.trim()}
                                                        className="px-4 py-1.5 bg-blue-500 text-white text-[9px] font-bold uppercase tracking-widest rounded-md transition"
                                                    >
                                                        Reply
                                                    </button>
                                                    <button
                                                        onClick={() => setReplyingTo(null)}
                                                        className="px-4 py-1.5 bg-white border border-gray-200 text-gray-400 text-[9px] font-bold uppercase tracking-widest rounded-md hover:bg-gray-50 transition"
                                                    >
                                                        Discard
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setReplyingTo(review._id)}
                                                className="text-[9px] font-bold text-gray-400 uppercase tracking-widest flex items-center hover:text-blue-500 transition"
                                            >
                                                <Send className="w-2.5 h-2.5 mr-1.5" />
                                                Reply
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-12 bg-white rounded-2xl border border-dashed border-gray-100 text-center flex flex-col items-center">
                        <Star className="w-8 h-8 text-gray-50 mb-3" />
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">No reviews yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
