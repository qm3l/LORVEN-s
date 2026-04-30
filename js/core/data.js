// ==================== data.js ====================
// قاعدة بيانات SQLite - LORVEN SYS v3.0

let DB;

// ========== بدء قاعدة البيانات ==========
async function initDatabase() {
    if (DB) return DB;
    
    try {
        const SQL = await initSqlJs({
            locateFile: file => `js/lib/${file}`
        });
        
        DB = new SQL.Database();
        
        // إنشاء الجداول
        DB.run(`
            CREATE TABLE IF NOT EXISTS settings (
                key TEXT PRIMARY KEY,
                value TEXT
            );
            
            CREATE TABLE IF NOT EXISTS invoices (
                id TEXT PRIMARY KEY,
                date TEXT,
                customerName TEXT,
                customerPhone TEXT,
                customerId TEXT,
                items TEXT,
                subtotal REAL,
                delivery REAL,
                total REAL,
                profit REAL DEFAULT 0,
                paidAmount REAL DEFAULT 0,
                remainingAmount REAL DEFAULT 0,
                paymentStatus TEXT DEFAULT 'unpaid',
                deliveryStatus TEXT DEFAULT 'not_delivered',
                shipmentId TEXT,
                notes TEXT,
                currency TEXT,
                whatsappSent INTEGER DEFAULT 0,
                discountCode TEXT DEFAULT '',
                discountAmount REAL DEFAULT 0,
                discountOwnerName TEXT DEFAULT ''
            );
            
            CREATE TABLE IF NOT EXISTS customers (
                id TEXT PRIMARY KEY,
                name TEXT,
                phone TEXT,
                notes TEXT,
                purchaseCount INTEGER DEFAULT 0,
                totalSpent REAL DEFAULT 0,
                totalPaid REAL DEFAULT 0,
                totalRemaining REAL DEFAULT 0,
                lastPurchase TEXT,
                tier TEXT DEFAULT 'normal',
                totalLoyaltyPoints REAL DEFAULT 0,
                pendingLoyaltyPoints REAL DEFAULT 0,
                createdAt TEXT
            );
            
            CREATE TABLE IF NOT EXISTS shipments (
                id TEXT PRIMARY KEY,
                status TEXT DEFAULT 'open',
                orderCount INTEGER DEFAULT 0,
                maxItems INTEGER DEFAULT 20,
                supplierName TEXT,
                expectedArrival TEXT,
                closedAt TEXT,
                createdAt TEXT
            );
            
            CREATE TABLE IF NOT EXISTS suppliers (
                id TEXT PRIMARY KEY,
                name TEXT,
                phone TEXT,
                notes TEXT,
                totalItems INTEGER DEFAULT 0,
                createdAt TEXT
            );
            
            CREATE TABLE IF NOT EXISTS bundles (
                id TEXT PRIMARY KEY,
                name TEXT,
                items TEXT,
                totalPrice REAL DEFAULT 0,
                salesCount INTEGER DEFAULT 0,
                createdAt TEXT
            );
            
            CREATE TABLE IF NOT EXISTS wishlist (
                id TEXT PRIMARY KEY,
                name TEXT,
                price REAL DEFAULT 0,
                category TEXT,
                addedDate TEXT
            );
            
            CREATE TABLE IF NOT EXISTS notifications (
                id TEXT PRIMARY KEY,
                type TEXT,
                title TEXT,
                message TEXT,
                refId TEXT,
                read INTEGER DEFAULT 0,
                createdAt TEXT
            );
            
            CREATE TABLE IF NOT EXISTS loyaltyCodes (
                id TEXT PRIMARY KEY,
                code TEXT,
                customerId TEXT,
                customerName TEXT,
                tier TEXT,
                discount REAL DEFAULT 10,
                minOrder REAL DEFAULT 100,
                maxUses INTEGER DEFAULT 5,
                usedCount INTEGER DEFAULT 0,
                pointsEarned REAL DEFAULT 0,
                totalPoints REAL DEFAULT 0,
                usedBy TEXT,
                createdAt TEXT,
                expiresAt TEXT,
                active INTEGER DEFAULT 1
            );
            
            CREATE TABLE IF NOT EXISTS notes (
                id TEXT PRIMARY KEY,
                title TEXT,
                content TEXT,
                color TEXT DEFAULT '#f5efe8',
                pinned INTEGER DEFAULT 0,
                createdAt TEXT,
                updatedAt TEXT
            );
        `);
        
        // حفظ على localStorage كنسخة احتياطية
        saveToLocalStorage();
        
        // تحميل من localStorage إذا موجود
        loadFromLocalStorage();
        
        return DB;
    } catch (e) {
        console.error('Database init error:', e);
        return null;
    }
}

