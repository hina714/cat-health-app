#!/bin/bash

# 使い方: ./create-project.sh <プロジェクト名>
# 例: ./create-project.sh my-app

set -e

PROJECT_NAME=${1:-my-app}

echo "🚀 プロジェクト作成: $PROJECT_NAME"

# --- Vite プロジェクト作成 ---
npm create vite@latest "$PROJECT_NAME" -- --template react-ts
cd "$PROJECT_NAME"

# --- 依存ライブラリのインストール ---
npm install
npm install react-router-dom react-easy-crop recharts

# --- ディレクトリ構成 ---
mkdir -p src/pages src/components src/utils
mkdir -p docs reviews
mkdir -p .claude/skills/review

# --- vercel.json ---
cat > vercel.json << 'EOF'
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
EOF

# --- CLAUDE.md ---
cat > CLAUDE.md << 'EOF'
# Project - Claude Instructions

## 技術スタック

- React 19 + TypeScript + Vite
- React Router v7
- CSS Modules
- React Context + useContext（状態管理）

## 学習スタイル

このプロジェクトは学習がメイン。以下のフローで進める。

1. ユーザーが実装する（または Claude が実装する）
2. コードをレビューする
3. 「なぜこう書いたか」を聞いて理解度を確認する
4. 補足説明を添える

コードを書く際は答えをすぐ出さず、まずレビューと質問を優先すること。
EOF

# --- レビュースキル ---
cat > .claude/skills/review/SKILL.md << 'EOF'
---
name: review
description: 実装したコードをレビューし、理解度を深める質問をする。ユーザーが「レビューして」「確認して」「見て」と言ったときや、実装を見せてきたときに使う。
argument-hint: [ファイルパス or なし]
---

ユーザーが実装したコードをレビューして、学習を深めるサポートをする。

## 進め方

1. **コードを読む**
   - 引数にファイルパスがあればそのファイルを読む
   - なければ最近変更されたファイルを確認する

2. **良い点を伝える**
   - 実装できている部分を具体的に褒める
   - 正しく使えている概念やパターンを指摘する

3. **理解度を確認する質問をする**
   - 「なぜこう書きましたか？」
   - 「このXXXはどんな役割だと思いますか？」
   - 一度に質問は1〜2個まで。多すぎない。

4. **補足説明を添える**
   - 質問への回答を待ってから解説する
   - 別のアプローチや応用例があれば紹介する
   - 改善点があれば「こういう書き方もあります」と提案する（否定しない）

5. **セッション終了時に記録を保存する**
   - ユーザーが「終了」「終わり」「一旦終了」などと言ったら記録を保存する
   - 保存先: `reviews/YYYY-MM-DD_<対象ファイル名>.md`

## トーン

- 先生ではなく、一緒に考えるペアプログラマーとして接する
- 間違いを指摘するより「気づき」を促す
- 専門用語を使う場合は簡単な説明を添える
EOF

# --- docs/how-we-work.md ---
cat > docs/how-we-work.md << 'EOF'
# 進め方

## 全体の流れ

1. **仕様を決める** → `docs/spec.md` にまとめる
2. **環境を整える** → Claude がセットアップ
3. **画面を実装する** → 基本は Claude が実装、理解度確認をしながら進める
4. **学んだことを記録する** → `docs/` にまとめ、`reviews/` にやりとりを保存

## 学習のルール

- 実装後に Claude がコードをレビューして**質問する**
- わからなければ素直に「わからない」でOK → Claude が解説する
- 理解できた内容は `docs/` にまとめて後から見返せるようにする
- レビューセッションが終わったら `reviews/` に記録を残す

## ファイル構成

| フォルダ | 用途 |
|----------|------|
| `docs/` | 学んだ概念・仕様のまとめ |
| `reviews/` | レビューセッションの記録 |
| `src/pages/` | 各画面のコンポーネント |
| `src/components/` | 共通コンポーネント |
| `src/utils/` | ユーティリティ関数 |
EOF

# --- グローバル CSS リセット ---
cat > src/index.css << 'EOF'
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #1a1a1a;
  background-color: #f5f5f5;
}

body {
  min-height: 100dvh;
}

button {
  font-family: inherit;
  cursor: pointer;
}

img {
  max-width: 100%;
  display: block;
}
EOF

# --- README ---
cat > README.md << 'EOF'
# $PROJECT_NAME

## 開発コマンド

```bash
npm run dev      # 開発サーバー起動
npm run build    # ビルド
npm run lint     # Lint
```

## Claude Code スキル

### `/review` - コードレビュー

実装したコードをレビューしてもらい、理解度を深める質問をしてもらえます。

```
/review src/pages/SomePage.tsx
```

セッション終了時（「終了」と言ったとき）に `reviews/` フォルダへ記録が自動保存されます。

## ドキュメント

- `docs/how-we-work.md` - 進め方
- `docs/spec.md` - 仕様書（別途作成）
EOF

echo ""
echo "✅ セットアップ完了: $PROJECT_NAME"
echo ""
echo "次のステップ:"
echo "  cd $PROJECT_NAME"
echo "  npm run dev"
