// 共通ユーティリティ関数

// データ取得ユーティリティ
async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('データの取得に失敗しました:', error);
        return null;
    }
}

// 検索・フィルタリングユーティリティ
function filterByKeyword(items, keyword, searchFields) {
    if (!keyword) return items;
    
    const lowerKeyword = keyword.toLowerCase();
    return items.filter(item => {
        return searchFields.some(field => {
            const value = getNestedProperty(item, field);
            return value && value.toString().toLowerCase().includes(lowerKeyword);
        });
    });
}

// ネストしたプロパティを取得するヘルパー関数
function getNestedProperty(obj, path) {
    return path.split('.').reduce((current, key) => current && current[key], obj);
}

// タブ切り替えユーティリティ
function setupTabs(tabSelector, contentSelector, activeClass = 'active') {
    const tabs = document.querySelectorAll(tabSelector);
    const contents = document.querySelectorAll(contentSelector);
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // 全てのタブとコンテンツから active クラスを削除
            tabs.forEach(t => t.classList.remove(activeClass));
            contents.forEach(c => c.classList.remove(activeClass));
            
            // クリックされたタブとコンテンツに active クラスを追加
            tab.classList.add(activeClass);
            if (contents[index]) {
                contents[index].classList.add(activeClass);
            }
        });
    });
}

// URLパラメータ取得ユーティリティ
function getURLParam(paramName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(paramName);
}

// 要素表示/非表示ユーティリティ
function toggleVisibility(element, show) {
    if (show) {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

// 汎用カードレンダリングユーティリティ
function renderCards(container, items, templateFunction) {
    if (!container) return;
    
    container.innerHTML = '';
    
    if (!items || items.length === 0) {
        container.innerHTML = '<p class="no-items">表示するアイテムがありません</p>';
        return;
    }
    
    items.forEach(item => {
        const cardHTML = templateFunction(item);
        container.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// 検索入力の設定ユーティリティ
function setupSearchInput(searchInput, onSearch, debounceMs = 300) {
    let timeoutId;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            onSearch(e.target.value);
        }, debounceMs);
    });
}

// ローカルストレージユーティリティ
const storage = {
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error('ローカルストレージへの保存に失敗:', error);
        }
    },
    
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            console.error('ローカルストレージからの取得に失敗:', error);
            return defaultValue;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.error('ローカルストレージからの削除に失敗:', error);
        }
    }
};

// DOMContentLoaded ユーティリティ
function onDOMReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}