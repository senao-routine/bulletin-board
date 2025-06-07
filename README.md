# 花園ジャパンツアー✕生成AI授業 振り返りコメントフォーム

花園ジャパンツアー✕生成AI授業の振り返りコメントを投稿するためのWeb掲示板アプリケーションです。参加者が授業の感想や考えを共有できます。

## 機能

- コメント投稿
- コメント一覧表示
- 管理者機能（投稿削除）
- 黒板風のデザイン

## 技術スタック

- Next.js
- TypeScript
- Tailwind CSS
- Firebase (Firestore Database)

## セットアップ方法

### 1. リポジトリのクローン

```bash
git clone https://github.com/senao-routine/bulletin-board.git
cd bulletin-board
```

### 2. 依存パッケージのインストール

```bash
npm install
# または
yarn install
# または
pnpm install
```

### 3. Firebaseプロジェクトのセットアップ

1. [Firebase Console](https://console.firebase.google.com/)にアクセスし、新しいプロジェクトを作成します。
2. Webアプリを追加し、Firebaseの構成情報を取得します。
3. Firestoreデータベースを作成し、テストモードで開始します。

### 4. 環境変数の設定

`.env.local.example`ファイルを`.env.local`にコピーし、Firebaseの設定情報を入力します：

```bash
cp .env.local.example .env.local
```

`.env.local`ファイルを編集し、Firebaseの設定値を入力します：

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 5. アプリケーションの実行

```bash
npm run dev
# または
yarn dev
# または
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを表示します。

## Firebase設定ファイル

Firebaseへのデプロイを行う場合は、`.firebaserc`と`firebase.json`ファイルを作成します：

```bash
npm install -g firebase-tools
firebase login
firebase init
```

## Vercelへのデプロイ

このアプリケーションはVercelに簡単にデプロイできます：

1. [Vercel](https://vercel.com)にアカウントを作成
2. GitHubリポジトリと連携
3. プロジェクトを作成し、環境変数を設定
4. デプロイを実行

## 管理者アクセス

管理者アクセスのデフォルトパスワードは`admin`です。実運用環境では必ず変更してください。

## ライセンス

MIT