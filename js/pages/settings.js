// ==================== settings.js ====================
// صفحة الإعدادات - LORVEN SYS v3.0

function renderSettingsPage(container) {
    const lang = settings.language;
    
    let html = `
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">
            <i class="fas fa-cog"></i> ${lang === 'en' ? 'Settings' : 'الإعدادات'}
        </h3>
        <p style="color: var(--text-soft); font-size: 11px; margin-bottom: 12px;">
            ${lang === 'en' ? 'Customize the app as you like' : 'خصص التطبيق حسب رغبتك'}
        </p>
        
        <div class="settings-list">
            <div class="stat-card" style="margin-bottom: 6px; cursor: pointer;" onclick="openGeneralSettings()">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 38px; height: 38px; background: var(--text); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--bg);"><i class="fas fa-sliders-h"></i></div>
                    <div style="flex: 1;"><div style="font-weight: 700; font-size: 13px;">${lang === 'en' ? 'General' : 'الإعدادات العامة'}</div><div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Dark mode, Language' : 'الوضع الليلي، اللغة'}</div></div>
                    <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                </div>
            </div>
            
            <div class="stat-card" style="margin-bottom: 6px; cursor: pointer;" onclick="openShipmentSettings()">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 38px; height: 38px; background: var(--text); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--bg);"><i class="fas fa-box"></i></div>
                    <div style="flex: 1;"><div style="font-weight: 700; font-size: 13px;">${lang === 'en' ? 'Shipments' : 'الشحنات'}</div><div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Limits, Duration, Alerts' : 'الحد الأقصى، المدة، التنبيهات'}</div></div>
                    <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                </div>
            </div>
            
            <div class="stat-card" style="margin-bottom: 6px; cursor: pointer;" onclick="openCustomerSettings()">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 38px; height: 38px; background: var(--text); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--bg);"><i class="fas fa-users"></i></div>
                    <div style="flex: 1;"><div style="font-weight: 700; font-size: 13px;">${lang === 'en' ? 'Customers' : 'العملاء'}</div><div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Tiers, Colors' : 'التصنيفات، الألوان'}</div></div>
                    <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                </div>
            </div>
            
            <div class="stat-card" style="margin-bottom: 6px; cursor: pointer;" onclick="openPaymentSettings()">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 38px; height: 38px; background: var(--text); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--bg);"><i class="fas fa-money-bill"></i></div>
                    <div style="flex: 1;"><div style="font-weight: 700; font-size: 13px;">${lang === 'en' ? 'Payments' : 'المدفوعات'}</div><div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Currency, Down Payment' : 'العملة، العربون'}</div></div>
                    <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                </div>
            </div>
            
            <div class="stat-card" style="margin-bottom: 6px; cursor: pointer;" onclick="openNotificationSettings()">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 38px; height: 38px; background: var(--text); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--bg);"><i class="fas fa-bell"></i></div>
                    <div style="flex: 1;"><div style="font-weight: 700; font-size: 13px;">${lang === 'en' ? 'Notifications' : 'الإشعارات'}</div><div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Reminders, Alerts' : 'تذكيرات، تنبيهات'}</div></div>
                    <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                </div>
            </div>
            
            <div class="stat-card" style="margin-bottom: 6px; cursor: pointer;" onclick="openCommunicationSettings()">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 38px; height: 38px; background: var(--text); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--bg);"><i class="fas fa-globe"></i></div>
                    <div style="flex: 1;"><div style="font-weight: 700; font-size: 13px;">${lang === 'en' ? 'Communication' : 'التواصل'}</div><div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Country Code, WhatsApp' : 'رمز الدولة، واتساب'}</div></div>
                    <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                </div>
            </div>
            
            <div style="border-top: 1px solid var(--border); margin: 8px 0;"></div>
            
            <div class="stat-card" style="margin-bottom: 6px; cursor: pointer;" onclick="openBackupModal()">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 38px; height: 38px; background: var(--text); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--bg);"><i class="fas fa-cloud-upload-alt"></i></div>
                    <div style="flex: 1;"><div style="font-weight: 700; font-size: 13px;">${lang === 'en' ? 'Backup' : 'النسخ الاحتياطي'}</div><div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Export, Import' : 'تصدير، استيراد'}</div></div>
                    <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                </div>
            </div>
            
            <div style="border-top: 1px solid var(--border); margin: 8px 0;"></div>
            
            <div class="stat-card" style="margin-bottom: 6px; cursor: pointer;" onclick="openSecuritySettings()">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 38px; height: 38px; background: var(--text); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--bg);"><i class="fas fa-shield-alt"></i></div>
                    <div style="flex: 1;"><div style="font-weight: 700; font-size: 13px;">${lang === 'en' ? 'Security' : 'الأمان'}</div><div style="font-size: 10px; color: var(--text-soft);">PIN, ${lang === 'en' ? 'Password' : 'كلمة مرور'}</div></div>
                    <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                </div>
            </div>
            
            <div style="border-top: 1px solid var(--border); margin: 8px 0;"></div>
            
            <div class="stat-card" style="margin-bottom: 6px; cursor: pointer;" onclick="openClearDataModal()">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 38px; height: 38px; background: rgba(199, 91, 91, 0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: var(--red);"><i class="fas fa-trash-alt"></i></div>
                    <div style="flex: 1;"><div style="font-weight: 700; font-size: 13px; color: var(--red);">${lang === 'en' ? 'Clear Data' : 'مسح البيانات'}</div><div style="font-size: 10px; color: var(--text-soft);">${lang === 'en' ? 'Delete everything' : 'حذف كل شيء'}</div></div>
                    <i class="fas fa-chevron-right" style="color: var(--text-soft);"></i>
                </div>
            </div>
        </div>
        
        <!-- دوائر صغيرة: تسجيل الخروج + السياسة + الشروط -->
        <div style="display: flex; justify-content: center; gap: 24px; margin-top: 20px;">
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;" onclick="logoutApp()">
                <div style="width: 40px; height: 40px; background: rgba(199, 91, 91, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--red); font-size: 16px;"><i class="fas fa-sign-out-alt"></i></div>
                <span style="font-size: 9px; color: var(--red);">${lang === 'en' ? 'Logout' : 'خروج'}</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;" onclick="openPolicyPage('privacy')">
                <div style="width: 40px; height: 40px; background: var(--text); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--bg); font-size: 16px;"><i class="fas fa-lock"></i></div>
                <span style="font-size: 9px; color: var(--text-soft);">${lang === 'en' ? 'Privacy' : 'الخصوصية'}</span>
            </div>
            <div style="display: flex; flex-direction: column; align-items: center; gap: 4px; cursor: pointer;" onclick="openPolicyPage('terms')">
                <div style="width: 40px; height: 40px; background: var(--text); border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--bg); font-size: 16px;"><i class="fas fa-file-contract"></i></div>
                <span style="font-size: 9px; color: var(--text-soft);">${lang === 'en' ? 'Terms' : 'الشروط'}</span>
            </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding: 0 4px;">
            <div style="display: flex; align-items: center; gap: 8px; cursor: pointer;" onclick="toggleSound()">
                <i class="fas ${soundEnabled ? 'fa-volume-up' : 'fa-volume-mute'}" id="settingsSoundIcon"></i>
                <span style="font-size: 11px;" id="settingsSoundLabel">${soundEnabled ? (lang === 'en' ? 'Sound On' : 'مفعل') : (lang === 'en' ? 'Mute' : 'صامت')}</span>
            </div>
            <span style="font-size: 10px; color: var(--text-soft);">v${APP_VERSION}</span>
        </div>
        <div style="height: 90px;"></div>
    `;
    container.innerHTML = html;
}

