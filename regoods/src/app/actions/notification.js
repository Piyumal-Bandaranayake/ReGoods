"use server";

import dbConnect from "@/lib/db";
import Notification from "@/lib/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Not logged in" };

    await dbConnect();
    const notifications = await Notification.find({ recipientId: session.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return JSON.parse(JSON.stringify(notifications));
  } catch (error) {
    console.error("Get notifications error:", error);
    return { error: "Failed to fetch notifications" };
  }
}

export async function markAsRead(notificationId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Not logged in" };

    await dbConnect();
    await Notification.findOneAndUpdate(
      { _id: notificationId, recipientId: session.user.id },
      { read: true }
    );

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Mark as read error:", error);
    return { error: "Failed to update notification" };
  }
}

export async function markAllAsRead() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Not logged in" };

    await dbConnect();
    await Notification.updateMany(
      { recipientId: session.user.id, read: false },
      { $set: { read: true } }
    );

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Mark all as read error:", error);
    return { error: "Failed to update notifications" };
  }
}

export async function deleteNotification(notificationId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Not logged in" };

    await dbConnect();
    await Notification.findOneAndDelete({
      _id: notificationId,
      recipientId: session.user.id
    });

    revalidatePath("/notifications");
    return { success: true };
  } catch (error) {
    console.error("Delete notification error:", error);
    return { error: "Failed to delete notification" };
  }
}

export async function createNotification({ recipientId, senderId, type, title, content, link }) {
    // This is internal helper meant to be called from other server actions
    try {
        await dbConnect();
        const notification = await Notification.create({
            recipientId,
            senderId,
            type,
            title,
            content,
            link
        });
        return { success: true, notification };
    } catch (error) {
        console.error("Create internal notification error:", error);
        return { error: "Failed to create notification" };
    }
}
