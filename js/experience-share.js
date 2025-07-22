// 体験シェアページのJavaScript

let selectedFile = null;
let selectedTags = [];

// 初期化
onDOMReady(() => {
    initializeEventListeners();
});

// イベントリスナーの初期化
function initializeEventListeners() {
    // 画像アップロード関連
    const imageInput = document.getElementById('imageInput');
    const imagePreview = document.getElementById('imagePreview');
    const cameraBtn = document.getElementById('cameraBtn');
    const galleryBtn = document.getElementById('galleryBtn');
    
    // ボタンクリックで画像選択
    if (cameraBtn) {
        cameraBtn.addEventListener('click', () => {
            imageInput.setAttribute('capture', 'camera');
            imageInput.click();
        });
    }
    
    if (galleryBtn) {
        galleryBtn.addEventListener('click', () => {
            imageInput.removeAttribute('capture');
            imageInput.click();
        });
    }
    
    // 画像プレビュークリックでも画像選択
    if (imagePreview) {
        imagePreview.addEventListener('click', () => {
            imageInput.click();
        });
    }
    
    // ファイル選択時の処理
    if (imageInput) {
        imageInput.addEventListener('change', handleFileSelect);
    }
    
    // 推奨タグのクリック処理
    const tagButtons = document.querySelectorAll('.tag-button');
    tagButtons.forEach(tag => {
        tag.addEventListener('click', () => toggleTag(tag));
    });
    
    // 投稿ボタン
    const postBtn = document.getElementById('postBtn');
    if (postBtn) {
        postBtn.addEventListener('click', handlePost);
    }
}

// ファイル選択処理
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (file) {
        selectedFile = file;
        
        // 画像プレビューを表示
        const reader = new FileReader();
        reader.onload = (e) => {
            const imagePreview = document.getElementById('imagePreview');
            imagePreview.innerHTML = `
                <img src="${e.target.result}" alt="選択された画像" 
                     class="w-full h-48 object-cover rounded-lg">
                <p class="text-sm text-gray-600 mt-2">📷 画像が選択されました</p>
            `;
        };
        reader.readAsDataURL(file);
    }
}

// タグの切り替え
function toggleTag(tagElement) {
    const tagText = tagElement.textContent.trim();
    
    if (tagElement.classList.contains('active')) {
        // タグを削除
        tagElement.classList.remove('active');
        selectedTags = selectedTags.filter(tag => tag !== tagText);
    } else {
        // タグを追加
        tagElement.classList.add('active');
        selectedTags.push(tagText);
    }
    
    updateSelectedTagsDisplay();
}

// 選択されたタグの表示を更新
function updateSelectedTagsDisplay() {
    const selectedTagsContainer = document.getElementById('selectedTags');
    if (selectedTagsContainer) {
        if (selectedTags.length > 0) {
            selectedTagsContainer.innerHTML = `
                <p class="text-sm font-medium text-gray-700 mb-2">選択されたタグ:</p>
                <div class="flex flex-wrap gap-2">
                    ${selectedTags.map(tag => `
                        <span class="mobile-status-badge mobile-status-active">${tag}</span>
                    `).join('')}
                </div>
            `;
        } else {
            selectedTagsContainer.innerHTML = '';
        }
    }
}

// SNS投稿設定の取得
function getSNSSettings() {
    const snsSettings = {};
    const checkboxes = document.querySelectorAll('.sns-checkbox');
    
    checkboxes.forEach(checkbox => {
        snsSettings[checkbox.dataset.sns] = checkbox.checked;
    });
    
    return snsSettings;
}

// 投稿処理
function handlePost() {
    const commentInput = document.getElementById('commentInput');
    const comment = commentInput ? commentInput.value.trim() : '';
    
    // バリデーション
    if (!selectedFile && !comment) {
        MobileUI.showModal('写真またはコメントを入力してください');
        return;
    }
    
    // 投稿データの作成
    const postData = {
        image: selectedFile,
        comment: comment,
        tags: selectedTags,
        snsSettings: getSNSSettings(),
        timestamp: new Date().toISOString()
    };
    
    // ローディング表示
    const postBtn = document.getElementById('postBtn');
    const originalText = postBtn.textContent;
    postBtn.textContent = '投稿中...';
    postBtn.disabled = true;
    
    // 模擬的な投稿処理（実際のAPIコールに置き換える）
    setTimeout(() => {
        // 成功処理
        MobileUI.showModal('体験をシェアしました！');
        
        // フォームをリセット
        resetForm();
        
        // ボタンを元に戻す
        postBtn.textContent = originalText;
        postBtn.disabled = false;
        
        // 少し遅れてホームに戻る
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }, 1500);
}

// フォームのリセット
function resetForm() {
    // 画像をリセット
    selectedFile = null;
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
        imagePreview.innerHTML = `
            <i data-lucide="camera" class="w-12 h-12 text-gray-400 mx-auto mb-2"></i>
            <p class="text-gray-600">📷 写真をアップロード</p>
        `;
    }
    
    // コメントをリセット
    const commentInput = document.getElementById('commentInput');
    if (commentInput) {
        commentInput.value = '';
    }
    
    // タグをリセット
    selectedTags = [];
    const tagButtons = document.querySelectorAll('.tag-button');
    tagButtons.forEach(tag => {
        tag.classList.remove('active');
    });
    updateSelectedTagsDisplay();
    
    // SNS設定をリセット
    const checkboxes = document.querySelectorAll('.sns-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // ファイル入力をリセット
    const imageInput = document.getElementById('imageInput');
    if (imageInput) {
        imageInput.value = '';
    }
}

// エクスポート
window.ExperienceShare = {
    handleFileSelect,
    toggleTag,
    handlePost,
    resetForm
};