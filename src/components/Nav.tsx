import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const items = [
  { href: '#experiencia', label: 'Experiencia' },
  { href: '#skills', label: 'Skills' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#sobre-mi', label: 'Sobre mí' },
  { href: '#contacto', label: 'Contacto' },
]

export default function Nav({ name }: { name: string }) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
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
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur border-b border-border' : 'bg-transparent'
      }`}
    >
      <nav className="container-narrow flex h-16 items-center justify-between" aria-label="Principal">
        <a href="#top" className="flex items-center gap-3 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-accent-ink font-mono text-sm font-bold">
            {initials}
          </span>
          <span className="hidden sm:inline">{name}</span>
        </a>
        <ul className="hidden items-center gap-6 md:flex">
          {items.map((it) => (
            <li key={it.href}>
              <a href={it.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
                {it.label}
              </a>
            </li>
          ))}
        </ul>
        <Link
          to="/admin"
          className="rounded-full border border-border px-3 py-1.5 text-sm text-fg-muted transition-colors hover:border-accent hover:text-accent"
          aria-label="Panel de administración"
        >
          Admin
        </Link>
      </nav>
    </header>
  )
}
