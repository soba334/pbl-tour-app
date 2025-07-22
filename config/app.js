// アプリケーション設定
const APP_CONFIG = {
  // API設定
  API: {
    BASE_URL: 'https://api.niigata-tourism.jp', // 仮想API
    TIMEOUT: 10000,
    RETRY_COUNT: 3
  },

  // 地図設定
  MAPS: {
    GOOGLE_MAPS_API_KEY: 'YOUR_GOOGLE_MAPS_API_KEY',
    DEFAULT_CENTER: {
      lat: 37.9161, // 新潟市中心部
      lng: 139.0364
    },
    DEFAULT_ZOOM: 11
  },

  // 認証設定
  AUTH: {
    SESSION_TIMEOUT: 7 * 24 * 60 * 60 * 1000, // 7日間
    REFRESH_THRESHOLD: 60 * 60 * 1000 // 1時間前にリフレッシュ
  },

  // ストレージ設定
  STORAGE: {
    PREFIX: 'niigata_tour_',
    CACHE_DURATION: 24 * 60 * 60 * 1000, // 24時間
    MAX_CACHE_SIZE: 50 * 1024 * 1024 // 50MB
  },

  // アプリ情報
  APP: {
    NAME: '新潟観光アプリ',
    VERSION: '1.0.0',
    AUTHOR: 'Niigata Tourism Board',
    DESCRIPTION: '新潟の魅力を発見する観光アプリ'
  },

  // 機能フラグ
  FEATURES: {
    OFFLINE_MODE: true,
    PUSH_NOTIFICATIONS: true,
    AR_FEATURES: false,
    SOCIAL_SHARING: true,
    MULTI_LANGUAGE: false
  }
};

// 環境別設定
const ENV_CONFIG = {
  development: {
    DEBUG: true,
    LOG_LEVEL: 'debug',
    API: {
      ...APP_CONFIG.API,
      BASE_URL: 'http://localhost:3000/api'
    }
  },
  production: {
    DEBUG: false,
    LOG_LEVEL: 'error',
    API: APP_CONFIG.API
  }
};

// 現在の環境を検出
const getCurrentEnvironment = () => {
  if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
    return 'development';
  }
  return 'production';
};

// 設定を統合
const config = {
  ...APP_CONFIG,
  ...ENV_CONFIG[getCurrentEnvironment()]
};

// グローバルに公開
window.APP_CONFIG = config;

// Export removed for browser compatibility