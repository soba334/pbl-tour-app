// ストレージサービス
class StorageService {
  constructor() {
    this.prefix = window.APP_CONFIG?.STORAGE?.PREFIX || 'niigata_tour_';
    this.cacheDuration = window.APP_CONFIG?.STORAGE?.CACHE_DURATION || (24 * 60 * 60 * 1000);
    this.maxCacheSize = window.APP_CONFIG?.STORAGE?.MAX_CACHE_SIZE || (50 * 1024 * 1024);
  }

  // データを保存
  set(key, value, options = {}) {
    try {
      const storageKey = this.prefix + key;
      const data = {
        value,
        timestamp: Date.now(),
        expires: options.expires || (Date.now() + this.cacheDuration),
        persistent: options.persistent || false
      };

      const serialized = JSON.stringify(data);
      
      // サイズチェック
      if (this.getStorageSize() + serialized.length > this.maxCacheSize) {
        this.cleanup();
      }

      localStorage.setItem(storageKey, serialized);
      return true;
    } catch (error) {
      console.error('Storage set failed:', error);
      return false;
    }
  }

  // データを取得
  get(key, defaultValue = null) {
    try {
      const storageKey = this.prefix + key;
      const item = localStorage.getItem(storageKey);
      
      if (!item) {
        return defaultValue;
      }

      const data = JSON.parse(item);
      
      // 有効期限チェック
      if (Date.now() > data.expires) {
        this.remove(key);
        return defaultValue;
      }

      return data.value;
    } catch (error) {
      console.error('Storage get failed:', error);
      return defaultValue;
    }
  }

  // データを削除
  remove(key) {
    try {
      const storageKey = this.prefix + key;
      localStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error('Storage remove failed:', error);
      return false;
    }
  }

  // キーが存在するかチェック
  has(key) {
    const storageKey = this.prefix + key;
    const item = localStorage.getItem(storageKey);
    
    if (!item) return false;
    
    try {
      const data = JSON.parse(item);
      return Date.now() <= data.expires;
    } catch {
      return false;
    }
  }

  // すべてのキーを取得
  keys() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(this.prefix)) {
        keys.push(key.substring(this.prefix.length));
      }
    }
    return keys;
  }

  // アプリのデータをすべてクリア
  clear() {
    const keys = this.keys();
    keys.forEach(key => this.remove(key));
  }

  // 期限切れデータのクリーンアップ
  cleanup() {
    const keys = this.keys();
    keys.forEach(key => {
      const storageKey = this.prefix + key;
      const item = localStorage.getItem(storageKey);
      
      if (item) {
        try {
          const data = JSON.parse(item);
          if (Date.now() > data.expires && !data.persistent) {
            localStorage.removeItem(storageKey);
          }
        } catch {
          localStorage.removeItem(storageKey);
        }
      }
    });
  }

  // ストレージサイズを取得
  getStorageSize() {
    let size = 0;
    const keys = this.keys();
    
    keys.forEach(key => {
      const storageKey = this.prefix + key;
      const item = localStorage.getItem(storageKey);
      if (item) {
        size += item.length;
      }
    });
    
    return size;
  }

  // お気に入り管理
  favorites = {
    add: (type, id) => {
      const key = `favorites_${type}`;
      const favorites = this.get(key, []);
      if (!favorites.includes(id)) {
        favorites.push(id);
        this.set(key, favorites, { persistent: true });
      }
      return favorites;
    },

    remove: (type, id) => {
      const key = `favorites_${type}`;
      const favorites = this.get(key, []);
      const filtered = favorites.filter(fid => fid !== id);
      this.set(key, filtered, { persistent: true });
      return filtered;
    },

    get: (type) => {
      return this.get(`favorites_${type}`, []);
    },

    has: (type, id) => {
      const favorites = this.get(`favorites_${type}`, []);
      return favorites.includes(id);
    }
  };

  // 検索履歴管理
  searchHistory = {
    add: (query) => {
      const history = this.get('search_history', []);
      const filtered = history.filter(item => item.query !== query);
      filtered.unshift({ query, timestamp: Date.now() });
      
      // 最新50件まで保持
      const limited = filtered.slice(0, 50);
      this.set('search_history', limited, { persistent: true });
      return limited;
    },

    get: (limit = 10) => {
      const history = this.get('search_history', []);
      return history.slice(0, limit);
    },

    clear: () => {
      this.remove('search_history');
    }
  };

  // 閲覧履歴管理
  viewHistory = {
    add: (type, item) => {
      const key = `view_history_${type}`;
      const history = this.get(key, []);
      
      // 重複削除
      const filtered = history.filter(h => h.id !== item.id);
      filtered.unshift({
        ...item,
        viewedAt: Date.now()
      });
      
      // 最新100件まで保持
      const limited = filtered.slice(0, 100);
      this.set(key, limited, { persistent: true });
      return limited;
    },

    get: (type, limit = 20) => {
      const history = this.get(`view_history_${type}`, []);
      return history.slice(0, limit);
    },

    clear: (type) => {
      this.remove(`view_history_${type}`);
    }
  };

  // ユーザー設定管理
  settings = {
    get: (key, defaultValue = null) => {
      const settings = this.get('user_settings', {});
      return settings[key] || defaultValue;
    },

    set: (key, value) => {
      const settings = this.get('user_settings', {});
      settings[key] = value;
      this.set('user_settings', settings, { persistent: true });
      return settings;
    },

    getAll: () => {
      return this.get('user_settings', {});
    },

    reset: () => {
      this.remove('user_settings');
    }
  };
}

// グローバルインスタンス
window.StorageService = new StorageService();

// Export removed for browser compatibility