function renderInvoiceHistory(container) {
    const lang = settings.language;
    
    let html = `
        <div style="margin-bottom: 12px;">
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">
                <i class="fas fa-history"></i> ${lang === 'en' ? 'Invoice History' : 'سجل الفواتير'}
                <span style="font-size: 12px; color: var(--text-soft);">(${invoices.length})</span>
            </h3>
            <input type="text" class="form-control" id="historySearchInput" 
                   placeholder="${lang === 'en' ? 'Search invoices...' : 'ابحث في الفواتير...'}" 
                   style="margin-bottom: 12px;" oninput="filterInvoiceHistory()">
            <div id="invoiceHistoryList"></div>
        </div>
    `;
    
    container.innerHTML = html;
    renderInvoiceHistoryList();
}

function renderInvoiceHistoryList(filter = '') {
    const lang = settings.language;
    const container = document.getElementById('invoiceHistoryList');
    if (!container) return;
    
    let filtered = invoices;
    if (filter) {
        const q = filter.toLowerCase();
        filtered = invoices.filter(inv => 
            (inv.id && inv.id.toLowerCase().includes(q)) ||
            (inv.customerName && inv.customerName.toLowerCase().includes(q)) ||
            (inv.customerPhone && inv.customerPhone.includes(q))
        );
    }
    
    const sorted = [...filtered].reverse();
    
    if (sorted.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-soft);">
                <p>${lang === 'en' ? 'No invoices found' : 'لا توجد فواتير'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = sorted.map(inv => `
        <div class="stat-card" style="margin-bottom: 8px; cursor: pointer;" onclick="viewInvoiceDetails('${inv.id}')">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="font-weight: 600; font-size: 13px;">${inv.id}</span>
                    <span style="font-size: 10px; color: var(--text-soft); margin-right: 8px;">${escapeHTML(inv.customerName || '')}</span>
                </div>
                <span style="font-weight: 700; font-size: 13px;">${formatCurrency(inv.total)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                <span style="font-size: 10px; color: var(--text-soft);">${formatDate(inv.date)}</span>
                <span class="status-${inv.paymentStatus === 'paid' ? 'paid' : inv.paymentStatus === 'partial' ? 'partial' : 'pending'}">
                    ${inv.paymentStatus === 'paid' ? (lang === 'en' ? 'Paid' : 'مدفوع') : inv.paymentStatus === 'partial' ? (lang === 'en' ? 'Partial' : 'عربون') : (lang === 'en' ? 'Unpaid' : 'غير مدفوع')}
                </span>
            </div>
        </div>
    `).join('');
}

function filterInvoiceHistory() {
    const query = document.getElementById('historySearchInput')?.value || '';
    renderInvoiceHistoryList(query);
}