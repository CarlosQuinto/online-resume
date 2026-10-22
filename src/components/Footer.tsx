import type { Profile } from '../data/schema'

export default function Footer({ profile, updatedAt }: { profile: Profile; updatedAt: string }) {
  const email = profile.links.find((l) => l.url.startsWith('mailto:'))
  return (
    <footer id="contacto" className="border-t border-border py-macro">
      <div className="container-narrow grid gap-10 md:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="eyebrow mb-3">Contacto</p>
          <h2 className="text-2xl font-bold tracking-tight">¿Construimos algo con calidad?</h2>
          <p className="mt-4 max-w-xl text-lg text-fg-muted">
            Abierto a conversaciones sobre automatización, SDET, IA aplicada a QA o una partida de ajedrez.
          </p>
          {email && (
            <a
              href={email.url}
              className="mt-8 inline-flex rounded-full bg-accent px-6 py-3 font-semibold text-accent-ink transition-transform hover:scale-[1.03]"
            >
              Escríbeme
            </a>
          )}
        </div>
        <div className="md:text-right">
          <ul className="flex flex-wrap gap-4 md:justify-end">
            {profile.links.map((l) => (
              <li key={l.label}>
                <a href={l.url} target={l.url.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="text-fg-muted hover:text-accent">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-10 font-mono text-sm text-fg-subtle">
            © {new Date().getFullYear()} {profile.name} · actualizado {updatedAt}
          </p>
        </div>
      </div>
    </footer>
  )
}