// ========== حفظ واسترجاع ==========
function saveToLocalStorage() {
    if (!DB) return;
    try {
        const data = DB.export();
        const buffer = Array.from(data);
        localStorage.setItem('lorvenDatabase', JSON.stringify(buffer));
    } catch (e) {}
}

function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem('lorvenDatabase');
        if (stored) {
            const buffer = new Uint8Array(JSON.parse(stored));
            DB = new SQL.Database(buffer);
        }
    } catch (e) {}
}

// ========== دوال التحميل القديمة (متوافقة) ==========
function loadData() {
    loadSettings();
    loadInvoices();
    loadCustomers();
    loadShipments();
    loadSuppliers();
    loadBundles();
    loadWishlist();
    loadNotifications();
    loadLoyaltyCodes();
    loadNotes();
    updateCustomersFromInvoices();
}

// ========== إعدادات ==========
function loadSettings() {
    try {
        const result = DB.exec("SELECT * FROM settings");
        if (result.length > 0) {
            const rows = result[0].values;
            rows.forEach(([key, value]) => {
                try { settings[key] = JSON.parse(value); } catch (e) { settings[key] = value; }
            });
        }
    } catch (e) {}
}

function saveSettings() {
    try {
        DB.run("DELETE FROM settings");
        const stmt = DB.prepare("INSERT INTO settings (key, value) VALUES (?, ?)");
        Object.entries(settings).forEach(([key, value]) => {
            stmt.run([key, typeof value === 'object' ? JSON.stringify(value) : String(value)]);
        });
        stmt.free();
        saveToLocalStorage();
    } catch (e) {}
}

// ========== فواتير ==========
function loadInvoices() {
    try {
        const result = DB.exec("SELECT * FROM invoices ORDER BY date DESC");
        invoices = result.length > 0 ? result[0].values.map(row => ({
            id: row[0], date: row[1], customerName: row[2], customerPhone: row[3], customerId: row[4],
            items: JSON.parse(row[5] || '[]'), subtotal: row[6], delivery: row[7], total: row[8],
            profit: row[9], paidAmount: row[10], remainingAmount: row[11], paymentStatus: row[12],
            deliveryStatus: row[13], shipmentId: row[14], notes: row[15], currency: row[16],
            whatsappSent: row[17], discountCode: row[18], discountAmount: row[19], discountOwnerName: row[20]
        })) : [];
    } catch (e) { invoices = []; }
}

function saveInvoices() {
    try {
        DB.run("DELETE FROM invoices");
        const stmt = DB.prepare("INSERT INTO invoices VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        invoices.forEach(inv => {
            stmt.run([
                inv.id, inv.date, inv.customerName, inv.customerPhone, inv.customerId,
                JSON.stringify(inv.items || []), inv.subtotal, inv.delivery, inv.total,
                inv.profit || 0, inv.paidAmount || 0, inv.remainingAmount || 0,
                inv.paymentStatus || 'unpaid', inv.deliveryStatus || 'not_delivered',
                inv.shipmentId || '', inv.notes || '', inv.currency || 'ر.س',
                inv.whatsappSent ? 1 : 0, inv.discountCode || '', inv.discountAmount || 0, inv.discountOwnerName || ''
            ]);
        });
        stmt.free();
        saveToLocalStorage();
    } catch (e) {}
}

// ========== عملاء ==========
function loadCustomers() {
    try {
        const result = DB.exec("SELECT * FROM customers ORDER BY purchaseCount DESC");
        customers = result.length > 0 ? result[0].values.map(row => ({
            id: row[0], name: row[1], phone: row[2], notes: row[3], purchaseCount: row[4],
            totalSpent: row[5], totalPaid: row[6], totalRemaining: row[7], lastPurchase: row[8],
            tier: row[9], totalLoyaltyPoints: row[10], pendingLoyaltyPoints: row[11], createdAt: row[12]
        })) : [];
    } catch (e) { customers = []; }
}

