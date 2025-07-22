let spotsData = [];
let currentCategory = "all";
let searchKeyword = "";

// 初期化
onDOMReady(async () => {
  spotsData = await fetchJSON("../data/spots/saved_spots.json");
  if (!spotsData) return;

  setupTabs();
  setupSearchBar();
  renderSpotList(spotsData);
});

// タブのクリックイベント設定
function setupTabs() {
  const tabs = document.querySelectorAll(".mobile-tab");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      currentCategory = tab.dataset.category;
      renderSpotList(spotsData);
    });
  });
}

// 検索バーの入力イベント設定
function setupSearchBar() {
  const searchBar = document.getElementById("searchBar");
  setupSearchInput(searchBar, (keyword) => {
    searchKeyword = keyword.toLowerCase();
    renderSpotList(spotsData);
  });
}

// スポット一覧の描画
function renderSpotList(data) {
  const list = document.getElementById("spotList");
  list.innerHTML = "";

  const filtered = data.filter(spot => {
    const matchCategory =
      currentCategory === "all"
        ? true
        : currentCategory === "favorite"
        ? spot.isFavorite
        : spot.category === currentCategory;

    const matchKeyword = spot.name.toLowerCase().includes(searchKeyword);
    return matchCategory && matchKeyword;
  });

  if (filtered.length === 0) {
    list.innerHTML = `
      <div class="mobile-empty-state">
        <p>該当するスポットが見つかりませんでした</p>
      </div>
    `;
    return;
  }

  filtered.forEach((spot, index) => {
    const card = document.createElement("div");
    card.className = "mobile-list-item animate-on-load";
    card.style.animationDelay = `${(index + 3) * 100}ms`;

    card.innerHTML = `
      <div class="flex items-center space-x-4">
        <div class="w-16 h-16 bg-gray-200 rounded-xl flex items-center justify-center overflow-hidden">
          ${spot.image
            ? `<img src="${spot.image}" alt="${spot.name}" class="w-full h-full object-cover" />`
            : `<i data-lucide="image" class="w-8 h-8 text-gray-400"></i>`}
        </div>
        
        <div class="flex-1">
          <div class="flex justify-between items-start mb-1">
            <h3 class="font-bold text-gray-800">${spot.name}</h3>
            <button onclick="toggleFavorite(${spot.id})" class="text-xl ${spot.isFavorite ? 'text-red-500' : 'text-gray-400'} hover:text-red-500 transition-colors">
              ${spot.isFavorite ? "♥" : "♡"}
            </button>
          </div>
          <div class="text-sm text-gray-600 mb-2">⭐️ ${spot.rating} • ${spot.category}</div>
          <div class="flex space-x-2">
            <button onclick="location.href='saved-spot-detail.html?id=${spot.id}'" 
                    class="text-xs bg-emerald-400/80 text-white px-3 py-1 rounded-full hover:bg-emerald-500 transition-colors">
              詳細
            </button>
            <button class="text-xs bg-blue-400/80 text-white px-3 py-1 rounded-full hover:bg-blue-500 transition-colors">
              予約
            </button>
          </div>
        </div>
      </div>
    `;

    list.appendChild(card);
  });
  
  // Lucideアイコンを再初期化
  if (typeof lucide !== 'undefined') {
    setTimeout(() => lucide.createIcons(), 100);
  }
}

// お気に入りトグル
function toggleFavorite(id) {
  const spot = spotsData.find(s => s.id === id);
  if (spot) {
    spot.isFavorite = !spot.isFavorite;
    renderSpotList(spotsData);
  }
}
