// ==================== ui.js ====================
// واجهة المستخدم والتنقل - LORVEN SYS v3.0

const pages = {
    dashboard: { title: { ar: 'الرئيسية', en: 'Dashboard' }, showBack: false },
    customers: { title: { ar: 'العملاء', en: 'Customers' }, showBack: true },
    invoices: { title: { ar: 'فاتورة جديدة', en: 'New Invoice' }, showBack: true },
    shipments: { title: { ar: 'الشحنات', en: 'Shipments' }, showBack: true },
    suppliers: { title: { ar: 'المعارض', en: 'Suppliers' }, showBack: true },
    reports: { title: { ar: 'التقارير', en: 'Reports' }, showBack: true },
    loyalty: { title: { ar: 'الولاء', en: 'Loyalty' }, showBack: true },
    settings: { title: { ar: 'الإعدادات', en: 'Settings' }, showBack: true },
    bundles: { title: { ar: 'البوكسات', en: 'Boxes' }, showBack: true },
    more: { title: { ar: 'المزيد', en: 'More' }, showBack: true },
    notes: { title: { ar: 'الملاحظات', en: 'Notes' }, showBack: true },
    invoiceHistory: { title: { ar: 'سجل الفواتير', en: 'Invoice History' }, showBack: true },
    notifications: { title: { ar: 'الإشعارات', en: 'Notifications' }, showBack: true }
};

let isSwitching = false;

function switchPage(page) {
    if (isSwitching) return;
    if (!isAppInitialized && page !== 'dashboard') return;
    
    isSwitching = true;
    currentPage = page;
    
    updateHeader(page);
    renderPage(page);
    updateBottomNav(page);

    const main = document.getElementById('mainContent');
    if (main) main.scrollTop = 0;
    
    setTimeout(() => { isSwitching = false; }, 150);
}

