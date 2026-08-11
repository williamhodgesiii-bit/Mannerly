import { NavLink } from 'react-router-dom'
import Icon, { type IconName } from '@/components/Icon'
import { haptic } from '@/lib/haptics'

const TABS: { to: string; icon: IconName; label: string; end: boolean }[] = [
  { to: '/', icon: 'learn', label: 'Learn', end: true },
  { to: '/explore', icon: 'explore', label: 'Explore', end: false },
  { to: '/passport', icon: 'passport', label: 'Passport', end: false },
  { to: '/me', icon: 'profile', label: 'Me', end: false },
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
          <span className="tab-ico"><Icon name={t.icon} size={24} /></span>
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
