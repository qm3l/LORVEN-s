// ==================== bundles.js ====================
// نظام البوكسات - LORVEN SYS v3.0

function renderBundlesPage(container) {
    const lang = settings.language;
    
    let html = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h3 style="font-size: 18px; font-weight: 700;">
                <i class="fas fa-cube"></i> ${lang === 'en' ? 'Boxes' : 'البوكسات'}
                <span style="font-size: 12px; color: var(--text-soft);">(${bundles.length})</span>
            </h3>
            <button class="btn btn-primary" style="padding: 8px 14px; font-size: 12px;" onclick="openBundleModal()">
                <i class="fas fa-plus"></i> ${lang === 'en' ? 'New Box' : 'بوكس جديد'}
            </button>
        </div>
        
        <div id="bundlesList"></div>
    `;
    
    container.innerHTML = html;
    renderBundlesList();
}

function renderBundlesList() {
    const lang = settings.language;
    const container = document.getElementById('bundlesList');
    if (!container) return;
    
    if (bundles.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-soft);">
                <i class="fas fa-cube" style="font-size: 48px; margin-bottom: 12px; opacity: 0.3;"></i>
                <p>${lang === 'en' ? 'No boxes yet' : 'لا توجد بوكسات'}</p>
                <button class="btn btn-primary" style="margin-top: 12px;" onclick="openBundleModal()">
                    <i class="fas fa-plus"></i> ${lang === 'en' ? 'Add First Box' : 'أضف أول بوكس'}
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = bundles.map(b => `
        <div class="stat-card" style="margin-bottom: 10px; cursor: pointer;" onclick="openBundleModal('${b.id}')">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 42px; height: 42px; background: var(--text); border-radius: 12px; display: flex; align-items: center; justify-content: center; color: var(--bg); font-size: 18px;">
                    <i class="fas fa-cube"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 700; font-size: 13px;">${escapeHTML(b.name)}</div>
                    <div style="font-size: 10px; color: var(--text-soft);">
                        ${b.items ? b.items.length : 0} ${lang === 'en' ? 'items' : 'منتج'} 
                        · ${lang === 'en' ? 'Sold' : 'تم بيعه'} ${b.salesCount || 0} ${lang === 'en' ? 'times' : 'مرة'}
                    </div>
                </div>
                <div style="font-weight: 700; font-size: 13px;">${formatCurrency(b.price)}</div>
                <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
            </div>
        </div>
    `).join('');
}

function openBundleModal(existingBundleId = null) {
    const lang = settings.language;
    const existing = existingBundleId ? bundles.find(b => b.id === existingBundleId) : null;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'bundleModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 400px;">
            <div class="modal-header">
                <div class="modal-title">
                    <i class="fas fa-cube"></i> 
                    ${existing 
                        ? (lang === 'en' ? 'Edit Box' : 'تعديل بوكس')
                        : (lang === 'en' ? 'New Box' : 'بوكس جديد')}
                </div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">${lang === 'en' ? 'Box Name' : 'اسم البوكس'} <span style="color: var(--red);">*</span></label>
                    <input type="text" class="form-control" id="bundleName" value="${existing ? escapeHTML(existing.name) : ''}" 
                           placeholder="${lang === 'en' ? 'e.g., Bridal Box' : 'مثال: عناية بالبشرة'}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">${lang === 'en' ? 'Total Price' : 'السعر الإجمالي'} <span style="color: var(--red);">*</span></label>
                    <input type="number" class="form-control" id="bundlePrice" value="${existing ? existing.price : ''}" 
                           placeholder="0.00" inputmode="numeric" min="0">
                </div>
                
                <div class="form-group">
                    <label class="form-label">${lang === 'en' ? 'Items' : 'المحتويات'}</label>
                    <div id="bundleItems">
                        ${existing && existing.items && existing.items.length > 0 ? existing.items.map((item, idx) => `
                            <div style="display: flex; gap: 6px; margin-bottom: 6px;">
                                <input type="text" class="form-control bundle-item-name" value="${escapeHTML(item.name)}" 
                                       placeholder="${lang === 'en' ? 'Item name' : 'اسم المنتج'}" style="flex: 2;">
                                <input type="number" class="form-control bundle-item-qty" value="${item.quantity || 1}" 
                                       placeholder="1" style="flex: 0.5;" min="1" inputmode="numeric">
                                <button class="btn btn-outline" onclick="this.parentElement.remove()" style="padding: 8px;">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `).join('') : `
                            <div style="display: flex; gap: 6px; margin-bottom: 6px;">
                                <input type="text" class="form-control bundle-item-name" placeholder="${lang === 'en' ? 'Item name' : 'اسم المنتج'}" style="flex: 2;">
                                <input type="number" class="form-control bundle-item-qty" value="1" style="flex: 0.5;" min="1" inputmode="numeric">
                                <button class="btn btn-outline" onclick="this.parentElement.remove()" style="padding: 8px;">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                        `}
                    </div>
                    <button class="btn btn-outline" style="width: 100%; margin-top: 6px; font-size: 11px;" onclick="addBundleItem()">
                        <i class="fas fa-plus"></i> ${lang === 'en' ? 'Add Item' : 'إضافة منتج'}
                    </button>
                </div>
                
                <button class="btn btn-primary" style="width: 100%;" onclick="${existing ? `updateBundle('${existing.id}')` : 'saveBundle()'}">
                    ${lang === 'en' ? 'Save' : 'حفظ'}
                </button>
                
                ${existing ? `
                    <button class="btn btn-outline" style="width: 100%; margin-top: 8px; color: var(--red); border-color: var(--red);" 
                            onclick="deleteBundleFromModal('${existing.id}')">
                        ${lang === 'en' ? 'Delete Box' : 'حذف البوكس'}
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function addBundleItem() {
    const lang = settings.language;
    const container = document.getElementById('bundleItems');
    const div = document.createElement('div');
    div.style.cssText = 'display: flex; gap: 6px; margin-bottom: 6px;';
    div.innerHTML = `
        <input type="text" class="form-control bundle-item-name" placeholder="${lang === 'en' ? 'Item name' : 'اسم المنتج'}" style="flex: 2;">
        <input type="number" class="form-control bundle-item-qty" value="1" style="flex: 0.5;" min="1" inputmode="numeric">
        <button class="btn btn-outline" onclick="this.parentElement.remove()" style="padding: 8px;">
            <i class="fas fa-times"></i>
        </button>
    `;
    container.appendChild(div);
}

function saveBundle() {
    const lang = settings.language;
    const name = document.getElementById('bundleName').value.trim();
    const price = parseFloat(document.getElementById('bundlePrice').value) || 0;
    
    if (!name) {
        showToast(t('fillFields'));
        return;
    }
    
    if (price <= 0) {
        showToast(lang === 'en' ? 'Price must be greater than 0' : 'السعر يجب أن يكون أكبر من 0');
        return;
    }
    
    const items = [];
    const itemNames = document.querySelectorAll('.bundle-item-name');
    const itemQtys = document.querySelectorAll('.bundle-item-qty');
    
    itemNames.forEach((input, idx) => {
        const itemName = input.value.trim();
        if (itemName) {
            items.push({
                name: itemName,
                quantity: parseInt(itemQtys[idx].value) || 1
            });
        }
    });
    
    if (items.length === 0) {
        showToast(lang === 'en' ? 'Add at least one item' : 'أضف منتج واحد على الأقل');
        return;
    }
    
    const bundle = {
        id: 'BUN-' + Date.now() + '-' + Math.random().toString(36).substring(2, 4),
        name: name,
        price: price,
        items: items,
        salesCount: 0,
        createdAt: new Date().toISOString()
    };
    
    bundles.push(bundle);
    saveBundles();
    
    document.getElementById('bundleModal')?.remove();
    renderBundlesList();
    showToast(t('bundleAdded'));
}

function updateBundle(bundleId) {
    const lang = settings.language;
    const bundle = bundles.find(b => b.id === bundleId);
    if (!bundle) return;
    
    const name = document.getElementById('bundleName').value.trim();
    const price = parseFloat(document.getElementById('bundlePrice').value) || 0;
    
    if (!name) {
        showToast(t('fillFields'));
        return;
    }
    
    if (price <= 0) {
        showToast(lang === 'en' ? 'Price must be greater than 0' : 'السعر يجب أن يكون أكبر من 0');
        return;
    }
    
    const items = [];
    const itemNames = document.querySelectorAll('.bundle-item-name');
    const itemQtys = document.querySelectorAll('.bundle-item-qty');
    
    itemNames.forEach((input, idx) => {
        const itemName = input.value.trim();
        if (itemName) {
            items.push({
                name: itemName,
                quantity: parseInt(itemQtys[idx].value) || 1
            });
        }
    });
    
    if (items.length === 0) {
        showToast(lang === 'en' ? 'Add at least one item' : 'أضف منتج واحد على الأقل');
        return;
    }
    
    bundle.name = name;
    bundle.price = price;
    bundle.items = items;
    
    saveBundles();
    document.getElementById('bundleModal')?.remove();
    renderBundlesList();
    showToast(t('saved'));
}

function deleteBundleFromModal(bundleId) {
    const lang = settings.language;
    const modal = document.getElementById('bundleModal');
    if (modal) modal.remove();
    
    setTimeout(() => {
        showConfirmModal(
            lang === 'en' ? 'Delete this box?' : 'حذف هذا البوكس؟',
            function() {
                bundles = bundles.filter(b => b.id !== bundleId);
                saveBundles();
                renderBundlesList();
                showToast(t('deleted'));
            }
        );
    }, 200);
}

function deleteBundle(bundleId) {
    const lang = settings.language;
    
    showConfirmModal(
        lang === 'en' ? 'Delete this box?' : 'حذف هذا البوكس؟',
        function() {
            bundles = bundles.filter(b => b.id !== bundleId);
            saveBundles();
            document.getElementById('bundleModal')?.remove();
            renderBundlesList();
            showToast(t('deleted'));
        }
    );
}

function selectBundleForInvoice(bundleId) {
    const bundle = bundles.find(b => b.id === bundleId);
    if (!bundle) return;
    
    bundle.items.forEach(item => {
        invoiceItems.push({
            name: item.name,
            quantity: item.quantity,
            price: Math.round(bundle.price / bundle.items.length),
            cost: 0
        });
    });
    
    bundle.salesCount = (bundle.salesCount || 0) + 1;
    saveBundles();
    
    if (typeof renderInvoiceItems === 'function') renderInvoiceItems();
    if (typeof updateInvoiceSummary === 'function') updateInvoiceSummary();
    
    document.getElementById('bundleSelectModal')?.remove();
    showToast(t('bundleAdded'));
}

function showBundleSelector() {
    const lang = settings.language;
    
    if (bundles.length === 0) {
        showToast(lang === 'en' ? 'No boxes available' : 'لا توجد بوكسات');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'bundleSelectModal';
    modal.style.display = 'flex';
    
    let bundlesHTML = bundles.map(b => `
        <div class="search-result-item" onclick="selectBundleForInvoice('${b.id}')" 
             style="padding: 12px; border-bottom: 1px solid var(--border); cursor: pointer;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="width: 38px; height: 38px; background: var(--text); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--bg);">
                    <i class="fas fa-cube"></i>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 12px;">${escapeHTML(b.name)}</div>
                    <div style="font-size: 10px; color: var(--text-soft);">
                        ${b.items.length} ${lang === 'en' ? 'items' : 'منتجات'} · ${lang === 'en' ? 'Sold' : 'تم بيعه'} ${b.salesCount || 0} ${lang === 'en' ? 'times' : 'مرة'}
                    </div>
                </div>
                <div style="font-weight: 700; font-size: 13px;">${formatCurrency(b.price)}</div>
            </div>
        </div>
    `).join('');
    
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 380px;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-cube"></i> ${lang === 'en' ? 'Select Box' : 'اختر بوكس'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body" style="padding: 0;">
                ${bundlesHTML}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}