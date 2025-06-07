#!/bin/bash

# このスクリプトはFirebaseバージョンからローカルストレージバージョンに切り替えるためのものです

# 現在のファイルをバックアップ
echo "現在のファイルをバックアップしています..."
cp app/page.tsx app/firebase-page.tsx
cp app/new-post/page.tsx app/new-post/firebase-page.tsx
cp components/header.tsx components/firebase-header.tsx

# ローカル版をメインファイルに移動
echo "ローカルストレージバージョンをメインファイルに移動しています..."
cp app/local-page.tsx app/page.tsx
cp app/new-post/local-page.tsx app/new-post/page.tsx
cp components/local-header.tsx components/header.tsx

echo "ローカルストレージバージョンへの切り替えが完了しました！"