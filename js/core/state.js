// ==================== تعريف المتغيرات العامة (Global Variables) ====================
var APP_VERSION = "1.3.0";
var isAppInitialized = false;
var currentPage = 'dashboard';
var loyaltyCodes = [];
var soundEnabled = true;

var settings = {
    language: 'ar',
    darkMode: 'auto',
    lastBackupDate: null,
    currency: 'ر.س',
    countryCode: '967',
    codeBehavior: 'prepend',
    biometricEnabled: false,
    biometricId: '',
    whatsappTemplate: `✦ لــــورفــــن ✦
──────────────────

  فاتورتك جاهزة يا {firstName} ✨

  ⟡ رقم الطلب: #{orderId}
  ⟡ الشحنة: {shipmentId}
  ⟡ التاريخ: {formattedDate}

──────────────────

  ⟡ منتجاتك:

  {items}

──────────────────

  ⟡ التوصيل: {delivery}
  ⟡ الخصم: {discount}
  
  ⟡ الدفع: {paymentStatus}
  
  ⟡ الإجمالي: {total}

──────────────────

  ممتنين لاختيارك لورفن ليكون جزء من جمالك .. 🤍`
};

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

async function initApp() {
    if (isAppInitialized) return;
    console.log('⏳ Initializing LORVEN SYS...');
    await initDatabase();
    loadData();
    console.log('اللغة بعد التحميل:', settings.language);
    applyLanguage();
    applyTheme();
    isAppInitialized = true;
    console.log('✅ LORVEN SYS v' + APP_VERSION + ' initialized');
}

function applyLanguage() {
    let lang = settings.language || 'ar';
    if (lang === 'auto') lang = navigator.language.startsWith('ar') ? 'ar' : 'en';
    document.documentElement.lang = lang;
    document.documentElement.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (window.i18n && window.i18n[lang] && window.i18n[lang][key]) {
            el.textContent = window.i18n[lang][key];
        }
    });
}

function applyTheme() {
    let theme = settings.darkMode || 'light';
    if (theme === 'auto') theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.body.classList.toggle('dark-mode', theme === 'dark');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('✅ ' + text + ' ' + (settings.language === 'en' ? 'Copied' : 'تم النسخ'));
    }).catch(() => {
        showToast(settings.language === 'en' ? 'Failed' : 'فشل النسخ', 'error');
    });
}

function showToast(message, type = 'info') {
    const existing = document.querySelector('.toast-message');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'toast-message toast-' + type;
    toast.textContent = message;
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:' + (type === 'error' ? '#e74c3c' : '#2c3e50') + ';color:white;padding:12px 24px;border-radius:50px;z-index:10000;box-shadow:0 4px 15px rgba(0,0,0,0.2);font-size:14px;transition:opacity 0.3s';
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 2500);
}

function switchPage(page) {
    currentPage = page;
    const container = document.getElementById('mainContent');
    if (!container) return;
    container.innerHTML = '';
    const renderers = {
        'dashboard': typeof renderDashboard === 'function' ? renderDashboard : null,
        'customers': typeof renderCustomersPage === 'function' ? renderCustomersPage : null,
        'invoices': typeof renderInvoicesPage === 'function' ? renderInvoicesPage : null,
        'debts': typeof renderDebtsPage === 'function' ? renderDebtsPage : null
    };
    if (renderers[page]) { renderers[page](container); }
    else { container.innerHTML = '<div style="padding:20px;text-align:center;">' + page + ' - قريباً</div>'; }
    document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.dataset.page === page));
}

function getUnreadNotificationsCount() { return notifications.filter(n => !n.read).length; }

function checkAppLock() {
    if (typeof switchPage === 'function') switchPage('dashboard');
}

