"use server";

import dbConnect from "@/lib/db";
import Offer from "@/lib/models/Offer";
import Item from "@/lib/models/Item";
import Notification from "@/lib/models/Notification";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createOffer(itemId, offerAmount) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: "You must be logged in to make an offer." };
    }

    await dbConnect();

    const item = await Item.findById(itemId);
    if (!item) {
      return { error: "Item not found." };
    }

    if (item.sellerId.toString() === session.user.id) {
      return { error: "You cannot make an offer on your own item." };
    }

    if (!item.negotiable) {
      return { error: "This item is not open for negotiation." };
    }

    // Check if there's already a pending offer from this buyer for this item
    const existingOffer = await Offer.findOne({
      itemId,
      buyerId: session.user.id,
      status: "Pending",
    });

    if (existingOffer) {
      return { error: "You already have a pending offer for this item." };
    }

    const newOffer = await Offer.create({
      itemId,
      buyerId: session.user.id,
      sellerId: item.sellerId,
      offerAmount: Number(offerAmount),
      status: "Pending",
    });

    revalidatePath(`/items/${itemId}`);

    // Notify seller of a new offer
    await Notification.create({
      recipientId: item.sellerId,
      senderId: session.user.id,
      type: "new_offer",
      title: "New Offer Received",
      content: `A buyer has made an offer of $${offerAmount} for your item: ${item.title}.`,
      link: "/account?tab=offers",
    });

    return { success: true, offerId: newOffer._id.toString() };
  } catch (error) {
    console.error("Create offer error:", error);
    return { error: "Failed to send offer. Please try again." };
  }
}

export async function getOffersForSeller() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return { error: "Not authenticated" };
    }

    await dbConnect();

    const offers = await Offer.find({ sellerId: session.user.id })
      .populate("itemId", "title price images")
      .populate("buyerId", "name email")
      .sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(offers));
  } catch (error) {
    console.error("Get offers error:", error);
    return { error: "Failed to fetch offers." };
  }
}

export async function getOffersForBuyer() {
    try {
      const session = await getServerSession(authOptions);
      if (!session) {
        return { error: "Not authenticated" };
      }
  
      await dbConnect();
  
      const offers = await Offer.find({ buyerId: session.user.id })
        .populate("itemId", "title price images")
        .populate("sellerId", "name email")
        .sort({ createdAt: -1 });
  
      return JSON.parse(JSON.stringify(offers));
    } catch (error) {
      console.error("Get offers error:", error);
      return { error: "Failed to fetch offers." };
    }
  }

export async function acceptOffer(offerId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Not logged in" };

    await dbConnect();
    const offer = await Offer.findById(offerId).populate("itemId");
    if (!offer) return { error: "Offer not found" };

    if (offer.sellerId.toString() !== session.user.id) {
      return { error: "Unauthorized" };
    }

    if (offer.status !== "Pending") {
      return { error: "This offer is no longer pending." };
    }

    // Update Offer Status
    offer.status = "Accepted";
    await offer.save();

    // Note: We no longer update the global item.price here.
    // Instead, we will check for Accepted offers on the item page and checkout page
    // to show the discounted price only to the buyer.

    // Reject all other pending offers for this item
    await Offer.updateMany(
      { itemId: offer.itemId._id, _id: { $ne: offer._id }, status: "Pending" },
      { status: "Rejected" }
    );

    // Notify Buyer that offer was accepted
    await Notification.create({
      recipientId: offer.buyerId,
      senderId: session.user.id,
      type: "offer_accepted",
      title: "Offer Accepted!",
      content: `The seller accepted your offer of $${offer.offerAmount} for ${offer.itemId.title}. You can now proceed to checkout.`,
      link: `/checkout/${offer.itemId._id}`,
    });

    revalidatePath("/account");
    revalidatePath("/dashboard");
    revalidatePath(`/items/${offer.itemId._id}`);
    
    return { success: true };
  } catch (error) {
    console.error("Accept offer error:", error);
    return { error: "Failed to accept offer." };
  }
}

export async function rejectOffer(offerId) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return { error: "Not logged in" };

    await dbConnect();
    const offer = await Offer.findById(offerId);
    if (!offer) return { error: "Offer not found" };

    if (offer.sellerId.toString() !== session.user.id) {
      return { error: "Unauthorized" };
    }

    offer.status = "Rejected";
    await offer.save();

    // Notify Buyer that offer was rejected
    await Notification.create({
        recipientId: offer.buyerId,
        senderId: session.user.id,
        type: "offer_rejected",
        title: "Offer Declined",
        content: `Your offer for ${offer.itemId?.title || 'an item'} was declined by the seller.`,
        link: `/items/${offer.itemId?._id || ''}`,
    });

    revalidatePath("/account");
    return { success: true };
  } catch (error) {
    console.error("Reject offer error:", error);
    return { error: "Failed to reject offer." };
  }
}
