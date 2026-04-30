// ==================== تعريف المتغيرات العامة (Global Variables) ====================
// تأكد من تعريف هذه المتغيرات في البداية لتجنب أخطاء ReferenceError
var APP_VERSION = "3.0.0";
var isAppInitialized = false;
var currentPage = 'dashboard';
var loyaltyCodes = [];

// كائنات البيانات الأساسية
var settings = {
    language: 'ar',
    darkMode: 'auto',
    lastBackupDate: null,
    currency: 'ر.س',
    countryCode: '967',
    codeBehavior: 'prepend',
    whatsappTemplate: `أهلاً جميلة لورڤين: {firstName} ✨

تم تسجيل طلبك بنجاح، ونحنُ بكل حُب نجهز تفاصيله الان 🌸

⟡ رقم الطلب: #{orderId}
⟡ الشحنة: {shipmentId}
⟡ التاريخ: {formattedDate}

المنتجات:
{items}
__________________

⟡ التوصيل: {delivery}
⟡ {discount}
__________________

⟡ الإجمالي: {total}

⟡ الدفع: {paymentStatus}

ممتنين لاختيارك لورڤين ليكون جزءاً من جمالك.. 🤍`

};

// المصفوفات المطلوبة للنظام
var invoices = [];
var customers = [];
var shipments = [];
var suppliers = [];
var bundles = [];
var wishlist = [];
var notifications = [];
let invoiceItems = [];
var notes = [];

// ==================== دوال التهيئة والإعدادات ====================

// تهيئة التطبيق
async function initApp() {
    if (isAppInitialized) return;
    
    console.log('⏳ Initializing LORVEN SYS...');

    await initDatabase();
    loadData();
    
    applyLanguage();
    applyTheme();
    
    isAppInitialized = true;
    console.log('✅ LORVEN SYS v' + APP_VERSION + ' initialized');
}

// تطبيق اللغة
function applyLanguage() {
    let lang = settings.language || 'ar';
    if (lang === 'auto') {
        lang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    }
    
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    
    // تحديث النصوص في الصفحة التي تحمل data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });
}

// تطبيق الثيم (داكن/فاتح)
function applyTheme() {
    let theme = settings.darkMode || 'light';
    if (theme === 'auto') {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.body.classList.toggle('dark-mode', theme === 'dark');
}

// نظام الترجمة المبسط
function t(key) {
    const lang = settings.language || 'ar';
    const translations = {
        'dashboard': { ar: 'الرئيسية', en: 'Dashboard' },
        'invoices': { ar: 'الفواتير', en: 'Invoices' },
        'customers': { ar: 'العملاء', en: 'Customers' },
        'settings': { ar: 'الإعدادات', en: 'Settings' },
        'save': { ar: 'حفظ', en: 'Save' },
        'delete': { ar: 'حذف', en: 'Delete' }
        // أضف بقية الكلمات هنا بنفس النمط
    };
    
    if (translations[key]) {
        return translations[key][lang] || key;
    }
    return key;
}

// ==================== دوال المساعدة العامة ====================

// نسخ النص للحافظة
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        const msg = settings.language === 'en' ? 'Copied' : 'تم النسخ';
        showToast(`✅ ${text} ${msg}`);
    }).catch(() => {
        const msg = settings.language === 'en' ? 'Failed' : 'فشل النسخ';
        showToast(msg, 'error');
    });
}

