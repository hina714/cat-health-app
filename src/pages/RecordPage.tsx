import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import styles from './RecordPage.module.css'
import WheelPicker from '../components/WheelPicker'

type RecordForm = {
  date: string
  weight: string
  foodAmount: string
  pooped: boolean | null
  memo: string
  tags: string[]
}

type SavedRecord = {
  id: string
  date: string
  weight: number | null
  foodAmount: number | null
  pooped: boolean | null
  memo: string
  tags: string[]
}

const SYMPTOM_TAGS = ['嘔吐', '軟便', '下痢', '食欲不振', '元気がない', '飲水量増加', 'くしゃみ', '咳']

// 1.0〜10.0kg を 0.1kg 刻み
const WEIGHT_OPTIONS = Array.from({ length: 91 }, (_, i) =>
  ((i + 10) / 10).toFixed(1)
)

// 50〜140g を 5g 刻み
const FOOD_OPTIONS = Array.from({ length: 19 }, (_, i) =>
  String(50 + i * 5)
)

const today = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export default function RecordPage() {
  const location = useLocation()
  const navigate = useNavigate()

  // MemoPage から編集で遷移してきた場合、record が渡される
  const editRecord: SavedRecord | undefined = location.state?.record
  const isEditing = !!editRecord

  const [form, setForm] = useState<RecordForm>(() => {
    if (editRecord) {
      return {
        date: editRecord.date,
        weight: editRecord.weight?.toString() ?? '',
        foodAmount: editRecord.foodAmount?.toString() ?? '',
        pooped: editRecord.pooped,
        memo: editRecord.memo,
        tags: editRecord.tags,
      }
    }
    return {
      date: today(),
      weight: '',
      foodAmount: '',
      pooped: null,
      memo: '',
      tags: [],
    }
  })

  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  const handlePoopToggle = (value: boolean) => {
    setForm(prev => ({ ...prev, pooped: prev.pooped === value ? null : value }))
    setSaved(false)
  }

  const handleTagToggle = (tag: string) => {
    setForm(prev => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
      return { ...prev, tags }
    })
    setSaved(false)
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()

    const existing = localStorage.getItem('daily_records')
    const records: SavedRecord[] = existing ? JSON.parse(existing) : []

    const record: SavedRecord = {
      id: editRecord?.id ?? crypto.randomUUID(),
      date: form.date,
      weight: form.weight ? parseFloat(form.weight) : null,
      foodAmount: form.foodAmount ? parseInt(form.foodAmount) : null,
      pooped: form.pooped,
      memo: form.memo,
      tags: form.tags,
    }

    const updated = isEditing
      ? records.map(r => r.id === record.id ? record : r)  // 編集: 既存レコードを差し替え
      : [record, ...records.filter(r => r.date !== form.date)]  // 新規: 同日を上書き

    localStorage.setItem('daily_records', JSON.stringify(updated))
    setSaved(true)

    if (isEditing) {
      setTimeout(() => navigate('/memos'), 800)
    }
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{isEditing ? '記録を編集' : '記録'}</h1>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="date">日付</label>
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.label}>体重（kg）</span>
            <WheelPicker
              options={WEIGHT_OPTIONS}
              value={form.weight || WEIGHT_OPTIONS[39]}
              onChange={v => setForm(prev => ({ ...prev, weight: v }))}
            />
          </div>

          <div className={styles.field}>
            <span className={styles.label}>食事量（g）</span>
            <WheelPicker
              options={FOOD_OPTIONS}
              value={form.foodAmount || FOOD_OPTIONS[6]}
              onChange={v => setForm(prev => ({ ...prev, foodAmount: v }))}
              unit="g"
            />
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.label}>うんち</span>
          <div className={styles.poopGroup}>
            <button
              type="button"
              onClick={() => handlePoopToggle(true)}
              className={`${styles.poopButton} ${form.pooped === true ? styles.poopDone : ''}`}
            >
               した
            </button>
            <button
              type="button"
              onClick={() => handlePoopToggle(false)}
              className={`${styles.poopButton} ${form.pooped === false ? styles.poopNotDone : ''}`}
            >
               してない
            </button>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="memo">体調メモ</label>
          <textarea
            id="memo"
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="気になることを自由に記録..."
            className={styles.textarea}
            rows={3}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.label}>症状タグ</span>
          <div className={styles.tags}>
            {SYMPTOM_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`${styles.tag} ${form.tags.includes(tag) ? styles.tagActive : ''}`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <button type="submit" className={styles.button}>
          {isEditing ? '更新する' : '保存する'}
        </button>

        {saved && (
          <p className={styles.savedMessage}>
            {isEditing ? '更新しました' : '保存しました'}
          </p>
        )}
      </form>
    </div>
  )
}
