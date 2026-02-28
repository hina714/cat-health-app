import { useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import styles from './GraphPage.module.css'

type DailyRecord = {
  id: string
  date: string
  weight: number | null
  foodAmount: number | null
  memo: string
  tags: string[]
}

type Period = 'week' | 'month' | 'all'

const PERIODS: { label: string; value: Period }[] = [
  { label: '1週間', value: 'week' },
  { label: '1ヶ月', value: 'month' },
  { label: '全期間', value: 'all' },
]

const loadRecords = (): DailyRecord[] => {
  const saved = localStorage.getItem('daily_records')
  return saved ? JSON.parse(saved) : []
}

const filterByPeriod = (records: DailyRecord[], period: Period): DailyRecord[] => {
  if (period === 'all') return records

  const now = new Date()
  const days = period === 'week' ? 7 : 30
  const from = new Date(now)
  from.setDate(now.getDate() - days)

  return records.filter(r => new Date(r.date) >= from)
}

export default function GraphPage() {
  const [period, setPeriod] = useState<Period>('week')

  const records = loadRecords()
  const sorted = [...records].sort((a, b) => a.date.localeCompare(b.date))
  const filtered = filterByPeriod(sorted, period)

  const data = filtered.map(r => ({
    date: r.date.slice(5),  // "2026-02-28" → "02-28"
    weight: r.weight,
    foodAmount: r.foodAmount,
  }))

  const hasData = data.length > 0

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>グラフ</h1>

      <div className={styles.periodTabs}>
        {PERIODS.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setPeriod(value)}
            className={`${styles.tab} ${period === value ? styles.tabActive : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {!hasData ? (
        <p className={styles.empty}>この期間の記録がありません</p>
      ) : (
        <>
          <div className={styles.chartSection}>
            <h2 className={styles.chartTitle}>体重（kg）</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="weight"
                  name="体重"
                  stroke="#ff7a45"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className={styles.chartSection}>
            <h2 className={styles.chartTitle}>食事量（g）</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} domain={['auto', 'auto']} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="foodAmount"
                  name="食事量"
                  stroke="#4caf50"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  )
}
