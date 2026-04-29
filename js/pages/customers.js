// ==================== customers.js ====================
// صفحة العملاء - LORVEN SYS v3.0

function renderCustomersPage(container) {
    const lang = settings.language;
    
    let html = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h3 style="font-size: 18px; font-weight: 700;">
                <i class="fas fa-users"></i> ${lang === 'en' ? 'Customers' : 'العملاء'}
                <span style="font-size: 12px; color: var(--text-soft);">(${customers.length})</span>
            </h3>
            <button class="btn btn-primary" style="padding: 8px 14px; font-size: 12px;" onclick="openCustomerModal()">
                <i class="fas fa-plus"></i> ${lang === 'en' ? 'Add' : 'أضف'}
            </button>
        </div>
        
        <div style="position: relative; margin-bottom: 12px;">
            <input type="text" class="form-control" id="customerSearchInput" 
                   placeholder="${lang === 'en' ? 'Search customers' : 'ابحث عن عميلة'}" 
                   style="padding-right: 36px;" oninput="filterCustomers()">
            <i class="fas fa-search" style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); color: var(--text-soft);"></i>
        </div>
        <div style="display: flex; gap: 6px; margin-bottom: 10px; flex-wrap: wrap;">
    <button class="filter-btn active" data-filter="all" onclick="filterCustomersByTier('all', this)">${lang === 'en' ? 'All' : 'الكل'}</button>
    <button class="filter-btn" data-filter="vip" onclick="filterCustomersByTier('vip', this)">VIP</button>
    <button class="filter-btn" data-filter="gold" onclick="filterCustomersByTier('gold', this)">${lang === 'en' ? 'Gold' : 'ذهبي'}</button>
    <button class="filter-btn" data-filter="silver" onclick="filterCustomersByTier('silver', this)">${lang === 'en' ? 'Silver' : 'مميز'}</button>
    <button class="filter-btn" data-filter="normal" onclick="filterCustomersByTier('normal', this)">${lang === 'en' ? 'Normal' : 'عادي'}</button>
