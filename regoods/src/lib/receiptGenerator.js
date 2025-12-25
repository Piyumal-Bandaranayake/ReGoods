import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateReceipt = (item, deliveryDetails, paymentMethod, shippingCharge = 40) => {
    try {
        const doc = new jsPDF();
        const date = new Date().toLocaleString();
        const orderId = `REG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const total = item.price + shippingCharge;

        // --- Brand Header & Accent ---
        // Top accent line
        doc.setFillColor(33, 150, 243); // #2196F3 - Accent Blue
        doc.rect(0, 0, 210, 4, "F");
        
        // Logo Representation
        doc.setTextColor(33, 150, 243);
        doc.setFontSize(26);
        doc.setFont("helvetica", "bold");
        doc.text("ReGoods", 20, 25);
        
        // Dot in logo
        doc.setFillColor(33, 150, 243);
        doc.circle(61, 21.5, 1.2, "F");

        // Receipt Label & Metadata
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(60, 60, 60);
        doc.text("OFFICIAL RECEIPT", 190, 25, { align: 'right' });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.text(`Receipt ID: ${orderId}`, 190, 32, { align: 'right' });
        doc.text(`Date: ${date}`, 190, 37, { align: 'right' });

        // Subtle Header Divider
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);
        doc.line(20, 45, 190, 45);

        // --- Information Sections ---
        // Billing Info
        doc.setTextColor(33, 150, 243); 
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.text("SHIPPED TO", 20, 58);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        doc.text(deliveryDetails.fullName || "Customer", 20, 66);
        doc.text(deliveryDetails.address || "N/A", 20, 72);
        doc.text(`${deliveryDetails.city || ""}, ${deliveryDetails.postalCode || ""}`, 20, 78);
        doc.text(deliveryDetails.phone || "", 20, 84);

        // Transaction Details
        doc.setTextColor(33, 150, 243);
        doc.setFont("helvetica", "bold");
        doc.text("PAYMENT INFO", 120, 58);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        doc.text(`Method: ${paymentMethod === 'Online' ? 'Stripe Secure Card' : 'Cash on Delivery'}`, 120, 66);
        doc.text(`Currency: USD ($)`, 120, 72);
        doc.setTextColor(34, 197, 94); // Green for status
        doc.setFont("helvetica", "bold");
        doc.text(`Status: VERIFIED`, 120, 78);

        // --- Items Table ---
        autoTable(doc, {
            startY: 95,
            head: [['Description', 'Category', 'Qty', 'Unit Price', 'Amount']],
            body: [
                [
                    item.title, 
                    item.category || 'General', 
                    '1',
                    `$${item.price.toLocaleString()}`, 
                    `$${item.price.toLocaleString()}`
                ]
            ],
            headStyles: { 
                fillColor: [33, 150, 243],
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold',
                halign: 'left',
                cellPadding: 4
            },
            columnStyles: {
                0: { cellWidth: 80 },
                1: { halign: 'center' },
                2: { halign: 'center' },
                3: { halign: 'right' },
                4: { halign: 'right' }
            },
            styles: { 
                fontSize: 9,
                cellPadding: 5,
                lineColor: [240, 240, 240],
                lineWidth: 0.1,
            },
            alternateRowStyles: {
                fillColor: [252, 252, 252]
            },
            margin: { left: 20, right: 20 }
        });

        // --- Financial Summary ---
        const finalY = doc.lastAutoTable.finalY + 15;
        const summaryX = 135;
        const valueX = 190;

        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        
        doc.text("Subtotal:", summaryX, finalY);
        doc.text(`$${item.price.toLocaleString()}`, valueX, finalY, { align: 'right' });

        doc.text("Shipping Fee:", summaryX, finalY + 8);
        doc.text(`$${shippingCharge.toLocaleString()}`, valueX, finalY + 8, { align: 'right' });

        // Summary Divider
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.3);
        doc.line(summaryX, finalY + 12, valueX, finalY + 12);

        // Grand Total Highlight
        doc.setFontSize(11);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(33, 150, 243);
        doc.text("GRAND TOTAL", summaryX, finalY + 22);
        doc.text(`$${total.toLocaleString()}`, valueX, finalY + 22, { align: 'right' });

        // --- Footer ---
        const pageHeight = doc.internal.pageSize.height;
        
        // Footer message
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(33, 150, 243);
        doc.text("Thank you for shopping with ReGoods!", 105, pageHeight - 35, { align: "center" });
        
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(160, 160, 160);
        doc.text("This is a system-generated receipt for your transaction.", 105, pageHeight - 28, { align: "center" });
        doc.text("For support, please contact us at help@regoods.com", 105, pageHeight - 23, { align: "center" });
        
        // Bottom border
        doc.setFillColor(33, 150, 243);
        doc.rect(0, pageHeight - 4, 210, 4, "F");

        // Save
        doc.save(`ReGoods_Receipt_${orderId}.pdf`);
        return true;
    } catch (error) {
        console.error("PDF Generation Error:", error);
        return false;
    }
};

