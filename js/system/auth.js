// ==================== auth.js ====================
// نظام الأمان - قفل التطبيق واسترجاع الرمز - LORVEN SYS v3.0

let lockAttempts = 0;
let lockTimeout = null;
// ==================== شاشة القفل الرئيسية ====================

function showLockScreen() {
    const oldScreen = document.getElementById('pinScreen');
    if (oldScreen) oldScreen.remove();
    const lang = settings.language;
    
    const saved = localStorage.getItem('lorven_security');
    let savedPin = settings.pinCode || '1234';
    
    if (saved) {
        try {
            const securityData = JSON.parse(saved);
            savedPin = securityData.pin || savedPin;
        } catch (e) {}
    }
    
    const pinScreen = document.createElement('div');
    pinScreen.id = 'pinScreen';
    pinScreen.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: linear-gradient(145deg, #243048, #3A4A66);
        display: flex; align-items: center; justify-content: center;
        z-index: 10000;
    `;
    
    pinScreen.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 30px; width: 300px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative;">
            
            <!-- زر اللغة - أعلى اليمين -->
            <button onclick="toggleLockLanguage()" style="
                position: absolute; top: 12px; right: 12px;
                width: 32px; height: 32px; border-radius: 50%;
                background: #F8F4F0; border: 1px solid #E0D6D0;
                color: #243048; font-size: 13px; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
            "><i class="fas fa-globe"></i></button>
            
            <!-- زر الثلاث نقاط - أعلى اليسار -->
            <button id="lockMenuBtn" style="
                position: absolute; top: 12px; left: 12px;
                width: 32px; height: 32px; border-radius: 50%;
                background: #F8F4F0; border: 1px solid #E0D6D0;
                color: #243048; font-size: 13px; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
            "><i class="fas fa-ellipsis-v"></i></button>
            
            <!-- القائمة المنسدلة -->
            <div id="lockMenu2" style="
                display: none; position: absolute; top: 48px; left: 12px;
                background: white; border: 1px solid #E0D6D0;
                border-radius: 16px; padding: 8px; min-width: 170px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.12); z-index: 100;
                text-align: right;
            ">
                <button id="menuAbout" style="
                    width: 100%; padding: 10px 14px; border: none; border-radius: 10px;
                    background: transparent; color: #243048; font-size: 12px;
                    text-align: right; cursor: pointer; font-family: inherit;
                    display: flex; align-items: center; gap: 8px;
                "><i class="fas fa-info-circle" style="width: 16px; color: #8F8A88;"></i>${lang === 'en' ? 'About' : 'عن التطبيق'}</button>
                
                <button id="menuFAQ" style="
                    width: 100%; padding: 10px 14px; border: none; border-radius: 10px;
                    background: transparent; color: #243048; font-size: 12px;
                    text-align: right; cursor: pointer; font-family: inherit;
                    display: flex; align-items: center; gap: 8px;
                "><i class="fas fa-question-circle" style="width: 16px; color: #8F8A88;"></i>${lang === 'en' ? 'FAQ' : 'الأسئلة الشائعة'}</button>
                
                <button id="menuPrivacy" style="
                    width: 100%; padding: 10px 14px; border: none; border-radius: 10px;
                    background: transparent; color: #243048; font-size: 12px;
                    text-align: right; cursor: pointer; font-family: inherit;
                    display: flex; align-items: center; gap: 8px;
                "><i class="fas fa-lock" style="width: 16px; color: #8F8A88;"></i>${lang === 'en' ? 'Privacy' : 'الخصوصية'}</button>
                
                <button id="menuContact" style="
                    width: 100%; padding: 10px 14px; border: none; border-radius: 10px;
                    background: transparent; color: #243048; font-size: 12px;
                    text-align: right; cursor: pointer; font-family: inherit;
                    display: flex; align-items: center; gap: 8px;
                "><i class="fas fa-headset" style="width: 16px; color: #8F8A88;"></i>${lang === 'en' ? 'Contact' : 'اتصل بنا'}</button>
            </div>
            
            <!-- الشعار -->
            <div style="width: 80px; height: 80px; background: #243048; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 20px auto 15px;">
                <i class="fas fa-lock" style="font-size: 35px; color: #F8F4F0;"></i>
            </div>
            
            <h3 style="margin-bottom: 5px; color: #243048; font-weight: 700;">${lang === 'en' ? 'App Locked' : 'التطبيق مقفل'}</h3>
            <p style="color: #8F8A88; margin-bottom: 20px; font-size: 13px;">${lang === 'en' ? 'Enter your PIN' : 'أدخل رمز الدخول'}</p>
            
            <!-- حقل الرمز -->
            <div style="position: relative; margin-bottom: 20px;">
                <input type="password" id="pinInput" maxlength="6" inputmode="numeric" 
                       style="width: 100%; padding: 15px 45px; text-align: center; font-size: 24px; letter-spacing: 8px; border: 2px solid #E0D6D0; border-radius: 20px; background: #F8F4F0; outline: none; color: #243048; box-sizing: border-box;" 
                       placeholder="••••">
                <span class="password-toggle" onclick="togglePasswordVisibility('pinInput', this)" 
                      style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #8F8A88; font-size: 18px;">
                    <i class="fas fa-eye"></i>
                </span>
            </div>
            
            <button id="unlockBtn" style="
                width: 100%; padding: 14px; background: #243048; border: none; border-radius: 30px; 
                font-weight: 600; color: #F8F4F0; cursor: pointer; margin-bottom: 10px;
            "><i class="fas fa-unlock-alt" style="margin-left: 5px;"></i> ${lang === 'en' ? 'Unlock' : 'فتح'}</button>
            
            <button id="forgotPinBtn" style="
                background: none; border: none; color: #FF8A9C; font-size: 12px; cursor: pointer;
            ">${lang === 'en' ? 'Forgot PIN?' : 'نسيت الرمز؟'}</button>
            
            <div id="pinError" style="color: #FF6B6B; font-size: 12px; margin-top: 10px; display: none;">
                ${lang === 'en' ? 'Wrong PIN' : 'رمز خاطئ'}
            </div>
            
            <!-- الحقوق والإصدار -->
            <div style="margin-top: 20px; text-align: center;">
                <p style="color: #B0A8A0; font-size: 10px; margin: 0 0 2px;">© 2025 LORVEN</p>
                <p style="color: #C8C0B8; font-size: 9px; margin: 0;">v${APP_VERSION}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(pinScreen);
    
    // تفعيل الأزرار بعد إضافة العنصر للـ DOM
    document.getElementById('lockMenuBtn').addEventListener('click', function() {
        const menu = document.getElementById('lockMenu2');
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });
    
    document.getElementById('menuAbout').addEventListener('click', function() {
        window.location.href = 'about.html';
    });
    
    document.getElementById('menuFAQ').addEventListener('click', function() {
        window.location.href = 'faq.html';
    });
    
    document.getElementById('menuPrivacy').addEventListener('click', function() {
        window.location.href = 'privacy.html';
    });
    
    document.getElementById('menuContact').addEventListener('click', function() {
        window.location.href = 'contact.html';
    });
    
    document.getElementById('unlockBtn').addEventListener('click', function() {
        checkPinCode();
    });
    
    document.getElementById('forgotPinBtn').addEventListener('click', function() {
        showForgotPinForm();
    });
    
    // إغلاق القائمة عند النقر خارجها
    document.addEventListener('click', function(e) {
        const menu = document.getElementById('lockMenu2');
        const btn = document.getElementById('lockMenuBtn');
        if (menu && menu.style.display === 'block') {
            if (!menu.contains(e.target) && e.target !== btn) {
                menu.style.display = 'none';
            }
        }
    });
    
    // تركيز و Enter
    setTimeout(() => document.getElementById('pinInput').focus(), 100);
    document.getElementById('pinInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') checkPinCode();
    });
}

// ==================== التحقق من الرمز ====================

function checkPinCode() {
    const pin = document.getElementById('pinInput').value;
    const lang = settings.language;
    
    const saved = localStorage.getItem('lorven_security');
    let savedPin = settings.pinCode || '1234';
    if (saved) {
        try {
            const securityData = JSON.parse(saved);
            savedPin = securityData.pin || savedPin;
        } catch (e) {}
    }
    
    if (!pin || pin.length < 4) {
        const errorEl = document.getElementById('pinError');
        errorEl.textContent = lang === 'en' ? 'PIN must be 4-6 digits' : 'الرمز يجب أن يكون ٤-٦ أرقام';
        errorEl.style.display = 'block';
        return;
    }
    
    if (pin === savedPin) {
        lockAttempts = 0;
        document.getElementById('pinScreen')?.remove();
        document.querySelector('.app-container').style.display = 'flex';
        if (typeof switchPage === 'function') switchPage('dashboard');
        showToast(lang === 'en' ? 'Welcome! 👋' : 'أهلاً بك! 👋');
    } else {
        const errorEl = document.getElementById('pinError');
        errorEl.style.display = 'block';
        document.getElementById('pinInput').value = '';
        navigator.vibrate?.(50);
        
        lockAttempts++;
        if (lockAttempts >= 5) {
            showToast(lang === 'en' ? 'Too many attempts. Wait 30s.' : 'محاولات كثيرة. انتظر ٣٠ ثانية.');
            lockTimeout = setTimeout(() => {
                lockAttempts = 0;
                lockTimeout = null;
            }, 30000);
        }
    }
}

// ==================== نسيت الرمز ====================

function showForgotPinForm() {
    const pinScreen = document.getElementById('pinScreen');
    if (!pinScreen) return;
    const lang = settings.language;
    
    pinScreen.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 30px; width: 300px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative;">
            
            <button id="backToLockBtn" style="
                position: absolute; top: 12px; right: 12px;
                width: 32px; height: 32px; border-radius: 50%;
                background: #F8F4F0; border: 1px solid #E0D6D0;
                color: #243048; font-size: 13px; cursor: pointer;
                display: flex; align-items: center; justify-content: center;
            "><i class="fas fa-arrow-right"></i></button>
            
            <div style="width: 60px; height: 60px; background: #243048; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 20px auto 15px;">
                <i class="fas fa-question" style="font-size: 28px; color: #F8F4F0;"></i>
            </div>
            
            <h3 style="margin-bottom: 5px; color: #243048; font-weight: 700;">${lang === 'en' ? 'Forgot PIN' : 'نسيت الرمز'}</h3>
            <p style="color: #8F8A88; margin-bottom: 16px; font-size: 12px;">${lang === 'en' ? 'Answer your security question' : 'أجب على سؤالك السري'}</p>
            
            <div style="background: #F8F4F0; border-radius: 16px; padding: 16px; margin-bottom: 14px;">
                <p style="font-size: 14px; color: #243048; font-weight: 600; margin-bottom: 12px;">${settings.securityQuestion || (lang === 'en' ? 'No security question set' : 'لم يتم تعيين سؤال سري')}</p>
                <input type="text" id="forgotPinAnswer" placeholder="${lang === 'en' ? 'Your answer' : 'إجابتك'}" style="
                    width: 100%; padding: 12px; border-radius: 14px;
                    border: 1px solid #E0D6D0; background: white; font-size: 14px;
                    text-align: center; outline: none; font-family: inherit;
                ">
            </div>
            
            <button id="verifyAnswerBtn" style="
                width: 100%; padding: 14px; background: #243048; border: none; border-radius: 30px;
                font-weight: 600; color: #F8F4F0; cursor: pointer; margin-bottom: 8px;
            ">${lang === 'en' ? 'Verify' : 'تحقق'}</button>
            
            <div id="forgotError" style="color: #FF6B6B; font-size: 12px; margin-top: 8px; display: none;"></div>
            
            <div style="margin-top: 20px; text-align: center;">
                <p style="color: #B0A8A0; font-size: 10px; margin: 0 0 2px;">© 2025 LORVEN</p>
                <p style="color: #C8C0B8; font-size: 9px; margin: 0;">v${APP_VERSION}</p>
            </div>
        </div>
    `;
    
    document.getElementById('backToLockBtn').addEventListener('click', function() {
        showLockScreen();
    });
    
    document.getElementById('verifyAnswerBtn').addEventListener('click', function() {
        verifySecurityAnswer();
    });
}

function verifySecurityAnswer() {
    const lang = settings.language;
    const answer = document.getElementById('forgotPinAnswer')?.value?.trim();
    
    if (!answer) {
        const err = document.getElementById('forgotError');
        err.textContent = lang === 'en' ? 'Enter your answer' : 'أدخل الإجابة';
        err.style.display = 'block';
        return;
    }
    
    if (answer !== settings.securityAnswer) {
        const err = document.getElementById('forgotError');
        err.textContent = lang === 'en' ? 'Wrong answer' : 'إجابة خاطئة';
        err.style.display = 'block';
        document.getElementById('forgotPinAnswer').value = '';
        return;
    }
    
    showResetPinForm();
}

function showResetPinForm() {
    const pinScreen = document.getElementById('pinScreen');
    if (!pinScreen) return;
    const lang = settings.language;
    
    pinScreen.innerHTML = `
        <div style="background: white; padding: 30px; border-radius: 30px; width: 300px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.2); position: relative;">
            
            <div style="margin-bottom: 16px;">
                <i class="fas fa-check-circle" style="font-size: 48px; color: #6b9e7a;"></i>
                <h3 style="margin-top: 8px; color: #243048; font-weight: 700;">${lang === 'en' ? 'Answer Correct!' : 'إجابة صحيحة!'}</h3>
                <p style="color: #8F8A88; font-size: 12px;">${lang === 'en' ? 'Set a new PIN' : 'عين رمزاً جديداً'}</p>
            </div>
            
            <div style="position: relative; margin-bottom: 16px;">
                <input type="password" id="newPinInput" maxlength="6" inputmode="numeric" 
                       style="width: 100%; padding: 15px 45px; text-align: center; font-size: 24px; letter-spacing: 8px; border: 2px solid #E0D6D0; border-radius: 20px; background: #F8F4F0; outline: none; color: #243048; box-sizing: border-box;" 
                       placeholder="${lang === 'en' ? 'New PIN' : 'رمز جديد'}">
                <span class="password-toggle" onclick="togglePasswordVisibility('newPinInput', this)" 
                      style="position: absolute; right: 15px; top: 50%; transform: translateY(-50%); cursor: pointer; color: #8F8A88; font-size: 18px;">
                    <i class="fas fa-eye"></i>
                </span>
            </div>
            
            <button id="saveNewPinBtn" style="
                width: 100%; padding: 14px; background: #6b9e7a; border: none; border-radius: 30px;
                font-weight: 600; color: white; cursor: pointer;
            ">${lang === 'en' ? 'Save New PIN' : 'حفظ الرمز الجديد'}</button>
            
            <div id="resetError" style="color: #FF6B6B; font-size: 12px; margin-top: 8px; display: none;"></div>
            
            <div style="margin-top: 20px; text-align: center;">
                <p style="color: #B0A8A0; font-size: 10px; margin: 0 0 2px;">© 2025 LORVEN</p>
                <p style="color: #C8C0B8; font-size: 9px; margin: 0;">v${APP_VERSION}</p>
            </div>
        </div>
    `;
    
    document.getElementById('saveNewPinBtn').addEventListener('click', function() {
        resetPinCode();
    });
}

function resetPinCode() {
    const lang = settings.language;
    const pin = document.getElementById('newPinInput').value;
    
    if (!pin || pin.length < 4) {
        const err = document.getElementById('resetError');
        err.textContent = lang === 'en' ? 'PIN must be 4-6 digits' : 'الرمز يجب أن يكون ٤-٦ أرقام';
        err.style.display = 'block';
        return;
    }
    
    settings.pinCode = pin;
    saveSettings();
    lockAttempts = 0;
    showToast(lang === 'en' ? 'PIN reset successfully!' : 'تم تعيين الرمز بنجاح!');
    showLockScreen();
}

// ==================== دوال مساعدة ====================

function toggleLockLanguage() {
    settings.language = settings.language === 'ar' ? 'en' : 'ar';
    saveSettings();
    applyLanguage();
    showLockScreen();
}

function togglePasswordVisibility(inputId, element) {
    const input = document.getElementById(inputId);
    const icon = element.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        input.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// ==================== بدء التطبيق ====================

function checkAppLock() {
    if (settings.appLock === 'on' && settings.pinCode && settings.pinCode.length >= 4) {
        showLockScreen();
    } else {
        document.querySelector('.app-container').style.display = 'flex';
        if (typeof switchPage === 'function') switchPage('dashboard');
    }
}