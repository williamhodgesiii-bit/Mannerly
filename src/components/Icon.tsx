import type { CSSProperties, ReactNode } from 'react'

/* ============================================================
   Mannerly icon set.

   A small, hand-built line/solid icon set drawn on a 24×24 grid so the
   app reads as itself, not a tray of stock emoji. Icons inherit
   `currentColor`; callers give them a brand colour (navy / teal / gold /
   coral) or let a coloured tile behind them carry the energy. Country
   flags stay as-is; lesson art stays as content.
   ============================================================ */

export type IconName =
  | 'learn' | 'explore' | 'passport' | 'profile'
  | 'chevron-right' | 'chevron-left' | 'check' | 'plus' | 'lock' | 'gear' | 'trash' | 'logout' | 'login' | 'refresh'
  | 'flame' | 'bolt' | 'star' | 'sprout' | 'leaf' | 'trophy'
  | 'person' | 'people' | 'teacher' | 'student' | 'school'
  | 'check-badge' | 'chat' | 'spark' | 'utensils' | 'pencil' | 'phone' | 'briefcase' | 'plane' | 'globe' | 'house' | 'heart'
  | 'sun' | 'calendar' | 'bell-off' | 'text-size' | 'waves' | 'contrast'
  | 'rocket' | 'book' | 'compass' | 'moon' | 'planet' | 'smile'

const solid = { fill: 'currentColor', stroke: 'none' } as const

