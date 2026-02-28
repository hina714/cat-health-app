# Vercel へのデプロイ

## 404 エラーの対処

React Router を使った SPA を Vercel にデプロイすると、ページをリロードしたり URL を直打ちしたときに 404 エラーが発生する。

### 原因

React Router はブラウザ側でルーティングを管理する仕組み。`/record` や `/graph` というファイルは実際には存在しない。

```
ブラウザ内でのリンク遷移
  → React Router が処理 → OK

ページをリロード or URL 直打ち
  → Vercel のサーバーが /record を探す → ファイルがない → 404
```

### 解決策

プロジェクトルートに `vercel.json` を追加して、全リクエストを `index.html` に向ける。

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

これで Vercel はどのパスへのリクエストでも `index.html` を返し、React Router が正しくルーティングを処理できるようになる。
