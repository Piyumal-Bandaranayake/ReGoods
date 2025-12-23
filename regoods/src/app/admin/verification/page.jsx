import { getVerificationRequests } from "@/app/actions/admin";
import VerificationRequestList from "@/components/admin/VerificationRequestList";

export default async function AdminVerificationPage() {
    const requests = await getVerificationRequests();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-serif font-bold text-gray-900">Seller Verifications</h1>
                <p className="text-gray-500 mt-1">Review NIC documents and verify seller identities to build platform trust.</p>
            </div>

            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <VerificationRequestList requests={requests} />
            </div>
        </div>
    );
}
