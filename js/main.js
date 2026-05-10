// ==================== main.js ====================
// نقطة البداية - LORVEN SYS v3.0

document.addEventListener('DOMContentLoaded', async function() {
    
    // ✅ تهيئة البيانات أولاً
    if (typeof initApp === 'function') {
        await initApp();
    }
    
    // ✅ فحص القفل قبل أي شي
    if (typeof checkAppLock === 'function') {
        checkAppLock();
        // إذا التطبيق مقفول، ما نكمل
        if (settings.appLock === 'on' && settings.pinCode && settings.pinCode.length >= 4) {
            return;
        }
    }
    
    // تطبيق الإعدادات
    if (typeof applySettings === 'function') {
        applySettings();
    }
    
    // تهيئة التطبيق
    setTimeout(function() {
        isAppInitialized = true;
        
        if (typeof switchPage === 'function') {
            switchPage('dashboard');
        }
        
        if (typeof checkAutoNotifications === 'function') {
            checkAutoNotifications();
        }
        
        setInterval(function() {
            if (typeof checkAutoNotifications === 'function') {
                checkAutoNotifications();
            }
        }, 300000);
        
    }, 300);
});

window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

document.addEventListener('touchmove', function(e) {
    if (e.target.closest('.main-content') && e.target.closest('.main-content').scrollTop <= 0) {}
}, { passive: true });

console.log('✅ main.js loaded - LORVEN v' + APP_VERSION);