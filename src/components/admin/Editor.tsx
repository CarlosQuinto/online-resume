import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { PortfolioData } from '../../data/schema'
import { seed } from '../../data/seed'
import { savePortfolio } from '../../lib/content'
import { lock, setPin } from '../../lib/admin'
import { firebaseEnabled } from '../../lib/firebase'
import { DOC_LIMIT, docBytes, formatKB } from '../../lib/image'
import { ListEditor, Select, Tags, Text, Toggle, uid } from './fields'
import CoverCropper from './CoverCropper'
import AvatarEditor from './AvatarEditor'
import TranslationEditor from './TranslationEditor'
import { materialize, translationRows } from '../../i18n/content'

type Tab =
  | 'perfil'
  | 'experiencia'
  | 'educacion'
  | 'certificaciones'
  | 'pilares'
  | 'skills'
  | 'proyectos'
  | 'recomendaciones'
  | 'hobbies'
  | 'mascotas'
  | 'ingles'
  | 'json'
  | 'ajustes'
const tabs: { id: Tab; label: string }[] = [
  { id: 'perfil', label: 'Perfil' },
  { id: 'experiencia', label: 'Experiencia' },
  { id: 'educacion', label: 'Educación' },
  { id: 'certificaciones', label: 'Certificaciones' },
  { id: 'pilares', label: 'Pilares' },
  { id: 'skills', label: 'Skills' },
  { id: 'proyectos', label: 'Proyectos' },
  { id: 'recomendaciones', label: 'Recomendaciones' },
  { id: 'hobbies', label: 'Hobbies' },
  { id: 'mascotas', label: 'Mascotas' },
  { id: 'ingles', label: 'Inglés' },
  { id: 'json', label: 'JSON' },
  { id: 'ajustes', label: 'Ajustes' },
]

