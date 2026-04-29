// ==================== backup.js ====================
// النسخ الاحتياطي - LORVEN SYS v3.0

function openBackupModal() {
    const lang = settings.language;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'backupModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 360px;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-cloud-upload-alt"></i> ${lang === 'en' ? 'Backup' : 'النسخ الاحتياطي'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body" style="text-align: center;">
                <i class="fas fa-database" style="font-size: 48px; color: var(--text); margin-bottom: 16px;"></i>
                
                ${settings.lastBackupDate ? `
                    <p style="font-size: 11px; color: var(--text-soft); margin-bottom: 16px;">
                        ${lang === 'en' ? 'Last backup:' : 'آخر نسخة:'} ${formatDateTime(settings.lastBackupDate)}
                    </p>
                ` : ''}
                
                <button class="btn btn-primary" style="width:100%; margin-bottom: 8px;" onclick="exportBackup()">
                    <i class="fas fa-download"></i> ${lang === 'en' ? 'Export Backup' : 'تصدير نسخة'}
                </button>
                
                <button class="btn btn-outline" style="width:100%; margin-bottom: 8px;" onclick="document.getElementById('backupFileInput').click()">
                    <i class="fas fa-upload"></i> ${lang === 'en' ? 'Import Backup' : 'استيراد نسخة'}
                </button>
                
                <input type="file" id="backupFileInput" accept=".json" style="display:none;" onchange="importBackup(event)">
            </div>
        </div>
    `;
    document.body.appendChild(modal);
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
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
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
            const data = JSON.parse(e.target.result);
            
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