function checkAutoNotifications() {
    const now = new Date();
    if (settings.notifyInvoiceNotSent) {
        const unsent = invoices.filter(inv => !inv.whatsappSent);
        const days = settings.notifyInvoiceNotSentDays || 1;
        unsent.forEach(inv => {
            if (Math.floor((now - new Date(inv.date)) / 86400000) >= days) {
                addNotification('invoice', settings.language === 'en' ? 'Invoice not sent' : 'فاتورة غير مرسلة', inv.id + ' - ' + inv.customerName, inv.id);
            }
        });
    }
    if (settings.notifyDebtReminder) {
        const debts = invoices.filter(inv => inv.remainingAmount > 0);
        const days = settings.notifyDebtReminderDays || 3;
        debts.forEach(inv => {
            if (Math.floor((now - new Date(inv.date)) / 86400000) >= days) {
                addNotification('debt', settings.language === 'en' ? 'Pending payment' : 'دفع معلق', inv.customerName + ': ' + formatCurrency(inv.remainingAmount), inv.id);
            }
        });
    }
    if (settings.notifyShipmentDelayed) {
        shipments.forEach(s => {
            const delay = getShipmentDelayDays(s.id);
            if (delay > 0) addNotification('shipment', settings.language === 'en' ? 'Shipment delayed' : 'شحنة متأخرة', s.id + ' - تأخرت ' + delay + ' يوم', s.id);
        });
    }
}

function getShipmentDelayDays(shipmentId) {
    const s = shipments.find(x => x.id === shipmentId);
    if (!s || !s.expectedArrival || s.status === 'delivered') return 0;
    const d = (new Date() - new Date(s.expectedArrival)) / 86400000;
    return d > 0 ? Math.ceil(d) : 0;
}

function addNotification(type, title, message, refId) {
    notifications.unshift({
        id: Date.now() + '-' + Math.random().toString(36).substr(2, 6),
        type: type, title: title, message: message, refId: refId,
        read: false, createdAt: new Date().toISOString()
    });
    if (notifications.length > 100) notifications.pop();
    saveNotifications();
    if (typeof updateNotificationBadge === 'function') updateNotificationBadge();
    playSound('notification');
    
    fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title, body: message, token: settings.fcmToken || '' })
    }).catch(function() {});
}

function updateNotificationBadge() {
    const count = getUnreadNotificationsCount();
    const badge = document.getElementById('notificationBadgeCount');
    if (badge) {
        if (count > 0) { badge.textContent = count > 99 ? '99+' : count; badge.style.display = 'flex'; }
        else { badge.style.display = 'none'; }
    }
}

function exportBackup() {
    const data = { version: APP_VERSION, exportDate: new Date().toISOString(), settings, invoices, customers, shipments, suppliers, bundles, wishlist, notes, notifications, loyaltyCodes };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'lorven_backup_' + new Date().toISOString().slice(0,10) + '.json'; a.click();
}

function importBackup(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            if (data.settings) settings = data.settings;
            if (data.invoices) invoices = data.invoices;
            if (data.customers) customers = data.customers;
            if (data.shipments) shipments = data.shipments;
            if (data.suppliers) suppliers = data.suppliers;
            if (data.bundles) bundles = data.bundles;
            if (data.wishlist) wishlist = data.wishlist;
            if (data.notes) notes = data.notes;
            if (data.notifications) notifications = data.notifications;
            if (data.loyaltyCodes) loyaltyCodes = data.loyaltyCodes;
            saveAllData();
            showToast(settings.language === 'en' ? 'Backup imported' : 'تم استيراد النسخة');
            switchPage('dashboard');
        } catch (err) { showToast(settings.language === 'en' ? 'Error' : 'خطأ', 'error'); }
    };
    reader.readAsText(file);
}

