"use server";

import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Item from "@/lib/models/Item";
import Offer from "@/lib/models/Offer";
import Message from "@/lib/models/Message";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import Report from "@/lib/models/Report";
import Notification from "@/lib/models/Notification";
import Verification from "@/lib/models/Verification";

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
    const userReportsCount = await Report.countDocuments({});
    const verificationRequestsCount = await Verification.countDocuments({ status: "Pending" });

    return {
        totalUsers,
        soldItems,
        activeItems,
        totalRevenue,
        activeReports: activeReports + userReportsCount,
        verificationRequestsCount
    };
}

export async function getEngagementStats() {
    await checkAdmin();
    await dbConnect();

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
    }).reverse();

    const engagementData = await Promise.all(
        last7Days.map(async (date) => {
            const startOfDay = new Date(date);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const count = await User.countDocuments({
                createdAt: { $gte: startOfDay, $lte: endOfDay },
                role: "user"
            });

            return {
                date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
                users: count
            };
        })
    );

    return engagementData;
}

export async function getItemStats() {
    await checkAdmin();
    await dbConnect();

    const stats = await Item.aggregate([
        {
            $group: {
                _id: "$category",
                count: { $sum: 1 }
            }
        },
        { $sort: { count: -1 } },
        { $limit: 8 } // Limit to top 8 categories to keep the chart clean
    ]);

    const colors = [
        "#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", 
        "#ef4444", "#ec4899", "#06b6d4", "#84cc16"
    ];

    return stats.map((stat, index) => ({
        name: stat._id || "Other",
        value: stat.count,
        color: colors[index % colors.length]
    }));
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

export async function getUserReports() {
    await checkAdmin();
    await dbConnect();
    const reports = await Report.find({})
        .populate("reporterId", "name email")
        .populate("reportedUserId", "name email warningCount isBanned")
        .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(reports));
}

export async function resolveUserReport(reportId, action, customReason) {
    const session = await checkAdmin();
    await dbConnect();
    
    const report = await Report.findById(reportId);
    if (!report) return { error: "Report not found" };

    if (action === "dismiss") {
        await Report.findByIdAndDelete(reportId);
    } else if (action === "ban") {
        const banReason = customReason || `Violation of platform rules: ${report.reason}`;
        
        // Update user status
        await User.findByIdAndUpdate(report.reportedUserId, { 
            isBanned: true,
            banReason: banReason
        });

        // Send Notification (They might see this weight trying to login or if they are online)
        await Notification.create({
            recipientId: report.reportedUserId,
            senderId: session.user.id,
            type: "account_banned",
            title: "Your account has been banned",
            content: `Your account has been suspended due to: ${banReason}. If you believe this is a mistake, please contact support.`,
        });

        await Report.findByIdAndDelete(reportId);
    }
    
    revalidatePath("/admin/reports");
    return { success: true };
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

export async function getVerificationRequests() {
    await checkAdmin();
    await dbConnect();
    const requests = await Verification.find({ status: "Pending" })
        .populate("userId", "name email")
        .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(requests));
}

export async function resolveVerification(requestId, action, adminNotes) {
    try {
        const session = await checkAdmin();
        await dbConnect();

        const request = await Verification.findById(requestId);
        if (!request) return { error: "Verification request not found" };

        const targetUserId = request.userId.toString();

        if (action === "approve") {
            await Verification.findByIdAndUpdate(requestId, { status: "Approved", adminNotes });
            await User.findByIdAndUpdate(targetUserId, { 
                isVerified: true, 
                verificationStatus: "Verified" 
            });

            await Notification.create({
                recipientId: targetUserId,
                senderId: session.user.id,
                type: "account_verified",
                title: "Verification Approved!",
                content: "Congratulations! Your account has been verified. You now have a blue badge on your profile.",
                link: `/profile/${targetUserId}`
            });
        } else if (action === "reject") {
            await Verification.findByIdAndUpdate(requestId, { status: "Rejected", adminNotes });
            await User.findByIdAndUpdate(targetUserId, { 
                isVerified: false, 
                verificationStatus: "Rejected" 
            });

            await Notification.create({
                recipientId: targetUserId,
                senderId: session.user.id,
                type: "verification_rejected",
                title: "Verification Rejected",
                content: `Your verification request was rejected. ${adminNotes ? `Reason: ${adminNotes}` : "Please ensure your NIC images are clear and valid."}`,
            });
        }

        revalidatePath("/admin/verification");
        revalidatePath(`/profile/${targetUserId}`);
        return { success: true };
    } catch (error) {
        console.error("Resolve verification error:", error);
        return { error: error.message || "Failed to resolve verification request." };
    }
}
