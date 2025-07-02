document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(location.search);
  const spotId = Number(params.get("id"));

  const res = await fetch("../data/spots/saved_spots.json");
  const data = await res.json();
  const spot = data.find(s => s.id === spotId);

  const container = document.getElementById("spotDetail");

  if (!spot) {
    container.innerHTML = "<p>該当するスポットが見つかりませんでした。</p>";
    return;
  }

  const visitList = spot.visitedDates.map(date => `
    <div class="date-item">
      <span class="date-icon">📅</span>
      <span>${date}</span>
    </div>
  `).join("");

  container.innerHTML = `
    <h2>${spot.name}</h2>

    <div class="spot-image">
      ${spot.image ? `<img src="${spot.image}" alt="${spot.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 12px;" />` : "📷"}
    </div>

    <div class="count-box">
      来訪回数
      <span>${spot.visitedDates.length}回</span>
    </div>

    <div class="date-list">
      <strong>過去の訪問</strong>
      ${visitList || "<div>記録がありません</div>"}
    </div>
  `;
});
