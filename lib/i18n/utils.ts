import type { Language } from "./translations"

/**
 * Map language code to locale string for date/time formatting
 */
export function getLocaleFromLanguage(language: Language): string {
  const localeMap: Record<Language, string> = {
    "pl": "pl-PL",
    "en": "en-US",
  }
  
  return localeMap[language] || "en-US"
}

