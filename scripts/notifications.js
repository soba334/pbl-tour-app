// 通知設定ページの JavaScript
let notificationService;

// 初期化
onDOMReady(() => {
  notificationService = window.NotificationService;
  
  initializeUI();
  setupEventListeners();
  loadNotificationHistory();
});

// UIの初期化
function initializeUI() {
  updatePermissionStatus();
  loadSettings();
  updateUnreadCount();
}

// イベントリスナーの設定
function setupEventListeners() {
  // 許可要求ボタン
  const requestButton = document.getElementById('request-permission');
  requestButton?.addEventListener('click', requestNotificationPermission);

  // 設定変更リスナー
  const settingInputs = document.querySelectorAll('input[type="checkbox"]');
  settingInputs.forEach(input => {
    input.addEventListener('change', handleSettingChange);
  });

  // 履歴関連ボタン
  const markAllReadButton = document.getElementById('mark-all-read');
  markAllReadButton?.addEventListener('click', markAllNotificationsRead);

  // テストボタン
  const testNotificationButton = document.getElementById('test-notification');
  testNotificationButton?.addEventListener('click', sendTestNotification);

  const testScheduledButton = document.getElementById('test-scheduled');
  testScheduledButton?.addEventListener('click', sendScheduledTestNotification);
}

// 通知許可状態の更新
function updatePermissionStatus() {
  const icon = document.getElementById('permission-icon');
  const status = document.getElementById('permission-status');
  const requestButton = document.getElementById('request-permission');

  if (!notificationService?.isSupported) {
    icon.className = 'w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-3';
    icon.querySelector('i').className = 'w-5 h-5 text-gray-500';
    status.textContent = 'この端末では通知がサポートされていません';
    requestButton.classList.add('hidden');
    return;
  }

  const permission = notificationService.permission;
  
  switch (permission) {
    case 'granted':
      icon.className = 'w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3';
      icon.querySelector('i').className = 'w-5 h-5 text-green-600';
      status.textContent = '通知が許可されています';
      requestButton.classList.add('hidden');
      break;
    
    case 'denied':
      icon.className = 'w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3';
      icon.querySelector('i').className = 'w-5 h-5 text-red-600';
      status.textContent = '通知が拒否されています（ブラウザ設定を確認）';
      requestButton.classList.add('hidden');
      break;
    
    default:
      icon.className = 'w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3';
      icon.querySelector('i').className = 'w-5 h-5 text-yellow-600';
      status.textContent = '通知許可が必要です';
      requestButton.classList.remove('hidden');
  }
}

// 通知許可要求
async function requestNotificationPermission() {
  const requestButton = document.getElementById('request-permission');
  requestButton.textContent = '許可中...';
  requestButton.disabled = true;

  try {
    const granted = await notificationService.requestPermission();
    
    if (granted) {
      updatePermissionStatus();
      showToast('通知が許可されました', 'success');
    } else {
      showToast('通知許可が拒否されました', 'warning');
    }
  } catch (error) {
    console.error('Permission request failed:', error);
    showToast('通知許可の要求に失敗しました', 'error');
  } finally {
    requestButton.textContent = '許可する';
    requestButton.disabled = false;
  }
}

// 設定の読み込み
function loadSettings() {
  if (!notificationService?.settings) return;

  const settings = notificationService.settings;
  
  document.getElementById('notifications-enabled').checked = settings.enabled;
  document.getElementById('notification-sound').checked = settings.sound;
  document.getElementById('notification-vibration').checked = settings.vibration;
  document.getElementById('notification-inapp').checked = settings.inApp;

  // カテゴリー設定（デフォルトで有効）
  document.getElementById('notify-events').checked = true;
  document.getElementById('notify-reservations').checked = true;
  document.getElementById('notify-coupons').checked = true;
  document.getElementById('notify-recommendations').checked = false;
}

// 設定変更の処理
function handleSettingChange(event) {
  const input = event.target;
  const settingKey = input.id.replace('notification-', '').replace('notify-', '');
  
  // 基本設定
  if (input.id.startsWith('notification-')) {
    notificationService?.updateSetting(settingKey, input.checked);
    
    if (input.id === 'notifications-enabled') {
      updateSettingInputsState(input.checked);
    }
  }
  
  // カテゴリー設定
  if (input.id.startsWith('notify-')) {
    const categories = getNotificationCategories();
    notificationService?.updateSetting('categories', categories);
  }

  showToast('設定を保存しました', 'success');
}

// 設定入力状態の更新
function updateSettingInputsState(enabled) {
  const inputs = ['notification-sound', 'notification-vibration', 'notification-inapp'];
  inputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.disabled = !enabled;
      input.parentElement.style.opacity = enabled ? '1' : '0.5';
    }
  });
}

// カテゴリー設定の取得
function getNotificationCategories() {
  return {
    events: document.getElementById('notify-events').checked,
    reservations: document.getElementById('notify-reservations').checked,
    coupons: document.getElementById('notify-coupons').checked,
    recommendations: document.getElementById('notify-recommendations').checked
  };
}

