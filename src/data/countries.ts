import type { Country, Region } from '@/types'

export const COUNTRIES: Record<string, Country> = {
  US: {
    code: 'US', name: 'United States', flag: '🇺🇸', region: 'north-america',
    hello: 'Hi!', blurb: 'Friendly and casual.', courseId: 'us', theme: '#2B4FB8',
  },
  GB: {
    code: 'GB', name: 'United Kingdom', flag: '🇬🇧', region: 'europe',
    hello: 'Hello', blurb: 'Queues and please & thanks.', courseId: 'gb', theme: '#1F3A93',
  },
  MX: {
    code: 'MX', name: 'Mexico', flag: '🇲🇽', region: 'latin-america',
    hello: '¡Hola!', blurb: 'Warm and friendly.', courseId: 'mx', theme: '#1E8A4C',
  },
  BR: {
    code: 'BR', name: 'Brazil', flag: '🇧🇷', region: 'latin-america',
    hello: 'Oi!', blurb: 'Warm and relaxed.', courseId: 'br', theme: '#159A57',
  },
  JP: {
    code: 'JP', name: 'Japan', flag: '🇯🇵', region: 'east-asia',
    hello: 'こんにちは', blurb: 'Calm and respectful.', courseId: 'jp', theme: '#E24B3B',
  },
  KR: {
    code: 'KR', name: 'South Korea', flag: '🇰🇷', region: 'east-asia',
    hello: '안녕하세요', blurb: 'Respect for elders.', courseId: 'kr', theme: '#294C9E',
  },
  IN: {
    code: 'IN', name: 'India', flag: '🇮🇳', region: 'south-asia',
    hello: 'नमस्ते', blurb: 'Namaste and right hand.', courseId: 'in', theme: '#E38A1E',
  },
  AE: {
    code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', region: 'mena',
    hello: 'مرحبا', blurb: 'Modest and welcoming.', courseId: 'ae', theme: '#1E6E4E',
  },
}

export const REGIONS: Region[] = [
  { id: 'north-america', name: 'North America', emoji: '🌎', countries: ['US'] },
  { id: 'latin-america', name: 'Latin America', emoji: '🌴', countries: ['MX', 'BR'] },
  { id: 'europe', name: 'Europe', emoji: '🏰', countries: ['GB'] },
  { id: 'mena', name: 'Middle East', emoji: '🕌', countries: ['AE'] },
  { id: 'east-asia', name: 'East Asia', emoji: '🏮', countries: ['JP', 'KR'] },
  { id: 'south-asia', name: 'South Asia', emoji: '🪷', countries: ['IN'] },
  { id: 'southeast-asia', name: 'Southeast Asia', emoji: '🌺', countries: [] },
  { id: 'sub-saharan', name: 'Africa', emoji: '🦁', countries: [] },
  { id: 'oceania', name: 'Oceania', emoji: '🏄', countries: [] },
]

export const countryList = (): Country[] => Object.values(COUNTRIES)
export const countryByCourse = (courseId: string): Country | undefined =>
  Object.values(COUNTRIES).find((c) => c.courseId === courseId)
