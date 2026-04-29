// ==================== helpers.js ====================
// دوال مساعدة - LORVEN SYS v3.0

const TOAST_MSGS = {
    copied: { ar: '✅ تم النسخ', en: '✅ Copied' },
    saved: { ar: '✅ تم الحفظ', en: '✅ Saved' },
    deleted: { ar: 'تم الحذف', en: 'Deleted' },
    error: { ar: '❌ حدث خطأ', en: '❌ Error occurred' },
    soundOn: { ar: '🔊 الصوت مفعل', en: '🔊 Sound on' },
    soundOff: { ar: '🔇 الصوت معطل', en: '🔇 Sound off' },
    dataCleared: { ar: '✅ تم مسح جميع البيانات', en: '✅ All data cleared' },
    backupExported: { ar: '✅ تم تصدير النسخة', en: '✅ Backup exported' },
    backupImported: { ar: '✅ تم استيراد النسخة', en: '✅ Backup imported' },
    invoiceSaved: { ar: '✅ تم حفظ الفاتورة', en: '✅ Invoice saved' },
    invoiceSent: { ar: 'تم فتح واتساب', en: 'WhatsApp opened' },
    invoiceEmpty: { ar: '❌ الفاتورة فارغة', en: '❌ Invoice is empty' },
    customerAdded: { ar: '✅ تمت إضافة العميلة', en: '✅ Customer added' },
    customerUpdated: { ar: '✅ تم تحديث العميلة', en: '✅ Customer updated' },
    customerDeleted: { ar: 'تم حذف العميلة', en: ' Customer deleted' },
    shipmentCreated: { ar: '✅ تم بدء الشحنة', en: '✅ Shipment created' },
    shipmentClosed: { ar: '✅ تم إغلاق الشحنة', en: '✅ Shipment closed' },
    shipmentArrived: { ar: '📦 وصلت الشحنة!', en: '📦 Shipment arrived!' },
    shipmentDelayed: { ar: '⚠️ تأخرت الشحنة', en: '⚠️ Shipment delayed' },
    shipmentSentToSupplier: { ar: '✅ تم إرسال الشحنة للمعرض', en: '✅ Shipment sent to supplier' },
    bundleAdded: { ar: '✅ تم إضافة البوكس', en: '✅ Bundle added' },
    supplierAdded: { ar: '✅ تم إضافة المعرض', en: '✅ Supplier added' },
    wishlistAdded: { ar: '✅ تم إضافة المنتج للقائمة', en: '✅ Product added to wishlist' },
    fillFields: { ar: '❌ الرجاء ملء الحقول المطلوبة', en: '❌ Please fill required fields' },
    pinRequired: { ar: '❌ الرمز مطلوب', en: '❌ PIN required' },
    pinLength: { ar: '❌ الرمز يجب أن يكون ٤ إلى ٦ أرقام', en: '❌ PIN must be 4 to 6 digits' },
    pinDigitsOnly: { ar: '❌ الرمز يجب أن يكون أرقام فقط', en: '❌ PIN must be digits only' },
    passwordRequired: { ar: '❌ كلمة المرور مطلوبة', en: '❌ Password required' },
    passwordInvalid: { ar: '❌ كلمة المرور غير صالحة', en: '❌ Invalid password' },
    passwordChars: { ar: '❌ استخدم فقط: حروف - أرقام - _ - * + & $ # .', en: '❌ Use only: letters - numbers - _ - * + & $ # .' },
    passwordNoSymbols: { ar: '❌ الرموز الزخرفية غير مسموحة', en: '❌ Decorative symbols not allowed' },
    passwordNoPunctuation: { ar: '❌ علامات ؟ ! / \\ غير مسموحة', en: '❌ Punctuation ? ! / \\ not allowed' },
    passwordNoSpaces: { ar: '❌ المسافات غير مسموحة', en: '❌ Spaces not allowed' },
    wrongPin: { ar: '❌ رمز PIN خطأ', en: '❌ Wrong PIN' },
    wrongPassword: { ar: '❌ كلمة المرور خطأ', en: '❌ Wrong password' },
    wrongAnswer: { ar: '❌ إجابة خاطئة', en: '❌ Wrong answer' },
    clearDataWarning: { ar: 'تحذير: لا يمكن التراجع عن هذا!', en: 'WARNING: This cannot be undone!' },
    typeDelete: { ar: 'اكتب "مسح" للتأكيد', en: 'Type "DELETE" to confirm' },
    wrongWord: { ar: 'الكلمة غير صحيحة', en: 'Incorrect word' },
    securitySaved: { ar: '✅ تم حفظ إعدادات الأمان', en: '✅ Security settings saved' },
    settingsSaved: { ar: '✅ تم حفظ الإعدادات', en: '✅ Settings saved' },
    noCustomer: { ar: '❌ الرجاء اختيار عميلة', en: '❌ Please select a customer' },
    noItems: { ar: '❌ الرجاء إضافة منتجات', en: '❌ Please add items' },
    allReceived: { ar: '✅ تم تحديد الكل كمستلم', en: '✅ All marked as received' },
};

