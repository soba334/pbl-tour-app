let events = [];
let selectedDate = null;
let currentDate = new Date(); // 初期は現在の月

// データ読み込みと初期化
onDOMReady(async () => {
  events = await fetchJSON('../data/event/events.json');
  if (events) {
    renderCalendar();
    renderEvents(); // 初期表示
  }
  
  // ナビゲーションボタンの初期化
  setupNavigationButtons();
  
  // 検索機能の初期化
  setupSearch();
  
  // すべてのイベント表示ボタンの初期化
  setupShowAllButton();
});

// ナビゲーションボタンの設定
function setupNavigationButtons() {
  const prevBtn = document.querySelector('.nav-btn.prev');
  const nextBtn = document.querySelector('.nav-btn.next');
  
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
      renderEvents();
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
      renderEvents();
    });
  }
}

// カレンダー描画
function renderCalendar() {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const isThisMonth = today.getFullYear() === year && today.getMonth() === month;

  const monthLabel = document.querySelector('.month-label');
  monthLabel.textContent = `${year}年 ${month + 1}月`;

  const firstDay = new Date(year, month, 1).getDay();
  const lastDate = new Date(year, month + 1, 0).getDate();

  const grid = document.querySelector('.calendar-grid');
  
  // 曜日ヘッダー以外の日付セルを削除
  const dayCells = grid.querySelectorAll('.day-cell');
  dayCells.forEach(cell => cell.remove());
  
  // 空のセルも削除（曜日ヘッダー以外）
  const emptyCells = Array.from(grid.children).slice(7);
  emptyCells.forEach(cell => {
    if (!cell.classList.contains('font-semibold')) {
      cell.remove();
    }
  });

  for (let i = 0; i < firstDay; i++) {
    grid.appendChild(document.createElement('div'));
  }

  for (let day = 1; day <= lastDate; day++) {
    const cell = document.createElement('div');
    cell.classList.add('day-cell');

    const thisDateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const thisDate = new Date(thisDateStr);

    const dayNumber = document.createElement('div');
    dayNumber.classList.add('day-number');
    dayNumber.textContent = day;

    const dot = document.createElement('div');
    dot.classList.add('event-dot');

    const hasEvent = events.some(e => {
      const start = new Date(e.startDate || e.date);
      const end = new Date(e.endDate || e.date);
      return thisDate >= start && thisDate <= end;
    });

    if (hasEvent) {
      dot.style.display = 'block';
    } else {
      dot.style.display = 'none';
    }

    if (isThisMonth && day === today.getDate()) {
      cell.classList.add('today');
    }

    cell.addEventListener('click', () => {
      selectedDate = thisDateStr;
      highlightSelectedDay(day);
      renderEvents(thisDateStr);
    });

    cell.appendChild(dayNumber);
    cell.appendChild(dot);
    grid.appendChild(cell);
  }

  if (selectedDate) {
    const selected = new Date(selectedDate);
    if (selected.getFullYear() === year && selected.getMonth() === month) {
      highlightSelectedDay(selected.getDate());
    }
  }
}

function highlightSelectedDay(day) {
  document.querySelectorAll('.calendar-grid .day-cell').forEach(cell => {
    cell.classList.remove('selected');
    if (cell.querySelector('.day-number')?.textContent.trim() === String(parseInt(day))) {
      cell.classList.add('selected');
    }
  });
}

// イベント表示
function renderEvents(filterDate = null, showAll = false, keyword = '') {
  const list = document.querySelector('.event-list');
  list.innerHTML = '';

  let filtered;
  if (showAll) {
    filtered = events;
  } else if (filterDate) {
    const dateObj = new Date(filterDate);
    filtered = events.filter(e => {
      const start = new Date(e.startDate);
      const end = new Date(e.endDate);
      return dateObj >= start && dateObj <= end;
    });
  } else {
    filtered = events.filter(e => {
      const start = new Date(e.startDate);
      const end = new Date(e.endDate);
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      return (
        (start.getFullYear() === currentYear && start.getMonth() === currentMonth) ||
        (end.getFullYear() === currentYear && end.getMonth() === currentMonth)
      );
    });
  }

  if (keyword) {
    const lowerKeyword = keyword.toLowerCase();
    filtered = filtered.filter(e => {
      const title = e.title?.toLowerCase() || '';
      const desc = e.description?.toLowerCase() || '';
      return title.includes(lowerKeyword) || desc.includes(lowerKeyword);
    });

    // ソート: 完全一致 → 前方一致 → 部分一致 → 開始日
    filtered.sort((a, b) => {
      const k = lowerKeyword;
      const aTitle = a.title?.toLowerCase() || '';
      const bTitle = b.title?.toLowerCase() || '';

      if (aTitle === k && bTitle !== k) return -1;
      if (aTitle !== k && bTitle === k) return 1;

      if (aTitle.startsWith(k) && !bTitle.startsWith(k)) return -1;
      if (!aTitle.startsWith(k) && bTitle.startsWith(k)) return 1;

      return new Date(a.startDate) - new Date(b.startDate);
    });
  }

  if (filtered.length === 0) {
    list.innerHTML = '<p style="text-align:center;">イベントがありません</p>';
    return;
  }

  for (const ev of filtered) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.addEventListener('click', () => {
      location.href = `event-detail.html?id=${ev.id}`;
    });

    // ✅ 画像のパスが ev.image に入っていると仮定して表示
    const imageTag = ev.image
      ? `<img class="event-img" src="${ev.image}" alt="${ev.title}">`
      : `<div class="event-icon">📅</div>`; // フォールバック

    card.innerHTML = `
      ${imageTag}
      <div class="event-info">
        <div class="event-title">${ev.title}</div>
        <div class="event-date">${ev.startDate} ～ ${ev.endDate}</div>
      </div>
    `;
    list.appendChild(card);
  }
}

// 検索機能の設定
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const keyword = searchInput.value.trim();
      renderEvents(null, true, keyword); // 全イベントを対象にキーワード検索
    });
  }
}

// すべてのイベント表示ボタンの設定
function setupShowAllButton() {
  const showAllBtn = document.getElementById('show-all');
  if (showAllBtn) {
    showAllBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      renderEvents(null, true); // showAll = true
    });
  }
}
