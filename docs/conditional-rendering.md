# 条件付きレンダリング

状況によって表示内容を切り替えるパターンをまとめます。

---

## 配列の件数で表示を分岐する

```tsx
if (records.length === 0) {
  return <p>記録がまだありません</p>
}

return <ul>...</ul>
```

**`length` とは:**

```ts
[].length              // → 0（空の配列）
['嘔吐', '下痢'].length // → 2（要素が2つ）
```

配列の要素数を返すプロパティ。

**判定のパターン:**

```ts
records.length === 0  // 0件 → 空の状態
records.length > 0    // 1件以上 → データがある
```

---

## if で早期 return する

```tsx
if (records.length === 0) {
  return <p>記録がまだありません</p>  // ここで return して終わり
}

// ここは records が1件以上のときだけ実行される
return <ul>...</ul>
```

条件を満たす場合に早めに `return` することで、ネストを深くせずにすむ。

---

## JSX の中で条件分岐する

`if` 文の代わりに JSX の中で直接書く方法もある。

**`&&` 演算子（条件が true のときだけ表示）:**

```tsx
{record.memo && <p>{record.memo}</p>}
// memo が空文字のときは何も表示しない
// memo に内容があるときだけ <p> を表示する
```

**三項演算子（true / false で表示を切り替え）:**

```tsx
{records.length === 0
  ? <p>記録がまだありません</p>
  : <ul>...</ul>
}
```

---

## このプロジェクトでの使われ方

`MemoPage.tsx` で記録の有無によって表示を切り替えている。

```tsx
// 記録なし → メッセージ表示
if (records.length === 0) {
  return <p>記録がまだありません</p>
}

// 記録あり → カード一覧を表示
return <ul>{records.map(...)}</ul>
```

また各カード内でも `&&` を使って、値がある項目だけ表示している。

```tsx
{record.weight !== null && (
  <span>体重 {record.weight} kg</span>
)}

{record.memo && (
  <p>{record.memo}</p>
)}
```
