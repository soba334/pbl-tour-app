// プロフィール編集ページの機能
document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('profileForm');
    const saveButton = document.getElementById('saveButton');
    const interestTags = document.querySelectorAll('.interest-tag');
    
    // 選択された興味・関心を管理
    let selectedInterests = [];

    // フォームデータをローカルストレージから読み込み
    function loadUserProfile() {
        try {
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                const profile = JSON.parse(savedProfile);
                
                // フォーム要素に値を設定
                if (profile.name) document.querySelector('input[name="name"]').value = profile.name;
                if (profile.email) document.querySelector('input[name="email"]').value = profile.email;
                if (profile.birthday) document.querySelector('input[name="birthday"]').value = profile.birthday;
                if (profile.gender) document.querySelector('select[name="gender"]').value = profile.gender;
                
                // 通知設定
                if (profile.emailNotifications !== undefined) {
                    document.getElementById('email-notifications').checked = profile.emailNotifications;
                }
                if (profile.pushNotifications !== undefined) {
                    document.getElementById('push-notifications').checked = profile.pushNotifications;
                }
            }

            // 興味・関心を読み込み
            const savedInterests = localStorage.getItem('userInterests');
            if (savedInterests) {
                selectedInterests = JSON.parse(savedInterests);
                updateInterestTags();
            }
        } catch (error) {
            console.error('プロフィールの読み込みに失敗しました:', error);
        }
    }

    // 興味・関心タグの表示を更新
    function updateInterestTags() {
        interestTags.forEach(tag => {
            const interest = tag.textContent.trim();
            if (selectedInterests.includes(interest)) {
                tag.classList.add('active');
                tag.classList.remove('px-3', 'py-2', 'bg-gray-100', 'text-gray-600');
                tag.classList.add('px-3', 'py-2', 'bg-emerald-100', 'text-emerald-700');
            } else {
                tag.classList.remove('active');
                tag.classList.remove('px-3', 'py-2', 'bg-emerald-100', 'text-emerald-700');
                tag.classList.add('px-3', 'py-2', 'bg-gray-100', 'text-gray-600');
            }
        });
    }

    // 興味・関心タグのクリック処理
    interestTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const interest = this.textContent.trim();
            
            if (selectedInterests.includes(interest)) {
                // 既に選択されている場合は削除
                selectedInterests = selectedInterests.filter(item => item !== interest);
            } else {
                // まだ選択されていない場合は追加
                selectedInterests.push(interest);
            }
            
            updateInterestTags();
        });
    });

    // フォームバリデーション
    function validateForm() {
        const name = document.querySelector('input[name="name"]').value.trim();
        const email = document.querySelector('input[name="email"]').value.trim();
        
        if (!name) {
            showMessage('お名前を入力してください。');
            return false;
        }
        
        if (!email) {
            showMessage('メールアドレスを入力してください。');
            return false;
        }
        
        // メールアドレスの形式チェック
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showMessage('正しいメールアドレスを入力してください。');
            return false;
        }
        
        return true;
    }

    // プロフィール保存
    function saveProfile() {
        if (!validateForm()) {
            return;
        }

        try {
            const formData = new FormData(profileForm);
            const profile = {
                name: formData.get('name'),
                email: formData.get('email'),
                birthday: formData.get('birthday'),
                gender: formData.get('gender'),
                emailNotifications: document.getElementById('email-notifications').checked,
                pushNotifications: document.getElementById('push-notifications').checked,
                updatedAt: new Date().toISOString()
            };

            // ローカルストレージに保存
            localStorage.setItem('userProfile', JSON.stringify(profile));
            localStorage.setItem('userInterests', JSON.stringify(selectedInterests));

            showMessage('プロフィールを保存しました！');
            
            // 少し遅れてマイページに戻る
            setTimeout(() => {
                window.location.href = 'user-profile.html';
            }, 1500);

        } catch (error) {
            console.error('保存に失敗しました:', error);
            showMessage('保存に失敗しました。もう一度お試しください。');
        }
    }

    // メッセージ表示
    function showMessage(message) {
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

    // プロフィール画像変更（シミュレート）
    const profileImageButton = document.querySelector('.w-8.h-8.bg-white');
    if (profileImageButton) {
        profileImageButton.addEventListener('click', function() {
            showMessage('プロフィール画像の変更機能は開発中です。');
        });
    }

    // 保存ボタンクリック
    saveButton.addEventListener('click', saveProfile);

    // フォーム送信時の処理
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        saveProfile();
    });

    // 初期化時にプロフィールを読み込み
    loadUserProfile();
});