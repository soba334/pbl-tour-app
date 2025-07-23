// 検索ページの機能
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    const searchButton = searchInput.nextElementSibling;
    const searchTags = document.querySelectorAll('.search-tag');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const searchResults = document.getElementById('searchResults');
    const resultsContainer = document.getElementById('resultsContainer');

    // サンプルデータ
    const sampleData = {
        spots: [
            { id: 1, name: '新潟市美術館', category: '観光スポット', description: '現代アートを中心とした美術館', image: 'museum.jpg' },
            { id: 2, name: 'マリンピア日本海', category: '観光スポット', description: '日本海の海洋生物を展示する水族館', image: 'aquarium.jpg' },
            { id: 3, name: '古町カフェ', category: 'カフェ', description: '古町の老舗カフェ', image: 'cafe.jpg' },
            { id: 4, name: '白山公園', category: '自然', description: '四季の花々が楽しめる総合公園', image: 'park.jpg' },
            { id: 5, name: 'ピアBandai', category: 'グルメ', description: '新潟の食材が集まる市場', image: 'market.jpg' }
        ],
        events: [
            { id: 1, name: '新潟花火大会', category: 'イベント', description: '夏の風物詩、信濃川での花火大会', date: '2025-08-15' },
            { id: 2, name: 'アートフェスティバル', category: 'アート', description: '市内各所でのアート展示', date: '2025-09-10' }
        ]
    };

    // 検索実行
    function performSearch(query) {
        if (!query.trim()) {
            hideSearchResults();
            return;
        }

        const results = [];
        
        // スポット検索
        sampleData.spots.forEach(spot => {
            if (spot.name.includes(query) || spot.category.includes(query) || spot.description.includes(query)) {
                results.push({ ...spot, type: 'spot' });
            }
        });

        // イベント検索
        sampleData.events.forEach(event => {
            if (event.name.includes(query) || event.category.includes(query) || event.description.includes(query)) {
                results.push({ ...event, type: 'event' });
            }
        });

        displaySearchResults(results, query);
    }

    // カテゴリー検索
    function searchByCategory(category) {
        const results = [];
        
        sampleData.spots.forEach(spot => {
            if (spot.category === category) {
                results.push({ ...spot, type: 'spot' });
            }
        });

        sampleData.events.forEach(event => {
            if (event.category === category) {
                results.push({ ...event, type: 'event' });
            }
        });

        displaySearchResults(results, `カテゴリー: ${category}`);
    }

    // 検索結果表示
    function displaySearchResults(results, query) {
        searchResults.classList.remove('hidden');
        
        if (results.length === 0) {
            resultsContainer.innerHTML = `
                <div class="text-center py-8">
                    <i data-lucide="search-x" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                    <p class="text-gray-600">「${query}」の検索結果が見つかりませんでした</p>
                    <p class="text-sm text-gray-500 mt-2">別のキーワードでお試しください</p>
                </div>
            `;
        } else {
            resultsContainer.innerHTML = `
                <p class="text-sm text-gray-600 mb-4">「${query}」の検索結果: ${results.length}件</p>
                ${results.map(result => createResultCard(result)).join('')}
            `;
        }

        // Lucideアイコンを再初期化
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // 結果カード作成
    function createResultCard(result) {
        const isEvent = result.type === 'event';
        const url = isEvent ? `event-detail.html?id=${result.id}` : `saved-spot-detail.html?id=${result.id}`;
        
        return `
            <div class="mobile-card clickable-button" data-action="navigate" data-url="${url}">
                <div class="flex items-center">
                    <div class="w-16 h-16 bg-gradient-to-br ${getGradientClass(result.category)} rounded-xl flex items-center justify-center mr-4">
                        <i data-lucide="${getIconName(result.category)}" class="w-8 h-8 text-white"></i>
                    </div>
                    <div class="flex-1">
                        <h3 class="font-bold text-gray-800 mb-1">${result.name}</h3>
                        <p class="text-sm text-gray-600 mb-2">${result.description}</p>
                        <div class="flex items-center">
                            <span class="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">${result.category}</span>
                            ${isEvent && result.date ? `<span class="text-xs text-gray-500 ml-2">${formatDate(result.date)}</span>` : ''}
                        </div>
                    </div>
                    <i data-lucide="chevron-right" class="w-5 h-5 text-gray-400"></i>
                </div>
            </div>
        `;
    }

    // グラデーションクラス取得
    function getGradientClass(category) {
        const gradients = {
            '観光スポット': 'from-blue-400 to-cyan-400',
            'カフェ': 'from-orange-400 to-yellow-400',
            'グルメ': 'from-red-400 to-pink-400',
            '自然': 'from-green-400 to-emerald-400',
            'アート': 'from-purple-400 to-pink-400',
            'イベント': 'from-indigo-400 to-purple-400'
        };
        return gradients[category] || 'from-gray-400 to-gray-500';
    }

    // アイコン名取得
    function getIconName(category) {
        const icons = {
            '観光スポット': 'map-pin',
            'カフェ': 'coffee',
            'グルメ': 'utensils',
            '自然': 'tree-pine',
            'アート': 'palette',
            'イベント': 'calendar'
        };
        return icons[category] || 'circle';
    }

    // 日付フォーマット
    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${date.getMonth() + 1}/${date.getDate()}`;
    }

    // 検索結果非表示
    function hideSearchResults() {
        searchResults.classList.add('hidden');
    }

    // イベントリスナー設定
    
    // 検索ボタンクリック
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });

    // 検索入力でEnterキー
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(this.value);
        }
    });

    // 人気の検索キーワードクリック
    searchTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const keyword = this.textContent;
            searchInput.value = keyword;
            performSearch(keyword);
        });
    });

    // カテゴリーボタンクリック
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const categoryText = this.querySelector('span').textContent;
            searchByCategory(categoryText);
        });
    });

    // 検索入力のリアルタイム検索（オプション）
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value;
        
        if (query.length >= 2) {
            searchTimeout = setTimeout(() => {
                performSearch(query);
            }, 300);
        } else if (query.length === 0) {
            hideSearchResults();
        }
    });
});