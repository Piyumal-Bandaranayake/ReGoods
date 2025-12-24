import { getVerificationRequests } from "@/app/actions/admin";
import VerificationRequestList from "@/components/admin/VerificationRequestList";
import { ShieldCheck, MoreHorizontal } from "lucide-react";

export default async function AdminSettingsPage() {
    const requests = await getVerificationRequests();

    return (
        <div className="space-y-10 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">Account Verifications</h1>
                    <p className="text-sm text-gray-500 font-medium tracking-tight">Review and verify seller identities to maintain platform trust.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="bg-white px-5 py-2.5 rounded-xl shadow-sm border border-gray-100 text-xs font-bold text-gray-900">
                        {requests.length} Pending Requests
                    </div>
                </div>
            </div>

            <VerificationRequestList requests={requests} />
        </div>
    );
}
