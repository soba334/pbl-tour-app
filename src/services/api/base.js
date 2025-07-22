// 基本APIサービス
class BaseAPIService {
  constructor() {
    this.baseURL = window.APP_CONFIG?.API?.BASE_URL || 'http://localhost:3000/api';
    this.timeout = window.APP_CONFIG?.API?.TIMEOUT || 10000;
    this.retryCount = window.APP_CONFIG?.API?.RETRY_COUNT || 3;
  }

  // HTTP リクエストの基本メソッド
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      timeout: this.timeout,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };

    let lastError;
    for (let attempt = 0; attempt <= this.retryCount; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), config.timeout);

        const response = await fetch(url, {
          ...config,
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        console.warn(`API request failed (attempt ${attempt + 1}):`, error.message);
        
        if (attempt < this.retryCount) {
          // 指数バックオフで待機
          await this.delay(Math.pow(2, attempt) * 1000);
        }
      }
    }

    throw new Error(`API request failed after ${this.retryCount + 1} attempts: ${lastError.message}`);
  }

  // GET リクエスト
  async get(endpoint, params = {}) {
    const searchParams = new URLSearchParams(params);
    const url = searchParams.toString() ? `${endpoint}?${searchParams}` : endpoint;
    
    return this.request(url, {
      method: 'GET'
    });
  }

  // POST リクエスト
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // PUT リクエスト
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // DELETE リクエスト
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE'
    });
  }

  // 認証ヘッダーの設定
  setAuthToken(token) {
    this.authToken = token;
    return this;
  }

  // 認証ヘッダーを追加
  getAuthHeaders() {
    return this.authToken ? {
      'Authorization': `Bearer ${this.authToken}`
    } : {};
  }

  // 遅延ユーティリティ
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // オフライン検出
  isOnline() {
    return navigator.onLine;
  }
}

// グローバルインスタンス
window.BaseAPIService = new BaseAPIService();

// Export removed for browser compatibility