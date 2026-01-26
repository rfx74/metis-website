'use client'

export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('metis-open-consent'))
        }
      }}
      className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg hover:brightness-110 transition-all"
    >
      Apri preferenze cookie
    </button>
  )
}
