// ==================== suppliers.js ====================
// صفحة المعارض - LORVEN SYS v3.0

function renderSuppliersPage(container) {
    const lang = settings.language;
    
    let html = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h3 style="font-size: 18px; font-weight: 700;">
                <i class="fas fa-store"></i> ${lang === 'en' ? 'Suppliers' : 'المعارض'}
                <span style="font-size: 12px; color: var(--text-soft);">(${suppliers.length})</span>
            </h3>
            <button class="btn btn-primary" style="padding: 8px 14px; font-size: 12px;" onclick="openSupplierModal()">
                <i class="fas fa-plus"></i> ${lang === 'en' ? 'Add' : 'أضف'}
            </button>
        </div>
        
        <div id="suppliersList"></div>
    `;
    
    container.innerHTML = html;
    renderSuppliersList();
}

function renderSuppliersList() {
    const lang = settings.language;
    const container = document.getElementById('suppliersList');
    if (!container) return;
    
    if (suppliers.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-soft);">
                <i class="fas fa-store-slash" style="font-size: 48px; margin-bottom: 12px; opacity: 0.3;"></i>
                <p>${lang === 'en' ? 'No suppliers yet' : 'لا توجد معارض'}</p>
            </div>
        `;
        return;
    }
    
    // تحديث إحصائيات المعارض
    suppliers.forEach(sup => {
        updateSupplierStats(sup.id);
    });
    
    container.innerHTML = suppliers.map(sup => {
        const activeShipments = shipments.filter(s => s.supplierId === sup.id && 
            (s.status === 'sent_to_supplier' || s.status === 'in_transit'));
        
        return `
            <div class="stat-card" style="margin-bottom: 10px; cursor: pointer;" onclick="viewSupplier('${sup.id}')">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 42px; height: 42px; background: var(--text); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--bg); font-size: 18px;">
                        <i class="fas fa-store"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="font-weight: 700; font-size: 13px;">${escapeHTML(sup.name)}</div>
                        <div style="font-size: 10px; color: var(--text-soft);">
                            ${sup.shipmentCount || 0} ${lang === 'en' ? 'shipments' : 'شحنات'} 
                            · ${sup.totalItems || 0} ${lang === 'en' ? 'items' : 'منتج'}
                            ${sup.preparationDays ? ` · ${sup.preparationDays} ${lang === 'en' ? 'days prep' : 'يوم تجهيز'}` : ''}
                        </div>
                    </div>
                    ${activeShipments.length > 0 ? `
                        <span style="font-size: 10px; background: var(--blue)20; color: var(--blue); padding: 2px 8px; border-radius: 10px;">
                            ${activeShipments.length} ${lang === 'en' ? 'active' : 'نشط'}
                        </span>
                    ` : ''}
                    <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                </div>
            </div>
        `;
    }).join('');
}

