# 配列の操作パターン

React で配列の state を扱うときによく使うパターンをまとめます。

---

## タグのトグル（追加・削除の切り替え）

タップするたびに ON/OFF が切り替わる処理。

```ts
const handleTagToggle = (tag: string) => {
  setForm(prev => {
    const tags = prev.tags.includes(tag)
      ? prev.tags.filter(t => t !== tag)  // すでにある → 削除
      : [...prev.tags, tag]               // まだない  → 追加
    return { ...prev, tags }
  })
}
```

**流れ:**

```
タップ
  ↓
すでに選択済み？
  YES → filter で取り除く（削除）
  NO  → スプレッドで末尾に足す（追加）
```

---

## includes() — 配列に値が含まれているか調べる

```ts
['嘔吐', '下痢'].includes('嘔吐')  // → true（含まれている）
['嘔吐', '下痢'].includes('咳')    // → false（含まれていない）
```

---

## filter() — 条件に合う要素だけ残す

```ts
['嘔吐', '下痢', '咳'].filter(t => t !== '下痢')
// → ['嘔吐', '咳']  ※ '下痢' だけ取り除かれた
```

「条件が true の要素だけ残す」配列メソッド。削除に使う。

---

## スプレッドで追加 [...prev, 新しい値]

```ts
const prev = ['嘔吐', '下痢']

[...prev, '咳']
// → ['嘔吐', '下痢', '咳']
```

元の配列を変えずに、末尾に要素を追加した新しい配列を作る。

> **注意:** React の state は直接変更してはいけない。
> `prev.push('咳')` はNG、`[...prev, '咳']` がOK。

---

## sort() — コピーしてから並び替える

`.sort()` は**元の配列を直接書き換える**メソッド。
React では state を直接変更してはいけないので、必ずコピーしてから使う。

```ts
// NG: records（state）が直接書き換わってしまう
records.sort((a, b) => a.date.localeCompare(b.date))

// OK: スプレッドでコピーしてから sort する
[...records].sort((a, b) => a.date.localeCompare(b.date))
```

**流れ:**

```
[...records]  → records のコピーを作る
    ↓
.sort()       → コピーを並び替える（元の records は無傷）
```

---

## このプロジェクトでの使われ方

`RecordPage.tsx` の症状タグ選択で使用。

```ts
// タグをタップ → ON/OFF 切り替え
prev.tags.includes(tag)
  ? prev.tags.filter(t => t !== tag)  // 削除
  : [...prev.tags, tag]               // 追加
```
