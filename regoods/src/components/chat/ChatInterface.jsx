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
        <div className="flex flex-col h-[calc(100vh-100px)] max-h-[800px] bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center bg-white sticky top-0 z-10">
                <button onClick={() => router.push('/inbox')} className="mr-4 lg:hidden p-2 -ml-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="h-10 w-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden mr-3 flex items-center justify-center font-bold text-gray-500">
                    {receiverImage ? <img src={receiverImage} className="w-full h-full object-cover" /> : receiverName?.[0]}
                </div>
                <div>
                    <h3 className="font-bold text-gray-900">{receiverName}</h3>
                    <p className="text-xs text-green-600 font-medium">Online on ReGoods</p>
                </div>
            </div>

            {/* Messages Area */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-10">
                        Say hello to start the conversation!
                    </div>
                )}

                {messages.map((msg, idx) => {
                    const isOwn = msg.senderId === currentUserId;
                    return (
                        <div key={msg._id || idx} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm ${isOwn
                                ? 'bg-blue-900 text-white rounded-tr-none'
                                : 'bg-white text-gray-900 border border-gray-200 rounded-tl-none shadow-sm'
                                }`}>
                                {msg.image && (
                                    <div className="mb-2 -mx-2 -mt-2 rounded-t-xl overflow-hidden">
                                        <img src={msg.image} alt="attachment" className="max-w-full h-auto max-h-60 object-cover" />
                                    </div>
                                )}
                                <p>{msg.content}</p>
                                <p className={`text-[10px] mt-1 text-right ${isOwn ? 'text-gray-400' : 'text-gray-400'}`}>
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    {msg.pending && " • ..."}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-100">


                {/* Selected Image Banner */}
                {selectedImage && (
                    <div className="px-4 py-2 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                        <div className="flex items-center text-sm font-medium text-gray-700">
                            <span className="bg-gray-200 p-1 rounded mr-2">
                                <ImageIcon className="w-4 h-4" />
                            </span>
                            Image attached: <span className="font-bold ml-1 truncate max-w-[200px]">{selectedImage.name}</span>
                        </div>
                        <button onClick={() => setSelectedImage(null)} className="text-gray-400 hover:text-black">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                )}

                <form onSubmit={handleSend} className="p-4">
                    <div className="flex gap-2 items-end">
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
                            className="p-3 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition"
                            title="Attach Image"
                        >
                            <ImageIcon className="w-5 h-5" />
                        </button>

                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 rounded-full border-gray-200 focus:ring-black focus:border-black text-sm px-4 py-3 bg-gray-50 text-gray-900 placeholder:text-gray-500"
                        />
                        <button
                            type="submit"
                            disabled={sending || (!newMessage.trim() && !selectedImage)}
                            className="bg-blue-900 text-white p-3 rounded-full hover:bg-black disabled:opacity-50 transition shadow-lg shadow-blue-900/20"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
