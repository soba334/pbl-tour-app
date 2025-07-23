// ヘルプページの機能
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    const searchInput = document.querySelector('input[placeholder="質問を検索..."]');
    
    // FAQ項目の開閉処理
    faqItems.forEach(item => {
        const button = item.querySelector('button');
        const answer = item.querySelector('.faq-answer');
        const chevron = button.querySelector('i[data-lucide="chevron-down"]');
        
        button.addEventListener('click', function() {
            const isOpen = !answer.classList.contains('hidden');
            
            if (isOpen) {
                // 閉じる
                answer.classList.add('hidden');
                chevron.style.transform = 'rotate(0deg)';
            } else {
                // 開く
                answer.classList.remove('hidden');
                chevron.style.transform = 'rotate(180deg)';
            }
        });
    });

    // FAQ検索機能
    function searchFAQ(query) {
        const searchTerm = query.toLowerCase().trim();
        
        faqItems.forEach(item => {
            const question = item.querySelector('button span').textContent.toLowerCase();
            const answer = item.querySelector('.faq-answer p').textContent.toLowerCase();
            
            if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                item.style.display = 'block';
                
                // 検索にヒットした場合は自動的に開く
                if (searchTerm && searchTerm.length > 0) {
                    const answerElement = item.querySelector('.faq-answer');
                    const chevron = item.querySelector('i[data-lucide="chevron-down"]');
                    answerElement.classList.remove('hidden');
                    chevron.style.transform = 'rotate(180deg)';
                }
            } else {
                item.style.display = 'none';
            }
        });

        // 検索結果がない場合の処理
        const visibleItems = Array.from(faqItems).filter(item => item.style.display !== 'none');
        const faqContainer = faqItems[0].parentElement;
        
        // 既存の「検索結果なし」メッセージを削除
        const noResultsMsg = faqContainer.querySelector('.no-results-message');
        if (noResultsMsg) {
            noResultsMsg.remove();
        }
        
        if (visibleItems.length === 0 && searchTerm) {
            const noResultsElement = document.createElement('div');
            noResultsElement.className = 'no-results-message text-center py-8';
            noResultsElement.innerHTML = `
                <i data-lucide="search-x" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                <p class="text-gray-600">「${query}」に関する質問が見つかりませんでした</p>
                <p class="text-sm text-gray-500 mt-2">お問い合わせフォームからご質問ください</p>
            `;
            faqContainer.appendChild(noResultsElement);
            
            // Lucideアイコンを再初期化
            if (window.lucide) {
                window.lucide.createIcons();
            }
        }
    }

    // 検索入力処理
    searchInput.addEventListener('input', function() {
        const query = this.value;
        
        if (query.length === 0) {
            // 検索クリア時は全て表示し、全て閉じる
            faqItems.forEach(item => {
                item.style.display = 'block';
                const answer = item.querySelector('.faq-answer');
                const chevron = item.querySelector('i[data-lucide="chevron-down"]');
                answer.classList.add('hidden');
                chevron.style.transform = 'rotate(0deg)';
            });
            
            // 「検索結果なし」メッセージを削除
            const noResultsMsg = document.querySelector('.no-results-message');
            if (noResultsMsg) {
                noResultsMsg.remove();
            }
        } else if (query.length >= 2) {
            searchFAQ(query);
        }
    });

    // お問い合わせボタンの処理
    const contactButtons = document.querySelectorAll('.mobile-card button');
    
    contactButtons.forEach(button => {
        if (!button.dataset.action) {
            button.addEventListener('click', function() {
                const text = this.querySelector('span')?.textContent || this.textContent;
                
                switch(text.trim()) {
                    case 'メールでお問い合わせ':
                        openEmailContact();
                        break;
                    case '電話でお問い合わせ':
                        openPhoneContact();
                        break;
                    case 'アプリの使い方動画':
                        openTutorialVideo();
                        break;
                    case '機能説明ガイド':
                        openFunctionGuide();
                        break;
                    default:
                        // 何もしない
                        break;
                }
            });
        }
    });

    // メールお問い合わせ
    function openEmailContact() {
        const subject = encodeURIComponent('にいがたびアプリについてのお問い合わせ');
        const body = encodeURIComponent(`
お問い合わせ内容をご記入ください。

【アプリ情報】
バージョン: v1.0.0
OS: ${navigator.platform}
ブラウザ: ${navigator.userAgent}

【お問い合わせ内容】

        `);
        
        const mailtoLink = `mailto:support@niigatatabi.com?subject=${subject}&body=${body}`;
        window.location.href = mailtoLink;
    }

    // 電話お問い合わせ
    function openPhoneContact() {
        showMessage(`
            お電話でのお問い合わせ
            
            電話番号: 025-XXX-XXXX
            営業時間: 平日 9:00-18:00
            
            ※土日祝日は休業いたします
        `);
    }

    // チュートリアル動画
    function openTutorialVideo() {
        showMessage('アプリの使い方動画は準備中です。しばらくお待ちください。');
    }

    // 機能説明ガイド
    function openFunctionGuide() {
        showMessage('機能説明ガイドは準備中です。しばらくお待ちください。');
    }

    // メッセージ表示
    function showMessage(message) {
        // メッセージモーダルが存在しない場合は作成
        let modal = document.getElementById('message-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'message-modal';
            modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center hidden z-50 p-4';
            modal.innerHTML = `
                <div id="modal-content" class="bg-white/90 backdrop-blur-xl p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
                    <p id="modal-message" class="mb-6 text-lg font-bold text-gray-800 whitespace-pre-line"></p>
                    <button id="close-modal" class="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-8 py-3 rounded-full transition-colors">閉じる</button>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        const messageElement = document.getElementById('modal-message');
        const closeButton = document.getElementById('close-modal');
        
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

    // 初期化時に検索フィールドにフォーカス
    searchInput.focus();
});