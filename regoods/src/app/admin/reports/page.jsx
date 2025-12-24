import { getUserReports } from "@/app/actions/admin";
import UserReportList from "@/components/admin/UserReportList";

export default async function ReportsPage() {
    const userReports = await getUserReports();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Reports Management</h1>
                    <p className="text-gray-500 mt-1">Review user complaints and moderate reported content.</p>
                </div>
                
                <div className="bg-white px-6 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-gray-900">
                    {userReports.length} Pending User Reports
                </div>
            </div>

            <div className="animate-fade-in">
                <UserReportList initialReports={userReports} />
            </div>
        </div>
    );
}
