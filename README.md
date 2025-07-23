# 🗾 にいがたび (Niigatatabi)

Z世代向けの新潟市観光支援Webアプリです。  
スポット検索・イベント情報・クーポン・SNS投稿機能を通じて、若者が「また行きたくなる」体験をデザインします。

---

## 📱 アプリの特徴

- **完全モバイル対応**: スマートフォンに最適化された直感的なUI/UX
- **統一されたナビゲーション**: 全ページで一貫した操作性
- **リアルタイム検索**: キーワード・カテゴリー検索機能
- **パーソナライゼーション**: 興味・関心に基づくカスタマイズ
- **オフライン対応**: ローカルストレージによるデータ永続化

---

## 📁 プロジェクト構成

```
.
├── pages/                     # 各機能のHTMLページ
│   ├── index.html            # ホーム画面
│   ├── login.html            # ログイン・新規登録
│   ├── search.html           # 検索機能 [NEW]
│   ├── user-profile.html     # マイページ
│   ├── profile-edit.html     # プロフィール編集 [NEW]
│   ├── settings.html         # アプリ設定 [NEW]
│   ├── help.html            # ヘルプ・FAQ [NEW]
│   ├── interests-edit.html   # 興味・関心編集 [NEW]
│   ├── event-calendar.html   # イベントカレンダー
│   ├── event-detail.html     # イベント詳細
│   ├── saved-spot-list.html  # 保存済みスポット一覧
│   ├── saved-spot-detail.html # スポット詳細
│   ├── spot-reservation.html # スポット予約
│   ├── coupon-list.html      # クーポン一覧
│   ├── coupon-detail.html    # クーポン詳細
│   ├── experience-share.html # 体験投稿
│   ├── notifications.html    # 通知一覧
│   └── notification-settings.html # 通知設定
├── scripts/                  # ページ固有のJavaScript
│   ├── interests-edit.js     # [NEW] 興味・関心編集機能
│   ├── search.js            # [NEW] 検索機能
│   ├── profile-edit.js      # [NEW] プロフィール編集機能
│   ├── settings.js          # [NEW] 設定管理機能
│   ├── help.js              # [NEW] ヘルプ・FAQ機能
│   └── ...                  # その他既存のスクリプト
├── src/                      # コア機能とサービス
│   ├── components/
│   │   └── mobile-ui.js     # [UPDATED] モバイルUI共通機能
│   ├── services/            # API・認証・ストレージサービス
│   └── utils/               # ユーティリティ関数
├── styles/                   # CSS・スタイルシート
├── config/                   # アプリケーション設定
├── data/                     # JSONデータ（イベント・スポット・クーポン）
├── assets/                   # 画像・フォント・アイコン
├── test-navigation.html      # [NEW] ナビゲーションテスト用
└── test-navigation-debug.html # [NEW] デバッグ用テストページ
```

---

## 🎯 主な機能

### 🏠 ホーム画面 (`index.html`)
- **検索機能**: キーワード・カテゴリー検索
- **クイックアクセス**: スポット・予約・投稿・お気に入り・SNS投稿
- **イベント・クーポンボタン**: 各機能への直接アクセス
- **通知設定**: プッシュ通知の管理

### 🔍 検索機能 (`search.html`) [NEW]
- **リアルタイム検索**: 入力中の動的検索
- **人気キーワード**: よく検索されるキーワード表示
- **カテゴリー検索**: 観光・グルメ・イベント等のカテゴリー別検索
- **検索履歴**: 過去の検索キーワード保存

### 👤 ユーザー管理
- **マイページ** (`user-profile.html`): プロフィール表示・設定アクセス
- **プロフィール編集** (`profile-edit.html`) [NEW]: 基本情報・興味関心の編集
- **設定** (`settings.html`) [NEW]: アプリ設定・通知・プライバシー設定
- **興味・関心編集** (`interests-edit.html`) [NEW]: パーソナライズ設定

### 📅 イベント機能
- **イベントカレンダー** (`event-calendar.html`): 月間カレンダー表示
- **イベント詳細** (`event-detail.html`): 詳細情報・地図・予約リンク
- **通知設定** (`notification-settings.html`): イベント通知のカスタマイズ

### 📍 スポット機能
- **スポット一覧** (`saved-spot-list.html`): お気に入りスポット管理
- **スポット詳細** (`saved-spot-detail.html`): 詳細情報・口コミ・写真
- **スポット予約** (`spot-reservation.html`): 3ステップ予約フロー

### 🎫 クーポン機能
- **クーポン一覧** (`coupon-list.html`): ブランド別フィルタ・検索
- **クーポン詳細** (`coupon-detail.html`): バーコード表示・利用条件

### 📸 体験投稿 (`experience-share.html`)
- **写真投稿**: カメラ・ギャラリーからの画像アップロード
- **タグ機能**: おすすめタグ・カスタムタグ
- **SNS連携**: Twitter・Instagram・Facebook連携

### ❓ サポート機能
- **ヘルプ** (`help.html`) [NEW]: FAQ・お問い合わせ・利用ガイド
- **通知** (`notifications.html`): 通知履歴・既読管理

---

## 🛠️ 技術スタック

### フロントエンド
- **HTML5** / **CSS3** / **JavaScript (ES6+)**
- **TailwindCSS**: ユーティリティファーストCSS
- **Lucide Icons**: アイコンライブラリ
- **Google Fonts**: M PLUS Rounded 1c フォント

### 外部ライブラリ
- **JsBarcode**: バーコード生成ライブラリ
- **ScrollReveal.js**: スクロールアニメーション
- **Web APIs**: LocalStorage・Notification API・File API

### データ管理
- **JSON形式**: 構造化データ管理 (`/data/`配下)
- **LocalStorage**: クライアントサイドデータ永続化
- **Session Storage**: 一時的なデータ保存

---

## 🔧 最新の改善点 (v2.0)

### ✅ 完了した機能追加・修正
- **全ページナビゲーション統一**: すべてのボタンで適切な画面遷移を実装
- **新規ページ5つ追加**: 検索・設定・ヘルプ・プロフィール編集・興味関心編集
- **JavaScriptファイル完全実装**: 各新規ページの機能を完全実装
- **モバイルUI修正**: ナビゲーション処理のバグ修正
- **データ永続化**: ローカルストレージによる設定・プロフィール保存
- **テスト環境構築**: ナビゲーションテスト・デバッグページ追加

### 🆕 新機能
- **リアルタイム検索**: 入力に応じた動的検索結果表示
- **設定のインポート/エクスポート**: ユーザーデータのバックアップ機能
- **FAQ検索**: ヘルプページでの質問検索機能
- **興味・関心カスタマイズ**: パーソナライズされた推奨機能
- **フォームバリデーション**: 入力内容の検証機能

---

## 🚀 開発・デプロイ

### ローカル開発
```bash
# プロジェクトクローン
git clone <repository-url>
cd pbl-tour-app

# ローカルサーバー起動 (例: Live Server)
# http://localhost:5500/pages/index.html でアクセス
```

### テスト
```bash
# ナビゲーションテスト
open test-navigation.html

# デバッグテスト
open test-navigation-debug.html
```

---

## 📄 ライセンス

本プロジェクトは学習目的で開発されています。  

---

**最終更新**: 2025年7月23日  
**バージョン**: v2.0 - ナビゲーション統一・新機能追加版