// ==================== backup.js ====================
// النسخ الاحتياطي - LORVEN SYS v3.0

function restoreFromCloud() {
    var lang = settings.language;
    var db = firebase.firestore();
    
    db.collection('backups').orderBy('date', 'desc').limit(5).get().then(function(snap) {
        if (snap.empty) {
            showToast(lang === 'en' ? 'No backups found' : 'لا توجد نسخ احتياطية');
            return;
        }
        
        var html = snap.docs.map(function(doc) {
            return '<button class="option-btn" onclick="confirmCloudRestore(\'' + doc.id + '\')">' + doc.id + '</button>';
        }).join('');
        
        var modal = document.createElement('div');
        modal.className = 'modal bottom-sheet';
        modal.style.display = 'flex';
        modal.innerHTML = '<div class="modal-content bottom-sheet-content"><div class="modal-header"><div class="modal-title"><i class="fas fa-cloud-download-alt"></i> ' + (lang === 'en' ? 'Select Backup' : 'اختر نسخة') + '</div></div><div class="modal-body">' + html + '</div></div>';
        document.body.appendChild(modal);
    });
}

function confirmCloudRestore(docId) {
    var lang = settings.language;
    var db = firebase.firestore();
    
    db.collection('backups').doc(docId).get().then(function(doc) {
        if (doc.exists) {
            var encrypted = doc.data().data;
            var decrypted = decodeURIComponent(escape(atob(encrypted)));
            var data = JSON.parse(decrypted);
            
            if (data.invoices) invoices = data.invoices;
            if (data.customers) customers = data.customers;
            if (data.shipments) shipments = data.shipments;
            if (data.settings) Object.assign(settings, data.settings);
            
            saveAllData();
            document.querySelectorAll('.modal').forEach(function(m) { m.remove(); });
            showToast(lang === 'en' ? 'Restored!' : 'تمت الاستعادة!');
            if (typeof switchPage === 'function') switchPage('dashboard');
        }
    });
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
                ${settings.lastBackupDate ? `
                    <p style="font-size: 11px; color: var(--text-soft); margin-bottom: 12px;">
                        ${lang === 'en' ? 'Last backup:' : 'آخر نسخة:'} ${new Date(settings.lastBackupDate).toLocaleDateString()}
                    </p>
                ` : ''}
                <p style="font-size: 13px; margin-bottom: 20px;">${lang === 'en' ? 'Export or restore your data' : 'تصدير أو استعادة بياناتك'}</p>
                
                <button class="option-btn" id="exportBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Export All Data' : 'تصدير كل البيانات'}</span>
                    <i class="fas fa-upload" style="color: var(--text-soft);"></i>
                </button>
                <button class="option-btn" id="importBtn">
                    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Import Data' : 'استيراد البيانات'}</span>
                    <i class="fas fa-download" style="color: var(--text-soft);"></i>
                </button>
                <button class="option-btn" id="restoreCloudBtn">
    <span style="flex: 1; text-align: right;">${lang === 'en' ? 'Restore from Cloud' : 'استعادة من السحابة'}</span>
    <i class="fas fa-cloud-download-alt" style="color: var(--text-soft);"></i>
</button>
                
                <input type="file" id="importFileInput" accept=".json" style="display: none;">
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
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
        
        settings.lastBackupDate = new Date().toISOString();
        saveSettings();
        
const encrypted = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
const blob = new Blob([encrypted], { type: 'text/plain' });

const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lorven_backup_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        modal.remove();
        showToast(lang === 'en' ? 'Backup downloaded' : 'تم تحميل النسخة الاحتياطية');
        playSound('success');
    });
    
    document.getElementById('importBtn').addEventListener('click', function() {
        document.getElementById('importFileInput').click();
    });
    
   document.getElementById('restoreCloudBtn').addEventListener('click', restoreFromCloud);
 document.getElementById('importFileInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = function(event) {
            try {
const raw = event.target.result;
const decrypted = decodeURIComponent(escape(atob(raw)));
const data = JSON.parse(decrypted);                
                if (!data.version) throw new Error('Invalid backup file');
                
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
                    showToast(lang === 'en' ? 'Data imported' : 'تم استيراد البيانات');
                    playSound('success');
                    if (typeof switchPage === 'function') switchPage('dashboard');
                });
                
            } catch (error) {
                showToast(lang === 'en' ? 'Invalid backup file' : 'ملف نسخة غير صالح');
            }
        };
        reader.readAsText(file);
    });
}