function renderNotificationsPage(container) {
    const lang = settings.language;
    const unread = getUnreadNotificationsCount();
    let html = '<div style="margin-bottom:12px;"><div style="display:flex;align-items:center;justify-content:space-between;"><h3><i class="fas fa-bell"></i> ' + (lang === 'en' ? 'Notifications' : 'الإشعارات') + (unread > 0 ? ' <span style="color:var(--orange);">(' + unread + ')</span>' : '') + '</h3>' + (unread > 0 ? '<button class="btn btn-outline" onclick="markAllNotificationsRead()">' + (lang === 'en' ? 'Mark all read' : 'تحديد الكل كمقروء') + '</button>' : '') + '</div></div>';
    if (notifications.length === 0) {
        html += '<div style="text-align:center;padding:40px;color:var(--text-soft);"><i class="fas fa-bell-slash" style="font-size:48px;opacity:0.3;margin-bottom:12px;"></i><p>' + (lang === 'en' ? 'No notifications' : 'لا توجد إشعارات') + '</p></div>';
    } else {
        [...notifications].reverse().forEach(n => {
            html += '<div class="stat-card" style="margin-bottom:8px;cursor:pointer;" onclick="openNotification(\'' + n.refId + '\',\'' + n.type + '\')"><div style="display:flex;gap:10px;align-items:center;"><i class="fas fa-' + (n.type === 'invoice' ? 'receipt' : n.type === 'shipment' ? 'box' : n.type === 'debt' ? 'money-bill' : 'bell') + '"></i><div style="flex:1;"><div style="font-weight:600;">' + escapeHTML(n.title) + '</div><div style="font-size:10px;color:var(--text-soft);">' + escapeHTML(n.message) + '</div></div>' + (!n.read ? '<div style="width:8px;height:8px;border-radius:50%;background:var(--orange);"></div>' : '') + '</div></div>';
        });
    }
    container.innerHTML = html;
}

function markAllNotificationsRead() { notifications.forEach(n => n.read = true); saveNotifications(); updateNotificationBadge(); }
function openNotification(refId, type) {
    const n = notifications.find(x => x.refId === refId && x.type === type);
    if (n) { n.read = true; saveNotifications(); updateNotificationBadge(); }
    if (type === 'invoice' && typeof viewInvoiceDetails === 'function') viewInvoiceDetails(refId);
    else if (type === 'shipment' && typeof viewShipmentDetails === 'function') viewShipmentDetails(refId);
    else if (type === 'debt' && typeof viewInvoiceDetails === 'function') viewInvoiceDetails(refId);
}

function showConfirmModal(message, onConfirm) {
    const modal = document.createElement('div'); modal.className = 'modal bottom-sheet'; modal.style.display = 'flex';
    modal.innerHTML = '<div class="modal-content bottom-sheet-content" style="max-width:360px;text-align:center;"><div class="modal-header"><div class="modal-title">' + (settings.language === 'en' ? 'Confirm' : 'تأكيد') + '</div><div class="modal-close" onclick="this.closest(\'.modal\').remove()">&times;</div></div><div class="modal-body"><i class="fas fa-exclamation-triangle" style="font-size:40px;color:var(--orange);margin-bottom:12px;"></i><p>' + message + '</p><div style="display:flex;gap:8px;"><button class="btn btn-outline" style="flex:1;color:var(--red);border-color:var(--red);" onclick="this.closest(\'.modal\').remove();(' + onConfirm.toString() + ')()">' + (settings.language === 'en' ? 'Delete' : 'حذف') + '</button><button class="btn btn-primary" style="flex:1;" onclick="this.closest(\'.modal\').remove()">' + (settings.language === 'en' ? 'Cancel' : 'إلغاء') + '</button></div></div></div>';
    document.body.appendChild(modal);
}

function formatCurrency(amount) { return amount + ' ' + (settings.language === 'en' ? 'SAR' : 'ر.س'); }

