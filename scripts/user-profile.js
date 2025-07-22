// ユーザープロフィールページのJavaScript
let authService;
let storageService;

// 初期化
onDOMReady(() => {
  console.log('user-profile.js: DOM読み込み完了');
  
  authService = window.AuthService;
  storageService = window.StorageService;
  
  if (!authService) {
    console.error('AuthService が見つかりません');
    window.location.href = '../pages/login.html';
    return;
  }
  
  // ログインしていない場合はログインページにリダイレクト
  if (!authService.isLoggedIn()) {
    console.log('ログインしていません、ログインページにリダイレクト');
    window.location.href = '../pages/login.html';
    return;
  }
  
  initializeProfile();
  setupEventListeners();
});

// プロフィール情報の初期化
function initializeProfile() {
  const currentUser = authService.getCurrentUser();
  
  if (!currentUser) {
    console.error('ユーザー情報が取得できません');
    return;
  }
  
  console.log('現在のユーザー:', currentUser);
  
  // ユーザー名の表示
  const userNameElement = document.getElementById('user-name');
  if (userNameElement) {
    userNameElement.textContent = currentUser.name || 'ユーザー名';
  }
  
  // メールアドレスの表示
  const userEmailElement = document.getElementById('user-email');
  if (userEmailElement) {
    if (currentUser.isGuest) {
      userEmailElement.textContent = 'ゲストユーザー';
    } else {
      userEmailElement.textContent = currentUser.email || 'メールアドレス';
    }
  }
  
  // ユーザータイプの表示
  const userTypeElement = document.getElementById('user-type');
  if (userTypeElement) {
    if (currentUser.isGuest) {
      userTypeElement.textContent = 'ゲスト';
      userTypeElement.className = 'inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-800';
    } else {
      userTypeElement.textContent = '会員';
      userTypeElement.className = 'inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800';
    }
  }
}

// イベントリスナーの設定
function setupEventListeners() {
  // ログアウトボタン
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', showLogoutModal);
  }
  
  // ログアウト確認モーダルのボタン
  const cancelLogoutButton = document.getElementById('cancel-logout');
  const confirmLogoutButton = document.getElementById('confirm-logout');
  
  if (cancelLogoutButton) {
    cancelLogoutButton.addEventListener('click', hideLogoutModal);
  }
  
  if (confirmLogoutButton) {
    confirmLogoutButton.addEventListener('click', handleLogout);
  }
  
  // 通知トグル（既存機能）
  const notificationToggle = document.getElementById('notification-toggle');
  if (notificationToggle) {
    notificationToggle.addEventListener('click', () => {
      notificationToggle.classList.toggle('active');
      
      // 設定を保存
      const isActive = notificationToggle.classList.contains('active');
      if (storageService) {
        storageService.settings.set('notifications_enabled', isActive);
      }
      
      showToast(isActive ? '通知が有効になりました' : '通知が無効になりました', 'success');
    });
  }
}

// ログアウト確認モーダルの表示
function showLogoutModal() {
  console.log('ログアウトモーダルを表示');
  const modal = document.getElementById('logout-modal');
  if (modal) {
    modal.classList.remove('hidden');
    
    // アニメーション用のクラスを追加
    setTimeout(() => {
      const modalContent = modal.querySelector('div > div');
      if (modalContent) {
        modalContent.classList.add('modal-enter');
      }
    }, 10);
  }
}

// ログアウト確認モーダルの非表示
function hideLogoutModal() {
  console.log('ログアウトモーダルを非表示');
  const modal = document.getElementById('logout-modal');
  if (modal) {
    const modalContent = modal.querySelector('div > div');
    if (modalContent) {
      modalContent.classList.add('modal-leave');
      
      setTimeout(() => {
        modal.classList.add('hidden');
        modalContent.classList.remove('modal-enter', 'modal-leave');
      }, 300);
    }
  }
}

// ログアウト処理
async function handleLogout() {
  console.log('ログアウト処理を開始');
  
  // ボタンを無効化
  const confirmButton = document.getElementById('confirm-logout');
  if (confirmButton) {
    confirmButton.textContent = 'ログアウト中...';
    confirmButton.disabled = true;
  }
  
  try {
    const result = await authService.logout();
    console.log('ログアウト結果:', result);
    
    if (result.success) {
      console.log('ログアウト成功');
      
      // 成功メッセージを表示してからリダイレクト
      showToast('ログアウトしました', 'success');
      
      // 少し待ってからログインページにリダイレクト
      setTimeout(() => {
        window.location.href = '../pages/login.html';
      }, 1500);
    } else {
      console.error('ログアウト失敗:', result.error);
      showToast('ログアウトに失敗しました', 'error');
      
      // ボタンを元に戻す
      if (confirmButton) {
        confirmButton.textContent = 'ログアウト';
        confirmButton.disabled = false;
      }
    }
  } catch (error) {
    console.error('ログアウトエラー:', error);
    showToast('ログアウト中にエラーが発生しました', 'error');
    
    // ボタンを元に戻す
    if (confirmButton) {
      confirmButton.textContent = 'ログアウト';
      confirmButton.disabled = false;
    }
  } finally {
    hideLogoutModal();
  }
}

// トースト通知の表示
function showToast(message, type = 'info') {
  const toastContainer = getOrCreateToastContainer();
  const toast = createToastElement(message, type);
  
  toastContainer.appendChild(toast);
  
  // アニメーション
  setTimeout(() => {
    toast.classList.remove('translate-x-full');
  }, 100);
  
  // 自動削除
  setTimeout(() => {
    toast.classList.add('translate-x-full');
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// トーストコンテナの取得または作成
function getOrCreateToastContainer() {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed top-4 right-4 z-50 space-y-2';
    document.body.appendChild(container);
  }
  return container;
}

// トースト要素の作成
function createToastElement(message, type) {
  const typeStyles = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };
  
  const typeIcons = {
    info: 'info',
    success: 'check-circle',
    warning: 'alert-triangle',
    error: 'x-circle'
  };
  
  const toast = document.createElement('div');
  toast.className = `${typeStyles[type]} text-white p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
  toast.innerHTML = `
    <div class="flex items-center">
      <i data-lucide="${typeIcons[type]}" class="w-5 h-5 mr-2"></i>
      <span class="font-medium">${message}</span>
    </div>
  `;
  
  // Lucideアイコンを初期化
  setTimeout(() => {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }, 10);
  
  return toast;
}

// ページの可視性変更を監視
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    // ページが再表示されたときに認証状態をチェック
    if (authService && !authService.isLoggedIn()) {
      console.log('認証状態が無効、ログインページにリダイレクト');
      window.location.href = '../pages/login.html';
    }
  }
});