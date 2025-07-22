// スポット予約ページのJavaScript

let currentPage = 'home';
let selectedSpot = null;
let reservationData = {};

// 初期化
onDOMReady(() => {
    showPage('home');
    initializeEventListeners();
});

// イベントリスナーの初期化
function initializeEventListeners() {
    // タブボタン
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const page = e.target.closest('.tab-btn').dataset.page;
            showPage(page);
        });
    });
    
    // スポット選択ボタン
    const spotButtons = document.querySelectorAll('.spot-select-btn');
    spotButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const spotId = e.target.dataset.spotId;
            selectSpot(spotId);
        });
    });
    
    // 予約フォーム送信
    const submitBtn = document.getElementById('submitReservation');
    if (submitBtn) {
        submitBtn.addEventListener('click', submitReservation);
    }
}

// ページ表示切り替え
function showPage(page) {
    currentPage = page;
    
    // 全ページを非表示
    const pages = ['home', 'detail', 'reservation'];
    pages.forEach(p => {
        const pageElement = document.getElementById(`${p}Page`);
        if (pageElement) {
            pageElement.classList.add('hidden');
        }
    });
    
    // 指定されたページを表示
    const targetPage = document.getElementById(`${page}Page`);
    if (targetPage) {
        targetPage.classList.remove('hidden');
    }
    
    // ナビゲーションボタンの状態更新
    updateNavigation(page);
    
    // ページ固有の初期化
    switch (page) {
        case 'home':
            initHomePage();
            break;
        case 'detail':
            initDetailPage();
            break;
        case 'reservation':
            initReservationPage();
            break;
    }
}

// ナビゲーション状態の更新
function updateNavigation(activePage) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.page === activePage) {
            btn.classList.add('active');
        }
    });
}

// ホームページの初期化
function initHomePage() {
    // スポット一覧の表示など
}

// 詳細ページの初期化
function initDetailPage() {
    if (selectedSpot) {
        displaySpotDetails(selectedSpot);
    }
}

// 予約ページの初期化
function initReservationPage() {
    if (selectedSpot) {
        const spotNameElement = document.getElementById('reservationSpotName');
        if (spotNameElement) {
            spotNameElement.textContent = selectedSpot.name;
        }
    }
}

// スポット選択
function selectSpot(spotId) {
    // 模擬的なスポットデータ
    const spots = {
        '1': { id: 1, name: '新潟市美術館', description: '現代アートを中心とした美術館', fee: '500円', hours: '9:00-17:00' },
        '2': { id: 2, name: 'マリンピア日本海', description: '日本海の海洋生物を展示する水族館', fee: '1,500円', hours: '9:00-17:00' },
        '3': { id: 3, name: '白山公園', description: '四季の花々が楽しめる総合公園', fee: '無料', hours: '24時間' }
    };
    
    selectedSpot = spots[spotId];
    if (selectedSpot) {
        MobileUI.showModal(`${selectedSpot.name}を選択しました`);
        setTimeout(() => {
            showPage('detail');
        }, 1000);
    }
}

// スポット詳細の表示
function displaySpotDetails(spot) {
    const container = document.getElementById('spotDetailContent');
    if (container && spot) {
        container.innerHTML = `
            <div class="mobile-card animate-on-load delay-200">
                <div class="w-full h-48 bg-gradient-to-br from-emerald-300 to-blue-400 rounded-xl mb-4 flex items-center justify-center">
                    <i data-lucide="image" class="w-16 h-16 text-white"></i>
                </div>
                
                <h2 class="text-xl font-bold text-gray-800 mb-3">${spot.name}</h2>
                <p class="text-gray-600 mb-4">${spot.description}</p>
                
                <div class="space-y-3">
                    <div class="flex items-center">
                        <i data-lucide="ticket" class="w-5 h-5 text-emerald-500 mr-3"></i>
                        <span class="text-gray-700">入場料: ${spot.fee}</span>
                    </div>
                    
                    <div class="flex items-center">
                        <i data-lucide="clock" class="w-5 h-5 text-blue-500 mr-3"></i>
                        <span class="text-gray-700">営業時間: ${spot.hours}</span>
                    </div>
                    
                    <div class="flex items-center">
                        <i data-lucide="map-pin" class="w-5 h-5 text-red-500 mr-3"></i>
                        <span class="text-gray-700">新潟市中央区</span>
                    </div>
                </div>
                
                <div class="mt-6">
                    <button onclick="showPage('reservation')" class="mobile-button-primary w-full">
                        <i data-lucide="calendar" class="w-4 h-4 mr-2"></i>
                        このスポットを予約する
                    </button>
                </div>
            </div>
        `;
        
        // Lucideアイコンを再初期化
        if (typeof lucide !== 'undefined') {
            setTimeout(() => lucide.createIcons(), 100);
        }
    }
}

// 予約送信
function submitReservation() {
    const form = document.getElementById('reservationForm');
    if (!form) return;
    
    const formData = new FormData(form);
    reservationData = {
        spot: selectedSpot,
        name: formData.get('name'),
        email: formData.get('email'),
        date: formData.get('date'),
        time: formData.get('time'),
        people: formData.get('people'),
        notes: formData.get('notes')
    };
    
    // バリデーション
    if (!reservationData.name || !reservationData.email || !reservationData.date) {
        MobileUI.showModal('必須項目を入力してください');
        return;
    }
    
    // ローディング表示
    const submitBtn = document.getElementById('submitReservation');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = '予約中...';
    submitBtn.disabled = true;
    
    // 模擬的な予約処理
    setTimeout(() => {
        MobileUI.showModal('予約が完了しました！確認メールをお送りします。');
        
        // フォームをリセット
        form.reset();
        
        // ボタンを元に戻す
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // ホームに戻る
        setTimeout(() => {
            showPage('home');
        }, 2000);
    }, 1500);
}

// エクスポート
window.SpotReservation = {
    showPage,
    selectSpot,
    submitReservation
};