// 通知履歴の読み込み
function loadNotificationHistory() {
  const container = document.getElementById('notification-history');
  const history = notificationService?.getNotificationHistory(20) || [];

  if (history.length === 0) {
    container.innerHTML = '<p class="text-center text-gray-500 text-sm py-4">通知履歴がありません</p>';
    return;
  }

  container.innerHTML = history.map(notification => `
    <div class="flex items-start p-3 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-400'} transition-colors">
      <div class="flex-1">
        <div class="flex items-center justify-between mb-1">
          <h4 class="font-medium text-sm ${notification.read ? 'text-gray-700' : 'text-blue-800'}">${notification.title}</h4>
          <span class="text-xs text-gray-500">${formatNotificationTime(notification.timestamp)}</span>
        </div>
        <p class="text-sm text-gray-600">${notification.body}</p>
        <div class="flex items-center mt-2">
          <span class="text-xs px-2 py-1 rounded ${getTypeStyle(notification.type)}">${getTypeLabel(notification.type)}</span>
          ${!notification.read ? '<span class="ml-2 text-xs text-blue-600 font-medium">未読</span>' : ''}
        </div>
      </div>
      ${!notification.read ? `<button onclick="markNotificationRead(${notification.timestamp})" class="ml-2 text-blue-600 hover:text-blue-700 text-xs">既読</button>` : ''}
    </div>
  `).join('');
}

// 通知タイプのスタイル
function getTypeStyle(type) {
  const styles = {
    info: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };
  return styles[type] || styles.info;
}

// 通知タイプのラベル
function getTypeLabel(type) {
  const labels = {
    info: '情報',
    success: '成功',
    warning: '警告',
    error: 'エラー',
    scheduled: 'スケジュール'
  };
  return labels[type] || '通知';
}

// 時間の書式設定
function formatNotificationTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diff = now - date;
  
  if (diff < 60000) {
    return 'たった今';
  } else if (diff < 3600000) {
    return `${Math.floor(diff / 60000)}分前`;
  } else if (diff < 86400000) {
    return `${Math.floor(diff / 3600000)}時間前`;
  } else {
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}

// 未読数の更新
function updateUnreadCount() {
  const unreadCount = notificationService?.getUnreadCount() || 0;
  const badge = document.getElementById('unread-count');
  
  if (unreadCount > 0) {
    badge.textContent = unreadCount;
    badge.classList.remove('hidden');
  } else {
    badge.classList.add('hidden');
  }
}

// 個別通知を既読にマーク
function markNotificationRead(timestamp) {
  notificationService?.markAsRead(timestamp);
  loadNotificationHistory();
  updateUnreadCount();
  showToast('通知を既読にしました', 'success');
}

// すべての通知を既読にマーク
function markAllNotificationsRead() {
  notificationService?.markAllAsRead();
  loadNotificationHistory();
  updateUnreadCount();
  showToast('すべての通知を既読にしました', 'success');
}

// テスト通知の送信
async function sendTestNotification() {
  const button = document.getElementById('test-notification');
  button.textContent = '送信中...';
  button.disabled = true;

  try {
    await notificationService?.showNotification({
      title: 'テスト通知',
      body: 'これはテスト通知です。通知システムが正常に動作しています。',
      data: { type: 'test' }
    });
    
    showToast('テスト通知を送信しました', 'success');
    
    // 履歴を更新
    setTimeout(() => {
      loadNotificationHistory();
      updateUnreadCount();
    }, 500);
  } catch (error) {
    console.error('Test notification failed:', error);
    showToast('テスト通知の送信に失敗しました', 'error');
  } finally {
    button.textContent = 'テスト通知を送信';
    button.disabled = false;
  }
}

// スケジュールされたテスト通知
function sendScheduledTestNotification() {
  const button = document.getElementById('test-scheduled');
  button.textContent = '5秒後に送信...';
  button.disabled = true;

  try {
    const scheduledTime = Date.now() + 5000; // 5秒後
    
    notificationService?.scheduleNotification({
      title: 'スケジュールテスト通知',
      body: '5秒前に予約された通知です。',
      scheduledTime
    });
    
    showToast('5秒後に通知を送信します', 'info');
    
    // 5秒後にボタンを復元
    setTimeout(() => {
      button.textContent = '5秒後に通知（スケジュール）';
      button.disabled = false;
      
      // 履歴を更新
      setTimeout(() => {
        loadNotificationHistory();
        updateUnreadCount();
      }, 1000);
    }, 6000);
  } catch (error) {
    console.error('Scheduled test notification failed:', error);
    showToast('スケジュール通知の設定に失敗しました', 'error');
    button.textContent = '5秒後に通知（スケジュール）';
    button.disabled = false;
  }
}

// トースト通知の表示
function showToast(message, type = 'info') {
  notificationService?.showInAppNotification({
    title: '設定',
    body: message,
    type,
    duration: 3000
  });
}