function updateHeader(page) {
    const header = document.getElementById('dynamicHeader');
    if (!header) return;
    
    const lang = settings.language === 'en' ? 'en' : 'ar';
    const pageInfo = pages[page] || pages.dashboard;
    const titleText = pageInfo.title[lang] || pageInfo.title.ar;
    
    header.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 48px;">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                ${pageInfo.showBack ? `<button class="back-btn" onclick="goBack()"><i class="fas fa-chevron-right"></i></button>` : ''}
                <span class="page-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${titleText}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; padding-left: 50px;">
                ${page === 'dashboard' ? `
                    <div class="icon-btn" onclick="openGlobalSearch()">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="notification-badge" onclick="switchPage('notifications')">
                        <i class="fas fa-bell"></i>
                        <span class="badge-count" id="notificationBadgeCount" style="display: ${getUnreadNotificationsCount() > 0 ? 'flex' : 'none'};">
                            ${getUnreadNotificationsCount() > 99 ? '99+' : getUnreadNotificationsCount()}
                        </span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function updateBottomNav(page) {
    document.querySelectorAll('.nav-btn').forEach((btn) => {
        const btnPage = btn.getAttribute('data-page');
        btn.classList.toggle('active', btnPage === page);
    });
}

function goBack() {
    switchPage('dashboard');
}

function toggleMoreMenu() {
    switchPage('more');
}

function renderPage(page) {
    const container = document.getElementById('mainContent');
    if (!container) return;
    
    container.innerHTML = '';
    
    try {
        switch (page) {
            case 'dashboard':
                if (typeof renderDashboard === 'function') renderDashboard(container);
                break;
            case 'customers':
                if (typeof renderCustomersPage === 'function') renderCustomersPage(container);
                break;
            case 'invoices':
                if (typeof renderInvoicesPage === 'function') renderInvoicesPage(container);
                break;
            case 'shipments':
                if (typeof renderShipmentsPage === 'function') renderShipmentsPage(container);
                break;
            case 'debts':
    if (typeof renderDebtsPage === 'function') renderDebtsPage(container);
    break;
            case 'suppliers':
                if (typeof renderSuppliersPage === 'function') renderSuppliersPage(container);
                break;
            case 'reports':
                if (typeof renderReportsPage === 'function') renderReportsPage(container);
                break;
                case 'notes':
    if (typeof renderNotesPage === 'function') renderNotesPage(container);
    break;
    case 'invoiceHistory':
    if (typeof renderInvoiceHistory === 'function') renderInvoiceHistory(container);
    break;
            case 'settings':
                if (typeof renderSettingsPage === 'function') renderSettingsPage(container);
                break;
case 'bundles':
    if (typeof renderBundlesPage === 'function') renderBundlesPage(container);
    break;
    case 'loyalty':
    if (typeof renderLoyaltyPage === 'function') renderLoyaltyPage(container);
    break;
    case 'more':
    if (typeof renderMorePage === 'function') renderMorePage(container);
    break;
            case 'notifications':
                if (typeof renderNotificationsPage === 'function') renderNotificationsPage(container);
                break;
            default:
                container.innerHTML = '<div style="text-align: center; padding: 40px;">Page not found</div>';
        }
        
        if (typeof applySettings === 'function') {
            applySettings();
        }
        
    } catch (e) {
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: var(--red);">Error: ' + e.message + '</div>';
        console.error('Render error:', e);
    }
}

function applySettings() {
    if (settings.darkMode === 'dark') {
        document.documentElement.classList.add('dark-mode');
    } else if (settings.darkMode === 'light') {
        document.documentElement.classList.remove('dark-mode');
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.classList.toggle('dark-mode', prefersDark);
    }
    
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
    document.title = 'LORVEN SYS';
    
    updateNavLabels();
}

function updateNavLabels() {
    const lang = settings.language === 'en' ? 'en' : 'ar';
    const labels = {
        dashboard: { ar: 'الرئيسية', en: 'Home' },
        customers: { ar: 'العملاء', en: 'Customers' },
        invoices: { ar: 'الفواتير', en: 'Invoices' },
        reports: { ar: 'التقارير', en: 'Reports' },
        more: { ar: 'المزيد', en: 'More' }
    };
    
    document.querySelectorAll('.nav-btn[data-page]').forEach(btn => {
        const page = btn.getAttribute('data-page');
        const span = btn.querySelector('span');
        if (span && labels[page]) {
            span.textContent = labels[page][lang] || labels[page].ar;
        }
    });
}
function updateHeader(page) {
    const header = document.getElementById('dynamicHeader');
    if (!header) return;
    
    const lang = settings.language === 'en' ? 'en' : 'ar';
    const pageInfo = pages[page] || pages.dashboard;
    const titleText = pageInfo.title[lang] || pageInfo.title.ar;
    
    header.innerHTML = `
        <div style="display: flex; align-items: center; justify-content: space-between; width: 100%; height: 48px;">
            <div style="display: flex; align-items: center; gap: 8px; flex: 1; min-width: 0;">
                ${pageInfo.showBack ? `<button class="back-btn" onclick="goBack()"><i class="fas fa-chevron-right"></i></button>` : ''}
                <span class="page-title" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${titleText}</span>
            </div>
            <div style="display: flex; align-items: center; gap: 12px; flex-shrink: 0;">
                ${page === 'dashboard' ? `
                    <div class="icon-btn" onclick="openGlobalSearch()" title="${lang === 'en' ? 'Search' : 'بحث'}">
                        <i class="fas fa-search"></i>
                    </div>
                    <div class="notification-badge" onclick="switchPage('notifications')">
                        <i class="fas fa-bell"></i>
                        <span class="badge-count" id="notificationBadgeCount" style="display: ${getUnreadNotificationsCount() > 0 ? 'flex' : 'none'};">
                            ${getUnreadNotificationsCount() > 99 ? '99+' : getUnreadNotificationsCount()}
                        </span>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

function initBottomNav() {
    const nav = document.getElementById('bottomNav');
    if (!nav) return;
    
    const lang = settings.language === 'en' ? 'en' : 'ar';
    
    nav.innerHTML = `
        <button class="nav-btn active" data-page="dashboard" onclick="switchPage('dashboard')">
            <i class="fas fa-home"></i>
            <span>${lang === 'en' ? 'Home' : 'الرئيسية'}</span>
        </button>
        <button class="nav-btn" data-page="customers" onclick="switchPage('customers')">
            <i class="fas fa-users"></i>
            <span>${lang === 'en' ? 'Customers' : 'العملاء'}</span>
        </button>
        <button class="nav-btn" data-page="invoices" onclick="switchPage('invoices')">
            <i class="fas fa-receipt"></i>
            <span>${lang === 'en' ? 'Invoices' : 'الفواتير'}</span>
        </button>
        <button class="nav-btn" data-page="reports" onclick="switchPage('reports')">
            <i class="fas fa-chart-pie"></i>
            <span>${lang === 'en' ? 'Reports' : 'التقارير'}</span>
        </button>
        <button class="nav-btn" data-page="more" onclick="toggleMoreMenu()">
            <i class="fas fa-ellipsis-h"></i>
            <span>${lang === 'en' ? 'More' : 'المزيد'}</span>
        </button>
    `;
}

// سحب المودال للإغلاق
document.addEventListener('mousedown', function(e) {
    const modal = e.target.closest('.modal.bottom-sheet');
    if (!modal) return;
    
    const content = modal.querySelector('.bottom-sheet-content');
    if (!content || !content.contains(e.target)) return;
    
    const startY = e.clientY;
    let moved = false;
    
    function onMove(ev) {
        const dy = ev.clientY - startY;
        if (dy > 30) {
            content.style.transform = `translateY(${dy}px)`;
            content.style.transition = 'none';
            moved = true;
        }
    }
    
    function onUp(ev) {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        
        const dy = ev.clientY - startY;
        if (dy > 120) {
            modal.remove();
        } else {
            content.style.transform = '';
            content.style.transition = '0.3s ease';
        }
    }
    
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
});
document.addEventListener('touchstart', function(e) {
    const modal = e.target.closest('.modal.bottom-sheet');
    if (!modal) return;
    
    const content = modal.querySelector('.bottom-sheet-content');
    if (!content || !content.contains(e.target)) return;
    
    const startY = e.touches[0].clientY;
    
    function onMove(ev) {
        const dy = ev.touches[0].clientY - startY;
        if (dy > 30) {
            content.style.transform = `translateY(${dy}px)`;
            content.style.transition = 'none';
        }
    }
    
    function onEnd(ev) {
        document.removeEventListener('touchmove', onMove);
        document.removeEventListener('touchend', onEnd);
        
        const dy = ev.changedTouches[0].clientY - startY;
        if (dy > 120) {
            modal.remove();
        } else {
            content.style.transform = '';
            content.style.transition = '0.3s ease';
        }
    }
    
    document.addEventListener('touchmove', onMove);
    document.addEventListener('touchend', onEnd);
});
// ==================== ui.js (تحديثات) ====================

function openDarkModeModal() {
    const lang = settings.language === 'en' ? 'en' : 'ar';
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'darkModeSelectModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 300px;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-moon"></i> ${lang === 'en' ? 'Dark Mode' : 'الوضع الليلي'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn ${settings.darkMode === 'auto' ? 'selected' : ''}" onclick="selectDarkMode('auto')">
                    <i class="fas fa-check-circle"></i> <span>${lang === 'en' ? 'Auto' : 'تلقائي'}</span>
                </button>
                <button class="option-btn ${settings.darkMode === 'light' ? 'selected' : ''}" onclick="selectDarkMode('light')">
                    <i class="fas fa-check-circle"></i> <span>${lang === 'en' ? 'Light' : 'فاتح'}</span>
                </button>
                <button class="option-btn ${settings.darkMode === 'dark' ? 'selected' : ''}" onclick="selectDarkMode('dark')">
                    <i class="fas fa-check-circle"></i> <span>${lang === 'en' ? 'Dark' : 'داكن'}</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function selectDarkMode(value) {
    settings.darkMode = value;
    saveSettings();
    applySettings();
    document.getElementById('darkModeSelectModal')?.remove();
    showToast(t('settingsSaved'));
}

function openLanguageModal() {
    const lang = settings.language === 'en' ? 'en' : 'ar';
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'languageSelectModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 300px;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-globe"></i> ${lang === 'en' ? 'Language' : 'اللغة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn ${settings.language === 'ar' ? 'selected' : ''}" onclick="selectLanguage('ar')">
                    <i class="fas fa-check-circle"></i> <span>العربية</span>
                </button>
                <button class="option-btn ${settings.language === 'en' ? 'selected' : ''}" onclick="selectLanguage('en')">
                    <i class="fas fa-check-circle"></i> <span>English</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function selectLanguage(value) {
    settings.language = value;
    saveSettings();
    applySettings();
    document.getElementById('languageSelectModal')?.remove();
    switchPage(currentPage);
    showToast(value === 'en' ? '✅ Language changed to English' : '✅ تم تغيير اللغة إلى العربية');
}

function selectOption(btn, modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
    }
}

function saveDarkMode() {
    settings.darkMode = window._tempDarkMode || settings.darkMode;
    saveSettings();
    applySettings();
    document.getElementById('darkModeSelectModal')?.remove();
}

function openLanguageModal() {
    const lang = settings.language === 'en' ? 'en' : 'ar';
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'languageSelectModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-globe"></i> ${lang === 'en' ? 'Language' : 'اللغة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn ${settings.language === 'ar' ? 'selected' : ''}" onclick="selectOption(this, 'languageSelectModal'); window._tempLanguage='ar'">
                    <i class="fas fa-check-circle"></i> <span>العربية</span>
                </button>
                <button class="option-btn ${settings.language === 'en' ? 'selected' : ''}" onclick="selectOption(this, 'languageSelectModal'); window._tempLanguage='en'">
                    <i class="fas fa-check-circle"></i> <span>English</span>
                </button>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                    <button class="btn btn-outline" style="flex: 1;" onclick="this.closest('.modal').remove()">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                    <button class="btn btn-primary" style="flex: 1;" onclick="saveLanguage()">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function saveLanguage() {
    settings.language = window._tempLanguage || settings.language;
    saveSettings();
    applySettings();
    document.getElementById('languageSelectModal')?.remove();
    switchPage(currentPage);
}

function openAppLockModal() {
    const lang = settings.language === 'en' ? 'en' : 'ar';
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'appLockSelectModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-lock"></i> ${lang === 'en' ? 'App Lock' : 'قفل التطبيق'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn ${settings.appLock === 'off' ? 'selected' : ''}" onclick="selectAppLock('off')">
                    <i class="fas fa-check-circle"></i> <span>${lang === 'en' ? 'Off' : 'غير مفعل'}</span>
                </button>
                <button class="option-btn ${settings.appLock === 'on' ? 'selected' : ''}" onclick="selectAppLock('on')">
                    <i class="fas fa-check-circle"></i> <span>${lang === 'en' ? 'On' : 'مفعل'}</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function selectAppLock(value) {
    settings.appLock = value;
    const appLockText = document.getElementById('appLockText');
    if (appLockText) {
        appLockText.textContent = value === 'on' ? (settings.language === 'en' ? 'On' : 'مفعل') : (settings.language === 'en' ? 'Off' : 'غير مفعل');
    }
    const securityFields = document.getElementById('securityFields');
    if (securityFields) {
        securityFields.style.display = value === 'on' ? 'block' : 'none';
    }
    updateOptionSelection('appLockSelectModal', value === 'on' ? 1 : 0);
    document.getElementById('appLockSelectModal')?.remove();
}

function updateOptionSelection(modalId, index) {
    const modal = document.getElementById(modalId);
    if (modal) {
        const buttons = modal.querySelectorAll('.option-btn');
        buttons.forEach((b, i) => b.classList.toggle('selected', i === index));
    }
}

function openLockMethodModal() {
    const lang = settings.language === 'en' ? 'en' : 'ar';
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'lockMethodSelectModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-key"></i> ${lang === 'en' ? 'Lock Method' : 'طريقة القفل'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn ${settings.lockMethod === 'pin' ? 'selected' : ''}" onclick="selectLockMethod('pin')">
                    <i class="fas fa-check-circle"></i> <span>${lang === 'en' ? 'PIN Code' : 'رمز PIN'}</span>
                </button>
                <button class="option-btn ${settings.lockMethod === 'password' ? 'selected' : ''}" onclick="selectLockMethod('password')">
                    <i class="fas fa-check-circle"></i> <span>${lang === 'en' ? 'Password' : 'كلمة مرور'}</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function selectLockMethod(value) {
    settings.lockMethod = value;
    const lockMethodText = document.getElementById('lockMethodText');
    if (lockMethodText) {
        lockMethodText.textContent = value === 'pin' ? (settings.language === 'en' ? 'PIN Code' : 'رمز PIN') : (settings.language === 'en' ? 'Password' : 'كلمة مرور');
    }
    const pinField = document.getElementById('pinField');
    const passwordField = document.getElementById('passwordField');
    if (pinField) pinField.style.display = value === 'pin' ? 'block' : 'none';
    if (passwordField) passwordField.style.display = value === 'password' ? 'block' : 'none';
    document.getElementById('lockMethodSelectModal')?.remove();
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        document.querySelectorAll('.modal').forEach(m => {
            if (m.id !== id) m.style.display = 'none';
        });
        modal.style.display = 'flex';
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transition = '0.2s';
        setTimeout(() => {
            modal.style.display = 'none';
            if (modal.parentNode) modal.remove();
        }, 200);
    }
}

window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    initBottomNav();
    
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function() {
        if (settings.darkMode === 'auto') {
            applySettings();
        }
    });
});

function openPolicyPage(type) {
    const fileName = type === 'privacy' ? 'privacy.html' : 'terms.html';
    window.location.href = fileName;
}
function performGlobalSearch(query) {
    const lang = settings.language;
    const container = document.getElementById('globalSearchResults');
    if (!container) return;
    
    if (!query || query.trim().length < 1) {
        container.innerHTML = '';
        return;
    }
    
    const q = query.trim().toLowerCase();
    let html = '';
    let totalResults = 0;
    
    // العملاء
    const matchedCustomers = customers.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) ||
        (c.phone && c.phone.includes(q)) ||
        (c.id && c.id.toLowerCase().includes(q))
    ).slice(0, 3);
    
    if (matchedCustomers.length > 0) {
        totalResults += matchedCustomers.length;
        html += `<div style="font-size: 11px; color: var(--text-soft); padding: 8px 14px; font-weight: 600;"><i class="fas fa-users"></i> ${lang === 'en' ? 'Customers' : 'العملاء'}</div>`;
        matchedCustomers.forEach(c => {
            html += `<div class="search-result-item" onclick="document.getElementById('globalSearchModal').remove(); viewCustomer('${c.id}')"><div style="display: flex; align-items: center; gap: 8px;"><div style="width: 8px; height: 8px; border-radius: 50%; background: ${getCustomerTierColor(c.tier || 'normal')};"></div><div style="flex: 1;"><div style="font-weight: 600; font-size: 12px;">${escapeHTML(c.name)}</div><div style="font-size: 10px; color: var(--text-soft);">${c.phone} · ${c.id}</div></div></div></div>`;
        });
    }
    
    // الفواتير
    const matchedInvoices = invoices.filter(inv => 
        (inv.id && inv.id.toLowerCase().includes(q)) ||
        (inv.customerName && inv.customerName.toLowerCase().includes(q)) ||
        (inv.customerPhone && inv.customerPhone.includes(q))
    ).slice(0, 5);
    
    if (matchedInvoices.length > 0) {
        totalResults += matchedInvoices.length;
        html += `<div style="font-size: 11px; color: var(--text-soft); padding: 8px 14px; font-weight: 600;"><i class="fas fa-receipt"></i> ${lang === 'en' ? 'Invoices' : 'الفواتير'}</div>`;
        matchedInvoices.forEach(inv => {
            html += `<div class="search-result-item" onclick="document.getElementById('globalSearchModal').remove(); viewInvoiceDetails('${inv.id}')"><div style="display: flex; justify-content: space-between; align-items: center;"><div><span style="font-weight: 600; font-size: 12px;">${inv.id}</span><span style="font-size: 10px; color: var(--text-soft); margin-right: 6px;">${escapeHTML(inv.customerName || '')}</span></div><span style="font-weight: 700; font-size: 12px;">${formatCurrency(inv.total)}</span></div></div>`;
        });
    }
    
    // الشحنات
    const matchedShipments = shipments.filter(s => s.id && s.id.toLowerCase().includes(q)).slice(0, 3);
    
    if (matchedShipments.length > 0) {
        totalResults += matchedShipments.length;
        html += `<div style="font-size: 11px; color: var(--text-soft); padding: 8px 14px; font-weight: 600;"><i class="fas fa-truck"></i> ${lang === 'en' ? 'Shipments' : 'الشحنات'}</div>`;
        matchedShipments.forEach(s => {
            html += `<div class="search-result-item" onclick="document.getElementById('globalSearchModal').remove(); viewShipment('${s.id}')"><div style="font-weight: 600; font-size: 12px;">${s.id}</div><div style="font-size: 10px; color: var(--text-soft);">${s.itemCount || 0} ${lang === 'en' ? 'items' : 'منتج'} · ${s.supplierName || ''}</div></div>`;
        });
    }
    
// الملاحظات
if (typeof notes !== 'undefined' && notes.length > 0) {
    const matchedNotes = notes.filter(n => 
        (n.title && n.title.toLowerCase().includes(q)) ||
        (n.content && n.content.toLowerCase().includes(q))
    ).slice(0, 3);
    
    if (matchedNotes.length > 0) {
        totalResults += matchedNotes.length;
        html += `<div style="font-size: 11px; color: var(--text-soft); padding: 8px 14px; font-weight: 600;">
            <i class="fas fa-sticky-note"></i> ${lang === 'en' ? 'Notes' : 'الملاحظات'}
        </div>`;
        matchedNotes.forEach(n => {
            html += `
                <div class="search-result-item" onclick="document.getElementById('globalSearchModal').remove(); switchPage('notes')">
                    <div style="font-weight: 600; font-size: 12px;">${escapeHTML(n.title)}</div>
                    <div style="font-size: 10px; color: var(--text-soft);">${escapeHTML((n.content || '').substring(0, 60))}...</div>
                </div>
            `;
        });
    }
}    
    if (totalResults === 0) {
        html = `<div style="text-align: center; padding: 32px; color: var(--text-soft);">${lang === 'en' ? 'No results found' : 'لا توجد نتائج'}</div>`;
    }
    
    container.innerHTML = html;
}

function openGlobalSearch() {
    const lang = settings.language === 'en' ? 'en' : 'ar';
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'globalSearchModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 400px;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-search"></i> ${lang === 'en' ? 'Search' : 'بحث'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body" style="padding: 0;">
                <div style="padding: 12px;">
                    <input type="text" class="form-control" id="globalSearchInput" 
                           placeholder="${lang === 'en' ? 'Search everything...' : 'ابحث في كل شيء...'}" 
                           autocomplete="off" oninput="performGlobalSearch(this.value)">
                </div>
                <div id="globalSearchResults" style="max-height: 400px; overflow-y: auto;"></div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    setTimeout(() => document.getElementById('globalSearchInput')?.focus(), 300);
}

function showCheckmark(message, callback) {
    // إنشاء overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.2s ease;
    `;
    
    overlay.innerHTML = `
        <div style="
            background: var(--card-bg);
            border-radius: 24px;
            padding: 30px 40px;
            text-align: center;
            animation: scaleIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        ">
            <div style="
                width: 70px; height: 70px;
                background: var(--green);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin: 0 auto 15px;
                animation: bounceCheck 0.5s ease;
            ">
                <i class="fas fa-check" style="color: #fff; font-size: 32px; animation: drawCheck 0.3s ease 0.2s both;"></i>
            </div>
            <p style="font-size: 16px; font-weight: 600; margin: 0; color: var(--text);">${message || 'تم الحفظ ✓'}</p>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    // إضافة الأنميشن CSS
    if (!document.getElementById('checkmarkStyles')) {
        const style = document.createElement('style');
        style.id = 'checkmarkStyles';
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes scaleIn {
                from { transform: scale(0.5); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes bounceCheck {
                0% { transform: scale(0); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // إخفاء بعد 1.5 ثانية
    setTimeout(() => {
        overlay.style.animation = 'fadeOut 0.2s ease forwards';
        setTimeout(() => overlay.remove(), 200);
        if (callback) callback();
    }, 1500);
}