// =========================================================================
// MOTION & NAVIGATION UTILITIES (NIVFES BIO - STATIC VERSION)
// Mengelola Navigasi Tab, Kuis Evaluasi, Leaderboard (localStorage), dan Feedback
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi awal saat halaman dimuat
});

// --- FUNGSI TOGGLE COLLAPSE SIDEBAR MENU UNTUK RUANG SIMULATOR MAKSIMAL ---
window.toggleSidebar = function() {
    const sidebar = document.getElementById('module-sidebar');
    const restoreBtn = document.getElementById('btn-restore-sidebar');
    const toggleBtn = document.getElementById('btn-toggle-sidebar');
    if (!sidebar) return;

    const isCollapsed = sidebar.classList.contains('sidebar-collapsed');
    if (isCollapsed) {
        sidebar.classList.remove('sidebar-collapsed');
        if (restoreBtn) restoreBtn.classList.add('hidden');
        if (toggleBtn) toggleBtn.innerHTML = '<span>◀ Sembunyikan</span>';
    } else {
        sidebar.classList.add('sidebar-collapsed');
        if (restoreBtn) restoreBtn.classList.remove('hidden');
    }

    if (window.VLabManager && window.VLabManager.handleResize) {
        setTimeout(() => window.VLabManager.handleResize(), 320);
    }
};

// --- FUNGSI NAVIGASI TAB UTAMA (Teori | Prosedur | Simulator | Kuis) ---
window.switchTab = function(tabId, btnElement) {
    const allBtns = document.querySelectorAll('.tab-btn');
    allBtns.forEach(btn => {
        btn.classList.remove('text-teal-600', 'border-teal-600', 'font-semibold', 'bg-white', 'shadow-sm');
        btn.classList.add('text-slate-500', 'border-transparent', 'font-medium');
    });

    if (btnElement) {
        btnElement.classList.remove('text-slate-500', 'border-transparent', 'font-medium');
        btnElement.classList.add('text-teal-600', 'border-teal-600', 'font-semibold', 'bg-white', 'shadow-sm');
    }

    const allContents = document.querySelectorAll('.tab-content');
    allContents.forEach(content => {
        content.classList.remove('opacity-100', 'translate-y-0', 'visible', 'pointer-events-auto', 'block');
        content.classList.add('opacity-0', 'translate-y-4', 'invisible', 'pointer-events-none', 'hidden');
    });

    const activeContent = document.getElementById(`tab-${tabId}`);
    if (activeContent) {
        activeContent.classList.remove('hidden', 'invisible', 'pointer-events-none');
        setTimeout(() => {
            activeContent.classList.remove('opacity-0', 'translate-y-4');
            activeContent.classList.add('opacity-100', 'translate-y-0', 'visible', 'pointer-events-auto', 'block');
            
            // Trigger inisialisasi/resume simulator jika tab simulator dibuka
            if (tabId === 'simulator' && window.VLabManager) {
                if (window.VLabManager.onTabActivated) {
                    window.VLabManager.onTabActivated();
                } else if (window.VLabManager.init) {
                    window.VLabManager.init();
                }
            }
        }, 10);
    }
};

// --- FUNGSI KUIS DAN LEADERBOARD (LOCALSTORAGE) ---
window.currentQuizScore = 0;

window.checkAnswer = function(btn) {
    const totalQuestions = document.querySelectorAll('.quiz-item').length;
    const quizItem = btn.closest('.quiz-item');
    const correctIndex = quizItem.getAttribute('data-answer');
    const selected = quizItem.querySelector('input[type="radio"]:checked');
    const feedback = quizItem.querySelector('.feedback');

    if (!selected) { 
        alert('Silakan pilih jawaban terlebih dahulu.'); 
        return; 
    }
    feedback.classList.remove('hidden'); 
    btn.classList.add('hidden'); 

    let delayTimer = 1500;

    if (selected.value === correctIndex) {
        feedback.classList.add('bg-emerald-100', 'text-emerald-700', 'border-emerald-300');
        feedback.innerText = '✅ Benar! Penjelasan akurat.';
        window.currentQuizScore += (100 / totalQuestions);
    } else {
        const correctRadio = quizItem.querySelector(`input[type="radio"][value="${correctIndex}"]`);
        let correctText = correctIndex;

        if (correctRadio && correctRadio.parentElement) {
            correctText = correctRadio.parentElement.textContent.trim();
        }

        feedback.classList.add('bg-red-100', 'text-red-700', 'border-red-300');
        feedback.innerText = `❌ Salah. Jawaban yang benar:\n${correctText}`;
        delayTimer = 3000; 
    }

    setTimeout(() => {
        const nextQuiz = quizItem.nextElementSibling;
        quizItem.classList.add('hidden');
        
        if (nextQuiz && nextQuiz.classList.contains('quiz-item')) {
            nextQuiz.classList.remove('hidden');
        } else {
            const finalScore = Math.round(window.currentQuizScore);
            document.getElementById('quiz-finish').classList.remove('hidden');
            document.getElementById('final-score-display').innerText = finalScore;
            loadLeaderboard(); 
        }
    }, delayTimer);
};

