import { BrowserRouter, Route, Routes } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import ProfilePage from './pages/ProfilePage'
import RecordPage from './pages/RecordPage'
import GraphPage from './pages/GraphPage'
import MemoPage from './pages/MemoPage'
import styles from './App.module.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className={styles.layout}>
        <main className={styles.main}>
          <Routes>
            <Route path="/" element={<ProfilePage />} />
            <Route path="/record" element={<RecordPage />} />
            <Route path="/graph" element={<GraphPage />} />
            <Route path="/memos" element={<MemoPage />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
