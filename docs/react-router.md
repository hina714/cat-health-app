# React Router 使い方ガイド

このプロジェクトで使っている React Router v7 の基本をまとめます。

---

## React Router とは

URL（パス）と画面コンポーネントを対応させるライブラリ。
例：`/record` にアクセスしたら `RecordPage` を表示する、という設定ができる。

---

## 基本の仕組み（3つのパーツ）

### 1. `<BrowserRouter>` - 全体を包むラッパー

```tsx
// App.tsx
import { BrowserRouter } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      {/* この中でルーティングが使える */}
    </BrowserRouter>
  )
}
```

アプリ全体をこれで包むことで、子コンポーネントでルーティング機能が使えるようになる。
**基本的にアプリに1つだけ置く。**

---

### 2. `<Routes>` と `<Route>` - URL と画面の対応表

```tsx
import { Routes, Route } from 'react-router-dom'

<Routes>
  <Route path="/" element={<ProfilePage />} />
  <Route path="/record" element={<RecordPage />} />
  <Route path="/graph" element={<GraphPage />} />
  <Route path="/memos" element={<MemoPage />} />
</Routes>
```

- `path` → URLのパス
- `element` → そのパスで表示するコンポーネント
- `<Routes>` は「どれか1つだけ表示する」コンテナ。現在のURLに一致した `<Route>` だけが描画される。

---

### 3. `<NavLink>` - ナビゲーションリンク

```tsx
import { NavLink } from 'react-router-dom'

<NavLink to="/record">記録</NavLink>
```

HTMLの `<a>` タグと違い、**ページをリロードせずに画面を切り替える**。

#### `isActive` でアクティブなタブのスタイルを変える

```tsx
<NavLink
  to="/record"
  className={({ isActive }) => isActive ? 'active' : ''}
>
  記録
</NavLink>
```

`isActive` は現在のURLがそのリンクのパスと一致しているとき `true` になる。

#### `end` プロパティ（トップページ専用）

```tsx
<NavLink to="/" end>プロフィール</NavLink>
```

`end` をつけないと `/` は `/record` や `/graph` など全てのパスに一致してしまう。
`end` をつけると「完全一致のときだけアクティブ」になる。

---

## このプロジェクトでの使い方まとめ

```
URL          表示される画面
/            ProfilePage
/record      RecordPage
/graph       GraphPage
/memos       MemoPage
```

`BottomNav.tsx` の `NavLink` をタップすると URL が変わり、
`App.tsx` の `Routes` が対応するページコンポーネントに切り替える。

---

## よく使う他のフック（今後使うかも）

### `useNavigate` - コードから画面遷移する

```tsx
import { useNavigate } from 'react-router-dom'

function SomeComponent() {
  const navigate = useNavigate()

  const handleSave = () => {
    // 保存処理...
    navigate('/') // 保存後にプロフィール画面へ移動
  }
}
```

### `useParams` - URLのパラメータを取得する

```tsx
// Route の設定
<Route path="/memos/:id" element={<MemoDetailPage />} />

// コンポーネント内
import { useParams } from 'react-router-dom'

function MemoDetailPage() {
  const { id } = useParams() // URLの :id 部分が取れる
}
```

---

## Link と NavLink の違い

| | `<Link>` | `<NavLink>` |
|---|---|---|
| 画面遷移 | ✓ | ✓ |
| アクティブ判定 | ✗ | ✓ |
| 使いどころ | 通常のリンク | ナビゲーションメニュー |
