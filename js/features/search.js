// ==================== search.js ====================
// البحث الذكي - LORVEN SYS v3.0

function performSearch(query) {
    if (!query || query.trim().length < 1) {
        return { customers: [], invoices: [], shipments: [], suppliers: [] };
    }
    
    const q = query.trim().toLowerCase();
    const results = { customers: [], invoices: [], shipments: [], suppliers: [] };
    
    // تحديد نوع البحث من البداية
    const startsWithCU = q.startsWith('cu-') || q.startsWith('CU-');
    const startsWithSH = q.startsWith('sh-') || q.startsWith('SH-');
    const startsWithLVN = q.startsWith('lvn-') || q.startsWith('LVN-');
    
    // إذا كان رقم جوال (يبدأ بـ 7 وطوله 8+ أرقام)
    const isPhoneNumber = /^7\d{7,}$/.test(q.replace(/[^0-9]/g, ''));
    
    // بحث في العملاء
    if (!startsWithSH && !startsWithLVN) {
        results.customers = customers.filter(c => {
            if (startsWithCU) return c.id && c.id.toLowerCase().includes(q);
            if (isPhoneNumber) return c.phone && c.phone.includes(q.replace(/[^0-9]/g, ''));
            return (c.name && c.name.toLowerCase().includes(q)) ||
                   (c.phone && c.phone.includes(q.replace(/[^0-9]/g, ''))) ||
                   (c.id && c.id.toLowerCase().includes(q));
        }).slice(0, 5);
    }
    
    // بحث في الفواتير
    if (!startsWithCU && !startsWithSH) {
        results.invoices = invoices.filter(inv => {
            if (startsWithLVN) return inv.id && inv.id.toLowerCase().includes(q);
            if (isPhoneNumber) return inv.customerPhone && inv.customerPhone.includes(q.replace(/[^0-9]/g, ''));
            return (inv.id && inv.id.toLowerCase().includes(q)) ||
                   (inv.customerName && inv.customerName.toLowerCase().includes(q)) ||
                   (inv.customerPhone && inv.customerPhone.includes(q.replace(/[^0-9]/g, '')));
        }).slice(0, 10);
    }
    
    // بحث في الشحنات
    if (!startsWithCU && !startsWithLVN && !isPhoneNumber) {
        results.shipments = shipments.filter(s => {
            if (startsWithSH) return s.id && s.id.toLowerCase().includes(q);
            return (s.id && s.id.toLowerCase().includes(q)) ||
                   (s.supplierName && s.supplierName.toLowerCase().includes(q));
        }).slice(0, 5);
    }
    
    // بحث في المعارض
    if (!startsWithCU && !startsWithLVN && !startsWithSH && !isPhoneNumber) {
        results.suppliers = suppliers.filter(s => {
            return (s.name && s.name.toLowerCase().includes(q)) ||
                   (s.phone && s.phone.includes(q.replace(/[^0-9]/g, '')));
        }).slice(0, 5);
    }
    
    return results;
}