</div>
        <div id="customersList"></div>
    `;
    
    container.innerHTML = html;
    renderCustomersList();
}

function renderCustomersList(filter = '') {
    const lang = settings.language;
    const container = document.getElementById('customersList');
    if (!container) return;
    
    let filtered = customers;
    if (filter) {
        const q = filter.toLowerCase();
        filtered = customers.filter(c => 
            (c.name && c.name.toLowerCase().includes(q)) ||
            (c.phone && c.phone.includes(q)) ||
            (c.id && c.id.toLowerCase().includes(q))
        );
    }
    
    filtered.sort((a, b) => (b.purchaseCount || 0) - (a.purchaseCount || 0));
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-soft);">
                <i class="fas fa-user-slash" style="font-size: 48px; margin-bottom: 12px; opacity: 0.3;"></i>
                <p>${lang === 'en' ? 'No customers found' : 'لا توجد عميلات'}</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(c => {
        const tierColor = getCustomerTierColor(c.tier || 'normal');
        const tierName = getCustomerTierName(c.tier || 'normal');
        
        return `
            <div class="stat-card" style="margin-bottom: 8px; cursor: pointer;" onclick="viewCustomer('${c.id}')">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: ${tierColor};"></div>
                    <div style="flex: 1;">
                        <div style="font-weight: 700; font-size: 13px;">${escapeHTML(c.name)}</div>
                        <div style="font-size: 10px; color: var(--text-soft);">
                            <span class="copyable-id" onclick="event.stopPropagation(); copyToClipboard('${c.id}')">${c.id}</span>
                            · ${c.phone || ''}
                        </div>
                    </div>
                    <div style="text-align: left;">
                        <span style="font-size: 10px; background: ${tierColor}20; color: ${tierColor}; padding: 2px 10px; border-radius: 12px; font-weight: 600;">${tierName}</span>
                    </div>
                    <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                </div>
            </div>
        `;
    }).join('');
}

function filterCustomers() {
    const query = document.getElementById('customerSearchInput')?.value || '';
    renderCustomersList(query);
}

function openCustomerModal(existingCustomerId = null) {
    const lang = settings.language;
    const existing = existingCustomerId ? customers.find(c => c.id === existingCustomerId) : null;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'customerModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 380px;">
            <div class="modal-header">
                <div class="modal-title">
                    <i class="fas fa-user"></i> 
                    ${existing ? (lang === 'en' ? 'Edit Customer' : 'تعديل عميلة') : (lang === 'en' ? 'New Customer' : 'عميلة جديدة')}
                </div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">${lang === 'en' ? 'Name' : 'الاسم'} <span style="color: var(--red);">*</span></label>
                    <input type="text" class="form-control" id="customerName" value="${existing ? escapeHTML(existing.name) : ''}" placeholder="${lang === 'en' ? 'Customer name' : 'اسم العميلة'}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">${lang === 'en' ? 'Phone (9 digits)' : 'رقم الجوال (٩ أرقام)'} <span style="color: var(--red);">*</span></label>
<div style="position: relative;">
    <input type="tel" class="form-control" id="customerPhone" value="${existing ? existing.phone || '' : ''}" inputmode="numeric" maxlength="9" placeholder="77xxxxxxx" style="padding-left: 38px;">
<button onclick="showToast(settings.language === 'en' ? 'Coming soon' : 'قريباً')" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-soft); font-size: 16px; cursor: pointer; padding: 4px;">
        <i class="fas fa-address-book"></i>
    </button>
</div>
<div style="font-size: 9px; color: var(--text-soft); margin-top: 2px;">
                        ${lang === 'en' ? 'Enter without country code' : 'أدخل بدون رمز الدولة'}
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">${lang === 'en' ? 'Notes' : 'ملاحظات'}</label>
                    <textarea class="form-control" id="customerNotes" rows="2" placeholder="${lang === 'en' ? 'Optional notes...' : 'ملاحظات اختيارية...'}">${existing ? existing.notes || '' : ''}</textarea>
                </div>
                
                <button class="btn btn-primary" style="width: 100%;" onclick="${existing ? `updateCustomer('${existing.id}')` : 'saveCustomer()'}">
                    ${lang === 'en' ? 'Save' : 'حفظ'}
                </button>
                
                ${existing ? `
                    <button class="btn btn-outline" style="width: 100%; margin-top: 8px; color: var(--red); border-color: var(--red);" 
                            onclick="deleteCustomerFromModal('${existing.id}')">
                        ${lang === 'en' ? 'Delete Customer' : 'حذف العميلة'}
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function saveCustomer() {
    const lang = settings.language;
    const name = document.getElementById('customerName').value.trim();
    let phone = document.getElementById('customerPhone').value.trim();
    
    if (!name) {
        showToast(t('fillFields'));
        return;
    }
    
    // تنظيف رقم الجوال
    phone = cleanPhoneNumber(phone);
    
    if (phone && phone.length !== 9) {
        showToast(lang === 'en' ? 'Phone must be 9 digits' : 'رقم الجوال يجب أن يكون ٩ أرقام');
        return;
    }
    
    const customer = {
        id: generateCustomerId(),
        name: name,
        phone: phone,
        notes: document.getElementById('customerNotes').value.trim(),
        purchaseCount: 0,
        totalSpent: 0,
        totalPaid: 0,
        totalRemaining: 0,
        lastPurchase: null,
        tier: 'normal',
        createdAt: new Date().toISOString()
    };
    
    customers.push(customer);
    saveCustomers();
    
    document.getElementById('customerModal')?.remove();
    renderCustomersList();
    playSound('save');
showCheckmark(lang === 'en' ? 'Customer Saved ✓' : 'تم حفظ العميل');    
    addNotification('customer', 
        lang === 'en' ? 'New Customer' : 'عميلة جديدة',
        `${name} - ${customer.id}`,
        customer.id
    );
}

function updateCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const lang = settings.language;
    const name = document.getElementById('customerName').value.trim();
    let phone = document.getElementById('customerPhone').value.trim();
    
    if (!name) {
        showToast(t('fillFields'));
        return;
    }
    
    phone = cleanPhoneNumber(phone);
    
    if (phone && phone.length !== 9) {
        showToast(lang === 'en' ? 'Phone must be 9 digits' : 'رقم الجوال يجب أن يكون ٩ أرقام');
        return;
    }
    
    customer.name = name;
    customer.phone = phone;
    customer.notes = document.getElementById('customerNotes').value.trim();
    
    saveCustomers();
    if (currentPage === 'debts' && typeof renderDebtsPage === 'function') {
    renderDebtsPage(document.getElementById('mainContent'));
}
document.getElementById('customerModal')?.remove();
showToast(t('customerUpdated'));
renderCustomersList();
}

