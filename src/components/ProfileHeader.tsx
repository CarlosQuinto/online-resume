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
        className="container-narrow flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:justify-center sm:text-left"
      >
        <Avatar url={profile.avatarUrl} cover={profile.avatarCover} name={profile.name} className="h-20 w-20 text-2xl" />
        <div className="min-w-0 max-w-2xl">
          <h1 className="text-[2rem] leading-tight font-bold tracking-tight">{profile.name}</h1>
          <p className="mt-1 text-sm text-fg-subtle">{profile.location}</p>
          <p className="mt-2 text-fg-muted">{profile.headline}</p>
          <p className="mt-1 max-w-xl text-sm text-fg-muted">{profile.tagline}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            {email && (
              <a href={email.url} className="btn-primary px-5 py-2.5 text-sm hover:scale-[1.02]">
                {t.emailMe}
              </a>
            )}
            {social.map((l) => (
              <a key={l.label} href={l.url} target="_blank" rel="noreferrer" className="btn-outline px-5 py-2.5 text-sm hover:bg-accent-soft">
                {l.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
