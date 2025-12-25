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
import bcrypt from "bcryptjs";
import { sendWelcomeEmail, sendBanEmail, sendUnbanEmail } from "@/lib/mail";

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

export async function getOrderStats() {
    await checkAdmin();
    await dbConnect();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const newOrders = await Offer.countDocuments({ createdAt: { $gte: startOfToday } });
    const pendingOrders = await Offer.countDocuments({ status: "Pending" });
    const onWayOrders = await Offer.countDocuments({ status: "Accepted" });
    const deliveredOrders = await Item.countDocuments({ status: "Sold" });

    return {
        newOrders,
        pendingOrders,
        onWayOrders,
        deliveredOrders
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

            // Fetch multiple interaction types
            const [newUsers, newItems, newOffers] = await Promise.all([
                User.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay }, role: "user" }),
                Item.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } }),
                Offer.countDocuments({ createdAt: { $gte: startOfDay, $lte: endOfDay } })
            ]);

            return {
                date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
                interactions: newUsers + newItems + newOffers,
                users: newUsers,
                items: newItems,
                offers: newOffers
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

export async function deleteAdminItem(itemId) {
    await checkAdmin();
    await dbConnect();
    await Item.findByIdAndDelete(itemId);
    revalidatePath("/admin/orders");
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
    
    // Filter out reports for users who are already banned
    const pendingReports = reports.filter(report => !report.reportedUserId?.isBanned);
    
    return JSON.parse(JSON.stringify(pendingReports));
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
        
        // Find the user first to check eligibility and get email
        const reportedUser = await User.findById(report.reportedUserId);
        if (!reportedUser) return { error: "Reported user not found" };

        if ((reportedUser.warningCount || 0) < 5) {
            return { error: "User must have at least 5 warnings before being banned." };
        }
        
        // Update user status
        await User.findByIdAndUpdate(report.reportedUserId, { 
            isBanned: true,
            banReason: banReason
        });

        // Send Email Notification
        try {
            await sendBanEmail({
                to: reportedUser.email,
                name: reportedUser.name,
                reason: banReason
            });
        } catch (mailError) {
            console.error("Failed to send ban email:", mailError);
        }

        // Send In-app Notification
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
                link: "/account/verify"
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

export async function getMarketActivityStats() {
    await checkAdmin();
    await dbConnect();

    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split("T")[0];
    }).reverse();

    const marketData = await Promise.all(
        last7Days.map(async (date) => {
            const startOfDay = new Date(date);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            const itemsListed = await Item.countDocuments({
                createdAt: { $gte: startOfDay, $lte: endOfDay }
            });

            const itemsSold = await Item.countDocuments({
                updatedAt: { $gte: startOfDay, $lte: endOfDay },
                status: "Sold"
            });

            return {
                name: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
                listed: itemsListed,
                sold: itemsSold
            };
        })
    );

    return marketData;
}

export async function getDetailedReport(period = "weekly") {
    await checkAdmin();
    await dbConnect();

    const now = new Date();
    let startDate = new Date();
    let days = 7;

    if (period === "weekly") {
        startDate.setDate(now.getDate() - 7);
        days = 7;
    } else if (period === "monthly") {
        startDate.setMonth(now.getMonth() - 1);
        days = 30;
    } else if (period === "yearly") {
        startDate.setFullYear(now.getFullYear() - 1);
        days = 365;
    }

    const intervals = period === "yearly" ? 12 : days;
    const reportData = [];

    for (let i = 0; i < intervals; i++) {
        const d = new Date(startDate);
        if (period === "yearly") {
            d.setMonth(startDate.getMonth() + i);
        } else {
            d.setDate(startDate.getDate() + i);
        }
        
        const start = new Date(d);
        start.setHours(0, 0, 0, 0);
        const end = new Date(d);
        if (period === "yearly") {
            end.setMonth(d.getMonth() + 1);
            end.setDate(0);
            end.setHours(23, 59, 59, 999);
        } else {
            end.setHours(23, 59, 59, 999);
        }

        const [sales, engagement, verifications] = await Promise.all([
            Item.countDocuments({ status: "Sold", updatedAt: { $gte: start, $lte: end } }),
            User.countDocuments({ role: "user", createdAt: { $gte: start, $lte: end } }),
            Verification.countDocuments({ status: "Approved", updatedAt: { $gte: start, $lte: end } })
        ]);

        reportData.push({
            date: period === "yearly" ? d.toLocaleDateString("en-US", { month: "short" }) : d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            sales,
            engagement,
            verifications
        });
    }

    return reportData;
}

