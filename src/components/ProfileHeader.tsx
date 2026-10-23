import { motion } from 'framer-motion'
import type { Profile } from '../data/schema'
import Avatar from './Avatar'
import { useLang } from '../i18n/lang'

/** Cabecera de perfil al estilo Dribbble: avatar a la izquierda, nombre, ubicación, línea de skills y acciones. */
export default function ProfileHeader({ profile }: { profile: Profile }) {
  const { t } = useLang()
  const email = profile.links.find((l) => l.url.startsWith('mailto:'))
  const social = profile.links.filter((l) => !l.url.startsWith('mailto:'))

  return (
    <section id="top" className="bg-bg pt-12 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="container-narrow flex flex-col items-center gap-8 text-center sm:flex-row sm:items-start sm:justify-center sm:text-left"
      >
        <Avatar url={profile.avatarUrl} cover={profile.avatarCover} name={profile.name} />
        <div className="min-w-0 max-w-2xl">
          <h1 className="text-3xl font-extrabold tracking-tight">{profile.name}</h1>
          <p className="mt-1 text-fg-subtle">{profile.location}</p>
          <p className="mt-2 text-lg text-fg-muted">{profile.headline}</p>
          <p className="mt-1 max-w-2xl text-fg-muted">{profile.tagline}</p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {email && (
              <a href={email.url} className="btn-primary hover:scale-[1.02]">
                {t.emailMe}
              </a>
            )}
            {social.map((l) => (
              <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="btn-outline hover:bg-accent-soft">
                {l.label}
              </a>
            ))}
            <span className="ml-1 inline-flex items-center gap-2 text-sm text-fg-subtle">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              {profile.availability}
            </span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
