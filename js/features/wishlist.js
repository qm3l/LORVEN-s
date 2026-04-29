// ==================== wishlist.js ====================
// قائمة منتجات ودي أوفرها - LORVEN SYS v3.0

function openWishlistModal() {
    const lang = settings.language;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'wishlistModal';
    modal.style.display = 'flex';

    let wishlistHTML = '';
    
    if (wishlist.length === 0) {
        wishlistHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-soft);">
                <i class="fas fa-lightbulb" style="font-size: 48px; margin-bottom: 12px; opacity: 0.3;"></i>
                <p>${lang === 'en' ? 'No products in wishlist' : 'لا توجد منتجات في القائمة'}</p>
            </div>
        `;
    } else {
        wishlistHTML = wishlist.map(w => `
            <div style="padding: 12px; border-bottom: 1px solid var(--border); display: flex; align-items: center; gap: 10px;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; font-size: 12px;">${escapeHTML(w.name)}</div>
                    <div style="font-size: 10px; color: var(--text-soft);">${formatCurrency(w.price)} · ${w.category || ''}</div>
                </div>
                <button class="btn btn-outline" style="padding: 6px 10px; font-size: 10px;" onclick="deleteWishlistItem('${w.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
    }
    
    modal.innerHTML = `
<div class="modal-content bottom-sheet-content" style="max-width: 400px;"> 
   <div class="modal-header">
                <div class="modal-title">
                    <i class="fas fa-lightbulb"></i> 
                    ${lang === 'en' ? 'Products to Order' : 'منتجات ودي أوفرها'}
                    <span style="font-size: 11px; color: var(--text-soft);">(${wishlist.length})</span>
                </div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <input type="text" class="form-control" id="newWishlistName" placeholder="${lang === 'en' ? 'Product name' : 'اسم المنتج'}" style="flex: 2;">
                    <input type="number" class="form-control" id="newWishlistPrice" placeholder="${lang === 'en' ? 'Price' : 'السعر'}" style="flex: 1;" inputmode="numeric">
                    <button class="btn btn-primary" style="padding: 10px;" onclick="addWishlistItem()">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                
                <div style="max-height: 300px; overflow-y: auto;">
                    ${wishlistHTML}
                </div>
                
                ${wishlist.length > 0 ? `
                    <div style="display: flex; gap: 6px; margin-top: 12px;">
                        <button class="btn btn-outline" style="flex: 1; font-size: 11px;" onclick="shareWishlist()">
                            <i class="fas fa-share-alt"></i> ${lang === 'en' ? 'Share' : 'مشاركة'}
                        </button>
                        <button class="btn btn-outline" style="flex: 1; font-size: 11px; color: var(--red);" onclick="clearWishlist()">
                            <i class="fas fa-trash"></i> ${lang === 'en' ? 'Clear All' : 'مسح الكل'}
                        </button>
                    </div>
                ` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function addWishlistItem() {
    const lang = settings.language;
    const nameInput = document.getElementById('newWishlistName');
    const priceInput = document.getElementById('newWishlistPrice');
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value) || 0;
    
    if (!name) {
        showToast(t('fillFields'));
        return;
    }
    
    wishlist.push({
        id: 'W-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        name: name,
        price: price,
        category: '',
        addedDate: new Date().toISOString()
    });
    
    saveWishlist();
    
    // تحديث المودال مباشرة بدون إغلاقه
    const modal = document.getElementById('wishlistModal');
    if (modal) modal.remove();
    openWishlistModal();
    
    showToast(t('wishlistAdded'));
}

function deleteWishlistItem(id) {
    wishlist = wishlist.filter(w => w.id !== id);
    saveWishlist();
    
    const modal = document.getElementById('wishlistModal');
    if (modal) modal.remove();
    openWishlistModal();
    
    showToast(t('deleted'));
}

function clearWishlist() {
    const lang = settings.language;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 360px; text-align: center;">
            <div class="modal-header">
                <div class="modal-title">${lang === 'en' ? 'Clear Wishlist' : 'مسح القائمة'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <i class="fas fa-trash" style="font-size: 40px; color: var(--red); margin-bottom: 12px;"></i>
                <p style="font-size: 14px; margin-bottom: 20px;">${lang === 'en' ? 'Clear all wishlist?' : 'مسح كل القائمة؟'}</p>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-outline" style="flex: 1; color: var(--red); border-color: var(--red);" id="confirmClearWishlistBtn">
                        ${lang === 'en' ? 'Clear' : 'مسح'}
                    </button>
                    <button class="btn btn-primary" style="flex: 1;" onclick="this.closest('.modal').remove()">
                        ${lang === 'en' ? 'Cancel' : 'إلغاء'}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('confirmClearWishlistBtn').onclick = function() {
        wishlist = [];
        saveWishlist();
        this.closest('.modal').remove();
        
        const wModal = document.getElementById('wishlistModal');
        if (wModal) wModal.remove();
        openWishlistModal();
        
        showToast(t('dataCleared'));
    };
}

function shareWishlist() {
    const lang = settings.language;
    
    let text = lang === 'en' ? 'Products to order:\n\n' : 'منتجات ودي أوفرها:\n\n';
    wishlist.forEach((w, idx) => {
        text += `${idx + 1}. ${w.name}`;
        if (w.price > 0) text += ` - ${formatCurrency(w.price)}`;
        text += '\n';
    });
    
    if (navigator.share) {
        navigator.share({
            title: lang === 'en' ? 'Products Wishlist' : 'قائمة منتجات',
            text: text
        }).catch(() => {});
    } else {
        copyToClipboard(text);
    }
}

console.log('✅ wishlist.js loaded');