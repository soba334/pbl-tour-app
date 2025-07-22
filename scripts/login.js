// ログインページの JavaScript
let authService;
let isLoading = false;

// 初期化
onDOMReady(() => {
  console.log('login.js: DOM読み込み完了');
  
  authService = window.AuthService;
  console.log('AuthService:', authService);
  
  if (!authService) {
    console.error('AuthService が見つかりません');
    return;
  }
  
  // すでにログインしている場合はホームページへリダイレクト
  if (authService.isLoggedIn()) {
    console.log('既にログイン済み、リダイレクトします');
    window.location.href = '../pages/index.html';
    return;
  }

  console.log('イベントリスナーを初期化します');
  initializeEventListeners();
  setupFormValidation();
});

// イベントリスナーの初期化
function initializeEventListeners() {
  // ログインフォーム
  const loginForm = document.getElementById('loginForm');
  loginForm.addEventListener('submit', handleLogin);

  // 新規登録フォーム
  const registerForm = document.getElementById('registerForm');
  registerForm.addEventListener('submit', handleRegister);

  // ゲストログイン
  const guestLoginButton = document.getElementById('guestLoginButton');
  console.log('ゲストログインボタン:', guestLoginButton);
  
  if (guestLoginButton) {
    guestLoginButton.addEventListener('click', (e) => {
      console.log('ゲストログインボタンがクリックされました');
      e.preventDefault();
      handleGuestLogin();
    });
  } else {
    console.error('ゲストログインボタンが見つかりません');
  }

  // パスワード表示切り替え
  const togglePasswordButton = document.getElementById('togglePassword');
  togglePasswordButton.addEventListener('click', togglePasswordVisibility);

  // 新規登録フォーム表示/非表示
  const showRegisterButton = document.getElementById('showRegisterForm');
  const cancelRegisterButton = document.getElementById('cancelRegister');
  const registerContainer = document.getElementById('registerFormContainer');

  showRegisterButton.addEventListener('click', () => {
    registerContainer.classList.remove('hidden');
    showRegisterButton.parentElement.style.display = 'none';
    registerContainer.scrollIntoView({ behavior: 'smooth' });
  });

  cancelRegisterButton.addEventListener('click', () => {
    registerContainer.classList.add('hidden');
    showRegisterButton.parentElement.style.display = 'block';
    clearRegisterForm();
  });

  // 認証イベントリスナー
  authService.addEventListener((event, data) => {
    switch (event) {
      case 'loggedIn':
        handleLoginSuccess(data);
        break;
      case 'registered':
        handleRegisterSuccess(data);
        break;
    }
  });
}

// ログイン処理
async function handleLogin(e) {
  e.preventDefault();
  
  if (isLoading) return;

  const formData = new FormData(e.target);
  const email = formData.get('email').trim();
  const password = formData.get('password');

  if (!validateEmail(email)) {
    showMessage('有効なメールアドレスを入力してください', 'error');
    return;
  }

  if (!password) {
    showMessage('パスワードを入力してください', 'error');
    return;
  }

  setLoading(true);

  try {
    const result = await authService.login(email, password);
    
    if (result.success) {
      showToast('ログインしました', 'success');
      // handleLoginSuccessで自動的にリダイレクト
    } else {
      showMessage(result.error || 'ログインに失敗しました', 'error');
    }
  } catch (error) {
    console.error('Login error:', error);
    showMessage('ログイン中にエラーが発生しました', 'error');
  } finally {
    setLoading(false);
  }
}

// 新規登録処理
async function handleRegister(e) {
  e.preventDefault();
  
  if (isLoading) return;

  const formData = new FormData(e.target);
  const name = formData.get('name').trim();
  const email = formData.get('email').trim();
  const password = formData.get('password');

  if (!name) {
    showMessage('お名前を入力してください', 'error');
    return;
  }

  if (!validateEmail(email)) {
    showMessage('有効なメールアドレスを入力してください', 'error');
    return;
  }

  if (password.length < 8) {
    showMessage('パスワードは8文字以上で入力してください', 'error');
    return;
  }

  setLoading(true);

  try {
    const result = await authService.register({ name, email, password });
    
    if (result.success) {
      showToast('アカウントが作成されました', 'success');
      // handleRegisterSuccessで自動的にリダイレクト
    } else {
      showMessage(result.error || 'アカウント作成に失敗しました', 'error');
    }
  } catch (error) {
    console.error('Register error:', error);
    showMessage('アカウント作成中にエラーが発生しました', 'error');
  } finally {
    setLoading(false);
  }
}

