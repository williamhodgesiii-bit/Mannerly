import type { Language, LanguageCode } from '@/types'

/**
 * Languages Mannerly can speak. Shown by their own name, with a short
 * greeting the learner can tap to hear. Interface language is separate
 * from home region on purpose — you can live in the US and speak Spanish.
 */
export const LANGUAGES: Language[] = [
  { code: 'en', name: 'English', native: 'English', sample: 'Hello!' },
  { code: 'es', name: 'Spanish', native: 'Español', sample: '¡Hola!' },
  { code: 'pt', name: 'Portuguese', native: 'Português', sample: 'Olá!' },
  { code: 'ja', name: 'Japanese', native: '日本語', sample: 'こんにちは' },
  { code: 'ko', name: 'Korean', native: '한국어', sample: '안녕하세요' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी', sample: 'नमस्ते' },
  { code: 'ar', name: 'Arabic', native: 'العربية', sample: 'مرحبا', rtl: true },
]

export const LANGUAGE_MAP: Record<LanguageCode, Language> = Object.fromEntries(
  LANGUAGES.map((l) => [l.code, l]),
) as Record<LanguageCode, Language>
