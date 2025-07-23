// 興味・関心編集ページの機能
document.addEventListener('DOMContentLoaded', function() {
    // 選択された興味・関心を管理する配列
    let selectedInterests = ['観光', 'アート'];
    
    // 興味・関心オプションボタンの処理
    const interestOptions = document.querySelectorAll('.interest-option');
    const selectedInterestsContainer = document.getElementById('selectedInterests');
    const customInterestInput = document.getElementById('customInterest');
    const addCustomButton = document.getElementById('addCustom');
    const saveButton = document.getElementById('saveInterests');

    // 初期表示の更新
    updateSelectedInterestsDisplay();

    // 興味・関心オプションのクリック処理
    interestOptions.forEach(option => {
        option.addEventListener('click', function() {
            const interest = this.dataset.interest;
            
            if (selectedInterests.includes(interest)) {
                // 既に選択されている場合は削除
                selectedInterests = selectedInterests.filter(item => item !== interest);
                this.classList.remove('border-emerald-300', 'bg-emerald-50');
            } else {
                // まだ選択されていない場合は追加
                selectedInterests.push(interest);
                this.classList.add('border-emerald-300', 'bg-emerald-50');
            }
            
            updateSelectedInterestsDisplay();
        });
    });

    // カスタム興味・関心の追加
    addCustomButton.addEventListener('click', function() {
        const customInterest = customInterestInput.value.trim();
        
        if (customInterest && !selectedInterests.includes(customInterest)) {
            selectedInterests.push(customInterest);
            customInterestInput.value = '';
            updateSelectedInterestsDisplay();
        }
    });

    // Enterキーでカスタム興味・関心を追加
    customInterestInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addCustomButton.click();
        }
    });

    // 選択された興味・関心の表示を更新
    function updateSelectedInterestsDisplay() {
        selectedInterestsContainer.innerHTML = '';
        
        if (selectedInterests.length === 0) {
            selectedInterestsContainer.innerHTML = '<p class="text-gray-500 text-sm">まだ興味・関心が選択されていません</p>';
            return;
        }

        selectedInterests.forEach(interest => {
            const span = document.createElement('span');
            span.className = 'selected-interest px-3 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium flex items-center';
            span.innerHTML = `
                ${interest}
                <button class="ml-2 w-4 h-4 text-emerald-500 hover:text-emerald-700" onclick="removeInterest('${interest}')">
                    <i data-lucide="x" class="w-3 h-3"></i>
                </button>
            `;
            selectedInterestsContainer.appendChild(span);
        });

        // Lucideアイコンを再初期化
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // 興味・関心を削除する関数（グローバルスコープに追加）
    window.removeInterest = function(interest) {
        selectedInterests = selectedInterests.filter(item => item !== interest);
        updateSelectedInterestsDisplay();
        
        // 対応するオプションボタンのスタイルを更新
        interestOptions.forEach(option => {
            if (option.dataset.interest === interest) {
                option.classList.remove('border-emerald-300', 'bg-emerald-50');
            }
        });
    };

    // 保存ボタンの処理
    saveButton.addEventListener('click', function() {
        // ローカルストレージに保存
        try {
            localStorage.setItem('userInterests', JSON.stringify(selectedInterests));
            
            // 成功メッセージを表示
            showMessage('興味・関心を保存しました！');
            
            // 少し遅れてプロフィールページに戻る
            setTimeout(() => {
                window.location.href = 'user-profile.html';
            }, 1500);
            
        } catch (error) {
            console.error('保存に失敗しました:', error);
            showMessage('保存に失敗しました。もう一度お試しください。');
        }
    });

    // メッセージ表示関数
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

    // ページロード時に既存の興味・関心をロード
    function loadExistingInterests() {
        try {
            const saved = localStorage.getItem('userInterests');
            if (saved) {
                selectedInterests = JSON.parse(saved);
                updateSelectedInterestsDisplay();
                
                // 対応するオプションボタンにスタイルを適用
                interestOptions.forEach(option => {
                    if (selectedInterests.includes(option.dataset.interest)) {
                        option.classList.add('border-emerald-300', 'bg-emerald-50');
                    }
                });
            }
        } catch (error) {
            console.error('既存の興味・関心のロードに失敗しました:', error);
        }
    }

    // 初期化時に既存データをロード
    loadExistingInterests();
});