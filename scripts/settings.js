// 設定ページの機能
document.addEventListener('DOMContentLoaded', function() {
    const pushNotificationsToggle = document.getElementById('push-notifications');
    const darkModeToggle = document.getElementById('dark-mode');
    const animationsToggle = document.getElementById('animations');
    
    // 設定をローカルストレージから読み込み
    function loadSettings() {
        try {
            const savedSettings = localStorage.getItem('appSettings');
            if (savedSettings) {
                const settings = JSON.parse(savedSettings);
                
                // 各設定を復元
                if (settings.pushNotifications !== undefined) {
                    pushNotificationsToggle.checked = settings.pushNotifications;
                }
                if (settings.darkMode !== undefined) {
                    darkModeToggle.checked = settings.darkMode;
                    applyDarkMode(settings.darkMode);
                }
                if (settings.animations !== undefined) {
                    animationsToggle.checked = settings.animations;
                    applyAnimationSetting(settings.animations);
                }
            }
        } catch (error) {
            console.error('設定の読み込みに失敗しました:', error);
        }
    }

    // 設定を保存
    function saveSettings() {
        try {
            const settings = {
                pushNotifications: pushNotificationsToggle.checked,
                darkMode: darkModeToggle.checked,
                animations: animationsToggle.checked,
                updatedAt: new Date().toISOString()
            };
            
            localStorage.setItem('appSettings', JSON.stringify(settings));
        } catch (error) {
            console.error('設定の保存に失敗しました:', error);
        }
    }

    // ダークモードの適用
    function applyDarkMode(enabled) {
        if (enabled) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }

    // アニメーション設定の適用
    function applyAnimationSetting(enabled) {
        if (!enabled) {
            document.body.classList.add('no-animations');
        } else {
            document.body.classList.remove('no-animations');
        }
    }

    // メッセージ表示
    function showMessage(message, type = 'info') {
        const modal = document.getElementById('message-modal');
        const messageElement = document.getElementById('modal-message');
        const closeButton = document.getElementById('close-modal');
        
        if (modal && messageElement) {
            messageElement.textContent = message;
            modal.classList.remove('hidden');
            
            // 閉じるボタンの処理
            closeButton.addEventListener('click', function() {
                modal.classList.add('hidden');
            });
            
            // モーダル外クリックで閉じる
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.classList.add('hidden');
                }
            });
        }
    }

    // プッシュ通知設定の変更
    pushNotificationsToggle.addEventListener('change', function() {
        const enabled = this.checked;
        
        if (enabled) {
            // 通知許可をリクエスト
            if ('Notification' in window) {
                Notification.requestPermission().then(permission => {
                    if (permission === 'granted') {
                        showMessage('プッシュ通知が有効になりました。');
                        saveSettings();
                    } else {
                        this.checked = false;
                        showMessage('通知許可が拒否されました。ブラウザの設定で許可してください。');
                    }
                });
            } else {
                this.checked = false;
                showMessage('このブラウザでは通知がサポートされていません。');
            }
        } else {
            showMessage('プッシュ通知が無効になりました。');
            saveSettings();
        }
    });

    // ダークモード設定の変更
    darkModeToggle.addEventListener('change', function() {
        const enabled = this.checked;
        applyDarkMode(enabled);
        saveSettings();
        
        showMessage(enabled ? 'ダークモードが有効になりました。' : 'ライトモードが有効になりました。');
    });

    // アニメーション設定の変更
    animationsToggle.addEventListener('change', function() {
        const enabled = this.checked;
        applyAnimationSetting(enabled);
        saveSettings();
        
        showMessage(enabled ? 'アニメーションが有効になりました。' : 'アニメーションが無効になりました。');
    });

    // 各種リンクボタンの処理
    const settingsButtons = document.querySelectorAll('.mobile-card button, .bg-white\\/50 button');
    
    settingsButtons.forEach(button => {
        if (!button.dataset.action) {
            button.addEventListener('click', function() {
                const text = this.querySelector('span')?.textContent || this.textContent;
                
                // 機能別の処理
                switch(text.trim()) {
                    case 'パスワード変更':
                        showMessage('パスワード変更機能は開発中です。');
                        break;
                    case 'プライバシーポリシー':
                        showMessage('プライバシーポリシーページに移動します。');
                        break;
                    case '利用規約':
                        showMessage('利用規約ページに移動します。');
                        break;
                    case 'アプリについて':
                        showAppInfo();
                        break;
                    case 'データをエクスポート':
                        exportUserData();
                        break;
                    case 'アカウントを削除':
                        confirmAccountDeletion();
                        break;
                    default:
                        // 何もしない
                        break;
                }
            });
        }
    });

    // アプリ情報表示
    function showAppInfo() {
        const appInfo = `
            アプリ名: にいがたび
            バージョン: v1.0.0
            開発: PBL Team
            
            このアプリは新潟市の魅力を発見し、
            共有するためのプラットフォームです。
        `;
        showMessage(appInfo);
    }

    // ユーザーデータエクスポート
    function exportUserData() {
        try {
            const userData = {
                profile: JSON.parse(localStorage.getItem('userProfile') || '{}'),
                interests: JSON.parse(localStorage.getItem('userInterests') || '[]'),
                settings: JSON.parse(localStorage.getItem('appSettings') || '{}'),
                exportedAt: new Date().toISOString()
            };
            
            const dataStr = JSON.stringify(userData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = 'niigatatabi-userdata.json';
            link.click();
            
            showMessage('ユーザーデータをエクスポートしました。');
        } catch (error) {
            console.error('エクスポートに失敗しました:', error);
            showMessage('エクスポートに失敗しました。');
        }
    }

    // アカウント削除確認
    function confirmAccountDeletion() {
        const confirmed = confirm('本当にアカウントを削除しますか？この操作は取り消せません。');
        
        if (confirmed) {
            // ローカルストレージをクリア
            localStorage.removeItem('userProfile');
            localStorage.removeItem('userInterests');
            localStorage.removeItem('appSettings');
            
            showMessage('アカウントが削除されました。ログインページに移動します。');
            
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }
    }

    // 初期化時に設定を読み込み
    loadSettings();
});