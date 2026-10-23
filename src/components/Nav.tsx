import { Link } from 'react-router-dom'
import type { Theme } from '../hooks/useTheme'
import { useLang } from '../i18n/lang'
import { LANGS } from '../i18n/ui'

/** Barra superior: nombre del sitio a la izquierda; idioma, tema y acceso al admin a la derecha. */
export default function Nav({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  const { lang, setLang, t } = useLang()
  return (
    <header className="bg-bg">
      <nav className="container-wide flex h-16 items-center justify-between gap-3" aria-label={t.utilities}>
        <a
          href="/"
          onClick={(e) => {
            // Sube al inicio sin recargar ni cambiar de pestaña.
            e.preventDefault()
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="min-w-0 truncate text-base font-extrabold tracking-tight transition-opacity hover:opacity-80 sm:text-lg"
        >
          Awesome <span className="text-accent">Resume</span>
        </a>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
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
          <Link to="/admin" className="hidden text-xs text-fg-subtle hover:text-accent sm:inline" aria-label={t.adminLabel}>
            Admin
          </Link>
        </div>
      </nav>
    </header>
  )
}
