<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>2025年6月予約カレンダー</title>
<style>
    body {
        font-family: sans-serif;
        text-align: center;
    }
    table {
        border-collapse: collapse;
        margin: 20px auto;
    }
    th, td {
        width: 40px;
        height: 40px;
        border: 1px solid #ccc;
    }
    td {
        cursor: pointer;
    }
    .selected {
        background-color: #4a90e2;
        color: white;
    }
    input, button {
        margin: 10px;
        font-size: 1.1em;
        padding: 5px;
    }
    #message {
        margin-top: 20px;
        font-weight: bold;
    }
</style>
</head>
<body>

<h1>2025年6月</h1>
<table>
    <thead>
        <tr>
            <th>日</th><th>月</th><th>火</th><th>水</th><th>木</th><th>金</th><th>土</th>
        </tr>
    </thead>
    <tbody id="calendar-body"></tbody>
</table>

<h2>予約情報入力</h2>
<input type="text" id="title" placeholder="タイトル" value="観光">
<input type="time" id="time" value="10:00"><br>
<button onclick="reserve()">予約</button>

<div id="message"></div>

<script>
    const year = 2025;
    const month = 5; // 6月 (0-index)
    const tbody = document.getElementById('calendar-body');
    let selectedDay = null;

    function generateCalendar() {
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month+1, 0).getDate();
        let html = '';
        let date = 1;

        for (let i = 0; i < 6; i++) {
            html += '<tr>';
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    html += '<td></td>';
                } else if (date > daysInMonth) {
                    html += '<td></td>';
                } else {
                    html += `<td onclick="selectDate(this, ${date})">${date}</td>`;
                    date++;
                }
            }
            html += '</tr>';
        }
        tbody.innerHTML = html;
    }

    function selectDate(cell, day) {
        if (selectedDay) {
            selectedDay.classList.remove('selected');
        }
        selectedDay = cell;
        cell.classList.add('selected');
        selectedDayValue = day;
    }

    function reserve() {
        const title = document.getElementById('title').value;
        const time = document.getElementById('time').value;

        if (!selectedDay) {
            document.getElementById('message').innerText = "日付を選んでください。";
            return;
        }
        if (!title || !time) {
            document.getElementById('message').innerText = "タイトルと時間を入力してください。";
            return;
        }

        document.getElementById('message').innerText = 
            `予約を受け付けました\nタイトル: ${title}\n日時: ${year}年${month+1}月${selectedDayValue}日 ${time}`;
    }

    generateCalendar();
</script>

</body>
</html>