// ==================== مودال الإعدادات العامة ====================
function openGeneralSettings() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-sliders-h"></i> ${lang === 'en' ? 'General Settings' : 'الإعدادات العامة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn" onclick="openLanguageSubModal()">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Language' : 'اللغة'}</span>
                    <span style="color: var(--text-soft); font-size: 12px;">${settings.language === 'ar' ? 'العربية' : 'English'}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
                <button class="option-btn" onclick="openDarkModeSubModal()">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Dark Mode' : 'الوضع الليلي'}</span>
                    <span style="color: var(--text-soft); font-size: 12px;">${settings.darkMode === 'auto' ? (lang === 'en' ? 'Auto' : 'تلقائي') : settings.darkMode === 'light' ? (lang === 'en' ? 'Light' : 'فاتح') : (lang === 'en' ? 'Dark' : 'داكن')}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// مودال اللغة
function openLanguageSubModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-globe"></i> ${lang === 'en' ? 'Language' : 'اللغة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn ${settings.language === 'ar' ? 'selected' : ''}" data-lang="ar">العربية</button>
                <button class="option-btn ${settings.language === 'en' ? 'selected' : ''}" data-lang="en">English</button>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                <button class="btn btn-outline" style="flex: 1;" onclick="this.closest('.modal').remove()">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                    <button class="btn btn-primary" style="flex: 1;" onclick="closeAllModalsAndSaveLanguage()">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // تفعيل اختيار اللغة
    modal.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            modal.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

// مودال الوضع الليلي
function openDarkModeSubModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-moon"></i> ${lang === 'en' ? 'Dark Mode' : 'الوضع الليلي'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn ${settings.darkMode === 'auto' ? 'selected' : ''}" data-mode="auto">${lang === 'en' ? 'Auto' : 'تلقائي'}</button>
                <button class="option-btn ${settings.darkMode === 'light' ? 'selected' : ''}" data-mode="light">${lang === 'en' ? 'Light' : 'فاتح'}</button>
                <button class="option-btn ${settings.darkMode === 'dark' ? 'selected' : ''}" data-mode="dark">${lang === 'en' ? 'Dark' : 'داكن'}</button>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                 <button class="btn btn-outline" style="flex: 1;" onclick="this.closest('.modal').remove()">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                    <button class="btn btn-primary" style="flex: 1;" onclick="closeAllModalsAndSaveDarkMode()">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // تفعيل اختيار الوضع
    modal.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            modal.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
}

// دوال الحفظ والخروج من كل المودالات
function closeAllModalsAndSaveLanguage() {
    const selectedBtn = document.querySelector('.modal .option-btn.selected[data-lang]');
    if (selectedBtn) {
        settings.language = selectedBtn.getAttribute('data-lang');
        saveSettings();
        applyLanguage();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
        if (typeof switchPage === 'function') switchPage(currentPage);
    }
}

function closeAllModalsAndSaveDarkMode() {
    const selectedBtn = document.querySelector('.modal .option-btn.selected');
    if (selectedBtn) {
        const mode = selectedBtn.getAttribute('data-mode');
        settings.darkMode = mode;
        saveSettings();
        applyTheme();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    }
}
function setGeneralSetting(key, value) {
    settings[key] = value;
    saveSettings();
    applyLanguage();
    applyTheme();
    document.querySelectorAll('.modal').forEach(m => m.remove());
    
    // ✅ احذف قائمة المزيد القديمة
    const oldMenu = document.getElementById('moreMenu');
    if (oldMenu) oldMenu.remove();
    
    showToast(t('settingsSaved'));
    if (typeof switchPage === 'function') switchPage('dashboard');
}

// ==================== مودال الشحنات ====================
function openShipmentSettings() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-box"></i> ${lang === 'en' ? 'Shipment Settings' : 'إعدادات الشحنات'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn" id="openShipmentLimitBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Max Items per Shipment' : 'الحد الأقصى للشحنة'}</span>
                    <span style="color: var(--text-soft); font-size: 12px;">${settings.shipmentLimit || 20} ${lang === 'en' ? 'items' : 'قطعة'}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
                <button class="option-btn" id="openShipmentDurationBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Default Duration' : 'مدة الشحن الافتراضية'}</span>
                    <span style="color: var(--text-soft); font-size: 12px;">${settings.shipmentDuration || 7} ${lang === 'en' ? 'days' : 'أيام'}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
                <button class="option-btn" id="openShipmentCostBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Default Shipping Cost' : 'تكلفة الشحن الافتراضية'}</span>
                    <span style="color: var(--text-soft); font-size: 12px;">${settings.shipmentCost || 0} ${settings.currency || 'ر.س'}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
                <button class="option-btn" id="openShipmentAlertBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Alerts' : 'التنبيهات'}</span>
                    <span style="color: var(--text-soft); font-size: 12px;">${lang === 'en' ? 'Before arrival' : 'قبل الوصول'}: ${settings.shipmentAlertBefore || 2} ${lang === 'en' ? 'days' : 'أيام'}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
                <button class="option-btn" id="openShipmentStatusBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Default Status' : 'الحالة الافتراضية'}</span>
                    <span style="color: var(--text-soft); font-size: 12px;">${settings.shipmentDefaultStatus === 'in_transit' ? (lang === 'en' ? 'In Transit' : 'في الطريق') : settings.shipmentDefaultStatus === 'pending' ? (lang === 'en' ? 'Pending' : 'قيد الانتظار') : (lang === 'en' ? 'Processing' : 'قيد التجهيز')}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
                <div style="border-top: 1px solid var(--border); margin: 8px 0;"></div>
                <div style="text-align: right; padding: 8px 0;">
                    <label style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                        <input type="checkbox" id="shipmentHideCompleted" ${settings.shipmentHideCompleted ? 'checked' : ''}>
                        <span style="font-size: 12px;">${lang === 'en' ? 'Auto hide completed shipments' : 'إخفاء الشحنات المكتملة تلقائياً'}</span>
                    </label>
                </div>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                                    <button class="btn btn-outline" style="flex: 1;" id="cancelShipmentBtn">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                    <button class="btn btn-primary" style="flex: 1;" id="saveShipmentBtn">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // فتح مودال الحد الأقصى
    document.getElementById('openShipmentLimitBtn').addEventListener('click', function() {
        modal.remove();
        openShipmentLimitModal();
    });
    
    // فتح مودال المدة
    document.getElementById('openShipmentDurationBtn').addEventListener('click', function() {
        modal.remove();
        openShipmentDurationModal();
    });
    
    // فتح مودال التكلفة
    document.getElementById('openShipmentCostBtn').addEventListener('click', function() {
        modal.remove();
        openShipmentCostModal();
    });
    
    // فتح مودال التنبيهات
    document.getElementById('openShipmentAlertBtn').addEventListener('click', function() {
        modal.remove();
        openShipmentAlertModal();
    });
    
    // فتح مودال الحالة الافتراضية
    document.getElementById('openShipmentStatusBtn').addEventListener('click', function() {
        modal.remove();
        openShipmentStatusModal();
    });
    
    // حفظ الإعدادات الرئيسية
    document.getElementById('saveShipmentBtn').addEventListener('click', function() {
        settings.shipmentHideCompleted = document.getElementById('shipmentHideCompleted').checked;
        saveSettings();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    });
    
    document.getElementById('cancelShipmentBtn').addEventListener('click', function() {
        modal.remove();
    });
}

