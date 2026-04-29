// ==================== sound.js ====================
// نظام الصوت - LORVEN SYS v3.0

let soundEnabled = true;

try {
    const saved = localStorage.getItem('lorven_sound_enabled');
    if (saved !== null) soundEnabled = saved === 'true';
} catch (e) {}

// تشغيل صوت
function playSound(type) {
    if (!soundEnabled) return;
    
    const sounds = {
        save: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
        delete: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
        success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
        notification: 'https://assets.mixkit.co/active_storage/sfx/2355/2355-preview.mp3',
        click: 'https://assets.mixkit.co/active_storage/sfx/2564/2564-preview.mp3'
    };
    
    if (sounds[type]) {
        try {
            const audio = new Audio(sounds[type]);
            audio.volume = 0.3;
            audio.play().catch(() => {});
        } catch (e) {}
    }
}
// تبديل الصوت
function toggleSound() {
    soundEnabled = !soundEnabled;
    try {
        localStorage.setItem('lorven_sound_enabled', soundEnabled);
    } catch (e) {}
    
    if (soundEnabled) playSound('confirm');
    
    updateSoundIcon();
    showToast(soundEnabled ? '✅ الصوت مفعل' : '🔇 الصوت معطل');
    
    return soundEnabled;
}

// تحديث أيقونة الصوت
function updateSoundIcon() {
    const icon = document.getElementById('soundIcon');
    const label = document.getElementById('soundLabel');
    
    if (icon) {
        icon.innerHTML = `<i class="fas ${soundEnabled ? 'fa-volume-up' : 'fa-volume-mute'}"></i>`;
    }
    if (label) {
        const lang = settings.language;
        label.textContent = soundEnabled ? (lang === 'en' ? 'On' : 'مفعل') : (lang === 'en' ? 'Mute' : 'صامت');
    }
}

console.log('✅ sound.js loaded');