function t(key) {
    if (!TOAST_MSGS[key]) return key;
    return TOAST_MSGS[key][settings.language] || TOAST_MSGS[key].ar;
}

function cleanPhoneNumber(phone) {
    if (!phone) return '';
    let cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.startsWith('967') && cleaned.length > 9) {
        cleaned = cleaned.substring(3);
    }
    if (cleaned.startsWith('966') && cleaned.length > 9) {
        cleaned = cleaned.substring(3);
    }
    
    cleaned = cleaned.substring(0, 9);
    return cleaned;
}

function validateCustomerPhone(phone) {
    const cleaned = cleanPhoneNumber(phone);
    if (cleaned.length !== 9) {
        return settings.language === 'en' ? 'Phone must be 9 digits' : 'رقم الجوال يجب أن يكون ٩ أرقام';
    }
    return null;
}

function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast(t('copied'));
        });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            showToast(t('copied'));
        } catch (e) {
            showToast(t('error'));
        }
        document.body.removeChild(textarea);
    }
}

function showToast(message, duration = 2000) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    let msg = message;
    if (typeof message === 'string' && TOAST_MSGS[message]) {
        msg = t(message);
    }
    
    toast.textContent = msg;
    toast.classList.add('show');
    
    if (typeof playSound === 'function') {
        playSound('confirm');
    }
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

function showConfirmModal(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    if (!modal) return;
    
    const lang = settings.language === 'en' ? 'en' : 'ar';
    document.getElementById('confirmModalMessage').textContent = message;
    document.getElementById('confirmCancelBtn').textContent = i18n[lang].cancel || (lang === 'en' ? 'Cancel' : 'إلغاء');
    document.getElementById('confirmOkBtn').textContent = i18n[lang].confirm || (lang === 'en' ? 'Yes' : 'نعم');
    
    modal.style.display = 'flex';
    
    document.getElementById('confirmOkBtn').onclick = function() {
        modal.style.display = 'none';
        if (typeof onConfirm === 'function') {
            onConfirm();
        }
    };
    
    document.getElementById('confirmCancelBtn').onclick = function() {
        modal.style.display = 'none';
    };
}

function closeConfirmModal() {
    const modal = document.getElementById('confirmModal');
    if (modal) modal.style.display = 'none';
}

