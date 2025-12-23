"use client";

import { useState, useEffect, useRef } from "react";
import { sendMessage, getMessages } from "@/app/actions/message";
import { Send, ArrowLeft, X, Package, Image as ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatInterface({ initialMessages, receiverId, receiverName, receiverImage, currentUserId, initialContext }) {
    const [messages, setMessages] = useState(initialMessages);
    const [newMessage, setNewMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [contextItem, setContextItem] = useState(initialContext);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null);
    const scrollRef = useRef(null);
    const router = useRouter();

    useEffect(() => {
        // Pre-fill message if context exists and no messages yet
        if (initialContext && messages.length === 0) {
            setNewMessage(`Hi, I'm interested in ${initialContext.title}. Is it still available?`);
        }
    }, [initialContext, messages.length]);

    useEffect(() => {
        // Scroll to bottom on load and update
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages.length]);

    // Polling for new messages
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const latest = await getMessages(receiverId);
                if (latest) {
                    setMessages(current => {
                        const pending = current.filter(m => m.pending);
                        return [...latest, ...pending];
                    });
                }
            } catch (err) {
                console.error("Polling error", err);
            }
        }, 3000);
        return () => clearInterval(interval);
    }, [receiverId]);

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();

        const hasContent = newMessage.trim().length > 0;
        const hasImage = !!selectedImage;

        if ((!hasContent && !hasImage) || sending) return;

        setSending(true);
        const text = newMessage;
        const currentImage = selectedImage;

        const formData = new FormData();
        formData.append("receiverId", receiverId);
        formData.append("content", text);
        if (contextItem) {
            formData.append("itemId", contextItem.id);
        }
        if (currentImage) {
            formData.append("image", currentImage);
        }

        // Optimistic update
        const tempId = Date.now();
        const optimisticMsg = {
            _id: tempId,
            content: text,
            senderId: currentUserId,
            receiverId: receiverId,
            createdAt: new Date().toISOString(),
            pending: true,
            image: currentImage ? URL.createObjectURL(currentImage) : null
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage("");
        setSelectedImage(null);
        setContextItem(null);

        const result = await sendMessage(formData);

        if (result.success) {
            const updated = await getMessages(receiverId);
            if (updated) {
                setMessages(updated);
            }
            router.refresh();
        } else {
            alert(result.error || "Failed to send");
            setMessages(prev => prev.filter(m => m._id !== tempId));
            setNewMessage(text);
            setSelectedImage(currentImage); // Restore image selection
            setContextItem(contextItem);
        }

        setSending(false);
    };

    return (
        <div className="flex flex-col h-full bg-white overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100/50 flex items-center bg-white/80 backdrop-blur-xl sticky top-0 z-10 shadow-sm shadow-blue-500/5">
                <button onClick={() => router.push('/inbox')} className="mr-4 md:hidden p-2 -ml-2 hover:bg-blue-50 text-blue-500 rounded-full transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="relative group">
                    <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 overflow-hidden mr-4 flex items-center justify-center font-bold text-blue-500 transition-transform group-hover:rotate-3">
                        {receiverImage ? <img src={receiverImage} className="w-full h-full object-cover" alt={receiverName} /> : receiverName?.[0]}
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 leading-none mb-1">{receiverName}</h3>
                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Active Now</p>
                </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 bg-blue-50/5 custom-scrollbar">
                {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center animate-fade-in-up">
                        <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-4">
                            <Package className="w-8 h-8 text-blue-400" />
                        </div>
                        <p className="text-gray-400 text-sm font-medium">No messages yet.<br/>Start the conversation below.</p>
                    </div>
                )}

                {messages.map((msg, idx) => {
                    const isOwn = msg.senderId === currentUserId;
                    return (
                        <div key={msg._id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                            <div className={`group relative max-w-[80%] md:max-w-[70%] px-5 py-3 rounded-[2rem] shadow-sm transition-all hover:shadow-md ${isOwn
                                ? 'bg-blue-500 text-white rounded-tr-none shadow-blue-500/10'
                                : 'bg-white text-gray-900 border border-gray-100 rounded-tl-none'
                                }`}>
                                {msg.image && (
                                    <div className="mb-3 -mx-2 -mt-1 rounded-2xl overflow-hidden border border-white/20">
                                        <img src={msg.image} alt="attachment" className="max-w-full h-auto max-h-80 object-cover" />
                                    </div>
                                )}
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                <div className={`flex items-center mt-2 text-[10px] space-x-1 ${isOwn ? 'text-blue-100 justify-end' : 'text-gray-400'}`}>
                                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    {msg.pending && <span className="animate-pulse"> • Sending...</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="bg-white p-6 border-t border-gray-100/50">
                {/* Selected Image Banner */}
                {selectedImage && (
                    <div className="mb-4 p-3 bg-blue-50/80 backdrop-blur rounded-2xl border border-blue-100 flex items-center justify-between animate-fade-in-up">
                        <div className="flex items-center text-xs font-bold text-blue-700">
                            <div className="bg-white p-2 rounded-xl shadow-sm mr-3">
                                <ImageIcon className="w-4 h-4 text-blue-500" />
                            </div>
                            <span className="truncate max-w-[200px]">{selectedImage.name}</span>
                        </div>
                        <button onClick={() => setSelectedImage(null)} className="p-2 bg-white text-gray-400 hover:text-red-500 rounded-xl shadow-sm transition-colors">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSend} className="relative group">
                    <div className="flex gap-3 items-center bg-gray-50/50 p-2 rounded-[2rem] border border-transparent focus-within:border-blue-200 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-500/5 transition-all">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageSelect}
                            className="hidden"
                            accept="image/*"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
                            title="Attach Image"
                        >
                            <ImageIcon className="w-5 h-5" />
                        </button>

                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a secure message..."
                            className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-gray-900 placeholder:text-gray-400 font-medium"
                        />
                        
                        <button
                            type="submit"
                            disabled={sending || (!newMessage.trim() && !selectedImage)}
                            className={`
                                flex items-center justify-center p-3 rounded-full transition-all duration-300 shadow-lg
                                ${sending || (!newMessage.trim() && !selectedImage)
                                    ? 'bg-gray-100 text-gray-300 shadow-none'
                                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-blue-500/20 scale-100 hover:scale-105 active:scale-95'
                                }
                            `}
                        >
                            <Send className={`w-5 h-5 ${sending ? 'animate-pulse' : ''}`} />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
