#!/usr/bin/env node
/*
 * Seed Mannerly's dev / sample accounts into Supabase — the reliable way.
 *
 * Uses the Supabase Admin API (service_role), so it can't break on the
 * fragile internals that raw SQL inserts into auth.users hit. Idempotent:
 * re-running updates the accounts instead of erroring.
 *
 * Run from the project root:
 *
 *   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key node scripts/seed-users.mjs
 *
 * The project URL is read from .env (VITE_SUPABASE_URL); or pass SUPABASE_URL.
 * The service_role key is a SECRET — never commit it. This script only reads
 * it from the environment, never from a file it could accidentally include.
 *
 * All four accounts share the password:  Mannerly-Dev-2026
 */
import { readFileSync } from 'node:fs'
import { createClient } from '@supabase/supabase-js'

const PASSWORD = 'Mannerly-Dev-2026'

const ACCOUNTS = [
  { email: 'solo@mannerly.app', name: 'Alex Rivera', role: 'learner', type: 'individual' },
  { email: 'family@mannerly.app', name: 'Jordan Lee', role: 'parent', type: 'family' },
  { email: 'teacher@mannerly.app', name: 'Ms. Carter', role: 'teacher', type: 'teacher' },
  { email: 'student@mannerly.app', name: 'Sam', role: 'student', type: 'student' },
]

function readEnvUrl() {
  if (process.env.SUPABASE_URL) return process.env.SUPABASE_URL.trim()
  if (process.env.VITE_SUPABASE_URL) return process.env.VITE_SUPABASE_URL.trim()
  try {
    const line = readFileSync(new URL('../.env', import.meta.url), 'utf8')
      .split('\n')
      .find((l) => l.startsWith('VITE_SUPABASE_URL='))
    return line ? line.slice('VITE_SUPABASE_URL='.length).trim() : ''
  } catch {
    return ''
  }
}

const url = readEnvUrl()
const serviceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

if (!url || !serviceKey) {
  console.error('Missing config.')
  console.error('  URL:', url ? 'ok' : 'NOT FOUND (set VITE_SUPABASE_URL in .env or SUPABASE_URL)')
  console.error('  SERVICE ROLE KEY:', serviceKey ? 'ok' : 'NOT SET (export SUPABASE_SERVICE_ROLE_KEY=...)')
  console.error('\nExample:\n  SUPABASE_SERVICE_ROLE_KEY=eyJ... node scripts/seed-users.mjs')
  process.exit(1)
}

const admin = createClient(url, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } })

// Map existing users by email (paginated).
async function existingByEmail() {
  const map = new Map()
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 })
    if (error) throw error
    for (const u of data.users) map.set((u.email || '').toLowerCase(), u)
    if (data.users.length < 200) break
  }
  return map
}

async function main() {
  console.log('Seeding dev accounts into', url, '\n')
  const existing = await existingByEmail()
  let ok = 0

  for (const a of ACCOUNTS) {
    const meta = { display_name: a.name, role: a.role, account_type: a.type, onboarded: true }
    const found = existing.get(a.email)
    let userId

    if (found) {
      const { error } = await admin.auth.admin.updateUserById(found.id, {
        password: PASSWORD, email_confirm: true, user_metadata: meta,
      })
      if (error) { console.error('  ✗ update', a.email, '-', error.message); continue }
      userId = found.id
      console.log('  ↻ updated', a.email, `(${a.type})`)
    } else {
      const { data, error } = await admin.auth.admin.createUser({
        email: a.email, password: PASSWORD, email_confirm: true, user_metadata: meta,
      })
      if (error) { console.error('  ✗ create', a.email, '-', error.message); continue }
      userId = data.user.id
      console.log('  ✓ created', a.email, `(${a.type})`)
    }

    // Make sure the profile row matches (service_role bypasses RLS).
    const { error: pErr } = await admin
      .from('profiles')
      .upsert({ id: userId, display_name: a.name, role: a.role, account_type: a.type, onboarded: true })
    if (pErr) console.error('    (profile upsert warning:', pErr.message + ')')
    ok++
  }

  console.log(`\nDone — ${ok}/${ACCOUNTS.length} accounts ready. Password: ${PASSWORD}`)
  if (ok < ACCOUNTS.length) process.exit(1)
}

main().catch((e) => { console.error('Seed failed:', e.message); process.exit(1) })
