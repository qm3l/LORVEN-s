// ==================== main.js ====================
// نقطة البداية - LORVEN SYS v3.0

document.addEventListener('DOMContentLoaded', function() {
    // تحميل البيانات
    if (typeof loadData === 'function') {
        loadData();
    }
    
    // تطبيق الإعدادات
    if (typeof applySettings === 'function') {
        applySettings();
    }
    
    // تهيئة التطبيق
    setTimeout(function() {
        isAppInitialized = true;
        
        // التحقق من القفل
        if (typeof checkAppLock === 'function') {
            checkAppLock();
        } else {
            // إذا ما فيه قفل، افتح الرئيسية
            if (typeof switchPage === 'function') {
                switchPage('dashboard');
            }
        }
        
        // فحص الإشعارات التلقائية
        if (typeof checkAutoNotifications === 'function') {
            checkAutoNotifications();
        }
        
        // فحص الإشعارات كل 5 دقائق
        setInterval(function() {
            if (typeof checkAutoNotifications === 'function') {
                checkAutoNotifications();
            }
        }, 300000);
        
    }, 300);
});

// ========== معالجة الأخطاء العامة ==========
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
});

// منع السحب للتحديث
document.addEventListener('touchmove', function(e) {
    if (e.target.closest('.main-content') && e.target.closest('.main-content').scrollTop <= 0) {
        // السماح بالسحب للتحديث فقط في الأعلى
    }
}, { passive: true });

console.log('✅ main.js loaded - LORVEN v' + APP_VERSION);