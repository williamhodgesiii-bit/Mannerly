import type { CapacitorConfig } from '@capacitor/cli'

/**
 * Capacitor wraps the built web app (dist/) into native iOS + Android shells,
 * so the same codebase ships to the Apple App Store, Google Play, and the web.
 *
 * One-time native setup (run locally, needs Xcode / Android Studio):
 *   npm run build
 *   npm run cap:ios       # adds + opens the iOS project
 *   npm run cap:android   # adds + opens the Android project
 */
const config: CapacitorConfig = {
  appId: 'com.mannerly.app',
  appName: 'Mannerly',
  webDir: 'dist',
  backgroundColor: '#F4F7FC',
  ios: {
    contentInset: 'always',
  },
  android: {
    backgroundColor: '#F4F7FC',
  },
}

export default config
