// ==================== export.js ====================
// تصدير PDF وصورة وطباعة - LORVEN SYS v3.0

function exportInvoiceAsPDF(invoiceId) {
    const lang = settings.language;
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) {
        showToast(lang === 'en' ? 'Invoice not found' : 'الفاتورة غير موجودة');
        return;
    }
    
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a5' });
    
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 10;
    
    // الهيدر
    doc.setFillColor(18, 26, 43);
    doc.rect(0, 0, pageWidth, 25, 'F');
    doc.setTextColor(231, 219, 205);
    doc.setFontSize(18);
    doc.text('LORVEN', pageWidth / 2, 14, { align: 'center' });
    doc.setFontSize(10);
    doc.text(lang === 'en' ? 'Invoice' : 'فاتورة', pageWidth / 2, 22, { align: 'center' });
    
    y = 30;
    doc.setTextColor(18, 26, 43);
    doc.setFontSize(9);
    
    // معلومات الفاتورة
    doc.text(`${lang === 'en' ? 'Invoice No.' : 'رقم الفاتورة'}: ${inv.id}`, 10, y);
    doc.text(`${lang === 'en' ? 'Date' : 'التاريخ'}: ${formatDate(inv.date)}`, pageWidth - 10, y, { align: 'right' });
    y += 8;
    doc.text(`${lang === 'en' ? 'Customer' : 'العميلة'}: ${inv.customerName || ''}`, 10, y);
    doc.text(`${lang === 'en' ? 'Phone' : 'الجوال'}: ${inv.customerPhone || ''}`, pageWidth - 10, y, { align: 'right' });
    
    if (inv.shipmentId) {
        y += 8;
        doc.text(`${lang === 'en' ? 'Shipment' : 'الشحنة'}: ${inv.shipmentId}`, 10, y);
    }
    
    // خط فاصل
    y += 6;
    doc.setDrawColor(200, 200, 200);
    doc.line(10, y, pageWidth - 10, y);
    
    // المنتجات
    y += 8;
    doc.setFontSize(8);
    doc.text(lang === 'en' ? 'Item' : 'المنتج', 10, y);
    doc.text(lang === 'en' ? 'Qty' : 'كمية', pageWidth / 2 + 10, y);
    doc.text(lang === 'en' ? 'Price' : 'السعر', pageWidth - 30, y);
    doc.text(lang === 'en' ? 'Total' : 'مجموع', pageWidth - 10, y, { align: 'right' });
    
    y += 4;
    doc.line(10, y, pageWidth - 10, y);
    
    inv.items.forEach(item => {
        y += 6;
        doc.text(item.name.substring(0, 25), 10, y);
        doc.text(String(item.quantity || 1), pageWidth / 2 + 10, y);
        doc.text(formatCurrency(item.price), pageWidth - 30, y);
        doc.text(formatCurrency((item.quantity || 1) * item.price), pageWidth - 10, y, { align: 'right' });
    });
    
    // الإجمالي
    y += 8;
    doc.line(10, y, pageWidth - 10, y);
    y += 8;
    doc.setFontSize(11);
    doc.text(`${lang === 'en' ? 'Total' : 'الإجمالي'}: ${formatCurrency(inv.total)}`, pageWidth - 10, y, { align: 'right' });
    
    // الدفع
    if (inv.paymentStatus !== 'unpaid') {
        y += 8;
        doc.setFontSize(8);
        const statusText = inv.paymentStatus === 'paid' 
            ? (lang === 'en' ? 'Paid' : 'مدفوع')
            : inv.paymentStatus === 'partial'
                ? (lang === 'en' ? 'Down Payment' : 'عربون')
                : (lang === 'en' ? 'Unpaid' : 'غير مدفوع');
        doc.text(`${lang === 'en' ? 'Payment' : 'الدفع'}: ${statusText}`, 10, y);
        if (inv.paidAmount > 0) {
            doc.text(`${lang === 'en' ? 'Paid' : 'المدفوع'}: ${formatCurrency(inv.paidAmount)}`, 10, y + 6);
            doc.text(`${lang === 'en' ? 'Remaining' : 'المتبقي'}: ${formatCurrency(inv.remainingAmount)}`, pageWidth - 10, y + 6, { align: 'right' });
        }
    }
    
    // تذييل
    y = doc.internal.pageSize.getHeight() - 20;
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text(lang === 'en' ? 'Thank you for choosing LORVEN' : 'شكراً لاختياركِ لورڤين', pageWidth / 2, y, { align: 'center' });
    doc.text('+967 778 051 888', pageWidth / 2, y + 5, { align: 'center' });
    
    doc.save(`${inv.id}.pdf`);
    showToast(lang === 'en' ? '✅ PDF saved' : '✅ تم حفظ PDF');
}

function exportAsImage(elementId) {
    const lang = settings.language;
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (typeof html2canvas !== 'undefined') {
        html2canvas(element, {
            backgroundColor: getComputedStyle(document.body).getPropertyValue('--bg').trim() || '#e7dbcd',
            scale: 2
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = `lorven_${new Date().toISOString().slice(0, 10)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            showToast(lang === 'en' ? '✅ Image saved' : '✅ تم حفظ الصورة');
        });
    } else {
        showToast(lang === 'en' ? '❌ Cannot export image' : '❌ لا يمكن تصدير الصورة');
    }
}

function printElement(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        showToast(settings.language === 'en' ? '❌ Popup blocked' : '❌ النوافذ المنبثقة محظورة');
        return;
    }
    
    const styles = document.querySelector('link[rel="stylesheet"]')?.outerHTML || '';
    const html = element.outerHTML;
    
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="${settings.language === 'en' ? 'ltr' : 'rtl'}">
        <head>
            <meta charset="UTF-8">
            <title>LORVEN</title>
            ${styles}
            <style>
                body { background: white; padding: 16px; }
                @media print { body { background: white; } }
            </style>
        </head>
        <body>${html}</body>
        </html>
    `);
    printWindow.document.close();
    
    setTimeout(() => {
        printWindow.focus();
        printWindow.print();
    }, 500);
}

console.log('✅ export.js loaded');