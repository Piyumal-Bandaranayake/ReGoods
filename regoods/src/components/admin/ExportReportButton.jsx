"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileDown, Loader2 } from "lucide-react";
import { useState } from "react";

export default function ExportReportButton({ stats, engagementData, itemData, recentOffers }) {
    const [generating, setGenerating] = useState(false);

    const handleDownload = async () => {
        setGenerating(true);
        try {
            const doc = new jsPDF();

            // Title and Header
            doc.setFontSize(24);
            doc.setTextColor(15, 23, 42); // slate-900
            doc.text("ReGoods", 14, 20);
            
            doc.setFontSize(10);
            doc.setTextColor(100);
            const timestamp = new Date().toLocaleString();
            doc.text("System Ecosystem Performance Report", 14, 28);
            doc.text(`Timestamp: ${timestamp}`, 14, 34);
            
            // Separator
            doc.setDrawColor(241, 245, 249);
            doc.line(14, 40, 196, 40);

            // 1. Executive Summary
            doc.setFontSize(16);
            doc.setTextColor(15, 23, 42);
            doc.text("1. Executive Overview", 14, 55);
            
            const statsTableData = [
                ["Platform Metric", "Current Metric Value"],
                ["Active Member Ecosystem", stats?.totalUsers || 0],
                ["Marketplace Success (Sold Items)", stats?.soldItems || 0],
                ["Active Inventory Density", stats?.activeItems || 0],
                ["Platform Circulated Revenue", `$${(stats?.totalRevenue || 0).toLocaleString()}`],
                ["Critical Governance Alerts", stats?.activeReports || 0],
                ["Pending Trust Verifications", stats?.verificationRequestsCount || 0]
            ];

            autoTable(doc, {
                startY: 62,
                head: [statsTableData[0]],
                body: statsTableData.slice(1),
                theme: 'grid',
                headStyles: { 
                    fillColor: [59, 130, 246], 
                    fontSize: 10, 
                    fontStyle: 'bold',
                    halign: 'center'
                },
                bodyStyles: { fontSize: 9 },
                columnStyles: {
                    0: { fontStyle: 'bold', cellWidth: 80 }
                }
            });

            // 2. Market Dynamics (Top Categories)
            let currentY = (doc).lastAutoTable.finalY + 20;
            doc.setFontSize(14);
            doc.text("2. Inventory Categorization", 14, currentY);
            
            const itemTableData = [
                ["Category Segment", "Active Listing Count"],
                ...(itemData || []).map(item => [item?.name || "Uncategorized", item?.value || 0])
            ];

            autoTable(doc, {
                startY: currentY + 7,
                head: [itemTableData[0]],
                body: itemTableData.slice(1),
                theme: 'striped',
                headStyles: { fillColor: [15, 23, 42] },
                bodyStyles: { fontSize: 9 }
            });

            // 3. Precise Market Activity (New Page)
            doc.addPage();
            doc.setFontSize(16);
            doc.text("3. Transactional Velocity (Recent Activity)", 14, 20);
            
            const activityTableHeaders = [["Asset Title", "Price Point", "Origin (Seller)", "Recipient (Buyer)", "Governance Status"]];
            const activityRows = (recentOffers || []).map(offer => [
                offer?.itemId?.title || "Removed Item",
                `LKR ${(offer?.offerPrice || 0).toLocaleString()}`,
                offer?.sellerId?.name || "N/A",
                offer?.buyerId?.name || "N/A",
                (offer?.status || "PENDING").toUpperCase()
            ]);

            autoTable(doc, {
                startY: 28,
                head: activityTableHeaders,
                body: activityRows,
                theme: 'grid',
                headStyles: { fillColor: [30, 41, 59] },
                bodyStyles: { fontSize: 8 },
                alternateRowStyles: { fillColor: [248, 250, 252] }
            });

            // Footer / Page Numbers
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150);
                doc.text(`ReGoods Governance Report | Page ${i} of ${pageCount}`, doc.internal.pageSize.width / 2, doc.internal.pageSize.height - 10, { align: 'center' });
            }

            doc.save(`ReGoods_Intelligence_Report_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error("PDF Generation Error Details:", err);
            alert(`Compilation failed: ${err.message || "Unknown internal error"}`);
        } finally {
            setGenerating(false);
        }
    };

    return (
        <button 
            onClick={handleDownload}
            disabled={generating}
            className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-blue-500 hover:border-blue-100 transition-all shadow-sm flex items-center space-x-2 disabled:opacity-50"
        >
            {generating ? (
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
            ) : (
                <FileDown className="w-4 h-4" />
            )}
            <span>{generating ? "Compiling..." : "Export System Report"}</span>
        </button>
    );
}
