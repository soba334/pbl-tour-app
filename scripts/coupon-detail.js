document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const id = parseInt(params.get("id"), 10);

  const swipeContainer = document.getElementById("swipeContainer");
  const swipeWrapper = document.getElementById("swipeWrapper");
  const useButton = document.getElementById("useButton");
  const notesContainer = document.getElementById("couponNotes"); // ← 追加

  let currentSlide = 0;

  // クーポンデータ読み込み
  fetch("../data/coupons/coupons.json")
    .then(res => res.json())
    .then(coupons => {
      const index = isNaN(id) || id < 0 || id >= coupons.length ? 0 : id;
      const data = coupons[index];

      document.getElementById("couponTitle").textContent = data.title;
      document.getElementById("couponImage").src = data.image;

      JsBarcode("#barcode", data.code, {
        format: "CODE128",
        lineColor: "#000",
        width: 2,
        height: 60,
        displayValue: false
      });

      document.getElementById("codeText").textContent = data.code;

      // 📝 注意事項の描画（配列を <ul> にする）
      if (data.notes && Array.isArray(data.notes)) {
        notesContainer.innerHTML = `
          <strong>注意事項</strong><ul>
            ${data.notes.map(note => `${note}`).join("")}
          </ul>
        `;
      }
    });

  // === スライド更新関数（vwではなくpxで安定移動） ===
  function updateSlide() {
    const slideWidth = swipeContainer.offsetWidth;
    swipeWrapper.style.transform = `translateX(-${currentSlide * slideWidth}px)`;

    swipeContainer.classList.remove("use-bg", "barcode-bg");
    swipeContainer.classList.add(currentSlide === 0 ? "use-bg" : "barcode-bg");
  }

  // ボタン押下時 → バーコードへスライド
  useButton.addEventListener("click", () => {
    currentSlide = 1;
    updateSlide();
  });

  // スマホのみスワイプ可能（PCではオフ）
  if (window.innerWidth < 768) {
    let touchStartX = 0;
    let touchEndX = 0;

    swipeContainer.addEventListener("touchstart", e => {
      touchStartX = e.changedTouches[0].screenX;
    });

    swipeContainer.addEventListener("touchend", e => {
      touchEndX = e.changedTouches[0].screenX;
      const dx = touchEndX - touchStartX;
      const threshold = 50;

      if (dx < -threshold && currentSlide === 0) {
        currentSlide = 1;
        updateSlide();
      } else if (dx > threshold && currentSlide === 1) {
        currentSlide = 0;
        updateSlide();
      }
    });
  }

  // 初期表示
  updateSlide();

  // 画面サイズが変わったときも正しく再描画
  window.addEventListener("resize", updateSlide);
});