const PATHS: Record<IconName, ReactNode> = {
  /* nav */
  learn: (<><path d="M6 21V4" /><path d="M6 4h11l-2.4 3.4L17 11H6z" {...solid} /></>),
  explore: (<><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8z" {...solid} /></>),
  passport: (<><rect x="4" y="3" width="16" height="18" rx="2.5" /><circle cx="12" cy="11" r="2.6" /><path d="M9.5 16.5h5" /></>),
  profile: (<><circle cx="12" cy="8" r="4" /><path d="M4.5 20c0-4 3.5-6 7.5-6s7.5 2 7.5 6" /></>),

  /* chrome */
  'chevron-right': <path d="M9 5l7 7-7 7" />,
  'chevron-left': <path d="M15 5l-7 7 7 7" />,
  check: <path d="M4.5 12.5l4.5 4.5 10.5-11" />,
  plus: <path d="M12 5v14M5 12h14" />,
  lock: (<><rect x="5" y="11" width="14" height="9" rx="2.5" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>),
  gear: (<><circle cx="12" cy="12" r="3.4" /><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" /></>),
  trash: <path d="M4.5 7h15M9 7V4.5h6V7M6.5 7l1 12.5h9L17.5 7" />,
  logout: (<><path d="M14 7V5a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" /><path d="M18 15l3-3-3-3M10 12h11" /></>),
  login: (<><path d="M10 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6a2 2 0 0 1-2-2v-2" /><path d="M6 15l-3-3 3-3M14 12H3" /></>),
  refresh: (<><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 12a8 8 0 0 1-13.7 5.6L4 16" /><path d="M20 4v4h-4M4 20v-4h4" /></>),

  /* gamify */
  flame: <path d="M12 3c1 3 5 4.2 5 9a5 5 0 0 1-10 0c0-2 .8-3.2 2-4.2 0 1.2 1 2.2 2 2.2 0-3.2-1.2-5.4 1-7z" {...solid} />,
  bolt: <path d="M13 2L4 14h6l-1 8 9-12h-6z" {...solid} />,
  star: <path d="M12 3l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.3l6.1-.7z" {...solid} />,
  sprout: (<><path d="M12 21v-8" /><path d="M12 13c-1-3-4-4.2-7-3.2C5 12.8 8 14 12 13z" {...solid} /><path d="M12 12c1-2.8 3.8-3.8 6-2.8C18 12 15 13 12 12z" {...solid} /></>),
  leaf: (<><path d="M5 19c0-8 6-13.5 14.5-13.5C19.5 14 13.5 19.5 5 19z" {...solid} /><path d="M9 15.5c2.2-2.2 4.5-4 6.5-5" stroke="var(--card)" /></>),
  trophy: (<><path d="M8 4h8v4.5a4 4 0 0 1-8 0z" /><path d="M8 6H5.5a2 2 0 0 0 2.2 3.2M16 6h2.5a2 2 0 0 1-2.2 3.2" /><path d="M12 12.5V16M9 20h6M10 20l.4-4h3.2l.4 4" /></>),

  /* account types */
  person: (<><circle cx="12" cy="8" r="4" /><path d="M4.5 20c0-4 3.5-6 7.5-6s7.5 2 7.5 6" /></>),
  people: (<><circle cx="9" cy="8" r="3.2" /><path d="M3 19c0-3.2 3-5.2 6-5.2s6 2 6 5.2" /><circle cx="17.2" cy="8.6" r="2.6" /><path d="M15.6 14c2.9.3 5.4 2.2 5.4 4.8" /></>),
  teacher: (<><path d="M12 7.5C10.5 5.5 6.2 5.7 5.3 9.4c-.8 3.5 1.6 10.6 4.2 10.6.9 0 1.6-.5 2.5-.5s1.6.5 2.5.5c2.6 0 5-7.1 4.2-10.6C17.8 5.7 13.5 5.5 12 7.5z" {...solid} /><path d="M12 7.5c0-2 1-3.2 3-3.4" stroke="var(--card)" /></>),
  student: (<><rect x="6" y="7.5" width="12" height="12.5" rx="3" /><path d="M9 7.5V5.5a3 3 0 0 1 6 0v2M9 12.5h6" /></>),
  school: (<><path d="M4 21V9.5l8-5 8 5V21" /><path d="M9.5 21v-5.5h5V21" /></>),

  /* goals & topics */
  'check-badge': (<><rect x="4" y="4" width="16" height="16" rx="5" /><path d="M8.5 12l2.4 2.4 4.6-5" /></>),
  chat: <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h11A2.5 2.5 0 0 1 20 6.5v6a2.5 2.5 0 0 1-2.5 2.5H9l-5 4v-4z" />,
  spark: <path d="M12 3l1.6 5.7L19 10l-5.4 1.3L12 17l-1.6-5.7L5 10l5.4-1.3z" {...solid} />,
  utensils: <path d="M7 3v6.5a2 2 0 0 0 2 2V21M7 3v5M9.5 3v5M17 3c-1.8 0-2.8 2-2.8 5s1 4 2.8 4v9" />,
  pencil: (<><path d="M4 20l1.2-4.2L16 5l3 3L8.2 18.8z" /><path d="M14 7l3 3" /></>),
  phone: (<><rect x="7" y="3" width="10" height="18" rx="2.6" /><path d="M11 18h2" /></>),
  briefcase: (<><rect x="3" y="7.5" width="18" height="12.5" rx="2.4" /><path d="M8 7.5V5.5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13.5h18" /></>),
  plane: <path d="M2.5 13L21 6l-6.5 15-2.8-6.7z" {...solid} />,
  globe: (<><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>),
  house: <path d="M4 11l8-6 8 6v9a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" />,
  heart: <path d="M12 20.3S3.8 14.6 3.8 8.9A3.6 3.6 0 0 1 12 6.3a3.6 3.6 0 0 1 8.2 2.6c0 5.7-8.2 11.4-8.2 11.4z" {...solid} />,

  /* notify / a11y */
  sun: (<><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2.5M12 19v2.5M2.5 12H5M19 12h2.5M5 5l1.7 1.7M17.3 17.3L19 19M19 5l-1.7 1.7M6.7 17.3L5 19" /></>),
  calendar: (<><rect x="4" y="5" width="16" height="16" rx="2.4" /><path d="M4 9.5h16M8.5 3v4M15.5 3v4" /></>),
  'bell-off': (<><path d="M6.5 8.5a5.5 5.5 0 0 1 8.6-4.6M18 9v4.5l2 2.8H7.5M9.5 20a2.6 2.6 0 0 0 5 0" /><path d="M3.5 3.5l17 17" /></>),
  'text-size': <path d="M3.5 18L8 6l4.5 12M5.4 14h5.2M14.5 18l3-8 3 8M15.7 15h4.6" />,
  waves: <path d="M3 8.5c3-3 6 3 9 0s6-3 9 0M3 15.5c3-3 6 3 9 0s6-3 9 0" />,
  contrast: (<><circle cx="12" cy="12" r="9" /><path d="M12 3v18a9 9 0 0 0 0-18z" {...solid} /></>),

  /* avatar glyphs */
  rocket: (<><path d="M12 3c3 1.5 5 5 5 9l-2.5 2.5h-5L7 12c0-4 2-7.5 5-9z" /><circle cx="12" cy="9.5" r="1.6" {...solid} /><path d="M9.5 15c-1.5.5-2 2-2 4 2 0 3.5-.5 4-2M14.5 15c1.5.5 2 2 2 4-2 0-3.5-.5-4-2" /></>),
  book: (<><path d="M5 4.5h9a3 3 0 0 1 3 3V21H8a3 3 0 0 1-3-3z" /><path d="M8 21a3 3 0 0 1 3-3h6" /></>),
  compass: (<><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5l-2.2 4.8-4.8 2.2 2.2-4.8z" {...solid} /></>),
  moon: <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" {...solid} />,
  planet: (<><circle cx="12" cy="11" r="6" /><path d="M4.5 17.5c-1.2 1.6-1.6 2.9-1 3.5 1 1 4.6-.4 8-3.2s5.6-6.1 4.6-7.1c-.6-.6-2 0-3.6 1" /></>),
  smile: (<><circle cx="12" cy="12" r="9" /><path d="M8.5 14a4 4 0 0 0 7 0" /><path d="M9 9.5h.01M15 9.5h.01" /></>),
}

interface IconProps {
  name: IconName
  size?: number
  /** stroke/fill colour; defaults to currentColor so a parent's colour wins */
  color?: string
  strokeWidth?: number
  className?: string
  style?: CSSProperties
  title?: string
}

export default function Icon({ name, size = 24, color, strokeWidth = 2, className, style, title }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ color, flex: 'none', ...style }}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {title && <title>{title}</title>}
      {PATHS[name]}
    </svg>
  )
}
