import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Item from "@/lib/models/Item";
import User from "@/lib/models/User";
import { redirect, notFound } from "next/navigation";
import { ShieldAlert, ChevronRight } from "lucide-react";
import Link from "next/link";
import EditItemForm from "@/components/items/EditItemForm";

export default async function EditItemPage({ params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/auth/login");
    }

    await dbConnect();
    const user = await User.findById(session.user.id);
    
    if (!user || user.verificationStatus !== "Verified") {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 px-4">
                <div className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center">
                    <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-10 h-10 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-serif font-bold text-gray-900 mb-3">Verification Required</h2>
                    <p className="text-gray-600 mb-8 leading-relaxed">
                        To maintain a safe community, only verified sellers can manage items on ReGoods. 
                        Please complete your identity verification.
                    </p>

                    <Link 
                        href={`/profile/${session.user.id}`}
                        className="flex items-center justify-between w-full bg-blue-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-black transition-all group"
                    >
                        <span>Go to Verification</span>
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        );
    }

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