// عرض نتائج البحث في واجهة
function showSearchResults(query) {
    const results = performSearch(query);
    const totalResults = results.customers.length + results.invoices.length + 
                         results.shipments.length + results.suppliers.length;
    
    const container = document.getElementById('searchResultsContainer');
    if (!container) return;
    
    if (!query || query.trim().length < 1) {
        container.innerHTML = '';
        container.style.display = 'none';
        return;
    }
    
    if (totalResults === 0) {
        container.innerHTML = `
            <div style="padding: 16px; text-align: center; color: var(--text-soft);">
                ${settings.language === 'en' ? 'No results found' : 'لا توجد نتائج'}
            </div>
        `;
        container.style.display = 'block';
        return;
    }
    
    let html = '';
    const lang = settings.language;
    
    // العملاء
    if (results.customers.length > 0) {
        html += `<div style="font-size: 11px; color: var(--text-soft); padding: 8px 12px; font-weight: 600;">
            <i class="fas fa-users"></i> ${lang === 'en' ? 'Customers' : 'العملاء'}
        </div>`;
        results.customers.forEach(c => {
            html += `
                <div class="search-result-item" onclick="viewCustomer('${c.id}')" style="padding: 10px 14px; border-bottom: 1px solid var(--border); cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 8px; height: 8px; border-radius: 50%; background: ${getCustomerTierColor(c.tier)};"></div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 12px;">${escapeHTML(c.name)}</div>
                            <div style="font-size: 10px; color: var(--text-soft);">${c.id} · ${c.phone}</div>
                        </div>
                        <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                    </div>
                </div>
            `;
        });
    }
    
    // الفواتير
    if (results.invoices.length > 0) {
        html += `<div style="font-size: 11px; color: var(--text-soft); padding: 8px 12px; font-weight: 600;">
            <i class="fas fa-receipt"></i> ${lang === 'en' ? 'Invoices' : 'الفواتير'}
        </div>`;
        results.invoices.forEach(inv => {
            html += `
                <div class="search-result-item" onclick="viewInvoiceDetails('${inv.id}')" style="padding: 10px 14px; border-bottom: 1px solid var(--border); cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; background: var(--text); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--bg); font-size: 14px;">
                            <i class="fas fa-receipt"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 12px;">${inv.id}</div>
                            <div style="font-size: 10px; color: var(--text-soft);">${inv.customerName || (lang === 'en' ? 'Customer' : 'عميلة')} · ${formatDate(inv.date)}</div>
                        </div>
                        <div style="font-weight: 700; font-size: 12px;">${formatCurrency(inv.total)}</div>
                    </div>
                </div>
            `;
        });
    }
    
    // الشحنات
    if (results.shipments.length > 0) {
        html += `<div style="font-size: 11px; color: var(--text-soft); padding: 8px 12px; font-weight: 600;">
            <i class="fas fa-box"></i> ${lang === 'en' ? 'Shipments' : 'الشحنات'}
        </div>`;
        results.shipments.forEach(s => {
            html += `
                <div class="search-result-item" onclick="viewShipment('${s.id}')" style="padding: 10px 14px; border-bottom: 1px solid var(--border); cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; background: var(--text); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--bg); font-size: 14px;">
                            <i class="fas fa-box"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 12px;">${s.id}</div>
                            <div style="font-size: 10px; color: var(--text-soft);">${s.supplierName || ''} · ${s.itemCount || 0} ${lang === 'en' ? 'items' : 'منتج'}</div>
                        </div>
                        <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                    </div>
                </div>
            `;
        });
    }
    
    // المعارض
    if (results.suppliers.length > 0) {
        html += `<div style="font-size: 11px; color: var(--text-soft); padding: 8px 12px; font-weight: 600;">
            <i class="fas fa-store"></i> ${lang === 'en' ? 'Suppliers' : 'المعارض'}
        </div>`;
        results.suppliers.forEach(s => {
            html += `
                <div class="search-result-item" onclick="viewSupplier('${s.id}')" style="padding: 10px 14px; border-bottom: 1px solid var(--border); cursor: pointer;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 32px; height: 32px; background: var(--text); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: var(--bg); font-size: 14px;">
                            <i class="fas fa-store"></i>
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 12px;">${escapeHTML(s.name)}</div>
                            <div style="font-size: 10px; color: var(--text-soft);">${s.phone || ''} · ${s.shipmentCount || 0} ${lang === 'en' ? 'shipments' : 'شحنات'}</div>
                        </div>
                        <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                    </div>
                </div>
            `;
        });
    }
    
    container.innerHTML = html;
    container.style.display = 'block';
}

// إغلاق نتائج البحث عند النقر خارجها
document.addEventListener('click', function(e) {
    const container = document.getElementById('searchResultsContainer');
    const searchInput = document.getElementById('globalSearchInput');
    
    if (container && searchInput && 
        !container.contains(e.target) && 
        !searchInput.contains(e.target)) {
        container.style.display = 'none';
    }
});

console.log('✅ search.js loaded');