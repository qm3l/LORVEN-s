// ==================== dashboard.js ====================
// الصفحة الرئيسية - LORVEN SYS v3.0

function renderDashboard(container) {
    const lang = settings.language;
    const today = new Date().toDateString();
    
    // إحصائيات اليوم
    const todayInvoices = invoices.filter(inv => new Date(inv.date).toDateString() === today);
    const salesToday = todayInvoices.reduce((s, i) => s + (i.total || 0), 0);
    const profitToday = todayInvoices.reduce((s, i) => s + (i.profit || 0), 0);
    const ordersToday = todayInvoices.length;
    const customersCount = customers.length;
    
    // تنبيهات سريعة
    const activeShipments = shipments.filter(s => s.status === 'collecting' || s.status === 'sent_to_supplier' || s.status === 'in_transit');
    const unsentInvoices = invoices.filter(inv => !inv.whatsappSent);
    const pendingDebts = invoices.filter(inv => inv.remainingAmount > 0 && inv.paymentStatus !== 'paid');
    
    let html = `
        <!-- إحصائيات -->
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 14px;">
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-coins"></i></div>
                <div class="stat-value">${formatCurrency(salesToday)}</div>
                <div class="stat-label">${lang === 'en' ? 'Today Sales' : 'مبيعات اليوم'}</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-chart-line"></i></div>
                <div class="stat-value">${formatCurrency(profitToday)}</div>
                <div class="stat-label">${lang === 'en' ? 'Net Profit' : 'صافي الربح'}</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-shopping-bag"></i></div>
                <div class="stat-value">${ordersToday}</div>
                <div class="stat-label">${lang === 'en' ? 'Today Orders' : 'طلبات اليوم'}</div>
            </div>
            <div class="stat-card">
                <div class="stat-icon"><i class="fas fa-users"></i></div>
                <div class="stat-value">${customersCount}</div>
                <div class="stat-label">${lang === 'en' ? 'Customers' : 'عميلة'}</div>
            </div>
        </div>
        
<!-- اختصارات سريعة -->
<div style="margin-bottom: 14px;">
    <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">
        ${lang === 'en' ? 'Quick Actions' : 'اختصارات سريعة'}
    </h3>
    <div class="slider-container">
        <div class="action-item" onclick="switchPage('invoices')">
            <div class="action-icon"><i class="fas fa-receipt"></i></div>
            <span class="action-label">${lang === 'en' ? 'Invoice' : 'فاتورة'}</span>
        </div>
        <div class="action-item" onclick="switchPage('customers'); setTimeout(() => openCustomerModal(), 300);">
    <div class="action-icon"><i class="fas fa-user-plus"></i></div>
    <span class="action-label">${lang === 'en' ? 'Customer' : 'عميلة'}</span>
</div>
        <div class="action-item" onclick="switchPage('shipments')">
            <div class="action-icon"><i class="fas fa-truck"></i></div>
            <span class="action-label">${lang === 'en' ? 'Shipment' : 'شحنة'}</span>
        </div>
        <div class="action-item" onclick="switchPage('debts')">
            <div class="action-icon"><i class="fas fa-money-bill-wave"></i></div>
            <span class="action-label">${lang === 'en' ? 'Debts' : 'الديون'}</span>
        </div>
        <div class="action-item" onclick="switchPage('notes')">
            <div class="action-icon"><i class="fas fa-sticky-note"></i></div>
            <span class="action-label">${lang === 'en' ? 'Notes' : 'ملاحظات'}</span>
        </div>
        <div class="action-item" onclick="switchPage('loyalty'); setTimeout(() => openCreateCodeModal(), 300);">
    <div class="action-icon"><i class="fas fa-gift"></i></div>
    <span class="action-label">${lang === 'en' ? 'Loyalty' : 'ولاء'}</span>
</div>
<div class="action-item" onclick="switchPage('bundles'); setTimeout(() => { if (typeof openBundleModal === 'function') openBundleModal(); }, 300);">
    <div class="action-icon"><i class="fas fa-cube"></i></div>
    <span class="action-label">${lang === 'en' ? 'Box' : 'بوكس'}</span>
</div>
        <div class="action-item" onclick="openWishlistModal()">
            <div class="action-icon"><i class="fas fa-lightbulb"></i></div>
            <span class="action-label">${lang === 'en' ? 'Wishlist' : 'أوفرها'}</span>
        </div>
    </div>
</div>
    `;
    
    // تنبيهات
    const alerts = [];
    if (unsentInvoices.length > 0) {
        alerts.push(`${lang === 'en' ? 'invoice not sent' : 'فاتورة غير مرسلة'}`);
    }
    if (pendingDebts.length > 0) {
        alerts.push(`${lang === 'en' ? 'pending debts' : 'ديون معلقة'}`);
    }
    activeShipments.forEach(s => {
        if (s.expectedArrival) {
            const days = getDaysRemaining(s.expectedArrival);
            if (days !== null && days <= 2 && days > 0) {
                alerts.push(`${s.id}: ${lang === 'en' ? 'arriving in' : 'تصل خلال'} ${days} ${lang === 'en' ? 'days' : 'أيام'}`);
            }
        }
    });
    
    if (alerts.length > 0) {
        html += `
            <div style="margin-bottom: 14px; background: var(--card); border-radius: 16px; padding: 10px 14px; border: 1px solid var(--border);">
                <div style="font-size: 12px; font-weight: 700; margin-bottom: 6px; color: var(--orange);">
                    <i class="fas fa-exclamation-triangle"></i> ${lang === 'en' ? 'Alerts' : 'تنبيهات'}
                </div>
                ${alerts.map(a => `<div style="font-size: 11px; color: var(--text-soft); padding: 2px 0;">· ${a}</div>`).join('')}
            </div>
        `;
    }
    
    // الشحنات النشطة
    if (activeShipments.length > 0) {
        html += `
            <div style="margin-bottom: 14px;">
                <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">
                    ${lang === 'en' ? 'Active Shipments' : 'الشحنات النشطة'}
                </h3>
                ${activeShipments.map(s => {
                    const progress = s.itemCount && s.maxItems ? Math.round((s.itemCount / s.maxItems) * 100) : 0;
                    const daysRemaining = s.expectedArrival ? getDaysRemaining(s.expectedArrival) : null;
                    const statusText = s.status === 'collecting' 
                        ? (lang === 'en' ? 'Collecting' : 'جاري التجميع')
                        : s.status === 'sent_to_supplier'
                            ? (lang === 'en' ? 'With supplier' : 'عند المعرض')
                            : (lang === 'en' ? 'In transit' : 'في الطريق');
                    
                    return `
                        <div class="stat-card" style="margin-bottom: 8px; cursor: pointer;" onclick="switchPage('shipments')">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                                <span style="font-weight: 700; font-size: 13px;">${s.id}</span>
                                <span style="font-size: 10px; color: var(--text-soft);">${statusText}</span>
                            </div>
                            <div style="font-size: 11px; color: var(--text-soft); margin-bottom: 4px;">
                                ${s.itemCount || 0}/${s.maxItems || settings.shipmentLimit} ${lang === 'en' ? 'items' : 'منتج'}
                                ${daysRemaining !== null ? ` · ${lang === 'en' ? 'arriving in' : 'تصل خلال'} ${daysRemaining} ${lang === 'en' ? 'days' : 'يوم'}` : ''}
                            </div>
                            <div style="background: var(--hover); border-radius: 8px; height: 4px; overflow: hidden;">
                                <div style="width: ${progress}%; height: 100%; background: var(--text); border-radius: 8px; transition: 0.3s;"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }
    
    // آخر الفواتير
    const recentInvoices = invoices.slice(-5).reverse();
    html += `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
    <h3 style="font-size: 14px; font-weight: 700;">
        ${lang === 'en' ? 'Recent Invoices' : 'آخر الفواتير'}
    </h3>
    <button class="btn btn-outline" style="padding: 4px 12px; font-size: 10px;" onclick="switchPage('invoiceHistory')">
        ${lang === 'en' ? 'View All' : 'عرض الكل'} <i class="fas fa-arrow-left"></i>
    </button>
</div>
    `;
    
    if (recentInvoices.length === 0) {
        html += `
            <div style="padding: 24px; text-align: center; color: var(--text-soft); font-size: 13px;">
                ${lang === 'en' ? 'No invoices yet' : 'لا توجد فواتير بعد'}
            </div>
        `;
    } else {
        recentInvoices.forEach(inv => {
            const statusColor = inv.paymentStatus === 'paid' ? 'var(--green)' : inv.paymentStatus === 'partial' ? 'var(--orange)' : 'var(--text-soft)';
            html += `
                <div style="display: flex; align-items: center; padding: 10px 14px; border-bottom: 1px solid var(--border); cursor: pointer;" onclick="viewInvoiceDetails('${inv.id}')">
                    <div style="width: 34px; height: 34px; background: var(--hover); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 10px;">
                        <i class="fas fa-receipt" style="color: var(--text); font-size: 14px;"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 600; font-size: 12px;">${inv.id}</div>
                        <div style="font-size: 10px; color: var(--text-soft);">
                            ${inv.customerName || (lang === 'en' ? 'Customer' : 'عميلة')} · ${formatDate(inv.date)}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: 700; font-size: 12px;">${formatCurrency(inv.total)}</div>
                        <div style="width: 6px; height: 6px; border-radius: 50%; background: ${statusColor}; display: inline-block;"></div>
                    </div>
                </div>
            `;
        });
    }
    html += `</div></div>`;
    html += `<div style="height: 90px;"></div>`;
    
    container.innerHTML = html;
}

console.log('✅ dashboard.js loaded');