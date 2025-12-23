import { redirect } from "next/navigation";
import dbConnect from "@/lib/db";
import Item from "@/lib/models/Item";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import PaymentPageClient from "./PaymentPageClient";
import Stripe from "stripe";

export default async function PaymentPage({ searchParams }) {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/auth/login");

    const params = await searchParams;
    const itemId = params?.itemId;

    if (!itemId) redirect("/dashboard");

    await dbConnect();
    const item = await Item.findById(itemId);

    if (!item) {
        return <div>Item not found</div>;
    }

    // Create Payment Intent on the server side for security
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round((item.price + 400) * 100),
        currency: "usd",
        payment_method_types: ["card"],
        metadata: { itemId: item._id.toString(), buyerId: session.user.id }
    });

    return (
        <PaymentPageClient
            item={JSON.parse(JSON.stringify(item))}
            clientSecret={paymentIntent.client_secret}
        />
    );
}
