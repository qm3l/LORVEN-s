// ==================== shipments.js ====================
// نظام الشحنات - LORVEN SYS v3.0

// عرض صفحة الشحنات الرئيسية مع فلتر
function renderShipmentsPage(container) {
    const lang = settings.language;
    const filter = sessionStorage.getItem('shipmentFilter') || 'all';
    
    // حساب الإحصائيات
    const stats = {
        all: shipments.length,
        open: shipments.filter(s => s.status === 'open').length,
        closed: shipments.filter(s => s.status === 'closed').length,
        delivered: shipments.filter(s => s.status === 'delivered').length
    };
    
    let filteredShipments = shipments;
    if (filter === 'open') filteredShipments = shipments.filter(s => s.status === 'open');
    if (filter === 'closed') filteredShipments = shipments.filter(s => s.status === 'closed');
    if (filter === 'delivered') filteredShipments = shipments.filter(s => s.status === 'delivered');
    
    const sorted = [...filteredShipments].reverse();
    
    let html = `
        <div style="margin-bottom: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <h3 style="font-size: 18px; font-weight: 700;">
                    <i class="fas fa-truck"></i> ${lang === 'en' ? 'Shipments' : 'الشحنات'}
                </h3>
            </div>
            
            <!-- أزرار الفلتر -->
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
                <button class="filter-btn ${filter === 'all' ? 'active' : ''}" onclick="setShipmentFilter('all')">
                    ${lang === 'en' ? 'All' : 'الكل'} (${stats.all})
                </button>
                <button class="filter-btn ${filter === 'open' ? 'active' : ''}" onclick="setShipmentFilter('open')">
                    <span style="color: var(--blue);">●</span> ${lang === 'en' ? 'Open' : 'مفتوحة'} (${stats.open})
                </button>
                <button class="filter-btn ${filter === 'closed' ? 'active' : ''}" onclick="setShipmentFilter('closed')">
                    <span style="color: var(--orange);">●</span> ${lang === 'en' ? 'Pending' : 'غير مستلمة'} (${stats.closed})
                </button>
                <button class="filter-btn ${filter === 'delivered' ? 'active' : ''}" onclick="setShipmentFilter('delivered')">
                    <span style="color: var(--green);">●</span> ${lang === 'en' ? 'Delivered' : 'مستلمة'} (${stats.delivered})
                </button>
            </div>
        </div>
    `;
    
    if (filteredShipments.length === 0) {
        html += `
            <div style="text-align: center; padding: 40px; color: var(--text-soft);">
                <i class="fas fa-truck-open" style="font-size: 48px; margin-bottom: 12px; opacity: 0.3;"></i>
                <p>${lang === 'en' ? 'No shipments found' : 'لا توجد شحنات'}</p>
            </div>
        `;
    } else {
        sorted.forEach(s => {
            const statusInfo = getStatusInfo(s.status, lang);
            
            html += `
                <div class="stat-card" style="margin-bottom: 10px;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                        <span class="copyable-id" onclick="event.stopPropagation(); copyToClipboard('${s.id}')">${s.id}</span>
                        <span style="font-size: 10px; background: ${statusInfo.bg}; color: ${statusInfo.color}; padding: 3px 10px; border-radius: 12px; font-weight: 600;">${statusInfo.text}</span>
                    </div>
                    <div style="font-size: 11px; color: var(--text-soft); margin-bottom: 8px;">
                        ${s.orderCount || s.invoiceCount || 0} ${lang === 'en' ? 'orders' : 'طلبات'}
                        · ${s.itemCount || 0} ${lang === 'en' ? 'items' : 'منتج'}
                        · ${formatCurrency(s.totalAmount || 0)}
                    </div>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-outline" style="flex: 1; font-size: 11px;" onclick="viewShipmentDetails('${s.id}')">
                            <i class="fas fa-eye"></i> ${lang === 'en' ? 'View' : 'عرض'}
                        </button>
                        ${s.status === 'open' ? `
                            <button class="btn btn-outline" style="flex: 0.5; font-size: 11px; color: var(--orange);" onclick="quickCloseShipment('${s.id}')">
                                <i class="fas fa-lock"></i>
                            </button>
                        ` : s.status === 'closed' ? `
                            <button class="btn btn-outline" style="flex: 0.5; font-size: 11px; color: var(--green);" onclick="quickReopenShipment('${s.id}')">
                                <i class="fas fa-lock-open"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            `;
        });
    }
    
    container.innerHTML = html;
}

function setShipmentFilter(filter) {
    sessionStorage.setItem('shipmentFilter', filter);
    if (currentPage === 'shipments') {
        renderShipmentsPage(document.getElementById('mainContent'));
    }
}

function getStatusInfo(status, lang) {
    const statusMap = {
        open: { color: 'var(--blue)', text: lang === 'en' ? 'Open' : 'مفتوحة', bg: 'rgba(91,140,201,0.1)' },
        closed: { color: 'var(--orange)', text: lang === 'en' ? 'Pending' : 'غير مستلمة', bg: 'rgba(212,145,74,0.1)' },
        delivered: { color: 'var(--green)', text: lang === 'en' ? 'Delivered' : 'مستلمة', bg: 'rgba(107,158,122,0.1)' }
    };
    return statusMap[status] || statusMap.open;
}

function quickCloseShipment(shipmentId) {
    const lang = settings.language;
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title">${lang === 'en' ? 'Close Shipment' : 'إغلاق الشحنة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <i class="fas fa-truck" style="font-size: 40px; color: var(--orange); margin-bottom: 12px;"></i>
                <p style="font-size: 14px; margin-bottom: 4px;">${lang === 'en' ? 'Close this shipment?' : 'هل تريد إغلاق هذه الشحنة؟'}</p>
                <p style="font-size: 16px; font-weight: 700; margin-bottom: 8px;">${shipmentId}</p>
                <p style="font-size: 11px; color: var(--text-soft); margin-bottom: 16px;">
                    ${lang === 'en' ? 'It will be marked as closed and expected arrival will be set.' : 'سيتم تعليمها كمغلقة وتحديد تاريخ وصول متوقع.'}
                </p>
                <div style="display: flex; gap: 8px;">
                 <button class="btn btn-primary" style="flex: 1;" onclick="this.closest('.modal').remove()">
                        ${lang === 'en' ? 'Cancel' : 'إلغاء'}
                    </button>
                    <button class="btn btn-outline" style="flex: 1; color: var(--orange); border-color: var(--orange);" id="confirmCloseBtn">
                        ${lang === 'en' ? 'Close' : 'إغلاق'}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('confirmCloseBtn').onclick = function() {
        shipment.status = 'closed';
        shipment.closedAt = new Date().toISOString();
        const arrival = new Date();
        arrival.setDate(arrival.getDate() + (settings.shipmentDurationDays || 7));
        shipment.expectedArrival = arrival.toISOString();
        saveShipments();
        this.closest('.modal').remove();
        renderShipmentsPage(document.getElementById('mainContent'));
        showToast(lang === 'en' ? 'Shipment closed' : 'تم إغلاق الشحنة');
    };
}

function quickReopenShipment(shipmentId) {
    const lang = settings.language;
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title">${lang === 'en' ? 'Reopen Shipment' : 'إعادة فتح الشحنة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <i class="fas fa-truck-open" style="font-size: 40px; color: var(--green); margin-bottom: 12px;"></i>
                <p style="font-size: 14px; margin-bottom: 4px;">${lang === 'en' ? 'Reopen this shipment?' : 'هل تريد إعادة فتح هذه الشحنة؟'}</p>
                <p style="font-size: 16px; font-weight: 700; margin-bottom: 16px;">${shipmentId}</p>
                <div style="display: flex; gap: 8px;">
                <button class="btn btn-primary" style="flex: 1;" onclick="this.closest('.modal').remove()">
                        ${lang === 'en' ? 'Cancel' : 'إلغاء'}
                    </button>
                    <button class="btn btn-outline" style="flex: 1; color: var(--green); border-color: var(--green);" id="confirmReopenBtn">
                        ${lang === 'en' ? 'Reopen' : 'إعادة فتح'}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('confirmReopenBtn').onclick = function() {
        shipment.status = 'open';
        shipment.closedAt = null;
        shipment.expectedArrival = null;
        saveShipments();
        this.closest('.modal').remove();
        renderShipmentsPage(document.getElementById('mainContent'));
        showToast(lang === 'en' ? 'Shipment reopened' : 'تم إعادة فتح الشحنة');
    };
}

// عرض تفاصيل الشحنة (مودال Bottom Sheet)
function viewShipmentDetails(shipmentId) {
    const lang = settings.language;
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment) return;
    
    const shipmentInvoices = invoices.filter(inv => inv.shipmentId === shipmentId);
    const allItems = [];
    shipmentInvoices.forEach(inv => {
        inv.items.forEach(item => {
            allItems.push({
                ...item,
                invoiceId: inv.id,
                customerName: inv.customerName,
                isDelivered: inv.deliveryStatus === 'delivered'
            });
        });
    });
    
    const statusInfo = getStatusInfo(shipment.status, lang);
    const isReadOnly = shipment.status !== 'open';
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 500px; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header" style="position: sticky; top: 0; background: var(--bg); z-index: 10;">
                <div class="modal-title">
                    <i class="fas fa-truck"></i> ${shipment.id}
                </div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <!-- معلومات الشحنة -->
                <div class="stat-card" style="margin-bottom: 12px;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; text-align: center;">
                        <div>
                            <div style="font-size: 20px; font-weight: 800;">${shipment.orderCount || shipmentInvoices.length}</div>
                            <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Orders' : 'طلبات'}</div>
                        </div>
                        <div>
                            <div style="font-size: 20px; font-weight: 800;">${shipment.itemCount || allItems.length}</div>
                            <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Items' : 'منتجات'}</div>
                        </div>
                        <div>
                            <div style="font-size: 20px; font-weight: 800;">${formatCurrency(shipment.totalAmount || 0)}</div>
                            <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Total' : 'الإجمالي'}</div>
                        </div>
                    </div>
                </div>
                
                <!-- حالة الشحنة -->
                <div style="margin-bottom: 12px;">
                    <label style="font-size: 11px; display: block; margin-bottom: 4px;">${lang === 'en' ? 'Status' : 'الحالة'}</label>
                    <div class="option-selector" onclick="openShipmentStatusModal('${shipment.id}')" style="margin-bottom: 0;">
                        <div class="selected-option">
                            <span id="shipmentStatusText_${shipment.id}">${statusInfo.text}</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                </div>
                
                <!-- زر تأكيد الاستلام (يظهر فقط للشحنات الغير مستلمة) -->
                
${getShipmentDelayDays(shipment.id) > 0 ? `
    <button class="btn btn-outline" style="width: 100%; margin-bottom: 12px; color: var(--orange);" onclick="sendApologyForDelayedShipment('${shipment.id}')">
        <i class="fab fa-whatsapp"></i> ${lang === 'en' ? 'Send Apology' : 'إرسال اعتذار للتأخير'}
    </button>
` : ''}
                ${shipment.status === 'closed' && !shipment.deliveryConfirmed ? `
                    <button class="btn btn-primary" style="width: 100%; margin-bottom: 12px;" onclick="confirmShipmentDelivery('${shipment.id}')">
                        <i class="fas fa-check-circle"></i> ${lang === 'en' ? 'Confirm Delivery' : 'تأكيد استلام الشحنة'}
                    </button>
                ` : ''}
                
                <!-- قائمة الفواتير -->
                <div style="margin-top: 12px;">
                    <div style="font-weight: 700; font-size: 13px; margin-bottom: 8px;">
                        <i class="fas fa-receipt"></i> ${lang === 'en' ? 'Invoices' : 'الفواتير'} (${shipmentInvoices.length})
                    </div>
                    ${shipmentInvoices.length === 0 ? `
                        <div style="text-align: center; padding: 20px; color: var(--text-soft);">
                            ${lang === 'en' ? 'No invoices' : 'لا توجد فواتير'}
                        </div>
                    ` : `
                        ${shipmentInvoices.map(inv => `
                            <div class="stat-card" style="margin-bottom: 8px; ${isReadOnly ? 'opacity: 0.8;' : 'cursor: pointer;'}" 
                                 onclick="${isReadOnly ? '' : `viewInvoiceDetails('${inv.id}')`}">
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <span style="font-weight: 600; font-size: 12px;">${inv.id}</span>
                                        <span style="font-size: 10px; color: var(--text-soft); margin-right: 8px;">${escapeHTML(inv.customerName || '')}</span>
                                    </div>
                                    <span style="font-weight: 700;">${formatCurrency(inv.total)}</span>
                                </div>
                                <div style="font-size: 10px; color: var(--text-soft); margin-top: 4px;">
                                    ${inv.items.length} ${lang === 'en' ? 'items' : 'منتجات'} · ${formatDate(inv.date)}
                                    ${inv.deliveryStatus === 'delivered' ? ' · ✅' : inv.deliveryStatus === 'not_delivered' ? ' · ❌' : ''}
                                </div>
                            </div>
                        `).join('')}
                    `}
                </div>
                
                <!-- جميع المنتجات -->
                <div style="margin-top: 12px;">
                    <div style="font-weight: 700; font-size: 13px; margin-bottom: 8px;">
                        <i class="fas fa-truckes"></i> ${lang === 'en' ? 'All Products' : 'جميع المنتجات'} (${allItems.length})
                    </div>
                    <div style="max-height: 250px; overflow-y: auto;">
                        ${allItems.map((item, idx) => `
                            <div style="display: flex; align-items: center; padding: 6px 0; border-bottom: 1px solid var(--border); gap: 8px;">
                                <span style="font-size: 10px; color: var(--text-soft);">${idx + 1}</span>
                                <div style="flex: 1;">
                                    <div style="font-weight: 600; font-size: 12px;">${escapeHTML(item.name)}</div>
                                    <div style="font-size: 9px; color: var(--text-soft);">
                                        ${item.quantity} × ${formatCurrency(item.price)} = ${formatCurrency(item.price * item.quantity)}
                                        <span style="margin-right: 8px;">· ${item.invoiceId}</span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// مودال اختيار حالة الشحنة (أزرار مثل الإعدادات)
function openShipmentStatusModal(shipmentId) {
    const lang = settings.language;
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 360px;">
            <div class="modal-header">
                <div class="modal-title">${lang === 'en' ? 'Shipment Status' : 'حالة الشحنة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn ${shipment.status === 'open' ? 'selected' : ''}" onclick="updateShipmentStatus('${shipmentId}', 'open')">
                    ${lang === 'en' ? 'Open' : 'مفتوحة'}
                </button>
                <button class="option-btn ${shipment.status === 'closed' ? 'selected' : ''}" onclick="updateShipmentStatus('${shipmentId}', 'closed')">
                    ${lang === 'en' ? 'Pending (Arrived)' : 'غير مستلمة (وصلت)'}
                </button>
                <button class="option-btn ${shipment.status === 'delivered' ? 'selected' : ''}" onclick="updateShipmentStatus('${shipmentId}', 'delivered')">
                    ${lang === 'en' ? 'Delivered' : 'مستلمة'}
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function updateShipmentStatus(shipmentId, newStatus) {
    const lang = settings.language;
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment) return;
    
    const oldStatus = shipment.status;
    shipment.status = newStatus;
    
    if (newStatus === 'closed' && oldStatus !== 'closed') {
        shipment.closedAt = new Date().toISOString();
        const arrival = new Date();
        arrival.setDate(arrival.getDate() + (settings.shipmentDurationDays || 7));
        shipment.expectedArrival = arrival.toISOString();
        shipment.deliveryConfirmed = false;
        
        // إشعار وصول الشحنة
        showToast(lang === 'en' ? 'Shipment arrived! Confirm delivery?' : 'وصلت الشحنة! هل تريد تأكيد الاستلام؟');
        
    } else if (newStatus === 'open') {
        shipment.closedAt = null;
        shipment.expectedArrival = null;
        shipment.deliveryConfirmed = false;
        
    } else if (newStatus === 'delivered') {
        shipment.deliveryConfirmed = true;
        
        // تحديث حالة كل الفواتير إلى delivered
        const shipmentInvoices = invoices.filter(inv => inv.shipmentId === shipmentId);
        shipmentInvoices.forEach(inv => {
            inv.deliveryStatus = 'delivered';
        });
        saveInvoices();
    }
    
    saveShipments();
    
    // تحديث النص المعروض
    const statusSpan = document.getElementById(`shipmentStatusText_${shipmentId}`);
    if (statusSpan) {
        const statusInfo = getStatusInfo(newStatus, lang);
        statusSpan.textContent = statusInfo.text;
    }
    
    document.querySelectorAll('.modal').forEach(m => m.remove());
    showToast(lang === 'en' ? `Status updated` : `تم تحديث الحالة`);
    
    // إعادة فتح المودال للتحديث
    viewShipmentDetails(shipmentId);
}

// تأكيد استلام الشحنة (تحويل من closed إلى delivered)
function confirmShipmentDelivery(shipmentId) {
    const lang = settings.language;
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment || shipment.status !== 'closed') return;
    
    showConfirmModal(
        lang === 'en' ? `Confirm delivery of shipment ${shipmentId}? This will mark all invoices as delivered.` : `تأكيد استلام الشحنة ${shipmentId}؟ سيتم تصنيف جميع الفواتير كمستلمة.`,
        () => {
            updateShipmentStatus(shipmentId, 'delivered');
        }
    );
}

// إضافة طلب للشحنة (مع منع المضاعفة)
function addOrderToShipment(invoice) {
    let shipment = shipments.find(s => s.status === 'open');
    
    if (!shipment) {
        shipment = {
            id: generateShipmentId(),
            orderIds: [],
            itemCount: 0,
            totalAmount: 0,
            orderCount: 0,
            status: 'open',
            createdAt: new Date().toISOString(),
            closedAt: null,
            expectedArrival: null,
            deliveryConfirmed: false
        };
        shipments.push(shipment);
    }
    
    // منع إضافة الفاتورة مرتين (حل مشكلة المنتج المضاعف)
    if (!shipment.orderIds.includes(invoice.id)) {
        shipment.orderIds.push(invoice.id);
        shipment.orderCount = shipment.orderIds.length;
        
        // حساب عدد المنتجات مرة واحدة فقط
        const itemQuantity = invoice.items.reduce((sum, i) => sum + (i.quantity || 1), 0);
        shipment.itemCount += itemQuantity;
        shipment.totalAmount += invoice.total || 0;
        invoice.shipmentId = shipment.id;
    }
    
    // إغلاق تلقائي عند 20 طلب
    const maxOrders = settings.shipmentMaxOrders || 20;
    if (shipment.orderCount >= maxOrders) {
        shipment.status = 'closed';
        shipment.closedAt = new Date().toISOString();
        const arrival = new Date();
        arrival.setDate(arrival.getDate() + (settings.shipmentDurationDays || 7));
        shipment.expectedArrival = arrival.toISOString();
    }
    
    saveShipments();
    return shipment.id;
}

// إزالة طلب من الشحنة
function removeOrderFromShipment(invoiceId) {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice || !invoice.shipmentId) return;
    
    const shipment = shipments.find(s => s.id === invoice.shipmentId);
    if (!shipment) return;
    
    const idx = shipment.orderIds.indexOf(invoiceId);
    if (idx > -1) shipment.orderIds.splice(idx, 1);
    
    shipment.orderCount = shipment.orderIds.length;
    
    const itemQuantity = invoice.items.reduce((sum, i) => sum + (i.quantity || 1), 0);
    shipment.itemCount = Math.max(0, shipment.itemCount - itemQuantity);
    shipment.totalAmount = Math.max(0, shipment.totalAmount - (invoice.total || 0));
    
    if (shipment.orderCount <= 0 && shipment.status === 'open') {
        const index = shipments.findIndex(s => s.id === shipment.id);
        if (index > -1) shipments.splice(index, 1);
    }
    
    saveShipments();
}

// الحصول على شحنة مفتوحة أو إنشاء جديدة
function getOpenShipment() {
    let shipment = shipments.find(s => s.status === 'open');
    if (!shipment) {
        shipment = {
            id: generateShipmentId(),
            orderIds: [],
            itemCount: 0,
            totalAmount: 0,
            orderCount: 0,
            status: 'open',
            createdAt: new Date().toISOString(),
            closedAt: null,
            expectedArrival: null,
            deliveryConfirmed: false
        };
        shipments.push(shipment);
        saveShipments();
    }
    return shipment;
}

// حساب أيام التأخير للشحنة
function getShipmentDelayDays(shipmentId) {
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment || !shipment.expectedArrival || shipment.status === 'delivered') return 0;
    
    const now = new Date();
    const expected = new Date(shipment.expectedArrival);
    
    if (now > expected) {
        return Math.ceil((now - expected) / (1000 * 60 * 60 * 24));
    }
    return 0;
}

// إرسال رسالة اعتذار للشحنة المتأخرة
function sendApologyForDelayedShipment(shipmentId) {
    const lang = settings.language;
    const shipment = shipments.find(s => s.id === shipmentId);
    if (!shipment) return;
    
    const delay = getShipmentDelayDays(shipmentId);
    if (delay <= 0) {
        showToast(lang === 'en' ? 'Shipment is not delayed' : 'الشحنة غير متأخرة');
        return;
    }
    
    const shipmentInvoices = invoices.filter(inv => inv.shipmentId === shipmentId);
    const sentPhones = new Set();
    
    shipmentInvoices.forEach((inv, index) => {
        if (inv.customerPhone && !sentPhones.has(inv.customerPhone)) {
            sentPhones.add(inv.customerPhone);
            
            const firstName = inv.customerName?.split(' ')[0] || (lang === 'en' ? 'Customer' : 'عميلتنا');
            const message = (settings.apologyTemplate || 'عزيزتي {firstName}، نعتذر عن تأخر شحنتكِ {shipmentId} لمدة {delay} أيام.')
                .replace('{firstName}', firstName)
                .replace('{shipmentId}', shipmentId)
                .replace('{delay}', delay);
            
            let phone = cleanPhoneNumber(inv.customerPhone);
            if (settings.codeBehavior === 'prepend') {
                if (phone.startsWith('0')) phone = phone.substring(1);
                phone = settings.countryCode + phone;
            }
            
            setTimeout(() => {
                window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
            }, index * 500);
        }
    });
    
    showToast(lang === 'en' ? 'Apology messages sent' : 'تم إرسال رسائل الاعتذار');
}

// دالة مؤقتة للعرض (سيتم استكمالها)
function viewShipment(shipmentId) {
    viewShipmentDetails(shipmentId);
}