// Simpan Skor ke localStorage
window.submitScore = function() {
    const nameInput = document.getElementById('player-name').value.trim();
    if (!nameInput) { 
        alert("Nama tidak boleh kosong!"); 
        return; 
    }
    
    const moduleId = document.getElementById('quiz-container').getAttribute('data-module');
    const finalScore = Math.round(window.currentQuizScore);

    const scores = JSON.parse(localStorage.getItem('nivfes_scores') || '[]');
    scores.push({
        npm: localStorage.getItem('nivfes_npm') || '',
        nama: nameInput,
        module_id: moduleId,
        score: finalScore,
        waktu: new Date().toLocaleString('id-ID')
    });
    localStorage.setItem('nivfes_scores', JSON.stringify(scores));
    
    document.getElementById('submit-score-section').classList.add('hidden');
    loadLeaderboard();
};

// Ambil Leaderboard dari localStorage
window.loadLeaderboard = function() {
    const container = document.getElementById('quiz-container');
    if (!container) return;
    const moduleId = container.getAttribute('data-module');
    const section = document.getElementById('leaderboard-section');
    if (section) section.classList.remove('hidden');
    
    const allScores = JSON.parse(localStorage.getItem('nivfes_scores') || '[]');
    
    // Filter skor untuk modul ini
    const filteredScores = allScores.filter(s => s.module_id === moduleId);
    
    // Urutkan dari tertinggi
    filteredScores.sort((a, b) => b.score - a.score);
    
    // Ambil top 5
    const topScores = filteredScores.slice(0, 5);
    
    const list = document.getElementById('leaderboard-list');
    if (!list) return;
    list.innerHTML = '';
    
    if (topScores.length === 0) {
        list.innerHTML = '<li class="p-4 text-center text-slate-500">Belum ada skor. Jadilah yang pertama!</li>';
        return;
    }

    topScores.forEach((entry, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '👤';
        list.innerHTML += `
            <li class="flex justify-between items-center p-4 hover:bg-slate-50">
                <div class="flex items-center gap-3">
                    <span class="text-2xl">${medal}</span>
                    <span class="font-bold text-slate-700">${entry.nama}</span>
                </div>
                <span class="bg-teal-100 text-teal-800 font-extrabold px-3 py-1 rounded-full text-sm">${entry.score} Pts</span>
            </li>
        `;
    });
};

// --- FUNGSI MENGIRIM FEEDBACK (FOOTER) - LOCALSTORAGE ---
window.sendFeedback = function() {
    const inputField = document.getElementById('feedback-input');
    const successMsg = document.getElementById('feedback-msg');
    
    if (!inputField || !inputField.value.trim()) {
        alert("Masukan tidak boleh kosong!");
        return;
    }

    const feedbacks = JSON.parse(localStorage.getItem('nivfes_feedbacks') || '[]');
    feedbacks.push({
        npm: localStorage.getItem('nivfes_npm') || '',
        nama: localStorage.getItem('nivfes_nama') || '',
        message: inputField.value.trim(),
        waktu: new Date().toLocaleString('id-ID')
    });
    localStorage.setItem('nivfes_feedbacks', JSON.stringify(feedbacks));

    successMsg.classList.remove('hidden');
    inputField.value = ''; 
    setTimeout(() => {
        successMsg.classList.add('hidden');
    }, 3000);
};

