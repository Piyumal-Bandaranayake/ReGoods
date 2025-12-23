"use server";

import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Item from "@/lib/models/Item";
import Offer from "@/lib/models/Offer";
import Message from "@/lib/models/Message";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

// Middleware-like check for admin
async function checkAdmin() {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
        throw new Error("Unauthorized");
    }
    return session;
}

export async function getAdminStats() {
    await checkAdmin();
    await dbConnect();

    const totalUsers = await User.countDocuments({ role: "user" });
    const soldItems = await Item.countDocuments({ status: "Sold" });
    const activeItems = await Item.countDocuments({ status: "Active" });
    
    // Calculate total revenue from sold items
    const soldItemsData = await Item.find({ status: "Sold" }).select("price");
    const totalRevenue = soldItemsData.reduce((acc, item) => acc + (item.price || 0), 0);

    const activeReports = await Message.countDocuments({ reported: true });

    return {
        totalUsers,
        soldItems,
        activeItems,
        totalRevenue,
        activeReports
    };
}

export async function getUsers() {
    await checkAdmin();
    await dbConnect();
    // Return all users, excluding the admin themselves ideally, or just all
    const users = await User.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(users));
}

export async function deleteUser(userId) {
    await checkAdmin();
    await dbConnect();
    await User.findByIdAndDelete(userId);
    // Also cleanup their items? optional for now
    revalidatePath("/admin/users");
    return { success: true };
}

export async function getSoldItems() {
    await checkAdmin();
    await dbConnect();
    const items = await Item.find({ status: "Sold" })
        .populate("sellerId", "name email")
        .populate("buyerId", "name email")
        .sort({ updatedAt: -1 });
    return JSON.parse(JSON.stringify(items));
}

export async function getRecentOffers() {
    await checkAdmin();
    await dbConnect();
    const offers = await Offer.find({})
        .populate("itemId", "title price")
        .populate("buyerId", "name email")
        .populate("sellerId", "name email")
        .sort({ createdAt: -1 })
        .limit(50);
    return JSON.parse(JSON.stringify(offers));
}

export async function getReportedMessages() {
    await checkAdmin();
    await dbConnect();
    const messages = await Message.find({ reported: true })
        .populate("senderId", "name email")
        .populate("receiverId", "name email")
        .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(messages));
}

export async function resolveReport(messageId, action) {
    await checkAdmin();
    await dbConnect();
    
    if (action === "dismiss") {
        await Message.findByIdAndUpdate(messageId, { reported: false });
    } else if (action === "delete") {
        await Message.findByIdAndDelete(messageId);
    }
    
    revalidatePath("/admin/reports");
    return { success: true };
}
