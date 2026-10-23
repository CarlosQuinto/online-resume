import { Link } from 'react-router-dom'
import type { Profile } from '../data/schema'
import { useLang } from '../i18n/lang'

/** Pie discreto: enlaces y crédito. La llamada a la acción vive en la pestaña Contacto. */
export default function Footer({ profile, updatedAt }: { profile: Profile; updatedAt: string }) {
  const { t } = useLang()
  return (
    <footer className="border-t border-border bg-surface-2">
      <div className="container-wide flex flex-col items-center gap-3 py-8 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-mono text-xs text-fg-subtle">
          © {new Date().getFullYear()} {profile.name} · {t.updated} {updatedAt}
        </p>
        <ul className="flex flex-wrap justify-center gap-5">
          {profile.links.map((l) => (
            <li key={l.label}>
              <a
                href={l.url}
                target={l.url.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="text-sm font-medium text-fg-muted transition-colors hover:text-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
          {/* En móvil el acceso al admin sale de la barra superior y vive aquí. */}
          <li className="sm:hidden">
            <Link to="/admin" className="text-sm font-medium text-fg-subtle transition-colors hover:text-accent" aria-label={t.adminLabel}>
              Admin
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
