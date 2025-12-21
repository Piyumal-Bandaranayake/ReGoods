"use server";

import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { writeFile } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

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
        const filename = `user-${session.user.id}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}${path.extname(imageFile.name)}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        
        await writeFile(path.join(uploadDir, filename), buffer);
        imageUrl = `/uploads/${filename}`;
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
