"use server";

import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import Item from "@/lib/models/Item";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import Report from "@/lib/models/Report";
import Notification from "@/lib/models/Notification";
import Verification from "@/lib/models/Verification";
import { redirect } from "next/navigation";

export async function getCurrentUserStatus() {
    const session = await getServerSession(authOptions);
    if (!session) return null;

    await dbConnect();
    const user = await User.findById(session.user.id).select("verificationStatus isVerified _id");
    return JSON.parse(JSON.stringify(user));
}

export async function updateProfile(formData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: "You must be logged in to update your profile." };
    }

    const name = formData.get("name");
    const nationality = formData.get("nationality");
    const bio = formData.get("bio");
    const phone = formData.get("phone");
    
    // Handle Image
    const imageFile = formData.get("image");
    let imageUrl = null;

    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
        const buffer = Buffer.from(await imageFile.arrayBuffer());
        imageUrl = await uploadToCloudinary(buffer, "profiles");
    }

    await dbConnect();

    const updateData = {
        name,
        nationality,
        bio,
        phone
    };

    if (imageUrl) {
        updateData.image = imageUrl;
    }

    await User.findByIdAndUpdate(session.user.id, updateData);

    revalidatePath("/account");
    revalidatePath(`/profile/${session.user.id}`);
    
    return { success: true };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Failed to update profile. Please try again." };
  }
}

export async function toggleWishlist(itemId) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return { error: "Not logged in" };

        await dbConnect();
        const user = await User.findById(session.user.id);
        const isWishlisted = user.wishlist.includes(itemId);

        if (isWishlisted) {
            await User.findByIdAndUpdate(session.user.id, { $pull: { wishlist: itemId } });
        } else {
            await User.findByIdAndUpdate(session.user.id, { $addToSet: { wishlist: itemId } });
        }

        revalidatePath(`/items/${itemId}`);
        return { success: true, isWishlisted: !isWishlisted };
    } catch (error) {
        console.error("Wishlist error:", error);
        return { error: "Failed to update wishlist" };
    }
}

export async function toggleCart(itemId) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return { error: "Not logged in" };

        await dbConnect();
        const user = await User.findById(session.user.id);
        const isInCart = user.cart.includes(itemId);

        if (isInCart) {
            await User.findByIdAndUpdate(session.user.id, { $pull: { cart: itemId } });
        } else {
            await User.findByIdAndUpdate(session.user.id, { $addToSet: { cart: itemId } });
        }

        revalidatePath(`/items/${itemId}`);
        return { success: true, isInCart: !isInCart };
    } catch (error) {
        console.error("Cart error:", error);
        return { error: "Failed to update cart" };
    }
}

export async function getUserInteractions() {
    const session = await getServerSession(authOptions);
    if (!session) return { wishlist: [], cart: [] };
    
    await dbConnect();
    const user = await User.findById(session.user.id).select("wishlist cart");
    if (!user) return { wishlist: [], cart: [] }; 

    return { 
        wishlist: (user.wishlist || []).map(id => id.toString()), 
        cart: (user.cart || []).map(id => id.toString()) 
    };
}

export async function getWishlistItems() {
    const session = await getServerSession(authOptions);
    if (!session) return { wishlist: [] };

    await dbConnect();
    const user = await User.findById(session.user.id).populate({
        path: 'wishlist',
        model: Item,
        select: 'title price images slug _id' // Select fields needed for dropdown
    });

    if (!user) return { wishlist: [] };

    // Filter out nulls if items were deleted
    const items = user.wishlist.filter(item => item !== null);

    return { 
        wishlist: JSON.parse(JSON.stringify(items))
    };
}

export async function getCartItems() {
    const session = await getServerSession(authOptions);
    if (!session) return { cart: [] };

    await dbConnect();
    const user = await User.findById(session.user.id).populate({
        path: 'cart',
        model: Item,
        select: 'title price images slug _id status sellerId'
    });

    if (!user) return { cart: [] };

    const items = user.cart.filter(item => item !== null);

    return { 
        cart: JSON.parse(JSON.stringify(items))
    };
}

export async function reportUser(formData) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return { error: "You must be logged in to report a seller." };

        const reportedUserId = formData.get("reportedUserId");
        const reason = formData.get("reason");
        const description = formData.get("description");
        const rawImages = formData.getAll("images");

        if (session.user.id === reportedUserId) {
            return { error: "You cannot report yourself." };
        }

        if (!reason || !description) {
            return { error: "Please provide a reason and description for your report." };
        }

        await dbConnect();
        
        // Handle Proof Images
        const imageUrls = [];
        for (const file of rawImages) {
            if (file instanceof File && file.size > 0) {
                const buffer = Buffer.from(await file.arrayBuffer());
                const imageUrl = await uploadToCloudinary(buffer, "reports");
                imageUrls.push(imageUrl);
            }
        }

        // Create Report Document
        await Report.create({
            reporterId: session.user.id,
            reportedUserId,
            reason,
            description,
            images: imageUrls
        });

        // Find the user to increment warning count
        const userToReport = await User.findById(reportedUserId);
        if (userToReport) {
            const newWarningCount = (userToReport.warningCount || 0) + 1;
            await User.findByIdAndUpdate(reportedUserId, { warningCount: newWarningCount });
        }

        revalidatePath(`/profile/${reportedUserId}`);
        return { success: true, message: "Seller has been reported successfully. Our team will review the case." };
    } catch (error) {
        console.error("Report user error:", error);
        return { error: "Failed to report seller. Please try again." };
    }
}

export async function submitVerification(formData) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return { error: "Not logged in" };

        const fullName = formData.get("fullName");
        const nicNumber = formData.get("nicNumber");
        const nicFront = formData.get("nicFront");
        const nicBack = formData.get("nicBack");

        if (!fullName || !nicNumber || !nicFront || !nicBack) {
            return { error: "Please fill in all fields and upload both NIC sides." };
        }

        await dbConnect();

        // Check if already pending or verified
        const existing = await Verification.findOne({ userId: session.user.id });
        if (existing && existing.status === 'Pending') {
            return { error: "You already have a verification request pending." };
        }

        let frontUrl = "";
        let backUrl = "";

        if (nicFront instanceof File && nicFront.size > 0) {
            const buffer = Buffer.from(await nicFront.arrayBuffer());
            frontUrl = await uploadToCloudinary(buffer, "verification");
        }

        if (nicBack instanceof File && nicBack.size > 0) {
            const buffer = Buffer.from(await nicBack.arrayBuffer());
            backUrl = await uploadToCloudinary(buffer, "verification");
        }

        if (existing) {
            await Verification.findByIdAndUpdate(existing._id, {
                fullName,
                nicNumber,
                nicFront: frontUrl,
                nicBack: backUrl,
                status: "Pending"
            });
        } else {
            await Verification.create({
                userId: session.user.id,
                fullName,
                nicNumber,
                nicFront: frontUrl,
                nicBack: backUrl,
                status: "Pending"
            });
        }

        await User.findByIdAndUpdate(session.user.id, { verificationStatus: "Pending" });

        revalidatePath(`/profile/${session.user.id}`);
        return { success: true, message: "Verification request submitted successfully!" };
    } catch (error) {
        console.error("Verification error:", error);
        return { error: "Failed to submit verification." };
    }
}
