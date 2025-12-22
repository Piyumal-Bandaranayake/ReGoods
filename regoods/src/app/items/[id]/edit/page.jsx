import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Item from "@/lib/models/Item";
import { redirect, notFound } from "next/navigation";
import EditItemForm from "@/components/items/EditItemForm";

export default async function EditItemPage({ params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login");
    }

    await dbConnect();
    const item = await Item.findById(params.id);

    if (!item) {
        notFound();
    }

    // Authorization Check
    if (item.sellerId.toString() !== session.user.id) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Unauthorized</h1>
                    <p className="mt-2 text-gray-500">You do not have permission to edit this item.</p>
                </div>
            </div>
        );
    }

    // Convert to plain object to pass to client component
    const plainItem = JSON.parse(JSON.stringify(item));

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl shadow-none border border-gray-200 overflow-hidden">
                    <div className="px-8 py-6 border-b border-gray-100 bg-white">
                        <h1 className="text-2xl font-serif font-bold text-gray-900">Edit Listing</h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Update the details of your listing.
                        </p>
                    </div>
                    <EditItemForm item={plainItem} />
                </div>
            </div>
        </div>
    );
}
