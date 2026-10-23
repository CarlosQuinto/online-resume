import { DEFAULT_COVER, type Cover } from '../data/schema'

/** Foto circular con encuadre (foco + zoom) o iniciales sobre el acento (o menta, en recomendaciones). */
export default function Avatar({
  url,
  cover,
  name,
  className = 'h-28 w-28 text-3xl',
  tone = 'accent',
}: {
  url?: string
  cover?: Cover
  name: string
  className?: string
  tone?: 'accent' | 'mint'
}) {
  const c = cover ?? DEFAULT_COVER
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full shadow-card ${tone === 'mint' ? 'bg-mint' : 'bg-accent'} ${className}`}>
      {url ? (
        <img
          src={url}
          alt={name}
          draggable={false}
          className="h-full w-full select-none object-cover"
          style={{ objectPosition: `${c.x}% ${c.y}%`, transform: `scale(${c.scale})`, transformOrigin: `${c.x}% ${c.y}%` }}
        />
      ) : (
        <div className={`grid h-full w-full place-items-center font-extrabold ${tone === 'mint' ? 'text-accent-ink' : 'text-on-accent'}`}>{initials}</div>
      )}
    </div>
  )
}
