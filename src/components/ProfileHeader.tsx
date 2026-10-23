import { motion } from 'framer-motion'
import { useState } from 'react'
import type { Profile } from '../data/schema'
import Avatar from './Avatar'
import { useLang } from '../i18n/lang'

/** Cabecera de perfil al estilo Dribbble: avatar a la izquierda, nombre, ubicación, línea de skills y acciones. */
export default function ProfileHeader({ profile, onDownloadCv }: { profile: Profile; onDownloadCv?: () => Promise<void> }) {
  const { t } = useLang()
  const [cvState, setCvState] = useState<'idle' | 'busy' | 'error'>('idle')
  const downloadCv = async () => {
    if (!onDownloadCv || cvState === 'busy') return
    setCvState('busy')
    try {
      await onDownloadCv()
      setCvState('idle')
    } catch (err) {
      console.error(err)
      setCvState('error')
      setTimeout(() => setCvState('idle'), 4000)
    }
  }
  const email = profile.links.find((l) => l.url.startsWith('mailto:'))
  // WhatsApp (desde el teléfono del perfil) ocupa el lugar de GitHub; GitHub sigue en Contacto y en el pie.
  const digits = profile.phone?.replace(/\D/g, '')
  const social = [
    ...(digits ? [{ label: 'WhatsApp', url: `https://wa.me/${digits}` }] : []),
    ...profile.links.filter((l) => !l.url.startsWith('mailto:') && !/github/i.test(l.label + l.url)),
  ]

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
            {onDownloadCv && (
              <button
                type="button"
                onClick={downloadCv}
                disabled={cvState === 'busy'}
                className="btn-outline gap-2 px-5 py-2.5 text-sm hover:bg-accent-soft disabled:opacity-60"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M12 15V3" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                </svg>
                {cvState === 'busy' ? t.pdf.generating : cvState === 'error' ? t.pdf.error : t.pdf.download}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
