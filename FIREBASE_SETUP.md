# Firebase設定手順

このアプリケーションをFirebaseで運用するための詳細なセットアップ手順です。

## 1. Firebaseプロジェクトの作成

1. [Firebase Console](https://console.firebase.google.com/)にアクセスします
2. 「プロジェクトを追加」をクリックします
3. プロジェクト名を入力（例：「hanazono-comment-board」）し、続行します
4. Googleアナリティクスは必要に応じて有効/無効を選択し、プロジェクトを作成します

## 2. Firestoreデータベースのセットアップ

1. 左側のメニューから「Firestore Database」を選択します
2. 「データベースの作成」をクリックします
3. セキュリティルールとして「テストモードで開始する」を選択します（後でセキュリティルールを設定できます）
4. リージョンを選択し（推奨: asia-northeast1 - 東京）、「有効にする」をクリックします

## 3. Webアプリの登録

1. プロジェクトのトップページで「</>」アイコン（Webアプリケーション）をクリックします
2. アプリのニックネームを入力します（例：「hanazono-comment-board-web」）
3. 「このアプリのFirebase Hostingも設定する」はオプションです
4. 「アプリを登録」をクリックします
5. 表示されるFirebaseの設定情報をコピーします

## 4. 環境変数の設定

このプロジェクトのルートディレクトリに`.env.local`ファイルを作成し、Firebaseの設定情報を入力します：

```
NEXT_PUBLIC_FIREBASE_API_KEY=コピーしたapiKey
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=コピーしたauthDomain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=コピーしたprojectId
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=コピーしたstorageBucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=コピーしたmessagingSenderId
NEXT_PUBLIC_FIREBASE_APP_ID=コピーしたappId
```

## 5. 運用開始手順

1. ローカル開発環境での変更をテスト：

```bash
npm run dev
```

2. 本番ビルドを作成：

```bash
npm run build
```

3. 本番環境をプレビュー：

```bash
npm run start
```

## 6. Firebaseへのデプロイ（オプション）

1. Firebase CLIをインストールします（まだの場合）：

```bash
npm install -g firebase-tools
```

2. Firebaseにログインします：

```bash
firebase login
```

3. プロジェクトディレクトリでFirebaseプロジェクトを初期化します：

```bash
firebase init
```

4. 「Hosting」を選択します
5. 既存のプロジェクトを選択し、先ほど作成したFirebaseプロジェクトを選択します
6. パブリックディレクトリとして「out」を指定します
7. シングルページアプリケーションの設定は「No」と答えます
8. 自動ビルドとデプロイの設定は任意です

7. Next.jsのエクスポート設定を行います。`next.config.mjs`ファイルに以下を追加します：

```js
const nextConfig = {
  // 他の設定...
  output: 'export',
}
```

8. ビルドを実行します：

```bash
npm run build
```

9. Firebaseにデプロイします：

```bash
firebase deploy
```

## 7. Vercelへのデプロイ（推奨）

1. [Vercel](https://vercel.com)にアカウントを作成します
2. GitHubリポジトリと連携します
3. 「Import」をクリックしてプロジェクトをインポートします
4. 環境変数を設定します（すべてのFirebase設定をVercelプロジェクト設定で入力）
5. デプロイを実行します

## 8. セキュリティルールの設定

Firestoreのセキュリティルールを適切に設定することを忘れないでください。例として：

```rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 投稿コレクションは誰でも読み取れるが、書き込みは認証済みユーザーのみ
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null || true; // テスト用に一時的にtrueにしています
    }
  }
}
```

## 注意事項

- テストモードのセキュリティルールは30日後に期限切れになります
- 実際の運用では適切なセキュリティルールを設定してください
- 環境変数は公開リポジトリにコミットしないでください