function saveCustomers() {
    try {
        DB.run("DELETE FROM customers");
        const stmt = DB.prepare("INSERT INTO customers VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)");
        customers.forEach(c => {
            stmt.run([c.id, c.name, c.phone, c.notes || '', c.purchaseCount || 0,
                c.totalSpent || 0, c.totalPaid || 0, c.totalRemaining || 0,
                c.lastPurchase || null, c.tier || 'normal', c.totalLoyaltyPoints || 0,
                c.pendingLoyaltyPoints || 0, c.createdAt || new Date().toISOString()]);
        });
        stmt.free();
        saveToLocalStorage();
    } catch (e) {}
}

// ========== شحنات ==========
function loadShipments() {
    try {
        const result = DB.exec("SELECT * FROM shipments ORDER BY createdAt DESC");
        shipments = result.length > 0 ? result[0].values.map(row => ({
            id: row[0], status: row[1], orderCount: row[2], maxItems: row[3],
            supplierName: row[4], expectedArrival: row[5], closedAt: row[6], createdAt: row[7]
        })) : [];
    } catch (e) { shipments = []; }
}

function saveShipments() {
    try {
        DB.run("DELETE FROM shipments");
        const stmt = DB.prepare("INSERT INTO shipments VALUES (?,?,?,?,?,?,?,?)");
        shipments.forEach(s => {
            stmt.run([s.id, s.status || 'open', s.orderCount || 0, s.maxItems || 20,
                s.supplierName || '', s.expectedArrival || null, s.closedAt || null,
                s.createdAt || new Date().toISOString()]);
        });
        stmt.free();
        saveToLocalStorage();
    } catch (e) {}
}

// ========== موردين / معارض ==========
function loadSuppliers() {
    try {
        const result = DB.exec("SELECT * FROM suppliers ORDER BY totalItems DESC");
        suppliers = result.length > 0 ? result[0].values.map(row => ({
            id: row[0], name: row[1], phone: row[2], notes: row[3], totalItems: row[4], createdAt: row[5]
        })) : [];
    } catch (e) { suppliers = []; }
}

function saveSuppliers() {
    try {
        DB.run("DELETE FROM suppliers");
        const stmt = DB.prepare("INSERT INTO suppliers VALUES (?,?,?,?,?,?)");
        suppliers.forEach(s => {
            stmt.run([s.id, s.name, s.phone || '', s.notes || '', s.totalItems || 0,
                s.createdAt || new Date().toISOString()]);
        });
        stmt.free();
        saveToLocalStorage();
    } catch (e) {}
}

// ========== بوكسات ==========
function loadBundles() {
    try {
        const result = DB.exec("SELECT * FROM bundles ORDER BY salesCount DESC");
        bundles = result.length > 0 ? result[0].values.map(row => ({
            id: row[0], name: row[1], items: JSON.parse(row[2] || '[]'),
            totalPrice: row[3], salesCount: row[4], createdAt: row[5]
        })) : [];
    } catch (e) { bundles = []; }
}

function saveBundles() {
    try {
        DB.run("DELETE FROM bundles");
        const stmt = DB.prepare("INSERT INTO bundles VALUES (?,?,?,?,?,?)");
        bundles.forEach(b => {
            stmt.run([b.id, b.name, JSON.stringify(b.items || []), b.totalPrice || 0,
                b.salesCount || 0, b.createdAt || new Date().toISOString()]);
        });
        stmt.free();
        saveToLocalStorage();
    } catch (e) {}
}

// ========== قائمة الرغبات ==========
function loadWishlist() {
    try {
        const result = DB.exec("SELECT * FROM wishlist ORDER BY addedDate DESC");
        wishlist = result.length > 0 ? result[0].values.map(row => ({
            id: row[0], name: row[1], price: row[2], category: row[3], addedDate: row[4]
        })) : [];
    } catch (e) { wishlist = []; }
}

