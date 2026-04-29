// ==================== loyalty.js ====================
// صفحة إدارة الأكواد والمكافآت - LORVEN SYS v3.0

function renderLoyaltyPage(container) {
    const lang = settings.language;
    
    const activeCodes = loyaltyCodes.filter(c => c.active && new Date(c.expiresAt) > new Date());
    const expiredCodes = loyaltyCodes.filter(c => !c.active || new Date(c.expiresAt) <= new Date());
    
    let html = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h3 style="font-size: 18px; font-weight: 700;">
                <i class="fas fa-gift"></i> ${lang === 'en' ? 'Loyalty Codes' : 'أكواد الولاء'}
                <span style="font-size: 12px; color: var(--text-soft);">(${activeCodes.length})</span>
            </h3>
            <button class="btn btn-primary" style="padding: 8px 14px; font-size: 12px;" onclick="openCreateCodeModal()">
                <i class="fas fa-plus"></i> ${lang === 'en' ? 'Create Code' : 'إنشاء كود'}
            </button>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 6px; margin-bottom: 14px;">
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800;">${activeCodes.length}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Active Codes' : 'أكواد نشطة'}</div>
            </div>
            <div class="stat-card" style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800;">${loyaltyCodes.reduce((s,c) => s + c.discount * c.usedCount, 0)}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Total Discounts' : 'إجمالي الخصومات'}</div>
            </div>
        </div>
    `;
    
    if (activeCodes.length > 0) {
        html += `
            <h4 style="font-size: 14px; font-weight: 700; margin-bottom: 8px;">
                <i class="fas fa-check-circle" style="color: var(--green);"></i> ${lang === 'en' ? 'Active' : 'نشطة'}
            </h4>
            ${activeCodes.map(c => codeCard(c, lang)).join('')}
        `;
    }
    
    if (expiredCodes.length > 0) {
        html += `
            <h4 style="font-size: 14px; font-weight: 700; margin: 16px 0 8px;">
                <i class="fas fa-times-circle" style="color: var(--text-soft);"></i> ${lang === 'en' ? 'Expired / Inactive' : 'منتهية / غير نشطة'}
            </h4>
            ${expiredCodes.map(c => codeCard(c, lang)).join('')}
        `;
    }
    
    html += '<div style="height: 90px;"></div>';
    container.innerHTML = html;
}

function codeCard(c, lang) {
    const daysLeft = Math.ceil((new Date(c.expiresAt) - new Date()) / (1000 * 60 * 60 * 24));
    const progressPercent = (c.usedCount / c.maxUses) * 100;
    
    return `
        <div class="stat-card" style="margin-bottom: 8px; position: relative;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <div style="text-align: center; min-width: 70px;">
                    <div class="copyable-id" onclick="copyToClipboard('${c.code}')" style="font-size: 20px; font-weight: 800; letter-spacing: 3px; cursor: pointer; padding: 4px 8px;">${c.code}</div>
                    <div style="font-size: 9px; color: var(--text-soft); margin-top: 2px;">${lang === 'en' ? 'Discount' : 'خصم'} ${c.discount} ${lang === 'en' ? 'SAR' : 'ريال'}</div>
                </div>
                <div style="flex: 1;">
                    <div style="font-weight: 700; font-size: 13px;">${escapeHTML(c.customerName)}</div>
                    <div style="font-size: 10px; color: var(--text-soft);">${getCustomerTierName(c.tier)}</div>
                    <div style="background: var(--hover); border-radius: 6px; height: 3px; margin-top: 6px; overflow: hidden;">
                        <div style="width: ${progressPercent}%; height: 100%; background: ${progressPercent >= 100 ? 'var(--red)' : 'var(--green)'}; border-radius: 6px;"></div>
                    </div>
                    <div style="font-size: 9px; color: var(--text-soft); margin-top: 3px;">
                        ${c.usedCount}/${c.maxUses} ${lang === 'en' ? 'used' : 'مستخدم'}
                        ${daysLeft > 0 ? ` | ${daysLeft} ${lang === 'en' ? 'days' : 'يوم'}` : ' | ' + (lang === 'en' ? 'Expired' : 'منتهي')}
                        | ${c.pointsEarned} ${lang === 'en' ? 'points' : 'نقطة'}
                    </div>
                </div>
                <button class="btn btn-outline" style="padding: 6px; min-width: 32px; color: var(--red); border-color: transparent;" onclick="deleteLoyaltyCode('${c.id}')">
    <i class="fas fa-trash"></i>
</button>
                <button class="btn btn-outline" style="padding: 6px; min-width: 32px; color: var(--red); border-color: transparent;" onclick="deactivateCode('${c.id}')">
                    <i class="fas fa-power-off"></i>
                </button>
            </div>
        </div>
    `;
}

// ==================== مودال اختيار الطريقة ====================

function openCreateCodeModal() {
    const lang = settings.language;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'createCodeModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-gift"></i> ${lang === 'en' ? 'Create Loyalty Code' : 'إنشاء كود ولاء'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <p style="font-size: 12px; color: var(--text-soft); margin-bottom: 12px; text-align: right;">${lang === 'en' ? 'Choose method' : 'اختر الطريقة'}</p>
                
                <button class="option-btn" onclick="this.closest('.modal').remove(); openSelectCustomerForCode()">
                    <i class="fas fa-user-check" style="width: 24px; color: var(--text-soft);"></i>
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'For a specific customer' : 'لعميلة محددة'}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
                
                <button class="option-btn" onclick="generateRandomCode()">
                    <i class="fas fa-random" style="width: 24px; color: var(--text-soft);"></i>
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Random code' : 'كود عشوائي'}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// ==================== مودال اختيار عميلة مع بحث ====================

function openSelectCustomerForCode() {
    const lang = settings.language;
    const eligible = customers.filter(c => c.tier === 'vip' || c.tier === 'gold' || c.tier === 'silver');
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-user-check"></i> ${lang === 'en' ? 'Select Customer' : 'اختر العميلة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div class="form-group" style="text-align: right;">
                    <div class="floating-group">
                        <input type="text" class="form-control" id="customerCodeSearch" placeholder=" " oninput="searchCustomerForCode()">
                        <label>${lang === 'en' ? 'Search customers' : 'ابحث عن عميلة'}</label>
                    </div>
                </div>
                <div id="customerCodeList" style="max-height: 300px; overflow-y: auto;">
                    ${eligible.length === 0 ? `
                        <p style="color: var(--text-soft); padding: 20px;">${lang === 'en' ? 'No eligible customers' : 'لا توجد عميلات مؤهلة'}</p>
                    ` : eligible.map(c => `
                        <button class="option-btn" onclick="generateCodeForCustomer('${c.id}')">
                            <div style="flex: 1; text-align: right;">
                                <div style="font-weight: 700; font-size: 13px;">${escapeHTML(c.name)}</div>
                                <div style="font-size: 10px; color: var(--text-soft);">${getCustomerTierName(c.tier)} | ${c.purchaseCount || 0} ${lang === 'en' ? 'orders' : 'طلب'}</div>
                            </div>
                            <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                        </button>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function searchCustomerForCode() {
    const lang = settings.language;
    const q = document.getElementById('customerCodeSearch').value.trim().toLowerCase();
    const eligible = customers.filter(c => (c.tier === 'vip' || c.tier === 'gold' || c.tier === 'silver') && (c.name.toLowerCase().includes(q) || c.phone.includes(q)));
    const list = document.getElementById('customerCodeList');
    
    if (eligible.length === 0) {
        list.innerHTML = `<p style="color: var(--text-soft); padding: 20px;">${lang === 'en' ? 'No results' : 'لا توجد نتائج'}</p>`;
        return;
    }
    
    list.innerHTML = eligible.map(c => `
        <button class="option-btn" onclick="generateCodeForCustomer('${c.id}')">
            <div style="flex: 1; text-align: right;">
                <div style="font-weight: 700; font-size: 13px;">${escapeHTML(c.name)}</div>
                <div style="font-size: 10px; color: var(--text-soft);">${getCustomerTierName(c.tier)} | ${c.purchaseCount || 0} ${lang === 'en' ? 'orders' : 'طلب'}</div>
            </div>
            <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
        </button>
    `).join('');
}

// ==================== فتح مودال إعدادات الكود ====================

function generateCodeForCustomer(customerId) {
    document.querySelectorAll('.modal').forEach(m => m.remove());
    openCodeSettingsModal(customerId);
}

function generateRandomCode() {
    document.querySelectorAll('.modal').forEach(m => m.remove());
    openCodeSettingsModal(null);
}

// ==================== مودال إعدادات الكود ====================

function openCodeSettingsModal(customerId) {
    const lang = settings.language;
    const customer = customerId ? customers.find(c => c.id === customerId) : null;
    const tier = customer ? customer.tier : 'general';
    
    const defaults = {
        vip: { discount: 20, minOrder: 200, maxUses: 5, days: 60 },
        gold: { discount: 15, minOrder: 150, maxUses: 5, days: 45 },
        silver: { discount: 10, minOrder: 120, maxUses: 3, days: 30 },
        general: { discount: 10, minOrder: 100, maxUses: 5, days: 30 }
    };
    
    const d = defaults[tier] || defaults.general;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'codeSettingsModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-sliders-h"></i> ${lang === 'en' ? 'Code Settings' : 'إعدادات الكود'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                ${customer ? `
                    <p style="font-size: 13px; font-weight: 700; margin-bottom: 12px; text-align: right;">${escapeHTML(customer.name)} | ${getCustomerTierName(tier)}</p>
                ` : ''}
                
                <div class="form-group" style="text-align: right;">
                    <div class="floating-group">
                        <input type="number" class="form-control" id="settingsDiscount" value="${d.discount}" min="5" max="50" placeholder=" ">
                        <label>${lang === 'en' ? 'Discount (SAR)' : 'قيمة الخصم (ريال)'}</label>
                    </div>
                </div>
                
                <div class="form-group" style="text-align: right;">
                    <div class="floating-group">
                        <input type="number" class="form-control" id="settingsMinOrder" value="${d.minOrder}" min="50" placeholder=" ">
                        <label>${lang === 'en' ? 'Minimum Order (SAR)' : 'الحد الأدنى للطلب (ريال)'}</label>
                    </div>
                </div>
                
                <div class="form-group" style="text-align: right;">
                    <div class="floating-group">
                        <input type="number" class="form-control" id="settingsMaxUses" value="${d.maxUses}" min="1" max="20" placeholder=" ">
                        <label>${lang === 'en' ? 'Max Uses' : 'عدد مرات الاستخدام'}</label>
                    </div>
                </div>
                
                <div class="form-group" style="text-align: right;">
                    <div class="floating-group">
                        <input type="number" class="form-control" id="settingsDays" value="${d.days}" min="7" max="90" placeholder=" ">
                        <label>${lang === 'en' ? 'Validity (Days)' : 'مدة الصلاحية (يوم)'}</label>
                    </div>
                </div>
                
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                    <button class="btn btn-primary" style="flex: 1;" onclick="finalizeCreateCode('${customerId || ''}')">
                        <i class="fas fa-check"></i> ${lang === 'en' ? 'Create Code' : 'إنشاء الكود'}
                    </button>
                    <button class="btn btn-outline" style="flex: 1;" onclick="this.closest('.modal').remove()">
                        ${lang === 'en' ? 'Cancel' : 'إلغاء'}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function finalizeCreateCode(customerId) {
    const lang = settings.language;
    const discount = parseInt(document.getElementById('settingsDiscount').value) || 10;
    const minOrder = parseInt(document.getElementById('settingsMinOrder').value) || 100;
    const maxUses = parseInt(document.getElementById('settingsMaxUses').value) || 5;
    const days = parseInt(document.getElementById('settingsDays').value) || 30;
    
    const customer = customerId ? customers.find(c => c.id === customerId) : null;
    const name = customer ? customer.name : (lang === 'en' ? 'General' : 'عام');
    const code = customer ? generateLoyaltyCode(customer.name) : generateRandomCodeString();
    
    const newCode = {
        id: 'LOY-' + Date.now(),
        code: code,
        customerId: customerId || null,
        customerName: name,
        tier: customer ? customer.tier : 'general',
        discount: discount,
        minOrder: minOrder,
        maxUses: maxUses,
        usedCount: 0,
        pointsEarned: 0,
        totalPoints: customer ? customer.totalLoyaltyPoints || 0 : 0,
        usedBy: [],
        createdAt: new Date().toISOString(),
        expiresAt: (() => { const d = new Date(); d.setDate(d.getDate() + days); return d.toISOString(); })(),
        active: true
    };
    
    loyaltyCodes.push(newCode);
    saveLoyaltyCodes();
    document.querySelectorAll('.modal').forEach(m => m.remove());
    showToast(lang === 'en' ? 'Code created: ' + code : 'تم إنشاء الكود: ' + code);
    if (currentPage === 'loyalty') renderLoyaltyPage(document.getElementById('mainContent'));
}

function generateLoyaltyCode(customerName) {
    const arabicToEnglish = {
        'ا': 'A', 'ب': 'B', 'ت': 'T', 'ث': 'Th', 'ج': 'J', 'ح': 'H', 'خ': 'Kh',
        'د': 'D', 'ذ': 'Dh', 'ر': 'R', 'ز': 'Z', 'س': 'S', 'ش': 'Sh', 'ص': 'S',
        'ض': 'D', 'ط': 'T', 'ظ': 'Z', 'ع': 'A', 'غ': 'G', 'ف': 'F', 'ق': 'Q',
        'ك': 'K', 'ل': 'L', 'م': 'M', 'ن': 'N', 'ه': 'H', 'و': 'W', 'ي': 'Y',
        'ة': 'H', 'ء': 'A', 'أ': 'A', 'إ': 'A', 'آ': 'A', 'ئ': 'A', 'ؤ': 'A',
        ' ': '', 'ى': 'A', 'ـ': ''
    };
    
    let englishName = '';
    const cleanName = customerName.trim();
    
    for (let i = 0; i < cleanName.length; i++) {
        const char = cleanName[i];
        englishName += arabicToEnglish[char] || char.toUpperCase();
    }
    
    if (englishName.length < 2) return generateRandomCodeString();
    
    const first = englishName.charAt(0);
    const second = englishName.charAt(1);
    const num1 = Math.floor(Math.random() * 10);
const num2 = Math.floor(Math.random() * 100).toString().padStart(2, '0');

    return first + num1 + second + num2;
}

function generateRandomCodeString() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const getChar = () => chars[Math.floor(Math.random() * chars.length)];
return getChar() + Math.floor(Math.random() * 10) + getChar() + Math.floor(Math.random() * 100).toString().padStart(2, '0');
}

function deactivateCode(codeId) {
    const code = loyaltyCodes.find(c => c.id === codeId);
    if (code) {
        code.active = false;
        saveLoyaltyCodes();
        if (currentPage === 'loyalty') renderLoyaltyPage(document.getElementById('mainContent'));
        showToast(settings.language === 'en' ? 'Code deactivated' : 'تم تعطيل الكود');
    }
}

function deleteLoyaltyCode(codeId) {
    const lang = settings.language;
    const code = loyaltyCodes.find(c => c.id === codeId);
    if (!code) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title">${lang === 'en' ? 'Delete Code' : 'مسح الكود'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <i class="fas fa-trash" style="font-size: 40px; color: var(--red); margin-bottom: 12px;"></i>
                <p style="font-size: 14px; margin-bottom: 4px;">${lang === 'en' ? 'Delete this code?' : 'مسح هذا الكود؟'}</p>
                <p style="font-size: 18px; font-weight: 700; margin-bottom: 16px;">${code.code}</p>
                <div style="display: flex; gap: 8px;">
                                    <button class="btn btn-primary" style="flex: 1;" onclick="this.closest('.modal').remove()">
                        ${lang === 'en' ? 'Cancel' : 'إلغاء'}
                    </button>
                    <button class="btn btn-outline" style="flex: 1; color: var(--red); border-color: var(--red);" id="confirmDeleteCodeBtn">
                        ${lang === 'en' ? 'Delete' : 'مسح'}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('confirmDeleteCodeBtn').onclick = function() {
        loyaltyCodes = loyaltyCodes.filter(c => c.id !== codeId);
        saveLoyaltyCodes();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(lang === 'en' ? 'Code deleted' : 'تم مسح الكود');
        if (currentPage === 'loyalty') renderLoyaltyPage(document.getElementById('mainContent'));
    };
}