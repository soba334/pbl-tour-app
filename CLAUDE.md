# Claude Code Configuration

This file contains configuration and context for Claude Code to better understand and work with this project.

## Project Overview
Tour application project - HTML/CSS/JavaScript based web application

---

## AIツールの主な役割と支援範囲

AI支援ツールは以下のカテゴリの支援を前提とします：

### 1. ドメインモデル設計

* 型安全なモデルの定義補助
* データ永続化層との整合性考慮
* 各種データ変換処理の実装補助

### 2. データ同期・永続化

* 外部APIやデータベースとの同期ロジック支援
* ローカルキャッシュ管理の補助
* 整合性を重視したデータ操作の実装補助

### 3. 状態管理

* JavaScript状態管理の構成改善
* UIと状態管理層の最適化支援
* 複雑な状態の適切な分離と整理

### 4. UIロジック

* UI層での状態管理との連携最適化
* UIコンポーネント・画面遷移ロジックの支援

---

## AIツールの操作制限（コマンド制限）

> AIツールが使用できるのは**Makefileや指定されたスクリプト経由の安全な操作のみ**です。
> 明示的に許可されていない任意コマンドやスクリプトを**実行することはできません**。

---

## AIツールが触れてよいファイル種別

AIが読み書き支援を行うファイル範囲：

| 分類      | 対象パス例                           |
| ------- | ------------------------------- |
| モデル定義   | `src/models/**/*.js`            |
| サービス層   | `src/services/**/*.js`          |
| ユーティリティ | `src/utils/**/*.js`             |
| コンポーネント | `src/components/**/*.js`        |
| ページスクリプト| `scripts/**/*.js`               |
| HTMLページ | `pages/**/*.html`               |
| スタイル    | `styles/**/*.css`               |
| データファイル | `data/**/*.json`                |
| 設定ファイル  | `config/**/*.js`                |
| テスト     | `test/**/*.js`                  |
| その他     | 明示的に指定したファイルまたはフォルダ           |

---

## Web情報取得・検索のポリシー

AIツールが外部情報を取得する際は、原則として以下の信頼性の高い公式ドキュメントを優先します：

* 公式パッケージレジストリやドキュメント（例：MDN、npmなど）
* 使用するフレームワークやサービスの公式ドキュメント
* 言語・ライブラリの公式リファレンス

> 他サイトの情報取得はプロンプト内で指示された場合に限定します。

---

## AIツールへの前提条件

AIツールは以下の前提に基づいて動作します：

* 回答は常に **日本語＋Markdown形式**
* 不明点がある場合は **推定・補完・設計提案** を含めて出力
* システム間の**整合性を最重視**
* 明示的に関与しないと指定された処理には関与しない
* 許可されていないコマンドを**直接実行しない**

---

## AIツールを使用する前の確認事項

* AIツール用の設定ファイル（例：`.ai-tool/settings.json`）で必要な権限が許可されていることを確認
* AIツール用のターゲットがMakefileやスクリプトに存在することを確認
* AIツールの出力はあくまで補助的であり、最終的な仕様やコードのレビュー・確認は開発者が必ず行う

---

## Project Structure
- `pages/`: HTMLページファイル
- `scripts/`: ページ固有のJavaScriptファイル
- `styles/`: CSSスタイルファイル
- `src/`: アプリケーションのコアロジック
  - `components/`: 再利用可能なコンポーネント
  - `models/`: データモデル定義
  - `services/`: API、認証、通知等のサービス層
  - `utils/`: ユーティリティ関数
- `data/`: JSONデータファイル
- `assets/`: 静的リソース（画像、フォント等）
- `config/`: 設定ファイル

## Important Notes
- Main branch: `main`
- Pure HTML/CSS/JavaScript project (no build process required)
- Follow existing code conventions and patterns
- Always test changes manually before committing

---

このドキュメントは、AI支援ツールがプロジェクトにおいて安全・確実かつ構造化された支援を提供するための共通ガイドラインです。