// ==================== invoices.js ====================
// صفحة الفواتير - LORVEN SYS v3.0

let selectedInvoiceCustomer = null;
// أضف في بداية ملف invoices.js
let isSaving = false;

// عرض صفحة إنشاء الفاتورة
function renderInvoicesPage(container) {
    const lang = settings.language;
    
    invoiceItems = [];
    selectedInvoiceCustomer = null;
    window._appliedDiscount = null;
    
    container.innerHTML = `
        <div style="margin-bottom: 12px; padding-bottom: 100px;">
            <!-- العميلة - خانتين مع اقتراح تلقائي -->
            <div class="stat-card" style="margin-bottom: 10px;">
                <div style="font-weight: 700; font-size: 13px; margin-bottom: 8px;">
                    <i class="fas fa-user"></i> ${lang === 'en' ? 'Customer' : 'العميلة'}
                </div>
                <div style="display: flex; gap: 6px; margin-bottom: 8px;">
                    <input type="text" class="form-control" id="invoiceCustomerName" 
                           placeholder="${lang === 'en' ? 'Customer name' : 'اسم العميلة'}" 
                           style="flex: 2;" autocomplete="off"
                           oninput="autoDetectCustomer()">
<div style="flex: 1.5; position: relative;">
    <input type="tel" class="form-control" id="invoiceCustomerPhone" 
           placeholder="${lang === 'en' ? 'Phone (9 digits)' : 'رقم الجوال'}" 
           style="padding-left: 38px;" inputmode="numeric" maxlength="9" autocomplete="off"
           oninput="autoDetectCustomer()">
    <button onclick="showToast(settings.language === 'en' ? 'Coming soon' : 'قريباً')" style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%); background: none; border: none; color: var(--text-soft); font-size: 16px; cursor: pointer; padding: 4px;">
        <i class="fas fa-address-book"></i>
    </button>
</div>
</div>
                <div id="invoiceCustomerSuggestions" style="display: none; max-height: 150px; overflow-y: auto; border: 1px solid var(--border); border-radius: 12px; background: var(--bg);"></div>
                <div id="selectedCustomerInfo" style="margin-top: 6px; display: none;"></div>
            </div>
            
<!-- المنتجات -->
<div class="stat-card" style="margin-bottom: 10px;">
    <div style="font-weight: 700; font-size: 13px; margin-bottom: 8px;">
        <i class="fas fa-box"></i> ${lang === 'en' ? 'Products' : 'المنتجات'}
    </div>
    <div style="display: flex; gap: 6px; margin-bottom: 8px;">
        <input type="text" class="form-control" id="invoiceItemName" 
               placeholder="${lang === 'en' ? 'Product names (separate with ,)' : 'اسم المنتج'}" style="flex: 3;">
        <div style="flex: 2; display: flex; gap: 4px;">
            <input type="number" class="form-control" id="invoiceItemPrice" 
                   placeholder="${lang === 'en' ? 'Price' : 'السعر'}" style="flex: 1;" inputmode="numeric" min="0">
            <button class="btn btn-outline currency-toggle-btn" id="invoiceCurrencyToggle" 
                    style="padding: 4px 10px; font-size: 11px; font-weight: 700; min-width: 42px; white-space: nowrap;"
                    data-currency="${settings.currency || 'ر.س'}">${settings.currency || 'ر.س'}</button>
        </div>
    </div>
    <button class="btn btn-primary" style="width: 100%; font-size: 12px;" onclick="addInvoiceItem()">
        <i class="fas fa-plus"></i> ${lang === 'en' ? 'Add' : 'إضافة'}
    </button>
                <button class="btn btn-outline" style="width: 100%; margin-top: 4px; font-size: 11px;" onclick="showBundleSelector()">
                    <i class="fas fa-cube"></i> ${lang === 'en' ? 'Or select a box' :'اختر بوكس'}
                </button>
            </div>
            
            <!-- المشتريات -->
            <div class="stat-card" style="margin-bottom: 10px;">
                <div style="font-weight: 700; font-size: 13px; margin-bottom: 8px;">
                    <i class="fas fa-shopping-cart"></i> ${lang === 'en' ? 'Items' : 'المشتريات'}
                    <span id="invoiceItemCount" style="font-size: 10px; color: var(--text-soft);">(0)</span>
                </div>
                <div id="invoiceItemsList" style="max-height: 200px; overflow-y: auto;"></div>
                <div id="invoiceEmpty" style="text-align: center; padding: 20px; color: var(--text-soft); font-size: 12px;">
                    ${lang === 'en' ? 'No items added' : 'لا توجد منتجات مضافة'}
                </div>
            </div>
            
<!-- الملخص -->
<div class="stat-card" style="margin-bottom: 10px;">
    <div style="font-weight: 700; font-size: 13px; margin-bottom: 8px;">
        <i class="fas fa-calculator"></i> ${lang === 'en' ? 'Summary' : 'الملخص'}
    </div>
    <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px;">
        <span>${lang === 'en' ? 'Subtotal' : 'المجموع'}</span>
        <span id="invoiceSubtotal" style="font-weight: 600;">0</span>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px;">
        <span>${lang === 'en' ? 'Delivery' : 'التوصيل'}</span>
        <div style="display: flex; gap: 4px; align-items: center;">
            <input type="number" class="form-control" id="invoiceDelivery" value="" 
                   style="width: 80px; padding: 4px 8px; font-size: 11px; text-align: center;" inputmode="numeric" min="0" oninput="updateInvoiceSummary()" placeholder="0">
            <span id="deliveryCurrencyLabel" style="font-size: 11px; font-weight: 600; min-width: 30px;"></span>
        </div>
    </div>
    <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; align-items: center;">
    <span>${lang === 'en' ? 'Discount Code' : 'كود الخصم'}</span>
    <div style="display: flex; gap: 4px; align-items: center;">
        <input type="text" class="form-control" id="invoiceDiscountCode" 
               placeholder="${lang === 'en' ? 'Code' : 'كود'}" 
               style="width: 80px; padding: 4px 8px; font-size: 10px; text-align: center; text-transform: uppercase;" autocomplete="off">
        <button class="btn btn-outline" style="padding: 4px 8px; font-size: 9px;" onclick="applyDiscountCode()">
            <i class="fas fa-check"></i>
        </button>
    </div>
</div>
<div id="discountCodeInfo" style="display: none; font-size: 10px; padding: 2px 0; text-align: right;"></div>
    <div style="border-top: 1px solid var(--border); margin: 6px 0;"></div>
    <div style="display: flex; justify-content: space-between; padding: 4px 0; font-size: 15px; font-weight: 700;">
        <span>${lang === 'en' ? 'Total' : 'الإجمالي'}</span>
        <span id="invoiceTotal" style="color: var(--text);">0</span>
    </div>
</div>

            <!-- الدفع (بدون حالة التوصيل - تم نقلها لصفحة التفاصيل) -->
            <div class="stat-card" style="margin-bottom: 10px;">
                <div style="font-weight: 700; font-size: 13px; margin-bottom: 8px;">
                    <i class="fas fa-money-bill"></i> ${lang === 'en' ? 'Payment' : 'الدفع'}
                </div>
                
                <!-- حالة الدفع -->
                <div style="margin-bottom: 8px;">
                    <label style="font-size: 11px; display: block; margin-bottom: 4px;">${lang === 'en' ? 'Payment' : 'حالة الدفع'}</label>
                    <div class="option-selector" onclick="openPaymentStatusModal()" style="margin-bottom: 0;">
                        <div class="selected-option">
                            <span id="paymentStatusText">${lang === 'en' ? 'Unpaid' : 'غير مدفوع'}</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                    <input type="hidden" id="invoicePayment" value="unpaid">
                </div>
                
                <div id="downPaymentField" style="display: none; margin-bottom: 8px;">
                    <label style="font-size: 11px; display: block; margin-bottom: 4px;">${lang === 'en' ? 'Paid Amount' : 'المبلغ المدفوع'}</label>
                    <input type="number" class="form-control" id="invoicePaidAmount" value="" inputmode="numeric" min="0" oninput="updateInvoiceSummary()">
                </div>
                
                <!-- الشحنة -->
                <div style="margin-bottom: 8px;">
                    <label style="font-size: 11px; display: block; margin-bottom: 4px;">${lang === 'en' ? 'Shipment' : 'الشحنة'}</label>
                    <div class="option-selector" onclick="openShipmentSelectModal()" style="margin-bottom: 0;">
                        <div class="selected-option">
                            <span id="shipmentSelectText">${lang === 'en' ? 'Auto' : 'تلقائي'}</span>
                            <i class="fas fa-chevron-down"></i>
                        </div>
                    </div>
                    <input type="hidden" id="invoiceShipment" value="">
                </div>
            </div>
            
            <!-- ملاحظات -->
            <div class="stat-card" style="margin-bottom: 10px;">
                <div style="font-weight: 700; font-size: 13px; margin-bottom: 8px;">
                    <i class="fas fa-pen"></i> ${lang === 'en' ? 'Notes' : 'ملاحظات'}
                </div>
                <textarea class="form-control" id="invoiceNotes" rows="2" 
                          placeholder="${lang === 'en' ? 'Additional notes...' : 'ملاحظات إضافية...'}"></textarea>
            </div>
            
            <!-- أزرار الإجراء -->
            <div style="display: flex; gap: 6px;">
            <button class="btn btn-primary" style="flex: 1;" onclick="saveInvoiceOnly()">
                    <i class="fas fa-save"></i> ${lang === 'en' ? 'Save' : 'حفظ'}
                </button>
                
                <button class="btn btn-wa" style="flex: 1;" onclick="saveAndSendWhatsApp()">
                    <i class="fab fa-whatsapp"></i> ${lang === 'en' ? 'Send' : 'إرسال'}
                </button>
            </div>
        </div>
    `;
    
    updateInvoiceSummary();
    setTimeout(() => setupCurrencyToggle(), 100);
}

