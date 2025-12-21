import { MessageCircle } from "lucide-react";

export default function InboxPage() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center h-full bg-white">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-serif font-bold text-gray-900 mb-2">Your Messages</h2>
            <p className="text-gray-500 max-w-sm">
                Select a conversation from the list to start chatting or view your message history.
            </p>
        </div>
    );
}
