import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateReceipt = (item, deliveryDetails, paymentMethod, shippingCharge = 40) => {
    try {
        const doc = new jsPDF();
        const date = new Date().toLocaleString();
        const orderId = `REG-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        const total = item.price + shippingCharge;

        // Branding & Header
        doc.setFillColor(30, 58, 138); // Dark Blue
        doc.rect(0, 0, 210, 40, "F");
        
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(24);
        doc.setFont("helvetica", "bold");
        doc.text("ReGoods.", 20, 25);
        
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("OFFICIAL TRANSACTION RECEIPT", 140, 25);

        // Transaction Overview
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Order Details", 20, 55);
        
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(`ID: ${orderId}`, 20, 62);
        doc.text(`Date: ${date}`, 20, 67);
        doc.text(`Payment: ${paymentMethod === 'Online' ? 'Stripe Secure Card' : 'Cash on Delivery'}`, 20, 72);

        // Billing to
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        doc.text("Shipped To", 120, 55);
        
        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text(deliveryDetails.fullName || "Recipient", 120, 62);
        doc.text(deliveryDetails.address || "N/A", 120, 67);
        doc.text(`${deliveryDetails.city || ""}, ${deliveryDetails.postalCode || ""}`, 120, 72);
        doc.text(deliveryDetails.phone || "", 120, 77);

        // Item Table
        autoTable(doc, {
            startY: 90,
            head: [['Description', 'Category', 'Unit Price', 'Total']],
            body: [
                [
                    item.title, 
                    item.category || 'General', 
                    `$${item.price.toLocaleString()}`, 
                    `$${item.price.toLocaleString()}`
                ]
            ],
            headStyles: { 
                fillColor: [30, 58, 138],
                textColor: [255, 255, 255],
                fontSize: 10,
                fontStyle: 'bold'
            },
            styles: { 
                fontSize: 9,
                cellPadding: 6
            },
            margin: { left: 20, right: 20 }
        });

        // Summary
        const finalY = doc.lastAutoTable.finalY + 10;
        
        doc.setDrawColor(230, 230, 230);
        doc.line(130, finalY, 190, finalY);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(100, 100, 100);
        doc.text("Subtotal:", 140, finalY + 10);
        doc.text(`$${item.price.toLocaleString()}`, 175, finalY + 10);

        doc.text("Shipping:", 140, finalY + 17);
        doc.text(`$${shippingCharge.toLocaleString()}`, 175, finalY + 17);

        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(30, 58, 138);
        doc.text("Grand Total:", 140, finalY + 28);
        doc.text(`$${total.toLocaleString()}`, 170, finalY + 28);

        // Footer
        doc.setFontSize(8);
        doc.setFont("helvetica", "italic");
        doc.setTextColor(150, 150, 150);
        doc.text("Thank you for choosing ReGoods. Your transaction is secured and verified.", 105, 280, { align: "center" });
        doc.text("This is a computer generated document. No signature required.", 105, 285, { align: "center" });

        // Save
        doc.save(`ReGoods_Receipt_${orderId}.pdf`);
        return true;
    } catch (error) {
        console.error("PDF Generation Error:", error);
        return false;
    }
};