function openSupplierModal(existingSupplierId = null) {
    const lang = settings.language;
    const existing = existingSupplierId ? suppliers.find(s => s.id === existingSupplierId) : null;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'supplierModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 380px;">
            <div class="modal-header">
                <div class="modal-title">
                    <i class="fas fa-store"></i> 
                    ${existing ? (lang === 'en' ? 'Edit Supplier' : 'تعديل معرض') : (lang === 'en' ? 'New Supplier' : 'معرض جديد')}
                </div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">${lang === 'en' ? 'Supplier Name' : 'اسم المعرض'}</label>
                    <input type="text" class="form-control" id="supplierName" value="${existing ? escapeHTML(existing.name) : ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">${lang === 'en' ? 'Phone' : 'رقم التواصل'}</label>
                    <input type="tel" class="form-control" id="supplierPhone" value="${existing ? existing.phone || '' : ''}" inputmode="numeric">
                </div>
                
                <div class="form-group">
                    <label class="form-label">${lang === 'en' ? 'Location' : 'الموقع'}</label>
                    <input type="text" class="form-control" id="supplierLocation" value="${existing ? existing.location || '' : ''}">
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                    <div class="form-group">
                        <label class="form-label">${lang === 'en' ? 'Prep. Days' : 'أيام التجهيز'}</label>
                        <input type="number" class="form-control" id="supplierPrepDays" value="${existing ? existing.preparationDays || 7 : 7}" inputmode="numeric" min="1">
                    </div>
                    <div class="form-group">
                        <label class="form-label">${lang === 'en' ? 'Shipping Days' : 'أيام الشحن'}</label>
                        <input type="number" class="form-control" id="supplierShipDays" value="${existing ? existing.shippingDays || 5 : 5}" inputmode="numeric" min="1">
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">${lang === 'en' ? 'Notes' : 'ملاحظات'}</label>
                    <textarea class="form-control" id="supplierNotes" rows="2">${existing ? existing.notes || '' : ''}</textarea>
                </div>
                
                <button class="btn btn-primary" style="width: 100%;" onclick="${existing ? `updateSupplier('${existing.id}')` : 'saveSupplier()'}">
                    ${lang === 'en' ? 'Save' : 'حفظ'}
                </button>
                
                ${existing ? `
                    <button class="btn btn-outline" style="width: 100%; margin-top: 8px; color: var(--red); border-color: var(--red);" 
                            onclick="deleteSupplier('${existing.id}')">
                        ${lang === 'en' ? 'Delete Supplier' : 'حذف المعرض'}
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function saveSupplier() {
    const lang = settings.language;
    const name = document.getElementById('supplierName').value.trim();
    
    if (!name) {
        showToast(t('fillFields'));
        return;
    }
    
    const supplier = {
        id: 'SUP-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        name: name,
        phone: document.getElementById('supplierPhone').value.trim(),
        location: document.getElementById('supplierLocation').value.trim(),
        preparationDays: parseInt(document.getElementById('supplierPrepDays').value) || 7,
        shippingDays: parseInt(document.getElementById('supplierShipDays').value) || 5,
        notes: document.getElementById('supplierNotes').value.trim(),
        shipmentCount: 0,
        totalItems: 0,
        createdAt: new Date().toISOString()
    };
    
    suppliers.push(supplier);
    saveSuppliers();
    
    document.getElementById('supplierModal')?.remove();
    renderSuppliersList();
    showToast(t('supplierAdded'));
}

function updateSupplier(supplierId) {
    const supplier = suppliers.find(s => s.id === supplierId);
    if (!supplier) return;
    
    const name = document.getElementById('supplierName').value.trim();
    if (!name) {
        showToast(t('fillFields'));
        return;
    }
    
    supplier.name = name;
    supplier.phone = document.getElementById('supplierPhone').value.trim();
    supplier.location = document.getElementById('supplierLocation').value.trim();
    supplier.preparationDays = parseInt(document.getElementById('supplierPrepDays').value) || 7;
    supplier.shippingDays = parseInt(document.getElementById('supplierShipDays').value) || 5;
    supplier.notes = document.getElementById('supplierNotes').value.trim();
    
    saveSuppliers();
    document.getElementById('supplierModal')?.remove();
    renderSuppliersList();
    showToast(t('saved'));
}

function deleteSupplier(supplierId) {
    const lang = settings.language;
    const supplier = suppliers.find(s => s.id === supplierId);
    
    showConfirmModal(
        `${lang === 'en' ? 'Delete' : 'حذف'} ${supplier ? supplier.name : ''}؟`,
        function() {
            suppliers = suppliers.filter(s => s.id !== supplierId);
            saveSuppliers();
            document.getElementById('supplierModal')?.remove();
            renderSuppliersList();
            showToast(t('deleted'));
        }
    );
}

function viewSupplier(supplierId) {
    const lang = settings.language;
    const supplier = suppliers.find(s => s.id === supplierId);
    if (!supplier) return;
    
    const supplierShipments = shipments.filter(s => s.supplierId === supplierId).reverse();
    const activeShipments = supplierShipments.filter(s => 
        s.status === 'collecting' || s.status === 'sent_to_supplier' || s.status === 'in_transit'
    );
    
    const container = document.getElementById('mainContent');
    
    let html = `
        <div style="margin-bottom: 14px;">
            <div style="display: flex; align-items: center; justify-content: space-between;">
                <button class="back-btn" onclick="switchPage('suppliers')"><i class="fas fa-chevron-right"></i></button>
                <button class="btn btn-outline" style="padding: 6px 12px; font-size: 11px;" onclick="openSupplierModal('${supplier.id}')">
                    <i class="fas fa-edit"></i> ${lang === 'en' ? 'Edit' : 'تعديل'}
                </button>
            </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 16px;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: var(--text); color: var(--bg); 
                        display: flex; align-items: center; justify-content: center; font-size: 24px; margin: 0 auto 8px;">
                <i class="fas fa-store"></i>
            </div>
            <h3 style="font-size: 18px; font-weight: 700;">${escapeHTML(supplier.name)}</h3>
            ${supplier.location ? `<p style="font-size: 12px; color: var(--text-soft);">${escapeHTML(supplier.location)}</p>` : ''}
            ${supplier.phone ? `<p style="font-size: 12px;">${supplier.phone}</p>` : ''}
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 12px;">
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800;">${supplier.shipmentCount || 0}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Shipments' : 'شحنات'}</div>
            </div>
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800;">${supplier.totalItems || 0}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Items' : 'منتج'}</div>
            </div>
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800;">${supplier.preparationDays || 7}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Prep Days' : 'أيام تجهيز'}</div>
            </div>
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800;">${supplier.shippingDays || 5}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Ship Days' : 'أيام شحن'}</div>
            </div>
        </div>
        
        ${supplier.notes ? `
            <div style="background: var(--card); border-radius: 16px; padding: 12px; margin-bottom: 12px; border: 1px solid var(--border);">
                <div style="font-size: 11px; color: var(--text-soft);">${lang === 'en' ? 'Notes' : 'ملاحظات'}</div>
                <div style="font-size: 12px;">${escapeHTML(supplier.notes)}</div>
            </div>
        ` : ''}
        
        <h3 style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">
            ${lang === 'en' ? 'Shipments' : 'الشحنات'}
            <span style="font-size: 11px; color: var(--text-soft);">(${supplierShipments.length})</span>
        </h3>
    `;
    
    if (supplierShipments.length === 0) {
        html += `
            <div style="text-align: center; padding: 24px; color: var(--text-soft); font-size: 12px;">
                ${lang === 'en' ? 'No shipments yet' : 'لا توجد شحنات'}
            </div>
        `;
    } else {
        supplierShipments.forEach(s => {
            const progress = s.itemCount && s.maxItems ? Math.round((s.itemCount / s.maxItems) * 100) : 0;
            html += `
                <div class="stat-card" style="margin-bottom: 6px; cursor: pointer;" onclick="viewShipment('${s.id}')">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                        <span style="font-weight: 600; font-size: 12px;">${s.id}</span>
                        <span style="font-size: 10px; color: var(--text-soft);">${formatDate(s.startDate)}</span>
                    </div>
                    <div style="background: var(--hover); border-radius: 6px; height: 4px; overflow: hidden;">
                        <div style="width: ${progress}%; height: 100%; background: var(--text); border-radius: 6px;"></div>
                    </div>
                    <div style="font-size: 10px; color: var(--text-soft); margin-top: 2px;">
                        ${s.itemCount || 0}/${s.maxItems} ${lang === 'en' ? 'items' : 'منتج'}
                    </div>
                </div>
            `;
        });
    }
    
    html += `
        <div style="margin-top: 14px;">
            <button class="btn btn-wa" style="width: 100%;" onclick="openWhatsAppForSupplier('${supplier.phone}')">
                <i class="fab fa-whatsapp"></i> ${lang === 'en' ? 'Contact Supplier' : 'تواصل مع المعرض'}
            </button>
        </div>
    `;
    
    container.innerHTML = html;
}

function openWhatsAppForSupplier(phone) {
    if (!phone) {
        showToast(settings.language === 'en' ? 'No phone number' : 'لا يوجد رقم تواصل');
        return;
    }
    let number = phone.replace(/\D/g, '');
    if (settings.codeBehavior === 'prepend' && number.startsWith('0')) {
        number = number.substring(1);
        number = settings.countryCode + number;
    }
    window.open(`https://wa.me/${number}`, '_blank');
}

console.log('✅ suppliers.js loaded');