import { MessageCircle } from "lucide-react";

export default function InboxPage() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full bg-transparent animate-fade-in-up">
            <div className="w-24 h-24 bg-blue-50 rounded-[2rem] flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/10 rotate-3 transition-transform hover:rotate-0">
                <MessageCircle className="w-12 h-12 text-blue-500" />
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-900 mb-4">Your Digital Conversations</h2>
            <p className="text-gray-500 max-w-sm leading-relaxed">
                Connect with sellers and buyers effortlessly. Select a conversation from the list or start a new inquiry to get started.
            </p>
            <div className="mt-8 px-6 py-2 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-widest">
                End-to-End Secure Messaging
            </div>
        </div>
    );
}
