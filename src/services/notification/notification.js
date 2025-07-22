// 通知システムサービス
class NotificationService {
  constructor() {
    this.config = window.APP_CONFIG?.NOTIFICATION || {};
    this.permission = 'default';
    this.storageService = window.StorageService;
    this.isSupported = 'Notification' in window;
    this.isServiceWorkerSupported = 'serviceWorker' in navigator;
    this.subscriptions = new Map();
    
    this.init();
  }

  // 初期化
  async init() {
    if (!this.isSupported) {
      console.warn('Notifications not supported');
      return;
    }

    this.permission = Notification.permission;
    
    // サービスワーカー登録（PWA対応）
    if (this.isServiceWorkerSupported) {
      try {
        await this.registerServiceWorker();
      } catch (error) {
        console.warn('Service Worker registration failed:', error);
      }
    }

    // 保存されている通知設定を復元
    this.loadSettings();
    
    // バックグラウンド通知のスケジュール復元
    this.restoreScheduledNotifications();
  }

  // 通知権限の要求
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Notifications not supported');
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      
      if (permission === 'granted') {
        this.storageService?.settings.set('notification_permission', true);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Permission request failed:', error);
      return false;
    }
  }

  // インスタント通知の表示
  async showNotification(options = {}) {
    const {
      title = 'にいがたび',
      body = '',
      icon = '../assets/images/icon/notification-icon.png',
      badge = '../assets/images/icon/badge-icon.png',
      tag = '',
      data = {},
      actions = [],
      requireInteraction = false,
      silent = false,
      vibrate = [100, 50, 100]
    } = options;

    if (!this.isSupported || this.permission !== 'granted') {
      // フォールバック：アプリ内通知
      this.showInAppNotification({ title, body, type: data.type || 'info' });
      return null;
    }

    try {
      const notification = new Notification(title, {
        body,
        icon,
        badge,
        tag,
        data: { 
          ...data, 
          timestamp: Date.now(),
          app: 'niigata-tour'
        },
        actions,
        requireInteraction,
        silent,
        vibrate: vibrate && navigator.vibrate ? vibrate : undefined
      });

      // 通知イベントリスナー
      notification.onclick = (event) => {
        event.preventDefault();
        this.handleNotificationClick(notification.data);
        notification.close();
      };

      notification.onclose = () => {
        this.handleNotificationClose(notification.data);
      };

      // 通知履歴に保存
      this.saveNotificationHistory({
        title,
        body,
        timestamp: Date.now(),
        type: data.type || 'info',
        read: false
      });

      return notification;
    } catch (error) {
      console.error('Notification display failed:', error);
      this.showInAppNotification({ title, body, type: data.type || 'error' });
      return null;
    }
  }

  // アプリ内通知表示
  showInAppNotification(options = {}) {
    const { title, body, type = 'info', duration = 5000 } = options;
    
    // 通知コンテナを取得または作成
    let container = document.getElementById('notification-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'notification-container';
      container.className = 'fixed top-4 right-4 z-50 space-y-2';
      document.body.appendChild(container);
    }

    // 通知要素を作成
    const notification = document.createElement('div');
    const typeStyles = {
      info: 'bg-blue-500',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      error: 'bg-red-500'
    };

    notification.className = `${typeStyles[type]} text-white p-4 rounded-lg shadow-lg max-w-sm transform translate-x-full transition-transform duration-300`;
    notification.innerHTML = `
      <div class="flex items-start">
        <div class="flex-1">
          <h4 class="font-bold text-sm mb-1">${title}</h4>
          <p class="text-sm opacity-90">${body}</p>
        </div>
        <button class="ml-2 text-white hover:text-gray-200" onclick="this.parentElement.parentElement.remove()">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    `;

    container.appendChild(notification);

    // アニメーション
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    // 自動削除
    if (duration > 0) {
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => notification.remove(), 300);
      }, duration);
    }
  }

  // スケジュール通知
  scheduleNotification(options = {}) {
    const {
      id = `scheduled_${Date.now()}`,
      title = 'にいがたび',
      body = '',
      scheduledTime,
      repeat = false,
      repeatInterval = 'daily'
    } = options;

    if (!scheduledTime || scheduledTime <= Date.now()) {
      throw new Error('Invalid scheduled time');
    }

    const notification = {
      id,
      title,
      body,
      scheduledTime,
      repeat,
      repeatInterval,
      created: Date.now(),
      status: 'scheduled'
    };

    // ローカルストレージに保存
    const scheduled = this.storageService?.get('scheduled_notifications', []);
    scheduled.push(notification);
    this.storageService?.set('scheduled_notifications', scheduled, { persistent: true });

    // タイマー設定
    const delay = scheduledTime - Date.now();
    const timeoutId = setTimeout(() => {
      this.triggerScheduledNotification(id);
    }, delay);

    this.subscriptions.set(id, timeoutId);

    return id;
  }

  // スケジュール通知のトリガー
  async triggerScheduledNotification(id) {
    const scheduled = this.storageService?.get('scheduled_notifications', []);
    const notification = scheduled.find(n => n.id === id);

    if (!notification || notification.status !== 'scheduled') {
      return;
    }

    // 通知実行
    await this.showNotification({
      title: notification.title,
      body: notification.body,
      data: { type: 'scheduled', id }
    });

    // 繰り返し設定
    if (notification.repeat) {
      const nextTime = this.calculateNextRepeatTime(notification.scheduledTime, notification.repeatInterval);
      notification.scheduledTime = nextTime;
      
      // 次のスケジュール設定
      const delay = nextTime - Date.now();
      const timeoutId = setTimeout(() => {
        this.triggerScheduledNotification(id);
      }, delay);
      
      this.subscriptions.set(id, timeoutId);
    } else {
      // 完了マーク
      notification.status = 'completed';
      this.subscriptions.delete(id);
    }

    // 更新を保存
    this.storageService?.set('scheduled_notifications', scheduled, { persistent: true });
  }

  // 繰り返し時間の計算
  calculateNextRepeatTime(currentTime, interval) {
    const date = new Date(currentTime);
    
    switch (interval) {
      case 'hourly':
        date.setHours(date.getHours() + 1);
        break;
      case 'daily':
        date.setDate(date.getDate() + 1);
        break;
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
      default:
        date.setDate(date.getDate() + 1);
    }
    
    return date.getTime();
  }

  // 通知クリック処理
  handleNotificationClick(data) {
    // フォーカスをアプリに移す
    if (window.focus) {
      window.focus();
    }

    // データに応じてアクション実行
    if (data.url) {
      window.location.href = data.url;
    } else if (data.action) {
      this.executeNotificationAction(data.action, data);
    }

    // 分析データ送信
    this.trackNotificationEvent('click', data);
  }

  // 通知アクション実行
  executeNotificationAction(action, data) {
    switch (action) {
      case 'openSpot':
        window.location.href = `spot-detail.html?id=${data.spotId}`;
        break;
      case 'openEvent':
        window.location.href = `event-detail.html?id=${data.eventId}`;
        break;
      case 'openReservation':
        window.location.href = 'spot-reservation.html';
        break;
      default:
        console.warn('Unknown notification action:', action);
    }
  }

  // 通知履歴の保存
  saveNotificationHistory(notification) {
    const history = this.storageService?.get('notification_history', []);
    history.unshift(notification);
    
    // 最新100件まで保持
    const limited = history.slice(0, 100);
    this.storageService?.set('notification_history', limited, { persistent: true });
  }

  // 通知履歴の取得
  getNotificationHistory(limit = 20) {
    return this.storageService?.get('notification_history', []).slice(0, limit) || [];
  }

  // 未読通知数の取得
  getUnreadCount() {
    const history = this.getNotificationHistory();
    return history.filter(n => !n.read).length;
  }

  // 通知を既読にマーク
  markAsRead(timestamp) {
    const history = this.storageService?.get('notification_history', []);
    const notification = history.find(n => n.timestamp === timestamp);
    if (notification) {
      notification.read = true;
      this.storageService?.set('notification_history', history, { persistent: true });
    }
  }

  // すべて既読にマーク
  markAllAsRead() {
    const history = this.storageService?.get('notification_history', []);
    history.forEach(n => n.read = true);
    this.storageService?.set('notification_history', history, { persistent: true });
  }

  // サービスワーカー登録
  async registerServiceWorker() {
    if (!this.isServiceWorkerSupported) {
      throw new Error('Service Worker not supported');
    }

    const registration = await navigator.serviceWorker.register('../sw.js');
    console.log('Service Worker registered:', registration);
    return registration;
  }

  // 設定の保存と読み込み
  loadSettings() {
    const settings = this.storageService?.settings.getAll() || {};
    this.settings = {
      enabled: settings.notifications_enabled !== false,
      sound: settings.notification_sound !== false,
      vibration: settings.notification_vibration !== false,
      inApp: settings.notification_inapp !== false,
      ...settings
    };
  }

  updateSetting(key, value) {
    this.settings[key] = value;
    this.storageService?.settings.set(`notification_${key}`, value);
  }

  // スケジュール済み通知の復元
  restoreScheduledNotifications() {
    const scheduled = this.storageService?.get('scheduled_notifications', []);
    const now = Date.now();

    scheduled.forEach(notification => {
      if (notification.status === 'scheduled' && notification.scheduledTime > now) {
        const delay = notification.scheduledTime - now;
        const timeoutId = setTimeout(() => {
          this.triggerScheduledNotification(notification.id);
        }, delay);
        
        this.subscriptions.set(notification.id, timeoutId);
      }
    });
  }

  // 分析イベント送信
  trackNotificationEvent(event, data) {
    // 将来的に分析サービスと連携
    console.log('Notification event:', event, data);
  }

  // 通知クリア
  clearNotification(tag) {
    if (this.isSupported) {
      // ブラウザ通知をクリア
      if (navigator.serviceWorker && navigator.serviceWorker.ready) {
        navigator.serviceWorker.ready.then(registration => {
          registration.getNotifications({ tag }).then(notifications => {
            notifications.forEach(notification => notification.close());
          });
        });
      }
    }
  }

  // すべての通知をクリア
  clearAllNotifications() {
    if (this.isSupported && navigator.serviceWorker && navigator.serviceWorker.ready) {
      navigator.serviceWorker.ready.then(registration => {
        registration.getNotifications().then(notifications => {
          notifications.forEach(notification => notification.close());
        });
      });
    }
  }

  // デストラクタ
  destroy() {
    // タイマーをクリア
    this.subscriptions.forEach(timeoutId => {
      clearTimeout(timeoutId);
    });
    this.subscriptions.clear();
  }
}

// グローバルインスタンス
window.NotificationService = new NotificationService();

// Export removed for browser compatibility