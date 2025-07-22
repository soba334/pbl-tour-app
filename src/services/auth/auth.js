// 認証サービス
class AuthService {
  constructor() {
    this.storageKey = 'niigata_tour_auth';
    this.currentUser = null;
    this.refreshTimer = null;
    this.listeners = [];
    
    this.init();
  }

  // 初期化
  init() {
    this.loadUserFromStorage();
    this.setupRefreshTimer();
  }

  // ユーザー登録
  async register(userData) {
    try {
      // 実際のAPIでは外部サービスと連携
      const response = await this.mockAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.success) {
        await this.setCurrentUser(response.user, response.token);
        this.notifyListeners('registered', response.user);
        return { success: true, user: response.user };
      }

      throw new Error(response.message);
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, error: error.message };
    }
  }

  // ログイン
  async login(email, password) {
    try {
      // 実際のAPIでは外部認証サービスと連携
      const response = await this.mockAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      if (response.success) {
        await this.setCurrentUser(response.user, response.token);
        this.notifyListeners('loggedIn', response.user);
        return { success: true, user: response.user };
      }

      throw new Error(response.message);
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, error: error.message };
    }
  }

  // ゲストログイン
  async loginAsGuest() {
    const guestUser = {
      id: 'guest_' + Date.now(),
      email: 'guest@example.com',
      name: 'ゲストユーザー',
      isGuest: true,
      preferences: {
        language: 'ja',
        notifications: true
      }
    };

    await this.setCurrentUser(guestUser);
    this.notifyListeners('loggedIn', guestUser);
    return { success: true, user: guestUser };
  }

  // ログアウト
  async logout() {
    try {
      if (!this.isGuest()) {
        // 実際のAPIではサーバーサイドのセッション無効化
        await this.mockAPI('/auth/logout', {
          method: 'POST'
        });
      }

      this.clearCurrentUser();
      this.notifyListeners('loggedOut');
      return { success: true };
    } catch (error) {
      console.error('Logout failed:', error);
      // ログアウトは失敗してもローカルデータを削除
      this.clearCurrentUser();
      this.notifyListeners('loggedOut');
      return { success: true };
    }
  }

  // 現在のユーザー設定
  async setCurrentUser(user, token = null) {
    this.currentUser = user;
    
    const authData = {
      user,
      token,
      timestamp: Date.now()
    };

    localStorage.setItem(this.storageKey, JSON.stringify(authData));
    
    if (token && window.BaseAPIService) {
      window.BaseAPIService.setAuthToken(token);
    }
  }

  // ユーザー情報をストレージから読み込み
  loadUserFromStorage() {
    try {
      const authData = localStorage.getItem(this.storageKey);
      if (authData) {
        const { user, token, timestamp } = JSON.parse(authData);
        
        // セッションの有効期限チェック
        const sessionTimeout = window.APP_CONFIG?.AUTH?.SESSION_TIMEOUT || (7 * 24 * 60 * 60 * 1000);
        if (Date.now() - timestamp < sessionTimeout) {
          this.currentUser = user;
          if (token && window.BaseAPIService) {
            window.BaseAPIService.setAuthToken(token);
          }
        } else {
          this.clearCurrentUser();
        }
      }
    } catch (error) {
      console.error('Failed to load user from storage:', error);
      this.clearCurrentUser();
    }
  }

  // 現在のユーザーをクリア
  clearCurrentUser() {
    this.currentUser = null;
    localStorage.removeItem(this.storageKey);
    
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }

  // ログイン状態チェック
  isLoggedIn() {
    return this.currentUser !== null;
  }

  // ゲストユーザーかチェック
  isGuest() {
    return this.currentUser?.isGuest === true;
  }

  // 現在のユーザー取得
  getCurrentUser() {
    return this.currentUser;
  }

  // ユーザープロフィール更新
  async updateProfile(updates) {
    if (!this.isLoggedIn()) {
      throw new Error('ログインが必要です');
    }

    try {
      const response = await this.mockAPI('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      if (response.success) {
        this.currentUser = { ...this.currentUser, ...response.user };
        await this.setCurrentUser(this.currentUser);
        this.notifyListeners('profileUpdated', this.currentUser);
        return { success: true, user: this.currentUser };
      }

      throw new Error(response.message);
    } catch (error) {
      console.error('Profile update failed:', error);
      return { success: false, error: error.message };
    }
  }

  // リフレッシュタイマー設定
  setupRefreshTimer() {
    const refreshThreshold = window.APP_CONFIG?.AUTH?.REFRESH_THRESHOLD || (60 * 60 * 1000);
    
    this.refreshTimer = setInterval(() => {
      if (this.isLoggedIn() && !this.isGuest()) {
        this.refreshToken();
      }
    }, refreshThreshold);
  }

  // トークンリフレッシュ
  async refreshToken() {
    try {
      const response = await this.mockAPI('/auth/refresh', {
        method: 'POST'
      });

      if (response.success && response.token) {
        await this.setCurrentUser(this.currentUser, response.token);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      // リフレッシュ失敗時はログアウト
      this.logout();
    }
  }

  // イベントリスナー追加
  addEventListener(callback) {
    this.listeners.push(callback);
  }

  // イベントリスナー削除
  removeEventListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  // リスナーに通知
  notifyListeners(event, data = null) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Auth listener error:', error);
      }
    });
  }

  // モックAPI（実際の実装では削除）
  async mockAPI(endpoint, options = {}) {
    // 開発用のモックレスポンス
    await new Promise(resolve => setTimeout(resolve, 500));

    if (endpoint === '/auth/login') {
      const { email, password } = JSON.parse(options.body);
      if (email === 'user@example.com' && password === 'password') {
        return {
          success: true,
          user: {
            id: '1',
            email: 'user@example.com',
            name: '山田太郎',
            avatar: null,
            preferences: {
              language: 'ja',
              notifications: true
            }
          },
          token: 'mock_jwt_token_' + Date.now()
        };
      }
      return { success: false, message: 'メールアドレスまたはパスワードが間違っています' };
    }

    if (endpoint === '/auth/register') {
      const userData = JSON.parse(options.body);
      return {
        success: true,
        user: {
          id: Date.now().toString(),
          ...userData,
          avatar: null,
          preferences: {
            language: 'ja',
            notifications: true
          }
        },
        token: 'mock_jwt_token_' + Date.now()
      };
    }

    return { success: true };
  }
}

// グローバルインスタンス
window.AuthService = new AuthService();

// Export removed for browser compatibility