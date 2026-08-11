import { motion } from 'framer-motion'
import Header from '@/components/Header'
import Icon from '@/components/Icon'
import { countryList } from '@/data/countries'
import { useProgress } from '@/state/store'

export default function Passport() {
  const stamped = useProgress((s) => s.stampedCountries())
  const countries = countryList()
  const got = new Set(stamped)

  return (
    <div className="screen has-tabbar">
      <Header title="Passport" />
      <div className="screen--padded" style={{ paddingTop: 14 }}>
        <div className="card" style={{ padding: 16, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div className="level-badge level-badge--teal" style={{ width: 48, height: 48, borderRadius: 15 }}><Icon name="passport" size={26} color="#fff" /></div>
          <div className="grow">
            <div style={{ fontWeight: 900, fontSize: 17 }}>Manners Passport</div>
            <div className="subtitle">Earn a stamp for every country you learn.</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 900, fontSize: 22, color: 'var(--teal-500)' }}>{got.size}</div>
            <div className="kicker">of {countries.length}</div>
          </div>
        </div>

        <div className="passport-grid">
          {countries.map((c, i) => {
            const has = got.has(c.code)
            return (
              <motion.div
                key={c.code}
                className={`stamp ${has ? 'stamp--got' : ''}`}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: 'spring', stiffness: 240, damping: 18 }}
              >
                {has && (
                  <motion.span className="stamp__seal" initial={{ scale: 0, rotate: -40 }} animate={{ scale: 1, rotate: 8 }} transition={{ type: 'spring', stiffness: 260, damping: 12, delay: 0.1 + i * 0.04 }}>
                    ✓
                  </motion.span>
                )}
                <span className="stamp-flag">{c.flag}</span>
                <span className="stamp-name">{c.name}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
