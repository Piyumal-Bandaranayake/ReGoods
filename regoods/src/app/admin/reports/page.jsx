import { getReportedMessages } from "@/app/actions/admin";
import ReportList from "@/components/admin/ReportList";

export default async function ReportsPage() {
    const reports = await getReportedMessages();

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Reported Content</h1>
                <p className="text-gray-500 mt-1">Review and moderate reported messages.</p>
            </div>

            <ReportList initialReports={reports} />
        </div>
    );
}
