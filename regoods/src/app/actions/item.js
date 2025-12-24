"use server";

import dbConnect from "@/lib/db";
import Item from "@/lib/models/Item";
import User from "@/lib/models/User";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createItem(formData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: "You must be logged in to list an item." };
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user || user.verificationStatus !== "Verified") {
        return { error: "Only verified sellers can list items. Please verify your account in the profile settings." };
    }

    const title = formData.get("title");
    const description = formData.get("description");
    const price = formData.get("price");
    const category = formData.get("category");
    const condition = formData.get("condition");
    const location = formData.get("location");
    const delivery = formData.get("delivery");
    const negotiable = formData.get("negotiable") === "on";
    const returnPolicy = formData.get("returnPolicy");

    // Handle Images
    const rawImages = formData.getAll("images");
    const imageUrls = [];

    for (const item of rawImages) {
        if (item instanceof File) {
            if (item.size === 0) continue;
            const buffer = Buffer.from(await item.arrayBuffer());
            const imageUrl = await uploadToCloudinary(buffer, "items");
            imageUrls.push(imageUrl);
        } else if (typeof item === "string" && item.trim() !== "") {
            imageUrls.push(item);
        }
    }

    if (!title || !description || !price) {
      return { error: "Please fill in all required fields." };
    }

    await dbConnect();

    const newItem = await Item.create({
      sellerId: session.user.id,
      title,
      description,
      price: Number(price),
      category: category || "General",
      images: imageUrls,
      status: "Active",
      condition,
      location,
      delivery,
      negotiable,
      returnPolicy: returnPolicy || "No Returns",
    });

    revalidatePath("/dashboard");
    return { success: true, itemId: newItem._id.toString() };
  } catch (error) {
    console.error("Create item error:", error);
    return { error: "Failed to create item. Please try again." };
  }
}

export async function deleteItem(itemId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: "You must be logged in." };
    }

    await dbConnect();
    const item = await Item.findById(itemId);

    if (!item) {
      return { error: "Item not found." };
    }

    if (item.sellerId.toString() !== session.user.id) {
      return { error: "You are not authorized to delete this item." };
    }

    await Item.findByIdAndDelete(itemId);

    revalidatePath("/account");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Delete item error:", error);
    return { error: "Failed to delete item." };
  }
}

export async function updateItem(itemId, formData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Not logged in" };

    await dbConnect();
    const user = await User.findById(session.user.id);
    if (!user || user.verificationStatus !== "Verified") {
        return { error: "Only verified sellers can management listings. Please verify your account." };
    }

    const item = await Item.findById(itemId);
    if (!item) return { error: "Item not found" };
    if (item.sellerId.toString() !== session.user.id) return { error: "Unauthorized" };

    const title = formData.get("title");
    const description = formData.get("description");
    const price = formData.get("price");
    const category = formData.get("category");
    const condition = formData.get("condition");
    const location = formData.get("location");
    const delivery = formData.get("delivery");
    const negotiable = formData.get("negotiable") === "on";
    const returnPolicy = formData.get("returnPolicy");

    // Handle Images
    const rawFiles = formData.getAll("images"); // New files
    const existingImages = formData.getAll("existingImages"); // URLs of kept images
    const newImageUrls = [];

    for (const file of rawFiles) {
         if (file instanceof File && file.size > 0) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const imageUrl = await uploadToCloudinary(buffer, "items");
            newImageUrls.push(imageUrl);
         }
    }

    const finalImages = [...existingImages, ...newImageUrls];

    if (finalImages.length < 2) {
        return { error: "Please ensure at least 2 images are attached to the listing." };
    }

    item.title = title;
    item.description = description;
    item.price = Number(price);
    item.category = category;
    item.condition = condition;
    item.location = location;
    item.delivery = delivery;
    item.negotiable = negotiable;
    item.returnPolicy = returnPolicy;
    item.images = finalImages;

    await item.save();

    revalidatePath(`/items/${itemId}`);
    revalidatePath("/account");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Update error:", error);
    return { error: "Failed to update item" };
  }
}
// ... existing code ...

export async function markAsSold(itemId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Not logged in" };

    await dbConnect();
    const item = await Item.findById(itemId);
    if (!item) return { error: "Item not found" };
    if (item.sellerId.toString() !== session.user.id) return { error: "Unauthorized" };

    await Item.findByIdAndUpdate(itemId, { status: "Sold" });

    revalidatePath(`/items/${itemId}`);
    revalidatePath("/account");
    revalidatePath("/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Mark as sold error:", error);
    return { error: `Failed to update item status: ${error.message}` };
  }
}

export async function purchaseItem({ itemId, paymentMethod, deliveryDetails }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Not logged in" };

    if (!paymentMethod || !["COD", "Online"].includes(paymentMethod)) {
        return { error: "Invalid payment method" };
    }

    if (!deliveryDetails || !deliveryDetails.fullName || !deliveryDetails.email || !deliveryDetails.address || !deliveryDetails.city || !deliveryDetails.phone) {
        return { error: "Missing delivery details" };
    }

    await dbConnect();
    const item = await Item.findById(itemId);
    if (!item) return { error: "Item not found" };
    
    // Debugging: Strict check on status. 
    // If status is not 'Active', we consider it unavailable.
    if (item.status !== "Active") {
        return { error: `Item is not available. Current status: ${item.status}` };
    }

    // Allow buying own item for testing purposes (User Request to fix "unavailable" issue which often triggers this)
    // if (item.sellerId.toString() === session.user.id) return { error: "Cannot buy your own item" };

    item.status = "Sold";
    item.buyerId = session.user.id;
    item.paymentMethod = paymentMethod;
    item.deliveryDetails = deliveryDetails;
    await item.save();

    revalidatePath(`/items/${itemId}`);
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error) {
    console.error("Purchase error:", error);
    return { error: `Failed to complete purchase: ${error.message}` };
  }
}