function deleteCustomerFromModal(customerId) {
    const lang = settings.language;
    const customer = customers.find(c => c.id === customerId);
    const modal = document.getElementById('customerModal');
    
    if (modal) modal.remove();
    
    setTimeout(() => {
        const confirmModal = document.createElement('div');
        confirmModal.className = 'modal bottom-sheet';
        confirmModal.style.display = 'flex';
        confirmModal.innerHTML = `
            <div class="modal-content bottom-sheet-content" style="max-width: 360px; text-align: center;">
                <div class="modal-header">
                    <div class="modal-title">${lang === 'en' ? 'Delete Customer' : 'حذف العميلة'}</div>
                    <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
                </div>
                <div class="modal-body">
                    <i class="fas fa-user-slash" style="font-size: 40px; color: var(--red); margin-bottom: 12px;"></i>
                    <p style="font-size: 14px; margin-bottom: 6px;">${lang === 'en' ? 'Are you sure?' : 'هل أنت متأكد؟'}</p>
                    <p style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">${escapeHTML(customer.name)}</p>
                    <p style="font-size: 12px; color: var(--text-soft); margin-bottom: 16px;">${customer.phone || ''} · ${customer.id}</p>
                    <div style="display: flex; gap: 8px;">
                     <button class="btn btn-primary" style="flex: 1;" onclick="this.closest('.modal').remove()">
                            ${lang === 'en' ? 'Cancel' : 'إلغاء'}
                        </button>
                        <button class="btn btn-outline" style="flex: 1; color: var(--red); border-color: var(--red);" id="confirmDeleteBtn">
                            ${lang === 'en' ? 'Delete' : 'حذف'}
                        </button>
                        
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(confirmModal);
        
        document.getElementById('confirmDeleteBtn').onclick = function() {
            customers = customers.filter(c => c.id !== customerId);
            saveCustomers();
            this.closest('.modal').remove();
            renderCustomersList();
            showToast(settings.language === 'en' ? 'Customer deleted' : 'تم حذف العميلة');
             if (typeof switchPage === 'function') {
        switchPage('customers');
        }
        };
    }, 200);
}

function deleteCustomer(customerId) {
    const lang = settings.language;
    const customer = customers.find(c => c.id === customerId);
    
    showConfirmModal(
        `${lang === 'en' ? 'Delete' : 'حذف'} ${customer ? customer.name : ''}؟`,
        function() {
            customers = customers.filter(c => c.id !== customerId);
            saveCustomers();
            document.getElementById('customerModal')?.remove();
            renderCustomersList();
            showToast(t('customerDeleted'));
        }
    );
}

function viewCustomer(customerId) {
    const lang = settings.language;
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const customerInvoices = invoices.filter(inv => cleanPhoneNumber(inv.customerPhone) === customer.phone).reverse();
    const tierColor = getCustomerTierColor(customer.tier || 'normal');
    const tierName = getCustomerTierName(customer.tier || 'normal');
    
    const container = document.getElementById('mainContent');
    
    let html = `
        <div style="margin-bottom: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <button class="back-btn" onclick="switchPage('customers')"><i class="fas fa-chevron-right"></i></button>
                <button class="btn btn-outline" style="padding: 6px 12px; font-size: 11px;" onclick="openCustomerModal('${customer.id}')">
                    <i class="fas fa-edit"></i> ${lang === 'en' ? 'Edit' : 'تعديل'}
                </button>
            </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 16px;">
            <div style="width: 64px; height: 64px; border-radius: 50%; background: var(--text); color: var(--bg); 
                        display: flex; align-items: center; justify-content: center; font-size: 28px; margin: 0 auto 8px;">
                <i class="fas fa-user"></i>
            </div>
            <h3 style="font-size: 18px; font-weight: 700;">${escapeHTML(customer.name)}</h3>
            <span class="copyable-id" onclick="copyToClipboard('${customer.id}')">${customer.id}</span>
            <div style="margin-top: 4px;">
                <span style="font-size: 11px; background: ${tierColor}20; color: ${tierColor}; padding: 3px 12px; border-radius: 12px; font-weight: 600;">${tierName}</span>
            </div>
            ${customer.phone ? `<p style="font-size: 13px; color: var(--text-soft); margin-top: 4px;">${customer.phone}</p>` : ''}
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 12px;">
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800;">${customer.purchaseCount || 0}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Orders' : 'طلبات'}</div>
            </div>
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800;">${formatCurrency(customer.totalSpent || 0)}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Total' : 'الإجمالي'}</div>
            </div>
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800;">${formatCurrency(customer.totalPaid || 0)}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Paid' : 'مدفوع'}</div>
            </div>
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800; color: ${(customer.totalRemaining || 0) > 0 ? 'var(--orange)' : 'var(--text)'};">${formatCurrency(customer.totalRemaining || 0)}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Remaining' : 'متبقي'}</div>
            </div>
        </div>
    `;
    
    if (customer.notes) {
        html += `
            <div style="background: var(--card); border-radius: 16px; padding: 12px; margin-bottom: 12px; border: 1px solid var(--border);">
                <div style="font-size: 11px; color: var(--text-soft); margin-bottom: 4px;">${lang === 'en' ? 'Notes' : 'ملاحظات'}</div>
                <div style="font-size: 12px;">${escapeHTML(customer.notes)}</div>
            </div>
        `;
    }
    
    html += `
        <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">${lang === 'en' ? 'Order History' : 'سجل الطلبات'}</h3>
    `;
    
    if (customerInvoices.length === 0) {
        html += `
            <div style="text-align: center; padding: 24px; color: var(--text-soft); font-size: 12px;">
                ${lang === 'en' ? 'No orders yet' : 'لا توجد طلبات'}
            </div>
        `;
    } else {
        customerInvoices.forEach(inv => {
            html += `
                <div class="stat-card" style="margin-bottom: 6px; cursor: pointer;" onclick="viewInvoiceDetails('${inv.id}')">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <span style="font-weight: 600; font-size: 12px;">${inv.id}</span>
                            <span style="font-size: 10px; color: var(--text-soft); margin-right: 8px;">${formatDate(inv.date)}</span>
                        </div>
                        <div style="text-align: left;">
                            <span style="font-weight: 700; font-size: 12px;">${formatCurrency(inv.total)}</span>
                            <span class="status-${inv.paymentStatus === 'paid' ? 'paid' : inv.paymentStatus === 'partial' ? 'partial' : 'pending'}" style="margin-right: 6px;">
                                ${inv.paymentStatus === 'paid' ? (lang === 'en' ? 'Paid' : 'مدفوع') : inv.paymentStatus === 'partial' ? (lang === 'en' ? 'Partial' : 'عربون') : (lang === 'en' ? 'Unpaid' : 'غير مدفوع')}
                            </span>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    html += `
        <div style="display: flex; gap: 8px; margin-top: 16px; margin-bottom: 100px;">
            <button class="btn btn-wa" style="flex: 1;" onclick="openWhatsAppForCustomer('${customer.phone}')">
                <i class="fab fa-whatsapp"></i> ${lang === 'en' ? 'WhatsApp' : 'واتساب'}
            </button>
            <button class="btn btn-outline" style="flex: 1;" onclick="exportCustomerPDF('${customer.id}')">
                <i class="fas fa-file-pdf"></i> PDF
            </button>
        </div>
    `;
    
    container.innerHTML = html;
}

function openWhatsAppForCustomer(phone) {
    if (!phone) return;
    let number = cleanPhoneNumber(phone);
    if (settings.codeBehavior === 'prepend') {
        if (number.startsWith('0')) number = number.substring(1);
        number = settings.countryCode + number;
    }
    window.open(`https://wa.me/${number}`, '_blank');
}

function exportCustomerPDF(customerId) {
    const lang = settings.language;
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    const customerInvoices = invoices.filter(inv => inv.customerId === customerId || inv.customerPhone === customer.phone);
    const totalSpent = customerInvoices.reduce((s, inv) => s + (inv.total || 0), 0);
    const totalPaid = customerInvoices.reduce((s, inv) => s + (inv.paidAmount || 0), 0);
    const totalRemaining = customerInvoices.reduce((s, inv) => s + (inv.remainingAmount || 0), 0);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>${escapeHTML(customer.name)} - LORVEN</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'IBM Plex Sans Arabic', Tahoma, sans-serif; background: #F8F4F0; padding: 30px; color: #243048; display: flex; justify-content: center; }
                .card { max-width: 500px; width: 100%; background: white; border-radius: 24px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
                .header { text-align: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid #243048; }
                .logo { font-size: 24px; font-weight: 800; letter-spacing: 3px; }
                .customer-name { font-size: 20px; font-weight: 700; margin-top: 8px; }
                .id { font-size: 11px; color: #8F8A88; }
                .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 16px 0; }
                .stat { background: #F8F4F0; border-radius: 14px; padding: 14px; text-align: center; }
                .stat-label { font-size: 10px; color: #8F8A88; }
                .stat-value { font-size: 18px; font-weight: 800; color: #243048; }
                .invoices { margin-top: 16px; }
                .inv-title { font-size: 14px; font-weight: 700; margin-bottom: 10px; }
                .inv-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #E0D6D0; font-size: 12px; }
                .footer { text-align: center; font-size: 10px; color: #8F8A88; margin-top: 20px; }
                @media print { body { background: white; padding: 0; } .card { box-shadow: none; } }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="header">
                    <div class="logo">LORVEN</div>
                    <div class="customer-name">${escapeHTML(customer.name)}</div>
                    <div class="id">${customer.id} · ${customer.phone || ''}</div>
                    <div style="margin-top: 6px;">
                        <span style="background: ${getCustomerTierColor(customer.tier || 'normal')}20; color: ${getCustomerTierColor(customer.tier || 'normal')}; padding: 3px 12px; border-radius: 12px; font-weight: 600; font-size: 11px;">${getCustomerTierName(customer.tier || 'normal')}</span>
                    </div>
                </div>
                <div class="stats">
                    <div class="stat">
                        <div class="stat-label">${lang === 'en' ? 'Total Orders' : 'عدد الطلبات'}</div>
                        <div class="stat-value">${customerInvoices.length}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">${lang === 'en' ? 'Total Spent' : 'إجمالي المشتريات'}</div>
                        <div class="stat-value">${formatCurrency(totalSpent)}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">${lang === 'en' ? 'Total Paid' : 'المدفوع'}</div>
                        <div class="stat-value" style="color: #6b9e7a;">${formatCurrency(totalPaid)}</div>
                    </div>
                    <div class="stat">
                        <div class="stat-label">${lang === 'en' ? 'Remaining' : 'المتبقي'}</div>
                        <div class="stat-value" style="color: ${totalRemaining > 0 ? '#d4914a' : '#6b9e7a'};">${formatCurrency(totalRemaining)}</div>
                    </div>
                </div>
                ${customerInvoices.length > 0 ? `
                    <div class="invoices">
                        <div class="inv-title">${lang === 'en' ? 'Recent Orders' : 'آخر الطلبات'}</div>
                        ${customerInvoices.slice(-10).reverse().map(inv => `
                            <div class="inv-row">
                                <span>${inv.id}</span>
                                <span>${formatDate(inv.date)}</span>
                                <span style="font-weight: 700;">${formatCurrency(inv.total)}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="footer">© 2025 LORVEN · ${lang === 'en' ? 'Customer Report' : 'تقرير عميلة'}</div>
            </div>
        </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 400);
}

function filterCustomersByTier(tier, btn) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    if (tier === 'all') {
        renderCustomersList();
        return;
    }
    
    const filtered = customers.filter(c => (c.tier || 'normal') === tier);
    const container = document.getElementById('customersList');
    if (!container) return;
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-soft);">
                <i class="fas fa-user-slash" style="font-size: 48px; margin-bottom: 12px; opacity: 0.3;"></i>
                <p>${settings.language === 'en' ? 'No customers in this tier' : 'لا توجد عميلات بهذا التصنيف'}</p>
            </div>
        `;
        return;
    }
    
    const lang = settings.language;
    container.innerHTML = filtered.map(c => {
        const tierColor = getCustomerTierColor(c.tier || 'normal');
        const tierName = getCustomerTierName(c.tier || 'normal');
        return `
            <div class="stat-card" style="margin-bottom: 8px; cursor: pointer;" onclick="viewCustomer('${c.id}')">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 10px; height: 10px; border-radius: 50%; background: ${tierColor};"></div>
                    <div style="flex: 1;">
                        <div style="font-weight: 700; font-size: 13px;">${escapeHTML(c.name)}</div>
                        <div style="font-size: 10px; color: var(--text-soft);">
                            <span class="copyable-id" onclick="event.stopPropagation(); copyToClipboard('${c.id}')">${c.id}</span>
                            · ${c.phone || ''}
                        </div>
                    </div>
                    <div style="text-align: left;">
                        <span style="font-size: 10px; background: ${tierColor}20; color: ${tierColor}; padding: 2px 10px; border-radius: 12px; font-weight: 600;">${tierName}</span>
                    </div>
                    <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                </div>
            </div>
        `;
    }).join('');
}