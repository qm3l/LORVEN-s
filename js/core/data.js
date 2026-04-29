// ==================== data.js ====================

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

// ========== التحميل ==========
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
    updateCustomersFromInvoices();
}

function loadSettings() {
    try {
        const saved = localStorage.getItem('lorvenSettings');
        if (saved) {
            const parsed = JSON.parse(saved);
            settings = { ...settings, ...parsed };
        }
    } catch (e) {}
}

function loadInvoices() {
    try {
        const saved = localStorage.getItem('lorvenInvoices');
        invoices = saved ? (decryptData(saved) || []) : [];
    } catch (e) {
        invoices = [];
    }
}

function loadCustomers() {
    try {
        const saved = localStorage.getItem('lorvenCustomers');
        customers = saved ? (decryptData(saved) || []) : [];
    } catch (e) {
        customers = [];
    }
}

function loadShipments() {
    try {
        const saved = localStorage.getItem('lorvenShipments');
        shipments = saved ? (decryptData(saved) || []) : [];
    } catch (e) {
        shipments = [];
    }
}

function loadSuppliers() {
    try {
        const saved = localStorage.getItem('lorvenSuppliers');
        suppliers = saved ? (decryptData(saved) || []) : [];
    } catch (e) {
        suppliers = [];
    }
}

function loadBundles() {
    try {
        const saved = localStorage.getItem('lorvenBundles');
        bundles = saved ? (decryptData(saved) || []) : [];
    } catch (e) {
        bundles = [];
    }
}

function loadWishlist() {
    try {
        const saved = localStorage.getItem('lorvenWishlist');
        wishlist = saved ? (decryptData(saved) || []) : [];
    } catch (e) {
        wishlist = [];
    }
}

function loadNotifications() {
    try {
        const saved = localStorage.getItem('lorvenNotifications');
        notifications = saved ? JSON.parse(saved) : [];
    } catch (e) {
        notifications = [];
    }
}

// ========== الحفظ ==========
function saveSettings() {
    try {
        localStorage.setItem('lorvenSettings', JSON.stringify(settings));
    } catch (e) {}
}

function saveInvoices() {
    try {
        localStorage.setItem('lorvenInvoices', encryptData(invoices));
    } catch (e) {}
}

function saveCustomers() {
    try {
        localStorage.setItem('lorvenCustomers', encryptData(customers));
    } catch (e) {}
}

function saveShipments() {
    try {
        localStorage.setItem('lorvenShipments', encryptData(shipments));
    } catch (e) {}
}

function saveSuppliers() {
    try {
        localStorage.setItem('lorvenSuppliers', encryptData(suppliers));
    } catch (e) {}
}

function saveBundles() {
    try {
        localStorage.setItem('lorvenBundles', encryptData(bundles));
    } catch (e) {}
}

function saveWishlist() {
    try {
        localStorage.setItem('lorvenWishlist', encryptData(wishlist));
    } catch (e) {}
}

function saveNotifications() {
    try {
        localStorage.setItem('lorvenNotifications', JSON.stringify(notifications));
    } catch (e) {}
}
function saveAllData() {
    saveSettings();
    saveInvoices();
    saveCustomers();
    saveShipments();
    saveSuppliers();
    saveBundles();
    saveWishlist();
    saveNotifications();
    saveNotes();
    saveLoyaltyCodes();
}