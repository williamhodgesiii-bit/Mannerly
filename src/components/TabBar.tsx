import { NavLink } from 'react-router-dom'
import { haptic } from '@/lib/haptics'

const TABS = [
  { to: '/', icon: '🧭', label: 'Learn', end: true },
  { to: '/explore', icon: '🌍', label: 'Explore', end: false },
  { to: '/passport', icon: '📔', label: 'Passport', end: false },
  { to: '/me', icon: '🙂', label: 'Me', end: false },
]

export default function TabBar() {
  return (
    <nav className="tabbar">
      {TABS.map((t) => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.end}
          onClick={() => haptic('select')}
          className={({ isActive }) => `tab ${isActive ? 'tab--active' : ''}`}
        >
          <span className="tab-ico">{t.icon}</span>
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
