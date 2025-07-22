const brands = [
  { name: "すべて", icon: "../assets/images/brands/all.png" },
  { name: "ブランドA", icon: "../assets/images/brands/brand-a.png" },
  { name: "ブランドB", icon: "../assets/images/brands/brand-b.png" },
  { name: "ブランドC", icon: "../assets/images/brands/brand-c.png" },
];
const brandFilterEl = document.getElementById("brandFilter");
const couponListEl = document.getElementById("couponList");
const searchInputEl = document.getElementById("searchInput");

let currentBrand = "すべて";
let coupons = [];

// ブランドフィルターの描画
brands.forEach((brandObj) => {
  const btn = document.createElement("div");
  btn.className = "brand-button";
  btn.onclick = () => {
    currentBrand = brandObj.name;
    updateActiveBrand();
    renderCoupons();
  };

  const img = document.createElement("img");
  img.src = brandObj.icon;
  img.alt = brandObj.name;
  img.className = "brand-icon";

  btn.appendChild(img);
  brandFilterEl.appendChild(btn);
});

function updateActiveBrand() {
  document.querySelectorAll(".brand-button").forEach((btn) => {
    btn.classList.toggle("active", btn.innerText === currentBrand);
  });
}

// クーポン描画
// クーポン描画
function renderCoupons() {
  const keyword = searchInputEl.value.trim().toLowerCase();
  
  const filteredCoupons = coupons.filter((c) => {
    const brandMatch = currentBrand === "すべて" || c.brand === currentBrand;
    const keywordMatch = c.title.toLowerCase().includes(keyword);
    return brandMatch && keywordMatch;
  });
  
  renderCards(couponListEl, filteredCoupons, (coupon) => {
    return `
      <div class="coupon-card" onclick="window.location.href='coupon-detail.html?id=${coupons.indexOf(coupon)}'">
        <img src="${coupon.image}" alt="クーポン画像" onerror="this.src='../assets/images/coupons/default.png'" />
        <div class="title">${coupon.title}</div>
      </div>
    `;
  });
}

// JSON読み込み
onDOMReady(async () => {
  coupons = await fetchJSON("../data/coupons/coupons.json");
  if (coupons) {
    updateActiveBrand();
    renderCoupons();
  } else {
    couponListEl.innerHTML = "<p>クーポンを読み込めませんでした。</p>";
  }
});

setupSearchInput(searchInputEl, () => renderCoupons());
