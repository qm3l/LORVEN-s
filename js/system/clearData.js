// ==================== clearData.js ====================
// مسح البيانات - LORVEN SYS v3.0

let clearDataStep = 0;
let clearDataMethod = '';

function openClearDataModal() {
    clearDataStep = 0;
    clearDataMethod = '';
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'clearDataModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 360px;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-trash-alt"></i> ${i18n[settings.language].clearData || 'مسح البيانات'}</div>
                <div class="modal-close" onclick="closeClearDataModal()">&times;</div>
            </div>
            <div class="modal-body" id="clearDataBody">
                ${getClearDataStepHTML()}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function closeClearDataModal() {
    const modal = document.getElementById('clearDataModal');
    if (modal) modal.remove();
    clearDataStep = 0;
    clearDataMethod = '';
}

function getClearDataStepHTML() {
    const lang = settings.language;
    
    if (clearDataStep === 0) {
        return `
            <div style="text-align: center; margin-bottom: 20px;">
                <i class="fas fa-exclamation-triangle" style="font-size: 48px; color: var(--red); margin-bottom: 12px;"></i>
                <p style="font-weight: 700; font-size: 15px; color: var(--red);">
                    ${t('clearDataWarning')}
                </p>
            </div>
            <p style="margin-bottom: 16px; font-size: 13px;">
                ${lang === 'en' ? 'Choose verification method:' : 'اختر طريقة التحقق:'}
            </p>
            <button class="btn btn-outline" style="width:100%; margin-bottom: 8px;" onclick="selectClearMethod('word')">
                <i class="fas fa-pen"></i> ${lang === 'en' ? 'Type "DELETE"' : 'كتابة كلمة "مسح"'}
            </button>
            <button class="btn btn-outline" style="width:100%; margin-bottom: 8px;" onclick="selectClearMethod('pin')">
                <i class="fas fa-key"></i> ${lang === 'en' ? 'PIN Code' : 'رمز PIN'}
            </button>
            <button class="btn btn-outline" style="width:100%; margin-bottom: 8px;" onclick="selectClearMethod('password')">
                <i class="fas fa-lock"></i> ${lang === 'en' ? 'Password' : 'كلمة المرور'}
            </button>
            <button class="btn btn-outline" style="width:100%;" onclick="selectClearMethod('fingerprint')">
                <i class="fas fa-fingerprint"></i> ${lang === 'en' ? 'Fingerprint' : 'بصمة الإصبع'}
            </button>
        `;
    }
    
    if (clearDataStep === 1) {
        if (clearDataMethod === 'word') {
            return `
                <p style="margin-bottom: 12px; font-weight: 600;">
                    ${t('typeDelete')}
                </p>
                <input type="text" class="form-control" id="clearDataWord" placeholder="${lang === 'en' ? 'DELETE' : 'مسح'}" style="font-size: 18px; text-align: center; letter-spacing: 4px;">
                <div id="clearDataError" style="color: var(--red); font-size: 11px; margin-top: 8px; display: none;">
                    ${t('wrongWord')}
                </div>
                <button class="btn btn-danger" style="width:100%; margin-top: 16px;" onclick="verifyClearWord()">
                    ${i18n[lang].confirm || 'تأكيد'}
                </button>
            `;
        }
        
        if (clearDataMethod === 'pin') {
            return `
                <p style="margin-bottom: 12px; font-weight: 600;">
                    ${lang === 'en' ? 'Enter PIN:' : 'أدخل رمز PIN:'}
                </p>
                <input type="password" class="form-control" id="clearDataPin" maxlength="6" inputmode="numeric" style="font-size: 24px; text-align: center; letter-spacing: 8px;">
                <div id="clearDataError" style="color: var(--red); font-size: 11px; margin-top: 8px; display: none;">
                    ${t('wrongPin')}
                </div>
                <button class="btn btn-danger" style="width:100%; margin-top: 16px;" onclick="verifyClearPin()">
                    ${i18n[lang].confirm || 'تأكيد'}
                </button>
            `;
        }
        
        if (clearDataMethod === 'password') {
            return `
                <p style="margin-bottom: 12px; font-weight: 600;">
                    ${lang === 'en' ? 'Enter password:' : 'أدخل كلمة المرور:'}
                </p>
                <input type="password" class="form-control" id="clearDataPassword" style="text-align: center;">
                <div id="clearDataError" style="color: var(--red); font-size: 11px; margin-top: 8px; display: none;">
                    ${t('wrongPassword')}
                </div>
                <button class="btn btn-danger" style="width:100%; margin-top: 16px;" onclick="verifyClearPassword()">
                    ${i18n[lang].confirm || 'تأكيد'}
                </button>
            `;
        }
        
        if (clearDataMethod === 'fingerprint') {
            return `
                <div style="text-align: center;">
                    <p style="margin-bottom: 16px; font-weight: 600;">
                        ${lang === 'en' ? 'Use fingerprint to confirm' : 'استخدم البصمة للتأكيد'}
                    </p>
                    <i class="fas fa-fingerprint" style="font-size: 64px; color: var(--text); cursor: pointer;" onclick="verifyClearFingerprint()"></i>
                    <p style="font-size: 11px; color: var(--text-soft); margin-top: 8px;">
                        ${lang === 'en' ? 'Tap the icon' : 'اضغط على الأيقونة'}
                    </p>
                </div>
            `;
        }
    }
    
    return '';
}

function selectClearMethod(method) {
    clearDataMethod = method;
    clearDataStep = 1;
    document.getElementById('clearDataBody').innerHTML = getClearDataStepHTML();
    
    if (method === 'pin') {
        setTimeout(() => document.getElementById('clearDataPin')?.focus(), 100);
    }
    if (method === 'password') {
        setTimeout(() => document.getElementById('clearDataPassword')?.focus(), 100);
    }
    if (method === 'word') {
        setTimeout(() => document.getElementById('clearDataWord')?.focus(), 100);
    }
}

function verifyClearWord() {
    const word = document.getElementById('clearDataWord').value.trim();
    const expectedWord = settings.language === 'en' ? 'DELETE' : 'مسح';
    
    if (word === expectedWord) {
        executeClearData();
    } else {
        document.getElementById('clearDataError').style.display = 'block';
        document.getElementById('clearDataWord').value = '';
    }
}

function verifyClearPin() {
    const pin = document.getElementById('clearDataPin').value;
    if (pin === settings.pinCode) {
        executeClearData();
    } else {
        document.getElementById('clearDataError').style.display = 'block';
        document.getElementById('clearDataPin').value = '';
    }
}

function verifyClearPassword() {
    const password = document.getElementById('clearDataPassword').value;
    if (password === settings.password) {
        executeClearData();
    } else {
        document.getElementById('clearDataError').style.display = 'block';
        document.getElementById('clearDataPassword').value = '';
    }
}

function verifyClearFingerprint() {
    executeClearData();
}

function executeClearData() {
    const lang = settings.language;
    
    try {
        indexedDB.deleteDatabase('lorvenDB');
    } catch (e) {}
    
    try {
        localStorage.clear();
    } catch (e) {}
    
    invoices = [];
    customers = [];
    shipments = [];
    suppliers = [];
    bundles = [];
    wishlist = [];
    notifications = [];
    invoiceItems = [];
    
    const savedLang = settings.language;
    const savedDark = settings.darkMode;
    
    // إعادة تعيين الإعدادات الافتراضية
    resetSettingsDefaults();
    settings.language = savedLang;
    settings.darkMode = savedDark;
    
    try {
        localStorage.setItem('lorvenSettings', JSON.stringify(settings));
    } catch (e) {}
    
    closeClearDataModal();
    showToast(t('dataCleared'));
    
    if (currentPage === 'settings') {
        switchPage('settings');
    } else {
        switchPage('dashboard');
    }
}

function resetSettingsDefaults() {
    settings = {
        darkMode: settings.darkMode,
        language: settings.language,
        shipmentLimit: 20,
        shipmentDuration: 'auto',
        shipmentDurationDays: 14,
        shipmentAlertBefore: 2,
        shipmentAlertArrived: true,
        shipmentAlertDelayed: true,
        shipmentAlertBeforeEnabled: true,
        vipLimit: 20,
        goldLimit: 10,
        silverLimit: 4,
        vipColor: '#e8919e',
        goldColor: '#c8a84e',
        silverColor: '#7c5cbf',
        bronzeColor: '#b8734a',
        normalColor: '#8a8078',
        currency: 'ر.س',
        paymentMethods: ['كاش', 'تحويل بنكي', 'محفظة'],
        downPaymentType: 'none',
        downPaymentPercent: 30,
        downPaymentAmount: 100,
        notifyInvoiceNotSent: true,
        notifyInvoiceNotSentDays: 1,
        notifyDebtReminder: true,
        notifyDebtReminderDays: 3,
        notifyShipmentArrived: true,
        notifyShipmentDelayed: true,
        notifyShipmentBefore: true,
        notifyCustomerVIP: true,
        notifyCustomerInactive: false,
        notifyCustomerInactiveDays: 30,
        notifyWishlistReminder: true,
        countryCode: '967',
        codeBehavior: 'prepend',
        whatsappTemplate: settings.whatsappTemplate,
        appLock: 'off',
        lockMethod: 'pin',
        pinCode: '',
        password: '',
        fingerprint: false,
        securityQuestion: '',
        securityAnswer: '',
        lastBackupDate: null
    };
}

console.log('✅ clearData.js loaded');