// ゲストログイン処理
async function handleGuestLogin() {
  console.log('handleGuestLogin が呼ばれました');
  
  if (isLoading) {
    console.log('既に読み込み中です');
    return;
  }

  if (!authService) {
    console.error('AuthService が利用できません');
    showMessage('認証サービスが利用できません', 'error');
    return;
  }

  setLoading(true);
  console.log('ゲストログインを開始します');

  try {
    const result = await authService.loginAsGuest();
    console.log('ゲストログイン結果:', result);
    
    if (result.success) {
      console.log('ゲストログイン成功');
      showToast('ゲストとしてログインしました', 'success');
      // handleLoginSuccessで自動的にリダイレクト
    } else {
      console.error('ゲストログイン失敗:', result.error);
      showMessage('ゲストログインに失敗しました', 'error');
    }
  } catch (error) {
    console.error('Guest login error:', error);
    showMessage('ゲストログイン中にエラーが発生しました: ' + error.message, 'error');
  } finally {
    setLoading(false);
  }
}

// ログイン成功時の処理
function handleLoginSuccess(user) {
  // ウェルカムメッセージを保存
  if (window.StorageService) {
    window.StorageService.set('welcome_message', {
      show: true,
      message: user.isGuest ? 'ゲストとしてログインしました' : `おかえりなさい、${user.name}さん！`,
      timestamp: Date.now()
    }, { expires: Date.now() + 5000 }); // 5秒後に期限切れ
  }

  // ホームページへリダイレクト
  setTimeout(() => {
    window.location.href = '../pages/index.html';
  }, 1000);
}

// 新規登録成功時の処理
function handleRegisterSuccess(user) {
  // ウェルカムメッセージを保存
  if (window.StorageService) {
    window.StorageService.set('welcome_message', {
      show: true,
      message: `ようこそ、${user.name}さん！`,
      timestamp: Date.now()
    }, { expires: Date.now() + 5000 }); // 5秒後に期限切れ
  }

  // ホームページへリダイレクト
  setTimeout(() => {
    window.location.href = '../pages/index.html';
  }, 1000);
}

// パスワード表示切り替え
function togglePasswordVisibility() {
  const passwordInput = document.getElementById('password');
  const toggleIcon = document.querySelector('#togglePassword i');
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    toggleIcon.setAttribute('data-lucide', 'eye-off');
  } else {
    passwordInput.type = 'password';
    toggleIcon.setAttribute('data-lucide', 'eye');
  }
  
  // Lucideアイコンを再初期化
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// フォームバリデーションの設定
function setupFormValidation() {
  // リアルタイムバリデーション
  const emailInputs = document.querySelectorAll('input[type="email"]');
  emailInputs.forEach(input => {
    input.addEventListener('blur', (e) => {
      const email = e.target.value.trim();
      if (email && !validateEmail(email)) {
        showFieldError(e.target, 'メールアドレスの形式が正しくありません');
      } else {
        clearFieldError(e.target);
      }
    });
  });

  const passwordInput = document.getElementById('registerPassword');
  if (passwordInput) {
    passwordInput.addEventListener('blur', (e) => {
      const password = e.target.value;
      if (password && password.length < 8) {
        showFieldError(e.target, 'パスワードは8文字以上で入力してください');
      } else {
        clearFieldError(e.target);
      }
    });
  }
}

// メールアドレス検証
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// フィールドエラー表示
function showFieldError(input, message) {
  clearFieldError(input);
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'field-error text-red-500 text-xs mt-1';
  errorDiv.textContent = message;
  
  input.parentNode.appendChild(errorDiv);
  input.classList.add('border-red-300', 'focus:border-red-400', 'focus:ring-red-400');
}

// フィールドエラークリア
function clearFieldError(input) {
  const errorDiv = input.parentNode.querySelector('.field-error');
  if (errorDiv) {
    errorDiv.remove();
  }
  
  input.classList.remove('border-red-300', 'focus:border-red-400', 'focus:ring-red-400');
}

// 新規登録フォームクリア
function clearRegisterForm() {
  const form = document.getElementById('registerForm');
  form.reset();
  
  // エラーメッセージもクリア
  const errorDivs = form.querySelectorAll('.field-error');
  errorDivs.forEach(div => div.remove());
}

// ローディング状態の管理
function setLoading(loading) {
  isLoading = loading;
  const overlay = document.getElementById('loadingOverlay');
  const buttons = document.querySelectorAll('button[type="submit"], #guestLoginButton');
  
  if (loading) {
    overlay.classList.remove('hidden');
    buttons.forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.6';
    });
  } else {
    overlay.classList.add('hidden');
    buttons.forEach(btn => {
      btn.disabled = false;
      btn.style.opacity = '1';
    });
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
    container.className = 'fixed top-20 right-4 z-50 space-y-2';
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

// メッセージ表示（エラー用のモーダルダイアログ）
function showMessage(message, type = 'info') {
  if (window.MobileUI && window.MobileUI.showModal) {
    window.MobileUI.showModal(message);
  } else {
    alert(message);
  }
  
  // 成功メッセージの場合は色を変える
  const modal = document.getElementById('message-modal');
  const modalContent = document.getElementById('modal-content');
  
  if (modal && modalContent) {
    if (type === 'success') {
      modalContent.style.borderLeft = '4px solid #10b981';
    } else if (type === 'error') {
      modalContent.style.borderLeft = '4px solid #ef4444';
    } else {
      modalContent.style.borderLeft = '4px solid #6b7280';
    }
  }
}