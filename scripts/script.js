// ホーム画面のJavaScript
let authService;
let storageService;
let notificationService;

// 初期化
document.addEventListener("DOMContentLoaded", () => {
  authService = window.AuthService;
  storageService = window.StorageService;
  notificationService = window.NotificationService;
  
  initializeAuth();
  setupEventListeners();
  showWelcomeMessage();
  updateNotificationBadge();
});

// 認証の初期化
function initializeAuth() {
  const authButton = document.getElementById('authButton');
  const userGreeting = document.getElementById('userGreeting');
  
  if (authService.isLoggedIn()) {
    const user = authService.getCurrentUser();
    
    // ユーザーグリーティング表示
    if (user) {
      const greetingText = user.isGuest ? 'ゲストユーザー' : `${user.name}さん`;
      userGreeting.textContent = greetingText;
      userGreeting.classList.remove('hidden');
    }
    
    // ボタンをプロフィール用に設定
    authButton.title = 'プロフィール';
    authButton.addEventListener('click', () => {
      window.location.href = 'user-profile.html';
    });
  } else {
    // ログインボタンとして設定
    authButton.title = 'ログイン';
    authButton.addEventListener('click', () => {
      window.location.href = '../pages/login.html';
    });
  }
}

// イベントリスナーの設定
function setupEventListeners() {
  // 通知トグル（既存機能）
  const toggle = document.getElementById("notification-toggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("active");
    });
  }

  // 認証状態の変化を監視
  if (authService) {
    authService.addEventListener((event, data) => {
      switch (event) {
        case 'loggedOut':
          // ログアウト時はログインページへリダイレクト
          window.location.href = '../pages/login.html';
          break;
        case 'profileUpdated':
          // プロフィール更新時にグリーティングを更新
          initializeAuth();
          break;
      }
    });
  }

  // 検索機能の初期化
  const searchInput = document.querySelector('input[type="text"]');
  if (searchInput) {
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        handleSearch(e.target.value);
      }
    });

    // 検索履歴の表示
    searchInput.addEventListener('focus', showSearchHistory);
  }
}

// ウェルカムメッセージの表示
function showWelcomeMessage() {
  if (!storageService) return;
  
  const welcomeData = storageService.get('welcome_message');
  if (welcomeData && welcomeData.show) {
    const toast = document.getElementById('welcome-toast');
    const messageElement = document.getElementById('welcome-message');
    
    if (toast && messageElement) {
      messageElement.textContent = welcomeData.message;
      toast.classList.remove('hidden');
      
      // 3秒後に自動で非表示
      setTimeout(() => {
        toast.classList.add('hidden');
        storageService.remove('welcome_message');
      }, 3000);
    }
  }
}

// 検索処理
function handleSearch(query) {
  if (!query.trim()) return;
  
  // 検索履歴に追加
  if (storageService) {
    storageService.searchHistory.add(query);
  }
  
  // 検索結果ページへ移動（仮実装）
  const searchUrl = `search-results.html?q=${encodeURIComponent(query)}`;
  window.location.href = searchUrl;
}

// 検索履歴の表示
function showSearchHistory() {
  if (!storageService) return;
  
  const history = storageService.searchHistory.get(5); // 最新5件
  if (history.length === 0) return;
  
  // 簡易的なドロップダウン表示（実装は省略）
  console.log('検索履歴:', history.map(h => h.query));
}

// 通知バッジの更新
function updateNotificationBadge() {
  if (!notificationService) return;
  
  const badge = document.getElementById('notification-badge');
  const unreadCount = notificationService.getUnreadCount();
  
  if (badge) {
    if (unreadCount > 0) {
      badge.textContent = unreadCount;
      badge.classList.remove('hidden');
    } else {
      badge.classList.add('hidden');
    }
  }
}

// ページ可視性の変化を監視
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // ページが再表示されたときに認証状態をチェック
    if (authService && !authService.isLoggedIn()) {
      window.location.href = '../pages/login.html';
    }
    
    // 通知バッジを更新
    updateNotificationBadge();
  }
});