// مودال الحد الأقصى للشحنة
function openShipmentLimitModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-boxes"></i> ${lang === 'en' ? 'Max Items per Shipment' : 'الحد الأقصى للشحنة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div class="form-group" style="text-align: right;">
                    <label class="form-label">${lang === 'en' ? 'Maximum number of items' : 'أقصى عدد للقطع'}</label>
                    <input type="number" class="form-control" id="shipmentLimitInput" value="${settings.shipmentLimit || 20}" min="1" style="text-align: center; font-size: 24px; font-weight: 700;">
                </div>
                <div style="display: flex; gap: 8px; margin-top: 16px;">                    <button class="btn btn-outline" style="flex: 1;" id="cancelLimitBtn">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>

                    <button class="btn btn-primary" style="flex: 1;" id="saveLimitBtn">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('saveLimitBtn').addEventListener('click', function() {
        settings.shipmentLimit = parseInt(document.getElementById('shipmentLimitInput').value) || 20;
        saveSettings();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    });
    
    document.getElementById('cancelLimitBtn').addEventListener('click', function() {
        modal.remove();
    });
}

// مودال مدة الشحن الافتراضية
function openShipmentDurationModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-clock"></i> ${lang === 'en' ? 'Default Duration' : 'مدة الشحن الافتراضية'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div class="form-group" style="text-align: right;">
                    <label class="form-label">${lang === 'en' ? 'Estimated delivery (days)' : 'مدة التوصيل التقديرية (أيام)'}</label>
                    <input type="number" class="form-control" id="shipmentDurationInput" value="${settings.shipmentDuration || 7}" min="1" style="text-align: center; font-size: 24px; font-weight: 700;">
                </div>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                                    <button class="btn btn-outline" style="flex: 1;" id="cancelDurationBtn">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>

                    <button class="btn btn-primary" style="flex: 1;" id="saveDurationBtn">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('saveDurationBtn').addEventListener('click', function() {
        settings.shipmentDuration = parseInt(document.getElementById('shipmentDurationInput').value) || 7;
        saveSettings();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    });
    
    document.getElementById('cancelDurationBtn').addEventListener('click', function() {
        modal.remove();
    });
}

// مودال تكلفة الشحن
function openShipmentCostModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-truck"></i> ${lang === 'en' ? 'Default Shipping Cost' : 'تكلفة الشحن الافتراضية'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div class="form-group" style="text-align: right;">
                    <label class="form-label">${lang === 'en' ? 'Shipping cost' : 'تكلفة الشحن'} (${settings.currency || 'ر.س'})</label>
                    <input type="number" class="form-control" id="shipmentCostInput" value="${settings.shipmentCost || 0}" min="0" style="text-align: center; font-size: 24px; font-weight: 700;">
                </div>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                                    <button class="btn btn-outline" style="flex: 1;" id="cancelCostBtn">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                    <button class="btn btn-primary" style="flex: 1;" id="saveCostBtn">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('saveCostBtn').addEventListener('click', function() {
        settings.shipmentCost = parseInt(document.getElementById('shipmentCostInput').value) || 0;
        saveSettings();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    });
    
    document.getElementById('cancelCostBtn').addEventListener('click', function() {
        modal.remove();
    });
}

// مودال التنبيهات
function openShipmentAlertModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-bell"></i> ${lang === 'en' ? 'Shipment Alerts' : 'تنبيهات الشحنات'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div class="form-group" style="text-align: right;">
                    <label class="form-label">${lang === 'en' ? 'Alert before arrival (days)' : 'تنبيه قبل الوصول (أيام)'}</label>
                    <input type="number" class="form-control" id="shipmentAlertInput" value="${settings.shipmentAlertBefore || 2}" min="0" style="text-align: center; font-size: 24px; font-weight: 700;">
                </div>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                                    <button class="btn btn-outline" style="flex: 1;" id="cancelAlertBtn">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>

                    <button class="btn btn-primary" style="flex: 1;" id="saveAlertBtn">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('saveAlertBtn').addEventListener('click', function() {
        settings.shipmentAlertBefore = parseInt(document.getElementById('shipmentAlertInput').value) || 2;
        saveSettings();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    });
    
    document.getElementById('cancelAlertBtn').addEventListener('click', function() {
        modal.remove();
    });
}