function saveWishlist() {
    try {
        DB.run("DELETE FROM wishlist");
        const stmt = DB.prepare("INSERT INTO wishlist VALUES (?,?,?,?,?)");
        wishlist.forEach(w => {
            stmt.run([w.id, w.name, w.price || 0, w.category || '', w.addedDate || new Date().toISOString()]);
        });
        stmt.free();
        saveToLocalStorage();
    } catch (e) {}
}

// ========== إشعارات ==========
function loadNotifications() {
    try {
        const result = DB.exec("SELECT * FROM notifications ORDER BY createdAt DESC");
        notifications = result.length > 0 ? result[0].values.map(row => ({
            id: row[0], type: row[1], title: row[2], message: row[3],
            refId: row[4], read: row[5], createdAt: row[6]
        })) : [];
    } catch (e) { notifications = []; }
}

function saveNotifications() {
    try {
        DB.run("DELETE FROM notifications");
        const stmt = DB.prepare("INSERT INTO notifications VALUES (?,?,?,?,?,?,?)");
        notifications.forEach(n => {
            stmt.run([n.id, n.type, n.title, n.message, n.refId || '', n.read ? 1 : 0,
                n.createdAt || new Date().toISOString()]);
        });
        stmt.free();
        saveToLocalStorage();
    } catch (e) {}
}

// ========== أكواد الولاء ==========
function loadLoyaltyCodes() {
    try {
        const result = DB.exec("SELECT * FROM loyaltyCodes ORDER BY createdAt DESC");
        loyaltyCodes = result.length > 0 ? result[0].values.map(row => ({
            id: row[0], code: row[1], customerId: row[2], customerName: row[3],
            tier: row[4], discount: row[5], minOrder: row[6], maxUses: row[7],
            usedCount: row[8], pointsEarned: row[9], totalPoints: row[10],
            usedBy: JSON.parse(row[11] || '[]'), createdAt: row[12],
            expiresAt: row[13], active: row[14]
        })) : [];
    } catch (e) { loyaltyCodes = []; }
}

function saveLoyaltyCodes() {
    try {
        DB.run("DELETE FROM loyaltyCodes");
        const stmt = DB.prepare("INSERT INTO loyaltyCodes VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        loyaltyCodes.forEach(lc => {
            stmt.run([lc.id, lc.code, lc.customerId || '', lc.customerName, lc.tier || 'general',
                lc.discount || 10, lc.minOrder || 100, lc.maxUses || 5, lc.usedCount || 0,
                lc.pointsEarned || 0, lc.totalPoints || 0, JSON.stringify(lc.usedBy || []),
                lc.createdAt || new Date().toISOString(), lc.expiresAt || '', lc.active ? 1 : 0]);
        });
        stmt.free();
        saveToLocalStorage();
    } catch (e) {}
}

// ========== ملاحظات ==========
function loadNotes() {
    try {
        const result = DB.exec("SELECT * FROM notes ORDER BY pinned DESC, updatedAt DESC");
        notes = result.length > 0 ? result[0].values.map(row => ({
            id: row[0], title: row[1], content: row[2], color: row[3],
            pinned: row[4], createdAt: row[5], updatedAt: row[6]
        })) : [];
    } catch (e) { notes = []; }
}

function saveNotes() {
    try {
        DB.run("DELETE FROM notes");
        const stmt = DB.prepare("INSERT INTO notes VALUES (?,?,?,?,?,?,?)");
        notes.forEach(n => {
            stmt.run([n.id, n.title, n.content || '', n.color || '#f5efe8',
                n.pinned ? 1 : 0, n.createdAt || new Date().toISOString(),
                n.updatedAt || new Date().toISOString()]);
        });
        stmt.free();
        saveToLocalStorage();
    } catch (e) {}
}

// ========== دوال احتياطية ==========
function saveAllData() {
    saveSettings();
    saveInvoices();
    saveCustomers();
    saveShipments();
    saveSuppliers();
    saveBundles();
    saveWishlist();
    saveNotifications();
    saveLoyaltyCodes();
    saveNotes();
}

function encryptData(data) {
    try {
        return btoa(unescape(encodeURIComponent(JSON.stringify(data))));
    } catch (e) {
        return JSON.stringify(data);
    }
}

function decryptData(str) {
    try {
        return JSON.parse(decodeURIComponent(escape(atob(str))));
    } catch (e) {
        return JSON.parse(str);
    }
        }
