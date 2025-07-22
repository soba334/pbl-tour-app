document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const spotId = Number(params.get("id"));

  const container = document.getElementById("spot-detail-container");

  let spot;
  
  try {
    const res = await fetch("../data/spots/saved_spots.json");
    if (!res.ok) {
      throw new Error('データの取得に失敗しました');
    }
    const data = await res.json();
    spot = data.find(s => s.id === spotId);

    if (!spot) {
      container.innerHTML = `
        <div class="mobile-card text-center py-12">
          <i data-lucide="map-pin-off" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
          <h3 class="text-lg font-bold text-gray-600 mb-2">スポットが見つかりません</h3>
          <p class="text-gray-500">該当するスポットが見つかりませんでした。</p>
        </div>
      `;
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      return;
    }
  } catch (error) {
    container.innerHTML = `
      <div class="mobile-card text-center py-12">
        <i data-lucide="wifi-off" class="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
        <h3 class="text-lg font-bold text-gray-600 mb-2">読み込みエラー</h3>
        <p class="text-gray-500">データの読み込みに失敗しました。</p>
        <button onclick="location.reload()" class="mt-4 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors">
          再読み込み
        </button>
      </div>
    `;
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    return;
  }

  const visitList = spot.visitedDates.map(date => `
    <div class="flex items-center justify-between bg-white/50 rounded-xl p-4 border border-white/30">
      <div class="flex items-center">
        <i data-lucide="calendar-check" class="w-5 h-5 text-emerald-500 mr-3"></i>
        <span class="font-medium text-gray-800">${date}</span>
      </div>
      <div class="w-2 h-2 bg-emerald-400 rounded-full"></div>
    </div>
  `).join("");

  container.innerHTML = `
    <div class="mobile-card animate-on-load delay-200">
      <div class="text-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800 mb-2">${spot.name}</h2>
        <div class="w-16 h-1 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto"></div>
      </div>

      <div class="mb-6">
        <div class="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-lg">
          ${spot.image ? `<img src="${spot.image}" alt="${spot.name}" class="w-full h-48 object-cover rounded-2xl" />` : 
            `<div class="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
              <i data-lucide="image" class="w-16 h-16 text-gray-400"></i>
            </div>`}
        </div>
      </div>

      <div class="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-2xl p-6 text-white text-center mb-6">
        <div class="flex items-center justify-center mb-2">
          <i data-lucide="map-pin" class="w-6 h-6 mr-2"></i>
          <span class="text-lg font-semibold">来訪回数</span>
        </div>
        <div class="text-4xl font-bold">${spot.visitedDates.length}<span class="text-xl ml-1">回</span></div>
      </div>

      <div class="bg-white/70 backdrop-blur-sm rounded-2xl p-6">
        <h3 class="flex items-center text-lg font-bold text-gray-800 mb-4">
          <i data-lucide="calendar" class="w-5 h-5 mr-2 text-emerald-500"></i>
          過去の訪問記録
        </h3>
        <div class="space-y-3 max-h-48 overflow-y-auto">
          ${visitList || `<div class="text-center py-8 text-gray-500">
            <i data-lucide="calendar-x" class="w-12 h-12 mx-auto mb-2 opacity-50"></i>
            <p>訪問記録がありません</p>
          </div>`}
        </div>
      </div>
    </div>
  `;
  
  // Lucideアイコンを再初期化
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