async function pickContact() {
    if (!('contacts' in navigator)) { showToast(settings.language === 'en' ? 'Not supported' : 'غير مدعوم'); return; }
    try {
        const contacts = await navigator.contacts.select(['name', 'tel'], { multiple: false });
        if (contacts && contacts.length > 0) {
            let phone = (contacts[0].tel || [''])[0].replace(/[\s\-\(\)\+]/g, '');
            if (phone.startsWith('9660')) phone = phone.substring(4);
            else if (phone.startsWith('966')) phone = phone.substring(3);
            else if (phone.startsWith('0')) phone = phone.substring(1);
            const nameInput = document.getElementById('invoiceCustomerName') || document.getElementById('customerName');
            const phoneInput = document.getElementById('invoiceCustomerPhone') || document.getElementById('customerPhone');
            if (nameInput) nameInput.value = contacts[0].name || '';
            if (phoneInput) { phoneInput.value = phone; if (typeof autoDetectCustomer === 'function') autoDetectCustomer(); }
            showToast(settings.language === 'en' ? 'Contact selected' : 'تم اختيار جهة الاتصال');
        }
    } catch (err) {}
}

function generateLoyaltyCode(cn) { const n = cn.replace(/\s/g, '').toUpperCase(); return (n[0]||'L') + Math.floor(Math.random()*10) + (n[1]||'V') + Math.floor(Math.random()*10); }

function createLoyaltyCode(cid) {
    const c = customers.find(x => x.id === cid); if (!c) return null;
    const code = { id: 'LOY-' + Date.now(), code: generateLoyaltyCode(c.name), customerId: cid, customerName: c.name, tier: c.tier || 'normal', discount: c.tier === 'vip' ? 20 : c.tier === 'gold' ? 15 : c.tier === 'silver' ? 10 : 5, minOrder: c.tier === 'vip' ? 200 : c.tier === 'gold' ? 150 : c.tier === 'silver' ? 120 : 100, maxUses: 5, usedCount: 0, pointsEarned: 0, totalPoints: c.totalLoyaltyPoints || 0, usedBy: [], createdAt: new Date().toISOString(), expiresAt: (() => { const d = new Date(); d.setDate(d.getDate() + 60); return d.toISOString(); })(), active: true };
    loyaltyCodes.push(code); saveLoyaltyCodes(); return code;
}

function useLoyaltyCode(code, phone) {
    const lc = loyaltyCodes.find(c => c.code === code && c.active && new Date(c.expiresAt) > new Date() && c.usedCount < c.maxUses);
    if (!lc) return null;
    if (customers.find(c => c.id === lc.customerId)?.phone === phone) return { error: 'self' };
    if (lc.usedBy.includes(phone)) return { error: 'duplicate' };
    return lc;
}

function applyLoyaltyCode(code, phone, orderTotal) {
    const r = useLoyaltyCode(code, phone); if (!r) return null; if (r.error) return r;
    if (orderTotal < r.minOrder) return { error: 'min_order' };
    r.usedCount++; r.usedBy.push(phone); r.pointsEarned += r.discount;
    const c = customers.find(x => x.id === r.customerId);
    if (c) { c.totalLoyaltyPoints = (c.totalLoyaltyPoints || 0) + r.discount; c.pendingLoyaltyPoints = (c.pendingLoyaltyPoints || 0) + r.discount; saveCustomers(); }
    if (r.usedCount >= r.maxUses) r.active = false;
    saveLoyaltyCodes();
    return { discount: r.discount, code: code, ownerName: r.customerName };
}

function redeemLoyaltyPoints(cid) {
    const c = customers.find(x => x.id === cid);
    if (!c || (c.pendingLoyaltyPoints || 0) < 100) return null;
    c.pendingLoyaltyPoints -= 100; saveCustomers(); return 50;
}

function getCurrentYear() { return new Date().getFullYear(); }

var lockTimer = null;
function resetLockTimer() {
    if (settings.appLock !== 'on') return;
    if (lockTimer) clearTimeout(lockTimer);
    lockTimer = setTimeout(() => { if (typeof showLockScreen === 'function') showLockScreen(); }, 600000);
}
document.addEventListener('click', resetLockTimer);
document.addEventListener('keypress', resetLockTimer);
document.addEventListener('scroll', resetLockTimer);

console.log('✅ State Manager Loaded');