// عرض إشعار (Toast)
function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-message');
    if (existing) existing.remove();
    
    const toast = document.createElement('div');
    toast.className = `toast-message toast-${type}`;
    toast.textContent = message;
    
    // التنسيق الجمالي (Minimalist Luxury)
    toast.style.cssText = `
        position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
        background: ${type === 'error' ? '#e74c3c' : '#2c3e50'};
        color: white; padding: 12px 24px; border-radius: 50px;
        z-index: 10000; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        font-size: 14px; transition: opacity 0.3s;
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 2500);
}

// ==================== إدارة الصفحات ====================

function switchPage(page) {
    currentPage = page;
    const container = document.getElementById('mainContent');
    if (!container) return;
    
    // تفريغ المحتوى الحالي
    container.innerHTML = '';

    // منطق التنقل
    const renderers = {
        'dashboard': typeof renderDashboard === 'function' ? renderDashboard : null,
        'customers': typeof renderCustomersPage === 'function' ? renderCustomersPage : null,
        'invoices': typeof renderInvoicesPage === 'function' ? renderInvoicesPage : null
    };

    if (renderers[page]) {
        renderers[page](container);
    } else {
        container.innerHTML = `<div style="padding:20px; text-align:center;">${page} - قريباً</div>`;
    }
    
    // تحديث شكل القائمة السفلية
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
}
// ==================== دوال إضافية مفقودة ====================

// حساب عدد الإشعارات غير المقروءة
function getUnreadNotificationsCount() {
    return notifications.filter(n => !n.read).length;
}

// فتح قفل التطبيق (سيتم استكماله لاحقاً)
function checkAppLock() {
    // مؤقت - سيتم تطويرها لاحقاً
    if (typeof switchPage === 'function') {
        switchPage('dashboard');
    }
}

// فحص الإشعارات التلقائية
function checkAutoNotifications() {
    const now = new Date();
    
    // فحص الفواتير غير المرسلة
    if (settings.notifyInvoiceNotSent) {
        const unsentInvoices = invoices.filter(inv => !inv.whatsappSent);
        const days = settings.notifyInvoiceNotSentDays || 1;
        unsentInvoices.forEach(inv => {
            const invDate = new Date(inv.date);
            const diffDays = Math.floor((now - invDate) / (1000 * 60 * 60 * 24));
            if (diffDays >= days) {
                addNotification('invoice', 
                    settings.language === 'en' ? 'Invoice not sent' : 'فاتورة غير مرسلة',
                    `${inv.id} - ${inv.customerName}`,
                    inv.id
                );
            }
        });
    }
    
    // فحص الديون
    if (settings.notifyDebtReminder) {
        const debtInvoices = invoices.filter(inv => inv.remainingAmount > 0);
        const days = settings.notifyDebtReminderDays || 3;
        debtInvoices.forEach(inv => {
            const invDate = new Date(inv.date);
            const diffDays = Math.floor((now - invDate) / (1000 * 60 * 60 * 24));
            if (diffDays >= days) {
                addNotification('debt',
                    settings.language === 'en' ? 'Pending payment' : 'دفع معلق',
                    `${inv.customerName}: ${formatCurrency(inv.remainingAmount)}`,
                    inv.id
                );
            }
        });
    }
    
    // فحص الشحنات المتأخرة
    if (settings.notifyShipmentDelayed) {
        shipments.forEach(s => {
            const delay = getShipmentDelayDays(s.id);
            if (delay > 0) {
                addNotification('shipment',
                    settings.language === 'en' ? 'Shipment delayed' : 'شحنة متأخرة',
                    `${s.id} - تأخرت ${delay} يوم`,
                    s.id
                );
            }
        });
    }
}

// دالة مساعدة للحصول على أيام التأخير
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

// إضافة إشعار
function addNotification(type, title, message, refId) {
    notifications.unshift({
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 6),
        type: type,
        title: title,
        message: message,
        refId: refId,
        read: false,
        createdAt: new Date().toISOString()
    });
    
    if (notifications.length > 100) notifications.pop();
    saveNotifications();
    
    if (typeof updateNotificationBadge === 'function') updateNotificationBadge();
}

// تحديث شارة الإشعارات
function updateNotificationBadge() {
    const unreadCount = getUnreadNotificationsCount();
    const badge = document.getElementById('notificationBadgeCount');
    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

// تصدير نسخة احتياطية
function exportBackup() {
    const data = {
        version: APP_VERSION,
        exportDate: new Date().toISOString(),
        settings: settings,
        invoices: invoices,
        customers: customers,
        shipments: shipments,
        suppliers: suppliers,
        bundles: bundles,
        wishlist: wishlist,
        notes: notes
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lorven_backup_${new Date().toISOString().slice(0, 19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast(t('backupExported'));
}

// استيراد نسخة احتياطية
function importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.invoices) invoices = data.invoices;
            if (data.customers) customers = data.customers;
            if (data.shipments) shipments = data.shipments;
            if (data.suppliers) suppliers = data.suppliers;
            if (data.bundles) bundles = data.bundles;
            if (data.wishlist) wishlist = data.wishlist;
            if (data.notes) notes = data.notes;
            if (data.settings) Object.assign(settings, data.settings);
            
            saveInvoices();
            saveCustomers();
            saveShipments();
            saveSuppliers();
            saveBundles();
            saveWishlist();
            saveNotes();
            saveSettings();
            
            showToast(t('backupImported'));
            if (typeof switchPage === 'function') switchPage(currentPage);
        } catch (err) {
            showToast(t('error'));
        }
    };
    reader.readAsText(file);
}

// عرض صفحة الإشعارات
function renderNotificationsPage(container) {
    const lang = settings.language;
    const unreadCount = getUnreadNotificationsCount();
    
    let html = `
        <div style="margin-bottom: 12px;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
                <h3 style="font-size: 18px; font-weight: 700;">
                    <i class="fas fa-bell"></i> ${lang === 'en' ? 'Notifications' : 'الإشعارات'}
                    ${unreadCount > 0 ? `<span style="font-size: 12px; color: var(--orange);">(${unreadCount})</span>` : ''}
                </h3>
                ${unreadCount > 0 ? `
                    <button class="btn btn-outline" style="font-size: 11px;" onclick="markAllNotificationsRead()">
                        ${lang === 'en' ? 'Mark all read' : 'تحديد الكل كمقروء'}
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    if (notifications.length === 0) {
        html += `
            <div style="text-align: center; padding: 40px; color: var(--text-soft);">
                <i class="fas fa-bell-slash" style="font-size: 48px; margin-bottom: 12px; opacity: 0.3;"></i>
                <p>${lang === 'en' ? 'No notifications' : 'لا توجد إشعارات'}</p>
            </div>
        `;
    } else {
        const sorted = [...notifications].reverse();
        sorted.forEach(notif => {
            const icon = notif.type === 'invoice' ? 'fa-receipt' : 
                        notif.type === 'shipment' ? 'fa-box' : 
                        notif.type === 'debt' ? 'fa-money-bill' : 'fa-bell';
            
            html += `
                <div class="stat-card" style="margin-bottom: 8px; ${!notif.read ? 'background: var(--hover);' : ''}" 
                     onclick="openNotification('${notif.refId}', '${notif.type}')">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <i class="fas ${icon}" style="color: var(--accent-1);"></i>
                        <div style="flex: 1;">
                            <div style="font-weight: 600; font-size: 12px;">${escapeHTML(notif.title)}</div>
                            <div style="font-size: 10px; color: var(--text-soft);">${escapeHTML(notif.message)}</div>
                            <div style="font-size: 9px; color: var(--text-soft); margin-top: 4px;">${getTimeAgo(notif.createdAt)}</div>
                        </div>
                        ${!notif.read ? `<div style="width: 8px; height: 8px; border-radius: 50%; background: var(--orange);"></div>` : ''}
                    </div>
                </div>
            `;
        });
    }
    
    container.innerHTML = html;
}

function markAllNotificationsRead() {
    notifications.forEach(n => n.read = true);
    saveNotifications();
    if (typeof updateNotificationBadge === 'function') updateNotificationBadge();
    if (currentPage === 'notifications' && typeof renderNotificationsPage === 'function') {
        renderNotificationsPage(document.getElementById('mainContent'));
    }
}

function openNotification(refId, type) {
    const notif = notifications.find(n => n.refId === refId && n.type === type);
    if (notif) {
        notif.read = true;
        saveNotifications();
        if (typeof updateNotificationBadge === 'function') updateNotificationBadge();
    }
    
    if (type === 'invoice' && typeof viewInvoiceDetails === 'function') {
        viewInvoiceDetails(refId);
    } else if (type === 'shipment' && typeof viewShipmentDetails === 'function') {
        viewShipmentDetails(refId);
    } else if (type === 'debt' && typeof viewInvoiceDetails === 'function') {
        viewInvoiceDetails(refId);
    }
}

// دالة حفظ الملاحظات
function saveNotes() {
    localStorage.setItem('lorvenNotes', JSON.stringify(notes));
}

function loadNotes() {
    const stored = localStorage.getItem('lorvenNotes');
    notes = stored ? JSON.parse(stored) : [];
}

// دالة تحميل الإعدادات المفقودة
function loadSettings() {
    const stored = localStorage.getItem('lorvenSettings');
    if (stored) {
        try {
            const parsed = JSON.parse(stored);
            Object.assign(settings, parsed);
        } catch(e) {}
    }
}
function showConfirmModal(message, onConfirm) {
    const lang = settings.language;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 360px; text-align: center;">
            <div class="modal-header">
                <div class="modal-title">${lang === 'en' ? 'Confirm' : 'تأكيد'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: var(--orange); margin-bottom: 12px;"></i>
                <p style="font-size: 15px; font-weight: 600; margin-bottom: 20px;">${message}</p>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline" style="flex: 1; color: var(--red); border-color: var(--red);" onclick="this.closest('.modal').remove(); (${onConfirm.toString()})()">
                        ${lang === 'en' ? 'Delete' : 'حذف'}
                    </button>
                    <button class="btn btn-primary" style="flex: 1;" onclick="this.closest('.modal').remove()">
                        ${lang === 'en' ? 'Cancel' : 'إلغاء'}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}
function formatCurrency(amount) {
    const lang = settings.language || 'ar';
    const currency = lang === 'en' ? 'SAR' : 'ر.س';
    return amount + ' ' + currency;
}
async function pickContact() {
    try {
        if (!('contacts' in navigator)) {
            showToast(settings.language === 'en' ? 'Not supported on this device' : 'غير مدعوم في هذا الجهاز');
            return;
        }
        
        const props = ['name', 'tel'];
        const opts = { multiple: false };
        
        const contacts = await navigator.contacts.select(props, opts);
        
        if (contacts && contacts.length > 0) {
            const contact = contacts[0];
            const name = contact.name || '';
            let phone = '';
            
            if (contact.tel && contact.tel.length > 0) {
                phone = contact.tel[0];
            }
            
            // تنظيف الرقم
            phone = phone.replace(/[\s\-\(\)\+]/g, '');
            if (phone.startsWith('9660')) phone = phone.substring(4);
            else if (phone.startsWith('966')) phone = phone.substring(3);
            else if (phone.startsWith('0')) phone = phone.substring(1);
            else if (phone.startsWith('+')) phone = phone.substring(1);
            
            // تعبئة الحقول
            const nameInput = document.getElementById('invoiceCustomerName') || document.getElementById('customerName');
            const phoneInput = document.getElementById('invoiceCustomerPhone') || document.getElementById('customerPhone');
            
            if (nameInput && name) nameInput.value = name;
            if (phoneInput && phone) {
                phoneInput.value = phone;
                // استدعاء البحث التلقائي إذا موجود
                if (typeof autoDetectCustomer === 'function') autoDetectCustomer();
            }
            
            showToast(settings.language === 'en' ? 'Contact selected' : 'تم اختيار جهة الاتصال');
        }
    } catch (err) {
        console.log('Contact picker error:', err);
    }
}

function generateLoyaltyCode(customerName) {
    const name = customerName.replace(/\s/g, '').toUpperCase();
    const first = name.charAt(0) || 'L';
    const second = name.charAt(1) || 'V';
    const num1 = Math.floor(Math.random() * 10);
    const num2 = Math.floor(Math.random() * 10);
    return first + num1 + second + num2;
}

function createLoyaltyCode(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return null;
    
    const code = generateLoyaltyCode(customer.name);
    
    const newCode = {
        id: 'LOY-' + Date.now(),
        code: code,
        customerId: customerId,
        customerName: customer.name,
        tier: customer.tier || 'normal',
        discount: customer.tier === 'vip' ? 20 : customer.tier === 'gold' ? 15 : customer.tier === 'silver' ? 10 : 5,
        minOrder: customer.tier === 'vip' ? 200 : customer.tier === 'gold' ? 150 : customer.tier === 'silver' ? 120 : 100,
        maxUses: 5,
        usedCount: 0,
        pointsEarned: 0,
        totalPoints: customer.totalLoyaltyPoints || 0,
        usedBy: [],
        createdAt: new Date().toISOString(),
        expiresAt: (() => { const d = new Date(); d.setDate(d.getDate() + 60); return d.toISOString(); })(),
        active: true
    };
    
    loyaltyCodes.push(newCode);
    saveLoyaltyCodes();
    return newCode;
}

function useLoyaltyCode(code, newCustomerPhone) {
    const loyaltyCode = loyaltyCodes.find(c => c.code === code && c.active && new Date(c.expiresAt) > new Date() && c.usedCount < c.maxUses);
    if (!loyaltyCode) return null;
    
    // ما ينفع العميلة تستخدم كودها
    const owner = customers.find(c => c.id === loyaltyCode.customerId);
    if (owner && owner.phone === newCustomerPhone) return { error: 'self' };
    
    // ما ينفع نفس الرقم يستخدم الكود مرتين
    if (loyaltyCode.usedBy.includes(newCustomerPhone)) return { error: 'duplicate' };
    
    return loyaltyCode;
}

function applyLoyaltyCode(code, newCustomerPhone, orderTotal) {
    const result = useLoyaltyCode(code, newCustomerPhone);
    if (!result) return null;
    if (result.error) return result;
    
    const loyaltyCode = result;
    if (orderTotal < loyaltyCode.minOrder) return { error: 'min_order' };
    
    loyaltyCode.usedCount++;
    loyaltyCode.usedBy.push(newCustomerPhone);
    loyaltyCode.pointsEarned += loyaltyCode.discount;
    
    const customer = customers.find(c => c.id === loyaltyCode.customerId);
    if (customer) {
        customer.totalLoyaltyPoints = (customer.totalLoyaltyPoints || 0) + loyaltyCode.discount;
        customer.pendingLoyaltyPoints = (customer.pendingLoyaltyPoints || 0) + loyaltyCode.discount;
        saveCustomers();
    }
    
    if (loyaltyCode.usedCount >= loyaltyCode.maxUses) loyaltyCode.active = false;
    saveLoyaltyCodes();
    
    return {
        discount: loyaltyCode.discount,
        code: code,
        ownerName: loyaltyCode.customerName
    };
}

function redeemLoyaltyPoints(customerId) {
    const customer = customers.find(c => c.id === customerId);
    if (!customer || (customer.pendingLoyaltyPoints || 0) < 100) return null;
    
    const discount = 50;
    customer.pendingLoyaltyPoints -= 100;
    saveCustomers();
    
    return discount;
}

function saveLoyaltyCodes() {
    localStorage.setItem('lorvenLoyaltyCodes', JSON.stringify(loyaltyCodes));
}

function loadLoyaltyCodes() {
    const stored = localStorage.getItem('lorvenLoyaltyCodes');
    loyaltyCodes = stored ? JSON.parse(stored) : [];
}

// استدعاء أولي عند التحميل
console.log('✅ State Manager Loaded');
