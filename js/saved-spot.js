let spotsData = [];
let currentCategory = "all";
let searchKeyword = "";

// 初期化
document.addEventListener("DOMContentLoaded", async () => {
  const res = await fetch("../data/spots/saved_spots.json");
  spotsData = await res.json();

  setupTabs();
  setupSearchBar();
  renderSpotList(spotsData);
});

// タブのクリックイベント設定
function setupTabs() {
  const tabs = document.querySelectorAll(".tab");
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
  searchBar.addEventListener("input", () => {
    searchKeyword = searchBar.value.toLowerCase();
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
    list.innerHTML = "<p>該当するスポットが見つかりませんでした。</p>";
    return;
  }

  filtered.forEach(spot => {
    const card = document.createElement("div");
    card.className = "spot-card";

    card.innerHTML = `
      <div class="spot-image">
        ${spot.image
          ? `<img src="${spot.image}" alt="${spot.name}" style="width:100%; height:100%; object-fit:cover; border-radius:8px;" />`
          : "🖼"}
      </div>

      <div class="spot-info">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <strong>${spot.name}</strong>
          <span class="favorite" onclick="toggleFavorite(${spot.id})" style="cursor: pointer;">
            ${spot.isFavorite ? "♥" : "♡"}
          </span>
        </div>
        <div>⭐️ ${spot.rating}</div>
      </div>

      <div class="button-group">
        <button class="btn-history" onclick="location.href='saved-spot-detail.html?id=${spot.id}'">過去の記録</button>
        <button class="btn-reserve">予約する</button>
      </div>
    `;

    list.appendChild(card);
  });
}

// お気に入りトグル
function toggleFavorite(id) {
  const spot = spotsData.find(s => s.id === id);
  if (spot) {
    spot.isFavorite = !spot.isFavorite;
    renderSpotList(spotsData);
  }
}