// مودال الحالة الافتراضية
function openShipmentStatusModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-info-circle"></i> ${lang === 'en' ? 'Default Status' : 'الحالة الافتراضية'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn ${settings.shipmentDefaultStatus === 'processing' ? 'selected' : ''}" data-status="processing">${lang === 'en' ? 'Processing' : 'قيد التجهيز'}</button>
                <button class="option-btn ${settings.shipmentDefaultStatus === 'pending' ? 'selected' : ''}" data-status="pending">${lang === 'en' ? 'Pending' : 'قيد الانتظار'}</button>
                <button class="option-btn ${settings.shipmentDefaultStatus === 'in_transit' ? 'selected' : ''}" data-status="in_transit">${lang === 'en' ? 'In Transit' : 'في الطريق'}</button>
                <div style="display: flex; gap: 8px; margin-top: 16px;">                    
                <button class="btn btn-outline" style="flex: 1;" id="cancelStatusBtn">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>

                    <button class="btn btn-primary" style="flex: 1;" id="saveStatusBtn">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    modal.querySelectorAll('.option-btn[data-status]').forEach(btn => {
        btn.addEventListener('click', function() {
            modal.querySelectorAll('.option-btn[data-status]').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    document.getElementById('saveStatusBtn').addEventListener('click', function() {
        const selected = modal.querySelector('.option-btn.selected[data-status]');
        if (selected) {
            settings.shipmentDefaultStatus = selected.getAttribute('data-status');
        }
        saveSettings();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    });
    
    document.getElementById('cancelStatusBtn').addEventListener('click', function() {
        modal.remove();
    });
}

// ==================== مودال العملاء ====================
function openCustomerSettings() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-users"></i> ${lang === 'en' ? 'Customer Settings' : 'إعدادات العملاء'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn" id="openCustomerLimitsBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Tier Limits' : 'حدود التصنيفات'}</span>
                    <span style="color: var(--text-soft); font-size: 11px;">VIP: ${settings.vipLimit || 20} | ${lang === 'en' ? 'Gold' : 'ذهبي'}: ${settings.goldLimit || 10} | ${lang === 'en' ? 'Silver' : 'مميز'}: ${settings.silverLimit || 4}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
                <button class="option-btn" id="openCustomerColorsBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Tier Colors' : 'ألوان التصنيفات'}</span>
                    <span style="display: flex; gap: 6px;">
                        <span style="width: 14px; height: 14px; background: ${settings.vipColor || '#e8919e'}; border-radius: 50%;"></span>
                        <span style="width: 14px; height: 14px; background: ${settings.goldColor || '#c8a84e'}; border-radius: 50%;"></span>
                        <span style="width: 14px; height: 14px; background: ${settings.silverColor || '#7c5cbf'}; border-radius: 50%;"></span>
                    </span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('openCustomerLimitsBtn').addEventListener('click', function() {
        modal.remove();
        openCustomerLimitsModal();
    });
    
    document.getElementById('openCustomerColorsBtn').addEventListener('click', function() {
        modal.remove();
        openCustomerColorsModal();
    });
}

// مودال حدود التصنيفات
function openCustomerLimitsModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-sliders-h"></i> ${lang === 'en' ? 'Tier Limits' : 'حدود التصنيفات'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div class="form-group" style="text-align: right;">
                    <label class="form-label">VIP (${lang === 'en' ? 'Purchases' : 'مشتريات'})</label>
                    <input type="number" class="form-control" id="customerVipLimit" value="${settings.vipLimit || 20}" min="1">
                </div>
                <div class="form-group" style="text-align: right;">
                    <label class="form-label">${lang === 'en' ? 'Gold' : 'ذهبي'} (${lang === 'en' ? 'Purchases' : 'مشتريات'})</label>
                    <input type="number" class="form-control" id="customerGoldLimit" value="${settings.goldLimit || 10}" min="1">
                </div>
                <div class="form-group" style="text-align: right;">
                    <label class="form-label">${lang === 'en' ? 'Silver' : 'مميز'} (${lang === 'en' ? 'Purchases' : 'مشتريات'})</label>
                    <input type="number" class="form-control" id="customerSilverLimit" value="${settings.silverLimit || 4}" min="1">
                </div>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                    <button class="btn btn-primary" style="flex: 1;" id="saveLimitsBtn">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                    <button class="btn btn-outline" style="flex: 1;" id="cancelLimitsBtn">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('saveLimitsBtn').addEventListener('click', function() {
        settings.vipLimit = parseInt(document.getElementById('customerVipLimit').value) || 20;
        settings.goldLimit = parseInt(document.getElementById('customerGoldLimit').value) || 10;
        settings.silverLimit = parseInt(document.getElementById('customerSilverLimit').value) || 4;
        
        // تحديث تصنيفات العملاء
        customers.forEach(c => { c.tier = getCustomerTier(c.purchaseCount || 0); });
        saveCustomers();
        saveSettings();
        
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    });
    
    document.getElementById('cancelLimitsBtn').addEventListener('click', function() {
        modal.remove();
    });
}

// مودال ألوان التصنيفات
function openCustomerColorsModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-palette"></i> ${lang === 'en' ? 'Tier Colors' : 'ألوان التصنيفات'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div class="form-group" style="text-align: right;">
                    <label class="form-label">VIP ${lang === 'en' ? 'Color' : 'لون'}</label>
                    <input type="color" class="form-control" id="customerVipColor" value="${settings.vipColor || '#e8919e'}" style="height: 45px;">
                </div>
                <div class="form-group" style="text-align: right;">
                    <label class="form-label">${lang === 'en' ? 'Gold Color' : 'لون الذهبي'}</label>
                    <input type="color" class="form-control" id="customerGoldColor" value="${settings.goldColor || '#c8a84e'}" style="height: 45px;">
                </div>
                <div class="form-group" style="text-align: right;">
                    <label class="form-label">${lang === 'en' ? 'Silver Color' : 'لون المميز'}</label>
                    <input type="color" class="form-control" id="customerSilverColor" value="${settings.silverColor || '#7c5cbf'}" style="height: 45px;">
                </div>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                    <button class="btn btn-primary" style="flex: 1;" id="saveColorsBtn">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                    <button class="btn btn-outline" style="flex: 1;" id="cancelColorsBtn">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('saveColorsBtn').addEventListener('click', function() {
        settings.vipColor = document.getElementById('customerVipColor').value;
        settings.goldColor = document.getElementById('customerGoldColor').value;
        settings.silverColor = document.getElementById('customerSilverColor').value;
        
        saveSettings();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    });
    
    document.getElementById('cancelColorsBtn').addEventListener('click', function() {
        modal.remove();
    });
}
// ==================== مودال المدفوعات ====================
function openPaymentSettings() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-money-bill"></i> ${lang === 'en' ? 'Payment Settings' : 'إعدادات المدفوعات'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn" id="openCurrencySubBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Currency' : 'العملة'}</span>
                    <span style="color: var(--text-soft); font-size: 12px;">${settings.currency || 'ر.س'}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
                <button class="option-btn" id="openDownPaymentBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Down Payment' : 'العربون الافتراضي'}</span>
                    <span style="color: var(--text-soft); font-size: 12px;">${settings.downPaymentType === 'none' ? (lang === 'en' ? 'None' : 'لا يوجد') : settings.downPaymentType === 'percent' ? (settings.downPaymentPercent || 30) + '%' : (settings.downPaymentAmount || 100) + ' ' + (settings.currency || 'ر.س')}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('openCurrencySubBtn').addEventListener('click', function() {
        modal.remove();
        openCurrencySubModal();
    });
    
    document.getElementById('openDownPaymentBtn').addEventListener('click', function() {
        modal.remove();
        openDownPaymentModal();
    });
}
// مودال العملة
function openCurrencySubModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-money-bill"></i> ${lang === 'en' ? 'Currency' : 'العملة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <p style="font-size: 12px; color: var(--text-soft); margin-bottom: 12px; text-align: right;">${lang === 'en' ? 'Suggested currencies' : 'عملات مقترحة'}</p>
                <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px;">
                    <button class="btn btn-outline currency-suggestion ${settings.currency === 'ر.س' ? 'selected' : ''}" data-currency="ر.س" style="flex: 1; min-width: 80px;">ريال سعودي </button>
                    <button class="btn btn-outline currency-suggestion ${settings.currency === 'ر.ي' ? 'selected' : ''}" data-currency="ر.ي" style="flex: 1; min-width: 80px;">ريال يمني</button>
                    <button class="btn btn-outline currency-suggestion ${settings.currency === '$' ? 'selected' : ''}" data-currency="$" style="flex: 1; min-width: 80px;">دولار</button>
                </div>
                <div class="form-group" style="text-align: right;">
                    <label class="form-label">${lang === 'en' ? 'Or custom currency' : 'عملة مخصصة'}</label>
                    <input type="text" class="form-control" id="subSettingsCurrency" value="${settings.currency || 'ر.س'}" placeholder="${lang === 'en' ? 'Custom currency' : 'عملة مخصصة'}">
                </div>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                <button class="btn btn-outline" style="flex: 1;" id="cancelCurrencyBtn">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                    <button class="btn btn-primary" style="flex: 1;" id="saveCurrencyBtn">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    const currencyInput = document.getElementById('subSettingsCurrency');
    
    // تفعيل أزرار الاقتراحات
    modal.querySelectorAll('.currency-suggestion').forEach(btn => {
        btn.addEventListener('click', function() {
            modal.querySelectorAll('.currency-suggestion').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            currencyInput.value = this.getAttribute('data-currency');
        });
    });
    
    // زر الحفظ
    document.getElementById('saveCurrencyBtn').addEventListener('click', function() {
        settings.currency = currencyInput.value || 'ر.س';
        saveSettings();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    });
    
    // زر الإلغاء
    document.getElementById('cancelCurrencyBtn').addEventListener('click', function() {
        modal.remove();
    });
}
// مودال العربون
function openDownPaymentModal() {
    
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-hand-holding-usd"></i> ${lang === 'en' ? 'Down Payment' : 'العربون الافتراضي'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <p style="font-size: 12px; color: var(--text-soft); margin-bottom: 12px; text-align: right;">${lang === 'en' ? 'Select down payment type' : 'اختر نوع العربون'}</p>
                <button class="option-btn ${settings.downPaymentType === 'none' ? 'selected' : ''}" data-type="none">${lang === 'en' ? 'None' : 'لا يوجد'}</button>
                <button class="option-btn ${settings.downPaymentType === 'percent' ? 'selected' : ''}" data-type="percent">${lang === 'en' ? 'Percentage' : 'نسبة'}</button>
                <button class="option-btn ${settings.downPaymentType === 'amount' ? 'selected' : ''}" data-type="amount">${lang === 'en' ? 'Fixed Amount' : 'مبلغ ثابت'}</button>
                
                <div id="subDownPaymentPercentField" style="display: ${settings.downPaymentType === 'percent' ? 'block' : 'none'}; text-align: right; margin-top: 12px;">
                    <label class="form-label">${lang === 'en' ? 'Percentage (%)' : 'النسبة (%)'}</label>
                    <input type="number" class="form-control" id="subSettingsDownPaymentPercent" value="${settings.downPaymentPercent || 30}" min="0" max="100">
                </div>
                <div id="subDownPaymentAmountField" style="display: ${settings.downPaymentType === 'amount' ? 'block' : 'none'}; text-align: right; margin-top: 12px;">
                    <label class="form-label">${lang === 'en' ? 'Amount' : 'المبلغ'}</label>
                    <input type="number" class="form-control" id="subSettingsDownPaymentAmount" value="${settings.downPaymentAmount || 100}" min="0">
                </div>
                
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                 <button class="btn btn-outline" style="flex: 1;" onclick="this.closest('.modal').remove()">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                    <button class="btn btn-primary" style="flex: 1;" onclick="closeAllModalsAndSaveDownPayment()">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // تفعيل اختيار نوع العربون
    modal.querySelectorAll('.option-btn[data-type]').forEach(btn => {
        btn.addEventListener('click', function() {
            modal.querySelectorAll('.option-btn[data-type]').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
            
            const type = this.getAttribute('data-type');
            document.getElementById('subDownPaymentPercentField').style.display = type === 'percent' ? 'block' : 'none';
            document.getElementById('subDownPaymentAmountField').style.display = type === 'amount' ? 'block' : 'none';
        });
    });
}

