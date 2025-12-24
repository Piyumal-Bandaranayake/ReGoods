"use client";

import { useState } from "react";
import { Download, ChevronDown, FileText, Calendar, Loader2 } from "lucide-react";
import { getDetailedReport } from "@/app/actions/admin";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function ExportReportButton() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const generatePDF = async (period) => {
        setIsLoading(true);
        setIsOpen(false);
        try {
            const data = await getDetailedReport(period);
            if (!data || data.length === 0) {
                throw new Error("No data available for the selected period.");
            }

            const doc = new jsPDF();
            
            // PDF Header
            doc.setFontSize(22);
            doc.setTextColor(59, 130, 246); // Blue-500
            doc.text("ReGoods Business Analytics Report", 20, 20);
            
            doc.setFontSize(12);
            doc.setTextColor(107, 114, 128);
            doc.text(`Frequency: ${period.charAt(0).toUpperCase() + period.slice(1)}`, 20, 30);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 37);

            // Summary Info
            const totalSales = data.reduce((sum, item) => sum + (item.sales || 0), 0);
            const totalEngage = data.reduce((sum, item) => sum + (item.engagement || 0), 0);
            const totalVerify = data.reduce((sum, item) => sum + (item.verifications || 0), 0);

            doc.setFillColor(249, 250, 251);
            doc.rect(20, 45, 170, 30, 'F');
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            const summaryY = 62;
            doc.text(`Total Sales: ${totalSales}`, 30, summaryY);
            doc.text(`Total New Users: ${totalEngage}`, 85, summaryY);
            doc.text(`Verified Users: ${totalVerify}`, 145, summaryY);

            // Table Data
            const tableColumn = ["Date", "Sales Count", "User Engagement", "Verified Users"];
            const tableRows = data.map(item => [
                item.date,
                item.sales,
                item.engagement,
                item.verifications
            ]);

            autoTable(doc, {
                startY: 85,
                head: [tableColumn],
                body: tableRows,
                theme: 'grid',
                headStyles: { fillColor: [59, 130, 246], fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [245, 247, 250] },
                margin: { top: 10 }
            });

            doc.save(`ReGoods_Report_${period}_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error("PDF Generation Error Details:", error);
            alert(`Failed to generate report: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center space-x-2 px-6 py-3 bg-black text-white rounded-2xl text-sm font-bold hover:bg-gray-800 transition-all shadow-lg shadow-black/10 disabled:opacity-50"
                disabled={isLoading}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    <Download className="w-4 h-4" />
                )}
                <span>Export Report</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button 
                        onClick={() => generatePDF('weekly')}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                    >
                        <div className="p-2 bg-blue-50 text-blue-500 rounded-lg group-hover:bg-blue-500 group-hover:text-white transition-colors">
                            <Calendar className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900">Weekly Report</p>
                            <p className="text-[10px] text-gray-400">Last 7 days activity</p>
                        </div>
                    </button>
                    
                    <button 
                        onClick={() => generatePDF('monthly')}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                    >
                        <div className="p-2 bg-purple-50 text-purple-500 rounded-lg group-hover:bg-purple-500 group-hover:text-white transition-colors">
                            <FileText className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900">Monthly Report</p>
                            <p className="text-[10px] text-gray-400">Monthly breakdown</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => generatePDF('yearly')}
                        className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left group"
                    >
                        <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-900">Yearly Report</p>
                            <p className="text-[10px] text-gray-400">Full year overview</p>
                        </div>
                    </button>
                </div>
            )}
        </div>
    );
}

function TrendingUp(props) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
        </svg>
    )
}
