# レビュー記録: ProfilePage.tsx

日付: 2026-02-28

## 対象ファイル

`src/pages/ProfilePage.tsx`

---

## 良かった点

- `ProfileForm` 型をきちんと定義していて TypeScript らしい書き方
- `initialForm` をコンポーネントの外に切り出してスッキリしている
- `label` と `input` を `htmlFor` / `id` で紐づけていてアクセシビリティ的に正しい
- 保存後に「保存しました」を表示する UX が丁寧

---

## 質問と回答

### Q1. なぜ1つの `handleChange` で全フィールドを処理できるのか？

**回答:** わからなかった

**解説:**

2つのポイントがある。

**① `e.target.name`**
各 `<input>` に `name` 属性をつけることで、どの input が変更されたか分かる。

```tsx
<input name="breed" />  // → e.target.name が 'breed' になる
```

**② 計算プロパティ名 `[name]`**
変数の中身をオブジェクトのキーとして使う記法。

```ts
const name = 'breed'
{ [name]: 'マンチカン' }  // → { breed: 'マンチカン' }
```

この2つを組み合わせることで、1つの関数でどのフィールドが変わったかを動的に判断できる。

---

### Q2. `setForm(prev => ({ ...prev, [name]: value }))` の詳細

**回答:** なんとなく理解できた

**解説:**

| パーツ | 意味 |
|--------|------|
| `prev =>` | 更新前の state を受け取る |
| `...prev` | 全フィールドをコピーする（スプレッド構文） |
| `[name]: value` | 変更されたフィールドだけ上書き |
| `({ })` | `()` で包まないとオブジェクトが関数の本体と誤解される |

```ts
// 前の状態を全部残しつつ、1つだけ上書きする
setForm(prev => ({ ...prev, [name]: value }))
```

→ 詳しくは `docs/state-update-pattern.md` を参照

---

### Q3. `e.preventDefault()` は何をしているか？

**回答:** わからなかった

**解説:**

`<form>` はデフォルトでボタン押下時にページをリロードする。
`e.preventDefault()` でそのデフォルト動作をキャンセルできる。

```ts
const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault()  // リロードをキャンセル → 入力内容が消えない
  localStorage.setItem('cat_profile', JSON.stringify(form))
  setSaved(true)
}
```

React でフォームを扱うときはほぼ必ず書く。

→ 詳しくは `docs/form-handling.md` を参照

---

## 総評

フォームの基本的な構造（`useState` での管理・`onChange` / `onSubmit` の使い方）の土台となる概念を学んだ。
次回以降は Context を使ってデータをアプリ全体で共有する方法に進む予定。