export default function Editor({ initial, onLock }: { initial: PortfolioData; onLock: () => void }) {
  const [data, setData] = useState<PortfolioData>(() => materialize(initial))
  const [tab, setTab] = useState<Tab>('perfil')
  const [dirty, setDirty] = useState(false)
  const [status, setStatus] = useState<string | null>(null)
  const [json, setJson] = useState('')
  const untranslated = translationRows(data).filter((r) => r.status !== 'ok').length
  // Todo (incluidas las imágenes subidas) vive en un documento de Firestore de máx. 1 MB.
  const size = docBytes(data)
  const usage = size / DOC_LIMIT

  useEffect(() => {
    if (!dirty) setData(materialize(initial))
  }, [initial, dirty])

  const patch = (p: Partial<PortfolioData>) => {
    setData((d) => ({ ...d, ...p }))
    setDirty(true)
  }

  async function publish() {
    if (size > DOC_LIMIT) {
      setStatus(`No cabe: ${formatKB(size)} de 1 MB. Quita o reemplaza alguna imagen subida.`)
      return
    }
    setStatus('Guardando…')
    try {
      await savePortfolio(data)
      setDirty(false)
      setStatus('Publicado ✓')
    } catch (e) {
      setStatus(`Error: ${(e as Error).message}`)
    }
    setTimeout(() => setStatus(null), 3000)
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-border bg-bg/85 backdrop-blur">
        <div className="container-narrow flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-sm text-fg-muted hover:text-fg">
              ← Sitio
            </Link>
            <span className="font-semibold">Editor</span>
            <span className="pill">{firebaseEnabled ? 'Firestore' : 'Local'}</span>
          </div>
          <div className="flex items-center gap-3">
            {status && <span className="text-sm text-fg-muted">{status}</span>}
            <span
              title="Espacio usado del documento de Firestore (límite 1 MB). Las imágenes subidas desde tu equipo cuentan aquí."
              className={`pill font-mono ${usage > 0.95 ? 'border-danger/50 text-danger' : usage > 0.8 ? 'border-amber/60 text-amber' : ''}`}
            >
              {formatKB(size)} / 1 MB
            </span>
            <button
              onClick={publish}
              disabled={!dirty}
              className="rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-ink disabled:opacity-40"
            >
              Publicar
            </button>
            <button
              onClick={() => {
                lock()
                onLock()
              }}
              className="rounded-full border border-border px-4 py-2 text-sm text-fg-muted hover:text-fg"
            >
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="container-narrow grid gap-8 py-10 md:grid-cols-[12rem_1fr]">
        <nav className="flex gap-2 overflow-x-auto md:flex-col" aria-label="Secciones">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`shrink-0 rounded-lg px-3 py-2 text-left text-sm ${
                tab === t.id ? 'bg-surface-2 text-fg' : 'text-fg-muted hover:text-fg'
              }`}
            >
              {t.label}
              {t.id === 'ingles' && untranslated > 0 && (
                <span className="ml-2 rounded-full bg-amber/15 px-1.5 py-0.5 text-xs font-semibold text-amber">{untranslated}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="max-w-3xl">
          {tab === 'perfil' && (
            <div className="grid gap-4">
              <AvatarEditor
                title="Foto de perfil"
                url={data.profile.avatarUrl}
                cover={data.profile.avatarCover}
                name={data.profile.name}
                onChange={({ url, cover }) =>
                  patch({ profile: { ...data.profile, ...(url !== undefined && { avatarUrl: url }), ...(cover && { avatarCover: cover }) } })
                }
              />
              <Text label="Nombre" value={data.profile.name} onChange={(v) => patch({ profile: { ...data.profile, name: v } })} />
              <Text label="Titular" value={data.profile.headline} onChange={(v) => patch({ profile: { ...data.profile, headline: v } })} />
              <Text label="Tagline" value={data.profile.tagline} onChange={(v) => patch({ profile: { ...data.profile, tagline: v } })} multiline />
              <Text label="Resumen (Sobre mí)" value={data.profile.summary} onChange={(v) => patch({ profile: { ...data.profile, summary: v } })} multiline />
              <Text label="Ubicación" value={data.profile.location} onChange={(v) => patch({ profile: { ...data.profile, location: v } })} />
              <Text label="Disponibilidad" value={data.profile.availability} onChange={(v) => patch({ profile: { ...data.profile, availability: v } })} />
              <p className="field-label mt-4">Enlaces</p>
              <ListEditor
                items={data.profile.links.map((l, i) => ({ ...l, id: `link-${i}` }))}
                onChange={(links) => patch({ profile: { ...data.profile, links: links.map(({ label, url }) => ({ label, url })) } })}
                create={() => ({ id: uid('link'), label: 'Nuevo', url: 'https://' })}
                title={(l) => l.label}
                render={(l, up) => (
                  <>
                    <Text label="Etiqueta" value={l.label} onChange={(v) => up({ label: v })} />
                    <Text label="URL" value={l.url} onChange={(v) => up({ url: v })} />
                  </>
                )}
              />
            </div>
          )}

          {tab === 'experiencia' && (
            <ListEditor
              items={data.experience}
              onChange={(experience) => patch({ experience })}
              create={() => ({ id: uid('exp'), company: '', role: '', start: '', end: null, location: '', summary: '', highlights: [], stack: [], coverUrl: '', cover: { x: 50, y: 50, scale: 1 }, color: '#115E59' })}
              title={(e) => `${e.role} · ${e.company}`}
              render={(e, up) => (
                <>
                  <Text label="Puesto" value={e.role} onChange={(v) => up({ role: v })} />
                  <Text label="Empresa" value={e.company} onChange={(v) => up({ company: v })} />
                  <div className="grid grid-cols-2 gap-4">
                    <Text label="Inicio (YYYY-MM)" value={e.start} onChange={(v) => up({ start: v })} />
                    <Text label="Fin (YYYY-MM, vacío = actual)" value={e.end ?? ''} onChange={(v) => up({ end: v || null })} />
                  </div>
                  <Text label="Ubicación" value={e.location} onChange={(v) => up({ location: v })} />
                  <Text label="Resumen" value={e.summary} onChange={(v) => up({ summary: v })} multiline />
                  <Tags label="Logros" value={e.highlights} onChange={(v) => up({ highlights: v })} separator={'\n'} />
                  <Tags label="Stack" value={e.stack} onChange={(v) => up({ stack: v })} />
                  <CoverCropper item={e} label={e.company || 'Empresa'} sublabel={e.role || 'Puesto'} onChange={up} />
                </>
              )}
            />
          )}

          {tab === 'educacion' && (
            <ListEditor
              items={data.education}
              onChange={(education) => patch({ education })}
              create={() => ({ id: uid('edu'), institution: '', degree: '', field: '', start: '', end: null, note: '' })}
              title={(e) => `${e.degree} · ${e.institution}`}
              render={(e, up) => (
                <>
                  <Text label="Institución" value={e.institution} onChange={(v) => up({ institution: v })} />
                  <Text label="Grado" value={e.degree} onChange={(v) => up({ degree: v })} />
                  <Text label="Campo" value={e.field} onChange={(v) => up({ field: v })} />
                  <div className="grid grid-cols-2 gap-4">
                    <Text label="Inicio" value={e.start} onChange={(v) => up({ start: v })} />
                    <Text label="Fin (vacío = en curso)" value={e.end ?? ''} onChange={(v) => up({ end: v || null })} />
                  </div>
                  <Text label="Nota" value={e.note} onChange={(v) => up({ note: v })} multiline />
                </>
              )}
            />
          )}

          {tab === 'certificaciones' && (
            <ListEditor
              items={data.certifications}
              onChange={(certifications) => patch({ certifications })}
              create={() => ({ id: uid('cert'), name: '', issuer: '', date: '', url: '' })}
              title={(c) => c.name}
              render={(c, up) => (
                <>
                  <Text label="Nombre" value={c.name} onChange={(v) => up({ name: v })} />
                  <Text label="Emisor" value={c.issuer} onChange={(v) => up({ issuer: v })} />
                  <Text label="Fecha" value={c.date} onChange={(v) => up({ date: v })} />
                  <Text label="URL de verificación" value={c.url} onChange={(v) => up({ url: v })} />
                </>
              )}
            />
          )}

          {tab === 'pilares' && (
            <ListEditor
              items={data.pillars ?? []}
              onChange={(pillars) => patch({ pillars })}
              create={() => ({ id: uid('pil'), title: '', emoji: '✨', description: '', lists: [{ label: 'Herramientas', items: [] }] })}
              title={(p) => `${p.emoji} ${p.title}`}
              render={(p, up) => (
                <>
                  <div className="grid grid-cols-[5rem_1fr] gap-4">
                    <Text label="Emoji" value={p.emoji} onChange={(v) => up({ emoji: v })} />
                    <Text label="Título" value={p.title} onChange={(v) => up({ title: v })} />
                  </div>
                  <Text label="Descripción" value={p.description} onChange={(v) => up({ description: v })} multiline />
                  {p.lists.map((l, li) => (
                    <div key={li} className="grid gap-2 rounded-lg border border-border p-3">
                      <Text
                        label={`Lista ${li + 1} · etiqueta`}
                        value={l.label}
                        onChange={(v) => up({ lists: p.lists.map((x, j) => (j === li ? { ...x, label: v } : x)) })}
                      />
                      <Tags
                        label="Elementos"
                        value={l.items}
                        onChange={(v) => up({ lists: p.lists.map((x, j) => (j === li ? { ...x, items: v } : x)) })}
                      />
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => up({ lists: [...p.lists, { label: 'Nueva lista', items: [] }] })}
                    className="w-fit text-sm text-accent hover:underline"
                  >
                    + Añadir lista
                  </button>
                </>
              )}
            />
          )}

          {tab === 'skills' && (
            <ListEditor
              items={data.skillGroups}
              onChange={(skillGroups) => patch({ skillGroups })}
              create={() => ({ id: uid('sg'), name: '', skills: [] })}
              title={(g) => g.name}
              render={(g, up) => (
                <>
                  <Text label="Grupo" value={g.name} onChange={(v) => up({ name: v })} />
                  <Tags label="Skills" value={g.skills} onChange={(v) => up({ skills: v })} />
                </>
              )}
            />
          )}

          {tab === 'proyectos' && (
            <ListEditor
              items={data.projects}
              onChange={(projects) => patch({ projects })}
              create={() => ({ id: uid('proj'), title: '', description: '', stack: [], repoUrl: '', liveUrl: '', featured: false, coverUrl: '', cover: { x: 50, y: 50, scale: 1 }, color: '#115E59' })}
              title={(p) => p.title}
              render={(p, up) => (
                <>
                  <Text label="Título" value={p.title} onChange={(v) => up({ title: v })} />
                  <Text label="Descripción" value={p.description} onChange={(v) => up({ description: v })} multiline />
                  <Tags label="Stack" value={p.stack} onChange={(v) => up({ stack: v })} />
                  <Text label="Repositorio" value={p.repoUrl} onChange={(v) => up({ repoUrl: v })} />
                  <Text label="Demo" value={p.liveUrl} onChange={(v) => up({ liveUrl: v })} />
                  <Toggle label="Destacado" value={p.featured} onChange={(v) => up({ featured: v })} />
                  <CoverCropper item={p} label={p.title || 'Proyecto'} onChange={up} />
                </>
              )}
            />
          )}

          {tab === 'recomendaciones' && (
            <ListEditor
              items={data.recommendations ?? []}
              onChange={(recommendations) => patch({ recommendations })}
              create={() => ({ id: uid('rec'), name: '', role: '', url: '', text: '' })}
              title={(r) => r.name}
              render={(r, up) => (
                <>
                  <Text label="Nombre" value={r.name} onChange={(v) => up({ name: v })} />
                  <Text label="Rol / relación" value={r.role} onChange={(v) => up({ role: v })} />
                  <Text label="URL del perfil" value={r.url} onChange={(v) => up({ url: v })} />
                  <AvatarEditor
                    title="Foto"
                    url={r.photoUrl}
                    cover={r.photoCover}
                    name={r.name}
                    tone="mint"
                    maxSide={256}
                    previewClassName="h-28 w-28 text-3xl"
                    emptyHint="Sin foto: se muestran sus iniciales"
                    onChange={({ url, cover }) => up({ ...(url !== undefined && { photoUrl: url }), ...(cover && { photoCover: cover }) })}
                  />
                  <Text label="Texto" value={r.text} onChange={(v) => up({ text: v })} multiline />
                </>
              )}
            />
          )}

          {tab === 'hobbies' && (
            <ListEditor
              items={data.hobbies}
              onChange={(hobbies) => patch({ hobbies })}
              create={() => ({ id: uid('hob'), title: '', emoji: '✨', description: '', detail: '', accent: 'accent' as const })}
              title={(h) => `${h.emoji} ${h.title}`}
              render={(h, up) => (
                <>
                  <div className="grid grid-cols-[5rem_1fr] gap-4">
                    <Text label="Emoji" value={h.emoji} onChange={(v) => up({ emoji: v })} />
                    <Text label="Título" value={h.title} onChange={(v) => up({ title: v })} />
                  </div>
                  <Text label="Descripción corta" value={h.description} onChange={(v) => up({ description: v })} />
                  <Text label="Detalle" value={h.detail} onChange={(v) => up({ detail: v })} multiline />
                  <Select label="Color" value={h.accent} options={['accent', 'green', 'amber', 'violet']} onChange={(v) => up({ accent: v })} />
                </>
              )}
            />
          )}

          {tab === 'mascotas' && (
            <ListEditor
              items={data.pets}
              onChange={(pets) => patch({ pets })}
              create={() => ({ id: uid('pet'), name: '', breed: '', emoji: '🐶', bio: '' })}
              title={(p) => `${p.emoji} ${p.name}`}
              render={(p, up) => (
                <>
                  <div className="grid grid-cols-[5rem_1fr] gap-4">
                    <Text label="Emoji" value={p.emoji} onChange={(v) => up({ emoji: v })} />
                    <Text label="Nombre" value={p.name} onChange={(v) => up({ name: v })} />
                  </div>
                  <Text label="Raza" value={p.breed} onChange={(v) => up({ breed: v })} />
                  <Text label="Bio" value={p.bio} onChange={(v) => up({ bio: v })} multiline />
                </>
              )}
            />
          )}

          {tab === 'ingles' && (
            <TranslationEditor data={data} onChange={(en) => patch({ translations: { ...data.translations, en } })} />
          )}

          {tab === 'json' && (
            <div className="grid gap-4">
              <p className="text-sm text-fg-muted">Edita el documento completo. Útil para importar/exportar o pegar datos en bloque.</p>
              <textarea
                className="field min-h-[28rem] font-mono text-sm"
                value={json || JSON.stringify(data, null, 2)}
                onChange={(e) => setJson(e.target.value)}
                spellCheck={false}
              />
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    try {
                      const parsed = JSON.parse(json || JSON.stringify(data)) as PortfolioData
                      setData(parsed)
                      setDirty(true)
                      setJson('')
                      setStatus('JSON aplicado (recuerda Publicar)')
                    } catch (e) {
                      setStatus(`JSON inválido: ${(e as Error).message}`)
                    }
                  }}
                  className="rounded-full bg-surface-2 px-5 py-2 text-sm font-semibold hover:bg-border"
                >
                  Aplicar JSON
                </button>
                <button
                  onClick={() => {
                    setData(seed)
                    setDirty(true)
                    setJson('')
                  }}
                  className="rounded-full border border-border px-5 py-2 text-sm text-fg-muted hover:text-danger"
                >
                  Restaurar semilla
                </button>
              </div>
            </div>
          )}

          {tab === 'ajustes' && <PinHashHelper />}
        </div>
      </div>
    </div>
  )
}

/** Cambia el PIN guardado en Firestore (config/admin.pinHash). */
function PinHashHelper() {
  const [pin, setPinValue] = useState('')
  const [confirm, setConfirm] = useState('')
  const [msg, setMsg] = useState<string | null>(null)
  return (
    <div className="grid max-w-xl gap-4">
      <h2 className="text-lg font-semibold">Cambiar el PIN</h2>
      <p className="text-sm text-fg-muted">
        El PIN se guarda como hash SHA-256 en Firestore y nunca viaja en el código del sitio. Usa una frase de 8+ caracteres. Solo
        puedes cambiarlo desde una sesión ya desbloqueada.
      </p>
      <Text label="Nuevo PIN" value={pin} onChange={setPinValue} />
      <Text label="Confirmar PIN" value={confirm} onChange={setConfirm} />
      <button
        onClick={async () => {
          if (pin !== confirm) return setMsg('Los PIN no coinciden.')
          const r = await setPin(pin)
          setMsg(r.ok ? 'PIN actualizado ✓' : r.reason ?? 'Error')
          if (r.ok) {
            setPinValue('')
            setConfirm('')
          }
        }}
        disabled={!pin || !confirm}
        className="w-fit rounded-full bg-surface-2 px-5 py-2 text-sm font-semibold hover:bg-border disabled:opacity-40"
      >
        Guardar PIN
      </button>
      {msg && <p className="text-sm text-fg-muted">{msg}</p>}
    </div>
  )
}
