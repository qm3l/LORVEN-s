// ==================== biometric.js ====================
// قفل بصمة الإصبع / Face ID - LORVEN SYS v2.2.0

async function registerBiometric() {
    const lang = settings.language;
    
    if (!window.PublicKeyCredential) {
        showToast(lang === 'en' ? 'Biometric not supported' : 'البصمة غير مدعومة');
        return false;
    }
    
    try {
        const credential = await navigator.credentials.create({
            publicKey: {
                challenge: new Uint8Array(32),
                rp: { name: 'LORVEN SYS' },
                user: { id: new Uint8Array(16), name: 'admin@lorven', displayName: 'Admin' },
pubKeyCredParams: [
    { type: 'public-key', alg: -7 },
    { type: 'public-key', alg: -257 }
],
authenticatorSelection: { authenticatorAttachment: 'platform', userVerification: 'required' },
                timeout: 60000,
                attestation: 'none'
            }
        });
        
        if (credential) {
            settings.biometricEnabled = true;
            settings.biometricId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)));
            saveSettings();
            showToast(lang === 'en' ? 'Biometric enabled' : '✅ تم تفعيل البصمة');
            return true;
        }
    } catch (e) {
        console.warn('Biometric registration cancelled');
    }
    return false;
}

async function verifyBiometric() {
    if (!settings.biometricEnabled || !settings.biometricId) return false;
    
    try {
        const credential = await navigator.credentials.get({
            publicKey: {
                challenge: new Uint8Array(32),
                allowCredentials: [{ id: Uint8Array.from(atob(settings.biometricId), c => c.charCodeAt(0)), type: 'public-key' }],
                timeout: 30000,
                userVerification: 'required'
            }
        });
        return !!credential;
    } catch (e) {
        return false;
    }
}

// تجربة: بصمة أولاً، إذا فشل → PIN
async function unlockWithBiometricOrPin() {
    const lang = settings.language;
    
    // إذا البصمة مفعلة، جربها أولاً
    if (settings.biometricEnabled) {
        const verified = await verifyBiometric();
        if (verified) {
            if (typeof showLockScreen === 'function') showLockScreen(false);
            if (typeof switchPage === 'function') switchPage('dashboard');
            return;
        }
    }
    
    // إذا فشلت البصمة أو مو مفعلة، اطلب PIN
    if (typeof showPinInput === 'function') {
        showPinInput();
    }
}