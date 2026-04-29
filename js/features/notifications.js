// ==================== notifications.js ====================
// نظام الإشعارات - LORVEN SYS v3.0

function addNotification(type, title, message, relatedId = null) {
    const lang = settings.language;
    
    const notification = {
        id: 'N-' + Date.now() + '-' + Math.random().toString(36).substring(2, 5),
        type: type,
        title: title,
        message: message,
        relatedId: relatedId,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    notifications.unshift(notification);
    
    try {
        localStorage.setItem('lorvenNotifications', JSON.stringify(notifications));
    } catch (e) {}
    
    updateNotificationBadge();
    
    return notification;
}

function markNotificationAsRead(notificationId) {
    const notif = notifications.find(n => n.id === notificationId);
    if (notif) {
        notif.read = true;
        try {
            localStorage.setItem('lorvenNotifications', JSON.stringify(notifications));
        } catch (e) {}
        updateNotificationBadge();
    }
}

function markAllNotificationsAsRead() {
    notifications.forEach(n => n.read = true);
    try {
        localStorage.setItem('lorvenNotifications', JSON.stringify(notifications));
    } catch (e) {}
    updateNotificationBadge();
    
    if (currentPage === 'notifications') {
        renderNotificationsPage(document.getElementById('mainContent'));
    }
}

function deleteNotification(notificationId) {
    notifications = notifications.filter(n => n.id !== notificationId);
    try {
        localStorage.setItem('lorvenNotifications', JSON.stringify(notifications));
    } catch (e) {}
    updateNotificationBadge();
}

function clearAllNotifications() {
    const lang = settings.language;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 360px; text-align: center;">
            <div class="modal-header">
                <div class="modal-title">${lang === 'en' ? 'Clear Notifications' : 'مسح الإشعارات'}</div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <i class="fas fa-bell-slash" style="font-size: 40px; color: var(--orange); margin-bottom: 12px;"></i>
                <p style="font-size: 14px; margin-bottom: 20px;">${lang === 'en' ? 'Clear all notifications?' : 'مسح كل الإشعارات؟'}</p>
                <div style="display: flex; gap: 8px;">
                <button class="btn btn-primary" style="flex: 1;" onclick="this.closest('.modal').remove()">
                        ${lang === 'en' ? 'Cancel' : 'إلغاء'}
                    </button>
                    <button class="btn btn-outline" style="flex: 1; color: var(--red); border-color: var(--red);" id="confirmClearBtn">
                        ${lang === 'en' ? 'Clear' : 'مسح'}
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    document.getElementById('confirmClearBtn').onclick = function() {
        notifications = [];
        saveNotifications();
        updateNotificationBadge();
        this.closest('.modal').remove();
        
        if (currentPage === 'notifications') {
            renderNotificationsPage(document.getElementById('mainContent'));
        }
        
        showToast(lang === 'en' ? 'Notifications cleared' : 'تم مسح الإشعارات');
    };
}

function getUnreadNotificationsCount() {
    return notifications.filter(n => !n.read).length;
}

function updateNotificationBadge() {
    const badge = document.querySelector('.badge-count');
    const count = getUnreadNotificationsCount();
    
    if (badge) {
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

function getNotificationIcon(type) {
    const icons = {
        invoice: 'fa-receipt',
        shipment: 'fa-box',
        customer: 'fa-user',
        payment: 'fa-money-bill',
        system: 'fa-bell',
        wishlist: 'fa-lightbulb',
        supplier: 'fa-store'
    };
    return icons[type] || 'fa-bell';
}

function getNotificationColor(type) {
    const colors = {
        invoice: { bg: 'rgba(91, 140, 201, 0.1)', icon: 'var(--blue)' },
        shipment: { bg: 'rgba(124, 92, 191, 0.1)', icon: 'var(--purple)' },
        customer: { bg: 'rgba(200, 168, 78, 0.1)', icon: 'var(--gold)' },
        payment: { bg: 'rgba(212, 145, 74, 0.1)', icon: 'var(--orange)' },
        system: { bg: 'rgba(138, 128, 120, 0.1)', icon: 'var(--text-soft)' },
        wishlist: { bg: 'rgba(232, 145, 158, 0.1)', icon: 'var(--pink)' },
        supplier: { bg: 'rgba(107, 158, 122, 0.1)', icon: 'var(--green)' }
    };
    return colors[type] || { bg: 'rgba(138, 128, 120, 0.1)', icon: 'var(--text-soft)' };
}

function renderNotificationsPage(container) {
    const lang = settings.language === 'en' ? 'en' : 'ar';
    
    let html = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
            <h3 style="font-size: 18px; font-weight: 700;">
                <i class="fas fa-bell"></i> ${i18n[lang].notifications || (lang === 'en' ? 'Notifications' : 'الإشعارات')}
            </h3>
            <div style="display: flex; gap: 6px;">
                ${notifications.length > 0 ? `
                    <button class="btn btn-outline" style="padding: 6px 10px; font-size: 10px;" onclick="markAllNotificationsAsRead()">
                        <i class="fas fa-check-double"></i> ${lang === 'en' ? 'Read All' : 'الكل مقروء'}
                    </button>
                    <button class="btn btn-outline" style="padding: 6px 10px; font-size: 10px; color: var(--red);" onclick="clearAllNotifications()">
                        <i class="fas fa-trash"></i>
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    if (notifications.length === 0) {
        html += `
            <div style="text-align: center; padding: 40px; color: var(--text-soft);">
                <i class="fas fa-bell-slash" style="font-size: 48px; margin-bottom: 12px;"></i>
                <p>${lang === 'en' ? 'No notifications' : 'لا توجد إشعارات'}</p>
            </div>
        `;
        container.innerHTML = html;
        return;
    }
    
    notifications.forEach(notif => {
        const colors = getNotificationColor(notif.type);
        const icon = getNotificationIcon(notif.type);
        
        html += `
            <div class="notification-item" onclick="markNotificationAsRead('${notif.id}'); ${notif.relatedId && notif.type === 'invoice' ? `viewInvoiceDetails('${notif.relatedId}')` : ''}" 
                 style="background: var(--card); border-radius: 16px; padding: 12px; margin-bottom: 8px; 
                        border: 1px solid var(--border); cursor: pointer; 
                        ${!notif.read ? 'border-right: 3px solid var(--text);' : ''}">
                <div style="display: flex; gap: 10px;">
                    <div style="width: 38px; height: 38px; background: ${colors.bg}; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: ${colors.icon};">
                        <i class="fas ${icon}"></i>
                    </div>
                    <div style="flex: 1;">
                        <div style="display: flex; justify-content: space-between;">
                            <span style="font-weight: 700; font-size: 12px;">${notif.title}</span>
                            <span style="font-size: 9px; color: var(--text-soft);">${getTimeAgo(notif.timestamp)}</span>
                        </div>
                        <p style="font-size: 11px; color: var(--text-soft); margin-top: 2px;">${notif.message}</p>
                    </div>
                    ${!notif.read ? '<div style="width: 8px; height: 8px; border-radius: 50%; background: var(--pink); align-self: center;"></div>' : ''}
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// فحص الإشعارات التلقائية
function checkAutoNotifications() {
    const lang = settings.language;
    const now = new Date();
    
    // فحص الفواتير غير المرسلة
    if (settings.notifyInvoiceNotSent) {
        const unsentInvoices = invoices.filter(inv => {
            const daysSinceCreation = Math.floor((now - new Date(inv.date)) / 86400000);
            return !inv.whatsappSent && daysSinceCreation >= settings.notifyInvoiceNotSentDays;
        });
        
        unsentInvoices.forEach(inv => {
            const exists = notifications.find(n => n.type === 'invoice' && n.relatedId === inv.id && n.title.includes('غير مرسلة'));
            if (!exists) {
                addNotification(
                    'invoice',
                    lang === 'en' ? 'Invoice not sent' : 'فاتورة غير مرسلة',
                    `${inv.id} - ${inv.customerName || ''}`,
                    inv.id
                );
            }
        });
    }
    
    // فحص الشحنات
    shipments.forEach(s => {
        if (s.status === 'in_transit' && s.expectedArrival && settings.notifyShipmentArrived) {
            const daysRemaining = getDaysRemaining(s.expectedArrival);
            
            if (daysRemaining !== null && daysRemaining <= 0 && s.status !== 'arrived') {
                const exists = notifications.find(n => n.type === 'shipment' && n.relatedId === s.id && n.title.includes('وصلت'));
                if (!exists) {
                    addNotification(
                        'shipment',
                        lang === 'en' ? 'Shipment arrived!' : 'شحنة وصلت!',
                        `${s.id} - ${s.itemCount || 0} ${lang === 'en' ? 'items' : 'منتج'}`,
                        s.id
                    );
                }
            }
            
            if (daysRemaining !== null && daysRemaining <= settings.shipmentAlertBefore && daysRemaining > 0 && settings.notifyShipmentBefore) {
                const exists = notifications.find(n => n.type === 'shipment' && n.relatedId === s.id && n.title.includes('قربت'));
                if (!exists) {
                    addNotification(
                        'shipment',
                        lang === 'en' ? 'Shipment arriving soon' : 'شحنة قربت توصل',
                        `${s.id} - ${lang === 'en' ? 'in' : 'خلال'} ${daysRemaining} ${lang === 'en' ? 'days' : 'أيام'}`,
                        s.id
                    );
                }
            }
        }
        
        if (s.expectedArrival && settings.notifyShipmentDelayed && s.status !== 'arrived' && s.status !== 'delivered') {
            const daysDelayed = getDaysDelayed(s.expectedArrival);
            if (daysDelayed > 0) {
                const exists = notifications.find(n => n.type === 'shipment' && n.relatedId === s.id && n.title.includes('تأخرت'));
                if (!exists) {
                    addNotification(
                        'shipment',
                        lang === 'en' ? 'Shipment delayed' : 'شحنة تأخرت',
                        `${s.id} - ${daysDelayed} ${lang === 'en' ? 'days late' : 'أيام تأخير'}`,
                        s.id
                    );
                }
            }
        }
    });
    
    // تذكير قائمة المنتجات
    if (settings.notifyWishlistReminder && wishlist.length > 0) {
        const lastWishlistReminder = notifications.find(n => n.type === 'wishlist');
        const daysSinceLastReminder = lastWishlistReminder ? 
            Math.floor((now - new Date(lastWishlistReminder.timestamp)) / 86400000) : 999;
        
        if (daysSinceLastReminder >= 7) {
            addNotification(
                'wishlist',
                lang === 'en' ? 'Products to order' : 'منتجات ودي أوفرها',
                `${wishlist.length} ${lang === 'en' ? 'products in wishlist' : 'منتجات في القائمة'}`,
                null
            );
        }
    }
    
    updateNotificationBadge();
}

// تحديث العداد عند التحميل
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(updateNotificationBadge, 500);
});
console.log('✅ notifications.js loaded');