// دوال الحفظ
function closeAllModalsAndSaveCurrency() {
    const currencyInput = document.getElementById('subSettingsCurrency');
    if (currencyInput) {
        settings.currency = currencyInput.value || 'ر.س';
        saveSettings();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    }
}

function closeAllModalsAndSaveDownPayment() {
    const selectedBtn = document.querySelector('.modal .option-btn.selected[data-type]');
    if (selectedBtn) {
        const type = selectedBtn.getAttribute('data-type');
        settings.downPaymentType = type;
        
        if (type === 'percent') {
            settings.downPaymentPercent = parseInt(document.getElementById('subSettingsDownPaymentPercent')?.value) || 30;
        }
        if (type === 'amount') {
            settings.downPaymentAmount = parseInt(document.getElementById('subSettingsDownPaymentAmount')?.value) || 100;
        }
        
        saveSettings();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    }
}

// ==================== مودال الإشعارات ====================
function openNotificationSettings() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-bell"></i> ${lang === 'en' ? 'Notification Settings' : 'إعدادات الإشعارات'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn ${settings.notifyInvoiceNotSent ? 'selected' : ''}" data-notify="notifyInvoice">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Invoice not sent reminder' : 'تذكير فاتورة غير مرسلة'}</span>
                    <i class="fas ${settings.notifyInvoiceNotSent ? 'fa-check-circle' : 'fa-circle'}" style="color: ${settings.notifyInvoiceNotSent ? 'var(--green)' : 'var(--text-soft)'}; font-size: 18px;"></i>
                </button>
                <button class="option-btn ${settings.notifyDebtReminder ? 'selected' : ''}" data-notify="notifyDebt">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Pending debt reminder' : 'تذكير الديون المعلقة'}</span>
                    <i class="fas ${settings.notifyDebtReminder ? 'fa-check-circle' : 'fa-circle'}" style="color: ${settings.notifyDebtReminder ? 'var(--green)' : 'var(--text-soft)'}; font-size: 18px;"></i>
                </button>
                <button class="option-btn ${settings.notifyShipmentBefore ? 'selected' : ''}" data-notify="notifyShipmentBefore">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Shipment arriving soon' : 'تنبيه شحنة قربت توصل'}</span>
                    <i class="fas ${settings.notifyShipmentBefore ? 'fa-check-circle' : 'fa-circle'}" style="color: ${settings.notifyShipmentBefore ? 'var(--green)' : 'var(--text-soft)'}; font-size: 18px;"></i>
                </button>
                <button class="option-btn ${settings.notifyShipmentArrived ? 'selected' : ''}" data-notify="notifyShipmentArrived">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Shipment arrived' : 'تنبيه وصول الشحنة'}</span>
                    <i class="fas ${settings.notifyShipmentArrived ? 'fa-check-circle' : 'fa-circle'}" style="color: ${settings.notifyShipmentArrived ? 'var(--green)' : 'var(--text-soft)'}; font-size: 18px;"></i>
                </button>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                                    <button class="btn btn-outline" style="flex: 1;" id="cancelNotifyBtn">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                    <button class="btn btn-primary" style="flex: 1;" id="saveNotifyBtn">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // تفعيل التبديل عند النقر
    modal.querySelectorAll('.option-btn[data-notify]').forEach(btn => {
        btn.addEventListener('click', function() {
            const notifyKey = this.getAttribute('data-notify');
            settings[notifyKey] = !settings[notifyKey];
            const icon = this.querySelector('i');
            if (settings[notifyKey]) {
                this.classList.add('selected');
                icon.className = 'fas fa-check-circle';
                icon.style.color = 'var(--green)';
            } else {
                this.classList.remove('selected');
                icon.className = 'fas fa-circle';
                icon.style.color = 'var(--text-soft)';
            }
        });
    });
    
    // زر الحفظ
    document.getElementById('saveNotifyBtn').addEventListener('click', function() {
        saveSettings();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    });
    
    // زر الإلغاء
    document.getElementById('cancelNotifyBtn').addEventListener('click', function() {
        modal.remove();
    });
}
// ==================== مودال التواصل ====================
function openCommunicationSettings() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-globe"></i> ${lang === 'en' ? 'Communication' : 'التواصل'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <button class="option-btn" id="openCountryCodeBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Country Code' : 'رمز الدولة'}</span>
                    <span style="color: var(--text-soft); font-size: 12px;">+${settings.countryCode || '967'}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
                <button class="option-btn" id="openWABtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'WhatsApp Template' : 'قالب واتساب'}</span>
                    <span style="color: var(--text-soft); font-size: 12px;">${lang === 'en' ? 'Edit' : 'تعديل'}</span>
                    <i class="fas fa-chevron-left" style="color: var(--text-soft);"></i>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('openCountryCodeBtn').addEventListener('click', function() {
        modal.remove();
        openCountryCodeModal();
    });
    
    document.getElementById('openWABtn').addEventListener('click', function() {
        modal.remove();
        openWATemplateModal();
    });
}
function openCountryCodeModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-phone"></i> ${lang === 'en' ? 'Country Code' : 'رمز الدولة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div class="form-group" style="text-align: right;">
                    <label class="form-label">${lang === 'en' ? 'Country Code' : 'رمز الدولة'}</label>
                    <input type="text" class="form-control" id="countryCodeInput" value="${settings.countryCode || '967'}" style="text-align: center; font-size: 18px;">
                </div>
                <div style="display: flex; gap: 8px; margin-top: 8px;">
                    <button class="btn btn-outline code-btn" data-code="967" style="flex: 1;">${lang === 'en' ? 'Yemen' : 'اليمن'}<br><span style="font-weight: 700;">+967</span></button>
                    <button class="btn btn-outline code-btn" data-code="966" style="flex: 1;">${lang === 'en' ? 'Saudi' : 'السعودية'}<br><span style="font-weight: 700;">+966</span></button>
                    <button class="btn btn-outline code-btn" data-code="1" style="flex: 1;">${lang === 'en' ? 'USA' : 'أمريكا'}<br><span style="font-weight: 700;">+1</span></button>
                </div>
                <p style="font-size: 12px; color: var(--text-soft); margin: 16px 0 12px; text-align: right;">${lang === 'en' ? 'Code Behavior' : 'سلوك الرمز'}</p>
                <button class="option-btn ${settings.codeBehavior === 'prepend' ? 'selected' : ''}" data-behavior="prepend">${lang === 'en' ? 'Auto add code' : 'إضافة الرمز تلقائياً'}</button>
                <button class="option-btn ${settings.codeBehavior === 'asis' ? 'selected' : ''}" data-behavior="asis">${lang === 'en' ? 'Use as is' : 'استخدم الرقم كما هو'}</button>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                    <button class="btn btn-primary" style="flex: 1;" id="saveCodeBtn">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                    <button class="btn btn-outline" style="flex: 1;" id="cancelCodeBtn">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // أزرار الرمز
    modal.querySelectorAll('.code-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.getElementById('countryCodeInput').value = this.getAttribute('data-code');
        });
    });
    
    // أزرار السلوك
    modal.querySelectorAll('.option-btn[data-behavior]').forEach(btn => {
        btn.addEventListener('click', function() {
            modal.querySelectorAll('.option-btn[data-behavior]').forEach(b => b.classList.remove('selected'));
            this.classList.add('selected');
        });
    });
    
    // حفظ
    document.getElementById('saveCodeBtn').addEventListener('click', function() {
        settings.countryCode = document.getElementById('countryCodeInput').value || '967';
        const selectedBehavior = modal.querySelector('.option-btn.selected[data-behavior]');
        if (selectedBehavior) {
            settings.codeBehavior = selectedBehavior.getAttribute('data-behavior');
        }
        saveSettings();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    });
    
    // إلغاء
    document.getElementById('cancelCodeBtn').addEventListener('click', function() {
        modal.remove();
    });
}
function openWATemplateModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-comment-dots"></i> ${lang === 'en' ? 'WhatsApp Template' : 'قالب واتساب'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div class="form-group" style="text-align: right;">
                    <label class="form-label">${lang === 'en' ? 'Message Template' : 'نص الرسالة'}</label>
                    <textarea class="form-control" id="waTemplateInput" rows="5" style="font-size: 12px;">${settings.whatsappTemplate || ''}</textarea>
                </div>
                <div style="font-size: 10px; color: var(--text-soft); margin-top: 8px; text-align: right; direction: ltr;">
                    {firstName} · {orderId} · {formattedDate} · {items} · {delivery} · {total} · {paymentStatus} · {shipmentId}
                </div>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                                    <button class="btn btn-outline" style="flex: 1;" id="cancelWABtn">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                    <button class="btn btn-primary" style="flex: 1;" id="saveWABtn">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('saveWABtn').addEventListener('click', function() {
        settings.whatsappTemplate = document.getElementById('waTemplateInput').value;
        saveSettings();
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('settingsSaved'));
    });
    
    document.getElementById('cancelWABtn').addEventListener('click', function() {
        modal.remove();
    });
}

