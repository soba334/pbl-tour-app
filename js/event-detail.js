fetch('../../data/event/events.json')
  .then(res => res.json())
  .then(events => {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const event = events.find(e => e.id === id);

    if (!event) {
      document.body.innerHTML = '<p style="text-align:center;">イベントが見つかりませんでした</p>';
      return;
    }

    // タイトル・日付
    document.getElementById('event-title').textContent = event.title;
    document.getElementById('event-date').textContent = `${event.startDate} ～ ${event.endDate}`;

    // 画像（../../images/ を先頭に付ける）
    const imagePath = event.image ? `../../${event.image}` : '../../images/noimage.png';
    document.getElementById('event-image').src = imagePath;

    // その他の情報
    document.getElementById('event-info').textContent = `情報更新日：${event.updatedAt}`;
    document.getElementById('event-time').textContent = `開催時間：${event.time}`;

    // 会場・住所・Googleマップリンク
    const placeHTML = `
      <strong>会場：</strong>${event.place}<br>
      <strong>住所：</strong>${event.address}<br>
      <a href="https://www.google.com/maps/search/?q=${encodeURIComponent(event.address)}" target="_blank">📍 Googleマップで見る</a>
    `;
    document.getElementById('event-place').innerHTML = placeHTML;

    document.getElementById('event-fee').textContent = `料金：${event.fee}`;
    document.getElementById('event-notes').textContent = `備考：${event.notes}`;
    document.getElementById('event-contact').textContent = `問い合わせ先：${event.contact}`;
  })
  .catch(err => {
    console.error('イベントデータの読み込みに失敗しました', err);
    document.body.innerHTML = '<p style="text-align:center;">データの読み込みに失敗しました</p>';
  });
