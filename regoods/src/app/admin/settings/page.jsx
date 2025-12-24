import { getVerificationRequests } from "@/app/actions/admin";
import VerificationRequestList from "@/components/admin/VerificationRequestList";
import { ShieldCheck, MoreHorizontal } from "lucide-react";

export default async function AdminSettingsPage() {
    const requests = await getVerificationRequests();

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Account Verifications</h1>
                    <p className="text-gray-500 font-medium tracking-tight">Review and verify seller identities to maintain platform trust.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100 text-sm font-bold text-gray-900">
                        {requests.length} Pending
                    </div>
                    <button className="p-3 bg-white text-gray-400 hover:text-gray-900 rounded-2xl shadow-sm border border-gray-100">
                        <MoreHorizontal className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <VerificationRequestList requests={requests} />
        </div>
    );
}
