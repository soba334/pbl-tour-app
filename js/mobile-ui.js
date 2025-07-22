// モバイルUI共通JavaScript

// Lucideアイコンの初期化
if (typeof lucide !== 'undefined') {
    lucide.createIcons();
}

// 共通DOM要素
let modal, modalContent, modalMessage, closeModalBtn;

// モーダル関連の初期化
function initModal() {
    modal = document.getElementById('message-modal');
    modalContent = document.getElementById('modal-content');
    modalMessage = document.getElementById('modal-message');
    closeModalBtn = document.getElementById('close-modal');
    
    if (modal && modalContent && modalMessage && closeModalBtn) {
        // 閉じるボタンとモーダルの背景クリックでモーダルを閉じる
        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }
}

// モーダルを表示する関数
function showModal(message) {
    if (!modal || !modalContent || !modalMessage) return;
    
    modalMessage.textContent = message;
    modal.classList.remove('hidden');
    modalContent.classList.remove('modal-leave');
    modalContent.classList.add('modal-enter');
}

// モーダルを閉じる関数
function closeModal() {
    if (!modal || !modalContent) return;
    
    modalContent.classList.remove('modal-enter');
    modalContent.classList.add('modal-leave');
    setTimeout(() => {
        modal.classList.add('hidden');
    }, 300); // アニメーションの時間と合わせる
}

// クリック可能要素の初期化
function initClickableElements() {
    const clickableElements = document.querySelectorAll('.clickable-button');
    
    clickableElements.forEach(el => {
        el.addEventListener('click', (e) => {
            // nav-btnクラスがある場合は処理をスキップ（event_calendar.jsに任せる）
            if (el.classList.contains('nav-btn')) {
                return;
            }
            
            // ボタンの名前を取得
            const buttonName = el.querySelector('span')?.innerText.trim().replace(/\n/g, '') || 
                              el.innerText.trim().replace(/\n/g, '') ||
                              'ボタン';
            
            // data-actionがある場合は特定のアクションを実行
            const action = el.getAttribute('data-action');
            if (action) {
                handleAction(action, buttonName);
            } else {
                // デフォルトはモーダル表示
                showModal(`「${buttonName}」がクリックされました`);
            }
        });
    });
}

// アクション処理
function handleAction(action, buttonName) {
    switch (action) {
        case 'navigate':
            const url = event.target.closest('.clickable-button').getAttribute('data-url');
            if (url) {
                window.location.href = url;
            } else {
                showModal(`「${buttonName}」のページに移動します`);
            }
            break;
        
        case 'back':
            window.history.back();
            break;
        
        case 'search':
            const searchInput = document.querySelector('.mobile-search-input');
            if (searchInput) {
                searchInput.focus();
            }
            break;
        
        case 'toggle':
            toggleElement(event.target.closest('.clickable-button'));
            break;
        
        default:
            showModal(`「${buttonName}」がクリックされました`);
    }
}

// 要素のトグル
function toggleElement(element) {
    if (element.classList.contains('active')) {
        element.classList.remove('active');
    } else {
        element.classList.add('active');
    }
}

// バックボタンの初期化
function initBackButton() {
    const backButton = document.querySelector('.back-button');
    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back();
        });
    }
}

// タブ切り替えの初期化
function initTabs() {
    const tabs = document.querySelectorAll('.mobile-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 全タブからactiveクラスを削除
            tabs.forEach(t => t.classList.remove('active'));
            // クリックされたタブにactiveクラスを追加
            tab.classList.add('active');
            
            // タブの内容を切り替える（data-tab属性を使用）
            const tabId = tab.getAttribute('data-tab');
            if (tabId) {
                switchTabContent(tabId);
            }
        });
    });
}

// タブ内容の切り替え
function switchTabContent(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        if (content.id === `tab-${tabId}`) {
            content.classList.remove('hidden');
        } else {
            content.classList.add('hidden');
        }
    });
}

// 検索機能の初期化
function initSearch() {
    const searchInput = document.querySelector('.mobile-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            filterItems(query);
        });
    }
}

// アイテムのフィルタリング
function filterItems(query) {
    const items = document.querySelectorAll('.filterable-item');
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query) || query === '') {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
}

// ページ読み込み時のアニメーション
function initAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-load');
    animatedElements.forEach((element, index) => {
        // 既にanimation-delayが設定されていない場合のみ設定
        if (!element.style.animationDelay) {
            element.style.animationDelay = `${index * 100}ms`;
        }
    });
}

// スクロール位置の復元
function restoreScrollPosition() {
    const scrollPosition = sessionStorage.getItem('scrollPosition');
    if (scrollPosition) {
        window.scrollTo(0, parseInt(scrollPosition));
        sessionStorage.removeItem('scrollPosition');
    }
}

// スクロール位置の保存
function saveScrollPosition() {
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
}

// リンク要素にスクロール位置保存を追加
function initScrollPositionSaving() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        link.addEventListener('click', saveScrollPosition);
    });
}

// ローディング状態の管理
function showLoading(container) {
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    if (container) {
        container.innerHTML = `
            <div class="mobile-loading">
                <div class="loading-spinner"></div>
            </div>
        `;
    }
}

function hideLoading(container) {
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    if (container) {
        const loading = container.querySelector('.mobile-loading');
        if (loading) {
            loading.remove();
        }
    }
}

// エラー状態の表示
function showError(container, message = 'エラーが発生しました') {
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    if (container) {
        container.innerHTML = `
            <div class="mobile-error-state">
                <p>${message}</p>
            </div>
        `;
    }
}

// 空状態の表示
function showEmpty(container, message = 'データがありません') {
    if (typeof container === 'string') {
        container = document.querySelector(container);
    }
    if (container) {
        container.innerHTML = `
            <div class="mobile-empty-state">
                <p>${message}</p>
            </div>
        `;
    }
}

// 初期化関数
function initMobileUI() {
    initModal();
    initClickableElements();
    initBackButton();
    initTabs();
    initSearch();
    initAnimations();
    initScrollPositionSaving();
    restoreScrollPosition();
    
    // Lucideアイコンの再初期化
    if (typeof lucide !== 'undefined') {
        setTimeout(() => {
            lucide.createIcons();
        }, 100);
    }
}

// DOMContentLoaded時に初期化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileUI);
} else {
    initMobileUI();
}

// エクスポート（他のスクリプトで使用可能）
window.MobileUI = {
    showModal,
    closeModal,
    showLoading,
    hideLoading,
    showError,
    showEmpty,
    filterItems,
    handleAction,
    switchTabContent
};