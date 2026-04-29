// ==================== import.js ====================
// استيراد البيانات - LORVEN SYS v3.0

let importFileData = null;

function openImportModal() {
    const lang = settings.language;
    importFileData = null;
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'importModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 380px;">
            <div class="modal-header">
                <div class="modal-title"><i class="fas fa-file-import"></i> ${lang === 'en' ? 'Import File' : 'استيراد ملف'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <p style="font-size: 11px; color: var(--text-soft); margin-bottom: 14px;">
                    ${lang === 'en' ? 'Upload a CSV or Excel file containing products or invoices.' : 'يمكنك رفع ملف CSV أو Excel يحتوي على المنتجات أو الفواتير.'}
                </p>
                
                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <select id="importType" class="form-control" style="flex: 2;">
                        <option value="products">${lang === 'en' ? 'Products' : 'منتجات'}</option>
                        <option value="invoices">${lang === 'en' ? 'Invoices' : 'فواتير'}</option>
                    </select>
                    <button class="btn btn-outline" style="flex: 1;" onclick="document.getElementById('importFileInput').click()">
                        <i class="fas fa-upload"></i> ${lang === 'en' ? 'Choose' : 'اختيار'}
                    </button>
                </div>
                
                <input type="file" id="importFileInput" accept=".csv,.xls,.xlsx,.tsv" style="display:none;" onchange="handleImportFile(event)">
                
                <div id="importPreview" style="background: var(--hover); border-radius: 12px; padding: 10px; max-height: 140px; overflow-y: auto; font-size: 10px; display: none;"></div>
                
                <div style="display: flex; gap: 8px; margin-top: 16px;">
                    <button class="btn btn-outline" style="flex: 1;" onclick="this.closest('.modal').remove()">
                        ${lang === 'en' ? 'Cancel' : 'إلغاء'}
                    </button>
                    <button class="btn btn-primary" style="flex: 1;" onclick="confirmImport()" id="confirmImportBtn" disabled>
                        ${lang === 'en' ? 'Import' : 'استيراد'}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function handleImportFile(event) {
    const lang = settings.language;
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const rows = text.split('\n').map(row => row.split(','));
        
        importFileData = rows;
        
        const previewDiv = document.getElementById('importPreview');
        const confirmBtn = document.getElementById('confirmImportBtn');
        
        if (rows.length > 0) {
            previewDiv.style.display = 'block';
            previewDiv.innerHTML = `
                <div style="font-weight: 600; margin-bottom: 6px;">
                    ${lang === 'en' ? 'Preview:' : 'معاينة:'} ${rows.length} ${lang === 'en' ? 'rows' : 'صف'}
                </div>
                ${rows.slice(0, 5).map(row => `
                    <div style="padding: 2px 0; border-bottom: 1px solid var(--border); font-family: monospace;">
                        ${row.slice(0, 5).map(c => escapeHTML(c || '')).join(' | ')}
                    </div>
                `).join('')}
                ${rows.length > 5 ? `<div style="padding: 4px; text-align: center; color: var(--text-soft);">...</div>` : ''}
            `;
            
            if (confirmBtn) confirmBtn.disabled = false;
        }
    };
    reader.readAsText(file);
}

function confirmImport() {
    const lang = settings.language;
    
    if (!importFileData || importFileData.length < 2) {
        showToast(lang === 'en' ? '❌ File is empty or invalid' : '❌ الملف فارغ أو غير صحيح');
        return;
    }
    
    const type = document.getElementById('importType').value;
    const rows = importFileData.slice(1).filter(r => r.length > 0 && r.some(c => c && c.toString().trim() !== ''));
    
    if (type === 'products') {
        importProducts(rows);
    } else {
        importInvoices(rows);
    }
    
    const modal = document.getElementById('importModal');
    if (modal) modal.remove();
    importFileData = null;
}

function importProducts(rows) {
    const lang = settings.language;
    let added = 0;
    let skipped = 0;
    let errors = [];
    
    rows.forEach((row, index) => {
        try {
            const name = (row[0] || '').toString().trim();
            const price = parseFloat(row[1]) || 0;
            const category = (row[2] || '').toString().trim() || (lang === 'en' ? 'General' : 'منتجات عامة');
            
            if (!name) {
                skipped++;
                errors.push(`${lang === 'en' ? 'Row' : 'الصف'} ${index + 2}: ${lang === 'en' ? 'Product name required' : 'اسم المنتج مطلوب'}`);
                return;
            }
            
            if (price <= 0) {
                skipped++;
                errors.push(`${lang === 'en' ? 'Row' : 'الصف'} ${index + 2}: ${lang === 'en' ? 'Price must be greater than 0' : 'السعر يجب أن يكون أكبر من 0'}`);
                return;
            }
            
            // إضافة للـ wishlist
            const exists = wishlist.find(w => w.name.toLowerCase() === name.toLowerCase());
            if (!exists) {
                wishlist.push({
                    id: 'W-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
                    name: name,
                    price: price,
                    category: category,
                    addedDate: new Date().toISOString()
                });
                added++;
            } else {
                skipped++;
            }
        } catch (error) {
            errors.push(`${lang === 'en' ? 'Row' : 'الصف'} ${index + 2}: ${lang === 'en' ? 'Read error' : 'خطأ في القراءة'}`);
        }
    });
    
    if (added > 0) {
        saveWishlist();
    }
    
    let message = `✅ ${lang === 'en' ? 'Imported' : 'تم استيراد'} ${added} ${lang === 'en' ? 'products' : 'منتج'}`;
    if (skipped > 0) message += `، ${lang === 'en' ? 'skipped' : 'تم تخطي'} ${skipped}`;
    showToast(message);
    
    if (errors.length > 0) {
        console.warn('Import errors:', errors);
    }
}

function importInvoices(rows) {
    const lang = settings.language;
    let added = 0;
    let skipped = 0;
    let errors = [];
    
    rows.forEach((row, index) => {
        try {
            const customerName = (row[0] || '').toString().trim() || (lang === 'en' ? 'Customer' : 'عميلة');
            const customerPhone = (row[1] || '').toString().trim();
            const total = parseFloat(row[2]) || 0;
            const dateStr = (row[3] || '').toString().trim();
            
            if (!customerPhone) {
                skipped++;
                return;
            }
            
            if (total <= 0) {
                skipped++;
                return;
            }
            
            let invoiceDate = new Date().toISOString();
            if (dateStr) {
                const parsed = new Date(dateStr);
                if (!isNaN(parsed.getTime())) {
                    invoiceDate = parsed.toISOString();
                }
            }
            
            const invoice = {
                id: generateInvoiceId(),
                date: invoiceDate,
                customerName: customerName,
                customerPhone: customerPhone,
                items: [],
                subtotal: total,
                delivery: 0,
                total: total,
                profit: 0,
                paidAmount: 0,
                remainingAmount: total,
                paymentStatus: 'unpaid',
                deliveryStatus: 'not_shipped',
                shipmentId: '',
                notes: '',
                whatsappSent: false
            };
            
            invoices.push(invoice);
            added++;
        } catch (error) {
            errors.push(`${lang === 'en' ? 'Row' : 'الصف'} ${index + 2}: ${lang === 'en' ? 'Read error' : 'خطأ في القراءة'}`);
        }
    });
    
    if (added > 0) {
        saveInvoices();
        updateCustomersFromInvoices();
    }
    
    let message = `✅ ${lang === 'en' ? 'Imported' : 'تم استيراد'} ${added} ${lang === 'en' ? 'invoices' : 'فاتورة'}`;
    if (skipped > 0) message += `، ${lang === 'en' ? 'skipped' : 'تم تخطي'} ${skipped}`;
    showToast(message);
    
    if (currentPage === 'dashboard') {
        switchPage('dashboard');
    }
}

console.log('✅ import.js loaded');