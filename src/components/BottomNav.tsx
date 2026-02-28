import { NavLink } from 'react-router-dom'
import styles from './BottomNav.module.css'

const navItems = [
  { to: '/', label: 'プロフィール', icon: '🐱' },
  { to: '/record', label: '記録', icon: '📝' },
  { to: '/graph', label: 'グラフ', icon: '📈' },
  { to: '/memos', label: 'メモ', icon: '📋' },
]

export default function BottomNav() {
  return (
    <nav className={styles.nav}>
      {navItems.map(({ to, label, icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ''}`
          }
        >
          <span className={styles.icon}>{icon}</span>
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
