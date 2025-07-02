const brands = [
  { name: "すべて", icon: "../images/brands/all.png" },
  { name: "ブランドA", icon: "../images/brands/brand-a.png" },
  { name: "ブランドB", icon: "../images/brands/brand-b.png" },
  { name: "ブランドC", icon: "../images/brands/brand-c.png" },
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
  couponListEl.innerHTML = "";

  coupons
    .filter((c) => {
      const brandMatch = currentBrand === "すべて" || c.brand === currentBrand;
      const keywordMatch = c.title.toLowerCase().includes(keyword);
      return brandMatch && keywordMatch;
    })
    .forEach((coupon) => {
      const card = document.createElement("div");
      card.className = "coupon-card";
      card.innerHTML = `
        <img src="${coupon.image}" alt="クーポン画像" onerror="this.src='../images/coupons/default.png'" />
        <div class="title">${coupon.title}</div>
      `;
      card.onclick = () => {
        // ✅ クーポン詳細ページに遷移（indexをURLパラメータで渡す）
        window.location.href = `coupon-detail.html?id=${coupons.indexOf(coupon)}`;
      };
      couponListEl.appendChild(card);
    });
}

// JSON読み込み
fetch("../data/coupons/coupons.json")
  .then((res) => {
    if (!res.ok) {
      throw new Error("JSONの読み込みに失敗しました");
    }
    return res.json();
  })
  .then((data) => {
    coupons = data;
    updateActiveBrand();
    renderCoupons();
  })
  .catch((err) => {
    console.error(err);
    couponListEl.innerHTML = "<p>クーポンを読み込めませんでした。</p>";
  });

searchInputEl.addEventListener("input", renderCoupons);
