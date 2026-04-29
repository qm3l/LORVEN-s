// ==================== notes.js ====================
// صفحة الملاحظات - LORVEN SYS v3.0

function loadNotes() {
    try {
        const saved = localStorage.getItem('lorvenNotes');
        notes = saved ? JSON.parse(saved) : [];
    } catch (e) {
        notes = [];
    }
}

function saveNotes() {
    try {
        localStorage.setItem('lorvenNotes', JSON.stringify(notes));
    } catch (e) {}
}

function renderNotesPage(container) {
    const lang = settings.language;
    
    let html = `
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h3 style="font-size: 18px; font-weight: 700;">
                <i class="fas fa-sticky-note"></i> ${lang === 'en' ? 'Notes' : 'الملاحظات'}
                <span style="font-size: 12px; color: var(--text-soft);">(${notes.length})</span>
            </h3>
            <button class="btn btn-primary" style="padding: 8px 14px; font-size: 12px;" onclick="openNoteModal()">
                <i class="fas fa-plus"></i> ${lang === 'en' ? 'Add' : 'أضف'}
            </button>
        </div>
        <div id="notesList"></div>
    `;
    
    container.innerHTML = html;
    renderNotesList();
}

function renderNotesList() {
    const lang = settings.language;
    const container = document.getElementById('notesList');
    if (!container) return;
    
    if (notes.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-soft);">
                <i class="fas fa-sticky-note" style="font-size: 48px; margin-bottom: 12px; opacity: 0.3;"></i>
                <p>${lang === 'en' ? 'No notes yet' : 'لا توجد ملاحظات'}</p>
            </div>
        `;
        return;
    }
    
    const sorted = [...notes].reverse();
    
    container.innerHTML = sorted.map(n => `
        <div class="stat-card" style="margin-bottom: 8px; cursor: pointer;" onclick="openNoteModal('${n.id}')">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div style="flex: 1;">
                    <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px;">${escapeHTML(n.title)}</div>
                    <div style="font-size: 11px; color: var(--text-soft); line-height: 1.5;">${escapeHTML(n.content.substring(0, 100))}${n.content.length > 100 ? '...' : ''}</div>
                </div>
                <span style="font-size: 9px; color: var(--text-soft); white-space: nowrap; margin-right: 8px;">${formatDate(n.date)}</span>
            </div>
        </div>
    `).join('');
}

function openNoteModal(existingNoteId = null) {
    const lang = settings.language;
    const existing = existingNoteId ? notes.find(n => n.id === existingNoteId) : null;
    
    const modal = document.createElement('div');
    modal.className = 'modal bottom-sheet';
    modal.id = 'noteModal';
    modal.style.display = 'flex';
    modal.innerHTML = `
        <div class="modal-content bottom-sheet-content" style="max-width: 400px;">
            <div class="modal-header">
                <div class="modal-title">
                    <i class="fas fa-sticky-note"></i> 
                    ${existing ? (lang === 'en' ? 'Edit Note' : 'تعديل ملاحظة') : (lang === 'en' ? 'New Note' : 'ملاحظة جديدة')}
                </div>
                <div class="modal-close" onclick="this.closest('.modal').remove()">&times;</div>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">${lang === 'en' ? 'Title' : 'العنوان'}</label>
                    <input type="text" class="form-control" id="noteTitle" value="${existing ? escapeHTML(existing.title) : ''}" 
                           placeholder="${lang === 'en' ? 'Note title...' : 'عنوان الملاحظة...'}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">${lang === 'en' ? 'Content' : 'المحتوى'}</label>
                    <textarea class="form-control" id="noteContent" rows="6" 
                              placeholder="${lang === 'en' ? 'Write your note...' : 'اكتب ملاحظتك...'}">${existing ? existing.content : ''}</textarea>
                </div>
                
                <button class="btn btn-primary" style="width: 100%;" onclick="${existing ? `updateNote('${existing.id}')` : 'saveNote()'}">
                    ${lang === 'en' ? 'Save' : 'حفظ'}
                </button>
                
                ${existing ? `
                    <button class="btn btn-outline" style="width: 100%; margin-top: 8px; color: var(--red); border-color: var(--red);" 
                            onclick="deleteNoteFromModal('${existing.id}')">
                        ${lang === 'en' ? 'Delete' : 'حذف'}
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function saveNote() {
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    
    if (!title && !content) {
        showToast(t('fillFields'));
        return;
    }
    
    notes.push({
        id: 'NOTE-' + Date.now(),
        title: title || (settings.language === 'en' ? 'Untitled' : 'بدون عنوان'),
        content: content,
        date: new Date().toISOString()
    });
    
    saveNotes();
    document.getElementById('noteModal')?.remove();
    renderNotesList();
    showToast(t('saved'));
}

function updateNote(noteId) {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;
    
    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();
    
    note.title = title || (settings.language === 'en' ? 'Untitled' : 'بدون عنوان');
    note.content = content;
    note.date = new Date().toISOString();
    
    saveNotes();
    document.getElementById('noteModal')?.remove();
    renderNotesList();
    showToast(t('saved'));
}

function deleteNoteFromModal(noteId) {
    const modal = document.getElementById('noteModal');
    if (modal) modal.remove();
    
    setTimeout(() => {
        showConfirmModal(
            settings.language === 'en' ? 'Delete this note?' : 'حذف هذه الملاحظة؟',
            function() {
                notes = notes.filter(n => n.id !== noteId);
                saveNotes();
                renderNotesList();
                showToast(t('deleted'));
            }
        );
    }, 200);
}