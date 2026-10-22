import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Theme } from '../hooks/useTheme'

const items = [
  { href: '#experiencia', label: 'Experiencia' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#que-hago', label: 'Qué hago' },
  { href: '#sobre-mi', label: 'Sobre mí' },
]

export default function Nav({ name, theme, onToggleTheme }: { name: string; theme: Theme; onToggleTheme: () => void }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const initials = name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-300 ${
        scrolled ? 'bg-bg/90 backdrop-blur shadow-[0_1px_0_var(--color-border)]' : 'bg-bg'
      }`}
    >
      <nav className="container-narrow flex h-16 items-center justify-between" aria-label="Principal">
        <a href="#top" className="flex items-center gap-2.5 font-semibold">
          <span className="grid h-9 w-9 place-items-center rounded-xl border-2 border-accent font-mono text-sm font-bold text-accent">
            {initials}
          </span>
          <span className="hidden sm:inline">{name}</span>
        </a>
        <ul className="hidden items-center gap-6 md:flex">
          {items.map((it) => (
            <li key={it.href}>
              <a href={it.href} className="text-sm font-medium text-fg-muted transition-colors hover:text-accent">
                {it.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="grid h-9 w-9 place-items-center rounded-full border border-border text-fg-muted transition-colors hover:text-accent"
          >
            {theme === 'dark' ? '☀' : '☾'}
          </button>
          <a href="#contacto" className="btn-outline hidden px-4 py-1.5 text-sm sm:inline-flex">
            Contacto
          </a>
          <Link to="/admin" className="text-xs text-fg-subtle hover:text-accent" aria-label="Panel de administración">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  )
}
