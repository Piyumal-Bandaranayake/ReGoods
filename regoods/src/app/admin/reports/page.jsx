import { getReportedMessages, getUserReports } from "@/app/actions/admin";
import ReportList from "@/components/admin/ReportList";
import UserReportList from "@/components/admin/UserReportList";

export default async function ReportsPage({ searchParams }) {
    const { tab } = await searchParams || { tab: 'users' };
    const currentTab = tab || 'users';

    const reportedMessages = await getReportedMessages();
    const userReports = await getUserReports();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900">Reports Management</h1>
                    <p className="text-gray-500 mt-1">Review user complaints and moderate reported content.</p>
                </div>
                
                <div className="flex bg-white p-1 rounded-xl border border-gray-200">
                    <a 
                        href="?tab=users" 
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition ${currentTab === 'users' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
                    >
                        User Reports ({userReports.length})
                    </a>
                    <a 
                        href="?tab=messages" 
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition ${currentTab === 'messages' ? 'bg-black text-white' : 'text-gray-500 hover:text-black'}`}
                    >
                        Messages ({reportedMessages.length})
                    </a>
                </div>
            </div>

            <div className="animate-fade-in">
                {currentTab === 'users' ? (
                    <UserReportList initialReports={userReports} />
                ) : (
                    <ReportList initialReports={reportedMessages} />
                )}
            </div>
        </div>
    );
}
