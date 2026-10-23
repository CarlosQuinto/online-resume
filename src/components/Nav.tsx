import { Link } from 'react-router-dom'
import type { Theme } from '../hooks/useTheme'
import { useLang } from '../i18n/lang'
import { LANGS } from '../i18n/ui'

/** Barra superior mínima: idioma, cambio de tema y acceso al admin. */
export default function Nav({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const { lang, setLang, t } = useLang()
  return (
    <header className="bg-bg">
      <nav className="container-wide flex h-12 items-center justify-end gap-3" aria-label={t.utilities}>
        <div role="group" aria-label={t.langLabel} className="flex rounded-full border border-border p-0.5 text-xs font-semibold">
          {LANGS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`rounded-full px-2.5 py-1 uppercase transition-colors ${lang === l ? 'bg-surface-2 text-fg' : 'text-fg-subtle hover:text-fg'}`}
            >
              {l}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? t.toLight : t.toDark}
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-fg-muted transition-colors hover:text-accent"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <Link to="/admin" className="text-xs text-fg-subtle hover:text-accent" aria-label={t.adminLabel}>
          Admin
        </Link>
      </nav>
    </header>
  )
}