function exportBackup() {
    const lang = settings.language;
    
    const data = {
        version: APP_VERSION,
        exportDate: new Date().toISOString(),
        settings: settings,
        invoices: invoices,
        customers: customers,
        shipments: shipments,
        suppliers: suppliers,
        bundles: bundles,
        wishlist: wishlist
    };
    
const encrypted = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
const blob = new Blob([encrypted], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lorven_backup_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    settings.lastBackupDate = new Date().toISOString();
    saveSettings();
    
    document.getElementById('backupModal')?.remove();
    showToast(t('backupExported'));
}

function importBackup(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
const raw = e.target.result;
const decrypted = decodeURIComponent(escape(atob(raw)));
const data = JSON.parse(decrypted);            
            if (data.settings) {
                const savedLang = settings.language;
                const savedDark = settings.darkMode;
                settings = { ...settings, ...data.settings };
                settings.language = savedLang;
                settings.darkMode = savedDark;
                saveSettings();
            }
            
            if (data.invoices) { invoices = data.invoices; saveInvoices(); }
            if (data.customers) { customers = data.customers; saveCustomers(); }
            if (data.shipments) { shipments = data.shipments; saveShipments(); }
            if (data.suppliers) { suppliers = data.suppliers; saveSuppliers(); }
            if (data.bundles) { bundles = data.bundles; saveBundles(); }
            if (data.wishlist) { wishlist = data.wishlist; saveWishlist(); }
            
            updateCustomersFromInvoices();
            
            document.getElementById('backupModal')?.remove();
            showToast(t('backupImported'));
            
            if (typeof applySettings === 'function') applySettings();
            switchPage('dashboard');
            
        } catch (error) {
            showToast(t('error'));
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function autoBackup() {
    const lastBackup = settings.lastBackupDate;
    const now = new Date().toISOString();
    
    if (!lastBackup || (new Date() - new Date(lastBackup)) > 259200000) {
        settings.lastBackupDate = now;
        saveSettings();
        uploadBackupToCloud();

        const data = {
            version: APP_VERSION,
            exportDate: now,
            settings: settings,
            invoices: invoices,
            customers: customers,
            shipments: shipments,
            suppliers: suppliers,
            bundles: bundles,
            wishlist: wishlist,
            notes: notes,
            notifications: notifications,
            loyaltyCodes: loyaltyCodes
        };
        
const encrypted = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
const blob = new Blob([encrypted], { type: 'text/plain' });
const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lorven_auto_${new Date().toISOString().slice(0,10)}.json`;
        a.click();
    }
}

// فحص أول ما يفتح التطبيق
function checkAutoBackup() {
    const lastBackup = settings.lastBackupDate;
    const daysSince = lastBackup ? Math.floor((new Date() - new Date(lastBackup)) / 259200000) : 999;
    
    if (daysSince >= 1) {
        autoBackup();
    }
}

// فحص كل ساعة
setInterval(autoBackup, 3600000);

// فحص عند الفتح (بعد 5 ثواني عشان البيانات تحملت)
setTimeout(checkAutoBackup, 5000);

function uploadBackupToCloud() {
    try {
        var db = firebase.firestore();
        var data = {
            version: APP_VERSION,
            date: new Date().toISOString(),
            invoices: invoices,
            customers: customers,
            shipments: shipments,
            settings: settings
        };
        var encrypted = btoa(unescape(encodeURIComponent(JSON.stringify(data))));
        db.collection('backups').doc(new Date().toISOString().slice(0,10)).set({
            data: encrypted,
            date: new Date().toISOString()
        });
        console.log('✅ Cloud backup done');
    } catch (e) {
        console.warn('Cloud backup failed:', e.message);
    }
}

console.log('✅ backup.js loaded');
