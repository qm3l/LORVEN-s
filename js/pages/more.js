// ==================== more.js ====================
// صفحة المزيد - LORVEN SYS v3.0

function renderMorePage(container) {
    const lang = settings.language;
    
    const items = [
        { icon: 'fa-truck', color: '#5b8cc9', page: 'shipments', label: { ar: 'الشحنات', en: 'Shipments' } },
        { icon: 'fa-store', color: '#d4914a', page: 'suppliers', label: { ar: 'المعارض', en: 'Suppliers' } },
        { icon: 'fa-cube', color: '#7c5cbf', page: 'bundles', label: { ar: 'البوكسات', en: 'Boxes' } },
        { icon: 'fa-sticky-note', color: '#c8a84e', page: 'notes', label: { ar: 'الملاحظات', en: 'Notes' } },
        { icon: 'fa-money-bill-wave', color: '#e8919e', page: 'debts', label: { ar: 'الديون', en: 'Debts' } },
        { icon: 'fa-gift', color: '#c75b5b', page: 'loyalty', label: { ar: 'الولاء', en: 'Loyalty' } },
        { icon: 'fa-cog', color: '#6b6560', page: 'settings', label: { ar: 'الإعدادات', en: 'Settings' } }
    ];
    
    let html = `
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px;">
            <i class="fas fa-ellipsis-h"></i> ${lang === 'en' ? 'More' : 'المزيد'}
        </h3>
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
            ${items.map(item => `
                <div class="stat-card" style="text-align: center; cursor: pointer; padding: 20px 14px;" onclick="switchPage('${item.page}')">
                    <div style="width: 50px; height: 50px; background: ${item.color}15; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px;">
                        <i class="fas ${item.icon}" style="font-size: 22px; color: ${item.color};"></i>
                    </div>
                    <div style="font-weight: 700; font-size: 13px;">${item.label[lang] || item.label.ar}</div>
                </div>
            `).join('')}
        </div>
        <div style="height: 90px;"></div>
    `;
    
    container.innerHTML = html;
}