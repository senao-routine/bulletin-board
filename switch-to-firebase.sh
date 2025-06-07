#!/bin/bash

# このスクリプトはローカルストレージバージョンからFirebaseバージョンに切り替えるためのものです

# 現在のFirebase用ファイルをバックアップ
echo "Firebaseファイルをバックアップしています..."
cp app/page.tsx app/local-page.tsx
cp app/new-post/page.tsx app/new-post/local-page.tsx
cp components/header.tsx components/local-header.tsx

# Firebase版をメインファイルに移動
echo "Firebaseバージョンをメインファイルに移動しています..."
cp app/firebase-page.tsx app/page.tsx
cp app/new-post/firebase-page.tsx app/new-post/page.tsx
cp components/firebase-header.tsx components/header.tsx

echo "Firebaseバージョンへの切り替えが完了しました！"
echo "注意: Firebaseの設定を.env.localファイルで行ってください。"