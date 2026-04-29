// ==================== reports.js ====================
// صفحة التقارير - LORVEN SYS v3.0

function renderReportsPage(container) {
    const lang = settings.language;
    
    // حساب الإحصائيات
    const totalSales = invoices.reduce((s, i) => s + (i.total || 0), 0);
    const totalProfit = invoices.reduce((s, i) => s + (i.profit || 0), 0);
    const totalInvoicesCount = invoices.length;
    const totalCustomers = customers.length;
    const avgOrder = totalInvoicesCount > 0 ? (totalSales / totalInvoicesCount) : 0;
    
    // المدفوع والمتبقي
    const totalPaid = invoices.reduce((s, i) => s + (i.paidAmount || 0), 0);
    const totalRemaining = invoices.reduce((s, i) => s + (i.remainingAmount || 0), 0);
    
    // الديون (فواتير غير مدفوعة)
    const unpaidInvoices = invoices.filter(i => i.remainingAmount > 0 && i.paymentStatus !== 'paid');
    const totalDebt = unpaidInvoices.reduce((s, i) => s + (i.remainingAmount || 0), 0);
    
    // فواتير غير مرسلة
    const unsentInvoices = invoices.filter(i => !i.whatsappSent);
    
    // الشحنات
    const activeShipments = shipments.filter(s => s.status === 'collecting' || s.status === 'sent_to_supplier' || s.status === 'in_transit');
    const completedShipments = shipments.filter(s => s.status === 'arrived' || s.status === 'delivered');
    
    // البوكسات الأكثر مبيعاً
    const topBundles = [...bundles].sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)).slice(0, 5);
    
    // العملاء الأكثر شراءً
    const topCustomers = [...customers].sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0)).slice(0, 5);
    
    // المعارض حسب الشحنات
    const topSuppliers = [...suppliers].sort((a, b) => (b.totalItems || 0) - (a.totalItems || 0)).slice(0, 5);
    
    let html = `
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">
            <i class="fas fa-chart-pie"></i> ${lang === 'en' ? 'Reports' : 'التقارير'}
        </h3>
        
        <!-- إجمالي المبيعات -->
        <div class="stat-card" style="margin-bottom: 10px; text-align: center;">
            <div style="font-size: 11px; color: var(--text-soft); margin-bottom: 4px;">${lang === 'en' ? 'Total Sales' : 'إجمالي المبيعات'}</div>
            <div style="font-size: 28px; font-weight: 800;">${formatCurrency(totalSales)}</div>
        </div>
        
        <!-- شبكة إحصائيات -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 12px;">
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 18px; font-weight: 800;">${formatCurrency(totalProfit)}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Net Profit' : 'صافي الربح'}</div>
            </div>
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 18px; font-weight: 800;">${totalInvoicesCount}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Invoices' : 'فواتير'}</div>
            </div>
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 18px; font-weight: 800;">${formatCurrency(avgOrder)}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Avg. Order' : 'متوسط الفاتورة'}</div>
            </div>
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 18px; font-weight: 800;">${totalCustomers}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Customers' : 'عميلة'}</div>
            </div>
        </div>
        
        <!-- مدفوعات وديون -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 12px;">
            <div class="stat-card" style="text-align: center; border: 1px solid var(--green);">
                <div style="font-size: 18px; font-weight: 800; color: var(--green);">${formatCurrency(totalPaid)}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Total Paid' : 'المدفوع'}</div>
            </div>
            <div class="stat-card" style="text-align: center; border: 1px solid var(--orange);">
                <div style="font-size: 18px; font-weight: 800; color: var(--orange);">${formatCurrency(totalDebt)}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Pending Debts' : 'ديون معلقة'}</div>
            </div>
        </div>
        
        <!-- الشحنات -->
        <div style="margin-bottom: 12px;">
            <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px;">
                <i class="fas fa-truck"></i> ${lang === 'en' ? 'Shipments' : 'الشحنات'}
            </h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px;">
                <div class="stat-card" style="text-align: center;">
                    <div style="font-size: 18px; font-weight: 800;">${activeShipments.length}</div>
                    <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Active' : 'نشطة'}</div>
                </div>
                <div class="stat-card" style="text-align: center;">
                    <div style="font-size: 18px; font-weight: 800;">${completedShipments.length}</div>
                    <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Completed' : 'مكتملة'}</div>
                </div>
            </div>
        </div>
    `;
    
    // تنبيهات سريعة
    if (unsentInvoices.length > 0 || unpaidInvoices.length > 0) {
        html += `
            <div style="margin-bottom: 12px; background: var(--card); border-radius: 16px; padding: 10px 14px; border: 1px solid var(--border);">
                <div style="font-size: 12px; font-weight: 700; margin-bottom: 6px; color: var(--orange);">
                    <i class="fas fa-exclamation-triangle"></i> ${lang === 'en' ? 'Needs Attention' : 'تحتاج انتباه'}
                </div>
                ${unsentInvoices.length > 0 ? `
                    <div style="font-size: 11px; color: var(--text-soft); padding: 2px 0;">
                        · ${unsentInvoices.length} ${lang === 'en' ? 'invoices not sent' : 'فواتير غير مرسلة'}
                    </div>
                ` : ''}
                ${unpaidInvoices.length > 0 ? `
                    <div style="font-size: 11px; color: var(--text-soft); padding: 2px 0;">
                        · ${unpaidInvoices.length} ${lang === 'en' ? 'unpaid invoices' : 'فواتير غير مدفوعة'}
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // أعلى العملاء
    if (topCustomers.length > 0) {
        html += `
            <div style="margin-bottom: 12px;">
                <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px;">
                    <i class="fas fa-users"></i> ${lang === 'en' ? 'Top Customers' : 'أعلى العملاء'}
                </h4>
                ${topCustomers.map((c, idx) => `
                    <div class="stat-card" style="margin-bottom: 4px; cursor: pointer;" onclick="viewCustomer('${c.id}')">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 12px; color: var(--text-soft);">${idx + 1}.</span>
                            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${getCustomerTierColor(c.tier)};"></div>
                            <span style="font-weight: 600; font-size: 12px; flex: 1;">${escapeHTML(c.name)}</span>
                            <span style="font-size: 11px; color: var(--text-soft);">${c.purchaseCount || 0} ${lang === 'en' ? 'orders' : 'طلب'} · ${formatCurrency(c.totalSpent || 0)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // أعلى البوكسات
    if (topBundles.length > 0) {
        html += `
            <div style="margin-bottom: 12px;">
                <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px;">
                    <i class="fas fa-cube"></i> ${lang === 'en' ? 'Top Boxes' : 'أعلى البوكسات مبيعاً'}
                </h4>
                ${topBundles.map((b, idx) => `
                    <div class="stat-card" style="margin-bottom: 4px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 12px; color: var(--text-soft);">${idx + 1}.</span>
                            <span style="font-weight: 600; font-size: 12px; flex: 1;">${escapeHTML(b.name)}</span>
                            <span style="font-size: 11px; color: var(--text-soft);">${b.salesCount || 0} ${lang === 'en' ? 'sold' : 'تم بيعه'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // أعلى المعارض
    if (topSuppliers.length > 0) {
        html += `
            <div style="margin-bottom: 12px;">
                <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 6px;">
                    <i class="fas fa-store"></i> ${lang === 'en' ? 'Top Suppliers' : 'أداء المعارض'}
                </h4>
                ${topSuppliers.map((s, idx) => `
                    <div class="stat-card" style="margin-bottom: 4px; cursor: pointer;" onclick="viewSupplier('${s.id}')">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 12px; color: var(--text-soft);">${idx + 1}.</span>
                            <span style="font-weight: 600; font-size: 12px; flex: 1;">${escapeHTML(s.name)}</span>
                            <span style="font-size: 11px; color: var(--text-soft);">${s.totalItems || 0} ${lang === 'en' ? 'items' : 'منتج'}</span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // أزرار التصدير
    html += `
        <div style="display: flex; gap: 8px; margin-top: 16px;">
           <button class="btn btn-outline" style="padding: 10px 14px; font-size: 15px;" onclick="exportReportAsPDF()">
    <i class="fas fa-file-pdf"></i> ${lang === 'en' ? 'PDF' : 'PDF'}
</button>
           </div>
    `;
    html += '<div style="height: 70px;"></div>';
    container.innerHTML = html;
}

function sendAllUnsentInvoices() {
    const lang = settings.language;
    const unsent = invoices.filter(i => !i.whatsappSent);
    
    if (unsent.length === 0) {
        showToast(lang === 'en' ? 'No unsent invoices' : 'لا توجد فواتير غير مرسلة');
        return;
    }
    
    let count = 0;
    unsent.forEach(inv => {
        if (inv.customerPhone) {
            const message = buildWhatsAppMessage(inv);
            let phone = inv.customerPhone.replace(/\D/g, '');
            if (settings.codeBehavior === 'prepend') {
                if (phone.startsWith('0')) phone = phone.substring(1);
                phone = settings.countryCode + phone;
            }
            
            setTimeout(() => {
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
            }, count * 500);
            
            inv.whatsappSent = true;
            count++;
        }
    });
    
    if (count > 0) {
        saveInvoices();
        showToast(`${lang === 'en' ? 'Opened' : 'تم فتح'} ${count} ${lang === 'en' ? 'chats' : 'محادثة'}`);
    }
    
    if (count >= 10) {
        showToast(lang === 'en' ? 'Browser may block more than 10 tabs' : 'قد يمنع المتصفح فتح أكثر من 10');
    }
}

function exportReportAsPDF() {
    const lang = settings.language;
    const totalSales = invoices.reduce((s, i) => s + (i.total || 0), 0);
    const totalPaid = invoices.reduce((s, i) => s + (i.paidAmount || 0), 0);
    const totalRemaining = invoices.reduce((s, i) => s + (i.remainingAmount || 0), 0);
    const totalProfit = invoices.reduce((s, i) => s + (i.profit || 0), 0);
    
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>LORVEN - ${lang === 'en' ? 'Report' : 'تقرير'}</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'IBM Plex Sans Arabic', Tahoma, sans-serif; background: #F8F4F0; padding: 40px; color: #243048; direction: rtl; }
                .report-card { max-width: 600px; margin: 0 auto; background: white; border-radius: 28px; padding: 30px; box-shadow: 0 8px 32px rgba(36,48,72,0.1); }
                .header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; border-bottom: 2px solid #243048; padding-bottom: 16px; }
                .logo { font-size: 28px; font-weight: 800; color: #243048; letter-spacing: 2px; }
                .report-title { font-size: 14px; color: #8F8A88; text-align: left; }
                .date-row { text-align: left; color: #8F8A88; font-size: 11px; margin-bottom: 24px; }
                .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
                .stat-box { background: #F8F4F0; border-radius: 16px; padding: 16px; text-align: center; }
                .stat-label { font-size: 11px; color: #8F8A88; margin-bottom: 4px; }
                .stat-value { font-size: 20px; font-weight: 800; color: #243048; }
                .divider { border-top: 1px solid #E0D6D0; margin: 16px 0; }
                .footer { text-align: center; color: #8F8A88; font-size: 10px; margin-top: 20px; }
                @media print { body { background: white; padding: 0; } }
            </style>
        </head>
        <body>
            <div class="report-card">
                <div class="header">
                    <div class="logo">LORVEN</div>
                    <div class="report-title">${lang === 'en' ? 'Financial Report' : 'تقرير مالي'}</div>
                </div>
                <div class="date-row">${new Date().toLocaleDateString(lang === 'en' ? 'en-US' : 'ar-SA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div class="stats-grid">
                    <div class="stat-box">
                        <div class="stat-label">${lang === 'en' ? 'Total Sales' : 'إجمالي المبيعات'}</div>
                        <div class="stat-value">${formatCurrency(totalSales)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">${lang === 'en' ? 'Net Profit' : 'صافي الربح'}</div>
                        <div class="stat-value">${formatCurrency(totalProfit)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">${lang === 'en' ? 'Total Paid' : 'المدفوع'}</div>
                        <div class="stat-value">${formatCurrency(totalPaid)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">${lang === 'en' ? 'Pending' : 'المتبقي'}</div>
                        <div class="stat-value">${formatCurrency(totalRemaining)}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">${lang === 'en' ? 'Invoices' : 'الفواتير'}</div>
                        <div class="stat-value">${invoices.length}</div>
                    </div>
                    <div class="stat-box">
                        <div class="stat-label">${lang === 'en' ? 'Customers' : 'العملاء'}</div>
                        <div class="stat-value">${customers.length}</div>
                    </div>
                </div>
                <div class="divider"></div>
                <div class="footer">${lang === 'en' ? 'Generated by LORVEN' : 'تم إنشاؤه بواسطة LORVEN'} · ${new Date().toISOString().slice(0, 10)}</div>
            </div>
        </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 500);
}
function convertAmount(amount, invoiceCurrency) {
    const baseCurrency = settings.currency || 'ر.س';
    const rate = settings.exchangeRate || 135; // 1 ر.س = 135 ر.ي
    
    if (invoiceCurrency === baseCurrency) return amount;
    
    if (baseCurrency === 'ر.س' && invoiceCurrency === 'ر.ي') {
        return amount / rate; // يمني → سعودي (قسمة)
    }
    if (baseCurrency === 'ر.ي' && invoiceCurrency === 'ر.س') {
        return amount * rate; // سعودي → يمني (ضرب)
    }
    
    return amount;
}

console.log('✅ reports.js loaded');