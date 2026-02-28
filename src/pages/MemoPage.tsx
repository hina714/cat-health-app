import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MemoPage.module.css'

type DailyRecord = {
  id: string
  date: string
  weight: number | null
  foodAmount: number | null
  pooped: boolean | null
  memo: string
  tags: string[]
}

const loadRecords = (): DailyRecord[] => {
  const saved = localStorage.getItem('daily_records')
  return saved ? JSON.parse(saved) : []
}

export default function MemoPage() {
  const navigate = useNavigate()
  const [records, setRecords] = useState<DailyRecord[]>(loadRecords)

  const handleEdit = (record: DailyRecord) => {
    navigate('/record', { state: { record } })
  }

  const handleDelete = (id: string) => {
    const updated = records.filter(r => r.id !== id)
    setRecords(updated)
    localStorage.setItem('daily_records', JSON.stringify(updated))
  }

  if (records.length === 0) {
    return (
      <div className={styles.page}>
        <h1 className={styles.title}>メモ一覧</h1>
        <p className={styles.empty}>記録がまだありません</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>メモ一覧</h1>

      <ul className={styles.list}>
        {records.map(record => (
          <li key={record.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <span className={styles.date}>{record.date}</span>
              <div className={styles.actions}>
                <button
                  className={styles.editButton}
                  onClick={() => handleEdit(record)}
                >
                  編集
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDelete(record.id)}
                >
                  削除
                </button>
              </div>
            </div>

            <div className={styles.stats}>
              {record.weight !== null && (
                <span className={styles.stat}>体重 {record.weight} kg</span>
              )}
              {record.foodAmount !== null && (
                <span className={styles.stat}>食事 {record.foodAmount} g</span>
              )}
              {record.pooped !== null && (
                <span className={styles.stat}>
                  {record.pooped ? 'うんち：した' : 'うんち:してない'}
                </span>
              )}
            </div>

            {record.memo && (
              <p className={styles.memo}>{record.memo}</p>
            )}

            {record.tags.length > 0 && (
              <div className={styles.tags}>
                {record.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
