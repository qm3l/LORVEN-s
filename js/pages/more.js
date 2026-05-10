// ==================== more.js ====================
// صفحة المزيد - LORVEN SYS v3.0

function renderMorePage(container) {
    const lang = settings.language;
    
    const sections = [
        {
            title: { ar: 'إدارة', en: 'Management' },
            icon: 'fa-boxes',
            items: [
                { icon: 'fa-truck', color: '#5b8cc9', page: 'shipments', label: { ar: 'الشحنات', en: 'Shipments' }, desc: { ar: 'متابعة الطلبات', en: 'Track orders' } },
                { icon: 'fa-store', color: '#d4914a', page: 'suppliers', label: { ar: 'المعارض', en: 'Suppliers' }, desc: { ar: 'إدارة المعارض', en: 'Manage suppliers' } },
                { icon: 'fa-cube', color: '#7c5cbf', page: 'bundles', label: { ar: 'البوكسات', en: 'Boxes' }, desc: { ar: 'العروض المجمعة', en: 'Product bundles' } }
            ]
        },
        {
            title: { ar: 'مالية', en: 'Finance' },
            icon: 'fa-chart-line',
            items: [
                { icon: 'fa-money-bill-wave', color: '#e8919e', page: 'debts', label: { ar: 'الديون', en: 'Debts' }, desc: { ar: 'المبالغ المتبقية', en: 'Pending payments' } },
                { icon: 'fa-gift', color: '#c75b5b', page: 'loyalty', label: { ar: 'الولاء', en: 'Loyalty' }, desc: { ar: 'برنامج المكافآت', en: 'Rewards program' } }
            ]
        },
        {
            title: { ar: 'أدوات', en: 'Tools' },
            icon: 'fa-wrench',
            items: [
                { icon: 'fa-sticky-note', color: '#c8a84e', page: 'notes', label: { ar: 'الملاحظات', en: 'Notes' }, desc: { ar: 'أفكار وتذكيرات', en: 'Ideas & reminders' } },
                { icon: 'fa-cog', color: '#6b6560', page: 'settings', label: { ar: 'الإعدادات', en: 'Settings' }, desc: { ar: 'تخصيص التطبيق', en: 'Customize app' } }
            ]
        }
    ];
    
    let html = `
        <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 14px;">
            <i class="fas fa-ellipsis-h"></i> ${lang === 'en' ? 'More' : 'المزيد'}
        </h3>
    `;
    
    sections.forEach(section => {
        html += `
            <div style="margin-bottom: 16px;">
                <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px; padding: 0 4px;">
                    <i class="fas ${section.icon}" style="font-size: 12px; color: var(--text-soft);"></i>
                    <span style="font-size: 12px; font-weight: 700; color: var(--text-soft); text-transform: uppercase; letter-spacing: 0.5px;">${section.title[lang] || section.title.ar}</span>
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    ${section.items.map(item => `
                        <div class="stat-card" style="cursor: pointer; padding: 14px; display: flex; align-items: center; gap: 12px;" onclick="switchPage('${item.page}')">
                            <div style="width: 42px; height: 42px; background: ${item.color}15; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                                <i class="fas ${item.icon}" style="font-size: 18px; color: ${item.color};"></i>
                            </div>
                            <div style="flex: 1;">
                                <div style="font-weight: 600; font-size: 13px;">${item.label[lang] || item.label.ar}</div>
                                <div style="font-size: 10px; color: var(--text-soft);">${item.desc[lang] || item.desc.ar}</div>
                            </div>
                            <i class="fas fa-chevron-left" style="color: var(--text-soft); font-size: 10px;"></i>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    });
    
    html += '<div style="height: 90px;"></div>';
    container.innerHTML = html;
}