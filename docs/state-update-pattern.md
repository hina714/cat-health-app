# State の更新パターン

`setForm(prev => ({ ...prev, [name]: value }))` の解説。

---

## 全体の意味

「前の状態を全部残しつつ、変更されたフィールドだけ更新する」

```ts
setForm(prev => ({ ...prev, [name]: value }))
//       ↑           ↑          ↑
//  前の状態を受取る  全部コピー  1つだけ上書き
```

---

## ① 関数を渡す更新

`setState` には値を直接渡す方法と、関数を渡す方法がある。

```ts
// 値を直接渡す
setForm({ name: 'みけ', ... })

// 関数を渡す（今回の書き方）
setForm(prev => ({ ...prev, name: 'みけ' }))
```

関数を渡すと `prev`（更新前の state）を受け取れる。
**「今の値をベースに更新したい」ときに使う。**

---

## ② スプレッド構文 `...prev`

`...prev` は「prev の中身を全部展開する」という意味。

```ts
const prev = { name: 'みけ', breed: 'スコティッシュ', sex: 'female' }

{ ...prev }
// → { name: 'みけ', breed: 'スコティッシュ', sex: 'female' }
```

1つだけ変えるつもりが他のフィールドを消してしまわないよう、まず全部コピーする。

---

## ③ 計算プロパティ名 `[name]: value`

スプレッドの後ろに書くと、同じキーを上書きできる。

```ts
const name = 'breed'
const value = 'マンチカン'

{ ...prev, [name]: value }
// → { name: 'みけ', breed: 'マンチカン', sex: 'female' }
//                   ↑ breed だけ上書きされた
```

`[name]` は変数の中身をキーとして使う記法。

```ts
const key = 'breed'
{ [key]: 'マンチカン' }  // { breed: 'マンチカン' } と同じ
```

---

## ④ `=> ({ })` のカッコが必要な理由

アロー関数でオブジェクトをそのまま返すとき、`{}` だけだと関数の本体と区別がつかない。

```ts
// NG: {} が関数の本体と解釈される
prev => { ...prev, [name]: value }

// OK: () で包むとオブジェクトと分かる
prev => ({ ...prev, [name]: value })
```

---

## このプロジェクトでの使われ方

`ProfilePage.tsx` では1つの `handleChange` で全フィールドを処理している。

```ts
const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target  // どの input が変わったか
  setForm(prev => ({ ...prev, [name]: value }))  // そのフィールドだけ更新
}
```

`<input name="breed" />` が変わったとき:

```
e.target.name  → 'breed'
e.target.value → 'マンチカン'
        ↓
{ ...prev, breed: 'マンチカン' }
```
