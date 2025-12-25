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
            
            // --- Header & Branding ---
            // Top Accent Bar
            doc.setFillColor(33, 150, 243); // #2196F3
            doc.rect(0, 0, 210, 5, "F");

            // Brand Logo
            doc.setTextColor(33, 150, 243);
            doc.setFontSize(24);
            doc.setFont("helvetica", "bold");
            doc.text("ReGoods", 20, 25);
            doc.setFillColor(33, 150, 243);
            doc.circle(58, 22, 1, "F"); // Dot in logo
            
            // Report Info (Right Align)
            doc.setFontSize(14);
            doc.setTextColor(60, 60, 60);
            doc.text("BUSINESS ANALYTICS", 190, 25, { align: 'right' });
            
            doc.setFontSize(9);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(120, 120, 120);
            doc.text(`Frequency: ${period.toUpperCase()}`, 190, 32, { align: 'right' });
            doc.text(`Generated: ${new Date().toLocaleString()}`, 190, 37, { align: 'right' });

            // Divider
            doc.setDrawColor(240, 240, 240);
            doc.line(20, 45, 190, 45);

            // --- Stats Summary (Metric Cards) ---
            const totalSales = data.reduce((sum, item) => sum + (item.sales || 0), 0);
            const totalEngage = data.reduce((sum, item) => sum + (item.engagement || 0), 0);
            const totalVerify = data.reduce((sum, item) => sum + (item.verifications || 0), 0);

            // Sales Metric
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(20, 55, 50, 25, 3, 3, 'F');
            doc.setFontSize(8);
            doc.setTextColor(100, 100, 100);
            doc.text("TOTAL SALES", 25, 62);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(33, 150, 243);
            doc.text(totalSales.toLocaleString(), 25, 74);

            // Users Metric
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(80, 55, 50, 25, 3, 3, 'F');
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 100, 100);
            doc.text("NEW USERS", 85, 62);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(59, 130, 246);
            doc.text(totalEngage.toLocaleString(), 85, 74);

            // Verification Metric
            doc.setFillColor(248, 250, 252);
            doc.roundedRect(140, 55, 50, 25, 3, 3, 'F');
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(100, 100, 100);
            doc.text("VERIFICATIONS", 145, 62);
            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.setTextColor(34, 197, 94);
            doc.text(totalVerify.toLocaleString(), 145, 74);

            // --- Detailed Data Table ---
            const tableColumn = ["Date", "Sales Count", "User Engagement", "Verified Users"];
            const tableRows = data.map(item => [
                item.date,
                item.sales,
                item.engagement,
                item.verifications
            ]);

            autoTable(doc, {
                startY: 95,
                head: [tableColumn],
                body: tableRows,
                headStyles: { 
                    fillColor: [33, 150, 243],
                    textColor: [255, 255, 255],
                    fontSize: 9, 
                    fontStyle: 'bold',
                    halign: 'center',
                    cellPadding: 4
                },
                columnStyles: {
                    0: { halign: 'left' },
                    1: { halign: 'center' },
                    2: { halign: 'center' },
                    3: { halign: 'center' }
                },
                styles: { 
                    fontSize: 8,
                    cellPadding: 4,
                    lineColor: [245, 245, 245],
                    lineWidth: 0.1
                },
                alternateRowStyles: {
                    fillColor: [252, 252, 252]
                },
                margin: { left: 20, right: 20 }
            });

            // --- Footer ---
            const pageHeight = doc.internal.pageSize.height;
            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.setTextColor(180, 180, 180);
            doc.text("Confidential - ReGoods Internal Use Only", 105, pageHeight - 15, { align: "center" });
            doc.text(`Page 1 of 1`, 190, pageHeight - 15, { align: 'right' });

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
