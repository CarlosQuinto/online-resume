import { DEFAULT_COVER, type Cover } from '../data/schema'

/** Foto de perfil circular con encuadre (foco + zoom) o iniciales sobre el acento. */
export default function Avatar({
  url,
  cover,
  name,
  className = 'h-28 w-28 text-3xl',
}: {
  url?: string
  cover?: Cover
  name: string
  className?: string
}) {
  const c = cover ?? DEFAULT_COVER
  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
  return (
    <div className={`relative shrink-0 overflow-hidden rounded-full bg-accent shadow-card ${className}`}>
      {url ? (
        <img
          src={url}
          alt={name}
          draggable={false}
          className="h-full w-full select-none object-cover"
          style={{ objectPosition: `${c.x}% ${c.y}%`, transform: `scale(${c.scale})`, transformOrigin: `${c.x}% ${c.y}%` }}
        />
      ) : (
        <div className="grid h-full w-full place-items-center font-extrabold text-on-accent">{initials}</div>
      )}
    </div>
  )
}
