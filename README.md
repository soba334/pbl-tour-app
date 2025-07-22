# PBL Tour App

Z世代向けのスマート観光支援Webアプリです。  
保存スポット一覧・イベントカレンダー・クーポン・通知設定などの機能を通じて、若者が「また行きたくなる」体験をデザインします。

---

## 📁 プロジェクト構成

.
├── pages/ # 各機能ごとのHTMLページ群
├── styles/ # ページごとのCSS
├── scripts/ # ページごとのJSロジック
├── src/ # サービス層・コンポーネント・ユーティリティ
├── config/ # アプリケーション設定
├── data/ # JSON形式のデータ（クーポン・イベント・スポット）
└── assets/ # 画像素材・フォント・アイコン

---

## 🧩 主な画面と機能

### 🗺️ 保存スポット一覧ページ（`pages/saved-spot-list.html`）
- 検索バー・カテゴリタブによるフィルタ
- お気に入りハートボタン（トグル）
- JSONデータ：`data/spots/saved_spots.json`

### 📅 イベントカレンダー（`pages/event-calendar.html`）
- カレンダーでイベントを月ごとに表示
- イベントカードの一覧表示と検索機能
- 「通知設定 ⚙️」ボタンから通知画面へ遷移

### 🛎️ 通知設定ページ（`pages/notification-settings.html`）
- トグルUIで通知ON/OFFを制御
- 「イベントのお知らせ」をOFFにすると、季節イベントトグルも全てOFFになる仕様
- 戻るボタンでカレンダー画面へ戻れる

### 🎫 クーポン一覧／詳細（`pages/coupon-list.html`, `coupon-detail.html`）
- ブランドフィルタと検索機能
- バーコード表示機能あり（`JsBarcode`使用）

### ✍️ 体験投稿ページ（`pages/experience-share.html`）
- 写真アップロード・コメント・タグ付け・SNS連携UIあり

---

## 🧠 使用技術

- HTML5 / CSS3 / JavaScript（Vanilla）
- 外部ライブラリ:
  - [ScrollReveal.js](https://scrollrevealjs.org/)（アニメーション）
  - [JsBarcode](https://github.com/lindell/JsBarcode)（バーコード表示）
  - [TailwindCSS CDN](https://tailwindcss.com/)（一部ページ）
- JSONデータによる構造化管理（`/data/` 配下）

---

## 📝 今後の拡張アイデア

- 各種トグル状態の `localStorage` 保存・復元
- FirestoreやSupabase等との連携（予約、クーポン使用状況保存）
- Service Workerによるオフライン対応
- アクセシビリティ対応（WAI-ARIA）

---

## 🧑‍💻 開発メンバー（仮）

- 真庭詩音（）
- 林楓太（）
- 粕川陽夏琉（）
- 黛拓駿（）
- 佐藤昊（）
- 大井隼（）
（後で各担当ページ記載）


