import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getMessages } from "@/app/actions/message";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Item from "@/lib/models/Item";
import ChatInterface from "@/components/chat/ChatInterface";
import { notFound, redirect } from "next/navigation";

export default async function ConversationPage({ params, searchParams }) {
    const { id: otherUserId } = await params;
    const session = await getServerSession(authOptions);

    if (!session) redirect("/auth/login");
    if (session.user.id === otherUserId) redirect("/inbox"); // Cannot chat with self

    await dbConnect();
    const otherUser = await User.findById(otherUserId).select("name image");
    if (!otherUser) notFound();

    // Fetch Item Context if present
    const { itemId } = await searchParams || {};
    let itemContext = null;
    if (itemId) {
        const item = await Item.findById(itemId).select("title price images");
        if (item) {
            itemContext = {
                id: item._id.toString(),
                title: item.title,
                price: item.price,
                image: item.images?.[0]
            };
        }
    }

    const messages = await getMessages(otherUserId);

    return (
        <ChatInterface
            initialMessages={messages}
            receiverId={otherUserId}
            receiverName={otherUser.name}
            receiverImage={otherUser.image}
            currentUserId={session.user.id}
            initialContext={itemContext}
        />
    );
}
