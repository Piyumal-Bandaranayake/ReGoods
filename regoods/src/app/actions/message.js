"use server";

import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import dbConnect from "@/lib/db";
import Message from "@/lib/models/Message";
import User from "@/lib/models/User";
import Item from "@/lib/models/Item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Send a new message
export async function sendMessage(formData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Not logged in" };

    const receiverId = formData.get("receiverId");
    const content = formData.get("content");
    const itemId = formData.get("itemId");
    const imageFile = formData.get("image");

    if (!receiverId || (!content && !imageFile)) {
      return { error: "Message cannot be empty" };
    }

    await dbConnect();
    
    if (receiverId === session.user.id) {
         return { error: "You cannot message yourself" };
    }

    let imagePath = null;
    if (imageFile && imageFile.size > 0) {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = imageFile.name.split('.').pop() || "jpg";
        const filename = `msg-${uniqueSuffix}.${ext}`;
        const uploadDir = join(process.cwd(), "public", "uploads", "messages");
        await mkdir(uploadDir, { recursive: true });
        await writeFile(join(uploadDir, filename), buffer);
        imagePath = `/uploads/messages/${filename}`;
    }

    await Message.create({
      senderId: session.user.id,
      receiverId,
      content: content || "",
      image: imagePath,
      itemId: itemId || null,
      read: false,
    });

    revalidatePath(`/inbox/${receiverId}`);
    revalidatePath("/inbox");

    return { success: true };
  } catch (error) {
    console.error("Send message error:", error);
    return { error: "Failed to send message" };
  }
}

// Get all conversations (unique users)
export async function getConversations() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return [];

    await dbConnect();

    // Find all messages where current user is sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: session.user.id }, { receiverId: session.user.id }],
    })
    .sort({ createdAt: -1 })
    .populate("senderId", "name image")
    .populate("receiverId", "name image");

    // Map to unique conversations
    const conversationMap = new Map();

    messages.forEach((msg) => {
      const isSender = msg.senderId._id.toString() === session.user.id;
      const otherUser = isSender ? msg.receiverId : msg.senderId;
      
      // Safety check if user was deleted
      if (!otherUser) return;

      const otherUserId = otherUser._id.toString();

      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, {
          user: {
            id: otherUserId,
            name: otherUser.name,
            image: otherUser.image
          },
          lastMessage: {
            content: msg.content,
            createdAt: msg.createdAt,
            isOwn: isSender,
            read: msg.read
          }
        });
      }
    });

    return Array.from(conversationMap.values());
  } catch (error) {
    console.error("Get conversations error:", error);
    return [];
  }
}

// Get messages with a specific user
export async function getMessages(otherUserId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return [];

    await dbConnect();

    // Mark as read
    await Message.updateMany(
        { senderId: otherUserId, receiverId: session.user.id, read: false },
        { $set: { read: true } }
    );

    const messages = await Message.find({
      $or: [
        { senderId: session.user.id, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: session.user.id },
      ],
    })
    .sort({ createdAt: 1 }); // Oldest first for chat view

    // Serialize
    return JSON.parse(JSON.stringify(messages));
  } catch (error) {
    console.error("Get messages error:", error);
    return [];
  }
}