// ==================== مودال الأمان ====================
function openSecuritySettings() {
    const lang = settings.language;
    const isOn = settings.appLock === 'on';
    const pinExists = settings.pinCode && settings.pinCode.length > 0;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'securitySettingsModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-shield-alt"></i> ${lang === 'en' ? 'Security' : 'الأمان'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <p style="font-size: 12px; color: var(--text-soft); margin-bottom: 12px; text-align: right;">${lang === 'en' ? 'App Lock' : 'قفل التطبيق'}</p>
                <button class="option-btn ${!isOn ? 'selected' : ''}" onclick="setAppLock('off')">${lang === 'en' ? 'Off' : 'غير مفعل'}</button>
                <button class="option-btn ${isOn ? 'selected' : ''}" onclick="setAppLock('on')">${lang === 'en' ? 'On' : 'مفعل'}</button>
                
                <div id="securityFields" style="display: ${isOn ? 'block' : 'none'};">
                    ${!pinExists ? `
                        <div class="form-group" style="text-align: right; margin-top: 16px;">
                            <label class="form-label">PIN ${lang === 'en' ? 'digits' : 'رمز PIN'} <span style="color: var(--red);">*</span></label>
                            <input type="password" class="form-control" id="settingsPin" maxlength="6" inputmode="numeric" style="font-size: 20px; text-align: center; letter-spacing: 6px;" placeholder="ادخل 4-6 ارقام">
                        </div>
                        <div class="form-group" style="text-align: right;">
                            <label class="form-label">${lang === 'en' ? 'Security Question' : 'السؤال السري'} <span style="color: var(--red);">*</span></label>
                            <input type="text" class="form-control" id="settingsSecurityQuestion" placeholder="${lang === 'en' ? 'Note: Remember the question carefully' :'ملاحظة: تذكر السؤال جيداً'}">
                        </div>
                        <div class="form-group" style="text-align: right;">
                            <label class="form-label">${lang === 'en' ? 'Answer' : 'الإجابة'} <span style="color: var(--red);">*</span></label>
                            <input type="text" class="form-control" id="settingsSecurityAnswer" placeholder="${lang === 'en' ? 'Answer' : 'الإجابة'}">
                        </div>
                    ` : `
                        <p style="text-align: center; color: var(--green); margin-top: 16px; font-size: 13px;">
                            <i class="fas fa-check-circle"></i> ${lang === 'en' ? 'PIN is set' : 'الرمز محفوظ'}
                        </p>
                        <button class="btn btn-outline" style="width: 100%; margin-top: 8px; color: var(--orange);" onclick="showChangePinForm()">
                            <i class="fas fa-edit"></i> ${lang === 'en' ? 'Change PIN' : 'تغيير الرمز'}
                        </button>
                        <div id="changePinForm" style="display: none;">
                            <div class="form-group" style="text-align: right; margin-top: 12px;">
                                <label class="form-label">${lang === 'en' ? 'Answer your security question' : 'أجب على سؤالك السري'}</label>
                                <p style="font-size: 12px; font-weight: 600; margin-bottom: 8px;">${settings.securityQuestion || ''}</p>
                                <input type="text" class="form-control" id="settingsSecurityCheck" placeholder="${lang === 'en' ? 'Your answer' : 'إجابتك'}">
                            </div>
                            <div class="form-group" style="text-align: right;">
                                <label class="form-label">${lang === 'en' ? 'New PIN' : 'الرمز الجديد'}</label>
                                <input type="password" class="form-control" id="settingsNewPin" maxlength="6" inputmode="numeric" style="font-size: 20px; text-align: center; letter-spacing: 6px;" placeholder="••••••">
                            </div>
                            <button class="btn btn-primary" style="width: 100%; margin-top: 8px;" onclick="changePinCode()">${lang === 'en' ? 'Change' : 'تغيير'}</button>
                        </div>
                    `}
                </div>
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                                    <button class="btn btn-outline" style="flex: 1;" onclick="this.closest('.modal').remove()">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                    <button class="btn btn-primary" style="flex: 1;" onclick="saveSecuritySettings()">${lang === 'en' ? 'Save' : 'حفظ'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function setAppLock(value) {
    settings.appLock = value;
    document.getElementById('securityFields').style.display = value === 'on' ? 'block' : 'none';
    const modal = document.getElementById('securitySettingsModal');
    if (modal) {
        modal.querySelectorAll('.option-btn').forEach((b, i) => {
            b.classList.toggle('selected', i === (value === 'off' ? 0 : 1));
        });
    }
}

function showChangePinForm() {
    document.getElementById('changePinForm').style.display = 'block';
}

function changePinCode() {
    const lang = settings.language;
    const answer = document.getElementById('settingsSecurityCheck').value.trim();
    const newPin = document.getElementById('settingsNewPin').value;
    
    if (!answer || answer !== settings.securityAnswer) {
        showToast(lang === 'en' ? 'Wrong answer' : 'إجابة خاطئة');
        return;
    }
    if (!newPin || newPin.length < 4) {
        showToast(lang === 'en' ? 'PIN must be 4-6 digits' : 'الرمز يجب أن يكون ٤-٦ أرقام');
        return;
    }
    
    settings.pinCode = newPin;
    saveSettings();
    document.querySelectorAll('.modal').forEach(m => m.remove());
    showToast(lang === 'en' ? 'PIN changed successfully' : 'تم تغيير الرمز بنجاح');
}

function saveSecuritySettings() {
    const lang = settings.language;
    const pin = document.getElementById('settingsPin')?.value || '';
    const question = document.getElementById('settingsSecurityQuestion')?.value?.trim() || '';
    const answer = document.getElementById('settingsSecurityAnswer')?.value?.trim() || '';
    const pinExists = settings.pinCode && settings.pinCode.length > 0;
    
    if (settings.appLock === 'on' && !pinExists) {
        if (!pin || pin.length < 4) {
            showToast(lang === 'en' ? 'PIN must be 4-6 digits' : 'الرمز يجب أن يكون ٤-٦ أرقام');
            return;
        }
        if (!question) {
            showToast(lang === 'en' ? 'Security question is required' : 'السؤال السري مطلوب');
            return;
        }
        if (!answer) {
            showToast(lang === 'en' ? 'Answer is required' : 'الإجابة مطلوبة');
            return;
        }
        settings.pinCode = pin;
        settings.securityQuestion = question;
        settings.securityAnswer = answer;
    }
    
    saveSettings();
    document.querySelectorAll('.modal').forEach(m => m.remove());
    showToast(t('settingsSaved'));
}

// ==================== مودال تسجيل الخروج ====================
function logoutApp() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title">${lang === 'en' ? 'Logout' : 'تسجيل الخروج'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <i class="fas fa-sign-out-alt" style="font-size: 40px; color: var(--red); margin-bottom: 12px;"></i>
                <p style="font-size: 14px; margin-bottom: 20px;">${lang === 'en' ? 'Are you sure you want to logout?' : 'هل أنت متأكد من تسجيل الخروج؟'}</p>
                <div style="display: flex; gap: 8px;">
                                    <button class="btn btn-primary" style="flex: 1;" onclick="this.closest('.modal').remove()">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                    <button class="btn btn-outline" style="flex: 1; color: var(--red); border-color: var(--red);" onclick="confirmLogout()">${lang === 'en' ? 'Logout' : 'خروج'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function confirmLogout() {
    document.querySelectorAll('.modal').forEach(m => m.remove());
    if (typeof checkAppLock === 'function') {
        const appContainer = document.querySelector('.app-container');
        if (appContainer) appContainer.style.display = 'none';
        showLockScreen();
    }
    showToast(settings.language === 'en' ? 'Logged out' : 'تم تسجيل الخروج');
}

// ==================== مودال مسح البيانات ====================
function openClearDataModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-trash-alt"></i> ${lang === 'en' ? 'Clear Data' : 'مسح البيانات'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: var(--red); margin-bottom: 12px;"></i>
                <p style="font-size: 14px; margin-bottom: 4px;">${lang === 'en' ? 'Are you sure?' : 'هل أنت متأكد؟'}</p>
                <p style="font-size: 12px; color: var(--red); margin-bottom: 20px;">${lang === 'en' ? 'This action cannot be undone.' : 'هذا الإجراء لا يمكن التراجع عنه.'}</p>
                <button class="option-btn" style="color: var(--red);" onclick="clearDataType('invoices')">
                    <i class="fas fa-receipt"></i> ${lang === 'en' ? 'Clear Invoices' : 'مسح الفواتير'}
                </button>
                <button class="option-btn" style="color: var(--red);" onclick="clearDataType('customers')">
                    <i class="fas fa-users"></i> ${lang === 'en' ? 'Clear Customers' : 'مسح العملاء'}
                </button>
                <button class="option-btn" style="color: var(--red);" onclick="clearDataType('shipments')">
                    <i class="fas fa-box"></i> ${lang === 'en' ? 'Clear Shipments' : 'مسح الشحنات'}
                </button>
                <button class="option-btn" style="color: var(--red);" onclick="clearDataType('loyalty')">
    <i class="fas fa-gift"></i> ${lang === 'en' ? 'Clear Loyalty Codes' : 'مسح أكواد الولاء'}
</button>
                <button class="option-btn" style="color: var(--red); font-weight: 700;" onclick="clearDataType('all')">
                    <i class="fas fa-skull"></i> ${lang === 'en' ? 'Clear Everything' : 'مسح كل شيء'}
                </button>
                <div style="margin-top: 12px;">
                    <button class="btn btn-outline" style="width: 100%;" onclick="this.closest('.modal').remove()">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function clearDataType(type) {
    const lang = settings.language;
    document.querySelectorAll('.modal').forEach(m => m.remove());
    
    const confirmModal = document.createElement('div');
    confirmModal.className = 'modal bottom-sheet';
    confirmModal.style.display = 'flex';
    
    let typeText = '';
    if (type === 'invoices') typeText = lang === 'en' ? 'all invoices' : 'كل الفواتير';
    else if (type === 'customers') typeText = lang === 'en' ? 'all customers' : 'كل العملاء';
    else if (type === 'shipments') typeText = lang === 'en' ? 'all shipments' : 'كل الشحنات';
    if (type === 'loyalty' || type === 'all') loyaltyCodes = [];
    else typeText = lang === 'en' ? 'everything' : 'كل شيء';
    
    confirmModal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title">${lang === 'en' ? 'Confirm Deletion' : 'تأكيد الحذف'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: var(--red); margin-bottom: 12px;"></i>
                <p style="font-size: 14px; margin-bottom: 4px; color: var(--red);">${lang === 'en' ? 'Are you sure?' : 'هل أنت متأكد؟'}</p>
                <p style="font-size: 12px; color: var(--text-soft); margin-bottom: 16px;">${lang === 'en' ? 'Delete' : 'حذف'} ${typeText}؟ ${lang === 'en' ? 'This cannot be undone.' : 'لا يمكن التراجع عن هذا.'}</p>
                
                <div class="form-group" style="text-align: right;">
                    <label class="form-label" style="color: var(--red);">${lang === 'en' ? 'Write "DELETE" to confirm' : 'اكتب "مسح" للتأكيد'}</label>
                    <input type="text" class="form-control" id="confirmDeleteInput" placeholder="${lang === 'en' ? 'DELETE' : 'مسح'}" style="text-align: center; font-weight: 700; font-size: 16px; border-color: var(--red);">
                </div>
                
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                                    <button class="btn btn-outline" style="flex: 1;" onclick="this.closest('.modal').remove()">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                    <button class="btn btn-primary" style="flex: 1; background: var(--red);" id="confirmClearBtn" disabled>${lang === 'en' ? 'Delete' : 'حذف'}</button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(confirmModal);
    
    const deleteInput = document.getElementById('confirmDeleteInput');
    const confirmBtn = document.getElementById('confirmClearBtn');
    const requiredWord = lang === 'en' ? 'DELETE' : 'مسح';
    
    // تفعيل الزر فقط لو الكلمة صحيحة
    deleteInput.addEventListener('input', function() {
        if (this.value === requiredWord) {
            confirmBtn.disabled = false;
            confirmBtn.style.opacity = '1';
        } else {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
        }
    });
    
    confirmBtn.addEventListener('click', function() {
        if (deleteInput.value !== requiredWord) return;
        
        if (type === 'invoices' || type === 'all') invoices = [];
        if (type === 'customers' || type === 'all') customers = [];
        if (type === 'shipments' || type === 'all') shipments = [];
        if (type === 'all') { notifications = []; wishlist = []; notes = []; }
        
        saveInvoices();
        saveCustomers();
        saveShipments();
        saveNotifications();
        saveWishlist();
        saveNotes();
        saveLoyaltyCodes();
        
        document.querySelectorAll('.modal').forEach(m => m.remove());
        showToast(t('dataCleared'));
        if (typeof switchPage === 'function') switchPage('dashboard');
    });
}

// ==================== دوال مساعدة ====================
function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById('settingsSoundIcon').className = 'fas ' + (soundEnabled ? 'fa-volume-up' : 'fa-volume-mute');
    document.getElementById('settingsSoundLabel').textContent = soundEnabled ? (settings.language === 'en' ? 'Sound On' : 'مفعل') : (settings.language === 'en' ? 'Mute' : 'صامت');
}
function openBackupModal() {
    const lang = settings.language;
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="text-align: center;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-cloud-upload-alt"></i> ${lang === 'en' ? 'Backup' : 'النسخ الاحتياطي'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <i class="fas fa-cloud" style="font-size: 48px; color: var(--text-soft); margin-bottom: 12px;"></i>
                <p style="font-size: 13px; margin-bottom: 20px;">${lang === 'en' ? 'Export or restore your data' : 'تصدير أو استعادة بياناتك'}</p>
                
                <button class="option-btn" id="exportBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Export All Data' : 'تصدير كل البيانات'}</span>
                    <i class="fas fa-download" style="color: var(--text-soft);"></i>
                </button>
                <button class="option-btn" id="importBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Import Data' : 'استيراد البيانات'}</span>
                    <i class="fas fa-upload" style="color: var(--text-soft);"></i>
                </button>
                
                <input type="file" id="importFileInput" accept=".json" style="display: none;">
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // تصدير
    document.getElementById('exportBtn').addEventListener('click', function() {
        const data = {
            invoices: invoices,
            customers: customers,
            shipments: shipments,
            settings: settings,
            notifications: notifications,
            wishlist: wishlist,
            notes: notes,
            version: APP_VERSION,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lorven_backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showToast(lang === 'en' ? 'Backup downloaded' : 'تم تحميل النسخة الاحتياطية');
        modal.remove();
    });
    
    // استيراد
    document.getElementById('importBtn').addEventListener('click', function() {
        document.getElementById('importFileInput').click();
    });
    
    document.getElementById('importFileInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const data = JSON.parse(event.target.result);
                
                if (!data.version) {
                    throw new Error('Invalid backup file');
                }
                
                // تأكيد الاستيراد
                const confirmModal = document.createElement('div');
                confirmModal.className = 'modal bottom-sheet';
                confirmModal.style.display = 'flex';
                confirmModal.innerHTML = `
                    <div class="modal-content bottom-sheet-content" style="text-align: center;">
                        <div class="modal-header">
                            <div class="modal-title">${lang === 'en' ? 'Confirm Import' : 'تأكيد الاستيراد'}</div>
                            <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
                        </div>
                        <div class="modal-body">
                            <i class="fas fa-exclamation-triangle" style="font-size: 40px; color: var(--orange); margin-bottom: 12px;"></i>
                            <p style="font-size: 14px; margin-bottom: 8px;">${lang === 'en' ? 'This will replace all current data!' : 'هذا سيستبدل كل البيانات الحالية!'}</p>
                            <p style="font-size: 11px; color: var(--text-soft); margin-bottom: 16px;">${lang === 'en' ? 'Backup date:' : 'تاريخ النسخة:'} ${new Date(data.exportDate).toLocaleDateString()}</p>
                            <div style="display: flex; gap: 8px;">
                                                            <button class="btn btn-outline" style="flex: 1;" onclick="this.closest('.modal').remove()">${lang === 'en' ? 'Cancel' : 'إلغاء'}</button>
                                <button class="btn btn-primary" style="flex: 1;" id="confirmImportBtn">${lang === 'en' ? 'Import' : 'استيراد'}</button>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(confirmModal);
                
                document.getElementById('confirmImportBtn').addEventListener('click', function() {
                    if (data.invoices) invoices = data.invoices;
                    if (data.customers) customers = data.customers;
                    if (data.shipments) shipments = data.shipments;
                    if (data.settings) {
                        Object.assign(settings, data.settings);
                        applyTheme();
                        applyLanguage();
                    }
                    if (data.notifications) notifications = data.notifications;
                    if (data.wishlist) wishlist = data.wishlist;
                    if (data.notes) notes = data.notes;
                    
                    saveAllData();
                    document.querySelectorAll('.modal').forEach(m => m.remove());
                    showToast(t('dataImported'));
                    if (typeof switchPage === 'function') switchPage('dashboard');
                });
                
            } catch (error) {
                showToast(lang === 'en' ? 'Invalid backup file' : 'ملف نسخة غير صالح');
            }
        };
        reader.readAsText(file);
    });
}
function handleCSVFile(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n');
        const headers = rows[0].split(',');
        
        for (let i = 1; i < rows.length; i++) {
            if (!rows[i].trim()) continue;
            const values = rows[i].split(',');
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index] ? values[index].trim() : '';
            });
            
            // تحويل CSV إلى كائن حسب نوع البيانات
            if (row.name || row.phone || row.id) {
                // عميل
                const customer = {
                    id: Date.now() + i,
                    name: row.name || '',
                    phone: row.phone || '',
                    purchaseCount: parseInt(row.purchaseCount) || 0,
                    tier: 'regular'
                };
                customer.tier = getCustomerTier(customer.purchaseCount);
                customers.push(customer);
            }
        }
        
        saveCustomers();
        showToast(settings.language === 'en' ? 'Data imported successfully' : 'تم استيراد البيانات بنجاح');
        if (typeof switchPage === 'function') switchPage('dashboard');
    };
    reader.readAsText(file);
}
function saveCommunicationSettings() {
    settings.countryCode = document.getElementById('settingsCountryCode').value || '967';
    settings.whatsappTemplate = document.getElementById('settingsWATemplate').value;
    saveSettings();
    document.getElementById('communicationSettingsModal')?.remove();
    
    // مزامنة تلقائية مع GitHub
    fetch('/api/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            key: 'whatsappTemplate',
            value: settings.whatsappTemplate
        })
    }).catch(() => {});
    
    showToast(t('settingsSaved'));
}
