// ==================== debts.js ====================
// صفحة الديون - LORVEN SYS v3.0

function renderDebtsPage(container) {
    const lang = settings.language;
    
    // فواتير عليها ديون
    const debtInvoices = invoices.filter(inv => inv.remainingAmount > 0 && inv.paymentStatus !== 'paid');
    
    // تجميع الديون حسب العميل
    const customerDebts = {};
    debtInvoices.forEach(inv => {
        const key = inv.customerPhone || inv.customerName || 'unknown';
        if (!customerDebts[key]) {
            customerDebts[key] = {
                name: inv.customerName || (lang === 'en' ? 'Unknown' : 'غير معروف'),
                phone: inv.customerPhone || '',
                totalDebt: 0,
                invoices: []
            };
        }
        customerDebts[key].totalDebt += inv.remainingAmount;
        customerDebts[key].invoices.push(inv);
    });
    
    const debtList = Object.values(customerDebts).sort((a, b) => b.totalDebt - a.totalDebt);
    const totalDebt = debtList.reduce((s, c) => s + c.totalDebt, 0);
    const debtCount = debtList.length;
    
    let html = `
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">
            <i class="fas fa-money-bill-wave"></i> ${lang === 'en' ? 'Debts' : 'الديون'}
        </h3>
        <p style="color: var(--text-soft); font-size: 11px; margin-bottom: 12px;">
            ${lang === 'en' ? 'Customers with pending payments' : 'العملاء المديونين'}
        </p>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 12px;">
            <div class="stat-card" style="text-align: center; border: 1px solid var(--orange);">
                <div style="font-size: 20px; font-weight: 800; color: var(--orange);">${formatCurrency(totalDebt)}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Total Debt' : 'إجمالي الديون'}</div>
            </div>
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800;">${debtCount}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Customers' : 'عميلة'}</div>
            </div>
        </div>
    `;
    
    if (debtList.length === 0) {
        html += `
            <div style="text-align: center; padding: 40px; color: var(--text-soft);">
                <i class="fas fa-check-circle" style="font-size: 48px; color: var(--green); margin-bottom: 12px;"></i>
                <p>${lang === 'en' ? 'No pending debts' : 'لا يوجد ديون معلقة'} </p>
            </div>
        `;
    } else {
        debtList.forEach((c, idx) => {
            html += `
                <div class="stat-card" style="margin-bottom: 6px;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <span style="font-size: 14px; color: var(--text-soft);">#${idx + 1}</span>
                        <div style="flex: 1;">
                            <div style="font-weight: 700; font-size: 13px;">${escapeHTML(c.name)}</div>
                            <div style="font-size: 10px; color: var(--text-soft);">${c.phone}</div>
                        </div>
                        <div style="text-align: right;">
                            <div style="font-weight: 700; font-size: 14px; color: var(--orange);">${formatCurrency(c.totalDebt)}</div>
                            <div style="font-size: 9px; color: var(--text-soft);">${c.invoices.length} ${lang === 'en' ? 'invoices' : 'فواتير'}</div>
                        </div>
                    </div>
                    
                    <!-- آخر فاتورتين -->
                    ${c.invoices.slice(-2).reverse().map(inv => `
                        <div style="font-size: 10px; color: var(--text-soft); padding: 2px 0; cursor: pointer;" onclick="viewInvoiceDetails('${inv.id}')">
                            · ${inv.id}: ${formatCurrency(inv.remainingAmount)} ${lang === 'en' ? 'remaining' : 'متبقي'} · ${formatDate(inv.date)}
                        </div>
                    `).join('')}
                    
                    <!-- أزرار الإجراء -->
                    <div style="display: flex; gap: 4px; margin-top: 6px;">
                        ${c.phone ? `
                            <button class="btn btn-wa" style="flex: 1; padding: 6px; font-size: 10px;" onclick="sendDebtReminder('${c.phone}', '${escapeHTML(c.name)}', ${c.totalDebt})">
                                <i class="fab fa-whatsapp"></i> ${lang === 'en' ? 'Remind' : 'تذكير'}
                            </button>
                        ` : ''}
                        <button class="btn btn-outline" style="flex: 1; padding: 6px; font-size: 10px;" onclick="viewCustomer('${c.invoices[0]?.customerId || ''}')">
                            <i class="fas fa-user"></i> ${lang === 'en' ? 'Profile' : 'ملف'}
                        </button>
                    </div>
                </div>
            `;
        });
    }
    
    container.innerHTML = html + '<div style="height: 90px;"></div>';
}

function sendDebtReminder(phone, name, amount) {
    const lang = settings.language;
    let number = phone.replace(/\D/g, '');
    
    const message = lang === 'en' 
        ? `Hello ${name},\n\nI hope this message finds you well.\n\nThis is a polite reminder that you have a balance of ${formatCurrency(amount)} remaining on your account.\n\nWe kindly request you to settle it at your earliest convenience.\n\nThank you for your trust and understanding 🤍\n- LORVEN`
        : `السلام عليكم ورحمة الله وبركاته 🌸\n\nعزيزتي ${name}،\n\nنأمل أن تصلك هذه الرسالة وأنتي بأتم الصحة والعافية.\n\nنود تذكيرك بأنه لا يزال لديك مبلغ وقدره ${formatCurrency(amount)} متبقي في سجلاتنا.\n\nنرجو منك التكرم بتسديده في أقرب وقت ممكن، ويسعدنا خدمتك دائماً.\n\nمع خالص الشكر والتقدير 🤍\n- لورفين`;
    
    if (settings.codeBehavior === 'prepend') {
        if (number.startsWith('0')) number = number.substring(1);
        number = settings.countryCode + number;
    }
    
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank');
    showToast(lang === 'en' ? 'Reminder sent' : 'تم إرسال التذكير');
}