export async function getAdminItems() {
    await checkAdmin();
    await dbConnect();
    const items = await Item.find({ status: { $in: ["Active", "Sold"] } })
        .populate("sellerId", "name email shadow-sm")
        .populate("buyerId", "name email")
        .sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(items));
}

export async function adminCreateUser(userData) {
    try {
        await checkAdmin();
        await dbConnect();

        const { name, email, password, role } = userData;

        if (!name || !email || !password) {
            throw new Error("Missing required fields");
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error("A user with this email already exists.");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            isVerified: false, 
            verificationStatus: "Unverified",
            requiresPasswordReset: (role === "admin") // Force new admins to reset password
        });

        // Send Welcome Email with credentials
        let emailSent = false;
        let emailError = null;
        try {
            await sendWelcomeEmail({
                to: email,
                name,
                email,
                password, // Sending raw password so they can login
                role: role || "user"
            });
            emailSent = true;
        } catch (err) {
            console.error("Failed to send welcome email:", err);
            emailError = err.message;
        }

        revalidatePath("/admin/users");
        return { 
            success: true, 
            emailSent,
            emailError: emailSent ? null : emailError
        };
    } catch (error) {
        console.error("Admin create user error:", error);
        return { error: error.message || "Failed to create user." };
    }
}

export async function getAdminNotifications() {
    try {
        await checkAdmin();
        await dbConnect();

        const [verifications, userReports, reportedMessages] = await Promise.all([
            Verification.find({ status: "Pending" }).populate("userId", "name"),
            Report.find({}).populate("reporterId", "name"),
            Message.find({ reported: true }).populate("senderId", "name")
        ]);

        const notifications = [
            ...verifications.map(v => ({
                id: v._id,
                type: "verification",
                title: "New Verification Request",
                content: `${v.userId?.name || "A user"} has submitted their identity for verification.`,
                createdAt: v.createdAt,
                link: "/admin/settings"
            })),
            ...userReports.map(r => ({
                id: r._id,
                type: "report",
                title: "User Reported",
                content: `${r.reporterId?.name || "A user"} reported a seller for: ${r.reason}.`,
                createdAt: r.createdAt,
                link: "/admin/reports"
            })),
            ...reportedMessages.map(m => ({
                id: m._id,
                type: "message_report",
                title: "Message Reported",
                content: `A message from ${m.senderId?.name || "a user"} was flagged as inappropriate.`,
                createdAt: m.createdAt,
                link: "/admin/reports?tab=messages"
            }))
        ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        return JSON.parse(JSON.stringify(notifications));
    } catch (error) {
        console.error("Failed to fetch admin notifications:", error);
        return [];
    }
}

export async function unbanUser(userId) {
    try {
        const session = await checkAdmin();
        await dbConnect();

        const user = await User.findById(userId);
        if (!user) return { error: "User not found" };

        await User.findByIdAndUpdate(userId, {
            isBanned: false,
            banReason: null
        });

        await Notification.create({
            recipientId: userId,
            senderId: session.user.id,
            type: "account_unbanned",
            title: "Access Restored!",
            content: "Your account has been reactivated. You can now log in and use our platform again.",
        });

        // Send Unban Email
        try {
            await sendUnbanEmail({
                to: user.email,
                name: user.name
            });
        } catch (mailError) {
            console.error("Failed to send unban email:", mailError);
        }

        revalidatePath("/admin/users");
        return { success: true };
    } catch (error) {
        console.error("Unban user error:", error);
        return { error: "Failed to unban user." };
    }
}
export async function clearAllAdminNotifications() {
    try {
        await checkAdmin();
        await dbConnect();

        // 1. Delete all user reports (effectively dismissing them)
        await Report.deleteMany({});

        // 2. Unflag all reported messages
        await Message.updateMany({ reported: true }, { $set: { reported: false } });

        // 3. Reject all pending verification requests with a bulk note
        await Verification.updateMany(
            { status: "Pending" },
            { 
                $set: { 
                    status: "Rejected", 
                    adminNotes: "Bulk cleared by administrator." 
                } 
            }
        );

        revalidatePath("/admin");
        revalidatePath("/admin/reports");
        revalidatePath("/admin/activity");
        return { success: true };
    } catch (error) {
        console.error("Clear notifications error:", error);
        return { error: "Failed to clear notifications." };
    }
}
