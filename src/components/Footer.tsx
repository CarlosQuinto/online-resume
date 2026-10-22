import type { Profile } from '../data/schema'

export default function Footer({ profile, updatedAt }: { profile: Profile; updatedAt: string }) {
  const email = profile.links.find((l) => l.url.startsWith('mailto:'))
  return (
    <footer id="contacto" className="bg-band text-band-fg">
      {/* Banda CTA */}
      <div className="container-narrow flex flex-col items-center gap-5 py-14 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">¿Construimos algo con calidad?</h2>
          <p className="mt-2 text-band-fg-muted">Automatización, SDET, IA aplicada a QA… o una partida de ajedrez.</p>
        </div>
        {email && (
          <a href={email.url} className="inline-flex shrink-0 items-center rounded-full bg-bg px-6 py-3 font-semibold text-accent transition-transform hover:scale-[1.03]">
            Escríbeme
          </a>
        )}
      </div>
      {/* Pie */}
      <div className="border-t border-white/15">
        <div className="container-narrow flex flex-col items-center gap-4 py-8 text-center">
          <ul className="flex flex-wrap justify-center gap-5">
            {profile.links.map((l) => (
              <li key={l.label}>
                <a
                  href={l.url}
                  target={l.url.startsWith('http') ? '_blank' : undefined}
                  rel="noreferrer"
                  className="text-sm font-medium text-band-fg-muted transition-colors hover:text-band-fg"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-mono text-xs text-band-fg-muted/80">
            © {new Date().getFullYear()} {profile.name} · actualizado {updatedAt}
          </p>
        </div>
      </div>
    </footer>
  )
}
