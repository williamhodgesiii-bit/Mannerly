/**
 * Lightweight haptics. Uses the Vibration API where available (Android /
 * Chrome). On iOS Safari it's a silent no-op; when wrapped with Capacitor,
 * swap this for @capacitor/haptics for real Taptic feedback.
 */
type Pattern = 'tap' | 'success' | 'error' | 'select'

const patterns: Record<Pattern, number | number[]> = {
  tap: 8,
  select: 12,
  success: [10, 40, 20],
  error: [30, 30, 30],
}

export function haptic(kind: Pattern = 'tap') {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(patterns[kind])
    }
  } catch {
    /* ignore */
  }
}
