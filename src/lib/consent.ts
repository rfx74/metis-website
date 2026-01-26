export type ConsentPreferences = {
  necessary: boolean
  analytics: boolean
}

const STORAGE_KEY = 'metis-cookie-consent'
export const CONSENT_EVENT = 'metis-consent-changed'
export const OPEN_CONSENT_EVENT = 'metis-open-consent'

export function loadConsent(): ConsentPreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && 'preferences' in parsed) {
      return parsed.preferences as ConsentPreferences
    }
    return parsed as ConsentPreferences
  } catch (err) {
    return null
  }
}

export function saveConsent(preferences: ConsentPreferences) {
  if (typeof window === 'undefined') return
  const payload = {
    preferences,
    updatedAt: new Date().toISOString(),
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function notifyConsent(preferences: ConsentPreferences) {
  if (typeof window === 'undefined') return
  const event = new CustomEvent(CONSENT_EVENT, { detail: preferences })
  window.dispatchEvent(event)
}

export function subscribeToConsent(callback: (prefs: ConsentPreferences) => void) {
  if (typeof window === 'undefined') return () => {}
  const handler = (event: Event) => {
    const custom = event as CustomEvent<ConsentPreferences>
    callback(custom.detail)
  }
  window.addEventListener(CONSENT_EVENT, handler)
  return () => window.removeEventListener(CONSENT_EVENT, handler)
}
