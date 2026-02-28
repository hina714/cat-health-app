import { useState } from 'react'
import styles from './RecordPage.module.css'

type TimeOfDay = 'morning' | 'evening'

type RecordForm = {
  date: string
  timeOfDay: TimeOfDay
  weight: string
  foodAmount: string
  pooped: boolean | null
  memo: string
  tags: string[]
}

const SYMPTOM_TAGS = ['嘔吐', '軟便', '下痢', '食欲不振', '元気がない', '飲水量増加', 'くしゃみ', '咳']

const today = () => {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const initialForm = (): RecordForm => ({
  date: today(),
  timeOfDay: 'morning',
  weight: '',
  foodAmount: '',
  pooped: null,
  memo: '',
  tags: [],
})

export default function RecordPage() {
  const [form, setForm] = useState<RecordForm>(initialForm)
  const [saved, setSaved] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
    const records = existing ? JSON.parse(existing) : []

    const newRecord = {
      id: crypto.randomUUID(),
      date: form.date,
      timeOfDay: form.timeOfDay,
      weight: form.weight ? parseFloat(form.weight) : null,
      foodAmount: form.foodAmount ? parseInt(form.foodAmount) : null,
      pooped: form.pooped,
      memo: form.memo,
      tags: form.tags,
    }

    // 同じ日付・同じ時間帯の記録は上書き
    const updated = [
      newRecord,
      ...records.filter(
        (r: { date: string; timeOfDay: TimeOfDay }) =>
          !(r.date === form.date && r.timeOfDay === form.timeOfDay)
      ),
    ]
    localStorage.setItem('daily_records', JSON.stringify(updated))
    setSaved(true)
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>記録</h1>

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

        <div className={styles.field}>
          <span className={styles.label}>時間帯</span>
          <div className={styles.timeOfDayGroup}>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, timeOfDay: 'morning' }))}
              className={`${styles.timeOfDayButton} ${form.timeOfDay === 'morning' ? styles.timeOfDayActive : ''}`}
            >
               朝
            </button>
            <button
              type="button"
              onClick={() => setForm(prev => ({ ...prev, timeOfDay: 'evening' }))}
              className={`${styles.timeOfDayButton} ${form.timeOfDay === 'evening' ? styles.timeOfDayActive : ''}`}
            >
               夜
            </button>
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="weight">体重（kg）</label>
            <input
              id="weight"
              name="weight"
              type="number"
              step="0.01"
              min="0"
              value={form.weight}
              onChange={handleChange}
              placeholder="4.20"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="foodAmount">食事量（g）</label>
            <input
              id="foodAmount"
              name="foodAmount"
              type="number"
              step="1"
              min="0"
              value={form.foodAmount}
              onChange={handleChange}
              placeholder="80"
              className={styles.input}
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

        <button type="submit" className={styles.button}>保存する</button>

        {saved && <p className={styles.savedMessage}>保存しました</p>}
      </form>
    </div>
  )
}
