import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getConversations } from "@/app/actions/message";
import InboxLayoutClient from "./InboxLayoutClient";

export default async function InboxLayout({ children }) {
    const session = await getServerSession(authOptions);

    // Fetch conversations securely
    const conversations = session ? await getConversations() : [];

    return (
        <InboxLayoutClient conversations={conversations}>
            {children}
        </InboxLayoutClient>
    );
}
