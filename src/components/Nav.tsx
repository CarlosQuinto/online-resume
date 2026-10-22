import { Link } from 'react-router-dom'
import type { Theme } from '../hooks/useTheme'

/** Barra superior mínima: solo el cambio de tema y el acceso al admin. */
export default function Nav({ theme, onToggleTheme }: { theme: Theme; onToggleTheme: () => void }) {
  return (
    <header className="bg-bg">
      <nav className="container-narrow flex h-12 items-center justify-end gap-3" aria-label="Utilidades">
        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          className="grid h-9 w-9 place-items-center rounded-full border border-border text-fg-muted transition-colors hover:text-accent"
        >
          {theme === 'dark' ? '☀' : '☾'}
        </button>
        <Link to="/admin" className="text-xs text-fg-subtle hover:text-accent" aria-label="Panel de administración">
          Admin
        </Link>
      </nav>
    </header>
  )
}