// اقتراح العميلة بالاسم OR الرقم (حل المشكلة)
function autoDetectCustomer() {
    const phoneInput = document.getElementById('invoiceCustomerPhone');
    const nameInput = document.getElementById('invoiceCustomerName');
    const suggestionsDiv = document.getElementById('invoiceCustomerSuggestions');
    const customerInfo = document.getElementById('selectedCustomerInfo');
    
    if (!phoneInput || !nameInput) return;
    
    const phone = cleanPhoneNumber(phoneInput.value);
    const name = nameInput.value.trim();
    
    if (!phone && !name) {
        if (suggestionsDiv) suggestionsDiv.style.display = 'none';
        return;
    }
    
    // البحث بالرقم OR الاسم
    let matches = customers.filter(c => {
        let matchByPhone = false;
        let matchByName = false;
        
        if (phone && phone.length >= 2) {
            matchByPhone = c.phone && c.phone.includes(phone);
        }
        if (name && name.length >= 2) {
            matchByName = c.name && c.name.toLowerCase().includes(name.toLowerCase());
        }
        
        return matchByPhone || matchByName;
    }).slice(0, 5);
    
    // تطابق تام بالرقم (9 أرقام ونتيجة واحدة)
    if (phone && phone.length === 9 && matches.length === 1) {
        const customer = matches[0];
        nameInput.value = customer.name;
        phoneInput.value = customer.phone || '';
        selectedInvoiceCustomer = customer;
        
        if (customerInfo) {
            customerInfo.style.display = 'block';
            customerInfo.innerHTML = `
                <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: var(--hover); border-radius: 12px;">
                    <div style="width: 8px; height: 8px; border-radius: 50%; background: ${getCustomerTierColor(customer.tier || 'normal')};"></div>
                    <span style="font-weight: 600; font-size: 12px;">${escapeHTML(customer.name)}</span>
                    <span class="copyable-id" style="font-size: 10px;">${customer.id}</span>
                </div>
            `;
        }
        if (suggestionsDiv) suggestionsDiv.style.display = 'none';
        return;
    }
    
    // إظهار الاقتراحات
    if (matches.length > 0 && suggestionsDiv) {
        suggestionsDiv.style.display = 'block';
        suggestionsDiv.innerHTML = matches.map(c => `
            <div class="search-result-item" onclick="selectSuggestedCustomer('${c.id}')" style="display: flex; align-items: center; gap: 8px; padding: 10px; cursor: pointer;">
                <div style="width: 8px; height: 8px; border-radius: 50%; background: ${getCustomerTierColor(c.tier || 'normal')};"></div>
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 12px;">${escapeHTML(c.name)}</div>
                    <div style="font-size: 10px; color: var(--text-soft);">${c.phone || ''} · ${c.id}</div>
                </div>
            </div>
        `).join('');
    } else if (suggestionsDiv) {
        suggestionsDiv.style.display = 'none';
    }
}

function selectSuggestedCustomer(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return;
    
    selectedInvoiceCustomer = customer;
    
    document.getElementById('invoiceCustomerName').value = customer.name;
    document.getElementById('invoiceCustomerPhone').value = customer.phone || '';
    document.getElementById('invoiceCustomerSuggestions').style.display = 'none';
    
    document.getElementById('selectedCustomerInfo').style.display = 'block';
    document.getElementById('selectedCustomerInfo').innerHTML = `
        <div style="display: flex; align-items: center; gap: 8px; padding: 8px; background: var(--hover); border-radius: 12px;">
            <div style="width: 8px; height: 8px; border-radius: 50%; background: ${getCustomerTierColor(customer.tier)};"></div>
            <span style="font-weight: 600; font-size: 12px;">${escapeHTML(customer.name)}</span>
            <span class="copyable-id" style="font-size: 10px;">${customer.id}</span>
            <span style="font-size: 10px; color: var(--text-soft);">${customer.phone || ''}</span>
        </div>
    `;
}

// ==================== مودال حالة الدفع ====================
function openPaymentStatusModal() {
    const lang = settings.language;
    const currentStatus = document.getElementById('invoicePayment')?.value || 'unpaid';
    
    const statuses = [
        { id: 'paid', name: lang === 'en' ? 'Paid' : 'مدفوع', icon: 'fa-check-circle', color: '#4CAF50' },
        { id: 'unpaid', name: lang === 'en' ? 'Unpaid' : 'غير مدفوع', icon: 'fa-times-circle', color: '#F44336' },
        { id: 'partial', name: lang === 'en' ? 'Partial' : 'مدفوع جزئياً', icon: 'fa-adjust', color: '#FF9800' }
    ];
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    
    const statusesHTML = statuses.map(s => `
        <button class="option-btn payment-status-option ${currentStatus === s.id ? 'selected' : ''}" data-status="${s.id}">
            <span style="flex: 1; text-align: right;">
                <i class="fas ${s.icon}" style="margin-left: 8px; color: ${s.color};"></i> ${s.name}
            </span>
            <i class="fas ${currentStatus === s.id ? 'fa-check-circle' : 'fa-circle'}" style="color: ${currentStatus === s.id ? 'var(--green)' : 'var(--text-soft)'}; font-size: 18px;"></i>
        </button>
    `).join('');
    
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-cash-register"></i> ${lang === 'en' ? 'Payment Status' : 'حالة الدفع'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                ${statusesHTML}
                
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                                    <button class="btn btn-outline" style="flex: 1;" id="cancelPaymentStatusBtn">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>

                    <button class="btn btn-primary" style="flex: 1;" id="savePaymentStatusBtn">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    let selected = currentStatus;
    const selectedStatus = statuses.find(s => s.id === selected);
    
    // اختيار حالة - تغيير فوري للأيقونة
    modal.querySelectorAll('.payment-status-option').forEach(btn => {
        btn.addEventListener('click', function() {
            // إعادة كل الأزرار للحالة الطبيعية
            modal.querySelectorAll('.payment-status-option').forEach(b => {
                b.classList.remove('selected');
                const dot = b.querySelector('.fa-check-circle, .fa-circle');
                if (dot) {
                    dot.className = 'fas fa-circle';
                    dot.style.color = 'var(--text-soft)';
                }
            });
            
            // تفعيل الزر الحالي فوراً
            this.classList.add('selected');
            const dot = this.querySelector('.fa-circle, .fa-check-circle');
            if (dot) {
                dot.className = 'fas fa-check-circle';
                dot.style.color = 'var(--green)';
            }
            
            selected = this.getAttribute('data-status');
        });
    });
    
    // حفظ
    document.getElementById('savePaymentStatusBtn').addEventListener('click', function() {
        const hiddenInput = document.getElementById('invoicePayment');
        if (hiddenInput) hiddenInput.value = selected;
        
        const statusText = document.getElementById('paymentStatusText');
        const statusObj = statuses.find(s => s.id === selected);
        if (statusText && statusObj) {
            statusText.textContent = statusObj.name;
        }
        
        const downField = document.getElementById('downPaymentField');
        if (downField) {
            downField.style.display = selected === 'partial' ? 'block' : 'none';
        }
        
        document.querySelectorAll('.modal').forEach(m => m.remove());
        updateInvoiceSummary();
        if (statusObj) showToast(statusObj.name + ' ✓');
    });
    
    // إلغاء
    document.getElementById('cancelPaymentStatusBtn').addEventListener('click', function() {
        modal.remove();
    });
}