function formatCurrency(amount) {
    const num = parseFloat(amount) || 0;
    return num.toFixed(2);
}
function formatDate(dateStr, lang) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const locale = (lang || settings.language) === 'en' ? 'en-US' : 'ar-SA';
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatDateTime(dateStr, lang) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const locale = (lang || settings.language) === 'en' ? 'en-US' : 'ar-SA';
    return date.toLocaleDateString(locale, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function getDaysRemaining(targetDate) {
    if (!targetDate) return null;
    const now = new Date();
    const target = new Date(targetDate);
    const diffMs = target - now;
    return Math.ceil(diffMs / 86400000);
}

function getDaysDelayed(expectedDate) {
    if (!expectedDate) return 0;
    const now = new Date();
    const expected = new Date(expectedDate);
    const diffMs = now - expected;
    return Math.max(0, Math.floor(diffMs / 86400000));
}

function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

function generateCustomerId() {
    const existingIds = customers.map(c => c.id);
    let id;
    let attempts = 0;
    const max = existingIds.length > 900 ? 9999 : 999;
    
    while (attempts < 100) {
        const random = Math.floor(Math.random() * max) + 1;
        const padLength = max > 999 ? 4 : 3;
        id = `CU-${String(random).padStart(padLength, '0')}`;
        if (!existingIds.includes(id)) return id;
        attempts++;
    }
    
    const random4 = Math.floor(Math.random() * 9000) + 1000;
    return `CU-${String(random4).padStart(4, '0')}`;
}

function generateShipmentId() {
    const existingIds = shipments.map(s => s.id);
    let id;
    let attempts = 0;
    const max = existingIds.length > 900 ? 9999 : 999;
    
    while (attempts < 100) {
        const random = Math.floor(Math.random() * max) + 1;
        const padLength = max > 999 ? 4 : 3;
        id = `SH-${String(random).padStart(padLength, '0')}`;
        if (!existingIds.includes(id)) return id;
        attempts++;
    }
    
    const random4 = Math.floor(Math.random() * 9000) + 1000;
    return `SH-${String(random4).padStart(4, '0')}`;
}

function generateInvoiceId() {
    const existingIds = invoices.map(i => i.id);
    let id;
    let attempts = 0;
    const max = existingIds.length > 900 ? 9999 : 999;
    
    while (attempts < 100) {
        const random = Math.floor(Math.random() * max) + 1;
        const padLength = max > 999 ? 4 : 3;
        id = `LVN-${String(random).padStart(padLength, '0')}`;
        if (!existingIds.includes(id)) return id;
        attempts++;
    }
    
    const random4 = Math.floor(Math.random() * 9000) + 1000;
    return `LVN-${String(random4).padStart(4, '0')}`;
}

function validatePin(pin) {
    if (!pin || pin.trim() === '') return t('pinRequired');
    if (!/^\d+$/.test(pin)) return t('pinDigitsOnly');
    if (pin.length < 4 || pin.length > 6) return t('pinLength');
    return null;
}

function validatePassword(password) {
    if (!password || password.trim() === '') return t('passwordRequired');
    
    const allowed = /^[a-zA-Z0-9_\-*+&$#.]+$/;
    const forbidden = /[^\x00-\x7F]/;
    const punctuation = /[؟!\/\\()[\]{}'"]/;
    const spaces = /\s/;
    
    if (!allowed.test(password)) return t('passwordChars');
    if (forbidden.test(password)) return t('passwordNoSymbols');
    if (punctuation.test(password)) return t('passwordNoPunctuation');
    if (spaces.test(password)) return t('passwordNoSpaces');
    if (password.length < 4) return t('passwordInvalid');
    
    return null;
}

function getCustomerTier(purchaseCount) {
    if (purchaseCount >= settings.vipLimit) return 'vip';
    if (purchaseCount >= settings.goldLimit) return 'gold';
    if (purchaseCount >= settings.silverLimit) return 'silver';
    if (purchaseCount > 0) return 'bronze';
    return 'normal';
}

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

function getCustomerTierName(tier, lang) {
    if (!tier) tier = 'normal';
    
    const names = {
        ar: { 
            vip: 'VIP', 
            gold: 'ذهبي', 
            silver: 'مميز', 
            bronze: 'نشيط', 
            normal: 'عادي' 
        },
        en: { 
            vip: 'VIP', 
            gold: 'Gold', 
            silver: 'Silver', 
            bronze: 'Active', 
            normal: 'Normal' 
        }
    };
    
    const langKey = lang || settings.language || 'ar';
    const tierNames = names[langKey] || names.ar;
    
    return tierNames[tier] || tier;
}
function updateCustomersFromInvoices() {
    const customerMap = {};
    
    invoices.forEach(inv => {
        if (inv.customerPhone) {
            const cleanedPhone = cleanPhoneNumber(inv.customerPhone);
            if (!customerMap[cleanedPhone]) {
                customerMap[cleanedPhone] = {
                    phone: cleanedPhone,
                    name: inv.customerName || '',
                    purchaseCount: 0,
                    totalSpent: 0,
                    totalPaid: 0,
                    totalRemaining: 0,
                    lastPurchase: null
                };
            }
            customerMap[cleanedPhone].purchaseCount++;
            customerMap[cleanedPhone].totalSpent += inv.total || 0;
            customerMap[cleanedPhone].totalPaid += inv.paidAmount || 0;
            customerMap[cleanedPhone].totalRemaining += inv.remainingAmount || 0;
            
            if (!customerMap[cleanedPhone].lastPurchase || 
                new Date(inv.date) > new Date(customerMap[cleanedPhone].lastPurchase)) {
                customerMap[cleanedPhone].lastPurchase = inv.date;
            }
        }
    });
    
    Object.values(customerMap).forEach(custData => {
        const existing = customers.find(c => cleanPhoneNumber(c.phone) === custData.phone);
        if (existing) {
            existing.purchaseCount = custData.purchaseCount;
            existing.totalSpent = custData.totalSpent;
            existing.totalPaid = custData.totalPaid;
            existing.totalRemaining = custData.totalRemaining;
            existing.lastPurchase = custData.lastPurchase;
            existing.tier = getCustomerTier(custData.purchaseCount);
        }
    });
}
function getTimeAgo(dateStr, lang) {
    if (!dateStr) return '';
    const now = new Date();
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    const isEnglish = (lang || settings.language) === 'en';
    
    if (isEnglish) {
        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return formatDate(dateStr, 'en');
    }
    
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `قبل ${diffMins} د`;
    if (diffHours < 24) return `قبل ${diffHours} س`;
    if (diffDays < 7) return `قبل ${diffDays} يوم`;
    return formatDate(dateStr, 'ar');
}