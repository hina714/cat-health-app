# フォームの扱い方

React でフォームを扱うときの基本をまとめます。

---

## e.preventDefault()

`<form>` はブラウザのデフォルト動作として、送信ボタンを押すと**ページをリロード**する。

```
ボタンを押す
    ↓
フォームが送信される
    ↓
ページがリロードされる  ← 困る！
    ↓
state がリセットされて入力内容が消える
```

`e.preventDefault()` で「ブラウザのデフォルト動作をキャンセル」できる。

```ts
const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
  e.preventDefault()  // リロードをキャンセル
  // ここに自分で保存処理を書く
}
```

React でフォームを扱うときは**ほぼ必ず書く**。

---

## フォームの基本構造

```tsx
<form onSubmit={handleSubmit}>
  <input name="name" value={form.name} onChange={handleChange} />
  <button type="submit">保存する</button>
</form>
```

- `onSubmit` → 送信ボタンが押されたときの処理
- `onChange` → input の値が変わるたびに呼ばれる処理

---

## onChange で state を更新する

→ 詳しくは [state-update-pattern.md](./state-update-pattern.md) を参照

```ts
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target
  setForm(prev => ({ ...prev, [name]: value }))
}
```