// مودال اختيار الشحنة
function openShipmentSelectModal() {
    const lang = settings.language;
    const current = document.getElementById('invoiceShipment')?.value || '';
    const openShipments = shipments.filter(s => s.status === 'open');
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 360px;">
            <div class="modal-header">
                <div class="modal-title">${lang === 'en' ? 'Select Shipment' : 'اختر الشحنة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn ${current === '' ? 'selected' : ''}" onclick="selectShipment('')">
                    ${lang === 'en' ? 'Auto (Open)' : 'تلقائي (مفتوحة)'}
                </button>
                ${openShipments.map(s => `
                    <button class="option-btn ${current === s.id ? 'selected' : ''}" onclick="selectShipment('${s.id}')">
                        ${s.id} (${s.orderCount || 0}/${settings.shipmentMaxOrders || 20})
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function selectShipment(shipmentId) {
    const lang = settings.language;
    document.getElementById('invoiceShipment').value = shipmentId;
    if (shipmentId) {
        const shipment = shipments.find(s => s.id === shipmentId);
        document.getElementById('shipmentSelectText').textContent = shipmentId + (shipment ? ` (${shipment.orderCount || 0}/${settings.shipmentMaxOrders || 20})` : '');
    } else {
        document.getElementById('shipmentSelectText').textContent = lang === 'en' ? 'Auto' : 'تلقائي';
    }
    document.querySelectorAll('.modal').forEach(m => m.remove());
}

// إضافة منتج للفاتورة
function addInvoiceItem() {
    const nameInput = document.getElementById('invoiceItemName');
    const priceInput = document.getElementById('invoiceItemPrice');
    
    const namesText = nameInput.value.trim();
    const price = parseFloat(priceInput.value) || 0;

    if (!namesText) {
        showToast(t('fillFields'));
        return;
    }
    
     if (isNaN(price) || price <= 0) {
        showToast(settings.language === 'en' ? 'Please enter a valid price' : 'الرجاء إدخال سعر صحيح');
        return;
    }
    
    const names = namesText.split(/[،,]/).map(n => n.trim()).filter(n => n);
    
    names.forEach(name => {
        const existing = invoiceItems.find(i => i.name.toLowerCase() === name.toLowerCase());
        if (existing) {
            existing.quantity += 1;
        } else {
            invoiceItems.push({
                name: name,
                price: price,
                quantity: 1,
                cost: 0
            });
        }
    });
    
    nameInput.value = '';
    priceInput.value = '';

    renderInvoiceItems();
    updateInvoiceSummary();
}

function renderInvoiceItems() {
    const container = document.getElementById('invoiceItemsList');
    const emptyDiv = document.getElementById('invoiceEmpty');
    const countSpan = document.getElementById('invoiceItemCount');
    
    if (!container) return;
    
    if (invoiceItems.length === 0) {
        container.innerHTML = '';
        if (emptyDiv) emptyDiv.style.display = 'block';
        if (countSpan) countSpan.textContent = '(0)';
        return;
    }
    
    if (emptyDiv) emptyDiv.style.display = 'none';
    if (countSpan) countSpan.textContent = `(${invoiceItems.length})`;
    
    container.innerHTML = invoiceItems.map((item, idx) => `
        <div style="display: flex; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--border); gap: 8px;">
            <span style="font-size: 10px; color: var(--text-soft); min-width: 16px;">${idx + 1}.</span>
            <div style="flex: 1;">
                <div style="font-weight: 600; font-size: 12px;">${escapeHTML(item.name)}</div>
                <div style="font-size: 10px; color: var(--text-soft);">
                    ${item.quantity} × ${formatCurrency(item.price)} = ${formatCurrency(item.quantity * item.price)}
                </div>
            </div>
            <div style="display: flex; gap: 4px;">
                <button class="btn btn-outline" style="padding: 2px 8px; font-size: 14px;" onclick="changeInvoiceItemQty(${idx}, -1)">-</button>
                <span style="min-width: 20px; text-align: center; font-size: 12px; font-weight: 600;">${item.quantity}</span>
                <button class="btn btn-outline" style="padding: 2px 8px; font-size: 14px;" onclick="changeInvoiceItemQty(${idx}, 1)">+</button>
                <button class="btn btn-outline" style="padding: 2px 6px; color: var(--red);" onclick="removeInvoiceItem(${idx})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>
    `).join('');
}

function changeInvoiceItemQty(idx, delta) {
    if (invoiceItems[idx]) {
        invoiceItems[idx].quantity = Math.max(1, invoiceItems[idx].quantity + delta);
        renderInvoiceItems();
        updateInvoiceSummary();
    }
}

function removeInvoiceItem(idx) {
    invoiceItems.splice(idx, 1);
    renderInvoiceItems();
    updateInvoiceSummary();
}

function updateInvoiceSummary() {
    const subtotal = invoiceItems.reduce((s, i) => s + (i.price * i.quantity), 0);
    const deliveryInput = document.getElementById('invoiceDelivery');
    const delivery = deliveryInput && deliveryInput.value !== '' ? (parseFloat(deliveryInput.value) || 0) : 0;
const discount = window._appliedDiscount ? window._appliedDiscount.discount : 0;
const total = subtotal + delivery - discount;
const currency = document.getElementById('invoiceCurrencyToggle')?.getAttribute('data-currency') || settings.currency || 'ر.س';
    
    const subtotalEl = document.getElementById('invoiceSubtotal');
    const totalEl = document.getElementById('invoiceTotal');
    const deliveryLabel = document.getElementById('deliveryCurrencyLabel');
    
    if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal) + ' ' + currency;
    if (totalEl) totalEl.textContent = formatCurrency(total) + ' ' + currency;
    if (deliveryLabel) deliveryLabel.textContent = currency;
    
    const paymentStatus = document.getElementById('invoicePayment')?.value;
    if (paymentStatus === 'partial') {
        const paidInput = document.getElementById('invoicePaidAmount');
        if (paidInput && settings.downPaymentType !== 'none') {
            let downPayment = 0;
            if (settings.downPaymentType === 'percent') {
                downPayment = Math.round(total * settings.downPaymentPercent / 100);
            } else if (settings.downPaymentType === 'amount') {
                downPayment = Math.min(settings.downPaymentAmount, total);
            }
            paidInput.value = downPayment;
        }
    }
}

// حفظ الفاتورة فقط
function saveInvoiceOnly() {
    const lang = settings.language;
    
    if (isSaving) {
        showToast(lang === 'en' ? 'Please wait...' : 'يرجى الانتظار...');
        return;
    }
    
    if (invoiceItems.length === 0) {
        showToast(t('invoiceEmpty'));
        return;
    }
    
    const nameInput = document.getElementById('invoiceCustomerName');
    const phoneInput = document.getElementById('invoiceCustomerPhone');
    let phone = cleanPhoneNumber(phoneInput?.value || '');
    
    if (selectedInvoiceCustomer) {
        phone = cleanPhoneNumber(selectedInvoiceCustomer.phone);
    }
    
    if (!phone || phone.length !== 9) {
        showToast(lang === 'en' ? 'Phone must be 9 digits' : 'رقم الجوال يجب أن يكون ٩ أرقام');
        return;
    }
    
    if (!isValidYemeniPhone(phone) && !isSaudiPhone(phone)) {
        showToast(lang === 'en' ? 'Number must start with 70,71,73,77,78 or 5' : 'يجب أن يبدأ الرقم بـ 70، 71، 73، 77، 78 أو 5');
        return;
    }
    
    isSaving = true;
    
    try {
        if (nameInput && nameInput.value.trim() && !selectedInvoiceCustomer) {
            const customer = {
                id: generateCustomerId(),
                name: nameInput.value.trim(),
                phone: phone,
                notes: '',
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
            selectedInvoiceCustomer = customer;
        }
        
        const invoice = buildInvoiceObject();
        
        const recentInvoices = invoices.slice(-5);
        const isDuplicate = recentInvoices.some(lastInvoice => 
            lastInvoice.customerName === invoice.customerName &&
            lastInvoice.total === invoice.total &&
            lastInvoice.items.length === invoice.items.length &&
            Math.abs(new Date(lastInvoice.date) - new Date(invoice.date)) < 3000 &&
            JSON.stringify(lastInvoice.items.map(i => i.name).sort()) === 
            JSON.stringify(invoice.items.map(i => i.name).sort())
        );
        
        if (isDuplicate) {
            showToast(lang === 'en' ? 'Duplicate invoice prevented' : 'تم منع إنشاء فاتورة مكررة');
            isSaving = false;
            return;
        }
        
        invoices.push(invoice);
        
        if (typeof addOrderToShipment === 'function') {
            addOrderToShipment(invoice);
        }
        
        saveInvoices();
        updateCustomersFromInvoices();
        
        addNotification('invoice', 
            lang === 'en' ? 'Invoice Saved' : 'تم حفظ الفاتورة',
            `${invoice.id} - ${formatCurrency(invoice.total)}`,
            invoice.id
        );
        
        resetInvoicePage();
        playSound('save');
showCheckmark(lang === 'en' ? 'Invoice Saved ✓' : 'تم حفظ الفاتورة');

    } catch (error) {
        console.error('Error saving invoice:', error);
        showToast(t('error'));
    } finally {
        setTimeout(() => {
            isSaving = false;
        }, 500);
    }
}
// بناء كائن الفاتورة
function buildInvoiceObject() {
    const subtotal = invoiceItems.reduce((s, i) => s + (i.price * i.quantity), 0);
    const deliveryInput = document.getElementById('invoiceDelivery');
    const delivery = deliveryInput && deliveryInput.value !== '' ? (parseFloat(deliveryInput.value) || 0) : 0;
const discount = window._appliedDiscount?.discount || 0;
const total = subtotal + delivery - discount;
const paymentStatus = document.getElementById('invoicePayment')?.value || 'unpaid';
    
    const paidAmount = paymentStatus === 'paid' 
        ? total 
        : paymentStatus === 'partial' 
            ? (parseFloat(document.getElementById('invoicePaidAmount')?.value) || 0) 
            : 0;
    
    const remainingAmount = Math.max(0, total - paidAmount);
    const currency = document.getElementById('invoiceCurrencyToggle')?.getAttribute('data-currency') || settings.currency || 'ر.س';
    
return {
    id: generateInvoiceId(),
    date: new Date().toISOString(),
    customerName: selectedInvoiceCustomer ? selectedInvoiceCustomer.name : (document.getElementById('invoiceCustomerName')?.value || ''),
    customerPhone: selectedInvoiceCustomer ? cleanPhoneNumber(selectedInvoiceCustomer.phone) : cleanPhoneNumber(document.getElementById('invoiceCustomerPhone')?.value || ''),
    customerId: selectedInvoiceCustomer ? selectedInvoiceCustomer.id : '',
    items: invoiceItems.map(i => ({ ...i })),
    subtotal: subtotal,
    delivery: delivery,
    total: total,
    profit: 0,
    paidAmount: paidAmount,
    remainingAmount: remainingAmount,
    paymentStatus: paymentStatus,
    deliveryStatus: 'not_delivered',
    shipmentId: document.getElementById('invoiceShipment')?.value || '',
    notes: document.getElementById('invoiceNotes')?.value || '',
    currency: currency,
    whatsappSent: false,
    discountCode: window._appliedDiscount?.code || '',
    discountAmount: window._appliedDiscount?.discount || 0,
    discountOwnerName: window._appliedDiscount?.ownerName || ''
};
    
}

// حفظ وإرسال واتساب
function saveAndSendWhatsApp() {
    const lang = settings.language;
    
    if (isSaving) {
        showToast(lang === 'en' ? 'Please wait...' : 'يرجى الانتظار...');
        return;
    }
    
    if (invoiceItems.length === 0) {
        showToast(t('invoiceEmpty'));
        return;
    }
    
    const nameInput = document.getElementById('invoiceCustomerName');
    const phoneInput = document.getElementById('invoiceCustomerPhone');
    let phone = '';
    
    if (selectedInvoiceCustomer) {
        phone = cleanPhoneNumber(selectedInvoiceCustomer.phone);
    } else if (phoneInput && phoneInput.value.trim()) {
        phone = cleanPhoneNumber(phoneInput.value);
    }
    
    if (!phone || phone.length !== 9) {
        showToast(lang === 'en' ? 'Phone must be 9 digits' : 'رقم الجوال يجب أن يكون ٩ أرقام');
        return;
    }
    
    if (!isValidYemeniPhone(phone) && !isSaudiPhone(phone)) {
        showToast(lang === 'en' ? 'Number must start with 70,71,73,77,78 or 5' : 'يجب أن يبدأ الرقم بـ 70، 71، 73، 77، 78 أو 5');
        return;
    }
    
    // إنشاء العميل فقط بعد التحقق من صحة الرقم ✅
    if (nameInput && nameInput.value.trim() && !selectedInvoiceCustomer) {
        const customer = {
            id: generateCustomerId(),
            name: nameInput.value.trim(),
            phone: phone,
            notes: '',
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
        selectedInvoiceCustomer = customer;
    }
    
    if (isSaudiPhone(phone)) {
        showSaudiConfirmModal(phone);
        return;
    }
    
    proceedWithWhatsApp(phone);
}
// بناء رسالة واتساب
function buildWhatsAppMessage(invoice) {
    const lang = settings.language;
    const firstName = invoice.customerName?.split(' ')[0] || invoice.customerName || (lang === 'en' ? 'Customer' : 'عميلة');
    const formattedDate = formatDateTime(invoice.date);
    
    let itemsText = '';
    invoice.items.forEach(i => {
        itemsText += `   · ${i.name} (${i.quantity} × ${i.price}) = ${i.quantity * i.price} ${settings.currency}\n`;
    });
    
    const deliveryText = invoice.delivery === 0 
        ? (lang === 'en' ? 'Free' : 'مجاني')
        : `${invoice.delivery} ${settings.currency}`;
    
    let paymentStatusText = '';
    if (invoice.paymentStatus === 'paid') {
        paymentStatusText = lang === 'en' ? 'Paid in full' : 'مدفوع كامل';
    } else if (invoice.paymentStatus === 'partial') {
        paymentStatusText = `${lang === 'en' ? 'Down payment' : 'عربون'}: ${formatCurrency(invoice.paidAmount)}\n${lang === 'en' ? 'Remaining' : 'متبقي'}: ${formatCurrency(invoice.remainingAmount)}`;
    } else {
        paymentStatusText = lang === 'en' ? 'Payment upon receipt' : 'الدفع عند الاستلام';
    }
    
    // كود الخصم
let discountText = invoice.discountCode ? `${invoice.discountCode} (-${invoice.discountAmount} ${settings.currency})` : '';
    
    return settings.whatsappTemplate
        .replace(/{firstName}/g, firstName)
        .replace(/{orderId}/g, invoice.id)
        .replace(/{formattedDate}/g, formattedDate)
        .replace(/{items}/g, itemsText)
        .replace(/{delivery}/g, deliveryText)
        .replace(/{total}/g, formatCurrency(invoice.total))
        .replace(/{paymentStatus}/g, paymentStatusText)
        .replace(/{shipmentId}/g, invoice.shipmentId || (lang === 'en' ? 'N/A' : 'غير محدد'))
        .replace(/{discount}/g, discountText);
}
// إعادة تعيين صفحة الفاتورة
function resetInvoicePage() {
    invoiceItems = [];
    selectedInvoiceCustomer = null;
    window._appliedDiscount = null;
    
    const fields = ['invoiceCustomerName', 'invoiceCustomerPhone', 'invoiceItemName', 'invoiceItemPrice', 'invoiceDelivery', 'invoiceNotes'];
    fields.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    const customerInfo = document.getElementById('selectedCustomerInfo');
    if (customerInfo) customerInfo.style.display = 'none';
    
    const suggestions = document.getElementById('invoiceCustomerSuggestions');
    if (suggestions) suggestions.style.display = 'none';
    
    const paymentStatusText = document.getElementById('paymentStatusText');
    if (paymentStatusText) paymentStatusText.textContent = settings.language === 'en' ? 'Unpaid' : 'غير مدفوع';
    
    const invoicePayment = document.getElementById('invoicePayment');
    if (invoicePayment) invoicePayment.value = 'unpaid';
    
    const downField = document.getElementById('downPaymentField');
    if (downField) downField.style.display = 'none';
    
    const shipmentSelectText = document.getElementById('shipmentSelectText');
    if (shipmentSelectText) shipmentSelectText.textContent = settings.language === 'en' ? 'Auto' : 'تلقائي';
    
    const invoiceShipment = document.getElementById('invoiceShipment');
    if (invoiceShipment) invoiceShipment.value = '';
    
    renderInvoiceItems();
    updateInvoiceSummary();
}

// عرض تفاصيل الفاتورة (مع إمكانية تعديل العربون فقط)
function viewInvoiceDetails(invoiceId) {
    const lang = settings.language;
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;
    
    const canEdit = inv.paymentStatus !== 'paid'; // فقط غير المدفوعة تقبل التعديل
    const canEditPaid = inv.paymentStatus === 'partial' || inv.paymentStatus === 'unpaid';
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'invoiceDetailsModal';
    modal.style.display = 'flex';
    
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 400px; max-height: 80vh; overflow-y: auto;">
            <div class="modal-header" style="position: sticky; top: 0; background: var(--bg);">
                <div class="modal-title"><i class="fas fa-receipt"></i> ${inv.id}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div style="margin-bottom: 12px;">
                    <p style="font-size: 11px;"><strong>${lang === 'en' ? 'Customer' : 'العميلة'}:</strong> ${escapeHTML(inv.customerName || '')}</p>
                    <p style="font-size: 11px;"><strong>${lang === 'en' ? 'Date' : 'التاريخ'}:</strong> ${formatDateTime(inv.date)}</p>
                    ${inv.shipmentId ? `<p style="font-size: 11px;"><strong>${lang === 'en' ? 'Shipment' : 'الشحنة'}:</strong> ${inv.shipmentId}</p>` : ''}
                    
                    <!-- حالة التوصيل (تظهر فقط بعد الحفظ) -->
                    <div style="margin-top: 8px;">
                        <label style="font-size: 11px; display: block; margin-bottom: 4px;">${lang === 'en' ? 'Delivery Status' : 'حالة التوصيل'}</label>
                        <div class="option-selector" onclick="openDeliveryStatusModal('${inv.id}')" style="margin-bottom: 0;">
                            <div class="selected-option">
                                <span id="deliveryStatusText_${inv.id}">${getDeliveryStatusText(inv.deliveryStatus, lang)}</span>
                                <i class="fas fa-chevron-down"></i>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div style="border-top: 1px solid var(--border); padding-top: 8px; margin-bottom: 8px;">
                    ${inv.items.map((item, idx) => `
                        <div style="display: flex; justify-content: space-between; font-size: 11px; padding: 2px 0;">
                            <span>${idx + 1}. ${escapeHTML(item.name)} (${item.quantity} × ${formatCurrency(item.price)})</span>
                            <span style="font-weight: 600;">${formatCurrency(item.quantity * item.price)}</span>
                        </div>
                    `).join('')}
                </div>
                
                <div style="border-top: 1px solid var(--border); padding-top: 8px;">
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                        <span>${lang === 'en' ? 'Delivery' : 'التوصيل'}</span>
                        <span>${inv.delivery === 0 ? (lang === 'en' ? 'Free' : 'مجاني') : formatCurrency(inv.delivery)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; margin-top: 4px;">
                        <span>${lang === 'en' ? 'Total' : 'الإجمالي'}</span>
                        <span>${formatCurrency(inv.total)}</span>
                    </div>
                </div>
                
                <!-- الملاحظات -->
                ${inv.notes ? `
                    <div style="margin-top: 12px; padding: 8px; background: var(--hover); border-radius: 12px;">
                        <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Notes' : 'ملاحظات'}</div>
                        <div style="font-size: 11px;">${escapeHTML(inv.notes)}</div>
                    </div>
                ` : ''}
                ${inv.discountCode ? `
    <div style="margin-top: 12px; padding: 8px; background: rgba(107,158,122,0.1); border-radius: 12px; text-align: right;">
        <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Discount Code' : 'كود الخصم'}</div>
        <div style="font-size: 12px; font-weight: 600; color: var(--green);">${inv.discountCode} (-${inv.discountAmount} ${lang === 'en' ? 'SAR' : 'ر.س'})</div>
        ${inv.discountOwnerName ? `<div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'From' : 'من'}: ${escapeHTML(inv.discountOwnerName)}</div>` : ''}
    </div>
` : ''}
                <!-- العربون (قابل للتعديل فقط للغير مدفوعة والعربون) -->
                ${canEditPaid ? `
                    <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid var(--border);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-size: 11px;">${lang === 'en' ? 'Paid Amount' : 'المبلغ المدفوع'}:</span>
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <input type="number" id="editPaidAmount_${inv.id}" value="${inv.paidAmount}" 
                                       style="width: 100px; padding: 4px 8px; font-size: 11px; border-radius: 8px; border: 1px solid var(--border); background: var(--bg);"
                                       min="0" max="${inv.total}">
                                <button class="btn btn-primary" style="padding: 4px 12px; font-size: 11px;" onclick="updateInvoicePaidAmount('${inv.id}')">
                                    ${lang === 'en' ? 'Save' : 'حفظ'}
                                </button>
                            </div>
                        </div>
                        <div style="font-size: 10px; color: var(--text-soft);">
                            ${lang === 'en' ? 'Remaining' : 'المتبقي'}: ${formatCurrency(inv.total - inv.paidAmount)}
                        </div>
                    </div>
                ` : ''}
                
                <div style="display: flex; gap: 6px; margin-top: 12px;">
                    <button class="btn btn-wa" style="flex: 1; font-size: 11px;" onclick="sendSavedInvoiceWhatsApp('${inv.id}')">
                        <i class="fab fa-whatsapp"></i> ${lang === 'en' ? 'Send' : 'إرسال'}
                    </button>
                    <button class="btn btn-outline" style="flex: 1; font-size: 11px;" onclick="shareSavedInvoice('${inv.id}')">
    <i class="fas fa-share-alt"></i>
</button>
                    <button class="btn btn-outline" style="flex: 1; font-size: 11px;" onclick="exportInvoiceAsPDF('${inv.id}')">
                        <i class="fas fa-file-pdf"></i> PDF
                    </button>
                    <button class="btn btn-outline" style="flex: 1; font-size: 11px; color: var(--red);" onclick="deleteInvoice('${inv.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// تحديث المبلغ المدفوع (العربون)
function updateInvoicePaidAmount(invoiceId) {
    const lang = settings.language;
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    if (invoice.paymentStatus === 'paid') {
        showToast(lang === 'en' ? 'Cannot edit paid invoice' : 'لا يمكن تعديل فاتورة مدفوعة');
        return;
    }
    
    const newPaid = parseFloat(document.getElementById(`editPaidAmount_${invoiceId}`).value) || 0;
    
    if (newPaid < 0) {
        showToast(lang === 'en' ? 'Invalid amount' : 'المبلغ غير صالح');
        return;
    }
    
    invoice.paidAmount = Math.min(newPaid, invoice.total);
    invoice.remainingAmount = invoice.total - invoice.paidAmount;
    
    // إذا دفع كامل المبلغ
    if (invoice.paidAmount >= invoice.total) {
        invoice.paymentStatus = 'paid';
        invoice.remainingAmount = 0;
    } else if (invoice.paidAmount > 0) {
        invoice.paymentStatus = 'partial';
    } else {
        invoice.paymentStatus = 'unpaid';
    }
    
    saveInvoices();
    updateCustomersFromInvoices();
    
    document.querySelectorAll('.modal').forEach(m => m.remove());
    showToast(lang === 'en' ? 'Amount updated' : 'تم تحديث المبلغ');
    
    setTimeout(() => viewInvoiceDetails(invoiceId), 200);
}

// مودال حالة التوصيل
function openDeliveryStatusModal(invoiceId) {
    const lang = settings.language;
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 360px;">
            <div class="modal-header">
                <div class="modal-title">${lang === 'en' ? 'Delivery Status' : 'حالة التوصيل'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn ${invoice.deliveryStatus === 'not_delivered' ? 'selected' : ''}" onclick="updateDeliveryStatus('${invoiceId}', 'not_delivered')">
                    ${lang === 'en' ? 'Not Delivered' : 'لم يتم الاستلام'}
                </button>
                <button class="option-btn ${invoice.deliveryStatus === 'delivered' ? 'selected' : ''}" onclick="updateDeliveryStatus('${invoiceId}', 'delivered')">
                    ${lang === 'en' ? 'Delivered' : 'تم الاستلام'}
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function updateDeliveryStatus(invoiceId, status) {
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    invoice.deliveryStatus = status;
    saveInvoices();
    
    const statusSpan = document.getElementById(`deliveryStatusText_${invoiceId}`);
    if (statusSpan) {
        statusSpan.textContent = getDeliveryStatusText(status, settings.language);
    }
    
    document.querySelectorAll('.modal').forEach(m => m.remove());
    showToast(settings.language === 'en' ? 'Delivery status updated' : 'تم تحديث حالة التوصيل');
}

function getDeliveryStatusText(status, lang) {
    const texts = {
        delivered: lang === 'en' ? 'Delivered' : 'تم الاستلام',
        not_delivered: lang === 'en' ? 'Not Delivered' : 'لم يتم الاستلام'
    };
    return texts[status] || texts.not_delivered;
}

// حذف فاتورة
function deleteInvoice(invoiceId) {
    const lang = settings.language;
    const invoice = invoices.find(i => i.id === invoiceId);
    if (!invoice) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 360px; text-align: center;">
            <div class="modal-header">
                <div class="modal-title">${lang === 'en' ? 'Delete Invoice' : 'حذف الفاتورة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: var(--red); margin-bottom: 12px;"></i>
                <p style="font-size: 14px; margin-bottom: 8px;">${lang === 'en' ? 'Are you sure you want to delete this invoice?' : 'هل أنت متأكد من حذف هذه الفاتورة؟'}</p>
                <p style="font-size: 16px; font-weight: 700; margin-bottom: 4px;">${invoice.id}</p>
                <p style="font-size: 12px; color: var(--text-soft); margin-bottom: 16px;">${escapeHTML(invoice.customerName)} · ${formatCurrency(invoice.total)}</p>
                <div style="display: flex; gap: 8px;">
                   <button class="btn btn-primary" style="flex: 1;" onclick="this.closest('.modal').remove()">
                        ${lang === 'en' ? 'Cancel' : 'إلغاء'}
                    </button>
                    <button class="btn btn-outline" style="flex: 1; color: var(--red); border-color: var(--red);" onclick="confirmDeleteInvoice('${invoiceId}')">
                        ${lang === 'en' ? 'Delete' : 'حذف'}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function confirmDeleteInvoice(invoiceId) {
    const lang = settings.language;
    const invoice = invoices.find(i => i.id === invoiceId);
    
    if (invoice && invoice.shipmentId && typeof removeOrderFromShipment === 'function') {
        removeOrderFromShipment(invoiceId);
    }
    
    const index = invoices.findIndex(i => i.id === invoiceId);
    if (index > -1) {
        invoices.splice(index, 1);
        saveInvoices();
        updateCustomersFromInvoices();
    }
    
    document.querySelectorAll('.modal').forEach(m => m.remove());
    // إذا كنت في صفحة تاريخ الفواتير، حدث القائمة
if (currentPage === 'invoiceHistory' && typeof renderInvoiceHistoryList === 'function') {
    renderInvoiceHistoryList();
}
// إذا كنت في صفحة تفاصيل الفاتورة، ارجع للقائمة
else if (typeof switchPage === 'function') {
    switchPage('dashboard');
}
    showToast(t('deleted'));
    
    if (currentPage === 'invoiceHistory' && typeof renderInvoiceHistoryList === 'function') {
        renderInvoiceHistoryList();
    }
}
// طباعة الفاتورة
function printInvoicePreview() {
    const lang = settings.language;
    const deliveryInput = document.getElementById('invoiceDelivery');
    const delivery = deliveryInput && deliveryInput.value !== '' ? (parseFloat(deliveryInput.value) || 0) : 0;
    const inv = {
        id: generateInvoiceId(),
        date: new Date().toISOString(),
        customerName: selectedInvoiceCustomer ? selectedInvoiceCustomer.name : (document.getElementById('invoiceCustomerName')?.value || ''),
        items: [...invoiceItems],
        delivery: delivery,
        total: invoiceItems.reduce((s, i) => s + (i.price * i.quantity), 0) + delivery
    };
    
    const printHtml = `
        <div style="background: white; padding: 20px; max-width: 400px; font-family: 'IBM Plex Sans Arabic', Tahoma;">
            <h2 style="text-align: center; color: #121a2b; margin-bottom: 4px;">LORVEN</h2>
            <p style="text-align: center; font-size: 12px; color: #666;">${lang === 'en' ? 'Invoice' : 'فاتورة'}</p>
            <hr>
            <p style="font-size: 11px;"><strong>${lang === 'en' ? 'Invoice No.' : 'رقم الفاتورة'}:</strong> ${inv.id}</p>
            <p style="font-size: 11px;"><strong>${lang === 'en' ? 'Date' : 'التاريخ'}:</strong> ${formatDateTime(inv.date)}</p>
            <p style="font-size: 11px;"><strong>${lang === 'en' ? 'Customer' : 'العميلة'}:</strong> ${escapeHTML(inv.customerName)}</p>
            <hr>
            ${inv.items.map((item, idx) => `
                <p style="font-size: 11px;">${idx + 1}. ${escapeHTML(item.name)} (${item.quantity} × ${formatCurrency(item.price)}) = ${formatCurrency(item.quantity * item.price)}</p>
            `).join('')}
            ${inv.delivery > 0 ? `<p style="font-size: 11px;">${lang === 'en' ? 'Delivery' : 'التوصيل'}: ${formatCurrency(inv.delivery)}</p>` : ''}
            <hr>
            <p style="font-size: 13px; font-weight: 700; text-align: right;">${lang === 'en' ? 'Total' : 'الإجمالي'}: ${formatCurrency(inv.total)}</p>
            <p style="text-align: center; font-size: 10px; color: #999; margin-top: 20px;">${lang === 'en' ? 'Thank you for choosing LORVEN' : 'شكراً لاختياركِ لورڤين'}</p>
        </div>
    `;
    
    const tempDiv = document.createElement('div');
    tempDiv.id = 'printableInvoice';
    tempDiv.innerHTML = printHtml;
    document.body.appendChild(tempDiv);
    printElement('printableInvoice');
    setTimeout(() => tempDiv.remove(), 1000);
}

// دوال مساعدة إضافية
function getCustomerTierColor(tier) {
    const colors = {
        vip: settings.vipColor || '#e8919e',
        gold: settings.goldColor || '#c8a84e',
        silver: settings.silverColor || '#7c5cbf',
        bronze: settings.bronzeColor || '#b8734a',
        normal: settings.normalColor || '#8a8078'
    };
    return colors[tier] || colors.normal;
}

function updateCustomersFromInvoices() {
    // تحديث بيانات العملاء من الفواتير
    customers.forEach(customer => {
        const customerInvoices = invoices.filter(inv => inv.customerId === customer.id);
        customer.purchaseCount = customerInvoices.length;
        customer.totalSpent = customerInvoices.reduce((sum, inv) => sum + inv.total, 0);
        customer.totalPaid = customerInvoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
        customer.totalRemaining = customerInvoices.reduce((sum, inv) => sum + inv.remainingAmount, 0);
        if (customerInvoices.length > 0) {
            customer.lastPurchase = customerInvoices.sort((a, b) => new Date(b.date) - new Date(a.date))[0].date;
        }
    });
    saveCustomers();
}

function printElement(elementId) {
    const printContents = document.getElementById(elementId).innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
}

function exportInvoiceAsPDF(invoiceId) {
    const lang = settings.language;
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
            <meta charset="UTF-8">
            <title>${inv.id}</title>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { font-family: 'IBM Plex Sans Arabic', Tahoma, sans-serif; background: #F8F4F0; display: flex; justify-content: center; padding: 30px; color: #243048; }
                .invoice { max-width: 420px; width: 100%; background: white; border-radius: 24px; padding: 24px 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
                .logo { font-size: 26px; font-weight: 800; text-align: center; letter-spacing: 3px; margin-bottom: 4px; }
                .subtitle { text-align: center; font-size: 11px; color: #8F8A88; margin-bottom: 16px; }
                .divider { border-top: 2px solid #243048; margin: 16px 0; }
                .row { display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 6px; }
                .label { color: #8F8A88; }
                .value { font-weight: 600; }
                table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 11px; }
                th { border-bottom: 2px solid #243048; padding: 8px 0; text-align: right; font-weight: 700; }
                td { padding: 8px 0; border-bottom: 1px solid #E0D6D0; }
                .total-row { display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; margin-top: 12px; }
                .footer { text-align: center; font-size: 10px; color: #8F8A88; margin-top: 20px; }
                @media print { body { background: white; padding: 0; } }
            </style>
        </head>
        <body>
            <div class="invoice">
                <div class="logo">LORVEN</div>
                <div class="subtitle">${lang === 'en' ? 'INVOICE' : 'فاتورة'}</div>
                
                <div class="row"><span class="label">${lang === 'en' ? 'Invoice No.' : 'رقم الفاتورة'}</span><span class="value">${inv.id}</span></div>
                <div class="row"><span class="label">${lang === 'en' ? 'Date' : 'التاريخ'}</span><span class="value">${formatDate(inv.date)}</span></div>
                <div class="row"><span class="label">${lang === 'en' ? 'Customer' : 'العميلة'}</span><span class="value">${escapeHTML(inv.customerName)}</span></div>
                ${inv.customerPhone ? `<div class="row"><span class="label">${lang === 'en' ? 'Phone' : 'الجوال'}</span><span class="value">${inv.customerPhone}</span></div>` : ''}
                
                <div class="divider"></div>
                
                <table>
                    <tr><th>${lang === 'en' ? 'Item' : 'المنتج'}</th><th>${lang === 'en' ? 'Qty' : 'الكمية'}</th><th>${lang === 'en' ? 'Price' : 'السعر'}</th><th>${lang === 'en' ? 'Total' : 'الإجمالي'}</th></tr>
                    ${inv.items.map(i => `<tr><td>${escapeHTML(i.name)}</td><td>${i.quantity}</td><td>${i.price}</td><td>${i.quantity * i.price}</td></tr>`).join('')}
                </table>
                
                ${inv.delivery > 0 ? `<div class="row"><span class="label">${lang === 'en' ? 'Delivery' : 'التوصيل'}</span><span class="value">${inv.delivery}</span></div>` : ''}
                ${inv.delivery === 0 ? `<div class="row"><span class="label">${lang === 'en' ? 'Delivery' : 'التوصيل'}</span><span class="value">${lang === 'en' ? 'Free' : 'مجاني'}</span></div>` : ''}
                
                <div class="divider"></div>
                
                <div class="total-row"><span>${lang === 'en' ? 'Total' : 'الإجمالي'}</span><span>${formatCurrency(inv.total)}</span></div>
                
                <div class="footer">${lang === 'en' ? 'Thank you for choosing LORVEN 🤍' : 'شكراً لاختيارك لورفين 🤍'}</div>
            </div>
        </body></html>
    `);
    printWindow.document.close();
    setTimeout(() => printWindow.print(), 400);
}

function showBundleSelector() {
    const lang = settings.language;
    
    if (bundles.length === 0) {
        showToast(lang === 'en' ? 'No boxes available' : 'لا توجد بوكسات');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 360px; text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-cube"></i> ${lang === 'en' ? 'Select Box' : 'اختر بوكس'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                ${bundles.map(b => `
                    <button class="option-btn" onclick="selectBundle('${b.id}')">
                        <div style="flex: 1; text-align: right;">
                            <div style="font-weight: 700; font-size: 13px;">${escapeHTML(b.name)}</div>
                            <div style="font-size: 10px; color: var(--text-soft);">
                                ${b.items ? b.items.length : 0} ${lang === 'en' ? 'items' : 'منتجات'} · ${formatCurrency(b.totalPrice || b.price || 0)}
                            </div>
                        </div>
                        <i class="fas fa-plus" style="color: var(--text-soft);"></i>
                    </button>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function selectBundle(bundleId) {
    const bundle = bundles.find(b => b.id === bundleId);
    if (!bundle) return;
    
    const bundlePrice = bundle.totalPrice || bundle.price || 0;
    
    const existing = invoiceItems.find(i => i.name.toLowerCase() === bundle.name.toLowerCase());
    if (existing) {
        existing.quantity += 1;
    } else {
        invoiceItems.push({
            name: bundle.name,
            price: bundlePrice,
            quantity: 1,
            cost: 0
        });
    }
    
    document.querySelectorAll('.modal').forEach(m => m.remove());
    renderInvoiceItems();
    updateInvoiceSummary();
    showToast(settings.language === 'en' ? 'Box added!' : 'تم إضافة البوكس!');
}

function generateNotificationId() {
    return 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 6);
}
function isValidYemeniPhone(phone) {
    if (!phone || phone.length !== 9) return false;
    return phone.startsWith('77') || phone.startsWith('73') || phone.startsWith('71') || phone.startsWith('78') || phone.startsWith('70');
}

function isSaudiPhone(phone) {
    if (!phone || phone.length !== 9) return false;
    return phone.startsWith('5');
}

function showSaudiConfirmModal(phone) {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'saudiConfirmModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 360px; text-align: center;">
            <div class="modal-header">
                <div class="modal-title">${lang === 'en' ? 'Confirm Number' : 'تأكيد الرقم'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <p style="font-size: 14px; margin-bottom: 16px;">${lang === 'en' ? 'Are you sure this is a Saudi customer number?' : 'هل أنت متأكد أن هذا الرقم لعميل سعودي؟'}</p>
                <p style="font-size: 16px; font-weight: 700; margin-bottom: 20px;" dir="ltr">${phone}</p>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-primary" style="flex: 1;" onclick="confirmSaudiNumber('${phone}')">${lang === 'en' ? 'Yes' : 'نعم'}</button>
                    <button class="btn btn-outline" style="flex: 1;" onclick="document.getElementById('saudiConfirmModal').remove()">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function confirmSaudiNumber(phone) {
    document.getElementById('saudiConfirmModal')?.remove();
    proceedWithWhatsApp(phone);
}

function proceedWithWhatsApp(phone) {
    const lang = settings.language;
    isSaving = true;
    
    try {
        const invoice = buildInvoiceObject();
        
        const recentInvoices = invoices.slice(-5);
        const isDuplicate = recentInvoices.some(lastInvoice => 
            lastInvoice.customerName === invoice.customerName &&
            lastInvoice.total === invoice.total &&
            lastInvoice.items.length === invoice.items.length &&
            Math.abs(new Date(lastInvoice.date) - new Date(invoice.date)) < 3000 &&
            JSON.stringify(lastInvoice.items.map(i => i.name).sort()) === 
            JSON.stringify(invoice.items.map(i => i.name).sort())
        );
        
        if (isDuplicate) {
            showToast(lang === 'en' ? 'Duplicate invoice prevented' : 'تم منع إنشاء فاتورة مكررة');
            isSaving = false;
            return;
        }
        
        invoice.whatsappSent = true;
        invoices.push(invoice);
        
        if (typeof addOrderToShipment === 'function') {
            addOrderToShipment(invoice);
        }
        
        saveInvoices();
        updateCustomersFromInvoices();
        
        const message = buildWhatsAppMessage(invoice);
        let numberToSend = phone;
        if (settings.codeBehavior === 'prepend') {
            if (numberToSend.startsWith('0')) numberToSend = numberToSend.substring(1);
            numberToSend = settings.countryCode + numberToSend;
        }
        
        window.open(`https://wa.me/${numberToSend}?text=${encodeURIComponent(message)}`, '_blank');
        
        resetInvoicePage();
        showToast(t('invoiceSent'));
        
    } catch (error) {
        console.error('Error:', error);
        showToast(t('error'));
    } finally {
        setTimeout(() => {
            isSaving = false;
        }, 500);
    }
}
function sendSavedInvoiceWhatsApp(invoiceId) {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;
    
    const message = buildWhatsAppMessage(inv);
    let phone = cleanPhoneNumber(inv.customerPhone);
    if (settings.codeBehavior === 'prepend') {
        if (phone.startsWith('0')) phone = phone.substring(1);
        phone = settings.countryCode + phone;
    }
    
    inv.whatsappSent = true;
    saveInvoices();
    
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
    document.getElementById('invoiceDetailsModal')?.remove();
    showToast(t('invoiceSent'));
}
// أيقونة تغيير العملة
function setupCurrencyToggle() {
    const toggleBtn = document.getElementById('invoiceCurrencyToggle');
    const deliveryLabel = document.getElementById('deliveryCurrencyLabel');
    const paidField = document.getElementById('invoicePaidAmount');
    
    if (!toggleBtn) return;
    
    toggleBtn.addEventListener('click', function() {
        const currentCurrency = this.getAttribute('data-currency');
        const newCurrency = currentCurrency === 'ر.س' ? 'ر.ي' : 'ر.س';
        
        // تحديث الأيقونة
        this.setAttribute('data-currency', newCurrency);
        this.textContent = newCurrency;
        
        // تحديث رمز التوصيل
        if (deliveryLabel) deliveryLabel.textContent = newCurrency;
        
        // تحديث حقل العربون إذا كان موجود
        if (paidField && settings.downPaymentType !== 'none') {
            updateInvoiceSummary();
        }
    });
}
function shareSavedInvoice(invoiceId) {
    const inv = invoices.find(i => i.id === invoiceId);
    if (!inv) return;
    
    const message = buildWhatsAppMessage(inv);
    
    if (navigator.share) {
        navigator.share({
            title: inv.id,
            text: message
        }).catch(() => {});
    } else {
        copyToClipboard(message);
        showToast(settings.language === 'en' ? 'Copied!' : 'تم النسخ!');
    }
}
function applyDiscountCode() {
    const lang = settings.language;
    const codeInput = document.getElementById('invoiceDiscountCode');
    const code = codeInput.value.trim().toUpperCase();
    const infoDiv = document.getElementById('discountCodeInfo');
    
    if (!code) {
        infoDiv.style.display = 'block';
        infoDiv.style.color = 'var(--red)';
        infoDiv.textContent = lang === 'en' ? 'Enter a code' : 'أدخل الكود';
        return;
    }
    
    const loyaltyCode = loyaltyCodes.find(c => 
        c.code.toUpperCase() === code && 
        c.active && 
        new Date(c.expiresAt) > new Date() && 
        c.usedCount < c.maxUses
    );
    
    if (!loyaltyCode) {
        infoDiv.style.display = 'block';
        infoDiv.style.color = 'var(--red)';
        infoDiv.textContent = lang === 'en' ? 'Invalid or expired code' : 'الكود غير صالح أو منتهي';
        return;
    }
    
    const phoneInput = document.getElementById('invoiceCustomerPhone');
    const currentPhone = cleanPhoneNumber(phoneInput?.value || '');
    
    if (!currentPhone) {
        infoDiv.style.display = 'block';
        infoDiv.style.color = 'var(--red)';
        infoDiv.textContent = lang === 'en' ? 'Enter phone first' : 'أدخل رقم الجوال أولاً';
        return;
    }
    
    if (loyaltyCode.customerId) {
        const owner = customers.find(c => c.id === loyaltyCode.customerId);
        if (owner && owner.phone === currentPhone) {
            infoDiv.style.display = 'block';
            infoDiv.style.color = 'var(--red)';
            infoDiv.textContent = lang === 'en' ? 'Cannot use your own code' : 'لا يمكن استخدام كودك الخاص';
            return;
        }
    }
    
    if (loyaltyCode.usedBy && loyaltyCode.usedBy.includes(currentPhone)) {
        infoDiv.style.display = 'block';
        infoDiv.style.color = 'var(--red)';
        infoDiv.textContent = lang === 'en' ? 'Already used' : 'هذا الرقم استخدم الكود مسبقاً';
        return;
    }
    
    const subtotal = invoiceItems.reduce((s, i) => s + (i.price * i.quantity), 0);
    if (subtotal < loyaltyCode.minOrder) {
        infoDiv.style.display = 'block';
        infoDiv.style.color = 'var(--orange)';
        infoDiv.textContent = (lang === 'en' ? 'Min order: ' : 'الحد الأدنى: ') + loyaltyCode.minOrder;
        return;
    }
    
    window._appliedDiscount = {
        code: loyaltyCode.code,
        discount: loyaltyCode.discount,
        codeId: loyaltyCode.id,
        ownerCustomerId: loyaltyCode.customerId
    };
    
    infoDiv.style.display = 'block';
    infoDiv.style.color = 'var(--green)';
    infoDiv.textContent = (lang === 'en' ? 'Applied! -' : 'تم! خصم ') + loyaltyCode.discount + ' ' + (lang === 'en' ? 'SAR' : 'ريال');
    
    updateInvoiceSummary();
}
